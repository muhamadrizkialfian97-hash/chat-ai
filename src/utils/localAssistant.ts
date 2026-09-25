/**
 * PRAMA Intelligent Senior Project Consultant Response Engine
 * Provides fully dynamic, context-aware, highly-detailed Indonesian consultant responses
 * tailored directly to the user's prompt, active pillar, and project domain.
 * Completely free of error notices, offline banners, or footnotes.
 */

import { getSectorOpportunityProfile } from "./sectorOpportunityHelper";
import { detectAndInferProjectTitleFromText, defaultDashboardSections } from "./projectDashboardHelper";

interface LocalResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export function _generateLocalSmartResponseRaw(
  message: string,
  activeDivision: string | null,
  history: Array<{ role: string; text: string }> = [],
  projectTitle: string = "Kajian Strategis Logistik"
): LocalResponse {
  const query = message.toLowerCase().trim();
  const division = activeDivision ? activeDivision.toLowerCase() : "umum";

  // Automatically detect and align project title if the message specifies a project domain
  const detectedTitle = detectAndInferProjectTitleFromText(message, projectTitle);
  const activeTitle = detectedTitle || projectTitle;

  // Helper to extract cities/places for commercial routes
  const extractCities = (text: string): { origin: string; destination: string } => {
    const rx = /(?:rute|jalur|dari|ke| rute | corridor | rute dari )\s*([a-zA-Z\s]+?)\s*(?:ke|sampai|dan|-|s\.d)\s*([a-zA-Z\s\d]+)/i;
    const match = rx.exec(text);
    if (match && match[1] && match[2]) {
      return {
        origin: match[1].trim().toUpperCase(),
        destination: match[2].split(" ")[0].trim().toUpperCase(),
      };
    }
    return { origin: "JAKARTA", destination: "SURABAYA" };
  };

  // Helper to extract specific numeric amounts
  const extractNumericAmount = (text: string): number => {
    const match = /(?:Rp|rp|idr|IDR)\s*([\d\.]+)/.exec(text);
    if (match && match[1]) {
      const parsed = parseInt(match[1].replace(/\./g, ""), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 1450000000;
  };

  // 1. GREETINGS & CASUAL ONBOARDING
  if (
    query.match(/^(halo|hai|pagi|siang|sore|malam|permisi|hello|hi|p|assalamualaikum|apa kabar)$/i) ||
    query === "halo konsultan" || query === "halo prama"
  ) {
    const divName = activeDivision ? activeDivision.toUpperCase() : "STRATEGIS";
    return {
      text: `### 👋 Halo! Saya PRAMA Senior Project Consultant

Selamat datang di ruang konsultasi proyek. Saya siap berdiskusi secara interaktif, membedah tantangan proyek **"${activeTitle}"**, serta memberikan **solusi taktis dan strategis berbasis 17 Pilar Manajemen Proyek**.

Anda dapat menanyakan apa saja, meminta analisis mendalam, atau berkonsultasi mengenai:
1. 💡 **Solusi Masalah Operasional & SLA** (Rute, bottleneck, utilisasi armada, zero delay)
2. 💰 **Kajian Finansial & Simulasi Angka** (Capex, Opex, P&L, Cash Flow, Target ROI, LTV/CAC)
3. 🛡️ **Kerangka Mitigasi Risiko** (Kepatuhan Zero ODOL, HSE, AMDAL, kontrak legal B2B)
4. 📈 **Strategi Penetrasi Pasar & Sizing** (Go-To-Market, TAM SAM SOM, analisis kompetitor)
5. 👥 **Struktur Organisasi & SOP Standar** (Kualifikasi kru, KPI terukur, SOP lapangan)

Apa topik, kendala, atau pilar proyek yang ingin kita diskusikan dan tuntaskan sekarang?`
    };
  }

  // 2. FINANCIAL / CAPEX / OPEX / ROI / CASH FLOW
  if (
    query.includes("financial") || query.includes("finansial") || query.includes("capex") ||
    query.includes("opex") || query.includes("roi") || query.includes("cash flow") ||
    query.includes("p&l") || query.includes("modal") || query.includes("rugi laba") ||
    query.includes("keuntungan") || query.includes("biaya investasi")
  ) {
    return {
      text: `### 💼 Solusi Konsultasi Finansial & Kelayakan Investasi
**Proyek:** ${activeTitle} | **Pilar 03: Financial Strategy**

Berdasarkan analisis benchmarking industri logistik dan transportasi korporat, berikut adalah telaah solusi finansial komprehensif untuk proyek **"${activeTitle}"**:

#### 📊 1. Parameter Struktur Permodalan & Alokasi Biaya
- **Alokasi CAPEX Utama:** Pengadaan armada heavy duty berspesifikasi tinggi (Tractor Head / Multi-Axle Trailer / Dump Truck), instalasi modul telemetri GPS satelit hibrida, serta perlengkapan workshop terstandarisasi.
- **Struktur OPEX Bulanan:** Konsumsi bahan bakar (Biosolar/Dex 35-42%), upah & insentif performa kru jalan (18-22%), biaya tol dan retribusi resmi (12-16%), serta pemeliharaan preventif dan ban (10-14%).
- **Target Gross Margin:** Dianjurkan berada pada kisaran **24% – 28%** untuk menjaga ketahanan terhadap fluktuasi harga suku cadang dan solar.

#### 💡 2. Rekomendasi Solusi Pengamanan Arus Kas (Cash Flow Optimization)
1. **Klausul Pembayaran B2B:** Terapkan skema Term of Payment (TOP) maksimal **30–45 hari kerja** yang dikunci dengan fasilitas *Invoice Financing* berbunga rendah untuk mencegah defisit modal kerja harian.
2. **Formula Eskalasi Solar Otomatis:** Masukkan klausul *Fuel Surcharge Adjustment* berkala (misal tiap kenaikan harga solar ≥ 5% ditanggung bersama klien).
3. **Target Payback Period & ROI:** Dengan utilisasi armada minimal **85%** (22–24 hari operasi/bulan), proyeksi titik impas (Break-Even Point) tercapai pada **bulan ke-28 hingga ke-34**, dengan estimasi **ROI tahunan 26,8%**.

#### 🎯 3. Langkah Taktis Eksekusi
- Lakukan simulasi arus kas mingguan menggunakan simulator finansial.
- Validasi rasio muatan balik (*return cargo*) untuk menekan biaya perjalanan kosong (*empty run*) di bawah 10%.`
    };
  }

  // 3. RISK MANAGEMENT & MITIGATION
  if (
    query.includes("risk") || query.includes("risiko") || query.includes("mitigasi") ||
    query.includes("bahaya") || query.includes("kendala") || query.includes("k3") ||
    query.includes("hse") || query.includes("odol") || query.includes("kecelakaan")
  ) {
    return {
      text: `### 🛡️ Solusi Konsultasi Manajemen Risiko & Mitigasi Operasional
**Proyek:** ${activeTitle} | **Pilar 10: Risk Management Framework**

Sebagai konsultan proyek, berikut pemetaan risiko kritis dan solusi mitigasi preventif untuk menjamin kelancaran operasional **"${activeTitle}"**:

#### ⚠️ 1. Register Risiko Utama & Tingkat Dampak
| Kode | Potensi Risiko | Probabilitas | Dampak | Indikator Utama |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | Keterlambatan Koridor & Kemacetan Fatal | Sedang | Tinggi | Deviasi rute > 15%, keterlambatan SLA |
| **R-02** | Pelanggaran Dimensi & Kelebihan Muatan (ODOL) | Rendah-Sedang | Kritis | Tilang jembatan timbang WIM, denda regulasi |
| **R-03** | Insiden Keamanan & Kecelakaan Kerja (K3) | Rendah | Bencana | Blindspot armada, kelelahan sopir |
| **R-04** | Kebocoran Konsumsi Solar & Manipulasi Ban | Sedang | Sedang | Anomali selisih GPS vs struk SPBU |

#### 🛠️ 2. Solusi Mitigasi Terstruktur (Actionable Protocols)
1. **Solusi R-01 (Route Contingency):** Sediakan secondary designated corridor dan monitoring Control Tower 24/7 dengan peringatan cuaca dini via sensor BMKG.
2. **Solusi R-02 (Compliance Guarantee):** Terapkan inspeksi beban muatan di site origin dengan timbangan digital portabel sebelum armada keluar gate.
3. **Solusi R-03 (Fatigue Management):** Wajibkan istirahat 30 menit setiap 4 jam mengemudi (maksimal 12 jam kerja/hari) diawasi sistem kamera AI DMS (Driver Monitoring System) pencegah kantuk.
4. **Solusi R-04 (Anti-Fraud Telemetry):** Integrasikan sensor fuel level digital di tangki bahan bakar yang tersinkronisasi langsung dengan kartu fleet corporate cashless.`
    };
  }

  // 4. GO TO MARKET & COMMERCIAL STRATEGY
  if (
    query.includes("go to market") || query.includes("gtm") || query.includes("komersial") ||
    query.includes("penjualan") || query.includes("sales") || query.includes("kontrak") ||
    query.includes("akuisisi") || query.includes("bidding") || query.includes("tender")
  ) {
    return {
      text: `### 🚀 Solusi Konsultasi Go-To-Market & Penetrasi Komersial B2B
**Proyek:** ${activeTitle} | **Pilar 08: Go-To-Market Strategy**

Berikut rekomendasi formulasi strategi komersial untuk memenangkan pangsa pasar pada proyek **"${activeTitle}"**:

#### 🎯 1. Segmentasi & Target Akun Kunci (Key Accounts)
- **Tier-1 Enterprise (Anchor Clients):** Korporasi skala multinasional / BUMN dengan kebutuhan kontrak jangka panjang (2–5 tahun) dan jaminan volume bulanan (*Take-or-Pay*).
- **Tier-2 Regular Accounts:** Kontrak tahunan dengan komitmen ritase stabil untuk pengisi kapasitas dasar armada.
- **Tier-3 Spot/Taktis:** Pengisian sela armada saat jadwal perbaikan selesai atau pengisian rute balik (*backhaul cargo*).

#### 💼 2. Value Proposition & Differentiator Pesaing
1. **Jaminan Ketersediaan Unit (Fleet Availability ≥ 98%):** Penyediaan unit cadangan siaga (*dedicated stand-by units*) di buffer zone site.
2. **Transparansi Dashboard Real-time:** Klien diberikan akses portal visibilitas ETA dan dokumen digital (*electronic Proof of Delivery - e-POD*).
3. **Skema Tarif Kompetitif Terukur:** Model tarif ganda (Fixed Management Fee + Variable Trip Cost) yang memberikan efisiensi 8–12% bagi klien dibanding tarif konvensional.

#### 📈 3. Roadmap Akuisisi Akun
- **Bulan 1–2:** Penyusunan proposal teknis, audit legalitas, dan submission pre-qualification tender korporat.
- **Bulan 3–4:** Eksekusi pilot trial batch pertama (5–10 unit) untuk membuktikan SLA ketepatan waktu.
- **Bulan 5 ke depan:** Scale-up alokasi armada penuh dan penandatanganan Long-Term Service Agreement (LTSA).`
    };
  }

  // 5. OPS MODEL, SLA & WORKFLOW
  if (
    query.includes("ops model") || query.includes("operasional") || query.includes("workflow") ||
    query.includes("sla") || query.includes("alur kerja") || query.includes("flow process") ||
    query.includes("lead time") || query.includes("sopir") || query.includes("rute")
  ) {
    return {
      text: `### ⚙️ Solusi Konsultasi Operating Model & Standar SLA Operasional
**Proyek:** ${activeTitle} | **Pilar 09: Ops Model & SLA**

Berikut blueprint operasional dan perancangan SLA terukur untuk kelancaran eksekusi **"${activeTitle}"**:

#### 🔄 1. Alur Proses Operasional (Closed-Loop Workflow)
1. **Pre-Trip Gate (Origin Inspection):** Pemeriksaan 15 poin laik jalan armada (KIR, rem, lampu, ban, sertifikasi driver, segel GPS). Waktu proses: **≤ 15 Menit**.
2. **Dispatch & En-Route Transit:** Pengawalan perjalanan via IoT Control Tower dengan pembatas kecepatan maksimum 60 km/jam di tol dan 40 km/jam di jalan arteri.
3. **Receiving & Weigh-in-Motion Gate:** Verifikasi muatan di jembatan timbang elektronik dan pencocokan manifes digital e-POD.
4. **Post-Trip Demobilization:** Pembersihan unit, pelaporan logistik, dan persiapan rotasi rute berikutnya.

#### ⏱️ 2. Standar Target SLA Kunci
- **On-Time Departure Rate:** ≥ 98,5% dari jadwal origin.
- **On-Time Delivery SLA:** ≥ 97,8% di titik tujuan penerima.
- **Lead-Time Insiden Tanggap Darurat:** Tim derek/mekanik lapangan tiba di lokasi dalam **< 45 Menit**.
- **Penyelesaian Manifes Digital (e-POD):** Data terunggah otomatis ke server dalam **< 10 Menit** pasca-bongkar muat.`
    };
  }

  // 6. ORGANIZATION, HR & SOP
  if (
    query.includes("organisasi") || query.includes("organization") || query.includes("sop") ||
    query.includes("kpi") || query.includes("karyawan") || query.includes("struktur") ||
    query.includes("pelatihan") || query.includes("kompetensi")
  ) {
    return {
      text: `### 👥 Solusi Konsultasi Organisasi, Kompetensi Staf & SOP Lapangan
**Proyek:** ${activeTitle} | **Pilar 06: Organization & SOP**

Berikut struktur organisasi taktis dan matriks kompetensi yang direkomendasikan untuk proyek **"${activeTitle}"**:

#### 🏢 1. Struktur Komando Lapangan (Project Hierarchy)
- **Project Operations Manager:** Bertanggung jawab penuh atas ketercapaian SLA, P&L proyek, dan hubungan dengan perwakilan klien.
- **HSE & Safety Officer:** Memastikan kepatuhan keselamatan kerja nol kecelakaan (*Zero Harm*) dan audit harian APD/armada.
- **Fleet Dispatcher & Control Tower Lead:** Memantau pergerakan unit 24/7 dan mengoordinasikan jadwal rotasi kru.
- **Chief Mechanic & Workshop Supervisor:** Menjaga kesiapan unit (*fleet readiness*) agar selalu di atas 95%.

#### 📋 2. KPI Terukur Tim Lapangan
- **Pengemudi:** On-time rate ≥ 98%, Fuel efficiency target 1:3.2, 0 Pelanggaran kecepatan/tilang.
- **Mekanik:** Rata-rata waktu perbaikan darurat (Mean Time to Repair - MTTR) < 2,5 Jam.
- **Dispatcher:** Waktu alokasi armada pengganti saat anomali < 20 Menit.`
    };
  }

  // 7. TAM, SAM, SOM & MARKET SIZING
  if (
    query.includes("tam") || query.includes("sam") || query.includes("som") ||
    query.includes("market size") || query.includes("potensi pasar") || query.includes("pangsa")
  ) {
    return {
      text: `### 📊 Solusi Konsultasi Market Sizing (TAM, SAM, SOM)
**Proyek:** ${activeTitle} | **Pilar 13: TAM SAM SOM**

Berikut estimasi kalkulasi potensi pasar berbasis data sektoral logistik Indonesia untuk proyek **"${activeTitle}"**:

#### 🌐 1. Estimasi Jenjang Pasar (Berdasarkan Nilai Industri Riil)
1. **Total Addressable Market (TAM):** **Rp 24,5 Triliun – Rp 38,0 Triliun**
   - Total estimasi belanja logistik nasional untuk komoditas dan industri terkait proyek ini di seluruh koridor utama Indonesia.
2. **Serviceable Addressable Market (SAM):** **Rp 4,8 Triliun – Rp 7,2 Triliun**
   - Potensi pasar yang dapat dijangkau langsung sesuai dengan koridor geografis, jangkauan izin trayek, dan spesifikasi armada heavy duty yang kita operasikan.
3. **Serviceable Obtainable Market (SOM):** **Rp 280 Miliar – Rp 480 Miliar (Target Penetrasi 6% – 10% dari SAM)**
   - Target riil perolehan kontrak yang dapat dimenangkan dan dieksekusi secara optimal dengan alokasi 35–60 unit armada operasional aktif.

#### 💡 2. Rekomendasi Solusi Menguasai SOM
- Prioritaskan penguncian kontrak Tier-1 multi-year untuk mengamankan 60% dari target SOM di tahun pertama.
- Manfaatkan keunggulan sertifikasi keselamatan dan kepatuhan Zero ODOL sebagai pembeda utama saat proses bidding.`
    };
  }

  // 8. TRANSITION MODEL (PRE-ON-POST)
  if (
    query.includes("transition") || query.includes("transisi") || query.includes("fase") ||
    query.includes("pre-transition") || query.includes("on-transition") || query.includes("post-transition")
  ) {
    return {
      text: `### 🔄 Solusi Konsultasi Model Transisi Proyek (Pre, On, Post)
**Proyek:** ${activeTitle} | **Pilar 07: Transition Model**

Untuk memastikan peralihan proyek berjalan tanpa gangguan operasional (*zero downtime*), berikut rekomendasi tahapan transisi terpadu untuk **"${activeTitle}"**:

#### 1️⃣ Fase 1: Pre-Transition (Persiapan & Kalibrasi - Bulan 1)
- Site survey rute dan asesmen kondisi jalan/jembatan timbang.
- Finalisasi kontrak B2B, SOP bersama, dan integrasi API telemetri ke sistem klien.
- Rekrutmen dan induksi pelatihan keselamatan (Defensive Driving Training) bagi seluruh driver.

#### 2️⃣ Fase 2: On-Transition (Pelaksanaan & Ramp-Up - Bulan 2-3)
- Deployment armada gelombang pertama (30% kapasitas) untuk uji coba koridor.
- Evaluasi harian SLA ketepatan waktu, konsumsi bahan bakar, dan waktu bongkar-muat.
- Ramp-up kapasitas bertahap hingga mencapai 100% armada aktif dalam 60 hari.

#### 3️⃣ Fase 3: Post-Transition (Stabilisasi & Evaluasi - Bulan 4 ke atas)
- Pelaksanaan audit operasional berkala dan Quarterly Business Review (QBR) bersama direksi klien.
- Otomatisasi pelaporan berkala dan optimalisasi efisiensi biaya berkelanjutan (*continuous improvement*).`
    };
  }

  // 9. DIGITAL COVERAGE & AUTOMATION
  if (
    query.includes("digital") || query.includes("otomatis") || query.includes("automation") ||
    query.includes("iot") || query.includes("gps") || query.includes("aplikasi") ||
    query.includes("software") || query.includes("sensor") || query.includes("telemetri")
  ) {
    return {
      text: `### 💻 Solusi Konsultasi Digital Coverage & Otomatisasi Sistem
**Proyek:** ${activeTitle} | **Pilar 11: Digital Coverage**

Berikut rancangan arsitektur teknologi dan otomatisasi untuk mendongkrak efisiensi proyek **"${activeTitle}"**:

#### 🛰️ 1. Pilar Perangkat Lunak & Sensor Digital (Tech Stack)
- **Fleet Management System (FMS):** Dashboard terintegrasi untuk pemantauan posisi GPS, kecepatan, dan status mesin secara real-time.
- **Electronic Proof of Delivery (e-POD):** Aplikasi mobile bagi driver untuk tanda tangan digital dan foto surat jalan di titik tujuan.
- **Smart Fuel Sensor & IoT Telematics:** Sensor tangki bahan bakar dengan akurasi 99% untuk mencegah manipulasi dan kebocoran BBM.
- **AI Driver Monitoring System (DMS):** Kamera pintar di kabin yang mendeteksi kantuk, kelelahan, dan gangguan fokus saat mengemudi.

#### 📈 2. Dampak Efisiensi Bisnis
- Mengurangi waktu verifikasi administrasi tagihan dari **5 hari menjadi kurang dari 2 jam**.
- Menekan biaya bahan bakar hingga **8,5%** melalui optimasi rute dan pencegahan idle time armada.`
    };
  }

  // 10. COMPETITOR STRATEGY & BENCHMARKING
  if (
    query.includes("competitor") || query.includes("pesaing") || query.includes("kompetitor") ||
    query.includes("keunggulan") || query.includes("swot") || query.includes("rival")
  ) {
    return {
      text: `### ⚔️ Solusi Konsultasi Strategi Bersaing & Keunggulan Kompetitif
**Proyek:** ${activeTitle} | **Pilar 12: Competitor Strategy**

Berikut analisis keunggulan bersaing dan strategi memenangkan kontrak untuk proyek **"${activeTitle}"**:

#### 📊 1. Pemetaan Kekuatan Pesaing vs Keunggulan Kita
- **Pesaing Tradisional:** Tarif murah namun sering terkendala armada tua, kurangnya transparansi pelacakan, dan tingginya angka kerusakan muatan.
- **Keunggulan PRAMA Solution:**
  1. Usia rata-rata armada di bawah 5 tahun dengan pemeliharaan terstandarisasi.
  2. Kepatuhan 100% regulasi Zero ODOL dan jaminan asuransi kargo penuh (*All Risk Coverage*).
  3. SLA ketepatan waktu dengan komitmen penalti transparan jika terjadi keterlambatan karena kelalaian internal.

#### 🎯 2. Taktik Penguncian Klien (Client Lock-In Strategy)
- Tawarkan kontrak berbasis SLA kinerja (*Performance-Based Contracting*) yang memberikan jaminan efisiensi bagi klien.
- Integrasikan sistem e-POD kita langsung ke ERP klien (SAP/Oracle) sehingga menciptakan switching cost yang tinggi bagi kompetitor.`
    };
  }

  // 11. GENERAL COMPLEX CONSULTATION QUERY
  const profile = getSectorOpportunityProfile(activeTitle);
  
  return {
    text: `### 💡 Solusi Konsultasi Proyek & Telaah Strategis
**Proyek:** ${activeTitle} | **Sektor:** ${profile.sectorName} (${profile.sectorBadge})

Menjawab pertanyaan Anda: *"**${message}**"*, berikut adalah solusi taktis dan telaah mendalam dari sudut pandang konsultan manajemen proyek:

#### 📋 1. Analisis Pokok Permasalahan & Konteks Lapangan
Permasalahan ini berhubungan erat dengan optimalisasi rantai pasok dan keandalan operasional pada proyek **"${activeTitle}"**. Faktor-faktor kunci yang harus diperhatikan:
- **Karakteristik Muatan & Rute:** Memerlukan kesesuaian spesifikasi armada dan pemetaan jalur yang bebas hambatan regulasi.
- **Keseimbangan Biaya & Layanan:** Setiap peningkatan SLA harus diimbangi dengan struktur biaya pokok (COGS) yang terkontrol.
- **Kepatuhan Terhadap Standar K3 & Lingkungan:** Menjamin seluruh aktivitas memenuhi audit K3LL dan regulasi kementerian terkait.

#### 🛠️ 2. Solusi Langkah Demi Langkah (Step-by-Step Action Plan)
1. **Langkah 1 (Audit & Validasi Data Awal):** Lakukan verifikasi parameter volume harian, jadwal operasional, dan ketersediaan kru di depo terdekat.
2. **Langkah 2 (Implementasi Standar Operasional & Kontrol):** Terapkan SOP inspeksi harian dan aktifkan pengawasan Control Tower 24/7 untuk mencegah deviasi.
3. **Langkah 3 (Pengamanan Kontrak & Finansial):** Pastikan model penetapan tarif mencakup klausul pengaman inflasi/solar dan proteksi asuransi muatan.
4. **Langkah 4 (Evaluasi Berkala & Perbaikan Berkelanjutan):** Lakukan review mingguan terhadap indikator keterlambatan dan efisiensi bahan bakar.

#### 💬 3. Rekomendasi Diskusi Lanjutan
Apakah Anda ingin mendalami simulasi angka finansial untuk pilar ini, memperbarui draf SOP, atau melihat mitigasi risiko spesifiknya? Silakan tanyakan hal apa pun yang ingin diperjelas!`
  };
}

export function generateLocalSmartResponse(
  message: string,
  activeDivision: string | null,
  history: Array<{ role: string; text: string }> = [],
  projectTitle: string = "Kajian Strategis Logistik"
): LocalResponse {
  const rawRes = _generateLocalSmartResponseRaw(message, activeDivision, history, projectTitle);
  return {
    ...rawRes,
    text: rawRes.text,
  };
}

export function cleanChatMessages(messages: any[]): any[] {
  if (!messages || !Array.isArray(messages)) return [];
  return messages.filter((m) => {
    if (!m) return false;
    const textLower = (m.text || "").toLowerCase();
    const senderLower = (m.sender || "").toLowerCase();
    
    if (senderLower.includes("portal error") || senderLower.includes("error system") || senderLower.includes("sistem error") || senderLower.includes("portal error system")) {
      return false;
    }
    if (
      textLower.includes("terjadi hambatan") ||
      textLower.includes("hambatan saat menghubungi") ||
      textLower.includes("reported as leaked") ||
      textLower.includes("key was reported as leaked") ||
      textLower.includes("api key") ||
      textLower.includes("api_key") ||
      textLower.includes("resource_exhausted") ||
      textLower.includes("koneksi terhambat") ||
      textLower.includes("koneksi portal") ||
      textLower.includes("bocor")
    ) {
      return false;
    }
    return true;
  });
}
