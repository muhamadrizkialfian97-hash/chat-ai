import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Scale,
  TrendingUp,
  ShieldAlert,
  Compass,
  ArrowRight,
  TrendingDown,
  Activity,
  Plus,
  Trash2,
  Lock,
  ChevronRight
} from "lucide-react";

interface GlobalNatProps {
  projectTitle: string;
}

interface RegulationMetric {
  id: string;
  name: string;
  scope: "Global" | "Nasional";
  impactScore: number; // 1-10
  status: "Berlaku" | "Tahap Transisi" | "Wacana";
  description: string;
}

function getSectorConfig(projectTitle: string) {
  const titleLower = (projectTitle || "").toLowerCase();

  // 1. Waste Management / Limbah / B3 / Sampah / Circular Economy
  if (
    titleLower.includes("waste") ||
    titleLower.includes("limbah") ||
    titleLower.includes("sampah") ||
    titleLower.includes("b3") ||
    titleLower.includes("circular") ||
    titleLower.includes("daur ulang")
  ) {
    return {
      sectorKey: "waste",
      sectorBadge: "WASTE & CIRCULAR ECONOMY",
      matrixTitle: "Matriks Kebijakan Pengelolaan Limbah & B3",
      regulations: [
        {
          id: "reg-w1",
          name: "Basel Convention & EU Waste Shipments",
          scope: "Global" as const,
          impactScore: 9,
          status: "Berlaku" as const,
          description: "Pengawasan lintas negara terhadap pergerakan dan pengangkutan limbah berbahaya (B3) serta material daur ulang."
        },
        {
          id: "reg-w2",
          name: "EU Circular Economy Action Plan & CBAM",
          scope: "Global" as const,
          impactScore: 8,
          status: "Tahap Transisi" as const,
          description: "Standar pelaporan emisi daur ulang material dan insentif pengolahan sampah menjadi energi (Waste-to-Energy)."
        },
        {
          id: "reg-w3",
          name: "Permen LHK No. 6/2021 (Pengelolaan Limbah B3)",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Wajib perizinan angkutan B3, pengoperasian Festronik (Elektronik Manifes), dan kualifikasi armada khusus."
        },
        {
          id: "reg-w4",
          name: "Perpres No. 98/2021 (NEK Sektor Sampah & Limbah)",
          scope: "Nasional" as const,
          impactScore: 8,
          status: "Berlaku" as const,
          description: "Skema insentif dan perdagangan nilai ekonomi karbon dari reduksi metana dan efisiensi pengangkutan limbah."
        }
      ],
      riskCalcBadge: "WASTE & B3 COMPLIANCE CALCULATOR",
      riskCalcTitle: "Simulasi Kepatuhan Transportasi Limbah & B3",
      toggle1Label: "Festronik KLHK Terbit (E-Manifest B3)",
      toggle2Label: "Sertifikasi AMDAL & Izin Angkut B3",
      telemetryLabel: "Telemetri Monitoring Fleet & Festronik",
      originLabel: "Kategori Limbah & Pengolahan",
      originOptions: ["Limbah B3 Medis / Industri", "Limbah Non-B3 Daur Ulang", "Waste-to-Energy Municipal"],
      nationalTitle: "Instrumen Kebijakan Pengelolaan Limbah & B3 (Indonesia)",
      nationalDesc: "Indonesia memperketat pengawasan pengangkutan limbah melalui e-manifest Festronik KLHK dan sertifikasi khusus armada B3 guna mencegah risiko pencemaran perairan dan pemukiman.",
      nationalBoxes: [
        { tag: "FESTRONIK KLHK", title: "E-Manifest Real-time", desc: "Pencatatan digital manifes limbah B3 dari penghasil, pengangkut, hingga pengolah akhir." },
        { tag: "AMDAL B3 FLEET", title: "Lisensi Angkutan B3", desc: "Sertifikasi kelayakan kendaraan dan driver berlisensi B3 sesuai Permen LHK No. 6/2021." },
        { tag: "CIRCULAR TARGET", title: "Reduksi Karbon Metana", desc: "Integrasi rute pengangkutan limbah teroptimasi guna mendukung target NACS & Net Zero." }
      ],
      carbonTaxTitle: "Pajak Karbon Sektor Waste",
      carbonTaxDesc: "Penghematan rute hauling limbah mengurangi beban pajak karbon metana/CO2 hingga Rp 30.000 / ton CO2e.",
      challenges: [
        { id: "ch-w1", title: "Risiko Kebocoran/Tumpahan Limbah B3", category: "Keselamatan", solved: true, detail: "Penggunaan kompartemen armada berlapis dan sensor IoT kebocoran real-time." },
        { id: "ch-w2", title: "Validasi E-Manifest (Festronik) Lambat", category: "Teknologi", solved: true, detail: "Integrasi API armada Pancaran langsung ke portal Festronik KLHK tanpa jeda manual." },
        { id: "ch-w3", title: "Fluktuasi Biaya Pengolahan Akhir Waste", category: "Finansial", solved: false, detail: "Biaya Tipping Fee di TPA/TPS3R membutuhkan skema kontrak jangka panjang yang stabil." },
        { id: "ch-w4", title: "Izin Lintas Rute Angkutan B3 Daerah", category: "Regulasi", solved: true, detail: "Pengurusan rekomendasi KLHK & Kemenhub terpusat menjamin legalitas rute antar-provinsi." }
      ],
      riskActionHigh: "Sangat baik! Armada B3 Anda memiliki izin Festronik & AMDAL lengkap. Memenuhi standar sertifikasi pengangkut limbah hijau.",
      riskActionLow: "Peringatan! Pengangkutan limbah B3 tanpa e-manifest Festronik dan izin KLHK berisiko sanksi pidana lingkungan dan pembekuan operasional."
    };
  }

  // 2. Mining / Pertambangan / Nikel / Batubara / Mineral / Smelter
  if (
    titleLower.includes("mining") ||
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("nickel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("mineral") ||
    titleLower.includes("smelter") ||
    titleLower.includes("esdm")
  ) {
    return {
      sectorKey: "mining",
      sectorBadge: "MINING & CRITICAL MINERALS",
      matrixTitle: "Matriks Kebijakan Pertambangan & Mineral Kritis",
      regulations: [
        {
          id: "reg-m1",
          name: "EU Critical Raw Materials Act & EITI",
          scope: "Global" as const,
          impactScore: 9,
          status: "Berlaku" as const,
          description: "Pengawasan transparansi rantai pasok dan jejak emisi karbon pada pengolahan nikel, bauksit, dan mineral kritis."
        },
        {
          id: "reg-m2",
          name: "CBAM & Battery Regulation (EU)",
          scope: "Global" as const,
          impactScore: 9,
          status: "Tahap Transisi" as const,
          description: "Persyaratan jejak karbon maksimum (Carbon Footprint Passport) untuk produk mineral dan baterai kendaraan listrik."
        },
        {
          id: "reg-m3",
          name: "Integrasi SIMBARA ESDM & Kemenkeu",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Sistem Informasi Mineral dan Batubara wajib untuk verifikasi angkutan dan pemenuhan kewajiban royalti."
        },
        {
          id: "reg-m4",
          name: "Permen ESDM Good Mining Practice & AMDAL",
          scope: "Nasional" as const,
          impactScore: 8,
          status: "Berlaku" as const,
          description: "Regulasi rute hauling jalan khusus tambang, keselamatan angkutan berat, dan kewajiban reklamasi area."
        }
      ],
      riskCalcBadge: "MINING HAULING & SIMBARA CALCULATOR",
      riskCalcTitle: "Simulasi Kepatuhan Rute Hauling Tambang",
      toggle1Label: "Verifikasi Integrasi SIMBARA ESDM",
      toggle2Label: "Izin Hauling Jalur Khusus Tambang",
      telemetryLabel: "Telemetri GPS & Axle Weight Sensor",
      originLabel: "Status Wilayah Tambang / IUP",
      originOptions: ["IUP / IUPK Operasi Produksi", "Kawasan Smelter Hilirisasi", "Lahan Non-Konsesi Berizin"],
      nationalTitle: "Instrumen Kebijakan Hilirisasi & SIMBARA (Indonesia)",
      nationalDesc: "Sistem SIMBARA terintegrasi memantau setiap ritase hauling mineral/batubara dari pit ke smelter dan pelabuhan guna menjamin transparansi penerimaan negara.",
      nationalBoxes: [
        { tag: "SIMBARA ESDM", title: "Validasi Digital Bill of Lading", desc: "Pencatatan tonase dan verifikasi otomatis sebelum kapal/tongkang atau truk berangkat." },
        { tag: "GOOD MINING PRACTICE", title: "Keselamatan Jalan Hauling", desc: "Kepatuhan spesifikasi tonase kendaraan dan perawatan jalan tambang bebas debu." },
        { tag: "DEKARBONISASI SMELTER", title: "Audit Emisi Rute", desc: "Perhitungan emisi per ton-km logistik angkutan mineral menuju kriteria baterai hijau." }
      ],
      carbonTaxTitle: "Pajak Karbon Hauling Tambang",
      carbonTaxDesc: "Optimalisasi ritase dan efisiensi konsumsi solar industri menekan beban emisi CO2 hingga Rp 30.000 / ton CO2e.",
      challenges: [
        { id: "ch-m1", title: "Jalan Hauling Rusak / Berlumpur Musim Hujan", category: "Infrastruktur", solved: false, detail: "Memerlukan grading rutin dan penggunaan armada 6x4/8x4 berkemampuan off-road tinggi." },
        { id: "ch-m2", title: "Kemacetan & Bottleneck di Jetty / Smelter", category: "Operasional", solved: true, detail: "Penerapan sistem antrean e-ticketing dan GPS tracking kedatangan armada Pancaran." },
        { id: "ch-m3", title: "Tinggi Biaya Maintenance / Tire Wear", category: "Finansial", solved: false, detail: "Monitoring tekanan ban otomatis (TPMS) dan rotasi armada mengurangi downtime." },
        { id: "ch-m4", title: "Kepatuhan Tonase Tanpa Overloading", category: "Regulasi", solved: true, detail: "Jembatan timbang digital onboard pada armada mencegah sanksi overdimensi." }
      ],
      riskActionHigh: "Sangat baik! Rute hauling tambang Anda telah terhubung ke SIMBARA & berizin jalan khusus. Bebas dari risiko blokir kuota RKAB.",
      riskActionLow: "Bahaya! Hauling tanpa verifikasi SIMBARA dan izin jalur khusus berisiko penghentian tongkang di pelabuhan dan sanksi denda RKAB."
    };
  }

  // 3. Agriculture / Perkebunan / Sawit / Pangan
  if (
    titleLower.includes("agri") ||
    titleLower.includes("sawit") ||
    titleLower.includes("palm") ||
    titleLower.includes("pertanian") ||
    titleLower.includes("perkebunan") ||
    titleLower.includes("pangan") ||
    titleLower.includes("cpo") ||
    titleLower.includes("food")
  ) {
    return {
      sectorKey: "agri",
      sectorBadge: "AGRICULTURE & FOOD SUPPLY CHAIN",
      matrixTitle: "Matriks Kebijakan Perkebunan & Rantai Pasok Pangan",
      regulations: [
        {
          id: "reg-a1",
          name: "EU Deforestation Regulation (EUDR)",
          scope: "Global" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Mewajibkan bukti geolokasi poligon kebun sawit/pangan bebas deforestasi untuk ekspor ke Uni Eropa."
        },
        {
          id: "reg-a2",
          name: "RSPO & International Sustainability Standards",
          scope: "Global" as const,
          impactScore: 8,
          status: "Berlaku" as const,
          description: "Sertifikasi internasional rantai pasok minyak sawit dan komoditas pertanian berkelanjutan."
        },
        {
          id: "reg-a3",
          name: "Mandatori ISPO (Indonesian Sustainable Palm Oil)",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Kewajiban sertifikasi keberlanjutan bagi seluruh rantai pasok kebun, pengangkut, hingga pabrik kelapa sawit (PKS)."
        },
        {
          id: "reg-a4",
          name: "Perpres No. 98/2021 & Sektor Pertanian / Lahan",
          scope: "Nasional" as const,
          impactScore: 8,
          status: "Berlaku" as const,
          description: "Integrasi komitmen NDC sektor pertanian dan pengendalian emisi angkutan hasil bumi."
        }
      ],
      riskCalcBadge: "ISPO & EUDR AGRI CALCULATOR",
      riskCalcTitle: "Simulasi Lacak Balik Rantai Pasok Perkebunan",
      toggle1Label: "Sertifikasi ISPO Mandatori Terbit",
      toggle2Label: "Sertifikasi RSPO / International Standard",
      telemetryLabel: "Telemetri Geolokasi Kebun ke PKS",
      originLabel: "Kategori Sumber Pasokan Hasil Bumi",
      originOptions: ["Perkebunan Inti Bersertifikat", "Plasma / Koperasi Mitra", "Mandiri Non-Sertifikat"],
      nationalTitle: "Instrumen ISPO Mandatori & Rantai Pasok Pangan",
      nationalDesc: "Sertifikasi ISPO dan pelacakan digital mengamankan posisi komoditas perkebunan Indonesia di pasar internasional.",
      nationalBoxes: [
        { tag: "ISPO MANDATORI", title: "Sertifikasi Rantai Pasok", desc: "Jaminan kepatuhan lingkungan dan legalitas lahan dari kebun hingga angkutan CPO." },
        { tag: "TRACEABILITY PKS", title: "Digital Surat Angkut TBS", desc: "Integrasi e-Surat Angkut TBS dari kebun mitra langsung ke sistem timbangan PKS." },
        { tag: "LOGISTIK CPO", title: "Armada Tangki Hygienic", desc: "Sertifikasi armada tangki CPO berstandar mutu pangan tanpa kontaminasi." }
      ],
      carbonTaxTitle: "Proyeksi Karbon Perkebunan",
      carbonTaxDesc: "Pelacakan rute efisien mengurangi emisi pengangkutan TBS/CPO dan potensi insentif perdagangan karbon.",
      challenges: [
        { id: "ch-a1", title: "Kerusakan Buah TBS Saat Pengangkutan", category: "Kualitas", solved: true, detail: "Desain bak armada Pancaran khusus mengurangi gesekan dan tingkat Asam Lemak Bebas (ALB)." },
        { id: "ch-a2", title: "Lacak Balik Petani Swadaya Sulit Ditinjau", category: "Sertifikasi", solved: true, detail: "Pencatatan koordinat GPS kebun petani via aplikasi logistik mobile Pancaran." },
        { id: "ch-a3", title: "Musim Hujan & Akses Jalan Kebun Buruk", category: "Infrastruktur", solved: false, detail: "Memerlukan penataan jadwal hauling ketat sebelum kualitas FBB menurun." },
        { id: "ch-a4", title: "Keamanan Muatan CPO Jalur Darat", category: "Keamanan", solved: true, detail: "Penggunaan E-Seal digital pada kran tangki CPO yang terpantau via GPS central." }
      ],
      riskActionHigh: "Sangat baik! Rantai pasok perkebunan Anda memenuhi syarat ISPO & EUDR. Risiko penolakan ekspor sangat rendah.",
      riskActionLow: "Bahaya! Pengangkutan hasil kebun tanpa geolokasi dan sertifikasi ISPO berisiko pemblokiran pasokan oleh pabrik ekspor."
    };
  }

  // 4. Energy & Renewable Energy / Solar / EBT / Power / Battery
  if (
    titleLower.includes("energy") ||
    titleLower.includes("renewable") ||
    titleLower.includes("ebt") ||
    titleLower.includes("solar") ||
    titleLower.includes("wind") ||
    titleLower.includes("baterai") ||
    titleLower.includes("power")
  ) {
    return {
      sectorKey: "energy",
      sectorBadge: "RENEWABLE ENERGY & TRANSITION",
      matrixTitle: "Matriks Kebijakan Energi Terbarukan & Transisi",
      regulations: [
        {
          id: "reg-e1",
          name: "EU Net Zero Industry Act & RE100",
          scope: "Global" as const,
          impactScore: 9,
          status: "Berlaku" as const,
          description: "Standar transparansi rantai pasok dan jejak karbon manufaktur serta pengangkutan teknologi energi terbarukan."
        },
        {
          id: "reg-e2",
          name: "US Inflation Reduction Act (IRA) Clean Traceability",
          scope: "Global" as const,
          impactScore: 8,
          status: "Berlaku" as const,
          description: "Persyaratan asal-usul komponen dan batas emisi logistik untuk klaim kredit pajak energi bersih."
        },
        {
          id: "reg-e3",
          name: "RUU EBT & RUPTL Listrik Hijau PLN",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Kerangka regulasi percepatan pembangkit EBT dan prioritas fasilitas logistik alat berat energi bersih."
        },
        {
          id: "reg-e4",
          name: "Regulasi TKDN Kemenperin (Sektor Energi)",
          scope: "Nasional" as const,
          impactScore: 9,
          status: "Berlaku" as const,
          description: "Batas minimal Tingkat Komponen Dalam Negeri untuk peralatan dan jasa logistik proyek EBT."
        }
      ],
      riskCalcBadge: "GREEN ENERGY & TKDN CALCULATOR",
      riskCalcTitle: "Simulasi Kepatuhan Logistik Proyek EBT",
      toggle1Label: "Kepatuhan TKDN Energi >40%",
      toggle2Label: "Sertifikat Low-Carbon Transport Fleet",
      telemetryLabel: "Telemetri IoT Monitoring Suhu & Vibrasi",
      originLabel: "Kategori Material Proyek Energi",
      originOptions: ["Modul Solar & Inverter EBT", "Baterai Energy Storage (BESS)", "Komponen Pembangkit Listrik"],
      nationalTitle: "Instrumen Kebijakan Transisi Energi & TKDN (Indonesia)",
      nationalDesc: "Proyek energi terbarukan Indonesia mewajibkan kepatuhan nilai TKDN serta audit keselamatan pengangkutan komponen sensitif.",
      nationalBoxes: [
        { tag: "TKDN ENERGY", title: "Verifikasi Komponen Lokal", desc: "Pemenuhan persentase TKDN Kemenperin untuk infrastruktur & pengangkutan proyek." },
        { tag: "RUPTL GREEN GRID", title: "Prioritas Rute Logistik", desc: "Kemudahan perizinan angkutan alat berat EBT menuju lokasi proyek remote PLN." },
        { tag: "DEKARBONISASI ARMADA", title: "Green Fleet Certification", desc: "Penggunaan biofuel / armada EV pendukung untuk operasional proyek EBT." }
      ],
      carbonTaxTitle: "Manfaat Karbon Proyek EBT",
      carbonTaxDesc: "Penggunaan armada beremisi rendah meningkatkan nilai sertifikat pengurangan emisi (SPE-GRK) proyek EBT.",
      challenges: [
        { id: "ch-e1", title: "Risiko Kerusakan Komponen Sensitif (Solar/BESS)", category: "Keamanan", solved: true, detail: "Penggunaan suspensi udara (air-suspension) dan shock-sensor IoT pada trailer Pancaran." },
        { id: "ch-e2", title: "Izin Overdimensi Peralatan Berat EBT", category: "Regulasi", solved: true, detail: "Pengurusan izin pengawalan Dishub & Kemenhub untuk angkutan transformer/blade." },
        { id: "ch-e3", title: "Akses Terjal ke Lokasi Remote (Hydro/Wind)", category: "Infrastruktur", solved: false, detail: "Survei rute geospasial mendalam guna menghindari jembatan berkekuatan terbatas." },
        { id: "ch-e4", title: "Verifikasi Dokumen TKDN Logistik", category: "Kepatuhan", solved: true, detail: "Penyediaan laporan biaya transportasi terstruktur sesuai standar audit Kemenperin." }
      ],
      riskActionHigh: "Sangat baik! Logistik proyek EBT Anda memenuhi standar TKDN & keselamatan komponen sensitif.",
      riskActionLow: "Peringatan! Pengangkutan komponen EBT tanpa proteksi vibrasi dan izin overdimensi berisiko klaim garansi batal."
    };
  }

  // 5. Forestry / Kehutanan / Hutan / Kayu / Timber / Logging
  if (
    titleLower.includes("forestry") ||
    titleLower.includes("kehutanan") ||
    titleLower.includes("hutan") ||
    titleLower.includes("kayu") ||
    titleLower.includes("timber") ||
    titleLower.includes("logging")
  ) {
    return {
      sectorKey: "forestry",
      sectorBadge: "FORESTRY & SUSTAINABLE TIMBER",
      matrixTitle: "Matriks Kebijakan Kehutanan & Legalitas Kayu (SVLK)",
      regulations: [
        {
          id: "reg-f1",
          name: "EU Deforestation Regulation (EUDR) & FLEGT",
          scope: "Global" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Mewajibkan bukti geolokasi poligon konsesi hutan bebas deforestasi untuk ekspor produk kayu dan kertas."
        },
        {
          id: "reg-f2",
          name: "FSC & PEFC Chain of Custody Standard",
          scope: "Global" as const,
          impactScore: 9,
          status: "Berlaku" as const,
          description: "Sertifikasi internasional rantai pasok kayu lestari dari tebangan hingga produk jadi."
        },
        {
          id: "reg-f3",
          name: "SVLK (Sistem Verifikasi Legalitas Kayu) KLHK",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Wajib sertifikasi legalitas seluruh bahan baku kayu dan dokumen V-Legal untuk pengangkutan serta ekspor."
        },
        {
          id: "reg-f4",
          name: "Permen LHK SKSHHK (Surat Keterangan Sah Hasil Hutan)",
          scope: "Nasional" as const,
          impactScore: 10,
          status: "Berlaku" as const,
          description: "Dokumen digital wajib untuk legalitas angkutan kayu bulat, gergajian, dan chip kayu dari TPH ke industri."
        }
      ],
      riskCalcBadge: "SVLK & EUDR FORESTRY CALCULATOR",
      riskCalcTitle: "Simulasi Kepatuhan Rute Angkutan Kehutanan",
      toggle1Label: "SKSHHK Digital KLHK Terbit",
      toggle2Label: "Sertifikasi SVLK & V-Legal Valid",
      telemetryLabel: "Telemetri GPS & Geofencing Konsesi Hutan",
      originLabel: "Status Konsesi / IUPHHK Sumber Kayu",
      originOptions: ["IUPHHK-HA / HTI Bersertifikat SVLK", "Hutan Rakyat Bermitra", "Konesi Transisi Konsesi"],
      nationalTitle: "Instrumen SVLK & SKSHHK Kehutanan (Indonesia)",
      nationalDesc: "Kementerian LHK mewajibkan dokumen SKSHHK dan sertifikasi SVLK untuk setiap pengangkutan hasil hutan guna memastikan zero illegal logging.",
      nationalBoxes: [
        { tag: "SVLK MANDATORI", title: "Legalitas Kayu Nasional", desc: "Verifikasi ketat asal-usul bahan baku kayu dari tebangan sah berizin KLHK." },
        { tag: "SKSHHK DIGITAL", title: "Manifes Angkut Hasil Hutan", desc: "Pencatatan elektronik Surat Keterangan Sah Hasil Hutan untuk setiap truk hauling." },
        { tag: "EUDR GEOLOCATION", title: "Poligon Titik Koordinat", desc: "Pemetaan batas konsesi hutan sesuai standar verifikasi ekspor pasar global." }
      ],
      carbonTaxTitle: "Kredit Karbon Sektor Kehutanan",
      carbonTaxDesc: "Pengelolaan logistik tebangan rendah emisi dan reboisasi mendukung skema Nilai Ekonomi Karbon (NEK) Indonesia.",
      challenges: [
        { id: "ch-f1", title: "Akses Jalan Hauling Hutan Ekstrem / Berlumpur", category: "Infrastruktur", solved: false, detail: "Armada truk 6x4 heavy duty dengan ban traksi khusus untuk medan konsesi HTI." },
        { id: "ch-f2", title: "Validasi Dokumen SKSHHK Lapangan", category: "Regulasi", solved: true, detail: "Integrasi sistem e-SKSHHK KLHK dengan GPS fleet Pancaran mencegah sanksi razia." },
        { id: "ch-f3", title: "Risiko Tumpahan / Kerusakan Batang Kayu", category: "Operasional", solved: true, detail: "Pengikatan hidrolik otomatis pada trailer pengangkut kayu bulat (Log Trailer)." },
        { id: "ch-f4", title: "Kepatuhan Mutu SVLK Rantai Pasok", category: "Kepatuhan", solved: true, detail: "Audit berkala rantai pengangkutan kayu dari TPH (Tempat Penumpukan Kayu) ke pabrik pulp/sawmill." }
      ],
      riskActionHigh: "Sangat baik! Armada pengangkut kayu Anda memiliki dokumen SKSHHK & SVLK lengkap. Kepatuhan hukum dan ekspor terjamin.",
      riskActionLow: "Bahaya! Pengangkutan hasil hutan tanpa SKSHHK digital dan sertifikasi SVLK berisiko penyitaan armada dan pidana kehutanan."
    };
  }

  // 6. Default General Logistics / Enterprise
  return {
    sectorKey: "general",
    sectorBadge: "ENTERPRISE LOGISTICS & ESG",
    matrixTitle: "Matriks Kebijakan Lintas Batas & ESG Logistik",
    regulations: [
      {
        id: "reg-g1",
        name: "GHG Protocol & Scope 1-3 Carbon Standard",
        scope: "Global" as const,
        impactScore: 8,
        status: "Berlaku" as const,
        description: "Standar global pelaporan emisi gas rumah kaca untuk armada transportasi dan aktivitas rantai pasok."
      },
      {
        id: "reg-g2",
        name: "EU Supply Chain Due Diligence (CSDDD)",
        scope: "Global" as const,
        impactScore: 8,
        status: "Tahap Transisi" as const,
        description: "Uji tuntas wajib bagi korporasi internasional untuk menjamin standar lingkungan dan HAM pada mitra logistik."
      },
      {
        id: "reg-g3",
        name: "Penertiban ODOL (Over Dimension Over Load)",
        scope: "Nasional" as const,
        impactScore: 10,
        status: "Berlaku" as const,
        description: "Regulasi ketat batas dimensi dan tonase muatan armada angkutan barang demi keselamatan infrastruktur jalan."
      },
      {
        id: "reg-g4",
        name: "Perpres No. 98/2021 (Nilai Ekonomi Karbon)",
        scope: "Nasional" as const,
        impactScore: 8,
        status: "Berlaku" as const,
        description: "Landasan penerapan pajak karbon dan efisiensi BBM pada sektor transportasi darat dan maritim."
      }
    ],
    riskCalcBadge: "ODOL & ESG LOGISTICS CALCULATOR",
    riskCalcTitle: "Simulasi Kepatuhan Armada & Beban Tonase",
    toggle1Label: "Kepatuhan Beban Tonase (Bebas ODOL)",
    toggle2Label: "Sertifikasi ISO 14001 / Safe Transport",
    telemetryLabel: "Metode Telemetri GPS & Telematics Driver",
    originLabel: "Kategori Rute & Infrastruktur",
    originOptions: ["Jalan Tol & Arterial Utama", "Rute Intermodal River-Land", "Rute Remote Off-Road"],
    nationalTitle: "Instrumen Kebijakan Logistik & Kepatuhan ODOL (Indonesia)",
    nationalDesc: "Integrasi teknologi e-weighing dan IoT telematics membantu armada Pancaran menjamin keamanan muatan serta efisiensi konsumsi BBM.",
    nationalBoxes: [
      { tag: "KONTROL ODOL", title: "Penimbangan Digital Onboard", desc: "Monitoring berat muatan otomatis untuk mencegah sanksi overdimensi di jembatan timbang." },
      { tag: "E-MANIFEST DIGITIZATION", title: "Pencegahan Pungli", desc: "Digitalisasi surat jalan (e-POD) menggantikan dokumen fisik manual di pos jalur angkutan." },
      { tag: "EMISI CO2 FLEET", title: "Audit Efisiensi Solar", desc: "Laporan jejak karbon bulanan per km perjalanan untuk kepatuhan audit ESG klien." }
    ],
    carbonTaxTitle: "Proyeksi Pajak Karbon Logistik",
    carbonTaxDesc: "Efisiensi rute dan penghematan solar industri menekan pajak karbon hingga Rp 30.000 / ton CO2e.",
    challenges: [
      { id: "ch-g1", title: "Ketimpangan Infrastruktur Jalan Daerah", category: "Infrastruktur", solved: false, detail: "Jalan rusak dan macet di rute non-tol meningkatkan konsumsi BBM hingga 25%." },
      { id: "ch-g2", title: "Integrasi Sistem Multimoda Darat-Laut", category: "Konektivitas", solved: true, detail: "Pancaran Group menghubungkan angkutan truk dengan kapal/tongkang secara seamless." },
      { id: "ch-g3", title: "Tinggi Biaya Solar Industri Non-Subsidi", category: "Finansial", solved: false, detail: "Fluktuasi harga BBM menekan margin usaha logistik jika rute tidak teroptimasi." },
      { id: "ch-g4", title: "Pelaporan Jejak Karbon Manual", category: "Teknologi", solved: true, detail: "Sistem IoT Pancaran menghitung kalkulasi emisi CO2 otomatis per ritase." }
    ],
    riskActionHigh: "Sangat baik! Armada Anda bebas ODOL dan didukung telemetri GPS real-time. Memenuhi standar ESG enterprise.",
    riskActionLow: "Peringatan! Risiko kecelakaan dan penindakan jembatan timbang tinggi jika muatan melebihi batas tonase ODOL."
  };
}

export function GlobalNatOverviewDeepDive({ projectTitle }: GlobalNatProps) {
  const sectorConfig = getSectorConfig(projectTitle);
  const globalRegs = sectorConfig.regulations.filter(r => r.scope === "Global");
  const nationalRegs = sectorConfig.regulations.filter(r => r.scope === "Nasional");

  return (
    <div id="global-nat-overview-deepdive-root" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl mt-8 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Info */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            {sectorConfig.sectorBadge}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            PROJECT: {projectTitle || "Kajian Strategis PRAMA"}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Global & National (NAT) Overview
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-semibold max-w-3xl leading-relaxed">
          Ringkasan komprehensif sinkronisasi regulasi internasional, tantangan operasional domestik, serta kebijakan strategis nasional untuk memastikan keberlanjutan dan kepatuhan proyek <span className="text-blue-300 font-extrabold">"{projectTitle || "Kajian Strategis PRAMA"}"</span>.
        </p>
      </div>

      {/* Main Structured Box Container */}
      <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5 space-y-6">
        
        {/* 1. Regulasi Global */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Regulasi Global (International Standards)</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Standar kepatuhan internasional, ESG, dan traktat lintas batas</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {globalRegs.map((reg) => (
              <div key={reg.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[10px] font-black text-purple-300 uppercase">{reg.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{reg.status}</span>
                </div>
                <p className="text-[10.5px] text-slate-300 leading-relaxed font-semibold">{reg.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tantangan & Kebutuhan */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Tantangan & Kebutuhan Operasional</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Kendala lapangan, mitigasi risiko, dan kebutuhan kesiapan armada/teknologi</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectorConfig.challenges.map((ch) => (
              <div key={ch.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 flex items-start gap-2.5">
                <div className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${ch.solved ? "bg-emerald-400" : "bg-amber-400"}`} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-black text-slate-200 uppercase">{ch.title}</span>
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">{ch.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{ch.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Kebijakan Nasional */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Kebijakan Nasional (Domestic Framework)</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{sectorConfig.nationalTitle}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-semibold mb-3 leading-relaxed">
            {sectorConfig.nationalDesc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sectorConfig.nationalBoxes.map((box, idx) => (
              <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                <span className="text-[8.5px] font-mono font-black text-emerald-400 block mb-1">{box.tag}</span>
                <h5 className="text-[11px] font-black text-white uppercase tracking-tight">{box.title}</h5>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
