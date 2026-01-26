import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: false, //  website won't have documentId
    },

    sourceType: {
      type: String,
      enum: ["document", "website"],
      required: true,
    },

    sourceUrl: {
      type: String, // website URL
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

const ChunkModel =
  mongoose.models.Chunk || mongoose.model("Chunk", chunkSchema);

export default ChunkModel;
