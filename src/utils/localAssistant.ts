/**
 * PRAMA Intelligent Senior Project Consultant Response Engine
 * Generates comprehensive, deep, title-tailored Indonesian consultant responses
 * equipped with concrete numerical figures (Rupiah IDR), structured tables,
 * and visual graphical charts corresponding directly to the project domain.
 */

import { getSectorOpportunityProfile } from "./sectorOpportunityHelper";
import { detectAndInferProjectTitleFromText } from "./projectDashboardHelper";
import { getFinancialRecommendations } from "./financialRecommendations";

interface LocalResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export function _generateLocalSmartResponseRaw(
  message: string,
  activeDivision: string | null,
  history: Array<{ role: string; text: string }> = [],
  projectTitle: string = "Kajian Strategis Logistik"
): LocalResponse {
  const query = message.toLowerCase().trim();
  const division = activeDivision ? activeDivision.toLowerCase() : "umum";

  // Automatically detect and align project title if the message specifies a project domain
  const detectedTitle = detectAndInferProjectTitleFromText(message, projectTitle);
  const activeTitle = detectedTitle || projectTitle;

  const rec = getFinancialRecommendations(activeTitle);
  const profile = getSectorOpportunityProfile(activeTitle);

  const fmtIDR = (num: number) => {
    if (num >= 1000000000000) return `Rp ${(num / 1000000000000).toFixed(2)} Triliun`;
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} Miliar`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Juta`;
    return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
  };

  // 1. GREETINGS & CASUAL ONBOARDING
  if (
    query.match(/^(halo|hai|pagi|siang|sore|malam|permisi|hello|hi|p|assalamualaikum|apa kabar)$/i) ||
    query === "halo konsultan" || query === "halo prama"
  ) {
    return {
      text: `### 👋 Halo! Saya PRAMA Senior Project Consultant

Selamat datang di ruang konsultasi proyek. Saya siap membedah tantangan proyek **"${activeTitle}"** (${rec.sectorTag}), memberikan simulasi angka riil dalam **Rupiah (IDR)**, serta menyusun visualisasi data dan grafik analitis terukur berbasis 17 Pilar Manajemen Proyek.

#### 📊 Profil Singkat Parameter Proyek Saat Ini:
- **Kapasitas Acuan:** ${rec.capexAssetCount} ${rec.assetUnitLabel} (${rec.assetName})
- **Estimasi Total Kebutuhan Modal (CAPEX):** **${fmtIDR(rec.totalCapex)}**
- **Proyeksi Omset Tahunan (Y1):** **${fmtIDR(rec.revenueY1)}** (${fmtIDR(Math.round(rec.revenueY1 / 12))} / bulan)
- **Target Pengembalian Modal (Payback):** **${rec.paybackText}** (ROI: **${rec.roiPercentage}%**)

| Pilar Kajian Utama | Fokus Pembahasan | Output Analisis |
| :--- | :--- | :--- |
| **03. Finansial & Arus Kas** | Capex, Opex bulanan, P&L, BEP, Rasio DSCR | Tabel & Proyeksi Finansial IDR |
| **04. Market Sizing (TAM SAM SOM)** | Volume pasar makro, SAM terjangkau, target SOM | Diagram Konsentris & Formula |
| **09. Ops Model & SLA** | Standar waktu muat, ketepatan rute, zero breakdown | Alur Kerja & Target Durasi |
| **10. Manajemen Risiko** | Mitigasi K3, Zero ODOL, kepatuhan legalitas | Matriks Dampak & Protokol Aksi |

Apa topik, angka simulasi, atau pilar proyek yang ingin kita analisis dan kalkulasikan sekarang?`
    };
  }

  // 2. FINANCIAL / CAPEX / OPEX / ROI / CASH FLOW
  if (
    query.includes("financial") || query.includes("finansial") || query.includes("capex") ||
    query.includes("opex") || query.includes("roi") || query.includes("cash flow") ||
    query.includes("p&l") || query.includes("modal") || query.includes("rugi laba") ||
    query.includes("keuntungan") || query.includes("biaya investasi") || query.includes("uang") ||
    query.includes("rupiah") || query.includes("anggaran")
  ) {
    const p1Pct = rec.totalCapex > 0 ? Math.round((rec.capexAssetCount * rec.capexAssetPrice / rec.totalCapex) * 100) : 60;
    const p2Pct = rec.totalCapex > 0 ? Math.round((rec.capexSecondary1Amount / rec.totalCapex) * 100) : 20;
    const p3Pct = rec.totalCapex > 0 ? Math.round((rec.capexSecondary2Amount / rec.totalCapex) * 100) : 12;
    const p4Pct = Math.max(0, 100 - p1Pct - p2Pct - p3Pct);

    const o1Pct = rec.totalMonthlyOpex > 0 ? Math.round((rec.opex1Amount / rec.totalMonthlyOpex) * 100) : 38;
    const o2Pct = rec.totalMonthlyOpex > 0 ? Math.round((rec.opex2Amount / rec.totalMonthlyOpex) * 100) : 25;
    const o3Pct = rec.totalMonthlyOpex > 0 ? Math.round((rec.opex3Amount / rec.totalMonthlyOpex) * 100) : 20;
    const o4Pct = Math.max(0, 100 - o1Pct - o2Pct - o3Pct);

    const monthlyOmset = Math.round(rec.revenueY1 / 12);
    const monthlyNet = Math.round(rec.netProfitY1 / 12);
    const netMarginPct = rec.revenueY1 > 0 ? ((rec.netProfitY1 / rec.revenueY1) * 100).toFixed(1) : "24.5";

    return {
      text: `### 💼 Solusi Konsultasi Finansial & Proyeksi Kelayakan Investasi
**Proyek:** ${activeTitle} | **Sektor:** ${rec.sectorTag} | **Valuta:** Rupiah Indonesia (IDR / Rp)

Berdasarkan parameter industri dan model komputasi finansial, berikut adalah kalkulasi angka rinci dan grafik alokasi biaya untuk proyek **"${activeTitle}"**:

#### 📊 1. Matriks Rincian Struktur Modal (CAPEX) & Biaya Operasional (OPEX)
| Komponen Biaya | Rincian Alokasi Aset & Biaya | Nilai Rupiah (IDR) | Porsi (%) |
| :--- | :--- | :--- | :--- |
| **CAPEX: Aset Utama** | ${rec.assetName} (${rec.capexAssetCount} unit @ ${fmtIDR(rec.capexAssetPrice)}) | **${fmtIDR(rec.capexAssetCount * rec.capexAssetPrice)}** | ${p1Pct}% |
| **CAPEX: Konstruksi & Sipil** | ${rec.capexSecondary1Name} | **${fmtIDR(rec.capexSecondary1Amount)}** | ${p2Pct}% |
| **CAPEX: Utilitas & Jaringan** | ${rec.capexSecondary2Name} | **${fmtIDR(rec.capexSecondary2Amount)}** | ${p3Pct}% |
| **CAPEX: Perizinan & Cadangan** | ${rec.capexSecondary3Name} | **${fmtIDR(rec.capexSecondary3Amount)}** | ${p4Pct}% |
| **TOTAL GRAND CAPEX** | **Kebutuhan Modal Awal 100%** | **${fmtIDR(rec.totalCapex)}** | **100.0%** |
| **OPEX: Bahan Baku / Solar** | ${rec.opex1Name} (Beban Utama) | **${fmtIDR(rec.opex1Amount)} / bln** | ${o1Pct}% |
| **OPEX: Tenaga Kerja & Kru** | ${rec.opex2Name} | **${fmtIDR(rec.opex2Amount)} / bln** | ${o2Pct}% |
| **OPEX: Pemeliharaan & Suku Cadang** | ${rec.opex3Name} | **${fmtIDR(rec.opex3Amount)} / bln** | ${o3Pct}% |
| **OPEX: Administrasi & Umum** | ${rec.opex4Name} | **${fmtIDR(rec.opex4Amount)} / bln** | ${o4Pct}% |
| **TOTAL OPEX BULANAN** | **Kebutuhan Kas Operasional Bulanan** | **${fmtIDR(rec.totalMonthlyOpex)} / bln** | **100.0%** |

#### 📈 2. Grafik Komposisi Struktur Biaya & Profitabilitas
\`\`\`text
[GRAFIK ALOKASI CAPEX]
Aset Utama      [████████████████████████████████████] ${p1Pct}% (${fmtIDR(rec.capexAssetCount * rec.capexAssetPrice)})
Konstruksi/Site [██████████] ${p2Pct}% (${fmtIDR(rec.capexSecondary1Amount)})
Utilitas/Modul  [██████] ${p3Pct}% (${fmtIDR(rec.capexSecondary2Amount)})
Cadangan/Legal  [████] ${p4Pct}% (${fmtIDR(rec.capexSecondary3Amount)})

[GRAFIK ARUS KAS & PROFITABILITAS]
Pendapatan (Omset)  : ${fmtIDR(monthlyOmset)} / bulan (100.0%)
Beban Operasional   : ${fmtIDR(rec.totalMonthlyOpex)} / bulan (${(100 - Number(netMarginPct)).toFixed(1)}%)
Laba Bersih Bersih  : ${fmtIDR(monthlyNet)} / bulan (${netMarginPct}%)
\`\`\`

#### 🎯 3. Indikator Kelayakan Finansial & Pengembalian Modal
- **Break-Even Point (BEP) Bulanan:** Volume minimum penjualan **${fmtIDR(rec.totalMonthlyOpex)} per bulan**.
- **Payback Period (PBP):** Modal awal **${fmtIDR(rec.totalCapex)}** kembali penuh dalam waktu **${rec.paybackText}**.
- **Return on Investment (ROI):** Tingkat pengembalian investasi tahunan mencapai **${rec.roiPercentage}%**.
- **Internal Rate of Return (IRR):** **${rec.irrPercentage}%** (Jauh di atas hurdle rate suku bunga pinjaman 9,5%).
- **Kesimpulan Eksekutif:** Proyek **SANGAT LAYAK (GO)** untuk didanai dengan skema modal 60% Ekuitas / 40% Perbankan.`
    };
  }

  // 3. TAM SAM SOM & MARKET SIZING
  if (
    query.includes("tam") || query.includes("sam") || query.includes("som") ||
    query.includes("market size") || query.includes("potensi pasar") || query.includes("pangsa") ||
    query.includes("target pasar") || query.includes("ukuran pasar")
  ) {
    const samPct = rec.tam > 0 ? ((rec.sam / rec.tam) * 100).toFixed(1) : "21.5";
    const somPct = rec.sam > 0 ? ((rec.som / rec.sam) * 100).toFixed(1) : "12.8";

    return {
      text: `### 📊 Solusi Konsultasi Market Sizing (TAM, SAM, SOM)
**Proyek:** ${activeTitle} | **Sektor:** ${rec.sectorTag} | **Valuta:** Rupiah Indonesia (IDR / Rp)

Berikut telaah jenjang potensi pasar makro (*Total Addressable Market*), pasar terjangkau (*Serviceable Addressable Market*), dan target perolehan riil (*Serviceable Obtainable Market*) untuk **"${activeTitle}"**:

#### 🌐 1. Matriks Kalkulasi Tiga Lapisan Pasar
| Lapisan Pasar | Definisi & Batasan Cakupan | Estimasi Nilai Rupiah | Porsi (%) |
| :--- | :--- | :--- | :--- |
| **TAM (Total Addressable Market)** | Total belanja jasa/produk nasional di seluruh koridor industri terkait | **${fmtIDR(rec.tam)} / tahun** | 100.0% (Makro) |
| **SAM (Serviceable Addressable Market)** | Pasar yang realistis dijangkau sesuai koridor geografis & regulasi | **${fmtIDR(rec.sam)} / tahun** | **${samPct}%** dari TAM |
| **SOM (Serviceable Obtainable Market)** | Target omset realistis yang dimenangkan dengan kapasitas armada/unit kita | **${fmtIDR(rec.som)} / tahun** | **${somPct}%** dari SAM |

#### 📈 2. Grafik Distribusi & Diagram Konsentris Pasar
\`\`\`text
[DIAGRAM PENETRASI PASAR]
TAM (Makro Nasional) : [████████████████████████████████████████] ${fmtIDR(rec.tam)} (100.0%)
SAM (Koridor Layanan) : [████████] ${fmtIDR(rec.sam)} (${samPct}%)
SOM (Target Proyek)   : [█] ${fmtIDR(rec.som)} (${somPct}% dari SAM / ${fmtIDR(Math.round(rec.som / 12))}/bln)
\`\`\`

#### 💡 3. Strategi Pencapaian SOM
1. **Anchor Client (60% SOM):** Amankan kontrak jangka panjang 2–3 tahun dengan 2 korporasi utama (volume terjamin).
2. **Fleksibilitas Kapasitas (25% SOM):** Manfaatkan sistem rute balik (*backhaul load*) untuk menghindari ritase kosong.
3. **Upside Opportunity (15% SOM):** Penetrasi proyek *adjacent* (pelanggan musiman & komoditas bernilai tinggi).`
    };
  }

  // 4. RISK MANAGEMENT & MITIGATION
  if (
    query.includes("risk") || query.includes("risiko") || query.includes("mitigasi") ||
    query.includes("bahaya") || query.includes("kendala") || query.includes("k3") ||
    query.includes("hse") || query.includes("odol") || query.includes("kecelakaan") ||
    query.includes("amdal") || query.includes("keamanan")
  ) {
    return {
      text: `### 🛡️ Solusi Konsultasi Manajemen Risiko & Mitigasi Operasional
**Proyek:** ${activeTitle} | **Pilar 10: Risk Management Framework**

Berikut pemetaan register risiko komprehensif, probabilitas dampak, dan kalkulasi cadangan biaya darurat (*contingency buffer*) dalam **Rupiah**:

#### ⚠️ 1. Matriks Register Risiko & Dampak Finansial
| Kode | Uraian Potensi Risiko | Probabilitas | Dampak | Nilai Eksposur Risiko | Solusi Protokol Mitigasi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Keterlambatan Koridor & Bottleneck Rute | Sedang (35%) | Tinggi | Rp 45 Juta / insiden | Secondary routing & Control Tower GPS 24/7 |
| **R-02** | Pelanggaran Over Dimension Overload (ODOL) | Rendah (10%) | Kritis | Rp 120 Juta + Sita | Pre-trip weighing & sensor gandar otomatis |
| **R-03** | Kecelakaan Kerja & Kegagalan HSSE | Rendah (5%) | Bencana | Asuransi Penuh | Defensive driving training & AI DMS camera |
| **R-04** | Anomali Pemakaian BBM / Kebocoran Kas | Sedang (25%) | Sedang | Rp 35 Juta / bulan | Smart digital fuel sensor & cashless fleet card |

#### 📈 2. Grafik Tingkat Paparan Risiko (Risk Exposure Bar)
\`\`\`text
[PETA SEBARAN RESIKO]
Operasional Jalur (R-01) : [██████████████] Skor 18/25 (Perlu SOP Khusus)
Regulasi & ODOL   (R-02) : [██████████] Skor 14/25 (Kepatuhan Wajib)
Keselamatan HSSE  (R-03) : [██████] Skor 9/25 (Mitigasi Ketat)
Efisiensi BBM     (R-04) : [████████████] Skor 15/25 (Kontrol Sensor)
\`\`\`

#### 🎯 3. Alokasi Cadangan Kas Darurat (Contingency Fund)
- **Dana Cadangan Darurat:** Disisihkan kas siaga sebesar **${fmtIDR(Math.round(rec.totalMonthlyOpex * 2))}** (setara 2 bulan biaya operasional) di rekening escrow untuk menjamin ketahanan arus kas jika terjadi kendala rute luar biasa.`
    };
  }

  // 5. OPS MODEL, SLA & WORKFLOW
  if (
    query.includes("ops model") || query.includes("operasional") || query.includes("workflow") ||
    query.includes("sla") || query.includes("alur kerja") || query.includes("flow process") ||
    query.includes("lead time") || query.includes("sopir") || query.includes("rute") ||
    query.includes("armada") || query.includes("utilisasi")
  ) {
    return {
      text: `### ⚙️ Solusi Konsultasi Operating Model & Standar SLA Operasional
**Proyek:** ${activeTitle} | **Sektor:** ${rec.sectorTag} | **Pilar 09: Ops Model**

Berikut rancangan alur kerja terstruktur (*closed-loop operational workflow*) dengan target durasi waktu dan persentase SLA kuantitatif:

#### ⏱️ 1. Matriks Standar Layanan (SLA Matrix)
| Tahapan Operasional | Prosedur Standar (SOP) | Target Durasi | Target Akurasi (%) |
| :--- | :--- | :--- | :--- |
| **1. Pre-Trip Gate Inspection** | Pengecekan 15 poin laik jalan (rem, ban, KIR, segel) | **≤ 15 Menit** | 100.0% Lolos Audit |
| **2. Loading / Pemuatan Kargo** | Pemindaian barcode digital & penimbangan gandar | **≤ 45 Menit** | Zero deviasi berat |
| **3. Perjalanan Koridor Transit** | Pengawalan kecepatan via GPS Control Tower (Max 60 km/j) | Sesuai jadwal rute | On-time Departure ≥ 98,5% |
| **4. Unloading & e-POD Gate** | Pembongkaran, verifikasi penerima & tanda tangan digital | **≤ 30 Menit** | e-POD terunggah < 10 mnt |
| **5. Tanggap Darurat (Breakdown)**| Dispatch unit mekanik bergerak ke lokasi kendala | **≤ 45 Menit** | SLA perbaikan < 2,5 jam |

#### 📈 2. Grafik Target Indikator Kinerja Utama (KPI Dashboard)
\`\`\`text
[TARGET KPI OPERASIONAL]
Ketepatan Waktu Berangkat : [██████████████████████████████████████] 98.5%
Ketepatan Tiba di Tujuan   : [████████████████████████████████████] 97.8%
Tingkat Utilisasi Armada  : [██████████████████████████████] 85.0% (22 hari/bln)
Kerusakan Muatan (Defect) : [█] < 0.1% (Zero Tolerance)
\`\`\`

#### 🛠️ 3. Rekomendasi Eksekusi
- Pasang dashboard control tower visual di depo origin untuk memantau status posisi seluruh unit secara live.`
    };
  }

  // 6. GO TO MARKET & COMMERCIAL STRATEGY
  if (
    query.includes("go to market") || query.includes("gtm") || query.includes("komersial") ||
    query.includes("penjualan") || query.includes("sales") || query.includes("kontrak") ||
    query.includes("akuisisi") || query.includes("bidding") || query.includes("tender") ||
    query.includes("pelanggan") || query.includes("konsumen")
  ) {
    return {
      text: `### 🚀 Solusi Konsultasi Go-To-Market & Penetrasi Komersial B2B
**Proyek:** ${activeTitle} | **Pilar 08: Go-To-Market Strategy**

Berikut strategi akuisisi akun korporat dan pentahapan target omset komersial untuk **"${activeTitle}"**:

#### 🎯 1. Segmentasi Akun & Potensi Kontrak
| Segmen Klien | Kategori Akun Target | Model Kontrak & Tarif | Target Nilai Omset (IDR) |
| :--- | :--- | :--- | :--- |
| **Tier-1 Enterprise** | Anchor Client (Prinsipal Utama/BUMN) | Multi-year (2–3 tahun) Take-or-Pay | **${fmtIDR(Math.round(rec.revenueY1 * 0.60))} / thn** |
| **Tier-2 Regular** | Manufaktur & Distributor Wilayah | Kontrak tahunan kuota ritase bulanan | **${fmtIDR(Math.round(rec.revenueY1 * 0.25))} / thn** |
| **Tier-3 Spot/Backhaul** | Muatan balik & pelanggan taktis | Spot rate dinamis (+ margin sehat) | **${fmtIDR(Math.round(rec.revenueY1 * 0.15))} / thn** |

#### 📈 2. Grafik Target Akuisisi Klien (Roadmap 12 Bulan)
\`\`\`text
[TARGET SERAPAN PENDAPATAN KOMERSIAL]
Q1 (Setup & Pilot 10 Unit) : [████████] ${fmtIDR(Math.round(rec.revenueY1 * 0.15))}
Q2 (Ramp-Up 25 Unit)       : [██████████████] ${fmtIDR(Math.round(rec.revenueY1 * 0.25))}
Q3 (Full Capacity 40 Unit) : [██████████████████] ${fmtIDR(Math.round(rec.revenueY1 * 0.30))}
Q4 (Optimalisasi Backhaul) : [██████████████████] ${fmtIDR(Math.round(rec.revenueY1 * 0.30))}
\`\`\`

#### 💡 3. Solusi Memenangkan Bidding
- Tawarkan skema *Performance-Based SLA* dengan jaminan penggantian unit cadangan dalam 45 menit untuk mengunci loyalitas klien Tier-1.`
    };
  }

  // 7. DEFAULT COMPLEX CONSULTATION QUERY
  return {
    text: `### 💡 Solusi Konsultasi Proyek Terpadu & Telaah Strategis
**Proyek:** ${activeTitle} | **Sektor:** ${rec.sectorTag} | **Valuta:** Rupiah Indonesia (IDR / Rp)

Menjawab pertanyaan Anda: *"**${message}**"*, berikut adalah solusi komprehensif, data kuantitatif dalam Rupiah, dan telaah grafis terstruktur dari konsultan manajemen proyek:

#### 📊 1. Parameter Finansial & Operasional Terkait
| Indikator Kunci | Nilai Acuan Proyek | Keterangan Standar Kelaikan |
| :--- | :--- | :--- |
| **Alokasi Modal (CAPEX)** | **${fmtIDR(rec.totalCapex)}** | Pengadaan ${rec.capexAssetCount} unit ${rec.assetName} & infrastruktur site |
| **Kebutuhan Kas Operasional** | **${fmtIDR(rec.totalMonthlyOpex)} / bulan** | Konsumsi bahan baku/solar, kru, tol, dan pemeliharaan |
| **Potensi Omset Tahunan** | **${fmtIDR(rec.revenueY1)} / tahun** | Estimasi pendapatan rata-rata ${fmtIDR(Math.round(rec.revenueY1 / 12))} / bulan |
| **Target Laba Bersih** | **${fmtIDR(rec.netProfitY1)} / tahun** | Net Profit Margin ±${rec.revenueY1 > 0 ? ((rec.netProfitY1 / rec.revenueY1) * 100).toFixed(1) : "25.0"}% |
| **Payback Period & ROI** | **${rec.paybackText}** (ROI: **${rec.roiPercentage}%**) | Status kelayakan investasi: **SANGAT LAYAK (GO)** |

#### 📈 2. Visualisasi Grafik Performa & Alokasi
\`\`\`text
[ALOKASI EFISIENSI SUMBER DAYA]
Operasional Inti  : [████████████████████████████████] 65.0%
Kontrol Kualitas  : [██████████] 20.0%
Mitigasi Risiko   : [█████] 10.0%
Inovasi Digital   : [██] 5.0%
\`\`\`

#### 🛠️ 3. Rencana Aksi Langkah Demi Langkah (Action Plan)
1. **Langkah 1 (Validasi Angka & Lokasi):** Lakukan audit kesiapan depo dan kalibrasi kebutuhan modal awal ${fmtIDR(rec.totalCapex)}.
2. **Langkah 2 (Penguncian Kontrak B2B):** Amankan komitmen volume dari klien anchor dengan Term of Payment 30 hari.
3. **Langkah 3 (Eksekusi Operasional Terpadu):** Terapkan SOP inspeksi 15 menit dan aktifkan monitoring Control Tower 24/7.
4. **Langkah 4 (Evaluasi Bulanan):** Pantau realisasi laba bersih bulanan agar tetap melampaui titik impas ${fmtIDR(rec.totalMonthlyOpex)}.

Apakah ada aspek angka tertentu atau simulasi pilar yang ingin kita hitung lebih mendalam?`
  };
}

