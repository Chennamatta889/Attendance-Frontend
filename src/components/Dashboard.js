import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'Attendance', icon: '📝', route: '/attendance/all' },
    { title: 'Advance', icon: '💰', route: '/advance' },
    { title: 'Employees', icon: '👥', route: '/' },
    { title: 'Reports', icon: '📊', route: '/reports' },
  ];

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>
      <div className="cards-container">
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
  );
};

export default Dashboard;
