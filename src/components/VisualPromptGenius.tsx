import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  Download,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Maximize2,
  ChevronLeft,
  Wand2,
  Layers,
  Palette,
  Eye,
  Film,
  Compass,
  Zap,
  HelpCircle,
  ExternalLink,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react";

interface VisualPromptResponse {
  id: string;
  userQuery: string;
  concept: string;
  englishPrompt: string;
  style: string;
  aspectRatio: string;
  negativePrompt: string;
  imageUrl?: string;
  timestamp: number;
  isGeneratingImage?: boolean;
}

interface VisualPromptGeniusProps {
  onBackToHub: () => void;
  clientApiKey?: string;
}

// Preset style definitions
const STYLE_PRESETS = [
  {
    id: "3d-animation",
    name: "3D Animation / Pixar Style",
    icon: "🎬",
    desc: "Karakter 3D menggemaskan, pencahayaan lembut, ekspresif, render Pixar/Disney 4K",
    keywords: "3D Pixar Disney style animation, highly detailed cute character, expressive eyes, subsurface scattering, soft volumetric lighting, Octane render 8K"
  },
  {
    id: "cinematic-poster",
    name: "Cinematic Movie Poster",
    icon: "🎨",
    desc: "Poster film dramatis, komposisi simetris, ruang tipografi, efek dramatis",
    keywords: "Epic cinematic movie poster, dramatic chiaroscuro lighting, dynamic composition with clean negative space for typography, blockbuster film grading, 8K ultra-detailed"
  },
  {
    id: "photorealistic",
    name: "Photorealistic 8K",
    icon: "📸",
    desc: "Foto nyata ultra-detail, lensa studio 85mm, pencahayaan natural",
    keywords: "Hyper-photorealistic 8K photograph, shot on Hasselblad 85mm lens, f/1.8 aperture, natural studio lighting, ultra-realistic texture and depth of field"
  },
  {
    id: "anime-ghibli",
    name: "Studio Ghibli / Anime Aesthetic",
    icon: "🌌",
    desc: "Gaya animasi Jepang estetik, langit megah, warna cat air lembut",
    keywords: "Studio Ghibli aesthetic anime art style, Makoto Shinkai lighting, vibrant color palette, hand-painted background, atmospheric glowing sunset"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk & Sci-Fi Neon",
    icon: "⚡",
    desc: "Kota futuristik, lampu neon bercahaya, refleksi aspal basah, partikel debu",
    keywords: "Futuristic cyberpunk aesthetic, neon cyan and magenta glow, wet reflective streets, volumetric atmospheric fog, high-tech dystopian city, intricate mechanical details"
  },
  {
    id: "corporate-logistics",
    name: "Logistik & Corporate Modern",
    icon: "🚛",
    desc: "Armada truk modern, pusat logistik canggih, visual bisnis premium",
    keywords: "Modern high-tech logistics fleet, futuristic highway transport, pristine industrial corporate visual, aerial perspective, clean corporate color scheme, dramatic sunrise"
  },
  {
    id: "concept-art",
    name: "Concept Art Fantasy",
    icon: "🏰",
    desc: "Karya seni konsep digital megah, visual epik ala ArtStation",
    keywords: "Masterpiece fantasy concept art, trending on ArtStation, majestic landscape, dramatic scale and atmosphere, epic digital painting, intricate concept design"
  }
];

// Aspect ratio mapping for resolution
const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square", width: 1024, height: 1024, icon: "⬛", desc: "Instagram Post / Feed" },
  { id: "9:16", label: "9:16 Vertical Poster", width: 768, height: 1344, icon: "📱", desc: "Story / TikTok / Poster Vertikal" },
  { id: "16:9", label: "16:9 Cinematic", width: 1344, height: 768, icon: "🖥️", desc: "Landscape / Banner / Slide" },
  { id: "4:5", label: "4:5 Portrait Feed", width: 896, height: 1120, icon: "🖼️", desc: "Social Media Portrait" },
  { id: "3:4", label: "3:4 Classic Poster", width: 864, height: 1152, icon: "📄", desc: "Poster Cetak Klasik" }
];

