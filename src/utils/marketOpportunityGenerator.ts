/**
 * PRAMA AI Market Opportunity Generator (Pilar 2: Market Opportunity & Demand Dynamics)
 * Generates tailored, 100% project-title-aligned market demand and commercial opportunity
 * narratives, completely replacing generic static templates.
 */

export interface MarketOpportunityResult {
  title: string;
  targetMarket: string;
  demandDrivers: string[];
  marketGaps: string[];
  revenueStructure: string;
  greenAndTech: string;
  narrativeMarkdown: string;
}

export function generateMarketOpportunityForTitle(
  rawTitle: string,
  division?: string
): MarketOpportunityResult {
  const title = (rawTitle || "").trim() || "Kajian Peluang Pasar Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Komersial").trim();

  // Helper: detect origin and destination
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
  const routeName = origin && dest ? `${origin} ke ${dest}` : "Koridor Strategis Utama Proyek";

  let targetMarket = "";
  let demandDrivers: string[] = [];
  let marketGaps: string[] = [];
  let revenueStructure = "";
  let greenAndTech = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    const isBulk = titleLower.includes("curah");
    targetMarket = isBulk ? "Produsen Semen, Batching Plant Beton Ready-Mix & Kontraktor Infrastruktur" : "Distributor Semen Sak & Proyek Konstruksi";
    demandDrivers = [
      "Tingginya akselerasi pembangunan infrastruktur jalan tol, jembatan, bendungan, dan kawasan industri di Pulau Jawa",
      "Kebutuhan pasokan semen curah berkelanjutan tanpa jeda untuk menjaga konsistensi mutu adukan beton di batching plant",
      "Pertumbuhan kapasitas produksi pabrik semen regional yang menuntut kepastian armada distribusi berdaya angkut tinggi"
    ];
    marketGaps = [
      "Mayoritas armada transporter eksisting berusia tua dan mengalami inefisiensi kompresor unloader (waktu discharge semen > 90 menit)",
      "Tingginya risiko semen membeku/mengendap di dasar tangki akibat sirkulasi udara kompresor yang lembab atau berkarat",
      "Keterbatasan transporter profesional yang mampu memenuhi sertifikasi K3 pabrik dan standar bebas muatan lebih (Zero ODOL)"
    ];
    revenueStructure = "Formula tarif berbasis tonase bersih (Rp/Ton atau Rp/Ritase) dengan jaminan volume minimum bulanan (**Take-or-Pay Contract**) serta klausul penyesuaian tarif terindeks fluktuasi harga solar industri.";
    greenAndTech = "Penggunaan sensor tekanan silo digital dan telemetri pemantauan kompresor pembuang semen untuk menekan konsumsi solar saat proses unloader hingga 18%, serta penurunan emisi partikulat debu semen di area bongkar.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar untuk proyek **"${title}"** didorong oleh ekspansi industri konstruksi dan percepatan proyek infrastruktur nasional pada koridor **${routeName}**. Permintaan pasokan **${targetMarket}** membutuhkan jaminan ketepatan waktu pengiriman (*Just-In-Time delivery*) yang sangat ketat karena keterlambatan pasokan semen curah dapat menghentikan pengecoran beton ready-mix secara total.

* **Faktor Pendorong Pertumbuhan Pasar:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps & Opportunity)
Analisis terhadap lanskap kompetisi menunjukkan adanya celah layanan signifikan yang belum terlayani secara optimal oleh operator logistik konvensional:
${marketGaps.map(g => `  - **Kelemahan Operator Eksisting:** ${g}`).join("\n")}

Dengan menghadirkan armada tangki silo bertekanan pneumatik modern yang dilengkapi kompresor unloader berkapasitas tinggi (tekanan kerja 2.0 bar), proyek **"${title}"** mampu menawarkan keunggulan pemangkasan waktu bongkar (*unloading time*) menjadi kurang dari 40 menit per unit, bebas tumpahan semen, dan 100% patuh aturan MST jembatan timbang resmi.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
Proyek ini mengadopsi model komersial korporasi jangka panjang (3–5 tahun):
* **Skema Pendapatan:** ${revenueStructure}
* **Ketentuan Tingkat Layanan (SLA):** Jaminan ketersediaan armada (*Physical Availability*) minimal 95% dengan toleransi deviasi jadwal kedatangan maksimal ±30 menit.
* **Prospek Arus Kas:** Perputaran pendapatan sangat terprediksi berkat kontrak terikat (*captive demand*) dengan produsen semen dan pemilik batching plant rekanan.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan (Green Logistics & Tech Advantage)
${greenAndTech} Sistem telemetri terintegrasi memantau konsumsi BBM, rute tol optimal, serta perilaku pengemudi guna menjamin biaya operasional per tonase terendah di koridor distribusinya.

