/**
 * PRAMA AI Operating Model Generator (Pilar 8: End-to-End Flow Process, Workflow Diagram, & SLA)
 * Generates tailored, 100% project-title-aligned operating models, workflow RACI diagrams,
 * turnaround time (TAT) targets, SLAs, and digital handover protocols.
 */

export interface OpsModelResult {
  title: string;
  flowSummary: string;
  slaSummary: string;
  digitalIntegrationSummary: string;
  kpiSummary: string;
  narrativeMarkdown: string;
}

export function generateOpsModelForTitle(
  rawTitle: string,
  division?: string
): OpsModelResult {
  const title = (rawTitle || "").trim() || "Kajian Operating Model & Workflow Operasional Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Operasional Darat").trim();

  // Route extraction
  let origin = "";
  let dest = "";
  const routeMatch = /(?:dari|koridor|jalur|rute|pengangkutan|distribusi|hauling)?\s*([A-Za-z\s]+?)\s*(?:ke|sampai|menuju|-|s\.d|to)\s*([A-Za-z\s]+)/i.exec(title);
  if (routeMatch && routeMatch[1] && routeMatch[2]) {
    const rawOrig = routeMatch[1].replace(/pengangkutan|distribusi|hauling|kajian|strategis|proyek/gi, "").trim();
    const rawDest = routeMatch[2].trim();
    if (rawOrig.length > 2 && rawDest.length > 2) {
      origin = rawOrig;
      dest = rawDest;
    }
  }
  const routeName = origin && dest ? `${origin} ke ${dest}` : "Koridor Utama Proyek";

  let flowSummary = "";
  let slaSummary = "";
  let digitalIntegrationSummary = "";
  let kpiSummary = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT / CLINKER
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    flowSummary = "Pemeriksaan pra-jalan K3 bejana tekan -> Pengisian silo packing plant -> Penimbangan jembatan ganda -> Hauling rute darat -> Pembongkaran unloader kompresor di batching plant -> e-POD tiket timbang digital.";
    slaSummary = "Waktu muat silo (< 45 menit), Hauling rute (< waktu tempuh standar + 1 jam), Pembongkaran pneumatik (< 60 menit per 30 ton), Rekonsiliasi e-POD (< 15 menit).";
    digitalIntegrationSummary = "Sensor tekanan bejana nirkabel, GPS telemetry dengan geofencing silo, dan integrasi tiket timbang otomatis ke ERP pelanggan.";
    kpiSummary = "On-Time In-Full Delivery (≥ 98%), Turnaround Time (TAT) Cycle (< target 100%), Zero Spillage.";

    narrativeMarkdown = `### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
Alur operasional pengangkutan semen curah untuk proyek **"${title}"** pada koridor **${routeName}** dirancang secara berurutan:
  - **Tahap 1: Pra-Inspeksi Kesiapan Armada & K3 Bejana Tekan (Depo):** Pemeriksaan fungsi katup keselamatan tekanan (*safety pressure relief valve 2.2 bar*), kompresor unloader blower independen, kondisi ban ganda, dan kelengkapan APD supir (helm, sepatu safety, masker debu, kacamata).
  - **Tahap 2: Pemuatan di Silo Packing Plant Pabrik Semen:** Truk kapsul memasuki jalur pengisian silo. Operator packing plant menghubungkan corong aerasi ke manhole atas tangki. Pengisian semen curah dikontrol otomatis melalui sensor timbangan silo hingga kapasitas nominal 28–30 ton.
  - **Tahap 3: Penimbangan Jembatan Keluar & Penerbitan Surat Jalan:** Truk melintasi jembatan timbang terkalibrasi pabrik guna memastikan muatan tidak melanggar ambang batas Muatan Sumbu Terberat (MST 10 Ton / Zero ODOL). Segel bernomor seri dipasang pada manhole dan katup buang.
  - **Tahap 4: Hauling Jalur Darat & Pengawasan Geofence:** Armada bergerak melintasi rute resmi yang disetujui. Sistem telematika memantau posisi satelit, batas kecepatan (maks. 60 km/jam), dan melarang perhentian di luar rest area resmi yang telah ditentukan.
  - **Tahap 5: Pembongkaran Pneumatik di Batching Plant Pelanggan:** Setibanya di lokasi tujuan, kru menyambungkan selang fleksibel discharge 4 inci ke pipa masukan silo batching plant. Mesin blower kompresor dinyalakan dengan tekanan 1.8–2.0 bar untuk mentransfer seluruh semen hingga bejana tangki kosong sempurna tanpa residu.
  - **Tahap 6: Validasi Serah Terima Digital (e-POD):** Petugas batching plant menandatangani berita acara serah terima secara elektronik via aplikasi mobile supir, diselaraskan dengan bukti cetak tiket timbangan tiba.

### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
Pembagian peran operasional secara tegas untuk memastikan transparansi dan akuntabilitas:
  - **Pengemudi Tangki Semen (Responsible):** Bertanggung jawab atas pemeriksaan harian armada, pengendalian kemudi aman selama perjalanan, pengawasan proses pembongkaran blower, dan pengunggahan e-POD.
  - **Dispatcher & Telematics Officer (Accountable):** Menyetujui surat jalan keberangkatan, memantau pergerakan armada 24/7 di Command Center, dan merespons anomali rute/tekanan tangki.
  - **Tim Mekanik & Teknisi Kompresor (Consulted):** Melakukan perawatan berkala kompresor unloader blower per 250 jam kerja dan kalibrasi tahunan katup bejana tekan.
  - **Koordinator Logistik Batching Plant (Informed):** Menerima notifikasi estimasi waktu tiba (ETA) armada secara real-time dan menyiapkan ruang tampung silo sebelum unit tiba di lokasi.

### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
Parameter waktu baku operasional yang disepakati bersama klien:
  - **Durasi Pemuatan di Packing Plant:** Maksimal 45 menit per unit armada (termasuk proses manuver antrean dan penimbangan).
  - **Waktu Bongkar Kompresor Silo (Discharge SLA):** Maksimal 60 menit untuk volume 30 ton semen curah (kecepatan alir rata-rata 0.5 ton/menit).
  - **Toleransi Keterlambatan Waktu Tiba (Delivery SLA):** Maksimal ±30 menit dari jadwal pengecoran yang telah dikonfirmasi oleh batching plant.
  - **Target Siklus Waktu Balik Armada (Round-Trip Turnaround Time):** Terselesaikan dalam target ritase harian tanpa mengorbankan waktu istirahat wajib supir (8 jam per 24 jam).

### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
  - **Sensor Tekanan Digital Nirkabel:** Pengukur tekanan bejana tangki yang terhubung ke telematika kabin dan mengirimkan peringatan dini jika tekanan mendekati 2.1 bar.
  - **Aplikasi Mobile e-POD:** Pengunggahan foto segel utuh sebelum dibongkar, foto pembacaan manometer, dan tanda tangan digital penerima barang yang langsung terhubung ke sistem ERP pusat.
  - **Integrasi API Tiket Timbangan:** Data berat kotor (bruto), berat kosong (tarra), dan berat bersih (netto) otomatis sinkron ke server billing tanpa entri data manual.

### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
* **Tingkat Ketepatan Waktu Pengiriman (On-Time Delivery Rate):** Target minimal 98% tepat waktu.
* **Kepatuhan Muatan Sumbu Zero ODOL:** 100% armada mematuhi batas beban jembatan timbang (Nol pelanggaran).
* **Tingkat Kecepatan Pembongkaran:** 95% proses discharge selesai di bawah 60 menit.
* **Ketersediaan Mekanis Armada (Mechanical Availability):** Pemeliharaan unit menjaga ketersediaan armada minimal 92%.

### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
Model operasional proyek **"${title}"** dinyatakan **Sangat Matang & Siap Diterapkan (OPERATIONAL-READY - APPROVED)**. Integrasi teknologi blower terkalibrasi dan serah terima digital e-POD menjamin keandalan rantai pasok semen curah ke proyek infrastruktur.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    flowSummary = "Inspeksi K3 tambang (P2H) -> Pemuatan bijih laterit di front pit -> Hauling jalan tambang khusus -> Penimbangan pelabuhan/smelter -> Tipping di hopper/stockpile -> Validasi digital SIMBARA.";
    slaSummary = "Waktu muat excavator (< 10 menit per 30 ton), Waktu siklus ritase hauling (< 90 menit), Waktu tipping hopper (< 5 menit), Rekonsiliasi SIMBARA (Real-time).";
    digitalIntegrationSummary = "Fleet Management System (FMS) GPS, sensor suspensi muatan nirkabel, kamera pemantau kantuk AI (DSM), dan integrasi API SIMBARA Ditjen Minerba.";
    kpiSummary = "Fleet Utilization (≥ 88%), Cycle Time Adherence (≥ 95%), Zero Rollover, Zero SIMBARA Discrepancy.";

    narrativeMarkdown = `### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
