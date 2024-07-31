
import { getNotifications, markAsRead } 
from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {Router} from 'express';

const router = Router();

router.use(verifyJWT)

router.route('/').get(getNotifications)
router.route('/mark-read').put(markAsRead)

export default router;