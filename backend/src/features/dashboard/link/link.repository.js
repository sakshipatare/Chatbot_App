import LinkModel from "./link.schema.js";

export default class LinkRepository {
  async saveOrUpdate(userId, widgetUrl) {
    return await LinkModel.findOneAndUpdate(
      { userId },
      { widgetUrl },
      { new: true, upsert: true }
    );
  }

  async getLink(userId) {
    return await LinkModel.findOne({ userId });
  }
}
