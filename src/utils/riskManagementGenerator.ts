/**
 * PRAMA AI Risk Management & Mitigation Generator (Pilar 9: Enterprise Risk Management & HSE Framework)
 * Generates tailored, 100% project-title-aligned risk registers, likelihood-impact assessments,
 * operational/financial/regulatory mitigation protocols, and executive risk verdicts.
 */

export interface RiskManagementResult {
  title: string;
  criticalRisksSummary: string;
  mitigationProtocolSummary: string;
  complianceSummary: string;
  kpiSummary: string;
  narrativeMarkdown: string;
}

export function generateRiskManagementForTitle(
  rawTitle: string,
  division?: string
): RiskManagementResult {
  const title = (rawTitle || "").trim() || "Kajian Manajemen Risiko & Mitigasi Operasional Logistik";
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

  let criticalRisksSummary = "";
  let mitigationProtocolSummary = "";
  let complianceSummary = "";
  let kpiSummary = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT / CLINKER
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    criticalRisksSummary = "Pneumatik bejana tekan tangki silo overpressure, penyumbatan pipa unloader, razia jembatan timbang Zero ODOL, dan tumpahan debu semen.";
    mitigationProtocolSummary = "Instalasi katup pelepas tekanan otomatis (safety PRV 2.5 bar), kalibrasi blower berkala, kepatuhan muatan MST 10 Ton, dan SOP K3 bejana tekan.";
    complianceSummary = "Kelaikan sertifikasi bejana tekan Disnaker, izin KIR Kemenhub, dan sertifikat K3LL pabrik semen rekanan.";
    kpiSummary = "Zero Fatal Accidents, Zero ODOL Sanctions (100%), Unloader Clogging Rate (< 0.5%).";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek **"${title}"** pada koridor **${routeName}** yang telah dipetakan secara terukur:
  - **Risiko R-01 (Tinggi / Dampak 4, Probabilitas 3): Bahaya Tekanan Lebih Tangki Silo (*Overpressure Bejana Tekan*):** Risiko malfungsi kompresor unloader blower yang melebihi batas toleransi dinding tangki (ambang batas > 2.2 bar) saat pembongkaran di silo batching plant.
  - **Risiko R-02 (Ekstrem / Dampak 5, Probabilitas 2): Penindakan Jembatan Timbang & Regulasi Zero ODOL:** Risiko tilang operasional, penurunan paksa muatan, atau penahanan unit akibat pelanggaran batas Muatan Sumbu Terberat (MST 10 Ton) di jalan nasional/provinsi.
  - **Risiko R-03 (Sedang / Dampak 3, Probabilitas 4): Penyumbatan Material Semen Lembap (*Pneumatic Pipe Clogging*):** Risiko pengendapan atau penggumpalan semen di dasar corong aerasi akibat infiltrasi uap air udara kompresor, mengakibatkan keterlambatan waktu bongkar (*demurrage*).
  - **Risiko R-04 (Tinggi / Dampak 4, Probabilitas 2): Pencemaran Debu Semen ke Lingkungan (*Dust Spillage*):** Risiko kebocoran paking manhole atas atau pecah selang kopling discharge saat proses transfer semen bertekanan.

### 2. Analisis Risiko Operasional & Keselamatan Kerja (Operational & HSE Risks)
Dampak langsung terhadap kelangsungan operasi lapangan:
  - **Risiko Bekerja di Ketinggian (Working at Heights):** Pengemudi atau kru berisiko terjatuh dari atas punggung tangki silo saat membuka palka manhole pengisian di packing plant semen.
  - **Kelelahan Pengemudi Rute Jarak Jauh (Driver Fatigue):** Tekanan target ritase harian berpotensi memicu kecelakaan lalu lintas tabrakan belakang di jalur pantura/tol.
  - **Kerusakan Kompresor di Lapangan:** Kerusakan mekanis mesin unloader blower independen saat berada di lokasi batching plant terpencil tanpa ketersediaan suku cadang cepat.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan (Financial & Regulatory Risks)
  - **Klausul Denda Demurrage Pabrik:** Penalti finansial dari pengelola batching plant apabila unit armada terlambat tiba dan mengakibatkan berhentinya pengecoran proyek infrastruktur prioritas.
  - **Volatilitas Harga Bahan Bakar Solar Industri:** Kenaikan harga solar nonsubsidi secara mendadak yang menggerus margin laba operasi jika tidak diproteksi oleh klausul kontrak.
  - **Kepatuhan Izin Bejana Tekan:** Risiko pembekuan operasi oleh pengawas ketenagakerjaan apabila masa uji hidrostatik tangki silo kedaluwarsa.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi (Mitigation & Contingency Protocols)
  - **Protokol M-01 (Tekanan Aman Terpadu):** Pemasangan ganda katup pengaman tekanan (*dual safety pressure relief valves*) yang terkalibrasi otomatis membuka pada tekanan 2.2 bar dan pengukur tekanan digital di kabin supir.
  - **Protokol M-02 (Kepatuhan Muatan Timbangan Digital):** Penimbangan jembatan ganda pra-keberangkatan (*pre-departure axle weighing*) dengan batas toleransi muat maksimal 28–30 ton per unit guna menjamin 100% Zero ODOL.
  - **Protokol M-03 (Water Trap & Air Dryer Compressor):** Pemasangan tabung penyaring uap air pada sistem kompresor unloader blower untuk mencegah semen menggumpal di pipa pengeluaran.
  - **Protokol M-04 (Safety Harness & Lifeline Rigging):** Kewajiban pemakaian Full Body Harness dengan tali penambat pada catwalk atas tangki saat melakukan inspeksi manhole.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi (Risk Governance & Performance Index)
* **Indeks Keselamatan Kerja (HSE Index):** Zero Lost Time Injury (LTI) dan Zero Fatality (100% aman).
* **Kepatuhan Zero ODOL:** Nihil sanksi tilang atau penahanan unit di seluruh jembatan timbang resmi (100%).
* **Tingkat Kesiapan Katup Pengaman:** 100% katup keselamatan tangki silo terkalibrasi dan berstempel resmi.
* **Kecepatan Tanggap Insiden:** Waktu respons tim darurat mobile bengkel tiba di lokasi breakdown < 90 menit.

### 6. Rekomendasi Eksekutif Kesiapan Risiko (Executive Risk Readiness Verdict)
Profil risiko proyek **"${title}"** dinilai **Terkendali dengan Baik & Memenuhi Standar Keselamatan Industri (RISK-CONTROLLED - APPROVED)**. Penerapan protokol keselamatan bejana tekan dan kepatuhan beban jalan Zero ODOL menjadi prasyarat mutlak sebelum peluncuran unit armada.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    criticalRisksSummary = "Jalan hauling amblas lumpur laterit, tergulingnya tipper dump truck saat dumping di hopper, blind spot tanjakan kritis tambang, dan sanksi SIMBARA.";
    mitigationProtocolSummary = "Aplikasi ban mining E-4, pembatasan kemiringan jalan hauling < 8%, instalasi inclinometer hidrolik, dan kepatuhan pelaporan digital SIMBARA.";
    complianceSummary = "Standar Good Mining Practice Kementerian ESDM, sertifikasi K3 Pertambangan (SMKP), dan sertifikat uji kelaikan alat berat.";
    kpiSummary = "Zero Fatal Accident, Mechanical Availability (≥90%), Dump Truck Rollover Rate (0%).";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek pertambangan dan hilirisasi nikel **"${title}"**:
  - **Risiko R-01 (Ekstrem / Dampak 5, Probabilitas 3): Terguling Saat Membongkar Muatan (*Tipper Rollover at Dumping Area*):** Risiko dump truck terguling di bibir hopper smelter atau tepi disposal akibat tanah amblas dan distribusi muatan laterit basah yang tidak merata.
  - **Risiko R-02 (Tinggi / Dampak 4, Probabilitas 4): Jalan Hauling Licin & Amblas Saat Hujan (*Slippery & Bogging Road*):** Karakteristik tanah laterit nikel yang berubah menjadi bubur licin saat diguyur hujan deras, berisiko menghentikan total konvoi hauling.
  - **Risiko R-03 (Tinggi / Dampak 4, Probabilitas 2): Tabrakan Beruntun di Titik Buta Tanjakan (*Blind-Spot Collision*):** Insiden tabrakan antar unit tambang pada tikungan tajam dan tanjakan curam jalan tambang akibat keterbatasan jarak pandang.
  - **Risiko R-04 (Kritis / Dampak 5, Probabilitas 2): Pemblokiran Sistem Digital SIMBARA:** Risiko penghentian operasional oleh Ditjen Minerba apabila surat jalan digital tidak sinkron dengan kuota RKAB smelter.

### 2. Analisis Risiko Operasional & Keselamatan Kerja (Operational & HSE Risks)
  - **Kelelahan Pengemudi Shift Malam (Driver Fatigue):** Operasional 20–24 jam berisiko tinggi memicu fenomena microsleep saat melintasi jalur tambang yang gelap.
  - **Keausan Ekstrem Rangka & Ban Tambang:** Beban dinamis bebatuan laterit keras yang merusak sasis dan memicu ledakan ban (*tire blowout*).
  - **Gesekan Sosial dengan Masyarakat Lingkar Tambang:** Potensi konflik sosial terkait debu jalan hauling dan kompensasi warga desa penyangga.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Denda Keterlambatan Pasokan Smelter:** Sanksi pemotongan tarif angkut apabila volume pasokan bijih harian gagal memenuhi kapasitas minimum tungku smelter.
  - **Audit Ketat Kaidah Pertambangan (SMKP Minerba):** Risiko penghentian sementara operasional kontraktor hauling jika tidak memenuhi Sistem Manajemen Keselamatan Pertambangan.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Inclinometer & Ground Compaction):** Pemasangan sensor kemiringan kabin (*inclinometer*) yang mengunci mekanisme dumping jika kemiringan tanah melebihi 5 derajat, disertai pemadatan rutin bibir hopper oleh compactor.
  - **Protokol M-02 (Grade Resistance & Water Truck Control):** Penegakan batas kelandaian jalan hauling maksimal 8% dan pembatasan kecepatan 35 km/jam, didukung penyemprotan teratur water truck dan grader.
  - **Protokol M-03 (Fatigue AI Camera & Rotary Buggy Whip):** Pemasangan kamera pemantau kantuk berbasis AI pada seluruh armada serta tiang bendera keselamatan tinggi (*buggy whip*) dengan lampu strobo.
  - **Protokol M-04 (Integrasi API SIMBARA Terpadu):** Sinkronisasi otomatis timbangan jembatan pelabuhan dengan sistem SIMBARA sebelum unit diberangkatkan.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Tingkat Fatalitas (Fatal Incident Rate):** Nol kecelakaan fatal (Zero Fatality).
