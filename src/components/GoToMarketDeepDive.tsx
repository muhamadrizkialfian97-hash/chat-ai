import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Megaphone,
  Handshake,
  Briefcase,
  TrendingUp,
  Sliders,
  DollarSign,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle,
  Plus,
  Trash2,
  PieChart,
  BarChart2,
  Check
} from "lucide-react";
import { getSectorGtmProfile } from "../utils/sectorOpportunityHelper";

interface GoToMarketProps {
  projectTitle: string;
}

interface TargetAudience {
  id: string;
  name: string;
  tier: "Tier-1 Utama" | "Tier-2 Sekunder" | "Tier-3 Niche";
  need: string;
  matchIndex: number; // 1-100%
  stabilityWeight: "Sangat Tinggi" | "Tinggi" | "Sedang";
}

interface MarketingChannel {
  id: string;
  channelName: string;
  costEstimate: number; // IDR
  conversionRate: number; // %
  impactLevel: "Sangat Tinggi" | "Tinggi" | "Sedang";
  details: string;
}

export function GoToMarketDeepDive({ projectTitle }: GoToMarketProps) {
  const gtmProfile = getSectorGtmProfile(projectTitle);

  // 1. Interactive States for Target Audience List
  const [audiences, setAudiences] = useState<TargetAudience[]>(gtmProfile.audiences);

  // Selected Target Audience for Highlight View
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>("aud-1");

  // 2. Interactive Calculator: B2B Contract Lifetime Value (LTV) Planner
  const [estVolumePerMonth, setEstVolumePerMonth] = useState<number>(12000); // Tons
  const [ratePerTon, setRatePerTon] = useState<number>(380000); // IDR
  const [contractMonths, setContractMonths] = useState<number>(36); // Months
  const [guaranteeFactor, setGuaranteeFactor] = useState<number>(85); // % minimum guaranteed volume clause

  // 3. Marketing Channels Campaign Simulator
  const [channels, setChannels] = useState<MarketingChannel[]>(gtmProfile.channels);

  useEffect(() => {
    setAudiences(gtmProfile.audiences);
    setChannels(gtmProfile.channels);
    if (gtmProfile.audiences.length > 0) {
      setSelectedAudienceId(gtmProfile.audiences[0].id);
    }
  }, [projectTitle]);

  // States to add custom channel
  const [newChanName, setNewChanName] = useState("");
  const [newChanCost, setNewChanCost] = useState<number>(25000000);
  const [newChanConv, setNewChanConv] = useState<number>(10);
  const [newChanImpact, setNewChanImpact] = useState<"Sangat Tinggi" | "Tinggi" | "Sedang">("Tinggi");
  const [newChanDetails, setNewChanDetails] = useState("");

  // States to add custom audience
  const [newAudName, setNewAudName] = useState("");
  const [newAudTier, setNewAudTier] = useState<TargetAudience["tier"]>("Tier-1 Utama");
  const [newAudNeed, setNewAudNeed] = useState("");
  const [newAudMatch, setNewAudMatch] = useState<number>(85);
  const [newAudStability, setNewAudStability] = useState<TargetAudience["stabilityWeight"]>("Tinggi");

  // GTM Priority Tabs for visual navigation
  const [activeSegment, setActiveSegment] = useState<"audience" | "communication" | "stability" | "sales">("audience");

  // Business Priorities / Revenue Stability checkboxes
  const [stabilityTactics, setStabilityTactics] = useState([
    { id: "st-1", title: "Fuel Escalation Clause (Klausul Penyesuaian Solar)", description: "Perlindungan margin laba otomatis dari kenaikan harga bahan bakar industri non-subsidi.", checked: true },
    { id: "st-2", title: "Take-or-Pay Minimum Volume Guarantee (80%+)", description: "Klien tetap membayar tarif dasar minimal sekalipun volume tebangan mereka turun di bawah kuota bulanan.", checked: true },
    { id: "st-3", title: "Co-Investment Rute & Maintenance Jalan", description: "Bagi hasil biaya pengerasan jalan lateral logistik bersama pemilik konsesi hutan untuk menjamin kelancaran hauling.", checked: false },
    { id: "st-4", title: "Sertifikasi SVLK & FSC Transporter Terdaftar", description: "Kunci masuk utama ke ekosistem logistik korporasi kertas dunia guna menghindari penghentian rantai pasok mendadak.", checked: true },
  ]);

  const toggleStabilityTactic = (id: string) => {
    setStabilityTactics(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim()) return;
    const item: MarketingChannel = {
      id: `chan-${Date.now()}`,
      channelName: newChanName,
      costEstimate: newChanCost,
      conversionRate: newChanConv,
      impactLevel: newChanImpact,
      details: newChanDetails || "Tidak ada rincian tambahan."
    };
    setChannels(prev => [...prev, item]);
    setNewChanName("");
    setNewChanDetails("");
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(prev => prev.filter(c => c.id !== id));
  };

  const handleAddAudience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudName.trim()) return;
    const item: TargetAudience = {
      id: `aud-${Date.now()}`,
      name: newAudName,
      tier: newAudTier,
      need: newAudNeed,
      matchIndex: newAudMatch,
      stabilityWeight: newAudStability
    };
    setAudiences(prev => [...prev, item]);
    setSelectedAudienceId(item.id);
    setNewAudName("");
    setNewAudNeed("");
  };

  const handleDeleteAudience = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAudiences(prev => prev.filter(a => a.id !== id));
    if (selectedAudienceId === id) {
      setSelectedAudienceId(audiences[0]?.id || "");
    }
  };

  // Math Calculations for B2B Contract LTV Simulator
  const monthlyGrossVal = estVolumePerMonth * ratePerTon;
  const guaranteedMonthlyVal = monthlyGrossVal * (guaranteeFactor / 100);
  const totalContractVal = monthlyGrossVal * contractMonths;
  const totalGuaranteedContractVal = guaranteedMonthlyVal * contractMonths;

  // Selected audience highlight helper
  const selectedAudience = audiences.find(a => a.id === selectedAudienceId) || audiences[0];

  return (
    <div id="go-to-market-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 overflow-hidden font-sans">
      {/* Dynamic background lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              PRAMA GO-TO-MARKET EXECUTION
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-white font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-display">
            <Target className="h-5 w-5 text-sky-400" />
            Interactive Go-To-Market Strategic Planner
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold max-w-2xl leading-relaxed">
            Sistem simulasi segmentasi audiens, analisis konversi saluran pemasaran B2B, strategi stabilitas pendapatan jangka panjang, serta taktik penjualan penetrasi pasar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Model GTM:</span>
          <span className="px-2.5 py-1 text-[9.5px] font-extrabold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ENTERPRISE CONTRACT (B2B)
          </span>
        </div>
      </div>

      {/* SEGMENTATION SWITCHER TABS - The 4 pillars requested by the user */}
      <div className="flex flex-wrap gap-2 mb-6 justify-start">
        <button
          type="button"
          onClick={() => setActiveSegment("audience")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeSegment === "audience"
              ? "bg-sky-600 text-white border-sky-500 shadow-md"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Target className="h-4 w-4" />
          1. Target Audiens
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment("communication")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeSegment === "communication"
              ? "bg-sky-600 text-white border-sky-500 shadow-md"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Megaphone className="h-4 w-4" />
          2. Komunikasi & Pemasaran
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment("stability")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeSegment === "stability"
              ? "bg-sky-600 text-white border-sky-500 shadow-md"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Handshake className="h-4 w-4" />
          3. Stabilitas Pendapatan
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment("sales")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
            activeSegment === "sales"
              ? "bg-sky-600 text-white border-sky-500 shadow-md"
              : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          4. Taktik Penjualan B2B
        </button>
      </div>

      {/* DYNAMIC WORKSPACE BODY */}
      <AnimatePresence mode="wait">
        
        {/* PILLAR 1: TARGET AUDIENCE WORKSPACE */}
        {activeSegment === "audience" && (
          <motion.div
            key="audience-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6"
          >
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-sky-400" />
                  Pemetaan & Analisis Target Audiens Strategis (B2B Segments)
                </h4>
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full w-fit">
                  {audiences.length} Segmen Terdaftar
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Penentuan segmen pasar bernilai tinggi yang diselaraskan dengan armada logistik hybrid satelit, verifikasi sertifikasi otomatis, dan keandalan operasional Pancaran Group untuk proyek <span className="text-sky-400 font-bold">{projectTitle || "Kajian Strategis Forestry Transportation"}</span>.
              </p>
            </div>

            {/* Structured Text-based Segments List */}
            <div className="space-y-4 border-l-2 border-sky-500/40 pl-4 py-1">
              {audiences.map((aud, idx) => {
                return (
                  <div key={aud.id} className="relative space-y-1.5 pb-2">
                    {/* Dot marker */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-sky-400 border-2 border-sky-500" />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-sky-400 uppercase">
                          Segmen {idx + 1}:
                        </span>
                        <h5 className="text-[13px] font-black uppercase text-white tracking-tight">
                          {aud.name}
                        </h5>
                        <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black rounded uppercase ${
                          aud.tier === "Tier-1 Utama"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : aud.tier === "Tier-2 Sekunder"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}>
                          {aud.tier}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Match Index: {aud.matchIndex}%
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-semibold">
                          • Resiliensi: <strong className="text-slate-200">{aud.stabilityWeight}</strong>
                        </span>
                      </div>

                      {audiences.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAudience(aud.id, e)}
                          className="px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition cursor-pointer border border-transparent hover:border-slate-800"
                          title="Hapus Segmen"
                        >
                          ✕ Hapus
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 font-semibold space-y-1 pt-1">
                      <p>
                        <strong className="text-white uppercase font-bold text-[10px]">• Kebutuhan Logistik Kritis: </strong>
                        {aud.need}
                      </p>
                      <p>
                        <strong className="text-sky-300 uppercase font-bold text-[10px]">• Taktik Penetrasi GTM Pancaran: </strong>
                        Lobby langsung tingkat direksi dengan mendemokan dashboard telemetri satelit GPS real-time untuk menjamin kepastian siklus hauling dan kepatuhan standar K3LL.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form to add custom audience */}
            <div className="border-t border-slate-800/80 pt-4">
              <h5 className="text-[11px] font-black text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-sky-400" />
                Daftarkan Segmen Audiens B2B Baru
              </h5>
              <form onSubmit={handleAddAudience} className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Nama Perusahaan / Segmen Klien"
                    value={newAudName}
                    onChange={(e) => setNewAudName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    value={newAudTier}
                    onChange={(e: any) => setNewAudTier(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold"
                  >
                    <option value="Tier-1 Utama">Tier-1 Utama (MNC/Key Account)</option>
                    <option value="Tier-2 Sekunder">Tier-2 Sekunder (Pabrik Regional)</option>
                    <option value="Tier-3 Niche">Tier-3 Niche (Spesialis / Lokal)</option>
                  </select>
                </div>
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Kebutuhan Logistik Spesifik..."
                    value={newAudNeed}
                    onChange={(e) => setNewAudNeed(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none"
                  />
                </div>
                <div className="md:col-span-12">
                  <button
                    type="submit"
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-lg transition uppercase border-none cursor-pointer text-xs"
                  >
                    + Simpan & Tambahkan Segmen Audiens
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* PILLAR 2: COMMUNICATION & MARKETING WORKSPACE */}
        {activeSegment === "communication" && (
          <motion.div
            key="communication-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6"
          >
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1.5">
                <Megaphone className="h-4.5 w-4.5 text-sky-400" />
                Metode Komunikasi, Kampanye & Bauran Pemasaran B2B
              </h4>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Menentukan bauran promosi dan metode keterlibatan eksekutif tingkat tinggi guna mengamankan reputasi Pancaran Group sebagai penyedia transportasi kehutanan utama.
              </p>
            </div>

            {/* Campaign text list */}
            <div className="space-y-4 border-l-2 border-sky-500/40 pl-4 py-1">
              {channels.map((chan, idx) => (
                <div key={chan.id} className="relative space-y-1 pb-2">
                  {/* Dot marker */}
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-400 border-2 border-indigo-500" />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-indigo-400 uppercase">
                        Saluran {idx + 1}:
                      </span>
                      <h5 className="text-[13px] font-black uppercase text-white tracking-tight">
                        {chan.channelName}
                      </h5>
                      <span className={`px-2 py-0.5 text-[8.5px] font-mono font-black rounded uppercase ${
                        chan.impactLevel === "Sangat Tinggi"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        Dampak: {chan.impactLevel}
                      </span>
                      <span className="text-[9.5px] font-mono font-black text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Anggaran: Rp {chan.costEstimate.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Konversi: {chan.conversionRate}%
                      </span>
                    </div>

                    {channels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteChannel(chan.id)}
                        className="px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition cursor-pointer border border-transparent hover:border-slate-800"
                        title="Hapus Saluran"
                      >
                        ✕ Hapus
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 font-semibold leading-relaxed pt-1">
                    <strong className="text-white uppercase font-bold text-[10px]">• Rincian Taktis: </strong>
                    {chan.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Campaign summary calculation as clean text */}
            {(() => {
              const totalCost = channels.reduce((sum, c) => sum + c.costEstimate, 0);
              const averageConv = channels.reduce((sum, c) => sum + c.conversionRate, 0) / channels.length;
              const estimatedLeads = Math.round((totalCost / 5000000) * (averageConv / 100));

              return (
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-0.5">Total Anggaran Pemasaran</span>
                    <span className="text-base font-mono font-black text-sky-400">Rp {totalCost.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-0.5">Rata-Rata Rasio Konversi</span>
                    <span className="text-base font-mono font-black text-indigo-400">{averageConv.toFixed(1)}% Konversi B2B</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[9px] font-mono font-black text-slate-400 block uppercase mb-0.5">Estimasi Prospek Kualifikasi (Leads)</span>
                    <span className="text-base font-mono font-black text-emerald-400">+{estimatedLeads} Korporasi / Tahun</span>
                  </div>
                </div>
              );
            })()}

            {/* Form to add custom channel */}
            <div className="border-t border-slate-800/80 pt-4">
              <h5 className="text-[11px] font-black text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-sky-400" />
                Daftarkan Kampanye / Event Pemasaran B2B Baru
              </h5>
              <form onSubmit={handleAddChannel} className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Nama Event / Metode Kampanye"
                    value={newChanName}
                    onChange={(e) => setNewChanName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    value={newChanImpact}
                    onChange={(e: any) => setNewChanImpact(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold"
                  >
                    <option value="Sangat Tinggi">Dampak Sangat Tinggi</option>
                    <option value="Tinggi">Dampak Tinggi</option>
                    <option value="Sedang">Dampak Sedang</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    placeholder="Anggaran (Rp)"
                    value={newChanCost}
                    onChange={(e) => setNewChanCost(Number(e.target.value))}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold focus:border-sky-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    placeholder="Konversi (%)"
                    value={newChanConv}
                    onChange={(e) => setNewChanConv(Number(e.target.value))}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold focus:border-sky-500 outline-none"
                    min="1"
                    max="100"
                  />
                </div>
                <div className="md:col-span-12">
                  <input
                    type="text"
                    placeholder="Rincian taktis pelaksanaan kampanye..."
                    value={newChanDetails}
                    onChange={(e) => setNewChanDetails(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none mb-1"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-lg transition uppercase border-none cursor-pointer text-xs"
                  >
                    + Simpan Kampanye Pemasaran
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* PILLAR 3: REVENUE STABILITY & PRIORITIES */}
        {activeSegment === "stability" && (
          <motion.div
            key="stability-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6"
          >
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1.5">
                <Handshake className="h-4.5 w-4.5 text-sky-400" />
                Prioritas Bisnis, Penjamin Arus Kas & Nilai Kontrak
              </h4>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                Menjamin arus kas proyek logging hauling tidak mengalami fluktuasi tajam akibat kendala operasional lapangan, cuaca hujan, maupun gejolak harga bahan bakar.
              </p>
            </div>

            {/* Checklist items in clean readable format */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-black text-sky-400 uppercase tracking-wider block">
                ⚡ KLAUSUL PROTEKSI KONTRAK B2B (KLIK UNTUK AKTIFKAN):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {stabilityTactics.map((tactic) => (
                  <div
                    key={tactic.id}
                    onClick={() => toggleStabilityTactic(tactic.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      tactic.checked
                        ? "bg-emerald-950/20 border-emerald-800/60 text-emerald-200"
                        : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className={`mt-0.5 h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                      tactic.checked ? "bg-emerald-500 border-emerald-400 text-slate-900" : "border-slate-700"
                    }`}>
                      {tactic.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-[11.5px] font-black uppercase tracking-tight text-white">
                          {tactic.title}
                        </h5>
                        <span className={`text-[8.5px] font-mono font-black uppercase ${tactic.checked ? "text-emerald-400" : "text-slate-500"}`}>
                          {tactic.checked ? "• Aktif" : "• Non-Aktif"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
                        {tactic.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract CLV Simulator */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <span className="text-[10px] font-mono font-black text-sky-400 uppercase tracking-wider block">
                📊 KALKULATOR NILAI KONTRAK JANGKA PANJANG (B2B REVENUE CLV SIMULATOR)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Rata-rata Volume Hauling</span>
                    <span className="text-sky-400 font-black font-mono">{estVolumePerMonth.toLocaleString("id-ID")} Ton/Bln</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="30000"
                    step="1000"
                    value={estVolumePerMonth}
                    onChange={(e) => setEstVolumePerMonth(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Masa Tenor Kontrak</span>
                    <span className="text-indigo-400 font-black font-mono">{contractMonths} Bulan ({(contractMonths/12).toFixed(1)} Thn)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="6"
                    value={contractMonths}
                    onChange={(e) => setContractMonths(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Garansi Volume Minimal</span>
                    <span className="text-emerald-400 font-black font-mono">{guaranteeFactor}% Take-or-Pay</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={guaranteeFactor}
                    onChange={(e) => setGuaranteeFactor(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Display Result Summary as Clean Text */}
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="text-white uppercase">Proyeksi Total Nilai Kontrak: </strong>
                    <span className="text-base font-black text-sky-400 font-mono">Rp {totalContractVal.toLocaleString("id-ID")}</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ✓ Nilai Garansi Aman (Take-or-Pay): Rp {totalGuaranteedContractVal.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">
                  *Bruto Bulanan: Rp {monthlyGrossVal.toLocaleString("id-ID")} • Batas Minimum Terproteksi: Rp {guaranteedMonthlyVal.toLocaleString("id-ID")} / Bulan.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PILLAR 4: SALES TACTICS */}
        {activeSegment === "sales" && (
          <motion.div
            key="sales-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6 text-left space-y-6"
          >
            <div>
              <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1.5">
                <Briefcase className="h-4.5 w-4.5 text-sky-400" />
                Taktik Penjualan Tembus Pasar (B2B Sales Tactics Playbook)
              </h4>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                {gtmProfile.b2bSubtitle}
              </p>
            </div>

            {/* Clean Structured Text List of Sales Tactics */}
            <div className="space-y-4 border-l-2 border-sky-500/40 pl-4 py-1">
              {gtmProfile.tactics.map((tactic, idx) => {
                const effectLabels = [
                  "Efek: Kunci Loyalitas Pelanggan & Memperpanjang Kontrak",
                  "Efek: Meningkatkan Rasio Menang Tender +40%",
                  "Efek: Optimasi Ritase Rute & Menekan Empty Miles",
                  "Efek: Memangkas Waktu Tunggu Bongkar-Muat"
                ];
                return (
                  <div key={idx} className="relative space-y-1 pb-2">
                    {/* Dot marker */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-400 border-2 border-teal-500" />

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-teal-400 uppercase">
                        {tactic.code}:
                      </span>
                      <h5 className="text-[13px] font-black uppercase text-white tracking-tight">
                        {tactic.title}
                      </h5>
                      <span className="px-2 py-0.2 text-[8.5px] font-mono font-black rounded uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {tactic.tag}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {effectLabels[idx % effectLabels.length]}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed pt-0.5">
                      {tactic.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
