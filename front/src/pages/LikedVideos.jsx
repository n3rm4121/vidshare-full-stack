import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'   
import { fetchLikedVideos } from '../features/UserSlice'
import VideoList from '../components/videos/VideoList';

// fix get liked videos without fetching them here
function LikedVideos () {
    const dispatch = useDispatch(); 
    useEffect(() => {

        dispatch(fetchLikedVideos());
      }
    , []);
    const likedVideos = useSelector((state) => state.user.likedVideos);
    

    const videos = likedVideos.map(video => video.video)


  return (
    <div>
        <h2 className='text-2xl font-semibold mb-4 ml-10'>Liked Videos</h2>
       <VideoList videos={videos} />
    </div>
  )
}

export default  LikedVideos