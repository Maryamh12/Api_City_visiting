import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/citytour";

// The JWT secret must come from the environment in production.
// The fallback below is only for local development.
if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set in production");
}
export const JWT_SECRET = process.env.JWT_SECRET || "citytour_dev_secret_change_in_production";

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Comma-separated list of allowed frontend origins, e.g.
// CORS_ORIGIN=https://cityvisiting.netlify.app,http://localhost:5173
// When unset, all origins are allowed (convenient for local development).
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);
