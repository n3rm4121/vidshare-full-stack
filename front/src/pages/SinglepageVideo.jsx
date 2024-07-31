import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import VideoPlayer from '../components/videos/VideoPlayer';
import VideoDetails from '../components/videos/VideoDetails';
import RelatedVideos from '../components/videos/RelatedVideos';
import Comments from '../components/videos/Comments';
import Spinner from '../components/Spinner';

const SinglepageVideo = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/videos/${id}`);
        setVideo(response.data.data);

        const relatedResponse = await axiosInstance.get(`/videos/related/${id}`);
        setRelatedVideos(relatedResponse.data.data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Fetch Error:', err.message || 'Something went wrong');
        setError(err.message || 'Something went wrong');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoById();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Video Player */}
      <div className="md:w-full">
        {video && <VideoPlayer video={video}/>}
        {video && <VideoDetails video={video} />}
        <Comments />
      </div>

      {/* Related Videos */}
      <div className="md:w-1/3">
        {relatedVideos.length > 0 && <RelatedVideos videos={relatedVideos} />}
      </div>
    </div>
  );
};

export default SinglepageVideo;
