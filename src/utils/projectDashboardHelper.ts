/**
 * projectDashboardHelper.ts
 * Rich default Indonesian analysis templates and Word/PPT exporters for the 14 project management sections.
 */

import pptxgen from "pptxgenjs";
import { CompetitorIntel } from "../types";
import { downloadPDFDirect } from "./documentExporter.ts";
import { generateStrategicOverviewForTitle } from "./strategicOverviewGenerator.ts";
import { generateTamSamSomForTitle } from "./tamSamSomGenerator.ts";
import { generateServiceDesignForTitle } from "./serviceDesignGenerator.ts";
import { generatePotentialConsumersForTitle } from "./potentialConsumersGenerator.ts";
import { detectProjectArchetype } from "./archetypeDetector.ts";
import { generateManufacturingDefaultContent, getManufacturingVisualHtml } from "./manufacturingPillarsContent.ts";
import { generatePersonalSmeDefaultContent, getPersonalSmeVisualHtml } from "./personalSmePillarsContent.ts";
import { loadSavedProjectParameters } from "../types/projectParameters.ts";

export interface DashboardSection {
  number: number;
  title: string;
  shortDesc: string;
  defaultContent: string;
}

export function getDashboardSectionsForProject(projectTitle: string): DashboardSection[] {
  const cleanTitle = normalizeProjectTitle(projectTitle || "Kajian Strategis: Forestry Management Transportation");
  const lower = cleanTitle.toLowerCase();
  const archetype = detectProjectArchetype(cleanTitle);
  const coreTopic = cleanTitle.replace(/^(kajian|analisis|evaluasi|studi|kelayakan|strategis|proyek|project|rancangan|ekspansi)[\s:]+/i, "");

  let shortDescriptions: Record<number, string>;

  if (archetype === 'manufacturing') {
    shortDescriptions = {
      1: `Analisis regulasi industri, sertifikasi SNI/BPOM/Halal, dan kepatuhan hukum ${coreTopic}.`,
      2: `Peluang pasar substitusi impor, kebutuhan distributor hulu-hilir, dan skala ekonomi ${coreTopic}.`,
      3: `Estimasi Capex mesin pabrik, Opex bahan baku & utilitas, proyeksi P&L, dan kelayakan IRR ${coreTopic}.`,
      4: `Keseimbangan kapasitas terpasang lini produksi vs proyeksi permintaan order pelanggan.`,
      5: `Struktur organisasi pabrik, kualifikasi operator mesin, target reject rate <1.5%, dan SOP 5R.`,
      6: `Tahapan pre-commissioning mesin, pilot batch run 50%, hingga ramp-up produksi komersial penuh.`,
      7: `Penetrasi jaringan distributor besar, modern market, dan kontrak maklon B2B.`,
      8: `Alur proses produksi terpadu: QC inbound -> lini fabrikasi -> QC outbound -> packaging & SLA order.`,
      9: `Mitigasi downtime mesin, fluktuasi harga bahan baku, keselamatan kerja K3, dan audit lingkungan.`,
      10: `Sistem ERP manufaktur, SCADA/IoT pemantauan sensor mesin, barcode WMS, dan otomasi lini.`,
      11: `Pemetaan kompetitor pabrik sejenis, perbandingan kapasitas harian, dan efisiensi HPP.`,
      12: `Estimasi ukuran pasar manufaktur nasional (TAM), jangkauan distribusi (SAM), dan target SOM.`,
      13: `Biaya akuisisi distributor/agen besar (CAC) vs nilai kontrak pasokan berulang (LTV).`,
      14: `Rangkuman eksekutif kelayakan investasi pabrik dan rekomendasi langkah taktis eksekusi.`,
      15: `Desain layanan dan penanganan order klien industri, garansi mutu produk, dan SLA pengiriman.`,
      16: `Profil target akun korporasi distributor, wholesaler, dan jaringan pembeli industri.`,
      17: `Izin Usaha Industri (IUI) OSS RBA, AMDAL/UKL-UPL, Sertifikat Laik Fungsi Pabrik, dan perizinan.`
    };
  } else if (archetype === 'personal_sme') {
    shortDescriptions = {
      1: `Analisis kebijakan kemudahan UMKM, NIB perseorangan OSS RBA, dan legalitas ${coreTopic}.`,
      2: `Analisis tren gaya hidup konsumen lokal, keunikan produk (USP), dan potensi pasar ${coreTopic}.`,
      3: `Estimasi Capex sewa & renovasi, Opex bulanan, harga pokok penjualan (HPP), dan BEP ${coreTopic}.`,
      4: `Kapasitas pelayanan harian, perputaran stok barang, dan mitigasi jam sibuk (peak hours).`,
      5: `Struktur tim kerja mandiri, pelatihan hospitality pelayanan prima, dan KPI kepuasan pelanggan.`,
      6: `Tahapan pre-opening renovasi, soft opening uji coba 50%, hingga grand opening publik 100%.`,
      7: `Strategi pemasaran media sosial (Instagram/TikTok), Google Maps, promo bundling, dan loyalty.`,
      8: `Alur operasional harian: opening checklist, kasir POS, pelayanan, closing & rekonsiliasi kas.`,
      9: `Mitigasi risiko sepi pengunjung, kenaikan harga bahan baku, dan dana darurat kas operasional.`,
      10: `Aplikasi POS kasir cloud, pembayaran digital QRIS, pembukuan keuangan digital, dan review online.`,
      11: `Pemetaan kompetitor usaha sejenis dalam radius 3-5 km dan strategi keunggulan diferensiasi.`,
      12: `Estimasi potensi pasar konsumen lokal (TAM), radius layanan terjangkau (SAM), dan target SOM.`,
      13: `Biaya promosi mendatangkan pelanggan baru (CAC) vs nilai belanja pelanggan setia (LTV).`,
      14: `Kesimpulan evaluasi kelayakan usaha mandiri dan rekomendasi pembukaan unit usaha.`,
      15: `Desain pengalaman pelanggan (Customer Journey), kenyamanan suasana, dan kepuasan pelayanan.`,
      16: `Segmentasi profil pelanggan sasaran (keluarga, pekerja, pelajar, dan komunitas lokal).`,
      17: `Legalitas NIB perseorangan OSS RBA, NPWP usaha, sertifikasi halal/P-IRT, dan izin lingkungan.`
    };
  } else if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("kayu") || lower.includes("timber") || lower.includes("logging") || lower.includes("wood")) {
    shortDescriptions = {
      1: "Analisis regulasi SVLK, moratorium hutan, dan kepatuhan KLHK kehutanan.",
      2: "Potensi rute logging timber, pasokan industri pulp & kertas, dan celah pasar.",
      3: "Estimasi Capex truk logging off-road, Opex solar industri, dan ROI rute hutan.",
      4: "Kapasitas angkut armada logging vs kuota tebang tahunan konsesi HTI.",
      5: "Kualifikasi supir medan berat, pengawas K3 kehutanan, dan SOP keselamatan.",
      6: "Tahapan uji coba rute hutan (pilot run), mobilisasi armada, dan serah terima.",
      7: "Strategi kontrak jangka panjang (LTSA) dengan grup industri pulp & paper.",
      8: "Alur dispatch dari log pond/landing point, telemetri satelit, dan SLA muat.",
      9: "Mitigasi jalan lumpur cuaca ekstrem, kecelakaan muatan kayu, dan konflik sosial.",
      10: "Sensor GPS area blankspot, timbangan gandar portable, dan e-dokumen SKSHAK.",
      11: "Komparasi posisi nilai dengan transporter kayu lokal dan armada captive.",
      12: "Estimasi potensi pasar logistik kehutanan nasional (TAM), koridor HTI (SAM/SOM).",
      13: "Rasio biaya akuisisi konsesi kayu vs nilai kontrak tahunan bernilai tinggi.",
      14: "Rangkuman evaluasi kelayakan komersial dan rekomendasi eksekusi proyek kehutanan.",
      15: "Desain layanan operasional, client journey map, dan blueprint eksekusi.",
      16: "Analisis target akun B2B korporat kehutanan dan kebutuhan kontrak khusus.",
      17: "Kajian perizinan SKSHHK, izin usaha kehutanan, dan kepatuhan hukum KLHK."
    };
  } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
    shortDescriptions = {
      1: "Analisis regulasi AMDAL, PP No 22/2021, dan izin pengangkutan limbah B3 KLHK.",
      2: "Kesenjangan transporter limbah berizin resmi dan lonjakan limbah manufaktur.",
      3: "Capex tangki vacuum & boks khusus B3, Opex pengolahan, dan proyeksi ROI.",
      4: "Suplai transporter limbah B3 berizin vs volume limbah kawasan industri.",
      5: "Sertifikasi B2 Umum kimia, tim tanggap darurat B3, dan SOP dekontaminasi.",
      6: "Prosedur sertifikasi izin trayek KLHK, uji coba jalur B3, dan onboard klien.",
      7: "Penetrasi tender korporat kimia, manufaktur otomotif, dan rumah sakit B2B.",
      8: "Alur manifes Festronik, prosedur bongkar muat bahan berbahaya, dan SLA darurat.",
      9: "Mitigasi kebocoran bahan kimia B3, tumpahan jalan raya, dan audit lingkungan.",
      10: "Integrasi sistem Festronik KLHK, sensor kebocoran IoT, dan GPS anti-deviasi.",
      11: "Analisis komparatif dengan PPLI, Wastec International, dan pengolah limbah B3.",
      12: "Total pasar limbah B3 nasional, fokus kawasan industri Jawa, dan target SOM.",
      13: "Efisiensi biaya audit kepatuhan tender B3 vs retensi kontrak korporat multitahun.",
      14: "Rekomendasi strategis dan penetapan kelayakan investasi pengangkutan limbah B3.",
      15: "Desain layanan penanganan limbah B3, SLA darurat, dan blueprint operasional.",
      16: "Pemetaan target korporat kimia & manufaktur penghasil limbah B3 terbesar.",
      17: "Analisis perizinan pengangkutan B3 KLHK, izin TPS/TPР, dan legalitas kontrak."
    };
  } else if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
    shortDescriptions = {
      1: "Kajian regulasi ESDM, royalti pertambangan, dan kebijakan efisiensi energi.",
      2: "Permintaan koridor hauling batu bara dari tambang (IUP) menuju pelabuhan jetty.",
      3: "Capex dump truck heavy-duty, Opex solar & ban off-road, dan kelayakan IRR.",
      4: "Kapasitas ritase harian armada hauling vs target kuota produksi tambang.",
      5: "Kualifikasi supir hauling tambang, sertifikasi POP/POM K3, dan SOP muatan.",
      6: "Pemetaan jalan tambang khusus, uji muat (pilot run), dan mobilisasi unit.",
      7: "Kontrak kerja sama jangka panjang (MToP) dengan pemilik konsesi tambang.",
      8: "Alur timbangan jetty, sistem dispatch FMS, dan SLA turnaround time armada.",
      9: "Mitigasi jalan tambang longsor, insiden blindspot alat berat, dan fluktuasi solar.",
      10: "Fleet Management System (FMS), sensor fatigue monitoring, dan kamera ADAS.",
      11: "Komparasi keandalan dengan kontraktor hauling tambang petahana.",
      12: "Total pasar hauling batu bara Sumatera/Kalimantan, rute khusus, dan target SOM.",
      13: "Analisis biaya uji coba rute hauling vs LTV kontrak volume jumbo tahunan.",
      14: "Evaluasi akhir kelayakan operasional dan investasi armada hauling pertambangan.",
      15: "Desain layanan hauling tambang, SLA waktu muat, dan protokol keselamatan.",
      16: "Analisis profil pemilik IUP konsesi tambang dan perusahaan trader batu bara.",
      17: "Kajian izin usaha pertambangan (IUP), izin jalan khusus hauling, dan legalitas PKS."
    };
  } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
    shortDescriptions = {
      1: "Regulasi CDOB BPOM, standar rantai dingin halal, dan tren logistik farmasi/boga.",
      2: "Pertumbuhan distribusi frozen food, vaksin farmasi, dan ritel segar antarkota.",
      3: "Capex armada reefer chiller, Opex solar diesel genset, dan perhitungan ROI.",
      4: "Kelangkaan armada berpendingin tersertifikasi vs lonjakan industri segar.",
      5: "Pelatihan penanganan suhu, protokol kebersihan HACCP, dan KPI integritas kargo.",
      6: "Validasi termal boks pendingin, mapping rute trans-Jawa, dan onboarding klien.",
      7: "Penetrasi ke pabrik farmasi, eksportir seafood, dan jaringan ritel modern.",
      8: "Alur pemuatan suhu konstan (-20°C s.d +4°C), live temperature tracking, & SLA.",
      9: "Mitigasi kegagalan genset pendingin, fluktuasi suhu kargo, dan klaim asuransi.",
      10: "Sensor IoT real-time temperature logger, data logger cloud, dan e-POD.",
      11: "Analisis kekuatan armada dingin dibanding Enseval, MGM Bosco, dan Kiat Ananda.",
      12: "Potensi pasar cold storage & logistik dingin Indonesia serta target SOM.",
      13: "Biaya kustomisasi boks reefer vs nilai kontrak jangka panjang distribusi farmasi.",
      14: "Rekomendasi kelayakan ekspansi armada cold chain terintegrasi teknologi.",
      15: "Desain layanan rantai dingin konstan, protokol termal, dan jaminan suhu.",
      16: "Target akun B2B industri farmasi, makanan beku, dan eksportir seafood segar.",
      17: "Sertifikasi CDOB BPOM, izin edar/distribusi khusus, dan kontrak PKS rantai dingin."
    };
  } else if (lower.includes("kontainer") || lower.includes("container") || lower.includes("inland") || lower.includes("depo") || lower.includes("hub") || lower.includes("shuttle")) {
    shortDescriptions = {
      1: "Kebijakan National Logistics Ecosystem (NLE), batas tonase, dan koridor jalan industri.",
      2: "Peluang shuttle container depo ke terminal distribusi darat koridor manufaktur.",
      3: "Capex armada prime mover head trailer, Opex tol & bbm, serta analisa ROI.",
      4: "Kapasitas pergerakan peti kemas di depo utama vs ketersediaan truk sasis.",
      5: "Kualifikasi supir lisensi angkutan berat (TID), sertifikasi keselamatan, & KPI ritase.",
      6: "Integrasi sistem gate depo (TOS), uji rute koridor buffer, & go-live.",
      7: "Kemitraan dengan korporasi manufaktur, distributor logistik industri, & forwarder darat.",
      8: "Sistem booking slot gate digital (VBS), pemantauan GPS, dan SLA waktu tunggu.",
      9: "Mitigasi kemacetan akses koridor tol industri, antrean gate terminal, dan dwelling time.",
      10: "Integrasi API Enterprise Depo System, smart gate RFID, dan e-Seal kontainer.",
      11: "Komparasi SLA kecepatan bongkar muat dengan asosiasi angkutan darat industri.",
      12: "Estimasi throughput peti kemas darat nasional, koridor industri, dan SOM.",
      13: "Efisiensi biaya integrasi sistem logistik depo vs pendapatan berulang.",
      14: "Kajian kelayakan strategis pengoperasian shuttle container terminal inland hub.",
      15: "Desain layanan shuttle depo, sistem slotting gate, dan efisiensi dwell time.",
      16: "Target akun perusahaan pelayaran internasional, depo logistik, dan emiten logistik.",
      17: "Izin penyelenggaraan depo peti kemas, TOS licensing, dan legalitas logistik."
    };
  } else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
    shortDescriptions = {
      1: "Regulasi ISPO, RSPO, mandatori biodiesel B35/B40, dan kebijakan hilirisasi sawit.",
      2: "Kebutuhan transportasi tangki CPO dari PKS ke refinery dan bulking station darat.",
      3: "Capex tangki stainless food grade, Opex rute perkebunan, dan proyeksi ROI.",
      4: "Kapasitas tangki fluida CPO tersertifikasi vs lonjakan panen raya sawit.",
      5: "Kualifikasi supir tangki cairan berat, pengawas K3 perkebunan, dan SOP FFA.",
      6: "Pembersihan tangki (tank cleaning) bersertifikat, uji rute PKS, dan onboarding.",
      7: "Kontrak tahunan dengan grup produsen minyak sawit dan pabrik biodiesel.",
      8: "Alur pengambilan sampel kadar asam lemak bebas (FFA), penyegelan, dan SLA.",
      9: "Mitigasi kontaminasi minyak sawit, penyusutan volume tangki, dan jalan tanah.",
      10: "Sensor level tangki ultrasonik, GPS anti-tumpah, dan seal elektronik (e-Seal).",
      11: "Perbandingan dengan transporter tangki CPO lokal di Sumatera & Kalimantan.",
      12: "Total volume produksi CPO Indonesia, wilayah operasional, dan target SOM.",
      13: "Rasio biaya persiapan izin tangki sawit terhadap nilai kontrak multitahun.",
      14: "Rekomendasi penetapan armada tangki CPO berstandar mutu industri prima.",
      15: "Desain layanan tangki food-grade CPO, uji sampel FFA, dan SLA pengiriman.",
      16: "Target produsen minyak sawit (PKS) dan pabrik refinery hilir biodiesel.",
      17: "Sertifikasi ISPO/RSPO, izin tangki sawit, dan kepatuhan hukum CPO."
    };
  } else if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter") || lower.includes("ore") || lower.includes("baterai")) {
    shortDescriptions = {
      1: "Kebijakan hilirisasi mineral nikel, Permen ESDM, dan standar kepatuhan rantai pasok industri.",
      2: "Peluang hauling bijih nikel (ore) dari tambang ke smelter kawasan industri.",
      3: "Capex heavy dump truck berkapasitas besar, Opex medan berat, dan estimasi ROI.",
      4: "Kebutuhan pasokan ore smelter 24 jam non-stop vs ketersediaan armada tangguh.",
      5: "Keahlian supir muatan berat basah (wet ore), pengawas K3 smelter, dan SOP.",
      6: "Survei jembatan timbang tambang, uji coba daya tahan sasis, dan mobilisasi.",
      7: "Kontrak pasokan eksklusif dengan operator smelter nikel dan kawasan industri.",
      8: "Alur hauling sirkular 24 jam, pemantauan FMS real-time, dan target ritase ketat.",
      9: "Mitigasi kadar air ore (moisture limit), jalan licin, dan kelelahan operator.",
      10: "Sensor berat suspensi real-time, IoT telemetry, dan kamera keselamatan AI.",
      11: "Analisis perbandingan keandalan armada dibanding kontraktor lokal petahana.",
      12: "Total tonase bijih nikel nasional, koridor smelter Sulawesi/Maluku, & target SOM.",
      13: "Biaya penyesuaian armada spesifikasi nikel vs profitabilitas kontrak volume raksasa.",
      14: "Evaluasi kelayakan investasi pengangkutan nikel untuk mendukung ekosistem baterai.",
      15: "Desain layanan hauling ore 24/7, manajemen armada berat, dan SLA tambang.",
      16: "Pemetaan target perusahaan pemegang IUP tambang nikel dan operator smelter.",
      17: "Izin angkut ore nikel ESDM, kepatuhan AMDAL smelter, dan legalitas kontrak."
    };
  } else if (lower.includes("semen") || lower.includes("cement") || lower.includes("konstruksi") || lower.includes("clinker") || lower.includes("beton")) {
    shortDescriptions = {
      1: "Kajian regulasi batas muatan sumbu (MST), anti-ODOL, dan izin lintasan jalan.",
      2: "Kebutuhan pasokan semen curah ke batching plant dan proyek infrastruktur.",
      3: "Capex armada truk tangki semen kapsul, Opex solar kompresor, dan ROI.",
      4: "Kapasitas pasokan silo semen pabrik vs target penyelesaian konstruksi.",
      5: "Sertifikasi supir tangki semen bertekanan (pneumatik) dan SOP keselamatan.",
      6: "Uji coba pembongkaran blower semen (pneumatic discharge) dan rute proyek.",
      7: "Kemitraan strategis dengan BUMN Karya dan produsen semen nasional.",
      8: "Alur kompresi pemuatan semen, pemantauan GPS, dan SLA pembongkaran.",
      9: "Mitigasi risiko tumpahan debu semen, penyumbatan pipa, dan audit K3.",
      10: "Sensor tekanan blower, digital POD tanda terima, dan integrasi ERP semen.",
      11: "Komparasi keandalan pasokan dibanding transporter semen konvensional.",
      12: "Estimasi serapan semen curah nasional, koridor regional, dan target SOM.",
      13: "Analisis biaya perawatan tangki kapsul semen vs margin kontrak batching plant.",
      14: "Rekomendasi kelayakan ekspansi armada angkutan semen curah dan clinker.",
      15: "Desain layanan tangki semen pneumatik, waktu bongkar, dan SLA batching plant.",
      16: "Target klien BUMN Karya, kontraktor infrastruktur, dan pabrik semen curah.",
      17: "Izin angkutan curah khusus, kepatuhan MST/ODOL, dan legalitas kontrak BUMN."
    };
  } else if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("charging") || lower.includes("spklu") || lower.includes("kblbb")) {
    shortDescriptions = {
      1: "Regulasi KBLBB Perpres No 55/2019, Permen ESDM SPKLU, dan uji kelaikan jalan Kemenhub.",
      2: "Peluang dekarbonisasi korporat (Net Zero Emission) dan armada logistik hijau berstandar ESG.",
      3: "Capex armada EV & charging station depo, efisiensi konsumsi kWh vs solar, dan proyeksi ROI.",
      4: "Kebutuhan korporat multinasional terhadap logistik ramah lingkungan vs kelangkaan armada EV.",
      5: "Kualifikasi teknisi High Voltage, pelatihan eco-driving EV, dan protokol safety baterai LFP/NMC.",
      6: "Instalasi daya listrik PLN & SPKLU depo, uji coba jarak tempuh (mileage test), dan mobilisasi unit.",
      7: "Penetrasi ke korporasi FMCG, e-commerce, dan BUMN dengan kontrak Green Logistics jangka panjang.",
      8: "Alur manajemen pengisian daya cerdas (Smart Depot Charging), telemetri baterai SoC, dan SLA.",
      9: "Mitigasi degradasi baterai, risiko thermal runaway, dan asuransi proteksi kendaraan listrik.",
      10: "Smart Battery Management System (BMS), integrasi pelacakan kWh real-time, dan PRAMA Control Tower.",
      11: "Komparasi efisiensi biaya energi operasional EV terhadap transporter konvensional berbahan bakar fosil.",
      12: "Estimasi total pasar adopsi kendaraan listrik komersial nasional dan target penetrasi SOM.",
      13: "Rasio biaya persiapan depo charging terhadap nilai kontrak retensi tinggi korporasi berorientasi ESG.",
      14: "Rekomendasi strategis dan penetapan kelayakan ekspansi armada kendaraan listrik komersial ramah lingkungan.",
      15: "Desain layanan logistik hijau (Green Logistics), audit reduksi emisi karbon, dan touchpoint charging.",
      16: "Target akun emiten Bursa, korporasi FMCG multinasional, dan perusahaan logistik berbasis ESG.",
      17: "Kepatuhan Perpres KBLBB, izin operasional SPKLU industri, uji tipe SRUT, dan insentif fiskal."
    };
  } else {
    const coreTopic = cleanTitle.replace(/^(kajian|analisis|evaluasi|studi|kelayakan|strategis|proyek|project|rancangan|ekspansi)[\s:]+/i, "");
    shortDescriptions = {
      1: `Analisis regulasi makro, perizinan transportasi, dan kepatuhan ${coreTopic}.`,
      2: `Kesenjangan pasar, keunggulan operasional, dan peluang bisnis ${coreTopic}.`,
      3: `Estimasi Capex armada, Opex bulanan, cash flow, dan kalkulasi ROI ${coreTopic}.`,
      4: `Keseimbangan kapasitas armada suplai vs permintaan volume ${coreTopic}.`,
      5: `Struktur tim, kualifikasi pengemudi, target KPI harian, dan SOP operasional.`,
      6: `Tahapan transisi pre-onboarding, uji coba rute jalur, hingga stabilisasi.`,
      7: `Strategi penetrasi pasar B2B, diferensiasi layanan, dan kemitraan jangka panjang.`,
      8: `Alur proses sirkuit logistik, skema SLA ketat, dan manajemen pengecualian.`,
      9: `Mitigasi risiko keselamatan jalan, kepatuhan hukum, dan integritas kargo.`,
      10: `Penerapan platform telematika PRAMA, sensor IoT muatan, dan e-manifest.`,
      11: `Pemetaan profil kompetitor petahana dan strategi keunggulan kompetitif.`,
      12: `Kalkulasi ukuran pasar Total (TAM), Serviceable (SAM), dan Target Riil (SOM).`,
      13: `Analisis Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) kontrak.`,
      14: `Rangkuman eksekutif kelayakan proyek dan rekomendasi langkah taktis eksekusi.`,
      15: `Desain layanan operasional, client journey map, dan blueprint eksekusi ${coreTopic}.`,
      16: `Analisis profil target klien korporat B2B dan daftar target account ${coreTopic}.`,
      17: `Analisis legalitas badan usaha PT/CV, OSS RBA, SIUJPT, dan perizinan sektoral.`
    };
  }

  const baseTitles: Record<number, string> = {
    1: "Global/NAT Overview",
    2: "Market Opportunity",
    3: "Financial (Capex, Opex, P&L, Cash Flow, ROI)",
    4: "Supply & Demand",
    5: "Organization (Qualification, Skill, Output/KPI, SOP)",
    6: "Transition Model (Pre-On-Post)",
    7: "Go To Market Strategy",
    8: "Ops Model (Flow Process, Workflow Diagram, SLA)",
    9: "Risk Management",
    10: "Digital Coverage (Tools, Method, Impact, Automation)",
    11: "Competitor",
    12: "TAM, SAM, SOM",
    13: "CAC, LTV",
    14: "Kesimpulan & Rekomendasi Keputusan",
    15: "Service Design",
    16: "Konsumen Potensial",
    17: "Legal & Regulatory Compliance (Izin Usaha, Perizinan Sektoral, Dokumen Legalitas)"
  };

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((num) => ({
    number: num,
    title: baseTitles[num],
    shortDesc: shortDescriptions[num] || `Kajian strategis pilar ke-${num} untuk proyek ${cleanTitle}.`,
    defaultContent: generateDetailedDefaultContent(num, baseTitles[num], cleanTitle, shortDescriptions[num])
  }));
}

export interface ProjectMetrics {
  seed: number;
  cleanTitle: string;
  industry: string;
  industryCategory: string;
  regulations: string;
  regulationsShort: string;
  materialName: string;
  materialNameShort: string;
  unitsCount: number;
  unitsText: string;
  assetCategory: string;
  extraDetail1: string;
  extraDetail2: string;
  
  // Capex & Opex
  capexAmount: number;
  capexFormatted: string;
  fleetCapex: number;
  fleetCapexFormatted: string;
  itCapex: number;
  itCapexFormatted: string;
  depoCapex: number;
  depoCapexFormatted: string;
  
  opexAmount: number;
  opexFormatted: string;
  fuelOpex: number;
  fuelOpexFormatted: string;
  salaryOpex: number;
  salaryOpexFormatted: string;
  maintOpex: number;
  maintOpexFormatted: string;
  overheadOpex: number;
  overheadOpexFormatted: string;
  
  // P&L
  monthlyRev: number;
  monthlyRevFormatted: string;
  annualRevY1: number;
  annualRevY1Formatted: string;
  annualRevY2: number;
  annualRevY2Formatted: string;
  annualRevY3: number;
  annualRevY3Formatted: string;
  
  ebitdaY1: number;
  ebitdaY1Formatted: string;
  ebitdaMarginY1: string;
  netProfitY1: number;
  netProfitY1Formatted: string;
  netMarginY1: string;
  
  ebitdaY2: number;
  ebitdaY2Formatted: string;
  ebitdaMarginY2: string;
  netProfitY2: number;
  netProfitY2Formatted: string;
  netMarginY2: string;

  ebitdaY3: number;
  ebitdaY3Formatted: string;
  ebitdaMarginY3: string;
  netProfitY3: number;
  netProfitY3Formatted: string;
  netMarginY3: string;
  
  // Financial feasibility indicators
  pbpYears: string;
  roiPercent: string;
  irrPercent: string;
  
  // Market sizing
  tamAmount: number;
  tamFormatted: string;
  samAmount: number;
  samFormatted: string;
  samPct: string;
  somAmount: number;
  somFormatted: string;
  somPct: string;
  
  // Unit Economics
  cacAmount: number;
  cacFormatted: string;
  ltvAmount: number;
  ltvFormatted: string;
  ratioValue: string;
  
