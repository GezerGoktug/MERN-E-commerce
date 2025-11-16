import { tool } from "@langchain/core/tools";
import { CompanyBriefVectorStore } from "../seed/seed-company-brief-vectorstore";

interface ICompanyBriefLookupToolInput {
    query: string,
    n?: number,
}

export const companyBriefTool = tool(
  async (input) => {
    const { query, n = 5 } = input as ICompanyBriefLookupToolInput;
    
    const vectorStore = await CompanyBriefVectorStore.getVectorStore();

    const results = await vectorStore.similaritySearchWithScore(query, 50);
    if (!results.length) {
      return {
        message: "No relevant info found in company documents.",
        results: [],
      };
    }

    const topResults = results.slice(0, n).map(([doc, score]) => ({
      content: doc.pageContent,
      similarity: Number(score.toFixed(4)),
      metadata: doc.metadata,
    }));

    return {
      message: `Found ${topResults.length} relevant sections from company docs.`,
      results: topResults,
    };
  },
  {
    name: "company_brief_lookup",
    description: "Search company PDF documents (policies, brief, processes) for relevant answers",
    schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        n: { type: "number", default: 5 },
      },
      required: ["query"],
    },
  }
);
