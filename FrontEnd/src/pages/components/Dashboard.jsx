import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://taskbrain-ugbn.onrender.com";

function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function getTasks() {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getUser() {
    try {
      const res = await axios.get(`${BASE_URL}/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${BASE_URL}/task/${id}`, {
        withCredentials: true,
      });
      getTasks();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTasks();
    getUser();
  }, []);

  if (!data) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1554034483-04fda0d3507b?fm=jpg&q=60&w=3000&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgba(0,0,0,0.55)",
          paddingBottom: "30px",
        }}
      >
        <div className="container pt-4 text-white">
          <div className="row text-center mb-4 g-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-lg" style={{ backgroundColor: "#2563eb", color: "white" }}>
                <div className="card-body">
                  <h6>Total Tasks</h6>
                  <h2>{data.total}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-lg" style={{ backgroundColor: "#f59e0b", color: "white" }}>
                <div className="card-body">
                  <h6>Pending</h6>
                  <h2>{data.pending}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-lg" style={{ backgroundColor: "#06b6d4", color: "white" }}>
                <div className="card-body">
                  <h6>In Progress</h6>
                  <h2>{data.inProgress}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-lg" style={{ backgroundColor: "#22c55e", color: "white" }}>
                <div className="card-body">
                  <h6>Completed</h6>
                  <h2>{data.completed}</h2>
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3">All Tasks</h3>

          <div className="row g-4">
            {data.tasks.map((task) => (
              <div className="col-md-4" key={task._id}>
                <div
                  className="card shadow-lg border-0 h-100"
                  style={{
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    transition: "0.3s",
                  }}
                  onClick={() => {
                    if (user?.username === "admin") {
                      navigate(`/admin/task/${task._id}`);
                    } else {
                      navigate(`/task/${task._id}`);
                    }
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div className="card-body text-dark">
                    <h5 className="card-title">{task.title}</h5>

                    <p><b>Status:</b> {task.status}</p>
                    <p><b>Priority:</b> {task.priority}</p>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        View
                      </button>

                      {user?.username === "admin" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task._id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;