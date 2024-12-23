'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * Represents a Todo item in the system.
   * Each Todo belongs to a specific User.
   */
  class Todo extends Model {
    /**
     * Define associations for the Todo model.
     * This method is called automatically by Sequelize during model initialization.
     * @param {object} models - An object containing all defined models.
     */
    static associate(models) {
      // Define a one-to-many relationship with the User model
      Todo.belongsTo(models.User, {
        foreignKey: 'userId', // Foreign key in the Todo table referencing the User table
        as: 'userTodos' // Alias for the association
      });
    }
  }

  // Initialize the Todo model with its attributes and options
  Todo.init(
    {
      title: {
        type: DataTypes.STRING, // String type for the title of the Todo
        allowNull: false // Title is required
      },
      description: {
        type: DataTypes.TEXT, // Text type for a more detailed description
        allowNull: true // Description is optional
      },
      isCompleted: {
        type: DataTypes.BOOLEAN, // Boolean type to track completion status
        defaultValue: false, // Default value is "not completed"
        allowNull: false // Field is required
      },
      dueDate: {
        type: DataTypes.DATE, // Date type for the due date of the Todo
        allowNull: false // Due date is required
      },
      userId: {
        type: DataTypes.UUID, // UUID to associate the Todo with a User
        allowNull: false // Field is required
      },
      createdAt: {
        allowNull: false, // Field cannot be null
        type: DataTypes.DATE // Timestamp for when the Todo was created
      },
      updatedAt: {
        allowNull: false, // Field cannot be null
        type: DataTypes.DATE // Timestamp for when the Todo was last updated
      }
    },
    {
      sequelize, // The Sequelize instance
      modelName: 'Todo', // The name of the model
    }
  );

  return Todo; // Export the model
};
