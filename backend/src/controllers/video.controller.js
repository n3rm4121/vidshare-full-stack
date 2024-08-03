import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import deleteMediaFromCloud from "../utils/deleteMediaFromCloud.js";
import { performSearch } from "../utils/Search.js";
import { Subscription } from "../models/subscription.model.js"; // for getting user subscribed channel's videos
import {Notification} from "../models/notification.model.js"
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const user = req.user._id;
    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  
    if (!(videoLocalPath && thumbnailLocalPath)) {
      throw new ApiError(400, "Video or Thumbnail is required");
    }
  
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    if (!videoFile) {
      throw new ApiError(400, "Video upload failed");
    }
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailFile) {
      throw new ApiError(400, "Thumbnail upload failed");
    }
  
    const createdVideo = await Video.create({
      title,
      description,
      url: videoFile.url.replace('http', 'https'),
      thumbnail: thumbnailFile.url.replace('http', 'https'),
      duration: videoFile.duration,
      owner: user,
    });
  
    // Get current user's subscribers
    const subscribers = await Subscription.find({ channel: user }).select('subscriber').exec();
    for (const subscription of subscribers) {
      const notification = new Notification({

        user: subscription.subscriber,
        type: "upload video",
        content: `${req.user.username} uploaded a new video: ${createdVideo.title}`,
        isRead: false,
        sender: req.user.avatar,
        videoId: createdVideo._id,
        createdAt: new Date(),
        
      });
      await notification.save();
    }
  
    return res.status(200).json(new ApiResponse(200, createdVideo, "Video Uploaded successfully"));
  });
  

const deleteVideo = asyncHandler(async (req, res) => {
    let { id } = req.params;
    const userId = req.user._id;
    id = id.trim();

    // Validate if provided video ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid video id:", id);
        throw new ApiError(400, "Invalid video id");
    }

    // Find video by ID
    const video = await Video.findById(id);
    if (!video) {
        console.error("Video not found for id:", id);
        throw new ApiError(404, "Video not found");
    }

    // Check if the logged-in user is the owner of the video
    if (video.owner.toString() !== userId.toString()) {
        console.error("Unauthorized access by user id:", userId);
        throw new ApiError(401, "Unauthorized");
    }

    // Delete associated media from Cloudinary
    await deleteMediaFromCloud(video.url, 'video', video.title);
    await deleteMediaFromCloud(video.thumbnail, 'image', "thumbnail");

    // Delete video from MongoDB
    await Video.deleteOne({ _id: id });

    // Return success response
    console.log('Video deleted successfully');
    return res.status(204).send();
});


const getAllVideos = asyncHandler(async(req, res)=>{
   const videos = await Video.find().populate('owner', 'username fullname avatar')


   if(!videos || videos.length === 0){
    return res.status(200).json(new ApiResponse(200, [], "No videos found"))
   }

   return res.status(200)
   .json(new ApiResponse(200, videos, "videos fetched successfully"))
    
})


const getVideoById = asyncHandler(async(req, res) => {
    const {id} = req.params

    if(!isValidObjectId(id)){
        console.error("here : ", id)
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(id).populate('owner', 'username fullname avatar');
    if(!video){
        throw new ApiError(404, "video not found")
    }
    res.status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))
})


const incrementViewCount = asyncHandler(async(req, res) => {
    const {id} = req.params
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    video.views += 1;
    await video.save();
    return res.status(200)
    .json(new ApiResponse(200, video, "View count incremented successfully"))

})

// TODO: Implement getRelatedVideos with advance features

// based on same creator
const getRelatedVideos = asyncHandler(async(req, res) => { 
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const relatedVideos = await Video.find({ 
        _id: { $ne: id } ,
        owner: video.owner
         }
    
    ).limit(10).populate('owner', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, relatedVideos, "Related videos fetched successfully"));
})


const getSearchResults = asyncHandler(async(req, res) => {
    const query = req.query.q;
   
    const results = await performSearch(query);
    if(!results){
        return res.status(200).json(new ApiResponse(200, [], "No results found"))
    }
    return res.status(200).json(new ApiResponse(200, results, "Search results fetched successfully"))
})

const getSubscribedVideos = asyncHandler(async(req, res) => {
    

    const userId = req.user._id;
    const subscribedChannels = await Subscription.find({subscriber: userId}).select('channel').exec();
    const channelIds = subscribedChannels.map(sub => sub.channel);
    const videos = await Video.find({owner: {$in: channelIds}}).populate('owner', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, videos, "Subscribed videos fetched successfully"))
})


export { uploadVideo, deleteVideo, getAllVideos, getVideoById, incrementViewCount,getRelatedVideos, getSearchResults,getSubscribedVideos }
