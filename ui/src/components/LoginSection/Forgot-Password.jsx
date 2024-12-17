import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // Importing useForm hook for form handling
import { useNavigate } from 'react-router-dom'; // Importing navigate for page redirection
import { toast } from 'react-toastify'; // Importing toast for notifications
import { forgotPassword } from '../../service/auth.service'; // Importing forgotPassword service
import Loader from '../../utils/Loader'; // Importing Loader component to show loading spinner

const ForgotPassword = () => {
  // Initialize form handling with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Hook for page navigation
  const navigate = useNavigate();
  
  // State to manage loading state for the button
  const [loading, SetLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      SetLoading(true); // Set loading to true while making the API call
      const result = await forgotPassword(data); // Call forgotPassword service with form data
      if (result.status === 'success') {
        // If the API call is successful, show success toast and navigate to reset-password page
        toast.success(result.message);
        navigate('/reset-password');
      } else {
        // If the email is not valid or some other issue, show error toast
        toast.error('Email is not valid');
      }
    } catch (error) {
      // Catch any errors during the process and show error toast
      console.error(error);
      toast.error('An error occurred while processing your request');
    } finally {
      SetLoading(false); // Set loading to false once the operation completes
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      {/* Main container */}
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full'>
        <h1 className='text-center text-2xl font-bold mb-6'>Forgot Password</h1>
        
        {/* Form for password reset */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            {/* Email label */}
            <label className='block text-gray-700 font-bold mb-2' htmlFor="email">
              Email Address
            </label>
            {/* Email input field with form validation */}
            <input
              id='email'
              name='email'
              type='email'
              {...register('email', {
                required: 'Email is required', // Validation rule for required email
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // Regex for email format validation
                  message: 'Enter a valid email address' // Error message for invalid email format
                }
              })}
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${errors.email ? 'border-red-500' : ''}`} 
            />
            {/* Display error message if email validation fails */}
            {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
            
            {/* Submit button, shows loader when loading */}
            <button type='submit' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4'>
              {loading ? <Loader /> : 'Reset Password'} {/* Conditionally show Loader or Button Text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;