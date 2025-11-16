import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    fetch(`${API}/api/bookings/user/${user.id}`)
      .then((r) => r.json())
      .then(setTrips);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>

      {trips.length === 0 && (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}

      <div className="grid gap-4">
        {trips.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold">{t.route}</h2>
                <div className="text-gray-500">{t.date} • {t.time}</div>
              </div>
              <div className="text-right">
                <div>Seat: <b>{t.seat_no}</b></div>
                <div>Paid: <b>₹{t.fare}</b></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
