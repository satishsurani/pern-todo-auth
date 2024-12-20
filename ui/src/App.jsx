import React from 'react';  // Importing React to use JSX syntax and React functionalities
import './App.css';  // Importing custom styles for the application
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';  // Importing routing components from react-router-dom
import { ToastContainer } from 'react-toastify';  // Importing ToastContainer for displaying toast notifications
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for react-toastify to display notifications
import Login from './components/LoginSection/Login';  // Importing Login component
import VerifyOtp from './components/LoginSection/Verify-Otp';  // Importing VerifyOtp component for OTP verification
import ForgotPassword from './components/LoginSection/Forgot-Password';  // Importing ForgotPassword component
import ResetPassword from './components/LoginSection/Reset-Password';  // Importing ResetPassword component
import Home from './components/HomePage/Home';  // Importing Home component for authenticated users
import { useSelector } from 'react-redux';  // Importing useSelector to get authentication state from Redux store
import SuccessLogin from './components/LoginSection/SuccessLogin';

function App() {
    // Getting the `isAuthenticated` state from Redux to determine if the user is logged in
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <>
            <div>
                {/* ToastContainer for displaying toast notifications */}
                <ToastContainer position="top-center" />

                {/* BrowserRouter component for routing */}
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        {/* Login route: If the user is authenticated, they will be redirected to the home page */}
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

                        {/* Verify OTP route */}
                        <Route path="/verify-otp" element={<VerifyOtp />} />

                        {/* Forgot Password route */}
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Reset Password route */}
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/success-login" element={<SuccessLogin />} />

                        {/* Default Routes */}
                        {/* Home route */}
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;