* **Tingkat Insiden Terguling:** Nihil kasus unit dump truck terguling di disposal/hopper (Zero Rollover).
* **Ketersediaan Mekanik Suku Cadang:** Mechanical Availability tetap di atas 90%.

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Kajian manajemen risiko untuk **"${title}"** dinyatakan **Layak & Terkendali secara Prosedural (FEASIBLE - GO)**. Standar SMKP Pertambangan wajib diterapkan sebelum hauling perdana dimulai.`;
  }

  // 3. BATUBARA / COAL
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    criticalRisksSummary = "Swabakar batubara di bak tronton, tumpahan debu hitam di jalan hauling/pemukiman, denda demurrage tongkang, dan kegagalan rem sasis berat.";
    mitigationProtocolSummary = "Terpal otomatis kedap udara, penyiraman water truck berjadwal, monitoring suhu inframerah batubara, dan audit sistem rem retarder.";
    complianceSummary = "Izin Usaha Jasa Pertambangan (IUJP), izin lintasan jalan khusus tambang, dan regulasi pencegahan pencemaran udara PP 22/2021.";
    kpiSummary = "Zero Spontaneous Combustion Incidents, Zero Demurrage Penalties, 100% Brake Check Compliance.";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek **"${title}"**:
  - **Risiko R-01 (Tinggi / Dampak 4, Probabilitas 3): Kebakaran Swabakar Batubara (*Spontaneous Combustion*):** Risiko batubara berkalori rendah bereaksi dengan oksigen dan mengalami kenaikan suhu ekstrem hingga terbakar di dalam bak saat antrean macet.
  - **Risiko R-02 (Ekstrem / Dampak 5, Probabilitas 2): Denda Demurrage Tongkang Pelabuhan Jetty:** Keterlambatan suplai ritase dump truck saat tongkang bersandar yang memicu denda keterlambatan sandar puluhan juta rupiah per hari.
  - **Risiko R-03 (Tinggi / Dampak 4, Probabilitas 3): Tumpahan Debu Batubara & Aksi Protes Warga (*Dust Pollution & Community Blockade*):** Partikel debu batubara berterbangan ke kawasan pemukiman di sekitar koridor hauling yang berpotensi memicu pemblokiran jalan oleh warga.
  - **Risiko R-04 (Ekstrem / Dampak 5, Probabilitas 2): Rem Blong di Turunan Jalan Hauling (*Brake Failure*):** Kehilangan daya pengereman pada muatan penuh 30–40 ton akibat overheating rem teromol saat menuruni jalan curam.

### 2. Analisis Risiko Operasional & Keselamatan Kerja
  - **Visibilitas Nol Akibat Kabut Debu Kering:** Kurangnya jarak pandang saat konvoi armada di siang hari yang memicu risiko tabrak belakang.
  - **Pecah Ban Ganda Akibat Beban Panas:** Gesekan ekstrem ban pada permukaan jalan bebatuan tajam saat suhu udara tinggi.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Sanksi Pencemaran Lingkungan Hidup:** Denda administratif dari instansi lingkungan hidup atas tumpahan batubara di jalan umum atau perairan jetty.
  - **Penalti Biaya Kontrak Suplai PLTU:** Pemotongan nilai pembayaran kontrak apabila kalori batubara turun akibat terbakar di perjalanan.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Sensor Termal Inframerah & Pemadaman Siaga):** Pemindaian suhu muatan menggunakan thermal gun sebelum meninggalkan stockpile dan penyiapan instalasi nozzle semprot air busa.
  - **Protokol M-02 (Buffer Stock & Armada Cadangan Pelabuhan):** Penyiagaan 15% unit armada cadangan di area parkir jetty guna mengantisipasi keterlambatan rute utama saat tongkang bersandar.
  - **Protokol M-03 (Terpal Otomatis & Water Truck Terjadwal):** Penguncian bak menggunakan automatic cover tarp dan pengoperasian armada water truck setiap 45 menit sekali.
  - **Protokol M-04 (Pemeriksaan Harian Rem Retarder):** Wajib uji fungsional retarder hidrolik/exhaust brake sebelum setiap shift kerja dimulai.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Nihil Kebakaran Batubara di Bak (Zero Combustion):** 100% muatan tiba dalam suhu aman (< 50°C).
* **Nihil Denda Keterlambatan Tongkang:** 100% batubara termuat dalam batas waktu laytime kapal.
* **Tingkat Kepatuhan Penutupan Terpal:** 100% armada tertutup rapat tanpa kebocoran debu.

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Mitigasi risiko proyek **"${title}"** dinyatakan **Sangat Solid & Terkelola (APPROVED - GO)**.`;
  }

  // 4. FORESTRY / KEHUTANAN / KAYU / PULP & PAPER
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    criticalRisksSummary = "Trailer logging amblas di jalan gambut lunak, rantai lashing penahan kayu putus di jalan bergelombang, kayu busuk melewati SLA 48 jam, dan sanksi lacak balak SVLK.";
    mitigationProtocolSummary = "Bolster stanchion baja tersertifikasi, rantai lashing hidrolik ganda, traktor winch penarik di tanjakan licin, dan sistem barcode SKSHHK.";
    complianceSummary = "Sistem Verifikasi Legalitas Kayu (SVLK/FSC), regulasi jalan konsesi HTI, dan standar keselamatan angkutan logging.";
    kpiSummary = "Zero Log Spill Incidents, Fresh Wood Intake SLA (≥95%), Zero Illegal Logging Disputes.";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek pengangkutan kehutanan dan pulp & paper **"${title}"**:
  - **Risiko R-01 (Ekstrem / Dampak 5, Probabilitas 2): Muatan Kayu Log Terlepas di Perjalanan (*Log Spill Hazard*):** Risiko rantai pengikat putus pada jalur bergelombang yang mengakibatkan gelondongan kayu berhamburan ke jalan.
  - **Risiko R-02 (Tinggi / Dampak 4, Probabilitas 4): Armada Amblas di Jalur Gambut Lunak (*Peatland Bogging*):** Jalan konsesi tanah gambut yang runtuh saat musim hujan lebat, menjebak konvoi trailer logging berhari-hari.
  - **Risiko R-03 (Tinggi / Dampak 4, Probabilitas 3): Penurunan Rendemen Serat Kayu Busuk (*Wood Degradation Beyond SLA*):** Keterlambatan pengiriman melebihi ambang batas 48 jam dari tebangan yang memicu pembusukan kayu dan penolakan oleh log yard pabrik mill.
  - **Risiko R-04 (Kritis / Dampak 5, Probabilitas 1): Sengketa Legalitas Asal-Usul Kayu (*SVLK Dispute*):** Ketidaksesuaian barcode fisik kayu dengan manifes elektronik SKSHHK yang berpotensi memicu penyitaan oleh penegak hukum kehutanan.

