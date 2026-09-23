import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { generateStrategicOverviewForTitle } from "./src/utils/strategicOverviewGenerator.ts";
import { generateMarketOpportunityForTitle } from "./src/utils/marketOpportunityGenerator.ts";
import { generateSupplyDemandForTitle } from "./src/utils/supplyDemandGenerator.ts";
import { generateTransitionModelForTitle } from "./src/utils/transitionModelGenerator.ts";
import { generateGoToMarketForTitle } from "./src/utils/goToMarketGenerator.ts";
import { generateRiskManagementForTitle } from "./src/utils/riskManagementGenerator.ts";
import { generateOpsModelForTitle } from "./src/utils/opsModelGenerator.ts";
import { generateDigitalCoverageForTitle } from "./src/utils/digitalCoverageGenerator.ts";
import { generateTamSamSomForTitle } from "./src/utils/tamSamSomGenerator.ts";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent startup crashes when API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function getFriendlyGeminiError(error: any): string {
  let originalMsg = "";
  if (typeof error === "string") {
    originalMsg = error;
  } else if (error && typeof error === "object") {
    originalMsg = error.message || error.statusText || JSON.stringify(error);
  }

  // Check if originalMsg is or contains a JSON string
  let parsedError: any = null;
  try {
    const jsonStart = originalMsg.indexOf("{");
    const jsonEnd = originalMsg.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonStr = originalMsg.substring(jsonStart, jsonEnd + 1);
      parsedError = JSON.parse(jsonStr);
    } else {
      parsedError = JSON.parse(originalMsg);
    }
  } catch (e) {
    // Not a valid JSON string
  }

  let code = error?.status || error?.statusCode || "";
  let status = "";
  let messageText = originalMsg;

  if (parsedError) {
    if (parsedError.error) {
      code = parsedError.error.code || code;
      status = parsedError.error.status || status;
      messageText = parsedError.error.message || messageText;
    } else {
      code = parsedError.code || code;
      status = parsedError.status || status;
      messageText = parsedError.message || messageText;
    }
  }

  const lowercaseMsg = messageText.toLowerCase();
  const lowercaseOriginal = originalMsg.toLowerCase();

  // 1. Quota / Rate Limits (429)
  if (
    code === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    lowercaseMsg.includes("quota") ||
    lowercaseMsg.includes("429") ||
    lowercaseMsg.includes("resource_exhausted") ||
    lowercaseMsg.includes("rate limit") ||
    lowercaseOriginal.includes("quota") ||
    lowercaseOriginal.includes("429") ||
    lowercaseOriginal.includes("resource_exhausted")
  ) {
    return `⚠️ **Batas Kuota Penggunaan Terlampaui (RESOURCE_EXHAUSTED / HTTP 429)**

Sistem serverless saat ini kehabisan sisa kuota harian/menit untuk kunci API bawaan.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Buat/Gunakan API Key Pribadi Anda sendiri:** Ini gratis, cepat, dan aman!
2. Di panel atas chat, silakan klik tombol **KONEKSI (BROWSER)**.
3. Masukkan **Gemini API Key** Anda sendiri yang masih aktif dari Google AI Studio ([Buka Google AI Studio untuk membuat Kunci Gratis](https://aistudio.google.com/)).
4. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
  }

  // 2. High Demand / Unavailable (503)
  if (
    code === 503 ||
    status === "UNAVAILABLE" ||
    lowercaseMsg.includes("503") ||
    lowercaseMsg.includes("high demand") ||
    lowercaseMsg.includes("unavailable") ||
    lowercaseMsg.includes("temporary") ||
    lowercaseOriginal.includes("503") ||
    lowercaseOriginal.includes("high demand") ||
    lowercaseOriginal.includes("unavailable")
  ) {
    return `⚠️ **Layanan Sedang Padat (SERVICE_UNAVAILABLE / HTTP 503)**

Model AI Gemini saat ini sedang menerima permintaan yang sangat padat (High Demand). Lonjakan ini biasanya bersifat sementara.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. **Gunakan API Key Pribadi Anda:** Menggunakan API Key pribadi Anda dari AI Studio seringkali memiliki jatah kuota dan prioritas antrean yang berbeda secara personal. Silakan klik tombol **KONEKSI (BROWSER)** di atas chat untuk memasukkan kunci Anda.
2. **Tunggu beberapa saat** lalu silakan klik tombol kirim kembali pesan Anda.`;
  }

  // 3. API Key Invalid (400)
  if (
    code === 400 && 
    (lowercaseMsg.includes("api_key_invalid") || lowercaseMsg.includes("key is invalid") || lowercaseMsg.includes("invalid api key") || lowercaseMsg.includes("api key") || lowercaseMsg.includes("not found"))
  ) {
    return `⚠️ **Pemberitahuan Kunci API Tidak Valid (API_KEY_INVALID / HTTP 400)**

Kunci API Gemini yang dikonfigurasi tidak dikenali atau tidak sah menurut sistem Google AI Studio.

### 💡 Solusi Cepat:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Periksa kembali kunci yang disalin. Pastikan tidak ada karakter terpotong atau spasi tambahan di awal/akhir kunci.
3. Anda bisa mendapatkan kunci baru secara cepat di [Google AI Studio](https://aistudio.google.com/) secara gratis.`;
  }

  // 4. Permission Denied (403) or Leaked Key
  if (
    code === 403 ||
    status === "PERMISSION_DENIED" ||
    lowercaseMsg.includes("permission_denied") ||
    lowercaseMsg.includes("not have permission") ||
    lowercaseMsg.includes("leaked") ||
    lowercaseMsg.includes("leak") ||
    lowercaseOriginal.includes("permission_denied") ||
    lowercaseOriginal.includes("not have permission") ||
    lowercaseOriginal.includes("leaked") ||
    lowercaseOriginal.includes("leak")
  ) {
    if (lowercaseMsg.includes("leaked") || lowercaseOriginal.includes("leaked") || lowercaseMsg.includes("leak") || lowercaseOriginal.includes("leak")) {
      return `⚠️ **Kunci API Dilaporkan Bocor / Diblokir (PERMISSION_DENIED / HTTP 403)**

Sistem Keamanan Google mendeteksi bahwa kunci API Gemini bawaan yang digunakan saat ini telah terpublikasi atau bocor (*leaked key*) di ranah publik (misal: ter-commit di repositori publik secara tidak sengaja). Demi melindungi penyalahgunaan, Google AI Cloud otomatis memblokir secara permanen kunci tersebut.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. Silakan klik tombol **KONEKSI (BROWSER)** di bagian atas halaman chat ini.
2. Dapatkan kunci API baru pribadi Anda secara cepat (gratis dan selesai dalam 30 detik) di [Google AI Studio](https://aistudio.google.com/).
3. Tempelkan kunci pribadi tersebut pada kolom input, lalu klik tombol **Simpan**.
4. Setelah kunci pribadi Anda disimpan, Anda dapat langsung mengirim ulang pesan Anda! Sesi AI akan dialihkan secara langsung dari browser Anda ke Google AI secara aman tanpa kendala.`;
    }

    return `⚠️ **Kunci API Tidak Memiliki Izin Akses (PERMISSION_DENIED / HTTP 403)**

Kunci API Gemini yang digunakan saat ini tidak memiliki izin akses atau dibatasi oleh kebijakan Google Cloud/AI Studio.

### 💡 Solusi Cepat untuk Melanjutkan Sesi:
1. Silakan klik tombol **KONEKSI (BROWSER)** di panel bagian atas chat.
2. Gunakan **Gemini API Key pribadi** Anda sendiri dari Google AI Studio. Sangat mudah didapat secara gratis di [Google AI Studio](https://aistudio.google.com/).
3. Pengaturan ini aman karena disimpan langsung di dalam browser lokal Anda dan tidak dikirimkan ke server luar. Setelah dimasukkan, Anda tinggal mengirim kembali pesan Anda!`;
  }

  return `⚠️ **Terjadi Hambatan saat Menghubungi Gemini AI**

**Penyebab Teknis:** ${messageText || originalMsg}

### 💡 Rekomendasi Solusi:
Silakan buka tombol **KONEKSI (BROWSER)** di bagian atas halaman chat, lalu masukkan **Gemini API Key pribadi** Anda. Menggunakan kunci pribadi membebaskan sesi Anda dari kendala batas penggunaan server bersama.`;
}