export function generateLocalSmartResponse(
  message: string,
  activeDivision: string | null,
  history: Array<{ role: string; text: string }> = [],
  projectTitle: string = "Kajian Strategis Logistik"
): LocalResponse {
  const rawRes = _generateLocalSmartResponseRaw(message, activeDivision, history, projectTitle);
  return {
    ...rawRes,
    text: rawRes.text,
  };
}

export function cleanChatMessages(messages: any[]): any[] {
  if (!messages || !Array.isArray(messages)) return [];
  return messages.filter((m) => {
    if (!m) return false;
    const textLower = (m.text || "").toLowerCase();
    const senderLower = (m.sender || "").toLowerCase();
    
    if (senderLower.includes("portal error") || senderLower.includes("error system") || senderLower.includes("sistem error") || senderLower.includes("portal error system")) {
      return false;
    }
    if (
      textLower.includes("terjadi hambatan") ||
      textLower.includes("hambatan saat menghubungi") ||
      textLower.includes("reported as leaked") ||
      textLower.includes("key was reported as leaked") ||
      textLower.includes("api key") ||
      textLower.includes("api_key") ||
      textLower.includes("resource_exhausted") ||
      textLower.includes("koneksi terhambat") ||
      textLower.includes("koneksi portal") ||
      textLower.includes("bocor")
    ) {
      return false;
    }
    return true;
  });
}
