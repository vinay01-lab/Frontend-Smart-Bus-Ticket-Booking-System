export default function Filters({ sortBy, setSortBy, timeFilter, setTimeFilter, busType, setBusType }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">

      {/* SORTING */}
      <button
        onClick={() => setSortBy("fare")}
        className={`px-4 py-1 rounded-full border ${
          sortBy === "fare" ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        Price: Low to High
      </button>

      <button
        onClick={() => setSortBy("seats")}
        className={`px-4 py-1 rounded-full border ${
          sortBy === "seats" ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        Seats Available
      </button>

      <button
        onClick={() => setSortBy("time")}
        className={`px-4 py-1 rounded-full border ${
          sortBy === "time" ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        Departure Time
      </button>

      {/* TIME OF DAY FILTERS */}
      <button
        onClick={() => setTimeFilter("morning")}
        className={`px-4 py-1 rounded-full border ${
          timeFilter === "morning" ? "bg-purple-600 text-white" : "bg-white"
        }`}
      >
        Morning (4AM–12PM)
      </button>

      <button
        onClick={() => setTimeFilter("afternoon")}
        className={`px-4 py-1 rounded-full border ${
          timeFilter === "afternoon" ? "bg-purple-600 text-white" : "bg-white"
        }`}
      >
        Afternoon (12PM–5PM)
      </button>

      <button
        onClick={() => setTimeFilter("evening")}
        className={`px-4 py-1 rounded-full border ${
          timeFilter === "evening" ? "bg-purple-600 text-white" : "bg-white"
        }`}
      >
        Evening (5PM–9PM)
      </button>

      <button
        onClick={() => setTimeFilter("night")}
        className={`px-4 py-1 rounded-full border ${
          timeFilter === "night" ? "bg-purple-600 text-white" : "bg-white"
        }`}
      >
        Night (9PM–4AM)
      </button>

      {/* BUS TYPE FILTERS */}
      <button
        onClick={() => setBusType("AC")}
        className={`px-4 py-1 rounded-full border ${
          busType === "AC" ? "bg-green-600 text-white" : "bg-white"
        }`}
      >
        AC
      </button>

      <button
        onClick={() => setBusType("NONAC")}
        className={`px-4 py-1 rounded-full border ${
          busType === "NONAC" ? "bg-green-600 text-white" : "bg-white"
        }`}
      >
        Non-AC
      </button>

      <button
        onClick={() => {
          setSortBy("");
          setTimeFilter("");
          setBusType("");
        }}
        className="px-4 py-1 rounded-full border bg-gray-100"
      >
        Clear
      </button>

      <button
        onClick={() => setBusType("Sleeper")}
        className={`px-4 py-1 rounded-full border ${
            busType === "Sleeper" ? "bg-green-600 text-white" : "bg-white"
        }`}
      >
        Sleeper
      </button>

      <button
        onClick={() => setBusType("Volvo")}
        className={`px-4 py-1 rounded-full border ${
            busType === "Volvo" ? "bg-green-600 text-white" : "bg-white"
        }`}
      >
        Volvo
      </button>

      <button
        onClick={() => setBusType("Benz")}
        className={`px-4 py-1 rounded-full border ${
            busType === "Benz" ? "bg-green-600 text-white" : "bg-white"
        }`}
      >
        Benz
      </button>

    </div>
  );
}
