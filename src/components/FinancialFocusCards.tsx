import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  TrendingUp,
  Sliders,
  Percent,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Truck,
  Flame,
  Wrench,
  Building,
  Zap,
  Activity,
  ArrowUpRight,
  PieChart,
  Coins,
  RefreshCw
} from "lucide-react";

interface FinancialFocusProps {
  projectTitle: string;
}

export function FinancialFocusCards({ projectTitle }: FinancialFocusProps) {
  // Tab control for deep-dives
  const [activeSegment, setActiveSegment] = useState<"capex" | "opex" | "pl" | "cashflow">("capex");

  // State 1: CAPEX Configurations
  const [capexTruckCount, setCapexTruckCount] = useState<number>(5); // 5 trucks
  const [capexPricePerTruck, setCapexPricePerTruck] = useState<number>(450000000); // Rp 450 Juta
  const [capexItInfrastructure, setCapexItInfrastructure] = useState<number>(120000000); // Rp 120 Juta
  const [capexDepoSetup, setCapexDepoSetup] = useState<number>(80000000); // Rp 80 Juta
  const [capexLicenses, setCapexLicenses] = useState<number>(45000000); // Rp 45 Juta

  // State 2: OPEX Configurations & Scenario Toggles
  const [isAiEfficiencyEnabled, setIsAiEfficiencyEnabled] = useState<boolean>(true);
  const [monthlyFuelCostPerTruck, setMonthlyFuelCostPerTruck] = useState<number>(12000000); // Rp 12 Juta
  const [monthlyDriverSalary, setMonthlyDriverSalary] = useState<number>(6500000); // Rp 6.5 Juta
  const [monthlyMaintPerTruck, setMonthlyMaintPerTruck] = useState<number>(2500000); // Rp 2.5 Juta
  const [overheadAdmin, setOverheadAdmin] = useState<number>(15000000); // Rp 15 Juta

  // State 3: P&L Custom revenue multiplier
  const [annualRevenuePerTruck, setAnnualRevenuePerTruck] = useState<number>(360000000); // Rp 360 Juta/tahun per truk
  const [taxRate, setTaxRate] = useState<number>(11); // 11% corporate tax/VAT

  // State 4: Cash Flow Scenario Selection
  const [scenario, setScenario] = useState<"pes" | "real" | "opt">("real");

  // Calculations for CAPEX
  const totalCapexTrucks = capexTruckCount * capexPricePerTruck;
  const grandTotalCapex = totalCapexTrucks + capexItInfrastructure + capexDepoSetup + capexLicenses;

  // Depreciation: Straight-line method over 5 years (80% salvage value assumed or fully depreciated)
  const annualDepreciation = (totalCapexTrucks * 0.85) / 5 + (capexItInfrastructure / 3) + (capexDepoSetup / 5);

  // Calculations for OPEX (Annualized)
  const fuelMultiplier = isAiEfficiencyEnabled ? 0.85 : 1.0; // 15% fuel saving with smart route optimizations
  const maintMultiplier = isAiEfficiencyEnabled ? 0.90 : 1.0; // 10% maintenance saving with predictive IoT

  const annualOpexFuel = capexTruckCount * (monthlyFuelCostPerTruck * fuelMultiplier) * 12;
  const annualOpexSalary = capexTruckCount * (monthlyDriverSalary + 1500000) * 12; // Driver salary + benefits/BPJS
  const annualOpexMaint = capexTruckCount * (monthlyMaintPerTruck * maintMultiplier) * 12;
  const annualOpexOverhead = overheadAdmin * 12;

  const grandTotalAnnualOpex = annualOpexFuel + annualOpexSalary + annualOpexMaint + annualOpexOverhead;

  // Calculations for P&L (Projection Year 1, 2, and 3)
  const growthFactor = useMemo(() => {
    switch (scenario) {
      case "pes": return { yr2: 1.05, yr3: 1.10 };
      case "opt": return { yr2: 1.35, yr3: 1.70 };
      default: return { yr2: 1.20, yr3: 1.45 };
    }
  }, [scenario]);

  const pAndLData = useMemo(() => {
    const yr1Revenue = capexTruckCount * annualRevenuePerTruck;
    const yr2Revenue = yr1Revenue * growthFactor.yr2;
    const yr3Revenue = yr1Revenue * growthFactor.yr3;

    // Years 2 and 3 OPEX adjustments for scale
    const yr1Opex = grandTotalAnnualOpex;
    const yr2Opex = grandTotalAnnualOpex * (1 + (growthFactor.yr2 - 1) * 0.4); // some variables scale with revenue
    const yr3Opex = grandTotalAnnualOpex * (1 + (growthFactor.yr3 - 1) * 0.45);

    const yr1Ebitda = yr1Revenue - yr1Opex;
    const yr2Ebitda = yr2Revenue - yr2Opex;
    const yr3Ebitda = yr3Revenue - yr3Opex;

    const yr1Ebit = yr1Ebitda - annualDepreciation;
    const yr2Ebit = yr2Ebitda - annualDepreciation;
    const yr3Ebit = yr3Ebitda - annualDepreciation;

    const yr1Tax = yr1Ebit > 0 ? yr1Ebit * (taxRate / 100) : 0;
    const yr2Tax = yr2Ebit > 0 ? yr2Ebit * (taxRate / 100) : 0;
    const yr3Tax = yr3Ebit > 0 ? yr3Ebit * (taxRate / 100) : 0;

    const yr1Net = yr1Ebit - yr1Tax;
    const yr2Net = yr2Ebit - yr2Tax;
    const yr3Net = yr3Ebit - yr3Tax;

    return {
      yr1: { revenue: yr1Revenue, opex: yr1Opex, ebitda: yr1Ebitda, ebit: yr1Ebit, tax: yr1Tax, netProfit: yr1Net },
      yr2: { revenue: yr2Revenue, opex: yr2Opex, ebitda: yr2Ebitda, ebit: yr2Ebit, tax: yr2Tax, netProfit: yr2Net },
      yr3: { revenue: yr3Revenue, opex: yr3Opex, ebitda: yr3Ebitda, ebit: yr3Ebit, tax: yr3Tax, netProfit: yr3Net }
    };
  }, [capexTruckCount, annualRevenuePerTruck, grandTotalAnnualOpex, annualDepreciation, growthFactor, taxRate]);

  // Calculations for CASH FLOW & ROI
  const averageAnnualCashInflow = (pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + pAndLData.yr3.netProfit) / 3 + annualDepreciation;
  const simplePaybackYears = averageAnnualCashInflow > 0 ? grandTotalCapex / averageAnnualCashInflow : 99;
  const roiPercentage = grandTotalCapex > 0 ? (averageAnnualCashInflow / grandTotalCapex) * 100 : 0;

  // Format currency in Rupiah (IDR)
  const formatIDR = (num: number) => {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(2)} Miliar`;
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1)} Juta`;
    }
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div id="financial-focus-dashboard" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-6 relative overflow-hidden font-sans">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              FINANCIAL CORE FEASIBILITY
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Coins className="h-5.5 w-5.5 text-emerald-400" />
            Fokus Analisis Finansial Terintegrasi
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Eksplorasi mendalam skenario kelayakan finansial proyek "{projectTitle}" dari sisi Pengeluaran Modal, Biaya Operasional, Estimasi Laba/Rugi, dan Proyeksi Pengembalian Investasi (ROI).
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="flex gap-3 shrink-0">
          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">GRAND TOTAL CAPEX</span>
            <span className="text-xs font-black text-white font-mono">{formatIDR(grandTotalCapex)}</span>
          </div>
          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">ESTIMASI PAYBACK</span>
            <span className="text-xs font-black text-emerald-400 font-mono">{simplePaybackYears.toFixed(1)} Tahun</span>
          </div>
        </div>
      </div>

      {/* SEGMENT TAB BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 relative z-10">
        <button
          type="button"
          onClick={() => setActiveSegment("capex")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "capex"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "capex" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 1</span>
            <span className="text-[11px] font-black uppercase text-white">💰 CAPEX Assets</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("opex")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "opex"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "opex" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 2</span>
            <span className="text-[11px] font-black uppercase text-white">🛠️ OPEX Operational</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("pl")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "pl"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "pl" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 3</span>
            <span className="text-[11px] font-black uppercase text-white">📊 Proyeksi P&L</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("cashflow")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "cashflow"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "cashflow" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 4</span>
            <span className="text-[11px] font-black uppercase text-white">🔄 Cash Flow & ROI</span>
          </div>
        </button>
      </div>

      {/* CONTENT AREA FOR INTERACTIVE SEGMENTS */}
      <AnimatePresence mode="wait">
        {/* SEGMENT 1: CAPEX DETAILS & CONTROLS */}
        {activeSegment === "capex" && (
          <motion.div
            key="segment-capex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Column: Input Sliders */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Konfigurasi Pembelian Aset Modal (CAPEX)
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">SLIDER CONTROLLER</span>
              </div>

              {/* Slider 1: Truck Fleet count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Jumlah Pembelian Armada Truk</span>
                  <span className="text-emerald-400 font-black font-mono">{capexTruckCount} Unit</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={capexTruckCount}
                  onChange={(e) => setCapexTruckCount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 2: Price per Truck */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. Harga Beli per Unit Truk</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(capexPricePerTruck)}</span>
                </div>
                <input
                  type="range"
                  min="350000000"
                  max="650000000"
                  step="10000000"
                  value={capexPricePerTruck}
                  onChange={(e) => setCapexPricePerTruck(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Grid for minor costs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase">Infrastruktur IT & IoT</label>
                  <input
                    type="number"
                    value={capexItInfrastructure}
                    onChange={(e) => setCapexItInfrastructure(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase">Setup Depo & Kantor</label>
                  <input
                    type="number"
                    value={capexDepoSetup}
                    onChange={(e) => setCapexDepoSetup(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase">Lisensi & Legalitas</label>
                  <input
                    type="number"
                    value={capexLicenses}
                    onChange={(e) => setCapexLicenses(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Visualization & Breakdown analysis */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-emerald-400 uppercase tracking-widest block mb-1">
                  CAPEX ASSET DISTRIBUTION
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Distribusi Alokasi Modal
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Item 1: Trucks */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-blue-400" /> Armada Truk Sasis</span>
                      <span className="font-mono text-white">{formatIDR(totalCapexTrucks)} ({((totalCapexTrucks / grandTotalCapex) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(totalCapexTrucks / grandTotalCapex) * 100}%` }} />
                    </div>
                  </div>

                  {/* Item 2: IT */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-indigo-400" /> Perangkat IT & Sensor IoT</span>
                      <span className="font-mono text-white">{formatIDR(capexItInfrastructure)} ({((capexItInfrastructure / grandTotalCapex) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(capexItInfrastructure / grandTotalCapex) * 100}%` }} />
                    </div>
                  </div>

                  {/* Item 3: Depo */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5 text-amber-400" /> Depo & Kantor Cabang</span>
                      <span className="font-mono text-white">{formatIDR(capexDepoSetup)} ({((capexDepoSetup / grandTotalCapex) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(capexDepoSetup / grandTotalCapex) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-slate-300 leading-relaxed font-semibold">
                  💡 <strong className="text-white">Informasi Pajak & Penyusutan:</strong> Depresiasi tahunan aset ini sebesar <span className="text-emerald-400 font-mono">{formatIDR(annualDepreciation)}</span> dihitung dengan metode garis lurus untuk mereduksi beban pajak bersih korporasi secara berkala.
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA CAPEX CONTROLLING v1.4
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 2: OPEX DETAILS & CONTROLS */}
        {activeSegment === "opex" && (
          <motion.div
            key="segment-opex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Column: OPEX sliders */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Konfigurasi Biaya Operasional (OPEX) bulanan
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">MONTHLY VARIABLES</span>
              </div>

              {/* Switch for AI efficiency optimization */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block font-mono">SISTEM OPTIMALISASI AI</span>
                  <h5 className="text-[11.5px] font-black text-white">Aktifkan Route Planning & Predictive IoT</h5>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-normal">
                    Menghemat BBM sebesar 15% dan biaya pemeliharaan armada truk sebesar 10%.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiEfficiencyEnabled(!isAiEfficiencyEnabled)}
                  className={`px-3 py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer border ${
                    isAiEfficiencyEnabled
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isAiEfficiencyEnabled ? "Sistem Aktif" : "Non-Aktif"}
                </button>
              </div>

              {/* Slider 1: Fuel cost */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Anggaran BBM per Truk (Bulanan)</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyFuelCostPerTruck)}</span>
                </div>
                <input
                  type="range"
                  min="8000000"
                  max="20000000"
                  step="50000"
                  value={monthlyFuelCostPerTruck}
                  onChange={(e) => setMonthlyFuelCostPerTruck(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 2: Driver Salary */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. Upah All-in Supir (Gaji + Uang Makan)</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyDriverSalary)}</span>
                </div>
                <input
                  type="range"
                  min="4500000"
                  max="9500000"
                  step="100000"
                  value={monthlyDriverSalary}
                  onChange={(e) => setMonthlyDriverSalary(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 3: Maintenance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">3. Biaya Perawatan Rutin per Truk</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyMaintPerTruck)}</span>
                </div>
                <input
                  type="range"
                  min="1500000"
                  max="5000000"
                  step="100000"
                  value={monthlyMaintPerTruck}
                  onChange={(e) => setMonthlyMaintPerTruck(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Right Column: OPEX projections */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  ANNUAL OPEX ESTIMATION
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Akumulasi Beban Kerja Tahunan
                </h4>

                <div className="space-y-3 font-semibold text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-amber-500" /> Biaya Bahan Bakar (BBM)</span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpexFuel)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1">👥 Gaji Driver & Crew Cab</span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpexSalary)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1"><Wrench className="h-3.5 w-3.5 text-blue-400" /> Pemeliharaan & Ban Sasis</span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpexMaint)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1">🏢 Overhead Kantor & Operasional</span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpexOverhead)}</span>
                  </div>

                  <div className="flex justify-between pt-3 text-[13px] font-black text-white">
                    <span>Total OPEX Setahun ({capexTruckCount} Truk)</span>
                    <span className="font-mono text-emerald-400">{formatIDR(grandTotalAnnualOpex)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA OPEX MODELING ENGINE v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 3: P&L PROJECTIONS */}
        {activeSegment === "pl" && (
          <motion.div
            key="segment-pl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Column: Scenario & Revenue Drivers */}
            <div className="lg:col-span-4 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-mono font-black text-emerald-400 block uppercase">SCENARIO CONTROLLER</span>
                  <h4 className="text-xs font-black uppercase text-white tracking-wider mt-0.5">Metrik Pertumbuhan Pasar</h4>
                </div>

                {/* Scenario buttons */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setScenario("pes")}
                    className={`py-2 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      scenario === "pes" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Pesimis
                  </button>
                  <button
                    type="button"
                    onClick={() => setScenario("real")}
                    className={`py-2 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      scenario === "real" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Realistis
                  </button>
                  <button
                    type="button"
                    onClick={() => setScenario("opt")}
                    className={`py-2 text-[9.5px] font-black rounded-lg cursor-pointer transition-all ${
                      scenario === "opt" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Optimis
                  </button>
                </div>

                {/* Revenue per truck slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Target Pendapatan / Truk / Tahun</span>
                    <span className="text-white font-mono font-bold">{formatIDR(annualRevenuePerTruck)}</span>
                  </div>
                  <input
                    type="range"
                    min="250000000"
                    max="600000000"
                    step="10000000"
                    value={annualRevenuePerTruck}
                    onChange={(e) => setAnnualRevenuePerTruck(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Tax Rate slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Estimasi Beban Pajak Efektif</span>
                    <span className="text-white font-mono font-bold">{taxRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="22"
                    step="1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SCENARIOS ENGINE v1.1
              </div>
            </div>

            {/* Right Column: Complete Pro-forma Profit & Loss Statement Table */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                  Proyeksi Laba & Rugi (P&L Pro-Forma) 3 Tahun
                </h4>
                <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">Rp IDR DENOMINATED</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-900 text-[10px] text-slate-500 uppercase font-black font-mono">
                      <th className="py-2">Item Pos Finansial</th>
                      <th className="py-2 text-right">Tahun Ke-1</th>
                      <th className="py-2 text-right">Tahun Ke-2</th>
                      <th className="py-2 text-right text-emerald-400">Tahun Ke-3</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-300">
                    <tr className="border-b border-slate-900/40">
                      <td className="py-2 text-white">Pendapatan Jasa Hauling (Revenue)</td>
                      <td className="py-2 text-right font-mono">{formatIDR(pAndLData.yr1.revenue)}</td>
                      <td className="py-2 text-right font-mono">{formatIDR(pAndLData.yr2.revenue)}</td>
                      <td className="py-2 text-right font-mono text-emerald-400">{formatIDR(pAndLData.yr3.revenue)}</td>
                    </tr>
                    <tr className="border-b border-slate-900/40 text-red-400/90">
                      <td className="py-2">Biaya Operasional (OPEX)</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr1.opex)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr2.opex)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr3.opex)})</td>
                    </tr>
                    <tr className="border-b border-slate-900 bg-emerald-500/5 font-black text-white">
                      <td className="py-2.5">Laba Sebelum Bunga/Pajak (EBITDA)</td>
                      <td className="py-2.5 text-right font-mono text-emerald-400">{formatIDR(pAndLData.yr1.ebitda)}</td>
                      <td className="py-2.5 text-right font-mono text-emerald-400">{formatIDR(pAndLData.yr2.ebitda)}</td>
                      <td className="py-2.5 text-right font-mono text-emerald-500">{formatIDR(pAndLData.yr3.ebitda)}</td>
                    </tr>
                    <tr className="border-b border-slate-900/40 text-slate-500">
                      <td className="py-2">Depresiasi Sasis & Peralatan</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                    </tr>
                    <tr className="border-b border-slate-900/40 text-red-400/90">
                      <td className="py-2">Estimasi Pajak Badan/PPh ({taxRate}%)</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr1.tax)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr2.tax)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(pAndLData.yr3.tax)})</td>
                    </tr>
                    <tr className="bg-slate-900 font-extrabold text-[12.5px] text-white">
                      <td className="py-3">Laba Bersih Setelah Pajak (NPAT)</td>
                      <td className="py-3 text-right font-mono text-cyan-400">{formatIDR(pAndLData.yr1.netProfit)}</td>
                      <td className="py-3 text-right font-mono text-cyan-400">{formatIDR(pAndLData.yr2.netProfit)}</td>
                      <td className="py-3 text-right font-mono text-cyan-400">{formatIDR(pAndLData.yr3.netProfit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 4: CASH FLOW & ROI MANAGEMENT */}
        {activeSegment === "cashflow" && (
          <motion.div
            key="segment-cashflow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Left Column: Scenario Outputs & Timelines */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 mb-4 flex items-center gap-1.5">
                  <Percent className="h-4.5 w-4.5 text-emerald-400" />
                  Arus Kas & Analisis Imbal Hasil Investasi (ROI)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Metric Card 1: ROI Estimate */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider font-mono">ESTIMASI TINGKAT ROI</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono block mt-1">
                      {roiPercentage.toFixed(1)}% <span className="text-xs text-slate-400 font-bold">/ Tahun</span>
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-normal">
                      Rata-rata arus kas bersih tahunan dibandingkan dengan investasi awal (CAPEX).
                    </p>
                  </div>

                  {/* Metric Card 2: Simple Payback Period */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider font-mono">PAYBACK PERIOD (PBP)</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                      {simplePaybackYears.toFixed(1)} <span className="text-xs text-slate-400 font-bold">Tahun</span>
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-normal">
                      Kecepatan pengembalian seluruh modal investasi awal melalui laba bersih usaha.
                    </p>
                  </div>
                </div>

                {/* Progress Timeline on breaking even */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase font-mono block">Timeline Titik Impas (Break-even Progress)</span>
                  <div className="w-full h-3 bg-slate-850 rounded-full overflow-hidden relative">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, (3 / simplePaybackYears) * 100))}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] text-white font-mono font-black">
                      Progress s/d Tahun Ke-3: {Math.min(100, Math.round((3 / simplePaybackYears) * 100))}% Terlunasi
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] text-slate-500 font-semibold flex items-center gap-1 mt-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Analisis payback period di atas mengasumsikan pembayaran retensi tepat waktu oleh pemberi kerja.</span>
              </div>
            </div>

            {/* Right Column: Cash Flow Accumulation Breakdown */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  CUMULATIVE CASH TRACK
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Akumulasi Saldo Kas Bersih
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Year 0 (Start Capex) */}
                  <div className="flex justify-between items-center text-red-400 font-semibold">
                    <div>
                      <span className="text-slate-400 font-bold text-[10px] block font-mono uppercase">TAHUN KE-0 (CAPEX AWAL)</span>
                      <span className="text-[11.5px] font-black uppercase">Pengeluaran Investasi</span>
                    </div>
                    <span className="font-mono text-white">({formatIDR(grandTotalCapex)})</span>
                  </div>

                  {/* Year 1 Cash position */}
                  <div className="flex justify-between items-center border-t border-slate-850/60 pt-2 font-semibold">
                    <div>
                      <span className="text-slate-500 font-bold text-[9px] block font-mono">AKHIR TAHUN KE-1</span>
                      <span className="text-[11.5px] font-black text-slate-300">Akumulasi Arus Kas</span>
                    </div>
                    <span className={`font-mono ${pAndLData.yr1.netProfit + annualDepreciation - grandTotalCapex > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {formatIDR(pAndLData.yr1.netProfit + annualDepreciation - grandTotalCapex)}
                    </span>
                  </div>

                  {/* Year 2 Cash position */}
                  <div className="flex justify-between items-center border-t border-slate-850/60 pt-2 font-semibold">
                    <div>
                      <span className="text-slate-500 font-bold text-[9px] block font-mono">AKHIR TAHUN KE-2</span>
                      <span className="text-[11.5px] font-black text-slate-300">Akumulasi Arus Kas</span>
                    </div>
                    <span className={`font-mono ${pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + (annualDepreciation * 2) - grandTotalCapex > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {formatIDR(pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + (annualDepreciation * 2) - grandTotalCapex)}
                    </span>
                  </div>

                  {/* Year 3 Cash position */}
                  <div className="flex justify-between items-center border-t border-slate-850/60 pt-2 font-semibold">
                    <div>
                      <span className="text-slate-550 font-bold text-[9px] block font-mono">AKHIR TAHUN KE-3</span>
                      <span className="text-[11.5px] font-black text-white">Akumulasi Arus Kas</span>
                    </div>
                    <span className={`font-mono ${pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + pAndLData.yr3.netProfit + (annualDepreciation * 3) - grandTotalCapex > 0 ? "text-emerald-400 text-[13px] font-black" : "text-amber-400"}`}>
                      {formatIDR(pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + pAndLData.yr3.netProfit + (annualDepreciation * 3) - grandTotalCapex)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA NPV & CASH-FLOW MODEL v1.3
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
