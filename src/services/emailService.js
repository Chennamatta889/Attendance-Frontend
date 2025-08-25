// src/services/emailService.js
import emailjs from "emailjs-com";

const SERVICE_ID = "service_ebqay1l";
const ADVANCE_TEMPLATE_ID = "template_9azgqmw";
const REPORT_TEMPLATE_ID = "template_yer0bzs"; // your report email template
const PUBLIC_KEY = "pqF3g7EZkoa9HWqcR";

// Month names array
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Send advance email (if needed separately)
export const sendAdvanceEmail = (employee, advance) => {
  const templateParams = {
    to_email: employee.email,
    name: employee.name,
    amount: advance.amount,
    date: new Date(advance.dateGiven).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    reason: advance.reason || "Not specified",
  };

  return emailjs.send(SERVICE_ID, ADVANCE_TEMPLATE_ID, templateParams, PUBLIC_KEY);
};

// Send monthly report email (with advance details)
export const sendMonthlyReportEmail = (employee, report) => {
  const advancesHtml = report.advances && report.advances.length > 0
    ? report.advances
        .map(
          (adv) =>
            `<tr style="background:#f9fafd;">
              <td style="padding:10px;">${new Date(adv.dateGiven).toLocaleDateString("en-IN")}</td>
              <td style="padding:10px;">${adv.reason || "N/A"}</td>
              <td style="padding:10px; text-align:right;">₹${adv.amount}</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="padding:10px; text-align:center;">No advances</td></tr>`;

  const templateParams = {
    to_email: employee.email,
    employeeId: employee.employeeId,
    name: employee.name,
    monthName: monthNames[report.month - 1], // 👈 Month as name
    year: report.year,
    dailyWage: report.dailyWage,
    presentDays: report.presentDays,
    halfDays: report.halfDays,
    absents: report.absents,
    grossSalary: report.grossSalary,
    advanceDeduction: report.advanceDeduction,
    netSalary: report.netSalary,
    advanceDetails: advancesHtml, // 👈 HTML rows
  };

  return emailjs.send(SERVICE_ID, REPORT_TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
