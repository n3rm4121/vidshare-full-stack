import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const login = createAsyncThunk(
  'user/login',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', userCredentials);
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching liked videos
export const fetchLikedVideos = createAsyncThunk(
  'user/fetchLikedVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/likes/liked-videos');
      return response.data.data.likedVideos;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSubscriptions = createAsyncThunk(
  'user/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subscription/subscribed');
     // console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk for fetching disliked videos
export const fetchDislikedVideos = createAsyncThunk(
  'user/fetchDislikedVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/likes/disliked-videos');
      return response.data.data.dislikedVideos;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register', userDetails);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserVideos = createAsyncThunk(
  'user/fetchUserVideos',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/c/${username}/videos`);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserVideo = createAsyncThunk(
  'user/deleteUserVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/videos/${videoId}`);
      return videoId; // Return the ID of the deleted video
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/current-user');
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'videos/uploadVideo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/videos/upload', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data; // Modify according to your API response
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);
// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  dispatch(clearUser());
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    success: false,
    user: null,
    videos: [], // user videos
    error: null,
    likedVideos: [],
    dislikedVideos: [],
    subscriptions: [],
    uploadStatus: {loading: false, message: ''}
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setLikedVideos(state, action) {
      state.likedVideos = action.payload;
    },
    setDislikedVideos(state, action) {
      state.dislikedVideos = action.payload;
    },
    setUserVideos(state, action) {
      state.videos = action.payload;
    },
    updateSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLikedVideos.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.likedVideos = action.payload;
        state.error = null;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDislikedVideos.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDislikedVideos.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.dislikedVideos = action.payload;
        state.error = null;
      })
      .addCase(fetchDislikedVideos.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserVideos.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserVideos.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.videos = action.payload;
        state.error = null;
      })
      .addCase(fetchUserVideos.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserVideo.pending, (state) => {
        state.success = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserVideo.fulfilled, (state, action) => {
        state.success = true
        state.loading = false;
        state.error = null;
        // Remove the deleted video from the list
        state.videos = state.videos.filter(video => video._id !== action.payload);
      })
      .addCase(deleteUserVideo.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadVideo.pending, (state) => {
        state.uploadStatus = { loading: true, message: 'Uploading' };
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploadStatus = { loading: false, message: "Video uploaded successfully!" };
        
        state.videos.push(action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploadStatus = { loading: false, message: action.payload.message || 'Upload failed' };
      })
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { setUser, clearUser, setLikedVideos, setDislikedVideos, setUserVideos, updateSubscriptions } = userSlice.actions;
export default userSlice.reducer;
