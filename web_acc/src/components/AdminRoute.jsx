import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return admin && admin.VaiTro === 1 ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;