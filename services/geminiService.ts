import { GoogleGenAI } from "@google/genai";

// Fix: Directly initialize GoogleGenAI with process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFunFact = async (country: string, language: string): Promise<string> => {
  const prompt = `Tell me one interesting and concise fun fact about the ${language} language, especially how it relates to the country of ${country}. Keep it under 200 characters.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
            maxOutputTokens: 100,
            // Fix: Added thinkingConfig to reserve tokens for the output when maxOutputTokens is set for gemini-2.5-flash.
            thinkingConfig: { thinkingBudget: 50 },
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Could not retrieve fun fact from Gemini API.");
  }
};

export const getHint = async (country: string, language: string): Promise<string> => {
    const prompt = `Provide a very subtle, one-sentence creative clue for a trivia game about the ${language} language, which is spoken in ${country}. The clue must not contain the words "${language}" or "${country}". The clue should hint at a unique characteristic of the language, its origin, or a famous piece of media in that language. Keep it under 150 characters.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
                maxOutputTokens: 80,
                thinkingConfig: { thinkingBudget: 40 },
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating hint from Gemini:", error);
        throw new Error("Could not retrieve hint from Gemini API.");
    }
};
