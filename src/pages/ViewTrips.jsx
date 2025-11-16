import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ViewTrips() {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    trip_id: "",
    route: "",
    date: "",
    time: "",
    fare: ""
  });

  useEffect(() => {
  fetch(`${API}/api/trips`)
    .then(res => res.json())
    .then(data => setTrips(data));
}, []);

const handleDelete = async (tripId) => {
  if (!confirm("Are you sure you want to delete this trip?")) return;

  await fetch(`${API}/api/trips/${tripId}`, {
    method: "DELETE",
  });

  setTrips(trips.filter((t) => t.trip_id !== tripId));
};

const openEdit = (t) => {
  setEditData({
    trip_id: t.trip_id,
    route: t.route,
    date: t.date,
    time: t.time,
    fare: t.fare
  });
  setShowModal(true);
};

const handleSave = async () => {
  await fetch(`${API}/api/trips/${editData.trip_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editData),
  });

  // update frontend instantly
  setTrips(trips.map(t => 
    t.trip_id === editData.trip_id ? { ...t, ...editData } : t
  ));

  setShowModal(false);
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Trips</h2>

      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Trip ID</th>
            <th className="border px-2">Bus No</th>
            <th className="border px-2">Route</th>
            <th className="border px-2">Date</th>
            <th className="border px-2">Time</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((t) => (
            <tr key={t.trip_id}>
              <td className="border px-2">{t.trip_id}</td>
              <td className="border px-2">{t.bus_no}</td>
              <td className="border px-2">{t.route}</td>
              <td className="border px-2">{t.date}</td>
              <td className="border px-2">{t.time}</td>
              <td className="border px-2">
                <button
                  onClick={() => handleDelete(t.trip_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => openEdit(t)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Trip</h2>

            <input
              className="border p-2 block w-full mb-2"
              value={editData.route}
              onChange={(e) => setEditData({ ...editData, route: e.target.value })}
              placeholder="Route (e.g., Bangalore → Mysore)"
            />

            <input
              type="date"
              className="border p-2 block w-full mb-2"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />

            <input
              type="time"
              className="border p-2 block w-full mb-2"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            />

            <input
              type="number"
              className="border p-2 block w-full mb-2"
              value={editData.fare}
              onChange={(e) => setEditData({ ...editData, fare: e.target.value })}
              placeholder="Fare"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
