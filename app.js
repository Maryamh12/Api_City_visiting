import express from "express";
import cors    from "cors";
import { CORS_ORIGINS }   from "./consts.js";
import logger             from "./middleware/logger.js";
import router             from "./router.js";
import errorHandler       from "./middleware/errorHandler.js";
import fallthroughHandler from "./middleware/fallthroughHandler.js";

// The Express app is built here (without starting a server) so tests can import it.
const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors(CORS_ORIGINS.length ? { origin: CORS_ORIGINS } : {}));
app.use(express.json({ limit: "100kb" }));

// ── Request logging (passwords are redacted) ──────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(logger);
}

// ── Routes ────────────────────────────────────────────────────
app.use(router);

// ── Error handling (must come after routes) ───────────────────
app.use(errorHandler);
app.use(fallthroughHandler);

export default app;
