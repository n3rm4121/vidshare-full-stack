import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuDot } from 'react-icons/lu';
import Avatar from '../Avatar';
import VideoThumbnail from '../videos/VideoThumbnail';
import { MdClose } from 'react-icons/md';

const VideoList = ({ videos, from, category, handleDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = (videoId) => {
    navigate(`/videos/${videoId}`);
  };

  const handleCloseClick = (event, videoId, watchedAt) => {
    // Prevent the click event from propagating to the parent container
    event.stopPropagation();
    handleDelete(videoId, watchedAt);
  };

  return (
    <div className="relative search-page container mx-auto py-8">
      <h2 className="text-xl font-semibold mb-4">{category}</h2>
      {videos.length > 0 ? (
        videos.map((video) => (
          <div
            key={from === "watch-history" ? `${video.watchedAt}-${video._id}` : video._id}
            className="flex flex-row gap-4 p-3 border-b border-gray-200 cursor-pointer"
            onClick={() => handleNavigate(video._id)}
          >
            <div className="flex-shrink-0 lg:w-1/4 md:w-1/3 sm:w-1/2 w-52 h-auto bg-gray-200 rounded-lg overflow-hidden">
              <VideoThumbnail video={video} />
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <div className="text-sm text-gray-500 mb-2">
                {video.views} views <LuDot className="inline" /> {moment(video.createdAt).fromNow()}
              </div>
              <div className="flex items-center text-sm mb-2">
                <Avatar type={'small'} user={video.owner} />
                <span className="ml-2 text-gray-700 font-medium">{video.owner?.username}</span>
              </div>
              <div className="text-sm text-gray-500">
                {video.description?.length > 100 ? (
                  `${video.description.slice(0, 100)}...`
                ) : (
                  video.description
                )}
              </div>
            </div>
            {from === 'watch-history' && (
              <div className="flex items-center ml-4">
                <MdClose
                  size={30}
                  className="cursor-pointer"
                  onClick={(event) => handleCloseClick(event, video._id, video.watchedAt)}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-2xl font-semibold">
            {from === 'watch-history' ? 'No videos in your watch history.' : 'No videos found. Try searching for something else.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoList;
