import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeatMap from "../components/SeatMap";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadTrip();
    loadReviews();
  }, [tripId]);

  const loadTrip = async () => {
    const res = await fetch(`${API}/api/trips/${tripId}`);
    const data = await res.json();
    setTrip(data);
  };

  const loadReviews = async () => {
    const res = await fetch(`${API}/api/reviews/${tripId}`);
    const data = await res.json();
    setReviews(data);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/reviews/${tripId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setComment("");
    loadReviews();
  };

  if (!trip) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-4 rounded shadow flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {trip.route}
          </h1>
          <div className="text-gray-600">
            {trip.date} • {trip.time}
          </div>
          <div className="mt-2">
            <span className="font-semibold">Bus:</span> {trip.bus_no}
          </div>
          <div className="mt-1">
            <span className="font-semibold">Base Fare:</span> ₹{trip.fare}
          </div>
        </div>

        <div className="text-right">
          {reviews.length > 0 && (
            <>
              <div className="text-lg font-bold">
                {(
                  reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                ).toFixed(1)}{" "}
                ⭐
              </div>
              <div className="text-xs text-gray-500">
                {reviews.length} reviews
              </div>
            </>
          )}
        </div>
      </div>

      {/* Seat map */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Select Seats</h2>
        <SeatMap tripId={tripId} />
      </div>

      {/* Reviews */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>

        <form onSubmit={handleReviewSubmit} className="mb-4 space-y-2">
          <div>
            <label className="text-sm">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-1 ml-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>
          <div>
            <textarea
              className="border p-2 w-full"
              rows={3}
              placeholder="Write your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Submit Review
          </button>
        </form>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-2">
              <div className="text-sm font-semibold">
                {r.rating} ⭐
              </div>
              <div className="text-sm text-gray-700">{r.comment}</div>
              <div className="text-[10px] text-gray-400">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-sm text-gray-500">
              No reviews yet. Be the first to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
