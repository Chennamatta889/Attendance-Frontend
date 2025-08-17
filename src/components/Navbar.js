import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <NavLink to="/" style={styles.link}>🏢 AttendanceApp</NavLink>
      </div>
      <div style={styles.menu}>
        <NavLink 
          to="/" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Employees
        </NavLink>
        <NavLink 
          to="/create" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Add Employee
        </NavLink>
        <NavLink 
          to="/attendance/mark" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Mark Attendance
        </NavLink>
        <NavLink 
          to="/attendance/all" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          All Attendance
        </NavLink>
        <NavLink 
          to="/attendance/employee" 
          style={({ isActive }) => isActive ? styles.activeLink : styles.link}
        >
          Employee Attendance
        </NavLink>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: '10px 20px',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  menu: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  activeLink: {
    color: '#1abc9c',
    textDecoration: 'underline',
    fontWeight: '600',
  },
};

export default Navbar;
