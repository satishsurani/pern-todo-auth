import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { otpVerify, resetPassword } from '../../service/auth.service'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  // State to manage the loading state (used to show loader during API call)
  const [loading, SetLoading] = useState(false)

  // React Hook Form (RHF) setup, for form validation and submission handling
  const { handleSubmit, control, setValue, register } = useForm({
    defaultValues: {
      verificationOTP: ['', '', '', '', '', ''] // Initialize OTP fields with empty values
    }
  })

  // State to hold OTP input values entered by the user
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', ''])

  // Navigate hook to programmatically redirect to other routes
  const navigate = useNavigate()

  // The function to handle form submission when the user submits the reset password form
  const onSubmit = async (data) => {
    SetLoading(true) // Show loader when starting the reset password request
    const otp = data.verificationOTP.join('') // Join all OTP input fields into a single string
    const newPassword = data.newPassword; // Capture new password from form data

    try {
      // Send a request to reset the password using the OTP and new password
      const result = await resetPassword({ verificationOTP: otp, newPassword })

      // Handle successful password reset response
      if (result.status === 'success') {
        toast.success(result.message || 'Password Reset successfully') // Show success message
        navigate('/login') // Redirect to login page after successful reset
      } else {
        toast.error(result.message || 'Reset Password failed') // Show error message if reset fails
      }
    } catch (error) {
      // Handle unexpected errors during the reset password process
      toast.error('An error occurred while Reset Password') // Show error toast
    }
    SetLoading(false) // Hide loader after the operation finishes
  }

  // Function to handle input changes for the OTP fields, validates the input and manages focus navigation
  const handleInputChange = (index, value) => {
    // Only accept digits as input, and update the OTP value array
    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtpValue = [...otpValue]
      newOtpValue[index] = value
      setOtpValue(newOtpValue) // Update the state with new OTP value
      setValue('verificationOTP', newOtpValue) // Update form value in React Hook Form

      // Automatically focus on the next OTP input if a valid digit is entered
      if (index < otpValue.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus() // Focus next input field
      }
    }
  }

  // Function to handle backspace key press: if backspace is pressed on an empty input field, move focus to previous field
  const handleBackSpaceRemove = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index]) { // If backspace is pressed and the current field is empty
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus() // Focus previous OTP input field
      }
    }
  }

  // Function to handle paste action: allows users to paste OTP directly into the fields
  const handlePaste = (e) => {
    e.preventDefault() // Prevent the default paste behavior
    const pasteData = e.clipboardData.getData('text').split('') // Split the pasted OTP into individual characters
    if (pasteData.length === otpValue.length) {
      setOtpValue(pasteData) // Set the OTP value state with the pasted data
      setValue('verificationOTP', pasteData) // Update the React Hook Form value with the new OTP
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-800'>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <header className='mb-8 text-center'>
          {/* Title and Description for the reset password page */}
          <h1 className='text-3xl font-bold mb-2'>Reset Password</h1>
          <p className='text-sm text-gray-400'>
            Enter the 6-digit Verification code that was sent to your email.
          </p>
        </header>

        {/* Form for resetting password */}
        <form onSubmit={handleSubmit(onSubmit)} id='reset-password-form'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            {/* OTP Input Fields */}
            {otpValue.map((value, index) => (
              <Controller
                key={index}
                name={`verificationOTP[${index}]`}
                control={control}
                render={() => (
                  <input
                    id={`otp-input-${index}`} // Set unique ID for each OTP input field
                    type='text'
                    value={otpValue[index]} // Bind OTP value to each input field
                    onChange={(e) => handleInputChange(index, e.target.value)} // Handle input change
                    onKeyDown={(e) => handleBackSpaceRemove(index, e)} // Handle backspace key
                    onPaste={handlePaste} // Handle paste event
                    maxLength={1} // Allow only one digit per input field
                    className='w-14 h-14 text-center text-2xl text-gray-900 bg-gray-700 border border-gray-600 rounded-md outline-none focus:ring-1 focus:ring-indigo-500'
                  />
                )}
              />
            ))}
          </div>

          {/* New Password Input Field */}
          <div className='mb-6'>
            <label htmlFor="newPassword" className='flex text-sm font-medium leading-6 text-white mb-1'>Enter a new password</label>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <input
                  id='newPassword'
                  name='newPassword'
                  type={'password'}
                  {...register('newPassword')}
                  className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className='text-center'>
            <button
              type='submit'
              className='w-full inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/50 hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150'
            >
              {/* Display loading state when the form is submitting */}
              Reset Password
            </button>
          </div>
        </form>

        {/* Resend OTP Link */}
        <div className='text-sm text-gray-400 text-center mt-4'>
          Didn't receive the code?{' '}
          <a className='font-medium text-indigo-400 hover:text-indigo-300' href='#'>
            Resend
          </a>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword