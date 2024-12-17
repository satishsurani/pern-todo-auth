const jwt = require('jsonwebtoken'); // Importing the 'jsonwebtoken' package to work with JSON Web Tokens.
const { responde } = require('../utils/responseHandler'); // Importing a custom 'responde' function to handle responses.

const authMiddleware = (req, res, next) => {
    // Retrieve the token from cookies. The token is expected to be stored in a cookie named 'token'.
    const token = req.cookies?.token;

    try {
        // If no token is provided, respond with a 401 Unauthorized error
        if (!token) return responde(res, 401, 'Access Denied. No token available');

        // Verify the token using the secret key stored in environment variables
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // If the token is valid, the payload (decoded token) is attached to the request object as 'user'
        req.user = decode;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If an error occurs (invalid or expired token), catch the error and respond with a 401 error
        console.error('Error during authMiddleware:', error); // Log the error for debugging
        return responde(res, 401, 'Invalid token');
    }
};

module.exports = { authMiddleware }; // Exporting the authMiddleware so it can be used in other parts of the application.