// Quick Starter Inspiration Prompts
const STARTER_PROMPTS = [
  {
    title: "Karakter 3D Robot AI Pengawas Armada",
    prompt: "Buatkan karakter robot kecil 3D yang imut bergaya animasi Pixar sedang memakai rompi safety neon dan memegang tablet digital di depan truk kontainer modern.",
    style: "3d-animation",
    ratio: "1:1"
  },
  {
    title: "Poster Film Epik: Armada Logistik Masa Depan",
    prompt: "Poster film sinematik tentang konvoi truk logistik listrik canggih melintasi jembatan megah di malam hari dengan latar belakang cakrawala kota metropolitan bercahaya.",
    style: "cinematic-poster",
    ratio: "9:16"
  },
  {
    title: "Foto Sinematik Truk Tambang Raksasa di Hujan",
    prompt: "Foto ultra realistis 8K truk hauling tambang batubara melintasi jalur lembah saat senja gerimis dengan sorot lampu LED yang membelah kabut tebal.",
    style: "photorealistic",
    ratio: "16:9"
  },
  {
    title: "Poster Animasi Estetik Pelabuhan Kapal Kargo",
    prompt: "Ilustrasi gaya anime Studio Ghibli suasana pelabuhan kapal kargo saat matahari terbit dengan awan keemasan lembut dan burung camar beterbangan.",
    style: "anime-ghibli",
    ratio: "16:9"
  }
];

