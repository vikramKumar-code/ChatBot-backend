import { Router } from "express";
import {
  getChatHistory,
  sendMessage,
  getConversations,
  deleteConversation,
} from "../controllers/chat.controller.js";
import { chatRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/", chatRateLimiter, sendMessage);
router.get("/history/:userId", getChatHistory);
router.get("/conversations/:userId", getConversations);
router.delete("/conversations/:userId/:conversationId", deleteConversation);

export default router;
