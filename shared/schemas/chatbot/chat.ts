import { z } from "zod";
import { IdStr, UserId } from "./common";

export const ChatPostBody = z.object({
  conversationId: z.string().optional(),
  userId: UserId.optional(),
  message: z.string().min(1).max(2000),
  stream: z.boolean().default(false)
}).strict();

export const GetMessagesParams = z.object({
  conversationId: IdStr
}).strict();


