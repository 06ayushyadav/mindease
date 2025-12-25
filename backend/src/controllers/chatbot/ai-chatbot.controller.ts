import { Request, Response } from "express";
import ChatMessage from "../../models/chatbot/ai-chatbot.model";
import {askGemini} from "../../services/chatbot/mindease-chatbot.service";


export const chatWithGemini = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const user = req.user;
    const userId = user?._id || null;
    const role = user?.role || "guest";


    await ChatMessage.create({ userId, role: "user", content: message });


    const history = await ChatMessage.find({
      $or: [{ userId }],
    }).sort({ createdAt: -1 }).limit(10);

    const chatHistory = history.reverse().map(h => ({ role: h.role, content: h.content }));

    const reply = await askGemini(chatHistory.concat([{ role: "user", content: message }]), role);

    await ChatMessage.create({ userId, role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
};

