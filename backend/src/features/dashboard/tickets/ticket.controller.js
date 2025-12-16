import TicketRepository from "./ticket.repository.js";

const ticketRepo = new TicketRepository();

export default class TicketController {
  async createTicket(req, res) {
    try {
      const { issue } = req.body;

      const userId = req.user._id;
      const name = req.user.name;
      const email = req.user.email;

      const ticket = await ticketRepo.createTicket({
        userId,
        name,
        email,
        issue,
      });

      res.status(201).json({ success: true, ticket });
    } catch (error) {
      res.status(500).json({ message: "Error creating ticket", error });
    }
  }

  async getTickets(req, res) {
  try {
    const userId = req.user._id;

    const tickets = await ticketRepo.getTicketsByUser(userId);

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
}


  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await ticketRepo.updateStatus(id, status);

      res.json({ success: true, updated });
    } catch (error) {
      res.status(500).json({ message: "Error updating ticket", error });
    }
  }
}
