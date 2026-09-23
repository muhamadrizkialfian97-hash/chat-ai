/**
 * PRAMA AI Supply & Demand Dynamics Generator (Pilar 4: Supply & Demand Equilibrium)
 * Generates tailored, 100% project-title-aligned fleet capacity, volume equilibrium,
 * and operational supply-demand dynamics narratives.
 */

export interface SupplyDemandResult {
  title: string;
  fleetCapacitySpecs: string;
  demandCharacteristics: string;
  equilibriumStrategy: string;
  contingencyPlan: string;
  narrativeMarkdown: string;
}

export function generateSupplyDemandForTitle(
  rawTitle: string,
  division?: string
): SupplyDemandResult {
  const title = (rawTitle || "").trim() || "Kajian Keseimbangan Pasokan & Permintaan Logistik";
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

  let fleetCapacitySpecs = "";
  let demandCharacteristics = "";
  let equilibriumStrategy = "";
  let contingencyPlan = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    const isBulk = titleLower.includes("curah");
    fleetCapacitySpecs = isBulk
      ? "Armada Truk Tangki Silo Pneumatik (Hi-Blow) berkapasitas 24–32 Ton dilengkapi Kompresor Unloader Blower Bertekanan 2.0 Bar"
      : "Armada Truk Flatbed / Tronton Wingbox Kapasitas 20–25 Ton";
    demandCharacteristics = "Permintaan harian kontinu dari batching plant ready-mix dan proyek jalan/infrastruktur dengan fluktuasi puncak saat cuaca cerah dan proyek kejar tayang.";
    equilibriumStrategy = "Penyelarasan ritase armada dengan kapasitas tangki silo penyimpanan batching plant (rata-rata 60–100 ton per silo) guna mencegah truk mengantre lama atau silo kehabisan semen.";
    contingencyPlan = "Penyediaan kompresor blower cadangan portable dan 10% unit armada siaga (*buffer fleet*) di pool koridor tengah untuk mengantisipasi lonjakan pengecoran beton malam hari.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kebutuhan pasokan logistik pada proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Dengan rute lintasan **${routeName}**, setiap unit armada ditargetkan mampu menyelesaikan 1–2 ritase per hari dengan kapasitas angkut optimal yang mematuhi batas Muatan Sumbu Terberat (MST 10 Ton).

* **Parameter Kunci Pasokan Armada:**
  - **Spesifikasi Teknis:** Tangki silo baja/aluminium kedap kelembaban dengan membran aerasi bertekanan unloader stabil.
  - **Ketersediaan Fisik (Physical Availability):** Target ketersediaan armada minimal 92% melalui sistem perawatan pencegahan (*preventive maintenance*) berkala pada kompresor blower dan sistem pengereman.
  - **Waktu Bongkar Muat (Turnaround Time):** Proses pemuatan (*loading*) di pabrik semen rata-rata 30 menit dan pembongkaran pneumatik di silo penerima maksimal 45 menit.

### 2. Dinamika & Karakteristik Permintaan (Demand-Side Volatility)
Karakteristik permintaan pada proyek ini bersifat terikat (*captive B2B demand*) dengan dinamika volume berikut:
  - **Kebutuhan Kontinu Batching Plant:** Pabrik adukan beton membutuhkan pasokan semen curah stabil untuk melayani proyek infrastruktur; jeda pasokan melebihi 2 jam berisiko menghentikan operasional pengecoran.
  - **Siklus Jam Kerja Lapangan:** Permintaan pengiriman semen curah melonjak pada sore hingga dini hari (pukul 17:00 – 04:00) guna menghindari kemacetan dan menyesuaikan dengan jadwal pengecoran struktur besar di lokasi konstruksi.
  - **Variasi Musim:** Penurunan permintaan sebesar 15–20% pada puncak musim hujan, yang dikompensasi oleh lonjakan permintaan tinggi pada kuartal 3 dan 4 (percepatan penyelesaian anggaran proyek konstruksi).

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi (Equilibrium & Utilization)
Untuk mencapai titik keseimbangan optimal antara biaya operasional armada dan kepuasan klien:
  - **Tingkat Utilisasi Target:** Utilisasi armada dijaga pada rentang ideal **82% – 88%**, memberikan ruang rotasi servis berkala tanpa mengorbankan SLA pengiriman klien.
  - **Manajemen Antrean Depo Silo:** Penjadwalan kedatangan truk (*slot scheduling*) yang terintegrasi dengan tim logistik pabrik semen untuk memangkas waktu tunggu (*waiting time*) di jembatan timbang menjadi < 20 menit.
  - **Rasio Utilisasi Balik (Backhaul Potential):** Menjajaki muatan balik bahan baku aditif semen (seperti fly ash batubara atau slag mineral) pada rute kepulangan bila memungkinkan, guna memangkas biaya per tonase secara menyeluruh.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan (Resilience & Contingency Plan)
Guna menjamin keandalan pasokan terhadap risiko kegagalan teknis di koridor **${routeName}**:
  - **Buffer Fleet & Kompresor Cadangan:** Menyiapkan 1 unit armada cadangan untuk setiap 10 unit aktif, serta unit kompresor cadangan di depo transit untuk penanganan darurat unloader macet.
  - **Alternatif Koridor Lintasan:** Penetapan rute kontinjensi antara Jalur Pantura dan Tol Trans Jawa saat terjadi perbaikan jalan atau kepadatan lalu lintas tak terduga.
  - **Monitoring Telematika Real-Time:** Integrasi GPS geofencing dan sensor tekanan pneumatik tangki yang terhubung ke control room operasional 24 jam.

### 5. Rekomendasi Kapasitas Eksekutif (Capacity Sizing Verdict)
Kajian menyimpulkan konfigurasi kapasitas pasokan proyek **"${title}"** berada pada level **Seimbang & Sangat Layak (Optimal Equilibrium)**. Skalabilitas armada dapat ditingkatkan secara bertahap (*phased expansion*) seiring penambahan volume kontrak baru dengan batching plant rekanan.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    fleetCapacitySpecs = "Dump Truck Heavy-Duty 6x4 / 8x4 Kapasitas 25–35 Ton Pelat Hardox AR400 Ban Mining E-4";
    demandCharacteristics = "Kebutuhan pasokan ribuan ton bijih nikel (WMT) setiap hari untuk memberi makan tanur putar pembakaran smelter yang wajib beroperasi 24/7.";
    equilibriumStrategy = "Sinkronisasi ritase hauling tambang dengan kuota penerimaan harian di stockpile smelter dan kapasitas alat muat excavator di front tambang.";
    contingencyPlan = "Penyiagaan grader dan compactor pemeliharaan jalan hauling, workshop servis on-site 24 jam, dan buffer stockpile cadangan darurat.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Karakteristik pengangkutan di medan tambang menuntut ketahanan rangka sasis dan tenaga torsi mesin besar untuk menaklukkan tanjakan curam jalan konsesi.

* **Parameter Pasokan Armada:**
  - **Target Ritase Harian:** Setiap unit dump truck ditargetkan mencapai 6–10 ritase per shift (tergantung jarak front tambang ke smelter/jetty).
  - **Ketahanan Fisik Armada (Mechanical Availability):** Target MA minimal 90% dengan dukungan tim mekanik standby di pit-stop perbaikan cepat.
  - **Daya Muat Efektif:** Kapasitas muat dirancang optimal 26–30 Ton per ritase guna menyeimbangkan produktivitas dengan umur keausan ban tambang.

### 2. Dinamika & Karakteristik Permintaan (Demand-Side Volatility)
Permintaan pengangkutan bijih nikel laterit didorong oleh kebutuhan suplai tanur smelter yang tidak boleh padam:
  - **Kestabilan Kebutuhan Pasokan:** Pabrik smelter membutuhkan pasokan nikel basah (Wet Metric Ton - WMT) secara konstan dengan spesifikasi kadar Ni dan rasio Fe/Si yang terhomogenisasi.
  - **Disrupsi Musim Hujan:** Hujan lebat dapat menurunkan produksi hauling hingga 30% akibat jalan licin (*slippery conditions*); oleh karena itu pasokan harus dipacu maksimal pada kondisi cuaca kering (*dry season sprint*).
  - **Kepatuhan Kuota RKAB:** Volume pengangkutan terikat erat dengan izin tonase tahunan yang disetujui pemerintah dalam dokumen digital SIMBARA.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi (Equilibrium & Optimization)
Strategi keseimbangan operasional proyek difokuskan pada eliminasi *bottleneck*:
  - **Penyelarasan Rasio Loader-Truck (Match Factor):** Mengatur rasio dump truck per excavator tambang pada angka ideal **0.95 – 1.05** guna memastikan tidak ada excavator yang menganggur (*idle*) maupun antrean truk berlebih di front loading.
  - **Siklus Ritase Terukur (Cycle Time):** Pemantauan durasi pemuatan (3-4 menit), waktu angkut, penimbangan jembatan timbang, dan waktu dumping (2 menit).
  - **Keseimbangan Shift Operasional:** Penerapan 2 shift kerja (shift siang dan malam) dengan pergantian pengemudi langsung di unit (*hot seat changeover*) untuk memaksimalkan utilitas jam operasional truk.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan (Resilience & Contingency Plan)
Menghadapi medan tambang ekstrem:
  - **Armada Perawatan Jalan Hauling:** Mengoperasikan motor grader dan water truck untuk meratakan jalan hauling dan menyiram debu secara terus-menerus.
  - **Manajemen Stockpile Darurat:** Penyediaan buffer stockpile di dekat mulut pabrik smelter yang mampu menopang pasokan tanur selama 5 hari saat jalur hauling terdampak cuaca buruk.
  - **Rotasi & Kelelahan Pengemudi (Fatigue Management):** Penegakan istirahat wajib dan kamera AI DMS untuk mencegah insiden kelelahan saat ritase shift malam.

### 5. Rekomendasi Kapasitas Eksekutif (Capacity Sizing Verdict)
Kajian menyimpulkan kapasitas proyek **"${title}"** berada pada status **Sangat Optimal (Feasible - GO)**. Disarankan memprioritaskan ketersediaan stok ban cadangan tipe E-4 dan suku cadang hidrolik dump hoist di gudang on-site.`;
  }

  // 3. BATUBARA / COAL
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    fleetCapacitySpecs = "Dump Truck Tronton 6x4 High-Cube / Double-Trailer Side-Dump Kapasitas 30–45 Ton";
    demandCharacteristics = "Tuntutan ritase cepat dari pit tambang ke pelabuhan jetty guna memenuhi target muat tongkang batubara sesuai jadwal kapal.";
    equilibriumStrategy = "Penyelarasan volume hauling harian dengan target pemuatan tongkang (barge loading rate 1.000 ton/jam) di jetty dermaga.";
    contingencyPlan = "Penyiraman rutin debu batubara, tim perbaikan jalan hauling, dan cadangan armada siaga saat periode tongkang sandar.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan hauling batubara pada proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Kecepatan perputaran ritase (*cycle time*) dari pit tambang menuju stockpile pelabuhan (*jetty*) menjadi penentu utama efisiensi biaya logistik.

* **Parameter Pasokan Armada:**
  - **Kapasitas Angkut:** Desain bak volume tinggi (*high-cube*) yang disesuaikan dengan berat jenis batubara (0.8–0.9 ton/m³).
  - **Target Utilisasi Armada:** Beroperasi 20 jam per hari dengan alokasi 4 jam untuk inspeksi harian (P2H), pengisian BBM, dan perawatan preventif.
  - **Tingkat Kesiapan Unit:** Target Physical Availability minimal 90% dengan rata-rata Mean Time Between Failures (MTBF) > 150 jam kerja.

### 2. Dinamika & Karakteristik Permintaan (Demand-Side Dynamics)
Permintaan pengangkutan batubara bersifat dinamis mengikuti kedatangan tongkang:
  - **Jadwal Sandar Tongkang (Barge Laytime):** Permintaan pasokan mencapai intensitas puncak saat tongkang 300 kaki (kapasitas 7.500–8.000 ton) merapat di pelabuhan muat.
  - **Penalti Keterlambatan (Demurrage Risk):** Keterlambatan pengangkutan batubara ke jetty berisiko menimbulkan denda kapal yang signifikan, sehingga pasokan harus diakselerasi tepat waktu.
  - **Fluktuasi Cuaca Hujan:** Hambatan genangan air di hauling road membutuhkan penyesuaian tonase muatan demi menjaga keselamatan operasional.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi (Equilibrium)
Optimalisasi ritase untuk efisiensi maksimum:
  - **Match Factor Timbangan Jetty:** Penataan alur timbangan digital dua lajur di pintu masuk jetty untuk mencegah penumpukan armada truk.
  - **Manajemen Konsumsi Solar (Fuel Efficiency):** Pemantauan kecepatan jelajah truk pada rentang ekonomis (35–45 km/jam) pada jalur hauling guna menghemat konsumsi bahan bakar hingga 8%.
  - **Penjadwalan Ritase Berjenjang:** Mengatur interval pemberangkatan armada agar tiba di area penumpahan (*hopper / stockpile jetty*) tanpa waktu tunggu antrean.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **Pengendalian Debu & Risiko Swabakar:** Kendaraan dilengkapi terpal penutup otomatis dan rute hauling dilalui water truck penyiram debu.
  - **Cadangan Ban dan Komponen Bergerak:** Manajemen ban vulkanisir terakreditasi untuk menekan biaya operasional per ton-kilometer.
  - **SOP Tanggap Darurat Jalan Hauling:** Regu evakuasi derek heavy-duty siaga untuk memindahkan truk yang mengalami kerusakan teknis di jalur utama dalam waktu < 20 menit.

### 5. Rekomendasi Kapasitas Eksekutif
Konfigurasi armada dan target volume proyek **"${title}"** dinilai **Layak & Seimbang (Feasible - GO)** dengan catatan pemenuhan standar keselamatan jalan hauling secara konsisten.`;
  }

  // 4. FORESTRY / KEHUTANAN / PULP / KAYU LOG
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    fleetCapacitySpecs = "Truk Logging Trailer 6x4 dengan Stanchion Bolster Baja & Winch Mandiri";
    demandCharacteristics = "Pasokan log kayu segar terjadwal harian dari petak tebang HTI ke log yard pabrik pulp mill untuk mencegah pembusukan serat selulosa.";
    equilibriumStrategy = "Sinkronisasi kapasitas muat logging truck dengan kecepatan mesin panen kayu (Harvester/Forwarder) di petak tebang.";
    contingencyPlan = "Penggunaan differential lock aktif, pemantauan jalan gambut, dan sistem rotasi rute saat curah hujan tinggi.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan angkutan kayu konsesi untuk proyek **"${title}"** bertumpu pada **${fleetCapacitySpecs}**. Armada dirancang khusus untuk memuat kayu gelondongan berdiameter sedang hingga besar dengan pengamanan rantai lashing hidrolik ganda.

