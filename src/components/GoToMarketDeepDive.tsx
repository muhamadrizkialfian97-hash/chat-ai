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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Target Audience List */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-sky-400" />
                  Pemetaan Target Audiens Strategis (B2B Segments)
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Penentuan segmen pasar bernilai tinggi yang diselaraskan dengan armada logistik hybrid satelit, verifikasi sertifikasi otomatis, dan keandalan operasional Pancaran Group untuk proyek <span className="text-sky-400 font-bold">{projectTitle || "Kajian Strategis"}</span>.
                </p>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {audiences.map((aud) => {
                    const isSelected = selectedAudienceId === aud.id;
                    return (
                      <div
                        key={aud.id}
                        onClick={() => setSelectedAudienceId(aud.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative flex justify-between items-start gap-3 ${
                          isSelected
                            ? "bg-slate-900 border-sky-500/50 shadow-md"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase ${
                              aud.tier === "Tier-1 Utama"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : aud.tier === "Tier-2 Sekunder"
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}>
                              {aud.tier}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold">•</span>
                            <span className="text-[9px] text-slate-400 font-bold">Resiliensi: {aud.stabilityWeight}</span>
                          </div>

                          <h5 className="text-[11.5px] font-black text-slate-200 uppercase tracking-tight">
                            {aud.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                            {aud.need}
                          </p>
                        </div>

                        <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                          <span className="text-[10px] font-black text-sky-400 font-mono">
                            {aud.matchIndex}% Match
                          </span>
                          {audiences.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAudience(aud.id, e)}
                              className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-rose-400 transition cursor-pointer border-none"
                              title="Hapus Segmen"
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

              {/* Form to add custom audience */}
              <div className="border-t border-slate-800/50 pt-4 mt-4">
                <h5 className="text-[10.5px] font-black text-slate-300 uppercase tracking-wider mb-2.5">
                  + Daftarkan Segmen Audiens Kustom Lapangan
                </h5>
                <form onSubmit={handleAddAudience} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nama Perusahaan / Kelompok Klien"
                    value={newAudName}
                    onChange={(e) => setNewAudName(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none"
                    required
                  />
                  <select
                    value={newAudTier}
                    onChange={(e: any) => setNewAudTier(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold"
                  >
                    <option value="Tier-1 Utama">Tier-1 Utama (MNC/Key Account)</option>
                    <option value="Tier-2 Sekunder">Tier-2 Sekunder (Pabrik Regional)</option>
                    <option value="Tier-3 Niche">Tier-3 Niche (Spesialis / Lokal)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Kebutuhan Logistik Spesifik..."
                    value={newAudNeed}
                    onChange={(e) => setNewAudNeed(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none md:col-span-2"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-lg transition uppercase md:col-span-2 border-none cursor-pointer"
                  >
                    Simpan & Analisis Segmen Baru
                  </button>
                </form>
              </div>
            </div>

            {/* Target Audience Detailed Card Display */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-sky-400 uppercase tracking-widest block mb-1">
                  BEDAH TARGET AUDIENS SEGMEN
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">
                  {selectedAudience?.name}
                </h4>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-black block mb-1">TINGKAT PRIORITAS</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase">{selectedAudience?.tier}</span>
                      <span className="px-2 py-0.5 text-[8.5px] font-black rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Match Index: {selectedAudience?.matchIndex}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-black block mb-1">KEBUTUHAN LOGISTIK KRITIS</span>
                    <p className="text-[10.5px] text-slate-200 font-semibold leading-relaxed">
                      {selectedAudience?.need}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-black block mb-1">TAKTIK PENETRASI GTM PANCARAN</span>
                    <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed">
                      Lobby langsung B2B dengan memperagakan visual dashboard logistik telemeter satelit hybrid kami secara langsung di hadapan dewan direksi klien untuk menjustifikasi keandalan waktu operasional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[9.5px] text-slate-500 font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-sky-400 shrink-0" />
                Sistem audit kelayakan segmen PRAMA GTM v2.0
              </div>
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Marketing Channels Campaign list */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Megaphone className="h-4 w-4 text-sky-400" />
                  Metode Komunikasi & Pemasaran B2B
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Menentukan bauran promosi dan metode keterlibatan eksekutif tingkat tinggi guna mengamankan reputasi Pancaran Group sebagai penyedia transportasi kehutanan utama.
                </p>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {channels.map((chan) => (
                    <div key={chan.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase ${
                            chan.impactLevel === "Sangat Tinggi"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            Dampak: {chan.impactLevel}
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold">•</span>
                          <span className="text-[9px] text-slate-400 font-bold">Konversi B2B: {chan.conversionRate}%</span>
                        </div>

                        <h5 className="text-[11.5px] font-black text-slate-100 uppercase tracking-tight">
                          {chan.channelName}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">
                          {chan.details}
                        </p>
                      </div>

                      <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                        <span className="text-[10.5px] font-black text-emerald-400 font-mono">
                          Rp {chan.costEstimate.toLocaleString("id-ID")}
                        </span>
                        {channels.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteChannel(chan.id)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-rose-400 transition cursor-pointer border-none"
                            title="Hapus Saluran"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to add custom channel */}
              <div className="border-t border-slate-800/50 pt-4 mt-3">
                <h5 className="text-[10.5px] font-black text-slate-300 uppercase tracking-wider mb-2.5">
                  + Daftarkan Kampanye / Event Pemasaran B2B Baru
                </h5>
                <form onSubmit={handleAddChannel} className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nama Event / Metode Kampanye"
                    value={newChanName}
                    onChange={(e) => setNewChanName(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none md:col-span-2"
                    required
                  />
                  <select
                    value={newChanImpact}
                    onChange={(e: any) => setNewChanImpact(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold"
                  >
                    <option value="Sangat Tinggi">Dampak Sangat Tinggi</option>
                    <option value="Tinggi">Dampak Tinggi</option>
                    <option value="Sedang">Dampak Sedang</option>
                  </select>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] font-bold text-slate-500">Rp</span>
                    <input
                      type="number"
                      placeholder="Estimasi Anggaran"
                      value={newChanCost}
                      onChange={(e) => setNewChanCost(Number(e.target.value))}
                      className="p-2 pl-7 w-full bg-slate-900 border border-slate-800 rounded-lg text-white font-bold focus:border-sky-500 outline-none"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Konversi (%)"
                    value={newChanConv}
                    onChange={(e) => setNewChanConv(Number(e.target.value))}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold focus:border-sky-500 outline-none"
                    min="1"
                    max="100"
                  />
                  <input
                    type="text"
                    placeholder="Rincian taktis pelaksanaan..."
                    value={newChanDetails}
                    onChange={(e) => setNewChanDetails(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-semibold focus:border-sky-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-lg transition uppercase md:col-span-3 border-none cursor-pointer"
                  >
                    Simpan Kampanye Pemasaran
                  </button>
                </form>
              </div>
            </div>

            {/* Campaign ROI Simulator Right panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-sky-400 uppercase tracking-widest block mb-1">
                  ANGGARAN & OUTCOME SIMULATOR
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">
                  Proyeksi ROI Pemasaran B2B
                </h4>

                {/* Live math of sum budget */}
                {(() => {
                  const totalCost = channels.reduce((sum, c) => sum + c.costEstimate, 0);
                  const averageConv = channels.reduce((sum, c) => sum + c.conversionRate, 0) / channels.length;
                  const estimatedLeads = Math.round((totalCost / 5000000) * (averageConv / 100)); // simple custom math

                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-black block mb-1">TOTAL ANGGARAN KAMPANYE</span>
                        <div className="text-lg font-black text-sky-400">
                          Rp {totalCost.toLocaleString("id-ID")}
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-black block mb-1">RATA-RATA RASIO KONVERSI</span>
                        <div className="text-lg font-black text-indigo-400">
                          {averageConv.toFixed(1)}% Konversi
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-black block mb-1">ESTIMASI DATA PROSPEK B2B AKTIF (QUALIFIED LEADS)</span>
                        <div className="text-lg font-black text-emerald-400">
                          +{estimatedLeads} Korporasi Raksasa / Tahun
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold mt-1">
                          Didominasi oleh korporat pemegang konsesi IUPHHK-HTI skala besar yang siap melakukan tender rute logistik baru.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-500 shrink-0" />
                Rasio konversi berdasarkan acuan konversi tender logistik kehutanan nasional.
              </div>
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Checklist of stability metrics */}
            <div className="lg:col-span-7 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Handshake className="h-4 w-4 text-sky-400" />
                  Prioritas Bisnis & Penjamin Stabilitas Pendapatan
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  Menjamin arus kas proyek logging hauling tidak mengalami fluktuasi tajam akibat kendala operasional lapangan, cuaca hujan, maupun gejolak eksternal harga minyak dunia.
                </p>

                {/* Checkbox Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {stabilityTactics.map((tactic) => (
                    <div
                      key={tactic.id}
                      onClick={() => toggleStabilityTactic(tactic.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left h-[105px] ${
                        tactic.checked
                          ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-300"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-[10.5px] font-black uppercase tracking-tight truncate max-w-[170px]">
                            {tactic.title}
                          </h5>
                          <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                            tactic.checked ? "bg-emerald-500 border-emerald-400 text-slate-900" : "border-slate-700"
                          }`}>
                            {tactic.checked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                          {tactic.description}
                        </p>
                      </div>

                      <span className={`text-[8px] font-black uppercase mt-1 ${tactic.checked ? "text-emerald-400" : "text-slate-500"}`}>
                        {tactic.checked ? "✓ Proteksi Aktif" : "✗ Belum Terpasang"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress and feedback on stability */}
              {(() => {
                const activeCount = stabilityTactics.filter(t => t.checked).length;
                const percent = Math.round((activeCount / stabilityTactics.length) * 100);

                return (
                  <div className="border-t border-slate-800/50 pt-4 mt-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1.5">
                      <span>TINGKAT STABILITAS ARUS KAS (PROJECT CASH FLOW PROTECTION)</span>
                      <span className="text-emerald-400">{percent}% TERJAMIN</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-500 font-semibold mt-2">
                      💡 Direkomendasikan mengaktifkan seluruh instrumen proteksi kontrak di atas guna menjamin margin bersih konsisten 25%+ selama masa tenor kemitraan.
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* B2B Contract LTV Interactive Calculator */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[8.5px] font-mono font-black text-sky-400 uppercase tracking-widest block mb-1">
                  B2B REVENUE CLV SIMULATOR
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">
                  Kalkulator Nilai Kontrak Jangka Panjang
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-slate-400 font-bold">Rata-rata Volume Hauling</span>
                      <span className="text-sky-400 font-black">{estVolumePerMonth.toLocaleString("id-ID")} Ton / Bulan</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="30000"
                      step="1000"
                      value={estVolumePerMonth}
                      onChange={(e) => setEstVolumePerMonth(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-slate-400 font-bold">Masa Tenor Kontrak Utama</span>
                      <span className="text-indigo-400 font-black">{contractMonths} Bulan ({(contractMonths/12).toFixed(1)} Tahun)</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="60"
                      step="6"
                      value={contractMonths}
                      onChange={(e) => setContractMonths(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Guarantee input */}
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-slate-400 font-bold">Klausul Garansi Volume Minimal</span>
                      <span className="text-emerald-400 font-black">{guaranteeFactor}% Take-or-Pay</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={guaranteeFactor}
                      onChange={(e) => setGuaranteeFactor(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Display Live Totals */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-semibold">Bruto Kontrak Bulanan:</span>
                      <span className="text-white font-bold">Rp {monthlyGrossVal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-semibold">Batas Garansi Minimum Bulanan:</span>
                      <span className="text-emerald-400 font-bold">Rp {guaranteedMonthlyVal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="h-px bg-slate-800 my-1" />
                    <div className="text-left">
                      <span className="text-[9px] text-slate-500 font-black block">PROYEKSI TOTAL NILAI KONTRAK (CONTRACT VALUE)</span>
                      <div className="text-base font-black text-sky-400">
                        Rp {totalContractVal.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-bold mt-0.5">
                        ✓ Nilai Garansi Aman (Take-or-Pay): Rp {totalGuaranteedContractVal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Sales Playbook display cards */}
            <div className="lg:col-span-12 bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-sky-400" />
                Taktik Penjualan Tembus Pasar (B2B Sales Tactics Playbook)
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold mb-4 leading-relaxed">
                {gtmProfile.b2bSubtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                {gtmProfile.tactics.map((tactic, idx) => {
                  const borderColors = ["bg-sky-500", "bg-indigo-500", "bg-teal-500", "bg-emerald-500"];
                  const textColors = ["text-sky-400", "text-indigo-400", "text-teal-400", "text-emerald-400"];
                  const effectLabels = [
                    "Efek: Kunci Loyalitas Pelanggan",
                    "Efek: Konversi Tender +40%",
                    "Efek: Optimasi Ritase Rute",
                    "Efek: Efisiensi Bongkar-Muat"
                  ];
                  return (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                      <div className={`absolute top-0 left-0 w-full h-1 ${borderColors[idx % borderColors.length]}`} />
                      <div>
                        <span className="text-[10px] font-mono font-black text-slate-500 block uppercase mb-1">
                          {tactic.code} • {tactic.tag}
                        </span>
                        <h5 className="text-[11.5px] font-black text-slate-200 uppercase tracking-tight">{tactic.title}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-2 leading-relaxed">
                          {tactic.description}
                        </p>
                      </div>
                      <span className={`text-[8.5px] font-black uppercase mt-4 ${textColors[idx % textColors.length]}`}>
                        {effectLabels[idx % effectLabels.length]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
