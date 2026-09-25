/**
 * Potential Consumers Generator (Pilar 16)
 * Dynamically synthesizes title-tailored Tier-1 Corporate Target Accounts,
 * Buyer Personas, Decision-Making Unit (DMU) Mapping, Commercial Contract Terms,
 * and Corporate Value Propositions.
 */

import { detectProjectArchetype } from "./archetypeDetector.ts";

export interface TargetAccount {
  companyName: string;
  category: string;
  location: string;
  demandVolume: string;
  specificNeed: string;
}

export interface DmuMember {
  role: string;
  title: string;
  primaryConcern: string;
  buyingCriteria: string;
}

export interface ContractTerm {
  parameter: string;
  standardTerm: string;
  strategicNote: string;
}

export interface ValuePropItem {
  headline: string;
  description: string;
  advantageVsCompetitor: string;
}

export interface PotentialConsumersResult {
  title: string;
  division: string;
  sectorName: string;
  targetAccounts: TargetAccount[];
  dmuProfiles: DmuMember[];
  contractTerms: ContractTerm[];
  valuePropositions: ValuePropItem[];
  narrativeMarkdown: string;
}

export function generatePotentialConsumersForTitle(projectTitle: string, divisionName?: string): PotentialConsumersResult {
  const pName = (projectTitle || "Kajian Kelayakan Strategis Logistik").trim();
  const lower = pName.toLowerCase();
  const divName = divisionName || "Logistik & Transportasi";

  const cleanCore = pName
    .replace(/^(kajian strategis|kajian kelayakan|analisis kelayakan|proyek|project|kajian|analisis|evaluasi|rencana bisnis|proposal)[\s:]+/i, "")
    .trim() || pName;

  // 1. Susu / Dairy / Lembang / Peternakan / Cold Chain
  if (
    lower.includes("susu") ||
    lower.includes("dairy") ||
    lower.includes("lembang") ||
    lower.includes("milk") ||
    lower.includes("sapi") ||
    lower.includes("peternakan") ||
    lower.includes("kpsbu")
  ) {
    const sector = "Industri Pengolahan Susu (IPS) & Rantai Pasok Peternakan Sapi Perah";

    const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Fokus Akun:** Industri Pengolahan Susu (IPS) Nasional, Koperasi Peternak, & Brand Dairy Modern

---

## 1. PEMETAAN AKUN KORPORAT UTAMA (TIER-1 TARGET ACCOUNTS)
Analisis konsumen potensial pada proyek **"${pName}"** difokuskan pada pemetaan akun-akun manufaktur pengolahan susu terkemuka dan sentra koperasi peternak di Jawa Barat dan sekitarnya:
- **PT Ultrajaya Milk Industry & Trading Company Tbk (Padalarang, Bandung Barat):** Pabrik pengolahan susu UHT dan minuman segar terbesar di Jawa Barat yang membutuhkan pasokan susu murni segar dari Lembang dengan jaminan kebersihan higienis harian.
- **PT Frisian Flag Indonesia (Plant Pasar Rebo & Ciracas, Jakarta):** Produsen susu olahan skala multinasional dengan standar audit kualitas supplier susu segar ketat (standar internasional FrieslandCampina).
- **PT Indolakto - Indofood CBP Sukses Makmur Tbk (Plant Sukabumi / Cicurug):** Kebutuhan pasokan bahan baku susu segar harian untuk lini produksi susu pasteurisasi, kental manis, dan es krim.
- **PT Cisarua Mountain Dairy Tbk (Cimory - Bogor / Bandung):** Produsen yogurt dan susu pasteurisasi premium dengan pertumbuhan serapan susu segar yang sangat pesat.
- **Koperasi Peternak Sapi Bandung Utara (KPSBU Lembang):** Mitra simpul agregasi peternak lokal yang menampung puluhan ton susu segar harian dari ribuan peternak di kawasan Lembang dan sekitarnya.

---

## 2. PROFIL DECISION-MAKING UNIT (DMU) DI PERUSAHAAN SUSU
- **Direktur Rantai Pasok & Pengadaan (Head of Procurement):** Fokus pada kepastian harga tarif ritase per liter yang terprediksi, tenor pembayaran kompetitif, dan rekam jejak legalitas perusahaan transporter.
- **Manajer Pengendalian Kualitas (Quality Assurance / QC Manager):** Sangat kritis terhadap sterilitas tangki stainless steel, sertifikasi uji food-grade, serta histori deviasi suhu yang tidak boleh melampaui 4°C.
- **Manajer Operasional Pabrik (Plant Logistics Manager):** Menuntut ketepatan jadwal kedatangan truk tangki agar proses pasteurisasi susu tidak tertunda dan kapasitas silo pabrik termanfaatkan optimal.
- **Manajer K3 & Lingkungan (EHS Manager):** Menekankan kepatuhan SOP penanganan limbah air cucian tangki (CIP) dan standar keselamatan pengemudi di area bongkar muat pabrik.

---

## 3. STRUKTUR KONTRAK & KEBUTUHAN SPESIFIK PENGADAAN
- **Format Kontrak Jangka Panjang (LTSA 3-5 Tahun):** Skema kontrak multi-tahun dengan jaminan unit tangki berinsulasi terdedikasi (dedicated tankers) guna mencegah kontaminasi silang.
- **Struktur Tarif Terindeksasi:** Biaya jasa per liter atau per ritase dengan klausul eskalasi penyesuaian harga BBM solar industri yang disepakati bersama secara transparan.
- **Jaminan Ketersediaan Armada Pengganti:** Kewajiban penyediaan armada backup standby dalam radius operasional < 45 menit dari Lembang untuk mengantisipasi potensi kendala teknis.

---

## 4. PROPOSISI NILAI PEMBEDA (VALUE PROPOSITIONS PRAMA MITRA)
- **Armada Tangki SUS 304/316 Terinsulasi Canggih:** Dilengkapi sistem agitator kontinu pencegah pemisahan krim dan lapisan termo-insulasi polyurethane ganda.
- **Transparansi Suhu via IoT Real-Time:** Klien mendapatkan akses pemantauan grafik suhu susu 24/7 melalui aplikasi ponsel dan integrasi API ke sistem ERP pabrik.
- **Sertifikasi Higienitas & Kepatuhan BPOM/Halal:** Seluruh prosedur operasional dan sanitasi memenuhi standar Cara Distribusi Pangan Olahan yang Baik (CDPOB).`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetAccounts: [
        {
          companyName: "PT Ultrajaya Milk Industry Tbk",
          category: "Tier-1 IPS Nasional (Padalarang)",
          location: "Bandung Barat, Jawa Barat",
          demandVolume: "80.000 - 120.000 Liter / Hari",
          specificNeed: "Jadwal ritase tepat waktu dari peternakan Lembang dengan suhu stabil 2°C-4°C untuk lini susu UHT."
        },
        {
          companyName: "PT Frisian Flag Indonesia",
          category: "Tier-1 Multinasional Dairy",
          location: "Ciracas & Pasar Rebo, Jakarta",
          demandVolume: "60.000 - 100.000 Liter / Hari",
          specificNeed: "Kepatuhan audit standar FrieslandCampina, tangki steril CIP otomatis, dan pelacakan digital e-DO."
        },
        {
          companyName: "PT Indolakto (Indofood Group)",
          category: "Tier-1 FMCG Dairy Conglomerate",
          location: "Cicurug, Sukabumi / Purwosari",
          demandVolume: "50.000 - 90.000 Liter / Hari",
          specificNeed: "Kontrak jangka panjang multi-tahun dengan SLA keandalan armada > 99% dan unit cadangan."
        },
        {
          companyName: "PT Cisarua Mountain Dairy Tbk (Cimory)",
          category: "Tier-1 Premium Dairy & Yogurt",
          location: "Bogor / Sentul / Cisarua",
          demandVolume: "30.000 - 60.000 Liter / Hari",
          specificNeed: "Penanganan susu berkualitas tinggi tanpa pemisahan lemak untuk menjaga rasa dan tekstur produk yogurt."
        },
        {
          companyName: "KPSBU Lembang & KUD Peternak",
          category: "Koperasi Agregasi Peternak Susu",
          location: "Lembang, Bandung Utara",
          demandVolume: "100.000+ Liter / Hari",
          specificNeed: "Ketepatan waktu pengambilan susu pagi dan sore pasca pemerahan di titik-titik cooling center."
        }
      ],
      dmuProfiles: [
        {
          role: "Head of Procurement & Sourcing",
          title: "Direktur Pengadaan Bahan Baku",
          primaryConcern: "Stabilitas biaya logistik per liter, kepastian ketersediaan armada, dan fleksibilitas termin pembayaran.",
          buyingCriteria: "Tarif kompetitif berindeksasi transparan, legalitas perusahaan lengkap, dan kontrak jangka panjang."
        },
        {
          role: "Quality Assurance (QA/QC) Manager",
          title: "Manajer Pengendalian Mutu Pabrik",
          primaryConcern: "Sterilitas tangki stainless steel, sertifikasi food-grade, dan toleransi deviasi suhu kargo < 4°C.",
          buyingCriteria: "Hasil uji swab bakteriologis tangki negatif, histori log suhu digital tanpa cela, dan SOP sanitasi CIP."
        },
        {
          role: "Plant Operations & Logistics Head",
          title: "Manajer Operasional Pabrik & Gudang",
          primaryConcern: "Ketepatan jadwal kedatangan armada agar proses penerimaan ke silo tidak menumpuk.",
          buyingCriteria: "SLA ketepatan waktu penerimaan (OTIF) ≥ 99% dan kesiapan unit armada cadangan di area lokal."
        },
        {
          role: "EHS & Sustainability Lead",
          title: "Manajer Keselamatan Kerja & Lingkungan",
          primaryConcern: "Pencegahan insiden tumpahan di pabrik, kepatuhan keselamatan pengemudi, dan pengolahan limbah bilasan.",
          buyingCriteria: "Sertifikasi K3 pengemudi, APD food-grade lengkap, dan standar ramah lingkungan armada EURO 4/5."
        }
      ],
      contractTerms: [
        {
          parameter: "Durasi Tenor Kontrak (Tenure)",
          standardTerm: "36 - 60 Bulan (LTSA Terikat)",
          strategicNote: "Memberikan kepastian pengembalian investasi (capex tangki berinsulasi) dan stabilitas pendapatan."
        },
        {
          parameter: "Struktur Biaya & Penagihan",
          standardTerm: "Tarif IDR per Liter Terkirim / Ritase Terindeks BBM",
          strategicNote: "Klausul penyesuaian harga solar industri otomatis setiap fluktuasi ±5% harga Pertamina."
        },
        {
          parameter: "Term of Payment (TOP)",
          standardTerm: "30 - 45 Hari Kalender",
          strategicNote: "Standar industri FMCG dairy dengan didukung fasilitas supply chain financing jika diperlukan."
        },
        {
          parameter: "Jaminan SLA & Rasio Cadangan",
          standardTerm: "Keandalan Waktu ≥ 99.0% & Rasio Cadangan 1:5",
          strategicNote: "Penyediaan 1 unit tangki cadangan untuk setiap 5 unit operasional aktif di koridor Jawa Barat."
        }
      ],
      valuePropositions: [
        {
          headline: "Tangki Food-Grade Stainless Steel SUS 304/316 dengan Chiller Agitator",
          description: "Didesain khusus untuk menjaga kualitas susu segar tanpa degradasi lemak atau kontaminasi bakteri.",
          advantageVsCompetitor: "Kompetitor lokal sering memakai tangki modifikasi non-insulasi yang rentan menyebabkan susu asam."
        },
        {
          headline: "Telematika IoT Suhu Real-Time & Integrasi API Dashboard",
          description: "Klien dapat memantau grafik suhu, posisi GPS, dan estimasi waktu tiba (ETA) langsung dari layar sistem pabrik.",
          advantageVsCompetitor: "Transparansi penuh menghilangkan sengketa saat pengujian sampel laboratorium di pintu gerbang pabrik."
        },
        {
          headline: "SOP Sanitasi CIP Otomatis Berstandar BPOM & Halal",
          description: "Pembersihan tangki terjadwal dengan bahan kimia food-grade berlisensi dan sertifikat inspeksi berkala.",
          advantageVsCompetitor: "Memberikan jaminan kepatuhan audit regulasi pangan internasional bagi produsen susu ternama."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 2. Semen / Cement / Konstruksi
  if (lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("klinker")) {
    const sector = "Industri Semen & Kontraktor Konstruksi Ready-Mix";

    const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Fokus Akun:** Produsen Semen Nasional, Perusahaan Beton Ready-Mix, & Kontraktor BUMN

---

## 1. PEMETAAN AKUN KORPORAT UTAMA (TIER-1 TARGET ACCOUNTS)
- **PT Semen Indonesia (Persero) Tbk (SIG):** Holding produsen semen terbesar di Indonesia dengan kebutuhan armada distribusi curah antar silo pabrik dan batching plant.
- **PT Indocement Tunggal Prakarsa Tbk (Tiga Roda):** Distribusi semen curah dari pabrik Citeureup / Cirebon menuju koridor proyek Jabodetabek dan Jawa Barat.
- **PT Solusi Bangun Indonesia Tbk (Dynamix):** Jaringan pasokan semen curah terintegrasi untuk proyek infrastruktur strategis nasional.
- **Perusahaan Beton Ready-Mix (SCG Ready-Mix, Merak Beton, Pionirbeton):** Pelanggan yang membutuhkan kepastian pengisian semen tepat waktu guna menjaga kelancaran operasional pengecoran.

---

## 2. PROFIL DECISION-MAKING UNIT (DMU)
- **Head of Logistics & Distribution Produsen Semen:** Mengutamakan ketersediaan unit tangki kapsul berskala besar dan kepatuhan regulasi ODOL.
- **Batching Plant Manager:** Membutuhkan pembongkaran muatan cepat menggunakan kompresor unloader bertekanan tinggi tanpa macet.
- **Procurement Manager:** Menuntut tarif kompetitif per ton-kilometer dengan komitmen pemenuhan ritase bulanan tinggi.

---

## 3. STRUKTUR KONTRAK & KEBUTUHAN PENGADAAN
- **Tenor Kontrak:** 2 - 3 Tahun dengan target kuota tonase bulanan minimum terikat.
- **Skema Tarif:** IDR per Ton / KM dengan penyesuaian harga BBM industri.
- **SLA Kinerja:** Ketersediaan unit tangki di atas 95% dan waktu pembongkaran di bawah 45 menit per unit.

---

## 4. PROPOSISI NILAI PEMBEDA
- **Armada Kapsul Hi-Blow Baru Bebas ODOL:** Mematuhi batas beban MST Kemenhub sehingga bebas tilang di jembatan timbang WIM.
- **Kompresor Blower Bertenaga Tinggi:** Memangkas waktu tunggu pembongkaran muatan hingga 30% lebih cepat dari armada rata-rata pasar.`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetAccounts: [
        {
          companyName: "PT Semen Indonesia (Persero) Tbk (SIG)",
          category: "Tier-1 Holding BUMN Semen",
          location: "Tuban / Gresik / Narogong",
          demandVolume: "15.000 - 25.000 Ton / Bulan",
          specificNeed: "Armada tangki silo bebas ODOL untuk distribusi ke silo terminal dan proyek jalan tol Trans Jawa."
        },
        {
          companyName: "PT Indocement Tunggal Prakarsa Tbk",
          category: "Tier-1 Produsen Semen Swasta",
          location: "Citeureup / Cirebon",
          demandVolume: "10.000 - 20.000 Ton / Bulan",
          specificNeed: "Keandalan unit prime mover penarik tangki kapsul untuk rute Jabodetabek dan sekitarnya."
        },
        {
          companyName: "PT Pionirbeton Industri",
          category: "Tier-1 Produsen Beton Ready-Mix",
          location: "Jabodetabek / Jawa Barat",
          demandVolume: "8.000 - 15.000 Ton / Bulan",
          specificNeed: "Ketepatan jadwal kirim pengisian silo batching plant proyek pengecoran gedung bertingkat."
        },
        {
          companyName: "PT Solusi Bangun Indonesia Tbk",
          category: "Tier-1 Semen Komersial",
          location: "Cilacap / Narogong",
          demandVolume: "7.000 - 12.000 Ton / Bulan",
          specificNeed: "Integrasi sistem e-delivery order dan kepatuhan standar keselamatan kerja pabrik."
        }
      ],
      dmuProfiles: [
        {
          role: "Supply Chain & Logistics Director",
          title: "Direktur Logistik & Distribusi",
          primaryConcern: "Kelancaran evakuasi semen dari pabrik dan pencegahan penumpukan stok di gudang semen.",
          buyingCriteria: "Kapasitas armada besar, rekam jejak keselamatan teruji, dan sistem manajemen armada terintegrasi."
        },
        {
          role: "Procurement Manager",
          title: "Manajer Pengadaan Jasa Transportasi",
          primaryConcern: "Biaya logistik per ton terendah dengan pemenuhan target kuota ritase bulanan yang konsisten.",
          buyingCriteria: "Tarif bersaing, jaminan unit dedicated, dan fasilitas asuransi muatan komprehensif."
        },
        {
          role: "Batching Plant Operations Head",
          title: "Kepala Operasional Batching Plant",
          primaryConcern: "Kecepatan pembongkaran semen ke dalam silo tanpa menimbulkan polusi debu beterbangan.",
          buyingCriteria: "Kondisi kompresor blower unloader terawat prima dan selang pembongkaran anti-bocor."
        }
      ],
      contractTerms: [
        {
          parameter: "Durasi Tenor Kontrak",
          standardTerm: "24 - 36 Bulan (Dapat Diperpanjang)",
          strategicNote: "Mengamankan utilisasi kapasitas armada tangki kapsul dalam jangka panjang."
        },
        {
          parameter: "Metode Penetapan Tarif",
          standardTerm: "Tarif Flat IDR / Ton / KM dengan Indeksasi Solar",
          strategicNote: "Melindungi kedua belah pihak dari dampak gejolak harga bahan bakar minyak dunia."
        },
        {
          parameter: "Term of Payment (TOP)",
          standardTerm: "45 - 60 Hari Kalender",
          strategicNote: "Disesuaikan dengan siklus penagihan proyek infrastruktur korporat."
        }
      ],
      valuePropositions: [
        {
          headline: "Armada Tangki Kapsul Bertekanan Bebas ODOL",
          description: "Desain sasis dan distribusi gandar resmi Kemenhub yang aman melintasi jembatan timbang online.",
          advantageVsCompetitor: "Mencegah keterlambatan dan denda tilang akibat kelebihan muatan sumbu terberat."
        },
        {
          headline: "Kompresor Unloader Bertenaga Cepat",
          description: "Tekanan kerja stabil 2.0 bar yang mampu menuntaskan pembongkaran 30 ton dalam tempo < 45 menit.",
          advantageVsCompetitor: "Memangkas waktu antre truk di area batching plant hingga setengah dari waktu rata-rata."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 3. Batubara / Hauling Tambang / Nikel
  if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("hauling") || lower.includes("nikel")) {
    const isNickel = lower.includes("nikel") || lower.includes("nickel");
    const sector = isNickel ? "Perusahaan Pertambangan Nikel & Pengelola Smelter" : "Pemegang PKP2B / IUP Tambang Batubara & Operator Jetty";

    const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Fokus Akun:** Pemegang Izin Usaha Pertambangan (IUP), Smelter Nikel, & Trader Tambang

---

## 1. PEMETAAN AKUN KORPORAT UTAMA (TIER-1 TARGET ACCOUNTS)
- **Pemegang Konsesi Tambang (IUP / PKP2B):** Perusahaan tambang skala besar yang membutuhkan kontraktor hauling andal untuk memindahkan material batubara/nikel dari front tambang ke jetty penumpukan.
- **Pengelola Smelter Nikel & Pembangkit Listrik (PLTU):** End-user yang menuntut pasokan kontinu tanpa jeda guna menjaga kelangsungan tungku pembakaran (furnace) atau boiler.
- **Trader & Kontraktor Utama Pertambangan:** Mitra kerjasama operasi yang memerlukan penambahan armada dump truck heavy-duty siap kerja dengan mekanik mandiri.

---

## 2. PROFIL DECISION-MAKING UNIT (DMU)
- **Kepala Teknik Tambang (KTT):** Memastikan seluruh armada dan operator mematuhi SOP keselamatan pertambangan (SMKP) dan lolos inspeksi commissioning.
- **General Manager Mining Operations:** Berorientasi pada pencapaian target ritase harian dan ketersediaan fisik armada (PA > 90%).
- **Mining Procurement Specialist:** Menilai struktur tarif per bcm/ton-km serta kelayakan jaminan pelaksanaan proyek.

---

## 3. STRUKTUR KONTRAK & PERSYARATAN
- **Kontrak Jangka Panjang (3-5 Tahun):** Disertai jaminan volume minimal (take-or-pay) bulanan.
- **Sistem Pelaporan Digital:** Integrasi langsung dengan modul SIMBARA ESDM dan timbangan jembatan tambang.
- **Workshop Mandiri On-Site:** Penyediaan fasilitas perbaikan darurat dan suku cadang fast-moving langsung di lokasi tambang.

---

## 4. PROPOSISI NILAI PEMBEDA
- **Ketersediaan Fisik Armada (PA) ≥ 90%:** Didukung mekanik bersertifikat dan sistem maintenance preventif terjadwal.
- **Dump Truck Heavy-Duty Spesifikasi Tambang:** Bak baja anti-abrasi Hardox dan penggerak 6x4 berdaya jelajah tangguh di segala cuaca.`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetAccounts: [
        {
          companyName: isNickel ? "PT Vale Indonesia / IMIP Smelter" : "PT Bukit Asam Tbk / Adaro Energy",
          category: isNickel ? "Tier-1 Konsorsium Smelter Nikel" : "Tier-1 Konglomerasi Pertambangan Batubara",
          location: isNickel ? "Morowali / Pomalaa / Halmahera" : "Kalimantan Timur / Sumatera Selatan",
          demandVolume: "100.000 - 250.000 Ton / Bulan",
          specificNeed: "Jaminan hauling 24/7 dari stockpile pit menuju jetty dengan ketersediaan fisik armada > 90%."
        },
        {
          companyName: isNickel ? "PT Aneka Tambang Tbk (Antam)" : "PT Kaltim Prima Coal (KPC)",
          category: "Tier-1 BUMN / Swasta Pertambangan",
          location: "Kawasan Konsesi Tambang",
          demandVolume: "80.000 - 150.000 Ton / Bulan",
          specificNeed: "Kepatuhan penuh standar SMKP Minerba ESDM dan integrasi SIMBARA tanpa celah kebocoran tonase."
        },
        {
          companyName: isNickel ? "PT Wanatiara Persada" : "PT Berau Coal Energy",
          category: "Tier-1 Produsen Komoditas Tambang",
          location: "Kalimantan / Sulawesi",
          demandVolume: "50.000 - 100.000 Ton / Bulan",
          specificNeed: "Dukungan tim mekanik mandiri dan mobile workshop di rute hauling guna meminimalkan hambatan jalur."
        }
      ],
      dmuProfiles: [
        {
          role: "Kepala Teknik Tambang (KTT)",
          title: "Penanggung Jawab Teknis & Keselamatan Tambang",
          primaryConcern: "Pencegahan insiden fatal (zero fatality), kelayakan unit saat commissioning, dan kepatuhan SOP K3.",
          buyingCriteria: "Sertifikasi keselamatan unit lengkap, riwayat keselamatan operator bersih, dan kepatuhan rambu tambang."
        },
        {
          role: "Mining Operations Director",
          title: "Direktur Operasi Penambangan",
          primaryConcern: "Pemenuhan target tonase bulanan untuk pengisian tongkang (barge) tepat waktu agar bebas denda demurrage.",
          buyingCriteria: "Physical Availability (PA) armada > 90% dan kecepatan penanganan unit breakdown di jalur hauling."
        },
        {
          role: "Senior Procurement Specialist",
          title: "Spesialis Pengadaan Jasa Pertambangan",
          primaryConcern: "Kompensasi tarif per ton-km yang efisien dengan penalti keterlambatan yang adil dan transparan.",
          buyingCriteria: "Stabilitas finansial kontraktor, kesiapan bank garansi, dan fleksibilitas skema take-or-pay."
        }
      ],
      contractTerms: [
        {
          parameter: "Durasi Tenor Kontrak",
          standardTerm: "36 - 60 Bulan (Kontrak Jangka Panjang)",
          strategicNote: "Klausul take-or-pay minimum volume bulanan untuk menjamin amortisasi investasi armada alat berat."
        },
        {
          parameter: "Formula Tarif Ritase",
          standardTerm: "IDR per Ton / KM dengan Klausul Fuel Pass-Through",
          strategicNote: "Konsumsi solar industri disediakan atau diindeksasi langsung dengan harga resmi pertambangan."
        },
        {
          parameter: "Term of Payment (TOP)",
          standardTerm: "30 - 45 Hari Kalender",
          strategicNote: "Verifikasi berbasis laporan timbangan weighbridge resmi yang telah disepakati bersama."
        }
      ],
      valuePropositions: [
        {
          headline: "Physical Availability (PA) Terjamin ≥ 90%",
          description: "Dukungan mekanik stanby 24 jam dan gudang spare parts darurat langsung di area tambang.",
          advantageVsCompetitor: "Menghindarkan perusahaan tambang dari penumpukan stok di pit atau kekosongan muatan di jetty."
        },
        {
          headline: "Kepatuhan Total Terhadap Kaidah K3 & SIMBARA",
          description: "Setiap ritase terverifikasi barcode digital resmi yang memudahkan audit kepatuhan ESDM.",
          advantageVsCompetitor: "Menjamin reputasi izin konsesi tambang tetap terjaga dari sanksi administratif kementerian."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 4. Default / Archetype-Aligned (Manufacturing, Personal SME, or Generic Transport)
  const archetype = detectProjectArchetype(pName);

  if (archetype === 'manufacturing') {
    const sector = `Pasar Distribusi & Klien Industri ${cleanCore}`;
    const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Pemetaan Akun Korporat Industri B2B & Decision Making Unit (DMU)

---

## 1. SEGMENTASI AKUN TARGET INDUSTRI
Pemetaan pasar B2B fasilitas manufaktur untuk proyek **"${pName}"** difokuskan pada:
- **Jaringan Distributor & Agen Grosir Nasional:** Entitas penyerap volume produksi terbesar dengan jaringan ritel luas.
- **Perusahaan Perakitan & Industri Hilir:** Pengguna bahan olahan industri untuk proses manufaktur lanjutan.
- **Klien Pemilik Merek Swasta (Maklon / OEM):** Brand owner yang memanfaatkan keandalan fasilitas pabrik berstandar ISO 9001.

---

## 2. PROFIL DECISION MAKING UNIT (DMU)
- **Direktur Pengadaan & Rantai Pasok (Buyer):** Mengutamakan kepastian volume pasokan, stabilitas harga kontrak tahunan, dan sertifikasi mutu (CoA).
- **Manajer Pengendalian Mutu & QC (Influencer):** Menilai kepatuhan toleransi spesifikasi teknis dan audit fasilitas pabrik.
- **Manajer Produksi / Pabrik (User):** Menuntut ketepatan jadwal kedatangan bahan (JIT) dan kemudahan penanganan material.

---

## 3. STRUKTUR KONTRAK & PERSYARATAN KOMERSIAL
- **Tenor Kontrak:** Kontrak pasokan tahunan 12 - 24 bulan dengan klausul Minimum Order Quantity (MOQ).
- **Struktur Harga:** Diskon volume bertingkat (*tiered pricing*) dan formula penyesuaian harga bahan baku transparan.
- **Term of Payment (TOP):** 30 - 45 hari kalender setelah verifikasi batch lolos uji mutu.

---

## 4. PROPOSISI NILAI PEMBEDA
- **Jaminan Konsistensi Mutu & Sertifikasi Lengkap:** Setiap pengiriman disertai Certificate of Analysis (CoA) resmi dan lolos uji laboratorium mandiri.
- **Efisiensi Biaya Dibandingkan Barang Impor:** Waktu tunggu (lead time) 70% lebih singkat dan perlindungan dari fluktuasi kurs mata uang asing.`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetAccounts: [
        {
          companyName: `Distributor Utama Nasional Sektor ${cleanCore}`,
          category: "Tier-1 Wholesaler & Distribusi Nasional",
          location: "Sentra Distribusi Industri Regional",
          demandVolume: "Kontrak Pasokan 30.000 - 50.000 Unit / Bulan",
          specificNeed: `Pasokan stabil teratur untuk produk ${cleanCore} dengan sertifikasi mutu ISO 9001 dan garansi retur cacat.`
        },
        {
          companyName: `Perusahaan Manufaktur Hilir & Perakitan`,
          category: "Tier-1 Mitra Industri Pengguna",
          location: "Kawasan Industri Terpadu",
          demandVolume: "Batch Rutin Mingguan (Just-In-Time)",
          specificNeed: "Toleransi presisi dimensi tinggi dan kepatuhan jadwal pengiriman ketat (OTIF ≥ 98.8%)."
        },
        {
          companyName: `Brand Owner Swasta (Kemitraan Maklon / OEM)`,
          category: "Mitra Lisensi & Maklon B2B",
          location: "Pusat Bisnis Nasional",
          demandVolume: "Volume Maklon Terjadwal Tahunan",
          specificNeed: "Kerahasiaan formula/desain, izin edar resmi terdaftar, dan fleksibilitas penyesuaian kemasan."
        }
      ],
      dmuProfiles: [
        {
          role: "Procurement & Supply Chain Director",
          title: "Direktur Pengadaan & Rantai Pasok",
          primaryConcern: "Kepastian pasokan jangka panjang, stabilitas harga grosir, dan rekam jejak kepatuhan pemasok.",
          buyingCriteria: "Sertifikasi ISO 9001, audit pabrik, dan klausul ganti rugi keterlambatan pasokan."
        },
        {
          role: "Quality Assurance & QC Manager",
          title: "Manajer Jaminan Mutu & QC",
          primaryConcern: "Kesesuaian parameter kimia/fisika produk dengan standar internal dan toleransi reject rate rendah.",
          buyingCriteria: "Hasil uji laboratorium independen, ketersediaan Certificate of Analysis (CoA), dan sertifikat SNI/BPOM."
        },
        {
          role: "Plant Operations Manager",
          title: "Manajer Operasional Pabrik / Pengguna",
          primaryConcern: "Kemudahan proses bongkar muat palet, integritas kemasan saat transit, dan ketepatan jadwal kedatangan.",
          buyingCriteria: "Standardisasi palletizing, pelabelan barcode batch yang jelas, dan kemasan tahan kelembapan."
        }
      ],
      contractTerms: [
        {
          parameter: "Durasi Tenor Kontrak",
          standardTerm: "12 - 24 Bulan (Tinjauan Volume & SLA Kuartalan)",
          strategicNote: "Memberikan kepastian serapan kapasitas pabrik sekaligus fleksibilitas penyesuaian kapasitas produksi."
        },
        {
          parameter: "Struktur Harga & Diskon Volume",
          standardTerm: "Skema Tiered Pricing Berdasarkan Akumulasi Order Bulanan",
          strategicNote: "Mendorong komitmen pemesanan volume besar dari distributor utama."
        },
        {
          parameter: "Term of Payment (TOP)",
          standardTerm: "30 - 45 Hari Kalender Pasca Pengiriman Lolos QC",
          strategicNote: "Menyelaraskan arus kas operasional pabrik dengan siklus penagihan pelanggan korporat."
        }
      ],
      valuePropositions: [
        {
          headline: "Jaminan Mutu Terstandarisasi dengan Sertifikasi Lengkap",
          description: "Fasilitas produksi menerapkan standar ISO 9001:2015 dengan inspeksi laboratorium mandiri pada setiap batch.",
          advantageVsCompetitor: "Menjamin reject rate di bawah 1.5%, jauh lebih unggul dibandingkan kompetitor lokal konvensional."
        },
        {
          headline: "Lead Time Pengiriman Cepat & Skalabilitas Kapasitas",
          description: "Waktu pemenuhan pesanan domestik hanya 3-5 hari kerja, mengeliminasi risiko keterlambatan impor kontainer.",
          advantageVsCompetitor: "Membebaskan modal kerja distributor dari keharusan menimbun persediaan cadangan dalam jumlah besar."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  if (archetype === 'personal_sme') {
    const sector = `Segmen Konsumen & Komunitas Lokal ${cleanCore}`;
    const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Pemetaan Profil Pelanggan Sasaran, Karakteristik Belanja & Retensi Loyalitas

---

## 1. SEGMENTASI KONSUMEN SASARAN LOKAL
Target pasar untuk unit usaha mandiri **"${pName}"** terbagi dalam 4 segmen utama:
- **Pekerja Kantor & Wirausaha Sekitar:** Mencari kepraktisan, kecepatan layanan di bawah 5 menit, dan kenyamanan tempat ber-AC/wifi.
- **Keluarga Muda & Warga Pemukiman:** Mengutamakan kebersihan, keamanan lingkungan ramah anak, dan nilai harga yang bersahabat (*value for money*).
- **Pelajar & Mahasiswa:** Membutuhkan tempat berkumpul santai dengan stopkontak dan wifi stabil untuk belajar kelompok.
- **Komunitas Hobi & Acara Khusus:** Potensi pemesanan dalam jumlah banyak untuk acara arisan, katering mini, dan perayaan ulang tahun.

---

## 2. KARAKTERISTIK PENGAMBIL KEPUTUSAN (BUYER PERSONA)
- **Konsumen Individu / Generasi Muda:** Mengambil keputusan berdasarkan daya tarik visual di media sosial, ulasan bintang Google Maps, dan kemudahan pembayaran digital QRIS.
- **Koordinator Pesanan Kelompok (Family/Office Buyer):** Mengutamakan kepastian ketersediaan porsi/paket, kecepatan penyiapan, dan ketepatan pesanan.

---

## 3. STRUKTUR TRANSAKSI & PENAWARAN
- **Transaksi Retail Harian:** Transaksi langsung kasir dengan rata-rata nilai belanja Rp 25.000 - Rp 45.000 per kunjungan.
- **Paket Khusus Acara / Katering:** Minimal pemesanan 20 paket dengan diskon 10% dan opsi pengantaran gratis radius 2 km.
- **Program Loyalitas Pelanggan:** Kartu stempel digital/fisik (Beli 8 Gratis 1) untuk mendorong frekuensi kunjungan ulang.

---

## 4. PROPOSISI NILAI PEMBEDA
- **Keramahan Pelayanan Personal (Hospitality):** Pelayanan akrab dan hangat yang membuat pelanggan merasa dihargai.
- **Standar Higiene & Kebersihan Prima:** Fasilitas bersih dan produk higienis yang memberikan rasa aman bagi keluarga.`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetAccounts: [
        {
          companyName: `Komunitas Perumahan & Warga Sekitar`,
          category: "Segmen Konsumen Rumah Tangga & Keluarga",
          location: "Radius 1 - 3 KM dari Lokasi Usaha",
          demandVolume: "Kunjungan Rutin Mingguan & Akhir Pekan",
          specificNeed: `Produk higienis berkualitas dengan harga bersahabat dan tempat yang nyaman untuk keluarga.`
        },
        {
          companyName: `Karyawan Kantor & Pekerja Kawasan Terdekat`,
          category: "Segmen Konsumen Produktif Harian",
          location: "Area Perkantoran & Komersial Terdekat",
          demandVolume: "Kunjungan Harian Jam Makan / Pulang Kerja",
          specificNeed: "Kecepatan layanan transaksi di bawah 5 menit dan kemudahan pembayaran non-tunai QRIS."
        },
        {
          companyName: `Pelajar, Mahasiswa & Komunitas Kreatif`,
          category: "Segmen Konsumen Muda & Komunitas",
          location: "Kampus, Sekolah & Ruang Publik Sekitar",
          demandVolume: "Kunjungan Sore & Malam Hari",
          specificNeed: "Koneksi wifi berkecepatan tinggi, stopkontak memadai, dan paket menu hemat bersahabat."
        }
      ],
      dmuProfiles: [
        {
          role: "Konsumen Akhir Perseorangan",
          title: "Pengambil Keputusan Belanja Pribadi",
          primaryConcern: "Rasa produk yang konsisten lezat, kebersihan tempat, dan keramahan staf kasir.",
          buyingCriteria: "Ulasan positif Google Maps bintang 4.8+, suasana nyaman, dan kemudahan parkir."
        },
        {
          role: "Ibu Rumah Tangga / Kepala Keluarga",
          title: "Pengambil Keputusan Konsumsi Keluarga",
          primaryConcern: "Higienitas bahan makanan/produk, sertifikasi halal resmi, dan keamanan bagi anak-anak.",
          buyingCriteria: "Sertifikasi halal BPJPH, kebersihan area penyiapan, dan harga paket keluarga yang wajar."
        },
        {
          role: "Koordinator Kegiatan Kantor / Komunitas",
          title: "Penanggung Jawab Pesanan Acara Bersama",
          primaryConcern: "Ketepatan waktu penyiapan pesanan jumlah banyak dan kerapian kemasan bawa pulang.",
          buyingCriteria: "Kesiapan menangani order 20-50 porsi tepat waktu dan kemasan rapi tidak mudah tumpah."
        }
      ],
      contractTerms: [
        {
          parameter: "Model Transaksi Kasir",
          standardTerm: "Sistem Transaksi Langsung (Point of Sale)",
          strategicNote: "Penerimaan pembayaran instan non-tunai via QRIS Bank Indonesia dan tunai rapi."
        },
        {
          parameter: "Paket Pemesanan Khusus Acara",
          standardTerm: "Uang Muka (DP) 50% & Pelunasan Saat Pengambilan",
          strategicNote: "Melindungi arus kas dari risiko pembatalan pesanan porsi besar."
        },
        {
          parameter: "Program Retensi Loyalitas",
          standardTerm: "Digital Loyalty Card (8 Kunjungan = 1 Produk Gratis)",
          strategicNote: "Meningkatkan frekuensi kunjungan berulang hingga 76% dalam 30 hari."
        }
      ],
      valuePropositions: [
        {
          headline: "Kualitas Rasa Otentik & Higiene Bersertifikat Halal",
          description: "Produk diolah dari bahan-bahan segar pilihan dengan standar kebersihan tinggi dan proses terjamin halal.",
          advantageVsCompetitor: "Jauh lebih bersih dan terpercaya dibandingkan pedagang kaki lima tanpa standarisasi."
        },
        {
          headline: "Pelayanan Ramah, Cepat, dan Suasana Nyaman Ber-Wifi",
          description: "Layanan kasir sigap di bawah 90 detik, fasilitas pendingin udara, dan internet gratis yang stabil.",
          advantageVsCompetitor: "Memberikan pengalaman singgah yang menyenangkan dan membuat pelanggan ingin kembali."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 4. Default / Tailored to Any Generic Title
  const sector = `Akun Industri & Pelaku Usaha Sektor ${cleanCore}`;

  const narrative = `# KAJIAN KONSUMEN POTENSIAL: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Fokus Akun:** Perusahaan Korporat B2B, Manufaktur, & Distributor Utama

---

## 1. PEMETAAN AKUN KORPORAT UTAMA (TIER-1 TARGET ACCOUNTS)
Analisis konsumen potensial pada proyek **"${pName}"** difokuskan pada akun korporat berskala nasional dan regional yang membutuhkan kepastian pengangkutan terjadwal:
- **Perusahaan Manufaktur & Produsen Utama:** Pelaku industri yang membutuhkan kontinuitas pasokan bahan baku atau pengiriman barang jadi dengan standar SLA tinggi.
- **Distributor Regional & Trader:** Entitas perdagangan yang mengandalkan keandalan transportasi darat untuk menjaga ketersediaan barang di jaringan ritel.
- **Kawasan Industri & Pusat Pergudangan:** Pengelola fasilitas logistik yang membutuhkan mitra transportasi terpercaya untuk rute koridor utama.

---

## 2. PROFIL DECISION-MAKING UNIT (DMU)
- **Supply Chain Director / Head of Logistics:** Menilai kapabilitas jaringan, integrasi telematika, dan keandalan operasional secara menyeluruh.
- **Procurement Manager:** Menegosiasikan struktur biaya kompetitif, syarat pembayaran (TOP), dan jaminan tingkat layanan.
- **Fleet & Warehouse Supervisor:** Memastikan kelancaran proses muat-bongkar di gudang dan respon cepat pengemudi.

---

## 3. STRUKTUR KONTRAK & PENAWARAN
- **Tenor Kontrak:** 1 - 3 Tahun dengan opsi evaluasi performa tahunan.
- **Tarif Komersial:** Tarif transparan berbasis rute atau tonase dengan kepastian jaminan armada terdedikasi.
- **SLA Operasional:** Jaminan ketepatan waktu pengiriman > 98.5% dan perlindungan asuransi muatan penuh.

---

## 4. PROPOSISI NILAI PEMBEDA
- **Visibilitas Pelacakan Real-Time:** Akses langsung ke portal pemantauan status muatan secara digital.
- **Standardisasi Keselamatan Tinggi:** Pengemudi bersertifikat dan unit armada yang menjalani perawatan berkala ketat.`;

  return {
    title: pName,
    division: divName,
    sectorName: sector,
    targetAccounts: [
      {
        companyName: `Pelaku Industri Utama Sektor ${cleanCore}`,
        category: "Tier-1 Principal & Manufaktur",
        location: "Kawasan Industri Nasional",
        demandVolume: "Volume Terjadwal Berkala",
        specificNeed: `Layanan transportasi handal untuk komoditas proyek ${cleanCore} dengan jaminan ketersediaan armada.`
      },
      {
        companyName: `Distributor & Trader Regional ${cleanCore}`,
        category: "Tier-1 Rantai Pasok Regional",
        location: "Pusat Distribusi Koridor Utama",
        demandVolume: "Pengiriman Rutin Harian / Mingguan",
        specificNeed: "SLA ketepatan waktu tinggi dan integrasi dokumen surat jalan digital (e-POD)."
      },
      {
        companyName: `Mitra Pengelola Pergudangan & Logistik`,
        category: "Mitra Operasional B2B",
        location: "Simpul Logistik Strategis",
        demandVolume: "Ritase Kontrak Jangka Panjang",
        specificNeed: "Standar keselamatan K3 ketat dan sistem komunikasi responsif 24/7."
      }
    ],
    dmuProfiles: [
      {
        role: "Supply Chain & Procurement Director",
        title: "Direktur Rantai Pasok & Pengadaan",
        primaryConcern: "Stabilitas biaya logistik, mitigasi risiko keterlambatan rantai pasok, dan kepatuhan regulasi.",
        buyingCriteria: "Tarif kompetitif, kredibilitas perusahaan, dan komitmen SLA jangka panjang."
      },
      {
        role: "Logistics Operations Manager",
        title: "Manajer Operasional Logistik",
        primaryConcern: "Ketepatan waktu tiba armada di loading dock dan kemudahan koordinasi harian.",
        buyingCriteria: "Akurasi pelacakan GPS, kepatuhan pengemudi terhadap SOP gudang, dan kecepatan respons tim dispatch."
      },
      {
        role: "Quality & Safety Lead",
        title: "Penanggung Jawab Mutu & K3",
        primaryConcern: "Kelaikan fisik armada dan perlindungan keselamatan muatan barang selama perjalanan.",
        buyingCriteria: "Kelayakan uji KIR berkala, kelengkapan APD pengemudi, dan asuransi muatan komprehensif."
      }
    ],
    contractTerms: [
      {
        parameter: "Durasi Tenor Kontrak",
        standardTerm: "12 - 36 Bulan (Evaluasi SLA Tahunan)",
        strategicNote: "Menjaga kontinuitas kerjasama komersial dengan fleksibilitas tinjauan performa berkala."
      },
      {
        parameter: "Struktur Tarif",
        standardTerm: "Tarif Ritase / Tonase dengan Formula BBM Transparan",
        strategicNote: "Keseimbangan antara kepastian anggaran bagi klien dan perlindungan margin penyedia jasa."
      },
      {
        parameter: "Term of Payment (TOP)",
        standardTerm: "30 - 60 Hari Kalender",
        strategicNote: "Sesuai dengan praktek tata kelola arus kas korporat B2B modern."
      }
    ],
    valuePropositions: [
      {
        headline: "Visibilitas Rantai Pasok Real-Time Melalui PRAMA Dashboard",
        description: "Akses pemantauan armada, data status pengiriman, dan estimasi waktu tiba secara transparan 24/7.",
        advantageVsCompetitor: "Menghilangkan kendala komunikasi manual yang sering terjadi pada operator konvensional."
      },
      {
        headline: "Komitmen Keselamatan dan Kepatuhan Regulasi Penuh",
        description: "Armada berizin resmi dan terawat yang mematuhi batas muatan dan aturan lalu lintas.",
        advantageVsCompetitor: "Memberikan rasa tenang bagi manajemen klien terhadap potensi risiko hukum dan insiden jalan raya."
      }
    ],
    narrativeMarkdown: narrative
  };
}
