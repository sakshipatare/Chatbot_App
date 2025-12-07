import express from "express";
import multer from "multer";
import DocumentController from "./document.controller.js";
import { authMiddleware } from "../../../middleware/authentication.js";

const documentRouter = express.Router();
const controller = new DocumentController();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload multiple DOCX
documentRouter.post(
  "/upload",
  authMiddleware,
  upload.array("files", 10),
  (req, res) => controller.uploadDocuments(req, res)
);

// Fetch user's documents
documentRouter.get("/my", authMiddleware, (req, res) =>
  controller.getMyDocuments(req, res)
);

// Search
documentRouter.get("/search", authMiddleware, (req, res) =>
  controller.search(req, res)
);

// Delete
documentRouter.delete("/delete/:fileName", authMiddleware, (req, res) =>
  controller.delete(req, res)
);

export default documentRouter;
