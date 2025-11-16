import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleLogin = async () => {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email, 
        password: password,
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    } 
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 block my-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 block my-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
}