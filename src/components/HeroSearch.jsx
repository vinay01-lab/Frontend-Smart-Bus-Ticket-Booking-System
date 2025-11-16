import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HeroSearch({
  from,
  to,
  date,
  setFrom,
  setTo,
  setDate,
  suggestions,
  onSearch,
  onSwap
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 rounded-xl shadow-lg mb-10 text-white"
    >
      <h2 className="text-3xl font-bold mb-4">Book Your Bus Tickets</h2>
      <p className="text-white/80 mb-6">Find the best routes with real-time seat availability</p>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col w-48">
          <label className="text-sm mb-1">From</label>
          <input
            list="from-list"
            className="p-2 rounded text-black"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <datalist id="from-list">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={onSwap}
            className="bg-white text-black px-3 py-2 rounded-full mt-7 shadow hover:scale-105 transition"
          >
            ⇄
          </button>
        </div>

        <div className="flex flex-col w-48">
          <label className="text-sm mb-1">To</label>
          <input
            list="to-list"
            className="p-2 rounded text-black"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <datalist id="to-list">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col w-48">
          <label className="text-sm mb-1">Date</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="p-2 rounded text-black"
            dateFormat="dd/MM/yyyy"
            placeholderText="Choose a date"
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={onSearch}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Search
          </button>
        </div>
      </div>
    </motion.div>
  );
}