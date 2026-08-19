/**
 * Sector & Market Opportunity Helper
 * Dynamically provides tailored Market Opportunity Deep-Dive data and chat responses
 * synchronized with any project title or sector context.
 */

export interface OpportunityItem {
  id: string;
  code: string;
  tag: string;
  title: string;
  description: string;
}

export interface TruckItem {
  id: string;
  name: string;
  speed: number;
  signal: string;
  status: string;
}

export interface SectorOpportunityProfile {
  sectorName: string;
  sectorBadge: string;
  estimatorSlider2Label: string;
  estimatorTariffLabel: string;
  estimatorDisclaimer: string;
  
  driversTitle: string;
  driversSubtitle: string;
  driversList: OpportunityItem[];

  gapsTitle: string;
  gapsSubtitle: string;
  gapsList: OpportunityItem[];

  techTitle: string;
  techSubtitle: string;
  axleSimulatorTitle: string;
  axleSimulatorSubtitle: string;
  cargoWeightLabel: string;
  axleOptions: Array<{ value: number; label: string }>;
  
  pingTitle: string;
  pingSubtitle: string;
  pingTrucks: TruckItem[];
  pingSuccessMsg: string;

  greenTitle: string;
  greenSubtitle: string;
  greenList: OpportunityItem[];

  customOpPlaceholder: string;
}

