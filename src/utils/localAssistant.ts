/**
 * Prama Intelligent Local Fallback Response Engine
 * Designed to provide context-aware, highly-detailed executive-level responses in Indonesian
 * when the external Gemini API is unreachable, locked, or has quota issues.
 */

interface LocalResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export function generateLocalSmartResponse(
  message: string,
  activeDivision: string | null,
  history: Array<{ role: string; text: string }> = []
): LocalResponse {
  const query = message.toLowerCase().trim();
  const titleDiv = activeDivision ? activeDivision.toUpperCase() : "UMUM";

  // Footnote to instruct users on how to restore cloud API
  const footnote = `\n\n---
ℹ️ **Catatan Sistem:** *Respons ini dibuat otomatis oleh PRAMA Local Knowledge Base karena Server Cloud mengalami limit/keamanan. Untuk menggunakan model kognitif Gemini terbaru secara realtime, Anda dapat memasukkan Gemini API Key pribadi di menu **KONEKSI (BROWSER)** di panel navigasi.*`;

  // 1. GREETINGS & SYSTEMS
  if (
    query.includes("halo") ||
    query.includes("hai") ||
    query.includes("pagi") ||
    query.includes("siang") ||
    query.includes("sore") ||
    query.includes("malam") ||
    query.includes("apa kabar") ||
    query.includes("assalamualaikum")
  ) {
    return {
      text: `### 👋 Halo! Saya PRAMA Enterprise AI Advisor.

Selamat datang di Hub Kolaborasi Analitik Pancaran Group. Saya siap membantu Anda menyusun draf proposal, menganalisis data logistik, menyusun kertas kerja audit, hingga memeriksa keselarasan regulasi operasi.

Saat ini Anda berada di divisi **${titleDiv}**. Silakan tanyakan hal khusus atau minta saya menyusun draf dokumen yang Anda butuhkan! Sebagai contoh:
${
  activeDivision === "comercial"
    ? "- *\"Buatkan draf proposal tender rute Jakarta-Surabaya\"*\n- *\"Berapa estimasi margin rute logistik kontainer?\"*"
    : activeDivision === "hca"
    ? "- *\"Tulis KPI Kru Kapal Tugboat\"*\n- *\"Buatkan program rekrutmen sopir trailer\"*"
    : activeDivision === "fina"
    ? "- *\"Hitung estimasi P&L unit penarik trailer\"*\n- *\"Buat draf anggaran belanja suku cadang dwi-mingguan\"*"
    : activeDivision === "lga"
    ? "- *\"Buat klausul deviasi angkutan logs\"*\n- *\"Bagaimana audit kelayakan operasional truk ODOL?\"*"
    : activeDivision === "spia"
    ? "- *\"Buat checklist audit konsumsi solar / diesel\"*\n- *\"Tulis Kertas Kerja Audit untuk anomali pergantian ban\"*"
    : "- *\"Bagaimana cara membuat proposal proyek logistik?\"*\n- *\"Tulis panduan kepatuhan operasional logistik\"*"
}

Apa yang perlu kita kerjakan hari ini?` + footnote
    };
  }

  if (query.includes("siapa") || query.includes("apa itu prama")) {
    return {
      text: `### 🏢 Tentang PRAMA System

**PRAMA** (**Project Management Analytic**) adalah ekosistem AI cerdas internal yang didesain khusus untuk mengintegrasikan proses bisnis, dokumentasi audit, koordinasi waktu nyata, dan analisa prediktif lintas unit kerja di **Pancaran Group**.

Sistem ini mendukung lima pilar operasi utama:
1. **Comercial (COMC):** Mengoptimalkan kalkulasi tarif logistik darat/laut dan draf negosiasi tender.
2. **Human Capital (HCA):** Manajemen kompetensi, giliran kru, dan performa (KPI).
3. **Finance & Accounting (FINA):** Audit kelayakan kas, depresiasi unit, dan analitikal finansial anggaran.
4. **Legal & Governance (LGA):** Kepatuhan regulasi transportasi darat/sungai serta draf klausul jaminan kontinjensi hukum.
5. **Satuan Pengawasan Intern (SPIA):** Pengawasan berkala anomali konsumsi solar, pergantian suku cadang ban, dan Kertas Kerja Audit (KKA).` + footnote
    };
  }

  // 2. COMERCIAL & BUSINESS DEVELOPMENT SPECIALIST (COMC)
  if (activeDivision === "comercial" || query.includes("tarif") || query.includes("tender") || query.includes("komersial") || query.includes("proposal") || query.includes("bidding") || query.includes("kontainer") || query.includes("jakarta") || query.includes("surabaya")) {
    if (query.includes("tarif") || query.includes("biaya") || query.includes("jakarta") || query.includes("surabaya") || query.includes("rute")) {
      return {
        text: `### 📊 Simulasi Tarif Logistik & Analisis Margin: Jakarta - Surabaya

Berdasarkan database tarif internal dan optimasi rute komersial untuk koridor **Jakarta - Surabaya (Via Tol Trans-Jawa)**, berikut adalah estimasi kalkulasi biaya operasi dan saran margin keuntungan:

#### 🚚 1. Komposisi Biaya Operasi Truk Trailer (40 FEET)
| Elemen Biaya | Estimasi Nilai (IDR) | Persentase | Catatan |
| :--- | :--- | :--- | :--- |
| **Bahan Bakar (Solar)** | Rp 4.200.000 | 44.2% | Berdasarkan rute pp & konsumsi rata-rata 1:3 |
| **Tol Trans-Jawa** | Rp 1.550.000 | 16.3% | Tarif golongan V (penarik multi-gandar) |
| **Uang Makan & Operasional Sopir** | Rp 1.200.000 | 12.6% | Termasuk insentif ketepatan waktu |
| **Amortisasi Ban & Depresiasi Unit** | Rp 950.000 | 10.0% | Estimasi penyusutan ban per trans-trip |
| **Maintenance & Cadangan Suku Cadang** | Rp 600.000 | 6.3% | Perawatan rutin terjadwal |
| **Biaya Overhead Administrasi & Depo** | Rp 1.000.000 | 10.6% | Manajemen muatan & klaim asuransi |
| **TOTAL BIAYA DASAR (COGS)** | **Rp 9.500.000** | **100%** | **Biaya Pokok per Trans-Trip (One Way)** |

#### 📈 2. Rekomendasi Tarif Penawaran & Target Margin
Untuk mempertahankan rasio likuiditas P&L yang optimal di Pancaran Group, penentuan tarif mengikuti formula target margin keuntungan sebesar **18% s.d. 25%**:

1. **Rekomendasi Tarif Dasar Penawaran:** **Rp 11.800.000 - Rp 12.500.000** per kontainer 40ft (One Way).
2. **Estimasi Margin Laba Bersih:** **Rp 2.300.000 - Rp 3.000.000** per pengiriman.
3. **Strategi Optimasi Balikan (Return Cargo):** Kolaborasi dengan agen komersial Surabaya untuk muatan balik guna mereduksi biaya kosong hingga **35%** biaya operasional tol harian.` + footnote
      };
    }

    return {
      text: `### ✍️ Rancangan Draf Proposal Penawaran Tender Logistik & Bidding

**PRAMA COMERICAL SYSTEM (COMC)**
Dokumen rujukan ini disiapkan untuk mendukung penawaran tender ekspedisi logistik komersial dari Pancaran Group:

\`\`\`markdown
PROPOSAL BIDDING: PENYEDIAAN JASA TRUK TRAILER DUA-ARAH (ROUND TRIP)
Nomor Dokumen: PRM/COMC-BID/2026/082
Tanggal Usulan: 1 Juni 2026

KEPADA YTH.
TIM PROCUREMENT & SUPPLY CHAIN MANAGEMENT COOPERATOR
KASUS UTAMA: LOGISTIK MANUFAKTUR & CONTAINERIZED CARGO

1. RUANG LINGKUP LAYANAN (SCOPE OF WORK)
Pancaran Group bersedia menyediakan armada prima truk Trailer (multi-gandar 20ft/40ft/Wingbox) berkarakteristik Heavy Duty, siap beroperasi penuh 24/7 dengan dukungan integrasi GPS Tracking & PRAMA Real-Time Monitoring.

2. STANDAR TINGKAT LAYANAN (SLA)
- Ketepatan Waktu Bongkar Muat (Lead Time): Akurasi mencapai 98.7% di dalam jendela pengiriman utama.
- Ketersediaan Armada Mandiri: Minimal 95% ketersediaan harian dari total komitmen unit.
- Kepatuhan Pengendara: Driver memiliki sertifikasi K3 Transportasi dari Dinas Perhubungan.

3. STRUKTUR HARGA PENAWARAN (COMMERCIAL OFFER)
Setiap tarif penawaran sudah inklusif dengan Biaya Tol, Uang Operasional Driver, Asuransi Barang (Cargo Liability), dan Penanganan Darurat di Jalur Logistik utama.
\`\`\`

Apakah Anda memiliki detail volume atau ruter pengangkutan khusus agar saya bisa melengkapi tabel penawaran di atas?` + footnote
    };
  }

  // 3. HUMAN CAPITAL & AFFAIRS (HCA)
  if (activeDivision === "hca" || query.includes("kpi") || query.includes("sopir") || query.includes("driver") || query.includes("gilir") || query.includes("rekrut") || query.includes("kru") || query.includes("pekerja")) {
    return {
      text: `### 👥 Panduan Kinerja & Key Performance Indicators (KPI) Bidang HCA

**PRAMA HUMAN CAPITAL SYSTEM (HCA)**
Berikut adalah standar parameter evaluasi performa operasional kru kapal, armada tugboat, dan sopir container trailer logistik di bawah naungan Pancaran Group:

#### 📊 1. Matriks KPI Sopir Truk Trailer (Pilar Transportasi Darat)
| Kategori KPI | Bobot (%) | Target Kinerja | Metodologi Evaluasi |
| :--- | :--- | :--- | :--- |
| **Ketepatan Waktu Kirim (On-Time Delivery)** | 35% | ≥ 97.5% per bulan | Verifikasi koordinat GPS dan cap stempel bukti serah dokumen muatan (POD) |
| **Rasio Efisiensi Bahan Bakar (Solar)** | 25% | Rasio 1:3.1 s.d. 1:3.4 | Audit digital sensor bahan bakar terintegrasi telemetry PRAMA |
| **Keamanan Operasi (Zero Incident)** | 25% | 0 Kecelakaan Kerja | Nihil komplain kerusakan barang, ugal-ugalan, atau pelanggaran ODOL |
| **Pemeliharaan Unit & Kepatuhan Kir** | 15% | Checklist Harian Lulus | Pengisian Kartu Pemeriksaan Harian armada sebelum jalan |

#### 🚢 2. Protokol Gilir Dinas (Shift Rostering) Kru Tugboat & Barge
Untuk menjamin keselamatan pelayaran dan kepatuhan terhadap regulasi perkapalan laut, jadwal rotasi kru diatur secara ketat sebagai berikut:
1. **Pola Gilir Dinas Utama:** Pola kerja **2 Bulan On-Board / 2 Minggu Off-Duty** untuk kapten & mualim.
2. **Jam Kerja Operasi:** Sesuai Konvensi MLC 2006, maksimal jam kerja adalah 14 jam dalam periode 24 jam apa pun, dengan waktu istirahat minimal 10 jam sehari.
3. **Penyuluhan Kompetensi Mental & Fisik:** Dilakukan pemeriksaan kesehatan psikologis (fatique test) berkala sebulan sekali di pelabuhan singgah utama.` + footnote
    };
  }

  // 4. FINANCE, ADMINISTRATION & ACCOUNTING (FINA)
  if (activeDivision === "fina" || query.includes("anggaran") || query.includes("budget") || query.includes("biaya") || query.includes("amortisasi") || query.includes("depresiasi") || query.includes("suku cadang") || query.includes("p&l") || query.includes("cash flow")) {
    return {
      text: `### 💵 Rekomendasi Alokasi Nilai Anggaran & Analisis Penyusutan FINA

**PRAMA FINA SYSTEM (AUDITING & BUDGETARY)**
Dokumen kertas keuangan berikut menyajikan analisis manajemen penyusutan armada dan pemantauan cash flow dwi-mingguan:

#### 📂 1. Klasifikasi Metode Penyusutan Armada Trailer (Pancaran Group)
Penyusutan unit komersial dipotong menggunakan metode **Garis Lurus (Straight-Line Method)** untuk menjamin konsistensi laporan laba rugi bulanan:
- **Biaya Perolehan Unit (Tractor Head Baru):** Rp 1.400.000.000 s.d Rp 1.650.000.000.
- **Nilai Residu Estimasi (Setelah 8 Tahun):** Rp 200.000.000.
- **Masa Manfaat Operasional:** 8 Tahun (Klasifikasi Harta Berwujud Golongan 3 Perpajakan).
- **Penyusutan Tahunan per Unit:** **Rp 175.000.000/tahun** (atau sekitar **Rp 14.580.000/bulan**).

#### 💼 2. Alokasi Cadangan Kas Dwi-Mingguan Pengadaan Suku Cadang
Saran struktur prioritas pengadaan dwi-mingguan untuk menghindari anomali stagnasi operasional depo logistik:
1. **Prioritas Tinggi (45%):** Ban orisinal (radial) trailer untuk rotasi armada aktif Trans-Jawa.
2. **Prioritas Menengah (35%):** Pelumas mesin, filter solar berkualitas tinggi (mereduksi bio-solar sulfur tinggi), dan suku cadang kampas rem.
3. **Prioritas Preventif (20%):** Sensor telemetri GPS baru, segel pengunci kontainer cadangan, dan alat penunjang keselamatan kabin.` + footnote
    };
  }

  // 5. LEGAL & GOVERNANCE AFFAIRS (LGA)
  if (activeDivision === "lga" || query.includes("hukum") || query.includes("kontrak") || query.includes("undang") || query.includes("odol") || query.includes("mou") || query.includes("adendum") || query.includes("klausul") || query.includes("deviasi") || query.includes("asuransi")) {
    return {
      text: `### ⚖️ Aspek Kepatuhan Hukum & Draf Adendum Klausul LGA

**PRAMA LEGAL & GOVERNANCE AFFAIRS (LGA)**
Berikut adalah draf legalitas hukum dan analisis regulasi pembatasan ODOL (Over Dimension Over Load) di rute logistik nasional:

#### 📄 1. usulan Klausul Deviasi Pengangkutan Logistik & Gangguan Trayek
Klausul standar untuk disisipkan dalam Perjanjian Kerja Sama (PKS) ekspedisi guna menanggung biaya tambahan (Surcharge) akibat pemindahan operasional secara legal:
> **Pasal 14: Klausul Deviasi Ruteng & Force Majeure Operasional**
> *Apabila pihak Penyedia Jasa Logistik mengalami instruksi pengalihan jalur jalan umum oleh petugas berwenang (Dinas Perhubungan/Kepolisian), penutupan gerbang tol, akibat bencana alam atau kerusakan infrastruktur parah yang mengakibatkan penambahan jarak rute tempuh melebihi toleransi sebesar sepuluh persen (10%) dari jarak standar asal, maka Penyedia Jasa berhak memberlakukan Biaya Tambahan Jarak (Surcharge Deviasi) sebesar Rp 5.500,- per kilometer tambahan, yang ditagihkan secara akuntabel pada dokumen invoice penagihan bulanan.*

#### 🛡️ 2. Dokumen Kepatuhan Regulasi Pembatasan Truk ODOL
Guna memitigasi penyitaan unit di jembatan timbang terpadu:
1. Seluruh armada Pancaran Group wajib memiliki sertifikat registrasi uji kelayakan jalan (SRUT) yang resmi terbit dari Kementerian Perhubungan.
2. Batas muatan aman (GVR/GVW) untuk trailer gandengan ganda maksimal adalah 40.000 kg (40 Ton) untuk memastikan keawetan as roda.` + footnote
    };
  }

  // 6. SPIA INTERNAL AUDIT (SPIA)
  if (activeDivision === "spia" || query.includes("solar") || query.includes("diesel") || query.includes("ban") || query.includes("audit") || query.includes("fraud") || query.includes("anomali") || query.includes("kertas kerja") || query.includes("checklist") || query.includes("inspeksi")) {
    return {
      text: `### 🧐 Checklist Pengawasan & Kertas Kerja Audit Solar & Ban

**PRAMA SATUAN PENGAWASAN INTERN (SPIA)**
Rincian prosedur preventif guna mendeteksi anomali fraud pencatatan di lapangan pada depo atau rute armada:

#### ⛽ 1. Checklist Audit Anomali Konsumsi Bahan Bakar Solar (Diesel)
1. **Konfirmasi Jarak Tempuh vs Konsumsi Riil:** Selisih antara jarak odometer fisik kabin dibandingkan dengan pembacaan sensor GPS telemetry PRAMA (Toleransi selisih maksimum **2%**).
2. **Pemeriksaan Struk Pengisian BBM:** Verifikasi waktu, tempat, dan pelat nomor truk pada struk transaksi pembayaran non-tunai (kartu bahan bakar) dengan riwayat rekaman serverless perjalanan.
3. **Penyelidikan Kuras Tangki (Fraud Solar):** Anomali penurunan volume solar secara mendadak saat armada dalam kondisi berhenti istirahat (Daftarkan sebagai indikasi kecurangan kelas-X).

#### 🛞 2. Kertas Kerja Audit (Working Paper) Anomali Pergantian Ban Truk
| Kode Temuan | Deskripsi Anomali | Indikasi Pelanggaran | Tindakan Koreksi Utama |
| :--- | :--- | :--- | :--- |
| **SPIA-BAN-01** | Penggantian ban baru < 30.000 KM | Penukaran ban orisinal dengan ban bekas vulkanisir ilegal di bengkel tidak resmi | Audit forensik nomor seri ban fisik dengan catatan inventaris depo pusat Pancaran |
| **SPIA-BAN-02** | Ketidakcocokan dimensi profil | Penggunaan ban muatan ringan pada trailer pengangkutan kontainer berat | Penghentian operasi unit seketika demi keselamatan kerja pengendara |
| **SPIA-BAN-03** | Pembelian tanpa disposisi resmi | Pengeluaran kas bengkel darurat fiktif oleh oknum administrasi lapangan | Penonaktifan akun log masuk personel bersangkutan selama audit internal berlanjut |` + footnote
    };
  }

  // 7. DEFAULT COLLABORATION ADVISOR GENERATOR
  return {
    text: `### 💡 Panduan Kolaborasi Analitik & Penulisan Dokumen Pramer

Terima kasih atas pesan Anda. PRAMA AI saat ini mendeteksi topik umum mengenai analisis manajemen proyek logistik Pancaran Group Anda.

Untuk membantu kelancaran penulisan draf analisis atau operasional Anda, berikut adalah langkah taktis pemeriksaan dokumen yang dapat kita lakukan bersama:

1. **Rasionalisasi Dokumen:** Tuliskan draf proposal Anda lalu tempel di sini. Saya akan memeriksa keselarasan tata kalimat bahasa dan struktur penawaran agar tampil prima untuk dinilai klien.
2. **Kalkulasi Biaya Pokok:** Sebutkan elemen rute dan model kendaraan penarik kontainer Anda, saya siap memetakan simulasi margin P&L secara tajam dan terperinci.
3. **Pemeriksaan Kepatuhan Hukum & Audit:** Lampirkan catatan pelanggaran, saya akan membantu merumuskan Klausul Perbaikan Operasi agar tidak melanggar batasan regulasi pemerintah maupun operasional korporat.

Silakan masukkan detail tambahan atau klik menu **KONEKSI (BROWSER)** di navigasi atas jika ingin memasukkan Gemini API Key pribadi dari Google AI Studio kapan pun Anda inginkan!` + footnote
  };
}
