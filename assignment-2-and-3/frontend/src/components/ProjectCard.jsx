// src/components/ProjectCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ id, title, desc, onDelete }) {
  const nav = useNavigate();

  return (
    <div className="bg-gradient-to-tr from-[#0b1220] to-[#0f1724] p-6 rounded-2xl shadow-lg border border-gray-800">
      <h3 className="text-xl font-semibold text-indigo-300 mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{desc}</p>
      <div className="flex gap-2">
        {id && (
          <button
            onClick={() => nav(`/projects/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            View Details
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
