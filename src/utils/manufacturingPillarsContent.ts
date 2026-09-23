/**
 * Manufacturing & Industrial Production Content & Visual Generator for 17 Pillars
 * Tailored for Factory, Assembly, Fabrication, Processing, Food/Beverage, AMDK, Garment, and Industrial Operations.
 */

export function generateManufacturingDefaultContent(num: number, title: string, projectTitle: string, shortDesc?: string): string {
  const pName = projectTitle || "Kajian Strategis Manufaktur & Pabrik";
  switch(num) {
    case 1:
      return `### 1. Global/NAT Overview\n\n` +
        `**1.1 Latar Belakang Makro & Konteks Industri Nasional**\n` +
        `Kajian komprehensif untuk proyek **${pName}** berakar pada peta jalan hilirisasi industri nasional (*Making Indonesia 4.0*), peningkatan substitusi produk impor, dan pemenuhan standar mutu manufaktur terakreditasi. Sektor manufaktur memegang peranan vital dalam menyerap tenaga kerja lokal dan meningkatkan nilai tambah produk domestik.\n\n` +
        `**1.2 Analisis Lanskap Industri & Rantai Pasok Hulu-Hilir**\n` +
        `- **Kemudahan Akses Bahan Baku:** Sinergi dengan pemasok hulu domestik dan global guna menjamin kontinuitas pasokan material tanpa hambatan keterlambatan lini produksi.\n` +
        `- **Adopsi Standar Industri Modern:** Penerapan prinsip *Lean Manufacturing* dan otomatisasi parsial guna meminimalkan pemborosan (*waste*) material dan konsumsi energi.\n` +
        `- **Daya Saing Nilai Tambah:** Membangun keunggulan komparatif produk melalui konsistensi presisi hasil olahan dan harga jual yang kompetitif bagi pasar grosir/distributor.\n\n` +
        `**1.3 Kepatuhan Standar & Regulasi Sektoral (Industrial Compliance Matrix)**\n` +
        `- **Standar Mutu Internasional:** Sertifikasi penuh **ISO 9001:2015** (Sistem Manajemen Mutu Manufaktur) untuk konsistensi batch produk (100% kepatuhan audit).\n` +
        `- **Pengelolaan Lingkungan & Emisi:** Penerapan **ISO 14001:2015** dan kepatuhan AMDAL / UKL-UPL terkait baku mutu limbah cair, padat, dan emisi cerobong pabrik.\n` +
        `- **Keselamatan & Kesehatan Kerja (K3):** Sertifikasi **ISO 45001:2018** & SMK3 Kemenaker dengan komitmen target **Zero Accident** (Nol Kecelakaan Kerja).\n` +
        `- **Target Efisiensi Lini Pabrik (OEE):** Overall Equipment Effectiveness ditargetkan mencapai minimal **85.2%** *(Detail Perhitungan %: Rasio Ketersediaan Mesin 92.5% × Kinerja Kecepatan Lini 95.0% × Rasio Produk Lulus Mutu 97.0% = 85.2% OEE standar industri manufaktur kelas dunia)* dengan toleransi cacat produk (reject rate) maksimal di bawah 1.5%.\n\n` +
        `**1.4 Kesimpulan & Eksekusi Pilar**\n` +
        `Pilar pertama ini menetapkan fondasi makro industri yang memastikan fasilitas produksi **${pName}** beroperasi dengan integritas kepatuhan hukum, keamanan lingkungan hidup, dan produktivitas terukur.`;

    case 2:
      return `### 2. Market Opportunity\n\n` +
        `**2.1 Analisis Permintaan Pasar (Market Demand)**\n` +
        `Analisis pasar pada proyek **${pName}** mengindikasikan tingginya kebutuhan pasokan B2B dari distributor regional, jaringan retail modern, dan industri hilir perakitan yang membutuhkan kepastian volume, stabilitas harga, dan kontinuitas pasokan berkala.\n\n` +
        `**2.2 Kesenjangan Pasar & Peluang Diferensiasi**\n` +
        `- **Keterbatasan Produsen Lama:** Pesaing konvensional sering mengalami inkonsistensi toleransi mutu batch dan *lead time* produksi yang lambat (di atas 14 hari kerja).\n` +
        `- **Tingginya Minat Kontrak Maklon & OEM:** Minat tinggi dari pemilik merek dagang (*brand owner*) untuk kontrak maklon pasokan jangka panjang dengan kapasitas terjamin.\n` +
        `- **Potensi Skala Ekonomi Pabrik:** Pengadaan bahan baku skala grosir langsung dari pabrikan hulu dan otomatisasi lini memberikan margin efisiensi biaya produksi hingga **18.5% - 24.0%** *(Detail Asal %: Penghematan pembelian bahan baku partai besar 12.5% + penghematan efisiensi energi listrik mesin baru 6.0% - 11.5% = akumulasi penghematan 18.5% - 24.0%)*.\n\n` +
        `**2.3 Proyeksi Pertumbuhan Sektor Manufaktur**\n` +
        `Tingkat pertumbuhan tahunan gabungan (CAGR) pasar produk industri terkait diestimasikan sebesar **10.8%** *(Detail Asal %: Berdasarkan data tren pertumbuhan indeks output industri manufaktur non-migas BPS dan Kementerian Perindustrian)*, membuka ruang ekspansi kapasitas yang sangat terukur.`;

    case 3:
      return `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)\n\n` +
        `**3.1 Struktur Pengeluaran Modal (CAPEX)**\n` +
        `- **Mesin Produksi Utama & Lini Perakitan:** Pengadaan unit mesin pemroses, conveyor otomatis, dan cetakan industri sebesar Rp 3.200.000.000 (**75.1%** - *Detail %: Rp 3.200.000.000 / Total CAPEX Rp 4.260.000.000 × 100% = 75.12%*).\n` +
        `- **Infrastruktur Utilitas Pabrik:** Instalasi panel daya listrik 3-phasa industri, genset cadangan, kompresor udara, dan sistem tata udara sebesar Rp 450.000.000 (**10.6%** - *Detail %: Rp 450.000.000 / Total CAPEX Rp 4.260.000.000 × 100% = 10.56%*).\n` +
        `- **Fasilitas Bangunan Pabrik, Gudang & Perizinan:** Renovasi area produksi bersih, rak penyimpanan pallet, instalasi IPAL limbah, dan legalitas IUI sebesar Rp 610.000.000 (**14.3%** - *Detail %: Rp 610.000.000 / Total CAPEX Rp 4.260.000.000 × 100% = 14.32%*).\n` +
        `- **Total Grand CAPEX:** **Rp 4.260.000.000** (**100.0%**; Struktur modal: 35% Modal Kas Internal / 65% Fasilitas Kredit Investasi Perbankan).\n\n` +
        `**3.2 Struktur Biaya Operasional (OPEX) Bulanan**\n` +
        `- **Bahan Baku Utama & Bahan Penolong:** Rp 155.000.000 / bulan (53.4% dari total OPEX bulanan).\n` +
        `- **Gaji Tim Produksi, Teknisi, QC & Staf Pabrik:** Rp 72.000.000 / bulan (24.8% dari total OPEX bulanan).\n` +
        `- **Utilitas Energi (Listrik Industri, Air & Bahan Bakar):** Rp 38.000.000 / bulan (13.1% dari total OPEX bulanan).\n` +
        `- **Perawatan Mesin, Spare Part & Overhead Kantor:** Rp 25.000.000 / bulan (8.6% dari total OPEX bulanan).\n` +
        `- **Total OPEX Bulanan:** **Rp 290.000.000** (100.0%).\n\n` +
        `**3.3 Proyeksi Laba/Rugi (P&L) & Pengembalian Investasi (ROI)**\n` +
        `- **Tahun 1:** Pendapatan Rp 5.200.000.000 | EBITDA Rp 1.638.000.000 (**31.5%** margin) | Laba Bersih Rp 1.050.000.000 (**20.2%** net margin).\n` +
        `- **Tahun 2:** Pendapatan Rp 6.450.000.000 | EBITDA Rp 2.140.000.000 (**33.2%** margin) | Laba Bersih Rp 1.450.000.000 (**22.5%** net margin).\n` +
        `- **Tahun 3:** Pendapatan Rp 7.800.000.000 | EBITDA Rp 2.690.000.000 (**34.5%** margin) | Laba Bersih Rp 1.920.000.000 (**24.6%** net margin).\n` +
        `- **Metrik Finansial Investasi:** Payback Period tercapai dalam **2.2 Tahun**, Internal Rate of Return (IRR) sebesar **25.4%** *(Detail: Melampaui suku bunga kredit komersial 9.5% dengan premi risiko industri yang sehat)*, dan Net Present Value (NPV) positif Rp 2.180.000.000.`;

    case 4:
      return `### 4. Supply & Demand\n\n` +
        `**4.1 Keseimbangan Kapasitas Terpasang vs Permintaan Pasar**\n` +
        `Kapasitas terpasang lini produksi dirancang sebesar **120.000 unit/pcs/kg per bulan** (beroperasi 2 shift kerja harian). Proyeksi serapan permintaan tahap awal dari jaringan distributor berada pada angka **106.200 unit per bulan** atau tingkat utilisasi pabrik sebesar **88.5%** *(Detail Perhitungan %: Volume Order 106.200 unit / Kapasitas Maksimal 120.000 unit × 100% = 88.50% tingkat utilisasi kapasitas terpasang)*.\n\n` +
        `**4.2 Parameter Kinerja & Pengendalian Persediaan**\n` +
        `- **Target Reject Rate Lini:** Maksimal di bawah **1.45%** *(Detail Perhitungan %: Maksimal 14-15 unit cacat dari setiap 1.000 unit yang diproduksi, dengan seluruh material reject didaur ulang/rework terstandar)*.\n` +
        `- **Safety Stock Bahan Baku:** Persediaan penyangga bahan baku di gudang diamankan untuk kebutuhan produksi minimal **21 Hari Kerja** guna mengantisipasi keterlambatan kapal/truk pemasok hulu.\n` +
        `- **Perputaran Persediaan (Inventory Turnover):** Target perputaran barang jadi di gudang minimal **8.5 kali per tahun** guna meminimalkan modal kerja yang mengendap.`;

    case 5:
      return `### 5. Organization (Qualification, Skill, Output/KPI, SOP)\n\n` +
        `**5.1 Struktur Tim Inti Operasional Pabrik**\n` +
        `Operasional pabrik didukung oleh total **42 personel**: 1 Plant Manager, 1 QA/QC Manager, 2 Supervisor Produksi, 2 Teknisi Pemeliharaan Mesin, 4 Petugas QC Line, dan 32 Operator Lini Perakitan Terlatih.\n\n` +
        `**5.2 Kualifikasi & Sertifikasi Tenaga Kerja**\n` +
        `- **Teknisi & Maintenance:** Wajib memiliki sertifikasi kelistrikan industri, pemeliharaan pneumatik/hidrolik, dan sertifikasi K3 Operator Mesin Kemenaker.\n` +
        `- **Inspector Quality Control:** Memiliki keahlian kalibrasi alat ukur presisi, uji toleransi dimensi, dan pemahaman metode sampling ISO 2859-1.\n` +
        `- **Operator Mesin Produksi:** Lulus program pelatihan internal *Standard Operating Procedure (SOP)* dan kepatuhan budaya kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin).\n\n` +
        `**5.3 Key Performance Indicators (KPI) & Output Kerja**\n` +
        `- **Pencapaian Jadwal Produksi (OTIF):** Target On-Time In-Full minimal **98.8%** *(Detail %: Rasio 395 batch selesai tepat waktu dari target 400 batch bulanan)*.\n` +
        `- **Tingkat Kepatuhan K3:** 100% jam kerja aman tanpa *Lost Time Injury (LTI)*.`;

    case 6:
      return `### 6. Transition Model (Pre-On-Post)\n\n` +
        `**6.1 Tahap Pre-Commissioning (Bulan 1 - 2)**\n` +
        `- Instalasi fondasi mesin, instalasi daya listrik PLN 3-phasa, commissioning uji tanpa beban (*dry run*), dan kalibrasi sensor keamanan.\n` +
        `- Audit awal kelayakan fasilitas oleh dinas perindustrian, perolehan sertifikasi laik operasi mesin, dan pelatihan teknis operator.\n\n` +
        `**6.2 Tahap Pilot Run & Uji Coba Batch (Bulan 3)**\n` +
        `- Menjalankan produksi percobaan pada kapasitas **50.0%** *(Detail %: 60.000 unit output per bulan untuk memvalidasi toleransi cetakan, kestabilan suhu, dan daya rekat bahan)*.\n` +
        `- Uji laboratorium independen sampel produk dan pengiriman contoh produk (*free sample trial*) ke 10 calon distributor utama.\n\n` +
        `**6.3 Tahap Full Commercial Production & Ramp-Up (Bulan 4 dst.)**\n` +
        `- Peningkatan kecepatan lini ke kapasitas optimal **88.5% - 95.0%** dengan penerapan sistem shift penuh dan monitoring OEE otomatis.`;

    case 7:
      return `### 7. Go To Market Strategy\n\n` +
        `**7.1 Segmentasi & Target Kanal Distribusi**\n` +
        `- **Distributor Besar B2B (Tier-1):** Kemitraan eksklusif dengan 6 distributor regional dengan komitmen kuota pengambilan minimal bulanan.\n` +
        `- **Jaringan Modern Trade & Industri Perakitan:** Penetrasi langsung ke pabrikan pengguna akhir dan jaringan retail modern dengan kemasan siap jual.\n` +
        `- **Layanan Kontrak Maklon (OEM/ODM):** Menyediakan slot kapasitas khusus bagi pemilik merek swasta dengan margin yang menguntungkan.\n\n` +
        `**7.2 Skema Penetapan Harga & Diskon Volume**\n` +
        `- **Struktur Harga Kompetitif:** Penetapan harga jual grosir **8.5% - 12.0% di bawah harga pasar pesaing impor** berkat efisiensi biaya logistik bahan baku lokal dan fasilitas perizinan domestik.\n` +
        `- **Tiered Volume Discount:** Potongan harga 2.5% untuk pembelian di atas 1 kontainer dan syarat pembayaran Term of Payment (TOP) 30 hari bagi klien bereputasi prima.`;

    case 8:
      return `### 8. Ops Model (Flow Process, Workflow Diagram, SLA)\n\n` +
        `**8.1 Diagram Alur Proses Manufaktur Terpadu**\n` +
        `1. **Penerimaan Bahan Baku (Inbound Dock):** Penimbangan material, verifikasi surat jalan, dan uji sampling laboratorium QC Inbound (SLA < 90 Menit).\n` +
        `2. **Penyimpanan Gudang Bahan Mentah (Raw Material Storage):** Penataan dengan sistem FIFO (First-In, First-Out) dan penandaan label barcode.\n` +
        `3. **Lini Pemrosesan & Fabrikasi (Main Production Line):** Pencampuran bahan, pemesinan presisi, perakitan komponen, dan pengeringan/curing.\n` +
        `4. **Pemeriksaan Mutu Lini (In-Line & Outbound QC):** Pengujian ketahanan fisik, toleransi ukuran, dan visual inspection tanpa cacat.\n` +
        `5. **Finishing & Kemasan Akhir (Packaging & Boxing):** Pengemasan otomatis, pelabelan nomor batch produksi & tanggal kedaluwarsa/garansi.\n` +
        `6. **Gudang Barang Jadi & Dispatch (Finished Goods Warehouse):** Penyusunan di rak pallet terstandar siap kirim ke armada distribusi klien.\n\n` +
        `**8.2 Service Level Agreement (SLA) Produksi**\n` +
        `- **Lead Time Pemenuhan Pesanan Reguler:** Maksimal **4 Hari Kerja** dari penerbitan Purchase Order (PO) resmi hingga barang siap muat.\n` +
        `- **Akurasi Pengiriman Batch:** Tingkat kesesuaian kuantitas dan spesifikasi order mencapai **99.6%**.`;

    case 9:
      return `### 9. Risk Management\n\n` +
        `**9.1 Risiko Operasional & Kegagalan Mesin (Machine Breakdown)**\n` +
        `- **Dampak:** Terhentinya lini produksi yang berpotensi menurunkan output harian.\n` +
        `- **Mitigasi:** Penerapan *Total Productive Maintenance (TPM)* harian dan penyediaan stok suku cadang kritis (*critical spare parts*) di gudang dengan garansi teknisi siaga 24 jam.\n\n` +
        `**9.2 Risiko Fluktuasi Harga Bahan Baku**\n` +
        `- **Dampak:** Peningkatan Harga Pokok Produksi (HPP) dan penekanan margin laba.\n` +
        `- **Mitigasi:** Kontrak pasokan harga terkunci (*fixed price contract*) dengan pemasok utama selama 6 bulan dan diversifikasi ke 3 pemasok alternatif berstandar sama.\n\n` +
        `**9.3 Asuransi Aset & Jaminan Mutu Produk**\n` +
        `- **Cakupan Polis:** Asuransi *Property All Risks (PAR)* gedung pabrik, asuransi kerusakan mesin (*Machinery Breakdown Insurance*), dan asuransi tanggung gugat produk (*Product Liability Insurance*) senilai Rp 10 Miliar.`;

    case 10:
      return `### 10. Digital Coverage (Tools, Method, Impact, Automation)\n\n` +
        `**10.1 Sistem Enterprise Resource Planning (ERP) Manufaktur**\n` +
        `- Integrasi modul Bill of Materials (BOM), penjadwalan produksi induk (Master Production Schedule - MPS), dan kontrol stok otomatis.\n` +
        `- Pelaporan keuangan dan HPP per batch secara real-time yang memangkas waktu rekonsiliasi akuntansi bulanan hingga **70%**.\n\n` +
        `**10.2 Sistem Pemantauan Sensor Mesin IoT & SCADA**\n` +
        `- Sensor getaran, suhu motor listrik, dan counter unit otomatis yang terhubung ke dashboard digital pusat komando pabrik.\n` +
        `- Peringatan dini (*early warning alert*) otomatis jika terjadi anomali suhu atau deviasi kecepatan lini sebelum terjadi kerusakan fatal.\n\n` +
        `**10.3 Warehouse Management System (WMS) Berbasis Barcode/QR**\n` +
        `- Pelacakan lokasi pallet dan pergerakan stok barang jadi secara digital dengan tingkat akurasi persediaan gudang mencapai **99.8%**.`;

    case 11:
      return `### 11. Competitor\n\n` +
        `**11.1 Lanskap Pesaing Produsen Sejenis**\n` +
        `- **Pesaing Korporasi Skala Besar:** Memiliki kapasitas besar namun birokrasi kaku, *minimum order quantity (MOQ)* sangat tinggi, dan *lead time* panjang.\n` +
        `- **Produsen Lokal Konvensional:** Harga murah tetapi sering bermasalah pada stabilitas mutu batch, kemasan rentan rusak, dan ketiadaan sertifikasi ISO.\n\n` +
        `**11.2 Keunggulan Kompetitif Proyek ${pName}**\n` +
        `- **Fleksibilitas MOQ:** Mampu melayani pesanan distributor menengah dengan MOQ yang bersahabat tanpa mengorbankan skala efisiensi.\n` +
        `- **Kecepatan Respons & Pengiriman:** Lead time produksi 30% lebih cepat dibanding rata-rata industri kompetitor regional.\n` +
        `- **Sertifikasi Terverifikasi:** Standar ISO 9001, ISO 14001, dan sertifikasi uji mutu produk yang lengkap menjadi penentu utama dalam memenangkan tender korporat B2B.`;

    case 12:
      return `### 12. TAM, SAM, SOM\n\n` +
        `**12.1 Total Addressable Market (TAM) - Pasar Industri Nasional**\n` +
        `Total belanja nasional untuk kategori produk manufaktur sejenis di Indonesia diestimasikan mencapai **Rp 15.000.000.000.000 per tahun** (Rp 15 Triliun), didorong oleh permintaan industri domestik dan proyek pembangunan infrastruktur nasional.\n\n` +
        `**12.2 Serviceable Addressable Market (SAM) - Wilayah Distribusi Target**\n` +
        `Porsi pasar yang realistis dapat dijangkau dalam radius logistik koridor distribusi pabrik diestimasikan sebesar **Rp 2.200.000.000.000 per tahun** (**14.7%** dari total TAM nasional).\n\n` +
        `**12.3 Serviceable Obtainable Market (SOM) - Target Kapasitas Pabrik**\n` +
        `Target perolehan pangsa pasar riil yang dapat dipenuhi oleh kapasitas terpasang lini produksi tahap awal adalah sebesar **Rp 220.000.000.000 per tahun** (**10.0%** dari SAM terjangkau - *Detail %: Rp 220 Miliar / Rp 2.200 Miliar × 100% = 10.00% target penetrasi kapasitas optimal pabrik*) atau setara omset rata-rata Rp 18.3 Miliar per bulan saat kapasitas 100% komersial.`;

    case 13:
      return `### 13. CAC, LTV\n\n` +
        `**13.1 Customer Acquisition Cost (CAC) Distributor B2B**\n` +
        `- Rata-rata biaya akuisisi distributor baru (mencakup biaya kunjungan sales B2B, uji coba sampel produk gratis, dan administrasi kontrak) adalah sebesar **Rp 28.000.000 per akun distributor**.\n\n` +
        `**13.2 Lifetime Value (LTV) Kontrak Pasokan Distributor**\n` +
        `- Rata-rata nilai transaksi pembelian distributor aktif mencapai Rp 250.000.000 per bulan atau Rp 3.000.000.000 per tahun. Dengan margin laba kotor 22% dan masa retensi kemitraan rata-rata 3.5 tahun, nilai LTV mencapai **Rp 2.310.000.000 per akun**.\n\n` +
        `**13.3 Rasio LTV terhadap CAC & Retensi Kemitraan**\n` +
        `- **Rasio LTV / CAC:** Sebesar **82.5x** *(Detail Perhitungan: LTV Rp 2.310.000.000 / CAC Rp 28.000.000 = 82.5x, jauh di atas ambang batas industri sehat 3.0x)*.\n` +
        `- **Tingkat Retensi Repeat Order:** Diestimasikan mencapai **95.5%** berkat jaminan konsistensi kualitas mutu produk dan SLA ketepatan waktu pengiriman.`;

    case 14:
      return `### 14. Kesimpulan & Rekomendasi Keputusan\n\n` +
        `**14.1 Evaluasi Kelayakan Multi-Dimensi Pabrik**\n` +
        `Berdasarkan analisis terintegrasi seluruh pilar, proyek pendirian/ekspansi pabrik **${pName}** memperoleh skor kelayakan komprehensif **93.2 dari 100** *(Detail Perhitungan Skor: Bobot Analisis Pasar 25% × Skor 95 + Bobot Kelayakan Teknis Operasional 25% × Skor 92 + Bobot Finansial & ROI 30% × Skor 94 + Bobot Kepatuhan Hukum & Lingkungan 20% × Skor 92 = Total Skor Tertimbang 93.2 / 100)*.\n\n` +
        `**14.2 Rekomendasi Keputusan Investasi**\n` +
        `- **Status Keputusan Eksekutif:** Dinyatakan **SANGAT LAYAK (APPROVED - GO)** untuk segera direalisasikan ke tahap eksekusi fisik.\n` +
        `- **Langkah Taktis 30 Hari Pertama:**\n` +
        `  1. Penandatanganan kontrak pengadaan mesin utama dan pembayaran uang muka pemesanan.\n` +
        `  2. Pengurusan berkas Izin Usaha Industri (IUI) OSS RBA dan verifikasi kelayakan tata ruang bangunan pabrik.\n` +
        `  3. Finalisasi nota kesepahaman (MoU) pasokan bahan baku dengan 3 vendor hulu terakreditasi.\n` +
        `  4. Perekrutan Plant Manager dan Kepala QC guna mengawal instalasi fasilitas produksi.`;

    case 15:
      return `### 15. Service Design\n\n` +
        `**15.1 Blueprint Layanan & Penanganan Klien Industri B2B**\n` +
        `- **Tahap 1 - Konsultasi & Pengujian Sampel:** Penyediaan sampel gratis dalam 3 hari kerja, pengujian toleransi spesifikasi sesuai kebutuhan lini klien.\n` +
        `- **Tahap 2 - Kesepakatan Kontrak & Jadwal Pasokan:** Penyusunan Purchase Order terikat dengan garansi harga stabil dan jadwal pengiriman batch bertahap.\n` +
        `- **Tahap 3 - Pelaksanaan Produksi & Pemantauan Mutu:** Pengawasan otomatis dengan laporan sertifikat analisis kualitas (*Certificate of Analysis - CoA*) pada setiap batch kirim.\n` +
        `- **Tahap 4 - Pengiriman & Garansi Purnajual:** Pengiriman tepat waktu dengan armada berstandar dan garansi retur penggantian produk 100% jika terjadi ketidaksesuaian spesifikasi dalam waktu 24 jam.\n\n` +
        `**15.2 Metrik Pengalaman Pelanggan (Customer Experience)**\n` +
        `- **Tingkat Kesiapan Lini Layanan:** Ditargetkan mencapai **98.5%** kepuasan distributor terhadap respons penanganan pesanan dan penerbitan dokumen faktur.`;

    case 16:
      return `### 16. Konsumen Potensial\n\n` +
        `**16.1 Pemetaan Target Akun Korporasi & Distributor Utama**\n` +
        `- **Distributor Nasional & Wholesaler Regional:** 8 grup distributor besar dengan jaringan toko/outlet binaan yang luas di koridor target.\n` +
        `- **Perusahaan Maklon & Pemilik Brand (Brand Owners):** 5 korporasi yang membutuhkan pengalihan fasilitas produksi (*contract manufacturing*) untuk memenuhi lonjakan permintaan pasar mereka.\n` +
        `- **Industri Perakitan & Pengguna Akhir Komersial:** Jaringan pabrikan hilir yang membutuhkan pasokan komponen/bahan setengah jadi secara rutin.\n\n` +
        `**16.2 Nilai Pipeline Kontrak Potensial**\n` +
        `- Estimasi nilai pipeline dari 10 akun prospek awal yang siap menandatangani MoU adalah sebesar **Rp 38.500.000.000 per tahun** dengan siklus negosiasi rata-rata 30–45 hari kalender.`;

    case 17:
      return `### 17. Legal & Regulatory Compliance (Izin Usaha, Perizinan Sektoral, Dokumen Legalitas)\n\n` +
        `**17.1 Dokumen Legalitas Dasar Badan Usaha**\n` +
        `- Akta Pendirian Perseroan Terbatas (PT), SK Pengesahan Kemenkumham RI, Nomor Induk Berusaha (NIB) Berbasis Risiko OSS RBA KBLI Industri Pengolahan.\n` +
        `- Nomor Pokok Wajib Pajak (NPWP) Badan Usaha dan Surat Pengukuhan Pengusaha Kena Pajak (SPPKP).\n\n` +
        `**17.2 Perizinan Sektoral Manufaktur & Keselamatan Fasilitas**\n` +
        `- **Izin Usaha Industri (IUI) & Verifikasi Teknis Kemenperin:** Kesesuaian lokasi pabrik di kawasan peruntukan industri resmi.\n` +
        `- **Persetujuan Lingkungan (AMDAL / UKL-UPL):** Izin pembuangan limbah cair (IPLC) dan sertifikat operasional Instalasi Pengolahan Air Limbah (IPAL).\n` +
        `- **Sertifikat Laik Fungsi (SLF) Bangunan Gedung Pabrik:** Pemeriksaan kekuatan struktur gedung, proteksi bahaya kebakaran, dan ventilasi udara.\n` +
        `- **Sertifikasi Produk Sektoral:** Pemenuhan Standar Nasional Indonesia (SNI), izin edar BPOM (bila produk pangan/minuman/kosmetik), dan Sertifikat Halal BPJPH.\n\n` +
        `**17.3 Kepatuhan Ketenagakerjaan & K3**\n` +
        `- Pendaftaran BPJS Ketenagakerjaan dan BPJS Kesehatan untuk 100% pekerja pabrik, peraturan perusahaan yang disahkan Disnaker, dan pembentukan Panitia Pembina K3 (P2K3).`;

    default:
      return `### ${title}\n\nAnalisis terperinci untuk pilar ${title} pada proyek ${pName}. Memastikan standar industri manufaktur dan efisiensi operasional tercapai optimal.`;
  }
}

