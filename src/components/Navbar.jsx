import { Link } from "react-router-dom";
import { logoutUser, getUser } from "../utils/auth";

export default function Navbar() {
  const user = getUser();

  return (
    <nav className="navbar bg-white shadow sticky top-0 z-50 px-6">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          SmartBus
        </Link>
      </div>

      <div className="flex-none gap-4">
        <Link className="hover:text-blue-600" to="/">Home</Link>
        <Link className="hover:text-blue-600" to="/admin">Admin</Link>

        {!user && (
          <>
            <Link className="btn btn-sm btn-outline" to="/login">Login</Link>
            <Link className="btn btn-sm btn-primary" to="/register">Register</Link>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Hi, {user.name}</span>

            <button
              onClick={logoutUser}
              className="btn btn-sm btn-error text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
