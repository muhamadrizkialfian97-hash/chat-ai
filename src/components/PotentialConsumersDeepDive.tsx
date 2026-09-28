import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Trash2,
  Save,
  X,
  Building2,
  Briefcase,
  Layers,
  FileCheck2,
  Scale,
  Award,
  AlertCircle,
  LayoutGrid,
  AlignLeft,
  CheckCircle2,
  TrendingUp,
  Target,
  FileSpreadsheet,
  Handshake,
  DollarSign,
  ShieldCheck,
  Info,
  FileText,
  SlidersHorizontal,
  CheckCircle,
  Zap,
  Tag
} from "lucide-react";
import {
  generatePotentialConsumersForTitle,
  PotentialConsumersResult,
  CustomerSegmentRow
} from "../utils/potentialConsumersGenerator";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface PotentialConsumersProps {
  projectTitle: string;
  activeDivision?: string;
}

export function PotentialConsumersDeepDive({ projectTitle, activeDivision }: PotentialConsumersProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_potential_consumers_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Active view tab: "table" (Slide 06 format matching executive deck), "dmu" (Buyer Personas), "document" (Markdown)
  const [activeTab, setActiveTab] = useState<"table" | "dmu" | "document">("table");

  // Real-time calculated structured data
  const data: PotentialConsumersResult = useMemo(() => {
    return generatePotentialConsumersForTitle(currentTitle, currentDiv);
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

  // When projectTitle changes, sync and update data
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

  // Handler to generate fresh content
  const handleGenerateContent = async (targetTitle: string = currentTitle) => {
    setIsLoading(true);
    setIsEditing(false);

    try {
      const generated = generatePotentialConsumersForTitle(targetTitle, currentDiv);
      setContent(generated.narrativeMarkdown);
      setEditText(generated.narrativeMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generated.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.error("Error generating Potential Consumers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to wipe content and make it polos
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

  const getPriorityBadgeClass = (priority: string) => {
    const pLower = priority.toLowerCase();
    if (pLower.includes("sangat tinggi")) {
      return "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold";
    }
    if (pLower.includes("anchor")) {
      return "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold";
    }
    if (pLower.includes("tinggi")) {
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold";
    }
    if (pLower.includes("menengah")) {
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    }
    return "bg-slate-700/60 text-slate-300";
  };

  const isTitleDifferent =
    content &&
    lastGeneratedForTitle &&
    lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="potential-consumers-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl mt-2 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Actions Toolbar */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 font-mono flex items-center gap-1.5 shadow-sm">
              <Users className="h-3.5 w-3.5 text-teal-400" />
              PILAR 06 / 16 • CUSTOMER POTENTIAL & MARKET DEMAND
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              PROYEK: {currentTitle}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Tab Switcher */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "table"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Tabel Segmen (06)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dmu")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "dmu"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>DMU & Kontrak</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("document")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "document"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
                <span>Dokumen Penuh</span>
              </button>
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
                  map[16] = content || data.narrativeMarkdown;
                  exportAllSectionsToWord(currentTitle, map);
                } catch (e) {
                  exportAllSectionsToWord(currentTitle, { 16: content || data.narrativeMarkdown });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              title="Unduh seluruh laporan ke format Word (.doc)"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-teal-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Sinkronkan ulang pemetaan konsumen sesuai judul proyek"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-teal-200" : ""}`} />
              <span>{isLoading ? "Menghitung..." : "Sinkronkan Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        {/* Title Header matching the Executive Document Presentation */}
        <div className="pt-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-black text-teal-400 tracking-tight font-display">
              06
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-display">
              Customer Potential
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
            Pemetaan segmen pelanggan, contoh akun target publik, kebutuhan utama & prioritas komersial pada sektor{" "}
            <span className="text-teal-300 font-extrabold">{data.sectorName}</span>
          </p>
          {/* Cyan/Teal Horizontal Accent Rule */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 rounded-full mt-3 opacity-90 shadow-sm" />
        </div>
      </div>

      {/* Sync notification if title changed */}
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

      {/* Main Presentation Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-inner relative">
        {isLoading ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
              <Sparkles className="h-5 w-5 text-teal-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menyintesis Segmen Konsumen Potensial & Target Akun...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Memetakan struktur pengadaan, persona DMU, persyaratan kepatuhan teknis, dan pola pembelian untuk{" "}
              <span className="text-teal-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-teal-400" />
                <span>Mode Edit Teks Mandiri (Pilar 06: Customer Potential)</span>
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
              placeholder="Tuliskan analisis konsumen potensial di sini..."
              rows={14}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-teal-500 transition leading-relaxed resize-y"
            />
          </div>
        ) : activeTab === "table" ? (
          /* Primary Executive View: Structured 4-Column Table matching uploaded slide 06 */
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 border-t-3 border-t-teal-500 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Total Segmen Target
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">
                  {data.customerSegments.length} Segmen Industri
                </div>
                <div className="text-[11px] text-teal-400 font-semibold mt-0.5">
                  ✓ IPP, OEM, EPC & Captive
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 border-t-3 border-t-rose-500 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Prioritas Akuisisi
                </div>
                <div className="text-base sm:text-lg font-black text-rose-300 mt-0.5">
                  Sangat Tinggi (Kanal Volume)
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  ★ OEM Turbin & Owner Langsung
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 border-t-3 border-t-cyan-500 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Struktur Kontrak
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">
                  Multi-Year (LTSA)
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold mt-0.5">
                  ● Tenor 24–36 Bulan Terikat
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 border-t-3 border-t-amber-500 shadow-sm">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Kriteria Kelaikan
                </div>
                <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5">
                  SLA 98.5% & HSSE
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  ✓ Bebas ODOL & K3 Terverifikasi
                </div>
              </div>
            </div>

            {/* Executive Customer Potential Table matching uploaded Image 06 */}
            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-lg">
              <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#0b1d33] text-white border-b border-slate-700">
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs w-36 md:w-48">
                      Segmen
                    </th>
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs w-64 md:w-80">
                      Contoh (publik)
                    </th>
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs">
                      Kebutuhan utama
                    </th>
                    <th className="py-3 px-4 font-black uppercase tracking-wider text-xs text-right w-36 md:w-48">
                      Prioritas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900 text-slate-200">
                  {data.customerSegments.map((row: CustomerSegmentRow, idx: number) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-800/80 ${
                          isEven ? "bg-slate-900/90" : "bg-slate-950/70"
                        }`}
                      >
                        {/* Segmen */}
                        <td className="py-3.5 px-4 font-extrabold text-white align-top">
                          <div className="flex items-center gap-1.5">
                            <span>{row.segment}</span>
                          </div>
                        </td>

                        {/* Contoh (publik) */}
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed align-top">
                          {row.publicExamples}
                        </td>

                        {/* Kebutuhan utama */}
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed align-top">
                          {row.primaryNeed}
                        </td>

                        {/* Prioritas */}
                        <td className="py-3.5 px-4 text-right align-top whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono tracking-tight shadow-sm ${getPriorityBadgeClass(
                              row.priority
                            )}`}
                          >
                            {row.priority}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Buying Pattern Narrative Box matching the bottom text in the image */}
            <div className="bg-slate-900/90 border-l-4 border-teal-500 rounded-r-xl p-4.5 text-slate-200 text-xs md:text-sm leading-relaxed text-justify shadow-sm">
              <p>
                <strong className="text-teal-300 font-extrabold">Pola pembelian:</strong>{" "}
                {data.buyingPatternNote.replace(/^Pola pembelian:\s*/i, "")}
              </p>
            </div>

            {/* Footer Summary */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Pemetaan konsumen potensial tersinkronisasi otomatis dengan judul proyek</span>
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
        ) : activeTab === "dmu" ? (
          /* DMU & Contract Framework Tab */
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Profil Decision-Making Unit (DMU) & Kriteria Pembelian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {data.dmuProfiles.map((dmu, dIdx) => (
                  <div key={dIdx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                        {dmu.role}
                      </span>
                    </div>
                    <div className="font-extrabold text-white text-sm">
                      {dmu.title}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong className="text-slate-400">Fokus Utama:</strong> {dmu.primaryConcern}
                    </div>
                    <div className="text-xs text-teal-300/90">
                      <strong className="text-teal-400">Kriteria Seleksi:</strong> {dmu.buyingCriteria}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4" />
                Struktur Ketentuan Kontrak Komersial
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {data.contractTerms.map((ct, cIdx) => (
                  <div key={cIdx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      {ct.parameter}
                    </div>
                    <div className="text-sm font-black text-white">
                      {ct.standardTerm}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {ct.strategicNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Full Document Markdown View */
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-slate-200 text-xs md:text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {content || data.narrativeMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
