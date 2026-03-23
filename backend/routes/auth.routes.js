import { Router } from "express";
import { forgotPassword, loginUser, resetPassword } from "../controllers/auth.controller.js";
const router = Router()

router.route('/login').post(loginUser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;