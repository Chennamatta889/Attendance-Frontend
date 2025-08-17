import React, { useEffect, useState } from "react";
import axios from "axios";
import SendReportButton from "./SendReportButton";
import "./Monthlyreport.css";

const EMPLOYEE_API = "https://localhost:7222/api/Employees";
const REPORT_API = "https://localhost:7222/api/Attendance";

const MonthlyReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees on load
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(EMPLOYEE_API);
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        alert("⚠️ Failed to load employees.");
      }
    };
    fetchEmployees();
  }, []);

  // Fetch report for selected employee & month/year
  const fetchReport = async () => {
    if (!selectedEmployee) return alert("⚠️ Please select an employee");
    setLoading(true);
    try {
      const res = await axios.get(
        `${REPORT_API}/monthly-report/${selectedEmployee}/${month}/${year}`
      );
      setReport(res.data || null);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("❌ Failed to fetch report");
    }
    setLoading(false);
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setReport(null); // Reset report when employee changes
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN");
  };

  return (
    <div className="report-container">
      <h2 className="heading">🏢 Employee Monthly Report</h2>

      {/* Filters */}
      <div className="report-filters card">
        <label>
          👤 Select Employee:
          <select value={selectedEmployee} onChange={handleEmployeeChange}>
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          📅 Month:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
        </label>

        <label>
          📅 Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>

        <button onClick={fetchReport}>
          {loading ? "⏳ Loading..." : "Get Report"}
        </button>
      </div>

      {/* Report Card */}
      {report && (
        <div className="report-card card">
          <h3>
            {report.employeeName} - {month}/{year}
          </h3>

          <table className="report-table">
            <tbody>
              <tr>
                <td>Present Days</td>
                <td>{report.presentDays}</td>
              </tr>
              <tr>
                <td>Half Days</td>
                <td>{report.halfDays}</td>
              </tr>
              <tr>
                <td>Absent / Leave</td>
                <td>{report.absents}</td>
              </tr>
              <tr>
                <td>Gross Salary</td>
                <td>₹{report.grossSalary}</td>
              </tr>
              <tr>
                <td>Advance Deduction</td>
                <td>₹{report.advanceDeduction}</td>
              </tr>
              <tr>
                <td>Net Salary</td>
                <td>₹{report.netSalary}</td>
              </tr>

              {/* Advance Details */}
              {report.advances && report.advances.length > 0 && (
                <>
                  <tr>
                    <td colSpan="2">
                      <strong>Advance Details</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>Amount - Reason</td>
                  </tr>
                  {report.advances.map((adv, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(adv.dateGiven)}</td>
                      <td>
                        ₹{adv.amount} - {adv.reason || "N/A"}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          {/* Send Report Email */}
          <SendReportButton
            employee={
              employees.find((e) => e.employeeId === parseInt(selectedEmployee)) || {}
            }
            advances={report.advances || []}
            report={report}
          />
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
