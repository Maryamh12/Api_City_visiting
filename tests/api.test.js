/**
 * API tests. Database calls are replaced with test doubles, so no MongoDB
 * instance is needed: run with `npm test`.
 */
import "./setup.js";

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import app from "../app.js";
import Cat from "../models/cat.js";
import User from "../models/user.js";
import { redact } from "../middleware/logger.js";
import { escapeRegex, pick } from "../utils/pick.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ── Helpers ───────────────────────────────────────────────────

const makeUser = (overrides = {}) => {
  const _id = new mongoose.Types.ObjectId();
  return { _id, id: _id.toString(), userName: "alice", email: "alice@example.com", role: "user", ...overrides };
};

const tokenFor = (user, options = { expiresIn: "1h" }) => jwt.sign({ id: user.id }, "test-secret", options);

/** Make the auth middleware find `user` when it looks up the token's id. */
const loginAs = (t, user) => {
  t.mock.method(User, "findById", () => ({ select: async () => user }));
  return { Authorization: `Bearer ${tokenFor(user)}` };
};

/** A real (unsaved) city document containing one story, owned by `owner`. */
const makeCity = (owner) => {
  const city = new Cat({
    name: "Paris",
    text: "City of light",
    image: "https://example.com/paris.jpg",
    createdBy: owner._id,
    storys: [{
      name: "Sunrise",
      image: "https://example.com/sunrise.jpg",
      description: "Early morning at the tower",
      createdBy: owner._id,
      likes: [],
      comments: [],
    }],
  });
  city.save = async () => city;
  return city;
};

// ── Helpers: unit tests ───────────────────────────────────────

describe("helpers", () => {
  test("redact hides passwords and tokens from logs", () => {
    const safe = redact({ email: "a@b.com", password: "secret123", confirmPassword: "secret123", token: "abc" });
    assert.deepEqual(safe, { email: "a@b.com", password: "[REDACTED]", confirmPassword: "[REDACTED]", token: "[REDACTED]" });
  });

  test("escapeRegex makes special characters literal", () => {
    assert.equal(escapeRegex("a.*(b)"), "a\\.\\*\\(b\\)");
    assert.ok(new RegExp(escapeRegex("a.*")).test("a.*"));
    assert.ok(!new RegExp(`^${escapeRegex("a.*")}$`).test("abc"));
  });

  test("pick keeps only allowed fields", () => {
    assert.deepEqual(pick({ name: "x", createdBy: "hacker", likes: [] }, ["name", "text"]), { name: "x" });
  });

  test("server refuses to start in production without JWT_SECRET", () => {
    const env = { ...process.env, NODE_ENV: "production" };
    delete env.JWT_SECRET;
    // Run from a temp folder so a local .env file is not picked up
    const result = spawnSync(process.execPath, ["-e", `import(${JSON.stringify(path.join(ROOT, "consts.js"))})`], {
      cwd: os.tmpdir(), env, encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /JWT_SECRET environment variable must be set/);
  });
});

// ── Routing and validation ────────────────────────────────────

describe("routing and validation", () => {
  test("unknown route returns 404", async () => {
    const res = await request(app).get("/no-such-route");
    assert.equal(res.status, 404);
  });

  test("invalid JSON body returns 400", async () => {
    const res = await request(app).post("/login").set("Content-Type", "application/json").send("{bad json");
    assert.equal(res.status, 400);
  });

  test("register rejects short passwords", async () => {
    const res = await request(app).post("/register")
      .send({ userName: "alice", email: "alice@example.com", password: "short", confirmPassword: "short" });
    assert.equal(res.status, 400);
  });

  test("register rejects attempts to set a role", async () => {
    const res = await request(app).post("/register")
      .send({ userName: "alice", email: "alice@example.com", password: "password123", confirmPassword: "password123", role: "admin" });
    assert.equal(res.status, 400);
  });

  test("login without a password returns 400, not a server error", async () => {
    const res = await request(app).post("/login").send({ email: "alice@example.com" });
    assert.equal(res.status, 400);
  });
});

// ── Authentication ────────────────────────────────────────────

describe("authentication", () => {
  test("register stores a bcrypt hash, never the plain password", async (t) => {
    t.mock.method(User, "findOne", async () => null);
    let saved;
    t.mock.method(User, "create", async (doc) => { saved = doc; return doc; });

    const res = await request(app).post("/register")
      .send({ userName: "alice", email: "alice@example.com", password: "password123", confirmPassword: "password123" });

    assert.equal(res.status, 201);
    assert.notEqual(saved.password, "password123");
    assert.ok(await bcrypt.compare("password123", saved.password));
    assert.equal(res.body.user.password, undefined);
  });

  test("login with the wrong password returns 401", async (t) => {
    const hash = await bcrypt.hash("password123", 4);
    t.mock.method(User, "findOne", async () => ({ id: "u1", password: hash }));
    const res = await request(app).post("/login").send({ email: "alice@example.com", password: "wrongpass1" });
    assert.equal(res.status, 401);
  });

  test("login with the right password returns a token that expires", async (t) => {
    const hash = await bcrypt.hash("password123", 4);
    t.mock.method(User, "findOne", async () => ({ id: "u1", password: hash }));
    const res = await request(app).post("/login").send({ email: "alice@example.com", password: "password123" });
    assert.equal(res.status, 200);
    const decoded = jwt.verify(res.body.token, "test-secret");
    assert.equal(decoded.id, "u1");
    assert.ok(decoded.exp > decoded.iat);
  });

  test("protected route without a token returns 401", async () => {
    const res = await request(app).post("/cats").send({ name: "X" });
    assert.equal(res.status, 401);
  });

  test("invalid token returns 401", async () => {
    const res = await request(app).post("/cats").set("Authorization", "Bearer not-a-token").send({});
    assert.equal(res.status, 401);
  });

  test("expired token returns 401", async () => {
    const user = makeUser();
    const expired = jwt.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) - 60 }, "test-secret");
    const res = await request(app).post("/cats").set("Authorization", `Bearer ${expired}`).send({});
    assert.equal(res.status, 401);
  });
});

