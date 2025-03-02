import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSubscription = false }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Check if subscription is required and user has it
  if (requireSubscription && !currentUser.hasActiveSubscription) {
    return <Navigate to="/subscription" />;
  }
  
  // User is authenticated and meets subscription requirements
  return children;
};

export default ProtectedRoute; 