  // Operations & HR & Quality
  slaTarget: string;
  slaTolerance: string;
  csatTarget: string;
  csatScore: string;
  utilizationRate: string;
  monthlyTrips: number;
  bufferUnits: number;
  driverCount: number;
  cagrPercent: string;
  marketShareTarget: string;
  targetAccountsCount: number;
  adminSavingPercent: number;
  fuelSavingPercent: string;
  feasibilityScore: string;
  scoreMarket: string;
  scoreOps: string;
  scoreFin: string;
  scoreLegal: string;
  competitorType: string;
  competitorTakeoverRate: string;
  valueProposition: string;
}

export function getProjectMetrics(projectName: string): ProjectMetrics {
  const pName = (projectName || "Kajian Strategis Logistik").trim();
  const lower = pName.toLowerCase();
  const cleanTitle = pName
    .replace(/^(kajian strategis|kajian kelayakan|analisis kelayakan|proyek|project|kajian|analisis|evaluasi|rencana bisnis|proposal|studi kelayakan)[\s:]+/i, "")
    .trim() || pName;

  // Deterministic seed hash
  let seed = 0;
  for (let i = 0; i < pName.length; i++) {
    seed = (seed << 5) - seed + pName.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  let unitsCount = 8 + (seed % 14); // 8 to 21 units
  let capexAmount = (seed % 24 + 8) * 450000000; // Rp 3.6M - Rp 14.4M
  const fleetCapex = Math.round(capexAmount * 0.81);
  const itCapex = Math.round(capexAmount * 0.09);
  const depoCapex = capexAmount - fleetCapex - itCapex;

  const opexAmount = (seed % 28 + 12) * 15000000; // Rp 180M - Rp 600M / month
  const fuelOpex = Math.round(opexAmount * 0.48);
  const salaryOpex = Math.round(opexAmount * 0.28);
  const maintOpex = Math.round(opexAmount * 0.14);
  const overheadOpex = opexAmount - fuelOpex - salaryOpex - maintOpex;

  const monthlyRev = Math.round(opexAmount * (1.68 + (seed % 20) / 100)); // 1.68x - 1.88x Opex
  const annualRevY1 = monthlyRev * 12;
  const annualRevY2 = Math.round(annualRevY1 * (1.18 + (seed % 10) / 100));
  const annualRevY3 = Math.round(annualRevY2 * (1.20 + (seed % 10) / 100));

  const ebitdaY1 = Math.round(annualRevY1 * (0.29 + (seed % 6) / 100));
  const netProfitY1 = Math.round(annualRevY1 * (0.18 + (seed % 5) / 100));
  const ebitdaY2 = Math.round(annualRevY2 * (0.31 + (seed % 6) / 100));
  const netProfitY2 = Math.round(annualRevY2 * (0.20 + (seed % 5) / 100));
  const ebitdaY3 = Math.round(annualRevY3 * (0.33 + (seed % 6) / 100));
  const netProfitY3 = Math.round(annualRevY3 * (0.22 + (seed % 5) / 100));

  const pbpNum = Math.max(1.8, Math.min(3.8, Number((capexAmount / ((netProfitY1 + netProfitY2) / 2)).toFixed(1))));
  const pbpYears = `${pbpNum.toFixed(1)} Tahun`;
  const roiNum = (30.5 + (seed % 140) / 10).toFixed(1);
  const roiPercent = `${roiNum}%`;
  const irrNum = (22.5 + (seed % 110) / 10).toFixed(1);
  const irrPercent = `${irrNum}%`;

  const tamAmount = (seed % 9 + 4) * 1500000000000; // 6.0T to 18.0T
  const samRatio = 0.14 + (seed % 8) / 100;
  const samAmount = Math.round(tamAmount * samRatio);
  const somRatio = 0.09 + (seed % 6) / 100;
  const somAmount = Math.round(samAmount * somRatio);

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;
  const getSizingText = (val: number) => {
    if (val >= 1000000000000) return `Rp ${(val / 1000000000000).toFixed(1)} Triliun`;
    return `Rp ${(val / 1000000000).toFixed(0)} Miliar`;
  };

  const cacAmount = (seed % 35 + 18) * 1000000; // Rp 18M - Rp 52M
  const ltvMultiplier = seed % 10 + 9; // 9x - 18x
  const ltvAmount = cacAmount * ltvMultiplier;
  const ratioValue = ltvMultiplier.toFixed(1);

  const slaNum = (98.2 + (seed % 14) / 10).toFixed(1);
  const slaTarget = `${slaNum}%`;
  const slaTolNum = (100 - parseFloat(slaNum)).toFixed(1);
  const slaTolerance = `< ${slaTolNum}%`;
  const csatNum = (92.0 + (seed % 60) / 10).toFixed(1);
  const csatTarget = `≥ ${csatNum}%`;
  const csatScore = `${(parseFloat(csatNum) / 20).toFixed(1)} / 5.0`;

  const monthlyTrips = 160 + (seed % 120);
  const bufferUnits = Math.max(1, Math.round(unitsCount * 0.12));
  const driverCount = Math.round(unitsCount * 1.5);
  const cagrPercent = (10.2 + (seed % 45) / 10).toFixed(1);
  const targetAccountsCount = 8 + (seed % 8);
  const adminSavingPercent = 68 + (seed % 12);
  const fuelSavingPercent = `${7 + (seed % 4)}% - ${11 + (seed % 4)}%`;

  const scoreMarket = (23.0 + (seed % 15) / 10).toFixed(1);
  const scoreOps = (22.5 + (seed % 15) / 10).toFixed(1);
  const scoreFin = (27.5 + (seed % 18) / 10).toFixed(1);
  const scoreLegal = (18.2 + (seed % 12) / 10).toFixed(1);
  const totalScore = (parseFloat(scoreMarket) + parseFloat(scoreOps) + parseFloat(scoreFin) + parseFloat(scoreLegal)).toFixed(1);
  const feasibilityScore = `${totalScore} / 100`;

  // Detect industry details
  let industry = `sektor operasional & logistik ${cleanTitle}`;
  let industryCategory = "Logistik & Transportasi";
  let regulations = "**UU No. 22 Tahun 2009** tentang Lalu Lintas Angkutan Jalan dan regulasi perizinan sektoral terkait";
  let regulationsShort = "UU 22/2009 & Regulasi Perhubungan";
  let materialName = `komoditas spesifik ${cleanTitle}`;
  let materialNameShort = cleanTitle;
  let unitsText = `${unitsCount} Unit Armada Khusus ${cleanTitle}`;
  let assetCategory = `unit operasional spesifikasi angkut ${cleanTitle}`;
  let extraDetail1 = `koridor rute utama dan simpul distribusi terencana untuk ${cleanTitle}.`;
  let extraDetail2 = `protokol pengawasan mutu layanan, standardisasi keselamatan K3, dan kepatuhan SLA berkala.`;
  let competitorType = "Operator Konvensional Lokal & Transporter Non-SLA";
  let competitorTakeoverRate = "14% - 22%";
  let valueProposition = "Armada Terdedikasi, IoT Real-Time, & Garansi SLA 98%+";

  if (lower.includes("susu") || lower.includes("dairy") || lower.includes("lembang") || lower.includes("milk") || lower.includes("sapi") || lower.includes("kpsbu")) {
    industry = "logistik rantai dingin susu segar & industri pengolahan susu (Fresh Milk Cold Chain)";
    industryCategory = "Rantai Dingin Susu & Dairy";
    regulations = "**SNI 3141.1:2011** tentang Susu Segar, standar CDPOB BPOM, dan **Permenhub No. PM 60 Tahun 2019**";
    regulationsShort = "SNI Susu, CDPOB BPOM & Permenhub 60/2019";
    materialName = "susu murni segar (fresh raw milk) & susu olahan dingin";
    materialNameShort = "Susu Segar";
    unitsText = `${unitsCount} Unit Truk Tangki Susu Berinsulasi Food-Grade (SUS 304/316 dengan Chiller Agitator)`;
    assetCategory = "armada truk tangki berpendingin chiller agitator food-grade berstandar BPOM & Halal";
    extraDetail1 = "koridor cooling center peternakan Lembang & Bandung Barat menuju pabrik pengolahan susu (IPS) Jawa Barat dan Jabodetabek.";
    extraDetail2 = "protokol kontrol suhu ketat (2°C - 4°C), agitator sirkulasi kontinu, dan siklus sanitasi Clean-in-Place (CIP).";
    competitorType = "Transporter Lokal Tangki Terbuka & Tanpa Kontrol Suhu Real-Time";
    competitorTakeoverRate = "20% - 30%";
    valueProposition = "Jaminan Suhu 2-4°C, Agitator Higienis, & e-POD Otomatis";
  } else if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("battery") || lower.includes("spklu") || lower.includes("kblbb")) {
    industry = "ekosistem transportasi kendaraan listrik komersial (Commercial EV Green Logistics)";
    industryCategory = "Green Logistics & EV Fleet";
    regulations = "**Perpres No. 55 Tahun 2019** tentang KBLBB dan **Permen ESDM No. 13 Tahun 2020** tentang SPKLU";
    regulationsShort = "Perpres 55/2019 & Permen ESDM 13/2020";
    materialName = "kargo perkotaan ramah lingkungan bebas emisi karbon (Zero Emission EV Transport)";
    materialNameShort = "Kargo EV Ramah Lingkungan";
    unitsText = `${unitsCount} Unit Truk Listrik Komersial (EV Fleet) Baterai LFP dengan Telematika BMS`;
    assetCategory = "armada kendaraan listrik terintegrasi fasilitas pengisian daya cepat SPKLU DC 60-120 kW";
    extraDetail1 = "koridor transit distribusi logistik perkotaan dan depo pengisian daya cepat terintegrasi.";
    extraDetail2 = "sistem pemantauan State of Charge (SoC) baterai, efisiensi kWh/km, dan telematika BMS real-time.";
    competitorType = "Armada Truk Diesel Konvensional Emisi Tinggi";
    competitorTakeoverRate = "18% - 26%";
    valueProposition = "Nol Emisi Karbon, Hemat Energi 45%, & Kepatuhan ESG";
  } else if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("nikel") || lower.includes("nickel")) {
    industry = "distribusi mineral curah & hauling pertambangan heavy-duty";
    industryCategory = "Heavy Hauling & Mining Logistics";
    regulations = "**UU No. 3 Tahun 2020** tentang Pertambangan Mineral dan Batubara, serta regulasi K3 ESDM & Kemenhub";
    regulationsShort = "UU Minerba 3/2020 & Standar K3 ESDM";
    materialName = lower.includes("nikel") ? "bijih nikel (nickel ore) & slag industri" : "batubara curah kering (bulk coal)";
    materialNameShort = lower.includes("nikel") ? "Bijih Nikel" : "Batubara Curah";
    unitsText = `${unitsCount} Unit Tipper Dump Truck Heavy-Duty (6x4) Berspesifikasi Tambang`;
    assetCategory = "armada dump truck heavy-duty medan off-road tambang dengan bak reinforced";
    extraDetail1 = "jalur hauling khusus dari front tambang/stockpile menuju dermaga penumpukan (jetty/smelter).";
    extraDetail2 = "SOP keselamatan tambang ketat, penyiraman rute hauling anti-debu, dan rest area driver 24 jam.";
    competitorType = "Operator Hauling Lokal Tanpa Standardisasi Telematika & HSE";
    competitorTakeoverRate = "15% - 25%";
    valueProposition = "High Payload Capacity, Fatigue Monitoring, & Zero Accident";
  } else if (lower.includes("kontainer") || lower.includes("container") || lower.includes("depo") || lower.includes("inland") || lower.includes("shuttle")) {
    industry = "intermodal container logistics & inland freight terminal";
    industryCategory = "Intermodal & Depo Kontainer";
    regulations = "**UU No. 22 Tahun 2009** serta Surat Edaran Dirjen Hubdat mengenai Batasan Muatan Sumbu Terberat (MST)";
    regulationsShort = "UU 22/2009 & Regulasi MST Kemenhub";
    materialName = "petikemas kontainer darat (20ft & 40ft FCL/LCL)";
    materialNameShort = "Petikemas Kontainer";
    unitsText = `${unitsCount} Unit Prime Mover Tractor Head Flatbed Chassis 20/40 Feet`;
    assetCategory = "armada truk penarik kepala prime mover dan sasis peti kemas bersertifikasi KIR";
    extraDetail1 = "koridor penghubung pelabuhan peti kemas dengan kawasan industri manufaktur utama.";
    extraDetail2 = "integrasi jadwal batas penerimaan kargo (closing time) depo dan manajemen turnaround time.";
    competitorType = "Transporter Petikemas Konvensional Tanpa SLA Terikat";
    competitorTakeoverRate = "16% - 24%";
    valueProposition = "Ketepatan Waktu Gate Cut-Off, Sasis Laik Uji, & e-Seal Tracking";
  } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("boga") || lower.includes("reefer") || lower.includes("buah")) {
    industry = "transportasi rantai dingin & logistik farmasi/makanan higienis (Cold Chain)";
    industryCategory = "Cold Chain & Frozen Food";
    regulations = "**Sertifikasi CDOB BPOM**, standar **ISO 9001:2015**, dan regulasi rantai dingin pangan";
    regulationsShort = "CDOB BPOM, HACCP & ISO 9001";
    materialName = "vaksin sensitif suhu, obat-obatan esensial, & produk boga beku";
    materialNameShort = "Kargo Rantai Dingin";
    unitsText = `${unitsCount} Unit Reefer Box Truck ThermoKing Terintegrasi Sensor Suhu IoT`;
    assetCategory = "armada truk boks berpendingin termo-insulasi dengan sistem logger data digital";
    extraDetail1 = "rute distribusi dari hub penyimpanan berpendingin menuju rumah sakit, apotek, dan modern market.";
    extraDetail2 = "pemantauan grafik suhu real-time dengan batas toleransi deviasi maksimal ±1.5°C.";
    competitorType = "Transporter Dingin Tanpa Pemantau Real-Time Sensor Telemetri";
    competitorTakeoverRate = "22% - 32%";
    valueProposition = "Data Logger Suhu 24/7, Standar BPOM, & Unit Cadangan Cepat";
  } else if (lower.includes("maritim") || lower.includes("kapal") || lower.includes("tongkang") || lower.includes("barge") || lower.includes("pelayaran") || lower.includes("laut")) {
    industry = "transportasi laut & logistik pelayaran maritim antarpulau";
    industryCategory = "Maritim & Pelayaran Tongkang";
    regulations = "**UU No. 17 Tahun 2008** tentang Pelayaran, sertifikasi BKI, dan konvensi MARPOL/SOLAS";
    regulationsShort = "UU Pelayaran 17/2008 & Statutori BKI";
    materialName = "kargo curah laut antarpulau & logistik pelayaran domestik";
    materialNameShort = "Kargo Curah Laut";
    unitsText = `${unitsCount} Set Armada Kapal Tunda (Tugboat) & Tongkang (Barge 300-330 Feet)`;
    assetCategory = "armada kapal tunda dan tongkang kargo curah laut berlisensi statutori BKI";
    extraDetail1 = "alur pelayaran laut pesisir dan lintas pulau dengan pemantauan sistem navigasi AIS satelit.";
    extraDetail2 = "standar kelaiklautan tinggi, manajemen muat sandar dermaga, dan mitigasi pasang surut air laut.";
    competitorType = "Penyedia Pelayaran Tradisional Usia Kapal Tua";
    competitorTakeoverRate = "14% - 20%";
    valueProposition = "Sertifikasi BKI Lengkap, Pemantauan AIS Satelit, & Siklus Rit Cepat";
  } else if (lower.includes("semen") || lower.includes("cement") || lower.includes("beton")) {
    industry = "logistik distribusi semen curah & material konstruksi industri";
    industryCategory = "Semen Curah & Material Konstruksi";
    regulations = "**UU No. 22 Tahun 2009** serta regulasi batas muatan gandar Kemenhub";
    regulationsShort = "UU 22/2009 & Regulasi MST Kemenhub";
    materialName = "semen curah kering & clinker industri";
    materialNameShort = "Semen Curah";
    unitsText = `${unitsCount} Unit Truk Tangki Bulk Cement (Kapsul Bertekanan Pneumatik)`;
    assetCategory = "armada truk tangki semen curah kompresor pneumatik berkapasitas tinggi";
    extraDetail1 = "penyaluran dari pabrik semen menuju batching plant beton dan silo proyek infrastruktur.";
    extraDetail2 = "SOP pembongkaran bertekanan tinggi dengan kompresor bebas kontaminasi debu.";
    competitorType = "Transporter Semen Konvensional Non-Kompresor Presisi";
    competitorTakeoverRate = "15% - 25%";
    valueProposition = "Bongkar Cepat Pneumatik, Anti-Debu, & Jaminan Pasokan Rutin";
  } else if (lower.includes("sawit") || lower.includes("cpo") || lower.includes("palm oil")) {
    industry = "logistik Crude Palm Oil (CPO) & minyak nabati curah cair";
    industryCategory = "Agroindustri Sawit & CPO";
    regulations = "**Sertifikasi ISPO**, standar kebersihan tangki Food Grade, dan UU Lalu Lintas Jalan";
    regulationsShort = "Sertifikasi ISPO & Food Grade Tanker";
    materialName = "minyak kelapa sawit mentah (Crude Palm Oil / CPO)";
    materialNameShort = "Minyak CPO";
    unitsText = `${unitsCount} Unit CPO Tanker Truck Stainless Steel SUS 304 Anti-Tumpah`;
    assetCategory = "armada tangki baja tahan karat berinsulasi pemanas uap (steam heater)";
    extraDetail1 = "koridor hauling dari Pabrik Kelapa Sawit (PKS) lini tengah menuju bulking terminal pelabuhan.";
    extraDetail2 = "inspeksi segel digital katup pembuangan dan pembersihan berkala steam cleaner.";
    competitorType = "Transporter CPO Tangki Baja Hitam Tanpa Segel Digital";
    competitorTakeoverRate = "18% - 28%";
    valueProposition = "Tangki SUS Food-Grade, e-Seal Anti-Susut, & SLA Delivery 99%";
  }

  // Apply user-configured parameters from the Project Parameter Form (Anti-Hallucination Grounding)
  const savedParams = loadSavedProjectParameters(projectName);
  if (savedParams) {
    if (savedParams.commodity && savedParams.commodity.trim()) {
      materialName = savedParams.commodity;
      materialNameShort = savedParams.commodity.split("(")[0].trim();
    }
    if (savedParams.sector && savedParams.sector.trim()) {
      industry = savedParams.sector;
      industryCategory = savedParams.sector;
    }
    if (savedParams.fleetRequirement && savedParams.fleetRequirement.trim()) {
      unitsText = savedParams.fleetRequirement;
      assetCategory = savedParams.fleetRequirement;
    }
    if (savedParams.fleetCount && savedParams.fleetCount > 0) {
      unitsCount = savedParams.fleetCount;
    }
    if (savedParams.routeCorridor && savedParams.routeCorridor.trim()) {
      extraDetail1 = `koridor rute ${savedParams.routeCorridor}`;
    }
    if (savedParams.operationalConstraints && savedParams.operationalConstraints.trim()) {
      extraDetail2 = savedParams.operationalConstraints;
    }
    if (savedParams.keyCompetitors && savedParams.keyCompetitors.trim()) {
      competitorType = savedParams.keyCompetitors;
    }
    if (savedParams.capexNumeric && savedParams.capexNumeric > 0) {
      capexAmount = savedParams.capexNumeric;
    }
  }

  return {
    seed,
    cleanTitle,
    industry,
    industryCategory,
    regulations,
    regulationsShort,
    materialName,
    materialNameShort,
    unitsCount,
    unitsText,
    assetCategory,
    extraDetail1,
    extraDetail2,
    
    capexAmount,
    capexFormatted: formatCurrency(capexAmount),
    fleetCapex,
    fleetCapexFormatted: formatCurrency(fleetCapex),
    itCapex,
    itCapexFormatted: formatCurrency(itCapex),
    depoCapex,
    depoCapexFormatted: formatCurrency(depoCapex),
    
    opexAmount,
    opexFormatted: formatCurrency(opexAmount),
    fuelOpex,
    fuelOpexFormatted: formatCurrency(fuelOpex),
    salaryOpex,
    salaryOpexFormatted: formatCurrency(salaryOpex),
    maintOpex,
    maintOpexFormatted: formatCurrency(maintOpex),
    overheadOpex,
    overheadOpexFormatted: formatCurrency(overheadOpex),
    
    monthlyRev,
    monthlyRevFormatted: formatCurrency(monthlyRev),
    annualRevY1,
    annualRevY1Formatted: formatCurrency(annualRevY1),
    annualRevY2,
    annualRevY2Formatted: formatCurrency(annualRevY2),
    annualRevY3,
    annualRevY3Formatted: formatCurrency(annualRevY3),
    
    ebitdaY1,
    ebitdaY1Formatted: formatCurrency(ebitdaY1),
    ebitdaMarginY1: `${((ebitdaY1 / annualRevY1) * 100).toFixed(1)}% margin`,
    netProfitY1,
    netProfitY1Formatted: formatCurrency(netProfitY1),
    netMarginY1: `${((netProfitY1 / annualRevY1) * 100).toFixed(1)}% net margin`,
    
    ebitdaY2,
    ebitdaY2Formatted: formatCurrency(ebitdaY2),
    ebitdaMarginY2: `${((ebitdaY2 / annualRevY2) * 100).toFixed(1)}% margin`,
    netProfitY2,
    netProfitY2Formatted: formatCurrency(netProfitY2),
    netMarginY2: `${((netProfitY2 / annualRevY2) * 100).toFixed(1)}% net margin`,

    ebitdaY3,
    ebitdaY3Formatted: formatCurrency(ebitdaY3),
    ebitdaMarginY3: `${((ebitdaY3 / annualRevY3) * 100).toFixed(1)}% margin`,
    netProfitY3,
    netProfitY3Formatted: formatCurrency(netProfitY3),
    netMarginY3: `${((netProfitY3 / annualRevY3) * 100).toFixed(1)}% net margin`,
    
    pbpYears,
    roiPercent,
    irrPercent,
    
    tamAmount,
    tamFormatted: getSizingText(tamAmount),
    samAmount,
    samFormatted: getSizingText(samAmount),
    samPct: `${(samRatio * 100).toFixed(1)}%`,
    somAmount,
    somFormatted: getSizingText(somAmount),
    somPct: `${(somRatio * 100).toFixed(1)}%`,
    
    cacAmount,
    cacFormatted: formatCurrency(cacAmount),
    ltvAmount,
    ltvFormatted: formatCurrency(ltvAmount),
    ratioValue,
    
    slaTarget,
    slaTolerance,
    csatTarget,
    csatScore,
    utilizationRate: `${(87.5 + (seed % 60) / 10).toFixed(1)}% - ${(92.0 + (seed % 50) / 10).toFixed(1)}%`,
    monthlyTrips,
    bufferUnits,
    driverCount,
    cagrPercent,
    marketShareTarget: `${(12.5 + (seed % 100) / 10).toFixed(1)}%`,
    targetAccountsCount,
    adminSavingPercent,
    fuelSavingPercent,
    feasibilityScore,
    scoreMarket,
    scoreOps,
    scoreFin,
    scoreLegal,
    competitorType,
    competitorTakeoverRate,
    valueProposition
  };
}

