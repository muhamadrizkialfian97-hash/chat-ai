import React, { useState, useEffect, useMemo } from "react";
import {
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
  Layers,
  MapPin,
  Clock,
  Activity,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  Zap
} from "lucide-react";
import {
  generateServiceDesignForTitle,
  ServiceDesignResult
} from "../utils/serviceDesignGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface ServiceDesignProps {
  projectTitle: string;
  activeDivision?: string;
}

interface ParsedSection {
  id: string;
  rawTitle: string;
  displayTitle: string;
  stepNumber: string;
  iconType: "journey" | "blueprint" | "failsafe" | "kpi" | "general";
  quickSummary: string;
  paragraphs: string[];
  bullets: string[];
  metaBadge: string;
}

export function ServiceDesignDeepDive({ projectTitle, activeDivision }: ServiceDesignProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi";

  const storageKey = `prama_service_design_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts POLOS (empty) unless saved
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"core" | "cards" | "document">("core");
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

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
      const generated = generateServiceDesignForTitle(targetTitle, currentDiv);
      setContent(generated.narrativeMarkdown);
      setEditText(generated.narrativeMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.error("Error generating Service Design:", err);
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
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="text-white font-bold tracking-wide">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Section parser for structured Card Mode
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

      // Clean title
      let displayTitle = rawTitle.replace(/^\d+[\.\)]\s*/, "").trim();
      if (!displayTitle) {
        displayTitle = `Bagian Service Design ${idx + 1}`;
      }

      const titleLower = rawTitle.toLowerCase();
      let iconType: ParsedSection["iconType"] = "general";
      let metaBadge = "Service Architecture";
      let stepNumber = `0${idx + 1}`;

      if (titleLower.includes("siklus") || titleLower.includes("journey") || titleLower.includes("klien") || titleLower.includes("touchpoint")) {
        iconType = "journey";
        metaBadge = "Client Journey & Touchpoints";
        stepNumber = "01";
      } else if (titleLower.includes("blueprint") || titleLower.includes("prosedur") || titleLower.includes("standar") || titleLower.includes("layanan")) {
        iconType = "blueprint";
        metaBadge = "Operational Blueprint & SOP";
        stepNumber = "02";
      } else if (titleLower.includes("fail-safe") || titleLower.includes("darurat") || titleLower.includes("mitigasi") || titleLower.includes("kontinuitas")) {
        iconType = "failsafe";
        metaBadge = "Fail-Safe & Contingency";
        stepNumber = "03";
      } else if (titleLower.includes("kpi") || titleLower.includes("kepuasan") || titleLower.includes("metrik") || titleLower.includes("indikator")) {
        iconType = "kpi";
        metaBadge = "Customer Experience & KPIs";
        stepNumber = "04";
      }

      const bodyLines = lines.slice(1);
      const paragraphs: string[] = [];
      const bullets: string[] = [];

      bodyLines.forEach((bLine) => {
        const blTrim = bLine.trim();
        if (!blTrim) return;

        if (blTrim.startsWith("- ") || blTrim.startsWith("* ") || blTrim.startsWith("• ")) {
          bullets.push(blTrim.replace(/^[\*\-•]\s+/, "").trim());
        } else {
          paragraphs.push(blTrim);
        }
      });

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
        stepNumber,
        iconType,
        quickSummary,
        paragraphs,
        bullets,
        metaBadge
      });
    });

    return result;
  }, [content]);

  // Render seamless narrative text for Document View
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
              <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
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
          <div key={`h2-${index}`} className="mt-7 mb-3.5 border-b border-cyan-500/20 pb-2">
            <h3 className="text-base md:text-lg font-bold text-cyan-300 uppercase tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              {headingText}
            </h3>
          </div>
        );
        return;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
        const bulletContent = trimmed.replace(/^[\*\-•]\s+/, "");
        renderedNodes.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2.5 ml-1 my-1.5 text-slate-300 text-xs md:text-[13px] leading-relaxed">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
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
      id="service-design-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 text-slate-100 shadow-xl mt-2 font-sans relative overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Badge & Project Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-cyan-400" />
              PILAR 15 • SERVICE DESIGN BLUEPRINT
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
              {isBlank ? "Status: Polos" : "Status: Terstruktur Rapih"}
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
                    title="Tampilan Inti Pokok yang ringkas, visual, dan mudah dipahami"
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
                    title="Tampilan Kotak Rincian terstruktur per komponen"
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
                    title="Tampilan Dokumen Narasi komprehensif"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    <span>Dokumen Narasi</span>
                  </button>
                </div>
              </>
            )}

            {/* Buat Isian Sesuai Judul / Buat Ulang */}
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem("prama_dashboard_sections");
                      const map = saved ? JSON.parse(saved) : {};
                      map[15] = content;
                      exportAllSectionsToWord(currentTitle, map);
                    } catch(e) {
                      exportAllSectionsToWord(currentTitle, { 15: content });
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                  title="Hasilkan isian Service Design yang tepat sesuai judul proyek"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  )}
                  <span>{isBlank ? "Buat Isian Sesuai Judul" : "Buat Ulang Sesuai Judul"}</span>
                </button>
              </>
            )}

            {/* Salin Teks */}
            {!isBlank && !isEditing && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                title="Salin naskah kajian ke clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            )}

            {/* Edit Teks */}
            {!isBlank && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                title="Edit narasi kajian secara langsung"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Teks</span>
              </button>
            )}
          </div>
        </div>

        {/* Notice if title has changed */}
        {isTitleDifferent && !isBlank && !isEditing && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Judul Proyek Telah Diubah: <strong>"{currentTitle}"</strong>. Data saat ini masih mengacu pada "{lastGeneratedForTitle}".
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] shrink-0 transition cursor-pointer"
            >
              Perbarui Sesuai Judul Baru
            </button>
          </div>
        )}
      </div>

      {/* BLANK STATE: Displayed when content is wiped or empty */}
      {isBlank && (
        <div className="py-14 px-6 text-center bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl my-2">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Layers className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">
            Belum Ada Data Service Design Terformat
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
            Data service design untuk <strong>"{currentTitle}"</strong> dalam keadaan polos.
            Silakan klik tombol di bawah untuk membuat isian arsitektur pengalaman klien, blueprint operasional, dan SLA yang tepat sesuai judul proyek, atau input secara manual.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg transition cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-cyan-200" />
              )}
              <span>Buat Isian Sesuai Judul</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const initText = `# KAJIAN SERVICE DESIGN: ${currentTitle.toUpperCase()}\n\n## 1. ARSITEKTUR SIKLUS KLIEN (CLIENT JOURNEY MAPPING)\n- Tahap 1: Onboarding & Audit Armada\n- Tahap 2: Penjadwalan Ritase Terpadu\n- Tahap 3: Monitoring Real-Time IoT\n- Tahap 4: Serah Terima Digital\n\n## 2. BLUEPRINT OPERASIONAL & SERVICE STANDARDS\n- SOP Layanan 24/7\n- Kualifikasi Pengemudi Profesional\n- Standardisasi Penanganan Kargo\n\n## 3. FAIL-SAFE PROTOCOLS & MITIGASI DARURAT\n- Unit Cadangan Standby\n- Rute Pengalihan Dinamis\n\n## 4. METRIK KEPUASAN PELANGGAN & KPI\n- On-Time Delivery: ≥ 98.5%\n- CSAT: ≥ 95%`;
                setContent(initText);
                setEditText(initText);
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4 text-slate-400" />
              <span>Tulis Manual / Input Data Sendiri</span>
            </button>
          </div>
        </div>
      )}

      {/* EDITING STATE: Direct manual textarea editor */}
      {isEditing && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              Editor Teks Service Design (Markdown)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Batal</span>
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
            placeholder="Tuliskan struktur Service Design, Client Journey, dan blueprint operasional..."
          />
        </div>
      )}

      {/* CONTENT VIEW: Displayed when not blank and not editing */}
      {!isBlank && !isEditing && (
        <>
          {displayMode === "core" ? (
            /* CORE VIEW: Executive Summary, Key Highlights & Takeaways */
            <div className="space-y-4">
              {/* Executive Summary Hero Card */}
              <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          INTI SERVICE DESIGN • RANGKUMAN EKSEKUTIF
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          SOP & Blueprint Terintegrasi
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                        Arsitektur layanan komersial dirancang end-to-end mulai dari akuisisi pesanan, alokasi armada real-time, pengawalan SLA ketat, hingga protokol pemulihan kendala lapangan (failsafe mechanism) khusus untuk <span className="text-cyan-300 font-bold">"{currentTitle}"</span>.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                    <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Target On-Time Delivery</div>
                      <div className="text-xs font-black text-cyan-300 mt-0.5">≥ 98.5%</div>
                    </div>
                    <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">SLA Respon Insiden</div>
                      <div className="text-xs font-black text-emerald-400 mt-0.5">&lt; 15 Menit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Quick Overview Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedSections.map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <h4 className="text-xs md:text-sm font-bold text-white tracking-tight">
                          {sec.displayTitle}
                        </h4>
                      </div>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {sec.metaBadge}
                      </span>
                    </div>

                    {sec.quickSummary && (
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {formatTextWithBold(sec.quickSummary)}
                      </p>
                    )}

                    {sec.bullets.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-900">
                        {sec.bullets.slice(0, 2).map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] leading-relaxed">{formatTextWithBold(b)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : displayMode === "cards" ? (
            /* CARDS VIEW: 4 Structured, High-Impact Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {parsedSections.map((sec, idx) => {
                let badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
                let iconComponent = <Layers className="h-4 w-4 text-cyan-400" />;

                if (sec.iconType === "journey") {
                  badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  iconComponent = <Compass className="h-4 w-4 text-blue-400" />;
                } else if (sec.iconType === "blueprint") {
                  badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  iconComponent = <FileCheck2 className="h-4 w-4 text-emerald-400" />;
                } else if (sec.iconType === "failsafe") {
                  badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  iconComponent = <ShieldCheck className="h-4 w-4 text-amber-400" />;
                } else if (sec.iconType === "kpi") {
                  badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                  iconComponent = <Award className="h-4 w-4 text-purple-400" />;
                }

                return (
                  <div
                    key={sec.id || idx}
                    className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                            {iconComponent}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                            BAGIAN {sec.stepNumber}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {sec.metaBadge}
                        </span>
                      </div>

                      {/* Display Title */}
                      <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                        {sec.displayTitle}
                      </h4>

                      {/* Quick Summary Callout Box */}
                      {sec.quickSummary && (
                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/40 text-xs text-cyan-200/90 leading-relaxed mb-3 flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cyan-300 block text-[11px] mb-0.5">
                              Penjelasan Singkat:
                            </span>
                            {formatTextWithBold(sec.quickSummary)}
                          </div>
                        </div>
                      )}

                      {/* Remaining Paragraphs */}
                      {sec.paragraphs.slice(1).map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-xs text-slate-300 leading-relaxed mb-2 text-justify"
                        >
                          {formatTextWithBold(p)}
                        </p>
                      ))}

                      {/* Bullets Points */}
                      {sec.bullets.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {sec.bullets.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300"
                            >
                              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                              <div className="flex-1 leading-relaxed">
                                {formatTextWithBold(b)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DOCUMENT VIEW: Clean Seamless Narrative */
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
              <div className="max-w-4xl mx-auto">
                {renderSeamlessNarrative(content)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
