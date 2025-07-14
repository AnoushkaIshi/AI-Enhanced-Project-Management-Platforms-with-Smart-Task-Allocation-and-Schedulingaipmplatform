import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../store/store'; // ✅ fix for TS7006
import { useAppSelector } from '../../hooks';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
