/**
 * Interactive HTML Presentation Slide-Deck Exporter
 * Generates a fully responsive, beautiful, self-contained single-page dashboard app
 * featuring premium slide layout visualizer, interactive controls, live Text-To-Speech (TTS),
 * collapsible sidebar, speaker notes, and an automatic page transition system.
 */

interface SlideItem {
  title: string;
  bullets: string[];
  speakerNotes: string;
  imageUrl?: string;
}

export async function exportToInteractiveHTML(
  proyekTitle: string,
  slides: SlideItem[],
  divisiName: string = "PORTAL",
  returnStringOnly: boolean = false
): Promise<string | void> {
  // Prep slides data with intro and conclusion
  const cleanTitle = proyekTitle
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

  const divisionText = divisiName.toUpperCase();

  // Fetch the Pancaran illustration as Base64 to make it self-contained
  let base64Illustration = "";
  try {
    const res = await fetch("https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ");
    if (res.ok) {
      const blob = await res.blob();
      base64Illustration = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (err) {
    console.warn("Failed to fetch pancaran_illustration.jpg as Base64:", err);
  }

  const slidesData = [
    {
      isIntro: true,
      title: "KAJIAN STRATEGIS KOMPREHENSIF",
      subTitle: cleanTitle,
      bullets: [
        "Analisis Operasional & Rencana Aksi Komprehensif",
        `Diformulasikan Khusus Untuk Unit Kerja: ${divisionText}`,
        "Berbasis 14 Pilar Strategi Komite Keberlanjutan PRAMA",
        "Disusun untuk PT Pancaran Group dan Seluruh Afiliasi Utama"
      ],
      speakerNotes: `Selamat pagi atau siang Bapak dan Ibu sekalian. Selamat datang di presentasi laporan. Hari ini kami memaparkan kajian strategis komprehensif mengenai: ${cleanTitle}. Dokumen ini diproduksi guna memberikan analisis pilar operasional dan implementasi taktis bagi divisi ${divisionText} di PT Pancaran Group. Mari kita mulai pembahasannya.`,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
    },
    ...slides.map((s, index) => ({
      isIntro: false,
      title: s.title,
      bullets: s.bullets,
      speakerNotes: s.speakerNotes || `Slide Bab ${index + 1}: ${s.title}. Analisis pendukung terlampir pada rincian pilar strategis.`,
      imageUrl: s.imageUrl || "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200"
    })),
    {
      isClosing: true,
      title: "TERIMA KASIH & SESI DISKUSI",
      subTitle: "Membangun Keberlanjutan Bersama",
      bullets: [
        "Kajian Kelayakan & Rencana Kerja Operasional Strategis Selesai",
        "Mempersiapkan PT Pancaran Group Sebagai Pemimpin Pasar Berkelanjutan",
        "Dokumen ini Resmi Diserahkan untuk Evaluasi Komite dan Direksi",
        "Sesi Tanya Jawab, Pembahasan Kritik, & Masukan Segera Dimulai"
      ],
      speakerNotes: "Demikian seluruh rangkaian presentasi kajian strategis komprehensif ini selesai kami sampaikan Bapak dan Ibu sekalian. Terima kasih yang sebesar-besarnya atas perhatian dan masukan berharga dari Bapak Ibu jajaran direksi, komite eksekutif, dan tim operasional PT Pancaran Group. Kami mengundang Bapak Ibu untuk memulai diskusi interaktif dan sesi tanya jawab.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200"
    }
  ];

  const slidesJsonString = JSON.stringify(slidesData)
    .replace(/<\/script>/g, "<\\/script>")
    .replace(/<!--/g, "<\\!--");

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentasi Interaktif: ${cleanTitle}</title>
  
  <!-- CSS Tailwind CDN & Google Fonts -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Tailind theme configuration -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            display: ['"Space Grotesk"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            slate: {
              750: '#1b253b',
              850: '#111827',
              950: '#0b0f19',
            },
            brand: {
              50: '#f0fdf4',
              100: '#dcfce7',
              500: '#0082FB',
              600: '#0072DF',
              interactive: '#00D285', // Green color requested
              darkBg: '#090D16',
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Premium custom scrollbar styles */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(148, 163, 184, 0.5);
    }

    /* Continuous subtle ripple or pulse highlights */
    .glow-ring {
      box-shadow: 0 0 15px rgba(0, 210, 133, 0.4);
    }

    /* Slide transition classes */
    .slide-fade-enter {
      opacity: 0;
      transform: translateY(15px) scale(0.98);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .slide-fade-active {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  </style>
</head>
<body class="bg-brand-darkBg text-slate-100 min-h-screen font-sans flex flex-col antialiased overflow-y-auto overflow-x-hidden">

  <!-- TOP HEADER PORTAL BAR -->
  <header class="sticky top-0 h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-30">
    <div class="flex items-center gap-3">
      <!-- Embedded Corporate Logo -->
      <img src="https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X" 
           alt="Pancaran Group Corporate Logo" 
           referrerpolicy="no-referrer"
           id="prama-header-logo"
           class="h-8 object-contain bg-white/10 p-1 rounded-lg border border-white/10" />
      <div class="h-6 w-px bg-slate-800 hidden sm:block"></div>
      <div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-black text-[#00D285] tracking-widest font-mono">PRAMA IA</span>
          <span class="text-[8px] bg-[#0082FB]/10 text-[#0082FB] border border-[#0082FB]/20 font-black rounded px-1 tracking-wider uppercase">INTERACTIVE HTML v1.5</span>
        </div>
        <h1 class="text-xs font-bold text-slate-350 truncate max-w-sm lg:max-w-xl font-display uppercase tracking-wide">
          ${cleanTitle}
        </h1>
      </div>
    </div>

    <!-- Quick controls widget on header -->
    <div class="flex items-center gap-3">
      <div class="hidden md:flex flex-col items-end text-right">
        <span class="text-[9px] font-bold text-slate-400 font-mono">DIVISI UNIT KERJA</span>
        <span class="text-[10px] font-extrabold text-blue-400 tracking-wider">${divisionText} & BUSINESS DEVELOPMENT</span>
      </div>
      <button onclick="toggleTheaterMode()" 
              class="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition duration-200"
              title="Layar Penuh / Theater Mode">
        <i data-lucide="maximize-2" class="h-4.5 w-4.5"></i>
      </button>
    </div>
  </header>

  <!-- SPLIT SCREEN PRESENTATION WORKSPACE -->
  <main class="flex-1 flex relative">

    <!-- LEFT SIDEBAR: INTERACTIVE INDEX LIST & SETTINGS (Cancellable/Collapsible) -->
    <aside id="sidebarPanel" class="sticky top-16 h-[calc(100vh-64px)] w-80 border-r border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col shrink-0 transition-all duration-300 z-20">
      
      <!-- Slide count & stats bar -->
      <div class="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between shrink-0">
        <span class="text-[10px] font-black text-slate-450 uppercase tracking-widest font-mono">Index Halaman Kajian</span>
        <span id="slideProgressBadge" class="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Slide 1 / 1
        </span>
      </div>

      <!-- Scrollable indices list -->
      <div id="slidesListView" class="flex-1 overflow-y-auto divide-y divide-slate-900/60 p-2">
        <!-- Dyn list loaded by JS -->
      </div>

      <!-- Speech Settings Drawer -->
      <div class="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0 select-none">
        <h4 class="text-[10px] font-black text-slate-400 tracking-widest uppercase font-mono mb-3">KONFIGURASI SUARA NARATOR</h4>
        <div class="space-y-3.5">
          <!-- Rate / Speed slider -->
          <div>
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Kecepatan Bicara (Speed)</span>
              <span id="labelTtsRate" class="text-emerald-400 font-mono">1.0x</span>
            </div>
            <input type="range" id="inputTtsRate" min="0.6" max="1.5" step="0.1" value="1.0" 
                   class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                   oninput="updateTtsParams()" />
          </div>

          <!-- Volume slider -->
          <div>
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Volume</span>
              <span id="labelTtsVolume" class="text-emerald-400 font-mono">100%</span>
            </div>
            <input type="range" id="inputTtsVolume" min="0" max="1" step="0.1" value="1" 
                   class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                   oninput="updateTtsParams()" />
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN DISPLAY CANVAS AND VOICE DESCRIPTOR BOARD -->
    <section class="flex-1 flex flex-col bg-slate-950 p-4 md:p-6 lg:p-8">
      
      <!-- TOP CONTROL WIDGET FOR AUTOPLAY & TRANSITION STATUS -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-5 select-none bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-3">
          <button id="btnPlayTts" onclick="handlePlayStopTTS()" 
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D285] hover:bg-[#00B472] text-slate-950 font-black text-xs transition duration-200 shadow-lg cursor-pointer transform active:scale-95 select-none font-sans uppercase">
            <i data-lucide="play" class="h-4 w-4"></i>
            <span id="textPlayTts">MULAI AUDIO PRESENTASI</span>
          </button>

          <!-- TTS Playing Equalizer indicator -->
          <div id="equalizerIndicator" class="hidden flex items-end gap-1 h-5 w-8 px-1">
            <div class="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-2"></div>
            <div class="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-4"></div>
            <div class="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_200ms] h-5"></div>
            <div class="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_400ms] h-3"></div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Live Auto autoplay trigger status -->
          <button id="toggleAutoplayBtn" onclick="toggleAutoNextMode()"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition cursor-pointer text-xs font-bold font-mono">
            <i data-lucide="refresh-cw" class="h-3.5 w-3.5" id="autoNextIcon"></i>
            <span id="autoNextLabel">AUTO-NEXT: OFF</span>
          </button>

          <!-- Auto-Next Buffer countdown notification -->
          <div id="autoNextCountdownBar" class="hidden flex items-center gap-2 bg-[#0082FB]/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-[10.5px] font-black font-mono animate-pulse">
            <i data-lucide="hourglass" class="h-3.5 w-3.5 animate-spin"></i>
            <span>SLIDE LANJUT DALAM <span id="secsCount" class="text-amber-400">2</span> DETIK...</span>
          </div>
        </div>
      </div>

      <!-- MAIN CONTAINER DISPLAY: PRESENTATION SCREEN (16:9 Aspect Ratio aspect preset) -->
      <div id="widescreenFrame" class="w-full max-w-5xl mx-auto bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative" style="aspect-ratio: 16/9;">
        <!-- Rendered Slide Slide Dynamic Content area -->
        <div id="activeSlideCanvas" class="w-full h-full relative slide-fade-enter">
          <!-- Dyn loaded content via JS -->
        </div>
      </div>

      <!-- SPEECH SCRIPT BOARD OR SPEAKER NOTES (Highly professional visualizer) -->
      <div class="w-full max-w-5xl mx-auto mt-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5">
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 select-none">
          <div class="flex items-center gap-2">
            <div class="h-6 w-1.5 rounded bg-emerald-400"></div>
            <h3 class="text-[11px] font-black tracking-widest text-[#00D285] font-mono uppercase">
              REKAMAN SKRIP SUARA INTERAKTIF (SPEAKER NOTES)
            </h3>
          </div>
          <span class="text-[10px] font-mono font-bold text-slate-500 bg-slate-950/80 border border-slate-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Bahasa Indonesia (ID)
          </span>
        </div>
        <!-- Notes text body -->
        <div class="text-slate-300 text-xs md:text-sm leading-relaxed font-sans blockquote italic font-medium bg-slate-950/50 p-4 rounded-xl border border-slate-900" id="speakerNotesDisplay">
          Selamat bersiap...
        </div>
      </div>

      <!-- SLIDE NAVIGATION CONTROL CLUSTER (BAR) -->
      <div class="w-full max-w-5xl mx-auto mt-4 flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 select-none shrink-0">
        <div class="flex items-center gap-1.5">
          <button onclick="goToSlide(0)" 
                  class="h-10 px-3.5 rounded-xl bg-slate-950 transition hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center" 
                  title="Ke Halaman Pertama" id="btnFirstSlide">
            <i data-lucide="chevrons-left" class="h-4 w-4"></i>
          </button>
          <button onclick="shiftPrevSlide()" 
                  class="h-10 px-4 rounded-xl bg-slate-950 transition hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs" 
                  id="btnPrevSlide">
            <i data-lucide="chevron-left" class="h-4 w-4"></i>
            <span>Balik</span>
          </button>
        </div>

        <!-- Dot list selection timeline indicators -->
        <div class="hidden sm:flex items-center gap-2.5" id="timelineDotsTrack">
          <!-- Dots rendered dynamically -->
        </div>

        <div class="flex items-center gap-1.5">
          <button onclick="shiftNextSlide()" 
                  class="h-10 px-5 rounded-xl bg-slate-950 transition hover:bg-slate-800 border border-slate-800 text-[#00D285] hover:text-white hover:bg-emerald-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-black text-xs" 
                  id="btnNextSlide">
            <span>Lanjut</span>
            <i data-lucide="chevron-right" class="h-4 w-4"></i>
          </button>
          <button onclick="goToSlide(slidesData.length - 1)" 
                  class="h-10 px-3.5 rounded-xl bg-slate-950 transition hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center" 
                  title="Ke Halaman Terakhir" id="btnLastSlide">
            <i data-lucide="chevrons-right" class="h-4 w-4"></i>
          </button>
        </div>
      </div>
    </section>
  </main>

  <!-- PRESENTATION KEYBOARD HOTKEYS FOOTER INFO -->
  <footer class="h-8 border-t border-slate-800 bg-slate-950/80 px-6 flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase select-none tracking-widest z-30">
    <div>KONTROL KEYBOARD: ARROW KANAN (NEXT) • ARROW KIRI (PREV) • ESC (TUTUP LAYAR PENUH) • SPASI (MULAI/SETOP)</div>
    <div class="hidden sm:block">PT PANCARAN GROUP © 2026 • ALL RIGHTS RESERVED</div>
  </footer>

  <!-- PERSISTED DATA INJECTED BY BACKEND GENERATOR -->
  <script>
    // Injection of clean slides
    const slidesData = ${slidesJsonString};
    const bgIllustrationBase64 = "${base64Illustration}";
    
    // State machine
    let activeSlideIndex = 0;
    let isTtsPlaying = false;
    let isTtsAutoplay = false; // Auto-Next switch
    let currentUtterance = null;
    let autoNextTimeoutId = null;

    // Default TTS Parameters
    let ttsRate = 1.0;
    let ttsVolume = 1.0;

    // Initialize Page
    document.addEventListener("DOMContentLoaded", () => {
      // Init lucide icons
      lucide.createIcons();
      
      // Load index list inside Sidebar
      renderSidebarList();
      
      // Load dot timeline track
      renderDotTimeline();

      // Display initial slide content
      renderActiveSlide();

      // Keyboard events list
      window.addEventListener("keydown", (e) => {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;
        
        if (e.key === "ArrowRight") {
          shiftNextSlide();
        } else if (e.key === "ArrowLeft") {
          shiftPrevSlide();
        } else if (e.key === " ") {
          e.preventDefault();
          handlePlayStopTTS();
        } else if (e.key === "Escape") {
          toggleTheaterMode(false);
        }
      });
    });

    // Sidebar list renderer
    function renderSidebarList() {
      const parent = document.getElementById("slidesListView");
      parent.innerHTML = "";
      
      slidesData.forEach((slide, idx) => {
        let label = "";
        let iconHtml = '<i data-lucide="file-text" class="h-3.5 w-3.5"></i>';
        
        if (slide.isIntro) {
          label = "Halaman Pembuka (Intro)";
          iconHtml = '<i data-lucide="sparkles" class="h-3.5 w-3.5"></i>';
        } else if (slide.isClosing) {
          label = "Halaman Selesai / Diskusi";
          iconHtml = '<i data-lucide="check-circle" class="h-3.5 w-3.5"></i>';
        } else {
          label = \`Bab \${idx}: \${slide.title}\`;
        }

        const button = document.createElement("button");
        button.onclick = () => goToSlide(idx);
        button.className = \`w-full text-left p-3 flex items-start gap-2.5 transition duration-150 select-none border-l-4 font-sans leading-snug cursor-pointer \${
          activeSlideIndex === idx 
          ? "bg-[#00D285]/10 border-[#00D285] text-white font-extrabold" 
          : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
        }\`;
        button.id = \`sidebar-btn-\${idx}\`;
        
        button.innerHTML = \`
          <span class="mt-0.5 opacity-80 shrink-0">\${iconHtml}</span>
          <div class="min-w-0">
            <span class="text-[10.5px] block font-semibold truncate uppercase tracking-wider">\${label}</span>
            <span class="text-[9px] block text-slate-500 truncate mt-0.5">\${slide.isIntro || slide.isClosing ? "Slide Strategi" : slide.bullets[0] || ""}</span>
          </div>
        \`;

        parent.appendChild(button);
      });

      lucide.createIcons({
        attrs: {
          class: 'h-3.5 w-3.5'
        }
      });
    }

    // Dot timeline renderer
    function renderDotTimeline() {
      const dotsTrack = document.getElementById("timelineDotsTrack");
      dotsTrack.innerHTML = "";
      
      slidesData.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.onclick = () => goToSlide(idx);
        dot.className = \`h-2.5 rounded-full transition-all duration-200 cursor-pointer \${
          activeSlideIndex === idx 
          ? "w-8 bg-[#00D285] shadow shadow-emerald-400" 
          : "w-2.5 bg-slate-700 hover:bg-slate-500"
        }\`;
        dot.title = \`Menuju Slide \${idx + 1}\`;
        dot.id = \`timeline-dot-\${idx}\`;
        dotsTrack.appendChild(dot);
      });
    }

    // Clean list indicators from items and labels
    function cleanLead(txt) {
      if (!txt) return "";
      return txt.trim()
        .replace(/^[-*•\s+]+/g, "")
        .trim();
    }

    // Format specific parts of the bullet text before a colon as bold
    function formatBulletTextHtml(text) {
      if (!text) return "";
      let cleanText = text.replace(/\\\*\\\*/g, ""); // strip stars
      const colonIdx = cleanText.indexOf(":");
      if (colonIdx > 0 && colonIdx < 40) {
        const boldPrefix = cleanText.slice(0, colonIdx + 1);
        const rest = cleanText.slice(colonIdx + 1);
        return \`<strong>\${boldPrefix}</strong>\${rest}\`;
      }
      return cleanText;
    }

    // Render Active Slide on Screen
    function renderActiveSlide() {
      const container = document.getElementById("activeSlideCanvas");
      
      // Apply fade animation
      container.classList.remove("slide-fade-active");
      container.classList.add("slide-fade-enter");

      const slide = slidesData[activeSlideIndex];
      
      setTimeout(() => {
        let contentHtml = "";

        if (slide.isIntro) {
          contentHtml = \`
            <div class="flex-1 flex flex-col justify-between p-6 sm:p-10 text-left select-none relative w-full h-full overflow-hidden bg-slate-950">
              <!-- 1. Portal Illustration Background -->
              <div class="absolute inset-0 w-full h-full overflow-hidden select-none z-0">
                <img 
                  src="\${bgIllustrationBase64 || 'https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ'}" 
                  alt="Pancaran Group Logistics Illustration" 
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover origin-center z-0 scale-[1.00]"
                />
                <!-- Elegant dark overlay to ensure excellent readability of the white/green text -->
                <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"></div>
              </div>

              <!-- 2. Vibrant Green Frames -->
              <div class="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm z-10"></div>

              <!-- 3. Header Info Left / Right -->
              <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-25 select-none">
                <span class="text-[8px] sm:text-[10px] font-mono font-black text-[#00D285] uppercase tracking-widest">✦ \${slide.subTitle ? slide.subTitle.toUpperCase() : "${cleanTitle.toUpperCase()}"}</span>
                <div class="flex items-center gap-1.5">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X" 
                    alt="PT Pancaran Group Logo" 
                    class="h-6 sm:h-9 w-auto object-contain bg-white/10 p-1 rounded-sm"
                    referrerpolicy="no-referrer"
                  />
                </div>
              </div>

              <!-- 4. Central Text Overlay Segment -->
              <div class="w-full flex flex-col items-center text-center px-6 sm:px-12 z-25 my-auto">
                <!-- Glowing Center Pill Box -->
                <div class="flex justify-center w-full mb-3">
                  <span class="bg-[#004D40]/85 border border-[#00D285]/65 rounded-full px-4 sm:px-6 py-1 sm:py-1.5 text-[8px] sm:text-[10px] text-[#00D285] font-mono tracking-widest uppercase font-black shadow-lg">
                    KAJIAN STRATEGIS KOMPREHENSIF
                  </span>
                </div>

                <!-- Main Titles -->
                <h1 class="text-white text-base sm:text-xl md:text-2xl lg:text-[26px] font-black tracking-wider leading-none select-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                  PT PANCARAN GROUP
                </h1>
                
                <h2 class="text-[#00D285] text-xl sm:text-2xl md:text-3.5xl lg:text-[45px] font-extrabold tracking-widest leading-none select-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] uppercase mt-1 sm:mt-2">
                  \${slide.subTitle ? slide.subTitle.toUpperCase() : "${cleanTitle.toUpperCase()}"}
                </h2>

                <!-- Main Subtitle Description -->
                <p class="text-slate-200 font-medium text-[9px] sm:text-[11px] md:text-xs max-w-2xl leading-relaxed mt-4 drop-shadow-[0_1.5px_3.5px_rgba(0,0,0,0.85)] select-text px-4 font-sans">
                  Kajian Komprehensif Skema Strategis &amp; Operasional Berdasarkan Rekomendasi PRAMA AI Advisor
                </p>
              </div>

              <!-- 5. Footer Row Left / Right -->
              <div class="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] sm:text-[9.5px] font-mono font-bold text-white/80 uppercase tracking-wider z-25 select-none font-sans font-bold">
                <div>UNIT: ${divisionText} & BUSINESS DEVELOPMENT</div>
                <div class="flex items-center gap-1.5">
                  <span>KLASIFIKASI:</span>
                  <span class="text-[#EF4444] font-black tracking-widest font-bold">TERBATAS</span>
                  <span class="text-[#00D285] font-bold text-xs animate-pulse ml-0.5">✦</span>
                </div>
              </div>
            </div>
          \`;
        } else if (slide.isClosing) {
          contentHtml = \`
            <div class="flex-1 flex flex-col justify-center items-center bg-[#06152B] p-8 sm:p-12 text-center select-none relative w-full h-full overflow-hidden">
              <!-- 1. Portal Illustration Background -->
              <div class="absolute inset-0 w-full h-full overflow-hidden select-none z-0">
                <img 
                  src="\${bgIllustrationBase64 || 'https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ'}" 
                  alt="Pancaran Group Logistics Illustration" 
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover origin-center z-0 scale-[1.00]"
                />
                <!-- Elegant dark overlay to ensure excellent readability of the white/green text -->
                <div class="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]"></div>
              </div>

              <!-- Vibrant Green Border -->
              <div class="absolute inset-3 border border-[#00D285] pointer-events-none rounded-sm z-10"></div>
              
              <!-- Logo also displayed on the penutup screen -->
              <div class="z-20 mb-4 sm:mb-6">
                <img 
                  src="https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X" 
                  alt="PT Pancaran Group Logo" 
                  class="h-8 sm:h-12 w-auto object-contain mx-auto bg-white/10 p-1 rounded-sm animate-pulse"
                  referrerpolicy="no-referrer"
                />
              </div>

              <h1 class="text-white text-3xl sm:text-5xl font-black tracking-widest leading-none mb-3 z-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-sans font-bold">
                TERIMA KASIH
              </h1>
              
              <h3 class="text-[#00D285] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider mb-6 sm:mb-8 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                Sistem Dokumentasi Strategis & Operasional Terintegrasi
              </h3>
              
              <div class="mt-4 sm:mt-6 text-slate-300 font-mono text-[9px] sm:text-xs tracking-wide leading-relaxed z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <div>✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor</div>
                <div class="text-[#00D285] font-semibold mt-1">PT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF</div>
              </div>
            </div>
          \`;
        } else {
          // Standard content slide with sidebar image and structured bullets
          let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
          let bPointsHtml = "";

          const bullets = slide.bullets || [];
          if (bullets.length > 0) {
            if (bullets.length >= 3) {
              introPara = cleanLead(bullets[0]);
              const remainingBullets = bullets.slice(1);
              bPointsHtml = remainingBullets.map(bText => {
                const bulletClean = cleanLead(bText);
                if (!bulletClean) return "";
                return \`
                  <div class="flex gap-2 items-start pl-0.5 shrink-0">
                    <span class="text-[#00D285] mt-0.5 shrink-0 font-extrabold select-none text-xs">&bull;</span>
                    <p class="text-[10.5px] sm:text-xs text-slate-600 font-medium leading-relaxed select-text font-sans flex-1 min-w-0 text-left">
                      \${formatBulletTextHtml(bulletClean)}
                    </p>
                  </div>
                \`;
              }).join("");
            } else {
              bPointsHtml = bullets.map(bText => {
                const bulletClean = cleanLead(bText);
                if (!bulletClean) return "";
                return \`
                  <div class="flex gap-2 items-start pl-0.5 shrink-0">
                    <span class="text-[#00D285] mt-0.5 shrink-0 font-extrabold select-none text-xs">&bull;</span>
                    <p class="text-[10.5px] sm:text-xs text-slate-600 font-medium leading-relaxed select-text font-sans flex-1 min-w-0 text-left">
                      \${formatBulletTextHtml(bulletClean)}
                    </p>
                  </div>
                \`;
              }).join("");
            }
          }

          contentHtml = \`
            <div class="w-full h-full flex flex-col md:flex-row bg-white text-slate-800 relative overflow-hidden">
              <!-- Solid Top Accent Green Bar -->
              <div class="absolute top-0 left-0 right-0 h-1.5 bg-[#00D285] z-10"></div>

              <!-- Left half: Content & Bullets -->
              <div class="w-full md:w-7/12 h-full flex flex-col justify-between p-5 md:p-8 relative overflow-hidden z-10 select-none">
                <div class="space-y-3 pt-1">
                  <!-- Header row -->
                  <div class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center w-full pb-1">
                    <span>${cleanTitle.toUpperCase()}</span>
                    <span class="text-[#00D285] font-extrabold">SEKTOR: ${divisionText} & BD</span>
                  </div>
                  
                  <div class="h-[1px] bg-slate-100 w-full shrink-0"></div>

                  <div class="text-[10px] font-bold text-[#00D285] font-mono uppercase tracking-widest pt-0.5">
                    KAJIAN STRATEGIS: BAB \${activeSlideIndex}
                  </div>
                  
                  <h2 class="text-slate-950 font-extrabold text-sm md:text-lg lg:text-xl leading-tight font-sans">
                    \${slide.title}
                  </h2>
                  
                  <p class="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-relaxed pb-1 font-sans">
                    \${introPara.replace(/\\*\\*/g, "")}
                  </p>

                  <div class="space-y-1.5 max-h-[145px] overflow-y-auto">
                    \${bPointsHtml}
                  </div>
                </div>

                <!-- Footer row -->
                <div class="text-[8px] font-mono font-bold text-slate-400 border-t border-slate-150 pt-2 w-full flex justify-between items-center mt-2 shrink-0 font-sans font-bold">
                  <span>PANCARAN GROUP &bull; CONFIDENTIAL DOCUMENTATION</span>
                  <span class="text-slate-700 font-bold uppercase w-max tracking-wide">HALAMAN \${activeSlideIndex + 1} DARI \${slidesData.length}</span>
                </div>
              </div>

              <!-- Right half: Photo Frame -->
              <div class="w-full md:w-5/12 h-full bg-slate-50 relative overflow-hidden flex flex-col justify-center items-center p-5 border-l border-slate-100">
                <div class="w-full h-full flex flex-col justify-center items-center gap-1.5">
                  <!-- Photo framed with green border -->
                  <div class="w-full h-[85%] border border-[#00D285] p-1 bg-white shadow-sm relative overflow-hidden rounded-md flex items-center justify-center">
                    <canvas id="illustrationCanvas" class="w-full h-full block rounded transition-all duration-300"></canvas>
                  </div>
                  <span class="text-[8px] text-slate-400 italic font-bold tracking-wide text-center uppercase shrink-0">
                    ILUSTRASI STRATEGIS: \${slide.title ? slide.title.substring(0, 30) : "PRAMA ANALISA"}...
                  </span>
                </div>
              </div>
            </div>
          \`;
        }

        container.innerHTML = contentHtml;

        // Stop any previous canvas drawing animation loop
        if (window.illustrationAnimId) {
          cancelAnimationFrame(window.illustrationAnimId);
          window.illustrationAnimId = null;
        }

        const canvas = document.getElementById("illustrationCanvas");
        if (canvas) {
          startIllustrationAnimation(canvas, slide.title, activeSlideIndex);
        }

        container.classList.remove("slide-fade-enter");
        container.classList.add("slide-fade-active");

        // Update speaker notes
        const cleanedNotes = slide.speakerNotes
          .replace(/\\*\\*/g, "")
          .replace(/\\*/g, "")
          .replace(/\`/g, "")
          .replace(/["'"“““”']/g, "")
          .trim();
        document.getElementById("speakerNotesDisplay").textContent = cleanedNotes;

        // Button disables & pagination counters
        document.getElementById("btnPrevSlide").disabled = activeSlideIndex === 0;
        document.getElementById("btnFirstSlide").disabled = activeSlideIndex === 0;
        document.getElementById("btnNextSlide").disabled = activeSlideIndex === slidesData.length - 1;
        document.getElementById("btnLastSlide").disabled = activeSlideIndex === slidesData.length - 1;

        // Progress indicators
        const bCount = document.getElementById("bottomPageCounter");
        if (bCount) bCount.textContent = \`Slide \${activeSlideIndex + 1} dari \${slidesData.length}\`;
        document.getElementById("slideProgressBadge").textContent = \`S-Deck \${activeSlideIndex + 1} / \${slidesData.length}\`;

        // Style change sidebar buttons
        slidesData.forEach((_, idx) => {
          const btn = document.getElementById(\`sidebar-btn-\${idx}\`);
          const dot = document.getElementById(\`timeline-dot-\${idx}\`);
          
          if (btn) {
            btn.className = \`w-full text-left p-3 flex items-start gap-2.5 transition duration-150 select-none border-l-4 font-sans leading-snug cursor-pointer \${
              activeSlideIndex === idx 
              ? "bg-[#00D285]/10 border-[#00D285] text-white font-extrabold" 
              : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }\`;
          }
          
          if (dot) {
            dot.className = \`h-2.5 rounded-full transition-all duration-200 cursor-pointer \${
              activeSlideIndex === idx 
              ? "w-8 bg-[#00D285] shadow shadow-emerald-400" 
              : "w-2.5 bg-slate-705 hover:bg-slate-500"
            }\`;
          }
        });

        // Trigger TTS directly if auto-speech is active
        if (isTtsPlaying) {
          triggerSpeechSynthesis();
        }

      }, 100);
    }

    // Go to slide direct index
    function goToSlide(index) {
      if (index < 0 || index >= slidesData.length) return;
      
      // Stop ongoing speech & auto-next countdown
      const wasPlaying = isTtsPlaying;
      stopSpeechAndTimers(wasPlaying);

      activeSlideIndex = index;
      renderActiveSlide();
    }

    // Shift simple functions
    function shiftNextSlide() {
      if (activeSlideIndex < slidesData.length - 1) {
        goToSlide(activeSlideIndex + 1);
      }
    }

    function shiftPrevSlide() {
      if (activeSlideIndex > 0) {
        goToSlide(activeSlideIndex - 1);
      }
    }

    // TTS & AUTOPLAY CONTROL MECHANISM
    function handlePlayStopTTS() {
      if (isTtsPlaying) {
        stopSpeechAndTimers(false);
      } else {
        triggerSpeechSynthesis();
      }
    }

    function stopSpeechAndTimers(preservePlayingState = false) {
      // Clear timers
      if (autoNextTimeoutId) {
        clearInterval(autoNextTimeoutId);
        autoNextTimeoutId = null;
      }
      
      // Stop speech
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (!preservePlayingState) {
        isTtsPlaying = false;
        document.getElementById("btnPlayTts").className = "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D285] hover:bg-[#00B472] text-slate-950 font-black text-xs transition duration-200 shadow-lg cursor-pointer transform active:scale-95 select-none font-sans uppercase";
        document.getElementById("textPlayTts").textContent = "MULAI AUDIO PRESENTASI";
        
        const btnIcon = document.querySelector("#btnPlayTts i");
        if (btnIcon) {
          btnIcon.setAttribute("data-lucide", "play");
          lucide.createIcons();
        }

        document.getElementById("equalizerIndicator").classList.add("hidden");
        document.getElementById("autoNextCountdownBar").classList.add("hidden");
      }
    }

    function triggerSpeechSynthesis() {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        alert("Browser Anda tidak mendukung Web Speech Synthesis (TTS). Silakan gunakan Google Chrome, Microsoft Edge, atau Safari.");
        return;
      }

      // Stop previous
      stopSpeechAndTimers(true);

      const textToSpeak = document.getElementById("speakerNotesDisplay").textContent;
      
      // SpeechSynthesisUtterance initialization
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "id-ID"; // Indonesian Voice
      utterance.rate = ttsRate;
      utterance.volume = ttsVolume;

      utterance.onstart = () => {
        isTtsPlaying = true;
        document.getElementById("btnPlayTts").className = "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition duration-200 shadow-lg cursor-pointer transform active:scale-95 select-none font-sans uppercase";
        document.getElementById("textPlayTts").textContent = "SETOP AUDIO NARASI";
        
        const btnIcon = document.querySelector("#btnPlayTts i");
        if (btnIcon) {
          btnIcon.setAttribute("data-lucide", "square");
          lucide.createIcons();
        }
        
        document.getElementById("equalizerIndicator").classList.remove("hidden");
      };

      utterance.onend = () => {
        document.getElementById("equalizerIndicator").classList.add("hidden");
        
        if (isTtsAutoplay && activeSlideIndex < slidesData.length - 1) {
          triggerAutoNextCountdown();
        } else {
          stopSpeechAndTimers();
        }
      };

      utterance.onerror = (evt) => {
        console.error("Speech Synthesis Failure:", evt);
        stopSpeechAndTimers();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Trigger Auto-Next countdown sequence: "jika sudah selesai jelaskan bisa lanjut auto next halaman"
    function triggerAutoNextCountdown() {
      let timeLeft = 2; // Count-down duration before changing page
      document.getElementById("secsCount").textContent = timeLeft;
      document.getElementById("autoNextCountdownBar").classList.remove("hidden");

      autoNextTimeoutId = setInterval(() => {
        timeLeft--;
        document.getElementById("secsCount").textContent = timeLeft;
        
        if (timeLeft <= 0) {
          clearInterval(autoNextTimeoutId);
          autoNextTimeoutId = null;
          document.getElementById("autoNextCountdownBar").classList.add("hidden");
          
          // Switch to next slide
          shiftNextSlide();
        }
      }, 1000);
    }

    // Toggle "Auto-Next" (Autoplay) state
    function toggleAutoNextMode() {
      isTtsAutoplay = !isTtsAutoplay;
      
      const btn = document.getElementById("toggleAutoplayBtn");
      const icon = document.getElementById("autoNextIcon");
      const label = document.getElementById("autoNextLabel");

      if (isTtsAutoplay) {
        btn.className = "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono transition cursor-pointer text-xs";
        label.textContent = "AUTO-NEXT: ACTIVE (2s Delay)";
        icon.className = "h-3.5 w-3.5 animate-spin text-emerald-400";
        icon.setAttribute("data-lucide", "refresh-cw");
        
        // If voice is currently playing, it will automatically register the transition on end.
        // Otherwise, if not playing, we can prompt or start speaking.
        if (!isTtsPlaying) {
          triggerSpeechSynthesis();
        }
      } else {
        btn.className = "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition cursor-pointer text-xs font-bold font-mono bg-transparent border-slate-800 text-slate-400";
        label.textContent = "AUTO-NEXT: OFF";
        icon.className = "h-3.5 w-3.5 text-slate-400";
        icon.setAttribute("data-lucide", "refresh-cw");
        
        // Cancel active timer bar if visible
        document.getElementById("autoNextCountdownBar").classList.add("hidden");
        if (autoNextTimeoutId) {
          clearInterval(autoNextTimeoutId);
          autoNextTimeoutId = null;
        }
      }
      lucide.createIcons();
    }

    // Update Speed & Volume TTS attributes from sliders
    function updateTtsParams() {
      const vVal = document.getElementById("inputTtsVolume").value;
      const rVal = document.getElementById("inputTtsRate").value;

      ttsVolume = parseFloat(vVal);
      ttsRate = parseFloat(rVal);

      document.getElementById("labelTtsVolume").textContent = \`\${Math.round(ttsVolume * 100)}%\`;
      document.getElementById("labelTtsRate").textContent = \`\${ttsRate.toFixed(1)}x\`;

      // If active speaking, refresh voice stream
      if (isTtsPlaying) {
        triggerSpeechSynthesis();
      }
    }

    // Toggle fullscreen / Theater layout presentation mode
    function toggleTheaterMode(forceState) {
      const sidebar = document.getElementById("sidebarPanel");
      const isCollapsed = sidebar.classList.contains("w-0") || sidebar.classList.contains("-translate-x-full") || sidebar.style.display === "none";
      const targetState = forceState !== undefined ? forceState : isCollapsed;

      if (targetState) {
        // Expand sidebar & show headers
        sidebar.style.display = "flex";
        setTimeout(() => {
          sidebar.classList.remove("w-0");
        }, 50);
        
        const btnIcon = document.querySelector("header button[onclick='toggleTheaterMode()'] i");
        if (btnIcon) {
          btnIcon.setAttribute("data-lucide", "maximize-2");
          lucide.createIcons();
        }
      } else {
        // Collapse sidebar (theater style focus)
        sidebar.style.display = "none";
        sidebar.classList.add("w-0");
        
        const btnIcon = document.querySelector("header button[onclick='toggleTheaterMode()'] i");
        if (btnIcon) {
          btnIcon.setAttribute("data-lucide", "minimize-2");
          lucide.createIcons();
        }
      }
    }

    function getCategoryFromTitle(slideTitle) {
      const title = (slideTitle || "").toLowerCase();
      
      if (
        title.includes("forestry") ||
        title.includes("forest") ||
        title.includes("hutan") ||
        title.includes("pulp") ||
        title.includes("kayu") ||
        title.includes("wood") ||
        title.includes("timber") ||
        title.includes("perkebunan") ||
        title.includes("tanam") ||
        title.includes("agro") ||
        title.includes("reboisasi") ||
        title.includes("plantation")
      ) {
        return { id: "forestry", title: "STRATEGI HUTAN INDUSTRI & LOGISTIK HIJAU", code: "HIJ" };
      }

      if (
        title.includes("demograf") ||
        title.includes("wilayah") ||
        title.includes("geograf") ||
        title.includes("peta") ||
        title.includes("lokasi") ||
        title.includes("daerah") ||
        title.includes("pasar") ||
        title.includes("target") ||
        title.includes("penduduk") ||
        title.includes("pesaing") ||
        title.includes("sosial")
      ) {
        return { id: "demography", title: "PETA DEMOGRAFIS & DISPERSASI WILAYAH", code: "DEM" };
      }

      if (
        title.includes("finansial") ||
        title.includes("biaya") ||
        title.includes("investas") ||
        title.includes("proyeksi") ||
        title.includes("keuangan") ||
        title.includes("untung") ||
        title.includes("rugi") ||
        title.includes("dana") ||
        title.includes("modal") ||
        title.includes("ekonomi") ||
        title.includes("capex") ||
        title.includes("opex")
      ) {
        return { id: "finance", title: "ANALISIS FINANSIAL & KELAYAKAN INVESTASI", code: "FIN" };
      }

      if (
        title.includes("logistik") ||
        title.includes("armada") ||
        title.includes("rute") ||
        title.includes("transport") ||
        title.includes("distribus") ||
        title.includes("darat") ||
        title.includes("laut") ||
        title.includes("kapal") ||
        title.includes("truk") ||
        title.includes("cargo") ||
        title.includes("limbah") ||
        title.includes("jalan") ||
        title.includes("operasi")
      ) {
        return { id: "logistics", title: "STRATEGI TRANSPORTASI & ARUS LOGISTIK", code: "LOG" };
      }

      if (
        title.includes("risiko") ||
        title.includes("mitigasi") ||
        title.includes("regulasi") ||
        title.includes("patuh") ||
        title.includes("keselamatan") ||
        title.includes("hukum") ||
        title.includes("aman") ||
        title.includes("protek") ||
        title.includes("audit") ||
        title.includes("esg") ||
        title.includes("bahaya")
      ) {
        return { id: "risk", title: "PETA RISIKO, MITIGASI & KEPATUHAN REGULASI", code: "RSK" };
      }

      if (
        title.includes("sistem") ||
        title.includes("teknolog") ||
        title.includes("digital") ||
        title.includes("data") ||
        title.includes("it") ||
        title.includes("integras") ||
        title.includes("software") ||
        title.includes("hardware") ||
        title.includes("portal") ||
        title.includes("analitik")
      ) {
        return { id: "tech", title: "INTEGRASI SISTEM & ARSITEKTUR DIGITAL", code: "TEK" };
      }

      return { id: "general", title: "ANALISIS STRATEGIS KOMPREHENSIF", code: "GEN" };
    }

    function startIllustrationAnimation(canvas, slideTitle, slideIndex) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId;
      let frame = 0;

      const cat = getCategoryFromTitle(slideTitle);

      function resizeAndPaint() {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width || canvas.clientWidth || 400;
        const height = rect.height || canvas.clientHeight || 280;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Draw background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#F8FAFC");
        bgGrad.addColorStop(1, "#F1F5F9");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Branded Green Border
        ctx.strokeStyle = "#00D285";
        ctx.lineWidth = 3;
        ctx.strokeRect(8, 8, width - 16, height - 16);

        // Grid lines
        ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
        ctx.lineWidth = 1;
        const gridSize = 25;
        for (let x = gridSize; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Bracket corners
        ctx.strokeStyle = "rgba(0, 210, 133, 0.4)";
        ctx.lineWidth = 2;
        const bSize = 15;
        // Top-Left
        ctx.beginPath(); ctx.moveTo(15 + bSize, 15); ctx.lineTo(15, 15); ctx.lineTo(15, 15 + bSize); ctx.stroke();
        // Top-Right
        ctx.beginPath(); ctx.moveTo(width - 15 - bSize, 15); ctx.lineTo(width - 15, 15); ctx.lineTo(width - 15, 15 + bSize); ctx.stroke();
        // Bottom-Left
        ctx.beginPath(); ctx.moveTo(15 + bSize, height - 15); ctx.lineTo(15, height - 15); ctx.lineTo(15, height - 15 - bSize); ctx.stroke();
        // Bottom-Right
        ctx.beginPath(); ctx.moveTo(width - 15 - bSize, height - 15); ctx.lineTo(width - 15, height - 15); ctx.lineTo(width - 15, height - 15 - bSize); ctx.stroke();

        // Footer Metadata Text
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 8px monospace";
        ctx.fillText("ID: " + cat.code + "-" + (slideIndex + 1) + "-V" + (Math.floor(frame / 60) + 1), 25, height - 22);

        // Header Title
        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(cat.title, width - 25, 32);

        // Draw Subcategory diagrams
        if (cat.id === "logistics") {
          drawLogistics(ctx, width, height, frame);
        } else if (cat.id === "forestry") {
          drawForestry(ctx, width, height, frame);
        } else if (cat.id === "finance") {
          drawFinance(ctx, width, height, frame);
        } else if (cat.id === "demography") {
          drawDemographics(ctx, width, height, frame);
        } else if (cat.id === "risk") {
          drawRisk(ctx, width, height, frame);
        } else if (cat.id === "tech") {
          drawTech(ctx, width, height, frame);
        } else {
          drawGeneral(ctx, width, height, frame);
        }
      }

      function drawLogistics(ctx, w, h, frame) {
        const centerY = h * 0.52;
        const hubs = [
          { x: w * 0.16, y: centerY - 35, label: "SUMATRA HUB" },
          { x: w * 0.35, y: centerY + 45, label: "JAKARTA HQ" },
          { x: w * 0.52, y: centerY + 15, label: "PORT SURABAYA" },
          { x: w * 0.44, y: centerY - 50, label: "WEST KALIMANTAN" },
          { x: w * 0.68, y: centerY - 20, label: "SULAWESI PORT" }
        ];

        ctx.strokeStyle = "rgba(100, 116, 139, 0.18)";
        ctx.lineWidth = 2;
        const connections = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]];

        connections.forEach(([from, to]) => {
          ctx.beginPath();
          ctx.moveTo(hubs[from].x, hubs[from].y);
          ctx.lineTo(hubs[to].x, hubs[to].y);
          ctx.stroke();

          const dx = hubs[to].x - hubs[from].x;
          const dy = hubs[to].y - hubs[from].y;
          const ratio = ((frame * 0.012) + (from * 0.25)) % 1;
          const bx = hubs[from].x + dx * ratio;
          const by = hubs[from].y + dy * ratio;

          ctx.fillStyle = "rgba(0, 210, 133, 0.45)";
          ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#00D285";
          ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
        });

        hubs.forEach((h, index) => {
          const size = (index === 1) ? 9 : 6;
          ctx.fillStyle = (index === 1) ? "#00D285" : "#3B82F6";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(h.x, h.y, size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 7px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(h.label, h.x, h.y - size - 4);
        });

        drawOverlayPanel(ctx, w, h, "OPTIMASI OPERASI", [
          { title: "Rute Terkoneksi", text: "24 Jalur Logistik", pct: 92 },
          { title: "Utilitas Fleet", text: "87% Optimal", pct: 87 },
          { title: "Efisiensi Bahan Bakar", text: "Hemat 12.4%", pct: 75 }
        ]);
      }

      function drawForestry(ctx, w, h, frame) {
        const cx = w * 0.45;
        const cy = h * 0.52;

        ctx.strokeStyle = "rgba(0, 210, 133, 0.15)";
        ctx.lineWidth = 1;
        for (let r = 20; r < 90; r += 20) {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        }

        const trees = [
          { x: cx - 45, y: cy - 25, size: 10, lvl: 0.9 },
          { x: cx + 35, y: cy - 40, size: 8, lvl: 0.7 },
          { x: cx - 15, y: cy + 45, size: 12, lvl: 0.95 },
          { x: cx + 55, y: cy + 20, size: 11, lvl: 0.8 },
          { x: cx, y: cy - 10, size: 14, lvl: 0.85 }
        ];

        trees.forEach((t, idx) => {
          const breathe = 1 + Math.sin(frame * 0.03 + idx) * 0.04;
          const sz = t.size * breathe;

          ctx.fillStyle = "rgba(0, 210, 133, 0.2)";
          ctx.beginPath(); ctx.arc(t.x, t.y, sz * 1.5, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = "#00D285";
          ctx.beginPath();
          ctx.moveTo(t.x, t.y - sz);
          ctx.lineTo(t.x - sz * 0.8, t.y + sz * 0.6);
          ctx.lineTo(t.x + sz * 0.8, t.y + sz * 0.6);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = "#059669";
          ctx.beginPath();
          ctx.moveTo(t.x, t.y - sz * 0.4);
          ctx.lineTo(t.x - sz * 0.6, t.y + sz * 0.8);
          ctx.lineTo(t.x + sz * 0.6, t.y + sz * 0.8);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = "#78350F";
          ctx.fillRect(t.x - 2, t.y + sz * 0.8, 4, sz * 0.4);
        });

        drawOverlayPanel(ctx, w, h, "PEMANTAUAN HUTAN", [
          { title: "Kesehatan Kanopi", text: "94% Prima", pct: 94 },
          { title: "Karbon Terserap", text: "1.2M Ton CO2e", pct: 82 },
          { title: "Reboisasi Terjadwal", text: "12,450 Ha", pct: 60 }
        ]);
      }

      function drawFinance(ctx, w, h, frame) {
        const startX = w * 0.08;
        const endX = w * 0.65;
        const baseY = h * 0.8;
        const maxY = h * 0.22;

        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(startX, baseY); ctx.lineTo(endX, baseY); ctx.stroke();

        const points = [];
        const numPoints = 8;
        const dataVals = [20, 25, 42, 38, 55, 68, 85, 95];

        for (let i = 0; i < numPoints; i++) {
          const x = startX + (endX - startX) * (i / (numPoints - 1));
          const wave = Math.sin(frame * 0.02 + i) * 1.5;
          const y = baseY - (dataVals[i] / 100) * (baseY - maxY) + wave;
          points.push({ x, y });
        }

        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i - 1].x + points[i].x) / 2;
          const yc = (points[i - 1].y + points[i].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();

        const grad = ctx.createLinearGradient(0, maxY, 0, baseY);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.25)");
        grad.addColorStop(1, "rgba(59, 130, 246, 0.00)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(points[0].x, baseY);
        for (let i = 0; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[points.length - 1].x, baseY);
        ctx.closePath(); ctx.fill();

        points.forEach((p, idx) => {
          if (idx === points.length - 1 || idx === 4) {
            ctx.fillStyle = idx === 4 ? "#3B82F6" : "#00D285";
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = "#0F172A";
            ctx.font = "bold 8px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(dataVals[idx] + "%", p.x, p.y - 8);
          }
        });

        drawOverlayPanel(ctx, w, h, "PROYEKSI FINANSIAL", [
          { title: "Net Present Value", text: "Rp 12.8 Miliar", pct: 90 },
          { title: "Internal Rate (IRR)", text: "24.5% Hebat", pct: 85 },
          { title: "Payback Period", text: "2.1 Tahun Efisien", pct: 70 }
        ]);
      }

      function drawDemographics(ctx, w, h, frame) {
        const cx = w * 0.38;
        const cy = h * 0.55;

        ctx.fillStyle = "rgba(59, 130, 246, 0.04)";
        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
        ctx.lineWidth = 1;

        ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.28, h * 0.28, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const scatter = [
          { x: cx - 40, y: cy - 20, size: 4, val: 30 },
          { x: cx + 50, y: cy + 10, size: 7, val: 65 },
          { x: cx - 10, y: cy + 30, size: 5, val: 45 },
          { x: cx + 20, y: cy - 40, size: 8, val: 80 },
          { x: cx - 70, y: cy + 20, size: 5, val: 35 }
        ];

        scatter.forEach((p, idx) => {
          const rad = p.size + Math.sin(frame * 0.04 + idx) * 1.5;
          ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
          ctx.beginPath(); ctx.arc(p.x, p.y, rad * 2, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = p.val > 60 ? "#00D285" : "#3B82F6";
          ctx.beginPath(); ctx.arc(p.x, p.y, rad * 0.8, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
          ctx.font = "bold 6.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("CL-" + idx, p.x, p.y - rad - 3);
        });

        drawOverlayPanel(ctx, w, h, "PETA DEMOGRAFIS", [
          { title: "Kepadatan Pasar", text: "Sangat Padat", pct: 88 },
          { title: "Aksesibilitas Wilayah", text: "91% Terjangkau", pct: 91 },
          { title: "Penetrasi Pelanggan", text: "45% Bertumbuh", pct: 45 }
        ]);
      }

      function drawRisk(ctx, w, h, frame) {
        const cx = w * 0.38;
        const cy = h * 0.55;
        const maxR = h * 0.3;

        ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
          const radius = maxR * (i / 4);
          ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
        }

        ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();

        const risks = [
          { r: maxR * 0.4, th: 0.5, label: "Operasional" },
          { r: maxR * 0.85, th: 2.2, label: "Finansial" },
          { r: maxR * 0.6, th: 3.8, label: "Regulasi" },
          { r: maxR * 0.5, th: 5.1, label: "Lingkungan" }
        ];

        ctx.fillStyle = "rgba(239, 68, 68, 0.04)";
        ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        risks.forEach((rk, idx) => {
          const breath = rk.r + Math.sin(frame * 0.02 + idx) * 4;
          const x = cx + Math.cos(rk.th) * breath;
          const y = cy + Math.sin(rk.th) * breath;
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath(); ctx.stroke();

        risks.forEach((rk, idx) => {
          const breath = rk.r + Math.sin(frame * 0.02 + idx) * 4;
          const x = cx + Math.cos(rk.th) * breath;
          const y = cy + Math.sin(rk.th) * breath;

          ctx.fillStyle = rk.r > maxR * 0.7 ? "#EF4444" : "#F59E0B";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 7px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(rk.label, x, y - 8);
        });

        drawOverlayPanel(ctx, w, h, "PETA RISIKO & MITIGASI", [
          { title: "Risiko Terdeteksi", text: "Rendah-Terkendali", pct: 35 },
          { title: "Kepatuhan Hukum", text: "100% Selaras", pct: 100 },
          { title: "Kesiapan Operasi", text: "95% Siaga", pct: 95 }
        ]);
      }

      function drawTech(ctx, w, h, frame) {
        const cx = w * 0.38;
        const cy = h * 0.55;

        const boxes = [
          { x: cx - 65, y: cy - 40, label: "WEB CLOUD APP" },
          { x: cx + 65, y: cy - 40, label: "PRAMA ENGINE" },
          { x: cx, y: cy + 40, label: "POSTGRES DB" }
        ];

        ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boxes[0].x, boxes[0].y); ctx.lineTo(boxes[1].x, boxes[1].y);
        ctx.lineTo(boxes[2].x, boxes[2].y); ctx.lineTo(boxes[0].x, boxes[0].y);
        ctx.stroke();

        const flow = ((frame * 0.01) % 1);
        const bx = boxes[0].x + (boxes[1].x - boxes[0].x) * flow;
        const by = boxes[0].y + (boxes[1].y - boxes[0].y) * flow;
        ctx.fillStyle = "#00D285";
        ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();

        boxes.forEach((b) => {
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#3B82F6";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(b.x - 30, b.y - 12, 60, 24);
          ctx.fill(); ctx.stroke();

          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 6.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(b.label, b.x, b.y + 3);
        });

        drawOverlayPanel(ctx, w, h, "INTEGRASI SISTEM", [
          { title: "Waktu Uptime", text: "99.98% Stabil", pct: 99 },
          { title: "Latensi Jaringan", text: "12ms Sangat Cepat", pct: 95 },
          { title: "Sinkronisasi Data", text: "Real-Time Aktif", pct: 100 }
        ]);
      }

      function drawGeneral(ctx, w, h, frame) {
        const cx = w * 0.38;
        const cy = h * 0.55;

        ctx.fillStyle = "rgba(0, 210, 133, 0.03)";
        ctx.strokeStyle = "rgba(0, 210, 133, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, h * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const points = [];
        const numSides = 6;
        for (let i = 0; i < numSides; i++) {
          const theta = (i / numSides) * Math.PI * 2 + (frame * 0.005);
          const r = h * 0.22 * (0.85 + Math.sin(frame * 0.015 + i) * 0.1);
          points.push({ x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r });
        }

        ctx.strokeStyle = "#00D285";
        ctx.fillStyle = "rgba(0, 210, 133, 0.12)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        points.forEach((p, i) => {
          ctx.fillStyle = "#3B82F6";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });

        drawOverlayPanel(ctx, w, h, "ANALISIS STRATEGIS", [
          { title: "Skor Integrasi", text: "92/100 Unggul", pct: 92 },
          { title: "Efisiensi Proses", text: "Hemat Waktu 30%", pct: 80 },
          { title: "Faktor Keberhasilan", text: "Sangat Tinggi", pct: 85 }
        ]);
      }

      function drawOverlayPanel(ctx, w, h, title, list) {
        const ox = w * 0.72;
        const oy = h * 0.18;
        const ow = w * 0.23;
        const oh = h * 0.65;

        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.strokeStyle = "rgba(0, 210, 133, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(ox, oy, ow, oh, 4); else ctx.rect(ox, oy, ow, oh);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 8.5px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(title, ox + 10, oy + 18);

        list.forEach((item, idx) => {
          const itemY = oy + 32 + (idx * 34);

          ctx.fillStyle = "#475569";
          ctx.font = "6.5px sans-serif";
          ctx.fillText(item.title, ox + 10, itemY);

          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 7px sans-serif";
          ctx.fillText(item.text, ox + 10, itemY + 8);

          // Mini progress bar
          ctx.fillStyle = "rgba(148, 163, 184, 0.12)";
          ctx.fillRect(ox + 10, itemY + 13, ow - 20, 2.5);

          ctx.fillStyle = "#00D285";
          ctx.fillRect(ox + 10, itemY + 13, (ow - 20) * (item.pct / 100), 2.5);
        });
      }

      function loop() {
        frame++;
        resizeAndPaint();
        animationFrameId = requestAnimationFrame(loop);
      }

      loop();

      window.illustrationAnimId = animationFrameId;

      const resizeListener = () => {
        resizeAndPaint();
      };
      window.addEventListener("resize", resizeListener);

      // Save listener reference to remove it cleanly if needed
      window.illustrationResizeListener = resizeListener;
    }
  </script>
</body>
</html>
`;

  if (returnStringOnly) {
    return htmlContent;
  }

  // Download Blob in Browser
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Presentasi-Interaktif-${cleanTitle.replace(/\s+/g, "-")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