export function getSectorOpportunityProfile(projectTitle: string): SectorOpportunityProfile {
  const titleLower = (projectTitle || "").toLowerCase();

  // 1. WASTE / LIMBAH / B3 / CIRCULAR / SAMPAH / RECYCLE
  if (
    titleLower.includes("limbah") ||
    titleLower.includes("waste") ||
    titleLower.includes("b3") ||
    titleLower.includes("sampah") ||
    titleLower.includes("recycle") ||
    titleLower.includes("daur ulang") ||
    titleLower.includes("lingkungan")
  ) {
    return {
      sectorName: "Pengolahan Limbah & B3 (Waste Management)",
      sectorBadge: "PRAMA LOGISTICS ENGINE • WASTE & B3",
      estimatorSlider2Label: "Premium Rate Kepatuhan Festronik & B3 (KLHK)",
      estimatorTariffLabel: "Tarif Dasar Hauling & Transportasi Limbah B3 (IDR / Ton / KM)",
      estimatorDisclaimer: "Perhitungan di atas menggunakan model estimasi logistik pengolahan limbah & B3 terintegrasi Pancaran Group.",

      driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
      driversSubtitle: `Kekuatan regulasi KLHK dan komitmen ESG industri yang mendorong kebutuhan pengangkutan limbah B3 & sampah terolah di "${projectTitle || "Proyek Limbah"}".`,
      driversList: [
        {
          id: "drv-1",
          code: "DRV-01 • REGULASI KLHK",
          tag: "KLHK COMPLIANCE",
          title: "Pengolahan Limbah B3 Terverifikasi",
          description: "Pabrik dan fasilitas kesehatan wajib bermitra dengan operator berizin Festronik resmi untuk menjamin kepatuhan audit K3LL dan audit lingkungan."
        },
        {
          id: "drv-2",
          code: "DRV-02 • CIRCULAR ECONOMY",
          tag: "RECYCLING SUPPLY",
          title: "Sirkularitas Daur Ulang Material",
          description: "Peningkatan tren daur ulang plastik, logam, dan minyak sintetis membutuhkan armada kontainer tertutup anti-bocor berstandar ekspor."
        },
        {
          id: "drv-3",
          code: "DRV-03 • ENERGY TRANSITION",
          tag: "WASTE-TO-ENERGY",
          title: "Biomassa Refuse Derived Fuel (RDF)",
          description: "Pabrik semen dan pembangkit listrik meluncurkan program substitusi RDF dari sampah terolah berkapasitas ratusan ton harian."
        }
      ],

      gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
      gapsSubtitle: "Identifikasi kebutuhan kritis penghasil limbah B3 yang gagal dipenuhi oleh perusahaan transportasi konvensional.",
      gapsList: [
        {
          id: "gap-1",
          code: "GAP-01 • ACCESSIBILITY",
          tag: "LICENSED FLEET",
          title: "Lisensi Khusus Armada B3 & Tangki",
          description: "Kelangkaan operator berizin resmi KLHK & Dishub yang siap beroperasi lintas provinsi dengan kompartemen tangki khusus B3."
        },
        {
          id: "gap-2",
          code: "GAP-02 • TRACEABILITY",
          tag: "E-MANIFEST",
          title: "Lacak Balik E-Manifest Festronik Real-Time",
          description: "Penghasil limbah membutuhkan kepastian pelacakan digital dari lokasi pengumpulan awal hingga fasilitas pemusnahan/daur ulang."
        },
        {
          id: "gap-3",
          code: "GAP-03 • HSE COMPLIANCE",
          tag: "SAFETY PROTOCOL",
          title: "Kepatuhan Tanggap Darurat Spill-Kit",
          description: "Pabrik MNC menuntut pengemudi bersertifikat penanganan bahan berbahaya serta perlengkapan tanggap darurat tumpahan lengkap."
        }
      ],

      techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
      techSubtitle: "Penerapan sensor IoT dan telemetri satelit untuk menjamin keamanan pengangkutan limbah B3 secara real-time.",
      axleSimulatorTitle: "Interactive IoT Waste Volume & Weight Simulator",
      axleSimulatorSubtitle: "Simulasikan pemantauan kapasitas muatan limbah B3 guna mencegah kebocoran dan denda tonase.",
      cargoWeightLabel: "Total Muatan Limbah / B3 (Ton)",
      axleOptions: [
        { value: 2, label: "2-As (Engkel Box / Compactor 8T)" },
        { value: 3, label: "3-As (Tronton Tangki B3 / Compactor 20T)" },
        { value: 4, label: "4-As (Trailer Semi-Heavy B3 32T)" },
        { value: 5, label: "5-As (Multi-Axle Waste Carrier 45T)" }
      ],

      pingTitle: "Satellite-Hybrid Waste Fleet Ping Hub",
      pingSubtitle: "Memantau armada tangki B3 dan pengangkut RDF secara langsung dengan GPS satelit hibrida.",
      pingTrucks: [
        { id: "TRK-08", name: "Volvo FMX 400 - B3 Tanker Rig", speed: 32, signal: "Satelit 98%", status: "Hauling Limbah B3 ke Pengolah" },
        { id: "TRK-14", name: "Scania P360 - RDF Waste Compactor", speed: 45, signal: "Seluler 4G", status: "Perjalanan ke Kiln Plant" },
        { id: "TRK-21", name: "Mercedes Actros - E-Manifest Carrier", speed: 0, signal: "Satelit 95%", status: "Bongkar di TPS3R / Facility" }
      ],
      pingSuccessMsg: "✓ Seluruh armada angkutan limbah B3 berhasil di-ping via koneksi satelit Prama Telematics Hub.",

      greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
      greenSubtitle: "Monetisasi sertifikasi lingkungan dan reduksi emisi metana dari pengolahan limbah.",
      greenList: [
        {
          id: "grn-1",
          code: "GRN-01 • CARBON CREDITS",
          tag: "METHANE REDUCTION",
          title: "Kredit Karbon Reduksi Metana",
          description: "Potensi monetisasi atas pengurangan emisi gas metana melalui logistik terstruktur untuk pasar karbon domestik (IDXCarbon)."
        },
        {
          id: "grn-2",
          code: "GRN-02 • ZERO WASTE",
          tag: "ZWTL CERTIFICATE",
          title: "Sertifikasi Zero Waste to Landfill",
          description: "Insentif finansial hijau dari klien korporat yang menerapkan target bebas pembuangan sampah ke TPA."
        },
        {
          id: "grn-3",
          code: "GRN-03 • BIOFUEL FLEET",
          tag: "EV & B35 FLEET",
          title: "Armada Rendah Emisi B35 / EV",
          description: "Penggunaan armada beremisi rendah untuk pengangkutan limbah perkotaan dan fasilitas pengolahan modern."
        }
      ],
      customOpPlaceholder: "e.g. Sinergi Rute Hauling B3 Lintas Kawasan Industri"
    };
  }

  // 2. MINING / PERTAMBANGAN / NIKEL / BATUBARA / MINERAL / SMELTER
  if (
    titleLower.includes("mining") ||
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("smelter") ||
    titleLower.includes("mineral") ||
    titleLower.includes("bauksit")
  ) {
    return {
      sectorName: "Logistik Pertambangan & Mineral Kritis (Mining)",
      sectorBadge: "PRAMA LOGISTICS ENGINE • MINING & MINERALS",
      estimatorSlider2Label: "Premium Rate Kepatuhan SIMBARA ESDM & RKAB",
      estimatorTariffLabel: "Tarif Dasar Hauling Pit-to-Port (IDR / Ton / KM)",
      estimatorDisclaimer: "Perhitungan di atas menggunakan model estimasi logistik pertambangan & smelter terintegrasi Pancaran Group.",

      driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
      driversSubtitle: `Kebutuhan pengangkutan ore dan komoditas mineral skala masif yang aman dan patuh regulasi di "${projectTitle || "Proyek Tambang"}".`,
      driversList: [
        {
          id: "drv-1",
          code: "DRV-01 • GLOBAL MARKET",
          tag: "CRITICAL MINERALS",
          title: "Rantai Pasok Mineral Kritis & Baterai EV",
          description: "Smelter nikel dan komoditas tambang mewajibkan audit jejak karbon terukur dari pit penebangan hingga pelabuhan."
        },
        {
          id: "drv-2",
          code: "DRV-02 • PRODUCTS RANGE",
          tag: "BULK HAULING",
          title: "Diversifikasi Mineral & Bauksit/Tembaga",
          description: "Ekspansi hilirisasi membutuhkan pengangkutan dump truck raksasa berkapasitas ritase harian sangat tinggi."
        },
        {
          id: "drv-3",
          code: "DRV-03 • ENERGY TRANSITION",
          tag: "SIMBARA ESDM",
          title: "Mandatori Integrasi SIMBARA ESDM",
          description: "Wajib pelaporan tonase real-time sebelum rilis surat angkut dan kuota RKAB pertambangan nasional."
        }
      ],

      gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
      gapsSubtitle: "Kebutuhan kritis pemegang IUP/RKAB tambang yang membutuhkan kepastian ritase tanpa terhenti cuaca.",
      gapsList: [
        {
          id: "gap-1",
          code: "GAP-01 • ACCESSIBILITY",
          tag: "OFF-ROAD HAULING",
          title: "Akses Jalan Hauling Tambang Musim Hujan",
          description: "Rute hauling berlumpur membutuhkan armada 6x4/8x4 heavy duty dengan diferensial ganda yang tahan beban ekstrim."
        },
        {
          id: "gap-2",
          code: "GAP-02 • TRACEABILITY",
          tag: "JETTY BOTTLENECK",
          title: "Kerapian Ritase & Bottleneck di Jetty",
          description: "Pengaturan jadwal armada secara presisi untuk mencegah penumpukan kendaraan di area stockpile dan pelabuhan."
        },
        {
          id: "gap-3",
          code: "GAP-03 • HSE COMPLIANCE",
          tag: "ODOL CONTROL",
          title: "Pengawasan ODOL & Jembatan Timbang",
          description: "Penertiban tonase muatan portal tambang untuk mencegah kerusakan armada dan sanksi administratif ESDM."
        }
      ],

      techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
      techSubtitle: "Teknologi jembatan timbang digital dan telemetri satelit untuk memantau keselamatan ritase tambang.",
      axleSimulatorTitle: "Interactive IoT Mining Hauling Axle Simulator",
      axleSimulatorSubtitle: "Simulasikan pemantauan tonase ritase tambang untuk pencegahan ODOL dan validasi SIMBARA.",
      cargoWeightLabel: "Total Muatan Ore / Mineral (Ton)",
      axleOptions: [
        { value: 2, label: "2-As (Light Dump Truck 10T)" },
        { value: 3, label: "3-As (Tronton Dump Tipper 25T)" },
        { value: 4, label: "4-As (Heavy Duty Side Dump 35T)" },
        { value: 5, label: "5-As (Rigid Multi-Trailer 50T)" }
      ],

      pingTitle: "Satellite-Hybrid Mining Fleet Ping Hub",
      pingSubtitle: "Memantau dump truck dan hauling rig secara langsung di rute tambang pedalaman.",
      pingTrucks: [
        { id: "TRK-09", name: "Volvo FMX 440 - Dump Tipper 8x4", speed: 28, signal: "Satelit 98%", status: "Hauling Ore dari Pit ke Smelter" },
        { id: "TRK-15", name: "Scania G460 - Side Dump Hauler", speed: 42, signal: "Seluler 4G", status: "Perjalanan ke Jetty Pelabuhan" },
        { id: "TRK-22", name: "Mercedes Arocs - Heavy Duty 6x4", speed: 0, signal: "Satelit 95%", status: "Bongkar di Stockpile Smelter" }
      ],
      pingSuccessMsg: "✓ Seluruh armada angkutan tambang berhasil di-ping via koneksi satelit Prama Telematics Hub.",

      greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
      greenSubtitle: "Praktik dekarbonisasi operasional tambang untuk memenuhi standar ekspor mineral hijau.",
      greenList: [
        {
          id: "grn-1",
          code: "GRN-01 • CARBON CREDITS",
          tag: "GREEN MINERALS",
          title: "Sertifikasi Low-Carbon Mining Transport",
          description: "Audit emisi solar per ton-km komoditas tambang untuk memenuhi syarat ekspor mineral ramah lingkungan."
        },
        {
          id: "grn-2",
          code: "GRN-02 • DUAL-FUEL TRUCKING",
          tag: "LNG & EV TRUCKS",
          title: "Konversi Dual-Fuel LNG / Electric Truck",
          description: "Penurunan konsumsi solar industri hingga 20% dengan penggunaan armada berbahan bakar gas terkompresi."
        },
        {
          id: "grn-3",
          code: "GRN-03 • ECO RECLAMATION",
          tag: "ROUTE OPTIMIZATION",
          title: "Dekarbonisasi Rute Pit-to-Port",
          description: "Optimalisasi jaringan rute hauling dan backhaul sharing untuk memangkas kilometer perjalanan kosong."
        }
      ],
      customOpPlaceholder: "e.g. Sinergi Rute Hauling Ore Bersama Koridor Smelter"
    };
  }

  // 3. AGRICULTURE / SAWIT / CPO / PERKEBUNAN / PANGAN
  if (
    titleLower.includes("sawit") ||
    titleLower.includes("cpo") ||
    titleLower.includes("perkebunan") ||
    titleLower.includes("agri") ||
    titleLower.includes("pangan") ||
    titleLower.includes("kebun")
  ) {
    return {
      sectorName: "Logistik Agrokomoditas & Sawit (Agribusiness)",
      sectorBadge: "PRAMA LOGISTICS ENGINE • AGRO & PALM OIL",
      estimatorSlider2Label: "Premium Rate Kepatuhan ISPO & EUDR Certification",
      estimatorTariffLabel: "Tarif Dasar Hauling TBS / CPO (IDR / Ton / KM)",
      estimatorDisclaimer: "Perhitungan di atas menggunakan model estimasi logistik agrokomoditas & CPO terintegrasi Pancaran Group.",

      driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
      driversSubtitle: `Kebutuhan rantai pasok CPO dan hasil kebun yang efisien dan patuh sertifikasi internasional di "${projectTitle || "Proyek Perkebunan"}".`,
      driversList: [
        {
          id: "drv-1",
          code: "DRV-01 • GLOBAL MARKET",
          tag: "ISPO / EUDR",
          title: "Mandatori ISPO & EUDR Perkebunan",
          description: "Pembeli CPO dan komoditas pangan menuntut bukti geolokasi poligon bebas deforestasi."
        },
        {
          id: "drv-2",
          code: "DRV-02 • PRODUCTS RANGE",
          tag: "BIOFUEL B35",
          title: "Pasokan CPO & Biofuel B35/B40",
          description: "Peningkatan target pencampuran biofuel memicu lonjakan kebutuhan armada tangki CPO higienis."
        },
        {
          id: "drv-3",
          code: "DRV-03 • ENERGY TRANSITION",
          tag: "COLD CHAIN",
          title: "Logistik Rantai Dingin Pangan Terintegrasi",
          description: "Kebutuhan distribusi komoditas pangan segar dengan truk pendingin terhubung IoT."
        }
      ],

      gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
      gapsSubtitle: "Kebutuhan pengangkutan TBS dan CPO cepat guna menjaga mutu Asam Lemak Bebas (ALB).",
      gapsList: [
        {
          id: "gap-1",
          code: "GAP-01 • ACCESSIBILITY",
          tag: "ALB QUALITY",
          title: "Kecepatan Angkut Kebun ke PKS",
          description: "Keterlambatan pengangkutan TBS memicu kenaikan Asam Lemak Bebas (ALB) pada minyak sawit."
        },
        {
          id: "gap-2",
          code: "GAP-02 • TRACEABILITY",
          tag: "DIGITAL MANIFEST",
          title: "Surat Angkut Digital Kebun Mitra",
          description: "Integrasi pencatatan muatan kebun swadaya langsung ke sistem timbangan PKS secara online."
        },
        {
          id: "gap-3",
          code: "GAP-03 • HSE COMPLIANCE",
          tag: "E-SEAL SECURITY",
          title: "Keamanan Tangki CPO Anti-Pencurian",
          description: "E-Seal digital GPS pada kran tangki untuk mencegah manipulasi volume CPO di jalan."
        }
      ],

      techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
      techSubtitle: "Sensor IoT dan E-Seal digital untuk menjaga integritas volume dan mutu CPO.",
      axleSimulatorTitle: "Interactive IoT Palm Cargo & Tank Simulator",
      axleSimulatorSubtitle: "Simulasikan pemantauan muatan TBS/CPO untuk mencegah kerugian dan kebocoran volume.",
      cargoWeightLabel: "Total Muatan TBS / CPO (Ton)",
      axleOptions: [
        { value: 2, label: "2-As (Colt Diesel Kebun 8T)" },
        { value: 3, label: "3-As (Tronton Tangki CPO 20T)" },
        { value: 4, label: "4-As (Trailer CPO Tanker 32T)" },
        { value: 5, label: "5-As (Rigid TBS Hooklift 40T)" }
      ],

      pingTitle: "Satellite-Hybrid Agro Fleet Ping Hub",
      pingSubtitle: "Memantau armada tangki CPO dan truk TBS di area kebun minim sinyal.",
      pingTrucks: [
        { id: "TRK-07", name: "Scania P320 - CPO Tanker 24kL", speed: 38, signal: "Satelit 98%", status: "Transport CPO ke Bulk Terminal" },
        { id: "TRK-12", name: "Volvo FMX 380 - TBS Hooklift Rig", speed: 25, signal: "Seluler 4G", status: "Hauling Buah Sawit dari Afdeling" },
        { id: "TRK-18", name: "Hino FM 260 - Palm Oil Hauler", speed: 0, signal: "Satelit 95%", status: "Bongkar di Tangki Timbun Pelabuhan" }
      ],
      pingSuccessMsg: "✓ Seluruh armada angkutan CPO/TBS berhasil di-ping via koneksi satelit Prama Telematics Hub.",

      greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
      greenSubtitle: "Pemanfaatan biogas POME dan lacak balik geolokasi kebun.",
      greenList: [
        {
          id: "grn-1",
          code: "GRN-01 • CARBON CREDITS",
          tag: "RSPO CERTIFICATE",
          title: "Sertifikasi RSPO / ISPO Supply Chain",
          description: "Akses ke pasar ekspor premium dengan sertifikat jaminan rantai pasok berkelanjutan."
        },
        {
          id: "grn-2",
          code: "GRN-02 • BIOGAS UTILIZATION",
          tag: "POME BIOGAS",
          title: "Sinergi Biogas POME untuk Fleet",
          description: "Bahan bakar ramah lingkungan memanfaatkan limbah cair sawit (POME) untuk armada kebun."
        },
        {
          id: "grn-3",
          code: "GRN-03 • TRACEABLE LOGISTICS",
          tag: "POLYGON MAPPING",
          title: "Lacak Balik Geolokasi Kebun-ke-Refinery",
          description: "Pemetaan geolokasi digital dalam setiap dokumen manifes pengiriman CPO."
        }
      ],
      customOpPlaceholder: "e.g. Sinergi Pengangkutan TBS Kebun Plasma"
    };
  }

  // 4. ENERGY / RENEWABLE ENERGY / EBT / SOLAR / POWER
  if (
    titleLower.includes("energi") ||
    titleLower.includes("ebt") ||
    titleLower.includes("renewable") ||
    titleLower.includes("solar") ||
    titleLower.includes("power") ||
    titleLower.includes("PLTU") ||
    titleLower.includes("pembangkit")
  ) {
    return {
      sectorName: "Energi Terbarukan & Infrastructure Heavy-Lift",
      sectorBadge: "PRAMA LOGISTICS ENGINE • RENEWABLE ENERGY",
      estimatorSlider2Label: "Premium Rate TKDN Logistik Energi Kemenperin",
      estimatorTariffLabel: "Tarif Dasar Mobilisasi Heavy-Lift (IDR / Ton / KM)",
      estimatorDisclaimer: "Perhitungan di atas menggunakan model estimasi logistik energi terbarukan & heavy-lift Pancaran Group.",

      driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
      driversSubtitle: `Kebutuhan mobilisasi komponen berat dan sensitif untuk proyek energi bersih di "${projectTitle || "Proyek Energi"}".`,
      driversList: [
        {
          id: "drv-1",
          code: "DRV-01 • GLOBAL MARKET",
          tag: "RENEWABLE EXPANSION",
          title: "Akselerasi Proyek Pembangkit EBT",
          description: "Pengangkutan turbin angin, modul solar, dan transformer raksasa menuju tapak proyek."
        },
        {
          id: "drv-2",
          code: "DRV-02 • PRODUCTS RANGE",
          tag: "TKDN ENERGY",
          title: "Mandatori TKDN Logistik Kemenperin",
          description: "Prioritas tinggi bagi penyedia jasa transportasi lokal berizin TKDN > 40%."
        },
        {
          id: "drv-3",
          code: "DRV-03 • ENERGY TRANSITION",
          tag: "BESS STORAGE",
          title: "Penyimpanan BESS & Grid Expansion",
          description: "Transportasi modul baterai energi terbarukan dengan standar pengangkutan khusus."
        }
      ],

      gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
      gapsSubtitle: "Kebutuhan penanganan kargo overdimensi dan perlindungan guncangan sensitif.",
      gapsList: [
        {
          id: "gap-1",
          code: "GAP-01 • ACCESSIBILITY",
          tag: "HEAVY-LIFT ROUTE",
          title: "Rute Overdimensi & Heavy-Lift Pedalaman",
          description: "Navigasi rute jembatan terbatas dan elevasi curam menuju lokasi EBT remote."
        },
        {
          id: "gap-2",
          code: "GAP-02 • TRACEABILITY",
          tag: "ANTI-VIBRATION",
          title: "Perlindungan Anti-Vibrasi Komponen Listrik",
          description: "Sensor guncangan real-time untuk mencegah kerusakan peralatan bernilai tinggi."
        },
        {
          id: "gap-3",
          code: "GAP-03 • HSE COMPLIANCE",
          tag: "ESCORT SAFETY",
          title: "Pengawalan Khusus & Keselamatan Jalan",
          description: "Tim escort khusus untuk trailer multi-axle muatan panjang dan berat."
        }
      ],

      techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
      techSubtitle: "Suspensi udara khusus dan telemetri anti-guncangan untuk muatan bernilai tinggi.",
      axleSimulatorTitle: "Interactive IoT Heavy-Lift & Shock Simulator",
      axleSimulatorSubtitle: "Simulasikan distribusi beban dan vibrasi untuk keselamatan komponen listrik bernilai tinggi.",
      cargoWeightLabel: "Total Muatan Komponen / Transformer (Ton)",
      axleOptions: [
        { value: 3, label: "3-As (Tronton Lowbed 20T)" },
        { value: 4, label: "4-As (Trailer Semi-Heavy 35T)" },
        { value: 5, label: "5-As (Multi-Axle Modular 50T)" },
        { value: 6, label: "6+ As (Heavy Hydraulic Goldhofer)" }
      ],

      pingTitle: "Satellite-Hybrid Energy Fleet Ping Hub",
      pingSubtitle: "Memantau mobilisasi heavy-lift transformer dan turbin ke tapak proyek EBT.",
      pingTrucks: [
        { id: "TRK-01", name: "Volvo FH16 - Heavy Lowbed Trailer", speed: 22, signal: "Satelit 98%", status: "Transport Transformer Utama ke Site" },
        { id: "TRK-05", name: "Scania R580 - Multi-Axle Modular", speed: 30, signal: "Seluler 4G", status: "Mobilisasi Modul Solar & Inverter" },
        { id: "TRK-10", name: "MAN TGS - Wind Turbine Carrier", speed: 0, signal: "Satelit 95%", status: "Bongkar di Tapak Proyek EBT" }
      ],
      pingSuccessMsg: "✓ Seluruh armada angkutan heavy-lift EBT berhasil di-ping via koneksi satelit Prama Telematics Hub.",

      greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
      greenSubtitle: "Integrasi kredit karbon dan pelaporan emisi proyek energi terbarukan.",
      greenList: [
        {
          id: "grn-1",
          code: "GRN-01 • CARBON CREDITS",
          tag: "CLEAN INFRASTRUCTURE",
          title: "Kredit Karbon Infrastruktur Bersih",
          description: "Integrasi pengurangan emisi armada dengan klaim kredit hijau proyek."
        },
        {
          id: "grn-2",
          code: "GRN-02 • GREEN TRANSPORT",
          tag: "ESG REPORTING",
          title: "Sertifikasi Green Logistics EBT",
          description: "Pelaporan jejak emisi transportasi transparan untuk pendanaan hijau."
        },
        {
          id: "grn-3",
          code: "GRN-03 • HYBRID FLEET",
          tag: "EV SERVICE VEHICLES",
          title: "Armada Operasional Hybrid / EV",
          description: "Penggunaan kendaraan pemeliharaan beremisi nol di lokasi proyek."
        }
      ],
      customOpPlaceholder: "e.g. Rute Khusus Pengangkutan Modul BESS"
    };
  }

  // 5. FORESTRY / KEHUTANAN / WOOD / LOGGING
  if (
    titleLower.includes("kehutanan") ||
    titleLower.includes("forestry") ||
    titleLower.includes("wood") ||
    titleLower.includes("logging") ||
    titleLower.includes("pulp")
  ) {
    return {
      sectorName: "Sektor Kehutanan & Biomassa (Forestry)",
      sectorBadge: "PRAMA LOGISTICS ENGINE • FORESTRY & BIOMASS",
      estimatorSlider2Label: "Premium Rate Keberlanjutan (FSC/SVLK Certification)",
      estimatorTariffLabel: "Tarif Dasar Hauling Kayu / Biomassa (IDR / Ton / KM)",
      estimatorDisclaimer: "Perhitungan di atas menggunakan model estimasi logistik kehutanan & biomassa terintegrasi Pancaran Group.",

      driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
      driversSubtitle: `Daftar kekuatan makroekonomi dan regulasi global yang mendorong kebutuhan pengangkutan hasil hutan di "${projectTitle || "Proyek Kehutanan"}".`,
      driversList: [
        {
          id: "drv-1",
          code: "DRV-01 • GLOBAL MARKET",
          tag: "SVLK / FSC",
          title: "Permintaan Kayu Bersertifikat",
          description: "Pembeli Eropa dan AS mewajibkan audit legalitas asal-usul kayu secara ketat dengan sistem manifes terpercaya."
        },
        {
          id: "drv-2",
          code: "DRV-02 • PRODUCTS RANGE",
          tag: "NTFP LOGISTICS",
          title: "Hasil Hutan Bukan Kayu (NTFP)",
          description: "Tren pengolahan resin, gaharu, dan serat nabati membutuhkan armada angkutan berpendingin khusus atau kontainer tertutup."
        },
        {
          id: "drv-3",
          code: "DRV-03 • ENERGY TRANSITION",
          tag: "BIOMASS PELLETS",
          title: "Biomassa Woodchip & Pellet",
          description: "Program co-firing biomassa memicu ledakan suplai woodchips harian berkapasitas ribuan ton."
        }
      ],

      gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
      gapsSubtitle: "Mengidentifikasi kebutuhan kritis pemegang konsesi hutan yang gagal dipenuhi operator konvensional.",
      gapsList: [
        {
          id: "gap-1",
          code: "GAP-01 • ACCESSIBILITY",
          tag: "LOGGING ROAD",
          title: "Akses Jalan Hutan Pedalaman",
          description: "Truk biasa tergelincir di logging road tanah merah saat hujan. Dibutuhkan armada 6x4 sasis heavy-duty."
        },
        {
          id: "gap-2",
          code: "GAP-02 • TRACEABILITY",
          tag: "CHAIN OF CUSTODY",
          title: "Lacak Balak Sertifikasi Kayu",
          description: "Tracking barcode muatan terintegrasi dengan portal SVLK resmi untuk mencegah denda hukum."
        },
        {
          id: "gap-3",
          code: "GAP-03 • HSE COMPLIANCE",
          tag: "PAPER MILL HSE",
          title: "Kepatuhan Keselamatan Ketat",
          description: "Pabrik kertas global mewajibkan truk mematuhi aturan safety industri, APD driver, dan tes kelayakan."
        }
      ],

      techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
      techSubtitle: "Penerapan teknologi mutakhir di sektor transportasi kehutanan untuk memangkas inefisiensi biaya.",
      axleSimulatorTitle: "Interactive IoT Axle Overload Simulator",
      axleSimulatorSubtitle: "Simulasikan pemantauan berat muatan kayu secara digital untuk menghindari denda jalan umum.",
      cargoWeightLabel: "Total Muatan Kayu (Ton)",
      axleOptions: [
        { value: 2, label: "2-As (Colt Diesel / Light Truck)" },
        { value: 3, label: "3-As (Tronton / Rigid Logging)" },
        { value: 4, label: "4-As (Trailer Semi-Heavy)" },
        { value: 5, label: "5-As (Rigid Logging + Trailer)" }
      ],

      pingTitle: "Satellite-Hybrid Fleet Ping Hub",
      pingSubtitle: "Memantau truk logging secara langsung di rute pedalaman HTI minim sinyal seluler.",
      pingTrucks: [
        { id: "TRK-09", name: "Volvo FMX 400 - Logging Rig", speed: 28, signal: "Satelit 98%", status: "Hauling di Hutan Tanaman Industri" },
        { id: "TRK-15", name: "Scania P360 - Woodchips Carrier", speed: 42, signal: "Seluler 4G", status: "Perjalanan ke Mill Port" },
        { id: "TRK-22", name: "Mercedes Actros - Logs Slasher", speed: 0, signal: "Satelit 95%", status: "Bongkar di Loading Yard" }
      ],
      pingSuccessMsg: "✓ Seluruh armada berhasil di-ping via koneksi satelit Prama Telematics Hub.",

      greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
      greenSubtitle: "Eksploitasi potensi pendapatan alternatif serta kepatuhan emisi untuk profitabilitas jangka panjang.",
      greenList: [
        {
          id: "grn-1",
          code: "GRN-01 • CARBON CREDITS",
          tag: "CARBON MARKET",
          title: "Sertifikasi Karbon Perdagangan",
          description: "Potensi integrasi rute logistik hemat bahan bakar dengan pasar karbon kredit domestik (IDXCarbon)."
        },
        {
          id: "grn-2",
          code: "GRN-02 • REDD+ SYNCHRONY",
          tag: "EMISSION REDUCTION",
          title: "Kemitraan Inisiatif REDD+",
          description: "Sinergitas operasi pengangkutan kayu HTI dengan program pengurangan emisi deforestasi nasional."
        },
        {
          id: "grn-3",
          code: "GRN-03 • EURO 5 TRUCKS",
          tag: "EURO 5 STANDARD",
          title: "Armada Rendah Emisi Euro 5",
          description: "Mengganti truk tua ke standar Euro 5 untuk memberikan jaminan laporan dekarbonisasi bulanan."
        }
      ],
      customOpPlaceholder: "e.g. Sinergi Jalur Hauling Musim Hujan"
    };
  }

  // 6. DEFAULT / GENERAL / DYNAMIC FOR ANY OTHER PROJECT TITLE
  const displayTitle = projectTitle || "Logistik & Transportasi Strategis";
  return {
    sectorName: `Logistik & Transportasi (${displayTitle})`,
    sectorBadge: `PRAMA LOGISTICS ENGINE • ${displayTitle.toUpperCase().slice(0, 24)}`,
    estimatorSlider2Label: "Premium Rate Kepatuhan & Sertifikasi Keberlanjutan",
    estimatorTariffLabel: "Tarif Dasar Hauling & Transportasi (IDR / Ton / KM)",
    estimatorDisclaimer: `Perhitungan di atas menggunakan model estimasi logistik terintegrasi Pancaran Group untuk proyek "${displayTitle}".`,

    driversTitle: "🚀 Pendorong Pasar Utama (Market Drivers)",
    driversSubtitle: `Kekuatan pendorong makroekonomi dan kebutuhan operasional utama pada proyek "${displayTitle}".`,
    driversList: [
      {
        id: "drv-1",
        code: "DRV-01 • MARKET DEMAND",
        tag: "HIGH CAPACITY",
        title: `Permintaan Layanan ${displayTitle}`,
        description: "Meningkatnya kebutuhan pengangkutan terstruktur dan tepat waktu yang memerlukan armadasasis heavy-duty dan jaminan SLA."
      },
      {
        id: "drv-2",
        code: "DRV-02 • COMPLIANCE",
        tag: "SAFETY & LEGAL",
        title: "Kepatuhan K3LL & Standar Legalitas",
        description: "Persyaratan ketat dari pemilik proyek dan regulasi nasional terkait kepemilikan dokumen izin angkut dan sertifikasi keselamatan."
      },
      {
        id: "drv-3",
        code: "DRV-03 • EFFICIENCY",
        tag: "COST REDUCTION",
        title: "Kebutuhan Efisiensi Rantai Pasok",
        description: "Mendorong adopsi teknologi telemetri dan sistem pemantauan real-time untuk memangkas biaya operasional harian."
      }
    ],

    gapsTitle: "🎯 Celah Pasar & Kebutuhan Logistik (Market Gap)",
    gapsSubtitle: `Analisis kesenjangan operasional yang belum mampu dipenuhi oleh kompetitor di sektor ${displayTitle}.`,
    gapsList: [
      {
        id: "gap-1",
        code: "GAP-01 • ACCESSIBILITY",
        tag: "ROBUST FLEET",
        title: "Ketersediaan Armada Sasis Khusus",
        description: "Kelangkaan penyedia jasa dengan armada sasis khusus yang andal menembus medan tantangan jalur pengiriman."
      },
      {
        id: "gap-2",
        code: "GAP-02 • TRACEABILITY",
        tag: "DIGITAL TRACKING",
        title: "Integrasi Pelaporan Live Digital",
        description: "Kebutuhan pemilik proyek akan dashboard pemantauan posisi muatan dan estimasi waktu tiba (ETA) yang presisi."
      },
      {
        id: "gap-3",
        code: "GAP-03 • HSE COMPLIANCE",
        tag: "ZERO ACCIDENT",
        title: "Standardisasi Keselamatan Tinggi",
        description: "Sertifikasi keselamatan pengemudi dan perawatan berkala terjamin untuk meminimalisir angka kecelakaan di jalan."
      }
    ],

    techTitle: "💻 Peluang Inovasi Teknologi (Tech Solutions)",
    techSubtitle: "Penerapan sistem IoT, telemetri satelit, dan otomatisasi penimbangan muatan.",
    axleSimulatorTitle: "Interactive IoT Axle & Weight Simulator",
    axleSimulatorSubtitle: "Simulasikan pemantauan berat muatan secara digital untuk pencegahan timbangan ODOL.",
    cargoWeightLabel: "Total Berat Muatan Kargo (Ton)",
    axleOptions: [
      { value: 2, label: "2-As (Light Truck 8T)" },
      { value: 3, label: "3-As (Tronton Heavy 20T)" },
      { value: 4, label: "4-As (Trailer Semi-Heavy 32T)" },
      { value: 5, label: "5-As (Multi-Axle Heavy Rig 45T)" }
    ],

    pingTitle: "Satellite-Hybrid Fleet Ping Hub",
    pingSubtitle: "Memantau armada transportasi proyek secara real-time melalui jaringan satelit-hibrida.",
    pingTrucks: [
      { id: "TRK-01", name: "Volvo FMX 400 - Transport Rig", speed: 35, signal: "Satelit 98%", status: "Hauling Rute Koridor Utama" },
      { id: "TRK-06", name: "Scania P360 - Heavy Carrier", speed: 40, signal: "Seluler 4G", status: "Perjalanan ke Port / Terminal" },
      { id: "TRK-12", name: "Mercedes Actros - Multi-Axle", speed: 0, signal: "Satelit 95%", status: "Bongkar Muat di Depo" }
    ],
    pingSuccessMsg: "✓ Seluruh armada transportasi proyek berhasil di-ping via koneksi satelit Prama Telematics Hub.",

    greenTitle: "🌿 Nilai Tambah Hijau (Green Value-Add)",
    greenSubtitle: "Penerapan dekarbonisasi dan armada ramah lingkungan untuk nilai tambah ESG.",
    greenList: [
      {
        id: "grn-1",
        code: "GRN-01 • CARBON CREDITS",
        tag: "ESG IMPACT",
        title: "Perhitungan Reduksi Emisi Karbon",
        description: "Integrasi rute hemat bahan bakar dan pelaporan dekarbonisasi berkala bagi pemilik proyek."
      },
      {
        id: "grn-2",
        code: "GRN-02 • BIOFUEL FLEET",
        tag: "B35 / B40 FUEL",
        title: "Penggunaan Armada Biofuel Ramah Lingkungan",
        description: "Penggunaan bahan bakar ramah lingkungan untuk memangkas jejak emisi karbon harian."
      },
      {
        id: "grn-3",
        code: "GRN-03 • SUSTAINABLE LOGISTICS",
        tag: "GREEN CERTIFICATE",
        title: "Sertifikasi Logistik Berkelanjutan",
        description: "Penjaminan rantai pasok hijau yang meningkatkan daya saing proyek di mata pemangku kepentingan."
      }
    ],
    customOpPlaceholder: "e.g. Optimasi Rute Koridor Hauling"
  };
}

