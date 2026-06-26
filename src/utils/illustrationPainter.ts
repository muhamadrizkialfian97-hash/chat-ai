/**
 * Prama System Strategic Illustration Painter
 * High-fidelity, vector-like Canvas drawing engine to create beautiful business
 * and technical visualization templates representing demographics, finances, logistics, and risks.
 * Used identically for real-time web slide animations and exported PPTX PowerPoint files.
 */

export interface IllustrationCategory {
  id: "demography" | "finance" | "logistics" | "risk" | "tech" | "forestry" | "general";
  title: string;
}

// Map slides to correct category based on keywords
export function getCategoryFromTitle(slideTitle: string): IllustrationCategory {
  const title = slideTitle.toLowerCase();
  
  if (
    title.includes("forestry") ||
    title.includes("forest") ||
    title.includes("hutan") ||
    title.includes("pulp") ||
    title.includes("kayu") ||
    title.includes("wood") ||
    title.includes("timber") ||
    title.includes("perkebunan") ||
    title.includes("tanam") ||
    title.includes("agro") ||
    title.includes("reboisasi") ||
    title.includes("plantation")
  ) {
    return { id: "forestry", title: "STRATEGI HUTAN INDUSTRI & LOGISTIK HIJAU" };
  }

  if (
    title.includes("demograf") ||
    title.includes("wilayah") ||
    title.includes("geograf") ||
    title.includes("peta") ||
    title.includes("lokasi") ||
    title.includes("daerah") ||
    title.includes("pasar") ||
    title.includes("target") ||
    title.includes("penduduk") ||
    title.includes("pesaing") ||
    title.includes("sosial")
  ) {
    return { id: "demography", title: "PETA DEMOGRAFIS & DISPERSASI WILAYAH" };
  }

  if (
    title.includes("finansial") ||
    title.includes("biaya") ||
    title.includes("investas") ||
    title.includes("proyeksi") ||
    title.includes("keuangan") ||
    title.includes("untung") ||
    title.includes("rugi") ||
    title.includes("dana") ||
    title.includes("modal") ||
    title.includes("ekonomi") ||
    title.includes("capex") ||
    title.includes("opex")
  ) {
    return { id: "finance", title: "ANALISIS FINANSIAL & KELAYAKAN INVESTASI" };
  }

  if (
    title.includes("logistik") ||
    title.includes("armada") ||
    title.includes("rute") ||
    title.includes("transport") ||
    title.includes("distribus") ||
    title.includes("darat") ||
    title.includes("laut") ||
    title.includes("kapal") ||
    title.includes("truk") ||
    title.includes("cargo") ||
    title.includes("limbah") ||
    title.includes("jalan") ||
    title.includes("operasi")
  ) {
    return { id: "logistics", title: "STRATEGI TRANSPORTASI & ARUS LOGISTIK" };
  }

  if (
    title.includes("risiko") ||
    title.includes("mitigasi") ||
    title.includes("regulasi") ||
    title.includes("patuh") ||
    title.includes("keselamatan") ||
    title.includes("hukum") ||
    title.includes("aman") ||
    title.includes("protek") ||
    title.includes("audit") ||
    title.includes("esg") ||
    title.includes("bahaya")
  ) {
    return { id: "risk", title: "PETA RISIKO, MIGITASI & KEPATUHAN REGULASI" };
  }

  if (
    title.includes("sistem") ||
    title.includes("teknolog") ||
    title.includes("digital") ||
    title.includes("data") ||
    title.includes("it") ||
    title.includes("integras") ||
    title.includes("software") ||
    title.includes("hardware") ||
    title.includes("portal") ||
    title.includes("analitik")
  ) {
    return { id: "tech", title: "INTEGRASI SISTEM & ARSITEKTUR DIGITAL" };
  }

  return { id: "general", title: "ANALISIS STRATEGIS KOMPREHENSIF" };
}

/**
 * Main draw utility painted on canvas context. Supports responsive scaling.
 * Optimized for professional off-white/light warm corporate dashboard look.
 */
export function drawPramaCanvasIllustration(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  slideTitle: string,
  index: number,
  frame: number
) {
  const cat = getCategoryFromTitle(slideTitle);
  
  // Clear background with soft gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#F8FAFC");  // Slate 50
  bgGrad.addColorStop(1, "#F1F5F9");  // Slate 100
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Clean vector border matching Prama branding
  ctx.strokeStyle = "#00D285"; // Pancaran Vivid Green
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, w - 16, h - 16);

  // Draw grid backdrop
  ctx.strokeStyle = "rgba(148, 163, 184, 0.08)"; // Slate 400
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = gridSize; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = gridSize; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw subtle technological corner elements
  ctx.strokeStyle = "rgba(0, 210, 133, 0.4)";
  ctx.lineWidth = 2;
  const bracketSize = 15;
  
  // Top-Left Corner Bracket
  ctx.beginPath();
  ctx.moveTo(15 + bracketSize, 15); ctx.lineTo(15, 15); ctx.lineTo(15, 15 + bracketSize);
  ctx.stroke();

  // Top-Right Corner Bracket
  ctx.beginPath();
  ctx.moveTo(w - 15 - bracketSize, 15); ctx.lineTo(w - 15, 15); ctx.lineTo(w - 15, 15 + bracketSize);
  ctx.stroke();

  // Bottom-Left Corner Bracket
  ctx.beginPath();
  ctx.moveTo(15 + bracketSize, h - 15); ctx.lineTo(15, h - 15); ctx.lineTo(15, h - 15 - bracketSize);
  ctx.stroke();

  // Bottom-Right Corner Bracket
  ctx.beginPath();
  ctx.moveTo(w - 15 - bracketSize, h - 15); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 15, h - 15 - bracketSize);
  ctx.stroke();

  ctx.fillStyle = "#94A3B8"; // Slate 400
  ctx.font = "bold 8px Courier New";
  ctx.fillText(`ID: ${cat.id.toUpperCase()}-${index + 1}-V${Math.floor(frame / 60) + 1}`, 25, h - 22);

  // Category Title
  ctx.fillStyle = "#0F172A"; // Slate 900
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "right";
  ctx.fillText(cat.title, w - 25, 32);

  // Bottom Signature
  ctx.fillStyle = "#00D285";
  ctx.font = "bold 9px Arial";
  ctx.textAlign = "right";
  ctx.fillText("PANCARAN GROUP SERVICES", w - 25, h - 22);

  // Segment drawing based on category
  switch (cat.id) {
    case "demography":
      drawDemographicsIllustration(ctx, w, h, frame);
      break;
    case "finance":
      drawFinanceIllustration(ctx, w, h, frame);
      break;
    case "logistics":
      drawLogisticsIllustration(ctx, w, h, frame);
      break;
    case "risk":
      drawRiskIllustration(ctx, w, h, frame);
      break;
    case "tech":
      drawTechIllustration(ctx, w, h, frame);
      break;
    case "forestry":
      drawForestryIllustration(ctx, w, h, frame);
      break;
    default:
      drawGeneralIllustration(ctx, w, h, frame);
      break;
  }
}

