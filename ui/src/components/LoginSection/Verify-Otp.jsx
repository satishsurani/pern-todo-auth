import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { otpVerify } from '../../service/auth.service'
import { toast } from 'react-toastify'

const VerifyOtp = () => {
  // useForm hook from react-hook-form to handle form inputs and validations
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      verificationOTP: ['', '', '', '', '', ''] // Default values for the 6 OTP input fields
    }
  })

  // useNavigate hook to programmatically redirect the user after successful verification
  const navigate = useNavigate()

  // State to hold the OTP input values (6 digits) entered by the user
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', ''])

  // The function that is called when the form is submitted
  const onSubmit = async (data) => {
    const otp = data.verificationOTP.join('') // Join the OTP array into a single string
    try {
      // Call the otpVerify function to verify the OTP entered by the user
      const result = await otpVerify({ verificationOTP: otp })
      // Handle the response from the server (whether OTP verification succeeded or failed)
      if (result.status === 'success') {
        toast.success(result.message || 'Account verified successfully! Redirecting to home page...')
        navigate('/') // Redirect to the home page after successful verification
      } else {
        toast.error(result.message || 'OTP verification failed') // Show error message if verification fails
      }
    } catch (error) {
      // Catch any unexpected errors during the OTP verification process
      toast.error('An error occurred while verifying OTP') // Show error toast
    }
  }

  // Function to handle the input change for OTP fields
  const handleInputChange = (index, value) => {
    // Validate that only numbers (digits) are allowed as input
    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtpValue = [...otpValue] // Create a copy of the OTP array
      newOtpValue[index] = value // Update the value of the current OTP field
      setOtpValue(newOtpValue) // Update the state with the new OTP array
      setValue('verificationOTP', newOtpValue) // Update the form values in react-hook-form

      // Automatically focus on the next OTP field if the current field is filled
      if (index < otpValue.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus() // Focus next OTP field
      }
    }
  }

  // Function to handle backspace key press: If the current input field is empty, focus the previous field
  const handleBackSpaceRemove = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index]) { // If backspace is pressed on an empty input field
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus() // Focus the previous OTP input field
      }
    }
  }

  // Function to handle paste operation (allows user to paste the OTP into the fields)
  const handlePaste = (e) => {
    e.preventDefault() // Prevent default paste behavior to handle custom paste logic
    const pasteData = e.clipboardData.getData('text').split('') // Split pasted text into an array
    if (pasteData.length === otpValue.length) {
      setOtpValue(pasteData) // Set the state with the pasted OTP
      setValue('verificationOTP', pasteData) // Update the form values in react-hook-form with the pasted OTP
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-800'>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        {/* Page header */}
        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>Email Verification</h1>
          <p className='text-sm text-gray-400'>
            Enter the 6-digit Verification code that was sent to your email address.
          </p>
        </header>

        {/* OTP input form */}
        <form onSubmit={handleSubmit(onSubmit)} id='otp-form'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            {/* Render 6 OTP input fields dynamically */}
            {otpValue.map((value, index) => (
              <Controller
                key={index}
                name={`verificationOTP[${index}]`} // Use react-hook-form's Controller to handle each OTP field
                control={control}
                render={() => (
                  <input
                    id={`otp-input-${index}`} // Unique ID for each input field
                    type='text'
                    value={otpValue[index]} // Bind OTP value to the input field
                    onChange={(e) => handleInputChange(index, e.target.value)} // Handle input change
                    onKeyDown={(e) => handleBackSpaceRemove(index, e)} // Handle backspace key
                    onPaste={handlePaste} // Handle paste operation
                    maxLength={1} // Each input field accepts only 1 character
                    className='w-14 h-14 text-center text-2xl text-gray-900 bg-gray-700 border border-gray-600 rounded-md outline-none focus:ring-1 focus:ring-indigo-500'
                  />
                )}
              />
            ))}
          </div>

          {/* Submit button to verify OTP */}
          <div className='text-center'>
            <button
              type='submit'
              className='w-full inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/50 hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150'
            >
              Verify Account
            </button>
          </div>
        </form>

        {/* Resend OTP link */}
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

export default VerifyOtp