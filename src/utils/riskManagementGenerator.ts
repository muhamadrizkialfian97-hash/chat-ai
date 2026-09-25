/**
 * PRAMA AI Risk Management & Heat Map Matrix Generator (Pilar 16)
 * Generates tailored, 100% project-aligned 5x5 Risk Heat Map points,
 * categorised risk registers, likelihood-impact assessments, and mitigation protocols.
 */

import { loadSavedProjectParameters, ProjectParameters } from "../types/projectParameters";

export interface PlottedRiskItem {
  id: string; // e.g. "R1"
  label: string; // e.g. "R1 PPA/tender"
  riskName: string; // full description
  category: "core" | "logistic"; // "core" (blue) or "logistic" (brown/rust)
  categoryName: string; // e.g. "EBT / Bisnis Inti" or "Logistik & Operasi"
  prob: number; // 1 to 5 (1: Sangat rendah, 2: Rendah, 3: Sedang, 4: Tinggi, 5: Sangat tinggi)
  impact: number; // 1 to 5 (1: Minor, 2: Moderat, 3: Signifikan, 4: Besar, 5: Kritis)
  pxD: string; // e.g. "Tinggi", "Sedang", "Tinggi dampak", "Rendah"
  mitigation: string; // Key mitigation strategy
}

export interface RiskManagementResult {
  title: string;
  division: string;
  sectorName: string;
  heatMapTitle: string;
  category1Name: string;
  category2Name: string;
  diagramCaption: string;
  plottedRisks: PlottedRiskItem[];
  criticalRisksSummary: string;
  mitigationProtocolSummary: string;
  complianceSummary: string;
  kpiSummary: string;
  narrativeMarkdown: string;
}

