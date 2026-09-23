import React, { useState, useEffect, useMemo } from "react";
import {
  Globe,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Trash2,
  Save,
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Truck,
  Compass,
  FileCheck2,
  Scale,
  Award,
  AlertCircle,
  LayoutGrid,
  AlignLeft,
  Briefcase,
  MapPin,
  Info,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  BookmarkCheck
} from "lucide-react";
import { generateStrategicOverviewForTitle } from "../utils/strategicOverviewGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface GlobalNatProps {
  projectTitle: string;
  activeDivision?: string;
}

interface KeyValItem {
  key: string;
  value: string;
}

interface ParsedSection {
  id: string;
  rawTitle: string;
  displayTitle: string;
  iconType: "macro" | "regulation" | "operations" | "verdict" | "general";
  quickSummary: string;
  paragraphs: string[];
  bullets: string[];
  keyValues: KeyValItem[];
  regulationsList: string[];
  operationalPoints: KeyValItem[];
  metaBadge: string;
  stepNumber: string;
}

export function GlobalNatOverviewDeepDive({ projectTitle, activeDivision }: GlobalNatProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi";

  const storageKey = `prama_global_nat_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts POLOS (empty) unless the user explicitly saved or generated it
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  // Default to the most engaging and readable view: "core" (Penjelasan Inti)
  const [displayMode, setDisplayMode] = useState<"core" | "cards" | "document">("core");
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

  // Cleanup any old legacy preset keys
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("prama_global_nat_ai_")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // When projectTitle prop changes, load the saved content for that title or start polos
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
      const res = await fetch("/api/generate-overview", {
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
        const localResult = generateStrategicOverviewForTitle(targetTitle, currentDiv);
        generatedMarkdown = localResult.narrativeMarkdown;
      }

      setContent(generatedMarkdown);
      setEditText(generatedMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generatedMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.warn("Generating local tailored overview for:", targetTitle, err);
      const localResult = generateStrategicOverviewForTitle(targetTitle, currentDiv);
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

  // Helper to cleanly format bold markdown text
  const formatTextWithBold = (text: string, highlightColor = "text-white") => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className={`${highlightColor} font-bold tracking-wide`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Smart section parser: breakdown markdown into clean, structured card models
  const parsedSections = useMemo((): ParsedSection[] => {
    if (!content || !content.trim()) return [];

    const rawSections = content.split(/(?=^#{1,3}\s+)/m);
    const result: ParsedSection[] = [];

    rawSections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return;

      const lines = trimmed.split("\n");
      const firstLine = lines[0] || "";
      const rawTitle = firstLine.replace(/^#{1,3}\s+/, "").trim();

      // Clean display title without leading number prefix
      let displayTitle = rawTitle.replace(/^\d+[\.\)]\s*/, "").trim();
      if (!displayTitle) {
        displayTitle = `Bagian Analisis ${idx + 1}`;
      }

      // Identify category
      const titleLower = rawTitle.toLowerCase();
      let iconType: ParsedSection["iconType"] = "general";
      let metaBadge = "Kajian Strategis";
      let stepNumber = `0${idx + 1}`;

      if (titleLower.includes("global") || titleLower.includes("makro") || titleLower.includes("rantai pasok")) {
        iconType = "macro";
        metaBadge = "Dimensi Makro & Pasar";
        stepNumber = "01";
      } else if (titleLower.includes("regulasi") || titleLower.includes("kebijakan") || titleLower.includes("hukum") || titleLower.includes("nasional")) {
        iconType = "regulation";
        metaBadge = "Regulasi & Izin Standar";
        stepNumber = "02";
      } else if (titleLower.includes("operasi") || titleLower.includes("lapangan") || titleLower.includes("koridor") || titleLower.includes("armada") || titleLower.includes("tantangan")) {
        iconType = "operations";
        metaBadge = "Armada & Operasional";
        stepNumber = "03";
      } else if (titleLower.includes("kesimpulan") || titleLower.includes("rekomendasi") || titleLower.includes("verdict") || titleLower.includes("keputusan")) {
        iconType = "verdict";
        metaBadge = "Keputusan & Rekomendasi";
        stepNumber = "04";
      }

      const bodyLines = lines.slice(1);
      const paragraphs: string[] = [];
      const bullets: string[] = [];
      const keyValues: KeyValItem[] = [];
      const regulationsList: string[] = [];
      const operationalPoints: KeyValItem[] = [];

      let isInsideRegBlock = false;

      bodyLines.forEach((bLine) => {
        const blTrim = bLine.trim();
        if (!blTrim) return;

        // Check if line indicates start of regulation list
        if (blTrim.toLowerCase().includes("regulasi acuan") || blTrim.toLowerCase().includes("regulasi rujukan")) {
          isInsideRegBlock = true;
          return;
        }

        // Bullet line
        if (blTrim.startsWith("- ") || blTrim.startsWith("* ")) {
          const bulletContent = blTrim.replace(/^[\*\-]\s+/, "").trim();

          // Check if key-value pair like: **Key:** Value
          const kvMatch = bulletContent.match(/^\*\*(.*?)\*\*:?\s*(.*)$/);
          if (kvMatch) {
            const key = kvMatch[1].replace(/:$/, "").trim();
            const val = kvMatch[2].trim();

            if (key && val) {
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes("spesifikasi armada") || lowerKey.includes("koridor") || lowerKey.includes("rute") || lowerKey.includes("armada rekomendasi")) {
                keyValues.push({ key, value: val });
              } else {
                operationalPoints.push({ key, value: val });
              }
              return;
            }
          }

          if (isInsideRegBlock || iconType === "regulation") {
            regulationsList.push(bulletContent);
          } else {
            bullets.push(bulletContent);
          }
        } else {
          // Regular paragraph line
          paragraphs.push(blTrim);
        }
      });

      // Quick summary: pick the first sentence or synthesize
      let quickSummary = "";
      if (paragraphs.length > 0) {
        const firstP = paragraphs[0];
        const sentenceMatch = firstP.match(/^([^\.\!\?]+[\.\!\?])/);
        quickSummary = sentenceMatch ? sentenceMatch[1] : firstP.slice(0, 160) + "...";
      } else if (bullets.length > 0) {
        quickSummary = bullets[0];
      }

      result.push({
        id: `sec-${idx}`,
        rawTitle,
        displayTitle,
        iconType,
        quickSummary,
        paragraphs,
        bullets,
        keyValues,
        regulationsList,
        operationalPoints,
        metaBadge,
        stepNumber
      });
    });

    return result;
  }, [content]);

  // Extract quick key indicators for the top KPI metric boxes
  const keyMetrics = useMemo(() => {
    if (!content) return null;

    // Detect fleet
    const fleetMatch = content.match(/(?:Armada|Spesifikasi Armada|Unit Armada|Tipe Truk)[^:\n]*:\s*([^\n\*\.]+)/i);
    // Detect corridor
    const corridorMatch = content.match(/(?:Koridor|Rute|Jangkauan Operasional|Lintasan)[^:\n]*:\s*([^\n\*\.]+)/i);
    // Detect verdict
    const isFeasible = /Sangat Layak|Layak Dijalankan|Feasible|GO/i.test(content);

    // Extract quick takeaway summary
    let executiveSummary = "";
    if (parsedSections.length > 0) {
      const macroSec = parsedSections.find((s) => s.iconType === "macro") || parsedSections[0];
      executiveSummary = macroSec.quickSummary || "Proyek memiliki daya saing kuat dengan kepatuhan regulasi dan rute operasional terencana.";
    }

    return {
      fleet: fleetMatch ? fleetMatch[1].trim() : "Armada Heavy Duty Sesuai Muatan",
      corridor: corridorMatch ? corridorMatch[1].trim() : "Koridor Arteri Nasional Utama",
      verdict: isFeasible ? "FEASIBLE (LAYAK / GO)" : "CONDITIONAL (REVIEW)",
      executiveSummary
    };
  }, [content, parsedSections]);

  // Markdown renderer for clean unified narrative (Document view)
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

      if (trimmed.startsWith("### ")) {
        const headingText = trimmed.replace(/^###\s+/, "");
        renderedNodes.push(
          <div key={`h3-${index}`} className="mt-6 mb-3 pt-3 border-t border-slate-800 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-tight">
                {headingText}
              </h4>
            </div>
          </div>
        );
        return;
      }

      if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
        const headingText = trimmed.replace(/^#+\s+/, "");
        renderedNodes.push(
          <div key={`h2-${index}`} className="mt-7 mb-3.5 border-b border-blue-500/20 pb-2">
            <h3 className="text-base md:text-lg font-bold text-blue-300 uppercase tracking-tight flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-400" />
              {headingText}
            </h3>
          </div>
        );
        return;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletContent = trimmed.replace(/^[\*\-]\s+/, "");
        renderedNodes.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2.5 ml-1 my-1.5 text-slate-300 text-xs md:text-[13px] leading-relaxed">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
            <div className="flex-1">{formatTextWithBold(bulletContent)}</div>
          </div>
        );
        return;
      }

      renderedNodes.push(
        <p
          key={`p-${index}`}
          className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-normal text-justify my-2.5"
        >
          {formatTextWithBold(trimmed)}
        </p>
      );
    });

    return renderedNodes;
  };

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent = content && lastGeneratedForTitle && lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="global-nat-overview-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 text-slate-100 shadow-xl mt-2 font-sans relative overflow-hidden"
    >
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Left Badge Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-blue-400" />
              PILAR 1 • GLOBAL & NATIONAL OVERVIEW
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              Proyek: <strong className="text-slate-200">{currentTitle}</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                isBlank
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isBlank ? "Status: Polos" : "Status: Siap Dibaca"}
            </span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isBlank && !isEditing && (
              <>
                {/* 3-Way Segmented View Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => setDisplayMode("core")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "core"
                        ? "bg-cyan-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Tampilkan hanya poin-poin penjelasan inti yang sangat mudah dipahami"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Inti Pokok (Ringkas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisplayMode("cards")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "cards"
                        ? "bg-cyan-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Tampilkan analisis dalam kotak-kotak terstruktur"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Kotak Rincian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisplayMode("document")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "document"
                        ? "bg-cyan-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Tampilkan dalam bentuk dokumen teks mengalir"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    <span>Dokumen Narasi</span>
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem("prama_dashboard_sections");
                  const map = saved ? JSON.parse(saved) : {};
                  map[1] = content;
                  exportAllSectionsToWord(currentTitle, map);
                } catch(e) {
                  exportAllSectionsToWord(currentTitle, { 1: content });
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Buat isian baru yang sesuai dengan judul proyek"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-200" : ""}`} />
              <span>{isLoading ? "Menyusun Kajian..." : isBlank ? "Buat Ringkasan Inti" : "Buat Ulang Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        {/* Main Title Heading */}
        <div className="mt-4 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Global & National Overview
                </h3>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono">
                  Visual Brief
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                Poin-poin inti strategis kelayakan makro, izin regulasi, kesiapan armada, dan rekomendasi keputusan untuk{" "}
                <span className="text-blue-300 font-bold">"{currentTitle}"</span>.
              </p>
            </div>
          </div>

          {/* Quick feasibility badge */}
          {!isBlank && keyMetrics && (
            <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                Kelayakan: {keyMetrics.verdict}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sync Alert if Title Has Changed */}
      {isTitleDifferent && (
        <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
            <span>
              Judul proyek aktif berubah menjadi: <strong className="text-white">"{currentTitle}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateContent(currentTitle)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sinkronkan Isian untuk Judul Ini</span>
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-inner relative min-h-[220px]">
        {isLoading ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
              <Sparkles className="h-5 w-5 text-blue-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menyusun Penjelasan Inti Proyek...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Mengekstrak poin-poin penting, regulasi kunci, armada yang tepat, dan rekomendasi eksekutif untuk{" "}
              <span className="text-blue-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-blue-400" />
                <span>Mode Edit Teks (Format Markdown)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Batal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Tuliskan poin-poin analisis strategis di sini..."
              rows={15}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-blue-500 transition leading-relaxed resize-y"
            />
          </div>
        ) : isBlank ? (
          /* Clean Blank State */
          <div className="py-14 px-4 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>

            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Kajian Strategis Masih Polos
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Belum ada data untuk proyek <span className="text-blue-300 font-bold">"{currentTitle}"</span>. Klik tombol di bawah untuk membuat penjelasan inti yang ringkas, visual, dan mudah dipahami.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerateContent(currentTitle)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Buat Penjelasan Inti Sesuai Judul</span>
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
          <div className="space-y-6">
            {/* Top 3 Key Parameter Metric Cards */}
            {keyMetrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Box 1: Fleet */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-amber-400" />
                        Armada Tepat Guna
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-2" title={keyMetrics.fleet}>
                      {keyMetrics.fleet}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                    Spesifikasi muatan & daya angkut optimal
                  </p>
                </div>

                {/* Box 2: Corridor */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                        Koridor Wilayah / Rute
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-2" title={keyMetrics.corridor}>
                      {keyMetrics.corridor}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                    Lintasan distribusi & akses jaringan logistik
                  </p>
                </div>

                {/* Box 3: Verdict */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Status Keputusan
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-black text-xs tracking-wide">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{keyMetrics.verdict}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                    Kesiapan regulasi & operasional lapangan
                  </p>
                </div>
              </div>
            )}

            {/* VIEW 1: PENJELASAN INTI (RINGKAS, VISUAL, MUDAH DIPAHAMI) */}
            {displayMode === "core" && (
              <div className="space-y-5">
                {/* Executive Quick Takeaway Highlight Banner */}
                <div className="bg-gradient-to-r from-indigo-950/70 via-blue-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 md:p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 font-mono">
                      Inti Eksekutif (30 Detik Baca)
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                    Proyek <strong className="text-white">"{currentTitle}"</strong> memiliki daya saing tinggi dengan pemenuhan standar regulasi resmi dan pemilihan armada yang efisien. Rantai pasok ini menjawab kebutuhan pasar tanpa melanggar regulasi ODOL ataupun risiko keselamatan kerja.
                  </p>
                </div>

                {/* 4 Core Pillars in visual easy-to-digest cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Konteks Makro & Pasar */}
                  <div className="bg-slate-900/90 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 md:p-5 flex flex-col justify-between transition group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                          01 • Pasar & Makro
                        </span>
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2">
                        Peluang & Dinamika Pasar
                      </h4>

                      {(() => {
                        const macroSec = parsedSections.find((s) => s.iconType === "macro") || parsedSections[0];
                        if (!macroSec) return null;

                        return (
                          <div className="space-y-2.5 text-xs text-slate-300">
                            <p className="text-[12.5px] text-slate-200 leading-relaxed font-medium">
                              {macroSec.quickSummary || "Pertumbuhan sektor menuntut efisiensi logistik yang tepat waktu dan terstandarisasi."}
                            </p>

                            {macroSec.bullets.length > 0 ? (
                              <div className="space-y-1.5 pt-1">
                                {macroSec.bullets.slice(0, 3).map((b, bIdx) => (
                                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                    <span className="text-blue-400 font-bold text-xs mt-0.5">•</span>
                                    <span className="flex-1">{formatTextWithBold(b, "text-blue-200")}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
                                  <Check className="h-3 w-3 text-blue-400 shrink-0" />
                                  <span>Permintaan stabil dengan potensi kontrak jangka panjang B2B</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
                                  <Check className="h-3 w-3 text-blue-400 shrink-0" />
                                  <span>Efisiensi konsumsi BBM dan rasio muatan maksimal</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-blue-400">
                      <span className="font-semibold">Target Pasar: Industri & Komersial</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Kepatuhan Regulasi & Standar */}
                  <div className="bg-slate-900/90 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl p-4 md:p-5 flex flex-col justify-between transition group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                          02 • Regulasi & Kepatuhan
                        </span>
                        <Scale className="h-4 w-4 text-indigo-400" />
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2">
                        Izin Pokok & Standar Keselamatan
                      </h4>

                      {(() => {
                        const regSec = parsedSections.find((s) => s.iconType === "regulation") || parsedSections[1];
                        const regs = regSec?.regulationsList?.length
                          ? regSec.regulationsList
                          : [
                              "UU No. 22 Tahun 2009 tentang Lalu Lintas dan Angkutan Jalan (LLAJ)",
                              "Kepatuhan Kebijakan Zero ODOL & Muatan Sumbu Terberat (MST)",
                              "Sistem Manajemen Keselamatan (SMK) Angkutan & K3 Kerja"
                            ];

                        return (
                          <div className="space-y-2 text-xs">
                            <p className="text-[12.5px] text-slate-200 font-medium leading-relaxed">
                              {regSec?.quickSummary || "Wajib memenuhi perizinan perhubungan, tonase resmi, dan standar keselamatan berkendara."}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              {regs.slice(0, 3).map((r, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2 text-[11.5px] text-indigo-200"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{r.replace(/\*\*/g, "")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400">
                      <span className="font-semibold">Status: 100% Legal & Kepatuhan Penuh</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Operasional & Armada */}
                  <div className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 md:p-5 flex flex-col justify-between transition group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          03 • Operasional Lapangan
                        </span>
                        <Truck className="h-4 w-4 text-amber-400" />
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2">
                        Kesiapan Armada & Mitigasi Rute
                      </h4>

                      {(() => {
                        const opsSec = parsedSections.find((s) => s.iconType === "operations") || parsedSections[2];

                        return (
                          <div className="space-y-2.5 text-xs text-slate-300">
                            <p className="text-[12.5px] text-slate-200 leading-relaxed font-medium">
                              {opsSec?.quickSummary || "Armada siap jalan dengan pemeliharaan teratur dan pengawasan rute secara digital."}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              {opsSec?.operationalPoints && opsSec.operationalPoints.length > 0 ? (
                                opsSec.operationalPoints.slice(0, 3).map((op, opIdx) => (
                                  <div key={opIdx} className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg text-[11.5px]">
                                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                      <span>{op.key}</span>
                                    </div>
                                    <p className="text-slate-300 mt-0.5 pl-3 line-clamp-1">{op.value}</p>
                                  </div>
                                ))
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
                                    <Check className="h-3 w-3 text-amber-400 shrink-0" />
                                    <span>Pelacakan GPS real-time & Driver Safety Monitoring</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
                                    <Check className="h-3 w-3 text-amber-400 shrink-0" />
                                    <span>Pemeliharaan rutin ban, rem, dan sistem keselamatan</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400">
                      <span className="font-semibold">Keandalan Teknis: Terpantau 24/7</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Keputusan & Rekomendasi */}
                  <div className="bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 md:p-5 flex flex-col justify-between transition group">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          04 • Kesimpulan & Eksekusi
                        </span>
                        <Award className="h-4 w-4 text-emerald-400" />
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2">
                        Rekomendasi Langkah Nyata
                      </h4>

                      {(() => {
                        const verdictSec = parsedSections.find((s) => s.iconType === "verdict") || parsedSections[3];

                        return (
                          <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl">
                              <span className="text-[10px] font-black uppercase text-emerald-400 block mb-0.5 font-mono">
                                Verdict Kelayakan:
                              </span>
                              <p className="text-xs font-bold text-emerald-200">
                                {verdictSec?.quickSummary || "Proyek Sangat Layak Dijalankan (Feasible - GO) dengan kepatuhan tonase resmi."}
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-start gap-2 text-[11.5px] text-slate-300">
                                <span className="text-emerald-400 font-bold mt-0.5">1.</span>
                                <span>Kunci kontrak SLA jangka panjang dengan klien utama</span>
                              </div>
                              <div className="flex items-start gap-2 text-[11.5px] text-slate-300">
                                <span className="text-emerald-400 font-bold mt-0.5">2.</span>
                                <span>Patuhi batasan tonase legal agar terhindar dari tilang ODOL</span>
                              </div>
                              <div className="flex items-start gap-2 text-[11.5px] text-slate-300">
                                <span className="text-emerald-400 font-bold mt-0.5">3.</span>
                                <span>Jadwalkan preventif maintenance unit berkala</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400">
                      <span className="font-semibold">Status Aksi: Siap Diluncurkan</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: KOTAK-KOTAK BREAKDOWN RAPIH */}
            {displayMode === "cards" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-blue-400" />
                    Rincian Penjelasan Ter-Breakdown (Kotak Analisis)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {parsedSections.length} Bab Analisis Terpadu
                  </span>
                </div>

                <div className="flex flex-col space-y-4">
                  {parsedSections.map((sec) => {
                    const isMacro = sec.iconType === "macro";
                    const isReg = sec.iconType === "regulation";
                    const isOps = sec.iconType === "operations";
                    const isVerdict = sec.iconType === "verdict";

                    let cardBorder = "border-slate-800 hover:border-slate-700 bg-slate-900/90";
                    let badgeClass = "bg-slate-800 text-slate-300 border-slate-700";
                    let titleClass = "text-white";
                    let iconNode = <Briefcase className="h-4 w-4 text-blue-400" />;
                    let calloutBorder = "border-blue-500/20 bg-blue-500/5 text-blue-200";

                    if (isMacro) {
                      cardBorder = "border-blue-900/30 hover:border-blue-700/50 bg-slate-900/90";
                      badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
                      titleClass = "text-blue-100";
                      iconNode = <Globe className="h-4 w-4 text-blue-400" />;
                      calloutBorder = "border-blue-500/20 bg-blue-500/10 text-blue-200";
                    } else if (isReg) {
                      cardBorder = "border-indigo-900/30 hover:border-indigo-700/50 bg-slate-900/90";
                      badgeClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
                      titleClass = "text-indigo-100";
                      iconNode = <Scale className="h-4 w-4 text-indigo-400" />;
                      calloutBorder = "border-indigo-500/20 bg-indigo-500/10 text-indigo-200";
                    } else if (isOps) {
                      cardBorder = "border-amber-900/30 hover:border-amber-700/50 bg-slate-900/90";
                      badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                      titleClass = "text-amber-100";
                      iconNode = <Truck className="h-4 w-4 text-amber-400" />;
                      calloutBorder = "border-amber-500/20 bg-amber-500/10 text-amber-200";
                    } else if (isVerdict) {
                      cardBorder = "border-emerald-900/40 hover:border-emerald-700/60 bg-slate-900/90";
                      badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                      titleClass = "text-emerald-100";
                      iconNode = <Award className="h-4 w-4 text-emerald-400" />;
                      calloutBorder = "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
                    }

                    return (
                      <div
                        key={sec.id}
                        className={`rounded-2xl border ${cardBorder} p-5 md:p-6 transition shadow-xs flex flex-col justify-between`}
                      >
                        <div className="space-y-3.5">
                          {/* Card Top Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border font-mono ${badgeClass}`}>
                              {sec.metaBadge}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Bagian {sec.stepNumber}
                            </span>
                          </div>

                          {/* Card Title */}
                          <h4 className={`text-sm md:text-base font-bold tracking-tight flex items-center gap-2 ${titleClass}`}>
                            {iconNode}
                            <span>{sec.displayTitle}</span>
                          </h4>

                          {/* Penjelasan Singkat (Highlight Callout Box) */}
                          {sec.quickSummary && (
                            <div className={`p-3 rounded-xl border ${calloutBorder} flex items-start gap-2.5 text-xs leading-relaxed`}>
                              <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                              <div className="flex-1">
                                <span className="font-bold text-[10.5px] uppercase tracking-wider block mb-0.5 opacity-90">
                                  Poin Inti:
                                </span>
                                <div>{formatTextWithBold(sec.quickSummary)}</div>
                              </div>
                            </div>
                          )}

                          {/* Detailed Narrative Paragraphs */}
                          {sec.paragraphs.length > 1 && (
                            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-normal text-justify">
                              {sec.paragraphs.slice(1).map((p, pIdx) => (
                                <p key={`p-${pIdx}`}>
                                  {formatTextWithBold(p)}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Regulations List */}
                          {isReg && sec.regulationsList.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <FileCheck2 className="h-3.5 w-3.5 text-indigo-400" />
                                Rujukan Regulasi Resmi:
                              </span>
                              <div className="grid grid-cols-1 gap-1.5">
                                {sec.regulationsList.map((reg, rIdx) => (
                                  <div
                                    key={`reg-${rIdx}`}
                                    className="p-2.5 bg-slate-950/60 border border-slate-800/90 rounded-xl flex items-start gap-2.5 text-xs text-slate-200"
                                  >
                                    <Scale className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                    <span className="flex-1 font-medium">{formatTextWithBold(reg)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Operational Key Values */}
                          {isOps && sec.keyValues.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {sec.keyValues.map((kv, kvIdx) => {
                                const isFleet = kv.key.toLowerCase().includes("armada");
                                return (
                                  <div
                                    key={`kv-${kvIdx}`}
                                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                                  >
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1 font-mono">
                                      {isFleet ? <Truck className="h-3 w-3 text-amber-400" /> : <MapPin className="h-3 w-3 text-indigo-400" />}
                                      {kv.key}
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                      {kv.value}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Operational Technical Points */}
                          {isOps && sec.operationalPoints.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                                Poin Kesiapan Lapangan:
                              </span>
                              <div className="space-y-1.5">
                                {sec.operationalPoints.map((op, opIdx) => (
                                  <div
                                    key={`op-${opIdx}`}
                                    className="p-2.5 bg-slate-950/60 border border-slate-800/90 rounded-xl text-xs space-y-1"
                                  >
                                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                      <span>{op.key}</span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed pl-3 font-normal">
                                      {op.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* General Bullets */}
                          {sec.bullets.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5">
                              {sec.bullets.map((b, bIdx) => (
                                <div
                                  key={`b-${bIdx}`}
                                  className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                                >
                                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                  <div className="flex-1">{formatTextWithBold(b)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 3: DOKUMEN NARASI MENGALIR */}
            {displayMode === "document" && (
              <div className="prose prose-invert max-w-none">
                {renderSeamlessNarrative(content)}
              </div>
            )}

            {/* Canvas Footer Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Kajian aktif tersinkronisasi 100% dengan judul proyek</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="hover:text-blue-400 transition cursor-pointer font-medium"
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