* **Parameter Pasokan Armada:**
  - **Kapasitas Muat:** 30–40 m³ kayu log per ritase dengan distribusi berat sumbu yang stabil.
  - **Kemampuan Traksi Medan Ekstrem:** Konfigurasi penggerak 6x4 dengan sistem *inter-axle differential lock* untuk menaklukkan medan tanah gambut lembek dan tanjakan terjal hutan.
  - **Kesiapan Armada:** Target Physical Availability 88% dengan pembersihan rutin lumpur pada sistem rem dan suspensi pegas daun.

### 2. Dinamika & Karakteristik Permintaan
  - **Pasokan Cepat Bahan Baku Pabrik Kertas:** Kayu log hasil tebangan harus tiba di pabrik mill maksimal dalam 48 jam agar kadar air dan mutu serat kayu tidak mengalami degradasi biologis.
  - **Siklus Blok Tebang:** Permintaan pasokan berpindah secara berkala mengikuti zonasi petak tebang hutan tanaman industri yang telah matang panen.
  - **Dampak Musim Basah:** Penurunan kapasitas angkut per ritase saat musim hujan demi menjaga keutuhan konstruksi jalan tanah konsesi.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi
  - **Sinkronisasi Alat Muat (Excavator Grapple):** Menghitung kecukupan armada logging agar excavator pemuat tidak menunggu lama di tepi petak tebang (*roadside log landing*).
  - **Manajemen Waktu Bongkar Log Yard Mill:** Penggunaan crane derek pabrik yang efisien dengan waktu bongkar tuntas < 25 menit per trailer.
  - **Sistem Barcode SKSHHK Digital:** Penginputan data volume muatan langsung terintegrasi dengan gate timbang elektronik mill untuk mempercepat administrasi.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **Peralatan Evakuasi Lapangan:** Setiap rombongan armada logging dibekali sling baja tarik dan winch mandiri bila terjadi amblas di jalan gambut.
  - **Pemeliharaan Jembatan Log Darurat:** Tim survei jalur memantau gorong-gorong dan jembatan kayu sementara untuk memastikan keselamatan muatan.
  - **Pelatihan Defensive Driving Khusus Hutan:** Pengemudi dibekali teknik pengereman beban berat di turunan tanah licin.

