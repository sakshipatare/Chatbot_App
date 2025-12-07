import express from "express";
import { authMiddleware } from "../../../middleware/authentication.js";
import HistoryController from "./history.controller.js";

const historyRouter = express.Router();
const controller = new HistoryController();

historyRouter.post("/save", authMiddleware, controller.saveChat); // no need becoz chatbot save automatically
historyRouter.get("/all", authMiddleware, controller.getHistory);
historyRouter.get("/stats", authMiddleware, controller.stats);

export default historyRouter;
