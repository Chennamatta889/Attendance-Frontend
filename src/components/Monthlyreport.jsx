  // MonthlyReport.jsx
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import SendReportButton from "./SendReportButton";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "./Monthlyreport.css"; 

  const BASE_URL = process.env.REACT_APP_API_BASE_URL ;
  const EMPLOYEE_API = `${BASE_URL}/Employees`;
  const REPORT_API = `${BASE_URL}/Attendance`;
  
  const MonthlyReport = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const res = await axios.get(EMPLOYEE_API);
          setEmployees(res.data || []);
        } catch (err) {
          console.error("Error fetching employees:", err);
          alert(err.response?.data?.message || "⚠️ Failed to load employees.");
        }
      };
      fetchEmployees();
    }, []);

    const fetchReport = async () => {
      if (!selectedEmployee) return alert("⚠️ Please select an employee");
      setLoading(true);
      try {
        const res = await axios.get(
          `${REPORT_API}/monthly-report/${selectedEmployee}/${month}/${year}`
        );
        setReport({ ...res.data, month, year });
      } catch (err) {
        console.error("Error fetching report:", err);
        alert(err.response?.data?.message || "❌ Failed to fetch report");
      }
      setLoading(false);
    };

    const handleEmployeeChange = (e) => {
      setSelectedEmployee(e.target.value);
      setReport(null);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("en-IN");
    };

    const handleSettle = async () => {
      if (!selectedEmployee) return alert("⚠️ Please select an employee");

      if (!window.confirm("Are you sure you want to settle salary for this month?"))
        return;

      try {
        const res = await axios.post(
          `${REPORT_API}/settle/${selectedEmployee}/${month}/${year}`
        );
        alert(res.data.message); // Show backend message
        fetchReport();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "❌ Failed to settle salary");
      }
    };


    return (
      <div className="container my-1">
        <h2 className="text-center mb-10">🏢 Employee Monthly Report</h2>

        {/* Filters */}
        <div className="card p-3 mb-40 shadow-sm">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">👤 Select Employee</label>
              <select
                className="form-select"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
              >
                <option value="">-- Select --</option>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">📅 Month</label>
              <input
                type="number"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                min="1"
                max="12"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">📅 Year</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={fetchReport}
                disabled={loading}
              >
                {loading ? "⏳ Loading..." : "Get Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Report Card */}
        {report && (
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">
              {report.employeeName || report.name} - {report.month}/{report.year}
            </h4>

            <div className="table-responsive">
              <table className="table table-bordered table-striped">
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
                    <td>Daily Wage</td>
                    <td>₹{report.dailyWage}</td>
                  </tr>
                   <tr>
                    <td>Gross Salary (No of days X Daily wage)</td>
                    <td>₹{report.grossSalary}</td>
                  </tr> 
                  <tr>
                    <td>Advance Deduction</td>
                    <td>₹{report.advanceDeduction}</td>
                  </tr>
                  <tr>
                    <td>Previous Month Balance</td>
                    <td>₹{report.carryForwardBalance}</td>
                  </tr>
                  <tr className="table-success fw-bold">
                    <td>Net Salary</td>
                    <td>₹{report.netSalary}</td>
                  </tr>
                  <tr className="table-success fw-bold">
                    <td>Total Amount</td>
                    <td>₹{report.totalAmount}</td>
                  </tr>
                 {/*  <tr className="table-success fw-bold">
                    <td>Settlement on </td>
                    <td>{report.settledMonth}/{report.settledYear}</td>
                  </tr> */}
                  

                  {report.advances && report.advances.length > 0 && (
                    <>
                      <tr>
                        <td colSpan="2" className="text-center fw-bold bg-light">
                          📌 Advance Details
                        </td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <th>Reason & Amount (₹)</th>
                      </tr>
                      {report.advances.map((adv, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(adv.dateGiven)}</td>
                          <td>{adv.reason || "N/A"} - ₹{adv.amount}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleSettle}
                disabled={report.isSettled} // Disable if already settled
              >
                💰 {report.isSettled ? "Already Settled" : "Settle Now"}
              </button>
              {/* Send Report Button */}
            <SendReportButton
              employee={
                employees.find(
                  (e) => e.employeeId === parseInt(selectedEmployee)
                ) || {}
              }
              report={report}
            />
            </div>

            
          </div>
        )}

      </div>
    );
  };

  export default MonthlyReport;
