/**
 * PRAMA AI Transition Model Generator (Pilar 6: Transition Model Pre-On-Post)
 * Generates tailored, 100% project-title-aligned transition roadmap, fleet readiness,
 * route trial, and post-go-live stabilization narratives.
 */

export interface TransitionModelResult {
  title: string;
  preTransitionSummary: string;
  onTransitionSummary: string;
  postTransitionSummary: string;
  kpiGovernance: string;
  narrativeMarkdown: string;
}

export function generateTransitionModelForTitle(
  rawTitle: string,
  division?: string
): TransitionModelResult {
  const title = (rawTitle || "").trim() || "Kajian Model Transisi & Deployment Operasional Logistik";
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

  let preTransitionSummary = "";
  let onTransitionSummary = "";
  let postTransitionSummary = "";
  let kpiGovernance = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    preTransitionSummary = "Audit kelaikan tangki silo bertekanan, kalibrasi unloader blower compressor (2.0 bar), dan sertifikasi K3 pabrik semen.";
    onTransitionSummary = "Dry-run pengangkutan tanpa muatan dilanjutkan uji pengisian perdana (wet commissioning) dan pembongkaran di batching plant penerima.";
    postTransitionSummary = "Stabilisasi ritase reguler 24/7, integrasi SLA kecepatan discharge < 45 menit, dan audit rutin jembatan timbang Zero ODOL.";
    kpiGovernance = "Tingkat Kepatuhan SLA Unloading (≥98%), Physical Availability (≥92%), Zero Spillage.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kesiapan Teknis (Pre-Transition: Minggu 1 – 4)
Fase persiapan proyek **"${title}"** difokuskan pada pemenuhan kelaikan teknis armada tangki silo dan integrasi protokol keselamatan kerja industri semen di koridor **${routeName}**.

* **Milestone Kunci Pra-Operasional:**
  - **Audit Kelaikan Teknis Tangki Silo:** Verifikasi sertifikasi bejana tekan, membran aerasi pneumatic, dan kalibrasi kompresor pembuang semen (*unloader blower*) guna menjamin discharge time di bawah 45 menit.
  - **Survei Rute & Batas Jembatan Timbang:** Pemetaan jalur antara pabrik semen induk ke titik-titik batching plant rekanan untuk memastikan kepatuhan Muatan Sumbu Terberat (MST 10 Ton) dan izin rute Dishub.
  - **Pelatihan K3 & Defensive Driving:** Sertifikasi pengemudi terkait penanganan tekanan tangki silo, tata cara penguncian manhole, dan prosedur darurat kebocoran pneumatik.
  - **Integrasi Sistem Timbangan Digital:** Uji koneksi API sistem timbangan jembatan pabrik semen dengan dashboard operasional transporter.

### 2. Tahap Uji Coba & Peluncuran Rute (On-Transition: Minggu 5 – 8)
Fase peluncuran bertahap (*phased rollout*) untuk memvalidasi performa di lapangan sebelum operasi komersial penuh:
  - **Dry-Run Route Simulation (Minggu 5):** Uji coba armada kosong melintasi rute **${routeName}** guna mengukur durasi tempuh riil, titik istirahat aman, dan konsumsi solar dasar.
  - **Wet Commissioning & Uji Bongkar Perdana (Minggu 6):** Pengangkutan 3–5 unit perdana semen curah menuju silo batching plant sasaran. Pengujian durasi unloading aktual dan deteksi residu material di dasar tangki.
  - **Stabilisasi Slot Loading Pabrik (Minggu 7–8):** Koordinasi pengaturan jadwal antrean pemuatan (*slot loading*) di packing plant semen untuk menekan waktu tunggu sebelum pengisian (*idle waiting time*) < 20 menit.

### 3. Tahap Operasi Penuh & Keberlanjutan SLA (Post-Transition: Minggu 9+)
Fase operasi stabil berkelanjutan (*Business-As-Usual / BAU*) berstandar korporat:
  - **Rotasi Ritase 24/7:** Pemberlakuan sistem dua pengemudi per unit armada untuk rute jarak jauh guna mempertahankan utilisasi armada di atas 85%.
  - **Preventive Maintenance Terjadwal:** Servis berkala per 10.000 km di bengkel rekanan mencakup penggantian filter udara kompresor, pengecekan seal pneumatik, dan rotasi ban.
  - **Audit Kepatuhan Zero ODOL Berkala:** Pengecekan acak harian surat jalan dan berat timbangan untuk memastikan nihil pelanggaran regulasi beban jalan.

### 4. Matriks Tata Kelola & KPI Kesiapan Transisi (Governance & Performance)
* **Kesiapan Armada (Fleet Availability):** Target ≥92% unit siap operasi setiap hari.
* **Kecepatan Bongkar Muat (Discharge SLA):** Rata-rata waktu unloader ≤ 45 menit per 25–30 ton muatan semen curah.
* **Ketepatan Jadwal Kedatangan (On-Time In Full - OTIF):** Tingkat kepatuhan jadwal tiba di batching plant ≥ 96%.
* **Nihil Tumpahan & Insiden (Zero Spillage & Zero LTI):** Kepatuhan protokol lingkungan pabrik semen tanpa pencemaran debu semen.

### 5. Rekomendasi Eksekutif Transisi (Executive Readiness Verdict)
Rencana transisi untuk **"${title}"** dinilai **Sangat Matang & Siap Dijalankan (Ready for Deployment - GO)**. Disarankan memulai proses audit kelaikan kompresor unloader blower pada minggu pertama persiapan.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    preTransitionSummary = "Audit spesifikasi dump truck heavy-duty pelat Hardox, penyiapan workshop on-site tambang, dan integrasi SIMBARA digital.";
    onTransitionSummary = "Uji hauling bertahap dari pit ke stockpile, sinkronisasi match factor excavator, dan pengujian durasi cycle time.";
    postTransitionSummary = "Operasional penuh 2-shift, rotasi mekanik cepat pit-stop 24 jam, dan penegakan manajemen kelelahan pengemudi (fatigue camera).";
    kpiGovernance = "Mechanical Availability (≥90%), Match Factor (0.95–1.05), Zero LTI.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kesiapan Lapangan (Pre-Transition: Minggu 1 – 4)
Persiapan operasional proyek **"${title}"** berpusat pada kelaikan unit tambang dan keselamatan jalur hauling:
  - **Commissioning Dump Truck Heavy-Duty:** Pengecekan ketebalan bak Hardox, sistem hidrolik hoist tipper, ban mining E-4, serta pemasangan rotary lamp dan bendera buggy whip.
  - **Pembangunan Workshop & Fasilitas Pendukung On-Site:** Pendirian workshop servis pit-stop, tangki penyimpanan solar B35 industri, serta ketersediaan stok suku cadang cepat aus (*fast-moving spare parts*).
  - **Integrasi Izin & SIMBARA:** Sinkronisasi surat jalan elektronik tambang dengan gerbang timbang smelter dan kepatuhan kuota RKAB.
  - **Induksi K3 Tambang & Sertifikasi Driver:** Pelatihan Defensive Driving Tambang (DDT) dan sertifikasi operasional alat berat bagi seluruh pengemudi.

### 2. Tahap Uji Coba Hauling Rute Tambang (On-Transition: Minggu 5 – 8)
  - **Uji Kelayakan Jalur Hauling (Trial Run):** Melakukan simulasi hauling beban bertahap (50%, 75%, 100% kapasitas muat) di jalur tambang untuk mendeteksi titik blind spot, tanjakan kritis, dan area rawan amblas.
  - **Kalibrasi Waktu Siklus (Cycle Time Optimization):** Mengukur durasi pemuatan oleh excavator, waktu jelajah, penimbangan, dan dumping di hopper smelter untuk mencapai durasi siklus optimal.
  - **Sinkronisasi Rasio Alat Muat (Match Factor):** Mengatur jumlah dump truck per excavator agar mencapai rasio ideal 1.0 (nihil antrean di pit maupun di stockpile).

### 3. Tahap Operasional Penuh & Pemeliharaan Kritis (Post-Transition: Minggu 9+)
  - **Operasional Penuh Hauling 2-Shift:** Penerapan pergantian shift langsung di unit (*hot seat*) guna memaksimalkan waktu operasional hingga 20 jam per hari.
  - **Manajemen Ban & Rangka Tambang:** Audit tekanan angin ban harian menggunakan TPMS digital dan inspeksi keretakan sasis akibat medan bebatuan tambang.
  - **Manajemen Kelelahan Pengemudi (Fatigue Management):** Penerapan kamera AI deteksi kantuk dan ruang istirahat terakreditasi sebelum pergantian shift malam.

### 4. Matriks Tata Kelola & KPI Transisi
* **Ketersediaan Mekanik (Mechanical Availability - MA):** Target MA ≥ 90%.
* **Pencapaian Target Tonase (Daily Hauling Output):** Akurasi volume harian terhadap target smelter ≥ 98%.
* **Indeks Keselamatan Kerja:** Nihil kecelakaan fatal (Zero Fatality & Zero Lost Time Injury).

### 5. Rekomendasi Eksekutif Transisi
Penerapan model transisi bertahap pada proyek **"${title}"** berada pada status **Sangat Direkomendasikan (Feasible - GO)**.`;
  }

  // 3. BATUBARA / COAL
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    preTransitionSummary = "Inspeksi bak tronton high-cube, pemasangan terpal otomatis anti-debu, dan koordinasi kuota stockpile jetty.";
    onTransitionSummary = "Uji hauling malam hari, integrasi sensor timbangan dua lajur, dan kalibrasi kecepatan ekonomis (fuel burn rate).";
    postTransitionSummary = "Stabilisasi ritase kontinyu, penyiagaan water truck penyiram debu jalan, dan tim derek evakuasi darurat.";
    kpiGovernance = "Ritase Harian Sesuai Jadwal Tongkang (≥95%), Physical Availability (≥90%), Zero Demurrage.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kesiapan Teknis (Pre-Transition: Minggu 1 – 4)
  - **Inspeksi Armada Dump Tronton:** Pengecekan mekanisme bak penutup otomatis (cover tarp) guna mencegah tumpahan debu batubara di jalan umum atau konsesi.
  - **Pemetaan Titik Kritis Hauling Road:** Pengecekan stabilitas gorong-gorong jembatan timbang pelabuhan jetty serta koordinasi dengan dinas perhubungan setempat.
  - **Pengujian Sistem Komunikasi Radio & Telemetri:** Pemasangan perangkat GPS tracking dual-band dan radio rig komunikasi konvoi armada.

### 2. Tahap Uji Rute & Uji Timbang (On-Transition: Minggu 5 – 8)
  - **Simulasi Konvoi Ritase Perdana:** Pengoperasian konvoi kecil (5–8 truk) untuk memastikan koordinasi jeda antar kendaraan minimal 50 meter.
  - **Sinkronisasi Waktu Sandar Tongkang (Barge Laytime):** Menguji kecepatan bongkar batubara ke hopper jetty konveyor (target bongkar < 3 menit per truk).
  - **Evaluasi Konsumsi BBM per Ton-Km:** Audit rasio pemakaian solar industri untuk menetapkan parameter penghematan biaya bahan bakar pengemudi.

### 3. Tahap Operasi Skala Penuh (Post-Transition: Minggu 9+)
  - **Penjadwalan Ritase Puncak Sesuai Kedatangan Tongkang:** Penyesuaian ritase armada secara agresif saat tongkang bersandar guna menghindari biaya denda demurrage kapal.
  - **Pemeliharaan Jalan Rutin (Road Maintenance):** Pengoperasian teratur unit grader dan compactor bersama water truck penyiram debu.
  - **SOP Penanganan Swabakar & Darurat:** Prosedur cepat isolasi material batubara yang mengalami indikasi kenaikan suhu di bak truk.

### 4. Matriks Tata Kelola & KPI Transisi
* **Ketepatan Jadwal Muat Tongkang:** 100% volume terpenuhi dalam batas laytime kapal.
* **Tingkat Kesiapan Unit Armada (PA):** Target konsisten ≥ 90%.
* **Kepatuhan Rute & Kecepatan:** 100% unit mematuhi batas kecepatan jalan hauling (maksimal 45 km/jam).

### 5. Rekomendasi Eksekutif Transisi
Model transisi untuk **"${title}"** dinyatakan **Sangat Layak & Terkendali (Feasible - GO)**.`;
  }

  // 4. FORESTRY / KEHUTANAN / PULP / KAYU LOG
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    preTransitionSummary = "Audit trailer bolster stanchion baja, pelatihan mengemudi jalan tanah licin hutan, dan integrasi barcode SKSHHK.";
    onTransitionSummary = "Uji hauling jalur petak tebang, penyesuaian beban saat hujan, dan pengujian durasi bongkar crane log yard mill.";
    postTransitionSummary = "Operasional penuh sesuai siklus panen blok tebang, servis rutin sasis tanah gambut, dan pos darurat winch tarik.";
    kpiGovernance = "Tingkat Pasokan Kayu Segar Mill (≥95%), Zero Roll-Over Incidents, MA (≥88%).";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kesiapan Teknis (Pre-Transition: Minggu 1 – 4)
  - **Audit Rancang Bangun Trailer Logging:** Pemeriksaan bolster stanchion baja, rantai lashing hidrolik, dan winch mandiri untuk evakuasi di jalan tanah hutan.
  - **Pelatihan Khusus Pengemudi Jalur Konsesi:** Uji kemahiran pengemudi dalam mengoperasikan *inter-axle differential lock* pada tanjakan berlumpur dan jalan gambut.
  - **Integrasi Barcode Dokumen Kayu Digital (SKSHHK):** Sinkronisasi sistem input data batang kayu dengan gate elektronik pabrik pulp mill.

