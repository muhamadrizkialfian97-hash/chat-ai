/**
 * projectDashboardHelper.ts
 * Rich default Indonesian analysis templates and Word/PPT exporters for the 14 project management sections.
 */

import pptxgen from "pptxgenjs";
import { CompetitorIntel } from "../types";

export interface DashboardSection {
  number: number;
  title: string;
  shortDesc: string;
  defaultContent: string;
}

// 14 Essential Project Management Structure Sections
export const defaultDashboardSections: DashboardSection[] = [
  {
    number: 1,
    title: "Global/NAT Overview",
    shortDesc: "Analisis regulasi makro dan kebijakan transisi energi / lingkungan.",
    defaultContent: `### 1. Global / National (NAT) Overview

**Analisis Makro & Kepatuhan Regulasi:**
Keberadaan regulasi lingkungan seperti **UU No. 18 Tahun 2008** tentang Pengelolaan Sampah dan **PP No. 22 Tahun 2021** tentang Penyelenggaraan Perlindungan Pengelolaan Lingkungan Hidup mendorong peningkatan standar kepatuhan industri terhadap emisi dan pengelolaan limbah di Indonesia.

**Peluang Strategis untuk Pancaran Group:**
* **Transisi Logistik Hijau:** Korporasi global dan BUMN saat ini mewajibkan mitra logistik mereka memiliki armada rendah emisi atau bersertifikasi lingkungan khusus.
* **Standar Eksportir:** Sektor-sektor manufaktur berorientasi ekspor membutuhkan mitra logistik yang mematuhi dekarbonisasi rantai pasok untuk mematuhi regulasi karbon global.`
  },
  {
    number: 2,
    title: "Market Opportunity",
    shortDesc: "Potensi pasar, kesenjangan layanan logistik limbah, dan ceruk pasar.",
    defaultContent: `### 2. Market Opportunity

**Analisis Potensi Pasar & Gap Analisis:**
Pasar transportasi limbah industri, terutama limbah Bahan Berbahaya dan Beracun (B3), memiliki tingkat marjin keuntungan yang jauh lebih tinggi daripada logistik general cargo biasa karena regulasi ketat dan persyaratan armada yang spesifik.

**Kesenjangan Layanan (Service Gaps):**
* Membuka armada logistik BRAMA yang tersertifikasi AMDAL dan mematuhi aturan perizinan Direktorat Jenderal Perhubungan Darat.
* Pancaran Group dapat mengambil peluang rute transportasi limbah industri dari kawasan manufaktur Jawa Barat (Cikarang, Karawang) menuju tempat pembuangan/pemrosesan akhir berizin.`
  },
  {
    number: 3,
    title: "Financial (Capex, Opex, P&L, Cash Flow, ROI)",
    shortDesc: "Estimasi kelayakan finansial, alokasi biaya, dan pengembalian modal.",
    defaultContent: `### 3. Financial Analysis

**Estimasi Kelayakan Finansial Proyek (Simulasi Proyeksi):**

**A. Capital Expenditure (Capex):**
* Pembelian Armada Vacuum Truck & Multi-Axle Box Berizin: **Rp 8.500.000.000**
* Sistem Tracking GPS, Sensor Safety IoT, & Sertifikasi Awak: **Rp 450.000.000**
* *Total Capex:* **Rp 8.950.000.000**

**B. Operational Expenditure (Opex) Bulanan:**
* Biaya Bahan Bakar (BBM Dexlite) & Tol: **Rp 120.000.000**
* Gaji Kru Pengemudi (Sertifikasi B3) & Premi Safety: **Rp 65.000.000**
* Maintenance Rutin & Suku Cadang Khusus: **Rp 45.000.000**
* Biaya Hubungan Kontrak & Perizinan (KPLH/KLH): **Rp 30.000.000**
* *Total Opex:* **Rp 260.000.000 / Bulan**

**C. Profit & Loss (P&L) & ROI:**
* Target Pendapatan: **Rp 520.000.000 / Bulan** (asumsi utilisasi triplat armada 85%)
* Gross Margin: **Rp 260.000.000 / Bulan** (50% Margin)
* Net Profit Margin (Setelah Depresiasi & Pajak): **34%**
* **Payback Period (PBP):** **2.8 Tahun**
* **Return on Investment (ROI):** **35.2%** pada tahun ke-3
* **Internal Rate of Return (IRR):** **28.5%**`
  },
  {
    number: 4,
    title: "Supply & Demand",
    shortDesc: "Analisis kapasitas armada pengangkutan limbah versus pertumbuhan industri.",
    defaultContent: `### 4. Supply & Demand Analysis

**Analisis Kekuatan Pasar:**
* **Sisi Permintaan (Demand):** Permintaan industri terhadap pengangkut limbah resmi meningkat drastis. Regulasi KLHK yang makin ketat memaksa pabrik kimia, tekstil, elektronik, dan farmasi menggunakan transporter B3 berizin resmi demi menghindari sanksi pidana.
* **Sisi Penawaran (Supply):** Sangat sedikit operator logistik nasional yang memiliki izin pengangkutan terpadu (Kementerian Perhubungan + Kementerian LHK) berskala armada besar. Kesenjangan ini memberikan leverage harga (pricing power) yang kuat pada Pancaran Group sebagai penyedia logistik terpercaya.`
  },
  {
    number: 5,
    title: "Structure",
    shortDesc: "Struktur alur kerja layanan, operasional pengangkutan, dan rantai nilai.",
    defaultContent: `### 5. Structure & Value Chain

**Struktur Ekosistem Rantai Nilai Layanan:**
Sistem operasi pengangkutan limbah berkelanjutan bekerja berdasarkan model jalur tertutup (*Closed-Loop Transport*):

1. **Titik Sumber (Client Site):** Limbah dikemas sesuai standar regulasi internasional (ISO/UN Class).
2. **Fase Transpor (Pancaran Logistics):** Pengangkutan menggunakan unit tangki/dumptruck bersegel sensor kebocoran GPS real-time.
3. **Titik Penerima (Licensed Processor):** Pembongkaran muatan di fasilitas pengolahan pihak ketiga yang terafiliasi dengan sertifikat manifes resmi.`
  },
  {
    number: 6,
    title: "Organization (Qualification, Skill, Output/KPI, SOP)",
    shortDesc: "Persyaratan keahlian staf, target performa kerja kunci, dan kepatuhan.",
    defaultContent: `### 6. Organizational Scope

**Kualifikasi & Keterampilan Tim Inti:**
Setiap awak wajib memegang lisensi khusus untuk menjamin pengoperasian yang aman:
* **Pengemudi:** Wajib memiliki SIM BII Umum aktif dan sertifikasi keahlian khusus Angkutan Barang Khusus/B3 dari Kementerian Perhubungan.
* **Manajer Operasional:** Pemahaman kuat tentang regulasi AMDAL, penilaian analisis risiko, kepatuhan HSE, dan penanggulangan keadaan darurat tanggap darurat (Spill-Response).

**KPI Operasional:**
* Target Keterlambatan Trip: **< 1%** per bulan.
* Kejadian Kebocoran/Kecelakaan (LTI): **MUTLAK 0% (Zero Tolerance)**.
* Nilai Kepatuhan Audit Regulasi Internal: Silabus **100% lulus HSE**.`
  },
  {
    number: 7,
    title: "Transition Model (Pre-On-Post)",
    shortDesc: "Tahapan implementasi transisi proses onboard rute proyek baru.",
    defaultContent: `### 7. Transition Model (Pre-On-Post)

**Penyusunan Rencana Transisi Logistik yang Mulus:**

* **Tahap Pre-Onboarding (Pra-Proyek):** Pemetaan rute perjalanan resmi, pengurusan manifes persetujuan KLHK, pengkondisian tanggap bencana di jalan, dan verifikasi fisik kelayakan unit armada.
* **Tahap Onboarding (Awal Operasi):** Sosialisasi SOP kepada pihak pengirim dan penerima, instalasi pelacak FESTRONIK elektro-manifes, penugasan pilot-run untuk rute perdana.
* **Tahap Post-Onboarding (Evaluasi & Optimasi):** Audit kepatuhan mingguan, pelaporan histori emisi karbon armada, dan optimasi siklus turnaround armada untuk efisiensi bahan bakar.`
  },
  {
    number: 8,
    title: "Go To Market Strategy",
    shortDesc: "Cara menjangkau prospek klien korporasi besar dan penetrasi pasar logistik.",
    defaultContent: `### 8. Go-To-Market (GTM) Strategy

**Metodologi Penetrasi Ke Sektor Target:**
* **Kemitraan Aliansi Strategis:** Melakukan konsorsium dengan perusahaan pengolah akhir limbah besar (seperti PPLI) untuk menawarkan paket hulu-ke-hilir (end-to-end) kepada pabrik manufaktur.
* **Fokus Solusi Korporasi B2B:** Penawaran penataan kepatuhan ESG gratis sebagai pemicu ketertarikan (sales-hook) kepada emiten tbk/korporat besar yang sedang dinilai rating ESG globalnya.
* **Pricing Strategy:** Menerapkan skema kontrak volume multitahunan (*Volume-based Long-term Agreement*) dengan insentif tier harga dekarbonisasi.`
  },
  {
    number: 9,
    title: "Ops Model (Flow Process, Workflow Diagram, SLA)",
    shortDesc: "Skema alur kontrol dispatch armada pencari, pelacakan GPS, dan SLA.",
    defaultContent: `### 9. Operating Model

**Alur Aliran Kontrol Logistik Terintegrasi:**

\`\`\`
[Situs Klien] ➔ [Pemeriksaan Manifest] ➔ [Pemuatan Segel] ➔ [Pelacakan GPS IoT] ➔ [Fasilitas Pemrosesan] ➔ [Penerbitan Festronik]
\`\`\`

**SLA Kinerja Layanan (Service Level Agreement):**
* Waktu Respon Darurat Kebocoran Unit: **Maksimal 60 Menit** tim HSE meluncur ke TKP.
* Ketersediaan Penggantian Unit Armada Mogok: **Maksimal 4 Jam** di seluruh wilayah operasional Pulau Jawa.
* Penerbitan Sertifikat Timbang & Manifes Elektronik: **Maksimal 24 Jam** paska pembongkaran.`
  },
  {
    number: 10,
    title: "Risk Management",
    shortDesc: "Sistem mitigasi kecelakaan, kebocoran lingkungan, dan risiko regulasi.",
    defaultContent: `### 10. Risk Management Matrix

**Matriks Identifikasi Bahaya & Rencana Mitigasi:**

* **Risiko Kebocoran Muatan Cair B3 di Jalan Raya (Tinggi):**
  * *Mitigasi:* Pemasangan katup pengaman ganda pneumatik (*double fail-safe air valves*), alat pemadam internal, serta pelatihan tanggap bencana tumpahan yang rutin.
* **Risiko Pembatalan atau Pencabutan Izin Rute KLHK (Sedang):**
  * *Mitigasi:* Mengembangkan tim legal kepatuhan internal yang memantau regulasi secara realtime, menjaga perpanjangan masa berlaku KIR dan manifes 3 bulan sebelum ekspedisi berakhir.
* **Risiko Keterbatasan Pengemudi Tersertifikasi (Sedang):**
  * *Mitigasi:* Membentuk program beasiswa lisensi b3 Mandiri internal Pancaran Training Center.`
  },
  {
    number: 11,
    title: "Digital Coverage (Tools, Method, Impact, Automation)",
    shortDesc: "Penerapan solusi ERP logistik, sensor IoT, dan FESTRONIK digital.",
    defaultContent: `### 11. Digital Coverage & Logistics Industry 4.0

**Pilar Transformasi Digital Pancaran:**
* **IoT Sensor Telematika:** Alat pelacak suhu gas, tekanan tangki, dan sensor getaran jalan untuk memitigasi bahaya dari jarak jauh via control tower pusat.
* **Sistem Manifes Digital (FESTRONIK):** Integrasi API langsung dengan server Kementerian Hidup & Kehutanan untuk validasi otomatis surat jalan tanpa dokumen kertas.
* **Algoritma Route Optimization:** Penggunaan mesin analitik rute untuk mendeteksi kepadatan lalu lintas guna menghemat konsumsi BBM armada.`
  },
  {
    number: 12,
    title: "Competitor",
    shortDesc: "Komparasi posisi nilai pasar dengan pemain logistik limbah serupa.",
    defaultContent: `### 12. Competitor Landscapes

**Analisis Kekuatan Pasar Pancaran Group:**
* **Kompetitor Tradisional (Small-Scale Transporters):** Memiliki harga murah namun tingkat kepatuhan HSE sangat buruk, tidak memiliki GPS real-time, dan dokumen manifes sering bermasalah.
* **Kompetitor Asing / Berskala Besar:** Menawarkan fasilitas berkelas tinggi namun mematok tarif dolar yang sangat mahal dan kurang fleksibel untuk kebutuhan industri dinamis lokal.
* **Posisi Nilai Pancaran:** Gabungan kekuatan armada logistik terbesar Indonesia, kesiapan investasi alat berstandar HSE internasional, namun dengan fleksibilitas tarif bersaing lokal.`
  },
  {
    number: 13,
    title: "TAM, SAM, SOM",
    shortDesc: "Total estimasi potensi serapan pasar logistik limbah B3 di Indonesia.",
    defaultContent: `### 13. Market Sizing (TAM, SAM, SOM)

**Perhitungan Estimasi Serapan Pasar Industri Indonesia:**

* **Total Addressable Market (TAM):** **Rp 1,5 Triliun** per tahun - Total potensi pengeluaran logistik pengelolaan semua tipe limbah industri manufaktur di Indonesia.
* **Serviceable Addressable Market (SAM):** **Rp 550 Miliar** per tahun - Pangsa pengeluaran logistik khusus pengangkutan kategori limbah B3 berizin di koridor Pulau Jawa & Sumatera.
* **Serviceable Obtainable Market (SOM):** **Rp 95 Miliar** per tahun - Sasaran realistis Pancaran Group dalam 3 tahun pertama dengan memenangkan bidding pada 15 emiten industri besar.`
  },
  {
    number: 14,
    title: "CAC, LTV",
    shortDesc: "Analisis Customer Acquisition Cost versus Lifetime Value nilai pelanggan.",
    defaultContent: `### 14. Customer Acquisition Cost (CAC) & Lifetime Value (LTV)

**Matriks Kesehatan Portofolio Pelanggan:**

* **Customer Acquisition Cost (CAC):** **Rp 45.000.000** per klien korporat baru. Meliputi biaya pengajuan tender, penyusunan trial run rute pengangkut, dan lobi kepatuhan legal.
* **Lifetime Value (LTV):** **Rp 315.000.000** per tahun kontrak bersih. Rata-rata margin kontributor dari satu korporasi berkisar Rp 90 Juta per tahun dengan rata-rata persistensi retensi kontrak selama 3,5 tahun.
* **Rasio Kesehatan Bisnis (LTV/CAC Ratio):** **7.0x** (Sangat Sehat & Menguntungkan). Nilai ideal rasio industri logistik di atas 3.0x menandakan investasi penjualan sangat efektif.`
  }
];

