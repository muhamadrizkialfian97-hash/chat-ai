import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Truck,
  Building,
  Users,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  ArrowRightLeft,
  Coins,
  MapPin,
  Compass,
  Check,
  Zap,
  BarChart2
} from "lucide-react";

interface SupplyDemandProps {
  projectTitle: string;
}

interface SupplyAsset {
  id: string;
  name: string;
  category: "Armada" | "Fasilitas" | "Sertifikasi";
  capacity: number; // in Tons/day
  unit: string;
  costPerDay: number; // in IDR
  status: "Siap Tempur" | "Pemeliharaan" | "Siaga";
}

interface DemandSector {
  id: string;
  sectorName: string;
  generationRate: number; // Base Tons/day
  growthRate: number; // % annual growth
  description: string;
}

export function SupplyDemandDeepDive({ projectTitle }: SupplyDemandProps) {
  // Active Tab
  const [activeTab, setActiveTab] = useState<"supply" | "demand" | "balance" | "pricing">("supply");

  // 1. Supply-Side Assets (Stateful to allow adding/toggling/disrupting)
  const [supplyAssets, setSupplyAssets] = useState<SupplyAsset[]>([
    {
      id: "sa-1",
      name: "Truk Heavy Duty Multi-Axle (15-20 Ton)",
      category: "Armada",
      capacity: 150, // total capacity tons/day
      unit: "Truk",
      costPerDay: 450000,
      status: "Siap Tempur"
    },
    {
      id: "sa-2",
      name: "Stasiun Transfer & Pemadatan (Compactor)",
      category: "Fasilitas",
      capacity: 100,
      unit: "Stasiun",
      costPerDay: 1200000,
      status: "Siap Tempur"
    },
    {
      id: "sa-3",
      name: "Truk Hook Lift Roll-Off (8-10 Ton)",
      category: "Armada",
      capacity: 80,
      unit: "Truk",
      costPerDay: 320000,
      status: "Siap Tempur"
    },
    {
      id: "sa-4",
      name: "Fasilitas Pemilahan Mekanis (MRF)",
      category: "Fasilitas",
      capacity: 120,
      unit: "Pabrik",
      costPerDay: 2500000,
      status: "Siaga"
    }
  ]);

  // Handler to toggle asset status
  const toggleAssetStatus = (id: string) => {
    setSupplyAssets(prev =>
      prev.map(asset => {
        if (asset.id === id) {
          const nextStatusMap: Record<SupplyAsset["status"], SupplyAsset["status"]> = {
            "Siap Tempur": "Pemeliharaan",
            "Pemeliharaan": "Siaga",
            "Siaga": "Siap Tempur"
          };
          return { ...asset, status: nextStatusMap[asset.status] };
        }
        return asset;
      })
    );
  };

  // 2. Demand-Side Sectors (Stateful with custom volume multipliers)
  const [demandSectors, setDemandSectors] = useState<DemandSector[]>([
    {
      id: "ds-1",
      sectorName: "Limbah Rumah Tangga & Pemukiman",
      generationRate: 90,
      growthRate: 3.5,
      description: "Volume stabil yang bersumber dari klaster perumahan padat penduduk."
    },
    {
      id: "ds-2",
      sectorName: "Komersil & Ritel (Mall, Hotel, Restoran)",
      generationRate: 65,
      growthRate: 5.2,
      description: "Fluktuasi tinggi di akhir pekan, memerlukan respons penjemputan cepat."
    },
    {
      id: "ds-3",
      sectorName: "Kawasan Industri & Logistik Gudang",
      generationRate: 110,
      growthRate: 7.8,
      description: "Limbah anorganik padat berdensitas tinggi, didominasi palet kayu & sisa kemasan."
    },
    {
      id: "ds-4",
      sectorName: "Fasilitas Kesehatan & Medis Non-B3",
      generationRate: 30,
      growthRate: 2.1,
      description: "Audit pembuangan sangat ketat dengan standar sanitasi tanpa kompromi."
    }
  ]);

  // Sliders for dynamic demand scaling
  const [householdScale, setHouseholdScale] = useState<number>(100); // in %
  const [commercialScale, setCommercialScale] = useState<number>(100); // in %
  const [industrialScale, setIndustrialScale] = useState<number>(100); // in %
  const [medicalScale, setMedicalScale] = useState<number>(100); // in %

  // 3. Operational Balance Action Toggles
  const [opsStrategies, setOpsStrategies] = useState([
    { id: "ops-1", title: "Rute Dinamis Berbasis Sensor IoT", description: "Pengalihan otomatis truk pengangkut ke TPS dengan volume antrean terendah.", active: true },
    { id: "ops-2", title: "Shift Malam Fleksibel (Dynamic Overtime)", description: "Pengoperasian armada ekstra di jam non-sibuk untuk menghindari macet jalan raya.", active: false },
    { id: "ops-3", title: "Kemitraan Swasta Lokal (Backup Fleet)", description: "Akses sewa armada pihak ketiga berskala instan saat terjadi lonjakan musiman.", active: true },
    { id: "ops-4", title: "Sistem Pemadatan Volume di Truk", description: "Meningkatkan densitas angkutan limbah basah sehingga mengurangi ritase perjalanan.", active: true }
  ]);

  const toggleOpsStrategy = (id: string) => {
    setOpsStrategies(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // 4. Pricing Strategy Interactive State
  const [basePricePerTon, setBasePricePerTon] = useState<number>(285000); // IDR per Ton
  const [avgDistanceKm, setAvgDistanceKm] = useState<number>(28); // KM to Processing site
  const [wasteDensityFactor, setWasteDensityFactor] = useState<number>(1.2); // 0.8 to 1.8
  const [isContractLongTerm, setIsContractLongTerm] = useState<boolean>(true);

  // CALCULATIONS
  // Supply Capacity (Only counting "Siap Tempur" and "Siaga" with reduced capacity)
  const totalAvailableSupply = supplyAssets.reduce((sum, asset) => {
    if (asset.status === "Siap Tempur") return sum + asset.capacity;
    if (asset.status === "Siaga") return sum + (asset.capacity * 0.5); // Siaga provides 50% capacity
    return sum; // Pemeliharaan provides 0% capacity
  }, 0);

  // Demand Generation
  const totalDemand = 
    (demandSectors[0].generationRate * (householdScale / 100)) +
    (demandSectors[1].generationRate * (commercialScale / 100)) +
    (demandSectors[2].generationRate * (industrialScale / 100)) +
    (demandSectors[3].generationRate * (medicalScale / 100));

  // Balance Index & Operational Analysis
  const balanceIndex = totalAvailableSupply > 0 ? (totalDemand / totalAvailableSupply) * 100 : 999;
  
  let balanceStatus: "Optimal" | "Kritis (Kekurangan Kapasitas)" | "In-efisien (Kelebihan Kapasitas)" = "Optimal";
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-500/10 border-emerald-500/20";
  let statusDesc = "Kapasitas armada penawaran dan volume permintaan berada pada titik kesetimbangan prima (80%-95% utilisasi).";

  if (balanceIndex > 100) {
    balanceStatus = "Kritis (Kekurangan Kapasitas)";
    statusColor = "text-rose-400";
    statusBg = "bg-rose-500/10 border-rose-500/20";
    statusDesc = "Permintaan melebihi kapasitas operasional penawaran yang aktif! Risiko terjadi penumpukan limbah dan antrean armada di gerbang transfer station.";
  } else if (balanceIndex < 70) {
    balanceStatus = "In-efisien (Kelebihan Kapasitas)";
    statusColor = "text-amber-400";
    statusBg = "bg-amber-500/10 border-amber-500/20";
    statusDesc = "Armada dan fasilitas menganggur terlalu tinggi. Utilisasi di bawah 70% berisiko menekan margin keuntungan bersih akibat biaya operasional tetap.";
  }

  // PRICING CALCULATIONS
  // Adjust base price with density, distance premium, and loyalty discount
  const distancePremium = avgDistanceKm > 20 ? (avgDistanceKm - 20) * 4500 : 0;
  const rawPrice = (basePricePerTon * wasteDensityFactor) + distancePremium;
  const loyaltyDiscount = isContractLongTerm ? 0.90 : 1.0; // 10% discount for long term
  const finalPricePerTon = Math.round(rawPrice * loyaltyDiscount);

  // Estimated Monthly & Annual Revenue based on calculated final price and total demand volume
  const estDailyRevenue = totalDemand * finalPricePerTon;
  const estMonthlyRevenue = estDailyRevenue * 30;
  const estAnnualRevenue = estDailyRevenue * 365;

  return (
    <div id="supply-demand-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans relative">
      {/* Background radial effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              PRAMA LOGISTICS ENGINEERING
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Layers className="h-5 w-5 text-indigo-400" />
            Interactive Supply & Demand Operations Hub
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Pusat perencanaan terpadu kapasitas penawaran armada, simulasi volume permintaan multi-sektor, manajemen rasio keseimbangan rute, serta pemodelan harga tarif angkutan per ton.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Status Keseimbangan:</span>
          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border uppercase ${
            balanceStatus === "Optimal" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : balanceStatus === "Kritis (Kekurangan Kapasitas)"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            {Math.round(balanceIndex)}% UTILISASI ({balanceStatus.split(" ")[0]})
          </span>
        </div>
      </div>

      {/* PILLAR TABS (Matching the 4 specified points) */}
      <div className="flex flex-wrap gap-2 mb-6 justify-start relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("supply")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === "supply"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Settings className="h-4 w-4" />
          1. Sisi Penawaran (Supply)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("demand")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === "demand"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          2. Sisi Permintaan (Demand)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("balance")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === "balance"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          3. Keseimbangan Operasional
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeTab === "pricing"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          4. Taktik Volume & Pricing
        </button>
      </div>

      {/* TAB WORKSPACE CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* PILAR 1: SUPPLY-SIDE ASSETS */}
        {activeTab === "supply" && (
          <motion.div
            key="supply-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Asset List & Status Controller */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-indigo-400" />
                  Pilar Utama Kapasitas Penawaran (Logistics Fleet Assets)
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Konfigurasikan kapasitas armada angkut aktif Anda di lapangan. Klik tombol status untuk mensimulasikan downtime pemeliharaan truk atau kesiapan stasiun transfer mekanis.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplyAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => toggleAssetStatus(asset.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[120px] ${
                        asset.status === "Siap Tempur"
                          ? "bg-slate-900 border-indigo-500/40 text-white hover:border-indigo-500"
                          : asset.status === "Siaga"
                          ? "bg-slate-900/60 border-amber-600/30 text-slate-300 hover:border-amber-600/60"
                          : "bg-slate-950/80 border-rose-950/80 text-slate-500 hover:border-rose-900/80"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`px-1.5 py-0.2 text-[8px] font-mono font-black rounded uppercase ${
                              asset.category === "Armada" ? "bg-indigo-500/10 text-indigo-400" : "bg-sky-500/10 text-sky-400"
                            }`}>
                              {asset.category}
                            </span>
                            <span className="text-[9px] text-slate-600">•</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{asset.unit}</span>
                          </div>
                          <h5 className="text-[11.5px] font-black uppercase tracking-tight line-clamp-1">
                            {asset.name}
                          </h5>
                        </div>
                        
                        {/* Status badge and dot */}
                        <div className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            asset.status === "Siap Tempur" ? "bg-emerald-500" : asset.status === "Siaga" ? "bg-amber-400" : "bg-rose-500 animate-pulse"
                          }`} />
                          <span className="text-[8.5px] font-black uppercase tracking-wider">{asset.status}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <span className="text-[9px] text-slate-500 font-black block">KAPASITAS ANGKUT</span>
                          <span className="text-sm font-black text-white font-mono">{asset.capacity} Ton / Hari</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 font-black block">OPERATIONAL COST</span>
                          <span className="text-[10px] font-black text-emerald-400 font-mono">Rp {asset.costPerDay.toLocaleString("id-ID")}/Hari</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  💡 <strong>Simulasi Klik:</strong> Mengubah status armada ke <strong>Pemeliharaan</strong> memangkas pasokan supply secara real-time untuk melihat kekuatan resiliensi sistem.
                </span>
              </div>
            </div>

            {/* Total Supply Capacity summary panel */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  SUPPLY CAPACITY AUDIT
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Analisis Penawaran Lapangan
                </h4>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-black block mb-0.5">KAPASITAS AKTIF TERSEDIA</span>
                    <div className="text-2xl font-black text-indigo-400 font-mono">
                      {totalAvailableSupply} Ton <span className="text-xs text-slate-400 font-bold">/ Hari</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, (totalAvailableSupply/500)*100)}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-850 text-[10.5px] space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Armada Siap Tempur:</span>
                      <span className="text-emerald-400 font-black">{supplyAssets.filter(a => a.status === "Siap Tempur").length} Aktif</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Armada Siaga (50%):</span>
                      <span className="text-amber-400 font-black">{supplyAssets.filter(a => a.status === "Siaga").length} Siaga</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Dalam Perawatan (0%):</span>
                      <span className="text-rose-400 font-black">{supplyAssets.filter(a => a.status === "Pemeliharaan").length} Bengkel</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Sistem penawaran diperkuat oleh depo cadangan dan armada siaga untuk menjamin SLA pengangkutan korporasi &gt;98.5%.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA LOGISTICS CAPABILITY INDEX v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* PILAR 2: DEMAND-SIDE SECTOR SLIDERS */}
        {activeTab === "demand" && (
          <motion.div
            key="demand-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Sector Volume Sliders */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  Kuantifikasi Sisi Permintaan Pasar (Market Demand Generator)
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Geser skala volume di bawah untuk mensimulasikan fluktuasi penimbunan limbah harian pada masing-masing klaster kawasan klien logistik.
                </p>

                <div className="space-y-4">
                  {/* Slider 1 */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <span className="text-slate-200 font-black uppercase tracking-tight">{demandSectors[0].sectorName}</span>
                      <span className="text-sky-400 font-black font-mono">
                        {(demandSectors[0].generationRate * (householdScale / 100)).toFixed(1)} Ton/Hari ({householdScale}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={householdScale}
                      onChange={(e) => setHouseholdScale(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                      {demandSectors[0].description} • Tren Pertumbuhan Tahunan: +{demandSectors[0].growthRate}%
                    </span>
                  </div>

                  {/* Slider 2 */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <span className="text-slate-200 font-black uppercase tracking-tight">{demandSectors[1].sectorName}</span>
                      <span className="text-indigo-400 font-black font-mono">
                        {(demandSectors[1].generationRate * (commercialScale / 100)).toFixed(1)} Ton/Hari ({commercialScale}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={commercialScale}
                      onChange={(e) => setCommercialScale(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                      {demandSectors[1].description} • Tren Pertumbuhan Tahunan: +{demandSectors[1].growthRate}%
                    </span>
                  </div>

                  {/* Slider 3 */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <span className="text-slate-200 font-black uppercase tracking-tight">{demandSectors[2].sectorName}</span>
                      <span className="text-teal-400 font-black font-mono">
                        {(demandSectors[2].generationRate * (industrialScale / 100)).toFixed(1)} Ton/Hari ({industrialScale}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={industrialScale}
                      onChange={(e) => setIndustrialScale(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                      {demandSectors[2].description} • Tren Pertumbuhan Tahunan: +{demandSectors[2].growthRate}%
                    </span>
                  </div>

                  {/* Slider 4 */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <span className="text-slate-200 font-black uppercase tracking-tight">{demandSectors[3].sectorName}</span>
                      <span className="text-purple-400 font-black font-mono">
                        {(demandSectors[3].generationRate * (medicalScale / 100)).toFixed(1)} Ton/Hari ({medicalScale}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={medicalScale}
                      onChange={(e) => setMedicalScale(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                      {demandSectors[3].description} • Tren Pertumbuhan Tahunan: +{demandSectors[3].growthRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  Volume limbah dihitung berdasarkan standar timbulan sampah nasional per kapita dan aktivitas bisnis korporasi regional.
                </span>
              </div>
            </div>

            {/* Demand Summary Panel */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  DEMAND SUMMARY METRICS
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Akumulasi Permintaan
                </h4>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-black block mb-0.5">TOTAL GENERASI LIMBAH AKTIF</span>
                    <div className="text-2xl font-black text-teal-400 font-mono animate-pulse">
                      {totalDemand.toFixed(1)} Ton <span className="text-xs text-slate-400 font-bold">/ Hari</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">
                      Rata-rata laju peningkatan musiman diestimasikan berfluktuasi ±12% di libur nasional.
                    </p>
                  </div>

                  {/* Small Bar graph equivalents using raw styled divs */}
                  <div className="bg-slate-900/80 p-3.5 border border-slate-850 rounded-xl text-[10px] space-y-2.5">
                    <span className="text-[8.5px] text-slate-500 font-black block mb-1">DISTRIBUSI VOLUMETRIK</span>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-400 text-[9px]">
                        <span>Rumah Tangga</span>
                        <span>{(demandSectors[0].generationRate * (householdScale / 100)).toFixed(0)} T</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full" style={{ width: `${Math.min(100, ((demandSectors[0].generationRate * (householdScale / 100)) / totalDemand)*100)}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-400 text-[9px]">
                        <span>Komersil</span>
                        <span>{(demandSectors[1].generationRate * (commercialScale / 100)).toFixed(0)} T</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, ((demandSectors[1].generationRate * (commercialScale / 100)) / totalDemand)*100)}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-400 text-[9px]">
                        <span>Industri</span>
                        <span>{(demandSectors[2].generationRate * (industrialScale / 100)).toFixed(0)} T</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full" style={{ width: `${Math.min(100, ((demandSectors[2].generationRate * (industrialScale / 100)) / totalDemand)*100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                MARKET PENETRATION FORECAST v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* PILAR 3: OPERATIONAL BALANCE MANAGEMENT */}
        {activeTab === "balance" && (
          <motion.div
            key="balance-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Balance Toggles & Dashboard */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <ArrowRightLeft className="h-4 w-4 text-indigo-400" />
                  Manajemen Keseimbangan Operasional Terdistribusi
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Pasang taktik mitigasi operasional di bawah untuk menyeimbangkan dinamika logistik secara dinamis guna meminimalkan biaya ritase angkut kosong (deadhead miles).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {opsStrategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      onClick={() => toggleOpsStrategy(strategy.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[105px] ${
                        strategy.active
                          ? "bg-indigo-950/20 border-indigo-900/50 text-indigo-300 hover:border-indigo-800"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-[10.5px] font-black uppercase tracking-tight truncate max-w-[170px]">
                            {strategy.title}
                          </h5>
                          <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 ${
                            strategy.active ? "bg-indigo-500 border-indigo-400 text-slate-900" : "border-slate-700"
                          }`}>
                            {strategy.active && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                          {strategy.description}
                        </p>
                      </div>

                      <span className={`text-[8.5px] font-black uppercase mt-1 ${strategy.active ? "text-indigo-400" : "text-slate-500"}`}>
                        {strategy.active ? "✓ Sistem Aktif" : "✗ Non-Aktif"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  Optimalisasi keseimbangan operasional membantu Pancaran Group mempertahankan emisi karbon rute seminimal mungkin (ESG Compliant).
                </span>
              </div>
            </div>

            {/* Live Balance Dial Panel */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  REAL-TIME CAPACITY DIAL
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Neraca Keseimbangan
                </h4>

                <div className="space-y-4">
                  {/* Visual meters comparing active supply vs active demand */}
                  <div className="bg-slate-900/80 p-4 border border-slate-850 rounded-xl space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] font-black text-indigo-400 mb-1">
                        <span>SUPPLY (PENAWARAN ARMADA)</span>
                        <span>{totalAvailableSupply} T/Hari</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all" style={{ width: `${Math.min(100, (totalAvailableSupply/350)*100)}%` }} />
                      </div>
                    </div>

                    <div className="text-center py-1">
                      <Zap className="h-4 w-4 text-amber-400 mx-auto animate-bounce mb-1" />
                      <span className="text-[10px] text-slate-500 font-black block">RASIO KAPASITAS / BEBAN</span>
                      <span className="text-xl font-black font-mono text-white">
                        {balanceIndex.toFixed(0)}%
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-black text-teal-400 mb-1">
                        <span>DEMAND (VOLUME MASUK)</span>
                        <span>{totalDemand.toFixed(0)} T/Hari</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full transition-all" style={{ width: `${Math.min(100, (totalDemand/350)*100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Balance Analysis Alert */}
                  <div className={`p-3 border rounded-xl text-[10px] font-semibold leading-relaxed ${statusBg} ${statusColor}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span className="font-black uppercase tracking-wider">{balanceStatus}</span>
                    </div>
                    <p className="text-slate-300">{statusDesc}</p>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA OPERATIONAL MATRIX ENGINE v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* PILAR 4: PRICING & VOLUME TACTICS */}
        {activeTab === "pricing" && (
          <motion.div
            key="pricing-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Pricing Parameters Panel */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-indigo-400" />
                  Strategi Penentuan Harga Tarif & Volume Jangka Panjang
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Sesuaikan parameter di bawah untuk memformulasikan tarif logistik per ton yang bersaing dengan tetap mengamankan persentase pengembalian modal yang tinggi.
                </p>

                <div className="space-y-4 text-xs">
                  {/* Slider 1: Base Price */}
                  <div>
                    <div className="flex justify-between mb-1 text-[10.5px]">
                      <span className="text-slate-400 font-bold">Tarif Dasar / Ton</span>
                      <span className="text-white font-black">Rp {basePricePerTon.toLocaleString("id-ID")}</span>
                    </div>
                    <input
                      type="range"
                      min="150000"
                      max="450000"
                      step="5000"
                      value={basePricePerTon}
                      onChange={(e) => setBasePricePerTon(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Slider 2: Distance */}
                  <div>
                    <div className="flex justify-between mb-1 text-[10.5px]">
                      <span className="text-slate-400 font-bold">Rata-rata Jarak Tempuh ke Lokasi Bongkar</span>
                      <span className="text-white font-black">{avgDistanceKm} KM</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="1"
                      value={avgDistanceKm}
                      onChange={(e) => setAvgDistanceKm(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                      * Jarak di atas 20 KM dikenakan biaya tambahan premium solar Rp 4.500/KM per ton.
                    </span>
                  </div>

                  {/* Multi-selector: Density Factor */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1.5">Faktor Densitas / Kepadatan Area Layanan</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Kepadatan Rendah (Komersil)", factor: 0.9, color: "border-sky-500/20 hover:border-sky-500" },
                        { label: "Kepadatan Normal (Campuran)", factor: 1.2, color: "border-indigo-500/20 hover:border-indigo-500" },
                        { label: "Kepadatan Tinggi (Pabrik)", factor: 1.6, color: "border-teal-500/20 hover:border-teal-500" }
                      ].map((item) => {
                        const isSelected = Math.abs(wasteDensityFactor - item.factor) < 0.05;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setWasteDensityFactor(item.factor)}
                            className={`p-2 rounded-lg border text-left text-[10px] font-semibold transition cursor-pointer ${
                              isSelected ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            <div className="truncate font-black uppercase mb-0.5">{item.label}</div>
                            <span className="text-[9px] font-mono opacity-80">Multiplier: {item.factor}x</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contract long term discount toggle */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <h5 className="text-[11px] font-black text-slate-200 uppercase tracking-tight">Klausul Kontrak Eksklusif Jangka Panjang</h5>
                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Berikan diskon 10% untuk kemitraan korporasi &gt;36 bulan.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsContractLongTerm(prev => !prev)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer border ${
                        isContractLongTerm 
                          ? "bg-emerald-600 border-emerald-500 text-white" 
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      {isContractLongTerm ? "AKTIF (-10%)" : "NON-AKTIF"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  Formulasi pricing di atas diselaraskan dengan fluktuasi harga BBM non-subsidi guna mengamankan arus kas operasional utama.
                </span>
              </div>
            </div>

            {/* Pricing Live Outputs Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  LOGISTICS REVENUE SIMULATION
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Hasil Formulasi Pricing
                </h4>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-black block mb-0.5">TARIF AKHIR NETTO / TON</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      Rp {finalPricePerTon.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-bold">/ Ton</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold block mt-1">
                      Sudah termasuk multiplier beban kerja dan potongan diskon kontrak eksklusif.
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-850 text-[10.5px] space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Generasi Beban Harian:</span>
                      <span className="text-white font-bold">{totalDemand.toFixed(1)} Ton / Hari</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Estimasi Bruto / Hari:</span>
                      <span className="text-white font-bold">Rp {estDailyRevenue.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400">Estimasi Bruto / Bulan:</span>
                      <span className="text-indigo-400 font-black">Rp {estMonthlyRevenue.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="h-px bg-slate-800 my-1" />
                    <div className="text-left">
                      <span className="text-[9px] text-slate-500 font-black block">PROYEKSI REVENUE TOTAL TAHUNAN</span>
                      <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                        Rp {estAnnualRevenue.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA PROJECT REVENUE SIMULATOR v1.2
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
