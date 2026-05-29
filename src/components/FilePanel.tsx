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
  Sparkles,
  CloudLightning,
  ChevronLeft,
  X,
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

  // Initialize edit forms when file selected
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
      name: `catatan_baru_${Date.now().toString().slice(-4)}.md`,
      content: `# Catatan Baru\n\nTulis konten Anda di sini...`,
      mimeType: "text/markdown",
      size: 34,
      tags: ["Notes"],
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
    <div className="flex h-full flex-col bg-slate-950 border-l border-slate-900">
      {selectedFile ? (
        /* FILE EDITOR VIEW */
        <div className="flex h-full flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-slate-900 px-4 py-3 bg-slate-950/80 backdrop-blur-md">
            <button
              onClick={() => onSelectFile(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <ChevronLeft className="h-4 w-4 text-blue-400" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <CloudLightning className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                {isUserSignedIn ? "Firebase Sync: Active" : "Local Mirror State"}
              </span>
              <button
                onClick={() => {
                  if (confirm(`Hapus file "${selectedFile.name}"?`)) {
                    onDeleteFile(selectedFile.id);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Editor Fields */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <div>
              <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500">
                Nama File / Identitas
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-slate-100 focus:border-blue-500 focus:outline-none transition"
                placeholder="nama_file.txt"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500">
                Kategori / Tag (pisahkan dengan koma)
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 focus-within:border-blue-500 transition">
                <Tag className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-100 focus:outline-none placeholder-slate-600"
                  placeholder="Notes, Skripsi, Code..."
                />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-[240px]">
              <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 mb-1.5">
                Isi Dokumen / Buffer
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full flex-1 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-200 focus:border-blue-500 focus:outline-none transition min-h-[240px]"
                placeholder="# Dokumen Anda..."
              />
            </div>
          </div>

          {/* Editor Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-900 p-4 bg-slate-950/85">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-850 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Download className="h-4 w-4 text-blue-450" />
              <span>Ekspor File</span>
            </button>

            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600"
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
          <div className="flex items-center gap-3">
            <button
              onClick={createNewEmptyFile}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-800 transition"
            >
              <Plus className="h-4 w-4 text-blue-400" />
              <span>Dokumen Baru</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-955/40 px-3.5 py-2 text-xs font-bold text-slate-300 hover:border-slate-700 hover:bg-slate-900 transition"
            >
              <Upload className="h-4 w-4" />
              <span>Unggah File</span>
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
          <div className="mt-4 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari file..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-300 focus:bg-slate-900/60 focus:border-blue-500 focus:outline-none font-sans"
            />
          </div>

          {/* Quick Tag Filter Rail */}
          {allTags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto pb-1">
              <button
                onClick={() => setSelectedTag("")}
                className={`rounded-xl px-3 py-1 text-[10px] font-mono tracking-wide font-semibold ${
                  !selectedTag
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-400 border border-slate-805 hover:text-white"
                }`}
              >
                #Semua
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                  className={`rounded-xl px-3 py-1 text-[10px] font-mono tracking-wide font-semibold ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-405 border border-slate-800 hover:text-white"
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
                ? "border-blue-500 bg-blue-500/5"
                : "border-slate-850"
            }`}
          >
            {dragActive ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-blue-400 animate-bounce mb-2" />
                <p className="text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">Lepaskan file di sini...</p>
                <p className="text-[10px] text-slate-550 font-mono">Membaca file teks secara real-time</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-10">
                <FileText className="h-10 w-10 text-slate-700 mb-2" />
                <p className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                  {searchQuery || selectedTag ? "File tidak ditemukan" : "Tidak ada file"}
                </p>
                <p className="max-w-[190px] text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Seret file teks (.txt, .md) ke area ini untuk menyimpannya ke mirror storage.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layoutId={`file-${file.id}`}
                    onClick={() => onSelectFile(file)}
                    className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-850 p-3 transition-all bg-slate-900/40 hover:bg-slate-900/90 hover:border-slate-750"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        <FileText className="h-4 w-4 text-blue-450" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold leading-tight text-slate-200">
                          {file.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-500 mt-1 max-w-[200px]">
                          {file.content.slice(0, 45) || "(tidak ada isi)"}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="font-mono text-[9px] text-slate-600">
                            {(file.size / 1024).toFixed(2)} KB
                          </span>
                          {file.tags &&
                            file.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block rounded-md bg-blue-500/10 border border-blue-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-blue-400 font-mono uppercase tracking-wider"
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
                      className="text-slate-600 hover:text-red-400 transition"
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
