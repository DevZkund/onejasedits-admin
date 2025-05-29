"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

export default function About() {
  const [aboutList, setAboutList] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    description: "",
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch About Us info
  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/get-aboutUs-info`);
      if (res.data.success) {
        setAboutList(res.data.data || []);
      } else {
        setStatusMessage("Failed to fetch About Us data");
      }
    } catch (err) {
      console.error("Error fetching:", err);
      setStatusMessage("Error fetching About Us");
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async () => {
    if (!formData.description) {
      alert("Please provide a description");
      return;
    }

    const body = new FormData();
    if (formData.id) body.append("id", formData.id);
    body.append("description", formData.description);
    formData.images.forEach((file) => body.append("images", file));

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/admin/add-aboutUs-info`, body);
      if (res.status === 200) {
        alert(isEditing ? "Updated successfully!" : "Added successfully!");
        setFormData({ id: "", description: "", images: [] });
        setIsEditing(false);
        setStatusMessage("");
        fetchAboutUs();
        document.getElementById("fileUpload").value = "";
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/admin/delete-about-info/${idToDelete}`);
      if (res.status === 200) {
        alert("Deleted successfully!");
        fetchAboutUs();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      id: entry.id,
      description: entry.description,
      images: [],
    });
    setIsEditing(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">Manage About Us</h1>

        {statusMessage && (
          <div className="mb-4 text-red-600 font-medium">{statusMessage}</div>
        )}

        {/* Form */}
        <div className="bg-white p-4 rounded shadow space-y-3 mb-6">
          <h3 className="text-lg font-bold">
            {isEditing ? "Edit" : "Add"} Entry
          </h3>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
          <div>
            <label
              htmlFor="fileUpload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
            >
              Upload Images
            </label>
            <input
              id="fileUpload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.images.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover border rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : isEditing ? "Update" : "Add"}
          </button>
        </div>

        {/* List */}
        {aboutList.map((entry) => (
          <div
            key={entry.id}
            className="bg-gray-100 p-4 rounded shadow mb-4 space-y-2"
          >
            <p className="font-semibold">ID: {entry.id}</p>
            <p>{entry.description}</p>

            {/* Images */}
            <div className="flex flex-wrap gap-2">
              {entry.aboutUsImages.map((img) => (
                <img
                  key={img.id || img.image}
                  src={img.image}
                  alt="About Image"
                  className="w-24 h-24 object-cover border rounded"
                />
              ))}
            </div>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleEdit(entry)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
