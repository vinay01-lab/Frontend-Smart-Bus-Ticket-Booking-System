import { motion } from "framer-motion";

export default function TripCard({
  t,
  occ,
  heatColor,
  seatsLeft,
  previewSeats,
}) {
  const pct =
    typeof t.pct === "number"
      ? t.pct
      : Math.round((occ.booked / occ.total) * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition relative group border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {t.src} → {t.dst}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {t.prettyDate} • {t.prettyStart} → {t.prettyArrival}
          </p>

          <p className="text-xs text-gray-600 mt-1">{t.prettyDuration}</p>

          {t.avgRating && (
            <div className="text-xs text-yellow-600 mt-1 font-semibold">
              ⭐ {t.avgRating.toFixed(1)} ({t.reviewCount})
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">₹{t.fare}</div>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded block mt-2">
            {t.category}
          </span>
          <p className="text-xs text-gray-500 mt-1">Bus {t.bus_no}</p>
        </div>
      </div>

      {/* Heat bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="h-full rounded-lg transition-all"
            style={{ width: `${pct}%`, background: heatColor }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {occ.booked}/{occ.total} seats booked
        </p>
      </div>

      {/* Hover seat preview */}
      {previewSeats && (
        <div className="absolute right-3 top-3 bg-white shadow-xl p-2 rounded-xl opacity-0 group-hover:opacity-100 transition">
          {previewSeats}
        </div>
      )}

      {/* Price warning */}
      {seatsLeft <= 10 && seatsLeft > 0 && (
        <p className="text-xs text-orange-600 mt-2">Prices may rise soon</p>
      )}

      {seatsLeft === 0 && (
        <p className="text-xs text-red-600 font-semibold mt-2">Sold Out</p>
      )}

      {/* Buttons */}
      <div className="mt-5 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => t.onCompare(t)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Compare
          </button>

          {t.onTrack && (
            <button
              onClick={() => t.onTrack(t)}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
            >
              Track
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={`/trip/${t.trip_id}`}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Details
          </a>

          <a
            href={`/booking/${t.trip_id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Book
          </a>
        </div>
      </div>
    </motion.div>
  );
}
