import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import VideoList from '../components/videos/VideoList';
import moment from 'moment';
import ConfirmationDialog from '../components/ConfirmationDialog';

function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState({ today: [], yesterday: [], earlier: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState(null); // 'clear' or 'delete'

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axiosInstance.get('/users/watch-history');
        const categorizedVideos = categorizeVideos(response.data.data);
        setWatchHistory(categorizedVideos);
      } catch (error) {
        setError('Failed to fetch watch history.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  const handleDelete = async (videoId, watchedAt) => {
    try {
      await axiosInstance.delete('/users/watch-history', { data: { videoId } });
      setWatchHistory(prevState => {
        const updatedState = { ...prevState };
        if (videoId) {
          Object.keys(updatedState).forEach(key => {
            updatedState[key] = updatedState[key].filter(video => video.watchedAt !== watchedAt);
          });
        } else {
          updatedState.today = [];
          updatedState.yesterday = [];
          updatedState.earlier = [];
        }
        return updatedState;
      });
    } catch (error) {
      console.log('Failed to delete video from watch history', error);
    }
  };

  const handleClearHistory = async () => {
    setActionType('clear');
    setShowDialog(true);
  };

  const handleDialogConfirm = async () => {
    if (actionType === 'clear') {
      try {
        await axiosInstance.delete('/users/watch-history');
        setWatchHistory({ today: [], yesterday: [], earlier: [] });
      } catch (error) {
        console.log('Failed to clear watch history', error);
      }
    }
    setShowDialog(false);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  const categorizeVideos = (videos) => {
    const today = [];
    const yesterday = [];
    const earlier = [];

    videos.forEach(video => {
      const watchedAt = moment(video.watchedAt);
      const todayDate = moment().startOf('day');
      const yesterdayDate = moment().subtract(1, 'day').startOf('day');

      if (watchedAt.isSame(todayDate, 'day')) {
        today.push(video);
      } else if (watchedAt.isSame(yesterdayDate, 'day')) {
        yesterday.push(video);
      } else {
        earlier.push(video);
      }
    });

    return { today, yesterday, earlier };
  };

  if (error) {
    return <p className="text-center text-lg mt-4">{error}</p>;
  }

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (watchHistory.today.length === 0 && watchHistory.yesterday.length === 0 && watchHistory.earlier.length === 0) {
    return <p className="text-center text-lg mt-4">No watch history</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Watch History</h1>
      <p className="text-gray-500 mb-4">Videos you have watched recently.</p>

      <button
        onClick={handleClearHistory}
        className="text-blue-500 cursor-pointer mb-4"
      >
        Clear watch history
      </button>

      {watchHistory.today.length > 0 && (
        <VideoList videos={watchHistory.today} from={'watch-history'} category="Today" handleDelete={handleDelete} />
      )}
      {watchHistory.yesterday.length > 0 && (
        <VideoList videos={watchHistory.yesterday} from={'watch-history'} category="Yesterday" handleDelete={handleDelete} />
      )}
      {watchHistory.earlier.length > 0 && (
        <VideoList videos={watchHistory.earlier} from={'watch-history'} category="Earlier" handleDelete={handleDelete} />
      )}

      {showDialog && (
        <ConfirmationDialog
          message="Are you sure you want to clear all watch history?"
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
}

export default WatchHistory;
