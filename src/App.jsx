import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";
import ViewBuses from "./pages/ViewBuses";
import AdminLayout from "./components/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddBus from "./pages/AddBus";
import AddTrip from "./pages/AddTrip";
import ViewTrips from "./pages/ViewTrips";
import TripDetails from "./pages/TripDetails";

export default function App() {
  return (
    <BrowserRouter>
      {window.location.pathname.startsWith("/admin") ? null : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/:tripId" element={<Booking />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route 
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        
        <Route 
          path="/admin/layout"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        />

        <Route 
          path="/admin/add-bus" 
          element={
            <ProtectedAdminRoute>
              <AddBus />
            </ProtectedAdminRoute>
          }
          />

        <Route
          path="/admin/add-trip"
          element={
            <ProtectedAdminRoute>
              <AddTrip />
            </ProtectedAdminRoute>
          }
        />
    
        <Route
          path="/admin/view-trips"
          element={
            <ProtectedAdminRoute>
              <ViewTrips />
            </ProtectedAdminRoute>
          }
        />

        <Route 
          path="/admin/view-buses" 
          element={
            <ProtectedAdminRoute>
              <ViewBuses />
            </ProtectedAdminRoute>
          }
        />

        <Route 
        path="/trip/:tripId" 
        element={
          <ProtectedAdminRoute>
            <TripDetails />
          </ProtectedAdminRoute>
        } 
      />

      </Routes>
    </BrowserRouter>
  );
}