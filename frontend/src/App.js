import { useEffect, useState, useCallback } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addForm, setAddForm] = useState({ time: "", message: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 🔄 FETCH TASKS
  const fetchTasks = useCallback(() => {
    fetch(`${API}/ui-tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // ➕ ADD TASK
  const handleAddTask = (e) => {
    e.preventDefault();

    fetch(`${API}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addForm),
    }).then(() => {
      setAddForm({ time: "", message: "" });
      fetchTasks();
    });
  };

  // 🗑 DELETE TASK
  const handleDeleteTask = (id) => {
    fetch(`${API}/task/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.TaskId !== id));
        setDeleteConfirm(null);
      })
      .catch((err) => console.error(err));
  };

  // 🔍 SEARCH
  const filteredTasks = tasks.filter(
    (t) =>
      t.TaskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📊 STATS
  const stats = {
    total: tasks.length,
    running: tasks.filter((t) => t.Status === "running").length,
    success: tasks.filter((t) => t.Status === "success").length,
    failed: tasks.filter((t) => t.Status === "failed").length,
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <h1>DASHBOARD</h1>

        {/* ➕ ADD TASK */}
        <form onSubmit={handleAddTask}>
          <input
            placeholder="Cron time (*/5 * * * * *)"
            value={addForm.time}
            onChange={(e) =>
              setAddForm({ ...addForm, time: e.target.value })
            }
          />
          <input
            placeholder="Message"
            value={addForm.message}
            onChange={(e) =>
              setAddForm({ ...addForm, message: e.target.value })
            }
          />
          <button type="submit">Add Task</button>
        </form>

        {/* 🔍 SEARCH */}
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 📊 STATS */}
        <div>
          <p>Total: {stats.total}</p>
          <p>Running: {stats.running}</p>
          <p>Success: {stats.success}</p>
          <p>Failed: {stats.failed}</p>
        </div>

        {/* 📋 TABLE */}
        <table border="1">
          <thead>
            <tr>
              <th>TaskId</th>
              <th>Time</th>
              <th>Message</th>
              <th>Counter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.TaskId}>
                <td>{task.TaskId}</td>
                <td>{task.Time}</td>
                <td>{task.Message}</td>
                <td>{task.Counter}</td>
                <td>{task.Status}</td>
                <td>
                  {deleteConfirm === task.TaskId ? (
                    <>
                      <button onClick={() => handleDeleteTask(task.TaskId)}>
                        Yes
                      </button>
                      <button onClick={() => setDeleteConfirm(null)}>
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(task.TaskId)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;