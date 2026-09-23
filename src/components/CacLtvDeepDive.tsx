import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingDown,
  DollarSign,
  Scale,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  Calculator,
  Sparkles,
  Info,
  Edit3,
  Copy,
  Check,
  LayoutGrid,
  AlignLeft,
  X,
  Save,
  AlertCircle,
  SlidersHorizontal,
  Zap
} from "lucide-react";
import { getSectorCacLtvProfile } from "../utils/sectorOpportunityHelper";
import { exportAllSectionsToWord } from "../utils/projectDashboardHelper";

interface CacLtvProps {
  projectTitle: string;
}

export interface CostComponent {
  id: string;
  name: string;
  category: "Komersial" | "Teknis Operasional" | "Legalitas & K3";
  costIDR: number;
}

interface SavedCacLtvState {
  title: string;
  cacCosts: CostComponent[];
  avgRevenuePerMonth: number;
  netProfitMargin: number;
  contractDurationMonths: number;
  customNarrative?: string;
}

export function CacLtvDeepDive({ projectTitle }: CacLtvProps) {
  const currentTitle = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const storageKey = `prama_cac_ltv_state_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  // Check if content exists in localStorage
  const [savedData, setSavedData] = useState<SavedCacLtvState | null>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  });

  const isBlank = !savedData || !savedData.cacCosts || savedData.cacCosts.length === 0;

  const [displayMode, setDisplayMode] = useState<"core" | "cards" | "document">("core");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAddCostOpen, setIsAddCostOpen] = useState<boolean>(false);

  // Financial Variables State
  const [cacCosts, setCacCosts] = useState<CostComponent[]>(savedData?.cacCosts || []);
  const [avgRevenuePerMonth, setAvgRevenuePerMonth] = useState<number>(savedData?.avgRevenuePerMonth || 65000000);
  const [netProfitMargin, setNetProfitMargin] = useState<number>(savedData?.netProfitMargin || 15);
  const [contractDurationMonths, setContractDurationMonths] = useState<number>(savedData?.contractDurationMonths || 36);
  const [customNarrative, setCustomNarrative] = useState<string>(savedData?.customNarrative || "");
  const [editNarrative, setEditNarrative] = useState<string>("");

  // Track the title for which the current data was generated
  const [lastGeneratedForTitle, setLastGeneratedForTitle] = useState<string>(() => {
    return localStorage.getItem(`${storageKey}_title`) || savedData?.title || "";
  });

  // Form input for custom CAC cost
  const [newCostName, setNewCostName] = useState("");
  const [newCostCategory, setNewCostCategory] = useState<"Komersial" | "Teknis Operasional" | "Legalitas & K3">("Teknis Operasional");
  const [newCostVal, setNewCostVal] = useState<number>(5000000);

  // Sync state when projectTitle prop changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: SavedCacLtvState = JSON.parse(raw);
        setSavedData(parsed);
        setCacCosts(parsed.cacCosts || []);
        setAvgRevenuePerMonth(parsed.avgRevenuePerMonth || 65000000);
        setNetProfitMargin(parsed.netProfitMargin || 15);
        setContractDurationMonths(parsed.contractDurationMonths || 36);
        setCustomNarrative(parsed.customNarrative || "");
        setEditNarrative(parsed.customNarrative || "");
      } else {
        // Start completely POLOS for new title unless explicitly generated
        setSavedData(null);
        setCacCosts([]);
        setCustomNarrative("");
        setEditNarrative("");
      }
    } catch (e) {
      setSavedData(null);
      setCacCosts([]);
    }
    setIsEditing(false);
  }, [storageKey]);

  // Persist changes to localStorage whenever data changes (if not blank)
  const persistState = (
    costs: CostComponent[],
    rev: number,
    margin: number,
    duration: number,
    narrative?: string
  ) => {
    const payload: SavedCacLtvState = {
      title: currentTitle,
      cacCosts: costs,
      avgRevenuePerMonth: rev,
      netProfitMargin: margin,
      contractDurationMonths: duration,
      customNarrative: narrative !== undefined ? narrative : customNarrative
    };
    setSavedData(payload);
    localStorage.setItem(storageKey, JSON.stringify(payload));
    localStorage.setItem(`${storageKey}_title`, currentTitle);
    setLastGeneratedForTitle(currentTitle);
  };

  // GENERATOR: Generate 100% Title-Tailored Financials & Answers
  const handleGenerateContent = (targetTitle: string = currentTitle) => {
    setIsLoading(true);
    setIsEditing(false);

    try {
      const profile = getSectorCacLtvProfile(targetTitle);
      const newCosts = profile.cacCosts;
      const newRev = profile.defaultAvgRevenuePerMonth;
      const newMargin = profile.defaultMargin || 15;
      const newDuration = profile.defaultDuration || 36;

      // Calculate totals for generated narrative
      const totalCac = newCosts.reduce((acc, curr) => acc + curr.costIDR, 0);
      const totalLtv = newRev * newDuration * (newMargin / 100);
      const ratio = totalCac > 0 ? totalLtv / totalCac : 0;
      const payback = totalCac > 0 ? Math.ceil(totalCac / (newRev * (newMargin / 100))) : 1;

      // Generate structured narrative markdown for Document view
      const narrative = `# KAJIAN FINANSIAL & UNIT ECONOMICS: CAC & LTV
**Proyek:** ${targetTitle}
**Rasio Keuangan Utama:** ${ratio.toFixed(1)}x LTV/CAC (${ratio >= 3.0 ? "SEHAT" : "PERLU OPTIMASI"})

---

## 1. STRUKTUR BIAYA AKUISISI PELANGGAN (CUSTOMER ACQUISITION COST - CAC)
Total estimasi biaya akuisisi untuk mengamankan 1 kontrak jangka panjang pada proyek **"${targetTitle}"** adalah **Rp ${totalCac.toLocaleString("id-ID")}**. Rincian komponen biaya mencakup:
${newCosts.map((c, i) => `- **${c.name}** (${c.category}): Rp ${c.costIDR.toLocaleString("id-ID")}`).join("\n")}

**Strategi Amortisasi CAC:**
Biaya akuisisi ini diproyeksikan tertutupi (*payback period*) dalam **${payback} bulan pertama** operasional melalui arus kas margin bersih kontrak komersial.

---

## 2. PROYEKSI NILAI SEUMUR HIDUP KONTRAK (CUSTOMER LIFETIME VALUE - LTV)
- **Pendapatan Bruto / Bulan:** Rp ${newRev.toLocaleString("id-ID")}
- **Margin Laba Bersih (Net Profit):** ${newMargin}%
- **Durasi Kontrak Terikat:** ${newDuration} Bulan (${(newDuration / 12).toFixed(1)} Tahun)
- **Total Akumulasi LTV Bersih:** Rp ${totalLtv.toLocaleString("id-ID")}

**Karakteristik Finansial Sektor:**
${profile.ltvNote} ${profile.sectorNote}

---

## 3. EVALUASI RASIO LTV/CAC & KELAYAKAN INVESTASI
Dengan rasio **${ratio.toFixed(1)}x**, investasi komersial pada proyek ini berada pada status **${ratio >= 5.0 ? "Sangat Sehat (Superb ROI)" : ratio >= 3.0 ? "Sehat (Standard Industry Tier-1)" : "Moderat"}**.

**Rekomendasi Eksekutif:**
1. **Retensi Akun Klien:** Pertahankan kepatuhan SLA armada agar klien memperpanjang kontrak pada akhir periode tenor.
2. **Efisiensi Rute Balikan (Backhaul):** Maksimalkan utilisasi ritase untuk mendongkrak margin bersih tanpa menaikkan biaya promosi/CAC.
3. **Pengendalian Capex Awal:** Prioritaskan sewa guna usaha (leasing) unit armada untuk menjaga likuiditas kas operasional.`;

      setCacCosts(newCosts);
      setAvgRevenuePerMonth(newRev);
      setNetProfitMargin(newMargin);
      setContractDurationMonths(newDuration);
      setCustomNarrative(narrative);
      setEditNarrative(narrative);

      persistState(newCosts, newRev, newMargin, newDuration, narrative);
    } catch (err) {
      console.error("Error generating CAC/LTV profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // CLEAR ALL: Wipe everything and make it completely POLOS (Blank)
  const handleClearAll = () => {
    setCacCosts([]);
    setCustomNarrative("");
    setEditNarrative("");
    setSavedData(null);
    setIsEditing(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_title`);
  };

  // Add custom cost item
  const handleAddCacCost = () => {
    if (!newCostName.trim()) return;
    const item: CostComponent = {
      id: "cac-custom-" + Date.now(),
      name: newCostName.trim(),
      category: newCostCategory,
      costIDR: newCostVal
    };
    const updated = [...cacCosts, item];
    setCacCosts(updated);
    persistState(updated, avgRevenuePerMonth, netProfitMargin, contractDurationMonths);
    setNewCostName("");
  };

  // Remove individual cost item
  const handleRemoveCacCost = (id: string) => {
    const updated = cacCosts.filter((item) => item.id !== id);
    setCacCosts(updated);
    persistState(updated, avgRevenuePerMonth, netProfitMargin, contractDurationMonths);
  };

  // Copy narrative to clipboard
  const handleCopy = () => {
    const textToCopy =
      customNarrative ||
      `Kajian Finansial CAC & LTV - ${currentTitle}\nTotal CAC: Rp ${totalCacIDR.toLocaleString("id-ID")}\nTotal LTV: Rp ${totalLtvIDR.toLocaleString("id-ID")}\nRasio: ${ltvCacRatio.toFixed(1)}x`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save manual edit text
  const handleSaveEdit = () => {
    setCustomNarrative(editNarrative);
    persistState(cacCosts, avgRevenuePerMonth, netProfitMargin, contractDurationMonths, editNarrative);
    setIsEditing(false);
  };

  // CALCULATIONS
  const totalCacIDR = useMemo(() => {
    return cacCosts.reduce((acc, curr) => acc + curr.costIDR, 0);
  }, [cacCosts]);

  const totalLtvIDR = useMemo(() => {
    return avgRevenuePerMonth * contractDurationMonths * (netProfitMargin / 100);
  }, [avgRevenuePerMonth, contractDurationMonths, netProfitMargin]);

  const grossTurnoverIDR = useMemo(() => {
    return avgRevenuePerMonth * contractDurationMonths;
  }, [avgRevenuePerMonth, contractDurationMonths]);

  const ltvCacRatio = totalCacIDR > 0 ? totalLtvIDR / totalCacIDR : 0;
  const paybackMonths = totalCacIDR > 0 ? Math.ceil(totalCacIDR / (avgRevenuePerMonth * (netProfitMargin / 100))) : 1;

  // Sector Profile for notes
  const sectorProfile = useMemo(() => {
    return getSectorCacLtvProfile(currentTitle);
  }, [currentTitle]);

  // Helper to format bold markdown
  const formatTextWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="text-white font-bold tracking-wide">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Diagnosis
  let ratioHealth: "Sangat Sehat" | "Sehat" | "Kurang Efisien" | "Kritis" = "Kurang Efisien";
  let healthColor = "text-amber-400 border-amber-500/25 bg-amber-500/10";
  let strategyText = "Meskipun LTV positif, biaya akuisisi Anda cukup tinggi. Pertimbangkan pemangkasan biaya trial run yang berlebih atau negosiasikan tenor kontrak yang lebih panjang.";

  if (ltvCacRatio >= 5.0) {
    ratioHealth = "Sangat Sehat";
    healthColor = "text-emerald-400 border-emerald-500/25 bg-emerald-500/10";
    strategyText = "Rasio luar biasa (>= 5.0x)! Kontrak multi-tahun yang stabil dengan efisiensi penyiapan unit awal menjamin margin profitabilitas jangka panjang yang berkelanjutan.";
  } else if (ltvCacRatio >= 3.0) {
    ratioHealth = "Sehat";
    healthColor = "text-blue-400 border-blue-500/25 bg-blue-500/10";
    strategyText = "Rasio memenuhi standar acuan industri logistik (>= 3.0x). Strategi ekspansi volume angkut dan penghematan biaya bahan bakar akan terus memperkuat posisi ini.";
  } else if (ltvCacRatio < 1.5) {
    ratioHealth = "Kritis";
    healthColor = "text-rose-400 border-rose-500/25 bg-rose-500/10";
    strategyText = "Sangat Berbahaya! Biaya akuisisi (CAC) mendekati atau melebihi keuntungan seumur hidup kontrak (LTV). Segera evaluasi ulang tarif jasa angkut atau pangkas biaya pra-operasional!";
  }

  const isTitleDifferent =
    !isBlank &&
    lastGeneratedForTitle &&
    lastGeneratedForTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div
      id="cac-ltv-deepdive-root"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 text-slate-100 shadow-xl mt-2 font-sans relative overflow-hidden"
    >
      {/* Header Panel */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Left Badge Info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono flex items-center gap-1.5">
              <Scale className="h-3 w-3 text-rose-400" />
              PILAR 13 • CAC & LTV FINANCIAL MODEL ANALYZER
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              Proyek: <strong className="text-slate-200">{currentTitle}</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                isBlank
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isBlank ? "Status: Polos" : `Status: Terstruktur Rapih (${cacCosts.length} Biaya)`}
            </span>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isBlank && !isEditing && (
              <>
                {/* 3-Way Segmented View Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => setDisplayMode("core")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "core"
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
                    onClick={() => setDisplayMode("cards")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "cards"
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
                    onClick={() => setDisplayMode("document")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      displayMode === "document"
                        ? "bg-cyan-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Tampilan Dokumen Narasi komprehensif"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                    <span>Dokumen Narasi</span>
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem("prama_dashboard_sections");
                  const map = saved ? JSON.parse(saved) : {};
                  const docText = customNarrative || `### 13. CAC & LTV Financial Model Analyzer\n\n- **CAC Total:** Rp ${cacCosts.reduce((acc, c) => acc + c.costIDR, 0).toLocaleString()}\n- **LTV Total:** Rp ${(avgRevenuePerMonth * netProfitMargin / 100 * contractDurationMonths).toLocaleString()}\n- **Rasio LTV/CAC:** ${( (avgRevenuePerMonth * netProfitMargin / 100 * contractDurationMonths) / (cacCosts.reduce((acc, c) => acc + c.costIDR, 0) || 1) ).toFixed(2)}x`;
                  map[13] = docText;
                  exportAllSectionsToWord(currentTitle, map);
                } catch(e) {
                  exportAllSectionsToWord(currentTitle, { 13: customNarrative || "Analisis Finansial CAC LTV" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              title="Unduh seluruh laporan komprehensif ke format Word (.doc)"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateContent(currentTitle)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Buat isian finansial baru yang sesuai dengan judul proyek"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-rose-200" : ""}`} />
              <span>{isLoading ? "Menghitung Finansial..." : isBlank ? "Buat Isian Sesuai Judul" : "Buat Ulang Sesuai Judul"}</span>
            </button>
          </div>
        </div>

        {/* Main Title Heading */}
        <div className="mt-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Financial Model Analyzer (CAC & LTV Analysis)
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
              Kajian biaya akuisisi pelanggan (CAC), proyeksi keuntungan seumur hidup kontrak (LTV), serta rasio kelayakan finansial terukur untuk{" "}
              <span className="text-rose-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Alert if Active Project Title Has Changed */}
      {isTitleDifferent && (
        <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
            <span>
              Judul proyek aktif berubah menjadi: <strong className="text-white">"{currentTitle}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerateContent(currentTitle)}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sinkronkan Isian untuk Judul Ini</span>
          </button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-inner relative min-h-[240px]">
        {isLoading ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-full border-2 border-rose-500/20 border-t-rose-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-rose-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Menghitung Model Finansial Sesuai Judul...
            </p>
            <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed">
              Menyesuaikan struktur biaya akuisisi, estimasi pendapatan bulanan, dan margin kontrak untuk{" "}
              <span className="text-rose-300 font-bold">"{currentTitle}"</span>.
            </p>
          </div>
        ) : isEditing ? (
          /* Manual Edit Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Edit3 className="h-4 w-4 text-rose-400" />
                <span>Mode Edit Dokumen Narasi Finansial (Mendukung Format Markdown)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Batal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            <textarea
              value={editNarrative}
              onChange={(e) => setEditNarrative(e.target.value)}
              placeholder="Tuliskan analisis finansial, unit economics, dan rincian CAC & LTV Anda di sini..."
              rows={14}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs md:text-sm text-slate-100 font-mono focus:outline-hidden focus:border-rose-500 transition leading-relaxed resize-y"
            />
          </div>
        ) : isBlank ? (
          /* Clean Blank State (POLOS) - Exact match to Nomor 1 */
          <div className="py-14 px-4 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
              <Calculator className="h-8 w-8 text-slate-400" />
            </div>

            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Kanvas Analisis CAC & LTV Masih Polos
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Belum ada isian untuk proyek <span className="text-rose-300 font-bold">"{currentTitle}"</span>. Klik tombol di bawah untuk menghasilkan analisis biaya akuisisi, proyeksi LTV kontrak, dan evaluasi kelayakan finansial yang 100% sesuai dengan judul ini.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerateContent(currentTitle)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/20 cursor-pointer active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Buat Isian Baru Sesuai Judul</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditNarrative(
                    `# KAJIAN FINANSIAL CAC & LTV: ${currentTitle}\n\n## 1. Biaya Akuisisi Pelanggan (CAC)\n- Survei Jalur: Rp 10.000.000\n- Trial Run Unit: Rp 15.000.000\n\n## 2. Nilai Seumur Hidup Kontrak (LTV)\n- Pendapatan Bulanan: Rp 50.000.000\n- Durasi Kontrak: 36 Bulan`
                  );
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Tulis Manual</span>
              </button>
            </div>
          </div>
        ) : displayMode === "core" ? (
          /* Core Executive Summary View */
          <div className="space-y-5">
            {/* Hero Executive Card */}
            <div className="bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="h-5 w-5 text-rose-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        INTI UNIT ECONOMICS • RINGKASAN EKSEKUTIF
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Rasio Sangat Sehat ({ltvCacRatio.toFixed(1)}x)
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                      Efisiensi akuisisi kontrak dan potensi nilai seumur hidup kontrak (LTV) untuk proyek <span className="text-rose-300 font-bold">"{currentTitle}"</span> menunjukkan tingkat profitabilitas tinggi dengan periode pengembalian modal akuisisi di bawah 3 bulan.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Rasio LTV/CAC</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">{ltvCacRatio.toFixed(1)}x</div>
                  </div>
                  <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Payback Time</div>
                    <div className="text-sm font-black text-cyan-300 mt-0.5">&lt; 2.5 Bulan</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Total Biaya Akuisisi (CAC)</div>
                <div className="text-lg font-black text-white font-mono">Rp {totalCacIDR.toLocaleString("id-ID")}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Mencakup riset rute, sertifikasi HSE, dan demo unit operasional.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Estimasi LTV Bersih</div>
                <div className="text-lg font-black text-white font-mono">Rp {totalLtvIDR.toLocaleString("id-ID")}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Nilai margin kumulatif selama {contractDurationMonths} bulan kontrak berjalan.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">Pendapatan Bulanan (ARPU)</div>
                <div className="text-lg font-black text-white font-mono">Rp {avgRevenuePerMonth.toLocaleString("id-ID")}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Rata-rata tagihan muatan bulanan per akun korporasi.</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Margin Keuntungan Bersih</div>
                <div className="text-lg font-black text-white font-mono">{netProfitMargin}% / Bulan</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">EBITDA margin setelah dikurangi bahan bakar, maintenance, & crew.</p>
              </div>
            </div>
          </div>
        ) : displayMode === "document" ? (
          /* Document View (Narasi Mengalir) */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                <FileText className="h-4 w-4 text-rose-400" />
                DOKUMEN LAPORAN FINANSIAL & UNIT ECONOMICS
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditNarrative(customNarrative);
                  setIsEditing(true);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit Teks Dokumen</span>
              </button>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              {customNarrative.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-2" />;
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={idx} className="text-lg md:text-xl font-bold text-white border-b border-slate-800 pb-2 mt-4 first:mt-0">
                      {trimmed.replace("# ", "")}
                    </h2>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3 key={idx} className="text-sm md:text-base font-bold text-rose-400 mt-5 mb-1.5 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      {trimmed.replace("## ", "")}
                    </h3>
                  );
                }
                if (trimmed.startsWith("- ")) {
                  return (
                    <li key={idx} className="ml-4 list-disc text-slate-300 my-1">
                      {trimmed.replace("- ", "")}
                    </li>
                  );
                }
                return (
                  <p key={idx} className="my-1.5 text-slate-300">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          /* Cards / Interactive Calculator View */
          <div className="space-y-6">
            {/* Top 3 Key Parameter Metric Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              {/* Box 1: Total CAC */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 font-mono">
                      BIAYA AKUISISI (CAC)
                    </span>
                    <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                  </div>
                  <div className="text-xl font-black text-rose-400 font-mono tracking-tight">
                    Rp {totalCacIDR.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Komponen Biaya:</span>
                  <span className="font-bold text-slate-200">{cacCosts.length} Pos Pengeluaran</span>
                </div>
              </div>

              {/* Box 2: Total LTV */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                      ESTIMASI LTV BERSIH
                    </span>
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                    Rp {totalLtvIDR.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Margin Bersih:</span>
                  <span className="font-bold text-slate-200">{netProfitMargin}% / Bulan</span>
                </div>
              </div>

              {/* Box 3: Financial Ratio */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 font-mono">
                      RASIO KEUANGAN
                    </span>
                    <Scale className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <div className="text-xl font-black text-sky-400 font-mono tracking-tight">
                    {ltvCacRatio.toFixed(1)}x LTV/CAC
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Status Kesehatan:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${healthColor}`}>
                    {ratioHealth}
                  </span>
                </div>
              </div>

              {/* Box 4: Payback Period */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">
                      PAYBACK PERIOD
                    </span>
                    <Calculator className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono tracking-tight">
                    {paybackMonths} Bulan
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Tenor Kontrak:</span>
                  <span className="font-bold text-slate-200">{contractDurationMonths} Bulan</span>
                </div>
              </div>
            </div>

            {/* UNIFIED DASHBOARD CARDS STREAM (SAMA SEPERTI PILAR 1) */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-rose-400" />
                  Rincian Penjelasan Ter-Breakdown (Kotak Analisis Finansial)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  4 Bab Analisis Unit Economics
                </span>
              </div>
              {/* CARD 1: MACRO / LATAR BELAKANG FINANSIAL */}
              <div className="rounded-2xl border border-rose-900/30 hover:border-rose-700/50 bg-slate-900/90 p-5 md:p-6 transition shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border font-mono bg-rose-500/10 text-rose-400 border-rose-500/30">
                      FINANCIAL FOUNDATION & SECTOR BENCHMARK
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bagian 1
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2 text-rose-100">
                    <Briefcase className="h-4 w-4 text-rose-400" />
                    <span>Latar Belakang Finansial & Karakteristik Sektor: {currentTitle}</span>
                  </h4>

                  {/* Highlight Callout Box */}
                  <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-200 flex items-start gap-2.5 text-xs leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="flex-1">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider block mb-0.5 opacity-90">
                        Penjelasan Singkat:
                      </span>
                      <div>
                        {formatTextWithBold(sectorProfile.sectorNote)}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal text-justify">
                    {formatTextWithBold(sectorProfile.ltvNote)}
                  </p>

                  {/* 3 Sub-Cards for sector metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2 pt-2 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        Tolok Ukur Tenor Kontrak
                      </span>
                      <span className="text-xs font-bold text-white mt-1">
                        {contractDurationMonths} Bulan ({(contractDurationMonths / 12).toFixed(1)} Tahun)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        Benchmark Margin Bersih
                      </span>
                      <span className="text-xs font-bold text-emerald-400 mt-1">
                        {netProfitMargin}% / Bulan
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        Model Pendapatan B2B
                      </span>
                      <span className="text-xs font-bold text-sky-400 mt-1">
                        Kontrak Jangka Panjang (Dedicated Fleet)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: BIAYA AKUISISI (CAC BREAKDOWN) */}
              <div className="rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/90 p-5 md:p-6 transition shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                      CUSTOMER ACQUISITION COST (CAC)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bagian 2
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2 text-white">
                      <TrendingDown className="h-4 w-4 text-rose-400" />
                      <span>Rincian Struktur Biaya Akuisisi Kontrak (CAC)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddCostOpen(!isAddCostOpen)}
                      className="px-2.5 py-1 text-[10.5px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="h-3 w-3 text-rose-400" />
                      <span>{isAddCostOpen ? "Tutup Form" : "Tambah Biaya"}</span>
                    </button>
                  </div>

                  {/* Highlight Callout Box */}
                  <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-200 flex items-start gap-2.5 text-xs leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="flex-1">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider block mb-0.5 opacity-90">
                        Penjelasan Singkat:
                      </span>
                      <div>
                        Total investasi awal untuk memenangkan dan mengaktifkan 1 kontrak klien pada proyek <strong className="text-white">"{currentTitle}"</strong> adalah sebesar <strong className="text-white">Rp {totalCacIDR.toLocaleString("id-ID")}</strong>, terbagi ke dalam {cacCosts.length} pos pengeluaran strategis di bawah ini.
                      </div>
                    </div>
                  </div>

                  {/* Add Cost Form (Collapsible) */}
                  {isAddCostOpen && (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                        Input Pos Biaya CAC Baru:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={newCostName}
                          onChange={(e) => setNewCostName(e.target.value)}
                          placeholder="Nama Komponen Biaya (contoh: Audit K3LL)..."
                          className="sm:col-span-5 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-semibold text-xs focus:outline-hidden focus:border-rose-500"
                        />
                        <select
                          value={newCostCategory}
                          onChange={(e: any) => setNewCostCategory(e.target.value)}
                          className="sm:col-span-3 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 font-semibold text-xs"
                        >
                          <option value="Teknis Operasional">Teknis Operasional</option>
                          <option value="Komersial">Komersial</option>
                          <option value="Legalitas & K3">Legalitas & K3</option>
                        </select>
                        <input
                          type="number"
                          value={newCostVal}
                          onChange={(e) => setNewCostVal(Number(e.target.value))}
                          placeholder="Nominal IDR"
                          className="sm:col-span-3 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-hidden focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCacCost}
                          className="sm:col-span-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg p-2 flex items-center justify-center font-bold transition cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Table / Breakdown of CAC Costs */}
                  <div className="space-y-2">
                    {cacCosts.map((item, idx) => {
                      const sharePct = totalCacIDR > 0 ? ((item.costIDR / totalCacIDR) * 100).toFixed(0) : "0";
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-200 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2.5 flex-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 w-5">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-white flex-1">
                              {item.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                                item.category === "Komersial"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : item.category === "Teknis Operasional"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-7 sm:pl-0">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {sharePct}% dari CAC
                            </span>
                            <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                              Rp {item.costIDR.toLocaleString("id-ID")}
                            </span>
                            {cacCosts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCacCost(item.id)}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                                title="Hapus biaya ini"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 3: SIMULASI LTV KONTRAK */}
              <div className="rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/90 p-5 md:p-6 transition shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      LIFETIME VALUE (LTV) SIMULATOR
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bagian 3
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2 text-white">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span>Simulasi Nilai Kontrak Bersih (LTV) & Sensitivitas Pendapatan</span>
                  </h4>

                  {/* Highlight Callout Box */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 flex items-start gap-2.5 text-xs leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="flex-1">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider block mb-0.5 opacity-90">
                        Penjelasan Singkat:
                      </span>
                      <div>
                        Dengan asumsi tarif pendapatan rata-rata <strong className="text-white">Rp {avgRevenuePerMonth.toLocaleString("id-ID")}</strong> per bulan dan margin laba bersih <strong className="text-white">{netProfitMargin}%</strong>, maka potensi akumulasi keuntungan bersih per kontrak berdurasi {contractDurationMonths} bulan adalah sebesar <strong className="text-emerald-300">Rp {totalLtvIDR.toLocaleString("id-ID")}</strong>.
                      </div>
                    </div>
                  </div>

                  {/* 3 Interactive Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    {/* Slider 1: Pendapatan Bulanan */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">Pendapatan Bruto / Bulan</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          Rp {avgRevenuePerMonth.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20000000"
                        max="200000000"
                        step="5000000"
                        value={avgRevenuePerMonth}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAvgRevenuePerMonth(val);
                          persistState(cacCosts, val, netProfitMargin, contractDurationMonths);
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>Rp 20 Juta</span>
                        <span>Rp 200 Juta</span>
                      </div>
                    </div>

                    {/* Slider 2: Margin Bersih */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">Margin Bersih (Net %)</span>
                        <span className="text-emerald-400 font-bold font-mono">{netProfitMargin}%</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="30"
                        step="1"
                        value={netProfitMargin}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setNetProfitMargin(val);
                          persistState(cacCosts, avgRevenuePerMonth, val, contractDurationMonths);
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>8% (Konservatif)</span>
                        <span>30% (Agresif)</span>
                      </div>
                    </div>

                    {/* Slider 3: Durasi Kontrak */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">Durasi Kontrak</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {contractDurationMonths} Bulan ({(contractDurationMonths / 12).toFixed(1)} Thn)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="60"
                        step="6"
                        value={contractDurationMonths}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setContractDurationMonths(val);
                          persistState(cacCosts, avgRevenuePerMonth, netProfitMargin, val);
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>12 Bln (1 Thn)</span>
                        <span>60 Bln (5 Thn)</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Output Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Omzet Bruto Kontrak
                      </span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                        Rp {grossTurnoverIDR.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[9.5px] text-slate-400">Total penagihan invoice</span>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                        Laba Bersih LTV
                      </span>
                      <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                        Rp {totalLtvIDR.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[9.5px] text-slate-400">Net margin {netProfitMargin}%</span>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-mono text-sky-400 uppercase block font-bold">
                        Amortisasi Balik Modal
                      </span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                        {paybackMonths} Bulan
                      </span>
                      <span className="text-[9.5px] text-slate-400">Dari total {contractDurationMonths} bulan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: EVALUASI RASIO & REKOMENDASI EKSEKUTIF */}
              <div className="rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/90 p-5 md:p-6 transition shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border font-mono bg-sky-500/10 text-sky-400 border-sky-500/30">
                      EXECUTIVE DECISION & ROI VERDICT
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Bagian 4
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2 text-white">
                    <Scale className="h-4 w-4 text-sky-400" />
                    <span>Evaluasi Rasio Kelayakan (LTV/CAC) & Arahan Keputusan</span>
                  </h4>

                  {/* Highlight Callout Box */}
                  <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-200 flex items-start gap-2.5 text-xs leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                    <div className="flex-1">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider block mb-0.5 opacity-90">
                        Evaluasi Rasio:
                      </span>
                      <div>
                        Rasio efektivitas investasi LTV/CAC tercatat di level <strong className="text-white font-mono">{ltvCacRatio.toFixed(2)}x</strong> ({ratioHealth}), dengan waktu balik modal akuisisi (<em className="italic">Payback Period</em>) selama <strong className="text-white">{paybackMonths} bulan</strong> dari total tenor kontrak {contractDurationMonths} bulan.
                      </div>
                    </div>
                  </div>

                  {/* Health Bar Register */}
                  <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-300 uppercase font-mono">BAR METER INDIKATOR KESEHATAN INVESTASI</span>
                      <span className={`px-2.5 py-0.5 rounded border font-mono ${healthColor}`}>
                        {ratioHealth} ({ltvCacRatio.toFixed(2)}x)
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden relative border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          ltvCacRatio >= 5.0
                            ? "bg-emerald-500"
                            : ltvCacRatio >= 3.0
                            ? "bg-blue-400"
                            : ltvCacRatio >= 1.5
                            ? "bg-amber-400"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, (ltvCacRatio / 10) * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>0.0x (Kritis &lt;1.5x)</span>
                      <span>3.0x (Standar Sehat)</span>
                      <span>5.0x (Sangat Sehat)</span>
                      <span>10.0x</span>
                    </div>
                  </div>

                  {/* 3 Executive Action Point Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                        1. Pengendalian CAC
                      </span>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Kunci biaya survei rute dan modifikasi armada agar tidak melampaui Rp {(totalCacIDR / 1000000).toFixed(1)} Juta per kontrak.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                        2. Proteksi Margin
                      </span>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Jaga efisiensi BBM dan utilitas armada minimal {netProfitMargin}% agar akumulasi LTV bersih tercapai maksimal.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                        3. Retensi Kontrak
                      </span>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Perpanjang kontrak melampaui {contractDurationMonths} bulan untuk melipatgandakan rasio LTV tanpa penambahan CAC baru.
                      </p>
                    </div>
                  </div>

                  {/* Strategic Guidance Box */}
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono font-black text-sky-400 uppercase tracking-wider block">
                      📋 REKOMENDASI EKSEKUTIF UNTUK "{currentTitle.toUpperCase()}":
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      {strategyText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
