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
  onSwap,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-2xl shadow-xl text-white mb-12"
    >
      <h2 className="text-4xl font-bold mb-3">Find Your Perfect Bus</h2>
      <p className="text-white/80 mb-6 text-lg">Live seat tracking • Real-time availability</p>

      <div className="flex flex-wrap gap-6 items-end bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow border border-white/20">

        {/* From */}
        <div className="flex flex-col w-60">
          <label className="text-sm mb-1">From</label>
          <input
            list="from-list"
            className="p-3 rounded-lg text-black shadow"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <datalist id="from-list">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* Swap */}
        <button
          onClick={onSwap}
          className="bg-white text-black px-4 py-3 rounded-full shadow hover:scale-105 transition"
        >
          ⇄
        </button>

        {/* To */}
        <div className="flex flex-col w-60">
          <label className="text-sm mb-1">To</label>
          <input
            list="to-list"
            className="p-3 rounded-lg text-black shadow"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <datalist id="to-list">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* Date */}
        <div className="flex flex-col w-60">
          <label className="text-sm mb-1">Date</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="p-3 rounded-lg text-black shadow w-full"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        {/* Search */}
        <button
          onClick={onSearch}
          className="bg-white text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
        >
          Search Buses
        </button>
      </div>
    </motion.div>
  );
}
