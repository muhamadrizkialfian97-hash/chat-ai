import React from "react";
import { FileText, Check, Copy, Download, X } from "lucide-react";

interface ArticlePreview {
  title: string;
  content: string;
  fileName: string;
}

interface ArticlePreviewModalProps {
  articlePreview: ArticlePreview | null;
  setArticlePreview: (val: ArticlePreview | null) => void;
  copiedState: boolean;
  setCopiedState: (val: boolean) => void;
  activeDivision: string | null;
  exportToWord: (fileName: string, content: string, division: string) => void;
  downloadPDFDirect: (fileName: string, content: string, division: string) => void;
  renderPreviewMarkdown: (text: string) => React.ReactNode;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  articlePreview,
  setArticlePreview,
  copiedState,
  setCopiedState,
  activeDivision,
  exportToWord,
  downloadPDFDirect,
  renderPreviewMarkdown,
}) => {
  if (!articlePreview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="flex flex-col bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-150 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">PREVIEW LAPORAN STRATEGIS</h3>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{articlePreview.fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(articlePreview.content);
                setCopiedState(true);
                setTimeout(() => setCopiedState(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              {copiedState ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              onClick={() => exportToWord(articlePreview.fileName, articlePreview.content, activeDivision || "PORTAL")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 rounded-xl transition cursor-pointer shadow-md shadow-violet-100"
              title="Unduh file Word (.doc)"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh (.doc)</span>
            </button>

            <button
              onClick={() => downloadPDFDirect(articlePreview.fileName, articlePreview.content, activeDivision || "PORTAL")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-md shadow-rose-100"
              title="Unduh file PDF (.pdf)"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh PDF (.pdf)</span>
            </button>

            <button
              onClick={() => setArticlePreview(null)}
              className="h-8 w-8 flex items-center justify-center hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Modal content body styled beautifully like real MS Word A4 sheet */}
        <div className="flex-1 overflow-y-auto bg-slate-100/60 p-6 sm:p-10 flex justify-center">
          <div className="bg-white min-h-[70vh] w-full max-w-2xl rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-slate-700 relative overflow-hidden font-sans">
            {/* Decorative corporate top header */}
            <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-6">
              <div>
                <div className="text-xs font-black tracking-widest text-slate-900 font-mono">PRAMA STRATEGIC SYSTEM</div>
                <div className="text-[8px] font-bold text-slate-400 font-mono uppercase tracking-widest">PANCARAN GROUP STRATEGIC CONSULTANCY SERVICES</div>
              </div>
              <div className="border border-slate-800 px-3 py-1 text-[8px] font-black text-center font-mono rounded tracking-wider uppercase text-indigo-700">
                PRAMA VERIFIED
              </div>
            </div>

            {/* Cover metadata card */}
            <div className="bg-slate-50 border-l-4 border-slate-800 p-4 mb-8 text-[11px] text-slate-605 text-slate-600 font-medium leading-relaxed rounded-r-lg">
              <div className="font-bold text-slate-800 font-mono text-[9px] uppercase tracking-wider mb-2 text-indigo-600">INFORMASI VERIFIKASI DOKUMEN:</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                <div><span className="text-slate-400 font-bold">KATEGORI:</span> LAPORAN ANALISIS STRATEGIS</div>
                <div><span className="text-slate-400 font-bold">UNIT:</span> {(activeDivision || "ANALITIS").toUpperCase()} DIVISION</div>
                <div><span className="text-slate-400 font-bold">PROYEK:</span> {articlePreview.title.toUpperCase()}</div>
                <div><span className="text-slate-400 font-bold">STATUS:</span> INTERNAL VERIFIED (SECRET)</div>
              </div>
            </div>

            {/* Printable main headings and text */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b pb-2 mb-6 tracking-tight leading-snug">
              {articlePreview.title}
            </h1>

            {/* Beautiful clean parser */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-850 font-normal">
              {renderPreviewMarkdown(articlePreview.content)}
            </div>

            {/* Footer decorator block */}
            <div className="mt-12 border-t pt-4 text-[9px] text-slate-400 font-mono flex justify-between items-center">
              <span>PRAMA SYSTEM DIGITAL ARCHIVE SYSTEM &bull; PANCARAN GROUP</span>
              <span>© 2026 INTERNAL</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom control */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end gap-2.5 shrink-0">
          <span className="self-center font-mono text-[9px] text-slate-450 font-bold uppercase tracking-widest mr-auto select-none">
            VERIFIED STUDY SUITE
          </span>
          <button
            onClick={() => setArticlePreview(null)}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
