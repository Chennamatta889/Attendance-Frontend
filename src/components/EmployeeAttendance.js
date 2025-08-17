import React, { useEffect, useState } from 'react';
import { getEmployees } from '../services/employeeService';
import { getAttendanceByEmployee } from '../services/attendanceService';

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };

  const fetchAttendance = async (employeeId) => {
    const res = await getAttendanceByEmployee(employeeId);
    setRecords(res.data);
  };

  const handleEmployeeChange = (e) => {
    const empId = parseInt(e.target.value);
    setSelectedEmployee(empId);
    fetchAttendance(empId);
  };

  return (
    <div>
      <h2>Employee Attendance</h2>
      <label>
        Select Employee: 
        <select onChange={handleEmployeeChange} value={selectedEmployee || ""}>
          <option value="">--Select--</option>
          {employees.map(emp => (
            <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
          ))}
        </select>
      </label>

      {selectedEmployee && (
        <>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.attendanceId}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Optional: Show monthly salary */}
          {records.length > 0 && (
            <p>
              Monthly Salary: {records[0].monthlySalary ? records[0].monthlySalary.toFixed(2) : '0'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeAttendance;
