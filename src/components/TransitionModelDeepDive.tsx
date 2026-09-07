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
  Sparkles,
  CheckSquare
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
      name: "Audit Kepatuhan & Efisiensi Rute",
      weight: 25,
      completed: false,
      owner: "HSE & Operational Auditor",
      duration: "Minggu 11-12",
      description: "Verifikasi kepatuhan SVLK, kelaikan armada, dan audit efisiensi rute tahap pasca-operasional."
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
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 font-mono">Tahap 3</span>
              {postTasks.every(t => t.completed) && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase">Lengkap</span>
              )}
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">POST-TRANSITION (Pasca)</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Serah terima operasional (Handover), audit kelaikan armada, dan optimasi SLA logistik rute balik.
            </p>
          </div>
        </button>
      </div>

      {/* DYNAMIC PENJELASAN TAHAP SESUAI DENGAN PHASE YANG DI-KLIK */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6 relative z-10"
        >
          {/* Active Phase Overview Box */}
          {(() => {
            let activeTasks = preTasks;
            let activeToggle = togglePreTask;
            let phaseTitle = "TAHAP 1: PRE-TRANSITION (Persiapan Proyek & Legalitas)";
            let phaseBadge = "PENYUSUNAN FONDASI & PERIZINAN";
            let phaseDesc = "Fase krusial untuk memastikan seluruh perizinan resmi, studi rute jalan hauling, kesiapan armada truk heavy-duty, dan sertifikasi pengemudi telah terpenuhi sebelum armada beroperasi.";
            let keyGoals = [
              "Memastikan kepatuhan perizinan jalan Andalalin dan lacak balak SVLK / Festronik KLHK.",
              "Studi kelayakan rute jalan hauling, jembatan timbang, dan titik rawan jalan licin.",
              "Mobilisasi unit truk heavy-duty dan rekrutmen supir bersertifikat defensive driving."
            ];
            let deliverables = [
              "Laporan Route Survey & Risk Mapping Rute",
              "Dokumen Resmi Andalalin & SVLK KLHK",
              "Sertifikasi Kru & Driver Safety Training Log",
              "Kesiapan Depo Satelit & Bengkel Rute"
            ];

            if (activePhase === "on") {
              activeTasks = onTasks;
              activeToggle = toggleOnTask;
              phaseTitle = "TAHAP 2: ON-TRANSITION (Implementasi & Pilot Run)";
              phaseBadge = "UJI COBA APLIKATIF & STABILISASI RUTE";
              phaseDesc = "Fase eksekusi rute percobaan (pilot run) untuk menguji waktu siklus (cycle time) aktual, kalibrasi sensor telemetri GPS di area hutan/tambang, dan penambahan armada secara bertahap.";
              keyGoals = [
                "Meluncurkan pilot run 5-10 unit truk bermuatan penuh untuk verifikasi cycle time.",
                "Uji coba telemetri GPS & integrasi API Command Center di area blank-spot.",
                "Pencatatan konsumsi BBM solar aktual dan evaluasi kenyamanan supir."
              ];
              deliverables = [
                "Laporan Evaluasi Pilot Run & Cycle Time Actual",
                "Log Sinkronisasi Telemetri GPS & API Command Center",
                "Berita Acara Penambahan Armada (Ramp-up Stage)",
                "Integrasi Manifes Digital e-POD & Festronik"
              ];
            } else if (activePhase === "post") {
              activeTasks = postTasks;
              activeToggle = togglePostTask;
              phaseTitle = "TAHAP 3: POST-TRANSITION (Serah Terima & Pasca-Transisi)";
              phaseBadge = "HANDOVER OPERASIONAL & OPTIMASI SLA";
              phaseDesc = "Fase penyelesaian transisi meliputi serah terima resmi (Handover) ke manajemen operasional reguler, audit kepatuhan berkala, dan optimasi muatan balik (backhaul sharing).";
              keyGoals = [
                "Penandatanganan Berita Acara Serah Terima Operasional (Handover) secara resmi.",
                "Audit berkala tingkat kepatuhan SLA logistik dan kelaikan armada rutin.",
                "Penerapan insentif supir berkinerja tinggi dan optimasi rute balik."
              ];
              deliverables = [
                "Dokumen Official Handover Sign-off",
                "Laporan Audit Kepatuhan SLA Logistik B2B",
                "Perencanaan Rute Balik (Backhaul Allocation Plan)",
                "Laporan Finansial Margin Operasional Pasca-Transisi"
              ];
            }

            const completedCount = activeTasks.filter(t => t.completed).length;
            const progressPercent = Math.round((completedCount / activeTasks.length) * 100);

            return (
              <div className="space-y-6">
                {/* Header Detail Active Phase */}
                <div className="bg-slate-950/60 border border-violet-500/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-violet-500" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[8.5px] font-mono font-black rounded uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {phaseBadge}
                        </span>
                        <span className="text-[10px] font-mono font-black text-slate-400">
                          Progress Milestone Tahap Ini: <span className="text-violet-400 font-bold">{completedCount}/{activeTasks.length} ({progressPercent}%)</span>
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                        {activePhase === "pre" && <Clock className="h-4.5 w-4.5 text-violet-400" />}
                        {activePhase === "on" && <Play className="h-4.5 w-4.5 text-violet-400" />}
                        {activePhase === "post" && <ShieldCheck className="h-4.5 w-4.5 text-violet-400" />}
                        {phaseTitle}
                      </h3>
                    </div>

                    <div className="w-full md:w-36 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 font-semibold leading-relaxed mb-4">
                    {phaseDesc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                    <div className="space-y-2">
                      <span className="text-[9.5px] font-mono font-black text-violet-400 uppercase block tracking-wider">
                        🎯 FOKUS SASARAN UTAMA TAHAP INI
                      </span>
                      <div className="space-y-1.5">
                        {keyGoals.map((goal, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[10.5px] text-slate-300 font-semibold">
                            <span className="h-4 w-4 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 font-mono border border-violet-500/20 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9.5px] font-mono font-black text-indigo-400 uppercase block tracking-wider">
                        📄 DOKUMEN HASIL & DELIVERABLES KUNCI
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {deliverables.map((del, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-850">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Milestones & Tasks Table for Active Phase */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4 text-violet-400" />
                      Checklist Tugas & Item Kontrol ({activePhase.toUpperCase()}-TRANSITION)
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">
                      Klik checkbox untuk memperbarui skor kesiapan
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => activeToggle(t.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          t.completed
                            ? "bg-slate-900/90 border-emerald-500/40 text-slate-200"
                            : "bg-slate-900/40 border-slate-850 text-slate-400 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`mt-0.5 shrink-0 transition-all ${
                              t.completed ? "text-emerald-400 scale-110" : "text-slate-600 hover:text-slate-400"
                            }`}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className={`text-[12px] font-black uppercase tracking-tight ${
                                t.completed ? "text-white line-through opacity-80" : "text-white"
                              }`}>
                                {t.name}
                              </h5>
                              <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                {t.duration}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                              {t.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                          <div className="text-right">
                            <span className="text-[8.5px] font-mono font-bold text-slate-500 block">PENANGGUNG JAWAB</span>
                            <span className="text-[10px] font-extrabold text-slate-300">{t.owner}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-[9px] font-mono font-black uppercase ${
                            t.completed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {t.completed ? "Selesai" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Transition Simulator & Readiness Gauge */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Readiness Index Bar */}
                  <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-black text-violet-400 block uppercase tracking-wider mb-1">
                        EVALUASI KESIAPAN TRANSISI PROYEK
                      </span>
                      <h4 className="text-xs font-black uppercase text-white mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-violet-400" />
                        Operational Readiness Index
                      </h4>

                      <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center mb-3">
                        <span className="text-3xl font-black font-mono text-white tracking-tight">
                          {finalReadinessIndex}%
                        </span>
                        <span className={`block text-[10px] font-extrabold uppercase mt-1 px-2 py-0.5 rounded-md border ${statusColor}`}>
                          Status: {readinessStatus}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 text-[10.5px] text-slate-300 font-semibold leading-relaxed">
                        💡 <span className="text-white font-bold">Rekomendasi Strategis:</span> {recommendations}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono font-bold text-slate-500 pt-3 border-t border-slate-800/80 mt-3">
                      PRAMA TRANSITION ENGINE v2.1
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-200 mb-3 flex items-center gap-1.5">
                        <Sliders className="h-4 w-4 text-indigo-400" />
                        Simulator Kontinjensi & Mitigasi Risiko Transisi
                      </h4>

                      <div className="space-y-3.5 text-xs">
                        {/* Contingency Plan Toggle */}
                        <div className="p-3 bg-slate-900/80 border border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block text-[11px]">SOP Rencana Kontinjensi Cuaca & Mogok</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Prosedur penanganan darurat banjir/jalan licin</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setContingencyPlanEnabled(!contingencyPlanEnabled)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition-all cursor-pointer ${
                              contingencyPlanEnabled
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {contingencyPlanEnabled ? "AKTIF (+10%)" : "NON-AKTIF"}
                          </button>
                        </div>

                        {/* Backup Driver Slider */}
                        <div className="p-3 bg-slate-900/80 border border-slate-850 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-white">Rasio Supir Cadangan di Depo Satelit</span>
                            <span className="font-mono font-black text-violet-400">{supirBackupRatio}% dari Total Unit</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="5"
                            value={supirBackupRatio}
                            onChange={(e) => setSupirBackupRatio(Number(e.target.value))}
                            className="w-full accent-violet-500 cursor-pointer"
                          />
                        </div>

                        {/* Communication Picker */}
                        <div className="p-3 bg-slate-900/80 border border-slate-850 rounded-xl flex justify-between items-center gap-2">
                          <div>
                            <span className="font-bold text-white block text-[11px]">Sistem Komunikasi Telemetri</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Dukungan sinyal komunikasi di rute remote</span>
                          </div>
                          <select
                            value={communicationSystem}
                            onChange={(e: any) => setCommunicationSystem(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-mono font-bold p-1.5 rounded-lg outline-none"
                          >
                            <option value="Hybrid Satelit-GSM">Hybrid Satelit-GSM (+10%)</option>
                            <option value="Dual-GSM">Dual-GSM (+5%)</option>
                            <option value="Hanya GSM biasa">Hanya GSM biasa (+0%)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] font-mono font-bold text-slate-500 pt-3 border-t border-slate-800/80 mt-3">
                      PARAMETER SIMULATOR AKTIF • DUKUNGAN KENDALI 24/7
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>


    </div>
  );
}
