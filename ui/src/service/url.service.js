import axios from 'axios'; // Importing the Axios library to handle HTTP requests

// Define the base URL for the API
const ApiUrl = 'http://localhost:8080'; // This is the root URL where the backend API is hosted

// Create an instance of Axios with custom configuration
const axiosInstance = axios.create({
    baseURL: ApiUrl, // Set the base URL for all requests made using this instance
    withCredentials: true, // Include credentials (like cookies) in requests, which is useful for session management or authentication
});

// Export the Axios instance so it can be used throughout the application
export default axiosInstance;