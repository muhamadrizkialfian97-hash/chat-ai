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
  AlertCircle,
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

export const getFileIcon = (fileName: string, mime: string = "") => {
  const name = fileName.toLowerCase();
  const mType = (mime || "").toLowerCase();
  if (
    mType.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".gif") ||
    name.endsWith(".webp")
  ) {
    return "🖼️";
  }
  if (mType === "application/pdf" || name.endsWith(".pdf")) {
    return "📕";
  }
  if (
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    mType.includes("word") ||
    mType.includes("msword") ||
    mType.includes("officedocument.wordprocessingml")
  ) {
    return "📘";
  }
  if (
    name.endsWith(".ppt") ||
    name.endsWith(".pptx") ||
    mType.includes("powerpoint") ||
    mType.includes("presentation") ||
    mType.includes("officedocument.presentationml")
  ) {
    return "📙";
  }
  if (
    name.endsWith(".xls") ||
    name.endsWith(".xlsx") ||
    mType.includes("excel") ||
    mType.includes("sheet") ||
    mType.includes("officedocument.spreadsheetml")
  ) {
    return "📗";
  }
  return "📄";
};

export const normalizeContentToDataUrl = (content: string, filename: string = ""): { dataUrl: string; mimeType: string; isBinary: boolean } => {
  const trimmed = (content || "").trim();
  const lowerName = filename.toLowerCase();

  // If it's already a Data URI
  if (trimmed.startsWith("data:")) {
    try {
      const parts = trimmed.split(",");
      if (parts.length > 1) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        let mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
        const isBase64 = parts[0].includes("base64");
        
        if (isBase64 && (mime === "application/octet-stream" || mime === "text/plain" || !mime)) {
          // Inspect base64 magic bytes
          const payload = parts[1].substring(0, 40);
          if (payload.startsWith("iVBORw0KGgo")) mime = "image/png";
          else if (payload.startsWith("/9j/")) mime = "image/jpeg";
          else if (payload.startsWith("R0lGOD")) mime = "image/gif";
          else if (payload.startsWith("UklGR")) mime = "image/webp";
          else if (payload.startsWith("JVBER")) mime = "application/pdf";
          else if (lowerName.endsWith(".png")) mime = "image/png";
          else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) mime = "image/jpeg";
          else if (lowerName.endsWith(".pdf")) mime = "application/pdf";
        }
        return {
          dataUrl: `data:${mime};base64,${parts[1]}`,
          mimeType: mime,
          isBinary: true
        };
      }
    } catch (e) {
      console.error("Error parsing existing data URI:", e);
    }
    return { dataUrl: trimmed, mimeType: "application/octet-stream", isBinary: true };
  }

  // If it's not a data URI, let's see if it's raw base64
  let detectedMime = "";
  let cleanBase64 = trimmed.replace(/\s/g, ""); // remove all whitespaces/newlines

  if (cleanBase64.startsWith("iVBORw0KGgo")) {
    detectedMime = "image/png";
  } else if (cleanBase64.startsWith("/9j/")) {
    detectedMime = "image/jpeg";
  } else if (cleanBase64.startsWith("R0lGOD")) {
    detectedMime = "image/gif";
  } else if (cleanBase64.startsWith("UklGR")) {
    detectedMime = "image/webp";
  } else if (cleanBase64.startsWith("JVBER")) {
    detectedMime = "application/pdf";
  } else {
    // If it's not starting with a known magic number, let's check if the file extension suggests a binary file
    const isBinaryExtension =
      lowerName.endsWith(".png") ||
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg") ||
      lowerName.endsWith(".gif") ||
      lowerName.endsWith(".webp") ||
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".pptx") ||
      lowerName.endsWith(".ppt") ||
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls");

    // A simple regex to see if it's base64 (A-Z, a-z, 0-9, +, /, =)
    const isBase64Reg = /^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 20;

    if (isBase64Reg && isBinaryExtension) {
      if (lowerName.endsWith(".png")) detectedMime = "image/png";
      else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) detectedMime = "image/jpeg";
      else if (lowerName.endsWith(".gif")) detectedMime = "image/gif";
      else if (lowerName.endsWith(".webp")) detectedMime = "image/webp";
      else if (lowerName.endsWith(".pdf")) detectedMime = "application/pdf";
      else if (lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) detectedMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (lowerName.endsWith(".pptx") || lowerName.endsWith(".ppt")) detectedMime = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) detectedMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      else detectedMime = "application/octet-stream";
    }
  }

  if (detectedMime) {
    return {
      dataUrl: `data:${detectedMime};base64,${cleanBase64}`,
      mimeType: detectedMime,
      isBinary: true
    };
  }

  // If it's pure raw base64 but we don't know the type, let's fallback if it's very likely base64
  const isLikelyBase64 = /^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 100 && !trimmed.includes(" ") && !trimmed.includes("\n");
  if (isLikelyBase64) {
    return {
      dataUrl: `data:application/octet-stream;base64,${cleanBase64}`,
      mimeType: "application/octet-stream",
      isBinary: true
    };
  }

  // Otherwise, it's just plain text (e.g., Markdown, code, plain text)
  return {
    dataUrl: trimmed,
    mimeType: "text/plain",
    isBinary: false
  };
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDivision, setEditDivision] = useState("");
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit forms when file is selected
  React.useEffect(() => {
    setErrorMessage(null);
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

  // Convert Base64 or Data URI to standard Blob URL for secure browser rendering & sandboxing bypassing
  React.useEffect(() => {
    if (!editContent) {
      setPreviewBlobUrl(null);
      return;
    }

    const normalized = normalizeContentToDataUrl(editContent, editName);
    if (normalized.isBinary && normalized.dataUrl.startsWith("data:")) {
      try {
        const parts = normalized.dataUrl.split(",");
        if (parts.length > 1) {
          const mime = normalized.mimeType;
          const byteCharacters = atob(parts[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mime });
          
          const objectUrl = URL.createObjectURL(blob);
          setPreviewBlobUrl(objectUrl);
          
          return () => {
            URL.revokeObjectURL(objectUrl);
          };
        }
      } catch (err) {
        console.error("Failed to generate blob preview URL:", err);
      }
    }
    setPreviewBlobUrl(null);
  }, [editContent, editName]);

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

  // Handle local file uploads (supports text and binary files like Word, PDF, Images, PPT, Excel)
  const handleFileUpload = (fileObj: File) => {
    setErrorMessage(null);

    // Initial defensive check on raw file size to prevent loading massive files in memory
    const maxRawSize = 1000 * 1024; // 1MB for text
    const maxBinaryRawSize = 700 * 1024; // ~700KB for binary due to Base64 33% overhead
    const lowerName = fileObj.name.toLowerCase();
    const isBinary =
      !fileObj.type.startsWith("text/") &&
      fileObj.type !== "application/json" &&
      fileObj.type !== "application/javascript" &&
      !lowerName.endsWith(".md") &&
      !lowerName.endsWith(".txt") &&
      !lowerName.endsWith(".json") &&
      !lowerName.endsWith(".js") &&
      !lowerName.endsWith(".ts") &&
      !lowerName.endsWith(".html") &&
      !lowerName.endsWith(".css");

    if (isBinary && fileObj.size > maxBinaryRawSize) {
      setErrorMessage(
        `File biner "${fileObj.name}" terlalu besar (${(fileObj.size / 1024).toFixed(0)} KB). Batas aman Firestore untuk berkas terenkripsi adalah maks 700 KB.`
      );
      return;
    } else if (fileObj.size > maxRawSize) {
      setErrorMessage(
        `Dokumen "${fileObj.name}" terlalu besar (${(fileObj.size / 1024).toFixed(0)} KB). Batas ukuran database cloud Firestore adalah maks 1 MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result;
      if (typeof fileContent === "string") {
        const normalized = normalizeContentToDataUrl(fileContent, fileObj.name);

        // Final safe check on actual encoded string length
        const encodedLength = normalized.dataUrl.length;
        if (encodedLength > 1000 * 1024) {
          setErrorMessage(
            `Data terenkripsi dari "${fileObj.name}" berukuran ${(encodedLength / 1024).toFixed(0)} KB, melebihi kapasitas dokumen cloud Firestore (maks 1 MB).`
          );
          return;
        }

        const finalMime = normalized.isBinary ? normalized.mimeType : (fileObj.type || "text/plain");
        const fileData: Partial<SavedFile> = {
          name: fileObj.name,
          content: normalized.dataUrl,
          mimeType: finalMime,
          size: fileObj.size,
          tags: [normalized.isBinary ? "Arsip" : "Upload"],
        };

        try {
          await onSaveFile(fileData);
          setErrorMessage(null);
        } catch (err) {
          console.error(err);
          setErrorMessage("Gagal menyimpan file ke Firestore. Dokumen melebihi batas simpan Cloud Database.");
        }
      }
    };

    if (isBinary) {
      reader.readAsDataURL(fileObj);
    } else {
      reader.readAsText(fileObj);
    }
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
    setErrorMessage(null);
    try {
      const tagsArray = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      
      const normalized = normalizeContentToDataUrl(editContent, editName);
      const isBinaryFile = normalized.isBinary;
      const finalMimeType = isBinaryFile ? normalized.mimeType : (selectedFile.mimeType || "text/markdown");

      // Check size before firing to firestore
      const predictedSize = normalized.dataUrl.length;
      if (predictedSize > 1000 * 1024) {
        setErrorMessage(
          `Gagal menyimpan perubahan. Ukuran dokumen (${(predictedSize / 1024).toFixed(0)} KB) melebihi batas maksimal Firestore (1 MB). Silakan kurangi ukuran gambar/konten atau draf.`
        );
        setIsSaving(false);
        return;
      }

      await onSaveFile({
        id: selectedFile.id,
        name: editName,
        content: normalized.dataUrl,
        tags: tagsArray,
        division: editDivision || undefined,
        mimeType: finalMimeType,
        size: isBinaryFile ? selectedFile.size : new Blob([editContent]).size,
      });
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal memperbarui file: Ukuran draf terenkripsi melebihi batas maksimum Cloud Firestore.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    
    let url = "";
    const normalized = normalizeContentToDataUrl(editContent, editName);

    if (normalized.isBinary && normalized.dataUrl.startsWith("data:")) {
      try {
        const parts = normalized.dataUrl.split(",");
        const mime = normalized.mimeType || selectedFile.mimeType;
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        url = URL.createObjectURL(blob);
      } catch (e) {
        console.error("Failed to parse base64 for download. Defaulting to direct URI download.", e);
        url = normalized.dataUrl;
      }
    } else {
      const blob = new Blob([editContent], { type: selectedFile.mimeType || "text/plain" });
      url = URL.createObjectURL(blob);
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = editName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 border-l border-slate-200">
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-50 border-b border-rose-100 px-4 py-3 text-xs text-rose-800 flex items-start gap-2.5 shadow-sm font-sans font-bold"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">
              <span className="font-mono font-extrabold text-[9px] uppercase tracking-wider text-rose-600 block mb-0.5">PERINGATAN KAPASITAS BERKAS / FILE</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 transition cursor-pointer font-bold bg-rose-100 hover:bg-rose-200/50 p-1 rounded-lg shrink-0"
              title="Tutup Peringatan"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
                {editContent.startsWith("data:") ? "Pratinjau Dokumen / Preview" : "Isi Dokumen / Buffer"}
              </label>
              {(() => {
                const normalized = normalizeContentToDataUrl(editContent, editName);
                const isBase64Content = normalized.isBinary;
                const lowerName = editName.toLowerCase();
                const resolvedMime = normalized.mimeType.toLowerCase();

                const isImage = resolvedMime.startsWith("image/") || lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".gif") || lowerName.endsWith(".webp");
                const isPdf = resolvedMime === "application/pdf" || lowerName.endsWith(".pdf");
                const isWord = lowerName.endsWith(".doc") || lowerName.endsWith(".docx") || resolvedMime.includes("word") || resolvedMime.includes("msword") || resolvedMime.includes("officedocument.wordprocessingml");
                const isPpt = lowerName.endsWith(".ppt") || lowerName.endsWith(".pptx") || resolvedMime.includes("presentation") || resolvedMime.includes("powerpoint") || resolvedMime.includes("officedocument.presentationml");
                const isExcel = lowerName.endsWith(".xls") || lowerName.endsWith(".xlsx") || resolvedMime.includes("excel") || resolvedMime.includes("sheet") || resolvedMime.includes("officedocument.spreadsheetml");

                if (isImage) {
                  return (
                    <div className="flex flex-col items-center justify-center p-6 border border-slate-200 bg-slate-100/40 rounded-xl min-h-[280px] space-y-3 shadow-inner">
                      <div className="relative group max-w-full">
                        <img
                          src={previewBlobUrl || normalized.dataUrl || null}
                          alt={editName}
                          className="max-w-full max-h-[320px] object-contain rounded-lg shadow-md border bg-white animate-fade-in"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">Format Gambar: {resolvedMime || selectedFile?.mimeType || "image"}</p>
                    </div>
                  );
                } else if (isPdf) {
                  return (
                    <div className="flex flex-col flex-1 min-h-[400px] space-y-2.5">
                      <iframe
                        src={previewBlobUrl || normalized.dataUrl || null}
                        className="w-full h-full min-h-[400px] border border-slate-200 rounded-xl shadow-inner bg-white animate-fade-in"
                        title="PDF Viewer"
                      />
                      <div className="text-center p-3 bg-slate-100/50 rounded-xl border border-slate-200">
                        <p className="text-[11px] font-bold text-slate-600">Dokumen PDF Terenkripsi</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Jika file PDF tidak tampil secara otomatis, Anda masih bisa mengundunya secara utuh dengan tombol unduh di bagian bawah.</p>
                      </div>
                    </div>
                  );
                } else if (isWord) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 bg-blue-50/20 rounded-xl min-h-[280px] text-center shadow-inner">
                      <div className="h-14 w-14 bg-blue-600 rounded-xl text-white flex items-center justify-center shadow-md font-bold text-xl mb-3">
                        W
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800">{editName}</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-sans font-bold">
                        Dokumen Microsoft Word (.docx/.doc) tersimpan dengan aman pada database cloud kami. Format biner dilindungi secara utuh dan dapat diunduh untuk pengeditan lokal.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh Dokumen Word</span>
                        </button>
                      </div>
                    </div>
                  );
                } else if (isPpt) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 bg-red-50/10 rounded-xl min-h-[280px] text-center shadow-inner">
                      <div className="h-14 w-14 bg-orange-600 rounded-xl text-white flex items-center justify-center shadow-md font-bold text-xl mb-3 opacity-90">
                        P
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800">{editName}</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-sans font-bold">
                        Presentasi PowerPoint (.pptx/.ppt) diunggah & disimpan dengan aman. Anda dapat mengunduh dokumen presentasi ini untuk diputar secara lokal.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh File Slide PPTX</span>
                        </button>
                      </div>
                    </div>
                  );
                } else if (isExcel) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 bg-emerald-50/20 rounded-xl min-h-[280px] text-center shadow-inner">
                      <div className="h-14 w-14 bg-emerald-600 rounded-xl text-white flex items-center justify-center shadow-md font-bold text-xl mb-3">
                        X
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800">{editName}</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-sans font-bold">
                        Lembar Kerja Microsoft Excel (.xlsx/.xls) terunggah secara aman. Anda dapat mengunduh file ini untuk dianalisis di perangkat komputer Anda.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh File Excel</span>
                        </button>
                      </div>
                    </div>
                  );
                } else if (isBase64Content) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 border border-slate-200 bg-indigo-50/10 rounded-xl min-h-[280px] text-center shadow-inner">
                      <div className="h-14 w-14 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-md font-bold text-xl mb-3">
                        📦
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800">{editName}</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-sans font-bold">
                        Arsip atau Berkas khusus biner terenkripsi. Silakan unduh file untuk membukanya secara lokal dengan perangkat lunak yang sesuai.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh Berkas</span>
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-100 focus:outline-none transition min-h-[280px]"
                      placeholder="# Dokumen Anda..."
                    />
                  );
                }
              })()}
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
              accept=".txt,.md,.json,.js,.ts,.html,.css,.doc,.docx,.pdf,.png,.jpg,.jpeg,.gif,.webp,.ppt,.pptx,.xls,.xlsx"
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
                      <div className="flex items-start gap-2.5 min-w-0 font-sans">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg bg-white shadow-sm ${divBadge.border}`}>
                          {getFileIcon(file.name, file.mimeType)}
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
                            {file.content.startsWith("data:")
                              ? "Berkas dokumen / media biner tersimpan"
                              : (file.content.replace(/[#*`]/g, "").slice(0, 45) || "(tidak ada isi)")}
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