export default function VisualPromptGenius({ onBackToHub, clientApiKey }: VisualPromptGeniusProps) {
  const [userInput, setUserInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("3d-animation");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  
  // History list
  const [promptHistory, setPromptHistory] = useState<VisualPromptResponse[]>(() => {
    try {
      const saved = localStorage.getItem("prama_visual_prompt_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial demonstration item
    return [
      {
        id: "demo-1",
        userQuery: "Karakter robot 3D asisten logistik ramah bergaya animasi",
        concept: "Karakter robot asisten cerdas 3D dengan tampilan modern dan ekspresi ramah, mengenakan lencana safety helm oranye neon, berdiri di depan pusat distribusi logistik futuristik.",
        englishPrompt: "A charming 3D Pixar-style robotic assistant character with big expressive glowing blue eyes and a friendly smile, wearing a sleek neon orange safety hardhat and high-visibility vest. Standing proudly in a bright modern automated logistics fulfillment hub with soft blurred robotic conveyor belts in the background. Cinematic volumetric lighting, ray-traced subsurface scattering, warm friendly atmosphere, highly detailed textures, Octane Render 8K masterpiece.",
        style: "3D Animation / Pixar Style",
        aspectRatio: "1:1 (Square)",
        negativePrompt: "blurry, low quality, distorted hands, out of frame, dark gloomy, low resolution, disfigured, text watermark",
        imageUrl: "https://image.pollinations.ai/prompt/A%20charming%203D%20Pixar-style%20robotic%20assistant%20character%20with%20big%20expressive%20glowing%20blue%20eyes%20wearing%20neon%20orange%20safety%20hardhat%20modern%20logistics%20hub%20Octane%20Render%208K?width=1024&height=1024&nologo=true&enhance=true&seed=42",
        timestamp: Date.now() - 3600000
      }
    ];
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("prama_visual_prompt_history", JSON.stringify(promptHistory.slice(0, 30)));
    } catch (e) {
      console.error(e);
    }
  }, [promptHistory]);

  // Helper to generate image URL using reliable Pollinations AI engine
  const buildImageUrl = (englishPrompt: string, ratioId: string, styleId: string, seed?: number) => {
    const ratioObj = ASPECT_RATIOS.find((r) => r.id === ratioId) || ASPECT_RATIOS[0];
    const styleObj = STYLE_PRESETS.find((s) => s.id === styleId);
    
    // Enrich prompt with style keywords and quality tags
    const enrichedPrompt = `${englishPrompt}, ${styleObj ? styleObj.keywords : ""}, masterpiece, highest quality, crisp details, stunning aesthetic`;
    const randomSeed = seed !== undefined ? seed : Math.floor(Math.random() * 999999);
    
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}?width=${ratioObj.width}&height=${ratioObj.height}&nologo=true&enhance=true&seed=${randomSeed}`;
  };

  // Handle Generate Prompt with Gemini AI Agent
  const handleGeneratePrompt = async (customPromptText?: string) => {
    const textToProcess = (customPromptText || userInput).trim();
    if (!textToProcess || isLoading) return;

    setIsLoading(true);
    const chosenRatioObj = ASPECT_RATIOS.find((r) => r.id === selectedRatio) || ASPECT_RATIOS[0];
    const chosenStyleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle) || STYLE_PRESETS[0];

    const newItemId = "vp-" + Date.now();

    try {
      const response = await fetch("/api/visual-prompt-genius/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIdea: textToProcess,
          preferredStyle: chosenStyleObj.name,
          aspectRatio: chosenRatioObj.label,
          clientApiKey
        })
      });

      const data = await response.json();

      let concept = "";
      let englishPrompt = "";
      let style = chosenStyleObj.name;
      let aspectRatio = chosenRatioObj.label;
      let negativePrompt = "blurry, low quality, distorted, extra limbs, bad anatomy, text watermark, deformed, grainy, bad composition";

      if (data && data.success && data.result) {
        concept = data.result.concept || "";
        englishPrompt = data.result.englishPrompt || "";
        style = data.result.style || chosenStyleObj.name;
        aspectRatio = data.result.aspectRatio || chosenRatioObj.label;
        negativePrompt = data.result.negativePrompt || negativePrompt;
      } else {
        // Fallback generator if offline or API limit
        concept = `Desain visual berkualitas tinggi untuk ide "${textToProcess}" dengan pencahayaan sinematik dan komposisi terstruktur.`;
        englishPrompt = `A visually stunning masterwork featuring ${textToProcess}, ${chosenStyleObj.keywords}, dynamic lighting, intricate composition, vibrant color grading, hyper-detailed, 8k resolution`;
      }

      // Generate instant visual image
      const generatedImageUrl = buildImageUrl(englishPrompt, selectedRatio, selectedStyle);

      const newEntry: VisualPromptResponse = {
        id: newItemId,
        userQuery: textToProcess,
        concept,
        englishPrompt,
        style,
        aspectRatio,
        negativePrompt,
        imageUrl: generatedImageUrl,
        timestamp: Date.now()
      };

      setPromptHistory((prev) => [newEntry, ...prev]);
      setUserInput("");

      // Smooth scroll to top of list
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Error generating visual prompt:", err);
      // Fallback
      const fallbackPrompt = `A high quality visual render of ${textToProcess}, ${chosenStyleObj.keywords}, octane render, 8k, cinematic`;
      const fallbackEntry: VisualPromptResponse = {
        id: newItemId,
        userQuery: textToProcess,
        concept: `Konsep visual untuk "${textToProcess}" dengan estetika ${chosenStyleObj.name}.`,
        englishPrompt: fallbackPrompt,
        style: chosenStyleObj.name,
        aspectRatio: chosenRatioObj.label,
        negativePrompt: "blurry, low quality, out of frame, distorted, watermarks",
        imageUrl: buildImageUrl(fallbackPrompt, selectedRatio, selectedStyle),
        timestamp: Date.now()
      };
      setPromptHistory((prev) => [fallbackEntry, ...prev]);
      setUserInput("");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy structured prompt
  const handleCopyPrompt = (item: VisualPromptResponse, mode: "full" | "english_only" | "midjourney") => {
    let textToCopy = "";
    if (mode === "english_only") {
      textToCopy = item.englishPrompt;
    } else if (mode === "midjourney") {
      const arFlag = item.aspectRatio.includes("9:16")
        ? "--ar 9:16"
        : item.aspectRatio.includes("16:9")
        ? "--ar 16:9"
        : item.aspectRatio.includes("4:5")
        ? "--ar 4:5"
        : item.aspectRatio.includes("3:4")
        ? "--ar 3:4"
        : "--ar 1:1";
      textToCopy = `/imagine prompt: ${item.englishPrompt} --no ${item.negativePrompt} ${arFlag} --v 6.1 --stylize 250`;
    } else {
      textToCopy = `---
🎯 **Konsep Visual:** ${item.concept}

✨ **Prompt Gambar / Animasi (English):**
${item.englishPrompt}

⚙️ **Parameter Rekomendasi:**
- **Style:** ${item.style}
- **Aspect Ratio:** ${item.aspectRatio}
- **Negative Prompt:** ${item.negativePrompt}
---`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id + "-" + mode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Regenerate image with new seed
  const handleRegenerateImage = (item: VisualPromptResponse) => {
    const newSeed = Math.floor(Math.random() * 999999);
    const newUrl = buildImageUrl(item.englishPrompt, selectedRatio, selectedStyle, newSeed);

    setPromptHistory((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, imageUrl: newUrl, timestamp: Date.now() } : p))
    );
  };

  // Clear history
  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pembuatan prompt visual?")) {
      setPromptHistory([]);
      localStorage.removeItem("prama_visual_prompt_history");
    }
  };

  // Direct download image
  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback open direct
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="w-full min-h-[750px] bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Top Header Bar */}
      <div className="bg-slate-950/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5 text-fuchsia-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-sm md:text-base uppercase tracking-wider text-white flex items-center gap-2">
                Visual Prompt Genius
                <span className="text-[9px] font-mono font-bold bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                  AI ARTIST AGENT
                </span>
              </h2>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold mt-0.5 uppercase">
              STUDIO FOTO ANIMASI, POSTER KREATIF & KARYA SENI DIGITAL INSTAN
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {promptHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-800 text-[11px] font-bold transition cursor-pointer"
              title="Hapus riwayat prompt"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bersihkan Galeri</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBackToHub}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body Grid (2 Columns on Large Screens) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-0 bg-slate-950/50">
        
        {/* Left Column: Creator Workshop & Parameter Controls (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-800 p-5 md:p-6 overflow-y-auto flex flex-col gap-5 bg-slate-950/70">
          
          {/* Agent Persona Badge */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-300">
                <Wand2 className="h-4.5 w-4.5" />
              </div>
              <div className="text-left space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Visual Prompt Genius AI
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  Ketik ide poster atau foto animasi apa saja. Saya akan merancang prompt gambar berbahasa Inggris terstruktur dan langsung merender hasil gambarnya secara real-time!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Starter Inspiration Chips */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400" />
              Inspirasi Cepat (1-Klik):
            </span>
            <div className="grid grid-cols-1 gap-2">
              {STARTER_PROMPTS.map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUserInput(starter.prompt);
                    setSelectedStyle(starter.style);
                    setSelectedRatio(starter.ratio);
                    handleGeneratePrompt(starter.prompt);
                  }}
                  className="text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 transition duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition">
                      {starter.title}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {starter.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector Section */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="h-3 w-3 text-fuchsia-400" />
              Pilih Gaya Seni / Art Style:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((st) => {
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-400 shadow-md ring-1 ring-indigo-400/50"
                        : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{st.icon}</span>
                      <span className={`text-[11px] font-black truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                        {st.name}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-1 font-medium">
                      {st.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="h-3 w-3 text-cyan-400" />
              Rasio Aspek & Format Output:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {ASPECT_RATIOS.map((ar) => {
                const isSelected = selectedRatio === ar.id;
                return (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setSelectedRatio(ar.id)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-cyan-950/70 border-cyan-400 text-cyan-200 font-black shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="text-xs">{ar.icon}</span>
                    <span className="text-[10px] font-bold">{ar.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Prompt Box & Submit Button */}
          <div className="space-y-2 text-left pt-2 border-t border-slate-800/80">
            <label className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 block">
              Deskripsikan Ide / Konsep Visual Anda:
            </label>
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && userInput.trim()) {
                    e.preventDefault();
                    handleGeneratePrompt();
                  }
                }}
                rows={3}
                placeholder="Contoh: Poster futuristik truk armada logistik menembus badai petir, pencahayaan dramatis, ruang kosong untuk teks judul..."
                className="w-full bg-slate-900 focus:bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 outline-none transition duration-200 focus:ring-2 focus:ring-indigo-500/20 font-sans resize-none"
              />
            </div>

            <button
              type="button"
              disabled={!userInput.trim() || isLoading}
              onClick={() => handleGeneratePrompt()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-cyan-500 active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Merancang Prompt & Merender Gambar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-fuchsia-200" />
                  <span>Buat Prompt & Render Visual Sekarang</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Live Generated Prompts, Visual Cards & Rendered Posters (7 Cols) */}
        <div className="lg:col-span-7 p-5 md:p-6 overflow-y-auto flex flex-col gap-6 bg-slate-900/30">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-left">
              <ImageIcon className="h-4 w-4 text-indigo-400" />
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-200">
                Galeri Karya & Hasil Prompt Visual
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              {promptHistory.length} Kreasi
            </span>
          </div>

          {/* Feed of generated visual results */}
          <div className="space-y-6 flex-1 text-left">
            {promptHistory.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-3xl bg-slate-950/30 text-slate-500 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <Film className="h-6 w-6 text-slate-600" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <p className="text-xs font-bold text-slate-400">Belum Ada Karya Visual yang Dibuat</p>
                  <p className="text-[11px] text-slate-500">
                    Ketik ide konsep Anda di panel sebelah kiri atau klik salah satu inspirasi cepat untuk mulai merancang prompt dan merender foto animasi/poster Anda.
                  </p>
                </div>
              </div>
            ) : (
              promptHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col transition duration-200"
                >
                  {/* Top Bar with User Idea */}
                  <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-xs font-black text-slate-200 truncate">
                        "{item.userQuery}"
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    
                    {/* Visual Output Image Container (5 Cols on md) */}
                    <div className="md:col-span-5 flex flex-col gap-2.5">
                      <div className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md aspect-square flex items-center justify-center">
                        {item.imageUrl ? (
                          <>
                            <img
                              src={item.imageUrl}
                              alt={item.concept}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Hover Overlay with Action Buttons */}
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-xs p-4">
                              <button
                                type="button"
                                onClick={() => setPreviewModalImage(item.imageUrl || null)}
                                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow cursor-pointer"
                                title="Lihat Layar Penuh"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadImage(item.imageUrl!, item.userQuery)}
                                className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow cursor-pointer"
                                title="Unduh Gambar (PNG)"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRegenerateImage(item)}
                                className="h-9 w-9 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition shadow cursor-pointer"
                                title="Render Variasi Baru"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                            <RefreshCw className="h-6 w-6 animate-spin text-indigo-400" />
                            <span className="text-[10px] font-mono">Merender AI...</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Download & Variations buttons under image */}
                      {item.imageUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadImage(item.imageUrl!, item.userQuery)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                          >
                            <Download className="h-3 w-3 text-indigo-400" />
                            <span>Unduh PNG</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRegenerateImage(item)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 text-[10px] font-bold transition cursor-pointer"
                            title="Variasi Gambar Baru"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Variasi</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Formatted Prompt Breakdown (7 Cols on md) */}
                    <div className="md:col-span-7 flex flex-col gap-3.5">
                      
                      {/* Structure 1: Konsep Visual */}
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                          <span>🎯</span>
                          <span>Konsep Visual:</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                          {item.concept}
                        </p>
                      </div>

                      {/* Structure 2: Prompt Gambar / Animasi (English) */}
                      <div className="bg-slate-900/80 border border-indigo-900/40 rounded-2xl p-3.5 space-y-2 relative group/box">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300">
                            <span>✨</span>
                            <span>Prompt Gambar / Animasi (English):</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPrompt(item, "english_only")}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 px-2 py-1 rounded-lg border border-indigo-800/60 transition cursor-pointer"
                            title="Salin Prompt Bahasa Inggris"
                          >
                            {copiedId === item.id + "-english_only" ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Salin Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed select-all">
                          {item.englishPrompt}
                        </div>
                      </div>

                      {/* Structure 3: Parameter Rekomendasi */}
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-[10.5px]">
                        <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400">
                          <span>⚙️</span>
                          <span>Parameter Rekomendasi:</span>
                        </div>
                        <div className="space-y-1 text-slate-300">
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-400 min-w-[90px]">• Style:</span>
                            <span className="text-slate-200 font-semibold">{item.style}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-400 min-w-[90px]">• Aspect Ratio:</span>
                            <span className="text-slate-200 font-semibold">{item.aspectRatio}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-slate-400 min-w-[90px]">• Negative Prompt:</span>
                            <span className="text-slate-400 font-mono text-[9.5px] break-all">{item.negativePrompt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Copy Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(item, "midjourney")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-800/60 text-purple-300 hover:text-purple-100 text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                          title="Salin untuk Midjourney dengan flag parameter --ar dan --no"
                        >
                          {copiedId === item.id + "-midjourney" ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin Midjourney!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin Format Midjourney</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(item, "full")}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold transition cursor-pointer"
                          title="Salin Seluruh Format Lengkap (Konsep + Prompt + Parameter)"
                        >
                          {copiedId === item.id + "-full" ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin Lengkap!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin Struktur Lengkap</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              ))
            )}
            <div ref={chatBottomRef} />
          </div>

        </div>

      </div>

      {/* Fullscreen Image Preview Modal */}
      <AnimatePresence>
        {previewModalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreviewModalImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={previewModalImage}
                alt="Fullscreen Visual Preview"
                className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadImage(previewModalImage, "visual_genius_render")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh File Resolusi Tinggi (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalImage(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-slate-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="bg-slate-950 px-6 py-2.5 border-t border-slate-800 text-[9.5px] font-mono text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>VISUAL PROMPT GENIUS AI AGENT &bull; GOOGLE IMAGEN / MIDJOURNEY / DALL-E PROMPT ARCHITECT</span>
        <span className="text-indigo-400 font-bold">PT PANCARAN GROUP CREATIVE COGNITIVE ENGINE</span>
      </div>
    </div>
  );
}