// Check if custom video has been synced from the browser
app.get("/api/check-video-sync", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "custom-video.mp4");
  const exists = fs.existsSync(publicPath);
  res.json({ exists });
});

// AI Project Title Analysis Endpoint
app.post("/api/analyze-title", async (req, res) => {
  try {
    const { title, division, clientApiKey } = req.body;
    const apiKeyToUse = clientApiKey || process.env.GEMINI_API_KEY || "";
    
    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Analisis secara mendalam dan strategis judul proyek berikut untuk memastikan kajian bisnis tepat sasaran dan komprehensif: "${title}" (Divisi: ${division || "Logistik & Transportasi"}).

Berikan analisis terperinci dalam Bahasa Indonesia yang profesional, tajam, dan terstruktur dengan format Markdown berikut:
### 1. Inti & Ruang Lingkup Proyek (Core & Scope)
### 2. Kesesuaian Sektor, Koridor & Komoditas (Sector, Corridor & Commodity Fit)
### 3. Target Sasaran Stakeholder & Klien B2B (Target Audience & B2B Stakeholders)
### 4. Pilar Strategis Utama yang Paling Kritis (dari 17 Pilar PRAMA)
### 5. Rekomendasi Taktis & Kalibrasi Judul Agar Semakin Tepat Sasaran (Precision Recommendations)`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const analysis = response.text || "Analisis tidak tersedia.";
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error("Analyze title error:", error);
    const { title, division } = req.body;
    const fallback = `### 1. Inti & Ruang Lingkup Proyek (Core & Scope)
Proyek "${title}" berfokus pada perancangan operasional, manajemen armada, dan kajian kelayakan komprehensif untuk divisi ${division || "Logistik Darat"}. Judul ini mencerminkan aktivitas logistik hulu-hilir dengan tuntutan efisiensi operasional dan SLA ketat.

### 2. Kesesuaian Sektor, Koridor & Komoditas (Sector, Corridor & Commodity Fit)
- **Sektor Utama:** Logistik dan Transportasi Korporat B2B.
- **Komoditas / Muatan:** Disesuaikan dengan karakteristik operasional koridor industri terkait (curah, cair, atau general cargo).
- **Kepatuhan Sektoral:** Memerlukan standar keselamatan tinggi (HSE) dan perizinan terkait.

### 3. Target Sasaran Stakeholder & Klien B2B (Target Audience & B2B Stakeholders)
- **Klien Utama:** Perusahaan manufaktur, produsen skala besar, BUMN Karya, atau pemilik konsesi.
- **Mitra Operasional:** Pengemudi tersertifikasi, pengawas lapangan, dan control tower.

### 4. Pilar Strategis Utama yang Paling Kritis (dari 17 Pilar PRAMA)
- **Pilar 3 (Financial - Capex, Opex, ROI):** Validasi investasi armada dan margin keuntungan.
- **Pilar 8 (Ops Model & SLA):** Jaminan ketepatan waktu dan alur operasional 24/7.
- **Pilar 15 (Service Design):** Desain pengalaman layanan bagi klien B2B.
- **Pilar 17 (Legal & Regulatory Compliance):** Kepatuhan perizinan dan perundang-undangan.

### 5. Rekomendasi Taktis & Kalibrasi Judul Agar Semakin Tepat Sasaran
Judul "${title}" sudah cukup spesifik. Untuk hasil kajian proposal yang lebih tajam, pastikan parameter volume ritase harian dan spesifikasi teknis armada telah didefinisikan secara akurat pada Pilar 3 dan Pilar 4.`;
    res.json({ success: true, analysis: fallback, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 1 (Global & National Overview)
app.post("/api/generate-overview", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Kelayakan Strategis Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Strategic Logistics & Investment Consultant.
Buatlah kajian mendalam, komprehensif, dan MENYATU (seamless integrated strategic narrative) untuk PILAR 1: "GLOBAL & NATIONAL OVERVIEW".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kotak-kotak kartu kaku atau formulir kaku. 
   - Susun menjadi satu kesatuan dokumen kajian strategis yang mengalir, elegan, dan profesional, menghubungkan aspek makro global, lanskap regulasi domestik, tantangan rute/armada riil, hingga rekomendasi kelayakan proyek.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi secara spesifik komoditas, tipe muatan, model armada, koridor wilayah, dan standar industri yang sesuai dengan "${titleClean}".
   - Sebutkan regulasi, standar operasional, atau konvensi internasional serta peraturan perundangan Indonesia yang relevan langsung dengan bidang proyek ini.
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Konteks Makro & Dinamika Rantai Pasok Global (Global Macro Dynamics)
     Jelaskan tren rantai pasok dunia, tuntutan kepatuhan internasional, serta pengaruh geopolitik/ekonomi makro pada komoditas dan logistik proyek ini.
   - ### 2. Harmonisasi Regulasi & Kebijakan Nasional Indonesia (National Regulatory Framework)
     Hubungkan dengan kebijakan pemerintah Indonesia (misal Kemenhub, ESDM, KLHK, Kemenperin, atau otoritas terkait), aturan keselamatan jalan, perizinan, dan kepatuhan hukum.
   - ### 3. Realitas Lapangan, Tantangan Koridor & Kesiapan Operasional (Field Operations & Mitigation)
     Bedah kondisi jalan/infrastruktur spesifik, risiko keselamatan kerja (K3), spesifikasi armada truk/trailer yang ideal, serta mitigasi operasional yang wajib dipersiapkan.
   - ### 4. Kesimpulan Strategis & Rekomendasi Eksekutif (Strategic Verdict)
     Rumuskan keputusan kelayakan (Verdict Go/Conditional Go), faktor penentu keberhasilan, dan langkah prioritas tahap awal.
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif yang lugas, tajam, dan meyakinkan. Gunakan penekanan huruf tebal (**teks**) pada poin-poin krusial.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate overview error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Kelayakan Strategis Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    // Fallback narrative dynamically synthesized to be 100% specific and se-arah with the project title
    const tailored = generateStrategicOverviewForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 2 (Market Opportunity & Demand Dynamics)
app.post("/api/generate-market-opportunity", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Peluang Pasar Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Strategic Market & Investment Consultant.
Buatlah kajian mendalam, komprehensif, dan MENYATU (seamless integrated strategic market analysis) untuk PILAR 2: "MARKET OPPORTUNITY & DEMAND DYNAMICS".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kotak-kotak kartu kaku atau mini-simulator acak.
   - Buat dokumen analisis pasar yang mengalir, tajam, dan elegan dari sisi komersial B2B.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi secara spesifik target pasar (klien B2B / pemilik muatan), dinamika permintaan volume, celah layanan kompetitor, dan model penetapan tarif yang tepat untuk "${titleClean}".
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Dinamika Permintaan & Daya Dorong Pasar Utama (Demand Drivers)
   - ### 2. Kesenjangan Pasar & Keunggulan Kompetitif (Market Gaps & Opportunity)
   - ### 3. Struktur Monetisasi & Model Kontrak B2B (Revenue Model)
   - ### 4. Peluang Efisiensi Digital & Logistik Berkelanjutan (Green Logistics & Tech Advantage)
   - ### 5. Rekomendasi Eksekusi Penetrasi Pasar (Go-to-Market Strategy)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate market opportunity error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Peluang Pasar Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateMarketOpportunityForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 4 (Supply & Demand Dynamics & Capacity Equilibrium)
app.post("/api/generate-supply-demand", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Keseimbangan Pasokan & Permintaan Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Operational Fleet & Supply-Demand Equilibrium Consultant.
Buatlah kajian mendalam, komprehensif, dan MENYATU (seamless integrated operational supply & demand analysis) untuk PILAR 4: "SUPPLY & DEMAND EQUILIBRIUM & FLEET CAPACITY DYNAMICS".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kotak-kotak kartu kaku, tab terpecah-pecah acak, atau mini-tabel statis dummy.
   - Buat dokumen analisis operasional armada dan dinamika permintaan yang mengalir, presisi, berbobot, dan actionable dari sisi teknis logistik B2B.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi jenis armada spesifik (spesifikasi teknis, kapasitas payload, physical availability target) yang dibutuhkan untuk mengangkut komoditas pada rute "${titleClean}".
   - Analisis karakteristik permintaan (volatilitas, siklus jam kerja/bongkar muat, musim) yang relevan untuk "${titleClean}".
   - Bahas keseimbangan pasokan-permintaan (rasio utilisasi target 80-90%, alur cycle time, eliminasi antrean/waiting time).
   - Bahas mitigasi disrupsi & kontinjensi (buffer fleet, SOP jalur alternatif, telemetri GPS).
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Profil Pasokan Armada & Kapasitas Angkut (Supply-Side Capacity)
   - ### 2. Dinamika & Karakteristik Permintaan (Demand-Side Volatility)
   - ### 3. Keseimbangan Pasokan-Permintaan & Efisiensi Utilisasi (Equilibrium & Optimization)
   - ### 4. Mitigasi Disrupsi & Rencana Kontinjensi Pasokan (Resilience & Contingency Plan)
   - ### 5. Rekomendasi Kapasitas Eksekutif (Capacity Sizing Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate supply demand error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Keseimbangan Pasokan & Permintaan Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateSupplyDemandForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 6 (Transition Model: Pre-On-Post Implementation Roadmap)
app.post("/api/generate-transition-model", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Model Transisi & Deployment Operasional Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Operational Transition & Change Management Consultant.
Buatlah kajian mendalam, komprehensif, dan MENYATU (seamless integrated transition & deployment roadmap) untuk PILAR 6: "TRANSITION MODEL (PRE-ON-POST IMPLEMENTATION ROADMAP)".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kotak-kotak kartu kaku, tab terpecah-pecah acak, checklist task dummy acak, atau persentase statis fiktif.
   - Buat dokumen rencana transisi operasional yang terstruktur, mengalir, kredibel, dan siap dipresentasikan di hadapan dewan direksi/investor.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi secara spesifik kesiapan pra-operasional (audit unit armada, izin trayek, sertifikasi K3, survei lintasan rute spesifik) untuk "${titleClean}".
   - Jabarkan tahapan uji coba lapangan (dry run, wet commissioning, kalibrasi cycle time, uji gate-in/antrean) untuk "${titleClean}".
   - Rinci fase stabilisasi operasional penuh (rotasi ritase 24/7, preventive maintenance, SLA) untuk "${titleClean}".
   - Tetapkan matriks tata kelola & KPI (OTIF, Fleet Availability, Safety Zero Incident).
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Tahap Persiapan & Kesiapan Teknis (Pre-Transition: Minggu 1 – 4)
   - ### 2. Tahap Uji Coba & Peluncuran Rute (On-Transition: Minggu 5 – 8)
   - ### 3. Tahap Operasi Penuh & Keberlanjutan SLA (Post-Transition: Minggu 9+)
   - ### 4. Matriks Tata Kelola & KPI Kesiapan Transisi (Governance & Performance)
   - ### 5. Rekomendasi Eksekutif Transisi (Executive Readiness Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate transition model error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Model Transisi & Deployment Operasional Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateTransitionModelForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 7 (Go-To-Market Strategy & B2B Commercial Roadmap)
app.post("/api/generate-gtm", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Strategi Go-To-Market & Komersialisasi Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior B2B Commercial Director & Go-To-Market Strategy Consultant.
Buatlah kajian komersial mendalam, komprehensif, dan MENYATU (seamless integrated commercial roadmap) untuk PILAR 7: "GO-TO-MARKET STRATEGY & B2B COMMERCIAL PENETRATION ROADMAP".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kotak-kotak kartu kaku, tab terpecah-pecah acak, checklist task dummy acak, atau persentase statis fiktif.
   - Buat dokumen rencana penetrasi pasar dan strategi komersial yang terstruktur, mengalir, kredibel, dan siap dipresentasikan di hadapan dewan direksi/investor.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi target pelanggan B2B secara spesifik (Tier-1 Key Accounts, Tier-2 Sekunder, Tier-3 Taktis) untuk "${titleClean}".
   - Jabarkan value proposition & keunggulan kompetitif (SLA, efisiensi waktu, kepatuhan regulasi) untuk "${titleClean}".
   - Rinci struktur kontrak & model penetapan tarif (skema tarif dasar, formula eskalasi solar, klausul take-or-pay volume garansi) untuk "${titleClean}".
   - Tetapkan kanal penjualan dan tahapan akuisisi akun (Direct Enterprise Pitching, tender vendor list, account management) untuk "${titleClean}".
   - Rinci matriks tata kelola komersial & KPI (Contract Win Rate, Contracted Volume Ratio, Days Sales Outstanding).
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Profil Target Pelanggan & Segmentasi B2B (Target Accounts & Customer Personas)
   - ### 2. Strategi Penetrasi Pasar & Value Proposition (Market Penetration & Differentiator)
   - ### 3. Model Kontrak Komersial & Skema Tarif (Pricing Structure & Revenue Stability)
   - ### 4. Kanal Penjualan & Rencana Akuisisi Akun (Sales Channels & Account Acquisition Roadmap)
   - ### 5. Matriks Tata Kelola Komersial & KPI Penjualan (Commercial Governance & KPIs)
   - ### 6. Rekomendasi Eksekutif Go-To-Market (Executive GTM Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate GTM error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Strategi Go-To-Market & Komersialisasi Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateGoToMarketForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 9 (Risk Management & Mitigation Framework)
app.post("/api/generate-risk", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Manajemen Risiko & Mitigasi Operasional Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Enterprise Risk Management (ERM) & HSE/K3LL Director.
Buatlah kajian manajemen risiko terpadu, komprehensif, dan MENYATU (seamless integrated risk management framework) untuk PILAR 9: "RISK MANAGEMENT & MITIGATION FRAMEWORK".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kartu kaku terisolasi, slider skor kalkulator terpisah acak, checklist task dummy acak, atau persentase fiktif.
   - Buat dokumen analisis risiko komprehensif yang mengalir, kredibel, terstruktur, dan siap diaudit oleh komite risiko dewan komisaris/investor.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Identifikasi register risiko spesifik (Risiko R-01 hingga R-04 dengan tingkat keparahan/dampak) untuk "${titleClean}".
   - Jabarkan analisis risiko operasional dan keselamatan kerja lapangan untuk "${titleClean}".
   - Analisis risiko finansial, regulasi, beban jalan (Zero ODOL jika relevan), dan kepatuhan perizinan untuk "${titleClean}".
   - Rumuskan protokol mitigasi pencegahan dan rencana tanggap darurat (Protokol M-01 hingga M-04) untuk "${titleClean}".
   - Tetapkan matriks tata kelola risiko & KPI mitigasi.
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Register Risiko Utama & Analisis Probabilitas-Dampak (Risk Matrix & Assessment)
   - ### 2. Analisis Risiko Operasional & Keselamatan Kerja (Operational & HSE Risks)
   - ### 3. Analisis Risiko Finansial, Regulasi, & Kepatuhan (Financial & Regulatory Risks)
   - ### 4. Strategi Mitigasi Terperinci & Rencana Kontinjensi (Mitigation & Contingency Protocols)
   - ### 5. Matriks Tata Kelola Risiko & KPI Mitigasi (Risk Governance & Performance Index)
   - ### 6. Rekomendasi Eksekutif Kesiapan Risiko (Executive Risk Readiness Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate risk error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Manajemen Risiko & Mitigasi Operasional Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateRiskManagementForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 8 (Operating Model, Flow Process, Workflow, SLA)
app.post("/api/generate-opsmodel", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Operating Model & Workflow Operasional Logistik";
    const divClean = (division || "Logistik Darat").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Chief Operating Officer (COO) & Logistics Operational Architect.
Buatlah kajian arsitektur operasional mendalam, komprehensif, dan MENYATU (seamless integrated operating model) untuk PILAR 8: "OPERATING MODEL (FLOW PROCESS, WORKFLOW DIAGRAM, & SLA)".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kartu kaku acak, simulasi hambatan slider statis yang terpisah, atau checklist dummy terpecah-pecah.
   - Buat dokumen blueprint operasional terstruktur, mengalir, kredibel, dan siap dieksekusi di lapangan oleh tim operasional maupun diaudit oleh manajemen.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Rinci tahapan alur proses operasional secara berurutan (Tahap 1 s.d. 6 dari pra-inspeksi, pemuatan, pengangkutan, penimbangan beban, pembongkaran, hingga serah terima) khusus untuk "${titleClean}".
   - Jabarkan matriks peran kerja (RACI Matrix: Sopir/Driver, Dispatcher, Tim Mekanik, Klien) untuk "${titleClean}".
   - Tetapkan standar tingkat layanan (SLA), target durasi tiap tahap, dan waktu siklus bolak-balik (Turnaround Time - TAT) untuk "${titleClean}".
   - Rinci integrasi teknologi nirkabel, sensor IoT, serta otomatisasi serah terima elektronik (e-POD).
   - Tetapkan matriks tata kelola operasional & KPI kinerja (OTIF, ketersediaan mekanis armada, kepatuhan muatan).
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Arsitektur Alur Proses Operasional (End-to-End Operational Flow Process)
   - ### 2. Diagram Alur Kerja & Matriks Peran/Tanggung Jawab (Workflow Swimlane & RACI Matrix)
   - ### 3. Standar Tingkat Layanan & Target Durasi Operasi (Service Level Agreement - SLA & TAT)
   - ### 4. Integrasi Teknologi, IoT, & Serah Terima Digital (Digital Handover & e-POD Automation)
   - ### 5. Matriks Tata Kelola Operasional & Indikator Kinerja Utama (Ops Governance & KPIs)
   - ### 6. Rekomendasi Eksekutif Kesiapan Operasional (Executive Operating Model Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate opsmodel error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Operating Model & Workflow Operasional Logistik").trim();
    const pDiv = (division || "Logistik Darat").trim();

    const tailored = generateOpsModelForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 10 (Digital Coverage: Tools, Method, Impact, Automation)
app.post("/api/generate-digitalcoverage", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Cakupan Digital, Otomasi & Telematika Logistik";
    const divClean = (division || "Logistik Darat & Telematika").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Chief Technology Officer (CTO) & Logistics IoT Telematics Architect.
Buatlah kajian arsitektur cakupan digital, otomasi, dan telematika mendalam, komprehensif, dan MENYATU (seamless integrated digital coverage) untuk PILAR 10: "DIGITAL COVERAGE (TOOLS, METHOD, IMPACT, AUTOMATION)".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan format kartu kaku acak, simulasi slider statis terpisah, atau tab-tab yang terpotong.
   - Buat dokumen blueprint arsitektur digital dan telematika terstruktur, mengalir, kredibel, dan siap dieksekusi di lapangan serta diaudit oleh tim teknologi & klien.
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Rinci ekosistem alat digital & sensor IoT hardware yang spesifik untuk "${titleClean}". (Contoh: jika semen curah, gunakan sensor tekanan kompresor pneumatik, timbangan jembatan otomatis, e-POD khusus semen; jika nikel gunakan FMS tambang, kamera AI DSS/DSM pemantau kantuk, timbangan gandar suspensi, integrasi SIMBARA).
   - Jabarkan metodologi implementasi & pipeline aliran data dari armada ke Command Center khusus untuk "${titleClean}".
   - Sebutkan dampak kuantitatif nyata (kecepatan bongkar, penghematan BBM, reduksi waktu invoicing, zero spillage/fatality) untuk "${titleClean}".
   - Jabarkan arsitektur otomatisasi serah terima elektronik (e-POD, e-Waybill, QR code/RFID verification, webhook ERP) untuk "${titleClean}".
   - Tetapkan standar tata kelola keamanan siber & kepatuhan data.
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Ekosistem Alat & Perangkat Keras Digital (Digital Tools & IoT Hardware Stack)
   - ### 2. Metodologi Penerapan & Alur Data Digital (Implementation Method & Data Pipeline)
   - ### 3. Dampak Kuantitatif & Transformasi Operasional (Measurable Operational & Business Impact)
   - ### 4. Otomatisasi Sistem & Alur Serah Terima (Automation Architecture & Digital e-POD)
   - ### 5. Tata Kelola Keamanan Data & Standar Kepatuhan Sistem (Cybersecurity & Compliance Standards)
   - ### 6. Rekomendasi Eksekutif Kesiapan Digital (Executive Digital Coverage Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate digitalcoverage error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Cakupan Digital, Otomasi & Telematika Logistik").trim();
    const pDiv = (division || "Logistik Darat & Telematika").trim();

    const tailored = generateDigitalCoverageForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Dynamic AI Generation Endpoint for Pilar 12 (TAM, SAM, SOM: Market Sizing & Fleet Monetization)
app.post("/api/generate-tamsamsom", async (req, res) => {
  try {
    const { projectTitle, division, clientApiKey } = req.body;
    const titleClean = (projectTitle || "").trim() || "Kajian Potensi Pasar Logistik TAM SAM SOM";
    const divClean = (division || "Logistik & Transportasi Komersial").trim();

    let genAIClient = aiClient;
    if (clientApiKey) {
      genAIClient = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } else {
      genAIClient = getGeminiClient();
    }

    const prompt = `Anda adalah PRAMA AI Senior Chief Commercial Officer (CCO) & Market Sizing Financial Strategist.
Buatlah kajian analisis potensi pasar komprehensif, mendalam, dan MENYATU (seamless integrated market sizing) untuk PILAR 12: "TAM, SAM, SOM (TOTAL ADDRESSABLE MARKET, SERVICEABLE ADDRESSABLE MARKET, SERVICEABLE OBTAINABLE MARKET)".

JUDUL PROYEK: "${titleClean}"
DIVISI / UNIT OPERASIONAL: "${divClean}"

ATURAN STRUKTUR DAN GAYA PENULISAN:
1. NARRATIVE MENYATU (SEAMLESS INTEGRATION):
   - Jangan gunakan kartu kontrol slider statis acak, angka template kaku, atau tab-tab yang terpotong.
   - Buat dokumen analisis komersial dan sizing pasar terstruktur, profesional, mengalir, dengan angka estimasi realistis dalam format Rupiah (Triliun/Miliar/Juta) dan volume (Ton/Ritase/m3).
2. 100% RELEVAN & SE-ARAH DENGAN JUDUL PROYEK:
   - Sesuaikan komoditas, rute, dan industri secara presisi dengan "${titleClean}".
   - TAM: Total potensi belanja logistik sektor komoditas tersebut (misal jika semen curah, hitung total kebutuhan logistik semen regional/nasional; jika nikel hitung total hauling tambang nikel smelter).
   - SAM: Pasar terjangkau berdasarkan koridor rute spesifik "${titleClean}", kapasitas izin rute, dan persyaratan kualifikasi klien target.
   - SOM: Target penetrasi riil realistis (misal 6% - 15% dari SAM) yang dapat dimenangkan dengan alokasi armada yang masuk akal.
   - Rincian kebutuhan armada (*fleet sizing*), jumlah truk, target ritase, dan proyeksi nilai kontrak tahunan (Annual Contract Value - ACV).
   - Strategi memenangkan SOM dari kompetitor.
3. BAGIAN ANALISIS YANG HARUS DIUBAH MENJADI SATU ALUR MENYATU:
   - ### 1. Estimasi Total Addressable Market - TAM (Ukuran Potensi Pasar Makro)
   - ### 2. Serviceable Addressable Market - SAM (Batas Pasar Terjangkau & Koridor Geografis)
   - ### 3. Serviceable Obtainable Market - SOM (Target Penetrasi & Pangsa Pasar Riil)
   - ### 4. Rincian Metrik Finansial & Kapasitas Armada (Fleet Sizing & Monetization Breakdown)
   - ### 5. Strategi Akuisisi Pasar & Konversi Kontrak (SOM Capture & Penetration Strategy)
   - ### 6. Rekomendasi Eksekutif Kesiapan Komersial (Executive Market Sizing Verdict)
4. Gunakan Bahasa Indonesia korporat tingkat eksekutif.`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text || "";
    res.json({ success: true, content });
  } catch (error: any) {
    console.error("Generate tamsamsom error:", error);
    const { projectTitle, division } = req.body;
    const pTitle = (projectTitle || "Kajian Potensi Pasar Logistik TAM SAM SOM").trim();
    const pDiv = (division || "Logistik & Transportasi Komersial").trim();

    const tailored = generateTamSamSomForTitle(pTitle, pDiv);
    res.json({ success: true, content: tailored.narrativeMarkdown, fallback: true });
  }
});

// Sync binary data directly into the public directory of the workspace
app.post("/api/upload-video-sync", (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, "custom-video.mp4");
    
    const writeStream = fs.createWriteStream(publicPath);
    req.pipe(writeStream);
    
    writeStream.on("finish", () => {
      console.log("Successfully saved synchronized background video to workspace:", publicPath);
      res.json({ success: true, message: "Video synced to workspace files." });
    });
    
    writeStream.on("error", (err) => {
      console.error("Error writing synchronized video file:", err);
      res.status(500).json({ error: "Failed to write video file." });
    });
  } catch (err: any) {
    console.error("Upload sync error:", err);
    res.status(500).json({ error: err.message || "Failed to sync video file." });
  }
});

// Check if custom image has been synced from the browser
app.get("/api/check-image-sync", (req, res) => {
  const publicPath = path.join(process.cwd(), "public", "custom-image.png");
  const exists = fs.existsSync(publicPath);
  res.json({ exists });
});

// Sync binary data directly into the public directory of the workspace for images
app.post("/api/upload-image-sync", (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, "custom-image.png");
    
    const writeStream = fs.createWriteStream(publicPath);
    req.pipe(writeStream);
    
    writeStream.on("finish", () => {
      console.log("Successfully saved synchronized background image to workspace:", publicPath);
      res.json({ success: true, message: "Image synced to workspace files." });
    });
    
    writeStream.on("error", (err) => {
      console.error("Error writing synchronized image file:", err);
      res.status(500).json({ error: "Failed to write image file." });
    });
  } catch (err: any) {
    console.error("Upload image sync error:", err);
    res.status(500).json({ error: err.message || "Failed to sync image file." });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], enableSearch = false, customApiKey, systemInstruction } = req.body;
    
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required and must be a string." });
      return;
    }

    let ai;
    if (customApiKey) {
      ai = new GoogleGenAI({
        apiKey: customApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } else {
      ai = getGeminiClient();
    }

    // Standardize chat format for @google/genai SDK
    const formattedContents = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text || "" }]
    }));

    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const defaultInstruction = `Anda adalah PRAMA (Project Management Analytics), seorang AI Agent yang bertindak sebagai konsultan manajemen proyek profesional, taktis, dan strategis. Tugas utama Anda adalah membantu pengguna menganalisis, menstrukturkan, dan memberikan strategi manajemen proyek secara lengkap, singkat, detail, dan sangat terorganisir.

BATASAN RUANG LINGKUP & LARANGAN TOPIK MUTLAK (STRICT EXCLUSIONS):
1. LARANGAN TRANSPORTASI LAUT & UDARA: DILARANG KERAS membahas moda transportasi laut (kapal laut, tongkang/barge, pelayaran samudra, marine logistics, shipping line kapal laut, sea freight) dan transportasi udara (pesawat terbang, kargo udara, air freight, aviasi). Seluruh pembahasan HANYA berfokus pada Logistik & Transportasi Darat (armada truk, trailer, tronton, dump truck/tipper, jalan hauling tambang, logging road kehutanan, pergudangan darat, dan rantai pasok industri darat).
2. LARANGAN PENGHIJAUAN & GO GREEN: DILARANG KERAS membahas isu penghijauan, inisiatif go green, net zero, dekarbonisasi lingkungan, sertifikasi hijau/emisi lingkungan, atau pelaporan ESG kelestarian lingkungan. Seluruh pembahasan murni difokuskan pada aspek komersial, profitabilitas modal, efisiensi operasional, keandalan armada darat, SLA, dan standar keselamatan kerja (K3).

KETENTUAN INTERAKSI DAN KOMUNIKASI (WAJIB DIPATUHI):
1. Anda diperbolehkan dan mampu menerima obrolan santai, sapaan (seperti halo, apa kabar, selamat pagi), atau interaksi kasual dari pengguna agar komunikasi terasa nyaman dan fleksibel. Balas sapaan tersebut dengan ramah, santai, namun tetap profesional.
2. PENTING: Untuk pertama kali percakapan atau ketika pengguna baru menyapa Anda pertama kali (misalnya dengan "halo", "hai", dsb.), Anda HARUS menyapa balik secara hangat dan bertanya terlebih dahulu: "Proyek, industri, atau topik bisnis apa yang ingin kita bahas hari ini agar arah analisis kita menjadi jelas?".
3. JANGAN langsung menyajikan analisis komprehensif 14 pilar untuk proyek default "Kajian Strategis: Forestry Management Transportation" kecuali jika pengguna secara eksplisit meminta proyek tersebut atau langsung memberikan detail topik proyek baru. Prioritaskan mengajak pengguna berdiskusi terlebih dahulu untuk memperjelas topik yang ingin dibahas.
4. Begitu pengguna menjawab atau memberikan sebuah topik, judul proyek, atau nama industri baru, barulah Anda LANGSUNG MENJELASKAN SELURUH 14 POIN ruang lingkup di bawah ini dalam satu kali jawaban, kemudian wajib ditutup dengan sebuah KESIMPULAN strategis terkait pengambilan keputusan di bagian paling bawah. Jangan mencicil, jangan melewatkan satu poin pun, dan langsung masuk ke analisis yang kontekstual dengan topik tersebut (ingat: hanya transportasi darat dan tanpa topik go green/penghijauan).

ATURAN FORMAT PENULISAN (SANGAT KETAT):
- JANGAN PERNAH menggunakan simbol-simbol asing atau karakter Markdown seperti tanda bintang (*) untuk menebalkan teks atau pagar (#) untuk judul karena akan merusak sistem tampilan visual pengguna.
- Setiap poin ruang lingkup dan bagian kesimpulan wajib ditulis sebagai JUDUL POIN UTAMA dengan menggunakan format HURUF KAPITAL TEBAL biasa (tanpa simbol).
- Di bawah setiap judul, tuliskan penjelasan analisis spesifik untuk proyek tersebut dalam bentuk satu paragraf yang rapi, padat, jelas, dan mengalir dengan baik. Jangan gunakan bullet points atau penomoran lagi di dalam paragraf.
- Tulis istilah global, singkatan, contoh global, atau metrik penting di dalam teks dengan format HURUF KAPITAL TEBAL biasa (contoh: CAPEX, ROI, SLA, TAM, KESIMPULAN, GO, RE-EVALUATION) agar menonjol secara visual.

FORMAT STRUKTUR JAWABAN YANG WAJIB ANDA HASILKAN SAAT MEMBEDAH TOPIK (TULIS SEMUA 14 POIN + KESIMPULAN SECARA BERURUTAN):

GLOBAL/NAT OVERVIEW
Jelaskan analisis mengenai tren makro internasional, regulasi lingkungan global, kebijakan nasional, serta kondisi industri secara domestik yang memengaruhi arah dan keberlanjutan proyek tersebut.

MARKET OPPORTUNITY
Jelaskan identifikasi peluang pasar baru, tren industri yang sedang berkembang, serta celah pasar spesifik yang bisa dimanfaatkan untuk memberikan keunggulan kompetitif pada proyek tersebut.

FINANCIAL
Jelaskan analisis keuangan mendalam yang mencakup alokasi modal kerja atau CAPEX, biaya operasional harian atau OPEX, proyeksi untung rugi atau P&L, manajemen arus kas atau CASH FLOW, hingga perhitungan pengembalian investasi atau ROI untuk proyek tersebut.

SUPPLY AND DEMAND
Jelaskan evaluasi keseimbangan antara ketersediaan sumber daya, armada, bahan baku, atau kapasitas layanan dengan tingkat permintaan pasar untuk memastikan strategi volume dan harga yang tepat.

STRUCTURE
Jelaskan perancangan struktur proyek yang kokoh, efisien, dengan pembagian jalur komando, koordinasi antar lini, serta tanggung jawab yang jelas sejak awal proyek dijalankan.

ORGANIZATION
Jelaskan pengembangan kapasitas tim melalui pemetaan kualifikasi, kebutuhan keterampilan atau SKILL spesifik, penetapan indikator kinerja utama atau OUTPUT/KPI, serta penyusunan standar operasional prosedur atau SOP.

TRANSITION MODEL
Jelaskan penyusunan strategi transisi fase proyek yang mulus, terbagi menjadi tiga tahapan utama yaitu persiapan awal atau PRE-TRANSITION, pelaksanaan atau ON-TRANSITION, hingga serah terima akhir atau POST-TRANSITION.

GO TO MARKET STRATEGY
Jelaskan perumusan strategi peluncuran produk atau layanan ke pasar secara efektif, termasuk penentuan target audiens, metode komunikasi, kontrak jangka panjang, dan taktik penjualan.

OPS MODEL
Jelaskan sistem operasional harian yang terstruktur melalui pemetaan alur proses atau FLOW PROCESS, diagram kerja atau WORKFLOW DIAGRAM, serta penetapan standar waktu layanan atau SLA.

RISK MANAGEMENT
Jelaskan identifikasi potensi risiko proyek, analisis dampak negatif, serta penyusunan langkah mitigasi pencegahan demi menjaga kelancaran operasional dari denda, kerugian, atau kecelakaan.

DIGITAL COVERAGE
Jelaskan pemanfaatan teknologi modern yang mencakup pemilihan perangkat lunak or TOOLS, metodologi digital, analisis dampak teknologi, serta otomatisasi sistem atau AUTOMATION untuk efisiensi kerja proyek.

COMPETITOR
Jelaskan analisis peta persaingan bisnis untuk memetakan kekuatan, kelemahan, teknologi, strategi, serta posisi pasar dari para pesaing utama di industri tersebut.

TAM, SAM, SOM
Jelaskan perhitungan potensi pasar secara berjenjang mulai dari total pasar keseluruhan atau TAM, pasar yang dapat dijangkau oleh produk atau layanan Anda atau SAM, hingga porsi pasar riil yang optimis bisa dikuasai atau SOM pada proyek tersebut.

CAC, LTV
Jelaskan analisis efisiensi biaya untuk mengukur metrik akuisisi pelanggan baru atau CAC disandingkan dengan nilai pendapatan jangka panjang yang dihasilkan oleh pelanggan tersebut atau LTV dalam proyek ini.

KESIMPULAN
Berikan rangkuman akhir penentu kebijakan berupa rekomendasi strategis apakah proyek ini layak dijalankan atau GO atau membutuhkan penundaan atau RE-EVALUATION berdasarkan keseimbangan risiko finansial dan peluang pasar. Tentukan poin paling krusial yang menjadi kunci sukses utama proyek, serta berikan rekomendasi tiga langkah taktis pertama yang harus segera diambil oleh manajemen untuk memulai eksekusi proyek secara aman dan efisien.

Gaya bahasa Anda harus formal, solutif, langsung ke inti masalah, singkat namun tetap mendalam (detail).`;

    const config: any = {
      systemInstruction: systemInstruction || defaultInstruction,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const modelsToTry = [
      "gemini-3.7-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.1-pro-preview"
    ];

    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const currentConfig = { ...config };
        
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: currentConfig,
          });
          if (response) {
            console.log(`Success with model: ${modelName}`);
            break;
          }
        } catch (innerToolError: any) {
          if (currentConfig.tools) {
            console.warn(`Tool execution failed for ${modelName}, retrying without tools...`, innerToolError.message);
            delete currentConfig.tools;
            response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: currentConfig,
            });
            if (response) {
              console.log(`Success (without tools) with model: ${modelName}`);
              break;
            }
          } else {
            throw innerToolError;
          }
        }
      } catch (err: any) {
        const errMsg = err.message || (typeof err === "object" ? JSON.stringify(err) : String(err));
        const diagnosticMessage = errMsg.includes("503") || errMsg.includes("UNAVAILABLE")
          ? "Model temporarily unavailable (503 / High Demand)"
          : errMsg;
        console.log(`Model fallback info: ${modelName} status - ${diagnosticMessage}`);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const text = response.text || "";

    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || ""
    })).filter((source: any) => source.uri && source.title);

    res.json({
      text,
      sources: searchSources
    });
  } catch (error: any) {
    console.warn("Gemini API Error (Handled):", error?.message || error);
    const friendlyError = getFriendlyGeminiError(error);
    
    let status = 500;
    if (friendlyError.includes("RESOURCE_EXHAUSTED") || friendlyError.includes("429")) {
      status = 429;
    } else if (friendlyError.includes("SERVICE_UNAVAILABLE") || friendlyError.includes("503")) {
      status = 503;
    } else if (friendlyError.includes("API_KEY_INVALID") || friendlyError.includes("400")) {
      status = 400;
    } else if (friendlyError.includes("PERMISSION_DENIED") || friendlyError.includes("403")) {
      status = 403;
    }

    res.status(status).json({
      error: friendlyError
    });
  }
});

