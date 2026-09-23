import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  BookOpen,
  Layers,
  Eye,
  Bookmark,
  TrendingUp
} from "lucide-react";
import {
  generatePDFBlobUrl,
  downloadPDFDirect,
  generateAcademicPDFBlobUrl,
  downloadAcademicMakalahPDFDirect
} from "../utils/documentExporter";
import {
  generateMarketOpportunityMakalah,
  generateAcademicMakalah,
  AcademicMakalahData
} from "../utils/academicMakalahGenerator";

interface PillarPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillarNumber: number;
  pillarTitle: string;
  pillarContent: string;
  projectTitle: string;
  activeDivision?: string | null;
  renderMarkdown?: (text: string) => React.ReactNode;
  onApplyToDraft?: (content: string) => void;
}

export const PillarPDFModal: React.FC<PillarPDFModalProps> = ({
  isOpen,
  onClose,
  pillarNumber,
  pillarTitle,
  pillarContent,
  projectTitle,
  activeDivision = "Logistik Darat",
  renderMarkdown,
  onApplyToDraft
}) => {
  const [viewMode, setViewMode] = useState<"pdf_viewer" | "document_sheet">("pdf_viewer");
  const [formatStyle, setFormatStyle] = useState<"market_opportunity" | "academic_makalah" | "standard_pillar">("market_opportunity");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState("");

  // Dynamically generate data depending on style
  const marketOppData: AcademicMakalahData = generateMarketOpportunityMakalah(
    projectTitle,
    pillarNumber,
    pillarTitle,
    activeDivision || "Logistik Darat"
  );

  const academicData: AcademicMakalahData = generateAcademicMakalah(
    projectTitle,
    pillarNumber,
    pillarTitle,
    activeDivision || "Logistik Darat"
  );

  const activeData = formatStyle === "market_opportunity" ? marketOppData : academicData;

  useEffect(() => {
    if (!isOpen) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      return;
    }

    setIsGenerating(true);
    try {
      if (formatStyle === "market_opportunity" || formatStyle === "academic_makalah") {
        const targetData = formatStyle === "market_opportunity" ? marketOppData : academicData;
        const res = generateAcademicPDFBlobUrl({
          bannerTitle: targetData.bannerTitle,
          subtitle: targetData.subtitle,
          topic: targetData.topic,
          reviewType: targetData.reviewType,
          formatLabel: targetData.formatLabel,
          shortTitle: targetData.shortTitle,
          markdownContent: targetData.markdownContent,
          divisionName: activeDivision || "Logistik Darat"
        });
        setPdfBlobUrl(res.blobUrl);
        setFileName(res.fileName);
      } else {
        const formattedDocTitle = `MAKALAH KAJIAN STRATEGIS: PILAR ${pillarNumber} - ${pillarTitle.toUpperCase()} | ${projectTitle.toUpperCase()}`;
        const headerBlock = `# MAKALAH STRATEGIS: PILAR ${pillarNumber}. ${pillarTitle.toUpperCase()}\n\n**PROYEK:** ${projectTitle.toUpperCase()}  \n**DIVISI:** ${(activeDivision || "LOGISTIK DARAT").toUpperCase()}  \n**KATEGORI:** KAJIAN KELAYAKAN KOMPREHENSIF  \n**TANGGAL:** ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n\n---\n\n${pillarContent}`;

        const res = generatePDFBlobUrl(
          formattedDocTitle,
          headerBlock,
          activeDivision || "LOGISTIK DARAT",
          `PILAR #${pillarNumber} - ${pillarTitle.toUpperCase()}`
        );
        setPdfBlobUrl(res.blobUrl);
        setFileName(res.fileName);
      }
    } catch (err) {
      console.error("Error generating PDF blob URL:", err);
    } finally {
      setIsGenerating(false);
    }

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [isOpen, formatStyle, pillarNumber, pillarTitle, pillarContent, projectTitle, activeDivision]);

  if (!isOpen) return null;

  const currentContentToExport =
    formatStyle === "market_opportunity"
      ? marketOppData.markdownContent
      : formatStyle === "academic_makalah"
      ? academicData.markdownContent
      : pillarContent;

  const handleDownload = () => {
    if (formatStyle === "market_opportunity" || formatStyle === "academic_makalah") {
      const targetData = formatStyle === "market_opportunity" ? marketOppData : academicData;
      downloadAcademicMakalahPDFDirect({
        bannerTitle: targetData.bannerTitle,
        subtitle: targetData.subtitle,
        topic: targetData.topic,
        reviewType: targetData.reviewType,
        formatLabel: targetData.formatLabel,
        shortTitle: targetData.shortTitle,
        markdownContent: targetData.markdownContent,
        divisionName: activeDivision || "Logistik Darat"
      });
    } else {
      const formattedDocTitle = `MAKALAH KAJIAN STRATEGIS: PILAR ${pillarNumber} - ${pillarTitle.toUpperCase()} | ${projectTitle.toUpperCase()}`;
      const headerBlock = `# MAKALAH STRATEGIS: PILAR ${pillarNumber}. ${pillarTitle.toUpperCase()}\n\n**PROYEK:** ${projectTitle.toUpperCase()}  \n**DIVISI:** ${(activeDivision || "LOGISTIK DARAT").toUpperCase()}  \n**KATEGORI:** KAJIAN KELAYAKAN KOMPREHENSIF  \n**TANGGAL:** ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n\n---\n\n${pillarContent}`;
      downloadPDFDirect(formattedDocTitle, headerBlock, activeDivision || "LOGISTIK DARAT");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContentToExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const printWindow = window.open(pdfBlobUrl);
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleApply = () => {
    if (onApplyToDraft) {
      onApplyToDraft(currentContentToExport);
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  };

  const wordCount = currentContentToExport.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 140));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="flex flex-col bg-white rounded-3xl w-full max-w-6xl h-[95vh] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Dark Header Bar */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white px-5 py-3.5 border-b border-teal-900 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 shadow-inner">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase font-mono">
                  {formatStyle === "market_opportunity"
                    ? "MAKALAH PELUANG PASAR (SESUAI CONTOH PDF)"
                    : "MAKALAH STRATEGIS & AKADEMIK"}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {activeData.topic} • {activeDivision || "Logistik Darat"}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black text-white tracking-tight uppercase font-display mt-0.5 line-clamp-1">
                {activeData.bannerTitle}
              </h3>
              <p className="text-[11px] font-medium text-slate-300 line-clamp-1">
                Menyesuaikan Judul: <span className="text-teal-200 font-bold">{projectTitle}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons & Format Switcher */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {/* Format Style Selector */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setFormatStyle("market_opportunity")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  formatStyle === "market_opportunity"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Format Makalah Peluang Pasar persis seperti contoh PDF (Global vs Nat, Key Takeaway Box, Matriks 4 Kolom)"
              >
                <TrendingUp className="h-3.5 w-3.5 text-teal-300" />
                <span>Peluang Pasar (Contoh PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatStyle("academic_makalah")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  formatStyle === "academic_makalah"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Format Kajian Strategis 5 Bagian"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                <span>Kajian 5 Bagian</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatStyle("standard_pillar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  formatStyle === "standard_pillar"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Tampilan Draf Pilar Asli"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Draf Asli</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("pdf_viewer")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  viewMode === "pdf_viewer"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>PDF Asli</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("document_sheet")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  viewMode === "document_sheet"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Naskah A4</span>
              </button>
            </div>

            {onApplyToDraft && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition cursor-pointer"
                title="Terapkan teks makalah ini ke workspace editor draf pilar"
              >
                {applied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Tersimpan di Draf!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Gunakan di Draf</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Salin teks makalah ini"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Salin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Cetak PDF ini"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl shadow-lg shadow-teal-950/40 transition cursor-pointer active:scale-95 border border-teal-400/30"
              title="Unduh file PDF resmi makalah ini"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh PDF (.pdf)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 ml-1"
              title="Tutup jendela (Esc)"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-slate-100 p-3 md:p-6 overflow-hidden flex flex-col">
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold tracking-wide uppercase font-mono">
                Menyusun Dokumen Makalah PDF ({projectTitle})...
              </p>
            </div>
          ) : viewMode === "pdf_viewer" ? (
            pdfBlobUrl ? (
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-300 bg-slate-800 relative flex flex-col">
                <iframe
                  src={`${pdfBlobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full flex-1 border-none rounded-2xl"
                  title={`PDF Makalah: ${activeData.bannerTitle}`}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 text-center">
                <FileText className="h-12 w-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-700">Pratinjau PDF Sedang Dimuat</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Anda dapat langsung mengunduh file dokumen PDF resmi makalah ini melalui tombol di atas.
                </p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Unduh PDF Sekarang
                </button>
              </div>
            )
          ) : (
            /* Document Sheet / A4 Paper View */
            <div className="flex-1 overflow-y-auto pr-1 flex justify-center">
              <div className="bg-white min-h-[75vh] w-full max-w-3xl rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-slate-800 relative overflow-hidden font-sans">
                {formatStyle === "market_opportunity" ? (
                  <>
                    {/* HERO BANNER - Exact layout like PDF page 1 */}
                    <div className="bg-[#0a4d46] text-white rounded-2xl p-6 mb-4 shadow-sm">
                      <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight font-display">
                        {marketOppData.bannerTitle}
                      </h1>
                      <p className="text-xs sm:text-sm text-teal-100 font-medium mt-2 leading-relaxed opacity-95">
                        {marketOppData.subtitle}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center justify-between text-xs py-2 border-b border-slate-200 mb-8 font-sans gap-3">
                      <div>
                        <span className="font-bold text-slate-900">Topik: </span>
                        <span className="text-slate-600">{marketOppData.topic}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Aspek Kajian: </span>
                        <span className="text-slate-600">{marketOppData.reviewType}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Format: </span>
                        <span className="text-slate-600">{marketOppData.formatLabel}</span>
                      </div>
                    </div>

                    {/* SECTION 1 */}
                    {marketOppData.sections.sector1 && (
                      <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            1. {marketOppData.sections.sector1.title}
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-3">
                          1.1 Peluang Pasar Global (Global Market Opportunity)
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-6">
                          {marketOppData.sections.sector1.globalItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <strong className="text-slate-900">{item.label}: </strong>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>

                        <h3 className="text-sm font-bold text-teal-800 mb-3">
                          1.2 Peluang Pasar Nasional (Indonesia)
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-6">
                          {marketOppData.sections.sector1.nationalItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <strong className="text-slate-900">{item.label}: </strong>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Mint Key Takeaway Box */}
                        <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-xs">
                          <div className="font-bold text-emerald-800 mb-1">
                            Key Takeaway - Sektor Utama:
                          </div>
                          <p className="text-slate-700">{marketOppData.sections.sector1.keyTakeaway}</p>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2 */}
                    {marketOppData.sections.sector2 && (
                      <div className="mb-10 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            2. {marketOppData.sections.sector2.title}
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-3">
                          2.1 Peluang Pasar Global (Global Market Opportunity)
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-6">
                          {marketOppData.sections.sector2.globalItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <strong className="text-slate-900">{item.label}: </strong>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>

                        <h3 className="text-sm font-bold text-teal-800 mb-3">
                          2.2 Peluang Pasar Nasional (Indonesia)
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-6">
                          {marketOppData.sections.sector2.nationalItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <strong className="text-slate-900">{item.label}: </strong>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Mint Key Takeaway Box */}
                        <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-xs">
                          <div className="font-bold text-emerald-800 mb-1">
                            Key Takeaway - Sektor Terkait:
                          </div>
                          <p className="text-slate-700">{marketOppData.sections.sector2.keyTakeaway}</p>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: 4-COLUMN MATRIX TABLE */}
                    {marketOppData.sections.matrix4Col && (
                      <div className="mb-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            3. MATRIKS RINGKASAN PELUANG PASAR
                          </h2>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200 mb-4">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[#0a4d46] text-white font-bold">
                                <th className="p-3 w-1/4 border-r border-teal-800">Sektor Logistik</th>
                                <th className="p-3 w-1/4 border-r border-teal-800">Segmen Utama Pendorong</th>
                                <th className="p-3 w-1/4 border-r border-teal-800">Peluang Pasar Global</th>
                                <th className="p-3 w-1/4">Peluang Pasar Indonesia (NAT)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {marketOppData.sections.matrix4Col.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}>
                                  <td className="p-3 font-bold text-slate-900 border-r border-slate-200 align-top">
                                    {row.sector}
                                  </td>
                                  <td className="p-3 text-slate-700 border-r border-slate-200 align-top">
                                    {row.segment}
                                  </td>
                                  <td className="p-3 text-slate-700 border-r border-slate-200 align-top whitespace-pre-line">
                                    {row.global}
                                  </td>
                                  <td className="p-3 text-slate-700 align-top whitespace-pre-line">
                                    {row.national}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <p className="text-[11px] text-center italic text-slate-400 pt-4 border-t border-slate-100">
                          Dokumen Laporan Analisis Peluang Pasar (Market Opportunity) - Manajemen Transportasi Logistik.
                        </p>
                      </div>
                    )}

                    {/* Running Paper Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
                      <div>{marketOppData.shortTitle}</div>
                      <div>Halaman 1 dari 3</div>
                    </div>
                  </>
                ) : formatStyle === "academic_makalah" ? (
                  <>
                    {/* Academic 5-Part View */}
                    <div className="bg-[#0a4d46] text-white rounded-2xl p-6 mb-4 shadow-sm">
                      <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight font-display">
                        {academicData.bannerTitle}
                      </h1>
                      <p className="text-xs sm:text-sm text-teal-100 font-medium mt-2 leading-relaxed opacity-95">
                        {academicData.subtitle}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center justify-between text-xs py-2 border-b border-slate-200 mb-8 font-sans gap-3">
                      <div>
                        <span className="font-bold text-slate-900">Topik: </span>
                        <span className="text-slate-600">{academicData.topic}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Tinjauan: </span>
                        <span className="text-slate-600">{academicData.reviewType}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">Format: </span>
                        <span className="text-slate-600">{academicData.formatLabel}</span>
                      </div>
                    </div>

                    {/* 1. PENDAHULUAN */}
                    {academicData.sections.pendahuluan && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            1. PENDAHULUAN
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">1.1 Latar Belakang</h3>
                        <div className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line mb-5">
                          {academicData.sections.pendahuluan.latarBelakang}
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">1.2 Rumusan Masalah</h3>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1">
                          {academicData.sections.pendahuluan.rumusanMasalah.map((rm, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {rm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. GLOBAL OVERVIEW */}
                    {academicData.sections.globalOverview && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            2. GLOBAL OVERVIEW (TINJAUAN GLOBAL)
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">
                          2.1 Tren Manajemen Transportasi Global
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                          {academicData.sections.globalOverview.trenGlobal}
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-5">
                          {academicData.sections.globalOverview.faktorPendorong.map((fp, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: fp.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                }}
                              />
                            </li>
                          ))}
                        </ul>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">2.2 Inovasi Teknologi Global</h3>
                        <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-xs">
                          <div className="font-bold text-emerald-800 mb-1">
                            Pilar Teknologi Transportasi Global:
                          </div>
                          <p className="text-slate-700">{academicData.sections.globalOverview.calloutPilar}</p>
                        </div>
                      </div>
                    )}

                    {/* 3. NATIONAL OVERVIEW */}
                    {academicData.sections.nationalOverview && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            3. NATIONAL OVERVIEW (TINJAUAN NASIONAL - INDONESIA)
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">
                          3.1 Karakteristik Operasional dan Sektor Nasional
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                          {academicData.sections.nationalOverview.karakteristik}
                        </p>
                        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 mb-5">
                          {academicData.sections.nationalOverview.modaTransportasi.map((mt, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="font-bold text-slate-900 shrink-0">{idx + 1}.</span>
                              <div>
                                <span className="font-bold text-slate-900">{mt.name}: </span>
                                <span className="text-slate-700">{mt.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">
                          3.2 Tantangan Utama Transportasi Nasional
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1">
                          {academicData.sections.nationalOverview.tantanganUtama.map((tu, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <strong className="text-slate-900">{tu.name}:</strong>{" "}
                              <span className="text-slate-700">{tu.desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 4. ANALISIS STRATEGIS */}
                    {academicData.sections.analisisStrategis && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            4. ANALISIS STRATEGIS DAN INTEGRASI SOLUSI
                          </h2>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                          {academicData.sections.analisisStrategis.intro}
                        </p>

                        <div className="overflow-hidden rounded-xl border border-slate-200 mb-4">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[#0a4d46] text-white font-bold">
                                <th className="p-3 w-1/4 border-r border-teal-800">Dimensi Strategis</th>
                                <th className="p-3 w-1/3 border-r border-teal-800">Standar / Tren Global</th>
                                <th className="p-3 w-5/12">Tantangan & Solusi Implementasi Nasional</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {academicData.sections.analisisStrategis.matrix.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}>
                                  <td className="p-3 font-bold text-slate-900 border-r border-slate-200 align-top">
                                    {row.dimensi}
                                  </td>
                                  <td className="p-3 text-slate-700 border-r border-slate-200 align-top">
                                    {row.standarGlobal}
                                  </td>
                                  <td className="p-3 text-slate-700 align-top">
                                    {row.solusiNasional}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* 5. KESIMPULAN DAN SARAN */}
                    {academicData.sections.kesimpulanSaran && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-6 bg-teal-600 rounded-sm" />
                          <h2 className="text-base font-black text-[#0a4d46] uppercase font-display tracking-tight">
                            5. KESIMPULAN DAN SARAN
                          </h2>
                        </div>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">5.1 Kesimpulan</h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-5">
                          {academicData.sections.kesimpulanSaran.kesimpulan}
                        </p>

                        <h3 className="text-sm font-bold text-teal-800 mb-2">5.2 Saran Strategis</h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside pl-1 mb-8">
                          {academicData.sections.kesimpulanSaran.saran.map((s, idx) => (
                            <li key={idx} className="leading-relaxed">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                }}
                              />
                            </li>
                          ))}
                        </ul>

                        <p className="text-[11px] text-center italic text-slate-400 pt-4 border-t border-slate-100">
                          {academicData.sections.kesimpulanSaran.footerNote}
                        </p>
                      </div>
                    )}

                    {/* Running Paper Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
                      <div>{academicData.shortTitle}</div>
                      <div>Halaman 1 dari 3</div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Standard Pillar View */}
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                      <div>
                        <div className="text-sm font-black tracking-widest text-slate-900 font-mono">
                          PRAMA STRATEGIC SYSTEM
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                          PANCARAN GROUP STRATEGIC CONSULTANCY SERVICES
                        </div>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg text-[9px] font-black text-teal-700 font-mono uppercase tracking-wider">
                        MAKALAH PILAR #{pillarNumber}
                      </div>
                    </div>

                    <div className="bg-slate-50 border-l-4 border-teal-600 p-4 mb-8 text-xs text-slate-600 leading-relaxed rounded-r-xl">
                      <div className="font-mono text-[9px] font-black uppercase tracking-wider text-teal-700 mb-2">
                        METADATA KAJIAN KELAYAKAN:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400 font-bold">PILAR:</span> #{pillarNumber}.{" "}
                          {pillarTitle.toUpperCase()}
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold">DIVISI:</span>{" "}
                          {(activeDivision || "LOGISTIK DARAT").toUpperCase()}
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold">PROYEK:</span> {projectTitle.toUpperCase()}
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold">STATUS:</span> PRAMA ADVISOR VERIFIED
                        </div>
                      </div>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 uppercase font-display tracking-tight mb-6 pb-2 border-b border-slate-100">
                      {pillarTitle}
                    </h1>

                    <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 font-sans space-y-4">
                      {renderMarkdown ? (
                        renderMarkdown(pillarContent)
                      ) : (
                        <div className="whitespace-pre-line">{pillarContent}</div>
                      )}
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <div>PRAMA STRATEGIC SYSTEM • PANCARAN GROUP</div>
                      <div>DOKUMEN RESMI KELAYAKAN STRATEGIS</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 shrink-0 font-mono">
          <div className="flex items-center gap-4 text-[10.5px]">
            <span>📊 {wordCount} KATA</span>
            <span>•</span>
            <span>⏱️ ~{readTime} MENIT WAKTU BACA</span>
            <span>•</span>
            <span className="text-teal-700 font-bold">
              ✓ FORMAT MAKALAH STRATEGIS: {projectTitle.toUpperCase()}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Tersinkronisasi otomatis dengan topik & nama proyek aktif
          </div>
        </div>
      </div>
    </div>
  );
};
