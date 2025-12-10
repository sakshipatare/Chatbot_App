import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function ScriptPage() {
  const [scriptTag, setScriptTag] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch existing script
  const fetchScript = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/link/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setScriptTag(`<script src="${res.data.widgetUrl}"></script>`);
      }
    } catch (err) {
      console.error("Error fetching script:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Generate new script
  const generateScript = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/link/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScriptTag(res.data.script);
    } catch (err) {
      console.error("Error generating script:", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptTag);
    alert("Script copied!");
  };

  useEffect(() => {
    fetchScript();
  }, [fetchScript]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Widget Script</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!scriptTag ? (
            <button
              onClick={generateScript}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate Script
            </button>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow border">
              <p className="font-medium mb-2">Embed this script in your project:</p>

              {/* Script output */}
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {scriptTag}
              </pre>

              <button
                onClick={copyToClipboard}
                className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Copy Script
              </button>

              <button
                onClick={generateScript}
                className="mt-3 ml-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Regenerate Script
              </button>

              {/* ---------------- Instructions Section ---------------- */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">
                  How to Use the Script
                </h3>

                <p className="text-sm mb-2">
                  Paste the script tag inside the <b>&lt;body&gt;</b> section of your website:
                </p>

                <pre className="bg-gray-200 p-3 rounded text-xs overflow-auto mb-3">
{`<body>
  ...
  ${scriptTag}
</body>`}
                </pre>

                <h4 className="font-semibold text-blue-700">For React Projects:</h4>
                <p className="text-sm">
                  Add it inside: <b>public/index.html</b> just before the closing <b>&lt;/body&gt;</b> tag.
                </p>

                <pre className="bg-gray-200 p-3 rounded text-xs overflow-auto mt-2">
{`<!-- public/index.html -->
<body>
  <div id="root"></div>

  ${scriptTag}
</body>`}
                </pre>

                <h4 className="font-semibold text-blue-700 mt-3">For Next.js:</h4>
                <p className="text-sm">
                  Use the built-in Next.js Script component:
                </p>

                <pre className="bg-gray-200 p-3 rounded text-xs overflow-auto mt-2">
{`import Script from "next/script";

<Script src="${scriptTag.match(/src="([^"]+)"/)[1]}" strategy="afterInteractive" />`}
                </pre>
              </div>
              {/* ---------------------------------------------------------- */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
