import React, { useState, useEffect } from "react";
import { Download, Table, Edit2, Play, Plus, ChevronLeft, ChevronRight, HelpCircle, TrendingUp, DollarSign, Calculator } from "lucide-react";
import { ExcelData, exportToExcelFile } from "../utils/excelExporter";

interface InteractiveFinancialSimulatorProps {
  projectTitle: string;
  division?: string;
  initialCapex?: number;
  salesIncrease?: number;
}

export function InteractiveFinancialSimulator({
  projectTitle,
  division = "Logistics Swarnadwipa",
  initialCapex = 550, // default Rp 550 Juta
  salesIncrease = 1200 // default Rp 1.2 Miliar
}: InteractiveFinancialSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"tamsamsom" | "pl">("tamsamsom");

  // Interactive finance variables
  const [tam, setTam] = useState<number>(500000000000); // Rp 500 Miliar
  const [sam, setSam] = useState<number>(75000000000);  // Rp 75 Miliar
  const [som, setSom] = useState<number>(15000000000);  // Rp 15 Miliar

  // Capex components (Default total Rp 550 Juta)
  const [capexTrucks, setCapexTrucks] = useState<number>(450000000); // Rp 450 Juta
  const [capexIT, setCapexIT] = useState<number>(50000000);        // Rp 50 Miliar/Juta
  const [capexGudang, setCapexGudang] = useState<number>(30000000);  // Rp 30 Juta
  const [capexIzin, setCapexIzin] = useState<number>(20000000);      // Rp 20 Juta

  // Year 1-3 Revenue Projections (Default Rp 1.2 Miliar, Y2 Rp 1.5M, Y3 Rp 1.8M)
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

  // Set initial values from props if supplied
  useEffect(() => {
    if (initialCapex && initialCapex > 0) {
      const capexFull = initialCapex * 1000000;
      setCapexTrucks(Math.round(capexFull * 0.81));
      setCapexIT(Math.round(capexFull * 0.09));
      setCapexGudang(Math.round(capexFull * 0.06));
      setCapexIzin(Math.round(capexFull * 0.04));
    }
    if (salesIncrease && salesIncrease > 0) {
      const revFull = salesIncrease * 1000000;
      setRevenueY1(revFull);
      setRevenueY2(Math.round(revFull * 1.25));
      setRevenueY3(Math.round(revFull * 1.50));

      const estSom = salesIncrease * 12.5 * 1000000; // Estimated market
      setSom(estSom);
      setSam(estSom * 5);
      setTam(estSom * 33.3);
    }
  }, [initialCapex, salesIncrease]);

  // Selected cell state for simulation
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string; formula: string; id?: string }>({
    row: 5,
    col: "F",
    val: "Pilih sel di bawah untuk melakukan simulasi live!",
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

  // Calculations
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
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-md font-sans">
      
      {/* HEADER BAR */}
      <div className="bg-[#107c41] text-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white text-[#107c41] p-1.5 rounded-lg shadow-sm">
            <Table className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="text-[9px] block font-extrabold uppercase tracking-widest text-[#dff0d8] font-mono leading-none">
              Prama Live Spreadsheet Engine
            </span>
            <h4 className="text-xs md:text-sm font-black uppercase truncate mt-0.5 max-w-md">
              Evaluasi Finansial & Kelayakan: {projectTitle}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="bg-white hover:bg-emerald-50 text-[#107c41] text-[10.5px] font-black px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-97 cursor-pointer border-none"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Ekspor Dokumen Excel (.xls)</span>
        </button>
      </div>

      {/* INSTRUCTIONS MINI RIBBON */}
      <div className="bg-[#f3f2f1] border-b border-slate-200 px-4 py-2 text-[10px] text-slate-650 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="font-extrabold text-[#107c41]">PROYEK BINAAN:</span>
          <span className="text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-bold">
            ANALISIS_KELAYAKAN_FINANSIAL.xlsx
          </span>
        </div>
        <div className="text-slate-550 font-semibold italic text-left sm:text-right">
          💡 Tips: Klik/ubah nilai pada sel berlatar putih untuk melakukan analisis simulasi langsung.
        </div>
      </div>

      {/* FORMULA BAR */}
      <div className="bg-[#f3f2f1] border-b border-slate-250 py-1.5 px-3 flex items-center gap-2 text-[11px] font-mono text-slate-700 select-none">
        {/* Cell Index */}
        <div className="bg-white border border-slate-300 px-3 py-0.5 rounded text-center font-bold text-[#107c41] min-w-[50px]">
          {selectedCell.col}{selectedCell.row}
        </div>
        <div className="text-slate-350 select-none">|</div>
        <div className="text-slate-400 italic font-bold select-none text-xs">fx</div>
        
        {selectedCell.id ? (
          <input
            type="text"
            value={selectedCell.formula ? selectedCell.formula : selectedCell.val}
            onChange={(e) => handleFormulaBarChange(e.target.value)}
            className="flex-1 bg-white border border-emerald-300 focus:ring-1 focus:ring-emerald-500 outline-none px-2 py-0.5 rounded font-mono text-slate-800 text-[11px]"
            placeholder="Edit nilai sel di sini..."
          />
        ) : (
          <div className="flex-1 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded text-left truncate text-slate-500 font-mono select-all">
            {selectedCell.formula ? selectedCell.formula : selectedCell.val}
          </div>
        )}
      </div>

      {/* SPREADSHEET GRID WRAPPER */}
      <div className="overflow-x-auto p-1.5 bg-white">
        <table className="border-collapse table-fixed w-full min-w-[850px] text-[10.5px] text-[#242424] font-sans">
          <thead>
            <tr className="bg-[#f3f2f1]">
              <th className="w-8 border border-slate-300 text-center py-0.5 font-normal font-mono text-slate-400 text-[9px]"></th>
              <th className="w-12 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">A</th>
              <th className="w-48 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">B</th>
              <th className="w-72 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">C</th>
              <th className="w-40 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">D</th>
              <th className="w-44 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">E</th>
              <th className="w-44 border border-slate-300 text-center font-normal font-mono text-slate-400 text-[9px]">F</th>
            </tr>
          </thead>

          {activeTab === "tamsamsom" ? (
            <tbody>
              {/* Row 1 */}
              <tr className="h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">1</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="font-black text-[#1f4e78] text-[11.5px] pl-2 text-left uppercase">
                  ANALISIS KELAYAKAN PROYEK LOGISTIK
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="h-5">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">2</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="italic text-slate-500 pl-2 text-left font-semibold">
                  Estimasi Pasar (TAM SAM SOM) &amp; Ringkasan Metrik Finansial
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="h-4">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">3</td>
                <td colSpan={6} className="border border-slate-100"></td>
              </tr>

              {/* Row 4: Section A */}
              <tr className="h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">4</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="font-bold text-[#1f4e78] text-[10.5px] pl-2 text-left">
                  A. Estimasi Ukuran Pasar (Market Sizing)
                </td>
              </tr>

              {/* Row 5: Header A */}
              <tr className="bg-[#1f4e78] text-white font-bold h-6.5 text-[10px]">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">5</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Metrik</td>
                <td className="border border-slate-300 px-2 text-left">Deskripsi / Cakupan</td>
                <td className="border border-slate-300 px-2 text-right">Nilai Per Tahun (IDR)</td>
                <td colSpan={2} className="border border-slate-300"></td>
              </tr>

              {/* Row 6: TAM */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 6, col: "D", val: tam.toString(), formula: "", id: "tam" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">6</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 font-bold text-left">TAM (Total Addressable Market)</td>
                <td className="border border-slate-300 px-2 text-slate-600 text-left">Total potensi pasar logistik B3 &amp; Industri di seluruh provinsi target</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={tam}
                    onFocus={() => setSelectedCell({row: 6, col: "D", val: tam.toString(), formula: "", id: "tam" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTam(val);
                      setSelectedCell(prev => prev.row === 6 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 7: SAM */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "D", val: sam.toString(), formula: "", id: "sam" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">7</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 font-bold text-left">SAM (Serviceable Addressable Market)</td>
                <td className="border border-slate-300 px-2 text-slate-600 text-left">Pangsa pasar target logistik yang sesuai dengan jangkauan layanan armada</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={sam}
                    onFocus={() => setSelectedCell({row: 7, col: "D", val: sam.toString(), formula: "", id: "sam" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSam(val);
                      setSelectedCell(prev => prev.row === 7 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 8: SOM */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "D", val: som.toString(), formula: "", id: "som" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">8</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 font-bold text-left">SOM (Serviceable Obtainable Market)</td>
                <td className="border border-slate-300 px-2 text-slate-600 text-left">Target nyata pangsa pasar yang mampu dikuasai oleh kapasitas armada aktif</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={som}
                    onFocus={() => setSelectedCell({row: 8, col: "D", val: som.toString(), formula: "", id: "som" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSom(val);
                      setSelectedCell(prev => prev.row === 8 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 9: Spacer */}
              <tr className="h-4">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">9</td>
                <td colSpan={6} className="border border-slate-100"></td>
              </tr>

              {/* Row 10: Section B */}
              <tr className="h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">10</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="font-bold text-[#1f4e78] text-[10.5px] pl-2 text-left">
                  B. Ringkasan Kelayakan Proyek (Auto-calculated)
                </td>
              </tr>

              {/* Row 11: Header B */}
              <tr className="bg-[#1f4e78] text-white font-bold h-6.5 text-[10px]">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">11</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 text-left">Indikator Keuangan</td>
                <td className="border border-slate-300 px-2 text-right">Nilai Kalkulasi</td>
                <td className="border border-slate-300 px-2 text-left">Ambang Batas Kelayakan</td>
                <td className="border border-slate-300"></td>
              </tr>

              {/* Row 12: CAPEX */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 12, col: "D", val: totalCapex.toString(), formula: "='2. P&L & Cash Flow'!C10"})}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">12</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 font-bold text-left">Total CAPEX (Investasi Awal)</td>
                <td className="border border-slate-300 px-2 text-right bg-slate-50 font-bold font-mono text-slate-900">
                  Rp {formatIDR(totalCapex)}
                </td>
                <td className="border border-slate-300 px-2 text-left bg-[#e2efda] text-[#385723] font-bold">
                  Berdasarkan Kebutuhan Aset
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 13: Pendapatan */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 13, col: "D", val: revenueY1.toString(), formula: "='2. P&L & Cash Flow'!C13"})}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">13</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 font-bold text-left">Proyeksi Pendapatan (Tahun 1)</td>
                <td className="border border-slate-300 px-2 text-right bg-slate-50 font-bold font-mono text-slate-900">
                  Rp {formatIDR(revenueY1)}
                </td>
                <td className="border border-slate-300 px-2 text-left bg-[#e2efda] text-[#385723] font-bold">
                  Target SOM minimum terpenuhi
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 14: NPM */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 14, col: "D", val: averageNpm.toFixed(1) + "%", formula: "=AVERAGE('2. P&L & Cash Flow'!C21:E21)"})}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">14</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 font-bold text-left">Net Profit Margin (Rata-rata)</td>
                <td className="border border-slate-300 px-2 text-right bg-slate-50 font-bold font-mono text-slate-900">
                  {averageNpm.toFixed(1)}%
                </td>
                <td className="border border-slate-300 px-2 text-left bg-[#e2efda] text-[#385723] font-bold">
                  Positif (&gt; 10%)
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 15: Cash Flow */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 15, col: "D", val: (netCashFlowY1 + netCashFlowY2 + netCashFlowY3).toString(), formula: "=SUM('2. P&L & Cash Flow'!C26:E26)"})}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">15</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 font-bold text-left">Total Arus Kas Bersih (3 Tahun)</td>
                <td className="border border-slate-300 px-2 text-right bg-slate-50 font-bold font-mono text-slate-900">
                  Rp {formatIDR(netCashFlowY1 + netCashFlowY2 + netCashFlowY3)}
                </td>
                <td className="border border-slate-300 px-2 text-left bg-[#e2efda] text-[#385723] font-bold">
                  Positif (Kumulatif)
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 16: Payback Period */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 16, col: "D", val: paybackPeriodVal.toFixed(1) + " Tahun", formula: "=C12/AVERAGE('2. P&L & Cash Flow'!C20:E20)"})}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">16</td>
                <td className="border border-slate-300"></td>
                <td colSpan={2} className="border border-slate-300 px-2 font-bold text-left">Payback Period / ROI (Tahun)</td>
                <td className="border border-slate-300 px-2 text-right bg-slate-50 font-bold font-mono text-[#166534]">
                  {paybackPeriodVal.toFixed(1)} Tahun
                </td>
                <td className="border border-slate-300 px-2 text-left bg-[#e2efda] text-[#385723] font-bold">
                  Kurang dari 3 Tahun
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {/* P&L & CASH FLOW WORKSHEET */}
              <tr className="h-5">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">1</td>
                <td colSpan={6} className="border border-slate-100"></td>
              </tr>
              <tr className="h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">2</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="font-extrabold text-[#1f4e78] text-[11px] pl-2 text-left uppercase">
                  MODEL PROYEKSI KEUANGAN PROYEK (3 TAHUN)
                </td>
              </tr>
              <tr className="h-5">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">3</td>
                <td colSpan={6} className="border border-slate-100"></td>
              </tr>

              {/* Section 1: CAPEX */}
              <tr className="h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">4</td>
                <td className="border border-slate-100"></td>
                <td colSpan={5} className="font-bold text-[#1f4e78] text-[10px] pl-2 text-left">
                  1. ESTIMASI CAPEX (Capital Expenditure)
                </td>
              </tr>

              <tr className="bg-[#1f4e78] text-white font-bold h-6.5 text-[9.5px]">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">5</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Komponen Investasi Awal</td>
                <td className="border border-slate-300 px-2 text-right">Nilai (IDR)</td>
                <td colSpan={2} className="border border-slate-300 px-2 text-left">Keterangan Teknis</td>
                <td className="border border-slate-300"></td>
              </tr>

              {/* Row 6: Trucks */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 6, col: "C", val: capexTrucks.toString(), formula: "", id: "capexTrucks" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">6</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Armada Truk Logistik (DP / Pembelian Cash)</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={capexTrucks}
                    onFocus={() => setSelectedCell({row: 6, col: "C", val: capexTrucks.toString(), formula: "", id: "capexTrucks" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCapexTrucks(val);
                      setSelectedCell(prev => prev.row === 6 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-300 px-2 italic text-slate-500 text-left">Misal: DP Vacuum &amp; Box Truck Swarnadwipa</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 7: IT */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 7, col: "C", val: capexIT.toString(), formula: "", id: "capexIT" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">7</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Sistem IT / Transport Management System (TMS)</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={capexIT}
                    onFocus={() => setSelectedCell({row: 7, col: "C", val: capexIT.toString(), formula: "", id: "capexIT" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCapexIT(val);
                      setSelectedCell(prev => prev.row === 7 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-300 px-2 italic text-slate-500 text-left">Integrasi Festronik KLHK &amp; GPS IoT</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 8: Gudang */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 8, col: "C", val: capexGudang.toString(), formula: "", id: "capexGudang" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">8</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Peralatan Penanganan Limbah B3 / Gudang Transit</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={capexGudang}
                    onFocus={() => setSelectedCell({row: 8, col: "C", val: capexGudang.toString(), formula: "", id: "capexGudang" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCapexGudang(val);
                      setSelectedCell(prev => prev.row === 8 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-300 px-2 italic text-slate-500 text-left">Pompa transfer, safety deck, tumpahan kit</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 9: Izin */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 9, col: "C", val: capexIzin.toString(), formula: "", id: "capexIzin" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">9</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Sertifikasi &amp; Izin Legalitas AMDAL / Kemenhub</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={capexIzin}
                    onFocus={() => setSelectedCell({row: 9, col: "C", val: capexIzin.toString(), formula: "", id: "capexIzin" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCapexIzin(val);
                      setSelectedCell(prev => prev.row === 9 && prev.col === "C" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td colSpan={2} className="border border-slate-300 px-2 italic text-slate-500 text-left">Penyusunan dokumen &amp; sertifikasi K3</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Row 10: Total Capex */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-100" onClick={() => setSelectedCell({row: 10, col: "C", val: totalCapex.toString(), formula: "=SUM(C6:C9)" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">10</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">TOTAL INVESTASI AWAL (CAPEX)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs text-[#107c41]">
                  Rp {formatIDR(totalCapex)}
                </td>
                <td colSpan={2} className="border border-slate-300 bg-slate-50"></td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              <tr className="h-5">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">11</td>
                <td colSpan={6} className="border border-slate-100"></td>
              </tr>

              {/* Proyeksi P&L */}
              <tr className="bg-[#1f4e78] text-white font-bold h-6.5 text-[9.5px]">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">12</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">Komponen Laba Rugi</td>
                <td className="border border-slate-300 px-2 text-right">Tahun 1 (IDR)</td>
                <td className="border border-slate-300 px-2 text-right">Tahun 2 (IDR)</td>
                <td className="border border-slate-300 px-2 text-right">Tahun 3 (IDR)</td>
                <td className="border border-slate-300"></td>
              </tr>

              {/* PENDAPATAN */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 13, col: "C", val: "Pendapatan Proyek", formula: "" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">13</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 font-bold text-left text-indigo-900">PENDAPATAN (REVENUE)</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={revenueY1}
                    onFocus={() => setSelectedCell({row: 13, col: "D", val: revenueY1.toString(), formula: "", id: "revenueY1" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevenueY1(val);
                      setSelectedCell(prev => prev.row === 13 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={revenueY2}
                    onFocus={() => setSelectedCell({row: 13, col: "E", val: revenueY2.toString(), formula: "", id: "revenueY2" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevenueY2(val);
                      setSelectedCell(prev => prev.row === 13 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={revenueY3}
                    onFocus={() => setSelectedCell({row: 13, col: "F", val: revenueY3.toString(), formula: "", id: "revenueY3" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevenueY3(val);
                      setSelectedCell(prev => prev.row === 13 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono font-bold text-slate-800"
                  />
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* OPEX */}
              <tr className="bg-slate-50 font-bold h-6">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">14</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">BIAYA OPERASIONAL (OPEX)</td>
                <td colSpan={3} className="border border-slate-300"></td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Gaji */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 15, col: "C", val: "Gaji Operasional", formula: "" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">15</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left text-slate-600">- Gaji Sopir, Helper &amp; Dispatcher</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={gajiY1}
                    onFocus={() => setSelectedCell({row: 15, col: "D", val: gajiY1.toString(), formula: "", id: "gajiY1" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGajiY1(val);
                      setSelectedCell(prev => prev.row === 15 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={gajiY2}
                    onFocus={() => setSelectedCell({row: 15, col: "E", val: gajiY2.toString(), formula: "", id: "gajiY2" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGajiY2(val);
                      setSelectedCell(prev => prev.row === 15 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={gajiY3}
                    onFocus={() => setSelectedCell({row: 15, col: "F", val: gajiY3.toString(), formula: "", id: "gajiY3" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGajiY3(val);
                      setSelectedCell(prev => prev.row === 15 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* BBM */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 16, col: "C", val: "BBM Operasional", formula: "" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">16</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left text-slate-600">- BBM Solar, Tol &amp; Parkir</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={bbmY1}
                    onFocus={() => setSelectedCell({row: 16, col: "D", val: bbmY1.toString(), formula: "", id: "bbmY1" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBbmY1(val);
                      setSelectedCell(prev => prev.row === 16 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={bbmY2}
                    onFocus={() => setSelectedCell({row: 16, col: "E", val: bbmY2.toString(), formula: "", id: "bbmY2" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBbmY2(val);
                      setSelectedCell(prev => prev.row === 16 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={bbmY3}
                    onFocus={() => setSelectedCell({row: 16, col: "F", val: bbmY3.toString(), formula: "", id: "bbmY3" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBbmY3(val);
                      setSelectedCell(prev => prev.row === 16 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Maintenance */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 17, col: "C", val: "Servis Rutin", formula: "" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">17</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left text-slate-600">- Servis Armada &amp; Suku Cadang</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={maintY1}
                    onFocus={() => setSelectedCell({row: 17, col: "D", val: maintY1.toString(), formula: "", id: "maintY1" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMaintY1(val);
                      setSelectedCell(prev => prev.row === 17 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={maintY2}
                    onFocus={() => setSelectedCell({row: 17, col: "E", val: maintY2.toString(), formula: "", id: "maintY2" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMaintY2(val);
                      setSelectedCell(prev => prev.row === 17 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={maintY3}
                    onFocus={() => setSelectedCell({row: 17, col: "F", val: maintY3.toString(), formula: "", id: "maintY3" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMaintY3(val);
                      setSelectedCell(prev => prev.row === 17 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Sewa */}
              <tr className="hover:bg-slate-50 h-7" onClick={() => setSelectedCell({row: 18, col: "C", val: "Sewa Kantor", formula: "" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">18</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left text-slate-600">- Sewa Kantor &amp; Ops Admin</td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={sewaY1}
                    onFocus={() => setSelectedCell({row: 18, col: "D", val: sewaY1.toString(), formula: "", id: "sewaY1" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSewaY1(val);
                      setSelectedCell(prev => prev.row === 18 && prev.col === "D" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={sewaY2}
                    onFocus={() => setSelectedCell({row: 18, col: "E", val: sewaY2.toString(), formula: "", id: "sewaY2" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSewaY2(val);
                      setSelectedCell(prev => prev.row === 18 && prev.col === "E" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-300 p-0 text-right bg-white relative">
                  <input 
                    type="number"
                    value={sewaY3}
                    onFocus={() => setSelectedCell({row: 18, col: "F", val: sewaY3.toString(), formula: "", id: "sewaY3" })}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSewaY3(val);
                      setSelectedCell(prev => prev.row === 18 && prev.col === "F" ? { ...prev, val: val.toString() } : prev);
                    }}
                    className="w-full h-full text-right outline-none border-none px-2 text-[10.5px] font-mono text-slate-800"
                  />
                </td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Total Opex */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-100" onClick={() => setSelectedCell({row: 19, col: "C", val: totalOpexY1.toString(), formula: "=SUM(D15:D18)" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">19</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">TOTAL OPEX (PENGELUARAN OPS)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY1)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY2)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-slate-900 text-xs">Rp {formatIDR(totalOpexY3)}</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* LABA BERSIH */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-[#e2efda] text-[#385723]" onClick={() => setSelectedCell({row: 20, col: "C", val: netProfitY1.toString(), formula: "=D13-D19" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">20</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">LABA BERSIH (NET PROFIT)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY1)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY2)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY3)}</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* PROFIT MARGIN */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 21, col: "C", val: npmY1.toFixed(1) + "%", formula: "=D20/D13" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">21</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">NET PROFIT MARGIN (%)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">{npmY1.toFixed(1)}%</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">{npmY2.toFixed(1)}%</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">{npmY3.toFixed(1)}%</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* CASH FLOW HEADER */}
              <tr className="h-6 font-bold bg-slate-100">
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">22</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">LAPORAN ARUS KAS (CASH FLOW)</td>
                <td colSpan={3} className="border border-slate-300"></td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Arus Kas Keluar CAPEX */}
              <tr className="hover:bg-slate-50 h-7 text-red-600" onClick={() => setSelectedCell({row: 23, col: "C", val: `-${totalCapex}`, formula: "=-C10" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">23</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left">- Investasi Awal (CAPEX)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs font-bold">(Rp {formatIDR(totalCapex)})</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp 0</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp 0</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* Ops Inflow */}
              <tr className="hover:bg-slate-50 h-7 text-[#166534]" onClick={() => setSelectedCell({row: 24, col: "C", val: netProfitY1.toString(), formula: "=D20" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">24</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-4 text-left">+ Kas Masuk Operasional (Net Profit)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY1)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY2)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(netProfitY3)}</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* NET CASH FLOW */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-slate-50" onClick={() => setSelectedCell({row: 25, col: "C", val: netCashFlowY1.toString(), formula: "=D23+D24" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">25</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">ARUS KAS BERSIH (NET CASH FLOW)</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs text-red-650">
                  {netCashFlowY1 < 0 ? `(Rp ${formatIDR(Math.abs(netCashFlowY1))})` : `Rp ${formatIDR(netCashFlowY1)}`}
                </td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs text-[#166534]">Rp {formatIDR(netCashFlowY2)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs text-[#166534]">Rp {formatIDR(netCashFlowY3)}</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>

              {/* CUMULATIVE SALDO KAS AKHIR */}
              <tr className="hover:bg-slate-50 h-7 font-bold bg-[#d9e1f2] text-[#1f4e78]" onClick={() => setSelectedCell({row: 26, col: "C", val: endCashY3.toString(), formula: "=Accumulated Net Cash Flow" })}>
                <td className="bg-[#f3f2f1] text-center border border-slate-300 font-mono text-slate-400 text-[9px]">26</td>
                <td className="border border-slate-300"></td>
                <td className="border border-slate-300 px-2 text-left">SALDO KAS KUMULATIF</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs text-red-650">
                  {endCashY1 < 0 ? `(Rp ${formatIDR(Math.abs(endCashY1))})` : `Rp ${formatIDR(endCashY1)}`}
                </td>
                <td className="border border-slate-300 px-2 text-right font-mono text-xs">Rp {formatIDR(endCashY2)}</td>
                <td className="border border-slate-300 px-2 text-right font-mono text-[#166534] text-xs">Rp {formatIDR(endCashY3)}</td>
                <td className="border border-slate-200 bg-[#fafafa]"></td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* SPREADSHEET TABS BAR */}
      <div className="bg-[#f3f2f1] border-t border-slate-250 h-9 flex items-center justify-between px-3 text-xs select-none shrink-0 text-slate-700">
        <div className="flex items-center gap-1">
          <div className="flex border-r border-slate-300 pr-2 mr-2 text-slate-400 gap-0.5">
            <button className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer border-none bg-transparent">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer border-none bg-transparent">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab("tamsamsom")}
            className={`flex items-center gap-1.5 px-3.5 h-9 font-bold transition cursor-pointer relative border-none bg-transparent text-xs ${
              activeTab === "tamsamsom" 
                ? "bg-white text-[#107c41] border-t-2 border-t-[#107c41]" 
                : "hover:bg-slate-200 text-slate-500"
            }`}
          >
            <span>1. TAM SAM SOM &amp; Ringkasan Kelayakan</span>
          </button>

          <button
            onClick={() => setActiveTab("pl")}
            className={`flex items-center gap-1.5 px-3.5 h-9 font-bold transition cursor-pointer relative border-none bg-transparent text-xs ${
              activeTab === "pl" 
                ? "bg-white text-[#107c41] border-t-2 border-t-[#107c41]" 
                : "hover:bg-slate-200 text-slate-500"
            }`}
          >
            <span>2. Proyeksi P&amp;L &amp; Cash Flow</span>
          </button>
        </div>

        <div className="text-[9.5px] text-slate-450 font-mono">
          Ready | Auto Calc Active
        </div>
      </div>

      {/* DETAILED EXPLANATION AREA - EXPLAINING THE NUMBERS AND CALCULATIONS */}
      <div className="bg-white border-t border-slate-200 p-5 md:p-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-5 w-5 text-indigo-600" />
          <h5 className="font-bold text-slate-800 text-xs md:text-sm uppercase tracking-tight">
            Penjelasan Detail &amp; Metodologi Perhitungan Finansial
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed text-slate-650">
          <div>
            <h6 className="font-extrabold text-[#1f4e78] uppercase mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
              1. Analisis Ukuran Pasar (Market Sizing)
            </h6>
            <ul className="space-y-2 font-medium list-none pl-0">
              <li>
                <strong className="text-slate-800">TAM (Total Addressable Market): Rp {formatIDR(tam)}</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Merupakan estimasi seluruh ukuran pasar logistik (B3, Industri, dan kargo umum) yang ada di wilayah target pengiriman dalam satu tahun penuh. Angka ini merupakan batasan teoretis atas potensi pasar maksimal.
                </p>
              </li>
              <li>
                <strong className="text-slate-800">SAM (Serviceable Addressable Market): Rp {formatIDR(sam)}</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Bagian dari TAM yang dapat dijangkau secara geografis, regulasi (kepatuhan AMDAL/KLHK), dan spesifikasi armada logistik (seperti vacuum truck atau dump truck) milik Pancaran Group.
                </p>
              </li>
              <li>
                <strong className="text-slate-800">SOM (Serviceable Obtainable Market): Rp {formatIDR(som)}</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Pangsa pasar riil yang ditargetkan untuk dikonversi menjadi pendapatan nyata oleh Pancaran Group dalam 1-3 tahun awal berdasarkan kapasitas utilisasi operasional armada aktif.
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-extrabold text-[#166534] uppercase mb-1.5 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              2. Kelayakan Finansial &amp; Proyeksi Arus Kas
            </h6>
            <ul className="space-y-2 font-medium list-none pl-0">
              <li>
                <strong className="text-slate-800">Total CAPEX (Capital Expenditure): Rp {formatIDR(totalCapex)}</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Pengeluaran modal awal mencakup pembelian/uang muka armada truk logistik (<strong className="text-slate-700">Rp {formatIDR(capexTrucks)}</strong>), integrasi sistem pelaporan Festronik dan TMS (<strong className="text-slate-700">Rp {formatIDR(capexIT)}</strong>), peralatan penanganan limbah (<strong className="text-slate-700">Rp {formatIDR(capexGudang)}</strong>), serta perizinan AMDAL (<strong className="text-slate-700">Rp {formatIDR(capexIzin)}</strong>).
                </p>
              </li>
              <li>
                <strong className="text-slate-800">Net Profit Margin (Rata-rata): {averageNpm.toFixed(1)}%</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Prosentase keuntungan bersih terhadap total pendapatan rata-rata selama 3 tahun. Diperoleh dari total pendapatan tahun berjalan dikurangi pengeluaran operasional (OPEX) seperti bahan bakar, tol, gaji kru, dan pemeliharaan rutin.
                </p>
              </li>
              <li>
                <strong className="text-slate-800">Payback Period / ROI: {paybackPeriodVal.toFixed(1)} Tahun</strong>
                <p className="mt-0.5 text-slate-500 text-[10.5px]">
                  Estimasi jangka waktu yang dibutuhkan agar akumulasi laba bersih operasional (Net Profit) dapat menutupi seluruh pengeluaran investasi awal (Total CAPEX). Proyek dinilai <strong className="text-emerald-700 font-extrabold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">SANGAT LAYAK</strong> karena payback period kurang dari 3 tahun (rata-rata <strong>{paybackPeriodVal.toFixed(1)} tahun</strong>).
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
