import {Comment} from '../models/comment.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { isValidObjectId } from 'mongoose';


const getVideoComments = asyncHandler(async(req, res) => {

    const {videoId} = req.params;

    // /api/videos?page=2&limit=20
    let {page = 1, limit = 10} = req.query;   // default page 1 and limit 10 comments per page

    page = parseInt(page);
    limit = parseInt(limit);
    
    // validation
    if(isNaN(page) || page < 1){
        page = 1;
    }
    if(isNaN(limit) || limit < 1 || limit > 50){
        limit = 10;
    }

    // query comments with pagination
    const comments = await Comment.find({ video: videoId })
            .sort({createdAt: -1})
            .skip( (page -1) * limit )            // how much document to skip
            .limit(limit)
            .populate('owner', 'username avatar fullname');

    const numberOfComments = await Comment.countDocuments({ video: videoId });
    // if (!comments || comments.length === 0){

    //     return res.status(404)
    //     .json(new ApiResponse(404, null, 'No comments found'));
    // }

    return res.status(200).json(new ApiResponse(200, {comments, numberOfComments}, 'Comments fetched successfully'));

})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const comment = await Comment.create({
        content,
        owner: userId,
        video: videoId
    });

    if (!comment) {
        throw new ApiError(400, "Failed to create comment");
    }


    return res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'));
});




const updateComment = asyncHandler(async(req, res) => {

    const {content} = req.body;
    const {commentId} = req.params;
    const userId = req.user?._id;
   
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invaid comment id")
    }
    const comment = await Comment.findOne({_id: commentId, owner: userId});

    if(!comment){
        throw new ApiError(404, "comment not found")
    }

    comment.content = content;
    const updatedComment = await comment.save();

    return res.status(200).json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));

})

const deleteComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params;
    const userId= req.user?._id;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invaid comment id")
    }
    
    let comment = await Comment.findOne({_id: commentId, owner: userId});

    if(!comment){
        throw new ApiError(404, 'Comment not found or you are not authorized to delete this comment');
    }

    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json(new ApiResponse(200, {}, 'Comment deleted successfully'));

})

export {getVideoComments, addComment, updateComment, deleteComment}