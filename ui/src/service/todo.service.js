import axiosInstance from './url.service'; // Import the configured axios instance for API calls

// Create a new Todo
export const createTodo = async (todoData) => {
    try {
        // Sending a POST request to create a new todo with the provided data
        const response = await axiosInstance.post('/user/todos', todoData);
        return response.data; // Return the response data (created todo details)
    } catch (error) {
        // If an error occurs, log it to the console and throw an error message
        console.log('createTodo error:', error);
        throw error.response.message; // Throw the error message from the response
    }
}

// Get all Todos for the authenticated user
export const getTodosByUserId = async () => {
    try {
        // Sending a GET request to fetch all todos for the user
        const response = await axiosInstance.get('/user/todos');
        return response.data; // Return the response data (todos list)
    } catch (error) {
        // If an error occurs, log it to the console and throw an error message
        console.log('getTodosByUserId error:', error);
        throw error.response.message; // Throw the error message from the response
    }
}

// Update an existing Todo by its ID
export const updateTodosByUserId = async (id, updateTodoData) => {
    try {
        // Sending a PUT request to update the todo with the given ID and data
        const response = await axiosInstance.put(`/user/todos/${id}`, updateTodoData);
        return response.data; // Return the response data (updated todo details)
    } catch (error) {
        // If an error occurs, log it to the console and throw an error message
        console.log('updateTodosByUserId error:', error);
        throw error.response.message; // Throw the error message from the response
    }
}

// Delete a Todo by its ID
export const deleteTodosByUserId = async (id) => {
    try {
        // Sending a DELETE request to remove the todo with the given ID
        const response = await axiosInstance.delete(`/user/todos/${id}`);
        return response.data; // Return the response data (confirmation of deletion)
    } catch (error) {
        // If an error occurs, log it to the console and throw an error message
        console.log('deleteTodosByUserId error:', error);
        throw error.response.message; // Throw the error message from the response
    }
}