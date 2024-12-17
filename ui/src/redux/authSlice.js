import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('token');

const initialState = {
    user: null,
    isAuthenticated: !!token,
    loading: false,
    isVerified: false, // Ensure consistent casing
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        authSuccess: (state, action) => {
            const user = action.payload;
            state.user = user;
            state.isAuthenticated = true;
            state.isVerified = user.isVerified; // Correct casing
            state.loading = false;
        },
        verifyOtpSuccess: (state) => {
            state.isVerified = true; // Correct casing
            if (state.user) {
                state.user.isVerified = true; // Correct casing
            }
        },
        authFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const {
    authFailure,
    authRequest,
    logoutSuccess,
    verifyOtpSuccess,
    authSuccess,
} = authSlice.actions;

export default authSlice.reducer;
