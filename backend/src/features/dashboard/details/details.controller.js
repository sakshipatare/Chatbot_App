import DetailsRepository from "./details.repository.js";

export default class DetailsController {
  constructor() {
    this.detailsRepo = new DetailsRepository();
  }

  // ADD DETAILS
  async addDetails(req, res) {
    try {
      const userId = req.user._id;
      const { websiteName, websiteURL, companyName } = req.body;

      const existing = await this.detailsRepo.getDetailsByUserId(userId);
      if (existing) {
        return res.status(400).json({
          message: "Details already submitted. You can update them instead.",
        });
      }

      const details = await this.detailsRepo.saveDetails({
        userId,
        websiteName,
        websiteURL,
        companyName,
      });

      return res.status(201).json({
        message: "Details saved successfully",
        details,
      });
    } catch (err) {
      console.error("Add details error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // GET USER DETAILS
  async getMyDetails(req, res) {
    try {
      const userId = req.user._id;
      const details = await this.detailsRepo.getDetailsByUserId(userId);

      if (!details) {
        return res.status(404).json({ message: "No details found" });
      }

      return res.status(200).json(details);
    } catch (err) {
      console.error("Get details error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // UPDATE DETAILS
  async updateDetails(req, res) {
    try {
      const userId = req.user._id;
      const updatedData = req.body;

      const updated = await this.detailsRepo.updateDetails(userId, updatedData);

      return res.status(200).json({
        message: "Details updated successfully",
        updated,
      });
    } catch (err) {
      console.error("Update details error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
