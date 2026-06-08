/**
 * PRAMA Document Exporter Utility
 * Handles pristine formatted exports of analysis reports to MS Word (DOCX-compatible) and PDF formats.
 */
import { jsPDF } from "jspdf";
import pptxgen from "pptxgenjs";

function formatMarkdownToHtml(text: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let inSubList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (inList) {
        html += "</ol>";
        inList = false;
      }
      return;
    }

    // 1. Headings
    if (trimmed.startsWith("### ")) {
      html += `<h3>${trimmed.slice(4)}</h3>`;
    } else if (trimmed.startsWith("## ")) {
      html += `<h2>${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith("# ")) {
      html += `<h1>${trimmed.slice(2)}</h1>`;
    }
    // 2. Numbered main list points (e.g. 1., 2.)
    else if (/^\d+\.\s+(.*)/.test(trimmed)) {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (!inList) {
        html += "<ol>";
        inList = true;
      }
      const val = trimmed.replace(/^\d+\.\s+/, "");
      html += `<li><strong>${val}</strong></li>`;
    }
    // 3. Sub list points (e.g. a., b., c.)
    else if (/^[a-zA-Z]\.\s+(.*)/.test(trimmed)) {
      if (!inSubList) {
        html += `<ul style="list-style-type: lower-alpha; padding-left: 24px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[a-zA-Z]\.\s+/, "");
      html += `<li>${val}</li>`;
    }
    // 4. Bullet points
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      if (!inSubList) {
        html += `<ul style="list-style-type: square; padding-left: 20px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[-*•]\s+/, "");
      html += `<li>${val}</li>`;
    }
    // 5. Normal paragraphs
    else {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (inList) {
        html += "</ol>";
        inList = false;
      }
      html += `<p>${trimmed}</p>`;
    }
  });

  // Close tags if open
  if (inSubList) html += "</ul>";
  if (inList) html += "</ol>";

  return html;
}

export function exportToWord(title: string, text: string, divisionName: string) {
  const formattedHtml = formatMarkdownToHtml(text);
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
      <title>${title}</title>
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
          size: 210mm 297mm; /* A4 Standard */
          margin: 20mm 20mm 20mm 20mm; /* 2cm (0.78 in) margins for a wider, clean editorial flow */
          mso-header-margin: 36pt;
          mso-footer-margin: 36pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #334155; 
          margin: 0; /* Let @page handle document margins */
        }
        h1 { 
          font-size: 20pt; 
          color: #1e3a8a; 
          margin-top: 0;
          margin-bottom: 14pt; 
          font-weight: bold; 
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 6pt;
        }
        h2 { 
          font-size: 14pt; 
          color: #0369a1; 
          margin-top: 18pt; 
          margin-bottom: 8pt; 
          font-weight: bold; 
        }
        h3 { 
          font-size: 11pt; 
          color: #0f172a; 
          margin-top: 14pt; 
          margin-bottom: 6pt; 
          font-weight: bold; 
        }
        p { 
          font-size: 10.5pt; 
          margin-bottom: 8pt; 
          text-align: justify; 
        }
        ol {
          margin-bottom: 12pt;
          padding-left: 20pt;
        }
        li {
          font-size: 10.5pt;
          margin-bottom: 4pt;
        }
        .meta-container {
          background-color: #f8fafc;
          border-left: 4px solid #1e3a8a;
          padding: 12pt;
          margin-bottom: 24pt;
          font-size: 9.5pt;
          color: #475569;
        }
        .meta-title {
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 4pt;
        }
        .footer { 
          font-size: 8.5pt; 
          color: #94a3b8; 
          margin-top: 48pt; 
          border-top: 1px solid #e2e8f0; 
          padding-top: 12pt; 
          font-family: monospace; 
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <h1>LAPORAN ANALISIS STRATEGIS PRAMA</h1>
        
        <div class="meta-container">
          <div class="meta-title">INFORMASI DOKUMEN</div>
          <strong>Sistem Verifikasi:</strong> PRAMA Strategic Project Management Consultant<br>
          <strong>Direktorat Divisi:</strong> ${divisionName.toUpperCase()}<br>
          <strong>Tanggal Pembuatan:</strong> ${dateStr}<br>
          <strong>Klasifikasi:</strong> Terbatas / Rahasia Internal
        </div>

        <div class="document-body">
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
  const sanitizedFilename = title.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".doc";
  
  link.href = url;
  link.download = sanitizedFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(title: string, text: string, divisionName: string) {
  const formattedHtml = formatMarkdownToHtml(text);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create or get the print section
  let printSection = document.getElementById("print-section");
  if (!printSection) {
    printSection = document.createElement("div");
    printSection.id = "print-section";
    document.body.appendChild(printSection);
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; line-height: 1.625; color: #1e293b; background-color: #ffffff; padding: 40px; font-size: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px;">
        <div>
          <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.025em;">PRAMA SYSTEM</div>
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">Strategic Project Management Consulting</div>
        </div>
        <div style="border: 2px solid #0f172a; padding: 6px 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-align: center; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px;">
          PRAMA VERIFIED<br>
          <span style="color:#2563eb">${divisionName}</span>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Sistem Konsultan</span>
          <span style="font-weight: 600; color: #0f172a;">PRAMA Strategic AI Advisor</span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Direktorat Divisi</span>
          <span style="font-weight: 600; color: #0f172a;">${divisionName.toUpperCase()} Unit</span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">ID Dokumen</span>
          <span style="font-weight: 600; color: #0f172a;">PRM-${divisionName.toUpperCase()}-${Date.now().toString().slice(-6)}</span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">ID Tanggal Rilis</span>
          <span style="font-weight: 600; color: #0f172a;">${dateStr}</span>
        </div>
      </div>

      <div class="content-wrapper" style="color: #000000; font-size: 14px;">
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.025em; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${title}</h1>
        ${formattedHtml}
      </div>

      <div style="margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; font-weight: 500;">
        <span>STRATEGIC SYSTEM CONFIDENTIALITY</span>
        <span>PANCARAN GROUP &bull; © 2026</span>
      </div>
    </div>
  `;

  printSection.innerHTML = htmlContent;

  const originalTitle = document.title;
  document.title = title;

  // Trigger browser print dialog for the main window (works seamlessly in sandboxed iframe)
  window.print();

  // Restore title and clean up print section
  setTimeout(() => {
    document.title = originalTitle;
    if (printSection && printSection.parentNode) {
      printSection.parentNode.removeChild(printSection);
    }
  }, 1000);
}

