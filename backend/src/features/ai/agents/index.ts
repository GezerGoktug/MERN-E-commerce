import { Annotation, AnnotationRoot, BinaryOperatorAggregate, END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import callGoogleGenAIModel from "../models/llms";
import { productLookupTool } from "../tools/productLookupTool";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { companyBriefTool } from "../tools/companyBriefLookupTool";
import logger from "../../../config/logger";

async function retryInvoke<T>(
    app: {
        invoke: (input: any, config?: Record<string, any>) => Promise<T>;
    },
    input: any,
    config: Record<string, any> = {},
    maxRetries: number = 3
): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            logger.info(`AI Chatbot Attempt ${attempt + 1}/${maxRetries}`);
            const result = await app.invoke(input, config);
            return result;
        } catch (err: any) {
            if (err?.status === 503) {
                logger.warn(
                    `⚠️ Gemini overloaded (503). Retrying ${attempt + 1}/${maxRetries}...`
                );
                await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
                attempt++;
            } else {
                logger.error("❌ [safeInvoke] Non-503 error:", err);
                throw err;
            }
        }
    }
    throw new Error("Gemini API failed after maximum retries");
}

class Workflow {
    private tools = [productLookupTool, companyBriefTool]
    private model = callGoogleGenAIModel;
    private workflow: any = null;
    private GraphState: AnnotationRoot<{
        messages: BinaryOperatorAggregate<BaseMessage[], BaseMessage[]>;
    }>;
    private readonly MAX_HISTORY = 15;

    constructor() {
        this.GraphState = Annotation.Root({
            messages: Annotation<BaseMessage[]>({
                reducer: (x = [], y = []) => {
                    const merged = x.concat(y);

                    if (merged.length <= this.MAX_HISTORY) return merged;

                    const result: BaseMessage[] = [];
                    let i = merged.length - 1;

                    while (i >= 0 && result.length < this.MAX_HISTORY) {
                        const msg = merged[i];
                        const msgType = msg._getType();

                        if (msgType === "human") {
                            result.unshift(msg);
                            i--;
                        } else if (msgType === "ai") {
                            const aiMsg = msg as AIMessage;

                            if (aiMsg.tool_calls && aiMsg.tool_calls.length > 0) {
                                const group: BaseMessage[] = [msg];
                                let j = i + 1;

                                while (j < merged.length && merged[j]._getType() === "tool") {
                                    group.push(merged[j]);
                                    j++;
                                }

                                if (result.length + group.length <= this.MAX_HISTORY) {
                                    result.unshift(...group);
                                }
                                i--;
                            } else {
                                result.unshift(msg);
                                i--;
                            }
                        } else {
                            i--;
                        }
                    }

                    return result;
                }
            }),
        });
    }

    private shouldContinue(state: typeof this.GraphState.State) {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
        const decision = lastMessage?.tool_calls?.length ? "tools" : END;
        return decision;
    }

    private initializeWorkflow() {
        const toolNode = new ToolNode<typeof this.GraphState.State>(this.tools);
        this.workflow = new StateGraph(this.GraphState)
            .addNode("agent", this.callModel.bind(this))
            .addNode("tools", toolNode)
            .addEdge(START, "agent")
            .addConditionalEdges("agent", this.shouldContinue.bind(this))
            .addEdge("tools", "agent");

    }

    public getWorkflow() {
        if (!this.workflow) {
            this.initializeWorkflow();
        }
        return this.workflow;
    }

    public getStateGraph() {
        return this.GraphState;
    }


