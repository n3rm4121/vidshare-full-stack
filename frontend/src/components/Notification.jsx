import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationsRead, selectUnreadNotificationsCount } from '../features/NotificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications) || [];
  const status = useSelector((state) => state.notifications.status);
  const unreadCount = useSelector(selectUnreadNotificationsCount);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [status, dispatch]);

  const handleMarkRead = () => {
   
    dispatch(markNotificationsRead());
  };
  return (
    <div className="relative">
      <div className=" z-50 absolute right-0 top-10 md:w-1/3 bg-gray-200 border-black border-4 rounded-lg shadow-lg text-lg">
        <div className="p-2 flex items-center justify-between">
          <span>Notifications ({unreadCount})</span>
          <button 
            onClick={handleMarkRead()}
            className="text-blue-600 hover:underline"
          >
          
          </button>
        </div>
        <div className="p-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className={`p-2 mb-2 ${notification.isRead ? 'bg-gray-100' : 'bg-white'} rounded-md`}>
                <p>{notification.content}</p>
                <span className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
