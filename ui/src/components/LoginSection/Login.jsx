import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // For managing form data and validation
import * as yup from 'yup'; // For defining validation schemas
import { yupResolver } from '@hookform/resolvers/yup'; // To integrate yup validation with react-hook-form
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For password visibility toggle icons
import { signinUser, signupUser } from './../../service/auth.service'; // Service calls for login and signup
import { toast } from 'react-toastify'; // For showing toast notifications
import { useNavigate } from 'react-router-dom'; // For navigation
import { useDispatch, useSelector } from 'react-redux'; // Redux for state management
import Loader from './../../utils/Loader'; // Loading spinner component
import { authRequest, authSuccess } from '../../redux/authSlice'; // Redux actions for auth state
import GoogleLogin from './GoogleLogin'; // Google login component

const Login = () => {
  // State to toggle between Sign Up and Sign In
  const [IsSignUp, setIsSignUp] = useState(false);
  // State to toggle password visibility
  const [showPassword, setshowPassword] = useState(false);
  // Get loading state from Redux store
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch(); // Redux dispatch function

  const navigate = useNavigate(); // React Router's navigate function for page redirection

  // Sign In schema using yup for validation
  const signinSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Sign Up schema using yup for validation
  const signupSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // useForm hook to handle form data and validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(IsSignUp ? signupSchema : signinSchema), // Use dynamic schema based on mode
  });

  // Function to toggle between Sign Up and Sign In mode
  const toggleSignUp = () => {
    setIsSignUp(!IsSignUp);
  };

  // Function to toggle password visibility
  const togglePassword = () => {
    setshowPassword(!showPassword);
  };

  // Form submission handler for both sign-up and sign-in
  const onSubmit = async (data) => {
    dispatch(authRequest()); // Dispatch action to set loading state to true
    try {
      if (IsSignUp) {
        // Handle Sign Up
        const result = await signupUser(data); // Call signup service
        if (result.status === 'success') {
          dispatch(authSuccess(result.data)); // Update Redux state on success
          toast.success(result.message); // Show success message
          navigate('/verify-otp'); // Redirect to OTP verification page
        } else {
          toast.error(result.message); // Show error message
        }
      } else {
        // Handle Sign In
        const result = await signinUser(data); // Call signin service
        if (result.status === 'success') {
          toast.success(result.message); // Show success message
          navigate('/'); // Redirect to home page after successful login
        } else {
          toast.error(result.message || 'Login failed. Please check your email and password'); // Show error message
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred'); // Catch and show unexpected errors
    } finally {
      reset(); // Reset form fields after submission
    }
  };

  // Navigate to forgot password page
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className='flex min-h-full justify-center px-6 py-12 lg:px-0 mt-10'>
      <div className='flex flex-col justify-center w-full px-4 py-10 md:px-0 max-w-md space-y-6 rounded-l-lg'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            alt='your company logo'
            src='https://cdn-icons-png.flaticon.com/256/295/295128.png' // Logo
            className='mx-auto h-10 w-auto'
          />
          <h2 className='text-center font-bold text-2xl leading-9 tracking-tight text-grey-900'>
            {IsSignUp ? 'Create your account' : 'Sign in your account'}
          </h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Sign-up fields (only shown when IsSignUp is true) */}
            {IsSignUp && (
              <div>
                <label htmlFor="name" className='text-sm font-medium leading-6 text-grey-900'>Name</label>
                <div className='mt-2'>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    {...register('name')}
                    className='block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
                </div>
              </div>
            )}

            {/* Common Email field */}
            <div>
              <label htmlFor="email" className='text-sm font-medium leading-6 text-grey-900'>Email</label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email' // Fixed typo 'eamil' to 'email'
                  type='email'
                  {...register('email')}
                  className='block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className='text-sm font-medium leading-6 text-grey-900'>Password</label>
              <div className='mt-2 relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                <div
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer'
                  onClick={togglePassword} // Toggle password visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on visibility */}
                </div>
                {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
              </div>
            </div>

            {/* Forgot password link (only shown when not in sign-up mode) */}
            {!IsSignUp && (
              <div className='text-sm flex mt-2'>
                <button
                  className='font-semibold text-indigo-600 hover:text-indigo-400'
                  onClick={handleForgotPassword}
                >
                  Forgot Password
                </button>
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type='submit'
                className='w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-600'
              >
                {loading ? <Loader /> : (IsSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </div>
          </form>
          
          {/* Google login button */}
          <div className='mt-4'>
            <GoogleLogin />
          </div>

          {/* Sign-up/sign-in toggle */}
          <p className='mt-5 text-center text-sm text-gray-500'>
            {IsSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
            <button
              type='button'
              onClick={toggleSignUp} // Toggle between sign-up and sign-in
              className='font-semibold text-indigo-600 hover:text-indigo-400'
            >
              {IsSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>

      {/* Image on the right for larger screens */}
      <div className='hidden md:flex md:items-center md:justify-center md:w-1/2'>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Login_Img"
          className='object-cover w-3/4 h-full shadow-md rounded-r-lg'
        />
      </div>
    </div>
  );
};

export default Login;