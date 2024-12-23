import React, { useEffect } from 'react';  // Importing React to use JSX syntax and React functionalities
import './App.css';  // Importing custom styles for the application
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';  // Importing routing components from react-router-dom
import { ToastContainer } from 'react-toastify';  // Importing ToastContainer for displaying toast notifications
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for react-toastify to display notifications
import Login from './components/LoginSection/Login';  // Importing Login component
import VerifyOtp from './components/LoginSection/Verify-Otp';  // Importing VerifyOtp component for OTP verification
import ForgotPassword from './components/LoginSection/Forgot-Password';  // Importing ForgotPassword component
import ResetPassword from './components/LoginSection/Reset-Password';  // Importing ResetPassword component
import Home from './components/HomePage/Home';  // Importing Home component for authenticated users
import { useDispatch, useSelector } from 'react-redux';  // Importing useSelector to get authentication state from Redux store
import SuccessLogin from './components/LoginSection/SuccessLogin';  // Importing SuccessLogin component after successful login
import Navbar from './components/HomePage/Navbar';  // Importing Navbar component for navigation
import { ProtectedRoute } from './utils/ProtectedRoutes';  // Importing ProtectedRoute to secure private routes
import CreateTodo from './components/TodoSection/CreateTodo';  // Importing CreateTodo component
import Todos from './components/TodoSection/Todos';  // Importing Todos component to list user todos
import { isTokenPresent } from './redux/authToken';  // Function to check if the authentication token is present
import { logoutSuccess } from './redux/authSlice';  // Importing Redux action for logging out the user

// Main component that handles routing logic
const AppConent = () => {
    const location = useLocation();  // Getting current location/pathname from the router
    const { isAuthenticated } = useSelector(state => state.auth);  // Getting the authentication state from Redux store
    const noNavbarPaths = ['/login', "/verify-otp", "/forgot-password", "/reset-password", "/success-login"];  // List of paths where Navbar should not appear
    const dispatch = useDispatch();  // Getting dispatch function to dispatch Redux actions

    // Effect hook to check if token is present, and log out if not
    useEffect(() => {
        if (!isTokenPresent()) {
            dispatch(logoutSuccess());  // Dispatch logout action if no token found
        }
    }, [dispatch]);

    return (
        <>
            {/* Conditional Navbar display: Only show Navbar if the current path is not in `noNavbarPaths` */}
            {!noNavbarPaths.includes(location.pathname) && <Navbar />}

            <Routes>
                {/* Public Routes */}
                {/* Login route: If the user is authenticated, redirect to home page, otherwise show login page */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />  {/* OTP verification route */}
                <Route path="/forgot-password" element={<ForgotPassword />} />  {/* Forgot password route */}
                <Route path="/reset-password" element={<ResetPassword />} />  {/* Reset password route */}
                <Route path="/success-login" element={<SuccessLogin />} />  {/* Success login route */}
                
                {/* Protected Routes */}
                {/* CreateTodo and Todos are protected, only accessible if authenticated */}
                <Route path="/create-todos" element={<ProtectedRoute><CreateTodo /></ProtectedRoute>} />
                <Route path="/todos-list" element={<ProtectedRoute><Todos /></ProtectedRoute>} />

                {/* Default Home Route */}
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
};

// Main App component to wrap everything with ToastContainer and Router
function App() {
    return (
        <div>
            {/* ToastContainer for showing toast notifications */}
            <ToastContainer position="top-center" />
            
            {/* BrowserRouter handles the routing */}
            <BrowserRouter>
                <AppConent />  {/* Rendering the AppConent which contains all routes and logic */}
            </BrowserRouter>
        </div>
    );
}

export default App;