### 2. Analisis Risiko Operasional & Keselamatan Kerja
  - **Terguling di Tanjakan Berlumpur Konsesi:** Ketidakseimbangan pusat gravitasi trailer berbeban 40 ton di jalan tanah licin.
  - **Bahaya Terjepit Saat Pembongkaran di Log Yard:** Risiko kru terkena runtuhan batang kayu saat rantai penahan dibuka.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Denda Penolakan Muatan Kayu Kering/Lapuk:** Kerugian finansial akibat diskon berat atau pemotongan harga per meter kubik oleh mill.
  - **Sanksi Pencabutan Akreditasi Vendor:** Hilangnya status rekanan terpercaya di grup konglomerasi kertas nasional.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Sertifikasi Rantai Lashing Baja G-80 & Bolster):** Uji kekuatan tarik berkala seluruh rantai pengikat baja dan sistem stanchion tegak trailer.
  - **Protokol M-02 (Pos Penarik Winch Reaksi Cepat):** Penempatan unit traktor evakuasi (*winch dozer*) di setiap tanjakan licin dan area rawan amblas jalur gambut.
  - **Protokol M-03 (Lacak Digital Transit Time Barcode):** Pemindaian barcode SKSHHK sejak pemuatan di petak tebang untuk memastikan waktu tempuh ke mill tetap di bawah 36 jam.
  - **Protokol M-04 (SOP Pelepasan Muatan Jarak Jauh):** Penerapan mekanisme quick release trip stake dari sisi samping aman kendaraan saat proses bongkar muat log crane.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Nihil Tumpahan Kayu Log di Jalan:** Zero Log Spillage Incident (100% aman).
