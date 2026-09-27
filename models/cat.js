import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text:      { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const storySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    image:       { type: String, required: true },
    description: { type: String, required: true },
    createdBy:   { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    comments:    [commentSchema],
    likes:       [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const citySchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    text:      { type: String, required: true },
    image:     { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    storys:    [storySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cat", citySchema);
