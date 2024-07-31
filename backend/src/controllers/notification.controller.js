import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

const getNotifications = asyncHandler(async (req, res) => {
    const user = req.user._id;
    console.log(user);

    const notifications = await Notification.find({ user })
  .sort({ createdAt: -1 })
  .populate('videoId', 'title url thumbnail createdAt') 
  .exec();

  

   



    if(notifications.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No notifications found"));
    }

    return res.status(200).json(new ApiResponse(200, {notifications}, "Notifications fetched successfully"));
    });

const markAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({user: req.user._id, isRead:false }, {isRead:true});
    res.status(200).json(new ApiResponse(200, "Notifications marked as read"));
    }
);

export { getNotifications, markAsRead };