import { Request, Response } from "express";
import ChatMessage from "../../models/chatbot/ai-chatbot.model";
import { askGroq } from "../../services/chatbot/mindease-chatbot.service";

export const chatWithGroq = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const user = req.user;
    const userId = user?._id || null;
    const platformRole = user?.role || "user";

    await ChatMessage.create({
      userId,
      role: "user",
      content: message,
    });
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const chatHistory = history
      .reverse()
      .map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      }));

    const reply = await askGroq(
      [...chatHistory, { role: "user", content: message }],
      platformRole
    );
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply,
    });

    res.json({ reply });
  } catch (error) {
    console.error("Groq Chat Error:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
};