    private async callModel(state: typeof this.GraphState.State) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `
    You are "Forever Assistant", a warm and helpful AI shopping assistant for Forever company.
    You always respond in a natural, human-like, and friendly tone (2–3 sentences, never robotic).
    Use emojis if they feel natural, but not excessively.

    ---

    ### PRODUCT TOOL INSTRUCTIONS


    You have only one tool: \`product_lookup\`.

    Use this tool whenever the user asks for any product-related information or wants product suggestions.


    ### TOOL CALL RULES

    When calling the \`product_lookup\` tool, always send a **structured JSON object** with these fields:

    {{
    "query": "string (required) — describe what the user wants, e.g. 't-shirt', 'best jackets', 'products with highest rating', etc.",
    "min_price": "number (optional) — minimum price limit if mentioned by the user",
    "max_price": "number (optional) — maximum price limit if mentioned by the user",
    "category": "array (optional) — one or more of ['Men', 'Women', 'Kids'] if the user specifies it, otherwise skip",
    "subCategory": "array (optional) — one or more of ['Topwear', 'Bottomwear', 'Winterwear'] if mentioned, otherwise skip",
    "sizes": "array (optional) — one or more of ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE', 'XXLARGE'] if the user talks about sizes, otherwise skip",
    "sort_by": "string (optional) — one of ['price_asc', 'price_desc', 'newest', 'rating_asc', 'rating_desc'].  
    -> If the user asks for top/best/highest-rated products or similar, automatically use 'rating_desc'.",
    "n": "number (required) — the number of results to return.  
    -> Default 5 if the user doesn’t specify any number."
    }}

    ---

    ### SPECIAL CASES

    1. If the user asks for **best / top-rated / highest-evaluated** products but doesn’t mention any category or keywords:  
    → Still call \`product_lookup\`  
    → Use:  
    {{
    "query": "top rated products",
    "sort_by": "rating_desc",
    "n": 5
    }}

    2. If the user’s question is unclear but generally about products:  
    → Make a best guess and still call \`product_lookup\` with a minimal query string.

    3. Never skip calling the tool if the user’s request involves product search, comparison, or ratings.


    ###  COMPANY BRIEF DOCUMENT INSTRUCTIONS: 
    - Use this tool for any factual or informational question that is not about products or who do not want any product and is not already answered in previous messages.
    * Extract main question
    * Call "company_brief_lookup" tool
    - Read retrieved text and rephrase it naturally.
    For example:
        Instead of pasting the document directly,
        say: “Forever e-commerce’s mission is <mission content>.”
    - Do NOT include JSON for FAQ/company responses — only friendly text.

    ---

    ### IMPORTANT ALERT      
    
    To avoid errors when calling the tool, always add the query parameter.

    ### RESPONSE FORMAT

    Always respond in **pure JSON** (no markdown, no code blocks):

    {{
    "message": "Friendly 2–3 sentence conversational summary 😊",
    "products": [ ...products from tool output... ]
    }}

    - The \`message\` is natural and human-like.
    - The \`products\` list must come **directly** from the tool output.
    - Never include extra text, tool metadata, or reasoning.

    If you cannot find any relevant information or product, or if the question is unclear,
    ALWAYS respond anyway in the same JSON format with a friendly "message" and an empty "products" list.
    Never leave the response empty.

    `
            ],
            new MessagesPlaceholder("messages"),
        ]);

        const formattedPrompt = await prompt.formatMessages({ messages: state.messages });

        const modelWithTools = this.model.bindTools(this.tools);

        const result = await modelWithTools.invoke(formattedPrompt);
        return { messages: [result] };

    }


}

export class ChatBotAgent {
    private static workflow: any = null;
    private static GraphState: any = null;
    private static memorySaver = new MemorySaver();

    public static async deleteThreadByThreadId(threadId: string) {
        await this.memorySaver.deleteThread(threadId);
    }

    public static async getMessageHistory(threadId: string) {
        const checkpoint = await this.memorySaver.get({
            configurable: { thread_id: threadId },
        });

        if (!checkpoint)
            return [];


        const rawMessages = (checkpoint.channel_values?.["messages"] ?? []) as any[];

        const formattedMessages = [];

        for (const msg of rawMessages) {
            const msgType = msg.constructor?.name || "unknown";

            if (msgType === "HumanMessage") {
                formattedMessages.push({
                    type: "human",
                    message: msg.content || ""
                });
            } else if (msgType === "AIMessageChunk" || msgType === "AIMessage") {
                if (msg.tool_calls && msg.tool_calls.length > 0) {
                    continue;
                }

                let content = msg.content || "";

                if (typeof content === "string") {
                    try {
                        content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");
                        const parsed = JSON.parse(content);

                        formattedMessages.push({
                            type: "ai",
                            message: parsed.message || "",
                            products: parsed.products || []
                        });
                    } catch (err) {
                        formattedMessages.push({
                            type: "ai",
                            message: content,
                            products: []
                        });
                    }
                } else if (Array.isArray(content)) {
                    continue;
                } else {
                    formattedMessages.push({
                        type: "ai",
                        message: content.message || "",
                        products: content.products || []
                    });
                }
            }
        }

        return formattedMessages;
    }

    private static initializeWorkflow() {
        const workflow = new Workflow();
        this.workflow = workflow.getWorkflow();
        this.GraphState = workflow.getStateGraph();
    }

    public static async callAgent(query: string, threadId: string = "default") {
        if (!this.workflow && !this.GraphState) {
            this.initializeWorkflow();
        }
        const app = this.workflow.compile({ checkpointer: this.memorySaver });


        const invokeInput = { messages: [new HumanMessage(query)] };

        const finalState = await retryInvoke<typeof this.GraphState.State>(
            app,
            invokeInput,
            { configurable: { thread_id: threadId }, recursionLimit: 90 },
            3
        );


        let lastMessage = finalState.messages[finalState.messages.length - 1];

        let parsedData: any = null;

        try {
            let content = (lastMessage?.content ?? "").toString();

            content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");

            parsedData = JSON.parse(content);

        } catch (err) {

            parsedData = {
                message: (lastMessage?.content ?? "").toString().trim(),
                products: []
            };
        }

        const normalizedData = {
            message: parsedData?.message.trim().length === 0 ? "I'm sorry.I am not able to supporting to you at now.Can you please later try again?" : parsedData.message,
            products: parsedData.products || [],
        };

        const messages = finalState.messages.map((msg: BaseMessage) => ({
            type: msg._getType(),
            content: msg.content,
        }));

        return { ...normalizedData, messages, threadId };
    }


}