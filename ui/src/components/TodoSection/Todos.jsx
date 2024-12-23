import React, { useEffect, useState } from 'react'
import { deleteTodosByUserId, getTodosByUserId, updateTodosByUserId } from '../../service/todo.service'; // Importing API service functions
import { toast } from 'react-toastify'; // Importing toast for notification
import ListTodos from './ListTodos'; // Importing ListTodos component for displaying the todos

const Todos = () => {
  const [todos, SetTodos] = useState([]); // State to store the list of todos

  // useEffect hook to fetch todos on component mount
  useEffect(() => {
    const getTodos = async () => {
      try {
        const result = await getTodosByUserId(); // Fetching todos by user ID
        if (result?.data) {
          SetTodos(result.data); // Setting the todos data if the response is valid
        } else {
          console.error("Unexpected response format:", result);
          SetTodos([]); // Setting empty array if response is not as expected
        }
      } catch (error) {
        console.log('Failed to get todos', error);
        SetTodos([]); // Setting empty array on error
      }
    }
    getTodos(); // Calling getTodos function on component mount
  }, []);

  // Function to handle the todo update
  const handleUpdateTodo = async (id, data) => {
    try {
      await updateTodosByUserId(id, data); // Updating todo by user ID
      // Updating the todo in the state after successful update
      SetTodos(prevTodos => prevTodos.map(todo => todo.id === id ? { ...todo, ...data } : todo)); 
    } catch (error) {
      console.log('Failed to update todo');
      toast.error('Failed to update todo'); // Displaying error toast if update fails
    }
  }

  // Function to handle the todo delete
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodosByUserId(id); // Deleting the todo by user ID
      // Removing the deleted todo from the state
      SetTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully'); // Displaying success toast if delete is successful
    } catch (error) {
      console.log('Failed to delete todo');
      toast.error('Failed to delete todo'); // Displaying error toast if delete fails
    }
  }

  return (
    <div className='container mx-auto p-6'>
      {/* Passing the todos, update and delete handlers to the ListTodos component */}
      <ListTodos
        todos={todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  )
}

export default Todos;