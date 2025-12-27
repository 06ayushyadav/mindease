import express from "express";
import { chatWithGroq } from "../../controllers/chatbot/ai-chatbot.controller";

const router = express.Router();

router.post("/chat",chatWithGroq);

export default router;
