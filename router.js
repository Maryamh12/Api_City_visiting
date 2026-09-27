import express         from "express";
import { body }        from "express-validator";
import catController   from "./controllers/catController.js";
import storyController from "./controllers/storyController.js";
import commentController from "./controllers/commentController.js";
import userController  from "./controllers/userController.js";
import auth            from "./middleware/auth.js";
import validate        from "./middleware/validate.js";

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────
router.post(
  "/register",
  body("email").isEmail().withMessage("Must be a valid email"),
  body("role").not().exists().withMessage("Cannot set role directly"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  validate,
  userController.register
);
router.post("/login", userController.login);

// ── Cities ────────────────────────────────────────────────────
router.get("/cats",        catController.getAll);
router.post("/cats",       auth, catController.create);
router.get("/cats/:id",    catController.getIndividual);
router.patch(
  "/cats/:id",
  auth,
  body("_id").not().exists().withMessage("Cannot update _id"),
  validate,
  catController.update
);
router.delete("/cats/:id", auth, catController.remove);

// ── Search ────────────────────────────────────────────────────
router.post("/search", catController.search);

// ── Stories ───────────────────────────────────────────────────
router.post("/story/:catId",             auth, storyController.create);
router.patch("/story/:catId/:storyId",   auth, storyController.update);
router.delete("/story/:catId/:storyId",  auth, storyController.remove);
router.post("/story/:storyId/like",      auth, storyController.liked);

// ── Comments ──────────────────────────────────────────────────
router.post("/comment/:catId/:storyId",  auth, commentController.create);
router.patch(
  "/comment/:catId/:commentId",
  auth,
  body("text").trim().isLength({ min: 1 }).withMessage("Comment cannot be empty"),
  validate,
  commentController.update
);
router.delete("/comment/:catId/:commentId", auth, commentController.remove);

export default router;
