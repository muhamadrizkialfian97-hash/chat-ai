export interface ProjectParameters {
  projectTitle: string;
  sector: string;
  commodity: string;
  routeCorridor: string;
  targetClient: string;
  targetCapacity: string;
  fleetRequirement: string;
  fleetCount: number;
  capexEstimate: string;
  capexNumeric: number;
  pricingModel: string;
  contractTerm: string;
  operationalConstraints: string;
  keyCompetitors: string;
  targetROI: string;
  updatedAt?: number;
}

export interface ProjectPreset {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  params: ProjectParameters;
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: "wind-farm",
    name: "PLTB / Wind Farm (Energi Terbarukan)",
    icon: "🌬️",
    badge: "Renewable Energy & Heavy Haul",
    description: "Kajian pengangkutan komponen turbin angin raksasa (blade 80m, nacelle, tower) dengan multi-axle modular trailer.",
    params: {
      projectTitle: "Kajian Kelayakan Logistik Heavy Haulage Transportasi Bilah Turbin & Komponen PLTB 75 MW Sidrap-Jeneponto",
      sector: "Energi Terbarukan (EBT) & Heavy Haulage",
      commodity: "Blade Turbin Angin (Panjang 75-80m, Bobot 22 Ton/bilah), Nacelle 85 Ton, dan Segmen Menara 90 Ton",
      routeCorridor: "Pelabuhan Soekarno-Hatta Makassar ke Site PLTB Jeneponto / Sidrap (Jarak ±140 km via Jalan Nasional Sulsel)",
      targetClient: "PT PLN (Persero) / Konsorsium Pengembang IPP (UPC Renewables & ACWA Power)",
      targetCapacity: "30 Unit Turbin Angin (Total 75 MW) dengan 90 Unit Bilah & 120 Segmen Menara",
      fleetRequirement: "8 Set Prime Mover Heavy Duty 6x4 540 HP + Multi-Axle Hydraulic Modular Trailer & Extendable Blade Trailer + 2 Heavy Crane 500T",
      fleetCount: 8,
      capexEstimate: "Rp 48.000.000.000",
      capexNumeric: 48000000000,
      pricingModel: "Tarif Lump Sum per Turbin Set Rp 1,4 Miliar (Total Kontrak Rp 42 Miliar) + Biaya Escort & Modifikasi Tikungan",
      contractTerm: "18 Bulan (Fase Konstruksi & Erection) + Opsi 5 Tahun Kontrak Maintenance Sparepart",
      operationalConstraints: "Radius tikungan jalan sempit di poros Maros-Pangkep, kabel PLN & jembatan penyeberangan over-height, jembatan kelas III dengan batas beban gandar 10 Ton, Zero Accident Protocol OHSAS 18001",
      keyCompetitors: "PT Cipta Krida Bahari (CKB Logistics), PT Puninar Logistics, PT Kamadjaja Logistics",
      targetROI: "3,2 Tahun (Payback Period), IRR 26,4%, ROI 38,5%"
    }
  },
  {
    id: "forestry-log",
    name: "Kehutanan & HTI / Kayu Bulat (Pulp & Paper)",
    icon: "🌲",
    badge: "Forestry & Bulk Wood",
    description: "Kajian angkutan kayu bulat HTI Acacia mangium 2,5 Juta m³ dari petak tebang ke pabrik pulp dengan logging truck.",
    params: {
      projectTitle: "Kajian Strategis Kelayakan Logistik Pengangkutan Kayu Bulat (Log) HTI Acacia mangium 2,5 Juta m³ Riau",
      sector: "Kehutanan, Hutan Tanaman Industri (HTI) & Pulp/Paper",
      commodity: "Kayu Bulat (Log) Acacia crassicarpa / mangium diameter 15-35 cm, panjang 2,6m (Massa jenis 0,85 t/m³)",
      routeCorridor: "Distrik Estate Pelalawan / Siak ke Mill Jetty Pabrik Pulp & Paper Pangkalan Kerinci (Jarak 85-120 km koridor korporasi)",
      targetClient: "PT Riau Andalan Pulp and Paper (APRIL Group) / PT Indah Kiat Pulp & Paper (APP Sinar Mas)",
      targetCapacity: "2.500.000 m³ per tahun (Rata-rata 6.850 m³ / 180 Rit per hari operasi 330 hari kerja)",
      fleetRequirement: "45 Unit Logging Truck 6x4 380 HP + Logging Semi-Trailer 40 Ton dengan Heavy-Duty Stanchion & TPMS",
      fleetCount: 45,
      capexEstimate: "Rp 67.500.000.000",
      capexNumeric: 67500000000,
      pricingModel: "Tarif Volume Rp 82.000 / m³ (atau Rp 780 / ton-km) dengan klausul eskalasi harga BBM Solar Industri Dexlite",
      contractTerm: "5 Tahun Kontrak Jangka Panjang (Multi-Year Contract) dengan SLA Ketepatan Pengiriman 98,5%",
      operationalConstraints: "Kondisi jalan tanah laterit berlumpur saat musim hujan tropis, kepatuhan sertifikasi FSC / SVLK & HCVF (High Conservation Value Forest), larangan muatan over-stanchion",
      keyCompetitors: "PT Riau Prima Logistik, PT Riau Barito Mandiri, Vendor Transportasi Lokal Riau",
      targetROI: "2,8 Tahun (Payback Period), IRR 29,8%, ROI 42,1%"
    }
  },
  {
    id: "bulk-cement",
    name: "Semen Curah & Material Konstruksi (Hi-Blow)",
    icon: "🏗️",
    badge: "Bulk Cement & Construction",
    description: "Kajian distribusi semen curah menggunakan truk tangki Hi-Blow bertekanan ke packing plant dan proyek strategis nasional.",
    params: {
      projectTitle: "Kajian Kelayakan Operasional & Finansial Transportasi Semen Curah (Hi-Blow Tanker) Koridor Jawa-Bali",
      sector: "Semen, Material Konstruksi & Infrastruktur",
      commodity: "Semen Curah Portland Composite Cement (PCC) & Ordinary Portland Cement (OPC) tipe I bulk",
      routeCorridor: "Pabrik Semen Tuban / Gresik ke Silo Terminal Tanjung Perak Surabaya & Packing Plant Banyuwangi (Jarak 110 - 280 km)",
      targetClient: "PT Semen Indonesia (Persero) Tbk (SIG) / PT Solusi Bangun Indonesia Tbk (SBI)",
      targetCapacity: "600.000 Ton per tahun (50.000 Ton per bulan / 60 ritase harian)",
      fleetRequirement: "35 Unit Tractor Head 6x2 340 HP Euro 4 + Tangki Hi-Blow Aluminium 32 Ton dengan Kompresor Discharge Mandiri 12 bar",
      fleetCount: 35,
      capexEstimate: "Rp 52.500.000.000",
      capexNumeric: 52500000000,
      pricingModel: "Tarif Jarak & Tonase Rp 450 per ton-km (Rata-rata Rp 94.500 / ton rute Tuban-Surabaya)",
      contractTerm: "3 Tahun Kontrak Pengadaan Jasa Transportasi Curah + Opsi Perpanjangan 2 Tahun",
      operationalConstraints: "Regulasi Zero Over Dimension Over Loading (ODOL) Kemenhub, standar kalibrasi jembatan timbang digital, waktu discharge semen maksimal 45 menit per tangki",
      keyCompetitors: "PT Varia Usaha Logistik (Semeru Laju), PT Dakota Cargo Curah, Koperasi Angkutan Semen Tuban",
      targetROI: "3,1 Tahun (Payback Period), IRR 27,2%, ROI 39,4%"
    }
  },
  {
    id: "mining-nickel",
    name: "Pertambangan Nikel & Batubara (Mining Hauling)",
    icon: "⛏️",
    badge: "Mining Hauling & Smelter",
    description: "Kajian angkutan ore nikel kadar tinggi dari front tambang ke smelter dengan heavy dump truck 8x4 di jalan tambang.",
    params: {
      projectTitle: "Kajian Kelayakan Investasi Dump Truck Heavy Duty Hauling Ore Nikel Morowali-Konawe",
      sector: "Pertambangan Nikel, Smelter & Mineral Hilir",
      commodity: "Nikel Ore Saprolit / Limonit Kadar 1,5% - 1,8% kadar air (Moisture Content) 32-38%",
      routeCorridor: "Front Tambang Pit Block Bahodopi ke Stockpile Smelter Kawasan Industri IMIP Morowali (Jarak 38 km Hauling Road)",
      targetClient: "PT Indonesia Morowali Industrial Park (IMIP) / PT Vale Indonesia / PT Huayue Nickel Cobalt",
      targetCapacity: "3.600.000 Ton Ore per tahun (300.000 Ton/bulan dengan target 24 jam rotasi 2 shift)",
      fleetRequirement: "40 Unit Mining Dump Truck 8x4 Heavy Duty 430 HP kapasitas 45 Ton (Vessel Hardox 450 wear-resistant)",
      fleetCount: 40,
      capexEstimate: "Rp 72.000.000.000",
      capexNumeric: 72000000000,
      pricingModel: "Tarif Hauling Mining Rp 28.500 per ton (Rp 750 / ton-km) + Insentif Bonus Ritase On-Time",
      contractTerm: "5 Tahun Hauling Service Agreement dengan Ketersediaan Fisik Unit (PA) minimum 90%",
      operationalConstraints: "Gradien tanjakan hauling road hingga 12%, debu tambang ekstrem & tanah licin saat hujan (rain stop protocol), standar K3 Pertambangan (Kepmen ESDM 1827/2018)",
      keyCompetitors: "PT Petrosea Tbk, PT Mandiri Herindo Adiperkasa (MHA), PT Hillcon Jaya Sakti",
      targetROI: "2,5 Tahun (Payback Period), IRR 33,5%, ROI 46,8%"
    }
  },
  {
    id: "cpo-plantation",
    name: "Perkebunan Sawit / CPO & Biofuel (Liquid Bulk)",
    icon: "🌴",
    badge: "Agribusiness & Liquid Bulk",
    description: "Kajian armada tangki stainless steel SUS-304 pengangkutan CPO dari PKS pedalaman ke pelabuhan ekspor.",
    params: {
      projectTitle: "Kajian Kelayakan Logistik Pengangkutan Minyak Kelapa Sawit (CPO) Tangki Stainless Steel Kalimantan Barat",
      sector: "Agribisnis, Perkebunan Sawit & Energi Hijau Biofuel",
      commodity: "Crude Palm Oil (CPO) Kualitas Ekspor Asam Lemak Bebas (FFA) < 3,5% dan Kadar Air < 0,15%",
      routeCorridor: "PKS Sanggau / Sekadau ke Bulking Station Pelabuhan Kijing Mempawah (Jarak 165 km)",
      targetClient: "PT Sinar Mas Agro Resources and Technology (SMART) / Wilmar International / PT Astra Agro Lestari",
      targetCapacity: "180.000 Ton CPO per tahun (15.000 Ton per bulan / 20 rit per hari tangki 25 ton)",
      fleetRequirement: "25 Unit Prime Mover 6x2 300 HP + Tangki Stainless Steel SUS-304 25.000 Liter dengan Heating Coil Steam",
      fleetCount: 25,
      capexEstimate: "Rp 37.500.000.000",
      capexNumeric: 37500000000,
      pricingModel: "Tarif Rp 260.000 per ton CPO (Rp 1.575 / ton-km) dengan batas toleransi susut maksimal 0,15%",
      contractTerm: "3 Tahun Kontrak Angkutan CPO Terintegrasi",
      operationalConstraints: "Titik beku CPO saat cuaca dingin, risiko kontaminasi besi pada tangki biasa sehingga wajib SUS-304, pengamanan segel digital tamper-proof GPS e-seal",
      keyCompetitors: "PT Trans CPO Borneo, PT Samator Sawit Logistik, Angkutan CPO Lokal Kalbar",
      targetROI: "2,9 Tahun (Payback Period), IRR 28,1%, ROI 40,2%"
    }
  },
  {
    id: "cold-chain",
    name: "Rantai Dingin FMCG & Makanan Beku (Cold Chain)",
    icon: "❄️",
    badge: "Cold Chain & FMCG Retail",
    description: "Kajian distribusi truk berpendingin reefer box multi-drop suhu -20°C untuk makanan beku, susu, dan farmasi Trans Jawa.",
    params: {
      projectTitle: "Kajian Kelayakan Jaringan Cold Chain Reefer Logistics Multi-Drop Trans Jawa-Bali",
      sector: "Fast Moving Consumer Goods (FMCG), Ritel Makanan & Rantai Dingin",
      commodity: "Daging Beku (-20°C), Dairy Produk Susu & Es Krim (-18°C), Farmasi & Vaksin (2°C - 8°C)",
      routeCorridor: "Central Distribution Center Cikarang ke Hub Regional Semarang, Surabaya, dan Denpasar (Jarak 850 km Tol Trans Jawa)",
      targetClient: "PT Unilever Indonesia / PT Indofood CBP / PT Campina Ice Cream / Kemenkes Biofarma",
      targetCapacity: "45.000 Ton per tahun (120 m³ / 15 Ton per armada dengan ritase harian rutin)",
      fleetRequirement: "20 Unit Truk Tronton Wingbox Reefer 6x2 280 HP + Mesin Pendingin Thermo King T-1080R dengan IoT Temperature Logger",
      fleetCount: 20,
      capexEstimate: "Rp 34.000.000.000",
      capexNumeric: 34000000000,
      pricingModel: "Tarif Sewa Dedikasi Rp 58.000.000 per bulan/unit + Biaya Ritase Drop Point Rp 4.200 per kg",
      contractTerm: "3 Tahun Dedicated Fleet Agreement",
      operationalConstraints: "Larangan suhu naik lebih dari 1°C saat bongkar muat (Thermal Curtain wajib), monitoring suhu IoT 24/7 dengan alarm instan",
      keyCompetitors: "PT Enseval Medika Prima, PT Kiat Ananda Cold Storage, PT MGM Bosco Logistics",
      targetROI: "3,0 Tahun (Payback Period), IRR 26,9%, ROI 38,1%"
    }
  }
];

