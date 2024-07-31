import express from 'express';
import { toggleVideoLike, getLikedVideos, toggleCommentLike,getDislikedVideos, toggleVideoDislike } from '../controllers/like.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/toggle-video-like/:videoId').post(verifyJWT, toggleVideoLike)
router.route('/toggle-video-dislike/:videoId').post(verifyJWT, toggleVideoDislike)
router.route('/liked-videos').get(verifyJWT, getLikedVideos)
router.route('/disliked-videos').get(verifyJWT, getDislikedVideos)

router.post('/toggle-comment-like/:commentId').post(verifyJWT, toggleCommentLike)

export default router;