### 2. Tahap Uji Lintasan Blok Tebang (On-Transition: Minggu 5 – 8)
  - **Uji Coba Pengangkutan Petak Tebang Perdana:** Simulasi pemuatan dari tepi tebangan (*roadside landing*) oleh excavator grapple untuk menguji distribusi beban trailer.
  - **Uji Waktu Tempuh & Durasi Bongkar Mill:** Mengukur durasi pengangkutan hingga pembongkaran crane di log yard mill pabrik (target bongkar < 25 menit).
  - **Penyesuaian Prosedur Musim Hujan:** Penetapan aturan batas muatan saat curah hujan tinggi guna melindungi permukaan jalan konsesi.

### 3. Tahap Operasional Penuh & Manajemen Jalur (Post-Transition: Minggu 9+)
  - **Siklus Ritase Terjadwal Sesuai Zonasi Tebang:** Relokasi armada secara fleksibel mengikuti pergeseran blok panen kayu HTI.
  - **Pemeliharaan Sasis & Suspensi Berkala:** Pembersihan menyeluruh endapan lumpur tanah gambut dari sistem rem dan suspensi pegas daun seminggu sekali.
  - **Tim Derek Siaga Lapangan:** Penempatan traktor penarik di titik-titik rawan tanjakan licin untuk meminimalkan keterlambatan konvoi.

