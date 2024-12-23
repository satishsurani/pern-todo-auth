import React from 'react'
import { useForm } from 'react-hook-form'; // Import useForm hook from react-hook-form
import { yupResolver } from '@hookform/resolvers/yup'; // To integrate Yup schema validation
import * as Yup from 'yup' // Import Yup for schema validation
import { createTodo } from '../../service/todo.service'; // Function to create a todo
import { toast } from 'react-toastify'; // For showing notifications
import { useNavigate } from 'react-router-dom'; // For navigation after form submission
import Loader from './../../utils/Loader'; // Loading spinner component

const CreateTodo = () => {

    // Define Yup validation schema for the form
    const todoSchema = Yup.object().shape(
        {
            title: Yup.string().required('Title is required'), // Title is required
            description: Yup.string().optional(), // Description is optional
            dueDate: Yup.date()
                .required('Due date is required') // Due date is required
                .min(new Date().toISOString(), 'Due Date cannot be in the past') // Ensure due date is not in the past
        }
    )

    // useForm hook with yupResolver for validation integration
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(todoSchema) // Use the schema defined above for form validation
    })

    const navigate = useNavigate() // Navigate hook to redirect after success
    const [loading, setLoading] = React.useState(false); // State to manage loading status during form submission

    // Form submission handler
    const onsubmit = async (data) => {
        setLoading(true); // Set loading to true when form is submitted
        try {
            const result = await createTodo(data) // Call the createTodo function to send data to the backend
            toast.success('Todo created successfully') // Show success message
            reset() // Reset the form fields after successful submission
            navigate('/todos-list') // Navigate to the todos list page
        } catch (error) {
            console.error(error) // Log error to the console for debugging
            toast.error('Failed to create todo') // Show error message if the request fails
        } finally {
            setLoading(false); // Set loading to false once the request is complete
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-indigo-400 to-pink-600'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-3xl font-semibold text-center text-gray-900'>Create Your New Todo!</h2>
                {/* Form starts here */}
                <form onSubmit={handleSubmit(onsubmit)} className='space-y-6'>
                    
                    {/* Title input field */}
                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Title
                        </label>
                        <input
                            {...register('title')} // Register the title field with react-hook-form
                            type='text'
                            placeholder='Enter Todo title'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border ${errors.title ? "border-red-500" : "border-red-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                        {/* Display error message for title if validation fails */}
                        {errors.title && (
                            <p className='text-red-500 text-sm mt-2 text-left'>{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description input field */}
                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Description (Optional)
                        </label>
                        <textarea
                            {...register('description')} // Register the description field
                            placeholder='Enter Todo Description'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border ${errors.description ? "border-red-500" : "border-red-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                    </div>

                    {/* Due Date input field */}
                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Due Date
                        </label>
                        <input
                            {...register('dueDate')} // Register the due date field
                            type='date'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                        {/* Display error message for due date if validation fails */}
                        {errors.dueDate && (
                            <p className='text-red-500 text-sm mt-2 text-left'>{errors.dueDate.message}</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type='submit'
                        disabled={loading} // Disable button if the form is submitting
                        className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-400 to-pink-600 hover:from-indigo-600 hover:via-purple-400 hover:to-pink-600 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <Loader /> : 'Create Todo'} {/* Show loading spinner if submitting */}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateTodo;