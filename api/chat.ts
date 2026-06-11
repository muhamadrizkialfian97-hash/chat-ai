import { GoogleGenAI } from "@google/genai";

function getFriendlyGeminiError(error: any): string {
  let originalMsg = "";
  if (typeof error === "string") {
    originalMsg = error;
  } else if (error && typeof error === "object") {
    originalMsg = error.message || error.statusText || JSON.stringify(error);
  }

  // Check if originalMsg is or contains a JSON string
  let parsedError: any = null;
  try {
    const jsonStart = originalMsg.indexOf("{");
    const jsonEnd = originalMsg.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonStr = originalMsg.substring(jsonStart, jsonEnd + 1);
      parsedError = JSON.parse(jsonStr);
    } else {
      parsedError = JSON.parse(originalMsg);
    }
  } catch (e) {
    // Not a valid JSON string
  }

  let code = error?.status || error?.statusCode || "";
  let status = "";
  let messageText = originalMsg;

  if (parsedError) {
    if (parsedError.error) {
      code = parsedError.error.code || code;
      status = parsedError.error.status || status;
      messageText = parsedError.error.message || messageText;
    } else {
      code = parsedError.code || code;
      status = parsedError.status || status;
      messageText = parsedError.message || messageText;
    }
  }

  const lowercaseMsg = messageText.toLowerCase();
  const lowercaseOriginal = originalMsg.toLowerCase();

  // 1. Quota / Rate Limits (429)
  if (
    code === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    lowercaseMsg.includes("quota") ||
    lowercaseMsg.includes("429") ||
    lowercaseMsg.includes("resource_exhausted") ||
    lowercaseMsg.includes("rate limit") ||
    lowercaseOriginal.includes("quota") ||
    lowercaseOriginal.includes("429") ||
    lowercaseOriginal.includes("resource_exhausted")
  ) {
    return `⚠️ **Batas Kuota Penggunaan Terlampaui (RESOURCE_EXHAUSTED / HTTP 429)**

Sistem serverless saat ini kehabisan sisa kuota harian/menit untuk kunci API bawaan.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Buat/Gunakan API Key Pribadi Anda sendiri:** Ini gratis, cepat, dan aman!
2. Di panel atas chat, silakan klik tombol **KONEKSI (BROWSER)**.
3. Masukkan **Gemini API Key** Anda sendiri yang masih aktif dari Google AI Studio ([Buka Google AI Studio untuk membuat Kunci Gratis](https://aistudio.google.com/)).
4. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
  }

  // 2. High Demand / Unavailable (503)
  if (
    code === 503 ||
    status === "UNAVAILABLE" ||
    lowercaseMsg.includes("503") ||
    lowercaseMsg.includes("high demand") ||
    lowercaseMsg.includes("unavailable") ||
    lowercaseMsg.includes("temporary") ||
    lowercaseOriginal.includes("503") ||
    lowercaseOriginal.includes("high demand") ||
    lowercaseOriginal.includes("unavailable")
  ) {
    return `⚠️ **Layanan Sedang Padat (SERVICE_UNAVAILABLE / HTTP 503)**

Model AI Gemini saat ini sedang menerima permintaan yang sangat padat (High Demand). Lonjakan ini biasanya bersifat sementara.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Gunakan API Key Pribadi Anda:** Menggunakan API Key pribadi Anda dari AI Studio seringkali memiliki jatah kuota dan prioritas antrean yang berbeda secara personal. Silakan klik tombol **KONEKSI (BROWSER)** di atas chat untuk memasukkan kunci Anda.
2. **Tunggu beberapa saat** lalu silakan klik tombol kirim kembali pesan Anda.`;
  }

  // 3. API Key Invalid (400)
  if (
    code === 400 && 
    (lowercaseMsg.includes("api_key_invalid") || lowercaseMsg.includes("key is invalid") || lowercaseMsg.includes("invalid api key") || lowercaseMsg.includes("api key") || lowercaseMsg.includes("not found"))
  ) {
    return `⚠️ **Pemberitahuan Kunci API Tidak Valid (API_KEY_INVALID / HTTP 400)**

Kunci API Gemini yang dikonfigurasi tidak dikenali atau tidak sah menurut sistem Google AI Studio.

### 💡 Solusi Cepat:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Periksa kembali kunci yang disalin. Pastikan tidak ada karakter terpotong atau spasi tambahan di awal/akhir kunci.
3. Anda bisa mendapatkan kunci baru secara cepat di [Google AI Studio](https://aistudio.google.com/) secara gratis.`;
  }

  // 4. Permission Denied (403)
  if (
    code === 403 ||
    status === "PERMISSION_DENIED" ||
    lowercaseMsg.includes("permission_denied") ||
    lowercaseMsg.includes("not have permission") ||
    lowercaseOriginal.includes("permission_denied") ||
    lowercaseOriginal.includes("not have permission")
  ) {
    return `⚠️ **Kunci API Tidak Memiliki Izin Akses (PERMISSION_DENIED / HTTP 403)**

Kunci API Gemini yang digunakan saat ini tidak memiliki izin akses atau dibatasi oleh kebijakan Google Cloud/AI Studio.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Gunakan **Gemini API Key pribadi** Anda sendiri dari Google AI Studio. Sangat mudah didapat secara gratis di [Google AI Studio](https://aistudio.google.com/).
3. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
  }

  return `⚠️ **Terjadi Hambatan saat Menghubungi Gemini AI**

**Penyebab Teknis:** ${messageText || originalMsg}

### 💡 Rekomendasi Solusi:
Silakan buka tombol **KONEKSI (BROWSER)** di bagian atas halaman chat, lalu masukkan **Gemini API Key pribadi** Anda. Menggunakan kunci pribadi membebaskan sesi Anda dari kendala batas penggunaan server bersama.`;
}

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
    const { message, history = [], enableSearch = false, customApiKey, systemInstruction } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY || "AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA";
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

    const defaultInstruction = `System Role: PRAMA Strategic AI Consultant

Persona: Anda adalah Senior Project Management Consultant yang ahli dalam Analytic & AI Agent Integration. Tugas utama Anda adalah memberikan analisis mendalam untuk proyek \"PRAMA\" dengan fokus pada efisiensi operasional melalui AI serta memberikan strategi manajemen proyek yang lengkap.

Ruang Lingkup Analisis (PRAMA):
Anda hanya diperbolehkan memberikan respon dan menganalisis strategi di dalam batas lingkup berikut ini saja:
1. New Journal
2. Global/NAT Overview
3. Market Opportunity
4. Financial (Capex, Opex, P&L, Cash Flow, ROI)
5. Supply & Demand
6. Structure
7. Organization (Qualification, Skill, Output/KPI, SOP)
8. Transition Model (Pre-On-Post)
9. Go To Market Strategy
10. Ops Model (Flow Process, Workflow Diagram, SLA)
11. Risk Management
12. Digital Coverage (Tools, Method, Impact, Automation)
13. Competitor
14. TAM, SAM, SOM
15. CAC, LTV

Gaya Bahasa & Aturan Format Jawaban Terstruktur (SANGAT PENTING):
1. Setiap penjelasan wajib diawali dengan paragraf pengantar yang memiliki kalimat awal yang rapi dan jelas.
2. Jawaban harus disusun secara terstruktur dengan urutan hierarki yang mendalam. Jika membuat poin utama, WAJIB menggunakan penomoran angka biasa (contoh: 1., 2., 3.).
3. Di bawah setiap poin utama tersebut, jika ingin menjelaskan kerucutan pembahasannya/rincian detailnya, gunakan urutan huruf abjad biasa (contoh: a., b., c.) dengan baris baru terpisah agar sistem chatting dapat memformat rincian kerucut secara rapi dan menjorok ke dalam dengan indah.
4. Anda SAMA SEKALI TIDAK BOLEH menggunakan simbol "*" (tanda bintang) atau "#" (tanda pagar) di seluruh teks respon Anda. Jangan menulis bullet points menggunakan tanda bintang, jangan gunakan bold text bermarkdown seperti **teks**, jangan menggunakan hashtag atau heading bertanda pagar seperti #, ##, ### dsb. Gunakan spasi baris biasa, angka biasa, atau huruf biasa untuk pemisahan bagian agar tampilan sangat bersih dan rapi.
5. Batasan Topik: Jangan menjawab pertanyaan di luar batas lingkup di atas. Jika pengguna menanyakan hal lain diluar manajemen proyek PRAMA, Anda harus menolak dengan santun dan mengingatkan bahwa Anda hanya melayani konsultasi manajemen proyek di bawah naungan PRAMA.`;

    const config: any = {
      systemInstruction: systemInstruction || defaultInstruction,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
    ];

    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model on Vercel: ${modelName}`);
        const currentConfig = { ...config };
        
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: currentConfig,
          });
          if (response) {
            console.log(`Success with model on Vercel: ${modelName}`);
            break;
          }
        } catch (innerToolError: any) {
          if (currentConfig.tools) {
            console.warn(`Tool execution failed for ${modelName} on Vercel, retrying without tools...`, innerToolError.message);
            delete currentConfig.tools;
            response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: currentConfig,
            });
            if (response) {
              console.log(`Success (without tools) with model on Vercel: ${modelName}`);
              break;
            }
          } else {
            throw innerToolError;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or unavailable on Vercel:`, err.message || err);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const rawText = response.text || "";
    // Clean all * and # characters to guarantee formatting aligns perfectly with user instructions
    const text = rawText.replace(/[*#]/g, "");

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
    console.error("Gemini API Error in Handler:", error);
    const friendlyError = getFriendlyGeminiError(error);
    
    // Attempt to determine correct HTTP status
    let status = 500;
    if (friendlyError.includes("RESOURCE_EXHAUSTED") || friendlyError.includes("429")) {
      status = 429;
    } else if (friendlyError.includes("SERVICE_UNAVAILABLE") || friendlyError.includes("503")) {
      status = 503;
    } else if (friendlyError.includes("API_KEY_INVALID") || friendlyError.includes("400")) {
      status = 400;
    } else if (friendlyError.includes("PERMISSION_DENIED") || friendlyError.includes("403")) {
      status = 403;
    }

    return res.status(status).json({
      error: friendlyError
    });
  }
}
