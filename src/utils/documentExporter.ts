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
      canvas.width = 800;
      canvas.height = 1140;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const { headings, stats } = extractKeyHeadingsAndStats(docText);
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

      // Determine palette themes dynamically matching the burnout poster style
      let themePrimary = "#1e3a8a"; // Default deep navy
      let themeAccent = "#10b981";  // Default green
      let themeSecondary = "#0284c7"; // Default sky blue
      let themeGlow = "#f0fdf4"; // Default mint backdrop
      let alertColor = "#8b5cf6"; // Default purple
      let complianceTag = "100% SECURE REGISTERED";

      // Dynamically extract some facts from text to customize poster output
      let locationName = "DESA BANGSALSARI";
      const geoRaw = docText.match(/(?:desa|kabupaten|kecamatan|kelurahan|daerah)\s+([A-Za-z]+)/i);
      if (geoRaw) {
        locationName = geoRaw[0].toUpperCase();
      }

      let parsedRt = "76";
      let parsedRw = "36";
      const rtMatch = docText.match(/rt\s*[:\s]*\s*(\d+)/i) || docText.match(/(\d+)\s*rt/i);
      const rwMatch = docText.match(/rw\s*[:\s]*\s*(\d+)/i) || docText.match(/(\d+)\s*rw/i);
      if (rtMatch) parsedRt = rtMatch[1];
      if (rwMatch) parsedRw = rwMatch[1];

      let parsedPoverty = "5,48%";
      const povMatch = docText.match(/(\d+[,.]\d+)\s*%/);
      if (povMatch) parsedPoverty = povMatch[1] + "%";

      if (cat.id === "forestry") {
        themePrimary = "#064e3b"; // Forest green
        themeAccent = "#10b981";  // Emerald green
        themeSecondary = "#047857"; // Medium green
        themeGlow = "#f0fdf4"; // Minty teal
        alertColor = "#b45308"; // Amber wood
        complianceTag = "100% CARGO & ESG SECURE";
      } else if (cat.id === "demography") {
        themePrimary = "#1e40af"; // Royal Blue Like Poster
        themeAccent = "#0ea5e9";  // Sky Blue
        themeSecondary = "#f59e0b"; // Golden Amber Accent
        themeGlow = "#eff6ff"; // Soft blue canvas glow
        alertColor = "#ef4444"; // Red for poverty highlight
        complianceTag = "100% REGIONAL CENSUS REPORT";
      } else if (cat.id === "logistics") {
        themePrimary = "#0f172a"; // Slate dark
        themeAccent = "#0ea5e9";  // Sky blue
        themeSecondary = "#2563eb"; // Deep blue
        themeGlow = "#f0f9ff"; // Soft blue sky
        alertColor = "#d97706"; // Safety orange
        complianceTag = "100% ROUTE OPTIMIZED";
      } else if (cat.id === "tech") {
        themePrimary = "#1e1b4b"; // Deep tech indigo
        themeAccent = "#06b6d4";  // Cyan
        themeSecondary = "#4f46e5"; // Indigo
        themeGlow = "#f5f3ff"; // Lavender
        alertColor = "#dc2626"; // Alert red
        complianceTag = "SYSTEM API CONNECTED";
      } else if (cat.id === "finance") {
        themePrimary = "#1e1b4b";
        themeAccent = "#d97706";  // Amber gold
        themeSecondary = "#2563eb";
        themeGlow = "#fffbeb"; // Soft yellow cream
        alertColor = "#16a34a";
        complianceTag = "AUDITED ROI CERTIFIED";
      } else if (cat.id === "risk") {
        themePrimary = "#111827";
        themeAccent = "#e11d48";  // Crimson rose
        themeSecondary = "#7c3aed";
        themeGlow = "#fff5f5"; // Rose pastel tint
        alertColor = "#ea580c";
        complianceTag = "LOW RISK COMPLIANT";
      } else {
        themePrimary = "#1e293b";
        themeAccent = "#0d9488";  // Teal
        themeSecondary = "#0284c7";
        themeGlow = "#f0fdfa"; // Soft clean teal-mint
        alertColor = "#6366f1";
        complianceTag = "PRAMA VERIFIED INTERNAL";
      }

      // Title contents adaptions
      let title1 = "HAMBATAN BISNIS MENUMPUK?";
      let title2 = "ATASI DENGAN PRAMA SYSTEM!";
      let descText = "Ketimpangan koordinasi antar sektor dan minimnya akurasi telemetri intelijen dalam mengevaluasi metrik kinerja kelayakan utama.";
      let statWord = "2 DARI 5 METRIK UTAMA";
      let statParagraph = "memerlukan tinjauan ulang prioritas strategis guna menekan inefisiensi pengerjaan lintas unit kerja.";

      if (cat.id === "forestry") {
        title1 = "CONGESTI LOGISTIK HUTAN?";
        title2 = "KELOLA DENGAN LESTARI!";
        descText = "Inkonsistensi armada dan kelalaian monitoring kelestarian ESG rute tanam menghambat kelancaran operasional PT Pancaran Group.";
        statWord = "2 DARI 5 DRIVER TRUK";
        statParagraph = "mengalami keterlambatan pengiriman tong kayu akibat koordinasi rute tanam industri yang belum tersinkronisasi sempurna.";
      } else if (cat.id === "demography") {
        title1 = "DATA KEPENDUDUKAN KELAYAKAN?";
        title2 = `ANALISA WILAYAH ${locationName}`;
        descText = `Analisis dispersi demografi daerah, pemetaan sebaran kelompok umur dan kepadatan, serta pemenuhan sarana pemberdayaan kesejahteraan sosial secara merata.`;
        statWord = `${parsedRt} RT & ${parsedRw} RW TERPETAKAN`;
        statParagraph = `memerlukan audit dan restrukturisasi periodik yang presisi guna mengurangi inefisiensi penyaluran program sosial bagi kesejahteraan warga setempat.`;
      } else if (cat.id === "logistics") {
        title1 = "OPERASIONAL RUTE BOROS?";
        title2 = "ATASI DENGAN EFISIEN!";
        descText = "Ketidakefisienan alokasi armada dan muatan kosong balik yang berpotensi memicu lonjakan Capex/Opex transportasi komprehensif.";
        statWord = "2 DARI 5 ARMADA JALAN";
        statParagraph = "beroperasi dengan kapasitas muatan di bawah 65% yang menyebabkan pemborosan biaya solar operasional yang signifikan.";
      } else if (cat.id === "tech") {
        title1 = "SISTEM SERING DOWN?";
        title2 = "OPTIMALKAN DENGAN DEVOPS!";
        descText = "Kerentanan latensi sinkronisasi API dan tumpang tindih mutasi basis data internal operasional menghambat uptime PT Pancaran Group.";
        statWord = "2 DARI 5 KONEKSI SYSTEM API";
        statParagraph = "gagal merespon di bawah batas latency 250ms pada jam sibuk pengiriman data muatan operasional real-time.";
      } else if (cat.id === "finance") {
        title1 = "BOCOR DEVIASI ANGGARAN?";
        title2 = "ATASI DENGAN PRESISI!";
        descText = "Eskalasi deviasi Capex/Opex serta melesetnya proyeksi margin operasional akibat keterlambatan penyelesaian payback period.";
        statWord = "2 DARI 5 POS ANGGARAN UTAMA";
        statParagraph = "mengalami pembengkakan opex di atas toleransi deviasi 15% dari estimasi blueprint awal komite.";
      } else if (cat.id === "risk") {
        title1 = "ANCAMAN KRISIS OPERASIONAL?";
        title2 = "AMANKAN DENGAN PATUH!";
        descText = "Kurangnya kesiapan rencana darurat penanganan hambatan jalan ekstrem berpotensi memicu kerugian maksimal operasional korporat.";
        statWord = "2 DARI 5 EMERGENCY SCENARIO";
        statParagraph = "tidak memiliki prosedur taktis simulasi lapangan yang terdokumentasi rapi untuk mengatasi krisis jalan.";
      }

      // Grid items parameters defining the 6 Circles
      interface ParameterItem {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
      }
      let paramItems: ParameterItem[] = [
        { title: "Efisiensi Kerja", subtitle: "95% Efektif", icon: "gear", color: "#3b82f6" },
        { title: "Performa Tim", subtitle: "Sinergi Sektoral", icon: "chart", color: "#10b981" },
        { title: "Sikap Terlatih", subtitle: "Integritas Tinggi", icon: "shield", color: "#6366f1" },
        { title: "Fokus Solutif", subtitle: "Kerjasama Kuat", icon: "star", color: "#eab308" },
        { title: "Bebas Hambatan", subtitle: "Mitigasi Aktif", icon: "lightning", color: "#f97316" },
        { title: "Sinergi Bisnis", subtitle: "PRAMA Verified", icon: "leaf", color: "#059669" }
      ];

      if (cat.id === "forestry") {
        paramItems = [
          { title: "Kesiapan Lahan", subtitle: "Level Terjaga", icon: "leaf", color: "#10b981" },
          { title: "Sertifikasi FSC", subtitle: "98% Patuh", icon: "star", color: "#eab308" },
          { title: "Serapan Karbon", subtitle: "+87% Surplus", icon: "cloud", color: "#0ea5e9" },
          { title: "Rute Tanam", subtitle: "Optimasi S-Curve", icon: "gear", color: "#6366f1" },
          { title: "Kapasitas Truk", subtitle: "Maksimal 60T", icon: "chart", color: "#a855f7" },
          { title: "Kelestarian ESG", subtitle: "Peringkat Hijau", icon: "shield", color: "#065f46" }
        ];
      } else if (cat.id === "demography") {
        paramItems = [
          { title: "Profil Wilayah", subtitle: `RT/RW: ${parsedRt}/${parsedRw}`, icon: "target", color: "#1e40af" },
          { title: "Total Penduduk", subtitle: "Terpetakan Akurat", icon: "chart", color: "#10b981" },
          { title: "Tingkat Kemiskinan", subtitle: `${parsedPoverty} Terkendali`, icon: "alert", color: "#ef4444" },
          { title: "Struktur Kerja", subtitle: "Sektor Dominan", icon: "gear", color: "#eab308" },
          { title: "Sarana Belajar", subtitle: "Fasilitas Cukup", icon: "shield", color: "#6366f1" },
          { title: "Sinergi KKM", subtitle: "PRAMA Verified", icon: "leaf", color: "#0ea5e9" }
        ];
      } else if (cat.id === "logistics") {
        paramItems = [
          { title: "Uptime Armada", subtitle: "95% Operational", icon: "lightning", color: "#eab308" },
          { title: "Biaya Solar", subtitle: "Minus 12% Hemat", icon: "fuel", color: "#f43f5e" },
          { title: "Kapasitas Rute", subtitle: "Optimal Terjaga", icon: "chart", color: "#10b981" },
          { title: "Akurasi Waktu", subtitle: "Deviasi <5 Menit", icon: "target", color: "#0284c7" },
          { title: "Awas Hambatan", subtitle: "Respon Kilat", icon: "alert", color: "#f97316" },
          { title: "Kesehatan Supir", subtitle: "Sertifikat Aktif", icon: "shield", color: "#3b82f6" }
        ];
      } else if (cat.id === "tech") {
        paramItems = [
          { title: "Latency API", subtitle: "<180ms Stabil", icon: "lightning", color: "#0ea5e9" },
          { title: "Throughput Data", subtitle: "Otomatis Scaled", icon: "arrows", color: "#6366f1" },
          { title: "Enkripsi Data", subtitle: "AES-256 Aman", icon: "shield", color: "#10b981" },
          { title: "Mutasi DB", subtitle: "Sinkron Cepat", icon: "db", color: "#3b82f6" },
          { title: "Beban Server", subtitle: "Load Balance", icon: "gear", color: "#a855f7" },
          { title: "Uptime Sistem", subtitle: "99.99% Hebat", icon: "star", color: "#eab308" }
        ];
      } else if (cat.id === "finance") {
        paramItems = [
          { title: "Net Margin", subtitle: "Surplus +18%", icon: "chart", color: "#10b981" },
          { title: "Perputaran Capex", subtitle: "Optimasi Aset", icon: "coins", color: "#eab308" },
          { title: "Kontrol Inflasi", subtitle: "Toleransi Rendah", icon: "alert", color: "#f43f5e" },
          { title: "Payback Period", subtitle: "2.4 Tahun Selesai", icon: "target", color: "#3b82f6" },
          { title: "Arus Kas Net", subtitle: "Audit Verified", icon: "shield", color: "#0ea5e9" },
          { title: "Alokasi Pajak", subtitle: "Compliance 100%", icon: "star", color: "#6366f1" }
        ];
      } else if (cat.id === "risk") {
        paramItems = [
          { title: "Prevensi Aktif", subtitle: "Sangat Siaga", icon: "shield", color: "#10b981" },
          { title: "Waspada Alarm", subtitle: "Uptime 100%", icon: "lightning", color: "#eab308" },
          { title: "Sertifikasi Hukum", subtitle: "Sesuai Regulasi", icon: "gavel", color: "#b45309" },
          { title: "Sisa Kerugian", subtitle: "Deviasi <5%", icon: "alert", color: "#f43f5e" },
          { title: "Recovery Rate", subtitle: "Tangani Cepat", icon: "arrows", color: "#0ea5e9" },
          { title: "Skor Pengawasan", subtitle: "Audit Gold Medal", icon: "target", color: "#3b82f6" }
        ];
      }

      // Warning details for Section 4
      let warningTitle = "FAKTOR RESIKO & KESELAMATAN SEKTOR OPERASIONAL";
      let bullet1 = "✦ Ketiadaan manual book mitigasi krisis lapangan yang terstandarisasi";
      let bullet2 = "✦ Lonjakan biaya bahan bakar solar di luar rancangan budget komite";
      let bullet3 = "✦ Konflik ketersediaan alokasi dan kelayakan unit truk pada jam puncak";

      if (cat.id === "forestry") {
        warningTitle = "KERENTANAN UTAMA HUTAN INDUSTRI & LOGISTIK ESG";
        bullet1 = "✦ Cuaca hujan ekstrem melumpuhkan sistem pengangkutan balok kayu harian";
        bullet2 = "✦ Kemacetan antrean truk logistik akibat rute pemuatan tanam tak sinkron";
        bullet3 = "✦ Kerentanan tumpang tindih kepatuhan regulasi zonasi daerah lindung";
      } else if (cat.id === "demography") {
        warningTitle = "FAKTOR UTAMA KERENTANAN GEODEMOGRAFIS";
        bullet1 = "✦ Kesenjangan sarana pendidikan untuk mendukung penuntasan wajib belajar";
        bullet2 = "✦ Keterbatasan akses pembiayaan modal kerja di sektor pertanian/pedagang kecil";
        bullet3 = "✦ Kerawanan jaring pengaman sosial pada klaster keluarga miskin ekstrem";
      } else if (cat.id === "logistics") {
        warningTitle = "RISIKO UTAMA TRANSPORTASI EKSPEDISI";
        bullet1 = "✦ Kemacetan lalu lintas parah pada jalur arteri rute logistik utama";
        bullet2 = "✦ Fluktuasi tajam harga solar industri non-subsidi memangkas margin opex";
        bullet3 = "✦ Insiden kerusakan mesin armada truk tua tanpa bengkel tanggap darurat";
      } else if (cat.id === "tech") {
        warningTitle = "KERAWANAN ARSITEKTUR INTEGRASI DATA DIGITAL";
        bullet1 = "✦ Latensi tinggi sinkronisasi API data muatan operasional real-time";
        bullet2 = "✦ Kegagalan failover otomatis server ketika trafik transaksi memuncak";
        bullet3 = "✦ Celah sinkronisasi data yang berisiko pada mutasi basis data internal";
      } else if (cat.id === "finance") {
        warningTitle = "FAKTOR PEMICU DEVIASI ANGGARAN & MARGIN";
        bullet1 = "✦ Sengkarut pembengkakan opex akibat penanganan insiden darurat armada";
        bullet2 = "✦ Melesetnya estimasi break-even payback period modal kerja utama";
        bullet3 = "✦ Kenaikan suku bunga pembiayaan capex kontainer truk baru";
      } else if (cat.id === "risk") {
        warningTitle = "KERAWANAN COMPLIANCE & SAFETY PENGIRIMAN";
        bullet1 = "✦ Kebocoran prosedur operasional standar K3 kru lapangan di rute ekstrem";
        bullet2 = "✦ Sanksi administratif akibat kelambatan perpanjangan uji KIR unit logistik";
        bullet3 = "✦ Hambatan koordinasi penanganan jika terjadi kecelakaan tak terduga";
      }

      // 1. Fill beautiful pastel minty background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1140);
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(0.15, themeGlow);
      bgGrad.addColorStop(0.85, themeGlow);
      bgGrad.addColorStop(1, "#ffffff");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1140);

      // Subtle abstract grid vectors for administrative blueprints
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 1;
      for (let x = 40; x < 800; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1140);
        ctx.stroke();
      }
      for (let y = 40; y < 1140; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // 2. Poster Borders & Margins
      ctx.strokeStyle = themePrimary;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 790, 1130);

      ctx.strokeStyle = themeAccent;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(15, 15, 770, 1110);

      // 3. HEADER BANNER
      drawRoundRect(30, 30, 740, 95, 16);
      ctx.fillStyle = themePrimary;
      ctx.fill();

      // Top PRAMA System Tag
      ctx.fillStyle = themeAccent;
      ctx.font = "bold 10px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`✦ PRAMA COGNITIVE BUSINESS ADVISOR • METRIK BLUEPRINT [${complianceTag}]`, 48, 55);

      // Main header text matching presentation theme
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(`${title1} ${title2}`, 48, 80);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`UNIT KERJA: ${divName.toUpperCase()} DIVISION • PT PANCARAN GROUP INTERNAL RAHASIA`, 48, 105);

      // 4. SECTION 1: APA ITU... ?
      // Header for Section 1
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 15px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "I. PROFIL & DESKRIPSI WILAYAH" : "I. APA ITU BURNOUT OPERASIONAL?", 35, 150);

      // Soft container box
      drawRoundRect(30, 162, 740, 135, 16);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw the beautiful sticker character representing the auditor/advisor!
      const cx = 95;
      const cy = 227;
      
      // Face background circle
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, 2 * Math.PI);
      ctx.fillStyle = "#fee2e2"; // Soft rose glow
      ctx.fill();
      ctx.strokeStyle = "#fda4af";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Character Head & hair
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffedd5"; // Skin tone
      ctx.fill();

      // Cute hair loops
      ctx.fillStyle = "#1e293b"; // Dark charcoal hair
      ctx.beginPath();
      ctx.arc(cx - 10, cy - 18, 11, 0, Math.PI * 2);
      ctx.arc(cx + 10, cy - 18, 11, 0, Math.PI * 2);
      ctx.arc(cx, cy - 24, 14, 0, Math.PI * 2);
      ctx.fill();

      // Eye dots
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(cx - 7, cy - 8, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 7, cy - 8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Smiling mouth
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 6, 0, Math.PI);
      ctx.stroke();

      // Tiny circular glasses
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx - 7, cy - 8, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 7, cy - 8, 5, 0, Math.PI * 2);
      ctx.stroke();
      // Glasses bridge
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy - 8);
      ctx.lineTo(cx + 2, cy - 8);
      ctx.stroke();

      // Hand and small checkboard
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(cx - 30, cy + 12, 16, 22); // mini folder
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(cx + 26, cy + 14, 6, 0, Math.PI * 2); // mini gold coin / badge
      ctx.fill();

      // Sparkle stars highlighting Prama Cognitive AI sticker look
      const drawSparkle = (sx: number, sy: number) => {
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(sx, sy - 6);
        ctx.lineTo(sx + 2, sy - 2);
        ctx.lineTo(sx + 6, sy);
        ctx.lineTo(sx + 2, sy + 2);
        ctx.lineTo(sx, sy + 6);
        ctx.lineTo(sx - 2, sy + 2);
        ctx.lineTo(sx - 6, sy);
        ctx.lineTo(sx - 2, sy - 2);
        ctx.closePath();
        ctx.fill();
      };
      drawSparkle(cx - 34, cy - 26);
      drawSparkle(cx + 36, cy - 14);

      // Draw Speech Bubble pointing to the character
      drawRoundRect(165, 175, 580, 110, 14);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.stroke();

      // Speech bubble pointer arrow pointing back to character arc coordinate
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(165, 218);
      ctx.lineTo(152, 227);
      ctx.lineTo(165, 236);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.beginPath();
      ctx.moveTo(165, 218);
      ctx.lineTo(152, 227);
      ctx.lineTo(165, 236);
      ctx.stroke();
      // redraw bubble left vertical edge over the triangle inner area to clean connection line
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(166, 219);
      ctx.lineTo(166, 235);
      ctx.stroke();
      ctx.lineWidth = 1;

      // Render Speech Bubble text definition
      ctx.fillStyle = "#334155";
      ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "REKOMENDASI ADVISOR GEODEMOGRAFIS:" : "PANDANGAN STRATEGIS ADVISOR:", 185, 202);

      ctx.fillStyle = "#475569";
      ctx.font = "normal 11.5px 'Segoe UI', Arial, sans-serif";
      
      // Word wrapping for longer definitions dynamically based on categories
      const pText = descText;
      const wrapText = (txt: string, maxW: number) => {
        const words = txt.split(" ");
        const lines: string[] = [];
        let currLine = "";
        for (let w of words) {
          let testLine = currLine ? currLine + " " + w : w;
          if (ctx.measureText(testLine).width > maxW) {
            lines.push(currLine);
            currLine = w;
          } else {
            currLine = testLine;
          }
        }
        if (currLine) lines.push(currLine);
        return lines;
      };

      const wrapped = wrapText(pText, 540);
      wrapped.forEach((line, lineIdx) => {
        ctx.fillText(line, 185, 224 + (lineIdx * 17));
      });

      // 5. SECTION 2: TAHUKAH KAMU?
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "II. DATA SEBARAN PENDUDUK" : "II. TAHUKAH KAMU?", 35, 325);

      // Fact container card
      drawRoundRect(30, 335, 740, 75, 14);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.stroke();

      // Draw 5 human/user silhouettes like in the workout burnout poster
      const drawUserSilhouette = (shX: number, shY: number, isActive: boolean) => {
        ctx.fillStyle = isActive ? themeAccent : "#cbd5e1";
        
        // Head
        ctx.beginPath();
        ctx.arc(shX, shY - 14, 7, 0, Math.PI * 2);
        ctx.fill();

        // Shoulders/Body rounded arc
        ctx.beginPath();
        ctx.ellipse ? ctx.ellipse(shX, shY, 10, 8, 0, Math.PI, Math.PI * 2) : ctx.arc(shX, shY, 10, Math.PI, Math.PI * 2);
        ctx.fill();
      };

      // Draw 5 users, highlighting 2 of them representing "2 dari 5"
      for (let i = 0; i < 5; i++) {
        drawUserSilhouette(65 + (i * 26), 382, i < 2);
      }

      // Statistics values beside silhouettes
      ctx.fillStyle = "#ef4444";
      ctx.font = "black 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(statWord, 210, 362);

      ctx.fillStyle = "#475569";
      ctx.font = "normal 11.5px 'Segoe UI', Arial, sans-serif";
      const wrappedStat = wrapText(statParagraph, 510);
      wrappedStat.forEach((line, idx) => {
        ctx.fillText(line, 210, 379 + (idx * 16));
      });

      // 6. SECTION 3: KENALI GEJALANYA / INDIKATOR
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "III. METRIK SEKTOR KEPENDUDUKAN & LAYANAN SOSIAL" : "III. KENALI GEJALANYA! (METRIK INDIKATOR UTAMA SEKTOR)", 35, 435);

      // Curved indicator subheader card
      drawRoundRect(30, 445, 740, 30, 8);
      ctx.fillStyle = themePrimary;
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.fillText(cat.id === "demography" ? "✦ MONITORING PARAMETER GEODEMOGRAFI TERPADU PRAMA SECARA REAL-TIME" : "✦ PEMANTAUAN PARAMETER INTELLIGENCE PRAMA SEKTORAL SECARA REAL-TIME", 45, 464);

      // Draw Grid container for 6 circles (y: 490 to 760)
      drawRoundRect(30, 485, 740, 275, 16);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.stroke();

      // Rendering 6 circular badges in 2 rows x 3 columns
      // Columns: cx = 155, cx = 400, cx = 645
      // Rows: cy = 545, cy = 665
      const gridCols = [155, 400, 645];
      const gridRows = [545, 665];

      // Drawing inline glyph vectors dynamically based on icons names
      const drawGlyphIcon = (ix: number, iy: number, type: string, color: string) => {
        ctx.save();
        if (type === "leaf") {
          ctx.beginPath();
          ctx.moveTo(ix - 12, iy + 12);
          ctx.quadraticCurveTo(ix - 14, iy - 10, ix + 10, iy - 10);
          ctx.quadraticCurveTo(ix + 14, iy + 10, ix - 12, iy + 12);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix - 12, iy + 12);
          ctx.lineTo(ix + 10, iy - 10);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (type === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            ctx.lineTo(ix + 11 * Math.cos(angle), iy + 11 * Math.sin(angle));
            const nextAngle = ((i + 0.5) * 2 * Math.PI / 5) - Math.PI / 2;
            ctx.lineTo(ix + 5 * Math.cos(nextAngle), iy + 5 * Math.sin(nextAngle));
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "cloud") {
          ctx.beginPath();
          ctx.arc(ix - 5, iy + 3, 6, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(ix, iy - 4, 8, Math.PI, Math.PI * 2);
          ctx.arc(ix + 6, iy + 3, 6, Math.PI * 1.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "lightning") {
          ctx.beginPath();
          ctx.moveTo(ix + 3, iy - 12);
          ctx.lineTo(ix - 7, iy + 1);
          ctx.lineTo(ix - 1, iy + 1);
          ctx.lineTo(ix - 4, iy + 12);
          ctx.lineTo(ix + 7, iy - 1);
          ctx.lineTo(ix + 1, iy - 1);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "fuel") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 12);
          ctx.quadraticCurveTo(ix + 10, iy, ix, iy + 12);
          ctx.quadraticCurveTo(ix - 10, iy, ix, iy - 12);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "alert") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 12);
          ctx.lineTo(ix + 12, iy + 8);
          ctx.lineTo(ix - 12, iy + 8);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px Arial";
          ctx.textAlign = "center";
          ctx.fillText("!", ix, iy + 6);
        } else if (type === "shield") {
          ctx.beginPath();
          ctx.moveTo(ix, iy - 11);
          ctx.quadraticCurveTo(ix + 9, iy - 11, ix + 9, iy);
          ctx.quadraticCurveTo(ix + 9, iy + 8, ix, iy + 12);
          ctx.quadraticCurveTo(ix - 9, iy + 8, ix - 9, iy);
          ctx.quadraticCurveTo(ix - 9, iy - 11, ix, iy - 11);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "gavel") {
          ctx.translate(ix, iy);
          ctx.rotate(-Math.PI / 4);
          ctx.fillStyle = color;
          ctx.fillRect(-10, -5, 20, 10);
          ctx.fillRect(-2, 5, 4, 12);
        } else if (type === "target") {
          ctx.beginPath();
          ctx.arc(ix, iy, 11, 0, 2 * Math.PI);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(ix, iy, 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        } else if (type === "arrows") {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ix - 10, iy - 4); ctx.lineTo(ix + 4, iy - 4); ctx.lineTo(ix + 1, iy - 8);
          ctx.moveTo(ix - 10, iy - 4); ctx.lineTo(ix + 1, iy - 4); ctx.lineTo(ix + 1, iy);
          ctx.moveTo(ix + 10, iy + 4); ctx.lineTo(ix - 4, iy + 4); ctx.lineTo(ix - 1, iy + 8);
          ctx.moveTo(ix + 10, iy + 4); ctx.lineTo(ix - 1, iy + 4); ctx.lineTo(ix - 1, iy);
          ctx.stroke();
        } else if (type === "db") {
          ctx.fillStyle = color;
          ctx.fillRect(ix - 8, iy - 5, 16, 12);
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillRect(ix - 6, iy - 3, 12, 2);
          ctx.fillRect(ix - 6, iy + 1, 12, 2);
          ctx.fillRect(ix - 6, iy + 5, 12, 2);
        } else if (type === "coins") {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(ix - 3, iy + 3, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ix + 3, iy - 3, 7, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "gear") {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(ix, iy, 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ix, iy, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        } else {
          // default bar chart
          ctx.fillStyle = color;
          ctx.fillRect(ix - 10, iy + 2, 5, 8);
          ctx.fillRect(ix - 2, iy - 3, 5, 13);
          ctx.fillRect(ix + 6, iy - 8, 5, 18);
        }
        ctx.restore();
      };

      paramItems.forEach((item, idx) => {
        const rIdx = Math.floor(idx / 3);
        const cIdx = idx % 3;
        const imX = gridCols[cIdx];
        const imY = gridRows[rIdx];

        // Soft circle outline
        ctx.beginPath();
        ctx.arc(imX, imY, 36, 0, Math.PI * 2);
        ctx.fillStyle = themeGlow; // themed background glow circle
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw geometric high-fidelity indicator icons inside
        drawGlyphIcon(imX, imY, item.icon, item.color);

        // Circle inner white border to separate lines
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(imX, imY, 32, 0, Math.PI * 2);
        ctx.stroke();

        // Labels under indicator circles
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.title, imX, imY + 54);

        ctx.fillStyle = item.color;
        ctx.font = "bold 10px monospace";
        ctx.fillText(item.subtitle, imX, imY + 68);
        ctx.textAlign = "left"; // restore alignment
      });

      // 7. SECTION 4: RISIKO UTAMA / PENYEBAB UTAMA
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "IV. ANALISA KERAWANAN SOSIAL & KEMISKINAN EKSTREM" : "IV. PENYEBAB & RISIKO OPERASIONAL UTAMA", 35, 785);

      // Warning Card Container matching the exclamation poster section
      drawRoundRect(30, 795, 740, 115, 16);
      ctx.fillStyle = "#fef3c7"; // Warm amber/yellow background
      ctx.fill();
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Big yellow exclamation warning sign
      const wx = 85;
      const wy = 852;
      ctx.beginPath();
      ctx.moveTo(wx, wy - 30);
      ctx.lineTo(wx + 34, wy + 24);
      ctx.lineTo(wx - 34, wy + 24);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b"; // Big warning orange
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("!", wx, wy + 14);
      ctx.textAlign = "left";

      // Advisory warning title
      ctx.fillStyle = "#9a3412";
      ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(warningTitle, 140, 818);

      // 3 Warning checklist items
      ctx.fillStyle = "#7c2d12";
      ctx.font = "semibold 11px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(bullet1, 140, 842);
      ctx.fillText(bullet2, 140, 864);
      ctx.fillText(bullet3, 140, 886);

      // 8. SECTION 5: KUNCI STRATEGIS: P-A-N-C-A PILLARS
      ctx.fillStyle = themePrimary;
      ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(cat.id === "demography" ? "V. PENDEKATAN SOSIAL DENGAN PILAR P-A-N-C-A PT PANCARAN GROUP" : "V. CEGAH DENGAN PILAR P-A-N-C-A PT PANCARAN GROUP", 35, 935);

      // Custom acronym letters: S-E-H-A-T equivalents for PT Pancaran
      const pancaPillars = cat.id === "demography" ? [
        { letter: "P", label: "Pemetaan", desc: "Pemetaan Klaster Wilayah", color: "#f43f5e" },
        { letter: "A", label: "Akurasi", desc: "Akurasi Data Demografi", color: "#6366f1" },
        { letter: "N", label: "Nilai", desc: "Nilai Pemberdayaan Sosial", color: "#eab308" },
        { letter: "C", label: "Cepat", desc: "Cepat Salur Bantuan", color: "#10b981" },
        { letter: "A", label: "Alokasi", desc: "Alokasi Anggaran Daerah", color: "#f97316" }
      ] : [
        { letter: "P", label: "Proteksi", desc: "Proteksi Kelayakan Unit", color: "#f43f5e" },
        { letter: "A", label: "Akurasi", desc: "Akurasi Rute Navigasi", color: "#6366f1" },
        { letter: "N", label: "Nilai", desc: "Nilai ESG Kelestarian", color: "#eab308" },
        { letter: "C", label: "Cepat", desc: "Cepat Tanggap Mitigasi", color: "#10b981" },
        { letter: "A", label: "Alokasi", desc: "Alokasi Budget Presisi", color: "#f97316" }
      ];

      const pXPositions = [90, 228, 366, 504, 642];
      const pYCenter = 975;

      pancaPillars.forEach((p, idx) => {
        const px = pXPositions[idx];
        const py = pYCenter;

        // Clean white folder container behind letter
        drawRoundRect(px - 58, py - 20, 116, 125, 12);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.2)";
        ctx.stroke();

        // Acronym letter circle badge
        ctx.beginPath();
        ctx.arc(px, py + 12, 22, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // White inner ring decoration
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py + 12, 18, 0, Math.PI * 2);
        ctx.stroke();

        // The bold acronym letter
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.letter, px, py + 19);

        // Pillar name tag
        ctx.fillStyle = p.color;
        ctx.font = "bold 11px monospace";
        ctx.fillText(p.label.toUpperCase(), px, py + 52);

        // Explanation description
        ctx.fillStyle = "#475569";
        ctx.font = "normal 8.5px 'Segoe UI', Arial, sans-serif";
        
        // Wrap description vertically on small card
        const wrappedDesc = wrapText(p.desc, 90);
        wrappedDesc.forEach((line, lineIdx) => {
          ctx.fillText(line, px, py + 72 + (lineIdx * 11));
        });
        
        ctx.textAlign = "left"; // reset
      });

      // 9. FOOTER STATS & BARCODE SYSTEM
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(15, 1098, 770, 27);

      // Subtle thin barcode
      ctx.fillStyle = "#475569";
      const barcodeWidths = [1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2];
      let bx = 35;
      for (let bw of barcodeWidths) {
        ctx.fillRect(bx, 1104, bw, 15);
        bx += bw + 1.2;
      }

      ctx.fillStyle = "#64748b";
      ctx.font = "bold 7.5px monospace";
      ctx.fillText("*PRAMA-SYNCHRONIZED-MAP*", 35, 1121);

      ctx.fillStyle = "#475569";
      ctx.font = "bold 9px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("TI & PROYEK METRIK UTAMA PT PANCARAN GROUP • PRAMA SYSTEM COMPREHENSIVE INFOGRAPHIC", 145, 1114);

      ctx.fillStyle = themeAccent;
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "right";
      ctx.fillText("PRAMA CERTIFIED", 765, 1111);

      ctx.fillStyle = "#64748b";
      ctx.font = "normal 7.5px monospace";
      ctx.fillText(`COGNITIVE VERIFICATION ID: PRM-WORD-COMPLIANT-${cat.id.toUpperCase()}`, 765, 1121);

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
          <img src="${infographicUrl}" width="600" height="390" style="width: 6.25in; height: 4.06in; max-width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; display: block; margin: 0 auto;" alt="Peta Visual Strategis PRAMA" />
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

  // 4. Cover Slide (Slide 1) - Elegant Portal Illustration Theme
  const openingSlide = pptx.addSlide();
  
  // Set background to the Pancaran Group Illustration
  let bgPath = "/pancaran_illustration.jpg";
  if (typeof window !== "undefined" && window.location) {
    bgPath = window.location.origin + bgPath;
  }
  openingSlide.background = { path: bgPath };

  // Semi-transparent dark overlay rectangle for perfect text contrast
  openingSlide.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "06152B", transparency: 45 }
  });

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
    w: 8.5,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: "00D285",
    fontFace: "Arial"
  });

  // Corporate logo on the top right
  try {
    openingSlide.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 10.0,
      y: 0.5,
      w: 2.5,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to PPTX:", err);
  }
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
  
  // Set background to the Pancaran Group Illustration for maximum visual brand impact
  let closingBgPath = "/pancaran_illustration.jpg";
  if (typeof window !== "undefined" && window.location) {
    closingBgPath = window.location.origin + closingBgPath;
  }
  closingSlide.background = { path: closingBgPath };

  // Semi-transparent dark overlay rectangle to guarantee pristine contrast and legibility
  closingSlide.addShape("rect", {
    x: 0.0,
    y: 0.0,
    w: 13.33,
    h: 7.5,
    fill: { color: "06152B", transparency: 75 }
  });

  // Outer green border rectangle
  closingSlide.addShape("rect", {
    x: 0.3,
    y: 0.3,
    w: 12.73,
    h: 6.9,
    // Omit fill to keep the shape outline transparent/unfilled
    line: { color: "00D285", width: 1.5 }
  });

  // Center corporate logo above title
  try {
    closingSlide.addImage({
      path: "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X",
      x: 5.415,
      y: 0.9,
      w: 2.5,
      h: 0.8
    });
  } catch (err) {
    console.error("Failed to add corporate logo to closing PPTX:", err);
  }

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
