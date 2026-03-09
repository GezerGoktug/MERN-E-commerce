import api from "../api/api.config";
import type { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables, MessageType } from "../../domain/entities/ai.entity";
import type { IResponse } from "@forever/api";

const askQuestionToAiChatbot = (body: IAskQuestionToAiChatbotVariables): Promise<IResponse<IAskQuestionToAiChatbotResponse>> =>
    api.post("/ai/chatbot/ask", body);

const deleteAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> =>
    api.delete("/ai/chatbot/thread/" + threadId);

const getAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<MessageType[]>> =>
    api.get("/ai/chatbot/thread/" + threadId);

const AiRepository = {
    askQuestionToAiChatbot,
    deleteAiConversationThreadByThreadId,
    getAiConversationThreadByThreadId,
};

export default AiRepository;