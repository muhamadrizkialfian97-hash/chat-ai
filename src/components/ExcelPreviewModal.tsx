import React, { useState, useEffect } from "react";
import { Download, Table, X, Edit2, Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { ExcelData, exportToExcelFile } from "../utils/excelExporter";

interface ExcelPreviewModalProps {
  projectTitle: string;
  division: string;
  isOpen: boolean;
  onClose: () => void;
  initialCapex?: number; // fallback values
  annualSavings?: number;
  salesIncrease?: number;
}

export function ExcelPreviewModal({
  projectTitle,
  division,
  isOpen,
  onClose,
  initialCapex,
  annualSavings,
  salesIncrease
}: ExcelPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"tamsamsom" | "pl">("tamsamsom");
  
  // Interactive finance variables populated with template default values
  const [tam, setTam] = useState<number>(500000000000);
  const [sam, setSam] = useState<number>(75000000000);
  const [som, setSom] = useState<number>(15000000000);

  // Capex components
  const [capexTrucks, setCapexTrucks] = useState<number>(450000000);
  const [capexIT, setCapexIT] = useState<number>(50000000);
  const [capexGudang, setCapexGudang] = useState<number>(30000000);
  const [capexIzin, setCapexIzin] = useState<number>(20000000);

  // Year 1-3 Revenue Projections
  const [revenueY1, setRevenueY1] = useState<number>(1200000000);
  const [revenueY2, setRevenueY2] = useState<number>(1500000000);
  const [revenueY3, setRevenueY3] = useState<number>(1800000000);

  // Year 1-3 OPEX components
  const [gajiY1, setGajiY1] = useState<number>(240000000);
  const [gajiY2, setGajiY2] = useState<number>(264000000);
  const [gajiY3, setGajiY3] = useState<number>(290400000);

  const [bbmY1, setBbmY1] = useState<number>(360000000);
  const [bbmY2, setBbmY2] = useState<number>(432000000);
  const [bbmY3, setBbmY3] = useState<number>(496800000);

  const [maintY1, setMaintY1] = useState<number>(40000000);
  const [maintY2, setMaintY2] = useState<number>(50000000);
  const [maintY3, setMaintY3] = useState<number>(60000000);

  const [sewaY1, setSewaY1] = useState<number>(120000000);
  const [sewaY2, setSewaY2] = useState<number>(125000000);
  const [sewaY3, setSewaY3] = useState<number>(130000000);

  useEffect(() => {
    if (isOpen) {
      if (initialCapex && initialCapex > 0) {
        // Convert Juta to Full IDR
        const capexFull = initialCapex * 1000000;
        setCapexTrucks(Math.round(capexFull * 0.70));
        setCapexIT(Math.round(capexFull * 0.15));
        setCapexGudang(Math.round(capexFull * 0.10));
        setCapexIzin(Math.round(capexFull * 0.05));
      }
      if (salesIncrease && salesIncrease > 0) {
        const revFull = salesIncrease * 1000000;
        setRevenueY1(revFull);
        setRevenueY2(Math.round(revFull * 1.20));
        setRevenueY3(Math.round(revFull * 1.45));
      }
      if (salesIncrease && salesIncrease > 0) {
        const estSom = salesIncrease * 10 * 1000000; // SOM is 10x Year 1 sales
        setSom(estSom);
        setSam(estSom * 5);
        setTam(estSom * 25);
      }
    }
  }, [isOpen, initialCapex, salesIncrease, annualSavings]);

  // Selected cell state for simulation
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string; formula: string; id?: string }>({
    row: 5,
    col: "F",
    val: "Excel Simulator Ready",
    formula: "",
    id: ""
  });

  const handleFormulaBarChange = (newValStr: string) => {
    setSelectedCell(prev => ({ ...prev, val: newValStr }));
    const newVal = Number(newValStr) || 0;
    
    switch (selectedCell.id) {
      case "tam": setTam(newVal); break;
      case "sam": setSam(newVal); break;
      case "som": setSom(newVal); break;
      case "capexTrucks": setCapexTrucks(newVal); break;
      case "capexIT": setCapexIT(newVal); break;
      case "capexGudang": setCapexGudang(newVal); break;
      case "capexIzin": setCapexIzin(newVal); break;
      case "revenueY1": setRevenueY1(newVal); break;
      case "revenueY2": setRevenueY2(newVal); break;
      case "revenueY3": setRevenueY3(newVal); break;
      case "gajiY1": setGajiY1(newVal); break;
      case "gajiY2": setGajiY2(newVal); break;
      case "gajiY3": setGajiY3(newVal); break;
      case "bbmY1": setBbmY1(newVal); break;
      case "bbmY2": setBbmY2(newVal); break;
      case "bbmY3": setBbmY3(newVal); break;
      case "maintY1": setMaintY1(newVal); break;
      case "maintY2": setMaintY2(newVal); break;
      case "maintY3": setMaintY3(newVal); break;
      case "sewaY1": setSewaY1(newVal); break;
      case "sewaY2": setSewaY2(newVal); break;
      case "sewaY3": setSewaY3(newVal); break;
      default: break;
    }
  };

  if (!isOpen) return null;

  // Calculators
  const totalCapex = capexTrucks + capexIT + capexGudang + capexIzin;

  // OPEX Totals
  const totalOpexY1 = gajiY1 + bbmY1 + maintY1 + sewaY1;
  const totalOpexY2 = gajiY2 + bbmY2 + maintY2 + sewaY2;
  const totalOpexY3 = gajiY3 + bbmY3 + maintY3 + sewaY3;

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
    return num.toLocaleString("id-ID");
  };

  const handleDownload = () => {
    const data: ExcelData = {
      projectTitle,
      division,
      tamValue: tam,
      samValue: sam,
      somValue: som,
      capexTrucks,
      capexIT,
      capexGudang,
      capexIzin,
      revenueY1,
      revenueY2,
      revenueY3,
      gajiY1, gajiY2, gajiY3,
      bbmY1, bbmY2, bbmY3,
      maintY1, maintY2, maintY3,
      sewaY1, sewaY2, sewaY3
    };
    exportToExcelFile(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#f3f2f1] text-[#333333] rounded-2xl w-full max-w-7xl h-[92vh] border border-slate-300 shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* TOP CONTROL PANEL BAR */}
        <div className="bg-[#107c41] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#107c41] p-1.5 rounded-lg shadow">
              <Table className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] block font-bold uppercase tracking-widest text-[#dff0d8] font-mono leading-none">Excel Financial Workbook Simulator</span>
              <h3 className="text-sm font-extrabold uppercase truncate max-w-lg mt-0.5">{projectTitle}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="bg-white text-[#107c41] hover:bg-emerald-50 text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-97 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Unduh File Excel (.xls)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-emerald-850 bg-emerald-750 hover:bg-emerald-800 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg transition active:scale-97 cursor-pointer border border-[#0d6434]"
            >
              Tutup Simulator ✕
            </button>
          </div>
        </div>

        {/* RIBBON ACTIONS PRESETS BAR */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 gap-4 shrink-0">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="font-bold text-[#107c41] text-[10px] font-mono">FILE:</span>
              <span className="text-[10px] font-bold">ANALISIS_KELAYAKAN.xlsx</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Petunjuk Penggunaan:</span>
              <span className="text-[10px] text-slate-650 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                Double-click / ketik pada sel berlatar putih untuk menyimulasikan analisis keuangan live!
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-400">
            Microsoft Excel 365 Web Engine
          </div>
        </div>

        {/* EXCEL FORMULA BAR */}
        <div className="bg-[#f3f2f1] border-b border-slate-300 py-1.5 px-3 flex items-center gap-1.5 text-xs text-slate-700 font-mono shrink-0">
          {/* Cell Index Indicator */}
          <div className="bg-white border border-slate-300 px-3 py-1 rounded text-center font-bold text-[#107c41] min-w-[50px] shadow-sm">
            {selectedCell.col}{selectedCell.row}
          </div>
          {/* Split separator */}
          <div className="text-slate-400 px-1 font-sans text-lg">|</div>
          {/* Formula symbol */}
          <div className="text-slate-500 italic font-bold select-none text-sm font-sans mr-1">
            fx
          </div>
          {/* Formula value input */}
          {selectedCell.id ? (
            <input
              type="text"
              value={selectedCell.formula ? selectedCell.formula : selectedCell.val}
              onChange={(e) => handleFormulaBarChange(e.target.value)}
              className="flex-1 bg-white border border-emerald-300 focus:ring-1 focus:ring-emerald-500 outline-none px-3 py-1 rounded shadow-sm text-left font-mono text-slate-800"
              placeholder="Edit nilai sel di sini..."
            />
          ) : (
            <div className="flex-1 bg-slate-100 border border-slate-200 px-3 py-1 rounded shadow-sm text-left truncate text-slate-500 font-mono select-all">
              {selectedCell.formula ? selectedCell.formula : selectedCell.val}
            </div>
          )}
        </div>

        {/* EXCEL GRID CONTENT */}
        <div className="flex-grow overflow-auto bg-white p-2 flex flex-col relative select-none">
          
          <table className="border-collapse table-fixed w-full min-w-[1000px] text-[11px] text-[#242424] font-sans">
            {/* Column Letter Headers */}
            <thead>
              <tr className="bg-[#f3f2f1]">
                <th className="w-10 border border-slate-300 text-center py-1 font-normal font-mono text-slate-500"></th>
                <th className="w-12 border border-slate-300 text-center font-normal font-mono text-slate-500">A</th>
                <th className="w-220 border border-slate-300 text-center font-normal font-mono text-slate-500">B</th>
                <th className="w-400 border border-slate-300 text-center font-normal font-mono text-slate-500">C</th>
                <th className="w-160 border border-slate-300 text-center font-normal font-mono text-slate-500">D</th>
                <th className="w-160 border border-slate-300 text-center font-normal font-mono text-slate-500">E</th>
                <th className="w-160 border border-slate-300 text-center font-normal font-mono text-slate-500">F</th>
                <th className="w-160 border border-slate-300 text-center font-normal font-mono text-slate-500">G</th>
              </tr>
            </thead>

            {activeTab === "tamsamsom" ? (
              <tbody>
                {/* TAM SAM SOM WORKSHEET */}
                {/* Row 1 */}
                <tr className="h-6">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">1</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-extrabold text-[#1f4e78] text-sm pl-2 py-1 uppercase text-left">
                    ANALISIS KELAYAKAN PROYEK LOGISTIK
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="h-5">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">2</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="italic text-slate-500 pl-2 text-left">
                    Estimasi Pasar (TAM SAM SOM) &amp; Ringkasan Metrik Finansial
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="h-4">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">3</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>
                
                {/* Row 4 */}
                <tr className="h-4">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">4</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 5: Section A */}
                <tr className="h-6">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">5</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-[#1f4e78] text-xs pl-2 text-left">
                    A. Estimasi Ukuran Pasar (Market Sizing)
                  </td>
                </tr>

                {/* Row 6: Header A */}
                <tr className="bg-[#1f4e78] text-white font-bold h-7">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">6</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Metrik</td>
                  <td className="border border-slate-300 px-3 text-left">Deskripsi / Cakupan</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai Per Tahun (IDR)</td>
                  <td colSpan={3} className="border border-slate-300"></td>
                </tr>

                 {/* Row 7: TAM Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "D", val: tam.toString(), formula: "", id: "tam" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">7</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">TAM (Total Addressable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">Total seluruh potensi pasar logistik di wilayah target (misal: Seluruh Indonesia/Provinsi)</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={tam}
                      onFocus={() => setSelectedCell({row: 7, col: "D", val: tam.toString(), formula: "", id: "tam" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTam(val);
                        setSelectedCell(prev => prev.row === 7 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 8: SAM Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "D", val: sam.toString(), formula: "", id: "sam" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">8</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">SAM (Serviceable Addressable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">Pangsa pasar TAM yang sesuai dengan model bisnis &amp; jangkauan armada Anda</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={sam}
                      onFocus={() => setSelectedCell({row: 8, col: "D", val: sam.toString(), formula: "", id: "sam" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSam(val);
                        setSelectedCell(prev => prev.row === 8 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 9: SOM Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 9, col: "D", val: som.toString(), formula: "", id: "som" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">9</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">SOM (Serviceable Obtainable Market)</td>
                  <td className="border border-slate-300 px-3 text-slate-600 text-left">Target nyata pangsa pasar yang sanggup dilayani oleh kapasitas operasional Anda saat ini</td>
                  <td className="border border-slate-300 p-0 text-right bg-white select-text h-7">
                    <input 
                      type="number"
                      value={som}
                      onFocus={() => setSelectedCell({row: 9, col: "D", val: som.toString(), formula: "", id: "som" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSom(val);
                        setSelectedCell(prev => prev.row === 9 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full h-full text-right outline-none border-none px-3 py-1 focus:bg-emerald-50 focus:ring-1 focus:ring-emerald-500 text-xs font-mono cursor-pointer"
                    />
                  </td>
                  <td colSpan={3} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 10: Spacer */}
                <tr className="h-5">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">10</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 11: Spacer */}
                <tr className="h-5">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">11</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 12: Section B */}
                <tr className="h-6">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">12</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-[#1f4e78] text-xs pl-2 text-left">
                    B. Ringkasan Kelayakan Proyek (Auto-calculated)
                  </td>
                </tr>

                {/* Row 13: Header B */}
                <tr className="bg-[#1f4e78] text-white font-bold h-7">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">13</td>
                  <td className="border border-slate-300"></td>
                  <td colSpan={2} className="border border-slate-300 px-3 text-left">Indikator Keuangan</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai</td>
                  <td className="border border-slate-300 px-3 text-left">Ambang Batas Kelayakan</td>
                  <td colSpan={2} className="border border-slate-300"></td>
                </tr>

                {/* Row 14: CAPEX Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 14, col: "D", val: totalCapex.toString(), formula: "='2. P&L & Cash Flow'!C7"})}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">14</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">Total CAPEX (Investasi Awal)</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-slate-900 text-xs">
                    Rp {formatIDR(totalCapex)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Berdasarkan Kebutuhan Aset
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 15: Pendapatan Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 15, col: "D", val: revenueY1.toString(), formula: "='2. P&L & Cash Flow'!C13"})}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">15</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">Proyeksi Pendapatan (Tahun 1)</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-slate-900 text-xs">
                    Rp {formatIDR(revenueY1)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Target SOM minimum terpenuhi
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 16: NPM Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 16, col: "D", val: averageNpm.toFixed(1) + "%", formula: "=AVERAGE('2. P&L & Cash Flow'!C21:E21)"})}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">16</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">Net Profit Margin (Rata-rata)</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-slate-900 text-xs">
                    {averageNpm.toFixed(1)}%
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Positif (&gt; 10%)
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 17: Cash Flow Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 17, col: "D", val: (netCashFlowY1 + netCashFlowY2 + netCashFlowY3).toString(), formula: "=SUM('2. P&L & Cash Flow'!C26:E26)"})}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">17</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">Total Arus Kas Bersih (3 Tahun)</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-slate-900 text-xs">
                    Rp {formatIDR(netCashFlowY1 + netCashFlowY2 + netCashFlowY3)}
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Positif (Kumulatif)
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 18: Payback Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 18, col: "D", val: paybackPeriodVal.toFixed(1) + " Tahun", formula: "=C14/AVERAGE('2. P&L & Cash Flow'!C20:E20)"})}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">18</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left">Payback Period / ROI (Tahun)</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-right bg-slate-50 font-bold font-mono text-[#385723] text-xs">
                    {paybackPeriodVal.toFixed(1)} Tahun
                  </td>
                  <td className="border border-slate-300 px-3 text-left bg-[#e2efda] text-[#385723] font-bold">
                    Kurang dari 3 Tahun
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {/* P&L & CASH FLOW WORKSHEET */}
                {/* Row 1: Empty Spacer */}
                <tr className="h-4">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">1</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 2: Title */}
                <tr className="h-6">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">2</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-extrabold text-[#1f4e78] text-sm pl-2 py-1 uppercase text-left">
                    MODEL PROYEKSI KEUANGAN PROYEK (3 TAHUN)
                  </td>
                </tr>

                {/* Row 3: Empty Spacer */}
                <tr className="h-5">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">3</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 4: Section Header */}
                <tr className="h-6">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">4</td>
                  <td className="border border-slate-100"></td>
                  <td colSpan={5} className="font-bold text-[#1f4e78] text-xs pl-2 text-left">
                    1. ESTIMASI CAPEX (Capital Expenditure)
                  </td>
                </tr>

                {/* Row 5: Column Headers */}
                <tr className="bg-[#1f4e78] text-white font-bold h-7">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">5</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Komponen Investasi Awal</td>
                  <td className="border border-slate-300 px-3 text-right">Nilai (IDR)</td>
                  <td colSpan={2} className="border border-slate-300 px-3 text-left">Keterangan</td>
                  <td colSpan={2} className="border border-slate-300"></td>
                </tr>

                {/* Row 6: Armada */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 6, col: "C", val: capexTrucks.toString(), formula: "", id: "capexTrucks" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">6</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Armada Truk Logistik (DP / Pembelian Cash)</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capexTrucks}
                      onFocus={() => setSelectedCell({row: 6, col: "C", val: capexTrucks.toString(), formula: "", id: "capexTrucks" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapexTrucks(val);
                        setSelectedCell(prev => prev.row === 6 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-300 px-3 italic text-slate-500 text-left">Misal: 3 Unit Truk Engkel</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 7: Sistem IT */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "C", val: capexIT.toString(), formula: "", id: "capexIT" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">7</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Sistem IT / Transport Management System (TMS)</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capexIT}
                      onFocus={() => setSelectedCell({row: 7, col: "C", val: capexIT.toString(), formula: "", id: "capexIT" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapexIT(val);
                        setSelectedCell(prev => prev.row === 7 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-300 px-3 italic text-slate-500 text-left">Lisensi &amp; Setup Awal</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 8: Peralatan Gudang */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "C", val: capexGudang.toString(), formula: "", id: "capexGudang" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">8</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Peralatan Gudang &amp; Pallet</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capexGudang}
                      onFocus={() => setSelectedCell({row: 8, col: "C", val: capexGudang.toString(), formula: "", id: "capexGudang" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapexGudang(val);
                        setSelectedCell(prev => prev.row === 8 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-300 px-3 italic text-slate-500 text-left">Rak, Hand Pallet, Safety Tools</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 9: Perizinan */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 9, col: "C", val: capexIzin.toString(), formula: "", id: "capexIzin" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">9</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Perizinan &amp; Legalitas Proyek</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text">
                    <input 
                      type="number"
                      value={capexIzin}
                      onFocus={() => setSelectedCell({row: 9, col: "C", val: capexIzin.toString(), formula: "", id: "capexIzin" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapexIzin(val);
                        setSelectedCell(prev => prev.row === 9 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-300 px-3 italic text-slate-500 text-left">Sertifikasi &amp; izin jalan armada</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 10: TOTAL CAPEX Row */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 10, col: "C", val: totalCapex.toString(), formula: "=SUM(C6:C9)" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">10</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left text-slate-900">TOTAL CAPEX</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-950 text-xs">
                    Rp {formatIDR(totalCapex)}
                  </td>
                  <td colSpan={2} className="border border-slate-300 bg-[#fafafa]"></td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 11: Spacer */}
                <tr className="h-5">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">11</td>
                  <td colSpan={7} className="border border-slate-100"></td>
                </tr>

                {/* Row 12: Column Headers */}
                <tr className="bg-[#1f4e78] text-white font-bold h-7">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">12</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">Item Laporan Keuangan</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 1 (IDR)</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 2 (IDR)</td>
                  <td className="border border-slate-300 px-3 text-right">Tahun 3 (IDR)</td>
                  <td colSpan={2} className="border border-slate-300"></td>
                </tr>

                {/* Row 13: REVENUE */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 13, col: "C", val: "Detail Proyeksi Pendapatan", formula: "" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">13</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 font-bold text-left text-slate-900">PENDAPATAN (REVENUE)</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 13, col: "D", val: revenueY1.toString(), formula: "", id: "revenueY1" })} }>
                    <input 
                      type="number"
                      value={revenueY1}
                      onFocus={() => setSelectedCell({row: 13, col: "D", val: revenueY1.toString(), formula: "", id: "revenueY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY1(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 13, col: "E", val: revenueY2.toString(), formula: "", id: "revenueY2" })} }>
                    <input 
                      type="number"
                      value={revenueY2}
                      onFocus={() => setSelectedCell({row: 13, col: "E", val: revenueY2.toString(), formula: "", id: "revenueY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY2(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text font-bold" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 13, col: "F", val: revenueY3.toString(), formula: "", id: "revenueY3" })} }>
                    <input 
                      type="number"
                      value={revenueY3}
                      onFocus={() => setSelectedCell({row: 13, col: "F", val: revenueY3.toString(), formula: "", id: "revenueY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRevenueY3(val);
                        setSelectedCell(prev => prev.row === 13 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 14: OPEX Subtitle */}
                <tr className="h-6 font-bold bg-slate-50">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">14</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">BIAYA OPERASIONAL (OPEX)</td>
                  <td colSpan={3} className="border border-slate-300 bg-slate-50"></td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 15: Gaji Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 15, col: "C", val: "Detail Proyeksi Gaji", formula: "" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">15</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-650">- Gaji Sopir &amp; Kru</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 15, col: "D", val: gajiY1.toString(), formula: "", id: "gajiY1" })} }>
                    <input 
                      type="number"
                      value={gajiY1}
                      onFocus={() => setSelectedCell({row: 15, col: "D", val: gajiY1.toString(), formula: "", id: "gajiY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGajiY1(val);
                        setSelectedCell(prev => prev.row === 15 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 15, col: "E", val: gajiY2.toString(), formula: "", id: "gajiY2" })} }>
                    <input 
                      type="number"
                      value={gajiY2}
                      onFocus={() => setSelectedCell({row: 15, col: "E", val: gajiY2.toString(), formula: "", id: "gajiY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGajiY2(val);
                        setSelectedCell(prev => prev.row === 15 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 15, col: "F", val: gajiY3.toString(), formula: "", id: "gajiY3" })} }>
                    <input 
                      type="number"
                      value={gajiY3}
                      onFocus={() => setSelectedCell({row: 15, col: "F", val: gajiY3.toString(), formula: "", id: "gajiY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGajiY3(val);
                        setSelectedCell(prev => prev.row === 15 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 16: BBM Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 16, col: "C", val: "Detail Proyeksi BBM", formula: "" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">16</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-650">- BBM &amp; Tol</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 16, col: "D", val: bbmY1.toString(), formula: "", id: "bbmY1" })} }>
                    <input 
                      type="number"
                      value={bbmY1}
                      onFocus={() => setSelectedCell({row: 16, col: "D", val: bbmY1.toString(), formula: "", id: "bbmY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBbmY1(val);
                        setSelectedCell(prev => prev.row === 16 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 16, col: "E", val: bbmY2.toString(), formula: "", id: "bbmY2" })} }>
                    <input 
                      type="number"
                      value={bbmY2}
                      onFocus={() => setSelectedCell({row: 16, col: "E", val: bbmY2.toString(), formula: "", id: "bbmY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBbmY2(val);
                        setSelectedCell(prev => prev.row === 16 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 16, col: "F", val: bbmY3.toString(), formula: "", id: "bbmY3" })} }>
                    <input 
                      type="number"
                      value={bbmY3}
                      onFocus={() => setSelectedCell({row: 16, col: "F", val: bbmY3.toString(), formula: "", id: "bbmY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBbmY3(val);
                        setSelectedCell(prev => prev.row === 16 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 17: Maintenance Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 17, col: "C", val: "Detail Proyeksi Servis", formula: "" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">17</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-650">- Maintenance &amp; Servis Armada</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 17, col: "D", val: maintY1.toString(), formula: "", id: "maintY1" })} }>
                    <input 
                      type="number"
                      value={maintY1}
                      onFocus={() => setSelectedCell({row: 17, col: "D", val: maintY1.toString(), formula: "", id: "maintY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaintY1(val);
                        setSelectedCell(prev => prev.row === 17 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 17, col: "E", val: maintY2.toString(), formula: "", id: "maintY2" })} }>
                    <input 
                      type="number"
                      value={maintY2}
                      onFocus={() => setSelectedCell({row: 17, col: "E", val: maintY2.toString(), formula: "", id: "maintY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaintY2(val);
                        setSelectedCell(prev => prev.row === 17 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 17, col: "F", val: maintY3.toString(), formula: "", id: "maintY3" })} }>
                    <input 
                      type="number"
                      value={maintY3}
                      onFocus={() => setSelectedCell({row: 17, col: "F", val: maintY3.toString(), formula: "", id: "maintY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaintY3(val);
                        setSelectedCell(prev => prev.row === 17 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 18: Sewa Row */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 18, col: "C", val: "Detail Proyeksi Sewa", formula: "" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">18</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-650">- Sewa Kantor/Gudang &amp; Admin</td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 18, col: "D", val: sewaY1.toString(), formula: "", id: "sewaY1" })} }>
                    <input 
                      type="number"
                      value={sewaY1}
                      onFocus={() => setSelectedCell({row: 18, col: "D", val: sewaY1.toString(), formula: "", id: "sewaY1" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSewaY1(val);
                        setSelectedCell(prev => prev.row === 18 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 18, col: "E", val: sewaY2.toString(), formula: "", id: "sewaY2" })} }>
                    <input 
                      type="number"
                      value={sewaY2}
                      onFocus={() => setSelectedCell({row: 18, col: "E", val: sewaY2.toString(), formula: "", id: "sewaY2" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSewaY2(val);
                        setSelectedCell(prev => prev.row === 18 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td className="border border-slate-300 px-3 text-right bg-white select-text" onClick={(e) => { e.stopPropagation(); setSelectedCell({row: 18, col: "F", val: sewaY3.toString(), formula: "", id: "sewaY3" })} }>
                    <input 
                      type="number"
                      value={sewaY3}
                      onFocus={() => setSelectedCell({row: 18, col: "F", val: sewaY3.toString(), formula: "", id: "sewaY3" })}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSewaY3(val);
                        setSelectedCell(prev => prev.row === 18 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                      }}
                      className="w-full text-right outline-none border-none p-0 focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    />
                  </td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 19: TOTAL OPEX */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 19, col: "C", val: totalOpexY1.toString(), formula: "=SUM(C15:C18)" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">19</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">TOTAL OPEX</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY3)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 20: LABA BERSIH */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-[#e2efda] text-[#385723]" onClick={() => setSelectedCell({row: 20, col: "C", val: netProfitY1.toString(), formula: "=C13-C19" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">20</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">LABA BERSIH (NET PROFIT)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY3)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 21: NET PROFIT MARGIN */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 21, col: "C", val: npmY1.toFixed(1) + "%", formula: "=C20/C13" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">21</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">NET PROFIT MARGIN (%)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">{npmY1.toFixed(1)}%</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">{npmY2.toFixed(1)}%</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">{npmY3.toFixed(1)}%</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 22: CASH FLOW Section Header */}
                <tr className="h-6 font-bold bg-slate-100">
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">22</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">ARUS KAS (CASH FLOW)</td>
                  <td colSpan={3} className="border border-slate-300 bg-slate-100"></td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 23: Saldo Kas Awal */}
                <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 23, col: "C", val: "0", formula: "=Previous Saldo Kas Akhir" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">23</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left text-slate-650">+ Saldo Kas Awal</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp 0</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(endCashY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(endCashY2)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 24: CAPEX Out */}
                <tr className="hover:bg-slate-50 h-7 text-red-600" onClick={() => setSelectedCell({row: 24, col: "C", val: `-${totalCapex}`, formula: "=-C10" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">24</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left">- Arus Kas Keluar Investasi (CAPEX)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">(Rp {formatIDR(totalCapex)})</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp 0</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp 0</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 25: Ops Inflow */}
                <tr className="hover:bg-slate-50 h-7 text-[#166534]" onClick={() => setSelectedCell({row: 25, col: "C", val: netProfitY1.toString(), formula: "=C20" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">25</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-5 text-left">+ Masukan Kas Operasional (Net Profit)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY1)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(netProfitY3)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 26: NET CASH FLOW */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 26, col: "C", val: netCashFlowY1.toString(), formula: "=C24+C25" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">26</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">ARUS KAS BERSIH (NET CASH FLOW)</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs text-red-650">
                    {netCashFlowY1 < 0 ? `(Rp ${formatIDR(Math.abs(netCashFlowY1))})` : `Rp ${formatIDR(netCashFlowY1)}`}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs text-slate-900">Rp {formatIDR(netCashFlowY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs text-slate-900">Rp {formatIDR(netCashFlowY3)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>

                {/* Row 27: SALDO KAS AKHIR */}
                <tr className="hover:bg-slate-50 h-7 font-bold bg-[#d9e1f2] text-[#1f4e78]" onClick={() => setSelectedCell({row: 27, col: "C", val: endCashY3.toString(), formula: "=C23+C26" })}>
                  <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400">27</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300 px-3 text-left">SALDO KAS AKHIR</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs text-red-650">
                    {endCashY1 < 0 ? `(Rp ${formatIDR(Math.abs(endCashY1))})` : `Rp ${formatIDR(endCashY1)}`}
                  </td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(endCashY2)}</td>
                  <td className="border border-slate-300 px-3 text-right font-mono text-xs">Rp {formatIDR(endCashY3)}</td>
                  <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
                </tr>
              </tbody>
            )}
          </table>
          
        </div>

        {/* BOTTOM WORKSHEET TAB BAR - REAL EXCEL STYLE */}
        <div className="bg-[#f3f2f1] border-t border-slate-300 h-10 flex items-center justify-between px-3 text-xs select-none shrink-0 text-[#333]">
          <div className="flex items-center gap-1">
            {/* Sheet Tabs Navigation Controls */}
            <div className="flex border-r border-slate-300 pr-1.5 mr-1.5 text-slate-400 gap-0.5">
              <button className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("tamsamsom")}
              className={`flex items-center gap-1.5 px-4 h-10 border-r border-slate-300 font-bold transition cursor-pointer relative ${
                activeTab === "tamsamsom" 
                  ? "bg-white text-[#107c41] border-t-2 border-t-[#107c41]" 
                  : "hover:bg-slate-200 text-slate-650"
              }`}
            >
              <span className="text-[11px]">1. TAM SAM SOM &amp; Kelayakan</span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => setActiveTab("pl")}
              className={`flex items-center gap-1.5 px-4 h-10 border-r border-slate-300 font-bold transition cursor-pointer relative ${
                activeTab === "pl" 
                  ? "bg-white text-[#107c41] border-t-2 border-t-[#107c41]" 
                  : "hover:bg-slate-200 text-slate-650"
              }`}
            >
              <span className="text-[11px]">2. P&amp;L &amp; Cash Flow</span>
            </button>

            {/* Plus button */}
            <button className="p-1.5 hover:bg-slate-250 hover:bg-slate-200 rounded-full text-slate-500 ml-1.5 transition cursor-pointer">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-slate-500 font-medium font-mono">
            Ready | 100% Zoom
          </div>
        </div>

      </div>
    </div>
  );
}
