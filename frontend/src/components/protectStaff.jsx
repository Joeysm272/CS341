import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireStaff = ({ children }) => {
  // Retrieve the username directly from localStorage
  const username = localStorage.getItem('username');

  // If the username is not "staff", redirect to the login page
  if (username !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireStaff;
