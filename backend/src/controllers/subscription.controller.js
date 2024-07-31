import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { isValidObjectId } from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // const channel = await Subscription.findOne({ channel: channelId });

    // if (!channel) {
    //     throw new ApiError(404, "Channel not found");
    // }

    const existingSubscription = await Subscription.findOne({ subscriber: userId, channel: channelId });

    if (existingSubscription) {
        await existingSubscription.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed Successfully"));
    }

    const newSubscription = await Subscription.create({ subscriber: userId, channel: channelId });

    return res.status(200).json(new ApiResponse(200, { newSubscription }, "Subscription added successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate('subscriber', 'username fullname email avatar')
        .exec();

    const numberOfSubscribers = subscribers.length;

    return res.status(200).json(new ApiResponse(200, { subscribers, numberOfSubscribers }, "Subscribed users and number of subscribers fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const subscribedTo = await Subscription.find({ subscriber: userId })
        .populate('channel', 'username avatar email fullname')
        .exec();
    
    if(!subscribedTo) {
        return res.status(200).json(new ApiResponse(200, { subscribedTo: [] }, "No subscribed channels found"));
    }

    return res.status(200).json(new ApiResponse(200, { subscribedTo }, "Subscribed channels fetched successfully"));
});


export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
