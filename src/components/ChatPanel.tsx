import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SavedFile, SearchSource } from "../types";
import { Send, Sparkles, FileText, Globe, ArrowRight, CircleAlert, Disc, Settings, Key, Cpu, Eye, EyeOff, HelpCircle } from "lucide-react";
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

    onSendMessage(input.trim(), enableSearch, activeReferencedFile);
    setInput("");
    setSelectedFileId(""); // reset reference after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Search & Reference Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 bg-slate-950/80 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Globe className={`h-4 w-4 ${enableSearch ? "text-blue-400" : "text-slate-505"}`} />
          <span className="text-xs font-semibold text-slate-300">Google Search:</span>
          <button
            type="button"
            onClick={() => setEnableSearch(!enableSearch)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enableSearch ? "bg-blue-600" : "bg-slate-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                enableSearch ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-[10px] font-mono tracking-wide text-slate-500">
            {enableSearch ? "GROUNDING: ACTIVE" : "INTERNAL MODEL"}
          </span>
        </div>

        {/* Reference File Picker & Settings */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="hidden text-xs font-semibold text-slate-300 sm:inline">
              Rujuk:
            </span>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-300 focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="">-- Tanpa Rujukan --</option>
              {files.map((file) => (
                <option key={file.id} value={file.id} className="bg-slate-900 text-slate-300">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold font-mono transition ${
              showConfig ? "bg-blue-600 text-white" : "border border-slate-800 text-slate-400 bg-slate-900/60 hover:text-white"
            }`}
          >
            <Settings className={`h-3.5 w-3.5 ${showConfig ? "animate-spin" : ""}`} />
            <span>SETELAN ({apiMode === "client" ? "CLIENT" : "PROXY"})</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-slate-900 bg-slate-950 px-4 py-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-sm">
              {/* Option 1: Connection Mode Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 block">
                  Mode Koneksi Gemini AI
                </label>
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setApiMode("proxy")}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      apiMode === "proxy"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Proxy Server</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiMode("client")}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      apiMode === "client"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>Direct Client</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  {apiMode === "proxy" 
                    ? "Menggunakan proxy server default di AI Studio. Cepat & aman tanpa setup manual."
                    : "Menghubungi API Gemini langsung dari browser Anda. Sangat ideal untuk deploy static di Vercel!"}
                </p>
              </div>

              {/* Option 2: Browser API Key input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 block">
                  Gemini API Key Client
                </label>
                <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden px-3">
                  <Key className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type={showKey ? "text" : "password"}
                    value={clientApiKey}
                    onChange={(e) => setClientApiKey(e.target.value)}
                    placeholder="Masukkan AI Studio API Key..."
                    className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-0 py-2.5"
                    disabled={apiMode !== "client"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-slate-500 hover:text-slate-300 px-1"
                    disabled={apiMode !== "client"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  Kunci API ini disimpan secara lokal di browser Anda. <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Buat API Key gratis disini &rarr;</a>
                </p>
              </div>
            </div>

            {/* Direct Vercel information note */}
            <div className="max-w-3xl mx-auto rounded-xl bg-slate-900/60 border border-slate-900 p-3 flex items-start gap-3 text-xs text-slate-400">
              <CircleAlert className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-200">Tips Sukses Deploy Vercel:</span>
                <p className="leading-normal font-sans">
                  Kami telah membuat serverless handler otomatis di file <code className="text-emerald-400 font-mono">/api/chat.ts</code>. Saat mendeploy website ini ke Vercel, pastikan Anda menambahkan <code className="text-emerald-400 font-mono">GEMINI_API_KEY</code> pada tab <strong>Environment Variables</strong> di dashboard proyek Vercel Anda, maka respons chat Anda akan berfungsi tanpa pengaturan tambahan!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 text-white shadow-xl shadow-indigo-505/10">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-slate-100 text-lg tracking-tight">
              Mulai Chat dengan <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Gemini AI</span>
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">
              Asisten AI Gemini-3.5 siap membantu Anda menyusun dokumen, menulis kode, memecahkan masalah, atau merangkum file di Mirror Storage Anda.
            </p>
            {files.length > 0 && (
              <span className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-400 font-mono uppercase tracking-wide">
                <FileText className="h-3.5 w-3.5 text-blue-400" /> {files.length} FILE TERSEDIA DI SYSTEM MIRROR
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[85%] flex-col gap-1.5 ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 px-1">
                        <span className="font-mono text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                          {isUser ? "User Client" : "Gemini Core Pro"}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div
                        className={`prose rounded-2xl px-5 py-3.5 text-sm leading-relaxed dark:prose-invert ${
                          isUser
                            ? "bg-slate-900 border border-slate-800 text-slate-100 rounded-tr-none shadow-md shadow-black/20"
                            : "bg-slate-900/40 border border-slate-800/80 rounded-tl-none shadow-xl text-slate-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {!isUser && msg.text && (
                          <div className="mt-4 flex border-t border-slate-850 pt-3 text-right justify-between items-center gap-4">
                            <span className="font-mono text-[9px] text-slate-500">
                              MIRROR MODEL VERIFICATION SUCCESSFUL
                            </span>
                            <button
                              onClick={() => {
                                const placeholderName = `gemini_response_${Date.now().toString().slice(-4)}.md`;
                                onSaveAsFile(msg.text, placeholderName);
                              }}
                              className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Simpan sebagai File</span>
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
          <div className="flex items-center gap-2 text-slate-400 py-4 max-w-3xl mx-auto">
            <Disc className="h-4 w-4 animate-spin text-blue-400" />
            <span className="font-mono text-xs tracking-wide uppercase text-slate-500">Menganalisis dan merumuskan respons...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Area */}
      <div className="p-4 sm:p-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent border-t border-slate-900">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-2 max-w-3xl mx-auto">
          {activeReferencedFile && (
            <div className="flex items-center justify-between rounded-xl bg-blue-500/10 px-3.5 py-2 text-xs text-blue-400 border border-blue-500/20">
              <span className="flex items-center gap-1.5 font-semibold">
                <FileText className="h-3.5 w-3.5 animate-pulse text-blue-400" />
                Melampirkan rujukan: <span className="font-mono text-xs text-emerald-400 font-normal">{activeReferencedFile.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedFileId("")}
                className="text-slate-400 hover:text-red-500 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-2xl shadow-black/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeReferencedFile
                  ? `Ketik perintah untuk file "${activeReferencedFile.name}"...`
                  : "Tanyakan apa saja ke Gemini AI..."
              }
              rows={3}
              className="w-full resize-none bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 focus:outline-none py-2 text-sm h-14"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3.5 bottom-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition-all shadow-lg hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-655"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-center text-[10px] text-slate-600 uppercase tracking-widest font-mono">
            AI can make mistakes. Verify Firebase mirror logs for critical data.
          </p>
        </form>
      </div>
    </div>
  );
}