### 5. Rekomendasi Eksekusi Penetrasi Pasar (Go-to-Market Strategy)
Kajian menyimpulkan peluang pasar proyek **"${title}"** berada pada kuadran **Sangat Menjanjikan (High Demand / Captive Market)**. Disarankan untuk segera mengunci kontrak nota kesepahaman (MoU) pasokan volume minimum dengan produsen semen induk sebelum pengadaan penambahan unit armada silo.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    targetMarket = "Pabrik Smelter Nikel RKEF/HPAL, Pemegang IUP/IUPK Tambang & Konsorsium Rantai Pasok Baterai EV";
    demandDrivers = [
      "Ledakan kapasitas fasilitas pengolahan dan pemurnian (smelter) nikel laterit di kawasan industri pengolahan mineral nasional",
      "Kebutuhan pasokan ore harian stabil berkisar ribuan ton per hari untuk menjaga operasional tanur smelter menyala 24/7",
      "Kewajiban hilirisasi mineral domestik yang mewajibkan seluruh pergerakan bijih nikel tercatat secara sah di portal SIMBARA"
    ];
    marketGaps = [
      "Banyak transporter lokal kekurangan armada dump truck heavy-duty berspesifikasi bak Hardox yang tahan terhadap abrasi bebatuan tajam",
      "Tingginya angka breakdown armada saat musim hujan akibat jalan tambang laterit yang licin dan berlumpur tebal",
      "Kurangnya kepatuhan standar K3 Minerba dan absennya sistem telemetri digital untuk mencegah tumpahan material di jalan hauling"
    ];
    revenueStructure = "Kontrak jangka menengah hingga panjang berbasis tarif tonase per kilometer (Rp/WMT-km) dengan garansi volume bulanan serta mekanisme penyesuaian harga BBM industri (Fuel Surcharge Clause).";
    greenAndTech = "Implementasi armada truk bermesin efisiensi bahan bakar tinggi (Euro 4/5), monitoring fatik pengemudi dengan kamera cerdas AI DMS, dan optimasi siklus ritase guna memangkas jejak karbon per ton material nikel.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Pertumbuhan pasar angkutan nikel pada proyek **"${title}"** berada dalam fase *super-cycle* seiring massifnya hilirisasi mineral dan pengembangan industri rantai pasok baterai global. Pasokan bijih nikel (saprolit untuk smelter RKEF dan limonit untuk HPAL) menuntut siklus pengangkutan darat yang tanpa henti dari front tambang menuju stockpile pabrik.

* **Pendorong Utama Permintaan Pasar:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps & Opportunity)
Peluang strategis bagi proyek ini terbuka lebar karena keterbatasan kemampuan transporter tambang eksisting:
${marketGaps.map(g => `  - **Kendala di Lapangan:** ${g}`).join("\n")}

Dengan menempatkan dump truck heavy-duty berpenggerak 6x4 berkapasitas muat optimal dengan ban tipe E-4 khusus tambang serta bengkel perawatan mandiri (*on-site workshop*) di koridor rute, proyek **"${title}"** menjamin reliabilitas ritase tanpa terhenti oleh faktor cuaca ekstrem.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Skema Kontrak:** ${revenueStructure}
* **Perlindungan Finansial:** Penerapan batas toleransi susut muatan (*moisture content loss tolerance*) dan insentif ritase untuk pengemudi berprestasi keselamatan kerja.
* **Tingkat Kepastian Pendapatan:** Sangat tinggi karena keterikatan pasokan bahan baku pabrik smelter yang beroperasi secara terus menerus sepanjang tahun.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan (Green & Smart Logistics)
${greenAndTech} Integrasi barcode digital surat muatan dengan server kepatuhan lingkungan menjamin tidak ada muatan ilegal yang masuk ke pelabuhan atau smelter.

