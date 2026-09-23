/**
 * PRAMA AI TAM, SAM, SOM Generator (Pilar 12: Total Addressable Market, Serviceable Addressable Market, Serviceable Obtainable Market)
 * Generates tailored, 100% project-title-aligned macro market sizing, reachable geographic market,
 * realistic obtainable capture targets, and fleet sizing monetization metrics.
 */

import { detectProjectArchetype } from "./archetypeDetector";

export interface TamSamSomResult {
  title: string;
  tamValueText: string;
  samValueText: string;
  somValueText: string;
  targetSharePercent: string;
  narrativeMarkdown: string;
}

export function generateTamSamSomForTitle(
  rawTitle: string,
  division?: string
): TamSamSomResult {
  const title = (rawTitle || "").trim() || "Kajian Potensi Pasar Logistik TAM SAM SOM";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi Komersial").trim();

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
  const routeName = origin && dest ? `${origin} ke ${dest}` : "Koridor Strategis Proyek";

  let tamValueText = "";
  let samValueText = "";
  let somValueText = "";
  let targetSharePercent = "";
  let narrativeMarkdown = "";

  // 1. SEMEN / BULK CEMENT / CLINKER
  if (titleLower.includes("semen") || titleLower.includes("cement") || titleLower.includes("clinker") || titleLower.includes("klinker")) {
    tamValueText = "Rp 3.85 Triliun / Tahun (Nasional/Regional Jawa Timur & Madura)";
    samValueText = "Rp 850 Miliar / Tahun (Koridor Jalur Tol & Pantura)";
    somValueText = "Rp 98.4 Miliar / Tahun (Target Alokasi Armada Tahap I)";
    targetSharePercent = "11.5% dari SAM";

    narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro pengangkutan semen curah (*bulk cement*) dan klinker untuk proyek **"${title}"**:
  - **Volume Konsumsi Semen Regional:** Total penyerapan semen curah di Jawa Timur dan koridor sekitarnya mencapai kurang lebih **8.500.000 ton per tahun**, didorong oleh masifnya proyek infrastruktur pelabuhan, jalan tol, bendungan, dan industri beton pracetak (*precast*).
  - **Valuasi Pasar Makro (TAM):** Dengan rata-rata tarif angkut komersial logistik semen curah berkisar antara Rp 420.000 hingga Rp 480.000 per ton (tergantung jarak tempuh dan biaya bahan bakar), total nilai belanja jasa logistik semen (*TAM*) diestimasikan sebesar **Rp 3,85 Triliun per tahun**.
  - **Penggerak Utama Permintaan Makro:** Pertumbuhan konsumsi semen nasional rata-rata 4.5%–6.2% per tahun dengan peralihan signifikan kontraktor dari semen kantong ke semen curah silo demi efisiensi biaya pengecoran beton ready-mix.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
Porsi pasar yang secara realistis dapat dilayani sesuai dengan jangkauan izin trayek dan jalur operasional pada koridor **${routeName}**:
  - **Fokus Jangkauan Wilayah & Koridor Rute:** Koridor logistik langsung menghubungkan pabrik semen di Tuban menuju batching plant di Surabaya, Gresik, Sidoarjo, dan Pasuruan via Trans-Jawa Pantura dengan volume yang dapat dilayani sebesar **1.850.000 ton per tahun**.
  - **Kriteria Kepatuhan & Persyaratan Teknis:** Hanya mencakup pelanggan korporat (batching plant BUMN & swasta papan atas) yang mewajibkan sertifikasi K3 ketat, armada berstandar bebas ODOL (Over Dimension Over Load), dan kompresor unloader bertekanan tinggi (2.0 bar).
  - **Valuasi Pasar Terjangkau (SAM):** Nilai pasar yang memenuhi kualifikasi rute dan spesifikasi ini bernilai sebesar **Rp 850 Miliar per tahun**.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
Target perolehan pasar realistis yang dibidik oleh perusahaan pada fase operasional 1–3 tahun pertama:
  - **Target Volume Angkut Perusahaan:** Membidik penyerapan volume sebesar **210.000 ton per tahun** (setara rata-rata 17.500 ton per bulan).
  - **Pangsa Pasar (Market Share Capture):** Menargetkan penguasaan **11,5% pangsa pasar dari total SAM** koridor Tuban–Surabaya.
  - **Valuasi Perolehan Pasar Riil (SOM):** Proyeksi nilai kontrak tahunan (*Annual Contract Value - ACV*) yang dapat diamankan adalah sebesar **Rp 98,4 Miliar per tahun** (setara rata-rata Rp 8,2 Miliar per bulan).

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
Kalkulasi kapasitas armada operasional yang dibutuhkan untuk memenuhi target SOM:
  - **Kebutuhan Unit Armada:** 30 unit truk prime mover 6x4 berpasangan dengan trailer bejana semen curah (*bulk tanker*) kapasitas netto 30 ton.
  - **Target Ritase Armada:** Rata-rata 20–22 ritase per unit truk per bulan dengan siklus waktu tempuh (*Turnaround Time - TAT*) 11–13 jam per putaran PP.
  - **Struktur Biaya & Margin:** Estimasi margin kotor operasional (*Gross Operating Margin*) berkisar antara 18%–22% dengan skema kontrak tahunan terikat (*Take-or-Pay Guarantee*) yang melindungi arus kas dari fluktuasi volume.

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
Langkah konkret mengamankan target SOM sebesar Rp 98,4 Miliar per tahun:
  - **Kemitraan Eksklusif dengan Anchor Clients:** Mengamankan kontrak multi-tahun dengan 2 produsen semen Tier-1 dan 4 jaringan batching plant utama di Surabaya & Sidoarjo.
  - **Diferensiasi Unloader Berkecepatan Tinggi:** Menawarkan jaminan waktu bongkar di bawah 50 menit per 30 ton (menghemat waktu batching plant dibanding rata-rata kompetitor 90 menit).
  - **Transparansi e-POD Real-Time:** Integrasi sistem telemetri digital dan timbangan otomatis yang mempercepat proses rekonsiliasi pembayaran menjadi H+1 setelah serah terima semen.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Peluang pasar TAM, SAM, SOM untuk proyek **"${title}"** dinyatakan **Sangat Prospektif & Terukur (COMMERCIALLY VIABLE - APPROVED)**. Target SOM sebesar Rp 98,4 Miliar/tahun sangat realistis dicapai dengan alokasi armada 30 unit berutilisasi optimal.`;
  }

  // 2. NIKEL / NICKEL ORE / SMELTER
  else if (titleLower.includes("nikel") || titleLower.includes("nickel") || titleLower.includes("smelter") || titleLower.includes("laterit")) {
    tamValueText = "Rp 14.2 Triliun / Tahun (Klaster Smelter Sulawesi & Maluku Utara)";
    samValueText = "Rp 2.45 Triliun / Tahun (Koridor Hauling Pit-to-Jetty & Smelter Kawasan Industri)";
    somValueText = "Rp 185.6 Miliar / Tahun (Alokasi 50 Unit Dump Truck Hauling)";
    targetSharePercent = "7.6% dari SAM";

    narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro jasa pengangkutan bijih nikel laterit (*nickel ore hauling*) untuk proyek **"${title}"**:
  - **Total Produksi Bijih Nikel Regional:** Penyerapan bijih nikel domestik untuk memasok smelter Rotary Kiln Electric Furnace (RKEF) dan High Pressure Acid Leach (HPAL) mencapai lebih dari **110.000.000 ton wet metric ton (wmt) per tahun**.
  - **Valuasi Pasar Makro (TAM):** Dengan rata-rata tarif hauling jalan tambang dan jalan koridor industri berkisar antara USD 7.5 s.d USD 9.5 per ton, total nilai belanja logistik hauling nikel nasional mencapai **Rp 14,2 Triliun per tahun**.
  - **Daya Dorong Pasar:** Mandat hilirisasi nikel pemerintah dan lonjakan kebutuhan bahan baku baterai kendaraan listrik (EV) serta baja nirkarat (*stainless steel*).

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
Batas pasar yang dapat dilayani sesuai konsesi izin tambang dan kedekatan smelter:
  - **Jangkauan Koridor Operasional:** Jalur hauling khusus tambang dari front pit penambangan menuju stockpile pelabuhan jetty dan bunker smelter dengan radius jalan angkut 15–45 km, mencakup volume pasar terjangkau sebesar **18.000.000 ton wmt per tahun**.
  - **Filter Regulasi & Kelaikan Teknis:** Kepatuhan ketat terhadap Kaidah Teknik Pertambangan yang Baik (Kepmen ESDM 1827), integrasi sistem SIMBARA, dan sertifikasi keselamatan Driver Safety System (DSS).
  - **Valuasi Pasar Terjangkau (SAM):** Bernilai sebesar **Rp 2,45 Triliun per tahun**.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
Target perolehan pasar realistis yang dibidik oleh perusahaan:
  - **Target Tonase Tahunan:** Membidik penanganan volume hauling sebesar **1.400.000 ton wmt per tahun** (setara 116.000 ton per bulan).
  - **Pangsa Pasar (Market Share Capture):** Menargetkan **7,6% pangsa pasar dari total SAM** pada konsesi target.
  - **Valuasi Perolehan Pasar Riil (SOM):** Target pendapatan tahunan (*Annual Revenue*) sebesar **Rp 185,6 Miliar per tahun**.

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
  - **Kebutuhan Unit Armada:** 50 unit Heavy Dump Truck 6x4 (kapasitas muat 30–35 ton) dengan spesifikasi heavy-duty mining.
  - **Siklus Ritase:** Operasional 2 shift 24 jam dengan target rata-rata 3.500–4.000 ritase gabungan per bulan.
  - **Struktur Kontrak:** Kontrak jangka panjang 3 tahun (*hauling service agreement*) dengan formula penyesuaian tarif BBM industri bulanan dan insentif pemenuhan target kadar air (*moisture limit*).

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
  - **Integrasi FMS & AI Safety Camera:** Keunggulan teknologi pemantau kelelahan pengemudi yang menekan angka insiden kecelakaan tambang menjadi 0 insiden.
  - **Tingkat Ketersediaan Armada Tinggi (PA > 90%):** Tim mekanik onsite dan bengkel lapangan bergerak (*mobile workshop*) yang menjamin dump truck selalu siap bekerja.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Studi potensi pasar untuk proyek **"${title}"** dinyatakan **Sangat Layak & Berpotensi Menghasilkan Laba Berkelanjutan (HIGHLY FEASIBLE - APPROVED)**.`;
  }

  // 3. BATUBARA / COAL HAULING
  else if (titleLower.includes("batubara") || titleLower.includes("coal") || titleLower.includes("hauling batubara")) {
    tamValueText = "Rp 21.5 Triliun / Tahun (Koridor Pertambangan Batubara Sumatera & Kalimantan)";
    samValueText = "Rp 3.10 Triliun / Tahun (Jalur Hauling Khusus Tambang ke Pelabuhan Jetty)";
    somValueText = "Rp 210.0 Miliar / Tahun (Target Alokasi 60 Unit Double Trailer / Dump Truck)";
    targetSharePercent = "6.8% dari SAM";

    narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro jasa hauling batubara untuk proyek **"${title}"**:
  - **Total Volume Produksi Batubara Nasional:** Produksi batubara Indonesia melampaui **680.000.000 ton per tahun**, dengan kebutuhan transportasi darat dari tambang menuju pelabuhan muat sungai (*jetty/barge loading port*).
  - **Valuasi Pasar Makro (TAM):** Total belanja jasa logistik hauling batubara diestimasikan mencapai **Rp 21,5 Triliun per tahun**.
  - **Pendorong Pasar Utama:** Permintaan stabil PLTU domestik (DMO) dan pasar ekspor Asia (Tiongkok, India, dan ASEAN).

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
  - **Jangkauan Koridor Jalan Khusus:** Koridor jalan angkut batubara (*dedicated hauling road*) sepanjang 30–80 km yang menghubungkan stockpile tambang dengan terminal tongkang dermaga jetty, dengan volume terjangkau **28.000.000 ton per tahun**.
  - **Kualifikasi Kemitraan:** Transporter wajib memiliki sertifikasi K3 pertambangan (SMKP Minerba) dan integrasi sistem pemantauan kecepatan otomatis.
  - **Valuasi Pasar Terjangkau (SAM):** Diestimasikan sebesar **Rp 3,10 Triliun per tahun**.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
  - **Target Volume Angkut Perusahaan:** Mengamankan kontrak pengangkutan sebesar **2.000.000 ton per tahun** (setara 166.000 ton per bulan).
  - **Pangsa Pasar (Market Share Capture):** Penguasaan **6,8% dari total SAM** pada koridor jalan tambang target.
  - **Valuasi Perolehan Pasar Riil (SOM):** Proyeksi pendapatan kotor mencapai **Rp 210,0 Miliar per tahun**.

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
  - **Kebutuhan Unit Armada:** 60 unit Heavy Hauler Dump Truck / Double Trailer (kapasitas 35–60 ton).
  - **Rotasi Unit:** 24 jam nonstop dengan sistem 2 supir per truk dan pergantian shift cepat.
  - **Margin Keuntungan:** Estimasi margin operasi bersih berkisar 16%–20%.

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
  - **Kontrak Take-or-Pay Jangka Panjang:** Perjanjian pengangkutan minimal 3 tahun dengan jaminan kuota tonase minimum bulanan dari pemegang PKP2B/IUP.
  - **Efisiensi Bongkar Cepat di Hopper Jetty:** Penggunaan mekanisme dump berkecepatan tinggi yang memangkas antrean di dermaga.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Analisis potensi pasar proyek **"${title}"** dinyatakan **Sangat Kuat & Layak Diinvestasikan (COMMERCIALLY SOUND - APPROVED)**.`;
  }

  // 4. FORESTRY / KEHUTANAN / KAYU / PULP & PAPER
  else if (titleLower.includes("forestry") || titleLower.includes("kehutanan") || titleLower.includes("kayu") || titleLower.includes("log") || titleLower.includes("pulp") || titleLower.includes("timber")) {
    tamValueText = "Rp 5.20 Triliun / Tahun (Sektor Hutan Tanaman Industri Nasional)";
    samValueText = "Rp 1.15 Triliun / Tahun (Konsesi HTI & Koridor Log Yard Pabrik Kertas)";
    somValueText = "Rp 115.0 Miliar / Tahun (Target Armada Logging Trailer Tahap I)";
    targetSharePercent = "10.0% dari SAM";

    narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro transportasi kayu log hasil hutan tanaman industri (HTI) untuk proyek **"${title}"**:
  - **Volume Penebangan Kayu Industri Nasional:** Pasokan kayu serat (*pulpwood*) untuk industri bubur kertas dan kertas mencapai lebih dari **45.000.000 m³ per tahun**.
  - **Valuasi Pasar Makro (TAM):** Belanja logistik pengangkutan kayu log darat dan air diestimasikan mencapai **Rp 5,20 Triliun per tahun**.
  - **Faktor Penggerak:** Tingginya permintaan kertas kemasan (*packaging*), karton bergelombang, dan tisu global.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
  - **Wilayah Konsesi & Log Yard:** Koridor jalan logging dari Tempat Penimbunan Kayu (TPn) menuju log yard pabrik kertas terintegrasi, dengan potensi pasar sebesar **10.000.000 m³ per tahun**.
  - **Kepatuhan Legalitas:** Wajib terintegrasi dengan e-SVLK, sertifikasi FSC/PEFC, dan pemantauan satelit di area blank spot.
  - **Valuasi Pasar Terjangkau (SAM):** Bernilai sebesar **Rp 1,15 Triliun per tahun**.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
  - **Target Volume Angkut:** Mengamankan volume sebesar **1.000.000 m³ per tahun** (setara 83.000 m³ per bulan).
  - **Pangsa Pasar (Market Share Capture):** Menargetkan **10,0% pangsa pasar dari total SAM** konsesi.
  - **Valuasi Perolehan Pasar Riil (SOM):** Proyeksi nilai kontrak sebesar **Rp 115,0 Miliar per tahun**.

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
  - **Kebutuhan Unit Armada:** 40 unit Logging Truck 6x4 dengan bolster kokoh dan derek penarik beban lumpur (*winch*).
  - **Kondisi Jalan:** 80% jalan tanah berlumpur yang menuntut spesifikasi gardan ganda dan ban berpola off-road khusus.

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
  - **Kemitraan Strategis dengan Raksasa Pulp & Paper:** Mengunci kontrak jangka panjang sebagai mitra pengangkut resmi (*core dedicated transporter*).
  - **Jaminan Kesegaran Serat Kayu (Fresh Wood SLA):** Waktu tempuh maksimal 36 jam dari tebang hingga masuk log yard.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Potensi pasar untuk proyek **"${title}"** dinilai **Sangat Layak & Memiliki Kepastian Volume Tinggi (APPROVED - HIGH DEMAND)**.`;
  }

  // 5. CPO / MINYAK SAWIT
  else if (titleLower.includes("cpo") || titleLower.includes("sawit") || titleLower.includes("palm oil") || titleLower.includes("minyak")) {
    tamValueText = "Rp 8.75 Triliun / Tahun (Logistik Minyak Sawit Mentah Nasional)";
    samValueText = "Rp 1.40 Triliun / Tahun (Koridor PKS ke Bulking Station & Refinery Pelabuhan)";
    somValueText = "Rp 105.0 Miliar / Tahun (Alokasi 35 Unit Tangki Stainless Steel)";
    targetSharePercent = "7.5% dari SAM";

    narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro logistik angkutan Crude Palm Oil (CPO) untuk proyek **"${title}"**:
  - **Total Produksi CPO Nasional:** Indonesia memproduksi sekitar **48.000.000 ton CPO per tahun**, seluruhnya membutuhkan transportasi dari Pabrik Kelapa Sawit (PKS) menuju tangki timbun pelabuhan atau pabrik pengolahan (*refinery*).
  - **Valuasi Pasar Makro (TAM):** Nilai pasar jasa transportasi tangki darat CPO mencapai **Rp 8,75 Triliun per tahun**.
  - **Pendorong Pasar:** Program mandatori biodiesel (B35/B40) dan permintaan ekspor minyak nabati dunia.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
  - **Koridor Geografis Terjangkau:** Rute darat dari klaster perkebunan PKS menuju pelabuhan ekspor dengan volume pasar yang dapat dilayani sebesar **6.500.000 ton per tahun**.
  - **Persyaratan Higienitas & Mutu:** Tangki stainless steel food-grade bersertifikasi ISPO/RSPO dengan tingkat toleransi penyusutan volume di bawah 0.1%.
  - **Valuasi Pasar Terjangkau (SAM):** Bernilai sebesar **Rp 1,40 Triliun per tahun**.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
  - **Target Volume Penanganan:** Membidik volume angkut sebesar **480.000 ton per tahun** (setara 40.000 ton per bulan).
  - **Pangsa Pasar (Market Share Capture):** Menargetkan **7,5% pangsa pasar dari total SAM** pada koridor target.
  - **Valuasi Perolehan Pasar Riil (SOM):** Nilai kontrak tahunan sebesar **Rp 105,0 Miliar per tahun**.

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
  - **Kebutuhan Unit Armada:** 35 unit truk tangki kapasitas 25–30 ton dengan sistem pemanas (*steam coil*) dan segel elektronik (*e-Seal*).
  - **Siklus Ritase:** Rata-rata 18–20 ritase per unit per bulan.

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
  - **Jaminan Zero Shrinkage & Zero Contamination:** Garansi penggantian nilai minyak jika terjadi penurunan kualitas kadar FFA.
  - **Pelacakan Suhu Real-Time:** Monitoring suhu kargo tangki secara digital yang dapat dipantau langsung oleh pemilik PKS.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Potensi pasar untuk proyek **"${title}"** dinyatakan **Sangat Solid & Menguntungkan (APPROVED - COMMERCIALLY VIABLE)**.`;
  }

  // 6. GENERAL / ARCHETYPE BASED (Manufacturing, Personal Business/SME, or Commercial Logistics)
  else {
    const archetype = detectProjectArchetype(title);

    if (archetype === 'manufacturing') {
      tamValueText = "Rp 15.0 Triliun / Tahun (Pasar Produk Industri Manufaktur Terkait Domestik)";
      samValueText = "Rp 2.2 Triliun / Tahun (Jangkauan Koridor Jaringan Distributor & Wholesaler)";
      somValueText = "Rp 220 Miliar / Tahun (Target Penetrasi Kapasitas Optimal Pabrik)";
      targetSharePercent = "10.0% dari SAM";

      narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi pasar makro produk manufaktur untuk proyek **"${title}"**:
  - **Valuasi Pasar Makro (TAM):** Total belanja pasar domestik untuk kategori produk industri terkait diestimasikan mencapai **Rp 15,0 Triliun per tahun**, didorong oleh kebutuhan industri hilir dan jaringan distributor nasional.
  - **Penggerak Pertumbuhan:** Pertumbuhan sektor manufaktur rata-rata 5.5%–7.0% per tahun dengan program substitusi impor pemerintah.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Jaringan Distribusi)
Porsi pasar yang secara realistis dapat dijangkau oleh jaringan distribusi fasilitas produksi:
  - **Jangkauan Wilayah & Pelanggan:** Terfokus pada jaringan distributor regional, agen besar, dan industri perakitan dengan estimasi nilai pasar sebesar **Rp 2,2 Triliun per tahun**.
  - **Kriteria Kualifikasi:** Pelanggan B2B korporat yang membutuhkan pasokan berkala, sertifikasi ISO 9001, dan jaminan stabilitas harga kontrak.

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
Target penguasaan pasar yang realistis dipenuhi oleh kapasitas terpasang lini pabrik:
  - **Pangsa Pasar (Market Share Capture):** Membidik penetrasi sebesar **10,0% dari total SAM**.
  - **Valuasi Perolehan Pasar Riil (SOM):** Target perolehan omset tahunan sebesar **Rp 220 Miliar per tahun** saat kapasitas beroperasi optimal.

### 4. Rincian Metrik Finansial & Kapasitas Lini Pabrik
  - **Kapasitas Terpasang:** 120.000 unit/batch per bulan dengan sistem 2 shift kerja.
  - **Target Utilisasi:** 88.5% kapasitas optimal terpasang dengan target reject rate < 1.5%.

### 5. Strategi Akuisisi Pasar & Konversi Kontrak
  - **Kemitraan Distributor Utama (Tier-1):** Mengikat 6 distributor regional dengan kontrak pasokan tahunan.
  - **Fasilitas Kontrak Maklon (OEM):** Membuka slot kapasitas untuk pemilik brand swasta.

### 6. Rekomendasi Eksekutif Kesiapan Komersial
Potensi pasar TAM, SAM, SOM untuk proyek pabrik **"${title}"** dinyatakan **Sangat Solid, Terukur & Sangat Layak Investasi (APPROVED - GO)**.`;
    } else if (archetype === 'personal_sme') {
      tamValueText = "Rp 85 Miliar / Tahun (Total Potensi Belanja Konsumen Produk Terkait Kota/Kabupaten)";
      samValueText = "Rp 12 Miliar / Tahun (Populasi Konsumen di Radius Layanan 3 - 5 KM)";
      somValueText = "Rp 1.14 Miliar / Tahun (Target Omset Tahunan Unit Usaha Mandiri)";
      targetSharePercent = "9.5% dari SAM";

      narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi potensi pasar konsumen untuk unit usaha mandiri **"${title}"**:
  - **Valuasi Pasar Konsumen Kota (TAM):** Total pengeluaran masyarakat kota/kabupaten pada kategori produk/jasa terkait diestimasikan mencapai **Rp 85 Miliar per tahun**, didorong oleh peningkatan daya beli dan gaya hidup lokal.
  - **Karakteristik Pasar:** Permintaan stabil setiap hari dengan peningkatan transaksi pada akhir pekan dan hari libur nasional.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau Radius 3 - 5 KM)
Porsi pasar yang secara langsung dapat mengakses tempat usaha secara fisik:
  - **Jangkauan Wilayah:** Penduduk, pekerja, dan pelajar yang berada dalam radius 3 - 5 KM dari lokasi usaha dengan potensi belanja sebesar **Rp 12 Miliar per tahun**.
  - **Profil Pelanggan:** Konsumen yang mengutamakan kemudahan akses lokasi, kebersihan tempat, dan pelayanan cepat.

### 3. Serviceable Obtainable Market - SOM (Target Omset Riil Usaha Mandiri)
Target penguasaan omset yang realistis dicapai oleh unit usaha:
  - **Pangsa Pasar (Market Share Capture):** Membidik perolehan **9,5% dari SAM lokal**.
  - **Valuasi Perolehan Pasar Riil (SOM):** Target omset tahunan sebesar **Rp 1,14 Miliar per tahun** (setara rata-rata omset Rp 95,4 Juta per bulan atau 120 transaksi harian).

### 4. Rincian Metrik Operasional Harian
  - **Target Kunjungan:** 110 - 125 transaksi per hari dengan nilai rata-rata belanja Rp 26.500 per transaksi.
  - **Waktu Layanan:** Rata-rata di bawah 5 menit per pelanggan didukung sistem kasir QRIS digital.

### 5. Strategi Akuisisi Pelanggan & Promosi Komunitas
  - **Pemasaran Hyperlocal:** Optimasi profil Google Maps bintang 4.8+ dan konten video media sosial lokal.
  - **Program Kartu Stempel Loyalitas:** Mendorong frekuensi pembelian berulang hingga 3 kali per bulan per pelanggan.

### 6. Rekomendasi Eksekutif Kesiapan Komersial
Potensi pasar TAM, SAM, SOM untuk proyek usaha mandiri **"${title}"** dinyatakan **Sangat Prospektif & Sangat Layak Dijalankan (APPROVED - GO)**.`;
    } else {
      tamValueText = "Rp 6.40 Triliun / Tahun (Pasar Angkutan Darat & Kargo Komersial Koridor Terkait)";
      samValueText = "Rp 980 Miliar / Tahun (Klaster Industri & Pelanggan Korporasi Terjangkau)";
      somValueText = "Rp 88.5 Miliar / Tahun (Target Tahap Penetrasi Awal Armada)";
      targetSharePercent = "9.0% dari SAM";

      narrativeMarkdown = `### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
Estimasi ukuran pasar logistik dan transportasi komersial untuk proyek **"${title}"** pada koridor **${routeName}**:
  - **Total Pasar Jasa Logistik Darat Terkait:** Total belanja pengangkutan barang dan kargo pada sektor dan koridor terkait diestimasikan mencapai **Rp 6,40 Triliun per tahun**, didorong oleh mobilitas arus barang antarkota dan kawasan industri terpadu.
  - **Pertumbuhan Sektor Logistik Nasional:** Sektor transportasi dan pergudangan tumbuh stabil pada kisaran 7.8%–9.2% per tahun sejalan dengan ekspansi manufaktur dan perdagangan nasional.
  - **Kebutuhan Layanan Terpadu:** Klien korporasi semakin menuntut transporter profesional yang menawarkan keandalan ketepatan waktu (*On-Time Delivery*), jaminan keselamatan, dan sistem pelacakan digital terintegrasi.

### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
Porsi pasar yang realistis dapat dijangkau berdasarkan rute koridor dan kemampuan perizinan operasional:
  - **Fokus Jangkauan Wilayah & Pelanggan:** Terfokus pada klaster kawasan industri dan pusat distribusi utama pada koridor **${routeName}** dengan estimasi nilai pasar sebesar **Rp 980 Miliar per tahun**.
  - **Kriteria Kualifikasi:** Pelanggan B2B korporat yang membutuhkan standar kontrak jangka panjang (1–3 tahun), kepatuhan standar K3LL tinggi, dan sistem surat jalan digital (*e-POD*).

### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
Target penguasaan pasar yang realistis dan dapat dimenangkan oleh perusahaan:
  - **Pangsa Pasar (Market Share Capture):** Membidik penetrasi pasar sebesar **9,0% dari total SAM** pada koridor target.
  - **Valuasi Perolehan Pasar Riil (SOM):** Target perolehan pendapatan tahunan (*Annual Revenue*) sebesar **Rp 88,5 Miliar per tahun** (setara rata-rata Rp 7,37 Miliar per bulan).

### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
  - **Kebutuhan Alokasi Armada:** 25–30 unit truk prime mover / box komersial dengan spesifikasi modern.
  - **Target Utilisasi:** Tingkat utilisasi armada (*Fleet Utilization Rate*) ditargetkan mencapai 88%–92% dengan perawatan berkala terencana.
  - **Model Kontrak:** Kombinasi kontrak sewa terikat bulanan (*dedicated fleet contract*) dan tarif berbasis ritase per kilometer (*tariff per trip*).

### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
  - **Penetrasi Akun Kunci (Key Account Management):** Menargetkan 5 perusahaan manufaktur terkemuka sebagai klien jangkar (*anchor clients*).
  - **Keunggulan Transparansi Digital:** Menyediakan dashboard monitoring posisi armada dan estimasi kedatangan (ETA) secara transparan kepada mitra pelanggan.
  - **Klausul Kontrak Berkelanjutan:** Penyusunan klausul tarif berkeadilan yang melindungi kedua belah pihak dari kenaikan harga BBM dan biaya tol.

### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
Potensi pasar TAM, SAM, SOM untuk proyek **"${title}"** dinyatakan **Sangat Kuat, Terukur, & Memenuhi Ambang Batas Kelayakan Investasi (APPROVED - GO)**.`;
    }
  }

  return {
    title,
    tamValueText,
    samValueText,
    somValueText,
    targetSharePercent,
    narrativeMarkdown
  };
}