### 5. Rekomendasi Kapasitas Eksekutif
Kajian menyimpulkan kapasitas pasokan proyek **"${title}"** berada dalam status **Seimbang & Sangat Layak (Feasible - GO)**.`;
  }

  // 5. LIMBAH B3 / MEDIS / WASTE
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    fleetCapacitySpecs = "Armada Box Truck Kedap Cairan & Tangki Kimia Khusus Berizin Kemenhub & KLHK";
    demandCharacteristics = "Jadwal penjemputan limbah berkala dari fasilitas industri/RS sebelum melampaui batas waktu penyimpanan TPS limbah 90 hari.";
    equilibriumStrategy = "Pengaturan rute penjemputan multi-titik (multi-drop collection) guna memaksimalkan kapasitas angkut box per ritase.";
    contingencyPlan = "Perlengkapan Spill Kit B3 komprehensif, rute darurat menjauhi pemukiman, dan pengemudi tersertifikasi BNSP B3.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Seluruh armada wajib memenuhi standar rancang bangun kelaikan teknis angkutan barang khusus berbahaya.

* **Parameter Pasokan Armada:**
  - **Integritas Kompartemen Muatan:** Bak box tertutup dengan lapisan penampung tumpahan (*spill containment floor*) dan pengikat drum muatan bersertifikat.
  - **Legalitas Dokumen:** Setiap unit mengantongi Kartu Pengawasan Izin Angkutan Khusus Ditjen Hubdat dan rekomendasi pengangkutan limbah dari KLHK.
  - **Kesiapan Armada:** Target ketersediaan unit 95% dengan audit harian perlengkapan APD dan spill kit.

### 2. Dinamika & Karakteristik Permintaan
  - **Kepatuhan Batas Waktu Simpan TPS:** Perusahaan manufaktur dan rumah sakit dibatasi regulasi penyimpanan limbah B3 maksimal 90–180 hari di TPS lokal, menciptakan permintaan penjemputan terjadwal yang pasti.
  - **Keragaman Karakteristik Limbah:** Variasi jenis limbah padat, cair, mudah menyala, dan infeksius yang menuntut pemisahan kompatibilitas muatan dalam kompartemen.
  - **Ketertiban Manifest Elektronik FESTRONIK:** Jumlah volume muatan di surat jalan digital wajib presisi dengan timbangan fasilitas pengolah akhir.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi
  - **Optimalisasi Rute Konsolidasi (Consolidated Route):** Menjadwalkan penjemputan limbah dari beberapa pabrik di satu kawasan industri yang sama untuk memaksimalkan payload unit armada.
  - **Pencegahan Waktu Menganggur di Gerbang Pengolah:** Sinkronisasi waktu tiba armada di fasilitas pemusnah berizin (PPLI/insenerator) untuk menghindari antrean uji sampel laboratorium.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **SOP Tanggap Tumpahan Kimiawi:** Penempatan peralatan darurat spill kit, serbuk penyerap, dan pakaian pelindung kimia lengkap di kabin truk.
  - **Pemantauan GPS Geofencing Real-Time:** Notifikasi otomatis ke control room bila armada keluar dari koridor rute yang telah disetujui otoritas perhubungan.

### 5. Rekomendasi Kapasitas Eksekutif
Kapasitas pasokan dinyatakan **Sangat Siap & Berprospek Unggul (Feasible - GO)** dengan margin operasional tinggi.`;
  }

  // 6. SAWIT / CPO / PERKEBUNAN
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    fleetCapacitySpecs = "Armada Truk Tangki Stainless Steel SUS 304 Kapasitas 20–30 Ton Bersegel Digital E-Seal";
    demandCharacteristics = "Volume pengeluaran CPO harian dari pabrik kelapa sawit (PKS) menuju tangki timbun pelabuhan atau pabrik refinery.";
    equilibriumStrategy = "Menyeimbangkan ritase harian dengan laju produksi CPO di PKS agar tangki timbun pabrik tidak meluber (*overflow*).";
    contingencyPlan = "Penguncian katup manifold digital anti-kencing, sertifikasi pencucian tangki steam, dan tim cadangan darurat.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan untuk proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Tangki dirancang higienis guna mencegah oksidasi minyak sawit mentah.