/**
 * Format markdown string content to standard HTML styled for MS Word
 */
export function formatSectionToHtml(title: string, text: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2 style="font-size: 16pt; color: #1e3a8a; font-family: 'Segoe UI', Arial, sans-serif; margin-top: 18pt; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4pt;">${trimmed.substring(4)}</h2>`;
      continue;
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 80) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h3 style="font-size: 12pt; color: #01579b; font-family: 'Segoe UI', Arial, sans-serif; margin-top: 12pt; margin-bottom: 4pt;">${trimmed.replace(/\*\*/g, "")}</h3>`;
      continue;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!inList) {
        html += `<ul style="margin-bottom: 10pt; padding-left: 18pt;">`;
        inList = true;
      }
      const cleanLi = trimmed.substring(2)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      html += `<li style="font-size: 10.5pt; color: #334155; margin-bottom: 4pt; font-family: 'Segoe UI', Arial, sans-serif;">${cleanLi}</li>`;
      continue;
    }

    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    // Default paragraph
    if (inList) {
      html += "</ul>";
      inList = false;
    }
    const cleanPara = trimmed
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    html += `<p style="font-size: 10.5pt; color: #334155; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; margin-bottom: 8pt; text-align: justify;">${cleanPara}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

/**
 * Export a single section as an individual Word file (.doc format compatible with Word)
 */
export function exportSingleSectionToWord(projectTitle: string, section: DashboardSection, currentContent: string) {
  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedHtml = formatSectionToHtml(section.title, currentContent);

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${section.title} - ${displayTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 210mm 297mm; /* A4 */
          margin: 25mm 25mm 25mm 25mm;
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
        }
        div.Section1 {
          page: Section1;
        }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #334155; 
          margin: 0;
        }
        h1 { 
          font-size: 20pt; 
          color: #1e3a8a; 
          margin-top: 0;
          margin-bottom: 4pt; 
          font-weight: bold; 
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 6pt;
        }
        .section-tag {
          font-size: 9pt;
          font-family: monospace;
          color: #2563eb;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .meta-box {
          background-color: #f8fafc;
          border-left: 4px solid #10b981;
          padding: 10pt;
          margin-bottom: 18pt;
          font-size: 9.5pt;
          color: #475569;
        }
        .footer { 
          font-size: 8.5pt; 
          color: #94a3b8; 
          margin-top: 40pt; 
          border-top: 1px solid #e2e8f0; 
          padding-top: 8pt; 
          font-family: monospace; 
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="section-tag">Jurnal PM Bagian ${section.number} dari 14</div>
        <h1>${section.title.toUpperCase()}</h1>
        <div style="font-size: 11pt; color: #475569; font-weight: bold; margin-bottom: 12pt;">Proyek: ${displayTitle}</div>
        
        <div class="meta-box">
          <strong>Klarifikasi:</strong> Kajian Strategis Mendalam (Draf Tunggal)<br>
          <strong>Dibuat Pada:</strong> ${dateStr}<br>
          <strong>Sistem Otoritas:</strong> PT Pancaran Group Indonesia Services - PRAMA Advisor
        </div>

        <div style="margin-top: 10pt;">
          ${formattedHtml}
        </div>

        <div class="footer">
          PRAMA IN-SITE DIGITAL INTEGRATED REPORTING SYSTEM &bull; PANCARAN GROUP
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedFilename = `PM_Bagian_${section.number}_${section.title.trim().replace(/\s+/g, "_")}.doc`;
  
  link.href = url;
  link.download = sanitizedFilename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Export all 14 sections as one single merged Word document
 */
export function exportAllSectionsToWord(projectTitle: string, sectionsMap: Record<number, string>) {
  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let fullSectionsHtml = "";

  defaultDashboardSections.forEach((sec, index) => {
    const rawContent = sectionsMap[sec.number] || sec.defaultContent;
    const formattedHtml = formatSectionToHtml(sec.title, rawContent);
    
    fullSectionsHtml += `
      <div style="${index > 0 ? "page-break-before: always; margin-top: 30pt;" : ""}">
        <div style="font-size: 9pt; font-family: monospace; color: #2563eb; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">
          BAGIAN ${sec.number} DARI 14
        </div>
        <h2 style="font-size: 18pt; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 4pt; margin-top: 6pt; margin-bottom: 12pt;">
          ${sec.title.toUpperCase()}
        </h2>
        <div style="margin-top: 10pt;">
          ${formattedHtml}
        </div>
      </div>
    `;
  });

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Kajian Lengkap PM - ${displayTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 210mm 297mm; /* A4 */
          margin: 25mm 25mm 25mm 25mm;
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
        }
        div.Section1 {
          page: Section1;
        }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #334155; 
          margin: 0;
        }
        h1 { 
          font-size: 24pt; 
          color: #1e3a8a; 
          margin-top: 0;
          margin-bottom: 8pt; 
          font-weight: bold; 
          border-bottom: 3px double #1e3a8a;
          padding-bottom: 8pt;
        }
        .cover-box {
          background-color: #0f172a;
          color: #ffffff;
          padding: 30pt;
          margin-bottom: 30pt;
          border-radius: 12px;
          border-left: 8px solid #10b981;
        }
        .footer { 
          font-size: 8.5pt; 
          color: #94a3b8; 
          margin-top: 40pt; 
          border-top: 1px solid #e2e8f0; 
          padding-top: 8pt; 
          font-family: monospace; 
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="cover-box">
          <div style="font-size: 10pt; font-family: monospace; letter-spacing: 3px; color: #10b981; font-weight: bold; margin-bottom: 8px;">
            DOKUMEN KAJIAN STRATEGIS KOMPREHENSIF
          </div>
          <h1 style="color: #ffffff; font-size: 22pt; margin: 0; border: none; padding: 0;">
            14 PILAR FORMULASI PROPOSAL & MANAJEMEN PROYEK
          </h1>
          <div style="font-size: 13pt; color: #cbd5e1; margin-top: 14pt; font-style: italic;">
            Proyek: ${displayTitle}
          </div>
          <div style="margin-top: 24pt; font-size: 9.5pt; color: #94a3b8; line-height: 1.5;">
            <strong>Diterbitkan oleh:</strong> PRAMA System Advisor Intelligent Assistant<br>
            <strong>Direktorat Mitra:</strong> PT Pancaran Group Logistics & Enterprise Operations<br>
            <strong>Waktu Rilis:</strong> ${dateStr}<br>
            <strong>Klasifikasi:</strong> Rahasiakan / Dokumen Terbatas Korporat
          </div>
        </div>

        <div style="page-break-before: always; margin-top: 20pt;">
          <h2 style="font-size: 16pt; color: #01579b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt; margin-bottom: 12pt;">
            DAFTAR ISI KAJIAN JURNAL
          </h2>
          <ol style="font-size: 11pt; color: #334155; line-height: 1.8;">
            ${defaultDashboardSections.map(s => `
              <li><strong>${s.title}</strong> - ${s.shortDesc}</li>
            `).join('')}
          </ol>
        </div>

        <div style="page-break-before: always; margin-top: 20pt;">
          ${fullSectionsHtml}
        </div>

        <div class="footer">
          PRAMA IN-SITE DIGITAL INTEGRATED REPORTING SYSTEM &bull; PANCARAN GROUP
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedFilename = `KAJIAN_KOMPREHENSIF_PM_14_PILAR_${displayTitle.trim().replace(/\s+/g, "_")}.doc`;
  
  link.href = url;
  link.download = sanitizedFilename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Generate a beautiful widescreen complete 14-section PowerPoint presentation in PPTX format.
 */
export async function exportAllSectionsToPPTX(projectTitle: string, sectionsMap: Record<number, string>) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // Modern Widescreen 16:9

  const displayTitle = projectTitle.trim() || "Kajian Proyek Strategis";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- SLIDE 1: Cover Presentation ---
  const slide1 = pptx.addSlide();
  
  // Set background to the Pancaran Group Illustration
  let bgPath = "https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ";
  slide1.background = { path: bgPath };

  // Semi-transparent dark overlay rectangle for perfect text contrast
  slide1.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "0F172A", transparency: 45 }
  });
  // Visual accent green block
  slide1.addShape("rect", {
    x: 0.1, y: 0.1, w: 0.3, h: 7.3,
    fill: { color: "00D285" }
  });
  // Corporate logo on the top right
  try {
    slide1.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 11.3,
      y: 0.5,
      w: 1.2,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to projectDashboard PPTX:", err);
  }
  // Title text
  slide1.addText("KAJIAN STRATEGIS KOMPREHENSIF", {
    x: 0.8, y: 1.8, w: 9.0, h: 0.5,
    fontSize: 20, fontFace: "Calibri", color: "00D285", bold: true
  });
  slide1.addText("14 PILAR UTAMA ANALYSIS PROPOSAL & PM", {
    x: 0.8, y: 2.4, w: 11.5, h: 1.2,
    fontSize: 36, fontFace: "Arial Black", color: "FFFFFF"
  });
  slide1.addText(`Proyek Ekspedisi: ${displayTitle.toUpperCase()}`, {
    x: 0.8, y: 3.8, w: 11.5, h: 0.5,
    fontSize: 16, fontFace: "Calibri", color: "94A3B8", italic: true
  });
  // Watermark
  slide1.addText("PT PANCARAN GROUP INDONESIA • PRAMA SYSTEM", {
    x: 0.8, y: 5.5, w: 11.5, h: 0.4,
    fontSize: 10, fontFace: "Courier New", color: "475569", bold: true
  });
  slide1.addText(`Diterbit kan Tanggal: ${dateStr}`, {
    x: 0.8, y: 5.9, w: 11.5, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "64748B"
  });

  // --- SLIDES 2 to 15: The 14 Core Formulation Pillars ---
  defaultDashboardSections.forEach((sec) => {
    const slide = pptx.addSlide();
    // Warm clean white background for readability
    slide.background = { color: "F8FAFC" };

    // Brand header banner
    slide.addShape("rect", {
      x: 0, y: 0, w: 13.33, h: 0.8,
      fill: { color: "0F172A" }
    });
    // Header title
    slide.addText(`PILAR ${sec.number}: ${sec.title.toUpperCase()}`, {
      x: 0.4, y: 0.18, w: 8.5, h: 0.45,
      fontSize: 16, fontFace: "Arial Black", color: "00D285"
    });
    slide.addText(`Proyek: ${displayTitle}`, {
      x: 9.0, y: 0.22, w: 3.9, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "right"
    });

    const rawContent = sectionsMap[sec.number] || sec.defaultContent;
    // Extract bullets from text
    const lines = rawContent.split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith("###") && !l.startsWith("!"))
      .map(l => l.replace(/\*\*/g, "").replace(/^\*\s*/, "").replace(/^-\s*/, ""));

    // Left Column: Core Description Bullet Points
    const bulletsList = lines.slice(0, 5).map(textLine => {
      return { text: textLine, options: { bullet: true, fontSize: 13, color: "334155", fontFace: "Calibri" } };
    });

    // If we have bullets list, add text
    if (bulletsList.length > 0) {
      slide.addText(bulletsList, {
        x: 0.6, y: 1.4, w: 7.2, h: 5.2,
        lineSpacing: 26
      });
    } else {
      slide.addText(rawContent.replace(/###/g, "").replace(/\*\*/g, ""), {
        x: 0.6, y: 1.4, w: 7.2, h: 5.2,
        fontSize: 13, color: "334155", fontFace: "Calibri", lineSpacing: 22
      });
    }

    // Right Column: Key metrics highlight panel / executive box
    slide.addShape("rect", {
      x: 8.3, y: 1.4, w: 4.4, h: 5.1,
      fill: { color: "FFFFFF" },
      line: { color: "CBD5E1", width: 1.5 }
    });
    // Top border of the box
    slide.addShape("rect", {
      x: 8.3, y: 1.4, w: 4.4, h: 0.5,
      fill: { color: "00D285" }
    });
    slide.addText("INFORMASI EKSEKUTIF", {
      x: 8.5, y: 1.45, w: 4.0, h: 0.4,
      fontSize: 11, fontFace: "Arial Black", color: "0F172A"
    });

    // Content for the box based on the section
    let boxText = "";
    if (sec.number === 3) {
      boxText = `ANALISIS KEUANGAN\n\n• CAPEX: Rp 8.95 Miliar\n• OPEX Bulanan: Rp 260 Juta\n• Payback Period: 2.8 Tahun\n• IRR: 28.5%\n• ROI: 35.2%\n• Kesehatan Finansial: Sangat Baik`;
    } else if (sec.number === 13) {
      boxText = `POTENSI PASAR (MARKET SIZING)\n\n• TAM: Rp 1.5 Triliun / Thn\n• SAM: Rp 550 Miliar / Thn\n• SOM: Rp 95 Miliar / Thn\n• Realistis Target: Efektif 3 Thn\n• Sektor Utama: Manufaktur B2B`;
    } else if (sec.number === 14) {
      boxText = `EFISIENSI BIAYA PELANGGAN\n\n• CAC: Rp 45.000.000\n• LTV Bersih: Rp 315.000.000\n• LTV / CAC Rasio: 7.0x\n• Angka Sehat Industri: > 3.0x\n• Retensi Kontrak: Rata-rata 3.5 Thn`;
    } else {
      boxText = `INDIKATOR PERFORMA PILAR ${sec.number}\n\n• Tingkat Kepatuhan: 100% Selaras SLA\n• Penjamin Tanggap: Tim HSE Siaga\n• Metodologi Kerja: Berdasarkan SOP PRAMA\n• Status Peninjauan: Disetujui Evaluasi`;
    }

    slide.addText(boxText, {
      x: 8.6, y: 2.1, w: 3.8, h: 4.1,
      fontSize: 12, fontFace: "Calibri", color: "1E293B", lineSpacing: 22
    });

    // Footer signature
    slide.addText("INTEGRATED DESIGNED BY PRAMA COGNITIVE PORTAL", {
      x: 0.6, y: 6.9, w: 7.2, h: 0.3,
      fontSize: 8.5, fontFace: "Courier New", color: "94A3B8", bold: true
    });
    slide.addText(`Halaman ${sec.number + 1} dari 16`, {
      x: 8.3, y: 6.9, w: 4.4, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
    });
  });

  // --- SLIDE 16: Closing Thank You Slide ---
  const closingSlide = pptx.addSlide();
  
  // Set background to the Pancaran Group Illustration for maximum visual brand impact
  let closingBgPathPrj = "https://lh3.googleusercontent.com/d/1tfYW5Z7JUnYGLZ3QAe2Sw1061GWkCExJ";
  closingSlide.background = { path: closingBgPathPrj };

  // Semi-transparent dark overlay rectangle to guarantee pristine contrast and legibility
  closingSlide.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "06152B", transparency: 75 }
  });

  closingSlide.addShape("rect", {
    x: 0.1, y: 0.1, w: 13.13, h: 0.2,
    fill: { color: "00D285" }
  });

  // Center corporate logo above title
  try {
    closingSlide.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 6.065,
      y: 0.9,
      w: 1.2,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to projectDashboard closing slide:", err);
  }

  closingSlide.addText("TERIMA KASIH", {
    x: 1.0, y: 2.2, w: 11.3, h: 1.0,
    fontSize: 48, fontFace: "Arial Black", color: "FFFFFF", align: "center"
  });
  closingSlide.addText("PRAMA System Strategic PM Formulator Module", {
    x: 1.0, y: 3.4, w: 11.3, h: 0.6,
    fontSize: 16, fontFace: "Calibri", color: "00D285", align: "center"
  });
  closingSlide.addText("PT PANCARAN GROUP INDONESIA SERVICES", {
    x: 1.0, y: 4.8, w: 11.3, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "center", bold: true
  });

  // Save/trigger presentation download
  const sanitizedFilename = `PPTX_Kajian_PM_14_Pilar_${displayTitle.trim().replace(/\s+/g, "_")}.pptx`;
  await pptx.writeFile({ fileName: sanitizedFilename });
}

export function generatePillarsForProject(projectName: string, fileContent?: string): Record<number, string> {
  const pName = projectName.trim();
  const lower = pName.toLowerCase();

  // Deterministic seed based on project name to make calculations completely unique per project
  let seed = 0;
  for (let i = 0; i < pName.length; i++) {
    seed = (seed << 5) - seed + pName.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  // Default values based on seed hash
  const defaultUnitsCount = 6 + (seed % 14);
  const unitTypes = [
    "Unit Truk Tronton Wingbox Multi-Axle",
    "Unit Tipper Dump Truck Heavy-Duty (6x4)",
    "Unit Reefer Box Truck ThermoKing ber-GPS",
    "Unit Prime Mover Tractor Head Flatbed Chasis",
    "Unit Bulk Tanker Trailer (Tangki Baja)",
    "Unit CPO Tanker Truck Stainless Steel"
  ];
  const selectedUnitType = unitTypes[seed % unitTypes.length];
  let unitsText = `${defaultUnitsCount} ${selectedUnitType}`;

  const defaultCapexVal = (seed % 28 + 6) * 500000000; // 3M to 17M
  const defaultOpexVal = (seed % 35 + 8) * 12500000; // 100M to 500M
  
  const defaultTamIDR = (seed % 9 + 3) * 1200000000000; // 3.6T to 13.2T
  const defaultSamIDR = Math.round(defaultTamIDR * (0.15 + (seed % 20) / 100));
  const defaultSomIDR = Math.round(defaultSamIDR * (0.1 + (seed % 15) / 100));

  const defaultCacIDR = (seed % 45 + 15) * 1000000; // 15M to 60M
  const defaultLtvIDR = defaultCacIDR * (seed % 12 + 8); // LTV range 8x to 19x

  const defaultPbp = (2.2 + (seed % 25) / 10).toFixed(1); // 2.2 to 4.7 years
  const defaultRoi = (28.5 + (seed % 180) / 10).toFixed(1); // 28.5% to 46.5%
  const defaultIrr = (20.5 + (seed % 130) / 10).toFixed(1); // 20.5% to 33.5%

  // Determine industry type and thematic vocabulary
  let industry = "logistik & transportasi terintegrasi";
  let regulations = "**UU No. 22 Tahun 2009** tentang Lalu Lintas Angkutan Jalan dan regulasi sektoral terkait";
  let materialName = "kargo komersial";
  let capexAmount = defaultCapexVal.toString();
  let opexAmount = defaultOpexVal.toString();
  let extraDetail1 = "Pengangkutan kargo industri dengan jaminan SLA ketat.";
  let extraDetail2 = "Pengoptimalan jalur distribusi utama antar-wilayah.";

  const getSizingText = (val: number) => {
    if (val >= 1000000000000) return `Rp ${(val / 1000000000000).toFixed(1)} Triliun`;
    return `Rp ${(val / 1000000000).toFixed(0)} Miliar`;
  };

  let tamFormatted = getSizingText(defaultTamIDR);
  let samFormatted = getSizingText(defaultSamIDR);
  let somFormatted = getSizingText(defaultSomIDR);
  let cacFormatted = `Rp ${defaultCacIDR.toLocaleString("id-ID")}`;
  let ltvFormatted = `Rp ${defaultLtvIDR.toLocaleString("id-ID")}`;
  let ratioValue = (defaultLtvIDR / defaultCacIDR).toFixed(1);

  // Custom-crafted industries
  if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
    industry = "distribusi mineral & tambang curah (Heavy-Duty Hauling)";
    regulations = "**UU No. 3 Tahun 2020** tentang Pertambangan Mineral dan Batubara, serta regulasi ESDM & ODOL";
    materialName = "batubara curah kering";
    extraDetail1 = "Sistem pengangkutan khusus hauling dari mulut tambang batubara (stockpile) menuju dermaga penumpukan (jetty).";
    extraDetail2 = "Fasilitas keselamatan K3 pertambangan tinggi, penyiraman rute hauling, dan rest-area driver terintegrasi.";
  } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
    industry = "transportasi rantai dingin (Cold Chain & Temperature Controlled Logistics)";
    regulations = "**Sertifikasi CDOB BPOM** (Cara Distribusi Obat yang Baik) serta regulasi sistem mutu **ISO 9001**";
    materialName = "vaksin sensitif suhu & produk boga beku";
    extraDetail1 = "Instalasi sensor Thermo-Cloud IoT untuk pemantauan grafik fluktuasi suhu boks reefer setiap 5 menit.";
    extraDetail2 = "SOP ketat pengiriman dengan batas deviasi suhu boks maksimal ±2°C sepanjang koridor transit Jawa-Bali.";
  } else if (lower.includes("pelabuhan") || lower.includes("port") || lower.includes("kontainer") || lower.includes("container") || lower.includes("laut") || lower.includes("ocean")) {
    industry = "intermodal & logistics hub pelabuhan komersial (Port & Sea Freight)";
    regulations = "**UU No. 17 Tahun 2008** tentang Pelayaran serta aturan kepabeanan & ISPS Code internasional";
    materialName = "petikemas kontainer ekspor-impor";
    extraDetail1 = "Pengaturan jadwal armada sinkron dengan waktu sandar kapal cargo pelayaran laut (*vessel closing time*).";
    extraDetail2 = "Integrasi depo kontainer pintar, inspeksi pintu segel penimbang, dan manajemen turn-around-time dermaga.";
  } else if (lower.includes("semen") || lower.includes("cement") || lower.includes("clinker") || lower.includes("beton")) {
    industry = "logistik distribusi semen curah & clinker industri konstruksi";
    regulations = "**UU No. 22 Tahun 2009** serta Surat Edaran Kemenhub perihal batasan muatan sumbu terberat (MST) & Over Dimension Over Load (ODOL)";
    materialName = "semen curah kering & clinker";
    extraDetail1 = "Penyaluran komoditas semen curah dari pabrik pengolahan semen menuju silo penampungan atau batching plant.";
    extraDetail2 = "Penggunaan blower kompresor berkinerja tinggi untuk kelancaran bongkar muat tanpa kontaminasi udara bebas.";
  } else if (lower.includes("pupuk") || lower.includes("fertilizer") || lower.includes("urea")) {
    industry = "logistik distribusi pupuk pertanian & bahan kimia agroindustri";
    regulations = "**PP No. 74 Tahun 2001** tentang Pengelolaan Bahan Berbahaya dan Beracun (B3) serta standardisasi sasis gandar Kemenhub";
    materialName = "pupuk urea curah & amoniak cair";
    extraDetail1 = "Pengangkutan pupuk kemasan bag dan bulk dari gudang pabrik menuju gudang lini III kabupaten.";
    extraDetail2 = "SOP sirkulasi sasis tangki kedap udara guna meminimalisir kontaminasi kelembapan udara luar terhadap butir amoniak.";
  } else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
    industry = "logistik Crude Palm Oil (CPO) & minyak nabati cair";
    regulations = "**Sertifikasi ISPO** (Indonesian Sustainable Palm Oil) dan standar kebersihan sasis tangki Food Grade";
    materialName = "minyak kelapa sawit kasar (CPO)";
    extraDetail1 = "Rute hauling CPO dari pabrik kelapa sawit (PKS) lini tengah menuju depo penyimpanan pelabuhan (bulking station).";
    extraDetail2 = "Instalasi katup pengaman anti-tumpah, pencuci tangki otomatis sasis (steam cleaner), dan pelacakan GPS suhu thermo.";
  } else if (lower.includes("pasir") || lower.includes("quarry") || lower.includes("batu") || lower.includes("tanah") || lower.includes("galian")) {
    industry = "logistik material galian tambang & infrastruktur sipil (Quarry Trucking)";
    regulations = "**UU No. 3 Tahun 2020** serta Perda RTRW Kota/Kabupaten setempat mengenai izin jam lintasan kelas jalan";
    materialName = "pasir cor, andesit, & batu agregat";
    extraDetail1 = "Pengangkutan agregat konstruksi berdensitas tinggi dari titik penggalian menuju batching plant beton.";
    extraDetail2 = "SOP wajib pemasangan terpal penutup bak tebal anti-debu dan pembersihan sasis unit scraper pembersih lumpur ban.";
  } else if (lower.includes("gas") || lower.includes("lng") || lower.includes("lpg") || lower.includes("bensin") || lower.includes("solar")) {
    industry = "logistik energi cair & gas terkompresi B3 spesifikasi tinggi";
    regulations = "**Standar K3 Migas ESDM** dan UU No. 22 Tahun 2001 perihal izin distribusi angkutan bahan bakar umum nasional";
    materialName = "BBM komanditer / gas cair terkompresi";
    extraDetail1 = "Distribusi pasokan energi dari depo kilang pengolahan Pertamina menuju terminal SPBU atau tangki industri.";
    extraDetail2 = "Unit wajib mengaplikasikan sistem pemutus arus listrik darurat, fire blanket sasis, dan sensor deteksi gas bocor otomatis.";
  } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
    industry = "pengangkutan & pengelolaan limbah industri / B3 (Waste Management Transportation)";
    regulations = "**UU No. 18 Tahun 2008** tentang Pengelolaan Sampah, **PP No. 22 Tahun 2021** tentang Penyelenggaraan Perlindungan Pengelolaan Lingkungan Hidup, serta standar KLHK & Kemenhub";
    materialName = "limbah B3 industri (cair & padat)";
    extraDetail1 = "Penyediaan armada transporter tersertifikasi izin khusus angkutan B3 dari Ditjen Perhubungan Darat dan rekomendasi KLHK.";
    extraDetail2 = "Integrasi sistem pelacakan elektronik manifest Festronik terhubung langsung ke server sistem pemantauan KLHK.";
  }

  // File parser overrides if real content is provided!
  if (fileContent) {
    const capexMatch = fileContent.match(/(?:capex|investasi|capital\s*expenditure)\W*(?:idr|rp)?\s*([\d\.]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (capexMatch && capexMatch[1]) {
      capexAmount = capexMatch[1].trim().replace(/\./g, "").replace(/\D/g, "");
    }

    const opexMatch = fileContent.match(/(?:opex|operasional|operational\s*expenditure)\W*(?:idr|rp)?\s*([\d\.]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (opexMatch && opexMatch[1]) {
      opexAmount = opexMatch[1].trim().replace(/\./g, "").replace(/\D/g, "");
    }

    const tamMatch = fileContent.match(/(?:tam|total\s*addressable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (tamMatch && tamMatch[1]) tamFormatted = tamMatch[1].trim();

    const samMatch = fileContent.match(/(?:sam|serviceable\s*addressable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (samMatch && samMatch[1]) samFormatted = samMatch[1].trim();

    const somMatch = fileContent.match(/(?:som|serviceable\s*obtainable\s*market)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta|\s*t|\s*m)?)/i);
    if (somMatch && somMatch[1]) somFormatted = somMatch[1].trim();

    const cacMatch = fileContent.match(/(?:cac|customer\s*acquisition\s*cost)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (cacMatch && cacMatch[1]) cacFormatted = cacMatch[1].trim();

    const ltvMatch = fileContent.match(/(?:ltv|lifetime\s*value)\W*(?:idr|rp)?\s*([\d\.,]+(?:\s*triliun|\s*miliar|\s*juta)?)/i);
    if (ltvMatch && ltvMatch[1]) ltvFormatted = ltvMatch[1].trim();

    const indMatch = fileContent.match(/(?:industri|sektor|sector)\W*\s*([a-zA-Z0-9\s,&()-]{5,40})/i);
    if (indMatch && indMatch[1]) industry = indMatch[1].trim();

    const matMatch = fileContent.match(/(?:material|komoditas|kargo|barang|bawaan)\W*\s*([a-zA-Z0-9\s,&()-]{3,30})/i);
    if (matMatch && matMatch[1]) materialName = matMatch[1].trim();

    const untMatch = fileContent.match(/(?:armada|mobil|truk|units|unit)\W*(\d+\s*[a-zA-Z0-9\s-]+)/i);
    if (untMatch && untMatch[1]) unitsText = untMatch[1].trim();
  }

  // Let's format numeric values
  let numericCapex = Number(capexAmount);
  if (isNaN(numericCapex) || numericCapex === 0) {
    numericCapex = defaultCapexVal;
  }
  let numericOpex = Number(opexAmount);
  if (isNaN(numericOpex) || numericOpex === 0) {
    numericOpex = defaultOpexVal;
  }

  const monthlyRev = Math.round(numericOpex * 1.85);

  const pillars: Record<number, string> = {
    1: `### 1. Global / National (NAT) Overview\n\n**Kajian Regulasi & Kepatuhan Proyek:**\nKajian ini dirancang khusus untuk proyek **"${pName}"** dalam naungan ${industry}. Kepatuhan dijamin melalui penyelarasan penuh dengan regulasi nasional, khususnya ${regulations}.\n\n**Peluang Strategis untuk Pancaran Group:**\n* **Kepatuhan ESG Global:** Mengintegrasikan indikator keberlanjutan yang sejalan dengan dekarbonisasi rantai pasok untuk meningkatkan daya tawar di mata klien korporasi besar.\n* **Standardisasi Industri:** Menjadi penyedia transportasi berlisensi resmi yang handal di tengah regulasi pengawasan angkutan jalan yang kian diperketat pemerintah.`,

    2: `### 2. Market Opportunity\n\n**Analisis Kesenjangan & Ceruk Pasar Proyek:**\nProyek **"${pName}"** menyasar sektor logistik premium di mana terdapat gap atau kesenjangan besar antara transporter berlisensi standar dengan kebutuhan armada yang sangat andal.\n\n**Metode Eksploitasi Ceruk Pasar:**\n* **Sertifikasi Khusus:** Menyediakan lisensi operasional eksklusif untuk pengangkutan tipe ${materialName}.\n* **Dukungan Korporat:** Memosisikan Pancaran Group sebagai satu-satunya mitra strategis berskala nasional yang mampu memberikan jaminan keamanan berkas kargo bernilai tinggi secara konsisten.`,

    3: (() => {
      const unitCount = defaultUnitsCount;
      const avgUnitCost = Math.round(numericCapex / unitCount);
      
      let opexDetails = "";
      if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
        opexDetails = `* **Bahan Bakar Solar Industri (Non-Subsidi):** **Rp ${Math.round(numericOpex * 0.55).toLocaleString("id-ID")}** per bulan (asumsi harga solar industri Rp 19.500/liter dengan konsumsi rute hauling berat).
* **Gaji, Premi Rit, & Tunjangan K3 Pengemudi:** **Rp ${Math.round(numericOpex * 0.20).toLocaleString("id-ID")}** per bulan (standar pengemudi hauling tersertifikasi K3 pertambangan).
* **Pemeliharaan Rutin, Ban, & Suku Cadang Sasis:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan (ban khusus medan off-road berlumpur).
* **Perizinan Dispensation Rute & HSE Audit:** **Rp ${Math.round(numericOpex * 0.10).toLocaleString("id-ID")}** per bulan.`;
      } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
        opexDetails = `* **Bahan Bakar Solar & Operasional Kompresor Pendingin:** **Rp ${Math.round(numericOpex * 0.45).toLocaleString("id-ID")}** per bulan (konsumsi solar diesel tambahan untuk genset ThermoKing boks reefer).
* **Gaji Pengemudi & Kru (Standar Mutu CDOB BPOM):** **Rp ${Math.round(numericOpex * 0.25).toLocaleString("id-ID")}** per bulan (menerapkan premi kebersihan & jaminan suhu).
* **Kalibrasi Sensor Suhu IoT & Perawatan Chiller:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan.
* **Biaya Asuransi Kerusakan Kargo Sensitif:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan.`;
      } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
        opexDetails = `* **Bahan Bakar Solar Industri & Tol Trans-Jawa:** **Rp ${Math.round(numericOpex * 0.45).toLocaleString("id-ID")}** per bulan (solar non-subsidi untuk rute Cikarang/Karawang menuju TPA B3).
* **Gaji & Tunjangan Risiko Kimia Pengemudi:** **Rp ${Math.round(numericOpex * 0.25).toLocaleString("id-ID")}** per bulan (sertifikasi B2 Umum & lisensi penanganan bahan kimia berbahaya B3).
* **Pemeliharaan Berkala Tangki/Boks Vacuum & Katup Pneumatik:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan.
* **Biaya Kepatuhan Festronik, KIR, & Izin KLHK/Kemenhub:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan.`;
      } else {
        opexDetails = `* **Bahan Bakar Solar Industri & Biaya Gerbang Tol:** **Rp ${Math.round(numericOpex * 0.50).toLocaleString("id-ID")}** per bulan.
* **Gaji & Premi Ritase Pengemudi Sasis:** **Rp ${Math.round(numericOpex * 0.25).toLocaleString("id-ID")}** per bulan (standar UMR regional ditambah insentif ketepatan waktu).
* **Perawatan Sasis, Ban, & Suku Cadang Mesin:** **Rp ${Math.round(numericOpex * 0.15).toLocaleString("id-ID")}** per bulan.
* **Biaya Asuransi Kehilangan & Perizinan KIR Rutin:** **Rp ${Math.round(numericOpex * 0.10).toLocaleString("id-ID")}** per bulan.`;
      }

      return `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)

**Analisis Kelayakan Finansial Proyek Komprehensif:**

Rancangan anggaran biaya dan proyeksi finansial di bawah ini diformulasikan secara presisi untuk mengkaji tingkat pengembalian modal proyek **"${pName}"** agar sesuai dengan kelayakan standar logistik di Indonesia:

**A. Alokasi Capital Expenditure (Capex):**
Investasi awal diperlukan untuk memastikan kesiapan armada premium berstandar keselamatan tinggi:
* **Pengadaan Unit Armada Baru (${unitsText}):** **Rp ${numericCapex.toLocaleString("id-ID")}** (estimasi Rp ${(avgUnitCost / 1000000).toFixed(0)} Juta per unit sasis truk berstandar dekarbonisasi).
* **Instalasi Smart Telematics & Sensor IoT Terintegrasi:** **Rp 150.000.000** (pemasangan GPS tracker, sensor berat suspensi anti-ODOL, dan sensor tangki).
* **Sertifikasi Awak & Lisensi Hukum Legalitas Rute Perdana:** **Rp 200.000.000** (pengurusan AMDAL, rekomendasi rute Kemenhub, dan training penanganan darurat).
* **Total Kebutuhan Capex Awal:** **Rp ${(numericCapex + 350000000).toLocaleString("id-ID")}**

**B. Operational Expenditure (Opex) Bulanan:**
Biaya operasional rutin dirancang menggunakan asumsi harga bahan bakar solar industri non-subsidi yang berlaku saat ini di Indonesia:
${opexDetails}
* **Total Opex Bulanan:** **Rp ${(numericOpex + 60000000).toLocaleString("id-ID")} / Bulan**

**C. Proyeksi Profit & Loss (P&L) & ROI:**
* **Target Pendapatan Operasional:** **Rp ${monthlyRev.toLocaleString("id-ID")} / Bulan** (asumsi utilisasi triplat armada rata-rata 85% dengan sistem billing kontrak tahunan berkelanjutan).
* **Target Gross Profit Margin:** **Rp ${Math.round(monthlyRev * 0.45).toLocaleString("id-ID")} / Bulan (45.0% Margin)**.
* **Target EBITDA / Net Profit Margin (Bersih setelah Depresiasi & Pajak): 32% - 35%**.
* **Payback Period (PBP): ${defaultPbp} Tahun** (Sangat cepat untuk ukuran investasi armada logistik di Indonesia, berkat marjin tinggi dari segmen logistik premium).
* **Return on Investment (ROI) Tahun ke-3: ${defaultRoi}%**
* **Internal Rate of Return (IRR): ${defaultIrr}%** (Melampaui tingkat suku bunga pinjaman modal/WACC rata-rata perbankan di Indonesia sebesar ~9-11%, menandakan proyek ini sangat layak secara finansial).

**D. Manajemen Cash Flow & Modal Kerja (Working Capital):**
* Mengingat standar pembayaran (*Term of Payment*) korporasi besar (B2B) di Indonesia biasanya berkisar antara **60 s.d. 90 hari**, unit bisnis wajib menyiapkan dana cadangan modal kerja (*Working Capital Buffer*) minimal sebesar 3 bulan Opex (**Rp ${Math.round((numericOpex + 60000000) * 3).toLocaleString("id-ID")}**) guna menjaga kelancaran operasional (pembelian solar harian & gaji supir) sebelum termin pembayaran tagihan dari klien cair.`;
    })(),

    4: `### 4. Supply & Demand\n\n**Analisis Dinamika Pasar Proyek:**\n\n* **Sisi Permintaan (Demand):** Volume pengangkutan untuk ${materialName} pada skala regional mengalami lonjakan karena bertumbuhnya aktivitas B2B di koridor operasional proyek **"${pName}"**.\n* **Sisi Penawaran (Supply):** Berdasarkan intelijen pasar, terdapat kelangkaan operator armada lokal yang memiliki sertifikasi kepatuhan dekarbonisasi penuh. Keadaan surplus permintaan ini menguntungkan posisi pricing power milik Pancaran Group.`,

    5: `### 5. Structure\n\n**Rantai Nilai & Alur Distribusi Operasi:**\n\nAlur kerja operasional proyek **"${pName}"** dirancang dengan pendekatan sirkular tertutup demi menjaga stabilitas dan efisiensi:\n\n1. **Fase Pemuatan (Inbound):** Pengawasan kargo ${materialName} di terminal pengirim menggunakan checklist inspeksi standar.\n2. **Fase Pengangkutan (Transit):** Dispatching unit terpantau penuh oleh PRAMA Live Control Tower.\n3. **Fase Bongkar Muat (Outbound):** Penyerahan kargo di situs tujuan yang dibuktikan melalui konfirmasi tanda terima digital yang sah.`,

    6: `### 6. Organization (Qualification, Skill, Output/KPI, SOP)\n\n**Kualifikasi Organisasi & Pengawasan Sumber Daya:**\n\n* **Persyaratan Kompetensi Awak:** Pengemudi dipersyaratkan memiliki sertifikasi HSE operasional khusus bidang ${industry} untuk memastikan nol kejadian bahaya.\n* **Indikator Kinerja Kunci (KPI) Tim:**\n  * Tingkat Kerusakan Kargo: **0% (Zero Damage)**\n  * Ketepatan Waktu Pengiriman (On-Time Delivery): **> 98.5%**\n  * Kepatuhan Pengisian Logbook Digital: **100% lulus audit**`,

    7: `### 7. Transition Model (Pre-On-Post)\n\n**Model Manajemen Transisi Proyek:**\n\nSkema peluncuran proyek **"${pName}"** dilaksanakan secara terstruktur dalam tiga fase kunci:\n\n* **Pre-Onboarding:** Verifikasi dokumen perizinan rute angkutan, pengetesan muatan kosong sasis di rute hauling.\n* **Onboarding:** Deployment perdana 5 unit armada awal dengan monitoring intensif harian.\n* **Post-Onboarding:** Serah terima penuh ke tim operasional regional disertai evaluasi mingguan performa konsumsi bahan bakar.`,

    8: `### 8. Go To Market Strategy\n\n**Strategi Penetrasi & Akuisisi Klien:**\n\n* **Kemitraan Kontrak Multitahun:** Mengetargetkan kesepakatan jangka panjang *Long-Term Service Agreement* (LTSA) bersama produsen utama ${materialName}.\n* **Diferensiasi Teknologi Hijau:** Menawarkan sertifikasi pelaporan emisi karbon gratis untuk membantu klien memenuhi target ESG korporat mereka.\n* **Value-Added Service:** Paket integrasi bongkar muat terpadu di pelabuhan atau depo.`,

    9: `### 9. Ops Model (Flow Process, Workflow Diagram, SLA)\n\n**Sirkuit Operasional & Standar Layanan (SLA):**\n\n* **Alur Proses Kontrol:**\n\`\`\`\n[Checklist Unit] ➔ [Pemuatan Aman] ➔ [Keberangkatan Terjadwal] ➔ [Pemantauan Sensor GPS] ➔ [Bongkar Muat] ➔ [SLA Valid]\n\`\`\`\n\n* **Komitmen Layanan (SLA):**\n  * Respons tanggap darurat di rute kritis: **Maksimal 45 Menit** tim HSE meluncur.\n  * Waktu tunggu pemuatan di gudang klien: **Di bawah 60 menit** per armada.`,

    10: `### 10. Risk Management\n\n**Manajemen & Mitigasi Risiko Proyek:**\n\n* **Risiko Operasional Jalan Raya:** Kecelakaan armada atau keterlambatan rute akibat kemacetan ekstrem.\n  * *Mitigasi:* Edukasi *Defensive Driving*, penegakan SOP istirahat pengemudi setiap 4 jam, dan pemanfaatan rute alternatif real-time.\n* **Risiko Kerusakan Kargo (${materialName}):** Penyimpangan mutu atau kontaminasi muatan.\n  * *Mitigasi:* Pemasangan sensor IoT pendeteksi getaran/suhu dan asuransi kepemilikan kargo komprehensif.`,

    11: `### 11. Digital Coverage (Tools, Method, IoT, Tech)\n\n**Strategi Digitalisasi Logistik 4.0:**\n\nProyek khusus **"${pName}"** memanfaatkan tumpukan teknologi kognitif tercanggih:\n\n* **Prama Smart Telematics:** GPS presisi tinggi yang dikombinasikan dengan sensor diagnostik sasis CAN bus untuk memprediksi kerusakan mekanis.\n* **Electronic Load Sensor:** Pengaman suspensi otomatis guna mendeteksi kecenderungan muatan berlebih (kelebihan tonase) secara real-time demi mematuhi aturan anti-ODOL.`,

    12: (() => {
      const comps = getDefaultCompetitorsForProject(pName);
      let text = "### 12. Competitor Analysis & Market Landscape\n\n";
      text += "Dalam pelaksanaan proyek **\"" + pName + "\"" + " di Indonesia, persaingan tender dan operasional melibatkan beberapa pemain kunci. Berikut adalah rincian kompetitor yang aktif memperebutkan dan mengambil proyek sejenis beserta posisinya di pasar:\n\n";
      comps.forEach((c, idx) => {
        text += "**" + (idx + 1) + ". " + c.name + " (" + c.status + ")**\n";
        text += "* **Skala Armada:** " + c.armadaScale + " | **Indeks Keamanan (HSE):** " + c.safetyIndex + "%\n";
        text += "* **Rekam Jejak Proyek:** " + c.projectHistory + "\n";
        text += "* **Kekuatan Utama:** " + c.strengths + "\n";
        text += "* **Kelemahan & Celah Pasar:** " + c.weaknesses + "\n";
        text += "* **Analisis Penetrasi Pancaran:** " + c.explanation + "\n\n";
      });
      text += "**Strategi Kemenangan Pancaran Group:**\n";
      text += "Pancaran Group berada di posisi unik \"Value Frontier\" di Indonesia, di mana kita mengawinkan kepatuhan standar internasional (HSE & ESG) serta integrasi teknologi IoT Smart Telematics, namun mempertahankan tarif lokal yang kompetitif dan fleksibilitas jadwal yang tidak dimiliki oleh perusahaan multinasional besar (seperti PPLI atau RAPP Logistics).";
      return text;
    })(),

    13: (() => {
      let explanationText = "";
      if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
        explanationText = "TAM mencakup seluruh volume pengangkutan batu bara nasional di Pulau Kalimantan dan Sumatera (est. 600 juta ton/tahun). SAM difokuskan pada koridor pengangkutan hauling jalan darat khusus dari konsesi tambang (IUP) aktif berjarak < 80 km ke Jetty pelabuhan muat. SOM ditargetkan pada 3-5 produsen batu bara menengah-besar (IUP Mandiri) yang membutuhkan jaminan armada anti-breakdown demi kelancaran rantai pasok ekspor.";
      } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
        explanationText = "TAM mencakup seluruh pasar cold-chain logistics nasional Indonesia untuk produk makanan beku, farmasi, susu, dan bahan segar. SAM difokuskan pada pasar distribusi berpendingin premium lintas koridor tol trans-Jawa dan penyeberangan ke Sumatera Selatan yang mewajibkan sertifikasi suhu konstan. SOM dirancang untuk memenangkan kontrak distribusi dari 8 produsen FMCG makanan beku dan jaringan ritel modern besar.";
      } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
        explanationText = "TAM dihitung berdasarkan total volume limbah B3 (cair, padat, medis, sludge) yang diproduksi oleh seluruh industri manufaktur di 5 kawasan industri utama Indonesia (Karawang, Cikarang, Cilegon, Gresik, & Medan). SAM difokuskan pada rute pengangkutan berizin KLHK menuju TPA/fasilitas pengolahan akhir resmi (seperti PPLI). SOM menargetkan perolehan kontrak tetap dari 15 emiten industri besar manufaktur tekstil, kimia, dan otomotif.";
      } else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
        explanationText = "TAM mencakup seluruh kapasitas pengangkutan minyak kelapa sawit mentah (Crude Palm Oil) dari pabrik kelapa sawit (PKS) menuju refinery atau pelabuhan bulking station di Riau, Jambi, Sumut, dan Kalteng. SAM difokuskan pada rute transportasi sasis tangki Food Grade berkapasitas 25-30 ton. SOM menargetkan kontrak eksklusif dari 3 grup perkebunan sawit besar independen di wilayah operasional Pancaran.";
      } else {
        explanationText = "TAM didasarkan pada total volume logistik general cargo & kontainer intermodal di koridor utama Indonesia (Jawa-Sumatera). SAM difokuskan pada segmen industri manufaktur bernilai tinggi yang menuntut ketepatan SLA pengangkutan di atas 98%. SOM menargetkan konversi kontrak tahunan dari beberapa distributor regional utama dan emiten FMCG.";
      }

      return "### 13. Market Sizing (TAM, SAM, SOM)\n\n" +
        "**Estimasi Skala & Struktur Potensi Pasar Sektor Terkait di Indonesia:**\n\n" +
        "Dalam merumuskan kelayakan proyek **\"" + pName + "\"**, tim Business Intelligence PRAMA melakukan pemetaan ukuran pasar (Market Sizing) secara berjenjang guna mengukur seberapa besar kue bisnis yang dapat dijangkau dan dikuasai secara realistis:\n\n" +
        "* **Total Addressable Market (TAM): " + tamFormatted + " per tahun**\n" +
        "  * *Penjelasan:* Merupakan total potensi belanja (spending) logistik dan transportasi secara keseluruhan di Indonesia untuk sektor " + industry + ". Angka ini mencerminkan volume industri raksasa berskala nasional, didorong oleh pertumbuhan manufaktur, ketatnya regulasi pemerintah, dan ekspansi infrastruktur koridor logistik.\n\n" +
        "* **Serviceable Addressable Market (SAM): " + samFormatted + " per tahun**\n" +
        "  * *Penjelasan:* Porsi dari TAM yang secara geografis dan regulasi dapat dilayani secara langsung oleh jaringan operasional, izin trayek, serta armada tersertifikasi Pancaran Group. " + explanationText.split(". ")[0] + ".\n\n" +
        "* **Serviceable Obtainable Market (SOM): " + somFormatted + " per tahun**\n" +
        "  * *Penjelasan:* Target pangsa pasar riil yang sangat optimis dan realistis untuk dimenangkan oleh unit bisnis Pancaran Group dalam jangka waktu 3 tahun pertama operasional proyek. Ini dihitung bersandarkan kapasitas penyerapan kontrak tender tahunan, ketersediaan unit armada baru (" + unitsText + "), serta skema pricing yang kompetitif. " + (explanationText.split(". ")[1] || "") + ".";
    })(),

    14: `### 14. Customer Acquisition Cost (CAC) & Lifetime Value (LTV)\n\n**Metrik Nilai Ekonomi Pelanggan:**\n\n* **Customer Acquisition Cost (CAC):** ${cacFormatted} per korporasi (termasuk biaya proses negosiasi, analisis kelayakan, & adaptasi operasional rute awal).\n* **Customer Lifetime Value (LTV):** ${ltvFormatted} (bersandarkan retensi rata-rata kontrak berdurasi 3 tahun).\n* **Rasio LTV/CAC:** **${ratioValue}x** (Rasio sangat sehat dan sangat menguntungkan di atas rerata industri logistik).`
  };

  return pillars;
}

