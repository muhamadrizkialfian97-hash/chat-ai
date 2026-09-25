import { detectProjectArchetype, ProjectArchetype } from "./archetypeDetector.ts";

export interface FinancialRecommendation {
  archetype: ProjectArchetype;
  archetypeLabel: string;
  sectorTag: string;

  // CAPEX
  assetName: string;
  assetUnitLabel: string;
  capexAssetCount: number;
  capexAssetPrice: number;
  capexAssetCountMin: number;
  capexAssetCountMax: number;
  capexAssetPriceMin: number;
  capexAssetPriceMax: number;
  capexAssetPriceStep: number;
  capexSecondary1Name: string;
  capexSecondary1Amount: number;
  capexSecondary2Name: string;
  capexSecondary2Amount: number;
  capexSecondary3Name: string;
  capexSecondary3Amount: number;
  totalCapex: number;
  annualDepreciation: number;

  // OPEX Bulanan
  opex1Name: string;
  opex1Amount: number;
  opex1Min: number;
  opex1Max: number;
  opex1Step: number;
  opex2Name: string;
  opex2Amount: number;
  opex2Min: number;
  opex2Max: number;
  opex2Step: number;
  opex3Name: string;
  opex3Amount: number;
  opex3Min: number;
  opex3Max: number;
  opex3Step: number;
  opex4Name: string;
  opex4Amount: number;
  totalMonthlyOpex: number;
  totalAnnualOpex: number;

  // AI & Tech Optimization
  techOptimizationTitle: string;
  techOptimizationDesc: string;
  techSavingsPercentOpex1: number;
  techSavingsPercentOpex3: number;

  // REVENUE & P&L
  annualRevenuePerAsset: number;
  annualRevenuePerAssetMin: number;
  annualRevenuePerAssetMax: number;
  annualRevenuePerAssetStep: number;
  revenueY1: number;
  revenueY2: number;
  revenueY3: number;
  ebitdaY1: number;
  ebitdaY2: number;
  ebitdaY3: number;
  netProfitY1: number;
  netProfitY2: number;
  netProfitY3: number;
  taxRate: number;

  // FEASIBILITY & ROI
  paybackYears: number;
  paybackText: string;
  roiPercentage: number;
  irrPercentage: number;
  bcrRatio: number;

  // MARKET SIZING
  tam: number;
  sam: number;
  som: number;
  tamDesc: string;
  samDesc: string;
  somDesc: string;
}

/**
 * Standardized Financial Recommendations matching project archetype and specific industry nuances.
 * Guarantees 100% uniformity between Pilar 3 written documents, Word exports, and interactive simulators.
 */
