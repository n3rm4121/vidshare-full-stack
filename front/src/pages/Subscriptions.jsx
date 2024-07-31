import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import VideoCard from '../components/videos/VideoCard';
function Subscriptions() {

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getSubscribedVideos = async () => {
            try {
                const response = await axiosInstance.get('/videos/subscribedVideos');
                setVideos(response.data.data);
            } catch (err) {
                 console.log(err.response.data.message);
              
            }
        }
        getSubscribedVideos();
    }
    , [])
  
    
  return (
    
    <div>
       
        <h1 className="text-2xl font-semibold mb-4">Latest</h1>

        {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
            
        ) : (
            <p>No videos found</p>
        )
            }

    </div>
  )
}

export default Subscriptions