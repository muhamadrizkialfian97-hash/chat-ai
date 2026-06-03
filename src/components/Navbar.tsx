import React from "react";
import { auth } from "../firebase";
import { signOut, User } from "firebase/auth";
import { Database, LogOut, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import pramaLogo from "../assets/images/prama_logo_1780452149937.png";

interface NavbarProps {
  user: User | null;
  loading: boolean;
  activeDivision: string | null;
  onClearDivision: () => void;
  collabUsername?: string;
  onLogout?: () => void;
}

export default function Navbar({ 
  user, 
  loading, 
  activeDivision, 
  onClearDivision,
  collabUsername,
  onLogout
}: NavbarProps) {
  
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all cursor-pointer hover:text-red-600"
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