// ── Authorisation and mass assignment ─────────────────────────

describe("cities", () => {
  test("creating a city ignores a createdBy value sent by the client", async (t) => {
    const user = makeUser();
    const headers = loginAs(t, user);
    let created;
    t.mock.method(Cat, "create", async (doc) => { created = doc; return doc; });

    const res = await request(app).post("/cats").set(headers)
      .send({ name: "Rome", text: "Eternal city", image: "x.jpg", createdBy: "someone-else", storys: [{ name: "fake" }] });

    assert.equal(res.status, 201);
    assert.equal(created.createdBy, user.id);
    assert.equal(created.storys, undefined);
  });

  test("a user cannot edit someone else's city", async (t) => {
    const owner = makeUser();
    const other = makeUser({ userName: "bob" });
    const headers = loginAs(t, other);
    t.mock.method(Cat, "findById", async () => makeCity(owner));
    const update = t.mock.method(Cat, "findByIdAndUpdate", async () => ({}));

    const res = await request(app).patch(`/cats/${new mongoose.Types.ObjectId()}`).set(headers).send({ name: "Mine now" });

    assert.equal(res.status, 403);
    assert.equal(update.mock.callCount(), 0);
  });

  test("the owner cannot transfer ownership through an update", async (t) => {
    const owner = makeUser();
    const headers = loginAs(t, owner);
    t.mock.method(Cat, "findById", async () => makeCity(owner));
    let appliedUpdate;
    t.mock.method(Cat, "findByIdAndUpdate", async (id, changes) => { appliedUpdate = changes; return changes; });

    const res = await request(app).patch(`/cats/${new mongoose.Types.ObjectId()}`).set(headers)
      .send({ name: "Paris, France", createdBy: new mongoose.Types.ObjectId().toString() });

    assert.equal(res.status, 200);
    assert.deepEqual(appliedUpdate, { name: "Paris, France" });
  });

  test("a user cannot delete someone else's city", async (t) => {
    const headers = loginAs(t, makeUser({ userName: "bob" }));
    t.mock.method(Cat, "findById", async () => makeCity(makeUser()));
    const remove = t.mock.method(Cat, "findByIdAndDelete", async () => ({}));

    const res = await request(app).delete(`/cats/${new mongoose.Types.ObjectId()}`).set(headers);

    assert.equal(res.status, 403);
    assert.equal(remove.mock.callCount(), 0);
  });

  test("an admin can delete any city", async (t) => {
    const headers = loginAs(t, makeUser({ role: "admin" }));
    t.mock.method(Cat, "findById", async () => makeCity(makeUser()));
    t.mock.method(Cat, "findByIdAndDelete", async () => ({}));

    const res = await request(app).delete(`/cats/${new mongoose.Types.ObjectId()}`).set(headers);
    assert.equal(res.status, 200);
  });
});