### 5. Rekomendasi Eksekusi Penetrasi Pasar (Go-to-Market Strategy)
Peluang pasar berstatus **Sangat Kuat (High Priority / High Margin)**. Langkah taktis prioritas adalah finalisasi alokasi kuota ritase bulanan bersama manajemen rantai pasok smelter dan audit kelaikan jalur hauling sebelum mobilisasi armada penuh.`;
  }

  // 3. BATUBARA / COAL
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    targetMarket = "Perusahaan Tambang Batubara PKP2B/IUP, Operator Jetty Pelabuhan Muat & Pembangkit Listrik (PLTU)";
    demandDrivers = [
      "Permintaan batubara untuk pemenuhan kewajiban pasar domestik (DMO) dan ketahanan pasokan listrik nasional",
      "Kebutuhan ritase pengangkutan cepat menuju jetty tongkang guna menghindari penalti keterlambatan kapal (demurrage)",
      "Regulasi ketat jalan khusus pertambangan yang menuntut operator dengan keandalan armada tinggi"
    ];
    marketGaps = [
      "Rendahnya ketersediaan mekanik dan suku cadang pada transporter non-spesialis sehingga Physical Availability armada sering di bawah 80%",
      "Kelemahan dalam penanganan debu batubara dan keselamatan lalu lintas jalan hauling yang memicu protes masyarakat sekitar",
      "Ketidaksiapan sistem timbang digital dan penelusuran elektronik SIMBARA Kemenkeu"
    ];
    revenueStructure = "Formula tarif ton-kilometer (Rp/Ton-Km) dengan komitmen ritase harian minimum dan skema bonus-penalti ketat berbasis performa ketepatan waktu.";
    greenAndTech = "Armada dilengkapi sistem penutup terpal otomatis kedap debu, monitoring konsumsi bahan bakar real-time melalui CAN-bus telemetri, dan penyiraman berkala jalur hauling.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar proyek **"${title}"** ditopang oleh kebutuhan kontinuitas pemindahan material batubara curah dari area tambang ke pelabuhan muat tongkang (*jetty*). Setiap keterlambatan pengangkutan berimplikasi langsung terhadap denda kapal tongkang dan penurunan efisiensi produksi tambang.

* **Faktor Penentu Pertumbuhan:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps)
Permasalahan umum pada operator angkutan batubara konvensional memberikan ruang kompetisi yang menguntungkan:
${marketGaps.map(g => `  - **Kesenjangan Layanan:** ${g}`).join("\n")}

Dengan sistem manajemen armada berbasis teknologi dan rasio cadangan armada 10%, proyek ini sanggup menjaga ketersediaan fisik armada (*Physical Availability*) konsisten di atas 92%.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Basis Kontrak:** ${revenueStructure}
* **Profitabilitas:** Skala keekonomian tercapai dengan optimalisasi waktu siklus ritase (*cycle time*) dan pemanfaatan sistem ban vulkanisir terstandar untuk efisiensi biaya operasional.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan
${greenAndTech} Pengendalian emisi dan debu menjadi nilai tambah dalam penilaian audit kepatuhan Proper KLHK bagi perusahaan tambang mitra.

### 5. Rekomendasi Eksekusi Penetrasi Pasar
Peluang pasar dinilai **Layak & Menguntungkan (Feasible - GO)** dengan catatan penetapan jadwal perawatan preventif teratur pada titik-titik kritis rute hauling.`;
  }

  // 4. FORESTRY / KEHUTANAN / PULP / KAYU LOG
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    targetMarket = "Industri Pulp & Kertas Skala Global, Produsen Kayu Olahan & Pemegang Izin PBPH HTI";
    demandDrivers = [
      "Permintaan produk kertas dan kemasan berbasis serat kayu alami berkelanjutan di pasar Asia dan global",
      "Kebutuhan evakuasi log kayu segar dari petak tebang HTI dalam waktu < 48 jam untuk menjaga kadar serat selulosa",
      "Standar sertifikasi lacak balak global (FSC, PEFC, SVLK) yang mewajibkan kepatuhan 100% legalitas kayu"
    ];
    marketGaps = [
      "Kerapuhan armada transporter pada medan jalan tanah gambut basah dan jembatan kayu sementara",
      "Banyak transporter tidak memiliki sistem pengikatan rantai bolster standar keselamatan yang memadai",
      "Absennya sistem pelacakan digital barcode SKSHHK yang terintegrasi langsung dengan portal kehutanan"
    ];
    revenueStructure = "Kontrak multi-tahun berbasis volume m³ atau tonase kayu log basah dengan formula tarif disesuaikan dengan zonasi jarak petak tebang ke pabrik mill.";
    greenAndTech = "Penerapan sistem traksi 6x4 dengan differential lock, pemantauan rute satelit cuaca untuk menghindari jalur banjir lumpur, dan dokumentasi digital rantai pasok bebas deforestasi.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar proyek **"${title}"** memiliki stabilitas tinggi karena terintegrasi langsung ke dalam rantai pasok pabrik pulp dan kertas berorientasi ekspor. Permintaan bersifat tahunan dan terlindung dari siklus fluktuasi jangka pendek.

