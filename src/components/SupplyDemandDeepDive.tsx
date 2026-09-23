import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Trash2,
  Save,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Truck,
  Activity,
  Gauge,
  TrendingUp,
  Sliders,
  LayoutGrid,
  AlignLeft,
  Info,
  Clock,
  ArrowRight,
  Zap,
  Target,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { generateSupplyDemandForTitle } from "../utils/supplyDemandGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface SupplyDemandProps {
  projectTitle: string;
  activeDivision?: string;
}

interface KeyValItem {
  key: string;
  value: string;
}

interface ParsedSupplySection {
  id: string;
  rawTitle: string;
  displayTitle: string;
  iconType: "supply" | "demand" | "equilibrium" | "contingency" | "verdict" | "general";
  quickSummary: string;
  paragraphs: string[];
  bullets: string[];
  keyValues: KeyValItem[];
  metaBadge: string;
  stepNumber: string;
}

export function SupplyDemandDeepDive({ projectTitle, activeDivision }: SupplyDemandProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Keseimbangan Pasokan & Permintaan Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_supply_demand_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts POLOS (empty) unless explicitly generated or saved
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  // Default to the easy-to-understand and concise view: "core" (Inti Pokok)
  const [displayMode, setDisplayMode] = useState<"core" | "cards" | "document">("core");
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

  // Cleanup legacy preset keys
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("prama_supply_demand_legacy_") || k.startsWith("supply_demand_custom_"))) {
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
      const res = await fetch("/api/generate-supply-demand", {
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
        const localResult = generateSupplyDemandForTitle(targetTitle, currentDiv);
        generatedMarkdown = localResult.narrativeMarkdown;
      }

      setContent(generatedMarkdown);
      setEditText(generatedMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generatedMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.warn("Generating local tailored supply demand for:", targetTitle, err);
      const localResult = generateSupplyDemandForTitle(targetTitle, currentDiv);
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

  // Format bold markdown text helper
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

  // Smart section parser for Supply & Demand
  const parsedSections = useMemo((): ParsedSupplySection[] => {
    if (!content || !content.trim()) return [];

    const rawSections = content.split(/(?=^#{1,3}\s+)/m);
    const result: ParsedSupplySection[] = [];

    rawSections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return;

      const lines = trimmed.split("\n");
      const firstLine = lines[0] || "";
      const rawTitle = firstLine.replace(/^#{1,3}\s+/, "").trim();

      // Clean display title
      let displayTitle = rawTitle.replace(/^\d+[\.\)]\s*/, "").trim();
      if (!displayTitle) {
        displayTitle = `Bagian Analisis ${idx + 1}`;
      }

      // Identify category
      const titleLower = rawTitle.toLowerCase();
      let iconType: ParsedSupplySection["iconType"] = "general";
      let metaBadge = "Kajian Kapasitas";
      let stepNumber = `0${idx + 1}`;

      if (titleLower.includes("pasokan") || titleLower.includes("supply") || titleLower.includes("armada") || titleLower.includes("kapasitas angkut")) {
        iconType = "supply";
        metaBadge = "Sisi Pasokan & Armada";
        stepNumber = "01";
      } else if (titleLower.includes("permintaan") || titleLower.includes("demand") || titleLower.includes("karakteristik") || titleLower.includes("volatilitas")) {
        iconType = "demand";
        metaBadge = "Dinamika Permintaan";
        stepNumber = "02";
      } else if (titleLower.includes("keseimbangan") || titleLower.includes("equilibrium") || titleLower.includes("utilisasi") || titleLower.includes("efisiensi")) {
        iconType = "equilibrium";
        metaBadge = "Keseimbangan & Utilisasi";
        stepNumber = "03";
      } else if (titleLower.includes("mitigasi") || titleLower.includes("disrupsi") || titleLower.includes("kontinjensi") || titleLower.includes("resilience")) {
        iconType = "contingency";
        metaBadge = "Mitigasi & Kontinjensi";
        stepNumber = "04";
      } else if (titleLower.includes("rekomendasi") || titleLower.includes("verdict") || titleLower.includes("keputusan") || titleLower.includes("kesimpulan")) {
        iconType = "verdict";
        metaBadge = "Keputusan Kapasitas";
        stepNumber = "05";
      }

      const bodyLines = lines.slice(1);
      const paragraphs: string[] = [];
      const bullets: string[] = [];
      const keyValues: KeyValItem[] = [];

      bodyLines.forEach((bLine) => {
        const blTrim = bLine.trim();
        if (!blTrim) return;

        // Bullet line
        if (blTrim.startsWith("- ") || blTrim.startsWith("* ")) {
          const bulletContent = blTrim.replace(/^[\*\-]\s+/, "").trim();

          // Check if key-value pair like: **Key:** Value
          const kvMatch = bulletContent.match(/^\*\*(.*?)\*\*:?\s*(.*)$/);
          if (kvMatch) {
            const key = kvMatch[1].replace(/:$/, "").trim();
            const val = kvMatch[2].trim();
            if (key && val) {
              keyValues.push({ key, value: val });
              return;
            }
          }
          bullets.push(bulletContent);
        } else {
          paragraphs.push(blTrim);
        }
      });

      // Quick summary
      let quickSummary = "";
      if (paragraphs.length > 0) {
        const firstP = paragraphs[0];
        const sentenceMatch = firstP.match(/^([^\.\!\?]+[\.\!\?])/);
        quickSummary = sentenceMatch ? sentenceMatch[1] : firstP.slice(0, 160) + "...";
      } else if (bullets.length > 0) {
        quickSummary = bullets[0];
      }

      result.push({
        id: `supply-sec-${idx}`,
        rawTitle,
        displayTitle,
        iconType,
        quickSummary,
        paragraphs,
        bullets,
        keyValues,
        metaBadge,
        stepNumber
      });
    });

    return result;
  }, [content]);

  // Extract key indicators for the top KPI metric boxes
  const keyMetrics = useMemo(() => {
    if (!content) return null;

    // Detect fleet
    const fleetMatch = content.match(/(?:Armada|Spesifikasi Teknis|Spesifikasi Armada|Unit Armada)[^:\n]*:\s*([^\n\*\.]+)/i);
    // Detect utilization
    const utilMatch = content.match(/(?:Tingkat Utilisasi|Utilisasi Target|Utilisasi Armada)[^:\n]*:\s*([^\n\*\.]+)/i);
    // Detect availability or turnaround
    const availMatch = content.match(/(?:Ketersediaan Fisik|Kesiapan Unit|Physical Availability|Target PA)[^:\n]*:\s*([^\n\*\.]+)/i);
    // Detect buffer / contingency
    const bufferMatch = content.match(/(?:Buffer Fleet|Cadangan Armada|Unit Cadangan)[^:\n]*:\s*([^\n\*\.]+)/i);

    // Summary takeaway
    let summaryTakeaway = "";
    if (parsedSections.length > 0) {
      const supplySec = parsedSections.find((s) => s.iconType === "supply") || parsedSections[0];
      summaryTakeaway = supplySec.quickSummary || "Kapasitas armada dirancang seimbang dengan pola kebutuhan kargo koridor.";
    }

    return {
      fleet: fleetMatch ? fleetMatch[1].trim() : "Armada Heavy-Duty Terstandardisasi",
      utilization: utilMatch ? utilMatch[1].trim() : "82% - 88% Utilisasi Optimal",
      availability: availMatch ? availMatch[1].trim() : "Target Physical Availability > 90%",
      buffer: bufferMatch ? bufferMatch[1].trim() : "Buffer 10% Siaga Koridor",
      summaryTakeaway
    };
  }, [content, parsedSections]);

  // Markdown renderer for document view
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
              <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
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
          <div key={`h2-${index}`} className="mt-7 mb-3.5 border-b border-cyan-500/20 pb-2">
            <h3 className="text-base md:text-lg font-black text-cyan-300 uppercase tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
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
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
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

  // Render Core (Inti Pokok) View - Concise, Visual, Easy to Digest
  const renderCoreExecutiveView = () => {
    const supplySec = parsedSections.find((s) => s.iconType === "supply");
    const demandSec = parsedSections.find((s) => s.iconType === "demand");
    const eqSec = parsedSections.find((s) => s.iconType === "equilibrium");
    const contSec = parsedSections.find((s) => s.iconType === "contingency");
    const verdictSec = parsedSections.find((s) => s.iconType === "verdict");

    return (
      <div className="space-y-5">
        {/* Executive 30-Second Summary Card */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Gauge className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    INTI EKSEKUTIF • 30 DETIK BACA
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Keseimbangan Terukur
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  {keyMetrics?.summaryTakeaway ||
                    `Kapasitas pasokan armada diselaraskan secara presisi dengan profil fluktuasi muatan "${currentTitle}" guna menjamin ketepatan waktu pengiriman tanpa pemborosan unit menganggur.`}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
              <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Status Pasokan</div>
                <div className="text-xs font-black text-cyan-300 mt-0.5">OPTIMAL & LAYAK</div>
              </div>
              <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Target Utilisasi</div>
                <div className="text-xs font-black text-emerald-400 mt-0.5">85% - 92%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Visual Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Sisi Pasokan Armada */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 md:p-5 transition shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-cyan-400" />
                    Pasokan Armada & Kapasitas
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono">SUPPLY-SIDE CAPACITY</span>
                </div>
              </div>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Spesifikasi Fisik
              </span>
            </div>

            {/* Structured Key Values */}
            {supplySec && supplySec.keyValues.length > 0 ? (
              <div className="space-y-2">
                {supplySec.keyValues.slice(0, 3).map((kv, kvIdx) => (
                  <div key={kvIdx} className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-xs">
                    <span className="text-[11px] font-bold text-cyan-300 block mb-0.5">{kv.key}:</span>
                    <span className="text-slate-300 text-[11.5px] leading-relaxed">{kv.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-xs">
                  <span className="text-[11px] font-bold text-cyan-300 block mb-0.5">Spesifikasi Armada:</span>
                  <span className="text-slate-300 text-[11.5px]">{keyMetrics?.fleet}</span>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-xs">
                  <span className="text-[11px] font-bold text-cyan-300 block mb-0.5">Kesiapan Unit (PA):</span>
                  <span className="text-slate-300 text-[11.5px]">{keyMetrics?.availability}</span>
                </div>
              </div>
            )}

            {/* Bullets Highlight */}
            {supplySec && supplySec.bullets.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {supplySec.bullets.slice(0, 2).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{formatTextWithBold(b, "text-cyan-200")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Dinamika Permintaan */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 md:p-5 transition shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-amber-400" />
                    Karakteristik & Dinamika Permintaan
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">DEMAND DYNAMICS</span>
                </div>
              </div>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Pola Volume
              </span>
            </div>

            {demandSec && demandSec.paragraphs.length > 0 ? (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {formatTextWithBold(demandSec.paragraphs[0], "text-amber-200")}
              </div>
            ) : (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                Permintaan kargo B2B membutuhkan pasokan harian yang disiplin dengan penyesuaian jadwal pada jam puncak.
              </div>
            )}

            {/* Bullets Highlight */}
            {demandSec && demandSec.bullets.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {demandSec.bullets.slice(0, 2).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{formatTextWithBold(b, "text-amber-200")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Titik Keseimbangan & Utilisasi */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 md:p-5 transition shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-emerald-400" />
                    Keseimbangan & Efisiensi Utilisasi
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">EQUILIBRIUM & UTILIZATION</span>
                </div>
              </div>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Target: {keyMetrics?.utilization}
              </span>
            </div>

            {eqSec && eqSec.paragraphs.length > 0 ? (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {formatTextWithBold(eqSec.paragraphs[0], "text-emerald-200")}
              </div>
            ) : (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                Utilisasi armada dijaga pada tingkat optimal guna menyeimbangkan efisiensi biaya bahan bakar dengan keandalan jadwal SLA.
              </div>
            )}

            {/* Bullets Highlight */}
            {eqSec && eqSec.bullets.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {eqSec.bullets.slice(0, 2).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{formatTextWithBold(b, "text-emerald-200")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 4: Mitigasi Disrupsi & Kontinjensi */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 md:p-5 transition shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xs">
                  04
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    Mitigasi Disrupsi & Kontinjensi
                  </h4>
                  <span className="text-[10px] text-indigo-400 font-mono">RESILIENCE & CONTINUITY</span>
                </div>
              </div>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {keyMetrics?.buffer}
              </span>
            </div>

            {contSec && contSec.paragraphs.length > 0 ? (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {formatTextWithBold(contSec.paragraphs[0], "text-indigo-200")}
              </div>
            ) : (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                Penyediaan armada cadangan dan pemantauan telematika real-time menjamin kontinuitas pengiriman saat terjadi kendala jalan.
              </div>
            )}

            {/* Bullets Highlight */}
            {contSec && contSec.bullets.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {contSec.bullets.slice(0, 2).map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{formatTextWithBold(b, "text-indigo-200")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Verdict Banner */}
        {verdictSec && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="font-bold text-white">Rekomendasi Kapasitas:</span>
              <span className="text-slate-300">{verdictSec.quickSummary || "Konfigurasi armada dinyatakan seimbang dan siap dioperasikan secara bertahap."}</span>
            </div>
            <span className="shrink-0 font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
              FEASIBLE (GO)
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render Structured Cards (Kotak Rincian)
  const renderCardsView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parsedSections.map((sec, idx) => (
          <div
            key={sec.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                  {sec.stepNumber}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight">{sec.displayTitle}</h4>
              </div>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {sec.metaBadge}
              </span>
            </div>

            {/* Paragraphs */}
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-xs text-slate-300 leading-relaxed font-normal">
                {formatTextWithBold(p)}
              </p>
            ))}

            {/* Key Values */}
            {sec.keyValues.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {sec.keyValues.map((kv, kvIdx) => (
                  <div key={kvIdx} className="bg-slate-950/90 rounded-lg p-2 border border-slate-800 text-xs">
                    <span className="font-bold text-cyan-300">{kv.key}: </span>
                    <span className="text-slate-300">{kv.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bullets */}
            {sec.bullets.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {sec.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{formatTextWithBold(b)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent = content && lastGeneratedForTitle && lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="supply-demand-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 text-slate-100 shadow-2xl mt-8 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="border-b border-slate-800 pb-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9.5px] font-black tracking-wider uppercase rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-cyan-400" />
              PILAR 4 • SUPPLY & DEMAND EQUILIBRIUM
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
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
                  map[4] = content;
                  exportAllSectionsToWord(currentTitle, map);
                } catch(e) {
                  exportAllSectionsToWord(currentTitle, { 4: content });
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-cyan-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Buat isian baru yang sesuai dengan judul proyek"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-cyan-200" : ""}`} />
              <span>{isLoading ? "Menyusun Keseimbangan Pasokan..." : isBlank ? "Buat Isian Sesuai Judul" : "Buat Ulang Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        {/* Title and description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-cyan-400" />
              Supply & Demand Equilibrium & Fleet Capacity Dynamics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
              Kajian kapasitas pasokan armada, karakteristik permintaan volume, utilisasi optimal, dan mitigasi disrupsi khusus untuk proyek{" "}
              <span className="text-cyan-300 font-extrabold">"{currentTitle}"</span>.
            </p>
          </div>

          {/* View Mode Switcher */}
          {!isBlank && !isEditing && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto">
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
                title="Tampilan Rincian Kotak Per Bab"
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
                title="Tampilan Dokumen Narasi Lengkap"
              >
                <AlignLeft className="h-3.5 w-3.5" />
                <span>Dokumen Narasi</span>
              </button>
            </div>
          )}
        </div>
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
              <div className="h-10 w-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menyusun Keseimbangan Pasokan Sesuai Judul...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Menganalisis spesifikasi armada, ketersediaan fisik (PA), volatilitas volume permintaan, dan rencana kontinjensi untuk{" "}
              <span className="text-cyan-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-cyan-400" />
                <span>Mode Edit Teks Mandiri (Pilar 4)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Batal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Tuliskan kajian pasokan dan permintaan armada Anda di sini (mendukung format Markdown: ### Judul, **Tebal**, - Poin)..."
              rows={14}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500 transition leading-relaxed resize-y"
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
                Kanvas Keseimbangan Pasokan Masih Polos
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Belum ada isian untuk proyek <span className="text-cyan-300 font-bold">"{currentTitle}"</span>. Klik tombol di bawah untuk menghasilkan analisis armada dan dinamika permintaan yang 100% se-arah dengan judul ini, atau tulis sendiri secara manual.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerateContent(currentTitle)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-600/20 cursor-pointer active:scale-95"
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
          /* Populated Content */
          <div className="space-y-4">
            {/* Top Insight Bar */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-cyan-200 truncate">
                  Fokus Pasokan & Permintaan: <span className="text-white font-extrabold">{currentTitle}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded shrink-0 font-bold">
                100% Se-arah Judul
              </span>
            </div>

            {/* Dynamic View Mode Content */}
            {displayMode === "core" ? (
              renderCoreExecutiveView()
            ) : displayMode === "cards" ? (
              renderCardsView()
            ) : (
              <div className="prose prose-invert max-w-none">
                {renderSeamlessNarrative(content)}
              </div>
            )}

            {/* Footer Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Kajian pasokan aktif tersinkronisasi dengan judul proyek</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="hover:text-cyan-400 transition cursor-pointer font-medium"
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

