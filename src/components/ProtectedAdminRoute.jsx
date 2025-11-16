import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin" replace />;
    }
  } catch (err) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin" replace />;
  }

  return children;
}