Alur proses sirkular operasional hauling bijih nikel proyek **"${title}"**:
  - **Tahap 1: Pemeriksaan Harian Pra-Operasi (P2H Tambang):** Pemeriksaan menyeluruh sistem hidrolik dump truck, kondisi rem darurat (retarder brake), lampu kerja strobo, ban tambang E-4, serta tes alkohol dan kebugaran supir sebelum awal giliran kerja (shift).
  - **Tahap 2: Pemuatan di Pit Tambang Front Excavator:** Unit dump truck bermanuver mundur ke titik muat di bawah arahan spotter. Excavator kelas 30–40 ton memuat laterit nikel dengan batas muat 3–4 bucket (volume 25–30 ton) guna menghindari beban berlebih yang merusak sasis di tanjakan curam.
  - **Tahap 3: Konvoi Hauling di Jalan Tambang Khusus:** Perjalanan menyusuri koridor hauling khusus tambang dengan kecepatan terkendali maksimal 35 km/jam, jarak aman antar truk minimal 50 meter, dan komunikasi radio dua arah (two-way VHF radio) di tikungan blind spot.
  - **Tahap 4: Penimbangan Jembatan Pelabuhan Jetty / Smelter:** Dump truck melintasi timbangan jembatan digital otomatis berbasis RFID scanner. Berat bruto dicatat dan dicocokkan dengan kuota surat jalan digital tambang.
  - **Tahap 5: Pembongkaran Muatan (Tipping) di Stockpile / Hopper:** Unit mundur ke area tipping bibir hopper smelter dengan panduan flagman. Mekanisme hidrolik tipper diaktifkan untuk menurunkan bijih laterit secara bertahap tanpa menimbulkan hentakan muatan berat.
  - **Tahap 6: Penimbangan Tarra & Sinkronisasi SIMBARA:** Truk melintasi timbangan keluar untuk mencatat berat kosong, dan data tonase netto disinkronkan secara otomatis ke platform digital SIMBARA Kementerian ESDM.

### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
  - **Pengemudi Dump Truck Tambang (Responsible):** Menjalankan P2H, mengemudi mematuhi rambu tambang, dan memposisikan unit saat pemuatan dan dumping.
  - **Pit Dispatcher & Pengawas Hauling (Accountable):** Mengatur alokasi jumlah truk per excavator (*truck-shovel matching*) guna menghilangkan waktu antre tunggu (queuing time) di front penambangan.
  - **Mekanik Tambang Reaksi Cepat (Consulted):** Siaga dengan unit mobile crane service car untuk menangani insiden ban bocor atau kebocoran selang hidrolik di jalan hauling.
  - **Manajer K3 Pertambangan / K3LL (Informed):** Menerima laporan log telematika harian mengenai pelanggaran batas kecepatan dan kepatuhan waktu kerja supir.

### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
  - **Durasi Pemuatan di Front Pit:** Maksimal 8–10 menit per unit truk.
  - **Target Siklus Ritase Hauling (Cycle Time SLA):** Rata-rata 75–90 menit per ritase (tergantung jarak pit ke smelter dan kondisi cuaca).
  - **Waktu Dumping di Hopper:** Maksimal 4–6 menit per unit.
  - **Ketersediaan Armada Operasi (Fleet Availability):** Minimal 88% armada aktif beroperasi dalam sistem rotasi dua shift 24 jam.

### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
  - **Fleet Management System (FMS) Tambang:** Pemetaan posisi GPS armada dengan presisi tinggi dan optimasi rute ritase otomatis.
  - **Kamera AI Pemantau Kantuk (Driver Safety System - DSS):** Pendeteksi mata terpejam (*microsleep*) atau penggunaan ponsel yang membunyikan alarm kabin dan mengirimkan klip video ke pusat kendali.
  - **Integrasi API SIMBARA & Web Service Smelter:** Pengesahan surat jalan digital instan tanpa antrean manual tanda tangan berkas kertas di pos dermaga.

### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
* **Kepatuhan Target Tonase Harian:** Pencapaian volume pasokan nikel harian ≥ 96% dari target pabrik smelter.
* **Tingkat Kepatuhan Waktu Siklus (Cycle Time Adherence):** Minimal 92% perjalanan sesuai estimasi standar ritase.
* **Insiden Keselamatan Kerja Tambang:** Nol insiden fatal dan nol unit dump truck terguling (Zero Rollover).
* **Tingkat Kesiapan Alat Berat:** Mechanical Availability tetap di atas 90%.

### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
Operating Model proyek **"${title}"** dinilai **Sangat Efisien, Tangguh, & Sesuai Kaidah Pertambangan Modern (APPROVED - GO)**. Skema alokasi armada cerdas dan digitalisasi SIMBARA menjamin kontinuitas pasokan tungku smelter tanpa kendala kemacetan.`;
  }

  // 3. BATUBARA / COAL HAULING
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    flowSummary = "Inspeksi P2H dump truck -> Pemuatan batubara di stockpile pit -> Penutupan terpal otomatis -> Hauling koridor tambang -> Penimbangan jembatan jetty -> Dumping conveyor tongkang.";
    slaSummary = "Waktu muat stockpile (< 8 menit), Waktu siklus hauling (< 60 menit per rit), Waktu bongkar hopper jetty (< 4 menit), Rekonsiliasi tonase tongkang (Real-time).";
    digitalIntegrationSummary = "Sensor suhu inframerah batubara otomatis, GPS telemetry FMS, penutup terpal hidrolik nirkabel, dan RFID timbangan jembatan otomatis.";
    kpiSummary = "Tonnage Achievement (≥ 98%), Zero Spontaneous Combustion, Zero Demurrage Tongkang.";

    narrativeMarkdown = `### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
Alur operasional pengangkutan batubara untuk proyek **"${title}"**:
  - **Tahap 1: Inspeksi Kelayakan & Kesiapan Unit (Depo Hauling):** Uji fungsi sistem pengereman retarder hidrolik, kondisi ban heavy-duty, lampu sorot malam, serta kebersihan bak penampung dari sisa batubara panas.
  - **Tahap 2: Pemuatan Batubara di Stockpile Pit:** Truk diarahkan oleh petugas stockpile ke bawah corong loading atau loader. Batubara dimuat secara merata dengan toleransi muat 30–35 ton.
  - **Tahap 3: Penutupan Terpal Otomatis & Pembersihan Ban:** Mekanisme penutup terpal elektrik/hidrolik diaktifkan untuk menutup rapat seluruh permukaan bak, mencegah debu batubara berhamburan. Truk melintasi fasilitas pencucian ban (*tire wash facility*) sebelum keluar ke jalan utama.
  - **Tahap 4: Hauling di Koridor Jalan Khusus:** Truk bergerak dalam barisan teratur dengan kecepatan konstan maksimal 40 km/jam. Penyemprotan jalan oleh unit water truck beroperasi setiap 45 menit sekali guna mereduksi debu.
  - **Tahap 5: Penimbangan Jembatan & Pembongkaran di Jetty:** Setibanya di area dermaga pelabuhan khusus batubara, unit melintasi jembatan timbang terintegrasi RFID dan membongkar muatan ke hopper conveyor yang langsung mengarah ke tongkang (*barge*).
  - **Tahap 6: Penerbitan Bukti Timbang Digital & Evaluasi Suhu:** Surat jalan elektronik diterbitkan otomatis, dan kamera termal memindai tidak adanya titik api pada sisa residu bak sebelum truk kembali ke pit penambangan.

### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
  - **Sopir Hauling Batubara (Responsible):** Mengoperasikan unit secara aman, mengunci penutup terpal, dan memastikan muatan tercurah bersih di hopper jetty.
  - **Supervisor Logistik Jetty (Accountable):** Mengatur laju ritase truk agar sinkron dengan jadwal sandar dan kapasitas muat tongkang (*laytime schedule*).
  - **Petugas Road Maintenance & Grader (Consulted):** Merawat permukaan jalan hauling dari lubang dan genangan air agar kecepatan konvoi tetap optimal.
  - **Tim K3LL & Lingkungan Hidup (Informed):** Memantau indeks kualitas udara dan partikel debu di sepanjang lintasan pemukiman terdekat.

### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
  - **Waktu Pemuatan di Stockpile:** Rata-rata 6–8 menit per unit.
  - **Waktu Siklus Ritase Hauling (Cycle Time SLA):** Maksimal 60 menit per ritase bolak-balik.
  - **Waktu Dumping di Hopper Jetty:** Maksimal 3–5 menit per armada.
  - **Tingkat Keterisian Tongkang (Barge Loading Rate):** Minimal 1.200 ton per jam tersuplai ke tongkang pelabuhan.

### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
  - **Sensor Deteksi Suhu Termal Muatan:** Kamera inframerah di gerbang masuk jetty untuk mendeteksi dini indikasi kebakaran swabakar batubara (*self-combustion*).
  - **Integrasi Tiket Timbangan RFID Pelabuhan:** Pengambilan data tonase tanpa kertas yang terhubung langsung ke sistem akuntansi pemilik tambang.
  - **Sistem Navigasi & Telematika Real-Time:** Notifikasi otomatis jika unit mengalami perlambatan tidak wajar atau berhenti di luar area aman.

### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
* **Kepatuhan Target Tonase Harian:** Tercapainya kuota batubara harian ≥ 98%.
* **Nihil Denda Keterlambatan Tongkang (Zero Demurrage):** 100% tongkang terisi sebelum batas waktu laytime berakhir.
* **Tingkat Kepatuhan Penutupan Terpal:** 100% armada tertutup rapat selama hauling.
* **Nihil Insiden Debu Lingkungan:** Nol teguran resmi dari instansi pengawas lingkungan hidup.

### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
Sistem operasi hauling proyek **"${title}"** dinyatakan **Sangat Siap & Terakreditasi Penuh (OPERATIONAL-READY - APPROVED)**.`;
  }

  // 4. FORESTRY / KEHUTANAN / KAYU / PULP & PAPER
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    flowSummary = "Pemeriksaan sasis & bolster trailer -> Pemuatan kayu log di petak tebang TPn -> Pengikatan rantai baja lashing -> Hauling jalan konsesi gambut -> Penimbangan pabrik pulp mill -> Log yard sorting & e-SVLK.";
    slaSummary = "Waktu muat log crane (< 40 menit per 35 ton), Transit tebang ke mill (< 36 jam batas kesegaran), Pembongkaran log yard (< 30 menit), Validasi e-SVLK (< 15 menit).";
    digitalIntegrationSummary = "Pemindaian barcode SKSHHK kayu digital, GPS telemetry dengan pemantauan jalur gambut, dan integrasi data log yard mill.";
    kpiSummary = "Fresh Wood Yield SLA (≥ 95%), Zero Log Spill Incidents, 100% SVLK Compliance.";

    narrativeMarkdown = `### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
Alur operasional pengangkutan kayu log konsesi untuk proyek **"${title}"**:
  - **Tahap 1: Inspeksi Kesiapan Trailer Logging & Pengikat Bolster:** Pemeriksaan fisik stanchion tegak, uji kekuatan rantai baja pengikat lashing grade 80, sistem rem angin trailer ganda, dan kebugaran pengemudi sebelum memasuki petak hutan.
  - **Tahap 2: Pemuatan Kayu di Tempat Penimbunan Kayu Antara (TPn):** Unit log crane memuat gelondongan kayu akasia/eukaliptus ke atas sasis trailer berpenyangga bolster hingga kapasitas muat 30–35 ton.
  - **Tahap 3: Penguncian Rantai Baja & Pemindaian Barcode Lacak Balak:** Rantai pengikat dikencangkan dengan penegang hidrolik/manual dan diverifikasi tidak ada batang kayu yang menonjol melebihi lebar sasis. Barcode batang kayu dipindai menggunakan aplikasi SKSHHK elektronik.
  - **Tahap 4: Hauling Rute Konsesi & Jalur Gambut:** Trailer bergerak melalui jaringan jalan konsesi dengan kecepatan aman maksimal 30 km/jam, dengan pengawalan komunikasi radio di perlintasan jembatan kayu dan tanjakan tanah licin.
  - **Tahap 5: Penimbangan Jembatan & Penilaian Kualitas di Pabrik Kertas (Mill):** Setibanya di pabrik bubur kertas, unit ditimbang dan dilakukan uji rendemen serat serta kesegaran kayu di bawah batas toleransi 48 jam pasca-tebang.
  - **Tahap 6: Pembongkaran di Log Yard & Serah Terima Elektronik:** Kayu diturunkan menggunakan unloader portal crane log yard, dan berita acara serah terima disahkan secara digital ke sistem logistik terpadu pabrik mill.

### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
  - **Pengemudi Logging Trailer (Responsible):** Menjaga stabilitas kendaraan di medan konsesi bergelombang dan mematuhi batas kecepatan jalan tanah.
  - **Foreman Loading Petak Tebang (Accountable):** Memastikan penyusunan kayu di atas sasis simetris dan beban tidak melebihi kapasitas stanchion penahan.
  - **Operator Traktor Evakuasi Winch (Consulted):** Siaga di titik-titik tanjakan kritis jalur gambut untuk membantu penarikan armada saat hujan lebat.
  - **Kepala Log Yard Pabrik Kertas (Informed):** Mengatur antrean pembongkaran agar kontinuitas pasokan chipper kayu pabrik berjalan 24 jam nonstop.

### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
  - **Waktu Pemuatan di TPn Hutan:** Rata-rata 35–45 menit per unit trailer.
  - **Batas Waktu Tempuh Pasca-Tebang (Fresh Wood SLA):** Kayu wajib tiba di mill sebelum 36 jam sejak ditebang guna menjaga kualitas serat pulp.
  - **Waktu Pembongkaran di Log Yard:** Maksimal 25–35 menit per armada.
  - **Tingkat Kepatuhan Regulasi Lacak Balak (SVLK):** 100% kayu terdata secara digital tanpa perbedaan nomor seri.

### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
  - **Aplikasi Mobile e-SVLK Barcode:** Pencatatan volume dan asal petak kayu secara real-time yang langsung tersinkronkan ke server kehutanan.
  - **Sistem Navigasi Telematika Satelit:** Pelacakan posisi armada pada kawasan konsesi terpencil yang minim sinyal seluler menggunakan transmisi hibrida satelit.
  - **Integrasi Portal Gate-In Pabrik Kertas:** Verifikasi digital instan saat unit melintasi gerbang utama log yard.

### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
* **Tingkat Pasokan Kayu Segar Sesuai SLA:** Realisasi kayu segar tiba di mill ≥ 95%.
* **Insiden Tumpahan Kayu di Jalan:** Nol insiden muatan terlepas (Zero Log Spill Index).
* **Ketersediaan Armada Beroperasi:** Mechanical Availability armada trailer logging ≥ 89%.
* **Kepatuhan Dokumen Lacak Balak:** 100% legalitas kayu terverifikasi resmi.

### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
Sistem operasi untuk proyek **"${title}"** dinyatakan **Sangat Andal & Memenuhi Kriteria Keamanan Konsesi Hutan (APPROVED - GO)**.`;
  }

  // 5. GENERAL / OTHER COMMERCIAL LOGISTICS
  else {
    flowSummary = `Pemeriksaan pra-keberangkatan armada -> Pemuatan kargo di depo/gudang -> Penerbitan surat jalan digital -> Hauling rute koridor ${routeName} -> Pembongkaran & verifikasi kargo di tujuan -> Konfirmasi e-POD real-time.`;
    slaSummary = "Waktu muat gudang (< 60 menit), On-Time Delivery SLA (≥ 96%), Waktu bongkar barang (< 45 menit), Rekonsiliasi dokumen tagihan (< 24 jam).";
    digitalIntegrationSummary = "Pelacak GPS nirkabel cerdas, aplikasi mobile driver e-POD dengan foto bukti serah terima, dan integrasi API status perjalanan ke ERP klien.";
    kpiSummary = "On-Time In-Full Delivery (≥ 96%), Fleet Turnaround Adherence (≥ 92%), Zero Cargo Damage, Zero Lost Time Injury.";

    narrativeMarkdown = `### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
