import express from "express";
import DetailsController from "./details.controller.js";
import { authMiddleware } from "../../../middleware/authentication.js";

const detailsRouter = express.Router();
const controller = new DetailsController();

// Add Details
detailsRouter.post("/add", authMiddleware, (req, res) =>
  controller.addDetails(req, res)
);

// Get logged-in user's details
detailsRouter.get("/me", authMiddleware, (req, res) =>
  controller.getMyDetails(req, res)
);

// Update details
detailsRouter.put("/update", authMiddleware, (req, res) =>
  controller.updateDetails(req, res)
);

export default detailsRouter;
