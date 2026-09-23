import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Edit3,
  Trash2,
  Save,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calendar,
  Milestone
} from "lucide-react";
import { generateTransitionModelForTitle } from "../utils/transitionModelGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface TransitionModelProps {
  projectTitle: string;
  activeDivision?: string;
}

export function TransitionModelDeepDive({ projectTitle, activeDivision }: TransitionModelProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Model Transisi & Deployment Operasional Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_transition_model_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts POLOS (empty) unless explicitly generated or saved
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

  // Cleanup legacy preset keys
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("prama_transition_legacy_") || k.startsWith("transition_custom_") || k.startsWith("transition_model_tasks_"))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // When projectTitle changes, load saved content for that title or start polos
  useEffect(() => {
    const saved = localStorage.getItem(storageKey) || "";
    setContent(saved);
    setEditText(saved);
    setIsEditing(false);
  }, [storageKey]);

  // Handler to generate fresh, 100% title-tailored content
  const handleGenerateContent = async (targetTitle: string = currentTitle) => {
    setIsLoading(true);
    setIsEditing(false);

    try {
      const clientApiKey = localStorage.getItem("workspace_client_api_key") || "";
      const res = await fetch("/api/generate-transition-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: targetTitle,
          division: currentDiv,
          clientApiKey
        })
      });

      let generatedMarkdown = "";
      if (res.ok) {
        const data = await res.json();
        if (data && data.content && typeof data.content === "string" && data.content.trim().length > 50) {
          generatedMarkdown = data.content;
        }
      }

      // If server returned fallback or couldn't reach API, use precision title generator
      if (!generatedMarkdown) {
        const localResult = generateTransitionModelForTitle(targetTitle, currentDiv);
        generatedMarkdown = localResult.narrativeMarkdown;
      }

      setContent(generatedMarkdown);
      setEditText(generatedMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generatedMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.warn("Generating local tailored transition model for:", targetTitle, err);
      const localResult = generateTransitionModelForTitle(targetTitle, currentDiv);
      setContent(localResult.narrativeMarkdown);
      setEditText(localResult.narrativeMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, localResult.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to completely wipe content and make it POLOS (blank)
  const handleClearAll = () => {
    setContent("");
    setEditText("");
    setIsEditing(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_title`);
  };

  // Handler to start editing manually
  const handleStartEdit = () => {
    setEditText(content);
    setIsEditing(true);
  };

  // Save manual edits
  const handleSaveEdit = () => {
    setContent(editText);
    localStorage.setItem(storageKey, editText);
    setIsEditing(false);
  };

  // Copy narrative to clipboard
  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Markdown renderer for clean unified narrative
  const renderSeamlessNarrative = (rawText: string) => {
    if (!rawText || !rawText.trim()) return null;
    const lines = rawText.split("\n");
    const renderedNodes: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        renderedNodes.push(<div key={`empty-${index}`} className="h-3" />);
        return;
      }

      // Heading 3
      if (trimmed.startsWith("### ")) {
        const headingText = trimmed.replace(/^###\s+/, "");
        renderedNodes.push(
          <div key={`h3-${index}`} className="mt-6 mb-3 pt-3 border-t border-slate-800 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
              <h4 className="text-sm md:text-base font-black text-white uppercase tracking-tight">
                {headingText}
              </h4>
            </div>
          </div>
        );
        return;
      }

      // Heading 2 or 1
      if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
        const headingText = trimmed.replace(/^#+\s+/, "");
        renderedNodes.push(
          <div key={`h2-${index}`} className="mt-7 mb-3.5 border-b border-indigo-500/20 pb-2">
            <h3 className="text-base md:text-lg font-black text-indigo-300 uppercase tracking-tight flex items-center gap-2">
              <Milestone className="h-4 w-4 text-indigo-400" />
              {headingText}
            </h3>
          </div>
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletContent = trimmed.replace(/^[\*\-]\s+/, "");
        const formatted = bulletContent.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="text-white font-extrabold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        renderedNodes.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2.5 ml-1 my-1.5 text-slate-300 text-xs md:text-[13px] leading-relaxed">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            <div className="flex-1">{formatted}</div>
          </div>
        );
        return;
      }

      // Regular paragraph
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="text-white font-extrabold tracking-wide">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      renderedNodes.push(
        <p
          key={`p-${index}`}
          className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-normal text-justify my-2.5"
        >
          {formattedParts}
        </p>
      );
    });

    return renderedNodes;
  };

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent = content && lastGeneratedForTitle && lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="transition-model-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="border-b border-slate-800 pb-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9.5px] font-black tracking-wider uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono flex items-center gap-1.5">
              <Milestone className="h-3 w-3 text-indigo-400" />
              PILAR 6 • TRANSITION MODEL (PRE-ON-POST)
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span className="px-2.5 py-0.5 text-[9.5px] font-bold uppercase rounded-md bg-slate-800 text-slate-300 border border-slate-700/80 font-mono">
              JUDUL PROYEK: {currentTitle}
            </span>
            {isBlank && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                STATUS: POLOS
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem("prama_dashboard_sections");
                  const map = saved ? JSON.parse(saved) : {};
                  map[6] = content;
                  exportAllSectionsToWord(currentTitle, map);
                } catch(e) {
                  exportAllSectionsToWord(currentTitle, { 6: content });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              title="Unduh seluruh laporan komprehensif ke format Word (.doc)"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Buat isian baru yang sesuai dengan judul proyek"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-indigo-200" : ""}`} />
              <span>{isLoading ? "Menyusun Model Transisi..." : isBlank ? "Buat Isian Sesuai Judul" : "Buat Ulang Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-400" />
          Transition Model: Pre-On-Post Implementation Roadmap
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
          Peta jalan transisi operasional, persiapan armada, pengujian rute (trial run), hingga stabilisasi SLA jangka panjang untuk proyek{" "}
          <span className="text-indigo-300 font-extrabold">"{currentTitle}"</span>.
        </p>
      </div>

      {/* If current title is different from what was previously generated, show quick sync badge */}
      {isTitleDifferent && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
            <span>
              Judul proyek telah diperbarui menjadi: <strong className="text-white">"{currentTitle}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateContent(currentTitle)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>Buat Isian Baru untuk Judul Ini</span>
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-inner relative min-h-[220px]">
        {isLoading ? (
          <div className="py-14 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menyusun Model Transisi Sesuai Judul...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Menganalisis tahapan persiapan teknis armada, simulasi uji coba rute lintasan, dan stabilisasi SLA jangka panjang untuk{" "}
              <span className="text-indigo-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-indigo-400" />
                <span>Mode Edit Teks Mandiri (Pilar 6)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Batal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Tuliskan kajian model transisi Anda di sini (mendukung format Markdown: ### Judul, **Tebal**, - Poin)..."
              rows={14}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-indigo-500 transition leading-relaxed resize-y"
            />
          </div>
        ) : isBlank ? (
          /* Clean Blank State (POLOS) */
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>

            <div className="max-w-md">
              <h4 className="text-sm font-bold text-white mb-1">
                Kanvas Model Transisi Masih Polos
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Belum ada isian untuk proyek <span className="text-indigo-300 font-bold">"{currentTitle}"</span>. Klik tombol di bawah untuk menghasilkan peta jalan transisi yang 100% se-arah dengan judul ini, atau tulis sendiri secara manual.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerateContent(currentTitle)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Buat Isian Baru Sesuai Judul</span>
              </button>

              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Tulis Manual</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated Unified Content */
          <div className="space-y-2">
            {/* Top Insight Bar */}
            <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-indigo-200 truncate">
                  Fokus Model Transisi: <span className="text-white font-extrabold">{currentTitle}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded shrink-0 font-bold">
                100% Se-arah Judul
              </span>
            </div>

            {/* Seamless Narrative Content */}
            <div className="prose prose-invert max-w-none">
              {renderSeamlessNarrative(content)}
            </div>

            {/* Footer Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Model transisi aktif tersinkronisasi dengan judul proyek</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="hover:text-indigo-400 transition cursor-pointer font-medium"
                >
                  Edit Teks
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="hover:text-rose-400 transition cursor-pointer font-medium"
                >
                  Kosongkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
