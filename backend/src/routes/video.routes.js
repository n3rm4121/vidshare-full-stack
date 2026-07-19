import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {deleteVideo, getAllVideos, getVideoById, uploadVideo, incrementViewCount, getRelatedVideos, getSearchResults, getSubscribedVideos} from "../controllers/video.controller.js"

const router = Router();

// public
router.get('/', getAllVideos);
router.get('/search', getSearchResults);
router.get('/related/:id', getRelatedVideos);
router.patch('/incrementViewCount/:id', incrementViewCount);
router.get('/:id', getVideoById);

// protected
router.post('/upload', verifyJWT, upload.fields([
    { name: "video", maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);
router.delete('/:id', verifyJWT, deleteVideo);
router.get('/subscribedVideos', verifyJWT, getSubscribedVideos);

export default router;
