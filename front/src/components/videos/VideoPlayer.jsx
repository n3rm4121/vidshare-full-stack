import React, { useRef, useState, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdOutlineForward10, MdVolumeUp, MdVolumeOff, MdReplay10, MdOpenInFull, MdCloseFullscreen } from 'react-icons/md';

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, visible: false });
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume to 100%
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updatePlayPauseIcon = () => {
      setIsPlaying(!videoElement.paused);
    };

    const updateVolumeIcon = () => {
      setIsMuted(videoElement.muted);
    };

    const updateProgress = () => {
      const progressPercentage = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(progressPercentage);
      setCurrentTime(videoElement.currentTime);
    };

    videoElement.addEventListener('play', updatePlayPauseIcon);
    videoElement.addEventListener('pause', updatePlayPauseIcon);
    videoElement.addEventListener('volumechange', updateVolumeIcon);
    videoElement.addEventListener('timeupdate', updateProgress);

    return () => {
      videoElement.removeEventListener('play', updatePlayPauseIcon);
      videoElement.removeEventListener('pause', updatePlayPauseIcon);
      videoElement.removeEventListener('volumechange', updateVolumeIcon);
      videoElement.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        handlePlayPause();
      } else if (e.code === 'ArrowLeft') {
        handleRewind();
      } else if(e.code === 'KeyF') {
        isFullscreen ? document.exitFullscreen() : containerRef.current.requestFullscreen();
      }
        else if (e.code === 'ArrowRight') {
        handleFastForward();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const handleMuteUnmute = () => {
    const videoElement = videoRef.current;
    videoElement.muted = !videoElement.muted;
  };

  const handleRewind = () => {
    const videoElement = videoRef.current;
    videoElement.currentTime -= 5;
  };

  const handleFastForward = () => {
    const videoElement = videoRef.current;
    videoElement.currentTime += 5;
  };

  useEffect(() => {
    videoRef.current.load();
    videoRef.current.play().catch( () => {
        setIsPlaying(false);
      
      console.log('Autoplay is blocked');
    });
    
    setIsPlaying(true);
  }, [video]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleProgressBarHover = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const hoverTime = (offsetX / progressBarRef.current.offsetWidth) * videoRef.current.duration;
    setHoverTime(hoverTime);
    setHoverPosition({ x: offsetX, visible: true });
  };

  const handleProgressBarLeave = () => {
    setHoverPosition({ ...hoverPosition, visible: false });
  };

  const seekingFn = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const updatedTime = (offsetX / progressBarRef.current.offsetWidth) * videoRef.current.duration;
    videoRef.current.currentTime = updatedTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === '0');
  };


  const handleFullScreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) { /* Safari */
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { /* IE11 */
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div id="container" ref={containerRef} className={`rounded-lg overflow-hidden relative group ${isFullscreen ? 'w-screen h-screen fixed top-0 left-0' : ''}`}>
      <figure>
        <video ref={videoRef} className="w-full h-full" controls={false} onClick={handlePlayPause} >
          <source src={video.url} />
        </video>

        <div
          id="controls"
          className={` ${isPlaying ? 'opacity-0' : 'opacity-100' } p-1 absolute bottom-0 left-0 w-full transition-opacity duration-300 ease-linear group-hover:opacity-100 bg-black bg-opacity-15`}
        >
          <div
            id="progress-bar"
            ref={progressBarRef}
            className="relative h-1 w-full bg-gray-300 cursor-pointer mb-4"
            onClick={(e) => seekingFn(e)}
            onMouseMove={handleProgressBarHover}
            onMouseLeave={handleProgressBarLeave}
          >
            {hoverPosition.visible && (
              <div
                className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-full p-1 bg-black text-white text-xs rounded"
                style={{ left: `${hoverPosition.x}px` }}
              >
                {formatTime(hoverTime)}
                
              </div>
            )}
            <div
              id="progress-indicator"
              className="h-full bg-teal-400"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              
              <button className="transition-all duration-100 ease-linear hover:scale-125" onClick={handlePlayPause}>
                {isPlaying ? <MdPause className="material-icons text-white text-4xl inline-block w-12" /> : <MdPlayArrow className="material-icons text-white text-4xl inline-block w-12" />}
              </button>
              


              <div className="relative ml-4 flex justify-center items-center" onMouseOver={() => setVolumeVisible(true)}
                  onMouseOut={() => setVolumeVisible(false)}>
                <button
                  className="transition-all duration-100 ease-linear hover:scale-125"
                  onClick={handleMuteUnmute}
                  
                >
                  {isMuted ? <MdVolumeOff className="material-icons text-white text-3xl" /> : <MdVolumeUp className="material-icons text-white text-3xl" />}
                </button>
                {volumeVisible && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1.5 accent-white   bg-gray-300 ml-2"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-white mr-4 text-lg">{formatTime(currentTime)} / {videoRef.current && formatTime(videoRef.current.duration)}</div>
              <button className="transition-all duration-100 ease-linear hover:scale-125" onClick={handleFullScreen}>
                {isFullscreen ? <MdCloseFullscreen className="material-icons text-white text-2xl" /> : <MdOpenInFull className="material-icons text-white text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default VideoPlayer;
