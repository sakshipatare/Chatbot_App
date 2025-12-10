import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, mostAsked: [] });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------- FIXED: useCallback now includes token + await is added ----------
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/history/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.log("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/history/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  }, [token]);

  // ---------- FIXED: useEffect now includes dependencies ----------
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [fetchHistory, fetchStats]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>

      <div className="bg-white shadow p-4 rounded-xl border mb-6">
        <h2 className="text-lg font-semibold mb-2">Chat Stats</h2>
        <p><strong>Total Queries:</strong> {stats.totalQueries}</p>

        <h3 className="font-medium mt-3">Top 5 Most Asked Questions</h3>
        {stats.mostAsked.length === 0 ? (
          <p className="text-gray-500 text-sm">No questions yet.</p>
        ) : (
          <ul className="list-disc ml-5 mt-2">
            {stats.mostAsked.map((q, idx) => (
              <li key={idx}>
                {q._id} <span className="text-gray-500">(x{q.count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white shadow p-4 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Your Conversations</h2>

        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-sm">No chat history yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p>
                  <strong>Q:</strong> {item.question}
                </p>
                <p className="mt-1">
                  <strong>A:</strong> {item.answer}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
