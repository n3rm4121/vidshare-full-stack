import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/UserSlice'
import videosReducer from '../features/videosSlice'
import menuReducer from '../features/MenuSlice'
import notificationReducer from '../features/NotificationSlice'
const store = configureStore(
    {
        reducer: {
            user: userReducer,
            videos: videosReducer,
            menu: menuReducer,
            notifications: notificationReducer,
            devTools: process.env.NODE_ENV !== 'production',
        },

    }
);

export default store;