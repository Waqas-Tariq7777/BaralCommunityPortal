import express from "express";
import { getChatResponse } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/chat", getChatResponse);

export default router;
