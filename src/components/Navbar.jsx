import { Link } from "react-router-dom";
import { logoutUser, getUser } from "../utils/auth";

export default function Navbar() {
  const user = getUser(); // null if not logged in

  return (
    <nav className="bg-blue-700 text-white p-3 flex justify-between">
      <h1 className="font-bold text-xl">Smart Bus Booking</h1>

      <div className="space-x-4 flex items-center">

        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="text-sm text-gray-200">Hi, {user.name}</span>

            <button
              onClick={logoutUser}
              className="text-red-300 hover:text-red-500 font-semibold ml-2"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
