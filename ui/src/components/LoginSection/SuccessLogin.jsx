import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../service/auth.service';
import Loader from './../../utils/Loader'; // Assuming you have a Loader component

function SuccessLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // State for managing loading status

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                await fetchUserProfile(); // Fetch the user profile
                navigate('/'); // Redirect to the home page if successful
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/login'); // Redirect to login page on error
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        authenticateUser();
    }, [dispatch, navigate]);

    if (loading) {
        return <Loader />; // Show a loading spinner while fetching data
    }

    return <div>Redirecting...</div>; // Display a message while redirection occurs
}

export default SuccessLogin;