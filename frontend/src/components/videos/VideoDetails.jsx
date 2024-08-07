import React, { useEffect, useState } from 'react';
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikedVideos, fetchDislikedVideos } from '../../features/UserSlice';
import axiosInstance from '../../utils/axiosInstance';
import { getUserChannelSubscribers } from '../../utils/api';
import moment from 'moment';
import { LuDot } from "react-icons/lu";
import {useNavigate} from 'react-router-dom';
import Spinner from '../Spinner';
import Avatar from '../Avatar';

const VideoDetails = ({ video }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const likedVideos = useSelector((state) => state.user.likedVideos);
  const dislikedVideos = useSelector((state) => state.user.dislikedVideos);
const navigate = useNavigate();

  const [subscribersCount, setSubscribersCount] = useState(0);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(video.dislikes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionLimit = 1000; // Set a limit for the number of characters to show initially

  const [subscribed, setSubscribed] = useState(false);


  const handleLike = async () => {
    if (!user?._id) return;

    try {
      // Toggle like status
      await axiosInstance.post(`likes/toggle-video-like/${video._id}`);
      
      // Update local state
      if (isLiked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);

      // Remove dislike if liked
      if (isDisliked) {
        setIsDisliked(false);
        setDislikeCount(dislikeCount - 1);
      }
    } catch (error) {
      console.error('Error:', error.message || 'Something went wrong');
    }
  };

  const handleDislike = async () => {
    if (!user?._id) return;

    try {
      // Toggle dislike status
      await axiosInstance.post(`likes/toggle-video-dislike/${video._id}`);
      
      // Update local state
      if (isDisliked) {
        setDislikeCount(dislikeCount - 1);
      } else {
        setDislikeCount(dislikeCount + 1);
      }
      setIsDisliked(!isDisliked);

      // Remove like if disliked
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) {
      console.error('Error:', error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (video) {
      setIsLiked(likedVideos.some((v) => v.video?._id === video._id));
      setIsDisliked(dislikedVideos.some((v) => v.video?._id === video._id));
    }
  }, [video, likedVideos, dislikedVideos]);

  useEffect(() => {
    const fetchUserSubscribers = async () => {
      setLoading(true);
      try {
        const response = await getUserChannelSubscribers(video.owner._id);
        if (response && response.subscribers) {
          const isSubscribed = response.subscribers.some(subscriber => subscriber.subscriber._id === user?._id);
          setSubscribed(isSubscribed);
          setSubscribersCount(response.numberOfSubscribers);
        } else {
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscribers();
    dispatch(fetchLikedVideos());
    dispatch(fetchDislikedVideos());
  }, [dispatch]);

 {loading && <Spinner loading={loading} />}
  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }


  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleSubscription = async () => {
    if (!user?._id) return;

    try {
      await axiosInstance.post(`subscription/toggle/${video.owner._id}`);
      setSubscribed(!subscribed);
      if (subscribed) {
        setSubscribersCount(subscribersCount - 1);
      }else{
        setSubscribersCount(subscribersCount + 1);
      }
    } catch (error) {
      console.error('Error:', error.message || 'Something went wrong');
    }
  }
  const profileUrl = `/c/${video.owner.username}`;
  return (
    <div className='flex flex-col'>
      <div className='lg:text-3xl md:text-2xl sm:text-2xl font-semibold mb-3'>
        {video.title}
      </div>

      <div className="flex items-center gap-4 mb-4">
      
      <div className='w-10 h-10'>
      <Avatar user={video.owner} type='medium'/>

      </div>

        <div className="flex flex-col ">
          <h1 onClick={() => navigate(profileUrl)} className="lg:text-xl md:text-lg sm:text-sm cursor-pointer">{video.owner.fullname}</h1>
          <h1 className="text-gray-700">{subscribersCount} subscribers</h1>
        </div>
        {
          user?._id === video.owner._id ? null : (
            <button onClick={handleSubscription} className={` px-3 py-2 md:px-4 md:py-3 rounded-full ${subscribed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                        {subscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
          )
        }
       
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center text-lg  bg-gray-100 rounded-full px-3 py-2 gap-4">
            <button onClick={handleLike} className="transition-all duration-100 ease-linear hover:scale-125 flex items-center">
              {isLiked ? <BiSolidLike className=" text-3xl" /> : <BiLike className="" />}
              <span className="ml-2">{likeCount}</span>
            </button>
            <span className='text-gray-400'>|</span>
            <button onClick={handleDislike} className="transition-all duration-100 ease-linear hover:scale-125 flex items-center">
              {isDisliked ? <BiSolidDislike /> : <BiDislike />}
              <span className="ml-2">{dislikeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* views and description */}
      <div className=' bg-gray-200 rounded-lg p-4 text-sm'>
        <div>
          {video.views} views<LuDot className='inline px-0 mx-0' />{moment(video.createdAt).fromNow()}
        </div>
        {/* description */}
        <div className='overflow-hidden'>
          {video.description.length > descriptionLimit ? (
            <>
              {isDescriptionExpanded ? video.description : `${video.description.slice(0, descriptionLimit)}...`}
              <button onClick={toggleDescription} className="font-bold ml-2">
                {isDescriptionExpanded ? 'Show less' : 'Show more'}
              </button>
            </>
          ) : (
            video.description
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
