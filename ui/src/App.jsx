import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/LoginSection/Login';
import VerifyOtp from './components/LoginSection/Verify-Otp';
import ForgotPassword from './components/LoginSection/Forgot-Password';
import ResetPassword from './components/LoginSection/Reset-Password';
import Home from './components/HomePage/Home';

import ProtectedRoute from './utils/ProtectedRoute';
import { useSelector } from 'react-redux'

function App() {
    const { isAuthenticated } = useSelector(state => state.auth)
    return (
        <>
            <div>
                <ToastContainer position="top-center" />
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={isAuthenticated?<Navigate to='/' /> : <Login />} />
                        <Route path="/verify-otp" element={<VerifyOtp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<Home />} />

                        {/* Default Route */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;