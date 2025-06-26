
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_NAME, GEMINI_SYSTEM_PROMPT } from '../constants';
import { SpeciesData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
  // In a real app, you might throw an error or handle this more gracefully
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const identifySpeciesAndGetInfo = async (
  base64ImageData: string,
  mimeType: string
): Promise<SpeciesData> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart: Part = {
    text: "Please analyze the image according to the system instructions.", // System prompt is now part of config.
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [imagePart, textPart] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        responseMimeType: "application/json", // Request JSON directly
        // Add thinkingConfig: { thinkingBudget: 0 } if low latency is critical for this model
      },
    });
    
    let jsonString = response.text.trim();
    
    // Sometimes the model might still wrap JSON in markdown, even with responseMimeType set.
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonString.match(fenceRegex);
    if (match && match[1]) {
      jsonString = match[1].trim();
    }

    try {
      const parsedData: SpeciesData = JSON.parse(jsonString);
      // Basic validation, can be expanded
      if (!parsedData.speciesName || !parsedData.isEndangeredStatus) {
        console.error("Parsed data is missing required fields:", parsedData);
        throw new Error("Received incomplete data from AI.");
      }
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", jsonString, parseError);
      throw new Error(`Failed to parse AI response. Raw text: ${jsonString.substring(0,1000)}`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for specific Gemini API error messages if available, e.g., related to API key or quota
        if (error.message.includes("API key not valid")) {
             throw new Error("Invalid Gemini API Key. Please check your configuration.");
        }
    }
    throw new Error("Failed to get species information from AI. Please try again later.");
  }
};
