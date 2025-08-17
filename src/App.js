import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import MarkAttendance from './components/MarkAttendance';
import AttendanceList from './components/AttendanceList';
import EmployeeAttendance from './components/EmployeeAttendance';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MonthlyReport from './components/Monthlyreport';
import AdvancePage from './components/AdvancePage';

function App() {
  return (
    <Router>
               <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>

          {/* Employee Management */}
         
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />

          {/* Attendance */}
          <Route path="/attendance/mark" element={<MarkAttendance />} />
          <Route path="/attendance/all" element={<AttendanceList />} />
          <Route path="/attendance/employee" element={<EmployeeAttendance />} />

          <Route path="/reports" element={<MonthlyReport />} />

          <Route path="/advance" element={<AdvancePage />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
