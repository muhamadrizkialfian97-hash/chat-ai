import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Save,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  Truck,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import {
  ProjectParameters,
  PROJECT_PRESETS,
  DEFAULT_PROJECT_PARAMS,
  loadSavedProjectParameters,
  saveProjectParameters
} from "../types/projectParameters";

interface ProjectParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onSaveAndSync: (params: ProjectParameters, forceRegenerate?: boolean) => void;
}

export const ProjectParametersModal: React.FC<ProjectParametersModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  onSaveAndSync
}) => {
  const [formData, setFormData] = useState<ProjectParameters>(() => {
    return loadSavedProjectParameters(currentTitle);
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"general" | "operations" | "financial" | "constraints">("general");
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Sync state if modal is reopened or title changed
  useEffect(() => {
    if (isOpen) {
      const loaded = loadSavedProjectParameters(currentTitle);
      setFormData(loaded);
      const match = PROJECT_PRESETS.find(
        (p) =>
          p.params.projectTitle.toLowerCase() === loaded.projectTitle.toLowerCase() ||
          loaded.projectTitle.toLowerCase().includes(p.id)
      );
      if (match) setSelectedPresetId(match.id);
      else setSelectedPresetId("");
    }
  }, [isOpen, currentTitle]);

  if (!isOpen) return null;

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PROJECT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setFormData({ ...preset.params, updatedAt: Date.now() });
    }
  };

  const handleInputChange = (field: keyof ProjectParameters, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (regeneratePillars: boolean = true) => {
    saveProjectParameters(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onSaveAndSync(formData, regeneratePillars);
      onClose();
    }, 400);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Kembalikan formulir ke pengaturan standar?")) {
      setFormData(DEFAULT_PROJECT_PARAMS);
      setSelectedPresetId("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800 font-sans"
      >
        {/* Header - Clean White Theme */}
        <div className="bg-white p-5 sm:p-6 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Formulir Parameter Detail Proyek
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Isi parameter teknis, rute, volume, dan keuangan proyek di bawah ini agar seluruh 14 Pilar dan dokumen ekspor terisi data riil spesifik.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Presets Bar - Clean Light */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Template Sektor Pilihan (1-Klik Otomatis):
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[10.5px] text-slate-500 hover:text-slate-800 transition underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Form
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {PROJECT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  <span className="text-sm">{preset.icon}</span>
                  <span>{preset.name.split("(")[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs - Clean Light */}
        <div className="flex border-b border-slate-200 bg-white px-5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>1. Info Utama & Klien</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("operations")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "operations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>2. Teknis Rute & Armada</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("financial")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "financial"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>3. Finansial & Tarif</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("constraints")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "constraints"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>4. Lapangan & Kompetitor</span>
          </button>
        </div>

        {/* Scrollable Form Body - Clean Light */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
          {/* TAB 1: General & Client */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Kajian Proyek / Business Case
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  placeholder="Contoh: Kajian Strategis Kelayakan Logistik Pengangkutan Semen Curah Hi-Blow Jawa-Bali"
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sektor & Industri
                  </label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => handleInputChange("sector", e.target.value)}
                    placeholder="Contoh: Energi Terbarukan / Kehutanan HTI / Pertambangan Nikel"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Klien Utama / Target Offtaker
                  </label>
                  <input
                    type="text"
                    value={formData.targetClient}
                    onChange={(e) => handleInputChange("targetClient", e.target.value)}
                    placeholder="Contoh: PT PLN (Persero) / PT RAPP / PT Semen Indonesia"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Komoditas & Karakteristik Muatan Spesifik
                </label>
                <textarea
                  rows={2}
                  value={formData.commodity}
                  onChange={(e) => handleInputChange("commodity", e.target.value)}
                  placeholder="Contoh: Blade Turbin Angin (Panjang 75m, Bobot 22 Ton/bilah), Nacelle 85 Ton, dan Segmen Menara 90 Ton"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Operations & Route */}
          {activeTab === "operations" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Koridor Rute, Asal - Tujuan & Jarak Tempuh
                </label>
                <input
                  type="text"
                  value={formData.routeCorridor}
                  onChange={(e) => handleInputChange("routeCorridor", e.target.value)}
                  placeholder="Contoh: Pelabuhan Soekarno-Hatta Makassar ke Site PLTB Jeneponto / Sidrap (±140 km via Jalan Nasional)"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Volume / Kapasitas Produksi
                  </label>
                  <input
                    type="text"
                    value={formData.targetCapacity}
                    onChange={(e) => handleInputChange("targetCapacity", e.target.value)}
                    placeholder="Contoh: 30 Unit Turbin (75 MW) / 2.500.000 m³ per tahun (180 rit/hari)"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jumlah Armada (Unit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={formData.fleetCount}
                    onChange={(e) => handleInputChange("fleetCount", parseInt(e.target.value, 10) || 0)}
                    placeholder="Contoh: 15"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Spesifikasi Detail Armada & Alat Berat yang Dibutuhkan
                </label>
                <textarea
                  rows={2}
                  value={formData.fleetRequirement}
                  onChange={(e) => handleInputChange("fleetRequirement", e.target.value)}
                  placeholder="Contoh: 8 Set Prime Mover Heavy Duty 6x4 540 HP + Multi-Axle Modular Trailer & Blade Trailer + Mobile Crane 500T"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Financial & Pricing */}
          {activeTab === "financial" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Estimasi Investasi Aset (CAPEX)
                  </label>
                  <input
                    type="text"
                    value={formData.capexEstimate}
                    onChange={(e) => handleInputChange("capexEstimate", e.target.value)}
                    placeholder="Contoh: Rp 48.000.000.000"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Masa Kontrak / Durasi Proyek
                  </label>
                  <input
                    type="text"
                    value={formData.contractTerm}
                    onChange={(e) => handleInputChange("contractTerm", e.target.value)}
                    placeholder="Contoh: 5 Tahun Kontrak Jangka Panjang (Multi-Year)"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Model Tarif & Skema Pendapatan (Revenue Model)
                </label>
                <input
                  type="text"
                  value={formData.pricingModel}
                  onChange={(e) => handleInputChange("pricingModel", e.target.value)}
                  placeholder="Contoh: Tarif Lump Sum per Turbin Set Rp 1,4 Miliar atau Rp 82.000 / m³"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Kelayakan Finansial (Payback Period, IRR, ROI)
                </label>
                <input
                  type="text"
                  value={formData.targetROI}
                  onChange={(e) => handleInputChange("targetROI", e.target.value)}
                  placeholder="Contoh: 2,8 Tahun (Payback Period), IRR 29,8%, ROI 42,1%"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Constraints & Competitors */}
          {activeTab === "constraints" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tantangan Lapangan, Hambatan Rute & Standar K3 / Regulasi
                </label>
                <textarea
                  rows={3}
                  value={formData.operationalConstraints}
                  onChange={(e) => handleInputChange("operationalConstraints", e.target.value)}
                  placeholder="Contoh: Radius tikungan jalan sempit di poros Maros-Pangkep, kabel PLN & jembatan penyeberangan over-height, batas beban gandar 10 Ton"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kompetitor Utama / Incumbent di Lapangan
                </label>
                <input
                  type="text"
                  value={formData.keyCompetitors}
                  onChange={(e) => handleInputChange("keyCompetitors", e.target.value)}
                  placeholder="Contoh: PT Cipta Krida Bahari (CKB), PT Puninar Logistics, PT Kamadjaja Logistics"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Clean Light */}
        <div className="bg-white p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-4 w-4 text-blue-500 shrink-0" />
            <span>
              Data akan otomatis disinkronkan ke seluruh 14 Pilar dan dokumen kajian.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer border border-slate-200"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm cursor-pointer active:scale-95"
            >
              {isSavedNotice ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan & Sinkronkan 14 Pilar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectParametersModal;
