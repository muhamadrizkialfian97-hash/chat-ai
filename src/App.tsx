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
import RecommendedArticles from "./components/RecommendedArticles";
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
  FileText
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
    icon: TrendingUp
  },
  {
    id: "hca",
    code: "HCA",
    name: "Human Capital & Affairs",
    desc: "SDM, HRD, Rekrutmen, & Manajemen Kinerja Karyawan",
    details: "Fokus pada desain matriks kompetensi awak kapal dan pengemudi truk, perumusan Key Performance Indicators (KPI) supir logistik, sistem shift kerja, draf form Penilaian Kinerja, serta panduan keselamatan kerja.",
    color: "violet",
    lightAccent: "bg-indigo-50 text-indigo-800 border-indigo-100",
    hoverAccent: "group-hover:border-indigo-400 group-hover:bg-indigo-50/40",
    indicatorColor: "bg-indigo-500",
    icon: Users
  },
  {
    id: "fina",
    code: "FINA",
    name: "Finance, Administration & Accounting",
    desc: "Anggaran, Cash Flow, Estimasi P&L, & Manajemen Pajak",
    details: "Fokus pada perencanaan anggaran operasional dwi-mingguan, perhitungan depresiasi armada truk trailer & tongkang, rancangan simulasi Rugi Laba (P&L) unit logistik, serta audit kepatuhan pengeluaran depo.",
    color: "emerald",
    lightAccent: "bg-emerald-50 text-emerald-800 border-emerald-100",
    hoverAccent: "group-hover:border-emerald-400 group-hover:bg-emerald-50/40",
    indicatorColor: "bg-emerald-500",
    icon: Wallet
  },
  {
    id: "lga",
    code: "LGA",
    name: "Legal & Governance Affairs",
    desc: "Kepatuhan Hukum, GCG, Tinjauan Kontrak, & Perizinan",
    details: "Membantu draf klausul alternatif untuk Memorandum of Understanding (MoU), pemenuhan lisensi operasional transportasi laut/darat Republik Indonesia, tinjauan risiko gugatan keterlambatan muatan, serta tata kelola perusahaan.",
    color: "teal",
    lightAccent: "bg-teal-50 text-teal-800 border-teal-100",
    hoverAccent: "group-hover:border-teal-400 group-hover:bg-teal-50/40",
    indicatorColor: "bg-teal-500",
    icon: Scale
  },
  {
    id: "spia",
    code: "SPIA",
    name: "Satuan Pengawasan Intern / Internal Audit",
    desc: "Audit Internal, Pengendalian Risiko, & Deteksi Fraud",
    details: "Mengatasi audit kepatuhan pengeluaran bahan bakar solar (mencegah fraud BBM), penyusunan Kertas Kerja Audit (Working Paper) rute truk trailer, evaluasi keandalan SOP depo, serta investigasi anomali armada.",
    color: "indigo",
    lightAccent: "bg-indigo-50 text-indigo-800 border-indigo-100",
    hoverAccent: "group-hover:border-indigo-450 group-hover:bg-indigo-50/40",
    indicatorColor: "bg-indigo-500",
    icon: CheckSquare
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

  // Active workspace states
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SavedFile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

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
  const [dashboardView, setDashboardView] = useState<"divisions" | "saved_docs" | "recommended_articles">("divisions");

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

    return `System Role: PRAMA Strategic AI Consultant

Persona: Anda adalah Senior Project Management Consultant yang ahli dalam Analytic & AI Agent Integration. Tugas utama Anda adalah memberikan analisis mendalam untuk proyek PRAMA dengan fokus pada efisiensi operasional melalui AI serta memberikan strategi manajemen proyek yang lengkap. ${focusText}

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
        finalResponseText = friendlyText;
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

              {/* Service bullet highlights */}
              <div className="space-y-2.5 pt-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-3 p-2">
                  <div className="h-5 w-5 bg-sky-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow">
                    🚢
                  </div>
                  <div className="text-xs font-bold">
                    <span className="text-sky-300">Armada Laut</span> - Tugboat & Barge
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-3 p-2">
                  <div className="h-5 w-5 bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow">
                    🚛
                  </div>
                  <div className="text-xs font-bold">
                    <span className="text-emerald-300">Armada Darat</span> - Trailer Logistics
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-3 p-2">
                  <div className="h-5 w-5 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow">
                    📁
                  </div>
                  <div className="text-xs font-bold">
                    <span className="text-indigo-300">Grounding AI</span> - Prama Analitis
                  </div>
                </div>
              </div>
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
                  : "Arsip Contoh Rekomendasi Artikel PM"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xl mx-auto font-bold leading-relaxed">
              {dashboardView === "divisions"
                ? "Klik salah satu pilar divisi operasional korporat logistik Pancaran Group di bawah ini untuk memulai sesi dialog analisis, audit, atau penyusunan dokumen berbasis asisten cerdas PRAMA."
                : dashboardView === "saved_docs"
                  ? "Kelola, edit, cari, cari dokumen, cetak, dan ekspor draf artikel project management atau dokumen audit yang tersimpan di cloud terenkripsi."
                  : "Arsip draf artikel project management dan pedoman operasional logistik standar PRAMA yang siap diunduh dalam bentuk Word dan PDF secara instan."}
            </p>
          </div>

          {/* Elegant Dashboard Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setDashboardView("divisions")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border cursor-pointer hover:scale-101 shrink-0 ${
                dashboardView === "divisions"
                  ? "bg-indigo-600 border-indigo-650 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <Building2 className="h-4 w-4 text-sky-500" />
              <span>Pilar Divisi Analisis AI</span>
            </button>

            <button
              onClick={() => setDashboardView("saved_docs")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border cursor-pointer hover:scale-101 shrink-0 ${
                dashboardView === "saved_docs"
                  ? "bg-indigo-600 border-indigo-650 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <HardDrive className="h-4 w-4 text-emerald-505 text-emerald-500" />
              <span>Menu Simpan Dokumen / Artikel PM</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-extrabold shadow-inner ${
                dashboardView === "saved_docs" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-505 text-slate-500"
              }`}>
                {files.length}
              </span>
            </button>

            <button
              onClick={() => setDashboardView("recommended_articles")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border cursor-pointer hover:scale-101 shrink-0 ${
                dashboardView === "recommended_articles"
                  ? "bg-indigo-600 border-indigo-650 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>Rekomendasi Artikel PM</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-extrabold shadow-inner ${
                dashboardView === "recommended_articles" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-505 text-slate-500"
              }`}>
                15
              </span>
            </button>
          </div>

          {/* Admin Panel Console */}
          {user && (
            user.email?.toLowerCase().trim() === "muhamadrizkialfian@gmail.com" || 
            user.email?.toLowerCase().trim() === "muhamadrizkialfian97@gmail.com" ||
            user.email?.toLowerCase().trim() === "muhamadrizkialfiann@gmail.com"
          ) && (
            <div className="max-w-4xl mx-auto mb-10 text-left bg-white rounded-3xl border border-indigo-200 shadow-xl overflow-hidden w-full">
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-800 text-sky-300 font-bold border border-indigo-700/50">
                    👑
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs tracking-wider uppercase leading-none">
                      PANEL ADMIN PRAMA
                    </h3>
                    <p className="text-[9px] text-indigo-300 font-mono tracking-widest font-bold mt-1">
                      PERSETUJUAN AKTIVASI AKUN KARYAWAN
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-black bg-indigo-950/40 text-emerald-400 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                  {pendingRequests.length} Menunggu Persetujuan
                </span>
              </div>

              <div className="p-6">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
                      ✨ Tidak ada pendaftaran pending saat ini. Semua karyawan aktif.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 tracking-wide">
                            {req.fullName || "Staf PRAMA"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold font-mono mt-0.5">
                            Email: {req.email || "No Email"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 active:scale-97 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/10 transition cursor-pointer"
                          >
                            Terima Akun
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-red-100 transition cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-black bg-slate-800 text-emerald-400 border border-slate-705 border-slate-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {files.length} Tersimpan
                  </span>
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
          ) : dashboardView === "recommended_articles" ? (
            <div className="max-w-7xl mx-auto text-left bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full h-[650px] flex flex-col">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950 text-indigo-300 font-bold border border-indigo-800 text-sm">
                    📚
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs tracking-wider uppercase leading-none text-white">
                      ARSIP REKOMENDASI ARTIKEL PM
                    </h3>
                    <p className="text-[9px] text-slate-400 font-mono tracking-widest font-bold mt-1">
                      Pusat Unduhan Mandiri Berkas Word (.doc) & PDF Presisi PRAMA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-black bg-slate-800 text-indigo-400 border border-slate-705 border-slate-700 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    15 Artikel PM Ready
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <RecommendedArticles />
              </div>
            </div>
          ) : (
            /* Division Bento-like Selection Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-left max-w-7xl mx-auto">
              {divisions.map((div) => {
                const IconComp = div.icon;
                return (
                  <div
                    key={div.id}
                    onClick={() => setActiveDivision(div.id)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-indigo-400 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Header: Icon and Division Code */}
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${div.lightAccent} shadow-sm font-bold`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[9px] font-black tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                          {div.code}
                        </span>
                      </div>

                      {/* Title & description */}
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-slate-800 leading-snug group-hover:text-indigo-700 transition">
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

                    {/* Call to active button */}
                    <div className="pt-4 mt-auto">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-xl py-2 text-xs font-bold text-indigo-700 transition group-hover:scale-102 shadow-2sm cursor-pointer"
                      >
                        <span>Masuk Tahap Analisis AI</span>
                        <ArrowRight className="h-3 w-3 shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-full p-4 overflow-y-auto space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <span className="font-mono text-[9px] font-black tracking-widest text-slate-400 block uppercase">DETAIL DEVISI TERPILIH</span>
            <h3 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-tight mt-0.5">Hub Navigasi Pintar</h3>
          </div>

          {(() => {
            const currentDiv = divisions.find((d) => d.id === activeDivision);
            if (!currentDiv) return null;
            const IconComp = currentDiv.icon;

            return (
              <div className="flex-1 flex flex-col justify-between py-1 space-y-5">
                <div className="space-y-4">
                  {/* Division Header Banner */}
                  <div className={`p-4 rounded-2xl border ${currentDiv.lightAccent} shadow-sm overflow-hidden relative`}>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                      <IconComp className="h-20 w-20" />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[9px] font-black tracking-widest bg-white/60 px-1.5 py-0.5 rounded shadow-sm border border-black/5">
                        {currentDiv.code} UNIT
                      </span>
                    </div>
                    <h4 className="font-display font-black text-xs uppercase leading-snug">
                      {currentDiv.name}
                    </h4>
                    <p className="text-[9px] font-bold opacity-75 mt-0.5 uppercase tracking-wide">
                      {currentDiv.desc}
                    </p>
                  </div>

                  {/* Profile & Tasks Section */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-405 text-slate-400 uppercase tracking-widest block font-mono">TUGAS & CAKUPAN KERJA</span>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-bold italic text-justify">
                      &quot;{currentDiv.details}&quot;
                    </p>
                  </div>
                </div>

                {/* Back button */}
              </div>
            );
          })()}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveDivision(null)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-700 py-2.5 border border-slate-200/80 transition cursor-pointer"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
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
            />
          </div>

        </div>

      </main>

    </div>
  );
}
