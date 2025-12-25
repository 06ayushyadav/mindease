import { getLLM } from "../../services/llm/router";
import { Request, Response } from "express";
import {  GetMessagesParams } from "../../../../shared/schemas/chatbot/chat";
import { scanCrisis } from "../../services/safety.service";
import { Conversation } from "../../models/chatbot/conversation.model";
import { Message } from "../../models/chatbot/message.model";
import { SYSTEM_PROMPT } from "../../services/prompt.service";
import { env } from "process";

import { z } from "zod";
import { ChatPostBody } from "../../../../shared/schemas/chatbot/chat";
import { chatMessge } from "services/llm/provider";


const llm = getLLM();

export async function sendMessage(req: Request, res: Response) {
  const { conversationId, userId, message } = req.body as z.infer<
    typeof ChatPostBody
  >;

  const effectiveUserId = userId || (req as any).user?.id || "anon";

  const scan = scanCrisis(message);

  let convId = conversationId;
  if (!convId) {
    const conv = await Conversation.create({
      userId: effectiveUserId,
      title: "MindEase Chat",
    });
    convId = conv._id.toString();
  }

  await Message.create({
    conversationId: convId,
    role: "user",
    content: message,
    safetyFlag: scan.flags,
  });

  const history = await Message.find({ conversationId: convId }).sort({
    createdAt: 1,
  });

  const msgs:chatMessge[] = [
  { role: "system", content: SYSTEM_PROMPT },
  ...history.map(m => ({
    role: m.role as "system" | "user" | "assistant", // 👈 cast
    content: m.content
  }))
];

  if (scan.crisis) {
    const crisisReply =
      "I’m really sorry you’re feeling this way. If you’re in immediate danger, call your local emergency number now. " +
      "You can also reach a trusted person. Would you like me to connect you with a counselor?";

    const saved = await Message.create({
      conversationId: convId,
      role: "assistant",
      content: crisisReply,
    });

    return res.json({
      ok: true,
      conversationId: convId,
      reply: crisisReply,
      messageId: saved._id,
    });
  }

  const llmReply = await llm.chat(msgs, {
    model: env.LLM_MODEL,
    maxTokens: env.MAX_TOKENS!,
    timeoutMs: env.REQUEST_TIMEOUT_MS,
    temperature: 0.6,
  });

  const saved = await Message.create({
    conversationId: convId,
    role: "assistant",
    content: llmReply,
  });

  res.json({
    ok: true,
    conversationId: convId,
    reply: llmReply,
    messageId: saved._id,
  });
}

export async function getMessages(req: Request, res: Response) {
  const { conversationId } = req.params as z.infer<typeof GetMessagesParams>;
  const msgs = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  res.json({
    ok: true,
    messages: msgs,
  });
}
