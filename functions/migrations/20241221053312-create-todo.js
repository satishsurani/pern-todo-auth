'use strict';

/** 
 * Migration script for creating the "Todos" table.
 * This table stores todo items with references to the associated user.
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  /**
   * Runs the migration to create the "Todos" table.
   * @param {object} queryInterface - Sequelize QueryInterface for executing raw queries.
   * @param {object} Sequelize - Sequelize library for defining data types.
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Todos', {
      id: {
        allowNull: false, // Field cannot be null
        primaryKey: true, // Field is the primary key
        type: Sequelize.UUID // Universally Unique Identifier (UUID) as the field type
      },
      title: {
        type: Sequelize.STRING, // String type for todo title
        allowNull: false // Field cannot be null
      },
      description: {
        type: Sequelize.TEXT, // Text type for a longer description
        allowNull: true // Field is optional
      },
      isCompleted: {
        type: Sequelize.BOOLEAN, // Boolean type for completion status
        defaultValue: false, // Default value is false
        allowNull: false // Field cannot be null
      },
      dueDate: {
        type: Sequelize.DATE, // Date type for the due date
        allowNull: false // Field cannot be null
      },
      userId: {
        type: Sequelize.UUID, // UUID to associate the Todo with a User
        allowNull: false, // Field cannot be null
        references: { 
          model: 'Users', // Foreign key references the "Users" table
          key: 'id' // The referenced column is "id" in the "Users" table
        }
      },
      createdAt: {
        allowNull: false, // Field cannot be null
        type: Sequelize.DATE // Timestamp for when the Todo was created
      },
      updatedAt: {
        allowNull: false, // Field cannot be null
        type: Sequelize.DATE // Timestamp for when the Todo was last updated
      }
    });
  },

  /**
   * Reverts the migration by dropping the "Todos" table.
   * @param {object} queryInterface - Sequelize QueryInterface for executing raw queries.
   * @param {object} Sequelize - Sequelize library for defining data types.
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Todos'); // Drop the "Todos" table if it exists
  }
};
