/**
 * PRAMA AI Digital Coverage Generator (Pilar 10: Digital Coverage - Tools, Method, Impact, Automation)
 * Generates tailored, 100% project-title-aligned digital tool stacks, data methodologies,
 * quantitative operational impacts, and end-to-end digital automation workflows.
 */

export interface DigitalCoverageResult {
  title: string;
  toolsSummary: string;
  methodSummary: string;
  impactSummary: string;
  automationSummary: string;
  narrativeMarkdown: string;
}

export function generateDigitalCoverageForTitle(
  rawTitle: string,
  division?: string
): DigitalCoverageResult {
  const title = (rawTitle || "").trim() || "Kajian Cakupan Digital, Otomasi & Telematika Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik Darat & Telematika").trim();

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
  const routeName = origin && dest ? `${origin} ke ${dest}` : "Koridor Proyek";

  let toolsSummary = "";
  let methodSummary = "";
  let impactSummary = "";
  let automationSummary = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT / CLINKER
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    toolsSummary = "Sensor tekanan bejana nirkabel, GPS telemetry dengan geofencing silo, aplikasi mobile e-POD supir, dan integrasi API timbangan jembatan pabrik semen.";
    methodSummary = "Metodologi telemetri real-time memantau tekanan discharge (1.8-2.0 bar), peringatan overpressure dini, dan verifikasi muatan otomatis di jembatan timbang.";
    impactSummary = "Reduksi waktu bongkar dari 90 ke 52 menit (-42%), eliminasi 100% tumpahan debu semen, dan percepatan rekonsiliasi penagihan dari 5 hari ke real-time.";
    automationSummary = "Penerbitan surat jalan elektronik terhubung timbangan, verifikasi e-POD dengan tanda tangan QR-code, dan sinkronisasi otomatis ERP pelanggan.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Penerapan arsitektur teknologi terintegrasi khusus armada pengangkutan semen curah untuk proyek **"${title}"** pada koridor **${routeName}**:
  - **Sensor Pemantau Tekanan Digital Bejana (Smart Vessel Pressure Sensor):** Perangkat telemetri nirkabel yang dipasang pada bejana tangki semen bertekanan pneumatik guna memonitor stabilitas tekanan kompresor secara kontinu (rentang aman 1.8–2.0 bar) dan mencegah bahaya ledakan katup.
  - **Node Telematika GPS Heavy-Duty IP69K:** Pelacak satelit tangguh anti-debu semen dengan frekuensi pembaruan posisi per 5 detik, dilengkapi akselerometer untuk merekam pengereman mendadak (*harsh braking*) dan kepatuhan koridor rute.
  - **Aplikasi Mobile Pengemudi & e-POD Terenkripsi:** Antarmuka smartphone tahan banting bagi kru armada untuk memverifikasi nomor segel corong, mencatat tekanan bongkar, dan meminta tanda tangan digital penerima di batching plant.
  - **Gerbang Timbangan RFID Otomatis:** Integrasi pembaca kartu RFID nirsentuh pada jembatan timbang pabrik semen yang otomatis merekam berat kotor (*bruto*) dan berat kosong (*tarra*) tanpa antrean manual petugas loket.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
