import React, { useState } from "react";
import { 
  Sparkles, 
  Award,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sliders,
  TrendingUp,
  ShieldAlert,
  ThumbsUp,
  SlidersHorizontal,
  Info
} from "lucide-react";

interface ExecutiveSummaryDashboardProps {
  projectTitle: string;
}

export function ExecutiveSummaryDashboard({ projectTitle }: ExecutiveSummaryDashboardProps) {
  const [decisionStatus, setDecisionStatus] = useState<"GO" | "HOLD" | "NOGO">("GO");

  // Dynamic Parameter Sliders State (0 - 100 or metric scale)
  const [financialScore, setFinancialScore] = useState<number>(88);
  const [operationalScore, setOperationalScore] = useState<number>(92);
  const [hseRiskScore, setHseRiskScore] = useState<number>(85);
  const [ltvCacRatioScore, setLtvCacRatioScore] = useState<number>(12.5);

  const titleLower = projectTitle.toLowerCase();
  
  // Dynamic metrics & context based on industry
  let industryName = "Logistik & Transportasi Umum";
  let marginEstimate = "EBITDA ~22%";

  if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("tambang") || titleLower.includes("batu bara")) {
    industryName = "Mineral & Heavy-Duty Hauling";
    marginEstimate = "EBITDA ~28%";
  } else if (titleLower.includes("waste") || titleLower.includes("limbah") || titleLower.includes("sampah") || titleLower.includes("b3")) {
    industryName = "Waste Management & B3 Transporter";
    marginEstimate = "EBITDA ~31%";
  } else if (titleLower.includes("dingin") || titleLower.includes("cold") || titleLower.includes("farmasi") || titleLower.includes("vaksin") || titleLower.includes("makanan")) {
    industryName = "Cold Chain Logistics (Suhu Dingin)";
    marginEstimate = "EBITDA ~35%";
  } else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("hutan") || titleLower.includes("wood") || titleLower.includes("logging")) {
    industryName = "Forestry & Logging Heavy Trucking";
    marginEstimate = "EBITDA ~24%";
  } else if (titleLower.includes("cpo") || titleLower.includes("sawit") || titleLower.includes("palm oil")) {
    industryName = "CPO & Palm Oil Bulk Tanker";
    marginEstimate = "EBITDA ~26%";
  }

  // Composite Feasibility Score Calculation
  const netFeasibilityIndex = Math.round(
    (financialScore * 0.35) + 
    (operationalScore * 0.30) + 
    (hseRiskScore * 0.20) + 
    (Math.min(ltvCacRatioScore * 5, 100) * 0.15)
  );

  return (
    <div id="executive-summary-dashboard" className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left shadow-sm space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm animate-pulse">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 font-mono">
              PANEL ANALISIS EKSEKUTIF PRAMA
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">
            14. Kesimpulan & Rekomendasi Keputusan
          </h2>
          <div className="mt-1.5 mb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md font-mono select-none">
              PROYEK AKTIF (SINKRON CHAT AI):
            </span>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-tight font-sans">
              {projectTitle}
            </span>
          </div>
          <p className="text-[11.5px] font-medium text-slate-500 leading-relaxed max-w-3xl mt-1">
            Visualisasi analisis komprehensif penentu kebijakan proyek logistik PRAMA.
          </p>
        </div>
        
        {/* QUICK METRICS */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div className="text-center px-1">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">KESIAPAN</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{netFeasibilityIndex}%</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="text-center px-1">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">EST. MARGIN</span>
            <span className="text-sm font-black text-indigo-600 font-mono">{marginEstimate}</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="text-center px-1">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">KATEGORI STRATEGIS</span>
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 mt-0.5 block">
              {industryName}
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DECISION BOARD & DIGITAL SEAL */}
      <div className="bg-slate-900 rounded-xl border border-slate-950 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4.5 w-4.5 text-amber-400" />
            <span className="text-[9.5px] font-black text-indigo-300 uppercase tracking-widest font-mono">
              SISTEM REKOMENDASI DIREKSI & DEWAN KOMISARIS
            </span>
          </div>
          <h3 className="text-base font-black tracking-tight text-white">
            Penentu Kebijakan Strategis Proyek
          </h3>
          <p className="text-[10px] text-slate-300 leading-normal max-w-xl mt-1">
            Simulasikan keputusan akhir direksi berlandaskan dokumen kajian ini. Pilih status kelayakan di sebelah kanan untuk menyematkan stempel elektronik resmi Prama System.
          </p>

          {/* Decision Buttons */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            {[
              { id: "GO" as const, label: "GO (PROYEK LAYAK / AMBIL)", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
              { id: "HOLD" as const, label: "HOLD (RE-EVALUASI)", color: "bg-amber-600 hover:bg-amber-700 text-white" },
              { id: "NOGO" as const, label: "NO-GO (BATALKAN / JANGAN AMBIL)", color: "bg-rose-600 hover:bg-rose-700 text-white" }
            ].map(btn => (
              <button
                id={`btn-decision-${btn.id}`}
                key={btn.id}
                onClick={() => setDecisionStatus(btn.id)}
                className={`px-3 py-2 rounded-lg text-[10px] font-black tracking-wider transition-all duration-200 cursor-pointer ${
                  decisionStatus === btn.id 
                    ? `${btn.color} ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105 shadow-md` 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* THE DIGITAL SEAL BADGE */}
        <div className="flex items-center justify-center shrink-0 w-full md:w-auto relative z-10 select-none">
          {decisionStatus === "GO" && (
            <div className="flex items-center gap-3 bg-emerald-950/80 border-2 border-emerald-500/40 p-4 rounded-xl shadow-lg text-left max-w-xs animate-fadeIn">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <span className="block text-[8px] font-black text-emerald-400 font-mono tracking-widest">STEMPEL KEPUTUSAN</span>
                <span className="block text-[13px] font-black text-emerald-300 uppercase leading-none mt-0.5">★ PROYEK GO</span>
                <span className="block text-[8.5px] font-bold text-emerald-400/80 mt-1 uppercase font-mono">DISETUJUI UNTUK DIEKSEKUSI</span>
              </div>
            </div>
          )}

          {decisionStatus === "HOLD" && (
            <div className="flex items-center gap-3 bg-amber-950/80 border-2 border-amber-500/40 p-4 rounded-xl shadow-lg text-left max-w-xs animate-fadeIn">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <span className="block text-[8px] font-black text-amber-400 font-mono tracking-widest">STEMPEL KEPUTUSAN</span>
                <span className="block text-[13px] font-black text-amber-300 uppercase leading-none mt-0.5">▲ RE-EVALUASI</span>
                <span className="block text-[8.5px] font-bold text-amber-400/80 mt-1 uppercase font-mono">DITAHAN UNTUK EVALUASI</span>
              </div>
            </div>
          )}

          {decisionStatus === "NOGO" && (
            <div className="flex items-center gap-3 bg-rose-950/80 border-2 border-rose-500/40 p-4 rounded-xl shadow-lg text-left max-w-xs animate-fadeIn">
              <div className="h-10 w-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <span className="block text-[8px] font-black text-rose-400 font-mono tracking-widest">STEMPEL KEPUTUSAN</span>
                <span className="block text-[13px] font-black text-rose-300 uppercase leading-none mt-0.5">✖ KEPUTUSAN BATAL (NO-GO)</span>
                <span className="block text-[8.5px] font-bold text-rose-400/80 mt-1 uppercase font-mono">DITOLAK OLEH KONTROL KESELAMATAN</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* SECTION: FAKTOR POSITIF (KELEBIHAN) VS FAKTOR NEGATIF (RISIKO & TANTANGAN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* POSITIVE FACTORS (FAKTOR POSITIF / DRIVER KELAYAKAN) */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5 text-left space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <ThumbsUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight">
                  Faktor Positif & Keunggulan Proyek
                </h4>
                <p className="text-[10px] font-medium text-emerald-700">
                  Pendorong utama keberhasilan dan pencapaian target profitabilitas
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
              4 FAKTOR PENDORONG
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: "Rasio Keuangan LTV/CAC Tinggi (> 10x)",
                desc: "Efisiensi akuisisi klien korporasi sangat kuat dengan arus kas berulang dari kontrak multitahun."
              },
              {
                title: "Kepatuhan K3 & Telemetri Real-Time 24/7",
                desc: "Sistem pengawasan kecelakaan (microsleep/fatigue) & geofencing meminimalisir insiden operasional."
              },
              {
                title: "Kontrak Jangka Panjang Bergaransi MToP",
                desc: "Kepastian volume angkut harian yang terkunci mengamankan arus kas dasar perusahaan."
              },
              {
                title: "Infrastruktur Armada Terintegrasi Digital",
                desc: "Penggunaan sensor muatan gandar & aplikasi driver menekan potensi kebocoran BBM dan demorage."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/90 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-extrabold text-slate-800 leading-snug">
                    {item.title}
                  </h5>
                  <p className="text-[10px] font-medium text-slate-600 leading-normal mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEGATIVE FACTORS (FAKTOR NEGATIF / RISIKO & MITIGASI) */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-5 text-left space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-600 text-white">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-tight">
                  Faktor Negatif & Risiko Potensial
                </h4>
                <p className="text-[10px] font-medium text-rose-700">
                  Tantangan eksternal & risiko operasional yang memerlukan proteksi khusus
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-md font-mono">
              4 FAKTOR RISIKO
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: "Fluktuasi Harga Bahan Bakar (BBM)",
                desc: "Risiko lonjakan Opex akibat variasi BBM. Mitigasi: Terapkan klausula fuel-escalation di kontrak."
              },
              {
                title: "Kondisi Cuaca Ekstrem & Kerusakan Jalur Hauling",
                desc: "Hujan deras menyebabkan alur pengangkutan licin. Mitigasi: Tim grader jalan siap siaga 24/7."
              },
              {
                title: "Volatilitas Biaya Suku Cadang & Ban Heavy-Duty",
                desc: "Keausan ban di medan berat tinggi. Mitigasi: Kemitraan pasokan ban langsung dari pabrikan."
              },
              {
                title: "Potensi Bottleneck Antrean Pembongkaran",
                desc: "Risiko keterlambatan siklus ritase. Mitigasi: Implementasi slot waktu digital (time-slot booking)."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/90 border border-rose-200 rounded-lg p-3 flex items-start gap-2.5 shadow-2xs">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-extrabold text-slate-800 leading-snug">
                    {item.title}
                  </h5>
                  <p className="text-[10px] font-medium text-slate-600 leading-normal mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION: NILAI PARAMETER KELAYAKAN PROYEK (PARAMETRIC SCORECARD & SLIDERS) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Matriks Parameter Nilai Kelayakan Proyek
              </h4>
              <p className="text-[10px] font-medium text-slate-500">
                Nilai pengukuran kuantitatif berdasarkan bobot kriteria penilaian direksi PRAMA
              </p>
            </div>
          </div>

          {/* NET SCORE DISPLAY BADGE */}
          <div className="flex items-center gap-3 bg-slate-900 text-white px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto border border-slate-800">
            <div className="text-right">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">SKOR KELAYAKAN</span>
              <span className="text-[11px] font-black text-emerald-400">
                {netFeasibilityIndex >= 80 ? "SANGAT LAYAK (EXCELLENT)" : netFeasibilityIndex >= 60 ? "CUKUP LAYAK (MODERAT)" : "KRITIS (RISIKO TINGGI)"}
              </span>
            </div>
            <div className="h-7 w-[1px] bg-slate-700"></div>
            <span className="text-lg font-black font-mono text-emerald-400">
              {netFeasibilityIndex}<span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>
        </div>

        {/* PARAMETER SLIDERS / CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* PARAMETER 1: Kelayakan Finansial */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                1. Margin & Finansial
              </span>
              <span className="text-xs font-black text-indigo-600 font-mono">
                {financialScore}/100
              </span>
            </div>
            
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${financialScore}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>Kontrol Slider:</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={financialScore} 
                onChange={(e) => setFinancialScore(Number(e.target.value))}
                className="w-24 accent-indigo-600 cursor-pointer"
              />
            </div>
            <p className="text-[9.5px] font-medium text-slate-500 leading-tight">
              EBITDA & ROI payback period diproyeksikan aman.
            </p>
          </div>

          {/* PARAMETER 2: Kesiapan Operasional */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                2. Kesiapan Operasional
              </span>
              <span className="text-xs font-black text-emerald-600 font-mono">
                {operationalScore}/100
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${operationalScore}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>Kontrol Slider:</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={operationalScore} 
                onChange={(e) => setOperationalScore(Number(e.target.value))}
                className="w-24 accent-emerald-600 cursor-pointer"
              />
            </div>
            <p className="text-[9.5px] font-medium text-slate-500 leading-tight">
              Armada & integrasi sensor telemetri {operationalScore}% siap.
            </p>
          </div>

          {/* PARAMETER 3: Manajemen Risiko & HSE */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                3. Mitigasi Risiko & HSE
              </span>
              <span className="text-xs font-black text-amber-600 font-mono">
                {hseRiskScore}/100
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${hseRiskScore}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>Kontrol Slider:</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={hseRiskScore} 
                onChange={(e) => setHseRiskScore(Number(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
            </div>
            <p className="text-[9.5px] font-medium text-slate-500 leading-tight">
              SOP K3 tambang & sistem anti-fatigue terkendali.
            </p>
          </div>

          {/* PARAMETER 4: Rasio LTV / CAC */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                4. Rasio LTV / CAC
              </span>
              <span className="text-xs font-black text-purple-600 font-mono">
                {ltvCacRatioScore.toFixed(1)}x
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min((ltvCacRatioScore / 20) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>Kontrol Slider:</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5"
                value={ltvCacRatioScore} 
                onChange={(e) => setLtvCacRatioScore(Number(e.target.value))}
                className="w-24 accent-purple-600 cursor-pointer"
              />
            </div>
            <p className="text-[9.5px] font-medium text-slate-500 leading-tight">
              Standard industri: &gt; 3.0x (Skor Anda: Sangat Menguntungkan).
            </p>
          </div>

        </div>

        {/* PARAMETER SCORECARD FOOTNOTE SUMMARY */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 flex items-center justify-between gap-3 text-[10px] text-indigo-900 font-medium">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Catatan Evaluasi:</strong> Seluruh parameter di atas dievaluasi secara kontinu via algoritma kecerdasan PRAMA Advisor untuk memastikan tingkat pengembalian modal di atas *Hurdle Rate* perusahaan (18% p.a.).
            </span>
          </div>
          <span className="font-mono text-[9px] font-bold text-indigo-700 uppercase shrink-0 bg-white border border-indigo-200 px-2 py-0.5 rounded">
            TERVERIFIKASI PRAMA
          </span>
        </div>

      </div>

    </div>
  );
}
