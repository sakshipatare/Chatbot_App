import fs from "fs";
import * as mammoth from "mammoth";
import DocumentRepository from "./document.repository.js";

export default class DocumentController {
  constructor() {
    this.repo = new DocumentRepository();
  }

  // Upload DOCX File(s)
  async uploadDocuments(req, res) {
    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ message: "No files uploaded" });

      const uploaded = [];

      for (const file of req.files) {
        const buffer = fs.readFileSync(file.path);
        const { value: extractedText } = await mammoth.extractRawText({
          buffer,
        });

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

        uploaded.push(saved);
      }

      res.status(201).json({
        message: `${uploaded.length} file(s) uploaded successfully`,
        files: uploaded,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading documents" });
    }
  }

  async getMyDocuments(req, res) {
    try {
      const docs = await this.repo.getDocumentsByUser(req.user._id);
      res.json(docs);
    } catch (err) {
      res.status(500).json({ message: "Error fetching documents" });
    }
  }

  async search(req, res) {
    try {
      const q = req.query.q;
      if (!q) return res.status(400).json({ message: "Search query missing" });

      const result = await this.repo.searchDocuments(q, req.user._id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Search failed" });
    }
  }

  async delete(req, res) {
    try {
      const fileName = req.params.fileName;
      if (!fileName)
        return res.status(400).json({ message: "File name required" });

      const file = await this.repo.getDocumentByName(fileName);
      if (!file)
        return res.status(404).json({ message: "File not found" });

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