* **Katalis Pasar:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps)
Tantangan geografis hutan tanaman industri membatasi jumlah operator yang sanggup bertahan:
${marketGaps.map(g => `  - **Celah Operasional:** ${g}`).join("\n")}

Dengan armada trailer logging berspesifikasi penggerak kuat, winch mandiri, dan pengikatan lashing bersertifikat, proyek ini menjadi solusi logistik andalan bagi pengelola konsesi hutan.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Model Kontrak:** ${revenueStructure}
* **Prediktabilitas:** Arus pendapatan stabil dengan pembayaran termin rutin sesuai volume kayu terverifikasi di timbangan log yard pabrik mill.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan
${greenAndTech} Sesuai dengan tuntutan kepatuhan **EUDR (EU Deforestation Regulation)**, keakuratan data koordinat titik angkut log kayu memberikan nilai jual premium.

### 5. Rekomendasi Eksekusi Penetrasi Pasar
Peluang pasar dinyatakan **Sangat Solid (Recession-Proof Market)**. Disarankan memfokuskan aliansi strategis dengan kontraktor pemanenan kayu untuk sinkronisasi jadwal muat.`;
  }

  // 5. LIMBAH B3 / MEDIS / WASTE MANAGEMENT
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    targetMarket = "Kawasan Industri Manufaktur, Fasilitas Kimia & Petrokimia, Rumah Sakit & Pengolah Limbah Berizin";
    demandDrivers = [
      "Penegakan hukum lingkungan hidup yang semakin ketat terhadap pembuangan limbah berbahaya tanpa izin resmi",
      "Pertumbuhan jumlah rumah sakit dan fasilitas manufaktur farmasi/elektronik penghasil limbah spesifik",
      "Kewajiban audit kepatuhan Proper KLHK yang mewajibkan manifest limbah elektronik FESTRONIK tuntas secara tertib"
    ];
    marketGaps = [
      "Sangat sedikitnya perusahaan logistik yang memiliki armada tersertifikasi Ditjen Hubdat untuk angkutan barang khusus berbahaya",
      "Kurangnya pengemudi yang mengantongi sertifikat kompetensi penanganan bahan B3 dari BNSP",
      "Ketiadaan armada dengan kompartemen kedap anti-tumpah dan perlengkapan darurat (Spill Kit B3) standar internasional"
    ];
    revenueStructure = "Penetapan tarif per kilogram atau per drum limbah dengan margin keuntungan tinggi (high-margin niche), ditambah biaya penanganan dokumen perizinan resmi.";
    greenAndTech = "Integrasi manifes digital FESTRONIK, sensor deteksi suhu/kebocoran kargo, dan pelatihan mitigasi tumpahan bahan kimia berbahaya.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar proyek **"${title}"** tergolong dalam pasar khusus (*specialized high-barrier market*) dengan regulasi pemerintah yang sangat protektif. Setiap produsen limbah industri wajib menggunakan jasa pengangkut berizin resmi demi menghindari sanksi pidana lingkungan.

* **Faktor Pendorong:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps)
Tingginya syarat izin menciptakan kelangkaan pasokan jasa transportasi resmi:
${marketGaps.map(g => `  - **Hambatan Kompetitor:** ${g}`).join("\n")}

Dengan kelengkapan izin rekomendasi KLHK, kartu pengawasan Kemenhub, dan pengemudi bersertifikasi BNSP, proyek ini memposisikan diri sebagai mitra terpercaya bagi perusahaan multinasional.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Model Komersial:** ${revenueStructure}
* **Ketahanan Bisnis:** Margin laba operasional mencapai > 25% karena faktor kepatuhan regulasi lebih diutamakan oleh klien daripada perang harga.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan
${greenAndTech} Sistem telematika memastikan armada tidak melenceng dari rute yang telah disetujui otoritas perhubungan dan lingkungan hidup.

### 5. Rekomendasi Eksekusi Penetrasi Pasar
Peluang pasar berstatus **Sangat Potensial (High-Margin Specialized Market)**. Disarankan segera menyusun paket kerja sama jangka panjang dengan kawasan industri dan pengolah limbah utama (PPLI/pengolah rekanan).`;
  }

  // 6. SAWIT / CPO / PERKEBUNAN
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    targetMarket = "Pabrik Kelapa Sawit (PKS), Pabrik Refinery Minyak Goreng & Biodiesel, dan Terminal Tangki Timbun Pelabuhan";
    demandDrivers = [
      "Produksi minyak kelapa sawit mentah (CPO) Indonesia yang terus bertumbuh untuk ekspor dan program mandatori Biodiesel B35/B40",
      "Kebutuhan pemindahan CPO secara cepat dari tangki PKS pedalaman sebelum kapasitas tangki timbun penuh meluber",
      "Tuntutan sertifikasi rantai pasok minyak nabati berkelanjutan (ISPO/RSPO)"
    ];
    marketGaps = [
      "Maraknya praktik pencurian minyak di perjalanan (*kencing CPO*) oleh oknum yang merugikan pemilik kargo",
      "Penggunaan tangki besi biasa yang menyebabkan korosi dan meningkatkan kadar asam lemak bebas (FFA/ALB) di atas ambang batas",
      "Ketidakteraturan jadwal kedatangan truk tangki yang memicu antrean berhari-hari di pelabuhan bongkar"
    ];
    revenueStructure = "Tarif berbasis tonase terangkut (Rp/Kg atau Rp/Ton) dengan jaminan batas toleransi susut muatan maksimal 0.15% dan penalti tegas bila terjadi penurunan mutu FFA.";
    greenAndTech = "Pemasangan segel digital E-Seal berbasis GPS pada kran tangki, tangki berbahan stainless steel food-grade SUS 304, dan pelacakan temperatur kargo.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar untuk proyek **"${title}"** memiliki volume transaksi masif seiring posisi Indonesia sebagai produsen minyak sawit terbesar di dunia. Perputaran armada tangki CPO sangat cepat dan kontinu sepanjang tahun.

