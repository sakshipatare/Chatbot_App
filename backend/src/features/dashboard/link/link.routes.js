import express from "express";
import { authMiddleware } from "../../../middleware/authentication.js";
import LinkController from "./link.controller.js";

const linkRouter = express.Router();
const controller = new LinkController();

linkRouter.post("/generate", authMiddleware, controller.generateLink);
linkRouter.get("/me", authMiddleware, controller.getLink);

export default linkRouter;
