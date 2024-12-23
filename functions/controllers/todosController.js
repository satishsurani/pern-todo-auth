// Importing required modules and utilities
const model = require('../models'); // Accesses all defined database models, including the Todo model.
const { generateUUID } = require('../utils/generateUUID'); // Utility for generating unique IDs for todos.
const { responde } = require('../utils/responseHandler'); // Utility for sending standardized API responses.

/**
 * Create a new Todo item
 * - Generates a unique ID for the Todo.
 * - Associates the Todo with the currently logged-in user.
 * - Saves the Todo to the database.
 */
const createTodos = async (req, res) => {
    try {
        const id = generateUUID(); // Generate a unique ID for the Todo.
        const userId = req.user.userId; // Extract user ID from the authenticated request.
        const { title, description, dueDate } = req.body; // Extract Todo details from the request body.

        // Create a new Todo in the database
        const newTodos = await model.Todo.create({
            id,
            title,
            description,
            dueDate,
            userId
        });

        return responde(res, 201, "Todo created successfully", newTodos); // Respond with success.
    } catch (error) {
        console.error('Error creating Todo:', error); // Log the error for debugging.
        return responde(res, 500, 'Internal server error'); // Respond with an error message.
    }
};

/**
 * Retrieve Todos by User ID
 * - Fetches all Todos associated with the currently logged-in user.
 */
const getTodosByUserId = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from the authenticated request.

        // Fetch all Todos associated with the user
        const todos = await model.Todo.findAll({ where: { userId } });

        return responde(res, 200, "Todos retrieved successfully", todos); // Respond with success.
    } catch (error) {
        console.error("Error retrieving Todos:", error); // Log the error for debugging.
        return responde(res, 500, "Something went wrong"); // Respond with an error message.
    }
};

/**
 * Update a Todo item
 * - Finds the Todo by ID and user ID to ensure ownership.
 * - Updates the Todo's fields with new values from the request body.
 * - Saves the updated Todo to the database.
 */
const updateTodos = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from the authenticated request.
        const { id } = req.params; // Extract the Todo ID from the request parameters.
        const { title, description, dueDate, isCompleted } = req.body; // Extract new values for the Todo.

        // Find the Todo by ID and user ID
        const todo = await model.Todo.findOne({ where: { id, userId } });
        if (!todo) return responde(res, 400, "Todo not found with this ID"); // Respond if the Todo is not found.

        // Update the Todo's fields
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.dueDate = dueDate || todo.dueDate;
        todo.isCompleted = isCompleted || todo.isCompleted;

        await todo.save(); // Save the updated Todo to the database.
        return responde(res, 200, "Todo updated successfully", todo); // Respond with success.
    } catch (error) {
        console.error("Error updating Todo:", error); // Log the error for debugging.
        return responde(res, 500, "Something went wrong"); // Respond with an error message.
    }
};

/**
 * Delete a Todo item
 * - Finds the Todo by ID and user ID to ensure ownership.
 * - Deletes the Todo from the database.
 */
const deleteTodoByUserId = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from the authenticated request.
        const { id } = req.params; // Extract the Todo ID from the request parameters.

        // Find the Todo by ID and user ID
        const todo = await model.Todo.findOne({ where: { id, userId } });
        if (!todo) return responde(res, 400, "Todo not found with this ID"); // Respond if the Todo is not found.

        await todo.destroy(); // Delete the Todo from the database.
        return responde(res, 200, "Todo deleted successfully", todo); // Respond with success.
    } catch (error) {
        console.error("Error deleting Todo:", error); // Log the error for debugging.
        return responde(res, 500, "Something went wrong"); // Respond with an error message.
    }
};

// Exporting the controller functions for use in routes
module.exports = {
    createTodos,
    getTodosByUserId,
    updateTodos,
    deleteTodoByUserId
};
