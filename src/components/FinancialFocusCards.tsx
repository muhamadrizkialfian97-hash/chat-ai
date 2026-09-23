import React, { useState, useMemo, useEffect } from "react";
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
  RefreshCw,
  Sparkles,
  Layers,
  ShoppingBag,
  Factory
} from "lucide-react";
import { getFinancialRecommendations, FinancialRecommendation } from "../utils/financialRecommendations";

interface FinancialFocusProps {
  projectTitle: string;
}

export function FinancialFocusCards({ projectTitle }: FinancialFocusProps) {
  // Retrieve standardized financial recommendation based on project title & archetype
  const rec = useMemo(() => getFinancialRecommendations(projectTitle), [projectTitle]);

  // Tab control for deep-dives
  const [activeSegment, setActiveSegment] = useState<"capex" | "opex" | "pl" | "cashflow">("capex");

  // State 1: CAPEX Configurations
  const [capexAssetCount, setCapexAssetCount] = useState<number>(rec.capexAssetCount);
  const [capexAssetPrice, setCapexAssetPrice] = useState<number>(rec.capexAssetPrice);
  const [capexSecondary1, setCapexSecondary1] = useState<number>(rec.capexSecondary1Amount);
  const [capexSecondary2, setCapexSecondary2] = useState<number>(rec.capexSecondary2Amount);
  const [capexSecondary3, setCapexSecondary3] = useState<number>(rec.capexSecondary3Amount);

  // State 2: OPEX Configurations & Scenario Toggles
  const [isAiEfficiencyEnabled, setIsAiEfficiencyEnabled] = useState<boolean>(true);
  const [monthlyOpex1, setMonthlyOpex1] = useState<number>(rec.opex1Amount);
  const [monthlyOpex2, setMonthlyOpex2] = useState<number>(rec.opex2Amount);
  const [monthlyOpex3, setMonthlyOpex3] = useState<number>(rec.opex3Amount);
  const [monthlyOpex4, setMonthlyOpex4] = useState<number>(rec.opex4Amount);

  // State 3: P&L Custom revenue multiplier
  const [annualRevenuePerAsset, setAnnualRevenuePerAsset] = useState<number>(rec.annualRevenuePerAsset);
  const [taxRate, setTaxRate] = useState<number>(rec.taxRate);

  // State 4: Cash Flow Scenario Selection
  const [scenario, setScenario] = useState<"pes" | "real" | "opt">("real");

  // Synchronize state whenever projectTitle changes to guarantee uniform data
  useEffect(() => {
    const r = getFinancialRecommendations(projectTitle);
    setCapexAssetCount(r.capexAssetCount);
    setCapexAssetPrice(r.capexAssetPrice);
    setCapexSecondary1(r.capexSecondary1Amount);
    setCapexSecondary2(r.capexSecondary2Amount);
    setCapexSecondary3(r.capexSecondary3Amount);

    setMonthlyOpex1(r.opex1Amount);
    setMonthlyOpex2(r.opex2Amount);
    setMonthlyOpex3(r.opex3Amount);
    setMonthlyOpex4(r.opex4Amount);

    setAnnualRevenuePerAsset(r.annualRevenuePerAsset);
    setTaxRate(r.taxRate);
    setScenario("real");
  }, [projectTitle]);

  // Handler to manually restore exact project recommendation numbers
  const handleResetToRecommendations = () => {
    setCapexAssetCount(rec.capexAssetCount);
    setCapexAssetPrice(rec.capexAssetPrice);
    setCapexSecondary1(rec.capexSecondary1Amount);
    setCapexSecondary2(rec.capexSecondary2Amount);
    setCapexSecondary3(rec.capexSecondary3Amount);

    setMonthlyOpex1(rec.opex1Amount);
    setMonthlyOpex2(rec.opex2Amount);
    setMonthlyOpex3(rec.opex3Amount);
    setMonthlyOpex4(rec.opex4Amount);

    setAnnualRevenuePerAsset(rec.annualRevenuePerAsset);
    setTaxRate(rec.taxRate);
    setScenario("real");
    setIsAiEfficiencyEnabled(true);
  };

  // Calculations for CAPEX
  const totalCapexPrimary = capexAssetCount * capexAssetPrice;
  const grandTotalCapex = totalCapexPrimary + capexSecondary1 + capexSecondary2 + capexSecondary3;

  // Depreciation: Straight-line method matching recommendation
  const annualDepreciation = rec.annualDepreciation;

  // Calculations for OPEX (Annualized)
  const opex1Multiplier = isAiEfficiencyEnabled ? (1 - rec.techSavingsPercentOpex1 / 100) : 1.0;
  const opex3Multiplier = isAiEfficiencyEnabled ? (1 - rec.techSavingsPercentOpex3 / 100) : 1.0;

  const annualOpex1 = (monthlyOpex1 * opex1Multiplier) * 12;
  const annualOpex2 = monthlyOpex2 * 12;
  const annualOpex3 = (monthlyOpex3 * opex3Multiplier) * 12;
  const annualOpex4 = monthlyOpex4 * 12;

  const grandTotalAnnualOpex = annualOpex1 + annualOpex2 + annualOpex3 + annualOpex4;
  const currentTotalMonthlyOpex = grandTotalAnnualOpex / 12;

  // Calculations for P&L (Projection Year 1, 2, and 3)
  const growthFactor = useMemo(() => {
    switch (scenario) {
      case "pes": return { yr2: 1.08, yr3: 1.15 };
      case "opt": return { yr2: 1.30, yr3: 1.65 };
      default: return { yr2: 1.20, yr3: 1.45 };
    }
  }, [scenario]);

  const pAndLData = useMemo(() => {
    // For personal SME, annualRevenuePerAsset is already the total outlet revenue
    // For transport/manufacturing with multiple units/lines, scale by asset count if needed
    const yr1Revenue = rec.archetype === "personal_sme"
      ? annualRevenuePerAsset * capexAssetCount
      : (rec.archetype === "manufacturing"
          ? (annualRevenuePerAsset / rec.capexAssetCount) * capexAssetCount
          : (annualRevenuePerAsset / rec.capexAssetCount) * capexAssetCount);

    const yr2Revenue = yr1Revenue * growthFactor.yr2;
    const yr3Revenue = yr1Revenue * growthFactor.yr3;

    // Years 2 and 3 OPEX adjustments for scale
    const yr1Opex = grandTotalAnnualOpex;
    const yr2Opex = grandTotalAnnualOpex * (1 + (growthFactor.yr2 - 1) * 0.40);
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
  }, [rec.archetype, rec.capexAssetCount, capexAssetCount, annualRevenuePerAsset, grandTotalAnnualOpex, annualDepreciation, growthFactor, taxRate]);

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
    return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
  };

  // Select appropriate icon for primary asset
  const AssetIcon = useMemo(() => {
    if (rec.archetype === "manufacturing") return Factory;
    if (rec.archetype === "personal_sme") return ShoppingBag;
    return Truck;
  }, [rec.archetype]);

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
              ⚡ SEKTOR: <span className="text-white font-bold">{rec.sectorTag}</span>
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              ARKETIPE: {rec.archetypeLabel.toUpperCase()}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Coins className="h-5.5 w-5.5 text-emerald-400" />
            Fokus Analisis Finansial Terintegrasi: {projectTitle || "Kajian Kelayakan Bisnis"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Data output finansial telah disinkronkan seragam dengan rekomendasi pilar kajian kelayakan untuk proyek <strong>"{projectTitle}"</strong>.
          </p>
        </div>

        {/* Action button & Highlight Stats */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToRecommendations}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-emerald-950"
            title="Kembalikan semua nilai ke angka rekomendasi resmi proyek"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Terapkan Rekomendasi Standar</span>
          </button>

          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 text-left">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">TOTAL CAPEX</span>
            <span className="text-xs font-black text-white font-mono">{formatIDR(grandTotalCapex)}</span>
          </div>
          <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 text-left">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">ESTIMASI PAYBACK</span>
            <span className="text-xs font-black text-emerald-400 font-mono">
              {rec.archetype === "personal_sme" ? rec.paybackText : `${simplePaybackYears.toFixed(1)} Tahun`}
            </span>
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
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "capex" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 1</span>
            <span className="text-[11px] font-black uppercase text-white">💰 Alokasi Modal (CAPEX)</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("opex")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "opex"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "opex" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 2</span>
            <span className="text-[11px] font-black uppercase text-white">🛠️ Biaya Rutin (OPEX)</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("pl")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "pl"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "pl" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 3</span>
            <span className="text-[11px] font-black uppercase text-white">📊 Proyeksi Laba Rugi</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment("cashflow")}
          className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-center gap-2.5 ${
            activeSegment === "cashflow"
              ? "bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
              : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${activeSegment === "cashflow" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400"}`}>
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[8px] font-mono font-black text-slate-500 block uppercase">BAGIAN 4</span>
            <span className="text-[11px] font-black uppercase text-white">🔄 Cash Flow &amp; ROI</span>
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
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Konfigurasi Pembelian Aset Modal (CAPEX)
                </h4>
                <span className="text-[8px] text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                  {rec.archetypeLabel.toUpperCase()}
                </span>
              </div>

              {/* Slider 1: Asset count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. Jumlah {rec.assetUnitLabel}</span>
                  <span className="text-emerald-400 font-black font-mono">{capexAssetCount} {rec.assetUnitLabel}</span>
                </div>
                <input
                  type="range"
                  min={rec.capexAssetCountMin}
                  max={rec.capexAssetCountMax}
                  step="1"
                  value={capexAssetCount}
                  onChange={(e) => setCapexAssetCount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 2: Price per Asset */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. Alokasi Investasi per {rec.assetUnitLabel}</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(capexAssetPrice)}</span>
                </div>
                <input
                  type="range"
                  min={rec.capexAssetPriceMin}
                  max={rec.capexAssetPriceMax}
                  step={rec.capexAssetPriceStep}
                  value={capexAssetPrice}
                  onChange={(e) => setCapexAssetPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Grid for secondary costs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase truncate" title={rec.capexSecondary1Name}>
                    {rec.capexSecondary1Name}
                  </label>
                  <input
                    type="number"
                    value={capexSecondary1}
                    onChange={(e) => setCapexSecondary1(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block text-right">{formatIDR(capexSecondary1)}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase truncate" title={rec.capexSecondary2Name}>
                    {rec.capexSecondary2Name}
                  </label>
                  <input
                    type="number"
                    value={capexSecondary2}
                    onChange={(e) => setCapexSecondary2(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block text-right">{formatIDR(capexSecondary2)}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-400 block uppercase truncate" title={rec.capexSecondary3Name}>
                    {rec.capexSecondary3Name}
                  </label>
                  <input
                    type="number"
                    value={capexSecondary3}
                    onChange={(e) => setCapexSecondary3(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[9px] text-slate-500 font-mono block text-right">{formatIDR(capexSecondary3)}</span>
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
                  Distribusi Alokasi Modal Awal
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Item 1: Primary Asset */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1 truncate max-w-[210px]" title={rec.assetName}>
                        <AssetIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{rec.assetName}</span>
                      </span>
                      <span className="font-mono text-white shrink-0">
                        {formatIDR(totalCapexPrimary)} ({grandTotalCapex > 0 ? ((totalCapexPrimary / grandTotalCapex) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${grandTotalCapex > 0 ? (totalCapexPrimary / grandTotalCapex) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {/* Item 2: Secondary 1 */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1 truncate max-w-[210px]" title={rec.capexSecondary1Name}>
                        <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{rec.capexSecondary1Name}</span>
                      </span>
                      <span className="font-mono text-white shrink-0">
                        {formatIDR(capexSecondary1)} ({grandTotalCapex > 0 ? ((capexSecondary1 / grandTotalCapex) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${grandTotalCapex > 0 ? (capexSecondary1 / grandTotalCapex) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {/* Item 3: Secondary 2 */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                      <span className="flex items-center gap-1 truncate max-w-[210px]" title={rec.capexSecondary2Name}>
                        <Building className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{rec.capexSecondary2Name}</span>
                      </span>
                      <span className="font-mono text-white shrink-0">
                        {formatIDR(capexSecondary2)} ({grandTotalCapex > 0 ? ((capexSecondary2 / grandTotalCapex) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${grandTotalCapex > 0 ? (capexSecondary2 / grandTotalCapex) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {/* Item 4: Secondary 3 (if exists) */}
                  {capexSecondary3 > 0 && (
                    <div>
                      <div className="flex justify-between text-[10.5px] mb-1 font-semibold text-slate-300">
                        <span className="flex items-center gap-1 truncate max-w-[210px]" title={rec.capexSecondary3Name}>
                          <ShieldAlert className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{rec.capexSecondary3Name}</span>
                        </span>
                        <span className="font-mono text-white shrink-0">
                          {formatIDR(capexSecondary3)} ({grandTotalCapex > 0 ? ((capexSecondary3 / grandTotalCapex) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${grandTotalCapex > 0 ? (capexSecondary3 / grandTotalCapex) * 100 : 0}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 p-3 rounded bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-slate-300 leading-relaxed font-semibold">
                  💡 <strong className="text-white">Informasi Depresiasi:</strong> Penyusutan aset tahunan diproyeksikan sebesar <span className="text-emerald-400 font-mono font-bold">{formatIDR(annualDepreciation)}</span> dengan metode garis lurus untuk efisiensi beban pajak bersih usaha.
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono flex justify-between items-center">
                <span>PRAMA CAPEX CONTROLLING v2.0</span>
                <span className="text-emerald-400 font-bold">TOTAL: {formatIDR(grandTotalCapex)}</span>
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
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Konfigurasi Biaya Operasional (OPEX) Bulanan
                </h4>
                <span className="text-[8px] text-slate-500 font-bold font-mono">MONTHLY VARIABLES</span>
              </div>

              {/* Switch for AI / Tech efficiency optimization */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block font-mono">
                    {rec.techOptimizationTitle}
                  </span>
                  <h5 className="text-[11.5px] font-black text-white">Optimalisasi Efisiensi Digital &amp; IoT</h5>
                  <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-normal">
                    {rec.techOptimizationDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiEfficiencyEnabled(!isAiEfficiencyEnabled)}
                  className={`px-3 py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer border shrink-0 ${
                    isAiEfficiencyEnabled
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isAiEfficiencyEnabled ? "Sistem Aktif" : "Non-Aktif"}
                </button>
              </div>

              {/* Slider 1: OPEX 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">1. {rec.opex1Name} (Bulanan)</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyOpex1)}</span>
                </div>
                <input
                  type="range"
                  min={rec.opex1Min}
                  max={rec.opex1Max}
                  step={rec.opex1Step}
                  value={monthlyOpex1}
                  onChange={(e) => setMonthlyOpex1(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 2: OPEX 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">2. {rec.opex2Name} (Bulanan)</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyOpex2)}</span>
                </div>
                <input
                  type="range"
                  min={rec.opex2Min}
                  max={rec.opex2Max}
                  step={rec.opex2Step}
                  value={monthlyOpex2}
                  onChange={(e) => setMonthlyOpex2(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 3: OPEX 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">3. {rec.opex3Name} (Bulanan)</span>
                  <span className="text-emerald-400 font-black font-mono">{formatIDR(monthlyOpex3)}</span>
                </div>
                <input
                  type="range"
                  min={rec.opex3Min}
                  max={rec.opex3Max}
                  step={rec.opex3Step}
                  value={monthlyOpex3}
                  onChange={(e) => setMonthlyOpex3(Number(e.target.value))}
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
                  Akumulasi Beban Operasional Usaha
                </h4>

                <div className="space-y-3 font-semibold text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={rec.opex1Name}>
                      <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{rec.opex1Name}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpex1)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={rec.opex2Name}>
                      <span className="text-emerald-400">👥</span>
                      <span className="truncate">{rec.opex2Name}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpex2)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={rec.opex3Name}>
                      <Wrench className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{rec.opex3Name}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpex3)}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={rec.opex4Name}>
                      <Building className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{rec.opex4Name}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{formatIDR(annualOpex4)}</span>
                  </div>

                  <div className="flex justify-between pt-3 text-[13px] font-black text-white">
                    <span>Total OPEX Setahun</span>
                    <span className="font-mono text-emerald-400">{formatIDR(grandTotalAnnualOpex)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Rata-rata Bulanan</span>
                    <span className="font-mono text-white">{formatIDR(currentTotalMonthlyOpex)} / bln</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA OPEX MODELING ENGINE v2.0
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

                {/* Revenue driver slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Target Omset / Revenue Thn 1</span>
                    <span className="text-white font-mono font-bold">{formatIDR(annualRevenuePerAsset)}</span>
                  </div>
                  <input
                    type="range"
                    min={rec.annualRevenuePerAssetMin}
                    max={rec.annualRevenuePerAssetMax}
                    step={rec.annualRevenuePerAssetStep}
                    value={annualRevenuePerAsset}
                    onChange={(e) => setAnnualRevenuePerAsset(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Tax Rate slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Estimasi Tarif Pajak ({rec.archetype === "personal_sme" ? "PPh Final UMKM" : "PPh Badan"})</span>
                    <span className="text-white font-mono font-bold">{taxRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={rec.archetype === "personal_sme" ? "0.5" : "5"}
                    max={rec.archetype === "personal_sme" ? "2" : "22"}
                    step={rec.archetype === "personal_sme" ? "0.5" : "1"}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SCENARIOS ENGINE v2.0
              </div>
            </div>

            {/* Right Column: Complete Pro-forma Profit & Loss Statement Table */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                  Proyeksi Laba &amp; Rugi (P&amp;L Pro-Forma) 3 Tahun
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
                      <td className="py-2 text-white">Pendapatan Usaha (Revenue)</td>
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
                      <td className="py-2">Depresiasi Aset &amp; Fasilitas</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                      <td className="py-2 text-right font-mono">({formatIDR(annualDepreciation)})</td>
                    </tr>
                    <tr className="border-b border-slate-900/40 text-red-400/90">
                      <td className="py-2">Estimasi Beban Pajak ({taxRate}%)</td>
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
                  Arus Kas &amp; Analisis Imbal Hasil Investasi (ROI)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Metric Card 1: ROI Estimate */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider font-mono">ESTIMASI TINGKAT ROI</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono block mt-1">
                      {roiPercentage.toFixed(1)}% <span className="text-xs text-slate-400 font-bold">/ Tahun</span>
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-normal">
                      Rata-rata arus kas bersih tahunan dibandingkan dengan investasi modal awal (CAPEX).
                    </p>
                  </div>

                  {/* Metric Card 2: Simple Payback Period */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider font-mono">PAYBACK PERIOD (PBP)</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                      {rec.archetype === "personal_sme" ? rec.paybackText : `${simplePaybackYears.toFixed(1)} Tahun`}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-normal">
                      Kecepatan pengembalian modal investasi awal melalui akumulasi laba bersih usaha.
                    </p>
                  </div>
                </div>

                {/* Progress Timeline on breaking even */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase font-mono block">Timeline Titik Impas (Break-even Progress)</span>
                  <div className="w-full h-3 bg-slate-850 rounded-full overflow-hidden relative">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, (3 / (simplePaybackYears > 0 ? simplePaybackYears : 1)) * 100))}%`
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] text-white font-mono font-black">
                      Progress s/d Tahun Ke-3: {Math.min(100, Math.round((3 / (simplePaybackYears > 0 ? simplePaybackYears : 1)) * 100))}% Terlunasi
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] text-slate-500 font-semibold flex items-center gap-1 mt-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {rec.archetype === "personal_sme"
                    ? "Analisis kelayakan UMKM ini didukung margin sehat dan perputaran kas harian yang stabil."
                    : "Analisis payback period di atas mengasumsikan pembayaran termin & penyerapan kuota sesuai kontrak."}
                </span>
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
                      <span className="text-slate-500 font-bold text-[9px] block font-mono">AKHIR TAHUN KE-3</span>
                      <span className="text-[11.5px] font-black text-white">Akumulasi Arus Kas</span>
                    </div>
                    <span className={`font-mono ${pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + pAndLData.yr3.netProfit + (annualDepreciation * 3) - grandTotalCapex > 0 ? "text-emerald-400 text-[13px] font-black" : "text-amber-400"}`}>
                      {formatIDR(pAndLData.yr1.netProfit + pAndLData.yr2.netProfit + pAndLData.yr3.netProfit + (annualDepreciation * 3) - grandTotalCapex)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA NPV &amp; CASH-FLOW MODEL v2.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
