// SendReportButton.js
import React from "react";
import { sendMonthlyReportEmail } from "../services/emailService";

const SendReportButton = ({ employee, report }) => {
  const handleSend = async () => {
    if (!report) return alert("No report data available!");

    try {
      // Send the monthly report including advances
      await sendMonthlyReportEmail(employee, report);
      console.log("✅ Monthly report email sent!");

      alert("Report email sent successfully!");
    } catch (error) {
      console.error("❌ Error sending report email:", error);
      alert("Failed to send the report. Check console for details.");
    }
  };

  return (
    <button
      onClick={handleSend}
      style={{
        backgroundColor: "#3498db",
        color: "#fff",
        padding: "10px 25px 10px 10px",
        border: "none",
        marginTop: "1px",
        display: "flex",
        width: "fit-content",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Send Monthly Report
    </button>
  );
};

export default SendReportButton;
