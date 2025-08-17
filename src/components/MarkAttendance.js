import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://localhost:7222/api/Attendance';
const EMPLOYEE_API = 'https://localhost:7222/api/Employees';

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [todayStatus, setTodayStatus] = useState('Present');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(EMPLOYEE_API);
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch monthly attendance for selected employee
  const fetchMonthlyAttendance = async (employeeId) => {
    try {
      const res = await axios.get(`${API_URL}/monthly/${employeeId}`);
      setEmployeeAttendance(res.data);
    } catch (err) {
      console.error('Error fetching monthly attendance:', err);
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) fetchMonthlyAttendance(empId);
    setTodayStatus('Present');
    setAttendanceDate(new Date().toISOString().split('T')[0]); // Reset date to today
  };

  // Handle status change
  const handleStatusChange = (e) => setTodayStatus(e.target.value);

  // Handle date change
  const handleDateChange = (e) => setAttendanceDate(e.target.value);

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedEmployee) return alert('Please select an employee!');
    setLoading(true);
    try {
      await axios.post(API_URL, {
        EmployeeId: parseInt(selectedEmployee),
        Status: todayStatus,
        Date: attendanceDate
      });
      alert('✅ Attendance saved successfully!');
      fetchMonthlyAttendance(selectedEmployee); // Refresh monthly data
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('❌ Failed to save attendance');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mark Attendance</h2>

      {/* Employee selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Select Employee:{' '}
          <select value={selectedEmployee} onChange={handleEmployeeChange}>
            <option value="">-- Select --</option>
            {employees.map(emp => (
              <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Attendance input */}
      {selectedEmployee && (
        <div style={{ marginBottom: '20px' }}>
          <label>
            Date:{' '}
            <input
              type="date"
              value={attendanceDate}
              onChange={handleDateChange}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Status:{' '}
            <select value={todayStatus} onChange={handleStatusChange}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half-day">Half-day</option>
              <option value="Leave">Leave</option>
            </select>
          </label>
          <button
            onClick={handleSaveAttendance}
            disabled={loading}
            style={{ marginLeft: '10px' }}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}

      {/* Monthly attendance table */}
      {employeeAttendance.length > 0 && (
        <div>
          <h3>Monthly Attendance</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employeeAttendance.map(a => (
                <tr
                  key={a.attendanceId}
                  style={{
                    backgroundColor:
                      a.status === 'Absent' ? '#ffd6d6' :
                      a.status === 'Leave' ? '#fff0b3' : 'transparent'
                  }}
                >
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
