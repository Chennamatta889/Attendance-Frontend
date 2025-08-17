import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageAdvances.css"; 
import { sendAdvanceEmail } from "../services/emailService"; // ✅ import email service

const API_URL = "https://localhost:7222/api/Advance";
const EMPLOYEE_API = "https://localhost:7222/api/Employees";

const ManageAdvances = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [advances, setAdvances] = useState([]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNo, setReferenceNo] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch employees once
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

  // ✅ Fetch advances for employee
  const fetchAdvances = async (employeeId) => {
    try {
      const res = await axios.get(`${API_URL}/employee/${employeeId}`);
      setAdvances(res.data || []);
    } catch (err) {
      console.error("Error fetching advances:", err);
      setAdvances([]);
    }
  };

  // ✅ Handle employee change
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) fetchAdvances(empId);
    else setAdvances([]);
  };

  // ✅ Save new advance + send email
  const handleSaveAdvance = async () => {
    if (!selectedEmployee) return alert("⚠️ Please select an employee!");
    if (!amount || parseFloat(amount) <= 0)
      return alert("⚠️ Please enter a valid amount!");

    setLoading(true);
    try {
      await axios.post(API_URL, {
        employeeId: parseInt(selectedEmployee),
        amount: parseFloat(amount),
        reason: reason?.trim() || null,
        dateGiven: dateGiven,
        referenceNo: referenceNo?.trim() || null,
        status: "Pending",
      });

      // 🔎 find selected employee details
      const employee = employees.find(
        (emp) => emp.employeeId === parseInt(selectedEmployee)
      );

      // 📧 Send email to employee
      if (employee) {
        await sendAdvanceEmail(employee, {
          amount,
          reason,
          dateGiven,
        });
        alert("✅ Advance saved & email sent!");
      } else {
        alert("✅ Advance saved, but employee not found for email.");
      }

      // reset form
      setAmount("");
      setReason("");
      setReferenceNo("");
      setDateGiven(new Date().toISOString().split("T")[0]);
      fetchAdvances(selectedEmployee);
    } catch (err) {
      console.error("Error saving advance:", err);
      alert("❌ Failed to save advance");
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A" || dateStr.startsWith("0001")) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const totalAdvance = advances.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="container">
      <h2 className="heading">🏢 Manage Employee Advances</h2>

      {/* Employee Selection */}
      <div className="card">
        <label className="label">
          👤 Select Employee:
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            className="select-box"
          >
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Advance Entry Form */}
      {selectedEmployee && (
        <div className="card">
          <div className="form-group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="💰 Enter amount"
              min="1"
            />
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="📝 Reason (optional)"
            />
            <input
              type="date"
              value={dateGiven}
              onChange={(e) => setDateGiven(e.target.value)}
            />
            <button
              onClick={handleSaveAdvance}
              disabled={loading}
              className="btn"
            >
              {loading ? "⏳ Saving..." : "➕ Add Advance"}
            </button>
          </div>
        </div>
      )}

      {/* Advance History */}
      {advances.length > 0 && (
        <div className="card">
          <h3>📜 Advance History</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {advances.map((a) => (
                <tr key={a.advanceId}>
                  <td>{formatDate(a.dateGiven)}</td>
                  <td>₹{a.amount}</td>
                  <td>{a.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="total">🔢 Total Advance Taken: ₹{totalAdvance}</h4>
        </div>
      )}
    </div>
  );
};

export default ManageAdvances;
