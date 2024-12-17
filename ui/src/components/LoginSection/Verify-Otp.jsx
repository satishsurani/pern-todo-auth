import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { otpVerify } from '../../service/auth.service'
import { toast } from 'react-toastify'

const VerifyOtp = () => {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      verificationOTP: ['', '', '', '', '', '']
    }
  })

  const navigate = useNavigate()
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', ''])

  const onSubmit = async (data) => {
    const otp = data.verificationOTP.join('')
    try {
      const result = await otpVerify({ verificationOTP: otp })
      if (result.status === 'success') {
        toast.success(result.message || 'Account verified successfully! Redirecting to home page...')
        navigate('/')
      } else {
        toast.error(result.message || 'OTP verification failed')
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP')
    }
  }

  const handleInputChange = (index, value) => {
    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtpValue = [...otpValue]
      newOtpValue[index] = value
      setOtpValue(newOtpValue)
      setValue('verificationOTP', newOtpValue)
      if (index < otpValue.length - 1 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus() // Fix here for correct navigation
      }
    }
  }

  const handleBackSpaceRemove = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index]) {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').split('')
    if (pasteData.length === otpValue.length) {
      setOtpValue(pasteData)
      setValue('verificationOTP', pasteData)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-800'>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <header className='mb-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>Email Verification</h1>
          <p className='text-sm text-gray-400'>
            Enter the 6-digit Verification code that was sent to your email address.
          </p>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} id='otp-form'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            {otpValue.map((value, index) => (
              <Controller
                key={index}
                name={`verificationOTP[${index}]`}
                control={control}
                render={() => (
                  <input
                    id={`otp-input-${index}`}
                    type='text'
                    value={otpValue[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleBackSpaceRemove(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className='w-14 h-14 text-center text-2xl text-gray-900 bg-gray-700 border border-gray-600 rounded-md outline-none focus:ring-1 focus:ring-indigo-500'
                  />
                )}
              />
            ))}
          </div>
          <div className='text-center'>
            <button
              type='submit'
              className='w-full inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/50 hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150'
            >
              Verify Account
            </button>
          </div>
        </form>
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
