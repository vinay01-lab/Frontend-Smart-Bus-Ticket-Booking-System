import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ViewBuses() {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/bus`)
      .then(res => res.json())
      .then(data => setBuses(data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this bus?")) return;

    const res = await fetch(`${API}/api/bus/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.status === 400) {
      setError(data.error);
      return;
    }

    setBuses(buses.filter(b => b.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Buses</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Bus ID</th>
            <th className="border px-2">Bus No</th>
            <th className="border px-2">Seats</th>
            <th className="border px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((b) => (
            <tr key={b.id}>
              <td className="border px-2">{b.id}</td>
              <td className="border px-2">{b.bus_no}</td>
              <td className="border px-2">{b.total_seats}</td>
              <td className="border px-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
