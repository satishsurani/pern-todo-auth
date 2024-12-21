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
import SuccessLogin from './components/LoginSection/SuccessLogin';
import Navbar from './components/HomePage/Navbar';
import { ProtectedRoute } from './utils/ProtectedRoutes';
import CreateTodo from './components/TodoSection/CreateTodo';
import Todos from './components/TodoSection/Todos';
import { isTokenPresent } from './redux/authToken';
import { logoutSuccess } from './redux/authSlice';

const AppConent = () => {
    const location = useLocation();
    // Getting the `isAuthenticated` state from Redux to determine if the user is logged in
    const { isAuthenticated } = useSelector(state => state.auth);
    const noNavbarPaths = ['/login', "/verify-otp", "/forgot-password", "/reset-password", "/success-login"]
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isTokenPresent()) {
            dispatch(logoutSuccess)
        }
    }, [dispatch])

    return (
        <>
            {!noNavbarPaths.includes(location.pathname) && <Navbar />}
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

                <Route path="/create-todos" element={<ProtectedRoute><CreateTodo /></ProtectedRoute>} />
                <Route path="/todos-list" element={<ProtectedRoute><Todos /></ProtectedRoute>} />

                {/* Default Routes */}
                {/* Home route */}
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    )
}

function App() {


    return (
        <>
            <div>
                {/* ToastContainer for displaying toast notifications */}
                <ToastContainer position="top-center" />

                {/* BrowserRouter component for routing */}
                <BrowserRouter>
                    <AppConent />
                </BrowserRouter>
            </div>
        </>
    );
}

export default App;