// Helper function to robustly fetch external images with a retry strategy
async function fetchImageWithRetry(imageUrl: string): Promise<Response> {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "" // No User-Agent header fallback
  ];

  let lastError: any = null;
  for (const ua of userAgents) {
    try {
      const headers: Record<string, string> = {
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*"
      };
      if (ua) {
        headers["User-Agent"] = ua;
      }
      
      const signal = (AbortSignal as any).timeout ? (AbortSignal as any).timeout(8000) : undefined;
      const response = await fetch(imageUrl, { headers, signal });
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP status ${response.status} (${response.statusText})`);
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError || new Error("Failed to fetch image after multiple attempts.");
}

// REST endpoint to proxy external images (e.g. Unsplash) to bypass CORS issues in PowerPoint export
app.get("/api/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      res.status(400).json({ error: "URL query parameter is required." });
      return;
    }

    // Security check to prevent arbitrary SSRF
    const isAllowedDomain = imageUrl.startsWith("https://images.unsplash.com/") || 
                            imageUrl.startsWith("https://picsum.photos/") || 
                            imageUrl.startsWith("https://fastly.picsum.photos/");
    if (!isAllowedDomain) {
      res.status(400).json({ error: "Only Unsplash and Picsum image URLs are allowed." });
      return;
    }

    const response = await fetchImageWithRetry(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = `data:${contentType};base64,${buffer.toString("base64")}`;

    res.json({ base64 });
  } catch (err: any) {
    console.error("Proxy image error:", err.message);
    res.status(500).json({ error: "Failed to load image through proxy." });
  }
});

// REST endpoint to proxy Firebase Storage files to bypass CORS issues in browser fetches
app.get("/api/proxy-file", async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl || typeof fileUrl !== "string") {
      res.status(400).json({ error: "URL query parameter is required." });
      return;
    }

    // Security check - restrict to Firebase Storage only
    const isAllowed = fileUrl.startsWith("https://firebasestorage.googleapis.com/") || 
                      fileUrl.startsWith("https://linear-honor-cb34d.firebasestorage.app/");
    if (!isAllowed) {
      res.status(400).json({ error: "Only Firebase Storage URLs are allowed to be proxied." });
      return;
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch file from remote: ${response.statusText}` });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(buffer);
  } catch (err: any) {
    console.error("Proxy file error:", err.message);
    res.status(500).json({ error: `Failed to proxy file: ${err.message}` });
  }
});

