import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SavedFile } from "../types";
import { Send, FileText, Globe, CircleAlert, Cpu, Eye, EyeOff, Settings, Sparkles, Download, Printer, ArrowLeft, LogOut, Bell, HardDrive, Users, CheckCircle, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToWord, exportToPDF, downloadPDFDirect } from "../utils/documentExporter";
import pramaLogo from "../assets/images/prama_logo_1780452149937.png";

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string, enableSearch: boolean, referencedFile?: SavedFile | null) => Promise<void>;
  files: SavedFile[];
  onSaveAsFile: (content: string, requestedFileName?: string) => void;
  onExportArticle?: (lastMessageText: string) => Promise<void>;
  onExportPPT?: (lastMessageText: string) => Promise<void>;
  apiMode: "proxy" | "client";
  setApiMode: (mode: "proxy" | "client") => void;
  clientApiKey: string;
  setClientApiKey: (key: string) => void;
  activeDivision: string | null;
  onTyping?: (isTyping: boolean) => void;
  onBackToDashboard?: () => void;
  onLogout?: () => void;
  onPreviewAndExportWord?: (text: string) => void;
  onPreviewAndExportPDF?: (text: string) => void;
  pendingRequestsCount?: number;
  onNavigateNotification?: (view: "divisions" | "saved_docs" | "approval_requests") => void;
  isSearchingMessages?: boolean;
  onToggleSearchMessages?: (active: boolean) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export default function ChatPanel({
  messages,
  loading,
  onSendMessage,
  files,
  onSaveAsFile,
  onExportArticle,
  onExportPPT,
  apiMode,
  setApiMode,
  clientApiKey,
  setClientApiKey,
  activeDivision,
  onTyping,
  onBackToDashboard,
  onLogout,
  onPreviewAndExportWord,
  onPreviewAndExportPDF,
  pendingRequestsCount = 0,
  onNavigateNotification,
  isSearchingMessages = false,
  onToggleSearchMessages,
  searchQuery: searchQueryProps,
  onSearchQueryChange: onSearchQueryChangeProps,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const activeSearchQuery = searchQueryProps !== undefined ? searchQueryProps : localSearchQuery;
  const setActiveSearchQuery = onSearchQueryChangeProps !== undefined ? onSearchQueryChangeProps : setLocalSearchQuery;

  const [showConfig, setShowConfig] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);

  const activeReferencedFile = files.find((f) => f.id === selectedFileId) || null;

  const filteredMessages = activeSearchQuery.trim()
    ? messages.filter((msg) =>
        msg.text.toLowerCase().includes(activeSearchQuery.toLowerCase())
      )
    : messages;

  const [localKeyInput, setLocalKeyInput] = useState(clientApiKey);
  const [showLocalKey, setShowLocalKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);

  useEffect(() => {
    setLocalKeyInput(clientApiKey);
  }, [clientApiKey]);

  const handleSaveLocalKey = (e: React.FormEvent) => {
    e.preventDefault();
    const finalKey = localKeyInput.trim() || "AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA";
    setLocalKeyInput(finalKey);
    setClientApiKey(finalKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (onTyping) {
      onTyping(false);
    }
    onSendMessage(input.trim(), enableSearch, activeReferencedFile);
    setInput("");
    setSelectedFileId(""); // Reset reference after sending
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    if (onTyping) {
      onTyping(val.length > 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleApplyPreset = (promptText: string) => {
    setInput(promptText);
    if (onTyping) {
      onTyping(true);
    }
  };

  // Get Division-specific presets
  const getDivisionPresets = (id: string | null) => {
    switch (id) {
      case "comercial":
        return [
          { text: "Bandingkan efisiensi tarif logistik kontainer darat vs tongkang laut.", label: "Komparasi Tarif" },
          { text: "Tulis draf ringkas Executive Summary untuk proposal tender fleet-bidding logs.", label: "Draf Tender" },
          { text: "Hitung simulasi margin bersih armada trailer dengan solar Rp 15.000/liter.", label: "Simulasi Solar" }
        ];
      case "hca":
        return [
          { text: "Rumuskan Key Performance Indicators (KPI) berdasar keterlambatan & kepatuhan sopir.", label: "KPI Sopir" },
          { text: "Rancang silabus training keselamatan muatan berat di pelabuhan.", label: "Safety Syllabus" },
          { text: "Draf skema shift kerja gilir untuk kru lapangan 24 jam.", label: "Shift Kru" }
        ];
      case "fina":
        return [
          { text: "Buat simulasi analisis Cash Flow mingguan operasional armada logistik.", label: "Log Cash Flow" },
          { text: "Beri contoh perhitungan depresiasi garis lurus armada truk trailer usia 10 tahun.", label: "Depresiasi Aset" },
          { text: "Tulis draf kuesioner audit anggaran berkala pengadaan suku cadang.", label: "Audit Anggaran" }
        ];
      case "lga":
        return [
          { text: "Draf klausul alternatif ganti kerugian akibat force majeure keterlambatan kapal.", label: "Klausul Ganti Rugi" },
          { text: "Panduan pemenuhan dokumen izin trayek dan ODOL logistik.", label: "Regulasi ODOL" },
          { text: "Buat draf MoU kemitraan depo darat dengan pihak ketiga.", label: "Draf MoU" }
        ];
      case "spia":
        return [
          { text: "Metode audit menyeluruh selisih kartu pengisian BBM solar dengan riwayat GPS.", label: "Audit BBM Fraud" },
          { text: "Rancang checklist Kertas Kerja Audit (Working Papers) kepatuhan depo.", label: "Checklist KKA" },
          { text: "Tulis draf prosedur pencegahan anomali pencatatan ban armada.", label: "Kontrol Ban" }
        ];
      default:
        return [
          { text: "Buat simulasi rekap komparasi tarif logistik darat & laut.", label: "Simulasi Umum" },
          { text: "Evaluasi risiko operasional logistik nasional saat cuaca ekstrem.", label: "Risiko Cuaca" },
          { text: "Tulis panduan efektivitas pengawasan anggaran korporat.", label: "Panduan Anggaran" }
        ];
    }
  };

  const currentPresets = getDivisionPresets(activeDivision);

  const getDivisionTitle = (id: string | null) => {
    switch (id) {
      case "comercial": return "Comercial & Business Development";
      case "hca": return "Human Capital & Affairs";
      case "fina": return "Finance & Accounting";
      case "lga": return "Legal & Governance";
      case "spia": return "Internal Audit (SPIA)";
      default: return "Portal Multi-Divisi";
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 transition-colors">
      
      {/* Contact Head Bar (Chat-like Persona Status) */}
      <div className="flex items-center justify-between border-b border-secondary bg-white px-4 py-3 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-650 transition cursor-pointer shrink-0"
              title="Kembali ke Dashboard / Ganti Divisi"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border border-slate-200 bg-slate-50 shadow-3sm shrink-0">
            <img 
              src={pramaLogo} 
              alt="PRAMA Advisor" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>
          <div>
            <span className="block font-sans font-extrabold text-slate-900 text-sm tracking-tight">PRAMA Strategic AI Advisor</span>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              <span>{getDivisionTitle(activeDivision)}</span>
              <span>•</span>
              <span className="text-emerald-500 lowercase font-medium">{loading ? "sedang mengetik..." : "online"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-[9px] font-mono font-extrabold text-slate-400 tracking-wider">
            <span>SECURE CHAT FEED</span>
          </div>

          {/* Notification Popover Button & Dropdown directly left of Keluar button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                showNotifications
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-inner"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:text-indigo-600"
              }`}
              title="Notifikasi Masuk"
            >
              <Bell className="h-4 w-4 shrink-0" />
              {/* Dynamic Notification badge */}
              {(pendingRequestsCount + (files.length > 0 ? 1 : 0) + 1) > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black leading-none text-white ring-2 ring-white animate-pulse">
                  {pendingRequestsCount + (files.length > 0 ? 1 : 0) + 1}
                </span>
              )}
            </button>

            {/* Backdrop to close popover when clicked outside */}
            {showNotifications && (
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowNotifications(false)}
              />
            )}

            {/* Dropdown Card */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden text-left"
                >
                  {/* Dropdown Header */}
                  <div className="bg-slate-900 px-4 py-3.5 border-b border-slate-800 text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-extrabold text-[11px] tracking-wider uppercase leading-none">
                        NOTIFIKASI PRAMA
                      </h4>
                      <span className="text-[8px] font-mono tracking-widest text-slate-400 font-bold block mt-1 uppercase">
                        PUSAT INFORMASI LIVE SISTEM
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-black bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full uppercase leading-none">
                      {pendingRequestsCount + (files.length > 0 ? 1 : 0) + 1} Baru
                    </span>
                  </div>

                  {/* Notification list */}
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    
                    {/* 1. Dynamic Pending Approvals Notification */}
                    {pendingRequestsCount > 0 ? (
                      <div
                        onClick={() => {
                          setShowNotifications(false);
                          if (onNavigateNotification) onNavigateNotification("approval_requests");
                        }}
                        className="p-3.5 hover:bg-slate-50/80 transition flex items-start gap-3 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-655 border border-indigo-100 shrink-0 shadow-inner">
                          <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-black text-slate-800 leading-snug">
                              Registrasi Pending Terdeteksi
                            </p>
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-normal mt-0.5 line-clamp-2">
                            Ada {pendingRequestsCount} permohonan pendaftaran staf baru menunggu persetujuan Anda.
                          </p>
                          <span className="text-[8px] font-mono font-black text-indigo-600 mt-1 block uppercase tracking-wider">
                            KLIK UNTUK VERIFIKASI →
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 hover:bg-slate-50/40 transition flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-slate-100 shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-700 leading-snug">
                            Persetujuan Akun PRAMA
                          </p>
                          <p className="text-[10.5px] text-slate-400 font-bold leading-normal mt-0.5">
                            Belum ada kandidat pendaftaran baru saat ini. Semua staf aktif.
                          </p>
                          <span className="text-[8px] font-mono font-extrabold text-slate-400 mt-1 block uppercase">
                            STATUS BERSIH
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 2. Saved Documents Notification */}
                    {files.length > 0 && (
                      <div
                        onClick={() => {
                          setShowNotifications(false);
                          if (onNavigateNotification) onNavigateNotification("saved_docs");
                        }}
                        className="p-3.5 hover:bg-slate-50/80 transition flex items-start gap-3 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-605 border border-emerald-100 shrink-0 shadow-inner">
                          <HardDrive className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-black text-slate-800 leading-snug">
                              Dokumen PM Tersimpan
                            </p>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-normal mt-0.5 line-clamp-2">
                            Anda memiliki {files.length} draf analisis proyek & proposal yang tersimpan aman di cloud.
                          </p>
                          <span className="text-[8px] font-mono font-black text-emerald-600 mt-1 block uppercase tracking-wider">
                            LIHAT ARSIP DOKUMEN →
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 3. Static Welcome Notification */}
                    <div className="p-3.5 hover:bg-slate-50/40 transition flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                        <CheckCircle className="h-4 w-4 text-sky-505" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Selamat Datang di PRAMA
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold leading-normal mt-0.5">
                          PRAMA System Cognitive Portal v1.5 siap membantu operasional peninjauan proyek Anda.
                        </p>
                        <span className="text-[8px] font-mono font-extrabold text-slate-400 mt-1 block uppercase">
                          AKTIF SEKARANG
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 text-center">
                    <span className="text-[8px] font-mono font-extrabold text-slate-400 tracking-wider uppercase">
                      © PORTAL ASISTEN CERDAS PRAMA
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-red-650 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition cursor-pointer shrink-0 shadow-3sm"
              title="Keluar dari Akun"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Connection & Configuration Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs">
        {/* Connection Configuration */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
              showConfig
                ? "bg-indigo-600 border-indigo-600 text-white shadow-3sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Settings className="h-3 w-3 text-sky-500" />
            <span>Koneksi AI</span>
          </button>
        </div>
      </div>

      {/* Collapsible Connection Settings Panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-200 bg-indigo-50/50"
          >
            <div className="p-4 sm:px-6 space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                
                {/* Method selector */}
                <div className="space-y-1.5 flex-1 min-w-[200px]">
                  <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-indigo-600 animate-pulse" />
                    <span>Mode API Koneksi</span>
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setApiMode("proxy")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        apiMode === "proxy"
                          ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Secure Server</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setApiMode("client")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        apiMode === "client"
                          ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Direct Browser</span>
                    </button>
                  </div>
                </div>

                {/* API Key Form */}
                <form onSubmit={handleSaveLocalKey} className="flex-1 flex flex-col sm:flex-row items-end gap-2">
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      <span>Gemini Client API Key (Pribadi)</span>
                    </label>
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3">
                      <input
                        type={showLocalKey ? "text" : "password"}
                        value={localKeyInput}
                        onChange={(e) => {
                          setLocalKeyInput(e.target.value);
                          setIsSaved(false);
                        }}
                        placeholder="Masukkan kunci API (AIzaSy...)"
                        className="w-full bg-transparent border-none text-xs text-slate-800 focus:outline-none focus:ring-0 py-2.5 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLocalKey(!showLocalKey)}
                        className="text-slate-400 hover:text-slate-600 px-1.5 cursor-pointer"
                      >
                        {showLocalKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="flex-grow sm:flex-grow-0 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 shadow-sm transition shrink-0 cursor-pointer text-center"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalKeyInput("AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA");
                        setClientApiKey("AQ.Ab8RN6J18XhfT7OD0MR1jvDqtfQbcWD8pdIVctyDE0ZrRF2GrA");
                        setIsSaved(true);
                        setTimeout(() => setIsSaved(false), 4400);
                      }}
                      className="flex-grow sm:flex-grow-0 h-10 rounded-xl bg-slate-150 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 border border-slate-200 transition shrink-0 cursor-pointer text-center"
                    >
                      Reset Default
                    </button>
                  </div>
                </form>

              </div>

              {/* Status Indicator & Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[10px] text-slate-600 leading-relaxed max-w-4xl">
                <div className="flex items-center gap-1">
                  <CircleAlert className="h-3.5 w-3.5 text-indigo-600 inline shrink-0" />
                  <span>
                    {apiMode === "proxy"
                      ? "Menggunakan serverless backend. Jika kuota habis atau kunci bermasalah, silakan beralih ke 'Direct Browser' dan pasang API Key Anda di atas."
                      : "Sesi terhubung langsung dari browser ke Google AI Studio menggunakan kunci milik Anda."}
                  </span>
                </div>
                {isSaved && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg font-bold shadow-3sm whitespace-nowrap"
                  >
                    ✓ Kunci disimpan!
                  </motion.div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Messages Sticky Bar */}
      {isSearchingMessages && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm shrink-0 z-10">
          <Search className="h-4 w-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={activeSearchQuery}
            onChange={(e) => setActiveSearchQuery(e.target.value)}
            placeholder="Cari kata kunci dalam percakapan..."
            className="flex-1 text-slate-705 placeholder-slate-400 text-xs outline-none bg-transparent border-none py-1 h-full w-full focus:ring-0 focus:outline-none"
            autoFocus
          />
          {activeSearchQuery.trim() && (
            <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-150">
              {filteredMessages.length} hasil terpilih
            </span>
          )}
          <button
            onClick={() => {
              setActiveSearchQuery("");
              if (onToggleSearchMessages) {
                onToggleSearchMessages(false);
              }
            }}
            className="text-slate-405 hover:text-slate-650 cursor-pointer p-1.5 rounded-full hover:bg-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Messages Canvas Container with chat background */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f0f2f5] bg-[radial-gradient(#e4e6eb_1px,transparent_1px)] [background-size:20px_20px]">
        
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center py-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-md">
              <Sparkles className="h-7 w-7 animate-pulse text-sky-600" />
            </div>
            
            <span className="text-[9px] font-extrabold font-mono bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              DIREKTORAT ASISTEN AI
            </span>
            
            <h3 className="font-display font-extrabold text-slate-900 text-xl tracking-tight">
              Asisten PRAMA &ndash; <span className="text-sky-600">{getDivisionTitle(activeDivision)}</span>
            </h3>
            
            <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">
              Saya siap menganalisis data, memberikan rekomendasi taktis, atau merumuskan dokumen pendukung operasional khusus untuk pilar divisi ini.
            </p>


          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {filteredMessages.map((msg) => {
                const isUser = msg.role === "user";
                const lastAssistantMessage = [...messages].reverse().find(m => m.role === "model");
                const isLastAssistantMessage = lastAssistantMessage && lastAssistantMessage.id === msg.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Robot Persona avatar on left for assistant messages */}
                    {!isUser && (
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 shadow-3sm bg-slate-100 shrink-0 mt-0.5 self-start">
                        <img 
                          src={pramaLogo} 
                          alt="P" 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className={`flex max-w-[82%] flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}>
                      
                      {/* Message Bubble Canvas */}
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-3sm border relative ${
                          isUser
                            ? "bg-[#d9fdd3] border-[#b7e4bc] text-slate-800 rounded-tr-xs"
                            : "bg-white border-slate-200 text-slate-800 rounded-tl-xs"
                        }`}
                      >
                        {/* Sender Label */}
                        <div className="mb-1 flex items-center justify-between gap-4">
                          <span className={`text-[10px] font-extrabold tracking-wider uppercase ${isUser ? "text-emerald-700" : "text-sky-700"}`}>
                            {isUser ? "Anda" : (msg.sender || "Gemini AI")}
                          </span>
                        </div>

                        <div className="break-words">
                          {isUser ? <div>{msg.text}</div> : renderFormattedText(msg.text)}
                        </div>

                        {/* Interactive Tools for Reports inside Assistant Bubble */}
                        {!isUser && (
                          <div className="mt-4 border-t border-slate-150 pt-3.5 flex flex-col gap-3">
                            {isLastAssistantMessage ? (
                              <div className="flex flex-col gap-3.5">
                                {/* KAJIAN PROYEK TERAKHIR section */}
                                <div className="flex flex-col gap-2">
                                  <span className="font-mono text-[9px] text-slate-500 font-extrabold uppercase tracking-widest text-[#64748b]">
                                    KAJIAN PROYEK TERAKHIR:
                                  </span>
                                  <div className="flex flex-wrap gap-2.5">
                                    <button
                                      disabled={isGeneratingArticle}
                                      onClick={async () => {
                                        if (onExportArticle) {
                                          setIsGeneratingArticle(true);
                                          await onExportArticle(msg.text);
                                          setIsGeneratingArticle(false);
                                        }
                                      }}
                                      className="flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white border-none px-4 py-2 text-xs font-bold transition cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
                                    >
                                      {isGeneratingArticle ? (
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      ) : (
                                        <FileText className="h-4 w-4 text-white" />
                                      )}
                                      <span>{isGeneratingArticle ? "Memproses..." : "Unduh Word (.doc)"}</span>
                                    </button>

                                    <button
                                      disabled={isGeneratingPPT}
                                      onClick={async () => {
                                        if (onExportPPT) {
                                          setIsGeneratingPPT(true);
                                          await onExportPPT(msg.text);
                                          setIsGeneratingPPT(false);
                                        }
                                      }}
                                      className="flex items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white border-none px-4 py-2 text-xs font-bold transition cursor-pointer shadow-md shadow-sky-100 disabled:opacity-50"
                                    >
                                      {isGeneratingPPT ? (
                                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      ) : (
                                        <Sparkles className="h-4 w-4 text-white" />
                                      )}
                                      <span>{isGeneratingPPT ? "Memproses..." : "Unduh PPT (.pptx)"}</span>
                                    </button>
                                  </div>
                                </div>

                                {/* PESAN INI section */}
                                <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-50/60 rounded-xl p-2.5 border border-slate-100">
                                  <span className="font-mono text-[9px] text-slate-500 font-extrabold uppercase tracking-widest text-[#64748b]">
                                    PESAN INI:
                                  </span>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => {
                                        if (onPreviewAndExportWord) {
                                          onPreviewAndExportWord(msg.text);
                                        } else {
                                          const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                          exportToWord(title, msg.text, activeDivision || "PORTAL");
                                        }
                                      }}
                                      className="flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 transition cursor-pointer"
                                      title="Unduh laporan dalam format Microsoft Word (.doc)"
                                    >
                                      <Download className="h-3.5 w-3.5 text-indigo-600" />
                                      <span>Word</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (onPreviewAndExportPDF) {
                                          onPreviewAndExportPDF(msg.text);
                                        } else {
                                          const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                          downloadPDFDirect(title, msg.text, activeDivision || "PORTAL");
                                        }
                                      }}
                                      className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition cursor-pointer"
                                      title="Unduh Laporan sebagai file PDF"
                                    >
                                      <Download className="h-3.5 w-3.5 text-red-650" />
                                      <span>PDF</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <span className="font-mono text-[8px] text-slate-450 font-bold uppercase tracking-wider text-[#94a3b8]">
                                  INTEGRATED REPORTING SYSTEM
                                </span>
                                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                                  <button
                                    onClick={() => {
                                      if (onPreviewAndExportWord) {
                                        onPreviewAndExportWord(msg.text);
                                      } else {
                                        const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                        exportToWord(title, msg.text, activeDivision || "PORTAL");
                                      }
                                    }}
                                    className="flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition cursor-pointer"
                                    title="Unduh laporan dalam format Microsoft Word (.doc)"
                                  >
                                    <Download className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Word</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (onPreviewAndExportPDF) {
                                        onPreviewAndExportPDF(msg.text);
                                      } else {
                                        const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                        downloadPDFDirect(title, msg.text, activeDivision || "PORTAL");
                                      }
                                    }}
                                    className="flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700 transition cursor-pointer"
                                    title="Unduh Laporan sebagai file PDF"
                                  >
                                    <Download className="h-3.5 w-3.5 text-red-650" />
                                    <span>Unduh PDF</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Speech Bubble Foot Stats (Time & double checkticks) */}
                        <div className="mt-1 flex items-center justify-end gap-1 text-[9px]">
                          <span className="text-slate-400 font-mono font-medium">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {isUser && (
                            <span className="text-[10px] text-emerald-600 font-extrabold select-none">✓✓</span>
                          )}
                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2.5 py-3 justify-start max-w-4xl mx-auto">
            <div className="h-4.5 w-4.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
            <span className="font-mono text-[10px] font-bold tracking-wide uppercase text-slate-400">
              PRAMA AI sedang mengetik draf tanggapan...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input bar overlay */}
      <div className="p-4 sm:p-5 bg-[#f0f2f5] border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-2 max-w-3xl mx-auto">
          
          {activeReferencedFile && (
            <div className="flex items-center justify-between rounded-xl bg-sky-50 px-3.5 py-1.5 text-xs text-sky-800 border border-sky-100">
              <span className="flex items-center gap-1.5 font-bold">
                <FileText className="h-3.5 w-3.5 text-sky-600" />
                Melampirkan rujukan draf: <span className="font-mono text-indigo-700">{activeReferencedFile.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedFileId("")}
                className="text-slate-400 hover:text-red-500 font-bold px-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* PRAMA 15 Pillars Selection Menu Ribbon */}
          <div className="mb-1">
            <p className="text-[10px] text-indigo-700 font-black uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1.5 select-none">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              MENU PILIHAN PILAR UTAMA PRAMA:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent touch-pan-x flex-nowrap mask-right">
              {[
                { label: "New Journal", prompt: "Mari diskusikan mengenai pilar New Journal untuk proyek kita." },
                { label: "Global/NAT Overview", prompt: "Saya butuh analisis komparatif pilar Global & NAT Overview." },
                { label: "Market Opportunity", prompt: "Mari bedah celah bisnis pada pilar Market Opportunity proyek ini." },
                { label: "Financial Strategy", prompt: "Beri saya ulasan finansial lengkap mencakup Capex, Opex, P&L, Cash Flow, dan ROI ideal." },
                { label: "Supply & Demand", prompt: "Mari rumuskan keseimbangan Supply & Demand pada rantai logistik kita." },
                { label: "Structure", prompt: "Bagaimana rekomendasi rancangan pilar Structure operasional yang solid?" },
                { label: "Organization SOP", prompt: "Tolong susun Qualification staf, matrix kompetensi, Output/KPI, beserta draf SOP terbaik." },
                { label: "Transition Model", prompt: "Rancang strategi pilar Transition Model (Pre-transition, On-transition, dan Post-transition)." },
                { label: "Go To Market", prompt: "Beri saya rancangan formula Go To Market Strategy yang paling taktis." },
                { label: "Ops Model & SLA", prompt: "Susun Ops Model sistematis mencakup rancangan Flow Process, Workflow Diagram, beserta target SLA." },
                { label: "Risk Management", prompt: "Rancang kerangka kerja Risk Management dan strategi mitigasi risiko operasional." },
                { label: "Digital Automation", prompt: "Mari kita susun rancangan Digital Coverage meliputi tools, metode, dampak, dan otomatisasi." },
                { label: "Competitor Strategy", prompt: "Bagaimana cara memetakan keunggulan kita dibanding Competitor?" },
                { label: "TAM, SAM, SOM", prompt: "Tolong hitung rekomendasi angka TAM, SAM, dan SOM ideal (dalam Rupiah) untuk pasar logistik kita." },
                { label: "CAC, LTV", prompt: "Berapa rasio keuangan ideal untuk metrik CAC dan LTV pilar PRAMA ini?" }
              ].map((pillar, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    setInput(pillar.prompt);
                    if (onTyping) onTyping(true);
                  }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 shadow-3sm hover:shadow-2sm transition cursor-pointer select-none shrink-0 active:scale-95"
                >
                  {pillar.label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp / Telegram dynamic round input capsules */}
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-white border border-slate-200/80 focus-within:border-sky-400/80 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-3sm transition">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeReferencedFile
                    ? `Perintahkan pengolahan berkas "${activeReferencedFile.name}"...`
                    : `Ketik pesan ke PRAMA Strategic Advisor (${getDivisionTitle(activeDivision)})...`
                }
                rows={1}
                className="flex-1 resize-none bg-transparent border-none text-slate-800 placeholder-slate-450 focus:ring-0 focus:outline-none py-1 text-sm h-7 max-h-24"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white transition-all shadow-md hover:bg-indigo-500 disabled:bg-slate-350 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed shrink-0"
              title="Kirim Pesan"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
          
          <p className="text-center text-[8.5px] text-slate-400 uppercase tracking-widest font-mono font-extrabold mt-1">
            Sistem Konsultan Strategis PRAMA &bull; Keamanan Terenkripsi
          </p>
        </form>
      </div>

    </div>
  );
}

function renderFormattedText(text: string) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string | number) => {
    if (currentTableRows.length === 0) return null;

    // Filter out separator lines like |---|
    const cleanRows = currentTableRows.filter(row => !row.some(cell => /^:?-+:?$/.test(cell.trim())));
    if (cleanRows.length === 0) {
      currentTableRows = [];
      inTable = false;
      return null;
    }

    const colCount = cleanRows[0].length;
    let hasHeader = currentTableRows.length > 1 && currentTableRows[1].some(cell => /^:?-+:?$/.test(cell.trim()));
    
    const tableElement = (
      <div key={key} className="overflow-x-auto my-4 border border-slate-200 rounded-xl shadow-xs max-w-full">
        <table className="min-w-full divide-y divide-slate-200 text-left border-collapse">
          {hasHeader && (
            <thead className="bg-[#0f172a] text-white">
              <tr>
                {cleanRows[0].map((cell, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display border border-slate-700">
                    {parseInlineMarkdown(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-200 bg-white">
            {cleanRows.slice(hasHeader ? 1 : 0).map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-50/50 hover:bg-slate-50" : "bg-white hover:bg-slate-50"}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 text-[11px] sm:text-xs text-slate-700 leading-relaxed border border-slate-100">
                    {parseInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    currentTableRows = [];
    inTable = false;
    return tableElement;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Table checking
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      currentTableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        const table = flushTable(`table-${idx}`);
        if (table) {
          elements.push(table);
        }
      }
    }

    if (!trimmed) {
      elements.push(<div key={`empty-${idx}`} className="h-1.5" />);
      continue;
    }

    // 1. Headings (### or ## or #)
    if (trimmed.startsWith("###")) {
      elements.push(
        <h4 key={`h3-${idx}`} className="font-display font-extrabold text-slate-900 border-none text-sm mt-3 mb-1 block">
          {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("##")) {
      elements.push(
        <h3 key={`h2-${idx}`} className="font-display font-extrabold text-slate-900 border-none text-base mt-4 mb-2 block">
          {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("#")) {
      elements.push(
        <h2 key={`h1-${idx}`} className="font-display font-extrabold text-slate-900 border-none text-lg mt-5 mb-2 block">
          {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h2>
      );
      continue;
    }

    // 2. Ordered lists (1. 2. etc)
    const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (orderedListMatch) {
      elements.push(
        <div key={`ol-${idx}`} className="flex gap-2.5 ml-3 my-1.5 text-xs text-slate-700 leading-relaxed">
          <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-black text-[10px] shadow-3sm shrink-0 h-fit">
            {orderedListMatch[1]}.
          </span>
          <p className="flex-1 mt-0.5">{parseInlineMarkdown(orderedListMatch[2])}</p>
        </div>
      );
      continue;
    }

    // 2b. Indented alphabetical lists (a. b. c. etc for narrowing/sub-points)
    const alphaListMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)/);
    if (alphaListMatch) {
      elements.push(
        <div key={`al-${idx}`} className="flex gap-2.5 ml-8 my-1 text-xs text-slate-600 leading-relaxed">
          <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold text-[9px] shadow-3sm shrink-0 h-fit uppercase">
            {alphaListMatch[1]}.
          </span>
          <p className="flex-1 mt-0.5">{parseInlineMarkdown(alphaListMatch[2])}</p>
        </div>
      );
      continue;
    }

    // 3. Bullet points (- or * or •)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const content = trimmed.replace(/^[-*•]\s+/, "");
      elements.push(
        <div key={`ul-${idx}`} className="flex gap-2.5 ml-3 my-1 text-xs text-slate-700 items-start leading-relaxed animate-none">
          <span className="text-sky-500 mt-1.5 shrink-0 select-none text-[10px]">•</span>
          <p className="flex-1 mt-0.5">{parseInlineMarkdown(content)}</p>
        </div>
      );
      continue;
    }

    // 4. Standard Paragraph / Line
    elements.push(
      <p key={`p-${idx}`} className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  if (inTable) {
    const table = flushTable(`table-end`);
    if (table) {
      elements.push(table);
    }
  }

  return <div className="space-y-2 mt-1">{elements}</div>;
}

function parseInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  while (currentText.length > 0) {
    // Look for bold and link patterns
    const boldIndex = currentText.indexOf("**");
    const linkIndex = currentText.indexOf("[");

    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(<span key={keyIdx++}>{currentText}</span>);
      break;
    }

    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      // Bold comes first
      if (boldIndex > 0) {
        parts.push(<span key={keyIdx++}>{currentText.substring(0, boldIndex)}</span>);
      }
      const rest = currentText.substring(boldIndex + 2);
      const nextBoldIndex = rest.indexOf("**");
      if (nextBoldIndex !== -1) {
        parts.push(
          <strong key={keyIdx++} className="font-extrabold text-slate-950 bg-slate-100/80 rounded px-1.5 py-0.5 shadow-3sm border border-slate-200 inline">
            {rest.substring(0, nextBoldIndex)}
          </strong>
        );
        currentText = rest.substring(nextBoldIndex + 2);
      } else {
        parts.push(<span key={keyIdx++}>**</span>);
        currentText = rest;
      }
    } else {
      // Link comes first
      if (linkIndex > 0) {
        parts.push(<span key={keyIdx++}>{currentText.substring(0, linkIndex)}</span>);
      }
      const rest = currentText.substring(linkIndex + 1);
      const closingBracketIndex = rest.indexOf("]");
      if (closingBracketIndex !== -1) {
        const linkText = rest.substring(0, closingBracketIndex);
        const urlPart = rest.substring(closingBracketIndex + 1);
        if (urlPart.startsWith("(")) {
          const closingParenthesisIndex = urlPart.indexOf(")");
          if (closingParenthesisIndex !== -1) {
            const url = urlPart.substring(1, closingParenthesisIndex);
            parts.push(
              <a
                key={keyIdx++}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 underline font-extrabold transition inline"
              >
                {linkText}
              </a>
            );
            currentText = urlPart.substring(closingParenthesisIndex + 1);
            continue;
          }
        }
      }
      parts.push(<span key={keyIdx++}>[</span>);
      currentText = rest;
    }
  }

  return parts;
}
