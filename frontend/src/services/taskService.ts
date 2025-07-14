import axios from 'axios';
interface Task {
  _id: string;
  name: string;
  description: string;
  // Add other task fields here
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = 'http://localhost:5000/api/tasks'; // Ensure this matches your backend

const API_BASE_URL = 'http://localhost:5000'; // Backend
const AI_BASE_URL = 'http://localhost:5001';  // AI Service

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Get tasks by project
export const getTasks = async (projectId: string) => {
  const response = await axios.get(`/api/projects/${projectId}/tasks`);
  return response.data;
};


// Get AI recommendations for task
export const getRecommendations = async (taskId: string) => {
  const response = await axios.get(`/api/tasks/${taskId}/recommendations`);
  return response.data;
};