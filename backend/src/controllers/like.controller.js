import { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Like } from '../models/like.model.js';
import { Video } from '../models/video.model.js';

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

    // Check if the user has disliked the video
    const existingDislike = await Like.findOne({ dislikedBy: userId, video: videoId });

    if (existingLike) {
        // User has already liked the video, so we need to remove the like
        await existingLike.deleteOne();
        video.likes = video.likes > 0 ? video.likes - 1 : 0;
    } else {
        // User has not liked the video yet
        if (existingDislike) {
            // Remove the dislike if it exists
            await existingDislike.deleteOne();
            video.dislikes = video.dislikes > 0 ? video.dislikes - 1 : 0;
        }

        // Add the new like
        await Like.create({ video: videoId, likedBy: userId });
        video.likes += 1;
    }

    await video.save();

    return res.status(200).json(new ApiResponse(200, { video }, "Video like status toggled successfully"));
});

const toggleVideoDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if the user has already disliked the video
    const existingDislike = await Like.findOne({ dislikedBy: userId, video: videoId });

    // Check if the user has liked the video
    const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

    if (existingDislike) {
        // User has already disliked the video, so we need to remove the dislike
        await existingDislike.deleteOne();
        video.dislikes = video.dislikes > 0 ? video.dislikes - 1 : 0;
    } else {
        // User has not disliked the video yet
        if (existingLike) {
            // Remove the like if it exists
            await existingLike.deleteOne();
            video.likes = video.likes > 0 ? video.likes - 1 : 0;
        }

        // Add the new dislike
        await Like.create({ video: videoId, dislikedBy: userId });
        video.dislikes += 1;
    }

    await video.save();

    return res.status(200).json(new ApiResponse(200, { video }, "Video dislike status toggled successfully"));
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Find liked videos and populate video and owner information
    const likedVideos = await Like.find({ likedBy: userId })
        .populate({
            path: 'video',
            select: 'title description url likes dislikes views createdAt owner duration length', // Video fields
            populate: {
                path: 'owner',
                select: 'username avatar fullname' // Owner fields
            }
        })
        .exec();

    // Map over the likedVideos to exclude the _id field from the Like collection
    // const videos = likedVideos.map(like => like.video);

    return res.status(200).json(new ApiResponse(200, { likedVideos }, "Liked videos fetched successfully"));
});




const getDislikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const dislikedVideos = await Like.find({ dislikedBy: userId })
        .populate('video', 'title description url')
        .exec();

    return res.status(200).json(new ApiResponse(200, { dislikedVideos }, "Disliked videos fetched successfully"));
});



const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const like = await Like.findOne({ likedBy: userId, comment: commentId });

    if (like) {
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked successfully"));
    }

    const likedComment = await Like.create({
        comment: commentId,
        likedBy: userId
    });

    return res.status(200).json(new ApiResponse(200, { likedComment }, "Comment liked successfully"));
});

export { toggleVideoLike, getLikedVideos, toggleCommentLike,toggleVideoDislike,getDislikedVideos };
