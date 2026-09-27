import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {

    email: { type: String, required: true, unique: true },
   
    userName: { type: String, required: true },
    password: { type: String, required: true },
   
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
