/**
 * PRAMA AI Strategic Overview Generator (Pilar 1: Global & National NAT Overview)
 * Generates tailored, 100% project-title-aligned strategic narratives without
 * generic filler, perfectly matching the specific commodity, corridor, fleet, and regulations.
 */

import { detectProjectArchetype } from "./archetypeDetector";

export interface StrategicOverviewResult {
  title: string;
  commodity: string;
  fleetType: string;
  originDest: string;
  regulations: string[];
  narrativeMarkdown: string;
}

export function generateStrategicOverviewForTitle(
  rawTitle: string,
  division?: string
): StrategicOverviewResult {
  const title = (rawTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Darat").trim();

  // 1. Detect Commodity & Specific Equipment
  let commodity = "Kargo Umum & Industri B2B";
  let fleetType = "Truk Wingbox / Flatbed Heavy Duty";
  let corridor = "Koridor Logistik Antar-Kota / Arteri Nasional";
  let regulations = [
    "UU No. 22 Tahun 2009 tentang Lalu Lintas dan Angkutan Jalan (LLAJ)",
    "Kebijakan Zero ODOL (Over Dimension Over Load) Ditjen Perhubungan Darat",
    "Sistem Manajemen Keselamatan (SMK) Angkutan Umum Kemenhub"
  ];
  let macroGlobal = "";
  let nationalRegs = "";
  let fieldOps = "";
  let verdict = "";

  // Helper: detect origin and destination from title
  let origin = "";
  let dest = "";
  const routeMatch = /(?:dari|koridor|jalur|rute|pengangkutan|distribusi|hauling)?\s*([A-Za-z\s]+?)\s*(?:ke|sampai|menuju|-|s\.d|to)\s*([A-Za-z\s]+)/i.exec(title);
  if (routeMatch && routeMatch[1] && routeMatch[2]) {
    const rawOrig = routeMatch[1].replace(/pengangkutan|distribusi|hauling|kajian|strategis|proyek/gi, "").trim();
    const rawDest = routeMatch[2].trim();
    if (rawOrig.length > 2 && rawDest.length > 2) {
      origin = rawOrig;
      dest = rawDest;
      corridor = `Rute ${origin} menuju ${dest}`;
    }
  }

  // --- CATEGORY 1: Semen / Cement Curah / Bag ---
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    commodity = titleLower.includes("curah") ? "Semen Curah (Bulk Cement)" : "Semen Sak / Kantong & Klinker";
    fleetType = titleLower.includes("curah")
      ? "Truk Tangki Silo Pneumatik (Hi-Blow) 24–32 Ton dilengkapi Kompresor Blower Unloader"
      : "Truk Tronton Flatbed / Wingbox 10 Roda";
    const routeName = origin && dest ? `${origin} ke ${dest}` : "Gresik menuju koridor Jawa Tengah & sekitarnya";
    regulations = [
      "Permenhub No. PM 60/2019 tentang Penyelenggaraan Angkutan Barang di Jalan",
      "Surat Edaran Dirjen Hubdat tentang Penertiban Muatan Sumbu Terberat (MST 10 Ton Jalan Kelas I)",
      "Standar Uji Kelaikan Tangki Tekan (Bejana Bertekanan) Permenaker No. 37/2016",
      "SOP K3 Pengisian Silo & Bongkar Muat Semen Curah di Batching Plant"
    ];

    macroGlobal = `Tren logistik material semen global menuntut presisi rantai pasok konstruksi berbasis sistem **Just-In-Time (JIT)**. Fluktuasi biaya energi global dan efisiensi konsumsi bahan bakar menuntut pengangkutan material semen mengoptimalkan rasio payload muatan per ritase dengan nol kontaminasi air atau kelembaban udara yang dapat merusak kualitas hidrasi semen.`;

    nationalRegs = `Secara nasional di Indonesia, pengangkutan **${commodity}** pada koridor **${routeName}** diawasi ketat oleh implementasi jembatan timbang online (WIM) serta regulasi **Bebas ODOL Kemenhub**. Armada tangki silo wajib mematuhi batas Muatan Sumbu Terberat (MST) 10 ton pada jalan kelas I (Jalur Pantura maupun akses Tol Trans Jawa). Selain itu, legalitas pengoperasian tangki bertekanan pneumatik wajib memiliki sertifikasi pengujian keselamatan bejana tekan berkala dari Disnaker guna mencegah risiko ledakan pipa kompresor discharge saat pembongkaran muatan.`;

    fieldOps = `Kondisi jalan koridor **${routeName}** menghadapi risiko kemacetan di simpul arteri Pantura dan tanjakan pada interchange jalan tol. Tantangan teknis mencakup:
* **Keandalan Kompresor Blower:** Kompresor udara unloader harus bertekanan stabil (1.5–2.0 bar) untuk memastikan proses discharge muatan ke silo penampung batching plant tuntas dalam waktu < 45 menit tanpa sisa endapan.
* **Manajemen Keausan Ban & Rem:** Beban gravitasi tinggi muatan serbuk semen membutuhkan sistem pengereman ABS ganda dan inspeksi tekanan angin ban harian.
* **Pelacakan Telemetri Terpadu:** Penggunaan sensor GPS dan sensor tekanan tangki real-time untuk mencegah aksi modifikasi katup atau tumpahan semen di jalan raya.`;

    verdict = `Berdasarkan analisis teknis dan komersial, proyek **"${title}"** dinilai **Sangat Layak Dijalankan (Feasible - GO)**. Keberhasilan proyek ditentukan oleh kepatuhan tonase resmi agar bebas tilang ODOL, jaminan SLA waktu tempuh pengiriman terikat kontrak B2B ready-mix, serta integrasi pemeliharaan kompresor unloader secara terjadwal.`;
  }

  // --- CATEGORY 2: Nikel / Tambang / Smelter / Ore ---
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    commodity = "Bijih Nikel Laterit (Saprolite / Limonite Ore)";
    fleetType = "Dump Truck Heavy-Duty 6x4 / 8x4 (Kapasitas 25–35 Ton) Bak Pelat Hardox AR400";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Area Tambang IUP menuju Smelter / Jetty";
    regulations = [
      "Permen ESDM No. 26/2018 tentang Pelaksanaan Kaidah Pertambangan yang Baik (Good Mining Practice)",
      "Sistem Integrasi SIMBARA (Sistem Informasi Mineral dan Batubara) Kemenkeu & ESDM",
      "Kewajiban Verifikasi E-RKAB dan Surat Keterangan Asal Barang (SKAB)",
      "Standar Keselamatan Operasional Pertambangan SMKP Minerba"
    ];

    macroGlobal = `Sebagai tulang punggung rantai pasok baterai kendaraan listrik (EV) dan stainless steel dunia, hilirisasi nikel Indonesia menjadi episentrum perhatian global. Standar audit ESG internasional menuntut rantai lacak pasok (*responsible sourcing*) yang membuktikan tidak ada kebocoran material atau pelanggaran batas izin tambang legal sepanjang jalur transportasi hauling.`;

    nationalRegs = `Di ranah kebijakan Indonesia, operasional hauling nikel untuk proyek **"${title}"** terikat langsung dengan verifikasi **SIMBARA** dan kepatuhan RKAB ESDM. Setiap truk yang bergerak wajib dilengkapi dokumen barcode digital muatan. Penggunaan jalan tambang khusus (*dedicated hauling road*) atau izin perlintasan jalan daerah wajib mengantongi izin resmi pemerintah setempat dengan jaminan pemeliharaan aspal/jembatan dari pihak pengelola tambang.`;

    fieldOps = `Medan tambang nikel memiliki karakteristik tanah laterit merah yang sangat licin dan lembek saat diguyur hujan:
* **Kontrol Kadar Air (Moisture Content):** Muatan nikel dengan MC tinggi berisiko meluber atau menggeser titik gravitasi dump truck saat bermanuver di turunan curam.
* **Durabilitas Sasis & Suspensi:** Penggunaan bak baja berstandar Hardox anti-abrasi dan suspensi heavy-duty mutlak diperlukan untuk menahan hantaman bebatuan saat proses loading excavator.
* **Driver Fatigue Monitoring:** Pemasangan kamera cerdas AI DMS (Driver Monitoring System) untuk mendeteksi kantuk dan kelelahan pengemudi pada ritase malam hari.`;

    verdict = `Proyek **"${title}"** memiliki profil kelayakan **Feasible - GO dengan Prioritas Tinggi**. Rekomendasi utama mencakup penempatan tim mekanik stanby di pit-stop rute hauling, penguncian kontrak jangka panjang berindeksasi harga BBM industri, serta pematuhan 100% pelaporan SIMBARA.`;
  }

  // --- CATEGORY 3: Batubara / Coal ---
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    commodity = "Batubara Termal Curah (Thermal Coal GAR 3800–5000)";
    fleetType = "Dump Truck Tronton 6x4 High-Cube / Double Trailer Side-Dump";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Stockpile Tambang ke Pelabuhan Jetty / PLTU";
    regulations = [
      "Permen ESDM No. 26/2018 tentang Kaidah Pertambangan yang Baik",
      "Peraturan Daerah tentang Larangan Pengangkutan Batubara Melintasi Jalan Umum",
      "Integrasi SIMBARA & e-PNBP Kemenkeu/ESDM",
      "Standar Baku Mutu Pengendalian Pencemaran Udara dan Debu KLHK"
    ];

    macroGlobal = `Meskipun transisi energi global berlangsung, ketahanan energi industri smelter dan pembangkit listrik domestik masih bergantung pada kontinuitas pengiriman batubara. Efisiensi biaya per ton-kilometer (*cost per ton-km*) menjadi tolok ukur daya saing mutlak bagi penyedia jasa transportasi hauling batubara.`;

    nationalRegs = `Secara nasional, regulasi hauling batubara mewajibkan penggunaan jalan khusus pertambangan dan melarang keras penggunaan jalan umum tanpa dispensasi resmi dari Gubernur dan Kementerian PUPR. Kepatuhan pembayaran royalti tambang melalui sistem elektronik **SIMBARA** mensyaratkan setiap surat jalan truk terdata secara real-time sebelum batubara di-dumping ke barge jetty.`;

    fieldOps = `Operasional lapangan batubara menghadapi debu pekat, risiko kebakaran mandiri (*spontaneous combustion*), dan degradasi permukaan jalan:
* **Pengendalian Debu & Terpal Otomatis:** Setiap armada wajib dilengkapi jaring terpal terpasang rapat dan jalur hauling wajib dilalui water truck penyiram debu secara berkala.
* **Ritase & Queue Management:** Optimalisasi antrean di jembatan timbang weighbridge guna menjaga target waktu siklus (cycle time) < target kontrak.
* **Perawatan Ban Off-Road:** Inspeksi berkala batu terjepit di sela ban ganda (*rock ejector*) untuk mencegah ledakan ban (*tyre burst*).`;

    verdict = `Kajian strategis menyatakan proyek **"${title}"** berstatus **Feasible - GO**. Kunci profitabilitas terletak pada pencapaian ketersediaan armada (*Physical Availability*) > 90% dan mitigasi denda demurrage tongkang di pelabuhan muat.`;
  }

  // --- CATEGORY 4: Kehutanan / Forestry / Kayu Log / Pulp ---
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    commodity = "Kayu Log Hutan Tanaman Industri (Akasia / Eucalyptus)";
    fleetType = "Truk Logging Trailer 6x4 dengan Stanchion Bolster & Winch Evakuasi";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Petak Tebang HTI ke Log Yard Mill Pabrik Pulp";
    regulations = [
      "Permen LHK tentang Sistem Verifikasi Kelestarian Kayu (SVLK)",
      "Kewajiban Penerbitan Dokumen Digital SKSHHK (Surat Keterangan Sah Hasil Hutan Kayu)",
      "Standar Audit Rantai Lacak Kayu Internasional FSC / PEFC",
      "Pedoman Pengikatan Muatan Kayu (Lashing Safety) Ditjen Hubdat"
    ];

    macroGlobal = `Regulasi perdagangan internasional seperti **EU Deforestation Regulation (EUDR)** dan standar **FSC** mewajibkan transparansi geolokasi tebang kayu hingga pabrik kertas. Setiap batang log kayu yang diangkut wajib terbukti bukan dari hasil deforestasi liar atau kawasan lindung.`;

    nationalRegs = `Di Indonesia, operasional angkutan kayu forestry dikawal ketat oleh sistem digital **SKSHHK online** dari Kementerian Lingkungan Hidup dan Kehutanan. Setiap ritase truk wajib memiliki barcode SKSHHK sah yang dapat diverifikasi oleh petugas kehutanan. Muatan dilarang melebihi batas rancang bangun kendaraan dan wajib memiliki stanchion pengaman bersertifikasi.`;

    fieldOps = `Medan konsesi hutan tanaman industri (HTI) identik dengan kontur perbukitan berliku dan tanah gambut:
* **Kestabilan Pengikatan Muatan:** Penggunaan sistem rantai baja dan webbing strap dengan tensioner hidrolik guna mencegah log kayu bergeser saat melewati turunan miring.
* **Traksi Roda di Musim Hujan:** Kendaraan wajib dilengkapi penggerak 6x4 dengan differential lock aktif dan winch mandiri untuk evakuasi di jalan berlumpur.
* **Drone Patrol & GPS Geofencing:** Pemantauan koridor jalan utama konsesi secara berkala untuk mendeteksi longsor atau jembatan kayu yang mengalami pelapukan.`;

    verdict = `Kajian menyimpulkan proyek **"${title}"** berstatus **Feasible - GO**. Rekomendasi mencakup standardisasi pelatihan defensive driving bagi driver logging dan sinkronisasi data barcode SKSHHK dengan sistem ERP fleet management.`;
  }

  // --- CATEGORY 5: Limbah B3 / Medis / Waste Management ---
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    commodity = "Limbah Bahan Berbahaya dan Beracun (Limbah B3 Industri / Medis)";
    fleetType = "Box Truck Kedap Tumpahan / Tangki B3 Khusus dengan Simbol & Label KLHK";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Pabrik Penghasil Limbah ke Fasilitas Pengolah Berizin (PPLI/Insenerator)";
    regulations = [
      "Permen LHK No. 6 Tahun 2021 tentang Pengelolaan Limbah B3",
      "Kewajiban Sistem Manifest Elektronik FESTRONIK KLHK",
      "Izin Penyelenggaraan Angkutan Barang Khusus Berbahaya Ditjen Perhubungan Darat",
      "Sertifikasi Pengemudi Angkutan B3 dari BNSP / Kemenhub"
    ];

    macroGlobal = `Konvensi Basel dan standar ESG perusahaan multinasional menuntut rantai pasok limbah dengan prinsip *cradle-to-grave* atau *cradle-to-cradle*. Setiap kebocoran zat beracun memiliki konsekuensi hukum pidana lingkungan internasional dan sanksi reputasi berat.`;

    nationalRegs = `Secara nasional di Indonesia, pengangkutan limbah B3 wajib mengantongi izin rekomendasi pengangkutan dari KLHK dan kartu pengawasan dari Ditjen Hubdat Kemenhub. Surat jalan fisik tidak berlaku lagi, melainkan wajib menggunakan sistem elektronik **FESTRONIK KLHK** yang mengunci status penerimaan barang secara real-time.`;

    fieldOps = `Tantangan keselamatan operasional tingkat tinggi:
* **Perlengkapan Tanggap Darurat (Spill Kit B3):** Setiap armada wajib dilengkapi APAR, serbuk penyerap tumpahan kimia, pakaian APD khusus, dan eyewash portable.
* **Kepatuhan Rute Resmi:** Armada dilarang melintasi rute padat permukiman atau kawasan sumber air minum; pergerakan dipantau melalui GPS yang terintegrasi ke server pengawas.
* **Kompartemen Kedap Anti-Bocor:** Bak kendaraan dilapisi material tahan korosi asam/basa dengan pengunci ganda.`;

    verdict = `Proyek **"${title}"** memiliki kelayakan komersial **Feasible - GO dengan Margin Premium**. Disarankan untuk mempercepat audit izin armada di portal FESTRONIK dan menetapkan SLA tanggap darurat insiden kurang dari 45 menit.`;
  }

  // --- CATEGORY 6: Sawit / CPO / Perkebunan / Minyak Nabati ---
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    commodity = "Crude Palm Oil (CPO) / Minyak Kelapa Sawit Industri";
    fleetType = "Truk Tangki Stainless Steel SUS 304 Kapasitas 20–30 Ton dengan E-Seal Valve";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Pabrik Kelapa Sawit (PKS) ke Tangki Timbun Pelabuhan Ekspor";
    regulations = [
      "Sertifikasi ISPO (Indonesian Sustainable Palm Oil) & Kepatuhan RSPO",
      "Standar Tera Metrologi Legal Kalibrasi Kapasitas Tangki (Kemenperdag)",
      "Regulasi Higienitas & Kontaminasi Angkutan Minyak Nabati BPOM/Kemenperin",
      "Ketentuan Batas Beban MST Jalan Perkebunan dan Jalan Nasional"
    ];

    macroGlobal = `Komoditas minyak nabati sawit menjadi bahan baku vital pangan dan biofuel dunia. Standar pasar global menuntut jaminan kualitas bebas kontaminasi air serta pelacakan titik koordinat kebun sawit bebas deforestasi sesuai ketentuan uji tuntas komoditas internasional.`;

    nationalRegs = `Di Indonesia, pengangkutan CPO wajib mematuhi standar kalibrasi tera tangki metrologi resmi untuk mencegah selisih timbangan di pelabuhan bongkar. Kendaraan tangki wajib memenuhi standar kelaikan jalan Kemenhub serta mematuhi aturan muatan sumbu terberat guna melindungi aspal jalan koridor perkebunan.`;

    fieldOps = `Tantangan operasional di rute perkebunan sawit:
* **Pencegahan Penyusutan & Pencurian (Anti-Kencing CPO):** Pemasangan segel digital (E-Seal) berbasis GPS pada tutup manhole atas dan kran pembuangan bawah (discharge valve).
* **Manajemen Suhu & Free Fatty Acid (FFA):** Waktu tempuh dari PKS ke pelabuhan harus terkendali di bawah 18 jam agar kadar asam lemak bebas (ALB/FFA) tidak melonjak melebihi toleransi kontrak pabrik (< 5%).
* **Kebersihan Tangki (Cleaning Certificate):** Pembersihan uap steam berkala antar ritase untuk mencegah kontaminasi endapan sludge.`;

    verdict = `Berdasarkan parameter operasional dan komersial, proyek **"${title}"** dinilai **Feasible - GO**. Strategi kunci berpusat pada akurasi timbangan digital, penjaminan toleransi susut muatan < 0.15%, dan formula tarif terindeks solar industri.`;
  }

  // --- CATEGORY 7: Petikemas / Kontainer / Pelabuhan / Dry Port ---
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    commodity = "Muatan Petikemas Ekspor-Impor & Domestik (20ft / 40ft Dry & Reefer)";
    fleetType = "Tractor Head 4x2 / 6x2 dengan Trailer Chassis Skeleton Ber-Twistlock Resmi";
    const routeName = origin && dest ? `${origin} menuju ${dest}` : "Pelabuhan Kontainer ke Kawasan Industri Dry Port / Gudang Depo";
    regulations = [
      "Standar Berat Muatan Terverifikasi VGM (Verified Gross Mass) IMO SOLAS",
      "Aturan Kelaikan Twistlock dan Pengunci Trailer Kemenhub",
      "Integrasi Gate Pass Elektronik Terminal Operator Pelabuhan (TOS)",
      "Pengaturan Jam Operasional Angkutan Berat Masuk Kawasan Perkotaan"
    ];

    macroGlobal = `Konektivitas pelabuhan laut global bertumpu pada kecepatan perputaran kontainer (*container turnaround time*). Standar IMO SOLAS mewajibkan kepastian data berat kotor muatan (VGM) untuk menjamin keselamatan stabilitas kapal kontainer maupun truk trailer di darat.`;

    nationalRegs = `Di pelabuhan Indonesia (Tanjung Priok, Tanjung Perak, Belawan, Makassar), operasional angkutan kontainer wajib terintegrasi dengan gate otomatis Pelindo dan dokumen delivery order (e-DO). Trailer pengangkut wajib memiliki twistlock fungsional yang mengunci keempat sudut kontainer sesuai aturan Ditjen Hubdat.`;

    fieldOps = `Operasional koridor pelabuhan menghadapi kemacetan kronis dan dwelling time:
* **Efisiensi Antrean Gate Pelabuhan:** Pemanfaatan sistem janji temu truk (*Truck Booking System / TBS*) untuk memangkas waktu tunggu gate-in/gate-out pelabuhan.
* **Kesiapan Genset Mobile Kontainer Reefer:** Untuk kontainer pendingin (makanan beku/farmasi), armada wajib menyediakan generator set plug-in mandiri agar suhu kargo tetap terjaga selama transit.
* **Manajemen Waktu Bebas Sewa (Demurrage & Detention):** Ketepatan waktu pengembalian kontainer kosong (*empty return*) ke depo depo mitra pelayaran.`;

    verdict = `Proyek **"${title}"** dinilai **Feasible - GO**. Keunggulan kompetitif dibangun melalui integrasi API status kontainer secara real-time kepada pemilik kargo dan pemeliharaan prima traktor head.`;
  }

  // --- CATEGORY 8: Archetype-Aligned (Manufacturing, Personal Business/SME, or Commercial Logistics) ---
  else {
    const archetype = detectProjectArchetype(title);

    if (archetype === 'manufacturing') {
      commodity = `Produk Manufaktur & Olahan Industri Sektor ${divName}`;
      fleetType = "Lini Produksi & Fasilitas Fabrikasi Manufaktur Otomatis Terstandarisasi";
      regulations = [
        "UU No. 3 Tahun 2014 tentang Perindustrian & Kebijakan Making Indonesia 4.0",
        "Perizinan Berusaha Berbasis Risiko OSS RBA (Izin Usaha Industri - IUI)",
        "PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan & Pengelolaan Lingkungan Hidup",
        "Standar Manajemen Mutu ISO 9001:2015, ISO 14001:2015, & K3 Pabrik ISO 45001:2018"
      ];
      macroGlobal = `Secara global, modernisasi manufaktur berfokus pada otomatisasi lini produksi (*Industry 4.0*), efisiensi energi, pemenuhan standar mutu internasional, dan integrasi rantai pasok hulu-hilir guna menjamin daya saing produk domestik.`;
      nationalRegs = `Secara nasional di Indonesia, operasional fasilitas **${divName}** untuk proyek **"${title}"** diatur oleh regulasi Kementerian Perindustrian melalui kewajiban pelaporan SIINas, izin kelayakan tata ruang kawasan industri, dan kepatuhan baku mutu lingkungan AMDAL / UKL-UPL.`;
      fieldOps = `Pelaksanaan operasional fasilitas industri menuntut keandalan proses prima:
* **Keandalan Mesin & Pemeliharaan Terencana:** Penerapan Total Productive Maintenance (TPM) guna meminimalkan downtime dan mencapai target Overall Equipment Effectiveness (OEE) ≥ 85%.
* **Sistem Pengendalian Mutu (Quality Control):** Pemeriksaan ketat bahan baku inbound dan produk jadi outbound dengan toleransi reject rate < 1.5%.
* **Penerapan K3 Manufaktur:** Standardisasi keselamatan kerja berstandar ISO 45001 dan budaya kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin).`;
      verdict = `Berdasarkan telaah mendalam terhadap ruang lingkup **"${title}"**, proyek fasilitas manufaktur ini dinilai **Sangat Layak Dijalankan (Feasible - GO)** dengan catatan penerapan tata kelola pabrik modern, pengendalian mutu terukur, dan kepatuhan penuh terhadap regulasi lingkungan.`;
    } else if (archetype === 'personal_sme') {
      commodity = `Produk & Layanan Usaha Mandiri / UMKM Sektor ${divName}`;
      fleetType = "Fasilitas Tempat Usaha Mandiri, Peralatan Operasional & POS Kasir Digital";
      regulations = [
        "PP No. 7 Tahun 2021 tentang Kemudahan, Pelindungan, dan Pemberdayaan Koperasi dan UMKM",
        "Nomor Induk Berusaha (NIB) Perseorangan Berbasis Risiko OSS RBA",
        "Sertifikasi Laik Higiene Sanitasi / P-IRT & Sertifikasi Halal Gratis (SEHATI BPJPH)",
        "PP No. 23 Tahun 2018 tentang Pajak Penghasilan Usaha Skala Mikro, Kecil, dan Menengah"
      ];
      macroGlobal = `Secara makro, pertumbuhan ekonomi kerakyatan dan kewirausahaan mandiri didorong oleh pergeseran gaya hidup konsumen lokal, peningkatan adopsi transaksi non-tunai, dan tingginya permintaan terhadap produk/layanan personal berkualitas.`;
      nationalRegs = `Secara nasional di Indonesia, operasional unit **${divName}** untuk proyek **"${title}"** didukung penuh oleh pemerintah melalui kemudahan izin NIB OSS RBA, pembebasan pajak omset di bawah Rp 500 Juta bagi wajib pajak perorangan, dan akses pembiayaan KUR Mikro.`;
      fieldOps = `Pelaksanaan operasional tempat usaha mandiri menuntut fokus pada kepuasan pelanggan:
* **Keramahan Pelayanan & Kebersihan Tempat:** Penerapan budaya senyum, sapa, salam serta standar kebersihan tinggi guna menjaga kenyamanan pelanggan.
* **Kecepatan Layanan & Pembayaran Digital:** Penyediaan sistem kasir terintegrasi QRIS Bank Indonesia untuk memangkas waktu transaksi di bawah 5 menit.
* **Manajemen Arus Kas & Persediaan:** Pengendalian stok bahan baku berkala untuk mencegah bahan terbuang dan pemisahan kas usaha dari kas pribadi.`;
      verdict = `Berdasarkan telaah mendalam terhadap ruang lingkup **"${title}"**, proyek usaha mandiri **"${title}"** dinilai **Sangat Layak Dijalankan (Feasible - GO)** dengan estimasi titik impas (BEP) yang cepat dan potensi pertumbuhan komunitas lokal yang kuat.`;
    } else {
      commodity = `Muatan Terjadwal Sektor ${divName}`;
      fleetType = "Armada Truk Angkutan Komersial Heavy-Duty Sesuai Karakteristik Kargo";
      const routeName = origin && dest ? `${origin} menuju ${dest}` : `Koridor Operasional Target ${title}`;
      regulations = [
        "UU No. 22 Tahun 2009 tentang Lalu Lintas dan Angkutan Jalan (LLAJ)",
        "Ketentuan Batas Muatan Sumbu Terberat (MST) dan Penertiban ODOL Kemenhub",
        "Sistem Manajemen Keselamatan (SMK) Angkutan Barang Berkelanjutan",
        "Standar Kelaikan Teknis Kendaraan Bermotor (Uji KIR Elektronik - Blue-e)"
      ];

      macroGlobal = `Di tingkat global, modernisasi rantai pasok industri bergeser ke arah efisiensi biaya logistik per ton-kilometer, kepatuhan keselamatan lalu lintas berstandar **ISO 39001**, dan integrasi visibilitas pelacakan muatan digital guna mendukung daya saing manufaktur dan distribusi barang.`;

      nationalRegs = `Secara nasional di Indonesia, operasional unit **${divName}** untuk proyek **"${title}"** diatur oleh undang-undang transportasi jalan dan regulasi kepatuhan muatan oleh Kementerian Perhubungan. Penegakan batas muatan kendaraan dan kewajiban uji berkala (KIR digital) merupakan syarat mutlak perlindungan keselamatan pengguna jalan dan aset korporat di jalur distribusi utama.`;

      fieldOps = `Pelaksanaan di koridor **${routeName}** menuntut kesiapan operasional prima:
* **Spesifikasi Armada Tepat Guna:** Penyesuaian daya mesin, rasio gardan, dan tipe karoseri dengan densitas muatan guna mencegah kelebihan beban poros.
* **Sistem Pemantauan Telematika GPS:** Pelacakan rute aktif, kontrol batas kecepatan pengemudi, dan deteksi waktu berhenti (idle time) armada.
* **Standarisasi Prosedur K3LL:** Pelatihan berkala keselamatan pengemudi untuk meminimalkan risiko kecelakaan di jalan nasional dan area bongkar muat klien.`;

      verdict = `Berdasarkan telaah mendalam terhadap ruang lingkup **"${title}"**, proyek ini dinilai **Layak Dijalankan (Feasible - GO)** dengan catatan penerapan tata kelola armada modern, standardisasi SLA yang terukur bersama klien, serta kepatuhan penuh terhadap regulasi jalan nasional.`;
    }
  }

  // Build the unified narrative
  const narrativeMarkdown = `### 1. Konteks Makro & Dinamika Rantai Pasok Global (${commodity})
Proyek **"${title}"** memegang peranan strategis dalam rantai pasok industri modern. ${macroGlobal}

### 2. Harmonisasi Regulasi & Kebijakan Nasional Indonesia
${nationalRegs}
* **Regulasi Acuan Kunci:**
${regulations.map(r => `  - ${r}`).join("\n")}

### 3. Realitas Lapangan, Tantangan Koridor & Kesiapan Operasional
${fieldOps}

* **Spesifikasi Armada Rekomendasi:** ${fleetType}
* **Koridor / Jangkauan Operasional:** ${corridor}

### 4. Kesimpulan Strategis & Rekomendasi Eksekutif
${verdict}`;

  return {
    title,
    commodity,
    fleetType,
    originDest: corridor,
    regulations,
    narrativeMarkdown
  };
}
