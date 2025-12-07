import HistoryModel from "./history.schema.js";

export default class HistoryRepository {
  async save(data) {
    const h = new HistoryModel(data);
    return await h.save();
  }

  async getHistory(userId) {
    return await HistoryModel.find({ userId }).sort({ createdAt: -1 });
  }

  async countQueries(userId) {
    return await HistoryModel.countDocuments({ userId });
  }

  async mostAsked(userId) {
    return await HistoryModel.aggregate([
      { $match: { userId } },
      { $group: { _id: "$question", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
  }
}