describe("stories and comments", () => {
  test("updating a story cannot change its owner or likes", async (t) => {
    const owner = makeUser();
    const headers = loginAs(t, owner);
    const city = makeCity(owner);
    t.mock.method(Cat, "findById", async () => city);
    const story = city.storys[0];
    const intruder = new mongoose.Types.ObjectId();

    const res = await request(app).patch(`/story/${city._id}/${story._id}`).set(headers)
      .send({ name: "Sunset", createdBy: intruder.toString(), likes: [intruder.toString()] });

    assert.equal(res.status, 200);
    assert.equal(story.name, "Sunset");
    assert.equal(story.createdBy.toString(), owner.id);
    assert.equal(story.likes.length, 0);
  });

  test("a user cannot edit someone else's story", async (t) => {
    const owner = makeUser();
    const headers = loginAs(t, makeUser({ userName: "bob" }));
    const city = makeCity(owner);
    t.mock.method(Cat, "findById", async () => city);

    const res = await request(app).patch(`/story/${city._id}/${city.storys[0]._id}`).set(headers).send({ name: "Hacked" });

    assert.equal(res.status, 403);
    assert.equal(city.storys[0].name, "Sunrise");
  });

  test("new stories always belong to the logged-in user", async (t) => {
    const user = makeUser();
    const headers = loginAs(t, user);
    const city = makeCity(makeUser());
    t.mock.method(Cat, "findById", async () => city);

    const res = await request(app).post(`/story/${city._id}`).set(headers)
      .send({ name: "Night walk", image: "n.jpg", description: "Lights", createdBy: "someone-else", likes: ["a", "b"] });

    assert.equal(res.status, 201);
    const added = city.storys[city.storys.length - 1];
    assert.equal(added.createdBy.toString(), user.id);
    assert.equal(added.likes.length, 0);
  });

  test("an empty comment is rejected", async (t) => {
    const headers = loginAs(t, makeUser());
    const res = await request(app).post(`/comment/${new mongoose.Types.ObjectId()}/${new mongoose.Types.ObjectId()}`)
      .set(headers).send({ text: "   " });
    assert.equal(res.status, 400);
  });
});

// ── Search ────────────────────────────────────────────────────

describe("search", () => {
  test("search text is matched literally, not as a regular expression", async (t) => {
    let filter;
    t.mock.method(Cat, "find", async (f) => { filter = f; return [{ name: "Paris" }]; });

    const res = await request(app).post("/search").send({ query: "Par.*" });

    assert.equal(res.status, 200);
    assert.equal(filter.name.$regex, "Par\\.\\*");
  });

  test("non-string or overly long queries are rejected", async () => {
    assert.equal((await request(app).post("/search").send({ query: { $gt: "" } })).status, 400);
    assert.equal((await request(app).post("/search").send({ query: "a".repeat(101) })).status, 400);
  });
});
