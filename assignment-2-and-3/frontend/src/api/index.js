// frontend/src/api/index.js
import axios from "axios";

const API_BASE = "http://localhost:5131/api";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// auth
export async function register(username, password) {
  const r = await api.post("/auth/register", { username, password });
  return r.data;
}
export async function login(username, password) {
  const r = await api.post("/auth/login", { username, password });
  return r.data;
}

// projects
export async function fetchProjects() {
  const r = await api.get("/projects");
  return r.data;
}
export async function fetchProject(id) {
  const r = await api.get(`/projects/${id}`);
  return r.data;
}
export async function createProject(title, description) {
  const r = await api.post("/projects", { title, description });
  return r.data;
}
export async function deleteProject(id) {
  const r = await api.delete(`/projects/${id}`);
  return r.data;
}

// tasks (note: dueDate is ISO string)
export async function createTask(projectId, title, dueDate) {
  const r = await api.post(`/tasks/${projectId}`, { title, dueDate });
  return r.data;
}
export async function updateTask(taskId, payload) {
  const r = await api.put(`/tasks/${taskId}`, payload);
  return r.data;
}
export async function toggleTask(taskId) {
  const r = await api.put(`/tasks/${taskId}/toggle`);
  return r.data;
}
export async function deleteTask(taskId) {
  const r = await api.delete(`/tasks/${taskId}`);
  return r.data;
}
export async function fetchTasksForProject(projectId) {
  const r = await api.get(`/tasks/project/${projectId}`);
  return r.data;
}

// scheduler
export async function scheduleProject(projectId, tasksPayload = null) {
  // tasksPayload: optional array of { title, estimatedHours, dueDate, dependencies }
  const r = await api.post(`/projects/v1/${projectId}/schedule`, { tasks: tasksPayload || [] });
  return r.data;
}

export default api;
