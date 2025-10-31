// src/pages/Login.jsx
import React, { useState } from "react";
import { login as apiLogin } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      if (res.token) {
        auth.login(res.token);
        navigate("/");
      } else {
        setError("No token returned");
      }
    } catch (err) {
      setError(err.response?.data || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-indigo-300 mb-4">Login</h2>

        {error && <div className="text-red-400 mb-3">{String(error)}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full p-3 rounded bg-gray-900 outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <input
            className="w-full p-3 rounded bg-gray-900 outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded text-white font-medium"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-gray-400 mt-3">
          Don't have an account? <Link to="/register" className="text-indigo-300">Register</Link>
        </div>
      </div>
    </div>
  );
}
