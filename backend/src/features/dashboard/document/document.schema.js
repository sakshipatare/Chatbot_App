import mongoose from "mongoose";

export const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileText: { type: String, default: "" },

  uploadedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
  },

  uploadedAt: { type: Date, default: Date.now },
});

export const DocumentModel = mongoose.model("Document", documentSchema);
