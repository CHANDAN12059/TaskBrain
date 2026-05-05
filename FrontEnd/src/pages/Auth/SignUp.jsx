import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "https://taskbrain-ugbn.onrender.com";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function mail(e) {
    setEmail(e.target.value);
  }

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
        `${BASE_URL}/signup`,
        { username, email, password },
        { withCredentials: true }
      );

      window.location.href = "/dashboard";
    } catch (err) {
      alert("Signup failed");
    }

    setUsername("");
    setPassword("");
    setEmail("");
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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="card shadow-lg border-0 p-4"
          style={{
            width: "400px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
          }}
        >
          <h3 className="text-center mb-4">Sign Up</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={mail}
                required
              />
            </div>

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
              Sign Up
            </button>
          </form>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;