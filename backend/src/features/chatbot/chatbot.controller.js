import ChatbotService from "./chatbot.service.js";
import HistoryRepository from "../dashboard/history/history.repository.js";

const historyRepo = new HistoryRepository();

class ChatbotController {
  // Ask from all documents
  static async processQuestionFromAllDocs(req, res) {
    try {
      const { question, widgetUserId } = req.body;

      if (!question) {
        return res.status(400).json({ error: "No question provided" });
      }

      if (!widgetUserId) {
        return res.status(400).json({ message: "Widget userId missing" });
      }

      //  REMOVE req.user checks completely

      const text = await ChatbotService.extractTextFromAllDocs();
      const answer = await ChatbotService.answerQuestion(text, question);

      //  SAVE HISTORY USING WIDGET OWNER ID
      await historyRepo.save({
        userId: widgetUserId,
        question,
        answer,
      });

      return res.json({
        message: "Question processed successfully",
        answer,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process question" });
    }
  }

  // Ask from a single document
  static async processExistingDoc(req, res) {
    try {
      
      const { filename, question } = req.body;
      if (!filename) return res.status(400).json({ error: "No filename provided" });

      const text = await ChatbotService.extractTextFromExistingDoc(filename);
      const answer = question ? await ChatbotService.answerQuestion(text, question) : null;

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      // SAVE HISTORY HERE
      await historyRepo.save({
        userId: req.user._id,
        question,
        answer,
      });

      return res.json({ message: "Document processed successfully", content: text, answer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process document" });
    }
  }
}

export default ChatbotController;
