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
    defaultContent: "### 1. Global/NAT Overview\n\n"
  },
  {
    number: 2,
    title: "Market Opportunity",
    shortDesc: "Potensi pasar, kesenjangan layanan logistik limbah, dan ceruk pasar.",
    defaultContent: "### 2. Market Opportunity\n\n"
  },
  {
    number: 3,
    title: "Financial (Capex, Opex, P&L, Cash Flow, ROI)",
    shortDesc: "Estimasi kelayakan finansial, alokasi biaya, dan pengembalian modal.",
    defaultContent: "### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)\n\n"
  },
  {
    number: 4,
    title: "Supply & Demand",
    shortDesc: "Analisis kapasitas armada pengangkutan limbah versus pertumbuhan industri.",
    defaultContent: "### 4. Supply & Demand\n\n"
  },
  {
    number: 5,
    title: "Structure",
    shortDesc: "Struktur alur kerja layanan, operasional pengangkutan, dan rantai nilai.",
    defaultContent: "### 5. Structure\n\n"
  },
  {
    number: 6,
    title: "Organization (Qualification, Skill, Output/KPI, SOP)",
    shortDesc: "Persyaratan keahlian staf, target performa kerja kunci, dan kepatuhan.",
    defaultContent: "### 6. Organization (Qualification, Skill, Output/KPI, SOP)\n\n"
  },
  {
    number: 7,
    title: "Transition Model (Pre-On-Post)",
    shortDesc: "Tahapan implementasi transisi proses onboard rute proyek baru.",
    defaultContent: "### 7. Transition Model (Pre-On-Post)\n\n"
  },
  {
    number: 8,
    title: "Go To Market Strategy",
    shortDesc: "Cara menjangkau prospek klien korporasi besar dan penetrasi pasar logistik.",
    defaultContent: "### 8. Go To Market Strategy\n\n"
  },
  {
    number: 9,
    title: "Ops Model (Flow Process, Workflow Diagram, SLA)",
    shortDesc: "Skema alur kontrol dispatch armada pencari, pelacakan GPS, dan SLA.",
    defaultContent: "### 9. Ops Model (Flow Process, Workflow Diagram, SLA)\n\n"
  },
  {
    number: 10,
    title: "Risk Management",
    shortDesc: "Sistem mitigasi kecelakaan, kebocoran lingkungan, dan risiko regulasi.",
    defaultContent: "### 10. Risk Management\n\n"
  },
  {
    number: 11,
    title: "Digital Coverage (Tools, Method, Impact, Automation)",
    shortDesc: "Penerapan solusi ERP logistik, sensor IoT, dan FESTRONIK digital.",
    defaultContent: "### 11. Digital Coverage (Tools, Method, Impact, Automation)\n\n"
  },
  {
    number: 12,
    title: "Competitor",
    shortDesc: "Komparasi posisi nilai pasar dengan pemain logistik limbah serupa.",
    defaultContent: "### 12. Competitor\n\n"
  },
  {
    number: 13,
    title: "TAM, SAM, SOM",
    shortDesc: "Total estimasi potensi serapan pasar logistik limbah B3 di Indonesia.",
    defaultContent: "### 13. TAM, SAM, SOM\n\n"
  },
  {
    number: 14,
    title: "CAC, LTV",
    shortDesc: "Analisis Customer Acquisition Cost versus Lifetime Value nilai pelanggan.",
    defaultContent: "### 14. CAC, LTV\n\n"
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

  let extractedConclusions: string[] = [];

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
      fontSize: 16, fontFace: "Arial Black", color: "FFFFFF"
    });
    slide.addText(`Proyek: ${displayTitle}`, {
      x: 9.0, y: 0.22, w: 3.9, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "right"
    });

    const rawContent = sectionsMap[sec.number] || sec.defaultContent;
    
    // Extract conclusion if present
    let mainContent = rawContent;
    let conclusionText: string | null = null;
    
    const conclusionMarkers = [
      /###\s*kesimpulan/i,
      /##\s*kesimpulan/i,
      /#\s*kesimpulan/i,
      /\*\*\s*kesimpulan\s*\*\*/i,
      /\bkesimpulan\s*:/i,
      /^\s*kesimpulan\s*$/im
    ];

    let foundIndex = -1;
    let matchedMarkerLength = 0;

    for (const marker of conclusionMarkers) {
      const match = rawContent.match(marker);
      if (match && match.index !== undefined) {
        if (foundIndex === -1 || match.index < foundIndex) {
          foundIndex = match.index;
          matchedMarkerLength = match[0].length;
        }
      }
    }

    if (foundIndex !== -1) {
      mainContent = rawContent.substring(0, foundIndex).trim();
      conclusionText = rawContent.substring(foundIndex + matchedMarkerLength).trim();
    }

    // Clean up [UPDATE_PILAR] and [/UPDATE_PILAR] tags
    mainContent = mainContent.replace(/\[\/?UPDATE_PILAR\]/gi, "").trim();

    if (conclusionText) {
      const cleanedConclusion = conclusionText.replace(/\[\/?UPDATE_PILAR\]/gi, "").trim();
      if (cleanedConclusion) {
        extractedConclusions.push(cleanedConclusion);
      }
    }

    // Extract bullets from text
    const lines = mainContent.split("\n")
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
      slide.addText(mainContent.replace(/###/g, "").replace(/\*\*/g, ""), {
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
      fill: { color: "334155" }
    });
    slide.addText("INFORMASI EKSEKUTIF", {
      x: 8.5, y: 1.45, w: 4.0, h: 0.4,
      fontSize: 11, fontFace: "Arial Black", color: "FFFFFF"
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
    slide.addText(`Halaman ${sec.number + 1} dari 17`, {
      x: 8.3, y: 6.9, w: 4.4, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
    });
  });

  // --- SLIDE 16: Dedicated Conclusion Slide ---
  const conclusionSlide = pptx.addSlide();
  conclusionSlide.background = { color: "F8FAFC" };

  // Brand header banner
  conclusionSlide.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 0.8,
    fill: { color: "0F172A" }
  });
  // Header title
  conclusionSlide.addText("KESIMPULAN STRATEGIS (CONCLUSION)", {
    x: 0.4, y: 0.18, w: 8.5, h: 0.45,
    fontSize: 16, fontFace: "Arial Black", color: "FFFFFF"
  });
  conclusionSlide.addText(`Proyek: ${displayTitle}`, {
    x: 9.0, y: 0.22, w: 3.9, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "right"
  });

  let conclusionBullets: string[] = [];
  if (extractedConclusions.length > 0) {
    conclusionBullets = extractedConclusions.join("\n")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith("###") && !l.startsWith("!"))
      .map(l => l.replace(/\*\*/g, "").replace(/^\*\s*/, "").replace(/^-\s*/, ""));
  }

  // Use defaults if empty
  if (conclusionBullets.length === 0) {
    conclusionBullets = [
      `Kelayakan Investasi: Proyek ekspedisi "${displayTitle}" dinilai sangat layak secara komersial dan operasional.`,
      "Sinergi Teknologi & Armada: Penggabungan ketangguhan sasis armada Pancaran dengan sistem telemetri pintar PRAMA meminimalkan risiko operasional.",
      "Rekomendasi Onboarding: Segera lakukan verifikasi rute (trial run), finalisasi SLA operasional, dan integrasi penuh aplikasi Driver e-POD.",
      "Kepatuhan Hukum: Menjamin 100% kepatuhan regulasi ODOL (Over Dimension Over Load) dan standar keselamatan K3 nasional."
    ];
  }

  const finalConclusionBullets = conclusionBullets.slice(0, 5).map(textLine => {
    return { text: textLine, options: { bullet: true, fontSize: 13, color: "334155", fontFace: "Calibri" } };
  });

  conclusionSlide.addText(finalConclusionBullets, {
    x: 0.6, y: 1.4, w: 7.2, h: 5.2,
    lineSpacing: 26
  });

  // Right Column: Executive box
  conclusionSlide.addShape("rect", {
    x: 8.3, y: 1.4, w: 4.4, h: 5.1,
    fill: { color: "FFFFFF" },
    line: { color: "CBD5E1", width: 1.5 }
  });
  conclusionSlide.addShape("rect", {
    x: 8.3, y: 1.4, w: 4.4, h: 0.5,
    fill: { color: "334155" }
  });
  conclusionSlide.addText("REKOMENDASI DIREKSI", {
    x: 8.5, y: 1.45, w: 4.0, h: 0.4,
    fontSize: 11, fontFace: "Arial Black", color: "FFFFFF"
  });

  const execBoxText = `STATUS EVALUASI KAJIAN\n\n• Rekomendasi: GO (SETUJU)\n• Prioritas Kerja: SANGAT TINGGI\n• Tahap Evaluasi: Selesai diulas\n• Tanggung Jawab: Jajaran Direksi & PM\n• Target Operasional: Onboarding Segera\n• Skema Sertifikasi: K3 & ESG Terpenuhi`;
  conclusionSlide.addText(execBoxText, {
    x: 8.6, y: 2.1, w: 3.8, h: 4.1,
    fontSize: 12, fontFace: "Calibri", color: "1E293B", lineSpacing: 22
  });

  // Footer signature
  conclusionSlide.addText("INTEGRATED DESIGNED BY PRAMA COGNITIVE PORTAL", {
    x: 0.6, y: 6.9, w: 7.2, h: 0.3,
    fontSize: 8.5, fontFace: "Courier New", color: "94A3B8", bold: true
  });
  conclusionSlide.addText("Halaman 16 dari 17", {
    x: 8.3, y: 6.9, w: 4.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
  });

  // --- SLIDE 17: Closing Thank You Slide ---
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
    fill: { color: "334155" }
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
    fontSize: 16, fontFace: "Calibri", color: "CBD5E1", align: "center"
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
  } else if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("wood") || lower.includes("logging")) {
    industry = "logistik & transportasi kehutanan (Forestry & Logging Transportation)";
    regulations = "**UU No. 18 Tahun 2013** tentang Pencegahan dan Pemberantasan Perusakan Hutan, serta regulasi SVLK (Sistem Verifikasi Legalitas Kelestarian)";
    materialName = "kayu bulat (logs) & pulpwood";
    extraDetail1 = "Rute hauling logs dari log yard/tempat penimbunan sementara di dalam konsesi hutan tanaman industri menuju pabrik bubur kertas (pulp mill).";
    extraDetail2 = "Fasilitas K3 kehutanan tinggi, sistem penakar muatan timbangan portable, dan ban logging tapak kasar anti-slip.";
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
    1: `### 1. Global / National (NAT) Overview

**A. TINJAUAN REGULASI & KEPATUHAN NASIONAL (REGULATORY COMPLIANCE)**
* **Kesesuaian Hukum Utama:** Kajian dirancang khusus untuk proyek **"${pName}"** dalam naungan ${industry}. Kepatuhan hukum dijamin melalui penyelarasan penuh dengan regulasi nasional, khususnya ${regulations}.
* **Sertifikasi & Lisensi Jalan:** Memenuhi seluruh persyaratan uji kelayakan berkala (KIR), izin trayek angkutan barang khusus, dan standar keselamatan logistik nasional.

**B. ANALISIS ESG & REDUKSI EMISI GRK (ESG & DECARBONIZATION ALIGNMENT)**
* **Dekarbonisasi Rantai Pasok:** Mengintegrasikan indikator keberlanjutan dekarbonisasi untuk meningkatkan daya tawar di mata klien korporasi besar yang memiliki komitment ESG tinggi.
* **Standardisasi Industri:** Menjadi penyedia transportasi logistik berlisensi resmi yang handal di tengah regulasi pengawasan angkutan jalan raya yang kian diperketat oleh pemerintah pusat.

**C. PELUANG EKONOMI HIJAU & TRANSISI ENERGI (GREEN TRANSITION VALUE)**
* **Diferensiasi Layanan:** Mengadopsi armada truk modern dekarbonisasi guna membantu korporasi mitra memenuhi target net-zero audit rantai pasok mereka.
* **Keberlanjutan Jangka Panjang:** Menyelaraskan sirkulasi logistik dengan peta jalan sirkular ekonomi Indonesia guna meminimalisir risiko operasional di masa depan.

**D. JENIS-JENIS STANDAR REGULASI & LISENSI LOGISTIK (TYPES OF REGULATORY STANDARDS)**
* **Sertifikasi KIR Elektronik (e-KIR):** Uji kelayakan teknis sasis secara digital berkala untuk menggaransi keamanan fungsi rem, emisi gas buang, dan kekuatan sasis gandar.
* **Izin Usaha Angkutan Khusus (B3 / Tambang):** Lisensi wajib dari Kementerian Perhubungan RI untuk kategori angkutan barang dengan klasifikasi khusus atau muatan strategis sensitif.
* **Sertifikasi Sistem Manajemen Keselamatan (SMK):** Akreditasi standar K3 logistik nasional untuk meminimalisir risiko insiden kecelakaan armada di jalan raya.`,

    2: `### 2. Market Opportunity

**Analisis Potensi Pasar & Gap Analisis (Market Landscape):**
Proyek **"${pName}"** menyasar sektor ${industry} premium di mana terdapat gap atau kesenjangan besar antara transporter berlisensi standar dengan standar kepatuhan tinggi yang dituntut oleh korporat modern. Dengan memanfaatkan armada khusus berlisensi untuk mengangkut ${materialName}, Pancaran Group berada di posisi paling strategis untuk merebut pangsa pasar dari kompetitor konvensional.

---

### **A. CAKUPAN STRATEGIS PELUANG PASAR (MARKET OPPORTUNITY SCOPES)**

Untuk mempermudah pemetaan, peluang pasar proyek **"${pName}"** dibagi ke dalam **3 Cakupan Utama**:

#### **1. Cakupan Kepatuhan Regulasi & Standar HSE (Regulatory & safety-first Compliance)**
* **Kesenjangan Pasar:** Kebutuhan sertifikasi kepatuhan hukum 100% terkait ${regulations} sangat membatasi pilihan vendor bagi korporat besar. Transporter konvensional seringkali gagal dalam audit HSE/K3.
* **Solusi Pancaran:** Memosisikan unit logistik Pancaran Group dengan kesiapan dokumen legalitas lengkap dan sertifikasi awak untuk menjamin kepatuhan total di jalan raya.

#### **2. Cakupan Integrasi Teknologi Smart Logistics (Digitalization & IoT Advantage)**
* **Kesenjangan Pasar:** Pengiriman kargo tipe ${materialName} membutuhkan pemantauan ketat dari segi keamanan, berat (anti-ODOL), dan transparansi rute, yang mana fitur ini jarang disediakan oleh operator logistik lokal.
* **Solusi Pancaran:** Mengintegrasikan sistem pelacakan PRAMA Smart Telematics, sensor beban berat otomatis, dan manifes digital real-time demi menjamin kepatuhan SLA yang transparan bagi klien.

#### **3. Cakupan Konsolidasi Rute & Efisiensi Operasional (Turnaround Time Optimization)**
* **Kesenjangan Pasar:** Tingginya inefisiensi rute dan waktu bongkar muat kargo yang lama di pelabuhan/depo menurunkan utilisasi armada dan melambungkan Opex bahan bakar.
* **Solusi Pancaran:** Menggunakan PRAMA Intelligent Routing untuk merumuskan jalur perjalanan tercepat, mengkonsolidasikan kargo balik, serta mengoptimalkan waktu turnaround armada secara presisi.

---

### **B. PANDUAN LANGKAH-DEMI-LANGKAH MENGEKSPLOITASI PELUANG (STEP-BY-STEP STRATEGIC PLAN)**

Untuk memastikan penetrasi pasar berjalan secara terstruktur dan terarah pada proyek **"${pName}"** ini, ikuti langkah taktis berikut:

#### **Langkah 1: Identifikasi Titik Kritis & Audit Kebutuhan Klien (Needs Assessment)**
* **Aktivitas:** Memetakan calon klien target pengirim ${materialName} di wilayah koridor operasional proyek. Identifikasi persyaratan HSE (K3), rute reguler, dan syarat tender khusus mereka.
* **Tujuan:** Mengetahui celah spesifik pelayanan kompetitor petahana yang bisa kita disrupsi.

#### **Langkah 2: Pemenuhan Legalitas & Lisensi Komoditas Khusus (Licensing & Setup)**
* **Aktivitas:** Mengurus dokumen izin rute angkutan, perizinan KLHK/Kemenhub yang relevan dengan ${regulations}, serta membekali pengemudi dengan sertifikasi keahlian khusus yang dibutuhkan.
* **Tujuan:** Menjamin kelancaran operasi di jalan tanpa hambatan hukum serta meloloskan kualifikasi administratif tender klien B2B.

#### **Langkah 3: Pemetaan Rute & Simulasi Efisiensi Opex (Route Optimization & Trial Run)**
* **Aktivitas:** Melakukan uji coba rute perdana (*pilot run*) menggunakan unit kosong berteknologi GPS untuk mengukur konsumsi BBM riil, pemetaan titik bahaya, dan efisiensi waktu tempuh.
* **Tujuan:** Menentukan baseline biaya operasional (Opex) terbaik dan menggaransi ketepatan waktu pengiriman (*On-Time Delivery*).

#### **Langkah 4: Onboarding Armada & Pemasangan Sensor IoT (Smart Fleet Deployment)**
* **Aktivitas:** Memobilisasi armada khusus untuk pengangkutan ${materialName}, dilanjutkan dengan pemasangan sensor telemetri digital dan sasis terintegrasi platform control tower PRAMA.
* **Tujuan:** Memberikan transparansi visibilitas penuh secara real-time kepada pihak pengirim dan penerima kargo untuk kepatuhan SLA yang kokoh.

#### **Langkah 5: Komersialisasi & Kontrak Multitahun (Long-Term Value Capture)**
* **Aktivitas:** Menandatangani kontrak jangka panjang (*Long-Term Service Agreement* / LTSA) berskala multitahun. Berikan nilai tambah berupa laporan histori dekarbonisasi / emisi armada guna mendukung pencapaian rating ESG korporat klien.
* **Tujuan:** Mengamankan aliran pendapatan jangka panjang (*recurring revenue*) dan memaksimalkan LTV (*Lifetime Value*) pelanggan.

---

### **C. JENIS-JENIS SEGMEN PELUANG DAN ANALISIS KESENJANGAN (TYPES OF OPPORTUNITY SEGMENTS)**
* **Segmen Korporat Multinasional (B2B Premium):** Perusahaan skala global yang wajib mematuhi standar audit logistik tanpa kompromi serta memiliki target dekarbonisasi nol emisi (*Net-Zero Emission*).
* **Segmen Industri Strategis Nasional (Sovereign-backed):** Emiten besar atau proyek vital strategis nasional yang membutuhkan suplai pengangkutan bahan baku ${materialName} secara stabil dengan jaminan kelancaran kapasitas harian.
* **Segmen Rantai Pasok Berkelanjutan (Circular Economy):** Mitra strategis yang mengedepankan efisiensi ritase sirkular bolak-balik tanpa membiarkan armada berjalan kosong (*empty miles*) pasca bongkar muat.`,

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
* Mengingat standar pembayaran (*Term of Payment*) korporasi besar (B2B) di Indonesia biasanya berkisar antara **60 s.d. 90 hari**, unit bisnis wajib menyiapkan dana cadangan modal kerja (*Working Capital Buffer*) minimal sebesar 3 bulan Opex (**Rp ${Math.round((numericOpex + 60000000) * 3).toLocaleString("id-ID")}**) guna menjaga kelancaran operasional (pembelian solar harian & gaji supir) sebelum termin pembayaran tagihan dari klien cair.

**E. MACAM-MACAM KATEGORI FINANSIAL & STRATEGI ALOKASI (FINANCIAL BREAKDOWN)**
* **Biaya Langsung (Direct Costs):** Komponen pengeluaran variabel seperti bahan bakar solar industri non-subsidi, ban radial, sasis, dan insentif pengemudi per ritase.
* **Biaya Tidak Langsung (Indirect Costs):** Komponen tetap seperti administrasi kantor regional, biaya pemantauan Live Control Tower PRAMA, asuransi, serta sertifikasi keselamatan tahunan.
* **Pendapatan Tambahan (Auxiliary Revenue):** Potensi pendapatan sela dari iklan branding bodi sasis dan penyediaan pergudangan intermodal terintegrasi.`;
    })(),

    4: `### 4. Supply & Demand

**A. ANALISIS PERMINTAAN PASAR (DEMAND SIDE ANALYSIS)**
* **Volume Kargo Potensial:** Kebutuhan pengangkutan untuk kargo ${materialName} mengalami lonjakan tinggi karena bertumbuhnya aktivitas produksi B2B di koridor proyek **"${pName}"**.
* **Kebutuhan Jaminan Kapasitas harian:** Klien korporasi multinasional membutuhkan kepastian armada yang stand-by setiap hari guna mengantisipasi kemacetan suplai.

**B. ANALISIS PENAWARAN PEMAIN LOKAL (SUPPLY SIDE ANALYSIS)**
* **Keterbatasan Armada Spesifikasi Tinggi:** Sangat sedikit operator angkutan logistik lokal yang memiliki sasis truk modern berstandar dekarbonisasi global.
* **Kelangkaan Sertifikasi Kepatuhan (HSE):** Mayoritas transporter konvensional di Indonesia tidak lolos kualifikasi audit keselamatan (HSE) yang ketat untuk mengangkut komoditas industri strategis.

**C. KEKUATAN HARGA & INTEGRASI PASAR (PRICING POWER & SEGMENTATION)**
* **Pricing Power Premium:** Adanya defisit kapasitas transporter berkualitas memberikan Pancaran Group kekuatan tawar untuk mempertahankan harga premium yang berfokus pada keandalan operasional.
* **Utilisasi Armada Maksimal:** Memaksimalkan utilitas ritase armada sasis guna mempercepat tingkat pengembalian investasi modal awal.

**D. JENIS-JENIS FLUKTUASI SUPPLY & DEMAND (TYPES OF MARKET DYNAMICS)**
* **Permintaan Musiman (Seasonal Peak Demand):** Lonjakan volume menjelang akhir kuartal atau puncak siklus produksi pabrik klien yang menuntut pengerahan unit ekstra.
* **Keterbatasan Armada Pengganti (Buffer Fleet Constraint):** Kondisi keterbatasan sasis pengganti cadangan di saat salah satu unit wajib menjalani servis rutin terjadwal atau perbaikan darurat.
* **Keseimbangan Tarif Logistik Regional (Regional Tariff Balance):** Dinamika fluktuasi harga sewa angkutan darat regional akibat pergerakan suplai bahan bakar solar industri non-subsidi dan penyesuaian tarif jalan tol.`,

    5: `### 5. Structure

**A. RANTAI NILAI OPERASIONAL UJUNG-KE-UJUNG (OPERATIONAL VALUE CHAIN)**
* **Inbound Logistics (Hulu):** Pemeriksaan kualitas muatan ${materialName} di gudang pengirim menggunakan digital checklist guna menjamin kesesuaian manifest.
* **Midstream Logistics (Transit):** Pengiriman kargo aman melalui rute jalan yang telah dipetakan, diawasi secara langsung oleh PRAMA Live Control Tower.
* **Outbound Logistics (Hilir):** Penyerahan kargo di situs tujuan klien secara presisi disertai konfirmasi digital dan tanda terima instan.

**B. SINKRONISASI JADWAL & GERBANG DEPO (LOGISTICS PIPELINE)**
* **Optimasi Turnaround Time (TAT):** Mengurangi waktu tunggu antrean muat di depo rute angkutan guna meningkatkan utilisasi sasis unit secara optimal.
* **Sinkronisasi Jadwal Sandar:** Menyelaraskan waktu keberangkatan truk logistik dengan jadwal bongkar muat pabrik atau jadwal sandar kapal pelayaran laut (*vessel closing time*).

**C. PENDEKATAN DISTRIBUSI SIRKULAR (CIRCULAR LOGISTICS)**
* **Konsolidasi Kargo Balik:** Mengatur rute pengiriman sirkular agar meminimalkan perjalanan kosong (*empty miles*) pasca bongkar muat guna melipatgandakan margin ritase.
* **Sistem Sirkuit Tertutup:** Prosedur penyegelan sasis tangki/boks yang kokoh untuk mencegah penyusutan atau manipulasi muatan di jalan raya.

**D. MACAM-MACAM STRUKTUR ALUR DISTRIBUSI (TYPES OF LOGISTIC STRUCTURAL FLOWS)**
* **Alur Distribusi Satu Arah (One-Way Trip):** Pengiriman dari titik A ke titik B secara langsung, dioptimalkan untuk muatan khusus berisiko tinggi dengan protokol pengawasan ketat.
* **Alur Distribusi Sirkular (Closed-Loop Trip):** Pengangkutan di mana armada membawa bahan baku pergi dan membawa produk jadi atau wadah kosong kembali ke titik muat asal guna menghemat Opex.
* **Alur Distribusi Terkonsolidasi (Consolidated Hub-and-Spoke):** Menggabungkan kargo muatan sedang di depo antara sebelum didistribusikan ke tujuan akhir untuk memaksimalkan kapasitas angkut chassis.`,

    6: `### 6. Organization (Qualification, Skill, Output/KPI, SOP)

**A. PERSYARATAN KUALIFIKASI TIM DAN KRU (ORGANIZATIONAL CAPABILITIES)**
* **Kompetensi Pengemudi Khusus:** Awak diwajibkan memiliki SIM BII Umum aktif, sertifikat pelatihan berkendara defensif (*Defensive Driving*), serta lisensi penanganan kargo khusus ${materialName}.
* **Pengawas HSE Lapangan:** Pengawas terlatih bersertifikasi K3 Umum / K3 Migas/Tambang yang standby melakukan koordinasi mitigasi bahaya 24/7.

**B. INDIKATOR KINERJA KUNCI TIM (KEY PERFORMANCE INDICATORS)**
* **Ketepatan Waktu Pengiriman (On-Time Delivery):** Target kinerja harian OTD wajib di atas **98.5%** dari total ritase perjalanan rute.
* **Nol Insiden & Kecelakaan (Zero Accident & Damage):** Target keselamatan mutlak **0% tingkat kerusakan kargo** guna meminimalkan kerugian klaim.
* **Kepatuhan Administrasi Digital:** Pengisian logbook perjalanan secara realtime serta kepatuhan dokumen manifest digital mencapai **100% tuntas**.

**C. PROSEDUR OPERASIONAL STANDAR INTI (STANDARD OPERATING PROCEDURES)**
* **SOP Pra-Keberangkatan:** Tes kesehatan pengemudi (tensi & alkohol) dan pemeriksaan fisik kelayakan jalan kendaraan (*pre-trip inspection*).
* **SOP Penanganan Kondisi Darurat (Emergency Response):** Protokol tanggap cepat jika terjadi kerusakan mesin sasis di jalan tol atau kendala kargo selama transit.

**D. JENIS-JENIS POSISI & PERAN ORGANISASI (TYPES OF ORGANIZATIONAL ROLES)**
* **Kru Operasional Utama (Fleet Crew):** Pengemudi (Driver) dan Asisten Pengemudi berlisensi khusus BII Umum dengan spesialisasi sasis truk berat dan material ${materialName}.
* **Kru Pengawas Lapangan (Supervisory Crew):** Dispatcher, HSE Officer, dan Fleet Controller yang memonitor pergerakan unit via sistem telematika secara real-time dari Live Control Tower.
* **Kru Pemeliharaan Pendukung (Technical Support):** Kepala Mekanik dan tim Mekanik Mobile khusus sasis dan sistem rem angin yang bersertifikasi ATPM resmi.`,

    7: `### 7. Transition Model (Pre-On-Post)

**A. TAHAP PRAPELAKSANAAN (PRE-ONBOARDING)**
* **Verifikasi Legalitas & Rute:** Mengamankan dokumen rekomendasi jalan dari Dinas Perhubungan setempat serta kesesuaian izin rute angkutan dengan regulasi ${regulations}.
* **Uji Coba Lapangan (Pilot Run):** Melakukan simulasi perjalanan rute menggunakan unit kosong berteknologi telematika guna memetakan jalur kritis dan mengukur konsumsi solar riil.

**B. TAHAP IMPLEMENTASI AKTIF (ONBOARDING)**
* **Mobilisasi Unit Bertahap:** Deployment perdana unit armada khusus (misalnya 5 unit pertama) dengan pendampingan teknis intensif dari tim mekanik lapangan.
* **Integrasi Portal Klien:** Menyelaraskan akun sistem monitoring rute logistik dengan tim penanggung jawab logistik dari pihak klien B2B.

**C. TAHAP EVALUASI & STABILISASI (POST-ONBOARDING)**
* **Serah Terima Operasional Penuh:** Peralihan komando operasional dari tim persiapan proyek ke tim manajemen regional reguler.
* **Audit Performa Berkala:** Menyelenggarakan evaluasi performa mingguan untuk mengukur efisiensi rute, konsumsi bahan bakar, dan kepuasan layanan klien.

**D. MACAM-MACAM MODEL TRANSISI OPERASIONAL (TYPES OF TRANSITION MODELS)**
* **Model Transisi Bertahap (Phased Transition):** Onboarding unit secara berkala (misal 5 unit per minggu) guna memastikan kesiapan supir dan kelancaran rute tanpa mengganggu operasi klien.
* **Model Transisi Paralel (Parallel Transition):** Menjalankan armada Pancaran Group berdampingan dengan transporter lama untuk menguji konsistensi SLA sebelum serah terima penuh.
* **Model Transisi Kilat (Direct Switchover):** Penggantian transporter 100% pada hari yang ditentukan, hanya digunakan jika seluruh persiapan uji coba rute telah lolos 100%.`,

    8: `### 8. Go To Market Strategy

**A. STRATEGI PENETRASI & AKUISISI KORPORAT (B2B CLIENT ACQUISITION)**
* **Kemitraan Kontrak Jangka Panjang (LTSA):** Membidik kesepakatan kontrak multitahun berdurasi 3 hingga 5 tahun bersama produsen skala besar ${materialName} guna menjamin arus pendapatan berulang (*recurring revenue*).
* **Diferensiasi Solusi Hijau (ESG Value):** Menyediakan laporan audit emisi karbon gratis per pengiriman sebagai daya tawar dekarbonisasi bagi emiten besar yang wajib memenuhi target ESG.

**B. PROMOSI VALUE FRONTIER PANCARAN GROUP (VALUE PROPOSITION)**
* **Paket Integrasi Jasa Bundling:** Menawarkan solusi satu pintu mencakup penyediaan armada sasis modern, kru pengemudi terlatih, perizinan, dan asuransi kargo penuh.
* **Pemasaran Berbasis Kinerja:** Memberikan jaminan tertulis atas pencapaian KPI ketepatan waktu di atas 98% sebagai komitmen keandalan operasional.

**C. METODE PENGEMBANGAN AKUN (ACCOUNT DEVELOPMENT & RETENTION)**
* **Quarterly Business Review (QBR):** Peninjauan kinerja operasional rutin bersama klien untuk mendiskusikan peluang efisiensi biaya logistik lebih lanjut.
* **Diskon Berbasis Skala Volume:** Memberikan skema tarif berjenjang yang lebih kompetitif bagi klien yang menambahkan volume komitmen kargo harian.

**D. JENIS-JENIS SALURAN PENETRASI PASAR (TYPES OF GO-TO-MARKET CHANNELS)**
* **Direct Sales & Tender Participation:** Penetrasi melalui keikutsertaan resmi dalam tender korporasi besar yang diumumkan di portal e-procurement resmi.
* **Joint Logistics Alliance:** Membangun kemitraan strategis dengan penyedia jasa kepabeanan, pergudangan kontainer, atau pelayaran laut untuk menawarkan layanan end-to-end terintegrasi.
* **Strategic Key Account Extension:** Menawarkan ekspansi unit khusus pada klien B2B aktif yang sudah bermitra dengan unit bisnis Pancaran Group lainnya.`,

    9: `### 9. Ops Model (Flow Process, Workflow Diagram, SLA)

**A. ALUR PROSES OPERASIONAL UTAMA (WORKFLOW FLOW CHART)**
* **Alur Sirkuit Operasional:**
\`\`\`
[Checklist Kelayakan] ➔ [Pemuatan Aman] ➔ [Dispatch Armada] ➔ [Pantau Sensor IoT & GPS] ➔ [Bongkar Muat] ➔ [SLA Selesai]
\`\`\`
* **Detail Operasi:** Pengawasan ketat dimulai sejak pemeriksaan kesehatan sopir di depo, pelacakan pergerakan unit via GPS secara real-time di rute pengiriman, hingga pembongkaran aman di lokasi tujuan klien.

**B. JAMINAN KOMITMEN TINGKAT LAYANAN (SERVICE LEVEL AGREEMENT - SLA)**
* **Waktu Tanggap Darurat Rute:** Tim tanggap darurat HSE dan armada derek bantuan siap meluncur di jalur kritis dalam waktu maksimal **45 Menit**.
* **Batasan Waktu Tunggu Muat (TAT):** Waktu antrean tunggu muat/bongkar armada di lokasi situs klien dibatasi maksimal **60 menit** per armada.

**C. MANAJEMEN PENANGANAN GANGGUAN (EXCEPTION MANAGEMENT)**
* **Notifikasi Deviasi Rute Otomatis:** Sistem mengirimkan peringatan instan ke PRAMA Live Control Tower jika armada keluar rute sasis atau melebihi batas kecepatan aman.
* **Eskalasi Penanganan Kerusakan:** Mobilisasi cepat unit mekanik mobile terdekat jika sensor telemetri mendeteksi adanya malfungsi mesin sasis.

**D. MACAM-MACAM PROTOKOL OPERASIONAL & METRIK SLA (TYPES OF SLA & CRITICAL PROTOCOLS)**
* **SLA Keandalan Armada (Uptime SLA):** Menjamin ketersediaan unit siap beroperasi minimum **98%** setiap harinya dari total armada yang dialokasikan.
* **SLA Pengiriman Tepat Waktu (On-Time Delivery SLA):** Menjamin ketepatan waktu bongkar muat sesuai rentang waktu (*loading window*) yang disepakati dengan toleransi deviasi maksimal 15 menit.
* **SLA Penanganan Insiden Keamanan (Incident Response SLA):** Prosedur eskalasi penarikan unit cadangan dalam waktu di bawah 2 jam jika terjadi insiden kerusakan berat di jalan.`,

    10: (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("wood") || lower.includes("logging")) ? 
`### 10. Risk Management

Untuk memastikan proyek berjalan lancar dan menguntungkan, berikut adalah breakdown **Risk Management (Manajemen Risiko)** utama yang wajib Anda antisipasi, dikelompokkan berdasarkan kategorinya.

---

## 1. Risiko Operasional & Medan (Operational & Terrain Risks)

Ini adalah area dengan risiko harian paling tinggi karena logistik kehutanan bekerja di lingkungan yang tidak dapat diprediksi.

* **Kondisi Cuaca Ekstrem:** Hujan deras dapat mengubah jalur tanah menjadi lumpur dalam sekejap (*mudslide*), menghentikan mobilitas truk pengangkut kayu (logging trucks), dan merusak struktur jalan angkutan.
* **Kerusakan Armada & Alat Berat:** Truk loging bekerja di medan berat, memicu keausan cepat pada ban, suspensi, dan mesin. Jika tidak ada manajemen pemeliharaan pencegahan (*preventive maintenance*), *downtime* operasional akan membengkak.
* **Aksesibilitas Geografis:** Area yang terpencil menyulitkan pengiriman suku cadang, bahan bakar, atau bantuan medis jika terjadi keadaan darurat.

> **Strategi Mitigasi:**
> * Buat kalender operasional ketat yang menyesuaikan dengan musim (kurangi volume saat puncak musim hujan).
> * Sediakan *buffer stock* suku cadang kritis dan bahan bakar langsung di *basecamp* lapangan.
> * Terapkan sistem pemantauan armada berbasis GPS yang tangguh di area *low-signal*.

## 2. Risiko Regulasi & Kepatuhan (Regulatory & Compliance Risks)

Industri kehutanan diawasi sangat ketat oleh pemerintah dan lembaga lingkungan. Pelanggaran hukum bisa berakibat pembatalan kontrak atau denda besar.

* **Sertifikasi & Legalitas Kayu:** Risiko mengangkut hasil hutan tanpa dokumen legalitas yang sah (seperti SKSHAK atau sertifikasi kelestarian lingkungan).
* **Batasan Beban Kendaraan (Overloading):** Truk kayu rawan melanggar aturan muatan sumbu terberat (MST) di jalan umum, yang bisa memicu penilangan atau penyitaan.
* **Zona Konservasi:** Risiko masuk atau merusak area lindung yang dilarang untuk kegiatan transportasi/ekstraksi.

> **Strategi Mitigasi:**
> * Lakukan audit dokumen digital sebelum truk meninggalkan *loading point*.
> * Pasang jembatan timbang (*weighbridge*) portabel di area hutan untuk memastikan muatan sesuai regulasi sebelum masuk jalan umum.

## 3. Risiko Finansial (Financial Risks)

Proyek ini padat modal (*capital intensive*) dan sensitif terhadap fluktuasi biaya makro.

* **Volatilitas Biaya Bahan Bakar (BBM):** Karena konsumsi BBM alat berat dan truk sangat besar, kenaikan harga solar industri sedikit saja bisa menggerus profit margin secara drastis.
* **Ketidakpastian Volume Angkut:** Jika kuota tebang dari manajemen kehutanan turun atau terhambat, pendapatan Anda yang dihitung per ritase atau per kubik ($m^3$) akan ikut anjlok, sementara biaya tetap (gaji driver, sewa alat) berjalan terus.

> **Strategi Mitigasi:**
> * Masukkan klausul *Fuel Escalation Clause* dalam kontrak (penyesuaian tarif angkut otomatis jika harga BBM naik melebihi persentase tertentu).
> * Terapkan skema kontrak dengan jaminan volume minimum (*Take-or-Pay clause*).

## 4. Risiko Keselamatan & Kesehatan Kerja (K3 / HSE Risks)

Logistik kehutanan termasuk salah satu industri dengan tingkat bahaya tertinggi.

* **Kecelakaan Kerja:** Truk terbalik di lereng curam, tertimpa kayu saat proses *loading/unloading*, hingga cedera fatal operator.
* **Konflik Sosial:** Risiko gesekan dengan masyarakat adat atau lokal di sepanjang jalur transportasi hutan.

> **Strategi Mitigasi:**
> * Kewajiban sertifikasi kompetensi untuk semua *driver* truk logging (khusus medan berat).
> * Alokasikan dana khusus untuk CSR (*Corporate Social Responsibility*) dan libatkan tenaga kerja lokal demi menjaga stabilitas hubungan sosial.

---

### Ringkasan Skoring Risiko (Risk Matrix Checklist)

Sebelum menandatangani kontrak, pastikan Anda dan tim menilai matriks risiko berikut:

| Kategori Risiko | Dampak (Impact) | Probabilitas (Probability) | Prioritas Penanganan |
| --- | --- | --- | --- |
| **Cuaca & Medan Lumpur** | Tinggi | Tinggi | **Sangat Tinggi (Kritis)** |
| **Kecelakaan Alat/Truk** | Tinggi | Sedang | **Tinggi** |
| **Kenaikan Harga BBM** | Sedang | Tinggi | **Tinggi** |
| **Izin & Dokumen Legal** | Sangat Tinggi | Rendah | **Sedang (Wajib Patuh)** |` : `### 10. Risk Management

**A. MITIGASI RISIKO KESELAMATAN JALAN RAYA (ROAD SAFETY RISK)**
* **Identifikasi Risiko:** Kecelakaan lalu lintas sasis truk, kelelahan fisik pengemudi, atau keterlambatan rute akibat cuaca ekstrem.
* **Tindakan Mitigasi:** Edukasi berkendara defensif, penegakan SOP wajib istirahat pengemudi minimal 30 menit setiap berkendara 4 jam, serta pemasangan rem ABS pada unit baru.

**B. MITIGASI RISIKO INTEGRITAS KARGO (CARGO INTEGRITY RISK)**
* **Identifikasi Risiko:** Kebocoran tangki, kontaminasi muatan kargo ${materialName}, atau tumpahan muatan yang merusak lingkungan hidup sekitar.
* **Tindakan Mitigasi:** Pemeriksaan berkala katup palka/pneumatik tangki, pemasangan sensor getaran IoT, serta perlindungan asuransi kargo penuh (*Comprehensive Marine Cargo Insurance*).

**C. MITIGASI RISIKO REGULASI & KEPATUHAN HUKUM (COMPLIANCE RISK)**
* **Identifikasi Risiko:** Pelanggaran berat muatan sasis truk (*Over Dimension Over Load* - ODOL) atau penilangan dokumen jalan akibat masa berlaku KIR habis.
* **Tindakan Mitigasi:** Integrasi alat timbang sensor suspensi portable pada sasis unit dan sistem manajemen pengingat otomatis masa berlaku KIR & STNK.

**D. JENIS-JENIS RISIKO & MATRIKS PENILAIAN DAMPAK (TYPES OF RISKS & IMPACT MATRIX)**
* **Risiko Operasional Jalan Raya:** Frekuensi kejadian moderat dengan dampak finansial bervariasi dari sedang hingga tinggi. Dimitigasi dengan pengawasan CCTV kabin berkemampuan AI (*ADAS & DSM*).
* **Risiko Kebocoran/Kerusakan Kargo Sektor ${industry}:** Frekuensi kejadian sangat rendah namun dampak finansial dan reputasi sangat tinggi. Ditangani dengan audit tangki berkala dan asuransi komprehensif.
* **Risiko Kebijakan Pemerintah & Regulasi:** Frekuensi rendah dengan dampak operasional tinggi. Dimitigasi dengan keanggotaan aktif dalam asosiasi pengusaha logistik (ALFI/APTRINDO) guna mengantisipasi perubahan aturan jalan.`,

    11: `### 11. Digital Coverage (Tools, Method, IoT, Tech)

**A. PLATFORM TELEMATIKA PINTAR ARMADA (PRAMA SMART TELEMATICS)**
* **GPS Pelacakan Real-Time:** Monitoring lokasi presisi tinggi, rute rincian, kecepatan armada, dan pola pengereman pengemudi guna menjamin keselamatan.
* **Sensor Diagnostik Sasis CAN Bus:** Sistem pembaca data mesin digital secara kontinu untuk memproyeksikan perawatan preventif sasis truk sebelum terjadi mogok.

**B. TEKNOLOGI IOT PENGAWASAN MUATAN (SMART CARGO SENSING)**
* **Sensor Beban Suspensi Otomatis:** Sensor berat yang dipasang pada suspensi armada guna mendeteksi beban muatan secara langsung demi mematuhi aturan anti-ODOL.
* **Sensor Telemetri Kargo Khusus:** Sensor digital untuk mengukur parameter getaran, kelembapan, atau temperatur tangki yang relevan dengan ${materialName}.

**C. INTEGRASI DIGITALISASI ALUR MANIFES (E-MANIFEST INTEGRATION)**
* **Sistem Manifes Digital (Festronik):** Integrasi sistem pelaporan logistik sirkular tanpa kertas yang aman dan terhubung langsung ke server kementerian lingkungan hidup.
* **Dasbor Pelaporan Jejak Karbon:** Dasbor khusus yang menghitung jejak karbon per ritase guna mendukung target pelaporan ESG dekarbonisasi rantai pasok mitra.

**D. MACAM-MACAM PERANGKAT IOT & METODOLOGI INTEGRASI (TYPES OF IOT DEVICES & METHODOLOGY)**
* **Sensor Berat Suspensi Gandar (Axle Load Sensors):** Mendeteksi tekanan suspensi udara/per sasis untuk kalkulasi tonase instan guna mencegah denda timbangan jalan.
* **Sistem Kamera Pemantau AI (DMS & ADAS):** Kamera pintar di dalam kabin untuk memantau fokus pengemudi (antidistraksi & kelelahan) serta asisten keselamatan jarak aman jalan.
* **Aplikasi Driver Mobile & e-POD (Electronic Proof of Delivery):** Mengganti kertas manifest manual dengan konfirmasi digital tanda terima menggunakan tanda tangan digital dan foto koordinat GPS lokasi bongkar muat.`,

    12: (() => {
      const comps = getDefaultCompetitorsForProject(pName);
      let text = "### 12. Competitor Analysis & Market Landscape\n\n";
      text += "**A. PROFIL KOMPETITOR UTAMA DI INDONESIA (COMPETITOR PROFILES)**\n";
      text += "Dalam pelaksanaan proyek **\"" + pName + "\"** di Indonesia, persaingan tender dan operasional melibatkan beberapa pemain kunci berikut:\n\n";
      comps.forEach((c, idx) => {
        text += "**" + (idx + 1) + ". " + c.name + " (" + c.status + ")**\n";
        text += "* **Skala Armada:** " + c.armadaScale + " | **Indeks Keamanan (HSE):** " + c.safetyIndex + "%\n";
        text += "* **Rekam Jejak Proyek:** " + c.projectHistory + "\n";
        text += "* **Kekuatan Utama:** " + c.strengths + "\n";
        text += "* **Kelemahan & Celah Pasar:** " + c.weaknesses + "\n";
        text += "* **Analisis Penetrasi Pancaran:** " + c.explanation + "\n\n";
      });
      text += "\n**B. KESENJANGAN DAN KEUNGGULAN RELATIF (COMPETITIVE GAP ANALYSIS)**\n";
      text += "* **Kelemahan Kompetitor:** Sebagian besar kompetitor lokal beroperasi menggunakan sasis armada tua tanpa integrasi sistem IoT, sertifikasi HSE yang minim, serta tiadanya program penunjang dekarbonisasi karbon.\n";
      text += "* **Keunggulan Pancaran:** Pancaran Group memadukan keandalan armada berstandar keselamatan tinggi, kepatuhan hukum penuh, serta transparansi sensor IoT real-time.\n\n";
      text += "**C. STRATEGI KEMENANGAN PANCARAN GROUP (MARKET DOMINANCE STRATEGY)**\n";
      text += "Pancaran Group berada di posisi unik \"Value Frontier\" di Indonesia, di mana kita mengawinkan kepatuhan standar internasional (HSE & ESG) serta integrasi teknologi IoT Smart Telematics, namun mempertahankan tarif lokal yang kompetitif dan fleksibilitas jadwal yang tidak dimiliki oleh perusahaan multinasional besar (seperti PPLI atau RAPP Logistics).";
      text += "\n\n**D. MACAM-MACAM TIPE KOMPETITOR DI PASAR (TYPES OF COMPETITORS)**\n";
      text += "* **Tipe 1 - Transporter Lokal Konvensional:** Mengandalkan sasis armada lama berbiaya sewa murah namun memiliki risiko kecelakaan tinggi dan tidak lolos persyaratan sertifikasi K3.\n";
      text += "* **Tipe 2 - Perusahaan Multinasional Raksasa:** Menawarkan layanan standar internasional berbiaya tinggi dengan proses birokrasi kaku dan kurangnya fleksibilitas rute darat.\n";
      text += "* **Tipe 3 - Operator Niche Khusus:** Fokus pada komoditas spesifik berteknologi tinggi tetapi memiliki kapasitas sasis terbatas yang tidak mampu melayani lonjakan volume kargo mendadak.";
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
        "**A. TOTAL ADDRESSABLE MARKET - TAM (POTENSI PASAR KESELURUHAN)**\n" +
        "* **Estimasi Nilai TAM: " + tamFormatted + " per tahun**\n" +
        "* **Penjelasan Detail:** Merupakan total potensi belanja (spending) logistik dan transportasi secara keseluruhan di Indonesia untuk sektor " + industry + ". Angka ini mencerminkan volume industri raksasa berskala nasional, didorong oleh pertumbuhan manufaktur, ketatnya regulasi pemerintah, dan ekspansi infrastruktur koridor logistik.\n\n" +
        "**B. SERVICEABLE ADDRESSABLE MARKET - SAM (PANGSA PASAR TERSEDIA)**\n" +
        "* **Estimasi Nilai SAM: " + samFormatted + " per tahun**\n" +
        "* **Penjelasan Detail:** Porsi dari TAM yang secara geografis dan regulasi dapat dilayani secara langsung oleh jaringan operasional, izin trayek, serta armada tersertifikasi Pancaran Group. " + explanationText.split(". ")[0] + ".\n\n" +
        "**C. SERVICEABLE OBTAINABLE MARKET - SOM (TARGET PASAR SASARAN NYATA)**\n" +
        "* **Estimasi Nilai SOM: " + somFormatted + " per tahun**\n" +
        "* **Penjelasan Detail:** Target pangsa pasar riil yang sangat optimis dan realistis untuk dimenangkan oleh unit bisnis Pancaran Group dalam jangka waktu 3 tahun pertama operasional proyek. Ini dihitung bersandarkan kapasitas penyerapan kontrak tender tahunan, ketersediaan unit armada baru (" + unitsText + "), serta skema pricing yang kompetitif. " + (explanationText.split(". ")[1] || "") + "." +
        "\n\n**D. METODOLOGI PERHITUNGAN & MODEL ESTIMASI PASAR (TYPES OF MARKET SIZING METHODOLOGIES)**\n" +
        "* **Pendekatan Top-Down (Top-Down Approach):** Estimasi berbasis analisis laporan statistik industri logistik makro nasional dari Kemenhub, ALFI, dan BPS, dikalibrasi dengan persentase kontribusi daerah proyek.\n" +
        "* **Pendekatan Bottom-Up (Bottom-Up Approach):** Perhitungan agregat dari nilai volume kargo ril (ritase per hari) milik calon-calon klien korporasi target logistik di wilayah terkait dikalikan dengan tarif ritase pasaran.\n" +
        "* **Analisis Ketersediaan Sasis (Fleet-Based Capacity Model):** Menyelaraskan hasil estimasi dengan keterbatasan suplai armada chassis yang dimiliki Pancaran Group guna menentukan batas atas pendapatan riil.";
    })(),

    14: `### 14. Customer Acquisition Cost (CAC) & Lifetime Value (LTV)

**A. ANALISIS CUSTOMER ACQUISITION COST (CAC)**
* **Biaya Akuisisi Rata-Rata (CAC):** **${cacFormatted}** per klien korporasi baru.
* **Alokasi Biaya Akuisisi:** Mencakup biaya proses negosiasi tender, survey kelayakan teknis rute jalan awal, penyusunan kustomisasi operasional khusus, program kepatuhan K3 awal, dan penyusunan berkas administrasi legalitas.

**B. ANALISIS CUSTOMER LIFETIME VALUE (LTV)**
* **Nilai Sepanjang Hidup Klien (LTV):** **${ltvFormatted}** per kontrak korporat.
* **Justifikasi Finansial:** Dihitung berdasarkan masa retensi rata-rata kontrak berdurasi 3 tahun dengan jaminan kepastian volume pengangkutan minimum harian yang disepakati.

**C. RASIO EFISIENSI LTV/CAC (INVESTMENT HEALTHY RATIO)**
* **Rasio LTV/CAC:** **${ratioValue}x**
* **Interpretasi Kelayakan:** Rasio di atas rerata industri logistik, membuktikan bahwa biaya yang diinvestasikan untuk mengakuisisi klien baru di proyek **"${pName}"** ini sangat menguntungkan dan bernilai ekonomi tinggi.

**D. MACAM-MACAM METRIK CAC & ELEMEN LIFETIME VALUE (TYPES OF COST METRICS)**
* **Elemen CAC Teknis Operasional:** Biaya trial run unit kosong di jalan hauling, kalibrasi sensor telemetri PRAMA, survey jembatan dan elevasi jalan, serta penyesuaian bodi sasis karoseri.
* **Elemen CAC Komersial & Legalitas:** Pengurusan jaminan tender (*Tender Bond*), asuransi tanggung jawab hukum pihak ketiga (*TPLLI*), dan persiapan berkas audit vendor K3.
* **Elemen LTV Kontrak Berulang:** Nilai kumulatif pendapatan bulanan dikurangi Opex selama masa kontrak primer, ditambah taksiran nilai kontrak perpanjangan (*renewal probability*) sebesar 75%.`
  };

  return pillars;
}

