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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit forms when file is selected
  React.useEffect(() => {
    if (selectedFile) {
      setEditName(selectedFile.name);
      setEditContent(selectedFile.content);
      setEditTags(selectedFile.tags.join(", "));
    } else {
      setEditName("");
      setEditContent("");
      setEditTags("");
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
    return matchesSearch && matchesTag;
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
          <div className="flex items-center justify-between border-t border-slate-200 p-4 bg-white shadow-md">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer hover:text-slate-900"
            >
              <Download className="h-4 w-4 text-indigo-600" />
              <span>Ekspor File</span>
            </button>

            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
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
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layoutId={`file-${file.id}`}
                    onClick={() => onSelectFile(file)}
                    className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-150 p-3 bg-white hover:bg-slate-50 hover:border-slate-300 transition shadow-sm hover:shadow"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 border border-sky-100 text-sky-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold leading-tight text-slate-800">
                          {file.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-500 mt-1 max-w-[200px] font-medium">
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
                                className="inline-block rounded-md bg-sky-50 border border-sky-100 px-1.5 py-0.5 text-[8px] font-extrabold text-sky-700 font-mono uppercase tracking-wider"
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
