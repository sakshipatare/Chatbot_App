import mongoose from "mongoose";
import { detailsSchema } from "./details.schema.js";

export const DetailsModel =
  mongoose.models.Details || mongoose.model("Details", detailsSchema);

export default class DetailsRepository {
  // Save details
  async saveDetails(data) {
    try {
      const newDetails = new DetailsModel(data);
      await newDetails.save();
      return newDetails;
    } catch (err) {
      console.error("Error saving details:", err);
      throw err;
    }
  }

  // Get details by user
  async getDetailsByUserId(userId) {
    try {
      return await DetailsModel.findOne({ userId });
    } catch (err) {
      console.error("Error fetching details:", err);
      throw err;
    }
  }

  // Update details
  async updateDetails(userId, updatedData) {
    try {
      return await DetailsModel.findOneAndUpdate(
        { userId },
        { $set: updatedData },
        { new: true }
      );
    } catch (err) {
      console.error("Error updating details:", err);
      throw err;
    }
  }
}
