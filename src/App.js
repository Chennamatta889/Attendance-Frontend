import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import MarkAttendance from "./components/MarkAttendance";
import AttendanceList from "./components/AttendanceList";
import EmployeeAttendance from "./components/EmployeeAttendance";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import MonthlyReport from "./components/Monthlyreport";
import AdvancePage from "./components/AdvancePage";
import Login from "./components/Login"; // ✅ Import login

// 🔒 Protected Route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {/* Show Navbar only if logged in */}
      {localStorage.getItem("token") && <Navbar />}

      <div style={{ padding: "20px" }}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/mark"
            element={
              <PrivateRoute>
                <MarkAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/all"
            element={
              <PrivateRoute>
                <AttendanceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/employee"
            element={
              <PrivateRoute>
                <EmployeeAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <MonthlyReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/advance"
            element={
              <PrivateRoute>
                <AdvancePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
