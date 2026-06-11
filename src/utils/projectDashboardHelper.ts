/**
 * projectDashboardHelper.ts
 * Rich default Indonesian analysis templates and Word/PPT exporters for the 14 project management sections.
 */

import pptxgen from "pptxgenjs";

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
  // Charcoal full fluid background
  slide1.background = { color: "0F172A" };
  // Visual accent green block
  slide1.addShape("rect", {
    x: 0.1, y: 0.1, w: 0.3, h: 7.3,
    fill: { color: "00D285" }
  });
  // Title text
  slide1.addText("KAJIAN STRATEGIS KOMPREHENSIF", {
    x: 0.8, y: 1.8, w: 11.5, h: 0.5,
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
  closingSlide.background = { color: "0F172A" };
  closingSlide.addShape("rect", {
    x: 0.1, y: 0.1, w: 13.13, h: 0.2,
    fill: { color: "00D285" }
  });
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
