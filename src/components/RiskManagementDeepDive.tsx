import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle,
  TrendingDown,
  Plus,
  Trash2,
  Info,
  Sliders,
  ShieldCheck,
  Zap,
  HelpCircle,
  Activity,
  FileText,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { getSectorRiskProfile } from "../utils/sectorOpportunityHelper";

interface RiskManagementProps {
  projectTitle: string;
}

interface RiskItem {
  id: string;
  code: string;
  category: "Operasional" | "Finansial" | "Regulasi/Kepatuhan" | "Sosial/Lingkungan";
  title: string;
  likelihood: number; // 1 to 5
  impact: number; // 1 to 5
  description: string;
  negativeImpactAnalysis: string;
  mitigationStrategy: string;
}

export function RiskManagementDeepDive({ projectTitle }: RiskManagementProps) {
  const riskProfile = getSectorRiskProfile(projectTitle);

  // Pre-loaded high-fidelity risk register
  const [risks, setRisks] = useState<RiskItem[]>(riskProfile.risks);

  // Selected risk for displaying detailed analysis
  const [selectedRiskId, setSelectedRiskId] = useState<string>("risk-1");

  useEffect(() => {
    setRisks(riskProfile.risks);
    if (riskProfile.risks.length > 0) {
      setSelectedRiskId(riskProfile.risks[0].id);
    }
  }, [projectTitle]);

  // Custom risk creator states
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<RiskItem["category"]>("Operasional");
  const [newLikelihood, setNewLikelihood] = useState<number>(3);
  const [newImpact, setNewImpact] = useState<number>(3);
  const [newDesc, setNewDesc] = useState("");
  const [newNegImpact, setNewNegImpact] = useState("");
  const [newMitigation, setNewMitigation] = useState("");

  // Risk Score Calculator (Sandbox)
  const [calcLikelihood, setCalcLikelihood] = useState<number>(3);
  const [calcImpact, setCalcImpact] = useState<number>(4);
  const calcScore = calcLikelihood * calcImpact;

  // Mitigation Readiness checklist
  const [readinessChecklist, setReadinessChecklist] = useState([
    { id: "rc-1", text: "Seluruh supir memiliki sertifikasi K3 & Defensive Driving", completed: true },
    { id: "rc-2", text: "Manifes lacak balak (SVLK) terintegrasi sistem digital", completed: true },
    { id: "rc-3", text: "Pemasangan telemetry GPS satelit di 100% armada aktif", completed: false },
    { id: "rc-4", text: "Asuransi kecelakaan kerja dan asuransi muatan (all-risk)", completed: true },
    { id: "rc-5", text: "Kontrak kerja sama memiliki klausul penyesuaian tarif solar", completed: false },
    { id: "rc-6", text: "Forum koordinasi keamanan desa penyangga berjalan rutin", completed: false },
  ]);

  const toggleChecklist = (id: string) => {
    setReadinessChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const getCompletedCount = () => readinessChecklist.filter(item => item.completed).length;
  const getReadinessPercentage = () => Math.round((getCompletedCount() / readinessChecklist.length) * 100);

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: "EKSTREM", color: "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20", dot: "bg-rose-500" };
    if (score >= 10) return { label: "TINGGI", color: "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20", dot: "bg-orange-500" };
    if (score >= 5) return { label: "SEDANG", color: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20", dot: "bg-amber-500" };
    return { label: "RENDAH", color: "bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20", dot: "bg-teal-500" };
  };

  const getMatrixCellColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 15) return "bg-rose-950/40 border-rose-900/50 hover:bg-rose-900/50 text-rose-300";
    if (score >= 10) return "bg-orange-950/40 border-orange-900/50 hover:bg-orange-900/50 text-orange-300";
    if (score >= 5) return "bg-amber-950/40 border-amber-900/50 hover:bg-amber-900/50 text-amber-300";
    return "bg-teal-950/40 border-teal-900/50 hover:bg-teal-900/50 text-teal-300";
  };

  const selectedRisk = risks.find(r => r.id === selectedRiskId) || risks[0];

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const rItem: RiskItem = {
      id: `custom-${Date.now()}`,
      code: `RSK-CU${risks.length + 1}`,
      category: newCat,
      title: newTitle,
      likelihood: newLikelihood,
      impact: newImpact,
      description: newDesc || "Tidak ada deskripsi rinci.",
      negativeImpactAnalysis: newNegImpact || "Tidak ada analisis dampak.",
      mitigationStrategy: newMitigation || "Tidak ada mitigasi pencegahan terperinci."
    };

    setRisks(prev => [...prev, rItem]);
    setSelectedRiskId(rItem.id);
    setNewTitle("");
    setNewDesc("");
    setNewNegImpact("");
    setNewMitigation("");
  };

  const handleDeleteRisk = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRisks(prev => prev.filter(r => r.id !== id));
    if (selectedRiskId === id) {
      setSelectedRiskId(risks[0]?.id || "");
    }
  };

  return (
    <div id="risk-management-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans">
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              PRAMA PREVENTIVE FRAMEWORK v2.0
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            Interactive Risk & Control Dashboard
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Identifikasi bahaya, analisis dampak negatif finansial/sosial, serta kelola tindakan mitigasi pencegahan secara dinamis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Index Ketahanan:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            ESG ALIGNED
          </span>
        </div>
      </div>

      {/* ROW 1: 5x5 RISK HEATMAP MATRIX & THE REGISTER LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 text-left">
        
        {/* Left Grid: 5x5 Matrix Grid */}
        <div className="lg:col-span-5 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-rose-400" />
              Matriks Tingkat Risiko (Likelihood x Impact)
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">
              Posisikan risiko proyek Anda di dalam matriks standardisasi ISO 31000 untuk menentukan tingkat penanganan wajib.
            </p>

            {/* The Matrix Canvas */}
            <div className="relative mt-2">
              {/* Likelihood Label Side */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[8.5px] font-black text-slate-500 tracking-widest origin-center">
                LIKELIHOOD (KEMUNGKINAN) →
              </div>

              <div className="pl-6 pb-6">
                <div className="grid grid-cols-5 gap-1.5">
                  {/* Generate cells from 5 (Sangat Sering) down to 1 (Sangat Jarang) */}
                  {[5, 4, 3, 2, 1].map((l) => (
                    <React.Fragment key={l}>
                      {[1, 2, 3, 4, 5].map((i) => {
                        const cellScore = l * i;
                        // find if any active risk maps to this cell
                        const risksInCell = risks.filter(r => r.likelihood === l && r.impact === i);
                        const isCellSelected = selectedRisk && selectedRisk.likelihood === l && selectedRisk.impact === i;

                        return (
                          <div
                            key={`${l}-${i}`}
                            title={`Likelihood ${l}, Impact ${i} (Score: ${cellScore})`}
                            className={`aspect-square border rounded-lg p-1 flex flex-col items-center justify-center relative cursor-pointer transition-all ${getMatrixCellColor(l, i)} ${
                              isCellSelected ? "ring-2 ring-white border-white scale-[1.03]" : ""
                            }`}
                            onClick={() => {
                              if (risksInCell.length > 0) {
                                setSelectedRiskId(risksInCell[0].id);
                              }
                            }}
                          >
                            {/* Score Text */}
                            <span className="text-[8px] font-black opacity-30 absolute bottom-1 right-1">{cellScore}</span>
                            
                            {/* Plot Risks inside cell */}
                            {risksInCell.length > 0 && (
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {risksInCell.map((risk) => (
                                  <span
                                    key={risk.id}
                                    className={`h-2.5 w-2.5 rounded-full border border-black/50 ${getRiskLevel(cellScore).dot} ${
                                      selectedRiskId === risk.id ? "ring-2 ring-white animate-pulse" : ""
                                    }`}
                                    title={`${risk.code}: ${risk.title}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>

                {/* Impact Axis Labels bottom */}
                <div className="grid grid-cols-5 gap-1.5 mt-2 text-center text-[9px] font-black text-slate-500 tracking-wider">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div className="text-center text-[8.5px] font-black text-slate-500 tracking-widest mt-1">
                  ← IMPACT (DAMPAK NEGATIF) →
                </div>
              </div>
            </div>
          </div>

          {/* Color Guides Legend */}
          <div className="border-t border-slate-900 pt-3 mt-2 grid grid-cols-4 gap-1 text-[8.5px] font-black text-center">
            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 py-0.5 rounded">RENDAH (1-4)</span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 py-0.5 rounded">SEDANG (5-9)</span>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 py-0.5 rounded">TINGGI (10-14)</span>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 py-0.5 rounded">EKSTREM (15-25)</span>
          </div>
        </div>

        {/* Right Grid: Live Risk Register List */}
        <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-rose-400" />
                Daftar Risiko Terdaftar (Risk Register)
              </h4>
              <span className="text-[9px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                {risks.length} Risiko Total
              </span>
            </div>
            
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {risks.map((risk) => {
                const score = risk.likelihood * risk.impact;
                const level = getRiskLevel(score);
                const isSelected = selectedRiskId === risk.id;

                return (
                  <div
                    key={risk.id}
                    onClick={() => setSelectedRiskId(risk.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative flex items-start gap-3 ${
                      isSelected
                        ? "bg-slate-900 border-rose-500/50 shadow-md scale-[1.01]"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="shrink-0 pt-0.5">
                      <span className={`h-3 w-3 rounded-full block ${level.dot} ${isSelected ? "animate-pulse" : ""}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        <span className="text-[9px] font-mono font-black text-slate-400">{risk.code}</span>
                        <span className="text-[8.5px] font-black text-slate-500">•</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">{risk.category}</span>
                      </div>
                      
                      <h5 className="text-[11.5px] font-black text-slate-100 uppercase tracking-tight truncate">
                        {risk.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                        {risk.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <span className={`px-1.5 py-0.5 text-[8.5px] font-black rounded-md border ${level.color}`}>
                        {level.label} ({score})
                      </span>
                      {risks.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteRisk(risk.id, e)}
                          className="p-1 text-slate-600 hover:text-rose-400 hover:bg-slate-800/50 rounded transition border-none cursor-pointer"
                          title="Hapus Risiko"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[9.5px] text-slate-500 font-semibold mt-4 text-center">
            💡 Tips: Klik kartu risiko di atas untuk memuat bedah terperinci dan playbooks mitigasi pencegahan di bagian bawah.
          </p>
        </div>
      </div>

      {/* ROW 2: DETAILED ANALYSIS PANEL (IDENTIFICATION, IMPACT, MITIGATION) */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 mb-4 gap-3">
          <div>
            <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest">ANALISIS FOKUS SEGMEN</span>
            <h4 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">
              Bedah Detail Kasus Risiko: {selectedRisk?.code} • {selectedRisk?.title}
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400">Tingkat Bahaya:</span>
            <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase border ${getRiskLevel(selectedRisk?.likelihood * selectedRisk?.impact).color}`}>
              {getRiskLevel(selectedRisk?.likelihood * selectedRisk?.impact).label} (Score {selectedRisk?.likelihood * selectedRisk?.impact})
            </span>
          </div>
        </div>

        {/* The 3 Pillars of Risk requested by the user */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Identifikasi Risiko */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <h5 className="text-[11.5px] font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              1. Identifikasi Potensi Risiko
            </h5>
            <p className="text-[10px] text-slate-400 font-bold mb-2">
              Deskripsi Kejadian Bahaya:
            </p>
            <p className="text-[10.5px] text-slate-200 font-semibold leading-relaxed">
              {selectedRisk?.description}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between text-[9px] text-slate-500 font-black">
              <span>Likelihood: {selectedRisk?.likelihood} / 5</span>
              <span>Kategori: {selectedRisk?.category}</span>
            </div>
          </div>

          {/* Pillar 2: Analisis Dampak Negatif */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
            <h5 className="text-[11.5px] font-black text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 shrink-0" />
              2. Analisis Dampak Negatif
            </h5>
            <p className="text-[10px] text-slate-400 font-bold mb-2">
              Dampak Kerugian Proyek:
            </p>
            <p className="text-[10.5px] text-slate-200 font-semibold leading-relaxed">
              {selectedRisk?.negativeImpactAnalysis}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between text-[9px] text-slate-500 font-black">
              <span>Impact Score: {selectedRisk?.impact} / 5</span>
              <span>Dampak Keuangan: Tinggi</span>
            </div>
          </div>

          {/* Pillar 3: Langkah Mitigasi Pencegahan */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <h5 className="text-[11.5px] font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              3. Langkah Mitigasi Pencegahan
            </h5>
            <p className="text-[10px] text-slate-400 font-bold mb-2">
              Tindakan Preventif & Solusi:
            </p>
            <p className="text-[10.5px] text-slate-200 font-semibold leading-relaxed">
              {selectedRisk?.mitigationStrategy}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between text-[9px] text-slate-500 font-black">
              <span>Resiliensi Pasca Mitigasi: Tinggi</span>
              <span>Control Level: Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: DETAILED SANDBOX CALCULATOR & AUDIT CHECKLISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Sandbox Calculator Left */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-rose-400" />
            Kalkulator Risiko Kustom & Register Baru
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
            Gunakan form ini untuk menilai risiko operasional baru, menghitung skor keparahannya secara otomatis, dan menambahkannya ke register proyek aktif Anda.
          </p>

          <form onSubmit={handleAddRisk} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-0.5">Judul Risiko</label>
              <input
                type="text"
                placeholder="e.g. Masalah Kualitas Sasis Ban Luar"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-rose-500 outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-300 mb-0.5">Kategori</label>
                <select
                  value={newCat}
                  onChange={(e: any) => setNewCat(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold"
                >
                  <option value="Operasional">Operasional</option>
                  <option value="Finansial">Finansial</option>
                  <option value="Regulasi/Kepatuhan">Regulasi</option>
                  <option value="Sosial/Lingkungan">Sosial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-0.5">Likelihood (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newLikelihood}
                  onChange={(e) => setNewLikelihood(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-0.5">Impact (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newImpact}
                  onChange={(e) => setNewImpact(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-0.5">Definisi Kejadian Bahaya</label>
              <input
                type="text"
                placeholder="Rincian kejadian potensi bahaya di lapangan..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white outline-none focus:border-rose-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-0.5">Dampak Negatif Finansial/Ops</label>
              <input
                type="text"
                placeholder="Deskripsi konsekuensi finansial & operasional..."
                value={newNegImpact}
                onChange={(e) => setNewNegImpact(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white outline-none focus:border-rose-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-0.5">Mitigasi & Rencana Kontinjensi</label>
              <input
                type="text"
                placeholder="Langkah antisipasi & pemulihan darurat..."
                value={newMitigation}
                onChange={(e) => setNewMitigation(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white outline-none focus:border-rose-500 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black rounded-lg transition border-none cursor-pointer uppercase flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="h-4 w-4" />
              Simpan Risiko & Bedah
            </button>
          </form>
        </div>

        {/* Readiness Checklist Audit Right */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Audit Kesiapan Pencegahan (Operational Resilience Score)
              </h4>
              <span className="text-xs font-mono font-black text-emerald-400">
                {getReadinessPercentage()}% RESILIENT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
              Centang tindakan pencegahan yang sudah aktif di lapangan untuk melihat persentase kekebalan operasional armada Anda dari ancaman eksternal.
            </p>

            {/* Resilience Progress Bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full mb-5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${getReadinessPercentage()}%` }}
              />
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readinessChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                    item.completed
                      ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                    item.completed ? "bg-emerald-500 border-emerald-400 text-slate-900" : "border-slate-700"
                  }`}>
                    {item.completed && <CheckCircle className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="text-[10.5px] font-semibold leading-snug">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
            <span>Sistem Audit Ketahanan Pancaran BI v4.5</span>
            <span className="text-emerald-400 font-black">Sertifikat Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
