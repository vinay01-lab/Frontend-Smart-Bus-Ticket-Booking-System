import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AddBus() {
  const [busNo, setBusNo] = useState("");
  const [seats, setSeats] = useState("");

  const handleAdd = async () => {
    await fetch(`${API}/api/admin/add-bus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bus_no: busNo, total_seats: seats }),
    });

    alert("Bus Added!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Bus</h2>

      <input
        className="border p-2 block my-2"
        placeholder="Bus Number"
        onChange={(e) => setBusNo(e.target.value)}
      />

      <input
        className="border p-2 block my-2"
        placeholder="Total Seats"
        onChange={(e) => setSeats(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white p-2 rounded"
      >
        Add Bus
      </button>
    </div>
  );
}
