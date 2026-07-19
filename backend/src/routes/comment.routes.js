import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';

import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

// public
router.get('/:videoId', getVideoComments);

// protected
router.post('/:videoId', verifyJWT, addComment);
router.delete('/:commentId', verifyJWT, deleteComment);
router.put('/:commentId', verifyJWT, updateComment);

export default router;
