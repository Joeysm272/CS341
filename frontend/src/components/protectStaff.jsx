import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireStaff = ({ children }) => {
  // Pull the role (not the username) out of localStorage
  const role = localStorage.getItem('role');

  // If they’re not staff, kick them back to home (or login)
  if (role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireStaff;
