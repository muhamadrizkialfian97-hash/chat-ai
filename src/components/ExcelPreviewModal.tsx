import React, { useState, useEffect, useMemo } from "react";
import { Download, Table, X, Edit2, Play, Plus, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";
import { ExcelData, exportToExcelFile } from "../utils/excelExporter";
import { getFinancialRecommendations } from "../utils/financialRecommendations";

interface ExcelPreviewModalProps {
  projectTitle: string;
  division?: string;
  isOpen: boolean;
  onClose: () => void;
  initialCapex?: number; // fallback values in millions
  annualSavings?: number;
  salesIncrease?: number;
}

export function ExcelPreviewModal({
  projectTitle,
  division = "Umum",
  isOpen,
  onClose,
  initialCapex,
  annualSavings,
  salesIncrease
}: ExcelPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"tamsamsom" | "pl">("tamsamsom");
  
  // Retrieve standard financial recommendation for current project title
  const rec = useMemo(() => getFinancialRecommendations(projectTitle), [projectTitle]);

  // Interactive finance variables populated with recommendation values
  const [tam, setTam] = useState<number>(rec.tam);
  const [sam, setSam] = useState<number>(rec.sam);
  const [som, setSom] = useState<number>(rec.som);

  // Dynamic Capex components
  const [capex1, setCapex1] = useState<number>(rec.capexAssetCount * rec.capexAssetPrice);
  const [capex2, setCapex2] = useState<number>(rec.capexSecondary1Amount);
  const [capex3, setCapex3] = useState<number>(rec.capexSecondary2Amount);
  const [capex4, setCapex4] = useState<number>(rec.capexSecondary3Amount);

  // Year 1-3 Revenue Projections
  const [revenueY1, setRevenueY1] = useState<number>(rec.revenueY1);
  const [revenueY2, setRevenueY2] = useState<number>(rec.revenueY2);
  const [revenueY3, setRevenueY3] = useState<number>(rec.revenueY3);

  // Year 1-3 OPEX components
  const [opex1Y1, setOpex1Y1] = useState<number>(rec.opex1Amount * 12);
  const [opex1Y2, setOpex1Y2] = useState<number>(Math.round(rec.opex1Amount * 12 * 1.1));
  const [opex1Y3, setOpex1Y3] = useState<number>(Math.round(rec.opex1Amount * 12 * 1.2));

  const [opex2Y1, setOpex2Y1] = useState<number>(rec.opex2Amount * 12);
  const [opex2Y2, setOpex2Y2] = useState<number>(Math.round(rec.opex2Amount * 12 * 1.08));
  const [opex2Y3, setOpex2Y3] = useState<number>(Math.round(rec.opex2Amount * 12 * 1.15));

  const [opex3Y1, setOpex3Y1] = useState<number>(rec.opex3Amount * 12);
  const [opex3Y2, setOpex3Y2] = useState<number>(Math.round(rec.opex3Amount * 12 * 1.08));
  const [opex3Y3, setOpex3Y3] = useState<number>(Math.round(rec.opex3Amount * 12 * 1.15));

  const [opex4Y1, setOpex4Y1] = useState<number>(rec.opex4Amount * 12);
  const [opex4Y2, setOpex4Y2] = useState<number>(Math.round(rec.opex4Amount * 12 * 1.05));
  const [opex4Y3, setOpex4Y3] = useState<number>(Math.round(rec.opex4Amount * 12 * 1.1));

  // Reset to current recommendation values on open or project title update
  useEffect(() => {
    if (isOpen) {
      const r = getFinancialRecommendations(projectTitle);
      setTam(r.tam);
      setSam(r.sam);
      setSom(r.som);

      setCapex1(r.capexAssetCount * r.capexAssetPrice);
      setCapex2(r.capexSecondary1Amount);
      setCapex3(r.capexSecondary2Amount);
      setCapex4(r.capexSecondary3Amount);

      setRevenueY1(r.revenueY1);
      setRevenueY2(r.revenueY2);
      setRevenueY3(r.revenueY3);

      setOpex1Y1(r.opex1Amount * 12);
      setOpex1Y2(Math.round(r.opex1Amount * 12 * 1.1));
      setOpex1Y3(Math.round(r.opex1Amount * 12 * 1.2));

      setOpex2Y1(r.opex2Amount * 12);
      setOpex2Y2(Math.round(r.opex2Amount * 12 * 1.08));
      setOpex2Y3(Math.round(r.opex2Amount * 12 * 1.15));

      setOpex3Y1(r.opex3Amount * 12);
      setOpex3Y2(Math.round(r.opex3Amount * 12 * 1.08));
      setOpex3Y3(Math.round(r.opex3Amount * 12 * 1.15));

      setOpex4Y1(r.opex4Amount * 12);
      setOpex4Y2(Math.round(r.opex4Amount * 12 * 1.05));
      setOpex4Y3(Math.round(r.opex4Amount * 12 * 1.1));
    }
  }, [isOpen, projectTitle]);

  // Selected cell state for simulation
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string; formula: string; id?: string }>({
    row: 7,
    col: "D",
    val: rec.tam.toString(),
    formula: "",
    id: "tam"
  });

  const handleFormulaBarChange = (newValStr: string) => {
    setSelectedCell(prev => ({ ...prev, val: newValStr }));
    const newVal = Number(newValStr) || 0;
    
    switch (selectedCell.id) {
      case "tam": setTam(newVal); break;
      case "sam": setSam(newVal); break;
      case "som": setSom(newVal); break;
      case "capex1": setCapex1(newVal); break;
      case "capex2": setCapex2(newVal); break;
      case "capex3": setCapex3(newVal); break;
      case "capex4": setCapex4(newVal); break;
      case "revenueY1": setRevenueY1(newVal); break;
      case "revenueY2": setRevenueY2(newVal); break;
      case "revenueY3": setRevenueY3(newVal); break;
      case "opex1Y1": setOpex1Y1(newVal); break;
      case "opex1Y2": setOpex1Y2(newVal); break;
      case "opex1Y3": setOpex1Y3(newVal); break;
      case "opex2Y1": setOpex2Y1(newVal); break;
      case "opex2Y2": setOpex2Y2(newVal); break;
      case "opex2Y3": setOpex2Y3(newVal); break;
      case "opex3Y1": setOpex3Y1(newVal); break;
      case "opex3Y2": setOpex3Y2(newVal); break;
      case "opex3Y3": setOpex3Y3(newVal); break;
      case "opex4Y1": setOpex4Y1(newVal); break;
      case "opex4Y2": setOpex4Y2(newVal); break;
      case "opex4Y3": setOpex4Y3(newVal); break;
      default: break;
    }
  };

  if (!isOpen) return null;

  // Calculators
  const totalCapex = capex1 + capex2 + capex3 + capex4;

  // OPEX Totals
  const totalOpexY1 = opex1Y1 + opex2Y1 + opex3Y1 + opex4Y1;
  const totalOpexY2 = opex1Y2 + opex2Y2 + opex3Y2 + opex4Y2;
  const totalOpexY3 = opex1Y3 + opex2Y3 + opex3Y3 + opex4Y3;

  // Net Profit
  const netProfitY1 = revenueY1 - totalOpexY1;
  const netProfitY2 = revenueY2 - totalOpexY2;
  const netProfitY3 = revenueY3 - totalOpexY3;

  // Net Profit Margin
  const npmY1 = revenueY1 > 0 ? (netProfitY1 / revenueY1) * 100 : 0;
  const npmY2 = revenueY2 > 0 ? (netProfitY2 / revenueY2) * 100 : 0;
  const npmY3 = revenueY3 > 0 ? (netProfitY3 / revenueY3) * 100 : 0;
  const averageNpm = (npmY1 + npmY2 + npmY3) / 3;

  // Cash Flows
  const cashInY1 = netProfitY1;
  const cashInY2 = netProfitY2;
  const cashInY3 = netProfitY3;

  const cashOutY1 = -totalCapex;
  const cashOutY2 = 0;
  const cashOutY3 = 0;

  const netCashFlowY1 = cashInY1 + cashOutY1;
  const netCashFlowY2 = cashInY2 + cashOutY2;
  const netCashFlowY3 = cashInY3 + cashOutY3;

  const endCashY1 = netCashFlowY1;
  const endCashY2 = endCashY1 + netCashFlowY2;
  const endCashY3 = endCashY2 + netCashFlowY3;

  // Payback Period
  const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
  const paybackPeriodVal = avgNetProfit > 0 ? totalCapex / avgNetProfit : 0;

  const formatIDR = (num: number) => {
    return Math.round(num).toLocaleString("id-ID");
  };

  const handleDownload = () => {
    const data: ExcelData = {
      projectTitle,
      division,
      archetypeLabel: rec.archetypeLabel,
      sectorTag: rec.sectorTag,
      tamValue: tam,
      samValue: sam,
      somValue: som,
      tamDesc: rec.tamDesc,
      samDesc: rec.samDesc,
      somDesc: rec.somDesc,
      capexTrucks: capex1,
      capexIT: capex2,
      capexGudang: capex3,
      capexIzin: capex4,
      capex1Label: rec.assetName,
      capex2Label: rec.capexSecondary1Name,
      capex3Label: rec.capexSecondary2Name,
      capex4Label: rec.capexSecondary3Name,
      revenueY1,
      revenueY2,
      revenueY3,
      gajiY1: opex1Y1, gajiY2: opex1Y2, gajiY3: opex1Y3,
      bbmY1: opex2Y1, bbmY2: opex2Y2, bbmY3: opex2Y3,
      maintY1: opex3Y1, maintY2: opex3Y2, maintY3: opex3Y3,
      sewaY1: opex4Y1, sewaY2: opex4Y2, sewaY3: opex4Y3,
      opex1Label: rec.opex1Name,
      opex2Label: rec.opex2Name,
      opex3Label: rec.opex3Name,
      opex4Label: rec.opex4Name
    };
    exportToExcelFile(data);
  };

  const handleResetToDashboard = () => {
    const r = getFinancialRecommendations(projectTitle);
    setTam(r.tam);
    setSam(r.sam);
    setSom(r.som);

    setCapex1(r.capexAssetCount * r.capexAssetPrice);
    setCapex2(r.capexSecondary1Amount);
    setCapex3(r.capexSecondary2Amount);
    setCapex4(r.capexSecondary3Amount);

    setRevenueY1(r.revenueY1);
    setRevenueY2(r.revenueY2);
    setRevenueY3(r.revenueY3);

    setOpex1Y1(r.opex1Amount * 12);
    setOpex1Y2(Math.round(r.opex1Amount * 12 * 1.1));
    setOpex1Y3(Math.round(r.opex1Amount * 12 * 1.2));

    setOpex2Y1(r.opex2Amount * 12);
    setOpex2Y2(Math.round(r.opex2Amount * 12 * 1.08));
    setOpex2Y3(Math.round(r.opex2Amount * 12 * 1.15));

    setOpex3Y1(r.opex3Amount * 12);
    setOpex3Y2(Math.round(r.opex3Amount * 12 * 1.08));
    setOpex3Y3(Math.round(r.opex3Amount * 12 * 1.15));

    setOpex4Y1(r.opex4Amount * 12);
    setOpex4Y2(Math.round(r.opex4Amount * 12 * 1.05));
    setOpex4Y3(Math.round(r.opex4Amount * 12 * 1.1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#f8fafc] text-slate-800 rounded-2xl w-full max-w-7xl h-[92vh] border border-slate-300 shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* TOP CONTROL PANEL BAR */}
        <div className="bg-[#107c41] text-white px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#107c41] p-2 rounded-xl shadow-sm">
              <Table className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-100 font-mono bg-white/10 px-2 py-0.5 rounded">
                  EXCEL SPREADSHEET ENGINE
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-200 font-mono">
                  ARKETIPE: {rec.archetypeLabel.toUpperCase()}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-200 font-mono bg-cyan-900/40 px-2 py-0.5 rounded border border-cyan-400/30">
                  SKALA: {rec.scaleCategory.toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-extrabold uppercase truncate max-w-xl mt-0.5 text-white">
                Simulator Kelayakan &amp; Ekspor Excel: {projectTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetToDashboard}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition active:scale-97 cursor-pointer border border-emerald-600/50"
              title="Sinkronkan ulang seluruh angka dengan rekomendasi dashboard"
            >
              <span>🔄 Sinkronkan Data Dashboard</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="bg-white text-[#107c41] hover:bg-emerald-50 text-[11px] font-black px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-97 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Unduh File Excel (.xls)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-emerald-950/60 hover:bg-emerald-950 text-white text-[11px] font-bold px-3 py-2 rounded-lg transition active:scale-97 cursor-pointer border border-emerald-900/60"
            >
              Tutup ✕
            </button>
          </div>
        </div>

        {/* RIBBON ACTIONS PRESETS BAR */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="font-bold text-[#107c41] text-[10px] font-mono">FILE:</span>
              <span className="text-[10px] font-bold text-slate-800">ESTIMASI_KELAYAKAN_{rec.archetype.toUpperCase()}.xlsx</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Status Sinkronisasi:</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Angka Estimasi 100% Seragam dengan UI Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("tamsamsom")}
              className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition ${activeTab === "tamsamsom" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              1. Lembar TAM SAM SOM
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pl")}
              className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition ${activeTab === "pl" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              2. Lembar P&amp;L &amp; Cash Flow
            </button>
          </div>
        </div>

        {/* EXCEL FORMULA BAR */}
        <div className="bg-[#f1f5f9] border-b border-slate-300 py-1.5 px-3 flex items-center gap-1.5 text-xs text-slate-700 font-mono shrink-0">
          {/* Cell Index Indicator */}
          <div className="bg-white border border-slate-300 px-3 py-1 rounded text-center font-bold text-[#107c41] min-w-[50px] shadow-sm">
            {selectedCell.col}{selectedCell.row}
          </div>
          <div className="text-slate-400 px-1 font-sans text-lg">|</div>
          <div className="text-slate-500 italic font-bold select-none text-sm font-sans mr-1">
            fx
          </div>
          {/* Formula value input */}
          {selectedCell.id ? (
            <input
              type="text"
              value={selectedCell.formula ? selectedCell.formula : selectedCell.val}
              onChange={(e) => handleFormulaBarChange(e.target.value)}
              className="flex-1 bg-white border border-emerald-300 focus:ring-1 focus:ring-emerald-500 outline-none px-3 py-1 rounded shadow-sm text-left font-mono text-slate-800 text-xs"
              placeholder="Edit nilai estimasi sel di sini..."
            />
          ) : (
            <div className="flex-1 bg-slate-100 border border-slate-200 px-3 py-1 rounded shadow-sm text-left truncate text-slate-500 font-mono text-xs">
              {selectedCell.formula ? selectedCell.formula : selectedCell.val}
            </div>
          )}
        </div>

        {/* EXCEL GRID CONTENT */}
        <div className="flex-grow overflow-auto bg-white p-3 flex flex-col relative select-none">
          <table className="border-collapse table-fixed w-full min-w-[1050px] text-[11px] text-slate-800 font-sans">
            <thead>
              <tr className="bg-[#f1f5f9]">
                <th className="w-10 border border-slate-300 text-center py-1 font-normal font-mono text-slate-500"></th>
                <th className="w-12 border border-slate-300 text-center font-normal font-mono text-slate-500">A</th>
                <th className="w-260 border border-slate-300 text-center font-normal font-mono text-slate-500">B</th>
                <th className="w-420 border border-slate-300 text-center font-normal font-mono text-slate-500">C</th>
                <th className="w-180 border border-slate-300 text-center font-normal font-mono text-slate-500">D</th>
                <th className="w-180 border border-slate-300 text-center font-normal font-mono text-slate-500">E</th>
                <th className="w-180 border border-slate-300 text-center font-normal font-mono text-slate-500">F</th>
              </tr>
            </thead>

            {activeTab === "tamsamsom" ? (
              <tbody>
                {/* TAM SAM SOM WORKSHEET */}
                <tr className="h-6">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">1</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-extrabold text-[#107c41] text-sm pl-2 py-1 uppercase text-left">
                    ESTIMASI KELAYAKAN PASAR: {projectTitle.toUpperCase()}
                  </td>
                </tr>
                <tr className="h-5">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">2</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="italic text-slate-500 pl-2 text-left">
                    Arketipe: {rec.archetypeLabel} | Sektor: {rec.sectorTag} | Estimasi Pasar (TAM SAM SOM) &amp; Ringkasan Metrik
                  </td>
                </tr>
                <tr className="h-4">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">3</td>
                  <td colSpan={6} className="border border-slate-100"></td>
                </tr>

                {/* Section A */}
                <tr className="h-6">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">4</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-slate-800 text-xs pl-2 text-left">
                    A. Estimasi Ukuran Pasar (Market Sizing)
                  </td>
                </tr>

                <tr className="bg-[#107c41] text-white font-bold h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">5</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Metrik Estimasi</td>
                  <td className="border border-slate-300 px-3 text-left">Deskripsi &amp; Cakupan Metodologi</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai Estimasi (IDR)</td>
                  <td colSpan={2} className="border border-slate-300"></td>
                </tr>

                {/* TAM */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 6, col: "D", val: tam.toString(), formula: "", id: "tam" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">6</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">TAM (Total Addressable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">{rec.tamDesc}</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={tam}
                      onFocus={() => setSelectedCell({row: 6, col: "D", val: tam.toString(), formula: "", id: "tam" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTam(val);
                        setSelectedCell(prev => prev.row === 6 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* SAM */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "D", val: sam.toString(), formula: "", id: "sam" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">7</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">SAM (Serviceable Addressable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">{rec.samDesc}</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={sam}
                      onFocus={() => setSelectedCell({row: 7, col: "D", val: sam.toString(), formula: "", id: "sam" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSam(val);
                        setSelectedCell(prev => prev.row === 7 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* SOM */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "D", val: som.toString(), formula: "", id: "som" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">8</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">SOM (Serviceable Obtainable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">{rec.somDesc}</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={som}
                      onFocus={() => setSelectedCell({row: 8, col: "D", val: som.toString(), formula: "", id: "som" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSom(val);
                        setSelectedCell(prev => prev.row === 8 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                <tr className="h-5">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">9</td>
                  <td colSpan={6} className="border border-slate-100"></td>
                </tr>

                {/* Section B */}
                <tr className="h-6">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">10</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-slate-800 text-xs pl-2 text-left">
                    B. Ringkasan Kelayakan Proyek (Seragam dengan Dashboard)
                  </td>
                </tr>

                <tr className="bg-[#107c41] text-white font-bold h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">11</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 text-left">Indikator Keuangan</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai Estimasi</td>
                  <td className="border border-slate-300 px-3 text-left">Ambang Batas Kelayakan</td>
                  <td className="border border-slate-300"></td>
                </tr>

                {/* CAPEX Summary */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 12, col: "D", val: totalCapex.toString(), formula: "='2. P&L & Cash Flow'!C10"})}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">12</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 font-bold text-left">Total CAPEX (Investasi Awal)</td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-emerald-800 text-xs">
                    Rp {formatIDR(totalCapex)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Sesuai Alokasi Aset Modal ({rec.archetypeLabel})
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Revenue Y1 Summary */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 13, col: "D", val: revenueY1.toString(), formula: "='2. P&L & Cash Flow'!C13"})}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">13</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 font-bold text-left">Proyeksi Pendapatan (Tahun 1)</td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-emerald-800 text-xs">
                    Rp {formatIDR(revenueY1)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Target SOM minimum terpenuhi
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* NPM Summary */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 14, col: "D", val: averageNpm.toFixed(1) + "%", formula: "=AVERAGE('2. P&L & Cash Flow'!C21:E21)"})}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">14</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 font-bold text-left">Net Profit Margin (Rata-rata)</td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-cyan-800 text-xs">
                    {averageNpm.toFixed(1)}%
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Tingkat Margin Sehat (&gt; 15%)
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Net Cash flow Summary */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 15, col: "D", val: (netCashFlowY1 + netCashFlowY2 + netCashFlowY3).toString(), formula: "=SUM('2. P&L & Cash Flow'!C26:E26)"})}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">15</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 font-bold text-left">Total Arus Kas Bersih (3 Tahun)</td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-emerald-800 text-xs">
                    Rp {formatIDR(netCashFlowY1 + netCashFlowY2 + netCashFlowY3)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Positif Kumulatif
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Payback Period */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 16, col: "D", val: paybackPeriodVal.toFixed(1) + " Tahun", formula: "=C12/AVERAGE('2. P&L & Cash Flow'!C20:E20)"})}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">16</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 font-bold text-left">Estimasi Payback Period (PBP)</td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-black font-mono text-[#107c41] text-xs">
                    {paybackPeriodVal.toFixed(1)} Tahun ({Math.round(paybackPeriodVal * 12)} Bulan)
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Layak Investasi (&lt; 3 Tahun)
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {/* P&L & CASH FLOW WORKSHEET */}
                <tr className="h-6">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">1</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-extrabold text-[#107c41] text-sm pl-2 py-1 uppercase text-left">
                    MODEL PROYEKSI KEUANGAN &amp; CASH FLOW (3 TAHUN)
                  </td>
                </tr>
                <tr className="h-5">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">2</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="italic text-slate-500 pl-2 text-left">
                    Sinkronisasi Seragam Dashboard UI: {projectTitle}
                  </td>
                </tr>
                <tr className="h-4">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">3</td>
                  <td colSpan={6} className="border border-slate-100"></td>
                </tr>

                {/* CAPEX Section */}
                <tr className="h-6">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">4</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-slate-800 text-xs pl-2 text-left">
                    1. ESTIMASI BIAYA INVESTASI MODAL (CAPEX)
                  </td>
                </tr>

                <tr className="bg-[#107c41] text-white font-bold h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">5</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Komponen Investasi Awal</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai Estimasi (IDR)</td>
                  <td colSpan={3} className="border border-slate-300 px-3 text-left">Keterangan Estimasi Aset</td>
                </tr>

                {/* Capex 1 */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 6, col: "C", val: capex1.toString(), formula: "", id: "capex1" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">6</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-semibold">{rec.assetName}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capex1}
                      onFocus={() => setSelectedCell({row: 6, col: "C", val: capex1.toString(), formula: "", id: "capex1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapex1(val);
                        setSelectedCell(prev => prev.row === 6 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 italic text-slate-500 text-left">Aset operasional inti utama ({rec.assetUnitLabel})</td>
                </tr>

                {/* Capex 2 */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "C", val: capex2.toString(), formula: "", id: "capex2" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">7</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-semibold">{rec.capexSecondary1Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capex2}
                      onFocus={() => setSelectedCell({row: 7, col: "C", val: capex2.toString(), formula: "", id: "capex2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapex2(val);
                        setSelectedCell(prev => prev.row === 7 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 italic text-slate-500 text-left">Infrastruktur &amp; Setup Awal</td>
                </tr>

                {/* Capex 3 */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "C", val: capex3.toString(), formula: "", id: "capex3" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">8</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-semibold">{rec.capexSecondary2Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capex3}
                      onFocus={() => setSelectedCell({row: 8, col: "C", val: capex3.toString(), formula: "", id: "capex3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapex3(val);
                        setSelectedCell(prev => prev.row === 8 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 italic text-slate-500 text-left">Fasilitas Tempat &amp; Bangunan</td>
                </tr>

                {/* Capex 4 */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 9, col: "C", val: capex4.toString(), formula: "", id: "capex4" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">9</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-semibold">{rec.capexSecondary3Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capex4}
                      onFocus={() => setSelectedCell({row: 9, col: "C", val: capex4.toString(), formula: "", id: "capex4" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapex4(val);
                        setSelectedCell(prev => prev.row === 9 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 italic text-slate-500 text-left">Modal kerja &amp; legalitas perizinan NIB</td>
                </tr>

                {/* Total Capex */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 10, col: "C", val: totalCapex.toString(), formula: "=SUM(C6:C9)" })}>
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">10</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-slate-900 font-black">TOTAL ESTIMASI CAPEX</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-800 text-xs font-black">
                    Rp {formatIDR(totalCapex)}
                  </td>
                  <td colSpan={3} className="border border-slate-300 px-3 text-slate-600 italic">Total investasi sebelum mulai operasional</td>
                </tr>

                <tr className="h-5">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">11</td>
                  <td colSpan={6} className="border border-slate-100"></td>
                </tr>

                {/* P&L Section */}
                <tr className="bg-[#107c41] text-white font-bold h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">12</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Item Laporan Keuangan (Estimasi)</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 1 (IDR)</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 2 (IDR)</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 3 (IDR)</td>
                  <td className="border border-slate-300"></td>
                </tr>

                {/* Revenue */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">13</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-black text-left text-slate-900">PENDAPATAN USAHA (REVENUE)</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold">
                    <input 
                      type="number"
                      value={revenueY1}
                      onFocus={() => setSelectedCell({row: 13, col: "C", val: revenueY1.toString(), formula: "", id: "revenueY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY1(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold">
                    <input 
                      type="number"
                      value={revenueY2}
                      onFocus={() => setSelectedCell({row: 13, col: "D", val: revenueY2.toString(), formula: "", id: "revenueY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY2(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold">
                    <input 
                      type="number"
                      value={revenueY3}
                      onFocus={() => setSelectedCell({row: 13, col: "E", val: revenueY3.toString(), formula: "", id: "revenueY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY3(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* OPEX Subhead */}
                <tr className="h-6 font-bold bg-slate-50">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">14</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-black text-slate-800">BIAYA OPERASIONAL (OPEX)</td>
                  <td colSpan={3} className="border border-slate-300 bg-slate-50"></td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* OPEX 1 */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">15</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-700">- {rec.opex1Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex1Y1}
                      onChange={(e) => setOpex1Y1(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex1Y2}
                      onChange={(e) => setOpex1Y2(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex1Y3}
                      onChange={(e) => setOpex1Y3(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* OPEX 2 */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">16</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-700">- {rec.opex2Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex2Y1}
                      onChange={(e) => setOpex2Y1(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex2Y2}
                      onChange={(e) => setOpex2Y2(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex2Y3}
                      onChange={(e) => setOpex2Y3(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* OPEX 3 */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">17</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-700">- {rec.opex3Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex3Y1}
                      onChange={(e) => setOpex3Y1(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex3Y2}
                      onChange={(e) => setOpex3Y2(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex3Y3}
                      onChange={(e) => setOpex3Y3(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* OPEX 4 */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">18</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-700">- {rec.opex4Name}</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex4Y1}
                      onChange={(e) => setOpex4Y1(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex4Y2}
                      onChange={(e) => setOpex4Y2(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={opex4Y3}
                      onChange={(e) => setOpex4Y3(Number(e.target.value))}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Total OPEX */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">19</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-slate-900 font-black">TOTAL OPEX TAHUNAN</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 font-bold text-xs">
                    Rp {formatIDR(totalOpexY1)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 font-bold text-xs">
                    Rp {formatIDR(totalOpexY2)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 font-bold text-xs">
                    Rp {formatIDR(totalOpexY3)}
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Net profit */}
                <tr className="hover:bg-slate-50 h-7 font-black bg-emerald-50/50">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">20</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-emerald-900 font-black">LABA BERSIH (NET PROFIT)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700 font-black text-xs">
                    Rp {formatIDR(netProfitY1)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700 font-black text-xs">
                    Rp {formatIDR(netProfitY2)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700 font-black text-xs">
                    Rp {formatIDR(netProfitY3)}
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* NPM */}
                <tr className="hover:bg-slate-50 h-7 font-bold">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">21</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-slate-800">NET PROFIT MARGIN (%)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-cyan-800 font-bold text-xs">
                    {npmY1.toFixed(1)}%
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-cyan-800 font-bold text-xs">
                    {npmY2.toFixed(1)}%
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-cyan-800 font-bold text-xs">
                    {npmY3.toFixed(1)}%
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Cash Flow Section */}
                <tr className="h-6 font-bold bg-slate-50">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">22</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left font-black text-slate-800">ARUS KAS (CASH FLOW)</td>
                  <td colSpan={3} className="border border-slate-300 bg-slate-50"></td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Saldo awal */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">23</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-600">+ Saldo Kas Awal</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-600">Rp 0</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-600">Rp {formatIDR(endCashY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-600">Rp {formatIDR(endCashY2)}</td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* CAPEX outflow */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">24</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-red-600 font-semibold">- Investasi Awal (CAPEX)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-red-600 font-bold">(Rp {formatIDR(totalCapex)})</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-400">Rp 0</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-400">Rp 0</td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Net profit inflow */}
                <tr className="hover:bg-slate-50 h-7">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">25</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-emerald-700 font-semibold">+ Laba Bersih Operasional</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700">Rp {formatIDR(netProfitY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700">Rp {formatIDR(netProfitY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700">Rp {formatIDR(netProfitY3)}</td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Net Cash Flow */}
                <tr className="hover:bg-slate-50 h-7 font-bold">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">26</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-slate-900 font-bold">ARUS KAS BERSIH (NET CASH FLOW)</td>
                  <td className={`border border-slate-300 px-3 text-right font-mono font-bold ${netCashFlowY1 >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Rp {formatIDR(netCashFlowY1)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700 font-bold">
                    Rp {formatIDR(netCashFlowY2)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-700 font-bold">
                    Rp {formatIDR(netCashFlowY3)}
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Ending cash balance */}
                <tr className="hover:bg-slate-50 h-7 font-black bg-blue-50/60">
                  <td className="bg-[#f1f5f9] text-center border border-slate-300 font-mono text-slate-400">27</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-blue-950 font-black">SALDO KAS AKHIR KUMULATIF</td>
                  <td className={`border border-slate-300 px-3 text-right font-mono font-black ${endCashY1 >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                    Rp {formatIDR(endCashY1)}
                  </td>
                  <td className={`border border-slate-300 px-3 text-right font-mono font-black ${endCashY2 >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                    Rp {formatIDR(endCashY2)}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-emerald-800 font-black">
                    Rp {formatIDR(endCashY3)}
                  </td>
                  <td className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* BOTTOM EXPLANATION STATUS BAR */}
        <div className="bg-[#f1f5f9] border-t border-slate-300 px-5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 font-mono text-[10px]">📊 METODOLOGI ESTIMASI:</span>
            <span className="text-[10.5px] text-slate-600">
              Kalkulasi laba rugi dan payback period dihitung otomatis berbasis estimasi operasional realistis arketipe <strong>{rec.archetypeLabel}</strong>.
            </span>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-400">
            PRAMA Live Feasibility Excel Grid v2.5
          </div>
        </div>

      </div>
    </div>
  );
}
