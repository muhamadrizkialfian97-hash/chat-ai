import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { ChatMessage, SavedFile } from "./types";
import { generateLocalSmartResponse, cleanChatMessages } from "./utils/localAssistant";
import { exportToWord, exportToPPTX, extractProjectTitle, downloadPDFDirect } from "./utils/documentExporter";
import Navbar from "./components/Navbar";
import pramaLogo from "./assets/images/prama_logo_1780452149937.png";

export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
  fullName?: string;
  status?: "pending" | "approved";
}
import ChatPanel from "./components/ChatPanel";
import FilePanel from "./components/FilePanel";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Scale, 
  CheckSquare, 
  LayoutDashboard,
  Lock, 
  Mail, 
  LogIn, 
  UserPlus, 
  Globe, 
  Sparkles, 
  CircleAlert, 
  Building2,
  HardDrive,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Cpu,
  Eye,
  EyeOff,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  FileText,
  Download,
  Presentation,
  SquarePen,
  Search,
  Grid,
  ArrowLeft
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Division profiles matching real Pancaran Group Logistics & Audit operations
const divisions = [
  {
    id: "comercial",
    code: "COMC",
    name: "Comercial & Business Development",
    desc: "Manajemen Penawaran (Bidding), Tarif Logistik, & Kontrak Bisnis",
    details: "Fokus pada analisis tarif logistik darat & laut, pembuatan simulasi bidding proyek tambang/kargo, estimasi profitabilitas rute armada, serta pemeliharaan kontrak klien.",
    color: "sky",
    lightAccent: "bg-sky-50 text-sky-800 border-sky-100",
    hoverAccent: "group-hover:border-sky-400 group-hover:bg-sky-50/40",
    indicatorColor: "bg-sky-500",
    icon: TrendingUp,
    locked: false
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [guestUser, setGuestUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth form states
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Approval flow states for registration
  const [userProfileStatus, setUserProfileStatus] = useState<"pending" | "approved" | null>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Active Division State
  const [activeDivision, setActiveDivision] = useState<string | null>(() => {
    return localStorage.getItem("prama_active_division") || null;
  });

  // State for document and PowerPoint interactive inline live previews
  const [articlePreview, setArticlePreview] = useState<{ title: string; content: string; fileName: string } | null>(null);
  const [pptPreview, setPptPreview] = useState<{ title: string; slides: Array<{ title: string; bullets: string[]; speakerNotes: string; imageUrl: string }>; fileName: string } | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  // Active workspace states
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SavedFile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- REAL-TIME MULTIPLAYER COLLABORATION ---
  const [roomId, setRoomId] = useState(() => localStorage.getItem("workspace_collab_room_id") || "global-space");
  const [collabUsername, setCollabUsername] = useState(() => {
    const saved = localStorage.getItem("workspace_collab_username");
    if (saved) return saved;
    return `Staf Prama #${Math.floor(Math.random() * 900) + 100}`;
  });

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketStatus, setSocketStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [presence, setPresence] = useState<{ username: string; peerId: string }[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [peerId: string]: { username: string; isTyping: boolean } }>({});
  const [myPeerId, setMyPeerId] = useState("");

  // Connection settings for Gemini (allows deploy direct mode fallback)
  const [apiMode, setApiMode] = useState<"proxy" | "client">(
    () => (localStorage.getItem("workspace_api_mode") as "proxy" | "client") || "proxy"
  );
  const [clientApiKey, setClientApiKey] = useState(() => {
    const defaultKey = "AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA";
    const isNewSession = !sessionStorage.getItem("workspace_session_initialized");
    
    if (isNewSession) {
      sessionStorage.setItem("workspace_session_initialized", "true");
      localStorage.setItem("workspace_client_api_key", defaultKey);
      return defaultKey;
    }

    const key = localStorage.getItem("workspace_client_api_key");
    if (!key || key === "AIzaSyDzh6235z1Nd3BFTLREBk3AWBfQ2lpsjxo" || key === "AIzaSyDDxMrdwc1s4TdTGxAghVtHaTQ1iGhDnGM") {
      return defaultKey;
    }
    return key;
  });
  const [showKey, setShowKey] = useState(false);
  const [showConfigLogin, setShowConfigLogin] = useState(false);

  // Navigation tab for mobile layouts
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");

  // Tab selector inside main dashboard
  const [dashboardView, setDashboardView] = useState<"divisions" | "saved_docs" | "approval_requests">("divisions");

  // Sidebar search & collections states
  const [searchMessagesQuery, setSearchMessagesQuery] = useState("");
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [showKoleksiSidebarModal, setShowKoleksiSidebarModal] = useState(false);
  const [koleksiSearch, setKoleksiSearch] = useState("");

  // Persist connection settings
  useEffect(() => {
    localStorage.setItem("workspace_api_mode", apiMode);
  }, [apiMode]);

  useEffect(() => {
    localStorage.setItem("workspace_client_api_key", clientApiKey);
  }, [clientApiKey]);

  // Track division transitions in local storage
  useEffect(() => {
    if (activeDivision) {
      localStorage.setItem("prama_active_division", activeDivision);
    } else {
      localStorage.removeItem("prama_active_division");
    }
  }, [activeDivision]);

  // Virtual Auth Tracker
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem("prama_virtual_auth_user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);
        if (savedUser.displayName) {
          setCollabUsername(savedUser.displayName);
        }
      }
    } catch (err) {
      console.warn("Failed to restore virtual auth session:", err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("prama_virtual_auth_user", JSON.stringify(user));
      if (user.displayName) {
        setCollabUsername(user.displayName);
      }
    } else {
      localStorage.removeItem("prama_virtual_auth_user");
    }
  }, [user]);

  // Monitor registration approval status
  useEffect(() => {
    if (!user) {
      setUserProfileStatus(null);
      return;
    }

    const lowerEmail = user.email?.toLowerCase().trim() || "";
    if (
      lowerEmail === "muhamadrizkialfian@gmail.com" || 
      lowerEmail === "muhamadrizkialfian97@gmail.com" ||
      lowerEmail === "muhamadrizkialfiann@gmail.com"
    ) {
      setUserProfileStatus("approved");
      return;
    }

    const reqDocRef = doc(db, "registration_requests", user.uid);
    const unsubscribe = onSnapshot(reqDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === "approved") {
          setUserProfileStatus("approved");
        } else {
          setUserProfileStatus("pending");
        }
      } else {
        // Safe fallback: default to approved if no request exists, to avoid locking out existing users
        setUserProfileStatus("approved");
      }
    }, (error) => {
      console.warn("Unable to watch registration status:", error);
      // Fallback
      setUserProfileStatus("approved");
    });

    return () => unsubscribe();
  }, [user]);

  // Admin: Monitor pending registration requests
  useEffect(() => {
    const isCurrentUserAdmin = user && (
      user.email?.toLowerCase().trim() === "muhamadrizkialfian@gmail.com" ||
      user.email?.toLowerCase().trim() === "muhamadrizkialfian97@gmail.com" ||
      user.email?.toLowerCase().trim() === "muhamadrizkialfiann@gmail.com"
    );

    if (!isCurrentUserAdmin) {
      setPendingRequests([]);
      return;
    }

    const q = collection(db, "registration_requests");
    const unsubscribe = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPendingRequests(list.filter(item => item.status === "pending"));
    }, (error) => {
      console.warn("Unable to watch registration requests in admin panel:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Collab details
  useEffect(() => {
    localStorage.setItem("workspace_collab_room_id", roomId);
  }, [roomId]);

  useEffect(() => {
    localStorage.setItem("workspace_collab_username", collabUsername);
  }, [collabUsername]);

  // Real-time Collaboration connection engine
  useEffect(() => {
    setSocketStatus("connecting");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    setSocket(ws);

    ws.onopen = () => {
      setSocketStatus("connected");
      ws.send(JSON.stringify({
        type: "join",
        roomId,
        username: collabUsername
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "init": {
            if (data.files) setFiles(data.files);
            if (data.chats) setChatMessages(cleanChatMessages(data.chats));
            if (data.peerId) setMyPeerId(data.peerId);
            break;
          }
          case "presence": {
            setPresence(data.users || []);
            break;
          }
          case "chat_message": {
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === data.message.id)) return prev;
              const next = cleanChatMessages([...prev, data.message]);
              if (!user && !guestUser) {
                localStorage.setItem("gemini_mirror_chats", JSON.stringify(next));
              }
              return next;
            });
            break;
          }
          case "file_change": {
            const { op, file, fileId } = data;
            setFiles((prev) => {
              if (op === "save" && file) {
                const idx = prev.findIndex((f) => f.id === file.id);
                const next = [...prev];
                if (idx > -1) {
                  next[idx] = file;
                } else {
                  next.unshift(file);
                }
                setSelectedFile((curr) => (curr?.id === file.id ? file : curr));
                return next;
              } else if (op === "delete" && fileId) {
                setSelectedFile((curr) => (curr?.id === fileId ? null : curr));
                return prev.filter((f) => f.id !== fileId);
              }
              return prev;
            });
            break;
          }
          case "typing": {
            const { username: typingUser, peerId, isTyping } = data;
            setTypingUsers((prev) => ({
              ...prev,
              [peerId]: { username: typingUser, isTyping }
            }));
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse socket message payload:", err);
      }
    };

    ws.onclose = () => setSocketStatus("disconnected");
    ws.onerror = () => setSocketStatus("disconnected");

    return () => {
      ws.close();
    };
  }, [roomId, collabUsername]);

  // Sync Data on Auth Change
  useEffect(() => {
    if (authLoading) return;
    if (socketStatus === "connected") return;

    const activeUser = user || guestUser;

    if (activeUser) {
      if (guestUser) {
        // Guest mode loads from client cache
        const localFiles = localStorage.getItem("gemini_mirror_files");
        const localChats = localStorage.getItem("gemini_mirror_chats");
        setFiles(localFiles ? JSON.parse(localFiles) : []);
        setChatMessages(localChats ? cleanChatMessages(JSON.parse(localChats)) : []);
        return;
      }

      // Real Firebase users Sync Virtual Files from Firestore onSnapshot
      const filesPath = `users/${activeUser.uid}/files`;
      const filesQuery = query(collection(db, filesPath), orderBy("updatedAt", "desc"));

      const unsubscribeFiles = onSnapshot(
        filesQuery,
        (snapshot) => {
          const fetchedFiles: SavedFile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
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
          handleFirestoreError(error, OperationType.LIST, filesPath);
        }
      );

      // Sync Chat History from Firestore onSnapshot
      const chatsPath = `users/${activeUser.uid}/chats`;
      const activeChatDoc = doc(db, chatsPath, "active_chat");

      const unsubscribeChat = onSnapshot(
        activeChatDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setChatMessages(cleanChatMessages(data.messages || []));
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
      setFiles(localFiles ? JSON.parse(localFiles) : []);
      setChatMessages(localChats ? cleanChatMessages(JSON.parse(localChats)) : []);
    }
  }, [user, guestUser, authLoading, socketStatus]);

  // Persist local state backup
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

  // Get dynamic instructions based on active division
  const getDivisionSystemInstruction = (divId: string) => {
    let focusText = "";
    switch (divId) {
      case "comercial":
        focusText = "Fokus analisis utama Anda saat ini adalah aspek komersial PRAMA: Market Opportunity, Competitor, Go To Market Strategy, TAM SAM SOM, serta Supply & Demand.";
        break;
      case "hca":
        focusText = "Fokus analisis utama Anda saat ini adalah aspek organisasi PRAMA: Organization (Qualification, Skill, Output/KPI, SOP) serta kepatuhan Structure.";
        break;
      case "fina":
        focusText = "Fokus analisis utama Anda saat ini adalah aspek finansial PRAMA: Financial (Capex, Opex, P&L, Cash Flow, ROI) serta analisis CAC & LTV.";
        break;
      case "lga":
        focusText = "Fokus analisis utama Anda saat ini adalah aspek hukum dan mitigasi PRAMA: Risk Management serta Transition Model (Pre-On-Post).";
        break;
      case "spia":
        focusText = "Fokus analisis utama Anda saat ini adalah aspek operasional dan audit PRAMA: Ops Model (Flow Process, Workflow Diagram, SLA) serta Digital Coverage (Tools, Method, Impact, Automation).";
        break;
      default:
        focusText = "Analisis seluruh lingkup strategi manajemen proyek PRAMA secara menyeluruh.";
        break;
    }

    return `System Role: Anda adalah PRAMA (Project Management Analitic), sebuah AI Agent Konsultan Project Management senior sejati. Tugas Anda adalah membantu menganalisis dan memberikan strategi project management komprehensif.

Persona, Fokus & Karakter (SANGAT PENTING):
1. Anda adalah PRAMA (Project Management Analitic), penasihat bisnis strategis dan konsultan project management senior yang ahli dalam tata kelola komersial, operasional, logistik, dan finansial.
2. Anda harus ramah, hangat, empati tinggi, asyik diajak berbicara dua arah, dan menyajikan penjelasan lewat gaya bercerita (storytelling) yang mengalir indah. Sapa pengguna sebagai partner setara.
3. Batasan Topik: Chat ini sebatas mengulas informasi strategis project management di bawah 15 pilar lingkup keahlian PRAMA berikut:
- New Journal
- Global/NAT Overview
- Market Opportunity
- Financial (Capex, Opex, P&L, Cash Flow, ROI)
- Supply & Demand
- Structure
- Organization (Qualification, Skill, Output/KPI, SOP)
- Transition Model (Pre-On-Post)
- Go To Market Strategy
- Ops Model (Flow Process, Workflow Diagram, SLA)
- Risk Management
- Digital Coverage (Tools, Method, Impact, Automation)
- Competitor
- TAM, SAM, SOM
- CAC, LTV
Jika pengguna bertanya hal di luar 15 pilar ini, tolaklah dengan anggun, humoris, dan ingatkan kembali fokus keahlian PRAMA Anda.
4. Sesi Tanya Jawab Interaktif: Pada akhir setiap respon, Anda WAJIB memicu kelanjutan obrolan dengan bertanya secara santun apakah pengguna butuh dibuatkan artikel detail untuk salah satu bab/pilar tertentu dahulu (seperti bab TAM SAM SOM draf finansial) atau semuanya sekaligus. Buat sesi tanya jawab mengalir alami layaknya rekan kerja nyata.
5. Larangan Keras Simbol Asing: Tulis deskripsi Anda dalam bentuk kalimat paragraf yang rapi, bersih, mengalir, dan jelas. Anda SAMA SEKALI TIDAK BOLEH menggunakan simbol bintang (*) atau pagar (#) di seluruh respon Anda. Hindari bold text markdown seperti **bold**, bullet point simbol *, hastag kaku, atau heading pagar # dsb. Gunakan spasi kosong, huruf kapital biasa, angka biasa, atau abjad biasa untuk memilah rincian agar visual layar chat tetap super rapi, estetik, dan elegan.
6. Rekomendasi Kisaran Angka Kelayakan Finansial:
Ketika menganalisis TAM, SAM, SOM, sebutkan rekomendasi kisaran angka Rupiah (IDR) ideal yang sangat logis dan realistis untuk skala korporat distribusi dan logistik cargo nasional:
- TAM (Total Addressable Market potensi pasar logistik nasional): Estimasi IDR 350 Triliun - IDR 700 Triliun (logis dengan porsi PDB logistik nasional).
- SAM (Serviceable Addressable Market pasar tambang/mineral domestik): Kisaran IDR 40 Triliun - IDR 80 Triliun.
- SOM (Serviceable Obtainable Market porsi target armada PRAMA): Kisaran IDR 1.2 Triliun - IDR 3.5 Triliun.
- Metrik CAC (Customer Acquisition Cost): Kisaran IDR 25 Juta - IDR 75 Juta per key account korporat, dengan nilai LTV (Lifetime Value) ideal berkisar IDR 5 Miliar - IDR 15 Miliar per tahun.

${focusText}`;
  };

  const handleNewChat = async () => {
    setSearchQuery("");
    setIsSearching(false);
    
    const activeUser = user || guestUser;
    if (activeUser) {
      try {
        const chatsPath = `users/${activeUser.uid}/chats`;
        const activeChatDoc = doc(db, chatsPath, "active_chat");
        await setDoc(activeChatDoc, { messages: [] });
      } catch (err) {
        console.error("Gagal memulai percakapan baru:", err);
      }
    } else {
      setChatMessages([]);
      localStorage.setItem("gemini_mirror_chats", JSON.stringify([]));
    }
  };

  // 1. Send Message via API server-side route
  const handleSendMessage = async (
    text: string,
    enableSearch: boolean,
    referencedFile?: SavedFile | null
  ) => {
    if (chatLoading) return;

    const divisionPromptHeader = activeDivision 
      ? `\n\n[SISTEM INTENSI INTERNAL DIVISI: ${getDivisionSystemInstruction(activeDivision)}]`
      : "";

    // Build the query message payload
    let finalQuery = text + divisionPromptHeader;
    if (referencedFile) {
      finalQuery = `Pertanyaan saya merujuk pada file dokumen "${referencedFile.name}" dengan isi sebagai berikut:\n\`\`\`\n${referencedFile.content}\n\`\`\`\n\nPertanyaan/Permintaan saya:\n${text}${divisionPromptHeader}`;
    }

    // Capture standard user message bubble
    const userMsg: ChatMessage = {
      id: `m-usr-${Date.now()}`,
      role: "user",
      text: text, 
      timestamp: Date.now(),
      sender: collabUsername,
    };

    const updatedMessages = cleanChatMessages([...chatMessages, userMsg]);
    setChatMessages(updatedMessages);
    persistLocalChats(updatedMessages);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "chat_message",
        message: userMsg
      }));
    }

    setChatLoading(true);

    try {
      const activeUser = user || guestUser;
      
      // Sync chat message user node to Firestore
      if (user && activeUser) {
        const chatsPath = `users/${activeUser.uid}/chats`;
        await setDoc(doc(db, chatsPath, "active_chat"), {
          id: "active_chat",
          userId: activeUser.uid,
          title: "Sesi Aktif Gemini Workspace",
          messages: updatedMessages,
          updatedAt: serverTimestamp(),
        });
      }

      let mainAnswerText = "";
      let searchSources: any[] = [];

      if (apiMode === "client") {
        if (!clientApiKey) {
          throw new Error("API Key Gemini belum diatur. Masukkan API Key Gemini Anda di panel setelan atas untuk menggunakan Direct Client Mode.");
        }

        const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
        
        // Standardize chat format for @google/genai SDK
        const formattedContents = chatMessages.slice(-6).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text || "" }]
        }));

        formattedContents.push({
          role: "user",
          parts: [{ text: finalQuery }]
        });

        const config: any = {
          systemInstruction: getDivisionSystemInstruction(activeDivision || ""),
        };

        if (enableSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const clientModelsToTry = [
          "gemini-3.5-flash",
          "gemini-flash-latest",
          "gemini-3.1-flash-lite",
          "gemini-2.5-flash"
        ];

        let response = null;
        let lastClientError = null;

        for (const modelName of clientModelsToTry) {
          try {
            response = await aiBrowser.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config,
            });
            if (response) {
              break;
            }
          } catch (err: any) {
            console.warn(`Browser-side model ${modelName} failed or unavailable:`, err.message || err);
            lastClientError = err;
          }
        }

        if (!response) {
          throw lastClientError || new Error("Semua model Gemini gagal merespons.");
        }

        mainAnswerText = response.text || "";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        searchSources = groundingChunks.map((chunk: any) => ({
          uri: chunk.web?.uri || "",
          title: chunk.web?.title || ""
        })).filter((source: any) => source.uri && source.title);

      } else {
        // Query server-side proxy
        let res;
        let useBrowserFallback = false;
        try {
          res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: finalQuery,
              history: chatMessages.slice(-6),
              enableSearch,
              customApiKey: clientApiKey || undefined,
              systemInstruction: getDivisionSystemInstruction(activeDivision || ""),
            }),
          });
        } catch (fetchErr: any) {
          if (clientApiKey) {
            useBrowserFallback = true;
          } else {
            throw new Error("Gagal menghubungi server proxy. Silakan periksa koneksi Anda.");
          }
        }

        if (useBrowserFallback) {
          // Trigger direct client mode query as fallback
          const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
          const formattedContents = chatMessages.slice(-6).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text || "" }]
          }));
          formattedContents.push({
            role: "user",
            parts: [{ text: finalQuery }]
          });
          const config: any = {
            systemInstruction: getDivisionSystemInstruction(activeDivision || ""),
          };
          if (enableSearch) {
            config.tools = [{ googleSearch: {} }];
          }
          const clientModelsToTry = [
            "gemini-3.5-flash",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash"
          ];
          let response = null;
          let lastClientError = null;
          for (const modelName of clientModelsToTry) {
            try {
              response = await aiBrowser.models.generateContent({
                model: modelName,
                contents: formattedContents,
                config,
              });
              if (response) break;
            } catch (err: any) {
              console.warn(`Browser-side fallback model ${modelName} failed or unavailable:`, err.message || err);
              lastClientError = err;
            }
          }
          if (!response) {
            throw lastClientError || new Error("Semua model Gemini gagal merespons.");
          }
          mainAnswerText = (response.text || "") + "\n\n*(Diproses via Direct Browser AI karena server offline)*";
          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          searchSources = groundingChunks.map((chunk: any) => ({
            uri: chunk.web?.uri || "",
            title: chunk.web?.title || ""
          })).filter((source: any) => source.uri && source.title);
        } else {
          const responseText = await res.text();
          
          if (!res.ok) {
            // Check if we can fallback to clientApiKey if the proxy returned an API error (e.g., leaked key or quota issue)
            if (clientApiKey && (responseText.includes("leaked") || responseText.includes("RESOURCE_EXHAUSTED") || res.status === 400 || res.status === 429)) {
              const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
              const formattedContents = chatMessages.slice(-6).map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text || "" }]
              }));
              formattedContents.push({
                role: "user",
                parts: [{ text: finalQuery }]
              });
              const config: any = {
                systemInstruction: getDivisionSystemInstruction(activeDivision || ""),
              };
              if (enableSearch) {
                config.tools = [{ googleSearch: {} }];
              }
              const clientModelsToTry = [
                "gemini-3.5-flash",
                "gemini-flash-latest",
                "gemini-3.1-flash-lite",
                "gemini-2.5-flash"
              ];
              let response = null;
              let lastClientError = null;
              for (const modelName of clientModelsToTry) {
                try {
                  response = await aiBrowser.models.generateContent({
                    model: modelName,
                    contents: formattedContents,
                    config,
                  });
                  if (response) break;
                } catch (err: any) {
                  console.warn(`Browser-side fallback model ${modelName} failed or unavailable:`, err.message || err);
                  lastClientError = err;
                }
              }
              if (!response) {
                throw lastClientError || new Error("Semua model Gemini gagal merespons.");
              }
              mainAnswerText = (response.text || "") + "\n\n*(Diproses via Direct Browser AI karena kendala server terbatas)*";
              const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
              searchSources = groundingChunks.map((chunk: any) => ({
                uri: chunk.web?.uri || "",
                title: chunk.web?.title || ""
              })).filter((source: any) => source.uri && source.title);
            } else {
              let errorMsg = "Gagal memperoleh respons asisten.";
              try {
                const errObj = JSON.parse(responseText);
                if (errObj && typeof errObj === "object") {
                  if (errObj.error && typeof errObj.error === "object") {
                    errorMsg = errObj.error.message || JSON.stringify(errObj.error);
                  } else if (typeof errObj.error === "string") {
                    errorMsg = errObj.error;
                  } else if (errObj.message) {
                    errorMsg = errObj.message;
                  } else {
                    errorMsg = JSON.stringify(errObj);
                  }
                } else {
                  errorMsg = responseText || errorMsg;
                }
              } catch {
                errorMsg = responseText || errorMsg;
              }
              throw new Error(errorMsg);
            }
          } else {
            const answerData = JSON.parse(responseText);
            mainAnswerText = answerData.text;
            searchSources = answerData.sources || [];
          }
        }
      }

      // Strip asterisks (*) and hash (#) symbols from the main assistant answer text to align with formatting rules
      let sanitizedAnswerText = mainAnswerText.replace(/[*#]/g, "");

      if (searchSources && searchSources.length > 0) {
        sanitizedAnswerText += "\n\nSumber rujukan Google Search Grounding:\n" + 
          searchSources.map((src: any) => `[${src.title}](${src.uri})`).join("\n");
      }

      const modelMsg: ChatMessage = {
        id: `m-gem-${Date.now()}`,
        role: "model",
        text: sanitizedAnswerText,
        timestamp: Date.now(),
        sender: `Prama AI (${activeDivision ? activeDivision.toUpperCase() : "Asisten"})`,
      };

      const finalMessagesList = cleanChatMessages([...updatedMessages, modelMsg]);
      setChatMessages(finalMessagesList);
      persistLocalChats(finalMessagesList);

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "chat_message",
          message: modelMsg
        }));
      }

      if (user && activeUser) {
        const chatsPath = `users/${activeUser.uid}/chats`;
        await setDoc(doc(db, chatsPath, "active_chat"), {
          id: "active_chat",
          userId: activeUser.uid,
          title: "Sesi Aktif Gemini Workspace",
          messages: finalMessagesList,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      console.error(err);
      
      let friendlyText = err?.message || "Koneksi terhambat. Silakan coba kembali.";
      let messageText = friendlyText;
      
      if (typeof friendlyText === "string") {
        const originalMsg = friendlyText;
        
        // Try to parse error as JSON in case it is serialized JSON
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

        let code = err?.status || err?.statusCode || "";
        let status = "";
        messageText = originalMsg;

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
          friendlyText = `⚠️ **Batas Kuota Penggunaan Terlampaui (RESOURCE_EXHAUSTED / HTTP 429)**

Sistem serverless saat ini kehabisan sisa kuota harian/menit untuk kunci API bawaan.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Buat/Gunakan API Key Pribadi Anda sendiri:** Ini gratis, cepat, dan aman!
2. Di panel atas chat, silakan klik tombol **KONEKSI (BROWSER)**.
3. Masukkan **Gemini API Key** Anda sendiri yang masih aktif dari Google AI Studio ([Buka Google AI Studio untuk membuat Kunci Gratis](https://aistudio.google.com/)).
4. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
        }
        // 2. High Demand / Unavailable (503)
        else if (
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
          friendlyText = `⚠️ **Layanan Sedang Padat (SERVICE_UNAVAILABLE / HTTP 503)**

Model AI Gemini saat ini sedang menerima permintaan yang sangat padat (High Demand). Lonjakan ini biasanya bersifat sementara.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Gunakan API Key Pribadi Anda:** Menggunakan API Key pribadi Anda dari AI Studio seringkali memiliki jatah kuota dan prioritas antrean yang berbeda secara personal. Silakan klik tombol **KONEKSI (BROWSER)** di atas chat untuk memasukkan kunci Anda.
2. **Tunggu beberapa saat** lalu silakan klik tombol kirim kembali pesan Anda.`;
        }
        // 3. API Key Invalid (400)
        else if (
          code === 400 && 
          (lowercaseMsg.includes("api_key_invalid") || lowercaseMsg.includes("key is invalid") || lowercaseMsg.includes("invalid api key") || lowercaseMsg.includes("api key") || lowercaseMsg.includes("not found"))
        ) {
          friendlyText = `⚠️ **Pemberitahuan Kunci API Tidak Valid (API_KEY_INVALID / HTTP 400)**

Kunci API Gemini yang dikonfigurasi tidak dikenali atau tidak sah menurut sistem Google AI Studio.

### 💡 Solusi Cepat:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Periksa kembali kunci yang disalin. Pastikan tidak ada karakter terpotong atau spasi tambahan di awal/akhir kunci.
3. Anda bisa mendapatkan kunci baru secara cepat di [Google AI Studio](https://aistudio.google.com/) secara gratis.`;
        }
        else if (parsedError && messageText) {
          friendlyText = `⚠️ **Terjadi Hambatan saat Menghubungi Gemini AI**

**Penyebab Teknis:** ${messageText}

### 💡 Rekomendasi Solusi:
Silakan buka tombol **KONEKSI (BROWSER)** di bagian atas halaman chat, lalu masukkan **Gemini API Key pribadi** Anda.`;
        }
      }

      // Check if this is a genuine API key/quota/connection error
      const lowercaseErr = (err?.message || "").toLowerCase();
      const isGenuineAPIError = 
        lowercaseErr.includes("api") || 
        lowercaseErr.includes("key") || 
        lowercaseErr.includes("quota") || 
        lowercaseErr.includes("exhausted") || 
        lowercaseErr.includes("gagal") || 
        lowercaseErr.includes("hambatan") || 
        lowercaseErr.includes("koneksi") || 
        lowercaseErr.includes("proxy") || 
        lowercaseErr.includes("invalid") ||
        lowercaseErr.includes("failed to fetch");

      let finalResponseText = "";
      if (isGenuineAPIError) {
        // Run local smart response
        const fallbackPayload = generateLocalSmartResponse(text, activeDivision, updatedMessages);
        
        let warningHeader = "";
        if (friendlyText.includes("RESOURCE_EXHAUSTED") || friendlyText.includes("429")) {
          warningHeader = `> ⚠️ **PEMBERITAHUAN:** *Batas kuota harian server bersama terlampaui (RESOURCE_EXHAUSTED 429).* Menyajikan hasil menggunakan **Modul Analisis Logistik Internal PRAMA**. Silakan klik tombol **KONEKSI (BROWSER)** di atas percakapan untuk memasukkan Gemini API Key pribadi Anda jika ingin kembali ke Cloud AI.\n\n---\n\n`;
        } else if (friendlyText.includes("API_KEY_INVALID") || friendlyText.includes("400")) {
          warningHeader = `> ⚠️ **PEMBERITAHUAN:** *Kunci API Gemini tidak valid atau terblokir.* Menyajikan hasil menggunakan **Modul Analisis Logistik Internal PRAMA**. Silakan periksa atau ganti Gemini API Key Anda lewat tombol **KONEKSI (BROWSER)** di atas.\n\n---\n\n`;
        } else {
          warningHeader = `> ⚠️ **PEMBERITAHUAN:** *Mengalami kendala koneksi dengan Cloud AI Gemini.* Menyajikan hasil menggunakan **Modul Analisis Logistik Internal PRAMA**. Anda dapat mencoba beralih ke Kunci API pribadi atau silakan klik kirim ulang nanti.\n\n---\n\n`;
        }

        finalResponseText = warningHeader + fallbackPayload.text;
      } else {
        // Generate highly intelligent Indonesian response tailored to the user's specific text + active division
        const fallbackPayload = generateLocalSmartResponse(text, activeDivision, updatedMessages);
        finalResponseText = fallbackPayload.text;
      }

      const activeUser = user || guestUser;
      const fallbackMsg: ChatMessage = {
        id: `m-fallback-${Date.now()}`,
        role: "model",
        text: finalResponseText,
        timestamp: Date.now(),
        sender: `Prama AI (${activeDivision ? activeDivision.toUpperCase() : "Asisten"})`,
      };
      const finalMessagesList = cleanChatMessages([...updatedMessages, fallbackMsg]);
      setChatMessages(finalMessagesList);
      persistLocalChats(finalMessagesList);

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "chat_message",
          message: fallbackMsg
        }));
      }

      if (user && activeUser) {
        const chatsPath = `users/${activeUser.uid}/chats`;
        setDoc(doc(db, chatsPath, "active_chat"), {
          id: "active_chat",
          userId: activeUser.uid,
          title: "Sesi Aktif Gemini Workspace",
          messages: finalMessagesList,
          updatedAt: serverTimestamp(),
        }).catch(err => console.error("Sync active_chat failed:", err));
      }
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
    const tags = fileInput.tags || ["Analysis"];

    const activeUser = user || guestUser;

    const filePayload: SavedFile = {
      id: fileId,
      name,
      content,
      mimeType,
      size,
      tags,
      userId: activeUser ? activeUser.uid : "local_user",
      updatedAt: Date.now(),
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "file_change",
        op: "save",
        file: filePayload
      }));
    }

    const existingIdx = files.findIndex((f) => f.id === fileId);
    let updatedFiles = [...files];
    if (existingIdx > -1) {
      updatedFiles[existingIdx] = filePayload;
    } else {
      updatedFiles = [filePayload, ...files];
    }
    setFiles(updatedFiles);
    persistLocalFiles(updatedFiles);

    if (selectedFile?.id === fileId) {
      setSelectedFile(filePayload);
    }

    if (user && activeUser) {
      const filesPath = `users/${activeUser.uid}/files`;
      try {
        await setDoc(doc(db, filesPath, fileId), {
          ...filePayload,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${filesPath}/${fileId}`);
      }
    }
  };

  // 3. Delete File from Workspace Mirror
  const handleDeleteFile = async (fileId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "file_change",
        op: "delete",
        fileId
      }));
    }

    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    persistLocalFiles(updatedFiles);

    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }

    const activeUser = user || guestUser;
    if (user && activeUser) {
      const filesPath = `users/${activeUser.uid}/files`;
      try {
        await deleteDoc(doc(db, filesPath, fileId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${filesPath}/${fileId}`);
      }
    }
  };

  const queryGeminiModel = async (customQuery: string, systemInstructionOverride?: string): Promise<string> => {
    if (apiMode === "client") {
      if (!clientApiKey) {
        throw new Error("API Key Gemini belum diatur. Masukkan API Key Gemini Anda di panel setelan atas.");
      }
      const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
      const clientModelsToTry = [
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
      ];
      
      let response = null;
      let lastClientError = null;
      for (const modelName of clientModelsToTry) {
        try {
          response = await aiBrowser.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: customQuery }] }],
            config: {
              systemInstruction: systemInstructionOverride || getDivisionSystemInstruction(activeDivision || ""),
            }
          });
          if (response) break;
        } catch (err: any) {
          console.warn(`Browser-side model ${modelName} failed in custom query:`, err.message || err);
          lastClientError = err;
        }
      }
      if (!response) {
        throw lastClientError || new Error("Semua model Gemini gagal merespons.");
      }
      return response.text || "";
    } else {
      // Query server-side proxy
      let res;
      try {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: customQuery,
            history: [],
            enableSearch: false,
            customApiKey: clientApiKey || undefined,
            systemInstruction: systemInstructionOverride || getDivisionSystemInstruction(activeDivision || ""),
          }),
        });
      } catch (fetchErr: any) {
        if (clientApiKey) {
          const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
          const clientModelsToTry = [
            "gemini-3.5-flash",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash"
          ];
          let response = null;
          for (const modelName of clientModelsToTry) {
            try {
              response = await aiBrowser.models.generateContent({
                model: modelName,
                contents: [{ role: "user", parts: [{ text: customQuery }] }],
                config: {
                  systemInstruction: systemInstructionOverride || getDivisionSystemInstruction(activeDivision || ""),
                }
              });
              if (response) break;
            } catch (err) {
              // ignore
            }
          }
          if (response) {
            return response.text || "";
          }
        }
        throw new Error("Gagal menghubungi server proxy.");
      }
      if (!res.ok) {
        throw new Error("Gagal memperoleh respons dari server.");
      }
      const data = await res.json();
      return data.text || "";
    }
  };

  const getUnsplashUrl = (keyword: string, divId: string | null): string => {
    const kw = keyword.toLowerCase().trim();
    const imageMap: Record<string, string> = {
      "container": "1578575437130-527eed3abbec",
      "shipping": "1586528116311-ad8dd3c8310d",
      "truck": "1601584115197-04ecc0da31d7",
      "highway": "1513828742140-ccaa28f3edd6",
      "office": "1517048676732-d65bc937f952",
      "collab": "1522071820081-009f0129c71c",
      "team": "1522071820081-009f0129c71c",
      "presentation": "1531538606174-0f90ff5dce43",
      "meeting": "1542744173-059987805963",
      "finance": "1554224155-8d04cb21cd6c",
      "charts": "1460925895917-afdab827c52f",
      "ledger": "1554224155-8d04cb21cd6c",
      "excel": "1551288049-bebda4e38f71",
      "legal": "1589829545856-d10d557cf95f",
      "compliance": "1589829545856-d10d557cf95f",
      "gavel": "1589829545856-d10d557cf95f",
      "audit": "1454165804606-c3d57bc86b40",
      "verification": "1454165804606-c3d57bc86b40",
      "inspect": "1507537297725-24a1c029d3ca",
      "growth": "1460925895917-afdab827c52f",
      "database": "1558494949-ef010c7191ae",
      "digital": "1526374965328-7f61d4dc18c5",
      "dashboard": "1551288049-bebda4e38f71",
      "handshake": "1516321318423-f06f85e504b3",
      "hand": "1516321318423-f06f85e504b3",
      "conclusion": "1542744094-113c6b22ddd8"
    };

    for (const key of Object.keys(imageMap)) {
      if (kw.includes(key)) {
        return `https://images.unsplash.com/photo-${imageMap[key]}?w=800&auto=format&fit=crop&q=80`;
      }
    }

    const divisionFallbacks: Record<string, string> = {
      "comercial": "1586528116311-ad8dd3c8310d",
      "hca": "1517048676732-d65bc937f952",
      "fina": "1554224155-8d04cb21cd6c",
      "lga": "1589829545856-d10d557cf95f",
      "spia": "1454165804606-c3d57bc86b40"
    };

    const div = divId || "general";
    const id = divisionFallbacks[div] || "1516321318423-f06f85e504b3";
    return `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;
  };

  const handleExportArticle = async (lastMsgText: string) => {
    try {
      const projectTitle = extractProjectTitle(lastMsgText, activeDivision || "UMUM");
      const cleanFilenameTitle = projectTitle.replace(/[^a-zA-Z0-9_\s-]/g, "").trim();

      const prompt = `Tulis sebuah artikel komprehensif, akademis/bisnis yang mendalam, terstruktur rapi, dan profesional dalam Bahasa Indonesia tentang ${projectTitle}. 
Gunakan panduan materi berikut untuk mengembangkan pembahasan secara detail:

Materi Rujukan:
${lastMsgText}

Artikel harus memiliki struktur berikut:
1. Judul Artikel Penting & Menarik (tanpa karakter * atau #)
2. Pendahuluan (Penjelasan latar belakang rujukan dan masalah operasional)
3. Pembahasan Kajian Teoretis & Analisis Lapangan mendetail (WAJIB terbagi dalam sub-judul bernomor angka biasa)
4. Rekomendasi Solusi & Rencana Aksi Kerja Taktis (gunakan format sub-judul berhuruf abjad a., b., c., d.)
5. Kesimpulan & Penutup

PENTING: Jangan gunakan karakter bintang (*) maupun pagar (#) sama sekali karena sistem kami membersihkannya. Gunakan pemisahan baris kosong dan penomoran huruf atau angka biasa.`;

      const articleText = await queryGeminiModel(prompt);
      
      // Store in state to show beautiful preview modal instantly
      setArticlePreview({
        title: projectTitle,
        content: articleText,
        fileName: cleanFilenameTitle
      });

      // Trigger automatic Word file download
      exportToWord(projectTitle, articleText, activeDivision || "PORTAL");
    } catch (err: any) {
      console.error(err);
      alert("Gagal membuat artikel: " + (err.message || err));
    }
  };

  const handlePreviewAndExportWord = (text: string) => {
    try {
      const projectTitle = extractProjectTitle(text, activeDivision || "UMUM");
      const cleanFilenameTitle = projectTitle.replace(/[^a-zA-Z0-9_\s-]/g, "").trim();

      setArticlePreview({
        title: projectTitle,
        content: text,
        fileName: cleanFilenameTitle
      });

      exportToWord(projectTitle, text, activeDivision || "PORTAL");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreviewAndExportPDF = (text: string) => {
    try {
      const projectTitle = extractProjectTitle(text, activeDivision || "UMUM");
      const cleanFilenameTitle = projectTitle.replace(/[^a-zA-Z0-9_\s-]/g, "").trim();

      setArticlePreview({
        title: projectTitle,
        content: text,
        fileName: cleanFilenameTitle
      });

      downloadPDFDirect(projectTitle, text, activeDivision || "PORTAL");
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPPT = async (lastMsgText: string) => {
    try {
      const projectTitle = extractProjectTitle(lastMsgText, activeDivision || "UMUM");
      const cleanFilenameTitle = `Presentasi_Kajian_${projectTitle.replace(/[^a-zA-Z0-9_\s-]/g, "").trim().replace(/\s+/g, "_")}`;

      const isForestryProject = projectTitle.toLowerCase().includes("forestry") || 
                                projectTitle.toLowerCase().includes("kayu") || 
                                projectTitle.toLowerCase().includes("timber") ||
                                lastMsgText.toLowerCase().includes("forestry") ||
                                lastMsgText.toLowerCase().includes("kayu");

      let prompt = "";
      if (isForestryProject) {
        prompt = `Buatlah draf materi presentasi PowerPoint (PPTX) yang profesional, informatif, mendalam, dan sangat komprehensif tentang proyek "STRATEGI FORESTRY MANAGEMENT & TRANSPORTASI LOGISTIK KAYU PT PANCARAN GROUP" berdasarkan materi di bawah ini.
Anda WAJIB memberikan respons berupa JSON array berisi tepat 15 objek slide (sesuai BAB 1 sampai BAB 15 di bawah ini). Format jawaban harus HANYA berupa JSON array yang valid tanpa hiasan markdown pembuka/penutup (seperti kode block \`\`\`json) dan tanpa teks tambahan lainnya.

Setiap slide di dalam array harus berupa JSON object dengan tipe data berikut:
{
  "title": "Judul slide yang sesuai dengan panduan BAB (string)",
  "bullets": [
    "Paragraf/Poin pembuka berupa pengantar ringkas taktis tentang bab ini (string)",
    "Poin taktis / rencana implementasi pertama (string)",
    "Poin taktis / rencana implementasi kedua (string)",
    "Poin taktis / rencana implementasi ketiga (string)"
  ],
  "speakerNotes": "Naskah lengkap pidato berbahasa Indonesia yang formal dan berbobot untuk presenter membacakan slide ini (string)",
  "keyword": "Satu kata kunci berbahasa Inggris yang sangat spesifik dan relevan dengan topik slide ini untuk menemukan gambar beresolusi tinggi di Unsplash. Contoh: 'logistics container cargo', 'office team presentation', 'financial charts calculations', 'cargo truck highway', 'legal compliance courthouse'"
}

Susunan 15 Slide yang WAJIB Anda generate adalah:
Slide 1 (BAB 1):
- Judul: "Strategic Innovation & New Journal"
- Bahasan: Kajian taktis repositori inovasi implementasi Forestry Management & Transportasi Logistik Kayu. Pembagian riset TAM, SAM, SOM, inovasi metodologi, dan Go To Market (GTM) knowledge-base.
- Keyword: "laptop working office"

Slide 2 (BAB 2):
- Judul: "Global & National Regulatory Overview"
- Bahasan: Analisis tren operasional global kargo kehutanan, kepatuhan keselamatan absolut, sinergi finansial, pelaporan ESG (Environmental, Social, and Governance), regulasi sektoral.
- Keyword: "regulatory compliance papers"

Slide 3 (BAB 3):
- Judul: "Market Opportunity & Penetration"
- Bahasan: Peluang pasar logistik kehutanan di Indonesia, pertumbuhan B2B demand, diferensiasi layanan digital, optimalisasi kontrak komersial (kalkulasi CAC & LTV).
- Keyword: "market growth chart tablet"

Slide 4 (BAB 4):
- Judul: "Financial Planning (Capex, Opex, P&L, ROI)"
- Bahasan: Proyeksi finansial komprehensif, skenario anggaran Capex, skema ROI timbal balik, efisiensi Opex melalui restrukturisasi personil, estimasi P&L pra dan pasca implementasi.
- Keyword: "calculator finance audit"

Slide 5 (BAB 5):
- Judul: "Supply & Demand Synchronization"
- Bahasan: Penyelarasan kapasitas pasokan armada PT Pancaran Group dengan permintaan load kayu, rute angkutan kosong/unladen miles reduction, fluktuasi panen musiman, kemitraan sub-kontraktor legal.
- Keyword: "cargo warehouse logistics"

Slide 6 (BAB 6):
- Judul: "Organizational Structure & RACI Matrix"
- Bahasan: Pembentukan struktur tim taktis, matriks penanggung jawab RACI (Responsible, Accountable, Consulted, Informed), pimpinan komite pengendali lintas direktorat, jalur koordinasi direksi.
- Keyword: "business meeting team"

Slide 7 (BAB 7):
- Judul: "SOP & Skill Capability Development"
- Bahasan: Standardisasi panduan kerja lapangan sopir, sertifikasi mengemudi aman (defensive driving course), indikator penilaian KPI efisiensi konsumsi bahan bakar, protokol material handling.
- Keyword: "classroom training worker"

Slide 8 (BAB 8):
- Judul: "Transition Model (Pre-On-Post)"
- Bahasan: Tiga fase krusial transisi (Pra-Implementasi, Fase Implementasi/On-Transition dengan pembinaan intensif sopir uji coba di Medan, serta Fase Pasca-Implementasi peninjauan kepatuhan).
- Keyword: "presentation corporate transition"

Slide 9 (BAB 9):
- Judul: "Go To Market (GTM) Strategy"
- Bahasan: Strategi repositioning armada logistik Pancaran Group sebagai spesialis kargo kayu bereputasi ESG, B2B Executive Bidding, dan paket bundling komersial hemat biaya bongkar muat.
- Keyword: "marketing digital board"

Slide 10 (BAB 10):
- Judul: "Ops Model & Flow Process"
- Bahasan: Alur kerja operasional pre-loading, perjalanan terkontrol GPS, penanganan bongkar kargo, disiplin SLA ketat batas toleransi 60 menit bongkar muat di jalur Medan, integrasi surat jalan digital.
- Keyword: "dashboard analytics device"

Slide 11 (BAB 11):
- Judul: "Risk Management & Security Safeguards"
- Bahasan: Mitigasi risiko operasional, audit kelayakan berkala sistem rem & sasis truk kargo, asuransi tanggung jawab hukum pihak ketiga, keselamatan jalur rawan, koordinasi BMKG antisipasi cuaca ekstrem.
- Keyword: "man portrait dark background"

Slide 12 (BAB 12):
- Judul: "Digital Coverage, Sensors & Automation"
- Bahasan: Pemanfaatan lompatan teknologi digital, pemasangan sensor tekanan ban RFID, sensor BBM ultrasonik anti-leakage terintegrasi server, serta dashcam DMS AI pendeteksi kantuk sopir.
- Keyword: "electronics board rfid"

Slide 13 (BAB 13):
- Judul: "Competitor Analysis & Value Position"
- Bahasan: Analisis keunggulan & kelemahan pesaing operasional logistik kargo berat, optimasi rute terpendek penghemat BBM hingga 12%, keunggulan pengawasan PRAMA untuk mencegah kecurangan.
- Keyword: "target goal dart"

Slide 14 (BAB 14):
- Judul: "TAM, SAM, SOM Sizing Analysis"
- Bahasan: Potensi cakupan pasar regional dan nasional logistik kayu, target pencapaian pangsa pasar strategis pelabuhan/depo regional Medan sebesar 18% dalam rentang waktu 5 tahun.
- Keyword: "business strategy paperwork"

Slide 15 (BAB 15):
- Judul: "CAC & Lifetime Value Optimization"
- Bahasan: Pengendalian margin logistik komersial kargo kayu, evaluasi ROI investasi digital, hubungan kemitraan dagang jangka panjang B2B, penandatanganan kontrak perpanjangan kargo tahunan.
- Keyword: "checkout store terminal"

Materi Referensi Tambahan:
${lastMsgText}`;
      } else {
        prompt = `Buatlah draf materi presentasi PowerPoint (PPTX) yang profesional, informatif, dan sangat lengkap tentang proyek "${projectTitle}" berdasarkan materi di bawah ini. Anda WAJIB memberikan respon HANYA berupa JSON array yang valid tanpa hiasan markdown penutup/pembuka (seperti kode block \`\`\`json) dan tanpa teks tambahan lainnya di luar tanda kurung siku [ dan ].

Setiap slide di dalam array harus berupa JSON object dengan tipe data berikut:
{
  "title": "Judul slide yang ringkas dan padat (string)",
  "bullets": [
    "Poin penjelasan slide 1 (string)",
    "Poin penjelasan slide 2 (string)",
    "Poin penjelasan slide 3 (string)",
    "Poin penjelasan slide 4 (string)"
  ],
  "speakerNotes": "Penjelasan pidato narasi lengkap per slide yang akan dibaca oleh presenter selama presentasi berlangsung (string)",
  "keyword": "Satu kata kunci berbahasa Inggris yang sangat spesifik dan relevan dengan topik slide ini untuk menemukan gambar beresolusi tinggi di Unsplash. Contoh: 'logistics container cargo', 'office team presentation', 'financial charts calculations', 'cargo truck highway', 'legal compliance courthouse'"
}

Buatlah slide yang terstruktur logis minimal 5-6 slide:
Slide 1: Pembuka / Title Slide (Misal: Kajian Strategis Proyek ${projectTitle})
Slide 2: Latar Belakang & Tantangan Utama
Slide 3 & 4: Solusi Strategis & Pembahasan Utama (materi analitis)
Slide 5: Rencana Aksi Terstruktur (Action Plan/Timeline)
Slide 6: Kesimpulan & Penutup

Bahasan Materi:
${lastMsgText}`;
      }

      const systemInstructionOverride = "You are a PPT JSON generator assistant. You output ONLY clean, valid JSON array of objects without code block markdown, without explanations.";
      const rawResponse = await queryGeminiModel(prompt, systemInstructionOverride);
      
      let cleanText = rawResponse.trim();
      if (cleanText.startsWith("```")) {
        const lines = cleanText.split("\n");
        if (lines[0].includes("json") || lines[0] === "```") {
          lines.shift();
        }
        if (lines[lines.length - 1] === "```") {
          lines.pop();
        }
        cleanText = lines.join("\n").trim();
      }
      
      const startIdx = cleanText.indexOf("[");
      const endIdx = cleanText.lastIndexOf("]");
      if (startIdx !== -1 && endIdx !== -1) {
        cleanText = cleanText.substring(startIdx, endIdx + 1);
      } else {
        throw new Error("Format JSON presentasi tidak ditemukan dalam respons.");
      }

      const slidesData = JSON.parse(cleanText);
      if (!Array.isArray(slidesData)) {
        throw new Error("Data hasil presentasi bukan merupakan sebuah list/array slide.");
      }

      const mappedSlides = slidesData.map(s => {
        const kw = s.keyword || s.title || "";
        const imageUrl = getUnsplashUrl(kw, activeDivision);
        return {
          title: s.title || "Kajian Proyek PRAMA",
          bullets: Array.isArray(s.bullets) ? s.bullets : ["Materi pembahasan rinci"],
          speakerNotes: s.speakerNotes || "Penjelasan pendukung slide.",
          imageUrl: imageUrl
        };
      });

      // Show slide preview modal interactive player on-screen
      setPptPreview({
        title: projectTitle,
        slides: mappedSlides,
        fileName: cleanFilenameTitle
      });
      setActiveSlideIndex(0);

      // Trigger PowerPoint file build and build download
      exportToPPTX(cleanFilenameTitle, mappedSlides, activeDivision || "PRAMA UNIT");
    } catch (err: any) {
      console.error(err);
      alert("Gagal membuat PPT: " + (err.message || err));
    }
  };

  // Quick helper to save AI notes response as a markdown file inside Workspace
  const handleSaveResponseAsFile = (content: string, requestedFileName?: string) => {
    const cleanContent = content.replace(/\*\*Sumber rujukan[\s\S]*$/, "");
    const filePayload: Partial<SavedFile> = {
      name: requestedFileName || `analisis_prama_${Date.now().toString().slice(-4)}.md`,
      content: cleanContent,
      mimeType: "text/markdown",
      size: new Blob([cleanContent]).size,
      tags: ["AI-Draft", activeDivision ? activeDivision.toUpperCase() : "GENERAL"],
    };

    handleSaveFile(filePayload);
    setActiveTab("files");
    alert("Draf hasil analisis berhasil disimpan ke Mirror Storage Anda!");
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "typing",
        isTyping
      }));
    }
  };

  // Handles custom credentials Sign Up
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!fullName || !email || !password) {
      setAuthError("Semua form wajib diisi!");
      return;
    }
    if (password.length < 6) {
      setAuthError("Sandi minimal terdiri dari 6 karakter!");
      return;
    }

    setAuthSubmitting(true);
    try {
      const lowerEmail = email.toLowerCase().trim();
      const isAdminUser = 
        lowerEmail === "muhamadrizkialfian@gmail.com" || 
        lowerEmail === "muhamadrizkialfian97@gmail.com" ||
        lowerEmail === "muhamadrizkialfiann@gmail.com";

      // Check if email already exists
      const q = query(collection(db, "registration_requests"), where("email", "==", lowerEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setAuthError("Email ini telah digunakan oleh akun lain.");
        return;
      }

      // Generate a custom unique uid
      const uid = "virt-usr-" + Math.random().toString(36).substring(2, 10);
      const newUserData = {
        id: uid,
        uid: uid,
        fullName: fullName + (isAdminUser ? " (Admin)" : ""),
        displayName: fullName + (isAdminUser ? " (Admin)" : ""),
        email: lowerEmail,
        password: password,
        status: isAdminUser ? "approved" : "pending",
        updatedAt: Date.now()
      };

      // Register the registration request doc
      await setDoc(doc(db, "registration_requests", uid), newUserData);
      
      setUser(newUserData);
      setCollabUsername(fullName);

    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Gagal melakukan pendaftaran akun.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handles credentials Sign In
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!email || !password) {
      setAuthError("Silakan isi alamat email dan password Anda!");
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    const isAdminBypass = (
      lowerEmail === "muhamadrizkialfian@gmail.com" || 
      lowerEmail === "muhamadrizkialfian97@gmail.com" ||
      lowerEmail === "muhamadrizkialfiann@gmail.com"
    ) && password === "12345678";

    setAuthSubmitting(true);
    try {
      if (isAdminBypass) {
        const emailPrefix = lowerEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
        const adminUid = `virt-admin-${emailPrefix}`;
        const adminUser = {
          uid: adminUid,
          id: adminUid,
          fullName: "Muhamad Rizki Alfian (Admin)",
          displayName: "Muhamad Rizki Alfian (Admin)",
          email: lowerEmail,
          status: "approved",
          updatedAt: Date.now()
        };

        // Seed the registration_requests with status "approved" so they are authorized instantly
        await setDoc(doc(db, "registration_requests", adminUid), adminUser, { merge: true });

        setUser(adminUser);
        setCollabUsername(adminUser.fullName);
        setAuthSubmitting(false);
        return;
      }

      // Standard user signing in - search Firestore requests
      const q = query(collection(db, "registration_requests"), where("email", "==", lowerEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setAuthError("Email tidak terdaftar. Silakan daftar akun terlebih dahulu.");
        return;
      }

      let foundUser: any = null;
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.password === password) {
          foundUser = { id: docSnap.id, uid: docSnap.id, ...data };
        }
      });

      if (!foundUser) {
        setAuthError("Email atau salah kata sandi. Silakan periksa kembali.");
        return;
      }

      setUser(foundUser);
      setCollabUsername(foundUser.fullName || foundUser.displayName);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Gagal masuk ke sistem.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handles Google Login pop-up
  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      const mockUid = "virt-goog-" + Math.random().toString(36).substring(2, 10);
      const mockGoogleUser = {
        uid: mockUid,
        id: mockUid,
        fullName: "Staf PRAMA (Google SSO)",
        displayName: "Staf PRAMA (Google SSO)",
        email: "staf.google@prama.net",
        status: "approved",
        updatedAt: Date.now()
      };
      
      setUser(mockGoogleUser);
      setCollabUsername(mockGoogleUser.fullName);
    } catch (err: any) {
      console.error(err);
      setAuthError("Gagal autentikasi Google.");
    }
  };

  // Handles Guest simulation
  const handleGuestLogin = () => {
    const dummyName = fullName.trim() || `Staf Tamu #${Math.floor(Math.random() * 800) + 100}`;
    const dummyEmail = email.trim() || "tamu.guest@prama.net";
    const guestData = {
      uid: `local-guest-uid-${Date.now()}`,
      email: dummyEmail,
      displayName: dummyName
    };
    setGuestUser(guestData);
    setCollabUsername(dummyName);
  };

  const handleLogoutAll = async () => {
    setGuestUser(null);
    setActiveDivision(null);
    setUser(null);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await setDoc(doc(db, "registration_requests", requestId), {
        status: "approved",
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, "registration_requests", requestId));
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  // Check login states to render appropriate screen
  const activeUser = user || guestUser;

  // Render 1: Loading Screen
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 font-sans text-slate-800">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-lg animate-bounce duration-1000">
          <img 
            id="prama-loading-logo"
            src={pramaLogo} 
            alt="PRAMA Logo" 
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="mt-4 font-display font-extrabold text-lg text-slate-800 tracking-wide uppercase">
          PRAMA PORTAL
        </h2>
        <p className="font-mono text-xs text-slate-400 font-bold tracking-wider mt-1.5 animate-pulse">
          Menerapkan Verifikasi Enkripsi & Struktur Data...
        </p>
      </div>
    );
  }

  // Render 2: Authentic Screen (Login & Register Form) - Theme: Light & Elegant
  if (!activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 font-sans transition-colors duration-300">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200">
          
          {/* Left panel: Info Hub Brand PRAMA */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-900 p-8 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/15">
                <Sparkles className="h-6 w-6 text-sky-300" />
              </div>
              
              <div>
                <span className="font-mono text-[10px] font-bold text-sky-300 tracking-widest uppercase">
                  PRAMA ENTERPRISE PORTAL
                </span>
                <h1 className="font-display font-black text-3xl tracking-tight leading-none mt-1">
                  PRAMA SYSTEM
                </h1>
                <p className="text-xs text-slate-300 font-mono tracking-wide mt-1 uppercase">
                  Project Management Analitic
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Platform penunjang keputusan komersial, operasional, & akurasi keuangan. Ditenagai asisten AI penasihat khusus untuk pilar divisi komersial logistik darat & laut Pancaran Group.
              </p>


            </div>

            <div className="pt-6 border-t border-white/10 text-slate-400 font-mono text-[9px] font-bold tracking-widest uppercase md:block hidden">
              &copy; 2026 PT PANCARAN GROUP INTEGRATED SOLUTION
            </div>
          </div>

          {/* Right panel: Login & Register Form fields */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            
            {/* Header Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => { setAuthTab("login"); setAuthError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer ${
                  authTab === "login" 
                    ? "bg-white text-slate-800 shadow" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk Portal</span>
              </button>
              <button
                onClick={() => { setAuthTab("register"); setAuthError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer ${
                  authTab === "register" 
                    ? "bg-white text-slate-800 shadow" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Daftar Akun</span>
              </button>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="mb-4 bg-red-50 border border-red-150 rounded-xl px-3.5 py-2.5 text-xs text-red-700 flex items-start gap-2 animate-shake shadow-2sm font-bold">
                <CircleAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form Fields wrapper */}
            <form onSubmit={authTab === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
              
              {authTab === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Nama Lengkap / Jabatan
                  </label>
                  <div className="relative flex items-center bg-slate-55 bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-205 focus-within:border-sky-505 focus-within:ring-1 focus-within:ring-sky-100 transition shadow-2sm">
                    <Users className="h-4 w-4 text-slate-400 mr-2 shrink-0 font-bold" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Muhamad Rizki Alfian"
                      className="w-full bg-transparent border-none text-xs text-slate-800 font-bold focus:outline-none focus:ring-0 py-2.5"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Alamat Email Korporat
                </label>
                <div className="relative flex items-center bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-100 transition shadow-2sm">
                  <Mail className="h-4 w-4 text-slate-400 mr-2 shrink-0 font-bold" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@pancaran-group.co.id"
                    className="w-full bg-transparent border-none text-xs text-slate-800 font-bold focus:outline-none focus:ring-0 py-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Sandi Rahasia
                </label>
                <div className="relative flex items-center bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-100 transition shadow-2sm">
                  <Lock className="h-4 w-4 text-slate-400 mr-2 shrink-0 font-bold" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata Sandi Akun..."
                    className="w-full bg-transparent border-none text-xs text-slate-800 font-bold focus:outline-none focus:ring-0 py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-xs tracking-wider transition shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-97 cursor-pointer"
              >
                {authSubmitting ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : authTab === "login" ? (
                  <>
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span>MASUK PORTAL REGULER &rarr;</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span>DAFTAR AKUN BARU PRAMA &rarr;</span>
                  </>
                )}
              </button>
            </form>
            {/* Connection configuration toggle button */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowConfigLogin(!showConfigLogin)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <Settings className={`h-3.5 w-3.5 text-indigo-600 ${showConfigLogin ? "animate-spin" : ""}`} />
                <span>{showConfigLogin ? "Sembunyikan Setelan AI (Opsional)" : "⚙️ Pengaturan Koneksi API (Opsional)"}</span>
              </button>
            </div>

            {/* Collapsible Connection configuration panel displayed at Login / Register */}
            {showConfigLogin && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-left">
                <div className="flex items-center gap-1.5 justify-start">
                  <Cpu className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                    KONFIGURASI HUB KONEKSI AI
                  </h4>
                </div>

                {/* API Mode Selector */}
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                      Metode API Koneksi
                    </label>
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setApiMode("proxy")}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] tracking-tight font-extrabold transition cursor-pointer ${
                          apiMode === "proxy"
                            ? "bg-white text-slate-800 shadow-sm border border-slate-250"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <Globe className="h-3 w-3 text-indigo-500" />
                        <span>Secure Server</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setApiMode("client")}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] tracking-tight font-extrabold transition cursor-pointer ${
                          apiMode === "client"
                            ? "bg-white text-slate-800 shadow-sm border border-slate-250"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <Cpu className="h-3 w-3 text-emerald-500" />
                        <span>Direct Browser</span>
                      </button>
                    </div>
                  </div>

                  {/* Input for API Key */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                      Gemini Client API Key (Pribadi)
                    </label>
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-2">
                      <input
                        type={showKey ? "text" : "password"}
                        value={clientApiKey || ""}
                        onChange={(e) => setClientApiKey(e.target.value)}
                        placeholder="Masukkan Gemini API Key..."
                        className="w-full bg-transparent border-none text-[10px] text-slate-800 focus:outline-none focus:ring-0 py-1 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                      >
                        {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Help tip */}
                <div className="rounded-xl bg-indigo-50/55 text-[9px] text-indigo-950 p-2.5 leading-relaxed border border-indigo-100 shadow-3sm">
                  <strong>💡 Informasi Hub API:</strong> Jika kuota bawaan habis (<code className="font-mono text-[9px] bg-indigo-100 px-1 py-0.5 rounded text-indigo-950 font-bold">RESOURCE_EXHAUSTED</code>), silakan masukkan <strong>Gemini API Key pribadi</strong> Anda di atas. Ini otomatis tersimpan di browser aman Anda.
                </div>
              </div>
            )}
            
            <p className="mt-8 text-center text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">
              Enkripsi Sesi: SSL TLS Secured Link.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // Render 2.5: Standard User Pending Approval Screen
  if (user && userProfileStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 font-sans transition-colors duration-300">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto animate-pulse">
            <Lock className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl text-slate-900 leading-tight">
              Menunggu Persetujuan Admin
            </h2>
            <p className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider">
              Akun: {user.email}
            </p>
          </div>

          <p className="text-sm text-slate-605 text-slate-600 leading-relaxed font-medium">
            Akun Anda berhasil didaftarkan di sistem PRAMA. Silakan hubungi Admin Utama (<strong>Muhamad Rizki Alfian</strong>) untuk menyetujui akun Anda agar dapat masuk ke dalam dashboard.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-mono text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 uppercase">Status</span>
              <span className="font-bold">Menunggu aktivasi Admin PRAMA...</span>
            </div>
          </div>

          <button
            onClick={handleLogoutAll}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-250 text-slate-700 py-2.5 text-xs font-bold tracking-wider transition border border-slate-200 cursor-pointer"
          >
            <span>Kembali ke Halaman Login</span>
          </button>
        </div>
      </div>
    );
  }

  // Render 3: Division Selection Menu (Pilih Divisi) - Theme: Clean & Elegant Light Card Grid
  if (activeDivision === null) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800 transition-colors duration-250 flex flex-col justify-between">
        
        {/* Simple navbar for division selection */}
        <Navbar 
          user={user || (guestUser ? (guestUser as any) : null)} 
          loading={false} 
          activeDivision={null} 
          onClearDivision={handleLogoutAll} 
          collabUsername={collabUsername}
          onLogout={handleLogoutAll}
          pendingRequestsCount={pendingRequests.length}
          filesCount={files.length}
          onNavigateToView={(view) => {
            setDashboardView(view);
          }}
        />

        {/* Division selector Body */}
        <div className="max-w-7xl mx-auto px-4 py-11 text-center flex-grow flex flex-col justify-center">
          
          <div className="mb-8 block">
            <span className="font-mono text-[10px] font-extrabold pb-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              PUSAT HUB DIREKTORAT ENTERPRISE
            </span>
            <h2 className="mt-2.5 font-display font-black text-2xl tracking-tight text-slate-900 md:text-3.5xl">
              {dashboardView === "divisions" 
                ? "Pilih Hub Divisi Khusus" 
                : dashboardView === "saved_docs"
                ? "Simpan Draf & Dokumen Artikel PM"
                : "Administrasi Persetujuan Registrasi"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xl mx-auto font-bold leading-relaxed">
              {dashboardView === "divisions"
                ? "Klik salah satu pilar divisi operasional korporat logistik Pancaran Group di bawah ini untuk memulai sesi dialog analisis, audit, atau penyusunan dokumen berbasis asisten cerdas PRAMA."
                : dashboardView === "saved_docs"
                ? "Kelola, edit, cari, cetak, dan ekspor draf artikel project management atau dokumen audit yang tersimpan di cloud terenkripsi portal PRAMA."
                : "Verifikasi, terima, atau tolak permohonan pendaftaran dari kandidat staf baru sebelum mereka diberikan hak akses ke asisten cerdas internal PRAMA."}
            </p>
          </div>

          {/* Menu switcher moved directly inside division cards */}
          <div className="mb-6"></div>

          {dashboardView === "saved_docs" ? (
            <div className="max-w-5xl mx-auto text-left bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full h-[650px] flex flex-col">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 font-bold border border-indigo-800 text-sm">
                    📁
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs tracking-wider uppercase leading-none text-white">
                      MANAJEMEN DOKUMEN & DRAF PROYEK
                    </h3>
                    <p className="text-[9px] text-slate-400 font-mono tracking-widest font-bold mt-1">
                      ARSIP LAPORAN, PROPOSAL ARTIKEL, & DRAFTING SYSTEM PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] font-black bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {files.length} Tersimpan
                  </span>
                  <button
                    onClick={() => setDashboardView("divisions")}
                    className="flex items-center gap-1 bg-indigo-950 hover:bg-indigo-900 active:scale-95 text-[11px] text-indigo-300 border border-indigo-850 border-indigo-800 rounded-xl px-3 py-1.5 font-bold cursor-pointer transition"
                  >
                    <ChevronLeft className="h-3 w-3 shrink-0 text-indigo-400" />
                    <span>Kembali ke Divisi</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
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
          ) : dashboardView === "approval_requests" ? (
            <div className="max-w-4xl mx-auto text-left bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full h-[600px] flex flex-col">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 font-bold border border-indigo-800 text-sm">
                    👑
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs tracking-wider uppercase leading-none text-white">
                      ADMINISTRASI CEK APPROVAL PENDAFTARAN
                    </h3>
                    <p className="text-[9px] text-slate-400 font-mono tracking-widest font-bold mt-1">
                      PUSAT OTORISASI AKUN KARYAWAN & STAF BARU PRAMA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDashboardView("divisions")}
                    className="flex items-center gap-1 bg-indigo-950 hover:bg-indigo-900 active:scale-95 text-[11px] text-indigo-300 border border-indigo-850 border-indigo-800 rounded-xl px-3 py-1.5 font-bold cursor-pointer transition"
                  >
                    <ChevronLeft className="h-3 w-3 shrink-0 text-indigo-400" />
                    <span>Kembali ke Divisi</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {/* Admin Status Guard */}
                {!(
                  user && (
                    user.email?.toLowerCase().trim() === "muhamadrizkialfian@gmail.com" || 
                    user.email?.toLowerCase().trim() === "muhamadrizkialfian97@gmail.com" ||
                    user.email?.toLowerCase().trim() === "muhamadrizkialfiann@gmail.com"
                  )
                ) ? (
                  <div className="flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500 shadow-sm animate-pulse">
                      <Lock className="h-7 w-7" />
                    </div>
                    <h4 className="font-display font-extrabold text-sm text-slate-800">
                      Akses Terbatas & Dilindungi
                    </h4>
                    <p className="text-[11px] text-slate-505 text-slate-500 font-bold leading-relaxed">
                      Sesi masuk Anda terdaftar sebagai akun non-admin. Halaman verifikasi dan persetujuan ini hanya dapat diakses oleh Administrator holding PT Pancaran Group Indonesia Services.
                    </p>
                    <button
                      onClick={() => setDashboardView("divisions")}
                      className="mt-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] font-black px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Kembali ke Menu Utama
                    </button>
                  </div>
                ) : (
                  <div>
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-105 border-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">
                          ✨
                        </div>
                        <h4 className="font-display font-extrabold text-slate-800 text-sm">
                          Semua Permohonan Selesai Diproses
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-semibold">
                          Tidak ada draf pendaftaran pending saat ini. Semua staf atau karyawan baru PRAMA yang terdaftar telah diaktivasi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-805 text-amber-800 leading-relaxed font-bold">
                          💡 Sebagai administrator PRAMA Advisor, tindak lanjuti setiap permohonan pendaftaran di bawah ini untuk memberikan akses penulisan, penyimpanan dokumen cloud, dan analitis model asisten.
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="divide-y divide-slate-100">
                            {pendingRequests.map((req) => (
                              <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/50">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-black text-slate-850 text-slate-800 tracking-wide">
                                      {req.fullName || "Staf PRAMA"}
                                    </p>
                                    <span className="font-mono text-[8px] font-extrabold tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">
                                      Kandidat Staf
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-505 text-slate-503 text-slate-500 font-bold font-mono mt-1">
                                    Email: <span className="text-indigo-600 font-extrabold">{req.email || "No Email"}</span>
                                  </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 active:scale-97 text-white text-[10.5px] font-black px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
                                  >
                                    Terima Akun
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 text-[10.5px] font-black px-4 py-2 rounded-xl border border-red-100 transition cursor-pointer"
                                  >
                                    Tolak
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Division Bento-like Selection Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
              {divisions.map((div) => {
                const IconComp = div.icon;
                return (
                  <div
                    key={div.id}
                    onClick={() => {
                      if (!div.locked) {
                        setActiveDivision(div.id);
                      }
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 ${
                      div.locked
                        ? "border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed select-none"
                        : "border-slate-200 bg-white cursor-pointer hover:border-indigo-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Header: Icon and Division Code */}
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${div.lightAccent} shadow-sm font-bold`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {div.locked && (
                            <span className="flex items-center gap-0.5 text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              <Lock className="h-2 w-2" /> Terkunci
                            </span>
                          )}
                          <span className="font-mono text-[9px] font-black tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 animate-none">
                            {div.code}
                          </span>
                        </div>
                      </div>

                      {/* Title & description */}
                      <div>
                        <h4 className={`font-display font-extrabold text-sm leading-snug transition ${div.locked ? "text-slate-600" : "text-slate-800 group-hover:text-indigo-700"}`}>
                          {div.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide line-clamp-1 uppercase">
                          {div.desc}
                        </p>
                      </div>

                      {/* Quick profile info */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">PROFIL ANALISIS</span>
                        <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1 line-clamp-4 italic">
                          &quot;{div.details}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Single full-width elegant action button */}
                    <div className="pt-4 mt-auto">
                      {div.locked ? (
                        <button
                          type="button"
                          disabled
                          className="w-full flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-bold transition shadow-2sm bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                        >
                          <Lock className="h-3 w-3 text-slate-400" />
                          <span>Akses Terkunci</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDivision(div.id);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black tracking-wide transition shadow-sm bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 cursor-pointer hover:scale-101"
                        >
                          <span>Masuk Tahap Analisis AI</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Standalone custom card for Dokumen PM (Menu Simpan Dokumen) */}
              <div
                onClick={() => {
                  setDashboardView("saved_docs");
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 cursor-pointer hover:border-emerald-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Header: Icon and Division Code */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl transition bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm font-bold">
                      <HardDrive className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                        DRAF PM
                      </span>
                    </div>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h4 className="font-display font-extrabold text-sm leading-snug transition text-slate-800 group-hover:text-emerald-700">
                      Menu Simpan Dokumen / Artikel PM
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide line-clamp-1 uppercase">
                      ARSIP LAPORAN, PROPOSAL, & DRAF SISTEM PM
                    </p>
                  </div>

                  {/* Quick profile info */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">FUNGSI INTEGRASI</span>
                    <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1 line-clamp-4 italic">
                      &quot;Kelola, edit, cari, cetak, dan ekspor draf artikel project management atau hasil audit asisten cerdas PRAMA ke PDF terverifikasi, Word, atau PowerPoint.&quot;
                    </p>
                  </div>
                </div>

                {/* Standalone Button matches the Comercial height and font */}
                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDashboardView("saved_docs");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black tracking-wide transition shadow-sm bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 cursor-pointer hover:scale-101"
                  >
                    <HardDrive className="h-4 w-4 shrink-0 text-emerald-500 group-hover:text-white" />
                    <span>Akses Dokumen PM</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold shadow-inner shrink-0 leading-none group-hover:bg-emerald-700 group-hover:text-slate-100 ml-1">
                      {files.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Standalone custom card for Administrasi Approval Pendaftaran */}
              <div
                onClick={() => {
                  setDashboardView("approval_requests");
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 cursor-pointer hover:border-indigo-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Header: Icon and Division Code */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl transition bg-indigo-50 text-indigo-800 border border-indigo-100 shadow-sm font-bold">
                      <Users className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {pendingRequests.length > 0 ? (
                        <span className="font-mono text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200 uppercase animate-pulse">
                          {pendingRequests.length} PENDING
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] font-black tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase">
                          BERSIH
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h4 className="font-display font-extrabold text-sm leading-snug transition text-slate-800 group-hover:text-indigo-700">
                      Administrasi Cek Approval Pendaftaran
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide line-clamp-1 uppercase">
                      VERIFIKASI & AKTIVASI REGISTER KARYAWAN
                    </p>
                  </div>

                  {/* Quick profile info */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">FUNGSI OTORITAS</span>
                    <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1 line-clamp-4 italic">
                      &quot;Akses kontrol pemantauan registrasi tim, peninjauan permohonan masuk, dan persetujuan otorisasi akun baru bagi seluruh staf PRAMA Pancaran Group.&quot;
                    </p>
                  </div>
                </div>

                {/* Standalone Button matches the other button heights and fonts */}
                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDashboardView("approval_requests");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black tracking-wide transition shadow-sm bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 cursor-pointer hover:scale-101"
                  >
                    <Users className="h-4 w-4 shrink-0 text-indigo-500 group-hover:text-white" />
                    <span>Akses Menu Approval</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-extrabold shadow-inner shrink-0 leading-none ml-1 ${
                      pendingRequests.length > 0 
                        ? "bg-emerald-100 text-emerald-850 animate-pulse" 
                        : "bg-indigo-100 text-indigo-800"
                    }`}>
                      {pendingRequests.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Guest info detail footer */}
        <div className="bg-white border-t border-slate-200 py-3.5 select-none font-mono text-[10px] text-slate-400 text-center font-bold">
          PT PANCARAN GROUP INDONESIA SERVICES | PRAMA COGNITIVE PORTAL v1.5
        </div>

      </div>
    );
  }

  // Render 4: Active Chat Workspace - Theme: Polished Bright Light Workspace (featuring Nav side rail + ChatPanel + FilePanel)
  const filteredMessages = searchQuery
    ? chatMessages.filter((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatMessages;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-800 transition-colors duration-250">
      
      {/* Offline Mode alert inside Workspace */}
      {!user && (
        <div className="flex items-center gap-2.5 bg-amber-50 px-4 py-2 border-b border-amber-200 text-xs text-amber-800 font-bold shadow-3sm">
          <CircleAlert className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong>Penyimpanan Tamu Offline:</strong> Draf catatan disimpan sementara di cache browser lokal. Hubungkan akun reguler untuk mengaktifkan sinkronisasi database awan Firebase secara real-time.
          </span>
        </div>
      )}

      {/* Main Workspace layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Division Nav Rail (HUB NAVIGASI PINTAR) */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-slate-205 border-slate-200 bg-white h-full p-4 overflow-y-auto justify-between select-none">
          <div className="space-y-4">
            {/* Header: DASHBOARD & HUB NAVIGASI PINTAR */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-sans text-[9px] font-extrabold tracking-widest text-slate-400 block uppercase">DASHBOARD</span>
                <h3 className="font-display font-extrabold text-[12px] leading-tight text-slate-800 uppercase tracking-tight mt-0.5">
                  Hub Navigasi Pintar
                </h3>
              </div>
              <button
                onClick={() => setActiveDivision(null)}
                title="Kembali ke Dashboard"
                className="h-7 w-7 rounded-full border border-slate-200 hover:border-indigo-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-650 transition cursor-pointer shadow-3sm"
              >
                <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Selected active division banner */}
            <div className="bg-[#5B4DFB] text-white p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black leading-none uppercase tracking-wide">COMC Unit</p>
                <span className="text-[9px] block text-indigo-150 text-indigo-100 font-medium leading-none mt-1.5">
                  comercial unit
                </span>
              </div>
            </div>

            {/* Three primary options */}
            <nav className="space-y-1 block">
              {/* Option 1: Percakapan baru */}
              <button
                onClick={handleNewChat}
                className="w-full h-10 flex items-center gap-3 px-3 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer"
              >
                <SquarePen className="h-4 w-4 text-slate-650 text-slate-600 shrink-0" />
                <span>Percakapan baru</span>
              </button>

              {/* Option 2: Telusuri percakapan */}
              <button
                onClick={() => {
                  setIsSearching(!isSearching);
                  if (isSearching) setSearchQuery("");
                }}
                className={`w-full h-10 flex items-center gap-3 px-3 rounded-xl text-left text-xs font-bold transition cursor-pointer ${
                  isSearching
                    ? "bg-indigo-50/70 text-[#5B4DFB] font-extrabold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <Search className="h-4 w-4 text-slate-600 shrink-0" />
                <span>Telusuri percakapan</span>
              </button>

              {/* Collapsible conversation search input inline */}
              {isSearching && (
                <div className="px-2 pb-1.5 pt-0.5 transition-all">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari pesan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-750 focus:bg-white focus:border-[#5B4DFB] outline-none"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-2 text-[9px] text-slate-400 hover:text-slate-700 font-extrabold"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Option 3: Koleksi */}
              <button
                onClick={() => {
                  setShowKoleksiSidebarModal(true);
                }}
                className="w-full h-10 flex items-center gap-3 px-3 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer"
              >
                <Grid className="h-4 w-4 text-slate-600 shrink-0" />
                <span>Koleksi</span>
                <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono font-bold">
                  {files.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Bottom layout: Kembali ke Dashboard */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveDivision(null)}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-indigo-50/40 text-xs font-bold text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-150 transition cursor-pointer"
            >
              <Grid className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-650 shrink-0" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Middle & Right Content Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Column 1: AI Chat Canvas - Full Width Focused View */}
          <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
             <ChatPanel
              messages={chatMessages}
              loading={chatLoading}
              onSendMessage={handleSendMessage}
              files={files}
              onSaveAsFile={handleSaveResponseAsFile}
              onExportArticle={handleExportArticle}
              onExportPPT={handleExportPPT}
              onPreviewAndExportWord={handlePreviewAndExportWord}
              onPreviewAndExportPDF={handlePreviewAndExportPDF}
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
              activeDivision={activeDivision}
              onTyping={handleTyping}
              onBackToDashboard={() => setActiveDivision(null)}
              onLogout={handleLogoutAll}
              pendingRequestsCount={pendingRequests.length}
              onNavigateNotification={(view) => {
                setActiveDivision(null);
                setDashboardView(view);
              }}
              isSearchingMessages={isSearching}
              onToggleSearchMessages={setIsSearching}
            />
          </div>

        </div>

      </main>

      {/* KOLEKSI SIDEBAR MODAL */}
      {showKoleksiSidebarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="flex flex-col bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl border border-slate-150 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-[#5B4DFB]">
                  <Grid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Koleksi Dokumen Strategis ({activeDivision ? `${activeDivision.toUpperCase()} Unit` : "Semua Unit"})</h3>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Akses dan Unduh Hasil Analisis & Laporan</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowKoleksiSidebarModal(false);
                  setKoleksiSearch("");
                }}
                className="h-8 w-8 rounded-full border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 flex items-center justify-center text-slate-500 hover:text-red-650 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal search bar and filters */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama file..."
                  value={koleksiSearch}
                  onChange={(e) => setKoleksiSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-[#5B4DFB] outline-none transition"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 select-none">
                Total Dokumen: {
                  files.filter(f => !activeDivision || f.division === activeDivision).length
                }
              </span>
            </div>

            {/* Modal Body: files grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
              {(() => {
                const filteredCol = files
                  .filter((f) => !activeDivision || f.division === activeDivision)
                  .filter((f) => !koleksiSearch || f.name.toLowerCase().includes(koleksiSearch.toLowerCase()));

                if (filteredCol.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 shadow-sm">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800">Tidak ada dokumen</h4>
                      <p className="mt-1 text-xs text-slate-500 max-w-sm">
                        Belum ada dokumen yang disimpan untuk unit ini atau pencarian Anda tidak menemukan hasil.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCol.map((f) => (
                      <div key={f.id} className="bg-white rounded-2xl border border-slate-150 p-4 shadow-3sm hover:border-[#5B4DFB]/30 hover:shadow-2sm transition flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2.5 mb-2">
                            <span className="text-[9px] font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {f.division || "PORTAL"} UNIT
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {(f.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2 leading-snug mb-1" title={f.name}>
                            {f.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mb-4 font-mono">
                            Diperbarui: {new Date(f.updatedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>

                        {/* Actions row */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setArticlePreview({
                                title: f.name.replace(".md", "").toUpperCase(),
                                content: f.content,
                                fileName: f.name
                              });
                            }}
                            className="flex-1 min-w-[70px] flex items-center justify-center gap-1 px-2.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4a3ce3] text-white rounded-xl text-[10px] font-bold shadow-3sm hover:shadow-2sm transition cursor-pointer"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Lihat</span>
                          </button>
                          
                          <button
                            onClick={() => exportToWord(f.name, f.content, f.division || "PRAMA")}
                            className="flex items-center justify-center h-8 w-8 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-200 rounded-xl transition cursor-pointer"
                            title="Unduh Microsoft Word"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => downloadPDFDirect(f.name, f.content, f.division || "PRAMA")}
                            className="flex items-center justify-center h-8 w-8 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-xl transition cursor-pointer"
                            title="Unduh PDF"
                          >
                            <Presentation className="h-3.5 w-3.5 text-slate-600" />
                          </button>

                          <button
                            onClick={() => {
                              const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus dokumen "${f.name}"?`);
                              if (isConfirmed) {
                                handleDeleteFile(f.id);
                              }
                            }}
                            className="h-8 w-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#e11d48] border border-slate-200 hover:border-red-200 rounded-xl flex items-center justify-center transition cursor-pointer"
                            title="Hapus Dokumen"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-150 flex justify-end">
              <button
                onClick={() => {
                  setShowKoleksiSidebarModal(false);
                  setKoleksiSearch("");
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. ARTICLE / DOCUMENT PREVIEW MODAL */}
      {articlePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="flex flex-col bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-150 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">PREVIEW LAPORAN STRATEGIS</h3>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{articlePreview.fileName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(articlePreview.content);
                    setCopiedState(true);
                    setTimeout(() => setCopiedState(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
                >
                  {copiedState ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => exportToWord(articlePreview.fileName, articlePreview.content, activeDivision || "PORTAL")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 rounded-xl transition cursor-pointer shadow-md shadow-violet-100"
                  title="Unduh file Word (.doc)"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh (.doc)</span>
                </button>

                <button
                  onClick={() => downloadPDFDirect(articlePreview.fileName, articlePreview.content, activeDivision || "PORTAL")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-md shadow-rose-100"
                  title="Unduh file PDF (.pdf)"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh PDF (.pdf)</span>
                </button>

                <button
                  onClick={() => setArticlePreview(null)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Modal content body styled beautifully like real MS Word A4 sheet */}
            <div className="flex-1 overflow-y-auto bg-slate-100/60 p-6 sm:p-10 flex justify-center">
              <div className="bg-white min-h-[70vh] w-full max-w-2xl rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-slate-700 relative overflow-hidden font-sans">
                {/* Decorative corporate top header */}
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-6">
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-900 font-mono">PRAMA STRATEGIC SYSTEM</div>
                    <div className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-widest">PANCARAN GROUP STRATEGIC CONSULTANCY SERVICES</div>
                  </div>
                  <div className="border border-slate-800 px-3 py-1 text-[8px] font-black text-center font-mono rounded tracking-wider uppercase text-indigo-700">
                    PRAMA VERIFIED
                  </div>
                </div>

                {/* Cover metadata card */}
                <div className="bg-slate-50 border-l-4 border-slate-800 p-4 mb-8 text-[11px] text-slate-600 font-medium leading-relaxed rounded-r-lg">
                  <div className="font-bold text-slate-800 font-mono text-[9px] uppercase tracking-wider mb-2 text-indigo-600">INFORMASI VERIFIKASI DOKUMEN:</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                    <div><span className="text-slate-400 font-bold">KATEGORI:</span> LAPORAN ANALISIS STRATEGIS</div>
                    <div><span className="text-slate-400 font-bold">UNIT:</span> {(activeDivision || "ANALITIS").toUpperCase()} DIVISION</div>
                    <div><span className="text-slate-400 font-bold">PROYEK:</span> {articlePreview.title.toUpperCase()}</div>
                    <div><span className="text-slate-400 font-bold">STATUS:</span> INTERNAL VERIFIED (SECRET)</div>
                  </div>
                </div>

                {/* Printable main headings and text */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b pb-2 mb-6 tracking-tight leading-snug">
                  {articlePreview.title}
                </h1>

                {/* Beautiful clean parser */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-850 font-normal">
                  {renderPreviewMarkdown(articlePreview.content)}
                </div>

                {/* Footer decorator block */}
                <div className="mt-12 border-t pt-4 text-[9px] text-slate-400 font-mono flex justify-between items-center">
                  <span>PRAMA SYSTEM DIGITAL ARCHIVE SYSTEM &bull; PANCARAN GROUP</span>
                  <span>© 2026 INTERNAL</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom control */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end gap-2.5 shrink-0">
              <span className="self-center font-mono text-[9px] text-slate-450 font-bold uppercase tracking-widest mr-auto select-none">
                VERIFIED STUDY SUITE
              </span>
              <button
                onClick={() => setArticlePreview(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PPT SLIDESHOW PREVIEW INTERACTIVE MODAL */}
      {pptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/90 p-4 backdrop-blur-md overflow-y-auto animate-fade-in text-slate-800">
          <div className="flex flex-col bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Header toolbar */}
            <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Presentation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider font-display">SLIDE SHOW & INTERACTIVE PREVIEW</h3>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{pptPreview.fileName.toUpperCase()}.PPTX</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = `<span class="flex items-center gap-1.5"><svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Menyiapkan PPTX...</span></span>`;
                    try {
                      await exportToPPTX(pptPreview.fileName, pptPreview.slides, activeDivision || "PORTAL");
                    } catch (error) {
                      console.error(error);
                    } finally {
                      btn.disabled = false;
                      btn.innerHTML = originalText;
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-black bg-[#0082FB] hover:bg-[#0072DF] text-white border-none rounded-full transition-all cursor-pointer shadow-md shadow-blue-100 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Unduh PPTX (.pptx)</span>
                </button>
                <button
                  onClick={() => setPptPreview(null)}
                  className="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Main Interactive Screen with 16:9 canvas and Speaker notes */}
            <div className="flex-1 overflow-y-auto bg-[#0B0F19] p-6 sm:p-8 flex flex-col items-center justify-center gap-6">
              
              {/* Projector slide backdrop container */}
              <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-2xl shadow-2xl border border-slate-800/20 flex overflow-hidden relative group">
                {activeSlideIndex === 0 ? (
                  // TITLE COVER SLIDE STYLE (MATCHES SLIDE 1)
                  <div className="flex-1 flex flex-col justify-center items-start bg-[#06152B] p-12 text-left select-none relative">
                    {/* Vibrant Green Border */}
                    <div className="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm" />
                    
                    <div className="text-[10px] font-mono font-black text-[#00D285] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <span>✦ PRAMA COGNITIVE PORTAL</span>
                      <span>•</span>
                      <span>{(pptPreview.title || "").toUpperCase()}</span>
                    </div>
                    
                    <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-3xl uppercase tracking-tight leading-tight select-text">
                      KAJIAN STRATEGIS KOMPREHENSIF: {(pptPreview.title || "").toUpperCase()}
                    </h1>
                    
                    <div className="h-0.5 w-16 bg-[#00D285] my-5" />
                    
                    <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-2xl">
                      Kajian Komprehensif Skema Strategis & Operasional {pptPreview.title} PT Pancaran Group Berdasarkan Rekomendasi PRAMA AI Advisor
                    </p>
                    
                    <div className="mt-8 space-y-1 text-left text-[#00D285] font-mono font-bold text-[9px] uppercase tracking-wider">
                      <div>PROYEK: {pptPreview.title.toUpperCase()}</div>
                      <div>UNIT DIREKTORAT: {(activeDivision || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}</div>
                      <div>KLASIFIKASI: TERBATAS / INTERNAL PT PANCARAN GROUP</div>
                    </div>
                  </div>
                ) : activeSlideIndex === pptPreview.slides.length + 1 ? (
                  // THANK YOU / PENUTUP SLIDE STYLE (MATCHES SLIDE 17)
                  <div className="flex-1 flex flex-col justify-center items-center bg-[#06152B] p-12 text-center select-none relative">
                    {/* Vibrant Green Border */}
                    <div className="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm" />
                    
                    <h1 className="text-white text-3xl sm:text-5xl font-black tracking-widest leading-none mb-3 animate-pulse">
                      TERIMA KASIH
                    </h1>
                    
                    <h3 className="text-[#00D285] font-mono font-bold text-xs sm:text-sm uppercase tracking-wide mb-8">
                      Sistem Dokumentasi Strategis & Operasional Terintegrasi
                    </h3>
                    
                    <div className="mt-6 text-slate-400 font-mono text-[9px] sm:text-xs tracking-wide leading-relaxed">
                      <div>✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor</div>
                      <div className="text-[#00D285] font-semibold mt-1">PT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF</div>
                    </div>
                  </div>
                ) : (
                  // BENTO SPLIT LAYOUT CONTENT SLIDE STYLE
                  (() => {
                    const currentSlide = pptPreview.slides[activeSlideIndex - 1];
                    let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
                    let bPoints = currentSlide?.bullets || [];
                    if (currentSlide?.bullets && currentSlide.bullets.length > 0) {
                      if (currentSlide.bullets.length >= 3) {
                        introPara = currentSlide.bullets[0];
                        bPoints = currentSlide.bullets.slice(1);
                      }
                    }

                    const formatBulletText = (text: string) => {
                      let cleanText = text.replace(/\*\*/g, ""); // strip raw stars
                      const colonIdx = cleanText.indexOf(":");
                      if (colonIdx > 0 && colonIdx < 30) {
                        const boldPrefix = cleanText.slice(0, colonIdx + 1);
                        const rest = cleanText.slice(colonIdx + 1);
                        return (
                          <span>
                            <strong className="font-extrabold text-slate-900">{boldPrefix}</strong>
                            {rest}
                          </span>
                        );
                      }
                      return <span>{cleanText}</span>;
                    };

                    return (
                      <div className="flex-1 flex flex-col md:flex-row bg-white text-slate-800 relative">
                        {/* Solid Top Accent Green Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00D285]" />

                        {/* Left half: Content & Bullets */}
                        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:w-7/12 relative">
                          <div className="space-y-3 pt-2">
                            {/* Header row */}
                            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center w-full pb-1">
                              <span>{pptPreview.fileName.toUpperCase()}</span>
                              <span className="text-[#00D285] font-extrabold">SEKTOR: {(activeDivision || "UMUM").toUpperCase() + " & BD"}</span>
                            </div>
                            
                            <div className="h-[1px] bg-slate-100 w-full" />

                            <div className="text-[10px] font-bold text-[#00D285] font-mono uppercase tracking-widest pt-1">
                              KAJIAN STRATEGIS: BAB {activeSlideIndex}
                            </div>
                            
                            <h2 className="text-slate-900 font-extrabold text-lg sm:text-xl md:text-[22px] leading-tight select-text">
                              {currentSlide?.title}
                            </h2>
                            
                            <p className="text-xs text-slate-500 font-medium leading-relaxed pb-1 select-text">
                              {introPara.replace(/\*\*/g, "")}
                            </p>

                            <div className="space-y-2">
                              {bPoints.map((bulletText, bIdx) => (
                                <div key={bIdx} className="flex gap-2.5 items-start pl-0.5">
                                  <span className="text-[#00D285] mt-1 shrink-0 font-extrabold select-none text-[10px] sm:text-sm">•</span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed select-text">
                                    {formatBulletText(bulletText)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer row */}
                          <div className="text-[8px] font-mono font-bold text-slate-400 border-t border-slate-100 pt-2.5 w-full flex justify-between items-center mt-4">
                            <span>PANCARAN GROUP &bull; CONFIDENTIAL DOCUMENTATION</span>
                            <span className="text-slate-700 font-bold uppercase">HALAMAN {activeSlideIndex + 1} DARI {pptPreview.slides.length + 2}</span>
                          </div>
                        </div>

                        {/* Right half: Photo Frame */}
                        <div className="flex-1 md:w-5/12 bg-slate-50 relative min-h-[150px] md:min-h-0 overflow-hidden flex flex-col justify-center items-center p-6">
                          <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                            {/* Photo framed with green border */}
                            <div className="w-full h-[85%] border-2 border-[#00D285] p-1 bg-white shadow-md relative overflow-hidden rounded-md flex items-center justify-center">
                              {currentSlide?.imageUrl ? (
                                <img
                                  src={currentSlide.imageUrl}
                                  alt="Slide context"
                                  className="w-full h-full object-cover rounded-xs"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const textFallback = parent.querySelector('.fallback-txt');
                                      if (textFallback) textFallback.classList.remove('hidden');
                                    }
                                  }}
                                />
                              ) : null}
                              <div className="fallback-txt hidden flex flex-col items-center justify-center text-center p-4">
                                <Presentation className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 font-mono">PRAMA DIAGRAM</span>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 italic font-bold tracking-wide text-center">
                              Ilustrasi: {currentSlide?.title} di Pancaran Group
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Left navigation arrow on-slide */}
                <button
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Right navigation arrow on-slide */}
                <button
                  disabled={activeSlideIndex === pptPreview.slides.length + 1}
                  onClick={() => setActiveSlideIndex(prev => Math.min(pptPreview.slides.length + 1, prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Speaker Notes Presenter Window panel */}
              <div className="w-full max-w-4xl bg-[#0D1527] rounded-2xl p-5 border border-slate-800 shadow-xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 mb-3">
                  <span className="font-mono text-[10px] text-[#00D285] font-black tracking-widest uppercase flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#00D285] animate-pulse" />
                    🎙️ SPEAKER NOTES / NASKAH PIDATO PRESENTER
                  </span>
                  <span className="bg-slate-800 text-slate-300 font-mono text-[9px] font-extrabold px-3 py-1 rounded-full border border-slate-700 shadow-inner">
                    Slide {activeSlideIndex + 1} dari {pptPreview.slides.length + 2}
                  </span>
                </div>
                <div className="max-h-[100px] overflow-y-auto pr-1">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold italic select-text">
                    &quot;{activeSlideIndex === 0 ? "Selamat pagi/siang bapak dan ibu sekalian. Slide pembuka ini menjelaskan judul dan pilar utama kajian proyek strategis PRAMA untuk PT Pancaran Group." : activeSlideIndex === pptPreview.slides.length + 1 ? "Sesi presentasi komprehensif selesai. Kami mengucapkan terima kasih kepada pimpinan komite, direksi, dan jajaran tim operasional PT Pancaran Group." : (pptPreview.slides[activeSlideIndex - 1]?.speakerNotes || "Penjelasan pendukung slide.")}&quot;
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom slideshow controls & paginator */}
            <div className="bg-white border-t border-slate-100 px-8 py-5 flex justify-between items-center shrink-0 rounded-b-[2rem]">
              <div className="flex gap-2 overflow-x-auto max-w-[70%] py-1">
                {Array.from({ length: pptPreview.slides.length + 2 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveSlideIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer shrink-0 ${
                      activeSlideIndex === dotIdx ? "w-7 bg-[#00D285]" : "w-2.5 bg-slate-200 hover:bg-slate-350"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPptPreview(null)}
                  className="px-6 py-2.5 text-xs font-black text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition cursor-pointer"
                >
                  Tutup Slide Show
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function renderPreviewMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string | number) => {
    if (currentTableRows.length === 0) return null;

    const cleanRows = currentTableRows.filter(row => !row.some(cell => /^:?-+:?$/.test(cell.trim())));
    if (cleanRows.length === 0) {
      currentTableRows = [];
      inTable = false;
      return null;
    }

    let hasHeader = currentTableRows.length > 1 && currentTableRows[1].some(cell => /^:?-+:?$/.test(cell.trim()));
    
    const tableElement = (
      <div key={key} className="overflow-x-auto my-4 border border-slate-200 rounded-xl shadow-xs max-w-full">
        <table className="min-w-full divide-y divide-slate-200 text-left border-collapse">
          {hasHeader && (
            <thead className="bg-[#0f172a] text-white">
              <tr>
                {cleanRows[0].map((cell, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display border border-slate-700">
                    {parsePreviewInlineMarkdown(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-200 bg-white">
            {cleanRows.slice(hasHeader ? 1 : 0).map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-50/50 hover:bg-slate-50" : "bg-white hover:bg-slate-50"}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 text-[11px] sm:text-xs text-slate-700 leading-relaxed border border-slate-100">
                    {parsePreviewInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    currentTableRows = [];
    inTable = false;
    return tableElement;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Table checking
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      currentTableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        const table = flushTable(`table-${idx}`);
        if (table) {
          elements.push(table);
        }
      }
    }

    if (!trimmed) {
      elements.push(<div key={`empty-${idx}`} className="h-1.5" />);
      continue;
    }

    // 1. Headings (### or ## or #)
    if (trimmed.startsWith("###")) {
      elements.push(
        <h4 key={`h3-${idx}`} className="font-display font-extrabold text-slate-900 border-none text-sm mt-5 mb-2 block uppercase tracking-wide">
          {parsePreviewInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("##")) {
      elements.push(
        <h3 key={`h2-${idx}`} className="font-display font-extrabold text-[#0369a1] border-b pb-1 mt-6 mb-3 tracking-tight text-base block">
          {parsePreviewInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("#")) {
      elements.push(
        <h2 key={`h1-${idx}`} className="font-display font-black text-indigo-900 border-b-2 pb-2 mt-8 mb-4 tracking-tight text-lg block">
          {parsePreviewInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h2>
      );
      continue;
    }

    // 2. Ordered lists (1. 2. etc)
    const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (orderedListMatch) {
      elements.push(
        <div key={`ol-${idx}`} className="flex gap-2.5 ml-3 my-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-mono text-indigo-700 font-bold shrink-0">
            {orderedListMatch[1]}.
          </span>
          <p className="flex-1 font-medium">{parsePreviewInlineMarkdown(orderedListMatch[2])}</p>
        </div>
      );
      continue;
    }

    // 2b. Indented alphabetical lists (a. b. c. etc for narrowing/sub-points)
    const alphaListMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)/);
    if (alphaListMatch) {
      elements.push(
        <div key={`al-${idx}`} className="flex gap-2.5 ml-8 my-1 text-xs text-slate-600 leading-relaxed">
          <span className="font-mono text-slate-600 font-bold shrink-0 uppercase">
            {alphaListMatch[1]}.
          </span>
          <p className="flex-1">{parsePreviewInlineMarkdown(alphaListMatch[2])}</p>
        </div>
      );
      continue;
    }

    // 3. Bullet points (- or * or •)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const content = trimmed.replace(/^[-*•]\s+/, "");
      elements.push(
        <div key={`ul-${idx}`} className="flex gap-2.5 ml-3 my-1.5 text-xs sm:text-sm text-slate-705 items-start leading-relaxed">
          <span className="text-indigo-600 font-bold select-none">•</span>
          <p className="flex-1">{parsePreviewInlineMarkdown(content)}</p>
        </div>
      );
      continue;
    }

    // 4. Standard Paragraph / Line
    elements.push(
      <p key={`p-${idx}`} className="text-slate-700 text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
        {parsePreviewInlineMarkdown(line)}
      </p>
    );
  }

  if (inTable) {
    const table = flushTable(`table-end`);
    if (table) {
      elements.push(table);
    }
  }

  return <div className="space-y-4">{elements}</div>;
}

function parsePreviewInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf("**");
    const linkIndex = currentText.indexOf("[");

    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(<span key={keyIdx++}>{currentText}</span>);
      break;
    }

    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      if (boldIndex > 0) {
        parts.push(<span key={keyIdx++}>{currentText.substring(0, boldIndex)}</span>);
      }
      const rest = currentText.substring(boldIndex + 2);
      const nextBoldIndex = rest.indexOf("**");
      if (nextBoldIndex !== -1) {
        parts.push(
          <strong key={keyIdx++} className="font-extrabold text-slate-900 bg-slate-100 rounded px-1 py-0.5 inline border border-slate-200 shadow-3sm">
            {rest.substring(0, nextBoldIndex)}
          </strong>
        );
        currentText = rest.substring(nextBoldIndex + 2);
      } else {
        parts.push(<span key={keyIdx++}>**</span>);
        currentText = rest;
      }
    } else {
      if (linkIndex > 0) {
        parts.push(<span key={keyIdx++}>{currentText.substring(0, linkIndex)}</span>);
      }
      const rest = currentText.substring(linkIndex + 1);
      const closingBracketIndex = rest.indexOf("]");
      if (closingBracketIndex !== -1) {
        const linkText = rest.substring(0, closingBracketIndex);
        const urlPart = rest.substring(closingBracketIndex + 1);
        if (urlPart.startsWith("(")) {
          const closingParenthesisIndex = urlPart.indexOf(")");
          if (closingParenthesisIndex !== -1) {
            const url = urlPart.substring(1, closingParenthesisIndex);
            parts.push(
              <a
                key={keyIdx++}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 underline font-semibold inline"
              >
                {linkText}
              </a>
            );
            currentText = urlPart.substring(closingParenthesisIndex + 1);
            continue;
          }
        }
      }
      parts.push(<span key={keyIdx++}>[</span>);
      currentText = rest;
    }
  }

  return parts;
}
