import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAdminHeaders } from "../utils/adminAuth";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminDashboard() {
  const [busCount, setBusCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);

  const [tripsPerDay, setTripsPerDay] = useState([]);
  const [bookingsPerRoute, setBookingsPerRoute] = useState([]);
  const [revenuePerDay, setRevenuePerDay] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/admin/dashboard`, {
      headers: getAdminHeaders()
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  
  const loadStats = async () => {
    const bus = await fetch(`${API}/api/admin/stats/bus-count`, { headers: getAdminHeaders() }).then(r => r.json());
    const trips = await fetch(`${API}/api/admin/stats/trip-count`, { headers: getAdminHeaders() }).then(r => r.json());
    const bookings = await fetch(`${API}/api/admin/stats/booking-count`, { headers: getAdminHeaders() }).then(r => r.json());
    const today = await fetch(`${API}/api/admin/stats/today-trips`, { headers: getAdminHeaders() }).then(r => r.json());

    const tripsDay = await fetch(`${API}/api/admin/stats/trips-per-day`, { headers: getAdminHeaders() }).then(r => r.json());
    const bookingsRoute = await fetch(`${API}/api/admin/stats/bookings-per-route`, { headers: getAdminHeaders() }).then(r => r.json());
    const revenueDay = await fetch(`${API}/api/admin/stats/revenue-per-day`, { headers: getAdminHeaders() }).then(r => r.json());

    setBusCount(Number(bus.count) || 0);
    setTripCount(Number(trips.count) || 0);
    setBookingCount(Number(bookings.count) || 0);
    setTodayTrips(Number(today.count) || 0);

    setTripsPerDay(tripsDay.map(r => ({ date: r.date?.slice(0, 10), count: Number(r.count || 0) })));
    setBookingsPerRoute(bookingsRoute.map(r => ({ route: r.route, count: Number(r.count || 0) })));
    setRevenuePerDay(revenueDay.map(r => ({ date: r.date?.slice(0, 10), revenue: Number(r.revenue || 0) })));
  };

  return (
    <div className="flex">

      {/* LEFT SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* KPI CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <KPI title="Total Buses" value={busCount} />
          <KPI title="Total Trips" value={tripCount} />
          <KPI title="Total Bookings" value={bookingCount} />
          <KPI title="Today's Trips" value={todayTrips} />
        </div>

        {/* CHARTS */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Trips per Day (last 7 days)</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={tripsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Bookings per Route</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={bookingsPerRoute}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="route" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-6">
            <h3 className="font-semibold mb-2">Revenue per Day</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenuePerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}




