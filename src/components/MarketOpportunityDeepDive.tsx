import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
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
  Target,
  BarChart3,
  Sun,
  Moon,
  Download,
  SlidersHorizontal,
  LayoutGrid,
  AlignLeft,
  Truck,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList
} from "recharts";
import { generateMarketOpportunityForTitle } from "../utils/marketOpportunityGenerator.ts";
import { exportAllSectionsToWord, exportAllSectionsToPDF } from "../utils/projectDashboardHelper.ts";
import {
  generateMarketOpportunityReportData,
  MarketOpportunityReportData,
  BenchmarkProjectItem
} from "../utils/marketOpportunityReportGenerator.ts";

interface MarketOpportunityProps {
  projectTitle: string;
  activeDivision?: string;
}

export function MarketOpportunityDeepDive({ projectTitle, activeDivision }: MarketOpportunityProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Peluang Pasar Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi Komersial";

  const storageKey = `prama_market_opp_content_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Content starts loaded or saved
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem(storageKey) || "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  
  // Default to publication-grade Executive Visual Report view ("executive")
  const [displayMode, setDisplayMode] = useState<"executive" | "core" | "cards" | "document">("executive");
  const [paperTheme, setPaperTheme] = useState<"light" | "dark">("light");

  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || "";
  });

  // Dynamic Executive Data generated specifically for the active title
  const reportData: MarketOpportunityReportData = useMemo(() => {
    return generateMarketOpportunityReportData(currentTitle, currentDiv);
  }, [currentTitle, currentDiv]);

  // When projectTitle changes, load the saved content for that title
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
      const res = await fetch("/api/generate-market-opportunity", {
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
        const localResult = generateMarketOpportunityForTitle(targetTitle, currentDiv);
        generatedMarkdown = localResult.narrativeMarkdown;
      }

      setContent(generatedMarkdown);
      setEditText(generatedMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, generatedMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } catch (err) {
      console.warn("Generating local tailored market opportunity for:", targetTitle, err);
      const localResult = generateMarketOpportunityForTitle(targetTitle, currentDiv);
      setContent(localResult.narrativeMarkdown);
      setEditText(localResult.narrativeMarkdown);
      setLastGeneratedForTitle(targetTitle);
      localStorage.setItem(storageKey, localResult.narrativeMarkdown);
      localStorage.setItem(`${storageKey}_title`, targetTitle);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to start editing manually
  const handleStartEdit = () => {
    setEditText(content || generateMarketOpportunityForTitle(currentTitle, currentDiv).narrativeMarkdown);
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
    const textToCopy = content || generateMarketOpportunityForTitle(currentTitle, currentDiv).narrativeMarkdown;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlank = !content || content.trim().length === 0;
  const isTitleDifferent = content && lastGeneratedForTitle && lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="market-opportunity-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 text-slate-100 shadow-2xl mt-8 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Left Badge Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/25 font-mono flex items-center gap-1.5 shadow-xs">
              <TrendingUp className="h-3.5 w-3.5 text-teal-400" />
              03 MARKET OPPORTUNITY, SUPPLY & DEMAND
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              Kajian: <strong className="text-slate-100">{currentTitle}</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Commercial Viability
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
                title="Tampilkan layout laporan eksekutif lengkap dengan grafik benchmark & tabel proyek"
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
                exportAllSectionsToPDF(currentTitle, { 2: content || generateMarketOpportunityForTitle(currentTitle, currentDiv).narrativeMarkdown });
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
                exportAllSectionsToWord(currentTitle, { 2: content || generateMarketOpportunityForTitle(currentTitle, currentDiv).narrativeMarkdown });
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-teal-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
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
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                  Market Opportunity, Supply & Demand
                </h3>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono">
                  Pilar 03
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                Kajian dinamika permintaan pasar, struktur pasokan/OEM, benchmark proyek komparatif, dan peluang komersial terintegrasi untuk{" "}
                <span className="text-teal-300 font-bold">"{currentTitle}"</span>.
              </p>
            </div>
          </div>
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
            <span>Sinkronkan Analisis Pasar</span>
          </button>
        </div>
      )}

      {/* VIEWPORT: Switch between Executive Report vs Core Cards vs Text */}
      {displayMode === "executive" ? (
        /* =========================================================================
           PUBLICATION-GRADE 2-PAGE EXECUTIVE REPORT VIEW (MATCHING USER MOCKUP)
           ========================================================================= */
        <div className="space-y-8">
          {/* PAGE 1: DEMAND, SUPPLY & BENCHMARK CHART */}
          <div
            className={`rounded-2xl p-6 md:p-10 transition-all border shadow-2xl ${
              paperTheme === "light"
                ? "bg-white text-slate-900 border-slate-200"
                : "bg-slate-950 text-slate-100 border-slate-800"
            }`}
          >
            {/* Top Page Number & Title Accent */}
            <div className="border-b-2 border-teal-500 pb-2 mb-6">
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-teal-600 flex items-center gap-2">
                <span className="text-teal-500 font-mono">03</span>
                <span>Market Opportunity, Supply & Demand</span>
              </h2>
            </div>

            {/* Section 1: Sisi Permintaan (Demand) */}
            <div className="space-y-3 mb-6">
              <h3 className={`text-sm md:text-base font-bold tracking-tight ${paperTheme === "light" ? "text-slate-900" : "text-white"}`}>
                {reportData.demandSection.title}
              </h3>
              <ul className="space-y-2.5">
                {reportData.demandSection.bullets.map((b, idx) => (
                  <li
                    key={`dem-${idx}`}
                    className={`text-xs md:text-[12.5px] leading-relaxed flex items-start gap-2 ${
                      paperTheme === "light" ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>
                      <strong className={paperTheme === "light" ? "text-slate-900 font-bold" : "text-white font-bold"}>
                        {b.category}:
                      </strong>{" "}
                      {b.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Sisi Pasokan (Supply) */}
            <div className="space-y-3 mb-6">
              <h3 className={`text-sm md:text-base font-bold tracking-tight ${paperTheme === "light" ? "text-slate-900" : "text-white"}`}>
                {reportData.supplySection.title}
              </h3>
              <ul className="space-y-2.5">
                {reportData.supplySection.bullets.map((b, idx) => (
                  <li
                    key={`sup-${idx}`}
                    className={`text-xs md:text-[12.5px] leading-relaxed flex items-start gap-2 ${
                      paperTheme === "light" ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>
                      <strong className={paperTheme === "light" ? "text-slate-900 font-bold" : "text-white font-bold"}>
                        {b.category}:
                      </strong>{" "}
                      {b.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Benchmark Horizontal Bar Chart (Gambar 3.1) */}
            <div className={`my-6 p-4 md:p-6 rounded-xl border ${paperTheme === "light" ? "bg-slate-50/70 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
              <div className="text-center mb-3">
                <h4 className={`text-xs md:text-sm font-bold ${paperTheme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                  {reportData.benchmarkChart.title}
                </h4>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={reportData.benchmarkChart.data}
                    margin={{ top: 10, right: 60, left: 40, bottom: 10 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: paperTheme === "light" ? "#475569" : "#94a3b8" }}
                      axisLine={{ stroke: paperTheme === "light" ? "#cbd5e1" : "#475569" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={160}
                      tick={{ fontSize: 9.5, fontWeight: "bold", fill: paperTheme === "light" ? "#334155" : "#cbd5e1" }}
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
                    <Bar dataKey="capacity" radius={[0, 4, 4, 0]} maxBarSize={18}>
                      <LabelList
                        dataKey="displayCapacity"
                        position="right"
                        style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          fill: paperTheme === "light" ? "#0f172a" : "#f8fafc"
                        }}
                      />
                      {reportData.benchmarkChart.data.map((entry, index) => (
                        <Cell key={`bm-cell-${index}`} fill={entry.statusColor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-center gap-4 mt-2 flex-wrap text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#0d9488]" />
                  <span className={paperTheme === "light" ? "text-slate-600" : "text-slate-300"}>Beroperasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#f59e0b]" />
                  <span className={paperTheme === "light" ? "text-slate-600" : "text-slate-300"}>PPA ditandatangani / Tertunda</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#64748b]" />
                  <span className={paperTheme === "light" ? "text-slate-600" : "text-slate-300"}>Pipeline / Rencana</span>
                </div>
              </div>

              {/* Caption */}
              <p className="text-[10px] text-slate-500 italic text-center mt-2.5">
                {reportData.benchmarkChart.figureCaption}
              </p>
            </div>

            {/* Section 4: Comparative Benchmark Table */}
            <div className="overflow-x-auto my-6">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e2a47] text-white font-bold">
                    <th className="p-2.5 border border-slate-700 w-1/4">Proyek</th>
                    <th className="p-2.5 border border-slate-700 w-1/4">Kapasitas & Teknologi</th>
                    <th className="p-2.5 border border-slate-700 w-1/4">Tarif / Nilai</th>
                    <th className="p-2.5 border border-slate-700 w-1/4">Catatan relevan</th>
                  </tr>
                </thead>
                <tbody className={paperTheme === "light" ? "text-slate-700" : "text-slate-300"}>
                  {reportData.benchmarkTable.rows.slice(0, 4).map((row, rIdx) => (
                    <tr
                      key={`t-row-${rIdx}`}
                      className={
                        rIdx % 2 === 0
                          ? paperTheme === "light" ? "bg-slate-50/50" : "bg-slate-900/30"
                          : paperTheme === "light" ? "bg-white" : "bg-slate-900/80"
                      }
                    >
                      <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                        {row.name}
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-800">
                        {row.techDetails}
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-[10.5px]">
                        {row.tariffOrValue}
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-[10.5px]">
                        {row.relevantNotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Page 1 Footer */}
            <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>PRAMA Strategic AI Advisory • PT Pancaran Group</span>
              <span>Halaman 1 dari 2</span>
            </div>
          </div>

          {/* PAGE 2: CORPORATE BANNER & CAPACITY FACTOR/ENERGY ANALYSIS */}
          <div
            className={`rounded-2xl p-6 md:p-10 transition-all border shadow-2xl ${
              paperTheme === "light"
                ? "bg-white text-slate-900 border-slate-200"
                : "bg-slate-950 text-slate-100 border-slate-800"
            }`}
          >
            {/* Corporate Banner */}
            <div className="bg-[#0e2a47] text-white px-4 py-2.5 rounded-lg flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] font-bold tracking-wider mb-6 shadow-sm gap-2">
              <span className="uppercase">{reportData.corporateBanner.left}</span>
              <span className="font-mono text-teal-300 text-[10px]">{reportData.corporateBanner.right}</span>
            </div>

            {/* Continuation Table Rows if any */}
            {reportData.benchmarkTable.rows.length > 4 && (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0e2a47] text-white font-bold">
                      <th className="p-2.5 border border-slate-700 w-1/4">Proyek</th>
                      <th className="p-2.5 border border-slate-700 w-1/4">Kapasitas & Teknologi</th>
                      <th className="p-2.5 border border-slate-700 w-1/4">Tarif / Nilai</th>
                      <th className="p-2.5 border border-slate-700 w-1/4">Catatan relevan</th>
                    </tr>
                  </thead>
                  <tbody className={paperTheme === "light" ? "text-slate-700" : "text-slate-300"}>
                    {reportData.benchmarkTable.rows.slice(4).map((row, rIdx) => (
                      <tr
                        key={`t-row-cont-${rIdx}`}
                        className={
                          rIdx % 2 === 0
                            ? paperTheme === "light" ? "bg-slate-50/50" : "bg-slate-900/30"
                            : paperTheme === "light" ? "bg-white" : "bg-slate-900/80"
                        }
                      >
                        <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="p-2.5 border border-slate-200 dark:border-slate-800">
                          {row.techDetails}
                        </td>
                        <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-[10.5px]">
                          {row.tariffOrValue}
                        </td>
                        <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-[10.5px]">
                          {row.relevantNotes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Commercial Baseline & Capacity Factor Narrative */}
            <div className={`p-4 md:p-5 rounded-xl border ${paperTheme === "light" ? "bg-slate-50/70 border-slate-200" : "bg-slate-900/80 border-slate-800"} my-6`}>
              <h4 className={`text-xs md:text-sm font-bold mb-2 ${paperTheme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                Asumsi Jangkar Model Bisnis & Kapasitas
              </h4>
              <p className={`text-xs md:text-[12.5px] leading-relaxed text-justify ${paperTheme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                {reportData.continuationNotes}
              </p>
            </div>

            {/* Page 2 Footer */}
            <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>PRAMA Strategic AI Advisory • PT Pancaran Group</span>
              <span>Halaman 2 dari 2</span>
            </div>
          </div>
        </div>
      ) : displayMode === "core" ? (
        /* =========================================================================
           CORE SUMMARY VIEW
           ========================================================================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wide">Peluang Sisi Permintaan</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {reportData.demandSection.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span><strong>{b.category}:</strong> {b.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wide">Dinamika Sisi Pasokan & Celah Pasar</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {reportData.supplySection.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span><strong>{b.category}:</strong> {b.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : displayMode === "cards" ? (
        /* =========================================================================
           DETAILED CARDS VIEW
           ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportData.benchmarkTable.rows.map((row, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{row.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${row.statusColor}25`, color: row.statusColor }}>
                  {row.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2">{row.techDetails}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <p><strong>Tarif / Nilai:</strong> {row.tariffOrValue}</p>
                <p className="mt-1">{row.relevantNotes}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =========================================================================
           RAW MARKDOWN VIEW
           ========================================================================= */
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
            <span className="text-xs font-bold text-slate-400">Dokumen Narasi (Raw Markdown)</span>
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
            {content || generateMarketOpportunityForTitle(currentTitle, currentDiv).narrativeMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
}
