import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SavedFile } from "../types";
import { Send, FileText, Globe, CircleAlert, Cpu, Eye, EyeOff, Settings, Sparkles, Download, Printer, ArrowLeft, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToWord, exportToPDF, downloadPDFDirect } from "../utils/documentExporter";
import pramaLogo from "../assets/images/prama_logo_1780452149937.png";

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string, enableSearch: boolean, referencedFile?: SavedFile | null) => Promise<void>;
  files: SavedFile[];
  onSaveAsFile: (content: string, requestedFileName?: string) => void;
  apiMode: "proxy" | "client";
  setApiMode: (mode: "proxy" | "client") => void;
  clientApiKey: string;
  setClientApiKey: (key: string) => void;
  activeDivision: string | null;
  onTyping?: (isTyping: boolean) => void;
  onBackToDashboard?: () => void;
  onLogout?: () => void;
}

export default function ChatPanel({
  messages,
  loading,
  onSendMessage,
  files,
  onSaveAsFile,
  apiMode,
  setApiMode,
  clientApiKey,
  setClientApiKey,
  activeDivision,
  onTyping,
  onBackToDashboard,
  onLogout,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [showConfig, setShowConfig] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeReferencedFile = files.find((f) => f.id === selectedFileId) || null;

  const [localKeyInput, setLocalKeyInput] = useState(clientApiKey);
  const [showLocalKey, setShowLocalKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalKeyInput(clientApiKey);
  }, [clientApiKey]);

  const handleSaveLocalKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localKeyInput.trim()) return;
    setClientApiKey(localKeyInput.trim());
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Globe className={`h-3.5 w-3.5 ${enableSearch ? "text-sky-600" : "text-slate-400"}`} />
          <span className="font-bold text-slate-500">Grounding Google:</span>
          <button
            type="button"
            onClick={() => setEnableSearch(!enableSearch)}
            className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enableSearch ? "bg-sky-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enableSearch ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-[9px] font-mono font-bold uppercase text-slate-400">
            {enableSearch ? "ONLINE SEARCH" : "PRAMA ENGINE"}
          </span>
        </div>

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
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 shadow-sm transition shrink-0 cursor-pointer text-center"
                  >
                    Simpan
                  </button>
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

            {/* Division Preset Suggestions */}
            <div className="mt-8 max-w-xl w-full">
              <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-3 text-center">
                Saran Pertanyaan Preset (klik untuk mengisi form)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset.text)}
                    className="flex items-center gap-1 bg-white border border-slate-200 hover:border-sky-450 hover:bg-sky-50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition cursor-pointer shadow-3sm hover:text-sky-700 text-left"
                  >
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-extrabold mr-1 shadow-inner whitespace-nowrap">
                      {preset.label}
                    </span>
                    <span>{preset.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
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
                            {isUser ? "Melihat Berkas" : (msg.sender || "Gemini AI")}
                          </span>
                        </div>

                        <div className="break-words">
                          {isUser ? <div>{msg.text}</div> : renderFormattedText(msg.text)}
                        </div>

                        {/* Interactive Tools for Reports inside Assistant Bubble */}
                        {!isUser && (
                          <div className="mt-4 flex flex-col sm:flex-row border-t border-slate-100 pt-3.5 justify-between items-start sm:items-center gap-3">
                            <span className="font-mono text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                              INTEGRATED REPORTING SYSTEM
                            </span>
                            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                              <button
                                onClick={() => {
                                  const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                  exportToWord(title, msg.text, activeDivision || "PORTAL");
                                }}
                                className="flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition cursor-pointer"
                                title="Unduh laporan dalam format Microsoft Word (.doc)"
                              >
                                <Download className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Word</span>
                              </button>

                              <button
                                onClick={() => {
                                  const title = `PRAMA_${activeDivision || "ANALITIS"}_${Date.now().toString().slice(-4)}`;
                                  downloadPDFDirect(title, msg.text, activeDivision || "PORTAL");
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

  // Split lines
  const lines = text.split("\n");

  return (
    <div className="space-y-2 mt-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Headings (### or ## or #)
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="font-display font-extrabold text-slate-900 border-none text-sm mt-3 mb-1 block">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="font-display font-extrabold text-slate-900 border-none text-base mt-4 mb-2 block">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="font-display font-extrabold text-slate-900 border-none text-lg mt-5 mb-2 block">
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        // 2. Ordered lists (1. 2. etc)
        const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (orderedListMatch) {
          return (
            <div key={idx} className="flex gap-2.5 ml-3 my-1.5 text-xs text-slate-700 leading-relaxed">
              <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-black text-[10px] shadow-3sm shrink-0 h-fit">
                {orderedListMatch[1]}.
              </span>
              <p className="flex-1 mt-0.5">{parseInlineMarkdown(orderedListMatch[2])}</p>
            </div>
          );
        }

        // 2b. Indented alphabetical lists (a. b. c. etc for narrowing/sub-points)
        const alphaListMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)/);
        if (alphaListMatch) {
          return (
            <div key={idx} className="flex gap-2.5 ml-8 my-1 text-xs text-slate-600 leading-relaxed">
              <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold text-[9px] shadow-3sm shrink-0 h-fit uppercase">
                {alphaListMatch[1]}.
              </span>
              <p className="flex-1 mt-0.5">{parseInlineMarkdown(alphaListMatch[2])}</p>
            </div>
          );
        }

        // 3. Bullet points (- or * or •)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
          const content = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={idx} className="flex gap-2.5 ml-3 my-1 text-xs text-slate-700 items-start leading-relaxed animate-none">
              <span className="text-sky-500 mt-1.5 shrink-0 select-none text-[10px]">•</span>
              <p className="flex-1 mt-0.5">{parseInlineMarkdown(content)}</p>
            </div>
          );
        }

        // 4. Standard Paragraph / Line
        if (line === "") {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
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
