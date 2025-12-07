import HistoryRepository from "./history.repository.js";

export default class HistoryController {
  constructor() {
    this.repo = new HistoryRepository();
  }

  saveChat = async (req, res) => {
    try {
      const userId = req.user._id;
      const { question, answer } = req.body;

      const saved = await this.repo.save({ userId, question, answer });

      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  getHistory = async (req, res) => {
    try {
      const userId = req.user._id;
      const history = await this.repo.getHistory(userId);
      res.status(200).json(history);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  };

  stats = async (req, res) => {
    try {
      const userId = req.user._id;

      const total = await this.repo.countQueries(userId);
      const top = await this.repo.mostAsked(userId);

      res.status(200).json({ totalQueries: total, mostAsked: top });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  };
}