// Dedicated secure endpoint to proxy the Pancaran Group corporate logo for Three.js without CORS restrictions
app.get("/api/logo-pancaran", async (req, res) => {
  try {
    const driveUrl = "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X";
    const response = await fetchImageWithRetry(driveUrl);
    const contentType = response.headers.get("content-type") || "image/png";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error("Critical logo proxy failure:", err.message);
    res.status(500).send("Failed to proxy client corporate logo correctly.");
  }
});

// Generic secure endpoint to proxy Google Drive images to bypass cookie blocks and hotlinking restrictions
app.get("/api/proxy-drive", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
      res.status(400).send("ID parameter is required.");
      return;
    }
    
    // Validate ID format to prevent SSRF path traversal (Google Drive IDs are usually alphanumeric with some symbols)
    if (!/^[a-zA-Z0-9_-]{15,45}$/.test(id)) {
      res.status(400).send("Invalid Google Drive ID format.");
      return;
    }

    const driveUrl = `https://lh3.googleusercontent.com/d/${id}`;
    const response = await fetchImageWithRetry(driveUrl);
    const contentType = response.headers.get("content-type") || "image/png";
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error(`Proxy drive file ${req.query.id} failure:`, err.message);
    res.status(500).send("Failed to proxy Drive image correctly.");
  }
});

