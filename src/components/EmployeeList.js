import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { Link } from 'react-router-dom';
import './Employee.css';


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const response = await getEmployees();
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      fetchEmployees();
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <Link to="/create" className="btn btn-primary">Add Employee</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Daily Wage</th>
            <th>Monthly Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeId}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td>{emp.dailyWage}</td>
              <td>{emp.monthlySalary}</td>
              <td>
                <Link to={`/edit/${emp.employeeId}`}>Edit</Link> | 
                <button onClick={() => handleDelete(emp.employeeId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