export function getFinancialRecommendations(projectTitle: string): FinancialRecommendation {
  const cleanTitle = (projectTitle || "").trim();
  const lower = cleanTitle.toLowerCase();
  const archetype = detectProjectArchetype(cleanTitle);

  // 1. PERSONAL BUSINESS / SME / UMKM ARCHETYPE
  if (archetype === "personal_sme") {
    const isCulinary = lower.includes("kopi") || lower.includes("cafe") || lower.includes("kafe") ||
      lower.includes("kedai") || lower.includes("roti") || lower.includes("bakery") ||
      lower.includes("resto") || lower.includes("warung") || lower.includes("kuliner") ||
      lower.includes("catering") || lower.includes("katering");

    const assetName = isCulinary
      ? "Sewa Tempat & Ruko Strategis Usaha Kuliner"
      : "Sewa Tempat Usaha & Ruang Usaha Mandiri (1-2 Thn)";

    return {
      archetype: "personal_sme",
      archetypeLabel: "Usaha Mandiri & UMKM",
      sectorTag: isCulinary ? "Kuliner & Food Service Mandiri" : "Ritel & Jasa Mandiri",

      // CAPEX
      assetName,
      assetUnitLabel: "Paket Sewa & Lokasi",
      capexAssetCount: 1,
      capexAssetPrice: 75000000,
      capexAssetCountMin: 1,
      capexAssetCountMax: 3,
      capexAssetPriceMin: 30000000,
      capexAssetPriceMax: 150000000,
      capexAssetPriceStep: 5000000,
      capexSecondary1Name: isCulinary ? "Renovasi Interior, Booth & Neon Sign" : "Renovasi Interior, Display & Tata Ruang",
      capexSecondary1Amount: 65000000,
      capexSecondary2Name: isCulinary ? "Mesin Espresso, Kulkas & Tablet POS Kasir" : "Mesin Pokok Usaha & Tablet POS Kasir",
      capexSecondary2Amount: 55000000,
      capexSecondary3Name: "Modal Kerja Awal, Stok Pokok & Izin NIB OSS",
      capexSecondary3Amount: 25000000,
      totalCapex: 220000000, // 75jt + 65jt + 55jt + 25jt = 220jt
      annualDepreciation: 24000000,

      // OPEX Bulanan
      opex1Name: "Bahan Baku & Kemasan Produk (COGS Pokok)",
      opex1Amount: 28000000,
      opex1Min: 15000000,
      opex1Max: 60000000,
      opex1Step: 1000000,
      opex2Name: "Gaji Staf Karyawan Operasional (3-4 Orang)",
      opex2Amount: 18000000,
      opex2Min: 10000000,
      opex2Max: 35000000,
      opex2Step: 1000000,
      opex3Name: "Utilitas Listrik Usaha, Air & Internet POS",
      opex3Amount: 6500000,
      opex3Min: 3000000,
      opex3Max: 15000000,
      opex3Step: 500000,
      opex4Name: "Pemasaran Media Sosial & Pemeliharaan",
      opex4Amount: 9500000,
      totalMonthlyOpex: 62000000,
      totalAnnualOpex: 744000000, // 62jt * 12

      // Tech optimization
      techOptimizationTitle: "SISTEM POS CLOUD & AUTOMATED ORDER",
      techOptimizationDesc: "Efisiensi pemesanan digital dan inventori otomatis mereduksi pemborosan bahan 12% dan waktu layanan 20%.",
      techSavingsPercentOpex1: 12,
      techSavingsPercentOpex3: 10,

      // REVENUE & P&L
      annualRevenuePerAsset: 1144800000, // ~Rp 95.400.000/bln
      annualRevenuePerAssetMin: 600000000,
      annualRevenuePerAssetMax: 2000000000,
      annualRevenuePerAssetStep: 20000000,
      revenueY1: 1144800000,
      revenueY2: 1431000000, // +25%
      revenueY3: 1788750000, // +25%
      ebitdaY1: 400800000,   // ~35% EBITDA
      ebitdaY2: 500000000,
      ebitdaY3: 625000000,
      netProfitY1: 360000000,
      netProfitY2: 450000000,
      netProfitY3: 560000000,
      taxRate: 0.5, // PPh Final UMKM PP 55/2022 (0.5%)

      // FEASIBILITY & ROI
      paybackYears: 0.6, // 6.6 - 8.5 Bulan
      paybackText: "6.6 - 8.5 Bulan (~0.6 Tahun)",
      roiPercentage: 82.5,
      irrPercentage: 42.5,
      bcrRatio: 1.48,

      // MARKET SIZING
      tam: 25000000000,
      sam: 5000000000,
      som: 1200000000,
      tamDesc: "Total belanja konsumen potensial untuk kategori ini di seluruh wilayah kecamatan & kota sekitar.",
      samDesc: "Pangsa pasar terjangkau dalam radius 3 - 5 km dari lokasi gerai usaha aktif.",
      somDesc: "Target penjualan nyata yang dapat dilayani oleh kapasitas operasional harian gerai."
    };
  }

  // 2. MANUFACTURING / FACTORY / INDUSTRIAL ARCHETYPE
  if (archetype === "manufacturing") {
    const isFood = lower.includes("amdk") || lower.includes("air") || lower.includes("makanan") || lower.includes("pangan");

    return {
      archetype: "manufacturing",
      archetypeLabel: "Manufaktur & Pabrikasi",
      sectorTag: isFood ? "Industri Olahan Pangan & Minuman" : "Industri Manufaktur & Fabrikasi",

      // CAPEX
      assetName: isFood ? "Lini Mesin Pemrosesan, Filling & Packaging Higienis" : "Mesin Produksi Utama & Lini Perakitan Otomatis",
      assetUnitLabel: "Lini Mesin Produksi",
      capexAssetCount: 4,
      capexAssetPrice: 800000000, // 4 x 800jt = 3.2M
      capexAssetCountMin: 2,
      capexAssetCountMax: 8,
      capexAssetPriceMin: 400000000,
      capexAssetPriceMax: 1500000000,
      capexAssetPriceStep: 50000000,
      capexSecondary1Name: "Infrastruktur Utilitas Listrik Industri & Genset",
      capexSecondary1Amount: 450000000,
      capexSecondary2Name: "Fasilitas Bangunan Pabrik, Gudang Pallet & IUI",
      capexSecondary2Amount: 610000000,
      capexSecondary3Name: "Sertifikasi SNI/BPOM/Halal & Standar Lingkungan",
      capexSecondary3Amount: 0, // Included in secondary2 to preserve 4.26M standard
      totalCapex: 4260000000, // 3.2M + 450jt + 610jt = 4.260.000.000
      annualDepreciation: 426000000, // 10% straight line (10 tahun)

      // OPEX Bulanan
      opex1Name: "Bahan Baku Pokok & Bahan Penolong Produksi",
      opex1Amount: 155000000,
      opex1Min: 80000000,
      opex1Max: 300000000,
      opex1Step: 5000000,
      opex2Name: "Gaji Tim Produksi, Operator Mesin, QC & Teknisi",
      opex2Amount: 72000000,
      opex2Min: 40000000,
      opex2Max: 150000000,
      opex2Step: 2000000,
      opex3Name: "Energi Listrik Industri (PLN I-3), Air & Bahan Bakar Boiler",
      opex3Amount: 38000000,
      opex3Min: 15000000,
      opex3Max: 80000000,
      opex3Step: 1000000,
      opex4Name: "Perawatan Berkala Mesin, Suku Cadang & Overhead Pabrik",
      opex4Amount: 25000000,
      totalMonthlyOpex: 290000000,
      totalAnnualOpex: 3480000000, // 290jt * 12

      // Tech optimization
      techOptimizationTitle: "SISTEM AUTOMATION & PREDICTIVE MAINTENANCE IoT",
      techOptimizationDesc: "Sensor pemantau mesin mengurangi downtime produksi 25% dan memangkas pemborosan energi 15%.",
      techSavingsPercentOpex1: 8,
      techSavingsPercentOpex3: 15,

      // REVENUE & P&L
      annualRevenuePerAsset: 1300000000, // 4 lini x 1.3M = 5.2M
      annualRevenuePerAssetMin: 800000000,
      annualRevenuePerAssetMax: 2500000000,
      annualRevenuePerAssetStep: 50000000,
      revenueY1: 5200000000,
      revenueY2: 6450000000,
      revenueY3: 7800000000,
      ebitdaY1: 1638000000, // ~31.5%
      ebitdaY2: 2140000000,
      ebitdaY3: 2690000000,
      netProfitY1: 1050000000,
      netProfitY2: 1450000000,
      netProfitY3: 1920000000,
      taxRate: 11, // Tarif PPh Badan fasilitas UMKM/Menengah PPh 31E

      // FEASIBILITY & ROI
      paybackYears: 2.2,
      paybackText: "2.2 Tahun",
      roiPercentage: 33.1,
      irrPercentage: 25.4,
      bcrRatio: 1.34,

      // MARKET SIZING
      tam: 450000000000,
      sam: 65000000000,
      som: 16000000000,
      tamDesc: "Total serapan kebutuhan produk sejenis oleh jaringan distributor dan industri di wilayah provinsi target.",
      samDesc: "Porsi pasar yang secara regulasi, spesifikasi mutu, dan logistik dapat dilayani fasilitas produksi pabrik.",
      somDesc: "Target kuota volume kontrak pasokan yang telah diamankan dalam pipeline pemesanan (PO)."
    };
  }

  // 3. TRANSPORTATION / LOGISTICS ARCHETYPE (Default)
  const isCoal = lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang");
  const isColdChain = lower.includes("reefer") || lower.includes("cold chain") || lower.includes("pendingin");
  const isForestry = lower.includes("forestry") || lower.includes("kayu") || lower.includes("timber");

  let assetName = "Armada Truk Operasional Spesifikasi Tinggi";
  if (isCoal) assetName = "Heavy Duty Dump Truck 10-Roda Tambang Batubara";
  else if (isColdChain) assetName = "Armada Reefer Box Truck Berpendingin Suhu Terkontrol";
  else if (isForestry) assetName = "Armada Truk Log Hauling & Timber Carrier Kehutanan";

  return {
    archetype: "transport",
    archetypeLabel: "Logistik & Transportasi",
    sectorTag: isForestry ? "Forestry & Bulk Cargo Logistics" : (isCoal ? "Mining Heavy Hauling" : "Supply Chain & Fleet Logistics"),

    // CAPEX
    assetName,
    assetUnitLabel: "Unit Armada Truk",
    capexAssetCount: 5,
    capexAssetPrice: 700000000, // 5 x 700jt = 3.5M
    capexAssetCountMin: 2,
    capexAssetCountMax: 12,
    capexAssetPriceMin: 400000000,
    capexAssetPriceMax: 1200000000,
    capexAssetPriceStep: 25000000,
    capexSecondary1Name: "Infrastruktur IT, GPS Telematika & IoT Control Tower",
    capexSecondary1Amount: 350000000,
    capexSecondary2Name: "Setup Fasilitas Depo Pool, Bengkel & Perizinan Dishub",
    capexSecondary2Amount: 410000000,
    capexSecondary3Name: "Lisensi AMDAL, K3 & Sertifikasi Pengangkutan",
    capexSecondary3Amount: 0,
    totalCapex: 4260000000, // 3.5M + 350jt + 410jt = 4.260.000.000
    annualDepreciation: 426000000, // 10%

    // OPEX Bulanan
    opex1Name: "Bahan Bakar Minyak (BBM Solar Industri) Armada",
    opex1Amount: 145000000,
    opex1Min: 80000000,
    opex1Max: 250000000,
    opex1Step: 5000000,
    opex2Name: "Gaji All-in Driver, Co-Driver & Tunjangan Operasi",
    opex2Amount: 78000000,
    opex2Min: 40000000,
    opex2Max: 130000000,
    opex2Step: 2000000,
    opex3Name: "Pemeliharaan Preventif, Suku Cadang & Ban Sasis",
    opex3Amount: 32000000,
    opex3Min: 15000000,
    opex3Max: 60000000,
    opex3Step: 1000000,
    opex4Name: "Overhead Depo, Manajemen Armada & Administrasi",
    opex4Amount: 25000000,
    totalMonthlyOpex: 280000000,
    totalAnnualOpex: 3360000000, // 280jt * 12

    // Tech optimization
    techOptimizationTitle: "SISTEM TELEMATIKA FMS & PREDICTIVE ROUTING",
    techOptimizationDesc: "Sistem rute cerdas dan pemantau idle-engine menghemat konsumsi BBM 15% serta memperpanjang usia ban 10%.",
    techSavingsPercentOpex1: 15,
    techSavingsPercentOpex3: 10,

    // REVENUE & P&L
    annualRevenuePerAsset: 960000000, // 5 truk x 960jt = 4.8M
    annualRevenuePerAssetMin: 600000000,
    annualRevenuePerAssetMax: 1800000000,
    annualRevenuePerAssetStep: 20000000,
    revenueY1: 4800000000,
    revenueY2: 5850000000,
    revenueY3: 7100000000,
    ebitdaY1: 1440000000, // 30.0%
    ebitdaY2: 1850000000,
    ebitdaY3: 2380000000,
    netProfitY1: 920000000,
    netProfitY2: 1250000000,
    netProfitY3: 1680000000,
    taxRate: 11,

    // FEASIBILITY & ROI
    paybackYears: 2.1,
    paybackText: "2.1 - 2.5 Tahun",
    roiPercentage: 32.8,
    irrPercentage: 24.5,
    bcrRatio: 1.38,

    // MARKET SIZING
    tam: 500000000000,
    sam: 75000000000,
    som: 15000000000,
    tamDesc: "Total potensi belanja jasa transportasi & logistik muatan industri di seluruh koridor koridor provinsi target.",
    samDesc: "Pangsa pasar logistik yang sesuai dengan spesifikasi tonase armada dan izin trayek rute operasi.",
    somDesc: "Target volume tonase/ritase yang telah dikontrak pasti oleh klien utama (anchor customer)."
  };
}
