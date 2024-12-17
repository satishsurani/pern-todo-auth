import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signinUser, signupUser } from './../../service/auth.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './../../utils/Loader';
import { authRequest, authSuccess } from '../../redux/authSlice';


const Login = () => {
  const [IsSignUp, setIsSignUp] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const { loading } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const signinSchema = yup.object().shape({
    email: yup.string().email('invalid email formate').required('Email is required'),
    password: yup.string().min(6, 'password must be at least 6 characters').required('password is required'),
  })

  const signupSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    email: yup.string().email('invalid email formate').required('Email is required'),
    password: yup.string().min(6, 'password must be at least 6 characters').required('password is required'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(IsSignUp ? signupSchema : signinSchema)
  })

  const toggleSignUp = () => {
    setIsSignUp(!IsSignUp)
  }

  const togglePassword = () => {
    setshowPassword(!showPassword)
  }

  const onSubmit = async (data) => {
    dispatch(authRequest())
    try {
      if (IsSignUp) {
        const result = await signupUser(data);
        if (result.status === 'success') {
          dispatch(authSuccess(result.data))
          toast.success(result.message);
          navigate('/verify-otp')
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await signinUser(data);
        if (result.status === 'success') {
          toast.success(result.message);
          navigate('/')
        } else {
          toast.error(result.message || 'login failed . pleaase check your email and password')
        }
      }
    } catch (error) {
      toast.error('an unexpected error')
    }
    finally {
      reset();
    }
  }

  const handleForgotPassword = () => {
    // e.preventDefault()
    navigate('/forgot-password')
  }

  return (
    <div className='flex min-h-full justify-center px-6 py-12 lg:px-0 nt-32'>
      <div className='flex flex-col justify-center w-full px-4 py-10 md:px-0 max-w-md space-y-6 shadow-lg rounded-l-lg'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            alt='your company logo'
            src='https://cdn-icons-png.flaticon.com/256/295/295128.png'
            className='mx-auto h-10 w-auto'
          />
          <h2 className='nt-10 text-center font-bold text-2xl leading-9 tracking-tight text-grey-900'>
            {IsSignUp ? 'Create your account' : 'Sign in your account'}
          </h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {IsSignUp && (
              <div>
                <label htmlFor="name" className='flex text-sm font-medium leading-6 text-grey-900'>Name</label>
                <div className='mt-2'>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    {...register('name')}
                    className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'></input>
                  {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className='flex text-sm font-medium leading-6 text-grey-900'>Email</label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='eamil'
                  type='email'
                  {...register('email')}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'></input>
                {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className='flex text-sm font-medium leading-6 text-grey-900'>Password</label>
              <div className='mt-2 relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'></input>
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer'
                  onClick={togglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
              </div>
            </div>

            {!IsSignUp && <div className='text-sm flex mt-2'>
              <button className='font-semibold text-indigo-600 hover:text-indigo-400' onClick={handleForgotPassword}>
                Forgot Password
              </button>
            </div>
            }

            <div>
              <button type='submit' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                {loading ? <Loader /> : (IsSignUp ? 'Create Account' : 'sign in')}
              </button>
            </div>
          </form>

          <p className='mt-5 text-center text-sm text-gray-500'>
            {IsSignUp ? 'Already have an account !' : 'Not an account?'}{' '}
            <button type='button' onClick={toggleSignUp} className='font-semibold leading-6 text-indigo-600 hover:text-indigo-400'>
              {IsSignUp ? 'sign in' : 'create account'}
            </button>
          </p>
        </div>
      </div>

      <div className='hidden md:flex md:items-center md:justify-center md:w-1/2'>
        <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1733650617~exp=1733654217~hmac=1d251757095209670f1626cd6e08aea2e030a40bb27177a79c0f6f8ccc8ea30b&w=940" alt="Login_Img" className='object-cover w-3/4 h-full shadow-md rounded-r-lg' />
      </div>
    </div >
  )
}

export default Login