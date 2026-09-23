import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Trash2,
  Edit3,
  Copy,
  Check,
  Globe,
  TrendingUp,
  DollarSign,
  Layers,
  Users,
  Compass,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Target,
  PieChart,
  Repeat,
  Award,
  HeartHandshake,
  Briefcase,
  Scale,
  Truck,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  AlignLeft,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle,
  HelpCircle,
  Building2,
  RefreshCw,
  Sliders,
  SlidersHorizontal,
  Maximize2
} from "lucide-react";
import { generateAcademicMakalah } from "../utils/academicMakalahGenerator";
import { generatePillarsForProject, exportAllSectionsToWord, getProjectMetrics } from "../utils/projectDashboardHelper";

interface PillarVisualSummaryCardProps {
  pillarNumber: number;
  pillarTitle: string;
  pillarShortDesc?: string;
  projectTitle: string;
  activeDivision?: string;
  content: string;
  onUpdateContent: (newContent: string) => void;
  onClearContent: () => void;
  onClearAllPillars?: () => void;
  onSyncAllPillars?: () => void;
}

export function PillarVisualSummaryCard({
  pillarNumber,
  pillarTitle,
  pillarShortDesc,
  projectTitle,
  activeDivision,
  content,
  onUpdateContent,
  onClearContent,
  onClearAllPillars,
  onSyncAllPillars
}: PillarVisualSummaryCardProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"summary" | "detail" | "document">("summary");
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const currentDiv = activeDivision || "Logistik & Transportasi";
  const lowerTitle = currentTitle.toLowerCase();

  // Detect industry theme
  const industryTheme = useMemo(() => {
    if (lowerTitle.includes("susu") || lowerTitle.includes("dairy") || lowerTitle.includes("lembang") || lowerTitle.includes("milk") || lowerTitle.includes("kpsbu")) {
      return {
        name: "Rantai Dingin Susu Segar (Fresh Milk Cold Chain)",
        badge: "Industri Susu & Olahan",
        color: "from-sky-600 via-blue-700 to-indigo-800",
        accentBg: "bg-sky-50 text-sky-700 border-sky-200",
        borderGlow: "border-sky-300",
        icon: "milk",
        tempSpec: "2°C - 4°C Insulasi SUS 304",
        highlightTag: "Susu Segar & Cold Chain BPOM"
      };
    }
    if (lowerTitle.includes("listrik") || lowerTitle.includes("ev") || lowerTitle.includes("electric") || lowerTitle.includes("baterai") || lowerTitle.includes("charging") || lowerTitle.includes("spklu")) {
      return {
        name: "Transportasi Kendaraan Listrik (Commercial EV Logistics)",
        badge: "Green Logistics & EV",
        color: "from-emerald-600 via-teal-700 to-cyan-800",
        accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        borderGlow: "border-emerald-300",
        icon: "ev",
        tempSpec: "BMS Telematics & DC Fast Charging",
        highlightTag: "Zero Emission Perpres 55/2019"
      };
    }
    if (lowerTitle.includes("batubara") || lowerTitle.includes("coal") || lowerTitle.includes("tambang") || lowerTitle.includes("mineral") || lowerTitle.includes("nikel")) {
      return {
        name: "Hauling Tambang & Mineral Curah (Heavy Duty Hauling)",
        badge: "Mining & Heavy Hauling",
        color: "from-amber-700 via-orange-800 to-stone-900",
        accentBg: "bg-amber-50 text-amber-800 border-amber-200",
        borderGlow: "border-amber-300",
        icon: "mining",
        tempSpec: "Tipper 6x4 Stockpile to Jetty",
        highlightTag: "UU Minerba & Keselamatan K3"
      };
    }
    if (lowerTitle.includes("kontainer") || lowerTitle.includes("container") || lowerTitle.includes("depo") || lowerTitle.includes("inland") || lowerTitle.includes("shuttle") || lowerTitle.includes("cikarang")) {
      return {
        name: "Depo Petikemas & Inland Logistics Hub",
        badge: "Intermodal Container Hub",
        color: "from-indigo-600 via-blue-700 to-slate-900",
        accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        borderGlow: "border-indigo-300",
        icon: "container",
        tempSpec: "Prime Mover 20/40ft Flatbed",
        highlightTag: "Kepatuhan MST & ODOL Kemenhub"
      };
    }
    if (lowerTitle.includes("dingin") || lowerTitle.includes("cold") || lowerTitle.includes("farmasi") || lowerTitle.includes("vaksin") || lowerTitle.includes("reefer")) {
      return {
        name: "Cold Chain Logistics & Farmasi Higienis",
        badge: "Pharma & Cold Chain",
        color: "from-cyan-600 via-blue-700 to-indigo-900",
        accentBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
        borderGlow: "border-cyan-300",
        icon: "pharma",
        tempSpec: "ThermoKing Reefer Digital IoT",
        highlightTag: "Sertifikasi CDOB BPOM & Halal"
      };
    }
    if (lowerTitle.includes("maritim") || lowerTitle.includes("kapal") || lowerTitle.includes("tongkang") || lowerTitle.includes("barge") || lowerTitle.includes("pelayaran") || lowerTitle.includes("laut")) {
      return {
        name: "Pelayaran Maritim & Kargo Curah Laut (Marine Logistics)",
        badge: "Marine & Barge Shipping",
        color: "from-blue-700 via-sky-800 to-indigo-950",
        accentBg: "bg-blue-50 text-blue-700 border-blue-200",
        borderGlow: "border-blue-300",
        icon: "marine",
        tempSpec: "Tugboat & Barge 300ft Statutori BKI",
        highlightTag: "UU No. 17/2008 & Standar SOLAS"
      };
    }
    return {
      name: `Distribusi & Logistik Strategis ${currentTitle}`,
      badge: "Kajian Strategis Logistik",
      color: "from-violet-700 via-indigo-800 to-slate-900",
      accentBg: "bg-violet-50 text-violet-700 border-violet-200",
      borderGlow: "border-violet-300",
      icon: "general",
      tempSpec: "Armada Angkut Tepat Guna & SOP",
      highlightTag: "Kepatuhan Regulasi & Standar SLA"
    };
  }, [currentTitle, lowerTitle]);

  // Dynamic project metrics based on title
  const metrics = useMemo(() => getProjectMetrics(currentTitle), [currentTitle]);

  // Pillar metadata and icon mappings
  const pillarMeta = useMemo(() => {
    switch (pillarNumber) {
      case 1:
        return {
          icon: <Globe className="h-5 w-5 text-blue-400" />,
          category: "Analisis Makro & Regulasi",
          subtitle: `Tinjauan Makro Ekonomi, Kepatuhan Regulasi ${metrics.regulationsShort}, dan Koridor Armada`,
          metric1: { label: "Regulasi Kunci", value: metrics.regulationsShort },
          metric2: { label: "Kesiapan Armada", value: `${metrics.unitsCount} Unit Terdedikasi` },
          metric3: { label: "Skor Kelayakan", value: metrics.feasibilityScore }
        };
      case 2:
        return {
          icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
          category: "Peluang Pasar & Pertumbuhan",
          subtitle: `Identifikasi Kesenjangan Permintaan ${metrics.materialNameShort}, Pertumbuhan Industri, dan Nilai Tambah`,
          metric1: { label: "CAGR Sektoral", value: `+${metrics.cagrPercent}% / Tahun` },
          metric2: { label: "Penghematan Opex", value: metrics.fuelSavingPercent },
          metric3: { label: "Target Pangsa", value: metrics.marketShareTarget }
        };
      case 3:
        return {
          icon: <DollarSign className="h-5 w-5 text-amber-400" />,
          category: "Kelayakan Finansial",
          subtitle: `Alokasi Capex Unit (${metrics.capexFormatted}), Biaya Opex (${metrics.opexFormatted}/bln), Cash Flow, dan ROI`,
          metric1: { label: "Payback Period", value: metrics.pbpYears },
          metric2: { label: "Proyeksi ROI", value: metrics.roiPercent },
          metric3: { label: "Grand CAPEX", value: metrics.capexFormatted }
        };
      case 4:
        return {
          icon: <Layers className="h-5 w-5 text-cyan-400" />,
          category: "Suplai & Permintaan",
          subtitle: `Keseimbangan Kapasitas Muatan ${metrics.unitsText} terhadap Volume Riil`,
          metric1: { label: "Utilisasi Armada", value: metrics.utilizationRate },
          metric2: { label: "Ritase Bulanan", value: `${metrics.monthlyTrips} Trip / Bln` },
          metric3: { label: "Buffer Standby", value: `${metrics.bufferUnits} Unit Cadangan` }
        };
      case 5:
        return {
          icon: <Users className="h-5 w-5 text-indigo-400" />,
          category: "Organisasi & SOP",
          subtitle: `Struktur Tim Lapangan (${metrics.driverCount} Kru Bersertifikasi), Kualifikasi Driver, dan Standar K3`,
          metric1: { label: "Kru Tersertifikasi", value: `${metrics.driverCount} Personel` },
          metric2: { label: "Target SLA", value: `> ${metrics.slaTarget}` },
          metric3: { label: "Standar HSE", value: "Zero Accident ISO 45001" }
        };
      case 6:
        return {
          icon: <Compass className="h-5 w-5 text-rose-400" />,
          category: "Model Transisi",
          subtitle: "Roadmap Eksekusi Pre-Deployment, On-Boarding, hingga Stabilisasi Penuh",
          metric1: { label: "Fase Pre (M1-M2)", value: `${metrics.unitsCount} Unit & Legalitas` },
          metric2: { label: "Fase On (M3-M4)", value: "Pilot Run 50% Kapasitas" },
          metric3: { label: "Fase Post (M5+)", value: `CSAT ${metrics.csatTarget}` }
        };
      case 7:
        return {
          icon: <Zap className="h-5 w-5 text-amber-300" />,
          category: "Go-To-Market B2B",
          subtitle: `Strategi Penetrasi ke ${metrics.targetAccountsCount} Korporasi B2B, Diferensiasi Layanan, dan Kontrak LTSA`,
          metric1: { label: "Target Akun Tier-1", value: `${metrics.targetAccountsCount} Korporasi B2B` },
          metric2: { label: "Model Kontrak", value: "LTSA 3-5 Tahun" },
          metric3: { label: "Value Proposition", value: metrics.valueProposition }
        };
      case 8:
        return {
          icon: <Activity className="h-5 w-5 text-teal-400" />,
          category: "Model Operasional & SLA",
          subtitle: `Alur Proses Pemuatan ${metrics.materialNameShort}, Transit GPS 24/7, Pembongkaran, dan SLA ${metrics.slaTarget}`,
          metric1: { label: "SLA Ketepatan", value: metrics.slaTarget },
          metric2: { label: "Toleransi Deviasi", value: metrics.slaTolerance },
          metric3: { label: "Respon Darurat", value: "< 30 Menit" }
        };
      case 9:
        return {
          icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
          category: "Manajemen Risiko & K3",
          subtitle: `Identifikasi Titik Rawan Jalan, Integritas Kargo ${metrics.materialNameShort}, dan Kontingensi Darurat`,
          metric1: { label: "Proteksi Kargo", value: "Asuransi All-Risk 100%" },
          metric2: { label: "Eskalasi BBM", value: "Fuel Surcharge > 5%" },
          metric3: { label: "Zero ODOL", value: "100% Kepatuhan MST" }
        };
      case 10:
        return {
          icon: <Cpu className="h-5 w-5 text-blue-400" />,
          category: "Digitalisasi & IoT",
          subtitle: `Telematika PRAMA FMS Control Tower, Sensor IoT Muatan, e-POD, dan Hemat Admin ${metrics.adminSavingPercent}%`,
          metric1: { label: "Sistem Pelacakan", value: "PRAMA FMS + IoT" },
          metric2: { label: "Hemat Admin", value: `${metrics.adminSavingPercent}% via e-POD` },
          metric3: { label: "Hemat Energi", value: metrics.fuelSavingPercent }
        };
      case 11:
        return {
          icon: <Target className="h-5 w-5 text-violet-400" />,
          category: "Intelijen Kompetitor",
          subtitle: `Pemetaan Kelemahan ${metrics.competitorType} dan Target Rebut Pangsa ${metrics.competitorTakeoverRate}`,
          metric1: { label: "Kompetitor", value: metrics.competitorType },
          metric2: { label: "Target Rebut", value: metrics.competitorTakeoverRate },
          metric3: { label: "Keunggulan Kita", value: "Telematika & Jaminan SLA" }
        };
      case 12:
        return {
          icon: <PieChart className="h-5 w-5 text-orange-400" />,
          category: "Ukuran Pasar TAM SAM SOM",
          subtitle: `Kalkulasi TAM (${metrics.tamFormatted}), SAM (${metrics.samFormatted}), dan Target Riil SOM (${metrics.somFormatted})`,
          metric1: { label: "Total Pasar (TAM)", value: metrics.tamFormatted },
          metric2: { label: "Pasar Layanan (SAM)", value: `${metrics.samFormatted} (${metrics.samPct})` },
          metric3: { label: "Target Riil (SOM)", value: `${metrics.somFormatted} (${metrics.somPct})` }
        };
      case 13:
        return {
          icon: <Repeat className="h-5 w-5 text-pink-400" />,
          category: "Metrik CAC vs LTV",
          subtitle: `Efisiensi Akuisisi Klien B2B (${metrics.cacFormatted}) vs Nilai Kontrak LTV (${metrics.ltvFormatted})`,
          metric1: { label: "CAC Rata-rata", value: metrics.cacFormatted },
          metric2: { label: "LTV Kontrak 3 Thn", value: metrics.ltvFormatted },
          metric3: { label: "Rasio LTV / CAC", value: `${metrics.ratioValue}x (Sangat Efisien)` }
        };
      case 14:
        return {
          icon: <Award className="h-5 w-5 text-emerald-400" />,
          category: "Rekomendasi Keputusan",
          subtitle: `Rangkuman Eksekutif Kelayakan, Skor (${metrics.feasibilityScore}), dan Rekomendasi Eksekusi Armada`,
          metric1: { label: "Status Kelayakan", value: "SANGAT LAYAK (GO)" },
          metric2: { label: "Skor Komprehensif", value: metrics.feasibilityScore },
          metric3: { label: "Rekomendasi Utama", value: `Eksekusi ${metrics.unitsCount} Unit` }
        };
      case 15:
        return {
          icon: <HeartHandshake className="h-5 w-5 text-indigo-400" />,
          category: "Desain Layanan (Service Design)",
          subtitle: `Journey Klien Korporat, Service Blueprint, Touchpoints 24/7, dan Target CSAT ${metrics.csatTarget}`,
          metric1: { label: "Fleet Readiness", value: "≥ 98.0% Standby" },
          metric2: { label: "Target CSAT", value: `${metrics.csatTarget} (${metrics.csatScore})` },
          metric3: { label: "Touchpoint Klien", value: "Key Account Manager 24/7" }
        };
      case 16:
        return {
          icon: <Briefcase className="h-5 w-5 text-blue-400" />,
          category: "Profil Konsumen Potensial",
          subtitle: `Daftar ${metrics.targetAccountsCount} Target Akun B2B di Bidang ${metrics.industryCategory} & Estimasi Pipeline`,
          metric1: { label: "Akun Target Utama", value: `${metrics.targetAccountsCount} Korporasi B2B` },
          metric2: { label: "Potensi Pipeline", value: `Rp ${(metrics.monthlyRev * 12 * 1.5 / 1000000000).toFixed(1)} Miliar` },
          metric3: { label: "Term of Payment", value: "TOP 60-90 Hari Bergaransi" }
        };
      case 17:
      default:
        return {
          icon: <Scale className="h-5 w-5 text-amber-400" />,
          category: "Kepatuhan Hukum & Perizinan",
          subtitle: `Legalitas Usaha PT, Izin OSS-RBA, KBLI Transportasi, dan Standar ${metrics.regulationsShort}`,
          metric1: { label: "Legalitas Usaha", value: "PT Sah & NIB OSS-RBA" },
          metric2: { label: "Regulasi Kunci", value: metrics.regulationsShort },
          metric3: { label: "Kepatuhan K3", value: "100% Zero Accident & e-KIR" }
        };
    }
  }, [pillarNumber, metrics]);

  // Parse markdown into structured takeaways
  const parsedContent = useMemo(() => {
    if (!content || !content.trim()) return { summary: "", keyPoints: [], paragraphs: [], rawLines: [] };

    const rawLines = content.split("\n");
    const paragraphs: string[] = [];
    const keyPoints: string[] = [];

    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("###")) return;

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        keyPoints.push(trimmed.replace(/^[\*\-]\s+/, ""));
      } else {
        paragraphs.push(trimmed);
      }
    });

    let summary = "";
    if (paragraphs.length > 0) {
      summary = paragraphs[0].replace(/\*\*/g, "");
    } else if (keyPoints.length > 0) {
      summary = keyPoints[0].replace(/\*\*/g, "");
    } else {
      summary = `Kajian terpadu untuk ${pillarTitle} pada proyek ${currentTitle}. Analisis mendalam mencakup operasional terencana, efisiensi sumber daya, dan mitigasi kepatuhan.`;
    }

    return {
      summary,
      keyPoints,
      paragraphs,
      rawLines
    };
  }, [content, pillarTitle, currentTitle]);

  // Handler to copy content
  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handler to generate tailored content for this pillar based on project title
  const handleGenerateThisPillar = () => {
    setIsGenerating(true);
    // Kosongkan dulu teks lama agar pengguna melihat proses pergantian naskah secara bersih
    onUpdateContent("");

    setTimeout(() => {
      try {
        const pillars = generatePillarsForProject(currentTitle);
        const targetContent = pillars[pillarNumber];
        if (targetContent && targetContent.trim().length > 0) {
          onUpdateContent(targetContent);
        } else {
          const academic = generateAcademicMakalah(currentTitle, pillarNumber, pillarTitle, currentDiv);
          if (academic && academic.markdownContent) {
            onUpdateContent(academic.markdownContent);
          } else {
            const text = `### ${pillarNumber}. ${pillarTitle}\n\nKajian strategis komprehensif untuk ${pillarTitle} pada proyek **${currentTitle}**. Analisis mendalam mencakup operasional terencana, efisiensi sumber daya, kepatuhan regulasi, dan mitigasi risiko.`;
            onUpdateContent(text);
          }
        }
      } catch (e) {
        const pillars = generatePillarsForProject(currentTitle);
        const text = pillars[pillarNumber] || `### ${pillarNumber}. ${pillarTitle}\n\nKajian strategis ${pillarTitle} untuk proyek ${currentTitle}.`;
        onUpdateContent(text);
      } finally {
        setIsGenerating(false);
      }
    }, 600);
  };

  const isBlank = !content || !content.trim() || content.trim() === `### ${pillarNumber}. ${pillarTitle}` || content.trim() === `${pillarTitle}`;

  // Helper for bold text
  const renderBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. THEMATIC VISUAL BANNER CARD (MENARIK & TIDAK KAKU) */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${industryTheme.color} p-6 md:p-8 text-white shadow-xl border border-white/10`}>
        {/* Background Visual Ornament Elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
        
        {/* Decorative Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white border border-white/20 font-mono">
                PILAR #{pillarNumber} • {pillarMeta.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 backdrop-blur-md text-[10px] font-bold text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                <span>{industryTheme.badge}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[9.5px] font-mono font-bold">
                {industryTheme.tempSpec}
              </span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-display flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  {pillarMeta.icon}
                </div>
                <span>{pillarTitle}</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-100 font-normal leading-relaxed mt-1.5 opacity-95">
                {pillarShortDesc || pillarMeta.subtitle} untuk proyek{" "}
                <strong className="text-amber-200 font-bold">"{currentTitle}"</strong>.
              </p>
            </div>
          </div>

          {/* Right Action Quick Controls */}
          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem("prama_dashboard_sections");
                  const map = saved ? JSON.parse(saved) : {};
                  map[pillarNumber] = content;
                  exportAllSectionsToWord(currentTitle, map);
                } catch(e) {
                  exportAllSectionsToWord(currentTitle, { [pillarNumber]: content });
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 text-xs font-black rounded-xl transition shadow-lg cursor-pointer border-none"
              title="Unduh seluruh laporan komprehensif ke format Word (.doc)"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateThisPillar}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-black rounded-xl transition shadow-lg cursor-pointer border-none"
              title="Buat isian otomatis yang 100% selaras dengan judul proyek"
            >
              <Sparkles className={`h-3.5 w-3.5 text-indigo-600 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Menyusun Teks..." : "Buat Kata Sesuai Judul"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-rose-500/80 hover:text-white text-rose-200 active:scale-95 text-xs font-bold rounded-xl transition border border-white/15 cursor-pointer backdrop-blur-xs"
              title="Hapus semua teks pilar ini dan biarkan polos"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Semua (Kosongkan)</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills on Banner */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-200 block">
                {pillarMeta.metric1.label}
              </span>
              <span className="text-xs font-black text-white mt-0.5 block truncate">
                {pillarMeta.metric1.value}
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-200 block">
                {pillarMeta.metric2.label}
              </span>
              <span className="text-xs font-black text-white mt-0.5 block truncate">
                {pillarMeta.metric2.value}
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-400" />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-200 block">
                {pillarMeta.metric3.label}
              </span>
              <span className="text-xs font-black text-white mt-0.5 block truncate">
                {pillarMeta.metric3.value}
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear Content */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Konfirmasi Hapus Semua</h4>
                <p className="text-xs text-slate-500">Pilih lingkup data yang ingin Anda kosongkan:</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClearContent();
                  setShowClearConfirm(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold transition cursor-pointer"
              >
                <span>Hapus Teks Pilar #{pillarNumber} Saja (Buat Polos)</span>
                <Trash2 className="h-4 w-4 text-rose-600" />
              </button>

              {onClearAllPillars && (
                <button
                  type="button"
                  onClick={() => {
                    onClearAllPillars();
                    setShowClearConfirm(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold transition cursor-pointer"
                >
                  <span>Kosongkan Semua 17 Pilar Strategis</span>
                  <Trash2 className="h-4 w-4 text-slate-700" />
                </button>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PENJELASAN SINGKAT & INTI UTAMA (MUDAH DIMENGERTI) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black tracking-widest text-indigo-600 uppercase block">
                INTI KAJIAN STRATEGIS
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Penjelasan Singkat & Poin Kunci
              </h3>
            </div>
          </div>

          {/* Tab Switcher: Inti Pokok vs Kotak Rincian vs Dokumen Narasi */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto select-none">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "summary"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
              title="Tampilan Inti Pokok yang ringkas, visual, dan mudah dipahami"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Inti Pokok (Ringkas)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("detail")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "detail"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
              title="Tampilan Kotak Rincian terstruktur per komponen"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kotak Rincian</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("document")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "document"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
              title="Tampilan Dokumen Narasi komprehensif"
            >
              <AlignLeft className="h-3.5 w-3.5" />
              <span>Dokumen Narasi</span>
            </button>
          </div>
        </div>

        {/* Generating / Loading State */}
        {isGenerating ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center gap-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-pulse">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shadow-xs">
              <RefreshCw className="h-7 w-7 animate-spin text-indigo-600" />
            </div>
            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10.5px] font-mono font-bold uppercase tracking-wider">
                <span>🔄 Meregenerasi Naskah Baru Sesuai Judul</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Menyusun Ulang Analisis Pilar #{pillarNumber}: {pillarTitle}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menghapus narasi lama dan menyelaraskan seluruh parameter kajian strategis dengan judul baru <strong className="text-indigo-700">"{currentTitle}"</strong>...
              </p>
            </div>
          </div>
        ) : isBlank ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Isian Pilar #{pillarNumber} Masih Kosong
            </h4>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Klik tombol di bawah untuk membuat kata-kata dan narasi analisis yang 100% selaras dengan judul proyek <strong className="text-slate-800">"{currentTitle}"</strong>.
            </p>
            <button
              type="button"
              onClick={handleGenerateThisPillar}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer border-none mt-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
              <span>Buat Isian Sesuai Judul Proyek</span>
            </button>
          </div>
        ) : activeTab === "summary" ? (
          /* SUMMARY MODE: CONCISE & INTUITIVE */
          <div className="space-y-4">
            {/* Highlight Executive Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100/80 shadow-xs flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-700 block">
                  KESIMPULAN INTI EKSEKUTIF:
                </span>
                <p className="text-xs md:text-sm text-slate-800 font-medium leading-relaxed">
                  {parsedContent.summary}
                </p>
              </div>
            </div>

            {/* Structured Takeaways Chips */}
            {parsedContent.keyPoints.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 block">
                  POIN-POIN KUNCI YANG HARUS DIKETAHUI:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {parsedContent.keyPoints.slice(0, 6).map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1 leading-snug font-normal">
                        {renderBold(point)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Switch Prompt */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">
                Menampilkan ringkasan inti. Ingin membaca penjabaran lengkap?
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("detail")}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Rincian Detail</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        ) : activeTab === "detail" ? (
          /* DETAIL MODE: PENJABARAN LENGKAP DENGAN KOTAK RAPI */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">
                Rincian Bab & Penjabaran Lengkap ({parsedContent.paragraphs.length} Paragraf & {parsedContent.keyPoints.length} Poin)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 cursor-pointer font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Tersalin" : "Salin Teks"}</span>
              </button>
            </div>

            <div className="space-y-3">
              {parsedContent.paragraphs.map((p, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed text-justify space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400 mb-1">
                    <span>BAGIAN {pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newParas = parsedContent.paragraphs.filter((_, idx) => idx !== pIdx);
                        onUpdateContent(newParas.join("\n\n"));
                      }}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Hapus paragraf ini"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="m-0 font-normal">{renderBold(p)}</p>
                </div>
              ))}

              {parsedContent.keyPoints.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                  <span className="text-[10px] font-mono font-black uppercase text-indigo-700 block">
                    DAFTAR RINCIAN POIN STRATEGIS:
                  </span>
                  <div className="space-y-1.5">
                    {parsedContent.keyPoints.map((kp, kpIdx) => (
                      <div key={kpIdx} className="flex items-start gap-2 text-xs text-slate-800">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span className="flex-1 font-normal">{renderBold(kp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* DOCUMENT MODE: STREAMING NARRATIVE */
          <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-3">
            {parsedContent.rawLines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-2" />;
              if (trimmed.startsWith("###")) {
                return (
                  <h4 key={lIdx} className="text-sm font-black text-indigo-900 uppercase tracking-wide border-b border-indigo-100 pb-1 mt-4 mb-2">
                    {trimmed.replace(/^###\s*/, "")}
                  </h4>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-xs text-slate-700 pl-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{renderBold(trimmed.replace(/^[\*\-]\s*/, ""))}</span>
                  </div>
                );
              }
              return (
                <p key={lIdx} className="text-xs text-slate-700 text-justify leading-relaxed m-0 font-normal">
                  {renderBold(trimmed)}
                </p>
              );
            })}
          </div>
        )}

        {/* Bottom Toolbar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-600">
              Kajian Pilar #{pillarNumber} tersinkron dengan judul <strong className="text-slate-900 font-bold">"{currentTitle}"</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSyncAllPillars && (
              <button
                type="button"
                onClick={onSyncAllPillars}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer border border-indigo-200"
                title="Sinkronkan semua 17 pilar sekaligus sesuai judul proyek"
              >
                Sinkronkan Semua 17 Pilar
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerateThisPillar}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200"
              title="Buat ulang kata-kata sesuai judul"
            >
              Buat Ulang Pilar Ini
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer border border-rose-200"
              title="Kosongkan teks pilar ini"
            >
              Kosongkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
