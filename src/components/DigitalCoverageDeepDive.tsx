import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Database,
  Smartphone,
  Eye,
  Settings,
  Terminal,
  Activity,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileText,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  RefreshCw,
  Gauge,
  Wifi,
  Radio,
  Lock,
  ChevronRight,
  Monitor
} from "lucide-react";

interface DigitalCoverageProps {
  projectTitle: string;
}

interface DigitalTool {
  id: string;
  name: string;
  type: "Hardware" | "SaaS" | "Platform Integration" | "Mobile App";
  status: "Aktif" | "Tahap Integrasi" | "Rencana";
  description: string;
  reliability: number; // % e.g., 99.8
}

interface TechImpact {
  id: string;
  metric: string;
  beforeValue: string;
  afterValue: string;
  improvement: string;
  icon: React.ReactNode;
}

export function DigitalCoverageDeepDive({ projectTitle }: DigitalCoverageProps) {
  const [activeTab, setActiveTab] = useState<"tools" | "method" | "impact" | "automation">("tools");

  // State 1: Alat Digital yang Digunakan (Tools)
  const [tools, setTools] = useState<DigitalTool[]>([
    {
      id: "tool-1",
      name: "PRAMA Telematics Smart GPS Node",
      type: "Hardware",
      status: "Aktif",
      description: "Sensor GPS heavy-duty terpasang di sasis truk dengan baterai cadangan 72 jam dan ketahanan cuaca IP69K.",
      reliability: 99.9
    },
    {
      id: "tool-2",
      name: "Festronik Digital (KLHK Integrated)",
      type: "Platform Integration",
      status: "Aktif",
      description: "Sistem pelaporan manifestasi limbah & kayu elektronik yang langsung sinkron dengan server database KLHK.",
      reliability: 99.7
    },
    {
      id: "tool-3",
      name: "Pancaran Mobile Driver App & e-POD",
      type: "Mobile App",
      status: "Aktif",
      description: "Aplikasi mobile pengemudi untuk mengonfirmasi titik koordinat muatan, rute, e-signatures, dan foto bukti bongkar.",
      reliability: 98.6
    },
    {
      id: "tool-4",
      name: "ERP Logistik & Arsitektur Cloud Prama",
      type: "SaaS",
      status: "Tahap Integrasi",
      description: "Sistem perencanaan sumber daya terpusat untuk alokasi supir, ban, penjadwalan servis, dan manajemen kas supir.",
      reliability: 99.5
    }
  ]);

  // State 2: Fokus Metodologi Digital (Method)
  const [selectedMethodology, setSelectedMethodology] = useState<string>("meth-1");
  const methodologies = [
    {
      id: "meth-1",
      title: "Lacak Balak & Geofencing Pintar (Chain of Custody)",
      objective: "Mendeteksi secara instan deviasi rute hauling dari peta konsesi resmi.",
      stepByStep: [
        "1. Penetapan poligon geofence pada koordinat konsesi hutan dan pabrik tujuan.",
        "2. Ping berkala dari transmiter GPS setiap 15 detik selama perjalanan.",
        "3. Sistem otomatis mengunci pintu kargo jika truk menyimpang lebih dari 500 meter dari rute hauling resmi."
      ],
      difficulty: "Menengah",
      valueRating: "Sangat Tinggi"
    },
    {
      id: "meth-2",
      title: "Predictive Fleet Maintenance via CAN-Bus Telemetry",
      objective: "Memproyeksikan kegagalan mesin sebelum truk mogok di jalan lateral.",
      stepByStep: [
        "1. Monitoring temperatur radiator, tekanan oli mesin, dan status kelistrikan via port sasis OBD.",
        "2. Algoritme analisis membandingkan deviasi suhu mesin dengan data historis perjalanan.",
        "3. Alert otomatis dikirim ke bengkel terdekat apabila sasis terdeteksi butuh penggantian suku cadang segera."
      ],
      difficulty: "Tinggi",
      valueRating: "Tinggi"
    },
    {
      id: "meth-3",
      title: "Real-time Backhaul Sharing Logistics Allocation",
      objective: "Menurunkan persentase 'empty miles' (truk pulang tanpa muatan) pada rute balik.",
      stepByStep: [
        "1. Pemetaan silang kebutuhan kirim kargo klien lain di sekitar rute pulang hauling.",
        "2. Pencocokan kapasitas gandar sasis dan jenis bak truk secara real-time via awan Prama.",
        "3. Pembaruan manifest digital driver secara otomatis via aplikasi mobile tanpa perlu kembali ke depo utama."
      ],
      difficulty: "Tinggi",
      valueRating: "Sangat Tinggi"
    }
  ];

  // State 3: Dampak Penerapan Teknologi (Impact Metrics)
  const impacts: TechImpact[] = [
    {
      id: "imp-1",
      metric: "Waktu Proses Manifest (e-POD vs Kertas)",
      beforeValue: "180 Menit",
      afterValue: "4 Menit",
      improvement: "97.7% Lebih Cepat",
      icon: <FileText className="h-4 w-4 text-emerald-400" />
    },
    {
      id: "imp-2",
      metric: "Deviasi Rute / Pencurian Muatan",
      beforeValue: "4.8% Ritase",
      afterValue: "0.05% Ritase",
      improvement: "98.9% Penurunan Kasus",
      icon: <AlertCircle className="h-4 w-4 text-rose-400" />
    },
    {
      id: "imp-3",
      metric: "Rasio Utilisasi Armada (Backhaul Sharing)",
      beforeValue: "42% Efektivitas",
      afterValue: "78% Efektivitas",
      improvement: "+85.7% Kenaikan Efisiensi",
      icon: <TrendingUp className="h-4 w-4 text-indigo-400" />
    }
  ];

  // State 4: Penerapan Otomatisasi Simulator (Automation)
  const [automationLevel, setAutomationLevel] = useState<number>(3); // Scale 1 to 5
  const [autoFestronik, setAutoFestronik] = useState<boolean>(true);
  const [geofenceLock, setGeofenceLock] = useState<boolean>(false);
  const [alertCommandCenter, setAlertCommandCenter] = useState<boolean>(true);

  // AUTOMATION INDEX CALCULATION
  const baseAutoScore = (automationLevel * 15) + (autoFestronik ? 10 : 0) + (geofenceLock ? 10 : 0) + (alertCommandCenter ? 5 : 0);
  const finalAutoPercent = Math.min(100, Math.max(15, baseAutoScore));

  let automationGrade = "Semi-Manual";
  let gradeColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
  let descriptionText = "Sistem logistik Anda masih sangat bergantung pada operator manusia di Command Center untuk memverifikasi alarm geofence secara manual.";

  if (finalAutoPercent >= 85) {
    automationGrade = "Fully Autonomous System";
    gradeColor = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
    descriptionText = "Sistem cerdas PRAMA melakukan auto-dispatch, e-locking kargo, integrasi manifest KLHK Festronik secara seamless tanpa intervensi manual.";
  } else if (finalAutoPercent >= 55) {
    automationGrade = "Hybrid Automated";
    gradeColor = "text-blue-400 border-blue-500/20 bg-blue-500/5";
    descriptionText = "Otomatisasi andal untuk manifestasi dokumen digital dan telemetri, didukung tim dispatchers yang siaga menerima sinyal deviasi rute.";
  }

  // Cost saving calculations based on Automation
  const standardCostPerMonth = 420000000; // IDR per year/fleet admin/loss
  const estimatedSavings = Math.round(standardCostPerMonth * (finalAutoPercent / 100) * 0.18); // Max 18% savings

  return (
    <div id="digital-coverage-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans relative">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              PRAMA SMART LOGISTICS HUB
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Cpu className="h-5 w-5 text-cyan-400" />
            Digital Coverage Core (Tools, Method, Impact, Automation)
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Analisis digitalisasi sistem operasional Pancaran Group: alat digital, metodologi geofencing, dampak real-time terhadap SLA, dan tingkat otomasi sistem.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TELEMETRY LINK:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase flex items-center gap-1">
            <Wifi className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
            SECURE ACTIVE
          </span>
        </div>
      </div>

      {/* TABS (The 4 segments requested by the user) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6 relative z-10">
        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === "tools"
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Database className="h-4 w-4" />
          1. Tools (Alat Digital)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("method")}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === "method"
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Sliders className="h-4 w-4" />
          2. Method (Metodologi)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("impact")}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === "impact"
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          3. Impact (Dampak)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("automation")}
          className={`px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
            activeTab === "automation"
              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/15"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Cpu className="h-4 w-4" />
          4. Automation (Otomatisasi)
        </button>
      </div>

      {/* CONTENT SEGMENTS DISPLAY */}
      <AnimatePresence mode="wait">
        
        {/* SEGMENT 1: ALAT DIGITAL YANG DIGUNAKAN (TOOLS) */}
        {activeTab === "tools" && (
          <motion.div
            key="tools-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-cyan-400" />
                  Katalog Perangkat Lunak & Sensor IoT Aktif
                </h4>
                <span className="text-[10px] text-slate-500 font-bold font-mono">
                  Standardisasi Industri 4.0 Logistik
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[310px] overflow-y-auto pr-1">
                {tools.map((t) => (
                  <div key={t.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="px-1.5 py-0.2 text-[8px] font-black rounded uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {t.type}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase ${
                          t.status === "Aktif" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white mb-1.5">
                        {t.name}
                      </h5>
                      <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 mt-3 pt-2 flex justify-between items-center text-[9px] text-slate-500 font-bold">
                      <span>KEANDALAN SISTEM</span>
                      <span className="font-mono text-cyan-400">{t.reliability}% Uptime</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-cyan-400 block mb-1">
                  SECURITY & STABILITY STATUS
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Sertifikasi Data Logistik
                </h4>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-900/80 border border-slate-850 rounded-xl space-y-2">
                    <span className="text-[9px] text-slate-500 font-black block">AES-256 ENCRYPTION</span>
                    <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
                      Seluruh transmisi data sensor lokasi GPS dan dokumen e-POD dienkripsi menggunakan standar keamanan militer guna mencegah pembajakan sinyal rute.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-850 rounded-xl space-y-2">
                    <span className="text-[9px] text-slate-500 font-black block">DASHBOARD INTEGRASI API</span>
                    <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
                      Klien dapat mengintegrasikan dashboard internal mereka dengan server Prama API secara instan via JSON Web Tokens.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA SECURITY CORE v1.4
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 2: FOKUS METODOLOGI DIGITAL (METHOD) */}
        {activeTab === "method" && (
          <motion.div
            key="method-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            <div className="lg:col-span-5 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Metodologi Smart Logistics
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Pilihlah salah satu metodologi digital di bawah ini untuk mempelajari langkah demi langkah implementasi teknisnya di lapangan:
                </p>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {methodologies.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethodology(m.id)}
                      className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedMethodology === m.id
                          ? "bg-cyan-950/20 border-cyan-500/80 text-white"
                          : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800"
                      }`}
                    >
                      <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white mb-1">
                        {m.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8.5px] font-bold text-slate-500">KESULITAN:</span>
                        <span className="text-[8.5px] font-black text-amber-400 font-mono">{m.difficulty}</span>
                        <span className="text-[9px] text-slate-600 font-black">•</span>
                        <span className="text-[8.5px] font-bold text-slate-500">NILAI:</span>
                        <span className="text-[8.5px] font-black text-emerald-400 font-mono">{m.valueRating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA LOGISTICS METHODOLOGY HUB
              </div>
            </div>

            {/* Step-by-Step details of selected Methodology */}
            <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              {(() => {
                const methObj = methodologies.find(m => m.id === selectedMethodology) || methodologies[0];
                return (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[8.5px] font-mono font-black text-cyan-400 block mb-1">
                        METODOLOGI DETAIL INTERAKTIF
                      </span>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">
                        {methObj.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-semibold mt-1.5 bg-slate-900 p-2.5 rounded-lg border border-slate-850/50 leading-relaxed">
                        🎯 <span className="text-white">Sasaran Utama:</span> {methObj.objective}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9.5px] text-slate-500 font-black tracking-wider block">LANGKAH-LANGKAH ALUR KERJA (STEP-BY-STEP)</span>
                      <div className="space-y-2">
                        {methObj.stepByStep.map((step, idx) => (
                          <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-850/80 flex gap-2.5 items-start">
                            <span className="h-5 w-5 bg-cyan-600/10 text-cyan-400 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 font-mono">
                              {idx + 1}
                            </span>
                            <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed">
                              {step.substring(3)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA STANDARD OPERATING PROCEDURE (SOP) DIGITAL v1.1
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 3: DAMPAK PENERAPAN TEKNOLOGI (IMPACT) */}
        {activeTab === "impact" && (
          <motion.div
            key="impact-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            <div className="lg:col-span-8 bg-slate-950/50 border border-slate-800 rounded-2xl p-4.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Matriks Efisiensi (Sebelum vs Sesudah Teknologi)
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                Pemangkasan birokrasi fisik kertas dan pelacakan rute hauling memangkas kerugian material, pungutan liar, serta waktu pengiriman di seluruh armada.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {impacts.map((imp) => (
                  <div key={imp.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] text-white font-black uppercase leading-tight max-w-[80%]">
                          {imp.metric}
                        </span>
                        <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                          {imp.icon}
                        </div>
                      </div>

                      <div className="space-y-1.5 my-2">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                          <span>Sebelum Digitalisasi:</span>
                          <span className="text-slate-400 line-through">{imp.beforeValue}</span>
                        </div>
                        <div className="flex justify-between text-[10.5px] font-black text-slate-200">
                          <span>Sesudah Integrasi:</span>
                          <span className="text-cyan-400 font-mono">{imp.afterValue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-950/15 border border-emerald-900/50 p-1.5 rounded text-center mt-3">
                      <span className="text-[10px] font-black text-emerald-400 uppercase font-mono">
                        📈 {imp.improvement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational safety SLA badge card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-cyan-400 block mb-1">
                  SLA GUARANTEE
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Ketepatan Waktu (On-Time Delivery)
                </h4>

                <div className="space-y-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-center">
                    <span className="text-[9px] text-slate-500 font-black block">KONSISTENSI SLA HARIAN</span>
                    <span className="text-3xl font-black text-white font-display font-mono">
                      98.8%
                    </span>
                    <p className="text-[9.5px] text-slate-400 mt-1 font-semibold">
                      SLA terjamin berkat navigasi pintar pengelak rute banjir di Swarnadwipa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4">
                PRAMA SLA INTEGRITY ASSURANCE v1.0
              </div>
            </div>
          </motion.div>
        )}

        {/* SEGMENT 4: PENERAPAN OTOMATISASI (AUTOMATION) */}
        {activeTab === "automation" && (
          <motion.div
            key="automation-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left relative z-10"
          >
            {/* Automation Level Controller Simulator */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Konfigurasi Tingkat Otomatisasi (Automation Simulator)
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Gunakan simulator di bawah ini untuk menyesuaikan level otomatisasi sensor IoT & integrasi server, guna melihat taksiran penghematan biaya administrasi logistik:
                </p>

                <div className="space-y-4 text-xs">
                  {/* Slider: Otomasi level */}
                  <div>
                    <div className="flex justify-between mb-1 text-[10px]">
                      <span className="text-slate-400 font-bold">Skala Otomatisasi Logistik</span>
                      <span className="text-cyan-400 font-black">Level {automationLevel} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={automationLevel}
                      onChange={(e) => setAutomationLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold mt-1 uppercase">
                      <span>1. Manual</span>
                      <span>3. Terbantu AI</span>
                      <span>5. Otonom Penuh</span>
                    </div>
                  </div>

                  {/* Toggle switches */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-850">
                      <span className="text-[9.5px] text-slate-300 font-bold">Auto-Festronik</span>
                      <button
                        type="button"
                        onClick={() => setAutoFestronik(!autoFestronik)}
                        className={`px-2 py-0.5 rounded text-[8px] font-black cursor-pointer border ${
                          autoFestronik ? "bg-cyan-600 border-cyan-500 text-white" : "bg-slate-950 text-slate-500 border-slate-800"
                        }`}
                      >
                        {autoFestronik ? "AKTIF" : "OFF"}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-850">
                      <span className="text-[9.5px] text-slate-300 font-bold">Geofence Locking</span>
                      <button
                        type="button"
                        onClick={() => setGeofenceLock(!geofenceLock)}
                        className={`px-2 py-0.5 rounded text-[8px] font-black cursor-pointer border ${
                          geofenceLock ? "bg-cyan-600 border-cyan-500 text-white" : "bg-slate-950 text-slate-500 border-slate-800"
                        }`}
                      >
                        {geofenceLock ? "AKTIF" : "OFF"}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-850">
                      <span className="text-[9.5px] text-slate-300 font-bold">Command Alert</span>
                      <button
                        type="button"
                        onClick={() => setAlertCommandCenter(!alertCommandCenter)}
                        className={`px-2 py-0.5 rounded text-[8px] font-black cursor-pointer border ${
                          alertCommandCenter ? "bg-cyan-600 border-cyan-500 text-white" : "bg-slate-950 text-slate-500 border-slate-800"
                        }`}
                      >
                        {alertCommandCenter ? "AKTIF" : "OFF"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-semibold">
                * Otomatisasi tinggi meminimalkan salah ketik supir dan kesalahan penempatan koordinat rute lateral.
              </div>
            </div>

            {/* Output results of Automation Simulator */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">
                  AUTOMATION FINANCIAL OUTCOMES
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">
                  Efisiensi Anggaran Administrasi
                </h4>

                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-3.5 text-left">
                  <div>
                    <span className="text-[9px] text-slate-500 font-black block">INDEKS OTOMATISASI</span>
                    <div className="text-lg font-black text-cyan-400 font-mono">
                      {finalAutoPercent}% <span className="text-xs text-slate-400 font-bold">Terintegrasi</span>
                    </div>
                  </div>

                  <div className={`p-2 rounded border text-[9.5px] font-semibold leading-relaxed ${gradeColor}`}>
                    <span className="font-black uppercase block mb-0.5 text-[8.5px]">GRADE: {automationGrade}</span>
                    {descriptionText}
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-black block">POTENSI HEMAT BIAYA (EFISIENSI)</span>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      +Rp {estimatedSavings.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-bold">/ Armada / Thn</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 font-bold mt-4 font-mono">
                PRAMA DIGITAL AUTOMATION COST CALCULATOR v1.2
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
