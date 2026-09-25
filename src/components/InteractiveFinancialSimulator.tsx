import React, { useState, useEffect, useMemo } from "react";
import { Download, Table, Edit2, Play, Plus, ChevronLeft, ChevronRight, HelpCircle, TrendingUp, DollarSign, Calculator, Eye, EyeOff, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { ExcelData, exportToExcelFile } from "../utils/excelExporter";
import { getFinancialRecommendations } from "../utils/financialRecommendations";

interface InteractiveFinancialSimulatorProps {
  projectTitle: string;
  division?: string;
  initialCapex?: number;
  salesIncrease?: number;
}

export function InteractiveFinancialSimulator({
  projectTitle,
  division = "Umum",
  initialCapex,
  salesIncrease
}: InteractiveFinancialSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"tamsamsom" | "pl">("tamsamsom");
  const [isSpreadsheetVisible, setIsSpreadsheetVisible] = useState<boolean>(false);

  // Retrieve project-specific archetype recommendations
  const rec = useMemo(() => getFinancialRecommendations(projectTitle), [projectTitle]);

  // Interactive finance variables
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

  // Sync state whenever project title changes
  useEffect(() => {
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
  }, [projectTitle]);

  // Selected cell state for simulation
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string; formula: string; id?: string }>({
    row: 6,
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

  // Calculations
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
  const netCashFlowY1 = netProfitY1 - totalCapex;
  const netCashFlowY2 = netProfitY2;
  const netCashFlowY3 = netProfitY3;

  const endCashY1 = netCashFlowY1;
  const endCashY2 = endCashY1 + netCashFlowY2;
  const endCashY3 = endCashY2 + netCashFlowY3;

  // Payback Period (Tahun)
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

  const handleResetToStandard = () => {
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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-sans text-slate-100">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
            <Table className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PRAMA SPREADSHEET ENGINE
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                ARKETIPE: {rec.archetypeLabel.toUpperCase()}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SKALA: {rec.scaleCategory.toUpperCase()}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                SEKTOR: {rec.sectorTag}
              </span>
            </div>
            <h4 className="text-sm md:text-base font-black uppercase text-white truncate max-w-xl">
              Evaluasi Finansial &amp; Simulator Excel: {projectTitle}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleResetToStandard}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10.5px] font-black px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-slate-700"
            title="Kembalikan nilai ke angka standar rekomendasi"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Rekomendasi</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpreadsheetVisible(!isSpreadsheetVisible)}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-emerald-500/30"
          >
            {isSpreadsheetVisible ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Tutup Grid Excel</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Buka Grid Excel</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-95 cursor-pointer border-none"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh Excel (.xls)</span>
          </button>
        </div>
      </div>

      {/* SPREADSHEET VIEW TOGGLED */}
      {isSpreadsheetVisible && (
        <div className="bg-slate-950 border-b border-slate-800">
          {/* TAB BUTTONS */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("tamsamsom")}
                className={`px-3 py-1 text-[10.5px] font-black rounded-lg transition cursor-pointer ${
                  activeTab === "tamsamsom" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                1. Lembar TAM SAM SOM &amp; Kelayakan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pl")}
                className={`px-3 py-1 text-[10.5px] font-black rounded-lg transition cursor-pointer ${
                  activeTab === "pl" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                2. Lembar P&amp;L &amp; Cash Flow (3 Tahun)
              </button>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:block">
              ✓ Seragam 100% dengan Output Finansial Dashboard
            </div>
          </div>

          {/* FORMULA BAR */}
          <div className="bg-slate-900 border-b border-slate-800 py-1.5 px-3 flex items-center gap-2 text-xs font-mono text-slate-300">
            <div className="bg-slate-950 border border-slate-700 px-3 py-0.5 rounded text-center font-bold text-emerald-400 min-w-[50px]">
              {selectedCell.col}{selectedCell.row}
            </div>
            <div className="text-slate-600 select-none">|</div>
            <div className="text-slate-400 italic font-bold select-none text-xs">fx</div>
            
            {selectedCell.id ? (
              <input
                type="text"
                value={selectedCell.formula ? selectedCell.formula : selectedCell.val}
                onChange={(e) => handleFormulaBarChange(e.target.value)}
                className="flex-1 bg-slate-950 border border-emerald-500/50 focus:border-emerald-400 outline-none px-2.5 py-0.5 rounded font-mono text-emerald-300 text-xs"
                placeholder="Edit nilai estimasi sel di sini..."
              />
            ) : (
              <div className="flex-1 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded text-left truncate text-slate-400 font-mono text-xs">
                {selectedCell.formula ? selectedCell.formula : selectedCell.val}
              </div>
            )}
          </div>

          {/* SPREADSHEET TABLE */}
          <div className="overflow-x-auto p-2 bg-slate-950 text-slate-200">
            <table className="border-collapse table-fixed w-full min-w-[880px] text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-mono text-[9px]">
                  <th className="w-8 border border-slate-800 text-center py-1"></th>
                  <th className="w-12 border border-slate-800 text-center">A</th>
                  <th className="w-56 border border-slate-800 text-center">B</th>
                  <th className="w-72 border border-slate-800 text-center">C</th>
                  <th className="w-44 border border-slate-800 text-center">D</th>
                  <th className="w-44 border border-slate-800 text-center">E</th>
                  <th className="w-44 border border-slate-800 text-center">F</th>
                </tr>
              </thead>

              {activeTab === "tamsamsom" ? (
                <tbody>
                  <tr className="h-6">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">1</td>
                    <td className="border border-slate-900"></td>
                    <td colSpan={5} className="font-black text-emerald-400 text-xs pl-2 text-left uppercase">
                      ESTIMASI KELAYAKAN PASAR: {projectTitle.toUpperCase()}
                    </td>
                  </tr>
                  <tr className="h-5">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">2</td>
                    <td className="border border-slate-900"></td>
                    <td colSpan={5} className="italic text-slate-400 pl-2 text-left text-[10px]">
                      Arketipe: {rec.archetypeLabel} | Sektor: {rec.sectorTag} | Nilai Estimasi Pasar
                    </td>
                  </tr>
                  <tr className="h-4">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">3</td>
                    <td colSpan={6} className="border border-slate-900"></td>
                  </tr>

                  {/* TAM */}
                  <tr className="hover:bg-slate-900/50 h-7" onClick={() => setSelectedCell({row: 4, col: "D", val: tam.toString(), formula: "", id: "tam" })}>
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">4</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 font-bold text-white text-left">TAM (Total Addressable Market)</td>
                    <td className="border border-slate-800 px-2 text-slate-400 text-left text-[10px]">{rec.tamDesc}</td>
                    <td className="border border-slate-800 p-0 text-right bg-slate-900">
                      <input 
                        type="number"
                        value={tam}
                        onFocus={() => setSelectedCell({row: 4, col: "D", val: tam.toString(), formula: "", id: "tam" })}
                        onChange={(e) => setTam(Number(e.target.value))}
                        className="w-full h-full text-right outline-none border-none px-2 text-xs font-mono font-bold text-emerald-400 bg-transparent"
                      />
                    </td>
                    <td colSpan={2} className="border border-slate-850 bg-slate-950"></td>
                  </tr>

                  {/* SAM */}
                  <tr className="hover:bg-slate-900/50 h-7" onClick={() => setSelectedCell({row: 5, col: "D", val: sam.toString(), formula: "", id: "sam" })}>
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">5</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 font-bold text-white text-left">SAM (Serviceable Addressable Market)</td>
                    <td className="border border-slate-800 px-2 text-slate-400 text-left text-[10px]">{rec.samDesc}</td>
                    <td className="border border-slate-800 p-0 text-right bg-slate-900">
                      <input 
                        type="number"
                        value={sam}
                        onFocus={() => setSelectedCell({row: 5, col: "D", val: sam.toString(), formula: "", id: "sam" })}
                        onChange={(e) => setSam(Number(e.target.value))}
                        className="w-full h-full text-right outline-none border-none px-2 text-xs font-mono font-bold text-emerald-400 bg-transparent"
                      />
                    </td>
                    <td colSpan={2} className="border border-slate-850 bg-slate-950"></td>
                  </tr>

                  {/* SOM */}
                  <tr className="hover:bg-slate-900/50 h-7" onClick={() => setSelectedCell({row: 6, col: "D", val: som.toString(), formula: "", id: "som" })}>
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">6</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 font-bold text-white text-left">SOM (Serviceable Obtainable Market)</td>
                    <td className="border border-slate-800 px-2 text-slate-400 text-left text-[10px]">{rec.somDesc}</td>
                    <td className="border border-slate-800 p-0 text-right bg-slate-900">
                      <input 
                        type="number"
                        value={som}
                        onFocus={() => setSelectedCell({row: 6, col: "D", val: som.toString(), formula: "", id: "som" })}
                        onChange={(e) => setSom(Number(e.target.value))}
                        className="w-full h-full text-right outline-none border-none px-2 text-xs font-mono font-bold text-emerald-400 bg-transparent"
                      />
                    </td>
                    <td colSpan={2} className="border border-slate-850 bg-slate-950"></td>
                  </tr>

                  {/* Summary Rows */}
                  <tr className="h-6 font-bold bg-slate-900 text-slate-300">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">7</td>
                    <td className="border border-slate-800"></td>
                    <td colSpan={2} className="border border-slate-800 px-2 text-left">Total Alokasi Investasi (CAPEX)</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-white">Rp {formatIDR(totalCapex)}</td>
                    <td colSpan={2} className="border border-slate-800 px-2 text-emerald-400 text-left text-[10px]">Sesuai Skala Bisnis</td>
                  </tr>
                  <tr className="h-6 font-bold bg-slate-900 text-slate-300">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">8</td>
                    <td className="border border-slate-800"></td>
                    <td colSpan={2} className="border border-slate-800 px-2 text-left">Estimasi Payback Period</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">{paybackPeriodVal.toFixed(1)} Tahun</td>
                    <td colSpan={2} className="border border-slate-800 px-2 text-cyan-400 text-left text-[10px]">Layak Investasi (&lt; 3 Tahun)</td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {/* P&L */}
                  <tr className="h-6 bg-slate-900 text-white font-bold">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">1</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 text-left">Item Laporan Keuangan (Estimasi)</td>
                    <td className="border border-slate-800 px-2 text-right">Tahun 1 (IDR)</td>
                    <td className="border border-slate-800 px-2 text-right">Tahun 2 (IDR)</td>
                    <td className="border border-slate-800 px-2 text-right">Tahun 3 (IDR)</td>
                    <td className="border border-slate-800"></td>
                  </tr>

                  {/* Revenue */}
                  <tr className="hover:bg-slate-900/50 h-7 font-black">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">2</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 text-left text-white">PENDAPATAN USAHA (REVENUE)</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(revenueY1)}</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(revenueY2)}</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(revenueY3)}</td>
                    <td className="border border-slate-850"></td>
                  </tr>

                  {/* OPEX */}
                  <tr className="hover:bg-slate-900/50 h-7 font-semibold text-slate-300">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">3</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 text-left">Total Biaya Operasional (OPEX)</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-red-400">(Rp {formatIDR(totalOpexY1)})</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-red-400">(Rp {formatIDR(totalOpexY2)})</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-red-400">(Rp {formatIDR(totalOpexY3)})</td>
                    <td className="border border-slate-850"></td>
                  </tr>

                  {/* Net Profit */}
                  <tr className="hover:bg-slate-900/50 h-7 font-black bg-emerald-500/10">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">4</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 text-left text-emerald-300">LABA BERSIH ESTIMASI (NET PROFIT)</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(netProfitY1)}</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(netProfitY2)}</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(netProfitY3)}</td>
                    <td className="border border-slate-850"></td>
                  </tr>

                  {/* Cumulative Cash Flow */}
                  <tr className="hover:bg-slate-900/50 h-7 font-black bg-cyan-500/10">
                    <td className="bg-slate-900 text-center border border-slate-800 font-mono text-slate-500 text-[9px]">5</td>
                    <td className="border border-slate-800"></td>
                    <td className="border border-slate-800 px-2 text-left text-cyan-300">SALDO KAS AKHIR KUMULATIF</td>
                    <td className={`border border-slate-800 px-2 text-right font-mono ${endCashY1 >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>Rp {formatIDR(endCashY1)}</td>
                    <td className={`border border-slate-800 px-2 text-right font-mono ${endCashY2 >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>Rp {formatIDR(endCashY2)}</td>
                    <td className="border border-slate-800 px-2 text-right font-mono text-emerald-400">Rp {formatIDR(endCashY3)}</td>
                    <td className="border border-slate-850"></td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      )}

      {/* DETAILED EXPLANATIONS & METHODOLOGY BREAKDOWN */}
      <div className="p-6 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-emerald-400" />
          <h5 className="font-black text-white text-sm uppercase tracking-wider">
            Penjelasan Metodologi &amp; Angka Estimasi Finansial
          </h5>
          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
            ESTIMASI TERUKUR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          {/* Box 1: Market & Revenue Explanation */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4.5 space-y-3">
            <h6 className="font-black text-emerald-400 uppercase text-xs flex items-center gap-1.5 font-mono">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              1. Penjelasan Estimasi Pasar &amp; Pendapatan
            </h6>
            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <p>
                <strong className="text-white block">• Ukuran Pasar (TAM, SAM, SOM):</strong>
                Nilai TAM (<span className="text-emerald-400 font-mono font-bold">Rp {formatIDR(tam)}</span>) adalah estimasi total potensi kebutuhan industri di wilayah target. Target SOM riil (<span className="text-emerald-400 font-mono font-bold">Rp {formatIDR(som)}</span>) disesuaikan dengan kapasitas operasional <strong>{rec.archetypeLabel}</strong>.
              </p>
              <p>
                <strong className="text-white block">• Proyeksi Pendapatan (Revenue):</strong>
                Tahun pertama diproyeksikan sebesar <span className="text-white font-mono font-bold">Rp {formatIDR(revenueY1)}</span> dengan asumsi pertumbuhan bertahap ke Tahun ke-2 (<span className="text-emerald-400 font-mono font-bold">Rp {formatIDR(revenueY2)}</span>) dan Tahun ke-3 (<span className="text-emerald-400 font-mono font-bold">Rp {formatIDR(revenueY3)}</span>).
              </p>
            </div>
          </div>

          {/* Box 2: CAPEX, OPEX & Payback Explanation */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4.5 space-y-3">
            <h6 className="font-black text-cyan-400 uppercase text-xs flex items-center gap-1.5 font-mono">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              2. Penjelasan Estimasi CAPEX, OPEX &amp; Payback
            </h6>
            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <p>
                <strong className="text-white block">• Alokasi Investasi Awal (CAPEX):</strong>
                Total modal <span className="text-white font-mono font-bold">Rp {formatIDR(totalCapex)}</span> mencakup <strong>{rec.assetName}</strong> (<span className="text-slate-300 font-mono">Rp {formatIDR(capex1)}</span>), <strong>{rec.capexSecondary1Name}</strong> (<span className="text-slate-300 font-mono">Rp {formatIDR(capex2)}</span>), serta fasilitas &amp; legalitas.
              </p>
              <p>
                <strong className="text-white block">• Payback Period &amp; Margin Laba:</strong>
                Estimasi titik impas tercapai dalam waktu <span className="text-emerald-400 font-mono font-bold">{paybackPeriodVal.toFixed(1)} Tahun</span> dengan rata-rata Net Profit Margin sebesar <span className="text-cyan-400 font-mono font-bold">{averageNpm.toFixed(1)}%</span>, menunjukkan kelayakan bisnis yang sangat sehat dan prospektif.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer / Note Footer */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Seluruh kalkulasi finansial di atas telah disinkronkan seragam antara dashboard UI, dokumen laporan, dan ekspor spreadsheet Microsoft Excel.
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[9px]">PRAMA UNIFIED ENGINE v2.5</span>
        </div>
      </div>

    </div>
  );
}
