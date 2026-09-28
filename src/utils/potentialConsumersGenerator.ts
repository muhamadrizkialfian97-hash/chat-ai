/**
 * Potential Consumers Generator (Pilar 16 / Slide 06: Customer Potential)
 * Dynamically synthesizes title-tailored Tier-1 Corporate Target Accounts,
 * Customer Segments Table, Decision-Making Unit (DMU) Mapping, Commercial Contract Terms,
 * and Purchasing Decision Pattern Insights.
 */

import { detectProjectArchetype } from "./archetypeDetector";

export interface CustomerSegmentRow {
  segment: string;
  publicExamples: string;
  primaryNeed: string;
  priority: string;
  priorityLevel?: "highest" | "high" | "anchor" | "medium" | "low";
}

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
  headerTitle: string;
  headerSubtitle: string;
  customerSegments: CustomerSegmentRow[];
  buyingPatternNote: string;
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

  let sector = "Logistik & Transportasi Komersial Terpadu";
  let customerSegments: CustomerSegmentRow[] = [];
  let buyingPatternNote = "";
  let targetAccounts: TargetAccount[] = [];
  let dmuProfiles: DmuMember[] = [];
  let contractTerms: ContractTerm[] = [];
  let valuePropositions: ValuePropItem[] = [];

  // 1. WIND ENERGY / PLTB / RENEWABLE LOGISTICS & TCI
  if (lower.includes("wind") || lower.includes("pltb") || lower.includes("angin") || lower.includes("turbin") || lower.includes("tci") || lower.includes("renewable")) {
    sector = "Wind Project Logistics & TCI (Transport, Crane & Installation)";
    
    customerSegments = [
      {
        segment: "IPP / pemilik PLTB",
        publicExamples: "Barito Renewables (pemilik Sidrap) [21]; Vena Energy (Tolo) [17]; konsorsium Total Eren-Adaro Power-PJBI (Tanah Laut) [18]; PLN Nusantara Power",
        primaryNeed: "Kepastian jadwal COD, biaya tetap, HSSE, asuransi",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "OEM turbin",
        publicExamples: "Goldwind, Envision, Windey, Mingyang (eksportir utama) [3]; Vestas, Siemens Gamesa",
        primaryNeed: 'Mitra lokal "port-to-site" yang terkualifikasi; DAP/DDP delivery',
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "EPC / BoP contractor",
        publicExamples: "EPC nasional & asing pemenang paket BoP (PP, WIKA, Hyundai E&C, PowerChina)",
        primaryNeed: "Heavy haul, crane, laydown, koordinasi jalan & izin jembatan",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive",
        publicExamples: "Pancaran EBT (proyek sendiri / captive fleet development)",
        primaryNeed: "Biaya kompetitif & track record operasional terpercaya",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "O&M / aftermarket",
        publicExamples: "Operator PLTB (mis. unit O&M; Sidrap yang ikut diakuisisi [21], OEM service division)",
        primaryNeed: "Penggantian komponen besar (blade, gearbox, generator), crane on-call",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent energy",
        publicExamples: "Pengembang PLTS/BESS, transmisi tegangan tinggi, smelter nikel",
        primaryNeed: "Transformer daya, modul inverter, kargo berat industri",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: keputusan logistik proyek angin umumnya dibuat pada dua titik — (1) saat OEM menyusun TSA (incoterm CIF/DAP ke pelabuhan atau DDP ke site), dan (2) saat IPP/EPC menender paket "port-to-site & installation". Karena itu Go-to-Market harus bermain di kedua titik secara bersamaan (lihat Bab 12).`;
  }

  // 2. SEMEN / BULK CEMENT / CLINKER
  else if (lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("klinker")) {
    sector = "Logistik Semen Curah & Distribusi Klinker Silo";

    customerSegments = [
      {
        segment: "Produsen Semen Tier-1 (Holding)",
        publicExamples: "PT Semen Indonesia (Persero) Tbk (SIG), PT Indocement Tunggal Prakarsa Tbk, PT Solusi Bangun Indonesia Tbk",
        primaryNeed: "Ketersediaan armada kapsul skala besar, kepatuhan Zero ODOL, kepastian kuota volume bulanan",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Batching Plant Ready-Mix",
        publicExamples: "PT SCG Ready-Mix Indonesia, PT Pionirbeton Industri, PT Merak Jaya Beton, PT Varia Usaha Beton",
        primaryNeed: "Ketepatan jadwal pengisian silo, unloader blower cepat (< 45 menit), pencegahan kontaminasi kargo",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Kontraktor Precast & BUMN Karya",
        publicExamples: "PT WIKA Beton Tbk, PT Waskita Beton Precast Tbk, PT Adhi Persada Beton",
        primaryNeed: "Pasokan semen curah stabil untuk lini produksi tiang pancang, girder, dan box culvert",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Dedicated Route",
        publicExamples: "Proyek koridor jalur utama pabrik ke batching plant mitra strategis",
        primaryNeed: "Efisiensi ritase balik, tarif IDR/ton terindeksasi transparan, monitoring e-POD",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Distributor Semen Kantong & Curah",
        publicExamples: "Jaringan distributor semen regional & depo semen antarpulau",
        primaryNeed: "Tarif kompetitif per ritase, surat jalan digital, kompensasi susut muatan",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Material Konstruksi",
        publicExamples: "Pemasok fly ash PLTU, abu batu kapur (limestone), pasir silika industri",
        primaryNeed: "Armada trailer tangki serbaguna pemanfaatan ritase balik",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: produsen semen dan batching plant mengevaluasi kontrak logistik berbasis kuota volume tahunan terikat (LTSA 2-3 tahun) dengan audit ketat kelayakan bejana tangki unloader, kebersihan kompresor, dan integrasi digital kartu timbang WIM.`;
  }

  // 3. NIKEL / NICKEL ORE / SMELTER / TAMBANG
  else if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter") || lower.includes("laterit")) {
    sector = "Hauling Bijih Nikel Laterit & Smelter Supply Chain";

    customerSegments = [
      {
        segment: "Pemilik Smelter RKEF & HPAL",
        publicExamples: "PT Vale Indonesia Tbk, PT Huadi Nickel-Alloy, PT Virtue Dragon Nickel Industry (VDNI), Harita Nickel",
        primaryNeed: "Kontinuitas pasokan bijih kadar stabil, kepatuhan K3 pertambangan (SMKP), integrasi sistem SIMBARA",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Pemegang IUP Tambang Nikel",
        publicExamples: "PT Aneka Tambang Tbk (Antam), PT Bintangdelapan Mineral, PT Ceria Nugraha Indotama",
        primaryNeed: "Kapasitas hauling pit-to-jetty besar, ketersediaan dump truck > 90%, supir berlisensi SIMPER",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Kontraktor Pertambangan Utama (Mining Contractors)",
        publicExamples: "PT Pamapersada Nusantara, PT Bukit Makmur Mandiri Utama (BUMA), PT Macmahon Mining",
        primaryNeed: "Subkontraktor hauling berpengalaman dengan telematika Driver Safety System (DSS)",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Hauling Concession",
        publicExamples: "Konsesi rute jalan tambang khusus milik konsorsium proyek",
        primaryNeed: "Tarif berkeadilan terindeks harga solar, bengkel lapangan bergerak di front pit",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Operator Dermaga Jetty & Tongkang",
        publicExamples: "Pengelola terminal muat tongkang sungai & pelabuhan khusus smelter",
        primaryNeed: "Kecepatan dumping di hopper jetty, waktu siklus antrean < 15 menit per unit",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Mining Logistics",
        publicExamples: "Pengangkutan batu kapur limestone, asam sulfat HPAL, solar industri BBM HSD genset",
        primaryNeed: "Armada multi-fungsi pengangkutan kargo logistik pendukung tambang",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: kontrak hauling nikel diterbitkan melalui tender tahunan multi-year dengan persyaratan rasio unit cadangan (buffer fleet 10%), sertifikasi K3 ESDM, dan transparansi timbangan elektronik jembatan timbang jetty.`;
  }

  // 4. BATUBARA / COAL HAULING
  else if (lower.includes("batubara") || lower.includes("coal") || lower.includes("hauling batubara")) {
    sector = "Coal Hauling & Mine-to-Port Inland Transport";

    customerSegments = [
      {
        segment: "Pemegang PKP2B & IUP Batubara",
        publicExamples: "PT Adaro Energy Indonesia Tbk, PT Bukit Asam Tbk, PT Kaltim Prima Coal (KPC), PT Bayan Resources Tbk",
        primaryNeed: "Kepatuhan kuota pengangkutan bulanan, kepatuhan batas kecepatan jalan tambang, Zero Lost Time Injury",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Kontraktor Tambang Batubara",
        publicExamples: "PT Pamapersada Nusantara, PT Saptaindra Sejati (SIS), PT Petrosea Tbk",
        primaryNeed: "Armada dump truck / double trailer kapasitas 40-60 ton dengan tingkat kesiapan mekanik tinggi",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Pemasok Batubara DMO PLTU",
        publicExamples: "Trader batubara pemasok konsorsium PLTU PLN Nusantara Power & Indonesia Power",
        primaryNeed: "Keandalan jadwal pengiriman tongkang dermaga muat secara konsisten",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Dedicated Corridor",
        publicExamples: "Jalur hauling khusus tambang milik mitra konsorsium",
        primaryNeed: "Kontrak Take-or-Pay 3 tahun dengan garansi volume minimum terikat",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Operator Terminal Tongkang & Jetty",
        publicExamples: "Pengelola coal terminal, stockpile conveyor, dan crushing plant",
        primaryNeed: "Pencegahan tumpahan kargo dan efisiensi waktu antrean hopper",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Heavy Haulage",
        publicExamples: "Pengangkutan bahan peledak (explosives), solar industri, dan suku cadang alat berat",
        primaryNeed: "Utilisasi armada penunjang di luar jalur tambang utama",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: keputusan pengadaan jasa hauling batubara disahkan oleh Divisi Supply Chain tambang melalui verifikasi rekam jejak kepatuhan K3, audit armada dump truck, dan kesiapan tim mekanik standby di pit.`;
  }

  // 5. CPO / PALM OIL / AGRIBISNIS
  else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
    sector = "Crude Palm Oil (CPO) Tanker & Agro Bulk Supply Chain";

    customerSegments = [
      {
        segment: "Perusahaan Perkebunan Sawit Terintegrasi",
        publicExamples: "PT Sinar Mas Agro Resources and Technology Tbk, PT Astra Agro Lestari Tbk, PT Salim Ivomas Pratama Tbk",
        primaryNeed: "Tangki food grade SUS 304 berinsulasi steam coil, toleransi susut volume < 0.08%, segel digital e-Seal",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Pabrik Kelapa Sawit (PKS) Swasta & BUMN",
        publicExamples: "PTPN Group, PKS Mandiri Riau & Sumatera Utara, PKS Kalimantan Tengah",
        primaryNeed: "Ketepatan waktu penjemputan tangki agar storage tank PKS tidak meluber (overflow)",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Pabrik Refinery & Produsen Biodiesel (B35/B40)",
        publicExamples: "Wilmar International, PT Musim Mas, PT Permata Hijau Group, PT Kencana Graha Optima",
        primaryNeed: "Kadar Free Fatty Acid (FFA) terjaga, tangki bebas kontaminasi kotoran, e-DO real-time",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Bulking Station",
        publicExamples: "Jalur pasokan tangki timbun pelabuhan ekspor mitra konsorsium",
        primaryNeed: "Jaminan ketersediaan 35 unit tangki berinsulasi terdedikasi",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Trader Komoditas Agro",
        publicExamples: "Eksportir minyak sawit mentah & produk turunan oleokimia",
        primaryNeed: "Tarif kompetitif IDR per ton-km dan fleksibilitas jadwal kapal sandar",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Agro By-Products",
        publicExamples: "Pengangkut Palm Kernel Oil (PKO), limbah cair POME biogas, pupuk NPK perkebunan",
        primaryNeed: "Pemanfaatan armada angkut agro sekunder untuk utilisasi maksimal",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: kontrak angkutan CPO mengutamakan audit kebersihan tangki, sertifikasi ISPO/RSPO transporter, dan klausul tanggung jawab ganti rugi jika terjadi kenaikan kadar FFA selama perjalanan.`;
  }

  // 6. DAIRY / SUSU / MAKANAN MINUMAN
  else if (lower.includes("susu") || lower.includes("dairy") || lower.includes("lembang") || lower.includes("milk") || lower.includes("minuman") || lower.includes("amdk")) {
    sector = "Industri Pengolahan Susu (IPS) & Rantai Dingin Pangan Segar";

    customerSegments = [
      {
        segment: "Industri Pengolahan Susu (IPS) Tier-1",
        publicExamples: "PT Ultrajaya Milk Industry Tbk, PT Frisian Flag Indonesia, PT Indolakto (Indofood Group)",
        primaryNeed: "Tangki steril food-grade SUS 316, suhu stabil 2°C-4°C, sertifikasi audit BPOM & Halal",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Koperasi Peternak & Agregasi",
        publicExamples: "KPSBU Lembang, KUD Peternak Sapi Perah Jawa Barat/Timur",
        primaryNeed: "Ketepatan jadwal penjemputan pagi & sore di cooling center, transparansi timbangan susu",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Brand Dairy Premium & Yogurt",
        publicExamples: "PT Cisarua Mountain Dairy Tbk (Cimory), Greenfields Dairy Indonesia, PT Diamond Cold Storage",
        primaryNeed: "Chiller tangki agitator anti-pemisahan lemak, pelacakan suhu via IoT 24/7",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Dedicated Line",
        publicExamples: "Rute khusus Lembang ke pabrik pengolahan di Padalarang dan Ciracas",
        primaryNeed: "Kontrak multi-tahun terikat dengan rasio armada cadangan 1:5",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Layanan Pembersihan CIP & Sanitasi",
        publicExamples: "Unit sanitasi berkala bejana tangki otomatis",
        primaryNeed: "Sertifikasi uji swab bakteriologis tangki steril berkala",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Cold Chain Logistics",
        publicExamples: "Pengiriman konsentrat buah, jus segar, butter cair, dan es krim komersial",
        primaryNeed: "Armada pendingin multi-temperatur untuk optimalisasi kapasitas balik",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: evaluasi pengadaan IPS mewajibkan audit sistem sanitasi CIP otomatis, sertifikasi Cara Distribusi Pangan Olahan yang Baik (CDPOB), serta integrasi data log suhu telemetri ke server pabrik.`;
  }

  // 7. ARCHETYPE: MANUFACTURING & FACTORY
  else if (detectProjectArchetype(pName) === "manufacturing") {
    sector = `Industri Manufaktur & Pasokan Produk ${pName.replace(/kajian|analisis|proyek|pabrik|manufaktur/gi, "").trim() || "Komersial"}`;

    customerSegments = [
      {
        segment: "Distributor Utama (Tier-1 National Wholesalers)",
        publicExamples: "Jaringan distributor resmi nasional, trading house korporat, agen distribusi provinsi",
        primaryNeed: "Stabilitas kuota pasokan bulanan, jaminan mutu standar ISO 9001, margin distributor kompetitif",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Perusahaan Pemilik Brand Swasta (Klien Maklon OEM)",
        publicExamples: "Brand owner swasta yang memerlukan kapasitas perakitan/manufaktur terpasang",
        primaryNeed: "Kerahasiaan formulasi, fleksibilitas batch produksi, sertifikasi mutu & kemasan higienis",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Jaringan Ritel Modern & Toko Grosir Besar",
        publicExamples: "Ritel rantai modern, supermarket/hypermarket, jaringan toko bahan/peralatan",
        primaryNeed: "Ketepatan jadwal pengiriman (OTIF > 98%), barcode terstandar, termin pembayaran terprediksi",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Distribution Channel",
        publicExamples: "Lini pasokan produk internal ke jaringan cabang resmi pabrik",
        primaryNeed: "Efisiensi biaya pokok produksi (COGS) dan perputaran persediaan cepat",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Pasar Proyek & Korporasi Langsung (B2B Project Direct)",
        publicExamples: "Kontraktor proyek, pengelola gedung, pengadaan instansi swasta & pemerintah",
        primaryNeed: "Sertifikasi TKDN, garansi produk resmi, faktur pajak terintegrasi",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Industry Demand",
        publicExamples: "Permintaan produk turunan, komponen pelengkap, dan ekspor pasar regional",
        primaryNeed: "Kustomisasi spesifikasi produk dan efisiensi logistik kontainer",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: distributor dan brand owner OEM menerbitkan Purchase Order (PO) berkala dengan evaluasi kuartalan berbasis ketepatan delivery, konsistensi toleransi mutu produk, dan ketersediaan stok buffer di gudang.`;
  }

  // 8. ARCHETYPE: PERSONAL BUSINESS & SME
  else if (detectProjectArchetype(pName) === "personal_sme") {
    sector = `Usaha Komersial Mandiri & Gerai ${pName.replace(/kajian|analisis|proyek|usaha|gerai/gi, "").trim() || "Layanan Konsumen"}`;

    customerSegments = [
      {
        segment: "Konsumen Retail Harian (Walk-In Customers)",
        publicExamples: "Penduduk sekitar, pekerja kantor, pelajar & keluarga dalam radius 3–5 KM",
        primaryNeed: "Kemudahan akses lokasi, pelayanan ramah & cepat (< 5 menit), harga terjangkau, kebersihan gerai",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Pelanggan Loyal Komunitas & Kantor (Loyal Members)",
        publicExamples: "Grup karyawan kantor sekitar, komunitas hobi, pelanggan tetap mingguan",
        primaryNeed: "Program loyalty rewards, promo bundling hemat, ketersediaan menu/layanan favorit",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Pemesanan Online & Pesan Antar (Delivery Customers)",
        publicExamples: "Pengguna aplikasi pemesanan online (GoFood, GrabFood, WhatsApp Business)",
        primaryNeed: "Pengemasan rapi dan higienis, respon chat cepat, promosi ongkir hemat",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Neighborhood Base",
        publicExamples: "Penghuni komplek perumahan dan ruko di sekitar titik lokasi usaha",
        primaryNeed: "Konsistensi jam buka setiap hari dan ketersediaan metode pembayaran QRIS",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Pesanan Paket Khusus & Event Katering",
        publicExamples: "Acara arisan, rapat kantor, perayaan ulang tahun, gathering keluarga",
        primaryNeed: "Ketepatan waktu penyediaan paket, diskon pesanan dalam jumlah besar",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Merchandising & Produk Pelengkap",
        publicExamples: "Penjualan produk pelengkap kemasan, souvenir, merchandise gerai",
        primaryNeed: "Kemasan menarik bernilai estetika dan kualitas terjamin",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: pelanggan retail mandiri dipengaruhi oleh kenyamanan tempat, ulasan bintang 4.8+ di Google Maps/media sosial, kemudahan bayar nontunai QRIS, dan pelayanan personal yang ramah.`;
  }

  // 9. GENERAL COMMERCIAL LOGISTICS
  else {
    sector = `Logistik & Transportasi Kargo Komersial ${pName.replace(/kajian|analisis|proyek/gi, "").trim() || "Koridor Terkait"}`;

    customerSegments = [
      {
        segment: "Klien Korporat FMCG & Manufaktur",
        publicExamples: "Produsen barang konsumsi nasional, pabrik perakitan elektronik, industri material",
        primaryNeed: "Keandalan On-Time Delivery (SLA > 98.5%), surat jalan digital (e-POD), armada bebas ODOL",
        priority: "Sangat tinggi",
        priorityLevel: "highest"
      },
      {
        segment: "Penyedia Jasa Logistik Pihak Ketiga (3PL & Forwarder)",
        publicExamples: "Perusahaan ekspedisi nasional & freight forwarder terkemuka",
        primaryNeed: "Mitra trucking terpercaya, transparansi GPS tracking real-time, fleksibilitas kapasitas armada",
        priority: "Sangat tinggi (kanal volume)",
        priorityLevel: "highest"
      },
      {
        segment: "Distributor & Pusat Distribusi Regional",
        publicExamples: "Pusat pergudangan e-commerce, hub logistik kawasan industri",
        primaryNeed: "Jaminan ketersediaan unit tepat waktu, respons cepat pengemudi, asuransi kargo",
        priority: "Tinggi",
        priorityLevel: "high"
      },
      {
        segment: "Captive Dedicated Fleet Route",
        publicExamples: "Koridor logistik utama rute antarkota mitra konsorsium",
        primaryNeed: "Kontrak sewa unit bulanan terdedikasi dengan pemeliharaan rutin terjamin",
        priority: "Anchor (tahun 1–3)",
        priorityLevel: "anchor"
      },
      {
        segment: "Pelanggan Proyek Khusus & Spot Chartered",
        publicExamples: "Pengiriman muatan proyek infrastruktur berkala & kargo musiman",
        primaryNeed: "Tarif per trip kompetitif dan ketersediaan armada dalam waktu cepat",
        priority: "Menengah (recurring)",
        priorityLevel: "medium"
      },
      {
        segment: "Adjacent Return-Trip Cargo",
        publicExamples: "Kargo ritase balik dari pabrik pengolahan di kota tujuan",
        primaryNeed: "Tarif hemat muatan balik untuk optimalisasi utilisasi armada 90%+",
        priority: "Tinggi (utilisasi)",
        priorityLevel: "high"
      }
    ];

    buyingPatternNote = `Pola pembelian: pengadaan jasa logistik korporasi diputuskan melalui proses tender tahunan oleh Divisi Supply Chain dengan seleksi ketat pada skor kepatuhan HSSE, teknologi pelacakan terpadu, dan stabilitas keuangan transporter.`;
  }

  // Populate default target accounts for backward compatibility
  targetAccounts = customerSegments.map((cs, idx) => ({
    companyName: cs.publicExamples.split(";")[0] || cs.publicExamples.split(",")[0] || cs.segment,
    category: cs.segment,
    location: "Indonesia",
    demandVolume: "Volume Tinggi Terikat",
    specificNeed: cs.primaryNeed
  }));

  dmuProfiles = [
    {
      role: "Head of Procurement & Supply Chain",
      title: "Direktur Pengadaan & Logistik Korporat",
      primaryConcern: "Stabilitas tarif jangka panjang, kepatuhan legalitas, kepastian kapasitas armada terdedikasi.",
      buyingCriteria: "Tarif kompetitif berindeksasi BBM, legalitas lengkap, reputasi rekam jejak operasional."
    },
    {
      role: "Head of Operations & Plant Logistics",
      title: "Manajer Operasional & Distribusi",
      primaryConcern: "Ketepatan jadwal kedatangan (OTIF ≥ 98.5%), waktu bongkar muat cepat, respons tanggap darurat.",
      buyingCriteria: "SLA ketepatan waktu tinggi, ketersediaan unit cadangan lokal, monitoring GPS Control Tower."
    },
    {
      role: "Quality Assurance & HSSE Lead",
      title: "Manajer K3, Kepatuhan & Mutu",
      primaryConcern: "Pencegahan insiden kecelakaan, kepatuhan batas beban Zero ODOL, sertifikasi K3 pengemudi.",
      buyingCriteria: "Sertifikasi K3, kelayakan teknis unit armada berkala, audit keamanan berkala."
    }
  ];

  contractTerms = [
    {
      parameter: "Durasi Tenor Kontrak (Tenure)",
      standardTerm: "24 - 36 Bulan (LTSA Terikat)",
      strategicNote: "Memberikan kepastian arus kas dan pengembalian modal investasi armada."
    },
    {
      parameter: "Struktur Tarif & Eskalasi",
      standardTerm: "Tarif IDR per Ton / Ritase / KM Terindeks BBM",
      strategicNote: "Klausul penyesuaian otomatis terhadap fluktuasi harga solar industri Pertamina."
    },
    {
      parameter: "Term of Payment (TOP)",
      standardTerm: "30 - 45 Hari Kalender",
      strategicNote: "Standar industri korporat didukung fasilitas supply chain financing."
    }
  ];

  valuePropositions = [
    {
      headline: "Keandalan Operasional & Tingkat Ketersediaan Tinggi (> 95%)",
      description: "Didukung tim mekanik standby, bengkel bergerak, dan buffer armada cadangan siap jalan.",
      advantageVsCompetitor: "Kompetitor kerap mengalami keterlambatan parah saat terjadi kerusakan unit di jalan."
    },
    {
      headline: "Transparansi Penuh via Live IoT Telematics & e-POD",
      description: "Klien dapat memantau posisi unit, status pengiriman, dan surat jalan digital secara transparan.",
      advantageVsCompetitor: "Mengeliminasi sengketa waktu tiba dan mempercepat proses penagihan faktur."
    }
  ];

  // Construct Markdown Narrative
  const narrativeMarkdown = `### 06 Customer Potential
**Pemetaan Segmen Pelanggan, Kebutuhan Utama & Prioritas Komersial**
**Sektor:** ${sector}

#### 1. Matriks Segmen Pelanggan Potensial (Customer Potential Matrix)
${customerSegments.map((cs, i) => `${i + 1}. **${cs.segment}**
   - **Contoh (Publik):** ${cs.publicExamples}
   - **Kebutuhan Utama:** ${cs.primaryNeed}
   - **Prioritas:** ${cs.priority}`).join("\n\n")}

#### 2. Wawasan Pola Pembelian (Purchasing Decision Insights)
${buyingPatternNote}

#### 3. Profil Decision-Making Unit (DMU) & Kriteria Pengadaan
- **Head of Procurement:** Fokus pada efisiensi biaya, struktur kontrak jangka panjang, dan legalitas.
- **Operations & Logistics Head:** Menuntut keandalan On-Time Delivery (OTIF > 98.5%) dan respons darurat < 2 jam.
- **Quality & HSSE Lead:** Memastikan standar K3, sertifikasi unit, dan kepatuhan regulasi keselamatan.`;

  return {
    title: pName,
    division: divName,
    sectorName: sector,
    headerTitle: "06 Customer Potential",
    headerSubtitle: `Pemetaan segmen pelanggan & target akun pada proyek ${pName}`,
    customerSegments,
    buyingPatternNote,
    targetAccounts,
    dmuProfiles,
    contractTerms,
    valuePropositions,
    narrativeMarkdown
  };
}
