import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {deleteVideo, getAllVideos, getVideoById, uploadVideo, incrementViewCount, getRelatedVideos, getSearchResults, getSubscribedVideos} from "../controllers/video.controller.js"

const router = Router();
router.use(verifyJWT);
router.route('/upload').post(upload.fields(
    [
        {
            name: "video",
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
       
    ]), uploadVideo)

router.get('/search', getSearchResults);

router.route('/:id').delete(deleteVideo)
router.route('/').get(getAllVideos)
router.get('/subscribedVideos', getSubscribedVideos);
router.route('/:id').get(getVideoById)
router.patch('/incrementViewCount/:id', incrementViewCount);
router.get('/related/:id', getRelatedVideos);



export default router;