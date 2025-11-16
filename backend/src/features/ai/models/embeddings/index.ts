import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const callGoogleGenAIEmbeddingsModel = new GoogleGenerativeAIEmbeddings({
    apiKey:process.env.GOOGLE_API_KEY,
    modelName:"text-embedding-004",
})

export default callGoogleGenAIEmbeddingsModel;