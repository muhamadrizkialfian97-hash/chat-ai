import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  TrendingUp,
  DollarSign,
  Target,
  Truck,
  Compass,
  Info
} from "lucide-react";
import { generateTamSamSomForTitle, TamSamSomResult } from "../utils/tamSamSomGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface TamSamSomDeepDiveProps {
  projectTitle: string;
  activeDivision?: string;
}

export function TamSamSomDeepDive({ projectTitle, activeDivision }: TamSamSomDeepDiveProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Potensi Pasar Logistik TAM SAM SOM";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_tamsamsom_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Generate real-time structured data for current title in Indonesian Rupiah (IDR)
  const data: TamSamSomResult = useMemo(() => {
    return generateTamSamSomForTitle(currentTitle, currentDiv);
  }, [currentTitle, currentDiv]);

  // Saved narrative markdown content
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || data.narrativeMarkdown;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || currentTitle;
  });

  // When projectTitle prop changes, sync data and update content
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setContent(saved);
      setEditText(saved);
    } else {
      setContent(data.narrativeMarkdown);
      setEditText(data.narrativeMarkdown);
      localStorage.setItem(storageKey, data.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, currentTitle);
    }
    setLastGeneratedForTitle(currentTitle);
    setIsEditing(false);
  }, [currentTitle, storageKey, data.narrativeMarkdown]);

  // Handler to generate fresh, 100% title-tailored content
  const handleGenerateContent = async (targetTitle: string = currentTitle) => {
    setIsLoading(true);
    setIsEditing(false);

    try {
      const clientApiKey = localStorage.getItem("workspace_client_api_key") || "";
      const res = await fetch("/api/generate-tamsamsom", {
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
        const resData = await res.json();
        if (resData && resData.content && typeof resData.content === "string" && resData.content.trim().length > 50) {
          generatedMarkdown = resData.content;
        }
      }

      if (!generatedMarkdown) {
        const localResult = generateTamSamSomForTitle(targetTitle, currentDiv);
        generatedMarkdown = localResult.narrativeMarkdown;
      }

      setContent(generatedMarkdown);
      setEditText(generatedMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generatedMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.warn("Generating local tailored TAM SAM SOM for:", targetTitle, err);
      const localResult = generateTamSamSomForTitle(targetTitle, currentDiv);
      setContent(localResult.narrativeMarkdown);
      setEditText(localResult.narrativeMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, localResult.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to wipe content and make it blank/polos
  const handleClearAll = () => {
    setContent("");
    setEditText("");
    setIsEditing(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_title`);
  };

  // Handler to start editing manually
  const handleStartEdit = () => {
    setEditText(content || data.narrativeMarkdown);
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
    const textToCopy = content || data.narrativeMarkdown;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent =
    content &&
    lastGeneratedForTitle &&
    lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="tamsamsom-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl mt-2 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Actions Bar */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 font-mono flex items-center gap-1.5 shadow-sm">
              <Layers className="h-3.5 w-3.5 text-teal-400" />
              PILAR 04 / 12 • TAM, SAM, SOM MARKET SIZING
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              PROYEK: {currentTitle}
            </span>
          </div>

          {/* Action buttons toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Valuta Standar Rupiah badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Valuta Standar: Rupiah (IDR / Rp)</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 shadow-sm cursor-pointer active:scale-95"
              title="Salin analisis lengkap ke clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem("prama_dashboard_sections");
                  const map = saved ? JSON.parse(saved) : {};
                  map[12] = content || data.narrativeMarkdown;
                  exportAllSectionsToWord(currentTitle, map);
                } catch (e) {
                  exportAllSectionsToWord(currentTitle, { 12: content || data.narrativeMarkdown });
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-teal-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Sinkronisasi ulang perhitungan sesuai judul proyek"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-teal-200" : ""}`} />
              <span>{isLoading ? "Menghitung..." : "Sinkronkan Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        {/* Title & Section Header matching the Executive Document Presentation */}
        <div className="pt-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-black text-teal-400 tracking-tight font-display">
              04
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-display">
              TAM / SAM / SOM
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
            Ukuran pasar layanan{" "}
            <span className="text-teal-300 font-extrabold">{data.sectorName}</span> di Indonesia ({data.timelineRange})
          </p>
          {/* Cyan/Teal Horizontal Accent Rule */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 rounded-full mt-3 opacity-90 shadow-sm" />
        </div>
      </div>

      {/* Sync notification badge if title was recently altered */}
      {isTitleDifferent && (
        <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
            <span>
              Judul proyek aktif: <strong className="text-white">"{currentTitle}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateContent(currentTitle)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hitung Ulang Sesuai Judul Baru</span>
          </button>
        </div>
      )}

      {/* Main Executive Presentation Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-inner relative">
        {isLoading ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
              <Sparkles className="h-5 w-5 text-teal-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menghitung Estimasi Sizing Pasar TAM, SAM, SOM...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Memetakan volume komoditas regional, benchmark tarif indikatif, filter jangkauan koridor, dan alokasi kapasitas untuk{" "}
              <span className="text-teal-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-teal-400" />
                <span>Mode Edit Teks Mandiri (Pilar 04 / 12: TAM, SAM, SOM)</span>
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
                  className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Tuliskan analisis potensi pasar TAM, SAM, SOM di sini..."
              rows={14}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-teal-500 transition leading-relaxed resize-y"
            />
          </div>
        ) : (
          /* Populated Executive Slide / Dashboard View matching uploaded image */
          <div className="space-y-8">
            
            {/* Top Infographic Area: Concentric Circles (Left) + Breakdown Annotations (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              
              {/* Left Column: Concentric Circles Diagram */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
                  
                  {/* Outer Circle: TAM */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-500/80 via-slate-600/80 to-slate-700/90 border-2 border-slate-400/40 shadow-xl flex flex-col items-center pt-5 sm:pt-6 transition-transform hover:scale-[1.01]">
                    <span className="text-xs sm:text-sm font-black tracking-widest text-white/90 uppercase font-mono">
                      TAM
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-sm">
                      {data.tamValueShortIdr}
                    </span>
                  </div>

                  {/* Middle Circle: SAM (Centered inside bottom-half) */}
                  <div className="absolute bottom-3 w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 border-2 border-teal-300/60 shadow-2xl flex flex-col items-center pt-4 sm:pt-5 transition-transform hover:scale-[1.02]">
                    <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-mono">
                      SAM
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight drop-shadow-sm">
                      {data.samValueShortIdr}
                    </span>
                  </div>

                  {/* Inner Bottom Circle: SOM */}
                  <div className="absolute bottom-4 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-600 shadow-2xl flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-[1.03]">
                    <span className="text-xs font-black tracking-widest text-teal-300 uppercase font-mono">
                      SOM
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-white tracking-tight leading-tight">
                      {data.somValueShortIdr}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wide font-bold">
                    Valuta Standar: Rupiah (IDR / Rp)
                  </span>
                </div>
              </div>

              {/* Right Column: Structured Analytical Callouts */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
                
                {/* TAM Callout */}
                <div className="space-y-1 pl-3 border-l-3 border-slate-400">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                    {data.tamCallout.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {data.tamCallout.formula}
                  </p>
                  <p className="text-xs font-bold text-slate-300">
                    {data.tamCallout.subText}
                  </p>
                </div>

                {/* SAM Callout */}
                <div className="space-y-1 pl-3 border-l-3 border-teal-400">
                  <h4 className="text-xs sm:text-sm font-black text-teal-300 tracking-tight">
                    {data.samCallout.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {data.samCallout.formula}
                  </p>
                  <p className="text-xs font-bold text-teal-200">
                    {data.samCallout.subText}
                  </p>
                </div>

                {/* SOM Callout */}
                <div className="space-y-1 pl-3 border-l-3 border-cyan-400">
                  <h4 className="text-xs sm:text-sm font-black text-cyan-300 tracking-tight">
                    {data.somCallout.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {data.somCallout.formula}
                  </p>
                  <p className="text-xs font-bold text-cyan-200">
                    {data.somCallout.subText}
                  </p>
                </div>

                {/* Footnote Note */}
                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 italic">
                    Estimasi analitik; tarif per unit/ton/MW adalah benchmark indikatif (analisis parameter operasional dalam Rupiah).
                  </p>
                </div>
              </div>
            </div>

            {/* Figure Caption matching document standard */}
            <div className="text-xs text-slate-400 font-medium italic -mt-4 pl-1">
              {data.figureCaption}
            </div>

            {/* Executive Structured Table (Dark Navy Header & High Contrast Grid) */}
            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-md">
              <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#0b1d33] text-white border-b border-slate-700">
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs w-28 md:w-36">
                      Lapisan
                    </th>
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs">
                      Definisi & asumsi
                    </th>
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs text-right w-44 md:w-60">
                      Nilai (Rupiah / Rp)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
                  {data.tableData.map((row, idx) => {
                    const isAdjacent = row.isAdjacent;
                    const valText = row.valueIdr;
                    
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-800/60 ${
                          isAdjacent ? "bg-slate-900/40 italic" : idx % 2 === 0 ? "bg-slate-900/90" : "bg-slate-950/60"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-black text-white whitespace-nowrap align-top">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                              row.layer === "TAM"
                                ? "bg-slate-700 text-slate-200"
                                : row.layer === "SAM"
                                ? "bg-teal-900/80 text-teal-300 border border-teal-700/50"
                                : row.layer === "SOM"
                                ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {row.layer}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed align-top">
                          {row.definition}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-right text-teal-300 whitespace-normal align-top">
                          {valText}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* In-Depth Analytical Sector Narrative Paragraph */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-slate-300 text-xs md:text-sm leading-relaxed text-justify space-y-3">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider font-mono">
                <Info className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Kajian Narasi Analitis Sektor Terpadu</span>
              </div>
              <p>
                {data.deepDiveNarrative}
              </p>
            </div>

            {/* Footer Status & Edit Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Analisis TAM / SAM / SOM aktif terhubung real-time dengan judul proyek</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="hover:text-teal-300 transition cursor-pointer font-medium flex items-center gap-1"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Teks Mandiri</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="hover:text-rose-400 transition cursor-pointer font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Kosongkan</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
