import { useEffect, useState, useCallback } from "react";
import "./App.css";

const API = "http://localhost:5000";

/* ── Inline SVG Icons ── */
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 61 66" fill="none">
    <path d="M7.625 33H53.375M7.625 16.5H53.375M7.625 49.5H53.375" stroke="#FF0016" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ color = "#FF0016", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 62 59" fill="none">
    <path d="M31 12.29V46.71M13 29.5H49" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 41 41" fill="none">
    <circle cx="20.5" cy="20.5" r="5.25" stroke="#FF0016" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33.14 25.63a2.44 2.44 0 00.49 2.7l.1.1a2.97 2.97 0 01-4.2 4.2l-.1-.1a2.44 2.44 0 00-2.7-.49 2.44 2.44 0 00-1.48 2.23v.29a2.97 2.97 0 01-5.94 0v-.15a2.44 2.44 0 00-1.6-2.23 2.44 2.44 0 00-2.7.49l-.1.1a2.97 2.97 0 01-4.2-4.2l.1-.1a2.44 2.44 0 00.49-2.7 2.44 2.44 0 00-2.23-1.48h-.29a2.97 2.97 0 010-5.94h.15a2.44 2.44 0 002.23-1.6 2.44 2.44 0 00-.49-2.7l-.1-.1a2.97 2.97 0 014.2-4.2l.1.1a2.44 2.44 0 002.7.49h.14a2.44 2.44 0 001.48-2.23v-.29a2.97 2.97 0 015.94 0v.15a2.44 2.44 0 001.48 2.23 2.44 2.44 0 002.7-.49l.1-.1a2.97 2.97 0 014.2 4.2l-.1.1a2.44 2.44 0 00-.49 2.7v.14a2.44 2.44 0 002.23 1.48h.29a2.97 2.97 0 010 5.94h-.15a2.44 2.44 0 00-2.23 1.48z" stroke="#FF0016" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M8 18L12 14.95L16 18L14.5 13.05L18.5 10.2H13.6L12 5L10.4 10.2H5.5L9.5 13.05L8 18ZM12 22C10.62 22 9.32 21.74 8.1 21.21C6.88 20.69 5.83 19.98 4.93 19.08C4.03 18.18 3.31 17.12 2.79 15.9C2.26 14.68 2 13.38 2 12C2 10.62 2.26 9.32 2.79 8.1C3.31 6.88 4.03 5.83 4.93 4.93C5.83 4.03 6.88 3.31 8.1 2.79C9.32 2.26 10.62 2 12 2C13.38 2 14.68 2.26 15.9 2.79C17.12 3.31 18.18 4.03 19.08 4.93C19.98 5.83 20.69 6.88 21.21 8.1C21.74 9.32 22 10.62 22 12C22 13.38 21.74 14.68 21.21 15.9C20.69 17.12 19.98 18.18 19.08 19.08C18.18 19.98 17.12 20.69 15.9 21.21C14.68 21.74 13.38 22 12 22ZM12 20C14.23 20 16.13 19.23 17.68 17.68C19.23 16.13 20 14.23 20 12C20 9.77 19.23 7.88 17.68 6.33C16.13 4.78 14.23 4 12 4C9.77 4 7.88 4.78 6.33 6.33C4.78 7.88 4 9.77 4 12C4 14.23 4.78 16.13 6.33 17.68C7.88 19.23 9.77 20 12 20Z" fill="#FF0016" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 76 76" fill="none">
    <path d="M50.67 66.5V60.17C50.67 56.81 49.33 53.59 46.96 51.21C44.58 48.83 41.36 47.5 38 47.5H15.83C12.47 47.5 9.25 48.83 6.88 51.21C4.5 53.59 3.17 56.81 3.17 60.17V66.5M72.83 34.83H53.83M39.58 22.17C39.58 29.16 33.91 34.83 26.92 34.83C19.92 34.83 14.25 29.16 14.25 22.17C14.25 15.17 19.92 9.5 26.92 9.5C33.91 9.5 39.58 15.17 39.58 22.17Z" stroke="#FF0016" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 73 69" fill="none">
    <path d="M12.17 54.63V48.88H18.25V28.75C18.25 24.77 19.52 21.25 22.05 18.18C24.59 15.07 27.88 13.03 31.94 12.08V10.06C31.94 8.86 32.37 7.86 33.23 7.04C34.14 6.18 35.23 5.75 36.5 5.75C37.77 5.75 38.83 6.18 39.69 7.04C40.61 7.86 41.06 8.86 41.06 10.06V12.08C45.12 13.03 48.41 15.07 50.95 18.18C53.48 21.25 54.75 24.77 54.75 28.75V48.88H60.83V54.63H12.17ZM36.5 63.25C34.83 63.25 33.38 62.7 32.17 61.6C31 60.45 30.42 59.08 30.42 57.5H42.58C42.58 59.08 41.98 60.45 40.76 61.6C39.59 62.7 38.17 63.25 36.5 63.25ZM24.33 48.88H48.67V28.75C48.67 25.59 47.48 22.88 45.09 20.63C42.71 18.38 39.85 17.25 36.5 17.25C33.15 17.25 30.29 18.38 27.91 20.63C25.53 22.88 24.33 25.59 24.33 28.75V48.88Z" fill="#FF0016" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 68 63" fill="none">
    <path d="M56.67 55.13V49.88C56.67 47.09 55.47 44.42 53.35 42.45C51.22 40.48 48.34 39.38 45.33 39.38H22.67C19.66 39.38 16.78 40.48 14.65 42.45C12.53 44.42 11.33 47.09 11.33 49.88V55.13M45.33 18.38C45.33 24.17 40.26 28.88 34 28.88C27.74 28.88 22.67 24.17 22.67 18.38C22.67 12.58 27.74 7.88 34 7.88C40.26 7.88 45.33 12.58 45.33 18.38Z" stroke="#FF0016" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M32 4V12M16 4V12M6 20H42M10 8H38C40.21 8 42 9.79 42 12V40C42 42.21 40.21 44 38 44H10C7.79 44 6 42.21 6 40V12C6 9.79 7.79 8 10 8Z" stroke="#1734F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M10 6L38 24L10 42V6Z" stroke="#00FF6A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PauseIcon = () => (
  <svg width="26" height="26" viewBox="0 0 42 42" fill="none">
    <path d="M24.5 33.25V8.75H31.5V33.25H24.5ZM10.5 33.25V8.75H17.5V33.25H10.5Z" fill="#FFCC00" />
  </svg>
);

const StopCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44Z" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 18H18V30H30V18Z" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="20" viewBox="0 0 42 44" fill="none">
    <path d="M5.25 10.78H8.75M8.75 10.78H36.75M8.75 10.78V35.95C8.75 36.9 9.12 37.82 9.78 38.49C10.43 39.17 11.32 39.54 12.25 39.54H29.75C30.68 39.54 31.57 39.17 32.22 38.49C32.88 37.82 33.25 36.9 33.25 35.95V10.78M14 10.78V7.19C14 6.24 14.37 5.32 15.03 4.65C15.68 3.97 16.57 3.6 17.5 3.6H24.5C25.43 3.6 26.32 3.97 26.97 4.65C27.63 5.32 28 6.24 28 7.19V10.78" stroke="#FF0016" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    fill="none"
    style={spinning ? { animation: "spin 0.7s linear infinite" } : {}}
  >
    <path d="M30.67 5.33V13.33M30.67 13.33H22.67M30.67 13.33L24.48 7.52C23.05 6.09 21.27 5.04 19.33 4.48C17.38 3.91 15.32 3.85 13.34 4.3C11.37 4.75 9.54 5.69 8.02 7.03C6.51 8.38 5.36 10.09 4.68 12M1.33 26.67V18.67M1.33 18.67H9.33M1.33 18.67L7.52 24.48C8.95 25.91 10.73 26.96 12.67 27.52C14.62 28.09 16.68 28.15 18.66 27.7C20.63 27.25 22.46 26.31 23.98 24.97C25.49 23.62 26.64 21.91 27.32 20" stroke="#D9D9D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 34 34" fill="none">
    <path d="M29.75 29.75L23.59 23.59M26.92 15.58C26.92 21.84 21.84 26.92 15.58 26.92C9.32 26.92 4.25 21.84 4.25 15.58C4.25 9.32 9.32 4.25 15.58 4.25C21.84 4.25 26.92 9.32 26.92 15.58Z" stroke="#D9D9D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  let cls = "status-badge";
  let label = status;
  if (s === "running") { cls += " status-badge--running"; label = "<Running>"; }
  else if (s === "paused") { cls += " status-badge--paused"; label = "<Paused>"; }
  else if (s === "success" || s === "completed") { cls += " status-badge--completed"; label = "<Done>"; }
  else if (s === "failed") { cls += " status-badge--failed"; label = "<Failed>"; }
  else { cls += " status-badge--running"; label = `<${status}>`; }
  return <span className={cls}>{label}</span>;
}

