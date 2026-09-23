import React, { useState } from "react";
import { Globe, Cpu, Eye, EyeOff, X, Check, Key, ShieldCheck, Cloud, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiMode: "proxy" | "client";
  setApiMode: (mode: "proxy" | "client") => void;
  clientApiKey: string;
  setClientApiKey: (key: string) => void;
  currentUserEmail?: string | null;
}

export function AISettingsModal({
  isOpen,
  onClose,
  apiMode,
  setApiMode,
  clientApiKey,
  setClientApiKey,
  currentUserEmail
}: AISettingsModalProps) {
  const [showKey, setShowKey] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [syncToAllUsers, setSyncToAllUsers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Strict email restriction: only muhamadrizkialfian97@gmail.com is authorized
  const isAuthorized = currentUserEmail?.trim().toLowerCase() === "muhamadrizkialfian97@gmail.com";

  if (!isOpen || !isAuthorized) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const cleanedKey = clientApiKey.trim();
    localStorage.setItem("workspace_api_mode", apiMode);
    localStorage.setItem("workspace_client_api_key", cleanedKey);

    if (syncToAllUsers) {
      try {
        const configDocRef = doc(db, "settings", "ai_config");
        await setDoc(configDocRef, {
          apiKey: cleanedKey,
          apiMode: apiMode,
          lastUpdated: serverTimestamp(),
          updatedBy: currentUserEmail || "Pengguna PRAMA",
          autoLoadedForAll: true
        }, { merge: true });
        console.log("AI Config successfully synced to Firestore settings/ai_config");
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, "settings/ai_config");
      }
    }

    setIsSaving(false);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 1000);
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
                <h3 className="font-display font-black text-sm uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Konfigurasi Hub Koneksi AI</span>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Auto-Sync
                  </span>
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
            {/* Auto Active Notification Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-2sm">
              <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-xs text-emerald-950">
                <p className="font-extrabold text-emerald-900">
                  Kunci AI Terhubung Otomatis
                </p>
                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5">
                  Siapa pun yang berhasil login ke sistem PRAMA akan <strong>otomatis terisi kuncinya</strong> dan siap menggunakan seluruh fitur AI secara langsung tanpa input ulang.
                </p>
              </div>
            </div>

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
                  Gemini API Key (Global / Pribadi)
                </label>
                {clientApiKey ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Aktif & Siap Pakai
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Belum Terisi
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

            {/* Global Sync Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200 transition">
              <input
                type="checkbox"
                checked={syncToAllUsers}
                onChange={(e) => setSyncToAllUsers(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-indigo-600" />
                  Sinkronkan Otomatis ke Seluruh Pengguna Login (Global Cloud)
                </span>
                <p className="text-[10.5px] text-slate-500 mt-0.5 leading-normal font-medium">
                  Saat opsi ini aktif, kunci akan disimpan ke cloud Firestore sehingga siapapun anggota staf yang login akan langsung memiliki kunci ini tanpa perlu mengetik ulang.
                </p>
              </div>
            </label>

            {/* Help tip */}
            <div className="rounded-2xl bg-indigo-50/70 text-[11px] text-indigo-950 p-3.5 leading-relaxed border border-indigo-100 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span>Informasi Hub API & Keamanan</span>
              </div>
              <p className="text-slate-600">
                Jika kuota habis (<code className="font-mono text-[10px] bg-indigo-100/80 px-1 py-0.5 rounded text-indigo-950 font-bold">RESOURCE_EXHAUSTED</code>), Anda dapat memperbarui kunci di atas kapan saja untuk menyegarkan koneksi AI semua pengguna.
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
                disabled={isSaving}
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer shadow-md shadow-indigo-100 active:scale-95 disabled:opacity-50"
              >
                {savedFeedback ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Tersimpan & Disinkronkan!</span>
                  </>
                ) : isSaving ? (
                  <span>Menyimpan...</span>
                ) : (
                  <span>Simpan & Sinkronkan</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
