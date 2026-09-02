import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const savedUserStr = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user = null;
  try {
    user = savedUserStr ? JSON.parse(savedUserStr) : null;
  } catch {
    user = null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || 'agent').toLowerCase().replace(/\s+/g, '_');
    const normalizedUserRole = userRole === 'sales_rep' ? 'agent' : userRole;
    
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase().replace(/\s+/g, '_'));

    if (!normalizedAllowed.includes(normalizedUserRole) && normalizedUserRole !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