* **Tingkat Pasokan Kayu Segar Sesuai SLA:** Realisasi kayu segar masuk mill ≥ 95%.
* **Kepatuhan Dokumen Lacak Balak:** 100% kayu terverifikasi legalitas SVLK.

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Penerapan sistem mitigasi risiko proyek **"${title}"** dinilai **Sangat Layak & Memenuhi Kriteria Keamanan HTI (APPROVED - GO)**.`;
  }

  // 5. LIMBAH B3 / MEDIS / WASTE MANAGEMENT
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    criticalRisksSummary = "Kebocoran cairan zat beracun/infeksius ke jalan raya, kecelakaan fatal pencemaran air, pembekuan izin FESTRONIK, dan tuntutan hukum pidana lingkungan hidup.";
    mitigationProtocolSummary = "Bak kedap cairan bersertifikasi, spill containment kit terstandar di kabin, pengemudi tersertifikasi BNSP B3, dan asuransi tanggung jawab lingkungan.";
    complianceSummary = "Izin Angkutan B3 Hubdat, Rekomendasi Pengangkutan Limbah B3 KLHK, dan manifes elektronik FESTRONIK real-time.";
    kpiSummary = "Zero Spill to Environment (100%), Festronik Discrepancy (0%), 100% Certified Hazmat Drivers.";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek pengangkutan limbah berbahaya dan beracun **"${title}"**:
  - **Risiko R-01 (Bencana / Dampak 5, Probabilitas 1): Tumpahan Bahan Beracun ke Lingkungan (*Catastrophic Chemical Spillage*):** Risiko kebocoran tangki atau drum limbah B3 akibat benturan di jalan raya yang mencemari saluran air pemukiman warga.
  - **Risiko R-02 (Kritis / Dampak 5, Probabilitas 1): Gugatan Hukum Pidana Lingkungan (UU No. 32/2009):** Risiko pidana penjara dan denda miliaran rupiah bagi pengurus perusahaan apabila terbukti melakukan kelalaian pembuangan limbah tanpa izin.
  - **Risiko R-03 (Tinggi / Dampak 4, Probabilitas 2): Kegagalan Sinkronisasi FESTRONIK Real-Time:** Kendala jaringan seluler di jalur antar-kota yang mengakibatkan keterlambatan penerbitan berita acara penyerahan limbah digital ke sistem KLHK.
  - **Risiko R-04 (Tinggi / Dampak 4, Probabilitas 2): Paparan Gas Beracun / Infeksius pada Awak Armada:** Risiko gangguan kesehatan fatal pengemudi akibat kebocoran uap kimia berbahaya atau tusukan limbah medis jarum suntik.

### 2. Analisis Risiko Operasional & Keselamatan Kerja
  - **Reaksi Kimia Eksotermik di Dalam Bak:** Pencampuran jenis limbah yang tidak kompatibel yang dapat memicu ledakan atau pelepasan gas beracun di perjalanan.
  - **Kontaminasi Silang Saat Pembersihan Tangki:** Risiko sisa residu kimia mencemari air buangan pool tanpa instalasi IPAL pengolahan air limbah terakreditasi.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Pencabutan Izin Operasi KLHK & Dishub:** Pembekuan izin angkutan B3 seketika jika ditemukan pelanggaran rute atau armada tanpa sertifikasi uji KIR B3.
  - **Klaim Kerugian Biaya Remediasi Lahan:** Beban biaya pemulihan lingkungan (*cleanup & remediation cost*) yang sangat besar jika terjadi pencemaran tanah.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Kompartemen Kedap Cairan & Spill Kit Standar OSHA):** Pengecekan bak boks kedap cairan dengan tanggul penampung tumpahan (*secondary containment*), disertai spill kit kimia lengkap di kabin truk.
  - **Protokol M-02 (Asuransi Liabilitas Lingkungan Hidup):** Polis asuransi perlindungan tanggung jawab pencemaran lingkungan (*Environmental Impairment Liability Insurance*) dengan nilai pertanggungan memadai.
  - **Protokol M-03 (Pengemudi Bersertifikasi Kompetensi BNSP B3):** 100% awak armada wajib lulus sertifikasi pengangkutan bahan berbahaya dan pelatihan tanggap darurat tumpahan (simulasi respons < 5 menit).
  - **Protokol M-04 (GPS Geofencing & Larangan Jalur Padat):** Sistem pelacakan satelit dengan alarm otomatis jika armada menyimpang dari rute angkutan B3 resmi yang telah disetujui instansi berwenang.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Nihil Tumpahan Bahan Kimia (Zero Spill Index):** 100% nihil pencemaran lingkungan hidup.
* **Kepatuhan Sinkronisasi Manifes FESTRONIK:** 100% dokumen terbit dan tervalidasi real-time.
* **Tingkat Kesiapan Alat Keselamatan (PPE & Spill Kit):** 100% armada memenuhi standar inspeksi pra-jalan.

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Status kesiapan mitigasi risiko proyek **"${title}"** berada pada level **Sangat Patuh Regulasi & Siap Beroperasi (COMPLIANT - APPROVED)**.`;
  }

  // 6. SAWIT / CPO / PERKEBUNAN
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    criticalRisksSummary = "Pencurian muatan CPO di jalan raya (kencing di jalan), kenaikan kadar asam lemak bebas (FFA), kerusakan segel katup pelepasan, dan penyusutan tonase volume.";
    mitigationProtocolSummary = "Instalasi E-Seal digital GPS satelit, tangki SUS 304 food-grade terisolasi, toleransi susut < 0.2%, dan patroli jalur lintas pengawalan.";
    complianceSummary = "Tera metrologi tangki berkala, sertifikasi ISPO/RSPO rantai pasok minyak sawit, dan standar higienitas tangki pengangkut makanan.";
    kpiSummary = "Cargo Retention Rate (≥99.8%), FFA Degradation (< 0.1%), Zero Digital Seal Tampering.";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek **"${title}"**:
  - **Risiko R-01 (Tinggi / Dampak 4, Probabilitas 4): Praktik Pencurian Muatan Minyak di Jalan (*CPO Thefts / Kencing di Jalan*):** Risiko pembobolan katup pembuangan atau manhole atas di pangkalan liar saat sopir beristirahat.
  - **Risiko R-02 (Tinggi / Dampak 4, Probabilitas 3): Kenaikan Kadar Asam Lemak Bebas (*FFA Degradation*):** Kemacetan parah atau keterlambatan waktu bongkar di bulking terminal pelabuhan yang memicu hidrolisis minyak dan kenaikan FFA di atas batas toleransi kontrak.
  - **Risiko R-03 (Sedang / Dampak 3, Probabilitas 3): Penyusutan Volume di Luar Toleransi (*Excessive Shrinkage*):** Selisih timbangan antara PKS dan pelabuhan melebihi 0.2% yang menimbulkan pemotongan invoice pembayaran transporter.
  - **Risiko R-04 (Tinggi / Dampak 4, Probabilitas 2): Kontaminasi Residu Bejana Tangki (*Tank Contamination*):** Pencucian tangki yang tidak sempurna meninggalkan sisa air atau karat, merusak kualitas minyak satu tangki penuh.