export function cleanPillarContent(content: string, pillarNum: number, pillarTitle: string): string {
  let cleaned = content.trim();
  
  // 1. If the content has multiple occurrences of the pillar header, take the last one!
  // E.g., if there's a duplicate header like "### 1. Global / National" or "GLOBAL/NAT OVERVIEW" or "### 1"
  const lines = cleaned.split("\n");
  let lastHeaderIndex = -1;
  
  for (let i = 1; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    // Check if this line looks like a header for the same pillar
    if (
      lineLower.startsWith("### " + pillarNum) ||
      lineLower.startsWith("### " + pillarNum + ".") ||
      lineLower.includes(pillarTitle.toLowerCase()) ||
      (lineLower.startsWith("###") && lineLower.includes(pillarNum.toString()) && lineLower.includes("overview"))
    ) {
      lastHeaderIndex = i;
    }
  }
  
  if (lastHeaderIndex !== -1) {
    // Keep only from lastHeaderIndex onwards
    cleaned = lines.slice(lastHeaderIndex).join("\n").trim();
  }

  // 2. Filter out conversational prologue lines
  const conversationalKeywords = [
    "halo!", "halo,", "hai!", "selamat datang", "saya senang", "mendeteksi permintaan",
    "dengan senang hati", "konfirmasi bahwa proyek baru", "mari kita", "berikut adalah analisis",
    "analisis lengkap 14 pilar", "proyek yang akan kita", "bisa membantu anda", "pilar strategis",
    "draf strategis", "sambut dan konfirmasikan", "rekonstruksi semua"
  ];
  
  const finalLines = cleaned.split("\n");
  const filteredLines: string[] = [];
  let skippingPrologue = true;
  
  for (const line of finalLines) {
    const lineLower = line.toLowerCase();
    
    // Always keep headers
    if (line.trim().startsWith("###")) {
      filteredLines.push(line);
      skippingPrologue = false;
      continue;
    }
    
    if (skippingPrologue) {
      const isConversational = conversationalKeywords.some(keyword => lineLower.includes(keyword));
      if (isConversational) {
        continue; // skip this line
      } else if (line.trim().length > 0) {
        skippingPrologue = false; // stop skipping once we hit real content
      }
    }
    
    filteredLines.push(line);
  }
  
  return filteredLines.join("\n").trim();
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

  // Clean all sections to remove conversational prologue and duplicate headers
  for (const numStr of Object.keys(result)) {
    const num = parseInt(numStr, 10);
    const defSec = defaultDashboardSections.find(s => s.number === num);
    const title = defSec ? defSec.title : "";
    result[num] = cleanPillarContent(result[num], num, title);
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

