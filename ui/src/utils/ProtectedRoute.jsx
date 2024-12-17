import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If the user is authenticated, render the element; otherwise, redirect to login
    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
