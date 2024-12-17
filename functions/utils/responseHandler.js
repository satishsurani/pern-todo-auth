/**
 * A utility function to standardize API responses.
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - HTTP status code (e.g., 200, 404, 500).
 * @param {string} message - A message describing the result of the operation.
 * @param {Object|null} [data=null] - Optional data to include in the response.
 * @returns {Object} - The formatted response sent to the client.
 */
const responde = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error', // Success for 2xx, error otherwise
        message, // Descriptive message for the client
        data     // Optional data payload
    });
};

module.exports = { responde };
