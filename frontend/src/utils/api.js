import axiosInstance from "./axiosInstance"

export const incrementViewCount = async (videoId) => {
    try {
        const response = await axiosInstance.patch(`/videos/incrementViewCount/${videoId}`);
        return response.data.data;
    }catch(error){
        console.error('Error incrementing view count:', error);

    }
}

export const getUserChannelSubscribers = async (channelId) => {
    try {
        const response = await axiosInstance.get(`/subscription/subscribers/${channelId}`);
        return response.data.data;
    }catch(error){
        console.error('Error fetching channel subscribers:', error);

    }
}



export const updateWatchHistory = async (videoId) => {
    try {
        const response = await axiosInstance.post(`users/update-watch-history/`, { videoId });
       
    }catch(error){
        console.error('Error updating watch history:', error);

    }
}

export const getSubscribedChannels = async () => {
    try {
        const response = await axiosInstance.get(`/subscription/subscribed`);
        return response.data.data;
    }catch(error){
        console.error('Error fetching subscribed channels:', error);

    }
}