Tahapan metodologi penyaluran data telemetri dari armada menuju pusat kendali (*Command Center*):
  - **Akuisisi Data Sensorik Lapangan:** Sensor tekanan tangki dan GPS membaca kondisi unit setiap detik dan mentransmisikan data melalui modul seluler 4G LTE/GSM industri.
  - **Validasi Geofencing Silo Batching Plant:** Sistem secara otomatis mendeteksi saat armada memasuki radius 500 meter dari silo tujuan dan mengirimkan notifikasi kesiapan pompa kompresor kepada petugas batching plant.
  - **Pemantauan Anomali Tekanan Discharge:** Algoritma sistem mendeteksi deviasi penurunan tekanan kompresor unloader blower secara mendadak, mengidentifikasi potensi penyumbatan pipa semen (*choking*) dalam waktu di bawah 15 detik.
  - **Rekonsiliasi Data Tonase Terintegrasi:** Data timbangan asal disandingkan secara otomatis dengan data timbangan tiba untuk memvalidasi tidak adanya kehilangan material curah selama perjalanan.

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
Hasil pengukuran efisiensi sebelum dan sesudah implementasi ekosistem digital:
  - **Durasi Pembongkaran Blower Semen:** Turun dari rata-rata 85–90 menit menjadi 50–55 menit per 30 ton (**peningkatan kecepatan +38%**).
  - **Tingkat Kepatuhan Batas Muatan (Zero ODOL Compliance):** 100% armada terkontrol secara presisi di jembatan timbang digital (**nihil denda pelanggaran tonase**).
  - **Kecepatan Penerbitan Tagihan (Invoicing Turnaround):** Terpangkas dari 5–7 hari kerja verifikasi surat jalan kertas menjadi kurang dari 4 jam setelah e-POD ditandatangani (**akselerasi cash-flow +75%**).
  - **Insiden Tumpahan Debu Semen:** Penurunan drastis hingga 0 insiden tumpahan berkat alarm otomatis sensor tekanan bejana.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Penerbitan Surat Jalan Digital Otomatis:** Surat jalan elektronik (*e-Waybill*) diterbitkan instan saat truk selesai menimbang, terikat dengan nomor polisi dan ID supir.
  - **Verifikasi Segel Berbasis Foto & QR Code:** Kru armada memindai kode QR segel katup di titik muat dan titik bongkar untuk membuktikan keaslian muatan tanpa intervensi manual.
  - **Sinkronisasi Langsung ke ERP Pelanggan:** Saat berita acara e-POD ditandatangani oleh penerima proyek, sistem mengirimkan payload data (berat netto, waktu tiba, foto lokasi) via API webhook langsung ke SAP/Oracle milik kontraktor batching plant.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Enkripsi Data End-to-End:** Seluruh transmisi data GPS dan transaksi tanda tangan digital dilindungi enkripsi AES-256 dan protokol TLS 1.3.
