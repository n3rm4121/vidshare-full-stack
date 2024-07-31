import React, { useState} from 'react';
import { NavLink } from 'react-router-dom';
import VideoThumbnail from './VideoThumbnail';
import moment from 'moment';
import { LuDot, LuMoreVertical } from "react-icons/lu";
import { incrementViewCount, updateWatchHistory } from '../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from '../ConfirmationDialog';
import { deleteUserVideo } from '../../features/UserSlice';
import SuccessDialog from '../SuccessDialog';
import Avatar from '../Avatar';
const VideoCard = ({ video }) => {

    const user = useSelector(state => state.user.user);
    const timeAgo = moment(video.createdAt).fromNow();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);   

    const handleVideoClick = async () => {
        await incrementViewCount(video._id);
        if (video.owner?._id !== user?._id) {
           
            await updateWatchHistory(video._id);
            // dispatch(setUser({ ...user, watchHistory: [video._id, ...user.watchHistory] }));
        }
    };

    const handleDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            dispatch(deleteUserVideo(video._id));
            setSuccess('Video deleted successfully');
            setError(null);
            
        }
        catch (error) {
            setSuccess(null);
            setError(error.message || 'An error occurred while deleting the video');    
        }
    };

  
    return (
        <div>
            <div className="relative">
    <NavLink to={`/videos/${video._id}`} onClick={handleVideoClick}>
        <div className="mx-auto h-auto max-w-full pb-10">
            <VideoThumbnail video={video} />
            <div className="flex items-start mt-4">
                {/* {video.owner?.avatar ? (
                    <img src={video.owner.avatar} alt={video.owner.username} className="w-10 h-10 rounded-full mr-4" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-gray-500">{video.owner?.username?.[0] || '?'}</span>
                    </div>
                )} */}
                <div className='mr-4'>
                <Avatar user={video.owner} type="medium" />

                </div>
                <div>
                    <h2 className="text-lg font-bold mb-2 overflow-hidden">{video.title}</h2>
                    {video.owner?.username && (
                        <p className="text-gray-600">{video.owner.username}</p>
                    )}
                    <p className="text-gray-600 text-sm">{video.views} views<LuDot className='inline px-0 mx-0' /> {timeAgo}</p>
                </div>
            </div>
        </div>
    </NavLink>
    {video.owner === user?._id && (
        <div className="absolute bottom-16 right-1">
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="focus:outline-none hover:bg-gray-200 rounded-full p-2">
                <LuMoreVertical className="text-gray-600" />
            </button>
            {menuOpen && (
                <div className="ml-auto absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setDeleteConfirmationOpen(true) }}
                        className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-100"
                    >
                        Delete Video
                    </button>
                </div>
            )}
        </div>
    )}
</div>


            {deleteConfirmationOpen && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this video?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirmationOpen(false)}
                />
            )}

            {success &&
                <SuccessDialog message={success} />
             }
             {error &&
                <SuccessDialog message={error} />
             }
             

        </div>
    );
};

export default VideoCard;
