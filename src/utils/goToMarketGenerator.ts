/**
 * PRAMA AI Go-To-Market Strategy Generator (Pilar 7: B2B Commercial Roadmap & Market Penetration)
 * Generates tailored, 100% project-title-aligned commercial go-to-market strategies,
 * target account segmentation, pricing models, contract stability tactics, and executive GTM verdicts.
 */

export interface GoToMarketResult {
  title: string;
  targetAccountsSummary: string;
  pricingModelSummary: string;
  salesChannelsSummary: string;
  kpiSummary: string;
  narrativeMarkdown: string;
}

export function generateGoToMarketForTitle(
  rawTitle: string,
  division?: string
): GoToMarketResult {
  const title = (rawTitle || "").trim() || "Kajian Strategi Go-To-Market & Komersialisasi Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Komersial").trim();

  // Extract route/corridor if present
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
  const routeName = origin && dest ? `${origin} ke ${dest}` : "Koridor Strategis Proyek";

  let targetAccountsSummary = "";
  let pricingModelSummary = "";
  let salesChannelsSummary = "";
  let kpiSummary = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT / CLINKER
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    targetAccountsSummary = "Pabrik batching plant beton siap pakai (ready-mix), pabrik beton pracetak (precast), dan kontraktor BUMN Karya di koridor proyek.";
    pricingModelSummary = "Tarif angkut per ton/ritase dengan formula eskalasi harga BBM solar non-subsidi dan minimum volume garansi (take-or-pay) 85%.";
    salesChannelsSummary = "Penetrasi B2B Direct Enterprise Sales ke procurement pabrik semen induk, kemitraan asosiasi beton (APBI/IATPI), dan e-tendering BUMN.";
    kpiSummary = "Contract Win Rate (≥35%), Volume Fulfillment SLA (≥98%), Net Revenue Retention (≥110%).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B (Target Accounts & Customer Personas)
Strategi Go-To-Market untuk proyek **"${title}"** difokuskan pada penguasaan pangsa pasar logistik semen curah dan klinker di koridor **${routeName}**:
  - **Tier-1 Utama (Strategic Key Accounts):** Produsen semen terintegrasi (Semen Indonesia Group, Indocement, Conch, Holcim/SMCB) yang membutuhkan sub-kontraktor transporter tangki silo berlisensi resmi dengan komitmen ketersediaan armada minimal 20–30 unit.
  - **Tier-2 Sekunder (High-Volume Ready-Mix & Precast):** Pabrik *batching plant* beton siap pakai dan pabrik beton pracetak infrastruktur (Waskita Precast, Adhi Beton, Wijaya Karya Beton) yang membutuhkan pasokan semen curah kontinu tanpa jeda untuk proyek strategis nasional.
  - **Tier-3 Taktis (Kontraktor Pekerjaan Jalan & Proyek Swasta):** Kontraktor pekerjaan tanah (*soil stabilization*) dan proyek dermaga swasta dengan kebutuhan pasokan semen curah insidental bervolume tinggi per periode proyek.

### 2. Strategi Penetrasi Pasar & Value Proposition (Market Penetration & Differentiator)
Keunggulan bersaing (*unique selling proposition*) yang ditawarkan kepada pemilik kargo semen:
  - **Jaminan SLA Kecepatan Bongkar (Discharge Speed Guarantee):** Armada tangki silo dilengkapi kompresor unloader bertekanan 2.0 bar yang mampu menuntaskan pembongkaran 30 ton semen dalam durasi < 45 menit, mengeliminasi biaya demurrage dan antrean di batching plant.
  - **Zero Spillage & Clean Delivery Certification:** Komitmen pengiriman bersih tanpa kebocoran pneumatik maupun pencemaran debu semen di area bongkar muat mitra.
  - **Kepatuhan Regulasi Beban Jalan (Zero ODOL Compliance):** Penjaminan legalitas penuh armada sesuai daya dukung jalan (MST 10 Ton) sehingga terbebas dari razia jembatan timbang dan risiko penyitaan muatan.

### 3. Model Kontrak Komersial & Skema Tarif (Pricing Structure & Revenue Stability)
Struktur perjanjian bisnis dirancang untuk melindungi stabilitas arus kas dan profitabilitas transporter:
  - **Formula Tarif Dinamis (Dynamic Rate per Ton-Km):** Penetapan harga dasar per ton dengan klausul eskalasi solar (*Fuel Adjustment Factor*) otomatis jika harga solar industri nonsubsidi berfluktuasi lebih dari ±5%.
  - **Klausul Jaminan Volume Minimum (Take-or-Pay 80%–85%):** Klien menjamin kuota volume pengiriman bulanan minimum. Jika volume pesanan di bawah kuota akibat kendala internal pabrik semen, biaya dasar ketersediaan unit tetap tertagih.
  - **Multi-Year Service Level Agreement (SLA Kontrak 2–3 Tahun):** Kontrak jangka menengah dengan insentif *volume rebate* (diskon 1.5%–2.5%) bagi klien yang melampaui kuota tahunan.

