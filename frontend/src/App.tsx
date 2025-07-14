import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Add type definitions
type BackendResponse = {
  message: string;
  status?: string;
  timestamp?: string;
};

type AIResponse = {
  status?: string;
  message?: string;
};

function App() {
  const [backendMessage, setBackendMessage] = useState('Testing backend...');
  const [aiMessage, setAiMessage] = useState('Testing AI service...');

  useEffect(() => {
    // Test backend connection with proper typing
    axios.get<BackendResponse>('http://localhost:5000/api/auth/test')
      .then(res => setBackendMessage(res.data.message || 'Backend working!'))
      .catch(err => setBackendMessage('Backend error: ' + err.message));

    // Test AI service connection
    axios.post<AIResponse>('http://localhost:5001/test')
      .then(res => setAiMessage(res.data.message || 'AI service working!'))
      .catch(err => setAiMessage('AI service error: ' + err.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Project Management Platform</h1>
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <h3>Service Status:</h3>
          <p>Backend: {backendMessage}</p>
          <p>AI Service: {aiMessage}</p>
        </div>
      </header>
    </div>
  );
}

export default App;