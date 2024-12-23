// Importing specific utilities from Sequelize
const { where, Model } = require('sequelize'); // 'where' is used for querying specific conditions, and 'Model' serves as the base class for defining database models.

// Importing the database models
const model = require('../models'); // Represents all the database models defined in the application, such as the User model.

// Importing utility functions
const { generateUUID } = require('../utils/generateUUID'); // Function to generate universally unique identifiers (UUIDs).
const { responde } = require('../utils/responseHandler'); // A utility function for sending standardized API responses.

// Importing bcrypt for password hashing
const bcrypt = require('bcrypt'); // Used to securely hash and compare passwords.

// Importing email service
const { sendOtpToEmail } = require('../service/emailProvider'); // Sends OTP emails to users for verification and password reset.

// Importing JWT token generation utility
const { generateToken } = require('../utils/generateToken'); // Generates JSON Web Tokens (JWT) for user authentication.

// Importing input validation library
const validate = require('validator'); // Used for validating input, such as checking email format.

// Utility function to generate and save OTP
// Generates a random 6-digit OTP, saves it to the user instance, and sets an expiration time (10 minutes).
const generateAndSaveOTP = async (user) => {
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = verificationOTP;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    return verificationOTP;
};

/**
 * Signup new user
 * Steps:
 *  - Validates the provided email.
 *  - Checks if a user with the given email already exists.
 *  - Creates a new user with hashed password and generates an OTP.
 *  - Sends the OTP to the user's email for verification.
 */
const signup = async (req, res) => {
    try {
        const id = generateUUID();
        const { name, email, password } = req.body;

        // Validate email format and domain
        if (!validate.isEmail(email) || !email.endsWith('@gmail.com')) {
            return responde(res, 400, 'Please enter a valid email address with @gmail.com');
        }

        // Check if a user with the given email already exists
        const existingUser = await model.User.findOne({ where: { email } });
        if (existingUser) {
            return responde(res, 400, 'User already exists. Please login.');
        }

        // Hash the password and generate OTP
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user entry in the database
        const user = await model.User.create({
            id,
            name,
            email,
            password: hashedPassword,
            verificationOTP,
            otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        });

        // Send the OTP to the user's email
        await sendOtpToEmail(user.email, verificationOTP);

        // Generate an authentication token and set it as a cookie
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
 * Steps:
 *  - Verifies the provided OTP.
 *  - Checks if the OTP has expired.
 *  - Updates the user's verification status.
 */
const verifyOtp = async (req, res) => {
    try {
        const { verificationOTP } = req.body;

        // Find the user by OTP
        const user = await model.User.findOne({ where: { verificationOTP } });
        if (!user) return responde(res, 400, 'Invalid OTP');

        // Check if the OTP is expired
        if (user.otpExpiresAt < Date.now()) return responde(res, 400, 'OTP has expired');

        // Mark the user as verified and clear OTP fields
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
 * Steps:
 *  - Verifies user credentials.
 *  - Ensures the user is verified.
 *  - Generates and returns an authentication token.
 */
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await model.User.findOne({ where: { email } });
        if (!user) return responde(res, 404, 'User not found');
        if (!user.isVerified) return responde(res, 400, 'User is not verified');

        // Compare the provided password with the stored hashed password
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) return responde(res, 401, 'Invalid credentials');

        // Generate an authentication token
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
 * Steps:
 *  - Checks if the email exists.
 *  - Generates an OTP and sends it to the email.
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await model.User.findOne({ where: { email } });
        if (!user) return responde(res, 400, 'User not found');

        // Generate and save OTP
        const verificationOTP = await generateAndSaveOTP(user);

        // Send the OTP to the user's email
        await sendOtpToEmail(user.email, verificationOTP);

        return responde(res, 200, 'OTP sent to your email. Please check for email verification.');
    } catch (error) {
        console.error('Error during forgotPassword:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Reset Password - Validates OTP and updates the user's password
 * Steps:
 *  - Validates the provided OTP.
 *  - Ensures the OTP is not expired.
 *  - Hashes the new password and updates it in the database.
 */
const resetPassword = async (req, res) => {
    try {
        const { verificationOTP, newPassword } = req.body;

        // Find the user by OTP
        const user = await model.User.findOne({ where: { verificationOTP } });
        if (!user) return responde(res, 400, 'Invalid OTP');

        // Check if the OTP is expired
        if (user.otpExpiresAt < Date.now()) return responde(res, 400, 'OTP expired');

        // Hash and update the new password
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
 * Logout - Logs out the user and removes the authentication cookie
 */
const logout = (req, res) => {
    try {
        // Clear the authentication token cookie
        res.cookie('token', '', { expires: new Date(0) });

        return responde(res, 200, 'Successfully logged out');
    } catch (error) {
        console.error('Error during logout:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

/**
 * Get User Profile
 * Steps:
 *  - Retrieves the user's profile based on the authenticated user ID.
 */
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the authentication middleware
        const user = await model.User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'email', 'profileImage']
        });

        if (!user) return responde(res, 404, 'User not found');
        return responde(res, 200, 'User profile retrieved successfully', user);
    } catch (error) {
        console.error('Error during getUserProfile:', error);
        return responde(res, 500, 'Something went wrong. Please try again.');
    }
};

module.exports = { signup, verifyOtp, signin, forgotPassword, resetPassword, logout, getUserProfile };