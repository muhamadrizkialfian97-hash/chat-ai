import React, { useState } from "react";
import { Globe, Cpu, Eye, EyeOff, X, Check, Key, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiMode: "proxy" | "client";
  setApiMode: (mode: "proxy" | "client") => void;
  clientApiKey: string;
  setClientApiKey: (key: string) => void;
}

export function AISettingsModal({
  isOpen,
  onClose,
  apiMode,
  setApiMode,
  clientApiKey,
  setClientApiKey,
}: AISettingsModalProps) {
  const [showKey, setShowKey] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("workspace_api_mode", apiMode);
    localStorage.setItem("workspace_client_api_key", clientApiKey.trim());
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ zIndex: 99999 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
        >
          {/* Header */}
          <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center shadow-inner">
                <Cpu className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-black text-indigo-400 uppercase tracking-widest block">
                  HUB INTEGRASI PRAMA AI
                </span>
                <h3 className="font-display font-black text-sm uppercase tracking-tight text-white">
                  Konfigurasi Hub Koneksi AI
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* API Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-500 block">
                Metode API Koneksi
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setApiMode("proxy")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    apiMode === "proxy"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <div className="text-left">
                    <span className="block leading-none">Secure Server</span>
                    <span className="text-[8.5px] text-slate-400 font-normal">Backend Proxy</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setApiMode("client")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    apiMode === "client"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Cpu className="h-4 w-4 text-emerald-600" />
                  <div className="text-left">
                    <span className="block leading-none">Direct Browser</span>
                    <span className="text-[8.5px] text-slate-400 font-normal">Client Direct</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Input for API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold font-mono uppercase tracking-wider text-slate-500">
                  Gemini Client API Key (Pribadi)
                </label>
                {clientApiKey && (
                  <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tersimpan Lokal
                  </span>
                )}
              </div>
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
                <Key className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type={showKey ? "text" : "password"}
                  value={clientApiKey || ""}
                  onChange={(e) => setClientApiKey(e.target.value)}
                  placeholder="Masukkan Gemini API Key..."
                  className="w-full bg-transparent border-none text-xs text-slate-800 focus:outline-none focus:ring-0 py-2.5 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                  title={showKey ? "Sembunyikan API Key" : "Lihat API Key"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Help tip */}
            <div className="rounded-2xl bg-indigo-50/70 text-[11px] text-indigo-950 p-4 leading-relaxed border border-indigo-100 shadow-sm space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span>Informasi Hub API & Keamanan</span>
              </div>
              <p className="text-slate-600">
                Jika kuota bawaan habis (<code className="font-mono text-[10px] bg-indigo-100/80 px-1 py-0.5 rounded text-indigo-950 font-bold">RESOURCE_EXHAUSTED</code>), silakan masukkan <strong>Gemini API Key pribadi</strong> Anda di atas. Ini otomatis tersimpan di browser aman Anda dan tidak dibagikan ke pihak lain.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              Status: {apiMode === "proxy" ? "🌐 Secure Server" : "⚡ Direct Browser"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer shadow-md shadow-indigo-100 active:scale-95"
              >
                {savedFeedback ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <span>Simpan Pengaturan</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
