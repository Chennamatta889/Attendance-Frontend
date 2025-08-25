import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './Navbar.css'


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    // Redirect to login page
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink className="navbar-brand fw-bold" to="/">
         
        🏢 Sri Rudra Infra Developers
        </NavLink>

        

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-semibold text-info" : "")
                }
              >
                Employees
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-semibold text-info" : "")
                }
              >
                Add Employee
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/attendance/mark"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-semibold text-info" : "")
                }
              >
                Mark Attendance
              </NavLink>
            </li>

            {/* Logout Button */}
            <li className="nav-item">
  <button onClick={handleLogout} className="btn btn-logout ms-3">
    🚪 Logout
  </button>
</li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
