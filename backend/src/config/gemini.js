import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

/**
 * Initialize and get the Gemini AI client instance
 */
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
};

/**
 * Helper to obtain a Gemini model instance with configured system instructions or default settings
 * Recommended model: 'gemini-1.5-flash' for speed, cost, and reliability in placement prep workflows
 */
export const getGeminiModel = (modelName = 'gemini-1.5-flash', generationConfig = {}) => {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('Gemini API key is missing or not configured. Please set GEMINI_API_KEY in backend/.env');
  }

  return client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      ...generationConfig,
    },
  });
};
