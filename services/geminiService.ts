import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MonthlyAnalysis } from "../types";

// Helper to ensure API Key exists
const getApiKey = (): string => {
  // In a browser environment without a bundler polyfill, process might be undefined unless polyfilled.
  // The index.html polyfill ensures window.process exists, but env might be empty.
  let key = '';
  try {
    key = process.env.API_KEY || '';
  } catch (e) {
    // This catches ReferenceError if process is not defined
    console.warn("process.env access failed", e);
  }

  if (!key) {
    console.error("API Key is missing. Please check your environment variables in Vercel Settings.");
    throw new Error("API Key is missing. (Vercel 환경변수 API_KEY를 설정해주세요)");
  }
  return key;
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    month: { type: Type.INTEGER, description: "The month being analyzed (1-12)" },
    summary: { type: Type.STRING, description: "Market summary focusing on 'Safe' Import Reselling (No Food/Cosmetics)." },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING, description: "Korean keyword optimized for Naver Search." },
          englishKeyword: { type: Type.STRING, description: "English keyword for sourcing on Amazon." },
          category: { type: Type.STRING, description: "Category (Non-consumable industrial goods)." },
          reason: { type: Type.STRING, description: "Why this is a good 'Non-license' item to sell." },
          difficulty: { type: Type.STRING, enum: ["하", "중", "상"], description: "Sourcing difficulty." },
          searchVolume: { type: Type.INTEGER, description: "Naver Search Volume Index (0-100)." },
          competitionLevel: { type: Type.INTEGER, description: "Competition on Naver Smart Store (0-100)." },
          targetAudience: { type: Type.STRING, description: "Target buyer description." },
          salesTip: { type: Type.STRING, description: "Tip for sourcing specific specs/models." },
          
          // Pricing Fields
          naverAveragePrice: { type: Type.INTEGER, description: "Estimated average selling price on Naver Smart Store (KRW)." },
          amazonSourcingPrice: { type: Type.INTEGER, description: "Estimated purchase price on 11st Amazon (KRW)." },
          suggestedSellingPrice: { type: Type.INTEGER, description: "Recommended selling price to be competitive (KRW)." },
          estimatedProfit: { type: Type.INTEGER, description: "suggestedSellingPrice - amazonSourcingPrice (KRW)." },

          // Marketing Fields
          seoTitle: { type: Type.STRING, description: "Optimized Naver Product Title (Brand + Product + Keywords) under 50 chars." },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 high volume hashtags for Naver." },
          marketingCopy: { type: Type.STRING, description: "A catchy one-sentence hook to put at the top of the detail page." },

          // Detailed Page Content
          detailedPage: {
            type: Type.OBJECT,
            properties: {
              prologue: { type: Type.STRING, description: "Emotional intro (3-4 lines) appealing to the target audience." },
              points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Short benefit title" },
                    content: { type: Type.STRING, description: "Description of the benefit" },
                  },
                  required: ["title", "content"]
                },
                description: "3 key selling points."
              },
              spec: { type: Type.STRING, description: "Brief summary of specs (Size, Weight, Material etc.)." },
              faq: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    q: { type: Type.STRING },
                    a: { type: Type.STRING },
                  },
                  required: ["q", "a"]
                },
                description: "3 common Q&A pairs (e.g. Shipping time, Authenticity)."
              }
            },
            required: ["prologue", "points", "spec", "faq"]
          },

          // Trademark Check
          trademarkCheck: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ["안전", "주의", "위험"], description: "Risk level for a parallel importer." },
              riskLevel: { type: Type.INTEGER, description: "0 (Safe) to 100 (High Risk)." },
              brandDetected: { type: Type.STRING, description: "Name of the brand if detected, or 'None' if generic." },
              riskReason: { type: Type.STRING, description: "Explanation of risk (e.g. 'Generic noun - Safe', 'Famous Brand - Keep invoice')." },
            },
            required: ["status", "riskLevel", "brandDetected", "riskReason"]
          }
        },
        required: [
          "productName", "englishKeyword", "category", "reason", "difficulty", 
          "searchVolume", "competitionLevel", "targetAudience", "salesTip",
          "naverAveragePrice", "amazonSourcingPrice", "suggestedSellingPrice", "estimatedProfit",
          "seoTitle", "hashtags", "marketingCopy", "detailedPage", "trademarkCheck"
        ],
      },
    },
  },
  required: ["month", "summary", "recommendations"],
};

export const fetchMarketAnalysis = async (month: number, category: string): Promise<MonthlyAnalysis> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a 'Cross-Border E-commerce Expert', 'Naver SEO Specialist', and 'Trademark Risk Analyst'.
    
    Task: Analyze market trends for **${month}월** (Month: ${month}) in the **${category}** category.
    
    CRITICAL RESTRICTIONS (Safety First):
    1. **NO FOOD/SUPPLEMENTS**.
    2. **NO COSMETICS**.
    3. **FOCUS ON**: Industrial goods (Tech, Fashion, Camping, Tools, Home).
    
    Requirements:
    1. **Generate 8 Product Recommendations**.
    2. **Price Analysis**: Estimate Naver Price vs 11st Amazon Price (KRW).
    3. **Marketing Assets**: SEO Title, Hashtags, Hook.
    4. **Detailed Page Content**: Prologue, Points, Specs, FAQ.
    5. **Trademark Risk Analysis (Crucial)**:
       - **안전 (Safe)**: Generic keywords (e.g., "Camping Chair", "HDMI Cable"). No risk.
       - **주의 (Caution)**: Brand names (e.g., "Stanley", "Logitech"). Legal for parallel import if genuine, but requires proof of purchase (Invoice) if reported.
       - **위험 (Danger)**: Brands with very aggressive exclusive distributors in Korea or high counterfeit risk (e.g., Nike, Rolex, some luxury fashion).
       - Provide a 'riskReason' explaining *why*.
    
    Instruction:
    - Tone: Encouraging, professional, money-focused.
    - Currency: KRW (Won).
    - Language: Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a smart store partner. Prioritize user safety. Warn them about trademark risks.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MonthlyAnalysis;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};