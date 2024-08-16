
# VidShare

VidShare is a full-stack video-sharing platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to upload, view, and search for videos, as well as interact with other users through notifications and user profiles.

## Features

-   **Email Verification**: Users must verify their email addresses upon signup to be able to login.
-   **Google Sign-In**: Users can sign in using their Google accounts for a seamless login experience.
-   **Video Upload and Management**: Users can upload their videos, which are then stored and managed in the platform.
-   **Video Playback**: Users can view videos on the platform with a modern, responsive player.
-   **Search Functionality**: Search for videos based on keywords and filter results.
-   **User Profiles**: Users have personalized profiles where they can view their uploaded videos and manage their account settings.
-   **Notifications**: Real-time notifications for user interactions.
-   **Responsive Design**: Fully responsive design to ensure usability on both mobile and desktop devices.

## Technologies Used

-   **Frontend**:
    -   React
    -   Tailwind CSS
    -   Redux Toolkit for state management
    -   React Router for routing
    -   React Icons for UI icons
-   **Backend**:
    -   Node.js
    -   Express.js
    -   MongoDB
    -   Mongoose for MongoDB object modeling
    -   Cloudinary for storage


## Project Setup

To set up the VidShare project, follow these steps:

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/n3rmal/vidshare-full-stack.git
    ```

2. Navigate to the project directory:
    ```
    cd vidshare-full-stack
    ```

3. Install the dependencies for the frontend:
    ```
    cd frontend
    npm i
    ```

4. Install the dependencies for the backend:
    ```
    cd ../backend
    npm i
    ```

5. Create a `.env` file in the `backend` directory and add the following environment variables:

```
PORT = 8000
MONGODB_URI = <yourmongodburi>
CORS_ORIGIN = http://localhost:5173
ACCESS_TOKEN_SECRET = <yourAccessToken>
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = <yourRefreshToken>
REFRESH_TOKEN_EXPIRY = 10d
CLOUDINARY_CLOUD_NAME = <yourCloudinaryCloudName>
CLOUDINARY_API_KEY = <yourapikey>
CLOUDINARY_API_SECRET = <yoursecret>

# Email service configuration
EMAIL_USERNAME = <yourEmailUsername>
EMAIL_PASSWORD = <yourAppPassword>
EMAIL_PORT = 465
EMAIL_HOST = smtp.gmail.com

# Google OAuth configuration
GOOGLE_CLIENT_ID = <yourGoogleClientID>

```

6.  Create a `.env` file in the `frontend` directory and add the following environment variables:

   ```
VITE_REACT_APP_BASE_URL = <yourLocalServerURL>
VITE_REACT_APP_GOOGLE_CLIENT_ID = <yourGoogleClientID>
VITE_REACT_APP_CLOUD_NAME = <yourCloudinaryCloudName>
```
   
8. Start the frontend development server:
    ```
    cd ../frontend
    npm run dev
    ```

9. Start the backend server:
    ```
    cd ../backend
    npm run dev
    ```

10. Open your browser and navigate to `http://localhost:5173` to access the VidShare application.

That's it! You have successfully set up the VidShare project on your local machine.
