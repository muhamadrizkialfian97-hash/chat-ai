import express from "express";
import path from "path";
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
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

// REST endpoint for chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], enableSearch = false, customApiKey } = req.body;
    
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

    res.json({
      text,
      sources: searchSources
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const originalMsg = error?.message || "";
    let friendlyError = originalMsg;
    
    if (originalMsg.toLowerCase().includes("quota") || originalMsg.includes("429") || originalMsg.toLowerCase().includes("resource_exhausted")) {
      friendlyError = "Batas kuota penggunaan terlampaui di server (RESOURCE_EXHAUSTED / HTTP 429). Silakan buka panel KONEKSI di pojok kanan atas chat, masukkan Gemini API Key pribadi Anda, dan pilih metode 'Direct Key (Browser)' atau tetap gunakan 'Secure Server (Proxy)'.";
      res.status(429).json({ error: friendlyError });
      return;
    }
    
    res.status(500).json({
      error: friendlyError || "An unexpected error occurred while communicating with Gemini AI."
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
