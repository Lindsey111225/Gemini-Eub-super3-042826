/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const getAIClient = (apiKey?: string) => {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is missing");
  return new GoogleGenAI({ apiKey: key });
};

const DEFAULT_MODEL = "gemini-3-flash-preview";

export const transformToMarkdown = async (text: string, apiKey?: string) => {
  const ai = getAIClient(apiKey);
  const prompt = `Transform the following messy regulatory notes into a clean, well-structured Markdown document with headings, bullet points, and clear sections. Preserve all technical details and regulatory terms.\n\nInput:\n${text}`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return response.text || "";
};

export const extractKeywords = async (text: string, apiKey?: string) => {
  const ai = getAIClient(apiKey);
  const prompt = `Extract exactly 10 key medical device regulatory terms from the following text as a comma-separated list. Focus on risk class, modification types, and document names.\n\nText:\n${text}`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return (response.text || "").split(',').map(k => k.trim());
};

export const summarizeNote = async (text: string, apiKey?: string) => {
  const ai = getAIClient(apiKey);
  const prompt = `Summarize the following regulatory note into 3 concise executive points.\n\nText:\n${text}`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return response.text || "";
};

export const runAgentStep = async (stepPrompt: string, inputData: string, apiKey?: string) => {
  const ai = getAIClient(apiKey);
  const prompt = `${stepPrompt}\n\nInput Context:\n${inputData}`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return response.text || "";
};

export const translateText = async (text: string, targetLang: string, apiKey?: string) => {
  const ai = getAIClient(apiKey);
  const prompt = `Translate the following medical device regulatory text to ${targetLang}. Ensure high fidelity for technical terms.\n\nText:\n${text}`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return response.text || "";
};
