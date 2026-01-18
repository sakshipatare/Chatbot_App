import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

//  BULLETPROOF EXPORT
const ChunkModel =
  mongoose.models.Chunk || mongoose.model("Chunk", chunkSchema);

export default ChunkModel;
