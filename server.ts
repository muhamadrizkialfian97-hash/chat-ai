import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent startup crashes when API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

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

  // 4. Permission Denied (403) or Leaked Key
  if (
    code === 403 ||
    status === "PERMISSION_DENIED" ||
    lowercaseMsg.includes("permission_denied") ||
    lowercaseMsg.includes("not have permission") ||
    lowercaseMsg.includes("leaked") ||
    lowercaseMsg.includes("leak") ||
    lowercaseOriginal.includes("permission_denied") ||
    lowercaseOriginal.includes("not have permission") ||
    lowercaseOriginal.includes("leaked") ||
    lowercaseOriginal.includes("leak")
  ) {
    if (lowercaseMsg.includes("leaked") || lowercaseOriginal.includes("leaked") || lowercaseMsg.includes("leak") || lowercaseOriginal.includes("leak")) {
      return `⚠️ **Kunci API Dilaporkan Bocor / Diblokir (PERMISSION_DENIED / HTTP 403)**

Sistem Keamanan Google mendeteksi bahwa kunci API Gemini bawaan yang digunakan saat ini telah terpublikasi atau bocor (*leaked key*) di ranah publik (misal: ter-commit di repositori publik secara tidak sengaja). Demi melindungi penyalahgunaan, Google AI Cloud otomatis memblokir secara permanen kunci tersebut.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. Silakan klik tombol **KONEKSI (BROWSER)** di bagian atas halaman chat ini.
2. Dapatkan kunci API baru pribadi Anda secara cepat (gratis dan selesai dalam 30 detik) di [Google AI Studio](https://aistudio.google.com/).
3. Tempelkan kunci pribadi tersebut pada kolom input, lalu klik tombol **Simpan**.
4. Setelah kunci pribadi Anda disimpan, Anda dapat langsung mengirim ulang pesan Anda! Sesi AI akan dialihkan secara langsung dari browser Anda ke Google AI secara aman tanpa kendala.`;
    }

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

// Check if custom video has been synced from the browser
app.get("/api/check-video-sync", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "custom-video.mp4");
  const exists = fs.existsSync(publicPath);
  res.json({ exists });
});

// Sync binary data directly into the public directory of the workspace
app.post("/api/upload-video-sync", (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, "custom-video.mp4");
    
    const writeStream = fs.createWriteStream(publicPath);
    req.pipe(writeStream);
    
    writeStream.on("finish", () => {
      console.log("Successfully saved synchronized background video to workspace:", publicPath);
      res.json({ success: true, message: "Video synced to workspace files." });
    });
    
    writeStream.on("error", (err) => {
      console.error("Error writing synchronized video file:", err);
      res.status(500).json({ error: "Failed to write video file." });
    });
  } catch (err: any) {
    console.error("Upload sync error:", err);
    res.status(500).json({ error: err.message || "Failed to sync video file." });
  }
});

// Check if custom image has been synced from the browser
app.get("/api/check-image-sync", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "custom-image.png");
  const exists = fs.existsSync(publicPath);
  res.json({ exists });
});

