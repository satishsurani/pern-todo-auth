const express = require('express'); 
const cors = require('cors');
const session = require('express-session'); 
const passport = require('passport');
const { sequelize } = require('./models'); 
const router = require('./routes/authRoute'); 
const googleRoute = require('./routes/googleRoute'); 
const todosRoute = require('./routes/todosRoute'); 
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.options('*', cors());

// ** Add the session middleware **
app.use(
    session({
        secret: process.env.SESSION_SECRETE, // Use a secure and robust secret
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create a session until something is stored
        cookie: { secure: false }, // Set to `true` when using HTTPS
    })
);

// Passport initialization and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', router);
app.use('/', googleRoute);
app.use('/', todosRoute);

/**
 * Connect to the database.
 */
async function connectDb() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

/**
 * Start the server and connect to the database.
 */
app.listen(port, async () => {
    await connectDb();
    console.log(`Server is running on port ${port}`);
});