### 4. Kanal Penjualan & Rencana Akuisisi Akun (Sales Channels & Account Acquisition Roadmap)
  - **Fase 1 (Minggu 1–4): Enterprise Key Account Direct Pitching:** Pendekatan langsung ke jajaran *Head of Supply Chain & Procurement* produsen semen dan BUMN Precast dengan proposal studi rute **${routeName}**.
  - **Fase 2 (Minggu 5–8): Vendor Registration & Tender Qualification:** Pendaftaran resmi dalam vendor list rekanan pabrik semen induk dan pemenuhan syarat pra-kualifikasi audit K3LL.
  - **Fase 3 (Minggu 9–12): Dedicated Account Management:** Penunjukan tim Account Manager khusus untuk memonitor utilisasi harian armada tangki silo dan kepuasan penerima di batching plant.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan (Commercial Governance & KPIs)
* **Tingkat Kemenangan Tender (Contract Win Rate):** Target keberhasilan memenangkan lelang B2B ≥ 35%.
* **Volume Kontrak Terikat (Contracted Volume Ratio):** Minimal 80% kapasitas armada tangki terikat kontrak jangka panjang (Dedicated Long-Term Contract).
* **Net Revenue Retention (NRR):** Target retensi pendapatan dari klien eksisting ≥ 110% per tahun.
* **Days Sales Outstanding (DSO):** Rata-rata periode penagihan piutang usaha terkendali di bawah 45 hari kalender.

### 6. Rekomendasi Eksekutif Go-To-Market (Executive GTM Verdict)
Strategi Go-To-Market untuk proyek **"${title}"** dinyatakan **Sangat Feasible & Memiliki Daya Saing Kuat (GO - Ready to Commercialize)**. Prioritas utama adalah mengunci pra-kontrak aliansi dengan produsen semen induk sebelum jadwal pengadaan lelang kuartal berikutnya.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    targetAccountsSummary = "Pabrik smelter RKEF & HPAL, konsorsium pemilik IUP tambang nikel, dan trader bijih nikel laterit di sentra tambang.";
    pricingModelSummary = "Tarif angkut per wmt/dmt berjenjang sesuai jarak pit ke jetty/hopper, didukung klausul take-or-pay dan penalty demurrage tongkang.";
    salesChannelsSummary = "Aliansi strategis langsung dengan pemilik konsesi tambang pemegang RKAB resmi, konsorsium investor smelter, dan lelang jasa hauling.";
    kpiSummary = "Contract Win Rate (≥40%), Monthly Tonnage Fulfillment (≥98%), Safety Compliance (Zero Fatality).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B (Target Accounts & Customer Personas)
Strategi komersialisasi proyek **"${title}"** memprioritaskan pasar pertambangan dan hilirisasi nikel:
  - **Tier-1 Utama (Smelter Operators - RKEF & HPAL):** Fasilitas pemurnian nikel skala raksasa yang membutuhkan suplai bijih konsisten ribuan ton per hari menuju hopper kalsinasi atau pabrik HPAL.
  - **Tier-2 Sekunder (Pemegang IUP Tambang Nikel Terverifikasi):** Perusahaan tambang pemegang RKAB resmi yang memerlukan kontraktor hauling dump truck handal dari area pit menuju pelabuhan muat (jetty).
  - **Tier-3 Taktis (Traders & Stockpile Managers):** Pengelola stockpile perantara yang membutuhkan mobilisasi cepat bijih nikel sebelum batas akhir jadwal kedatangan tongkang (*barge laytime*).

### 2. Strategi Penetrasi Pasar & Value Proposition (Market Penetration & Differentiator)
Diferensiasi kompetitif layanan pengangkutan tambang nikel:
  - **Kesiapan Armada Heavy-Duty Hardox:** Dump truck berspesifikasi tambang tangguh dengan pelat bak baja tahan abrasi (Hardox), meminimalkan risiko kerusakan struktural di medan bebatuan laterit.
  - **Jaminan Utilisasi Jam Operasi (Mechanical Availability ≥ 90%):** Ketersediaan bengkel pit-stop mandiri on-site dengan teknisi siaga 24 jam menjamin kelancaran ritase dua shift.
  - **Kepatuhan Regulasi Tambang & SIMBARA Digital:** Transporter terdaftar resmi dan terintegrasi dengan sistem pelaporan elektronik Kementerian ESDM (SIMBARA) dan kaidah Good Mining Practices.

