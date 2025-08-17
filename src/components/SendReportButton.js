// SendReportButton.js
import React from "react";
import { sendAdvanceEmail, sendMonthlyReportEmail } from "../services/emailService";

const SendReportButton = ({ employee, advances = [], report }) => {
  const handleSend = async () => {
    try {
      // 1️⃣ Send advance emails (if any)
      if (advances.length > 0) {
        for (const adv of advances) {
          await sendAdvanceEmail(employee, adv);
        }
        console.log("✅ Advance emails sent!");
      }

      // 2️⃣ Send monthly report email
      if (report) {
        await sendMonthlyReportEmail(employee, report);
        console.log("✅ Monthly report email sent!");
      }

      alert("All emails sent successfully!");
    } catch (error) {
      console.error("❌ Error sending emails:", error);
      alert("Failed to send emails. Check console for details.");
    }
  };

  return (
    <button onClick={handleSend}>
      Send Reports
    </button>
  );
};

export default SendReportButton;
