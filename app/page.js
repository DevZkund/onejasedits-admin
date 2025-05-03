"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Portfolio() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    onLandingPage: "",
    thumbnail: null,
    portfolioImages: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const handlePortfolioImagesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      portfolioImages: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.title || !formData.onLandingPage || !formData.thumbnail) {
      alert("Please fill in all required fields");
      return;
    }

    const body = new FormData();
    body.append("category", formData.category);
    body.append("title", formData.title);
    body.append("onLandingPage", formData.onLandingPage);
    body.append("thumbnail", formData.thumbnail);

    formData.portfolioImages.forEach((file) => {
      body.append("portfolioImages", file);
    });

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8002/api/admin/add-portfolio-data", {
        method: "POST",
        body,
      });

      if (res.ok) {
        alert("Portfolio item uploaded successfully!");
        setFormData({
          category: "",
          title: "",
          onLandingPage: "",
          thumbnail: null,
          portfolioImages: [],
        });
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-semibold mb-6">Add Portfolio Item</h1>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="onLandingPage"
            value={formData.onLandingPage}
            onChange={handleChange}
            placeholder="Show on Landing Page? (yes/no)"
            className="w-full px-3 py-2 border rounded"
          />

          {/* Thumbnail Upload */}
          <div>
            <label
              htmlFor="thumbnail"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Upload Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            {formData.thumbnail && (
              <p className="mt-1 text-sm text-gray-600">{formData.thumbnail.name}</p>
            )}
          </div>

          {/* Portfolio Images Upload */}
          <div>
            <label
              htmlFor="portfolioImages"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Upload Portfolio Images
            </label>
            <input
              type="file"
              id="portfolioImages"
              multiple
              accept="image/*"
              onChange={handlePortfolioImagesChange}
              className="hidden"
            />
            {formData.portfolioImages.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {formData.portfolioImages.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 text-white rounded ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
