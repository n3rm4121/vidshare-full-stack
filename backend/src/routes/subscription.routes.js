import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from '../controllers/subscription.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// public
router.get('/subscribers/:channelId', getUserChannelSubscribers);

// protected
router.post('/toggle/:channelId', verifyJWT, toggleSubscription);
router.get('/subscribed', verifyJWT, getSubscribedChannels);

export default router;