* **Audit Trail Digital Terverifikasi:** Setiap perubahan status order, log lokasi, dan riwayat tekanan tangki tersimpan permanen dalam basis data immutable yang siap diaudit.
* **Ketersediaan Sistem (High Availability SLA):** Server telematika beroperasi dengan garansi uptime 99.9% menggunakan infrastruktur cloud multi-zona redundan.

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Arsitektur digital proyek **"${title}"** dinyatakan **Sangat Siap & Terstandarisasi Industri 4.0 (DIGITAL-READY - APPROVED)**. Integrasi sensor bejana bertekanan dan otomasi e-POD memberikan transparansi operasional total dan keunggulan kompetitif mutlak.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    toolsSummary = "Fleet Management System (FMS) GPS presisi tinggi, kamera AI Driver Safety System (DSS/DSM), sensor suspensi timbangan gandar, dan integrasi API SIMBARA Ditjen Minerba.";
    methodSummary = "Dispatching sirkular dinamis berbasis optimasi algoritma muat-angkut (truck-shovel matching), peringatan kantuk supir instan, dan rekonsiliasi kuota royalti mineral.";
    impactSummary = "Peningkatan utilitas unit dump truck dari 72% ke 89%, penurunan waktu antre di front pit tambang (-35%), dan nihil insiden microsleep.";
    automationSummary = "Sinkronisasi otomatis e-Simponi/SIMBARA, verifikasi RFID timbangan jembatan dermaga jetty, dan peringatan batas kecepatan otomatis FMS.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Arsitektur teknologi pertambangan terintegrasi untuk proyek hauling bijih nikel **"${title}"**:
  - **Fleet Management System (FMS) Unit Tambang:** Unit komputer kabin cerdas terhubung ke antena GPS berpresisi tinggi dengan toleransi koordinat sub-meter untuk memandu rute hauling di area penambangan aktif.
  - **Kamera AI Pemantau Kantuk & Perilaku (Driver Safety System - DSS):** Perangkat kamera dual-lensa berbasis AI yang memindai kedipan mata supir, deteksi menguap, merokok, atau penggunaan ponsel di kabin, memicu getaran kursi dan alarm suara seketika.
  - **Sensor Suspensi Timbangan Gandar Dinamis (On-Board Weighing Sensor):** Sensor tekanan hidrolik suspensi yang menghitung estimasi tonase muatan laterit di bak dump truck secara real-time saat excavator mengisi muatan.
  - **Modul Transmisi Seluler Hibrida & Radio VHF:** Sistem komunikasi ganda yang beralih otomatis ke sinyal radio mesh saat armada berada di area pit tambang yang mengalami blank spot jaringan seluler.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
  - **Dynamic Dispatching & Shovel Matching:** Pusat kendali tambang memanfaatkan algoritma antrean terpadu untuk mengarahkan dump truck kosong ke front excavator yang memiliki waktu tunggu paling minim.
  - **Live Fatigue Monitoring Pipeline:** Klip video peringatan kantuk supir dikirimkan secara otomatis via sinyal radio 4G ke ruang kontrol K3LL dalam tempo kurang dari 3 detik untuk tindakan pencegahan pergantian shift.
  - **Integrasi API SIMBARA ESDM:** Data penimbangan tonase bersih di jembatan dermaga diselaraskan secara langsung dengan platform SIMBARA (Sistem Informasi Mineral dan Batubara) Kementerian ESDM guna memvalidasi kuota produksi legal.
  - **Geofencing & Kecepatan Zona Bahaya:** Sistem telematika memberlakukan batas kecepatan otomatis di area turunan curam (maks. 25 km/jam) dan tikungan blind spot dengan peringatan audio kabin.

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
  - **Peningkatan Utilitas Armada Dump Truck:** Utilisasi harian armada meningkat dari 74% menjadi 88% (**efisiensi waktu operasional +19%**).
  - **Reduksi Waktu Antre di Front Penambangan:** Waktu tunggu antre unit di bawah excavator berkurang dari 18 menit menjadi 6 menit per rit (**penghematan waktu 66%**).
  - **Tingkat Kecelakaan Kerja & Microsleep:** Penurunan insiden kelelahan supir mencapai 100% (Zero Fatality & Zero Rollover).
  - **Akurasi Pelaporan SIMBARA:** Rekonsiliasi dokumen tonase royalti tambang mencapai akurasi 99.9% tanpa selisih catatan manual.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Timbangan RFID Jembatan Jetty Otomatis:** Pengemudi tidak perlu turun dari kabin; pemindaian RFID membaca identitas armada dan mencatat berat kotor dalam tempo 4 detik.
  - **Surat Jalan Digital Tambang (e-Manifest):** Pengesahan otomatis status muatan laterit dari pit tambang ke bunker smelter dengan stempel waktu terverifikasi satelit.
  - **Otomatisasi Penjadwalan Servis Preventif:** Log kilometer dan jam mesin (hour meter) secara otomatis memicu perintah kerja perbaikan (*preventive maintenance work-order*) di sistem bengkel pusat.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Kepatuhan Regulasi ESDM & Kaidah Pertambangan:** Seluruh rekaman sistem memenuhi standar Kepmen ESDM No. 1827 K/30/MEM/2018 tentang Keselamatan Pertambangan.
