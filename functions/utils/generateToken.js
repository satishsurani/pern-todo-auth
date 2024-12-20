const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates a JSON Web Token (JWT) for a user
 * @param {Object} user - The user object containing user details
 * @param {string} user.id - The user's unique identifier
 * @param {string} user.email - The user's email address
 * @returns {string} - The generated JWT token
 * @throws {Error} - Throws an error if the token generation fails
 */

const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    // Check if the secret key is available
    if (!secretKey) {
        console.error("Error: JWT secret key is missing.");
        throw new Error("JWT secret key is missing");
    }

    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        secretKey,  // Use the environment variable for the secret key
        {
            expiresIn: '1h'
        }
    );
}

module.exports = { generateToken };
