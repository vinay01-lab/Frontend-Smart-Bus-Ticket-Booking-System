import { useState, useEffect } from "react";
import io from "socket.io-client";
import { getUser } from "../utils/auth";

const API = import.meta.env.VITE_API_URL;

// Production socket connection
const socket = io(API, { transports: ["websocket"] });

export default function SeatMap({ tripId }) {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetchSeats();

    socket.on("seat_update", (data) => {
      if (data.trip_id === tripId) {
        setSeats((prev) =>
          prev.map((s) =>
            s.seat_no === data.seat_no ? { ...s, status: data.status } : s
          )
        );
      }
    });

    return () => socket.off("seat_update");
  }, []);

  const fetchSeats = async () => {
    const res = await fetch(`${API}/api/bus/${tripId}/seats`);
    const data = await res.json();
    setSeats(data);
  };

  const handleBook = async (seat) => {
    const user = getUser();
    if (!user) return alert("Login required");

    const finalFare = getSeatPrice(seat.base_fare, seat.seat_type);

    const res = await fetch(`${API}/api/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        trip_id: tripId,
        seat_no: seat.seat_no,
        fare: finalFare,
      }),
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error);

    alert("Seat booked!");
  };

  const getSeatPrice = (base, type) => {
    if (type === "sleeper") return Math.round(base * 1.35);
    return base;
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Select Your Seat</h2>

      <div className="grid grid-cols-5 gap-3">
        {seats.map((s) => (
          <button
            key={s.seat_no}
            onClick={() => handleBook(s)}
            disabled={s.status === "booked"}
            className={`
              p-3 rounded-lg text-white font-semibold shadow 
              transition-all duration-200 transform hover:scale-105
              ${
                s.status === "booked"
                  ? "bg-red-500 cursor-not-allowed opacity-90"
                  : s.seat_type === "sleeper"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {s.seat_no}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-around text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div> Seater
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div> Sleeper
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div> Booked
        </div>
      </div>
    </div>
  );
}
