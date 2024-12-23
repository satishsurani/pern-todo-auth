// Importing passport and Google OAuth strategy
const passport = require('passport'); // Used for authentication handling.
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth 2.0 strategy for Passport.

// Importing database models
const model = require('../models'); // Accesses all defined database models, including the User model.

// Importing utility functions
const { generateUUID } = require('../utils/generateUUID'); // Utility for generating unique user IDs.
const { responde } = require('../utils/responseHandler'); // Utility for sending standardized API responses.

// Configuring the Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth client ID from environment variables.
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth client secret from environment variables.
            callbackURL: process.env.GOOGLE_CALLBACK_URL, // Callback URL for redirect after successful authentication.
            passReqToCallback: true, // Passes the request object to the callback for additional processing.
        },
        // Callback function for Google OAuth strategy
        async (req, accessToken, refreshToken, profile, done) => {
            const id = generateUUID(); // Generate a unique ID for a new user.
            const { emails, displayName, photos } = profile; // Extract email, display name, and photo details from Google profile.

            try {
                // Check if a user with the given email already exists in the database
                let user = await model.User.findOne({ where: { email: emails[0].value } });

                if (user) {
                    // If user exists but lacks a profile image, update it with the photo from Google
                    if (!user.profileImage) {
                        user.profileImage = photos[0]?.value;
                        await user.save();
                    }
                    return done(null, user); // Proceed with the existing user.
                }

                // If the user does not exist, create a new user record
                user = await model.User.create({
                    id, // Assign a unique ID.
                    name: displayName, // Use the display name from Google.
                    email: emails[0].value, // Primary email address from Google.
                    profileImage: photos[0]?.value, // Profile image from Google.
                    isVerified: emails[0].verified, // Email verification status from Google.
                });

                return done(null, user); // Proceed with the newly created user.
            } catch (error) {
                return done(error); // Handle errors during the authentication process.
            }
        }
    )
);

// Serialize user information into the session
passport.serializeUser((user, done) => {
    // Stores the user's ID in the session for subsequent requests
    done(null, user.id);
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user with ID:", id);
    try {
        // Fetch the user from the database using the stored ID
        const user = await model.User.findByPk(id);
        done(null, user); // Provide the fetched user object for use in the request.
    } catch (error) {
        done(error); // Handle errors during user deserialization.
    }
});