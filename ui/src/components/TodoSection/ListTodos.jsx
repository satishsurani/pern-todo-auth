import React, { useState } from 'react'
import { useForm } from 'react-hook-form' // Importing useForm hook from react-hook-form for form handling
import { FaCheck, FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa' // Importing icons for actions
import { useNavigate } from 'react-router-dom' // Importing useNavigate hook for page navigation

const ListTodos = ({ todos, onUpdate, onDelete }) => {
    const [isTodoEdit, SetIsTodoEdit] = useState(false) // State to manage whether a todo is being edited
    const [currentTodo, SetCurrentTodo] = useState(null) // State to store the current todo being edited

    const { register, handleSubmit, reset } = useForm() // Initializing react-hook-form for handling form submissions

    const navigate = useNavigate() // To navigate between pages

    // Function to navigate to the create todo page
    const handleCreateTodo = () => {
        navigate('/create-todos')
    }

    // Function to handle editing a todo
    const handleEdit = (todo) => {
        // Format the due date to the correct view format (yyyy-mm-dd)
        const formateViewDate = new Date(todo.dueDate).toISOString().split('T')[0];
        SetCurrentTodo({ ...todo, dueDate: formateViewDate }) // Set the current todo to be edited
        SetIsTodoEdit(true) // Set the state to show the edit modal
    }

    // Function to handle the todo update form submission
    const handleUpdate = async (data) => {
        await onUpdate(currentTodo.id, data) // Update the todo using the passed onUpdate function
        SetIsTodoEdit(false) // Close the edit modal
        reset() // Reset the form after submission
    }

    // Helper function to format the date in a human-readable format
    const formateDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleString(undefined, options)
    }

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold '>Your Todos List</h1>
                <button onClick={handleCreateTodo}
                    className='flex items-center px-4 py-2 bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-700 transition'
                >
                    <FaPlus className='mr-3' />Create New Todo
                </button>
            </div>

            {/* Modal for editing todo */}
            {isTodoEdit && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
                        <h2 className='text-xl font-bold mb-4'>Update Your Todo</h2>

                        {/* Todo update form */}
                        <form onSubmit={handleSubmit(handleUpdate)} className='space-y-6'>
                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Title
                                </label>
                                <input
                                    {...register('title')} // Register input for title
                                    type='text'
                                    defaultValue={currentTodo?.title} // Set default value for title from currentTodo
                                    placeholder='Enter Todo title'
                                    className='mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Description
                                </label>
                                <textarea
                                    {...register('description')} // Register input for description
                                    defaultValue={currentTodo?.description} // Set default value for description
                                    placeholder='Enter Todo Description'
                                    className='mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Due Date
                                </label>
                                <input
                                    {...register('dueDate')} // Register input for due date
                                    defaultValue={currentTodo?.dueDate} // Set default value for due date
                                    type='date'
                                    className='mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                                />
                            </div>

                            {/* Buttons for canceling or updating the todo */}
                            <div className='flex gap-2'>
                                <button onClick={() => SetIsTodoEdit(false)} type='submit' className='w-full py-3 px-4 bg-indigo-500 font-semibold rounded-md shadow-md hover:bg-red-600 transition'>
                                    Cancel
                                </button>
                                <button type='submit' className='w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition'>
                                    Update Todo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Todos List Section */}
            <div className='space-y-8'>
                <div>
                    <h2 className='text-xl font-semibold mb-4'>
                        Active Todos
                    </h2>

                    {/* Active todos table */}
                    <table className='min-w-full bg-white border border-gray-300 rounded-lg shadow-md'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 border-b text-left'>Title</th>
                                <th className='px-4 py-2 border-b text-left'>Description</th>
                                <th className='px-4 py-2 border-b text-left'>Due Date</th>
                                <th className='px-4 py-2 border-b text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Loop through the active todos and display them */}
                            {(todos || [])
                                .filter(todo => !todo.isCompleted) // Filter todos that are not completed
                                .map(todo => (
                                    <tr key={todo.id} className='hover:bg-gray-100 transition'>
                                        <td className='px-4 py-2 border-b text-left'>{todo.title}</td>
                                        <td className='px-4 py-2 border-b text-left'>{todo.description}</td>
                                        <td className='px-4 py-2 border-b text-left'>{formateDate(todo.dueDate)}</td>
                                        <td className='px-4 py-2 border-b flex space-x-2'>
                                            {/* Edit, Delete, and Complete Todo actions */}
                                            <FaEdit
                                                className='h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 transition'
                                                onClick={() => handleEdit(todo)} // Edit action
                                            />
                                            <FaTrashAlt
                                                className='h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition'
                                                onClick={() => onDelete(todo.id)} // Delete action
                                            />
                                            <FaCheck
                                                className='h-6 w-6 text-green-500 cursor-pointer hover:text-green-600 transition'
                                                onClick={() => onUpdate(todo.id, { isCompleted: true })} // Mark as completed action
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Completed Todos Section */}
                <div>
                    <h2 className='text-xl font-semibold mb-4'>
                        Completed Todos
                    </h2>

                    {/* Completed todos table */}
                    <table className='min-w-full bg-white border border-gray-300 rounded-lg shadow-md'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 border-b text-left'>Title</th>
                                <th className='px-4 py-2 border-b text-left'>Description</th>
                                <th className='px-4 py-2 border-b text-left'>Due Date</th>
                                <th className='px-4 py-2 border-b text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Loop through the completed todos and display them */}
                            {(todos || [])
                                .filter(todo => todo.isCompleted) // Filter todos that are completed
                                .map(todo => (
                                    <tr key={todo.id} className='hover:bg-gray-100 transition'>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{todo.title}</td>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{todo.description}</td>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{formateDate(todo.dueDate)}</td>
                                        <td className='px-4 py-2 border-b flex space-x-2'>
                                            <FaTrashAlt
                                                className='h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition'
                                                onClick={() => onDelete(todo.id)} // Delete action for completed todos
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListTodos