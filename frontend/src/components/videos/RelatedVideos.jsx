import React from 'react';
import VideoCard from './VideoCard';

const RelatedVideos = ({ videos }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Related Videos</h2>
      <div className="flex flex-col">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