* **Penyimpanan Data Telematika Off-Grid:** Kapasitas perekaman data lokal di unit kendaraan hingga 30 hari jika terjadi gangguan konektivitas jaringan tambang.
* **Akses Berbasis Peran Terenkripsi (RBAC):** Proteksi hak akses data telematika tambang dengan autentikasi multifaktor (MFA).

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Solusi teknologi dan otomasi proyek **"${title}"** dinyatakan **Sangat Andal, Berstandar Pertambangan Modern, & Siap Dioperasikan (APPROVED - GO)**. Integrasi FMS cerdas dan pengawasan keselamatan AI memastikan hauling bijih nikel berjalan lancar tanpa henti.`;
  }

  // 3. BATUBARA / COAL HAULING
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    toolsSummary = "Sensor inframerah pendeteksi suhu batubara otomatis, GPS telemetry FMS hauling, penutup terpal hidrolik terintegrasi nirkabel, dan gerbang timbang RFID dermaga jetty.";
    methodSummary = "Pemantauan titik panas batubara secara kontinu di gerbang masuk jetty, optimalisasi konvoi kecepatan jalan hauling khusus, dan verifikasi muatan tongkang real-time.";
    impactSummary = "Eliminasi risiko kebakaran swabakar kargo (-100%), percepatan waktu timbang jetty dari 60 detik ke 15 detik, dan nihil denda keterlambatan tongkang.";
    automationSummary = "Tiket timbang digital langsung terhubung ke sistem logistik tambang, penutupan terpal elektrik otomatis, dan sinkronisasi kuota MOMS ESDM.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Ekosistem perangkat keras dan sistem digital untuk proyek pengangkutan batubara **"${title}"**:
  - **Kamera Pemindai Termal Otomatis (Infrared Coal Temperature Scanner):** Kamera inframerah resolusi tinggi yang terpasang di gerbang masuk dermaga jetty untuk mendeteksi anomali titik panas batubara (potensi swabakar) dalam hitungan detik.
  - **Node Telematika GPS Heavy Duty:** Perangkat pelacak satelit dengan casing anti-getaran ekstrem yang memonitor rute konvoi hauling jalan khusus batubara.
  - **Aktuator Penutup Terpal Otomatis Nirkabel:** Mekanisme penutup bak hidrolik yang dapat dioperasikan secara elektronik dari kabin dengan sensor verifikasi kerapatan penutup.
  - **Sistem Pembaca RFID Jembatan Timbang Jetty:** Pembaca frekuensi radio jarak jauh yang mencatat identitas armada dan tonase batubara secara otomatis saat melintasi timbangan.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
  - **Thermal Screening & Alerting Pipeline:** Batubara dengan suhu di atas 50°C langsung memicu alarm di Command Center dan mengarahkan truk ke jalur pendinginan khusus.
  - **Konvoi Rute Terkelola (Speed Convoys Management):** FMS mengatur jarak aman antar armada di koridor tambang dan membatasi kecepatan maksimal 40 km/jam.
  - **Sinkronisasi Data Muatan Tongkang:** Data berat bersih setiap dump truck secara kumulatif dijumlahkan untuk mencocokkan target muatan tongkang (*barge loading draft survey*).

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
  - **Pencegahan Kebakaran Swabakar:** 100% muatan batubara dipantau suhunya sebelum masuk ke area conveyor tongkang (**nihil insiden kebakaran**).
  - **Kecepatan Siklus Jembatan Timbang:** Waktu penimbangan terpangkas dari 60 detik menjadi 15 detik per unit (**peningkatan kapasitas timbang 4x lipat**).
  - **Nihil Tumpahan Debu Batubara di Jalan:** 100% armada mematuhi standar penutupan terpal otomatis berkat verifikasi sensor kabin.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Tiket Timbang Digital Tanpa Kertas:** Bukti penimbangan otomatis dikirimkan ke server logistik dan aplikasi mobile pengawas tongkang.
  - **Otomatisasi Penagihan Ritase Pengemudi:** Perhitungan insentif ritase supir dihitung secara otomatis oleh sistem payroll berdasarkan pencatatan RFID timbangan.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Kepatuhan Regulasi Ditjen Minerba:** Integrasi data sesuai kaidah pelaporan MOMS dan e-PNBP Kementerian ESDM.
* **Integritas Data Transaksi Penimbangan:** Log berat jembatan timbang dikunci secara kriptografis untuk mencegah manipulasi angka tonase.

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Arsitektur digital proyek **"${title}"** dinilai **Sangat Efisien & Teruji Andal (OPERATIONAL-READY - APPROVED)**. Penerapan pemindaian termal dan otomatisasi RFID menjamin keandalan rantai pasok batubara ke pembangkit dan ekspor.`;
  }

  // 4. FORESTRY / KEHUTANAN / KAYU / PULP & PAPER
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    toolsSummary = "Sensor GPS satelit hybrid area blankspot hutan, scanner barcode lacak balak e-SVLK kayu, timbangan gandar portable nirkabel, dan gerbang digital log yard mill.";
    methodSummary = "Metodologi lacak balak rantai kustodi kayu (Chain of Custody), transmisi satelit hibrida pada jalan konsesi terpencil, dan pemantauan waktu kesegaran kayu 36 jam.";
    impactSummary = "Kepatuhan legalitas kayu 100% e-SVLK, reduksi penyusutan rendemen serat kayu (-22%), dan visibilitas armada di area hutan terpencil 100%.";
    automationSummary = "Penerbitan surat keterangan sahnya hasil hutan (SKSHHK) elektronik instan, integrasi antrean unloader crane pabrik kertas, dan barcode gate-in.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Arsitektur teknologi telematika kehutanan untuk proyek pengangkutan kayu log konsesi **"${title}"**:
  - **Node Telematika GPS Satelit Hibrida (Iridium/Cellular):** Unit pelacak canggih yang otomatis beralih ke konstelasi satelit Iridium saat armada melintasi pedalaman konsesi hutan yang tidak terjangkau sinyal seluler.
  - **Pemindai Barcode Lacak Balak Tangguh (Industrial Handheld Scanner):** Perangkat pembaca barcode berkualifikasi militer (MIL-STD-810H) untuk memverifikasi nomor batang pohon dan asal petak tebang di Tempat Penimbunan Kayu Antara (TPn).
  - **Sensor Timbangan Gandar Portabel Nirkabel:** Pelat timbangan nirkabel tipis tahan lumpur yang diletakkan di bawah ban trailer logging untuk mengukur distribusi beban muatan kayu sebelum melintasi jembatan konsesi.
  - **Kamera Pengawas Muatan Sasis:** Kamera sudut lebar tahan air IP69K yang memantau kekencangan rantai pengikat lashing di atas bolster secara berkelanjutan.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
  - **Alur Pelacakan Rantai Kustodi Kayu (Chain of Custody Tracking):** Setiap batang kayu yang dimuat diverifikasi identitas petak asalnya, disandingkan dengan izin Rencana Kerja Tahunan (RKT) kehutanan secara digital.
  - **Pemantauan Batas Waktu Kesegaran Kayu (Fresh Wood Log Pipeline):** Jam digital otomatis menghitung mundur waktu sejak kayu ditebang hingga tiba di pabrik mill (target di bawah 36 jam) untuk menjaga rendemen serat selulosa.
  - **Integrasi Antrean Log Yard Pabrik Kertas:** Sistem mengoordinasikan jadwal kedatangan truk ke area log yard pabrik mill agar antrean pembongkaran crane berjalan lancar.

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
  - **Kepatuhan Legalitas Kayu (e-SVLK Compliance):** 100% kayu terdata secara digital tanpa celah kayu ilegal (**Zero Non-Compliance**).
  - **Peningkatan Kesegaran Kayu (Wood Freshness SLA):** 96% pengiriman kayu tiba di pabrik bubur kertas dalam kondisi segar di bawah batas waktu 36 jam.
  - **Visibilitas Pergerakan di Jalur Hutan Terpencil:** Jangkauan komunikasi dan keselamatan armada mencapai 100% berkat transmisi satelit hibrida.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Penerbitan e-SKSHHK Instan:** Integrasi dengan sistem kementerian kehutanan menerbitkan dokumen legalitas kayu elektronik secara cepat di pintu keluar pos konsesi.
  - **Gerbang Masuk Digital Pabrik Kertas (Smart Mill Gate):** Pemindaian kode batang dokumen pada saat gate-in memicu penugasan zona penumpukan (*yard slot assignment*) secara otomatis.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Kepatuhan Sistem Verifikasi Legalitas Kayu (SVLK):** Terintegrasi langsung dengan database audit kehutanan bersertifikasi internasional (FSC/PEFC).
