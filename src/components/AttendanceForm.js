import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://localhost:44317/api";
const ATTENDANCE_API = `${BASE_URL}/Attendance`;
const EMPLOYEE_API = `${BASE_URL}/Employees`;

const AttendanceForm = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(EMPLOYEE_API);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
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
          Status: attendance[empId],
          Date: new Date().toISOString().split("T")[0],
        });
      }
      alert("✅ Attendance recorded successfully!");
      fetchEmployees();
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("❌ Error saving attendance");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Present: "bg-green-100 text-green-700",
      Absent: "bg-red-100 text-red-700",
      "Half-day": "bg-yellow-100 text-yellow-700",
      Leave: "bg-blue-100 text-blue-700",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Mark Attendance</h2>

        {/* Search & Submit */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="🔍 Search employee..."
            className="w-1/3 p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            value={search}
            onChange={e => setSearch(e.target.value.toLowerCase())}
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            💾 Save Attendance
          </button>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto max-h-[400px] border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border p-3 text-left">Employee</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Monthly Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
                .map(emp => (
                  <tr key={emp.employeeId} className="hover:bg-gray-50 transition">
                    <td className="border p-3 font-medium">{emp.name}</td>
                    <td className="border p-3">
                      <select
                        value={attendance[emp.employeeId] || "Present"}
                        onChange={e => handleChange(emp.employeeId, e.target.value)}
                        className="p-2 border rounded-md shadow-sm"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half-day">Half-day</option>
                        <option value="Leave">Leave</option>
                      </select>
                      <div className="mt-1">
                        {getStatusBadge(attendance[emp.employeeId] || "Present")}
                      </div>
                    </td>
                    <td className="border p-3">₹ {emp.monthlySalary?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
