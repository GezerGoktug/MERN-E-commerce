import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IError, IResponse } from "../../../types/common.type";
import AiService from "../../actions/ai.service";
import { MessageType } from "../../../types/ai.type";

const useGetAiConversationThreadByThreadIdQuery = (threadId: string, queryOptions?: Omit<UseQueryOptions<IResponse<MessageType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<MessageType[]>, IError>({
        queryKey: ["thread_ai_chatbot", threadId],
        queryFn: () => AiService.getAiConversationThreadByThreadId(threadId),
        ...queryOptions
    });

export { useGetAiConversationThreadByThreadIdQuery }    