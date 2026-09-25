import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Info
} from "lucide-react";
import {
  generateRiskManagementForTitle,
  RiskManagementResult,
  PlottedRiskItem
} from "../utils/riskManagementGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface RiskManagementProps {
  projectTitle: string;
  activeDivision?: string;
}

export function RiskManagementDeepDive({ projectTitle, activeDivision }: RiskManagementProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_risk_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const [data, setData] = useState<RiskManagementResult>(() => {
    return generateRiskManagementForTitle(currentTitle, currentDiv);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"publication" | "document">("publication");

  // Re-generate or load when projectTitle or division changes
  useEffect(() => {
    const generated = generateRiskManagementForTitle(currentTitle, currentDiv);
    setData(generated);
    setEditText(generated.narrativeMarkdown);
    setIsEditing(false);
  }, [currentTitle, currentDiv]);

  // Handler to generate fresh content
  const handleRefresh = async () => {
    setIsLoading(true);
    setIsEditing(false);
    try {
      const generated = generateRiskManagementForTitle(currentTitle, currentDiv);
      setData(generated);
      setEditText(generated.narrativeMarkdown);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
    } catch (err) {
      console.error("Error generating Risk Management:", err);
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

  // 5x5 Matrix Labels
  const impactLabels = ["Kritis", "Besar", "Signifikan", "Moderat", "Minor"];
  const probLabels = ["Sangat rendah", "Rendah", "Sedang", "Tinggi", "Sangat tinggi"];

  // Cell background color helper for 5x5 Matrix matching exact reference image
  // Row 0 = Kritis, Row 4 = Minor. Col 0 = Sangat rendah, Col 4 = Sangat tinggi.
  const getCellColor = (rowIdx: number, colIdx: number) => {
    // Top-Right high risk zone (red/pink)
    if (
      (rowIdx === 0 && colIdx >= 2) || // Kritis (Sedang, Tinggi, Sangat tinggi)
      (rowIdx === 1 && colIdx >= 3) || // Besar (Tinggi, Sangat tinggi)
      (rowIdx === 2 && colIdx === 4)   // Signifikan (Sangat tinggi)
    ) {
      return "bg-[#f59e9e]/85"; // Soft red/pink
    }

    // Bottom-Left low risk zone (aqua/teal/light-green)
    if (
      (rowIdx === 4) ||                 // Minor (all cols)
      (rowIdx === 3 && colIdx <= 1) ||  // Moderat (Sangat rendah, Rendah)
      (rowIdx <= 2 && colIdx === 0)     // All (Sangat rendah)
    ) {
      return "bg-[#99e2d0]/75"; // Soft teal/aqua
    }

    // Middle zone (amber/peach)
    return "bg-[#fcd3a2]/80"; // Soft peach/amber
  };

  return (
    <div
      id="risk-management-deepdive-root"
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 text-slate-800 shadow-sm mt-8 font-sans relative overflow-hidden"
    >
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                PILAR 16 • RISK ANALYSIS & MITIGATION
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-xs sm:max-w-md">
                {currentTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Heat map matriks risiko 5x5, pemetaan risiko proyek vs logistik, dan protokol mitigasi komprehensif.
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
                map[16] = data.narrativeMarkdown;
                exportAllSectionsToWord(currentTitle, map);
              } catch (e) {
                exportAllSectionsToWord(currentTitle, { 16: data.narrativeMarkdown });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            title="Unduh laporan Risk Analysis ke format Word (.doc)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Unduh Word</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Perbarui Risk Analysis sesuai judul dan data proyek"
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
              Editor Teks Risk Analysis (Markdown)
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
              <span className="text-cyan-700 font-mono text-2xl sm:text-3xl">16</span>
              <span>Risk Analysis</span>
            </h2>
            <div className="h-0.5 w-full bg-cyan-600/40 mt-1" />
          </div>

          {/* 1. VISUAL 5x5 RISK HEAT MAP CANVAS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
            {/* Heat Map Title */}
            <div className="text-center">
              <h3 className="text-sm sm:text-base font-black text-[#0a2540] tracking-tight">
                {data.heatMapTitle}
              </h3>
            </div>

            {/* Matrix & Axis Container */}
            <div className="max-w-2xl mx-auto py-2">
              <div className="flex">
                {/* Y-Axis Label (Dampak) */}
                <div className="flex items-center justify-center pr-2">
                  <span className="text-[11px] font-bold text-slate-600 -rotate-90 select-none tracking-wider">
                    Dampak
                  </span>
                </div>

                {/* Y-Axis Ticks + 5x5 Grid */}
                <div className="flex-1">
                  <div className="flex">
                    {/* Y-Axis Tick Names */}
                    <div className="flex flex-col justify-between pr-2 py-3 text-[10px] sm:text-[11px] font-medium text-slate-600 text-right w-16 select-none">
                      {impactLabels.map((lbl, idx) => (
                        <div key={idx} className="h-14 flex items-center justify-end">
                          {lbl}
                        </div>
                      ))}
                    </div>

                    {/* 5x5 Grid Canvas with Absolute Plotted Dots */}
                    <div className="flex-1 relative aspect-square max-h-[340px] border border-slate-300 rounded-lg overflow-hidden shadow-inner">
                      {/* Grid Cells */}
                      <div className="grid grid-cols-5 grid-rows-5 h-full w-full">
                        {Array.from({ length: 5 }).map((_, rIdx) =>
                          Array.from({ length: 5 }).map((_, cIdx) => (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={`border-b border-r border-slate-300/40 last:border-r-0 ${getCellColor(
                                rIdx,
                                cIdx
                              )}`}
                            />
                          ))
                        )}
                      </div>

                      {/* Plotted Risk Points */}
                      {data.plottedRisks.map((item) => {
                        // Map prob (1-5) to X (0% to 100%)
                        // prob 1 -> 10%, prob 5 -> 90%
                        const leftPct = ((item.prob - 0.5) / 5) * 100;
                        // Map impact (1-5) to Y (100% to 0%) -> impact 5 is top (10%), impact 1 is bottom (90%)
                        const topPct = 100 - ((item.impact - 0.5) / 5) * 100;

                        return (
                          <div
                            key={item.id}
                            style={{
                              left: `${Math.min(Math.max(leftPct, 8), 92)}%`,
                              top: `${Math.min(Math.max(topPct, 6), 92)}%`
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                          >
                            <div className="flex items-center gap-1">
                              {/* Dot */}
                              <div
                                className={`h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-xs transition transform group-hover:scale-150 ${
                                  item.category === "core"
                                    ? "bg-[#142850]"
                                    : "bg-[#7c2d12]"
                                }`}
                              />
                              {/* Label text directly plotted on map */}
                              <span
                                className={`text-[8.5px] sm:text-[9.5px] font-bold leading-none tracking-tight whitespace-nowrap drop-shadow-xs select-none ${
                                  item.category === "core"
                                    ? "text-[#0f2b48]"
                                    : "text-[#7c2d12]"
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>

                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 pointer-events-none">
                              <div className="bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl whitespace-normal w-48 leading-snug">
                                <div className="font-bold text-cyan-300">{item.id}: {item.riskName}</div>
                                <div className="text-slate-300 text-[9px] mt-0.5">P×D: <strong>{item.pxD}</strong></div>
                                <div className="text-slate-400 text-[8.5px] mt-1 italic">{item.mitigation}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* X-Axis Ticks (Probabilitas) */}
                  <div className="grid grid-cols-5 pl-16 pt-2 text-[9.5px] sm:text-[10.5px] font-medium text-slate-600 text-center select-none">
                    {probLabels.map((lbl, idx) => (
                      <div key={idx} className="truncate px-0.5">
                        {lbl}
                      </div>
                    ))}
                  </div>

                  {/* X-Axis Label */}
                  <div className="text-center pt-2 select-none">
                    <span className="text-[11px] font-bold text-slate-600 tracking-wider">
                      Probabilitas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-[10.5px] text-slate-500 italic text-left pt-1">
              {data.diagramCaption}
            </p>
          </div>

          {/* 2. COMPREHENSIVE RISK MITIGATION REGISTER TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0a2540] text-white">
                  <th className="py-3 px-3.5 font-bold w-14 text-center">Kode</th>
                  <th className="py-3 px-3.5 font-bold w-60 sm:w-72">Risiko</th>
                  <th className="py-3 px-3.5 font-bold w-28 text-center sm:text-left">P × D</th>
                  <th className="py-3 px-3.5 font-bold">Mitigasi utama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {data.plottedRisks.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={
                      idx % 2 === 1
                        ? "bg-[#f0f7fc] hover:bg-[#e4eff8] transition"
                        : "bg-white hover:bg-slate-50 transition"
                    }
                  >
                    <td className="py-3 px-3.5 font-bold text-slate-700 text-center font-mono align-top">
                      {row.id}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900 leading-snug align-top">
                      {row.riskName}
                    </td>
                    <td className="py-3 px-3.5 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          row.pxD === "Tinggi" || row.pxD === "Tinggi dampak"
                            ? "bg-rose-100 text-rose-800"
                            : row.pxD === "Sedang"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {row.pxD}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 leading-relaxed align-top">
                      {row.mitigation}
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

export default RiskManagementDeepDive;