### 2. Analisis Risiko Operasional & Keselamatan Kerja
  - **Pecah Selang Bongkar di Bulking Terminal:** Tekanan pompa hisap pelabuhan yang merusak sambungan selang elastis tangki.
  - **Kecelakaan Truk Tangki Cairan di Tanjakan Licin:** Efek gelombang cairan di dalam tangki (*liquid surge*) yang mengganggu stabilitas pengendalian kemudi.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Klaim Finansial Penurunan Kualitas Mutu Minyak:** Denda atau penolakan kargo oleh pabrik refinery minyak goreng.
  - **Legalitas Tera Tangki Metrologi:** Sanksi administratif dan penolakan timbangan jika surat tera tangki telah kedaluwarsa.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Segel Elektronik GPS Satelit / E-Seal):** Pemasangan segel digital pintar pada katup pelepasan bawah (*discharge valve*) dan manhole atas yang memicu alarm otomatis ke ruang kendali pusat jika terbuka di luar geofence resmi.
  - **Protokol M-02 (Tangki Stainless Steel SUS 304 dengan Baffle Sekat):** Bejana tangki bersekat anti-surge guna menstabilkan cairan saat bermanuver di jalan raya serta pemanas uap (*steam coil*) untuk mencegah pembekuan minyak.
  - **Protokol M-03 (SOP Cuci Uap Berstandar & Uji Laboratorium Pra-Muat):** Penerbitan sertifikat pembersihan tangki (*Tank Cleaning Certificate*) bebas air sebelum pengisian pipa PKS dimulai.
  - **Protokol M-04 (Rute Terpilih & Pengawalan Berkala):** Penentuan koridor resmi dengan rest area rekanan bersertifikat keamanan ketat.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Integritas Volume Tiba (Cargo Retention):** Akurasi volume timbangan tiba ≥ 99.8%.
