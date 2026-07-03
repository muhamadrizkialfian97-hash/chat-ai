import React from "react";
import { 
  Download, Minimize2, Maximize2, X, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, Play 
} from "lucide-react";
import { PramaAnimatedIllustration } from "./PramaAnimatedIllustration";

interface Slide {
  title: string;
  bullets: string[];
  speakerNotes: string;
  imageUrl?: string;
}

interface PPTPreview {
  title: string;
  slides: Slide[];
  fileName: string;
}

interface PPTPreviewModalProps {
  pptPreview: PPTPreview | null;
  setPptPreview: (val: PPTPreview | null) => void;
  activeSlideIndex: number;
  setActiveSlideIndex: (val: number | ((prev: number) => number)) => void;
  isTtsAutoplay: boolean;
  setIsTtsAutoplay: (val: boolean) => void;
  isPptFullscreen: boolean;
  setIsPptFullscreen: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeDivision: string | null;
  isTtsPlaying: boolean;
  stopTtsAndTimers: () => void;
  speakCurrentSlide: () => void;
  exportToPPTX: (fileName: string, slides: Slide[], division: string) => Promise<void>;
  exportToInteractiveHTML: (title: string, slides: Slide[], division: string) => void;
  ttsRate: number;
  setTtsRate: (val: number) => void;
  ttsVolume: number;
  setTtsVolume: (val: number) => void;
  pramaLogo: string;
}

