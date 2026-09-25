import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  FileText,
  Truck,
  Layers,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Shield,
  Anchor,
  Maximize2
} from "lucide-react";
import {
  generateServiceDesignForTitle,
  ServiceDesignResult,
  WorkflowStageItem,
  CargoComponentSpec
} from "../utils/serviceDesignGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface ServiceDesignProps {
  projectTitle: string;
  activeDivision?: string;
}

export function ServiceDesignDeepDive({ projectTitle, activeDivision }: ServiceDesignProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi";

  const storageKey = `prama_service_design_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts loaded from generator or saved
  const [data, setData] = useState<ServiceDesignResult>(() => {
    return generateServiceDesignForTitle(currentTitle, currentDiv);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"publication" | "document">("publication");

  // Re-generate when title or division changes
  useEffect(() => {
    const generated = generateServiceDesignForTitle(currentTitle, currentDiv);
    setData(generated);
    setEditText(generated.narrativeMarkdown);
    setIsEditing(false);
  }, [currentTitle, currentDiv]);

  // Handler to generate fresh content
  const handleRefresh = async () => {
    setIsLoading(true);
    setIsEditing(false);
    try {
      const generated = generateServiceDesignForTitle(currentTitle, currentDiv);
      setData(generated);
      setEditText(generated.narrativeMarkdown);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
    } catch (err) {
      console.error("Error generating Service Design:", err);
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
      id="service-design-deepdive-root"
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 text-slate-800 shadow-sm mt-3 font-sans relative overflow-hidden"
    >
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                PILAR 15 • SERVICE DESIGN BLUEPRINT
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-xs sm:max-w-md">
                {currentTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rantai layanan end-to-end terintegrasi, spesifikasi kargo, matriks eksekusi 11 tahap, dan standar K3/Regulasi.
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
                map[15] = data.narrativeMarkdown;
                exportAllSectionsToWord(currentTitle, map);
              } catch (e) {
                exportAllSectionsToWord(currentTitle, { 15: data.narrativeMarkdown });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            title="Unduh laporan Service Design ke format Word (.doc)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Unduh Word</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Perbarui Service Design sesuai judul dan data proyek"
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
              Editor Teks Service Design (Markdown)
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

      {/* MAIN PUBLICATION VIEW: Matching the exact uploaded PDF document layout */}
      {displayMode === "publication" ? (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* SECTION HEADER */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-cyan-900 tracking-tight flex items-baseline gap-2">
              <span className="text-cyan-700 font-mono">08</span>
              <span>Pancaran / PRAMA Logistic — Service Design End-to-End</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium italic">
              {data.headerSubtitle}
            </p>
            <div className="h-0.5 w-full bg-cyan-600/30 mt-2" />
          </div>

          {/* 1. VISUAL WORKFLOW PROCESS DIAGRAM */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              {data.workflowTitle}
            </h3>

            {/* Flowchart Diagram Grid */}
            <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200">
              {/* Row 1: International & Border (Steps 01 - 06) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 mb-4">
                {data.endToEndWorkflow.slice(0, 6).map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-1.5">
                    <div
                      className={`flex-1 rounded-xl p-2.5 sm:p-3 text-white text-center flex flex-col justify-center min-h-[76px] shadow-xs transition hover:scale-[1.02] ${
                        step.stageGroup === "international"
                          ? "bg-[#142850] hover:bg-[#1f3c75]"
                          : "bg-[#00909e] hover:bg-[#00a8b8]"
                      }`}
                    >
                      <div className="text-[10px] font-black opacity-75 font-mono mb-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2">
                        {step.title}
                      </div>
                    </div>
                    {idx < 5 && (
                      <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>

              {/* Connecting indicator from Row 1 to Row 2 */}
              <div className="flex justify-end pr-8 mb-2 hidden md:flex">
                <div className="h-4 w-0.5 bg-slate-300" />
              </div>

              {/* Row 2: Domestic & Installation (Steps 07 - 11) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {data.endToEndWorkflow.slice(6, 11).map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-1.5">
                    <div
                      className={`flex-1 rounded-xl p-2.5 sm:p-3 text-white text-center flex flex-col justify-center min-h-[76px] shadow-xs transition hover:scale-[1.02] ${
                        step.stageGroup === "domestic"
                          ? "bg-[#00909e] hover:bg-[#00a8b8]"
                          : "bg-[#e26a2c] hover:bg-[#eb7d43]"
                      }`}
                    >
                      <div className="text-[10px] font-black opacity-75 font-mono mb-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2">
                        {step.title}
                      </div>
                    </div>
                    {idx < 4 && (
                      <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>

              {/* Color Legends */}
              <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-slate-200 text-[10.5px] font-bold text-slate-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-xs bg-[#142850]" />
                  <span>International & border</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-xs bg-[#00909e]" />
                  <span>Domestic heavy logistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-xs bg-[#e26a2c]" />
                  <span>Installation & lifecycle</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-[10.5px] text-slate-500 italic text-center">
              {data.workflowCaption}
            </p>
          </div>

          {/* 2. CARGO ANATOMY & TECHNICAL SPECIFICATIONS */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight text-center">
              {data.cargoAnatomy.title}
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Visual Schematic SVG */}
              <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[220px]">
                {data.cargoAnatomy.diagramType === "wind_turbine" ? (
                  <div className="relative w-full max-w-[200px] h-[200px] flex items-center justify-center">
                    {/* Wind Turbine SVG Schematic */}
                    <svg viewBox="0 0 200 220" className="w-full h-full stroke-cyan-800 fill-none">
                      {/* Tower */}
                      <line x1="100" y1="70" x2="95" y2="200" strokeWidth="3" />
                      <line x1="100" y1="70" x2="105" y2="200" strokeWidth="3" />
                      <line x1="85" y1="200" x2="115" y2="200" strokeWidth="4" />
                      {/* Nacelle & Hub */}
                      <rect x="90" y="60" width="22" height="12" rx="2" fill="#00909e" stroke="#142850" strokeWidth="1.5" />
                      <circle cx="90" cy="66" r="5" fill="#e26a2c" stroke="#142850" strokeWidth="1.5" />
                      {/* Blades */}
                      <line x1="90" y1="66" x2="90" y2="10" stroke="#00909e" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="90" y1="66" x2="35" y2="110" stroke="#00909e" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="90" y1="66" x2="145" y2="110" stroke="#00909e" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Annotations */}
                      <text x="10" y="115" fontSize="7" fill="#64748b" className="font-mono">Tip height: 160–240 m</text>
                      <text x="100" y="45" fontSize="7" fill="#00909e" className="font-mono">Blade 75–95m</text>
                    </svg>
                  </div>
                ) : data.cargoAnatomy.diagramType === "logging_truck" ? (
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <Truck className="h-16 w-16 text-cyan-700 mb-2" />
                    <span className="text-[11px] font-bold text-slate-700">Logging Heavy Rig 6×4</span>
                    <span className="text-[9.5px] text-slate-500">Kapasitas 45 Ton • Stanchion Steel</span>
                  </div>
                ) : data.cargoAnatomy.diagramType === "bulk_cement" ? (
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <Anchor className="h-16 w-16 text-cyan-700 mb-2" />
                    <span className="text-[11px] font-bold text-slate-700">Tangki Hi-Blow V-Shape Pneumatik</span>
                    <span className="text-[9.5px] text-slate-500">Tekanan Kerja 2.0 Bar • 34 m³</span>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <Truck className="h-16 w-16 text-cyan-700 mb-2" />
                    <span className="text-[11px] font-bold text-slate-700">Armada Logistik Terdedikasi</span>
                    <span className="text-[9.5px] text-slate-500">Spesifikasi Angkutan Standar Korporasi</span>
                  </div>
                )}
                <span className="text-[9px] text-slate-400 mt-2 font-mono">
                  Dimensi platform offshore & onshore (indikatif)
                </span>
              </div>

              {/* Right Column: Specification Cards Table */}
              <div className="md:col-span-7 space-y-2 text-xs">
                {data.cargoAnatomy.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block sm:inline mr-2">
                        {comp.name}
                      </span>
                      <span className="text-[10.5px] text-cyan-700 font-medium">
                        {comp.transportMode}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      {comp.dimensionWeight}
                    </span>
                  </div>
                ))}

                {/* Operational note box */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[10.5px] text-blue-900 leading-relaxed mt-2 font-medium">
                  {data.cargoAnatomy.operationalNotes.split("\n").map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 italic text-center">
              {data.cargoAnatomy.imageCaption}
            </p>
          </div>

          {/* 3. 11-STAGE COMPREHENSIVE EXECUTION MATRIX TABLE */}
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0a2540] text-white">
                    <th className="py-3 px-3.5 font-bold w-10 text-center">#</th>
                    <th className="py-3 px-3.5 font-bold w-44">Tahap</th>
                    <th className="py-3 px-3.5 font-bold">Aktivitas kunci</th>
                    <th className="py-3 px-3.5 font-bold w-48">Peran Pancaran / Operator</th>
                    <th className="py-3 px-3.5 font-bold w-40">KPI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {data.endToEndWorkflow.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={idx % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-100/70"}
                    >
                      <td className="py-2.5 px-3.5 font-bold text-center text-slate-500 font-mono">
                        {row.id}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">
                        {row.title}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 leading-relaxed">
                        {row.keyActivities}
                      </td>
                      <td className="py-2.5 px-3.5 text-cyan-800 font-semibold text-[11px]">
                        {row.operatorRole}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 font-mono text-[10.5px]">
                        {row.kpi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CATATAN DESAIN PENTING (REGULATORY & STRATEGIC HIGHLIGHTS) */}
          <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200 text-xs text-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-950 text-sm flex items-center gap-1.5">
              <Info className="h-4 w-4 text-cyan-700" />
              Catatan desain penting & pertimbangan strategis:
            </h4>
            <div className="space-y-2 pl-1 leading-relaxed text-[11.5px] text-slate-700">
              {data.designNotes.map((note, nIdx) => (
                <div key={nIdx} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-700 mt-1.5 shrink-0" />
                  <div>
                    {note.includes(":") ? (
                      <>
                        <strong className="text-slate-900">{note.split(":")[0]}:</strong>
                        <span>{note.split(":")[1]}</span>
                      </>
                    ) : (
                      <span>{note}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

export default ServiceDesignDeepDive;
