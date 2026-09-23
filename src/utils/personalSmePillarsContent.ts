/**
 * Personal Business & SME (Usaha Pribadi / UMKM / Ritel / Kafe / Jasa Mandiri)
 * Content & Visual Generator for 17 Pillars
 * Tailored for Independent Businesses, Coffee Shops, Boutiques, Laundries, Clinics, Workshops, and Local Retail.
 */

export function generatePersonalSmeDefaultContent(num: number, title: string, projectTitle: string, shortDesc?: string): string {
  const pName = projectTitle || "Kajian Usaha Mandiri & Bisnis UMKM";
  switch(num) {
    case 1:
      return `### 1. Global/NAT Overview\n\n` +
        `**1.1 Latar Belakang Makro & Konteks Pemberdayaan UMKM Nasional**\n` +
        `Kajian strategis untuk unit usaha **${pName}** mengacu pada kebijakan nasional penguatan ekonomi kerakyatan melalui **PP No. 7 Tahun 2021** (Kemudahan, Pelindungan, dan Pemberdayaan Koperasi dan Usaha Mikro, Kecil, dan Menengah). Sektor usaha mandiri merupakan tulang punggung ekonomi dengan kontribusi lebih dari 61% terhadap PDB nasional dan daya tahan tinggi terhadap volatilitas makro.\n\n` +
        `**1.2 Analisis Peluang Pasar Lokal & Karakteristik Konsumen**\n` +
        `- **Peningkatan Daya Beli Komunitas Lokal:** Pertumbuhan populasi usia produktif dan peningkatan belanja gaya hidup di area perkotaan/pemukiman mandiri.\n` +
        `- **Preferensi Produk Otentik & Pelayanan Personal:** Konsumen modern cenderung memilih tempat usaha yang menawarkan atmosfer ramah, kebersihan prima, dan kemudahan transaksi digital.\n` +
        `- **Dukungan Ekosistem Digital UMKM:** Ketersediaan platform pembayaran digital nasional (QRIS), layanan pesan-antar instan, dan perizinan terintegrasi secara elektronik.\n\n` +
        `**1.3 Kepatuhan Standar & Regulasi Usaha Mandiri (Compliance Matrix)**\n` +
        `- **Legalitas Usaha Terpadu:** Kepemilikan **Nomor Induk Berusaha (NIB) Perseorangan** melalui sistem OSS RBA (KBLI Skala Mikro/Kecil Risiko Rendah).\n` +
        `- **Standar Higiene & Kualitas:** Sertifikat Laik Higiene Sanitasi dan Sertifikasi Halal Gratis (SEHATI BPJPH) untuk kepastian mutu produk konsumsi.\n` +
        `- **Kepatuhan Pajak UMKM:** Pendaftaran NPWP Usaha dan pemanfaatan skema PPh Final UMKM 0.5% sesuai PP No. 23/2018 (bebas pajak omset di bawah Rp 500 Juta/tahun bagi WP Orang Pribadi).\n` +
        `- **Target Kepuasan Konsumen (CSAT):** Indeks kepuasan pelanggan ditargetkan minimal **95.2%** *(Detail Perhitungan %: Rasio minimal 190 review bintang 4 dan 5 dari setiap 200 ulasan pelanggan di Google Maps dan survei kepuasan berkala)* dengan tingkat keluhan (komplain) di bawah 1.0%.\n\n` +
        `**1.4 Kesimpulan & Eksekusi Pilar**\n` +
        `Pilar pertama ini meletakkan fondasi hukum dan tata kelola usaha mandiri yang memastikan unit usaha **${pName}** beroperasi secara resmi, aman secara regulasi, dan terpercaya bagi pelanggan.`;

    case 2:
      return `### 2. Market Opportunity\n\n` +
        `**2.1 Analisis Permintaan Konsumen Lokal (Local Market Demand)**\n` +
        `Analisis pasar di sekitar lokasi proyek **${pName}** menunjukkan tingginya potensi trafik harian (rata-rata 800 - 1.500 pejalan kaki/kendaraan per hari) yang membutuhkan produk dan layanan berkualitas, cepat, dan berharga rasional.\n\n` +
        `**2.2 Kesenjangan Kompetitor & Peluang Diferensiasi Unik (USP)**\n` +
        `- **Kelemahan Pemain Lama Sekitar:** Kurangnya standarisasi kebersihan tempat, staf yang kurang ramah, serta tidak tersedianya pembayaran non-tunai (QRIS/E-Wallet).\n` +
        `- **Keunggulan Produk Otentik (Unique Selling Proposition):** Menghadirkan produk berkualitas premium dengan bahan baku pilihan dan kemasan higienis yang estetik.\n` +
        `- **Potensi Margin Laba Sehat:** Margin kotor berkisar **48.0% - 55.0%** dan margin laba bersih rata-rata **28.5% - 34.7%** *(Detail Asal %: Efisiensi pembelian bahan baku grosir mingguan memangkas HPP sebesar 12.0% + penghematan biaya promosi organik media sosial 8.5% = akumulasi margin laba bersih 28.5% - 34.7%)*.\n\n` +
        `**2.3 Proyeksi Pertumbuhan Omset Usaha**\n` +
        `Dengan target penetrasi komunitas sekitar dan pemasaran media sosial aktif, omset usaha diproyeksikan bertumbuh sebesar **14.5% per kuartal** seiring dengan meningkatnya basis pelanggan setia.`;

    case 3:
      return `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)\n\n` +
        `**3.1 Struktur Pengeluaran Modal Awal (CAPEX)**\n` +
        `- **Sewa Tempat Usaha (Tenor 1 - 2 Tahun):** Alokasi pembayaran sewa ruko/kios strategis sebesar Rp 75.000.000 (**34.1%** - *Detail %: Rp 75.000.000 / Total Modal Awal Rp 220.000.000 × 100% = 34.09%*).\n` +
        `- **Renovasi Interior, Pencahayaan, Estetika & Signage:** Pengerjaan booth/interior, meja kasir, AC, dan neon box sebesar Rp 65.000.000 (**29.5%** - *Detail %: Rp 65.000.000 / Total Modal Awal Rp 220.000.000 × 100% = 29.55%*).\n` +
        `- **Pengadaan Mesin & Peralatan Kerja Pokok:** Mesin utama, lemari pendingin, tablet kasir POS, printer struk, dan etalase sebesar Rp 55.000.000 (**25.0%** - *Detail %: Rp 55.000.000 / Total Modal Awal Rp 220.000.000 × 100% = 25.00%*).\n` +
        `- **Modal Kerja Awal & Persediaan Bahan Baku Perdana:** Belanja bahan baku awal, seragam staf, dan dana kas operasional sebesar Rp 25.000.000 (**11.4%** - *Detail %: Rp 25.000.000 / Total Modal Awal Rp 220.000.000 × 100% = 11.36%*).\n` +
        `- **Total Grand CAPEX:** **Rp 220.000.000** (**100.0%**; Struktur modal: 60% Tabungan Modal Mandiri / 40% Kemitraan Keluarga/KUR Mikro Perbankan).\n\n` +
        `**3.2 Struktur Biaya Operasional (OPEX) Bulanan**\n` +
        `- **Bahan Baku & Kemasan (COGS/HPP):** Rp 28.000.000 / bulan (45.2% dari total OPEX bulanan).\n` +
        `- **Gaji Staf & Upah Kerja (3 - 4 Orang):** Rp 18.000.000 / bulan (29.0% dari total OPEX bulanan).\n` +
        `- **Utilitas (Listrik, Air Bersih & Paket Internet Wifi):** Rp 6.500.000 / bulan (10.5% dari total OPEX bulanan).\n` +
        `- **Pemasaran Media Sosial, Retribusi & Pemeliharaan:** Rp 9.500.000 / bulan (15.3% dari total OPEX bulanan).\n` +
        `- **Total OPEX Bulanan:** **Rp 62.000.000** (100.0%).\n\n` +
        `**3.3 Proyeksi Pendapatan & Pengembalian Investasi (ROI)**\n` +
        `- **Target Penjualan Bulanan (Omset):** Rata-rata 120 transaksi/hari × nilai keranjang belanja Rp 26.500 = **Rp 95.400.000 per bulan**.\n` +
        `- **Laba Bersih Bulanan:** Omset Rp 95.400.000 - OPEX Rp 62.000.000 = **Rp 33.400.000 per bulan** (**35.0%** net profit margin).\n` +
        `- **Titik Impas / Break Even Point (BEP):** Omset minimal untuk menutup OPEX adalah Rp 62.000.000/bulan (tercapai hanya dengan 78 transaksi/hari).\n` +
        `- **Payback Period:** Modal awal Rp 220.000.000 kembali penuh dalam waktu **6.6 Bulan - 8.5 Bulan**.\n` +
        `- **Return on Investment (ROI Tahunan):** Sebesar **82.5%** *(Detail Perhitungan %: Proyeksi Laba Bersih Tahun I Rp 181.500.000 [setelah diskon pembukaan] / Total Modal Rp 220.000.000 × 100% = 82.50% kelayakan finansial sangat prima)*.`;

    case 4:
      return `### 4. Supply & Demand\n\n` +
        `**4.1 Kapasitas Pelayanan Harian vs Proyeksi Kunjungan**\n` +
        `Kapasitas pelayanan tempat usaha dirancang mampu memproses hingga **150 transaksi/pelanggan per hari** (jam operasional 10:00 - 22:00 atau 12 jam kerja). Target serapan kunjungan harian tahap awal dipatok pada **110 - 125 pelanggan per hari** dengan tingkat keterisian (*utilization rate*) sebesar **80.0% - 83.3%** *(Detail Perhitungan %: Target 125 transaksi / Kapasitas Maksimal 150 transaksi × 100% = 83.33% tingkat utilisasi prima)*.\n\n` +
        `**4.2 Manajemen Persediaan & Mitigasi Jam Sibuk (Peak Hours)**\n` +
        `- **Jam Sibuk (Peak Hours):** Terkonsentrasi pada jam makan siang (11:30 - 13:30) dan sore-malam (17:30 - 20:30).\n` +
        `- **Kecepatan Layanan:** Standar waktu penyajian/transaksi dibatasi maksimal **di bawah 6 menit per pelanggan** guna mencegah penumpukan antrean.\n` +
        `- **Buffer Stock Bahan Baku:** Persediaan bahan utama non-perishable diamankan untuk kebutuhan **7 Hari Kerja** guna menghindari kekosongan stok saat akhir pekan.`;

    case 5:
      return `### 5. Organization (Qualification, Skill, Output/KPI, SOP)\n\n` +
        `**5.1 Struktur Tim Kerja Usaha Mandiri**\n` +
        `Unit usaha dijalankan secara efisien oleh **5 orang**: 1 Pemilik / Pengelola Utama (*Owner-Manager*), 1 Kasir & Admin Keuangan, 2 Staf Pelaksana/Produksi, dan 1 Staf Kebersihan & Serbaguna.\n\n` +
        `**5.2 Standar Kualifikasi & Pelatihan Pelayanan Prima (Hospitality)**\n` +
        `- **Budaya Keramahan 3S:** Wajib menerapkan budaya Senyum, Sapa, Salam kepada setiap pelanggan yang datang.\n` +
        `- **Standar Higiene & Kerapian:** Penggunaan celemek bersih, penutup rambut, sarung tangan higienis, dan sanitasi berkala meja/peralatan kerja.\n` +
        `- **Kejujuran & Ketelitian:** Mengoperasikan aplikasi kasir POS secara disiplin tanpa ada transaksi yang tidak tercatat struk.\n\n` +
        `**5.3 Key Performance Indicators (KPI) Staf**\n` +
        `- **Kecepatan Transaksi Kasir:** Maksimal **90 Detik** per pelanggan.\n` +
        `- **Tingkat Kepuasan Pelanggan:** Minimal **95.0%** ulasan positif bintang 4 dan 5.`;

    case 6:
      return `### 6. Transition Model (Pre-On-Post)\n\n` +
        `**6.1 Tahap Pre-Opening (Minggu 1 - 3)**\n` +
        `- Finalisasi sewa tempat, renovasi interior/booth, instalasi kelistrikan & signage neon box.\n` +
        `- Pengadaan mesin/alat, pembelian bahan baku awal, dan uji coba resep/prosedur layanan (*trial run*).\n\n` +
        `**6.2 Tahap Soft Opening & Uji Coba Komunitas (Minggu 4)**\n` +
        `- Uji coba operasional dengan kapasitas **50.0%** bagi keluarga, sahabat, dan pelanggan sekitar dengan promo diskon khusus.\n` +
        `- Mengumpulkan masukan langsung mengenai rasa, kecepatan staf, dan kenyamanan suasana sebelum peluncuran resmi.\n\n` +
        `**6.3 Tahap Grand Opening & Stabilisasi Komersial (Bulan 2 dst.)**\n` +
        `- Peluncuran resmi publik 100% dengan promosi Buy-1-Get-1, aktivasi Google My Business, dan iklan berbayar media sosial lokal.`;

    case 7:
      return `### 7. Go To Market Strategy\n\n` +
        `**7.1 Strategi Pemasaran Berbasis Komunitas Lokal (Hyperlocal Marketing)**\n` +
        `- **Optimasi Google Maps & Profil Bisnis:** Memastikan lokasi terverifikasi bintang 4.8+ dengan foto menu estetik dan jam buka yang akurat.\n` +
        `- **Konten Media Sosial Kreatif:** Video pendek proses pembuatan produk dan testimoni pelanggan di Instagram Reels dan TikTok.\n` +
        `- **Kemitraan Komunitas Lokal:** Kerjasama dengan perkantoran, kampus, dan perumahan sekitar melalui voucher diskon karyawan/pelajar.\n\n` +
        `**7.2 Program Retensi & Loyalitas Pelanggan**\n` +
        `- **Digital Loyalty Stamp:** Pembelian 8 kali gratis 1 produk favorit guna mendorong frekuensi kunjungan berulang.\n` +
        `- **Promo Bundling Jam Hemat (Happy Hour):** Diskon 15% pada jam sepi (14:00 - 16:30) untuk menjaga perputaran omset sepanjang hari.`;

    case 8:
      return `### 8. Ops Model (Flow Process, Workflow Diagram, SLA)\n\n` +
        `**8.1 Prosedur Standar Operasional Harian (Daily Workflow)**\n` +
        `1. **Opening Checklist (09:00 - 10:00):** Pembersihan menyeluruh ruangan, pengecekan ketersediaan bahan, penyalaan mesin, dan pengisian uang kembalian kasir.\n` +
        `2. **Layanan Pelanggan & Pemesanan (10:00 - 21:30):** Menyambut pelanggan dengan ramah, pencatatan order via POS digital, dan penerimaan pembayaran (QRIS/Tunai).\n` +
        `3. **Proses Penyiapan Produk/Layanan:** Eksekusi cepat sesuai SOP standar dengan kemasan higienis (SLA < 6 Menit).\n` +
        `4. **Penyerahan & Ucapan Terima Kasih:** Memastikan pesanan sesuai dan meminta kesediaan pelanggan memberikan review.\n` +
        `5. **Closing Checklist & Rekonsiliasi (21:30 - 22:30):** Pembersihan alat, pencetakan laporan closing harian POS, pencocokan kas fisik (selisih wajib Rp 0), dan penguncian tempat usaha.\n\n` +
        `**8.2 Service Level Agreement (SLA) Layanan**\n` +
        `- **Waktu Tunggu Pemesanan:** Maksimal **5 Menit** dari antrean hingga pesanan siap.\n` +
        `- **Akurasi Pesanan Kasir:** Tingkat kesesuaian pesanan mencapai **99.5%**.`;

    case 9:
      return `### 9. Risk Management\n\n` +
        `**9.1 Risiko Sepi Pengunjung di Hari Kerja (Weekday Slump)**\n` +
        `- **Dampak:** Penurunan omset harian yang menekan arus kas mingguan.\n` +
        `- **Mitigasi:** Menjalankan paket promo hemat weekday, layanan pesan antar katering kantor, dan program loyalty stamp.\n\n` +
        `**9.2 Risiko Fluktuasi Harga Bahan Baku**\n` +
        `- **Dampak:** Kenaikan biaya pokok penjualan (HPP).\n` +
        `- **Mitigasi:** Memiliki 2 - 3 pemasok grosir langganan di pasar induk dan mengunci harga pasokan berkala.\n\n` +
        `**9.3 Dana Cadangan Kas Darurat (Emergency Cash Buffer)**\n` +
        `- Menyisihkan kas operasional darurat minimal senilai **2 Bulan OPEX (Rp 120.000.000)** guna memastikan stabilitas usaha jika terjadi kondisi tak terduga.`;

    case 10:
      return `### 10. Digital Coverage (Tools, Method, Impact, Automation)\n\n` +
        `**10.1 Aplikasi Kasir Pintar (Cloud Point of Sale - POS)**\n` +
        `- Penggunaan aplikasi kasir cloud (seperti Moka / Pawoon / Majoo) untuk pencatatan otomatis transaksi penjualan dan kontrol inventori bahan baku secara real-time.\n\n` +
        `**10.2 Pembayaran Digital Terintegrasi (QRIS Bank Indonesia)**\n` +
        `- Menyediakan barcode QRIS statis dan dinamis yang menerima pembayaran dari seluruh mobile banking dan e-wallet (GoPay, OVO, ShopeePay, DANA), memangkas waktu transaksi hingga **60%**.\n\n` +
        `**10.3 Pembukuan Keuangan Digital & Kehadiran Online**\n` +
        `- Rekonsiliasi kas harian otomatis tanpa repot pembukuan manual kertas, serta pemantauan ulasan pelanggan di Google Maps secara berkala.`;

    case 11:
      return `### 11. Competitor\n\n` +
        `**11.1 Pemetaan Kompetitor Usaha Sejenis di Radius 3 KM**\n` +
        `- **Kompetitor Tradisional / Gerobakan:** Harga lebih murah namun kebersihan tempat kurang terjamin dan pilihan menu/layanan terbatas.\n` +
        `- **Kompetitor Waralaba / Franchise Besar:** Merek terkenal namun harga relatif mahal dan porsi/fleksibilitas rasa kaku.\n\n` +
        `**11.2 Keunggulan Kompetitif Unit Usaha ${pName}**\n` +
        `- **Harga Terjangkau Kualitas Bintang Lima:** Nilai lebih tinggi (*value for money*) bagi kantong konsumen lokal.\n` +
        `- **Suasana Nyaman & Instagrammable:** Menjadi daya tarik utama bagi generasi muda dan keluarga untuk singgah dan berfoto.\n` +
        `- **Pelayanan Akrab & Hangat:** Hubungan personal yang erat dengan pelanggan membuat tingkat retensi kunjungan kembali sangat tinggi.`;

    case 12:
      return `### 12. TAM, SAM, SOM\n\n` +
        `**12.1 Total Addressable Market (TAM) - Belanja Konsumen Kota**\n` +
        `Total potensi belanja masyarakat di wilayah kota/kabupaten untuk kategori produk/jasa terkait diestimasikan sebesar **Rp 85.000.000.000 per tahun** (Rp 85 Miliar).\n\n` +
        `**12.2 Serviceable Addressable Market (SAM) - Radius Layanan 3 - 5 KM**\n` +
        `Porsi pasar lokal yang berada dalam radius jangkauan langsung tempat usaha (populasi sekitar 45.000 jiwa) bernilai sebesar **Rp 12.000.000.000 per tahun** (**14.1%** dari total TAM kota).\n\n` +
        `**12.3 Serviceable Obtainable Market (SOM) - Target Omset Usaha Mandiri**\n` +
        `Target perolehan omset tahunan yang realistis diraih oleh unit usaha **${pName}** adalah sebesar **Rp 1.144.800.000 per tahun** (**9.5%** dari total SAM terjangkau - *Detail %: Target Omset Tahunan Rp 1.144.800.000 / SAM Rp 12.000.000.000 × 100% = 9.54% pangsa pasar lokal realistis*) atau setara rata-rata omset Rp 95.400.000 per bulan.`;

    case 13:
      return `### 13. CAC, LTV\n\n` +
        `**13.1 Customer Acquisition Cost (CAC) Pelanggan Baru**\n` +
        `- Biaya promosi mendatangkan 1 pelanggan baru (melalui iklan media sosial lokal, pencetakan brosur, dan voucher diskon perdana) diestimasikan sebesar **Rp 14.500 per pelanggan baru**.\n\n` +
        `**13.2 Lifetime Value (LTV) Pelanggan Setia**\n` +
        `- Rata-rata pelanggan loyal berkunjung 3 kali per bulan dengan nilai belanja Rp 28.000 per kunjungan (Rp 84.000/bulan atau Rp 1.008.000/tahun). Dengan masa loyalitas 2 tahun dan margin kotor 50%, nilai LTV mencapai **Rp 1.008.000 per pelanggan**.\n\n` +
        `**13.3 Rasio LTV terhadap CAC & Tingkat Repeat Order**\n` +
        `- **Rasio LTV / CAC:** Sebesar **69.5x** *(Detail Perhitungan: LTV Rp 1.008.000 / CAC Rp 14.500 = 69.5x, menandakan efisiensi biaya promosi yang sangat tinggi)*.\n` +
        `- **Tingkat Retensi Repeat Order:** Diestimasikan mencapai **76.0%** pelanggan melakukan pembelian berulang dalam kurun waktu 30 hari.`;

    case 14:
      return `### 14. Kesimpulan & Rekomendasi Keputusan\n\n` +
        `**14.1 Evaluasi Kelayakan Usaha Mandiri**\n` +
        `Berdasarkan kajian multi-aspek lokasi, potensi pasar, kelayakan modal finansial, dan kesiapan operasional, rencana pembukaan usaha **${pName}** memperoleh skor kelayakan **91.8 dari 100** *(Detail Perhitungan Skor: Bobot Potensi Pasar 30% × Skor 95 + Bobot Kelayakan Finansial & BEP 30% × Skor 92 + Bobot Lokasi & Operasional 25% × Skor 90 + Bobot Kesiapan Legalitas 15% × Skor 88 = Total Skor Tertimbang 91.8 / 100)*.\n\n` +
        `**14.2 Rekomendasi Keputusan Eksekutif**\n` +
        `- **Status Keputusan:** Dinyatakan **SANGAT LAYAK (APPROVED - GO)** untuk segera dimulai pembangunannya.\n` +
        `- **Rencana Aksi 14 Hari Pertama:**\n` +
        `  1. Penandatanganan perjanjian sewa tempat dan pembayaran uang sewa.\n` +
        `  2. Mulai pengerjaan renovasi interior, perbaikan instalasi air/listrik, dan pemesanan plang nama/neon box.\n` +
        `  3. Pembuatan NIB Perseorangan via OSS RBA dan pembukaan rekening bank khusus usaha.\n` +
        `  4. Pembelian peralatan utama dan seleksi 3 - 4 orang staf lokal.`;

    case 15:
      return `### 15. Service Design\n\n` +
        `**15.1 Peta Perjalanan Pelanggan (Customer Experience Journey)**\n` +
        `- **Tahap 1 - Daya Tarik & Penemuan (Awareness):** Melihat plang nama yang terang/estetik atau menemukan konten menarik di Instagram/TikTok.\n` +
        `- **Tahap 2 - Kedatangan & Suasana (Arrival):** Disambut dengan ruangan yang bersih, sejuk, aroma yang menyenangkan, dan sapaan ramah staf.\n` +
        `- **Tahap 3 - Pemesanan Cepat & Pembayaran Mudah (Ordering):** Menu yang jelas dan informatif dengan opsi pembayaran non-tunai QRIS instan.\n` +
        `- **Tahap 4 - Menikmati Produk & Kepuasan (Consumption):** Penyajian yang rapi, rasa produk yang konsisten lezat, dan fasilitas wifi gratis.\n` +
        `- **Tahap 5 - Pasca Kunjungan & Review (Loyalty):** Kartu stempel loyalitas terisi dan ulasan bintang 5 di Google Maps.\n\n` +
        `**15.2 Metrik Kualitas Layanan**\n` +
        `- Target rating Google Maps minimal **4.8 Bintang** dengan nol komplain kebersihan.`;

    case 16:
      return `### 16. Konsumen Potensial\n\n` +
        `**16.1 Profil Target Konsumen Sasaran**\n` +
        `- **Pekerja Kantor & Wirausaha Muda (Usia 22 - 40 Th):** Membutuhkan kepraktisan, kenyamanan tempat, dan kecepatan pelayanan.\n` +
        `- **Keluarga Muda & Warga Sekitar:** Kunjungan santai akhir pekan bersama anak dan kerabat.\n` +
        `- **Mahasiswa & Pelajar:** Mencari tempat yang ramah kantong dengan wifi stabil untuk belajar dan berkumpul santai.\n` +
        `- **Komunitas Lokal:** Komunitas olahraga, hobi, dan arisan yang rutin mengadakan pertemuan kelompok.\n\n` +
        `**16.2 Karakteristik Pembelian Rata-Rata**\n` +
        `- Rata-rata pembelanjaan (*average basket size*) berkisar antara Rp 25.000 hingga Rp 45.000 per transaksi dengan preferensi tinggi terhadap menu bundling.`;

    case 17:
      return `### 17. Legal & Regulatory Compliance (Izin Usaha, Perizinan Sektoral, Dokumen Legalitas)\n\n` +
        `**17.1 Dokumen Legalitas Usaha Mikro Perseorangan**\n` +
        `- **Nomor Induk Berusaha (NIB) OSS RBA:** KBLI Usaha Mikro/Kecil Perseorangan resmi dari Kementerian Investasi/BKPM.\n` +
        `- **NPWP Perseorangan / Usaha:** Terdaftar di Ditjen Pajak untuk keperluan pembukaan rekening bank usaha dan kepatuhan perpajakan UMKM.\n` +
        `- **Surat Perjanjian Sewa Menyewa Tempat:** Kontrak sewa bermeterai Rp 10.000 dengan pemilik properti yang memuat klausul hak pakai usaha.\n\n` +
        `**17.2 Perizinan Higiene, Sertifikasi Produk & Lingkungan**\n` +
        `- **Sertifikat Laik Higiene Sanitasi / P-IRT:** Pendaftaran pangan industri rumah tangga di Dinas Kesehatan setempat (bila relevan).\n` +
        `- **Sertifikasi Halal BPJPH (Program SEHATI):** Pendaftaran sertifikat halal gratis melalui pendamping PPH resmi.\n` +
        `- **Kesesuaian Tata Tertib Lingkungan:** Izin domisili usaha dan persetujuan pengurus RT/RW setempat serta ketersediaan tempat sampah tertutup dan pembuangan air kotor yang tertata rapi.`;

    default:
      return `### ${title}\n\nAnalisis terperinci untuk pilar ${title} pada proyek ${pName}. Mengoptimalkan kelayakan usaha mandiri dan kepuasan pelanggan secara berkesinambungan.`;
  }
}

