import { ScraperService } from "./scraper.service.js";

const scraperService = new ScraperService();

// POST /scraper/scrape
export const scrapeWebsiteController = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const result = await scraperService.scrapeAndStore(url, req.user._id);

    res.status(200).json({
      message: "Website scraped & added to chatbot knowledge",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET /scraper/my
export const getMyLinksController = async (req, res) => {
  try {
    const links = await scraperService.getUserLinks(req.user._id);
    res.status(200).json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch links" });
  }
};

// DELETE /scraper/delete/:id
export const deleteLinkController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await scraperService.deleteLink(req.user._id, id);

    if (!deleted) return res.status(404).json({ message: "Link not found" });

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete link" });
  }
};
