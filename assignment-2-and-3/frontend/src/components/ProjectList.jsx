// src/components/ProjectList.jsx
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { getProjects } from "../api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load projects");
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6">My Projects</h2>

      {error && <div className="text-red-400 mb-4">Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="text-gray-400">No projects yet.</div>
        ) : (
          projects.map((p) => (
            <ProjectCard key={p.id ?? p.title} title={p.title} desc={p.description ?? p.desc} />
          ))
        )}
      </div>
    </div>
  );
}
