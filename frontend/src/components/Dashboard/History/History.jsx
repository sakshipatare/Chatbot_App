import { useEffect, useState, useCallback } from "react";
import {
  MessageCircle, TrendingUp, Clock, Zap, Loader, BarChart3,
  AlertCircle, Eye, MessageSquare, Bot
} from "lucide-react";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, mostAsked: [] });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/history/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.log("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/history/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [fetchHistory, fetchStats]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Dashboard />

      <div className="pt-29 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Chat History
            </h1>
            <p className="text-lg text-gray-600">
              Track your conversations and analyze your interaction patterns
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <span>Your Conversations</span>
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="flex flex-col items-center space-y-4">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600">Loading conversations...</p>
                    </div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No chat history yet.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Start a conversation to see it appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item._id}
                        className="group border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === item._id ? null : item._id
                            )
                          }
                          className="w-full text-left p-5 hover:bg-blue-100/20 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 line-clamp-2 text-base">
                                    {item.question}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(item.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <div
                                className={`transform transition-transform ${
                                  expandedId === item._id ? "rotate-180" : ""
                                }`}
                              >
                                <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </button>

                        {expandedId === item._id && (
                          <div className="border-t border-gray-200 bg-white p-5 space-y-4">
                            <div>
                              <div className="flex items-start space-x-2 mb-2">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                  Question
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {item.question}
                              </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                              <div className="flex items-start space-x-2 mb-2">
                                <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-semibold px-3 py-1 rounded-full">
                                  Answer
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                {formatDate(item.createdAt)}
                              </p>
                              <button
                                onClick={() => setExpandedId(null)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                              >
                                Collapse
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Chat Stats</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm mb-2">Total Queries</p>
                    <p className="text-5xl font-bold">{stats.totalQueries}</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-blue-100 text-sm">
                      Average engagement with your chatbot
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Top Questions</span>
                </h3>

                {stats.mostAsked.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No questions recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.mostAsked.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item._id}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (item.count / stats.mostAsked[0].count) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                              {item.count}x
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Insights</span>
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span>
                      {stats.totalQueries > 0
                        ? `You've asked ${stats.totalQueries} questions`
                        : "Start asking questions to build your chat history"}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span>
                      {stats.mostAsked.length > 0
                        ? `Your most asked question was asked ${stats.mostAsked[0].count} times`
                        : "Your interaction patterns will appear here"}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span>
                      Review your conversation history to improve your queries
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
}
