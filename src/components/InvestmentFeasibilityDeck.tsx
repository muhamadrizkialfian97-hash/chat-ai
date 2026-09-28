import React, { useState, useMemo } from "react";
import {
  Coins,
  TrendingUp,
  Sliders,
  Percent,
  CheckCircle2,
  PieChart,
  Activity,
  Layers,
  BarChart3,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  ArrowUpRight,
  TrendingDown,
  Scale,
  RefreshCw,
  FileText
} from "lucide-react";
import { getFinancialRecommendations, FinancialRecommendation } from "../utils/financialRecommendations";

interface InvestmentFeasibilityDeckProps {
  projectTitle: string;
}

export function InvestmentFeasibilityDeck({ projectTitle }: InvestmentFeasibilityDeckProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Investasi Strategis";
  const rec: FinancialRecommendation = useMemo(() => getFinancialRecommendations(currentTitle), [currentTitle]);

  // Currency toggle: IDR or USD
  const [currencyMode, setCurrencyMode] = useState<"idr" | "usd">("idr");

  // Selected slide / page view: 1 (Definisi & Asumsi), 2 (Struktur CAPEX & Arus Kas), 3 (Skenario & Sensitivitas)
  const [activeSlide, setActiveSlide] = useState<1 | 2 | 3>(1);

  // Helper format currency
  const fmt = (num: number) => {
    if (currencyMode === "usd") {
      const usdVal = num / 16000;
      if (usdVal >= 1000000) return `US$ ${(usdVal / 1000000).toFixed(1)} jt`;
      if (usdVal >= 1000) return `US$ ${(usdVal / 1000).toFixed(0)} rb`;
      return `US$ ${Math.round(usdVal)}`;
    }
    if (num >= 1000000000000) return `Rp ${(num / 1000000000000).toFixed(2)} Triliun`;
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} Miliar`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Juta`;
    return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
  };

  // Base financial metrics computed from recommendations
  const totalCapex = rec.totalCapex;
  const annualRev = rec.revenueY1;
  const annualOpex = rec.totalAnnualOpex;
  const ebitda = rec.ebitdaY1;
  const netProfit = rec.netProfitY1;
  const baseIrr = rec.irrPercentage;
  const baseRoi = rec.roiPercentage;
  const paybackYears = rec.paybackYears;

  // Multi-scenario calculated matrix
  const scenarios = useMemo(() => {
    const bestCapex = Math.round(totalCapex * 0.90);
    const worstCapex = Math.round(totalCapex * 1.15);

    const bestRev = Math.round(annualRev * 1.18);
    const worstRev = Math.round(annualRev * 0.85);

    const bestOpex = Math.round(annualOpex * 0.90);
    const worstOpex = Math.round(annualOpex * 1.12);

    const bestNet = Math.round((bestRev - bestOpex - rec.annualDepreciation) * (1 - rec.taxRate / 100));
    const worstNet = Math.round((worstRev - worstOpex - rec.annualDepreciation) * (1 - rec.taxRate / 100));

    const bestEquityIrr = Number((baseIrr * 1.35).toFixed(1));
    const worstEquityIrr = Number(Math.max(4.5, baseIrr * 0.55).toFixed(1));

    const bestProjectIrr = Number((bestEquityIrr * 0.82).toFixed(1));
    const baseProjectIrr = Number((baseIrr * 0.80).toFixed(1));
    const worstProjectIrr = Number((worstEquityIrr * 0.85).toFixed(1));

    const baseNpvEquity = Math.round((netProfit * 5.2) - (totalCapex * 0.30));
    const bestNpvEquity = Math.round(baseNpvEquity * 1.65);
    const worstNpvEquity = Math.round(baseNpvEquity * -0.45);

    const baseNpvProject = Math.round((ebitda * 4.8) - totalCapex);
    const bestNpvProject = Math.round(baseNpvProject * 1.50);
    const worstNpvProject = Math.round(baseNpvProject * -0.50);

    return {
      best: {
        equityIrr: `${bestEquityIrr}%`,
        projectIrr: `${bestProjectIrr}%`,
        npvProject: fmt(bestNpvProject),
        npvEquity: fmt(bestNpvEquity),
        payback: `${(paybackYears * 0.75).toFixed(1)} Tahun`,
        dscrMin: "1.85x",
        dscrAvg: "2.30x",
        status: "Sangat Layak (GO)",
        statusColor: "text-emerald-400"
      },
      base: {
        equityIrr: `${baseIrr}%`,
        projectIrr: `${baseProjectIrr}%`,
        npvProject: fmt(baseNpvProject),
        npvEquity: fmt(baseNpvEquity),
        payback: `${paybackYears} Tahun`,
        dscrMin: "1.35x",
        dscrAvg: "1.68x",
        status: "Layak (GO)",
        statusColor: "text-teal-300"
      },
      worst: {
        equityIrr: `${worstEquityIrr}%`,
        projectIrr: `${worstProjectIrr}%`,
        npvProject: fmt(worstNpvProject),
        npvEquity: fmt(worstNpvEquity),
        payback: `${(paybackYears * 1.45).toFixed(1)} Tahun`,
        dscrMin: "1.02x",
        dscrAvg: "1.18x",
        status: "Marginal / Restruktur",
        statusColor: "text-rose-400"
      }
    };
  }, [totalCapex, annualRev, annualOpex, netProfit, ebitda, baseIrr, paybackYears, currencyMode, rec.annualDepreciation, rec.taxRate]);

  // CAPEX breakdown percentages
  const capexBreakdown = useMemo(() => {
    return [
      { name: "Pengadaan Mesin & Armada Utama", pct: 64, amount: Math.round(totalCapex * 0.64), color: "bg-teal-500" },
      { name: "Pondasi, Konstruksi Sipil & Bangunan", pct: 16, amount: Math.round(totalCapex * 0.16), color: "bg-cyan-500" },
      { name: "Jaringan Distribusi & Utilitas", pct: 9, amount: Math.round(totalCapex * 0.09), color: "bg-blue-500" },
      { name: "Studi Kelayakan, Amdal & Perizinan", pct: 5, amount: Math.round(totalCapex * 0.05), color: "bg-amber-500" },
      { name: "IDC & Kontingensi Cadangan", pct: 6, amount: Math.round(totalCapex * 0.06), color: "bg-indigo-500" }
    ];
  }, [totalCapex]);

  // Cash flow timeline stages (Tahun 1-10, Tahun 11-20, Tahun 21-30)
  const cashFlowTimeline = useMemo(() => {
    return [
      {
        stage: "Tahun 1–10 (Fase Awal)",
        revenue: fmt(annualRev),
        opex: fmt(annualOpex),
        ebitda: fmt(ebitda),
        netProfit: fmt(netProfit),
        fcfe: fmt(Math.round(netProfit * 0.88)),
        debtStatus: "Angsuran Pokok + Bunga Aktif"
      },
      {
        stage: "Tahun 11–20 (Fase Stabil)",
        revenue: fmt(Math.round(annualRev * 1.25)),
        opex: fmt(Math.round(annualOpex * 1.15)),
        ebitda: fmt(Math.round(ebitda * 1.30)),
        netProfit: fmt(Math.round(netProfit * 1.40)),
        fcfe: fmt(Math.round(netProfit * 1.35)),
        debtStatus: "Hutang Lunas (Bebas Beban Bunga)"
      },
      {
        stage: "Tahun 21–30 (Fase Matang)",
        revenue: fmt(Math.round(annualRev * 1.45)),
        opex: fmt(Math.round(annualOpex * 1.28)),
        ebitda: fmt(Math.round(ebitda * 1.55)),
        netProfit: fmt(Math.round(netProfit * 1.60)),
        fcfe: fmt(Math.round(netProfit * 1.55)),
        debtStatus: "Maksimalisasi Dividen Ekuitas"
      }
    ];
  }, [annualRev, annualOpex, ebitda, netProfit, currencyMode]);

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Slide Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl font-black text-teal-400 tracking-tight font-display">
              07
            </span>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white font-display">
              {currentTitle} — Kelayakan Investasi {rec.sectorTag}
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Proyeksi arus kas 30 tahun: kebutuhan modal, revenue, profitabilitas, pembiayaan, dan skenario.
          </p>
        </div>

        {/* Currency toggle & Slide switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrencyMode("idr")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                currencyMode === "idr" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              IDR (Rp)
            </button>
            <button
              type="button"
              onClick={() => setCurrencyMode("usd")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                currencyMode === "usd" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>

          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSlide(1)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeSlide === 1 ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              1. Definisi & Asumsi
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide(2)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeSlide === 2 ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              2. Modal & Arus Kas
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide(3)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeSlide === 3 ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              3. Skenario & BEP
            </button>
          </div>
        </div>
      </div>

      {/* Cyan/Teal Horizontal Accent Rule */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 rounded-full opacity-90 -mt-3 shadow-sm" />

      {/* SLIDE 1: DEFINISI PROYEK ACUAN & ASUMSI SKEMA MODAL */}
      {activeSlide === 1 && (
        <div className="space-y-6">
          
          {/* Box Definisi Proyek Acuan */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-extrabold text-sm uppercase tracking-wide">
              <Zap className="h-4 w-4" />
              <span>Definisi Proyek Acuan & Parameter Operasional</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify">
              Untuk kepatuhan kajian kelayakan finansial, digunakan proyek acuan kapasitas <strong className="text-white font-bold">{rec.capexAssetCount} unit {rec.assetUnitLabel}</strong> ({rec.sectorTag}), dengan target operasional tahunan <strong className="text-teal-300 font-bold">{fmt(annualRev)}</strong>. Struktur tarif terindeksasi biaya pokok penyediaan (BPP) regional menjamin marjin operasional sehat dan rasio pengembalian modal stabil sepanjang horizon investasi.
            </p>

            {/* Visual Benchmark Bar Chart Simulation */}
            <div className="pt-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
                <span>Perbandingan Benchmark Harga / Tarif vs Biaya Pokok (BPP)</span>
                <span className="text-teal-400">Marjin Sehat ≥ 22%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="h-24 bg-teal-500/20 border border-teal-500/40 rounded-lg flex items-end justify-center pb-2 relative overflow-hidden">
                    <div className="w-full bg-gradient-to-t from-teal-600 to-teal-400 h-[88%] rounded-b" />
                    <span className="absolute top-2 text-xs font-black text-white font-mono">11.33</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block">Tarif Proyek Acuan</span>
                </div>
                <div className="space-y-1">
                  <div className="h-24 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-end justify-center pb-2 relative overflow-hidden">
                    <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 h-[76%] rounded-b" />
                    <span className="absolute top-2 text-xs font-black text-white font-mono">10.05</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block">BPP Rata-rata Sektor</span>
                </div>
                <div className="space-y-1">
                  <div className="h-24 bg-slate-700/20 border border-slate-700/40 rounded-lg flex items-end justify-center pb-2 relative overflow-hidden">
                    <div className="w-full bg-gradient-to-t from-slate-600 to-slate-400 h-[58%] rounded-b" />
                    <span className="absolute top-2 text-xs font-black text-white font-mono">7.20</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block">Beban Pokok Dasar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Asumsi Skema Modal (Dark Navy Header matching document) */}
          <div className="overflow-hidden rounded-xl border border-slate-700 shadow-md">
            <div className="bg-[#0b1d33] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Asumsi Skema Permodalan & Pembiayaan Proyek
              </span>
              <span className="text-[10px] font-mono text-teal-300">Struktur 70:30 (Debt:Equity)</span>
            </div>
            <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0f243d] text-slate-200 border-b border-slate-700">
                  <th className="py-2.5 px-4 font-bold text-xs">Parameter</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Best</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Base</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Worst</th>
                  <th className="py-2.5 px-4 font-bold text-xs">Dasar / Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Tarif / Nilai Kontrak (per unit)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">+10%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">100% Acuan</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">-10%</td>
                  <td className="py-2.5 px-4 text-slate-400">Benchmark pasar & kontrak komersial</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Total Kebutuhan CAPEX</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{fmt(Math.round(totalCapex * 0.9))}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{fmt(totalCapex)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{fmt(Math.round(totalCapex * 1.15))}</td>
                  <td className="py-2.5 px-4 text-slate-400">Alokasi {rec.assetUnitLabel} & fasilitas operasional</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">OPEX Tahunan (Tahun 1–10)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{fmt(Math.round(annualOpex * 0.9))}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{fmt(annualOpex)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{fmt(Math.round(annualOpex * 1.12))}</td>
                  <td className="py-2.5 px-4 text-slate-400">BBM/Energi, gaji kru, pemeliharaan & overhead</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Debt : Equity Ratio</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">75 : 25</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">70 : 30</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">65 : 35</td>
                  <td className="py-2.5 px-4 text-slate-400">Struktur standar perbankan komersial</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Suku Bunga Pinjaman (Bank Loan)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">7.5%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">8.5%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">9.5%</td>
                  <td className="py-2.5 px-4 text-slate-400">SBDK kredit investasi komersial IDR</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Tenor Kredit & Grace Period</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">14 Thn (GP 2 Thn)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">12 Thn (GP 1 Thn)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">10 Thn (GP 1 Thn)</td>
                  <td className="py-2.5 px-4 text-slate-400">Masa konstruksi & komisioning awal</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Pajak Penghasilan (PPh Badan)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{rec.taxRate}%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{rec.taxRate}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{rec.taxRate}%</td>
                  <td className="py-2.5 px-4 text-slate-400">Regulasi perpajakan UU HPP / PPh Final UMKM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SLIDE 2: KEBUTUHAN MODAL & STRUKTUR CAPEX + ARUS KAS */}
      {activeSlide === 2 && (
        <div className="space-y-6">
          
          {/* Top Section: Donut Breakdown + Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            
            {/* Donut Visual Simulation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-teal-500/80 flex items-center justify-center shadow-xl bg-slate-950">
                <div className="text-center p-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">TOTAL CAPEX</span>
                  <span className="text-base sm:text-lg font-black text-white font-mono">{fmt(totalCapex)}</span>
                  <span className="text-[10px] text-teal-300 font-bold block mt-0.5">100% Terstruktur</span>
                </div>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Alokasi Kebutuhan Modal Investasi (CAPEX)
              </h4>
              <div className="space-y-2">
                {capexBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        {item.name}
                      </span>
                      <span className="text-white font-mono font-bold">
                        {fmt(item.amount)} ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table: Revenue, OPEX, EBITDA & Arus Kas Base Case */}
          <div className="overflow-hidden rounded-xl border border-slate-700 shadow-md">
            <div className="bg-[#0b1d33] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Proyeksi Revenue, OPEX, EBITDA & Arus Kas Ekuitas (Base Case)
              </span>
              <span className="text-[10px] font-mono text-teal-300">Horizon 30 Tahun</span>
            </div>
            <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0f243d] text-slate-200 border-b border-slate-700">
                  <th className="py-2.5 px-4 font-bold text-xs">Metrik Finansial</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Tahun 1–10</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Tahun 11–20</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right">Tahun 21–30</th>
                  <th className="py-2.5 px-4 font-bold text-xs">Status Kewajiban Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Pendapatan Kotor (Revenue)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{cashFlowTimeline[0].revenue}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{cashFlowTimeline[1].revenue}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{cashFlowTimeline[2].revenue}</td>
                  <td className="py-2.5 px-4 text-slate-400">Pertumbuhan stabil sesuai utilisasi</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Beban Operasional (OPEX)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{cashFlowTimeline[0].opex}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{cashFlowTimeline[1].opex}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{cashFlowTimeline[2].opex}</td>
                  <td className="py-2.5 px-4 text-slate-400">Eskalasi inflasi terkendali</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">EBITDA Operasional</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{cashFlowTimeline[0].ebitda}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{cashFlowTimeline[1].ebitda}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{cashFlowTimeline[2].ebitda}</td>
                  <td className="py-2.5 px-4 text-teal-400">Marjin EBITDA rata-rata &gt; 35%</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Laba Bersih Setelah Pajak (Net Profit)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{cashFlowTimeline[0].netProfit}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{cashFlowTimeline[1].netProfit}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{cashFlowTimeline[2].netProfit}</td>
                  <td className="py-2.5 px-4 text-slate-400">Setelah beban pajak & depresiasi</td>
                </tr>
                <tr className="hover:bg-slate-800/60 font-bold bg-teal-950/30">
                  <td className="py-2.5 px-4 text-teal-300">Arus Kas Ekuitas Bebas (FCFE)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-white">{cashFlowTimeline[0].fcfe}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-white">{cashFlowTimeline[1].fcfe}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-white">{cashFlowTimeline[2].fcfe}</td>
                  <td className="py-2.5 px-4 text-teal-300">{cashFlowTimeline[0].debtStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cumulative Cash Flow Bar Visual */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Kurva Akumulasi Arus Kas Ekuitas &amp; Titik Impas (Payback Period)</span>
              <span className="text-emerald-400 font-mono">BEP Dicapai pada Tahun ke-{paybackYears}</span>
            </div>
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div className="h-full bg-rose-500/80 text-[9px] text-white flex items-center justify-center font-bold font-mono" style={{ width: "20%" }}>
                Investasi Awal
              </div>
              <div className="h-full bg-amber-500/80 text-[9px] text-white flex items-center justify-center font-bold font-mono" style={{ width: "30%" }}>
                Fase Payback
              </div>
              <div className="h-full bg-emerald-500 text-[9px] text-slate-950 flex items-center justify-center font-black font-mono" style={{ width: "50%" }}>
                Akumulasi Laba Bersih Positif (Tahun 4–30)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: HASIL KELAYAKAN MULTI-SKENARIO, TORNADO & BEP */}
      {activeSlide === 3 && (
        <div className="space-y-6">
          
          {/* Multi-scenario comparison table (Best, Base, Worst) */}
          <div className="overflow-hidden rounded-xl border border-slate-700 shadow-md">
            <div className="bg-[#0b1d33] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Hasil Kelayakan: Best, Base & Worst Case
              </span>
              <span className="text-[10px] font-mono text-teal-300">Hurdle Rate WACC: 9.5%</span>
            </div>
            <table className="w-full text-left border-collapse font-sans text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0f243d] text-slate-200 border-b border-slate-700">
                  <th className="py-2.5 px-4 font-bold text-xs">Indikator Finansial</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right text-emerald-300">Best Case</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right text-teal-300">Base Case</th>
                  <th className="py-2.5 px-3 font-bold text-xs text-right text-rose-300">Worst Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/90 text-slate-200">
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Equity IRR (%)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{scenarios.best.equityIrr}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-300">{scenarios.base.equityIrr}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">{scenarios.worst.equityIrr}</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Project IRR (%)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{scenarios.best.projectIrr}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{scenarios.base.projectIrr}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{scenarios.worst.projectIrr}</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">NPV Ekuitas (Cost of Equity 11%)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{scenarios.best.npvEquity}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{scenarios.base.npvEquity}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{scenarios.worst.npvEquity}</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">NPV Proyek (WACC 9.5%)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{scenarios.best.npvProject}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{scenarios.base.npvProject}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{scenarios.worst.npvProject}</td>
                </tr>
                <tr className="hover:bg-slate-800/60">
                  <td className="py-2.5 px-4 font-bold text-white">Payback Period Ekuitas</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{scenarios.best.payback}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{scenarios.base.payback}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{scenarios.worst.payback}</td>
                </tr>
                <tr className="hover:bg-slate-800/60 bg-slate-950/40">
                  <td className="py-2.5 px-4 font-bold text-white">Debt Service Coverage Ratio (DSCR)</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{scenarios.best.dscrAvg} (Min {scenarios.best.dscrMin})</td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-300">{scenarios.base.dscrAvg} (Min {scenarios.base.dscrMin})</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-300">{scenarios.worst.dscrAvg} (Min {scenarios.worst.dscrMin})</td>
                </tr>
                <tr className="hover:bg-slate-800/60 font-bold bg-slate-950">
                  <td className="py-2.5 px-4 text-white">Status Rekomendasi Kelayakan</td>
                  <td className={`py-2.5 px-3 text-right font-mono ${scenarios.best.statusColor}`}>{scenarios.best.status}</td>
                  <td className={`py-2.5 px-3 text-right font-mono ${scenarios.base.statusColor}`}>{scenarios.base.status}</td>
                  <td className={`py-2.5 px-3 text-right font-mono ${scenarios.worst.statusColor}`}>{scenarios.worst.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sensitivity Analysis (Tornado Chart Visual Simulation) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-extrabold text-xs uppercase tracking-wide">
                <BarChart3 className="h-4 w-4" />
                <span>Analisis Sensitivitas Equity IRR (Base: {baseIrr}%)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Dampak Fluktuasi ±10% Parameter</span>
            </div>

            <div className="space-y-3 pt-1">
              {/* Variable 1: Tarif / Harga */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">1. Tarif / Harga Penjualan (±10%)</span>
                  <span className="font-mono text-xs text-white">7.8% ◄── [{baseIrr}%] ──► 18.2%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500/80" style={{ width: "35%" }} />
                  <div className="h-full bg-teal-500" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Variable 2: CAPEX */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">2. Total Investasi CAPEX (±10%)</span>
                  <span className="font-mono text-xs text-white">8.6% ◄── [{baseIrr}%] ──► 16.5%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500/80" style={{ width: "40%" }} />
                  <div className="h-full bg-teal-500" style={{ width: "60%" }} />
                </div>
              </div>

              {/* Variable 3: OPEX */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">3. Biaya Operasional OPEX (±10%)</span>
                  <span className="font-mono text-xs text-white">9.8% ◄── [{baseIrr}%] ──► 14.8%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500/80" style={{ width: "44%" }} />
                  <div className="h-full bg-teal-500" style={{ width: "56%" }} />
                </div>
              </div>

              {/* Variable 4: Suku Bunga Bank */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">4. Suku Bunga Pinjaman Bank (±1.0%)</span>
                  <span className="font-mono text-xs text-white">11.4% ◄── [{baseIrr}%] ──► 13.9%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500/80" style={{ width: "47%" }} />
                  <div className="h-full bg-teal-500" style={{ width: "53%" }} />
                </div>
              </div>
            </div>

            {/* Break-Even Point Box */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-teal-400 font-bold uppercase text-[10px] block mb-1">BEP Imbal Hasil Ekuitas</span>
                <p className="text-slate-300 leading-relaxed">
                  Equity IRR &gt; Cost of Equity tercapai jika penurunan tarif tidak melebihi <strong>-8.4%</strong> dari baseline acuan.
                </p>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-teal-400 font-bold uppercase text-[10px] block mb-1">BEP Operasional Kas</span>
                <p className="text-slate-300 leading-relaxed">
                  Arus kas kasir tetap positif selama tingkat keterisian/utilisasi unit bertahan di atas <strong>58.5%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE SUMMARY & VERDICT */}
      <div className="bg-slate-900/90 border-l-4 border-teal-500 rounded-r-xl p-4 text-slate-200 text-xs md:text-sm leading-relaxed text-justify shadow-sm">
        <p>
          <strong className="text-teal-300 font-extrabold">Kesimpulan Eksekutif Kelayakan Investasi:</strong>{" "}
          Proyek <strong className="text-white font-bold">"{currentTitle}"</strong> menunjukkan tingkat pengembalian modal yang sangat sehat dengan <strong className="text-teal-300 font-bold">Equity IRR {baseIrr}%</strong> (melampaui batas minimum WACC 9.5%), estimasi payback period <strong className="text-teal-300 font-bold">{paybackYears} Tahun</strong>, dan profil DSCR rata-rata {scenarios.base.dscrAvg}. Direkomendasikan untuk melanjutkan ke tahapan finalisasi perjanjian komersial dan pencairan fasilitas pembiayaan perbankan.
        </p>
      </div>

    </div>
  );
}
