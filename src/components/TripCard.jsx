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
      whileHover={{ scale: 1.03 }}
      className="bg-white p-5 rounded-xl shadow hover:shadow-2xl transition relative group"
    >
      {/* Top section */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold">
            {t.src} → {t.dst}
          </h3>
          <div className="text-gray-500 text-sm">
            {t.prettyDate} • {t.prettyStart} → {t.prettyArrival}
          </div>
          <div className="text-xs text-gray-600">{t.prettyDuration}</div>

          {/* reserved for rating display if you want to plug in later */}
          {t.avgRating && (
            <div className="text-xs text-yellow-600 mt-1">
              {t.avgRating.toFixed(1)} ⭐ ({t.reviewCount} reviews)
            </div>
          )}
        </div>

        <div className="text-right space-y-1">
          <div className="text-xl font-bold">₹{t.fare}</div>

          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded block">
            {t.category}
          </span>

          <div className="text-xs text-gray-500">Bus {t.bus_no}</div>
        </div>
      </div>

      {/* Seat heatmap */}
      <div className="mt-4">
        <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
          <div
            style={{
              width: `${pct}%`,
              background: heatColor,
              height: "100%",
            }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {occ.booked}/{occ.total} seats booked
        </div>
      </div>

      {/* Seat preview on hover */}
      {previewSeats && (
        <div className="absolute right-3 top-3 bg-white shadow-lg p-2 rounded opacity-0 group-hover:opacity-100 transition">
          {previewSeats}
        </div>
      )}

      {/* Fare prediction */}
      {seatsLeft <= 10 && seatsLeft > 0 && (
        <div className="mt-2 text-xs text-orange-600">
          Prices may rise soon
        </div>
      )}

      {seatsLeft === 0 && (
        <div className="mt-2 text-xs text-red-600 font-semibold">
          Sold Out
        </div>
      )}

      {/* Compare / Track / Details / Book */}
      <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => t.onCompare(t)}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg"
          >
            Compare
          </button>

          {t.onTrack && (
            <button
              onClick={() => t.onTrack(t)}
              className="border border-green-600 text-green-600 px-4 py-2 rounded-lg"
            >
              Track
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={`/trip/${t.trip_id}`}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg"
          >
            Details
          </a>
          <a
            href={`/booking/${t.trip_id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Book
          </a>
        </div>
      </div>
    </motion.div>
  );
}
