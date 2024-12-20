const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure correct path to the controller
const { authMiddleware } = require('../middleware/authmiddleware');

// Routes for authentication and user management

/**
 * Route for user signup
 * @route POST /auth/signup
 * @description Registers a new user and sends OTP to their email
 */
router.post('/auth/signup', authController.signup);

/**
 * Route for verifying OTP
 * @route POST /auth/verify-otp
 * @description Verifies the OTP sent to the user's email during signup
 */
router.post('/auth/verify-otp', authController.verifyOtp);

/**
 * Route for user signin
 * @route POST /auth/signin
 * @description Logs in the user after validating credentials
 */
router.post('/auth/signin', authController.signin);

/**
 * Route for forgot password
 * @route POST /auth/forgot-password
 * @description Sends OTP to the user's email for password reset
 */
router.post('/auth/forgot-password', authController.forgotPassword);

/**
 * Route for resetting password
 * @route POST /auth/reset-password
 * @description Resets the user's password using OTP
 */
router.post('/auth/reset-password', authController.resetPassword);

/**
 * Route for logout
 * @route GET /auth/logout
 * @description Logout user and remove cookie
 */
router.get('/auth/logout', authController.logout);


/**
 * Route for auth request
 * @route GET /user/profile/:userId
 * @description Logout user and remove cookie
 */
router.get('/user/profile',authMiddleware, authController.getUserProfile);

module.exports = router;
