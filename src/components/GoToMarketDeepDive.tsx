import React, { useState, useEffect } from "react";
import {
  Target,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  FileText,
  Briefcase,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Info
} from "lucide-react";
import {
  generateGoToMarketForTitle,
  GoToMarketResult,
  GTMPhaseItem
} from "../utils/goToMarketGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface GoToMarketProps {
  projectTitle: string;
  activeDivision?: string;
}

export function GoToMarketDeepDive({ projectTitle, activeDivision }: GoToMarketProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_gtm_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const [data, setData] = useState<GoToMarketResult>(() => {
    return generateGoToMarketForTitle(currentTitle, currentDiv);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<"publication" | "document">("publication");

  // Re-generate or load when projectTitle or division changes
  useEffect(() => {
    const generated = generateGoToMarketForTitle(currentTitle, currentDiv);
    setData(generated);
    setEditText(generated.narrativeMarkdown);
    setIsEditing(false);
  }, [currentTitle, currentDiv]);

  // Handler to generate fresh, 100% title-tailored content
  const handleRefresh = async () => {
    setIsLoading(true);
    setIsEditing(false);
    try {
      const generated = generateGoToMarketForTitle(currentTitle, currentDiv);
      setData(generated);
      setEditText(generated.narrativeMarkdown);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
    } catch (err) {
      console.error("Error generating Go-To-Market:", err);
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
      id="go-to-market-deepdive-root"
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 text-slate-800 shadow-sm mt-8 font-sans relative overflow-hidden"
    >
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                PILAR 12 • GO-TO-MARKET STRATEGY
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-xs sm:max-w-md">
                {currentTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roadmap penetrasi pasar bertahap, proposisi nilai, struktur harga, kanal penjualan, dan pemasaran teknis B2B.
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
                map[12] = data.narrativeMarkdown;
                exportAllSectionsToWord(currentTitle, map);
              } catch (e) {
                exportAllSectionsToWord(currentTitle, { 12: data.narrativeMarkdown });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            title="Unduh laporan Go-To-Market ke format Word (.doc)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Unduh Word</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Perbarui Go-To-Market sesuai judul dan data proyek"
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
              Editor Teks Go-To-Market Strategy (Markdown)
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
              <span className="text-cyan-700 font-mono text-2xl sm:text-3xl">12</span>
              <span>Go-to-Market Strategy</span>
            </h2>
            <div className="h-0.5 w-full bg-cyan-600/40 mt-1" />
          </div>

          {/* Phase Roadmap Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0a2540] text-white">
                  <th className="py-3 px-4 font-bold w-32 sm:w-36">Fase</th>
                  <th className="py-3 px-4 font-bold w-36 sm:w-44">Waktu</th>
                  <th className="py-3 px-4 font-bold">Fokus</th>
                  <th className="py-3 px-4 font-bold w-48 sm:w-60">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {data.phaseRoadmap.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 1
                        ? "bg-[#f0f7fc] hover:bg-[#e4eff8] transition"
                        : "bg-white hover:bg-slate-50 transition"
                    }
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                      {item.phase}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 align-top font-mono text-[11px]">
                      {item.timing}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 leading-relaxed align-top text-justify">
                      {item.focus}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 leading-relaxed align-top">
                      {item.target}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bullet Points Strategy Section */}
          <div className="space-y-2.5 pt-2 text-xs sm:text-[12.5px] text-slate-800 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-slate-900 font-bold select-none">•</span>
              <div>
                <strong className="text-slate-900 font-extrabold">Proposisi nilai:</strong>{" "}
                <span className="text-slate-700">{data.valueProposition}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-slate-900 font-bold select-none">•</span>
              <div>
                <strong className="text-slate-900 font-extrabold">Pricing:</strong>{" "}
                <span className="text-slate-700">{data.pricingStrategy}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-slate-900 font-bold select-none">•</span>
              <div>
                <strong className="text-slate-900 font-extrabold">Kanal:</strong>{" "}
                <span className="text-slate-700">{data.salesChannels}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-slate-900 font-bold select-none">•</span>
              <div>
                <strong className="text-slate-900 font-extrabold">Pemasaran teknis:</strong>{" "}
                <span className="text-slate-700">{data.technicalMarketing}</span>
              </div>
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

export default GoToMarketDeepDive;
