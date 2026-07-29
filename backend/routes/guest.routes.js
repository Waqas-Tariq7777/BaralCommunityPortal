import { Router } from "express";
import { deleteGuestMessage, getGuestMessages, markMessageAsRead, submitGuestMessage, getUnreadGuestMessagesCount } from "../controllers/guest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();
router.post("/submit", submitGuestMessage);
router.get("/unread-count", verifyJWT, isAdmin, getUnreadGuestMessagesCount);
router.get("/messages", verifyJWT, isAdmin, getGuestMessages);
router.delete("/delete/:id", verifyJWT, isAdmin, deleteGuestMessage);
router.patch("/read/:id", verifyJWT, isAdmin, markMessageAsRead);

export default router;