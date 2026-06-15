/**
 * PRAMA Document Exporter Utility
 * Handles pristine formatted exports of analysis reports to MS Word (DOCX-compatible) and PDF formats.
 */
import { jsPDF } from "jspdf";
import pptxgen from "pptxgenjs";
import { drawPramaCanvasIllustration, getCategoryFromTitle } from "./illustrationPainter";

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
      // Compact size so that it stays completely intact when embedding in MS Word as A4
      canvas.width = 800;
      canvas.height = 420;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const cat = getCategoryFromTitle(docTitle);

      // Safe roundrect draw utility
      const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        }
      };

      // Theme assignments based on category, clean & professional
      let themePrimary = "#1e3a8a"; // Default deep navy
      let themeAccent = "#10b981";  // Default green
      let themeSecondary = "#0284c7"; // Default sky blue
      let themeGlow = "#f0fdf4"; // Default mint backdrop
      let alertColor = "#8b5cf6"; // Default purple

      if (cat.id === "forestry") {
        themePrimary = "#064e3b";
        themeAccent = "#10b981";
        themeSecondary = "#047857";
        themeGlow = "#f0fdf4";
        alertColor = "#b45308";
      } else if (cat.id === "demography") {
        themePrimary = "#1e40af";
        themeAccent = "#0ea5e9";
        themeSecondary = "#f59e0b";
        themeGlow = "#eff6ff";
        alertColor = "#ef4444";
      } else if (cat.id === "logistics") {
        themePrimary = "#0f172a";
        themeAccent = "#0ea5e9";
        themeSecondary = "#2563eb";
        themeGlow = "#f0f9ff";
        alertColor = "#d97706";
      } else if (cat.id === "tech") {
        themePrimary = "#1e1b4b";
        themeAccent = "#06b6d4";
        themeSecondary = "#4f46e5";
        themeGlow = "#f5f3ff";
        alertColor = "#dc2626";
      } else if (cat.id === "finance") {
        themePrimary = "#1e1b4b";
        themeAccent = "#d97706";
        themeSecondary = "#2563eb";
        themeGlow = "#fffbeb";
        alertColor = "#16a34a";
      } else if (cat.id === "risk") {
        themePrimary = "#111827";
        themeAccent = "#e11d48";
        themeSecondary = "#7c3aed";
        themeGlow = "#fff5f5";
        alertColor = "#ea580c";
      } else {
        themePrimary = "#1e293b";
        themeAccent = "#0d9488";
        themeSecondary = "#0284c7";
        themeGlow = "#f0fdfa";
        alertColor = "#6366f1";
      }

      // Fill light clean gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 420);
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(0.3, themeGlow);
      bgGrad.addColorStop(0.7, themeGlow);
      bgGrad.addColorStop(1, "#ffffff");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 420);

      // Subtle abstract grid lines for blueprint aesthetic
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 1;
      for (let x = 40; x < 800; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 420); ctx.stroke();
      }
      for (let y = 40; y < 420; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
      }

      // Double elegant borders
      ctx.strokeStyle = themePrimary;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, 794, 414);

      ctx.strokeStyle = themeAccent;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(10, 10, 780, 400);

      // Drawing inline glyph vectors dynamically based on icons
      const drawGlyphIcon = (ix: number, iy: number, type: string, color: string) => {
        ctx.save();
        if (type === "leaf") {
          ctx.beginPath();
          ctx.moveTo(ix - 10, iy + 10);
          ctx.quadraticCurveTo(ix - 12, iy - 8, ix + 8, iy - 8);
          ctx.quadraticCurveTo(ix + 12, iy + 8, ix - 10, iy + 10);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix - 10, iy + 10);
          ctx.lineTo(ix + 8, iy - 8);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (type === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            ctx.lineTo(ix + 9 * Math.cos(angle), iy + 9 * Math.sin(angle));
            const nextAngle = ((i + 0.5) * 2 * Math.PI / 5) - Math.PI / 2;
            ctx.lineTo(ix + 4 * Math.cos(nextAngle), iy + 4 * Math.sin(nextAngle));
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "cloud") {
          ctx.beginPath();
          ctx.arc(ix - 4, iy + 2, 5, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(ix, iy - 3, 7, Math.PI, Math.PI * 2);
          ctx.arc(ix + 5, iy + 2, 5, Math.PI * 1.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "lightning") {
          ctx.beginPath();
          ctx.moveTo(ix + 2, iy - 10);
          ctx.lineTo(ix - 6, iy + 1);
          ctx.lineTo(ix - 1, iy + 1);
          ctx.lineTo(ix - 3, iy + 10);
          ctx.lineTo(ix + 6, iy - 1);
          ctx.lineTo(ix + 1, iy - 1);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "fuel") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 10);
          ctx.quadraticCurveTo(ix + 8, iy, ix, iy + 10);
          ctx.quadraticCurveTo(ix - 8, iy, ix, iy - 10);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "alert") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 10);
          ctx.lineTo(ix + 10, iy + 6);
          ctx.lineTo(ix - 10, iy + 6);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px Arial";
          ctx.textAlign = "center";
          ctx.fillText("!", ix, iy + 4);
        } else if (type === "shield") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 9);
          ctx.quadraticCurveTo(ix + 8, iy - 9, ix + 8, iy);
          ctx.quadraticCurveTo(ix + 8, iy + 6, ix, iy + 10);
          ctx.quadraticCurveTo(ix - 8, iy + 6, ix - 8, iy);
          ctx.quadraticCurveTo(ix - 8, iy - 9, ix, iy - 9);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "target") {
          ctx.beginPath();
          ctx.arc(ix, iy, 9, 0, 2 * Math.PI);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(ix, iy, 4, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "gear") {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(ix, iy, 9, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ix, iy, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(ix - 8, iy + 1, 4, 7);
          ctx.fillRect(ix - 1, iy - 3, 4, 11);
          ctx.fillRect(ix + 6, iy - 7, 4, 15);
        }
        ctx.restore();
      };

      // Determine the 6 Metric items and labels (Shortened, NO lists/paragraphs)
      const displayMetrics = cat.id === "forestry" ? [
        { title: "Lahan", icon: "leaf", color: "#10b981" },
        { title: "Sertifikat", icon: "star", color: "#eab308" },
        { title: "Karbon", icon: "cloud", color: "#0ea5e9" },
        { title: "Rute", icon: "gear", color: "#6366f1" },
        { title: "Kargo", icon: "chart", color: "#a855f7" },
        { title: "ESG", icon: "shield", color: "#065f46" }
      ] : cat.id === "demography" ? [
        { title: "Profil", icon: "target", color: "#1e40af" },
        { title: "Sensus", icon: "chart", color: "#10b981" },
        { title: "Sosial", icon: "alert", color: "#ef4444" },
        { title: "Sektor", icon: "gear", color: "#eab308" },
        { title: "Fasilitas", icon: "shield", color: "#6366f1" },
        { title: "KKM", icon: "leaf", color: "#0ea5e9" }
      ] : cat.id === "logistics" ? [
        { title: "Armada", icon: "lightning", color: "#eab308" },
        { title: "Solar", icon: "fuel", color: "#f43f5e" },
        { title: "Kapasitas", icon: "chart", color: "#10b981" },
        { title: "Akurasi", icon: "target", color: "#0284c7" },
        { title: "Mitigasi", icon: "alert", color: "#f97316" },
        { title: "Sopir", icon: "shield", color: "#3b82f6" }
      ] : cat.id === "tech" ? [
        { title: "API Latency", icon: "lightning", color: "#0ea5e9" },
        { title: "Throughput", icon: "target", color: "#6366f1" },
        { title: "Enkripsi", icon: "shield", color: "#10b981" },
        { title: "Database", icon: "chart", color: "#3b82f6" },
        { title: "Server", icon: "gear", color: "#a855f7" },
        { title: "Uptime", icon: "star", color: "#eab308" }
      ] : cat.id === "finance" ? [
        { title: "Margin", icon: "chart", color: "#10b981" },
        { title: "Capex", icon: "star", color: "#eab308" },
        { title: "Opex", icon: "alert", color: "#f43f5e" },
        { title: "Payback", icon: "target", color: "#3b82f6" },
        { title: "Audit", icon: "shield", color: "#0ea5e9" },
        { title: "Tax", icon: "star", color: "#6366f1" }
      ] : cat.id === "risk" ? [
        { title: "Prevensi", icon: "shield", color: "#10b981" },
        { title: "Alarm", icon: "lightning", color: "#eab308" },
        { title: "Regulasi", icon: "gavel", color: "#b45309" },
        { title: "Deviasi", icon: "alert", color: "#f43f5e" },
        { title: "Recovery", icon: "gear", color: "#0ea5e9" },
        { title: "Audit", icon: "target", color: "#3b82f6" }
      ] : [
        { title: "Efisiensi", icon: "gear", color: "#3b82f6" },
        { title: "Sinergi", icon: "chart", color: "#10b981" },
        { title: "Sikap", icon: "shield", color: "#6366f1" },
        { title: "Fokus", icon: "star", color: "#eab308" },
        { title: "Mitigasi", icon: "lightning", color: "#f97316" },
        { title: "Prama", icon: "leaf", color: "#059669" }
      ];

      // LEFT COLUMN: Metrics Matrix (Grid layout)
      // Height 280, width 320. Centered on x: 190.
      drawRoundRect(30, 40, 340, 275, 14);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Matrix header line
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "METRIK SEKTOR KEPENDUDUKAN" : "VALUASI METRIK SEKTOR UTAMA", 45, 68);

      const gridCols = [100, 200, 300];
      const gridRows = [140, 240];

      displayMetrics.forEach((item, idx) => {
        const rIdx = Math.floor(idx / 3);
        const cIdx = idx % 3;
        const imX = gridCols[cIdx];
        const imY = gridRows[rIdx];

        // Themed backdrop glow circles
        ctx.beginPath();
        ctx.arc(imX, imY, 24, 0, Math.PI * 2);
        ctx.fillStyle = themeGlow;
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Icon rendering
        drawGlyphIcon(imX, imY, item.icon, item.color);

        // Name
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.title, imX, imY + 41);
        ctx.textAlign = "left"; // reset
      });

      // RIGHT COLUMN: Beautiful interconnected pipeline of PANCA Pillars (Star / Flow Network)
      drawRoundRect(400, 40, 370, 275, 14);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = themePrimary;
      ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("ALUR INTEGRASI PILAR P-A-N-C-A", 420, 68);

      // We draw 5 pillars "P" "A" "N" "C" "A". 
      // Center of loop is (585, 175)
      const cx = 585;
      const cy = 175;
      const radius = 70;
      const angles = [
        -Math.PI / 2, // P (top)
        -Math.PI / 2 + (2 * Math.PI / 5), // A
        -Math.PI / 2 + (4 * Math.PI / 5), // N
        -Math.PI / 2 + (6 * Math.PI / 5), // C
        -Math.PI / 2 + (8 * Math.PI / 5)  // A
      ];

      const pancaLetters = ["P", "A", "N", "C", "A"];
      const pancaColors = ["#f43f5e", "#6366f1", "#eab308", "#10b981", "#f97316"];
      const pancaLabels = cat.id === "demography" 
        ? ["Pemetaan", "Akurasi", "Nilai", "Cepat", "Alokasi"]
        : ["Proteksi", "Akurasi", "Nilai", "Cepat", "Alokasi"];

      // Draw beautiful loop connector circles/lines with thick track arrow elements
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Clean dash highlight or ticks
      ctx.strokeStyle = themeAccent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Render the 5 nodes
      angles.forEach((angle, idx) => {
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);

        // Circle node backdrop
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fillStyle = pancaColors[idx];
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Letters
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(pancaLetters[idx], nx, ny + 5);

        // Labels placed radially or nicely offset
        // Offset outwards from the circle
        const ox = cx + (radius + 28) * Math.cos(angle);
        const oy = cy + (radius + 28) * Math.sin(angle) + 3;

        ctx.fillStyle = "#334155";
        ctx.font = "bold 9.5px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(pancaLabels[idx], ox, oy);
        ctx.textAlign = "left"; // reset
      });

      // DRAW BOTTOM FOOTER INFO STRIP
      drawRoundRect(30, 335, 740, 48, 10);
      ctx.fillStyle = themePrimary;
      ctx.fill();

      // Footer branding text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9.5px monospace";
      ctx.fillText("✦ PRAMA COGNITIVE BUSINESS ADVISOR MAP • VERIFIED ENTERPRISE MODEL • S-A-F-E BLUEPRINT", 48, 363);

      // Clean barcode
      ctx.fillStyle = themeAccent;
      const barcodeWidths = [1, 2, 4, 1, 3, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4];
      let bx = 650;
      for (let bw of barcodeWidths) {
        ctx.fillRect(bx, 351, bw, 16);
        bx += bw + 1.2;
      }

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
          <img src="${infographicUrl}" width="600" style="width: 6.25in; max-width: 100%; height: auto; border: 1px solid #cbd5e1; border-radius: 6px; display: block; margin: 0 auto;" alt="Peta Visual Strategis PRAMA" />
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

    // Helper inside to generate a pristine high-fidelity custom strategic illustration
    // fully client-side and zero-delay, using the Prama drawing engine.
    // This establishes 100% visual parity with the on-screen active web animations!
    const getImageBase64WithFallback = async (slideTitleText: string): Promise<string> => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 650;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Render a beautifully developed static frame of the target slide's category
          drawPramaCanvasIllustration(ctx, 1000, 650, slideTitleText, idx, 150);
          return canvas.toDataURL("image/png");
        }
      } catch (canvasErr) {
        console.error("Local PPT illustration drawing failed:", canvasErr);
      }
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP89f8AAuEB979f1jUAAAAASUVORK5CYII=";
    };

    // Generate custom illustration base64
    const rawBase64 = await getImageBase64WithFallback(cleanSlideTitle);

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
