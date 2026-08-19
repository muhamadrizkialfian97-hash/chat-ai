import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  AlertTriangle,
  Cpu,
  CheckCircle,
  Activity,
  Compass,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  DollarSign,
  Truck,
  Leaf,
  ShieldAlert,
  MapPin,
  Maximize2,
  Minimize2,
  Sparkles,
  Info
} from "lucide-react";
import { getSectorOpportunityProfile } from "../utils/sectorOpportunityHelper";

interface MarketOpportunityProps {
  projectTitle: string;
}

interface CustomOpportunity {
  id: string;
  category: "driver" | "gap" | "tech" | "green";
  title: string;
  impact: "Tinggi" | "Sedang" | "Rendah";
  description: string;
}

export function MarketOpportunityDeepDive({ projectTitle }: MarketOpportunityProps) {
  const profile = getSectorOpportunityProfile(projectTitle);

  // 1. Interactive States for Estimator
  const [volume, setVolume] = useState<number>(15000); // Unit/month
  const [premiumRate, setPremiumRate] = useState<number>(8); // % increase
  const [efficiency, setEfficiency] = useState<number>(15); // % tech efficiency boost
  const [baseTariff, setBaseTariff] = useState<number>(350000); // IDR per unit base

  // 2. Active Tab State for Pillars
  const [activeTab, setActiveTab] = useState<"drivers" | "gap" | "tech" | "green">("drivers");

  // 3. Mini-simulators states
  const [cargoWeight, setCargoWeight] = useState<number>(32);
  const [axles, setAxles] = useState<number>(3);
  const [axleFeedback, setAxleFeedback] = useState<string>("");

  // Satellite Tracking Ping Simulator
  const [pingStatus, setPingStatus] = useState<"idle" | "pinging" | "connected">("idle");
  const [activeTrucks, setActiveTrucks] = useState(profile.pingTrucks);

  useEffect(() => {
    setActiveTrucks(profile.pingTrucks);
    setAxleFeedback("");
  }, [projectTitle]);

  // 4. Custom User Added Opportunities
  const [customOps, setCustomOps] = useState<CustomOpportunity[]>([
    {
      id: "op-1",
      category: "gap",
      title: "Jalur Hauling Khusus Musim Hujan",
      impact: "Tinggi",
      description: "Mitra yang memiliki keahlian pemeliharaan jalan lateral dengan material gravel agar hauling tidak terhenti saat hujan lebat."
    }
  ]);
  const [newOpTitle, setNewOpTitle] = useState("");
  const [newOpCat, setNewOpCat] = useState<"driver" | "gap" | "tech" | "green">("gap");
  const [newOpImpact, setNewOpImpact] = useState<"Tinggi" | "Sedang" | "Rendah">("Tinggi");
  const [newOpDesc, setNewOpDesc] = useState("");

  // 5. Readiness self-evaluation
  const [readinessScores, setReadinessScores] = useState({
    drivers: "Ready",
    gap: "Progress",
    tech: "Progress",
    green: "Planned"
  });

  // Live Math Calculations
  const baseMonthlyRevenue = volume * baseTariff;
  const greenPremiumBenefit = baseMonthlyRevenue * (premiumRate / 100);
  const techSavings = (baseMonthlyRevenue * 0.45) * (efficiency / 100); // assume 45% is fuel/operational cost
  const totalFinancialBenefit = greenPremiumBenefit + techSavings;
  const estimatedCarbonSaved = (volume * 0.012) * (efficiency / 100); // 12kg CO2 per ton-km base estimate

  const handleRunAxleCheck = () => {
    const maxCapacity = axles * 10; // Simple logging rule: 10 tons per axle allowance in logging road
    if (cargoWeight > maxCapacity + 3) {
      setAxleFeedback(`❌ OVERLOAD DETECTED! Muatan ${cargoWeight} Ton melebihi kapasitas aman armada ${axles}-As (${maxCapacity} Ton). Direkomendasikan kurangi muatan sebesar ${Math.ceil(cargoWeight - maxCapacity)} Ton atau gunakan armada 4-As / Tronton.`);
    } else if (cargoWeight < maxCapacity - 5) {
      setAxleFeedback(`⚠️ UNDERLOAD WARNING: Efisiensi muatan rendah (${Math.round((cargoWeight/maxCapacity)*100)}%). Armada ${axles}-As memiliki kapasitas tersisa. Anda dapat menambah muatan hingga ${maxCapacity} Ton untuk mengoptimalkan ritase.`);
    } else {
      setAxleFeedback(`✅ MUATAN OPTIMAL! Beban ${cargoWeight} Ton pada armada ${axles}-As terdistribusi merata dengan indeks tekanan permukaan ban sangat aman untuk melintasi logging road.`);
    }
  };

  const simulatePing = () => {
    setPingStatus("pinging");
    setTimeout(() => {
      setPingStatus("connected");
      // randomize speed a bit
      setActiveTrucks(prev => prev.map(t => ({
        ...t,
        speed: Math.floor(Math.random() * 30) + 15
      })));
    }, 1200);
  };

  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpTitle.trim()) return;
    const item: CustomOpportunity = {
      id: `op-${Date.now()}`,
      category: newOpCat,
      title: newOpTitle,
      impact: newOpImpact,
      description: newOpDesc || "Tidak ada rincian tambahan."
    };
    setCustomOps(prev => [item, ...prev]);
    setNewOpTitle("");
    setNewOpDesc("");
  };

  const handleDeleteOp = (id: string) => {
    setCustomOps(prev => prev.filter(x => x.id !== id));
  };

  return (
    <div id="market-opportunity-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans">
      {/* Decorative background grids */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {profile.sectorBadge}
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Interactive Market Opportunity Deep-Dive Hub
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Simulasikan nilai ekonomi, dekarbonisasi, serta analisis kesenjangan logistik pengangkutan proyek <span className="text-emerald-300 font-extrabold">"{projectTitle || "Kajian Strategis PRAMA"}"</span> secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Status Kesiapan:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            STRATEGIC ADVANCED
          </span>
        </div>
      </div>

      {/* SECTION 1: LIVE FINANCIAL & ESG FEASIBILITY ESTIMATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              1. Simulator Variabel Finansial & ESG ({profile.sectorName})
            </h4>
            
            {/* Slider 1 */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-bold">Target Volume Hauling Bulanan</span>
                <span className="text-emerald-400 font-black">{volume.toLocaleString("id-ID")} Unit / Bulan</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-bold">
                <span>5.000 Unit</span>
                <span>25.000 Unit</span>
                <span>50.000 Unit</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-bold">{profile.estimatorSlider2Label}</span>
                <span className="text-indigo-400 font-black">+{premiumRate}% Tarif Premium</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={premiumRate}
                onChange={(e) => setPremiumRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-bold">
                <span>+2% Rate</span>
                <span>+10% Rate</span>
                <span>+20% Rate</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-bold">Efisiensi Rantai Pasok Teknologi (IoT & Route Optimization)</span>
                <span className="text-sky-400 font-black">+{efficiency}% Pangkas Biaya</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-bold">
                <span>+5% Efisiensi</span>
                <span>+18% Efisiensi</span>
                <span>+30% Efisiensi</span>
              </div>
            </div>

            {/* Base Tariff Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">{profile.estimatorTariffLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-xs font-bold">Rp</span>
                </div>
                <input
                  type="text"
                  value={baseTariff.toLocaleString("id-ID")}
                  onChange={(e) => {
                    const raw = Number(e.target.value.replace(/\D/g, "")) || 0;
                    setBaseTariff(raw);
                  }}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Proyeksi Dampak Bisnis & ESG
            </h4>

            <div className="space-y-4">
              {/* Output 1: Monthly Benefit */}
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Dampak Finansial Tambahan Bulanan (Uplift)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-black text-emerald-400">
                    +Rp {(totalFinancialBenefit).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">/ Bulan</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-bold">
                  <span>Premium Hijau: Rp {greenPremiumBenefit.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                  <span>Hemat Ops: Rp {techSavings.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Output 2: Carbon Reduced */}
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Estimasi Pengurangan Emisi Karbon (ESG)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-indigo-400">
                    -{estimatedCarbonSaved.toFixed(1)} Ton CO2e
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">/ Tahun</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                  Ekuivalen dengan menanam {Math.round(estimatedCarbonSaved * 15)} pohon dewasa karena sirkuit rute logistik hijau yang teroptimasi.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-semibold flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            Perhitungan di atas menggunakan model estimasi logistik kehutanan berkelanjutan Pancaran Group.
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE DEEP DIVE ACCORDION FOR THE 3 REQUESTED PILLARS */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("drivers")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "drivers"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            1. Pendorong Pasar (Drivers)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gap")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "gap"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            2. Celah Pasar (Gap)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tech")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "tech"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            3. Inovasi Teknologi (Tech)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("green")}
            className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "green"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Leaf className="h-3.5 w-3.5" />
            4. Nilai Tambah Hijau (Green)
          </button>
        </div>

        {/* Tab content wrapper */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 text-left">
          {activeTab === "drivers" && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight">🚀 {profile.driversTitle}</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{profile.driversSubtitle}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">Evaluasi Internal:</span>
                  <select
                    value={readinessScores.drivers}
                    onChange={(e) => setReadinessScores(prev => ({ ...prev, drivers: e.target.value }))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-emerald-400 focus:outline-none"
                  >
                    <option value="Ready">Sangat Siap (Ready)</option>
                    <option value="Progress">Menyiapkan (Progress)</option>
                    <option value="Planned">Rencana Kemitraan (Planned)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {profile.driversList.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-indigo-500" : "bg-teal-500"}`} />
                    <span className="text-[10px] font-mono text-slate-500 font-black block uppercase mb-1">DRV-0{idx + 1} • {item.tag}</span>
                    <h6 className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{item.title}</h6>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "gap" && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight">🎯 {profile.gapsTitle}</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{profile.gapsSubtitle}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">Evaluasi Internal:</span>
                  <select
                    value={readinessScores.gap}
                    onChange={(e) => setReadinessScores(prev => ({ ...prev, gap: e.target.value }))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-indigo-400 focus:outline-none"
                  >
                    <option value="Ready">Sangat Siap (Ready)</option>
                    <option value="Progress">Menyiapkan (Progress)</option>
                    <option value="Planned">Rencana Kemitraan (Planned)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {profile.gapsList.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? "bg-rose-500" : idx === 1 ? "bg-amber-500" : "bg-purple-500"}`} />
                    <span className="text-[10px] font-mono text-slate-500 font-black block uppercase mb-1">GAP-0{idx + 1} • {item.tag}</span>
                    <h6 className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{item.title}</h6>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "tech" && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight">💻 {profile.techTitle}</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{profile.techSubtitle}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">Evaluasi Internal:</span>
                  <select
                    value={readinessScores.tech}
                    onChange={(e) => setReadinessScores(prev => ({ ...prev, tech: e.target.value }))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-sky-400 focus:outline-none"
                  >
                    <option value="Ready">Sangat Siap (Ready)</option>
                    <option value="Progress">Menyiapkan (Progress)</option>
                    <option value="Planned">Rencana Kemitraan (Planned)</option>
                  </select>
                </div>
              </div>

              {/* Grid with 2 columns: Mini Simulators */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                {/* Simulator 1: Axle Load Calc */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <h6 className="text-[11.5px] font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-sky-400" />
                    Interactive IoT Axle Overload Simulator
                  </h6>
                  <p className="text-[9.5px] text-slate-400 font-semibold mb-3">
                    Simulasikan pemantauan berat muatan secara digital untuk menghindari denda operasional &amp; kelebihan beban.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold mb-1">Total Muatan (Ton)</label>
                      <input
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(Number(e.target.value))}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white font-bold"
                        min="5"
                        max="60"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold mb-1">Konfigurasi As Truk (Axles)</label>
                      <select
                        value={axles}
                        onChange={(e) => setAxles(Number(e.target.value))}
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white font-bold"
                      >
                        <option value={2}>2-As (Colt Diesel / Light Duty)</option>
                        <option value={3}>3-As (Tronton / Heavy Duty)</option>
                        <option value={4}>4-As (Trailer Semi-Heavy)</option>
                        <option value={5}>5-As (Rigid + Trailer Heavy)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAxleCheck}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] transition rounded text-[10px] font-black text-white uppercase border-none cursor-pointer"
                  >
                    Jalankan Analisis Muatan IoT
                  </button>

                  {axleFeedback && (
                    <div className="mt-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded text-[9.5px] leading-relaxed font-semibold text-slate-300">
                      {axleFeedback}
                    </div>
                  )}
                </div>

                {/* Simulator 2: GPS Telemetry Ping Simulator */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-[11.5px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-emerald-400" />
                      Satellite-Hybrid Fleet Ping Hub
                    </h6>
                    <button
                      type="button"
                      onClick={simulatePing}
                      disabled={pingStatus === "pinging"}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[8.5px] font-bold rounded flex items-center gap-1 cursor-pointer border-none"
                    >
                      <RefreshCw className={`h-2 w-2 ${pingStatus === "pinging" ? "animate-spin" : ""}`} />
                      Ping Armada
                    </button>
                  </div>
                  <p className="text-[9.5px] text-slate-400 font-semibold mb-3">
                    Memantau unit operasional secara langsung di rute proyek <span className="text-emerald-400 font-bold">{projectTitle}</span>.
                  </p>

                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {activeTrucks.map((truck) => (
                      <div key={truck.id} className="bg-slate-950/80 p-2 rounded border border-slate-800/60 flex justify-between items-center text-[9.5px]">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-300">{truck.id}</span>
                            <span className="font-bold text-slate-400">{truck.name}</span>
                          </div>
                          <div className="text-[8.5px] text-slate-500 font-semibold mt-0.5">
                            Lokasi: {truck.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 font-mono text-[8px] font-black">
                            {truck.speed} KM/H
                          </span>
                          <span className="text-[8px] text-emerald-400 block font-bold mt-0.5">
                            ● {truck.signal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pingStatus === "connected" && (
                    <p className="text-[8px] text-emerald-400 font-bold mt-2 text-center">
                      ✓ Seluruh armada berhasil di-ping via koneksi satelit Pancaran Telematics Hub.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "green" && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight">🌿 {profile.greenTitle}</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{profile.greenSubtitle}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">Evaluasi Internal:</span>
                  <select
                    value={readinessScores.green}
                    onChange={(e) => setReadinessScores(prev => ({ ...prev, green: e.target.value }))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-teal-400 focus:outline-none"
                  >
                    <option value="Ready">Sangat Siap (Ready)</option>
                    <option value="Progress">Menyiapkan (Progress)</option>
                    <option value="Planned">Rencana Kemitraan (Planned)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {profile.greenList.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? "bg-teal-500" : idx === 1 ? "bg-emerald-500" : "bg-indigo-500"}`} />
                    <span className="text-[10px] font-mono text-slate-500 font-black block uppercase mb-1">GRN-0{idx + 1} • {item.tag}</span>
                    <h6 className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{item.title}</h6>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SECTION 3: ADD SPECIFIC NEW OPPORTUNITIES & INTERACTIVE CRITERIA TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Left Column: Form to Add Opportunity */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-emerald-400" />
            Tambah Analisis Celah & Peluang Baru
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
            Form ini memungkinkan tim analis PRAMA menambahkan celah pasar khusus yang baru saja teridentifikasi dari dinamika di lapangan.
          </p>

          <form onSubmit={handleAddOpportunity} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Judul Peluang / Kesenjangan</label>
              <input
                type="text"
                placeholder="e.g. Sinergi Pelabuhan Sungai Kapuas"
                value={newOpTitle}
                onChange={(e) => setNewOpTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500 font-semibold transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Kategori Pilar</label>
                <select
                  value={newOpCat}
                  onChange={(e: any) => setNewOpCat(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold outline-none"
                >
                  <option value="driver">Pendorong Pasar (Driver)</option>
                  <option value="gap">Celah Logistik (Gap)</option>
                  <option value="tech">Inovasi Teknologi (Tech)</option>
                  <option value="green">Nilai Tambah Hijau (Green)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tingkat Dampak</label>
                <select
                  value={newOpImpact}
                  onChange={(e: any) => setNewOpImpact(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold outline-none"
                >
                  <option value="Tinggi">Dampak Tinggi (High)</option>
                  <option value="Sedang">Dampak Sedang (Mid)</option>
                  <option value="Rendah">Dampak Rendah (Low)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Deskripsi Detail & Solusi Pancaran</label>
              <textarea
                placeholder="Jelaskan detail peluang pasar ini beserta taktik penetrasinya..."
                value={newOpDesc}
                onChange={(e) => setNewOpDesc(e.target.value)}
                className="w-full h-20 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-emerald-500 font-semibold resize-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 border-none mt-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simpan Tambahan Peluang</span>
            </button>
          </form>
        </div>

        {/* Right Column: Custom Opportunities Table / Cards List */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3 flex justify-between items-center">
              <span>Rencana Taktis & Register Peluang (Opportunities Register)</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-mono font-black">
                {customOps.length} AKTIF
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
              Berikut adalah peluang tambahan khusus yang terdaftar di sistem. Anda dapat memantau dan memperbaruinya sesuai kajian berkala tim konsultan.
            </p>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {customOps.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-[11px] font-bold">
                  Belum ada peluang kustom terdaftar. Gunakan formulir di samping untuk menambahkan rincian baru.
                </div>
              ) : (
                customOps.map((op) => (
                  <div key={op.id} className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex justify-between items-start gap-3 relative">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-1.5 py-0.5 text-[8px] font-mono font-black rounded uppercase tracking-wider ${
                          op.category === "driver"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : op.category === "gap"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : op.category === "tech"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                        }`}>
                          {op.category === "driver" ? "Driver" : op.category === "gap" ? "Gap" : op.category === "tech" ? "Tech" : "Green"}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase ${
                          op.impact === "Tinggi"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          Dampak {op.impact}
                        </span>
                      </div>
                      <h5 className="text-[11.5px] font-black text-slate-200 uppercase tracking-tight truncate">{op.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-semibold">{op.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteOp(op.id)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer border-none"
                      title="Hapus Peluang"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-semibold">Integrasi Sistem Data PRAMA BI v4.5</span>
            <span className="text-emerald-400 font-black">Data Tersimpan Lokal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