export function getPersonalSmeVisualHtml(secNumber: number, title: string, projectTitle: string): string {
  const pName = projectTitle || "Kajian Usaha Mandiri & Bisnis UMKM";
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
          { label: "Payung Regulasi", val: "UU Cipta Kerja PP 7/2021", sub: "Kemudahan & Insentif Usaha Mikro", color: "#2563eb" },
          { label: "Legalitas Dasar", val: "NIB Perseorangan OSS RBA", sub: "Izin Usaha Mandiri Resmi Terbit", color: "#059669" },
          { label: "Target Kepuasan (CSAT)", val: "≥ 95.2% Bintang 5", sub: "Standar Keramahan & Kebersihan", color: "#7c3aed" },
          { label: "Status Kelayakan", val: "SANGAT LAYAK (GO)", sub: "● Skor Usaha Mandiri 91.8 / 100", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 1.1: Matriks Legalitas Usaha Mandiri & Kepatuhan Regulasi UMKM</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Instrumen Legalitas & Perizinan</th>
              <th style="${thStyle}">Instansi Penerbit</th>
              <th style="${thStyle}">Fungsi & Kewajiban</th>
              <th style="${thStyle}">Status Kesiapan Unit Usaha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>NIB Perseorangan Berbasis Risiko</strong></td>
              <td style="${tdStyle}">Kementerian Investasi / BKPM via OSS</td>
              <td style="${tdStyle}">Identitas legalitas usaha resmi, tanda daftar usaha</td>
              <td style="${tdStyle}">100% Siap Didaftarkan Melalui Sistem OSS</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Sertifikasi Halal Gratis (SEHATI)</strong></td>
              <td style="${tdAltStyle}">BPJPH Kemenag & LPPOM</td>
              <td style="${tdAltStyle}">Jaminan kehalalan produk pangan untuk konsumen</td>
              <td style="${tdAltStyle}">Proses Pendampingan PPH Resmi Siap Dijalankan</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>NPWP & Pajak Final UMKM (PP 23/2018)</strong></td>
              <td style="${tdStyle}">Direktorat Jenderal Pajak (DJP)</td>
              <td style="${tdStyle}">Kepatuhan pajak dengan tarif ringan 0.5%</td>
              <td style="${tdStyle}">Terdaftar Resmi & Bebas Pajak sd Omset Rp 500 Jt</td>
            </tr>
          </tbody>
        </table>
      `;

    case 2:
      return `
        ${renderMetricCards([
          { label: "Trafik Area Sekitar", val: "800 - 1.500 Orang / Hari", sub: "Potensi Konsumen Pejalan & Kendaraan", color: "#2563eb" },
          { label: "Margin Laba Kotor", val: "48.0% - 55.0%", sub: "Efisiensi Pembelian Grosir Bahan", color: "#059669" },
          { label: "Margin Laba Bersih", val: "28.5% - 34.7%", sub: "Tingkat Profitabilitas Sangat Sehat", color: "#7c3aed" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 2.1: Analisis Profil Pelanggan Sasaran & Keunggulan Nilai Tambah</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Segmen Pelanggan Sasaran</th>
              <th style="${thStyle}">Kebutuhan Pokok</th>
              <th style="${thStyle}">Kelemahan Pesaing Sekitar</th>
              <th style="${thStyle}">Keunggulan Nilai Tambah Unit Usaha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Pekerja Kantor & Wirausaha</strong></td>
              <td style="${tdStyle}">Kecepatan layanan & tempat nyaman ber-AC/Wifi</td>
              <td style="${tdStyle}">Antrean lambat & tidak ada QRIS non-tunai</td>
              <td style="${tdStyle}">Layanan di bawah 5 menit & pembayaran QRIS cepat</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Keluarga & Warga Perumahan</strong></td>
              <td style="${tdAltStyle}">Kebersihan terjamin & harga bersahabat</td>
              <td style="${tdAltStyle}">Tempat kurang bersih & parkir sempit</td>
              <td style="${tdAltStyle}">Tempat higienis, ramah anak & area parkir aman</td>
            </tr>
          </tbody>
        </table>
      `;

    case 3:
      return `
        ${renderMetricCards([
          { label: "Total Modal Awal (CAPEX)", val: "Rp 220.000.000", sub: "Sewa 34.1% / Renov 29.5% / Alat 25.0%", color: "#2563eb" },
          { label: "Biaya Operasional (OPEX)", val: "Rp 62.000.000 / Bln", sub: "Bahan Baku 45.2% / Gaji 29.0% / Utilitas 10.5%", color: "#059669" },
          { label: "Proyeksi Laba Bersih", val: "Rp 33.400.000 / Bln", sub: "35.0% Net Profit Margin", color: "#7c3aed" },
          { label: "Titik Impas (Payback)", val: "6.6 - 8.5 Bulan", sub: "★ ROI Tahunan 82.5% Sangat Prima", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 3.1: Rincian Modal Awal (CAPEX) & Biaya Operasional (OPEX) Bulanan</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Komponen Biaya</th>
              <th style="${thStyle}">Nominal (Rp)</th>
              <th style="${thStyle}">Porsi %</th>
              <th style="${thStyle}">Rincian Penggunaan Anggaran</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Sewa Tempat Usaha (1 - 2 Tahun)</strong></td>
              <td style="${tdStyle}">Rp 75.000.000</td>
              <td style="${tdStyle}">34.09%</td>
              <td style="${tdStyle}">Sewa lokasi strategis di pinggir jalan utama / kawasan ramai</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Renovasi Interior, Estetika & Signage</strong></td>
              <td style="${tdAltStyle}">Rp 65.000.000</td>
              <td style="${tdAltStyle}">29.55%</td>
              <td style="${tdAltStyle}">Pekerjaan booth, meja kasir, instalasi lampu, AC & neon box</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Peralatan Kerja Utama & Mesin</strong></td>
              <td style="${tdStyle}">Rp 55.000.000</td>
              <td style="${tdStyle}">25.00%</td>
              <td style="${tdStyle}">Mesin operasional utama, chiller, tablet kasir POS & printer</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Modal Kerja Awal & Stok Bahan</strong></td>
              <td style="${tdAltStyle}">Rp 25.000.000</td>
              <td style="${tdAltStyle}">11.36%</td>
              <td style="${tdAltStyle}">Pembelian bahan baku awal, seragam staf & kas operasional</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>TOTAL MODAL AWAL (CAPEX)</strong></td>
              <td style="${tdStyle}"><strong>Rp 220.000.000</strong></td>
              <td style="${tdStyle}"><strong>100.0%</strong></td>
              <td style="${tdStyle}">60% Tabungan Mandiri / 40% Kemitraan Keluarga & Modal Kerja</td>
            </tr>
          </tbody>
        </table>
      `;

    case 4:
      return `
        ${renderMetricCards([
          { label: "Kapasitas Harian", val: "150 Transaksi / Hari", sub: "Jam Buka 10:00 - 22:00 (12 Jam)", color: "#2563eb" },
          { label: "Target Kunjungan", val: "110 - 125 Pelanggan / Hari", sub: "Utilisasi Layanan Optimal 83.3%", color: "#059669" },
          { label: "Waktu Tunggu", val: "< 6 Menit / Pesanan", sub: "SOP Layanan Cepat & Higienis", color: "#d97706" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel 4.1: Kapasitas Layanan Harian vs Pola Kunjungan Konsumen</div>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Periode Waktu Operasional</th>
              <th style="${thStyle}">Pola Trafik Konsumen</th>
              <th style="${thStyle}">Alokasi Staf Siaga</th>
              <th style="${thStyle}">Strategi Optimasi Layanan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Makan Siang (11:30 - 13:30)</strong></td>
              <td style="${tdStyle}">Tinggi (Peak Hours 1) - 45 transaksi</td>
              <td style="${tdStyle}">Semua staf siap di pos pelayanan</td>
              <td style="${tdStyle}">Bahan siap saji disiapkan sebelumnya (pre-prep)</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Sore - Malam (17:30 - 20:30)</strong></td>
              <td style="${tdAltStyle}">Sangat Tinggi (Peak Hours 2) - 55 transaksi</td>
              <td style="${tdAltStyle}">Semua staf siap & kasir siaga penuh</td>
              <td style="${tdAltStyle}">Optimasi transaksi QRIS untuk mencegah antrean panjang</td>
            </tr>
          </tbody>
        </table>
      `;

    default:
      return `
        ${renderMetricCards([
          { label: "Efisiensi Operasional", val: "Kepuasan 95.2%", sub: "Standar Layanan Usaha Mandiri", color: "#2563eb" },
          { label: "Kepatuhan Regulasi", val: "NIB OSS RBA Terbit", sub: "Sertifikasi Higiene & Halal", color: "#059669" },
          { label: "Evaluasi Pilar", val: "Memenuhi Syarat", sub: "Parameter Terverifikasi Prima", color: "#7c3aed" }
        ])}
        <div style="${sectionHeaderStyle}">Tabel: Parameter Kinerja Usaha Mandiri - Pilar ${secNumber} (${title})</div>
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
              <td style="${tdStyle}"><strong>Kecepatan Pelayanan & Kualitas</strong></td>
              <td style="${tdStyle}">Waktu tunggu < 6 menit</td>
              <td style="${tdStyle}">Tercapai dengan alur kerja SOP ringkas</td>
              <td style="${tdStyle}">Sesuai Standar Layanan Prima</td>
            </tr>
            <tr>
              <td style="${tdAltStyle}"><strong>Kepatuhan Usaha Mandiri</strong></td>
              <td style="${tdAltStyle}">NIB OSS RBA & Kerapian Tempat</td>
              <td style="${tdAltStyle}">100% Mengikuti Pedoman Kemudahan UMKM PP 7/2021</td>
              <td style="${tdAltStyle}">Terdaftar Resmi & Siap Beroperasi</td>
            </tr>
          </tbody>
        </table>
      `;
  }
}
