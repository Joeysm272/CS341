//Protects the route from being accessed by non-staff users
// This component checks the user's role and redirects them if they are not staff
//Authors: Preston Piranio
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireStaff = ({ children }) => {
  // Pull the user role out of localStorage
  const role = localStorage.getItem('role');

  // If they’re not staff, kick them back to homepage
  if (role !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireStaff;