export function downloadPDFDirect(title: string, text: string, divisionName: string) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4"
  });

  const pageHeight = 297;
  const margin = 20;
  const usableWidth = 170;
  let y = 30; // Start printing content below the header margin

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 30) {
      doc.addPage();
      y = 30; // reset y for new page
    }
  };

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- 1. TITLE BLOCK ---
  checkPageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const splitTitle = doc.splitTextToSize(title.toUpperCase(), usableWidth);
  doc.text(splitTitle, margin, y);
  y += (splitTitle.length * 7) + 5;

  // --- 2. METADATA DECORATOR CARD ---
  checkPageBreak(35);
  // Grey background card
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, usableWidth, 24, 2, 2, "FD");

  // Grid labels and values
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("SISTEM KONSULTAN", margin + 6, y + 6);
  doc.text("DIREKTORAT DIVISI", margin + 86, y + 6);
  doc.text("ID DOKUMEN", margin + 6, y + 16);
  doc.text("TANGGAL RILIS", margin + 86, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("PRAMA Strategic AI Advisor", margin + 6, y + 11);
  doc.text(`${divisionName.toUpperCase()} Unit`, margin + 86, y + 11);
  doc.text(`PRM-${divisionName.toUpperCase()}-${Date.now().toString().slice(-6)}`, margin + 6, y + 21);
  doc.text(dateStr, margin + 86, y + 21);

  y += 32;

  // --- 3. DOCUMENT BODY CONTENT PARSER ---
  const lines = text.split("\n");

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      y += 3; // empty spaces
      return;
    }

    // A. Headings
    if (trimmed.startsWith("# ") || trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      const isH1 = trimmed.startsWith("# ");
      const isH2 = trimmed.startsWith("## ");
      const cleanText = isH1 ? trimmed.slice(2) : (isH2 ? trimmed.slice(3) : trimmed.slice(4));
      
      const fSize = isH1 ? 14 : (isH2 ? 12 : 11);

      checkPageBreak(fSize / 2 + 8);
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fSize);
      doc.setTextColor(15, 23, 42);
      
      // Draw subtitle accent bar-line for H1 and H2
      if (isH1 || isH2) {
        doc.setFillColor(37, 99, 235); // Indigo blue accent
        doc.rect(margin, y - 1, 3, fSize / 2 + 1, "F");
      }

      const splitHead = doc.splitTextToSize(cleanText, usableWidth - 6);
      doc.text(splitHead, margin + 5, y + (fSize / 3));
      y += (splitHead.length * (fSize / 2)) + 6;
    }
    // B. Lists (Bullet points)
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const cleanText = trimmed.replace(/^[-*•]\s+/, "");
      
      checkPageBreak(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85); // slate-700
      
      // Draw custom bullet circle
      doc.setFillColor(71, 85, 105);
      doc.circle(margin + 3, y + 2.5, 0.8, "F");

      const splitBullet = doc.splitTextToSize(cleanText, usableWidth - 8);
      doc.text(splitBullet, margin + 8, y + 3.5);
      y += (splitBullet.length * 5.2) + 2;
    }
    // C. Lists (Numbered points)
    else if (/^\d+\.\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^(\d+\.)\s+(.*)/);
      const numPrefix = match ? match[1] : "";
      const cleanText = match ? match[2] : trimmed;

      checkPageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(numPrefix, margin + 2, y + 3.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const splitNumText = doc.splitTextToSize(cleanText, usableWidth - 10);
      doc.text(splitNumText, margin + 10, y + 3.5);
      y += (splitNumText.length * 5.2) + 2;
    }
    // D. Normal Paragraphs
    else {
      const isBoldBlock = trimmed.startsWith("**") && trimmed.endsWith("**");
      const cleanText = isBoldBlock ? trimmed.slice(2, -2) : trimmed;

      checkPageBreak(10);
      doc.setFont("helvetica", isBoldBlock ? "bold" : "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      const splitParagraph = doc.splitTextToSize(cleanText, usableWidth);
      doc.text(splitParagraph, margin, y + 3.5);
      y += (splitParagraph.length * 5.2) + 3;
    }
  });

  // --- 4. BACKDROP OVERLAYS & FOOTER STAMPS ON ALL PAGES ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("PRAMA SYSTEM PORTAL", margin, 13);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("INTEGRATED ENTERPRISE PORTAL", margin, 16.5);

    // Division verified badge on top right
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(150, 8, 40, 10, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(241, 245, 249);
    doc.text("PRAMA VERIFIED", 170, 11.5, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(96, 165, 250); // sky-400
    doc.text(divisionName.toUpperCase(), 170, 15.5, { align: "center" });

    // Decorative line below header
    doc.setDrawColor(241, 245, 249); // super soft divider
    doc.setLineWidth(0.4);
    doc.line(margin, 20, 190, 20);

    // Decorative rule above footer
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, pageHeight - 16, 190, pageHeight - 16);

    // Footer Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("STRATEGIC SYSTEM CONFIDENTIALITY • PANCARAN GROUP", margin, pageHeight - 11);
    doc.text(`HALAMAN ${i} DARI ${totalPages}`, 190, pageHeight - 11, { align: "right" });
  }

  // Save the generated document directly
  const sanitizedFilename = title.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".pdf";
  doc.save(sanitizedFilename);
}

