import { useState, useEffect } from "react";
import io from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket", "polling"],
  withCredentials: false,
});


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

  // ⛔ THIS MUST BE async — your error came from here
  const handleBook = async (seat) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Login required");
      return;
    }

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

    const data = await res.json();

    if (res.ok) {
      alert("Seat booked!");
    } else {
      alert(data.error);
    }
  };

  const getSeatPrice = (baseFare, seatType) => {
    if (seatType === "sleeper") return Math.round(baseFare * 1.35);
    return baseFare;
  };

  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {seats.map((s) => (
        <button
          key={s.seat_no}
          onClick={() => handleBook(s)}
          className={`p-3 rounded text-white ${
            s.status === "booked"
              ? "bg-red-600"
              : s.seat_type === "sleeper"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {s.seat_no}
        </button>
      ))}
    </div>
  );
}
