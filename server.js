import { connectToDb } from "./utils/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

// ── Start ─────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectToDb();
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
