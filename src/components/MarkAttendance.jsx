import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock, FaUmbrellaBeach } from 'react-icons/fa';
import './MarkAttendance.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${BASE_URL}/Attendance`;
const EMPLOYEE_API = `${BASE_URL}/Employees`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [todayStatus, setTodayStatus] = useState('Present');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(EMPLOYEE_API, getAuthHeaders());
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
        if (err.response?.status === 401) alert("Unauthorized! Please login again.");
      }
    };
    fetchEmployees();
  }, []);

  const fetchMonthlyAttendance = async (employeeId) => {
    try {
      const res = await axios.get(`${API_URL}/employee/${employeeId}`, getAuthHeaders());
      setEmployeeAttendance(res.data);
    } catch (err) {
      console.error('Error fetching monthly attendance:', err);
    }
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) fetchMonthlyAttendance(empId);
    setTodayStatus('Present');
    setAttendanceDate(new Date().toISOString().split('T')[0]);
  };

  const handleStatusChange = (e) => setTodayStatus(e.target.value);
  const handleDateChange = (e) => setAttendanceDate(e.target.value);

  const handleSaveAttendance = async () => {
    if (!selectedEmployee) return alert('Please select an employee!');
    setLoading(true);
    try {
      await axios.post(
        API_URL,
        {
          EmployeeId: parseInt(selectedEmployee),
          Status: todayStatus,
          Date: attendanceDate
        },
        getAuthHeaders()
      );
      alert('Attendance saved successfully!');
      fetchMonthlyAttendance(selectedEmployee);
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Failed to save attendance');
    }
    setLoading(false);
  };

  const getBadge = (status) => {
    switch (status) {
      case 'Present': return <span className="badge bg-success"><FaCheckCircle /> Present</span>;
      case 'Absent': return <span className="badge bg-danger"><FaTimesCircle /> Absent</span>;
      case 'Leave': return <span className="badge bg-warning text-dark"><FaUmbrellaBeach /> Leave</span>;
      case 'Half-day': return <span className="badge bg-info text-dark"><FaClock /> Half-day</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const summary = employeeAttendance.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container 4">
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header  text-black bg-gradient text-center fs-4 fw-bold">
          📋 Employee Attendance
        </div>

        <div className="card-body">
          {/* Summary */}
          {selectedEmployee && (
            <div className="attendance-summary">
              <div className="summary-card bg-success">
                <FaCheckCircle className="summary-icon" />
                <span>Present: {summary['Present'] || 0}</span>
              </div>
              <div className="summary-card bg-danger">
                <FaTimesCircle className="summary-icon" />
                <span>Absent: {summary['Absent'] || 0}</span>
              </div>
              <div className="summary-card bg-warning text-dark">
                <FaUmbrellaBeach className="summary-icon" />
                <span>Leave: {summary['Leave'] || 0}</span>
              </div>
              <div className="summary-card bg-info text-dark">
                <FaClock className="summary-icon" />
                <span>Half-day: {summary['Half-day'] || 0}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="row mb-4 g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Select Employee</label>
              <select className="form-select rounded-3" value={selectedEmployee} onChange={handleEmployeeChange}>
                <option value="">-- Select --</option>
                {employees.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
                ))}
              </select>
            </div>
            {selectedEmployee && (
              <>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input type="date" className="form-control rounded-3" value={attendanceDate} onChange={handleDateChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select rounded-3" value={todayStatus} onChange={handleStatusChange}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half-day">Half-day</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>
                <div className="col-md-3 mt-2">
                  <button
                    className="btn btn-primary w-100 rounded-pill shadow-sm"
                    onClick={handleSaveAttendance}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Attendance Table */}
          {employeeAttendance.length > 0 && (
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-hover table-striped shadow-sm rounded-3" style={{ tableLayout: 'fixed' }}>
                <thead className="table-light sticky-top">
                  <tr>
                    <th style={{ width: '50%' }}>Date</th>
                    <th style={{ width: '50%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAttendance.map(a => (
                    <tr key={a.attendanceId}>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td>{getBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
