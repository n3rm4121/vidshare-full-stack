import React from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

const responseGoogleSuccess = async (credentialResponse) => {

    try {
        const res = await axios.post(`${baseURL}/auth/google`, {
            token: credentialResponse.credential
        });
    
        if(res.status === 200) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.user.refreshToken);

            window.location.href = '/';
        }
    } catch (error) {
        console.error(error);
     
    
};
}

const responseGoogleFailure = (response) => {
    console.log("login failed ", response);
}

const GoogleSignIn = () => {
    return (
        <div className="w-full flex text-center justify-center mt-6">

        <GoogleOAuthProvider clientId= {import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID} >
            <GoogleLogin
                type='button'
                text='Sign in with Google'
                onSuccess={responseGoogleSuccess}
                onError= {responseGoogleFailure}
            />
        </GoogleOAuthProvider>
        </div>
    )
};

export default GoogleSignIn;
