import axios from 'axios';

const API_URL = 'https://localhost:7222/api/Attendance'; 

export const getAttendanceByEmployee = (employeeId) =>
    axios.get(`${API_URL}/employee/${employeeId}`);

export const createOrUpdateAttendance = (attendance) =>
    axios.post(API_URL, attendance);

// New function to get all attendance
export const getAllAttendance = () => axios.get(API_URL);
