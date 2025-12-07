import LinkRepository from "./link.repository.js";

export default class LinkController {
  constructor() {
    this.repo = new LinkRepository();
  }

  generateLink = async (req, res) => {
    try {
      const userId = req.user._id;

      const widgetUrl = `http://localhost:4000/static/widget.js?id=${userId}`;

      const saved = await this.repo.saveOrUpdate(userId, widgetUrl);

      res.status(201).json({
        script: `<script src="${widgetUrl}"></script>`
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  getLink = async (req, res) => {
    try {
      const userId = req.user._id;
      const link = await this.repo.getLink(userId);

      res.status(200).json(link);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  };
}
