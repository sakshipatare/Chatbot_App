import { crawlWebsite } from "./utils/crawler.js";
import ChunkModel from "../chatbot/chunk/chunk.schema.js";
import RAGService from "../chatbot/rag.service.js";
import mongoose from "mongoose";

// Create a schema for storing uploaded website links
import LinkModel from "./scraper.schema.js"; // We'll create this below

export class ScraperService {
  // Scrape a website, create chunks & embeddings, store link
  async scrapeAndStore(url, userId) {
    // Crawl website
    const pages = await crawlWebsite(url);

    // Create link record
    const link = await LinkModel.create({ url, user: userId });

    // Split pages into chunks and store embeddings
    for (const pageText of pages) {
      const chunks = RAGService.splitText(pageText);

      for (const chunk of chunks) {
        const embedding = await RAGService.createEmbedding(chunk);

        await ChunkModel.create({
          text: chunk,
          embedding,
          sourceType: "website",
          sourceUrl: url,
          link: link._id, // associate chunk with link
          user: userId,
        });
      }
    }

    return { success: true, pages: pages.length, linkId: link._id };
  }

  // Get all links uploaded by a user
  async getUserLinks(userId) {
    return LinkModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  // Delete a link by ID and all its associated chunks
  async deleteLink(userId, linkId) {
    const link = await LinkModel.findOne({ _id: linkId, user: userId });
    if (!link) return null;

    // Delete all chunks associated with this link
    await ChunkModel.deleteMany({ link: link._id });

    // Delete the link
    await link.deleteOne();
    return link;
  }
}