export const DEFAULT_PROJECT_PARAMS: ProjectParameters = {
  projectTitle: "Kajian Strategis Kelayakan Logistik Pengangkutan Komersial",
  sector: "Logistik & Transportasi Komersial Terintegrasi",
  commodity: "Muatan Umum & Komoditas Industri",
  routeCorridor: "Koridor Rute Logistik Nasional",
  targetClient: "Mitra Korporasi & Industri Pengguna Jasa Logistik",
  targetCapacity: "100.000 Ton / Kapasitas Operasional Tahunan",
  fleetRequirement: "15 Unit Armada Transportasi Spesifikasi Khusus",
  fleetCount: 15,
  capexEstimate: "Rp 25.000.000.000",
  capexNumeric: 25000000000,
  pricingModel: "Tarif Komersial Kompetitif Berbasis Jarak & Tonase",
  contractTerm: "3 - 5 Tahun Kontrak Pengadaan Logistik",
  operationalConstraints: "Kepatuhan K3/HSE, Batas Muatan Sumbu Terberat (MST), dan SLA Pengiriman Tepat Waktu",
  keyCompetitors: "Penyedia Jasa Logistik & Transportasi Nasional",
  targetROI: "3,0 Tahun (Payback Period), IRR 25%, ROI 35%",
  updatedAt: Date.now()
};