export function getManufacturingVisualHtml(secNumber: number, title: string, projectTitle: string): string {
  const pName = projectTitle || "Kajian Strategis Manufaktur & Pabrik";
  const tableStyle = "width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; text-align: left; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #cbd5e1;";
  const thStyle = "background-color: #0f172a; color: #ffffff; padding: 10px 12px; font-weight: 600; border: 1px solid #334155; text-align: left;";
  const tdStyle = "padding: 9px 12px; border: 1px solid #cbd5e1; color: #1e293b; background-color: #ffffff;";
  const tdAltStyle = "padding: 9px 12px; border: 1px solid #cbd5e1; color: #1e293b; background-color: #f8fafc;";
  const sectionHeaderStyle = "font-size: 14px; font-weight: 700; color: #0f172a; margin: 18px 0 8px 0; padding-bottom: 4px; border-bottom: 2px solid #2563eb;";

  const renderMetricCards = (cards: { label: string; val: string; sub: string; color: string }[]) => `
    <div style="margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0;">
        <tr>
          ${cards.map(c => `
            <td style="width: ${Math.round(100 / cards.length)}%; background: #ffffff; border: 1px solid #cbd5e1; border-top: 4px solid ${c.color}; border-radius: 6px; padding: 12px 14px; vertical-align: top;">
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px;">${c.label}</div>
              <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${c.val}</div>
              <div style="font-size: 11px; color: ${c.color}; font-weight: 500;">${c.sub}</div>
            </td>
          `).join("")}
        </tr>
      </table>
    </div>
  `;

  switch(secNumber) {
    case 1:
      return `
        ${renderMetricCards([
          { label: "Status Regulasi", val: "UU Perindustrian No. 3/2014", sub: "Kepatuhan IUI OSS RBA & Kemenperin", color: "#2563eb" },
          { label: "Kapasitas Terpasang", val: "120.000 Unit / Bulan", sub: "★ Utilisasi Lini Optimal 88.5%", color: "#059669" },
          { label: "Standar Mutu", val: "ISO 9001 & ISO 14001", sub: "Kesiapan Audit Sertifikasi Penuh", color: "#7c3aed" },
          { label: "Status Kelayakan", val: "SANGAT LAYAK (GO)", sub: "● Skor Industri 93.2 / 100", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 1.1: Matriks Kepatuhan Regulasi Industri & Kebijakan Pabrik</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Instrumen Regulasi & Standar</th>
              <th style="${thStyle}">Instansi Pengawas</th>
              <th style="${thStyle}">Parameter Kepatuhan Wajib</th>
              <th style="${thStyle}">Kesiapan Fasilitas Pabrik</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>UU No. 3 Tahun 2014 (Perindustrian)</strong></td>
              <td style="${tdStyle}">Kementerian Perindustrian & Dinas Terkait</td>
              <td style="${tdStyle}">Izin Usaha Industri (IUI), Kawasan Industri Resmi</td>
              <td style="${tdStyle}">Terdaftar OSS RBA & SIINas Kemenperin</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>PP No. 22 Tahun 2021 (Lingkungan Hidup)</strong></td>
              <td style="${tdAltStyle}">Dinas Lingkungan Hidup (DLH)</td>
              <td style="${tdAltStyle}">Persetujuan Teknis IPAL & Emisi Cerobong</td>
              <td style="${tdAltStyle}">100% Dilengkapi IPAL & Pemantauan Berkala</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Sertifikasi ISO 9001 & ISO 45001</strong></td>
              <td style="${tdStyle}">Lembaga Sertifikasi Akreditasi KAN</td>
              <td style="${tdStyle}">Sistem Mutu Produksi & Target Zero Accident K3</td>
              <td style="${tdStyle}">SOP 5R & Manual Mutu Pabrik Terstandarisasi</td>
            </tr>
          </tbody>
        </table>
      `;

    case 2:
      return `
        ${renderMetricCards([
          { label: "Pertumbuhan Pasar (CAGR)", val: "10.8% per Tahun", sub: "Permintaan B2B & Industri Hilir Kuat", color: "#2563eb" },
          { label: "Valuasi Pasar Terjangkau", val: "Rp 2.2 Triliun / Th", sub: "Pasar Koridor Regional SAM", color: "#059669" },
          { label: "Margin Skala Ekonomi", val: "18.5% - 24.0%", sub: "Efisiensi Pembelian Grosir Bahan", color: "#7c3aed" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 2.1: Pemetaan Kebutuhan Segmen Pasar Manufaktur</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Segmen Pasar Sasaran</th>
              <th style="${thStyle}">Kebutuhan Utama Klien</th>
              <th style="${thStyle}">Kelemahan Kompetitor Petahana</th>
              <th style="${thStyle}">Solusi Nilai Tambah Pabrik Kami</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Distributor Besar & Wholesaler</strong></td>
              <td style="${tdStyle}">Kontinuitas pasokan volume besar & harga grosir stabil</td>
              <td style="${tdStyle}">Lead time lama (sering terlambat > 14 hari)</td>
              <td style="${tdStyle}">Jaminan SLA pengiriman dalam 4 hari kerja</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Pemilik Brand Maklon (OEM/ODM)</strong></td>
              <td style="${tdAltStyle}">Presisi mutu batch & kerahasiaan formula/desain</td>
              <td style="${tdAltStyle}">Toleransi dimensi tidak konsisten antar batch</td>
              <td style="${tdAltStyle}">Sistem QC presisi dan Certificate of Analysis (CoA)</td>
            </tr>
          </tbody>
        </table>
      `;

    case 3:
      return `
        ${renderMetricCards([
          { label: "Total CAPEX Investasi", val: "Rp 4.260.000.000", sub: "Mesin 75.1% / Bangunan 14.3% / Utilitas 10.6%", color: "#2563eb" },
          { label: "OPEX Bulanan Pabrik", val: "Rp 290.000.000 / Bln", sub: "Bahan Baku 53.4% / Gaji 24.8% / Listrik 13.1%", color: "#059669" },
          { label: "EBITDA Margin Tahunan", val: "31.5% - 34.5%", sub: "Proyeksi Laba Bersih 20.2% - 24.6%", color: "#7c3aed" },
          { label: "Payback Period (ROI)", val: "2.2 Tahun (IRR 25.4%)", sub: "★ Kelayakan Investasi Sangat Prima", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 3.1: Struktur Pengeluaran Modal (CAPEX) Fasilitas Manufaktur</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Komponen Investasi</th>
              <th style="${thStyle}">Alokasi Anggaran (Rp)</th>
              <th style="${thStyle}">Porsi %</th>
              <th style="${thStyle}">Spesifikasi & Rincian Aset</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Mesin Produksi Utama & Lini Perakitan</strong></td>
              <td style="${tdStyle}">Rp 3.200.000.000</td>
              <td style="${tdStyle}">75.12%</td>
              <td style="${tdStyle}">Lini mesin fabrikasi berkecepatan tinggi & konveyor otomatis</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Utilitas Listrik Industri & Kompresor</strong></td>
              <td style="${tdAltStyle}">Rp 450.000.000</td>
              <td style="${tdAltStyle}">10.56%</td>
              <td style="${tdAltStyle}">Gardu trafo PLN 3-phasa, genset backup 250 kVA, & piping udara</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Gedung Pabrik, Gudang, IPAL & Izin IUI</strong></td>
              <td style="${tdStyle}">Rp 610.000.000</td>
              <td style="${tdStyle}">14.32%</td>
              <td style="${tdStyle}">Renovasi lantai epoxy, rak pallet gudang, IPAL & izin resmi</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>TOTAL GRAND CAPEX</strong></td>
              <td style="${tdAltStyle}"><strong>Rp 4.260.000.000</strong></td>
              <td style="${tdAltStyle}"><strong>100.0%</strong></td>
              <td style="${tdAltStyle}">35% Equity Kas Mandiri / 65% Fasilitas Kredit Bank</td>
            </tr>
          </tbody>
        </table>
      `;

    case 4:
      return `
        ${renderMetricCards([
          { label: "Kapasitas Terpasang", val: "120.000 Unit / Bln", sub: "Operasional 2 Shift Kerja Lini", color: "#2563eb" },
          { label: "Proyeksi Serapan Permintaan", val: "106.200 Unit / Bln", sub: "Utilisasi Terpasang Prima 88.5%", color: "#059669" },
          { label: "Batas Toleransi Reject", val: "< 1.45% Output", sub: "SOP Daur Ulang & Rework Terstandar", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 4.1: Neraca Keseimbangan Suplai Kapasitas vs Demand Order</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Parameter Kapasitas</th>
              <th style="${thStyle}">Nilai Target</th>
              <th style="${thStyle}">Metode Pengendalian</th>
              <th style="${thStyle}">Tindakan Kontinjensi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Output Harian (2 Shift)</strong></td>
              <td style="${tdStyle}">4.800 unit / hari kerja</td>
              <td style="${tdStyle}">Line balancing & target output per jam kerja</td>
              <td style="${tdStyle}">Pemberlakuan lembur terencana akhir pekan</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Safety Stock Bahan Baku</strong></td>
              <td style="${tdAltStyle}">Persediaan 21 hari kerja</td>
              <td style="${tdAltStyle}">Re-order point otomatis pada sistem ERP</td>
              <td style="${tdAltStyle}">Kontrak darurat dengan supplier lokal cadangan</td>
            </tr>
          </tbody>
        </table>
      `;

    default:
      return `
        ${renderMetricCards([
          { label: "Efisiensi Operasional", val: "OEE ≥ 85.2%", sub: "Standar Industri Manufaktur Modern", color: "#2563eb" },
          { label: "Tingkat Kepatuhan", val: "100% Regulasi", sub: "ISO 9001, 14001, 45001 & IUI", color: "#059669" },
          { label: "Evaluasi Pilar", val: "Memenuhi Syarat", sub: "Parameter Terverifikasi Penuh", color: "#7c3aed" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel: Parameter Kinerja Manufaktur - Pilar ${secNumber} (${title})</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Parameter Evaluasi</th>
              <th style="${thStyle}">Target Standar</th>
              <th style="${thStyle}">Realisasi Perencanaan</th>
              <th style="${thStyle}">Status Mitigasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Ketepatan Output & Kualitas Mutu</strong></td>
              <td style="${tdStyle}">Defect rate < 1.5%</td>
              <td style="${tdStyle}">1.45% terkontrol dengan sistem inspeksi QC</td>
              <td style="${tdStyle}">Sesuai Standar Mutu Industri</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kepatuhan Regulasi & K3 Pabrik</strong></td>
              <td style="${tdAltStyle}">Zero Accident & IUI Terbit</td>
              <td style="${tdAltStyle}">SOP 5R & SMK3 diterapkan penuh di seluruh lini</td>
              <td style="${tdAltStyle}">Kepatuhan Regulasi Terverifikasi</td>
            </tr>
          </tbody>
        </table>
      `;
  }
}
