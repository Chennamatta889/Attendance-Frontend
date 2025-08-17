// src/services/emailService.js
import emailjs from "emailjs-com";

const SERVICE_ID = "service_rh6zmqp";
const ADVANCE_TEMPLATE_ID = "template_9azgqmw";
const REPORT_TEMPLATE_ID = "template_yer0bzs"; // 👈 your report email template
const PUBLIC_KEY = "pqF3g7EZkoa9HWqcR";

// Send advance email
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

// Send monthly report email
export const sendMonthlyReportEmail = (employee, report) => {
  const templateParams = {
    to_email: employee.email,
    id : employee.employeeId,
    name: employee.name,
    month: report.month,
    year: report.year,
    presentDays: report.presentDays,
    halfDays: report.halfDays,
    absents: report.absents,
    grossSalary: report.grossSalary,
    advanceDeduction: report.advanceDeduction,
    netSalary: report.netSalary,
  };

  return emailjs.send(SERVICE_ID, REPORT_TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
