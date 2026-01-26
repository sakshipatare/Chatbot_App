import express from "express";
import {
  scrapeWebsiteController,
  getMyLinksController,
  deleteLinkController,
} from "./scraper.controller.js";
import { authMiddleware } from "../../middleware/authentication.js";

const router = express.Router();

// Upload/scrape a link
router.post("/scrape", authMiddleware, scrapeWebsiteController);

// Get all links uploaded by the user
router.get("/my", authMiddleware, getMyLinksController);

// Delete a link by ID
router.delete("/delete/:id", authMiddleware, deleteLinkController);

export default router;