### 4. Matriks Tata Kelola & KPI Transisi
* **Ketersediaan Pasokan Bahan Baku Pabrik:** Nilai pasokan harian tercapai ≥ 95% target mill.
* **Keselamatan Lintasan Hutan:** Nihil insiden trailer terguling (*Zero Roll-Over*).
* **Physical Availability Armada:** Stabil di rentang 88% – 92%.

### 5. Rekomendasi Eksekutif Transisi
Kajian model transisi **"${title}"** dinilai **Siap Diluncurkan (Feasible - GO)**.`;
  }

  // 5. LIMBAH B3 / MEDIS / WASTE
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    preTransitionSummary = "Audit izin angkutan B3 Hubdat & KLHK, sertifikasi BNSP pengemudi, dan pemasangan spill containment kit.";
    onTransitionSummary = "Uji rute penjemputan multi-drop pabrik, validasi sistem barcode FESTRONIK digital, dan simulasi penanganan tumpahan.";
    postTransitionSummary = "Penjemputan berkala terjadwal, audit kepatuhan manifest limbah 100%, dan sanitasi/dekontaminasi armada harian.";
    kpiGovernance = "Kepatuhan Regulasi KLHK (100%), Festronik Synchronized (100%), Zero Spill Incident.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kepatuhan Regulasi (Pre-Transition: Minggu 1 – 4)
  - **Verifikasi Legalitas & Perizinan Khusus:** Pemeriksaan kelengkapan Kartu Pengawasan Izin Angkutan B3 dari Ditjen Perhubungan Darat dan rekomendasi resmi dari KLHK.
  - **Sertifikasi Awak Armada:** Pelatihan dan uji kompetensi pengemudi bersertifikat BNSP untuk penanganan material berbahaya dan beracun.
  - **Audit Perlengkapan Keselamatan & Spill Kit:** Pengecekan kompartemen kedap cairan, alat pemadam api ringan (APAR), perlengkapan dekontaminasi, dan APD kimia lengkap di setiap kendaraan.

### 2. Tahap Uji Penjemputan & Integrasi FESTRONIK (On-Transition: Minggu 5 – 8)
  - **Simulasi Penjemputan Multi-Drop:** Uji coba jalur pengumpulan limbah dari fasilitas industri mitra menuju lokasi pengolahan akhir berizin.
  - **Validasi Sinkronisasi FESTRONIK:** Pengujian penerbitan surat jalan manifest digital secara langsung dari aplikasi FESTRONIK Kementerian LHK saat muatan dinaikkan.
  - **Simulasi Tanggap Darurat Tumpahan (Emergency Drill):** Melakukan latihan penanganan kebocoran zat cair simulasi untuk memastikan respon cepat kru < 5 menit.

### 3. Tahap Operasi Rutin & Dekontaminasi (Post-Transition: Minggu 9+)
  - **Jadwal Pengangkutan Berkala:** Penjadwalan penjemputan tetap mingguan/bulanan sebelum masa simpan TPS limbah mencapai ambang batas batas waktu (90 hari).
  - **Prosedur Cuci & Dekontaminasi:** Setiap armada yang selesai melakukan pembongkaran wajib melalui bilik dekontaminasi berizin sebelum kembali ke pool.
  - **Monitoring Jalur GPS Real-Time:** Pengawasan ketat rute perjalanan melalui geofencing agar armada tidak melintasi jalur kawasan pemukiman padat.

### 4. Matriks Tata Kelola & KPI Transisi
* **Kepatuhan Legalitas (Regulatory Compliance):** 100% dokumen izin aktif dan sah.
* **Sinkronisasi Manifest Digital:** 100% manifest FESTRONIK tercatat real-time tanpa selisih tonase.
* **Insiden Keselamatan:** Nihil tumpahan bahan berbahaya ke lingkungan (Zero Chemical Spillage).

### 5. Rekomendasi Eksekutif Transisi
Kesiapan transisi operasional untuk **"${title}"** dinyatakan **Sangat Siap & Terakreditasi (Approved - GO)**.`;
  }

  // 6. SAWIT / CPO / PERKEBUNAN
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    preTransitionSummary = "Kalibrasi tera tangki stainless steel SUS 304, pemasangan segel digital E-Seal, dan perizinan muatan CPO.";
    onTransitionSummary = "Uji pengisian di PKS, validasi waktu transit ke pelabuhan, dan pengujian kualitas kadar asam lemak bebas (FFA).";
    postTransitionSummary = "Operasional rotasi dua sopir, pencucian uap tangki terjadwal di pool, dan monitoring segel katup pelepasan 24 jam.";
    kpiGovernance = "Integritas Muatan / Zero Loss (≥99.8%), On-Time Delivery (≥95%), Kualitas Asam Lemak Aman.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kelaikan Tangki (Pre-Transition: Minggu 1 – 4)
  - **Kalibrasi Tera Metrologi Tangki:** Tera ulang bejana tangki stainless steel SUS 304 oleh badan metrologi resmi untuk memastikan akurasi volume liter muatan.
  - **Pemasangan E-Seal & Sensor GPS Katup:** Instalasi segel elektronik berteknologi pelacakan satelit pada manhole atas dan katup pembuangan (*discharge valve*).
  - **Standardisasi Sertifikasi Pembersihan Tangki:** Penyusunan SOP pencucian tangki bebas residu kimia sebelum diisi minyak kelapa sawit mentah.

