"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    designation: "",
    comment: "",
    image: null,
  });

  // Fetch Reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/get-testimonials`
      );
      const data = await res.json();
      console.log("Fetched reviews:", data);
      if (data.success) {
        setReviews(data.testimonials || []);
      } else {
        alert("Failed to load reviews.");
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      alert("Error fetching reviews from the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Add New Review
  const handleAddReview = async () => {
    const { name, designation, comment, image } = newReview;
    if (!name || !designation || !comment || !image) {
      alert("Please fill in all fields including the image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("comment", comment);
    formData.append("testimonialImage", image); // Key must match backend expectation

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/add-testimonials`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        await fetchReviews();
        setNewReview({ name: "", designation: "", comment: "", image: null });
        alert("Review added successfully!");
      } else {
        const errorData = await res.json();
        console.error("Server error:", errorData);
        alert("Failed to add review.");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Something went wrong while adding the review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Review
  const handleDelete = async (index) => {
    const updated = [...reviews];
    updated.splice(index, 1);

    setReviews(updated);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/add-reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews: updated }),
        }
      );

      if (res.ok) {
        alert("Review deleted and updates sent successfully!");
      } else {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        alert("Error submitting reviews after deletion.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review and send updates.");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Reviews</h2>

        {/* Add New Review */}
        <div className="bg-white p-4 rounded shadow space-y-3 mb-6">
          <h3 className="text-lg font-bold">Add New Review</h3>
          <input
            type="text"
            placeholder="Name"
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Designation"
            value={newReview.designation}
            onChange={(e) =>
              setNewReview({ ...newReview, designation: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            placeholder="Comment"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewReview({ ...newReview, image: e.target.files[0] })
            }
            className="w-full px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddReview}
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Submitting..." : "Add to List"}
          </button>
        </div>

        {/* Review List */}
        {loading ? (
          <div className="text-center text-gray-600">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500">No reviews available.</div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review, index) => (
              <li
                key={review.id || `${review.name}-${index}`}
                className="bg-gray-100 p-4 rounded shadow space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {review.testimonialImage && (
                    <img
                      src={review.testimonialImage}
                      alt={`${review.name}'s image`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="w-full px-2 py-1  rounded bg-gray-200
                      cursor-not-allowed">
                      {review.name}
                      
                    </p>

                    <input
                      type="text"
                      value={review.designation}
                      readOnly
                      className="w-full px-2 py-1  rounded bg-gray-200 cursor-not-allowed"
                    />
                    <textarea
                      value={review.comment}
                      readOnly
                      className="w-full px-2 py-1  rounded bg-gray-200 cursor-not-allowed"
                    />
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
