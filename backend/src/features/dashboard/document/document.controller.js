import fs from "fs";
import * as mammoth from "mammoth";
import DocumentRepository from "./document.repository.js";

//  Chunk + Embedding
import ChunkModel from "../../chatbot/chunk/chunk.schema.js";
import { createEmbedding } from "../../embedding/embedding.service.js";

export default class DocumentController {
  constructor() {
    this.repo = new DocumentRepository();
  }

  // 🔹 Helper: split text into chunks
  splitIntoChunks(text, size = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  //  UPLOAD + CHUNK + EMBED
  async uploadDocuments(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploaded = [];

      for (const file of req.files) {
        console.log(" uploadDocuments API called");

        const buffer = fs.readFileSync(file.path);
        const { value: extractedText } = await mammoth.extractRawText({
          buffer,
        });

        console.log("=> Extracted text length:", extractedText?.length);

        // 1️ Save document
        const saved = await this.repo.saveDocument({
          fileName: file.originalname,
          filePath: file.path,
          fileText: extractedText || "",
          uploadedBy: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
          },
        });

        console.log("=> Document saved with ID:", saved._id);

        // 2️⃣ Chunk + Embeddings
        const chunks = this.splitIntoChunks(extractedText || "");

        console.log("=> Total chunks created:", chunks.length);

        for (const chunkText of chunks) {
          console.log("=> Creating embedding for chunk length:", chunkText.length);

          const embedding = await createEmbedding(chunkText);
          console.log("=> Embedding size:", embedding.length);

          await ChunkModel.create({
            documentId: saved._id,
            text: chunkText,
            embedding,
          });

          console.log("=> Chunk saved for document:", saved._id);
        }

        uploaded.push(saved);
      }

      res.status(201).json({
        message: "Documents uploaded and indexed successfully",
        files: uploaded,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Error uploading documents" });
    }
  }

  //  FETCH USER DOCUMENTS ( THIS WAS MISSING)
  async getMyDocuments(req, res) {
    try {
      const docs = await this.repo.getDocumentsByUser(req.user._id);
      res.json(docs);
    } catch (err) {
      res.status(500).json({ message: "Error fetching documents" });
    }
  }

  //  SEARCH DOCUMENTS
  async search(req, res) {
    try {
      const q = req.query.q;
      if (!q) {
        return res.status(400).json({ message: "Search query missing" });
      }

      const result = await this.repo.searchDocuments(q, req.user._id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Search failed" });
    }
  }

  //  DELETE DOCUMENT
  async delete(req, res) {
    try {
      const fileName = req.params.fileName;

      const file = await this.repo.getDocumentByName(fileName);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }

      await this.repo.deleteDocument(fileName);

      res.json({ message: "File deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting file" });
    }
  }
}