export function generateRiskManagementForTitle(
  rawTitle: string,
  division?: string
): RiskManagementResult {
  const title = (rawTitle || "").trim() || "Kajian Manajemen Risiko & Mitigasi Operasional Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Komersial").trim();
  const params: ProjectParameters = loadSavedProjectParameters(title);

  // 1. WIND FARM / PLTB / RENEWABLE ENERGY
  if (
    titleLower.includes("wind") ||
    titleLower.includes("pltb") ||
    titleLower.includes("angin") ||
    titleLower.includes("turbin") ||
    titleLower.includes("jeneponto") ||
    titleLower.includes("sidrap") ||
    titleLower.includes("blade")
  ) {
    const heatMapTitle = "Risk Heat Map — EBT (biru) & Logistic (coklat)";
    const category1Name = "EBT & Bisnis Inti (biru)";
    const category2Name = "Logistic & Eksekusi (coklat)";
    const diagramCaption = "Gambar 16.1 — Heat map risiko (penilaian penulis).";

    const plottedRisks: PlottedRiskItem[] = [
      {
        id: "R1",
        label: "R1 PPA/tender",
        riskName: "PPA/tender tertunda atau batal",
        category: "core",
        categoryName: "EBT & Komersial",
        prob: 4.3,
        impact: 4.8,
        pxD: "Tinggi",
        mitigation: "Stage-gate dev-capex; lokasi dalam RUPTL; portofolio 2–3 site"
      },
      {
        id: "R2",
        label: "R2 Wind resource",
        riskName: "Sumber daya angin di bawah P50",
        category: "core",
        categoryName: "EBT & Teknis",
        prob: 3.8,
        impact: 4.9,
        pxD: "Tinggi",
        mitigation: "Pengukuran 12–24 bln, P90 bankable, turbin low-wind"
      },
      {
        id: "R3",
        label: "R3 Tarif/regulasi",
        riskName: "Tarif/regulasi (revisi Perpres)",
        category: "core",
        categoryName: "EBT & Regulasi",
        prob: 4.1,
        impact: 4.1,
        pxD: "Tinggi",
        mitigation: "Negosiasi dekat HPT × F; advokasi via asosiasi"
      },
      {
        id: "R4",
        label: "R4 Grid/curtail",
        riskName: "Grid & curtailment",
        category: "core",
        categoryName: "EBT & Interkoneksi",
        prob: 3.5,
        impact: 4.0,
        pxD: "Sedang",
        mitigation: "Grid study dini; klausul kompensasi; BESS"
      },
      {
        id: "R5",
        label: "R5 Lahan & sosial",
        riskName: "Lahan & penerimaan sosial",
        category: "core",
        categoryName: "EBT & Sosial",
        prob: 3.9,
        impact: 3.3,
        pxD: "Sedang",
        mitigation: "Sewa lahan partisipatif, CSR desa, FPIC"
      },
      {
        id: "R6",
        label: "R6 Konstruksi",
        riskName: "Konstruksi & COD delay",
        category: "core",
        categoryName: "EBT & EPC",
        prob: 3.0,
        impact: 4.5,
        pxD: "Tinggi",
        mitigation: "EPC lump-sum, LD, logistik terintegrasi"
      },
      {
        id: "R7",
        label: "R7 Kurs & bunga",
        riskName: "Kurs & suku bunga",
        category: "core",
        categoryName: "EBT & Finansial",
        prob: 3.6,
        impact: 3.0,
        pxD: "Sedang",
        mitigation: "Pendanaan USD, hedging, concessional"
      },
      {
        id: "R8",
        label: "R8 Pipeline logistik",
        riskName: "Pipeline logistik rendah (skenario Low)",
        category: "logistic",
        categoryName: "Logistik & Pasar",
        prob: 4.7,
        impact: 3.7,
        pxD: "Tinggi",
        mitigation: "Asset-light, utilisasi non-angin, captive anchor"
      },
      {
        id: "R9",
        label: "R9 Damage blade",
        riskName: "Kerusakan blade saat angkut",
        category: "logistic",
        categoryName: "Logistik & Kargo",
        prob: 2.1,
        impact: 4.1,
        pxD: "Sedang",
        mitigation: "Engineering, IoT sensor, asuransi, SOP OEM"
      },
      {
        id: "R10",
        label: "R10 Jalan/jembatan",
        riskName: "Jalan/jembatan tidak memadai",
        category: "logistic",
        categoryName: "Logistik & Rute",
        prob: 3.7,
        impact: 3.7,
        pxD: "Sedang",
        mitigation: "Route survey dini, blade lifter, perkuatan sementara"
      },
      {
        id: "R11",
        label: "R11 Crane idle",
        riskName: "Crane idle antarproyek",
        category: "logistic",
        categoryName: "Logistik & Alat",
        prob: 4.1,
        impact: 2.8,
        pxD: "Sedang",
        mitigation: "Sewa/partner; beli hanya di atas gate"
      },
      {
        id: "R12",
        label: "R12 HSSE",
        riskName: "Insiden HSSE (lifting)",
        category: "logistic",
        categoryName: "Logistik & K3",
        prob: 2.3,
        impact: 4.8,
        pxD: "Tinggi dampak",
        mitigation: "Lift plan, sertifikasi, budaya stop-work"
      },
      {
        id: "R13",
        label: "R13 Cuaca/laut",
        riskName: "Cuaca/gelombang pada leg laut",
        category: "logistic",
        categoryName: "Logistik & Maritim",
        prob: 3.2,
        impact: 2.5,
        pxD: "Rendah",
        mitigation: "Weather window, perencanaan musim"
      },
      {
        id: "R14",
        label: "R14 TKDN",
        riskName: "TKDN & perubahan kebijakan impor",
        category: "logistic",
        categoryName: "Logistik & Regulasi",
        prob: 2.9,
        impact: 2.9,
        pxD: "Sedang",
        mitigation: "Konfirmasi dini dengan ESDM/Kemenperin & lender"
      }
    ];

    return buildRiskResult(
      title,
      divName,
      "Logistik Proyek Energi Terbarukan & Heavy Haulage PLTB",
      heatMapTitle,
      category1Name,
      category2Name,
      diagramCaption,
      plottedRisks
    );
  }

  // 2. FORESTRY / KEHUTANAN HTI & LOGGING
  if (
    titleLower.includes("forestry") ||
    titleLower.includes("kehutanan") ||
    titleLower.includes("hutan") ||
    titleLower.includes("kayu") ||
    titleLower.includes("timber") ||
    titleLower.includes("logging") ||
    titleLower.includes("rapp") ||
    titleLower.includes("pelalawan")
  ) {
    const heatMapTitle = "Risk Heat Map — Operasi HTI (biru) & Transportasi Logging (coklat)";
    const category1Name = "Operasi HTI & Pasokan (biru)";
    const category2Name = "Transportasi & Jalur (coklat)";
    const diagramCaption = "Gambar 16.1 — Heat map risiko logistik kehutanan HTI (penilaian penulis).";

    const plottedRisks: PlottedRiskItem[] = [
      {
        id: "R1",
        label: "R1 Cuaca hujan / amblas",
        riskName: "Jalan tanah HTI amblas saat musim hujan ekstrem",
        category: "core",
        categoryName: "Operasi HTI",
        prob: 4.2,
        impact: 4.7,
        pxD: "Tinggi",
        mitigation: "Penimbunan agregat batu, grader siaga, dan skedul tebang musim kering"
      },
      {
        id: "R2",
        label: "R2 Pasokan petak tebang",
        riskName: "Keterlambatan harvesting di petak tebang HTI",
        category: "core",
        categoryName: "Operasi HTI",
        prob: 3.5,
        impact: 4.2,
        pxD: "Tinggi",
        mitigation: "Buffer logyard di pinggir jalan utama & monitoring harian"
      },
      {
        id: "R3",
        label: "R3 Legalitas SVLK/SIPUHH",
        riskName: "Kendala administrasi verifikasi barcode kayu SVLK",
        category: "core",
        categoryName: "Regulasi HTI",
        prob: 2.2,
        impact: 4.6,
        pxD: "Sedang",
        mitigation: "Integrasi sistem e-SIPUHH KLHK real-time pra-pemberangkatan"
      },
      {
        id: "R4",
        label: "R4 Jembatan ponton rusak",
        riskName: "Kerusakan jembatan ponton/penyeberangan sungai",
        category: "core",
        categoryName: "Infrastruktur",
        prob: 2.8,
        impact: 4.0,
        pxD: "Sedang",
        mitigation: "Inspeksi daya apung ponton mingguan dan perkuatan sling kawat baja"
      },
      {
        id: "R5",
        label: "R5 Konflik batas lahan",
        riskName: "Klaim lahan tenurial oleh masyarakat lokal",
        category: "core",
        categoryName: "Sosial",
        prob: 3.2,
        impact: 3.4,
        pxD: "Sedang",
        mitigation: "Program CSR kemitraan kehutanan dan pendekatan musyawarah desa"
      },
      {
        id: "R6",
        label: "R6 Truk terbalik di tikungan",
        riskName: "Truk logging terbalik akibat stanchion patah / beban geser",
        category: "logistic",
        categoryName: "Transportasi Logging",
        prob: 2.4,
        impact: 4.8,
        pxD: "Tinggi dampak",
        mitigation: "Inspeksi berkala stanchion baja, web-sling pengikat, batas muat m³"
      },
      {
        id: "R7",
        label: "R7 Blindspot telematika",
        riskName: "Hilang kontak GPS di pedalaman hutan HTI",
        category: "logistic",
        categoryName: "Telematika",
        prob: 4.4,
        impact: 2.6,
        pxD: "Sedang",
        mitigation: "GPS satelit hibrida dual-band dan radio komunikasi repeater HT"
      },
      {
        id: "R8",
        label: "R8 Antrean woodyard pabrik",
        riskName: "Kongesti antrean bongkar di woodyard pabrik pulp",
        category: "logistic",
        categoryName: "Destinasi Pabrik",
        prob: 3.9,
        impact: 3.1,
        pxD: "Sedang",
        mitigation: "Sistem slot booking kedatangan digital berbasis e-manifest"
      },
      {
        id: "R9",
        label: "R9 Kerusakan ban off-road",
        riskName: "Pecah ban akibat tunggul kayu dan bebatuan tajam",
        category: "logistic",
        categoryName: "Armada",
        prob: 4.5,
        impact: 2.7,
        pxD: "Sedang",
        mitigation: "Penggunaan ban mining pattern radial ply dan tim servis keliling"
      },
      {
        id: "R10",
        label: "R10 HSSE kelelahan supir",
        riskName: "Microsleep supir hauling pada shift malam",
        category: "logistic",
        categoryName: "HSSE",
        prob: 3.0,
        impact: 4.5,
        pxD: "Tinggi",
        mitigation: "Kamera AI pemantau kantuk DSS dan rest area terjadwal"
      }
    ];

    return buildRiskResult(
      title,
      divName,
      "Logistik Pengangkutan Hasil Hutan Tanaman Industri (HTI)",
      heatMapTitle,
      category1Name,
      category2Name,
      diagramCaption,
      plottedRisks
    );
  }

  // 3. SEMEN CURAH / HI-BLOW & MATERIAL
  if (
    titleLower.includes("semen") ||
    titleLower.includes("cement") ||
    titleLower.includes("hi-blow") ||
    titleLower.includes("klinker") ||
    titleLower.includes("beton")
  ) {
    const heatMapTitle = "Risk Heat Map — Komersial Semen (biru) & Operasional Tangki (coklat)";
    const category1Name = "Komersial & Regulasi (biru)";
    const category2Name = "Operasional Tangki Silo (coklat)";
    const diagramCaption = "Gambar 16.1 — Heat map risiko distribusi semen curah Hi-Blow (penilaian penulis).";

    const plottedRisks: PlottedRiskItem[] = [
      {
        id: "R1",
        label: "R1 Zero ODOL penindakan",
        riskName: "Penindakan batas muatan sumbu MST 10 ton di jembatan timbang",
        category: "core",
        categoryName: "Regulasi",
        prob: 3.8,
        impact: 4.8,
        pxD: "Tinggi",
        mitigation: "Penimbangan digital ketat di loading plant, batas muat 28–30 ton"
      },
      {
        id: "R2",
        label: "R2 Volatilitas solar industri",
        riskName: "Kenaikan mendadak harga bahan bakar solar non-subsidi",
        category: "core",
        categoryName: "Finansial",
        prob: 4.2,
        impact: 3.8,
        pxD: "Tinggi",
        mitigation: "Klausul Fuel Adjustment Factor (FAF) otomatis dalam kontrak B2B"
      },
      {
        id: "R3",
        label: "R3 Denda demurrage batching",
        riskName: "Penalti keterlambatan tiba saat jadwal pengecoran beton",
        category: "core",
        categoryName: "Komersial",
        prob: 3.1,
        impact: 4.0,
        pxD: "Sedang",
        mitigation: "Buffer time rute 15%, GPS dynamic ETA, armada siaga cadangan"
      },
      {
        id: "R4",
        label: "R4 Overpressure bejana",
        riskName: "Bahaya kelebihan tekanan pada dinding tangki silo saat unloader",
        category: "logistic",
        categoryName: "Keselamatan Tangki",
        prob: 2.1,
        impact: 4.9,
        pxD: "Tinggi dampak",
        mitigation: "Dual safety pressure relief valves 2.2 bar & sensor alarm digital"
      },
      {
        id: "R5",
        label: "R5 Penyumbatan pipa semen",
        riskName: "Pneumatic pipe choking akibat udara kompresor lembap",
        category: "logistic",
        categoryName: "Operasi Blower",
        prob: 3.6,
        impact: 3.2,
        pxD: "Sedang",
        mitigation: "Instalasi tabung air dryer & water trap pada unit kompresor"
      },
      {
        id: "R6",
        label: "R6 Tumpahan debu semen",
        riskName: "Pecah selang kopling atau kebocoran paking manhole",
        category: "logistic",
        categoryName: "Lingkungan",
        prob: 2.7,
        impact: 3.5,
        pxD: "Sedang",
        mitigation: "Uji tekanan selang berkala dan penggantian seal paking rutin"
      },
      {
        id: "R7",
        label: "R7 Bekerja di ketinggian",
        riskName: "Kru terjatuh saat membuka manhole atas tangki",
        category: "logistic",
        categoryName: "HSSE",
        prob: 2.3,
        impact: 4.6,
        pxD: "Tinggi dampak",
        mitigation: "Full body harness terikat pada lifeline catwalk atas tangki"
      }
    ];

    return buildRiskResult(
      title,
      divName,
      "Logistik Distribusi Semen Curah Hi-Blow",
      heatMapTitle,
      category1Name,
      category2Name,
      diagramCaption,
      plottedRisks
    );
  }

  // 4. PERTAMBANGAN NIKEL / BATUBARA
  if (
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("nickel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("mineral")
  ) {
    const heatMapTitle = "Risk Heat Map — Tambang & Smelter (biru) & Hauling Berat (coklat)";
    const category1Name = "Tambang & Smelter (biru)";
    const category2Name = "Hauling Dump Truck (coklat)";
    const diagramCaption = "Gambar 16.1 — Heat map risiko pengangkutan pertambangan (penilaian penulis).";

    const plottedRisks: PlottedRiskItem[] = [
      {
        id: "R1",
        label: "R1 Verifikasi SIMBARA",
        riskName: "Penghentian izin hauling akibat ketidaksinkronan kuota RKAB",
        category: "core",
        categoryName: "Regulasi ESDM",
        prob: 2.9,
        impact: 4.9,
        pxD: "Tinggi",
        mitigation: "Integrasi API sistem timbangan jembatan langsung ke SIMBARA Ditjen Minerba"
      },
      {
        id: "R2",
        label: "R2 Cuaca hujan & jalan licin",
        riskName: "Hauling dihentikan total saat jalan tambang berlumpur licin",
        category: "core",
        categoryName: "Operasi Tambang",
        prob: 4.4,
        impact: 4.1,
        pxD: "Tinggi",
        mitigation: "Perkerasan jalan dengan batu split, drainase terawat, klausul slippery allowance"
      },
      {
        id: "R3",
        label: "R3 Denda demurrage tongkang",
        riskName: "Keterlambatan pemuatan tongkang di pelabuhan jetty",
        category: "core",
        categoryName: "Komersial",
        prob: 3.3,
        impact: 4.2,
        pxD: "Sedang",
        mitigation: "Buffer stockpile intermediate di jetty dan optimalisasi ritase 2 shift"
      },
      {
        id: "R4",
        label: "R4 Tipper dump rollover",
        riskName: "Dump truck terbalik saat membongkar muatan di bibir hopper",
        category: "logistic",
        categoryName: "Keselamatan Alat",
        prob: 2.2,
        impact: 4.9,
        pxD: "Tinggi dampak",
        mitigation: "Sensor inclinometer pengunci hidrolik dan pemadatan rutin area dumping"
      },
      {
        id: "R5",
        label: "R5 Rem blong di turunan",
        riskName: "Overheating rem saat menuruni jalan tambang curam bermuatan penuh",
        category: "logistic",
        categoryName: "Mekanikal Truk",
        prob: 2.4,
        impact: 4.8,
        pxD: "Tinggi dampak",
        mitigation: "Kewajiban penggunaan engine retarder dan jalur penyelamat (runaway ramp)"
      },
      {
        id: "R6",
        label: "R6 Fatigue supir shift malam",
        riskName: "Microsleep supir dump truck di jalur tambang 24 jam",
        category: "logistic",
        categoryName: "HSSE",
        prob: 3.4,
        impact: 4.7,
        pxD: "Tinggi",
        mitigation: "Kamera pemantau kantuk AI DSS dengan getaran kursi dan alarm kabin"
      },
      {
        id: "R7",
        label: "R7 Kerusakan sasis & bak",
        riskName: "Retak sasis akibat impak bongkahan batu bijih keras",
        category: "logistic",
        categoryName: "Pemeliharaan",
        prob: 3.8,
        impact: 3.2,
        pxD: "Sedang",
        mitigation: "Pelat bak baja anti-abrasi Hardox 450 dan jadwal servis preventif terjadwal"
      }
    ];

    return buildRiskResult(
      title,
      divName,
      "Logistik Hauling Mineral Pertambangan",
      heatMapTitle,
      category1Name,
      category2Name,
      diagramCaption,
      plottedRisks
    );
  }

  // 5. DEFAULT COMMERCIAL LOGISTICS
  const heatMapTitle = "Risk Heat Map — Komersial & Regulasi (biru) & Operasional Rute (coklat)";
  const category1Name = "Komersial & Regulasi (biru)";
  const category2Name = "Operasional & Armada (coklat)";
  const diagramCaption = "Gambar 16.1 — Heat map risiko distribusi kargo (penilaian penulis).";

  const plottedRisks: PlottedRiskItem[] = [
    {
      id: "R1",
      label: "R1 Kepatuhan regulasi jalan",
      riskName: "Penindakan regulasi beban gandar dan izin lintasan jalan nasional",
      category: "core",
      categoryName: "Regulasi",
      prob: 3.5,
      impact: 4.6,
      pxD: "Tinggi",
      mitigation: "Survei jembatan timbang, verifikasi berat kargo, perizinan resmi Kemenhub"
    },
    {
      id: "R2",
      label: "R2 Keterlambatan tiba (SLA)",
      riskName: "Kemacetan rute dan keterlambatan pengiriman ke klien",
      category: "core",
      categoryName: "Komersial",
      prob: 3.9,
      impact: 3.7,
      pxD: "Sedang",
      mitigation: "Routing dinamis AI, buffer waktu pengiriman, tim pengawalan konvoi"
    },
    {
      id: "R3",
      label: "R3 Fluktuasi biaya solar",
      riskName: "Kenaikan harga bahan bakar non-subsidi",
      category: "core",
      categoryName: "Finansial",
      prob: 4.1,
      impact: 3.6,
      pxD: "Sedang",
      mitigation: "Klausul penyesuaian tarif BBM (Fuel Surcharge) dalam kontrak perjanjian"
    },
    {
      id: "R4",
      label: "R4 Kerusakan muatan kargo",
      riskName: "Kerusakan fisik barang akibat guncangan atau penanganan salah",
      category: "logistic",
      categoryName: "Kargo",
      prob: 2.3,
      impact: 4.5,
      pxD: "Sedang",
      mitigation: "Lashing terstandarisasi, sensor shock IoT, asuransi Marine Cargo komprehensif"
    },
    {
      id: "R5",
      label: "R5 Kerusakan unit di jalan",
      riskName: "Mogok atau kerusakan mekanis kendaraan di tengah rute",
      category: "logistic",
      categoryName: "Armada",
      prob: 3.2,
      impact: 3.5,
      pxD: "Sedang",
      mitigation: "Pemeliharaan preventif ketat, jaringan bengkel rekanan 24 jam"
    },
    {
      id: "R6",
      label: "R6 Insiden keselamatan HSSE",
      riskName: "Kecelakaan lalu lintas akibat kelelahan supir",
      category: "logistic",
      categoryName: "HSSE",
      prob: 2.8,
      impact: 4.8,
      pxD: "Tinggi dampak",
      mitigation: "Telematika pemantau kecepatan, batas jam kerja supir, pelatihan defensive driving"
    }
  ];

  return buildRiskResult(
    title,
    divName,
    "Logistik Distribusi Komersial Terpadu",
    heatMapTitle,
    category1Name,
    category2Name,
    diagramCaption,
    plottedRisks
  );
}

