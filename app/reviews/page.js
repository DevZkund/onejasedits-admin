"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: "",
    comment: "",
  });

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/client/fetch-reviews`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
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

  // Add new review
  const handleAddReview = async () => {
    const { name, rating, comment } = newReview;
    if (!name || !rating || !comment) {
      alert("Please fill in all fields");
      return;
    }

    const newReviewData = {
      name,
      rating: parseInt(rating),
      comment,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/add-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: [newReviewData] }),
      });

      if (res.ok) {
        await fetchReviews();
        setNewReview({ name: "", rating: "", comment: "" });
        alert("Review added successfully!");
      } else {
        const errorData = await res.json();
        console.error("Server error while adding review:", errorData);
        alert("Failed to add review to the server.");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Something went wrong while adding the review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a review
  const handleDelete = async (index) => {
    const updated = [...reviews];
    updated.splice(index, 1);

    setReviews(updated);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/add-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: updated }),
      });

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
  console.log("Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);


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
            type="number"
            placeholder="Rating (1-5)"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            min={1}
            max={5}
          />
          <textarea
            placeholder="Comment"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
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
                className="bg-gray-100 p-4 rounded shadow space-y-2"
              >
                <input
                  type="text"
                  value={review.name}
                  readOnly
                  className="w-full px-2 py-1 border rounded bg-gray-200 cursor-not-allowed"
                />
                <input
                  type="number"
                  value={review.rating}
                  readOnly
                  className="w-full px-2 py-1 border rounded bg-gray-200 cursor-not-allowed"
                />
                <textarea
                  value={review.comment || review.review}
                  readOnly
                  className="w-full px-2 py-1 border rounded bg-gray-200 cursor-not-allowed"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul> 
        )}
      </div>
    </div>
  );
}
