import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const fetchAllVideos = createAsyncThunk(
  'videos/fetchAllVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/videos`);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please try again later.' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);




const videosSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    loading: false,
    error: null,
 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
  },
});

export default videosSlice.reducer;
