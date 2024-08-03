import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import axiosInstance from '../utils/axiosInstance'

export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async() => {
    const response = await axiosInstance.get('/notifications');
    return response.data.data.notifications;
    
});

export const markNotificationsRead = createAsyncThunk('notifications/markNotificationsRead', async() => {
  await axiosInstance.put('/notifications/mark-read')
})


const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
      notifications: [],
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchNotifications.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchNotifications.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.notifications = action.payload;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(markNotificationsRead.fulfilled, (state) => {
            state.notifications?.forEach((notification) => {
              notification.isRead = true;
            });
          });
        
    }
})

// Selector to get unread notifications count
 export const selectUnreadNotificationsCount = (state) => {
  return state.notifications?.notifications?.filter((notification) => !notification.isRead).length;
}



export default notificationSlice.reducer;