// ==========================================
// 2. GTM PROFILE HELPER
// ==========================================
export interface GtmAudience {
  id: string;
  name: string;
  tier: "Tier-1 Utama" | "Tier-2 Sekunder" | "Tier-3 Niche";
  need: string;
  matchIndex: number;
  stabilityWeight: "Sangat Tinggi" | "Tinggi" | "Sedang";
}

export interface GtmChannel {
  id: string;
  channelName: string;
  costEstimate: number;
  conversionRate: number;
  impactLevel: "Sangat Tinggi" | "Tinggi" | "Sedang";
  details: string;
}

export interface GtmTactic {
  code: string;
  tag: string;
  title: string;
  description: string;
}

export interface SectorGtmProfile {
  sectorName: string;
  b2bSubtitle: string;
  audiences: GtmAudience[];
  channels: GtmChannel[];
  tactics: GtmTactic[];
}

export function getSectorGtmProfile(projectTitle: string): SectorGtmProfile {
  const titleLower = (projectTitle || "").toLowerCase();
  const displayTitle = projectTitle || "Logistik Strategis";

  // 1. WASTE MANAGEMENT
  if (
    titleLower.includes("limbah") ||
    titleLower.includes("waste") ||
    titleLower.includes("b3") ||
    titleLower.includes("sampah") ||
    titleLower.includes("recycle") ||
    titleLower.includes("daur ulang") ||
    titleLower.includes("lingkungan")
  ) {
    return {
      sectorName: "Pengolahan Limbah & B3",
      b2bSubtitle: "Empat taktik andalan tim penjualan Pancaran Group untuk memenangkan tender transportasi pengolahan limbah & B3.",
      audiences: [
        {
          id: "aud-1",
          name: "Korporasi Manufaktur & Petrokimia (Penghasil B3)",
          tier: "Tier-1 Utama",
          need: "Pengangkutan limbah B3 terverifikasi E-Manifest Festronik KLHK dengan jaminan ketaatan K3LL 100%.",
          matchIndex: 96,
          stabilityWeight: "Sangat Tinggi"
        },
        {
          id: "aud-2",
          name: "Pengelola TPS3R & Pembangkit Listrik (RDF/Biomassa)",
          tier: "Tier-1 Utama",
          need: "Armada truk compactor dan box besar untuk pengiriman pasokan Refuse Derived Fuel (RDF) berjadwal.",
          matchIndex: 91,
          stabilityWeight: "Sangat Tinggi"
        },
        {
          id: "aud-3",
          name: "Industri Pengolahan & Daur Ulang Material (Recycling)",
          tier: "Tier-2 Sekunder",
          need: "Kebutuhan truk kontainer tertutup anti-bocor untuk efisiensi pengangkutan bahan baku daur ulang.",
          matchIndex: 84,
          stabilityWeight: "Tinggi"
        },
        {
          id: "aud-4",
          name: "Rumah Sakit & Fasilitas Kesehatan (Limbah Medis)",
          tier: "Tier-3 Niche",
          need: "Armada berpendingin khusus & sasis kustom untuk pengangkutan limbah infeksius berstandar ketat.",
          matchIndex: 78,
          stabilityWeight: "Sedang"
        }
      ],
      channels: [
        {
          id: "chan-1",
          channelName: "Direct Executive B2B Advocacy (Lobbying KLHK & Industry)",
          costEstimate: 75000000,
          conversionRate: 28,
          impactLevel: "Sangat Tinggi",
          details: "Pendekatan tingkat direksi perusahaan penghasil limbah B3 dan presentasi portal Festronik real-time."
        },
        {
          id: "chan-2",
          channelName: "Simposium & Pameran Pengolahan Waste-to-Energy Nasional",
          costEstimate: 120000000,
          conversionRate: 18,
          impactLevel: "Tinggi",
          details: "Pameran armada tangki B3 berizin resmi dan live demonstration tracking spill-kit emergency."
        },
        {
          id: "chan-3",
          channelName: "Digital Account-Based Marketing (ABM) K3LL Directors",
          costEstimate: 45000000,
          conversionRate: 14,
          impactLevel: "Sedang",
          details: "Kampanye terarah kepada manajer EHS/K3LL pabrik besar yang membutuhkan mitra transportasi B3 berizin."
        }
      ],
      tactics: [
        {
          code: "TAKTIK 01",
          tag: "INTEGRATED PACKAGE",
          title: "INTEGRATED WASTE LOGISTICS PACKAGE",
          description: "Menawarkan satu harga terintegrasi mencakup pengangkutan limbah B3 dari pabrik, pengurusan e-manifest Festronik KLHK, hingga penyerahan di pengolah akhir."
        },
        {
          code: "TAKTIK 02",
          tag: "LIVE TELEMATICS",
          title: "FESTRONIK DIGITAL DASHBOARD MOCK",
          description: "Memberikan akses gratis 14 hari bagi tim EHS/K3LL klien ke portal telemetri GPS Pancaran untuk pembuktian keandalan verifikasi izin B3."
        },
        {
          code: "TAKTIK 03",
          tag: "BACKHAUL DISCOUNT",
          title: "SHARED RECYCLING BACKHAUL DISCOUNT",
          description: "Diskon tarif khusus 15% jika armada truk kembali membawa bahan baku daur ulang / limbah terolah ke fasilitas pengolahan mitra."
        },
        {
          code: "TAKTIK 04",
          tag: "CUSTOM VEHICLES",
          title: "CUSTOMIZED TANKER & COMPACTOR FLEET",
          description: "Menyediakan truk tangki B3 / compactor kustom dengan sensor pendeteksi kebocoran dan tanggap darurat spill-kit internal."
        }
      ]
    };
  }

  // 2. MINING / PERTAMBANGAN
  if (
    titleLower.includes("mining") ||
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("smelter") ||
    titleLower.includes("mineral") ||
    titleLower.includes("bauksit")
  ) {
    return {
      sectorName: "Logistik Pertambangan & Mineral",
      b2bSubtitle: "Empat taktik andalan tim penjualan Pancaran Group untuk memenangkan tender hauling pertambangan & smelter.",
      audiences: [
        {
          id: "aud-1",
          name: "Pemegang IUP / IUPK Pertambangan & Smelter",
          tier: "Tier-1 Utama",
          need: "Hauling pit-to-port kapasitas >5.000 ton/hari dengan jaminan SLA ketat dan integrasi SIMBARA ESDM.",
          matchIndex: 98,
          stabilityWeight: "Sangat Tinggi"
        },
        {
          id: "aud-2",
          name: "Kontraktor Utama Mining & Earthmoving",
          tier: "Tier-1 Utama",
          need: "Armada dump truck heavy-duty 10-wheeler dengan ketahanan berjalan di medan jalan tambang ekstrim.",
          matchIndex: 92,
          stabilityWeight: "Sangat Tinggi"
        },
        {
          id: "aud-3",
          name: "Pembangkit Listrik (PLTU) & Kawasan Industri Smelter",
          tier: "Tier-2 Sekunder",
          need: "Pengiriman pasokan batu bara/ore konsisten dengan efisiensi bongkar muat cepat di jetties.",
          matchIndex: 86,
          stabilityWeight: "Tinggi"
        },
        {
          id: "aud-4",
          name: "Trader Komoditas Mineral & Ekspor Ore",
          tier: "Tier-3 Niche",
          need: "Layanan angkutan terpadu terikat kontrak jangka pendek-menengah dengan jaminan verifikasi tonase.",
          matchIndex: 76,
          stabilityWeight: "Sedang"
        }
      ],
      channels: [
        {
          id: "chan-1",
          channelName: "Direct Procurement & Mining Tender Advocacy",
          costEstimate: 85000000,
          conversionRate: 30,
          impactLevel: "Sangat Tinggi",
          details: "Pendekatan tim komersial kepada VP Supply Chain & Mining Site Manager pemilik IUP."
        },
        {
          id: "chan-2",
          channelName: "Indonesian Mining & Heavy Equipment Expo",
          costEstimate: 150000000,
          conversionRate: 20,
          impactLevel: "Tinggi",
          details: "Presentasi armada dump truck heavy-duty dan fitur pemantauan overloading otomatis."
        },
        {
          id: "chan-3",
          channelName: "Targeted B2B Campaign to Smelter Operators",
          costEstimate: 50000000,
          conversionRate: 15,
          impactLevel: "Sedang",
          details: "Prospek digital ke manajer logistik kawasan industri pertambangan nasional."
        }
      ],
      tactics: [
        {
          code: "TAKTIK 01",
          tag: "INTEGRATED PACKAGE",
          title: "INTEGRATED PIT-TO-PORT PACKAGE",
          description: "Menawarkan satu harga terintegrasi mencakup pengangkutan ore/batubara dari pit tambang, pengelolaan stockpile, hingga barge loading di dermaga."
        },
        {
          code: "TAKTIK 02",
          tag: "LIVE TELEMATICS",
          title: "LIVE MINING PIT DASHBOARD MOCK",
          description: "Akses gratis 14 hari ke portal telemetri GPS satelit Pancaran untuk memantau ritase truk dan siklus waktu (cycle time) secara real-time."
        },
        {
          code: "TAKTIK 03",
          tag: "BACKHAUL DISCOUNT",
          title: "SHARED FUEL & SUPPLIES BACKHAUL DISCOUNT",
          description: "Diskon tarif 15% jika armada truk kosong yang kembali dari port diizinkan mengangkut pasokan BBM solar/sparepart ke site tambang."
        },
        {
          code: "TAKTIK 04",
          tag: "CUSTOM VEHICLES",
          title: "CUSTOMIZED HEAVY-DUTY DUMP FLEET",
          description: "Menyediakan armada dump truck kustom bersasis ekstra kuat dan bak besi berdaya tahan tinggi untuk memangkas waktu dump muatan."
        }
      ]
    };
  }

  // DEFAULT / GENERAL / DYNAMIC
  return {
    sectorName: displayTitle,
    b2bSubtitle: `Empat taktik andalan tim penjualan Pancaran Group untuk memenangkan tender proyek "${displayTitle}".`,
    audiences: [
      {
        id: "aud-1",
        name: `Pemilik Proyek Utama (${displayTitle})`,
        tier: "Tier-1 Utama",
        need: "Layanan angkutan kargo berkapasitas besar dengan kepastian jadwal, jaminan K3LL, dan armada terawat.",
        matchIndex: 95,
        stabilityWeight: "Sangat Tinggi"
      },
      {
        id: "aud-2",
        name: "Kontraktor & Mitra Distribusi Strategis",
        tier: "Tier-1 Utama",
        need: "Armada angkut heavy-duty dengan pemantauan posisi live GPS dan fleksibilitas rute pengiriman.",
        matchIndex: 88,
        stabilityWeight: "Sangat Tinggi"
      },
      {
        id: "aud-3",
        name: "Perusahaan Manufaktur & Pusat Distribusi Regional",
        tier: "Tier-2 Sekunder",
        need: "Layanan logistik terjadwal dengan kepastian harga dan transparansi biaya operasional.",
        matchIndex: 82,
        stabilityWeight: "Tinggi"
      },
      {
        id: "aud-4",
        name: "Pengembang & Pemasok Bahan Baku",
        tier: "Tier-3 Niche",
        need: "Pengangkutan kargo kustom sesuai kebutuhan spesifikasi muatan.",
        matchIndex: 75,
        stabilityWeight: "Sedang"
      }
    ],
    channels: [
      {
        id: "chan-1",
        channelName: "Direct B2B Executive Advocacy",
        costEstimate: 70000000,
        conversionRate: 25,
        impactLevel: "Sangat Tinggi",
        details: "Presentasi solusi logistik terintegrasi dan demonstrasi dashboard pemantauan live."
      },
        {
          id: "chan-2",
          channelName: "Pameran & Forum Industri Logistik Nasional",
          costEstimate: 100000000,
          conversionRate: 18,
          impactLevel: "Tinggi",
          details: "Memperkenalkan keunggulan armada dan standar keselamatan Pancaran Group."
        },
        {
          id: "chan-3",
          channelName: "Digital B2B Lead Generation Campaign",
          costEstimate: 40000000,
          conversionRate: 12,
          impactLevel: "Sedang",
          details: "Promosi terarah kepada pembuat keputusan logistik di kawasan industri target."
        }
    ],
    tactics: [
      {
        code: "TAKTIK 01",
        tag: "INTEGRATED PACKAGE",
        title: "INTEGRATED LOGISTICS PACKAGE",
        description: `Menawarkan satu harga terintegrasi yang mencakup seluruh alur pengangkutan untuk proyek ${displayTitle}.`
      },
      {
        code: "TAKTIK 02",
        tag: "LIVE TELEMATICS",
        title: "DYNAMIC DIGITAL DASHBOARD MOCK",
        description: "Memberikan akses gratis (Trial-Mode) 14 hari ke portal telemetri GPS hibrida Pancaran untuk membuktikan keandalan pelacakan muatan."
      },
      {
        code: "TAKTIK 03",
        tag: "BACKHAUL DISCOUNT",
        title: "SHARED PAYLOAD BACKHAUL DISCOUNT",
        description: "Memberikan diskon tarif khusus 15% jika armada truk kosong setelah pengantaran diizinkan mengangkut muatan balik."
      },
      {
        code: "TAKTIK 04",
        tag: "CUSTOM VEHICLES",
        title: "CUSTOMIZED HEAVY FLEET",
        description: "Menyediakan unit kendaraan kustom yang disesuaikan khusus untuk karakteristik muatan proyek."
      }
    ]
  };
}

