import React from 'react';

// Define the base URL for the backend API
const ApiUrl = 'http://localhost:8080';

const GoogleLogin = () => {
    // Function to handle the Google login click
    const handleGoogleLogin = () => {
        // Redirect the user to the Google login route of the backend server
        // This triggers the OAuth flow by redirecting the user to Google
        window.location.href = `${ApiUrl}/auth/google`;
    }

  return (
    <div>
        {/* Button to trigger Google login */}
        <button
                onClick={handleGoogleLogin}  // On click, call handleGoogleLogin to initiate OAuth
                className='flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
            Log in with Google
        </button>
    </div>
  )
}

export default GoogleLogin;