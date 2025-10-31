// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchProjects, createProject, deleteProject } from "../api";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title required");
    setCreating(true);
    try {
      await createProject(title, desc);
      setTitle("");
      setDesc("");
      await loadProjects();
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete project?")) return;
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-300 mb-4">My Projects</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 rounded bg-gray-900 outline-none"
          placeholder="New project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-1/3 p-3 rounded bg-gray-900 outline-none"
          placeholder="Short description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded text-white" disabled={creating}>
          {creating ? "Creating..." : "Create"}
        </button>
      </form>

      {error && <div className="text-red-400 mb-4">{String(error)}</div>}

      {loading ? (
        <div className="text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-400">No projects yet — create one above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} id={p.id} title={p.title} desc={p.description} onDelete={() => handleDelete(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