// Sync binary data directly into the public directory of the workspace for images
app.post("/api/upload-image-sync", (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, "custom-image.png");
    
    const writeStream = fs.createWriteStream(publicPath);
    req.pipe(writeStream);
    
    writeStream.on("finish", () => {
      console.log("Successfully saved synchronized background image to workspace:", publicPath);
      res.json({ success: true, message: "Image synced to workspace files." });
    });
    
    writeStream.on("error", (err) => {
      console.error("Error writing synchronized image file:", err);
      res.status(500).json({ error: "Failed to write image file." });
    });
  } catch (err: any) {
    console.error("Upload image sync error:", err);
    res.status(500).json({ error: err.message || "Failed to sync image file." });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], enableSearch = false, customApiKey, systemInstruction } = req.body;
    
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required and must be a string." });
      return;
    }

    let ai;
    if (customApiKey) {
      ai = new GoogleGenAI({
        apiKey: customApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } else {
      ai = getGeminiClient();
    }

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
      systemInstruction: systemInstruction || "You are Gemini Chat, a highly capable and intelligent AI assistant. Help the user draft notes, code, generate text documents, and analyze data. Reply in Indonesian by default (or speak the language the user speaks). If the user asks for a file, data structure or code, deliver well-formatted Markdown blocks.",
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
        console.log(`Trying model: ${modelName}`);
        const currentConfig = { ...config };
        
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: currentConfig,
          });
          if (response) {
            console.log(`Success with model: ${modelName}`);
            break;
          }
        } catch (innerToolError: any) {
          if (currentConfig.tools) {
            console.warn(`Tool execution failed for ${modelName}, retrying without tools...`, innerToolError.message);
            delete currentConfig.tools;
            response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: currentConfig,
            });
            if (response) {
              console.log(`Success (without tools) with model: ${modelName}`);
              break;
            }
          } else {
            throw innerToolError;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or unavailable:`, err.message || err);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const text = response.text || "";

    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || ""
    })).filter((source: any) => source.uri && source.title);

    res.json({
      text,
      sources: searchSources
    });
  } catch (error: any) {
    console.warn("Gemini API Error (Handled):", error?.message || error);
    const friendlyError = getFriendlyGeminiError(error);
    
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

    res.status(status).json({
      error: friendlyError
    });
  }
});

// Helper function to robustly fetch external images with a retry strategy
async function fetchImageWithRetry(imageUrl: string): Promise<Response> {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "" // No User-Agent header fallback
  ];

  let lastError: any = null;
  for (const ua of userAgents) {
    try {
      const headers: Record<string, string> = {
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*"
      };
      if (ua) {
        headers["User-Agent"] = ua;
      }
      
      const signal = (AbortSignal as any).timeout ? (AbortSignal as any).timeout(8000) : undefined;
      const response = await fetch(imageUrl, { headers, signal });
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP status ${response.status} (${response.statusText})`);
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError || new Error("Failed to fetch image after multiple attempts.");
}

// REST endpoint to proxy external images (e.g. Unsplash) to bypass CORS issues in PowerPoint export
app.get("/api/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      res.status(400).json({ error: "URL query parameter is required." });
      return;
    }

    // Security check to prevent arbitrary SSRF
    const isAllowedDomain = imageUrl.startsWith("https://images.unsplash.com/") || 
                            imageUrl.startsWith("https://picsum.photos/") || 
                            imageUrl.startsWith("https://fastly.picsum.photos/");
    if (!isAllowedDomain) {
      res.status(400).json({ error: "Only Unsplash and Picsum image URLs are allowed." });
      return;
    }

    const response = await fetchImageWithRetry(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = `data:${contentType};base64,${buffer.toString("base64")}`;

    res.json({ base64 });
  } catch (err: any) {
    console.error("Proxy image error:", err.message);
    res.status(500).json({ error: "Failed to load image through proxy." });
  }
});

