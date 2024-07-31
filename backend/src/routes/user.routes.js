import {Router} from "express"
import { 
    changeCurrentPassword, 
    deleteUserAccount, 
    getCurrentUser, 
    getUserChannelProfile, 
    getUserVideos, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    updateWatchHistory,
    deleteWatchHistory
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/avatar").patch(verifyJWT, upload.single('avatar'),updateUserAvatar)  // 'avatar' should match form key name
router.route("/watch-history").get(verifyJWT, getWatchHistory)

router.route('/watch-history').delete(verifyJWT, deleteWatchHistory);

router.route("/coverImage").patch(verifyJWT, upload.single('coverImage'),updateUserCoverImage)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)


router.route("/update-watch-history").post(verifyJWT, updateWatchHistory)

router.route("/c/:username/videos").get(verifyJWT, getUserVideos)

router.route("/delete-account").delete(verifyJWT, deleteUserAccount)
export default router