// ==========================================
// 3. RISK PROFILE HELPER
// ==========================================
export interface RiskItem {
  id: string;
  code: string;
  category: "Operasional" | "Regulasi/Kepatuhan" | "Finansial" | "Sosial/Lingkungan";
  title: string;
  likelihood: number;
  impact: number;
  description: string;
  negativeImpactAnalysis: string;
  mitigationStrategy: string;
}

export interface SectorRiskProfile {
  sectorName: string;
  risks: RiskItem[];
}

export function getSectorRiskProfile(projectTitle: string): SectorRiskProfile {
  const titleLower = (projectTitle || "").toLowerCase();
  const displayTitle = projectTitle || "Logistik Strategis";

  // 1. WASTE MANAGEMENT
  if (
    titleLower.includes("limbah") ||
    titleLower.includes("waste") ||
    titleLower.includes("b3") ||
    titleLower.includes("sampah") ||
    titleLower.includes("recycle") ||
    titleLower.includes("daur ulang") ||
    titleLower.includes("lingkungan")
  ) {
    return {
      sectorName: "Pengolahan Limbah & B3",
      risks: [
        {
          id: "risk-1",
          code: "RSK-01",
          category: "Operasional",
          title: "Kebocoran Tumpahan B3 / Kerusakan Kompartemen Tangki",
          likelihood: 2,
          impact: 5,
          description: "Kerusakan seal atau insiden kecelakaan yang menyebabkan tumpahan bahan beracun berbahaya di jalur umum.",
          negativeImpactAnalysis: "Pencemaran lingkungan serius, penghentian izin operasional oleh KLHK, denda pidana hukum, dan rusaknya reputasi perusahaan.",
          mitigationStrategy: "Penggunaan tangki berlapis anti-korosi berinspeksi rutin, perlengkapan Spill-Kit otomatis di setiap truk, dan tim Tanggap Darurat B3 24/7."
        },
        {
          id: "risk-2",
          code: "RSK-02",
          category: "Regulasi/Kepatuhan",
          title: "Ketidaksesuaian Dokumen Festronik / E-Manifest KLHK",
          likelihood: 2,
          impact: 4,
          description: "Masa berlaku izin angkut B3 kadaluarsa atau perbedaan volume muatan fisik dengan e-manifest digital.",
          negativeImpactAnalysis: "Penyitaan armada di pos pemeriksaan, sanksi administratif dari Kementerian LHK, serta pembatalan kontrak dari klien industri.",
          mitigationStrategy: "Sistem validasi dokumen otomatis Festronik di portal Pancaran sebelum truk berangkat dari pool, warning system 60 hari sebelum masa berlaku izin habis."
        },
        {
          id: "risk-3",
          code: "RSK-03",
          category: "Finansial",
          title: "Fluktuasi Biaya Pengolahan & Bahan Bakar Armada",
          likelihood: 4,
          impact: 3,
          description: "Kenaikan harga BBM industri dan tarif pemusnahan limbah di fasilitas pengolah pihak ketiga.",
          negativeImpactAnalysis: "Penurunan margin keuntungan bersih proyek jika nilai kontrak bersifat tetap tanpa penyesuaian.",
          mitigationStrategy: "Penerapan klausul eskalasi biaya BBM/pengolahan dalam kontrak B2B serta kerja sama kemitraan volume jangka panjang."
        },
        {
          id: "risk-4",
          code: "RSK-04",
          category: "Sosial/Lingkungan",
          title: "Penolakan Masyarakat Sekitar Rute Lintasan Limbah",
          likelihood: 3,
          impact: 3,
          description: "Kekhawatiran warga sekitar terhadap bau atau potensi bahaya kesehatan dari lalu lintas pengangkutan limbah.",
          negativeImpactAnalysis: "Aksi pemblokiran jalan oleh warga, penundaan jadwal hauling, dan potensi perselisihan publik.",
          mitigationStrategy: "Penggunaan armada truk box/tangki kedap udara, sosialisasi program CSR lingkungan, dan penentuan rute khusus yang menghindari pemukiman padat."
        }
      ]
    };
  }

  // 2. MINING / PERTAMBANGAN
  if (
    titleLower.includes("mining") ||
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("smelter") ||
    titleLower.includes("mineral")
  ) {
    return {
      sectorName: "Logistik Pertambangan & Mineral",
      risks: [
        {
          id: "risk-1",
          code: "RSK-01",
          category: "Operasional",
          title: "Kerusakan Jalan Hauling Tambang & Slip Cuaca Hujan",
          likelihood: 4,
          impact: 4,
          description: "Jalan hauling licin dan berlubang akibat curah hujan tinggi yang menyebabkan truk amblas atau terguling.",
          negativeImpactAnalysis: "Keterlambatan pengiriman ore ke port, downtime armada tinggi, dan peningkatan biaya pemeliharaan kaki-kaki truk.",
          mitigationStrategy: "Armada dump truck 6x4 heavy-duty bersistem differential lock ganda, tim pemeliharaan grader jalan cepat, dan instruksi K3 cuaca buruk."
        },
        {
          id: "risk-2",
          code: "RSK-02",
          category: "Regulasi/Kepatuhan",
          title: "Keterlambatan Integrasi SIMBARA ESDM & RKAB",
          likelihood: 2,
          impact: 5,
          description: "Ketidakcocokan input data tonase hauling dengan sistem pengawasan mineral resmi pemerintah.",
          negativeImpactAnalysis: "Penghentian penerbitan Surat Angkut Mineral (LHV/LHB), pemblokiran barging di dermaga, dan denda administratif.",
          mitigationStrategy: "Integrasi timbangan digital otomatis RFID di stockpile yang terhubung langsung ke portal pelaporan SIMBARA."
        },
        {
          id: "risk-3",
          code: "RSK-03",
          category: "Finansial",
          title: "Lonjakan Harga Solar Industri & Suku Cadang Heavy-Duty",
          likelihood: 4,
          impact: 3,
          description: "Kenaikan harga BBM solar industri pertambangan dan depresiasi nilai tukar suku cadang impor.",
          negativeImpactAnalysis: "Pengikisan margin operasional hauling hingga 12-18%.",
          mitigationStrategy: "Klausul penyesuaian harga BBM otomatis (Fuel Escalation Clause) dan kontrak pasokan suku cadang konsinyasi dengan agen tunggal."
        },
        {
          id: "risk-4",
          code: "RSK-04",
          category: "Sosial/Lingkungan",
          title: "Tuntutan / Isu Lingkungan Debu Pengangkutan",
          likelihood: 3,
          impact: 3,
          description: "Dampak debu hauling ore/batubara di area perbatasan jalan publik dan desa penyangga.",
          negativeImpactAnalysis: "Protes warga lokal, potensi penutupan akses perlintasan, dan sanksi audit lingkungan.",
          mitigationStrategy: "Penyiraman jalan hauling berkala dengan water truck, pemasangan terpal penutup muatan otomatis, dan program CSR pemberdayaan lokal."
        }
      ]
    };
  }

  // DEFAULT / GENERAL
  return {
    sectorName: displayTitle,
    risks: [
      {
        id: "risk-1",
        code: "RSK-01",
        category: "Operasional",
        title: `Kendala Keandalan Armada & Downtime Rute (${displayTitle})`,
        likelihood: 3,
        impact: 4,
        description: "Potensi gangguan teknis atau kemacetan di rute pengiriman utama yang dapat menghambat SLA pengiriman.",
        negativeImpactAnalysis: "Keterlambatan penerimaan kargo, potensi penalti keterlambatan kontrak B2B, dan pembengkakan biaya lembur.",
        mitigationStrategy: "Program pemeliharaan pencegahan (preventive maintenance) berkala, penyediaan unit cadangan, dan pemantauan GPS telemetri 24/7."
      },
      {
        id: "risk-2",
        code: "RSK-02",
        category: "Regulasi/Kepatuhan",
        title: "Perubahan Regulasi Angkutan & Perizinan Jalan",
        likelihood: 2,
        impact: 4,
        description: "Pemeriksaan tonase muatan (ODOL) atau perpanjangan izin operasional angkutan khusus.",
        negativeImpactAnalysis: "Risiko penahanan armada di timbangan atau sanksi administratif dari pihak berwenang.",
        mitigationStrategy: "Pemasangan sensor timbangan gandar IoT internal, audit legalitas berjadwal, dan kepatuhan penuh pada aturan perhubungan."
      },
      {
        id: "risk-3",
        code: "RSK-03",
        category: "Finansial",
        title: "Volatilitas Biaya Operasional & Bahan Bakar",
        likelihood: 4,
        impact: 3,
        description: "Kenaikan harga bahan bakar dan biaya suku cadang kendaraan secara mendadak.",
        negativeImpactAnalysis: "Pengikisan margin keuntungan bersih jika tarif jasa angkutan tidak fleksibel.",
        mitigationStrategy: "Menerapkan klausul penyesuaian harga BBM (fuel adjustment clause) dan negosiasi pasokan bahan bakar curah."
      },
      {
        id: "risk-4",
        code: "RSK-04",
        category: "Sosial/Lingkungan",
        title: "Gangguan Akses Jalur & Komunikasi Masyarakat Local",
        likelihood: 2,
        impact: 3,
        description: "Perselisihan penggunaan jalur perlintasan publik dengan masyarakat sekitar rute proyek.",
        negativeImpactAnalysis: "Potensi penundaan perjalanan dan gangguan keamanan operasional.",
        mitigationStrategy: "Program hubungan masyarakat (CSR) terarah dan pelibatan tenaga kerja lokal secara proporsional."
      }
    ]
  };
}

