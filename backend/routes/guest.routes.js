import { Router } from "express";
import { deleteGuestMessage, getGuestMessages, markMessageAsRead, submitGuestMessage } from "../controllers/guest.controller.js";

const router = Router();
router.post("/submit", submitGuestMessage);
router.get("/messages", getGuestMessages);
router.delete("/delete/:id", deleteGuestMessage);
router.patch("/read/:id", markMessageAsRead);

export default router;