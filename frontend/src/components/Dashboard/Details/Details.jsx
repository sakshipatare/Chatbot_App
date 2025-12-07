import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DetailsPage() {
  const [user, setUser] = useState({});
  const [details, setDetails] = useState({
    websiteName: "",
    websiteURL: "",
    companyName: "",
  });
  const [detailsExist, setDetailsExist] = useState(false); // track if details exist
  const [isEditing, setIsEditing] = useState(false); // track if user can edit
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
        setIsEditing(false); // details fetched, disable editing
      } catch (err) {
        console.log("No details yet");
        setDetailsExist(false);
        setIsEditing(true); // no details yet, allow adding
      }
    };

    fetchUser();
    fetchDetails();
  }, [token]);

  const handleSave = async () => {
    try {
      if (detailsExist) {
        // Update existing details
        const res = await axios.put(
          "http://localhost:4000/details/update",
          details,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Details updated successfully!");
        setDetails(res.data.updated);
        setIsEditing(false); // disable editing after update
      } else {
        // Add new details
        const res = await axios.post(
          "http://localhost:4000/details/add",
          details,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Details added successfully!");
        setDetails(res.data.details);
        setDetailsExist(true);
        setIsEditing(false); // disable editing after add
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // enable editing
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-8">
      {/* USER INFO */}
      <div className="bg-white shadow p-4 rounded-xl border mb-6">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* DETAILS FORM */}
      <div className="bg-white shadow p-6 rounded-xl border">
        <h2 className="text-xl font-semibold mb-4">Website Details</h2>

        <label className="font-medium">Website Name</label>
        <input
          type="text"
          value={details?.websiteName || ""}
          onChange={(e) =>
            setDetails({ ...details, websiteName: e.target.value })
          }
          className="w-full border p-2 rounded mb-4"
          readOnly={!isEditing}
        />

        <label className="font-medium">Website URL</label>
        <input
          type="text"
          value={details?.websiteURL || ""}
          onChange={(e) =>
            setDetails({ ...details, websiteURL: e.target.value })
          }
          className="w-full border p-2 rounded mb-4"
          readOnly={!isEditing}
        />

        <label className="font-medium">Company Name</label>
        <input
          type="text"
          value={details?.companyName || ""}
          onChange={(e) =>
            setDetails({ ...details, companyName: e.target.value })
          }
          className="w-full border p-2 rounded mb-4"
          readOnly={!isEditing}
        />

        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            {detailsExist ? "Update Details" : "Add Details"}
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Edit Details
          </button>
        )}
      </div>
    </div>
  );
}