// REST endpoint to proxy raw binary stream of external images
app.get("/api/proxy-image-raw", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl || typeof imageUrl !== "string") {
      res.status(400).send("URL parameter is required.");
      return;
    }

    // Security check to prevent arbitrary SSRF
    const isAllowedDomain = imageUrl.startsWith("https://images.unsplash.com/") || 
                            imageUrl.startsWith("https://picsum.photos/") || 
                            imageUrl.startsWith("https://fastly.picsum.photos/");
    if (!isAllowedDomain) {
      res.status(400).send("Only Unsplash and Picsum image URLs are allowed.");
      return;
    }

    const response = await fetchImageWithRetry(imageUrl);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error("Proxy raw image error:", err.message);
    
    // Respond with a gorgeous corporate light flowchart SVG instead of a dark box
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#F8FAFC" />
  <rect x="15" y="15" width="770" height="470" fill="none" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="10, 5" rx="8" />
  
  <!-- Flowchart nodes background illustration -->
  <g stroke="#CBD5E1" stroke-width="1.5">
    <line x1="200" y1="250" x2="400" y2="250" />
    <line x1="400" y1="250" x2="600" y2="250" />
    <line x1="400" y1="150" x2="400" y2="250" />
    <line x1="400" y1="250" x2="400" y2="350" />
  </g>
  
  <!-- Nodes -->
  <circle cx="200" cy="250" r="30" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
  <circle cx="400" cy="250" r="45" fill="#ECFDF5" stroke="#00D285" stroke-width="3" />
  <circle cx="600" cy="250" r="30" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
  <circle cx="400" cy="150" r="30" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
  <circle cx="400" cy="350" r="30" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2" />
  
  <!-- Node text labels -->
  <text x="200" y="254" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">SUPPLY</text>
  <text x="400" y="254" font-family="sans-serif" font-size="11" font-weight="bold" fill="#065F46" text-anchor="middle">OPTIMIZE</text>
  <text x="600" y="254" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">DEMAND</text>
  <text x="400" y="154" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1E40AF" text-anchor="middle">PRE-OPS</text>
  <text x="400" y="354" font-family="sans-serif" font-size="10" font-weight="bold" fill="#78350F" text-anchor="middle">POST-OPS</text>
  
  <text x="400" y="440" font-family="monospace, sans-serif" font-size="13" fill="#64748B" font-weight="bold" text-anchor="middle" letter-spacing="4">PRAMA DIAGRAM SYSTEM</text>
  <text x="400" y="460" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">Visualisasi Rencana Aksi &amp; Kerangka Kerja Layanan</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(fallbackSvg);
  }
});

