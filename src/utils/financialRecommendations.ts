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
 * Deterministic hash generator for a string to create sensible variance per project title
 */
function getProjectSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Standardized Dynamic Financial Recommendations matching project archetype and specific industry nuances.
 * Guarantees distinct, tailored, realistic financial estimations for every project title.
 */
export function getFinancialRecommendations(projectTitle: string): FinancialRecommendation {
  const cleanTitle = (projectTitle || "Kajian Kelayakan Bisnis").trim();
  const lower = cleanTitle.toLowerCase();
  const archetype = detectProjectArchetype(cleanTitle);
  const seed = getProjectSeed(cleanTitle);

  // Variance factor: between 0.85 and 1.25 based on project title
  const variance = 0.85 + ((seed % 41) / 100);

  // 1. PERSONAL BUSINESS / SME / UMKM ARCHETYPE
  if (archetype === "personal_sme") {
    const isCafeRoastery = lower.includes("kopi") || lower.includes("cafe") || lower.includes("kafe") || lower.includes("roastery") || lower.includes("espresso");
    const isRestoKuliner = lower.includes("resto") || lower.includes("restoran") || lower.includes("restaurant") || lower.includes("kedai") || lower.includes("warung") || lower.includes("kuliner") || lower.includes("catering") || lower.includes("katering");
    const isBakery = lower.includes("bakery") || lower.includes("roti") || lower.includes("kue") || lower.includes("pastry");
    const isRetail = lower.includes("toko") || lower.includes("store") || lower.includes("shop") || lower.includes("ritel") || lower.includes("retail") || lower.includes("minimarket") || lower.includes("sembako") || lower.includes("distro") || lower.includes("butik");
    const isBeautySalon = lower.includes("salon") || lower.includes("barbershop") || lower.includes("barber") || lower.includes("pangkas") || lower.includes("skincare") || lower.includes("kecantikan") || lower.includes("klinik kecantikan");
    const isLaundry = lower.includes("laundry") || lower.includes("cuci baju") || lower.includes("cuci kiloan") || lower.includes("dry cleaning");
    const isCarWash = lower.includes("cuci mobil") || lower.includes("car wash") || lower.includes("cuci motor") || lower.includes("detailing") || lower.includes("coating");
    const isWorkshop = lower.includes("bengkel") || lower.includes("servis ac") || lower.includes("service ac") || lower.includes("otomotif");
    const isAgroSme = lower.includes("ternak") || lower.includes("ayam") || lower.includes("bebek") || lower.includes("lele") || lower.includes("ikan") || lower.includes("hidroponik") || lower.includes("kebun") || lower.includes("tani");
    const isAgencyTech = lower.includes("agency") || lower.includes("agensi") || lower.includes("studio") || lower.includes("software") || lower.includes("desain") || lower.includes("fotografi") || lower.includes("konsultan");
    const isClinic = lower.includes("klinik") || lower.includes("apotek") || lower.includes("fisioterapi") || lower.includes("gigi");
    const isKost = lower.includes("kost") || lower.includes("kos") || lower.includes("homestay") || lower.includes("penginapan") || lower.includes("guest house");

    let sectorTag = "Ritel & Jasa Mandiri";
    let assetName = "Sewa Tempat & Ruko Strategis Usaha Mandiri";
    let assetUnitLabel = "Paket Gerai / Outlet";
    let capexAssetCount = 1 + (seed % 2); // 1 or 2
    let baseAssetPrice = 65000000;
    let sec1Name = "Renovasi Interior, Display & Tata Ruang Estetik";
    let baseSec1 = 55000000;
    let sec2Name = "Perangkat Pokok Usaha & Tablet POS Kasir Cloud";
    let baseSec2 = 45000000;
    let sec3Name = "Modal Kerja Awal, Stok Bahan Baku & Izin NIB OSS";
    let baseSec3 = 25000000;

    let o1Name = "Bahan Baku & Kemasan Produk (COGS)";
    let baseO1 = 26000000;
    let o2Name = "Gaji Staf Operasional (3-4 Orang)";
    let baseO2 = 16000000;
    let o3Name = "Utilitas Listrik Usaha, Air & Internet Kasir";
    let baseO3 = 5500000;
    let o4Name = "Pemasaran Media Sosial & Pemeliharaan Gerai";
    let baseO4 = 8500000;

    let baseAnnualRev = 1050000000;
    let techTitle = "SISTEM POS CLOUD & AUTOMATED ORDER";
    let techDesc = "Efisiensi pemesanan digital dan inventori otomatis mereduksi pemborosan bahan 12% dan waktu layanan 20%.";
    let techSave1 = 12;
    let techSave3 = 10;

    if (isCafeRoastery) {
      sectorTag = "Food & Beverage: Specialty Coffee & Roastery";
      assetName = "Sewa Ruko Kafe Strategis (Kontrak 2 Tahun)";
      assetUnitLabel = "Gerai Kafe";
      baseAssetPrice = 85000000;
      sec1Name = "Desain Interior Industrial/Modern, Bar Counter & Neon Sign";
      baseSec1 = 75000000;
      sec2Name = "Mesin Espresso Komersial 2-Group, Grinder & Kulkas Chiller";
      baseSec2 = 65000000;
      sec3Name = "Stok Green Beans, Cup Packaging, Sirup & Izin OSS";
      baseSec3 = 25000000;
      o1Name = "Biji Kopi, Susu Fresh Milk & Bahan Minuman";
      baseO1 = 32000000;
      o2Name = "Gaji Barista, Kasir & Kitchen Crew (4 Orang)";
      baseO2 = 20000000;
      o3Name = "Listrik Daya 11.000 VA, Air & Wi-Fi Berkecepatan Tinggi";
      baseO3 = 7500000;
      o4Name = "Endorsement Selebgram, Iklan IG Ads & Maintenance";
      baseO4 = 11000000;
      baseAnnualRev = 1250000000;
      techTitle = "SELF-ORDER QR & INVENTORY AUTOMATION";
      techDesc = "Menu QR di meja memangkas antrean 35% dan inventori real-time mencegah stok kedaluwarsa.";
    } else if (isRestoKuliner || isBakery) {
      sectorTag = isBakery ? "Kuliner: Bakery & Pastry Production" : "Food Service & Restoran Mandiri";
      assetName = "Sewa Tempat Usaha Kuliner & Dapur Higienis (2 Thn)";
      assetUnitLabel = "Outlet Kuliner";
      baseAssetPrice = 90000000;
      sec1Name = "Renovasi Kitchen Set Stainless, Dine-in & Exhaust Hood";
      baseSec1 = 80000000;
      sec2Name = isBakery ? "Deck Oven Komersial, Mixer Spiral & Proofer Roti" : "Kompor Kwali Range, Chiller Dapur & Alat Masak Heavy-Duty";
      baseSec2 = 70000000;
      sec3Name = "Bahan Baku Awal, Packaging Food Grade & Sertifikat Halal";
      baseSec3 = 30000000;
      o1Name = "Bahan Baku Makanan Segar & Packaging Higienis";
      baseO1 = 38000000;
      o2Name = "Gaji Koki, Asisten Dapur & Pramusaji (5 Orang)";
      baseO2 = 24000000;
      o3Name = "Gas LPG Industri, Listrik Dapur, Air & Sanitasi";
      baseO3 = 8000000;
      o4Name = "Promosi GrabFood/GoFood, Meta Ads & Perawatan Dapur";
      baseO4 = 12000000;
      baseAnnualRev = 1450000000;
    } else if (isBeautySalon) {
      sectorTag = "Lifestyle & Beauty: Barbershop / Klinik Kecantikan";
      assetName = "Sewa Ruko Komersial 2 Lantai Lokasi Ramai";
      assetUnitLabel = "Cabang Studio";
      baseAssetPrice = 80000000;
      sec1Name = "Dekorasi Interior Luxury, Cermin LED & Kursi Barber Hidrolik";
      baseSec1 = 65000000;
      sec2Name = "Alat Treatment Kecantikan / Clipper Set & Sterilizer";
      baseSec2 = 50000000;
      sec3Name = "Produk Pomade/Serum Skincare Awal & Izin Praktik";
      baseSec3 = 20000000;
      o1Name = "Konsumsi Produk Skincare, Hair Treatment & Steril Kit";
      baseO1 = 18000000;
      o2Name = "Gaji Pokok & Komisi Stylist/Kapster Berpengalaman";
      baseO2 = 22000000;
      o3Name = "Listrik AC Dingin Terus, Air Bersih & Internet";
      baseO3 = 6000000;
      o4Name = "TikTok Content Creator, Ads & Customer Loyalty";
      baseO4 = 9000000;
      baseAnnualRev = 1100000000;
    } else if (isLaundry) {
      sectorTag = "Jasa & Layanan: Modern Commercial Laundry";
      assetName = "Sewa Tempat Usaha Laundry Strategis Dekat Hunian";
      assetUnitLabel = "Outlet Laundry";
      baseAssetPrice = 50000000;
      sec1Name = "Renovasi Instalasi Pipa Air, Gas Boiler & Saluran Pembuangan";
      baseSec1 = 35000000;
      sec2Name = "Paket Mesin Cuci & Mesin Pengering Komersial Stack (4 Set)";
      baseSec2 = 95000000;
      sec3Name = "Detergen Ramah Lingkungan, Plastik Packing & Timbangan POS";
      baseSec3 = 15000000;
      o1Name = "Detergen Khusus, Softener, Plastik & Parfum Laundry";
      baseO1 = 14000000;
      o2Name = "Gaji Operator Cuci & Setrika Uap (3 Shift)";
      baseO2 = 14000000;
      o3Name = "Gas LPG Pengering, Listrik Mesin & Air PDAM/Sumur";
      baseO3 = 9000000;
      o4Name = "Promosi Antar-Jemput Gratis & Maintenance Mesin";
      baseO4 = 6000000;
      baseAnnualRev = 780000000;
    } else if (isCarWash) {
      sectorTag = "Otomotif: Cuci Mobil Hidrolik & Auto Detailing";
      assetName = "Sewa Lahan Luas & Bangunan Cuci Kendaraan (2 Thn)";
      assetUnitLabel = "Pusat Detailing";
      baseAssetPrice = 95000000;
      sec1Name = "Pengecoran Lantai Epoxy, Ruang Tunggu Ber-AC & Lampu LED Detailing";
      baseSec1 = 60000000;
      sec2Name = "Hidrolik Single Post (3 Unit), High Pressure Pump & Kompresor";
      baseSec2 = 85000000;
      sec3Name = "Shampoo Salju, Obat Coating/Poles & Alat Rotary";
      baseSec3 = 20000000;
      o1Name = "Chemical Sabun Snow Wash, Coating Ceramic & Lap Microfiber";
      baseO1 = 16000000;
      o2Name = "Gaji & Bagi Hasil Detailer/Cuci Mobil (6 Orang)";
      baseO2 = 25000000;
      o3Name = "Listrik Daya 16.500 VA, Air Tanah Dalam & Filter Air";
      baseO3 = 11000000;
      o4Name = "Promosi Keanggotaan Member & Maintenance Hidrolik";
      baseO4 = 8000000;
      baseAnnualRev = 1200000000;
    } else if (isClinic) {
      sectorTag = "Layanan Kesehatan: Klinik Pratama & Apotek Mandiri";
      assetName = "Sewa Ruko Fasilitas Medis Sesuai Standar Kemenkes";
      assetUnitLabel = "Klinik Medis";
      baseAssetPrice = 110000000;
      sec1Name = "Renovasi Ruang Periksa Medis, Apotek Farmasi & Ruang Tindakan";
      baseSec1 = 85000000;
      sec2Name = "Alat Diagnostik Medis, Bed Pasien, Sterilisator & Software Rekam Medis";
      baseSec2 = 90000000;
      sec3Name = "Stok Obat Awal dari PBF Resmi, SIP Dokter & Izin Klinik";
      baseSec3 = 55000000;
      o1Name = "Pengadaan Obat Etikal, OTC & Alat Habis Pakai Medis";
      baseO1 = 42000000;
      o2Name = "Jasa Medis Dokter, Gaji Perawat & Apoteker";
      baseO2 = 32000000;
      o3Name = "Listrik UPS Cadangan Medis, Pengelolaan Limbah Medis B3 & Air";
      baseO3 = 8500000;
      o4Name = "Kerjasama BPJS/Asuransi, Pemasaran & Pemeliharaan Alat";
      baseO4 = 9500000;
      baseAnnualRev = 1650000000;
    } else if (isAgroSme) {
      sectorTag = "Agribisnis & Peternakan / Perikanan Mandiri";
      assetName = "Sewa Lahan Produktif Kandang/Kolam Terisolasi";
      assetUnitLabel = "Unit Fasilitas";
      baseAssetPrice = 60000000;
      sec1Name = "Konstruksi Kandang Modern Closed-House / Kolam Bioflok";
      baseSec1 = 90000000;
      sec2Name = "Sistem Blower Otomatis, Tempat Pakan Otomatis & Pompa Aerasi";
      baseSec2 = 65000000;
      sec3Name = "Pembelian DOC/Bibit Unggul, Pakan Starter & Vitamin/Vaksin";
      baseSec3 = 45000000;
      o1Name = "Pakan Pokok Ternak/Ikan Konsentrat Berkualitas";
      baseO1 = 45000000;
      o2Name = "Gaji Operator Kandang & Petugas Kesehatan Hewan";
      baseO2 = 15000000;
      o3Name = "Listrik Genset Siaga, Air Bersih & Disinfektan";
      baseO3 = 7000000;
      o4Name = "Transportasi Distribusi Panen & Logistik Pasar";
      baseO4 = 8000000;
      baseAnnualRev = 1350000000;
    }

    // Apply seed variance to prices to make each project distinct
    const capexAssetPrice = Math.round((baseAssetPrice * variance) / 1000000) * 1000000;
    const capexSecondary1Amount = Math.round((baseSec1 * variance) / 1000000) * 1000000;
    const capexSecondary2Amount = Math.round((baseSec2 * variance) / 1000000) * 1000000;
    const capexSecondary3Amount = Math.round((baseSec3 * variance) / 1000000) * 1000000;

    const totalCapex = (capexAssetCount * capexAssetPrice) + capexSecondary1Amount + capexSecondary2Amount + capexSecondary3Amount;
    const annualDepreciation = Math.round(totalCapex * 0.12); // ~8 years straight line

    const opex1Amount = Math.round((baseO1 * variance) / 500000) * 500000;
    const opex2Amount = Math.round((baseO2 * variance) / 500000) * 500000;
    const opex3Amount = Math.round((baseO3 * variance) / 250000) * 250000;
    const opex4Amount = Math.round((baseO4 * variance) / 250000) * 250000;

    const totalMonthlyOpex = opex1Amount + opex2Amount + opex3Amount + opex4Amount;
    const totalAnnualOpex = totalMonthlyOpex * 12;

    const annualRevenuePerAsset = Math.round((baseAnnualRev * variance) / 10000000) * 10000000;
    const revenueY1 = annualRevenuePerAsset * capexAssetCount;
    const revenueY2 = Math.round(revenueY1 * 1.25);
    const revenueY3 = Math.round(revenueY1 * 1.55);

    const ebitdaY1 = Math.round(revenueY1 - totalAnnualOpex);
    const ebitdaY2 = Math.round(revenueY2 - (totalAnnualOpex * 1.15));
    const ebitdaY3 = Math.round(revenueY3 - (totalAnnualOpex * 1.30));

    const netProfitY1 = Math.round((ebitdaY1 - annualDepreciation) * 0.995); // 0.5% UMKM tax
    const netProfitY2 = Math.round((ebitdaY2 - annualDepreciation) * 0.995);
    const netProfitY3 = Math.round((ebitdaY3 - annualDepreciation) * 0.995);

    const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
    const paybackYears = avgNetProfit > 0 ? Number((totalCapex / avgNetProfit).toFixed(1)) : 1.2;
    const paybackMonths = Math.round(paybackYears * 12);
    const paybackText = `${paybackMonths} Bulan (~${paybackYears} Tahun)`;

    const roiPercentage = totalCapex > 0 ? Number(((avgNetProfit / totalCapex) * 100).toFixed(1)) : 45.0;
    const irrPercentage = Number((roiPercentage * 0.55).toFixed(1));

    const baseTam = Math.round((revenueY1 * (15 + (seed % 20))) / 1000000000) * 1000000000;
    const baseSam = Math.round((baseTam * 0.22) / 500000000) * 500000000;
    const baseSom = Math.round((revenueY1 * 1.2) / 100000000) * 100000000;

    return {
      archetype: "personal_sme",
      archetypeLabel: "Usaha Mandiri & UMKM",
      sectorTag,
      assetName,
      assetUnitLabel,
      capexAssetCount,
      capexAssetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 4,
      capexAssetPriceMin: Math.round(capexAssetPrice * 0.5),
      capexAssetPriceMax: Math.round(capexAssetPrice * 2.2),
      capexAssetPriceStep: 5000000,
      capexSecondary1Name: sec1Name,
      capexSecondary1Amount,
      capexSecondary2Name: sec2Name,
      capexSecondary2Amount,
      capexSecondary3Name: sec3Name,
      capexSecondary3Amount,
      totalCapex,
      annualDepreciation,

      opex1Name: o1Name,
      opex1Amount,
      opex1Min: Math.round(opex1Amount * 0.5),
      opex1Max: Math.round(opex1Amount * 2.5),
      opex1Step: 1000000,
      opex2Name: o2Name,
      opex2Amount,
      opex2Min: Math.round(opex2Amount * 0.5),
      opex2Max: Math.round(opex2Amount * 2.2),
      opex2Step: 1000000,
      opex3Name: o3Name,
      opex3Amount,
      opex3Min: Math.round(opex3Amount * 0.5),
      opex3Max: Math.round(opex3Amount * 2.5),
      opex3Step: 500000,
      opex4Name: o4Name,
      opex4Amount,
      totalMonthlyOpex,
      totalAnnualOpex,

      techOptimizationTitle: techTitle,
      techOptimizationDesc: techDesc,
      techSavingsPercentOpex1: techSave1,
      techSavingsPercentOpex3: techSave3,

      annualRevenuePerAsset,
      annualRevenuePerAssetMin: Math.round(annualRevenuePerAsset * 0.5),
      annualRevenuePerAssetMax: Math.round(annualRevenuePerAsset * 2.5),
      annualRevenuePerAssetStep: 20000000,
      revenueY1,
      revenueY2,
      revenueY3,
      ebitdaY1,
      ebitdaY2,
      ebitdaY3,
      netProfitY1,
      netProfitY2,
      netProfitY3,
      taxRate: 0.5,

      paybackYears,
      paybackText,
      roiPercentage,
      irrPercentage,
      bcrRatio: 1.48,

      tam: baseTam,
      sam: baseSam,
      som: baseSom,
      tamDesc: `Total belanja konsumen potensial untuk kategori ${sectorTag} di seluruh wilayah kota/kabupaten.`,
      samDesc: `Pangsa pasar terjangkau dalam radius 3 - 5 km dari lokasi gerai aktif usaha.`,
      somDesc: `Target penjualan nyata yang dapat dilayani oleh kapasitas operasional harian gerai.`
    };
  }

  // 2. MANUFACTURING & FACTORY ARCHETYPE
  if (archetype === "manufacturing") {
    const isFood = lower.includes("amdk") || lower.includes("air") || lower.includes("makanan") || lower.includes("pangan") || lower.includes("snack") || lower.includes("minuman");
    const isGarment = lower.includes("garmen") || lower.includes("konveksi") || lower.includes("tekstil") || lower.includes("pakaian") || lower.includes("baju");
    const isPlastic = lower.includes("plastik") || lower.includes("kemasan") || lower.includes("packaging") || lower.includes("botol");
    const isMetal = lower.includes("baja") || lower.includes("metal") || lower.includes("logam") || lower.includes("fabrikasi") || lower.includes("bubut") || lower.includes("perakitan");
    const isFurniture = lower.includes("kayu") || lower.includes("furniture") || lower.includes("mebel") || lower.includes("rotan");

    let sectorTag = "Industri Manufaktur & Fabrikasi";
    let assetName = "Mesin Produksi Utama & Lini Perakitan Otomatis";
    let assetUnitLabel = "Lini Produksi";
    let capexAssetCount = 3 + (seed % 3); // 3 to 5
    let baseAssetPrice = 850000000;
    let sec1Name = "Infrastruktur Utilitas Listrik Industri (PLN I-3) & Genset Heavy-Duty";
    let baseSec1 = 520000000;
    let sec2Name = "Pembangunan Bangunan Pabrik, Gudang Racking & IUI OSS";
    let baseSec2 = 680000000;
    let sec3Name = "Sertifikasi Standar Mutu SNI/ISO, Kalibrasi & Lisensi Lingkungan";
    let baseSec3 = 180000000;

    let o1Name = "Bahan Baku Pokok & Bahan Penolong Produksi Pabrik";
    let baseO1 = 165000000;
    let o2Name = "Gaji Tim Operator Mesin, Teknisi, QC & Supervisi Pabrik";
    let baseO2 = 82000000;
    let o3Name = "Energi Listrik Pabrik, Air Industri & Bahan Bakar Boiler";
    let baseO3 = 42000000;
    let o4Name = "Pemeliharaan Mesin Berkala, Sparepart & Overhead Pabrik";
    let baseO4 = 28000000;

    let baseAnnualRevPerUnit = 1450000000;
    let techTitle = "AUTOMATION & PREDICTIVE MAINTENANCE IoT";
    let techDesc = "Sensor vibrasi mesin dan SCADA IoT memangkas downtime pabrik 25% dan efisiensi konsumsi daya 15%.";

    if (isFood) {
      sectorTag = "Industri Olahan Pangan & Air Minum Dalam Kemasan (AMDK)";
      assetName = "Lini Mesin Pemurnian, Water Treatment & Filling Packaging Otomatis";
      assetUnitLabel = "Lini Filling";
      baseAssetPrice = 920000000;
      sec1Name = "Sistem Water Treatment RO, Ozonisasi, UV Sterilizer & Cleanroom";
      baseSec1 = 580000000;
      sec2Name = "Bangunan Pabrik Higienis, Gudang Pallet Galon/Kardus & Izin BPOM";
      baseSec2 = 720000000;
      sec3Name = "Sertifikasi SNI Air Mineral, Halal MUI & Uji Laboratorium Rutin";
      baseSec3 = 190000000;
      o1Name = "Preform Botol, Tutup Galon, Kardus & Karton Kemasan";
      baseO1 = 175000000;
      o2Name = "Gaji Operator Lini Botol, Analis Lab Kimia/Mikro & Logistik";
      baseO2 = 78000000;
      o3Name = "Listrik Industri, Pengolahan Limbah Cair (IPAL) & Air Baku";
      baseO3 = 39000000;
      o4Name = "Sanitasi Berkala (CIP), Sparepart Mesin Blower & Overhead";
      baseO4 = 26000000;
      baseAnnualRevPerUnit = 1580000000;
    } else if (isGarment) {
      sectorTag = "Industri Tekstil, Garmen & Konveksi Ekspor";
      assetName = "Lini Mesin Jahit Komputer Otomatis, Pemotong Kain CNC & Embroidery";
      assetUnitLabel = "Lini Sewing";
      baseAssetPrice = 480000000;
      capexAssetCount = 4 + (seed % 4); // 4 to 7 lines
      sec1Name = "Instalasi Jalur Kelistrikan Pabrik Garmen, Meja Potong & Setrika Uap Boiler";
      baseSec1 = 380000000;
      sec2Name = "Fasilitas Bangunan Bengkel Jahit, Gudang Kain & Showroom Sampel";
      baseSec2 = 520000000;
      sec3Name = "Audit Kepatuhan Sosial Buyer (WRAP/BSCI), K3 & Perizinan Ekspor";
      baseSec3 = 140000000;
      o1Name = "Kain Tekstil Katun/Polyester, Benang, Kancing, Resleting & Aksesori";
      baseO1 = 190000000;
      o2Name = "Gaji Operator Jahit (Sewing), Tukang Pola (Pattern Maker) & QC Finish";
      baseO2 = 110000000;
      o3Name = "Listrik Mesin Jahit, Gas Boiler Setrika Uap & Penerangan";
      baseO3 = 32000000;
      o4Name = "Jarum, Sparepart Mesin Jahit, Kemasan Polybag & Pengiriman";
      baseO4 = 24000000;
      baseAnnualRevPerUnit = 1120000000;
    } else if (isMetal) {
      sectorTag = "Industri Fabrikasi Logam, Baja & Mesin Bubut CNC";
      assetName = "Mesin Laser Fiber Cutting, Mesin Bending CNC & Bubut Bubut Presisi";
      assetUnitLabel = "Pusat Pemesinan";
      baseAssetPrice = 1150000000;
      capexAssetCount = 2 + (seed % 3); // 2 to 4
      sec1Name = "Substasi Daya Listrik Kapasitas Tinggi, Crane Overhead 5 Ton & Gas Cutting";
      baseSec1 = 640000000;
      sec2Name = "Bangunan Workshop Fabrikasi Baja, Pondasi Mesin Berat & Yard Fabrikasi";
      baseSec2 = 780000000;
      sec3Name = "Sertifikasi Welder WPS/PQR, Standar ASME/AWS & Kalibrasi Alat Ukur";
      baseSec3 = 160000000;
      o1Name = "Pelat Baja, Pipa Hollow, Kawat Las CO2 & Gas Argon/Oksigen";
      baseO1 = 210000000;
      o2Name = "Gaji Welder 6G Bersertifikat, Operator CNC, Drafter CAD & Fitter";
      baseO2 = 95000000;
      o3Name = "Listrik Industri Beban Tinggi, Solar Genset & Pelumas Mesin";
      baseO3 = 54000000;
      o4Name = "Mata Pisau/Cutting Tool, Pemeliharaan Mesin Presisi & Logistik";
      baseO4 = 34000000;
      baseAnnualRevPerUnit = 2100000000;
    }

    const capexAssetPrice = Math.round((baseAssetPrice * variance) / 10000000) * 10000000;
    const capexSecondary1Amount = Math.round((baseSec1 * variance) / 10000000) * 10000000;
    const capexSecondary2Amount = Math.round((baseSec2 * variance) / 10000000) * 10000000;
    const capexSecondary3Amount = Math.round((baseSec3 * variance) / 10000000) * 10000000;

    const totalCapex = (capexAssetCount * capexAssetPrice) + capexSecondary1Amount + capexSecondary2Amount + capexSecondary3Amount;
    const annualDepreciation = Math.round(totalCapex * 0.10); // 10 years

    const opex1Amount = Math.round((baseO1 * variance) / 1000000) * 1000000;
    const opex2Amount = Math.round((baseO2 * variance) / 1000000) * 1000000;
    const opex3Amount = Math.round((baseO3 * variance) / 1000000) * 1000000;
    const opex4Amount = Math.round((baseO4 * variance) / 1000000) * 1000000;

    const totalMonthlyOpex = opex1Amount + opex2Amount + opex3Amount + opex4Amount;
    const totalAnnualOpex = totalMonthlyOpex * 12;

    const annualRevenuePerAsset = Math.round((baseAnnualRevPerUnit * variance) / 10000000) * 10000000;
    const revenueY1 = annualRevenuePerAsset * capexAssetCount;
    const revenueY2 = Math.round(revenueY1 * 1.22);
    const revenueY3 = Math.round(revenueY1 * 1.48);

    const ebitdaY1 = Math.round(revenueY1 - totalAnnualOpex);
    const ebitdaY2 = Math.round(revenueY2 - (totalAnnualOpex * 1.12));
    const ebitdaY3 = Math.round(revenueY3 - (totalAnnualOpex * 1.25));

    const netProfitY1 = Math.round((ebitdaY1 - annualDepreciation) * 0.89); // 11% corporate tax rate
    const netProfitY2 = Math.round((ebitdaY2 - annualDepreciation) * 0.89);
    const netProfitY3 = Math.round((ebitdaY3 - annualDepreciation) * 0.89);

    const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
    const paybackYears = avgNetProfit > 0 ? Number((totalCapex / avgNetProfit).toFixed(1)) : 2.4;
    const paybackText = `${paybackYears} Tahun`;

    const roiPercentage = totalCapex > 0 ? Number(((avgNetProfit / totalCapex) * 100).toFixed(1)) : 32.5;
    const irrPercentage = Number((roiPercentage * 0.72).toFixed(1));

    const baseTam = Math.round((revenueY1 * (40 + (seed % 40))) / 10000000000) * 10000000000;
    const baseSam = Math.round((baseTam * 0.16) / 1000000000) * 1000000000;
    const baseSom = Math.round((revenueY1 * 1.4) / 100000000) * 100000000;

    return {
      archetype: "manufacturing",
      archetypeLabel: "Manufaktur & Pabrikasi",
      sectorTag,
      assetName,
      assetUnitLabel,
      capexAssetCount,
      capexAssetPrice,
      capexAssetCountMin: 1,
      capexAssetCountMax: 8,
      capexAssetPriceMin: Math.round(capexAssetPrice * 0.5),
      capexAssetPriceMax: Math.round(capexAssetPrice * 2.0),
      capexAssetPriceStep: 50000000,
      capexSecondary1Name: sec1Name,
      capexSecondary1Amount,
      capexSecondary2Name: sec2Name,
      capexSecondary2Amount,
      capexSecondary3Name: sec3Name,
      capexSecondary3Amount,
      totalCapex,
      annualDepreciation,

      opex1Name: o1Name,
      opex1Amount,
      opex1Min: Math.round(opex1Amount * 0.5),
      opex1Max: Math.round(opex1Amount * 2.0),
      opex1Step: 5000000,
      opex2Name: o2Name,
      opex2Amount,
      opex2Min: Math.round(opex2Amount * 0.5),
      opex2Max: Math.round(opex2Amount * 2.0),
      opex2Step: 2000000,
      opex3Name: o3Name,
      opex3Amount,
      opex3Min: Math.round(opex3Amount * 0.5),
      opex3Max: Math.round(opex3Amount * 2.0),
      opex3Step: 1000000,
      opex4Name: o4Name,
      opex4Amount,
      totalMonthlyOpex,
      totalAnnualOpex,

      techOptimizationTitle: techTitle,
      techOptimizationDesc: techDesc,
      techSavingsPercentOpex1: 8,
      techSavingsPercentOpex3: 15,

      annualRevenuePerAsset,
      annualRevenuePerAssetMin: Math.round(annualRevenuePerAsset * 0.5),
      annualRevenuePerAssetMax: Math.round(annualRevenuePerAsset * 2.2),
      annualRevenuePerAssetStep: 50000000,
      revenueY1,
      revenueY2,
      revenueY3,
      ebitdaY1,
      ebitdaY2,
      ebitdaY3,
      netProfitY1,
      netProfitY2,
      netProfitY3,
      taxRate: 11,

      paybackYears,
      paybackText,
      roiPercentage,
      irrPercentage,
      bcrRatio: 1.35,

      tam: baseTam,
      sam: baseSam,
      som: baseSom,
      tamDesc: `Total serapan kebutuhan produk sejenis oleh distributor dan industri di wilayah target.`,
      samDesc: `Porsi pasar yang secara spesifikasi mutu dan logistik dapat dilayani fasilitas produksi pabrik.`,
      somDesc: `Target kuota volume kontrak pasokan yang telah diamankan dalam pipeline pemesanan (PO).`
    };
  }

  // 3. TRANSPORTATION & FLEET LOGISTICS ARCHETYPE
  const isCoal = lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("batu bara");
  const isNickel = lower.includes("nikel") || lower.includes("nickel") || lower.includes("ore") || lower.includes("smelter");
  const isColdChain = lower.includes("dingin") || lower.includes("cold") || lower.includes("reefer") || lower.includes("pendingin") || lower.includes("vaksin") || lower.includes("farmasi");
  const isForestry = lower.includes("forestry") || lower.includes("kayu") || lower.includes("timber") || lower.includes("logging") || lower.includes("hutan");
  const isCement = lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("beton");
  const isCpo = lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil");
  const isWaste = lower.includes("waste") || lower.includes("limbah") || lower.includes("b3") || lower.includes("sampah");
  const isContainer = lower.includes("kontainer") || lower.includes("container") || lower.includes("inland") || lower.includes("depo");
  const isEv = lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai");

  let sectorTag = "Supply Chain & Fleet Logistics";
  let assetName = "Armada Truk Tronton Wingbox Logistik Spesifikasi Euro 4";
  let assetUnitLabel = "Unit Armada Truk";
  let capexAssetCount = 4 + (seed % 4); // 4 to 7 units
  let baseAssetPrice = 750000000;
  let sec1Name = "Infrastruktur IT, GPS Dual-Band Telematika & IoT Control Tower";
  let baseSec1 = 340000000;
  let sec2Name = "Setup Fasilitas Depo Pool, Bengkel Mandiri & Perizinan Trayek Dishub";
  let baseSec2 = 420000000;
  let sec3Name = "Asuransi All-Risk Armada Perdana, K3 & Sertifikasi Pengangkutan";
  let baseSec3 = 120000000;

  let o1Name = "Bahan Bakar Minyak (BBM Solar Industri) Seluruh Armada";
  let baseO1 = 145000000;
  let o2Name = "Gaji Driver Profesional, Co-Driver & Tunjangan Operasi Jalan";
  let baseO2 = 76000000;
  let o3Name = "Pemeliharaan Preventif, Suku Cadang Mesin & Ban Sasis";
  let baseO3 = 34000000;
  let o4Name = "Biaya Tol Trans-Jawa/Sumatera, Retribusi & Overhead Depo";
  let baseO4 = 25000000;

  let baseAnnualRevPerUnit = 980000000;
  let techTitle = "SISTEM TELEMATIKA FMS & PREDICTIVE ROUTING";
  let techDesc = "Sistem rute cerdas dan pemantau idle-engine menghemat BBM 15% serta memperpanjang usia pakai ban 10%.";

  if (isCoal || isNickel) {
    sectorTag = isCoal ? "Mining Heavy Hauling: Batubara Tambang" : "Mineral Hauling: Nikel & Smelter Industri";
    assetName = "Heavy Duty Dump Truck 10-Roda (6x4) Spesifikasi Off-Road Tambang";
    assetUnitLabel = "Unit Tipper Truck";
    baseAssetPrice = 880000000;
    capexAssetCount = 5 + (seed % 4); // 5 to 8
    sec1Name = "Sistem Dispatch FMS Tambang, Sensor Muatan & Fatigue Monitor";
    baseSec1 = 410000000;
    sec2Name = "Workshop Lapangan, Fasilitas Tire Change & Izin Khusus Jalan Tambang";
    baseSec2 = 530000000;
    sec3Name = "Sertifikasi K3 Pertambangan (POP), Lisensi ODOL & Safety Kit Tambang";
    baseSec3 = 160000000;
    o1Name = "BBM Solar Industri Non-Subsidi untuk Operasi 24 Jam";
    baseO1 = 210000000;
    o2Name = "Gaji Supir Hauling 2-Shift, Mekanik Alat Berat & Safety Officer";
    baseO2 = 95000000;
    o3Name = "Ban Radial Off-Road Tapak Kasar, Pelumas Heavy-Duty & Filter";
    baseO3 = 58000000;
    o4Name = "Overhead Basecamp Tambang, Water Truck Penyiram Debu & Retribusi";
    baseO4 = 32000000;
    baseAnnualRevPerUnit = 1180000000;
  } else if (isColdChain) {
    sectorTag = "Cold Chain & Temperature Controlled Logistics";
    assetName = "Armada Reefer Box Truck Berpendingin Suhu Terkontrol ThermoKing";
    assetUnitLabel = "Unit Reefer Box";
    baseAssetPrice = 820000000;
    capexAssetCount = 4 + (seed % 3); // 4 to 6
    sec1Name = "Sensor Pemantau Suhu Cloud IoT Real-time & GPS Fleet Tracker";
    baseSec1 = 360000000;
    sec2Name = "Fasilitas Depo Cold Storage Buffer, Plug-in Chiller & Izin CDOB BPOM";
    baseSec2 = 460000000;
    sec3Name = "Validasi Termal Boks Pendingin, Sertifikasi Halal & Asuransi Kargo Suhu";
    baseSec3 = 140000000;
    o1Name = "BBM Solar Mesin Truk & Bahan Bakar Genset Pendingin ThermoKing";
    baseO1 = 155000000;
    o2Name = "Gaji Driver Terlatih Rantai Dingin, Teknisi Chiller & Tim Dispatch";
    baseO2 = 78000000;
    o3Name = "Perawatan Kompresor Pendingin, Refrigerant Freon & Servis Berkala";
    baseO3 = 36000000;
    o4Name = "Biaya Tol, Asuransi Kargo Rusak/Basi & Overhead Depo Dingin";
    baseO4 = 28000000;
    baseAnnualRevPerUnit = 1060000000;
    techTitle = "IOT THERMO-CLOUD & REAL-TIME TEMPERATURE MONITORING";
    techDesc = "Peringatan anomali suhu otomatis via IoT mencegah gagal pendinginan (0% spoilage risk) dan efisiensi genset 12%.";
  } else if (isForestry) {
    sectorTag = "Forestry & Bulk Timber Log Hauling";
    assetName = "Armada Truk Log Hauling & Timber Carrier Kehutanan Off-Road";
    assetUnitLabel = "Unit Truk Logging";
    baseAssetPrice = 790000000;
    capexAssetCount = 5 + (seed % 3);
    sec1Name = "GPS Satelit Blankspot Tracker, Timbangan Gandar Portable & SKSHAK";
    baseSec1 = 320000000;
    sec2Name = "Bengkel Depo Hutan Konsesi HTI, Fasilitas Log Yard & Tangki Solar";
    baseSec2 = 440000000;
    sec3Name = "Legalitas SVLK Kehutanan, Sertifikasi K3 & Izin Muatan Kayu Bulat";
    baseSec3 = 130000000;
    o1Name = "Solar Industri Khusus Operasional Hutan & Jalur Hauling Tanah";
    baseO1 = 160000000;
    o2Name = "Gaji Supir Logging Medan Berat, Rigger Muatan & Mandor Jalur";
    baseO2 = 82000000;
    o3Name = "Penggantian Ban Logging Kasar, Rantai Baja Pengikat & Suku Cadang";
    baseO3 = 45000000;
    o4Name = "Pemeliharaan Jalan Logging, Grader, Pungutan Retribusi & Overhead";
    baseO4 = 26000000;
    baseAnnualRevPerUnit = 1020000000;
  } else if (isWaste) {
    sectorTag = "Hazardous Waste Management & B3 Transportation";
    assetName = "Truk Vacuum Sludge & Boks Lapis Baja Kedap Limbah B3 Berizin KLHK";
    assetUnitLabel = "Unit Truk B3";
    baseAssetPrice = 860000000;
    capexAssetCount = 3 + (seed % 3);
    sec1Name = "Integrasi Festronik KLHK, Sensor Kebocoran Kimia IoT & GPS Anti-Deviasi";
    baseSec1 = 380000000;
    sec2Name = "Fasilitas TPS Limbah Sementara, Perlengkapan Spill Kit & Kolam Dekontaminasi";
    baseSec2 = 490000000;
    sec3Name = "Izin Pengangkutan B3 Kemenhub/KLHK, Rekomendasi Teknis & Asuransi Lingkungan";
    baseSec3 = 210000000;
    o1Name = "BBM Solar Khusus Rute Limbah & Insentif Keselamatan Driver";
    baseO1 = 135000000;
    o2Name = "Gaji Driver Bersertifikat B2 Umum Kimia, Tim Emergency & Pengawas K3";
    baseO2 = 84000000;
    o3Name = "Uji Berkala Tangki Vacuum, Kalibrasi Manometer & Netralisir Bahan Kimia";
    baseO3 = 38000000;
    o4Name = "Biaya Audit Lingkungan, Pengelolaan Dokumen Festronik & Asuransi B3";
    baseO4 = 30000000;
    baseAnnualRevPerUnit = 1150000000;
  } else if (isContainer) {
    sectorTag = "Container Inland Freight & Intermodal Hub";
    assetName = "Truk Prime Mover Head Tractor & Sasis Rangka Petikemas 20/40 Ft";
    assetUnitLabel = "Unit Prime Mover";
    baseAssetPrice = 780000000;
    capexAssetCount = 5 + (seed % 4);
    sec1Name = "Terminal Operating System (TOS) Depo, Smart Gate RFID & e-Seal";
    baseSec1 = 350000000;
    sec2Name = "Fasilitas Lapangan Penumpukan Kontainer, Bengkel Sasis & Izin Depo";
    baseSec2 = 480000000;
    sec3Name = "Izin SIUJPT, Sertifikasi Kelayakan Sasis Kontainer & Asuransi Kargo";
    baseSec3 = 130000000;
    o1Name = "BBM Solar Armada Shuttle Koridor Pelabuhan-Depo Darat";
    baseO1 = 165000000;
    o2Name = "Gaji Driver Berlisensi Kontainer (TID), Checker Gate & Operator Depo";
    baseO2 = 80000000;
    o3Name = "Servis Prime Mover, Ban Gandar Sasis & Sistem Rem Pneumatik";
    baseO3 = 39000000;
    o4Name = "Tarif Bongkar Muat (LOLO), Biaya Tol Pelabuhan & Manajemen Depo";
    baseO4 = 35000000;
    baseAnnualRevPerUnit = 1040000000;
  } else if (isCpo) {
    sectorTag = "Crude Palm Oil (CPO) Tanker & Agro Bulk Transport";
    assetName = "Armada Tangki CPO Stainless Steel Food Grade Berinsulasi";
    assetUnitLabel = "Unit Tangki CPO";
    baseAssetPrice = 840000000;
    capexAssetCount = 4 + (seed % 4);
    sec1Name = "Sensor Level Fluida Ultrasonik, GPS Anti-Tumpah & e-Seal Katup Tangki";
    baseSec1 = 330000000;
    sec2Name = "Fasilitas Tank Cleaning Otomatis (Steam Jet), Depo Pool & Izin Dishub";
    baseSec2 = 450000000;
    sec3Name = "Sertifikasi ISPO/RSPO Transport, Kalibrasi Tera Metrologi & Asuransi Mutu";
    baseSec3 = 140000000;
    o1Name = "BBM Solar Rute Pabrik Kelapa Sawit (PKS) ke Bulking Refinery";
    baseO1 = 158000000;
    o2Name = "Gaji Supir Tangki Cairan Berat, Operator Pompa Transfer & QC Asam Lemak";
    baseO2 = 79000000;
    o3Name = "Pembersihan Steam Tangki, Suku Cadang Katup & Ban Tangki Gandar";
    baseO3 = 37000000;
    o4Name = "Biaya Retribusi Lintasan Kebun, Tol & Manajemen Depo Tangki";
    baseO4 = 27000000;
    baseAnnualRevPerUnit = 1080000000;
  }

  const capexAssetPrice = Math.round((baseAssetPrice * variance) / 10000000) * 10000000;
  const capexSecondary1Amount = Math.round((baseSec1 * variance) / 10000000) * 10000000;
  const capexSecondary2Amount = Math.round((baseSec2 * variance) / 10000000) * 10000000;
  const capexSecondary3Amount = Math.round((baseSec3 * variance) / 10000000) * 10000000;

  const totalCapex = (capexAssetCount * capexAssetPrice) + capexSecondary1Amount + capexSecondary2Amount + capexSecondary3Amount;
  const annualDepreciation = Math.round(totalCapex * 0.10); // 10% per year

  const opex1Amount = Math.round((baseO1 * variance) / 1000000) * 1000000;
  const opex2Amount = Math.round((baseO2 * variance) / 1000000) * 1000000;
  const opex3Amount = Math.round((baseO3 * variance) / 1000000) * 1000000;
  const opex4Amount = Math.round((baseO4 * variance) / 1000000) * 1000000;

  const totalMonthlyOpex = opex1Amount + opex2Amount + opex3Amount + opex4Amount;
  const totalAnnualOpex = totalMonthlyOpex * 12;

  const annualRevenuePerAsset = Math.round((baseAnnualRevPerUnit * variance) / 10000000) * 10000000;
  const revenueY1 = annualRevenuePerAsset * capexAssetCount;
  const revenueY2 = Math.round(revenueY1 * 1.22);
  const revenueY3 = Math.round(revenueY1 * 1.48);

  const ebitdaY1 = Math.round(revenueY1 - totalAnnualOpex);
  const ebitdaY2 = Math.round(revenueY2 - (totalAnnualOpex * 1.14));
  const ebitdaY3 = Math.round(revenueY3 - (totalAnnualOpex * 1.28));

  const netProfitY1 = Math.round((ebitdaY1 - annualDepreciation) * 0.89);
  const netProfitY2 = Math.round((ebitdaY2 - annualDepreciation) * 0.89);
  const netProfitY3 = Math.round((ebitdaY3 - annualDepreciation) * 0.89);

  const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
  const paybackYears = avgNetProfit > 0 ? Number((totalCapex / avgNetProfit).toFixed(1)) : 2.2;
  const paybackText = `${paybackYears} - ${(paybackYears + 0.4).toFixed(1)} Tahun`;

  const roiPercentage = totalCapex > 0 ? Number(((avgNetProfit / totalCapex) * 100).toFixed(1)) : 33.5;
  const irrPercentage = Number((roiPercentage * 0.74).toFixed(1));

  const baseTam = Math.round((revenueY1 * (45 + (seed % 35))) / 10000000000) * 10000000000;
  const baseSam = Math.round((baseTam * 0.15) / 1000000000) * 1000000000;
  const baseSom = Math.round((revenueY1 * 1.35) / 100000000) * 100000000;

  return {
    archetype: "transport",
    archetypeLabel: "Logistik & Transportasi",
    sectorTag,
    assetName,
    assetUnitLabel,
    capexAssetCount,
    capexAssetPrice,
    capexAssetCountMin: 2,
    capexAssetCountMax: 12,
    capexAssetPriceMin: Math.round(capexAssetPrice * 0.5),
    capexAssetPriceMax: Math.round(capexAssetPrice * 2.0),
    capexAssetPriceStep: 25000000,
    capexSecondary1Name: sec1Name,
    capexSecondary1Amount,
    capexSecondary2Name: sec2Name,
    capexSecondary2Amount,
    capexSecondary3Name: sec3Name,
    capexSecondary3Amount,
    totalCapex,
    annualDepreciation,

    opex1Name: o1Name,
    opex1Amount,
    opex1Min: Math.round(opex1Amount * 0.5),
    opex1Max: Math.round(opex1Amount * 2.0),
    opex1Step: 5000000,
    opex2Name: o2Name,
    opex2Amount,
    opex2Min: Math.round(opex2Amount * 0.5),
    opex2Max: Math.round(opex2Amount * 2.0),
    opex2Step: 2000000,
    opex3Name: o3Name,
    opex3Amount,
    opex3Min: Math.round(opex3Amount * 0.5),
    opex3Max: Math.round(opex3Amount * 2.0),
    opex3Step: 1000000,
    opex4Name: o4Name,
    opex4Amount,
    totalMonthlyOpex,
    totalAnnualOpex,

    techOptimizationTitle: techTitle,
    techOptimizationDesc: techDesc,
    techSavingsPercentOpex1: 15,
    techSavingsPercentOpex3: 10,

    annualRevenuePerAsset,
    annualRevenuePerAssetMin: Math.round(annualRevenuePerAsset * 0.5),
    annualRevenuePerAssetMax: Math.round(annualRevenuePerAsset * 2.2),
    annualRevenuePerAssetStep: 20000000,
    revenueY1,
    revenueY2,
    revenueY3,
    ebitdaY1,
    ebitdaY2,
    ebitdaY3,
    netProfitY1,
    netProfitY2,
    netProfitY3,
    taxRate: 11,

    paybackYears,
    paybackText,
    roiPercentage,
    irrPercentage,
    bcrRatio: 1.38,

    tam: baseTam,
    sam: baseSam,
    som: baseSom,
    tamDesc: `Total potensi belanja jasa transportasi & logistik muatan industri di seluruh koridor target.`,
    samDesc: `Pangsa pasar logistik yang sesuai dengan spesifikasi tonase armada dan izin trayek rute operasi.`,
    somDesc: `Target volume kontrak muatan yang telah diamankan dalam pipeline pemesanan (PO).`
  };
}
