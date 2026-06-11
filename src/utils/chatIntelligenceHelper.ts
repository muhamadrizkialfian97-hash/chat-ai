/**
 * chatIntelligenceHelper.ts
 * Helper utility containing defaults, calculations, and Word/PowerPoint exporters
 * specifically tailored for the Chat Intelligence & Business Intelligence Dashboard.
 */

import pptxgen from "pptxgenjs";

export interface ChatIntelligenceState {
  projectTitle: string;
  targetCompany: string;
  division: string;
  initialCapex: number; // in Millions of IDR (e.g., 8500 = Rp 8.5 Miliar)
  annualSavings: number; // in Millions of IDR (e.g., 2800 = Rp 2.8 Miliar)
  salesIncrease: number; // in Millions of IDR (e.g., 1600 = Rp 1.6 Miliar)
  recommendations: Array<{
    id: string;
    title: string;
    category: string; // "Digital" | "Operasional" | "SDM" | "Risiko"
    description: string;
    impact: "High" | "Medium" | "Low";
    cost: number; // in Millions of IDR
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  timeline: Array<{
    phase: string;
    duration: string;
    task: string;
    deliverable: string;
  }>;
}

export const defaultChatIntelligence: ChatIntelligenceState = {
  projectTitle: "Integrasi Inteligensi Chat & Sistem Operasi Logistik Digital",
  targetCompany: "PT Pancaran Group Services",
  division: "Commercial & Business Development",
  initialCapex: 8900, // Rp 8.9 Miliar
  annualSavings: 2800, // Rp 2.8 Miliar / Tahun
  salesIncrease: 1600, // Rp 1.6 Miliar / Tahun
  recommendations: [
    {
      id: "rec-1",
      title: "Optimasi Rute Armada B3 via AI & Geofencing",
      category: "Digital",
      description: "Penerapan perutean prediktif otomatis untuk armada truk hulu-ke-hilir untuk mengurangi empty kilometers sebesar 18% dan menghemat biaya bahan bakar.",
      impact: "High",
      cost: 450
    },
    {
      id: "rec-2",
      title: "Automated Stream API FESTRONIK KLHK",
      category: "Digital",
      description: "Mengintegrasikan sistem ERP internal langsung ke server pelaporan KLHK untuk validasi elektronik manifes angkutan limbah.",
      impact: "High",
      cost: 250
    },
    {
      id: "rec-3",
      title: "Lisensi B3 Mandiri di Pancaran Training Center",
      category: "SDM",
      description: "Menyelenggarakan program beasiswa sertifikasi internal Kemenhub untuk mempercepat pengadaan kru tangki terampil siap kerja.",
      impact: "Medium",
      cost: 350
    },
    {
      id: "rec-4",
      title: "Instalasi Monitoring Tekanan Kapasitas IoT",
      category: "Operasional",
      description: "Pemasangan sensor tekanan pneumatik modular jarak jauh untuk memitigasi bahaya kebocoran angkutan gas & tangki vakum baja tebal secara realtime.",
      impact: "High",
      cost: 550
    }
  ],
  swot: {
    strengths: [
      "Armada tangki, vacuum, dan multi-axle berlisensi resmi dengan jumlah unit terbesar.",
      "Reputasi kepatuhan HSE yang dipercaya oleh korporasi minyak internasional dan manufaktur sensitif.",
      "Fasilitas Pancaran Training Center mandiri untuk pembinaan kemudi bersertifikasi."
    ],
    weaknesses: [
      "Proses entri manifest manual di pelabuhan/depo yang memperlambat siklus armada.",
      "Kebutuhan rekrutmen kru bersertifikat B3 SIM BII Umum yang memakan biaya besar.",
      "Fragmentasi data laporan konsumsi BBM antar wilayah trayek."
    ],
    opportunities: [
      "Melambungnya permintaan logistik logis berkelanjutan berstandar penilaian ESG.",
      "Peluang rute angkutan limbah padat kering/cair dari kawasan industri baru Jawa Tengah.",
      "Konsorsium hulu-hilir dengan pusat pemrosesan limbah berizin tinggi di Jawa Barat."
    ],
    threats: [
      "Fluktuasi harga bahan bakar solar nonsubsidi industri.",
      "Kompetitor skala kecil yang menawarkan dumping tarif dengan mengabaikan aspek perlindungan HSE.",
      "Proses lisensi fisik berkala instansi yang dinamis di berbagai daerah."
    ]
  },
  timeline: [
    {
      phase: "Fase 1: Asesmen & Setup API",
      duration: "Bulan ke-1",
      task: "Audit konektivitas internet depo, setup webhook API FESTRONIK, dan registrasi pendaftaran unit.",
      deliverable: "Hasil Penyelarasan API Integrasi PRAMA & Logistik"
    },
    {
      phase: "Fase 2: Instalasi Sensor & Training",
      duration: "Bulan ke-2",
      task: "Pemasangan komponen IoT sensor anti-bocor pada 15 unit perdana dan sosialisasi SOP kru.",
      deliverable: "Armada Pilot Lulus Kalibrasi Alat Sensor Tekanan"
    },
    {
      phase: "Fase 3: Rute Percobaan Komersial",
      duration: "Bulan ke-3",
      task: "Uji jalan rute angkutan limbah kimia dari Karawang dengan sinkronisasi manifest digital.",
      deliverable: "Penerbitan Festronik Elektronik Perdana Secara Otomatis"
    },
    {
      phase: "Fase 4: Ekspansi & Operasi Penuh",
      duration: "Bulan ke-4+",
      task: "Implementasi menyeluruh rute logistik cerdas, serta peluncuran modul dasbor BI ke divisi komersial.",
      deliverable: "Sertifikasi Pencapaian Target Ops 35% Efisiensi"
    }
  ]
};

/**
 * Perform calculations for investment return
 */
export function calculateBIAnalysis(state: ChatIntelligenceState) {
  const capex = state.initialCapex;
  // Combined contribution per year from ops savings and sales increment
  const annualBenefit = state.annualSavings + state.salesIncrease;
  
  // Payback Period in years
  const paybackPeriod = annualBenefit > 0 ? Number((capex / annualBenefit).toFixed(1)) : 0;
  
  // ROI after 3 years
  const netBenefit3Years = (annualBenefit * 3) - capex;
  const roiPercentage3Years = capex > 0 ? Number(((netBenefit3Years / capex) * 100).toFixed(1)) : 0;

  // Contributions ratio
  const efficiencyShare = annualBenefit > 0 ? Number(((state.annualSavings / annualBenefit) * 100).toFixed(0)) : 50;
  const growthShare = 100 - efficiencyShare;

  return {
    paybackPeriod,
    roiPercentage3Years,
    annualBenefit,
    netBenefit3Years,
    efficiencyShare,
    growthShare
  };
}

/**
 * Export Chat Intelligence BI dashboard to deep-dive formatted Microsoft Word Doc
 */
export function exportChatBIToWord(state: ChatIntelligenceState) {
  const calc = calculateBIAnalysis(state);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Hasil Permintaan Chat BI - ${state.projectTitle}</title>
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
          color: #1e293b; 
          margin: 0;
        }
        h1 { 
          font-size: 20pt; 
          color: #0f172a; 
          margin-top: 0;
          margin-bottom: 6pt; 
          font-weight: bold; 
          border-bottom: 2px solid #00d285;
          padding-bottom: 8pt;
        }
        h2 {
          font-size: 14pt;
          color: #00875a;
          margin-top: 20pt;
          margin-bottom: 8pt;
          border-bottom: 1px dashed #cbd5e9;
          padding-bottom: 2pt;
        }
        .meta-box {
          background-color: #f8fafc;
          border-left: 4px solid #00d285;
          padding: 12pt;
          margin-bottom: 18pt;
          font-size: 9.5pt;
          color: #475569;
        }
        .stat-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10pt;
          margin-bottom: 15pt;
        }
        .stat-table th {
          background-color: #0f172a;
          color: #ffffff;
          font-size: 10pt;
          font-weight: bold;
          text-align: left;
          padding: 8pt;
          border: 1px solid #1e293b;
        }
        .stat-table td {
          padding: 8pt;
          font-size: 9.5pt;
          border: 1px solid #e2e8f0;
        }
        .badge {
          font-weight: bold;
          font-size: 8pt;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .swot-grid {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10pt;
        }
        .swot-cell {
          width: 50%;
          border: 1px solid #cbd5e1;
          vertical-align: top;
          padding: 10pt;
        }
        .swot-title {
          font-weight: bold;
          font-size: 11pt;
          margin-bottom: 6pt;
          text-transform: uppercase;
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
        <div style="font-size: 9pt; font-family: monospace; color: #00d285; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px;">
          LAPORAN COGNITIVE BUSINESS INTELLIGENCE
        </div>
        <h1>${state.projectTitle.toUpperCase()}</h1>
        <div style="font-size: 11pt; color: #475569; font-weight: bold; margin-bottom: 12pt;">Unit Kerja / Divisi: ${state.division}</div>
        
        <div class="meta-box">
          <strong>Perusahaan Sasaran:</strong> ${state.targetCompany}<br>
          <strong>Dibuat Pada:</strong> ${dateStr}<br>
          <strong>Sistem Eksportir:</strong> PRAMA System Advisor Intelligent Assistant - PT Pancaran Group
        </div>

        <h2>I. RINGKASAN INTELIGENSI STATISTIK (BI METRICS)</h2>
        <p>Berdasarkan simulasi kalkulator finansial terpadu, draf transformatif dari intelijensi asisten PRAMA diestimasikan memiliki parameter kesehatan kelayakan modal sebagai berikut:</p>
        
        <table class="stat-table">
          <thead>
            <tr>
              <th>Parameter Keuangan</th>
              <th>Nilai Nominal</th>
              <th>Status Kelayakan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Investasi Awal (CAPEX)</strong></td>
              <td>Rp ${(state.initialCapex / 1000).toFixed(2)} Miliar (${state.initialCapex.toLocaleString()} Jt)</td>
              <td>Dialokasikan penuh pada infrastruktur & IoT</td>
            </tr>
            <tr>
              <td><strong>Target Penghematan Operasional</strong></td>
              <td>Rp ${(state.annualSavings / 1000).toFixed(2)} Miliar / Tahun</td>
              <td>Efisiensi rute dan konsumsi BBM armada</td>
            </tr>
            <tr>
              <td><strong>Kenaikan Nilai Penjualan Baru</strong></td>
              <td>Rp ${(state.salesIncrease / 1000).toFixed(2)} Miliar / Tahun</td>
              <td>SLA kepatuhan ESG bernilai premium</td>
            </tr>
            <tr>
              <td><strong>Total Manfaat / Tahun</strong></td>
              <td>Rp ${(calc.annualBenefit / 1000).toFixed(2)} Miliar / Tahun</td>
              <td>Sangat Menguntungkan</td>
            </tr>
            <tr>
              <td><strong>Payback Period (PBP)</strong></td>
              <td><span style="color: #00875a; font-weight: bold;">${calc.paybackPeriod} Tahun</span></td>
              <td>Optimal (Kategori investasi cepat)</td>
            </tr>
            <tr>
              <td><strong>Proyeksi ROI 3 Tahun</strong></td>
              <td><span style="color: #00875a; font-weight: bold;">${calc.roiPercentage3Years}%</span></td>
              <td>Sangat Tinggi (> Standar Korporasi 25%)</td>
            </tr>
          </tbody>
        </table>

        <h2>II. REKOMENDASI SOLUSI STRATEGIS</h2>
        <p>Rekomendasi taktis hasil pemrosesan copilot chat diurutkan berdasarkan skala dampak kualitatif dan taksiran alokasi biaya pengimplementasian:</p>

        <table class="stat-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Rekomendasi Program</th>
              <th>Kategori</th>
              <th>Detail Program Strategis</th>
              <th>Skala Dampak</th>
              <th>Est. Biaya</th>
            </tr>
          </thead>
          <tbody>
            ${state.recommendations.map((rec, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${rec.title}</strong></td>
                <td>${rec.category}</td>
                <td>${rec.description}</td>
                <td><span style="color: ${rec.impact === "High" ? "#dc2626" : rec.impact === "Medium" ? "#d97706" : "#2563eb"}; font-weight: bold;">${rec.impact}</span></td>
                <td>Rp ${rec.cost.toLocaleString()} Jt</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>III. STRATEGIC SWOT ANALYSIS TABLE</h2>
        <p>Kerangka matriks kekuatan, kelemahan, peluang, dan ancaman dari hasil perumusan draf:</p>

        <table class="swot-grid">
          <tr>
            <td class="swot-cell" style="background-color: #f0fdf4;">
              <div class="swot-title" style="color: #166534;">STRENGTHS (Kekuatan)</div>
              <ul style="padding-left: 14pt; margin: 0; font-size: 9pt; color: #1e293b;">
                ${state.swot.strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </td>
            <td class="swot-cell" style="background-color: #fef2f2;">
              <div class="swot-title" style="color: #991b1b;">WEAKNESSES (Kelemahan)</div>
              <ul style="padding-left: 14pt; margin: 0; font-size: 9pt; color: #1e293b;">
                ${state.swot.weaknesses.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </td>
          </tr>
          <tr>
            <td class="swot-cell" style="background-color: #eff6ff;">
              <div class="swot-title" style="color: #1e40af;">OPPORTUNITIES (Peluang)</div>
              <ul style="padding-left: 14pt; margin: 0; font-size: 9pt; color: #1e293b;">
                ${state.swot.opportunities.map(o => `<li>${o}</li>`).join('')}
              </ul>
            </td>
            <td class="swot-cell" style="background-color: #fffbeb;">
              <div class="swot-title" style="color: #854d0e;">THREATS (Ancaman)</div>
              <ul style="padding-left: 14pt; margin: 0; font-size: 9pt; color: #1e293b;">
                ${state.swot.threats.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </td>
          </tr>
        </table>

        <h2>IV. ROADMAP METODOLOGI IMPLEMENTASI</h2>
        <p>Linimasa bertahap taktis untuk meluncurkan inovasi ini di lapangan operasional PT Pancaran Group:</p>

        <table class="stat-table">
          <thead>
            <tr>
              <th>Tahap Pengembangan</th>
              <th>Estimasi Waktu</th>
              <th>Aktivitas Kerja Utama</th>
              <th>Luaran / Deliverable Kunci</th>
            </tr>
          </thead>
          <tbody>
            ${state.timeline.map(t => `
              <tr>
                <td><strong>${t.phase}</strong></td>
                <td><span style="font-family: monospace;">${t.duration}</span></td>
                <td>${t.task}</td>
                <td><span style="color: #00875a; font-weight: bold;">${t.deliverable}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          PRAMA IN-SITE DIGITAL INTEGRATED REPORTING SYSTEM &bull; PANCARAN GROUP &bull; COGNITIVE BI REPORT
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedFilename = `BI_Dashboard_Hasil_Chat_${state.projectTitle.trim().replace(/\s+/g, "_")}.doc`;
  
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
 * Export Chat Intelligence BI dashboard to gorgeous widescreen corporate slides using pptxgenjs
 */
export async function exportChatBIToPPTX(state: ChatIntelligenceState) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // Modern Widescreen 16:9

  const calc = calculateBIAnalysis(state);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- SLIDE 1: Cover Slide ---
  const slide1 = pptx.addSlide();
  slide1.background = { color: "0F172A" }; // Deep slate/black theme
  
  // Left side bright green vertical lines
  slide1.addShape("rect", {
    x: 0.1, y: 0.1, w: 0.3, h: 7.3,
    fill: { color: "00D285" }
  });

  slide1.addText("CHATS TO STRATEGIC BUSINESS INTELLIGENCE", {
    x: 0.8, y: 1.8, w: 11.5, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: "00D285", bold: true
  });
  slide1.addText(state.projectTitle.toUpperCase(), {
    x: 0.8, y: 2.3, w: 11.5, h: 1.5,
    fontSize: 28, fontFace: "Arial Black", color: "FFFFFF"
  });
  slide1.addText(`Divisi/Target: ${state.division} • ${state.targetCompany}`, {
    x: 0.8, y: 4.0, w: 11.5, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: "94A3B8", italic: true
  });
  slide1.addText("PT PANCARAN GROUP • COGNITIVE STRATEGIC PROPOSAL", {
    x: 0.8, y: 5.6, w: 11.5, h: 0.4,
    fontSize: 10, fontFace: "Courier New", color: "475569", bold: true
  });
  slide1.addText(`Disusun pada tanggal: ${dateStr}`, {
    x: 0.8, y: 6.0, w: 11.5, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "64748B"
  });

  // --- SLIDE 2: Business Intelligence Financial Metrics ---
  const slide2 = pptx.addSlide();
  slide2.background = { color: "F8FAFC" };

  // Top header banner
  slide2.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 0.8,
    fill: { color: "0F172A" }
  });
  slide2.addText("I. METRIK KELAYAKAN INVESTASI (FINANCIAL BI)", {
    x: 0.4, y: 0.18, w: 8.5, h: 0.45,
    fontSize: 15, fontFace: "Arial Black", color: "00D285"
  });
  slide2.addText(`Target: ${state.targetCompany}`, {
    x: 9.0, y: 0.22, w: 3.9, h: 0.4,
    fontSize: 10, fontFace: "Calibri", color: "94A3B8", align: "right"
  });

  // KPI boxes in a row
  // Box 1: CAPEX
  slide2.addShape("rect", { x: 0.6, y: 1.4, w: 3.7, h: 2.2, fill: { color: "FFFFFF" }, line: { color: "CBD5E1" } });
  slide2.addShape("rect", { x: 0.6, y: 1.4, w: 3.7, h: 0.4, fill: { color: "0F172A" } });
  slide2.addText("CAPEX (Investasi Awal)", { x: 0.8, y: 1.45, w: 3.3, h: 0.3, fontSize: 10, fontFace: "Arial Black", color: "FFFFFF" });
  slide2.addText(`Rp ${(state.initialCapex / 1000).toFixed(2)} Miliar`, { x: 0.8, y: 2.1, w: 3.3, h: 0.6, fontSize: 22, fontFace: "Arial", color: "0F172A", bold: true });
  slide2.addText(`Taksiran Rp ${state.initialCapex.toLocaleString()} Juta`, { x: 0.8, y: 2.8, w: 3.3, h: 0.4, fontSize: 11, fontFace: "Calibri", color: "64748B" });

  // Box 2: Total Benefit
  slide2.addShape("rect", { x: 4.8, y: 1.4, w: 3.7, h: 2.2, fill: { color: "FFFFFF" }, line: { color: "CBD5E1" } });
  slide2.addShape("rect", { x: 4.8, y: 1.4, w: 3.7, h: 0.4, fill: { color: "00D285" } });
  slide2.addText("TOTAL MANFAAT / TAHUN", { x: 5.0, y: 1.45, w: 3.3, h: 0.3, fontSize: 10, fontFace: "Arial Black", color: "0F172A" });
  slide2.addText(`Rp ${(calc.annualBenefit / 1000).toFixed(2)} Miliar`, { x: 5.0, y: 2.1, w: 3.3, h: 0.6, fontSize: 22, fontFace: "Arial", color: "00875a", bold: true });
  slide2.addText(`Ops: Rp ${state.annualSavings.toLocaleString()} Jt + Sales: Rp ${state.salesIncrease.toLocaleString()} Jt`, { x: 5.0, y: 2.8, w: 3.3, h: 0.4, fontSize: 9.5, fontFace: "Calibri", color: "64748B" });

  // Box 3: Payback Period & ROI
  slide2.addShape("rect", { x: 9.0, y: 1.4, w: 3.7, h: 2.2, fill: { color: "FFFFFF" }, line: { color: "CBD5E1" } });
  slide2.addShape("rect", { x: 9.0, y: 1.4, w: 3.7, h: 0.4, fill: { color: "00875a" } });
  slide2.addText("PAYBACK PERIOD & ROI", { x: 9.2, y: 1.45, w: 3.3, h: 0.3, fontSize: 10, fontFace: "Arial Black", color: "FFFFFF" });
  slide2.addText(`${calc.paybackPeriod} Tahun`, { x: 9.2, y: 2.1, w: 3.3, h: 0.6, fontSize: 22, fontFace: "Arial", color: "00875a", bold: true });
  slide2.addText(`Proyeksi ROI 3 Tahun sebesar ${calc.roiPercentage3Years}%`, { x: 9.2, y: 2.8, w: 3.3, h: 0.4, fontSize: 11, fontFace: "Calibri", color: "64748B" });

  // Strategic breakdown paragraph
  slide2.addShape("rect", { x: 0.6, y: 4.1, w: 12.1, h: 2.4, fill: { color: "FFFFFF" }, line: { color: "E2E8F0" } });
  slide2.addShape("rect", { x: 0.6, y: 4.1, w: 0.1, h: 2.4, fill: { color: "00D285" } });
  
  const financeBullets = [
    { text: `Alokasi CAPEX fokus pada akuisisi telematika sensor anti-bocor, sistem Webhook API FESTRONIK, dan sertifikasi kru.`, options: { bullet: true, fontSize: 12, color: "334155" } },
    { text: `Payback period diestimasikan tercapai dalam ${calc.paybackPeriod} tahun, didukung pilar efisiensi operasional (${calc.efficiencyShare}%) dan katalis peningkatan penjualan jasa (${calc.growthShare}%).`, options: { bullet: true, fontSize: 12, color: "334155" } },
    { text: `Proyeksi ROI 3 tahun mencapai ${calc.roiPercentage3Years}%, melebihi ambang batas toleransi korporasi general cargo (25%).`, options: { bullet: true, fontSize: 12, color: "334155" } }
  ];
  slide2.addText(financeBullets, { x: 0.9, y: 4.4, w: 11.5, h: 1.8, lineSpacing: 22 });

  // --- SLIDE 3: Key Recommendations ---
  const slide3 = pptx.addSlide();
  slide3.background = { color: "F8FAFC" };

  slide3.addShape("rect", { x: 0, y: 0, w: 13.33, h: 0.8, fill: { color: "0F172A" } });
  slide3.addText("II. REKOMENDASI PROGRAM TAKTIS HASIL CHAT AI", {
    x: 0.4, y: 0.18, w: 10.0, h: 0.45,
    fontSize: 15, fontFace: "Arial Black", color: "00D285"
  });

  // Bullets lists for recommendations
  const recBullets = state.recommendations.map(rec => {
    return {
      text: `${rec.title} (${rec.category}) - Est. Rp ${rec.cost.toLocaleString()} Jt: ${rec.description}`,
      options: { bullet: true, fontSize: 11.5, color: "1E293B", bold: false }
    };
  });
  
  slide3.addText(recBullets, {
    x: 0.6, y: 1.4, w: 12.1, h: 5.1,
    lineSpacing: 25
  });

  // --- SLIDE 4: SWOT Matrix ---
  const slide4 = pptx.addSlide();
  slide4.background = { color: "F8FAFC" };

  slide4.addShape("rect", { x: 0, y: 0, w: 13.33, h: 0.8, fill: { color: "0F172A" } });
  slide4.addText("III. ANALISIS SWOT STRATEGIS", {
    x: 0.4, y: 0.18, w: 8.5, h: 0.45,
    fontSize: 15, fontFace: "Arial Black", color: "00D285"
  });

  // SWOT 4 Quadrant Grid Layout
  // Strengths
  slide4.addShape("rect", { x: 0.6, y: 1.3, w: 5.8, h: 2.4, fill: { color: "F0FDF4" }, line: { color: "CBD5E1" } });
  slide4.addText("STRENGTHS (KEKUATAN)", { x: 0.8, y: 1.4, w: 5.4, h: 0.3, fontSize: 11, fontFace: "Arial Black", color: "166534" });
  slide4.addText("• " + state.swot.strengths.slice(0, 3).join("\n• "), { x: 0.8, y: 1.8, w: 5.4, h: 1.7, fontSize: 10, color: "1E293B" });

  // Weaknesses
  slide4.addShape("rect", { x: 6.9, y: 1.3, w: 5.8, h: 2.4, fill: { color: "FEF2F2" }, line: { color: "CBD5E1" } });
  slide4.addText("WEAKNESSES (KELEMAHAN)", { x: 7.1, y: 1.4, w: 5.4, h: 0.3, fontSize: 11, fontFace: "Arial Black", color: "991B1B" });
  slide4.addText("• " + state.swot.weaknesses.slice(0, 3).join("\n• "), { x: 7.1, y: 1.8, w: 5.4, h: 1.7, fontSize: 10, color: "1E293B" });

  // Opportunities
  slide4.addShape("rect", { x: 0.6, y: 4.1, w: 5.8, h: 2.4, fill: { color: "EFF6FF" }, line: { color: "CBD5E1" } });
  slide4.addText("OPPORTUNITIES (PELUANG)", { x: 0.8, y: 4.2, w: 5.4, h: 0.3, fontSize: 11, fontFace: "Arial Black", color: "1E40AF" });
  slide4.addText("• " + state.swot.opportunities.slice(0, 3).join("\n• "), { x: 0.8, y: 4.6, w: 5.4, h: 1.7, fontSize: 10, color: "1E293B" });

  // Threats
  slide4.addShape("rect", { x: 6.9, y: 4.1, w: 5.8, h: 2.4, fill: { color: "FFFBEB" }, line: { color: "CBD5E1" } });
  slide4.addText("THREATS (ANCAMAN)", { x: 7.1, y: 4.2, w: 5.4, h: 0.3, fontSize: 11, fontFace: "Arial Black", color: "854D0E" });
  slide4.addText("• " + state.swot.threats.slice(0, 3).join("\n• "), { x: 7.1, y: 4.6, w: 5.4, h: 1.7, fontSize: 10, color: "1E293B" });

  // --- SLIDE 5: Roadmap Timeline ---
  const slide5 = pptx.addSlide();
  slide5.background = { color: "F8FAFC" };

  slide5.addShape("rect", { x: 0, y: 0, w: 13.33, h: 0.8, fill: { color: "0F172A" } });
  slide5.addText("IV. ROADMAP STRATEGIS & MILESTONE IMPLEMENTASI", {
    x: 0.4, y: 0.18, w: 10.0, h: 0.45,
    fontSize: 15, fontFace: "Arial Black", color: "00D285"
  });

  // Display phases in bento horizontal block cascade
  const cardW = 2.8;
  const cardH = 4.4;
  const cardGap = 0.3;

  state.timeline.forEach((step, i) => {
    const xPos = 0.6 + i * (cardW + cardGap);
    slide5.addShape("rect", { x: xPos, y: 1.5, w: cardW, h: cardH, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1.5 } });
    slide5.addShape("rect", { x: xPos, y: 1.5, w: cardW, h: 0.5, fill: { color: i === 3 ? "00D285" : "0F172A" } });
    
    slide5.addText(`Langkah ${i + 1}`, { x: xPos + 0.15, y: 1.6, w: cardW - 0.3, h: 0.3, fontSize: 11, fontFace: "Arial Black", color: i === 3 ? "0F172A" : "FFFFFF" });
    
    slide5.addText(step.phase, { x: xPos + 0.15, y: 2.2, w: cardW - 0.3, h: 0.4, fontSize: 11, fontFace: "Arial", color: "0F172A", bold: true });
    slide5.addText(`Durasi: ${step.duration}`, { x: xPos + 0.15, y: 2.6, w: cardW - 0.3, h: 0.3, fontSize: 9, fontFace: "Courier New", color: "2563EB", bold: true });
    
    slide5.addText(`Tugas: ${step.task}`, { x: xPos + 0.15, y: 3.1, w: cardW - 0.3, h: 1.4, fontSize: 9.5, fontFace: "Calibri", color: "475569" });
    
    slide5.addShape("rect", { x: xPos + 0.1, y: 4.6, w: cardW - 0.2, h: 0.05, fill: { color: "E2E8F0" } });
    slide5.addText(`Luaran:`, { x: xPos + 0.15, y: 4.7, w: cardW - 0.3, h: 0.2, fontSize: 8, fontFace: "Calibri", color: "94A3B8", bold: true });
    slide5.addText(step.deliverable, { x: xPos + 0.15, y: 4.9, w: cardW - 0.3, h: 0.9, fontSize: 9, fontFace: "Calibri", color: "00875a", bold: true });
  });

  // Saving PPTX Document with dynamic file trigger
  const sanitizedFilename = `BI_Dashboard_Slides_Hasil_Chat_${state.projectTitle.trim().replace(/\s+/g, "_")}.pptx`;
  await pptx.writeFile({ fileName: sanitizedFilename });
}
