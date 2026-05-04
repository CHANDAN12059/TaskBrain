import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function name(e) {
    setUsername(e.target.value);
  }

  function pass(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { withCredentials: true }
      );

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }

    setUsername("");
    setPassword("");
  }

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
      {/* Overlay */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Card */}
        <div
          className="card shadow-lg border-0 p-4"
          style={{
            width: "400px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
          }}
        >
          <h3 className="text-center mb-4">Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="username"
                value={username}
                onChange={name}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                value={password}
                onChange={pass}
                required
              />
            </div>

            <button className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="mt-3 text-center">
            Don’t have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;