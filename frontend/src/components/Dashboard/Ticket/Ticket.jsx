import { useEffect, useState, useCallback } from "react";
import {
  AlertCircle, CheckCircle2, Clock, Mail, User, Loader, Ticket as TicketIcon,
  ArrowRight, Filter, Search, Bot
} from "lucide-react";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard";

const Ticket = () => {
  const apiUrl = "http://localhost:4000";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.log("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markDone = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "done" }),
      });

      if (response.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.log("Error updating ticket:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const doneCount = tickets.filter((t) => t.status === "done").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Dashboard />

      <div className="pt-29 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Support Tickets
            </h1>
            <p className="text-lg text-gray-600">
              Manage and track customer support issues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg border border-orange-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-2">Pending Tickets</p>
                  <p className="text-4xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg border border-green-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-2">Completed</p>
                  <p className="text-4xl font-bold">{doneCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg border border-blue-400">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-2">Total Tickets</p>
                  <p className="text-4xl font-bold">{tickets.length}</p>
                </div>
                <TicketIcon className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    filterStatus === "all"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>All</span>
                </button>

                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    filterStatus === "pending"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Pending</span>
                </button>

                <button
                  onClick={() => setFilterStatus("done")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    filterStatus === "done"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="flex flex-col items-center space-x-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600 mt-4">Loading tickets...</p>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Tickets Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "There are no support tickets at the moment"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === ticket._id ? null : ticket._id)
                    }
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg ${
                            ticket.status === "pending"
                              ? "bg-gradient-to-br from-orange-500 to-red-600"
                              : "bg-gradient-to-br from-green-500 to-emerald-600"
                          }`}
                        >
                          {ticket.status === "pending" ? (
                            <Clock className="w-6 h-6" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">
                            {ticket.issue}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{ticket.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{ticket.email}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <span
                              className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                                ticket.status === "pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {ticket.status === "pending" ? "Pending" : "Completed"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`ml-4 flex-shrink-0 transform transition-transform ${
                          expandedId === ticket._id ? "rotate-180" : ""
                        }`}
                      >
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  </button>

                  {expandedId === ticket._id && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Issue Details
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {ticket.issue}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">
                            Customer Name
                          </h5>
                          <p className="text-gray-900 font-medium">{ticket.name}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">
                            Email Address
                          </h5>
                          <p className="text-gray-900 font-medium break-all">
                            {ticket.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                              ticket.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            Status: {ticket.status === "pending" ? "Pending" : "Completed"}
                          </span>
                        </div>

                        {ticket.status === "pending" && (
                          <button
                            onClick={() => markDone(ticket._id)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Mark as Done</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ChatBot AI</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering businesses with intelligent AI chatbots
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              2025 ChatBot AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ticket;
