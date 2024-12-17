import React, { useState } from 'react'
import { useSelector } from "react-redux"; // Importing useSelector to access Redux store
import { logout } from '../../service/auth.service'; // Importing logout function from the service
import { toast } from 'react-toastify'; // Importing toast for displaying notifications
import { Navigate, useNavigate } from 'react-router-dom'; // Importing navigation hooks

function Navbar() {
    // State to handle dropdown menu visibility
    const [dropDownOpen, setDropDownOpen] = useState(false);
    
    // Extracting user data and authentication status from Redux store
    const { user, isAuthenticated } = useSelector(state => state.auth);
    
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to toggle the dropdown visibility
    const toogleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    };

    // Function to handle user sign-out (logout)
    const handleSignOut = async () => {
        try {
            const result = await logout(); // Call the logout function from the service
            if (result.status === 'success') {
                toast.success(result.message); // Display success message
            }
        } catch (error) {
            console.log(error); // Log the error in case logout fails
            toast.error('Failed to log out. Please try again later'); // Display error message
        }
    };

    // Function to navigate to the login page if not authenticated
    const handleLoginPage = () => {
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className='bg-gray-500 shadow-xl'>
            {/* Container for navbar content */}
            <div className='container mx-auto flex items-center justify-between py-4 px-6'>
                
                {/* Left side: Logo or App Name */}
                <div className='flex items-center space-x-4'>
                    <div className='text-2xl font-bold text-gray-800'>
                        <h2>Todos</h2> {/* Display app name */}
                    </div>
                </div>

                {/* Right side: User Profile or Sign-In button */}
                <div className='flex lg:space-x-6'>
                    {/* Check if user is authenticated */}
                    {isAuthenticated ? (
                        // If authenticated, show user profile with dropdown
                        <div className='relative'>
                            <button className='flex items-center text-gray-800 focus:outline-none' onClick={toogleDropDown}>
                                {/* User profile image and name */}
                                <img src={user?.profileImage || 'https://img.freepik.com/free-psd/3d-rendering-boy-avatar-emoji_23-2150603406.jpg?ga=GA1.1.2011796137.1726245558&semt=ais_hybrid'} 
                                     alt="user profile" 
                                     className='w-8 h-8 rounded-full object-cover' />
                                <span className='ml-2'>{user?.name}</span> {/* Display user name */}
                            </button>

                            {/* Dropdown menu, appears when dropdown is open */}
                            {dropDownOpen && (
                                <div className='absolute right-0 left-4 mt-2 w-48 h-24 bg-white shadow-lg border border-gray-300 rounded'>
                                    {/* Profile button (can be added functionality later) */}
                                    <button className='block px-2 py-2 text-gray-800 hover:bg-gray-100 w-full text-left'>
                                        Profile
                                    </button>
                                    {/* SignOut button */}
                                    <button className='block px-2 py-2 text-gray-800 hover:bg-gray-100 w-full text-left' onClick={handleSignOut}>
                                        SignOut
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // If not authenticated, show the 'Sign In' button
                        <button onClick={handleLoginPage} 
                                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;