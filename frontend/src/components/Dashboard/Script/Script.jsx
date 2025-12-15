import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Copy, Check, RefreshCw, Code2, AlertCircle, Loader, BookOpen, FileCode, Chrome, Package,
  Zap, Shield, Smartphone, Bot
} from "lucide-react";
import Dashboard from "../Dashboard";

export default function ScriptPage() {
  const [scriptTag, setScriptTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("install");

  const token = localStorage.getItem("token");

  const fetchScript = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:4000/link/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.widgetUrl) {
          setScriptTag(`<script src="${data.widgetUrl}"></script>`);
        }
      } else {
        throw new Error("Failed to fetch script");
      }
    } catch (err) {
      console.error("Error fetching script:", err);
      setError("Failed to load your widget script");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generateScript = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:4000/link/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setScriptTag(data.script);
      } else {
        throw new Error("Failed to generate script");
      }
    } catch (err) {
      console.error("Error generating script:", err);
      setError("Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying:", err);
    }
  };

  useEffect(() => {
    fetchScript();
  }, [fetchScript]);

  const extractUrl = (script) => {
    const match = script.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Dashboard />

      <div className="pt-29 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Widget Script
            </h1>
            <p className="text-lg text-gray-600">
              Embed your chatbot widget into any website in seconds
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Loading your widget script...</p>
              </div>
            </div>
          ) : !scriptTag ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Script Generated Yet</h3>
              <p className="text-gray-600 mb-8">Generate your widget script to get started with embedding</p>
              <button
                onClick={generateScript}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <Code2 className="w-5 h-5" />
                <span>Generate Script</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Script Display Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileCode className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">Your Widget Script</h2>
                  </div>
                </div>

                <div className="p-6">
                  {/* Code Block */}
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 mb-6">
                    <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
                      <span className="text-xs font-mono text-gray-400">HTML</span>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm font-medium transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400">
                      <code>{scriptTag}</code>
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      <Copy className="w-5 h-5" />
                      <span>Copy Script</span>
                    </button>

                    <button
                      onClick={generateScript}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Installation Tabs */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("install")}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === "install"
                          ? "border-blue-600 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Package className="w-5 h-5" />
                      <span>HTML Installation</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("react")}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === "react"
                          ? "border-blue-600 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Code2 className="w-5 h-5" />
                      <span>React</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("nextjs")}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === "nextjs"
                          ? "border-blue-600 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Chrome className="w-5 h-5" />
                      <span>Next.js</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "install" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <span>HTML Installation</span>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Add the script tag to the <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">&lt;body&gt;</code> section of your website:
                        </p>

                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                          <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400">
                            <code>{`<body>
                              <!-- Your page content -->

                              ${scriptTag}
                            </body>`}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Tip:</span> Place the script just before the closing <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag for optimal performance.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "react" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <Code2 className="w-5 h-5 text-blue-600" />
                          <span>React Installation</span>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          For React projects, add the script to your <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">public/index.html</code> file:
                        </p>

                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                          <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400">
                            <code>{`<!-- public/index.html -->
                                <body>
                                  <div id="root"></div>

                                  ${scriptTag}
                                </body>`}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-green-900">
                          <span className="font-semibold">Perfect for:</span> Create React App, Vite React, and other React-based frameworks
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "nextjs" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <Chrome className="w-5 h-5 text-blue-600" />
                          <span>Next.js Installation</span>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Use Next.js built-in Script component. Add this to any page:
                        </p>

                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 mb-4">
                          <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400">
                            <code>{`import Script from "next/script";

                                export default function Home() {
                                  return (
                                    <>
                                      {/* Your page content */}

                                      <Script
                                        src="${extractUrl(scriptTag)}"
                                        strategy="afterInteractive"
                                      />
                                    </>
                                  );
                                }`}</code>
                          </pre>
                        </div>

                        <p className="text-gray-600 mb-4">
                          Or add to your root layout:
                        </p>

                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                          <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400">
                            <code>{`// app/layout.jsx
                              import Script from "next/script";

                              export default function RootLayout({ children }) {
                                return (
                                  <html>
                                    <body>
                                      {children}
                                      <Script
                                        src="${extractUrl(scriptTag)}"
                                        strategy="afterInteractive"
                                      />
                                    </body>
                                  </html>
                                );
                              }`}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <p className="text-sm text-indigo-900">
                          <span className="font-semibold">Strategy:</span> We use <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-xs font-mono">afterInteractive</code> to ensure the widget loads after page interaction is possible.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Card */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span>Widget Features</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Fast & Lightweight</h4>
                        <p className="text-sm text-gray-600 mt-1">Optimized for performance with minimal impact on page load time</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Easy Integration</h4>
                        <p className="text-sm text-gray-600 mt-1">Single script tag installation for any website or framework</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Responsive Design</h4>
                        <p className="text-sm text-gray-600 mt-1">Works perfectly on desktop, tablet, and mobile devices</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">No Dependencies</h4>
                        <p className="text-sm text-gray-600 mt-1">Self-contained widget that doesn't conflict with your code</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
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