### 2. Tahap Uji Muat & Waktu Transit (On-Transition: Minggu 5 – 8)
  - **Trial Muat di Pabrik Kelapa Sawit (PKS):** Menghitung durasi pengisian pipa (target < 40 menit) dan penimbangan jembatan timbang PKS.
  - **Uji Perjalanan & Pemeriksaan Suhu/FFA:** Pengukuran waktu tempuh dari kebun sawit ke tangki timbun pelabuhan atau pabrik refinery serta analisis laboratorium kualitas FFA.
  - **Uji Pembongkaran di Bulking Terminal:** Sinkronisasi koneksi selang coupling armada dengan pompa hisap terminal pelabuhan.

### 3. Tahap Operasional Penuh & Tata Kelola (Post-Transition: Minggu 9+)
  - **Rotasi Pengemudi 24 Jam:** Pemanfaatan dua sopir per truk guna memastikan ritase berjalan tanpa henti dan CPO tidak mengendap lama di tangki.
  - **Audit Harian Keutuhan Segel Digital:** Pengecekan otomatis log buka-tutup manhole di dashboard control room untuk meniadakan risiko kecurangan muatan di jalan.
  - **Stasiun Steam Mandiri:** Operasional fasilitas cuci uap tangki di depo pangkalan pangkalan transporter.

