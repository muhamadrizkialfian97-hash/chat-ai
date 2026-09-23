export interface AcademicMakalahData {
  bannerTitle: string;
  subtitle: string;
  topic: string;
  reviewType: string;
  formatLabel: string;
  shortTitle: string;
  markdownContent: string;
  categoryType: "market_opportunity" | "strategic_paper";
  sections: {
    sector1?: {
      title: string;
      globalItems: Array<{ label: string; text: string }>;
      nationalItems: Array<{ label: string; text: string }>;
      keyTakeaway: string;
    };
    sector2?: {
      title: string;
      globalItems: Array<{ label: string; text: string }>;
      nationalItems: Array<{ label: string; text: string }>;
      keyTakeaway: string;
    };
    matrix4Col?: Array<{
      sector: string;
      segment: string;
      global: string;
      national: string;
    }>;
    pendahuluan?: {
      latarBelakang: string;
      rumusanMasalah: string[];
    };
    globalOverview?: {
      trenGlobal: string;
      faktorPendorong: string[];
      inovasiTeknologi: string;
      calloutPilar: string;
    };
    nationalOverview?: {
      karakteristik: string;
      modaTransportasi: Array<{ name: string; desc: string }>;
      tantanganUtama: Array<{ name: string; desc: string }>;
    };
    analisisStrategis?: {
      intro: string;
      matrix: Array<{
        dimensi: string;
        standarGlobal: string;
        solusiNasional: string;
      }>;
    };
    kesimpulanSaran?: {
      kesimpulan: string;
      saran: string[];
      footerNote: string;
    };
  };
}

/**
 * Generate exact 3-page Market Opportunity Makalah (matching the sample PDF)
 * adapts dynamically to any project title / domain.
 */