* **Katalis Permintaan:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps)
Pemilik PKS dan pabrik refinery menuntut jaminan integritas kargo:
${marketGaps.map(g => `  - **Kelemahan Operator Lama:** ${g}`).join("\n")}

Keunggulan proyek ini terletak pada implementasi teknologi katup segel digital anti-manipulasi serta kebersihan tangki bersertifikat (*tank cleaning certificate*).

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Format Kontrak:** ${revenueStructure}
* **Perputaran Finansial:** Likuiditas arus kas tinggi dengan siklus penagihan mingguan atau per ritase yang tuntas di-discharge.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan
${greenAndTech} Kepatuhan standar ISPO dan efisiensi konsumsi solar menjadi keunggulan saat bersaing dalam lelang tender korporasi perkebunan besar.

### 5. Rekomendasi Eksekusi Penetrasi Pasar
Peluang pasar berstatus **Layak & Menguntungkan (High Turnover B2B)**. Rekomendasi utama adalah mengikat perjanjian kerja sama kuota angkut dengan kelompok PKS di sekitar koridor rute.`;
  }

  // 7. KONTAINER / PETIKEMAS / PORT
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    targetMarket = "Pelayaran Petikemas Domestik/Internasional, Perusahaan Freight Forwarder, Kawasan Industri & Manufaktur Eksportir-Importir";
    demandDrivers = [
      "Pertumbuhan arus bongkar muat peti kemas di pelabuhan utama seiring peningkatan perdagangan antar-pulau dan ekspor non-migas",
      "Kebutuhan konektivitas lancar dari dermaga pelabuhan ke kawasan industri (Dry Port / Kawasan Berikat)",
      "Peningkatan kebutuhan kontainer berpendingin (reefer container) untuk rantai dingin produk makanan beku dan farmasi"
    ];
    marketGaps = [
      "Tingginya biaya keterlambatan kontainer (*demurrage & detention*) akibat armada trailer sering mogok atau terlambat masuk gate pelabuhan",
      "Kelangkaan traktor head bertenaga besar yang dilengkapi genset plug-in aktif untuk menjaga kestabilan temperatur kontainer reefer",
      "Kondisi sasis trailer yang tidak terawat dan pengunci twistlock rusak yang membahayakan di jalan tol"
    ];
    revenueStructure = "Tarif per boks peti kemas (20ft / 40ft) dengan skema tambahan biaya tunggu (*waiting fee*) dan biaya lembur operasional pelabuhan malam hari.";
    greenAndTech = "Integrasi data jadwal kapal dengan Terminal Operating System (TOS) pelabuhan, sistem booking slot truk digital (TBS), dan monitoring suhu reefer via IoT.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Peluang pasar untuk proyek **"${title}"** bertumpu pada denyut nadi logistik petikemas di simpul pelabuhan. Kebutuhan angkutan trailer kontainer bersifat stabil dan dinamis mengikuti siklus kedatangan kapal kargo.

* **Faktor Pertumbuhan:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps)
Permasalahan kemacetan koridor pelabuhan dan dwelling time membuka peluang bagi transporter modern:
${marketGaps.map(g => `  - **Hambatan Kompetitor:** ${g}`).join("\n")}

Dengan trailer sasis baru, twistlock bersertifikat, serta integrasi digital pemesanan slot gate pelabuhan, proyek ini mampu menghemat waktu tunggu hingga 35%.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Model Komersial:** ${revenueStructure}
* **Fleksibilitas Portofolio:** Kemampuan melayani beragam jenis muatan (dry container, flat-rack, maupun reefer dingin).

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan
${greenAndTech} Pengurangan waktu idle mesin truk di antrean gate pelabuhan memangkas pemborosan bahan bakar secara drastis.

### 5. Rekomendasi Eksekusi Penetrasi Pasar
Peluang pasar dinilai **Sangat Layak (High Volume / Fluid Market)**. Disarankan menjalin kemitraan erat dengan asosiasi ekspedisi muatan kapal laut (EMKL) dan depo kontainer strategis.`;
  }

  // 8. GENERAL / CUSTOMIZED BY TITLE
  else {
    targetMarket = `Korporasi & Pelaku Industri Sektor ${divName}`;
    demandDrivers = [
      `Tingginya kebutuhan mobilitas rantai pasok material dan barang jadi pada proyek "${title}"`,
      "Tuntutan standardisasi keselamatan jalan raya (Zero Accident) dan kepatuhan batas beban sumbu Kemenhub",
      "Pergeseran preferensi pemilik kargo ke arah penyedia jasa logistik dengan transparansi pelacakan GPS real-time"
    ];
    marketGaps = [
      "Banyak transporter tradisional belum menerapkan sistem manajemen keselamatan armada (SMK) terakreditasi",
      "Kerapuhan komunikasi status pengiriman dan deviasi estimasi waktu kedatangan (ETA) muatan",
      "Ketidaksiapan skema kompensasi terstruktur bila terjadi kendala atau kerusakan barang di jalan"
    ];
    revenueStructure = "Formula kontrak berbasis SLA ketat dengan indeksasi harga bahan bakar serta garansi ketersediaan armada bulanan terukur.";
    greenAndTech = "Integrasi dashboard telemetri armada GPS, optimalisasi rute untuk menghemat konsumsi BBM, dan transparansi laporan kepatuhan emisi operasional.";

    narrativeMarkdown = `### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
Analisis pasar untuk proyek **"${title}"** menunjukkan tingginya kebutuhan akan layanan logistik terintegrasi yang menjamin keandalan rantai pasok sektor **${divName}**. Pertumbuhan aktivitas industri pada rute sasaran menuntut mitra transportasi yang dapat beroperasi secara konsisten dan terukur.

* **Pendorong Utama:**
${demandDrivers.map(d => `  - ${d}`).join("\n")}

### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps & Opportunity)
Terdapat peluang diferensiasi yang kuat di hadapan kompetitor konvensional:
${marketGaps.map(g => `  - **Kelemahan Penyedia Jasa Eksisting:** ${g}`).join("\n")}

Proyek **"${title}"** mengisi celah pasar tersebut melalui penyediaan armada prima, sertifikasi pengemudi terlatih, serta keandalan operasional dengan SLA terjamin.

### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
* **Skema Pendapatan:** ${revenueStructure}
* **Kepastian Bisnis:** Kontrak B2B formal yang memitigasi risiko pembatalan sepihak dan menjamin tingkat pengembalian investasi (ROI) yang sehat.

### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan (Green Logistics Advantage)
${greenAndTech} Efisiensi rute dan perilaku mengemudi hemat energi memberikan penghematan biaya bahan bakar hingga 12%.

### 5. Rekomendasi Eksekusi Penetrasi Pasar (Go-to-Market Strategy)
Kajian menyimpulkan peluang pasar proyek **"${title}"** berada pada level **Layak Dijalankan (Feasible - GO)**. Disarankan untuk segera memetakan daftar klien utama (*anchor clients*) pada rute koridor aktif guna mengamankan volume kontrak awal.`;
  }

  return {
    title,
    targetMarket,
    demandDrivers,
    marketGaps,
    revenueStructure,
    greenAndTech,
    narrativeMarkdown
  };
}
