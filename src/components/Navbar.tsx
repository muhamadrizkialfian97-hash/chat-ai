import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut, User } from "firebase/auth";
import { Database, LogOut, Briefcase, ChevronRight, Bell, HardDrive, Users, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import pramaLogo from "../assets/images/prama_logo_1780452149937.png";

interface NavbarProps {
  user: User | null;
  loading: boolean;
  activeDivision: string | null;
  onClearDivision: () => void;
  collabUsername?: string;
  onLogout?: () => void;
  pendingRequestsCount?: number;
  filesCount?: number;
  onNavigateToView?: (view: "divisions" | "saved_docs" | "approval_requests") => void;
}

export default function Navbar({ 
  user, 
  loading, 
  activeDivision, 
  onClearDivision,
  collabUsername,
  onLogout,
  pendingRequestsCount = 0,
  filesCount = 0,
  onNavigateToView
}: NavbarProps) {
  
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      console.error("Sign Out Error:", err);
      // Fallback
      if (onLogout) {
        onLogout();
      }
    }
  };

  const getDivisionLabel = (id: string) => {
    switch (id) {
      case "comercial": return "Comercial & Business Dev";
      case "hca": return "Human Capital & Affairs";
      case "fina": return "Finance & Accounting";
      case "lga": return "Legal & Governance";
      case "spia": return "Internal Audit (SPIA)";
      default: return id;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-md">
            <img 
              id="prama-header-logo"
              src={pramaLogo} 
              alt="PRAMA Logo" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-base leading-none tracking-tight text-slate-900 md:text-lg">
                PRAMA <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 ml-1.5 uppercase font-mono tracking-wider">System</span>
              </h1>
            </div>
            <span className="font-mono text-[9px] font-bold text-slate-500 block">
              PROJECT MANAGEMENT ANALITIC
            </span>
          </div>

          {/* Division Breadcrumb */}
          {activeDivision && (
            <div className="hidden items-center gap-1.5 sm:flex pl-4 border-l border-slate-200 ml-4">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <Briefcase className="h-3.5 w-3.5 text-sky-600" />
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                {getDivisionLabel(activeDivision)}
              </span>
              <button 
                onClick={onClearDivision}
                className="text-[10px] font-bold text-sky-600 hover:text-indigo-700 cursor-pointer hover:underline ml-1"
              >
                Ganti Divisi
              </button>
            </div>
          )}
        </div>

        {/* Right Navigation & Status Indicators */}
        <div className="flex items-center gap-4">
          
          {/* Database Synchronization Status Node */}
          <div className="hidden items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 text-xs font-bold text-slate-600 sm:flex shadow-2sm">
            <span className={`h-2 w-2 rounded-full ${user ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
            <Database className="h-3.w w-3 text-sky-600" />
            <span className="font-mono text-[10px] tracking-wide">
              {user ? "KONEKSI PORTAL: ONLINE" : "MODE LOCAL OFFLINE"}
            </span>
          </div>

          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-100 border-t-sky-600" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-xs font-bold text-slate-800">
                  {collabUsername || user.displayName || user.email?.split("@")[0] || "Staf Prama"}
                </p>
                <p className="text-[9px] text-slate-500 font-mono font-medium">
                  {user.email || "local@prama.net"}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 font-display font-extrabold text-sm text-white flex items-center justify-center border border-slate-200 shadow-inner">
                {(collabUsername || user.displayName || user.email || "?").charAt(0).toUpperCase()}
              </div>

              {/* Notification Popover Button & Dropdown on its Left */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                    showNotifications
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-inner"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 hover:text-indigo-600"
                  }`}
                  title="Notifikasi Masuk"
                >
                  <Bell className="h-4 w-4 shrink-0" />
                  {/* Dynamic Notification badge */}
                  {(pendingRequestsCount + (filesCount > 0 ? 1 : 0) + 1) > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black leading-none text-white ring-2 ring-white animate-pulse">
                      {pendingRequestsCount + (filesCount > 0 ? 1 : 0) + 1}
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
                          {pendingRequestsCount + (filesCount > 0 ? 1 : 0) + 1} Baru
                        </span>
                      </div>

                      {/* Notification list */}
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        
                        {/* 1. Dynamic Pending Approvals Notification */}
                        {pendingRequestsCount > 0 ? (
                          <div
                            onClick={() => {
                              setShowNotifications(false);
                              if (onNavigateToView) onNavigateToView("approval_requests");
                            }}
                            className="p-3.5 hover:bg-slate-50/80 transition flex items-start gap-3 cursor-pointer"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 border border-indigo-100 shrink-0 shadow-inner">
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
                        {filesCount > 0 && (
                          <div
                            onClick={() => {
                              setShowNotifications(false);
                              if (onNavigateToView) onNavigateToView("saved_docs");
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
                                Anda memiliki {filesCount} draf analisis proyek & proposal yang tersimpan aman di cloud.
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
                            <CheckCircle className="h-4 w-4 text-sky-500" />
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

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all cursor-pointer hover:text-red-650"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
