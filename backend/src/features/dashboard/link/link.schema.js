import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    widgetUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Link ||
  mongoose.model("Link", linkSchema);
