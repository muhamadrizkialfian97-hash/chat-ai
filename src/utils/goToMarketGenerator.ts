/**
 * PRAMA AI Go-To-Market Strategy Generator (Pilar 12: B2B Commercial Roadmap & Market Penetration)
 * Dynamically synthesizes title-tailored Go-To-Market Strategy, Phase Roadmap Table,
 * Value Proposition, Pricing Models, Sales Channels, and Technical Marketing.
 */

import { loadSavedProjectParameters, ProjectParameters } from "../types/projectParameters";

export interface GTMPhaseItem {
  phase: string;
  timing: string;
  focus: string;
  target: string;
}

export interface GoToMarketResult {
  title: string;
  division: string;
  sectorName: string;
  phaseRoadmap: GTMPhaseItem[];
  valueProposition: string;
  pricingStrategy: string;
  salesChannels: string;
  technicalMarketing: string;
  targetAccountsSummary: string;
  pricingModelSummary: string;
  salesChannelsSummary: string;
  kpiSummary: string;
  narrativeMarkdown: string;
}

export function generateGoToMarketForTitle(
  rawTitle: string,
  division?: string
): GoToMarketResult {
  const title = (rawTitle || "").trim() || "Kajian Strategi Go-To-Market & Komersialisasi Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Komersial").trim();
  const params: ProjectParameters = loadSavedProjectParameters(title);

  // 1. WIND FARM & RENEWABLE ENERGY (PLTB / EBT)
  if (
    titleLower.includes("wind") ||
    titleLower.includes("pltb") ||
    titleLower.includes("angin") ||
    titleLower.includes("turbin") ||
    titleLower.includes("jeneponto") ||
    titleLower.includes("sidrap") ||
    titleLower.includes("blade")
  ) {
    const phaseRoadmap: GTMPhaseItem[] = [
      {
        phase: "1. Prove",
        timing: "Q4-2026 – 2028",
        focus:
          "Kualifikasi OEM (Goldwind, Envision, Windey, Mingyang, Vestas), MoU crane partner, pilot scope parsial (port-to-site) pada 1 proyek pihak ketiga; tawarkan studi rute berbayar ke pengembang.",
        target: "1 referensi proyek, 2 OEM approved vendor"
      },
      {
        phase: "2. Anchor & scale",
        timing: "2029 – 2030",
        focus:
          "Layanan penuh untuk PLTB Pancaran EBT fase-1 + 2–3 IPP; framework agreement \"last-500-km\" dengan forwarder OEM Tiongkok/Eropa.",
        target: "150–250 MW/th, pangsa pasar ±30%"
      },
      {
        phase: "3. Expand",
        timing: "2030 – 2031+",
        focus:
          "Logistik O&M & major component exchange; ekspansi regional (Filipina/Vietnam); keputusan JV crane berdasarkan gate milestone proyek.",
        target: "300 MW/th, 20% revenue recurring"
      }
    ];

    const valueProposition =
      '"Satu kontrak, satu control tower, dari pelabuhan asal sampai turbin berdiri" — dengan jaminan OTIF dan KPI damage yang tertulis di kontrak serta garansi kepatuhan regulasi jalan nasional.';
    const pricingStrategy =
      "Lump-sum per WTG untuk heavy haul & engineering; cost-plus (margin 5–8%) untuk ocean freight pass-through; day-rate + mob/demob untuk crane; bonus/malus terhadap jadwal erection.";
    const salesChannels =
      "(a) Langsung ke IPP/EPC pada tender port-to-site; (b) sebagai subkon lokal forwarder OEM dalam TSA berbasis DAP/DDP; (c) captive dari Pancaran EBT dengan harga arm's-length.";
    const technicalMarketing =
      "White paper rute Sulsel/NTT, route survey gratis untuk proyek prioritas, kehadiran di forum METI/GWEC Asia, sertifikasi HSSE terakreditasi internasional sebagai pembuka pintu lelang.";

    return buildGTMResult(
      title,
      divName,
      "Logistik Proyek Energi Terbarukan & Heavy Haulage PLTB",
      phaseRoadmap,
      valueProposition,
      pricingStrategy,
      salesChannels,
      technicalMarketing
    );
  }

  // 2. FORESTRY / KEHUTANAN HTI & PULP PAPER
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
    const phaseRoadmap: GTMPhaseItem[] = [
      {
        phase: "1. Prove",
        timing: "Q4-2026 – 2027",
        focus:
          "Audit pra-kualifikasi vendor transporter pabrik pulp & paper (RAPP/IKPP), uji coba pilot hauling 10–15 unit di distrik prioritas dengan integrasi GPS satelit dan kepatuhan K3 KLHK.",
        target: "Kontrak pilot terverifikasi, 100% kepatuhan SVLK"
      },
      {
        phase: "2. Anchor & scale",
        timing: "2028 – 2029",
        focus:
          "Perluasan kontrak jangka panjang (Multi-Year 3–5 tahun) untuk alokasi 40–80 armada logging 6x4, penetrasi ke konsesi mitra HTI regional Riau, Jambi, dan Sumsel.",
        target: "1.500.000–2.500.000 m³/tahun, pangsa ±25%"
      },
      {
        phase: "3. Expand",
        timing: "2030 – 2031+",
        focus:
          "Integrasi multimoda sungai-darat (barge loading jetty + hauling darat) dan layanan terpadu woodyard management di pabrik pulp.",
        target: "4.000.000 m³/tahun, kontrak dedicated 5 tahun"
      }
    ];

    const valueProposition =
      '"Jaminan pasokan kayu bulat tepat waktu dengan zero road blockage dan pemantauan satelit real-time" — didukung tim rescue jalan mandiri dan ketersediaan armada logging 6x4 standar K3.';
    const pricingStrategy =
      "Tarif per meter kubik (IDR/m³) atau per ton-km berjenjang sesuai radius distrik tebang; klausul fuel adjustment factor (FAF); insentif ritase cepat dan penalti downtime armada.";
    const salesChannels =
      "(a) Tender langsung divisi Wood Supply Procurement pabrik pulp induk; (b) kemitraan strategis dengan kontraktor pemanenan (harvesting contractor); (c) penunjukan langsung distrik darurat saat musim hujan.";
    const technicalMarketing =
      "Studi kelayakan rute koridor tanah HTI, demonstrasi sistem telematika satelit anti-blankspot, audit sertifikasi SVLK/K3 terakreditasi, dan rekam jejak keselamatan nihil kecelakaan.";

    return buildGTMResult(
      title,
      divName,
      "Logistik Pengangkutan Hasil Hutan Tanaman Industri (HTI)",
      phaseRoadmap,
      valueProposition,
      pricingStrategy,
      salesChannels,
      technicalMarketing
    );
  }

  // 3. SEMEN CURAH HI-BLOW & MATERIAL KONSTRUKSI
  if (
    titleLower.includes("semen") ||
    titleLower.includes("cement") ||
    titleLower.includes("hi-blow") ||
    titleLower.includes("klinker") ||
    titleLower.includes("beton") ||
    titleLower.includes("mortar")
  ) {
    const phaseRoadmap: GTMPhaseItem[] = [
      {
        phase: "1. Prove",
        timing: "Q4-2026 – 2027",
        focus:
          "Kualifikasi vendor transporter tangki silo berlisensi di produsen semen terkemuka (SIG, Indocement), pilot project 10 unit rute koridor Jawa-Bali, dan pembuktian laju bongkar pneumatik < 45 menit.",
        target: "1 kontrak utama pabrik semen, 10 unit beroperasi"
      },
      {
        phase: "2. Anchor & scale",
        timing: "2028 – 2029",
        focus:
          "Ekspansi armada menjadi 35–50 unit tangki Hi-Blow, pengikatan kontrak jangka panjang dengan BUMN Precast (Waskita, Adhi, Wijaya Karya Beton) dan batching plant regional.",
        target: "600.000–1.000.000 Ton/th, pangsa pasar koridor 25%"
      },
      {
        phase: "3. Expand",
        timing: "2030 – 2031+",
        focus:
          "Pengembangan intermodal depot transit, integrasi rantai pasok semen curah proyek infrastruktur IKN / luar Jawa, dan digital automated dispatching.",
        target: "1.800.000 Ton/th, kontrak multi-year terproteksi"
      }
    ];

    const valueProposition =
      '"Pengiriman semen curah zero loss dan zero demurrage dengan kecepatan bongkar pneumatik bertekanan tinggi 2.0 bar" — dilengkapi segel digital RFID anti-pencurian dan pemantauan berat gandar resmi Zero ODOL.';
    const pricingStrategy =
      "Tarif per ton/ritase dengan formula eskalasi BBM non-subsidi; skema garansi volume minimum (take-or-pay) 80–85%; diskon volume rebate untuk pemenuhan kuota tahunan di atas target.";
    const salesChannels =
      "(a) B2B Direct Enterprise Sales ke direksi pengadaan pabrik semen induk; (b) kemitraan asosiasi beton siap pakai (APBI/IATPI); (c) penawaran langsung subkontraktor transporter proyek PSN.";
    const technicalMarketing =
      "White paper efisiensi bongkar pneumatik, demonstrasi audit kalibrasi timbangan digital & e-seal, survei jalur bebas razia jembatan timbang, dan portal tracking real-time untuk batching plant.";

    return buildGTMResult(
      title,
      divName,
      "Logistik Distribusi Semen Curah Hi-Blow & Material Konstruksi",
      phaseRoadmap,
      valueProposition,
      pricingStrategy,
      salesChannels,
      technicalMarketing
    );
  }

  // 4. PERTAMBANGAN NIKEL & BATUBARA (MINING HAULING)
  if (
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("nickel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("mineral") ||
    titleLower.includes("hauling")
  ) {
    const phaseRoadmap: GTMPhaseItem[] = [
      {
        phase: "1. Prove",
        timing: "Q4-2026 – 2027",
        focus:
          "Verifikasi Izin Usaha Jasa Pertambangan (IUJP), integrasi SIMBARA ESDM, dan penempatan 15 unit dump truck tipper Hardox di konsesi tambang prioritas dengan target PA ≥ 90%.",
        target: "1 kontrak hauling IUP resmi, zero accident record"
      },
      {
        phase: "2. Anchor & scale",
        timing: "2028 – 2029",
        focus:
          "Skalasi armada menjadi 50–80 unit dump truck, aliansi eksklusif dengan konsorsium smelter RKEF/HPAL dan operator stockpile pelabuhan jetty.",
        target: "2.000.000–3.500.000 WMT/th, 3 konsesi aktif"
      },
      {
        phase: "3. Expand",
        timing: "2030 – 2031+",
        focus:
          "Ekspansi ke layanan terpadu pit-to-port terintegrasi (hauling darat + transshipment tongkang laut 300ft + pengelolaan stockpile jetty).",
        target: "6.000.000 WMT/th, pendapatan berulang multi-year"
      }
    ];

    const valueProposition =
      '"Ketahanan armada heavy-duty Hardox di medan off-road ekstrem dengan jaminan cycle-time dan ketersediaan unit mekanikal (PA) ≥ 92%" — didukung bengkel pit-stop on-site 24 jam dan kepatuhan penuh kaidah Good Mining Practice.';
    const pricingStrategy =
      "Tarif per wet metric ton (WMT) berdasarkan jarak pit ke jetty; sistem fuel pass-through disediakan oleh pemilik tambang; klausul slippery weather allowance; dan insentif percepatan sandar tongkang (dispatch money).";
    const salesChannels =
      "(a) Negosiasi bilateral langsung dengan pemilik IUP pemegang persetujuan RKAB; (b) tender pengadaan jasa transportasi konsorsium smelter; (c) kemitraan kontraktor utama pertambangan.";
    const technicalMarketing =
      "Laporan audit kelayakan kontur jalan hauling, simulasi perhitungan cycle time & payload optimization, sertifikasi K3 ESDM (SIMPER/Pengawas Operasional), dan integrasi telematika SIMBARA.";

    return buildGTMResult(
      title,
      divName,
      "Logistik Hauling Mineral Pertambangan & Heavy Off-Road",
      phaseRoadmap,
      valueProposition,
      pricingStrategy,
      salesChannels,
      technicalMarketing
    );
  }

  // 5. DEFAULT / GENERAL COMMERCIAL LOGISTICS FALLBACK
  const sector = params.sector || "Logistik Distribusi Komersial Terpadu";
  const commodity = params.commodity || title;

  const phaseRoadmap: GTMPhaseItem[] = [
    {
      phase: "1. Prove",
      timing: "Q4-2026 – 2027",
      focus: `Validasi kapabilitas operasional armada spesifik muatan ${commodity}, implementasi SOP K3 dan digital ePOD pada 1–2 klien percontohan di koridor utama.`,
      target: "2 akun B2B referensi, akurasi OTIF ≥ 98%"
    },
    {
      phase: "2. Anchor & scale",
      timing: "2028 – 2029",
      focus: `Skalasi kapasitas armada hingga ${params.fleetCount || 25} unit, pengikatan kontrak komersial jangka menengah dengan produsen/distributor utama di sektor ${sector}.`,
      target: "Pangsa pasar koridor ±25%, volume kontrak 80%"
    },
    {
      phase: "3. Expand",
      timing: "2030 – 2031+",
      focus: "Ekspansi jaringan rute antar-pulau/antar-provinsi, diversifikasi nilai tambah logistik terpadu dan control tower terpusat.",
      target: "Peningkatan pendapatan berulang (recurring revenue) 30%"
    }
  ];

  const valueProposition =
    `"Layanan logistik terpadu ${commodity} satu pintu dengan kepastian ketepatan waktu (OTIF ≥ 98.5%), integritas kargo zero loss, dan visibilitas digital penuh" — didukung armada terdedikasi dan proteksi asuransi terpercaya.`;
  const pricingStrategy =
    "Tarif kompetitif per trip/tonase dengan formula penyesuaian bahan bakar (fuel surcharge), skema komitmen volume bulanan (take-or-pay), dan fleksibilitas termin pembayaran B2B terstruktur.";
  const salesChannels =
    "(a) Penetrasi langsung tim Enterprise Sales ke manajer pengadaan (Supply Chain/Procurement) perusahaan sasaran; (b) keikutsertaan tender logistik formal; (c) kemitraan strategis konsorsium ekspedisi.";
  const technicalMarketing =
    "Penyusunan studi rute koridor distribusi, uji coba gratis (pilot run) pada rute kritis, presentasi audit keselamatan armada, dan portal monitoring status pengiriman real-time bagi pelanggan.";

  return buildGTMResult(
    title,
    divName,
    sector,
    phaseRoadmap,
    valueProposition,
    pricingStrategy,
    salesChannels,
    technicalMarketing
  );
}

