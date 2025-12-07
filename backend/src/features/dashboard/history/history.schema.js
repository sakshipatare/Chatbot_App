import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    question: String,
    answer: String,
  },
  { timestamps: true }
);

export default mongoose.models.History ||
  mongoose.model("History", historySchema);
