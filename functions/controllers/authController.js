const { where, Model } = require('sequelize');
const model = require('../models');
const { generateUUID } = require('../utils/generateUUID');
const { responde } = require('../utils/responseHandler');
const bcrypt = require('bcrypt');
const { sendOtpToEmail } = require('../service/emailProvider');
const { generateToken } = require('../utils/generateToken');
const validate = require('validator');
const { RelationshipType } = require('sequelize/lib/errors/database/foreign-key-constraint-error');

// Utility function to generate and save OTP
const generateAndSaveOTP = async (user) => {
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = verificationOTP;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    return verificationOTP;
};

/**
 * Signup new user
 * - Validates email
 * - Checks if user already exists
 * - Creates user with hashed password and OTP
 * - Sends OTP to user's email
 */
const signup = async (req, res) => {
    try {
        const id = generateUUID();
        const { name, email, password } = req.body;

        // Validate email
        if (!validate.isEmail(email) || !email.endsWith('@gmail.com')) {
            return responde(res, 400, 'Please enter a valid email address with @gmail.com');
        }

        // Check if user already exists
        const existingUser = await model.User.findOne({ where: { email } });
        if (existingUser) {
            return responde(res, 400, "User already exists. Please login.");
        }

        // Hash password and generate OTP
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user
        const user = await model.User.create({
            id,
            name,
            email,
            password: hashedPassword,
            verificationOTP,
            otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        });

        // Send OTP via email
        await sendOtpToEmail(user.email, verificationOTP);

        // Generate authentication token
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: 3600000 });

        return responde(res, 201, 'User created successfully. Check your email for OTP verification.', {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: false,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Verify OTP for email verification
 */
const verifyOtp = async (req, res) => {
    try {
        const { verificationOTP } = req.body;

        // Find user by OTP
        const user = await model.User.findOne({ where: { verificationOTP } });
        if (!user) return responde(res, 400, 'Invalid OTP');

        // Check OTP expiration
        if (user.otpExpiresAt < Date.now()) return responde(res, 400, 'OTP has expired');

        // Mark user as verified
        user.verificationOTP = null;
        user.otpExpiresAt = null;
        user.isVerified = true;
        await user.save();

        return responde(res, 200, 'Email verified successfully.', {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: true,
        });
    } catch (error) {
        console.error('Error during verifyOtp:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Sign in user with email and password
 */
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await model.User.findOne({ where: { email } });
        if (!user) return responde(res, 404, 'User not found');
        if (!user.isVerified) return responde(res, 400, 'User is not verified');

        // Compare passwords
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) return responde(res, 401, 'Invalid Credentials');

        // Generate token
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: 3600000 });

        return responde(res, 200, 'User logged in successfully', {
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: true,
        });
    } catch (error) {
        console.error('Error during signin:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Forgot Password - Generates and sends OTP to user's email
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
 
        // Find user by email
        const user = await model.User.findOne({ where: { email } });
        if (!user) return responde(res, 400, 'User not found');

        // Generate and save OTP
        const verificationOTP = await generateAndSaveOTP(user);

        // Send OTP via email
        await sendOtpToEmail(user.email, verificationOTP);

        return responde(res, 200, 'OTP sent to your email. Please check for email verification.');
    } catch (error) {
        console.error('Error during forgotPassword:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Reset Password - Validates OTP and updates user's password
 */
const resetPassword = async (req, res) => {
    try {
        const { verificationOTP, newPassword } = req.body;

        // Find user by OTP
        const user = await model.User.findOne({ where: { verificationOTP } });
        if (!user) return responde(res, 400, 'Invalid OTP');

        // Check OTP expiration
        if (user.otpExpiresAt < Date.now()) return responde(res, 400, 'OTP expired');

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.verificationOTP = null;
        user.otpExpiresAt = null;
        await user.save();

        return responde(res, 200, 'Password reset successfully.');
    } catch (error) {
        console.error('Error during resetPassword:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Logout - Logout User and remove cookie
 */
const logout = (req, res) => {
    try {
        // Clear the 'token' cookie by setting it to an empty string and an expiry date in the past
        res.cookie('token', '', { expires: new Date(0) });

        // Send a success response
        return responde(res, 200, 'Successfully logged out');
    } catch (error) {
        console.error('Error during logout:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await model.User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'email', 'profileImage']
        });

        if (!user) return responde(res, 404, 'User not found');
        return responde(res, 200, 'user profile get successfully', user);
    } catch (error) {
        console.error('Error during getUserProfile:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
}

module.exports = { signup, verifyOtp, signin, forgotPassword, resetPassword, logout, getUserProfile };