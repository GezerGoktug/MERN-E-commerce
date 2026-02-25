import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import AiService from "../../actions/ai.service";
import type { MessageType } from "../../../types/ai.type";

const useGetAiConversationThreadByThreadIdQuery = (threadId: string, queryOptions?: Omit<UseQueryOptions<IResponse<MessageType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<MessageType[]>, IError>({
        queryKey: ["thread_ai_chatbot", threadId],
        queryFn: () => AiService.getAiConversationThreadByThreadId(threadId),
        ...queryOptions
    });

export { useGetAiConversationThreadByThreadIdQuery }    