export function generateMarketOpportunityMakalah(
  projectTitle: string,
  pillarNumber: number = 1,
  pillarTitle: string = "Analisis Peluang Pasar",
  activeDivision: string = "Logistik Darat"
): AcademicMakalahData {
  const pName = (projectTitle || "Kajian Manajemen Transportasi").trim();
  const lower = pName.toLowerCase();

  // Detect domain
  let sector1Name = "FROST MANAGEMENT TRANSPORT (LOGISTIK RANTAI DINGIN)";
  let sector1Short = "Cold Chain";
  let sector2Name = "FORESTRY MANAGEMENT TRANSPORTATION (LOGISTIK KEHUTANAN & KAYU)";
  let sector2Short = "Forestry Transport";
  let topicHeader = "Cold Chain & Forest Logistics";
  let subtitle = "Frost Management Transport & Forestry Management Transportation (Global vs. National Overview)";

  // Dynamic customization based on project title
  if (lower.includes("tambang") || lower.includes("batubara") || lower.includes("coal") || lower.includes("mining")) {
    sector1Name = "MINING BULK HAULING (LOGISTIK HAULING BATUBARA & MINERAL)";
    sector1Short = "Mining Hauling";
    sector2Name = "HEAVY EQUIPMENT & BULK SUPPLY TRANSPORT (LOGISTIK ALAT BERAT & ENERGI)";
    sector2Short = "Heavy Hauling";
    topicHeader = "Mining Hauling & Heavy Logistics";
    subtitle = `${pName} & Mining Hauling Fleet (Global vs. National Overview)`;
  } else if (lower.includes("sawit") || lower.includes("cpo") || lower.includes("minyak")) {
    sector1Name = "CPO & LIQUID BULK TRANSPORT (LOGISTIK CURAH CAIR SAWIT)";
    sector1Short = "CPO Liquid Bulk";
    sector2Name = "PLANTATION ESTATE & FERTILIZER TRANSPORT (LOGISTIK KEBUN & PUPUK)";
    sector2Short = "Estate Transport";
    topicHeader = "CPO Bulk & Estate Logistics";
    subtitle = `${pName} & Plantation Transportation (Global vs. National Overview)`;
  } else if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter")) {
    sector1Name = "NICKEL ORE HAULING & SMELTER SUPPLY (LOGISTIK BIJIH NIKEL & SMELTER)";
    sector1Short = "Nickel Ore Hauling";
    sector2Name = "INDUSTRIAL SLAG & REFINED METAL TRANSPORT (LOGISTIK LOGAM OLAHAN & SLAG)";
    sector2Short = "Smelter Logistics";
    topicHeader = "Nickel Ore & Smelter Logistics";
    subtitle = `${pName} & Smelter Supply (Global vs. National Overview)`;
  } else if (lower.includes("hutan") || lower.includes("forestry") || lower.includes("kayu") || lower.includes("timber")) {
    sector1Name = "FROST MANAGEMENT TRANSPORT (LOGISTIK RANTAI DINGIN)";
    sector1Short = "Cold Chain";
    sector2Name = "FORESTRY MANAGEMENT TRANSPORTATION (LOGISTIK KEHUTANAN & KAYU)";
    sector2Short = "Forestry Transport";
    topicHeader = "Cold Chain & Forest Logistics";
    subtitle = "Frost Management Transport & Forestry Management Transportation (Global vs. National Overview)";
  } else if (lower.includes("cold") || lower.includes("dingin") || lower.includes("frost") || lower.includes("farmasi") || lower.includes("makanan")) {
    sector1Name = "FROST MANAGEMENT TRANSPORT (LOGISTIK RANTAI DINGIN)";
    sector1Short = "Cold Chain";
    sector2Name = "PERISHABLE FOOD & PHARMACEUTICAL TRANSPORT (LOGISTIK BAHAN SEGAR & FARMASI)";
    sector2Short = "Pharma & Fresh Food";
    topicHeader = "Cold Chain & Temperature Logistics";
    subtitle = `${pName} & Temperature Controlled Transport (Global vs. National Overview)`;
  } else if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("charging") || lower.includes("spklu") || lower.includes("kblbb")) {
    sector1Name = "COMMERCIAL ELECTRIC VEHICLE LOGISTICS (LOGISTIK ARMADA KENDARAAN LISTRIK)";
    sector1Short = "Commercial EV Fleet";
    sector2Name = "GREEN DEPOT & CHARGING INFRASTRUCTURE (INFRASTRUKTUR CHARGING & LOGISTIK HIJAU)";
    sector2Short = "Green Depot Logistics";
    topicHeader = "Electric Commercial Fleet & Green Logistics";
    subtitle = `${pName}: Transisi Armada Rendah Emisi & Infrastruktur SPKLU (Global vs. National Overview)`;
  } else {
    sector1Name = `${pName.toUpperCase()} (TRANSPORTASI & LOGISTIK UTAMA)`;
    sector1Short = "Main Logistics";
    sector2Name = "MULTIMODAL FLEET & INDUSTRIAL SUPPLY CHAIN (LOGISTIK MULTIMODA & INDUSTRI)";
    sector2Short = "Multimodal Fleet";
    topicHeader = "Industrial Logistics & Fleet Management";
    subtitle = `${pName}: Analisis Komprehensif (Global vs. National Overview)`;
  }

  const bannerTitle = "ANALISIS PELUANG PASAR (MARKET OPPORTUNITY)";
  const aspect = "Market Opportunity";
  const formatLabel = "Dokumen Laporan";
  const shortTitle = "Analisis Peluang Pasar (Market Opportunity) - Manajemen Transportasi";

  // Data for Sector 1
  let s1GlobalItems = [
    {
      label: "Nilai Pasar & Pertumbuhan Pesat",
      text: "Pasar logistik rantai dingin global diperkirakan terus tumbuh pesat dari kisaran USD 360–400 Miliar dan diproyeksikan melebihi USD 1 Triliun pada kurun waktu 2030–2034 dengan CAGR berkisar 10–14%."
    },
    {
      label: "Ledakan Sektor Farmasi & Bioteknologi",
      text: "Meningkatnya distribusi global untuk produk biologi, vaksin tingkat lanjut (termasuk penyimpanan suhu ultra-rendah -80°C), serta obat-obatan sensitif suhu."
    },
    {
      label: "E-Commerce Makanan & Bahan Segar (E-Grocery)",
      text: "Perubahan perilaku konsumen global yang menginginkan pengiriman makanan beku (frozen foods), olahan susu, dan buah segar secara langsung mendorong permintaan tinggi akan micro-fulfillment center dingin dan armada last-mile bersuhu terkontrol."
    }
  ];

  let s1NatItems = [
    {
      label: "Potensi Ekonomi & Nilai Pasar Domestik",
      text: "Pasar cold chain Indonesia diperkirakan bernilai USD 3,5–5,5 Miliar dan diproyeksikan berlipat ganda dengan CAGR mencapai 9%–14%."
    },
    {
      label: "Kebutuhan Ekspor Komoditas Perikanan & Kelautan",
      text: "Ekspor perikanan Indonesia (seperti udang, tuna, dan cumi) menyumbang nilai lebih dari USD 6 Miliar. Keberhasilan sektor ini bergantung penuh pada armada reefer dan cold storage yang dapat menjaga kualitas ekspor sesuai standar AS, Tiongkok, dan Eropa."
    },
    {
      label: "Peluang Logistik Antar-Pulau & Pemerataan",
      text: "Konsentrasi konsumen terbesar berada di Pulau Jawa, sedangkan sentra produksi perikanan dan pertanian berada di wilayah Timur Indonesia (Sulawesi, Maluku, Papua). Ini membuka peluang besar bagi layanan transportasi darat dan antar-hub pendingin terpadu."
    }
  ];

  let s1Takeaway = "Peluang terbesar terletak pada penyediaan fasilitas pendingin berbasis IoT dan armada reefer terintegrasi untuk menghubungkan sentra produksi di Indonesia Timur dengan pasar ekspor dan pusat konsumen Jawa.";

  // Adapt Sector 1 for Mining if project is mining
  if (lower.includes("tambang") || lower.includes("batubara") || lower.includes("coal") || lower.includes("mining")) {
    s1GlobalItems = [
      {
        label: "Nilai Pasar & Permintaan Energi Global",
        text: "Pasar pengangkutan komoditas tambang curah global bernilai lebih dari USD 450 Miliar didorong tingginya permintaan bahan baku industri dan kestabilan rantai pasok energi global."
      },
      {
        label: "Otomasi & Telemetri Armada Tambang",
        text: "Penerapan sistem dispatching otomatis, telemetri pemantauan konsumsi bahan bakar, dan armada berkapasitas muat tinggi (double trailer / high-capacity dump truck)."
      },
      {
        label: "Kepatuhan Standar Keselamatan & K3 Global",
        text: "Standar keselamatan ketat seperti ISO 39001 (Road Traffic Safety Management) dan ICMM menjadi prasyarat mutlak bagi kontraktor logistik tambang modern."
      }
    ];
    s1NatItems = [
      {
        label: "Produksi Batubara Nasional & Kebutuhan Hauling",
        text: "Target produksi batubara nasional melebihi 700–800 Juta Ton/tahun membutuhkan jutaan ritase hauling jalan khusus dari tambang (*pit*) ke pelabuhan (*jetty*)."
      },
      {
        label: "Regulasi Jalan Khusus & Kepatuhan ODOL",
        text: "Kewajiban pengangkutan melalui jalan hauling khusus dan pemenuhan regulasi batas tonase menciptakan ceruk pasar bagi pengelola jalan logistik berstandar tinggi."
      },
      {
        label: "Optimalisasi Efisiensi Biaya Per Tonase",
        text: "Persaingan harga komoditas menuntut kontraktor logistik yang mampu menekan biaya transportasi per tonase (Cost per Ton) melalui pemeliharaan preventif armada dan manajemen ban."
      }
    ];
    s1Takeaway = "Peluang terbesar terletak pada manajemen rute jalan hauling khusus yang terintegrasi dengan telemetri telematik guna menekan cost per tonase dan menjamin keandalan ritase 24/7.";
  } else if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("charging") || lower.includes("spklu") || lower.includes("kblbb")) {
    s1GlobalItems = [
      {
        label: "Pertumbuhan Pesat Armada Komersial Listrik Global",
        text: "Pasar kendaraan komersial listrik (Commercial EV) global diproyeksikan melonjak dari USD 85 Miliar menuju lebih dari USD 550 Miliar hingga 2032 dengan CAGR di atas 24%, didorong komitmen Net-Zero Emission korporasi global."
      },
      {
        label: "Efisiensi Total Cost of Ownership (TCO) & Baterai LFP/NMC",
        text: "Penurunan biaya produksi sel baterai dan efisiensi konsumsi energi kWh/km menekan biaya operasional kendaraan listrik hingga 40–50% lebih hemat dibandingkan armada diesel konvensional."
      },
      {
        label: "Standar Pelaporan ESG & Regulasi Emisi Karbon Internasional",
        text: "Regulasi global seperti Scope 3 Carbon Emissions Reporting mewajibkan emiten multinasional dan korporasi rantai pasok untuk bermitra dengan penyedia armada transportasi rendah emisi."
      }
    ];
    s1NatItems = [
      {
        label: "Mandatori Percepatan KBLBB & Insentif Fiskal Nasional",
        text: "Pemberlakuan Perpres No. 55/2019 dan revisinya memberikan pembebasan bea masuk, pajak BBNKB/PKB 0%, serta pembebasan aturan ganjil-genap bagi armada komersial bertenaga listrik."
      },
      {
        label: "Permintaan Korporat FMCG, E-Commerce, & BUMN",
        text: "Perusahaan logistik perkotaan, distributor retail FMCG, dan platform e-commerce nasional aktif mencari mitra penyedia armada van dan truk ringan listrik untuk rute perkotaan berorientasi Green Logistics."
      },
      {
        label: "Dukungan Tarif Curah SPKLU PLN untuk Depo Swasta",
        text: "PLN menyediakan skema insentif tarif curah khusus dan diskon pengisian daya malam hari (overnight charging) bagi depo armada komersial, memperbesar kelayakan marjin laba proyek logistik listrik."
      }
    ];
    s1Takeaway = "Peluang terbesar terletak pada penyediaan ekosistem Fleet-as-a-Service EV terintegrasi (unit armada + fasilitas smart charging depo + telematika BMS) bagi korporasi yang mengejar target dekarbonisasi ESG.";
  }

  // Data for Sector 2 (Forestry / Wood Logistics)
  let s2GlobalItems = [
    {
      label: "Nilai Pasar Logistik Kehutanan",
      text: "Pasar pengangkutan produk kayu (forest products trucking & logistics) bernilai lebih dari USD 220–230 Miliar dan diproyeksikan tumbuh mencapai USD 300 Miliar dengan CAGR sekitar 6%."
    },
    {
      label: "Tren Konstruksi Kayu Modern (Mass Timber)",
      text: "Tingginya permintaan Cross-Laminated Timber (CLT) dan glulam dalam tren bangunan ramah lingkungan global melipatgandakan kebutuhan transportasi logistik kayu raksasa berefisiensi tinggi."
    },
    {
      label: "Pasar Energi Biomassa (Renewable Energy)",
      text: "Peralihan energi global menuju biomassa meningkatkan kebutuhan transportasi serpihan kayu (wood chips) dan limbah hutan secara masif dari area tebangan ke pembangkit listrik."
    }
  ];

  let s2NatItems = [
    {
      label: "Pasar Industri Pulp, Paper, dan Kayu Olahan",
      text: "Indonesia memiliki Hutan Tanaman Industri (HTI) yang masif di Sumatra dan Kalimantan. Pemenuhan pasokan kayu bulat (log) ke pabrik pulp & paper serta plywood membutuhkan kapasitas truk logging darat dan armada tongkang sungai yang konstan dan efisien."
    },
    {
      label: "Sertifikasi & Kepatuhan Pasar Ekspor (SVLK/EUDR)",
      text: "Pasar luar negeri mewajibkan verifikasi rantai lacak (traceability) kayu yang ketat. Hal ini menciptakan peluang bisnis bagi penyedia layanan logistik pintar yang mampu mengintegrasikan pelacakan GPS/RFID muatan kayu dengan portal resmi pemerintah (SIPUHH/SVLK)."
    },
    {
      label: "Peluang Efisiensi Infrastruktur Swasta",
      text: "Tingginya angka kerusakan jalan hutan saat musim hujan membuka peluang bagi perusahaan logistik kehutanan yang dapat menyediakan teknologi pemetaan rute berbasis GIS untuk menekan biaya depresiasi armada dan bahan bakar."
    }
  ];

  let s2Takeaway = "Integrasi sistem pelacakan digital (SVLK/SIPUHH) serta manajemen rute GIS pada moda angkut multimoda (truk + tongkang) menjadi kunci menangkap peluang pasar kayu olahan dan biomassa.";

  if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("charging") || lower.includes("spklu") || lower.includes("kblbb")) {
    s2GlobalItems = [
      {
        label: "Ekspansi Mega-Depot & Fast-Charging Network Global",
        text: "Penyedia logistik global berinvestasi besar pada stasiun pengisian Megawatt Charging System (MCS) dan perangkat lunak penjadwalan cerdas (Smart Fleet Charging) untuk meminimalkan waktu henti (downtime)."
      },
      {
        label: "Model Bisnis Battery-as-a-Service (BaaS) & Swapping",
        text: "Penggunaan teknologi penukaran baterai kilat (Battery Swapping) dan pemisahan kepemilikan baterai dari sasis kendaraan mengurangi kebutuhan modal awal Capex hingga 35%."
      },
      {
        label: "Integrasi Energi Terbarukan Depo (Solar PV + ESS)",
        text: "Pemanfaatan sistem panel surya atap (Rooftop Solar PV) yang dipadukan dengan Energy Storage System (ESS) di depo logistik memungkinkan penyedia armada memproduksi listrik mandiri berbiaya sangat rendah."
      }
    ];
    s2NatItems = [
      {
        label: "Peluang Kemitraan Strategis Kawasan Industri & Depo B2B",
        text: "Kawasan industri besar seperti MM2100, GIIC Cikarang, dan KIIC Karawang membutuhkan depo transit khusus yang dilengkapi SPKLU daya tinggi untuk armada angkutan barang antar-pabrik."
      },
      {
        label: "Penghematan Biaya Pemeliharaan (Maintenance Cost) hingga 60%",
        text: "Ketiadaan komponen mesin pembakaran internal (tanpa oli mesin, filter, busi, dan transmisi rumit) memangkas biaya pemeliharaan berkala kendaraan hingga lebih dari 50% dibanding truk diesel."
      },
      {
        label: "Sinergi Hilirisasi Ekosistem Baterai Kendaraan Listrik Nasional",
        text: "Pembangunan pabrik sel baterai lokal (konsorsium IBC / Hyundai-LG) di Indonesia menjamin ketersediaan suku cadang baterai dan paket penggantian dengan harga terjangkau dalam jangka panjang."
      }
    ];
    s2Takeaway = "Sinergi penyediaan armada EV dengan instalasi depo charging berdaya tinggi dan pemanfaatan insentif tarif PLN menjamin keunggulan biaya operasional terendah di pasar.";
  }

  // Matriks 4 Kolom (Exact Match to Screenshot Page 3)
  const matrix4Col = [
    {
      sector: sector1Short === "Cold Chain" ? "Frost Management Transport (Cold Chain)" : sector1Name,
      segment: sector1Short === "Cold Chain" ? "Farmasi, E-Grocery, Perikanan, Makanan Beku" : sector1Short === "Commercial EV Fleet" ? "FMCG, E-Commerce, Korporasi Multinasional, BUMN" : "Industri Manufaktur, Pertambangan, Distribusi Curah",
      global: sector1Short === "Commercial EV Fleet" ? "• CAGR >24% per tahun\n• Pengurangan TCO 40–50%\n• Standar kepatuhan emisi Scope 3" : "• CAGR >10% per tahun\n• Integrasi IoT & ultra-cold chain\n• Micro-fulfillment center dingin",
      national: sector1Short === "Commercial EV Fleet" ? "• Insentif Perpres 55 & bebas ganjil-genap\n• Adopsi korporat FMCG & ritel hijau\n• Dukungan tarif curah SPKLU PLN" : "• Nilai pasar tembus >USD 7 Miliar\n• Logistik komoditas ekspor bernilai tinggi\n• Armada terintegrasi antar-sentra produksi & konsumsi"
    },
    {
      sector: sector2Short === "Forestry Transport" ? "Forestry Management Transport (Logistik Kayu)" : sector2Name,
      segment: sector2Short === "Forestry Transport" ? "HTI, Pulp & Paper, Biomassa, Mass Timber" : sector2Short === "Green Depot Logistics" ? "Depo Hub Logistik, Kawasan Industri, Operator SPKLU" : "Rantai Pasok Pabrik, Material Konstruksi, Komoditas Olahan",
      global: sector2Short === "Green Depot Logistics" ? "• Mega-depot Megawatt Charging\n• Battery-as-a-Service (BaaS)\n• Integrasi Solar PV + ESS" : "• Industri pengangkutan USD 230–300M\n• Logistik biomassa & kayu konstruksi\n• Standar kepatuhan & efisiensi tinggi",
      national: sector2Short === "Green Depot Logistics" ? "• Smart depot charging kawasan industri\n• Efisiensi biaya maintenance >50%\n• Hilirisasi rantai pasok baterai nasional" : "• Efisiensi angkutan multimoda (Truk + Tongkang)\n• Integrasi pelacakan dokumen resmi digital\n• Optimasi rute GIS jalur industri darat"
    }
  ];

  // Assemble Markdown for UI & Export
  let md = `# ${bannerTitle}\n\n`;
  md += `**SUBTITLE:** ${subtitle}  \n`;
  md += `**Topik:** ${topicHeader}  \n`;
  md += `**Aspek Kajian:** ${aspect}  \n`;
  md += `**Format:** ${formatLabel}  \n\n`;
  md += `---\n\n`;

  // Page 1: Sector 1
  md += `## 1. ${sector1Name}\n\n`;
  md += `### 1.1 Peluang Pasar Global (Global Market Opportunity)\n\n`;
  s1GlobalItems.forEach(item => {
    md += `• **${item.label}:** ${item.text}\n\n`;
  });

  md += `### 1.2 Peluang Pasar Nasional (Indonesia)\n\n`;
  s1NatItems.forEach(item => {
    md += `• **${item.label}:** ${item.text}\n\n`;
  });

  md += `> **Key Takeaway - ${sector1Short}:**\n> ${s1Takeaway}\n\n`;

  // Page 2: Sector 2
  md += `## 2. ${sector2Name}\n\n`;
  md += `### 2.1 Peluang Pasar Global (Global Market Opportunity)\n\n`;
  s2GlobalItems.forEach(item => {
    md += `• **${item.label}:** ${item.text}\n\n`;
  });

  md += `### 2.2 Peluang Pasar Nasional (Indonesia)\n\n`;
  s2NatItems.forEach(item => {
    md += `• **${item.label}:** ${item.text}\n\n`;
  });

  md += `> **Key Takeaway - ${sector2Short}:**\n> ${s2Takeaway}\n\n`;

  // Page 3: Matriks Ringkasan
  md += `## 3. MATRIKS RINGKASAN PELUANG PASAR\n\n`;
  md += `| Sektor Logistik | Segmen Utama Pendorong | Peluang Pasar Global | Peluang Pasar Indonesia (NAT) |\n`;
  md += `|---|---|---|---|\n`;
  matrix4Col.forEach(row => {
    const gClean = row.global.replace(/\n/g, "<br>");
    const nClean = row.national.replace(/\n/g, "<br>");
    md += `| **${row.sector}** | ${row.segment} | ${gClean} | ${nClean} |\n`;
  });
  md += `\n\n`;
  md += `*Dokumen Laporan Analisis Peluang Pasar (Market Opportunity) - Manajemen Transportasi Logistik.*\n`;

  return {
    bannerTitle,
    subtitle,
    topic: topicHeader,
    reviewType: aspect,
    formatLabel,
    shortTitle,
    markdownContent: md,
    categoryType: "market_opportunity",
    sections: {
      sector1: {
        title: sector1Name,
        globalItems: s1GlobalItems,
        nationalItems: s1NatItems,
        keyTakeaway: s1Takeaway
      },
      sector2: {
        title: sector2Name,
        globalItems: s2GlobalItems,
        nationalItems: s2NatItems,
        keyTakeaway: s2Takeaway
      },
      matrix4Col
    }
  };
}

