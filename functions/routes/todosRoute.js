// Import necessary modules
const express = require('express');  // Express framework for routing
const router = express.Router();  // Create a new router instance
const todosController = require('../controllers/todosController'); // Controller for handling todo operations
const { authMiddleware } = require('../middleware/authmiddleware');  // Middleware for authentication checks

// Routes for managing todos (CRUD operations) related to authenticated users

/**
 * Route to create a new todo for the authenticated user
 * @route POST /user/todos
 * @description Adds a new todo item for the authenticated user.
 * The user must be authenticated, and the todo will be stored in the database.
 * @access Private (requires authentication via authMiddleware)
 */
router.post('/user/todos', authMiddleware, todosController.createTodos);  // Calls createTodos method from controller

/**
 * Route to get all todos for the authenticated user
 * @route GET /user/todos
 * @description Retrieves a list of all todo items for the authenticated user.
 * @access Private (requires authentication via authMiddleware)
 */
router.get('/user/todos', authMiddleware, todosController.getTodosByUserId);  // Calls getTodosByUserId method from controller

/**
 * Route to update a specific todo by its ID for the authenticated user
 * @route PUT /user/todos/:id
 * @description Updates a specific todo item by its ID for the authenticated user.
 * @param {string} id - The ID of the todo item to be updated
 * @access Private (requires authentication via authMiddleware)
 */
router.put('/user/todos/:id', authMiddleware, todosController.updateTodos);  // Calls updateTodos method from controller

/**
 * Route to delete a specific todo by its ID for the authenticated user
 * @route DELETE /user/todos/:id
 * @description Deletes a specific todo item by its ID for the authenticated user.
 * @param {string} id - The ID of the todo item to be deleted
 * @access Private (requires authentication via authMiddleware)
 */
router.delete('/user/todos/:id', authMiddleware, todosController.deleteTodoByUserId);  // Calls deleteTodoByUserId method from controller

// Export the router to be used in the main app
module.exports = router;
