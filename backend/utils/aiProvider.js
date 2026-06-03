import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { getFromCache, saveToCache } from "./cache.js";
import { getDefaultTemplate } from "./defaultTemplates.js";

/**
 * Calls the Google Gemini API to generate content.
 * @param {string} prompt 
 * @returns {Promise<string>} The generated content
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  if (!text) {
    throw new Error("Gemini API returned an empty response");
  }
  return text;
}

/**
 * Calls the Groq API to generate content.
 * @param {string} prompt 
 * @returns {Promise<string>} The generated content
 */
async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }
  const groq = new Groq({ apiKey });
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });
  const text = chatCompletion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Groq API returned an empty response");
  }
  return text;
}

/**
 * Helper to determine the default template type from prompt content.
 * @param {string} prompt 
 * @returns {string} summary | bullets | skills | experience
 */
function getTemplateTypeFromPrompt(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes("bullet") || lower.includes("star method") || lower.includes("achievement")) {
    return "bullets";
  }
  if (lower.includes("skill") || lower.includes("skill gap") || lower.includes("roadmap")) {
    return "skills";
  }
  if (lower.includes("interview") || lower.includes("experience") || lower.includes("job")) {
    return "experience";
  }
  return "summary";
}

/**
 * Generates content using a fallback chain: Cache -> Gemini -> Groq -> Cache (last resort) -> Default Template.
 * @param {string} prompt 
 * @param {boolean} regenerate 
 * @returns {Promise<string>} Generated text or fallback template
 */
export const generateContent = async (prompt, regenerate = false) => {
  // STEP 1 - Check cache (skip if regenerate=true):
  if (!regenerate) {
    const cached = await getFromCache(prompt, false);
    if (cached) {
      console.log("[CACHE HIT] Returning cached response");
      return cached;
    }
  }

  // STEP 2 - Try Gemini:
  try {
    console.log("[GEMINI] Calling Gemini API...");
    const response = await callGemini(prompt);
    await saveToCache(prompt, response);
    return response;
  } catch (geminiError) {
    console.log("[GEMINI FAILED] Switching to Groq...");
    console.error("Gemini Error details:", geminiError.message);
  }

  // STEP 3 - Try Groq:
  try {
    console.log("[GROQ] Calling Groq API...");
    const response = await callGroq(prompt);
    await saveToCache(prompt, response);
    return response;
  } catch (groqError) {
    console.log("[GROQ FAILED] Checking cache...");
    console.error("Groq Error details:", groqError.message);
  }

  // STEP 4 - Try cache as last resort (even if regenerate=true):
  const cachedFallback = await getFromCache(prompt, false);
  if (cachedFallback) {
    console.log("[CACHE FALLBACK] Returning cache as last resort");
    return cachedFallback;
  }

  // STEP 5 - Return default template:
  console.log("[DEFAULT] All providers failed. Returning default template");
  const templateType = getTemplateTypeFromPrompt(prompt);
  return getDefaultTemplate(templateType);
};
