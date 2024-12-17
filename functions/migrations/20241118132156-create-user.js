'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // The 'up' function is used to define the changes to apply to the database when the migration is run
  async up(queryInterface, Sequelize) {
    // Creates a new 'Users' table
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false, // This field cannot be null
        primaryKey: true, // This field is the primary key of the table
        type: Sequelize.UUID, // UUID type for unique identification of users
      },
      name: {
        type: Sequelize.STRING, // Name of the user (string data type)
        allowNull: false, // The name field cannot be empty
      },
      email: {
        type: Sequelize.STRING, // Email field (string data type)
        allowNull: false, // The email field cannot be empty
        unique: true, // Ensures that each email is unique
      },
      password: {
        type: Sequelize.STRING, // Password field (string data type)
      },
      isVerified: {
        type: Sequelize.BOOLEAN, // Boolean flag to check if the user is verified
        defaultValue: false, // Default value is false (unverified user)
      },
      verificationOTP: {
        type: Sequelize.STRING, // OTP string for verifying the user's email
      },
      otpExpiresAt: {
        type: Sequelize.DATE, // Expiration time for OTP
      },
      profileImage: {
        type: Sequelize.STRING, // URL or path to the user's profile image
      },
      createdAt: {
        allowNull: false, // This field cannot be null
        type: Sequelize.DATE, // Timestamp for when the user was created
      },
      updatedAt: {
        allowNull: false, // This field cannot be null
        type: Sequelize.DATE, // Timestamp for when the user was last updated
      },
    });
  },

  // The 'down' function is used to define the changes to undo the migration
  async down(queryInterface, Sequelize) {
    // Drops the 'Users' table
    await queryInterface.dropTable('Users');
  },
};