### 4. Matriks Tata Kelola & KPI Transisi
* **Integritas Volume Muatan (Yield Retention):** Akurasi volume timbangan tiba terhadap timbangan berangkat ≥ 99.8%.
* **Kepatuhan Waktu Transit:** Pengiriman tiba dalam batas toleransi SLA kontrak kerja.
* **Tingkat Ketersediaan Armada Tangki:** Stabil pada angka ≥ 92%.

### 5. Rekomendasi Eksekutif Transisi
Rencana implementasi transisi proyek **"${title}"** dinilai **Sangat Layak & Siap Beroperasi (Feasible - GO)**.`;
  }

  // 7. KONTAINER / PETIKEMAS / PORT
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    preTransitionSummary = "Audit tractor head & sasis twistlock, pendaftaran kartu akses pelabuhan (TID), dan integrasi Truck Booking System.";
    onTransitionSummary = "Simulasi shuttle kontainer rute pabrik-depo-dermaga, uji gate-in otomatis pelabuhan, dan uji unit genset reefer.";
    postTransitionSummary = "Stabilisasi ritase reguler terjadwal, optimalisasi rute round-trip balik isi, dan rotasi ban trailer berkala.";
    kpiGovernance = "On-Time Closing Time Kapal (100%), Zero Demurrage/Detention, Fleet Availability (≥94%).";

    narrativeMarkdown = `### 1. Tahap Persiapan & Registrasi Pelabuhan (Pre-Transition: Minggu 1 – 4)
  - **Sertifikasi Kelaikan Sasis & Twistlock:** Pemeriksaan fisik sasis trailer 20ft/40ft, fungsi keempat kunci twistlock, dan sertifikasi uji KIR Kemenhub.
  - **Registrasi Driver & Armada di Otoritas Pelabuhan:** Pengurusan Truck Identification Card (TID) dan registrasi digital di sistem terminal petikemas pelabuhan.
  - **Integrasi Truck Booking System (TBS):** Uji coba pemesanan slot kedatangan truk secara online untuk memangkas waktu tunggu di luar gerbang terminal.

