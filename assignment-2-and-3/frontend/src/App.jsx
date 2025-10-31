// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-300">Project Manager</div>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-indigo-400">Dashboard</Link>
            <Link to="/login" className="hover:text-indigo-400">Login</Link>
            <Link to="/register" className="hover:text-indigo-400">Register</Link>
          </nav>
        </header>

        <main className="min-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="*" element={<div className="p-6">Not found</div>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