### 3. Model Kontrak Komersial & Skema Tarif (Pricing Structure & Revenue Stability)
  - **Tarif Berbasis Jarak & Berat (Rate per Wet Metric Ton - WMT):** Struktur tarif dasar per WMT dengan perhitungan kelandaian jalan hauling dan jarak tempuh.
  - **Klausul Take-or-Pay & Sharing Demurrage:** Perlindungan pendapatan transporter apabila penambang gagal menyediakan stok muatan di pit, disertai pembagian insentif percepatan sandar tongkang (*dispatch money*).
  - **Klausul Penyesuaian Harga Bahan Bakar (Fuel Pass-Through Clause):** Seluruh konsumsi solar industri B35 dipasok langsung oleh pemilik tambang (*fuel provided by principal*) atau disesuaikan dengan formula harga indeks bulanan.

### 4. Kanal Penjualan & Rencana Akuisisi Akun (Sales Channels & Account Acquisition Roadmap)
  - **Fase 1: Mapping & Aliansi Pemilik Konsesi IUP:** Pendataan tambang aktif berjarak ekonomis dengan titik smelter tujuan proyek.
  - **Fase 2: Joint Site Inspection & Route Feasibility:** Pelaksanaan survei bersama kontur jalan hauling bersama manajer tambang klien untuk membuktikan waktu siklus tempuh.
  - **Fase 3: Eksekusi Kontrak Jangka Panjang (Long-Term Hauling Contract):** Pengikatan kontrak kerja minimal 12–24 bulan dengan volume jaminan bulanan.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Realisasi Volume Bulanan (Tonnage Fulfillment):** Kepatuhan pasokan bijih nikel mencapai ≥ 98% target komitmen smelter.
* **Rasio Unit Dedicated Terkontrak:** Minimal 85% armada dump truck terikat kontrak volume tetap.
* **Indeks Keselamatan Tambang (Safety Index):** Kepatuhan Golden Rules K3 Pertambangan dengan nihil kecelakaan kerja (Zero LTI).

### 6. Rekomendasi Eksekutif Go-To-Market
Rencana Go-To-Market untuk **"${title}"** dinilai **Sangat Prospektif & Bernilai Komersial Tinggi (Approved - GO)**. Disarankan segera menyelesaikan MoU dengan konsorsium smelter sasaran.`;
  }

  // 3. BATUBARA / COAL
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    targetAccountsSummary = "Perusahaan tambang pemegang PKP2B/IUP OP, operator pelabuhan jetty batubara, dan pemasok PLTU independen.";
    pricingModelSummary = "Tarif per ton-km dengan jaminan ritase harian, sistem bonus efisiensi cycle time, dan klausul proteksi cuaca hujan (slippery penalty exemption).";
    salesChannelsSummary = "Pemasaran langsung B2B ke mining owner, partisipasi tender jasa pertambangan terdaftar, dan kemitraan konsorsium logistik tambang.";
    kpiSummary = "Contract Win Rate (≥40%), Barge Turnaround Time Compliance (≥96%), Unit Gross Margin (≥22%).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B (Target Accounts & Customer Personas)
Pasar sasaran komersial untuk proyek **"${title}"**:
  - **Tier-1 Utama (Produsen Batubara Skala Besar / PKP2B):** Perusahaan tambang bereputasi tinggi yang membutuhkan ratusan ribu ton hauling batubara per bulan dari front tambang ke intermediate stockpile atau jetty muat tongkang.
  - **Tier-2 Sekunder (Pemasok Batubara Domestik / PLTU PLN):** Trader dan transporter resmi yang memiliki kontrak pasokan batubara DMO (*Domestic Market Obligation*) dengan jaminan penalti ketat dari pihak pembeli akhir.
  - **Tier-3 Taktis (Operator Stockpile & Jetty):** Penyedia jasa penimbunan dan pemuatan tongkang yang membutuhkan armada cadangan saat lonjakan antrean kapal.

### 2. Strategi Penetrasi Pasar & Value Proposition
  - **Penjaminan Bebas Tumpahan & Swabakar (Zero Dust & Spillage):** Penggunaan armada tronton dengan terpal otomatis (*automatic tarp cover*) dan SOP penanganan batubara berkalori rendah rawan panas.
  - **SLA Kecepatan Pemuatan Tongkang (Barge Loading Speed):** Kemampuan mengalirkan ritase intensif saat tongkang bersandar guna mencegah timbulnya biaya denda pelabuhan (*demurrage cost*).
  - **Kepatuhan Lingkungan & K3LL Bersertifikat:** Pengoperasian armada sesuai standar pengelolaan lingkungan hidup pertambangan nasional.

### 3. Model Kontrak Komersial & Skema Tarif
  - **Tarif Per Ton-Km (IDR/Ton-Km) Bertingkat:** Skema tarif kompetitif dengan struktur bonus apabila produktivitas tonase bulanan melampaui target dasar.
  - **Klausul Slippery & Force Majeure Cuaca:** Batasan operasional saat hujan deras (*rain & slippery condition*) tanpa sanksi denda keterlambatan terhadap transporter.
  - **Fuel Escalation Clause:** Perlindungan penuh atas biaya bahan bakar industri melalui penyediaan BBM langsung oleh pemilik tambang.

### 4. Kanal Penjualan & Rencana Akuisisi Akun
  - **Kemitraan Jasa Pertambangan (IUJP):** Melengkapi legalitas Izin Usaha Jasa Pertambangan untuk mengikuti lelang korporat tambang batubara.
  - **Direct Negotiation with Concession Holders:** Negosiasi bilateral penunjukan langsung penyediaan armada cadangan (*buffer fleet*).
  - **SLA Review Berkala:** Evaluasi performa operasional bulanan bersama direksi logistik tambang untuk perpanjangan kontrak otomatis.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Kepatuhan Waktu Siklus (Cycle Time Adherence):** Ketepatan durasi hauling lintasan mencapai ≥ 95%.
* **Gross Margin Operasional:** Margin laba kotor sebelum pajak stabil pada kisaran 20%–25%.
* **Nihil Denda Demurrage (Zero Demurrage Charge):** 100% jadwal tongkang terpenuhi tanpa penalti waktu tunggu kapal.

### 6. Rekomendasi Eksekutif Go-To-Market
Rencana penetrasi pasar proyek **"${title}"** dinilai **Sangat Layak & Siap Berjalan (Feasible - GO)**.`;
  }

  // 4. FORESTRY / KEHUTANAN / KAYU / PULP & PAPER
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    targetAccountsSummary = "Pabrik pulp & paper terintegrasi, pemegang konsesi Hutan Tanaman Industri (HTI), dan industri pengolahan kayu lapis (plywood).";
    pricingModelSummary = "Tarif per meter kubik (m3) atau ton kayu segar dengan formula jarak petak tebang, take-or-pay panen musiman, dan bagi hasil perkerasan jalan.";
    salesChannelsSummary = "Penetrasi vendor list resmi grup industri kertas raksasa, kepatuhan sertifikasi SVLK/FSC, dan kontrak multi-tahun panen HTI.";
    kpiSummary = "Contract Retention Rate (≥90%), Fresh Wood Intake SLA (≥95%), Zero Legal Violation.";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B
