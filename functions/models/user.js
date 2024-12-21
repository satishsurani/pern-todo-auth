'use strict';

// Importing the necessary modules from Sequelize
const {
  Model
} = require('sequelize');

// Exporting the User model definition
module.exports = (sequelize, DataTypes) => {
  // Defining the User class that extends the Model class from Sequelize
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // You can define relationships here (e.g., one-to-many, many-to-many)
      // Example: User.hasMany(models.Post)
      User.hasMany(models.Todo, {
        foreignKey: 'userId',
        as: 'userTodos'
      })
    }
  }

  // Initializing the User model with its attributes and settings
  User.init({
    id: {
      allowNull: false, // The 'id' cannot be null
      primaryKey: true, // The 'id' will be the primary key for this model
      type: DataTypes.UUID // The 'id' will be of type UUID
    },
    name: {
      type: DataTypes.STRING, // 'name' will be a string
      allowNull: false // 'name' cannot be null
    },
    email: {
      type: DataTypes.STRING, // 'email' will be a string
      allowNull: false, // 'email' cannot be null
      unique: true, // 'email' must be unique across all users
      validate: {
        isEmail: true, // Validate that 'email' is a valid email address
      }
    },
    password: DataTypes.STRING, // 'password' will be a string
    isVerified: {
      type: DataTypes.BOOLEAN, // 'isVerified' will be a boolean
      defaultValue: false // Default value is 'false' (user is not verified by default)
    },
    verificationOTP: DataTypes.STRING, // 'verificationOTP' will store the OTP string for email verification
    otpExpiresAt: DataTypes.DATE, // 'otpExpiresAt' will store the expiration date of the OTP
    profileImage: DataTypes.STRING, // 'profileImage' will store the URL or path to the user's profile image
    createdAt: {
      allowNull: false, // 'createdAt' cannot be null
      type: DataTypes.DATE // 'createdAt' will be of type DATE
    },
    updatedAt: {
      allowNull: false, // 'updatedAt' cannot be null
      type: DataTypes.DATE // 'updatedAt' will be of type DATE
    }
  }, {
    sequelize, // Pass the sequelize instance for the connection
    modelName: 'User', // Define the name of the model
  });

  // Return the User model to make it available for use in other parts of the app
  return User;
};