function buildRiskResult(
  title: string,
  division: string,
  sectorName: string,
  heatMapTitle: string,
  category1Name: string,
  category2Name: string,
  diagramCaption: string,
  plottedRisks: PlottedRiskItem[]
): RiskManagementResult {
  const criticalRisksSummary = plottedRisks.filter((r) => r.pxD.includes("Tinggi")).map((r) => r.riskName).join("; ");
  const mitigationProtocolSummary = plottedRisks.map((r) => `${r.id}: ${r.mitigation}`).join("; ");
  const complianceSummary = "Kepatuhan penuh standar K3LL, audit kelaikan armada, dan regulasi pemerintah terkait.";
  const kpiSummary = "Zero Fatal Incidents, Damage Rate < 0.1%, Contract SLA Compliance ≥ 98.5%.";

  const narrativeMarkdown = `# 16 RISK ANALYSIS
**Proyek:** ${title.toUpperCase()}
**Divisi:** ${division} • **Sektor:** ${sectorName}

---

## 1. REGISTER RISIKO & MATRIKS HEAT MAP
*${heatMapTitle}*

| Kode | Risiko | P × D | Mitigasi utama |
| :--- | :--- | :--- | :--- |
${plottedRisks.map((r) => `| **${r.id}** | ${r.riskName} | **${r.pxD}** | ${r.mitigation} |`).join("\n")}

---

## 2. RANGKUMAN KATEGORI & MITIGASI UTAMA
- **Kategori 1:** ${category1Name}
- **Kategori 2:** ${category2Name}
- **Prinsip Mitigasi:** Eliminasi risiko melalui stage-gate governance, kontrol teknis preventif, kepatuhan HSSE, dan proteksi asuransi komprehensif.`;

  return {
    title,
    division,
    sectorName,
    heatMapTitle,
    category1Name,
    category2Name,
    diagramCaption,
    plottedRisks,
    criticalRisksSummary,
    mitigationProtocolSummary,
    complianceSummary,
    kpiSummary,
    narrativeMarkdown
  };
}
