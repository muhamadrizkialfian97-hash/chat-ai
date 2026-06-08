/**
 * PRAMA Document Exporter Utility
 * Handles pristine formatted exports of analysis reports to MS Word (DOCX-compatible) and PDF formats.
 */
import { jsPDF } from "jspdf";
import pptxgen from "pptxgenjs";

export function parseInlineMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code style='background-color:#f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 90%; color: #dc2626;'>$1</code>");
}

export function cleanPDFMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/__/g, "")
    .replace(/_/g, "")
    .replace(/`/g, "");
}

export function extractProjectTitle(text: string, divisionName: string): string {
  if (!text) return `Kajian_${divisionName.toUpperCase()}_Strategis`;
  
  const lines = text.split("\n");
  // 1. First choice: look for markdown headers like "# Laporan Kelayakan Proyek..."
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") || trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      const clean = trimmed
        .replace(/^#+\s*/, "") // remove hashes
        .replace(/[*_#]/g, "") // remove styling markers
        .replace(/:/g, " - ") // replace colon
        .trim();
      if (clean.length > 3 && clean.length < 80) {
        return clean;
      }
    }
  }

  // 2. Second choice: look for lines starting with "Judul:", "Project:", "Topik:", etc.
  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(judul|project|topik|nama\sproyek)\s*:\s*(.*)/i);
    if (match && match[2]) {
      const clean = match[2].replace(/[*_#]/g, "").trim();
      if (clean.length > 3 && clean.length < 80) {
        return clean;
      }
    }
  }

  // 3. Third choice: look for title in bold text on the first few lines
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      const clean = trimmed.replace(/\*\*/g, "").trim();
      if (clean.length > 5 && clean.length < 80) {
        return clean;
      }
    }
  }

  // Fallback
  return `Kajian_${divisionName.toUpperCase()}_Strategis`;
}

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
      html += `<h3 style="font-size: 11pt; color: #0f172a; margin-top: 14pt; margin-bottom: 6pt; font-weight: bold;">${parseInlineMarkdown(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith("## ")) {
      html += `<h2 style="font-size: 14pt; color: #0369a1; margin-top: 18pt; margin-bottom: 8pt; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${parseInlineMarkdown(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith("# ")) {
      html += `<h1 style="font-size: 20pt; color: #1e3a8a; margin-top: 0; margin-bottom: 14pt; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 6pt;">${parseInlineMarkdown(trimmed.slice(2))}</h1>`;
    }
    // 2. Numbered main list points (e.g. 1., 2.)
    else if (/^\d+\.\s+(.*)/.test(trimmed)) {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (!inList) {
        html += "<ol style='margin-bottom: 12pt; padding-left: 20pt;'>";
        inList = true;
      }
      const val = trimmed.replace(/^\d+\.\s+/, "");
      html += `<li style="font-size: 10.5pt; margin-bottom: 6pt; color: #1e293b; text-align: justify;"><strong>${parseInlineMarkdown(val)}</strong></li>`;
    }
    // 3. Sub list points (e.g. a., b., c.)
    else if (/^[a-zA-Z]\.\s+(.*)/.test(trimmed)) {
      if (!inSubList) {
        html += `<ul style="list-style-type: lower-alpha; padding-left: 24px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[a-zA-Z]\.\s+/, "");
      html += `<li style="font-size: 10.5pt; margin-bottom: 4pt; color: #475569; text-align: justify;">${parseInlineMarkdown(val)}</li>`;
    }
    // 4. Bullet points
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      if (!inSubList) {
        html += `<ul style="list-style-type: square; padding-left: 20px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[-*•]\s+/, "");
      html += `<li style="font-size: 10.5pt; margin-bottom: 4pt; color: #334155; text-align: justify;">${parseInlineMarkdown(val)}</li>`;
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
      html += `<p style="font-size: 10.5pt; margin-bottom: 8pt; line-height: 1.6; text-align: justify; color: #334155;">${parseInlineMarkdown(trimmed)}</p>`;
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
  const sanitizedFilename = title.trim().replace(/[/\\?%*:|"<>\s]+/g, "_") + ".doc";
  
  link.href = url;
  link.download = sanitizedFilename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  // Clean up after standard delay to guarantee file is downloaded in iframe previews
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
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
      const rawText = isH1 ? trimmed.slice(2) : (isH2 ? trimmed.slice(3) : trimmed.slice(4));
      const cleanText = cleanPDFMarkdown(rawText);
      
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
      const rawText = trimmed.replace(/^[-*•]\s+/, "");
      const cleanText = cleanPDFMarkdown(rawText);
      
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
      const rawText = match ? match[2] : trimmed;
      const cleanText = cleanPDFMarkdown(rawText);

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
      const rawText = isBoldBlock ? trimmed.slice(2, -2) : trimmed;
      const cleanText = cleanPDFMarkdown(rawText);

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
  const sanitizedFilename = title.trim().replace(/[/\\?%*:|"<>\s]+/g, "_") + ".pdf";
  doc.save(sanitizedFilename);

  // IMMEDIATELY let them see the file in a new tab!
  try {
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, "_blank");
  } catch (err) {
    console.error("Popup blocked:", err);
  }
}

export function exportToPPTX(
  title: string,
  slides: Array<{ title: string; bullets: string[]; speakerNotes: string; imageUrl: string }>,
  divisionName: string
) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";

  const totalSlidesCount = slides.length + 2; // +1 Cover, +1 Thank you

  // 1. Cover Slide (Slide 1) - Elegant Deep Navy & Vibrant Green Border Theme
  const openingSlide = pptx.addSlide();
  openingSlide.background = { color: "06152B" }; // Deep Navy

  // Outer green border rectangle
  openingSlide.addShape("rect", {
    x: 0.3,
    y: 0.3,
    w: 12.73,
    h: 6.9,
    fill: { color: "none" },
    line: { color: "00D285", width: 1.5 }
  });

  const displayTitle = title.replace("KAJIAN STRATEGIS KOMPREHENSIF: ", "").trim();

  // Top header in Cover
  openingSlide.addText(`✦ PRAMA COGNITIVE PORTAL • ${displayTitle.toUpperCase()}`, {
    x: 0.8,
    y: 0.8,
    w: 11.73,
    h: 0.4,
    fontSize: 9.5,
    bold: true,
    color: "00D285",
    fontFace: "Arial"
  });

  // Large centered/left main cover title
  openingSlide.addText(`KAJIAN STRATEGIS KOMPREHENSIF: ${displayTitle.toUpperCase()}`, {
    x: 0.8,
    y: 1.8,
    w: 11.73,
    h: 2.2,
    fontSize: 28,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
    valign: "middle"
  });

  // Subtitle
  openingSlide.addText(`Kajian Komprehensif Skema Strategis & Operasional ${displayTitle} PT Pancaran Group Berdasarkan Rekomendasi PRAMA AI Advisor`, {
    x: 0.8,
    y: 4.3,
    w: 11.73,
    h: 0.8,
    fontSize: 11,
    color: "94A3B8",
    fontFace: "Arial"
  });

  // Bottom left metadata stamp
  openingSlide.addText(`PROYEK: ${displayTitle.toUpperCase()}\nUNIT DIREKTORAT: ${(divisionName || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}\nKLASIFIKASI: TERBATAS / INTERNAL PT PANCARAN GROUP`, {
    x: 0.8,
    y: 5.6,
    w: 11.73,
    h: 1.0,
    fontSize: 8,
    bold: true,
    color: "00D285",
    fontFace: "Arial"
  });

  openingSlide.addNotes(`Selamat pagi/siang dan salam sejahtera bapak dan ibu sekalian. Slide pembuka ini menjelaskan judul dan pilar utama kajian proyek strategis PRAMA untuk unit kerja ${divisionName}.`);

  // 2. Content Slides (Slide 2 to N-1)
  slides.forEach((slideData, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" }; // White Background

    // Solid Top Accent Green Band (from edge to edge)
    slide.addShape("rect", {
      x: 0.0,
      y: 0.0,
      w: 13.33,
      h: 0.1,
      fill: { color: "00D285" }
    });

    // Header Left-hand side
    slide.addText(displayTitle.toUpperCase(), {
      x: 0.8,
      y: 0.25,
      w: 6.0,
      h: 0.3,
      fontSize: 9,
      color: "94A3B8",
      fontFace: "Arial"
    });

    // Header Right-hand side
    slide.addText(`SEKTOR: ${(divisionName || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}`, {
      x: 6.8,
      y: 0.25,
      w: 5.73,
      h: 0.3,
      fontSize: 9,
      color: "00D285",
      bold: true,
      align: "right",
      fontFace: "Arial"
    });

    // Thin grey divider below header
    slide.addShape("rect", {
      x: 0.8,
      y: 0.55,
      w: 11.73,
      h: 0.015,
      fill: { color: "E2E8F0" }
    });

    // Chapter category label (e.g. KAJIAN STRATEGIS: BAB X)
    slide.addText(`KAJIAN STRATEGIS: BAB ${idx + 1}`, {
      x: 0.8,
      y: 0.75,
      w: 11.73,
      h: 0.3,
      fontSize: 10,
      color: "00D285",
      bold: true,
      fontFace: "Arial"
    });

    // Slide Body Main Title
    slide.addText(slideData.title, {
      x: 0.8,
      y: 1.0,
      w: 6.0,
      h: 0.8,
      fontSize: 22,
      color: "0F172A",
      bold: true,
      fontFace: "Arial",
      valign: "middle"
    });

    // Left Column logic - extract first bullet as intro paragraph
    let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
    let bulletPoints = slideData.bullets;
    if (slideData.bullets && slideData.bullets.length > 0) {
      if (slideData.bullets.length >= 3) {
        introPara = slideData.bullets[0];
        bulletPoints = slideData.bullets.slice(1);
      }
    }

    // Paragraph Summary Block
    slide.addText(introPara, {
      x: 0.8,
      y: 2.0,
      w: 5.8,
      h: 1.6,
      fontSize: 11.5,
      color: "475569",
      fontFace: "Arial",
      valign: "top"
    });

    // Bullet List Options
    const formattedBullets = bulletPoints.map((bullet) => ({
      text: bullet,
      options: { bullet: true, fontSize: 10.5, color: "334155", fontFace: "Arial" }
    }));

    // Add bullet box
    slide.addText(formattedBullets, {
      x: 0.8,
      y: 3.7,
      w: 5.8,
      h: 2.8,
      valign: "top"
    });

    // Right Column logic - Unsplash image container with green border frame
    if (slideData.imageUrl) {
      slide.addImage({
        path: slideData.imageUrl,
        x: 7.2,
        y: 1.8,
        w: 5.3,
        h: 3.5,
      });

      // Draw bright green border around picture frame
      slide.addShape("rect", {
        x: 7.17,
        y: 1.77,
        w: 5.36,
        h: 3.56,
        fill: { color: "none" },
        line: { color: "00D285", width: 2 }
      });

      // Figure caption label
      slide.addText(`Ilustrasi: ${slideData.title} di Pancaran Group`, {
        x: 7.2,
        y: 5.4,
        w: 5.3,
        h: 0.5,
        fontSize: 8.5,
        italic: true,
        color: "64748B",
        align: "center",
        fontFace: "Arial"
      });
    }

    // Thin grey footer line
    slide.addShape("rect", {
      x: 0.8,
      y: 6.8,
      w: 11.73,
      h: 0.015,
      fill: { color: "E2E8F0" }
    });

    // Footer LHS
    slide.addText("PANCARAN GROUP • CONFIDENTIAL DOCUMENTATION", {
      x: 0.8,
      y: 6.9,
      w: 6.0,
      h: 0.3,
      fontSize: 8,
      color: "94A3B8",
      bold: true,
      fontFace: "Arial"
    });

    // Footer RHS
    slide.addText(`HALAMAN ${idx + 2} DARI ${totalSlidesCount}`, {
      x: 6.8,
      y: 6.9,
      w: 5.73,
      h: 0.3,
      fontSize: 8,
      color: "0F172A",
      bold: true,
      align: "right",
      fontFace: "Arial"
    });

    // Speaker notes
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }
  });

  // 3. Last Slide (Slide 17) - Elegant Dark Theme "TERIMA KASIH"
  const closingSlide = pptx.addSlide();
  closingSlide.background = { color: "06152B" }; // Deep Navy

  // Outer green border rectangle
  closingSlide.addShape("rect", {
    x: 0.3,
    y: 0.3,
    w: 12.73,
    h: 6.9,
    fill: { color: "none" },
    line: { color: "00D285", width: 1.5 }
  });

  // Thank You text
  closingSlide.addText("TERIMA KASIH", {
    x: 1.0,
    y: 2.2,
    w: 11.33,
    h: 1.0,
    fontSize: 36,
    bold: true,
    color: "FFFFFF",
    align: "center",
    fontFace: "Arial"
  });

  // Green Subtitle
  closingSlide.addText("Sistem Dokumentasi Strategis & Operasional Terintegrasi", {
    x: 1.0,
    y: 3.4,
    w: 11.33,
    h: 0.5,
    fontSize: 13,
    bold: true,
    color: "00D285",
    align: "center",
    fontFace: "Arial"
  });

  // Bottom detailed credit labels
  closingSlide.addText("✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor\nPT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF", {
    x: 1.0,
    y: 5.3,
    w: 11.33,
    h: 1.0,
    fontSize: 8.5,
    color: "94A3B8",
    align: "center",
    fontFace: "Arial"
  });

  closingSlide.addNotes("Sesi presentasi selesai. Terima kasih kepada seluruh jajaran direksi, komite, dan tim operasional PT Pancaran Group atas perhatiannya.");

  const sanitizedTitle = title.trim().replace(/[/\\?%*:|"<>\s]+/g, "_") || "prama_slide";
  const baseTitle = sanitizedTitle.toLowerCase().endsWith(".pptx") 
    ? sanitizedTitle.slice(0, -5) 
    : sanitizedTitle;
  pptx.writeFile({ fileName: baseTitle });
}
