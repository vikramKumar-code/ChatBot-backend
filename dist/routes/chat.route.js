import { Router } from "express";
import { getChatHistory, sendMessage } from "../controllers/chat.controller.js";
import { chatRateLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();
router.post("/", chatRateLimiter, sendMessage);
router.get("/history/:userId", getChatHistory);
export default router;
//# sourceMappingURL=chat.route.js.map