### 2. Tahap Uji Rute & Integrasi Gate-In (On-Transition: Minggu 5 – 8)
  - **Simulasi Shuttle Koridor Utama:** Pengujian perjalanan truk dari kawasan industri mitra menuju depo kontainer dan dermaga internasional.
  - **Uji Efisiensi Gate-In Elektronik Pelabuhan:** Validasi pembacaan RFID / OCR pelat nomor dan nomor kontainer di gerbang masuk terminal tanpa jeda.
  - **Pengujian Operasional Kontainer Berpendingin (Reefer):** Uji kestabilan aliran daya listrik generator set mobile selama rute perjalanan darat.

### 3. Tahap Operasional Penuh & Utilisasi Balik (Post-Transition: Minggu 9+)
  - **Manajemen Ritase Terjadwal Ekspor-Impor:** Pengantaran kontainer impor isi ke pabrik dan penjemputan kontainer ekspor pada rute kembali (*two-way loaded haul*).
  - **SOP Mitigasi Risiko Closing Time:** Jalur prioritas khusus untuk mengantisipasi batas akhir penerimaan muatan kapal ekspor (*vessel closing time*).
  - **Preventive Maintenance Sasis:** Inspeksi ban trailer dan sistem pengereman udara terjadwal setiap minggu di depo transporter.

### 4. Matriks Tata Kelola & KPI Transisi
* **Kepatuhan Closing Time Kapal:** 100% kontainer ekspor tiba sebelum batas waktu closing.
* **Nihil Denda Keterlambatan (Zero Demurrage/Detention):** Pengembalian kontainer kosong ke depo tepat waktu.
* **Physical Availability Armada:** Minimal 94% unit prima beroperasi.

