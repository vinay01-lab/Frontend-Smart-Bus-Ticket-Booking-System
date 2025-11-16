import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");      // redirects to login
  };

  return (
    <div className="sidebar bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Admin Menu</h2>

      <ul className="space-y-3">
        <li><a href="/admin/dashboard">Dashboard</a></li>
        <li><a href="/admin/add-bus">Add Bus</a></li>
        <li><a href="/admin/add-trip">Add Trip</a></li>
        <li><a href="/admin/view-trips">View Trips</a></li>

        <li>
          <button 
            onClick={logout}
            className="bg-red-600 px-4 py-2 mt-4 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
