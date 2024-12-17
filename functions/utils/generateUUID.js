const { v4: uuidV4 } = require('uuid');

/**
 * Generates a unique identifier (UUID)
 * @returns {string} - A universally unique identifier (UUIDv4)
 */
const generateUUID = () => {
  return uuidV4(); // Use uuid's v4 method to generate a random UUID
};

module.exports = { generateUUID };
