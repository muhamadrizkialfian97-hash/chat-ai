import React from "react";
import { motion } from "motion/react";

interface FloatingChatIconProps {
  onClick: () => void;
  unreadCount?: number;
  isOpen?: boolean;
}

export const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  onClick,
  unreadCount = 0,
  isOpen = false
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 30 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center cursor-pointer select-none group focus:outline-none"
      title="Buka Chat AI Advisor (PRAMA)"
      style={{
        width: "62px",
        height: "62px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1890ff 0%, #0070f3 100%)",
        boxShadow: "0 8px 28px rgba(0, 112, 243, 0.45), 0 2px 8px rgba(0, 0, 0, 0.12)"
      }}
    >
      {/* Subtle pulse ring around the button */}
      <span className="absolute -inset-1 rounded-full bg-blue-400/30 animate-ping pointer-events-none opacity-75" />

      {/* The Exact Blue & White Double Chat Bubble Icon Matching User Uploaded Image */}
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 transition-transform duration-200 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Secondary / Back Speech Bubble (Bottom-Right) */}
        <path
          d="M62 38 C68 38 73 42.5 73 48 C73 51.5 71 54.5 68 56.2 L70.5 63.5 L63.5 60.5 C61.8 61.2 60 61.5 58 61.5 C55.5 61.5 53.2 61 51.2 60 C53.5 56.5 55 52.2 55 47.5 C55 43.8 54 40.5 52.2 37.8 C55.2 37.9 58.5 38 62 38 Z"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Main / Front Speech Bubble (Thick White Outline & Tail at Bottom-Left) */}
        <path
          d="M48 24 C33.5 24 22 34 22 46.5 C22 53.5 25.5 59.8 31 63.8 L28 73.5 L39 68 C42 68.7 45 69 48 69 C62.5 69 74 59 74 46.5 C74 34 62.5 24 48 24 Z"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 3 Circular Solid White Dots inside Front Bubble */}
        <circle cx="37" cy="46.5" r="3.2" fill="white" />
        <circle cx="48" cy="46.5" r="3.2" fill="white" />
        <circle cx="59" cy="46.5" r="3.2" fill="white" />
      </svg>

      {/* Unread / Notification Badge if any */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black leading-none text-white ring-2 ring-white animate-bounce shadow-md">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default FloatingChatIcon;
