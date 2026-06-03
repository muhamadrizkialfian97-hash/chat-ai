import React, { useState, useRef } from "react";
import { SavedFile } from "../types";
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Download,
  Save,
  Tag,
  Upload,
  ChevronLeft,
  RefreshCw,
  Printer,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToWord, exportToPDF, downloadPDFDirect } from "../utils/documentExporter";

export const DIVISION_INFO: Record<string, { code: string; name: string; bg: string; text: string; border: string }> = {
  comercial: { code: "COMC", name: "Comercial & Business Dev", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100" },
  hca: { code: "HCA", name: "Human Capital & Affairs", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
  finance: { code: "FINA", name: "Finance & Accounting", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  legal: { code: "LGA", name: "Legal & Governance", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  audit: { code: "SPIA", name: "Internal Audit (SPI)", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" }
};

export const getDivisionBadge = (divisionId?: string) => {
  if (!divisionId || !DIVISION_INFO[divisionId]) {
    return { code: "GENERAL", name: "Umum / PM Laporan", bg: "bg-slate-50", text: "text-slate-650 text-slate-600", border: "border-slate-200" };
  }
  return DIVISION_INFO[divisionId];
};

interface FilePanelProps {
  files: SavedFile[];
  selectedFile: SavedFile | null;
  onSelectFile: (file: SavedFile | null) => void;
  onSaveFile: (file: Partial<SavedFile>) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  isUserSignedIn: boolean;
}

export default function FilePanel({
  files,
  selectedFile,
  onSelectFile,
  onSaveFile,
  onDeleteFile,
  isUserSignedIn,
}: FilePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDivision, setEditDivision] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit forms when file is selected
  React.useEffect(() => {
    if (selectedFile) {
      setEditName(selectedFile.name);
      setEditContent(selectedFile.content);
      setEditTags(selectedFile.tags.join(", "));
      setEditDivision(selectedFile.division || "");
    } else {
      setEditName("");
      setEditContent("");
      setEditTags("");
      setEditDivision("");
    }
  }, [selectedFile]);

  // Extract all unique tags
  const allTags = Array.from(new Set(files.flatMap((f) => f.tags || []))).filter(Boolean);

  // Filtered files
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (file.tags && file.tags.includes(selectedTag));
    const matchesDivision = !selectedDivision || file.division === selectedDivision;
    return matchesSearch && matchesTag && matchesDivision;
  });

  // Handle local text file uploads
  const handleFileUpload = (fileObj: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const fileData: Partial<SavedFile> = {
          name: fileObj.name,
          content: text,
          mimeType: fileObj.type || "text/plain",
          size: fileObj.size,
          tags: ["Upload"],
        };
        await onSaveFile(fileData);
      }
    };
    reader.readAsText(fileObj);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const createNewEmptyFile = async () => {
    const defaultFile: Partial<SavedFile> = {
      name: `catatan_analisis_${Date.now().toString().slice(-4)}.md`,
      content: `# Dokumen Analisis Baru\n\nTulis konten draf atau ringkasan hasil audit di sini...`,
      mimeType: "text/markdown",
      size: 55,
      tags: ["Draf"],
    };
    await onSaveFile(defaultFile);
  };

  const handleSaveEdit = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const tagsArray = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      
      await onSaveFile({
        id: selectedFile.id,
        name: editName,
        content: editContent,
        tags: tagsArray,
        division: editDivision || undefined,
        size: new Blob([editContent]).size,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const blob = new Blob([editContent], { type: selectedFile.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = editName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 border-l border-slate-200">
      {selectedFile ? (
        /* FILE EDITOR VIEW */
        <div className="flex h-full flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
            <button
              onClick={() => onSelectFile(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-sky-600" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                {isUserSignedIn ? "SYNC: FIREBASE ACTIVE" : "LOCAL MIRROR FILE"}
              </span>
              <button
                onClick={() => {
                  if (confirm(`Hapus file "${selectedFile.name}"?`)) {
                    onDeleteFile(selectedFile.id);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-650 transition cursor-pointer"
                title="Hapus Dokumen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Editor Fields */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                Nama File / Identitas
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-100 focus:outline-none transition"
                placeholder="nama_file.md"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                Divisi Proyek / Unit Kerja (Project Management Hub)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 lg:gap-2.5">
                {[
                  { id: "", code: "GEN", name: "Umum / PM" },
                  { id: "comercial", code: "COMC", name: "Comercial" },
                  { id: "hca", code: "HCA", name: "Human Capital" },
                  { id: "finance", code: "FINA", name: "Finance" },
                  { id: "legal", code: "LGA", name: "Legal" },
                  { id: "audit", code: "SPIA", name: "SPI Audit" }
                ].map((divOption) => {
                  const isSelected = editDivision === divOption.id;
                  let selectedStyle = "bg-slate-800 border-slate-900 text-white font-extrabold shadow-sm";
                  if (isSelected && divOption.id === "comercial") selectedStyle = "bg-sky-600 border-sky-700 text-white font-extrabold shadow-sm";
                  if (isSelected && divOption.id === "hca") selectedStyle = "bg-indigo-650 bg-indigo-600 border-indigo-700 text-white font-extrabold shadow-sm";
                  if (isSelected && divOption.id === "finance") selectedStyle = "bg-emerald-600 border-emerald-700 text-white font-extrabold shadow-sm";
                  if (isSelected && divOption.id === "legal") selectedStyle = "bg-amber-600 border-amber-700 text-white font-extrabold shadow-sm";
                  if (isSelected && divOption.id === "audit") selectedStyle = "bg-rose-600 border-rose-700 text-white font-extrabold shadow-sm";

                  return (
                    <button
                      key={divOption.id}
                      type="button"
                      onClick={() => setEditDivision(divOption.id)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl text-center border cursor-pointer transition-all duration-155 hover:scale-102 ${
                        isSelected
                          ? selectedStyle
                          : "bg-white border-slate-205 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-[10px] font-bold leading-none">{divOption.name}</span>
                      <span className={`text-[8px] font-mono mt-1 px-1 rounded uppercase tracking-wider font-black ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        {divOption.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                Kategori / Tag (pisahkan dengan koma)
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-100 transition">
                <Tag className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none placeholder-slate-400"
                  placeholder="Comercial, HCA, Audit, Finansial..."
                />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-[280px] space-y-1.5">
              <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block">
                Isi Dokumen / Buffer
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full flex-1 rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-100 focus:outline-none transition min-h-[280px]"
                placeholder="# Dokumen Anda..."
              />
            </div>
          </div>

          {/* Editor Footer Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-200 p-4 bg-white gap-3 shadow-md">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Unduh file mentah sebagai Markdown (.md) atau Teks"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Format Mentah (.md)</span>
              </button>

              <button
                onClick={() => {
                  if (!selectedFile) return;
                  const title = selectedFile.name.replace(/\.[^/.]+$/, "");
                  const divName = getDivisionBadge(selectedFile.division).name;
                  exportToWord(title, editContent, divName);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
                title="Ekspor dokumen ke format .doc Word"
              >
                <Download className="h-3.5 w-3.5 text-indigo-600" />
                <span>Word (DOC)</span>
              </button>

              <button
                onClick={() => {
                  if (!selectedFile) return;
                  const title = selectedFile.name.replace(/\.[^/.]+$/, "");
                  const divName = getDivisionBadge(selectedFile.division).name;
                  downloadPDFDirect(title, editContent, divName);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 cursor-pointer"
                title="Unduh dokumen langsung sebagai PDF"
              >
                <Download className="h-3.5 w-3.5 text-red-650" />
                <span>Unduh PDF</span>
              </button>
            </div>

            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer min-w-[140px]"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* FILE LIST VIEW */
        <div className="flex h-full flex-col p-4 sm:p-6">
          
          {/* New Document Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={createNewEmptyFile}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 border border-slate-200 py-3 transition cursor-pointer shadow-sm shadow-black/[0.02]"
            >
              <Plus className="h-4 w-4 text-indigo-600" />
              <span>Buat Dokumen Baru</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-250 bg-white px-3.5 py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition cursor-pointer"
            >
              <Upload className="h-4 w-4 text-sky-600" />
              <span>Unggah</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.js,.ts,.html,.css"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Search Header */}
          <div className="mt-4 relative flex items-center shadow-3sm">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none font-bold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari draf dokumen atau simulasi..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-bold text-slate-700 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-100 font-sans"
            />
          </div>

          {/* Quick Division Filter Rail */}
          <div className="mt-3.5 space-y-1">
            <span className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-slate-400 block px-1">
              Filter Divisi Proyek:
            </span>
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                onClick={() => setSelectedDivision("")}
                className={`rounded-xl px-2.5 py-1 text-[9px] font-bold transition-all border cursor-pointer ${
                  !selectedDivision
                    ? "bg-slate-800 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                🌐 Semua Unit
              </button>
              {[
                { id: "comercial", code: "COMC", bg: "hover:bg-sky-50", selectedBg: "bg-sky-600 border-sky-700 text-white" },
                { id: "hca", code: "HCA", bg: "hover:bg-indigo-50", selectedBg: "bg-indigo-600 border-indigo-700 text-white" },
                { id: "finance", code: "FINA", bg: "hover:bg-emerald-50", selectedBg: "bg-emerald-600 border-emerald-700 text-white" },
                { id: "legal", code: "LGA", bg: "hover:bg-amber-50", selectedBg: "bg-amber-600 border-amber-700 text-white" },
                { id: "audit", code: "SPIA", bg: "hover:bg-rose-50", selectedBg: "bg-rose-600 border-rose-700 text-white" }
              ].map((divOpt) => {
                const isSelected = selectedDivision === divOpt.id;
                return (
                  <button
                    key={divOpt.id}
                    onClick={() => setSelectedDivision(isSelected ? "" : divOpt.id)}
                    className={`rounded-xl px-2.5 py-1 text-[9px] font-mono tracking-wide font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? divOpt.selectedBg
                        : `bg-white border-slate-200 text-slate-500 ${divOpt.bg}`
                    }`}
                  >
                    {divOpt.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tag Filter Rail */}
          {allTags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto pb-1">
              <button
                onClick={() => setSelectedTag("")}
                className={`rounded-xl px-3 py-1 text-[10px] font-mono tracking-wide font-bold ${
                  !selectedTag
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                #Semua
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                  className={`rounded-xl px-3 py-1 text-[10px] font-mono tracking-wide font-bold ${
                    selectedTag === tag
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Virtual files listing container with Dropzone support */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`mt-4 flex-1 overflow-y-auto rounded-xl border border-dashed transition-all p-3 ${
              dragActive
                ? "border-sky-505 bg-sky-50/50 shadow-inner"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            {dragActive ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-sky-600 animate-bounce mb-2" />
                <p className="text-xs font-bold text-sky-700 font-mono uppercase tracking-wider">Lepaskan berkas disini...</p>
                <p className="text-[10px] text-slate-400 font-mono">Membaca data & draf ringkasan seketika</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-10">
                <FileText className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
                  {searchQuery || selectedTag ? "Hasil tidak cocok" : "Penyimpanan Kosong"}
                </p>
                <p className="max-w-[190px] text-[10px] text-slate-400 mt-1 leading-relaxed font-bold">
                  Draf analisis Gemini yang disimpan atau file unggahan draf audit Anda akan terdaftar di sini. Support seret-unggah.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => {
                  const divBadge = getDivisionBadge(file.division);
                  return (
                    <motion.div
                      key={file.id}
                      layoutId={`file-${file.id}`}
                      onClick={() => onSelectFile(file)}
                      className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-150 p-3 bg-white hover:bg-slate-50 hover:border-slate-300 transition shadow-sm hover:shadow"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[9px] font-extrabold font-mono ${divBadge.bg} ${divBadge.border} ${divBadge.text}`}>
                          {divBadge.code === "GENERAL" ? "📁" : divBadge.code}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold leading-tight text-slate-800" title={file.name}>
                            {file.name}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-extrabold font-mono ${divBadge.bg} ${divBadge.text} ${divBadge.border} border uppercase tracking-wider`}>
                              Divisi: {divBadge.name}
                            </span>
                          </div>
                          <p className="truncate text-[10px] text-slate-500 mt-1.5 max-w-[200px] font-medium">
                            {file.content.replace(/[#*`]/g, "").slice(0, 45) || "(tidak ada isi)"}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[9px] text-slate-400 font-bold">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                            {file.tags &&
                              file.tags.slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="inline-block rounded-md bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-[8px] font-extrabold text-slate-500 font-mono uppercase tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Hapus file "${file.name}"?`)) {
                          onDeleteFile(file.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer p-1"
                      title="Hapus file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
