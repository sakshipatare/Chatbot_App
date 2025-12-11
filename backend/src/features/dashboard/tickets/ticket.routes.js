import { Router } from "express";
import TicketController from "./ticket.controller.js";
import { authMiddleware } from "../../../middleware/authentication.js";

const ticketRouter = Router();
const controller = new TicketController();

// Create ticket (user only enters issue)
ticketRouter.post("/", authMiddleware, (req, res) => controller.createTicket(req, res));

// Get all tickets
ticketRouter.get("/", authMiddleware, (req, res) => controller.getTickets(req, res));

// Update status
ticketRouter.patch("/:id", authMiddleware, (req, res) =>
  controller.updateTicketStatus(req, res)
);

export default ticketRouter;
