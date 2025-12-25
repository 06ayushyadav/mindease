import express from "express";
import { chatWithGemini } from "../../controllers/chatbot/ai-chatbot.controller";

const router = express.Router();

router.post("/chat",chatWithGemini);

export default router;