// 1. DEMOGRAPHICS ILLUSTRATION
function drawDemographicsIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  const centerX = w * 0.45;
  const centerY = h * 0.52;

  // Draw Indonesian Archipelago abstract layout dots and connectors
  ctx.strokeStyle = "rgba(15, 23, 42, 0.05)"; // Dark slate
  ctx.fillStyle = "rgba(148, 163, 184, 0.1)";
  
  // Islands blobs
  const islands = [
    { x: w * 0.2, y: h * 0.55, r: 40 }, // Sumatra
    { x: w * 0.35, y: h * 0.72, r: 45 }, // Java
    { x: w * 0.42, y: h * 0.44, r: 35 }, // Kalimantan
    { x: w * 0.58, y: h * 0.51, r: 30 }, // Sulawesi
    { x: w * 0.75, y: h * 0.62, r: 36 }  // Papua
  ];

  islands.forEach((isl) => {
    ctx.beginPath();
    ctx.arc(isl.x, isl.y, isl.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Animated census scan radar sweep
  const sweepAngle = (frame * 0.015) % (Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 210, 133, 0.15)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(centerX, centerY, 85, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
  ctx.stroke();

  // Radar hand line
  ctx.strokeStyle = "rgba(0, 210, 133, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(sweepAngle) * 130, centerY + Math.sin(sweepAngle) * 130);
  ctx.stroke();

  // Pulsing city indicators (Jakarta, Surabaya, Medan, Makassar etc.)
  const ports = [
    { x: w * 0.28, y: h * 0.62, label: "MEDAN" },
    { x: w * 0.35, y: h * 0.72, label: "JAKARTA" },
    { x: w * 0.44, y: h * 0.76, label: "SURABAYA" },
    { x: w * 0.60, y: h * 0.58, label: "MAKASSAR" }
  ];

  ports.forEach((p, idx) => {
    const pulseOffset = Math.sin(frame * 0.05 + idx * 1.5) * 6 + 7;
    ctx.fillStyle = "rgba(0, 210, 133, 0.2)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, pulseOffset, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00D285";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#475569";
    ctx.font = "bold 6.5px Arial";
    ctx.textAlign = "center";
    ctx.fillText(p.label, p.x, p.y - 10);
  });

  // Demographic statistical bars on the RHS panel
  const panelX = w * 0.73;
  const panelY = h * 0.16;
  const panelW = w * 0.22;
  const panelH = h * 0.65;

  // Background card for metrics panel
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(panelX, panelY, panelW, panelH, 5) : ctx.rect(panelX, panelY, panelW, panelH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 9px Arial";
  ctx.textAlign = "left";
  ctx.fillText("DATA DEMOGRAFIS", panelX + 10, panelY + 18);

  const stats = [
    { label: "Usia Produktif", val: 68, color: "#00D285" },
    { label: "Medan & Sumatra", val: 54, color: "#3B82F6" },
    { label: "Jawa & Bali", val: 82, color: "#A855F7" }
  ];

  stats.forEach((st, sidx) => {
    const sY = panelY + 36 + sidx * 33;
    ctx.fillStyle = "#64748B";
    ctx.font = "500 7.5px Arial";
    ctx.fillText(`${st.label}: ${st.val}%`, panelX + 11, sY);

    // bar container
    ctx.fillStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(panelX + 11, sY + 4, panelW - 22, 6, 2) : ctx.rect(panelX + 11, sY + 4, panelW - 22, 6);
    ctx.fill();

    // animated bar fill
    const animatedWidth = ((panelW - 22) * st.val / 100) * (0.8 + Math.sin(frame * 0.03 + sidx) * 0.02);
    ctx.fillStyle = st.color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(panelX + 11, sY + 4, animatedWidth, 6, 2) : ctx.rect(panelX + 11, sY + 4, animatedWidth, 6);
    ctx.fill();
  });
}

// 2. FINANCIAL / INVESTMENT FEASIBILITY
function drawFinanceIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  // Renders a beautiful financial grid backdrop with moving points to make it dynamic
  const graphX = w * 0.08;
  const graphY = h * 0.18;
  const graphW = w * 0.60;
  const graphH = h * 0.60;

  // Chart axes
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(graphX, graphY);
  ctx.lineTo(graphX, graphY + graphH);
  ctx.lineTo(graphX + graphW, graphY + graphH);
  ctx.stroke();

  // Grid horizontal lines
  ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
  ctx.lineWidth = 1;
  const linesCount = 5;
  for (let i = 0; i <= linesCount; i++) {
    const currentY = graphY + (graphH * i) / linesCount;
    ctx.beginPath();
    ctx.moveTo(graphX, currentY);
    ctx.lineTo(graphX + graphW, currentY);
    ctx.stroke();
  }

  // Draw smooth financial line forecast path with animation waves
  const points: Array<{ x: number; y: number }> = [];
  const pointCount = 10;
  for (let i = 0; i < pointCount; i++) {
    const x = graphX + (graphW * i) / (pointCount - 1);
    
    // Smooth upward trajectory with sinusoidal waves
    const baseProgress = i / (pointCount - 1);
    // Exponential growth curved ROI
    const curvatureY = Math.pow(baseProgress, 1.6);
    const animOffset = Math.sin(frame * 0.05 + i * 0.6) * 4;
    const y = graphY + graphH - (graphH * 0.75 * curvatureY) - 15 + animOffset;
    
    points.push({ x, y });
  }

  // Draw gradient fill below graph line
  const areaGrad = ctx.createLinearGradient(0, graphY, 0, graphY + graphH);
  areaGrad.addColorStop(0, "rgba(0, 210, 133, 0.25)");
  areaGrad.addColorStop(1, "rgba(0, 210, 133, 0.00)");
  ctx.fillStyle = areaGrad;

  ctx.beginPath();
  ctx.moveTo(graphX, graphY + graphH);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(graphX + graphW, graphY + graphH);
  ctx.closePath();
  ctx.fill();

  // Draw main spline curve line
  ctx.strokeStyle = "#00D285";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Draw pulsing nodes on key positions
  points.forEach((p, index) => {
    if (index === 3 || index === 6 || index === 9) {
      const radius = (index === 9) ? 6 : 4;
      const glow = (index === 9) ? Math.sin(frame * 0.08) * 4 + 6 : 5;
      
      ctx.fillStyle = "rgba(0, 210, 133, 0.25)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = (index === 9) ? "#3B82F6" : "#00D285";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label at final node
      if (index === 9) {
        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 8.5px Arial";
        ctx.textAlign = "left";
        ctx.fillText("PROYEKSI ROI: +31.2%", p.x - 50, p.y - 12);
      }
    }
  });

  // KPI Statistics sidebar cards
  const cardX = w * 0.72;
  const cards = [
    { title: "ESTIMASI NPV", val: "Rp 12.8M", color: "#00D285", sub: "Internal Rate 14%" },
    { title: "PAYBACK TERM", val: "2.4 TAHUN", color: "#3B82F6", sub: "Sangat Kelayakan" },
    { title: "CAPEX METRIC", val: "93.4 SCORE", color: "#A855F7", sub: "Alokasi Efisien" }
  ];

  cards.forEach((c, idx) => {
    const cardY = h * 0.18 + idx * 56;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cardX, cardY, w * 0.23, 48, 4) : ctx.rect(cardX, cardY, w * 0.23, 48);
    ctx.fill();
    ctx.stroke();

    // Color indicator left pill bar
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cardX, cardY, 4, 48, [4, 0, 0, 4]) : ctx.rect(cardX, cardY, 4, 48);
    ctx.fill();

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 7px Arial";
    ctx.textAlign = "left";
    ctx.fillText(c.title, cardX + 10, cardY + 14);

    ctx.fillStyle = "#0F172A";
    ctx.font = "extrabold 11.5px Arial";
    ctx.fillText(c.val, cardX + 10, cardY + 28);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "italic 6px Arial";
    ctx.fillText(c.sub, cardX + 10, cardY + 41);
  });
}

// 3. LOGISTICS / TRANSPORT FLEET SERVICES
function drawLogisticsIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  // Core routes drawing with dynamic animation cargo bullets traveling between nodes
  const mapCenterY = h * 0.52;
  const mapCenterX = w * 0.45;

  // Logistics nodes (Hubs / Ports / Intersections)
  const hubs = [
    { x: w * 0.16, y: mapCenterY - 35, label: "SUMATRA HUB" },
    { x: w * 0.35, y: mapCenterY + 45, label: "JAKARTA HQ" },
    { x: w * 0.52, y: mapCenterY + 15, label: "PORT SURABAYA" },
    { x: w * 0.44, y: mapCenterY - 50, label: "WEST KALIMANTAN" },
    { x: w * 0.68, y: mapCenterY - 20, label: "SULAWESI PORT" }
  ];

  // Draw connection routes/lanes
  ctx.strokeStyle = "rgba(100, 116, 139, 0.18)";
  ctx.lineWidth = 2;
  
  // Connect networks
  const connections = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4]
  ];

  connections.forEach(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(hubs[from].x, hubs[from].y);
    ctx.lineTo(hubs[to].x, hubs[to].y);
    ctx.stroke();

    // Draw flowing cargo packet dots along pathways
    const distanceX = hubs[to].x - hubs[from].x;
    const distanceY = hubs[to].y - hubs[from].y;
    
    // Slide ratio based on time frame
    const ratio = ((frame * 0.012) + (from * 0.25)) % 1;
    const bulletX = hubs[from].x + distanceX * ratio;
    const bulletY = hubs[from].y + distanceY * ratio;

    // Glowing bullet cargo package
    ctx.fillStyle = "rgba(0, 210, 133, 0.45)";
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00D285";
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw hub nodes
  hubs.forEach((h, index) => {
    const size = (index === 1) ? 9 : 6;
    ctx.fillStyle = (index === 1) ? "#00D285" : "#3B82F6";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(h.x, h.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 7px Arial";
    ctx.textAlign = "center";
    ctx.fillText(h.label, h.x, h.y - size - 4);
  });

  // Fleet Statistics overlay panel (Uptime, utilization etc.)
  const overlayX = w * 0.72;
  const overlayY = h * 0.18;
  const overlayW = w * 0.23;

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.strokeStyle = "rgba(0, 210, 133, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(overlayX, overlayY, overlayW, h * 0.65, 4) : ctx.rect(overlayX, overlayY, overlayW, h * 0.65);
  ctx.fill();
  ctx.stroke();

  // Fleet Status indicator
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 8.5px Arial";
  ctx.textAlign = "left";
  ctx.fillText("OPTIMASI OPERASI", overlayX + 10, overlayY + 18);

  const metrics = [
    { title: "Rute Terkoneksi", text: "24 Jalur Logistik", pct: 92 },
    { title: "Utilitas Fleet", text: "87% Optimal", pct: 87 },
    { title: "Efisiensi Bahan Bakar", text: "Hemat 12.4%", pct: 74 }
  ];

  metrics.forEach((m, idx) => {
    const mY = overlayY + 36 + idx * 45;
    ctx.fillStyle = "#475569";
    ctx.font = "bold 7px Arial";
    ctx.fillText(m.title, overlayX + 10, mY);

    ctx.fillStyle = "#0F172A";
    ctx.font = "900 8.5px Arial";
    ctx.fillText(m.text, overlayX + 10, mY + 11);

    // bar container
    ctx.fillStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(overlayX + 10, mY + 16, overlayW - 20, 4, 1.5) : ctx.rect(overlayX + 10, mY + 16, overlayW - 20, 4);
    ctx.fill();

    // filled bar
    ctx.fillStyle = "#00D285";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(overlayX + 10, mY + 16, (overlayW - 20) * m.pct / 100, 4, 1.5) : ctx.rect(overlayX + 10, mY + 16, (overlayW - 20) * m.pct / 100, 4);
    ctx.fill();
  });
}

// 4. RISK & AUDIT REGULATORY SAFEGUARDS
function drawRiskIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  const radarCenterX = w * 0.42;
  const radarCenterY = h * 0.52;
  const maxRadius = 110;

  // Draw scanning compass/radar rings
  ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
  ctx.lineWidth = 1;

  for (let r = 25; r <= maxRadius; r += 28) {
    ctx.beginPath();
    ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cross lines for coordinates
  ctx.beginPath();
  ctx.moveTo(radarCenterX - maxRadius, radarCenterY); ctx.lineTo(radarCenterX + maxRadius, radarCenterY);
  ctx.moveTo(radarCenterX, radarCenterY - maxRadius); ctx.lineTo(radarCenterX, radarCenterY + maxRadius);
  ctx.stroke();

  // Radar rotating sweep highlight (animated)
  const sweepAngle = (frame * 0.02) % (Math.PI * 2);
  const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 5, radarCenterX, radarCenterY, maxRadius);
  sweepGrad.addColorStop(0, "rgba(225, 29, 72, 0.01)"); // Alert Red
  sweepGrad.addColorStop(1, "rgba(225, 29, 72, 0.06)");
  ctx.fillStyle = sweepGrad;
  
  ctx.beginPath();
  ctx.moveTo(radarCenterX, radarCenterY);
  ctx.arc(radarCenterX, radarCenterY, maxRadius, sweepAngle, sweepAngle + 0.3 * Math.PI);
  ctx.lineTo(radarCenterX, radarCenterY);
  ctx.fill();

  // Draw rotating outer dial tickmarks
  ctx.strokeStyle = "#A855F7"; // Purple compass tick
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(radarCenterX, radarCenterY, maxRadius + 5, sweepAngle, sweepAngle + 0.1);
  ctx.stroke();

  // Plot some threats/regulatory risks nodes
  const threatPoints = [
    { x: radarCenterX - 45, y: radarCenterY - 45, severity: "MEDIUM", label: "Legal Compliance", pulseColor: "rgba(234, 179, 8, 0.3)", color: "#EAB308" },
    { x: radarCenterX + 60, y: radarCenterY + 40, severity: "HIGH", label: "Environmental ESG", pulseColor: "rgba(239, 68, 68, 0.3)", color: "#EF4444" },
    { x: radarCenterX - 55, y: radarCenterY + 50, severity: "LOW", label: "Local Permits", pulseColor: "rgba(59, 130, 246, 0.3)", color: "#3B82F6" }
  ];

  threatPoints.forEach((tp, tidx) => {
    const pulseRadius = Math.sin(frame * 0.1 + tidx) * 6 + 7;
    ctx.fillStyle = tp.pulseColor;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = tp.color;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.font = "bold 6.5px Arial";
    ctx.fillStyle = "#0F172A";
    ctx.fillText(tp.label, tp.x + 8, tp.y + 2);
  });

  // Safeguards verification box panel on the RHS
  const secureX = w * 0.72;
  const secureY = h * 0.18;
  const secureW = w * 0.23;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(100, 116, 139, 0.12)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(secureX, secureY, secureW, h * 0.65, 5) : ctx.rect(secureX, secureY, secureW, h * 0.65);
  ctx.fill();
  ctx.stroke();

  // Checklist of audits completed
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 8.5px Arial";
  ctx.textAlign = "left";
  ctx.fillText("STATUS AMAN & ESG", secureX + 10, secureY + 18);

  const safeguardCriteria = [
    { name: "AMDAL Terbit", isVerified: true },
    { name: "Kepatuhan AMDB B3", isVerified: true },
    { name: "Standard Operational", isVerified: true },
    { name: "Izin Wilayah Adat", isVerified: true },
    { name: "Faktor Cadangan", isVerified: false }
  ];

  safeguardCriteria.forEach((sc, idx) => {
    const itemY = secureY + 36 + idx * 26;
    
    // Checkbox container
    ctx.fillStyle = sc.isVerified ? "rgba(0, 210, 133, 0.1)" : "rgba(234, 179, 8, 0.1)";
    ctx.strokeStyle = sc.isVerified ? "#00D285" : "#EAB308";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(secureX + 10, itemY - 6, 8, 8, 1.5) : ctx.rect(secureX + 10, itemY - 6, 8, 8);
    ctx.fill();
    ctx.stroke();

    if (sc.isVerified) {
      // Draw a miniature green checkmark inside
      ctx.strokeStyle = "#00D285";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(secureX + 11.5, itemY - 2.5);
      ctx.lineTo(secureX + 13.5, itemY - 1);
      ctx.lineTo(secureX + 16.5, itemY - 5);
      ctx.stroke();
    } else {
      // Draw central warning dot for check in progress
      ctx.fillStyle = "#EAB308";
      ctx.beginPath();
      ctx.arc(secureX + 14, itemY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#475569";
    ctx.font = "500 7.2px Arial";
    ctx.fillText(sc.name, secureX + 24, itemY);
  });
}

// 5. TECHNICAL / DIGITAL ECOSYSTEM
function drawTechIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  // Database portal connection nodes
  const netCenterX = w * 0.42;
  const netCenterY = h * 0.52;

  // Nodes for digital architecture
  const nodes = [
    { x: netCenterX, y: netCenterY, role: "CORE CLOUD API", color: "#3B82F6", size: 10 },
    { x: netCenterX - 70, y: netCenterY - 45, role: "SAP LOGISTICS", color: "#00D285", size: 6 },
    { x: netCenterX + 70, y: netCenterY - 45, role: "FLEET IOT", color: "#00D285", size: 6 },
    { x: netCenterX - 70, y: netCenterY + 45, role: "BI PORTAL DB", color: "#A855F7", size: 6 },
    { x: netCenterX + 70, y: netCenterY + 45, role: "WMS PORTAL", color: "#A855F7", size: 6 }
  ];

  // Cable pathways lines
  ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
  ctx.lineWidth = 1.5;

  for (let i = 1; i < nodes.length; i++) {
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[i].x, nodes[i].y);
    ctx.stroke();

    // Data packets flows with dynamic binary streams (anim)
    const ratio = ((frame * 0.015) + (i * 0.2)) % 1;
    const packetX = nodes[0].x + (nodes[i].x - nodes[0].x) * ratio;
    const packetY = nodes[0].y + (nodes[i].y - nodes[0].y) * ratio;

    ctx.fillStyle = "#00D285";
    ctx.beginPath();
    ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw node servers
  nodes.forEach((n, idx) => {
    // animated pulse around nodes for technological feedback
    const pulse = Math.sin(frame * 0.06 + idx) * 4 + 6;
    ctx.fillStyle = n.color + "18";
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = n.color;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 6.8px Arial";
    ctx.textAlign = "center";
    ctx.fillText(n.role, n.x, n.y - n.size - 4);
  });

  // Server performance diagnostics sidebar
  const monitorX = w * 0.72;
  const monitorY = h * 0.18;
  const monitorW = w * 0.23;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(monitorX, monitorY, monitorW, h * 0.65, 4) : ctx.rect(monitorX, monitorY, monitorW, h * 0.65);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 8.5px Arial";
  ctx.textAlign = "left";
  ctx.fillText("DIGITAL PERFORMANCE", monitorX + 10, monitorY + 18);

  // CPU animated spikes layout
  const spikeWidth = 4;
  const spikeSpacing = 3;
  const spikesCount = 18;
  const maxSpikeHeight = 28;

  ctx.strokeStyle = "rgba(0, 210, 133, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(monitorX + 10, monitorY + 65);
  ctx.lineTo(monitorX + monitorW - 10, monitorY + 65);
  ctx.stroke();

  // Draw dynamic bar spectrum visualizer
  for (let i = 0; i < spikesCount; i++) {
    const s_height = (Math.sin(frame * 0.08 + i * 0.4) * 0.5 + 0.5) * maxSpikeHeight + 3;
    const sX = monitorX + 12 + i * (spikeWidth + spikeSpacing);
    const sY = monitorY + 65 - s_height;

    ctx.fillStyle = (s_height > maxSpikeHeight * 0.85) ? "#EF4444" : "#00D285";
    ctx.fillRect(sX, sY, spikeWidth, s_height);
  }

  ctx.fillStyle = "#64748B";
  ctx.font = "bold 6px Arial";
  ctx.fillText("SERVER LATENCY", monitorX + 10, monitorY + 36);

  ctx.fillStyle = "#0F172A";
  ctx.font = "extrabold 9px Courier New";
  ctx.fillText("14.5ms (ONLINE)", monitorX + 10, monitorY + 45);

  ctx.fillStyle = "#64748B";
  ctx.font = "bold 6px Arial";
  ctx.fillText("INTEGRASI API STATUS", monitorX + 10, monitorY + 84);

  ctx.fillStyle = "#0F172A";
  ctx.font = "extrabold 9px Courier New";
  ctx.fillText("99.98% UPTIME", monitorX + 10, monitorY + 93);
}

// 6. GENERAL ROADMAP & DECISION DIAGRAM
function drawGeneralIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  // Draw core business strategic pillars (3 boxes connected to central node)
  const drawCenterX = w * 0.40;
  const drawCenterY = h * 0.52;

  // Interconnected columns representing strategic foundations
  const steps = [
    { title: "PERSIAPAN", subtitle: "Identifikasi & Studi", val: "01", col: "#00D285" },
    { title: "FORMULASI", subtitle: "Estimasi & Sektor", val: "02", col: "#3B82F6" },
    { title: "IMPLEMENTASI", subtitle: "Eksekusi Tepat", val: "03", col: "#A855F7" }
  ];

  ctx.strokeStyle = "rgba(0, 210, 133, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.14, drawCenterY + 10);
  ctx.lineTo(w * 0.65, drawCenterY + 10);
  ctx.stroke();

  steps.forEach((st, idx) => {
    const nodeX = w * 0.14 + idx * (w * 0.19) + 40;
    const nodeY = drawCenterY - 20 + Math.sin(frame * 0.04 + idx * 1.2) * 5;

    // Line down from node to timeline
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(nodeX, nodeY + 30);
    ctx.lineTo(nodeX, drawCenterY + 10);
    ctx.stroke();

    // Node wrapper box card
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(nodeX - 45, nodeY - 20, 90, 50, 4) : ctx.rect(nodeX - 45, nodeY - 20, 90, 50);
    ctx.fill();
    ctx.stroke();

    // Side accent tab indicator
    ctx.fillStyle = st.col;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(nodeX - 45, nodeY - 20, 3, 50, [4, 0, 0, 4]) : ctx.rect(nodeX - 45, nodeY - 20, 3, 50);
    ctx.fill();

    // Number circle badge
    ctx.fillStyle = st.col + "18";
    ctx.beginPath();
    ctx.arc(nodeX + 30, nodeY - 8, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = st.col;
    ctx.font = "extrabold 8px Arial";
    ctx.textAlign = "center";
    ctx.fillText(st.val, nodeX + 30, nodeY - 5);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 8px Arial";
    ctx.textAlign = "left";
    ctx.fillText(st.title, nodeX - 34, nodeY);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 6.5px Arial";
    ctx.fillText(st.subtitle, nodeX - 34, nodeY + 12);
  });

  // Timeline indicator pulse
  const timelineIndicatorRatio = (frame * 0.003) % 1;
  const activeTimelineX = w * 0.14 + (w * 0.51) * timelineIndicatorRatio;
  
  ctx.fillStyle = "rgba(0, 210, 133, 0.2)";
  ctx.beginPath();
  ctx.arc(activeTimelineX, drawCenterY + 10, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#00D285";
  ctx.beginPath();
  ctx.arc(activeTimelineX, drawCenterY + 10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Mini summary card RHS
  const rightBoxX = w * 0.72;
  const rightBoxY = h * 0.18;
  const rightBoxW = w * 0.23;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(rightBoxX, rightBoxY, rightBoxW, h * 0.65, 4) : ctx.rect(rightBoxX, rightBoxY, rightBoxW, h * 0.65);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 8.5px Arial";
  ctx.textAlign = "left";
  ctx.fillText("EVALUASI STRATEGIS", rightBoxX + 10, rightBoxY + 18);

  ctx.fillStyle = "#64748B";
  ctx.font = "550 7px Arial";
  ctx.fillText("Metodologi Formulator:", rightBoxX + 10, rightBoxY + 34);

  ctx.fillStyle = "#0F172A";
  ctx.font = "500 7px Arial";
  ctx.fillText("• Standar Penilaian AI", rightBoxX + 10, rightBoxY + 48);
  ctx.fillText("• Analitik Kelayakan 93%", rightBoxX + 10, rightBoxY + 59);
  ctx.fillText("• Lintas Sektor Terpadu", rightBoxX + 10, rightBoxY + 70);
  ctx.fillText("• Transparansi Akurasi", rightBoxX + 10, rightBoxY + 81);
  ctx.fillText("• Rekomendasi Mitigasi", rightBoxX + 10, rightBoxY + 92);
}

// 7. FORESTRY MANAGEMENT AND GREEN TRANSPORTATION
function drawForestryIllustration(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  const mapCenterY = h * 0.52;

  // Background river / highway representing green transportation pathways
  ctx.strokeStyle = "rgba(14, 165, 233, 0.15)"; // Sky blue flow
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(w * 0.08, mapCenterY + 40);
  ctx.lineTo(w * 0.28, mapCenterY + 10);
  ctx.lineTo(w * 0.48, mapCenterY + 50);
  ctx.lineTo(w * 0.65, mapCenterY + 20);
  ctx.stroke();

  // Draw thin center dash in the river/path
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(w * 0.08, mapCenterY + 40);
  ctx.lineTo(w * 0.28, mapCenterY + 10);
  ctx.lineTo(w * 0.48, mapCenterY + 50);
  ctx.lineTo(w * 0.65, mapCenterY + 20);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // Moving transport vessel / barge on the river (based on frame animation)
  const ratio = (frame * 0.005) % 1.1;
  let px = 0;
  let py = 0;
  if (ratio <= 0.33) {
    const t = ratio / 0.33;
    px = w * 0.08 + (w * 0.20) * t;
    py = mapCenterY + 40 - 30 * t;
  } else if (ratio <= 0.66) {
    const t = (ratio - 0.33) / 0.33;
    px = w * 0.28 + (w * 0.20) * t;
    py = mapCenterY + 10 + 40 * t;
  } else {
    const t = Math.min(1, (ratio - 0.66) / 0.34);
    px = w * 0.48 + (w * 0.17) * t;
    py = mapCenterY + 50 - 30 * t;
  }

  // Draw cargo vessel towing logs
  ctx.fillStyle = "#334155"; // Slate barge
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(px - 14, py - 6, 28, 12, 3) : ctx.rect(px - 14, py - 6, 28, 12);
  ctx.fill();

  // Brown cylinders loaded (Wood logs logs)
  ctx.fillStyle = "#B45309"; // Amber/brown wood log
  ctx.fillRect(px - 10, py - 4, 10, 3);
  ctx.fillRect(px - 10, py - 1, 12, 3);
  ctx.fillRect(px - 2, py - 4, 10, 3);

  // Vessel cabin
  ctx.fillStyle = "#10B981";
  ctx.fillRect(px + 6, py - 5, 4, 10);

  // Soft animation waves behind barge
  const waveSize = Math.sin(frame * 0.1) * 3 + 4;
  ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px - 18, py, waveSize, Math.PI * 0.8, Math.PI * 1.2);
  ctx.stroke();

  // 3 Stylish, high-fidelity green evergreen/pine trees (representing Forestry)
  const trees = [
    { x: w * 0.15, y: mapCenterY - 40, baseW: 24, h: 42, color: "#065F46" }, // deep emerald
    { x: w * 0.24, y: mapCenterY - 60, baseW: 28, h: 54, color: "#047857" }, // emerald
    { x: w * 0.52, y: mapCenterY - 45, baseW: 26, h: 48, color: "#059669" }, // light-medium emerald
    { x: w * 0.59, y: mapCenterY - 30, baseW: 22, h: 36, color: "#10B981" }  // bright green
  ];

  trees.forEach((tr, index) => {
    // Pine tree trunk
    ctx.fillStyle = "#78350F"; // brown trunk
    ctx.fillRect(tr.x - 3, tr.y, 6, 12);

    // Dynamic wind sway rotation
    const sway = Math.sin(frame * 0.03 + index) * 2;

    // Pine triangular layers (3 tiered triangles)
    ctx.fillStyle = tr.color;
    for (let i = 0; i < 3; i++) {
      const layerY = tr.y - (i * (tr.h * 0.28));
      const layerW = tr.baseW * (1 - i * 0.25);
      const layerH = tr.h * 0.45;

      ctx.beginPath();
      ctx.moveTo(tr.x + sway, layerY - layerH);
      ctx.lineTo(tr.x - layerW / 2, layerY);
      ctx.lineTo(tr.x + layerW / 2, layerY);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Flowing carbon/leaf symbols in the sky (animated)
  for (let i = 0; i < 3; i++) {
    const leafX = w * 0.12 + i * (w * 0.18) + Math.sin(frame * 0.02 + i) * 12;
    const leafY = mapCenterY - 80 + Math.cos(frame * 0.03 + i) * 6;

    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.beginPath();
    ctx.ellipse ? ctx.ellipse(leafX, leafY, 5, 2.5, Math.PI / 4, 0, Math.PI * 2) : ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Forestry transit hub node checkpoints
  const points = [
    { x: w * 0.12, y: mapCenterY + 40, label: "HARVEST ZONE A" },
    { x: w * 0.48, y: mapCenterY + 50, label: "TRANSIT WHARF" },
    { x: w * 0.65, y: mapCenterY + 20, label: "PANCARAN FACTORY" }
  ];

  points.forEach((pt, pidx) => {
    ctx.fillStyle = "#047857";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 6.5px Arial";
    ctx.textAlign = "center";
    ctx.fillText(pt.label, pt.x, pt.y + 14);
  });

  // RHS Strategic KPI Assessment Box
  const sideX = w * 0.72;
  const sideY = h * 0.18;
  const sideW = w * 0.23;

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.strokeStyle = "rgba(4, 120, 87, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(sideX, sideY, sideW, h * 0.65, 4) : ctx.rect(sideX, sideY, sideW, h * 0.65);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 8.5px Arial";
  ctx.textAlign = "left";
  ctx.fillText("GREEN CARGO & ENVIRONMENT", sideX + 10, sideY + 18);

  const statsList = [
    { category: "Hutan FSC Lestari", value: "96.4%", desc: "Sertifikasi Internasional", color: "#059669" },
    { category: "Aliran Kapal Tongkang", value: "93.1%", desc: "Jadwal On-Time", color: "#10B981" },
    { category: "Akurasi CO2 Offset", value: "12,400 T", desc: "Estimasi Serapan Karbon", color: "#34D399" }
  ];

  statsList.forEach((st, sidx) => {
    const sitemY = sideY + 36 + sidx * 43;

    ctx.fillStyle = "#475569";
    ctx.font = "bold 6.8px Arial";
    ctx.fillText(st.category, sideX + 10, sitemY);

    ctx.fillStyle = st.color;
    ctx.font = "900 10.5px Arial";
    ctx.fillText(st.value, sideX + 10, sitemY + 11);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "500 6px Arial";
    ctx.fillText(st.desc, sideX + 10, sitemY + 19);

    // Draw baby metric indicator dot
    ctx.fillStyle = st.color;
    ctx.beginPath();
    ctx.arc(sideX + sideW - 14, sitemY + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

