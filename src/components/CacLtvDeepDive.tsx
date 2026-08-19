import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingDown,
  DollarSign,
  Scale,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  FileText,
  Building,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  Calculator,
  Compass,
  Sparkles,
  Info
} from "lucide-react";
import { getSectorCacLtvProfile } from "../utils/sectorOpportunityHelper";

interface CacLtvProps {
  projectTitle: string;
}

interface CostComponent {
  id: string;
  name: string;
  category: "Komersial" | "Teknis Operasional" | "Legalitas & K3";
  costIDR: number;
}

export function CacLtvDeepDive({ projectTitle }: CacLtvProps) {
  const cacLtvProfile = getSectorCacLtvProfile(projectTitle);
  const [activeTab, setActiveTab] = useState<"cac" | "ltv" | "ratio">("cac");

  // State for CAC calculation
  const [cacCosts, setCacCosts] = useState<CostComponent[]>(cacLtvProfile.cacCosts);

  // Form input for custom CAC cost
  const [newCostName, setNewCostName] = useState("");
  const [newCostCategory, setNewCostCategory] = useState<"Komersial" | "Teknis Operasional" | "Legalitas & K3">("Teknis Operasional");
  const [newCostVal, setNewCostVal] = useState<number>(5000000);

  // LTV Sliders State
  const [avgRevenuePerMonth, setAvgRevenuePerMonth] = useState<number>(cacLtvProfile.defaultAvgRevenuePerMonth); // IDR revenue per month per client contract
  const [netProfitMargin, setNetProfitMargin] = useState<number>(14); // Net profit % (10% - 25%)
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(36); // Contract duration in months (typically 12 - 60)

  useEffect(() => {
    setCacCosts(cacLtvProfile.cacCosts);
    setAvgRevenuePerMonth(cacLtvProfile.defaultAvgRevenuePerMonth);
  }, [projectTitle]);

  // Handlers for CAC cost modification
  const handleAddCacCost = () => {
    if (!newCostName.trim()) return;
    const item: CostComponent = {
      id: "cac-custom-" + Date.now(),
      name: newCostName,
      category: newCostCategory,
      costIDR: newCostVal
    };
    setCacCosts(prev => [...prev, item]);
    setNewCostName("");
  };

  const handleRemoveCacCost = (id: string) => {
    setCacCosts(prev => prev.filter(item => item.id !== id));
  };

  // MATHEMATICAL CALCULATION ENGINE
  // 1. Total CAC calculation
  const totalCacIDR = cacCosts.reduce((acc, curr) => acc + curr.costIDR, 0);

  // 2. LTV calculation: Average Revenue Per Month * Contract Duration * Net Profit Margin
  const totalLtvIDR = avgRevenuePerMonth * contractDurationMonths * (netProfitMargin / 100);

  // 3. Ratio calculation
  const ltvCacRatio = totalCacIDR > 0 ? totalLtvIDR / totalCacIDR : 0;

  // Determine ratio status & health diagnosis
  let ratioHealth: "Sangat Sehat" | "Sehat" | "Kurang Efisien" | "Kritis" = "Kurang Efisien";
  let healthColor = "text-amber-400 border-amber-500/25 bg-amber-500/5";
  let strategyText = "Meskipun LTV positif, biaya akuisisi Anda terlalu tinggi. Pertimbangkan pemangkasan biaya trial run yang berlebihan atau naikkan durasi kontrak.";

  if (ltvCacRatio >= 5.0) {
    ratioHealth = "Sangat Sehat";
    healthColor = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
    strategyText = "Rasio luar biasa! Kontrak jangka panjang yang stabil dengan efisiensi pengadaan unit awal menjamin margin profitabilitas yang berkelanjutan.";
  } else if (ltvCacRatio >= 3.0) {
    ratioHealth = "Sehat";
    healthColor = "text-blue-400 border-blue-500/25 bg-blue-500/5";
    strategyText = "Rasio memenuhi standar industri (>= 3.0x). Strategi ekspansi rute dan renegosiasi harga solar industri akan terus memperkuat posisi ini.";
  } else if (ltvCacRatio < 1.5) {
    ratioHealth = "Kritis";
    healthColor = "text-rose-400 border-rose-500/25 bg-rose-500/5";
    strategyText = "Sangat Berbahaya! Biaya akuisisi (CAC) melebihi keuntungan seumur hidup (LTV) yang dihasilkan pelanggan. Segera tinjau tarif jasa angkutan Anda!";
  }

  return (
    <div id="cac-ltv-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans relative">
      {/* Decorative background lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              PRAMA COG DEV FINANCIALS
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Scale className="h-5 w-5 text-rose-400" />
            Financial Model Analyzer (CAC & LTV Analysis)
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Menganalisis efisiensi biaya akuisisi pelanggan (CAC), proyeksi keuntungan seumur hidup kontrak (LTV), serta jalinan rasio LTV/CAC sebagai tolok ukur kesehatan bisnis logistik Prama.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">FINANCIAL RATIO:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {ltvCacRatio.toFixed(1)}x LTV/CAC
          </span>
        </div>
      </div>

      {/* THREE INTERACTIVE COLUMN TABS (Requested by the user) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 relative z-10">
        
        {/* TAB 1: CAC DEFINITION & COMPONENTS */}
        <button
          type="button"
          onClick={() => setActiveTab("cac")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "cac"
              ? "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500 shadow-lg shadow-rose-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "cac" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <TrendingDown className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 font-mono">Pilar 1</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">1. Definisi & Komponen CAC</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Biaya akuisisi klien korporat: survei rute, trial run armada, dan jaminan tender legal.
            </p>
          </div>
        </button>

        {/* TAB 2: LTV DEFINITION & CALCULATION */}
        <button
          type="button"
          onClick={() => setActiveTab("ltv")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "ltv"
              ? "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500 shadow-lg shadow-rose-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "ltv" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <DollarSign className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 font-mono">Pilar 2</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">2. Definisi & Struktur LTV</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Customer Lifetime Value: total margin bersih terkumpul selama durasi kontrak layanan.
            </p>
          </div>
        </button>

        {/* TAB 3: RELATIONSHIP RATIO & BUSINESS STRATEGY */}
        <button
          type="button"
          onClick={() => setActiveTab("ratio")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "ratio"
              ? "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500 shadow-lg shadow-rose-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "ratio" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <Scale className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 font-mono">Pilar 3</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">3. Hubungan Rasio & Strategi</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Analisis perbandingan rasio keuangan LTV/CAC untuk jaminan pengembalian investasi (ROI).
            </p>
          </div>
        </button>
      </div>

      {/* VIEWPORT CONTROLLER */}
      <AnimatePresence mode="wait">
        
        {/* PILLAR 1: DEFINISI & KOMPONEN CAC */}
        {activeTab === "cac" && (
          <motion.div
            key="cac-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* CAC Description and Interactive Cost List Builder */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                    Struktur Komponen Customer Acquisition Cost (CAC)
                  </h4>
                  <span className="text-[8.5px] font-mono bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded text-rose-400">
                    REAL-TIME LIST
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  CAC mengukur seluruh investasi finansial dan waktu kerja yang dikeluarkan untuk memenangkan tender serta mengaktifkan rute komersial untuk satu klien baru. Ketuk tombol sampah untuk memotong biaya tak relevan.
                </p>

                {/* Costs List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 mb-4">
                  {cacCosts.map((item) => (
                    <div key={item.id} className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 flex justify-between items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase ${
                          item.category === "Komersial" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          item.category === "Teknis Operasional" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}>
                          {item.category}
                        </span>
                        <h5 className="text-[11px] font-black text-slate-100 uppercase tracking-tight mt-1 truncate">
                          {item.name}
                        </h5>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11.5px] font-bold text-slate-200 font-mono">
                          Rp {item.costIDR.toLocaleString("id-ID")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCacCost(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                          title="Hapus komponen biaya"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to add custom cost */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-2.5">
                <span className="text-[9px] text-slate-400 font-black tracking-wider block uppercase">Tambah Komponen Biaya Akuisisi</span>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                  <input
                    type="text"
                    value={newCostName}
                    onChange={(e) => setNewCostName(e.target.value)}
                    placeholder="Contoh: Audit Vendor K3 Mandiri..."
                    className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold"
                  />
                  <select
                    value={newCostCategory}
                    onChange={(e: any) => setNewCostCategory(e.target.value)}
                    className="md:col-span-3 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-semibold"
                  >
                    <option value="Komersial">Komersial</option>
                    <option value="Teknis Operasional">Teknis Ops</option>
                    <option value="Legalitas & K3">Legal & K3</option>
                  </select>
                  <input
                    type="number"
                    value={newCostVal}
                    onChange={(e) => setNewCostVal(Number(e.target.value))}
                    className="md:col-span-3 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="IDR"
                  />
                  <button
                    type="button"
                    onClick={handleAddCacCost}
                    className="md:col-span-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg p-2 flex items-center justify-center cursor-pointer transition-all font-bold"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Display & Analysis */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-rose-400 uppercase tracking-widest block mb-1">
                  TOTAL CALCULATED CAC
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Hasil Biaya Akuisisi
                </h4>

                <div className="bg-slate-900/80 p-4 border border-slate-850 rounded-xl text-center space-y-3.5">
                  <div>
                    <span className="text-[9.5px] text-slate-500 font-black block">TOTAL INVESTASI AKUISISI KLIEN</span>
                    <div className="text-2xl font-black text-white font-mono mt-1">
                      Rp {totalCacIDR.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-semibold leading-relaxed text-left border-t border-slate-800/80 pt-3">
                    💡 <span className="text-white">Strategi Prama:</span> Dengan menargetkan model tender korporat multi-year, total CAC ini akan 'teramortisasi' secara cepat dalam 3 bulan pertama rute hauling aktif berjalan.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA FINANCIAL ENGINE v1.1
              </div>
            </div>
          </motion.div>
        )}

        {/* PILLAR 2: DEFINISI LTV (CUSTOMER LIFETIME VALUE) */}
        {activeTab === "ltv" && (
          <motion.div
            key="ltv-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* LTV Definition and Parameter Control Sliders */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <DollarSign className="h-4.5 w-4.5 text-rose-400" />
                  Parameter & Logika Customer Lifetime Value (LTV)
                </h4>
                <p className="text-[10.5px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  LTV mengestimasi seluruh nilai keuntungan finansial bersih yang bisa diberikan oleh satu akun pelanggan korporasi selama durasi kontrak layanan mereka aktif di Prama. Sesuaikan variabel di bawah untuk melihat reaksinya:
                </p>

                <div className="space-y-4 text-xs">
                  {/* Slider 1: Average monthly revenue */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Rata-rata Pendapatan Bruto / Bulan</span>
                      <span className="text-rose-400 font-black font-mono">
                        Rp {avgRevenuePerMonth.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20000000"
                      max="150000000"
                      step="5000000"
                      value={avgRevenuePerMonth}
                      onChange={(e) => setAvgRevenuePerMonth(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Slider 2: Net profit margin */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Margin Keuntungan Bersih (Net Margin %)</span>
                      <span className="text-rose-400 font-black font-mono">{netProfitMargin}% Margin</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="25"
                      step="1"
                      value={netProfitMargin}
                      onChange={(e) => setNetProfitMargin(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Slider 3: Contract duration */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Durasi Kontrak Layanan (Bulan)</span>
                      <span className="text-rose-400 font-black font-mono">{contractDurationMonths} Bulan ({(contractDurationMonths/12).toFixed(1)} Thn)</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="60"
                      step="6"
                      value={contractDurationMonths}
                      onChange={(e) => setContractDurationMonths(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-rose-400 shrink-0" />
                <span>Rantai pasok industri kehutanan memiliki durasi kontrak rata-rata 3 tahun.</span>
              </div>
            </div>

            {/* Projections outcome display */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-rose-400 uppercase tracking-widest block mb-1">
                  CUSTOMER LIFETIME VALUE (LTV)
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Proyeksi LTV Bersih
                </h4>

                <div className="bg-slate-900/80 p-4 border border-slate-850 rounded-xl space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black block">ESTIMASI LTV BERSIH KONTRAK</span>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                      Rp {totalLtvIDR.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 font-semibold leading-relaxed pt-2 border-t border-slate-800/80">
                    Sistem kontrak *Waste Management Transportation* memberikan keandalan arus kas (recurring revenue) yang tinggi bagi Pancaran Group dibandingkan dengan angkutan logistik e-commerce ritel harian.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA LTV CALCULATOR ENGINE v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* PILLAR 3: HUBUNGAN RASIO LTV TERHADAP CAC & STRATEGI BISNIS */}
        {activeTab === "ratio" && (
          <motion.div
            key="ratio-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* LTV/CAC Ratio and financial diagnosis */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Scale className="h-4.5 w-4.5 text-rose-400" />
                  Rasio Keuangan LTV/CAC & Evaluasi Kesehatan Bisnis
                </h4>
                <p className="text-[10.5px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Rasio LTV dibanding CAC mengonfirmasi efisiensi investasi biaya promosi dan komisi penjualan. Secara universal, angka rasio <span className="text-emerald-400 font-black">{`>= 3.0x`}</span> dianggap sehat dan teruji bertahan lama.
                </p>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-center">
                      <span className="text-[9px] text-slate-500 font-black block">CAC AKTUAl</span>
                      <span className="text-[13px] font-black text-rose-400 font-mono">
                        Rp {totalCacIDR.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-center">
                      <span className="text-[9px] text-slate-500 font-black block">LTV BERSIH</span>
                      <span className="text-[13px] font-black text-emerald-400 font-mono">
                        Rp {totalLtvIDR.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Healthy Ratio Scale */}
                  <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9.5px] text-slate-400 font-black">BAR REGISTER KESEHATAN INVESTASI</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${healthColor}`}>
                        {ratioHealth}
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden relative mb-2">
                      <div
                        className={`h-full transition-all duration-500 ${
                          ltvCacRatio >= 5.0 ? "bg-emerald-500" : ltvCacRatio >= 3.0 ? "bg-blue-400" : ltvCacRatio >= 1.5 ? "bg-amber-400" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, (ltvCacRatio / 10) * 100)}%` }}
                      />
                      {/* Scale indicators */}
                      <div className="absolute left-[30%] top-0 w-0.5 h-full bg-slate-700" title="Standar Sehat (3.0x)" />
                      <div className="absolute left-[50%] top-0 w-0.5 h-full bg-slate-700" title="Sangat Sehat (5.0x)" />
                    </div>

                    <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                      <span>0.0x (Kritis)</span>
                      <span>3.0x (Standar Sehat)</span>
                      <span>5.0x (Sangat Sehat)</span>
                      <span>10.0x</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold">
                * Rasio LTV/CAC Anda saat ini: <span className="text-white font-black">{ltvCacRatio.toFixed(2)}x</span>
              </div>
            </div>

            {/* Strategic suggestions based on computed Ratio */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-rose-400 uppercase tracking-widest block mb-1">
                  STRATEGIC ADVISOR REPORT
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-1">
                  <Calculator className="h-4 w-4 text-rose-400" />
                  Rekomendasi Bisnis Prama
                </h4>

                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3">
                  <span className="text-[9.5px] text-slate-500 font-black block">ARAHAN OPERASIONAL</span>
                  <p className="text-[10px] text-slate-200 leading-relaxed font-semibold">
                    {strategyText}
                  </p>

                  <div className="border-t border-slate-800/80 pt-3 text-[9.5px] text-slate-400 font-semibold space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Pertahankan tingkat retensi kontrak tinggi.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Optimalkan pemanfaatan backhaul sharing.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA BUSINESS ADVISORY SYSTEM v1.3
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
