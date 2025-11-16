import express from "express"
import asyncHandler from "express-async-handler";
import { askQuestionToAiChatbotByThreadId, deleteAiConversationThreadByThreadId, getAiConversationThreadByThreadId } from "../controller/ai.controller";

const router = express.Router();

router.post("/chatbot/ask", asyncHandler(askQuestionToAiChatbotByThreadId));
router.delete("/chatbot/thread/:threadId", asyncHandler(deleteAiConversationThreadByThreadId));
router.post("/chatbot/thread/:threadId", asyncHandler(deleteAiConversationThreadByThreadId));
router.get("/chatbot/thread/:threadId", asyncHandler(getAiConversationThreadByThreadId));

export default router;