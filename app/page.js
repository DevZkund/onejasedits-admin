"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function Portfolio() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    onLandingPage: false,
    thumbnail: null,
    portfolioImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      onLandingPage: e.target.value === "true",
    }));
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
    if (
      !formData.category ||
      !formData.title ||
      !formData.description ||
      formData.onLandingPage === null ||
      !formData.thumbnail
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const body = new FormData();
    body.append("category", formData.category);
    body.append("title", formData.title);
    body.append("description", formData.description);
    body.append("onLandingPage", formData.onLandingPage);
    body.append("thumbnail", formData.thumbnail);
    formData.portfolioImages.forEach((file) => {
      body.append("portfolioImages", file);
    });

    if (isEditing && editingId) {
      body.append("id", editingId); // Include ID in body when editing
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/add-portfolio-data`;

      const res = await fetch(url, {
        method: "POST",
        body,
      });

      if (res.ok) {
        alert(
          isEditing
            ? "Portfolio item updated!"
            : "Portfolio item uploaded successfully!"
        );
        resetForm();
        fetchPortfolioItems();
      } else {
        alert("Operation failed.");
      }
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      description: "",
      onLandingPage: false,
      thumbnail: null,
      portfolioImages: [],
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const fetchPortfolioItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/get-portfolio-data`
      );
      const result = await res.json();

      if (result.success) {
        setPortfolioItems(result.data);
      } else {
        setError("Failed to fetch portfolio items.");
      }
    } catch (err) {
      console.error("Error fetching portfolio items:", err);
      setError("An error occurred while fetching portfolio items.");
    } finally {
      setLoading(false);
    }
  };

  const editPortfolioItem = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      category: item.category,
      title: item.title,
      description: item.description,
      onLandingPage: item.onLandingPage,
      thumbnail: null, // Thumbnail ko re-upload karne doge
      portfolioImages: [], // Existing images show nahi kar rahe ho abhi, toh blank rakhna
    });
  };

  const deletePortfolioItem = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/delete-portfolio-data/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Deleted successfully!");
        fetchPortfolioItems();
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-semibold mb-6">
          {isEditing ? "Edit Portfolio Item" : "Add Portfolio Item"}
        </h1>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="1">Videography</option>
            <option value="2">Photography</option>
            <option value="3">Real Estate</option>
            <option value="4">Social Media Handling</option>
          </select>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-3 py-2 border rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-3 py-2 border rounded"
            rows={4}
          />

          <div>
            <p className="mb-1">Show on Landing Page?</p>
            <label className="mr-4">
              <input
                type="radio"
                name="onLandingPage"
                value="true"
                checked={formData.onLandingPage === true}
                onChange={handleRadioChange}
              />{" "}
              True
            </label>
            <label>
              <input
                type="radio"
                name="onLandingPage"
                value="false"
                checked={formData.onLandingPage === false}
                onChange={handleRadioChange}
              />{" "}
              False
            </label>
          </div>

          <div>
            <label
              htmlFor="thumbnail"
              className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Thumbnail Preview:</p>
                <div className="w-40 h-24">
                  <img
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded border"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="portfolioImages"
              className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">
                  Portfolio Image Previews:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-10 gap-3">
                  {formData.portfolioImages.map((file, idx) => (
                    <div
                      key={idx}
                      className="w-24 aspect-square border rounded overflow-hidden shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Portfolio Image ${idx + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 text-white rounded ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Uploading..."
              : isEditing
              ? "Update"
              : "Submit"}
          </button>
        </div>

        <div className="mt-6">
          {loading && <p>Loading portfolio items...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.length > 0 ? (
              portfolioItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded shadow">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.portfolioImages.map((img) => (
                      <img
                        key={img.id}
                        src={img.portfolioImages}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => editPortfolioItem(item)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePortfolioItem(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No portfolio items found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
