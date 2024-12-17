import store from '../redux/store';
import axiosInstance from './url.service';
import { authFailure, authSuccess, logoutSuccess, verifyOtpSuccess } from '../redux/authSlice';

const dispatch = store.dispatch;

// Signup User
export const signupUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/signup', userData);
        store.dispatch(authSuccess(response.data.data));
        return response.data;
    } catch (error) {
        store.dispatch(authFailure(error.message || 'An error occurred'));
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
};

// Signin User
export const signinUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/signin', userData);
        store.dispatch(authSuccess(response.data.data));
        return response.data;
    } catch (error) {
        store.dispatch(authFailure(error.message));
        throw error.response;
    }
};

// OTP Verify
export const otpVerify = async (otpData) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', otpData);
        store.dispatch(verifyOtpSuccess());
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.post('/auth/forgot-password', email);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Reset Password
export const resetPassword = async (resetData) => {
    try {
        const response = await axiosInstance.post('/auth/reset-password', resetData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Logout
export const logout = async () => {
    try {
        const response = await axiosInstance.get('/auth/logout');
        if (response.status === 200) {
            dispatch(logoutSuccess());
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
