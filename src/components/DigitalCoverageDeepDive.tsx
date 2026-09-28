import React, { useState, useEffect } from "react";
import {
  Cpu,
  Database,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  FileText,
  Radio,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Layers,
  Activity,
  Server
} from "lucide-react";
import {
  generateDigitalCoverageForTitle,
  DigitalCoverageResult,
  ControlTowerNode,
  DigitalBudgetStage
} from "../utils/digitalCoverageGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface DigitalCoverageProps {
  projectTitle: string;
  activeDivision?: string;
}

export function DigitalCoverageDeepDive({ projectTitle, activeDivision }: DigitalCoverageProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik Darat & Telematika";

  const storageKey = `prama_digital_coverage_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const [data, setData] = useState<DigitalCoverageResult>(() => {
    return generateDigitalCoverageForTitle(currentTitle, currentDiv);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"publication" | "document">("publication");

  // Re-generate or load when projectTitle or division changes
  useEffect(() => {
    const generated = generateDigitalCoverageForTitle(currentTitle, currentDiv);
    setData(generated);
    setEditText(generated.narrativeMarkdown);
    setIsEditing(false);
  }, [currentTitle, currentDiv]);

  // Handler to generate fresh content
  const handleRefresh = async () => {
    setIsLoading(true);
    setIsEditing(false);
    try {
      const generated = generateDigitalCoverageForTitle(currentTitle, currentDiv);
      setData(generated);
      setEditText(generated.narrativeMarkdown);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
    } catch (err) {
      console.error("Error generating Digital Coverage:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (data.narrativeMarkdown) {
      navigator.clipboard.writeText(data.narrativeMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveEdit = () => {
    setData((prev) => ({
      ...prev,
      narrativeMarkdown: editText
    }));
    localStorage.setItem(storageKey, editText);
    setIsEditing(false);
  };

  return (
    <div
      id="digital-coverage-deepdive-root"
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 text-slate-800 shadow-sm mt-8 font-sans relative overflow-hidden"
    >
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                PILAR 14 • DIGITAL COVERAGE & CONTROL TOWER
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-xs sm:max-w-md">
                {currentTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Arsitektur digital control tower terpusat, telematika konvoi, sensor integritas kargo, dan roadmap biaya implementasi.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setDisplayMode("publication")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === "publication"
                  ? "bg-white text-cyan-800 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-600" />
              <span>Desain Publikasi</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("document")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === "document"
                  ? "bg-white text-cyan-800 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Naskah Narasi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              try {
                const saved = localStorage.getItem("prama_dashboard_sections");
                const map = saved ? JSON.parse(saved) : {};
                map[14] = data.narrativeMarkdown;
                exportAllSectionsToWord(currentTitle, map);
              } catch (e) {
                exportAllSectionsToWord(currentTitle, { 14: data.narrativeMarkdown });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            title="Unduh laporan Digital Coverage ke format Word (.doc)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Unduh Word</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Perbarui Digital Coverage sesuai judul dan data proyek"
          >
            {isLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
            )}
            <span>Sinkronkan Ulang</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Salin naskah ke clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Edit naskah secara langsung"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>{isEditing ? "Tutup Editor" : "Edit Teks"}</span>
          </button>
        </div>
      </div>

      {/* Direct Editor View */}
      {isEditing && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-cyan-800 flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              Editor Teks Digital Coverage (Markdown)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3.5 py-1 rounded-lg text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow transition cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-80 bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-cyan-600 leading-relaxed resize-y"
          />
        </div>
      )}

      {/* MAIN PUBLICATION VIEW: Matching the exact uploaded screenshot layout */}
      {displayMode === "publication" ? (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Section Heading with Clean Cyan Number & Teal Underline */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-cyan-900 tracking-tight flex items-baseline gap-2">
              <span className="text-cyan-700 font-mono text-2xl sm:text-3xl">14</span>
              <span>Digital Coverage & Control Tower</span>
            </h2>
            <div className="h-0.5 w-full bg-cyan-600/40 mt-1" />
          </div>

          {/* 1. VISUAL ARCHITECTURE SCHEMATIC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
            {/* Schematic Top Header */}
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[#0a2540] tracking-tight">
                Arsitektur Digital Control Tower
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-cyan-700 tracking-wide font-sans">
                {data.kpiBanner}
              </p>
            </div>

            {/* Architecture Node Map (Interactive & Responsive Visual Canvas) */}
            <div className="relative py-4 px-2 sm:px-6">
              {/* SVG Connector Lines for desktop view */}
              <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 900 320" fill="none">
                  {/* Left 4 incoming lines to center */}
                  {/* Node 1 to Center */}
                  <path d="M 230 45 L 360 145" stroke="#00909e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <polygon points="360,145 350,140 353,148" fill="#00909e" />
                  
                  {/* Node 2 to Center */}
                  <path d="M 230 115 L 360 155" stroke="#00909e" strokeWidth="1.5" />
                  <polygon points="360,155 350,150 351,158" fill="#00909e" />

                  {/* Node 3 to Center */}
                  <path d="M 230 195 L 360 165" stroke="#00909e" strokeWidth="1.5" />
                  <polygon points="360,165 351,162 350,170" fill="#00909e" />

                  {/* Node 4 to Center */}
                  <path d="M 230 265 L 360 175" stroke="#00909e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <polygon points="360,175 353,172 350,180" fill="#00909e" />

                  {/* Right 4 outgoing lines from center */}
                  {/* Center to Node 1 */}
                  <path d="M 540 145 L 670 45" stroke="#00909e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <polygon points="670,45 660,47 665,55" fill="#00909e" />

                  {/* Center to Node 2 */}
                  <path d="M 540 155 L 670 115" stroke="#00909e" strokeWidth="1.5" />
                  <polygon points="670,115 659,112 660,120" fill="#00909e" />

                  {/* Center to Node 3 */}
                  <path d="M 540 165 L 670 195" stroke="#00909e" strokeWidth="1.5" />
                  <polygon points="670,195 660,190 659,198" fill="#00909e" />

                  {/* Center to Node 4 */}
                  <path d="M 540 175 L 670 265" stroke="#00909e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <polygon points="670,265 665,255 660,263" fill="#00909e" />
                </svg>
              </div>

              {/* Grid of Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-center relative z-10">
                {/* Left Column: Inbound Data Sources */}
                <div className="space-y-2.5">
                  {data.inboundNodes.map((node, idx) => (
                    <div
                      key={node.id}
                      className="p-2.5 sm:p-3 rounded-xl border border-slate-300 bg-white shadow-2xs hover:border-cyan-500 hover:shadow-xs transition text-center flex flex-col justify-center min-h-[58px]"
                    >
                      <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                        {node.title}
                      </div>
                      <div className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                        {node.subtitle}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center Column: PANCARAN CONTROL TOWER HUB */}
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="w-full rounded-2xl bg-[#0f2b48] text-white p-5 sm:p-6 text-center shadow-lg border-2 border-cyan-500/30 flex flex-col justify-center items-center min-h-[140px] transform hover:scale-[1.02] transition">
                    <div className="text-xs sm:text-sm font-black tracking-wider uppercase mb-1 leading-snug">
                      {data.centerNodeTitle}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-cyan-300 font-medium italic mt-1">
                      {data.centerNodeSubtitle}
                    </div>
                  </div>
                </div>

                {/* Right Column: Outbound & Client Touchpoints */}
                <div className="space-y-2.5">
                  {data.outboundNodes.map((node, idx) => (
                    <div
                      key={node.id}
                      className="p-2.5 sm:p-3 rounded-xl border border-slate-300 bg-white shadow-2xs hover:border-cyan-500 hover:shadow-xs transition text-center flex flex-col justify-center min-h-[58px]"
                    >
                      <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                        {node.title}
                      </div>
                      <div className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 font-medium">
                        {node.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-[10.5px] text-slate-500 italic text-left pt-1">
              {data.diagramCaption}
            </p>
          </div>

          {/* 2. EXPLANATORY NARRATIVE PARAGRAPH */}
          <div className="text-xs sm:text-[12.5px] text-slate-700 leading-relaxed text-justify space-y-2">
            <p>{data.narrativeParagraph}</p>
          </div>

          {/* 3. IMPLEMENTATION BUDGET & ROADMAP TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0a2540] text-white">
                  <th className="py-3 px-4 font-bold w-36 sm:w-44">Tahap</th>
                  <th className="py-3 px-4 font-bold">Lingkup</th>
                  <th className="py-3 px-4 font-bold w-36 sm:w-48">Biaya Indikatif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {data.budgetTable.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 1
                        ? "bg-[#f0f7fc] hover:bg-[#e4eff8] transition"
                        : "bg-white hover:bg-slate-50 transition"
                    }
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 align-top">
                      {row.stage}
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed align-top">
                      {row.scope}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 align-top font-mono text-[11px]">
                      {row.indicativeCost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DOCUMENT / MARKDOWN NARRATIVE VIEW */
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 max-w-4xl mx-auto font-sans leading-relaxed">
          <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-4">
            {data.narrativeMarkdown.split("\n\n").map((block, bIdx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={bIdx} className="text-lg sm:text-xl font-black text-cyan-900 border-b pb-2">
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={bIdx} className="text-sm sm:text-base font-bold text-slate-900 mt-5 pt-2 border-t border-slate-200">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={bIdx} className="text-xs sm:text-sm font-bold text-cyan-800 mt-3">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("- ")) {
                return (
                  <ul key={bIdx} className="space-y-1.5 my-2 pl-4 list-disc text-slate-700">
                    {trimmed.split("\n").map((line, lIdx) => (
                      <li key={lIdx}>
                        {line.replace(/^- /, "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={bIdx} className="text-slate-700 leading-relaxed text-justify">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalCoverageDeepDive;
