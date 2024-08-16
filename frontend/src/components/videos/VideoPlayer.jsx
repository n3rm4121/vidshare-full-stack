import React, { useEffect, useRef } from "react";
import cloudinary from 'cloudinary-video-player';
import "cloudinary-video-player/cld-video-player.min.css";

const extractPublicId = (url) => {
  return url.split('/').slice(7).join('/').slice(0, -4);
};

const VideoPlayer = ({ video, ...props }) => {

  const { url, thumbnail, owner } = video;
  const { avatar, username } = owner;

  const thumbnailPublicId = extractPublicId(thumbnail);
  const publicId = extractPublicId(url);

  const profileURL = `https://vidshare-now.vercel.app/c/${username}`;

  const cloudinaryRef = useRef(null);
  const playerRef = useRef(null);
  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;
    const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
      cloud_name: import.meta.env.VITE_REACT_APP_CLOUD_NAME,
      secure: true,
      controls: true,
      autoplay: true,
      autoplayMode: 'on-scroll',
      // sourceTypes: ["hls", "webm/vp9", "mp4/h265"],
      posterOptions: { publicId: thumbnailPublicId, effect: ['sepia'] },

      logoOnclickUrl: profileURL,
      logoImageUrl: avatar ? avatar : '',

    })
    player.source(publicId);


  }, [])


  return (
    <div className="flex justify-center items-center bg-black max-h-500px overflow-hidden">

    <video
      ref={playerRef}
      className="cld-video-player cld-fluid w-auto h-auto max-h-full max-w-full"
      {...props}
    />
</div>
  )
};

export default VideoPlayer;
