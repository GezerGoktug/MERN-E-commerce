import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables, MessageType } from "../../domain/entities/ai.entity";
import AiRepository from "../../infrastructure/repositories/ai.repository";

const useAskQuestionToAiChatbotMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IAskQuestionToAiChatbotResponse>, IError, IAskQuestionToAiChatbotVariables>
) =>
    useMutation<IResponse<IAskQuestionToAiChatbotResponse>, IError, IAskQuestionToAiChatbotVariables>({
        mutationKey: ["ask_question_ai_chatbot"],
        mutationFn: (body) => AiRepository.askQuestionToAiChatbot(body),
        ...mutationDetails,
    });

const useDeleteAiConversationThreadByThreadIdMutation = (
    mutationDetails?: UseMutationOptions<IResponse<{ message: string }>, IError, string>
) =>
    useMutation<IResponse<{ message: string }>, IError, string>({
        mutationKey: ["delete_thread_ai_chatbot"],
        mutationFn: (threadId) => AiRepository.deleteAiConversationThreadByThreadId(threadId),
        ...mutationDetails,
    });

const useGetAiConversationThreadByThreadIdQuery = (
    threadId: string,
    queryOptions?: Omit<UseQueryOptions<IResponse<MessageType[]>, IError>, "queryKey">
) =>
    useQuery<IResponse<MessageType[]>, IError>({
        queryKey: ["thread_ai_chatbot", threadId],
        queryFn: () => AiRepository.getAiConversationThreadByThreadId(threadId),
        ...queryOptions,
    });

export {
    useAskQuestionToAiChatbotMutation,
    useDeleteAiConversationThreadByThreadIdMutation,
    useGetAiConversationThreadByThreadIdQuery,
};
