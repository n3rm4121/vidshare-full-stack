import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

const VerifyEmail = () => {
    const { userId, token } = useParams();
    const [message, setMessage] = useState('Verifying...');
    const navigate = useNavigate();
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.post(`${baseURL}/users/verify/${userId}/${token}`);
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } catch (error) {
                setMessage(error.response?.data?.message || 'Error verifying email. Please try again.');
            }
        };

        verifyUser();
    }, [userId, token, history]);

    return (
        <div>
            <h1>{message}</h1>
        </div>

    );
};

export default VerifyEmail;
