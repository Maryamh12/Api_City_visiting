import express       from "express";
import dotenv        from "dotenv";
import cors          from "cors";
import { connectToDb } from "./utils/db.js";
import logger          from "./middleware/logger.js";
import router          from "./router.js";
import errorHandler    from "./middleware/errorHandler.js";
import fallthroughHandler from "./middleware/fallthroughHandler.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Request logging ───────────────────────────────────────────
app.use(logger);

// ── Routes ────────────────────────────────────────────────────
app.use(router);

// ── Error handling (must come after routes) ───────────────────
app.use(errorHandler);
app.use(fallthroughHandler);

// ── Start ─────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectToDb();
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
