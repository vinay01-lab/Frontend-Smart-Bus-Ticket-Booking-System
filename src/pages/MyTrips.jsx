import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";

const API = import.meta.env.VITE_API_URL;

export default function MyTrips() {
  const user = getUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`${API}/api/booking/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>

      {bookings.length === 0 && (
        <p className="text-gray-600">No bookings yet.</p>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div className="border p-4 rounded-lg shadow" key={b.id}>
            <h2 className="font-bold text-lg">
              {b.route}
            </h2>

            <p>Date: {b.date}</p>
            <p>Time: {b.time}</p>
            <p>Seat: {b.seat_no}</p>
            <p>Fare Paid: ₹{b.fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
