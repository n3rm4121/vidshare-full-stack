import { Router } from "express";
import { googleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.route('/google').post(googleLogin);

export default router;