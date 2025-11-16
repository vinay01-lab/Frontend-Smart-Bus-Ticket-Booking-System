import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import HeroSearch from "../components/HeroSearch";
import Filters from "../components/Filters";
import TripCard from "../components/TripCard";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(null);
  const [routeSuggestions, setRouteSuggestions] = useState([]);
  const [occupancyMap, setOccupancyMap] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [busType, setBusType] = useState("");
  const [weekFares, setWeekFares] = useState([]);

  // Compare feature
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const socketRef = useRef(null);

  // ─────────────────────────────────────────────
  // SOCKET SETUP
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadTrips();
    loadRoutes();

    socketRef.current = io(SOCKET_URL, { transports: ["websocket", "polling"], withCredentials: false });

    socketRef.current.on("booking_update", (payload) => {
      setOccupancyMap((prev) => ({
        ...prev,
        [payload.trip_id]: {
          total: payload.total_seats,
          booked: payload.booked_seats,
        },
      }));
    });

    socketRef.current.on("bus_location_update", (data) => {
      if (trackingBus && data.bus_id === trackingBus.trip_id) {
        setTrackingLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => socketRef.current && socketRef.current.disconnect();
  }, []);

  // ─────────────────────────────────────────────
  // GOOGLE MAPS DISTANCE API
  // ─────────────────────────────────────────────
  const fetchDistance = async (origin, destination) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
          origin
        )}&destinations=${encodeURIComponent(
          destination
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`
      );

      const data = await res.json();

      if (
        data.rows?.[0]?.elements?.[0]?.duration?.value
      ) {
        const seconds = data.rows[0].elements[0].duration.value;
        return Math.round(seconds / 60);
      }
    } catch (err) {
      console.error("Distance API error:", err);
    }

    return 300;
  };

  const addMinutes = (time, mins) => {
    const d = new Date(time);
    d.setMinutes(d.getMinutes() + mins);
    return d;
  };

  // ─────────────────────────────────────────────
  // BUS CATEGORY DETECTION
  // ─────────────────────────────────────────────
  const getBusCategory = (busNo) => {
    const b = busNo.toLowerCase();

    if (b.includes("volvo") || b.includes("v")) return "Volvo";
    if (b.includes("benz") || b.includes("z")) return "Benz";
    if (b.includes("sl") || b.includes("sleeper")) return "Sleeper";

    return "Seater";
  };

  // ─────────────────────────────────────────────
  // ROUTES LOADING
  // ─────────────────────────────────────────────
  const loadRoutes = async () => {
    const res = await fetch(`${API}/api/trips`);
    const data = await res.json();

    const endpoints = new Set();
    data.forEach((t) => {
      if (t.route) {
        const parts = t.route.split("→").map((s) => s.trim());
        if (parts[0]) endpoints.add(parts[0]);
        if (parts[1]) endpoints.add(parts[1]);
      }
    });

    setRouteSuggestions(Array.from(endpoints) || []);
  };

  // ─────────────────────────────────────────────
  // LOAD TRIPS WITH GOOGLE TRAVEL TIME
  // ─────────────────────────────────────────────
  const loadTrips = async () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (date instanceof Date && !isNaN(date))
      params.append("date", date.toISOString().slice(0, 10));

    const url =
      params.toString().length > 0
        ? `${API}/api/trips?${params.toString()}`
        : `${API}/api/trips`;

    const res = await fetch(url);
    const data = await res.json();

    // Calculate REAL travel time for each trip using Google Maps
    const enriched = await Promise.all(
      data.map(async (t) => {
        const [src, dst] = t.route.split("→").map((s) => s.trim());

        const durationMins = await fetchDistance(src, dst);

        const startObj = new Date(`${t.date}T${t.time}`);
        const arrivalObj = addMinutes(startObj, durationMins);

        return {
          ...t,
          src,
          dst,
          durationMins,
          prettyStart: startObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          prettyArrival: arrivalObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          prettyDuration: `${Math.floor(durationMins / 60)}h ${
            durationMins % 60
          }m`,
          category: getBusCategory(t.bus_no),
        };
      })
    );

    setTrips(enriched);

    // OCCUPANCY
    enriched.forEach(async (t) => {
      try {
        const occ = await fetch(
          `${API}/api/trips/${t.trip_id}/occupancy`
        ).then((r) => r.json());

        setOccupancyMap((prev) => ({
          ...prev,
          [t.trip_id]: {
            total: occ.total_seats,
            booked: occ.booked_seats,
          },
        }));
      } catch {}
    });

    loadWeekFares(date || new Date());
  };

  // ─────────────────────────────────────────────
  // WEEK-FARE BAR
  // ─────────────────────────────────────────────
  const loadWeekFares = async (baseDate = new Date()) => {
    const start = new Date(baseDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const dateStr = d.toISOString().slice(0, 10);

      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      params.append("date", dateStr);

      const url = `${API}/api/trips?${params.toString()}`;
      const res = await fetch(url);
      const dayTrips = await res.json();

      const minFare =
        dayTrips.length > 0 ? Math.min(...dayTrips.map((t) => t.fare)) : null;

      days.push({
        date: d,
        label: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        }),
        iso: dateStr,
        fare: minFare,
      });
    }

    setWeekFares(days);
  };

  // ─────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────
  const matchesTimeFilter = (trip) => {
    if (!timeFilter) return true;

    const t = new Date(`${trip.date}T${trip.time}`);
    const hour = t.getHours();

    if (timeFilter === "morning") return hour >= 4 && hour < 12;
    if (timeFilter === "afternoon") return hour >= 12 && hour < 17;
    if (timeFilter === "evening") return hour >= 17 && hour < 21;
    if (timeFilter === "night") return hour >= 21 || hour < 4;

    return true;
  };

  const matchesBusType = (trip) => {
    if (!busType) return true;
    return trip.category.toLowerCase() === busType.toLowerCase();
  };

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortBy === "fare") return a.fare - b.fare;
    if (sortBy === "duration") return a.durationMins - b.durationMins;

    const occA = occupancyMap[a.trip_id] || { total: 40, booked: 0 };
    const occB = occupancyMap[b.trip_id] || { total: 40, booked: 0 };

    if (sortBy === "seats")
      return (occB.total - occB.booked) - (occA.total - occA.booked);

    return 0;
  });

  // ─────────────────────────────────────────────
  // MINI SEAT PREVIEW
  // ─────────────────────────────────────────────
  const miniSeatPreview = (total, booked) => {
    const arr = [];
    for (let i = 1; i <= 20; i++) {
      const isBooked = i <= booked;
      arr.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-sm ${
            isBooked ? "bg-red-500" : "bg-green-500"
          }`}
        />
      );
    }
    return <div className="grid grid-cols-5 gap-1">{arr}</div>;
  };

  const getHeatColor = (pct) => {
    if (pct < 30) return "#10b981";
    if (pct < 60) return "#f59e0b";
    if (pct < 85) return "#f97316";
    return "#ef4444";
  };

  const [trackingBus, setTrackingBus] = useState(null);
  const [trackingLocation, setTrackingLocation] = useState(null);

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="p-6">
      <HeroSearch
        from={from}
        to={to}
        date={date}
        setFrom={setFrom}
        setTo={setTo}
        setDate={setDate}
        suggestions={routeSuggestions}
        onSearch={loadTrips}
        onSwap={() => {
          const f = from;
          setFrom(to);
          setTo(f);
        }}
      />

      <Filters
        sortBy={sortBy}
        setSortBy={setSortBy}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        busType={busType}
        setBusType={setBusType}
      />

      {/* WEEKLY FARE BAR */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {weekFares.map((d, i) => (
          <div
            key={i}
            onClick={() => {
              setDate(new Date(d.iso));
              loadTrips();
            }}
            className="min-w-[80px] cursor-pointer border p-2 rounded text-center hover:bg-blue-100 transition"
          >
            <div className="font-semibold">{d.label}</div>
            <div className="text-sm text-gray-600">
              {d.fare ? `₹${d.fare}` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* TRIP LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrips
          .filter(matchesTimeFilter)
          .filter(matchesBusType)
          .map((t) => {
            const occ = occupancyMap[t.trip_id] || { total: 40, booked: 0 };

            const seatsLeft = occ.total - occ.booked;

            const pct = Math.round((occ.booked / occ.total) * 100);
            const heatColor = getHeatColor(pct);

            return (
              <TripCard
                key={t.trip_id}
                t={{
                  ...t,
                  pct,
                  onCompare: (bus) => {
                    let updated = [...compareList, bus];
                    updated = updated.slice(-2);
                    setCompareList(updated);
                    if (updated.length === 2) setShowCompareModal(true);
                  },
                  onTrack: async (bus) => {
                    // initial load
                    setTrackingBus(bus);

                    const loc = await fetch(
                      `${API}/api/bus-tracking/${bus.bus_id}/location`
                    ).then((r) => r.json());

                    setTrackingLocation(loc);
                  }
                }}
                occ={occ}
                heatColor={heatColor}
                seatsLeft={seatsLeft}
                previewSeats={miniSeatPreview(occ.total, occ.booked)}
              />
            );
          })}
      </div>

      {/* COMPARE MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-4xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Compare Buses</h2>

            <div className="grid grid-cols-2 gap-6">
              {compareList.map((b, i) => (
                <div key={i} className="border p-4 rounded shadow">
                  <h3 className="font-bold text-lg">
                    {b.src} → {b.dst}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {b.prettyStart} → {b.prettyArrival}
                  </p>

                  <p className="mt-2">
                    <b>Duration:</b> {b.prettyDuration}
                  </p>

                  <p>
                    <b>Fare:</b> ₹{b.fare}
                  </p>

                  <p>
                    <b>Bus Type:</b> {b.category}
                  </p>

                  <p>
                    <b>Seats:</b> {occupancyMap[b.trip_id]?.booked}/
                    {occupancyMap[b.trip_id]?.total}
                  </p>

                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${b.pct}%`,
                          background: getHeatColor(b.pct),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowCompareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingBus && trackingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl w-[90%] max-w-3xl h-[500px] relative">
            <button
              lassName="absolute right-4 top-4 text-red-600 font-bold"
              onClick={() => setTrackingBus(null)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-2">
              Tracking Bus #{trackingBus.bus_no}
            </h2>

            <MapContainer
              center={[trackingLocation.lat, trackingLocation.lng]}
              zoom={14}
              style={{ height: "420px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[trackingLocation.lat, trackingLocation.lng]} />
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