* **Cadangan Data Offline Terenkripsi:** Data identifikasi kayu tersimpan aman di perangkat genggam dan disinkronkan secara otomatis saat kembali terhubung ke jaringan.

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Penerapan ekosistem digital untuk proyek **"${title}"** dinyatakan **Sangat Matang & Memenuhi Standar Kelestarian Hutan (APPROVED - GO)**. Teknologi satelit dan barcode lacak balak menjamin integritas rantai pasok kayu log ke industri pulp & paper.`;
  }

  // 5. CPO / PALM OIL / MINYAK SAWIT
  else if (titleLower.includes("cpo") || titleLower.includes("sawit") || titleLower.includes("palm oil") || titleLower.includes("minyak")) {
    toolsSummary = "Sensor level tangki ultrasonik, temperature logger fluiditas olein, e-Seal anti-kontaminasi/tampering, dan aplikasi uji kualitas sampel FFA digital.";
    methodSummary = "Pemantauan integritas segel elektronik (e-Seal) anti-pencurian di jalan, pemantauan kestabilan suhu cairan CPO (45-55°C), dan integrasi sertifikasi ISPO/RSPO.";
    impactSummary = "Reduksi klaim penyusutan volume CPO hingga 0.05%, eliminasi risiko kontaminasi asam lemak bebas (FFA), dan penagihan cepat berbasis tiket timbang digital.";
    automationSummary = "Penyegelan elektrik tangki berbasis RFID, pencatatan otomatis hasil lab FFA, dan sinkronisasi data bulking station pelabuhan.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Ekosistem perangkat telematika khusus pengangkutan minyak kelapa sawit (CPO) untuk proyek **"${title}"**:
  - **Segel Elektronik Cerdas Anti-Manipulasi (Smart e-Seal):** Perangkat pengunci manhole atas dan katup buang bawah tangki berbasis RFID/GPS yang membunyikan alarm dan mengirim sinyal bahaya seketika jika segel dibuka di luar geofence resmi.
  - **Sensor Suhu Fluida Presisi Tinggi (In-Tank Temperature Logger):** Probe sensor suhu tahan korosi yang terpasang di dalam kompartemen tangki stainless steel untuk memonitor kestabilan suhu CPO pada rentang optimal 45°C–55°C guna mencegah pembekuan cairan.
  - **Sensor Level Cairan Ultrasonik Nirkabel:** Pemantau volume permukaan minyak sawit real-time yang mendeteksi penurunan level tidak wajar (indikasi pencurian/tumpahan minyak) selama perjalanan.
  - **Aplikasi Mobile Pengujian Sampel FFA (Free Fatty Acid):** Modul digital pencatatan hasil uji laboratorium kadar asam lemak bebas dan kadar air sebelum dan sesudah pembongkaran di bulking station pelabuhan.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
  - **Alur Pemantauan Integritas Kargo (Cargo Integrity Pipeline):** Status segel elektronik terus-menerus disinkronkan ke Command Center; jika terjadi upaya perusakan fisik segel, sistem memicu notifikasi peringatan tingkat darurat.
  - **Pemantauan Kualitas Suhu Pemanas Tangki (Heating Coil Alert):** Pemberitahuan otomatis kepada supir jika suhu fluida mendekati batas bawah kritis sebelum tiba di dermaga ekspor.
  - **Sinkronisasi Data Timbangan Bulking Station:** Data timbangan pabrik kelapa sawit (PKS) disandingkan dengan timbangan pelabuhan untuk memverifikasi persentase penyusutan (*shrinkage rate* di bawah ambang batas toleransi 0.1%).

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
  - **Pencegahan Kehilangan & Penyusutan Minyak (Shrinkage Reduction):** Penyusutan volume CPO terpangkas dari 0.35% menjadi kurang dari 0.05% (**penghematan nilai kargo tinggi**).
  - **Eliminasi Penolakan Kualitas (Zero Rejection SLA):** Nihil penolakan kargo di tangki timbun refinery akibat penurunan mutu suhu atau kontaminasi kotoran.
  - **Kecepatan Validasi Surat Jalan (e-POD Confirmation):** Tanda terima digital terekonsiliasi dalam waktu 15 menit setelah proses pembongkaran selesai.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Buka Kunci Segel Elektronik Otomatis Berbasis Lokasi (Geofenced Unlocking):** Katup tangki hanya dapat dibuka kuncinya secara digital setelah koordinat GPS truk terverifikasi berada di dalam zona dermaga bulking station.
  - **Integrasi Sertifikasi Berkelanjutan (ISPO/RSPO Digital Badge):** Data nomor sertifikasi perkebunan tertaut otomatis dalam surat jalan digital untuk verifikasi kepatuhan pasar ekspor.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Kepatuhan Terhadap Standar Pangan (Food-Grade Hygiene Certification):** Seluruh perangkat sensor tangki memenuhi standar higienitas pangan dan tidak mencemari minyak nabati.
* **Penyimpanan Log Keamanan Kargo:** Riwayat status kunci segel dan data suhu tersimpan dalam arsip terenkripsi untuk kebutuhan audit klaim asuransi kargo.

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Arsitektur digital proyek **"${title}"** dinyatakan **Sangat Unggul & Memenuhi Standar Rantai Pasok CPO Kelas Dunia (APPROVED - GO)**.`;
  }

  // 6. GENERAL / COMMERCIAL LOGISTICS / CONTAINER / COLD CHAIN
  else {
    toolsSummary = "Smart GPS telematics node, aplikasi mobile driver e-POD, sensor suhu kargo/IoT door sensor, dan integrasi API ERP pelanggan.";
    methodSummary = "Pemantauan posisi rute real-time, geofencing titik bongkar muat, peringatan dini deviasi perjalanan, dan validasi serah terima elektronik instan.";
    impactSummary = "Peningkatan ketepatan waktu pengiriman (OTD) hingga 98%, reduksi waktu penyelesaian administrasi order (-70%), dan visibilitas kargo penuh 24/7.";
    automationSummary = "Penerbitan surat jalan digital otomatis, tanda tangan e-POD dengan koordinat GPS dan foto bukti tiba, serta sinkronisasi billing instan.";

    narrativeMarkdown = `### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
Arsitektur ekosistem teknologi digital komprehensif untuk proyek **"${title}"** pada koridor **${routeName}**:
  - **PRAMA Telematics Smart GPS Node (IoT Hardware):** Unit pelacak canggih terpasang di sasis kendaraan dengan baterai cadangan terintegrasi, pembaruan posisi real-time, dan sensor pemantau akselerasi/pengereman (*harsh braking & speeding*).
  - **Aplikasi Mobile Kru Pengemudi (Pancaran Driver App & e-POD):** Aplikasi smartphone bagi pengemudi untuk menerima penugasan surat jalan digital, konfirmasi rute perjalanan, pelaporan status perjalanan, dan pengambilan bukti serah terima kargo (*proof of delivery*).
  - **Sensor Pintu & Keamanan Kargo Cerdas (IoT Cargo Sensor):** Perangkat pemantau nirkabel yang mendeteksi pembukaan pintu kontainer/boks kargo dan mengirimkan peringatan jika dibuka di luar titik tujuan resmi.
  - **Cloud Portal & Command Center Dashboard (SaaS Integration):** Sistem monitoring terpusat berbasis cloud yang menampilkan posisi seluruh armada aktif, estimasi waktu tiba (ETA), serta grafik utilisasi operasional 24/7.

### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
  - **Pemantauan Rute & Deteksi Deviasi Rute Otomatis:** Algoritma navigasi mencocokkan pergerakan kendaraan dengan koridor rute yang telah ditentukan; deviasi rute lebih dari 500 meter langsung memicu notifikasi kepada dispatcher.
  - **Geofencing Lokasi Muat & Bongkar:** Sistem secara otomatis mendeteksi kedatangan dan keberangkatan armada di lokasi fasilitas pengirim dan penerima tanpa perlu konfirmasi manual.
  - **Pipeline Pelaporan Kondisi Armada:** Data konsumsi bahan bakar, jam operasional mesin (*engine hours*), dan kilometer jarak tempuh dialirkan secara otomatis ke sistem penjadwalan pemeliharaan preventif.

### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
  - **Ketepatan Waktu Pengiriman (On-Time Delivery Rate):** Meningkat dari 84% menjadi 98% berkat optimalisasi navigasi dan visibilitas rute real-time.
  - **Waktu Penyelesaian Dokumen Tagihan (Billing Cycle Time):** Terpangkas dari 5 hari kerja menjadi kurang dari 2 jam pasca e-POD ditandatangani (**peningkatan arus kas +80%**).
  - **Pengurangan Biaya Bahan Bakar (Fuel Efficiency):** Penghematan konsumsi BBM rata-rata 8–12% berkat reduksi idling dan kepatuhan kecepatan berkendara efisien (*eco-driving*).
  - **Nihil Kehilangan Kargo (Zero Cargo Loss):** Integritas keamanan kargo terjamin 100% dengan sensor pintu dan pemantauan geofence aktif.

### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
  - **Penerbitan Surat Jalan Elektronik Terpusat:** Dokumen surat jalan digital diterbitkan otomatis dari ERP saat penugasan unit disetujui oleh manajer operasional.
  - **Validasi Serah Terima Digital dengan Foto & Geotag:** Pengemudi mengambil foto kondisi fisik barang di lokasi penerima dan meminta tanda tangan digital yang otomatis terkunci dengan stempel waktu dan koordinat satelit.
  - **Sinkronisasi Webhook ke ERP Klien:** Data serah terima kargo langsung disalurkan via API ke sistem manajemen gudang (WMS/ERP) mitra pelanggan tanpa penundaan data.

### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
* **Kerahasiaan & Enkripsi Data Transaksi:** Seluruh pertukaran data dilindungi protokol keamanan enkripsi standar industri (TLS 1.3 dan AES-256).
* **Ketersediaan Infrastruktur Cloud:** Layanan sistem telematika berjalan pada arsitektur server multi-zona dengan SLA ketersediaan 99.9%.
* **Kepatuhan Privasi Data:** Pengelolaan data perjalanan dan identitas pengemudi mematuhi regulasi perlindungan data pribadi (UU PDP).

### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
Penerapan ekosistem digital untuk proyek **"${title}"** dinilai **Sangat Terpadu, Efisien, & Siap Dioperasikan (DIGITAL-READY - APPROVED)**. Penerapan IoT telematika dan otomasi e-POD menjamin keunggulan operasional serta kepuasan tinggi bagi mitra pelanggan korporat.`;
  }

  return {
    title,
    toolsSummary,
    methodSummary,
    impactSummary,
    automationSummary,
    narrativeMarkdown
  };
}
