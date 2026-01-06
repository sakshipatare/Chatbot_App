import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import OpenAI from "openai";
import dotenv from "dotenv";

import { DocumentModel } from "../dashboard/document/document.schema.js";

dotenv.config(); // load env

const uploadsDir = path.join(process.cwd(), "uploads");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ChatbotService {
  // Extract text from all documents
  static async extractTextFromAllDocs() {
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith(".docx"));
    if (!files.length) throw new Error("No .docx files found");

    let allText = "";
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const { value: html } = await mammoth.convertToHtml({ path: filePath });
      const cleanText = html
        .replace(/<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>/gi, "$1")
        .replace(/<\/?[^>]+(>|$)/g, "");
      allText += `\n\n[Document: ${file}]\n${cleanText.trim()}`;
    }
    return allText.trim();
  }

  // Extract text from a single document

//   static async extractTextFromExistingDoc(filename) {
//     const filePath = path.join(uploadsDir, filename);
//     if (!fs.existsSync(filePath)) throw new Error("File not found");

//     const { value: html } = await mammoth.convertToHtml({ path: filePath });
//     return html
//       .replace(/<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>/gi, "$1")
//       .replace(/<\/?[^>]+(>|$)/g, "")
//       .trim();
//   }

static async extractTextFromExistingDoc(filename) {
  // 1. Find document in DB by fileName
  const document = await DocumentModel.findOne({ fileName: filename });

  if (!document) throw new Error("File not found in database");

  // 2. Use filePath stored in DB
  const filePath = path.join(process.cwd(), document.filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("Physical file not found on disk");
  }

  // 3. Extract text
  const { value: html } = await mammoth.convertToHtml({ path: filePath });
  return html
    .replace(/<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>/gi, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

  // Answer question using OpenAI
  static async answerQuestion(text, question) {
    const prompt = `
You are a helpful assistant.
Answer the question using only the information from the following documents.
Include URLs if mentioned.

${text}

Question:
${question}
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or gpt-4 if you have access
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });

      return completion.choices[0].message.content.trim();
    } catch (err) {
      console.error("OpenAI error:", err.message);
      return "AI service is temporarily unavailable. Please try again later.";
    }
  }
}

export default ChatbotService;
