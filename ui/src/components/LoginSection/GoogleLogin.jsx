import React from 'react'

const ApiUrl = 'http://localhost:8080';

const GoogleLogin = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${ApiUrl}/auth/google`
    }
  return (
    <div>
        <button
                onClick={handleGoogleLogin}
                className='flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >Log in with Google
              </button>
    </div>
  )
}

export default GoogleLogin