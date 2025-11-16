import { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables, MessageType } from "../../types/ai.type";
import { IResponse } from "../../types/common.type";
import api from "../../utils/api";

const askQuestionToAiChatbot = (body: IAskQuestionToAiChatbotVariables): Promise<IResponse<IAskQuestionToAiChatbotResponse>> => api.post("/ai/chatbot/ask", body);

const deleteAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> => api.delete("/ai/chatbot/thread/" + threadId);

const getAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<MessageType[]>> => api.get("/ai/chatbot/thread/" + threadId);

const AiService = {
    askQuestionToAiChatbot,
    deleteAiConversationThreadByThreadId,
    getAiConversationThreadByThreadId
}

export default AiService;