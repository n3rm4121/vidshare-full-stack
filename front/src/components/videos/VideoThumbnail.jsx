import React from 'react';

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs > 0 ? `${hrs}:` : ''}${hrs > 0 && mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
}

function VideoThumbnail({ video }) {
  const handleMouseOver = (event) => {
    event.currentTarget.play();
  };

  const handleMouseOut = (event) => {
    event.currentTarget.pause();
    event.currentTarget.currentTime = 0; // Reset the video to the start
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden h-auto max-w-full" style={{ paddingBottom: '56.25%' }}>
    
      <video
        src={video.url} 
        alt={video.title}
        className="absolute inset-0 object-cover w-full h-full"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        muted // Mute the video
        loop // Optionally, loop the video
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {formatDuration(video.duration)}
      </div>
    </div>
  );
}

export default VideoThumbnail;
