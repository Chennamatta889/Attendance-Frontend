import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EMPLOYEE_API = 'https://localhost:7222/api/Employees';
const ATTENDANCE_API = 'https://localhost:7222/api/Attendance';

const AttendanceForm = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({}); // { employeeId: "Present" }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(EMPLOYEE_API);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (employeeId, status) => {
    setAttendance(prev => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let empId of Object.keys(attendance)) {
        await axios.post(ATTENDANCE_API, {
          EmployeeId: parseInt(empId),
          Status: attendance[empId]
        });
      }
      alert('Attendance recorded successfully!');
      fetchEmployees(); // refresh employees to show updated salary
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Error saving attendance');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit}>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Status</th>
              <th>Monthly Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.employeeId}>
                <td>{emp.name}</td>
                <td>
                  <select
                    value={attendance[emp.employeeId] || 'Present'}
                    onChange={e => handleChange(emp.employeeId, e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half-day">Half-day</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
                <td>{emp.monthlySalary?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" style={{ marginTop: '15px', padding: '10px 20px' }}>
          Save Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
