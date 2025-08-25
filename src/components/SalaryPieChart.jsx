import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import './SalaryPieChart.css'; // Optional: Add your custom styles

ChartJS.register(ArcElement, Tooltip, Legend);
const BASE_URL = process.env.REACT_APP_API_BASE_URL ;

// New API endpoint for salary summary
// This should return an object with advanceTotal, settledTotal, carryForwardTotal, toBe
const API_URL = `${BASE_URL}/Attendance/salary-summary`; // Adjust this endpoint as per your backend API



const SalaryPieChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSalarySummary = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const chartData = {
          labels: ['Advance Given', 'Settled', 'Carry Forward', 'To be Settled'],
          datasets: [
            {
              label: 'Salary Summary',
              data: [
                res.data.advanceTotal,
                res.data.settledTotal,
                res.data.carryForwardTotal,
                res.data.toBeSettledTotal
              ],
              backgroundColor: [
                '#36A2EB',
                '#4BC0C0',
                '#FFCE56',
                '#FF6384'
              ],
              hoverOffset: 10
            }
          ]
        };
        setData(chartData);
      } catch (err) {
        console.error('Error fetching salary summary:', err);
      }
    };

    fetchSalarySummary();
  }, []);

  if (!data) return <p>Loading chart...</p>;

  return (
    <div className="card mt-4 shadow-sm rounded-4 p-3">
      <h5 className="text-center fw-bold">Salary Summary (All Employees)</h5>
      <Pie data={data} />
    </div>
  );
};

export default SalaryPieChart;