/**
 * Generate 5-part Strategic Academic Paper (Pendahuluan, Global Overview, National Overview, Analisis Strategis, Kesimpulan)
 */
export function generateAcademicMakalah(
  projectTitle: string,
  pillarNumber: number = 1,
  pillarTitle: string = "Analisis Kelayakan",
  activeDivision: string = "Logistik Darat"
): AcademicMakalahData {
  const pName = (projectTitle || "Manajemen Transportasi Sektor Kehutanan").trim();
  const lower = pName.toLowerCase();

  // If user is asking for Market Opportunity, use that generator
  if (lower.includes("peluang") || lower.includes("market") || lower.includes("opportunity") || pillarNumber === 1) {
    return generateMarketOpportunityMakalah(projectTitle, pillarNumber, pillarTitle, activeDivision);
  }

  // Determine domain theme
  let domain = "general";
  let topicLabel = "Transport & Logistics Management";
  let industryName = "transportasi dan logistik terintegrasi";
  let sectorTerm = "Logistik & Transportasi";
  let commodity = "kargo industri";
  let globalReg = "standar ISO, regulasi emisi Euro 6/EV, dan standar keselamatan global";
  let nationalReg = "UU No. 22 Tahun 2009 (LLAJ) dan regulasi ODOL";

  if (
    lower.includes("hutan") ||
    lower.includes("forestry") ||
    lower.includes("kayu") ||
    lower.includes("timber") ||
    lower.includes("pulp") ||
    lower.includes("sawmill")
  ) {
    domain = "forestry";
    topicLabel = "Forest Transport Logistics";
    industryName = "transportasi kehutanan (forestry management transportation)";
    sectorTerm = "Kehutanan";
    commodity = "kayu mentah (log), kayu olahan, dan hasil hutan non-kayu";
    globalReg = "regulasi EUDR (European Union Deforestation Regulation) dan LACEY Act";
    nationalReg = "Dokumen SKSHHK (Surat Keterangan Sahnya Hasil Hutan Kayu) dan verifikasi SVLK";
  } else if (
    lower.includes("batubara") ||
    lower.includes("coal") ||
    lower.includes("tambang") ||
    lower.includes("mineral")
  ) {
    domain = "mining";
    topicLabel = "Mining & Mineral Bulk Hauling";
    industryName = "transportasi hauling tambang & mineral curah";
    sectorTerm = "Pertambangan & Mineral";
    commodity = "batubara curah, bijih mineral, dan konsentrat";
    globalReg = "standar keselamatan ICMM (International Council on Mining and Metals) dan ISO 39001";
    nationalReg = "UU No. 3/2020 Minerba, regulasi ESDM, K3 Pertambangan & jalan hauling khusus";
  } else if (
    lower.includes("cold") ||
    lower.includes("dingin") ||
    lower.includes("farmasi") ||
    lower.includes("vaksin") ||
    lower.includes("makanan") ||
    lower.includes("reefer")
  ) {
    domain = "coldchain";
    topicLabel = "Cold Chain & Temperature Logistics";
    industryName = "transportasi rantai dingin (cold chain transportation)";
    sectorTerm = "Rantai Dingin & Farmasi";
    commodity = "produk farmasi, vaksin sensitif suhu, dan bahan pangan beku/segar";
    globalReg = "standar GDP (Good Distribution Practice) WHO dan FDA 21 CFR";
    nationalReg = "sertifikasi CDOB BPOM (Cara Distribusi Obat yang Baik) dan BPJPH Halal";
  } else if (
    lower.includes("minyak") ||
    lower.includes("cpo") ||
    lower.includes("sawit") ||
    lower.includes("tanker") ||
    lower.includes("crude")
  ) {
    domain = "liquid";
    topicLabel = "Liquid Bulk & Palm Oil Logistics";
    industryName = "transportasi curah cair & CPO tanker";
    sectorTerm = "Perkebunan & Energi Cair";
    commodity = "CPO (Crude Palm Oil), refined oils, dan bahan bakar industri";
    globalReg = "sertifikasi RSPO/ISCC dan standar pengangkutan tangki curah global";
    nationalReg = "regulasi ISPO, izin B3/KLHK, dan standar keselamatan tangki Pertamina/ESDM";
  } else if (
    lower.includes("nikel") ||
    lower.includes("smelter") ||
    lower.includes("baterai") ||
    lower.includes("nickel")
  ) {
    domain = "nickel";
    topicLabel = "Nickel Ore & Smelter Logistics";
    industryName = "logistik bijih nikel & pasokan smelter";
    sectorTerm = "Hilirisasi Nikel & Smelter";
    commodity = "bijih nikel (limonit/saprolit), feronikel (FeNi), dan matte";
    globalReg = "standar ESG rantai pasok baterai global (EU Battery Regulation) dan RMI";
    nationalReg = "kebijakan hilirisasi nasional ESDM, SIMBARA, dan perizinan dermaga jetty khusus";
  }

  // Titles
  const bannerTitle =
    domain === "forestry"
      ? "MAKALAH MANAJEMEN TRANSPORTASI SEKTOR KEHUTANAN"
      : `MAKALAH MANAJEMEN TRANSPORTASI ${sectorTerm.toUpperCase()}`;

  const subtitle =
    domain === "forestry"
      ? "Forestry Management Transportation: Analisis Strategis dan Tantangan Logistik Kayu Berbasis Global & Nasional"
      : `${pName}: Analisis Strategis dan Tantangan Logistik ${sectorTerm} Berbasis Global & Nasional`;

  const shortTitle = `Makalah ${pName.slice(0, 36)}`;
  const reviewType = "Global vs National (NAT)";
  const formatLabel = "Laporan Akademik";

  // Detailed Section Contents
  const latarBelakang =
    domain === "forestry"
      ? `Manajemen transportasi kehutanan (*forestry management transportation*) merupakan komponen terpenting dalam rantai pasok industri hasil hutan, khususnya ${commodity}. Transportasi kehutanan mencakup seluruh tahapan pengangkutan hasil hutan dari area pemanenan (*harvesting site*) menuju tempat penampungan (*log yard/landings*), dilanjutkan ke pabrik pengolahan (*pulp & paper, sawmill, plywood*), hingga ke pasar domestik maupun ekspor.\n\nDi tingkat global, manajemen transportasi kehutanan berfokus pada efisiensi biaya bahan bakar, pencegahan pemanenan liar melalui pelacakan legalitas (*traceability*), dan penerapan prinsip pemanenan berdampak rendah (*Reduced Impact Logging - RIL*). Di tingkat nasional, Indonesia sebagai salah satu pemilik hutan tropis terbesar di dunia menghadapi tantangan berupa medan geografis yang sulit, keterbatasan akses jalan industri kehutanan, serta pengawasan legalitas kayu antar-pulau.`
      : `Manajemen ${industryName} merupakan pilar vital dalam keberhasilan operasional dan efisiensi rantai pasok sektor ${sectorTerm}, khususnya dalam pengangkutan ${commodity}. Transportasi ini mengintegrasikan seluruh tahapan mulai dari titik asal (*origin/production site*), fasilitas konsolidasi & pergudangan (*hub/stockpile*), hingga ke fasilitas pemrosesan dan konsumen akhir domestik maupun ekspor.\n\nSecara global, modernisasi transportasi diarahkan pada efisiensi biaya bahan bakar, digitalisasi rantai pasok secara *real-time*, dan pemenuhan standar keselamatan armada. Di tingkat nasional, implementasi di Indonesia menuntut adaptasi terhadap karakteristik geografis, kondisi infrastruktur rute jalan hauling, serta kepatuhan ketat terhadap regulasi perizinan dan muatan armada.`;

  const rumusanMasalah = [
    `Bagaimana gambaran umum dan tren teknologi manajemen ${industryName} di tingkat global?`,
    `Tantangan dan kondisi objektif apa saja yang dihadapi dalam penerapan transportasi sektor ${sectorTerm} di tingkat nasional (Indonesia)?`,
    `Strategi efisiensi apa yang dapat diselaraskan antara standar global dan tantangan operasional nasional?`
  ];

  const trenGlobal = `Pasar sektor ${sectorTerm} global menuntut transparansi rantai pasok, kepatuhan keselamatan tinggi, dan efisiensi bahan bakar. Faktor pendorong utama modernisasi transportasi mencakup:`;

  const faktorPendorong = [
    `**Sertifikasi dan Kepatuhan Regulasi Global**: Regulasi ketat seperti ${globalReg} menuntut verifikasi lokasi asal (*geolokasi*) dan pelacakan digital akurat hingga ke titik armada pengangkut.`,
    `**Sistem Transportasi Otomatis & Berat Maksimum**: Penggunaan armada angkut berkapasitas optimal (*high-capacity transport*) dengan sistem kemudi terpandu GPS/telemetri untuk efisiensi konsumsi bahan bakar dan minimalisasi biaya pemeliharaan.`
  ];

  const inovasiTeknologi = `Implementasi sistem GIS (*Geographic Information System*) untuk perencanaan rute terpadu, telemetri IoT untuk pemantauan muatan dan operasional armada, serta integrasi moda transportasi darat yang dilengkapi sistem digital pelacakan muatan (*cargo tracking*).`;

  const calloutPilar = `Implementasi sistem GIS (Geographic Information System) untuk perencanaan rute jalan logistik, telemetri IoT untuk pemantauan muatan dan efisiensi armada, serta manajemen rute angkutan darat yang dilengkapi sistem digital pelacakan muatan (${domain === "forestry" ? "timber tracking" : "cargo telemetry tracking"}).`;

  const karakteristik = `Sektor ${sectorTerm} Indonesia bertumpu pada sentra produksi strategis di Sumatra, Kalimantan, Sulawesi, Jawa, dan wilayah timur Indonesia. Moda transportasi yang digunakan bersifat terintegrasi:`;

  const modaTransportasi = [
    {
      name: "Transportasi Darat (Armada Khusus)",
      desc:
        domain === "forestry"
          ? "Pengangkutan dari *felling area* menuju *Log Yard* utama menggunakan truk *Logging* khusus (seperti kelas *Rigid* maupun *Articulated*)."
          : `Pengangkutan dari titik produksi menuju fasilitas konsolidasi menggunakan armada spesifikasi khusus yang disesuaikan dengan berat muatan dan kondisi jalan.`
    },
    {
      name: "Transportasi Jalur Logistik & Multimoda",
      desc:
        domain === "forestry"
          ? "Penggunaan armada truk angkut berat dan koridor jalan industri untuk menghubungkan area konsolidasi menuju pabrik pengolahan atau pusat distribusi."
          : `Penggunaan armada angkut jalan hauling khusus, koridor arteri logistik, dan fasilitas transfer muatan untuk mempercepat siklus ritase distribusi.`
    }
  ];

  const tantanganUtama = [
    {
      name: "Kondisi Akses Rute yang Menantang",
      desc:
        domain === "forestry"
          ? "Sebagian besar jalan log merupakan jalan tanah (*dirt/gravel roads*) yang rawan rusak saat musim hujan, menghambat kepastian waktu distribusi."
          : "Tantangan kondisi permukaan jalan non-tol, kontur berbukit, serta kemacetan di koridor arteri logistik utama."
    },
    {
      name: "Tingginya Biaya Logistik & Kompleksitas Perizinan",
      desc: `Prosedur administrasi kepatuhan seperti ${nationalReg} yang membutuhkan tata kelola data akurat dan verifikasi tepat waktu.`
    },
    {
      name: "Efisiensi Operasional & Keselamatan Jalan",
      desc: "Manajemen keausan struktur jalan, pencegahan risiko insiden keselamatan, serta minimalisasi biaya bahan bakar armada logistik."
    }
  ];

  const matrix = [
    {
      dimensi: "Perencanaan Rute & GIS",
      standarGlobal: "Pemetaan GIS presisi tinggi dan otomasi optimasi rute (*dynamic dispatching*).",
      solusiNasional: "Pemanfaatan GIS untuk menentukan rute teraman pada musim hujan guna mencegah kendala jalan dan efisiensi waktu."
    },
    {
      dimensi: "Legalitas & Tracking Digital",
      standarGlobal: "Integrasi GPS, sensor muatan, dan kode batang digital (Barcode/RFID/IoT) pada setiap unit kargo.",
      solusiNasional: `Integrasi sistem pelacakan digital armada angkut dengan portal perizinan digital (${domain === "forestry" ? "SIPUHH - Sistem Informasi Penatausahaan Hasil Hutan" : "SIMBARA / INSW / Kemenhub"}).`
    },
    {
      dimensi: "Moda & Efisiensi Armada",
      standarGlobal: "Armada berefisiensi tinggi dan sistem manajemen telematika hemat bahan bakar (*Telematics Eco-Driving*).",
      solusiNasional: "Peremajaan armada truk angkut serta pemeliharaan alur transportasi darat yang lebih terukur dan efisien."
    }
  ];

  const kesimpulan = `Manajemen ${industryName} merupakan pilar utama keberlanjutan industri ${sectorTerm}. Integrasi teknologi pelacakan digital serta perencanaan rute berbasis GIS terbukti mampu meningkatkan efisiensi biaya logistik sekaligus memastikan bahwa seluruh produk yang diangkut memenuhi legalitas hukum yang berlaku.`;

  const saran = [
    `**Penerapan GIS & Telemetri**: Perusahaan sektor ${sectorTerm} nasional perlu mengadopsi GPS/GIS untuk pemantauan rute dan kondisi armada secara *real-time*.`,
    `**Perbaikan & Manajemen Rute Khusus**: Menerapkan pemeliharaan jalur logistik khusus untuk mencegah kerugian operasional akibat cuaca ekstrem.`,
    `**Digitalisasi Dokumen Pengangkutan**: Mempercepat integrasi penuh antara sistem logistik perusahaan dengan portal kepatuhan dan verifikasi legalitas resmi.`
  ];

  const footerNote = `Makalah ini disusun sebagai bahan kajian akademis dan analisis strategis manajemen transportasi ${sectorTerm.toLowerCase()}.`;

  // Assemble Complete Markdown Representation
  let md = `# ${bannerTitle}\n\n`;
  md += `**SUBTITLE:** ${subtitle}  \n`;
  md += `**Topik:** ${topicLabel}  \n`;
  md += `**Tinjauan:** ${reviewType}  \n`;
  md += `**Format:** ${formatLabel}  \n\n`;
  md += `---\n\n`;

  md += `## 1. PENDAHULUAN\n\n`;
  md += `### 1.1 Latar Belakang\n\n${latarBelakang}\n\n`;
  md += `### 1.2 Rumusan Masalah\n\n`;
  rumusanMasalah.forEach((rm) => {
    md += `• ${rm}\n`;
  });
  md += `\n`;

  md += `## 2. GLOBAL OVERVIEW (TINJAUAN GLOBAL)\n\n`;
  md += `### 2.1 Tren Manajemen Transportasi ${sectorTerm} Global\n\n${trenGlobal}\n\n`;
  faktorPendorong.forEach((fp) => {
    md += `• ${fp}\n`;
  });
  md += `\n### 2.2 Inovasi Teknologi Global\n\n`;
  md += `> **Pilar Teknologi Transportasi ${sectorTerm} Global:**\n> ${calloutPilar}\n\n`;

  md += `## 3. NATIONAL OVERVIEW (TINJAUAN NASIONAL - INDONESIA)\n\n`;
  md += `### 3.1 Karakteristik Operasional dan Sektor ${sectorTerm} Indonesia\n\n${karakteristik}\n\n`;
  modaTransportasi.forEach((mt, idx) => {
    md += `${idx + 1}. **${mt.name}**: ${mt.desc}\n`;
  });
  md += `\n### 3.2 Tantangan Utama Transportasi ${sectorTerm} Nasional\n\n`;
  tantanganUtama.forEach((tu) => {
    md += `• **${tu.name}**: ${tu.desc}\n`;
  });
  md += `\n`;

  md += `## 4. ANALISIS STRATEGIS DAN INTEGRASI SOLUSI\n\n`;
  md += `Komparasi dan penyesuaian strategi antara praktik global dan kebutuhan operasional di Indonesia:\n\n`;
  md += `| Dimensi Strategis | Standar / Tren Global | Tantangan & Solusi Implementasi Nasional |\n`;
  md += `|---|---|---|\n`;
  matrix.forEach((m) => {
    md += `| ${m.dimensi} | ${m.standarGlobal} | ${m.solusiNasional} |\n`;
  });
  md += `\n\n`;

  md += `## 5. KESIMPULAN DAN SARAN\n\n`;
  md += `### 5.1 Kesimpulan\n\n${kesimpulan}\n\n`;
  md += `### 5.2 Saran Strategis\n\n`;
  saran.forEach((s) => {
    md += `• ${s}\n`;
  });
  md += `\n\n*${footerNote}*\n`;

  return {
    bannerTitle,
    subtitle,
    topic: topicLabel,
    reviewType,
    formatLabel,
    shortTitle,
    markdownContent: md,
    categoryType: "strategic_paper",
    sections: {
      pendahuluan: {
        latarBelakang,
        rumusanMasalah
      },
      globalOverview: {
        trenGlobal,
        faktorPendorong,
        inovasiTeknologi,
        calloutPilar
      },
      nationalOverview: {
        karakteristik,
        modaTransportasi,
        tantanganUtama
      },
      analisisStrategis: {
        intro: "Komparasi dan penyesuaian strategi antara praktik global dan kebutuhan operasional di Indonesia:",
        matrix
      },
      kesimpulanSaran: {
        kesimpulan,
        saran,
        footerNote
      }
    }
  };
}
