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

export function getDashboardSectionsForProject(projectTitle: string): DashboardSection[] {
  const cleanTitle = normalizeProjectTitle(projectTitle || "Kajian Strategis: Forestry Management Transportation");
  const lower = cleanTitle.toLowerCase();

  let shortDescriptions: Record<number, string>;

  if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("kayu") || lower.includes("timber") || lower.includes("logging") || lower.includes("wood")) {
    shortDescriptions = {
      1: "Analisis regulasi SVLK, moratorium hutan, dan kepatuhan KLHK kehutanan.",
      2: "Potensi rute logging timber, pasokan industri pulp & kertas, dan celah pasar.",
      3: "Estimasi Capex truk logging off-road, Opex solar industri, dan ROI rute hutan.",
      4: "Kapasitas angkut armada logging vs kuota tebang tahunan konsesi HTI.",
      5: "Kualifikasi supir medan berat, pengawas K3 kehutanan, dan SOP keselamatan.",
      6: "Tahapan uji coba rute hutan (pilot run), mobilisasi armada, dan serah terima.",
      7: "Strategi kontrak jangka panjang (LTSA) dengan grup industri pulp & paper.",
      8: "Alur dispatch dari log pond/landing point, telemetri satelit, dan SLA muat.",
      9: "Mitigasi jalan lumpur cuaca ekstrem, kecelakaan muatan kayu, dan konflik sosial.",
      10: "Sensor GPS area blankspot, timbangan gandar portable, dan e-dokumen SKSHAK.",
      11: "Komparasi posisi nilai dengan transporter kayu lokal dan armada captive.",
      12: "Estimasi potensi pasar logistik kehutanan nasional (TAM), koridor HTI (SAM/SOM).",
      13: "Rasio biaya akuisisi konsesi kayu vs nilai kontrak tahunan bernilai tinggi.",
      14: "Rangkuman evaluasi kelayakan komersial dan rekomendasi eksekusi proyek kehutanan."
    };
  } else if (lower.includes("waste") || lower.includes("limbah") || lower.includes("sampah") || lower.includes("b3") || lower.includes("environmental") || lower.includes("environment")) {
    shortDescriptions = {
      1: "Analisis regulasi AMDAL, PP No 22/2021, dan izin pengangkutan limbah B3 KLHK.",
      2: "Kesenjangan transporter limbah berizin resmi dan lonjakan limbah manufaktur.",
      3: "Capex tangki vacuum & boks khusus B3, Opex pengolahan, dan proyeksi ROI.",
      4: "Suplai transporter limbah B3 berizin vs volume limbah kawasan industri.",
      5: "Sertifikasi B2 Umum kimia, tim tanggap darurat B3, dan SOP dekontaminasi.",
      6: "Prosedur sertifikasi izin trayek KLHK, uji coba jalur B3, dan onboard klien.",
      7: "Penetrasi tender korporat kimia, manufaktur otomotif, dan rumah sakit B2B.",
      8: "Alur manifes Festronik, prosedur bongkar muat bahan berbahaya, dan SLA darurat.",
      9: "Mitigasi kebocoran bahan kimia B3, tumpahan jalan raya, dan audit lingkungan.",
      10: "Integrasi sistem Festronik KLHK, sensor kebocoran IoT, dan GPS anti-deviasi.",
      11: "Analisis komparatif dengan PPLI, Wastec International, dan pengolah limbah B3.",
      12: "Total pasar limbah B3 nasional, fokus kawasan industri Jawa, dan target SOM.",
      13: "Efisiensi biaya audit kepatuhan tender B3 vs retensi kontrak korporat multitahun.",
      14: "Rekomendasi strategis dan penetapan kelayakan investasi pengangkutan limbah B3."
    };
  } else if (lower.includes("batubara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mineral") || lower.includes("batu bara")) {
    shortDescriptions = {
      1: "Kajian regulasi ESDM, royalti pertambangan, dan kebijakan efisiensi energi.",
      2: "Permintaan koridor hauling batu bara dari tambang (IUP) menuju pelabuhan jetty.",
      3: "Capex dump truck heavy-duty, Opex solar & ban off-road, dan kelayakan IRR.",
      4: "Kapasitas ritase harian armada hauling vs target kuota produksi tambang.",
      5: "Kualifikasi supir hauling tambang, sertifikasi POP/POM K3, dan SOP muatan.",
      6: "Pemetaan jalan tambang khusus, uji muat (pilot run), dan mobilisasi unit.",
      7: "Kontrak kerja sama jangka panjang (MToP) dengan pemilik konsesi tambang.",
      8: "Alur timbangan jetty, sistem dispatch FMS, dan SLA turnaround time armada.",
      9: "Mitigasi jalan tambang longsor, insiden blindspot alat berat, dan fluktuasi solar.",
      10: "Fleet Management System (FMS), sensor fatigue monitoring, dan kamera ADAS.",
      11: "Komparasi keandalan dengan kontraktor hauling tambang petahana.",
      12: "Total pasar hauling batu bara Sumatera/Kalimantan, rute khusus, dan target SOM.",
      13: "Analisis biaya uji coba rute hauling vs LTV kontrak volume jumbo tahunan.",
      14: "Evaluasi akhir kelayakan operasional dan investasi armada hauling pertambangan."
    };
  } else if (lower.includes("dingin") || lower.includes("cold") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("makanan") || lower.includes("boga") || lower.includes("fresh") || lower.includes("reefer")) {
    shortDescriptions = {
      1: "Regulasi CDOB BPOM, standar rantai dingin halal, dan tren logistik farmasi/boga.",
      2: "Pertumbuhan distribusi frozen food, vaksin farmasi, dan ritel segar antarkota.",
      3: "Capex armada reefer chiller, Opex solar diesel genset, dan perhitungan ROI.",
      4: "Kelangkaan armada berpendingin tersertifikasi vs lonjakan industri segar.",
      5: "Pelatihan penanganan suhu, protokol kebersihan HACCP, dan KPI integritas kargo.",
      6: "Validasi termal boks pendingin, mapping rute trans-Jawa, dan onboarding klien.",
      7: "Penetrasi ke pabrik farmasi, eksportir seafood, dan jaringan ritel modern.",
      8: "Alur pemuatan suhu konstan (-20°C s.d +4°C), live temperature tracking, & SLA.",
      9: "Mitigasi kegagalan genset pendingin, fluktuasi suhu kargo, dan klaim asuransi.",
      10: "Sensor IoT real-time temperature logger, data logger cloud, dan e-POD.",
      11: "Analisis kekuatan armada dingin dibanding Enseval, MGM Bosco, dan Kiat Ananda.",
      12: "Potensi pasar cold storage & logistik dingin Indonesia serta target SOM.",
      13: "Biaya kustomisasi boks reefer vs nilai kontrak jangka panjang distribusi farmasi.",
      14: "Rekomendasi kelayakan ekspansi armada cold chain terintegrasi teknologi."
    };
  } else if (lower.includes("pelabuhan") || lower.includes("port") || lower.includes("kontainer") || lower.includes("container") || lower.includes("laut") || lower.includes("ocean")) {
    shortDescriptions = {
      1: "Kebijakan National Logistics Ecosystem (NLE), dwelling time, dan intermodal.",
      2: "Peluang shuttle container depo ke terminal pelabuhan ekspor-impor Tanjung Priok.",
      3: "Capex armada prime mover head trailer, Opex tol & bbm, serta analisa ROI.",
      4: "Kapasitas pergerakan peti kemas di pelabuhan utama vs ketersediaan truk sasis.",
      5: "Kualifikasi supir lisensi pelabuhan (TID), sertifikasi keselamatan, & KPI ritase.",
      6: "Integrasi sistem gate pelabuhan (TOS), uji rute koridor buffer, & go-live.",
      7: "Kemitraan dengan shipping line internasional, freight forwarder, & konsolidator.",
      8: "Sistem booking slot gate digital (VBS), pemantauan GPS, dan SLA waktu tunggu.",
      9: "Mitigasi kemacetan akses pelabuhan, antrean gate terminal, dan dwelling time.",
      10: "Integrasi API Port Community System, smart gate RFID, dan e-Seal kontainer.",
      11: "Komparasi SLA kecepatan bongkar muat dengan asosiasi angkutan khusus pelabuhan.",
      12: "Estimasi throughput peti kemas nasional, koridor Priok/Cikarang, dan SOM.",
      13: "Efisiensi biaya integrasi sistem logistik pelabuhan vs pendapatan berulang.",
      14: "Kajian kelayakan strategis pengoperasian shuttle container terminal intermodal."
    };
  } else if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("palm oil") || lower.includes("minyak")) {
    shortDescriptions = {
      1: "Regulasi ISPO, RSPO, mandatori biodiesel B35/B40, dan kebijakan hilirisasi sawit.",
      2: "Kebutuhan transportasi tangki CPO dari PKS ke refinery dan bulking station.",
      3: "Capex tangki stainless food grade, Opex rute perkebunan, dan proyeksi ROI.",
      4: "Kapasitas tangki fluida CPO tersertifikasi vs lonjakan panen raya sawit.",
      5: "Kualifikasi supir tangki cairan berat, pengawas K3 perkebunan, dan SOP FFA.",
      6: "Pembersihan tangki (tank cleaning) bersertifikat, uji rute PKS, dan onboarding.",
      7: "Kontrak tahunan dengan grup produsen minyak sawit dan pabrik biodiesel.",
      8: "Alur pengambilan sampel kadar asam lemak bebas (FFA), penyegelan, dan SLA.",
      9: "Mitigasi kontaminasi minyak sawit, penyusutan volume tangki, dan jalan tanah.",
      10: "Sensor level tangki ultrasonik, GPS anti-tumpah, dan seal elektronik (e-Seal).",
      11: "Perbandingan dengan transporter tangki CPO lokal di Sumatera & Kalimantan.",
      12: "Total volume produksi CPO Indonesia, wilayah operasional, dan target SOM.",
      13: "Rasio biaya persiapan izin tangki sawit terhadap nilai kontrak multitahun.",
      14: "Rekomendasi penetapan armada tangki CPO berstandar mutu industri prima."
    };
  } else if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter") || lower.includes("ore") || lower.includes("baterai")) {
    shortDescriptions = {
      1: "Kebijakan hilirisasi mineral nikel, Permen ESDM, dan standar ESG rantai pasok EV.",
      2: "Peluang hauling bijih nikel (ore) dari tambang ke smelter kawasan industri.",
      3: "Capex heavy dump truck berkapasitas besar, Opex medan berat, dan estimasi ROI.",
      4: "Kebutuhan pasokan ore smelter 24 jam non-stop vs ketersediaan armada tangguh.",
      5: "Keahlian supir muatan berat basah (wet ore), pengawas K3 smelter, dan SOP.",
      6: "Survei jembatan timbang tambang, uji coba daya tahan sasis, dan mobilisasi.",
      7: "Kontrak pasokan eksklusif dengan operator smelter nikel dan kawasan industri.",
      8: "Alur hauling sirkular 24 jam, pemantauan FMS real-time, dan target ritase ketat.",
      9: "Mitigasi kadar air ore (moisture limit), jalan licin, dan kelelahan operator.",
      10: "Sensor berat suspensi real-time, IoT telemetry, dan kamera keselamatan AI.",
      11: "Analisis perbandingan keandalan armada dibanding kontraktor lokal petahana.",
      12: "Total tonase bijih nikel nasional, koridor smelter Sulawesi/Maluku, & target SOM.",
      13: "Biaya penyesuaian armada spesifikasi nikel vs profitabilitas kontrak volume raksasa.",
      14: "Evaluasi kelayakan investasi pengangkutan nikel untuk mendukung ekosistem baterai."
    };
  } else if (lower.includes("semen") || lower.includes("cement") || lower.includes("konstruksi") || lower.includes("clinker") || lower.includes("beton")) {
    shortDescriptions = {
      1: "Kajian regulasi batas muatan sumbu (MST), anti-ODOL, dan izin lintasan jalan.",
      2: "Kebutuhan pasokan semen curah ke batching plant dan proyek infrastruktur.",
      3: "Capex armada truk tangki semen kapsul, Opex solar kompresor, dan ROI.",
      4: "Kapasitas pasokan silo semen pabrik vs target penyelesaian konstruksi.",
      5: "Sertifikasi supir tangki semen bertekanan (pneumatik) dan SOP keselamatan.",
      6: "Uji coba pembongkaran blower semen (pneumatic discharge) dan rute proyek.",
      7: "Kemitraan strategis dengan BUMN Karya dan produsen semen nasional.",
      8: "Alur kompresi pemuatan semen, pemantauan GPS, dan SLA pembongkaran.",
      9: "Mitigasi risiko tumpahan debu semen, penyumbatan pipa, dan audit K3.",
      10: "Sensor tekanan blower, digital POD tanda terima, dan integrasi ERP semen.",
      11: "Komparasi keandalan pasokan dibanding transporter semen konvensional.",
      12: "Estimasi serapan semen curah nasional, koridor regional, dan target SOM.",
      13: "Analisis biaya perawatan tangki kapsul semen vs margin kontrak batching plant.",
      14: "Rekomendasi kelayakan ekspansi armada angkutan semen curah dan clinker."
    };
  } else {
    const coreTopic = cleanTitle.replace(/^(kajian|analisis|evaluasi|studi|kelayakan|strategis|proyek|project|rancangan|ekspansi)[\s:]+/i, "");
    shortDescriptions = {
      1: `Analisis regulasi makro, perizinan transportasi, dan kepatuhan ${coreTopic}.`,
      2: `Kesenjangan pasar, keunggulan operasional, dan peluang bisnis ${coreTopic}.`,
      3: `Estimasi Capex armada, Opex bulanan, cash flow, dan kalkulasi ROI ${coreTopic}.`,
      4: `Keseimbangan kapasitas armada suplai vs permintaan volume ${coreTopic}.`,
      5: `Struktur tim, kualifikasi pengemudi, target KPI harian, dan SOP operasional.`,
      6: `Tahapan transisi pre-onboarding, uji coba rute jalur, hingga stabilisasi.`,
      7: `Strategi penetrasi pasar B2B, diferensiasi layanan, dan kemitraan jangka panjang.`,
      8: `Alur proses sirkuit logistik, skema SLA ketat, dan manajemen pengecualian.`,
      9: `Mitigasi risiko keselamatan jalan, kepatuhan hukum, dan integritas kargo.`,
      10: `Penerapan platform telematika PRAMA, sensor IoT muatan, dan e-manifest.`,
      11: `Pemetaan profil kompetitor petahana dan strategi keunggulan kompetitif.`,
      12: `Kalkulasi ukuran pasar Total (TAM), Serviceable (SAM), dan Target Riil (SOM).`,
      13: `Analisis Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) kontrak.`,
      14: `Rangkuman eksekutif kelayakan proyek dan rekomendasi langkah taktis eksekusi.`
    };
  }

  const baseTitles: Record<number, string> = {
    1: "Global/NAT Overview",
    2: "Market Opportunity",
    3: "Financial (Capex, Opex, P&L, Cash Flow, ROI)",
    4: "Supply & Demand",
    5: "Organization (Qualification, Skill, Output/KPI, SOP)",
    6: "Transition Model (Pre-On-Post)",
    7: "Go To Market Strategy",
    8: "Ops Model (Flow Process, Workflow Diagram, SLA)",
    9: "Risk Management",
    10: "Digital Coverage (Tools, Method, Impact, Automation)",
    11: "Competitor",
    12: "TAM, SAM, SOM",
    13: "CAC, LTV",
    14: "Kesimpulan & Rekomendasi Keputusan"
  };

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => ({
    number: num,
    title: baseTitles[num],
    shortDesc: shortDescriptions[num] || `Kajian strategis pilar ke-${num} untuk proyek ${cleanTitle}.`,
    defaultContent: `### ${num}. ${baseTitles[num]}\n\n`
  }));
}

