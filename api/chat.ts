import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history = [], enableSearch = false, customApiKey } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "Kunci API (GEMINI_API_KEY) belum terpasang di Vercel atau belum dimasukkan. Silakan buka panel KONEKSI di atas, lalu masukkan Gemini API Key pribadi Anda."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Standardize chat format for @google/genai SDK
    const formattedContents = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text || "" }]
    }));

    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const config: any = {
      systemInstruction: "You are Gemini Chat, a highly capable and intelligent AI assistant. Help the user draft notes, code, generate text documents, and analyze data. Reply in Indonesian by default (or speak the language the user speaks). If the user asks for a file, data structure or code, deliver well-formatted Markdown blocks.",
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config,
    });

    const text = response.text || "";

    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || ""
    })).filter((source: any) => source.uri && source.title);

    return res.status(200).json({
      text,
      sources: searchSources
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const originalMsg = error?.message || "";
    let friendlyError = originalMsg;
    
    if (originalMsg.toLowerCase().includes("quota") || originalMsg.includes("429") || originalMsg.toLowerCase().includes("resource_exhausted")) {
      friendlyError = "Batas kuota penggunaan terlampaui di server (RESOURCE_EXHAUSTED / HTTP 429). Silakan buka panel KONEKSI di pojok kanan atas chat, masukkan Gemini API Key pribadi Anda, dan pilih metode 'Direct Key (Browser)' atau tetap gunakan 'Secure Server (Proxy)'.";
      return res.status(429).json({ error: friendlyError });
    }

    return res.status(500).json({
      error: friendlyError || "An unexpected error occurred while communicating with Gemini AI."
    });
  }
}
