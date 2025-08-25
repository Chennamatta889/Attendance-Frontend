import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL ;
const API_URL = `${BASE_URL}/employees`; // Replace with your actual API URL
//const API_URL = "https://localhost:44317/api/employees"; // Replace with your API URL

export const getEmployees = () => axios.get(API_URL);
export const getEmployee = (id) => axios.get(`${API_URL}/${id}`);
export const createEmployee = (employee) => axios.post(API_URL, employee);
export const updateEmployee = (id, employee) => axios.put(`${API_URL}/${id}`, employee);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
