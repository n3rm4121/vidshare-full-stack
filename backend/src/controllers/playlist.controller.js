import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Please provide name and description");
    }

    const createdPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    if (!createdPlaylist) {
        throw new ApiError(400, "Failed to create playlist");
    }

    return res.status(200)
        .json(new ApiResponse(200, createdPlaylist, 'Playlist created successfully'));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.body;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Please provide playlistId and videoId");
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $push: { videos: videoId }
    }, { new: true });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.body;
    const {userId} = req.body;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    let playlist = await Playlist.findOne({_id: playlistId, owner: userId})
    
    if(!playlist){
        throw new ApiError(404, 'Playlist not found or you are not authorized to remove this video');
    }

    playlist.videos.pull(videoId);
    playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from the playlist"));
});

// Get all playlists for a user

const getAllUserPlaylists = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing");
    }

    // Find user by username
    const user = await User.findOne({ username }).select('_id');

    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Fetch playlists where the owner field matches the user's ID
    const playlists = await Playlist.find({ owner: user._id })
        .populate('videos')
        .populate('owner');

    if (!playlists.length) {
        return res.status(200).json(new ApiResponse(200, [], "No playlists found"));
    }

    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

// Get single playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId).populate('videos').populate('owner');

    if (!playlist) {
        return res.status(200).json(new ApiResponse(200, {}, "No playlist found"));
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const { userId } = req.user;  // Assuming userId is accessed from req.user

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    let playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found or you are not authorized to update this playlist');
    }

    playlist.name = name;
    playlist.description = description;

    try {
        await playlist.save();
        res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to update playlist");
    }
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { userId } = req.user; 

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found or you are not authorized to delete this playlist');
    }

    try {
        await playlist.deleteOne();
        res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"));
    } catch (error) {
        
        throw new ApiError(500, "Failed to update playlist");
    }
});


export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getAllUserPlaylists,
    getPlaylistById,
    deletePlaylist,
    updatePlaylist
};
