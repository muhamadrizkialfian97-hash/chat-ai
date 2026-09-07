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
            Simulasikan nilai ekonomi, efisiensi operasional, serta analisis kesenjangan logistik pengangkutan proyek <span className="text-emerald-300 font-extrabold">"{projectTitle || "Kajian Strategis PRAMA"}"</span> secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Status Kesiapan:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            STRATEGIC ADVANCED
          </span>
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
              <div className="flex justify-between items-start gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {profile.techList.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? "bg-sky-500" : idx === 1 ? "bg-blue-500" : "bg-cyan-500"}`} />
                    <span className="text-[10px] font-mono text-slate-500 font-black block uppercase mb-1">{item.code} • {item.tag}</span>
                    <h6 className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{item.title}</h6>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
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
    </div>
  );
}
