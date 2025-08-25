import React from 'react';
import { useNavigate } from 'react-router-dom';
import SalaryPieChart from './SalaryPieChart';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'Attendance', icon: '📝', route: '/attendance/mark' },
    { title: 'Pay', icon: '💰', route: '/advance' },
    { title: 'Employees', icon: '👥', route: '/employee' },
    { title: 'Reports', icon: '📊', route: '/reports' },
  ];

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>
      
      <div className="dashboard-main">
        {/* Left: Pie Chart */}
        <div className="dashboard-left">
          <SalaryPieChart />
        </div>

        {/* Right: Cards */}
        <div className="dashboard-right">
          {cards.map((card, index) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => navigate(card.route)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{card.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
