const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController'); // Ensure correct path to the controller
const { authMiddleware } = require('../middleware/authmiddleware');

// Routes for authentication and user management

/**
 * Route for user signup
 * @route POST /auth/signup
 * @description Registers a new user and sends OTP to their email
 */
router.post('/user/todos', authMiddleware, todosController.createTodos);
router.get('/user/todos', authMiddleware, todosController.getTodosByUserId);
router.put('/user/todos/:id', authMiddleware, todosController.updateTodos);
router.delete('/user/todos/:id', authMiddleware, todosController.deleteTodoByUserId);

module.exports = router; 