// ==========================================
// 4. CAC / LTV PROFILE HELPER
// ==========================================
export interface SectorCacLtvProfile {
  sectorNote: string;
  defaultAvgRevenuePerMonth: number;
  cacCosts: Array<{
    id: string;
    name: string;
    category: "Komersial" | "Teknis Operasional" | "Legalitas & K3";
    costIDR: number;
  }>;
}

export function getSectorCacLtvProfile(projectTitle: string): SectorCacLtvProfile {
  const titleLower = (projectTitle || "").toLowerCase();

  if (
    titleLower.includes("limbah") ||
    titleLower.includes("waste") ||
    titleLower.includes("b3") ||
    titleLower.includes("sampah")
  ) {
    return {
      sectorNote: "Rantai pasok industri pengolahan limbah & B3 memiliki durasi kontrak rata-rata 3-5 tahun berkat kewajiban izin Festronik KLHK.",
      defaultAvgRevenuePerMonth: 55000000,
      cacCosts: [
        { id: "cac-1", name: "Jaminan Tender & Lisensi B3 (Tender Bond)", category: "Legalitas & K3", costIDR: 15000000 },
        { id: "cac-2", name: "Survey Verifikasi Rute & Fasilitas Pemusnahan", category: "Teknis Operasional", costIDR: 8000000 },
        { id: "cac-3", name: "Trial Run Tangki B3 / Compactor (BBM & Driver)", category: "Teknis Operasional", costIDR: 14000000 },
        { id: "cac-4", name: "Penyusunan Proposal Komersial & Audit Festronik", category: "Komersial", costIDR: 6000000 },
        { id: "cac-5", name: "Sertifikasi K3LL & Spill-Kit Emergency Audit", category: "Legalitas & K3", costIDR: 5000000 }
      ]
    };
  }

  if (
    titleLower.includes("mining") ||
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("batubara")
  ) {
    return {
      sectorNote: "Kontrak hauling pertambangan & smelter umumnya berdurasi 3 hingga 5 tahun dengan kepastian jaminan ritase minimum.",
      defaultAvgRevenuePerMonth: 85000000,
      cacCosts: [
        { id: "cac-1", name: "Jaminan Tender & Kualifikasi Pit (Tender Bond)", category: "Legalitas & K3", costIDR: 20000000 },
        { id: "cac-2", name: "Survey Geometri Jalan Hauling & Jembatan Tambang", category: "Teknis Operasional", costIDR: 12000000 },
        { id: "cac-3", name: "Trial Run Dump Truck Heavy-Duty (Simulasi Pit-Port)", category: "Teknis Operasional", costIDR: 18000000 },
        { id: "cac-4", name: "Penyusunan Proposal & Presentasi Komersial", category: "Komersial", costIDR: 7000000 },
        { id: "cac-5", name: "Audit CSMS Pertambangan & Sertifikasi SIMBARA", category: "Legalitas & K3", costIDR: 6000000 }
      ]
    };
  }

  return {
    sectorNote: `Rantai pasok proyek "${projectTitle || "Logistik Strategis"}" memiliki durasi kontrak rata-rata 2 hingga 3 tahun.`,
    defaultAvgRevenuePerMonth: 45000000,
    cacCosts: [
      { id: "cac-1", name: "Jaminan Tender (Tender Bond / Admin)", category: "Legalitas & K3", costIDR: 12000000 },
      { id: "cac-2", name: "Survey Rute & Kelayakan Jalur Pengiriman", category: "Teknis Operasional", costIDR: 8500000 },
      { id: "cac-3", name: "Trial Run Uji Coba Armada Kosong & Bermuatan", category: "Teknis Operasional", costIDR: 15000000 },
      { id: "cac-4", name: "Biaya Presentasi & Proposal Komersial", category: "Komersial", costIDR: 5000000 },
      { id: "cac-5", name: "Penyusunan Berkas Audit K3 / CSMS", category: "Legalitas & K3", costIDR: 4500000 }
    ]
  };
}
