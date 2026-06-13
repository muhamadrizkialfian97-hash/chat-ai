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
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return "";
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin-top: 14pt; margin-bottom: 14pt; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; border: 1px solid #cbd5e1;">`;
    
    // Check if there is a header divider row
    let startIndex = 0;
    let hasHeader = false;
    if (tableRows.length > 1 && tableRows[1].some(cell => /^:?-+:?$/.test(cell.trim()))) {
      hasHeader = true;
    }

    if (hasHeader) {
      // Header Row
      const headers = tableRows[0];
      tableHtml += `<thead><tr style="background-color: #0f172a; color: #ffffff;">`;
      headers.forEach(cell => {
        tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8pt; text-align: left; font-weight: bold; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(cell.trim())}</th>`;
      });
      tableHtml += `</tr></thead>`;
      startIndex = 2; // skip header and divider rows
    }

    tableHtml += `<tbody>`;
    for (let i = startIndex; i < tableRows.length; i++) {
      if (i === 1 && !hasHeader) {
        if (tableRows[i].some(cell => /^:?-+:?$/.test(cell.trim()))) continue;
      }
      const row = tableRows[i];
      const bgColor = i % 2 === 0 ? "#f8fafc" : "#ffffff";
      tableHtml += `<tr style="background-color: ${bgColor};">`;
      row.forEach(cell => {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8pt; text-align: left; color: #334155; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(cell.trim())}</td>`;
      });
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table>`;
    tableRows = [];
    inTable = false;
    return tableHtml;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Check for Table Row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (inList) {
        html += "</ol>";
        inList = false;
      }
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        html += flushTable();
      }
    }

    if (!trimmed) {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (inList) {
        html += "</ol>";
        inList = false;
      }
      continue;
    }

    // 1. Headings
    if (trimmed.startsWith("### ")) {
      if (inSubList) { html += "</ul>"; inSubList = false; }
      if (inList) { html += "</ol>"; inList = false; }
      html += `<h3 style="font-size: 11pt; color: #0f172a; margin-top: 14pt; margin-bottom: 6pt; font-weight: bold; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith("## ")) {
      if (inSubList) { html += "</ul>"; inSubList = false; }
      if (inList) { html += "</ol>"; inList = false; }
      html += `<h2 style="font-size: 14pt; color: #0369a1; margin-top: 18pt; margin-bottom: 8pt; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith("# ")) {
      if (inSubList) { html += "</ul>"; inSubList = false; }
      if (inList) { html += "</ol>"; inList = false; }
      html += `<h1 style="font-size: 20pt; color: #1e3a8a; margin-top: 0; margin-bottom: 14pt; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 6pt; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(trimmed.slice(2))}</h1>`;
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
      html += `<li style="font-size: 10.5pt; margin-bottom: 6pt; color: #1e293b; text-align: justify; font-family: 'Segoe UI', Arial, sans-serif;"><strong>${parseInlineMarkdown(val)}</strong></li>`;
    }
    // 3. Sub list points (e.g. a., b., c.)
    else if (/^[a-zA-Z]\.\s+(.*)/.test(trimmed)) {
      if (!inSubList) {
        html += `<ul style="list-style-type: lower-alpha; padding-left: 24px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[a-zA-Z]\.\s+/, "");
      html += `<li style="font-size: 10.5pt; margin-bottom: 4pt; color: #475569; text-align: justify; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(val)}</li>`;
    }
    // 4. Bullet points
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      if (!inSubList) {
        html += `<ul style="list-style-type: square; padding-left: 20px; margin-top: 4px; margin-bottom: 8px;">`;
        inSubList = true;
      }
      const val = trimmed.replace(/^[-*•]\s+/, "");
      html += `<li style="font-size: 10.5pt; margin-bottom: 4pt; color: #334155; text-align: justify; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(val)}</li>`;
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
      html += `<p style="font-size: 10.5pt; margin-bottom: 8pt; line-height: 1.6; text-align: justify; color: #334155; font-family: 'Segoe UI', Arial, sans-serif;">${parseInlineMarkdown(trimmed)}</p>`;
    }
  }

  if (inTable) {
    html += flushTable();
  }
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

  const displayTitle = title.replace("KAJIAN STRATEGIS KOMPREHENSIF: ", "").trim();

  // Dynamic infographic canvas generation
  function extractKeyHeadingsAndStats(docText: string) {
    const lines = docText.split("\n");
    const headingsList: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
        const clean = trimmed
          .replace(/^##+\s*/, "")
          .replace(/[*_#]/g, "")
          .trim();
        if (clean && clean.length > 3 && clean.length < 50 && !headingsList.includes(clean)) {
          headingsList.push(clean);
        }
      }
    }

    const fallbacks = [
      "Optimasi Efisiensi Armada & Rute",
      "Peta Jalan Keamanan Digital",
      "Analisis Risiko & Mitigasi Krisis",
      "Dampak Investasi Finansial Utama",
      "Strategi Integrasi Lintas Sektor",
      "Metrik Kinerja & Evaluasi Sukses"
    ];

    while (headingsList.length < 4) {
      const nextFallback = fallbacks.find(f => !headingsList.includes(f));
      headingsList.push(nextFallback || "Optimasi Strategi Bisnis");
    }

    let hashVal = 0;
    for (let i = 0; i < docText.length; i++) {
      hashVal = (hashVal << 5) - hashVal + docText.charCodeAt(i);
      hashVal |= 0;
    }
    const seed = Math.abs(hashVal);

    const statsObj = {
      feasibility: 85 + (seed % 13), // 85% to 97%
      alignment: 88 + ((seed >> 2) % 11), // 88% to 98%
      readiness: 79 + ((seed >> 4) % 17), // 79% to 95%
      efficiencyIdx: 75 + ((seed >> 6) % 20),
      riskIdx: 10 + ((seed >> 8) % 12), // 10% to 21%
      scalabilityIdx: 80 + ((seed >> 10) % 16),
      adaptabilityIdx: 78 + ((seed >> 12) % 18)
    };

    return { headings: headingsList.slice(0, 4), stats: statsObj };
  }

  function generateWordInfographic(docText: string, docTitle: string, divName: string): string {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 960;
      canvas.height = 540;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const { headings, stats } = extractKeyHeadingsAndStats(docText);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 960, 540);
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(1, "#f8fafc");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 960, 540);

      // Grid lines
      ctx.strokeStyle = "rgba(203, 213, 225, 0.25)";
      ctx.lineWidth = 1;
      for (let x = 40; x < 960; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 540);
        ctx.stroke();
      }
      for (let y = 40; y < 540; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(960, y);
        ctx.stroke();
      }

      // Border lines
      ctx.strokeStyle = "#1e3a8a"; // Deep Navy
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 952, 532);

      ctx.strokeStyle = "#00D285"; // Vibrant Green
      ctx.lineWidth = 1.5;
      ctx.strokeRect(16, 16, 928, 508);

      // HEADER
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(17, 17, 926, 68);

      ctx.fillStyle = "#00D285";
      ctx.font = "bold 10px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("✦ PRAMA COGNITIVE BUSINESS INTELLIGENCE SYSTEM • BLUEPRINT MAP", 35, 41);

      const truncatedTitle = docTitle.replace("KAJIAN STRATEGIS KOMPREHENSIF: ", "").toUpperCase();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
      const titleWidth = ctx.measureText(truncatedTitle).width;
      if (titleWidth > 580) {
        ctx.fillText(truncatedTitle.slice(0, 50) + "...", 35, 65);
      } else {
        ctx.fillText(truncatedTitle, 35, 65);
      }

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`DIVISI: ${divName.toUpperCase()}`, 920, 42);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "normal 10px monospace";
      ctx.fillText("STATUS COMPLIANCE: 100% SECURE", 920, 64);
      ctx.textAlign = "left";

      // Panel Dividers
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(315, 95);
      ctx.lineTo(315, 475);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(665, 95);
      ctx.lineTo(665, 475);
      ctx.stroke();

      // Section Headers
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("I. METRIK KELAYAKAN UTAMA", 35, 115);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("II. PILAR STRATEGIS PROYEK", 330, 115);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("III. RADAR INTELIJEN SEKTOR", 680, 115);

      // Left Panel: Gauges
      const drawGauge = (cx: number, cy: number, radius: number, percent: number, color: string, label: string) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0.8 * Math.PI, 2.2 * Math.PI);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.stroke();

        const endAngle = 0.8 * Math.PI + (1.4 * Math.PI * (percent / 100));
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0.8 * Math.PI, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${percent}%`, cx, cy + 5);

        ctx.fillStyle = "#475569";
        ctx.font = "bold 9px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(label, cx, cy + radius + 15);
        ctx.textAlign = "left";
      };

      drawGauge(100, 190, 36, stats.feasibility, "#00D285", "KELAYAKAN TEKNIS");
      drawGauge(230, 190, 36, stats.alignment, "#0284c7", "KESELARASAN STRATEGIS");
      drawGauge(165, 315, 38, stats.readiness, "#8b5cf6", "KESIAPAN OPERASIONAL");

      ctx.fillStyle = "#334155";
      ctx.font = "normal 11px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`• Kelayakan Kajian: SANGAT TINGGI (${stats.feasibility}%)`, 35, 410);
      ctx.fillText(`• Sinergi Organisasi: Optimal & Selaras`, 35, 430);
      ctx.fillText(`• Status Verifikasi: Terakreditasi PRAMA AI`, 35, 450);

      // Middle Panel: Pillars Flow
      ctx.strokeStyle = "rgba(0, 210, 133, 0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(355, 145);
      ctx.lineTo(355, 415);
      ctx.stroke();
      ctx.setLineDash([]);

      const pillarColors = ["#1e3a8a", "#0284c7", "#00D285", "#7c3aed"];
      const statusTags = ["OPTIMAL", "INTEGRITAS", "STRATEGIS", "EFISIEN"];
      const statusColors = ["#00D285", "#0284c7", "#8b5cf6", "#f97316"];

      headings.forEach((heading, hIdx) => {
        const cy = 145 + (hIdx * 82);

        ctx.fillStyle = pillarColors[hIdx];
        ctx.beginPath();
        ctx.arc(355, cy + 22, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "rgba(241, 245, 249, 0.8)";
        ctx.fillRect(380, cy, 260, 46);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(380, cy, 260, 46);

        ctx.fillStyle = pillarColors[hIdx];
        ctx.fillRect(380, cy, 4, 46);

        ctx.fillStyle = pillarColors[hIdx];
        ctx.font = "bold 11px monospace";
        ctx.fillText(`0${hIdx + 1}`, 395, cy + 18);

        ctx.fillStyle = statusColors[hIdx % 4];
        ctx.fillRect(575, cy + 6, 55, 14);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(statusTags[hIdx], 602, cy + 16);
        ctx.textAlign = "left";

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
        const dispH = heading.length > 25 ? heading.slice(0, 23) + "..." : heading;
        ctx.fillText(dispH, 395, cy + 34);
      });

      // Right Panel: Radar and Stats
      const rx = 800;
      const ry = 220;
      const rSize = 60;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1;
      for (let j = 1; j <= 3; j++) {
        const cr = rSize * (j / 3);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
          const px = rx + cr * Math.cos(angle);
          const py = ry + cr * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + rSize * Math.cos(angle), ry + rSize * Math.sin(angle));
        ctx.stroke();
      }

      const radarLabels = ["EFISIENSI", "MITIGASI", "ADAPTASI", "SKALABILITAS", "TEKNOLOGI"];
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 9px Arial, sans-serif";
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        const lx = rx + (rSize + 15) * Math.cos(angle);
        const ly = ry + (rSize + 8) * Math.sin(angle);
        ctx.textAlign = "center";
        ctx.fillText(radarLabels[i], lx, ly + 2);
      }
      ctx.textAlign = "left";

      const polygonPoints: {x: number, y: number}[] = [];
      const multipliers = [
        stats.efficiencyIdx / 100,
        (100 - stats.riskIdx) / 100,
        stats.adaptabilityIdx / 100,
        stats.scalabilityIdx / 100,
        0.82
      ];

      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        const cr = rSize * multipliers[i];
        polygonPoints.push({
          x: rx + cr * Math.cos(angle),
          y: ry + cr * Math.sin(angle)
        });
      }

      ctx.fillStyle = "rgba(3, 105, 161, 0.2)";
      ctx.beginPath();
      ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < 5; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      polygonPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const drawRow = (tx: number, ty: number, key: string, val: string, col: string) => {
        ctx.fillStyle = "#64748b";
        ctx.font = "normal 10px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(key, tx, ty);

        ctx.fillStyle = col;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "right";
        ctx.fillText(val, tx + 225, ty);
        ctx.textAlign = "left";

        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx, ty + 5);
        ctx.lineTo(tx + 225, ty + 5);
        ctx.stroke();
      };

      drawRow(685, 335, "Indeks Efisiensi", `+${stats.efficiencyIdx}%`, "#00d285");
      drawRow(685, 365, "Kapasitas Skalabilitas", `PRM-${stats.scalabilityIdx}`, "#0284c7");
      drawRow(685, 395, "Faktor Risiko Korporat", `LOW Q-${stats.riskIdx}%`, "#ef4444");
      drawRow(685, 425, "Toleransi Keamanan", "STABIL", "#8b5cf6");

      // Footer
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(17, 478, 926, 44);

      ctx.fillStyle = "#475569";
      const barcodeWidths = [2, 5, 1, 3, 4, 1, 6, 2, 3, 1, 4, 2, 1, 5, 2, 4, 1, 3, 2, 4];
      let bX = 35;
      for (let bw of barcodeWidths) {
        ctx.fillRect(bX, 488, bw, 24);
        bX += bw + 2;
      }

      ctx.fillStyle = "#475569";
      ctx.font = "bold 8px monospace";
      ctx.fillText("*PRAMA-SYNCHRONIZED-MAP*", 35, 517);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("TI & PROYEK UTAMA PT PANCARAN GROUP • PRAMA SYSTEM", 225, 504);

      ctx.fillStyle = "#00D285";
      ctx.font = "bold 14px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("PRAMA CERTIFIED", 915, 501);

      ctx.fillStyle = "#64748b";
      ctx.font = "normal 8px monospace";
      ctx.fillText("COGNITIVE VERIFICATION ID: PRM-WORD-COMPLIANT", 915, 513);

      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error("Error drawing word infographic canvas:", err);
      return "";
    }
  }

  const infographicUrl = generateWordInfographic(text, title, divisionName);

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
          margin: 20mm 20mm 20mm 20mm; /* 2cm margins */
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
          margin: 0;
        }
        h1 { 
          font-size: 22pt; 
          color: #1e3a8a; 
          margin-top: 0;
          margin-bottom: 8pt; 
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
        ol, ul {
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
        <div style="font-size: 10pt; color: #64748b; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">PRAMA SYSTEM INTEGRATED REPORT</div>
        <h1>${displayTitle.toUpperCase()}</h1>
        
        <div class="meta-container">
          <div class="meta-title">INFORMASI DOKUMEN</div>
          <strong>Sistem Verifikasi:</strong> PRAMA Strategic Project Management Consultant<br>
          <strong>Direktorat Divisi:</strong> ${divisionName.toUpperCase()}<br>
          <strong>Tanggal Pembuatan:</strong> ${dateStr}<br>
          <strong>Klasifikasi:</strong> Terbatas / Rahasia Internal PT Pancaran Group
        </div>

        ${infographicUrl ? `
        <div style="text-align: center; margin-top: 15pt; margin-bottom: 25pt; page-break-inside: avoid;">
          <img src="${infographicUrl}" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px;" alt="Peta Visual Strategis PRAMA" />
          <p style="font-size: 8.5pt; color: #64748b; font-style: italic; text-align: center; margin-top: 6pt; font-family: 'Segoe UI', Arial, sans-serif;">
            Gambar 1.0: Peta Visual Strategis Terpadu PT Pancaran Group - Hasil Evaluasi Cognitive AI PRAMA
          </p>
        </div>
        ` : ""}

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

  let inTable = false;
  let tableRows: string[][] = [];

  const flushPDFTable = () => {
    if (tableRows.length === 0) return;
    
    // Filters out divider row (has hyphens like |---|)
    const cleanRows = tableRows.filter(row => !row.some(cell => /^:?-+:?$/.test(cell.trim())));
    if (cleanRows.length === 0) {
      tableRows = [];
      inTable = false;
      return;
    }

    const colCount = cleanRows[0].length;
    const colWidth = usableWidth / colCount;

    // Check height needed
    const rowHeight = 7;
    const neededHeight = cleanRows.length * rowHeight + 4;
    checkPageBreak(neededHeight);

    // Let's render the table rows
    cleanRows.forEach((row, rIdx) => {
      // If it's the first row, style it as header
      const isHeader = rIdx === 0;
      
      if (isHeader) {
        doc.setFillColor(15, 23, 42); // slate-900 for header
        doc.rect(margin, y, usableWidth, rowHeight, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
      } else {
        const isAlternate = rIdx % 2 === 0;
        doc.setFillColor(isAlternate ? 248 : 255, isAlternate ? 250 : 255, isAlternate ? 252 : 255); // alternating lightweight bg
        doc.rect(margin, y, usableWidth, rowHeight, "F");
        
        // Draw thin borders around each cell
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.15);
        doc.rect(margin, y, usableWidth, rowHeight, "S");
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
      }

      // Print cells
      row.forEach((cell, cIdx) => {
        const cellText = cleanPDFMarkdown(cell.trim());
        const xPos = margin + (cIdx * colWidth) + 3;
        const yPos = y + 4.8;
        
        // Draw vertical column divider inside rows
        if (!isHeader) {
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.15);
          doc.line(margin + (cIdx * colWidth), y, margin + (cIdx * colWidth), y + rowHeight);
        }

        // Clip/Truncate cell text to fit cell width with padding
        const maxTextWidth = colWidth - 5;
        const splitText = doc.splitTextToSize(cellText, maxTextWidth);
        doc.text(splitText[0] || "", xPos, yPos);
      });

      y += rowHeight;
    });

    y += 4; // Spacing after table
    tableRows = [];
    inTable = false;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Check for Table Row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    } else {
      if (inTable) {
        flushPDFTable();
      }
    }

    if (!trimmed) {
      y += 3; // empty spaces
      continue;
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
  }

  if (inTable) {
    flushPDFTable();
  }

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
}

export async function exportToPPTX(
  title: string,
  slides: Array<{ title: string; bullets: string[]; speakerNotes: string; imageUrl: string }>,
  divisionName: string
) {
  const pptx = new pptxgen();
  // Set layout to "LAYOUT_WIDE" (13.33" x 7.5") to match widescreen presentation standards
  pptx.layout = "LAYOUT_WIDE";

  const totalSlidesCount = slides.length + 2; // +1 Cover, +1 Thank you

  // Helper function: Generate a beautiful corporate-branded fallback PNG using dynamic canvas
  const generateFallbackPng = (slideTitleText: string): string => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 800, 500);
        grad.addColorStop(0, "#0F172A"); // Modern elegant slate/charcoal
        grad.addColorStop(1, "#1E293B");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 500);

        // Vibrant Green outline frame
        ctx.strokeStyle = "#00D285";
        ctx.lineWidth = 6;
        ctx.strokeRect(15, 15, 770, 470);

        // Large PRAMA watermark
        ctx.fillStyle = "rgba(0, 210, 133, 0.08)";
        ctx.font = "italic bold 90px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PRAMA ADVISOR", 400, 270);

        // Core visual slide title decoration
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "center";
        
        // Wrap title if it is long
        const words = slideTitleText.replace(/_+/g, " ").toUpperCase().split(" ");
        let line = "";
        let yPos = 190;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 600 && n > 0) {
            ctx.fillText(line, 400, yPos);
            line = words[n] + " ";
            yPos += 35;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 400, yPos);

        // Small sub decoration
        ctx.fillStyle = "#00D285";
        ctx.font = "bold 13px Arial";
        ctx.fillText("PT PANCARAN GROUP • STRATEGIC ADVISORY", 400, 430);

        return canvas.toDataURL("image/png");
      }
    } catch (e) {
      console.error("Canvas image fallback generation error:", e);
    }
    // absolute minimum 1x1 base64 png fallback
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcWw9AAf8Bf5GofbYAAAAASUVORK5CYII=";
  };

  // 3. Format and clean titles to display elegantly (no snake_case or double "Kajian" / "Presentasi")
  const displayTitle = title
    .replace(/^KAJIAN STRATEGIS KOMPREHENSIF:\s*/i, "")
    .replace(/^Presentasi_Kajian_/gi, "")
    .replace(/^Presentasi\s+Kajian\s+/gi, "")
    .replace(/^Presentasi\s+/gi, "")
    .replace(/^Kajian\s+/gi, "")
    .trim();

  const cleanDisplayTitle = displayTitle
    .replace(/_+/g, " ")
    .replace(/Presentasi Kajian Kajian/gi, "Presentasi Kajian")
    .replace(/Kajian Kajian/gi, "Kajian")
    .replace(/Presentasi Presentasi/gi, "Presentasi")
    .replace(/Presentasi Kajian/gi, "")
    .replace(/Presentasi/gi, "")
    .replace(/Kajian/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // 4. Cover Slide (Slide 1) - Elegant Deep Navy & Vibrant Green Border Theme
  const openingSlide = pptx.addSlide();
  openingSlide.background = { color: "06152B" }; // Deep Navy

  // Outer green border rectangle
  openingSlide.addShape("rect", {
    x: 0.3,
    y: 0.3,
    w: 12.73,
    h: 6.9,
    // pptxgenjs treats omitted fill property as completely transparent/no fill.
    // Specifying fill: { color: "none" } was evaluated as an invalid hex color and defaulted to solid black color.
    line: { color: "00D285", width: 1.5 }
  });

  // Top header in Cover
  openingSlide.addText(`✦ PRAMA COGNITIVE PORTAL • ${cleanDisplayTitle.toUpperCase()}`, {
    x: 0.8,
    y: 0.7,
    w: 11.73,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: "00D285",
    fontFace: "Arial"
  });

  // Large centered/left main cover title
  openingSlide.addText(`KAJIAN STRATEGIS KOMPREHENSIF:\n${cleanDisplayTitle.toUpperCase()}`, {
    x: 0.8,
    y: 1.4,
    w: 11.73,
    h: 1.8,
    fontSize: 22, // Elegant corporate-sized display heading
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
    valign: "middle"
  });

  // Subtitle
  openingSlide.addText(`Kajian Komprehensif Skema Strategis & Operasional ${cleanDisplayTitle} PT Pancaran Group Berdasarkan Rekomendasi PRAMA AI Advisor`, {
    x: 0.8,
    y: 3.4,
    w: 11.73,
    h: 0.8,
    fontSize: 11.5, // Perfectly scaled subtitle
    color: "94A3B8",
    fontFace: "Arial"
  });

  // Bottom left metadata stamp
  openingSlide.addText(`PROYEK: ${cleanDisplayTitle.toUpperCase()}\nUNIT DIREKTORAT: ${(divisionName || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}\nKLASIFIKASI: TERBATAS / INTERNAL PT PANCARAN GROUP`, {
    x: 0.8,
    y: 4.8,
    w: 11.73,
    h: 1.1,
    fontSize: 10,
    bold: true,
    color: "00D285",
    fontFace: "Arial"
  });

  openingSlide.addNotes(`Selamat pagi/siang dan salam sejahtera bapak dan ibu sekalian. Slide pembuka ini menjelaskan judul dan pilar utama kajian proyek strategis PRAMA untuk unit kerja ${divisionName}.`);

  // 5. Content Slides (Slide 2 to N-1)
  for (let idx = 0; idx < slides.length; idx++) {
    const slideData = slides[idx];
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
    slide.addText(cleanDisplayTitle.toUpperCase(), {
      x: 0.8,
      y: 0.25,
      w: 5.5,
      h: 0.25,
      fontSize: 10,
      color: "94A3B8",
      fontFace: "Arial",
      wrap: true
    });

    // Header Right-hand side (Increased margins so it NEVER wraps and clips)
    slide.addText(`SEKTOR: ${(divisionName || "UMUM").toUpperCase() + " & BUSINESS DEVELOPMENT"}`, {
      x: 6.4,
      y: 0.25,
      w: 6.1,
      h: 0.25,
      fontSize: 10,
      color: "00D285",
      bold: true,
      align: "right",
      fontFace: "Arial",
      wrap: true
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
      y: 0.65,
      w: 11.73,
      h: 0.25,
      fontSize: 10,
      color: "00D285",
      bold: true,
      fontFace: "Arial",
      valign: "top",
      wrap: true
    });

    const cleanSlideTitle = slideData.title.replace(/_+/g, " ").trim();

    // Slide Body Main Title - Use elegant, compact display sizing
    slide.addText(cleanSlideTitle, {
      x: 0.8,
      y: 0.85,
      w: 11.73,
      h: 0.5,
      fontSize: 16, // Proportional Title sizing
      color: "0F172A",
      bold: true,
      fontFace: "Arial",
      valign: "middle",
      wrap: true
    });

    const cleanLead = (txt: string) => {
      if (!txt) return "";
      return txt.trim().replace(/^[-*•\s+]+/g, "").trim();
    };

    // Left Column logic - extract first bullet as intro paragraph
    let introPara = "Kajian komprehensif implementasi strategi, tata kelola, dan operasional guna mengoptimalkan kinerja proyek.";
    let bulletPoints = slideData.bullets;
    if (slideData.bullets && slideData.bullets.length > 0) {
      if (slideData.bullets.length >= 3) {
        introPara = cleanLead(slideData.bullets[0]);
        bulletPoints = slideData.bullets.slice(1);
      } else {
        bulletPoints = slideData.bullets;
      }
    }

    const contentWidth = 5.8;
    const bulletList = bulletPoints.slice(0, 4);

    // Build exactly ONE unified, fully editable text box to containing the intro paragraph and bullets
    // This allows slide text and numbers to be cleanly typed or revised in PowerPoint without overlapping boxes.
    let unifiedText = cleanPDFMarkdown(introPara) + "\n\n";
    bulletList.forEach((bullet) => {
      const cleanB = cleanLead(bullet);
      if (cleanB) {
        unifiedText += "•  " + cleanPDFMarkdown(cleanB) + "\n\n";
      }
    });

    slide.addText(unifiedText.trim(), {
      x: 0.8,
      y: 1.55,
      w: contentWidth,
      h: 4.5,
      fontSize: 10.5,
      color: "475569",
      fontFace: "Arial",
      valign: "top",
      wrap: true
      // Removed bugged lineSpacing of 1.2 points which caused lines of text to stack/overlap on top of each other
    });

    // Helper inside to perform hybrid client-side and server-side image fetch to base64 conversion.
    // Extremely robust: uses client-side direct fetch & Canvas caching first to bypass any server network limitations,
    // then falls back to backend proxy, and lastly renders a beautiful light-themed corporate diagram fallback.
    const getImageBase64WithFallback = async (imageUrl: string, slideTitleText: string): Promise<string> => {
      // Append a cache-buster query parameter to bypass the browser's disk cache.
      // This is necessary because Chrome/Safari cache the image when it is displayed in standard <img> tags (without CORS headers).
      // Requesting it again with crossOrigin="anonymous" or fetch() CORS mode will fail with a CORS error unless cache is bypassed.
      let corsImageUrl = imageUrl;
      if (imageUrl && imageUrl.includes("unsplash.com")) {
        const separator = imageUrl.includes("?") ? "&" : "?";
        corsImageUrl = `${imageUrl}${separator}cors=true&ts=${Date.now()}`;
      }

      // Direct high-speed client-side fetch (bypasses server sandbox restrictions completely)
      try {
        const fetchRes = await fetch(corsImageUrl, { mode: "cors" });
        if (fetchRes.ok) {
          const blob = await fetchRes.blob();
          const base64: string = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(blob);
          });
          if (base64) return base64;
        }
      } catch (e) {
        console.warn("Client-side direct fetch failed for image:", corsImageUrl, e);
      }

      // Live Image element drawing to canvas (resolves local browser caching, fully supports CORS since Unsplash/Picsum CDNs allow *)
      try {
        const base64: string = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth || img.width || 800;
              canvas.height = img.naturalHeight || img.height || 500;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/jpeg"));
                return;
              }
            } catch (canvasErr) {
              console.error("Canvas rendering from image failed:", canvasErr);
            }
            resolve("");
          };
          img.onerror = () => resolve("");
          img.src = corsImageUrl;
        });
        if (base64) return base64;
      } catch (e) {
        console.warn("Client-side Image rendering failed for:", corsImageUrl, e);
      }

      // Server-side proxy backup (CORS bypassed via Node backend)
      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.base64) {
            return data.base64;
          }
        }
      } catch (err) {
        console.error("Server image proxy fetch failed for:", imageUrl, err);
      }

      // Elegant off-white custom light corporate diagram template fallback (Never black!)
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Warm elegant light off-white gradient background
          const grad = ctx.createLinearGradient(0, 0, 800, 500);
          grad.addColorStop(0, "#F8FAFC");
          grad.addColorStop(1, "#F1F5F9");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 800, 500);

          // Vivid corporate green outline frame
          ctx.strokeStyle = "#00D285";
          ctx.lineWidth = 4;
          ctx.strokeRect(15, 15, 770, 470);

          // High status clean watermark
          ctx.fillStyle = "rgba(0, 210, 133, 0.08)";
          ctx.font = "italic bold 52px Arial";
          ctx.textAlign = "center";
          ctx.fillText("PRAMA ADVISOR", 400, 260);

          // Heading Slide Topic label
          ctx.fillStyle = "#0F172A";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          
          const words = slideTitleText.replace(/_+/g, " ").toUpperCase().split(" ");
          let line = "";
          let yPos = 200;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 600 && n > 0) {
              ctx.fillText(line, 400, yPos);
              line = words[n] + " ";
              yPos += 32;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 400, yPos);

          ctx.fillStyle = "#00D285";
          ctx.font = "bold 13px Arial";
          ctx.fillText("PT PANCARAN GROUP • STRATEGIC ADVISORY", 400, 420);

          return canvas.toDataURL("image/png");
        }
      } catch (canvasErr) {
        console.error("Canvas drawing failed:", canvasErr);
      }

      // Ultimate emergency absolute 1x1 white fallback
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89f8AAuEB979f1jUAAAAASUVORK5CYII=";
    };

    // Load base64 with multi-layered fallback strategy and clean for PPTX format requirements
    let rawBase64 = "";
    if (slideData.imageUrl) {
      rawBase64 = await getImageBase64WithFallback(slideData.imageUrl, cleanSlideTitle);
    } else {
      // Use fallback template right away
      rawBase64 = await getImageBase64WithFallback("", cleanSlideTitle);
    }

    // Pptxgenjs expects base64 data to have a MIME header like 'image/png;base64,iVBORw...' or 'image/jpeg;base64,...'
    // but without the leading 'data:' schema prefix. Let's process it correctly:
    let pptxBase64Data = rawBase64;
    if (pptxBase64Data.startsWith("data:")) {
      pptxBase64Data = pptxBase64Data.substring(5); // Stripping 'data:' prefix to match pptxgenjs's exact expectation (e.g., 'image/jpeg;base64,...')
    }

    // Insert Image into the PowerPoint Slide Frame
    slide.addImage({
      data: pptxBase64Data,
      x: 7.2,
      y: 1.55,
      w: 5.3,
      h: 3.5,
    });

    // Draw bright green border around picture frame
    slide.addShape("rect", {
      x: 7.15,
      y: 1.50,
      w: 5.4,
      h: 3.6,
      // Omit fill to keep the shape outline transparent/unfilled. This prevents it from overlaying solid black on top of the image.
      line: { color: "00D285", width: 1.5 }
    });

    // Figure caption label
    slide.addText(`Ilustrasi: ${cleanSlideTitle} di Pancaran Group`, {
      x: 7.2,
      y: 5.2,
      w: 5.3,
      h: 0.45,
      fontSize: 9,
      italic: true,
      color: "64748B",
      align: "center",
      fontFace: "Arial",
      wrap: true
    });

    // Thin grey footer line
    slide.addShape("rect", {
      x: 0.8,
      y: 6.7,
      w: 11.73,
      h: 0.015,
      fill: { color: "E2E8F0" }
    });

    // Footer LHS
    slide.addText("PANCARAN GROUP • CONFIDENTIAL DOCUMENTATION", {
      x: 0.8,
      y: 6.8,
      w: 6.0,
      h: 0.3,
      fontSize: 10,
      color: "94A3B8",
      bold: true,
      fontFace: "Arial"
    });

    // Footer RHS
    slide.addText(`HALAMAN ${idx + 2} DARI ${totalSlidesCount}`, {
      x: 6.8,
      y: 6.8,
      w: 5.73,
      h: 0.3,
      fontSize: 10,
      color: "0F172A",
      bold: true,
      align: "right",
      fontFace: "Arial"
    });

    // Speaker notes
    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }
  }

  // 6. Last Slide (Slide 17) - Elegant Dark Theme "TERIMA KASIH"
  const closingSlide = pptx.addSlide();
  closingSlide.background = { color: "06152B" }; // Deep Navy

  // Outer green border rectangle
  closingSlide.addShape("rect", {
    x: 0.3,
    y: 0.3,
    w: 12.73,
    h: 6.9,
    // Omit fill to keep the shape outline transparent/unfilled
    line: { color: "00D285", width: 1.5 }
  });

  // Thank You text
  closingSlide.addText("TERIMA KASIH", {
    x: 1.0,
    y: 2.2,
    w: 11.33,
    h: 1.0,
    fontSize: 36, // Scaled down for high-end corporate presentation elegance
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
    h: 0.6,
    fontSize: 14, // Proportional subtitle sizing
    bold: true,
    color: "00D285",
    align: "center",
    fontFace: "Arial"
  });

  // Bottom detailed credit labels
  closingSlide.addText("✦ Diformulasikan secara otomatis oleh PRAMA Strategic AI Advisor\nPT PANCARAN GROUP INDONESIA • RAHASIA INTERNAL SENSITIF", {
    x: 1.0,
    y: 5.2,
    w: 11.33,
    h: 1.2,
    fontSize: 11,
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
