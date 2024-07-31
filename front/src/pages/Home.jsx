// components/Home.js
import React, { useEffect } from 'react';
import VideoCard from '../components/videos/VideoCard';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import ErrorDialog from '../components/ErrorDialog';
import { fetchAllVideos } from '../features/videosSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.videos);
  const user = useSelector((state) => state.user.user);
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);

  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  const homeVideos = videos?.filter(video => video.owner?._id !== user._id);

  return (
    <div className={`container p-4`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Spinner loading={loading} />
        </div>
      )}
      {!homeVideos.length && !loading && (
        <div className='flex items-center justify-center font-extrabold text-4xl'>
          No Videos Found!
        </div>
      )}
      {error && <ErrorDialog message={error.message} />}
      
    </div>
  );
};

export default Home;
