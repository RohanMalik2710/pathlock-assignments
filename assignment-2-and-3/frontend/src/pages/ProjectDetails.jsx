// frontend/src/pages/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProject,
  createTask,
  toggleTask,
  deleteTask,
  scheduleProject,
  fetchTasksForProject,
} from "../api";

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = Number(id);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await fetchProject(projectId);
      setProject(p);
      // p.tasks present from backend - but we also support separate task list fetch
      if (p?.tasks) setTasks(p.tasks);
      else {
        const t = await fetchTasksForProject(projectId);
        setTasks(t);
      }
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title required");
    try {
      await createTask(projectId, title, dueDate || null);
      setTitle("");
      setDueDate("");
      await load();
    } catch (err) {
      setError(err.response?.data || err.message || "Add failed");
    }
  };

  const handleToggle = async (task) => {
    try {
      await toggleTask(task.id);
      await load();
    } catch (err) {
      setError(err.response?.data || err.message || "Toggle failed");
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete task?")) return;
    try {
      await deleteTask(taskId);
      await load();
    } catch (err) {
      setError(err.response?.data || err.message || "Delete failed");
    }
  };

  const runScheduler = async () => {
    setScheduling(true);
    setError(null);
    setScheduleResult(null);
    try {
      // send tasks with dueDate and (optionally) dependencies if you add that UI later
      const payload = tasks.map((t) => ({
        title: t.title,
        estimatedHours: 1,
        dueDate: t.dueDate,
        dependencies: [], // enhance later
      }));
      const res = await scheduleProject(projectId, payload);
      setScheduleResult(res.recommendedOrder || []);
    } catch (err) {
      setError(err.response?.data || err.message || "Scheduling failed");
    } finally {
      setScheduling(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!project) return <div className="p-6">Project not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-300 mb-2">{project.title}</h2>
      <p className="text-gray-400 mb-4">{project.description}</p>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="flex-1 p-3 rounded bg-gray-900"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="p-3 rounded bg-gray-900"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="bg-indigo-600 px-4 rounded text-white">Add Task</button>
      </form>

      {error && <div className="text-red-400 mb-3">{String(error)}</div>}

      <div className="space-y-3 mb-6">
        {tasks.length === 0 && <div className="text-gray-400">No tasks</div>}
        {tasks.map((t) => (
          <div key={t.id} className="flex justify-between items-center bg-gray-900 p-3 rounded">
            <div>
              <div className={`${t.isCompleted ? "line-through text-gray-500" : ""}`}>{t.title}</div>
              <div className="text-sm text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No due date"}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleToggle(t)} className="px-3 py-1 bg-green-600 rounded text-sm">
                {t.isCompleted ? "Undo" : "Complete"}
              </button>
              <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick={runScheduler} disabled={scheduling} className="bg-indigo-500 px-4 py-2 rounded">
          {scheduling ? "Scheduling..." : "Run Smart Scheduler"}
        </button>
      </div>

      {scheduleResult && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h4 className="font-semibold text-indigo-200">Recommended Order</h4>
          <ol className="list-decimal ml-5 mt-2 text-gray-200">
            {scheduleResult.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