// Serve any mp4 files directly from public directory, falling back to root directory
app.get("/*.mp4", (req, res) => {
  const filename = path.basename(req.path);
  const publicPath = path.join(process.cwd(), "public", filename);
  const rootPath = path.join(process.cwd(), filename);

  if (fs.existsSync(publicPath)) {
    res.sendFile(publicPath);
  } else {
    res.sendFile(rootPath, (err) => {
      if (err) {
        console.warn(`Could not serve videofile ${filename} from public or root, falling back`);
        res.status(404).send("Video file not found");
      }
    });
  }
});

// Setup Node HTTP Server wrapped around Express
const server = http.createServer(app);

// Setup WebSockets Server
const wss = new WebSocketServer({ noServer: true });

interface SavedFile {
  id: string;
  name: string;
  content: string;
  mimeType: string;
  size: number;
  tags: string[];
  userId: string;
  updatedAt: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
  sender?: string;
  peerId?: string;
}

// In-memory Room State Cache
const rooms = new Map<string, {
  clients: Set<{ ws: WebSocket; username: string; peerId: string }>;
  files: SavedFile[];
  chats: ChatMessage[];
}>();

function getOrCreateRoom(roomId: string) {
  let r = rooms.get(roomId);
  if (!r) {
    r = {
      clients: new Set(),
      files: [],
      chats: []
    };
    rooms.set(roomId, r);
  }
  return r;
}