// REST endpoint to proxy Firebase Storage files to bypass CORS issues in browser fetches
app.get("/api/proxy-file", async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl || typeof fileUrl !== "string") {
      res.status(400).json({ error: "URL query parameter is required." });
      return;
    }

    // Security check - restrict to Firebase Storage only
    const isAllowed = fileUrl.startsWith("https://firebasestorage.googleapis.com/") || 
                      fileUrl.startsWith("https://linear-honor-cb34d.firebasestorage.app/");
    if (!isAllowed) {
      res.status(400).json({ error: "Only Firebase Storage URLs are allowed to be proxied." });
      return;
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch file from remote: ${response.statusText}` });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(buffer);
  } catch (err: any) {
    console.error("Proxy file error:", err.message);
    res.status(500).json({ error: `Failed to proxy file: ${err.message}` });
  }
});

// Dedicated secure endpoint to proxy the Pancaran Group corporate logo for Three.js without CORS restrictions
app.get("/api/logo-pancaran", async (req, res) => {
  try {
    const driveUrl = "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X";
    const response = await fetchImageWithRetry(driveUrl);
    const contentType = response.headers.get("content-type") || "image/png";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error("Critical logo proxy failure:", err.message);
    res.status(500).send("Failed to proxy client corporate logo correctly.");
  }
});

// REST endpoint to proxy raw binary stream of external images
app.get("/api/proxy-image-raw", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      res.status(400).send("URL parameter is required.");
      return;
    }

    // Security check to prevent arbitrary SSRF
    const isAllowedDomain = imageUrl.startsWith("https://images.unsplash.com/") || 
                            imageUrl.startsWith("https://picsum.photos/") || 
                            imageUrl.startsWith("https://fastly.picsum.photos/");
    if (!isAllowedDomain) {
      res.status(400).send("Only Unsplash and Picsum image URLs are allowed.");
      return;
    }

    const response = await fetchImageWithRetry(imageUrl);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error("Proxy raw image error:", err.message);
    
    // Respond with a gorgeous corporate light flowchart SVG instead of a dark box
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#F8FAFC" />
  <rect x="15" y="15" width="770" height="470" fill="none" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="10, 5" rx="8" />
  
  <!-- Flowchart nodes background illustration -->
  <g stroke="#CBD5E1" stroke-width="1.5">
    <line x1="200" y1="250" x2="400" y2="250" />
    <line x1="400" y1="250" x2="600" y2="250" />
    <line x1="400" y1="150" x2="400" y2="250" />
    <line x1="400" y1="250" x2="400" y2="350" />
  </g>
  
  <!-- Nodes -->
  <circle cx="200" cy="250" r="30" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
  <circle cx="400" cy="250" r="45" fill="#ECFDF5" stroke="#00D285" stroke-width="3" />
  <circle cx="600" cy="250" r="30" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
  <circle cx="400" cy="150" r="30" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
  <circle cx="400" cy="350" r="30" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2" />
  
  <!-- Node text labels -->
  <text x="200" y="254" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">SUPPLY</text>
  <text x="400" y="254" font-family="sans-serif" font-size="11" font-weight="bold" fill="#065F46" text-anchor="middle">OPTIMIZE</text>
  <text x="600" y="254" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">DEMAND</text>
  <text x="400" y="154" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1E40AF" text-anchor="middle">PRE-OPS</text>
  <text x="400" y="354" font-family="sans-serif" font-size="10" font-weight="bold" fill="#78350F" text-anchor="middle">POST-OPS</text>
  
  <text x="400" y="440" font-family="monospace, sans-serif" font-size="13" fill="#64748B" font-weight="bold" text-anchor="middle" letter-spacing="4">PRAMA DIAGRAM SYSTEM</text>
  <text x="400" y="460" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">Visualisasi Rencana Aksi &amp; Kerangka Kerja Layanan</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(fallbackSvg);
  }
});

// Serve any mp4 files directly from public directory, falling back to root directory
app.get("/*.mp4", (req, res) => {
  const filename = path.basename(req.path);
  const publicPath = path.join(process.cwd(), "public", filename);
  const rootPath = path.join(process.cwd(), filename);

  if (fs.existsSync(publicPath)) {
    res.sendFile(publicPath);
  } else {
    res.sendFile(rootPath, (err) => {
      if (err) {
        console.warn(`Could not serve videofile ${filename} from public or root, falling back`);
        res.status(404).send("Video file not found");
      }
    });
  }
});

// Setup Node HTTP Server wrapped around Express
const server = http.createServer(app);

// Setup WebSockets Server
const wss = new WebSocketServer({ noServer: true });

interface SavedFile {
  id: string;
  name: string;
  content: string;
  mimeType: string;
  size: number;
  tags: string[];
  userId: string;
  updatedAt: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
  sender?: string;
  peerId?: string;
}

// In-memory Room State Cache
const rooms = new Map<string, {
  clients: Set<{ ws: WebSocket; username: string; peerId: string }>;
  files: SavedFile[];
  chats: ChatMessage[];
}>();

function getOrCreateRoom(roomId: string) {
  let r = rooms.get(roomId);
  if (!r) {
    r = {
      clients: new Set(),
      files: [],
      chats: []
    };
    rooms.set(roomId, r);
  }
  return r;
}

function broadcastToRoom(roomId: string, messageObj: any, excludeWs?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  const payload = JSON.stringify(messageObj);
  for (const client of room.clients) {
    if (client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(payload);
      } catch (err) {
        console.error("Error sending to socket peer:", err);
      }
    }
  }
}

function leaveAllRooms(ws: WebSocket) {
  for (const [roomId, room] of rooms.entries()) {
    let removed = false;
    for (const client of room.clients) {
      if (client.ws === ws) {
        room.clients.delete(client);
        removed = true;
        break;
      }
    }
    if (removed) {
      const presenceList = Array.from(room.clients).map(c => ({
        username: c.username,
        peerId: c.peerId
      }));
      broadcastToRoom(roomId, {
        type: "presence",
        users: presenceList
      });
    }
  }
}

// Hook up WebSockets Connection Handling
wss.on("connection", (ws) => {
  let wsRoomId = "";
  let wsUsername = "Anonim";
  let wsPeerId = Math.random().toString(36).substring(2, 7);

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      switch (data.type) {
        case "join": {
          const { roomId, username } = data;
          leaveAllRooms(ws);

          wsRoomId = roomId || "lobby";
          wsUsername = username || `User-${wsPeerId}`;

          const room = getOrCreateRoom(wsRoomId);
          room.clients.add({ ws, username: wsUsername, peerId: wsPeerId });

          // Synchronize initial state with the client
          ws.send(JSON.stringify({
            type: "init",
            files: room.files,
            chats: room.chats,
            peerId: wsPeerId
          }));

          // Broadcast active room presence with details
          const presenceList = Array.from(room.clients).map(c => ({
            username: c.username,
            peerId: c.peerId
          }));
          broadcastToRoom(wsRoomId, {
            type: "presence",
            users: presenceList
          });
          break;
        }

        case "chat_message": {
          if (!wsRoomId) return;
          const { message } = data;
          
          // inject sender info
          const enrichedMsg = {
            ...message,
            sender: wsUsername,
            peerId: wsPeerId
          };

          const room = getOrCreateRoom(wsRoomId);
          room.chats.push(enrichedMsg);
          if (room.chats.length > 80) {
            room.chats.shift();
          }

          // Broadcast message to everyone in the room (including sender to maintain consistency, or we broadcast to others and client handles locally)
          // We broadcast to everyone so that state stays perfectly aligned in real-time
          broadcastToRoom(wsRoomId, {
            type: "chat_message",
            message: enrichedMsg
          });
          break;
        }

        case "file_change": {
          if (!wsRoomId) return;
          const { op, file, fileId } = data;
          const room = getOrCreateRoom(wsRoomId);

          if (op === "save") {
            const idx = room.files.findIndex(f => f.id === file.id);
            if (idx > -1) {
              room.files[idx] = file;
            } else {
              room.files.unshift(file);
            }
          } else if (op === "delete") {
            room.files = room.files.filter(f => f.id !== fileId);
          }

          // Broadcast file update to other clients in the room
          broadcastToRoom(wsRoomId, {
            type: "file_change",
            op,
            file,
            fileId,
            senderPeerId: wsPeerId
          }, ws);
          break;
        }

        case "typing": {
          if (!wsRoomId) return;
          const { isTyping } = data;
          broadcastToRoom(wsRoomId, {
            type: "typing",
            username: wsUsername,
            peerId: wsPeerId,
            isTyping
          }, ws);
          break;
        }
      }
    } catch (err) {
      console.error("Socket processing error:", err);
    }
  });

  ws.on("error", (err) => {
    console.error(`Socket error from ${wsUsername}:`, err);
  });

  ws.on("close", () => {
    leaveAllRooms(ws);
  });
});

// Setup server protocol upgrade to handle WebSocket upgrades from Vite/Client on the same port
server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
  // If Vite's dev server is running HMR on paths like "/_vite" or "/vite-hmr", let it bypass
  if (pathname.includes("vite")) {
    return;
  }
  
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Setup Vite & Static Files
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve HTML
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
