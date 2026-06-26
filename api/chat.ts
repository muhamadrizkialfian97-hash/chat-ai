import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history = [], enableSearch = false, customApiKey, systemInstruction } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    let apiKey = (customApiKey || "").trim();
    if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    }
    if (!apiKey) {
      apiKey = (process.env.GEMINI_API_KEY || "").trim();
    }
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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

KETENTUAN INTERAKSI DAN KOMUNIKASI (WAJIB DIPATUHI):
1. Anda diperbolehkan dan mampu menerima obrolan santai, sapaan (seperti halo, apa kabar, selamat pagi), atau interaksi kasual dari pengguna agar komunikasi terasa nyaman dan fleksibel. Balas sapaan tersebut dengan ramah, santai, namun tetap profesional.
2. Ketika merespons obrolan santai tanpa topik proyek, ingatkan pengguna secara halus bahwa Anda selalu siap melakukan analisis mendalam begitu mereka memberikan topik proyek, judul bisnis, atau nama industri spesifik.
3. Begitu pengguna memberikan sebuah topik, judul proyek, atau nama industri, Anda harus LANGSUNG MENJELASKAN SELURUH 14 POIN ruang lingkup di bawah ini dalam satu kali jawaban, kemudian wajib ditutup dengan sebuah KESIMPULAN strategis terkait pengambilan keputusan di bagian paling bawah. Jangan mencicil, jangan melewatkan satu poin pun, dan langsung masuk ke analisis yang kontekstual dengan topik tersebut.

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
Jelaskan pemanfaatan teknologi modern yang mencakup pemilihan perangkat lunak atau TOOLS, metodologi digital, analisis dampak teknologi, serta otomatisasi sistem atau AUTOMATION untuk efisiensi kerja proyek.

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
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-3.1-pro-preview"
    ];

    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model on Vercel: ${modelName}`);
        const currentConfig = { ...config };
        
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: formattedContents,
            config: currentConfig,
          });
          if (response) {
            console.log(`Success with model on Vercel: ${modelName}`);
            break;
          }
        } catch (innerToolError: any) {
          if (currentConfig.tools) {
            console.warn(`Tool execution failed for ${modelName} on Vercel, retrying without tools...`, innerToolError.message);
            delete currentConfig.tools;
            response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: currentConfig,
            });
            if (response) {
              console.log(`Success (without tools) with model on Vercel: ${modelName}`);
              break;
            }
          } else {
            throw innerToolError;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or unavailable on Vercel:`, err.message || err);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const rawText = response.text || "";
    // Clean all * and # characters to guarantee formatting aligns perfectly with user instructions
    const text = rawText.replace(/[*#]/g, "");

    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || ""
    })).filter((source: any) => source.uri && source.title);

    return res.status(200).json({
      text,
      sources: searchSources
    });
  } catch (error: any) {
    console.error("Gemini API Error in Handler:", error);
    const friendlyError = getFriendlyGeminiError(error);
    
    // Attempt to determine correct HTTP status
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

    return res.status(200).json({
      isError: true,
      statusCode: status,
      error: friendlyError
    });
  }
}
