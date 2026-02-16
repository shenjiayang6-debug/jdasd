import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePrizesWithGemini = async (theme: string, count: number = 8): Promise<string[]> => {
  try {
    const prompt = `Generate a list of exactly ${count} short, creative, and fun items (in Chinese) for a 'Spin the Wheel' game based on the theme: "${theme}". Keep texts concise (under 10 Chinese characters).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prizes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of generated prize names"
            }
          },
          required: ["prizes"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const data = JSON.parse(jsonText);
    return data.prizes || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("生成奖项失败，请重试。");
  }
};