// Default 14 Essential Project Management Structure Sections
export const defaultDashboardSections: DashboardSection[] = getDashboardSectionsForProject("Kajian Strategis: Forestry Management Transportation");

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
 * Export all 13 sections as one single merged Word document
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
          BAGIAN ${sec.number} DARI 13
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
            13 PILAR FORMULASI PROPOSAL & MANAJEMEN PROYEK
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
  const sanitizedFilename = `KAJIAN_KOMPREHENSIF_PM_13_PILAR_${displayTitle.trim().replace(/\s+/g, "_")}.doc`;
  
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
 * Generate a beautiful widescreen complete 13-section PowerPoint presentation in PPTX format.
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
  slide1.addText("13 PILAR UTAMA ANALYSIS PROPOSAL & PM", {
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

  // --- SLIDES 2 to 14: The 13 Core Formulation Pillars ---
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
    } else if (sec.number === 12) {
      boxText = `POTENSI PASAR (MARKET SIZING)\n\n• TAM: Rp 1.5 Triliun / Thn\n• SAM: Rp 550 Miliar / Thn\n• SOM: Rp 95 Miliar / Thn\n• Realistis Target: Efektif 3 Thn\n• Sektor Utama: Manufaktur B2B`;
    } else if (sec.number === 13) {
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

  // --- SLIDE 15: Dedicated Conclusion Slide ---
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
  conclusionSlide.addText("Halaman 15 dari 16", {
    x: 8.3, y: 6.9, w: 4.4, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: "94A3B8", align: "right"
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
  const sanitizedFilename = `PPTX_Kajian_PM_13_Pilar_${displayTitle.trim().replace(/\s+/g, "_")}.pptx`;
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

Kajian strategis proyek ${pName} pada sektor ${industry} berfokus pada keandalan pengangkutan komoditas ${materialName}. Operasional didukung kesiapan ${unitsText} unit armada heavy-duty dengan alokasi estimasi Capex sebesar Rp ${(numericCapex / 1000000000).toFixed(1)} Miliar dan Opex bulanan sebesar Rp ${(numericOpex / 1000000000).toFixed(1)} Miliar.

Seluruh kegiatan transportasi mengacu pada kepatuhan regulasi ${regulations}, kelayakan uji berkala e-KIR, serta sertifikasi keselamatan kerja K3 Kemenhub. Koridor distribusi melintasi ${extraDetail1} dengan protokol ${extraDetail2} untuk menjamin pencapaian target SLA on-time delivery minimal 98.5%.`,

    2: `### 2. Market Opportunity

Proyek "${pName}" menyasar sektor ${industry} premium di mana terdapat gap atau kesenjangan besar antara transporter berlisensi standar dengan standar kepatuhan tinggi yang dituntut oleh korporat modern. Dengan memanfaatkan armada khusus berlisensi untuk mengangkut ${materialName}, Pancaran Group berada di posisi paling strategis untuk merebut pangsa pasar dari kompetitor konvensional.

Keberadaan armada berteknologi tinggi dan jaminan kepatuhan regulasi ${regulations} memungkinkan penetrasi pasar yang efektif pada koridor distribusi utama. Solusi logistik terintegrasi ini menjawab kebutuhan industri terhadap efisiensi biaya operasional, keandalan ketepatan waktu pengiriman, serta pemenuhan target efisiensi dan tata kelola berkelanjutan.`,

    3: `### 3. Financial (Capex, Opex, P&L, Cash Flow, ROI)

Kelayakan finansial proyek ${pName} didukung alokasi Capex sebesar Rp ${(numericCapex / 1000000000).toFixed(1)} Miliar untuk pengadaan ${unitsText} unit armada heavy-duty berteknologi tinggi serta estimasi Opex bulanan sebesar Rp ${(numericOpex / 1000000000).toFixed(1)} Miliar. Dengan proyeksi pendapatan operasional rata-rata Rp ${(monthlyRev / 1000000000).toFixed(1)} Miliar per bulan dan target marjin laba kotor 45%, proyek ini mengindikasikan Payback Period selama ${defaultPbp} tahun serta tingkat ROI tahun ke-3 sebesar ${defaultRoi}%.

Tingkat Internal Rate of Return (IRR) sebesar ${defaultIrr}% secara signifikan melampaui biaya modal perbankan nasional (~9-11%), mengindikasikan ketahanan finansial dan profitabilitas yang sangat solid. Manajemen modal kerja diperkuat dengan penyediaan buffer likuiditas 3 bulan operasional untuk mengantisipasi siklus penagihan korporat (Term of Payment 60-90 hari), menjamin kesinambungan arus kas operasional secara berkelanjutan.`,

    4: `### 4. Supply & Demand

Dinamika supply dan demand untuk koridor distribusi komoditas ${materialName} menunjukkan adanya lonjakan kebutuhan pengangkutan industri yang tidak diimbangi oleh ketersediaan armada berspesifikasi tinggi di pasar regional. Keterbatasan operator logistik yang memenuhi audit kepatuhan HSE ketat dan regulasi ${regulations} membuka peluang besar bagi Pancaran Group untuk mendominasi segmen logistik bernilai tambah tinggi.

Dengan penempatan ${unitsText} unit armada heavy-duty modern dan utilisasi ritase terencana di atas 85%, unit bisnis memiliki kekuatan penetapan harga (pricing power) yang kompetitif. Kesiapan unit pengganti (buffer fleet) dan pemantauan telemetri real-time memastikan pemenuhan komitmen kapasitas harian tanpa risiko kemacetan rantai pasok klien.`,

    5: `### 5. Structure

Struktur rantai nilai logistik proyek "${pName}" mencakup integrasi menyeluruh dari pengangkutan hulu (inbound), transit antarmoda (midstream), hingga serah terima hilir (outbound). PRAMA Live Control Tower mengawal kelancaran alur secara real-time guna memangkas turnaround time (TAT) dan mengoptimalkan sinkronisasi jadwal bongkar muat di gerbang fasilitas klien.

Pendekatan distribusi sirkular (closed-loop logistics) diterapkan guna meminimalkan perjalanan tanpa muatan (empty miles), sehingga meningkatkan efisiensi biaya operasional dan memperbesar marjin per ritase. Seluruh kontainer dan armada sasis dilengkapi sistem penyegelan digital untuk menjamin integritas kargo ${materialName} sepanjang perjalanan.`,

    6: `### 5. Organization (Qualification, Skill, Output/KPI, SOP)

Struktur organisasi operasional proyek "${pName}" dirancang dengan hierarki komando yang ramping dan berorientasi pada eksekusi lapangan yang presisi. Setiap posisi kunci, mulai dari Project Operations Lead, HSE Officer bersertifikasi K3 Kemenhub, hingga Dispatcher Control Tower, memiliki mandat kualifikasi ketat dan KPI terukur untuk menjamin zero fatal accident dan keandalan armada.

Pengemudi armada diwajibkan melalui pelatihan berkala penanganan kargo ${materialName}, teknik eco-driving, dan mitigasi darurat rute. Standar Operasional Prosedur (SOP) berbasis digital memandu seluruh tahapan mulai dari pre-trip inspection hingga serah terima muatan, menciptakan budaya keselamatan kerja yang konsisten di seluruh lini operasional.`,

    7: `### 6. Transition Model (Pre-On-Post)

Model transisi proyek "${pName}" terbagi ke dalam tiga fase strategis terintegrasi: Pre-Operation, On-Operation, dan Post-Operation/Scale-up. Pada fase Pre-Operation (Bulan 1-2), fokus diarahkan pada mobilisasi ${unitsText} unit armada, instalasi IoT sensor telematics, uji coba rute (trial haul), serta penyelesaian audit kepatuhan regulasi bersama mitra korporat.

Fase On-Operation (Bulan 3-12) memastikan stabilisasi ritase harian dengan target SLA ketepatan waktu 98.5% dan evaluasi kinerja triwulanan. Memasuki fase Post-Operation, Pancaran Group melakukan peninjauan efisiensi bahan bakar dan keselamatan untuk membuka opsi penambahan unit ekspansi armada guna mengakomodasi pertumbuhan volume kargo jangka panjang.`,

    8: `### 7. Go To Market Strategy

Strategi Go-To-Market (GTM) proyek "${pName}" berfokus pada penetrasi langsung ke korporasi tier-1 dan produsen utama komoditas ${materialName} melalui penawaran Long-Term Service Agreement (LTSA) berdurasi 3 hingga 5 tahun. Proposisi nilai utama ditekankan pada keandalan operasional, rekam jejak keselamatan teruji, serta integrasi pelaporan digital kepatuhan operasional dan efisiensi biaya.

Pendekatan kemitraan strategis diperkuat dengan program Quarterly Business Review (QBR) dan skema insentif berbasis volume komitmen tahunan. Sinergi jaringan logistik multimoda dan depo internal Pancaran Group memberikan keunggulan kompetitif yang sulit ditandingi oleh operator konvensional di koridor terkait.`,

    9: `### 8. Ops Model (Flow Process, Workflow Diagram, SLA)

Model operasi proyek "${pName}" mengintegrasikan alur kerja hulu-ke-hilir yang terhubung secara digital dengan PRAMA Live Control Tower. Alur dimulai dari pre-trip digital inspection dan pemeriksaan fit-to-work pengemudi, pemuatan kargo ${materialName} terstandarisasi, pengawalan telemetri rute real-time, hingga konfirmasi serah terima digital di lokasi tujuan (e-Proof of Delivery).

Komitmen Service Level Agreement (SLA) menetapkan target ketersediaan armada minimal 98%, toleransi deviasi jadwal muat di bawah 15 menit, serta waktu respon tanggap darurat teknis maksimal 45 menit. Protokol exception management otomatis mengaktifkan unit cadangan dan tim mekanik mobile jika terdeteksi anomali pada sensor telematika di perjalanan.`,

    10: `### 9. Risk Management

Manajemen risiko proyek "${pName}" mengidentifikasi dan memitigasi potensi risiko operasional rute, kepatuhan hukum, keselamatan kerja (HSE), dan volatilitas finansial. Pengawasan sensor telemetri kecepatan, kamera pendeteksi kelelahan pengemudi (fatigue sensor), serta kalender operasional adaptif terhadap cuaca ekstrem diterapkan untuk memastikan nihil kecelakaan (zero-incident culture).

Risiko finansial akibat fluktuasi harga bahan bakar solar industri dimitigasi melalui klausul eskalasi bahan bakar (Fuel Escalation Clause) dalam kontrak bersama klien. Sementara itu, risiko kepatuhan hukum dan perizinan MST/ODOL dikendalikan melalui sistem penimbangan digital sebelum armada memasuki jalan umum, menjamin kepatuhan 100% terhadap regulasi perhubungan.`,

    11: `### 10. Digital Coverage (Tools, Method, Impact, Automation)

Arsitektur teknologi digital proyek "${pName}" bertumpu pada integrasi Internet of Things (IoT), GPS geofencing, dan dashboard analitik PRAMA Business Intelligence. Setiap unit armada dilengkapi sensor telemetri mesin, pemantauan berat muatan suspensi anti-ODOL, serta manifest perjalanan digital yang terhubung langsung ke sistem ERP operasional.

Otomatisasi data logistik memungkinkan deteksi dini deviasi rute, optimalisasi konsumsi bahan bakar melalui algoritma rute terpintar, serta penerbitan laporan performa efisiensi BBM dan ketepatan waktu SLA secara otomatis. Transformasi digital ini meningkatkan visibilitas rantai pasok klien dan memangkas waktu administratif operasional hingga 70%.`,

    12: `### 11. Competitor

Analisis lanskap kompetitif proyek "${pName}" memetakan persaingan dari operator konvensional lokal, penyedia jasa multinasional, dan perusahaan angkutan internal klien. Kelemahan mendasar pemain eksisting umumnya terletak pada tingginya usia armada, ketiadaan sertifikasi HSE komprehensif, dan sistem pemantauan manual yang rentan deviasi.

Pancaran Group mengeksploitasi celah pasar ini melalui penyediaan armada modern tersertifikasi, integrasi sensor telemetri digital real-time, serta fleksibilitas kontrak kemitraan strategis. Pendekatan ini memungkinkan konversi pangsa pasar yang agresif dan berkelanjutan dari para pemain lama di koridor sasaran.`,

    13: `### 12. TAM, SAM, SOM

Estimasi ukuran pasar proyek "${pName}" menunjukkan potensi Total Addressable Market (TAM) sebesar ${tamFormatted} per tahun pada sektor ${industry} nasional, didorong oleh ekspansi industri dan kebutuhan logistik komoditas ${materialName}. Porsi Serviceable Addressable Market (SAM) yang dapat dijangkau oleh rute dan perizinan operasional Pancaran Group mencapai ${samFormatted} per tahun.

Target Serviceable Obtainable Market (SOM) diproyeksikan sebesar ${somFormatted} per tahun dalam horizon 3 tahun pertama, didukung kesiapan ${unitsText} unit armada awal serta penetrasi kontrak korporat B2B. Angka ini mencerminkan target pangsa pasar yang realistis dan menguntungkan dengan utilisasi kapasitas armada optimal.`,

    14: `### 13. CAC, LTV

Efisiensi komersial proyek "${pName}" tercermin dari Customer Acquisition Cost (CAC) rata-rata sebesar ${cacFormatted} per klien korporat, yang mencakup biaya partisipasi tender, survei teknis rute, dan persiapan dokumen legalitas awal. Sementara itu, Customer Lifetime Value (LTV) rata-rata diestimasikan mencapai ${ltvFormatted} berdasarkan durasi kontrak retensi 3 tahun dengan kepastian volume pengangkutan rutin.

Rasio LTV terhadap CAC yang mencapai ${ratioValue}x membuktikan keunggulan profitabilitas yang sangat sehat dan berada di atas rata-rata benchmark industri logistik. Tingginya rasio ini mengonfirmasi bahwa setiap modal yang dialokasikan untuk memenangkan akun B2B menghasilkan nilai ekonomi jangka panjang yang sangat signifikan bagi grup.`
  };

  // Map raw keys to match defaultDashboardSections (fixing the off-by-one misalignment due to missing Structure section)
  const mappedPillars: Record<number, string> = {
    1: pillars[1],
    2: pillars[2],
    3: pillars[3],
    4: pillars[4],
    5: pillars[6],  // Map generated 'Organization' (6) to Section 5
    6: pillars[7],  // Map generated 'Transition' (7) to Section 6
    7: pillars[8],  // Map generated 'GTM' (8) to Section 7
    8: pillars[9],  // Map generated 'Ops Model' (9) to Section 8
    9: pillars[10], // Map generated 'Risk Management' (10) to Section 9
    10: pillars[11],// Map generated 'Digital Coverage' (11) to Section 10
    11: pillars[12],// Map generated 'Competitor' (12) to Section 11
    12: pillars[13],// Map generated 'TAM, SAM, SOM' (13) to Section 12
    13: pillars[14], // Map generated 'CAC, LTV' (14) to Section 13
    14: `### 14. Kesimpulan & Rekomendasi Keputusan

Berdasarkan hasil evaluasi komprehensif terhadap seluruh pilar kajian strategis—mencakup kelayakan teknis armada, profitabilitas finansial (IRR ${defaultIrr}%, PBP ${defaultPbp} tahun), kesiapan kepatuhan HSE, serta integrasi ekosistem digital—proyek ekspansi "${pName}" dinyatakan SANGAT LAYAK (GO DECISION) untuk segera dieksekusi.

Rekomendasi langkah prioritas meliputi finalisasi kontrak jangka panjang (LTSA) bersama klien utama, pengadaan dan mobilisasi ${unitsText} unit armada berstandar telematika PRAMA, serta pembentukan gugus tugas operasional depo guna memastikan kesiapan implementasi tepat waktu sesuai target SLA yang ditetapkan.`
  };

  return mappedPillars;
}

export function cleanPillarContent(content: string, pillarNum: number, pillarTitle: string): string {
  let cleaned = content.trim();
  
  if (pillarNum === 2) {
    if (cleaned.includes("Berikut adalah bedah terstruktur") || cleaned.includes("A. ANALISIS POTENSI PASAR") || cleaned.includes("A. CAKUPAN STRATEGIS") || cleaned.includes("Faktor Pendorong Pasar")) {
      const parts = cleaned.split(/---|\n### \*\*A\./);
      if (parts[0] && parts[0].trim().length > 60) {
        cleaned = parts[0].replace(/Berikut adalah bedah terstruktur[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "").trim();
      }
    }
  }

  if (pillarNum === 3) {
    if (cleaned.includes("A. Alokasi Capital Expenditure") || cleaned.includes("Analisis Kelayakan Finansial Proyek Komprehensif") || cleaned.includes("MACAM-MACAM KATEGORI FINANSIAL")) {
      const parts = cleaned.split(/---|\n\*\*A\. Alokasi/);
      if (parts[0] && parts[0].trim().length > 60) {
        cleaned = parts[0].replace(/Analisis Kelayakan Finansial Proyek Komprehensif:?[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "").trim();
      }
    }
  }

  if (pillarNum === 14) {
    // Section 14 should strictly focus on Conclusion & Recommendations, removing any stray CAC/LTV summary text
    cleaned = cleaned.replace(/Metrik\s+CAC\s+dioptimalkan[\s\S]*?kebutuhan\s+logistik\.?\s*/gi, "");
    cleaned = cleaned.replace(/Metrik\s+CAC\s+dioptimalkan[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, "");
    cleaned = cleaned.replace(/.*(?:Metrik\s+CAC|SaaS\s+atau\s+biaya|dukungan\s+teknis\s+24\/7).*\n?/gi, "");
  }

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
  
  let resultText = filteredLines.join("\n").trim();

  // 3. Remove verbose breakdowns if present (keep only the concise executive narrative)
  const breakdownSplitters = [
    "\n---",
    "\n## 1.",
    "\n## 1 ",
    "\n### **A.",
    "\n**A. ",
    "\n### A. ",
    "\n### Ringkasan Skoring",
    "\n| Kategori Risiko |"
  ];

  for (const splitter of breakdownSplitters) {
    const idx = resultText.indexOf(splitter);
    if (idx !== -1 && idx > 50) {
      // Ensure we keep the first header and introductory narrative
      resultText = resultText.substring(0, idx).trim();
    }
  }

  return resultText;
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
    
    "STRUCTURE": 100,
    "STRUKTUR": 100,
    "PROJECT STRUCTURE": 100,
    "STRUKTUR PROYEK": 100,
    
    "ORGANIZATION": 5,
    "ORGANISASI": 5,
    "ORGANIZATION STRATEGY": 5,
    "STRATEGI ORGANISASI": 5,
    
    "TRANSITION MODEL": 6,
    "MODEL TRANSISI": 6,
    "TRANSISI": 6,
    "STRATEGI TRANSISI": 6,
    
    "GO TO MARKET STRATEGY": 7,
    "GO-TO-MARKET STRATEGY": 7,
    "GO TO MARKET": 7,
    "STRATEGI GO TO MARKET": 7,
    "GTM STRATEGY": 7,
    
    "OPS MODEL": 8,
    "OPERATIONAL MODEL": 8,
    "MODEL OPERASIONAL": 8,
    "OPS MODEL ANALYSIS": 8,
    
    "RISK MANAGEMENT": 9,
    "MANAJEMEN RISIKO": 9,
    "MANAJEMEN RESIKO": 9,
    "MITIGASI RISIKO": 9,
    "MITIGASI RESIKO": 9,
    
    "DIGITAL COVERAGE": 10,
    "DIGITALISASI": 10,
    "CAKUPAN DIGITAL": 10,
    "TEKNOLOGI DIGITAL": 10,
    
    "COMPETITOR": 11,
    "COMPETITORS": 11,
    "PESAING": 11,
    "KOMPETITOR": 11,
    "ANALISIS PESAING": 11,
    
    "TAM, SAM, SOM": 12,
    "TAM SAM SOM": 12,
    "TAM, SAM DAN SOM": 12,
    "MARKET SIZING": 12,
    "TAM/SAM/SOM": 12,
    
    "CAC, LTV": 13,
    "CAC LTV": 13,
    "CAC & LTV": 13,
    "CAC AND LTV": 13,
    "CAC/LTV": 13,
    "CUSTOMER ACQUISITION COST": 13,

    "KESIMPULAN": 14,
    "KESIMPULAN AKHIR": 14,
    "CONCLUSION": 14,
    "REKOMENDASI KEPUTUSAN": 14,
    "KESIMPULAN & REKOMENDASI KEPUTUSAN": 14,
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
        // Map raw rawNum to target sections in 14-section format
        if (pNum <= 4) return pNum;
        if (pNum === 5) return 100; // Omitted Structure section
        if (pNum >= 6 && pNum <= 14) return pNum - 1;
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

  // Remove the dummy key used for omitting Structure
  delete result[100];

  // Clean all sections to remove conversational prologue and duplicate headers
  for (const numStr of Object.keys(result)) {
    const num = parseInt(numStr, 10);
    const defSec = defaultDashboardSections.find(s => s.number === num);
    const title = defSec ? defSec.title : "";
    result[num] = cleanPillarContent(result[num], num, title);
  }

  return result;
}

export function normalizeProjectTitle(title: string): string {
  let cleaned = title.trim().replace(/^["'`*#]+|["'`*#]+$/g, "").trim();
  if (/^(?:kajian|analisis|studi|proyek|project)/i.test(cleaned)) {
    return cleaned;
  }
  const words = cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return `Kajian Strategis: ${words}`;
}

export function detectAndInferProjectTitleFromText(text: string, currentTitle?: string): string | null {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Explicit change patterns
  const changeRegex = /(?:ganti|ubah|set|buka|ganti judul|pindah|ganti nama|buat analisis|buat kajian)\s*(?:proyek|project|kajian)?\s*(?:ke|to|jadi|menjadi|tentang|mengenai)?\s*([^\n\.\,\?]+)/i;
  const match = trimmed.match(changeRegex);
  if (match && match[1] && match[1].trim().length > 3) {
    const rawTarget = match[1].trim().replace(/\*+/g, "").replace(/["'`]/g, "").trim();
    if (rawTarget.length > 3) {
      return normalizeProjectTitle(rawTarget);
    }
  }

  // Domain Presets
  if (lower.includes("forestry") || lower.includes("kehutanan") || lower.includes("hutan") || lower.includes("kayu") || lower.includes("timber") || lower.includes("logging") || lower.includes("wood")) {
    return "Kajian Strategis: Forestry Management Transportation";
  }
  if (lower.includes("waste") || lower.includes("limbah") || lower.includes("b3") || lower.includes("sampah") || lower.includes("recycle") || lower.includes("daur ulang") || lower.includes("sludge")) {
    return "Kajian Kelayakan: Transportasi & Pengolahan Limbah Industri B3 (Waste Management)";
  }
  if (lower.includes("batubara") || lower.includes("batu bara") || lower.includes("coal") || lower.includes("tambang") || lower.includes("mining")) {
    return "Analisis Kelayakan: Transportasi Koridor Batu Bara Swarnadwipa";
  }
  if (lower.includes("cold chain") || lower.includes("cold storage") || lower.includes("farmasi") || lower.includes("vaksin") || lower.includes("boga") || lower.includes("dingin") || lower.includes("reefer") || lower.includes("chiller")) {
    return "Kajian Kelayakan: Ekspansi Cold Chain Distribusi Farmasi & Boga Segar Jawa-Bali";
  }
  if (lower.includes("port") || lower.includes("pelabuhan") || lower.includes("kontainer") || lower.includes("intermodal") || lower.includes("peti kemas") || lower.includes("tanjung priok") || lower.includes("shuttle container")) {
    return "Kajian Kelayakan: Port Intermodal Hub & Shuttle Container Terminal Tanjung Priok";
  }
  if (lower.includes("semen") || lower.includes("cement") || lower.includes("klinker") || lower.includes("clinker")) {
    return "Kajian Kelayakan: Distribusi Semen & Material Konstruksi Curah";
  }
  if (lower.includes("nikel") || lower.includes("nickel") || lower.includes("smelter") || lower.includes("feronikel")) {
    return "Analisis Kelayakan: Transportasi Bijih Nikel & Logistik Smelter";
  }
  if (lower.includes("cpo") || lower.includes("sawit") || lower.includes("kelapa sawit") || lower.includes("palm oil")) {
    return "Kajian Strategis: Rantai Pasok & Angkutan CPO Kelapa Sawit";
  }
  if (lower.includes("bauksit") || lower.includes("bauxite") || lower.includes("alumina")) {
    return "Analisis Logistik: Hauling Bauksit & Pasokan Smelter Alumina";
  }
  if (lower.includes("pupuk") || lower.includes("fertilizer") || lower.includes("urea")) {
    return "Kajian Kelayakan: Distribusi Logistik Pupuk Nasional";
  }
  if (lower.includes("baja") || lower.includes("steel") || lower.includes("koil baja")) {
    return "Kajian Transportasi: Rantai Pasok Baja & Fabrikasi Logam Berat";
  }
  if (lower.includes("migas") || lower.includes("solar") || lower.includes("bbm") || lower.includes("fuel") || lower.includes("minyak bumi") || lower.includes("pertamina")) {
    return "Kajian Strategis: Distribusi Logistik BBM & Penunjang Migas";
  }

  // If user typed a short title-like string (< 60 chars) without question words
  if (trimmed.length >= 4 && trimmed.length <= 60 && !trimmed.includes("?") && !trimmed.includes("tolong") && !trimmed.includes("bantu") && !trimmed.includes("apa") && !trimmed.includes("bagaimana") && !trimmed.includes("kenapa")) {
    return normalizeProjectTitle(trimmed);
  }

  return null;
}

export function extractProjectTitleFromAI(text: string): string | null {
  if (!text || typeof text !== "string") return null;

  // Pattern 0: MARKET OPPORTUNITY DEEP-DIVE: ...
  const p0 = text.match(/MARKET OPPORTUNITY DEEP-DIVE:\s*(?:KAJIAN STRATEGIS:\s*|KAJIAN KELAYAKAN:\s*|ANALISIS KELAYAKAN:\s*)?([^\n\."*#]+)/i);
  if (p0 && p0[1] && p0[1].trim().length > 3) {
    const raw = p0[1].trim();
    if (raw.toLowerCase().includes("forestry")) {
      return "Kajian Strategis: Forestry Management Transportation";
    }
    return normalizeProjectTitle(raw);
  }

  // Pattern 1: proyek yang sedang kita analisis adalah "..."
  const p1 = text.match(/proyek yang sedang kita analisis adalah\s*(?:"|'|«|“|`|')?([^"'\n\.«“”`\(\)]+)/i);
  if (p1 && p1[1] && p1[1].trim().length > 3) {
    return normalizeProjectTitle(p1[1].trim());
  }
  
  // Pattern 2: Kajian Strategis: ...
  const p2 = text.match(/Kajian Strategis:\s*([^\n\.\"\']+)/i);
  if (p2 && p2[1] && p2[1].trim().length > 3) {
    return `Kajian Strategis: ${p2[1].trim()}`;
  }

  // Pattern 3: Kajian Kelayakan: ...
  const p3 = text.match(/Kajian Kelayakan:\s*([^\n\.\"\']+)/i);
  if (p3 && p3[1] && p3[1].trim().length > 3) {
    return `Kajian Kelayakan: ${p3[1].trim()}`;
  }

  // Pattern 4: Analisis Kelayakan: ...
  const p4 = text.match(/Analisis Kelayakan:\s*([^\n\.\"\']+)/i);
  if (p4 && p4[1] && p4[1].trim().length > 3) {
    return `Analisis Kelayakan: ${p4[1].trim()}`;
  }

  // Pattern 5: PROYEK: ...
  const p5 = text.match(/(?:PROYEK|PROJECT|JUDUL PROYEK)\s*:\s*([^\n\."*#]+)/i);
  if (p5 && p5[1] && p5[1].trim().length > 3) {
    return normalizeProjectTitle(p5[1].trim());
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