export function loadSavedProjectParameters(projectTitle?: string): ProjectParameters {
  try {
    const raw = localStorage.getItem("prama_project_parameters");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.projectTitle) {
        if (projectTitle && projectTitle.trim() && parsed.projectTitle.toLowerCase() !== projectTitle.trim().toLowerCase()) {
          // If title differs, try to check preset or update title
          const matchPreset = PROJECT_PRESETS.find(p => p.params.projectTitle.toLowerCase() === projectTitle.toLowerCase() || projectTitle.toLowerCase().includes(p.id));
          if (matchPreset) {
            return { ...matchPreset.params, updatedAt: Date.now() };
          }
          return { ...parsed, projectTitle: projectTitle.trim(), updatedAt: Date.now() };
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse saved project parameters:", e);
  }

  if (projectTitle && projectTitle.trim()) {
    const lower = projectTitle.toLowerCase();
    const match = PROJECT_PRESETS.find(p => 
      lower.includes("wind") || lower.includes("pltb") || lower.includes("turbin") ? p.id === "wind-farm" :
      lower.includes("kayu") || lower.includes("forest") || lower.includes("hti") || lower.includes("pulp") ? p.id === "forestry-log" :
      lower.includes("semen") || lower.includes("cement") || lower.includes("blow") ? p.id === "bulk-cement" :
      lower.includes("nikel") || lower.includes("tambang") || lower.includes("mine") || lower.includes("ore") ? p.id === "mining-nickel" :
      lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm") ? p.id === "cpo-plantation" :
      lower.includes("cold") || lower.includes("reefer") || lower.includes("dingin") || lower.includes("fmcg") ? p.id === "cold-chain" :
      false
    );
    if (match) {
      return { ...match.params, projectTitle: projectTitle.trim(), updatedAt: Date.now() };
    }
    return { ...DEFAULT_PROJECT_PARAMS, projectTitle: projectTitle.trim(), updatedAt: Date.now() };
  }

  return DEFAULT_PROJECT_PARAMS;
}

export function saveProjectParameters(params: ProjectParameters): void {
  try {
    const dataToSave = { ...params, updatedAt: Date.now() };
    localStorage.setItem("prama_project_parameters", JSON.stringify(dataToSave));
    localStorage.setItem("prama_dashboard_project_title", params.projectTitle.trim());
  } catch (e) {
    console.error("Error saving project parameters:", e);
  }
}
