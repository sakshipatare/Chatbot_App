import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ScraperLink", linkSchema);