export function exportToPPTX(
  title: string,
  slides: Array<{ title: string; bullets: string[]; speakerNotes: string; imageUrl: string }>,
  divisionName: string
) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";

  // Slide 1: Welcome title slide (Elegant Dark Theme)
  const openingSlide = pptx.addSlide();
  openingSlide.background = { color: "0F172A" }; // Slate 900 / Dark Navy

  openingSlide.addText(title.toUpperCase(), {
    x: 1.0,
    y: 2.2,
    w: 11.33,
    h: 1.8,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
    align: "center",
    fontFace: "Arial"
  });

  openingSlide.addText(`PRAMA STRATEGIC ADVISORY REPORT • ${divisionName.toUpperCase()}`, {
    x: 1.0,
    y: 4.2,
    w: 11.33,
    h: 0.5,
    fontSize: 12,
    bold: true,
    color: "38BDF8", // Light Blue
    align: "center",
    fontFace: "Arial"
  });

  openingSlide.addText("Dokumen Rahasia Internal • Pancaran Group © 2026", {
    x: 1.0,
    y: 4.8,
    w: 11.33,
    h: 0.5,
    fontSize: 9,
    color: "94A3B8",
    align: "center",
    fontFace: "Arial"
  });

  openingSlide.addNotes(`Selamat pagi/siang dan salam sejahtera. Presentasi ini berisi kajian proyek strategis PRAMA untuk unit kerja ${divisionName}.`);

  // Content slides
  slides.forEach((slideData, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: "F8FAFC" }; // Slate 50

    // Top banner header text
    slide.addText(`Kajian Strategis PRAMA Area: ${divisionName.toUpperCase()}`, {
      x: 0.8,
      y: 0.3,
      w: 11.73,
      h: 0.3,
      fontSize: 10,
      color: "3B82F6",
      bold: true,
      fontFace: "Arial"
    });

    // Title of slide
    slide.addText(slideData.title, {
      x: 0.8,
      y: 0.6,
      w: 6.0,
      h: 0.9,
      fontSize: 22,
      color: "0F172A",
      bold: true,
      fontFace: "Arial"
    });

    // Bullets - format as paragraph blocks with indent
    const formattedBullets = slideData.bullets.map((b) => ({
      text: b,
      options: { bullet: true, fontSize: 13, color: "334155", fontFace: "Arial" }
    }));

    // Set bullet point lists or lines
    slide.addText(formattedBullets, {
      x: 0.8,
      y: 1.6,
      w: 6.0,
      h: 4.8,
      valign: "top"
    });

    // Image right side (split layout)
    if (slideData.imageUrl) {
      slide.addImage({
        path: slideData.imageUrl,
        x: 7.2,
        y: 1.0,
        w: 5.3,
        h: 5.0,
      });
    }

    // Speaker notes
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }

    // Footer watermark
    slide.addText(`PRAMA Digital Integrated Reporting System • Halaman ${idx + 2}`, {
      x: 0.8,
      y: 7.0,
      w: 11.73,
      h: 0.3,
      fontSize: 8,
      color: "94A3B8",
      fontFace: "Arial"
    });
  });

  const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_") || "prama_slide";
  pptx.writeFile({ fileName: `${sanitizedTitle}.pptx` });
}
