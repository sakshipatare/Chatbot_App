import express from "express";
import ChatbotController from "./chatbot.controller.js";
import { authMiddleware } from "../../middleware/authentication.js";

const router = express.Router();

router.post("/ask", authMiddleware, ChatbotController.processExistingDoc);
router.post("/ask-all", authMiddleware, ChatbotController.processQuestionFromAllDocs);

export default router;
