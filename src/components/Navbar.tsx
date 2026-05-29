import React from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { Sparkles, Database, LogIn, LogOut, FileCode } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  user: User | null;
  loading: boolean;
}

export default function Navbar({ user, loading }: NavbarProps) {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Authentication Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign Out Error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 text-white shadow-lg shadow-indigo-500/10">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Gemini</span>{" "}
              <span className="text-white">Workspace</span>
            </h1>
            <span className="font-mono text-[10px] text-slate-500">
              Chat & Mirror Storage v1.5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Firestore status indicator */}
          <div className="hidden items-center gap-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 sm:flex">
            <span className={`h-2.5 w-2.5 rounded-full ${user ? "bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
            <Database className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono text-[11px] tracking-wide uppercase">{user ? "Firebase Mirror: Live" : "Local Database Mode"}</span>
          </div>

          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-800 border-t-blue-500" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-200">
                  {user.displayName || "User Space"}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {user.email}
                </p>
              </div>
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64"}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-slate-850 bg-slate-900 object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk via Google</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
