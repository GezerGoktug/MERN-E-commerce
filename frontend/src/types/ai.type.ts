import { ExtendedProductType } from "./product.type"

export interface IAskQuestionToAiChatbotVariables {
    question: string,
    threadId?: string
}

export interface IAskQuestionToAiChatbotResponse {
    message: string,
    products: (ExtendedProductType & { averageRating: number })[]
    threadId: string,
    messages: {
        type: "human" | "ai",
        content: string
    }[]
}

interface BaseMessage {
    message: string;
}

export type MessageType =
    | (BaseMessage & {
        type: "ai";
        products: Array<ExtendedProductType & { averageRating: number }>;
    })
    | (BaseMessage & {
        type: "human";
        products?: never;
    });
