import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, handleFirestoreError, OperationType } from "./firebase";
import { ChatMessage, SavedFile } from "./types";
import { generateLocalSmartResponse, cleanChatMessages } from "./utils/localAssistant";
import { exportToWord, exportToPPTX, extractProjectTitle, downloadPDFDirect } from "./utils/documentExporter";
import { 
  defaultDashboardSections, 
  exportSingleSectionToWord, 
  exportAllSectionsToWord, 
  exportAllSectionsToPPTX
} from "./utils/projectDashboardHelper";
import {
  ChatIntelligenceState,
  defaultChatIntelligence,
  calculateBIAnalysis,
  exportChatBIToWord,
  exportChatBIToPPTX
} from "./utils/chatIntelligenceHelper";
import Navbar from "./components/Navbar";
import { PramaAnimatedIllustration } from "./components/PramaAnimatedIllustration";
const pramaLogo = "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X";

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
  Video,
  Image,
  Upload,
  Trash2,
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
  ArrowLeft,
  Hand,
  Move,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReChartsTooltip,
  Legend as ReChartsLegend,
  Cell
} from "recharts";

// Simple IndexedDB wrapper for storing local custom background videos
const getMediaDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PramaCustomMediaDB", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("media-store")) {
        db.createObjectStore("media-store");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveCustomBackgroundVideo = async (file: File): Promise<void> => {
  const db = await getMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("media-store", "readwrite");
    const store = transaction.objectStore("media-store");
    const request = store.put(file, "custom-video");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getCustomBackgroundVideo = async (): Promise<Blob | null> => {
  try {
    const db = await getMediaDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("media-store", "readonly");
      const store = transaction.objectStore("media-store");
      const request = store.get("custom-video");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Gagal memuat video kustom dari IndexedDB", err);
    return null;
  }
};

export const clearCustomBackgroundVideo = async (): Promise<void> => {
  const db = await getMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("media-store", "readwrite");
    const store = transaction.objectStore("media-store");
    const request = store.delete("custom-video");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const saveCustomBackgroundImage = async (file: File): Promise<void> => {
  const db = await getMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("media-store", "readwrite");
    const store = transaction.objectStore("media-store");
    const request = store.put(file, "custom-image");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getCustomBackgroundImage = async (): Promise<Blob | null> => {
  try {
    const db = await getMediaDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("media-store", "readonly");
      const store = transaction.objectStore("media-store");
      const request = store.get("custom-image");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Gagal memuat foto kustom dari IndexedDB", err);
    return null;
  }
};

export const clearCustomBackgroundImage = async (): Promise<void> => {
  const db = await getMediaDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("media-store", "readwrite");
    const store = transaction.objectStore("media-store");
    const request = store.delete("custom-image");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

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
  const [showHeroLanding, setShowHeroLanding] = useState<boolean>(() => {
    // Jika tidak ada user virtual auth yang tersimpan di localStorage (belum login), selalu masuk ke Hero Landing saat refresh
    const hasSavedUser = localStorage.getItem("prama_virtual_auth_user");
    if (!hasSavedUser) {
      return true;
    }
    return sessionStorage.getItem("prama_hero_dismissed") !== "true";
  });



  const [heroBgType, setHeroBgType] = useState<"video" | "image">(() => {
    return (localStorage.getItem("prama_hero_bg_type") as "video" | "image") || "video";
  });

  const [isBgSettingsCollapsed, setIsBgSettingsCollapsed] = useState<boolean>(true);

  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>("/custom-video.mp4");

  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8");

  const slideshowImages = useMemo(() => {
    return [
      "https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8",
      "https://lh3.googleusercontent.com/d/1nSoJB2pwraTTxpz_AdyLUsPE7ofF2bff",
      "https://lh3.googleusercontent.com/d/1jMchFR980yIMX2HGoGAWT3DjTkAm4Cyo",
      "https://lh3.googleusercontent.com/d/18BXAcvgkENCAyNpgOvdekd3HE1JfCILc"
    ];
  }, []);

  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);

  useEffect(() => {
    if (heroBgType !== "image") return;
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroBgType, slideshowImages]);

  const landingVideoRef = useRef<HTMLVideoElement>(null);
  const authVideoRef = useRef<HTMLVideoElement>(null);

  // Force autoplay under modern browser autoplay policies (Chrome, Safari, Firefox, Edge, and iOS/Android)
  useEffect(() => {
    if (heroBgType === "video") {
      if (showHeroLanding && landingVideoRef.current) {
        landingVideoRef.current.muted = true;
        landingVideoRef.current.play().catch((playErr) => {
          console.log("Landing video automatic playback started or pending user interaction:", playErr);
        });
      } else if (!showHeroLanding && !user && authVideoRef.current) {
        authVideoRef.current.muted = true;
        authVideoRef.current.play().catch((playErr) => {
          console.log("Auth video automatic playback started or pending user interaction:", playErr);
        });
      }
    }
  }, [heroBgType, videoSrc, showHeroLanding, user]);

  useEffect(() => {
    if (customVideoUrl) {
      setVideoSrc(customVideoUrl);
    } else {
      setVideoSrc((prev) => {
        if (prev && (prev.includes("firebasestorage") || prev.startsWith("blob:") || prev.startsWith("http"))) {
          return prev;
        }
        return "/custom-video.mp4";
      });
    }
  }, [customVideoUrl]);

  useEffect(() => {
    if (customImageUrl) {
      setImageSrc(customImageUrl);
    } else {
      setImageSrc((prev) => {
        if (prev && (prev.includes("firebasestorage") || prev.startsWith("blob:"))) {
          return prev;
        }
        return "https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8";
      });
    }
  }, [customImageUrl]);

  useEffect(() => {
    let activeUrl: string | null = null;
    
    // First, play user's uploaded cache from local IndexedDB if they have it
    getCustomBackgroundVideo().then(async (cachedBlob) => {
      if (cachedBlob) {
        activeUrl = URL.createObjectURL(cachedBlob);
        setCustomVideoUrl(activeUrl);
        
        // AUTO-SYNC TO WORKSPACE SERVER:
        // Automatically upload browser-uploaded video to development container's /public/custom-video.mp4
        // so it persists, and gets bundled statically with Vercel deployment!
        const isDevApp = window.location.hostname.includes("localhost") || 
                          window.location.hostname.includes("run.app");
        if (isDevApp) {
          try {
            const checkRes = await fetch("/api/check-video-sync");
            if (checkRes.ok) {
              const checkData = await checkRes.json();
              if (!checkData.exists) {
                console.log("Auto-synchronizing browser background video back to workspace files...");
                await fetch("/api/upload-video-sync", {
                  method: "POST",
                  headers: { "Content-Type": "video/mp4" },
                  body: cachedBlob
                });
                console.log("Auto-sync completed! Video is now a persistent public file inside the workspace.");
              }
            }
          } catch (syncErr) {
            console.warn("Background auto-sync failed (harmless during local-only dev runs):", syncErr);
          }
        }
      }
    }).catch(err => {
      console.error("Gagal memuat video kustom:", err);
    });
    
    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, []);

  useEffect(() => {
    let activeImgUrl: string | null = null;
    
    getCustomBackgroundImage().then(async (cachedBlob) => {
      if (cachedBlob) {
        activeImgUrl = URL.createObjectURL(cachedBlob);
        setCustomImageUrl(activeImgUrl);
        
        // AUTO-SYNC TO WORKSPACE SERVER:
        const isDevApp = window.location.hostname.includes("localhost") || 
                          window.location.hostname.includes("run.app");
        if (isDevApp) {
          try {
            const checkRes = await fetch("/api/check-image-sync");
            if (checkRes.ok) {
              const checkData = await checkRes.json();
              if (!checkData.exists) {
                console.log("Auto-synchronizing browser background image back to workspace files...");
                await fetch("/api/upload-image-sync", {
                  method: "POST",
                  headers: { "Content-Type": "image/png" },
                  body: cachedBlob
                });
                console.log("Auto-sync completed! Image is now a persistent public file inside the workspace.");
              }
            }
          } catch (syncErr) {
            console.warn("Background auto-sync failed for image:", syncErr);
          }
        }
      }
    }).catch(err => {
      console.error("Gagal memuat foto kustom:", err);
    });
    
    return () => {
      if (activeImgUrl) {
        URL.revokeObjectURL(activeImgUrl);
      }
    };
  }, []);

  // Synchronize background settings across ALL deploys (Local, Vercel, GitHub) via Firestore settings doc
  useEffect(() => {
    const settingsDocRef = doc(db, "settings", "lobby_background");
    const unsubscribe = onSnapshot(settingsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log("Firestore background settings updated:", data);
        if (data.bgType) {
          setHeroBgType(data.bgType);
        } else {
          setHeroBgType("video");
        }
        if (data.videoUrl) {
          setVideoSrc(data.videoUrl);
        } else {
          setVideoSrc("/custom-video.mp4");
        }
        if (data.imageUrl) {
          setImageSrc(data.imageUrl);
        } else {
          setImageSrc("https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8");
        }
      } else {
        // Seed default in Firestore as "video" with intelligent default for maximum auto-consistency
        setDoc(settingsDocRef, {
          bgType: "video",
          videoUrl: "/custom-video.mp4",
          imageUrl: "https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8",
          lastUpdated: serverTimestamp()
        }, { merge: true }).catch((err) => {
          console.warn("Seeding default lobby background failed:", err);
        });
      }
    }, (error) => {
      console.warn("Background Firestore listener error (expected if offline):", error);
    });
    return () => unsubscribe();
  }, []);

  const changeBgTypeInFirestore = async (type: "video" | "image") => {
    try {
      const settingsDocRef = doc(db, "settings", "lobby_background");
      await setDoc(settingsDocRef, {
        bgType: type,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Gagal sinkronisasi tipe background ke Firestore:", err);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 80 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Batas maksimal yang diperbolehkan adalah 80MB.");
      return;
    }

    try {
      await saveCustomBackgroundVideo(file);
      if (customVideoUrl && !customVideoUrl.startsWith("http")) {
        URL.revokeObjectURL(customVideoUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setCustomVideoUrl(newUrl);

      // Upload directly to AI Studio workspace backend /public/custom-video.mp4 for fallback
      try {
        await fetch("/api/upload-video-sync", {
          method: "POST",
          headers: { "Content-Type": "video/mp4" },
          body: file,
        });
      } catch (err) {
        console.warn("Express server sync fallback error:", err);
      }

      // ULTIMATE SOURCE OF TRUTH: Upload directly to Firebase Storage bucket!
      console.log("Uploading custom video to Firebase Storage...");
      const storageRef = ref(storage, "backgrounds/lobby_video.mp4");
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      console.log("Uploaded successfully! Download URL:", downloadUrl);

      // Update background document in Firestore
      const settingsDocRef = doc(db, "settings", "lobby_background");
      await setDoc(settingsDocRef, {
        bgType: "video",
        videoUrl: downloadUrl,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      alert("Video latar belakang berhasil diunggah ke Cloud Storage! Video akan otomatis sinkron & muncul di Vercel/GitHub.");
    } catch (err) {
      console.error("Gagal menyimpan video ke Firebase Storage:", err);
      alert("Gagal mengunggah video ke Cloud Server. Silakan coba kembali.");
    }
  };

  const handleResetVideo = async () => {
    try {
      await clearCustomBackgroundVideo();
      if (customVideoUrl && !customVideoUrl.startsWith("http")) {
        URL.revokeObjectURL(customVideoUrl);
      }
      setCustomVideoUrl(null);
      setVideoSrc("/custom-video.mp4");

      // Reset in Firestore
      const settingsDocRef = doc(db, "settings", "lobby_background");
      await setDoc(settingsDocRef, {
        videoUrl: "",
        lastUpdated: serverTimestamp()
      }, { merge: true });

      alert("Video latar belakang direset ke default.");
    } catch (err) {
      console.error("Gagal menghapus video:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Ukuran file gambar terlalu besar. Batas maksimal yang diperbolehkan adalah 15MB.");
      return;
    }

    try {
      await saveCustomBackgroundImage(file);
      if (customImageUrl && !customImageUrl.startsWith("http")) {
        URL.revokeObjectURL(customImageUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setCustomImageUrl(newUrl);

      // Upload directly to AI Studio workspace backend /public/custom-image.png for fallback
      try {
        await fetch("/api/upload-image-sync", {
          method: "POST",
          headers: { "Content-Type": "image/png" },
          body: file,
        });
      } catch (err) {
        console.warn("Express server sync fallback error:", err);
      }

      // ULTIMATE SOURCE OF TRUTH: Upload directly to Firebase Storage bucket!
      console.log("Uploading custom image to Firebase Storage...");
      const storageRef = ref(storage, "backgrounds/lobby_image.png");
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      console.log("Uploaded successfully! Download URL:", downloadUrl);

      // Update background document in Firestore
      const settingsDocRef = doc(db, "settings", "lobby_background");
      await setDoc(settingsDocRef, {
        bgType: "image",
        imageUrl: downloadUrl,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      alert("Foto latar belakang berhasil diunggah ke Cloud Storage! Foto akan otomatis sinkron & muncul di Vercel/GitHub.");
    } catch (err) {
      console.error("Gagal menyimpan foto ke Firebase Storage:", err);
      alert("Gagal mengunggah foto ke Cloud Server. Silakan coba kembali.");
    }
  };

  const handleResetImage = async () => {
    try {
      await clearCustomBackgroundImage();
      if (customImageUrl && !customImageUrl.startsWith("http")) {
        URL.revokeObjectURL(customImageUrl);
      }
      setCustomImageUrl(null);
      setImageSrc("https://lh3.googleusercontent.com/d/1AFSngIVwqt7PMNtcTA92z68iGk4z_ng8");

      // Reset in Firestore
      const settingsDocRef = doc(db, "settings", "lobby_background");
      await setDoc(settingsDocRef, {
        imageUrl: "",
        lastUpdated: serverTimestamp()
      }, { merge: true });

      alert("Foto latar belakang direset ke default.");
    } catch (err) {
      console.error("Gagal menghapus foto:", err);
    }
  };

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

  // --- VOICE NARRATION (TTS) & AUTOPLAY STATES ---
  const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);
  const [isTtsAutoplay, setIsTtsAutoplay] = useState<boolean>(false);
  const [ttsVolume, setTtsVolume] = useState<number>(0.9);
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [isPptFullscreen, setIsPptFullscreen] = useState<boolean>(false);

  const autoplayTimerRef = useRef<any>(null);
  const currentUtteranceRef = useRef<any>(null);

  // --- PPT PRESENTATION TEXT TO SPEECH AND AUTOPLAY ENGINE ---
  const stopTtsAndTimers = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsTtsPlaying(false);
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const speakCurrentSlide = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !pptPreview) return;

    // Reset previous speaking and timeouts
    stopTtsAndTimers();

    // Determine target speaker text
    let targetText = "";
    if (activeSlideIndex === 0) {
      const rawTitle = pptPreview.title || "";
      const cleanTitle = rawTitle
        .replace(/^KAJIAN STRATEGIS KOMPREHENSIF:\s*/i, "")
        .replace(/^Presentasi_Kajian_/gi, "")
        .replace(/^Presentasi\s+Kajian\s+/gi, "")
        .replace(/^Presentasi\s+/gi, "")
        .replace(/^Kajian\s+/gi, "")
        .replace(/Presentasi Kajian Kajian/gi, "Presentasi Kajian")
        .trim();
      targetText = `Selamat pagi atau siang Bapak dan Ibu sekalian. Selamat datang di presentasi laporan. Hari ini kami memaparkan kajian strategis komprehensif mengenai, ${cleanTitle}. Dokumen ini diproduksi guna memberikan analisis pilar operasional dan implementasi taktis bagi divisi ${(activeDivision || "umum").toUpperCase()} di PT Pancaran Group. Mari kita mulai pembahasannya.`;
    } else if (activeSlideIndex === pptPreview.slides.length + 1) {
      targetText = "Demikian seluruh rangkaian presentasi kajian strategis komprehensif ini selesai kami sampaikan Bapak dan Ibu sekalian. Terima kasih yang sebesar-besarnya atas perhatian dan masukan berharga dari Bapak Ibu jajaran direksi, komite eksekutif, dan tim operasional PT Pancaran Group. Kami mengundang Bapak Ibu untuk memulai diskusi interaktif dan sesi tanya jawab.";
    } else {
      const currentSlide = pptPreview.slides[activeSlideIndex - 1];
      if (currentSlide) {
        targetText = currentSlide.speakerNotes || `Slide Bab ${activeSlideIndex}, ${currentSlide.title}.`;
      }
    }

    // Clean text: strip out markdown asterisks, stars, quotes or code blocks
    const cleanText = targetText
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/["'""'“”]/g, "")
      .trim();

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "id-ID"; // Standard Indonesian language
      utterance.volume = ttsVolume;
      utterance.rate = ttsRate;

      utterance.onstart = () => {
        setIsTtsPlaying(true);
      };

      utterance.onend = () => {
        setIsTtsPlaying(false);
        if (isTtsAutoplay) {
          // If we are on the very last slide, turn off autoplay
          if (activeSlideIndex >= pptPreview.slides.length + 1) {
            setIsTtsAutoplay(false);
          } else {
            // Buffer delay 2.5 seconds before going to the next slide automatically
            autoplayTimerRef.current = setTimeout(() => {
              setActiveSlideIndex(prev => prev + 1);
            }, 2500);
          }
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
        setIsTtsPlaying(false);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis initiation failed:", err);
      setIsTtsPlaying(false);
    }
  };

  // Trigger speech on actual index changes when isTtsAutoplay is active
  useEffect(() => {
    if (pptPreview && isTtsAutoplay) {
      speakCurrentSlide();
    }
    return () => {
      // Clean up timer if active
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [activeSlideIndex, isTtsAutoplay]);

  // Cancel immediately if presentation is closed
  useEffect(() => {
    if (!pptPreview) {
      stopTtsAndTimers();
      setIsTtsAutoplay(false);
      setIsPptFullscreen(false);
    }
  }, [pptPreview]);

  // Keyboard navigation and control inside presentation mode
  useEffect(() => {
    if (!pptPreview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing on any input or textarea to avoid blocking standard text input
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      if (e.key === "ArrowRight") {
        setActiveSlideIndex(prev => Math.min(pptPreview.slides.length + 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        setIsPptFullscreen(false);
      } else if (e.key === " ") {
        // Spacebar toggles narration
        e.preventDefault();
        if (isTtsPlaying) {
          stopTtsAndTimers();
        } else {
          speakCurrentSlide();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pptPreview, activeSlideIndex, isTtsPlaying, isTtsAutoplay]);

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
    let key = localStorage.getItem("workspace_client_api_key") || "";
    key = key.trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.substring(1, key.length - 1).trim();
    }
    if (
      !key || 
      key === "AIzaSyDzh6235z1Nd3BFTLREBk3AWBfQ2lpsjxo" || 
      key === "AIzaSyDDxMrdwc1s4TdTGxAghVtHaTQ1iGhDnGM" || 
      key === "AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA"
    ) {
      return "";
    }
    return key;
  });
  const [showKey, setShowKey] = useState(false);
  const [showConfigLogin, setShowConfigLogin] = useState(false);

  // Navigation tab for mobile layouts
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");

  // Tab selector inside main dashboard
  const [dashboardView, setDashboardView] = useState<"divisions" | "saved_docs" | "approval_requests" | "project_dashboard" | "chat_intelligence">("divisions");

  // Chat Intelligence Custom BI parameters
  const [chatBIState, setChatBIState] = useState<ChatIntelligenceState>(defaultChatIntelligence);

  const [slideImageErrors, setSlideImageErrors] = useState<Record<number, boolean>>({});

  // Project Dashboard customized parameters
  const [dashboardProjectTitle, setDashboardProjectTitle] = useState("Kajian Strategis: Forestry Management Transportation");
  const [activeDashboardSection, setActiveDashboardSection] = useState<number>(1);
  const [dashboardSectionsState, setDashboardSectionsState] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    defaultDashboardSections.forEach((s) => {
      initial[s.number] = s.defaultContent;
    });
    return initial;
  });

  // Customized states for Article mode, Web Previews, PowerPoint Presenter Voice and Workflows
  const [workspaceViewState, setWorkspaceViewState] = useState<"editor" | "article" | "workflow">("editor");
  const [webDocPreview, setWebDocPreview] = useState<"none" | "word" | "ppt">("none");
  const [projectPptSlideIndex, setProjectPptSlideIndex] = useState<number>(0);
  const [isSpeechPresenterActive, setIsSpeechPresenterActive] = useState<boolean>(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.1);
  const [autoNextPPT, setAutoNextPPT] = useState<boolean>(true);
  const [countdownTransition, setCountdownTransition] = useState<number>(0);
  const [activeWorkflowNode, setActiveWorkflowNode] = useState<number | null>(null);

  // TTS Narration function for PowerPoint Slide Presenter Mode
  const speakProjectPptSlide = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any pending speech

    let textToSpeak = "";
    if (projectPptSlideIndex === 0) {
      // Cover Page
      textToSpeak = `Selamat datang di Presentasi Kajian Strategis Proyek: ${dashboardProjectTitle}. Kami akan memaparkan empat belas pilar utama analisis proposal dan manajemen proyek terpadu secara langsung. Mari kita tinjau pilar demi pilar demi kesuksesan operasional Pancaran Group.`;
    } else if (projectPptSlideIndex === 15) {
      // Closing
      textToSpeak = `Demikian pemaparan seluruh empat belas pilar strategis dari Prama Advisor Intelligent Assistant. Terima kasih yang sebesar-besarnya atas perhatian dan waktu Bapak Ibu sekalian. Semoga rencana transisi dan ekspedisi Pancaran Group berjalan sukses. Sampai jumpa.`;
    } else {
      // Pillars 1 to 14
      const sec = defaultDashboardSections[projectPptSlideIndex - 1];
      const docVal = dashboardSectionsState[sec.number] || sec.defaultContent;
      
      // Clean contents for voice reader
      const cleanedLines = docVal.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith("###"))
        .map(l => l.replace(/\*\*/g, "").replace(/^\*\s*/, "").replace(/^-\s*/, ""));
      
      const summarySpeech = cleanedLines.slice(0, 3).join(". ");
      textToSpeak = `Pilar ke ${sec.number}: ${sec.title}. ${sec.shortDesc}. Beberapa poin penting formulasi adalah sebagai berikut. ${summarySpeech}. Evaluasi kepatuhan pilar ini dinyatakan aman dan setara standar internal.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "id-ID";
    utterance.rate = speechRate;
    
    utterance.onstart = () => {
      setIsPlayingSpeech(true);
      setCountdownTransition(0);
    };

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      if (autoNextPPT && projectPptSlideIndex < 15) {
        setCountdownTransition(3);
      }
    };

    utterance.onerror = () => {
      setIsPlayingSpeech(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // PowerPoint Auto-Next countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownTransition > 0) {
      timer = setTimeout(() => {
        setCountdownTransition((prev) => {
          if (prev <= 1) {
            const nextIdx = projectPptSlideIndex + 1;
            if (nextIdx <= 15) {
              setProjectPptSlideIndex(nextIdx);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdownTransition, projectPptSlideIndex]);

  // Voice narration triggers based on slide index and presenter active state
  useEffect(() => {
    if (isSpeechPresenterActive) {
      speakProjectPptSlide();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSpeech(false);
      setCountdownTransition(0);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [projectPptSlideIndex, isSpeechPresenterActive, speechRate, autoNextPPT]);

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

  // Dynamic body & html overflow control to follow requested styles securely
  useEffect(() => {
    if (showHeroLanding) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showHeroLanding]);

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

  // Sync latest chat recommendations & metrics to Chat Intelligence BI Dashboard State
  const handleSyncChatToBI = () => {
    if (chatMessages.length === 0) {
      alert("Tidak ada riwayat percakapan chat untuk disinkronkan. Silakan kirim pesan ke Asisten PRAMA terlebih dahulu!");
      return;
    }
    
    // Search newest to oldest for assistant messages
    const botMessages = [...chatMessages].reverse().filter(m => m.sender === "assistant" || m.sender === "bot");
    if (botMessages.length === 0) {
      alert("Belum ada respon dari Asisten PRAMA di dalam riwayat chat untuk disinkronkan.");
      return;
    }

    const latestText = botMessages[0].text;
    
    // Setup temporary variables with current state as fallback
    let parsedTitle = chatBIState.projectTitle;
    let parsedCapex = chatBIState.initialCapex;
    let parsedSavings = chatBIState.annualSavings;
    let parsedRevenue = chatBIState.salesIncrease;
    let parsedRecommendations = [...chatBIState.recommendations];
    let parsedSWOT = { ...chatBIState.swot };
    let parsedTimeline = [...chatBIState.timeline];

    // 1. Try extracting Project Title
    const titleMatch = latestText.match(/(?:Judul|Project|Proyek|Kajian)\s*(?:Strategis|Komprehensif)?\s*:\s*([^\n]+)/i);
    if (titleMatch && titleMatch[1].trim()) {
      parsedTitle = titleMatch[1].trim().replace(/\*+/g, "").trim();
    }

    // 2. Try extracting CAPEX / Investment figure (e.g. 5 Miliar or 5000 Juta)
    const capexMatch = latestText.match(/(?:CAPEX|Investasi Awal|Capital)\s*(?:Awal|Expenditure)?\s*(?:sebesar|yaitu|Rp)?\s*([\d\.,\s]+)\s*(?:Miliar|M|Juta|Jt)/i);
    if (capexMatch) {
      const cleanedNum = capexMatch[1].replace(/\s/g, "").replace(/,/g, ".");
      const val = parseFloat(cleanedNum);
      if (!isNaN(val)) {
        parsedCapex = val < 80 ? Math.round(val * 1000) : Math.round(val);
      }
    }

    // 3. Try extracting annual savings
    const savingsMatch = latestText.match(/(?:Penghematan|Savings|Efisiensi)\s*(?:Ops|Operasional)?\s*(?:sebesar|yaitu|Rp)?\s*([\d\.,\s]+)\s*(?:Miliar|M|Juta|Jt)/i);
    if (savingsMatch) {
      const cleanedNum = savingsMatch[1].replace(/\s/g, "").replace(/,/g, ".");
      const val = parseFloat(cleanedNum);
      if (!isNaN(val)) {
        parsedSavings = val < 80 ? Math.round(val * 1000) : Math.round(val);
      }
    }

    // 4. Try extracting recommendations and SWOT metrics line-by-line
    const lines = latestText.split("\n");
    let recsFound: any[] = [];
    let swotS: string[] = [];
    let swotW: string[] = [];
    let swotO: string[] = [];
    let swotT: string[] = [];
    let swotMode: "s" | "w" | "o" | "t" | "none" = "none";

    lines.forEach((line) => {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      
      // Determine SWOT section
      if (lower.includes("strength") || lower.includes("kekuatan")) {
        swotMode = "s";
        return;
      } else if (lower.includes("weakness") || lower.includes("kelemahan")) {
        swotMode = "w";
        return;
      } else if (lower.includes("opportunity") || lower.includes("peluang")) {
        swotMode = "o";
        return;
      } else if (lower.includes("threat") || lower.includes("ancaman") || lower.includes("risiko luar")) {
        swotMode = "t";
        return;
      }

      const cleanLine = trimmed.replace(/^[\s•\-\*\d\.\)]+\s*/, "").replace(/\*+/g, "").trim();

      if (cleanLine.length > 15) {
        if (swotMode === "s" && swotS.length < 3) swotS.push(cleanLine);
        else if (swotMode === "w" && swotW.length < 3) swotW.push(cleanLine);
        else if (swotMode === "o" && swotO.length < 3) swotO.push(cleanLine);
        else if (swotMode === "t" && swotT.length < 3) swotT.push(cleanLine);
      }

      // Check for bullet lines looking like solid recommendations
      if ((trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+[\.\)]\s+/.test(trimmed)) && cleanLine.length > 25) {
        if (recsFound.length < 4 && !lower.includes("kekuatan") && !lower.includes("kelemahan") && !lower.includes("peluang") && !lower.includes("ancaman")) {
          const categories = ["Digital", "Operasional", "SDM", "Risiko"];
          const impactLevels: Array<"High" | "Medium"> = ["High", "Medium"];
          const costEstimations = [450, 250, 350, 550];
          
          recsFound.push({
            id: `rec-sync-${recsFound.length + 1}`,
            title: cleanLine.split(".")[0].substring(0, 48).trim() + (cleanLine.split(".")[0].length > 48 ? "..." : ""),
            category: categories[recsFound.length % categories.length],
            description: cleanLine,
            impact: impactLevels[recsFound.length % impactLevels.length],
            cost: costEstimations[recsFound.length % costEstimations.length]
          });
        }
      }
    });

    if (swotS.length > 0) parsedSWOT.strengths = swotS;
    if (swotW.length > 0) parsedSWOT.weaknesses = swotW;
    if (swotO.length > 0) parsedSWOT.opportunities = swotO;
    if (swotT.length > 0) parsedSWOT.threats = swotT;
    if (recsFound.length > 0) parsedRecommendations = recsFound;

    setChatBIState({
      projectTitle: parsedTitle,
      targetCompany: chatBIState.targetCompany,
      division: activeDivision === "comercial" ? "Commercial & Business Development" : "PRAMA Enterprise & Operations",
      initialCapex: parsedCapex,
      annualSavings: parsedSavings,
      salesIncrease: parsedRevenue,
      recommendations: parsedRecommendations,
      swot: parsedSWOT,
      timeline: parsedTimeline
    });

    alert("Sinkronisasi Sukses! Asisten Coder PRAMA telah mendeteksi metrik finansial, draf SWOT, dan rekomendasi program baru langsung dari isi chat terakhir Anda untuk dipetakan ke dasbor BI ini.");
  };

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
    setChatMessages([]);
    localStorage.setItem("gemini_mirror_chats", JSON.stringify([]));
    
    const activeUser = user || guestUser;
    if (activeUser) {
      const chatsPath = `users/${activeUser.uid}/chats`;
      try {
        const activeChatDoc = doc(db, chatsPath, "active_chat");
        await setDoc(activeChatDoc, {
          id: "active_chat",
          userId: activeUser.uid,
          title: "Sesi Aktif Gemini Workspace",
          messages: [],
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Gagal memulai percakapan baru:", err);
        handleFirestoreError(err, OperationType.WRITE, `${chatsPath}/active_chat`);
      }
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
          let parsedData: any = null;
          let isErrorResponse = !res.ok;
          try {
            parsedData = JSON.parse(responseText);
            if (parsedData && (parsedData.isError || parsedData.error)) {
              isErrorResponse = true;
            }
          } catch (e) {
            // ignore
          }
          
          if (isErrorResponse) {
            // Check if we can fallback to clientApiKey if the proxy returned an API error (e.g., leaked key, PERMISSION_DENIED, or quota issue)
            if (clientApiKey) {
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
                "gemini-2.5-flash",
                "gemini-2.5-pro",
                "gemini-3.1-pro-preview"
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
              const errObj = parsedData;
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
              throw new Error(errorMsg);
            }
          } else {
            const answerData = parsedData || JSON.parse(responseText);
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
        else if (
          code === 403 ||
          status === "PERMISSION_DENIED" ||
          lowercaseMsg.includes("permission_denied") ||
          lowercaseMsg.includes("not have permission") ||
          lowercaseOriginal.includes("permission_denied") ||
          lowercaseOriginal.includes("not have permission")
        ) {
          friendlyText = `⚠️ **Kunci API Tidak Memiliki Izin Akses (PERMISSION_DENIED / HTTP 403)**

Kunci API Gemini yang digunakan saat ini tidak memiliki izin akses atau dibatasi oleh kebijakan Google Cloud/AI Studio.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Gunakan **Gemini API Key pribadi** Anda sendiri dari Google AI Studio. Sangat mudah didapat secara gratis di [Google AI Studio](https://aistudio.google.com/).
3. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
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
        lowercaseErr.includes("permission") ||
        lowercaseErr.includes("denied") ||
        lowercaseErr.includes("403") ||
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
        } else if (friendlyText.includes("PERMISSION_DENIED") || friendlyText.includes("403")) {
          warningHeader = `> ⚠️ **PEMBERITAHUAN:** *Akses Kunci API Ditolak (PERMISSION_DENIED 403).* Menyajikan hasil menggunakan **Modul Analisis Logistik Internal PRAMA**. Silakan periksa izin kunci API Anda atau gunakan Kunci API pribadi lewat tombol **KONEKSI (BROWSER)** di atas.\n\n---\n\n`;
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
      const responseText = await res.text();
      let parsedData: any = null;
      let isErrorResponse = !res.ok;
      try {
        parsedData = JSON.parse(responseText);
        if (parsedData && (parsedData.isError || parsedData.error)) {
          isErrorResponse = true;
        }
      } catch (e) {
        // ignore
      }

      if (isErrorResponse) {
        if (clientApiKey) {
          const aiBrowser = new GoogleGenAI({ apiKey: clientApiKey });
          const clientModelsToTry = [
            "gemini-3.5-flash",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-3.1-pro-preview"
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
        throw new Error("Gagal memperoleh respons dari server.");
      }
      const data = parsedData || JSON.parse(responseText);
      return data.text || "";
    }
  };

  const getUnsplashUrl = (keyword: string, divId: string | null): string => {
    const kw = keyword.toLowerCase().trim();
    
    // Curated high-quality, beautiful Unsplash photo IDs for different topics
    const imageMap: Record<string, string> = {
      "container": "photo-1586528116311-ad8dd3c8310d",      // Industrial container/machinery
      "shipping": "photo-1494412574643-ff11b0a5c1c3",       // Ocean shipping/port
      "truck": "photo-1601584115197-04ecc0da31d7",          // Delivery truck/highway trans
      "highway": "photo-1519491050282-cf00c82424b4",        // Bridge/highway transport
      "office": "photo-1497215728101-856f4ea42174",         // Corporate warm office
      "collab": "photo-1531535934027-687f1434101e",         // Shared meeting/discussion table
      "team": "photo-1522071820081-009f0129c71c",           // Active collaboration
      "presentation": "photo-1551836022-d5d88e9218df",       // Modern skyscrapers/presentations
      "meeting": "photo-1486406146926-c627a92ad1ab",        // Meeting room workspace
      "finance": "photo-1554224155-8d04cb21cd6c",          // Analytics chart/computer
      "charts": "photo-1460925895917-afdab827c52f",         // Statistics and graphs
      "ledger": "photo-1454165804606-c3d57bc86b40",         // Planner notebook and desk
      "excel": "photo-1551288049-bebda4e38f71",          // Working on laptop charts
      "legal": "photo-1589829545856-d10d557cf95f",          // Court columns style building
      "compliance": "photo-1450133064473-71024230f91b",     // Auditing and compliance office
      "gavel": "photo-1589829545856-d10d557cf95f",          // Regulatory authority columns
      "audit": "photo-1507537297725-24a1c029d3ca",          // Auditing workbook search
      "verification": "photo-1454165804606-c3d57bc86b40",   // Verifiable paper sheets/desk
      "inspect": "photo-1454165804606-c3d57bc86b40",        // Inspection checklist
      "growth": "photo-1460925895917-afdab827c52f",         // Abstract blue world network
      "database": "photo-1544383835-bda2bc66a55d",         // Technical computer code
      "digital": "photo-1486406146926-c627a92ad1ab",        // Modern digital workspace
      "dashboard": "photo-1551288049-bebda4e38f71",         // KPI metric dashboards
      "handshake": "photo-1522071820081-009f0129c71c",       // Partner deal
      "hand": "photo-1531535934027-687f1434101e",           // Creative drawing
      "conclusion": "photo-1454165804606-c3d57bc86b40",     // Creative summary workspace
      "limbah": "photo-1530587191325-3db32d826c18",         // Industrial waste management / infrastructure
      "waste": "photo-1530587191325-3db32d826c18"           // Waste treatment
    };

    for (const key of Object.keys(imageMap)) {
      if (kw.includes(key)) {
        return `https://images.unsplash.com/${imageMap[key]}?auto=format&fit=crop&w=800&q=80`;
      }
    }

    const divisionFallbacks: Record<string, string> = {
      "comercial": "photo-1494412574643-ff11b0a5c1c3",       // Ocean cargo shipping
      "hca": "photo-1497215728101-856f4ea42174",             // Creative corporate desk
      "fina": "photo-1554224155-8d04cb21cd6c",             // Laptop charts
      "lga": "photo-1450133064473-71024230f91b",            // Compliance hall
      "spia": "photo-1507537297725-24a1c029d3ca"             // Professional verification book
    };

    const div = (divId || "general").toLowerCase();
    let id = "photo-1531535934027-687f1434101e"; // Default creative workspace
    for (const key of Object.keys(divisionFallbacks)) {
      if (div.includes(key)) {
        id = divisionFallbacks[key];
        break;
      }
    }
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
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
    sessionStorage.removeItem("prama_hero_dismissed");
    setShowHeroLanding(true);
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
        <a
          href="https://aistudio.google.com/apps/d4e73b8b-0ce8-482c-838c-fcfa6d09b5b3?showAssistant=true&showPreview=true"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-lg animate-bounce duration-1000 transition hover:scale-105"
          title="Buka Google AI Studio Workspace"
        >
          <img 
            id="prama-loading-logo"
            src={pramaLogo} 
            alt="PRAMA Logo" 
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </a>
        <h2 className="mt-4 font-display font-extrabold text-lg text-slate-800 tracking-wide uppercase">
          PRAMA PORTAL
        </h2>
        <p className="font-mono text-xs text-slate-400 font-bold tracking-wider mt-1.5 animate-pulse">
          Menerapkan Verifikasi Enkripsi & Struktur Data...
        </p>
      </div>
    );
  }

  // Render 1.5: Cinematic Photo Landing/Intro Screen
  if (showHeroLanding) {
    return (
      <div className="video-container" id="landing-hero-container">
        {heroBgType === "video" ? (
          <video
            ref={landingVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            id="bg-video"
            key={videoSrc || "default"}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 animate-fade-in scale-[1.08] origin-center"
            style={{ zIndex: -1, opacity: 0.65 }}
            onError={() => {
              const fallbackUrl = "/custom-video.mp4";
              if (videoSrc !== fallbackUrl) {
                console.warn("Lobby video failed to load. Falling back to default custom video...");
                setVideoSrc(fallbackUrl);
              }
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          slideshowImages.map((src, idx) => (
            <img 
              key={src}
              src={src} 
              alt={`Pancaran Group Background ${idx + 1}`} 
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-[1.08] origin-center`}
              style={{ zIndex: -1, opacity: idx === slideshowIndex ? 0.65 : 0 }}
            />
          ))
        )}

        {heroBgType === "image" && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slideshowImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlideshowIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  idx === slideshowIndex ? "w-8 bg-emerald-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="menu-content" id="landing-menu-content">
          <h1>Pancaran Group</h1>
          <p className="mb-6">Solusi Logistik Masa Depan</p>

          {/* Selector Tipe Latar (Video atau Foto) */}
          <div className="flex flex-col items-center gap-1.5 mb-8">
            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-300 opacity-80 select-none">
              Pilihan Media Latar Belakang:
            </span>
            <div className="flex bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-1 gap-1 w-64 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setHeroBgType("video");
                  localStorage.setItem("prama_hero_bg_type", "video");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black tracking-wide transition duration-300 cursor-pointer ${
                  heroBgType === "video"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Video className="h-3.5 w-3.5 shrink-0" />
                <span>Video Latar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroBgType("image");
                  localStorage.setItem("prama_hero_bg_type", "image");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black tracking-wide transition duration-300 cursor-pointer ${
                  heroBgType === "image"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Image className="h-3.5 w-3.5 shrink-0" />
                <span>Foto Latar</span>
              </button>
            </div>
          </div>

          <button 
            type="button"
            className="btn-mulai font-bold mt-2" 
            id="btn-mulai-jelajah"
            onClick={() => {
              setShowHeroLanding(false);
              sessionStorage.setItem("prama_hero_dismissed", "true");
            }}
          >
            Mulai Jelajah AI
          </button>
        </div>
      </div>
    );
  }

  // Render 2: Authentic Screen (Login & Register Form) - Theme: Light & Elegant with Brand Background Video/Image option
  if (!activeUser) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 font-sans overflow-hidden">
        {/* Brand Background Image or Video */}
        <div className="absolute inset-0 z-0">
          {heroBgType === "video" ? (
            <video 
              ref={authVideoRef}
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              key={videoSrc || "auth-default"}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-[1.08] origin-center"
              onError={() => {
                const fallbackUrl = "/custom-video.mp4";
                if (videoSrc !== fallbackUrl) {
                  console.warn("Setting fallback video stream on error for auth background...");
                  setVideoSrc(fallbackUrl);
                }
              }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            slideshowImages.map((src, idx) => (
              <img 
                key={src}
                src={src} 
                alt={`Pancaran Group Background ${idx + 1}`} 
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-[1.08] origin-center`}
                style={{ opacity: idx === slideshowIndex ? 1 : 0 }}
              />
            ))
          )}
          {/* Elegant Dark/Blur Overlay to focus and elevate contrast */}
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
        </div>

        {/* Small floating Back Button on the top left */}
        <button
          type="button"
          id="btn-back-to-video"
          onClick={() => {
            setShowHeroLanding(true);
            sessionStorage.removeItem("prama_hero_dismissed");
          }}
          className="absolute top-4 left-4 z-[999] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition duration-200 shadow-md select-none text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Lobi</span>
        </button>

        {/* Floating Background Selector on the top right */}
        <div className="absolute top-4 right-4 z-[999] flex bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-1 gap-1 shadow-md text-xs select-none">
          <button
            type="button"
            onClick={() => {
              setHeroBgType("video");
              localStorage.setItem("prama_hero_bg_type", "video");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-black transition duration-200 cursor-pointer ${
              heroBgType === "video"
                ? "bg-indigo-650 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="h-3 w-3 shrink-0" />
            <span>VIDEO</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setHeroBgType("image");
              localStorage.setItem("prama_hero_bg_type", "image");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-black transition duration-200 cursor-pointer ${
              heroBgType === "image"
                ? "bg-indigo-650 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Image className="h-3 w-3 shrink-0" />
            <span>FOTO</span>
          </button>
        </div>



        {/* Auth Card wrapper with elevated relative z-index */}
        <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/20">
          
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
                  <div className="relative flex items-center bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-200 focus-within:border-indigo-500 transition shadow-2sm">
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
                  Alamat Email
                </label>
                <div className="relative flex items-center bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-200 focus-within:border-indigo-500 transition shadow-2sm">
                  <Mail className="h-4 w-4 text-slate-400 mr-2 shrink-0 font-bold" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Alamat Email..."
                    className="w-full bg-transparent border-none text-xs text-slate-800 font-bold focus:outline-none focus:ring-0 py-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Sandi Rahasia
                </label>
                <div className="relative flex items-center bg-slate-100/60 rounded-xl overflow-hidden px-3 border border-slate-200 focus-within:border-indigo-500 transition shadow-2sm">
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
                : dashboardView === "project_dashboard"
                ? "Dashboard Formulasi Jurnal PM"
                : "Administrasi Persetujuan Registrasi"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xl mx-auto font-bold leading-relaxed">
              {dashboardView === "divisions"
                ? "Klik salah satu pilar divisi operasional korporat logistik Pancaran Group di bawah ini untuk memulai sesi dialog analisis, audit, atau penyusunan dokumen berbasis asisten cerdas PRAMA."
                : dashboardView === "saved_docs"
                ? "Kelola, edit, cari, cetak, dan ekspor draf artikel project management atau dokumen audit yang tersimpan di cloud terenkripsi portal PRAMA."
                : dashboardView === "project_dashboard"
                ? "Lihat, edit, dan unduh 14 pilar analisis dan strategi manajemen proyek secara lengkap dalam format dokumen Word (.doc) terpisah atau presentasi PPTX (.pptx)."
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
                  <div className="space-y-6">
                    {/* NEW SECTION: LOBBY BACKGROUND SETTINGS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 text-xs">
                          ⚙️
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs text-slate-850 uppercase tracking-wider leading-none">
                            Pengaturan Media Latar Belakang Lobi
                          </h4>
                          <p className="text-[9px] text-slate-400 font-mono mt-1 font-bold uppercase">
                            UNGGAH & ATUR WALLPAPER / VIDEO LATAR LOBI UTAMA PORTAL
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selector Tipe Latar */}
                        <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-3sm gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block font-mono">TIPE MEDIA LATAR</span>
                            <span className="text-[11px] text-slate-500 font-medium leading-relaxed block">Pilih jenis background lobi yang ingin Anda aktifkan saat ini</span>
                          </div>
                          <div className="flex bg-slate-200/60 rounded-xl p-1 gap-1 w-full shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setHeroBgType("video");
                                localStorage.setItem("prama_hero_bg_type", "video");
                              }}
                              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition duration-200 cursor-pointer ${
                                heroBgType === "video"
                                  ? "bg-slate-900 text-white shadow"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              <Video className="h-3.5 w-3.5 shrink-0" />
                              <span>Latar Video (.MP4)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setHeroBgType("image");
                                localStorage.setItem("prama_hero_bg_type", "image");
                              }}
                              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black tracking-wide transition duration-200 cursor-pointer ${
                                heroBgType === "image"
                                  ? "bg-slate-900 text-white shadow"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              <Image className="h-3.5 w-3.5 shrink-0" />
                              <span>Latar Foto (.JPG)</span>
                            </button>
                          </div>
                        </div>

                        {/* Conditional Upload Panel based on background type */}
                        {heroBgType === "video" ? (
                          <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-3sm gap-3 animate-fade-in">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block font-mono">UNGGAH VIDEO (.MP4)</span>
                              <span className="text-[11px] text-slate-505 leading-relaxed block text-indigo-900 font-medium">
                                {customVideoUrl 
                                  ? "✅ Video kustom aktif. File disinkronisasi ke server agar tersimpan permanen di Vercel." 
                                  : "Gunakan video pemandangan logistik kustom (.MP4, maks. 80MB) untuk lobi utama."}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <label className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-500 active:scale-97 transition shadow-md cursor-pointer border border-indigo-500">
                                <Upload className="h-4 w-4 shrink-0 text-indigo-200" />
                                <span>Unggah Video (.MP4)</span>
                                <input
                                  type="file"
                                  accept="video/mp4,video/x-m4v,video/*"
                                  onChange={handleVideoUpload}
                                  className="hidden"
                                />
                              </label>

                              {customVideoUrl && (
                                <button
                                  type="button"
                                  onClick={handleResetVideo}
                                  title="Kembalikan Video Default Bawaan"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-650 text-red-600 transition active:scale-95 cursor-pointer border border-red-100 shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-3sm gap-3 animate-fade-in">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block font-mono">UNGGAH FOTO (.JPG / .PNG)</span>
                              <span className="text-[11px] text-slate-550 leading-relaxed block text-indigo-900 font-medium">
                                {customImageUrl 
                                  ? "✅ Foto kustom aktif. File disinkronisasi ke server agar tersimpan permanen di Vercel." 
                                  : "Gunakan foto wallpaper custom (.JPG / .PNG, maks. 15MB) untuk lobi utama."}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <label className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-sky-600 text-white hover:bg-sky-550 active:scale-97 transition shadow-md cursor-pointer border border-sky-500 animate-pulse">
                                <Upload className="h-4 w-4 shrink-0 text-sky-100" />
                                <span>Unggah Foto</span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/jpg"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>

                              {customImageUrl && (
                                <button
                                  type="button"
                                  onClick={handleResetImage}
                                  title="Kembalikan Foto Default Bawaan"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-650 text-red-650 text-red-600 transition active:scale-95 cursor-pointer border border-red-100 shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-200 my-1" />

                    {/* Pending Requests Header & list */}
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-3sm p-6">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-inner text-lg">
                          ✨
                        </div>
                        <h4 className="font-display font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                          Antrean Otorisasi Bersih
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto font-medium leading-relaxed">
                          Tidak ada staf baru yang menunggu persetujuan. Semua permohonan masuk telah diselesaikan secara tuntas.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed font-semibold">
                          💡 Sebagai administrator, tinjau permohonan pendaftaran di bawah ini untuk mengizinkan staf baru mengakses portal analitik internal PRAMA.
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="divide-y divide-slate-100">
                            {pendingRequests.map((req) => (
                              <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/50">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-black text-slate-800 tracking-wide">
                                      {req.fullName || "Staf PRAMA"}
                                    </p>
                                    <span className="font-mono text-[8px] font-extrabold tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">
                                      Kandidat Staf
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-bold font-mono mt-1">
                                    Email: <span className="text-indigo-600 font-extrabold">{req.email || "No Email"}</span>
                                  </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-97 text-white text-[10.5px] font-black px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
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
          ) : dashboardView === "project_dashboard" ? (
            <div className="max-w-6xl mx-auto text-left bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full min-h-[680px] flex flex-col">
              {/* Header */}
              <div className="bg-slate-900 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-950 text-violet-400 font-extrabold border border-violet-800 text-sm shadow-inner shadow-black/80">
                    📂
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wider uppercase leading-none text-white flex items-center gap-2">
                      DASHBOARD UTAMA FORMULASI PM
                      <span className="text-[8px] font-bold font-mono tracking-widest px-2 py-0.5 rounded bg-violet-900/80 text-violet-200 border border-violet-700 uppercase leading-none">
                        14 PILAR JURNAL
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest font-bold mt-1 uppercase">
                      KAJIAN KELAYAKAN KOMPREHENSIF MITRA PRAMA ADVISOR
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => setDashboardView("divisions")}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white active:scale-95 text-[11px] text-slate-300 border border-slate-700 rounded-xl px-3.5 py-2 font-bold cursor-pointer transition shadow"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Kembali ke Divisi</span>
                  </button>
                </div>
              </div>

              {/* Main Control Panel Bar (Editable Project Title & Combined Exports) */}
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 justify-between shrink-0">
                {/* Editable Project Title */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">
                    JUDUL KAJIAN PROYEK PM (SINKRON KE EXPORT WORD/PPT)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dashboardProjectTitle}
                      onChange={(e) => setDashboardProjectTitle(e.target.value)}
                      placeholder="Masukkan nama proyek / judul kajian..."
                      className="w-full pl-3 pr-10 py-2.5 text-xs font-extrabold border border-slate-200 bg-white text-slate-800 rounded-xl focus:border-indigo-500 transition-shadow outline-none shadow-sm font-sans"
                    />
                    <div className="absolute right-3 top-2.5 text-[9px] text-slate-400 font-extrabold uppercase font-mono tracking-wider select-none bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 leading-none">
                      Edit
                    </div>
                  </div>
                </div>

                {/* Combined Export Buttons & Web Viewers */}
                <div className="flex flex-wrap gap-2 shrink-0 pt-2 lg:pt-0">
                  {/* WORD Controls block */}
                  <div className="flex items-center gap-1.5 bg-indigo-50/60 p-1.5 rounded-2xl border border-indigo-100">
                    <button
                      type="button"
                      onClick={() => setWebDocPreview("word")}
                      className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-xl px-3 py-2.5 transition shadow-sm cursor-pointer border border-indigo-200"
                      title="Buka Pratinjau WORD Interaktif di Web"
                    >
                      <Eye className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Pratinjau Word</span>
                    </button>
                    <button
                      onClick={() => {
                        exportAllSectionsToWord(dashboardProjectTitle, dashboardSectionsState);
                      }}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl px-3.5 py-2.5 transition shadow-md cursor-pointer"
                      title="Unduh file Word hasil kompilasi"
                    >
                      <FileText className="h-3.5 w-3.5 text-indigo-100" />
                      <span>Unduh Word</span>
                    </button>
                  </div>

                  {/* PPT Controls block */}
                  <div className="flex items-center gap-1.5 bg-sky-50/60 p-1.5 rounded-2xl border border-sky-100">
                    <button
                      type="button"
                      onClick={() => {
                        setWebDocPreview("ppt");
                        setActiveSlideIndex(0);
                      }}
                      className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-black rounded-xl px-3 py-2.5 transition shadow-sm cursor-pointer border border-sky-200"
                      title="Pratinjau Slide Presentasi PPT & Aktifkan Fitur Suara Narasi"
                    >
                      <Eye className="h-3.5 w-3.5 text-sky-500" />
                      <span>Pratinjau PPT</span>
                    </button>
                    <button
                      onClick={async () => {
                        await exportAllSectionsToPPTX(dashboardProjectTitle, dashboardSectionsState);
                      }}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-black rounded-xl px-3.5 py-2.5 transition shadow-md cursor-pointer"
                      title="Unduh file PowerPoint"
                    >
                      <Presentation className="h-3.5 w-3.5 text-sky-100" />
                      <span>Unduh PPTX</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Split Body Layout */}
              <div className="flex-grow flex flex-col lg:flex-row min-h-0 bg-slate-50/50">
                {/* LEFT LIST PANEL: 14 PILLARS MENUS (Scrollable) */}
                <div className="w-full lg:w-80 border-r border-slate-200 shrink-0 bg-white flex flex-col overflow-y-auto max-h-[300px] lg:max-h-[600px]">
                  <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                      Daftar 14 Pilar Strategi
                    </span>
                    <span className="text-[8px] font-extrabold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-mono">
                      Pramis Formulator
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 flex-grow select-none">
                    {defaultDashboardSections.map((sec) => {
                      const isActive = activeDashboardSection === sec.number;
                      return (
                        <div
                          key={sec.number}
                          onClick={() => setActiveDashboardSection(sec.number)}
                          className={`p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left ${
                            isActive 
                              ? "bg-violet-50/75 border-l-4 border-violet-600" 
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                                isActive ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}>
                                {sec.number}
                              </span>
                              <span className={`text-[12px] font-black truncate ${
                                isActive ? "text-violet-900" : "text-slate-800"
                              }`}>
                                {sec.title}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 line-clamp-1 font-semibold">
                              {sec.shortDesc}
                            </p>
                          </div>

                          {/* Quick single-button export with layout block propagation preventer */}
                          <button
                            type="button"
                            title={`Ekspor ${sec.title} ke Word`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentTxt = dashboardSectionsState[sec.number] || sec.defaultContent;
                              exportSingleSectionToWord(dashboardProjectTitle, sec, currentTxt);
                            }}
                            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-violet-600 text-slate-500 hover:text-white border border-slate-205 hover:border-violet-600 transition shadow-sm cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT EXPLORER & EDITING WORKSPACE CANVAS */}
                <div className="flex-grow p-6 flex flex-col min-h-0 bg-slate-50">
                  {(() => {
                    const activeSec = defaultDashboardSections.find(s => s.number === activeDashboardSection);
                    if (!activeSec) return null;
                    const val = dashboardSectionsState[activeDashboardSection] || "";

                    return (
                      <div className="flex-1 flex flex-col gap-5 min-h-0">
                        {/* Selected Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest font-mono">
                                PILAR STRATEGIS #{activeSec.number}
                              </span>
                              <span className="text-[9px] font-extrabold text-slate-400 font-mono">
                                STATUS: AKTIF MODIFIKASI
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mt-1 uppercase font-display tracking-tight">
                              {activeSec.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                              {activeSec.shortDesc}
                            </p>
                          </div>

                          {/* Individual Export in Selected Workspace */}
                          <div className="shrink-0 flex gap-2">
                            <button
                              onClick={() => {
                                exportSingleSectionToWord(dashboardProjectTitle, activeSec, val);
                              }}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-[10.5px] text-white rounded-xl px-4 py-2 font-black shadow-sm transition cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Unduh Bab Word Ini (.doc)</span>
                            </button>
                          </div>
                        </div>

                        {/* Tab Switcher for Editor vs Article View vs Workflow Skema */}
                        <div className="flex border-b border-slate-200 gap-1.5 shrink-0 overflow-x-auto select-none bg-slate-100 p-1.5 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setWorkspaceViewState("editor")}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[10.5px] font-black rounded-xl transition ${
                              workspaceViewState === "editor"
                                ? "bg-white text-slate-800 border border-slate-200 shadow-sm"
                                : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                            }`}
                          >
                            <SquarePen className="h-3.5 w-3.5 text-indigo-505" />
                            <span>✏️ Formulasi Draf (Editor)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setWorkspaceViewState("article")}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[10.5px] font-black rounded-xl transition ${
                              workspaceViewState === "article"
                                ? "bg-white text-emerald-800 border border-slate-200 shadow-sm"
                                : "text-slate-500 hover:bg-slate-200 hover:text-emerald-700"
                            }`}
                          >
                            <BookOpen className="h-3.5 w-3.5 text-emerald-550" />
                            <span>📰 Elegansi Artikel (Tipografi)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setWorkspaceViewState("workflow")}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[10.5px] font-black rounded-xl transition ${
                              workspaceViewState === "workflow"
                                ? "bg-white text-indigo-850 border border-slate-200 shadow-sm"
                                : "text-slate-500 hover:bg-slate-200 hover:text-indigo-800"
                            }`}
                          >
                            <Grid className="h-3.5 w-3.5 text-indigo-500" />
                            <span>📊 Skema Alur Workflow {activeSec.number === 5 ? "(Pilar 5 Struktur)" : ""}</span>
                          </button>
                        </div>

                        {/* Editor Canvas Block */}
                        <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-5 min-h-0">
                          {/* Conditional Workspace View */}
                          {workspaceViewState === "editor" ? (
                            /* Live Text Area Editor */
                            <div className="xl:col-span-8 flex flex-col min-h-[300px]">
                              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800 rounded-t-xl text-white text-[9.5px] font-bold font-mono tracking-widest shrink-0">
                                <span>WORKSPACE EDITOR PRAMA ADVISOR</span>
                                <span className="text-emerald-400">BAHASA INDONESIA</span>
                              </div>
                              <textarea
                                value={val}
                                onChange={(e) => {
                                  setDashboardSectionsState(prev => ({
                                    ...prev,
                                    [activeDashboardSection]: e.target.value
                                  }));
                                }}
                                className="w-full h-full min-h-[250px] p-4 text-xs font-mono bg-slate-900 text-slate-100 rounded-b-xl border border-slate-800 outline-none leading-relaxed resize-none shadow-inner"
                                placeholder="Ketik draf di sini..."
                              />
                            </div>
                          ) : workspaceViewState === "article" ? (
                            /* Classic Typography Article Layout Viewer */
                            <div className="xl:col-span-8 bg-white border border-slate-205 border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col overflow-y-auto max-h-[500px] shadow-sm relative text-left">
                              {/* Glowing Reading progress top handle */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-t-2xl" />

                              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 shrink-0">
                                <div className="flex items-center gap-2 text-[9.5px] font-bold text-slate-400 font-mono">
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded leading-none">BACAAN KELAYAKAN</span>
                                  <span>•</span>
                                  <span>ESTIMASI: ~{Math.max(1, Math.round(val.split(/\s+/).length / 140))} MENIT</span>
                                  <span>•</span>
                                  <span>{val.split(/\s+/).length} KATA</span>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    navigator.clipboard.writeText(val);
                                    alert("Salin isi artikel pilar berhasil diduplikasi!");
                                  }}
                                  className="text-[9.5px] font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                >
                                  Salin Teks Artikel
                                </button>
                              </div>

                              {/* Typography content wrapper */}
                              <div className="flex-grow">
                                <div className="mb-5">
                                  <span className="text-[9px] font-mono font-black tracking-widest text-emerald-600 uppercase block mb-1">PRAMA MITRA EXCLUSIVE DOSSIER</span>
                                  <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight font-display">{activeSec.title}</h2>
                                  <div className="flex items-center gap-2.5 mt-2.5">
                                    <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-white font-serif">P</div>
                                    <div className="text-[11px] font-bold text-slate-500">
                                      Oleh <span className="text-slate-800 font-bold">PRAMA Strategic Advisor Team</span> • Diperbarui {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                                    </div>
                                  </div>
                                </div>

                                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans mt-4">
                                  {(() => {
                                    const paragraphs = val.split("\n").map(p => p.trim()).filter(Boolean);
                                    let isFirstParagraph = true;
                                    return paragraphs.map((textLine, sIdx) => {
                                      if (textLine.startsWith("###")) {
                                        return (
                                          <h4 key={sIdx} className="text-[13px] font-black text-indigo-900 border-b border-indigo-100 pb-1 mt-5 mb-2 uppercase tracking-wide">
                                            {textLine.replace(/^###\s*/, "")}
                                          </h4>
                                        );
                                      }
                                      if (textLine.startsWith("* ") || textLine.startsWith("- ")) {
                                        return (
                                          <div key={sIdx} className="flex gap-2 items-start pl-4 py-1.5 border-l-2 border-emerald-500 bg-slate-50 rounded-r-lg my-1.5 font-sans">
                                            <span className="text-emerald-500 font-bold text-[10px] select-none">✓</span>
                                            <p className="text-[11px] font-bold text-slate-600 m-0 animate-none">
                                              {textLine.replace(/^[\*\-]\s*/, "").replace(/\*\*/g, "")}
                                            </p>
                                          </div>
                                        );
                                      }

                                      const strippedLine = textLine.replace(/\*\*/g, "");
                                      // Apply beautiful drop caps for aesthetic purposes
                                      if (isFirstParagraph && strippedLine.length > 30) {
                                        isFirstParagraph = false;
                                        const cap = strippedLine.charAt(0);
                                        const tail = strippedLine.slice(1);
                                        return (
                                          <p key={sIdx} className="text-[11.5px] text-slate-600 leading-relaxed font-semibold my-3 text-justify font-sans">
                                            <span className="float-left text-3xl font-serif font-black text-indigo-700 mr-2 mt-0.5 leading-none uppercase">{cap}</span>
                                            {tail}
                                          </p>
                                        );
                                      }

                                      return (
                                        <p key={sIdx} className={`text-[11.5px] leading-relaxed text-slate-650 ${textLine.startsWith("**") ? "font-black text-indigo-950 mt-4 border-l-2 border-indigo-200 pl-2" : "font-semibold"} my-2.5 text-justify font-sans`}>
                                          {strippedLine}
                                        </p>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>

                              {/* Approved electronic seal watermark */}
                              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl shrink-0 select-none">
                                <div>
                                  <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-wider block leading-none mb-1">CLASSIFIED MATURITY LEVEL</span>
                                  <span className="text-[10px] font-black text-rose-600 font-mono bg-rose-50 border border-rose-100 rounded px-2 py-0.5">RAHASIA / TERBATAS KORPORAT</span>
                                </div>
                                <div className="text-right flex items-center gap-1.5 font-mono text-[8.5px] font-bold text-slate-400">
                                  <div>
                                    <div>PRAMA VERIFICATION SYSTEM</div>
                                    <div className="text-emerald-600 text-[9px] font-black uppercase">✓ APPROVED TO PUBLIC DISPATCH</div>
                                  </div>
                                  <div className="h-8 w-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-[13px] font-bold">★</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Live Interactive Workflow Diagram Scheme */
                            <div className="xl:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-5 min-h-[300px] text-white relative overflow-hidden select-none text-left">
                              {/* Ambient style background animation */}
                              <style>{`
                                @keyframes dash {
                                  to {
                                    stroke-dashoffset: -100;
                                  }
                                }
                              `}</style>
                              <div className="absolute inset-x-0 inset-y-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px]" />
                              
                              <div className="flex items-center justify-between z-10 border-b border-slate-800 pb-3 mb-4 shrink-0">
                                <div className="flex items-center gap-2">
                                  <span className="block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                    CLOSED-LOOP LOGISTICS PROCESS CHART {activeSec.number === 5 ? "(STRUKTUR NILAI)" : "(PILAR ALUR)"}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    let nodeIdx = 1;
                                    const interval = setInterval(() => {
                                      setActiveWorkflowNode(nodeIdx);
                                      nodeIdx = (nodeIdx % 5) + 1;
                                    }, 2000);
                                    
                                    alert("Memulai simulasi tracking digital aktif! Setiap gate akan berpindah otomatis.");
                                    
                                    setTimeout(() => {
                                      clearInterval(interval);
                                      setActiveWorkflowNode(null);
                                    }, 10000);
                                  }}
                                  className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-lg text-[9px] font-mono uppercase tracking-wider text-white font-black shadow-sm transition active:scale-95 cursor-pointer border-none"
                                >
                                  SIMULASIKAN ALUR 🚀
                                </button>
                              </div>

                              {/* Elegant Node SVG Layout */}
                              <div className="flex-grow flex flex-col items-center justify-center p-4 relative min-h-[220px] z-10 overflow-x-auto w-full">
                                <svg className="absolute w-[90%] h-12 left-[5%] top-1/2 -translate-y-1/2 pointer-events-none z-0" style={{ minWidth: "480px" }}>
                                  <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                                  <line 
                                    x1="10%" y1="50%" x2="90%" y2="50%" 
                                    stroke="url(#workflowGlowGradient)" strokeWidth="3" 
                                    strokeLinecap="round" strokeDasharray="14 18"
                                    style={{ animation: "dash 4s linear infinite" }}
                                  />
                                  <defs>
                                    <linearGradient id="workflowGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#10b981" />
                                      <stop offset="50%" stopColor="#3b82f6" />
                                      <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                  </defs>
                                </svg>

                                <div className="flex items-center justify-between w-full relative z-10 gap-2 max-w-4xl" style={{ minWidth: "480px" }}>
                                  {[
                                    { id: 1, label: "Client Site", code: "ORIGIN", desc: "Pengepakan ISO & Manifest", icon: "🏢", status: "TERVERIFIKASI" },
                                    { id: 2, label: "Digital Inspect", code: "HSE-GATE", desc: "Verifikasi RFID & Segel GPS", icon: "🛡️", status: "DISEGEL DIGITAL" },
                                    { id: 3, label: "Logistics Fleet", code: "ARMADA", desc: "GPS IoT Real-time Speed Monitoring", icon: "🚚", status: "DIJALAN (RUTE)" },
                                    { id: 4, label: "WIM weighing", code: "TIMBANG", desc: "Timbang Otomatis & Festronik", icon: "⚖", status: "ANTRIAN GERBANG" },
                                    { id: 5, label: "Licensed Proc", code: "DEST-END", desc: "Insinerasi & Manifes Selesai", icon: "♻", status: "SELESAI OPERASI" }
                                  ].map((node) => {
                                    const isSelected = activeWorkflowNode === node.id || (!activeWorkflowNode && node.id === 1);
                                    return (
                                      <div 
                                        key={node.id} 
                                        onClick={() => setActiveWorkflowNode(node.id)}
                                        className="flex flex-col items-center cursor-pointer transition-all duration-300"
                                      >
                                        <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${
                                          isSelected 
                                            ? "bg-slate-950 border-emerald-400 ring-4 ring-emerald-950/80 scale-110 shadow-lg" 
                                            : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                                        }`}>
                                          {isSelected && (
                                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                            </span>
                                          )}
                                          <span className="text-lg">{node.icon}</span>
                                        </div>

                                        <div className="text-center mt-2">
                                          <p className={`text-[9.5px] font-black tracking-wide leading-none ${isSelected ? "text-emerald-400" : "text-slate-350"}`}>
                                            {node.label}
                                          </p>
                                          <p className="text-[7px] font-black font-mono text-slate-500 tracking-wider">
                                            {node.code}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Footer Detail Panel */}
                              {(() => {
                                const selectedDetail = [
                                  { id: 1, label: "Situs Origin Pengirim (Client Site)", code: "ORIGIN", detail: "Klien mengemas dan menyortir limbah B3 sesuai regulasi UN Class/ISO. Manifest Festronik diisi secara elektronik di awal.", SLA: "SLA Kembalian Kontainer: <2 Jam", keyHSE: "Risiko Tumpahan: Sangat Kecil" },
                                  { id: 2, label: "HSE Gate (Digital Inspection)", code: "HSE-GATE", detail: "Pengecekan manifes jalan dan KIR. Pintu kargo disegel segel elektronik, scan QR-code FESTRONIK terpadu dilepas.", SLA: "SLA Inspeksi Gate: 15 Menit", keyHSE: "Indikator Kunci: RFID & Driver OK" },
                                  { id: 3, label: "Logistics Fleet (Transit)", code: "ARMADA", detail: "Armada Vacuum Truck/Multi-Axle Box logistik melewati rute yang disetujui. GPS IoT melacak parameter kecapatan & koordinat secara langsung.", SLA: "SLA Kecepatan Rute: 100% Sesuai Rute Kemenhub", keyHSE: "Kunci HSE: Pembatas Kecepatan 60kmh" },
                                  { id: 4, label: "Weigh-In-Motion Gate", code: "TIMBANG", detail: "Timbangan berat otomatis otomatis. Apabila berat muatan terverifikasi aman, pelunasan jembatan timbang di-push ke server.", SLA: "SLA Timbang Jalan: Real-time API", keyHSE: "Kunci HSE: Toleransi Penyimpangan < 0.5%" },
                                  { id: 5, label: "Fasilitas Pengolah Akhir (Licensed Destination)", code: "DEST-END", detail: "Pemusnahan atau insinerasi ramah lingkungan oleh mitra berbadan hukum resmi. Manifes Festronik di-closed bersatus 'Selesai'.", SLA: "SLA Manifes Pelaporan: <24 Jam", keyHSE: "Risiko Emisi: Zero Discharge & Standard AMDAL" }
                                ].find(n => n.id === (activeWorkflowNode || 1));

                                return (
                                  <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950/60 p-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 z-10 relative">
                                    <div className="max-w-md font-sans">
                                      <span className="text-[7.5px] font-black bg-indigo-950 text-indigo-400 border border-indigo-900 leading-none px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                        DETIL GATE OPERASI: {selectedDetail?.code}
                                      </span>
                                      <h5 className="font-extrabold text-[11px] text-slate-100 mt-1 uppercase font-display">
                                        {selectedDetail?.label}
                                      </h5>
                                      <p className="text-[10px] text-slate-400 leading-normal mt-1 font-semibold">
                                        {selectedDetail?.detail}
                                      </p>
                                    </div>
                                    <div className="text-left md:text-right text-slate-400 font-mono text-[8px] font-extrabold flex flex-col gap-0.5 shrink-0">
                                      <div className="text-emerald-400">{selectedDetail?.SLA}</div>
                                      <div className="text-pink-400">{selectedDetail?.keyHSE}</div>
                                      <div>INTEGRAL PRAMA ADVISOR</div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* Interactive Preview & Guidelines Container */}
                          <div className="xl:col-span-4 flex flex-col gap-4">
                            {/* Executive Guideline Card */}
                            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-indigo-950 flex flex-col flex-grow text-xs leading-relaxed overflow-y-auto max-h-[320px] shadow-sm">
                              <span className="text-[8px] font-mono font-black text-amber-400 tracking-widest uppercase mb-1">
                                INDIKATOR KEPATUHAN & PEDOMAN
                              </span>
                              <h5 className="font-extrabold text-[12px] text-slate-200 mb-2 uppercase">
                                Instruksi Panduan Kelayakan
                              </h5>
                              <p className="text-slate-300 text-[11px] mb-3 leading-normal font-semibold">
                                Pastikan artikel memuat spesifikasi logistik logis PT Pancaran Group. Untuk bagian finansial, detail perhitungan amortisasi armada vacuum truck dan target margin ROI diestimasi 35% dekarbonisasi.
                              </p>
                              <div className="mt-auto pt-3 border-t border-slate-800 flex flex-col gap-2 font-mono text-[9px] text-slate-400">
                                <div className="flex justify-between">
                                  <span>Tingkat Risiko:</span>
                                  <span className="text-rose-400 font-extrabold">TERKENDALIKAN</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Otoritas Timbang:</span>
                                  <span className="text-indigo-400 font-extrabold">FESTRONIK INTEGRATED</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Standar Sertifikasi:</span>
                                  <span className="text-emerald-400 font-extrabold">AMDAL / ISO 14001</span>
                                </div>
                              </div>
                            </div>

                            {/* Reset state */}
                            <button
                              type="button"
                              onClick={() => {
                                setDashboardSectionsState(prev => ({
                                  ...prev,
                                  [activeDashboardSection]: activeSec.defaultContent
                                }));
                              }}
                              className="w-full py-2 bg-slate-200 hover:bg-slate-300 active:scale-97 border border-slate-300 text-slate-700 font-bold text-[10.5px] rounded-xl cursor-pointer transition shadow-sm"
                            >
                              Pulihkan Teks Bawaan Pabrik
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Footer detail */}
              <div className="bg-slate-900 border-t border-slate-800 text-[9.5px] text-slate-500 text-center py-2.5 font-mono select-none text-center">
                PT PANCARAN GROUP LOGISTICS SERVICES INTEGRATED CLOUD SYSTEM &bull; PRAMA ADVISOR v1.5
              </div>

              {/* 📄 WORD LIVE WEB DOCUMENT SIMULATOR PREVIEW OVERLAY */}
              {webDocPreview === "word" && (
                <div className="fixed inset-0 wrongs-scrollbar z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md flex items-start justify-center p-4">
                  <div className="bg-slate-850 rounded-3xl w-full max-w-5xl border border-slate-800 shadow-2xl flex flex-col my-8 overflow-hidden max-h-[90vh]">
                    {/* Header control toolbar */}
                    <div className="bg-slate-950 px-6 py-4 border-b border-slate-850 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-950 border border-indigo-800 rounded-xl flex items-center justify-center text-lg font-semibold shadow">
                          📄
                        </div>
                        <div className="text-left">
                          <h3 className="text-[12px] font-black uppercase tracking-wider text-white leading-none">Web Document Viewer</h3>
                          <p className="text-[10px] text-slate-450 font-bold font-mono mt-1">Live MS Word A4 layout simulator</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => exportAllSectionsToWord(dashboardProjectTitle, dashboardSectionsState)}
                          className="bg-indigo-600 hover:bg-indigo-550 text-white text-[10.5px] font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh File Word (.doc)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWebDocPreview("none")}
                          className="bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white text-[10.5px] font-black px-4 py-2.5 rounded-xl transition cursor-pointer border border-slate-700"
                        >
                          Tutup Pratinjau ✕
                        </button>
                      </div>
                    </div>

                    {/* Document feed viewport simulating actual printed sheets */}
                    <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-8 bg-slate-900 scrollbar-thin flex flex-col items-center">
                      {/* PAGE 1: Corporate Cover Page */}
                      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full md:w-[210mm] min-h-[297mm] p-16 flex flex-col justify-between text-slate-800 font-sans relative aspect-[1/1.414] text-left">
                        <div className="absolute top-0 left-0 right-0 h-4 bg-indigo-650 rounded-t-lg" />
                        
                        {/* Cover Header */}
                        <div className="flex justify-between items-center text-[9px] uppercase font-mono font-black tracking-widest text-indigo-655">
                          <span>PANCARAN GROUP ENTERPRISE SERVICES</span>
                          <span>CONFIDENTIAL / INTERNAL USE ONLY</span>
                        </div>

                        {/* Cover Middle block with elegant styling */}
                        <div className="my-auto text-left border-l-4 border-emerald-500 pl-8 py-6">
                          <span className="text-[10px] font-mono tracking-widest font-black uppercase text-indigo-600 block mb-2">INTEGRATED FEASIBILITY STUDY</span>
                          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase font-display tracking-tight leading-none mb-2">
                            14 PILAR UTAMA ANALYSIS PROPOSAL & PM
                          </h1>
                          <p className="text-slate-500 font-bold font-mono text-[10px] mt-1.5 uppercase tracking-wide">
                            Sistem Formulasi & Analisis Kompherensif Proposal Strategis
                          </p>
                          
                          <div className="h-px bg-slate-200 my-8 w-1/2" />
                          
                          <span className="text-[9px] text-slate-400 font-black block font-mono">PROYEK KAJIAN / TARGET EKSPEDISI</span>
                          <div className="text-lg md:text-xl font-black text-slate-800 uppercase mt-1 leading-normal font-sans">
                            {dashboardProjectTitle || "Kajian Strategis: Forestry Management Transportation"}
                          </div>
                        </div>

                        {/* Cover Footer */}
                        <div className="border-t border-slate-200 pt-8 flex justify-between items-end text-xs text-slate-550 font-semibold font-mono">
                          <div className="text-left">
                            <div>DITERBITKAN OLEH:</div>
                            <div className="text-slate-850 font-extrabold text-[11px]">PRAMA Cognitive Advisor System</div>
                            <div className="text-[10px] text-slate-450 mt-1">{new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          </div>
                          <div className="text-right">
                            <div>DIVISI JURNAL PM:</div>
                            <div className="text-indigo-650 font-extrabold text-[11px]">PT Pancaran Group Logistics</div>
                            <div className="text-[10px] text-slate-450 mt-1">STATUS: APPROVED FOR EXPORT</div>
                          </div>
                        </div>
                      </div>

                      {/* PAGE 2: Table of Contents */}
                      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full md:w-[210mm] min-h-[297mm] p-16 flex flex-col justify-between text-slate-800 font-sans relative aspect-[1/1.414] text-left">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-650 rounded-t-lg" />
                        <div className="text-slate-450 text-[9px] uppercase tracking-wider font-mono">Daftar Isi Komprehensif • PRAMA Report</div>
                        <div className="my-auto">
                          <h2 className="text-xl md:text-2xl font-black text-indigo-900 border-b-2 border-slate-100 pb-2 mb-8 uppercase tracking-wide">DAFTAR ISI KAJIAN FORMULASI JURNAL PM</h2>
                          
                          <div className="space-y-4">
                            {defaultDashboardSections.map((sec, i) => (
                              <div key={sec.number} className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-850">{sec.number}. {sec.title}</span>
                                <div className="flex-grow border-b border-spacing-2 border-dashed border-slate-300 mx-3" />
                                <span className="font-mono font-extrabold text-indigo-700">Halaman {i + 3}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-[10px] font-mono text-slate-450 border-t pt-4">Halaman 2 dari 16</div>
                      </div>

                      {/* PAGES 3-16: Core Sections */}
                      {defaultDashboardSections.map((sec, index) => {
                        const docVal = dashboardSectionsState[sec.number] || sec.defaultContent;
                        return (
                          <div key={sec.number} className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full md:w-[210mm] min-h-[297mm] p-16 flex flex-col justify-between text-slate-800 font-sans relative aspect-[1/1.414] text-left">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-650 rounded-t-lg" />
                            
                            {/* Running head */}
                            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-450 border-b border-slate-100 pb-2 mb-6 uppercase">
                              <span>KAJIAN COMPREHENSIVE JURNAL PM: #{sec.number}</span>
                              <span>PANCARAN GROUP • PRAMA ADVISOR</span>
                            </div>

                            {/* Content Section */}
                            <div className="flex-grow text-left">
                              <span className="text-[9px] font-mono font-extrabold tracking-widest bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded uppercase border border-violet-150">BAGIAN {sec.number} DARI 14 PILAR</span>
                              <h2 className="text-lg md:text-xl font-extrabold text-indigo-900 uppercase border-b-2 border-slate-100 pb-2 mt-2 mb-4 leading-normal font-sans">
                                {sec.title}
                              </h2>
                              <div className="prose prose-sm text-slate-650 leading-relaxed font-semibold text-xs space-y-3 font-sans">
                                {docVal.split("\n").map((line, lidx) => {
                                  const trimLine = line.trim();
                                  if (!trimLine) return null;
                                  if (trimLine.startsWith("###")) {
                                    return <h4 key={lidx} className="text-[12px] font-black text-slate-800 border-b border-slate-100 pb-1 mt-4">{trimLine.replace(/^###\s*/, "")}</h4>;
                                  }
                                  if (trimLine.startsWith("* ") || trimLine.startsWith("- ")) {
                                    return (
                                      <div key={lidx} className="pl-4 border-l-2 border-emerald-500 py-0.5 my-1 text-slate-600 font-sans">
                                        ✓ {trimLine.replace(/^[\*\-]\s*/, "").replace(/\*\*/g, "")}
                                      </div>
                                    );
                                  }
                                  return <p key={lidx} className="text-justify my-1.5 font-sans">{trimLine.replace(/\*\*/g, "")}</p>;
                                })}
                              </div>
                            </div>

                            {/* Running Foot */}
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-t border-slate-100 pt-4 mt-8">
                              <span>KERAHASIAAN: SANGAT INTRA-KORPORAT</span>
                              <span>Halaman {index + 3} dari 16</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 🎬 PPT WORKSPACE PRESENTATION MODE & VOICE OVERLAY */}
              {webDocPreview === "ppt" && (
                <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between text-white font-sans text-left">
                  {/* Top Panel Control bar */}
                  <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl select-none">🎬</span>
                      <div className="text-left">
                        <span className="text-[9px] block font-black uppercase tracking-widest text-sky-400 font-mono leading-none">Presentasi Jurnal Prama</span>
                        <span className="text-[12px] font-black uppercase text-white tracking-tight mt-1 truncate max-w-sm block">{dashboardProjectTitle}</span>
                      </div>
                    </div>

                    {/* Speaking State details */}
                    {isSpeechPresenterActive && (
                      <div className="flex items-center gap-2 bg-sky-950 border border-sky-800 rounded-xl px-3.5 py-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${isPlayingSpeech ? "bg-emerald-400 animate-pulse" : "bg-slate-550"} shrink-0`} />
                        <span className="text-[10px] font-black font-mono tracking-wide text-sky-200">
                          {isPlayingSpeech ? "ASISTEN SEDANG BERBICARA..." : "ASISTEN SELESAI PAPARAN"}
                        </span>

                        {countdownTransition > 0 && (
                          <span className="text-[10px] font-black font-mono text-pink-400 ml-2 animate-pulse">
                            AUTO-NEXT BERIKUTNYA DALAM: {countdownTransition}S
                          </span>
                        )}
                      </div>
                    )}

                    {/* Controller Action set */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const active = !isSpeechPresenterActive;
                          setIsSpeechPresenterActive(active);
                          if (active) {
                            setProjectPptSlideIndex(0);
                            // trigger immediate speak
                            setTimeout(() => {
                              speakProjectPptSlide();
                            }, 450);
                          } else {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                            setIsPlayingSpeech(false);
                            setCountdownTransition(0);
                          }
                        }}
                        className={`text-[10.5px] font-black px-3.5 py-2.5 rounded-xl border transition cursor-pointer ${
                          isSpeechPresenterActive 
                            ? "bg-rose-600 text-white border-rose-500 hover:bg-rose-700" 
                            : "bg-sky-650 text-white border-sky-500 hover:bg-sky-700"
                        }`}
                      >
                        {isSpeechPresenterActive ? "🛑 Matikan Suara Asisten" : "🔊 Aktifkan Suara Asisten (TTS)"}
                      </button>

                      {/* Pitch control setting */}
                      <div className="flex items-center gap-1.5 bg-slate-850 px-2.5 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-[9px] font-black font-mono text-slate-400 leading-none">SPEED:</span>
                        <select 
                          value={speechRate}
                          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                          className="bg-transparent text-white font-mono text-[10.5px] font-black outline-none border-none py-0.5 cursor-pointer"
                        >
                          <option value="0.9" className="bg-slate-900">Slow (0.9x)</option>
                          <option value="1.1" className="bg-slate-900">Normal (1.1x)</option>
                          <option value="1.3" className="bg-slate-900">Fast (1.3x)</option>
                          <option value="1.5" className="bg-slate-900">Rapid (1.5x)</option>
                        </select>
                      </div>

                      {/* Auto-Next controller checkbox */}
                      <label className="flex items-center gap-1.5 bg-slate-850 px-3 py-2.5 rounded-xl text-[10px] font-black font-mono text-slate-300 border border-slate-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={autoNextPPT} 
                          onChange={(e) => setAutoNextPPT(e.target.checked)}
                          className="rounded border-slate-700 p-1 accent-indigo-600"
                        />
                        <span>AUTO-NEXT</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setWebDocPreview("none");
                          setIsSpeechPresenterActive(false);
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white text-[10.5px] font-black px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer"
                      >
                        ✕ Keluar
                      </button>
                    </div>
                  </div>

                  {/* Main Body deck layout split internally */}
                  <div className="flex-grow flex flex-col lg:flex-row min-h-0 bg-slate-900">
                    {/* THUMBNAILS LEFT DRAWER PANEL */}
                    <div className="w-full lg:w-64 border-r border-slate-850 overflow-y-auto max-h-[150px] lg:max-h-full p-4 space-y-2 shrink-0 bg-slate-950">
                      <span className="block text-[8.5px] font-black text-slate-500 uppercase tracking-widest font-mono mb-3">
                        Daftar Slide Dek Presentasi
                      </span>
                      <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                        {[...Array(16)].map((_, i) => {
                          const isActive = projectPptSlideIndex === i;
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                setProjectPptSlideIndex(i);
                                setCountdownTransition(0);
                              }}
                              className={`p-2 rounded-xl border transition text-left cursor-pointer ${
                                isActive 
                                  ? "bg-sky-950/60 border-sky-500 ring-2 ring-sky-900/40" 
                                  : "bg-slate-900/60 border-slate-850 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-1 text-left">
                                <span className="text-[10px] font-black font-mono text-sky-400">#{i + 1}</span>
                                <span className="text-[9px] font-bold text-slate-300 truncate tracking-tight font-sans">
                                  {i === 0 ? "Cover Utama" : i === 15 ? "Slide Penutup" : `Pilar ${i}`}
                                </span>
                              </div>
                              <div className="h-10 bg-slate-950 rounded border border-slate-850/65 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                {i === 0 ? "🏢 COVER" : i === 15 ? "★ AKHIR" : `📊 PILAR ${i}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PRESENTATION CONTAINER (aspect ratio focused) */}
                    <div className="flex-grow flex items-center justify-center p-6 md:p-12 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 relative">
                      <div className="aspect-[16/9] w-full max-w-4xl bg-white text-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl flex flex-col justify-between border-4 border-slate-850 relative">
                        {/* Embedded slide progress indicator */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-xl overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-400 to-indigo-600 transition-all duration-305"
                            style={{ width: `${((projectPptSlideIndex + 1) / 16) * 100}%` }}
                          />
                        </div>

                        {projectPptSlideIndex === 0 ? (
                          /* Slide 0: Executive Cover page */
                          <div className="my-auto text-left border-l-4 border-sky-500 pl-8 py-4">
                            <span className="text-[10px] font-mono tracking-widest font-black text-sky-650 block mb-2 uppercase select-none">14 STRATEGIC ANALYSIS PILARS DECK</span>
                            <h1 className="text-2xl md:text-5xl font-black text-slate-900 uppercase leading-none tracking-tight font-display mb-2 text-slate-850">
                              STUDI KELAYAKAN KOMPREHENSIF
                            </h1>
                            <p className="text-slate-505 text-xs mt-3 uppercase font-mono font-bold">
                              Mitra Prama Advisor & PT Pancaran Group
                            </p>
                            <div className="h-px bg-slate-200 my-6 md:my-8 w-1/3" />
                            <span className="text-[9px] font-black text-slate-400 block font-mono">PROYEK KAJIAN / TARGET EKSPEDISI</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-800 uppercase block mt-1 leading-snug font-sans">
                              {dashboardProjectTitle || "Kajian Strategis: Forestry Management Transportation"}
                            </span>
                          </div>
                        ) : projectPptSlideIndex === 15 ? (
                          /* Slide 15: Thank You Closing */
                          <div className="my-auto text-center flex flex-col items-center">
                            <span className="text-3xl animate-bounce mb-3 select-none font-sans">★</span>
                            <span className="text-[10px] font-mono font-black tracking-widest text-emerald-655 uppercase block mb-1">PRESENTASI SELESAI</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight font-sans">TERIMA KASIH</h2>
                            <p className="text-slate-505 text-xs font-bold font-mono mt-3 uppercase tracking-wider">
                              Semoga Rencana Transisi & Ekspedisi Sukses Bersama
                            </p>
                            <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-505 w-32 mt-6 rounded-full" />
                          </div>
                        ) : (
                          /* Slides 1-14: Core Pillars specifications */
                          (() => {
                            const sec = defaultDashboardSections[projectPptSlideIndex - 1];
                            const slideVal = dashboardSectionsState[sec.number] || sec.defaultContent;
                            return (
                              <div className="flex-grow flex flex-col justify-between text-left h-full">
                                {/* Slide Title block */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2 shrink-0">
                                    <span className="text-[9px] font-mono font-black text-white bg-slate-900 border border-slate-700 px-2 py-0.5 rounded leading-none">
                                      SLIDE PILAR #{sec.number}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 font-mono tracking-tight leading-none">
                                      PT PANCARAN GROUP LOGISTICS
                                    </span>
                                  </div>
                                  
                                  <h2 className="text-lg md:text-xl font-black text-indigo-900 uppercase leading-snug tracking-tight mt-1.5 font-sans">
                                    {sec.title}
                                  </h2>
                                  <p className="text-[11px] text-slate-500 mt-1 font-bold leading-normal">
                                    {sec.shortDesc}
                                  </p>
                                </div>

                                {/* Middle Bullet lists */}
                                <div className="my-3 flex-grow overflow-y-auto max-h-[140px] md:max-h-[220px] pr-2 scrollbar-thin text-left">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {slideVal.split("\n")
                                      .map(l => l.trim())
                                      .filter(l => l.length > 0 && !l.startsWith("###"))
                                      .slice(0, 4)
                                      .map((bullet, bIdx) => (
                                        <div key={bIdx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex gap-2.5 items-start font-sans shadow-sm">
                                          <span className="text-sky-500 font-black text-[11px] shrink-0 mt-0.5 font-sans">✓</span>
                                          <p className="text-[10px] md:text-[11px] font-bold text-slate-650 m-0 leading-normal text-left font-sans">
                                            {bullet.replace(/^\*\s*/, "").replace(/^-\s*/, "").replace(/\*\*/g, "")}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* Running footprint */}
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-400 shrink-0 select-none">
                                  <span>PRAMA COGNITIVE ASSISTANT SLIDESHOW</span>
                                  <span>Halaman {projectPptSlideIndex + 1} dari 16</span>
                                </div>
                              </div>
                            );
                          })()
                        )}

                        {/* Left & Right quick touch keys inside slide container */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0">
                          <button 
                            type="button"
                            disabled={projectPptSlideIndex === 0}
                            onClick={() => {
                              setProjectPptSlideIndex(prev => Math.max(0, prev - 1));
                              setCountdownTransition(0);
                            }}
                            className="h-10 w-10 rounded-full bg-slate-900/5 hover:bg-slate-900/10 text-slate-650 flex items-center justify-center cursor-pointer transition border border-transparent disabled:opacity-25"
                          >
                            ◀
                          </button>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0">
                          <button 
                            type="button"
                            disabled={projectPptSlideIndex === 15}
                            onClick={() => {
                              setProjectPptSlideIndex(prev => Math.min(15, prev + 1));
                              setCountdownTransition(0);
                            }}
                            className="h-10 w-10 rounded-full bg-slate-900/5 hover:bg-slate-900/10 text-slate-650 flex items-center justify-center cursor-pointer transition border border-transparent disabled:opacity-25"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom simple footer status bar */}
                  <div className="bg-slate-900 border-t border-slate-800 text-[9.5px] text-slate-500 text-center py-2.5 font-mono select-none">
                    ASISTEN KOGNITIF & PRESENTASI SUARA MANDIRI &bull; TEXT-TO-SPEECH INDONESIAN ENGINE &bull; PT PANCARAN GROUP
                  </div>
                </div>
              )}
            </div>
          ) : dashboardView === "chat_intelligence" ? (
            <div className="max-w-6xl mx-auto text-left bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full min-h-[680px] flex flex-col transition-all duration-300">
              {/* Header */}
              <div className="bg-slate-900 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 font-extrabold border border-cyan-800 text-sm shadow-inner shadow-black/80">
                    📊
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wider uppercase leading-none text-white flex items-center gap-2">
                      DASHBOARD CHAT INTELLIGENCE & BUSINESS INTELLIGENCE (BI)
                      <span className="text-[8px] font-bold font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-700 uppercase leading-none">
                        COGNITIVE REPORT
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest font-bold mt-1 uppercase">
                      INTEGRASI REKOMENDASI ASISTEN & ANALISIS SIMULASI WORKBENCH
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                  <button
                    onClick={handleSyncChatToBI}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10.5px] font-black rounded-xl transition shadow-md active:scale-97 cursor-pointer"
                    title="Ambil rekomendasi teranyar dari chat asisten di sebelah kiri"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-slate-950" />
                    <span>Sinkronisasi Data Chat</span>
                  </button>

                  <button
                    onClick={() => {
                      exportChatBIToWord(chatBIState);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-black rounded-xl transition shadow-md active:scale-97 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-white" />
                    <span>Unduh Word (.doc)</span>
                  </button>

                  <button
                    onClick={async () => {
                      await exportChatBIToPPTX(chatBIState);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-605 bg-indigo-600 hover:bg-indigo-500 text-white text-[10.5px] font-black rounded-xl transition shadow-md active:scale-97 cursor-pointer"
                  >
                    <Presentation className="h-3.5 w-3.5 text-white" />
                    <span>Unduh PPTX Slides</span>
                  </button>

                  <button
                    onClick={() => {
                      setDashboardView("divisions");
                    }}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 active:scale-97 text-slate-200 text-[10.5px] font-black px-3.5 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Kembali ke Divisi</span>
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-slate-50 p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                {/* 1. PROJECT TITLE EDIT & METRICS ROW */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Judul Kajian BI Percakapan</label>
                      <input
                        type="text"
                        value={chatBIState.projectTitle}
                        onChange={(e) => setChatBIState(prev => ({ ...prev, projectTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-cyan-500"
                        placeholder="Nama Proyek Kajian"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Perusahaan Sasaran</label>
                      <input
                        type="text"
                        value={chatBIState.targetCompany}
                        onChange={(e) => setChatBIState(prev => ({ ...prev, targetCompany: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-cyan-500"
                      />
                    </div>
                  </div>

                  {/* KPI Row */}
                  {(() => {
                    const calc = calculateBIAnalysis(chatBIState);
                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-850 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">CAPEX INVESTASI AWAL</span>
                          <span className="text-xl font-extrabold text-cyan-400 my-1">Rp {(chatBIState.initialCapex / 1000).toFixed(2)} Miliar</span>
                          <span className="text-[9.5px] font-mono text-slate-450 text-slate-400">Rp {chatBIState.initialCapex.toLocaleString()} Juta</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">MANFAAT TAHUNAN</span>
                          <span className="text-xl font-extrabold text-emerald-600 my-1">Rp {(calc.annualBenefit / 1000).toFixed(2)} Miliar</span>
                          <span className="text-[9.5px] text-slate-500">Kombinasi Ops & Kenaikan Sales</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">PAYBACK PERIOD (PBP)</span>
                          <span className="text-xl font-extrabold text-slate-800 my-1">{calc.paybackPeriod} Tahun</span>
                          <span className="text-[9.5px] text-slate-500 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 text-emerald-750 leading-none inline-block">Sangat Layak</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                          <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">ROI PROYEKSI (3 TAHUN)</span>
                          <span className="text-xl font-extrabold text-indigo-600 my-1">{calc.roiPercentage3Years}%</span>
                          <span className="text-[9.5px] text-slate-500">Nilai Bersih: Rp {(calc.netBenefit3Years / 1000).toFixed(2)} Miliar</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. SANDBOX WORKBENCH SLIDERS & RECHARTS GRAPHS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Sliders workbench */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Wallet className="h-4 w-4 text-cyan-600" />
                        Finansial Sandbox Simulation
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mb-2 leading-normal">
                        Geser parameter untuk mensimulasikan kelayakan finansial dari rincian chat asisten secara realtime.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Slider 1: CAPEX */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Investasi Awal (CAPEX)</span>
                          <span className="text-cyan-700">Rp {(chatBIState.initialCapex / 1000).toFixed(1)} Miliar</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="20000"
                          step="100"
                          value={chatBIState.initialCapex}
                          onChange={(e) => setChatBIState(prev => ({ ...prev, initialCapex: parseInt(e.target.value) }))}
                          className="w-full accent-cyan-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider 2: Annual Savings */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Target Penghematan Ops / Tahun</span>
                          <span className="text-emerald-700">Rp {(chatBIState.annualSavings / 1000).toFixed(1)} Miliar</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="10000"
                          step="50"
                          value={chatBIState.annualSavings}
                          onChange={(e) => setChatBIState(prev => ({ ...prev, annualSavings: parseInt(e.target.value) }))}
                          className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Slider 3: Sales Increase */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Peningkatan Penjualan Baru / Tahun</span>
                          <span className="text-indigo-700">Rp {(chatBIState.salesIncrease / 1000).toFixed(1)} Miliar</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="10000"
                          step="50"
                          value={chatBIState.salesIncrease}
                          onChange={(e) => setChatBIState(prev => ({ ...prev, salesIncrease: parseInt(e.target.value) }))}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10px] text-slate-500 font-bold leading-normal">
                      💡 <span className="text-slate-700">Tips Operasional B3:</span> Semakin rendah investasi alat sensor IoT dikombinasikan dengan sertifikasi internal supir tangki mandiri, payback period investasi akan meluncur di bawah <span className="text-cyan-600">2.0 Tahun</span>!
                    </div>
                  </div>

                  {/* ReCharts representation */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm min-h-[300px] flex flex-col justify-between">
                    <div>
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider mb-2">
                        PROYEKSI AKUMULASI PENGHEMATAN & ARUS KAS (5 TAHUN)
                      </h4>
                    </div>

                    <div className="w-full h-56 select-none border border-slate-100 rounded-xl p-2 bg-slate-50">
                      {(() => {
                        const calc = calculateBIAnalysis(chatBIState);
                        const benefit = calc.annualBenefit;
                        const chartData = [
                          { year: "Mulai", "Kas Kumulatif": -chatBIState.initialCapex, "Manfaat": 0 },
                          { year: "Thn 1", "Kas Kumulatif": benefit - chatBIState.initialCapex, "Manfaat": benefit },
                          { year: "Thn 2", "Kas Kumulatif": (benefit * 2) - chatBIState.initialCapex, "Manfaat": benefit * 2 },
                          { year: "Thn 3", "Kas Kumulatif": (benefit * 3) - chatBIState.initialCapex, "Manfaat": benefit * 3 },
                          { year: "Thn 4", "Kas Kumulatif": (benefit * 4) - chatBIState.initialCapex, "Manfaat": benefit * 4 },
                          { year: "Thn 5", "Kas Kumulatif": (benefit * 5) - chatBIState.initialCapex, "Manfaat": benefit * 5 },
                        ];

                        return (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorBenefit" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                              <XAxis dataKey="year" stroke="#64748B" fontSize={10} fontWeight="bold" />
                              <YAxis stroke="#64748B" fontSize={10} />
                              <ReChartsTooltip formatter={(value: number) => `Rp ${value.toLocaleString()} Jt`} />
                              <ReChartsLegend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                              <Area type="monotone" name="Kas Kumulatif (Jt)" dataKey="Kas Kumulatif" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCash)" />
                              <Area type="monotone" name="Manfaat Akumulatif (Jt)" dataKey="Manfaat" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBenefit)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* 3. SWOT ANALYSIS GRID INTERACTIVE EDITORS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="h-4 w-4 text-emerald-600" />
                      Strategic SWOT Matrix Editor
                    </h4>
                    <span className="text-[9px] font-extrabold text-slate-400-custom text-slate-400">INPUT BARU & LIHAT PERUBAHAN INSTAN</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-green-50/50 border border-green-200 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-wide block mb-3 font-display">STRENGTHS (KEKUATAN INTERNAL)</span>
                        <div className="space-y-2">
                          {chatBIState.swot.strengths.map((str, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-green-150 text-[11px] text-slate-700 font-bold shadow-xs">
                              <span className="line-clamp-2">{str}</span>
                              <button
                                onClick={() => setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, strengths: prev.swot.strengths.filter((_, i) => i !== idx) }
                                }))}
                                className="text-red-500 hover:text-red-700 text-xs shrink-0 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-200/50 flex gap-2">
                        <input
                          type="text"
                          id="new-strength-input"
                          placeholder="Tambah muatan kekuatan..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, strengths: [...prev.swot.strengths, input.value.trim()] }
                                }));
                                input.value = "";
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 bg-white border border-green-200 text-[10.5px] font-semibold rounded-lg text-slate-800"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("new-strength-input") as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setChatBIState(prev => ({
                                ...prev,
                                swot: { ...prev.swot, strengths: [...prev.swot.strengths, input.value.trim()] }
                              }));
                              input.value = "";
                            }
                          }}
                          className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wide block mb-3 font-display">WEAKNESSES (KELEMAHAN INTERNAL)</span>
                        <div className="space-y-2">
                          {chatBIState.swot.weaknesses.map((weak, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-red-150 text-[11px] text-slate-700 font-bold shadow-xs">
                              <span className="line-clamp-2">{weak}</span>
                              <button
                                onClick={() => setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, weaknesses: prev.swot.weaknesses.filter((_, i) => i !== idx) }
                                }))}
                                className="text-red-500 hover:text-red-700 text-xs shrink-0 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-red-200/50 flex gap-2">
                        <input
                          type="text"
                          id="new-weakness-input"
                          placeholder="Tambah kelemahan internal..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, weaknesses: [...prev.swot.weaknesses, input.value.trim()] }
                                }));
                                input.value = "";
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 bg-white border border-red-200 text-[10.5px] font-semibold rounded-lg text-slate-800"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("new-weakness-input") as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setChatBIState(prev => ({
                                ...prev,
                                swot: { ...prev.swot, weaknesses: [...prev.swot.weaknesses, input.value.trim()] }
                              }));
                              input.value = "";
                            }
                          }}
                          className="bg-red-650 bg-red-600 hover:bg-red-550 text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide block mb-3 font-display">OPPORTUNITIES (PELUANG EKSTERNAL)</span>
                        <div className="space-y-2">
                          {chatBIState.swot.opportunities.map((opp, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-blue-150 text-[11px] text-slate-700 font-bold shadow-xs">
                              <span className="line-clamp-2">{opp}</span>
                              <button
                                onClick={() => setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, opportunities: prev.swot.opportunities.filter((_, i) => i !== idx) }
                                }))}
                                className="text-red-500 hover:text-red-700 text-xs shrink-0 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-200/50 flex gap-2">
                        <input
                          type="text"
                          id="new-opportunity-input"
                          placeholder="Tambah peluang baru..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, opportunities: [...prev.swot.opportunities, input.value.trim()] }
                                }));
                                input.value = "";
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 bg-white border border-blue-200 text-[10.5px] font-semibold rounded-lg text-slate-800"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("new-opportunity-input") as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setChatBIState(prev => ({
                                ...prev,
                                swot: { ...prev.swot, opportunities: [...prev.swot.opportunities, input.value.trim()] }
                              }));
                              input.value = "";
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Threats */}
                    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wide block mb-3 font-display">THREATS (ANCAMAN RISIKO)</span>
                        <div className="space-y-2">
                          {chatBIState.swot.threats.map((thr, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-amber-150 text-[11px] text-slate-700 font-bold shadow-xs">
                              <span className="line-clamp-2">{thr}</span>
                              <button
                                onClick={() => setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, threats: prev.swot.threats.filter((_, i) => i !== idx) }
                                }))}
                                className="text-red-500 hover:text-red-700 text-xs shrink-0 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-amber-200/50 flex gap-2">
                        <input
                          type="text"
                          id="new-threat-input"
                          placeholder="Tambah ancaman risiko..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setChatBIState(prev => ({
                                  ...prev,
                                  swot: { ...prev.swot, threats: [...prev.swot.threats, input.value.trim()] }
                                }));
                                input.value = "";
                              }
                            }
                          }}
                          className="flex-1 px-2 py-1 bg-white border border-amber-200 text-[10.5px] font-semibold rounded-lg text-slate-800"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("new-threat-input") as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setChatBIState(prev => ({
                                ...prev,
                                swot: { ...prev.swot, threats: [...prev.swot.threats, input.value.trim()] }
                              }));
                              input.value = "";
                            }
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. ACTIONABLE RECOMMENDATIONS EDITOR */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Grid className="h-4 w-4 text-cyan-600" />
                      Rincian Dokumen & Rekomendasi Program Strategis
                    </h4>
                    <span className="text-[9.5px] font-extrabold text-cyan-600 tracking-wider">EDIT TEKS REKOMENDASI TERSEMBUNYI SECARA INLINE</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chatBIState.recommendations.map((rec, idx) => (
                      <div key={rec.id} className="border border-slate-200 bg-slate-50/50 rounded-xl p-4 space-y-3 shadow-xs">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 text-[8px] font-mono font-black tracking-widest bg-cyan-100 text-cyan-800 rounded uppercase border border-cyan-200">
                            Rekomendasi #{idx + 1}
                          </span>
                          <button
                            onClick={() => setChatBIState(prev => ({
                              ...prev,
                              recommendations: prev.recommendations.filter(r => r.id !== rec.id)
                            }))}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition"
                          >
                            Hapus Program
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Judul Program</label>
                          <input
                            type="text"
                            value={rec.title}
                            onChange={(e) => {
                              const titleVal = e.target.value;
                              setChatBIState(prev => ({
                                ...prev,
                                recommendations: prev.recommendations.map(r => r.id === rec.id ? { ...r, title: titleVal } : r)
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg focus:outline-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Kategori</label>
                            <select
                              value={rec.category}
                              onChange={(e) => {
                                const catVal = e.target.value;
                                setChatBIState(prev => ({
                                  ...prev,
                                  recommendations: prev.recommendations.map(r => r.id === rec.id ? { ...r, category: catVal } : r)
                                }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg"
                            >
                              <option value="Digital">Digital</option>
                              <option value="Operasional">Operasional</option>
                              <option value="SDM">SDM</option>
                              <option value="Risiko">Risiko</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Skala Dampak</label>
                            <select
                              value={rec.impact}
                              onChange={(e) => {
                                const impVal = e.target.value as "High" | "Medium" | "Low";
                                setChatBIState(prev => ({
                                  ...prev,
                                  recommendations: prev.recommendations.map(r => r.id === rec.id ? { ...r, impact: impVal } : r)
                                }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg"
                            >
                              <option value="High">Tinggi (High)</option>
                              <option value="Medium">Sedang (Medium)</option>
                              <option value="Low">Rendah (Low)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alokasi Biaya (Rp Juta)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="10"
                              max="1500"
                              step="10"
                              value={rec.cost}
                              onChange={(e) => {
                                const costVal = parseInt(e.target.value);
                                setChatBIState(prev => ({
                                  ...prev,
                                  recommendations: prev.recommendations.map(r => r.id === rec.id ? { ...r, cost: costVal } : r)
                                }));
                              }}
                              className="flex-1 accent-cyan-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-[11px] font-bold text-slate-600 font-mono w-14 text-right">{rec.cost} Jt</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deskripsi Lengkap Tindakan</label>
                          <textarea
                            value={rec.description}
                            rows={3}
                            onChange={(e) => {
                              const descVal = e.target.value;
                              setChatBIState(prev => ({
                                ...prev,
                                recommendations: prev.recommendations.map(r => r.id === rec.id ? { ...r, description: descVal } : r)
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-[11px] leading-relaxed text-slate-600 rounded-lg focus:outline-cyan-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const newId = `rec-${Date.now()}`;
                        setChatBIState(prev => ({
                          ...prev,
                          recommendations: [
                            ...prev.recommendations,
                            {
                              id: newId,
                              title: "Program Tambahan Baru",
                              category: "Operasional",
                              description: "Deskripsi program strategis tambahan yang dipetakan dari asisten logistik PRAMA Advisor.",
                              impact: "Medium",
                              cost: 200
                            }
                          ]
                        }));
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-lg transition tracking-wide cursor-pointer"
                    >
                      + Tambah Rekomendasi Program Strategis
                    </button>
                  </div>
                </div>

                {/* 5. IMPLEMENTATION TIMELINE PLANNER */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider">
                    Roadmap & Milestone Tahapan Implementasi Lapangan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {chatBIState.timeline.map((step, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 relative flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[8.5px] font-mono font-black text-cyan-600 tracking-wider">TAHAPAN #{idx + 1}</span>
                            <input
                              type="text"
                              value={step.duration}
                              onChange={(e) => {
                                const durVal = e.target.value;
                                setChatBIState(prev => ({
                                  ...prev,
                                  timeline: prev.timeline.map((item, i) => i === idx ? { ...item, duration: durVal } : item)
                                }));
                              }}
                              className="px-1.5 py-0.5 bg-white text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 rounded text-center w-20"
                            />
                          </div>

                          <div>
                            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase leading-none block">Fase Program</span>
                            <input
                              type="text"
                              value={step.phase}
                              onChange={(e) => {
                                const phVal = e.target.value;
                                setChatBIState(prev => ({
                                  ...prev,
                                  timeline: prev.timeline.map((item, i) => i === idx ? { ...item, phase: phVal } : item)
                                }));
                              }}
                              className="mt-1 w-full px-1.5 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-md"
                            />
                          </div>

                          <div>
                            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase leading-none block">Aktivitas Utama</span>
                            <textarea
                              value={step.task}
                              rows={3}
                              onChange={(e) => {
                                const taskVal = e.target.value;
                                setChatBIState(prev => ({
                                  ...prev,
                                  timeline: prev.timeline.map((item, i) => i === idx ? { ...item, task: taskVal } : item)
                                }));
                              }}
                              className="mt-1 w-full px-1.5 py-1 bg-white border border-slate-200 text-[10.5px] text-slate-600 rounded-md animate-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 mt-3">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase">Milestone / Luaran</span>
                          <input
                            type="text"
                            value={step.deliverable}
                            onChange={(e) => {
                              const delVal = e.target.value;
                              setChatBIState(prev => ({
                                ...prev,
                                timeline: prev.timeline.map((item, i) => i === idx ? { ...item, deliverable: delVal } : item)
                              }));
                            }}
                            className="mt-1 w-full px-1.5 py-1 bg-white border border-slate-200 text-[10.5px] font-bold text-emerald-700 rounded-md"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-900 border-t border-slate-800 text-[9.5px] text-slate-500 text-center py-2.5 font-mono select-none">
                PT PANCARAN GROUP COGNITIVE BUSINESS INTELLIGENCE SYSTEM &bull; GENERATIVE CLIENT-SIDE DASHBOARD
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
                    className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-300 ${
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
                          className="w-full flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-bold transition shadow-sm bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
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
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 cursor-pointer hover:border-emerald-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
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
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 cursor-pointer hover:border-indigo-400 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
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

              {/* Standalone custom card for Dashboard Project Management (Modul Jurnal) */}
              <div
                onClick={() => {
                  setDashboardView("project_dashboard");
                }}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 cursor-pointer hover:border-violet-500 shadow-sm hover:shadow-lg hover:-translate-y-0.5 animate-none"
              >
                <div className="space-y-4">
                  {/* Header: Icon and Division Code */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl transition bg-violet-50 text-violet-800 border border-violet-100 shadow-sm font-bold">
                      <LayoutDashboard className="h-5 w-5 text-violet-500" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-black tracking-widest bg-violet-50 text-violet-650 px-2 py-0.5 rounded border border-violet-200 uppercase">
                        MODUL JURNAL
                      </span>
                    </div>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h4 className="font-display font-extrabold text-sm leading-snug transition text-slate-800 group-hover:text-violet-700">
                      Dashboard Formulasi Jurnal PM
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide line-clamp-1 uppercase">
                      KAJIAN KELAYAKAN PROYEK 14 PILAR
                    </p>
                  </div>

                  {/* Quick profile info */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">MITRA PM ADVISOR</span>
                    <p className="text-[10px] text-slate-500 leading-normal font-bold mt-1 line-clamp-4 italic">
                      &quot;Simulasi kelayakan investasi, pemetaan supply-demand, struktur tim kerja, transition model, analisis resiko, competitor landscape, dan perhitungan LTV/CAC.&quot;
                    </p>
                  </div>
                </div>

                {/* Standalone Button */}
                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDashboardView("project_dashboard");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black tracking-wide transition shadow-sm bg-violet-50 border border-violet-100 hover:bg-violet-600 hover:text-white text-violet-700 cursor-pointer hover:scale-101"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-violet-500 group-hover:text-white" />
                    <span>Akses Dashboard Jurnal PM</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-800 font-extrabold shadow-inner shrink-0 leading-none group-hover:bg-violet-700 group-hover:text-slate-100 ml-1">
                      AKTIF
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
                let cleanedKey = (key || "").trim();
                if ((cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) || (cleanedKey.startsWith("'") && cleanedKey.endsWith("'"))) {
                  cleanedKey = cleanedKey.substring(1, cleanedKey.length - 1).trim();
                }
                setClientApiKey(cleanedKey);
                localStorage.setItem("workspace_client_api_key", cleanedKey);
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
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fade-in text-slate-800 transition-all duration-300 ${isPptFullscreen ? "bg-[#020617] p-1 sm:p-2" : "bg-[#030712]/95"}`}>
          <div className={`flex flex-col w-full shadow-2xl overflow-hidden border transition-all duration-300 ${isPptFullscreen ? "max-w-[98vw] h-[96vh] bg-slate-900 border-slate-800 shadow-slate-950/90 rounded-3xl" : "bg-white max-w-7xl border-slate-200 rounded-[2rem]"}`}>
            {/* Header toolbar */}
            <div className={`px-6 sm:px-8 py-4 sm:py-5 border-b flex items-center justify-between transition-all ${isPptFullscreen ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border ${isPptFullscreen ? "bg-slate-900 border-slate-800 text-[#00D285]" : "bg-blue-50 border-blue-100 text-blue-600"}`}>
                  <Presentation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider font-display ${isPptFullscreen ? "text-white" : "text-slate-800"}`}>
                    {isPptFullscreen ? "MODUS PRESENTASI UTAMA (THEATER MODE)" : "SLIDE SHOW & INTERACTIVE PREVIEW"}
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{pptPreview.fileName.toUpperCase()}.PPTX</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Visual state pill for TTS autoplay */}
                {isTtsAutoplay && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    AUTOPLAY ACTIVE
                  </span>
                )}
                
                {!isPptFullscreen && (
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
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#0082FB] hover:bg-[#0072DF] text-white border-none rounded-full transition-all cursor-pointer shadow-md shadow-blue-100 disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Unduh PPTX</span>
                  </button>
                )}

                <button
                  onClick={() => setIsPptFullscreen(prev => !prev)}
                  className={`h-9 items-center gap-1.5 px-3 rounded-full border transition flex text-xs font-bold cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-200"}`}
                  title="Toggle Layar Penuh"
                >
                  {isPptFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4 text-[#00D285]" />
                      <span className="hidden sm:inline">Keluar Layar Penuh</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4 text-[#00D285]" />
                      <span className="hidden sm:inline">Layar Penuh</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setPptPreview(null)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full transition cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"}`}
                >
                  <X className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Main Interactive Screen with 16:9 canvas and Speaker notes */}
            <div className={`flex-1 overflow-y-auto flex flex-col lg:flex-row items-stretch justify-center gap-6 transition-all ${isPptFullscreen ? "bg-slate-950 p-4 lg:p-5" : "bg-[#0B0F19] p-6 lg:p-7"}`}>
              
              {/* Left Column: Projector slide backdrop container (80% Width for focus) */}
              <div className="w-full lg:w-[80%] flex flex-col justify-center items-center">
                <div className={`w-full aspect-[16/9] bg-white rounded-2xl shadow-2xl border flex overflow-hidden relative group transition-all duration-300 ${isPptFullscreen ? "max-w-[100%] max-h-[65vh] border-slate-800" : "border-slate-800/20"}`}>
                  {activeSlideIndex === 0 ? (
                    // TITLE COVER SLIDE STYLE (MATCHES SLIDE 1)
                    (() => {
                      const rawTitle = pptPreview.title || "";
                      const cleanTitle = rawTitle
                        .replace(/^KAJIAN STRATEGIS KOMPREHENSIF:\s*/i, "")
                        .replace(/^Presentasi_Kajian_/gi, "")
                        .replace(/^Presentasi\s+Kajian\s+/gi, "")
                        .replace(/^Presentasi\s+/gi, "")
                        .replace(/^Kajian\s+/gi, "")
                        .replace(/Presentasi Kajian Kajian/gi, "Presentasi Kajian")
                        .replace(/Kajian Kajian/gi, "Kajian")
                        .replace(/Presentasi Presentasi/gi, "Presentasi")
                        .replace(/Presentasi Kajian/gi, "")
                        .replace(/Presentasi/gi, "")
                        .replace(/Kajian/gi, "")
                        .trim();

                      return (
                        <div className="flex-1 flex flex-col justify-center items-start bg-[#06152B] p-8 sm:p-12 text-left select-none relative w-full h-full">
                          {/* Vibrant Green Border */}
                          <div className="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm" />
                          
                          <div className="text-[10px] font-mono font-black text-[#00D285] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                            <span>✦ PRAMA COGNITIVE PORTAL</span>
                            <span>•</span>
                            <span>{cleanTitle.toUpperCase()}</span>
                          </div>
                          
                          <h1 className="text-white text-xl sm:text-2xl lg:text-3.5xl font-extrabold max-w-3xl uppercase tracking-tight leading-tight select-text">
                            KAJIAN STRATEGIS KOMPREHENSIF: {cleanTitle.toUpperCase()}
                          </h1>
                          
                          <div className="h-0.5 w-16 bg-[#00D285] my-4 sm:my-5" />
                          
                          <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                            Kajian Komprehensif Skema Strategis &amp; Operasional {cleanTitle} PT Pancaran Group Berdasarkan Rekomendasi PRAMA AI Advisor
                          </p>
                          
                          <div className="mt-6 sm:mt-8 space-y-1 text-left text-[#00D285] font-mono font-bold text-[9px] uppercase tracking-wider">
                            <div>PROYEK: {cleanTitle.toUpperCase()}</div>
                            <div>UNIT DIREKTORAT: {(activeDivision || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}</div>
                            <div>KLASIFIKASI: TERBATAS / INTERNAL PT PANCARAN GROUP</div>
                          </div>
                        </div>
                      );
                    })()
                  ) : activeSlideIndex === pptPreview.slides.length + 1 ? (
                    // THANK YOU / PENUTUP SLIDE STYLE (MATCHES SLIDE 17)
                    <div className="flex-1 flex flex-col justify-center items-center bg-[#06152B] p-8 sm:p-12 text-center select-none relative">
                      {/* Vibrant Green Border */}
                      <div className="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm" />
                      
                      <h1 className="text-white text-3xl sm:text-5xl font-black tracking-widest leading-none mb-3 animate-pulse">
                        TERIMA KASIH
                      </h1>
                      
                      <h3 className="text-[#00D285] font-mono font-bold text-xs sm:text-sm uppercase tracking-wide mb-6 sm:mb-8">
                        Sistem Dokumentasi Strategis & Operasional Terintegrasi
                      </h3>
                      
                      <div className="mt-4 sm:mt-6 text-slate-400 font-mono text-[9px] sm:text-xs tracking-wide leading-relaxed">
                        <div>✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor</div>
                        <div className="text-[#00D285] font-semibold mt-1">PT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF</div>
                      </div>
                    </div>
                  ) : (
                    // BENTO SPLIT LAYOUT CONTENT SLIDE STYLE
                    (() => {
                      const currentSlide = pptPreview.slides[activeSlideIndex - 1];
                      
                      const cleanLead = (txt: string) => {
                        if (!txt) return "";
                        return txt.trim()
                          .replace(/^[-*•\s+]+/g, "") // strip leading bullet or list markers
                          .trim();
                      };

                      let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
                      let bPoints = currentSlide?.bullets || [];
                      if (currentSlide?.bullets && currentSlide.bullets.length > 0) {
                        if (currentSlide.bullets.length >= 3) {
                          introPara = cleanLead(currentSlide.bullets[0]);
                          bPoints = currentSlide.bullets.slice(1);
                        } else {
                          bPoints = currentSlide.bullets;
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
                        <div className="w-full h-full flex flex-col md:flex-row bg-white text-slate-800 relative overflow-hidden">
                          {/* Solid Top Accent Green Bar */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00D285] z-10" />

                          {/* Left half: Content & Bullets */}
                          <div className="w-full md:w-7/12 h-full flex flex-col justify-between p-5 sm:p-7 md:p-9 relative overflow-hidden z-10">
                            <div className="space-y-2.5 pt-1.5 shrink-0">
                              {/* Header row */}
                              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center w-full pb-1 shrink-0">
                                <span>{pptPreview.fileName.toUpperCase()}</span>
                                <span className="text-[#00D285] font-extrabold">SEKTOR: {(activeDivision || "UMUM").toUpperCase() + " & BD"}</span>
                              </div>
                              
                              <div className="h-[1px] bg-slate-100 w-full shrink-0" />

                              <div className="text-[10px] font-bold text-[#00D285] font-mono uppercase tracking-widest pt-1 shrink-0">
                                KAJIAN STRATEGIS: BAB {activeSlideIndex}
                              </div>
                              
                              <h2 className="text-slate-900 font-extrabold text-base sm:text-lg md:text-[20px] leading-tight select-text shrink-0">
                                {currentSlide?.title}
                              </h2>
                              
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed pb-1 select-text shrink-0">
                                {introPara.replace(/\*\*/g, "")}
                              </p>

                              <div className="space-y-1.5 shrink-0 max-h-[140px] overflow-y-auto">
                                {bPoints.map((bulletText, bIdx) => {
                                  const bulletClean = cleanLead(bulletText);
                                  if (!bulletClean) return null;
                                  return (
                                    <div key={bIdx} className="flex gap-2 items-start pl-0.5 shrink-0">
                                      <span className="text-[#00D285] mt-0.5 shrink-0 font-extrabold select-none text-[10px] sm:text-xs">•</span>
                                      <p className="text-[10.5px] sm:text-xs text-slate-655 font-medium leading-relaxed select-text shrink-0">
                                        {formatBulletText(bulletClean)}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Footer row */}
                            <div className="text-[8px] font-mono font-bold text-slate-400 border-t border-slate-100 pt-2 w-full flex justify-between items-center mt-2 shrink-0">
                              <span>PANCARAN GROUP &bull; CONFIDENTIAL DOCUMENTATION</span>
                              <span className="text-slate-700 font-bold uppercase w-max tracking-wide">HALAMAN {activeSlideIndex + 1} DARI {pptPreview.slides.length + 2}</span>
                            </div>
                          </div>

                          {/* Right half: Photo Frame */}
                          <div className="w-full md:w-5/12 h-full bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center p-5 border-l border-slate-100">
                            <div className="w-full h-full flex flex-col justify-center items-center gap-1.5">
                              {/* Photo framed with green border */}
                              <div className="w-full h-[85%] border border-[#00D285] p-1 bg-white shadow-sm relative overflow-hidden rounded-md flex items-center justify-center">
                                <PramaAnimatedIllustration 
                                  slideTitle={currentSlide?.title || "Kajian Proyek PRAMA"} 
                                  slideIndex={activeSlideIndex} 
                                />
                              </div>
                              <span className="text-[8px] text-slate-400 italic font-bold tracking-wide text-center uppercase shrink-0">
                                ILUSTRASI STRATEGIS: {currentSlide?.title ? currentSlide.title.slice(0, 30) : "PRAMA ANALISA"}...
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
                    onClick={() => {
                      // Turn off autoplay on manual navigation to allow users to investigate
                      setIsTtsAutoplay(false);
                      stopTtsAndTimers();
                      setActiveSlideIndex(prev => Math.max(0, prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Right navigation arrow on-slide */}
                  <button
                    disabled={activeSlideIndex === pptPreview.slides.length + 1}
                    onClick={() => {
                      // Turn off autoplay on manual navigation to allow users to investigate
                      setIsTtsAutoplay(false);
                      stopTtsAndTimers();
                      setActiveSlideIndex(prev => Math.min(pptPreview.slides.length + 1, prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Compact Advanced TTS Voice Narrator & Autoplay Sidebar (20% Width for focus) */}
              <div className="w-full lg:w-[20%] bg-[#0D1527] rounded-3xl p-4 sm:p-4.5 border border-slate-800 shadow-xl flex flex-col justify-between gap-4 shrink-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-mono text-[10px] text-[#00D285] font-black tracking-widest uppercase flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D285] animate-pulse" />
                      🎙️ PANEL NARRATOR AI
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-900 text-[#00D285] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-800 shadow-inner">
                        Slide {activeSlideIndex + 1} / {pptPreview.slides.length + 2}
                      </span>
                    </div>
                  </div>

                  {/* Playback Controls Stack */}
                  <div className="flex flex-col gap-2">
                    {/* Speak Button */}
                    <button
                      onClick={() => {
                        if (isTtsPlaying) {
                          stopTtsAndTimers();
                        } else {
                          speakCurrentSlide();
                        }
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isTtsPlaying 
                          ? "bg-red-500 hover:bg-red-605 text-white border-red-400" 
                          : "bg-[#00D285]/10 hover:bg-[#00D285]/18 text-[#00D285] border border-[#00D285]/20"
                      }`}
                    >
                      {isTtsPlaying ? (
                        <>
                          <VolumeX className="h-4 w-4" />
                          <span>Hentikan Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          <span>Bicarakan Slide</span>
                        </>
                      )}
                    </button>

                    {/* Autoplay Slide Deck Button */}
                    <button
                      onClick={() => {
                        const targetState = !isTtsAutoplay;
                        setIsTtsAutoplay(targetState);
                        if (targetState) {
                          speakCurrentSlide();
                        } else {
                          stopTtsAndTimers();
                        }
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isTtsAutoplay 
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-950/40" 
                          : "bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"
                      }`}
                    >
                      <Play className={`h-3.5 w-3.5 ${isTtsAutoplay ? "animate-spin text-white" : "text-emerald-400"}`} />
                      <span>{isTtsAutoplay ? "Autoplay ON" : "Mulai Auto Presentation"}</span>
                    </button>
                  </div>

                  {/* Speech parameters */}
                  <div className="space-y-2.5 bg-[#121c33]/70 border border-slate-800 p-3 rounded-xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[9px] uppercase font-bold">Kecepatan:</span>
                      <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                        {[0.85, 1.0, 1.2, 1.4].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => {
                              setTtsRate(rate);
                              if (isTtsPlaying || isTtsAutoplay) {
                                setTimeout(() => speakCurrentSlide(), 50);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                              ttsRate === rate 
                                ? "bg-[#00D285] text-slate-950 font-black" 
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[9px] uppercase font-bold">Volume:</span>
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                        <Volume2 className="h-3 w-3 text-slate-400" />
                        <input 
                          type="range" 
                          min="0.2" 
                          max="1.0" 
                          step="0.1" 
                          value={ttsVolume} 
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setTtsVolume(val);
                            if (isTtsPlaying || isTtsAutoplay) {
                              setTimeout(() => speakCurrentSlide(), 50);
                            }
                          }}
                          className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D285]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dual Column/Stack Speaker Notes */}
                  <div className="space-y-3">
                    {/* Speak full script box */}
                    <div className="bg-[#121c33]/55 p-3 rounded-xl border border-slate-800/65 max-h-[140px] overflow-y-auto">
                      <div className="text-[9px] uppercase font-mono font-black text-blue-400 flex items-center gap-1.5 mb-1.5 select-none">
                        🎙️ NASKAH PIDATO PRESENTER
                      </div>
                      <p className="text-[11px] text-slate-200 leading-relaxed font-semibold italic select-text">
                        &quot;{activeSlideIndex === 0 ? "Selamat pagi/siang bapak dan ibu sekalian. Slide pembuka ini menjelaskan judul dan pilar utama kajian proyek strategis PRAMA untuk PT Pancaran Group." : activeSlideIndex === pptPreview.slides.length + 1 ? "Sesi presentasi komprehensif selesai. Kami mengucapkan terima kasih kepada pimpinan komite, direksi, dan jajaran tim operasional PT Pancaran Group." : (pptPreview.slides[activeSlideIndex - 1]?.speakerNotes || "Penjelasan pendukung slide.")}&quot;
                      </p>
                    </div>

                    {/* Penjelasan Singkat */}
                    <div className="bg-[#121c33]/50 p-3 rounded-xl border border-slate-800/60 max-h-[110px] overflow-y-auto">
                      <div className="text-[9px] uppercase font-mono font-black text-[#00D285] flex items-center gap-1.5 mb-1 select-none">
                        💡 PENJELASAN SINGKAT SLIDE
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-semibold font-sans select-text">
                        {(() => {
                          if (activeSlideIndex === 0) {
                            return `Slide pembuka hasil kajian strategis komprehensif PRAMA untuk proyek "${pptPreview.title}" di PT Pancaran Group pada unit ${(activeDivision || "UMUM").toUpperCase() + " & BD"}.`;
                          } else if (activeSlideIndex === pptPreview.slides.length + 1) {
                            return "Slide penutup formal menyampaikan apresiasi mendalam, penegasan kerahasiaan dokumen, serta membuka sesi diskusi interaktif.";
                          } else {
                            const slide = pptPreview.slides[activeSlideIndex - 1];
                            const bulletsText = slide?.bullets && slide.bullets.length > 0 
                              ? slide.bullets.slice(0, 2).map(b => b.replace(/\*\*/g, "")).join("; ")
                              : "";
                            return `Fokus utama pada slide "${slide?.title || "Judul"}" merangkum analisis strategis serta usulan operasional terperinci terkait: ${bulletsText || "Rencana aksi, evaluasi, dan optimasi operasional berkelanjutan."}`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block border-t border-slate-800/60 pt-2 text-[9px] font-mono text-slate-500 italic text-right select-none">
                  {isTtsAutoplay ? (
                    <span className="text-emerald-400 animate-pulse">● Autoplay aktif...</span>
                  ) : (
                    <span>Gunakan tombol untuk memutar suara.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom slideshow controls & paginator */}
            <div className={`border-t px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center shrink-0 rounded-b-[2rem] gap-4 transition-all ${isPptFullscreen ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="flex gap-1.5 overflow-x-auto max-w-full sm:max-w-[70%] py-1.5">
                {Array.from({ length: pptPreview.slides.length + 2 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => {
                      setIsTtsAutoplay(false);
                      stopTtsAndTimers();
                      setActiveSlideIndex(dotIdx);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer shrink-0 ${
                      activeSlideIndex === dotIdx 
                        ? (isPptFullscreen ? "w-8 bg-[#00D285]" : "w-7 bg-[#00D285]") 
                        : (isPptFullscreen ? "w-2.5 bg-slate-700 hover:bg-slate-605" : "w-2.5 bg-slate-200 hover:bg-slate-350")
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPptPreview(null)}
                  className={`px-6 py-2.5 text-xs font-black rounded-full transition cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-705" : "text-slate-600 hover:text-slate-850 bg-slate-50 hover:bg-slate-105 border border-slate-200"}`}
                >
                  Tutup Slideshow
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
