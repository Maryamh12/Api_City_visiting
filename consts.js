import dotenv from "dotenv";
dotenv.config();

export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/citytour";

export const JWT_SECRET = process.env.JWT_SECRET || "citytour_dev_secret_change_in_production";