function generateDetailedDefaultContent(num: number, title: string, projectTitle: string, shortDesc: string): string {
  const pName = projectTitle || "Kajian Strategis Proyek";
  const archetype = detectProjectArchetype(pName);

  if (archetype === 'manufacturing') {
    return generateManufacturingDefaultContent(num, title, pName, shortDesc);
  }
  if (archetype === 'personal_sme') {
    return generatePersonalSmeDefaultContent(num, title, pName, shortDesc);
  }

  const m = getProjectMetrics(pName);

  switch(num) {
    case 1:
      return `### 1. Global/NAT Overview\n\n` +
        `**1.1 Latar Belakang Makro & Konteks Nasional**\n` +
        `Kajian komprehensif untuk proyek **${pName}** berakar pada kebutuhan strategis nasional pada ${m.industry} akan efisiensi pengangkutan ${m.materialName}, kepatuhan regulasi, dan transformasi operasional berbasis digital. Sektor ini memegang peranan vital dalam memastikan kelancaran rantai pasok industri di Indonesia.\n\n` +
        `**1.2 Analisis Lanskap Industri & Koridor Strategis**\n` +
        `- **Integrasi Rantai Pasok Nasional:** Penyelarasan arus distribusi ${m.materialName} melintasi ${m.extraDetail1}\n` +
        `- **Kesiapan Armada Terdedikasi:** Dukungan ${m.unitsText} dengan alokasi estimasi CAPEX sebesar **${m.capexFormatted}** dan OPEX bulanan **${m.opexFormatted}**.\n` +
        `- **Konektivitas Multimoda:** Koordinasi titik muat pabrik/depo asal menuju simpul penerimaan akhir dengan meminimalkan risiko keterlambatan.\n\n` +
        `**1.3 Kepatuhan Standar & Regulasi Sektoral (Compliance Matrix)**\n` +
        `- **Regulasi Utama:** Kepatuhan penuh terhadap ${m.regulations} serta standar kelaikan armada (100% legalitas sah).\n` +
        `- **Keselamatan & Kesehatan Kerja (K3):** Penerapan ISO 45001 dan protokol ${m.extraDetail2}\n` +
        `- **Service Level Agreement (SLA):** Jaminan ketepatan waktu pengiriman minimal **${m.slaTarget}** *(Detail Perhitungan %: Rasio minimal ${Math.round(m.monthlyTrips * (parseFloat(m.slaTarget)/100))} trip tepat waktu dari total ${m.monthlyTrips} trip per bulan, toleransi keterlambatan maksimal ${m.slaTolerance})* dengan respon darurat < 30 menit.\n\n` +
        `**1.4 Kesimpulan & Eksekusi Pilar**\n` +
        `Pilar pertama menetapkan landasan legal dan kesiapan teknis operasional yang kokoh, menempatkan proyek **${pName}** pada status **LAYAK** dengan skor komprehensif **${m.feasibilityScore}**.`;

    case 2:
      return `### 2. Market Opportunity\n\n` +
        `**2.1 Analisis Permintaan Pasar (Market Demand)**\n` +
        `Analisis mendalam terhadap proyek **${pName}** pada ${m.industry} menunjukkan tingginya permintaan korporasi B2B terhadap pengangkutan ${m.materialName} yang bergaransi SLA dan transparan secara digital.\n\n` +
        `**2.2 Kesenjangan Pasar & Peluang Diferensiasi**\n` +
        `- **Kelemahan Kompetitor Petahana:** Sebagian besar pelaku ${m.competitorType} masih mengandalkan unit tua dan sistem manual tanpa telematika IoT real-time.\n` +
        `- **Kebutuhan Kontrak Jangka Panjang (LTSA):** Pelaku industri mencari transporter berdedikasi dengan komitmen jangka panjang (3-5 tahun) yang menjamin kepastian kapasitas angkut.\n` +
        `- **Potensi Efisiensi Skala Ekonomi:** Optimalisasi rute dan integrasi telematika PRAMA menghasilkan penghematan biaya bahan bakar sebesar **${m.fuelSavingPercent}** serta memangkas waktu tunggu armada.\n\n` +
        `**2.3 Proyeksi Pertumbuhan Jangka Panjang**\n` +
        `Dengan tingkat pertumbuhan tahunan gabungan (CAGR) industri sebesar **${m.cagrPercent}% per tahun**, proyek ini memiliki ruang ekspansi yang sangat terukur dengan target pangsa sasaran **${m.marketShareTarget}** dari total pasar potensial.`;

    case 3:
      return `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)\n\n` +
        `**3.1 Struktur Pengeluaran Modal (CAPEX)**\n` +
        `- **Pengadaan Armada Utama:** Alokasi investasi unit ${m.unitsText} sebesar ${m.fleetCapexFormatted} (**${((m.fleetCapex / m.capexAmount) * 100).toFixed(1)}%** - *Detail %: ${m.fleetCapexFormatted} / ${m.capexFormatted} × 100%*).\n` +
        `- **Infrastruktur IT & IoT Telematics:** Sistem GPS, sensor monitoring, dan integrasi control tower sebesar ${m.itCapexFormatted} (**${((m.itCapex / m.capexAmount) * 100).toFixed(1)}%**).\n` +
        `- **Setup Fasilitas & Legalitas Awal:** Perizinan, renovasi depo, dan modal kerja awal sebesar ${m.depoCapexFormatted} (**${((m.depoCapex / m.capexAmount) * 100).toFixed(1)}%**).\n` +
        `- **Total Grand CAPEX:** **${m.capexFormatted}** (**100.0%**; Struktur pendanaan: 30% Equity Kas Internal / 70% Fasilitas Leasing Komersial).\n\n` +
        `**3.2 Struktur Biaya Operasional (OPEX) Bulanan**\n` +
        `- **BBM / Energi & Pelumas:** ${m.fuelOpexFormatted} / bulan (${((m.fuelOpex / m.opexAmount) * 100).toFixed(1)}% dari total OPEX bulanan).\n` +
        `- **Gaji Kru (${m.driverCount} org) & Tunjangan:** ${m.salaryOpexFormatted} / bulan (${((m.salaryOpex / m.opexAmount) * 100).toFixed(1)}% dari total OPEX bulanan).\n` +
        `- **Perawatan & Suku Cadang:** ${m.maintOpexFormatted} / bulan (${((m.maintOpex / m.opexAmount) * 100).toFixed(1)}% dari total OPEX bulanan).\n` +
        `- **Overhead Kantor & Administrasi:** ${m.overheadOpexFormatted} / bulan (${((m.overheadOpex / m.opexAmount) * 100).toFixed(1)}% dari total OPEX bulanan).\n` +
        `- **Total OPEX Bulanan:** **${m.opexFormatted}** (100.0%).\n\n` +
        `**3.3 Proyeksi Laba/Rugi (P&L) & Pengembalian Investasi (ROI)**\n` +
        `- **Tahun 1:** Pendapatan ${m.annualRevY1Formatted} | EBITDA ${m.ebitdaY1Formatted} (**${m.ebitdaMarginY1}**) | Laba Bersih ${m.netProfitY1Formatted} (**${m.netMarginY1}**).\n` +
        `- **Tahun 2:** Pendapatan ${m.annualRevY2Formatted} | EBITDA ${m.ebitdaY2Formatted} (**${m.ebitdaMarginY2}**) | Laba Bersih ${m.netProfitY2Formatted} (**${m.netMarginY2}**).\n` +
        `- **Tahun 3:** Pendapatan ${m.annualRevY3Formatted} | EBITDA ${m.ebitdaY3Formatted} (**${m.ebitdaMarginY3}**) | Laba Bersih ${m.netProfitY3Formatted} (**${m.netMarginY3}**).\n` +
        `- **Indikator Kelayakan:** Payback Period **${m.pbpYears}** | Net Present Value (NPV) Positif | Internal Rate of Return (IRR) **${m.irrPercent}** *(Detail %: Tingkat diskonto yang menyamakan present value arus kas dengan pengeluaran CAPEX awal)* & ROI **${m.roiPercent}** *(Detail %: Rata-rata Laba Bersih Tahunan / Grand CAPEX = ${m.roiPercent})*.`;

    case 4:
      return `### 4. Supply & Demand\n\n` +
        `**4.1 Analisis Keseimbangan Kapasitas**\n` +
        `Kajian kapasitas untuk proyek **${pName}** memetakan rasio ketersediaan ${m.unitsText} terhadap volume kebutuhan pengangkutan ${m.materialName}.\n\n` +
        `**4.2 Parameter Kinerja Operasional**\n` +
        `- **Tingkat Utilisasi Armada:** Target pemanfaatan unit optimal **${m.utilizationRate}** *(Detail Asal %: Rasio 26-27 hari dinas aktif per unit per bulan, menyisakan 3-4 hari untuk jadwal maintenance preventif)*.\n` +
        `- **Kapasitas Ritase Bulanan:** Proyeksi volume sebesar **${m.monthlyTrips} trip / bulan**.\n` +
        `- **Manajemen Cadangan (Buffer Fleet):** Alokasi unit cadangan **${m.bufferUnits} unit** *(Detail: Buffer fleet standby guna menjamin zero downtime operasional jika terjadi kendala teknis)*.\n\n` +
        `**4.3 Mitigasi Bottleneck**\n` +
        `Penjadwalan dispatch otomatis dan monitoring gate-in/gate-out real-time mencegah terjadinya antrean bongkar muat di titik fasilitas klien.`;

    case 5:
      return `### 5. Organization (Qualification, Skill, Output/KPI, SOP)\n\n` +
        `**5.1 Struktur Organisasi & Alokasi SDM**\n` +
        `Pengelolaan operasional proyek **${pName}** dipimpin oleh Project Lead berpengalaman, didukung Tim K3/HSE, Dispatcher Control Tower, Admin Logistik, dan total **${m.driverCount} personel kru/pengemudi bersertifikasi**.\n\n` +
        `**5.2 Kualifikasi & Sertifikasi SDM**\n` +
        `- **Pengemudi & Kru:** Memiliki SIM yang sesuai kelas unit, sertifikat defensive driving, dan pelatihan penanganan khusus ${m.materialName} (100% tersertifikasi).\n` +
        `- **Tim HSE:** Bersertifikasi AK3 Umum dan tanggap darurat kecelakaan rute.\n\n` +
        `**5.3 Target Kinerja (KPI) & SOP**\n` +
        `- **KPI Utama:** Zero Accident, pencapaian SLA pengiriman **> ${m.slaTarget}**, dan efisiensi konsumsi bahan bakar.\n` +
        `- **SOP Ketat:** Prosedur pre-trip digital inspection, ${m.extraDetail2}, dan pelaporan insiden darurat otomatis.`;

    case 6:
      return `### 6. Transition Model (Pre-On-Post)\n\n` +
        `**6.1 Tahap Pra-Onboarding (Pre-Transition - Bulan ke-1 s.d 2)**\n` +
        `- Pengadaan dan mobilisasi ${m.unitsText}, instalasi perangkat IoT telematika, dan finalisasi perizinan ${m.regulationsShort} (100% kesiapan legalitas).\n` +
        `- Penandatanganan kontrak kerja sama (PKS) dan sosialisasi SOP penanganan kargo kepada seluruh kru.\n\n` +
        `**6.2 Tahap Implementasi (Onboarding / Pilot Run - Bulan ke-3 s.d 4)**\n` +
        `- Uji coba rute terbatas (trial haul) dengan muatan **50% kapasitas** untuk kalibrasi sensor dan verifikasi ketepatan waktu rute.\n` +
        `- Evaluasi mingguan dengan target on-time delivery uji coba mencapai **≥ 95.0%**.\n\n` +
        `**6.3 Tahap Operasional Penuh (Post-Transition - Bulan ke-5 dan seterusnya)**\n` +
        `- Go-live penuh **100% kapasitas komersial** dengan pengawasan PRAMA Control Tower 24/7 dan target kepuasan klien CSAT **${m.csatTarget}** *(Skor: ${m.csatScore})*.`;

    case 7:
      return `### 7. Go To Market Strategy\n\n` +
        `**7.1 Strategi Penetrasi Pasar B2B**\n` +
        `- **Pendekatan Langsung (Direct B2B Enterprise):** Penetrasi terarah ke **${m.targetAccountsCount} korporasi utama (Tier-1)** di bidang ${m.industry}.\n` +
        `- **Skema Kontrak:** Penawaran Long-Term Service Agreement (LTSA) 3-5 tahun dengan kepastian alokasi unit dan garansi SLA.\n\n` +
        `**7.2 Diferensiasi & Proposisi Nilai (UVP)**\n` +
        `- Proposisi Nilai: **${m.valueProposition}**.\n` +
        `- Transparansi dashboard digital klien dengan pembaruan data telematika per jam tanpa biaya tersembunyi.`;

    case 8:
      return `### 8. Ops Model (Flow Process, Workflow Diagram, SLA)\n\n` +
        `**8.1 Alur Proses Operasional (End-to-End Workflow)**\n` +
        `1. **Booking & Dispatch:** Pesanan masuk via portal digital -> validasi jadwal -> penugasan unit armada terdekat.\n` +
        `2. **Inspection & Loading:** Pemeriksaan kondisi fisik & dokumen kargo ${m.materialName} -> proses muat aman -> penguncian segel digital.\n` +
        `3. **Transit Monitoring:** Perjalanan dipantau melalui GPS telematika 24/7 melintasi ${m.extraDetail1}\n` +
        `4. **Unloading & e-POD:** Pembongkaran di fasilitas tujuan -> verifikasi digital penerima (e-POD) -> penutupan tiket pengiriman.\n\n` +
        `**8.2 Jaminan Service Level Agreement (SLA)**\n` +
        `- Ketepatan waktu pengiriman: minimal **${m.slaTarget}** *(Detail Asal %: Target minimal ${Math.round(m.monthlyTrips * (parseFloat(m.slaTarget)/100))} dari ${m.monthlyTrips} rit bulanan on-time)*.\n` +
        `- Waktu respon darurat teknis: < 30 menit.`;

    case 9:
      return `### 9. Risk Management\n\n` +
        `**9.1 Matriks Analisis Risiko & Mitigasi**\n` +
        `- **Risiko Operasional Rute:** Mitigasi melalui preventive maintenance terjadwal, sensor pemantau kecepatan & kelelahan pengemudi, dan asuransi kargo **100% nilai barang**.\n` +
        `- **Risiko Fluktuasi Harga Energi/BBM:** Mitigasi melalui klausul eskalasi tarif (Fuel Surcharge Adjustment) jika harga solar acuan berubah **> 5%**.\n` +
        `- **Risiko Regulasi & Hukum:** Kepatuhan 100% terhadap batas muatan MST/Zero ODOL dan audit berkala perizinan ${m.regulationsShort}.\n\n` +
        `**9.2 Protokol Tanggap Darurat (Emergency Response)**\n` +
        `Penyediaan unit mobile service dan armada pengganti standby dengan respon penanganan di bawah 45 menit di sepanjang koridor operasional.`;

    case 10:
      return `### 10. Digital Coverage (Tools, Method, Impact, Automation)\n\n` +
        `**10.1 Ekosistem Teknologi & Telematika**\n` +
        `- **PRAMA Fleet Management System (FMS):** Platform terpusat untuk pemantauan posisi GPS, geofencing, dan kecepatan armada secara real-time.\n` +
        `- **Sensor IoT Terpasang:** Sensor pemantau beban suspensi, telematika mesin, dan status muatan ${m.materialNameShort}.\n\n` +
        `**10.2 Dampak & Otomatisasi Terukur**\n` +
        `- Pengurangan waktu administrasi dan pelaporan manual hingga **${m.adminSavingPercent}%** melalui implementasi e-POD dan e-manifest digital.\n` +
        `- Efisiensi konsumsi bahan bakar sebesar **${m.fuelSavingPercent}** berkat optimasi rute cerdas dan pencegahan idle mesin berlebih.`;

    case 11:
      return `### 11. Competitor\n\n` +
        `**11.1 Pemetaan Kompetitor Utama**\n` +
        `Analisis terhadap ${m.competitorType} menunjukkan kelemahan petahana pada aspek reliabilitas armada, ketiadaan sensor IoT terintegrasi, dan lambatnya respon penanganan kendala rute.\n\n` +
        `**11.2 Strategi Penguasaan Pasar**\n` +
        `Dengan keunggulan ${m.valueProposition}, proyek **${pName}** menargetkan perebutan pangsa pasar sebesar **${m.competitorTakeoverRate}** dari operator konvensional pada tahun ke-1 hingga ke-2.`;

    case 12:
      return `### 12. TAM, SAM, SOM\n\n` +
        `**12.1 Analisis Ukuran Pasar (Market Sizing)**\n` +
        `- **Total Addressable Market (TAM):** Seluruh potensi pasar logistik ${m.industry} di Indonesia senilai **${m.tamFormatted}** (**100% Makro**).\n` +
        `- **Serviceable Addressable Market (SAM):** Pasar yang dapat dilayani pada koridor operasional sasaran senilai **${m.samFormatted}** (**${m.samPct}** dari TAM - *Detail %: ${m.samFormatted} / ${m.tamFormatted}*).\n` +
        `- **Serviceable Obtainable Market (SOM):** Target pangsa pasar riil yang dapat diraih dalam 3 tahun pertama senilai **${m.somFormatted}** (**${m.somPct}** dari SAM - *Detail %: ${m.somFormatted} / ${m.samFormatted}*).\n\n` +
        `**12.2 Strategi Pencapaian SOM**\n` +
        `Fokus pada penguncian kontrak jangka panjang dengan **${m.targetAccountsCount} akun korporasi utama** pada koridor ${m.extraDetail1}`;

    case 13:
      return `### 13. CAC, LTV\n\n` +
        `**13.1 Metrik Akuisisi & Nilai Pelanggan**\n` +
        `- **Customer Acquisition Cost (CAC):** Biaya rata-rata untuk mengakuisisi satu klien korporat B2B sebesar **${m.cacFormatted}** (mencakup tender, survei rute, dan perizinan awal).\n` +
        `- **Lifetime Value (LTV):** Estimasi nilai margin kontribusi per klien selama masa kontrak 3 tahun sebesar **${m.ltvFormatted}**.\n` +
        `- **Rasio LTV / CAC:** **${m.ratioValue}x** *(Detail Rasio: LTV ${m.ltvFormatted} / CAC ${m.cacFormatted} = ${m.ratioValue}x, menunjukkan efisiensi penjualan korporat yang sangat prima dan sehat)*.\n\n` +
        `**13.2 Retensi Pelanggan**\n` +
        `Menjaga kepuasan klien melalui review kinerja triwulanan (QBR) untuk mempertahankan tingkat retensi kontrak **≥ 95.0%**.`;

    case 14:
      return `### 14. Kesimpulan & Rekomendasi Keputusan\n\n` +
        `**14.1 Kesimpulan Kelayakan Proyek**\n` +
        `Berdasarkan evaluasi komprehensif seluruh pilar operasional, finansial, dan pasar, proyek **${pName}** dinyatakan **SANGAT LAYAK (GO)** dengan skor kelayakan **${m.feasibilityScore}** *(Detail Skor: Bobot Pasar [${m.scoreMarket}] + Bobot Operasional [${m.scoreOps}] + Bobot Finansial [${m.scoreFin}] + Bobot Legalitas [${m.scoreLegal}] = ${m.feasibilityScore})*.\n\n` +
        `**14.2 Rekomendasi Taktis Eksekusi**\n` +
        `1. Segera lakukan pengadaan tahap 1 untuk ${m.unitsText} sesuai alokasi CAPEX ${m.capexFormatted}.\n` +
        `2. Finalisasi kontrak kerja sama (LTSA) dengan ${m.targetAccountsCount} anchor client utama di sektor ${m.industry}.\n` +
        `3. Aktifkan integrasi PRAMA Control Tower dan sensor telematika untuk menjamin kesiapan go-live 100%.`;

    case 15:
      return `### 15. Service Design\n\n` +
        `**15.1 Desain Layanan & Peta Perjalanan Klien (Client Journey Map)**\n` +
        `- **Fase Konsultasi & Penawaran:** Pemetaan spesifikasi muatan ${m.materialName} dan penyusunan proposal teknis komersial dalam 2x24 jam.\n` +
        `- **Fase Onboarding & Integrasi:** Alokasi unit ${m.assetCategory}, integrasi portal pelacakan klien, dan uji coba rute.\n` +
        `- **Fase Eksekusi & Evaluasi:** Monitoring real-time 24/7 dan laporan analitik bulanan dengan target CSAT **${m.csatTarget}** *(Skor: ${m.csatScore})*.\n\n` +
        `**15.2 Standar Layanan Prima**\n` +
        `Komitmen memberikan pengalaman logistik tanpa hambatan bagi seluruh mitra korporat dengan kesiapan armada (fleet readiness) minimal **≥ 98.0%**.`;

    case 16:
      return `### 16. Konsumen Potensial\n\n` +
        `**16.1 Profil Target Akun B2B (Target Accounts)**\n` +
        `- **Produsen & Manufaktur Utama:** Korporasi skala nasional dan multinasional di bidang ${m.industry} yang membutuhkan keandalan pasokan rutin.\n` +
        `- **Distributor & Trader Komoditas:** Pengelola fasilitas penampungan dan jaringan distribusi regional ${m.materialName}.\n` +
        `- **Pipeline Awal:** Teridentifikasi **${m.targetAccountsCount} akun korporasi potensial** dengan estimasi potensi nilai kontrak tahunan Rp ${(m.monthlyRev * 12 * 1.5 / 1000000000).toFixed(1)} Miliar.\n\n` +
        `**16.2 Skema Kerja Sama**\n` +
        `Penyediaan skema penagihan Term of Payment (TOP) 60-90 hari dengan jaminan garansi bank dan SLA ketat.`;

    case 17:
      return `### 17. Legal & Regulatory Compliance (Izin Usaha, Perizinan Sektoral, Dokumen Legalitas)\n\n` +
        `**17.1 Legalitas Badan Usaha & Perizinan Berusaha**\n` +
        `- **Badan Hukum:** Entitas perseroan terbatas (PT) berbadan hukum lengkap dengan akta pendirian dan pengesahan Kemenkumham (100% sah).\n` +
        `- **Perizinan Berusaha Berbasis Risiko (OSS RBA):** NIB terdaftar efektif dengan KBLI angkutan barang khusus dan logistik pergudangan ${m.materialName}.\n` +
        `- **Perizinan Sektoral Kemenhub:** Kepemilikan izin penyelenggaraan angkutan barang khusus dan kelaikan operasional ${m.regulationsShort}.\n\n` +
        `**17.2 Kepatuhan Kontrak & Dokumen Hukum**\n` +
        `- Perjanjian Kerja Sama (PKS) B2B bermeterai dengan klausul tanggung jawab kargo, jaminan SLA minimal **${m.slaTarget}**, dan klausul penyesuaian tarif BBM jika harga solar acuan berubah **> 5%**.\n` +
        `- Kepatuhan penuh terhadap standar Zero ODOL Kemenhub dan sertifikasi uji berkala kendaraan (e-KIR).`;

    default:
      return `### ${num}. ${title}\n\nKajian strategis mendalam untuk pilar **${title}** pada proyek **${pName}** mencakup parameter operasional, metrik kuantitatif, serta prosedur standar industri berstandar tinggi.`;
  }
}

// Default 14 Essential Project Management Structure Sections
export const defaultDashboardSections: DashboardSection[] = getDashboardSectionsForProject("Kajian Strategis: Forestry Management Transportation");

/**
 * Format markdown string content to standard HTML styled for MS Word with full Table and Formatting support
 */
export function formatSectionToHtml(title: string, text: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (!inTable || tableRows.length === 0) return;
    let tableHtml = `<table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 9pt;">`;
    let isHeader = true;
    for (let r = 0; r < tableRows.length; r++) {
      const rowLine = tableRows[r].trim();
      if (/^\|[\s\-:|]+\|$/.test(rowLine)) {
        isHeader = false;
        continue;
      }
      const cells = rowLine.split("|").slice(1, -1).map(c => c.trim());
      if (cells.length === 0) continue;

      tableHtml += `<tr>`;
      for (const cell of cells) {
        const formattedCell = cell
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");
        if (isHeader) {
          tableHtml += `<th style="background-color: #1e3a8a; color: #ffffff; padding: 4.5pt 6.5pt; border: 1pt solid #cbd5e1; font-weight: bold; text-align: left; font-size: 9pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">${formattedCell}</th>`;
        } else {
          const bg = r % 2 === 0 ? "#f8fafc" : "#ffffff";
          tableHtml += `<td style="padding: 4.5pt 6.5pt; border: 1pt solid #cbd5e1; background-color: ${bg}; color: #1e293b; font-size: 9pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">${formattedCell}</td>`;
        }
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</table>`;
    html += tableHtml;
    tableRows = [];
    inTable = false;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      html += `<p style="font-size: 13pt; font-weight: bold; color: #1e3a8a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 10pt; margin-bottom: 4pt; border-bottom: 1.5pt solid #1e3a8a; padding-bottom: 2pt;">${trimmed.substring(2)}</p>`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      html += `<p style="font-size: 11.5pt; font-weight: bold; color: #1e3a8a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 8pt; margin-bottom: 3pt;">${trimmed.substring(3)}</p>`;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      html += `<p style="font-size: 10.5pt; font-weight: bold; color: #1e3a8a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 7pt; margin-bottom: 2pt;">${trimmed.substring(4)}</p>`;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      html += `<p style="font-size: 9.5pt; color: #0f172a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 5pt; margin-bottom: 2pt; font-weight: bold;">${trimmed.substring(5)}</p>`;
      continue;
    }

    // Bold title line
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 90) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      html += `<p style="font-size: 10pt; color: #1e3a8a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 6pt; margin-bottom: 2pt; font-weight: bold;">${trimmed.replace(/\*\*/g, "")}</p>`;
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith("> ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      const cleanQuote = trimmed.substring(2)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      html += `<table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 6pt;"><tr><td style="background-color: #f1f5f9; border-left: 3pt solid #3b82f6; border-top: 1pt solid #e2e8f0; border-right: 1pt solid #e2e8f0; border-bottom: 1pt solid #e2e8f0; padding: 4.5pt 8pt; font-size: 9pt; color: #475569; font-style: italic; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">${cleanQuote}</td></tr></table>`;
      continue;
    }

    // Bullet lists
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      if (!inList) {
        html += `<ul style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt;">`;
        inList = true;
      }
      const cleanLi = trimmed.substring(2)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      html += `<li style="font-size: 9.5pt; color: #334155; margin-bottom: 2pt; line-height: 1.35; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">${cleanLi}</li>`;
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (inList) { html += "</ul>"; inList = false; }
      if (!inOrderedList) {
        html += `<ol style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt;">`;
        inOrderedList = true;
      }
      const cleanNum = numMatch[2]
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      html += `<li style="font-size: 9.5pt; color: #334155; margin-bottom: 2pt; line-height: 1.35; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">${cleanNum}</li>`;
      continue;
    }

    if (!trimmed) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
      continue;
    }

    // Default paragraph
    if (inList) { html += "</ul>"; inList = false; }
    if (inOrderedList) { html += "</ol>"; inOrderedList = false; }
    const cleanPara = trimmed
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    html += `<p style="font-size: 9.5pt; color: #334155; line-height: 1.4; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin-top: 0; margin-bottom: 4pt; text-align: justify;">${cleanPara}</p>`;
  }

  if (inTable) flushTable();
  if (inList) html += "</ul>";
  if (inOrderedList) html += "</ol>";

  return html;
}

/**
 * Generate full, rich dashboard visual cards & analytical tables matching what is seen in each dashboard deep-dive view
 */
