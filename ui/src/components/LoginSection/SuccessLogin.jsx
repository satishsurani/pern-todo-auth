import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../service/auth.service';

function SuccessLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                await fetchUserProfile();
                navigate('/');
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/login'); 
            }
        };
    
        authenticateUser();
    }, [dispatch, navigate]);

    return <div>Loading....</div>;
}

export default SuccessLogin;
