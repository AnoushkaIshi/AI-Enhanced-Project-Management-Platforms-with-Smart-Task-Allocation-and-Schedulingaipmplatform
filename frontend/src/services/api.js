const API_BASE_URL = 'http://localhost:5000'; // Backend
const AI_BASE_URL = 'http://localhost:5001';  // AI Service

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});