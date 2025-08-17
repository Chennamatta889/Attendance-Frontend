import React, { useState, useEffect } from "react";
import {
  createEmployee,
  updateEmployee,
  getEmployee,
} from "../services/employeeService";
import { useNavigate, useParams } from "react-router-dom";

import "./Employee.css"; // External CSS

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    dailyWage: 0,
    joiningDate: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getEmployee(id).then((res) => setEmployee(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: name === "dailyWage" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateEmployee(id, employee);
    } else {
      await createEmployee(employee);
    }
    navigate("/");
  };

  return (
    <div className="employee-container">
     
      {/* Form Section */}
      <div className="employee-form-section">
        <div className="employee-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group full">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={employee.role}
                onChange={handleChange}
                placeholder="Job role"
              />
            </div>

            <div className="form-group">
              <label>Daily Wage (₹)</label>
              <input
                type="number"
                name="dailyWage"
                value={employee.dailyWage}
                onChange={handleChange}
                placeholder="Enter daily wage"
                required
              />
            </div>

            <div className="form-group full">
              <label>Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={employee.joiningDate?.split("T")[0] || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions full">
              <button type="submit">💾 Save Employee</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