Target akun komersial untuk proyek **"${title}"**:
  - **Tier-1 Utama (Konglomerasi Pulp & Paper):** Korporasi raksasa kertas (seperti APP Sinarmas, APRIL Group) yang memerlukan pasokan jutaan ton kayu log akasia/eukaliptus segar dari area konsesi HTI menuju pabrik mill.
  - **Tier-2 Sekunder (Pabrik Wood Pellet & Kayu Lapis):** Industri pengolahan biomassa dan kayu lapis yang mengandalkan kayu log berdiameter spesifik dengan kepastian rantai pasok ketat.
  - **Tier-3 Taktis (Koperasi Hutan Rakyat & Pemasok Mandiri):** Pengelola hutan tanaman rakyat yang membutuhkan armada trailer logistik untuk pengiriman musiman.

### 2. Strategi Penetrasi Pasar & Value Proposition
  - **Trailer Logging Khusus Sasis Berat:** Armada logging dilengkapi bolster stanchion baja dan rantai lashing hidrolik berdaya tahan tinggi di medan gambut licin.
  - **Kepatuhan Rantai Pasok Legal (SVLK & FSC):** Seluruh armada dan prosedur pengangkutan terintegrasi dengan verifikasi dokumen resmi kayu (SKSHHK) guna menjamin bebas kayu ilegal.
  - **Jaminan Pasokan Kayu Segar (Fresh Wood Delivery Guarantee):** Memastikan waktu transit dari tebangan ke yard mill maksimal 48 jam guna mempertahankan kualitas rendemen serat kayu pabrik kertas.

### 3. Model Kontrak Komersial & Skema Tarif
  - **Tarif Per Metrik Ton / Meter Kubik (M3):** Perhitungan tarif berdasar jarak petak tebang (*block compartment distance*) menuju timbangan mill.
  - **Klausul Co-Investment Perkerasan Jalan:** Perjanjian pembagian biaya perawatan jalan lateral bersama pemegang konsesi untuk mencegah amblas saat musim hujan.
  - **Multi-Year Dedicated Agreement:** Kontrak kerja eksklusif 3 tahun dengan klausul volume kuota panen tahunan.

### 4. Kanal Penjualan & Rencana Akuisisi Akun
  - **Pra-Kualifikasi Vendor Grup Kertas:** Pendaftaran resmi pada sistem pengadaan pusat logistik grup pulp & paper nasional.
  - **Audit Lapangan Kelaikan Armada:** Mengundang tim safety & audit klien untuk memverifikasi spesifikasi trailer bolster di lokasi pangkalan.
  - **Perluasan Alokasi Blok Tebang:** Meningkatkan jatah volume ritase secara bertahap seiring dengan bukti ketepatan waktu pengiriman.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Tingkat Retensi Kontrak (Contract Retention):** Target pembaruan kontrak jangka panjang ≥ 90%.
