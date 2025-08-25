import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeList.css';

const API_URL = process.env.REACT_APP_API_BASE_URL+"/Employees"; // ✅ base url from .env

// ✅ Setup axios defaults for Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL); // ✅ Token auto-attached
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${id}`); // ✅ Token auto-attached
        fetchEmployees();
      } catch (err) {
        console.error("Failed to delete employee:", err);
      }
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredEmployees = employees
    .filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortOrder === 'asc') return a[sortKey] > b[sortKey] ? 1 : -1;
      else return a[sortKey] < b[sortKey] ? 1 : -1;
    });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employees</h2>
        <Link to="/create" className="btn btn-primary">Add Employee</Link>
      </div>

      {/* Search */}
      <div className="input-group mb-4">
        <span className="input-group-text"><FaSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Employee Cards */}
      <div className="row">
        {filteredEmployees.length === 0 && (
          <p className="text-center mt-4">No employees found.</p>
        )}
        {filteredEmployees.map(emp => (
          <div className="col-md-4 mb-4" key={emp.employeeId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{emp.name}</h5>
                <p className="card-text"><strong>Email:</strong> {emp.email}</p>
                <p className="card-text"><strong>Phone:</strong> {emp.phone}</p>
                <p className="card-text"><strong>Role:</strong> {emp.role}</p>
                <p className="card-text"><strong>Daily Wage:</strong> ₹{emp.dailyWage}</p>
                <p className="card-text"><strong>Monthly Salary:</strong> ₹{emp.monthlySalary}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/edit/${emp.employeeId}`} className="btn btn-sm btn-outline-primary">
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDelete(emp.employeeId)}
                  className="btn btn-sm btn-delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
