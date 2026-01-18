import { DocumentModel } from "../dashboard/document/document.schema.js";
import { MongoClient } from "mongodb";
import RAGService from "./rag.service.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGO_URI);
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db("chatbot");
const chunksCollection = db.collection("chunks");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ChatbotService {
  static async ingestDocument(filename) {
    // 1. Find document in DB
    const document = await DocumentModel.findOne({ fileName: filename });
    if (!document) throw new Error("Document not found");

    // 2. Extract text from file
    const fullText = await this.extractTextFromExistingDoc(filename);

    // 3. Create chunks + embeddings
    await RAGService.ingestDocument(document._id, fullText);
  }

  static async answerQuestionRAG(question) {
  // 1. Create embedding
  const embeddingResp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const questionEmbedding = embeddingResp.data[0].embedding;

  console.log("=> Question:", question);
  console.log("=> Question embedding size:", questionEmbedding.length);

  // 2. Vector search (Atlas only)
  const results = await chunksCollection.aggregate([
    {
      $vectorSearch: {
        index: "embedding_index",
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 100,
        limit: 3
      }
    },
    {
      $project: {
        text: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]).toArray();

  console.log("=> Retrieved chunks:", results.length);

  // 3. Build context
  const context = results.map(r => r.text).join("\n\n");

  if (!context) return "No relevant information found.";

  // 4. Ask LLM with context
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Answer ONLY using the context below:\n\n${context}\n\nQuestion: ${question}`
      }
    ],
    temperature: 0,
  });

  return completion.choices[0].message.content.trim();
}

}

export default ChatbotService;
