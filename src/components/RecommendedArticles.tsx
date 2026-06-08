import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  X,
  FileDown
} from "lucide-react";
import { RECOMMENDED_ARTICLES, RecommendedArticle } from "../utils/recommendedArticlesData";
import { exportToWord, downloadPDFDirect } from "../utils/documentExporter";

export default function RecommendedArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [previewArticle, setPreviewArticle] = useState<RecommendedArticle | null>(null);

  // Pagination states if needed, but 15 fits perfectly in a responsive grid. Let's make it look like a prime bento-grid.
  
  // Get all unique categories
  const categories = ["Semua", ...Array.from(new Set(RECOMMENDED_ARTICLES.map(a => a.category)))];

  // Filter articles
  const filteredArticles = RECOMMENDED_ARTICLES.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top action and filter bar */}
      <div className="p-6 bg-white border-b border-slate-200 shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-sm text-slate-800 tracking-wider uppercase font-mono">
              REKOMENDASI ARTIKEL & DOKUMEN PM
            </h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest font-bold mt-1 uppercase">
              Download Mandiri Dokumen Standar Bisnis Logistik Pancaran Group
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari artikel, topik, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              id="article-search-input"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[9px] font-black text-slate-450 text-slate-400 uppercase tracking-widest font-mono mr-2">Filter Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 border-indigo-700 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
              id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Helper Note Banner */}
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3.5">
          <div className="p-2 bg-indigo-100 rounded-xl shrink-0 text-indigo-600">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Panduan Unduhan Dokumen Standar PRAMA</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed font-bold mt-1 text-justify">
              Gunakan pusat arsip dokumen ini untuk mengunduh draf analisis, usulan, dan SOP logistik siap pakai yang diselaraskan dengan standar operational excellence Pancaran Group. Tombol unduh dipisahkan secara berbeda: format **MS Word (.doc)** memicu penyimpanan berkas biner modular untuk keperluan penyuntingan draf, sedangkan format **PDF (.pdf)** memicu generate dokumen siap cetak yang menyertakan tata letak sertifikasi verifikasi PRAMA.
            </p>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
              Tidak ditemukan artikel yang sesuai dengan pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                id={`article-card-${article.id}`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] font-black tracking-wider uppercase px-2 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200">
                      {article.category}
                    </span>
                    <button 
                      onClick={() => setPreviewArticle(article)}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition py-0.5 px-2 bg-indigo-50 rounded-lg border border-indigo-100/30 cursor-pointer"
                      title="Pratinjau isi dokumen"
                    >
                      Baca Draf
                    </button>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-xs text-slate-800 leading-snug group-hover:text-indigo-700 transition line-clamp-1">
                      {article.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-1.5 leading-relaxed text-justify line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Separate and visually distinct Word and PDF download actions */}
                <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100 shrink-0">
                  <button
                    onClick={() => exportToWord(article.title.replace(/:/g, " -"), article.content, article.category)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/60 font-bold text-[10px] py-2 transition-all duration-200 shadow-2sm cursor-pointer select-none"
                    title="Simpan berkas biner format Microsoft Word"
                  >
                    <Download className="h-3 w-3 shrink-0" />
                    <span>Format Word</span>
                  </button>

                  <button
                    onClick={() => downloadPDFDirect(article.title.replace(/:/g, " -"), article.content, article.category)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/60 font-bold text-[10px] py-2 transition-all duration-200 shadow-2sm cursor-pointer select-none"
                    title="Unduh laporan langsung format PDF"
                  >
                    <FileDown className="h-3 w-3 shrink-0" />
                    <span>Format PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smart Side Slide-over Document Reading Panel */}
      {previewArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-[999] p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl h-full flex flex-col justify-between overflow-hidden border border-slate-200 transform animate-in slide-in-from-right duration-250">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-indigo-950 text-indigo-400 font-bold rounded-lg border border-indigo-800">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-xs tracking-wide uppercase text-white leading-none">
                    PRATINJAU DOKUMEN PRAMA
                  </h4>
                  <p className="text-[8px] text-slate-400 font-mono tracking-widest font-black mt-1">
                    KLASIFIKASI: TERBATAS / RAHASIA INTERNAL
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setPreviewArticle(null)}
                className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl border border-slate-700 transition cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Markdown Body Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <div className="prose prose-slate prose-sm max-w-none bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                
                {/* Meta block inside preview */}
                <div className="bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl mb-6 font-mono text-[9px] text-slate-500 font-bold space-y-1">
                  <p className="font-sans font-extrabold text-slate-700 text-[10.5px]">INFORMASI VERIFIKASI TELEMETRI</p>
                  <p>ID DOKUMEN: PRM-{previewArticle.category.toUpperCase()}-{previewArticle.id.toUpperCase()}</p>
                  <p>OTORITAS RILIS: PRAMA STRATEGIC PM CONSULTANT</p>
                  <p>TIPE INTEGRASI: EKSPOR MANDIRI EXCEL & G-SUITE COMPATIBLE</p>
                </div>

                {/* Content render simulation (simple markdown parsing representation so we don't need heavy dependencies) */}
                <div className="space-y-4 text-justify font-sans">
                  {previewArticle.content.split("\n").map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={idx} className="h-2" />;

                    if (trimmed.startsWith("# ")) {
                      return <h2 key={idx} className="text-lg font-black text-slate-900 border-b pb-2 pt-2">{trimmed.substring(2)}</h2>;
                    }
                    if (trimmed.startsWith("## ")) {
                      return <h3 key={idx} className="text-sm font-extrabold text-indigo-700 pt-3">{trimmed.substring(3)}</h3>;
                    }
                    if (trimmed.startsWith("### ")) {
                      return <h4 key={idx} className="text-xs font-black text-slate-800 pt-2">{trimmed.substring(4)}</h4>;
                    }
                    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                      return (
                        <div key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-600 pl-2">
                          <span className="text-indigo-500 font-bold mt-0.5">•</span>
                          <span>{trimmed.substring(2)}</span>
                        </div>
                      );
                    }
                    if (/^\d+\.\s+(.*)/.test(trimmed)) {
                      const match = trimmed.match(/^(\d+\.)\s+(.*)/);
                      return (
                        <div key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-700 pl-1">
                          <span className="text-indigo-600 font-bold">{match ? match[1] : "1."}</span>
                          <span>{match ? match[2] : trimmed}</span>
                        </div>
                      );
                    }
                    return <p key={idx} className="text-xs text-slate-600 leading-relaxed font-bold">{trimmed}</p>;
                  })}
                </div>
              </div>
            </div>

            {/* Footer with separate action downloads */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[9px] text-slate-400 font-mono font-bold select-none">
                SIMPAN/EKSPOR SEBAGAI:
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    exportToWord(previewArticle.title.replace(/:/g, " -"), previewArticle.content, previewArticle.category);
                    setPreviewArticle(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10.5px] px-3.5 py-1.5 transition shadow-md cursor-pointer shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Word (.doc)</span>
                </button>

                <button
                  onClick={() => {
                    downloadPDFDirect(previewArticle.title.replace(/:/g, " -"), previewArticle.content, previewArticle.category);
                    setPreviewArticle(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10.5px] px-3.5 py-1.5 transition shadow-md cursor-pointer shrink-0"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Unduh PDF (.pdf)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
