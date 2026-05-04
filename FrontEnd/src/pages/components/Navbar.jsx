import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);

  async function checkUser() {
    try {
      const res = await axios.get("http://localhost:8080/me", {
        withCredentials: true,
      });

      setUser(res.data.user); 
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  async function handleLogout() {
    await axios.post(
      "http://localhost:8080/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-4">
      <div className="container-fluid">

        <a className="navbar-brand fw-bold fs-4 me-4" href="#">
          TaskBrain
        </a>


        <ul className="navbar-nav me-auto gap-3">

          {user && (
            <li className="nav-item">
              <a className="nav-link" href="/dashboard">Dashboard</a>
            </li>
          )}

          {user?.username === "admin" && (
            <li className="nav-item">
              <a className="nav-link" href="/create">Create Task</a>
            </li>
          )}

        </ul>

   
        <ul className="navbar-nav ms-auto gap-3">

          {!user && (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/signup">SignUp</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/login">SignIn</a>
              </li>
            </>
          )}

          {user && (
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;