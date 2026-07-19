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
      posterOptions: { publicId: thumbnailPublicId, effect: ['sepia'] },
      logoOnclickUrl: profileURL,
      logoImageUrl: avatar ? avatar : '',
    });

    player.source(publicId);

    player.on('loadedmetadata', function () {
      const videoEl = player.el().querySelector('video.vjs-tech');
      if (!videoEl) return;

      const vw = videoEl.videoWidth;
      const vh = videoEl.videoHeight;
      if (!vw || !vh || vh <= vw) return; // landscape — leave as-is

      // Portrait: override the Video.js padding-top aspect-ratio trick
      const maxH = Math.min(Math.round(window.innerHeight * 0.78), 680);
      const portraitW = Math.round(maxH * (vw / vh));

      const wrapperEl = player.el();
      wrapperEl.style.paddingTop = '0';
      wrapperEl.style.height = maxH + 'px';
      wrapperEl.style.width = portraitW + 'px';

      // vjs-tech is position:absolute fill — make it relative so it respects the wrapper
      videoEl.style.position = 'relative';
      videoEl.style.width = '100%';
      videoEl.style.height = '100%';
    });
  }, []);

  return (
    <div className="w-full bg-black flex justify-center items-center" style={{ minHeight: '280px' }}>
      <video
        ref={playerRef}
        className="cld-video-player cld-fluid"
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