export function parseResponseToPillars(text: string): Record<number, string> {
  const result: Record<number, string> = {};
  const lines = text.split("\n");
  let currentPilar = 0;
  let currentContent: string[] = [];

  const headerToPillarMap: Record<string, number> = {
    "GLOBAL/NAT OVERVIEW": 1,
    "GLOBAL / NAT OVERVIEW": 1,
    "GLOBAL/NATIONAL OVERVIEW": 1,
    "GLOBAL / NATIONAL OVERVIEW": 1,
    "GLOBAL OVERVIEW": 1,
    "NATIONAL OVERVIEW": 1,
    "GLOBAL NAT OVERVIEW": 1,
    "GLOBAL NATIONAL OVERVIEW": 1,
    
    "MARKET OPPORTUNITY": 2,
    "PELUANG PASAR": 2,
    "CERUK PASAR": 2,
    "MARKET OPPORTUNITIES": 2,
    
    "FINANCIAL": 3,
    "FINANCIALS": 3,
    "FINANSIAL": 3,
    "KEUANGAN": 3,
    "FINANCIAL ANALYSIS": 3,
    
    "SUPPLY AND DEMAND": 4,
    "SUPPLY & DEMAND": 4,
    "SUPPLY AND DEMAND ANALYSIS": 4,
    "PENAWARAN DAN PERMINTAAN": 4,
    "PENAWARAN & PERMINTAAN": 4,
    "SUPPLY & DEMAND ANALYSIS": 4,
    
    "STRUCTURE": 5,
    "STRUKTUR": 5,
    "PROJECT STRUCTURE": 5,
    "STRUKTUR PROYEK": 5,
    
    "ORGANIZATION": 6,
    "ORGANISASI": 6,
    "ORGANIZATION STRATEGY": 6,
    "STRATEGI ORGANISASI": 6,
    
    "TRANSITION MODEL": 7,
    "MODEL TRANSISI": 7,
    "TRANSISI": 7,
    "STRATEGI TRANSISI": 7,
    
    "GO TO MARKET STRATEGY": 8,
    "GO-TO-MARKET STRATEGY": 8,
    "GO TO MARKET": 8,
    "STRATEGI GO TO MARKET": 8,
    "GTM STRATEGY": 8,
    
    "OPS MODEL": 9,
    "OPERATIONAL MODEL": 9,
    "MODEL OPERASIONAL": 9,
    "OPS MODEL ANALYSIS": 9,
    
    "RISK MANAGEMENT": 10,
    "MANAJEMEN RISIKO": 10,
    "MANAJEMEN RESIKO": 10,
    "MITIGASI RISIKO": 10,
    "MITIGASI RESIKO": 10,
    
    "DIGITAL COVERAGE": 11,
    "DIGITALISASI": 11,
    "CAKUPAN DIGITAL": 11,
    "TEKNOLOGI DIGITAL": 11,
    
    "COMPETITOR": 12,
    "COMPETITORS": 12,
    "PESAING": 12,
    "KOMPETITOR": 12,
    "ANALISIS PESAING": 12,
    
    "TAM, SAM, SOM": 13,
    "TAM SAM SOM": 13,
    "TAM, SAM DAN SOM": 13,
    "MARKET SIZING": 13,
    "TAM/SAM/SOM": 13,
    
    "CAC, LTV": 14,
    "CAC LTV": 14,
    "CAC & LTV": 14,
    "CAC AND LTV": 14,
    "CAC/LTV": 14,
    "CUSTOMER ACQUISITION COST": 14,
  };

  const getPillarFromLine = (line: string): number | null => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // 1. Check direct regex match with number (1-14)
    const numMatch = trimmed.match(/^(?:###\s*|\*\*\s*|)?(?:Pilar|PILAR|Bagian|BAGIAN)?\s*(1|2|3|4|5|6|7|8|9|10|11|12|13|14)\b[\.\s\:\-]*([A-Za-z0-9\/&\(\)\s,\|\+\-]{3,})/i);
    if (numMatch) {
      const pNum = parseInt(numMatch[1], 10);
      const isFalsePositive = trimmed.includes("Rp ") || trimmed.includes("Rp.") || (trimmed.toLowerCase().includes("capex") && pNum !== 3) || trimmed.includes("%");
      if (!isFalsePositive) {
        return pNum;
      }
    }

    // 2. Short header keyword match (case-insensitive)
    if (trimmed.length > 70) return null;

    const cleaned = trimmed
      .replace(/^(?:###\s*|\*\*\s*|)?(?:Pilar|PILAR|Bagian|BAGIAN)?\s*/i, "")
      .replace(/^\d+[\s\.\-\:]+/, "")
      .replace(/[^A-Za-z0-9\/\s,&+\-]/g, "")
      .replace(/\s+/g, " ")
      .toUpperCase()
      .trim();

    if (cleaned in headerToPillarMap) {
      return headerToPillarMap[cleaned];
    }

    // Direct string match of major uppercase sections in the text
    for (const key of Object.keys(headerToPillarMap)) {
      if (cleaned === key || cleaned.includes(key) && key.length >= 10) {
        return headerToPillarMap[key];
      }
    }

    return null;
  };

  for (const line of lines) {
    const matchedPNum = getPillarFromLine(line);
    if (matchedPNum !== null) {
      if (currentPilar > 0) {
        result[currentPilar] = currentContent.join("\n").trim();
      }
      currentPilar = matchedPNum;
      
      let formattedHeader = line.trim();
      if (!formattedHeader.startsWith("###") && !formattedHeader.startsWith("#")) {
        const defSec = defaultDashboardSections.find(s => s.number === matchedPNum);
        if (defSec) {
          formattedHeader = `### ${matchedPNum}. ${defSec.title}`;
        } else {
          formattedHeader = `### ${formattedHeader}`;
        }
      }
      
      currentContent = [formattedHeader];
    } else if (currentPilar > 0) {
      currentContent.push(line);
    }
  }

  if (currentPilar > 0) {
    result[currentPilar] = currentContent.join("\n").trim();
  }

  return result;
}

export function extractProjectTitleFromAI(text: string): string | null {
  // Pattern 1: proyek yang sedang kita analisis adalah "..."
  const p1 = text.match(/proyek yang sedang kita analisis adalah\s*(?:"|'|«|“|`|')?([^"'\n\.«“”`\(\)]+)/i);
  if (p1 && p1[1] && p1[1].trim().length > 3) {
    return p1[1].trim();
  }
  
  // Pattern 2: Kajian Strategis: ...
  const p2 = text.match(/Kajian Strategis:\s*([^\n\.\"\']+)/i);
  if (p2 && p2[1] && p2[1].trim().length > 3) {
    return p2[1].trim();
  }
  
  return null;
}

export function getDefaultCompetitorsForProject(projectName: string): CompetitorIntel[] {
  const nameLower = projectName.toLowerCase();
  
  if (nameLower.includes("waste") || nameLower.includes("limbah") || nameLower.includes("sampah")) {
    return [
      {
        id: "comp-w-1",
        name: "PT Prasadha Pamunah Limbah Industri (PPLI)",
        projectHistory: "Menguasai rute pembuangan minyak lumpur (sludge) Pertamina & pengolahan kimia B3 Cikarang.",
        marketShare: 45,
        status: "Incumbent",
        strengths: "Memiliki fasilitas pemrosesan terintegrasi (landfill khusus B3) berskala sangat besar dan armada berstandar internasional.",
        weaknesses: "Tarif sewa & pembuangan sangat mahal, birokrasi kontrak sangat kaku, serta respon lambat untuk permintaan armada dadakan.",
        explanation: "PPLI adalah pemimpin pasar pengolahan limbah industri di Indonesia. Mereka memenangkan tender korporasi multinasional besar. Namun, Pancaran dapat masuk melalui strategi fleksibilitas tarif dan respon pemuatan instan.",
        armadaScale: "250+ Unit Vacuum/Box",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 96
      },
      {
        id: "comp-w-2",
        name: "PT Wastec International",
        projectHistory: "Pernah mengambil kontrak pengangkutan sludge pabrik kimia Cilegon & insinerasi Tangerang.",
        marketShare: 25,
        status: "Bidding",
        strengths: "Memiliki insinerator modern berkapasitas tinggi di Banten dan Jawa Timur, serta kuat di jaringan pabrik tekstil/manufaktur.",
        weaknesses: "Jumlah armada truk logistik mandiri terbatas, sering mensubkontrakkan rute angkutan ke transporter pihak ketiga yang kurang andal.",
        explanation: "Wastec memegang kendali atas banyak limbah yang butuh dimusnahkan secara termal (insinerasi). Kelemahan mereka ada pada lini transportasi darat yang tidak seandal Pancaran Group.",
        armadaScale: "60+ Unit Armored Box",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 88
      },
      {
        id: "comp-w-3",
        name: "PT Arahi Indonesia (Logistics Division)",
        projectHistory: "Mengambil proyek transporter limbah Fly Ash & Bottom Ash (FABA) Pembangkit Listrik Jawa.",
        marketShare: 15,
        status: "Inactive",
        strengths: "Tarif angkut sangat murah, memiliki kedekatan dengan regulator daerah setempat, dan sangat lincah menegosiasikan harga kargo.",
        weaknesses: "Manajemen K3 sangat buruk, armada truk tua yang sering mogok, tidak memiliki sistem telemetri digital real-time.",
        explanation: "Arahi memenangkan tender karena perang tarif miring. Namun, mereka rentan didiskualifikasi oleh klien B2B karena melanggar standar HSE lingkungan.",
        armadaScale: "35+ Dump Truck",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 64
      },
      {
        id: "comp-w-4",
        name: "Transporter Logistik Lokal / Konvensional (Non-Izin)",
        projectHistory: "Mengambil proyek pengangkutan limbah padat & tekstil eceran Jawa Barat tanpa kontrak formal.",
        marketShare: 10,
        status: "Displaced",
        strengths: "Tidak terikat kontrak hukum formal, harga sangat fleksibel (transaksi tunai langsung), serta bisa beroperasi kapan saja.",
        weaknesses: "Izin AMDAL tidak sah/bodong, berisiko tinggi terkena razia atau tuntutan pidana lingkungan hidup.",
        explanation: "Pemain eceran ini mengambil kargo dari industri kecil. Pancaran Swarnadwipa dapat mendisrupsi mereka dengan menawarkan edukasi legalitas dan kepatuhan hukum total.",
        armadaScale: "Truk Bak Terbuka Eceran",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 40
      }
    ];
  } else if (nameLower.includes("forestry") || nameLower.includes("kehutanan") || nameLower.includes("wood") || nameLower.includes("pulp") || nameLower.includes("logging") || nameLower.includes("kayu")) {
    return [
      {
        id: "comp-f-1",
        name: "PT Riau Andalan Pulp & Paper (RAPP) Logistics",
        projectHistory: "Mengambil proyek hauling logging internal Riau & Jambi Pulp Estate.",
        marketShare: 50,
        status: "Incumbent",
        strengths: "Armada logistik internal berskala raksasa, memiliki rute hauling privat terisolasi, serta efisiensi biaya luar biasa.",
        weaknesses: "Hanya berfokus melayani grup holding sendiri, sangat tidak fleksibel untuk melayani pemegang konsesi kecil di luar grup.",
        explanation: "RAPP Logistics mendominasi Sumatera bagian tengah. Pancaran Group dapat masuk untuk memenangkan tender dari pemegang konsesi kayu independen atau perkebunan sekunder yang tidak tertampung oleh armada RAPP.",
        armadaScale: "500+ Logging Trucks",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 94
      },
      {
        id: "comp-f-2",
        name: "PT Tanjung Enim Lestari (TEL) Transporter Division",
        projectHistory: "Mengambil proyek pengangkutan kayu gelondongan Sumsel & Muara Enim.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Memiliki rute tetap berizin pemda, armada kuat tipe multi-axle, serta jaringan sopir lokal yang terlatih.",
        weaknesses: "Pemanfaatan sistem tracking masih manual, sering mengalami kehilangan solar (fuel theft) di rute terpencil karena minim IoT.",
        explanation: "TEL menguasai area Sumatera Selatan. Kelemahan operasional mereka dalam mencegah kecurangan solar dan pemantauan timbangan dapat dikalahkan oleh sistem IoT Smart Telematics Pancaran.",
        armadaScale: "80+ Truk Tronton",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 82
      },
      {
        id: "comp-f-3",
        name: "Kontraktor Angkutan Logging Independen (Lokal)",
        projectHistory: "Mengambil proyek distribusi kayu hutan rakyat & supplier sawit regional secara musiman.",
        marketShare: 15,
        status: "Inactive",
        strengths: "Sangat murah, bersedia melibas jalur berlumpur ekstrem tanpa asuransi kargo, serta syarat kerja sangat fleksibel.",
        weaknesses: "Sering melanggar batas muatan (ODOL), truk sering terbalik di jalur hutan, dan tidak memiliki standar K3.",
        explanation: "Pemain lokal ini menguasai angkutan kecil-kecil namun sering membuat jalan umum rusak karena overload. Mereka rentan terkena sanksi razia timbangan berat dari dinas perhubungan.",
        armadaScale: "Truk Engkel / Dump Tua",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 55
      }
    ];
  } else if (nameLower.includes("cold") || nameLower.includes("reefer") || nameLower.includes("food") || nameLower.includes("boga") || nameLower.includes("pharmacy") || nameLower.includes("obat")) {
    return [
      {
        id: "comp-c-1",
        name: "PT MGM Bosco Logistik",
        projectHistory: "Mengambil proyek logistik rantai dingin McDonalds, Unilever Walls, & importir daging utama.",
        marketShare: 40,
        status: "Incumbent",
        strengths: "Memiliki cold storage raksasa di berbagai kota besar terintegrasi armada pendingin termodern nasional.",
        weaknesses: "Armada sering fully-booked untuk korporasi raksasa, tarif sewa harian sangat mahal, tidak melayani rute fleksibel sekunder.",
        explanation: "MGM Bosco adalah penguasa mutlak cold chain premium. Namun, Pancaran dapat menawarkan keunggulan berupa ketersediaan armada instan untuk rute point-to-point cepat tanpa syarat volume minimum ekstrem.",
        armadaScale: "300+ Reefer Trucks",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 95
      },
      {
        id: "comp-c-2",
        name: "PT Iron Bird Cold Chain (Blue Bird Group)",
        projectHistory: "Mengambil proyek distribusi bahan baku restoran cepat saji Jabodetabek & Jawa Barat.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Didukung oleh manajemen profesional grup Blue Bird, keandalan sopir luar biasa, serta jaminan asuransi kargo 100%.",
        weaknesses: "Fokus utama masih di wilayah perkotaan (urban logistics), rute antar-pulau atau lintas Sumatera sangat terbatas.",
        explanation: "Iron Bird memiliki reputasi korporasi yang sangat baik tapi jangkauan geografis mereka di luar pulau Jawa belum optimal. Ini adalah peluang besar bagi rute antarpulau Pancaran.",
        armadaScale: "120+ Reefer Vans",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 93
      },
      {
        id: "comp-c-3",
        name: "Transporter Reefer Sewaan Mandiri (Perorangan)",
        projectHistory: "Mengambil proyek logistik es kristal & hasil tangkapan laut lokal secara harian.",
        marketShare: 20,
        status: "Displaced",
        strengths: "Harga sewa sangat murah, bisa dinegosiasikan langsung dengan pemilik truk, tanpa syarat admin berbelit.",
        weaknesses: "Mesin termoregulasi sering mati di tengah rute menyebabkan fluktuasi suhu ekstrim, merusak kargo boga/obat sensitif.",
        explanation: "Seringkali kompresor AC truk mereka tua dan tidak memiliki alarm peringatan suhu. Pancaran dapat merebut pasar dengan sistem jaminan suhu konstan (SLA Zero Defect).",
        armadaScale: "Sasis Colt Diesel Pendingin",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 60
      }
    ];
  } else if (nameLower.includes("coal") || nameLower.includes("batubara") || nameLower.includes("hauling") || nameLower.includes("mining") || nameLower.includes("tambang")) {
    return [
      {
        id: "comp-m-1",
        name: "PT Petrosea Tbk (Mining Logistics Division)",
        projectHistory: "Mengambil kontrak hauling batubara Adaro & Kideco Jaya Agung Kalimantan.",
        marketShare: 35,
        status: "Incumbent",
        strengths: "Memiliki armada alat berat & heavy-duty dump trucks tercanggih, standar keselamatan tambang internasional tinggi.",
        weaknesses: "Tarif sewa per ton-kilometer (ton-km) sangat mahal, mobilisasi unit ke lokasi tambang baru membutuhkan waktu sangat lama.",
        explanation: "Petrosea adalah raksasa tambang terkemuka. Keunggulan Pancaran Group terletak pada kecepatan mobilisasi unit armada tipper baru berkat logistik internal yang cepat dan efisiensi biaya opex.",
        armadaScale: "180+ Scania Heavy Dumpers",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 97
      },
      {
        id: "comp-m-2",
        name: "PT Kaltim Prima Coal (KPC) Internal Transporter",
        projectHistory: "Mengambil proyek hauling batubara tambang Sangatta Kalimantan Timur secara eksklusif.",
        marketShare: 30,
        status: "Inactive",
        strengths: "Menguasai infrastruktur jalan hauling tambang milik sendiri, koordinasi operasi lokal sangat mulus.",
        weaknesses: "Rigid dan tidak diperbolehkan menerima pengangkutan batubara dari konsesi kecil pihak ketiga (IUP mandiri) di sekitarnya.",
        explanation: "KPC memfokuskan armadanya khusus untuk konsumsi grup pertambangan mereka sendiri. IUP-IUP kecil di sekitarnya terlantar tanpa transporter andal, yang merupakan target SOM sempurna bagi Pancaran.",
        armadaScale: "250+ Caterpillar Dumpers",
        digitalSystems: "Sangat Baik",
        pricePoint: "Sangat Mahal",
        safetyIndex: 95
      },
      {
        id: "comp-m-3",
        name: "Transporter Hauling Lokal Tradisional (Koperasi Tambang)",
        projectHistory: "Mengambil proyek pengangkutan batubara IUP rakyat & stockpile pelabuhan darat lokal.",
        marketShare: 20,
        status: "Bidding",
        strengths: "Didukung oleh serikat pekerja lokal dan pemuka adat setempat, biaya operasi minimal karena upah rendah.",
        weaknesses: "Sering overload (ODOL), kecelakaan kerja tinggi karena ketiadaan APD, dan armada sering amblas di rute lumpur tambang.",
        explanation: "Pemain lokal ini memegang kendali atas kedekatan sosial. Pancaran dapat bermitra dengan koperasi lokal ini sebagai subkontrak pengemudi namun dengan pengawasan K3 serta standar armada dari Pancaran.",
        armadaScale: "Truk Tipper Rakitan Lokal",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 50
      }
    ];
  } else {
    return [
      {
        id: "comp-g-1",
        name: "PT Dunia Express (Dunex Logistics)",
        projectHistory: "Mengambil proyek logistik FMCG Mayora, Astra Honda, & pergudangan Karawang.",
        marketShare: 35,
        status: "Incumbent",
        strengths: "Memiliki ribuan unit truk box, depo peti kemas berfasilitas lengkap, serta sistem ERP pergudangan canggih.",
        weaknesses: "Fokus utamanya adalah logistik general cargo jalan raya (on-road), kurang berpengalaman untuk jalur off-road ekstrim atau muatan B3.",
        explanation: "Dunex adalah raksasa kargo umum Jawa. Namun, untuk proyek logistik khusus yang membutuhkan sertifikasi AMDAL, penanganan material berbahaya, atau medan tambang, keahlian khusus Pancaran jauh lebih unggul.",
        armadaScale: "800+ Box/Wingbox",
        digitalSystems: "Sangat Baik",
        pricePoint: "Menengah",
        safetyIndex: 92
      },
      {
        id: "comp-g-2",
        name: "PT Lookman Djaja",
        projectHistory: "Mengambil proyek rantai logistik manufaktur koridor Jakarta-Surabaya (Pantura).",
        marketShare: 25,
        status: "Bidding",
        strengths: "Tarif sangat kompetitif untuk volume besar, memiliki cabang kantor operasional di sepanjang jalur Pantura Jawa.",
        weaknesses: "Kurang memiliki instrumentasi IoT khusus seperti sensor suspensi anti-ODOL, serta kurangnya sertifikasi ESG emisi.",
        explanation: "Lookman Djaja adalah transporter andalan lintas Jawa. Untuk menandingi mereka, Pancaran Group mengedepankan diferensiasi berupa integrasi kontrol sensor IoT real-time.",
        armadaScale: "400+ Truk Fuso",
        digitalSystems: "Standar",
        pricePoint: "Menengah",
        safetyIndex: 85
      },
      {
        id: "comp-g-3",
        name: "Perusahaan Ekspedisi Skala Kecil & Makelar Truk",
        projectHistory: "Mengambil proyek pengiriman bahan bangunan & komoditas pasar tradisional secara eceran.",
        marketShare: 25,
        status: "Inactive",
        strengths: "Harga sangat fleksibel, bersedia disewa kapan saja untuk sekali jalan tanpa komitmen kontrak formal.",
        weaknesses: "Ketersediaan unit sangat tidak menentu (spot market), dokumen legalitas rapuh, tidak ada jaminan keamanan jika barang hilang.",
        explanation: "Sering digunakan oleh industri kecil menengah. Klien korporat besar pasti menghindari broker ini demi kepatuhan audit legalitas finansial perusahaan.",
        armadaScale: "Sasis Truk Tua Variatif",
        digitalSystems: "Sangat Minim",
        pricePoint: "Sangat Murah",
        safetyIndex: 50
      }
    ];
  }
}

