import React from "react";  // Importing React to use JSX syntax and React functionalities
import { useSelector } from "react-redux";  // Importing useSelector to access the Redux store's state
import { Navigate } from "react-router-dom";  // Importing Navigate to redirect the user if they are not authenticated

// ProtectedRoute component ensures that only authenticated users can access certain routes
export const ProtectedRoute = ({ children }) => {
  // Accessing the authentication state from Redux store
  const { isAuthenticated } = useSelector(state => state.auth);

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  // If authenticated, render the children (the protected content or component)
  return children;
};