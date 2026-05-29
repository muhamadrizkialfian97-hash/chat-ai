import React, { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { ChatMessage, SavedFile } from "./types";
import Navbar from "./components/Navbar";
import ChatPanel from "./components/ChatPanel";
import FilePanel from "./components/FilePanel";
import { Sparkles, MessageSquare, HardDrive, CircleAlert, CloudLightning } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active workspace states
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SavedFile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Connection settings for Gemini (allows Vercel deployment direct mode fallback)
  const [apiMode, setApiMode] = useState<"proxy" | "client">(
    () => (localStorage.getItem("workspace_api_mode") as "proxy" | "client") || "proxy"
  );
  const [clientApiKey, setClientApiKey] = useState(
    () => localStorage.getItem("workspace_client_api_key") || ""
  );

  // Navigation tab for mobile layouts
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");

  // Auth Tracker
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Data on Auth Change
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // 1. Sync Virtual Files from Firestore onSnapshot
      const filesPath = `users/${user.uid}/files`;
      const filesQuery = query(collection(db, filesPath), orderBy("updatedAt", "desc"));

      const unsubscribeFiles = onSnapshot(
        filesQuery,
        (snapshot) => {
          const fetchedFiles: SavedFile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // safelock timestamp parsing
            const timeVal = data.updatedAt;
            let timeMs = Date.now();
            if (timeVal) {
              if (typeof timeVal.toDate === "function") {
                timeMs = timeVal.toDate().getTime();
              } else if (timeVal.seconds) {
                timeMs = timeVal.seconds * 1000;
              } else if (typeof timeVal === "number") {
                timeMs = timeVal;
              }
            }
            fetchedFiles.push({
              ...(data as Omit<SavedFile, "updatedAt">),
              updatedAt: timeMs,
            });
          });
          setFiles(fetchedFiles);
        },
        (error) => {
          // Required structured error capturing
          handleFirestoreError(error, OperationType.LIST, filesPath);
        }
      );

      // 2. Sync Chat History from Firestore onSnapshot
      const chatsPath = `users/${user.uid}/chats`;
      const activeChatDoc = doc(db, chatsPath, "active_chat");

      const unsubscribeChat = onSnapshot(
        activeChatDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setChatMessages(data.messages || []);
          } else {
            setChatMessages([]);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `${chatsPath}/active_chat`);
        }
      );

      return () => {
        unsubscribeFiles();
        unsubscribeChat();
      };
    } else {
      // Offline mode: Load from localStorage
      const localFiles = localStorage.getItem("gemini_mirror_files");
      const localChats = localStorage.getItem("gemini_mirror_chats");

      if (localFiles) {
        setFiles(JSON.parse(localFiles));
      } else {
        setFiles([]);
      }

      if (localChats) {
        setChatMessages(JSON.parse(localChats));
      } else {
        setChatMessages([]);
      }
    }
  }, [user, authLoading]);

  // Persist local state for Offline Mode
  const persistLocalFiles = (updatedFiles: SavedFile[]) => {
    if (!user) {
      localStorage.setItem("gemini_mirror_files", JSON.stringify(updatedFiles));
    }
  };

  const persistLocalChats = (updatedChats: ChatMessage[]) => {
    if (!user) {
      localStorage.setItem("gemini_mirror_chats", JSON.stringify(updatedChats));
    }
  };

  // 1. Send Message via API server-side route
  const handleSendMessage = async (
    text: string,
    enableSearch: boolean,
    referencedFile?: SavedFile | null
  ) => {
    if (chatLoading) return;

    // Build the query message payload
    let finalQuery = text;
    if (referencedFile) {
      finalQuery = `Pertanyaan saya merujuk pada file dokumen "${referencedFile.name}" dengan isi sebagai berikut:\n\`\`\`\n${referencedFile.content}\n\`\`\`\n\nPertanyaan/Permintaan saya:\n${text}`;
    }

    // Capture standard user message bubble
    const userMsg: ChatMessage = {
      id: `m-usr-${Date.now()}`,
      role: "user",
      text: text, // Display the clean user query in bubbles instead of raw prompt with referenced code block
      timestamp: Date.now(),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    persistLocalChats(updatedMessages);

    setChatLoading(true);

    try {
      // Sync chat message user node to Firestore
      if (user) {
        const chatsPath = `users/${user.uid}/chats`;
        await setDoc(doc(db, chatsPath, "active_chat"), {
          id: "active_chat",
          userId: user.uid,
          title: "Sesi Aktif Gemini Wordspace",
          messages: updatedMessages,
          updatedAt: serverTimestamp(),
        });
      }

      let mainAnswerText = "";
      let searchSources: any[] = [];

      if (apiMode === "client") {
        // Mode Direct Client API (Vercel-friendly directly from browser)
        if (!clientApiKey) {
          throw new Error("API Key Gemini belum diatur. Masukkan API Key Gemini Anda di panel setelan atas untuk menggunakan Direct Client Mode.");
        }

        const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
        
        // Standardize chat format for @google/genai SDK
        const formattedContents = chatMessages.slice(-8).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text || "" }]
        }));

        // Add current user message
        formattedContents.push({
          role: "user",
          parts: [{ text: finalQuery }]
        });

        const config: any = {
          systemInstruction: "You are Gemini Chat, a highly capable and intelligent AI assistant. Help the user draft notes, code, generate text documents, and analyze data. Reply in Indonesian by default (or speak the language the user speaks). If the user asks for a file, data structure or code, deliver well-formatted Markdown blocks.",
        };

        if (enableSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await aiBrowser.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config,
        });

        mainAnswerText = response.text || "";
        
        // Extract search grounding metadata if available
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        searchSources = groundingChunks.map((chunk: any) => ({
          uri: chunk.web?.uri || "",
          title: chunk.web?.title || ""
        })).filter((source: any) => source.uri && source.title);

      } else {
        // Query proxy server
        let res;
        try {
          res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: finalQuery,
              history: chatMessages.slice(-8), // Send sliding window of history
              enableSearch,
            }),
          });
        } catch (fetchErr: any) {
          throw new Error("Gagal menghubungi server proxy. Jika Anda mendeploy static build di Vercel, aktifkan 'Direct Client (Browser Key)' di panel setelan atas.");
        }

        const responseText = await res.text();
        
        if (!res.ok) {
          let errorMsg = "Gagal memperoleh respons asisten.";
          try {
            const errObj = JSON.parse(responseText);
            errorMsg = errObj.error || errorMsg;
          } catch {
            errorMsg = responseText || errorMsg;
          }
          throw new Error(errorMsg);
        }

        let answerData;
        try {
          answerData = JSON.parse(responseText);
        } catch (jsonErr) {
          console.error("Failed to parse JSON", jsonErr, responseText);
          throw new Error("Respon tidak valid (Bukan JSON). Server Vercel Anda mungkin mengembalikan halaman HTML 404/500 karena Serverless Functions belum terdeploy atau Express server dinonaktifkan. Silakan aktifkan 'Direct Client (Browser Key)' di panel atas!");
        }

        mainAnswerText = answerData.text;
        searchSources = answerData.sources || [];
      }

      if (searchSources && searchSources.length > 0) {
        mainAnswerText += "\n\n**Sumber rujukan pencarian Google Search:**\n" + 
          searchSources.map((src: any) => `- [${src.title}](${src.uri})`).join("\n");
      }

      const modelMsg: ChatMessage = {
        id: `m-gem-${Date.now()}`,
        role: "model",
        text: mainAnswerText,
        timestamp: Date.now(),
      };

      const finalMessagesList = [...updatedMessages, modelMsg];
      setChatMessages(finalMessagesList);
      persistLocalChats(finalMessagesList);

      // Sync chat message back response node to Firestore
      if (user) {
        const chatsPath = `users/${user.uid}/chats`;
        await setDoc(doc(db, chatsPath, "active_chat"), {
          id: "active_chat",
          userId: user.uid,
          title: "Sesi Aktif Gemini Wordspace",
          messages: finalMessagesList,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `m-err-${Date.now()}`,
        role: "model",
        text: `⚠️ **Gagal memproses AI:** ${err?.message || "Koneksi terputus. Mohon periksa setup API key Anda."}`,
        timestamp: Date.now(),
      };
      const finalMessagesList = [...updatedMessages, errMsg];
      setChatMessages(finalMessagesList);
      persistLocalChats(finalMessagesList);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. Save / Update File in Workspace Mirror (with Firestore synchronization)
  const handleSaveFile = async (fileInput: Partial<SavedFile>) => {
    const fileId = fileInput.id || `f-${Date.now()}`;
    const name = fileInput.name || "catatan_file.md";
    const content = fileInput.content || "";
    const mimeType = fileInput.mimeType || "text/markdown";
    const size = fileInput.size || new Blob([content]).size;
    const tags = fileInput.tags || ["Notes"];

    const filePayload: SavedFile = {
      id: fileId,
      name,
      content,
      mimeType,
      size,
      tags,
      userId: user ? user.uid : "local_user",
      updatedAt: Date.now(),
    };

    if (user) {
      // Sync strictly into Firestore mirroring users/{userId}/files/{fileId}
      const filesPath = `users/${user.uid}/files`;
      try {
        await setDoc(doc(db, filesPath, fileId), {
          ...filePayload,
          updatedAt: serverTimestamp(), // Strict server-side verification rule matching
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${filesPath}/${fileId}`);
      }
    } else {
      // Standalone mode: Update Local state
      const existingIdx = files.findIndex((f) => f.id === fileId);
      let updatedFiles = [...files];
      if (existingIdx > -1) {
        updatedFiles[existingIdx] = filePayload;
      } else {
        updatedFiles = [filePayload, ...files];
      }
      setFiles(updatedFiles);
      persistLocalFiles(updatedFiles);

      // Mirror state changes back to single viewer if opened
      if (selectedFile?.id === fileId) {
        setSelectedFile(filePayload);
      }
    }
  };

  // 3. Delete File from Workspace Mirror
  const handleDeleteFile = async (fileId: string) => {
    if (user) {
      const filesPath = `users/${user.uid}/files`;
      try {
        await deleteDoc(doc(db, filesPath, fileId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${filesPath}/${fileId}`);
      }
    } else {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);
      persistLocalFiles(updatedFiles);
    }

    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  // Simple quick callback when user clicks "Simpan Respon sebagai File" inside markdown chat
  const handleSaveResponseAsFile = (content: string, requestedFileName?: string) => {
    const cleanContent = content.replace(/\*\*Sumber rujukan pencarian[\s\S]*$/, ""); // Strip citation footer if any
    const filePayload: Partial<SavedFile> = {
      name: requestedFileName || `pembahasan_ai_${Date.now().toString().slice(-4)}.md`,
      content: cleanContent,
      mimeType: "text/markdown",
      size: new Blob([cleanContent]).size,
      tags: ["AI-Draft"],
    };

    handleSaveFile(filePayload);

    // Switch view tabs on mobile to show the new file
    setActiveTab("files");
    // Show feedback popup or notify
    alert("Draf tanggapan Gemini berhasil disimpan di menu Mirror Storage Anda!");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-200 transition-colors duration-250">
      <Navbar user={user} loading={authLoading} />

      {/* Offline Mode Alert */}
      {!user && !authLoading && (
        <div className="flex items-center gap-2.5 bg-amber-500/10 px-4 py-2 border-b border-amber-500/20 text-xs text-amber-400">
          <CircleAlert className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong>Ruang Penyimpanan Lokal:</strong> Draf catatan dan file dialog disimpan sementara di browser Anda. Masuk menggunakan Google untuk mengaktifkan sinkronisasi cloud real-time Firebase Mirroring.
          </span>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 flex overflow-hidden">
        {/* Toggle navigation for portable devices */}
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Mobile Tab Swapper Header */}
          <div className="flex border-b border-slate-900 bg-slate-950 md:hidden shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide border-b-2 transition ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Sesi Gemini Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide border-b-2 transition ${
                activeTab === "files"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <HardDrive className="h-4 w-4" />
              <span>Mirror Storage</span>
              {files.length > 0 && (
                <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-400 font-mono border border-slate-800">
                  {files.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Dual Column bento view or mobile tab-panel container */}
          {/* Column 1: Gemini Dialog Assistant */}
          <div
            className={`flex-1 flex flex-col h-full overflow-hidden ${
              activeTab === "chat" ? "flex" : "hidden md:flex md:w-[55%] border-r border-slate-900"
            }`}
          >
            <ChatPanel
              messages={chatMessages}
              loading={chatLoading}
              onSendMessage={handleSendMessage}
              files={files}
              onSaveAsFile={handleSaveResponseAsFile}
              apiMode={apiMode}
              setApiMode={(mode) => {
                setApiMode(mode);
                localStorage.setItem("workspace_api_mode", mode);
              }}
              clientApiKey={clientApiKey}
              setClientApiKey={(key) => {
                setClientApiKey(key);
                localStorage.setItem("workspace_client_api_key", key);
              }}
            />
          </div>

          {/* Column 2: Mirror Virtual Storage Panel */}
          <div
            className={`flex-1 flex flex-col h-full overflow-hidden ${
              activeTab === "files" ? "flex" : "hidden md:flex md:w-[45%]"
            }`}
          >
            <FilePanel
              files={files}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              onSaveFile={handleSaveFile}
              onDeleteFile={handleDeleteFile}
              isUserSignedIn={!!user}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
