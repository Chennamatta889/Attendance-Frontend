import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployee } from '../services/employeeService';
import { getAttendanceByEmployee } from '../services/attendanceService';
import { getAdvancesByEmployee } from '../services/advanceService';

const EmployeeDetail = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [advances, setAdvances] = useState([]);

    const fetchEmployeeData = async () => {
        const empRes = await getEmployee(id);
        setEmployee(empRes.data);

        const attRes = await getAttendanceByEmployee(id);
        setAttendances(attRes.data);

        const advRes = await getAdvancesByEmployee(id);
        setAdvances(advRes.data);
    };

    useEffect(() => {
        fetchEmployeeData();
    }, [id]);

    if (!employee) return <div>Loading...</div>;

    return (
        <div>
            <h2>{employee.name}</h2>
            <p>Email: {employee.email}</p>
            <p>Phone: {employee.phone}</p>
            <p>Role: {employee.role}</p>
            <p>Daily Wage: {employee.dailyWage}</p>
            <p>Monthly Salary: {employee.monthlySalary}</p>

            <h3>Attendance</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map(a => (
                        <tr key={a.attendanceId}>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            <td>{a.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Advances</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {advances.map(a => (
                        <tr key={a.advanceId}>
                            <td>{new Date(a.dateGiven).toLocaleDateString()}</td>
                            <td>{a.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeDetail;