Alur operasional standar terpadu untuk proyek **"${title}"** pada koridor **${routeName}**:
  - **Tahap 1: Inspeksi Kelaikan Kendaraan & Kesiapan Pengemudi (Pre-Trip Inspection):** Pengecekan menyeluruh sistem rem, tekanan angin ban, lampu, sistem pelacak GPS, serta verifikasi kebugaran fisik pengemudi (*fit to drive check*).
  - **Tahap 2: Pemuatan Barang di Titik Asal / Fasilitas Pengirim:** Armada bermanuver ke loading dock. Barang dimuat dan ditata secara aman sesuai kapasitas beban sumbu legal dan diikat dengan tali pengaman (*cargo strapping*).
  - **Tahap 3: Verifikasi Dokumen & Pemasangan Segel Keamanan:** Surat jalan dan manifes muatan diterbitkan secara digital. Segel bernomor seri unik dipasang pada pintu boks/kontainer dan dicatat dalam sistem telematika.
  - **Tahap 4: Pelaksanaan Pengangkutan & Monitoring Rute Real-Time:** Armada bergerak melintasi rute yang telah disetujui. Tim Command Center memantau posisi geografis, waktu tempuh, dan parameter kecepatan secara aktif 24 jam.
  - **Tahap 5: Pembongkaran & Pemeriksaan Integritas Kargo di Titik Tujuan:** Setibanya di gudang penerima, segel keamanan diverifikasi utuh sebelum dibuka, dan kargo diturunkan dengan hati-hati untuk memastikan tidak ada kerusakan fisik.
  - **Tahap 6: Pengesahan Bukti Serah Terima Elektronik (e-POD Confirmation):** Penerima barang membubuhkan tanda tangan digital dan foto bukti serah terima pada aplikasi mobile driver, memicu konfirmasi otomatis penutupan order di sistem billing.

### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
  - **Pengemudi Truk Operasional (Responsible):** Melakukan inspeksi harian, mengemudikan kendaraan secara defensif, menjaga keselamatan kargo, dan mengunggah e-POD.
  - **Manajer Operasional & Dispatcher (Accountable):** Mengatur penugasan armada, memastikan kepatuhan jadwal keberangkatan, dan menangani deviasi perjalanan di jalan.
  - **Koordinator Pemeliharaan & Workshop (Consulted):** Memastikan seluruh armada menjalani servis preventif tepat waktu dan siap jalan dengan kelaikan 100%.
  - **Tim Layanan Pelanggan & Klien (Informed):** Menerima pembaharuan status pengiriman secara real-time dan notifikasi estimasi waktu kedatangan kargo.

### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
  - **Ketepatan Waktu Tiba di Titik Muat:** Toleransi kedatangan armada di lokasi pengirim maksimal 15 menit sebelum waktu pemuatan terjadwal.
  - **Durasi Proses Pemuatan di Gudang:** Maksimal 45–60 menit per unit armada.
  - **Ketepatan Waktu Pengantaran (On-Time Delivery SLA):** Realisasi kedatangan kargo di gudang penerima minimal mencapai 96% sesuai jadwal kesepakatan kontrak.
  - **Kecepatan Konfirmasi e-POD:** Unggah bukti serah terima digital maksimal 15 menit setelah proses pembongkaran selesai.

### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
  - **Sistem Telematika GPS Terpadu:** Pemantauan lokasi armada, kecepatan berkendara, pengereman mendadak (*harsh braking*), dan geofencing area rute resmi.
  - **Aplikasi Mobile Driver e-POD:** Fitur tanda tangan digital, pemindaian kode QR/barcode surat jalan, serta pengambilan foto bukti kondisi barang tiba.
  - **Portal Pelanggan Real-Time:** Dashboard online bagi klien untuk melacak posisi armada dan status pengiriman secara transparan dan mandiri.

### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
* **Tingkat Pengiriman Tepat Waktu & Lengkap (OTIF):** Target pencapaian minimal 96%.
* **Tingkat Kepatuhan Siklus Waktu Balik (TAT Adherence):** Minimal 92% perjalanan sesuai jadwal standar siklus.
* **Tingkat Kerusakan Barang (Damage Rate):** Maksimal di bawah 0.1% dari total kargo yang diangkut.
* **Tingkat Keselamatan Kerja (Safety Index):** Nihil kecelakaan kerja fatal (Zero Fatality & Zero Lost Time Injury).

### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
Operating Model untuk proyek **"${title}"** dinilai **Sangat Terstruktur, Modern, & Siap Dioperasikan (FEASIBLE - APPROVED)**. Penerapan alur proses digital dan standar SLA yang ketat menjamin efisiensi biaya serta kepuasan tinggi bagi mitra pelanggan korporat.`;
  }

  return {
    title,
    flowSummary,
    slaSummary,
    digitalIntegrationSummary,
    kpiSummary,
    narrativeMarkdown
  };
}
