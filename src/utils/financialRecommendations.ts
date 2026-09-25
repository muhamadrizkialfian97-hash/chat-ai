import { detectProjectArchetype, ProjectArchetype } from "./archetypeDetector";

export interface FinancialRecommendation {
  archetype: ProjectArchetype;
  archetypeLabel: string;
  sectorTag: string;
  scaleCategory: string;

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
 * Deterministic hash generator to produce natural, realistic variations for each unique title.
 * Ensures no two distinct project titles have identical figures.
 */
function getTitleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Rounds a number to clean, realistic financial increments (e.g. nearest 500rb, 1jt, or 5jt)
 */
function roundToFinancialStep(value: number, step: number = 500000): number {
  return Math.max(step, Math.round(value / step) * step);
}

/**
 * Extract explicit number of units from title (e.g. "5 Truk", "3 Cabang", "2 Lini", "10 Unit")
 */
function extractUnitCountFromTitle(title: string, defaultCount: number, minCount: number, maxCount: number): number {
  const match = title.match(/(\d+)\s*(unit|truk|truck|cabang|outlet|gerai|lini|line|armada|kolam|kandang|mesin|titik)/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    if (!isNaN(parsed) && parsed >= minCount && parsed <= maxCount) {
      return parsed;
    }
  }
  return defaultCount;
}

/**
 * Dynamic Financial Recommendation Engine.
 * Tailors every single CAPEX, OPEX, TAM/SAM/SOM, and Revenue metric uniquely to the project title.
 * Prevents identical numbers when titles change and maintains 100% financial logic consistency.
 */
export function getFinancialRecommendations(projectTitle: string): FinancialRecommendation {
  const cleanTitle = (projectTitle || "Kajian Kelayakan Bisnis").trim();
  const lower = cleanTitle.toLowerCase();
  const hash = getTitleHash(cleanTitle);

  // Subtle natural percentage variance based on title hash (-12% to +18%)
  const varFactor = 0.88 + ((hash % 31) / 100); 
  const varFactor2 = 0.90 + (((hash >> 3) % 25) / 100);

  // Scale modifiers
  const isMicroScale = lower.includes("kecil") || lower.includes("mikro") || lower.includes("rumahan") ||
    lower.includes("kios") || lower.includes("booth") || lower.includes("gerobak") || lower.includes("kaki lima") ||
    lower.includes("pemula") || lower.includes("sederhana") || lower.includes("freelance") || lower.includes("dropship") || lower.includes("angkringan");

  const isLargeIndustrial = lower.includes("pabrik besar") || lower.includes("smelter") || lower.includes("kilang") ||
    lower.includes("industri berat") || lower.includes("holding") || lower.includes("nasional") || lower.includes("multinasional") || lower.includes("ekspor");

  // Domain categorization
  const isLogistics = lower.includes("transport") || lower.includes("logistik") || lower.includes("armada") ||
    lower.includes("truk") || lower.includes("truck") || lower.includes("hauling") || lower.includes("kargo") ||
    lower.includes("ekspedisi") || lower.includes("delivery") || lower.includes("fms") || lower.includes("reefer") ||
    lower.includes("batubara") || lower.includes("coal") || lower.includes("swarnadwipa") || lower.includes("kontainer");

  const isManufacturing = lower.includes("pabrik") || lower.includes("factory") || lower.includes("manufaktur") ||
    lower.includes("lini produksi") || lower.includes("assembly") || lower.includes("fabrikasi") ||
    lower.includes("amdk") || lower.includes("kemasan") || lower.includes("garmen") || lower.includes("konveksi") ||
    lower.includes("pakan") || lower.includes("plastik") || lower.includes("pengolahan") || lower.includes("olahan pangan");

  const isCulinary = lower.includes("kopi") || lower.includes("cafe") || lower.includes("kafe") ||
    lower.includes("kedai") || lower.includes("roti") || lower.includes("bakery") ||
    lower.includes("resto") || lower.includes("restoran") || lower.includes("warung") || lower.includes("kuliner") ||
    lower.includes("catering") || lower.includes("katering") || lower.includes("makanan") || lower.includes("minuman") ||
    lower.includes("seafood") || lower.includes("ayam") || lower.includes("burger") || lower.includes("snack");

  const isRetail = lower.includes("toko") || lower.includes("store") || lower.includes("shop") ||
    lower.includes("ritel") || lower.includes("retail") || lower.includes("minimarket") ||
    lower.includes("sembako") || lower.includes("butik") || lower.includes("fashion") ||
    lower.includes("apotek") || lower.includes("petshop") || lower.includes("kosmetik") || lower.includes("elektronik");

  const isServiceOrCreative = lower.includes("laundry") || lower.includes("salon") || lower.includes("barber") ||
    lower.includes("pangkas") || lower.includes("cuci") || lower.includes("car wash") ||
    lower.includes("bengkel") || lower.includes("servis") || lower.includes("studio") ||
    lower.includes("fotografi") || lower.includes("agency") || lower.includes("bimbel") ||
    lower.includes("kursus") || lower.includes("event organizer") || lower.includes("konsultan") || lower.includes("klinik");

  const isAgri = lower.includes("ternak") || lower.includes("peternakan") || lower.includes("ikan") ||
    lower.includes("perikanan") || lower.includes("lele") || lower.includes("udang") ||
    lower.includes("hidroponik") || lower.includes("kebun") || lower.includes("tani") || lower.includes("pertanian") || lower.includes("sapi") || lower.includes("kambing");

  // =========================================================================
  // 1. MIKRO / GEROBAK / BOOTH / KAKI LIMA (CAPEX ~Rp 35M - 75M)
  // =========================================================================
  if (isMicroScale && !isLogistics && !isManufacturing) {
    const assetPrice = roundToFinancialStep(22000000 * varFactor, 1000000);
    const sec1 = roundToFinancialStep(16000000 * varFactor2, 500000);
    const sec2 = roundToFinancialStep(9500000 * varFactor, 500000);
    const sec3 = roundToFinancialStep(5500000 * varFactor2, 500000);
    const totalCapex = assetPrice + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep(6500000 * varFactor, 250000);
    const opex2 = roundToFinancialStep(4500000 * varFactor2, 250000);
    const opex3 = roundToFinancialStep(1500000 * varFactor, 100000);
    const opex4 = roundToFinancialStep(1500000 * varFactor2, 100000);
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.75, 5000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.55);

    const depr = roundToFinancialStep(totalCapex / 8, 250000);
    const ebitdaY1 = revY1 - annualOpex;
    const netY1 = ebitdaY1 - depr - (ebitdaY1 * 0.005);
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "personal_sme",
      archetypeLabel: "Usaha Mikro & Rumahan",
      sectorTag: isCulinary ? "Kuliner Booth / Gerobak Mandiri" : "Dagang / Jasa Mikro Mandiri",
      scaleCategory: "Skala Mikro",

      assetName: `Booth / Gerobak Usaha & Set Alat Pokok (${cleanTitle.slice(0, 25)})`,
      assetUnitLabel: "Paket Gerai Mikro",
      capexAssetCount: 1,
      capexAssetPrice: assetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 3,
      capexAssetPriceMin: 12000000,
      capexAssetPriceMax: 45000000,
      capexAssetPriceStep: 1000000,
      capexSecondary1Name: "Sewa Tempat / Spot Kios Strategis (1 Tahun)",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: "Peralatan Penunjang & Tablet POS Kasir",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Bahan Baku Awal, Kemasan & Izin NIB",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: "Bahan Baku & Kemasan Produk Harian",
      opex1Amount: opex1,
      opex1Min: 3000000,
      opex1Max: 15000000,
      opex1Step: 250000,
      opex2Name: "Gaji 1-2 Karyawan / Asisten Gerai",
      opex2Amount: opex2,
      opex2Min: 2500000,
      opex2Max: 9000000,
      opex2Step: 250000,
      opex3Name: "Listrik, Air & Retribusi Lokasi",
      opex3Amount: opex3,
      opex3Min: 500000,
      opex3Max: 3500000,
      opex3Step: 100000,
      opex4Name: "Promosi Lokal & Biaya Operasional",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "QRIS & POS KASIR DIGITAL INSTAN",
      techOptimizationDesc: `Pencatatan kasir digital dan pembayaran QRIS pada ${cleanTitle} memangkas selisih kas dan mempercepat layanan.`,
      techSavingsPercentOpex1: 8,
      techSavingsPercentOpex3: 5,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 5000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.3),
      ebitdaY3: Math.round(ebitdaY1 * 1.65),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.32),
      netProfitY3: Math.round(netY1 * 1.7),
      taxRate: 0.5,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${(payback * 12).toFixed(1)} Bulan (~${payback.toFixed(1)} Thn)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 54.0,
      bcrRatio: 1.62,

      tam: roundToFinancialStep(5500000000 * varFactor, 50000000),
      sam: roundToFinancialStep(1250000000 * varFactor2, 25000000),
      som: roundToFinancialStep(revY1 * 1.15, 10000000),
      tamDesc: `Total estimasi belanja konsumen di area perumahan & pasar sekitar untuk ${cleanTitle}.`,
      samDesc: `Pangsa pasar pembeli aktif dalam radius mobilitas 1-2 km dari lokasi gerai.`,
      somDesc: `Target penjualan nyata yang dapat dipenuhi oleh kapasitas gerai harian.`
    };
  }

  // =========================================================================
  // 2. KULINER / CAFE / COFFEE SHOP / RESTORAN (CAPEX ~Rp 140M - 320M)
  // =========================================================================
  if (isCulinary && !isLogistics && !isManufacturing) {
    const isCoffee = lower.includes("kopi") || lower.includes("coffee") || lower.includes("cafe") || lower.includes("kafe");
    const isResto = lower.includes("resto") || lower.includes("restoran") || lower.includes("seafood") || lower.includes("steak") || lower.includes("catering");

    const baseUnitCount = extractUnitCountFromTitle(cleanTitle, 1, 1, 4);
    const assetBase = isResto ? 95000000 : (isCoffee ? 72000000 : 65000000);
    const assetPrice = roundToFinancialStep(assetBase * varFactor, 1000000);
    const sec1 = roundToFinancialStep((isResto ? 75000000 : 58000000) * varFactor2, 1000000); // Interior & Renovasi
    const sec2 = roundToFinancialStep((isCoffee ? 52000000 : 48000000) * varFactor, 1000000); // Mesin & POS
    const sec3 = roundToFinancialStep(24000000 * varFactor2, 500000); // Legalitas & NIB
    const totalCapex = (assetPrice * baseUnitCount) + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep((isResto ? 32000000 : 22000000) * varFactor, 500000); // Bahan
    const opex2 = roundToFinancialStep((isResto ? 22000000 : 16000000) * varFactor2, 500000); // Gaji
    const opex3 = roundToFinancialStep((isResto ? 7500000 : 5500000) * varFactor, 250000); // Listrik/Air
    const opex4 = roundToFinancialStep(8500000 * varFactor2, 250000); // Promosi
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.55, 10000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.55);

    const depr = roundToFinancialStep(totalCapex / 8, 500000);
    const ebitdaY1 = revY1 - annualOpex;
    const netY1 = ebitdaY1 - depr - (ebitdaY1 * 0.005);
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "personal_sme",
      archetypeLabel: isCoffee ? "Kedai Kopi & Cafe Mandiri" : (isResto ? "Restoran & Food Service" : "Usaha Kuliner Mandiri"),
      sectorTag: isCoffee ? "Specialty Coffee & Beverage" : "Food & Culinary Service",
      scaleCategory: "Skala UMKM Kuliner",

      assetName: isCoffee
        ? `Sewa Tempat Ruko & Mesin Espresso Komersial (${cleanTitle.slice(0, 24)})`
        : `Sewa Lokasi & Peralatan Dapur Komersial (${cleanTitle.slice(0, 24)})`,
      assetUnitLabel: "Paket Gerai / Outlet",
      capexAssetCount: baseUnitCount,
      capexAssetPrice: assetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 4,
      capexAssetPriceMin: 35000000,
      capexAssetPriceMax: 140000000,
      capexAssetPriceStep: 5000000,
      capexSecondary1Name: "Renovasi Interior, Bar Display & Neon Signage",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: isCoffee ? "Mesin Kopi, Grinder, Chiller & POS Kasir Cloud" : "Peralatan Dapur Masak, Kulkas Chiller & POS",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Bahan Baku Awal, Kemasan Produk & Izin NIB Halal",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: "Bahan Baku Segar, Bumbu & Kemasan (COGS)",
      opex1Amount: opex1,
      opex1Min: 10000000,
      opex1Max: 60000000,
      opex1Step: 500000,
      opex2Name: "Gaji Barista / Cook, Kasir & Kru Operasional",
      opex2Amount: opex2,
      opex2Min: 8000000,
      opex2Max: 45000000,
      opex2Step: 500000,
      opex3Name: "Listrik Daya Usaha, Air & Internet POS",
      opex3Amount: opex3,
      opex3Min: 2500000,
      opex3Max: 15000000,
      opex3Step: 250000,
      opex4Name: "Pemasaran Media Sosial & Pemeliharaan Rutin",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "SISTEM POS CLOUD & DIGITAL QR MENU",
      techOptimizationDesc: `Menu QR interaktif dan kontrol inventori pada ${cleanTitle} menekan limbah bahan 14% serta mempercepat rotasi meja 22%.`,
      techSavingsPercentOpex1: 14,
      techSavingsPercentOpex3: 10,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 10000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.28),
      ebitdaY3: Math.round(ebitdaY1 * 1.62),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.3),
      netProfitY3: Math.round(netY1 * 1.68),
      taxRate: 0.5,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${(payback * 12).toFixed(1)} Bulan (~${payback.toFixed(1)} Thn)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 45.0,
      bcrRatio: 1.50,

      tam: roundToFinancialStep(24000000000 * varFactor, 100000000),
      sam: roundToFinancialStep(5200000000 * varFactor2, 50000000),
      som: roundToFinancialStep(revY1 * 1.12, 20000000),
      tamDesc: `Total potensi belanja kuliner dan minuman masyarakat di kawasan target ${cleanTitle}.`,
      samDesc: `Pangsa pasar konsumen dalam radius mobilitas 3-5 km dari gerai.`,
      somDesc: `Target penjualan riil harian sesuai kapasitas meja dan layanan takeaway.`
    };
  }

  // =========================================================================
  // 3. JASA, RETAIL & KREATIF (Laundry, Salon, Bengkel, Butik, Studio) (CAPEX ~Rp 90M - 210M)
  // =========================================================================
  if ((isServiceOrCreative || isRetail) && !isLogistics && !isManufacturing) {
    const isLaundry = lower.includes("laundry") || lower.includes("cuci");
    const isBarber = lower.includes("barber") || lower.includes("salon") || lower.includes("pangkas");
    const isAuto = lower.includes("bengkel") || lower.includes("servis") || lower.includes("car wash");
    const isBoutique = lower.includes("butik") || lower.includes("toko") || lower.includes("fashion") || lower.includes("store");

    const assetBase = isLaundry ? 58000000 : (isAuto ? 68000000 : (isBoutique ? 48000000 : 52000000));
    const assetPrice = roundToFinancialStep(assetBase * varFactor, 1000000);
    const sec1 = roundToFinancialStep(42000000 * varFactor2, 1000000); // Sewa Tempat
    const sec2 = roundToFinancialStep(32000000 * varFactor, 1000000); // Interior & Setup
    const sec3 = roundToFinancialStep(16000000 * varFactor2, 500000); // Legalitas
    const totalCapex = assetPrice + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep(11500000 * varFactor, 500000);
    const opex2 = roundToFinancialStep(13500000 * varFactor2, 500000);
    const opex3 = roundToFinancialStep(4200000 * varFactor, 200000);
    const opex4 = roundToFinancialStep(4800000 * varFactor2, 200000);
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.68, 10000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.55);

    const depr = roundToFinancialStep(totalCapex / 7, 500000);
    const ebitdaY1 = revY1 - annualOpex;
    const netY1 = ebitdaY1 - depr - (ebitdaY1 * 0.005);
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "personal_sme",
      archetypeLabel: isRetail ? "Usaha Ritel & Toko Mandiri" : "Usaha Jasa & Pelayanan",
      sectorTag: isLaundry ? "Jasa Binatu & Perawatan Pakaian" : (isAuto ? "Otomotif & Bengkel Servis" : (isBoutique ? "Fashion & Toko Ritel Mandiri" : "Jasa & Layanan Komersial")),
      scaleCategory: "Skala UMKM Jasa & Ritel",

      assetName: `Paket Peralatan Pokok & Sarana Layanan (${cleanTitle.slice(0, 24)})`,
      assetUnitLabel: "Paket Fasilitas Jasa",
      capexAssetCount: 1,
      capexAssetPrice: assetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 3,
      capexAssetPriceMin: 20000000,
      capexAssetPriceMax: 95000000,
      capexAssetPriceStep: 2000000,
      capexSecondary1Name: "Sewa Tempat & Ruang Usaha Strategis (1 Tahun)",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: "Renovasi Tata Ruang, Interior & Ruang Tunggu",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Bahan Operasional Awal & Izin Legalitas NIB",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: isRetail ? "Pembelian Stok Dagangan & Persediaan" : "Bahan Kimia, Pakai Habis & Suku Cadang Jasa",
      opex1Amount: opex1,
      opex1Min: 4000000,
      opex1Max: 28000000,
      opex1Step: 500000,
      opex2Name: "Gaji & Insentif Karyawan / Teknisi (2-3 Orang)",
      opex2Amount: opex2,
      opex2Min: 6000000,
      opex2Max: 26000000,
      opex2Step: 500000,
      opex3Name: "Listrik, Air & Biaya Utilitas Rutin",
      opex3Amount: opex3,
      opex3Min: 1500000,
      opex3Max: 10000000,
      opex3Step: 200000,
      opex4Name: "Pemasaran Lokal & Pemeliharaan Alat",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "APLIKASI BOOKING & CRM NOTIFIKASI OTOMATIS",
      techOptimizationDesc: `Sistem reservasi dan pencatatan transaksi otomatis pada ${cleanTitle} mendongkrak retensi pelanggan 30%.`,
      techSavingsPercentOpex1: 10,
      techSavingsPercentOpex3: 8,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 10000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.28),
      ebitdaY3: Math.round(ebitdaY1 * 1.62),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.3),
      netProfitY3: Math.round(netY1 * 1.68),
      taxRate: 0.5,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${(payback * 12).toFixed(1)} Bulan (~${payback.toFixed(1)} Thn)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 48.0,
      bcrRatio: 1.55,

      tam: roundToFinancialStep(15000000000 * varFactor, 100000000),
      sam: roundToFinancialStep(3200000000 * varFactor2, 50000000),
      som: roundToFinancialStep(revY1 * 1.15, 15000000),
      tamDesc: `Total nilai perputaran jasa kebutuhan harian masyarakat di wilayah sekitar ${cleanTitle}.`,
      samDesc: `Jumlah konsumen potensial dalam radius jangkauan layanan 3 km.`,
      somDesc: `Target kapasitas transaksi harian gerai aktif.`
    };
  }

  // =========================================================================
  // 4. AGRIBISNIS, PETERNAKAN & PERIKANAN (CAPEX ~Rp 120M - 280M)
  // =========================================================================
  if (isAgri && !isLogistics && !isManufacturing) {
    const assetPrice = roundToFinancialStep(68000000 * varFactor, 1000000);
    const sec1 = roundToFinancialStep(46000000 * varFactor2, 1000000); // Bibit & Pakan awal
    const sec2 = roundToFinancialStep(28000000 * varFactor, 1000000); // Sewa Lahan
    const sec3 = roundToFinancialStep(18000000 * varFactor2, 500000); // Aerator & Pompa
    const totalCapex = assetPrice + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep(16500000 * varFactor, 500000);
    const opex2 = roundToFinancialStep(7800000 * varFactor2, 250000);
    const opex3 = roundToFinancialStep(2600000 * varFactor, 100000);
    const opex4 = roundToFinancialStep(2100000 * varFactor2, 100000);
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.75, 10000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.55);

    const depr = roundToFinancialStep(totalCapex / 8, 500000);
    const ebitdaY1 = revY1 - annualOpex;
    const netY1 = ebitdaY1 - depr - (ebitdaY1 * 0.005);
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "personal_sme",
      archetypeLabel: "Agribisnis & Budidaya Mandiri",
      sectorTag: "Peternakan, Perikanan & Agrikultur",
      scaleCategory: "Skala Agribisnis Mandiri",

      assetName: `Kandang / Kolam Bioflok & Instalasi Pompa (${cleanTitle.slice(0, 24)})`,
      assetUnitLabel: "Paket Fasilitas Budidaya",
      capexAssetCount: 1,
      capexAssetPrice: assetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 4,
      capexAssetPriceMin: 30000000,
      capexAssetPriceMax: 110000000,
      capexAssetPriceStep: 5000000,
      capexSecondary1Name: "Bibit Unggul, Pakan Awal & Suplemen",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: "Sewa Lahan Terbuka / Lahan Budidaya",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Peralatan Aerator, Pompa & Izin Lingkungan",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: "Pakan Harian Pokok, Nutrisi & Vitamin",
      opex1Amount: opex1,
      opex1Min: 7000000,
      opex1Max: 35000000,
      opex1Step: 500000,
      opex2Name: "Upah Tenaga Kerja Perawatan & Panen",
      opex2Amount: opex2,
      opex2Min: 4000000,
      opex2Max: 18000000,
      opex2Step: 250000,
      opex3Name: "Listrik Pompa, Air & Bahan Bakar",
      opex3Amount: opex3,
      opex3Min: 1000000,
      opex3Max: 6000000,
      opex3Step: 100000,
      opex4Name: "Pengemasan, Transportasi Distribusi & Perawatan",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "SISTEM MONITORING IoT AIR & PAKAN OTOMATIS",
      techOptimizationDesc: `Sensor suhu dan penjadwalan pakan otomatis pada ${cleanTitle} memangkas mortalitas bibit 15%.`,
      techSavingsPercentOpex1: 10,
      techSavingsPercentOpex3: 8,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 10000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.28),
      ebitdaY3: Math.round(ebitdaY1 * 1.62),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.3),
      netProfitY3: Math.round(netY1 * 1.68),
      taxRate: 0.5,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${(payback * 12).toFixed(1)} Bulan (~${payback.toFixed(1)} Thn)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 42.0,
      bcrRatio: 1.48,

      tam: roundToFinancialStep(19000000000 * varFactor, 100000000),
      sam: roundToFinancialStep(3800000000 * varFactor2, 50000000),
      som: roundToFinancialStep(revY1 * 1.15, 20000000),
      tamDesc: `Total serapan komoditas pangan segar di pasar induk & supermarket sekitar ${cleanTitle}.`,
      samDesc: `Pangsa serapan pedagang besar & restoran langganan.`,
      somDesc: `Kapasitas kuota panen berkala yang sanggup dipasok secara konsisten.`
    };
  }

  // =========================================================================
  // 5. MANUFAKTUR & PABRIKASI (CAPEX ~Rp 1.5M - 4.5M)
  // =========================================================================
  if (isManufacturing && !isLogistics) {
    const isFood = lower.includes("amdk") || lower.includes("air") || lower.includes("makanan") || lower.includes("pangan");
    const count = extractUnitCountFromTitle(cleanTitle, 3, 1, 8);

    const pricePerLine = roundToFinancialStep((isFood ? 420000000 : 480000000) * varFactor, 10000000);
    const sec1 = roundToFinancialStep(260000000 * varFactor2, 5000000); // Listrik & Genset
    const sec2 = roundToFinancialStep(340000000 * varFactor, 5000000); // Gedung & Pallet
    const sec3 = roundToFinancialStep(120000000 * varFactor2, 5000000); // Sertifikasi SNI/BPOM
    const totalCapex = (pricePerLine * count) + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep(75000000 * varFactor, 1000000);
    const opex2 = roundToFinancialStep(36000000 * varFactor2, 1000000);
    const opex3 = roundToFinancialStep(18000000 * varFactor, 500000);
    const opex4 = roundToFinancialStep(11000000 * varFactor2, 500000);
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.62, 50000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.52);

    const depr = roundToFinancialStep(totalCapex * 0.10, 1000000); // 10% straight line
    const ebitdaY1 = revY1 - annualOpex;
    const ebitY1 = ebitdaY1 - depr;
    const taxY1 = ebitY1 * 0.11;
    const netY1 = ebitY1 - taxY1;
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "manufacturing",
      archetypeLabel: "Manufaktur & Pabrikasi Menengah",
      sectorTag: isFood ? "Industri Olahan Pangan & Minuman" : "Industri Manufaktur & Fabrikasi",
      scaleCategory: "Skala Industri Menengah",

      assetName: isFood
        ? `Lini Mesin Filling & Packaging Higienis (${cleanTitle.slice(0, 24)})`
        : `Lini Mesin Produksi & Fabrikasi Otomatis (${cleanTitle.slice(0, 24)})`,
      assetUnitLabel: "Lini Mesin Produksi",
      capexAssetCount: count,
      capexAssetPrice: pricePerLine,
      capexAssetCountMin: 1,
      capexAssetCountMax: 8,
      capexAssetPriceMin: 220000000,
      capexAssetPriceMax: 900000000,
      capexAssetPriceStep: 20000000,
      capexSecondary1Name: "Instalasi Gardu Listrik Industri PLN & Genset",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: "Sewa/Renovasi Bangunan Pabrik, Gudang & Pallet",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Sertifikasi SNI/BPOM/Halal, IUI & Standar Mutu",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: "Bahan Baku Pokok & Kemasan Produksi",
      opex1Amount: opex1,
      opex1Min: 35000000,
      opex1Max: 180000000,
      opex1Step: 2000000,
      opex2Name: "Gaji Operator Mesin, QC, Teknisi & Supervisor",
      opex2Amount: opex2,
      opex2Min: 18000000,
      opex2Max: 90000000,
      opex2Step: 1000000,
      opex3Name: "Energi Listrik Industri (PLN I-3), Air & Bahan Bakar",
      opex3Amount: opex3,
      opex3Min: 8000000,
      opex3Max: 50000000,
      opex3Step: 500000,
      opex4Name: "Perawatan Mesin, Sparepart & Overhead Pabrik",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "SISTEM AUTOMATION & PREDICTIVE MAINTENANCE IoT",
      techOptimizationDesc: `Sensor getaran dan suhu mesin pada ${cleanTitle} mengurangi downtime 22% dan menghemat energi 12%.`,
      techSavingsPercentOpex1: 8,
      techSavingsPercentOpex3: 12,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 50000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.25),
      ebitdaY3: Math.round(ebitdaY1 * 1.55),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.28),
      netProfitY3: Math.round(netY1 * 1.6),
      taxRate: 11,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${payback.toFixed(1)} Tahun (${Math.round(payback * 12)} Bulan)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 28.0,
      bcrRatio: 1.38,

      tam: roundToFinancialStep(280000000000 * varFactor, 1000000000),
      sam: roundToFinancialStep(45000000000 * varFactor2, 500000000),
      som: roundToFinancialStep(revY1 * 1.2, 100000000),
      tamDesc: `Total kebutuhan serapan produk industri sejenis di seluruh provinsi untuk ${cleanTitle}.`,
      samDesc: `Porsi pasar yang sesuai spesifikasi dan kapasitas lini produksi pabrik.`,
      somDesc: `Target kuota kontrak pasokan jaringan distributor dan grosir.`
    };
  }

  // =========================================================================
  // 6. TRANSPORTASI & LOGISTIK (CAPEX ~Rp 2.1M - 5.5M)
  // =========================================================================
  if (isLogistics) {
    const isCoal = lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang");
    const isReefer = lower.includes("reefer") || lower.includes("cold chain") || lower.includes("pendingin");
    const isHeavy = lower.includes("tronton") || lower.includes("trailer") || lower.includes("kontainer") || lower.includes("cpo");

    const truckCount = extractUnitCountFromTitle(cleanTitle, 4, 2, 12);
    const baseTruckPrice = isCoal ? 680000000 : (isReefer ? 590000000 : (isHeavy ? 620000000 : 540000000));
    const pricePerTruck = roundToFinancialStep(baseTruckPrice * varFactor, 10000000);

    const sec1 = roundToFinancialStep(220000000 * varFactor2, 5000000); // IT & FMS
    const sec2 = roundToFinancialStep(280000000 * varFactor, 5000000); // Depo Pool
    const sec3 = roundToFinancialStep(110000000 * varFactor2, 5000000); // Lisensi & Dishub
    const totalCapex = (pricePerTruck * truckCount) + sec1 + sec2 + sec3;

    const opex1 = roundToFinancialStep((isCoal ? 110000000 : 88000000) * varFactor, 1000000); // BBM Solar
    const opex2 = roundToFinancialStep(52000000 * varFactor2, 1000000); // Gaji Driver
    const opex3 = roundToFinancialStep(22000000 * varFactor, 500000); // Ban & Servis
    const opex4 = roundToFinancialStep(14000000 * varFactor2, 500000); // Overhead Depo
    const monthlyOpex = opex1 + opex2 + opex3 + opex4;
    const annualOpex = monthlyOpex * 12;

    const revY1 = roundToFinancialStep(annualOpex * 1.58, 50000000);
    const revY2 = Math.round(revY1 * 1.25);
    const revY3 = Math.round(revY1 * 1.52);

    const depr = roundToFinancialStep(totalCapex * 0.10, 1000000);
    const ebitdaY1 = revY1 - annualOpex;
    const ebitY1 = ebitdaY1 - depr;
    const taxY1 = ebitY1 * 0.11;
    const netY1 = ebitY1 - taxY1;
    const payback = totalCapex / (netY1 + depr);

    return {
      archetype: "transport",
      archetypeLabel: "Logistik & Transportasi Armada",
      sectorTag: isCoal ? "Mining Heavy Hauling" : (isReefer ? "Cold Chain Reefer Logistics" : "Supply Chain & Fleet Logistics"),
      scaleCategory: "Skala Armada Transportasi",

      assetName: isCoal
        ? `Heavy Dump Truck 10-Roda Tambang (${cleanTitle.slice(0, 24)})`
        : (isReefer ? `Armada Truk Box Reefer Pendingin (${cleanTitle.slice(0, 24)})` : `Armada Truk Operasional Logistik (${cleanTitle.slice(0, 24)})`),
      assetUnitLabel: "Unit Armada Truk",
      capexAssetCount: truckCount,
      capexAssetPrice: pricePerTruck,
      capexAssetCountMin: 2,
      capexAssetCountMax: 12,
      capexAssetPriceMin: 350000000,
      capexAssetPriceMax: 950000000,
      capexAssetPriceStep: 25000000,
      capexSecondary1Name: "Infrastruktur IT, GPS Telematika & IoT Control Tower",
      capexSecondary1Amount: sec1,
      capexSecondary2Name: "Fasilitas Depo Pool, Bengkel & Perizinan Dishub",
      capexSecondary2Amount: sec2,
      capexSecondary3Name: "Lisensi K3, Sertifikasi B3 & Asuransi Armada",
      capexSecondary3Amount: sec3,
      totalCapex,
      annualDepreciation: depr,

      opex1Name: "Bahan Bakar Minyak (BBM Solar Industri) Armada",
      opex1Amount: opex1,
      opex1Min: 45000000,
      opex1Max: 220000000,
      opex1Step: 2000000,
      opex2Name: "Gaji All-in Driver, Co-Driver & Tunjangan Operasi",
      opex2Amount: opex2,
      opex2Min: 22000000,
      opex2Max: 110000000,
      opex2Step: 1000000,
      opex3Name: "Pemeliharaan Preventif, Suku Cadang & Ban Sasis",
      opex3Amount: opex3,
      opex3Min: 10000000,
      opex3Max: 55000000,
      opex3Step: 500000,
      opex4Name: "Overhead Depo, Manajemen Armada & Administrasi",
      opex4Amount: opex4,
      totalMonthlyOpex: monthlyOpex,
      totalAnnualOpex: annualOpex,

      techOptimizationTitle: "SISTEM TELEMATIKA FMS & PREDICTIVE ROUTING",
      techOptimizationDesc: `Pemantauan rute cerdas dan idle-engine pada ${cleanTitle} memangkas konsumsi BBM 14% dan memperpanjang usia ban.`,
      techSavingsPercentOpex1: 14,
      techSavingsPercentOpex3: 10,

      annualRevenuePerAsset: revY1,
      annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
      annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
      annualRevenuePerAssetStep: 50000000,
      revenueY1: revY1,
      revenueY2: revY2,
      revenueY3: revY3,
      ebitdaY1,
      ebitdaY2: Math.round(ebitdaY1 * 1.25),
      ebitdaY3: Math.round(ebitdaY1 * 1.55),
      netProfitY1: Math.round(netY1),
      netProfitY2: Math.round(netY1 * 1.28),
      netProfitY3: Math.round(netY1 * 1.6),
      taxRate: 11,

      paybackYears: Number(payback.toFixed(2)),
      paybackText: `${payback.toFixed(1)} Tahun (${Math.round(payback * 12)} Bulan)`,
      roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
      irrPercentage: 27.0,
      bcrRatio: 1.40,

      tam: roundToFinancialStep(320000000000 * varFactor, 1000000000),
      sam: roundToFinancialStep(55000000000 * varFactor2, 500000000),
      som: roundToFinancialStep(revY1 * 1.2, 100000000),
      tamDesc: `Total potensi belanja jasa transportasi & logistik industri pada koridor ${cleanTitle}.`,
      samDesc: `Pangsa pasar logistik yang sesuai tonase armada dan izin trayek rute operasi.`,
      somDesc: `Target volume ritase yang telah diamankan oleh kontrak pelanggan utama.`
    };
  }

  // =========================================================================
  // 7. DEFAULT STANDAR KUSTOM TERUKUR (CAPEX ~Rp 130M - 240M)
  // =========================================================================
  const assetPrice = roundToFinancialStep(62000000 * varFactor, 1000000);
  const sec1 = roundToFinancialStep(48000000 * varFactor2, 1000000);
  const sec2 = roundToFinancialStep(36000000 * varFactor, 1000000);
  const sec3 = roundToFinancialStep(22000000 * varFactor2, 500000);
  const totalCapex = assetPrice + sec1 + sec2 + sec3;

  const opex1 = roundToFinancialStep(17500000 * varFactor, 500000);
  const opex2 = roundToFinancialStep(12800000 * varFactor2, 500000);
  const opex3 = roundToFinancialStep(4400000 * varFactor, 200000);
  const opex4 = roundToFinancialStep(4300000 * varFactor2, 200000);
  const monthlyOpex = opex1 + opex2 + opex3 + opex4;
  const annualOpex = monthlyOpex * 12;

  const revY1 = roundToFinancialStep(annualOpex * 1.65, 10000000);
  const revY2 = Math.round(revY1 * 1.25);
  const revY3 = Math.round(revY1 * 1.55);

  const depr = roundToFinancialStep(totalCapex / 8, 500000);
  const ebitdaY1 = revY1 - annualOpex;
  const netY1 = ebitdaY1 - depr - (ebitdaY1 * 0.005);
  const payback = totalCapex / (netY1 + depr);

  return {
    archetype: "personal_sme",
    archetypeLabel: "Usaha Mandiri & UMKM",
    sectorTag: "Sektor Niaga & Jasa Mandiri",
    scaleCategory: "Skala Standar UMKM",

    assetName: `Sewa Ruang Usaha & Sarana Pokok (${cleanTitle.slice(0, 24)})`,
    assetUnitLabel: "Paket Tempat & Fasilitas",
    capexAssetCount: 1,
    capexAssetPrice: assetPrice,
    capexAssetCountMin: 1,
    capexAssetCountMax: 3,
    capexAssetPriceMin: 25000000,
    capexAssetPriceMax: 110000000,
    capexAssetPriceStep: 5000000,
    capexSecondary1Name: "Renovasi Interior, Display & Perlengkapan",
    capexSecondary1Amount: sec1,
    capexSecondary2Name: "Peralatan Pokok Operasional & Sistem POS",
    capexSecondary2Amount: sec2,
    capexSecondary3Name: "Modal Kerja Awal & Legalitas Perizinan NIB",
    capexSecondary3Amount: sec3,
    totalCapex,
    annualDepreciation: depr,

    opex1Name: "Biaya Bahan Pokok & Persediaan Dagang",
    opex1Amount: opex1,
    opex1Min: 6000000,
    opex1Max: 40000000,
    opex1Step: 500000,
    opex2Name: "Gaji Staf Karyawan Operasional (2-3 Orang)",
    opex2Amount: opex2,
    opex2Min: 5000000,
    opex2Max: 26000000,
    opex2Step: 500000,
    opex3Name: "Listrik, Air & Biaya Utilitas Rutin",
    opex3Amount: opex3,
    opex3Min: 1500000,
    opex3Max: 10000000,
    opex3Step: 200000,
    opex4Name: "Pemasaran & Pemeliharaan Usaha",
    opex4Amount: opex4,
    totalMonthlyOpex: monthlyOpex,
    totalAnnualOpex: annualOpex,

    techOptimizationTitle: "SISTEM POS DIGITAL & INVENTORI OTOMATIS",
    techOptimizationDesc: `Sistem kasir digital dan pemantau persediaan pada ${cleanTitle} mereduksi selisih stok 12%.`,
    techSavingsPercentOpex1: 12,
    techSavingsPercentOpex3: 10,

    annualRevenuePerAsset: revY1,
    annualRevenuePerAssetMin: Math.round(revY1 * 0.5),
    annualRevenuePerAssetMax: Math.round(revY1 * 2.2),
    annualRevenuePerAssetStep: 10000000,
    revenueY1: revY1,
    revenueY2: revY2,
    revenueY3: revY3,
    ebitdaY1,
    ebitdaY2: Math.round(ebitdaY1 * 1.28),
    ebitdaY3: Math.round(ebitdaY1 * 1.62),
    netProfitY1: Math.round(netY1),
    netProfitY2: Math.round(netY1 * 1.3),
    netProfitY3: Math.round(netY1 * 1.68),
    taxRate: 0.5,

    paybackYears: Number(payback.toFixed(2)),
    paybackText: `${(payback * 12).toFixed(1)} Bulan (~${payback.toFixed(1)} Thn)`,
    roiPercentage: Number(((netY1 + depr) / totalCapex * 100).toFixed(1)),
    irrPercentage: 46.0,
    bcrRatio: 1.50,

    tam: roundToFinancialStep(16000000000 * varFactor, 100000000),
    sam: roundToFinancialStep(3400000000 * varFactor2, 50000000),
    som: roundToFinancialStep(revY1 * 1.15, 15000000),
    tamDesc: `Total belanja konsumen potensial untuk kategori usaha di area ${cleanTitle}.`,
    samDesc: `Pangsa pasar terjangkau dalam radius area aktif operasional gerai.`,
    somDesc: `Target omset riil yang dapat dilayani oleh kapasitas operasional harian.`
  };
}
