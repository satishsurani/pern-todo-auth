const express = require('express');
const cors = require('cors'); // To handle Cross-Origin Resource Sharing
const { sequelize } = require('./models'); // Sequelize instance for database
const router = require('./routes/authRoute'); // Importing routes
require('dotenv').config(); // Load environment variables from .env
const cookieParser = require('cookie-parser'); // Middleware for cookie parsing

const app = express();
const port = process.env.PORT || 8000; // Default port or from environment variable

// Middleware
app.use(express.json()); // To parse JSON bodies in requests
app.use(cookieParser()); // To parse cookies from requests

// Proper CORS configuration
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow requests from the frontend origin
        credentials: true,              // Enable cookies and credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    })
);

// Handle preflight requests (OPTIONS)
app.options('*', cors()); // Allow preflight for all routes

// Routes
app.use('/', router); // Use the authRoute for all requests

/**
 * Connect to the database.
 * This function checks the connection to the database using Sequelize.
 */
async function connectDb() {
    try {
        await sequelize.authenticate(); // Try to connect to the database
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Database connection failed:', error); // If connection fails, log the error
    }
}

/**
 * Start the server and connect to the database.
 */
app.listen(port, async () => {
    await connectDb(); // Ensure the database is connected before starting the server
    console.log(`Server is running on port ${port}`); // Log the server port to the console
});
