import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Search, Upload, Trash2 } from "lucide-react";

const Document = () => {
  const apiUrl = "http://localhost:4000";

  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const fileInputRef = useRef(null);

  // ---------------------------
  // FETCH ALL DOCUMENTS
  // ---------------------------
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/documents/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUploadedDocs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, []);

  // ---------------------------
  // FILE SELECT + UPLOAD
  // ---------------------------
  const handleUpload = async () => {
    const files = fileInputRef.current.files;

    if (!files || files.length === 0)
      return alert("Please select at least one DOCX file");

    const formData = new FormData();

    // 👇 backend expects field name: "files"
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${apiUrl}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fileInputRef.current.value = "";
      fetchDocuments();
      alert("Uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  // ---------------------------
  // SEARCH DOCUMENT
  // Backend expects: ?q=
  // ---------------------------
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchDocuments();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiUrl}/documents/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUploadedDocs(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ---------------------------
  // DELETE DOCUMENT
  // ---------------------------
  const handleDelete = async (fileName) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/documents/delete/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDocuments();
      alert("Deleted!");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Document Management
      </h1>

      {/* Search Section */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-8 flex items-center gap-3 border border-gray-100">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Search size={18} /> Search
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Upload Document(s)
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <Upload size={18} /> Upload
          </button>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Uploaded Documents
        </h2>

        {uploadedDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {uploadedDocs.map((doc) => (
              <li
                key={doc._id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {doc.fileName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Uploaded:{" "}
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(doc.fileName)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Document;