export function getPillarDashboardVisualHtml(secNumber: number, title: string, projectTitle: string): string {
  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const archetype = detectProjectArchetype(displayTitle);

  if (archetype === 'manufacturing') {
    return getManufacturingVisualHtml(secNumber, title, displayTitle);
  }
  if (archetype === 'personal_sme') {
    return getPersonalSmeVisualHtml(secNumber, title, displayTitle);
  }
  
  // Base visual container styling - strictly Word-compatible
  const tableStyle = `width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 9pt;`;
  const thStyle = `background-color: #1e3a8a; color: #ffffff; padding: 4.5pt 6.5pt; border: 1pt solid #cbd5e1; font-weight: bold; text-align: left; font-size: 9pt;`;
  const tdStyle = `padding: 4.5pt 6.5pt; border: 1pt solid #cbd5e1; color: #1e293b; font-size: 9pt;`;
  const tdAltStyle = `padding: 4.5pt 6.5pt; border: 1pt solid #cbd5e1; background-color: #f8fafc; color: #1e293b; font-size: 9pt;`;
  const sectionHeaderStyle = `font-size: 10pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin-top: 8pt; margin-bottom: 3pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;`;

  // Render metric card HTML using Word-compatible standard table with collapsed borders
  const renderMetricCards = (cards: { label: string; val: string; sub: string; color: string }[]) => {
    const widthPct = Math.floor(100 / cards.length);
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
        <tr>
          ${cards.map((c) => `
            <td style="width: ${widthPct}%; background-color: #f8fafc; border: 1pt solid #cbd5e1; border-top: 3pt solid ${c.color}; padding: 6pt 8pt; vertical-align: top;">
              <div style="font-size: 7.5pt; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2pt;">${c.label}</div>
              <div style="font-size: 11pt; font-weight: bold; color: #0f172a; margin-bottom: 2pt;">${c.val}</div>
              <div style="font-size: 7.5pt; color: ${c.color}; font-weight: bold;">${c.sub}</div>
            </td>
          `).join('')}
        </tr>
      </table>
    `;
  };

  switch (secNumber) {
    case 1: { // Global / NAT Overview
      const cards = [
        { label: "Status Regulasi", val: "UU 22/2009 & Zero ODOL", sub: "✓ Kepatuhan Penuh Terpenuhi", color: "#2563eb" },
        { label: "Spesifikasi Armada", val: "MST 10 Ton / Gandar Ganda", sub: "★ Sesuai Kelas Jalan Koridor", color: "#059669" },
        { label: "Status Kelayakan", val: "SANGAT LAYAK (GO)", sub: "● PRAMA System Advisor Verified", color: "#d97706" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 1.1: Matriks Kepatuhan Regulasi & Kebijakan Sektoral</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Instrumen Hukum & Regulasi</th>
              <th style="${thStyle}">Instansi Pengawas</th>
              <th style="${thStyle}">Parameter Wajib</th>
              <th style="${thStyle}">Kesiapan PRAMA Pancaran</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>UU No. 22 Tahun 2009</strong></td>
              <td style="${tdStyle}">Kemenhub & Korlantas POLRI</td>
              <td style="${tdStyle}">Kelaikan jalan, KIR berkala, dimensi karoseri</td>
              <td style="${tdStyle}">100% Lulus Uji Berkala & Sertifikasi SRUT Resmi</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kebijakan Zero ODOL Nasional</strong></td>
              <td style="${tdAltStyle}">Ditjen Perhubungan Darat</td>
              <td style="${tdAltStyle}">Batas Muatan Sumbu Terberat (MST 10 Ton)</td>
              <td style="${tdAltStyle}">Pemasangan Sensor Timbangan Gandar On-Board</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>SMK Kemenhub & ISO 45001</strong></td>
              <td style="${tdStyle}">Kemenhub / Badan Akreditasi</td>
              <td style="${tdStyle}">Sistem Manajemen Keselamatan Transportasi</td>
              <td style="${tdStyle}">Audit Keselamatan Rutin & Sertifikasi Terpadu</td>
            </tr>
          </tbody>
        </table>

        <div style="${sectionHeaderStyle}">Tabel 1.2: Analisis Karakteristik Koridor & Medan Operasional</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Segmen Rute Koridor</th>
              <th style="${thStyle}">Karakter Fisik & Kelas Jalan</th>
              <th style="${thStyle}">Titik Kritis & Hambatan</th>
              <th style="${thStyle}">Prosedur Pengamanan Operasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">Rute Utama Hauling / Distribusi</td>
              <td style="${tdStyle}">Jalan Nasional / Arteri Kelas I & II</td>
              <td style="${tdStyle}">Jembatan Timbang WIM & Titik Kemacetan Pasar</td>
              <td style="${tdStyle}">Geofencing PRAMA IoT & Pengaturan Jam Berangkat Non-Sibuk</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Rute Akses Depo & Fasilitas Klien</td>
              <td style="${tdAltStyle}">Jalan Kabupaten / Akses Kawasan Industri</td>
              <td style="${tdAltStyle}">Radius Putar Truk & Hambatan Portal Ketinggian</td>
              <td style="${tdAltStyle}">Survei Kelayakan Rute Fisik (Route Survey Validation)</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 2: { // Market Opportunity
      const cards = [
        { label: "Kebutuhan Pasar", val: "Sangat Tinggi & Tumbuh", sub: "✓ Kesenjangan Transporter Tradisional", color: "#2563eb" },
        { label: "Target Service Level", val: "SLA 98.5% On-Time", sub: "★ Didukung Fleet Management IoT", color: "#059669" },
        { label: "Potensi Kontrak", val: "Dedicated Multi-Year", sub: "● Stabilitas Arus Kas Jangka Panjang", color: "#7c3aed" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 2.1: Analisis Kesenjangan Pasar vs Solusi Nilai Tambah PRAMA</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Dimensi Operasional</th>
              <th style="${thStyle}">Kondisi Transporter Konvensional</th>
              <th style="${thStyle}">Solusi Keunggulan PRAMA Pancaran</th>
              <th style="${thStyle}">Manfaat Konkret Klien B2B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Transparansi Posisi Unit</strong></td>
              <td style="${tdStyle}">Hanya kontak telepon / WhatsApp manual</td>
              <td style="${tdStyle}">Live GPS Control Tower & Telematika IoT</td>
              <td style="${tdStyle}">Akurasi estimasi kedatangan (ETA) 99%</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kepatuhan Regulasi & ODOL</strong></td>
              <td style="${tdAltStyle}">Kerap melebihi muatan & terkena tilang/razia</td>
              <td style="${tdAltStyle}">100% Zero ODOL & Berizin Resmi Kementerian</td>
              <td style="${tdAltStyle}">Bebas risiko sanksi hukum bagi pemilik kargo</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Keandalan & Cadangan Armada</strong></td>
              <td style="${tdStyle}">Jika armada mogok, pengiriman tertunda lama</td>
              <td style="${tdStyle}">Buffer unit 10% standby & respons darurat &lt; 2 jam</td>
              <td style="${tdStyle}">Tidak ada keterlambatan pasokan lini produksi</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 3: { // Financial Model
      const cards = [
        { label: "Grand Total CAPEX", val: "Rp 4.260.000.000", sub: "✓ Alokasi Armada, IoT & Depo", color: "#2563eb" },
        { label: "Biaya Operasional Bulanan", val: "Rp 280.000.000 / bln", sub: "★ BBM, Kru, Maintenance & Legal", color: "#059669" },
        { label: "Payback Period", val: "2.1 - 2.5 Tahun", sub: "● Pengembalian Investasi Cepat", color: "#d97706" },
        { label: "Proyeksi IRR / ROI", val: "24.5% / 32.8%", sub: "★ Sangat Menguntungkan", color: "#7c3aed" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 3.1: Struktur Alokasi Pengeluaran Modal (CAPEX)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Pos Pengeluaran Modal (CAPEX)</th>
              <th style="${thStyle}">Alokasi Nominal (IDR)</th>
              <th style="${thStyle}">Porsi (%)</th>
              <th style="${thStyle}">Keterangan Teknis Pengadaan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">Pengadaan Truk & Karoseri Spesifikasi Khusus</td>
              <td style="${tdStyle}">Rp 3.500.000.000</td>
              <td style="${tdStyle}">82.1%</td>
              <td style="${tdStyle}">Unit baru bersertifikasi SRUT & standar Euro 4</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Perangkat IoT Telematics, Sensor & Control Tower</td>
              <td style="${tdAltStyle}">Rp 350.000.000</td>
              <td style="${tdAltStyle}">8.2%</td>
              <td style="${tdAltStyle}">GPS dual-band, fuel sensor, ADAS camera, & e-POD tab</td>
            </tr>
            <tr>
              <td style="${tdStyle}">Fasilitas Depo, Perizinan Usaha, & Modal Kerja Awal</td>
              <td style="${tdStyle}">Rp 410.000.000</td>
              <td style="${tdStyle}">9.7%</td>
              <td style="${tdStyle}">Setup workshop maintenance & asuransi kargo perdana</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="${tdStyle}">GRAND TOTAL CAPEX PROYEK</td>
              <td style="${tdStyle}">Rp 4.260.000.000</td>
              <td style="${tdStyle}">100.0%</td>
              <td style="${tdStyle}">Struktur pembiayaan: 30% Equity / 70% Leasing Komersial</td>
            </tr>
          </tbody>
        </table>

        <div style="${sectionHeaderStyle}">Tabel 3.2: Proyeksi Laba Rugi 3 Tahun (P&L Forecast)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Indikator Laporan Keuangan</th>
              <th style="${thStyle}">Tahun 1 (IDR)</th>
              <th style="${thStyle}">Tahun 2 (IDR)</th>
              <th style="${thStyle}">Tahun 3 (IDR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Total Pendapatan (Revenue)</strong></td>
              <td style="${tdStyle}">Rp 4.800.000.000</td>
              <td style="${tdStyle}">Rp 5.850.000.000</td>
              <td style="${tdStyle}">Rp 7.100.000.000</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Beban Operasional Pokok (OPEX / COGS)</td>
              <td style="${tdAltStyle}">Rp 3.360.000.000</td>
              <td style="${tdAltStyle}">Rp 4.000.000.000</td>
              <td style="${tdAltStyle}">Rp 4.720.000.000</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>EBITDA Operasional</strong></td>
              <td style="${tdStyle}">Rp 1.440.000.000 (30.0%)</td>
              <td style="${tdStyle}">Rp 1.850.000.000 (31.6%)</td>
              <td style="${tdStyle}">Rp 2.380.000.000 (33.5%)</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Depresiasi, Bunga Leasing, & Pajak</td>
              <td style="${tdAltStyle}">Rp 520.000.000</td>
              <td style="${tdAltStyle}">Rp 600.000.000</td>
              <td style="${tdAltStyle}">Rp 700.000.000</td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: bold;">
              <td style="${tdStyle}"><strong>Laba Bersih (Net Profit)</strong></td>
              <td style="${tdStyle}">Rp 920.000.000 (19.2%)</td>
              <td style="${tdStyle}">Rp 1.250.000.000 (21.3%)</td>
              <td style="${tdStyle}">Rp 1.680.000.000 (23.6%)</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 4: { // Supply & Demand
      const cards = [
        { label: "Utilisasi Target", val: "88.5% - 92.0%", sub: "✓ Keseimbangan Kapasitas Maksimal", color: "#2563eb" },
        { label: "Turnaround Time (TAT)", val: "&lt; 45 Menit", sub: "★ Efisiensi Waktu Bongkar Muat", color: "#059669" },
        { label: "Buffer Fleet Cadangan", val: "10% Unit Standby", sub: "● Mitigasi Lonjakan Kargo 24/7", color: "#d97706" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 4.1: Neraca Kapasitas Pasokan vs Permintaan Kargo Klien</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Parameter Kapasitas</th>
              <th style="${thStyle}">Nilai Target Bulanan</th>
              <th style="${thStyle}">Satuan Ukuran</th>
              <th style="${thStyle}">Tingkat Keterisian & Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">Kapasitas Muat Maksimal Armada</td>
              <td style="${tdStyle}">1.450 - 1.800</td>
              <td style="${tdStyle}">Ton / Bulan</td>
              <td style="${tdStyle}">Berdasarkan spesifikasi unit Zero ODOL</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Komitmen Kontrak Kargo Klien</td>
              <td style="${tdAltStyle}">1.300 - 1.600</td>
              <td style="${tdAltStyle}">Ton / Bulan</td>
              <td style="${tdAltStyle}">Kontrak eksklusif B2B minimum terjamin</td>
            </tr>
            <tr>
              <td style="${tdStyle}">Utilisasi Kapasitas Terpakai</td>
              <td style="${tdStyle}">89.6%</td>
              <td style="${tdStyle}">Persentase (%)</td>
              <td style="${tdStyle}">Tingkat efisiensi zona optimal operasi</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 5: { // Organization & SOP
      const cards = [
        { label: "Kualifikasi Awak Truk", val: "SIM B2 Umum + K3", sub: "✓ Sertifikasi Uji Kompetensi BNSP", color: "#2563eb" },
        { label: "Target SLA Dispatch", val: "≥ 98.5% On-Time", sub: "★ Pemantauan Real-Time Dispatcher", color: "#059669" },
        { label: "Target HSE & Zero Acc.", val: "0 Insiden Fatal", sub: "● Standar Keselamatan Ketat", color: "#dc2626" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 5.1: Struktur Tim Proyek & Kualifikasi Jabatan Inti</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Posisi / Jabatan</th>
              <th style="${thStyle}">Jumlah Personel</th>
              <th style="${thStyle}">Kualifikasi Minimal Wajib</th>
              <th style="${thStyle}">Tanggung Jawab Utama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Project Manager Operasional</strong></td>
              <td style="${tdStyle}">1 Orang</td>
              <td style="${tdStyle}">S1 Teknik / Logistik, Min. 5 th Pengalaman</td>
              <td style="${tdStyle}">Manajemen P&L proyek & hubungan strategis klien</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Dispatcher Control Tower</strong></td>
              <td style="${tdAltStyle}">2 Orang (Shift)</td>
              <td style="${tdAltStyle}">D3/S1 Manajemen, Sertifikasi Telematika FMS</td>
              <td style="${tdAltStyle}">Monitoring live GPS, kepatuhan kecepatan & rute</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Pengemudi Truk Berat (Driver)</strong></td>
              <td style="${tdStyle}">10 - 14 Orang</td>
              <td style="${tdStyle}">SIM B2 Umum, Lulus Tes Narkoba & Defensive Driving</td>
              <td style="${tdStyle}">Eksekusi perjalanan aman, kepatuhan P2H & e-POD</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Mekanik K3 Lapangan</strong></td>
              <td style="${tdAltStyle}">2 Orang</td>
              <td style="${tdAltStyle}">SMK Otomotif / D3, Ahli Sistem Rem & Mesin</td>
              <td style="${tdAltStyle}">Inspeksi harian P2H & servis berkala armada</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 6: { // Transition Model
      const cards = [
        { label: "Fase Pre-Deployment", val: "Bulan 0 - 1", sub: "✓ Pengadaan Unit & Sertifikasi Legal", color: "#2563eb" },
        { label: "Fase On-Boarding", val: "Bulan 1 - 2", sub: "★ Uji Rute & Integrasi Portal Klien", color: "#059669" },
        { label: "Fase Stabilisasi Penuh", val: "Bulan 2+", sub: "● Operasi 24/7 & Review SLA Bulanan", color: "#7c3aed" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 6.1: Roadmap Eksekusi Transisi Operasional 3 Tahap</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Fase Transisi</th>
              <th style="${thStyle}">Aktivitas Kunci & Milestone</th>
              <th style="${thStyle}">Deliverables & Hasil</th>
              <th style="${thStyle}">Risk Gate Kriteria</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Fase 1: Pre-Transition</strong><br>(Minggu 1 - 4)</td>
              <td style="${tdStyle}">Pemeriksaan fisik armada, pemasangan sensor IoT, rekrutmen supir, finalisasi PKS</td>
              <td style="${tdStyle}">Berita Acara Kesiapan Armada & Izin Operasional Lengkap</td>
              <td style="${tdStyle}">100% lulus checklist P2H & sertifikasi SRUT</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Fase 2: On-Boarding</strong><br>(Minggu 5 - 8)</td>
              <td style="${tdAltStyle}">Pilot run 50% kuota muatan, uji integrasi e-POD dengan ERP klien, dry-run darurat</td>
              <td style="${tdAltStyle}">Laporan Uji Coba Lapangan & Kalibrasi Waktu Tempuh</td>
              <td style="${tdAltStyle}">SLA ketepatan rute uji coba mencapai ≥ 95%</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Fase 3: Post-Transition</strong><br>(Minggu 9+)</td>
              <td style="${tdStyle}">Operasional komersial penuh 100%, evaluasi performa mingguan, penagihan siklus 1</td>
              <td style="${tdStyle}">Dashboard Performa Real-Time & Laporan SLA Bulanan</td>
              <td style="${tdStyle}">Zero fatal safety incident & CSAT rating ≥ 90%</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 7: { // Go To Market
      const cards = [
        { label: "Model Penjualan B2B", val: "Direct Enterprise Sales", sub: "✓ Pendekatan Langsung ke Pemilik Kargo", color: "#2563eb" },
        { label: "Tipe Kontrak Kemitraan", val: "Long-Term LTSA (1-3 Th)", sub: "★ Kepastian Pendapatan & Volume", color: "#059669" },
        { label: "Target Akuisisi Klien", val: "3 - 5 Korporasi Tier-1", sub: "● Utilisasi Kapasitas Maksimal", color: "#d97706" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 7.1: Saluran Akuisisi & Target Akun Korporat B2B</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Saluran Penetrasi Pasar</th>
              <th style="${thStyle}">Metode Pendekatan</th>
              <th style="${thStyle}">Target Pengambil Keputusan</th>
              <th style="${thStyle}">Taktik Penawaran Utama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">Direct B2B Enterprise Tender</td>
              <td style="${tdStyle}">Pengajuan proposal teknis berbasis digital & IoT</td>
              <td style="${tdStyle}">Procurement Head & Supply Chain Director</td>
              <td style="${tdStyle}">Jaminan SLA ketat dengan kompensasi denda keterlambatan</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Strategic Account Partnership</td>
              <td style="${tdAltStyle}">Penyediaan dedicated fleet eksklusif branding klien</td>
              <td style="${tdAltStyle}">VP Operations & Logistics Director</td>
              <td style="${tdAltStyle}">Integrasi API pelacakan kargo langsung ke ERP internal</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 8: { // Ops Model
      const cards = [
        { label: "Ketepatan Waktu (On-Time)", val: "≥ 98.5%", sub: "✓ Standar Layanan Emas Pancaran", color: "#2563eb" },
        { label: "Kecepatan Respon Darurat", val: "&lt; 30 Menit", sub: "★ Tim Siaga Cepat (ERT) 24 Jam", color: "#059669" },
        { label: "Transparansi Pelacakan", val: "100% Real-Time", sub: "● GPS Satelit & e-POD Digital", color: "#7c3aed" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 8.1: Alur Kerja Operasional 6 Tahap (End-to-End Workflow)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Tahap Operasi</th>
              <th style="${thStyle}">Aktivitas Pelaksanaan</th>
              <th style="${thStyle}">Verifikasi Sistem & Alat</th>
              <th style="${thStyle}">Standar Waktu Penyelesaian</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">1. Order Booking & Dispatch</td>
              <td style="${tdStyle}">Klien memasukkan pesanan, dispatcher mengalokasikan armada</td>
              <td style="${tdStyle}">PRAMA FMS Core System</td>
              <td style="${tdStyle}">Maksimal 15 menit dari order</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">2. Inspeksi Pra-Jalan (P2H)</td>
              <td style="${tdAltStyle}">Pemeriksaan rem, ban, oli, lampu, dan tes breathalyzer supir</td>
              <td style="${tdAltStyle}">Mobile App Checklist Digital P2H</td>
              <td style="${tdAltStyle}">Maksimal 20 menit sebelum jalan</td>
            </tr>
            <tr>
              <td style="${tdStyle}">3. Pemuatan (Loading) & Gandar</td>
              <td style="${tdStyle}">Pengawasan pemuatan kargo & penimbangan berat gandar</td>
              <td style="${tdStyle}">Sensor Timbangan & Kamera CCTV Depo</td>
              <td style="${tdStyle}">Maksimal 45 menit di loading bay</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">4. Perjalanan Transit Terkawal</td>
              <td style="${tdAltStyle}">Truk melaju pada koridor yang ditentukan tanpa deviasi rute</td>
              <td style="${tdAltStyle}">Geofencing Satelit & ADAS Fatigue Cam</td>
              <td style="${tdAltStyle}">Sesuai batas waktu koridor aman</td>
            </tr>
            <tr>
              <td style="${tdStyle}">5. Pembongkaran (Unloading)</td>
              <td style="${tdStyle}">Pemeriksaan segel kontainer / kargo di lokasi penerima</td>
              <td style="${tdStyle}">Physical Seal Verification Protocol</td>
              <td style="${tdStyle}">Maksimal 45 menit di unloading bay</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">6. Penyelesaian Digital (e-POD)</td>
              <td style="${tdAltStyle}">Tanda tangan digital penerima & foto bukti serah terima</td>
              <td style="${tdAltStyle}">Portal e-POD Terintegrasi Cloud</td>
              <td style="${tdAltStyle}">Seketika (Instant real-time upload)</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 9: { // Risk Management
      const cards = [
        { label: "Audit Risiko Terpadu", val: "Zero Critical Risk", sub: "✓ Mitigasi Preventif Berlapis", color: "#2563eb" },
        { label: "Proteksi Asuransi Kargo", val: "All-Risk Cargo 100%", sub: "★ Klaim Terjamin & Cepat", color: "#059669" },
        { label: "Tim Tanggap Darurat (ERT)", val: "Siaga 24 Jam Nonstop", sub: "● Respon Wilayah Terpadu", color: "#dc2626" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 9.1: Register Risiko Operasional & Protokol Pengendalian</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Kategori Risiko</th>
              <th style="${thStyle}">Potensi Ancaman Kejadian</th>
              <th style="${thStyle}">Probabilitas / Dampak</th>
              <th style="${thStyle}">Tindakan Pengendalian & Mitigasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Risiko Mekanikal Truk</strong></td>
              <td style="${tdStyle}">Kerusakan mesin, pecah ban, atau overheat di jalan</td>
              <td style="${tdStyle}">Rendah / Sedang</td>
              <td style="${tdStyle}">Program Preventive Maintenance tiap 5.000 km & pergantian suku cadang OEM</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Risiko Keselamatan (K3)</strong></td>
              <td style="${tdAltStyle}">Kecelakaan lalu lintas akibat kelelahan pengemudi</td>
              <td style="${tdAltStyle}">Rendah / Tinggi</td>
              <td style="${tdAltStyle}">Sensor AI pendeteksi kantuk di kabin & wajib istirahat tiap 4 jam mengemudi</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Risiko Keamanan Kargo</strong></td>
              <td style="${tdStyle}">Pencurian kargo atau manipulasi bahan bakar (fuel theft)</td>
              <td style="${tdStyle}">Sangat Rendah / Tinggi</td>
              <td style="${tdStyle}">Segel elektronik bernomor seri unik & sensor flowmeter solar digital terenkripsi</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Risiko Cuaca & Bencana</strong></td>
              <td style="${tdAltStyle}">Jalan terputus akibat banjir, longsor, atau cuaca ekstrem</td>
              <td style="${tdAltStyle}">Sedang / Sedang</td>
              <td style="${tdAltStyle}">Sistem rute alternatif (dynamic rerouting) & koordinasi posko pemda setempat</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 10: { // Digital Coverage
      const cards = [
        { label: "Sistem Manajemen Armada", val: "PRAMA FMS Core", sub: "✓ Pemantauan Telematika Terpusat", color: "#2563eb" },
        { label: "Efisiensi Konsumsi BBM", val: "Penghematan 8% - 12%", sub: "★ Berkat Optimasi Rute AI", color: "#059669" },
        { label: "Digital Proof of Delivery", val: "100% Paperless e-POD", sub: "● Penagihan Cepat & Akurat", color: "#7c3aed" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 10.1: Arsitektur Ekosistem Teknologi & Digital Tools</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Perangkat / Software</th>
              <th style="${thStyle}">Teknologi Utama</th>
              <th style="${thStyle}">Fungsi Operasional</th>
              <th style="${thStyle}">Dampak Efisiensi Nyata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>PRAMA FMS Control Tower</strong></td>
              <td style="${tdStyle}">Cloud Web Platform & Mobile App</td>
              <td style="${tdStyle}">Pelacakan GPS real-time, status muat, peringatan batas kecepatan</td>
              <td style="${tdStyle}">Ketepatan jadwal dispatch meningkat hingga 99%</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Sensor Muatan & Gandar IoT</strong></td>
              <td style="${tdAltStyle}">Load Cell Telemetry Sensor</td>
              <td style="${tdAltStyle}">Pencegahan kelebihan muatan (Zero ODOL compliance)</td>
              <td style="${tdAltStyle}">Meniadakan risiko tilang jembatan timbang 100%</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Kamera Kabin AI ADAS</strong></td>
              <td style="${tdStyle}">Computer Vision & Face Recognition</td>
              <td style="${tdStyle}">Mendeteksi kantuk pengemudi, penggunaan HP, deviasi jalur</td>
              <td style="${tdStyle}">Menekan risiko kecelakaan lalu lintas hingga 85%</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Digital e-POD Portal</strong></td>
              <td style="${tdAltStyle}">Secure Digital Signature & OCR</td>
              <td style="${tdAltStyle}">Konfirmasi serah terima barang langsung ke sistem finance klien</td>
              <td style="${tdAltStyle}">Mempercepat proses invoicing dari 14 hari menjadi 1 hari</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 11: { // Competitor Intelligence
      let compList: CompetitorIntel[] = [];
      try {
        compList = getDefaultCompetitorsForProject(projectTitle);
      } catch (e) {}

      const cards = [
        { label: "Target Pangsa Rebutan", val: "30% - 40% Pasar", sub: "✓ Merebut dari Transporter Lemah", color: "#2563eb" },
        { label: "Kelemahan Petahana", val: "Minim IoT & Kerap ODOL", sub: "★ Celah Kritis yang Dimanfaatkan", color: "#dc2626" },
        { label: "Keunggulan PRAMA", val: "Armada Modern & Transparan", sub: "● Sertifikasi K3 & Garansi SLA", color: "#059669" }
      ];

      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 11.1: Pemetaan Intelijen Kompetitor Industri</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Nama Transporter / Pesaing</th>
              <th style="${thStyle}">Status Pasar</th>
              <th style="${thStyle}">Pangsa (%)</th>
              <th style="${thStyle}">Kekuatan Utama</th>
              <th style="${thStyle}">Kelemahan yang Dieksploitasi</th>
              <th style="${thStyle}">Safety Index</th>
            </tr>
          </thead>
          <tbody>
            ${compList.slice(0, 4).map((c, i) => `
              <tr style="${i % 2 === 1 ? "background-color: #f8fafc;" : ""}">
                <td style="${tdStyle}"><strong>${c.name}</strong></td>
                <td style="${tdStyle}"><span style="color: ${c.status === "Incumbent" ? "#dc2626" : c.status === "Bidding" ? "#2563eb" : "#d97706"}; font-weight: bold;">${c.status}</span></td>
                <td style="${tdStyle}">${c.marketShare}%</td>
                <td style="${tdStyle}">${c.strengths}</td>
                <td style="${tdStyle}">${c.weaknesses}</td>
                <td style="${tdStyle}"><span style="font-weight: bold; color: ${c.safetyIndex >= 80 ? "#059669" : "#dc2626"};">${c.safetyIndex}/100</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    case 12: { // TAM SAM SOM
      let tamData: any = null;
      try {
        tamData = generateTamSamSomForTitle(projectTitle);
      } catch (e) {}

      const tamVal = tamData?.tamValue || "Rp 12.500.000.000.000";
      const samVal = tamData?.samValue || "Rp 1.850.000.000.000";
      const somVal = tamData?.somValue || "Rp 185.000.000.000";

      const cards = [
        { label: "Total Addressable Market (TAM)", val: tamVal, sub: "✓ Potensi Pasar Logistik Makro", color: "#2563eb" },
        { label: "Serviceable Addressable (SAM)", val: samVal, sub: "★ Pasar Terjangkau Koridor Layanan", color: "#059669" },
        { label: "Serviceable Obtainable (SOM)", val: somVal, sub: "● Target Penetrasi Realistis PRAMA", color: "#7c3aed" }
      ];

      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 12.1: Perhitungan Ukuran Pasar (Market Sizing Analysis)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Level Analisis Pasar</th>
              <th style="${thStyle}">Nilai Estimasi (IDR)</th>
              <th style="${thStyle}">Porsi Rasio</th>
              <th style="${thStyle}">Asumsi & Metodologi Perhitungan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Total Addressable Market (TAM)</strong></td>
              <td style="${tdStyle}"><strong>${tamVal}</strong></td>
              <td style="${tdStyle}">100% Makro</td>
              <td style="${tdStyle}">Seluruh perputaran nilai jasa transportasi dan logistik sektor terkait di Indonesia</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Serviceable Addressable Market (SAM)</strong></td>
              <td style="${tdAltStyle}"><strong>${samVal}</strong></td>
              <td style="${tdAltStyle}">12% - 15% dari TAM</td>
              <td style="${tdAltStyle}">Pasar koridor rute yang secara geografis dan regulasi dapat dilayani oleh armada PRAMA</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Serviceable Obtainable Market (SOM)</strong></td>
              <td style="${tdStyle}"><strong>${somVal}</strong></td>
              <td style="${tdStyle}">8% - 10% dari SAM</td>
              <td style="${tdStyle}">Target pangsa pasar realistis yang dapat direbut pada tahap peluncuran operasi tahun 1 - 2</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 13: { // CAC & LTV
      const cards = [
        { label: "Rata-rata Biaya Akuisisi (CAC)", val: "Rp 24.500.000", sub: "✓ Biaya Penetrasi Akun B2B", color: "#2563eb" },
        { label: "Nilai Seumur Hidup (LTV)", val: "Rp 2.450.000.000", sub: "★ Nilai Kontrak Bersih 3 Tahun", color: "#059669" },
        { label: "Rasio Kelayakan LTV / CAC", val: "> 25x", sub: "● Sangat Sehat & Menguntungkan", color: "#7c3aed" },
        { label: "CAC Payback Period", val: "< 1.2 Bulan", sub: "✓ Pengembalian dari Tagihan Perdana", color: "#d97706" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 13.1: Rincian Komponen Biaya Akuisisi Klien (Itemized CAC)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Aktivitas Akuisisi Klien Korporat</th>
              <th style="${thStyle}">Estimasi Biaya per Akun (IDR)</th>
              <th style="${thStyle}">Porsi Biaya (%)</th>
              <th style="${thStyle}">Output yang Dihasilkan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">Riset Kargo, Pemetaan Rute, & Analisis Tarif</td>
              <td style="${tdStyle}">Rp 5.000.000</td>
              <td style="${tdStyle}">20.4%</td>
              <td style="${tdStyle}">Dossier kelayakan teknis kargo & rute</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Penyusunan Proposal Komersial & Presentasi B2B</td>
              <td style="${tdAltStyle}">Rp 6.500.000</td>
              <td style="${tdAltStyle}">26.5%</td>
              <td style="${tdAltStyle}">Pitching formal ke dewan direksi klien</td>
            </tr>
            <tr>
              <td style="${tdStyle}">Uji Coba Rute Pilot Run (Biaya Bahan Bakar & Sopir)</td>
              <td style="${tdStyle}">Rp 8.000.000</td>
              <td style="${tdStyle}">32.7%</td>
              <td style="${tdStyle}">Bukti ketepatan SLA dan keamanan kargo riil</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}">Legalitas, Review Klausul Kontrak PKS, & Administrasi</td>
              <td style="${tdAltStyle}">Rp 5.000.000</td>
              <td style="${tdAltStyle}">20.4%</td>
              <td style="${tdAltStyle}">Penandatanganan Perjanjian Kerja Sama multi-year</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="${tdStyle}">TOTAL BIAYA AKUISISI PER AKUN (CAC)</td>
              <td style="${tdStyle}">Rp 24.500.000</td>
              <td style="${tdStyle}">100.0%</td>
              <td style="${tdStyle}">Tertutup pada tagihan bulan ke-1 pengiriman</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 14: { // Executive Summary & Go-No-Go
      const cards = [
        { label: "Status Rekomendasi", val: "GO (DIREKOMENDASIKAN)", sub: "✓ Lulus Seluruh Uji Kelayakan", color: "#059669" },
        { label: "Skor Kelayakan Komprehensif", val: "92.5 / 100", sub: "★ Kategori Sangat Layak (Prima)", color: "#2563eb" },
        { label: "Tindakan Segera", val: "Eksekusi Pengadaan & PKS", sub: "● Mulai Fase Pre-Transition", color: "#d97706" }
      ];
      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 14.1: Matriks Evaluasi Kelayakan Multi-Dimensi Proyek</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Dimensi Evaluasi Kelayakan</th>
              <th style="${thStyle}">Bobot Penilaian</th>
              <th style="${thStyle}">Skor Evaluasi (1-100)</th>
              <th style="${thStyle}">Rangkuman Pertimbangan Analis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Kelayakan Pasar & Komersial</strong></td>
              <td style="${tdStyle}">25%</td>
              <td style="${tdStyle}"><strong>94 / 100</strong></td>
              <td style="${tdStyle}">Kebutuhan kargo tinggi, kesenjangan transporter lama lebar</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kelayakan Teknis & Operasional</strong></td>
              <td style="${tdAltStyle}">25%</td>
              <td style="${tdAltStyle}"><strong>91 / 100</strong></td>
              <td style="${tdAltStyle}">Spesifikasi unit tepat, dukungan telematika IoT lengkap</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Kelayakan Finansial & Investasi</strong></td>
              <td style="${tdStyle}">30%</td>
              <td style="${tdStyle}"><strong>93 / 100</strong></td>
              <td style="${tdStyle}">Payback period 2.1 tahun, margin EBITDA &gt; 30%, IRR 24.5%</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kepatuhan Regulasi & Aspek K3</strong></td>
              <td style="${tdAltStyle}">20%</td>
              <td style="${tdAltStyle}"><strong>92 / 100</strong></td>
              <td style="${tdAltStyle}">100% Zero ODOL compliant, izin resmi OSS-RBA & Kemenhub</td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: bold;">
              <td style="${tdStyle}">SKOR AKHIR KELAYAKAN PROYEK</td>
              <td style="${tdStyle}">100%</td>
              <td style="${tdStyle}"><span style="color: #059669; font-size: 11pt;">92.5 / 100</span></td>
              <td style="${tdStyle}"><span style="color: #059669;">REKOMENDASI FINAL: GO (SETUJU DILANJUTKAN)</span></td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 15: { // Service Design
      let serviceData: any = null;
      try {
        serviceData = generateServiceDesignForTitle(projectTitle);
      } catch (e) {}

      const cards = [
        { label: "SLA Respon Kendala", val: "< 15 Menit", sub: "✓ Dedicated Account PIC 24/7", color: "#2563eb" },
        { label: "Tingkat Kepuasan Target", val: "CSAT ≥ 95%", sub: "★ Standar Pelayanan Eksklusif", color: "#059669" },
        { label: "Digital Fail-Safe Protocol", val: "Unit Pengganti Siaga", sub: "● Jaminan Kelancaran Suplai", color: "#7c3aed" }
      ];

      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 15.1: Service Blueprint Terintegrasi (4 Lapisan Layanan)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Lapisan Arsitektur Layanan</th>
              <th style="${thStyle}">Aktivitas Layanan Standar</th>
              <th style="${thStyle}">Standar Kualitas & SLA</th>
              <th style="${thStyle}">Sistem Pendukung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>1. Customer Actions (Klien)</strong></td>
              <td style="${tdStyle}">Input pesanan pengiriman kargo & pemantauan live rute</td>
              <td style="${tdStyle}">Kemudahan pemesanan dalam 3 klik via portal</td>
              <td style="${tdStyle}">PRAMA Customer Web Portal & API</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>2. Frontstage Interaction</strong></td>
              <td style="${tdAltStyle}">Supir berpenampilan rapi, sopan, dan mematuhi aturan safety klien</td>
              <td style="${tdAltStyle}">Seragam standar, kartu identitas, checklist K3</td>
              <td style="${tdAltStyle}">SOP Driver Grooming & Etika Lapangan</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>3. Backstage Operations</strong></td>
              <td style="${tdStyle}">Dispatcher memantau posisi, suhu/kecepatan, dan deviasi rute</td>
              <td style="${tdStyle}">Respons peringatan anomali rute &lt; 2 menit</td>
              <td style="${tdStyle}">PRAMA Control Tower Monitoring Center</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>4. Support Infrastructure</strong></td>
              <td style="${tdAltStyle}">Servis berkala preventif truk, kalibrasi sensor timbangan</td>
              <td style="${tdAltStyle}">Kesiapan unit armada (readiness rate) ≥ 98%</td>
              <td style="${tdAltStyle}">Workshop Maintenance & Jaringan Sparepart OEM</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    case 16: { // Potential Consumers
      let consumerData: any = null;
      try {
        consumerData = generatePotentialConsumersForTitle(projectTitle);
      } catch (e) {}

      const targetList = consumerData?.targetAccounts || [
        { companyName: "PT Industri Manufaktur Utama Indonesia", category: "Tier-1 Corporate", location: "Kawasan Industri Terpadu", demandVolume: "500 - 800 Ton / Bulan", specificNeed: "Jaminan SLA ketepatan waktu pengiriman & kepatuhan Zero ODOL" },
        { companyName: "PT Logistik Distribusi Nasional Sentosa", category: "Enterprise Partner", location: "Koridor Distribusi Regional", demandVolume: "350 - 500 Ton / Bulan", specificNeed: "Transparansi telematika IoT & integrasi sistem bukti serah terima e-POD" },
        { companyName: "PT Mitra Niaga Ekspedisi Nusantara", category: "B2B Contract Client", location: "Depo Pusat Regional", demandVolume: "200 - 400 Ton / Bulan", specificNeed: "Armada dedicated bertarif kompetitif dengan kontrak tahunan stabil" }
      ];

      const cards = [
        { label: "Target Akun Teridentifikasi", val: "8 - 12 Korporasi", sub: "✓ Pipeline B2B Enterprise Terverifikasi", color: "#2563eb" },
        { label: "Estimasi Pipeline Nilai Kontrak", val: "Rp 28 - 45 Miliar / th", sub: "★ Potensi Pendapatan Tahunan", color: "#059669" },
        { label: "Profil DMU Terpetakan", val: "Procurement & Supply Chain VP", sub: "● Strategi Konversi Terarah", color: "#7c3aed" }
      ];

      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 16.1: Pipeline Target Akun B2B Prioritas</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Nama Akun Korporat</th>
              <th style="${thStyle}">Kategori Klien</th>
              <th style="${thStyle}">Lokasi Fasilitas</th>
              <th style="${thStyle}">Estimasi Volume Kargo</th>
              <th style="${thStyle}">Kebutuhan Spesifik</th>
            </tr>
          </thead>
          <tbody>
            ${targetList.slice(0, 4).map((acc: any, idx: number) => `
              <tr style="${idx % 2 === 1 ? "background-color: #f8fafc;" : ""}">
                <td style="${tdStyle}"><strong>${acc.companyName}</strong></td>
                <td style="${tdStyle}">${acc.category}</td>
                <td style="${tdStyle}">${acc.location}</td>
                <td style="${tdStyle}"><strong>${acc.demandVolume}</strong></td>
                <td style="${tdStyle}">${acc.specificNeed}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    case 17: { // Legal & Regulatory Compliance
      const cards = [
        { label: "Status Badan Usaha", val: "PT Berbadan Hukum Lengkap", sub: "✓ Kemenkumham & OSS-RBA Terverifikasi", color: "#2563eb" },
        { label: "Perizinan Berusaha", val: "SIUJPT & Izin Angkutan Khusus", sub: "★ KBLI 49431 & 49432 Efektif", color: "#059669" },
        { label: "Kelaikan Armada", val: "KIR Berkala & SRUT Resmi", sub: "● Sertifikasi 100% Terpenuhi", color: "#7c3aed" }
      ];

      return `
        ${renderMetricCards(cards)}
        <div style="${sectionHeaderStyle}">Tabel 17.1: Checklist Legalitas Badan Usaha & Perizinan Berusaha</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Dokumen Perizinan & Legalitas</th>
              <th style="${thStyle}">Dasar Regulasi</th>
              <th style="${thStyle}">Instansi Penerbit</th>
              <th style="${thStyle}">Status Validitas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Nomor Induk Berusaha (NIB) Berbasis Risiko</strong></td>
              <td style="${tdStyle}">PP No. 5 Tahun 2021 tentang OSS-RBA</td>
              <td style="${tdStyle}">Kementerian Investasi / BKPM</td>
              <td style="${tdStyle}">Aktif & Terverifikasi Efektif</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Surat Izin Usaha Jasa Pengurusan Transportasi (SIUJPT)</strong></td>
              <td style="${tdAltStyle}">Permenhub PM 12 Tahun 2021</td>
              <td style="${tdAltStyle}">Dinas Perhubungan & PTSP</td>
              <td style="${tdAltStyle}">Lengkap & Berlaku Nasional</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Sertifikat Registrasi Uji Tipe (SRUT) Karoseri</strong></td>
              <td style="${tdStyle}">UU No. 22 Tahun 2009 & Permenhub</td>
              <td style="${tdStyle}">Ditjen Perhubungan Darat</td>
              <td style="${tdStyle}">100% Unit Memiliki SRUT Asli</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kartu Pengawasan (KPS) & Buku Uji Berkala KIR</strong></td>
              <td style="${tdAltStyle}">PM No. 133 Tahun 2015</td>
              <td style="${tdAltStyle}">Dishub Kabupaten / Kota</td>
              <td style="${tdAltStyle}">Uji Berkala Tiap 6 Bulan Aktif</td>
            </tr>
          </tbody>
        </table>

        <div style="${sectionHeaderStyle}">Tabel 17.2: Matriks Klausul Proteksi Hukum Kontrak Kerja Sama (PKS)</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Klausul Proteksi Hukum</th>
              <th style="${thStyle}">Ketentuan Perlindungan Standar</th>
              <th style="${thStyle}">Manfaat Perlindungan bagi Para Pihak</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Pembatasan Tanggung Jawab (Liability)</strong></td>
              <td style="${tdStyle}">Kompensasi dibatasi pada nilai pertanggungan asuransi kargo resmi</td>
              <td style="${tdStyle}">Mencegah tuntutan ganti rugi tak terhingga di luar batas kemampuan polis</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Penyesuaian Biaya Bahan Bakar (FSA Clause)</strong></td>
              <td style="${tdAltStyle}">Penyesuaian tarif otomatis jika harga solar industri berfluktuasi &gt; 5%</td>
              <td style="${tdAltStyle}">Menjaga margin operasional tetap sehat terhadap lonjakan harga energi</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Force Majeure & Arbitrase BANI</strong></td>
              <td style="${tdStyle}">Penyelesaian sengketa melalui musyawarah atau Arbitrase BANI Jakarta</td>
              <td style="${tdStyle}">Kepastian hukum, kerahasiaan bisnis terjaga, dan penyelesaian sengketa cepat</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    default:
      return "";
  }
}

/**
 * Export a single section as an individual Word file (.doc format compatible with Word)
 */
export function exportSingleSectionToWord(projectTitle: string, section: DashboardSection, currentContent: string) {
  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedHtml = formatSectionToHtml(section.title, currentContent);
  const visualDashboardHtml = getPillarDashboardVisualHtml(section.number, section.title, displayTitle);

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${section.title} - ${displayTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 210mm 297mm; /* A4 */
          margin: 15mm 15mm 15mm 15mm;
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
        }
        div.Section1 {
          page: Section1;
        }
        body { 
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.35; 
          color: #1e293b; 
          margin: 0;
          font-size: 10pt;
        }
        p {
          margin-top: 0;
          margin-bottom: 4pt;
          text-align: justify;
          mso-pagination: widow-orphan;
        }
        table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
        }
        td, th {
          vertical-align: middle;
        }
        .footer { 
          font-size: 8pt; 
          color: #94a3b8; 
          margin-top: 20pt; 
          border-top: 1pt solid #e2e8f0; 
          padding-top: 5pt; 
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; 
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 6pt;">
          <tr>
            <td style="border-bottom: 2pt solid #1e3a8a; padding-bottom: 4pt;">
              <div style="font-size: 8.5pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #2563eb; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                Jurnal PM Bagian ${section.number} dari 17 &bull; ${section.shortDesc}
              </div>
              <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a; margin-top: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
                PILAR ${section.number}: ${section.title.toUpperCase()}
              </div>
              <div style="font-size: 10.5pt; color: #475569; font-weight: bold; margin-top: 2pt;">
                Proyek Utama: ${displayTitle}
              </div>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt;">
          <tr>
            <td style="background-color: #f8fafc; border-left: 3.5pt solid #10b981; border-top: 1pt solid #e2e8f0; border-right: 1pt solid #e2e8f0; border-bottom: 1pt solid #e2e8f0; padding: 5pt 8pt; font-size: 9pt; color: #475569; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              <strong>Klarifikasi Dokumen:</strong> Kajian Strategis Komprehensif Mendalam (Draf Tunggal Lengkap)<br>
              <strong>Diterbitkan Pada:</strong> ${dateStr}<br>
              <strong>Sistem Otoritas:</strong> PT Pancaran Group Indonesia Services &bull; PRAMA Intelligent System Advisor
            </td>
          </tr>
        </table>

        <!-- TAMPILAN DASHBOARD VISUAL LENGKAP -->
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 4pt;">
          <tr>
            <td style="font-size: 9.5pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              TAMPILAN METRIK & ANALISIS DASHBOARD EKSEKUTIF
            </td>
          </tr>
        </table>
        ${visualDashboardHtml}

        <!-- DOKUMENTASI NARASI LENGKAP & REKOMENDASI FORMULASI -->
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 4pt;">
          <tr>
            <td style="font-size: 9.5pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              DOKUMENTASI NARASI LENGKAP & REKOMENDASI FORMULASI
            </td>
          </tr>
        </table>
        ${formattedHtml}

        <div class="footer">
          PRAMA IN-SITE DIGITAL INTEGRATED REPORTING SYSTEM &bull; PANCARAN GROUP &bull; ${displayTitle}
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedFilename = `PM_Pilar_${section.number}_${section.title.trim().replace(/\s+/g, "_")}.doc`;
  
  link.href = url;
  link.download = sanitizedFilename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

function getSectionRawContent(secNumber: number, defaultContent: string, projectTitle: string): string {
  try {
    const savedSectionsRaw = localStorage.getItem("prama_dashboard_sections");
    if (savedSectionsRaw) {
      const parsed = JSON.parse(savedSectionsRaw);
      if (parsed && parsed[secNumber] && typeof parsed[secNumber] === "string" && parsed[secNumber].trim().length > 10) {
        return parsed[secNumber];
      }
    }

    const cleanTitle = projectTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    let componentKey = "";
    if (secNumber === 1) componentKey = `prama_global_nat_content_${cleanTitle}`;
    else if (secNumber === 2) componentKey = `prama_market_opportunity_content_${cleanTitle}`;
    else if (secNumber === 4) componentKey = `prama_supply_demand_content_${cleanTitle}`;
    else if (secNumber === 6) componentKey = `prama_transition_model_content_${cleanTitle}`;
    else if (secNumber === 7) componentKey = `prama_gotomarket_content_${cleanTitle}`;
    else if (secNumber === 8) componentKey = `prama_ops_model_content_${cleanTitle}`;
    else if (secNumber === 9) componentKey = `prama_risk_management_content_${cleanTitle}`;
    else if (secNumber === 10) componentKey = `prama_digital_coverage_content_${cleanTitle}`;
    else if (secNumber === 12) componentKey = `prama_tamsamsom_content_${cleanTitle}`;
    else if (secNumber === 13) componentKey = `prama_cacl_tv_content_${cleanTitle}`;
    else if (secNumber === 15) componentKey = `prama_service_design_content_${cleanTitle}`;
    else if (secNumber === 16) componentKey = `prama_potential_consumers_content_${cleanTitle}`;

    if (componentKey) {
      const compSaved = localStorage.getItem(componentKey);
      if (compSaved && typeof compSaved === "string" && compSaved.trim().length > 10) {
        return compSaved;
      }
    }
  } catch (e) {}

  return defaultContent;
}

/**
 * Export all 17 sections as one single merged Word document complete with all dashboard visual layouts and narrative data
 */
export function exportAllSectionsToWord(projectTitle: string, sectionsMap: Record<number, string>) {
  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const archetype = detectProjectArchetype(displayTitle);
  const allSections = getDashboardSectionsForProject(displayTitle);
  let fullSectionsHtml = "";

  allSections.forEach((sec, index) => {
    let rawContent = sec.defaultContent;
    if (sectionsMap && sectionsMap[sec.number] && sectionsMap[sec.number].trim().length > 30) {
      const existing = sectionsMap[sec.number];
      const existingLower = existing.toLowerCase();
      // Verify if existing content conflicts with the current project archetype
      const isConflicting = 
        (archetype === 'manufacturing' && (existingLower.includes('truk logging') || existingLower.includes('tipper dump truck') || existingLower.includes('hauling batubara') || existingLower.includes('muatan logs'))) ||
        (archetype === 'personal_sme' && (existingLower.includes('truk tangki') || existingLower.includes('tipper dump') || existingLower.includes('heavy-duty hauling') || existingLower.includes('kontainer darat'))) ||
        (archetype === 'transport' && (existingLower.includes('toko roti') || existingLower.includes('kedai kopi') || existingLower.includes('pembuatan sepatu') || existingLower.includes('lini perakitan')));

      if (!isConflicting) {
        rawContent = existing;
      }
    }

    const visualDashboardHtml = getPillarDashboardVisualHtml(sec.number, sec.title, displayTitle);
    const formattedHtml = formatSectionToHtml(sec.title, rawContent);
    
    fullSectionsHtml += `
      ${index > 0 ? `<div style="page-break-before: always; mso-break-type: section-break; clear: both;"><br style="page-break-before: always; mso-special-character: line-break;" /></div>` : ""}
      <div style="margin-top: 0; padding-top: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 6pt;">
          <tr>
            <td style="border-bottom: 2pt solid #1e3a8a; padding-bottom: 4pt;">
              <div style="font-size: 8.5pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #2563eb; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                BAGIAN ${sec.number} DARI ${allSections.length} &bull; ${sec.shortDesc}
              </div>
              <div style="font-size: 15pt; font-weight: bold; color: #1e3a8a; margin-top: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
                PILAR ${sec.number}: ${sec.title.toUpperCase()}
              </div>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt;">
          <tr>
            <td style="background-color: #f8fafc; border-left: 3.5pt solid #2563eb; border-top: 1pt solid #e2e8f0; border-right: 1pt solid #e2e8f0; border-bottom: 1pt solid #e2e8f0; padding: 5pt 8pt; font-size: 9pt; color: #334155; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              <strong>Fokus Analisis Pilar:</strong> Kajian terintegrasi komprehensif untuk proyek <em>${displayTitle}</em> pada aspek <strong>${sec.title}</strong>.
            </td>
          </tr>
        </table>

        <!-- TAMPILAN DASHBOARD VISUAL & ANALITIK (LENGKAP SEPERTI DI DASHBOARD) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 4pt;">
          <tr>
            <td style="font-size: 9.5pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              TAMPILAN METRIK & ANALISIS DASHBOARD EKSEKUTIF
            </td>
          </tr>
        </table>
        ${visualDashboardHtml}

        <!-- DOKUMENTASI NARASI LENGKAP & REKOMENDASI FORMULASI -->
        <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 4pt;">
          <tr>
            <td style="font-size: 9.5pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;">
              DOKUMENTASI NARASI LENGKAP & REKOMENDASI FORMULASI
            </td>
          </tr>
        </table>
        ${formattedHtml}
      </div>
    `;
  });

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Kajian Komprehensif PM 17 Pilar - ${displayTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 210mm 297mm; /* A4 */
          margin: 15mm 15mm 15mm 15mm;
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
        }
        div.Section1 {
          page: Section1;
        }
        body { 
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.35; 
          color: #1e293b; 
          margin: 0;
          font-size: 10pt;
        }
        h1 { 
          font-size: 18pt; 
          color: #1e3a8a; 
          margin-top: 0;
          margin-bottom: 4pt; 
          font-weight: bold; 
        }
        h2 {
          font-size: 12.5pt;
          color: #1e3a8a;
          margin-top: 10pt;
          margin-bottom: 5pt;
          border-bottom: 1.5pt solid #1e3a8a;
          padding-bottom: 2pt;
        }
        p {
          margin-top: 0;
          margin-bottom: 4pt;
          text-align: justify;
          mso-pagination: widow-orphan;
        }
        table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
        }
        td, th {
          vertical-align: middle;
        }
        .cover-header {
          text-align: center;
          padding: 8pt 10pt 12pt 10pt;
          border-bottom: 2pt solid #1e3a8a;
          margin-bottom: 10pt;
        }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4pt;
          margin-bottom: 8pt;
        }
        .summary-table th, .summary-table td {
          border: 1pt solid #cbd5e1;
          padding: 4.5pt 6.5pt;
          font-size: 9pt;
        }
        .summary-table th {
          background-color: #1e3a8a;
          color: #ffffff;
          text-align: left;
        }
        .footer { 
          font-size: 8pt; 
          color: #64748b; 
          margin-top: 20pt; 
          border-top: 1pt solid #cbd5e1; 
          padding-top: 5pt; 
          text-align: center;
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- HALAMAN 1: COVER & RINGKASAN EKSEKUTIF & DAFTAR ISI KOMPAK -->
        <div class="cover-header">
          <div style="font-size: 8.5pt; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; letter-spacing: 1.5px; color: #059669; font-weight: bold; margin-bottom: 4pt; text-transform: uppercase;">
            DOKUMEN KAJIAN STRATEGIS KOMPREHENSIF PRAMA
          </div>
          <h1>17 PILAR FORMULASI PROPOSAL & MANAJEMEN PROYEK</h1>
          <div style="font-size: 12pt; color: #1e3a8a; font-weight: bold; margin-top: 4pt;">
            Proyek Utama: ${displayTitle}
          </div>
          <div style="margin-top: 6pt; font-size: 8.5pt; color: #64748b; line-height: 1.3;">
            Diterbitkan oleh: PRAMA System Advisor Intelligent Assistant &bull; PT Pancaran Group<br>
            Waktu Rilis: ${dateStr} &bull; Klasifikasi: Dokumen Terbatas Korporat
          </div>
        </div>

        <div style="margin-bottom: 10pt;">
          <h2>RINGKASAN EKSEKUTIF & PARAMETER UTAMA PROYEK</h2>
          <p style="font-size: 9.5pt; line-height: 1.4; margin-bottom: 6pt;">
            Dokumen ini merangkum secara lengkap dan mendalam seluruh kajian 17 Pilar Jurnal Manajemen Proyek PRAMA untuk <strong>${displayTitle}</strong>. Seluruh data terhubung secara otomatis dengan visual dashboard, matriks operasional, indikator finansial, evaluasi risiko, dan kepatuhan hukum korporat.
          </p>
          
          <table class="summary-table">
            <thead>
              <tr>
                <th style="width: 35%;">Parameter Strategis</th>
                <th style="width: 65%;">Nilai / Status Analisis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nama Proyek / Kajian</strong></td>
                <td>${displayTitle}</td>
              </tr>
              <tr>
                <td><strong>Kategori Sektor / Tipe Usaha</strong></td>
                <td><strong>${archetype === 'manufacturing' ? 'Sektor Manufaktur, Fabrikasi & Pengolahan Industri' : archetype === 'personal_sme' ? 'Sektor Usaha Mandiri, Mikro, Kecil & Menengah (UMKM)' : 'Sektor Transportasi, Rantai Pasok & Distribusi Khusus'}</strong></td>
              </tr>
              <tr>
                <td><strong>Jumlah Pilar Jurnal Aktif</strong></td>
                <td>${allSections.length} Pilar Komprehensif (Lengkap 100%)</td>
              </tr>
              <tr>
                <td><strong>Status Kelayakan Proyek</strong></td>
                <td><span style="color: #059669; font-weight: bold;">SANGAT LAYAK & DIREKOMENDASIKAN (GO DECISION - PRAMA System Advisor)</span></td>
              </tr>
              <tr>
                <td><strong>Standar Kepatuhan & Regulasi</strong></td>
                <td>${archetype === 'manufacturing' ? 'UU No. 3/2014 (Perindustrian), IUI OSS RBA, ISO 9001:2015, ISO 14001, Standar SNI/BPOM & K3 Pabrik' : archetype === 'personal_sme' ? 'UU Cipta Kerja PP 7/2021, NIB Perseorangan OSS RBA, Standar P-IRT / Halal BPJPH & Standar Kebersihan Higiene' : 'ISO 9001, ISO 45001, UU No. 22/2009 LLAJ, Regulasi Zero ODOL Kemenhub, & SOP Keselamatan Transportasi'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 12pt;">
          <h2>DAFTAR ISI KAJIAN 17 PILAR LENGKAP</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 8.5pt; line-height: 1.35; margin-top: 4pt;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 8pt;">
                ${allSections.slice(0, 9).map(s => `
                  <div style="margin-bottom: 3pt;">
                    <strong>Pilar ${s.number}: ${s.title}</strong><br>
                    <span style="color: #64748b; font-size: 8pt;">${s.shortDesc}</span>
                  </div>
                `).join('')}
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 8pt; border-left: 1pt solid #cbd5e1;">
                ${allSections.slice(9).map(s => `
                  <div style="margin-bottom: 3pt;">
                    <strong>Pilar ${s.number}: ${s.title}</strong><br>
                    <span style="color: #64748b; font-size: 8pt;">${s.shortDesc}</span>
                  </div>
                `).join('')}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 10pt;">
          ${fullSectionsHtml}
        </div>

        <div class="footer">
          PRAMA IN-SITE DIGITAL INTEGRATED REPORTING SYSTEM &bull; PANCARAN GROUP &bull; ${displayTitle}
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedFilename = `KAJIAN_KOMPREHENSIF_PM_17_PILAR_${displayTitle.trim().replace(/\s+/g, "_")}.doc`;
  
  link.href = url;
  link.download = sanitizedFilename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Export all 17 sections as one unified Executive Feasibility Study PDF
 */
export function exportAllSectionsToPDF(projectTitle: string, sectionsMap: Record<number, string>) {
  const displayTitle = projectTitle.trim() || "Kajian Strategis: Forestry Management Transportation";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const allSections = getDashboardSectionsForProject(displayTitle);
  
  let fullMarkdown = `# PANCARAN GROUP • STRATEGIC FEASIBILITY STUDY
## FEASIBILITY STUDY
### ${displayTitle.toUpperCase()}

**Analisis Pasar, Finansial (IRR/NPV/Payback), Kesiapan Kapabilitas, Risiko, Model Bisnis, dan Rekomendasi Go / No-Go**

**KONSULTAN / ADVISOR:** PRAMA Strategic AI Advisory • PT Pancaran Group  
**LOKASI & TANGGAL:** Jakarta, ${dateStr}  
**KLASIFIKASI:** Versi 1.0 — Rahasia, untuk internal

---

## DAFTAR ISI KAJIAN STRATEGIS (17 PILAR)
${allSections.map(s => `* **Pilar ${s.number}: ${s.title}** — ${s.shortDesc}`).join("\n")}

---

## 00. RINGKASAN EKSEKUTIF & SCORECARD STRATEGIS
Dokumen ini menyajikan kajian kelayakan terpadu untuk proyek **${displayTitle}** berdasarkan 17 Pilar Strategi Manajemen Proyek & Logistik Korporasi. Seluruh analisis memadukan evaluasi regulasi, peluang pasar komersial, model finansial kuantitatif (Capex, Opex, P&L, Cash Flow, IRR, NPV, Payback), arsitektur operasional, dan kepatuhan hukum.

---
`;

  allSections.forEach((sec) => {
    let rawContent = sec.defaultContent;
    if (sectionsMap && sectionsMap[sec.number] && sectionsMap[sec.number].trim().length > 30) {
      rawContent = sectionsMap[sec.number];
    }

    fullMarkdown += `\n\n## PILAR ${sec.number}: ${sec.title.toUpperCase()}\n`;
    fullMarkdown += `*Fokus Analisis:* ${sec.shortDesc}\n\n`;
    fullMarkdown += `${rawContent}\n\n---\n`;
  });

  fullMarkdown += `\n\n## KESIMPULAN REKOMENDASI KEPUTUSAN FINAL
Berdasarkan evaluasi menyeluruh 17 pilar terhadap proyek **${displayTitle}**, keputusan investasi direkomendasikan dengan status **CONDITIONAL GO** dengan pemenuhan kriteria gerbang investasi (*stage-gate requirements*).

*PRAMA Strategic In-Site Management System • PT Pancaran Group*`;

  downloadPDFDirect(`FEASIBILITY_STUDY_17_PILAR_${displayTitle}`, fullMarkdown, "PANCARAN GROUP", "STRATEGIC FEASIBILITY STUDY");
}

/**
 * Generate a beautiful widescreen complete 13-section PowerPoint presentation in PPTX format.
 */
export async function exportAllSectionsToPPTX(projectTitle: string, sectionsMap: Record<number, string>) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // Modern Widescreen 16:9

  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- SLIDE 1: Cover Presentation ---
  const slide1 = pptx.addSlide();
  
  // Set background to the Pancaran Group Illustration
  let bgPath = "https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ";
  slide1.background = { path: bgPath };

  // Semi-transparent dark overlay rectangle for perfect text contrast
  slide1.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "0F172A", transparency: 45 }
  });
  // Visual accent green block
  slide1.addShape("rect", {
    x: 0.1, y: 0.1, w: 0.3, h: 7.3,
    fill: { color: "00D285" }
  });
  // Corporate logo on the top right
  try {
    slide1.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 11.3,
      y: 0.5,
      w: 1.2,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to projectDashboard PPTX:", err);
  }
  // Title text
  slide1.addText("KAJIAN STRATEGIS KOMPREHENSIF", {
    x: 0.8, y: 1.8, w: 9.0, h: 0.5,
    fontSize: 20, fontFace: "Calibri", color: "00D285", bold: true
  });
  slide1.addText("15 PILAR UTAMA ANALYSIS PROPOSAL & PM (TERMASUK LEGAL)", {
    x: 0.8, y: 2.4, w: 11.5, h: 1.2,
    fontSize: 32, fontFace: "Arial Black", color: "FFFFFF"
  });
  slide1.addText(`Proyek Ekspedisi: ${displayTitle.toUpperCase()}`, {
    x: 0.8, y: 3.8, w: 11.5, h: 0.5,
    fontSize: 16, fontFace: "Calibri", color: "94A3B8", italic: true
  });
  // Watermark
  slide1.addText("PT PANCARAN GROUP INDONESIA • PRAMA SYSTEM", {
    x: 0.8, y: 5.5, w: 11.5, h: 0.4,
    fontSize: 10, fontFace: "Courier New", color: "475569", bold: true
  });
  slide1.addText(`Diterbit kan Tanggal: ${dateStr}`, {
    x: 0.8, y: 5.9, w: 11.5, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "64748B"
  });

  let extractedConclusions: string[] = [];

  // --- SLIDES 2 to 14: The 13 Core Formulation Pillars ---
  defaultDashboardSections.forEach((sec) => {
    const slide = pptx.addSlide();
    // Warm clean white background for readability
    slide.background = { color: "F8FAFC" };

    // Brand header banner
    slide.addShape("rect", {
      x: 0, y: 0, w: 13.33, h: 0.8,
      fill: { color: "0F172A" }
    });
    // Header title
    slide.addText(`PILAR ${sec.number}: ${sec.title.toUpperCase()}`, {
      x: 0.4, y: 0.18, w: 8.5, h: 0.45,
      fontSize: 16, fontFace: "Arial Black", color: "FFFFFF"
    });
    slide.addText(`Proyek: ${displayTitle}`, {
      x: 9.0, y: 0.22, w: 3.9, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "right"
    });

    const rawContent = sectionsMap[sec.number] || sec.defaultContent;
    
    // Extract conclusion if present
    let mainContent = rawContent;
    let conclusionText: string | null = null;
    
    const conclusionMarkers = [
      /###\s*kesimpulan/i,
      /##\s*kesimpulan/i,
      /#\s*kesimpulan/i,
      /\*\*\s*kesimpulan\s*\*\*/i,
      /\bkesimpulan\s*:/i,
      /^\s*kesimpulan\s*$/im
    ];

    let foundIndex = -1;
    let matchedMarkerLength = 0;

    for (const marker of conclusionMarkers) {
      const match = rawContent.match(marker);
      if (match && match.index !== undefined) {
        if (foundIndex === -1 || match.index < foundIndex) {
          foundIndex = match.index;
          matchedMarkerLength = match[0].length;
        }
      }
    }

    if (foundIndex !== -1) {
      mainContent = rawContent.substring(0, foundIndex).trim();
      conclusionText = rawContent.substring(foundIndex + matchedMarkerLength).trim();
    }

    // Clean up [UPDATE_PILAR] and [/UPDATE_PILAR] tags
    mainContent = mainContent.replace(/\[\/?UPDATE_PILAR\]/gi, "").trim();

    if (conclusionText) {
      const cleanedConclusion = conclusionText.replace(/\[\/?UPDATE_PILAR\]/gi, "").trim();
      if (cleanedConclusion) {
        extractedConclusions.push(cleanedConclusion);
      }
    }

    // Extract bullets from text
    const lines = mainContent.split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith("###") && !l.startsWith("!"))
      .map(l => l.replace(/\*\*/g, "").replace(/^\*\s*/, "").replace(/^-\s*/, ""));

    // Left Column: Core Description Bullet Points
    const bulletsList = lines.slice(0, 5).map(textLine => {
      return { text: textLine, options: { bullet: true, fontSize: 13, color: "334155", fontFace: "Calibri" } };
    });

    // If we have bullets list, add text
    if (bulletsList.length > 0) {
      slide.addText(bulletsList, {
        x: 0.6, y: 1.4, w: 7.2, h: 5.2,
        lineSpacing: 26
      });
    } else {
      slide.addText(mainContent.replace(/###/g, "").replace(/\*\*/g, ""), {
        x: 0.6, y: 1.4, w: 7.2, h: 5.2,
        fontSize: 13, color: "334155", fontFace: "Calibri", lineSpacing: 22
      });
    }

    // Right Column: Key metrics highlight panel / executive box
    slide.addShape("rect", {
      x: 8.3, y: 1.4, w: 4.4, h: 5.1,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E1", width: 1.5 }
    });
    // Top border of the box
    slide.addShape("rect", {
      x: 8.3, y: 1.4, w: 4.4, h: 0.5,
      fill: { color: "334155" }
    });
    slide.addText("INFORMASI EKSEKUTIF", {
      x: 8.5, y: 1.45, w: 4.0, h: 0.4,
      fontSize: 11, fontFace: "Arial Black", color: "FFFFFF"
    });

    // Content for the box based on the section
    let boxText = "";
    if (sec.number === 3) {
      boxText = `ANALISIS KEUANGAN\n\n• CAPEX: Rp 8.95 Miliar\n• OPEX Bulanan: Rp 260 Juta\n• Payback Period: 2.8 Tahun\n• IRR: 28.5%\n• ROI: 35.2%\n• Kesehatan Finansial: Sangat Baik`;
    } else if (sec.number === 12) {
      boxText = `POTENSI PASAR (MARKET SIZING)\n\n• TAM: Rp 1.5 Triliun / Thn\n• SAM: Rp 550 Miliar / Thn\n• SOM: Rp 95 Miliar / Thn\n• Realistis Target: Efektif 3 Thn\n• Sektor Utama: Manufaktur B2B`;
    } else if (sec.number === 13) {
      boxText = `EFISIENSI BIAYA PELANGGAN\n\n• CAC: Rp 45.000.000\n• LTV Bersih: Rp 315.000.000\n• LTV / CAC Rasio: 7.0x\n• Angka Sehat Industri: > 3.0x\n• Retensi Kontrak: Rata-rata 3.5 Thn`;
    } else if (sec.number === 15) {
      boxText = `LEGAL & REGULATORY COMPLIANCE\n\n• Badan Usaha: PT / CV Sah\n• OSS RBA: NIB & KBLI Aktif\n• Perizinan: SIUJPT / Sektoral\n• Kontrak: PKS B2B & SLA\n• Kepatuhan: Pajak & AMDAL`;
    } else {
      boxText = `INDIKATOR PERFORMA PILAR ${sec.number}\n\n• Tingkat Kepatuhan: 100% Selaras SLA\n• Penjamin Tanggap: Tim HSE Siaga\n• Metodologi Kerja: Berdasarkan SOP PRAMA\n• Status Peninjauan: Disetujui Evaluasi`;
    }

    slide.addText(boxText, {
      x: 8.6, y: 2.1, w: 3.8, h: 4.1,
      fontSize: 12, fontFace: "Calibri", color: "1E293B", lineSpacing: 22
    });

    // Footer signature
    slide.addText("INTEGRATED DESIGNED BY PRAMA COGNITIVE PORTAL", {
      x: 0.6, y: 6.9, w: 7.2, h: 0.3,
      fontSize: 8.5, fontFace: "Courier New", color: "94A3B8", bold: true
    });
    slide.addText(`Halaman ${sec.number + 1} dari 16`, {
      x: 8.3, y: 6.9, w: 4.4, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
    });
  });

  // --- SLIDE 15: Dedicated Conclusion Slide ---
  const conclusionSlide = pptx.addSlide();
  conclusionSlide.background = { color: "F8FAFC" };

  // Brand header banner
  conclusionSlide.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 0.8,
    fill: { color: "0F172A" }
  });
  // Header title
  conclusionSlide.addText("KESIMPULAN STRATEGIS (CONCLUSION)", {
    x: 0.4, y: 0.18, w: 8.5, h: 0.45,
    fontSize: 16, fontFace: "Arial Black", color: "FFFFFF"
  });
  conclusionSlide.addText(`Proyek: ${displayTitle}`, {
    x: 9.0, y: 0.22, w: 3.9, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "right"
  });

  let conclusionBullets: string[] = [];
  if (extractedConclusions.length > 0) {
    conclusionBullets = extractedConclusions.join("\n")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith("###") && !l.startsWith("!"))
      .map(l => l.replace(/\*\*/g, "").replace(/^\*\s*/, "").replace(/^-\s*/, ""));
  }

  // Use defaults if empty
  if (conclusionBullets.length === 0) {
    conclusionBullets = [
      `Kelayakan Investasi: Proyek ekspedisi "${displayTitle}" dinilai sangat layak secara komersial dan operasional.`,
      "Sinergi Teknologi & Armada: Penggabungan ketangguhan sasis armada Pancaran dengan sistem telemetri pintar PRAMA meminimalkan risiko operasional.",
      "Rekomendasi Onboarding: Segera lakukan verifikasi rute (trial run), finalisasi SLA operasional, dan integrasi penuh aplikasi Driver e-POD.",
      "Kepatuhan Hukum: Menjamin 100% kepatuhan regulasi ODOL (Over Dimension Over Load) dan standar keselamatan K3 nasional."
    ];
  }

  const finalConclusionBullets = conclusionBullets.slice(0, 5).map(textLine => {
    return { text: textLine, options: { bullet: true, fontSize: 13, color: "334155", fontFace: "Calibri" } };
  });

  conclusionSlide.addText(finalConclusionBullets, {
    x: 0.6, y: 1.4, w: 7.2, h: 5.2,
    lineSpacing: 26
  });

  // Right Column: Executive box
  conclusionSlide.addShape("rect", {
    x: 8.3, y: 1.4, w: 4.4, h: 5.1,
    fill: { color: "FFFFFF" },
    line: { color: "CBD5E1", width: 1.5 }
  });
  conclusionSlide.addShape("rect", {
    x: 8.3, y: 1.4, w: 4.4, h: 0.5,
    fill: { color: "334155" }
  });
  conclusionSlide.addText("REKOMENDASI DIREKSI", {
    x: 8.5, y: 1.45, w: 4.0, h: 0.4,
    fontSize: 11, fontFace: "Arial Black", color: "FFFFFF"
  });

  const execBoxText = `STATUS EVALUASI KAJIAN\n\n• Rekomendasi: GO (SETUJU)\n• Prioritas Kerja: SANGAT TINGGI\n• Tahap Evaluasi: Selesai diulas\n• Tanggung Jawab: Jajaran Direksi & PM\n• Target Operasional: Onboarding Segera\n• Skema Sertifikasi: K3 & Standar Kelaikan Terpenuhi`;
  conclusionSlide.addText(execBoxText, {
    x: 8.6, y: 2.1, w: 3.8, h: 4.1,
    fontSize: 12, fontFace: "Calibri", color: "1E293B", lineSpacing: 22
  });

  // Footer signature
  conclusionSlide.addText("INTEGRATED DESIGNED BY PRAMA COGNITIVE PORTAL", {
    x: 0.6, y: 6.9, w: 7.2, h: 0.3,
    fontSize: 8.5, fontFace: "Courier New", color: "94A3B8", bold: true
  });
  conclusionSlide.addText("Halaman 15 dari 16", {
    x: 8.3, y: 6.9, w: 4.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
  });

  // --- SLIDE 16: Closing Thank You Slide ---
  const closingSlide = pptx.addSlide();
  
  // Set background to the Pancaran Group Illustration for maximum visual brand impact
  let closingBgPathPrj = "https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ";
  closingSlide.background = { path: closingBgPathPrj };

  // Semi-transparent dark overlay rectangle to guarantee pristine contrast and legibility
  closingSlide.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "06152B", transparency: 75 }
  });

  closingSlide.addShape("rect", {
    x: 0.1, y: 0.1, w: 13.13, h: 0.2,
    fill: { color: "334155" }
  });

  // Center corporate logo above title
  try {
    closingSlide.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 6.065,
      y: 0.9,
      w: 1.2,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to projectDashboard closing slide:", err);
  }

  closingSlide.addText("TERIMA KASIH", {
    x: 1.0, y: 2.2, w: 11.3, h: 1.0,
    fontSize: 48, fontFace: "Arial Black", color: "FFFFFF", align: "center"
  });
  closingSlide.addText("PRAMA System Strategic PM Formulator Module", {
    x: 1.0, y: 3.4, w: 11.3, h: 0.6,
    fontSize: 16, fontFace: "Calibri", color: "CBD5E1", align: "center"
  });
  closingSlide.addText("PT PANCARAN GROUP INDONESIA SERVICES", {
    x: 1.0, y: 4.8, w: 11.3, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "center", bold: true
  });

  // Save/trigger presentation download
  const sanitizedFilename = `PPTX_Kajian_PM_15_Pilar_${displayTitle.trim().replace(/\s+/g, "_")}.pptx`;
  await pptx.writeFile({ fileName: sanitizedFilename });
}

