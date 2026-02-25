import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables } from "../../../types/ai.type";
import AiService from "../../actions/ai.service";


const useAskQuestionToAiChatbotMutation = (mutationDetails?: UseMutationOptions<IResponse<IAskQuestionToAiChatbotResponse>, IError, IAskQuestionToAiChatbotVariables>) =>
    useMutation<IResponse<IAskQuestionToAiChatbotResponse>, IError, IAskQuestionToAiChatbotVariables>({
        mutationKey: ["ask_question_ai_chatbot"],
        mutationFn: (body) => AiService.askQuestionToAiChatbot(body),
        ...mutationDetails,
    })


const useDeleteAiConversationThreadByThreadIdMutation = (mutationDetails?: UseMutationOptions<IResponse<{ message: string }>, IError, string>) =>
    useMutation<IResponse<{ message: string }>, IError, string>({
        mutationKey: ["delete_thread_ai_chatbot"],
        mutationFn: (threadId) => AiService.deleteAiConversationThreadByThreadId(threadId),
        ...mutationDetails,
    })

export { useAskQuestionToAiChatbotMutation, useDeleteAiConversationThreadByThreadIdMutation }