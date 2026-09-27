import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "../consts.js";

export const connectToDb = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(DB_CONNECTION_STRING);
};
