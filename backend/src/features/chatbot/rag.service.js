import OpenAI from "openai";
import dotenv from "dotenv";
import  ChunkModel  from "../chatbot/chunk/chunk.schema.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class RAGService {
  static async createEmbedding(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }

  static splitText(text, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  static async ingestDocument(documentId, fullText) {
    const chunks = this.splitText(fullText);

    for (const chunk of chunks) {
      const embedding = await this.createEmbedding(chunk);

      await ChunkModel.create({
        documentId,
        text: chunk,
        embedding,
        sourceType: "document",
      });
    }
  }

  static async searchRelevantChunks(questionEmbedding, limit = 5) {
  const results = await ChunkModel.aggregate([
    {
      $vectorSearch: {
        index: "embedding_index",
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 100,
        limit: limit,
        filter: {
          sourceType: { $in: ["document", "website"] }
        }
      },
    },
    {
      $project: {
        text: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  console.log("=> Vector results count:", results.length);

  return results.map(r => r.text);
}

}

export default RAGService;
