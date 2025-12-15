import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { Save, Edit2, AlertCircle, CheckCircle, Loader } from "lucide-react";
import Dashboard from "../Dashboard";

export default function DetailsPage() {
  const [user, setUser] = useState({});
  const [details, setDetails] = useState({
    websiteName: "",
    websiteURL: "",
    companyName: "",
  });
  const [detailsExist, setDetailsExist] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchDetails = async () => {
      try {
        const res = await axios.get("http://localhost:4000/details/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetails(res.data);
        setDetailsExist(true);
        setIsEditing(false);
      } catch (err) {
        setDetailsExist(false);
        setIsEditing(true);
      }
    };

    fetchUser();
    fetchDetails();
  }, [token]);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      setStatus(null);

      if (detailsExist) {
        const res = await axios.put(
          "http://localhost:4000/details/update",
          details,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDetails(res.data.updated);
        setIsEditing(false);
        setStatus({
          type: "success",
          message: "Details updated successfully!",
        });
      } else {
        const res = await axios.post(
          "http://localhost:4000/details/add",
          details,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDetails(res.data.details);
        setDetailsExist(true);
        setIsEditing(false);
        setStatus({
          type: "success",
          message: "Details added successfully!",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
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
              Dashboard Settings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your website and company information
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-8">

              {/* USER INFO CARD */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  User Information
                </h2>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-medium text-gray-900">
                      {user.name}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* WEBSITE DETAILS CARD */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Website Details
                  </h2>

                  {!isEditing && detailsExist && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Website Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website Name *
                    </label>
                    <input
                      type="text"
                      value={details.websiteName}
                      onChange={(e) =>
                        setDetails({ ...details, websiteName: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? "border-blue-300 bg-white focus:ring focus:ring-blue-200"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="text"
                      value={details.websiteURL}
                      onChange={(e) =>
                        setDetails({ ...details, websiteURL: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? "border-blue-300 bg-white focus:ring focus:ring-blue-200"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={details.companyName}
                      onChange={(e) =>
                        setDetails({ ...details, companyName: e.target.value })
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isEditing
                          ? "border-blue-300 bg-white focus:ring focus:ring-blue-200"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* STATUS MESSAGE */}
                  {status && (
                    <div
                      className={`p-4 rounded-lg flex items-start space-x-3 ${
                        status.type === "success"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                      )}

                      <p
                        className={
                          status.type === "success"
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {status.message}
                      </p>
                    </div>
                  )}

                  {/* BUTTONS */}
                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>
                              {detailsExist ? "Update Details" : "Add Details"}
                            </span>
                          </>
                        )}
                      </button>

                      {detailsExist && (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li>• Use https:// in your full URL</li>
                  <li>• Company name appears in chatbot branding</li>
                  <li>• You can update details anytime</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Account Status
                </h3>
                <p className="text-sm text-gray-700">
                  {detailsExist ? "Details Configured" : "Awaiting Setup"}
                </p>
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
