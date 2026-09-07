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
  const [netProfitMargin, setNetProfitMargin] = useState<number>(cacLtvProfile.defaultMargin ?? 14); // Net profit % (10% - 25%)
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(cacLtvProfile.defaultDuration ?? 36); // Contract duration in months (typically 12 - 60)

  useEffect(() => {
    const profile = getSectorCacLtvProfile(projectTitle);
    setCacCosts(profile.cacCosts);
    setAvgRevenuePerMonth(profile.defaultAvgRevenuePerMonth);
    if (profile.defaultMargin) setNetProfitMargin(profile.defaultMargin);
    if (profile.defaultDuration) setContractDurationMonths(profile.defaultDuration);
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6 relative z-10"
          >
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <TrendingDown className="h-4.5 w-4.5 text-rose-400" />
                  Struktur Komponen Customer Acquisition Cost (CAC)
                </h4>
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full w-fit">
                  {cacCosts.length} Komponen Biaya Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                CAC mengukur seluruh investasi finansial dan waktu kerja yang dikeluarkan untuk memenangkan tender serta mengaktifkan rute komersial untuk satu klien baru:
              </p>
            </div>

            {/* Structured Text-based Cost List */}
            <div className="space-y-3.5 border-l-2 border-rose-500/40 pl-4 py-1">
              {cacCosts.map((item, idx) => (
                <div key={item.id} className="relative space-y-1 pb-1">
                  {/* Dot marker */}
                  <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-400 border-2 border-rose-500" />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-rose-400 uppercase">
                        Komponen {idx + 1}:
                      </span>
                      <h5 className="text-[13px] font-black uppercase text-white tracking-tight">
                        {item.name}
                      </h5>
                      <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black rounded uppercase ${
                        item.category === "Komersial" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        item.category === "Teknis Operasional" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[11.5px] font-mono font-black text-slate-100 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                        Rp {item.costIDR.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {cacCosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCacCost(item.id)}
                        className="px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition cursor-pointer border border-transparent hover:border-slate-800"
                        title="Hapus komponen biaya"
                      >
                        ✕ Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation & Strategic Note in Clean Text */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase">
                    TOTAL ESTIMASI INVESTASI AKUISISI (CAC):
                  </span>
                  <span className="text-xl font-black text-rose-400 font-mono tracking-tight">
                    Rp {totalCacIDR.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed pt-1 border-t border-slate-800/80">
                  <strong className="text-amber-300 font-bold">💡 Strategi Prama: </strong>
                  Dengan menargetkan model tender korporat multi-year, total biaya akuisisi ini akan teramortisasi secara cepat dalam 3 bulan pertama saat siklus rute hauling aktif berjalan.
                </p>
              </div>
            </div>

            {/* Form to add custom cost */}
            <div className="border-t border-slate-800/80 pt-4">
              <h5 className="text-[11px] font-black text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-rose-400" />
                Tambah Komponen Biaya Akuisisi Baru
              </h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCacCost();
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs"
              >
                <div className="md:col-span-5">
                  <input
                    type="text"
                    value={newCostName}
                    onChange={(e) => setNewCostName(e.target.value)}
                    placeholder="Nama Komponen Biaya (contoh: Audit K3 Mandiri...)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-semibold focus:border-rose-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    value={newCostCategory}
                    onChange={(e: any) => setNewCostCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-semibold"
                  >
                    <option value="Komersial">Komersial</option>
                    <option value="Teknis Operasional">Teknis Ops</option>
                    <option value="Legalitas & K3">Legal & K3</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    value={newCostVal}
                    onChange={(e) => setNewCostVal(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    placeholder="Nominal IDR"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-lg p-2 flex items-center justify-center cursor-pointer transition-all font-bold h-full border-none"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* PILLAR 2: DEFINISI LTV (CUSTOMER LIFETIME VALUE) */}
        {activeTab === "ltv" && (
          <motion.div
            key="ltv-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6 relative z-10"
          >
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1.5">
                <DollarSign className="h-4.5 w-4.5 text-rose-400" />
                Parameter & Logika Customer Lifetime Value (LTV)
              </h4>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                LTV mengestimasi seluruh nilai keuntungan finansial bersih yang dihasilkan oleh satu akun pelanggan korporasi selama durasi kontrak layanan aktif di Prama.
              </p>
            </div>

            {/* Slider Parameters in Clean Layout */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                📊 VARIABEL FINANSIAL KONTRAK:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Slider 1: Average monthly revenue */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Pendapatan Bruto / Bulan</span>
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
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Slider 2: Net profit margin */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Margin Bersih (Net %)</span>
                    <span className="text-rose-400 font-black font-mono">{netProfitMargin}% Margin</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="25"
                    step="1"
                    value={netProfitMargin}
                    onChange={(e) => setNetProfitMargin(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Slider 3: Contract duration */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Durasi Kontrak</span>
                    <span className="text-rose-400 font-black font-mono">{contractDurationMonths} Bulan ({(contractDurationMonths/12).toFixed(1)} Thn)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="6"
                    value={contractDurationMonths}
                    onChange={(e) => setContractDurationMonths(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculated LTV Outcome in Clean Text */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase">
                    ESTIMASI LTV BERSIH KONTRAK:
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                    Rp {totalLtvIDR.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed pt-1 border-t border-slate-800/80">
                  <strong className="text-emerald-400 font-bold">• Catatan Finansial Sektor: </strong>
                  {cacLtvProfile.ltvNote}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 pt-1">
              <Info className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{cacLtvProfile.sectorNote}</span>
            </div>
          </motion.div>
        )}

        {/* PILLAR 3: HUBUNGAN RASIO LTV TERHADAP CAC & STRATEGI BISNIS */}
        {activeTab === "ratio" && (
          <motion.div
            key="ratio-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6 relative z-10"
          >
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1.5">
                <Scale className="h-4.5 w-4.5 text-rose-400" />
                Rasio Keuangan LTV/CAC & Evaluasi Kesehatan Bisnis
              </h4>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Rasio LTV dibanding CAC mengonfirmasi efisiensi investasi biaya promosi dan komisi penjualan. Secara universal, angka rasio <span className="text-emerald-400 font-black">{`>= 3.0x`}</span> dianggap sehat dan menjamin kesinambungan jangka panjang.
              </p>
            </div>

            {/* Numbers in Clean Horizontal Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[9.5px] font-mono font-black text-slate-400 block uppercase mb-0.5">Biaya Akuisisi (CAC)</span>
                <span className="text-base font-mono font-black text-rose-400">Rp {totalCacIDR.toLocaleString("id-ID")}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[9.5px] font-mono font-black text-slate-400 block uppercase mb-0.5">LTV Bersih Kontrak</span>
                <span className="text-base font-mono font-black text-emerald-400">Rp {totalLtvIDR.toLocaleString("id-ID")}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[9.5px] font-mono font-black text-slate-400 block uppercase mb-0.5">Rasio & Status Finansial</span>
                <span className="text-base font-mono font-black text-sky-400">{ltvCacRatio.toFixed(1)}x ({ratioHealth})</span>
              </div>
            </div>

            {/* Health Bar Register */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-slate-300 uppercase font-mono">BAR REGISTER KESEHATAN INVESTASI</span>
                <span className={`px-2 py-0.5 rounded border font-mono ${healthColor}`}>
                  {ratioHealth} ({ltvCacRatio.toFixed(2)}x)
                </span>
              </div>

              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden relative border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    ltvCacRatio >= 5.0 ? "bg-emerald-500" : ltvCacRatio >= 3.0 ? "bg-blue-400" : ltvCacRatio >= 1.5 ? "bg-amber-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, (ltvCacRatio / 10) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.0x (Kritis)</span>
                <span>3.0x (Standar Sehat)</span>
                <span>5.0x (Sangat Sehat)</span>
                <span>10.0x</span>
              </div>
            </div>

            {/* Strategic Advice Text */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                📋 REKOMENDASI & ARAHAN STRATEGIS:
              </span>
              <p className="text-[11px] text-slate-200 leading-relaxed font-semibold">
                {strategyText}
              </p>
              <div className="text-[10.5px] text-slate-300 font-semibold space-y-1 pt-1">
                <p>• <strong className="text-white">Retensi Kontrak: </strong>Pertahankan tingkat kepuasan dan SLA armada agar klien terus memperpanjang tenor kontrak.</p>
                <p>• <strong className="text-white">Efisiensi Rute (Backhaul): </strong>Manfaatkan muatan balikan untuk memaksimalkan net margin profitabilitas tanpa menambah biaya CAC.</p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
