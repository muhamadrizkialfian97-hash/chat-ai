import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sliders,
  Award,
  Zap,
  Check,
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface OpsModelProps {
  projectTitle: string;
}

interface FlowStep {
  id: string;
  name: string;
  pic: string;
  durationMins: number;
  iotDevice: string;
  kpi: string;
  description: string;
}

interface WorkflowNode {
  id: string;
  role: "Supir (Driver)" | "Command Center" | "Klien / Pabrik";
  action: string;
  status: "Selesai" | "Proses" | "Tertunda";
  automated: boolean;
  notes: string;
}

export function OpsModelDeepDive({ projectTitle }: OpsModelProps) {
  const [activeTab, setActiveTab] = useState<"flow" | "diagram" | "sla">("flow");

  // State 1: Flow Process Steps
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([
    {
      id: "step-1",
      name: "Persiapan Unit & CSMS Check",
      pic: "Driver & HSE Inspector",
      durationMins: 20,
      iotDevice: "Mobile App (Uji Kelayakan)",
      kpi: "Kepatuhan checklist K3 100%",
      description: "Pemeriksaan fisik sasis ban, rem, sabuk pengaman, serta kebugaran supir sebelum keberangkatan."
    },
    {
      id: "step-2",
      name: "Pemuatan Kayu & Segel Elektronik",
      pic: "Foreman Loading Hutan",
      durationMins: 45,
      iotDevice: "e-POD Mobile App & RFID Tag",
      kpi: "Kesesuaian volume kayu vs manifest",
      description: "Kayu dimuat ke dalam sasis, segel dipasang, dan operator hutan melakukan scan RFID untuk mendaftarkan muatan."
    },
    {
      id: "step-3",
      name: "Perjalanan Hauling & Geofence Monitor",
      pic: "Driver & Telematics Analyst",
      durationMins: 180,
      iotDevice: "PRAMA Smart GPS Node",
      kpi: "Nol deviasi rute lateral hutan",
      description: "Perjalanan dari hutan konsesi menuju pabrik bubur kertas/pabrik kelapa sawit dengan pantauan geofence aktif."
    },
    {
      id: "step-4",
      name: "Penimbangan & Audit Festronik KLHK",
      pic: "Operator Timbangan & KLHK API",
      durationMins: 15,
      iotDevice: "Vessel Weight Scale & API",
      kpi: "Waktu timbang kurang dari 20 menit",
      description: "Truk masuk jembatan timbang, tonase dicatat otomatis, dan disinkronkan langsung ke server KLHK Festronik."
    },
    {
      id: "step-5",
      name: "Pembongkaran & Konfirmasi e-POD",
      pic: "Warehouse Foreman & Driver",
      durationMins: 30,
      iotDevice: "Tanda Tangan Digital & Kamera App",
      kpi: "Tanda tangan e-POD instan",
      description: "Kayu diturunkan, serah terima disahkan via foto bukti bongkar serta tanda tangan digital di aplikasi supir."
    }
  ]);

  // Simulasi Hambatan State
  const [obstacle, setObstacle] = useState<"none" | "rain" | "puncture" | "queue">("none");

  // Calculate adjusted durations based on selected obstacle
  const getAdjustedDuration = (step: FlowStep) => {
    if (obstacle === "rain" && step.id === "step-3") return step.durationMins + 45; // Hujan lebat (+45 mins hauling)
    if (obstacle === "puncture" && step.id === "step-3") return step.durationMins + 60; // Ban bocor di jalan tanah (+60 mins)
    if (obstacle === "queue" && step.id === "step-4") return step.durationMins + 30; // Antrean jembatan timbang (+30 mins)
    return step.durationMins;
  };

  const totalDurationMins = flowSteps.reduce((acc, step) => acc + getAdjustedDuration(step), 0);

  // State 2: Workflow swimlanes / nodes
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    {
      id: "node-1",
      role: "Supir (Driver)",
      action: "Melakukan pra-inspeksi kelayakan armada & lapor siap jalan",
      status: "Selesai",
      automated: false,
      notes: "Diunggah melalui aplikasi Pancaran Driver"
    },
    {
      id: "node-2",
      role: "Command Center",
      action: "Memverifikasi dokumen digital & menyetujui keberangkatan",
      status: "Selesai",
      automated: true,
      notes: "Auto-approved oleh sistem jika CSMS hijau"
    },
    {
      id: "node-3",
      role: "Supir (Driver)",
      action: "Melakukan perjalanan hauling di jalur khusus",
      status: "Proses",
      automated: false,
      notes: "GPS mengunci posisi & kecepatan real-time"
    },
    {
      id: "node-4",
      role: "Command Center",
      action: "Mendeteksi sinyal peringatan deviasi atau berhenti darurat",
      status: "Tertunda",
      automated: true,
      notes: "AI otomatis mengidentifikasi deviasi rute"
    },
    {
      id: "node-5",
      role: "Klien / Pabrik",
      action: "Penerimaan kayu, scan barkode e-POD, bongkar muatan",
      status: "Tertunda",
      automated: false,
      notes: "Tanda tangan digital langsung masuk database ERP"
    }
  ]);

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>("node-3");

  const handleToggleWorkflowAutomated = (id: string) => {
    setWorkflowNodes(prev => prev.map(n => n.id === id ? { ...n, automated: !n.automated } : n));
  };

  // State 3: SLA Threshold Sliders
  const [slaLoadingTarget, setSlaLoadingTarget] = useState<number>(45); // target minutes loading
  const [slaDeviationResponse, setSlaDeviationResponse] = useState<number>(10); // target deviation alert response in minutes
  const [slaEpodUpload, setSlaEpodUpload] = useState<number>(15); // target e-POD upload in minutes

  // Calculate SLA compliance rate based on inputs
  const baseSlaScore = 100 - 
    (slaLoadingTarget > 40 ? (slaLoadingTarget - 40) * 0.4 : 0) -
    (slaDeviationResponse > 5 ? (slaDeviationResponse - 5) * 1.5 : 0) -
    (slaEpodUpload > 10 ? (slaEpodUpload - 10) * 0.8 : 0);

  const finalSlaCompliance = Math.min(100, Math.max(75, Number(baseSlaScore.toFixed(1))));

  let complianceStatus = "Sangat Memuaskan";
  let complianceColor = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
  let statusDesc = "Standar SLA sangat andal, menjamin hubungan kerja sama jangka panjang dengan pabrik kertas.";

  if (finalSlaCompliance < 90) {
    complianceStatus = "Perlu Perbaikan (Warning)";
    complianceColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    statusDesc = "Waktu tanggap deviasi terlalu longgar. Resiko denda keterlambatan pengiriman meningkat.";
  } else if (finalSlaCompliance < 82) {
    complianceStatus = "Kritis (Keterlambatan Tinggi)";
    complianceColor = "text-rose-400 border-rose-500/20 bg-rose-500/5";
    statusDesc = "SLA di luar ambang batas aman. Klien berpotensi memberikan penalti finansial bulanan.";
  }

  return (
    <div id="ops-model-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans relative">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              PRAMA HAULING OPS MODEL
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Activity className="h-5 w-5 text-indigo-400" />
            Operations Model Deep Dive (Flow, Workflow & SLA)
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Menganalisis arsitektur model operasi angkutan logistik dari pemetaan alur muat, diagram kerja kolaborasi antar divisi, hingga kontrol kepatuhan SLA yang ketat.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ESTIMATED LEAD TIME:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            {Math.floor(totalDurationMins / 60)} Jam {totalDurationMins % 60} Menit
          </span>
        </div>
      </div>

      {/* THREE PILLAR SECTIONS TAB CONTROLLER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 relative z-10">
        {/* TAB 1: FLOW PROCESS */}
        <button
          type="button"
          onClick={() => setActiveTab("flow")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "flow"
              ? "bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "flow" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <RefreshCw className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 font-mono">Pilar 1</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">1. Pemetaan Alur Proses</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Flow Process berurutan: inspeksi, pemuatan kargo, hauling, timbangan, dan bongkar muatan.
            </p>
          </div>
        </button>

        {/* TAB 2: WORKFLOW DIAGRAM */}
        <button
          type="button"
          onClick={() => setActiveTab("diagram")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "diagram"
              ? "bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "diagram" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 font-mono">Pilar 2</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">2. Diagram Kerja (Swimlanes)</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Koordinasi pembagian tugas terstruktur antara Supir, tim Command Center, dan operator Pabrik.
            </p>
          </div>
        </button>

        {/* TAB 3: SLA DEFINITION */}
        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border text-left flex items-start gap-3 relative overflow-hidden ${
            activeTab === "sla"
              ? "bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/10"
              : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-750"
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            activeTab === "sla" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400"
          }`}>
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 font-mono">Pilar 3</span>
            </div>
            <h4 className="text-[12px] font-black text-white uppercase mt-0.5 tracking-tight">3. Perjanjian Tingkat Layanan</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
              Service Level Agreement: ketepatan waktu bongkar, respon peringatan AI, serta sinkronisasi manifes.
            </p>
          </div>
        </button>
      </div>

      {/* TAB VALUE CONTAINER */}
      <AnimatePresence mode="wait">

        {/* PILAR 1: FLOW PROCESS (ALUR PROSES & HAMBATAN SIMULATOR) */}
        {activeTab === "flow" && (
          <motion.div
            key="flow-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Interactive Flow Visual Track */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    Rincian Alur Proses Hauling & Pengangkutan
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-slate-500">
                    SOP HAULING PANCARAN GROUP
                  </span>
                </div>

                {/* Horizontal steps flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-5">
                  {flowSteps.map((step, idx) => {
                    const adjDuration = getAdjustedDuration(step);
                    const isDelayed = adjDuration > step.durationMins;
                    return (
                      <div key={step.id} className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        isDelayed ? "bg-amber-950/15 border-amber-600/60" : "bg-slate-900 border-slate-850"
                      }`}>
                        <div>
                          <div className="flex justify-between items-center mb-1 text-[8px] font-black">
                            <span className="text-indigo-400 font-mono">TAHAP {idx + 1}</span>
                            {isDelayed && <span className="text-amber-400 animate-pulse">DELAY</span>}
                          </div>
                          <h5 className="text-[10px] font-black uppercase text-white truncate mb-1">
                            {step.name}
                          </h5>
                          <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                            PIC: {step.pic}
                          </p>
                        </div>
                        <div className="border-t border-slate-800/80 mt-2.5 pt-1.5 flex justify-between items-center text-[8.5px]">
                          <span className="text-slate-500 font-bold">DURASI</span>
                          <span className={`font-mono font-black ${isDelayed ? "text-amber-400" : "text-cyan-400"}`}>
                            {adjDuration} Mins
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed card of the first step or list */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-xs space-y-2">
                  <span className="text-[9px] text-indigo-400 font-black tracking-wider uppercase block">Perangkat IoT Terintegrasi Alur</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-slate-300 font-semibold">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex gap-2">
                      <span className="text-indigo-400">✓</span>
                      <div>
                        <strong className="text-white block uppercase text-[9px]">SISTEM e-POD MOBILE:</strong>
                        <span>Mencegah pemalsuan manifes dengan tanda tangan koordinat GPS yang terkunci di depo tujuan.</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex gap-2">
                      <span className="text-indigo-400">✓</span>
                      <div>
                        <strong className="text-white block uppercase text-[9px]">TIMBANGAN MULTI-NODE API:</strong>
                        <span>Merekam data tonase langsung ke portal cloud Prama dan Festronik dalam 1 detik.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Obstacle / Incident Simulator */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-850">
                  <div>
                    <span className="text-[9px] text-amber-400 font-black tracking-wider block uppercase">Simulator Hambatan Hauling</span>
                    <p className="text-[9.5px] text-slate-400 font-semibold">Simulasikan kejadian tak terduga di rute guna mengevaluasi mitigasi operasional:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setObstacle("none")}
                      className={`px-2.5 py-1 text-[9.5px] font-black rounded border cursor-pointer transition-all ${
                        obstacle === "none" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      Kondisi Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setObstacle("rain")}
                      className={`px-2.5 py-1 text-[9.5px] font-black rounded border cursor-pointer transition-all ${
                        obstacle === "rain" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      🌧️ Hujan Lebat (Jalan Licin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setObstacle("puncture")}
                      className={`px-2.5 py-1 text-[9.5px] font-black rounded border cursor-pointer transition-all ${
                        obstacle === "puncture" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      🛠️ Pecah Ban di Jalur Hutan
                    </button>
                    <button
                      type="button"
                      onClick={() => setObstacle("queue")}
                      className={`px-2.5 py-1 text-[9.5px] font-black rounded border cursor-pointer transition-all ${
                        obstacle === "queue" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      🚛 Antrean Jembatan Pabrik
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Analysis of selected obstacle */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  KPI & EFFICIENCY SUMMARY
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Analisis Efektivitas Waktu
                </h4>

                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black block">AKUMULASI WAKTU PERJALANAN (LEAD TIME)</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">
                      {Math.floor(totalDurationMins / 60)} Jam {totalDurationMins % 60} Menit
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-black block">STATUS SIMULASI HAMBATAN</span>
                    <div className="text-[10px] font-semibold text-slate-300 mt-1 leading-relaxed">
                      {obstacle === "none" && (
                        <span className="text-emerald-400 font-black">✓ SEMUA BERJALAN LANCAR (SLA TERPENUHI)</span>
                      )}
                      {obstacle === "rain" && (
                        <span className="text-amber-400 font-black">⚠ HUJAN DERAS: Kecepatan hauling turun menjadi max 30 km/jam untuk aspek keselamatan HSE.</span>
                      )}
                      {obstacle === "puncture" && (
                        <span className="text-rose-400 font-black">⚠ PECAH BAN: Memerlukan bantuan tim mekanik depo terdekat untuk bongkar pasang ban di rute lateral.</span>
                      )}
                      {obstacle === "queue" && (
                        <span className="text-amber-400 font-black">⚠ ANTREAN TIMBANGAN: Pabrik sedang padat muatan, butuh koordinasi alokasi ritase supir selanjutnya.</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 text-[9px] text-slate-500 font-bold">
                    PRAMA SIMULATOR CORE v1.0
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA OPERATION CENTER
              </div>
            </div>
          </motion.div>
        )}

        {/* PILAR 2: DIAGRAM KERJA (WORKFLOW DIAGRAM WITH SWIMLANES) */}
        {activeTab === "diagram" && (
          <motion.div
            key="diagram-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Interactive Swimlane diagrams */}
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-indigo-400" />
                  Workflow Diagram & Swimlane Tanggung Jawab
                </h4>
                <span className="text-[9.5px] text-slate-500 font-bold font-mono">INTERACTIVE NODES</span>
              </div>

              <p className="text-[10.5px] text-slate-400 font-semibold mb-4 leading-relaxed">
                Diagram ini menggambarkan serah terima tanggung jawab pekerjaan antar pihak secara sekuensial. Klik baris tugas untuk menganalisis status operasional:
              </p>

              {/* Swimlane visual cards */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {workflowNodes.map((node) => {
                  const isActive = activeWorkflowId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveWorkflowId(node.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-slate-900 border-indigo-500 shadow-md"
                          : "bg-slate-950/60 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                            node.role === "Supir (Driver)" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            node.role === "Command Center" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {node.role}
                          </span>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            node.status === "Selesai" ? "bg-emerald-400" :
                            node.status === "Proses" ? "bg-blue-400 animate-pulse" : "bg-slate-600"
                          }`} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {node.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {node.automated ? (
                            <span className="px-2 py-0.5 text-[8.5px] font-black rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                              Otomatis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[8.5px] font-black rounded-lg bg-slate-900 text-slate-500 border border-slate-800 uppercase font-mono">
                              Manual
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWorkflowAutomated(node.id);
                            }}
                            className="text-[8.5px] font-black hover:text-indigo-400 text-slate-500 transition cursor-pointer"
                            title="Ubah sistem otomasi"
                          >
                            [SWITCH]
                          </button>
                        </div>
                      </div>

                      <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white mt-2">
                        {node.action}
                      </h5>

                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-[10px] text-indigo-300 font-semibold mt-2 border-t border-slate-800/80 pt-2 leading-relaxed"
                        >
                          📌 Catatan Lapangan: {node.notes}
                        </motion.p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Workflow summary */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  WORKFLOW INTELLIGENCE
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Sistem Koordinasi Terpusat
                </h4>

                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3">
                  <span className="text-[9px] text-slate-500 font-black block">KEUNGGULAN WORKFLOW PRAMA</span>
                  <p className="text-[10px] text-slate-200 leading-relaxed font-semibold">
                    Workflow digital ini menghilangkan birokrasi komunikasi via telepon/WhatsApp konvensional. Driver menerima instruksi secara real-time langsung pada panel kabin truk.
                  </p>

                  <div className="border-t border-slate-800/80 pt-3 text-[9px] text-slate-400 font-semibold space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>Transparansi audit rute bagi manajemen klien.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>Auto-escalation apabila unit berhenti melebihi 15 menit.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA WORKFLOW AUTOMATION v1.2
              </div>
            </div>
          </motion.div>
        )}

        {/* PILAR 3: PENETAPAN SLA (SERVICE LEVEL AGREEMENT CONTROLLER) */}
        {activeTab === "sla" && (
          <motion.div
            key="sla-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* SLA Control Sliders */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-indigo-400" />
                  Konfigurasi Ambang Batas Target SLA
                </h4>
                <p className="text-[10.5px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Gunakan slider kontrol di bawah untuk mengatur komitmen waktu layanan. Aturan SLA yang terlalu longgar akan memicu warning ketidakpatuhan, sedangkan target terlalu ketat memerlukan armada cadangan:
                </p>

                <div className="space-y-4 text-xs">
                  {/* Slider 1: Loading Target */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Target Pengisian Unit (Loading Time)</span>
                      <span className="text-indigo-400 font-black font-mono">{slaLoadingTarget} Menit</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={slaLoadingTarget}
                      onChange={(e) => setSlaLoadingTarget(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Slider 2: AI Alerts response */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Respon Peringatan Deviasi Geofence</span>
                      <span className="text-indigo-400 font-black font-mono">{slaDeviationResponse} Menit</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={slaDeviationResponse}
                      onChange={(e) => setSlaDeviationResponse(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Slider 3: e-POD upload */}
                  <div>
                    <div className="flex justify-between mb-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Sinkronisasi Manifes digital (e-POD)</span>
                      <span className="text-indigo-400 font-black font-mono">{slaEpodUpload} Menit</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="45"
                      step="1"
                      value={slaEpodUpload}
                      onChange={(e) => setSlaEpodUpload(Number(e.target.value))}
                      className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Setiap pelanggaran SLA memicu notifikasi otomatis ke Command Center Utama Prama.</span>
              </div>
            </div>

            {/* SLA Compliance Output */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  SLA COMPLIANCE CALCULATOR
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Hasil Kepatuhan SLA
                </h4>

                <div className="bg-slate-900/80 p-4 border border-slate-850 rounded-xl space-y-3.5">
                  <div className="text-center">
                    <span className="text-[9px] text-slate-500 font-black block">INDEX COMPLIANCE ESTIMATE</span>
                    <div className="text-2xl font-black text-white font-mono mt-1">
                      {finalSlaCompliance}% <span className="text-xs text-slate-400 font-bold">Kepatuhan</span>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded border text-[9.5px] font-semibold leading-relaxed text-left ${complianceColor}`}>
                    <span className="font-black uppercase block mb-0.5 text-[8.5px]">KLASIFIKASI: {complianceStatus}</span>
                    {statusDesc}
                  </div>

                  <div className="text-[9.5px] text-slate-300 font-semibold leading-relaxed border-t border-slate-800/80 pt-3 text-left">
                    💡 <span className="text-white">Saran Mitigasi:</span> Sediakan supir cadangan di pos timbang guna memotong durasi pergantian shift jika target waktu ketat.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SLA CALCULATOR ENGINE v1.1
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
