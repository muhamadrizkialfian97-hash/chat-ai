import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SavedFile } from "../types";
import { Send, FileText, Globe, CircleAlert, Cpu, Eye, EyeOff, Settings, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [enableSearch, setEnableSearch] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [showConfig, setShowConfig] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeReferencedFile = files.find((f) => f.id === selectedFileId) || null;

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
      
      {/* Top Header Controls (Search & References) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className={`h-4 w-4 ${enableSearch ? "text-sky-600" : "text-slate-400"}`} />
          <span className="text-xs font-bold text-slate-700">Google Grounding:</span>
          <button
            type="button"
            onClick={() => setEnableSearch(!enableSearch)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enableSearch ? "bg-sky-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enableSearch ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
            {enableSearch ? "ONLINE SEARCH" : "PRAMA ENGINE"}
          </span>
        </div>

        {/* Reference File Picker & Connection Configuration */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Rujuk File:</span>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 focus:outline-none font-bold"
            >
              <option value="">-- Tanpa Rujukan --</option>
              {files.map((file) => (
                <option key={file.id} value={file.id} className="text-slate-800">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold font-mono transition shadow-2sm ${
              showConfig ? "bg-indigo-600 text-white" : "border border-slate-250 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>KONEKSI ({apiMode === "client" ? "BROWSER" : "SECURE SERVER"})</span>
          </button>
        </div>
      </div>

      {/* Connection Setting Foldout */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-250 bg-white px-4 py-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-sm">
              <div className="space-y-1.5">
                <label className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-slate-500 block">
                  Metode API Koneksi
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setApiMode("proxy")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      apiMode === "proxy"
                        ? "bg-white text-slate-800 shadow"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Secure Server (Proxy)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiMode("client")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      apiMode === "client"
                        ? "bg-white text-slate-800 shadow"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Direct Key (Browser)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-slate-500 block">
                  Gemini Client API Key (Pribadi Anda)
                </label>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden px-3">
                  <input
                    type={showKey ? "text" : "password"}
                    value={clientApiKey}
                    onChange={(e) => setClientApiKey(e.target.value)}
                    placeholder="Masukkan Gemini API Key pribadi Anda (menyimpan otomatis)..."
                    className="w-full bg-transparent border-none text-xs text-slate-800 focus:outline-none focus:ring-0 py-2 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-800 leading-relaxed shadow-3sm">
              <CircleAlert className="h-4 w-4 text-emerald-600 inline mr-1" />
              <strong>💡 Tips Vercel Instan & Tanpa Batas:</strong> 
              {clientApiKey ? (
                <> Kunci API pribadi Anda terdeteksi (<span className="font-mono text-[10px] bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-bold">AKTIF</span>). Hubungan Gemini AI akan berjalan otomatis baik di Vercel maupun local sandbox tanpa konfigurasi server tambahan.</>
              ) : (
                <> Jika kuota server bawaan habis ( RESOURCE_EXHAUSTED ), Anda cukup memasukkan <strong>Gemini API Key pribadi</strong> Anda di atas. Ini akan otomatis disimpan di browser Anda secara aman dan dipakai sebagai jalur penghubung (proxy maupun direct) tanpa perlu mensetting Environment Variable apa pun di dashboard Vercel Anda!</>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Canvas Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
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
              <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-3">
                Saran Pertanyaan Preset (klik untuk mengisi form)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset.text)}
                    className="flex items-center gap-1 bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition cursor-pointer shadow-3sm hover:text-sky-700 text-left"
                  >
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-extrabold mr-1 shadow-inner">
                      {preset.label}
                    </span>
                    <span>{preset.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 max-w-4xl mx-auto">
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
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                      
                      {/* Message Meta */}
                      <div className="flex items-center gap-2 px-1">
                        <span className={`font-mono text-[9px] font-bold tracking-wider uppercase ${isUser ? "text-indigo-600" : "text-sky-600"}`}>
                          {isUser ? (msg.sender || "Diri Anda") : (msg.sender || "Gemini Core AI")}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Msg content bubble */}
                      <div
                        className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                          isUser
                            ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none"
                            : "bg-white border-slate-200 text-slate-800 rounded-tl-none font-medium"
                        }`}
                      >
                        <div>{msg.text}</div>

                        {!isUser && msg.text && (
                          <div className="mt-4 flex border-t border-slate-100 pt-3 text-right justify-between items-center gap-4">
                            <span className="font-mono text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                              INTEGRATED REPORTING SYSTEM
                            </span>
                            <button
                              onClick={() => {
                                const placeholderName = `prama_${activeDivision || "analitis"}_${Date.now().toString().slice(-4)}.md`;
                                onSaveAsFile(msg.text, placeholderName);
                              }}
                              className="flex items-center gap-1.5 rounded-xl bg-sky-50 shadow-inner border border-sky-100 px-3 py-1.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-sky-600" />
                              <span>Simpan dokumen ke Mirror Storage</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 py-4 justify-start max-w-4xl mx-auto">
            <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span className="font-mono text-[10px] font-semibold tracking-wide uppercase text-slate-400">
              PRAMA AI sedang merumuskan matriks & simulasi...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input bar overlay */}
      <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-2 max-w-3xl mx-auto">
          
          {activeReferencedFile && (
            <div className="flex items-center justify-between rounded-xl bg-sky-50 px-3.5 py-1.5 text-xs text-sky-800 border border-sky-100">
              <span className="flex items-center gap-1.5 font-bold">
                <FileText className="h-3.5 w-3.5 text-sky-600" />
                Melampirkan analisis referensi: <span className="font-mono text-indigo-700">{activeReferencedFile.name}</span>
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

          <div className="relative bg-slate-50 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-100 rounded-2xl p-2.5 transition">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                activeReferencedFile
                  ? `Berikan instruksi pengolahan dokumen "${activeReferencedFile.name}"...`
                  : `Konsultasikan draf proposal / audit perhitungan divisi ${getDivisionTitle(activeDivision)}...`
              }
              rows={3}
              className="w-full resize-none bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none py-1.5 text-sm h-14"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3.5 bottom-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all shadow-md hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-center text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-1">
            Teknologi AI PRAMA memiliki kapabilitas verifikasi silang otomatis.
          </p>
        </form>
      </div>

    </div>
  );
}
