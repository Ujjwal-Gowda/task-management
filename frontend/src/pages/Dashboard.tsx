import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const deployed = "https://task-management-5eed.onrender.com/api";
const API_URL = deployed || "http://localhost:5000/api";
interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
  isImportant: boolean;
  user?: { name: string; email: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "important">(
    "all",
  );
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUpdTask, setShowUpdTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };
  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskForm),
      });

      if (!response.ok) throw new Error("Failed to create task");

      deleteTask(taskId);
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      setTaskId("");
      setShowAddTask(false);
      fetchTasks();
      setShowUpdTask(false);
      setSuccess("Task created successfully! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err.message);
    }
  };
  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskForm),
      });

      if (!response.ok) throw new Error("Failed to create task");

      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      setShowAddTask(false);
      fetchTasks();
      setSuccess("Task created successfully! 🎉");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const toggleComplete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskId}/completed`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const toggleImportant = async (taskId: string) => {
    if (!user?.isAdmin) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskId}/important`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to toggle important", err);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?.isAdmin) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "important") return task.isImportant;
    return true;
  });

  const priorityColors = {
    low: "bg-blue-400",
    medium: "bg-yellow-400",
    high: "bg-red-400",
  };

  return (
    <div className="min-h-screen bg-green-300 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-purple-400 border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black mb-2">
              TASK MASTER
            </h1>
            <p className="font-bold text-black">
              👋 Hey, {user?.name}! {user?.isAdmin && "⭐ ADMIN"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-400 border-4 border-black px-6 py-3 font-black text-black hover:bg-red-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            LOGOUT
          </button>
        </div>

        {success && (
          <div className="bg-green-400 border-4 border-black p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <p className="font-bold text-black">✅ {success}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 border-4 border-black font-black ${filter === "all" ? "bg-cyan-400" : "bg-white"} hover:bg-cyan-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              ALL ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-3 border-4 border-black font-black ${filter === "completed" ? "bg-green-400" : "bg-white"} hover:bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              COMPLETED ({tasks.filter((t) => t.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter("important")}
              className={`px-6 py-3 border-4 border-black font-black ${filter === "important" ? "bg-yellow-400" : "bg-white"} hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              ⭐ IMPORTANT ({tasks.filter((t) => t.isImportant).length})
            </button>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="ml-auto px-6 py-3 border-4 border-black font-black bg-pink-400 hover:bg-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              + NEW TASK
            </button>
          </div>
        </div>
        {showUpdTask && (
          <div className="bg-orange-300 border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-4 text-black">UPDATE TASK</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-black">
                  TITLE *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 text-black">
                  DESCRIPTION
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black font-bold h-24 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Add some details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-black">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-black">
                    PRIORITY
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTask}
                  className="flex-1 bg-green-400 border-4 border-black p-4 font-black text-black hover:bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  UPDATE TASK
                </button>
                <button
                  onClick={() => setShowUpdTask(false)}
                  className="px-6 bg-white border-4 border-black font-black text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Task Form */}
        {showAddTask && (
          <div className="bg-orange-300 border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-4 text-black">
              CREATE NEW TASK
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-black">
                  TITLE *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 text-black">
                  DESCRIPTION
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black font-bold h-24 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="Add some details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-black">
                    DUE DATE
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-black">
                    PRIORITY
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateTask}
                  className="flex-1 bg-green-400 border-4 border-black p-4 font-black text-black hover:bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  CREATE TASK
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-6 bg-white border-4 border-black font-black text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-2xl font-black text-black">
                NO TASKS FOUND! 📋
              </p>
              <p className="font-bold text-black mt-2">
                Create your first task to get started!
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${task.isCompleted ? "opacity-75" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className={`w-8 h-8 border-4 border-black flex items-center justify-center font-black ${task.isCompleted ? "bg-green-400" : "bg-white"} hover:bg-green-300 flex-shrink-0`}
                  >
                    {task.isCompleted && "✓"}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`text-xl font-black ${task.isCompleted ? "line-through" : ""} text-black`}
                      >
                        {task.isImportant && "⭐ "}
                        {task.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        {user?.isAdmin && (
                          <>
                            <button
                              onClick={() => toggleImportant(task._id)}
                              className={`px-4 py-2 border-4 border-black font-black ${task.isImportant ? "bg-yellow-400" : "bg-white"} hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                            >
                              ⭐
                            </button>
                            <button
                              onClick={() => {
                                setShowUpdTask(!showUpdTask);
                                setTaskId(task._id);
                              }}
                              className={`px-4 py-2 border-4 border-black font-black ${task.isImportant ? "bg-yellow-400" : "bg-white"} hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                            >
                              U
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="px-4 py-2 border-4 border-black font-black bg-red-400 hover:bg-red-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className="font-bold mb-3 text-black">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`${priorityColors[task.priority]} border-2 border-black px-3 py-1 font-black text-xs text-black`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      {task.dueDate && (
                        <span className="bg-blue-300 border-2 border-black px-3 py-1 font-black text-xs text-black">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.user && user?.isAdmin && (
                        <span className="bg-purple-300 border-2 border-black px-3 py-1 font-black text-xs text-black">
                          👤 {task.user.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