* **Parameter Pasokan Armada:**
  - **Kapasitas Muat:** 20.000 hingga 28.000 liter per tangki dengan kalibrasi tera metrologi resmi.
  - **Kesiapan Armada:** Target Physical Availability minimal 92% dengan kebersihan tangki terverifikasi bebas residu kotoran.
  - **Kecepatan Bongkar Muat:** Durasi pengisian di PKS < 40 menit dan pembongkaran pipa pompa di pelabuhan < 50 menit.

### 2. Dinamika & Karakteristik Permintaan
  - **Lonjakan Musim Panen Raya (Peak Crop Season):** Lonjakan volume produksi sawit hingga 40% pada bulan tertentu yang membutuhkan akselerasi ketersediaan armada tangki.
  - **Keterbatasan Tangki Timbun PKS:** Kapasitas tampung tangki di PKS umumnya hanya mencukupi 5–7 hari produksi; jika tidak diangkut tepat waktu, PKS terpaksa menurunkan kapasitas olah TBS.
  - **Kualitas Parameter Mutu (FFA):** Waktu transit yang terlalu lama di perjalanan berisiko menaikkan kadar asam lemak bebas (FFA/ALB) di atas toleransi kontrak.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi
  - **Manajemen Rotasi Ritase 24 Jam:** Pemanfaatan dua pengemudi per unit armada tangki untuk menjaga perputaran kontinu rute PKS ke pelabuhan.
  - **Mitigasi Waktu Tunggu Tangki Timbun Pelabuhan:** Koordinasi jadwal bongkar dengan operator tangki timbun untuk memangkas waktu tunggu di luar gerbang terminal.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **Segel Digital (E-Seal System):** Pengamanan katup pembuangan dengan sensor GPS digital guna mengeliminasi risiko pencurian muatan di rute sepi.
  - **Unit Pembersih Tangki Cadangan (Tank Cleaning Station):** Stasiun pencucian uap mandiri di pool armada guna mempercepat kesiapan unit antar muatan.

