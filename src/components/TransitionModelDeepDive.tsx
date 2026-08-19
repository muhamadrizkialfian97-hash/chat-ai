import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Truck,
  Users,
  FileSpreadsheet,
  Settings,
  Sliders,
  Sparkles
} from "lucide-react";

interface TransitionModelDeepDiveProps {
  projectTitle: string;
}

interface MilestoneTask {
  id: string;
  name: string;
  weight: number; // contribution to preparedness score
  completed: boolean;
  owner: string;
  duration: string;
  description: string;
}

export function TransitionModelDeepDive({ projectTitle }: TransitionModelDeepDiveProps) {
  const [activePhase, setActivePhase] = useState<"pre" | "on" | "post">("pre");

  // PRE-TRANSITION (Persiapan) Tasks
  const [preTasks, setPreTasks] = useState<MilestoneTask[]>([
    {
      id: "pre-1",
      name: "Studi Kelayakan Rute & Pemetaan Hauling Lateral",
      weight: 15,
      completed: true,
      owner: "Prama Strategic Advisor",
      duration: "Minggu 1-2",
      description: "Analisis kemiringan jalan hauling, ketahanan tonase, jembatan timbang, dan titik rawan kemacetan rute."
    },
    {
      id: "pre-2",
      name: "Pengadaan Awal & Mobilisasi Armada Truk Heavy Duty",
      weight: 25,
      completed: true,
      owner: "Pancaran Fleet Div",
      duration: "Minggu 2-4",
      description: "Pemeriksaan fisik sasis truk, pemasangan ban cadangan, tangki BBM ekstra, dan pengetesan ketahanan."
    },
    {
      id: "pre-3",
      name: "Sertifikasi Perizinan (ANDALALIN & SVLK)",
      weight: 20,
      completed: false,
      owner: "Legal & Regulatory Team",
      duration: "Minggu 3-5",
      description: "Pengurusan izin analisis dampak lalu lintas (Andalalin) jalur logistik serta registrasi lacak balak SVLK."
    },
    {
      id: "pre-4",
      name: "Rekrutmen & Pelatihan Safety Driving Pengemudi Inti",
      weight: 15,
      completed: false,
      owner: "HR & HSE Pancaran",
      duration: "Minggu 4-5",
      description: "Pelatihan khusus defensive driving, navigasi telemetri GPS, dan standar pelaporan kecelakaan kerja."
    },
    {
      id: "pre-5",
      name: "Penyediaan Depo Satelit & Bengkel Darurat Rute",
      weight: 15,
      completed: false,
      owner: "Infrastructure & Ops Dev",
      duration: "Minggu 5-6",
      description: "Pembangunan bengkel mini darurat, pos pergantian supir, dan tangki penampungan BBM solar non-subsidi."
    }
  ]);

  // ON-TRANSITION (Implementasi Awal) Tasks
  const [onTasks, setOnTasks] = useState<MilestoneTask[]>([
    {
      id: "on-1",
      name: "Kick-off Pilot Run (Rute Percobaan Pertama)",
      weight: 20,
      completed: false,
      owner: "Operations Lead",
      duration: "Minggu 6-7",
      description: "Peluncuran 5 unit truk pertama bermuatan penuh untuk menguji waktu siklus (cycle time) aktual."
    },
    {
      id: "on-2",
      name: "Kalibrasi & Pengujian Telemetri Sensor GPS",
      weight: 20,
      completed: false,
      owner: "IT & Telematics Team",
      duration: "Minggu 7",
      description: "Sinkronisasi sinyal GPS satelit dengan Command Center Pancaran di area blank spot 3T."
    },
    {
      id: "on-3",
      name: "Evaluasi & Pengumpulan Umpan Balik Operasional",
      weight: 20,
      completed: false,
      owner: "QA & Continuous Improvement",
      duration: "Minggu 7-8",
      description: "Pencatatan hambatan fisik, kelelahan supir, konsumsi BBM per kilometer, dan friksi jalan lateral."
    },
    {
      id: "on-4",
      name: "Stabilisasi Ritase & Skala Armada Menengah",
      weight: 25,
      completed: false,
      owner: "Operations Lead",
      duration: "Minggu 8-10",
      description: "Penambahan armada secara bertahap hingga mencapai 60% dari kapasitas penuh target proyek."
    }
  ]);

  // POST-TRANSITION (Pasca-Transisi) Tasks
  const [postTasks, setPostTasks] = useState<MilestoneTask[]>([
    {
      id: "post-1",
      name: "Serah Terima Penuh Operasional (Handover)",
      weight: 30,
      completed: false,
      owner: "Prama Strategic & Client Ops",
      duration: "Minggu 10-11",
      description: "Penandatanganan berita acara serah terima aset, rute, dan sistem kendali digital ke tim manajemen reguler."
    },
    {
      id: "post-2",
      name: "Audit Kepatuhan Karbon & Efisiensi Rute",
      weight: 25,
      completed: false,
      owner: "HSE & Carbon Auditor",
      duration: "Minggu 11-12",
      description: "Penghitungan emisi gas rumah kaca logistik dan verifikasi kepatuhan SVLK tahap pasca-operasional."
    },
    {
      id: "post-3",
      name: "SLA Optimization & Program Peningkatan Berkelanjutan",
      weight: 25,
      completed: false,
      owner: "Continuous Improvement Dev",
      duration: "Minggu 12+",
      description: "Penerapan sistem insentif supir berkinerja tinggi dan optimasi rute balik (backhaul sharing)."
    }
  ]);

  // Interactive simulators
  const [contingencyPlanEnabled, setContingencyPlanEnabled] = useState<boolean>(true);
  const [supirBackupRatio, setSupirBackupRatio] = useState<number>(15); // 5% to 30% back-up driver ratio
  const [communicationSystem, setCommunicationSystem] = useState<"Dual-GSM" | "Hybrid Satelit-GSM" | "Hanya GSM biasa">("Hybrid Satelit-GSM");

  // Toggle tasks helper
  const togglePreTask = (id: string) => {
    setPreTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const toggleOnTask = (id: string) => {
    setOnTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const togglePostTask = (id: string) => {
    setPostTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // CALCULATE READYNESS INDEX
  let baseScore = 0;
  preTasks.forEach(t => { if (t.completed) baseScore += t.weight * 0.4; });
  onTasks.forEach(t => { if (t.completed) baseScore += t.weight * 0.4; });
  postTasks.forEach(t => { if (t.completed) baseScore += t.weight * 0.2; });

  // Add simulator modifiers
  if (contingencyPlanEnabled) baseScore += 10;
  if (supirBackupRatio >= 15) baseScore += 5;
  if (supirBackupRatio >= 25) baseScore += 5;

  if (communicationSystem === "Hybrid Satelit-GSM") baseScore += 10;
  else if (communicationSystem === "Dual-GSM") baseScore += 5;

  const finalReadinessIndex = Math.min(100, Math.round(baseScore));

  // Determine readiness status
  let readinessStatus: "Kritis" | "Siap Terkendali" | "Optimal Sempurna" = "Kritis";
  let statusColor = "text-rose-400 border-rose-500/20 bg-rose-500/10";
  let recommendations = "Selesaikan sertifikasi ANDALALIN & SVLK di tahap PRE-TRANSITION segera agar tidak menghambat kick-off pilot run!";

  if (finalReadinessIndex >= 80) {
    readinessStatus = "Optimal Sempurna";
    statusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    recommendations = "Rencana transisi Anda sangat matang dan memiliki jaring pengaman kuat. Siap untuk komisioning penuh rute komersial.";
  } else if (finalReadinessIndex >= 50) {
    readinessStatus = "Siap Terkendali";
    statusColor = "text-amber-400 border-amber-500/20 bg-amber-500/10";
    recommendations = "Kesiapan cukup baik. Pastikan bengkel rute dan depo satelit sudah berdiri kokoh sebelum pilot run dimulai.";
  }

  // Count milestones completion
  const totalMilestones = preTasks.length + onTasks.length + postTasks.length;
  const completedMilestones = 
    preTasks.filter(t => t.completed).length +
    onTasks.filter(t => t.completed).length +
    postTasks.filter(t => t.completed).length;

  return (
    <div id="transition-model-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans relative">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
              PRAMA OPERATIONAL ROADMAP
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Layers className="h-5 w-5 text-violet-400" />
            Interactive Transition Playbook (PRE-ON-POST)
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Panduan operasional interaktif untuk mengawal transisi logistik rute dari tahap persiapan (Pre), peluncuran rute percobaan (On), hingga serah terima penuh operasional (Post).
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Milestone Status:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase font-mono">
            {completedMilestones} / {totalMilestones} SELESAI
          </span>
        </div>
      </div>

      {/* 3 COLUMN PHASE TABS (PRE, ON, POST) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-6 relative z-10">
        
        {/* PHASE 1: PRE-TRANSITION */}
        <button
          type="button"
          onClick={() => setActivePhase("pre")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activePhase === "pre"
              ? "bg-gradient-to-br from-violet-950/45 to-slate-900 border-violet-500 shadow-lg shadow-violet-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activePhase === "pre" ? "bg-violet-600 text-white animate-pulse" : "bg-slate-900 text-slate-400"
          }`}>
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 font-mono">Tahap 1</span>
              {preTasks.every(t => t.completed) && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase">Lengkap</span>
              )}
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">PRE-TRANSITION (Persiapan)</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Studi kelayakan, pengadaan armada, rekrutmen pengemudi, perizinan Andalalin & SVLK.
            </p>
          </div>
        </button>

        {/* PHASE 2: ON-TRANSITION */}
        <button
          type="button"
          onClick={() => setActivePhase("on")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activePhase === "on"
              ? "bg-gradient-to-br from-violet-950/45 to-slate-900 border-violet-500 shadow-lg shadow-violet-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activePhase === "on" ? "bg-violet-600 text-white animate-pulse" : "bg-slate-900 text-slate-400"
          }`}>
            <Play className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 font-mono">Tahap 2</span>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">ON-TRANSITION (Implementasi)</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Kick-off pilot run (rute uji coba), pengetesan GPS telemetri, dan evaluasi konsumsi solar.
            </p>
          </div>
        </button>

        {/* PHASE 3: POST-TRANSITION */}
        <button
          type="button"
          onClick={() => setActivePhase("post")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activePhase === "post"
              ? "bg-gradient-to-br from-violet-950/45 to-slate-900 border-violet-500 shadow-lg shadow-violet-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activePhase === "post" ? "bg-violet-600 text-white animate-pulse" : "bg-slate-900 text-slate-400"
          }`}>
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 font-mono">Tahap 3</span>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">POST-TRANSITION (Pasca)</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Serah terima operasional (Handover), audit karbon KLHK, dan optimasi SLA logistik rute balik.
            </p>
          </div>
        </button>
      </div>

      {/* DETAILED LAYOUT GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 text-left"
        >
          
          {/* LEFT PANEL: Phase Tasks list and progress checking */}
          <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4.5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-violet-400" />
                Daftar Milestone Proyek - {activePhase === "pre" ? "PRE-TRANSITION" : activePhase === "on" ? "ON-TRANSITION" : "POST-TRANSITION"}
              </h4>
              <span className="text-[10px] text-slate-500 font-bold font-mono">
                Ketuk tugas untuk menandai selesai
              </span>
            </div>

            {/* Render Tasks based on selected phase tab */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              
              {/* PRE-TRANSITION list */}
              {activePhase === "pre" && preTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => togglePreTask(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-3 ${
                    t.completed
                      ? "bg-violet-950/10 border-violet-900/50 text-violet-300"
                      : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.1 text-[8px] font-black rounded uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                        {t.duration}
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold">•</span>
                      <span className="text-[9px] text-slate-400 font-bold">PIC: {t.owner}</span>
                    </div>
                    <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white">
                      {t.name}
                    </h5>
                    <p className="text-[10.5px] text-slate-400 font-semibold mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    t.completed ? "bg-violet-500 border-violet-400 text-slate-950" : "border-slate-700 bg-slate-950"
                  }`}>
                    {t.completed && <CheckCircle className="h-3.5 w-3.5 text-slate-950" />}
                  </div>
                </div>
              ))}

              {/* ON-TRANSITION list */}
              {activePhase === "on" && onTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleOnTask(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-3 ${
                    t.completed
                      ? "bg-violet-950/10 border-violet-900/50 text-violet-300"
                      : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.1 text-[8px] font-black rounded uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                        {t.duration}
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold">•</span>
                      <span className="text-[9px] text-slate-400 font-bold">PIC: {t.owner}</span>
                    </div>
                    <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white">
                      {t.name}
                    </h5>
                    <p className="text-[10.5px] text-slate-400 font-semibold mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    t.completed ? "bg-violet-500 border-violet-400 text-slate-950" : "border-slate-700 bg-slate-950"
                  }`}>
                    {t.completed && <CheckCircle className="h-3.5 w-3.5 text-slate-950" />}
                  </div>
                </div>
              ))}

              {/* POST-TRANSITION list */}
              {activePhase === "post" && postTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => togglePostTask(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-3 ${
                    t.completed
                      ? "bg-violet-950/10 border-violet-900/50 text-violet-300"
                      : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.1 text-[8px] font-black rounded uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                        {t.duration}
                      </span>
                      <span className="text-[9px] text-slate-600 font-bold">•</span>
                      <span className="text-[9px] text-slate-400 font-bold">PIC: {t.owner}</span>
                    </div>
                    <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white">
                      {t.name}
                    </h5>
                    <p className="text-[10.5px] text-slate-400 font-semibold mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    t.completed ? "bg-violet-500 border-violet-400 text-slate-950" : "border-slate-700 bg-slate-950"
                  }`}>
                    {t.completed && <CheckCircle className="h-3.5 w-3.5 text-slate-950" />}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT PANEL: Transition Risk, Stepper Gauge, and Dynamic Mitigation Control */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[8.5px] font-mono font-black text-violet-400 uppercase tracking-widest block">
                  TRANSITION READINESS SYSTEM
                </span>
                <span className="flex items-center gap-1 text-[9px] font-black text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  <Sparkles className="h-3 w-3 text-violet-400 animate-pulse" />
                  DYNAMIC MATRIX
                </span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-1">
                <Sliders className="h-4 w-4 text-violet-400" />
                Penilaian Kesiapan Transisi
              </h4>

              {/* READINESS RADIAL / PROGRESS BAR */}
              <div className="mb-5 bg-slate-900/75 p-4 border border-slate-850 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-slate-400 font-black uppercase">INDEKS KESIAPAN TRANSISI</span>
                  <span className="text-lg font-black text-white font-mono">{finalReadinessIndex}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      finalReadinessIndex >= 80 ? "bg-emerald-500" : finalReadinessIndex >= 50 ? "bg-amber-400" : "bg-rose-500"
                    }`}
                    style={{ width: `${finalReadinessIndex}%` }}
                  />
                </div>
                <div className={`p-2.5 rounded-lg border text-[10px] font-semibold leading-relaxed ${statusColor}`}>
                  <span className="font-black uppercase block mb-0.5 text-[9px]">DIAGNOSIS OPERASIONAL: {readinessStatus}</span>
                  {recommendations}
                </div>
              </div>

              {/* DYNAMIC RISK MODIFIERS (Interactive sliders/buttons requested) */}
              <div className="space-y-4 text-xs">
                {/* Switch 1: Rencana Kontigensi Aktif */}
                <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-200 font-bold block text-[11px]">Rencana Kontigensi Cuaca</span>
                    <span className="text-[9.5px] text-slate-400 font-medium block">Penyediaan rute hauling alternatif</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContingencyPlanEnabled(!contingencyPlanEnabled)}
                    className={`px-3 py-1 rounded-md text-[9px] font-black uppercase cursor-pointer border ${
                      contingencyPlanEnabled ? "bg-violet-600 border-violet-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500"
                    }`}
                  >
                    {contingencyPlanEnabled ? "AKTIF (+10)" : "NON-AKTIF"}
                  </button>
                </div>

                {/* Slider: Cadangan Supir */}
                <div>
                  <div className="flex justify-between mb-1.5 text-[10.5px]">
                    <span className="text-slate-300 font-bold">Rasio Supir Cadangan Berjaga</span>
                    <span className="text-violet-400 font-black">{supirBackupRatio}% Supir</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={supirBackupRatio}
                    onChange={(e) => setSupirBackupRatio(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-bold mt-1 uppercase">
                    <span>Minimal (5%)</span>
                    <span>SLA Bagus (15%)</span>
                    <span>High Safety (30%)</span>
                  </div>
                </div>

                {/* Option Selector: Komunikasi Rute */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1.5">Sistem Komunikasi Kendaraan</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { type: "Hanya GSM biasa", label: "GSM" },
                      { type: "Dual-GSM", label: "Dual GSM" },
                      { type: "Hybrid Satelit-GSM", label: "Hybrid" }
                    ].map((item) => {
                      const isSel = communicationSystem === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setCommunicationSystem(item.type as any)}
                          className={`p-1.5 rounded text-[10px] font-black uppercase transition cursor-pointer border ${
                            isSel ? "bg-violet-600 border-violet-400 text-white" : "bg-slate-900 border-slate-850 text-slate-400"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-bold mt-5 pt-3 border-t border-slate-850">
              PRAMA PROJECT TRANSITION ANALYTICS SYSTEM v1.2
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
