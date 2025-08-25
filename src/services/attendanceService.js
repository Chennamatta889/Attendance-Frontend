import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL ;

const API_URL = `${BASE_URL}/Attendance`;

export const getAttendanceByEmployee = (employeeId) =>
    axios.get(`${API_URL}/employee/${employeeId}`);

export const createOrUpdateAttendance = (attendance) =>
    axios.post(API_URL, attendance);

// New function to get all attendance
export const getAllAttendance = () => axios.get(API_URL);