* **Kestabilan Kualitas FFA:** Kenaikan kadar asam lemak selama perjalanan terkendali < 0.1%.
* **Nihil Pembobolan Segel Digital:** Zero Unauthorized Valve Opening (100% utuh).

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Mitigasi risiko proyek **"${title}"** dinyatakan **Sangat Aman & Terlindungi (APPROVED - GO)**.`;
  }

  // 7. KONTAINER / PETIKEMAS / PELABUHAN
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    criticalRisksSummary = "Keterlambatan tiba melewati vessel closing time, kunci twistlock terlepas di jalan tol, denda demurrage/detention harian kontainer, dan kerusakan kompresor reefer.";
    mitigationProtocolSummary = "Dedicated tractor head, double-check penguncian 4 twistlock, integrasi slot Truck Booking System pelabuhan, dan genset reefer cadangan.";
    complianceSummary = "Truck Identification Card (TID) pelabuhan, sertifikasi kelaikan sasis trailer KIR Kemenhub, dan standar SOLAS VGM timbangan petikemas.";
    kpiSummary = "On-Time Closing Time (100%), Twistlock Failure Rate (0%), Zero Shipping Line Demurrage.";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek pengangkutan peti kemas **"${title}"**:
  - **Risiko R-01 (Kritis / Dampak 5, Probabilitas 3): Melewati Batas Waktu Penerimaan Kapal (*Missed Vessel Closing Time*):** Keterlambatan akibat kemacetan jalan tol atau antrean gerbang terminal yang mengakibatkan kontainer ekspor tertinggal kapal.
  - **Risiko R-02 (Ekstrem / Dampak 5, Probabilitas 1): Petikemas Terlempar Akibat Kegagalan Twistlock (*Container Rollover/Detachment*):** Risiko sasis twistlock tidak terkunci sempurna saat bermanuver di tikungan jalan tol, berisiko fatal menjatuhkan boks kontainer.
  - **Risiko R-03 (Tinggi / Dampak 4, Probabilitas 4): Denda Keterlambatan Pengembalian Kontainer (*Demurrage & Detention Penalties*):** Penalti denda harian puluhan dolar per boks dari pelayaran internasional akibat keterlambatan pengembalian kontainer kosong ke depo.
  - **Risiko R-04 (Tinggi / Dampak 4, Probabilitas 2): Kegagalan Daya Listrik Kontainer Reefer (*Reefer Genset Breakdown*):** Suplai listrik genset mobile terputus di jalan yang memicu kenaikan suhu kargo beku ekspor bernilai tinggi.

### 2. Analisis Risiko Operasional & Keselamatan Kerja
  - **Kemacetan Masif Akses Masuk Gerbang Dermaga:** Penumpukan truk di luar gerbang terminal petikemas saat ada lonjakan kapal ekspor serentak.
  - **Kerusakan Sasis Trailer Retak Struktural:** Kegagalan sasis trailer akibat beban berat kargo 40ft melampaui batas elastisitas baja.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan
  - **Klaim Kerugian Barang Ekspor (Cargo Loss Claim):** Tuntutan ganti rugi pemilik barang apabila kargo tertinggal kapal dan membatalkan Letter of Credit (L/C) perdagangan internasional.
  - **Sertifikasi Berat Petikemas SOLAS VGM:** Larangan muat ke kapal jika berat timbangan kargo tidak sesuai dengan data Verified Gross Mass resmi.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi
  - **Protokol M-01 (Buffer Time Keberangkatan & Jalur Khusus Closing):** Keberangkatan kontainer dijadwalkan tiba di gerbang terminal minimal 8 jam sebelum vessel closing time.
  - **Protokol M-02 (SOP Penguncian Fisik 4 Sudut Twistlock):** Pemeriksaan fisik dan penandaan visual (*twistlock locked tag*) oleh staf safety sebelum truk keluar dari gerbang pabrik.
  - **Protokol M-03 (Pemesanan Slot Kedatangan Digital Truck Booking System):** Reservasi slot gate-in pelabuhan secara online untuk mendapatkan prioritas masuk dermaga tanpa antrean.
  - **Protokol M-04 (Genset Mobile Dual-Engine Cadangan):** Pemeliharaan berkala genset reefer dan sensor alarm suhu digital otomatis ke kabin supir.

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi
* **Ketepatan Closing Time Kapal:** 100% kontainer ekspor tiba sebelum batas closing.
* **Nihil Insiden Lepas Twistlock:** Zero Twistlock Failure (100% aman).
* **Nihil Denda Keterlambatan Pelayaran:** Bebas biaya demurrage & detention (100%).

### 6. Rekomendasi Eksekutif Kesiapan Risiko
Mitigasi risiko proyek **"${title}"** dinyatakan **Sangat Siap & Terakreditasi (APPROVED - GO)**.`;
  }

  // 8. GENERAL / OTHER COMMERCIAL LOGISTICS
  else {
    criticalRisksSummary = `Insiden kecelakaan armada di koridor ${routeName}, keterlambatan waktu tempuh SLA, lonjakan biaya solar operasional, dan sanksi pelanggaran regulasi jalan.`;
    mitigationProtocolSummary = "Pelatihan Defensive Driving pengemudi, pemeliharaan preventif terjadwal, telematika GPS real-time, dan klausul proteksi kontrak.";
    complianceSummary = "Uji KIR kendaraan Kemenhub, standar keselamatan kerja K3LL, dan perizinan trayek angkutan darat.";
    kpiSummary = "Zero Lost Time Injury (LTI), On-Time Delivery SLA (≥96%), Fleet Roadworthiness (100%).";

    narrativeMarkdown = `### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
Identifikasi risiko proyek **"${title}"** difokuskan pada pemetaan ancaman operasional, finansial, dan kepatuhan hukum di koridor yang dituju:
  - **Risiko R-01 (Tinggi / Dampak 4, Probabilitas 3): Kecelakaan Lalu Lintas di Jalur Distribusi (*Traffic Collision*):** Potensi kecelakaan armada akibat kelalaian pengemudi, blind-spot, atau kondisi mekanis kendaraan yang tidak prima.
  - **Risiko R-02 (Tinggi / Dampak 4, Probabilitas 3): Keterlambatan Waktu Pengiriman Melampaui SLA (*Delivery Delay*):** Risiko kemacetan jalur utama, cuaca ekstrem, atau kerusakan teknis di jalan yang berakibat pada penalti komersial dari klien.
  - **Risiko R-03 (Sedang / Dampak 3, Probabilitas 4): Lonjakan Biaya Bahan Bakar & Suku Cadang (*Fuel & Spare Parts Volatility*):** Fluktuasi harga solar industri dan kenaikan harga suku cadang yang menekan margin keuntungan operasi transporter.
  - **Risiko R-04 (Tinggi / Dampak 4, Probabilitas 2): Sanksi Pelanggaran Regulasi Jalan & Muatan (*Regulatory Non-Compliance*):** Pelanggaran izin trayek, keterlambatan uji KIR, atau batas beban sumbu jalan yang berisiko pada penahanan armada.

### 2. Analisis Risiko Operasional & Keselamatan Kerja (Operational & HSE Risks)
  - **Kelelahan Pengemudi (Fatigue Management):** Jam mengemudi tanpa jeda istirahat memadai yang menurunkan refleks dan kewaspadaan pengemudi.
  - **Kerusakan Mekanis Mendadak (On-Road Breakdown):** Kegagalan sistem pengereman, transmisi, atau ban pecah di jalur antarkota yang memicu kemacetan dan risiko kecelakaan.
  - **Keamanan Muatan Kargo:** Risiko pencurian, perusakan segel, atau kehilangan barang selama transit perjalanan.

### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan (Financial & Regulatory Risks)
  - **Penalti Kinerja Kontrak (SLA Breach Penalty):** Pemotongan nilai penagihan jasa angkutan apabila tingkat ketepatan waktu pengiriman berada di bawah kesepakatan kontrak.
  - **Risiko Keterlambatan Pembayaran Piutang (Bad Debts / Cash Flow Risk):** Perputaran arus kas yang terganggu akibat keterlambatan pembayaran invoice oleh klien korporat.

### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi (Mitigation & Contingency Protocols)
  - **Protokol M-01 (Standar Keselamatan Defensive Driving):** Seluruh pengemudi wajib menjalani pelatihan berkendara aman berkala dan pemeriksaan kesehatan (*fit to work test*) sebelum bertugas.
  - **Protokol M-02 (Sistem Pemeliharaan Preventif Terencana):** Servis berkala per 10.000 km dan inspeksi checklist keselamatan harian sebelum kendaraan keluar dari depo (*pre-trip inspection*).
  - **Protokol M-03 (Telematika GPS & Monitoring Kecepatan):** Pemasangan pelacak GPS cerdas dengan notifikasi alarm otomatis jika kecepatan melebihi batas aman yang ditentukan.
  - **Protokol M-04 (Klausul Kontrak Fuel Escalation & Asuransi Kargo):** Perlindungan finansial melalui penyesuaian tarif otomatis saat kenaikan solar dan asuransi muatan komprehensif (*all-risk cargo insurance*).

### 5. Matriks Tata Kelola Risiko & KPI Mitigasi (Risk Governance & Performance Index)
* **Tingkat Keselamatan Kerja (Safety Index):** Nihil kecelakaan fatal (Zero Fatality & Zero LTI).
* **Ketepatan Waktu Pengiriman (On-Time Delivery):** Realisasi kedatangan tepat waktu mencapai ≥ 96%.
* **Kelaikan Fisik Armada (Roadworthiness Rate):** 100% armada memiliki dokumen uji KIR dan surat izin aktif.
* **Kecepatan Penanganan Insiden di Jalan:** Tim bantuan darurat mekanik tiba di lokasi insiden < 90 menit.

### 6. Rekomendasi Eksekutif Kesiapan Risiko (Executive Risk Readiness Verdict)
Rencana mitigasi dan manajemen risiko untuk proyek **"${title}"** dinilai **Sangat Layak & Memenuhi Kaidah Manajemen Risiko Korporat (FEASIBLE - APPROVED)**. Seluruh langkah pencegahan telah dirancang komprehensif untuk meminimalkan potensi kerugian finansial maupun operasional.`;
  }

  return {
    title,
    criticalRisksSummary,
    mitigationProtocolSummary,
    complianceSummary,
    kpiSummary,
    narrativeMarkdown
  };
}