* **Tingkat Kesiapan Pasokan Kayu Pabrik:** Pemenuhan target harian log yard pabrik kertas ≥ 95%.
* **Kepatuhan Dokumen Legalitas (Legal Compliance):** 100% pengangkutan disertai barcode SKSHHK sah tanpa perselisihan.

### 6. Rekomendasi Eksekutif Go-To-Market
Kajian komersial proyek **"${title}"** dinilai **Sangat Layak & Memiliki Kepastian Pasar Tinggi (GO)**.`;
  }

  // 5. LIMBAH B3 / MEDIS / WASTE MANAGEMENT
  else if (titleLower.includes("limbah") || titleLower.includes("waste") || titleLower.includes("b3") || titleLower.includes("sampah") || titleLower.includes("medis")) {
    targetAccountsSummary = "Pabrik kimia, manufaktur otomotif, instalasi farmasi, rumah sakit rujukan, dan fasilitas pengolahan limbah akhir (PPLI).";
    pricingModelSummary = "Biaya langganan retensi bulanan (retainer fee) + tarif per kg/drum limbah B3, termasuk proteksi tanggung renteng liabilitas hukum KLHK.";
    salesChannelsSummary = "Penjualan enterprise B2B langsung ke divisi HSE/K3 pabrik, keikutsertaan e-Katalog LKPP limbah medis, dan kemitraan fasilitas pemusnah berizin.";
    kpiSummary = "Client Retention Rate (≥95%), Festronik Compliance Rate (100%), Regulatory Zero Violation.";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B
Target pelanggan bernilai tinggi untuk proyek **"${title}"**:
  - **Tier-1 Utama (Industri Manufaktur Berat & Kimia):** Pabrik petrokimia, otomotif, baja, dan elektronik yang menghasilkan limbah B3 cair/padat beracun dalam volume rutin dan membutuhkan transporter berizin resmi KLHK.
  - **Tier-2 Sekunder (Fasilitas Pelayanan Kesehatan & Rumah Sakit):** RSUD, RS Swasta, dan laboratorium klinis yang memerlukan pengangkutan limbah medis infeksius terjadwal dengan manifes digital harian.
  - **Tier-3 Taktis (Perusahaan Pembersih Tanki / Oil Sludge Cleaning):** Penyedia jasa pembersihan tangki industri yang membutuhkan jasa evakuasi limbah B3 ke fasilitas insinerator atau pemanfaatan berizin.

### 2. Strategi Penetrasi Pasar & Value Proposition
  - **Legalitas Penuh Rekomendasi KLHK & Izin Hubdat:** Menghilangkan 100% risiko sanksi pidana lingkungan bagi penghasil limbah melalui jaminan izin aktif seluruh armada.
  - **Integrasi Penuh FESTRONIK Real-Time:** Penertiban surat jalan manifes elektronik KLHK seketika saat muatan dinaikkan, menjamin transparansi rantai pengolahan limbah.
  - **Perlindungan Asuransi Tanggung Jawab Lingkungan (Environmental Liability Insurance):** Perlindungan finansial komprehensif atas potensi insiden tumpahan di perjalanan.

### 3. Model Kontrak Komersial & Skema Tarif
  - **Skema Retainer Bulanan + Biaya Penjemputan:** Kontrak tahunan dengan biaya retensi kepatuhan per bulan ditambah tarif penjemputan per drum / ton muatan.
  - **Bundling Jasa Pengangkutan & Sertifikat Pemusnahan (COD - Certificate of Destruction):** Paket menyeluruh dari penjemputan hingga penerbitan bukti pemusnahan resmi dari fasilitas pengolah akhir.
  - **Klausul Masa Simpan Maksimal:** Jaminan penjemputan sebelum batas waktu simpan 90 hari di TPS limbah klien terlampaui.

### 4. Kanal Penjualan & Rencana Akuisisi Akun
  - **Pendekatan Divisi HSE Korporat:** Presentasi audit kepatuhan kepada Manajer K3 & Lingkungan pabrik-pabrik di kawasan industri sasaran.
  - **Listing di E-Katalog Kesehatan Pemerintah:** Pendaftaran resmi untuk menyasar lelang pengangkutan limbah medis rumah sakit pemerintah.
  - **Aliansi dengan Fasilitas Pemanfaat Limbah Resmi:** Kerja sama rujukan timbal balik bersama industri semen pemanfaat limbah (*co-processing*).

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Tingkat Retensi Klien Korporat:** Retensi pelanggan B2B tahunan stabil ≥ 95%.
* **Kepatuhan Sinkronisasi FESTRONIK:** 100% pengangkutan tercatat real-time tanpa selisih timbangan.
* **Tingkat Insiden Kebocoran Lingkungan:** Nihil tumpahan B3 ke jalan raya (Zero Spill Incident).

### 6. Rekomendasi Eksekutif Go-To-Market
Model Go-To-Market proyek **"${title}"** dinyatakan **Sangat Solid, Patuh Regulasi, & Siap Dikomersialkan (Approved - GO)**.`;
  }

  // 6. SAWIT / CPO / PERKEBUNAN
  else if (titleLower.includes("sawit") || titleLower.includes("cpo") || titleLower.includes("tbs") || titleLower.includes("palm") || titleLower.includes("perkebunan")) {
    targetAccountsSummary = "Pabrik Kelapa Sawit (PKS), bulking station pelabuhan ekspor, dan industri pengolahan minyak goreng/oleokimia.";
    pricingModelSummary = "Tarif per kilogram/ton CPO dengan klausul garansi batas toleransi susut (shrinkage max 0.2%) dan penalti kenaikan kadar asam lemak (FFA).";
    salesChannelsSummary = "Penjualan enterprise langsung ke supply chain perkebunan kelapa sawit swasta & PTPN, lelang spot bulking terminal, dan kontrak angkutan terikat.";
    kpiSummary = "Contract Win Rate (≥35%), Cargo Integrity Rate (≥99.8%), Fleet Turnover Ratio (≥4 rit/minggu).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B
Segmen pelanggan komersial untuk proyek **"${title}"**:
  - **Tier-1 Utama (Perusahaan Perkebunan Sawit Swasta Terbuka & PTPN):** Grup perkebunan sawit besar yang memiliki puluhan PKS dan memerlukan armada tangki stainless steel berkapasitas 25–30 ton untuk mengangkut CPO harian ke pelabuhan.
  - **Tier-2 Sekunder (Pabrik Minyak Goreng & Refinery Oleokimia):** Pabrik hilirisasi sawit yang menuntut kestabilan kualitas CPO dengan kadar FFA rendah dan bebas kontaminasi logam.
  - **Tier-3 Taktis (Bulking Station & Eksportir CPO):** Pengelola tangki timbun pelabuhan yang memerlukan percepatan transfer muatan saat kapal tanker ekspor bersandar.

### 2. Strategi Penetrasi Pasar & Value Proposition
  - **Tangki Stainless Steel Food Grade (SUS 304):** Penjaminan kualitas higienis minyak sawit mentah dengan tangki berinsulasi pemanas uap (*steam coil*).
  - **Garansi Integritas Muatan & Segel Digital (E-Seal Satelit):** Meniadakan risiko pencurian / "kencing di jalan" melalui pemantauan GPS katup pelepasan 24/7.
  - **Jaminan Toleransi Susut Sangat Rendah (< 0.2%):** Penggantian nilai kerugian penuh apabila terjadi selisih susut timbangan di luar batas toleransi wajar.

### 3. Model Kontrak Komersial & Skema Tarif
  - **Tarif Per Kilogram / Tonase Muatan:** Penetapan harga per kg CPO yang diangkut dari PKS menuju terminal pelabuhan.
  - **Klausul Garansi Kualitas Asam Lemak Bebas (FFA Guarantee):** Komitmen waktu transit cepat agar tidak terjadi kenaikan kadar asam lemak selama perjalanan darat.
  - **Skema Kontrak Multi-Musim:** Struktur kontrak fleksibel yang menyesuaikan volume pengiriman saat musim panen puncak (*peak crop season*).

### 4. Kanal Penjualan & Rencana Akuisisi Akun
  - **Tender Angkutan CPO Tahunan:** Partisipasi aktif dalam lelang jasa angkutan grup perkebunan kelapa sawit nasional.
  - **Uji Coba Pengiriman Perdana (Trial Haul):** Pelaksanaan pengangkutan 5 unit armada perdana untuk memvalidasi akurasi waktu tempuh dan nihil penyusutan.
  - **Program Loyalitas Transporter Terpilih:** Pengikatan kontrak berjangka 2 tahun dengan status transporter prioritas utama (*Tier-1 Preferred Hauler*).

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Integritas Muatan Tiba (Cargo Retention Index):** Akurasi volume timbangan tiba terhadap timbangan asal ≥ 99.8%.
* **Volume Kontrak Tahunan Terpenuhi:** Target pengangkutan minimal 95% kuota kontrak terikat.
* **Days Sales Outstanding (DSO):** Periode pembayaran invoice rata-rata maksimal 30–45 hari kerja.

### 6. Rekomendasi Eksekutif Go-To-Market
Rencana komersialisasi proyek **"${title}"** dinilai **Sangat Layak & Memiliki Margin Bisnis Sehat (Approved - GO)**.`;
  }

  // 7. KONTAINER / PETIKEMAS / PORT
  else if (titleLower.includes("kontainer") || titleLower.includes("container") || titleLower.includes("petikemas") || titleLower.includes("port") || titleLower.includes("pelabuhan")) {
    targetAccountsSummary = "Freight forwarder internasional, shipping line / main line operator, eksportir manufaktur, dan pengelola depo petikemas.";
    pricingModelSummary = "Tarif angkut per box (20ft/40ft/reefer) rute bolak-balik pabrik-depo-dermaga, jaminan bebas detention/demurrage, dan integrasi TBS pelabuhan.";
    salesChannelsSummary = "Pemasaran enterprise langsung ke pabrik kawasan industri ekspor, aliansi asosiasi logistik (ALFI/ASPERHINDO), dan integrasi Truck Booking System.";
    kpiSummary = "On-Time Closing Time (100%), Demurrage Elimination Rate (100%), Monthly Box Turnover (≥60 box/unit).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B
Target pasar komersial untuk proyek **"${title}"**:
  - **Tier-1 Utama (Eksportir & Importir Manufaktur Kawasan Industri):** Perusahaan manufaktur di kawasan industri (seperti Cikarang, Karawang, Cilegon, Gresik) yang rutin melakukan pengiriman petikemas ekspor/impor dengan tenggat waktu *vessel closing time* ketat.
  - **Tier-2 Sekunder (International Freight Forwarders & 3PL):** Perusahaan ekspedisi muatan kapal yang membutuhkan vendor trucking berdedikasi tinggi dengan ketersediaan sasis trailer 20ft/40ft dan sertifikasi TID pelabuhan lengkap.
  - **Tier-3 Taktis (Shipping Lines & Container Depots):** Pelayaran peti kemas yang membutuhkan repositioning kontainer kosong (*empty container repositioning*) antar depo dan terminal dermaga.

### 2. Strategi Penetrasi Pasar & Value Proposition
  - **Jaminan 100% Bebas Denda Keterlambatan Kapal (Zero Demurrage & Detention):** Komitmen pengantaran tepat waktu sebelum batas penutupan gerbang ekspor (*closing time*).
  - **Konektivitas Digital Truck Booking System (TBS):** Integrasi langsung dengan sistem reservasi gerbang pelabuhan dermaga peti kemas, memotong waktu tunggu antrean di luar terminal.
  - **Sasis Trailer Bersertifikasi KIR & Twistlock Sempurna:** Menjamin keamanan muatan kargo ekspor bernilai tinggi dari risiko kecelakaan atau kerusakan kunci twistlock.

### 3. Model Kontrak Komersial & Skema Tarif
  - **Tarif Per Box Kontainer (IDR per Box 20ft/40ft/Reefer):** Struktur tarif transparan mencakup ongkos jalan tol, bahan bakar, dan biaya gerbang pelabuhan.
  - **Optimalisasi Ritase Dua Arah (Round-Trip Utilization Discount):** Penawaran diskon tarif khusus bagi mitra yang menyediakan muatan kontainer impor untuk rute kembali ke depo.
  - **Service Level Guarantee dengan Kompensasi Denda:** Komitmen transporter menanggung biaya demurrage apabila keterlambatan terbukti murni akibat kegagalan unit armada.

### 4. Kanal Penjualan & Rencana Akuisisi Akun
  - **Fase 1: Direct Enterprise Outreach Kawasan Industri:** Pendekatan langsung ke manajer ekspor-impor pabrik-pabrik manufaktur multinasional.
  - **Fase 2: Strategic Partnership dengan Forwarder Global:** Pengikatan kontrak sub-kontrak jangka panjang bersama 5 forwarder papan atas.
  - **Fase 3: Dedicated Dispatcher & 24/7 Tracking Control:** Penyediaan akses dashboard GPS pelacak posisi kontainer secara real-time kepada staf logistik klien.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan
* **Ketepatan Waktu Closing Kapal:** 100% petikemas masuk terminal sebelum jadwal closing dermaga.
* **Utilisasi Armada per Bulan:** Minimal 50–60 gerakan box per unit tractor head per bulan.
* **Tingkat Retensi Klien B2B:** Retensi pelanggan korporat tahunan mencapai ≥ 92%.

### 6. Rekomendasi Eksekutif Go-To-Market
Kajian penetrasi komersial proyek **"${title}"** dinilai **Sangat Layak & Memiliki Potensi Arus Kas Harian Kuat (GO)**.`;
  }

  // 8. GENERAL / OTHER COMMERCIAL LOGISTICS PROJECTS
  else {
    targetAccountsSummary = `Korporasi industri, distributor regional, dan pemilik kargo di divisi ${divName} yang membutuhkan keandalan SLA tinggi.`;
    pricingModelSummary = "Tarif kontrak berbasis volume bergaransi bulanan, klausul eskalasi harga bahan bakar industri, dan term pembayaran 30 hari kalender.";
    salesChannelsSummary = "Penjualan enterprise B2B langsung, partisipasi lelang pengadaan logistik tahunan, dan pengikatan kontrak jangka panjang ber-SLA ketat.";
    kpiSummary = "Contract Win Rate (≥35%), Customer Retention Rate (≥90%), On-Time Delivery SLA (≥96%).";

    narrativeMarkdown = `### 1. Profil Target Pelanggan & Segmentasi B2B (Target Accounts & Customer Personas)
Strategi komersial dan penetrasi pasar untuk proyek **"${title}"** difokuskan pada penguasaan segmen bisnis korporat yang menuntut reliabilitas tinggi:
  - **Tier-1 Utama (Strategic Key Accounts):** Perusahaan manufaktur dan pemilik kargo skala besar yang membutuhkan mitra transporter berbadan hukum resmi dengan komitmen armada khusus (*dedicated fleet*) dan jaminan SLA ketat.
  - **Tier-2 Sekunder (Distributor Regional & Perusahaan 3PL):** Pelaku logistik pihak ketiga yang membutuhkan tambahan kapasitas angkut reguler untuk memenuhi lonjakan volume distribusi musiman.
  - **Tier-3 Taktis (Klien Kontrak Spot Berulang):** Pengirim muatan industri yang memerlukan fleksibilitas penambahan unit armada cadangan dengan pembayaran termin cepat.

### 2. Strategi Penetrasi Pasar & Value Proposition (Market Penetration & Differentiator)
Diferensiasi kompetitif yang ditawarkan kepada calon mitra pengguna jasa:
  - **Jaminan Ketersediaan Armada Fisik (Fleet Availability Guarantee ≥ 90%):** Kepastian unit prima beroperasi setiap hari kerja tanpa kendala ketiadaan kendaraan.
  - **Transparansi Sistem Telematika GPS Real-Time:** Klien memiliki akses langsung ke portal pemantauan rute perjalanan, status muatan, dan estimasi waktu tiba (*ETA*).
  - **Standardisasi Keselamatan Berkendara (QHSE Standards):** Pengemudi terlatih dengan sertifikasi keselamatan kerja dan kelengkapan alat pelindung diri lengkap.

### 3. Model Kontrak Komersial & Skema Tarif (Pricing Structure & Revenue Stability)
Struktur perjanjian komersial dirancang untuk menjamin kestabilan pendapatan jangka panjang:
  - **Tarif Dasar Bergaransi Volume (Base Rate with Volume Commitment):** Penawaran tarif kompetitif dengan syarat batas minimum pemesanan volume bulanan (*take-or-pay*).
  - **Klausul Penyesuaian Harga Bahan Bakar (Fuel Escalation Clause):** Klausul otomatis penyesuaian tarif apabila terjadi kenaikan atau penurunan harga bahan bakar industri melebihi ambang batas toleransi.
  - **Termin Pembayaran Terjadwal (Credit Terms 30–45 Hari):** Skema penagihan terjadwal dengan penjaminan perputaran modal kerja transporter yang sehat.

### 4. Kanal Penjualan & Rencana Akuisisi Akun (Sales Channels & Account Acquisition Roadmap)
  - **Pendekatan Langsung B2B Enterprise (Direct Account Pitching):** Tim sales komersial melakukan presentasi proposal kelayakan rute dan tarif kepada jajaran manajemen pengadaan calon klien.
  - **Pendaftaran Vendor List Korporat (Vendor Registration):** Melengkapi seluruh syarat legalitas administrasi dan perpajakan untuk masuk ke dalam daftar rekanan prioritas.
  - **Manajemen Akun Terdedikasi (Key Account Management):** Penunjukan narahubung operasional khusus untuk memastikan komunikasi harian berjalan lancar dan responsif.

### 5. Matriks Tata Kelola Komersial & KPI Penjualan (Commercial Governance & KPIs)
* **Tingkat Kemenangan Penawaran (Contract Win Rate):** Target keberhasilan penawaran tender B2B ≥ 35%.
* **Tingkat Retensi Pelanggan (Customer Retention Rate):** Target perpanjangan kontrak tahunan klien ≥ 90%.
* **Ketepatan Waktu Pengiriman (On-Time Delivery SLA):** Realisasi ketepatan tiba di titik bongkar ≥ 96%.
* **Kolektibilitas Piutang (Days Sales Outstanding):** Rata-rata periode penyelesaian tagihan ≤ 45 hari kalender.

### 6. Rekomendasi Eksekutif Go-To-Market (Executive GTM Verdict)
Strategi Go-To-Market untuk proyek **"${title}"** dinyatakan **Sangat Feasible & Memiliki Kelayakan Komersial Tinggi (GO - Ready for Market Entry)**. Langkah berikutnya adalah inisiasi pertemuan awal dengan perwakilan pengadaan pemilik kargo sasaran utama.`;
  }

  return {
    title,
    targetAccountsSummary,
    pricingModelSummary,
    salesChannelsSummary,
    kpiSummary,
    narrativeMarkdown
  };
}
