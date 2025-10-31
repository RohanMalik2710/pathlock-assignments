import React, { useEffect, useState } from "react";
import axios from "axios";
import { TaskItem } from "./types";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5048/api/tasks";

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
    window.localStorage.setItem("data", JSON.stringify(res.data));
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await axios.post(API_URL, { description: newTask });
    setNewTask("");
    fetchTasks();
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await axios.put(`${API_URL}/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "20px",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.25)",
          padding: "45px 50px",
          width: "520px",
          textAlign: "center",
          animation: "fadeIn 0.6s ease-in-out",
        }}
      >
        <h1
          style={{
            marginBottom: "25px",
            fontWeight: "700",
            color: "#2C2C54",
            letterSpacing: "0.5px",
          }}
        >
          🗂️ Task Manager
        </h1>

        {/* Input Section */}
        <div style={{ display: "flex", marginBottom: "25px" }}>
          <input
            type="text"
            className="form-control"
            style={{
              flex: 1,
              borderRadius: "10px",
              padding: "12px",
              fontSize: "16px",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
              marginRight: "10px",
            }}
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={addTask}
            style={{
              background: "#4A6CF7",
              border: "none",
              color: "white",
              borderRadius: "10px",
              padding: "12px 18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s all ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#3454E1")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#4A6CF7")}
          >
            Add
          </button>
        </div>

        {/* Filter Dropdown */}
        <select
          className="form-select"
          style={{
            width: "65%",
            margin: "0 auto 25px auto",
            borderRadius: "10px",
            padding: "10px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
            fontWeight: "500",
          }}
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "active" | "completed")
          }
        >
          <option value="all">All Tasks</option>
          <option value="active">Active Tasks</option>
          <option value="completed">Completed Tasks</option>
        </select>

        {/* List View */}
        <ul
          className="list-group"
          style={{
            textAlign: "left",
            marginBottom: "25px",
            maxHeight: "260px",
            overflowY: "auto",
            borderRadius: "10px",
          }}
        >
          {filteredTasks.map((t) => (
            <li
              key={t.id}
              className="list-group-item d-flex align-items-center justify-content-between"
              style={{
                marginBottom: "8px",
                borderRadius: "10px",
                background: t.isCompleted ? "#E8F0FE" : "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                transition: "0.2s ease-in-out",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <input
                  type="checkbox"
                  checked={t.isCompleted}
                  onChange={() => toggleTaskCompletion(t.id)}
                  style={{ cursor: "pointer", transform: "scale(1.2)" }}
                />
                <span
                  style={{
                    textDecoration: t.isCompleted ? "line-through" : "none",
                    fontSize: "16px",
                    color: t.isCompleted ? "#888" : "#333",
                    fontWeight: "500",
                  }}
                >
                  {t.description}
                </span>
              </div>
              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  backgroundColor: "#FF5A5A",
                  border: "none",
                  color: "white",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#E04343")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#FF5A5A")
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Table View */}
        {showTable && (
          <div style={{ marginBottom: "25px" }}>
            <table
              className="table table-bordered table-striped"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <thead style={{ background: "#4A6CF7", color: "white" }}>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>{t.description}</td>
                      <td>
                        <span
                          style={{
                            color: t.isCompleted ? "green" : "#E0A800",
                            fontWeight: "600",
                          }}
                        >
                          {t.isCompleted ? "Completed" : "Active"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteTask(t.id)}
                          style={{
                            backgroundColor: "#FF5A5A",
                            border: "none",
                            color: "white",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Toggle Table Button */}
        <button
          className="btn btn-secondary"
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            background: "#6C63FF",
            border: "none",
            padding: "12px 22px",
            transition: "0.3s all ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#5A52E0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#6C63FF")}
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? "Hide Table View" : "Show Table View"}
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
