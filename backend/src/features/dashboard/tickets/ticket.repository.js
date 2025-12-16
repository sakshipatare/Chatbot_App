import Ticket from "./ticket.schema.js";

export default class TicketRepository {
  async createTicket(data) {
    return await Ticket.create(data);
  }

  async getAllTickets() {
    return await Ticket.find().sort({ createdAt: -1 });
  }

  async updateStatus(ticketId, status) {
    return await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
  }

  async getTicketsByUser(userId) {
  return await Ticket.find({ userId }).sort({ createdAt: -1 });
}

}
