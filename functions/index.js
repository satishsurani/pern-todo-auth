const express = require('express');  // Importing Express for creating the server
const cors = require('cors'); // Importing CORS to handle Cross-Origin Resource Sharing
const { sequelize } = require('./models'); // Importing Sequelize instance for database connection
const router = require('./routes/authRoute'); // Importing authentication routes
require('dotenv').config(); // Importing dotenv to load environment variables from .env file
const cookieParser = require('cookie-parser'); // Importing middleware for cookie parsing

const app = express(); // Creating an Express app instance
const port = process.env.PORT || 8000; // Setting the port, either from environment variable or default to 8000

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies in incoming requests
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

// CORS configuration for proper handling of cross-origin requests
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow requests from this frontend origin
        credentials: true,              // Allow cookies and credentials to be sent with requests
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers in requests
    })
);

// Handling preflight requests for CORS (OPTIONS method)
app.options('*', cors()); // Enable CORS preflight for all routes

// Routes
app.use('/', router); // Use the authentication routes for all requests

/**
 * Connect to the database.
 * This function checks the connection to the database using Sequelize.
 */
async function connectDb() {
    try {
        await sequelize.authenticate(); // Attempt to authenticate the Sequelize connection to the database
        console.log('Database connection established successfully.'); // Log success message if connected
    } catch (error) {
        console.error('Database connection failed:', error); // Log error message if connection fails
    }
}

/**
 * Start the server and connect to the database.
 * The server will only start after successful database connection.
 */
app.listen(port, async () => {
    await connectDb(); // Ensure the database connection is established before starting the server
    console.log(`Server is running on port ${port}`); // Log the server running message
});
