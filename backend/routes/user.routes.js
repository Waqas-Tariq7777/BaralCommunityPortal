import { Router } from "express";
import { changePassword, uploadProfilePicture } from "../controllers/user.controller.js";
import { translateText } from "../controllers/translate.controller.js";
import { uploadPic } from "../middlewares/uploadImage.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/translate').post(translateText)
router.route('/:id/profilePicture').put(verifyJWT, uploadPic.single("profilePicture"),  uploadProfilePicture)
router.route('/:id/changePassword').put(verifyJWT, changePassword)
export default router;  