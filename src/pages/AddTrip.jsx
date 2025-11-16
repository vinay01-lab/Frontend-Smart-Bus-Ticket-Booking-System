import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AddTrip() {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fare, setFare] = useState("");

  useEffect(() => {
  fetch(`${API}/api/bus`)
    .then(res => res.json())
    .then(data => setBuses(data));
}, []);

  const handleAdd = async () => {
    await fetch(`${API}/api/admin/add-trip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bus_id: busId, route, date, time, fare })
    });

    alert("Trip Added!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Trip</h2>

      <select
  className="border p-2 block my-2"
  onChange={(e) => setBusId(e.target.value)}
>
  <option value="">Choose Bus</option>
  {buses.map((b) => (
    <option key={b.bus_id || b.id} value={b.bus_id || b.id}>
      {b.bus_no}
    </option>
  ))}
</select>


      <input className="border p-2 block my-2" placeholder="Bangalore → Mysore"
        onChange={(e) => setRoute(e.target.value)} />

      <input type="date" className="border p-2 block my-2"
        onChange={(e) => setDate(e.target.value)} />

      <input type="time" className="border p-2 block my-2"
        onChange={(e) => setTime(e.target.value)} />

      <input className="border p-2 block my-2" placeholder="Fare"
        onChange={(e) => setFare(e.target.value)} />

      <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded">
        Add Trip
      </button>
    </div>
  );
}