function broadcastToRoom(roomId: string, messageObj: any, excludeWs?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  const payload = JSON.stringify(messageObj);
  for (const client of room.clients) {
    if (client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(payload);
      } catch (err) {
        console.error("Error sending to socket peer:", err);
      }
    }
  }
}

function leaveAllRooms(ws: WebSocket) {
  for (const [roomId, room] of rooms.entries()) {
    let removed = false;
    for (const client of room.clients) {
      if (client.ws === ws) {
        room.clients.delete(client);
        removed = true;
        break;
      }
    }
    if (removed) {
      const presenceList = Array.from(room.clients).map(c => ({
        username: c.username,
        peerId: c.peerId
      }));
      broadcastToRoom(roomId, {
        type: "presence",
        users: presenceList
      });
    }
  }
}

// Hook up WebSockets Connection Handling
wss.on("connection", (ws) => {
  let wsRoomId = "";
  let wsUsername = "Anonim";
  let wsPeerId = Math.random().toString(36).substring(2, 7);

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      switch (data.type) {
        case "join": {
          const { roomId, username } = data;
          leaveAllRooms(ws);

          wsRoomId = roomId || "lobby";
          wsUsername = username || `User-${wsPeerId}`;

          const room = getOrCreateRoom(wsRoomId);
          room.clients.add({ ws, username: wsUsername, peerId: wsPeerId });

          // Synchronize initial state with the client
          ws.send(JSON.stringify({
            type: "init",
            files: room.files,
            chats: room.chats,
            peerId: wsPeerId
          }));

          // Broadcast active room presence with details
          const presenceList = Array.from(room.clients).map(c => ({
            username: c.username,
            peerId: c.peerId
          }));
          broadcastToRoom(wsRoomId, {
            type: "presence",
            users: presenceList
          });
          break;
        }

        case "chat_message": {
          if (!wsRoomId) return;
          const { message } = data;
          
          // inject sender info
          const enrichedMsg = {
            ...message,
            sender: wsUsername,
            peerId: wsPeerId
          };

          const room = getOrCreateRoom(wsRoomId);
          room.chats.push(enrichedMsg);
          if (room.chats.length > 80) {
            room.chats.shift();
          }

          // Broadcast message to everyone in the room (including sender to maintain consistency, or we broadcast to others and client handles locally)
          // We broadcast to everyone so that state stays perfectly aligned in real-time
          broadcastToRoom(wsRoomId, {
            type: "chat_message",
            message: enrichedMsg
          });
          break;
        }

        case "file_change": {
          if (!wsRoomId) return;
          const { op, file, fileId } = data;
          const room = getOrCreateRoom(wsRoomId);

          if (op === "save") {
            const idx = room.files.findIndex(f => f.id === file.id);
            if (idx > -1) {
              room.files[idx] = file;
            } else {
              room.files.unshift(file);
            }
          } else if (op === "delete") {
            room.files = room.files.filter(f => f.id !== fileId);
          }

          // Broadcast file update to other clients in the room
          broadcastToRoom(wsRoomId, {
            type: "file_change",
            op,
            file,
            fileId,
            senderPeerId: wsPeerId
          }, ws);
          break;
        }

        case "typing": {
          if (!wsRoomId) return;
          const { isTyping } = data;
          broadcastToRoom(wsRoomId, {
            type: "typing",
            username: wsUsername,
            peerId: wsPeerId,
            isTyping
          }, ws);
          break;
        }
      }
    } catch (err) {
      console.error("Socket processing error:", err);
    }
  });

  ws.on("error", (err) => {
    console.error(`Socket error from ${wsUsername}:`, err);
  });

  ws.on("close", () => {
    leaveAllRooms(ws);
  });
});

// Setup server protocol upgrade to handle WebSocket upgrades from Vite/Client on the same port
server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
  // If Vite's dev server is running HMR on paths like "/_vite" or "/vite-hmr", let it bypass
  if (pathname.includes("vite")) {
    return;
  }
  
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Setup Vite & Static Files
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve HTML
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
