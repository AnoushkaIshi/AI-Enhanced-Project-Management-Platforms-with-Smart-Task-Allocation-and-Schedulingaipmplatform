import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/ui/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProjectList from './components/projects/ProjectList';
import TaskList from './components/tasks/TaskList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:projectId/tasks" element={<TaskList />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;