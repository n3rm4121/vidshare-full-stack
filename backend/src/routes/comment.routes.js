import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';

import { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router.route('/:videoId').get(getVideoComments)

router.route('/:videoId').post( addComment)
    

router.route('/:commentId')
    .delete(deleteComment)
    .put(updateComment);

export default router;
