
import { GoogleGenAI, Type } from "@google/genai";
import { WasteCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
  category: WasteCategory;
  description: string;
  severity: number;
  estimatedWeightKg: number;
  safetyWarning: string;
}

export const analyzeWasteImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Strip the data URL prefix if present to get just the base64 string
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: "Analyze this image of waste/garbage. Identify the category, describe it briefly, estimate severity (1-5 where 5 is dangerous/blocking traffic), estimate weight, and provide any safety warnings. Return strictly JSON."
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                WasteCategory.ROADSIDE,
                WasteCategory.BIN_OVERFLOW,
                WasteCategory.PLASTIC,
                WasteCategory.WET,
                WasteCategory.CONSTRUCTION,
                WasteCategory.OTHER
              ],
            },
            description: { type: Type.STRING },
            severity: { type: Type.INTEGER },
            estimatedWeightKg: { type: Type.NUMBER },
            safetyWarning: { type: Type.STRING },
          },
          required: ["category", "description", "severity", "estimatedWeightKg"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback default
    return {
      category: WasteCategory.OTHER,
      description: "Could not analyze image automatically.",
      severity: 1,
      estimatedWeightKg: 0,
      safetyWarning: ""
    };
  }
};
