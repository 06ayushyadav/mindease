import { Router } from "express";
import { validate } from "../../middlewares/validate";
import {
  ChatPostBody,
  GetMessagesParams,
} from "../../../../shared/schemas/chatbot/chat";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  sendMessage,
  getMessages,
} from "../../controllers/chatbot/chat.controllers";

const router = Router();

router.post(
  "/v1/chat",
  validate({ body: ChatPostBody }),
  asyncHandler(sendMessage)
);

router.get(
  "/v1/chat/:conversationId/messages",
  validate({ params: GetMessagesParams }),
  asyncHandler(getMessages)
);

export default router;
