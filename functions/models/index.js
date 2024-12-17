'use strict';

// Importing necessary modules
const fs = require('fs'); // For file system operations
const path = require('path'); // For handling and transforming file paths
const Sequelize = require('sequelize'); // The Sequelize ORM for interacting with the database
const process = require('process'); // To access environment variables

// Defining the basename of the current file (used to ignore the current file)
const basename = path.basename(__filename);

// Setting the environment to 'development' if not defined in process.env.NODE_ENV
const env = process.env.NODE_ENV || 'development';

// Loading the database configuration based on the environment
const config = require(__dirname + '/../config/config.json')[env];

// Initialize an empty object to store models
const db = {};

// Set up the Sequelize instance based on the environment
let sequelize;
if (config.use_env_variable) {
  // If the config specifies an environment variable, use that to get the database URL
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Otherwise, initialize Sequelize with database credentials from the config file
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Reading the current directory to dynamically load all the models
fs
  .readdirSync(__dirname) // Reads the directory
  .filter(file => {
    // Filter files: exclude the current file, only include .js files, and exclude test files
    return (
      file.indexOf('.') !== 0 &&  // Exclude hidden files
      file !== basename &&  // Exclude the current file
      file.slice(-3) === '.js' &&  // Include only .js files
      file.indexOf('.test.js') === -1  // Exclude test files
    );
  })
  .forEach(file => {
    // For each .js file, import and initialize the model
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Add the model to the 'db' object using its name as the key
    db[model.name] = model;
  });

// Initialize associations between models, if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    // If the model has an 'associate' method, call it to set up relationships
    db[modelName].associate(db);
  }
});

// Adding the Sequelize instance to the db object for easy access
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporting the db object, which contains all models and the Sequelize instance
module.exports = db;