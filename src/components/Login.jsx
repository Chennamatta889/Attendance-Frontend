import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/Auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);

      if (onLoginSuccess) onLoginSuccess();

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00c6ff 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="logo"
            width="80"
            className="mb-3"
          />
          <h3 className="fw-bold">Sri Rudra Infra Developers</h3>
          <p className="text-light small">Manage employees & attendance 🚀</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center p-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 btn-lg fw-bold"
            style={{ borderRadius: "12px", transition: "0.3s" }}
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <small className="text-light">
            Don’t have an account?{" "}
            <a href="/register" className="text-warning fw-semibold">
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
