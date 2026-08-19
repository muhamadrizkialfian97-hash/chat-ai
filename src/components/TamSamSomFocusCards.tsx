import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Target,
  BarChart3,
  Sliders,
  Users,
  MapPin,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  HelpCircle,
  Truck,
  Building2,
  LineChart
} from "lucide-react";

interface TamSamSomFocusProps {
  projectTitle: string;
}

export function TamSamSomFocusCards({ projectTitle }: TamSamSomFocusProps) {
  // Active Tab for detailed deep-dive
  const [activeTab, setActiveTab] = useState<"tam" | "sam" | "som">("tam");

  // State 1: TAM Controllers (Macro Market)
  const [totalEntities, setTotalEntities] = useState<number>(1250); // e.g. 1,250 corporate/industrial waste producers in target region
  const [averageAnnualSpend, setAverageAnnualSpend] = useState<number>(400000000); // Rp 400 Juta/tahun per entitas

  // State 2: SAM Controllers (Geographic & Regulatory Reach)
  const [regionalCoveragePercent, setRegionalCoveragePercent] = useState<number>(45); // 45% of total entities within logistics range
  const [complianceFilterPercent, setComplianceFilterPercent] = useState<number>(80); // 80% comply with transport/contract specs

  // State 3: SOM Controllers (Realistic Capture & Fleet Capacity)
  const [targetMarketSharePercent, setTargetMarketSharePercent] = useState<number>(12); // Target 12% market share of SAM
  const [competitionIntensity, setCompetitionIntensity] = useState<"low" | "medium" | "high">("medium");

  // CALCULATIONS
  // TAM = Total Potential Market Size
  const calculatedTam = useMemo(() => {
    return totalEntities * averageAnnualSpend;
  }, [totalEntities, averageAnnualSpend]);

  // SAM = TAM * Coverage * Compliance
  const calculatedSam = useMemo(() => {
    const reachableMarket = calculatedTam * (regionalCoveragePercent / 100);
    return reachableMarket * (complianceFilterPercent / 100);
  }, [calculatedTam, regionalCoveragePercent, complianceFilterPercent]);

  // SOM = SAM * Target Market Share
  const calculatedSom = useMemo(() => {
    // Competitor adjustment factor on SOM
    const competitorFactor = competitionIntensity === "low" ? 1.1 : competitionIntensity === "high" ? 0.85 : 1.0;
    return calculatedSam * (targetMarketSharePercent / 100) * competitorFactor;
  }, [calculatedSam, targetMarketSharePercent, competitionIntensity]);

  // Translate big numbers into readable Indonesian formats (Miliar / Juta)
  const formatIDR = (num: number) => {
    if (num >= 1000000000000) {
      return `Rp ${(num / 1000000000000).toFixed(2)} Triliun`;
    }
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(2)} Miliar`;
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1)} Juta`;
    }
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div id="tamsamsom-focus-dashboard" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-6 relative overflow-hidden font-sans">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              MARKET OPTIMIZATION HUB
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-cyan-400" />
            Fokus Analisis Potensi Pasar (TAM, SAM, SOM)
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Simulasi interaktif penentuan batas pasar maksimum, wilayah pelayanan logistik yang terjangkau, hingga target pangsa pasar riil berdasarkan kapasitas armada untuk proyek "{projectTitle}".
          </p>
        </div>

        {/* Highlights */}
        <div className="flex gap-3 shrink-0">
          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">TOTAL ESTIMASI TAM</span>
            <span className="text-xs font-black text-white font-mono">{formatIDR(calculatedTam)}</span>
          </div>
          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">RIIL SOM PENETRASI</span>
            <span className="text-xs font-black text-cyan-400 font-mono">{formatIDR(calculatedSom)}</span>
          </div>
        </div>
      </div>

      {/* SEGMENT TAB BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("tam")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeTab === "tam"
              ? "bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === "tam" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase font-mono">MACRO POTENTIAL</span>
            <span className="text-[11px] font-black uppercase text-white">🌐 1. TAM (Total Addressable)</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sam")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeTab === "sam"
              ? "bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === "sam" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <Target className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase font-mono">REACHABLE SEGMENT</span>
            <span className="text-[11px] font-black uppercase text-white">🎯 2. SAM (Serviceable Addressable)</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("som")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeTab === "som"
              ? "bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === "som" ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase font-mono">OBTAINABLE SHARE</span>
            <span className="text-[11px] font-black uppercase text-white">📊 3. SOM (Serviceable Obtainable)</span>
          </div>
        </button>
      </div>

      {/* DETAILED CONTENT VIEWER */}
      <AnimatePresence mode="wait">
        {/* TAB 1: TAM DEEP-DIVE */}
        {activeTab === "tam" && (
          <motion.div
            key="tab-tam"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Controller Panel */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Parameter Makro Total Addressable Market (TAM)
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">MACRO SCALE</span>
              </div>

              {/* Slider 1: Total entities in region */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Total Produsen Limbah / Industri Regional</span>
                  <span className="text-cyan-400 font-black font-mono">{totalEntities.toLocaleString("id-ID")} Industri</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={totalEntities}
                  onChange={(e) => setTotalEntities(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Slider 2: Average Annual Spend per entity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. Estimasi Pengeluaran Jasa Hauling Tahunan / Entitas</span>
                  <span className="text-cyan-400 font-black font-mono">{formatIDR(averageAnnualSpend)} / Thn</span>
                </div>
                <input
                  type="range"
                  min="100000000"
                  max="900000000"
                  step="10000000"
                  value={averageAnnualSpend}
                  onChange={(e) => setAverageAnnualSpend(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-slate-300 leading-relaxed font-semibold">
                📌 <strong className="text-white">Definisi TAM:</strong> Batasan teoritis potensi pendapatan jika kita menguasai 100% pasar logistik & pengangkutan limbah industri di seluruh wilayah operasional tanpa ada batasan jarak atau kompetisi.
              </div>
            </div>

            {/* Right Metric Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">
                  MACRO REVENUE CAP
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5 text-cyan-400" />
                  Estimasi Total Batasan Pasar (TAM)
                </h4>

                <div className="space-y-4 font-semibold text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[8px] text-slate-500 font-black block uppercase tracking-wider font-mono">POTENSI TOTAL PASAR TEORITIS</span>
                    <span className="text-xl font-black text-white font-mono block mt-1">
                      {formatIDR(calculatedTam)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span>Kontribusi Sektor Manufaktur</span>
                      <span className="text-cyan-400 font-bold font-mono">65%</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Kontribusi Komersial & Retail</span>
                      <span className="text-cyan-400 font-bold font-mono">35%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA TAM ESTIMATOR v2.1
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SAM DEEP-DIVE */}
        {activeTab === "sam" && (
          <motion.div
            key="tab-sam"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Controller Panel */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Filter Segmentasi Pasar yang Terlayani (SAM)
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">REACHABILITY CRITERIA</span>
              </div>

              {/* Slider 1: Geographic coverage percentage */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Wilayah Terjangkau Armada (Geographic Reach)</span>
                  <span className="text-cyan-400 font-black font-mono">{regionalCoveragePercent}% dari Wilayah Makro</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={regionalCoveragePercent}
                  onChange={(e) => setRegionalCoveragePercent(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] text-slate-500 font-semibold block leading-normal">
                  Persentase industri potensial yang berjarak maksimal 100-150 km dari pusat Depo utama.
                </span>
              </div>

              {/* Slider 2: Compliance filter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. Kesesuaian Kualifikasi / Legalitas Kontrak</span>
                  <span className="text-cyan-400 font-black font-mono">{complianceFilterPercent}% Entitas Terbuka</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={complianceFilterPercent}
                  onChange={(e) => setComplianceFilterPercent(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] text-slate-500 font-semibold block leading-normal">
                  Persentase entitas yang memenuhi syarat kepatuhan sertifikasi izin lingkungan & regulasi angkutan logistik.
                </span>
              </div>
            </div>

            {/* Right Metric Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">
                  SERVICEABLE REACH
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-1.5">
                  <MapPin className="h-4.5 w-4.5 text-cyan-400" />
                  Estimasi Ukuran Pasar SAM
                </h4>

                <div className="space-y-4 font-semibold text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[8px] text-slate-500 font-black block uppercase tracking-wider font-mono">POTENSI PASAR YANG TERJANGKAU</span>
                    <span className="text-xl font-black text-white font-mono block mt-1">
                      {formatIDR(calculatedSam)}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/20 text-[10px] text-slate-400 leading-normal font-semibold">
                    💡 <strong className="text-cyan-400">Efek Lokasi:</strong> Pasar SAM menyaring TAM teoritis menjadi wilayah-wilayah regional riil yang secara teknis logistik mampu dilayani oleh infrastruktur kita saat ini.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SAM FILTERING ENGINE v1.1
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SOM DEEP-DIVE */}
        {activeTab === "som" && (
          <motion.div
            key="tab-som"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Controller Panel */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Parameter Penetrasi Pasar Riil (SOM)
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">OBTAINABLE METRICS</span>
              </div>

              {/* Slider 1: Target Market share percent */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Target Pangsa Pasar (Market Share) dari SAM</span>
                  <span className="text-cyan-400 font-black font-mono">{targetMarketSharePercent}% Capture</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="1"
                  value={targetMarketSharePercent}
                  onChange={(e) => setTargetMarketSharePercent(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Toggle: Competitor Intensity */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Intensitas Persaingan Kompetitor</span>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCompetitionIntensity("low")}
                    className={`py-1.5 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      competitionIntensity === "low" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Rendah (+10% SOM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompetitionIntensity("medium")}
                    className={`py-1.5 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      competitionIntensity === "medium" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Sedang (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompetitionIntensity("high")}
                    className={`py-1.5 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      competitionIntensity === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Tinggi (-15% SOM)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded bg-cyan-500/5 border border-cyan-500/10 text-[10px] text-slate-300 leading-normal font-semibold">
                🚛 <strong className="text-white">Fleksibilitas Kapasitas Armada:</strong> SOM adalah target operasional yang realistis untuk dicapai dalam jangka waktu 1 s/d 3 tahun pertama dengan jumlah sasis armada compactor dan armada pendukung yang dimiliki.
              </div>
            </div>

            {/* Right Metric Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">
                  OBTAINABLE INCOME
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-1.5">
                  <BarChart3 className="h-4.5 w-4.5 text-cyan-400" />
                  Estimasi Ukuran Pasar SOM (Riil)
                </h4>

                <div className="space-y-4 font-semibold text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-center">
                    <span className="text-[8px] text-slate-500 font-black block uppercase tracking-wider font-mono">TARGET PENDAPATAN JANGKA PENDEK</span>
                    <span className="text-xl font-black text-emerald-400 font-mono block mt-1">
                      {formatIDR(calculatedSom)}
                    </span>
                    <p className="text-[9.5px] text-slate-400 font-semibold mt-1.5 leading-normal">
                      Potensi perolehan kontrak riil setelah memperhitungkan kompetitor lokal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SOM CAPTURE MODEL v1.3
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARKET SIZE CONE / FUNNEL CHART VISUALIZATION */}
      <div className="mt-8 pt-6 border-t border-slate-800 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4.5 w-4.5 text-cyan-400" />
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            Visualisasi Corong Penurunan Pasar (Market Size Funnel Breakdown)
          </h4>
        </div>

        <div className="space-y-4 relative z-10 font-semibold text-xs">
          {/* Level 1: TAM */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg font-mono font-black text-xs">
                🌐 TAM
              </div>
              <div>
                <span className="font-extrabold text-white text-[12px] block">TOTAL ADDRESSABLE MARKET (100%)</span>
                <span className="text-[10px] text-slate-400">Total kapasitas serapan pasar potensial makro seluruh regional</span>
              </div>
            </div>
            <div className="text-right sm:text-right shrink-0">
              <span className="font-mono text-cyan-400 font-black text-sm block">{formatIDR(calculatedTam)}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">MAKSIMUM POTENSIAL</span>
            </div>
          </div>

          {/* Connect line */}
          <div className="flex justify-center h-4 relative">
            <div className="w-0.5 h-full bg-slate-850 border-dashed border-l border-slate-700" />
            <span className="absolute top-1/2 -translate-y-1/2 bg-slate-900 px-2 py-0.5 border border-slate-800 text-[8.5px] font-mono text-slate-400 font-black rounded">
              Filter Wilayah: {regionalCoveragePercent}% & Izin Legalitas: {complianceFilterPercent}%
            </span>
          </div>

          {/* Level 2: SAM */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg font-mono font-black text-xs">
                🎯 SAM
              </div>
              <div>
                <span className="font-extrabold text-white text-[12px] block">SERVICEABLE ADDRESSABLE MARKET ({((calculatedSam / (calculatedTam || 1)) * 100).toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-400">Pangsa pasar yang mampu dilayani sesuai jangkauan logistik & operasional Depo</span>
              </div>
            </div>
            <div className="text-right sm:text-right shrink-0">
              <span className="font-mono text-white font-black text-sm block">{formatIDR(calculatedSam)}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">REACHABLE SEGMENT</span>
            </div>
          </div>

          {/* Connect line */}
          <div className="flex justify-center h-4 relative">
            <div className="w-0.5 h-full bg-slate-850 border-dashed border-l border-slate-700" />
            <span className="absolute top-1/2 -translate-y-1/2 bg-slate-900 px-2 py-0.5 border border-slate-800 text-[8.5px] font-mono text-slate-400 font-black rounded">
              Capture Rate: {targetMarketSharePercent}% (Kompetitor: {competitionIntensity === "low" ? "Rendah" : competitionIntensity === "high" ? "Tinggi" : "Sedang"})
            </span>
          </div>

          {/* Level 3: SOM */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950/40 border border-emerald-500/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-mono font-black text-xs">
                📊 SOM
              </div>
              <div>
                <span className="font-extrabold text-white text-[12px] block">SERVICEABLE OBTAINABLE MARKET ({((calculatedSom / (calculatedTam || 1)) * 100).toFixed(1)}% dari TAM)</span>
                <span className="text-[10px] text-slate-400">Target porsi pasar riil yang optimis dikuasai armada dalam 3 tahun</span>
              </div>
            </div>
            <div className="text-right sm:text-right shrink-0 relative z-10">
              <span className="font-mono text-emerald-400 font-black text-sm block">{formatIDR(calculatedSom)}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">TARGET CAPTURE SHIELD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
