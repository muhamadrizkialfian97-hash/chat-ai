/**
 * Service Design Generator (Pilar 15)
 * Dynamically synthesizes title-tailored end-to-end Service Design Blueprint,
 * Client Journey Mapping, SLA standards, and Operational Fail-Safe protocols.
 */

import { detectProjectArchetype } from "./archetypeDetector.ts";

export interface ServiceDesignResult {
  title: string;
  division: string;
  sectorName: string;
  targetCommodity: string;
  clientJourney: {
    stage: string;
    touchpoints: string;
    description: string;
    kpi: string;
  }[];
  operationalBlueprint: {
    serviceCode: string;
    title: string;
    standard: string;
    detail: string;
  }[];
  failSafeProtocols: {
    incident: string;
    mitigation: string;
    slaResolution: string;
  }[];
  cxMetrics: {
    metric: string;
    target: string;
    explanation: string;
  }[];
  narrativeMarkdown: string;
}

export function generateServiceDesignForTitle(projectTitle: string, divisionName?: string): ServiceDesignResult {
  const pName = (projectTitle || "Kajian Kelayakan Strategis Logistik").trim();
  const lower = pName.toLowerCase();
  const divName = divisionName || "Logistik & Transportasi";

  // Clean title for commodity text
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
    const sector = "Rantai Dingin Susu Segar & Dairy Cold Chain Logistics";
    const commodity = "Susu Murni Segar (Fresh Raw Milk) & Olahan Susu Dingin";

    const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Status:** Terstruktur Rapih • Standar Kelaikan Food-Grade BPOM & SNI 3141.1:2011

---

## 1. ARSITEKTUR SIKLUS KLIEN (CLIENT JOURNEY MAPPING)
Desain layanan dirancang khusus untuk memenuhi siklus pemerahan susu sapi harian peternak Lembang & Jawa Barat menuju pabrik pengolahan susu (IPS) secara terjadwal:
- **Tahap 1 - Onboarding & Audit Sanitasi Tangki:** Tim teknis PRAMA dan quality assurance klien melakukan inspeksi kebersihan manhole tangki stainless steel 304/316, kalibrasi sensor suhu chiller, dan uji residu pembersih sebelum armada diterjunkan ke rute.
- **Tahap 2 - Penjadwalan Ritase Pasca Pemerahan:** Pengambilan susu terjadwal ketat 2 kali sehari (Ritase Pagi pukul 05.30–08.30 WIB dan Ritase Sore pukul 14.30–17.30 WIB) langsung di cooling center koperasi peternak (KPSBU Lembang & sekitarnya) guna menghindari kenaikan derajat keasaman susu.
- **Tahap 3 - Monitoring Suhu Aktif Sepanjang Perjalanan:** Sensor telematika IoT mengirimkan data suhu real-time setiap 3 menit dengan rentang stabil 2°C – 4°C, dilengkapi alarm otomatis ke control tower apabila deviasi suhu menyentuh > 5°C.
- **Tahap 4 - Uji Penerimaan di Pabrik & Serah Terima Digital:** Setibanya di gerbang pabrik IPS, pengemudi menyerahkan e-surat jalan dan data log suhu digital, dilanjutkan pengujian sampel laboratorium (uji alkohol, berat jenis, dan reduktase) sebelum proses bongkar tangki (unloading).

---

## 2. BLUEPRINT OPERASIONAL & PROSEDUR STANDAR LAYANAN
- **SOP Sanitasi Clean-In-Place (CIP) Otomatis:** Setiap unit tangki wajib melalui proses siklus pencucian kimia CIP food-grade (pembilasan air hangat, sirkulasi caustic soda, asam nitrat, dan bilasan akhir steril) maksimal 2 jam setelah pembongkaran.
- **Agitator Sirkulasi Kontinu:** Tangki dilengkapi sistem agitator mekanis berputar lambat guna mencegah terjadinya pemisahan lapisan krim lemak (cream layer separation) selama proses pengangkutan rute berkelok Lembang–Bandung.
- **Dedicated Driver Food-Grade:** Seluruh pengemudi dibekali sertifikasi higienitas penanganan pangan cair, APD lengkap (sepatu boots steril, hairnet, dan seragam khusus), serta pemahaman SOP penanganan darurat kebocoran seal katup bawah.

---

## 3. FAIL-SAFE PROTOCOLS & MITIGASI DARURAT LAPANGAN
- **Insiden Kerusakan Mesin Chiller Pendingin:** Unit cadangan (standby tanker) di pool Bandung dikerahkan dalam tempo < 45 menit dengan pompa transfer steril portable berdaya hisap cepat.
- **Kemacetan Ekstrem Jalur Wisata Lembang:** Implementasi rute alternatif geofencing via Cisarua–Parongpong–Padalarang dan koordinasi prioritas pengawalan logistik pangan esensial.
- **Penolakan Sampel Kualitas Susu:** Protokol investigasi silang sampel cadangan tersegel (retained sample) bersama surveyor independen untuk transparansi klaim asuransi.

---

## 4. METRIK KEPUASAN KLIEN & INDIKATOR KINERJA (KPI)
- **Ketepatan Waktu Penerimaan (On-Time Delivery):** Target ≥ 99.2% sesuai batas toleransi asam susu sebelum dipasteurisasi.
- **Konsistensi Suhu Kargo Selama Transit:** 100% data log suhu berada pada rentang 2°C – 4°C tanpa insiden thermal shock.
- **Customer Satisfaction Score (CSAT):** Target skor ≥ 95% dari manajer logistik dan quality control pabrik pengolahan susu.`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetCommodity: commodity,
      clientJourney: [
        {
          stage: "Tahap 1: Onboarding & Audit Sanitasi",
          touchpoints: "Verifikasi sertifikat food-grade, kalibrasi sensor chiller, dan protokol sanitasi CIP tangki stainless steel.",
          description: "Pemeriksaan menyeluruh sebelum kontrak aktif untuk memastikan tangki bebas kontaminan bakteri dan residu kimia.",
          kpi: "Audit Kelaikan Food-Grade: 100% Lolos"
        },
        {
          stage: "Tahap 2: Ritase Pasca Pemerahan",
          touchpoints: "Jadwal ritase pagi (05.30-08.30) & sore (14.30-17.30) di Cooling Center KPSBU Lembang.",
          description: "Pengangkutan susu segar segera setelah diperah untuk menjaga kestabilan bakteriologis dan berat jenis.",
          kpi: "Waktu Muat Cooling Center: < 40 Menit"
        },
        {
          stage: "Tahap 3: Pemantauan Suhu IoT Real-Time",
          touchpoints: "PRAMA Telematics Dashboard, sensor digital logger 2°C–4°C, agitator sirkulasi susu.",
          description: "Transmisi data suhu per 3 menit dengan alert dini jika ada fluktuasi menuju control room 24/7.",
          kpi: "Deviasi Suhu Maksimal: ± 0.5°C"
        },
        {
          stage: "Tahap 4: Penerimaan Pabrik & e-DO",
          touchpoints: "Pabrik IPS (Ultrajaya, Cimory, Frisian Flag, dll.), uji lab cepat (alkohol & BJ), serah terima digital.",
          description: "Proses transfer muatan ke silo penyimpanan pabrik dengan sistem pompa aseptik tertutup.",
          kpi: "Waktu Unloading Pabrik: < 50 Menit"
        }
      ],
      operationalBlueprint: [
        {
          serviceCode: "SD-CIP-01",
          title: "SOP Sanitasi Tangki Clean-In-Place (CIP)",
          standard: "Siklus 4 Tahap Sterilisasi",
          detail: "Pencucian otomatis dengan larutan alkali & asam food-grade bertekanan tinggi setiap selesai ritase."
        },
        {
          serviceCode: "SD-AGT-02",
          title: "Agitator Mekanis Anti-Separasi Lemak",
          standard: "Putaran Stabil 30 RPM",
          detail: "Pengadukan perlahan kontinu di dalam tangki agar kadar lemak susu homogen dan tidak mengendap."
        },
        {
          serviceCode: "SD-SLA-03",
          title: "Jaminan SLA Keandalan Ritase Harian",
          standard: "Zero Downtime Cadangan 1:5",
          detail: "Penyediaan 1 unit truk tangki cadangan siap gerak di pool Lembang/Bandung guna menjamin kontinuitas pasokan harian."
        },
        {
          serviceCode: "SD-TRF-04",
          title: "Indeksasi Tarif Transparan & Terukur",
          standard: "IDR per Liter / KM Terikat SLA",
          detail: "Struktur biaya transparan berbasis literase muatan dengan penyesuaian harga BBM industri yang jelas."
        }
      ],
      failSafeProtocols: [
        {
          incident: "Kenaikan Suhu Tangki > 5°C",
          mitigation: "Aktivasi genset kompresor auxiliary cadangan dan rute prioritas darurat ke processing plant terdekat.",
          slaResolution: "Respon Teknis < 15 Menit"
        },
        {
          incident: "Kemacetan Jalur Wisata Lembang",
          mitigation: "Pengalihan rute otomatis via koridor logistik Cisarua–Padalarang dipandu PRAMA Smart Routing.",
          slaResolution: "Deviasi Jadwal < 25 Menit"
        },
        {
          incident: "Kendala Kerusakan Mesin Truk",
          mitigation: "Pengerahan truk penarik evakuasi & transfer susu menggunakan pompa portabel stainless steel steril.",
          slaResolution: "Truk Pengganti Tiba < 45 Menit"
        }
      ],
      cxMetrics: [
        {
          metric: "On-Time In-Full (OTIF)",
          target: "≥ 99.2%",
          explanation: "Ketepatan waktu tiba di receiving plant sebelum batas kadaluwarsa toleransi asam susu mentah."
        },
        {
          metric: "Kestabilan Suhu 2°C – 4°C",
          target: "99.8%",
          explanation: "Persentase perjalanan di mana suhu susu berada dalam koridor dingin optimal standar BPOM."
        },
        {
          metric: "Tingkat Kerusakan Muatan (Spillage/Spoilage)",
          target: "< 0.05%",
          explanation: "Jaminan proteksi komoditas bernilai tinggi dengan tingkat kehilangan fisik mendekati nol."
        },
        {
          metric: "Client Net Promoter Score (NPS)",
          target: "+78",
          explanation: "Tingkat kepuasan dan loyalitas manajer pengadaan IPS serta pengurus koperasi peternak."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 2. Semen / Cement / Clinker
  if (lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("klinker")) {
    const sector = "Logistik Distribusi Semen Curah & Bahan Bangunan Industri";
    const commodity = "Semen Curah Kering & Clinker";

    const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Kepatuhan MST Kemenhub & Keselamatan Bejana Tekan Silo

---

## 1. ARSITEKTUR SIKLUS KLIEN (CLIENT JOURNEY MAPPING)
- **Onboarding & Kalibrasi Silo:** Verifikasi nozel kompresor blower, pengujian sambungan pipa coupling unloader, dan sinkronisasi kapasitas silo penampung batching plant mitra.
- **Dispatch & Pemuatan di Pabrik Semen:** Penimbangan gandar otomatis, pengisian semen curah melalui corong spout berfilter debu, serta penyegelan manhole dengan segel bernomor seri.
- **Monitoring Koridor Angkutan Bebas ODOL:** Pelacakan rute tol dan arteri via PRAMA Telematics dengan pengawasan berat sumbu terberat (MST) 10 ton agar terhindar dari tilang jembatan timbang WIM.
- **Bongkar Tekanan Pneumatik Cepat:** Proses discharge udara bertekanan tinggi (1.5-2.0 bar) langsung ke silo vertikal tanpa polusi debu beterbangan.

---

## 2. BLUEPRINT OPERASIONAL
- **Standardisasi Unloader Blower Tekanan Tinggi:** Waktu pembongkaran muatan 25-30 ton tuntas dalam durasi < 45 menit.
- **Pemeliharaan Kompresor Terjadwal:** Inspeksi filter udara blower per 200 jam kerja untuk mencegah keausan piston kompresor.
- **SOP Nol Ceceran Semen (Zero Dust Spillage):** Penggunaan selang unloader heavy-duty tahan abrasi dengan klem pengunci ganda.

---

## 3. FAIL-SAFE PROTOCOLS
- **Pipa Silo Tersumbat (Choked Hose):** Prosedur dekompresi darurat dan pembersihan pipa dengan katup blow-back khusus.
- **Kerusakan Kompresor Saat Bongkar:** Penyediaan truk cadangan bertenaga PTO independen untuk menuntaskan pemompaan semen.

---

## 4. METRIK KEPUASAN KLIEN
- **SLA Waktu Bongkar Silo:** < 45 Menit per 28 Ton
- **Keandalan Ritase Sesuai Jadwal Proyek Ready-Mix:** ≥ 98.8%
- **Nol Insiden ODOL & Pelanggaran Lalu Lintas:** 100% Kepatuhan`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetCommodity: commodity,
      clientJourney: [
        {
          stage: "Tahap 1: Sinkronisasi Silo Pabrik",
          touchpoints: "Pemeriksaan pipa konektor batching plant, uji tekanan kompresor, kalibrasi jembatan timbang.",
          description: "Memastikan kompatibilitas armada tangki kapsul dengan silo penerima klien.",
          kpi: "Kesesuaian Nozel: 100%"
        },
        {
          stage: "Tahap 2: Pemuatan Pabrik Semen",
          touchpoints: "Loading spout otomatis, e-weighbridge, segel digital manhole.",
          description: "Pengisian presisi sesuai kapasitas batas tonase MST 10 ton resmi Kemenhub.",
          kpi: "Waktu Muat: < 35 Menit"
        },
        {
          stage: "Tahap 3: Transit Bebas ODOL",
          touchpoints: "GPS tracking, integrasi sensor batas kecepatan jalan tol.",
          description: "Perjalanan terkawal dengan mitigasi kemacetan menuju simpul proyek infrastruktur.",
          kpi: "Kecepatan Aman: 60-70 km/jam"
        },
        {
          stage: "Tahap 4: Pembongkaran Pneumatik",
          touchpoints: "Kompresor unloader 2 bar, selang food-grade/cement grade bebas debu.",
          description: "Penghembusan semen curah ke tangki silo vertikal batching plant mitra.",
          kpi: "Waktu Discharge: < 45 Menit"
        }
      ],
      operationalBlueprint: [
        {
          serviceCode: "SD-BLW-01",
          title: "SOP Kompresor Blower Pneumatik",
          standard: "Tekanan Kerja 1.8 Bar",
          detail: "Pengaturan katup fluida udara stabil untuk memastikan pengosongan tangki tanpa sisa kerak semen."
        },
        {
          serviceCode: "SD-ODL-02",
          title: "Kepatuhan Total Batas Muatan (Zero ODOL)",
          standard: "Batas MST 10 Ton Jalan Kelas I",
          detail: "Jaminan bebas sanksi tilang dan bebas hambatan di setiap jembatan timbang elektronik (WIM)."
        },
        {
          serviceCode: "SD-SCH-03",
          title: "Penjadwalan Ritase Berbasis Jadwal Pengecoran",
          standard: "Sinkronisasi Just-In-Time (JIT)",
          detail: "Pengiriman terjadwal sesuai ritme batching plant proyek jalan tol atau gedung tinggi."
        },
        {
          serviceCode: "SD-SAF-04",
          title: "Protokol Bejana Tekan Disnaker",
          standard: "Sertifikasi Uji Hidrostatik Berkala",
          detail: "Pemeriksaan integritas dinding tangki kapsul secara berkala guna menjamin keselamatan kerja K3."
        }
      ],
      failSafeProtocols: [
        {
          incident: "Kompresor Mati Mendadak",
          mitigation: "Aktivasi unit kompresor cadangan terpasang pada prime mover pendukung.",
          slaResolution: "Pemulihan < 20 Menit"
        },
        {
          incident: "Penyumbatan Jalur Pipa Silo",
          mitigation: "Pelepasan tekanan terarah melalui blow-off valve dan pembersihan selang bertekanan.",
          slaResolution: "Normalisasi < 30 Menit"
        },
        {
          incident: "Antrean Padat di Silo Proyek",
          mitigation: "Koordinasi real-time via PRAMA Dispatcher untuk penjadwalan ulang ritase susulan.",
          slaResolution: "Respon Dispatch < 10 Menit"
        }
      ],
      cxMetrics: [
        {
          metric: "Siklus Waktu Bongkar (Discharge Cycle)",
          target: "< 45 Menit",
          explanation: "Kecepatan pembongkaran tanpa meninggalkan residu serbuk semen di dalam kapsul."
        },
        {
          metric: "Ketepatan Pengiriman JIT",
          target: "≥ 99.0%",
          explanation: "Menghindari berhentinya aktivitas batching plant ready-mix akibat keterlambatan pasokan."
        },
        {
          metric: "Nol Kebocoran Debu Semen",
          target: "100% Bebas Emisi Debu",
          explanation: "Menjaga kebersihan area kerja batching plant dan kepatuhan baku mutu lingkungan."
        },
        {
          metric: "Retensi Kontrak Klien Korporat",
          target: "≥ 90%",
          explanation: "Tingkat perpanjangan kontrak tahunan dengan produsen semen dan kontraktor karya."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 3. Batubara / Tambang / Mining
  if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("hauling") || lower.includes("nikel")) {
    const isNickel = lower.includes("nikel") || lower.includes("nickel");
    const sector = isNickel ? "Hauling Tambang Nikel & Pasokan Smelter" : "Transportasi Hauling Batubara Tambang ke Jetty";
    const commodity = isNickel ? "Bijih Nikel Laterit (Saprolite / Limonite)" : "Batubara Termal Curah";

    const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Kepatuhan SMKP Minerba & SIMBARA ESDM

---

## 1. ARSITEKTUR SIKLUS KLIEN (CLIENT JOURNEY MAPPING)
- **Tahap 1 - Pre-Operation & Safety Induction:** Seluruh armada dan operator melewati inspeksi kelayakan tambang (commissioning unit) dengan standar K3 pertambangan ketat.
- **Tahap 2 - Pemuatan di Pit / Stockpile:** Pengisian muatan diawasi tim checker tambang dengan verifikasi muatan melalui jembatan timbang terintegrasi SIMBARA.
- **Tahap 3 - Hauling Terpantau di Dedicated Road:** Perjalanan melintasi jalan tambang khusus dengan pembatasan kecepatan maksimum 40 km/jam, diawasi sistem telematika GPS dan kamera AI DMS kelelahan sopir.
- **Tahap 4 - Dumping di Jetty / Hopper Smelter:** Manuver pembongkaran cepat di fasilitas crushing plant atau stockpile pelabuhan jetty tanpa antrean berkepanjangan.

---

## 2. BLUEPRINT OPERASIONAL & PERFORMA UNIT
- **Ketersediaan Armada (Physical Availability - PA):** Target ketersediaan armada minimal 90% dengan dukungan tim mekanik dan mobile workshop 24/7 di pitstop rute hauling.
- **SOP Keselamatan Tambang K3:** Penggunaan buggy whip, rotary lamp, radio komunikasi dua arah (two-way radio) saluran tambang, serta seatbelt 3-titik.
- **Penyiraman Jalan Hauling (Dust Control):** Pengoperasian water truck rutin untuk menjaga visibilitas pandangan dan menekan paparan debu batubara/tambang.

---

## 3. FAIL-SAFE PROTOCOLS
- **Unit Breakdown di Jalur Hauling:** Unit rescue lowbed/towing segera menarik armada ke bahu jalan dalam < 15 menit agar tidak menghambat aliran truk di belakangnya.
- **Kondisi Hujan Lebat (Slippery Road):** Protokol stop hauling otomatis saat kondisi jalan dinilai licin membahayakan hingga inspeksi tim safety menyatakan jalan layak dilalui.

---

## 4. METRIK KEPUASAN KLIEN
- **Physical Availability (PA):** ≥ 90.0%
- **Pencapaian Target Tonase Bulanan:** ≥ 98.5%
- **Tingkat Kepatuhan SIMBARA / Surat Jalan:** 100%`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetCommodity: commodity,
      clientJourney: [
        {
          stage: "Tahap 1: Commissioning Tambang",
          touchpoints: "Inspeksi K3, verifikasi SIMPER pengemudi, uji rem dan emisi gas buang.",
          description: "Audit kesiapan unit operasional sesuai kaidah pertambangan yang baik (Good Mining Practice).",
          kpi: "Lolos Uji Tambang: 100%"
        },
        {
          stage: "Tahap 2: Pemuatan Pit / Stockpile",
          touchpoints: "Loading excavator, jembatan timbang weighbridge, integrasi SIMBARA.",
          description: "Pencatatan tonase muatan secara digital sebelum memasuki koridor jalan angkut.",
          kpi: "Waktu Siklus Timbang: < 3 Menit"
        },
        {
          stage: "Tahap 3: Hauling Koridor Khusus",
          touchpoints: "GPS tracking, kontrol batas kecepatan, kamera AI Driver Monitoring System.",
          description: "Pengangkutan melintasi rute tambang dengan mitigasi debu dan kelelahan operator.",
          kpi: "Kecepatan Maksimal: 40 km/jam"
        },
        {
          stage: "Tahap 4: Dumping di Jetty / Crusher",
          touchpoints: "Manuver hopper, verifikasi surat jalan digital, pencatatan ritase akhir.",
          description: "Penurunan muatan secara presisi untuk pengisian tongkang atau pabrik pengolahan.",
          kpi: "Waktu Dumping: < 2.5 Menit"
        }
      ],
      operationalBlueprint: [
        {
          serviceCode: "SD-MIN-01",
          title: "Jaminan Ketersediaan Armada (Physical Availability)",
          standard: "PA ≥ 90% Kontinu",
          detail: "Mobile workshop dan tim mekanik siap sedia di pit-stop rute untuk meminimalkan downtime perbaikan."
        },
        {
          serviceCode: "SD-SAF-02",
          title: "SOP Keselamatan Tambang Komprehensif",
          standard: "Zero Lost Time Injury (Zero LTI)",
          detail: "Kepatuhan total terhadap sistem manajemen keselamatan pertambangan (SMKP Minerba ESDM)."
        },
        {
          serviceCode: "SD-TRK-03",
          title: "Integrasi Pelaporan Real-Time SIMBARA",
          standard: "Sinkronisasi Digital 100%",
          detail: "Setiap ritase terdata otomatis ke server pengawas untuk transparansi royalti dan legalitas komoditas."
        },
        {
          serviceCode: "SD-DUS-04",
          title: "Pengendalian Debu & Pemeliharaan Jalan",
          standard: "Siklus Water Truck Terjadwal",
          detail: "Penyiraman berkala rute hauling guna menjaga keselamatan pandangan dan kesehatan lingkungan sekitar."
        }
      ],
      failSafeProtocols: [
        {
          incident: "Truk Mogok di Rute Hauling",
          mitigation: "Unit evakuasi menarik truk ke safety bay dalam < 15 menit agar jalan tidak macet.",
          slaResolution: "Jalur Bebas < 15 Menit"
        },
        {
          incident: "Jalan Amblas / Licin Pasca Hujan",
          mitigation: "Pengerahan motor grader dan compactor tim jalan tambang untuk pemadatan cepat.",
          slaResolution: "Pemulihan Rute < 45 Menit"
        },
        {
          incident: "Deteksi Pengemudi Mengantuk via AI",
          mitigation: "Peringatan getar kursi kabin, alarm suara, dan instruksi berhenti di rest bay terdekat.",
          slaResolution: "Intervensi Instan < 3 Detik"
        }
      ],
      cxMetrics: [
        {
          metric: "Pencapaian Ritase Kontrak (Monthly Quota)",
          target: "≥ 98.5%",
          explanation: "Pemenuhan target tonase bulanan yang disepakati dengan pemilik konsesi tambang."
        },
        {
          metric: "Ketersediaan Fisik Armada (PA)",
          target: "≥ 90.0%",
          explanation: "Rasio waktu kesiapan armada beroperasi dibandingkan total jam kerja kalender."
        },
        {
          metric: "Zero Fatal Incident (K3 Tambang)",
          target: "0 Insiden",
          explanation: "Komitmen mutlak keselamatan kerja bagi seluruh operator dan aset di area tambang."
        },
        {
          metric: "Efisiensi Konsumsi Solar (Fuel Ratio)",
          target: "Sesuai Target Desain ±3%",
          explanation: "Optimalisasi rute dan gaya berkendara pengemudi untuk efisiensi biaya operasional."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // 4. Default / Archetype-Aligned (Manufacturing, Personal SME, or Custom Transport)
  const archetype = detectProjectArchetype(pName);

  if (archetype === 'manufacturing') {
    const sector = `Fasilitas Manufaktur & Fabrikasi Industri ${cleanCore}`;
    const commodity = `Produk Manufaktur & Pasokan Industri ${cleanCore}`;

    const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Manajemen Mutu Manufaktur ISO 9001:2015 & Layanan Kemitraan Industri B2B

---

## 1. ARSITEKTUR SIKLUS PELANGGAN INDUSTRI (CLIENT JOURNEY MAPPING)
- **Tahap 1 - Penjajakan Kebutuhan & Spesifikasi Teknis:** Review spesifikasi teknis produk, penerbitan Certificate of Analysis (CoA) prototipe, dan kesepakatan Minimum Order Quantity (MOQ).
- **Tahap 2 - Penjadwalan Produksi & Uji Sampel (Pilot Run):** Penjadwalan batch produksi pada sistem ERP/MRP dan verifikasi sampel perdana sebelum produksi massal.
- **Tahap 3 - Monitoring Produksi & Kontrol Kualitas Lini:** Pemantauan progres batch real-time melalui sistem SCADA dengan inspeksi kualitas ketat (reject rate < 1.5%).
- **Tahap 4 - Pengemasan Standar Industri & Pengiriman Tepat Waktu:** Pengemasan palet terstandar, pelabelan barcode batch, dan pengiriman tepat waktu ke gudang distributor (OTIF ≥ 98.8%).

---

## 2. BLUEPRINT OPERASIONAL & MUTU PABRIK
- **Total Productive Maintenance (TPM):** Perawatan terjadwal mesin pabrik guna mempertahankan Overall Equipment Effectiveness (OEE) ≥ 85%.
- **Sistem Manajemen Mutu Berlapis (Inbound, In-Process, Outbound):** Pengujian laboratorium mandiri untuk setiap kedatangan bahan baku dan produk jadi.
- **Standardisasi Keselamatan K3 & 5R:** Budaya Ringkas, Rapi, Resik, Rawat, Rajin di seluruh lantai produksi.

---

## 3. FAIL-SAFE PROTOCOLS & RENCANA KONTINUITAS BISNIS
- **Kerusakan Mesin Kritis (Breakdown):** Kesiapan teknisi siaga internal dan suku cadang kritis di lokasi dengan batas perbaikan < 30 menit.
- **Keterlambatan Pasokan Bahan Baku:** Pengamanan safety stock bahan baku minimal 21 hari kerja dan kontrak ganda dengan pemasok cadangan.
- **Deteksi Cacat Kualitas Batch:** Penghentian lini otomatis (*jidoka*), karantina batch, dan penelusuran akar masalah (*root cause analysis*).

---

## 4. INDIKATOR KINERJA UTAMA (KPI)
- **Ketepatan Pengiriman (OTIF - On-Time In-Full):** Target ≥ 98.8%
- **Tingkat Cacat Produk (Defect/Reject Rate):** Target < 1.45%
- **Kepuasan Akun Distributor:** Target ≥ 94%`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetCommodity: commodity,
      clientJourney: [
        {
          stage: "Tahap 1: Evaluasi Teknis & Spesifikasi Sampel",
          touchpoints: "Spesifikasi produk, pengujian laboratorium sampel, verifikasi CoA.",
          description: "Pencocokan toleransi mutu produk dengan kebutuhan distributor/klien industri.",
          kpi: "Waktu Validasi Sampel: < 5 Hari Kerja"
        },
        {
          stage: "Tahap 2: Kontrak Volume & Penjadwalan Batch",
          touchpoints: "Purchase Order (PO), alokasi jadwal produksi ERP, ketersediaan bahan baku.",
          description: "Penguncian jadwal mesin dan pemesanan bahan baku berkualitas tinggi.",
          kpi: "Konfirmasi Jadwal Produksi: < 24 Jam"
        },
        {
          stage: "Tahap 3: Pemantauan Produksi & Quality Control",
          touchpoints: "Monitoring SCADA/IoT, inspeksi QC per stasiun, laporan hasil uji batch.",
          description: "Pengendalian parameter produksi presisi guna mencegah cacat fabrikasi.",
          kpi: "Lolos QC Lini Pertama: ≥ 98.5%"
        },
        {
          stage: "Tahap 4: Pengemasan & Pengiriman OTIF",
          touchpoints: "Palletizing, wrapping, surat jalan digital, konfirmasi penerimaan gudang.",
          description: "Pengiriman barang ke gudang klien dalam kondisi utuh dan higienis.",
          kpi: "On-Time In-Full (OTIF): ≥ 98.8%"
        }
      ],
      operationalBlueprint: [
        {
          serviceCode: "MFG-TPM-01",
          title: "Total Productive Maintenance (TPM)",
          standard: "OEE ≥ 85%",
          detail: "Jadwal pemeliharaan preventif harian dan mingguan seluruh mesin vital lini produksi."
        },
        {
          serviceCode: "MFG-QMS-02",
          title: "Sistem Mutu Berlapis ISO 9001",
          standard: "Reject Rate < 1.5%",
          detail: "Inspeksi ketat bahan baku masuk, uji proses stasiun kerja, dan uji pelepasan produk akhir."
        },
        {
          serviceCode: "MFG-K3L-03",
          title: "Standardisasi K3 & Tata Kelola 5R",
          standard: "Zero Accident",
          detail: "Penerapan alat pelindung diri (APD) lengkap, jalur evakuasi bebas hambatan, dan ventilasi prima."
        },
        {
          serviceCode: "MFG-AUD-04",
          title: "Audit Kepatuhan & Sertifikasi Berkala",
          standard: "Nilai Audit A",
          detail: "Kepatuhan terhadap sertifikasi halal, SNI, BPOM, dan regulasi lingkungan hidup."
        }
      ],
      failSafeProtocols: [
        {
          incident: "Kerusakan Mendadak Mesin Utama (Breakdown)",
          mitigation: "Aktivasi mesin cadangan dan pengerahan teknisi internal siaga dengan suku cadang kritis.",
          slaResolution: "Penanganan Mesin < 30 Menit"
        },
        {
          incident: "Keterlambatan Pasokan Bahan Baku Pemasok",
          mitigation: "Pemanfaatan persediaan pengaman (safety stock) 21 hari dan order ke pemasok alternatif terverifikasi.",
          slaResolution: "Aktivasi Pemasok Cadangan < 6 Jam"
        },
        {
          incident: "Komplain Mutu dari Distributor",
          mitigation: "Penarikan batch bermasalah, penggantian unit 100% tanpa biaya, dan audit investigasi QC.",
          slaResolution: "Respon & Penggantian < 24 Jam"
        }
      ],
      cxMetrics: [
        {
          metric: "On-Time In-Full Delivery (OTIF)",
          target: "≥ 98.8%",
          explanation: "Persentase pengiriman pesanan industri yang tiba tepat waktu dan dalam volume lengkap."
        },
        {
          metric: "Tingkat Cacat Produksi (Reject Rate)",
          target: "< 1.45%",
          explanation: "Rasio produk cacat terhadap total unit yang diproduksi pada lini pabrik."
        },
        {
          metric: "Kepuasan Klien Distributor (CSAT)",
          target: "≥ 94%",
          explanation: "Tingkat kepuasan distributor terhadap stabilitas mutu produk dan ketepatan pasokan."
        },
        {
          metric: "Kepatuhan K3 & Lingkungan (Safety Compliance)",
          target: "100% Zero Accident",
          explanation: "Nol kecelakaan kerja fatal dan kepatuhan penuh terhadap baku mutu lingkungan limbah."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  if (archetype === 'personal_sme') {
    const sector = `Unit Usaha Mandiri & Ritel Konsumen ${cleanCore}`;
    const commodity = `Produk & Layanan Konsumen ${cleanCore}`;

    const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Pelayanan Konsumen Prima (Customer Hospitality) & Higiene Higienis Terstandarisasi

---

## 1. ARSITEKTUR SIKLUS PELANGGAN (CUSTOMER JOURNEY MAPPING)
- **Tahap 1 - Penemuan & Daya Tarik Tempat (Awareness):** Tampilan fasad bersih, pencahayaan menarik, plang nama jelas, dan reputasi positif Google Maps.
- **Tahap 2 - Penyambutan & Pemesanan Cepat (Ordering):** Sambutan ramah 3S (Senyum, Sapa, Salam), buku menu informatif, dan pencatatan transaksi via aplikasi POS kasir digital.
- **Tahap 3 - Penyiapan Pesanan & Higiene (Preparation):** Proses penyajian higienis berstandar SOP ringkas dengan waktu tunggu di bawah 6 menit.
- **Tahap 4 - Penyerahan & Pembayaran Non-Tunai (Checkout):** Pembayaran instan via QRIS Bank Indonesia atau tunai rapi dengan struk otomatis.
- **Tahap 5 - Retensi & Loyalitas (Loyalty):** Program stempel loyalitas digital dan permintaan ulasan kepuasan Google Maps.

---

## 2. BLUEPRINT OPERASIONAL TEMPAT USAHA MANDIRI
- **Opening & Closing Checklist SOP:** Prosedur kebersihan harian, pengecekan inventori bahan, sanitasi meja/alat, dan pencocokan uang kas.
- **Standar Keramahan & Kecepatan Layanan:** Pelatihan staf dalam melayani pesanan secara cepat, tepat, dan penuh perhatian.
- **Manajemen Kerapian & Higiene Ruangan:** Penggunaan perlengkapan sanitasi dan kebersihan toilet/ruangan secara berkala setiap 2 jam.

---

## 3. FAIL-SAFE PROTOCOLS & PENANGANAN KELUHAN
- **Lonjakan Antrean Jam Sibuk (Peak Hours):** Pembagian tugas cepat kasir dan asisten penyiapan bahan siap saji (*pre-prep*).
- **Kehabisan Stok Bahan Utama:** Pengadaan cepat dari pemasok grosir langganan cadangan dalam radius 3 km.
- **Keluhan Pelanggan Terhadap Produk/Layanan:** Permohonan maaf langsung, penggantian produk secara gratis, dan pencatatan perbaikan SOP.

---

## 4. INDIKATOR KINERJA UTAMA (KPI)
- **Waktu Layanan Transaksi:** Target < 5 Menit per pelanggan
- **Rating Google Maps:** Target ≥ 4.8 Bintang
- **Tingkat Kepuasan Pelanggan:** Target ≥ 95% ulasan positif`;

    return {
      title: pName,
      division: divName,
      sectorName: sector,
      targetCommodity: commodity,
      clientJourney: [
        {
          stage: "Tahap 1: Penemuan & Daya Tarik Suasana",
          touchpoints: "Tampilan plang usaha, kebersihan tempat, ulasan Google Maps & media sosial.",
          description: "Menarik perhatian calon pelanggan lokal dengan tempat yang bersih dan nyaman.",
          kpi: "Trafik Kunjungan Harian: 110 - 150 Orang"
        },
        {
          stage: "Tahap 2: Sambutan Ramah & Pemesanan Kasir",
          touchpoints: "Senyum sapa staf kasir, daftar harga jelas, tablet POS kasir.",
          description: "Proses pemesanan ramah dan pencatatan pesanan secara akurat tanpa antrean lama.",
          kpi: "Waktu Pemesanan Kasir: < 90 Detik"
        },
        {
          stage: "Tahap 3: Penyiapan Produk Berkualitas Higienis",
          touchpoints: "Dapur/area penyiapan bersih, bahan segar, kemasan rapi dan estetik.",
          description: "Pembuatan produk sesuai takaran resep SOP standar untuk menjamin konsistensi rasa.",
          kpi: "Waktu Penyiapan Pesanan: < 5 Menit"
        },
        {
          stage: "Tahap 4: Pembayaran Digital & Ulasan Pelanggan",
          touchpoints: "Barcode QRIS, struk digital, kartu loyalitas, ulasan bintang 5 Google.",
          description: "Kemudahan pembayaran non-tunai dan membangun hubungan hangat dengan pelanggan.",
          kpi: "Kepuasan Pelanggan (CSAT): ≥ 95.2%"
        }
      ],
      operationalBlueprint: [
        {
          serviceCode: "SME-OPN-01",
          title: "SOP Pembukaan Usaha (Opening Checklist)",
          standard: "Siap Tepat Pukul 09:30",
          detail: "Sanitasi seluruh meja, cek stok bahan baku segar harian, dan pengisian modal kembalian kasir."
        },
        {
          serviceCode: "SME-HSP-02",
          title: "Standar Keramahan Pelayanan (3S)",
          standard: "Senyum, Sapa, Salam 100%",
          detail: "Pelayanan pelanggan dengan sikap santun, penuh perhatian, dan responsif terhadap permintaan."
        },
        {
          serviceCode: "SME-HGN-03",
          title: "Standar Higiene & Kebersihan Ruangan",
          standard: "Inspeksi Berkala 2 Jam",
          detail: "Pembersihan berkala area pelanggan, tempat cuci tangan higienis, dan pengelolaan sampah tertutup."
        },
        {
          serviceCode: "SME-CLS-04",
          title: "SOP Penutupan & Rekonsiliasi Kas (Closing)",
          standard: "Selisih Kas Rp 0",
          detail: "Rekonsiliasi total penjualan POS dengan kas fisik dan mutasi bank QRIS harian."
        }
      ],
      failSafeProtocols: [
        {
          incident: "Antrean Panjang di Jam Sibuk (Rush Hour)",
          mitigation: "Aktivasi staf pendamping untuk mencatat pesanan lebih awal dari antrean.",
          slaResolution: "Waktu Antre Kasir < 3 Menit"
        },
        {
          incident: "Kehabisan Bahan Baku di Tengah Jam Buka",
          mitigation: "Pemesanan instan ke pemasok cadangan lokal terdekat dengan pengantaran cepat.",
          slaResolution: "Restock Bahan < 45 Menit"
        },
        {
          incident: "Komplain Pelanggan Terhadap Rasa / Pesanan",
          mitigation: "Penggantian pesanan baru secara gratis dan pemberian voucher diskon kunjungan berikutnya.",
          slaResolution: "Penggantian Langsung < 3 Menit"
        }
      ],
      cxMetrics: [
        {
          metric: "Kecepatan Pelayanan (Service Speed)",
          target: "< 5 Menit",
          explanation: "Rata-rata waktu dari pemesanan di kasir hingga produk diterima pelanggan."
        },
        {
          metric: "Rating Ulasan Google Maps",
          target: "≥ 4.8 Bintang",
          explanation: "Reputasi positif online dari ulasan riil pelanggan lokal."
        },
        {
          metric: "Tingkat Kepuasan Pelanggan (CSAT)",
          target: "≥ 95.2%",
          explanation: "Persentase pelanggan yang menyatakan puas dengan kualitas dan kebersihan tempat."
        },
        {
          metric: "Akurasi Kasir & Pembukuan",
          target: "100% Selisih Rp 0",
          explanation: "Kesesuaian mutlak antara pencatatan sistem kasir dengan uang tunai dan QRIS."
        }
      ],
      narrativeMarkdown: narrative
    };
  }

  // Transport Generic
  const sector = `Layanan Operasional Logistik Khusus ${cleanCore}`;
  const commodity = `Komoditas & Muatan Terjadwal ${cleanCore}`;

  const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Standar:** Service Blueprint Terintegrasi & Pengalaman Pelanggan B2B

---

## 1. ARSITEKTUR SIKLUS KLIEN (CLIENT JOURNEY MAPPING)
Desain layanan operasional untuk proyek **"${pName}"** dirancang secara menyeluruh guna memberikan pengalaman terbaik (end-to-end customer journey) bagi mitra korporat:
- **Tahap 1 - Konsultasi Kebutuhan & Onboarding:** Pemetaan spesifikasi armada komersial, audit kapasitas muatan, penetapan Service Level Agreement (SLA), dan perumusan matriks rute optimal.
- **Tahap 2 - Perencanaan Operasional & Dispatch Terjadwal:** Sinkronisasi jadwal pengiriman dengan manajemen rantai pasok klien guna menjamin kepastian pasokan tepat waktu (just-in-time).
- **Tahap 3 - Monitoring Perjalanan Real-Time:** Akses langsung bagi klien melalui portal digital PRAMA Dashboard dengan pemantauan posisi GPS, kecepatan, dan waktu perkiraan tiba (ETA).
- **Tahap 4 - Penyelesaian Ritase & Laporan Analitik Digital:** Penyerahan bukti serah terima barang (electronic proof of delivery / e-POD) dan ringkasan performa bulanan untuk review efisiensi biaya.

---

## 2. BLUEPRINT OPERASIONAL & KUALITAS LAYANAN
- **Pusat Kendali Operasi 24/7 (Control Tower):** Tim pemantau sentral siap memberikan respon instan terhadap anomali perjalanan atau kendala rute.
- **Standar Pemeliharaan Armada Preventif:** Seluruh unit armada menjalani servis berkala ketat guna menjamin kelaikan jalan dan memangkas risiko kerusakan di jalan.
- **Standardisasi Pengemudi Profesional:** Pelatihan defensive driving bersertifikat dan pemeriksaan kesehatan pengemudi sebelum bertugas.

---

## 3. FAIL-SAFE PROTOCOLS & RENCANA KONTINUITAS BISNIS
- **Mitigasi Kemacetan / Gangguan Jalur Utama:** Rute cadangan terencana dengan navigasi dinamis berbasis data lalu lintas terkini.
- **Armada Cadangan Siap Pakai:** Penyediaan unit pengganti di pangkalan terdekat guna menjamin kelangsungan pengiriman tanpa penundaan lama.

---

## 4. INDIKATOR KINERJA UTAMA (KPI)
- **Ketepatan Waktu Tiba (On-Time Delivery):** Target ≥ 98.5%
- **Tingkat Kerusakan Barang (Damage-Free Delivery):** Target ≥ 99.8%
- **Waktu Tanggap Darurat Layanan Klien:** < 15 Menit`;

  return {
    title: pName,
    division: divName,
    sectorName: sector,
    targetCommodity: commodity,
    clientJourney: [
      {
        stage: "Tahap 1: Onboarding & Desain Rute",
        touchpoints: "Kickoff meeting, verifikasi SLA kontrak, pemetaan rute dan spesifikasi armada.",
        description: "Penyusunan parameter operasional yang presisi sesuai karakter kargo proyek.",
        kpi: "Waktu Onboarding: < 7 Hari Kerja"
      },
      {
        stage: "Tahap 2: Dispatch & Pemuatan Kargo",
        touchpoints: "Checklist pra-keberangkatan, penimbangan, e-manifest surat jalan.",
        description: "Pemeriksaan kelayakan armada dan pemuatan muatan sesuai batas tonase resmi.",
        kpi: "Waktu Loading: Sesuai Standar Kargo"
      },
      {
        stage: "Tahap 3: Pemantauan Perjalanan Aktif",
        touchpoints: "PRAMA Telematics Dashboard, GPS tracking, notifikasi update berkala.",
        description: "Visibilitas penuh perjalanan bagi tim logistik klien sepanjang koridor distribusi.",
        kpi: "Akurasi Estimasi Waktu Tiba (ETA): ± 15 Menit"
      },
      {
        stage: "Tahap 4: Serah Terima & Digital ePOD",
        touchpoints: "Konfirmasi penerimaan barang, tanda tangan digital, penerbitan invoice otomatis.",
        description: "Penyelesaian administrasi secara transparan dan tanpa tumpukan berkas manual.",
        kpi: "Waktu Verifikasi ePOD: Real-Time"
      }
    ],
    operationalBlueprint: [
      {
        serviceCode: "SD-OPS-01",
        title: "Control Tower Operasional 24 Jam",
        standard: "Monitoring Aktif 365 Hari",
        detail: "Pusat komando pemantau keselamatan dan kecepatan respon terhadap segala kondisi darurat di lapangan."
      },
      {
        serviceCode: "SD-MNT-02",
        title: "Pemeliharaan Armada Terjadwal (PMS)",
        standard: "Interval Servis Ketat",
        detail: "Pemeriksaan rutin rem, ban, mesin, dan sistem elektrikal guna mencegah breakdown armada di perjalanan."
      },
      {
        serviceCode: "SD-DRV-03",
        title: "Kualifikasi Pengemudi Profesional",
        standard: "Sertifikasi Defensive Driving",
        detail: "Standardisasi perilaku mengemudi aman dan ramah bahan bakar untuk meminimalkan risiko kecelakaan."
      },
      {
        serviceCode: "SD-REV-04",
        title: "Review Kinerja Berkala (QBR)",
        standard: "Evaluasi Triwulanan Terstruktur",
        detail: "Pertemuan berkala dengan manajemen klien guna membahas optimasi rute dan efisiensi biaya logistik."
      }
    ],
    failSafeProtocols: [
      {
        incident: "Gangguan Teknis Armada di Perjalanan",
        mitigation: "Pengerahan unit rescue dan armada cadangan terdekat untuk pengalihan muatan segera.",
        slaResolution: "Truk Pengganti < 60 Menit"
      },
      {
        incident: "Penutupan Jalur Distribusi Utama",
        mitigation: "Pengalihan otomatis ke koridor alternatif yang telah disurvei kelaikan jalannya.",
        slaResolution: "Respon Navigasi < 10 Menit"
      },
      {
        incident: "Perselisihan Data Timbangan / Muatan",
        mitigation: "Verifikasi rekaman timbangan digital terenkripsi dan pembuktian foto kondisi muatan.",
        slaResolution: "Klarifikasi < 2 Jam"
      }
    ],
    cxMetrics: [
      {
        metric: "On-Time Delivery Rate",
        target: "≥ 98.5%",
        explanation: "Persentase pengiriman muatan yang tiba di titik tujuan sesuai batas waktu kontrak."
      },
      {
        metric: "Tingkat Keamanan Muatan (Safe Transit)",
        target: "≥ 99.8%",
        explanation: "Muatan sampai di lokasi penerima tanpa kerusakan fisik atau kehilangan kuantitas."
      },
      {
        metric: "Kepuasan Pelanggan (Customer Satisfaction)",
        target: "≥ 92%",
        explanation: "Hasil survei kepuasan berkala terhadap kualitas pengemudi dan kemudahan koordinasi."
      },
      {
        metric: "Rasio Kepatuhan Regulasi & K3",
        target: "100%",
        explanation: "Nol pelanggaran terhadap aturan keselamatan lalu lintas, batas muatan jalan, dan izin lingkungan."
      }
    ],
    narrativeMarkdown: narrative
  };
}