export const PPTPreviewModal: React.FC<PPTPreviewModalProps> = ({
  pptPreview,
  setPptPreview,
  activeSlideIndex,
  setActiveSlideIndex,
  isTtsAutoplay,
  setIsTtsAutoplay,
  isPptFullscreen,
  setIsPptFullscreen,
  activeDivision,
  isTtsPlaying,
  stopTtsAndTimers,
  speakCurrentSlide,
  exportToPPTX,
  exportToInteractiveHTML,
  ttsRate,
  setTtsRate,
  ttsVolume,
  setTtsVolume,
  pramaLogo,
}) => {
  if (!pptPreview) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fade-in text-slate-800 transition-all duration-300 ${isPptFullscreen ? "bg-[#020617] p-1 sm:p-2" : "bg-[#030712]/95"}`}>
      <div className={`flex flex-col w-full shadow-2xl overflow-hidden border transition-all duration-300 ${isPptFullscreen ? "max-w-[98vw] h-[96vh] bg-slate-900 border-slate-800 shadow-slate-950/90 rounded-3xl" : "bg-white max-w-7xl border-slate-200 rounded-[2rem]"}`}>
        {/* Header toolbar */}
        <div className={`px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 ${isPptFullscreen ? "bg-slate-900 border-b border-slate-800" : "bg-slate-50 border-b border-slate-150"}`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${isPptFullscreen ? "bg-slate-850 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
              📺
            </div>
            <div>
              <h3 className={`text-sm font-extrabold ${isPptFullscreen ? "text-slate-100" : "text-slate-800"}`}>
                SLIDESHOW PRESENTASI INTERAKTIF
              </h3>
              <p className="text-[10px] font-mono font-bold text-[#00D285] uppercase tracking-widest">
                ✦ {pptPreview.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Visual state pill for TTS autoplay */}
            {isTtsAutoplay && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                AUTOPLAY ACTIVE
              </span>
            )}
            
            {!isPptFullscreen && (
              <>
                <button
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = `<span class="flex items-center gap-1.5"><svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Menyiapkan PPTX...</span></span>`;
                    try {
                      await exportToPPTX(pptPreview.fileName, pptPreview.slides, activeDivision || "PORTAL");
                    } catch (error) {
                      console.error(error);
                    } finally {
                      btn.disabled = false;
                      btn.innerHTML = originalText;
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#0082FB] hover:bg-[#0072DF] text-white border-none rounded-full transition-all cursor-pointer shadow-md shadow-blue-100 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Unduh PPTX</span>
                </button>

                <button
                  onClick={() => {
                    exportToInteractiveHTML(pptPreview.title || pptPreview.fileName, pptPreview.slides, activeDivision || "PORTAL");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-[#00D285] hover:bg-[#00B472] text-white border-none rounded-full transition-all cursor-pointer shadow-md shadow-emerald-100"
                  title="Unduh file HTML Presentasi Interaktif dengan Suara TTS dan Auto Next"
                >
                  <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Unduh HTML Interaktif</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsPptFullscreen(prev => !prev)}
              className={`h-9 items-center gap-1.5 px-3 rounded-full border transition flex text-xs font-bold cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-200"}`}
              title="Toggle Layar Penuh"
            >
              {isPptFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4 text-[#00D285]" />
                  <span className="hidden sm:inline">Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 text-[#00D285]" />
                  <span className="hidden sm:inline">Layar Penuh</span>
                </>
              )}
            </button>

            <button
              onClick={() => setPptPreview(null)}
              className={`h-9 w-9 flex items-center justify-center rounded-full transition cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"}`}
            >
              <X className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Main Interactive Screen with 16:9 canvas and Speaker notes */}
        <div className={`flex-1 overflow-y-auto flex flex-col lg:flex-row items-stretch justify-center gap-6 transition-all ${isPptFullscreen ? "bg-slate-950 p-4 lg:p-5" : "bg-[#0B0F19] p-6 lg:p-7"}`}>
          
          {/* Left Column: Projector slide backdrop container (80% Width for focus) */}
          <div className="w-full lg:w-[80%] flex flex-col justify-center items-center">
            <div className={`w-full aspect-[16/9] bg-white rounded-2xl shadow-2xl border flex overflow-hidden relative group transition-all duration-300 ${isPptFullscreen ? "max-w-[100%] max-h-[65vh] border-slate-800" : "border-slate-800/20"}`}>
              {activeSlideIndex === 0 ? (
                // TITLE COVER SLIDE STYLE (MATCHES SLIDE 1)
                (() => {
                  const rawTitle = pptPreview.title || "";
                  const cleanTitle = rawTitle
                    .replace(/^KAJIAN STRATEGIS KOMPREHENSIF:\s*/i, "")
                    .replace(/^Presentasi_Kajian_/gi, "")
                    .replace(/^Presentasi\s+Kajian\s+/gi, "")
                    .replace(/^Presentasi\s+/gi, "")
                    .replace(/^Kajian\s+/gi, "")
                    .replace(/Presentasi Kajian Kajian/gi, "Presentasi Kajian")
                    .replace(/Kajian Kajian/gi, "Kajian")
                    .replace(/Presentasi Presentasi/gi, "Presentasi")
                    .replace(/Presentasi Kajian/gi, "")
                    .replace(/Presentasi/gi, "")
                    .replace(/Kajian/gi, "")
                    .trim();

                  return (
                    <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 text-left select-none relative w-full h-full overflow-hidden bg-slate-950">
                      {/* 1. Portal Illustration Background */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0">
                        <img 
                          src="https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ" 
                          alt="Pancaran Group Logistics Illustration" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover origin-center z-0 scale-[1.00]"
                        />
                        {/* Elegant dark overlay to ensure excellent readability of the white/green text */}
                        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]" />
                      </div>

                      {/* 2. Vibrant Green Frames */}
                      <div className="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm z-10" />

                      {/* 3. Header Info Left / Right */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-25 select-none">
                        <span className="text-[8px] sm:text-[10px] font-mono font-black text-[#00D285] uppercase tracking-widest">✦ {cleanTitle.toUpperCase() || "COMERCIAL STRATEGIS"}</span>
                        <div className="flex items-center gap-1.5">
                          <img 
                            src={pramaLogo} 
                            alt="PT Pancaran Group Logo" 
                            className="h-6 sm:h-9 w-auto object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* 4. Central Text Overlay Segment */}
                      <div className="w-full flex flex-col items-center text-center px-6 sm:px-12 z-25 my-auto">
                        {/* Glowing Center Pill Box */}
                        <div className="flex justify-center w-full mb-3 sm:mb-4">
                          <span className="bg-[#004D40]/85 border border-[#00D285]/65 rounded-full px-4 sm:px-6 py-1 sm:py-1.5 text-[8px] sm:text-[10px] text-[#00D285] font-mono tracking-widest uppercase font-black shadow-lg">
                            KAJIAN STRATEGIS KOMPREHENSIF
                          </span>
                        </div>

                        {/* Main Titles */}
                        <h1 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4.5xl font-black tracking-wider leading-none select-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                          PT PANCARAN GROUP
                        </h1>
                        
                        <h2 className="text-[#00D285] text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-widest leading-none select-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] uppercase mt-1 sm:mt-2.5">
                          {cleanTitle.toUpperCase() || "COMERCIAL STRATEGIS"}
                        </h2>
                      </div>

                      {/* 5. Subtitle Segment Info at bottom */}
                      <div className="flex justify-between items-end border-t border-slate-700/50 pt-3 z-25 select-none text-[8px] sm:text-[10px] text-slate-400 font-mono">
                        <div>
                          <div>DIFORMULASIKAN SECARA OTOMATIS OLEH:</div>
                          <div className="text-[#00D285] font-black mt-0.5 sm:mt-1">PRAMA STRATEGIC AI ADVISOR</div>
                        </div>
                        <div className="text-right">
                          <div>STATUS KAJIAN:</div>
                          <div className="text-white font-black mt-0.5 sm:mt-1">RAHASIA INTERNAL SENSITIF</div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : activeSlideIndex === pptPreview.slides.length + 1 ? (
                // THANK YOU FINAL SLIDE STYLE
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 text-center select-none relative w-full h-full bg-slate-950 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full overflow-hidden select-none z-0">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ" 
                      alt="Pancaran Group Logistics Illustration" 
                      className="w-full h-full object-cover origin-center scale-[1.00] z-0 opacity-25"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h1 className="text-white text-3xl sm:text-5xl font-black tracking-widest leading-none mb-3 animate-pulse z-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                    TERIMA KASIH
                  </h1>
                  
                  <h3 className="text-[#00D285] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider mb-6 sm:mb-8 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    Sistem Dokumentasi Strategis & Operasional Terintegrasi
                  </h3>
                  
                  <div className="mt-4 sm:mt-6 text-slate-300 font-mono text-[9px] sm:text-xs tracking-wide leading-relaxed z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <div>✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor</div>
                    <div className="text-[#00D285] font-semibold mt-1">PT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF</div>
                  </div>
                </div>
              ) : (
                // BENTO SPLIT LAYOUT CONTENT SLIDE STYLE
                (() => {
                  const currentSlide = pptPreview.slides[activeSlideIndex - 1];
                  
                  const cleanLead = (txt: string) => {
                    if (!txt) return "";
                    return txt.trim()
                      .replace(/^[-*•\s+]+/g, "") // strip leading bullet or list markers
                      .trim();
                  };

                  let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
                  let bPoints = currentSlide?.bullets || [];
                  if (currentSlide?.bullets && currentSlide.bullets.length > 0) {
                    if (currentSlide.bullets.length >= 3) {
                      introPara = cleanLead(currentSlide.bullets[0]);
                      bPoints = currentSlide.bullets.slice(1);
                    } else {
                      bPoints = currentSlide.bullets;
                    }
                  }

                  const formatBulletText = (text: string) => {
                    let cleanText = text.replace(/\*\*/g, ""); // strip raw stars
                    const colonIdx = cleanText.indexOf(":");
                    if (colonIdx > 0 && colonIdx < 30) {
                      const boldPrefix = cleanText.slice(0, colonIdx + 1);
                      const rest = cleanText.slice(colonIdx + 1);
                      return (
                        <span>
                          <strong className="font-extrabold text-slate-900">{boldPrefix}</strong>
                          {rest}
                        </span>
                      );
                    }
                    return <span>{cleanText}</span>;
                  };

                  return (
                    <div className="w-full h-full flex flex-col md:flex-row bg-white text-slate-800 relative overflow-hidden">
                      {/* Solid Top Accent Green Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00D285] z-10" />

                      {/* Left half: Content & Bullets */}
                      <div className="w-full md:w-7/12 h-full flex flex-col justify-between p-5 sm:p-7 md:p-9 relative overflow-hidden z-10">
                        <div className="space-y-2.5 pt-1.5 shrink-0">
                          {/* Header row */}
                          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center w-full pb-1 shrink-0">
                            <span>{pptPreview.fileName.toUpperCase()}</span>
                            <span className="text-[#00D285] font-extrabold">SEKTOR: {(activeDivision || "UMUM").toUpperCase() + " & BD"}</span>
                          </div>
                          
                          <div className="h-[1px] bg-slate-100 w-full shrink-0" />

                          <div className="text-[10px] font-bold text-[#00D285] font-mono uppercase tracking-widest pt-1 shrink-0">
                            KAJIAN STRATEGIS: BAB {activeSlideIndex}
                          </div>
                          
                          <h2 className="text-slate-900 font-extrabold text-base sm:text-lg md:text-[20px] leading-tight select-text shrink-0">
                            {currentSlide?.title}
                          </h2>
                          
                          <p className="text-[11px] text-slate-505 text-slate-500 font-medium leading-relaxed pb-1 select-text shrink-0">
                            {introPara.replace(/\*\*/g, "")}
                          </p>

                          <div className="space-y-1.5 shrink-0 max-h-[140px] overflow-y-auto">
                            {bPoints.map((bulletText, bIdx) => {
                              const bulletClean = cleanLead(bulletText);
                              if (!bulletClean) return null;
                              return (
                                <div key={bIdx} className="flex gap-2 items-start pl-0.5 shrink-0">
                                  <span className="text-[#00D285] mt-0.5 shrink-0 font-extrabold select-none text-[10px] sm:text-xs">•</span>
                                  <p className="text-[10.5px] sm:text-xs text-slate-600 font-medium leading-relaxed select-text flex-1 min-w-0 text-left">
                                    {formatBulletText(bulletClean)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Footer row */}
                        <div className="text-[8px] font-mono font-bold text-slate-400 border-t border-slate-101 border-slate-100 pt-2 w-full flex justify-between items-center mt-2 shrink-0">
                          <span>PANCARAN GROUP &bull; CONFIDENTIAL DOCUMENTATION</span>
                          <span className="text-slate-700 font-bold uppercase w-max tracking-wide">HALAMAN {activeSlideIndex + 1} DARI {pptPreview.slides.length + 2}</span>
                        </div>
                      </div>

                      {/* Right half: Photo Frame */}
                      <div className="w-full md:w-5/12 h-full bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center p-5 border-l border-slate-100">
                        <div className="w-full h-full flex flex-col justify-center items-center gap-1.5">
                          {/* Photo framed with green border */}
                          <div className="w-full h-[85%] border border-[#00D285] p-1 bg-white shadow-sm relative overflow-hidden rounded-md flex items-center justify-center">
                            <PramaAnimatedIllustration 
                              slideTitle={currentSlide?.title || "Kajian Proyek PRAMA"} 
                              slideIndex={activeSlideIndex} 
                            />
                          </div>
                          <span className="text-[8px] text-slate-400 italic font-bold tracking-wide text-center uppercase shrink-0">
                            ILUSTRASI STRATEGIS: {currentSlide?.title ? currentSlide.title.slice(0, 30) : "PRAMA ANALISA"}...
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Left navigation arrow on-slide */}
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => {
                  // Turn off autoplay on manual navigation to allow users to investigate
                  setIsTtsAutoplay(false);
                  stopTtsAndTimers();
                  setActiveSlideIndex(prev => Math.max(0, (prev as number) - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Right navigation arrow on-slide */}
              <button
                disabled={activeSlideIndex === pptPreview.slides.length + 1}
                onClick={() => {
                  // Turn off autoplay on manual navigation to allow users to investigate
                  setIsTtsAutoplay(false);
                  stopTtsAndTimers();
                  setActiveSlideIndex(prev => Math.min(pptPreview.slides.length + 1, (prev as number) + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-950 text-white disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-lg transition-all z-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Compact Advanced TTS Voice Narrator & Autoplay Sidebar (20% Width for focus) */}
          <div className="w-full lg:w-[20%] bg-[#0D1527] rounded-3xl p-4 sm:p-4.5 border border-slate-800 shadow-xl flex flex-col justify-between gap-4 shrink-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-mono text-[10px] text-[#00D285] font-black tracking-widest uppercase flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00D285] animate-pulse" />
                  🎙️ PANEL NARRATOR AI
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-900 text-[#00D285] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-800 shadow-inner">
                    Slide {activeSlideIndex + 1} / {pptPreview.slides.length + 2}
                  </span>
                </div>
              </div>

              {/* Playback Controls Stack */}
              <div className="flex flex-col gap-2">
                {/* Speak Button */}
                <button
                  onClick={() => {
                    if (isTtsPlaying) {
                      stopTtsAndTimers();
                    } else {
                      speakCurrentSlide();
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    isTtsPlaying 
                      ? "bg-red-500 hover:bg-red-605 text-white border-red-400" 
                      : "bg-[#00D285]/10 hover:bg-[#00D285]/18 text-[#00D285] border border-[#00D285]/20"
                  }`}
                >
                  {isTtsPlaying ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Hentikan Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Bicarakan Slide</span>
                    </>
                  )}
                </button>

                {/* Autoplay Slide Deck Button */}
                <button
                  onClick={() => {
                    const targetState = !isTtsAutoplay;
                    setIsTtsAutoplay(targetState);
                    if (targetState) {
                      speakCurrentSlide();
                    } else {
                      stopTtsAndTimers();
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    isTtsAutoplay 
                      ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-950/40" 
                      : "bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"
                  }`}
                >
                  <Play className={`h-3.5 w-3.5 ${isTtsAutoplay ? "animate-spin text-white" : "text-emerald-400"}`} />
                  <span>{isTtsAutoplay ? "Autoplay ON" : "Mulai Auto Presentation"}</span>
                </button>
              </div>

              {/* Speech parameters */}
              <div className="space-y-2.5 bg-[#121c33]/70 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold">Kecepatan:</span>
                  <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    {[0.85, 1.0, 1.2, 1.4].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setTtsRate(rate);
                          if (isTtsPlaying || isTtsAutoplay) {
                            setTimeout(() => speakCurrentSlide(), 50);
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                          ttsRate === rate 
                            ? "bg-[#00D285] text-slate-950 font-black" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold">Volume:</span>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    <Volume2 className="h-3 w-3 text-slate-400" />
                    <input 
                      type="range" 
                      min="0.2" 
                      max="1.0" 
                      step="0.1" 
                      value={ttsVolume} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setTtsVolume(val);
                        if (isTtsPlaying || isTtsAutoplay) {
                          setTimeout(() => speakCurrentSlide(), 50);
                        }
                      }}
                      className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D285]"
                    />
                  </div>
                </div>
              </div>

              {/* Dual Column/Stack Speaker Notes */}
              <div className="space-y-3">
                {/* Speak full script box */}
                <div className="bg-[#121c33]/55 p-3 rounded-xl border border-slate-800/65 max-h-[140px] overflow-y-auto">
                  <div className="text-[9px] uppercase font-mono font-black text-blue-400 flex items-center gap-1.5 mb-1.5 select-none">
                    🎙️ NASKAH PIDATO PRESENTER
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-semibold italic select-text">
                    &quot;{activeSlideIndex === 0 ? "Selamat pagi/siang bapak dan ibu sekalian. Slide pembuka ini menjelaskan judul dan pilar utama kajian proyek strategis PRAMA untuk PT Pancaran Group." : activeSlideIndex === pptPreview.slides.length + 1 ? "Sesi presentasi komprehensif selesai. Kami mengucapkan terima kasih kepada pimpinan komite, direksi, dan jajaran tim operasional PT Pancaran Group." : (pptPreview.slides[activeSlideIndex - 1]?.speakerNotes || "Penjelasan pendukung slide.")}&quot;
                  </p>
                </div>

                {/* Penjelasan Singkat */}
                <div className="bg-[#121c33]/50 p-3 rounded-xl border border-slate-800/60 max-h-[110px] overflow-y-auto">
                  <div className="text-[9px] uppercase font-mono font-black text-[#00D285] flex items-center gap-1.5 mb-1 select-none">
                    💡 PENJELASAN SINGKAT SLIDE
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold font-sans select-text">
                    {(() => {
                      if (activeSlideIndex === 0) {
                        return `Slide pembuka hasil kajian strategis komprehensif PRAMA untuk proyek "${pptPreview.title}" di PT Pancaran Group pada unit ${(activeDivision || "UMUM").toUpperCase() + " & BD"}.`;
                      } else if (activeSlideIndex === pptPreview.slides.length + 1) {
                        return "Slide penutup formal menyampaikan apresiasi mendalam, penegasan kerahasiaan dokumen, serta membuka sesi diskusi interaktif.";
                      } else {
                        const slide = pptPreview.slides[activeSlideIndex - 1];
                        const bulletsText = slide?.bullets && slide.bullets.length > 0
                          ? slide.bullets.slice(0, 2).map(b => b.replace(/\*\*/g, "")).join(" & ")
                          : "";
                        return `Fokus utama pada slide "${slide?.title || "Judul"}" merangkum analisis strategis serta usulan operasional terperinci terkait: ${bulletsText || "Rencana aksi, evaluasi, dan optimasi operasional berkelanjutan."}`;
                      }
                    })()}
                  </p>
                </div>
              </div>

              <div className="hidden lg:block border-t border-slate-800/60 pt-2 text-[9px] font-mono text-slate-505 text-slate-500 italic text-right select-none">
                {isTtsAutoplay ? (
                  <span className="text-emerald-400 animate-pulse">● Autoplay aktif...</span>
                ) : (
                  <span>Gunakan tombol untuk memutar suara.</span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom slideshow controls & paginator */}
        <div className={`border-t px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center shrink-0 rounded-b-[2rem] gap-4 transition-all ${isPptFullscreen ? "bg-slate-900 border-slate-800" : "bg-white border-slate-101 border-slate-100"}`}>
          <div className="flex gap-1.5 overflow-x-auto max-w-full sm:max-w-[70%] py-1.5">
            {Array.from({ length: pptPreview.slides.length + 2 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => {
                  setIsTtsAutoplay(false);
                  stopTtsAndTimers();
                  setActiveSlideIndex(dotIdx);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer shrink-0 ${
                  activeSlideIndex === dotIdx 
                    ? (isPptFullscreen ? "w-8 bg-[#00D285]" : "w-7 bg-[#00D285]") 
                    : (isPptFullscreen ? "w-2.5 bg-slate-700 hover:bg-slate-650 hover:bg-slate-600" : "w-2.5 bg-slate-200 hover:bg-slate-350 hover:bg-slate-300")
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPptPreview(null)}
              className={`px-6 py-2.5 text-xs font-black rounded-full transition cursor-pointer ${isPptFullscreen ? "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700" : "text-slate-600 hover:text-slate-850 bg-slate-50 hover:bg-slate-105 border border-slate-200"}`}
            >
              Tutup Slideshow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
