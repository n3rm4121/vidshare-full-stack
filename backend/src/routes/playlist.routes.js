import { Router } from "express";
import {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getAllUserPlaylists,
    getPlaylistById,
    deletePlaylist,
    updatePlaylist
} from '../controllers/playlist.controller.js';

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/:username').get(getAllUserPlaylists);

router.route('/:playlistId').get(getPlaylistById);

// secured routes
router.route('/').post(verifyJWT, createPlaylist);

router.route('/:playlistId')
    .delete(verifyJWT, deletePlaylist)
    .put(verifyJWT, updatePlaylist);


router.route('/:playlistId/video')
    .put(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);



export default router;
