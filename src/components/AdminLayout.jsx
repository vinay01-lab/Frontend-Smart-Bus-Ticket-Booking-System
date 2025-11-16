import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBusAlt,
  FaPlusCircle,
  FaThList,
  FaHome,
  FaSignOutAlt,
  FaChartLine,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = () => {
    // simple client-side logout; extend if you add auth
    navigate("/admin");
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      {/* SIDEBAR */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700 flex items-center justify-between">
          <span>{collapsed ? "A" : "Admin Panel"}</span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title="Collapse sidebar"
            className="text-sm opacity-80 hover:opacity-100"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="mt-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaHome />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/add-bus"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaBusAlt />
            {!collapsed && <span>Add Bus</span>}
          </NavLink>

          <NavLink
            to="/admin/add-trip"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaPlusCircle />
            {!collapsed && <span>Add Trip</span>}
          </NavLink>

          <NavLink
            to="/admin/view-trips"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaThList />
            {!collapsed && <span>View Trips</span>}
          </NavLink>

          <NavLink
            to="/admin/view-buses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaBusAlt />
            {!collapsed && <span>View Buses</span>}
          </NavLink>

          <NavLink
            to="/admin/view-trips"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded ${isActive ? "bg-blue-500" : "hover:bg-gray-700"}`
            }
          >
            <FaChartLine />
            {!collapsed && <span>Analytics</span>}
          </NavLink>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-3 px-4 py-3 mt-4 w-full text-left hover:bg-gray-700"
          >
            {dark ? <FaSun /> : <FaMoon />}
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 w-full text-left bg-red-600 hover:bg-red-500 rounded"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
