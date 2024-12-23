// Import necessary modules
const express = require('express'); // Express framework for routing
const cors = require('cors'); // CORS middleware to handle cross-origin requests
const session = require('express-session'); // Express session management
const passport = require('passport'); // Passport for handling authentication
const { sequelize } = require('./models'); // Sequelize instance for database connection
const router = require('./routes/authRoute'); // Import authentication routes
const googleRoute = require('./routes/googleRoute'); // Import Google OAuth routes
const todosRoute = require('./routes/todosRoute'); // Import todo-related routes
require('dotenv').config(); // Load environment variables from a .env file
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const app = express(); // Create an Express application instance
const port = process.env.PORT || 8000; // Set the port to environment variable or default to 8000

// Middleware setup

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies from requests
app.use(cookieParser());

// CORS configuration to allow requests from the frontend
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow requests only from this frontend URL
        credentials: true, // Allow cookies to be sent with requests
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers in requests
    })
);

// Handle preflight OPTIONS requests for CORS
app.options('*', cors());

// ** Session management middleware **
app.use(
    session({
        secret: process.env.SESSION_SECRETE, // Use a secure secret from environment variable
        resave: false, // Don't save the session if it wasn't modified
        saveUninitialized: false, // Don't create a session until something is stored in it
        cookie: { secure: false }, // Set to `true` when using HTTPS (for cookie security)
    })
);

// Passport initialization and session handling
app.use(passport.initialize()); // Initialize passport for authentication
app.use(passport.session()); // Enable session-based authentication

// Routes setup

// Use the imported routes for authentication, Google OAuth, and todos
app.use('/', router); // Routes for authentication
app.use('/', googleRoute); // Routes for Google OAuth
app.use('/', todosRoute); // Routes for todo CRUD operations

/**
 * Function to connect to the database.
 */
async function connectDb() {
    try {
        await sequelize.authenticate(); // Try to authenticate the database connection
        console.log('Database connection established successfully.'); // Success message
    } catch (error) {
        console.error('Database connection failed:', error); // Error handling
    }
}

/**
 * Start the server and connect to the database.
 */
app.listen(port, async () => {
    await connectDb(); // Connect to the database before starting the server
    console.log(`Server is running on port ${port}`); // Server started message
});
