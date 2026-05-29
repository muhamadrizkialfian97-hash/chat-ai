import React, { useState } from "react";
import { Users, Wifi, WifiOff, Radio, Edit2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CollabBarProps {
  roomId: string;
  setRoomId: (id: string) => void;
  username: string;
  setUsername: (name: string) => void;
  socketStatus: "disconnected" | "connecting" | "connected";
  presence: { username: string; peerId: string }[];
  typingUsers: { [peerId: string]: { username: string; isTyping: boolean } };
}

export default function CollabBar({
  roomId,
  setRoomId,
  username,
  setUsername,
  socketStatus,
  presence,
  typingUsers,
}: CollabBarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);
  const [roomInput, setRoomInput] = useState(roomId);

  const activeTypingCount = Object.values(typingUsers).filter(u => u.isTyping).length;
  const activeTypingNames = Object.values(typingUsers).filter(u => u.isTyping).map(u => u.username).join(", ");

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      setRoomId(roomInput.trim().toLowerCase());
    }
  };

  return (
    <div className="w-full border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        {/* Left Side: Socket Status & Room Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 font-mono shadow-sm">
            {socketStatus === "connected" ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">COLLAB SERVER: LIVE</span>
              </>
            ) : socketStatus === "connecting" ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                </span>
                <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold text-amber-700 uppercase">MENGHUBUNGKAN...</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                <WifiOff className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">OFFLINE MODE</span>
              </>
            )}
          </div>

          {/* Collab Room Switch Form */}
          <form onSubmit={handleRoomSubmit} className="flex items-center gap-1 bg-white rounded-xl px-2.5 py-1 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-200 transition shadow-sm">
            <Radio className="h-3.5 w-3.5 text-sky-500 shrink-0" />
            <span className="font-bold text-slate-500 mr-1 font-mono uppercase text-[9px]">Ruang:</span>
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Ganti ruang..."
              className="w-24 bg-transparent border-none text-[11px] text-slate-800 focus:outline-none focus:ring-0 font-bold p-0"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 font-bold text-[9px] px-2 py-0.5 text-sky-700 transition cursor-pointer"
            >
              Ubah
            </button>
          </form>

          {/* Peer Nickname Configuration */}
          <div className="flex items-center gap-1.5">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1 bg-white rounded-xl px-2 py-1 border border-slate-200 shadow-sm">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Set Panggilan..."
                  className="w-28 bg-transparent border-none text-[11px] text-slate-800 focus:outline-none focus:ring-0 font-bold p-0 px-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded bg-sky-600 text-white text-[9px] px-2 py-0.5 font-bold hover:bg-sky-500 cursor-pointer"
                >
                  Ok
                </button>
              </form>
            ) : (
              <div 
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-sm"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-slate-500 font-mono text-[9px]">PANGGILAN:</span>
                <span className="font-extrabold text-indigo-600">{username}</span>
                <Edit2 className="h-3 w-3 text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Online Coworkers Active Presence */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Presence ({presence.length}):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {presence.length === 0 ? (
              <span className="text-slate-400 font-semibold italic">Hanya Anda sendiri</span>
            ) : (
              presence.map((peer, idx) => (
                <div 
                  key={`${peer.peerId}-${idx}`} 
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-bold border transition shadow-2sm ${
                    peer.username === username
                      ? "bg-sky-50 border-sky-200 text-sky-800"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                  title={`ID: ${peer.peerId}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    peer.username === username ? "bg-sky-500 animate-ping" : "bg-emerald-500 animate-pulse"
                  }`} />
                  <span>{peer.username} {peer.username === username && "(Anda)"}</span>
                </div>
              ))
            )}
          </div>

          {/* Typing Indicator Banner */}
          <AnimatePresence>
            {activeTypingCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-3 py-1 font-sans text-sky-600 font-bold"
              >
                <Zap className="h-3 w-3 text-sky-500 animate-bounce" />
                <span className="text-[10px] tracking-wide">
                  {activeTypingNames} sedang mengetik...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        
      </div>
    </div>
  );
}