### 5. Rekomendasi Kapasitas Eksekutif
Kajian menyimpulkan kapasitas pasokan proyek **"${title}"** berstatus **Optimal & Layak Dijalankan (Feasible - GO)**.`;
  }

  // 7. KONTAINER / PETIKEMAS / PORT
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    fleetCapacitySpecs = "Armada Tractor Head 6x2 dengan Trailer Sasis Skeleton 20ft / 40ft Dilengkapi Twistlock Resmi";
    demandCharacteristics = "Pergerakan arus petikemas ekspor, impor, dan domestik mengikuti jadwal sandar kapal kontainer di dermaga pelabuhan.";
    equilibriumStrategy = "Penjadwalan slot truk melalui Truck Booking System (TBS) terminal pelabuhan untuk memangkas waktu tunggu gerbang.";
    contingencyPlan = "Penyediaan genset reefer cadangan, pemeliharaan trailer sasis rutin, dan penyiagaan unit pengganti saat jam sibuk pelabuhan.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan kontainer proyek **"${title}"** mengandalkan **${fleetCapacitySpecs}**. Armada dirancang handal untuk manuver di koridor jalan tol dan area depo petikemas.

* **Parameter Pasokan Armada:**
  - **Kekuatan Traksi Prime Mover:** Tenaga mesin minimal 380 HP dengan sistem pengereman ABS untuk menangani muatan kontainer berbobot hingga 30 ton.
  - **Kelaikan Twistlock:** Keempat sudut pengunci kontainer teruji kelaikan dan berstandar keselamatan Kemenhub.
  - **Ketersediaan Fisik Armada:** Target minimal 94% dengan pemeliharaan ban trailer terjadwal.

### 2. Dinamika & Karakteristik Permintaan
  - **Siklus Closing Time Kapal:** Permintaan armada trailer memuncak menjelang waktu batas penerimaan kontainer ekspor (*closing time*) di pelabuhan.
  - **Ketepatan Pengembalian Kontainer Kosong (Empty Return):** Kebutuhan ritase terjadwal untuk mengembalikan kontainer kosong ke depo pelayaran guna menghindari denda demurrage/detention.
  - **Kebutuhan Khusus Kontainer Pendingin (Reefer):** Ketersediaan generator set bergerak untuk memastikan aliran listrik kontainer reefer tidak terputus selama perjalanan darat.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi
  - **Pemanfaatan Muatan Dua Arah (Round-Trip Utilization):** Mengkombinasikan pengiriman kontainer impor isi ke pabrik dengan pengambilan kontainer ekspor pada rute balik guna menekan pergerakan kosong (*empty mileage*).
  - **Integrasi Sistem Terminal Pelabuhan:** Sinkronisasi jadwal gate-in armada dengan sistem operasional pelabuhan (TOS Pelindo).

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **Manajemen Kemacetan Akses Pelabuhan:** Penentuan titik tunggu (*buffer yard*) di dekat gerbang tol pelabuhan untuk mengantisipasi kemacetan kronis koridor arteri.
  - **Kesiapan Genset Mobile Cadangan:** Unit generator portabel cadangan untuk mengamankan muatan dingin bernilai tinggi bila terjadi kerusakan genset utama.

### 5. Rekomendasi Kapasitas Eksekutif
Kapasitas pasokan proyek **"${title}"** dinilai **Sangat Layak & Fleksibel (Feasible - GO)**.`;
  }

  // 8. GENERAL / CUSTOMIZED BY TITLE
  else {
    fleetCapacitySpecs = `Armada Truk Angkutan Komersial Heavy-Duty Terstandarisasi untuk Sektor ${divName}`;
    demandCharacteristics = `Kebutuhan pengangkutan muatan rutin dan berjadwal dari para pemilik kargo pada rute sasaran "${title}".`;
    equilibriumStrategy = "Penyelarasan kapasitas armada terpasang dengan target volume bulanan klien terikat kontrak B2B.";
    contingencyPlan = "Rasio armada cadangan 10%, monitoring telematika GPS real-time, dan sistem pemeliharaan pencegahan terstruktur.";

    narrativeMarkdown = `### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
Kapasitas pasokan untuk proyek **"${title}"** difokuskan pada penyediaan **${fleetCapacitySpecs}**. Konfigurasi armada dirancang untuk memberikan efisiensi biaya angkut per ton-kilometer tertinggi dengan kepatuhan penuh terhadap regulasi jalan nasional.

* **Parameter Pasokan Armada:**
  - **Kapasitas Muat Ideal:** Daya angkut dirancang sesuai dengan spesifikasi berat jenis muatan dan batas kapasitas sumbu kendaraan (MST).
  - **Ketersediaan Fisik Unit (Physical Availability):** Target ketersediaan armada minimal 90% melalui penerapan jadwal servis rutin di pool terpadu.
  - **Keandalan Pengemudi:** Pengemudi profesional tersertifikasi yang mematuhi standar keselamatan berkendara (Safety Defensive Driving).

### 2. Dinamika & Karakteristik Permintaan (Demand-Side Analysis)
  - **Stabilitas Volume Muatan:** Kebutuhan pengangkutan dari para pemilik kargo pada koridor rute menuntut komitmen jadwal kedatangan yang teratur dan dapat diandalkan.
  - **Sensitivitas Waktu Tempuh:** Fluktuasi lalu lintas jalan raya menuntut visibilitas estimasi waktu tiba (ETA) muatan yang transparan.
  - **Penyesuaian Skala Bisnis:** Permintaan bertumbuh seiring ekspansi operasional mitra kerja sama korporasi di wilayah sasaran.

### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi
  - **Tingkat Utilisasi Armada Optimal:** Menjaga utilitas armada pada kisaran **80% – 85%** guna menjamin kecukupan waktu istirahat pengemudi dan rotasi perawatan kendaraan.
  - **Optimalisasi Rute Koridor:** Pemilihan rute terpendek dan paling efisien dari segi waktu tempuh dan konsumsi bahan bakar melalui panduan sistem GPS telemetri.
  - **Peluang Muatan Balik:** Memaksimalkan efisiensi rute kepulangan dengan memanfaatkan jaringan muatan kargo rekanan logistik.

### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan
  - **Unit Cadangan Siaga (Standby Buffer):** Alokasi armada cadangan sebesar 10% dari total unit aktif guna mengantisipasi lonjakan permintaan mendadak atau perbaikan mendesak.
  - **SOP Penanganan Kendala Jalan:** Kerja sama dengan jaringan bengkel rekanan di sepanjang rute untuk mempercepat penanganan insiden ban atau mesin.
  - **Transparansi Sistem Manajemen Armada:** Seluruh pergerakan unit dipantau secara terpusat untuk mendeteksi deviasi jadwal pengiriman secara dini.

### 5. Rekomendasi Kapasitas Eksekutif (Capacity Sizing Verdict)
Kajian menyimpulkan perencanaan kapasitas pasokan proyek **"${title}"** berada pada level **Seimbang & Layak Dijalankan (Feasible - GO)**. Skalabilitas armada dapat ditingkatkan secara fleksibel sesuai dengan pertumbuhan volume kontrak jangka panjang.`;
  }

  return {
    title,
    fleetCapacitySpecs,
    demandCharacteristics,
    equilibriumStrategy,
    contingencyPlan,
    narrativeMarkdown
  };
}
