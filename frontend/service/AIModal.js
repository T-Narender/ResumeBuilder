import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  maxOutputTokens: 8192,
  topK: 40,
  responseMimeType: "text/plain", 
};

export const AIChatSession = model.startChat({
  generationConfig,
  history: [],
});
