import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const API_BASE_URL = 'http://localhost:5000'; // Backend
const AI_BASE_URL = 'http://localhost:5001';  // AI Service

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Register user
export const registerUser = async (userData: { 
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string; 
  role: string 
}) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};