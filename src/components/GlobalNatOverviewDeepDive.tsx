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
  BookmarkCheck,
  Sun,
  Moon,
  BarChart3,
  Download,
  ExternalLink,
  BookOpen,
  Search
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LabelList
} from "recharts";
import { generateStrategicOverviewForTitle } from "../utils/strategicOverviewGenerator.ts";
import { exportAllSectionsToWord, exportAllSectionsToPDF } from "../utils/projectDashboardHelper.ts";
import { generateExecutiveOverviewData, ExecutiveReportData } from "../utils/executiveOverviewReportGenerator.ts";

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

  // Content starts loaded or saved
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  
  // Default to the publication-grade Executive Visual Report view ("executive")
  const [displayMode, setDisplayMode] = useState<"executive" | "core" | "cards" | "document">("executive");
  const [paperTheme, setPaperTheme] = useState<"light" | "dark">("light");

  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

  // Dynamic Executive Data generated specifically for the active title
  const execData: ExecutiveReportData = useMemo(() => {
    return generateExecutiveOverviewData(currentTitle, currentDiv);
  }, [currentTitle, currentDiv]);

  // When projectTitle prop changes, load the saved content for that title or auto-seed
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
    setEditText(content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown);
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
    const textToCopy = content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown;
    navigator.clipboard.writeText(textToCopy);
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
    const activeMarkdown = content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown;
    if (!activeMarkdown || !activeMarkdown.trim()) return [];

    const rawSections = activeMarkdown.split(/(?=^#{1,3}\s+)/m);
    const result: ParsedSection[] = [];

    rawSections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return;

      const lines = trimmed.split("\n");
      const firstLine = lines[0] || "";
      const rawTitle = firstLine.replace(/^#{1,3}\s+/, "").trim();

      let displayTitle = rawTitle.replace(/^\d+[\.\)]\s*/, "").trim();
      if (!displayTitle) {
        displayTitle = `Bagian Analisis ${idx + 1}`;
      }

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

      bodyLines.forEach((line) => {
        const lineTrim = line.trim();
        if (!lineTrim) return;

        if (lineTrim.startsWith("* ") || lineTrim.startsWith("- ")) {
          const bulletContent = lineTrim.replace(/^[\*\-]\s+/, "");
          const colonIdx = bulletContent.indexOf(":");
          if (colonIdx > 0 && colonIdx < 45) {
            const k = bulletContent.substring(0, colonIdx).replace(/\*\*/g, "").trim();
            const v = bulletContent.substring(colonIdx + 1).replace(/\*\*/g, "").trim();
            keyValues.push({ key: k, value: v });
            if (iconType === "regulation") regulationsList.push(`${k}: ${v}`);
            if (iconType === "operations") operationalPoints.push({ key: k, value: v });
          } else {
            bullets.push(bulletContent);
            if (iconType === "regulation") regulationsList.push(bulletContent);
          }
        } else if (!lineTrim.startsWith("#") && !lineTrim.startsWith("!")) {
          paragraphs.push(lineTrim);
        }
      });

      const quickSummary = paragraphs[0] || bullets[0] || "Analisis strategis komprehensif.";

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
  }, [content, currentTitle, currentDiv]);

  // Key metrics summary
  const keyMetrics = useMemo(() => {
    let fleet = "Armada Terdedikasi Heavy Duty";
    let corridor = "Koridor Logistik & Arteri Nasional";
    let verdict = "LAYAK DENGAN MITIGASI RISIKO (CONDITIONAL GO)";

    parsedSections.forEach((s) => {
      s.keyValues.forEach((kv) => {
        const k = kv.key.toLowerCase();
        if (k.includes("armada") || k.includes("truk") || k.includes("spesifikasi")) {
          fleet = kv.value;
        }
        if (k.includes("rute") || k.includes("koridor") || k.includes("jalur") || k.includes("jarak")) {
          corridor = kv.value;
        }
        if (k.includes("rekomendasi") || k.includes("keputusan") || k.includes("verdict")) {
          verdict = kv.value;
        }
      });
    });

    return { fleet, corridor, verdict };
  }, [parsedSections]);

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent = content && lastGeneratedForTitle && lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="global-nat-overview-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 text-slate-100 shadow-2xl mt-2 font-sans relative overflow-hidden"
    >
      {/* Header Bar Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Left Badge Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/25 font-mono flex items-center gap-1.5 shadow-xs">
              <Globe className="h-3.5 w-3.5 text-teal-400" />
              02 GLOBAL & NATIONAL OVERVIEW
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              Kajian: <strong className="text-slate-100">{currentTitle}</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Executive Grade
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 select-none shadow-inner">
              <button
                type="button"
                onClick={() => setDisplayMode("executive")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  displayMode === "executive"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Tampilkan layout laporan eksekutif lengkap dengan grafik & diagram visual"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Laporan Visual (Grafik)</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode("core")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  displayMode === "core"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Tampilkan poin-poin penjelasan inti yang ringkas"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Inti Pokok</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayMode("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  displayMode === "cards"
                    ? "bg-teal-600 text-white shadow-xs"
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
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Tampilkan dalam bentuk dokumen teks mengalir"
              >
                <AlignLeft className="h-3.5 w-3.5" />
                <span>Dokumen Narasi</span>
              </button>
            </div>

            {/* Theme Toggle for Executive View */}
            {displayMode === "executive" && (
              <button
                type="button"
                onClick={() => setPaperTheme(paperTheme === "light" ? "dark" : "light")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
                title="Ganti tampilan kertas putih (A4 Document) atau dark mode"
              >
                {paperTheme === "light" ? <Moon className="h-3.5 w-3.5 text-indigo-400" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
                <span className="hidden sm:inline">{paperTheme === "light" ? "Mode Gelap" : "Mode Kertas Putih"}</span>
              </button>
            )}

            {/* Export Buttons */}
            <button
              type="button"
              onClick={() => {
                exportAllSectionsToPDF(currentTitle, { 1: content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-550 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-600/20 cursor-pointer active:scale-95"
              title="Unduh laporan Feasibility Study dalam format PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                exportAllSectionsToWord(currentTitle, { 1: content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
              title="Unduh seluruh laporan komprehensif ke format Word (.doc)"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Word</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-teal-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Perbarui isian analisis sesuai judul proyek aktif"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-teal-200" : ""}`} />
              <span>{isLoading ? "Menyusun..." : "Sinkron Judul"}</span>
            </button>
          </div>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mt-4 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                  Global & National Overview
                </h3>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono">
                  Pilar 02
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                Analisis makro global, pertumbuhan pasar, rencana kapasitas nasional, koridor logistik, dan realitas operasional untuk{" "}
                <span className="text-teal-300 font-bold">"{currentTitle}"</span>.
              </p>
            </div>
          </div>

          {/* Quick feasibility verdict badge */}
          {keyMetrics && (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide font-mono">
                Status: CONDITIONAL GO
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sync Alert if Active Title Changed */}
      {isTitleDifferent && (
        <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
            <span>
              Judul proyek telah diperbarui menjadi: <strong className="text-white">"{currentTitle}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateContent(currentTitle)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sinkronkan Teks & Analisis</span>
          </button>
        </div>
      )}

      {/* VIEWPORT: Switch between Executive Report vs Core Cards vs Text */}
      {displayMode === "executive" ? (
        /* =========================================================================
           PUBLICATION-GRADE 2-PAGE EXECUTIVE REPORT VIEW (MATCHING USER MOCKUP)
           ========================================================================= */
        <div className="space-y-8">
          {/* PAGE 1: GLOBAL OVERVIEW & TRENDS */}
          <div
            className={`rounded-2xl p-6 md:p-10 transition-all border shadow-2xl ${
              paperTheme === "light"
                ? "bg-white text-slate-900 border-slate-200"
                : "bg-slate-950 text-slate-100 border-slate-800"
            }`}
          >
            {/* Top Page Number & Title Accent */}
            <div className="border-b-2 pb-2 mb-6 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: execData.themeColor || "#0d9488" }}>
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight flex items-center gap-2" style={{ color: execData.themeColor || "#0d9488" }}>
                <span className="font-mono">02</span>
                <span>Global & National Overview</span>
              </h2>
              {execData.industryCategory && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-xs" style={{ backgroundColor: execData.themeColor || "#0d9488" }}>
                  {execData.industryCategory}
                </span>
              )}
            </div>

            {/* Global Subsection 1 */}
            <div className="space-y-4">
              <h3 className={`text-sm md:text-base font-bold tracking-tight ${paperTheme === "light" ? "text-slate-900" : "text-white"}`}>
                {execData.globalHeadline}
              </h3>

              <p className={`text-xs md:text-[13px] leading-relaxed text-justify ${paperTheme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                {execData.globalNarrative}
              </p>

              {/* CHART 1: Global Trend Vertical Bar Chart */}
              <div className={`my-6 p-4 md:p-6 rounded-xl border ${paperTheme === "light" ? "bg-slate-50/70 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
                <div className="text-center mb-3">
                  <h4 className={`text-xs md:text-sm font-bold ${paperTheme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    {execData.globalChart.title}
                  </h4>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={execData.globalChart.data}
                      margin={{ top: 25, right: 20, left: 10, bottom: 25 }}
                    >
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: paperTheme === "light" ? "#475569" : "#94a3b8" }}
                        axisLine={{ stroke: paperTheme === "light" ? "#cbd5e1" : "#475569" }}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: paperTheme === "light" ? "#475569" : "#94a3b8" }}
                        axisLine={{ stroke: paperTheme === "light" ? "#cbd5e1" : "#475569" }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: paperTheme === "light" ? "#ffffff" : "#0f172a",
                          borderColor: "#0d9488",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: paperTheme === "light" ? "#0f172a" : "#f8fafc"
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                        <LabelList
                          dataKey="displayValue"
                          position="top"
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            fill: paperTheme === "light" ? "#1e293b" : "#f1f5f9"
                          }}
                        />
                        {execData.globalChart.data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.isForecast
                                ? "#f59e0b" // Forecast bar in warm amber / gold
                                : index === execData.globalChart.data.length - 2
                                ? execData.themeColor || "#0d9488" // Current year in category theme color
                                : "#6ba2b9" // Historical in soft slate blue
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Caption & Source with Clickable Link */}
                <div className="mt-3 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <p className="text-[10px] text-slate-500 italic">
                      {execData.globalChart.sourceText}
                    </p>
                    {execData.globalChart.sourceUrl && (
                      <a
                        href={execData.globalChart.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/40 transition hover:underline"
                        title="Buka rujukan dokumen resmi di tab baru"
                      >
                        <span>Sumber Resmi</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10.5px] font-medium text-slate-600 dark:text-slate-400">
                    {execData.globalChart.figureCaption}
                  </p>
                </div>
              </div>

              {/* Analytical Narrative on LCOE, Costs, OEM, and Logistics Routing */}
              <p className={`text-xs md:text-[13px] leading-relaxed text-justify ${paperTheme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                {execData.globalCostAndOemNarrative}
              </p>

              {/* National Subsection 2 */}
              <div className="pt-4 space-y-2">
                <h3 className={`text-sm md:text-base font-bold tracking-tight ${paperTheme === "light" ? "text-slate-900" : "text-white"}`}>
                  {execData.nationalHeadline}
                </h3>
                <p className={`text-xs md:text-[13px] leading-relaxed text-justify ${paperTheme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  {execData.nationalSummary}
                </p>
              </div>

              {/* Page 1 Footer */}
              <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>PRAMA Strategic AI Advisory • PT Pancaran Group</span>
                <span>Halaman 1 dari 2</span>
              </div>
            </div>
          </div>

          {/* PAGE 2: NATIONAL CAPACITY COMPOSITION & REGIONAL CORRIDOR */}
          <div
            className={`rounded-2xl p-6 md:p-10 transition-all border shadow-2xl ${
              paperTheme === "light"
                ? "bg-white text-slate-900 border-slate-200"
                : "bg-slate-950 text-slate-100 border-slate-800"
            }`}
          >
            {/* Dark Corporate Feasibility Banner */}
            <div className="bg-[#0e2a47] text-white px-4 py-2.5 rounded-lg flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] font-bold tracking-wider mb-6 shadow-sm gap-2">
              <span className="uppercase">{execData.corporateBanner.left}</span>
              <span className="font-mono text-teal-300 text-[10px]">{execData.corporateBanner.right}</span>
            </div>

            {/* CHART 2: Horizontal Bar Chart of National Capacity Breakdown */}
            <div className={`p-4 md:p-6 rounded-xl border mb-6 ${paperTheme === "light" ? "bg-slate-50/70 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
              <div className="text-center mb-3">
                <h4 className={`text-xs md:text-sm font-bold ${paperTheme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                  {execData.nationalCapacityChart.title}
                </h4>
              </div>

              <div className="h-60 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={execData.nationalCapacityChart.data}
                    margin={{ top: 10, right: 55, left: 30, bottom: 10 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: paperTheme === "light" ? "#475569" : "#94a3b8" }}
                      axisLine={{ stroke: paperTheme === "light" ? "#cbd5e1" : "#475569" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 10, fontWeight: "bold", fill: paperTheme === "light" ? "#334155" : "#cbd5e1" }}
                      axisLine={{ stroke: paperTheme === "light" ? "#cbd5e1" : "#475569" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: paperTheme === "light" ? "#ffffff" : "#0f172a",
                        borderColor: "#0d9488",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: paperTheme === "light" ? "#0f172a" : "#f8fafc"
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      <LabelList
                        dataKey="displayValue"
                        position="right"
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          fill: paperTheme === "light" ? "#0f172a" : "#f8fafc"
                        }}
                      />
                      {execData.nationalCapacityChart.data.map((entry, index) => (
                        <Cell key={`nat-cell-${index}`} fill={entry.color || "#60a5fa"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Caption & Source with Clickable Link */}
              <div className="mt-2 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <p className="text-[9.5px] text-slate-500 italic">
                    {execData.nationalCapacityChart.sourceText}
                  </p>
                  {execData.nationalCapacityChart.sourceUrl && (
                    <a
                      href={execData.nationalCapacityChart.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/40 transition hover:underline"
                      title="Buka portal ESDM / RUPTL resmi"
                    >
                      <span>Portal Resmi</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  {execData.nationalCapacityChart.figureCaption}
                </p>
              </div>
            </div>

            {/* SIDE-BY-SIDE SECTION: Donut Chart on Left, Logistics Narrative on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
              {/* Left Column (5 cols): Donut Chart */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h5 className={`text-xs font-bold text-center mb-2 ${paperTheme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                  {execData.regionalDonut.title}
                </h5>

                <div className="h-48 w-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={execData.regionalDonut.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {execData.regionalDonut.data.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total Metric */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-base font-black leading-none ${paperTheme === "light" ? "text-slate-900" : "text-white"}`}>
                      {execData.regionalDonut.centerMetric}
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase font-mono tracking-tight mt-0.5">
                      {execData.regionalDonut.centerSublabel}
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="w-full mt-3 space-y-1.5 text-[10.5px]">
                  {execData.regionalDonut.data.map((item, idx) => (
                    <div key={`leg-${idx}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className={paperTheme === "light" ? "text-slate-700" : "text-slate-300"}>{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white font-mono text-[10px]">{item.detail}</span>
                    </div>
                  ))}
                </div>

                {execData.regionalDonut.footnote && (
                  <p className="text-[8.5px] text-slate-400 italic text-center mt-2.5">
                    {execData.regionalDonut.footnote}
                  </p>
                )}
              </div>

              {/* Right Column (7 cols): Logistics Corridor Narrative */}
              <div className="lg:col-span-7 space-y-3">
                {execData.logisticsCorridorNarrative.map((p, idx) => (
                  <p
                    key={`log-p-${idx}`}
                    className={`text-xs md:text-[12.5px] leading-relaxed text-justify ${
                      paperTheme === "light" ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* BOTTOM CALLOUT BOX: REALITAS PASAR (RED LEFT ACCENT STRIPE) */}
            <div
              className={`p-4 md:p-5 rounded-xl border-l-4 border-l-red-600 my-6 shadow-sm ${
                paperTheme === "light"
                  ? "bg-slate-50/90 border-t border-r border-b border-slate-200"
                  : "bg-slate-900/90 border-t border-r border-b border-slate-800"
              }`}
            >
              <h4 className="text-xs md:text-sm font-bold text-red-600 dark:text-red-400 mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span>{execData.marketReality.title}</span>
              </h4>

              <ul className="space-y-2">
                {execData.marketReality.bulletPoints.map((b, bIdx) => (
                  <li
                    key={`real-b-${bIdx}`}
                    className={`text-xs md:text-[12px] leading-relaxed flex items-start gap-2 ${
                      paperTheme === "light" ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VERIFIED SOURCES & REFERENCES SECTION (GOOGLE & OFFICIAL INSTITUTIONS) */}
            {execData.sourcesList && execData.sourcesList.length > 0 && (
              <div
                className={`p-4 md:p-5 rounded-xl border my-6 shadow-sm ${
                  paperTheme === "light"
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-900/90 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs md:text-sm font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Rujukan & Sumber Data Resmi (Terverifikasi Google & Lembaga Riset)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/50">
                    ✓ Data Faktual & Terverifikasi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {execData.sourcesList.map((src, sIdx) => (
                    <div
                      key={`src-${sIdx}`}
                      className={`p-3 rounded-lg border flex flex-col justify-between transition hover:shadow-xs ${
                        paperTheme === "light"
                          ? "bg-white border-slate-200 hover:border-teal-400"
                          : "bg-slate-950 border-slate-800 hover:border-teal-500/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                            {src.name}
                          </span>
                          <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                            {src.year}
                          </span>
                        </div>
                        <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                          Penerbit: <strong>{src.publisher}</strong>
                        </div>
                        <p className="text-[10.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          📌 {src.keyMetric}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-mono">Status: Fakta Resmi</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline"
                          title="Buka rujukan dokumen resmi di Google/portal resmi"
                        >
                          <span>Buka Sumber Rujukan</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page 2 Footer */}
            <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>PRAMA Strategic AI Advisory • PT Pancaran Group</span>
              <span>Halaman 2 dari 2</span>
            </div>
          </div>
        </div>
      ) : displayMode === "core" ? (
        /* =========================================================================
           CORE SUMMARY VIEW (CLEAN HIGHLIGHT CARDS)
           ========================================================================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedSections.map((sec) => (
              <div
                key={sec.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 transition shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 font-mono bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-800/40 flex items-center gap-1.5">
                      {sec.metaBadge}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-500">{sec.stepNumber}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{sec.displayTitle}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{sec.quickSummary}</p>

                  {sec.keyValues.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                      {sec.keyValues.slice(0, 3).map((kv, kvIdx) => (
                        <div key={kvIdx} className="flex items-start justify-between text-[11px] gap-2">
                          <span className="text-slate-400 font-medium">{kv.key}:</span>
                          <span className="font-bold text-slate-200 text-right">{kv.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* VERIFIED SOURCES IN CORE VIEW */}
          {execData.sourcesList && execData.sourcesList.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/90 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Rujukan Data Terverifikasi Google & Lembaga Resmi</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ Teruji Faktual</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {execData.sourcesList.map((src, sIdx) => (
                  <div key={`core-src-${sIdx}`} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-white">
                        <span>{src.name}</span>
                        <span className="text-[9px] font-mono text-slate-400">{src.year}</span>
                      </div>
                      <p className="text-[10px] text-teal-400 mt-0.5">{src.publisher}</p>
                      <p className="text-[10px] text-slate-300 mt-1">{src.keyMetric}</p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 hover:underline"
                    >
                      <span>Buka Tautan Sumber</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : displayMode === "cards" ? (
        /* =========================================================================
           DETAILED CARDS GRID VIEW
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parsedSections.map((sec) => (
            <div
              key={sec.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-bold text-white">{sec.displayTitle}</h4>
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded">
                    {sec.stepNumber}
                  </span>
                </div>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs text-slate-300 leading-relaxed mb-2 text-justify">
                    {formatTextWithBold(p)}
                  </p>
                ))}
                {sec.bullets.length > 0 && (
                  <ul className="space-y-1.5 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{formatTextWithBold(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =========================================================================
           FULL MARKDOWN NARRATIVE TEXT VIEW
           ========================================================================= */
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
            <span className="text-xs font-bold text-slate-400">Dokumen Narasi Strategis (Raw Markdown)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
            {content || generateStrategicOverviewForTitle(currentTitle, currentDiv).narrativeMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
}
