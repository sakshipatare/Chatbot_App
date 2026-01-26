import { useState, useEffect, useCallback  } from "react";
import { Trash2, Loader, CheckCircle, AlertCircle,FileText, Bot, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard";

export default function WebsiteLink() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [status, setStatus] = useState(null);
  const [newUrl, setNewUrl] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all links
  const fetchLinks = useCallback(async () => {
  try {
    setLoading(true);
    const res = await fetch("http://localhost:4000/scraper/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setLinks(data);
    } else {
      throw new Error("Failed to fetch links");
    }
  } catch (err) {
    console.error(err);
    setStatus({ type: "error", message: err.message });
  } finally {
    setLoading(false);
  }
}, [token]); // only depends on token

useEffect(() => {
  fetchLinks();
}, [fetchLinks]);

  // Add new URL
  const handleAddLink = async () => {
    if (!newUrl.trim()) {
      setStatus({ type: "error", message: "Please enter a URL" });
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:4000/scraper/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "URL added successfully!" });
        setNewUrl("");
        fetchLinks();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to add URL");
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    setDeleting(id);
    setStatus(null);

    try {
      const res = await fetch(`http://localhost:4000/scraper/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setStatus({ type: "success", message: "URL deleted successfully!" });
        fetchLinks();
      } else {
        throw new Error("Failed to delete URL");
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
    } finally {
      setDeleting(null);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Dashboard />
    
          <div className="pt-29 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Website Links
                </h1>
                <p className="text-lg text-gray-600">
                  Add, manage, and delete your website links for chatbot knowledge
                </p>
              </div>

          {status && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                status.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={
                  status.type === "success" ? "text-green-700" : "text-red-700"
                }
              >
                {status.message}
              </p>
            </div>
          )}


          {/* Add URL */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Website Link</h2>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="Enter website URL..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <button
                onClick={handleAddLink}
                disabled={uploading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? <Loader className="w-5 h-5 animate-spin" /> : "Add URL"}
              </button>
            </div>
          </div>

          {/* List of Links */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Links</h2>

            {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600">Loading documents...</p>
                    </div>
                  </div>
                ): links.length === 0 ? (
              <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                No links added yet.
              </p>
              <p className="text-gray-400 mt-2">
                      Start by uploading your first Link
                    </p>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link._id}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <LinkIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{link.url}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {link.createdAt
                            ? new Date(link.createdAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDelete(link._id)}
                        disabled={deleting === link._id}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        {deleting === link._id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
