import React, { useEffect, useState } from "react";
import axios from "axios";

const Ticket = () => {
  const apiUrl = "http://localhost:4000";

  const [tickets, setTickets] = useState([]);

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${apiUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets(res.data.tickets);
    } catch (err) {
      console.log("Error fetching tickets:", err);
    }
  };

  // Mark Done
  const markDone = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${apiUrl}/tickets/${ticketId}`,
        { status: "done" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTickets(); // refresh after update
    } catch (err) {
      console.log("Error updating ticket:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Raised Tickets</h2>

      <div className="bg-white shadow rounded p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Issue</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td className="p-3 text-center" colSpan="5">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="p-2 border">{ticket.name}</td>
                  <td className="p-2 border">{ticket.email}</td>
                  <td className="p-2 border">{ticket.issue}</td>
                  <td className="p-2 border">
                    {ticket.status === "pending" ? (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Done
                      </span>
                    )}
                  </td>

                  <td className="p-2 border">
                    {ticket.status === "pending" ? (
                      <button
                        onClick={() => markDone(ticket._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Mark Done
                      </button>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ticket;
