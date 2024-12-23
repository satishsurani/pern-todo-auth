// Import required modules
const express = require('express'); // Express framework for routing
const passport = require('passport'); // Passport for handling authentication
const { generateToken } = require('../utils/generateToken'); // Utility function to generate JWT token
require('../controllers/googleOthController'); // Import the Google OAuth controller, which is assumed to configure passport strategy

const router = express.Router(); // Create a new express router instance
const url = process.env.UI_URL; // Get the frontend URL from environment variables (for redirection)

// Route to initiate Google authentication
router.get('/auth/google', 
  passport.authenticate('google', {  // Passport's google strategy for OAuth authentication
    scope: ['profile', 'email']  // Request access to user's profile and email
  })
);

// Callback route that Google redirects to after authentication
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${url}/login` }),  // If authentication fails, redirect to the login page
    function(req, res) {
        // Generate a JWT token after successful authentication using the user data from the request (req.user)
        const token = generateToken(req.user);
        
        // Set the token in a cookie, which expires in 1 hour (3600000 milliseconds)
        res.cookie('token', token, { maxAge: 3600000 });
        
        // Redirect the user to the success login page with the token as a query parameter
        res.redirect(`${url}/success-login?token=${token}`);
    }
);

// Export the router to be used in the main app
module.exports = router;