/* ── Main App ── */
function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addForm, setAddForm] = useState({ time: "", message: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  /* ── Fetch Tasks ── */
  const fetchTasks = useCallback((showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    fetch(`${API}/ui-tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => { if (showSpinner) setTimeout(() => setIsRefreshing(false), 600); });
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  /* ── Add Task ── */
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!addForm.time.trim() || !addForm.message.trim()) {
      setFormStatus({ type: "error", msg: "Both fields are required." });
      return;
    }
    fetch(`${API}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    })
      .then(() => {
        setAddForm({ time: "", message: "" });
        setFormStatus({ type: "success", msg: "Task scheduled successfully!" });
        fetchTasks();
        setTimeout(() => { setFormStatus(null); setActiveView("dashboard"); }, 1500);
      })
      .catch(() => setFormStatus({ type: "error", msg: "Failed to add task. Is the server running?" }));
  };

  /* ── Delete Task ── */
  const handleDeleteTask = (id) => {
    fetch(`${API}/task/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.TaskId !== id));
        setDeleteConfirm(null);
      })
      .catch((err) => console.error(err));
  };

  /* ── Filtered Tasks ── */
  const filteredTasks = tasks.filter(
    (t) =>
      t.TaskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Stats ── */
  const stats = {
    total: tasks.length,
    running: tasks.filter((t) => (t.Status || "").toLowerCase() === "running").length,
    paused: tasks.filter((t) => (t.Status || "").toLowerCase() === "paused").length,
    completed: tasks.filter((t) => ["success", "completed", "failed"].includes((t.Status || "").toLowerCase())).length,
  };

  /* ── Sidebar ── */
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <MenuIcon /> },
    { id: "add", label: "Add Task", icon: <PlusIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
    { id: "about", label: "About", icon: <StarIcon /> },
  ];

  /* ── Views ── */
  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <DashboardView
        stats={stats}
        filteredTasks={filteredTasks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isRefreshing={isRefreshing}
        fetchTasks={fetchTasks}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        handleDeleteTask={handleDeleteTask}
        onAddTask={() => setActiveView("add")}
      />;
      case "add": return <AddTaskView
        addForm={addForm}
        setAddForm={setAddForm}
        handleAddTask={handleAddTask}
        formStatus={formStatus}
        onCancel={() => { setActiveView("dashboard"); setFormStatus(null); }}
      />;
      case "settings": return <PlaceholderView icon={<SettingsIcon />} title="Settings" sub="Configuration options coming soon." />;
      case "about": return <PlaceholderView icon={<StarIcon />} title="About" sub="Task Scheduler v1.0 — built with React &amp; Node.js." />;
      default: return null;
    }
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-header-title">Options</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item${activeView === item.id ? " nav-item--active" : ""}`}
              onClick={() => { setActiveView(item.id); setFormStatus(null); }}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={() => alert("Logged out")}>
          <span className="nav-item-icon"><LogOutIcon /></span>
          LOG OUT
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        {/* ── Top Bar ── */}
        <div className="topbar">
          <div className="topbar-titles">
            <h1 className="page-title">DASHBOARD</h1>
            <p className="page-subtitle">Overview of all your scheduled tasks.</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-circle-btn" title="Notifications"><BellIcon /></button>
            <button className="icon-circle-btn" title="Profile"><UserIcon /></button>
            <button className="add-task-topbar-btn" onClick={() => { setActiveView("add"); setFormStatus(null); }}>
              <PlusIcon color="#D9D9D9" size={14} />
              Add Task
            </button>
          </div>
        </div>

        {/* ── Page Content ── */}
        {renderView()}
      </main>
    </div>
  );
}

/* ── Dashboard View ── */
function DashboardView({ stats, filteredTasks, searchQuery, setSearchQuery, isRefreshing, fetchTasks, deleteConfirm, setDeleteConfirm, handleDeleteTask, onAddTask }) {
  return (
    <>
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card stat-card--blue">
          <div className="stat-icon-box stat-icon-box--blue"><CalendarIcon /></div>
          <div className="stat-details">
            <span className="stat-label">TOTAL TASKS</span>
            <span className="stat-number stat-number--blue">{stats.total}</span>
            <span className="stat-desc">All scheduled tasks</span>
          </div>
        </div>
        <div className="stat-card stat-card--green">
          <div className="stat-icon-box stat-icon-box--green"><PlayIcon /></div>
          <div className="stat-details">
            <span className="stat-label">Running</span>
            <span className="stat-number stat-number--green">{stats.running}</span>
            <span className="stat-desc">Tasks currently running</span>
          </div>
        </div>
        <div className="stat-card stat-card--yellow">
          <div className="stat-icon-box stat-icon-box--yellow"><PauseIcon /></div>
          <div className="stat-details">
            <span className="stat-label">Paused</span>
            <span className="stat-number stat-number--yellow">{stats.paused}</span>
            <span className="stat-desc">Tasks paused</span>
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-icon-box stat-icon-box--red"><StopCircleIcon /></div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-number stat-number--red">{stats.completed}</span>
            <span className="stat-desc">Tasks completed</span>
          </div>
        </div>
      </div>

      {/* Task Panel */}
      <div className="task-panel">
        <div className="task-panel-banner">
          <span className="task-panel-banner-text">TASK LIST</span>
        </div>

        <div className="task-panel-toolbar">
          <h2 className="task-panel-title">Scheduled Tasks</h2>
          <div className="toolbar-controls">
            <button
              className={`refresh-btn${isRefreshing ? " refresh-btn--spinning" : ""}`}
              onClick={() => fetchTasks(true)}
            >
              <RefreshIcon spinning={isRefreshing} />
              Refresh
            </button>
            <div className="search-box">
              <SearchIcon />
              <input
                className="search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr className="task-table-header-row">
                <th>ID</th>
                <th>Time</th>
                <th>Message</th>
                <th>Counter</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No tasks found.</td>
                </tr>
              ) : (
                filteredTasks.map((task, i) => (
                  <tr key={task.TaskId} className={`task-row${i % 2 === 1 ? " task-row--highlight" : ""}`}>
                    <td className="task-cell--id">{task.TaskId}</td>
                    <td className="task-cell--time">{task.Time}</td>
                    <td className="task-cell--message">
                      {task.Message?.length > 32 ? task.Message.slice(0, 32) + "…" : task.Message}
                    </td>
                    <td className="task-cell--counter">{task.Counter}</td>
                    <td className="task-cell--status">
                      <StatusBadge status={task.Status} />
                    </td>
                    <td className="task-cell--action">
                      {deleteConfirm === task.TaskId ? (
                        <div className="delete-confirm">
                          <button className="delete-confirm-yes" onClick={() => handleDeleteTask(task.TaskId)}>Yes</button>
                          <button className="delete-confirm-no" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setDeleteConfirm(task.TaskId)} title="Delete task">
                          <TrashIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ── Add Task View ── */
function AddTaskView({ addForm, setAddForm, handleAddTask, formStatus, onCancel }) {
  return (
    <div className="task-panel">
      <div className="task-panel-banner">
        <span className="task-panel-banner-text">ADD TASK</span>
      </div>
      <div className="add-task-wrapper">
        <form className="add-task-form" onSubmit={handleAddTask}>
          <div className="form-group">
            <label className="form-label">Cron Schedule</label>
            <input
              className="form-input"
              placeholder="e.g. */5 * * * * *"
              value={addForm.time}
              onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}
            />
            <span className="form-hint">Standard cron expression (seconds optional)</span>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Task message or payload"
              value={addForm.message}
              onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
            />
          </div>
          {formStatus && (
            <p className={`form-feedback form-feedback--${formStatus.type}`}>{formStatus.msg}</p>
          )}
          <div className="form-btn-row">
            <button type="submit" className="form-btn form-btn--submit">
              <PlusIcon color="#FF0016" size={14} />
              Schedule Task
            </button>
            <button type="button" className="form-btn form-btn--cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Placeholder View ── */
function PlaceholderView({ icon, title, sub }) {
  return (
    <div className="placeholder-view">
      <div className="placeholder-icon">{icon}</div>
      <p className="placeholder-text">{title}</p>
      <p className="placeholder-subtext" dangerouslySetInnerHTML={{ __html: sub }} />
    </div>
  );
}

export default App;
