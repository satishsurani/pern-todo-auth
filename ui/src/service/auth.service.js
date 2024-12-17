import store from '../redux/store'; // Import the Redux store to dispatch actions
import axiosInstance from './url.service'; // Import the custom axios instance configured with base URL
import { authFailure, authSuccess, logoutSuccess, verifyOtpSuccess } from '../redux/authSlice'; // Import Redux actions to handle auth state

const dispatch = store.dispatch; // Shortcut to dispatch actions in Redux

// Signup User
export const signupUser = async (userData) => {
    try {
        // Sending a POST request to the server with the user data for registration
        const response = await axiosInstance.post('/auth/signup', userData);
        // On success, dispatch the authSuccess action to store the user data and mark them as authenticated
        store.dispatch(authSuccess(response.data.data));
        return response.data; // Return the response data (could be user info, or a success message)
    } catch (error) {
        // If an error occurs, dispatch the authFailure action and pass the error message
        store.dispatch(authFailure(error.message || 'An error occurred'));
        // Throw the error to be caught by the calling component
        throw error.response?.data || { message: 'Unknown error occurred' };
    }
};

// Signin User
export const signinUser = async (userData) => {
    try {
        // Sending a POST request to the server to sign in the user with their credentials
        const response = await axiosInstance.post('/auth/signin', userData);
        // On success, dispatch the authSuccess action with the user data
        store.dispatch(authSuccess(response.data.data));
        return response.data; // Return the server response (could be a token, user data, etc.)
    } catch (error) {
        // If an error occurs, dispatch the authFailure action and pass the error message
        store.dispatch(authFailure(error.message));
        throw error.response; // Throw the error object received from the server
    }
};

// OTP Verify (Verify OTP for email verification or password reset)
export const otpVerify = async (otpData) => {
    try {
        // Sending a POST request with the OTP data to verify the OTP
        const response = await axiosInstance.post('/auth/verify-otp', otpData);
        // If OTP verification is successful, dispatch the verifyOtpSuccess action to mark the user as verified
        store.dispatch(verifyOtpSuccess());
        return response.data; // Return the response data (confirmation of verification)
    } catch (error) {
        // If an error occurs, throw the error data from the server
        throw error.response.data;
    }
};

// Forgot Password (Request a password reset email)
export const forgotPassword = async (email) => {
    try {
        // Sending a POST request with the email to initiate the password reset process
        const response = await axiosInstance.post('/auth/forgot-password', email);
        return response.data; // Return the server response (usually a success message)
    } catch (error) {
        // If an error occurs, throw the error data from the server
        throw error.response.data;
    }
};

// Reset Password (Submit new password for resetting)
export const resetPassword = async (resetData) => {
    try {
        // Sending a POST request with the reset data (new password) to reset the user's password
        const response = await axiosInstance.post('/auth/reset-password', resetData);
        return response.data; // Return the server response (confirmation of password reset)
    } catch (error) {
        // If an error occurs, throw the error data from the server
        throw error.response.data;
    }
};

// Logout User
export const logout = async () => {
    try {
        // Sending a GET request to log the user out
        const response = await axiosInstance.get('/auth/logout');
        if (response.status === 200) {
            // If the logout is successful, dispatch the logoutSuccess action to clear the user data
            dispatch(logoutSuccess());
        }
        return response.data; // Return the response data (confirmation of logout)
    } catch (error) {
        // If an error occurs, throw the error data from the server
        throw error.response.data;
    }
};