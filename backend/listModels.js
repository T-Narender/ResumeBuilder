// ⚠️ DEVELOPER SCRIPT ONLY
// This script tests Gemini API directly
// Do NOT use in production code
// Use generateContent() from 
// utils/aiProvider.js for all app code

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hi");
    console.log(`Success with ${modelName}:`, await result.response.text());
    return true;
  } catch (e) {
    console.error(`Error with ${modelName}:`, e.message);
    return false;
  }
}

async function run() {
  const models = [
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-001',
    'gemma-3-12b-it'
  ];
  
  for (const m of models) {
    await testModel(m);
  }
}

run();