function buildGTMResult(
  title: string,
  division: string,
  sectorName: string,
  phaseRoadmap: GTMPhaseItem[],
  valueProposition: string,
  pricingStrategy: string,
  salesChannels: string,
  technicalMarketing: string
): GoToMarketResult {
  const targetAccountsSummary = `Korporasi industri tier-1 di sektor ${sectorName} yang membutuhkan transporter terpercaya dengan armada terdedikasi.`;
  const pricingModelSummary = pricingStrategy;
  const salesChannelsSummary = salesChannels;
  const kpiSummary = "Contract Win Rate (≥35%), SLA OTIF (≥98.5%), Net Revenue Retention (≥110%).";

  const narrativeMarkdown = `# 12 GO-TO-MARKET STRATEGY
**Proyek:** ${title.toUpperCase()}
**Divisi:** ${division} • **Sektor:** ${sectorName}

---

## 1. TAHAPAN PENETRASI PASAR & ROADMAP EKSEKUSI (PHASE ROADMAP)
| Fase | Waktu | Fokus | Target |
| :--- | :--- | :--- | :--- |
${phaseRoadmap.map((p) => `| **${p.phase}** | ${p.timing} | ${p.focus} | ${p.target} |`).join("\n")}

---

## 2. PILAR STRATEGI KOMERSIAL & PENJUALAN B2B
- **Proposisi Nilai (Value Proposition):** ${valueProposition}
- **Strategi Penetapan Tarif (Pricing Strategy):** ${pricingStrategy}
- **Kanal Pemasaran & Penjualan (Sales Channels):** ${salesChannels}
- **Pemasaran Teknis & Diferensiasi (Technical Marketing):** ${technicalMarketing}

---

## 3. INDIKATOR KINERJA UTAMA (GTM KPI)
- **Tingkat Kemenangan Kontrak (Contract Win Rate):** Target ≥ 35%
- **Rasio Kapasitas Terkontrak (Contracted Volume Ratio):** Target ≥ 80%
- **Tingkat Retensi Klien (Net Revenue Retention):** Target ≥ 110%
- **Kepatuhan Keselamatan Operasional:** 100% Zero Accident`;

  return {
    title,
    division,
    sectorName,
    phaseRoadmap,
    valueProposition,
    pricingStrategy,
    salesChannels,
    technicalMarketing,
    targetAccountsSummary,
    pricingModelSummary,
    salesChannelsSummary,
    kpiSummary,
    narrativeMarkdown
  };
}