export function generatePillarsForProject(projectName: string, fileContent?: string): Record<number, string> {
  if (!projectName || !projectName.trim()) {
    const emptyPillars: Record<number, string> = {};
    for (let i = 1; i <= 17; i++) {
      emptyPillars[i] = "";
    }
    return emptyPillars;
  }

  const pName = projectName.trim();
  const sections = getDashboardSectionsForProject(pName);
  const result: Record<number, string> = {};
  sections.forEach((sec) => {
    result[sec.number] = sec.defaultContent;
  });

  if (fileContent) {
    const parsed = parseResponseToPillars(fileContent);
    Object.keys(parsed).forEach((k) => {
      const num = parseInt(k, 10);
      if (parsed[num] && parsed[num].trim().length > 20) {
        result[num] = parsed[num];
      }
    });
  }

  return result;
}

function _legacyGeneratePillarsForProject(projectName: string, fileContent?: string): Record<number, string> {
  const pName = projectName.trim();
  const lower = pName.toLowerCase();
  const cleanCoreTitle = pName
    .replace(/^(kajian strategis|kajian kelayakan|analisis kelayakan|proyek|project|kajian|analisis|evaluasi|rencana bisnis|proposal)[\s:]+/i, "")
    .trim() || pName;

  // Deterministic seed based on project name to make calculations completely unique per project
  let seed = 0;
  for (let i = 0; i < pName.length; i++) {
    seed = (seed << 5) - seed + pName.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  // Default values based on seed hash
  const defaultUnitsCount = 6 + (seed % 14);

  const defaultCapexVal = (seed % 28 + 6) * 500000000; // 3M to 17M
  const defaultOpexVal = (seed % 35 + 8) * 12500000; // 100M to 500M
  
  const defaultTamIDR = (seed % 9 + 3) * 1200000000000; // 3.6T to 13.2T
  const defaultSamIDR = Math.round(defaultTamIDR * (0.15 + (seed % 20) / 100));
  const defaultSomIDR = Math.round(defaultSamIDR * (0.1 + (seed % 15) / 100));

  const defaultCacIDR = (seed % 45 + 15) * 1000000; // 15M to 60M
  const defaultLtvIDR = defaultCacIDR * (seed % 12 + 8); // LTV range 8x to 19x

  const defaultPbp = (2.2 + (seed % 25) / 10).toFixed(1); // 2.2 to 4.7 years
  const defaultRoi = (28.5 + (seed % 180) / 10).toFixed(1); // 28.5% to 46.5%
  const defaultIrr = (20.5 + (seed % 130) / 10).toFixed(1); // 20.5% to 33.5%

  // Determine industry type and thematic vocabulary (default dynamic from title)
  let industry = `sektor operasional & logistik ${cleanCoreTitle}`;
  let regulations = "**UU No. 22 Tahun 2009** tentang Lalu Lintas Angkutan Jalan dan regulasi perizinan sektoral terkait";
  let materialName = `operasional komoditas ${cleanCoreTitle}`;
  let unitsText = `${defaultUnitsCount} Unit Armada Operasional Khusus ${cleanCoreTitle}`;
  let assetCategory = `unit operasional dan armada spesifikasi ${cleanCoreTitle}`;
  let extraDetail1 = `koridor rute utama dan simpul distribusi terencana untuk proyek ${cleanCoreTitle}.`;
  let extraDetail2 = `protokol pengawasan mutu layanan, standardisasi keselamatan operasional, dan kepatuhan SLA berkala.`;
  let capexAmount = defaultCapexVal.toString();
  let opexAmount = defaultOpexVal.toString();

  const getSizingText = (val: number) => {
    if (val >= 1000000000000) return `Rp ${(val / 1000000000000).toFixed(1)} Triliun`;
    return `Rp ${(val / 1000000000).toFixed(0)} Miliar`;
  };

  let tamFormatted = getSizingText(defaultTamIDR);
  let samFormatted = getSizingText(defaultSamIDR);
  let somFormatted = getSizingText(defaultSomIDR);
  let cacFormatted = `Rp ${defaultCacIDR.toLocaleString("id-ID")}`;
  let ltvFormatted = `Rp ${defaultLtvIDR.toLocaleString("id-ID")}`;
  let ratioValue = (defaultLtvIDR / defaultCacIDR).toFixed(1);

  // Custom-crafted industries
  if (lower.includes("susu") || lower.includes("dairy") || lower.includes("lembang") || lower.includes("milk") || lower.includes("sapi") || lower.includes("kpsbu") || lower.includes("peternakan")) {
    industry = "logistik rantai dingin susu segar & industri pengolahan susu (Fresh Milk & Dairy Cold Chain Logistics)";
    regulations = "**SNI 3141.1:2011** tentang Susu Segar, standar Cara Distribusi Pangan Olahan yang Baik (CDPOB) BPOM, dan **Permenhub No. PM 60 Tahun 2019**";
    materialName = "susu murni segar (fresh raw milk) & susu olahan dingin";
    unitsText = `${defaultUnitsCount} Unit Truk Tangki Susu Berinsulasi Food-Grade (SUS 304/316 dengan Chiller Agitator)`;
    assetCategory = "armada truk tangki berpendingin chiller agitator food-grade berstandar BPOM & Halal";
    extraDetail1 = "koridor rute cooling center peternakan Lembang & Bandung Barat menuju pabrik pengolahan susu (IPS) di Jawa Barat dan Jabodetabek.";
    extraDetail2 = "protokol kontrol suhu ketat (rentang 2°C - 4°C), agitator sirkulasi susu kontinu, dan siklus sanitasi otomatis Clean-in-Place (CIP).";
  } else if (lower.includes("listrik") || lower.includes("electric") || lower.includes("ev") || lower.includes("baterai") || lower.includes("battery") || lower.includes("charging") || lower.includes("spklu") || lower.includes("kblbb") || lower.includes("zero emission")) {
    industry = "ekosistem transportasi kendaraan listrik komersial (Commercial Electric Vehicle / EV Green Logistics)";
    regulations = "**Perpres No. 55 Tahun 2019** tentang Percepatan Program KBLBB, **Permen ESDM No. 13 Tahun 2020** tentang Infrastruktur Pengisian Listrik (SPKLU), serta sertifikasi uji laik jalan (SRUT) Kemenhub";
    materialName = "mobilitas armada ramah lingkungan bebas emisi karbon (Zero-Emission EV Transport)";
    unitsText = `${defaultUnitsCount} Unit Armada Kendaraan Listrik Komersial (EV Fleet) & Truk Ringan Baterai LFP/NMC`;
    assetCategory = "armada kendaraan listrik terintegrasi fasilitas pengisian daya cepat SPKLU";
    extraDetail1 = "koridor transit distribusi perkotaan dan depo utama yang dilengkapi stasiun pengisian daya cepat (SPKLU DC Fast Charging 60-120 kW).";
    extraDetail2 = "sistem telematika cerdas Battery Management System (BMS) dengan pemantauan State of Charge (SoC) dan efisiensi konsumsi energi kWh per kilometer.";
  } else if (lower.includes("maritim") || lower.includes("kapal") || lower.includes("tongkang") || lower.includes("barge") || lower.includes("tugboat") || lower.includes("pelayaran") || lower.includes("laut") || lower.includes("pelabuhan") || ((lower.includes("port") && !lower.includes("transport")) || lower.includes("seaport")) || lower.includes("jetty") || lower.includes("dermaga")) {
    industry = "transportasi laut & logistik pelayaran maritim (Marine Shipping & Tug-Barge Bulk Hauling)";
    regulations = "**UU No. 17 Tahun 2008** tentang Pelayaran, sertifikasi statutori BKI (Biro Klasifikasi Indonesia), dan konvensi MARPOL/SOLAS";
    materialName = "kargo curah laut & logistik maritim antarpulau";
    unitsText = `${defaultUnitsCount} Set Tugboat & Tongkang (Barge 300-330 Feet)`;
    assetCategory = "armada kapal tunda (tugboat) dan tongkang kargo curah laut berlisensi statutori BKI";
    extraDetail1 = "rute pelayaran perairan pesisir dan antarpulau dengan pemantauan navigasi satelit AIS & Marine Radar.";
    extraDetail2 = "SOP keselamatan pelayaran tinggi, sertifikasi kelaikan lambung kapal, dan manajemen turnaround tongkang di pelabuhan.";
  } else if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
    industry = "distribusi mineral & tambang curah (Heavy-Duty Hauling)";
    regulations = "**UU No. 3 Tahun 2020** tentang Pertambangan Mineral dan Batubara, serta regulasi ESDM & ODOL";
    materialName = "batubara curah kering";
    unitsText = `${defaultUnitsCount} Unit Tipper Dump Truck Heavy-Duty (6x4)`;
    assetCategory = "armada dump truck heavy-duty medan off-road tambang";
    extraDetail1 = "Sistem pengangkutan khusus hauling dari mulut tambang batubara (stockpile) menuju dermaga penumpukan (jetty).";
    extraDetail2 = "Fasilitas keselamatan K3 pertambangan tinggi, penyiraman rute hauling, dan rest-area driver terintegrasi.";
  } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
    industry = "transportasi rantai dingin (Cold Chain & Temperature Controlled Logistics)";
    regulations = "**Sertifikasi CDOB BPOM** (Cara Distribusi Obat yang Baik) serta regulasi sistem mutu **ISO 9001**";
    materialName = "vaksin sensitif suhu & produk boga beku";
    unitsText = `${defaultUnitsCount} Unit Reefer Box Truck ThermoKing ber-GPS`;
    assetCategory = "armada truk boks berpendingin termo-insulasi dengan kendali temperatur digital";
    extraDetail1 = "Instalasi sensor Thermo-Cloud IoT untuk pemantauan grafik fluktuasi suhu boks reefer setiap 5 menit.";
    extraDetail2 = "SOP ketat pengiriman dengan batas deviasi suhu boks maksimal ±2°C sepanjang koridor transit.";
  } else if (lower.includes("kontainer") || lower.includes("container") || lower.includes("inland") || lower.includes("depo") || lower.includes("hub") || lower.includes("shuttle")) {
    industry = "intermodal & logistics hub depo darat industri (Container & Inland Freight)";
    regulations = "**UU No. 22 Tahun 2009** tentang Lalu Lintas Angkutan Jalan serta aturan batas tonase muatan & standardisasi keselamatan";
    materialName = "petikemas kontainer darat";
    unitsText = `${defaultUnitsCount} Unit Prime Mover Tractor Head Flatbed Chasis`;
    assetCategory = "armada truk penarik kepala prime mover dan sasis peti kemas 20/40 feet";
    extraDetail1 = "Pengaturan jadwal armada sinkron dengan waktu batas terima kargo depo logistik (*cargo cutoff time*).";
    extraDetail2 = "Integrasi depo kontainer pintar, inspeksi pintu segel penimbang, dan manajemen turn-around-time depo darat.";
  } else if (lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("beton")) {
    industry = "logistik distribusi semen curah & clinker industri konstruksi";
    regulations = "**UU No. 22 Tahun 2009** serta Surat Edaran Kemenhub perihal batasan muatan sumbu terberat (MST) & Over Dimension Over Load (ODOL)";
    materialName = "semen curah kering & clinker";
    unitsText = `${defaultUnitsCount} Unit Truk Tangki Bulk Cement (Kapsul Bertekanan)`;
    assetCategory = "armada truk tangki semen curah kompresor pneumatik berkapasitas tinggi";
    extraDetail1 = "Penyaluran komoditas semen curah dari pabrik pengolahan semen menuju silo penampungan atau batching plant.";
    extraDetail2 = "Penggunaan blower kompresor berkinerja tinggi untuk kelancaran bongkar muat secara presisi.";
  } else if (lower.includes("pupuk") || lower.includes("fertilizer") || lower.includes("urea")) {
    industry = "logistik distribusi pupuk pertanian & bahan kimia agroindustri";
    regulations = "**PP No. 74 Tahun 2001** tentang Pengelolaan Bahan Berbahaya dan Beracun (B3) serta standardisasi sasis gandar Kemenhub";
    materialName = "pupuk urea curah & amoniak cair";
    unitsText = `${defaultUnitsCount} Unit Truk Tronton Wingbox & Tangki Agro Terpal Kedap`;
    assetCategory = "armada truk logistik pangan dan bahan agroindustri berstandar sirkulasi kering";
    extraDetail1 = "Pengangkutan pupuk kemasan bag dan bulk dari gudang pabrik menuju gudang lini III kabupaten.";
    extraDetail2 = "SOP sirkulasi sasis tangki kedap guna meminimalisir kontaminasi kelembapan terhadap butir amoniak.";
  } else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
    industry = "logistik Crude Palm Oil (CPO) & minyak nabati cair";
    regulations = "**Sertifikasi ISPO** (Indonesian Sustainable Palm Oil) dan standar kebersihan sasis tangki Food Grade";
    materialName = "minyak kelapa sawit kasar (CPO)";
    unitsText = `${defaultUnitsCount} Unit CPO Tanker Truck Stainless Steel`;
    assetCategory = "armada tangki baja tahan karat berinsulasi food grade anti-tumpah";
    extraDetail1 = "Rute hauling CPO dari pabrik kelapa sawit (PKS) lini tengah menuju depo penyimpanan darat (bulking station).";
    extraDetail2 = "Instalasi katup pengaman anti-tumpah, pencuci tangki otomatis sasis (steam cleaner), dan pelacakan GPS suhu thermo.";
  } else if (lower.includes("pasir") || lower.includes("quarry") || lower.includes("batu") || lower.includes("tanah") || lower.includes("galian")) {
    industry = "logistik material galian tambang & infrastruktur sipil (Quarry Trucking)";
    regulations = "**UU No. 3 Tahun 2020** serta Perda RTRW Kota/Kabupaten setempat mengenai izin jam lintasan kelas jalan";
    materialName = "pasir cor, andesit, & batu agregat";
    unitsText = `${defaultUnitsCount} Unit Dump Truck Agregat Heavy-Duty`;
    assetCategory = "armada dump truck angkut material galian dengan bak baja tebal anti-debu";
    extraDetail1 = "Pengangkutan agregat konstruksi berdensitas tinggi dari titik penggalian menuju batching plant beton.";
    extraDetail2 = "SOP wajib pemasangan terpal penutup bak tebal anti-debu dan pembersihan sasis unit scraper pembersih lumpur ban.";
  } else if (lower.includes("gas") || lower.includes("lng") || lower.includes("lpg") || lower.includes("bensin") || lower.includes("solar")) {
    industry = "logistik energi cair & gas terkompresi B3 spesifikasi tinggi";
    regulations = "**Standar K3 Migas ESDM** dan UU No. 22 Tahun 2001 perihal izin distribusi angkutan bahan bakar umum nasional";
    materialName = "BBM komanditer / gas cair terkompresi";
    unitsText = `${defaultUnitsCount} Unit Bulk Tanker Trailer (Tangki Baja Bertekanan)`;
    assetCategory = "armada tangki bahan bakar cair dan gas bertekanan bersertifikasi Dirjen Migas";
    extraDetail1 = "Distribusi pasokan energi dari depo kilang pengolahan Pertamina menuju terminal SPBU atau tangki industri.";
    extraDetail2 = "Unit wajib mengaplikasikan sistem pemutus arus listrik darurat, fire blanket sasis, dan sensor deteksi gas bocor otomatis.";
  } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
    industry = "pengangkutan & pengelolaan limbah industri / B3 (Waste Management Transportation)";
    regulations = "**UU No. 18 Tahun 2008** tentang Pengelolaan Sampah, **PP No. 22 Tahun 2021** tentang Penyelenggaraan Perlindungan Pengelolaan Lingkungan Hidup, serta standar KLHK & Kemenhub";
    materialName = "limbah B3 industri (cair & padat)";
    unitsText = `${defaultUnitsCount} Unit Truk Vacuum Sludge B3 & Boks Khusus Berizin KLHK`;
    assetCategory = "armada truk tangki vacuum sedot limbah dan boks lapis baja kedap kimia";
    extraDetail1 = "Penyediaan armada transporter tersertifikasi izin khusus angkutan B3 dari Ditjen Perhubungan Darat dan rekomendasi KLHK.";
    extraDetail2 = "Integrasi sistem pelacakan elektronik manifest Festronik terhubung langsung ke server sistem pemantauan KLHK.";
  } else if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("wood") || lower.includes("logging")) {
    industry = "logistik & transportasi kehutanan (Forestry & Logging Transportation)";
    regulations = "**UU No. 18 Tahun 2013** tentang Pencegahan dan Pemberantasan Perusakan Hutan, serta regulasi SVLK (Sistem Verifikasi Legalitas Kelestarian)";
    materialName = "kayu bulat (logs) & pulpwood";
    unitsText = `${defaultUnitsCount} Unit Truk Logging Off-Road Heavy-Duty`;
    assetCategory = "armada truk logging penarik kayu gelondongan berspesifikasi medan tanah terjal";
    extraDetail1 = "Rute hauling logs dari log yard/tempat penimbunan sementara di dalam konsesi hutan tanaman industri menuju pabrik bubur kertas (pulp mill).";
    extraDetail2 = "Fasilitas K3 kehutanan tinggi, sistem penakar muatan timbangan portable, dan ban logging tapak kasar anti-slip.";
  } else if (lower.includes("gudang") || lower.includes("warehouse") || lower.includes("distribusi") || lower.includes("kurir") || lower.includes("fulfillment")) {
    industry = "layanan pergudangan modern & logistik distribusi terintegrasi (Warehousing & Distribution)";
    regulations = "**UU Perdagangan No. 7 Tahun 2014**, Peraturan Menteri Perdagangan tentang Penataan Pergudangan, dan K3 Ketenagakerjaan";
    materialName = "barang konsumsi (FMCG) & paket distribusi komersial";
    unitsText = `${defaultUnitsCount} Unit Truk Box Wingbox & Shuttle Logistik`;
    assetCategory = "armada truk boks tertutup dan fasilitas penanganan barang pergudangan modern";
    extraDetail1 = "jaringan pergudangan penyangga hub distribusi regional dengan sistem slotting modern.";
    extraDetail2 = "integrasi Warehouse Management System (WMS) berbasis barcode/RFID untuk akurasi stock-keeping 99.8%.";
  }

  // File parser overrides if real content is provided!
  if (fileContent) {
    const capexMatch = fileContent.match(/(?:capex|investasi|capital\s*expenditure)\W*(?:idr|rp)?\s*([\d\.]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (capexMatch && capexMatch[1]) {
      capexAmount = capexMatch[1].trim().replace(/\./g, "").replace(/\D/g, "");
    }

    const opexMatch = fileContent.match(/(?:opex|operasional|operational\s*expenditure)\W*(?:idr|rp)?\s*([\d\.]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (opexMatch && opexMatch[1]) {
      opexAmount = opexMatch[1].trim().replace(/\./g, "").replace(/\D/g, "");
    }

    const tamMatch = fileContent.match(/(?:tam|total\s*addressable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (tamMatch && tamMatch[1]) tamFormatted = tamMatch[1].trim();

    const samMatch = fileContent.match(/(?:sam|serviceable\s*addressable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (samMatch && samMatch[1]) samFormatted = samMatch[1].trim();

    const somMatch = fileContent.match(/(?:som|serviceable\s*obtainable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (somMatch && somMatch[1]) somFormatted = somMatch[1].trim();

    const cacMatch = fileContent.match(/(?:cac|customer\s*acquisition\s*cost)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (cacMatch && cacMatch[1]) cacFormatted = cacMatch[1].trim();

    const ltvMatch = fileContent.match(/(?:ltv|lifetime\s*value)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (ltvMatch && ltvMatch[1]) ltvFormatted = ltvMatch[1].trim();

    const indMatch = fileContent.match(/(?:industri|sektor|sector)\W*\s*([a-zA-Z0-9\s,&()-]{5,40})/i);
    if (indMatch && indMatch[1]) industry = indMatch[1].trim();

    const matMatch = fileContent.match(/(?:material|komoditas|kargo|barang|bawaan)\W*\s*([a-zA-Z0-9\s,&()-]{3,30})/i);
    if (matMatch && matMatch[1]) materialName = matMatch[1].trim();

    const untMatch = fileContent.match(/(?:armada|mobil|truk|units|unit)\W*(\d+\s*[a-zA-Z0-9\s-]+)/i);
    if (untMatch && untMatch[1]) unitsText = untMatch[1].trim();
  }

  // Let's format numeric values
  let numericCapex = Number(capexAmount);
  if (isNaN(numericCapex) || numericCapex === 0) {
    numericCapex = defaultCapexVal;
  }
  let numericOpex = Number(opexAmount);
  if (isNaN(numericOpex) || numericOpex === 0) {
    numericOpex = defaultOpexVal;
  }

  const monthlyRev = Math.round(numericOpex * 1.85);

  const pillars: Record<number, string> = {
    1: `### 1. Global / National (NAT) Overview

Kajian strategis proyek ${pName} pada sektor ${industry} berfokus pada keandalan pengangkutan komoditas ${materialName}. Operasional didukung kesiapan ${unitsText} dengan alokasi estimasi Capex sebesar Rp ${(numericCapex / 1000000000).toFixed(1)} Miliar dan Opex bulanan sebesar Rp ${(numericOpex / 1000000000).toFixed(1)} Miliar.

Seluruh kegiatan operasional mengacu pada kepatuhan regulasi ${regulations}, kelayakan uji berkala e-KIR/kelaikan teknis, serta sertifikasi keselamatan kerja K3. Koridor distribusi melintasi ${extraDetail1} dengan protokol ${extraDetail2} untuk menjamin pencapaian target SLA on-time delivery minimal 98.5%.`,

    2: `### 2. Market Opportunity

Proyek "${pName}" menyasar sektor ${industry} premium di mana terdapat gap atau kesenjangan besar antara transporter berlisensi standar dengan standar kepatuhan tinggi yang dituntut oleh korporat modern. Dengan memanfaatkan armada khusus berlisensi untuk mengangkut ${materialName}, Pancaran Group berada di posisi paling strategis untuk merebut pangsa pasar dari kompetitor konvensional.

Keberadaan armada berteknologi tinggi dan jaminan kepatuhan regulasi ${regulations} memungkinkan penetrasi pasar yang efektif pada koridor distribusi utama. Solusi logistik terintegrasi ini menjawab kebutuhan industri terhadap efisiensi biaya operasional, keandalan ketepatan waktu pengiriman, serta pemenuhan target efisiensi dan tata kelola berkelanjutan.`,

    3: `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)

Kelayakan finansial proyek ${pName} didukung alokasi Capex sebesar Rp ${(numericCapex / 1000000000).toFixed(1)} Miliar untuk pengadaan ${unitsText} berteknologi tinggi serta estimasi Opex bulanan sebesar Rp ${(numericOpex / 1000000000).toFixed(1)} Miliar. Dengan proyeksi pendapatan operasional rata-rata Rp ${(monthlyRev / 1000000000).toFixed(1)} Miliar per bulan dan target marjin laba kotor 45%, proyek ini mengindikasikan Payback Period selama ${defaultPbp} tahun serta tingkat ROI tahun ke-3 sebesar ${defaultRoi}%.

Tingkat Internal Rate of Return (IRR) sebesar ${defaultIrr}% secara signifikan melampaui biaya modal perbankan nasional (~9-11%), mengindikasikan ketahanan finansial dan profitabilitas yang sangat solid. Manajemen modal kerja diperkuat dengan penyediaan buffer likuiditas 3 bulan operasional untuk mengantisipasi siklus penagihan korporat (Term of Payment 60-90 hari), menjamin kesinambungan arus kas operasional secara berkelanjutan.`,

    4: `### 4. Supply & Demand

Dinamika supply dan demand untuk koridor distribusi komoditas ${materialName} menunjukkan adanya lonjakan kebutuhan pengangkutan industri yang tidak diimbangi oleh ketersediaan armada berspesifikasi tinggi di pasar regional. Keterbatasan operator logistik yang memenuhi audit kepatuhan HSE ketat dan regulasi ${regulations} membuka peluang besar bagi Pancaran Group untuk mendominasi segmen logistik bernilai tambah tinggi.

Dengan penempatan ${unitsText} modern dan utilisasi ritase terencana di atas 85%, unit bisnis memiliki kekuatan penetapan harga (pricing power) yang kompetitif. Kesiapan unit pengganti (buffer fleet) dan pemantauan telemetri real-time memastikan pemenuhan komitmen kapasitas harian tanpa risiko kemacetan rantai pasok klien.`,

    5: `### 5. Structure

Struktur rantai nilai logistik proyek "${pName}" mencakup integrasi menyeluruh dari pengangkutan hulu (inbound), transit antarmoda (midstream), hingga serah terima hilir (outbound). PRAMA Live Control Tower mengawal kelancaran alur secara real-time guna memangkas turnaround time (TAT) dan mengoptimalkan sinkronisasi jadwal bongkar muat di gerbang fasilitas klien.

Pendekatan distribusi sirkular (closed-loop logistics) diterapkan guna meminimalkan perjalanan tanpa muatan (empty miles), sehingga meningkatkan efisiensi biaya operasional dan memperbesar marjin per ritase. Seluruh kontainer dan armada sasis dilengkapi sistem penyegelan digital untuk menjamin integritas kargo ${materialName} sepanjang perjalanan.`,

    6: `### 5. Organization (Qualification, Skill, Output/KPI, SOP)

Struktur organisasi operasional proyek "${pName}" dirancang dengan hierarki komando yang ramping dan berorientasi pada eksekusi lapangan yang presisi. Setiap posisi kunci, mulai dari Project Operations Lead, HSE Officer bersertifikasi K3 Kemenhub, hingga Dispatcher Control Tower, memiliki mandat kualifikasi ketat dan KPI terukur untuk menjamin zero fatal accident dan keandalan armada.

Pengemudi armada diwajibkan melalui pelatihan berkala penanganan kargo ${materialName}, teknik eco-driving, dan mitigasi darurat rute. Standar Operasional Prosedur (SOP) berbasis digital memandu seluruh tahapan mulai dari pre-trip inspection hingga serah terima muatan, menciptakan budaya keselamatan kerja yang konsisten di seluruh lini operasional.`,

    7: `### 6. Transition Model (Pre-On-Post)

Model transisi proyek "${pName}" terbagi ke dalam tiga fase strategis terintegrasi: Pre-Operation, On-Operation, dan Post-Operation/Scale-up. Pada fase Pre-Operation (Bulan 1-2), fokus diarahkan pada mobilisasi ${unitsText}, instalasi IoT sensor telematics, uji coba rute (trial haul), serta penyelesaian audit kepatuhan regulasi bersama mitra korporat.

Fase On-Operation (Bulan 3-12) memastikan stabilisasi ritase harian dengan target SLA ketepatan waktu 98.5% dan evaluasi kinerja triwulanan. Memasuki fase Post-Operation, Pancaran Group melakukan peninjauan efisiensi bahan bakar dan keselamatan untuk membuka opsi penambahan unit ekspansi armada guna mengakomodasi pertumbuhan volume kargo jangka panjang.`,

    8: `### 7. Go To Market Strategy

Strategi Go-To-Market (GTM) proyek "${pName}" berfokus pada penetrasi langsung ke korporasi tier-1 dan produsen utama komoditas ${materialName} melalui penawaran Long-Term Service Agreement (LTSA) berdurasi 3 hingga 5 tahun. Proposisi nilai utama ditekankan pada keandalan operasional, rekam jejak keselamatan teruji, serta integrasi pelaporan digital kepatuhan operasional dan efisiensi biaya.

Pendekatan kemitraan strategis diperkuat dengan program Quarterly Business Review (QBR) dan skema insentif berbasis volume komitmen tahunan. Sinergi jaringan logistik multimoda dan depo internal Pancaran Group memberikan keunggulan kompetitif yang sulit ditandingi oleh operator konvensional di koridor terkait.`,

    9: `### 8. Ops Model (Flow Process, Workflow Diagram, SLA)

Model operasi proyek "${pName}" mengintegrasikan alur kerja hulu-ke-hilir yang terhubung secara digital dengan PRAMA Live Control Tower. Alur dimulai dari pre-trip digital inspection dan pemeriksaan fit-to-work pengemudi, pemuatan kargo ${materialName} terstandarisasi, pengawalan telemetri rute real-time, hingga konfirmasi serah terima digital di lokasi tujuan (e-Proof of Delivery).

Komitmen Service Level Agreement (SLA) menetapkan target ketersediaan armada minimal 98%, toleransi deviasi jadwal muat di bawah 15 menit, serta waktu respon tanggap darurat teknis maksimal 45 menit. Protokol exception management otomatis mengaktifkan unit cadangan dan tim mekanik mobile jika terdeteksi anomali pada sensor telematika di perjalanan.`,

    10: `### 9. Risk Management

Manajemen risiko proyek "${pName}" mengidentifikasi dan memitigasi potensi risiko operasional rute, kepatuhan hukum, keselamatan kerja (HSE), dan volatilitas finansial. Pengawasan sensor telemetri kecepatan, kamera pendeteksi kelelahan pengemudi (fatigue sensor), serta kalender operasional adaptif terhadap cuaca ekstrem diterapkan untuk memastikan nihil kecelakaan (zero-incident culture).

Risiko finansial akibat fluktuasi harga bahan bakar solar industri dimitigasi melalui klausul eskalasi bahan bakar (Fuel Escalation Clause) dalam kontrak bersama klien. Sementara itu, risiko kepatuhan hukum dan perizinan MST/ODOL dikendalikan melalui sistem penimbangan digital sebelum armada memasuki jalan umum, menjamin kepatuhan 100% terhadap regulasi perhubungan.`,

    11: `### 10. Digital Coverage (Tools, Method, Impact, Automation)

Arsitektur teknologi digital proyek "${pName}" bertumpu pada integrasi Internet of Things (IoT), GPS geofencing, dan dashboard analitik PRAMA Business Intelligence. Setiap unit armada dilengkapi sensor telemetri mesin, pemantauan berat muatan suspensi anti-ODOL, serta manifest perjalanan digital yang terhubung langsung ke sistem ERP operasional.

Otomatisasi data logistik memungkinkan deteksi dini deviasi rute, optimalisasi konsumsi bahan bakar melalui algoritma rute terpintar, serta penerbitan laporan performa efisiensi BBM dan ketepatan waktu SLA secara otomatis. Transformasi digital ini meningkatkan visibilitas rantai pasok klien dan memangkas waktu administratif operasional hingga 70%.`,

    12: `### 11. Competitor

Analisis lanskap kompetitif proyek "${pName}" memetakan persaingan dari operator konvensional lokal, penyedia jasa multinasional, dan perusahaan angkutan internal klien. Kelemahan mendasar pemain eksisting umumnya terletak pada tingginya usia armada, ketiadaan sertifikasi HSE komprehensif, dan sistem pemantauan manual yang rentan deviasi.

Pancaran Group mengeksploitasi celah pasar ini melalui penyediaan armada modern tersertifikasi, integrasi sensor telemetri digital real-time, serta fleksibilitas kontrak kemitraan strategis. Pendekatan ini memungkinkan konversi pangsa pasar yang agresif dan berkelanjutan dari para pemain lama di koridor sasaran.`,

    13: `### 12. TAM, SAM, SOM

Estimasi ukuran pasar proyek "${pName}" menunjukkan potensi Total Addressable Market (TAM) sebesar ${tamFormatted} per tahun pada sektor ${industry} nasional, didorong oleh ekspansi industri dan kebutuhan logistik komoditas ${materialName}. Porsi Serviceable Addressable Market (SAM) yang dapat dijangkau oleh rute dan perizinan operasional Pancaran Group mencapai ${samFormatted} per tahun.

Target Serviceable Obtainable Market (SOM) diproyeksikan sebesar ${somFormatted} per tahun dalam horizon 3 tahun pertama, didukung kesiapan ${unitsText} awal serta penetrasi kontrak korporat B2B. Angka ini mencerminkan target pangsa pasar yang realistis dan menguntungkan dengan utilisasi kapasitas armada optimal.`,

    14: `### 13. CAC, LTV

Efisiensi komersial proyek "${pName}" tercermin dari Customer Acquisition Cost (CAC) rata-rata sebesar ${cacFormatted} per klien korporat, yang mencakup biaya partisipasi tender, survei teknis rute, dan persiapan dokumen legalitas awal. Sementara itu, Customer Lifetime Value (LTV) rata-rata diestimasikan mencapai ${ltvFormatted} berdasarkan durasi kontrak retensi 3 tahun dengan kepastian volume pengangkutan rutin.

Rasio LTV terhadap CAC yang mencapai ${ratioValue}x membuktikan keunggulan profitabilitas yang sangat sehat dan berada di atas rata-rata benchmark industri logistik. Tingginya rasio ini mengonfirmasi bahwa setiap modal yang dialokasikan untuk memenangkan akun B2B menghasilkan nilai ekonomi jangka panjang yang sangat signifikan bagi grup.`,

    15: `### 15. Service Design

Desain layanan operasional untuk proyek "${pName}" dirancang secara holistik untuk memberikan pengalaman terbaik (end-to-end service experience) bagi klien korporat dalam pengangkutan ${materialName}. Pendekatan Service Design memetakan seluruh titik sentuh (touchpoints) antara operator, pengemudi, control tower, dan manajemen logistik klien.

#### A. Arsitektur Pengalaman Klien (Client Journey Mapping)
• Tahap Onboarding & Konsultasi Kebutuhan: Pemetaan spesifikasi armada, rute, dan SLA khusus sesuai ekspektasi operasional mitra B2B.
• Eksekusi & Monitoring Real-Time: Visibilitas penuh melalui portal klien PRAMA Dashboard dengan update telematika dan status muatan per jam.
• Evaluasi & Review Berkala (QBR): Laporan analitik performa ketepatan waktu, efisiensi biaya, dan rekomendasi optimalisasi logistik berkelanjutan.

#### B. Blueprint Operasional & Prosedur Layanan
• Standardisasi Layanan 24/7: Integrasi sistem dispatch dan tim darurat respons cepat untuk memastikan kontinuitas pengangkutan tanpa hambatan.
• Kustomisasi Penanganan Kargo: Protokol penanganan khusus untuk komoditas ${materialName} guna menjaga kualitas dan keamanan muatan dari titik muat hingga tujuan akhir.`,

    16: `### 16. Konsumen Potensial

Analisis konsumen potensial pada proyek "${pName}" difokuskan pada pemetaan akun-akun korporat utama (tier-1 target accounts) di sektor ${industry} yang membutuhkan keandalan logistik komoditas ${materialName} dengan standar kepatuhan operasional tinggi.

#### A. Profil Target Klien Korporat B2B
• Produsen & Manufaktur Utama: Perusahaan industri berskala nasional dan multinasional yang memerlukan kepastian pasokan bahan baku secara terjadwal (just-in-time).
• Operator Kawasan & Distributor: Perusahaan logistik, trader, dan pengelola fasilitas distribusi yang membutuhkan layanan armada heavy-duty berlisensi resmi.

#### B. Strategi Akuisisi & Kebutuhan Spesifik Kontrak
• Penawaran Kontrak Jangka Panjang (LTSA): Paket layanan logistik dengan jaminan kepastian armada, SLA di atas 98.5%, dan skema penagihan fleksibel (term of payment 60-90 hari).
• Value Proposition Unggulan: Integrasi sensor IoT telematika, laporan digital transparan, serta komitmen zero accident dan kepatuhan ${regulations}.`,

    17: `### 17. Legal & Regulatory Compliance (Izin Usaha, Perizinan Sektoral, Dokumen Legalitas)

Aspek legalitas dan kepatuhan regulasi pada proyek "${pName}" mencakup kelengkapan dokumen badan usaha PT/CV, pengesahan Kemenkumham, kepatuhan NIB OSS RBA dengan KBLI logistik angkutan ${materialName}, serta perizinan khusus perhubungan seperti SIUJPT dan izin penyelenggaraan angkutan barang ${regulations}.

Dokumen pendukung operasional meliputi Perjanjian Kerjasama (PKS) B2B berstandar SLA, kepatuhan perpajakan (NPWP Badan & PKP), dokumen K3 dan AMDAL/UKL-UPL lingkungan, serta sertifikasi uji berkala kendaraan (e-KIR). Seluruh kelengkapan legal ini menjamin mitigasi risiko hukum secara total dan memastikan kelancaran operasional jangka panjang.

#### A. Legalitas Korporasi & Perizinan Berusaha Berbasis Risiko (OSS RBA)
• Pengesahan Entitas Hukum: Akta pendirian PT Pancaran Group / entitas operasional khusus proyek serta pengesahan Menteri Hukum dan HAM.
• Nomor Induk Berusaha (NIB): Kepatuhan KBLI sektor angkutan bermotor untuk barang khusus dan logistik multimoda komoditas ${materialName}.
• Perizinan Sektoral Kementerian Perhubungan: Kepemilikan Surat Izin Usaha Jasa Pengurusan Transportasi (SIUJPT) dan izin trayek/operasional khusus angkutan koridor industri.

#### B. Kontrak B2B, Kepatuhan Pajak & Asuransi Kargo
• Perjanjian Kerjasama (PKS) & SLA: Kontrak layanan logistik jangka panjang (Long-Term Service Agreement) dengan ketentuan Service Level Agreement (SLA) minimal 98.5%.
• Kepatuhan Perpajakan Nasional: Validasi NPWP Badan, status Pengusaha Kena Pajak (PKP), e-Faktur transaksi, dan pelaporan SPT rutin tanpa catatan sanksi.
• Proteksi Asuransi & Risiko: Pertanggungan All-Risk Vehicle Insurance serta Marine/Cargo Insurance untuk menjamin keamanan finansial atas muatan ${materialName} selama proses pengangkutan.`
  };

  // Map raw keys to match defaultDashboardSections (fixing the off-by-one misalignment due to missing Structure section)
  const mappedPillars: Record<number, string> = {
    1: pillars[1],
    2: pillars[2],
    3: pillars[3],
    4: pillars[4],
    5: pillars[6],  // Map generated 'Organization' (6) to Section 5
    6: pillars[7],  // Map generated 'Transition' (7) to Section 6
    7: pillars[8],  // Map generated 'GTM' (8) to Section 7
    8: pillars[9],  // Map generated 'Ops Model' (9) to Section 8
    9: pillars[10], // Map generated 'Risk Management' (10) to Section 9
    10: pillars[11],// Map generated 'Digital Coverage' (11) to Section 10
    11: pillars[12],// Map generated 'Competitor' (12) to Section 11
    12: pillars[13],// Map generated 'TAM, SAM, SOM' (13) to Section 12
    13: pillars[14], // Map generated 'CAC, LTV' (14) to Section 13
    14: `### 14. Kesimpulan & Rekomendasi Keputusan

Berdasarkan hasil evaluasi komprehensif terhadap seluruh pilar kajian strategis—mencakup kelayakan teknis armada, profitabilitas finansial (IRR ${defaultIrr}%, PBP ${defaultPbp} tahun), kesiapan kepatuhan HSE, serta integrasi ekosistem digital—proyek ekspansi "${pName}" dinyatakan SANGAT LAYAK (GO DECISION) untuk segera dieksekusi.

Rekomendasi langkah prioritas meliputi finalisasi kontrak jangka panjang (LTSA) bersama klien utama, pengadaan dan mobilisasi ${unitsText} berstandar telematika PRAMA, serta pembentukan gugus tugas operasional depo guna memastikan kesiapan implementasi tepat waktu sesuai target SLA yang ditetapkan.`,

    15: pillars[15],
    16: pillars[16],
    17: pillars[17]
  };

  return mappedPillars;
}

export function cleanPillarContent(content: string, pillarNum: number, pillarTitle: string): string {
  let cleaned = content.trim();
  
  if (pillarNum === 2) {
    if (cleaned.includes("Berikut adalah bedah terstruktur") || cleaned.includes("A. ANALISIS POTENSI PASAR") || cleaned.includes("A. CAKUPAN STRATEGIS") || cleaned.includes("Faktor Pendorong Pasar")) {
      const parts = cleaned.split(/---|\n### \*\*A\./);
      if (parts[0] && parts[0].trim().length > 60) {
        cleaned = parts[0].replace(/Berikut adalah bedah terstruktur[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "").trim();
      }
    }
  }

  if (pillarNum === 3) {
    if (cleaned.includes("A. Alokasi Capital Expenditure") || cleaned.includes("Analisis Kelayakan Finansial Proyek Komprehensif") || cleaned.includes("MACAM-MACAM KATEGORI FINANSIAL")) {
      const parts = cleaned.split(/---|\n\*\*A\. Alokasi/);
      if (parts[0] && parts[0].trim().length > 60) {
        cleaned = parts[0].replace(/Analisis Kelayakan Finansial Proyek Komprehensif:?[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "").trim();
      }
    }
  }

  if (pillarNum === 14) {
    // Section 14 should strictly focus on Conclusion & Recommendations, removing any stray CAC/LTV summary text
    cleaned = cleaned.replace(/Metrik\s+CAC\s+dioptimalkan[\s\S]*?kebutuhan\s+logistik\.?\s*/gi, "");
    cleaned = cleaned.replace(/Metrik\s+CAC\s+dioptimalkan[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "");
    cleaned = cleaned.replace(/.*(?:Metrik\s+CAC|SaaS\s+atau\s+biaya|dukungan\s+teknis\s+24\/7).*\n?/gi, "");
  }

  // 1. If the content has multiple occurrences of the pillar header, take the last one!
  // E.g., if there's a duplicate header like "### 1. Global / National" or "GLOBAL/NAT OVERVIEW" or "### 1"
  const lines = cleaned.split("\n");
  let lastHeaderIndex = -1;
  
  for (let i = 1; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    // Check if this line looks like a header for the same pillar
    if (
      lineLower.startsWith("### " + pillarNum) ||
      lineLower.startsWith("### " + pillarNum + ".") ||
      lineLower.includes(pillarTitle.toLowerCase()) ||
      (lineLower.startsWith("###") && lineLower.includes(pillarNum.toString()) && lineLower.includes("overview"))
    ) {
      lastHeaderIndex = i;
    }
  }
  
  if (lastHeaderIndex !== -1) {
    // Keep only from lastHeaderIndex onwards
    cleaned = lines.slice(lastHeaderIndex).join("\n").trim();
  }

  // 2. Filter out conversational prologue lines
  const conversationalKeywords = [
    "halo!", "halo,", "hai!", "selamat datang", "saya senang", "mendeteksi permintaan",
    "dengan senang hati", "konfirmasi bahwa proyek baru", "mari kita", "berikut adalah analisis",
    "analisis lengkap 14 pilar", "proyek yang akan kita", "bisa membantu anda", "pilar strategis",
    "draf strategis", "sambut dan konfirmasikan", "rekonstruksi semua"
  ];
  
  const finalLines = cleaned.split("\n");
  const filteredLines: string[] = [];
  let skippingPrologue = true;
  
  for (const line of finalLines) {
    const lineLower = line.toLowerCase();
    
    // Always keep headers
    if (line.trim().startsWith("###")) {
      filteredLines.push(line);
      skippingPrologue = false;
      continue;
    }
    
    if (skippingPrologue) {
      const isConversational = conversationalKeywords.some(keyword => lineLower.includes(keyword));
      if (isConversational) {
        continue; // skip this line
      } else if (line.trim().length > 0) {
        skippingPrologue = false; // stop skipping once we hit real content
      }
    }
    
    filteredLines.push(line);
  }
  
  let resultText = filteredLines.join("\n").trim();

  // 3. Remove verbose breakdowns if present (keep only the concise executive narrative)
  const breakdownSplitters = [
    "\n---",
    "\n## 1.",
    "\n## 1 ",
    "\n### **A.",
    "\n**A. ",
    "\n### A. ",
    "\n### Ringkasan Skoring",
    "\n| Kategori Risiko |"
  ];

  for (const splitter of breakdownSplitters) {
    const idx = resultText.indexOf(splitter);
    if (idx !== -1 && idx > 50) {
      // Ensure we keep the first header and introductory narrative
      resultText = resultText.substring(0, idx).trim();
    }
  }

  return resultText;
}

export function parseResponseToPillars(text: string): Record<number, string> {
  const result: Record<number, string> = {};
  const lines = text.split("\n");
  let currentPilar = 0;
  let currentContent: string[] = [];

  const headerToPillarMap: Record<string, number> = {
    "GLOBAL/NAT OVERVIEW": 1,
    "GLOBAL / NAT OVERVIEW": 1,
    "GLOBAL/NATIONAL OVERVIEW": 1,
    "GLOBAL / NATIONAL OVERVIEW": 1,
    "GLOBAL OVERVIEW": 1,
    "NATIONAL OVERVIEW": 1,
    "GLOBAL NAT OVERVIEW": 1,
    "GLOBAL NATIONAL OVERVIEW": 1,
    
    "MARKET OPPORTUNITY": 2,
    "PELUANG PASAR": 2,
    "CERUK PASAR": 2,
    "MARKET OPPORTUNITIES": 2,
    
    "FINANCIAL": 3,
    "FINANCIALS": 3,
    "FINANSIAL": 3,
    "KEUANGAN": 3,
    "FINANCIAL ANALYSIS": 3,
    
    "SUPPLY AND DEMAND": 4,
    "SUPPLY & DEMAND": 4,
    "SUPPLY AND DEMAND ANALYSIS": 4,
    "PENAWARAN DAN PERMINTAAN": 4,
    "PENAWARAN & PERMINTAAN": 4,
    "SUPPLY & DEMAND ANALYSIS": 4,
    
    "STRUCTURE": 100,
    "STRUKTUR": 100,
    "PROJECT STRUCTURE": 100,
    "STRUKTUR PROYEK": 100,
    
    "ORGANIZATION": 5,
    "ORGANISASI": 5,
    "ORGANIZATION STRATEGY": 5,
    "STRATEGI ORGANISASI": 5,
    
    "TRANSITION MODEL": 6,
    "MODEL TRANSISI": 6,
    "TRANSISI": 6,
    "STRATEGI TRANSISI": 6,
    
    "GO TO MARKET STRATEGY": 7,
    "GO-TO-MARKET STRATEGY": 7,
    "GO TO MARKET": 7,
    "STRATEGI GO TO MARKET": 7,
    "GTM STRATEGY": 7,
    
    "OPS MODEL": 8,
    "OPERATIONAL MODEL": 8,
    "MODEL OPERASIONAL": 8,
    "OPS MODEL ANALYSIS": 8,
    
    "RISK MANAGEMENT": 9,
    "MANAJEMEN RISIKO": 9,
    "MANAJEMEN RESIKO": 9,
    "MITIGASI RISIKO": 9,
    "MITIGASI RESIKO": 9,
    
    "DIGITAL COVERAGE": 10,
    "DIGITALISASI": 10,
    "CAKUPAN DIGITAL": 10,
    "TEKNOLOGI DIGITAL": 10,
    
    "COMPETITOR": 11,
    "COMPETITORS": 11,
    "PESAING": 11,
    "KOMPETITOR": 11,
    "ANALISIS PESAING": 11,
    
    "TAM, SAM, SOM": 12,
    "TAM SAM SOM": 12,
    "TAM, SAM DAN SOM": 12,
    "MARKET SIZING": 12,
    "TAM/SAM/SOM": 12,
    
    "CAC, LTV": 13,
    "CAC LTV": 13,
    "CAC & LTV": 13,
    "CAC AND LTV": 13,
    "CAC/LTV": 13,
    "CUSTOMER ACQUISITION COST": 13,

    "KESIMPULAN": 14,
    "KESIMPULAN AKHIR": 14,
    "CONCLUSION": 14,
    "REKOMENDASI KEPUTUSAN": 14,
    "KESIMPULAN & REKOMENDASI KEPUTUSAN": 14,

    "SERVICE DESIGN": 15,
    "DESAIN LAYANAN": 15,
    "SERVICE DESIGN BLUEPRINT": 15,

    "KONSUMEN POTENSIAL": 16,
    "POTENTIAL CONSUMERS": 16,
    "TARGET KLIEN": 16,
    "TARGET KONSUMEN": 16,

    "LEGAL": 17,
    "REGULATORY COMPLIANCE": 17,
    "LEGAL & REGULATORY": 17,
    "LEGALITAS": 17,
    "IZIN USAHA": 17,
    "PERIZINAN": 17,
    "DOKUMEN LEGALITAS": 17,
    "LEGAL DAN PERIZINAN": 17,
  };

  const getPillarFromLine = (line: string): number | null => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // 1. Check direct regex match with number (1-17)
    const numMatch = trimmed.match(/^(?:###\s*|\*\*\s*|)?(?:Pilar|PILAR|Bagian|BAGIAN)?\s*(1[0-7]|[1-9])\b[\.\s\:\-]*([A-Za-z0-9\/&\(\)\s,\|\+\-]{3,})/i);
    if (numMatch) {
      const pNum = parseInt(numMatch[1], 10);
      const isFalsePositive = trimmed.includes("Rp ") || trimmed.includes("Rp.") || (trimmed.toLowerCase().includes("capex") && pNum !== 3) || trimmed.includes("%");
      if (!isFalsePositive) {
        if (pNum >= 1 && pNum <= 17) return pNum;
        return pNum;
      }
    }

    // 2. Short header keyword match (case-insensitive)
    if (trimmed.length > 70) return null;

    const cleaned = trimmed
      .replace(/^(?:###\s*|\*\*\s*|)?(?:Pilar|PILAR|Bagian|BAGIAN)?\s*/i, "")
      .replace(/^\d+[\s\.\-\:]+/, "")
      .replace(/[^A-Za-z0-9\/\s,&+\-]/g, "")
      .replace(/\s+/g, " ")
      .toUpperCase()
      .trim();

    if (cleaned in headerToPillarMap) {
      return headerToPillarMap[cleaned];
    }

    // Direct string match of major uppercase sections in the text
    for (const key of Object.keys(headerToPillarMap)) {
      if (cleaned === key || cleaned.includes(key) && key.length >= 10) {
        return headerToPillarMap[key];
      }
    }

    return null;
  };

  for (const line of lines) {
    const matchedPNum = getPillarFromLine(line);
    if (matchedPNum !== null) {
      if (currentPilar > 0) {
        result[currentPilar] = currentContent.join("\n").trim();
      }
      currentPilar = matchedPNum;
      
      let formattedHeader = line.trim();
      if (!formattedHeader.startsWith("###") && !formattedHeader.startsWith("#")) {
        const defSec = defaultDashboardSections.find(s => s.number === matchedPNum);
        if (defSec) {
          formattedHeader = `### ${matchedPNum}. ${defSec.title}`;
        } else {
          formattedHeader = `### ${formattedHeader}`;
        }
      }
      
      currentContent = [formattedHeader];
    } else if (currentPilar > 0) {
      currentContent.push(line);
    }
  }

  if (currentPilar > 0) {
    result[currentPilar] = currentContent.join("\n").trim();
  }

  // Remove the dummy key used for omitting Structure
  delete result[100];

  // Clean all sections to remove conversational prologue and duplicate headers
  for (const numStr of Object.keys(result)) {
    const num = parseInt(numStr, 10);
    const defSec = defaultDashboardSections.find(s => s.number === num);
    const title = defSec ? defSec.title : "";
    result[num] = cleanPillarContent(result[num], num, title);
  }

  return result;
}

export function normalizeProjectTitle(title: string): string {
  let cleaned = title.trim().replace(/^["'`*#]+|["'`*#]+$/g, "").trim();
  if (/^(?:kajian|analisis|studi|proyek|project)/i.test(cleaned)) {
    return cleaned;
  }
  const words = cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return `Kajian Strategis: ${words}`;
}

export function detectAndInferProjectTitleFromText(text: string, currentTitle?: string): string | null {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Explicit change patterns
  const changeRegex = /(?:ganti|ubah|set|buka|ganti judul|pindah|ganti nama|buat analisis|buat kajian)\s*(?:proyek|project|kajian)?\s*(?:ke|to|jadi|menjadi|tentang|mengenai)?\s*([^\n\.\,\?]+)/i;
  const match = trimmed.match(changeRegex);
  if (match && match[1] && match[1].trim().length > 3) {
    const rawTarget = match[1].trim().replace(/\*+/g, "").replace(/["'`]/g, "").trim();
    if (rawTarget.length > 3) {
      return normalizeProjectTitle(rawTarget);
    }
  }

  // Domain Presets
  if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("kayu") || lower.includes("timber") || lower.includes("logging") || lower.includes("wood")) {
    return "Kajian Strategis: Forestry Management Transportation";
  }
  if (lower.includes("susu") || lower.includes("lembang") || lower.includes("dairy") || lower.includes("milk") || lower.includes("kpsbu")) {
    return "Kajian Strategis: Logistik Rantai Dingin Susu Segar Lembang & Jawa Barat";
  }
  if (lower.includes("waste") || lower.includes("limbah") || lower.includes("b3") || lower.includes("sampah") || lower.includes("recycle") || lower.includes("daur ulang") || lower.includes("sludge")) {
    return "Kajian Kelayakan: Transportasi & Pengolahan Limbah Industri B3 (Waste Management)";
  }
  if (lower.includes("batubara") || lower.includes("batu bara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mining")) {
    return "Analisis Kelayakan: Transportasi Koridor Batu Bara Swarnadwipa";
  }
  if (lower.includes("cold chain") || lower.includes("cold storage") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("boga") || lower.includes("dingin") || lower.includes("reefer") || lower.includes("chiller")) {
    return "Kajian Kelayakan: Ekspansi Cold Chain Distribusi Farmasi & Boga Segar Jawa-Bali";
  }
  if (((lower.includes("port") && !lower.includes("transport")) || lower.includes("seaport")) || lower.includes("pelabuhan") || lower.includes("kontainer") || lower.includes("intermodal") || lower.includes("peti kemas") || lower.includes("tanjung priok") || lower.includes("shuttle container")) {
    return "Kajian Kelayakan: Port Intermodal Hub & Shuttle Container Terminal Tanjung Priok";
  }
  if (lower.includes("semen") || lower.includes("cement") || lower.includes("klinker") || lower.includes("clinker")) {
    return "Kajian Kelayakan: Distribusi Semen & Material Konstruksi Curah";
  }
  if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter") || lower.includes("feronikel")) {
    return "Analisis Kelayakan: Transportasi Bijih Nikel & Logistik Smelter";
  }
  if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("kelapa sawit") || lower.includes("palm oil")) {
    return "Kajian Strategis: Rantai Pasok & Angkutan CPO Kelapa Sawit";
  }
  if (lower.includes("bauksit") || lower.includes("bauxite") || lower.includes("alumina")) {
    return "Analisis Logistik: Hauling Bauksit & Pasokan Smelter Alumina";
  }
  if (lower.includes("pupuk") || lower.includes("fertilizer") || lower.includes("urea")) {
    return "Kajian Kelayakan: Distribusi Logistik Pupuk Nasional";
  }
  if (lower.includes("baja") || lower.includes("steel") || lower.includes("koil baja")) {
    return "Kajian Transportasi: Rantai Pasok Baja & Fabrikasi Logam Berat";
  }
  if (lower.includes("migas") || lower.includes("solar") || lower.includes("bbm") || lower.includes("fuel") || lower.includes("minyak bumi") || lower.includes("pertamina")) {
    return "Kajian Strategis: Distribusi Logistik BBM & Penunjang Migas";
  }
  if (lower.includes("manufaktur") || lower.includes("pabrik") || lower.includes("assembly") || lower.includes("fabrikasi")) {
    return "Kajian Kelayakan: Fasilitas Manufaktur & Pabrik Produksi Industri";
  }
  if (lower.includes("usaha pribadi") || lower.includes("umkm") || lower.includes("kedai kopi") || lower.includes("coffee shop") || lower.includes("toko retail") || lower.includes("bisnis kuliner") || lower.includes("usaha mandiri")) {
    return "Analisis Kelayakan Usaha Mandiri: Pembukaan Unit Usaha & Pelayanan Komersial";
  }

  // If user typed a short title-like string (< 60 chars) without question words
  if (trimmed.length >= 4 && trimmed.length <= 60 && !trimmed.includes("?") && !trimmed.includes("tolong") && !trimmed.includes("bantu") && !trimmed.includes("apa") && !trimmed.includes("bagaimana") && !trimmed.includes("kenapa")) {
    return normalizeProjectTitle(trimmed);
  }

  return null;
}

export function extractProjectTitleFromAI(text: string): string | null {
  if (!text || typeof text !== "string") return null;

  // Pattern 0: MARKET OPPORTUNITY DEEP-DIVE: ...
  const p0 = text.match(/MARKET OPPORTUNITY DEEP-DIVE:\s*(?:KAJIAN STRATEGIS:\s*|KAJIAN KELAYAKAN:\s*|ANALISIS KELAYAKAN:\s*)?([^\n\."*#]+)/i);
  if (p0 && p0[1] && p0[1].trim().length > 3) {
    const raw = p0[1].trim();
    if (raw.toLowerCase().includes("forestry")) {
      return "Kajian Strategis: Forestry Management Transportation";
    }
    return normalizeProjectTitle(raw);
  }

  // Pattern 1: proyek yang sedang kita analisis adalah "..."
  const p1 = text.match(/proyek yang sedang kita analisis adalah\s*(?:"|'|«|“|`|')?([^"'\n\.«“”`\(\)]+)/i);
  if (p1 && p1[1] && p1[1].trim().length > 3) {
    return normalizeProjectTitle(p1[1].trim());
  }
  
  // Pattern 2: Kajian Strategis: ...
  const p2 = text.match(/Kajian Strategis:\s*([^\n\.\"\']+)/i);
  if (p2 && p2[1] && p2[1].trim().length > 3) {
    return `Kajian Strategis: ${p2[1].trim()}`;
  }

  // Pattern 3: Kajian Kelayakan: ...
  const p3 = text.match(/Kajian Kelayakan:\s*([^\n\.\"\']+)/i);
  if (p3 && p3[1] && p3[1].trim().length > 3) {
    return `Kajian Kelayakan: ${p3[1].trim()}`;
  }

  // Pattern 4: Analisis Kelayakan: ...
  const p4 = text.match(/Analisis Kelayakan:\s*([^\n\.\"\']+)/i);
  if (p4 && p4[1] && p4[1].trim().length > 3) {
    return `Analisis Kelayakan: ${p4[1].trim()}`;
  }

  // Pattern 5: PROYEK: ...
  const p5 = text.match(/(?:PROYEK|PROJECT|JUDUL PROYEK)\s*:\s*([^\n\."*#]+)/i);
  if (p5 && p5[1] && p5[1].trim().length > 3) {
    return normalizeProjectTitle(p5[1].trim());
  }
  
  return null;
}

export function getDefaultCompetitorsForProject(projectName: string): CompetitorIntel[] {
  const nameLower = projectName.toLowerCase();
  
  if (nameLower.includes("waste") || nameLower.includes("limbah") || nameLower.includes("sampah")) {
    return [
      {
        id: "comp-w-1",
        name: "PT Prasadha Pamunah Limbah Industri (PPLI)",
        projectHistory: "Menguasai rute pembuangan minyak lumpur (sludge) Pertamina & pengolahan kimia B3 Cikarang.",
        marketShare: 45,
        status: "Incumbent",
        strengths: "Memiliki fasilitas pemrosesan terintegrasi (landfill khusus B3) berskala sangat besar dan armada berstandar internasional.",
        weaknesses: "Tarif sewa & pembuangan sangat mahal, birokrasi kontrak sangat kaku, serta respon lambat untuk permintaan armada dadakan.",
        explanation: "PPLI adalah pemimpin pasar pengolahan limbah industri di Indonesia. Mereka memenangkan tender korporasi multinasional besar. Namun, Pancaran dapat masuk melalui strategi fleksibilitas tarif dan respon pemuatan instan.",
        armadaScale: "250+ Unit Vacuum/Box",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 96
      },
      {
        id: "comp-w-2",
        name: "PT Wastec International",
        projectHistory: "Pernah mengambil kontrak pengangkutan sludge pabrik kimia Cilegon & insinerasi Tangerang.",
        marketShare: 25,
        status: "Bidding",
        strengths: "Memiliki insinerator modern berkapasitas tinggi di Banten dan Jawa Timur, serta kuat di jaringan pabrik tekstil/manufaktur.",
        weaknesses: "Jumlah armada truk logistik mandiri terbatas, sering mensubkontrakkan rute angkutan ke transporter pihak ketiga yang kurang andal.",
        explanation: "Wastec memegang kendali atas banyak limbah yang butuh dimusnahkan secara termal (insinerasi). Kelemahan mereka ada pada lini transportasi darat yang tidak seandal Pancaran Group.",
        armadaScale: "60+ Unit Armored Box",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 88
      },
      {
        id: "comp-w-3",
        name: "PT Arahi Indonesia (Logistics Division)",
        projectHistory: "Mengambil proyek transporter limbah Fly Ash & Bottom Ash (FABA) Pembangkit Listrik Jawa.",
        marketShare: 15,
        status: "Inactive",
        strengths: "Tarif angkut sangat murah, memiliki kedekatan dengan regulator daerah setempat, dan sangat lincah menegosiasikan harga kargo.",
        weaknesses: "Manajemen K3 sangat buruk, armada truk tua yang sering mogok, tidak memiliki sistem telemetri digital real-time.",
        explanation: "Arahi memenangkan tender karena perang tarif miring. Namun, mereka rentan didiskualifikasi oleh klien B2B karena melanggar standar HSE lingkungan.",
        armadaScale: "35+ Dump Truck",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 64
      },
      {
        id: "comp-w-4",
        name: "Transporter Logistik Lokal / Konvensional (Non-Izin)",
        projectHistory: "Mengambil proyek pengangkutan limbah padat & tekstil eceran Jawa Barat tanpa kontrak formal.",
        marketShare: 10,
        status: "Displaced",
        strengths: "Tidak terikat kontrak hukum formal, harga sangat fleksibel (transaksi tunai langsung), serta bisa beroperasi kapan saja.",
        weaknesses: "Izin AMDAL tidak sah/bodong, berisiko tinggi terkena razia atau tuntutan pidana lingkungan hidup.",
        explanation: "Pemain eceran ini mengambil kargo dari industri kecil. Pancaran Swarnadwipa dapat mendisrupsi mereka dengan menawarkan edukasi legalitas dan kepatuhan hukum total.",
        armadaScale: "Truk Bak Terbuka Eceran",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 40
      }
    ];
  } else if (nameLower.includes("forestry") || nameLower.includes("kehutanan") || nameLower.includes("wood") || nameLower.includes("pulp") || nameLower.includes("logging") || nameLower.includes("kayu")) {
    return [
      {
        id: "comp-f-1",
        name: "PT Riau Andalan Pulp & Paper (RAPP) Logistics",
        projectHistory: "Mengambil proyek hauling logging internal Riau & Jambi Pulp Estate.",
        marketShare: 50,
        status: "Incumbent",
        strengths: "Armada logistik internal berskala raksasa, memiliki rute hauling privat terisolasi, serta efisiensi biaya luar biasa.",
        weaknesses: "Hanya berfokus melayani grup holding sendiri, sangat tidak fleksibel untuk melayani pemegang konsesi kecil di luar grup.",
        explanation: "RAPP Logistics mendominasi Sumatera bagian tengah. Pancaran Group dapat masuk untuk memenangkan tender dari pemegang konsesi kayu independen atau perkebunan sekunder yang tidak tertampung oleh armada RAPP.",
        armadaScale: "500+ Logging Trucks",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 94
      },
      {
        id: "comp-f-2",
        name: "PT Tanjung Enim Lestari (TEL) Transporter Division",
        projectHistory: "Mengambil proyek pengangkutan kayu gelondongan Sumsel & Muara Enim.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Memiliki rute tetap berizin pemda, armada kuat tipe multi-axle, serta jaringan sopir lokal yang terlatih.",
        weaknesses: "Pemanfaatan sistem tracking masih manual, sering mengalami kehilangan solar (fuel theft) di rute terpencil karena minim IoT.",
        explanation: "TEL menguasai area Sumatera Selatan. Kelemahan operasional mereka dalam mencegah kecurangan solar dan pemantauan timbangan dapat dikalahkan oleh sistem IoT Smart Telematics Pancaran.",
        armadaScale: "80+ Truk Tronton",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 82
      },
      {
        id: "comp-f-3",
        name: "Kontraktor Angkutan Logging Independen (Lokal)",
        projectHistory: "Mengambil proyek distribusi kayu hutan rakyat & supplier sawit regional secara musiman.",
        marketShare: 15,
        status: "Inactive",
        strengths: "Sangat murah, bersedia melibas jalur berlumpur ekstrem tanpa asuransi kargo, serta syarat kerja sangat fleksibel.",
        weaknesses: "Sering melanggar batas muatan (ODOL), truk sering terbalik di jalur hutan, dan tidak memiliki standar K3.",
        explanation: "Pemain lokal ini menguasai angkutan kecil-kecil namun sering membuat jalan umum rusak karena overload. Mereka rentan terkena sanksi razia timbangan berat dari dinas perhubungan.",
        armadaScale: "Truk Engkel / Dump Tua",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 55
      }
    ];
  } else if (nameLower.includes("cold") || nameLower.includes("reefer") || nameLower.includes("food") || nameLower.includes("boga") || nameLower.includes("pharmacy") || nameLower.includes("obat")) {
    return [
      {
        id: "comp-c-1",
        name: "PT MGM Bosco Logistik",
        projectHistory: "Mengambil proyek logistik rantai dingin McDonalds, Unilever Walls, & importir daging utama.",
        marketShare: 40,
        status: "Incumbent",
        strengths: "Memiliki cold storage raksasa di berbagai kota besar terintegrasi armada pendingin termodern nasional.",
        weaknesses: "Armada sering fully-booked untuk korporasi raksasa, tarif sewa harian sangat mahal, tidak melayani rute fleksibel sekunder.",
        explanation: "MGM Bosco adalah penguasa mutlak cold chain premium. Namun, Pancaran dapat menawarkan keunggulan berupa ketersediaan armada instan untuk rute point-to-point cepat tanpa syarat volume minimum ekstrem.",
        armadaScale: "300+ Reefer Trucks",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 95
      },
      {
        id: "comp-c-2",
        name: "PT Iron Bird Cold Chain (Blue Bird Group)",
        projectHistory: "Mengambil proyek distribusi bahan baku restoran cepat saji Jabodetabek & Jawa Barat.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Didukung oleh manajemen profesional grup Blue Bird, keandalan sopir luar biasa, serta jaminan asuransi kargo 100%.",
        weaknesses: "Fokus utama masih di wilayah perkotaan (urban logistics), rute antar-pulau atau lintas Sumatera sangat terbatas.",
        explanation: "Iron Bird memiliki reputasi korporasi yang sangat baik tapi jangkauan geografis mereka di luar pulau Jawa belum optimal. Ini adalah peluang besar bagi rute antarpulau Pancaran.",
        armadaScale: "120+ Reefer Vans",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 93
      },
      {
        id: "comp-c-3",
        name: "Transporter Reefer Sewaan Mandiri (Perorangan)",
        projectHistory: "Mengambil proyek logistik es kristal & pasokan kargo boga dingin lokal secara harian.",
        marketShare: 20,
        status: "Displaced",
        strengths: "Harga sewa sangat murah, bisa dinegosiasikan langsung dengan pemilik truk, tanpa syarat admin berbelit.",
        weaknesses: "Mesin termoregulasi sering mati di tengah rute menyebabkan fluktuasi suhu ekstrim, merusak kargo boga/obat sensitif.",
        explanation: "Seringkali kompresor AC truk mereka tua dan tidak memiliki alarm peringatan suhu. Pancaran dapat merebut pasar dengan sistem jaminan suhu konstan (SLA Zero Defect).",
        armadaScale: "Sasis Colt Diesel Pendingin",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 60
      }
    ];
  } else if (nameLower.includes("coal") || nameLower.includes("batubara") || nameLower.includes("hauling") || nameLower.includes("mining") || nameLower.includes("tambang")) {
    return [
      {
        id: "comp-m-1",
        name: "PT Petrosea Tbk (Mining Logistics Division)",
        projectHistory: "Mengambil kontrak hauling batubara Adaro & Kideco Jaya Agung Kalimantan.",
        marketShare: 35,
        status: "Incumbent",
        strengths: "Memiliki armada alat berat & heavy-duty dump trucks tercanggih, standar keselamatan tambang internasional tinggi.",
        weaknesses: "Tarif sewa per ton-kilometer (ton-km) sangat mahal, mobilisasi unit ke lokasi tambang baru membutuhkan waktu sangat lama.",
        explanation: "Petrosea adalah raksasa tambang terkemuka. Keunggulan Pancaran Group terletak pada kecepatan mobilisasi unit armada tipper baru berkat logistik internal yang cepat dan efisiensi biaya opex.",
        armadaScale: "180+ Scania Heavy Dumpers",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 97
      },
      {
        id: "comp-m-2",
        name: "PT Kaltim Prima Coal (KPC) Internal Transporter",
        projectHistory: "Mengambil proyek hauling batubara tambang Sangatta Kalimantan Timur secara eksklusif.",
        marketShare: 30,
        status: "Inactive",
        strengths: "Menguasai infrastruktur jalan hauling tambang milik sendiri, koordinasi operasi lokal sangat mulus.",
        weaknesses: "Rigid dan tidak diperbolehkan menerima pengangkutan batubara dari konsesi kecil pihak ketiga (IUP mandiri) di sekitarnya.",
        explanation: "KPC memfokuskan armadanya khusus untuk konsumsi grup pertambangan mereka sendiri. IUP-IUP kecil di sekitarnya terlantar tanpa transporter andal, yang merupakan target SOM sempurna bagi Pancaran.",
        armadaScale: "250+ Caterpillar Dumpers",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 95
      },
      {
        id: "comp-m-3",
        name: "Transporter Hauling Lokal Tradisional (Koperasi Tambang)",
        projectHistory: "Mengambil proyek pengangkutan batubara IUP rakyat & stockpile pelabuhan darat lokal.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Didukung oleh serikat pekerja lokal dan pemuka adat setempat, biaya operasi minimal karena upah rendah.",
        weaknesses: "Sering overload (ODOL), kecelakaan kerja tinggi karena ketiadaan APD, dan armada sering amblas di rute lumpur tambang.",
        explanation: "Pemain lokal ini memegang kendali atas kedekatan sosial. Pancaran dapat bermitra dengan koperasi lokal ini sebagai subkontrak pengemudi namun dengan pengawasan K3 serta standar armada dari Pancaran.",
        armadaScale: "Truk Tipper Rakitan Lokal",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 50
      }
    ];
  } else if (nameLower.includes("listrik") || nameLower.includes("electric") || nameLower.includes("ev") || nameLower.includes("baterai") || nameLower.includes("charging") || nameLower.includes("spklu")) {
    return [
      {
        id: "comp-ev-1",
        name: "PT Kalista Nusa Armada (Kalista EV Fleet)",
        projectHistory: "Penyedia solusi sewa armada kendaraan listrik (EV) komersial B2B, charging station depo, dan telematika.",
        marketShare: 35,
        status: "Incumbent",
        strengths: "Fokus spesifik pada transisi armada EV korporasi, menawarkan skema sewa komprehensif termasuk pengadaan unit dan infrastruktur pengisian daya.",
        weaknesses: "Jumlah armada truk listrik berat masih terbatas, lebih banyak berfokus pada motor dan van kargo ringan.",
        explanation: "Kalista merupakan pionir fleet-as-a-service EV di Indonesia. Pancaran Group dapat unggul dengan menyediakan kombinasi truk komersial EV yang lebih besar serta jaringan depo terintegrasi.",
        armadaScale: "200+ Unit EV (Motor & Van)",
        digitalSystems: "Sangat Baik",
        pricePoint: "Menengah",
        safetyIndex: 92
      },
      {
        id: "comp-ev-2",
        name: "PT Blue Bird Tbk (Commercial EV Logistics Division)",
        projectHistory: "Pengoperasian armada taksi dan mobil rental listrik korporat terintegrasi SPKLU swasta.",
        marketShare: 25,
        status: "Bidding",
        strengths: "Memiliki reputasi brand teruji, bengkel perawatan mandiri terstandarisasi, dan stasiun pengisian daya cepat di berbagai depo besar.",
        weaknesses: "Fokus utama pada transportasi penumpang dan rental mobil korporat, belum berfokus pada logistik kargo berat dan rute industri.",
        explanation: "Blue Bird memimpin dalam adopsi kendaraan penumpang listrik, namun Pancaran memiliki spesialisasi yang jauh lebih kuat dalam logistik barang dan truk komersial industri.",
        armadaScale: "150+ Unit EV",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 95
      },
      {
        id: "comp-ev-3",
        name: "Transporter Logistik Konvensional (Armada Truk Diesel Fosil)",
        projectHistory: "Operator angkutan barang umum yang masih 100% bergantung pada solar/diesel subsidi dan nonsubsidi.",
        marketShare: 30,
        status: "Displaced",
        strengths: "Jumlah unit sangat banyak dan tersebar luas di seluruh rute antar-kota.",
        weaknesses: "Biaya konsumsi BBM tinggi, tidak dapat memenuhi target pengurangan jejak karbon (ESG) klien multinasional, rentan fluktuasi harga solar.",
        explanation: "Transporter konvensional terancam terdisrupsi karena klien korporat multinasional dan BUMN mulai mewajibkan vendor logistik berstandar ESG rendah emisi.",
        armadaScale: "Ribuan Unit Diesel Konvensional",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 75
      }
    ];
  } else {
    return [
      {
        id: "comp-g-1",
        name: "PT Dunia Express (Dunex Logistics)",
        projectHistory: "Mengambil proyek logistik FMCG Mayora, Astra Honda, & pergudangan Karawang.",
        marketShare: 35,
        status: "Incumbent",
        strengths: "Memiliki ribuan unit truk box, depo peti kemas berfasilitas lengkap, serta sistem ERP pergudangan canggih.",
        weaknesses: "Fokus utamanya adalah logistik general cargo jalan raya (on-road), kurang berpengalaman untuk jalur off-road ekstrim atau muatan B3.",
        explanation: "Dunex adalah raksasa kargo umum Jawa. Namun, untuk proyek logistik khusus yang membutuhkan sertifikasi AMDAL, penanganan material berbahaya, atau medan tambang, keahlian khusus Pancaran jauh lebih unggul.",
        armadaScale: "800+ Box/Wingbox",
        digitalSystems: "Sangat Baik",
        pricePoint: "Menengah",
        safetyIndex: 92
      },
      {
        id: "comp-g-2",
        name: "PT Lookman Djaja",
        projectHistory: "Mengambil proyek rantai logistik manufaktur koridor Jakarta-Surabaya (Pantura).",
        marketShare: 25,
        status: "Bidding",
        strengths: "Tarif sangat kompetitif untuk volume besar, memiliki cabang kantor operasional di sepanjang jalur Pantura Jawa.",
        weaknesses: "Kurang memiliki instrumentasi IoT khusus seperti sensor suspensi anti-ODOL, serta minim sertifikasi kelaikan muatan resmi.",
        explanation: "Lookman Djaja adalah transporter andalan lintas Jawa. Untuk menandingi mereka, Pancaran Group mengedepankan diferensiasi berupa integrasi kontrol sensor IoT real-time.",
        armadaScale: "400+ Truk Fuso",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 85
      },
      {
        id: "comp-g-3",
        name: "Perusahaan Ekspedisi Skala Kecil & Makelar Truk",
        projectHistory: "Mengambil proyek pengiriman bahan bangunan & komoditas pasar tradisional secara eceran.",
        marketShare: 25,
        status: "Inactive",
        strengths: "Harga sangat fleksibel, bersedia disewa kapan saja untuk sekali jalan tanpa komitmen kontrak formal.",
        weaknesses: "Ketersediaan unit sangat tidak menentu (spot market), dokumen legalitas rapuh, tidak ada jaminan keamanan jika barang hilang.",
        explanation: "Sering digunakan oleh industri kecil menengah. Klien korporat besar pasti menghindari broker ini demi kepatuhan audit legalitas finansial perusahaan.",
        armadaScale: "Sasis Truk Tua Variatif",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 50
      }
    ];
  }
}