### 5. Rekomendasi Eksekutif Transisi
Pelaksanaan transisi proyek **"${title}"** berada pada status **Sangat Optimal & Terkendali (Approved - GO)**.`;
  }

  // 8. GENERAL / CUSTOMIZED BY TITLE
  else {
    preTransitionSummary = `Pemeriksaan kelaikan teknis unit armada komersial divisi ${divName}, survei rute, dan perizinan trayek angkutan.`;
    onTransitionSummary = `Uji coba operasional muatan bertahap, kalibrasi waktu tempuh riil, dan evaluasi kepatuhan SOP keselamatan berkendara.`;
    postTransitionSummary = `Operasional penuh berjadwal, integrasi telemetri GPS 24 jam, pemeliharaan preventif, dan evaluasi bulanan kepuasan klien.`;
    kpiGovernance = "On-Time Delivery (≥95%), Fleet Physical Availability (≥90%), Zero Lost Time Injury.";

    narrativeMarkdown = `### 1. Tahap Persiapan & Kesiapan Operasional (Pre-Transition: Minggu 1 – 4)
Fase persiapan proyek **"${title}"** difokuskan pada pemenuhan seluruh persyaratan teknis, legalitas, dan kelaikan operasional armada pada koridor yang dituju:
  - **Pemeriksaan Fisik & Standar Teknis Kendaraan:** Audit menyeluruh terhadap mesin, sistem pengereman, suspensi, ban, dan kelengkapan keselamatan darurat unit armada.
  - **Survei Koridor Lintasan & Identifikasi Hambatan:** Pemetaan jalur rute utama dan rute cadangan, pendataan titik jembatan timbang resmi, dan penentuan lokasi istirahat pengemudi yang aman.
  - **Penyusunan Standard Operating Procedure (SOP):** Penerapan SOP keselamatan berkendara, tata cara pemuatan barang (*loading*), dan pembongkaran muatan (*unloading*).
  - **Integrasi Platform Telematika GPS:** Pemasangan pelacak GPS cerdas yang terhubung ke sistem pemantauan pusat transporter.

### 2. Tahap Uji Rute & Validasi Kinerja (On-Transition: Minggu 5 – 8)
Fase pengujian lapangan secara terukur guna memvalidasi efisiensi rute sebelum pelaksanaan kontrak penuh:
  - **Simulasi Uji Coba Pengiriman (Trial Run):** Menjalankan pengiriman uji coba dengan volume bertahap untuk mengukur waktu tempuh aktual dan konsumsi bahan bakar.
  - **Evaluasi Waktu Tunggu di Lokasi Muat/Bongkar:** Berkoordinasi dengan staf logistik pengirim dan penerima guna meminimalkan durasi antrean kendaraan di gerbang fasilitas.
  - **Review Kinerja & Umpan Balik Klien:** Mengumpulkan catatan evaluasi dari perwakilan pemilik kargo untuk penyempurnaan alur kerja.

### 3. Tahap Operasional Penuh & Pengendalian Kualitas (Post-Transition: Minggu 9+)
Fase stabilisasi operasional jangka panjang berstandar mutu tinggi:
  - **Eksekusi Pengiriman Berjadwal Rutin:** Pelaksanaan ritase pengangkutan harian yang konsisten sesuai dengan kuota kontrak yang disepakati.
  - **Sistem Perawatan Kendaraan Terencana (Preventive Maintenance):** Jadwal servis berkala terjadwal untuk menjaga performa mesin dan meminimalkan risiko kerusakan di jalan (*breakdown*).
  - **Pelaporan Kinerja & SLA Bulanan:** Penyampaian laporan berkala kepada manajemen dan klien mencakup parameter ketepatan waktu dan keselamatan muatan.

### 4. Matriks Tata Kelola & KPI Transisi (Governance Metrics)
* **Ketepatan Waktu Pengiriman (On-Time Delivery - OTD):** Target konsisten ≥ 95%.
* **Kesiapan Fisik Armada (Physical Availability - PA):** Target ketersediaan unit armada ≥ 90%.
* **Tingkat Keselamatan Kerja:** Nihil kecelakaan kerja fatal (Zero Lost Time Injury).
* **Kepuasan Klien B2B:** Nilai indeks kepuasan layanan ≥ 90%.

### 5. Rekomendasi Eksekutif Transisi (Executive Readiness Verdict)
Rencana tahapan transisi proyek **"${title}"** dinyatakan **Sangat Layak & Siap Diluncurkan (Feasible - GO)**. Seluruh tahapan dirancang sistematis untuk memitigasi risiko operasional dan menjamin keandalan layanan jangka panjang.`;
  }

  return {
    title,
    preTransitionSummary,
    onTransitionSummary,
    postTransitionSummary,
    kpiGovernance,
    narrativeMarkdown
  };
}
