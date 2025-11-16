import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { IError, IResponse } from "../../../types/common.type";
import { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables } from "../../../types/ai.type";
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