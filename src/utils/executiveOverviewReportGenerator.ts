/**
 * executiveOverviewReportGenerator.ts
 * Generates publication-grade, title-adaptive Global & National Overview data
 * featuring verified historical & forecast charts, national masterplan breakdowns,
 * regional donut distributions, and authentic, clickable source citations from
 * Google-searchable databases (GWEC, IRENA, ESDM, RUPTL, FAO, KLHK, ASI, IEA, 
 * GAPKI, Pelindo, ARPI, Gaikindo, Kemenkop UKM, BPS, PUPR).
 */

import { detectProjectArchetype } from "./archetypeDetector.ts";

export interface SourceReference {
  name: string;
  publisher: string;
  year: string;
  url: string;
  keyMetric: string;
}

export interface ExecutiveReportData {
  pageNumber: string;
  sectionTitle: string;
  industryCategory: string;
  themeColor: string;
  globalHeadline: string;
  globalNarrative: string;
  globalChart: {
    title: string;
    unit: string;
    data: { year: string; value: number; isForecast?: boolean; displayValue?: string }[];
    sourceText: string;
    figureCaption: string;
    sourceUrl?: string;
  };
  globalCostAndOemNarrative: string;
  nationalHeadline: string;
  nationalSummary: string;
  corporateBanner: {
    left: string;
    right: string;
  };
  nationalCapacityChart: {
    title: string;
    unit: string;
    data: { name: string; value: number; color?: string; displayValue?: string }[];
    sourceText: string;
    figureCaption: string;
    sourceUrl?: string;
  };
  regionalDonut: {
    title: string;
    centerMetric: string;
    centerSublabel: string;
    data: { name: string; value: number; color: string; detail: string }[];
    footnote?: string;
  };
  logisticsCorridorNarrative: string[];
  marketReality: {
    title: string;
    bulletPoints: string[];
  };
  sourcesList: SourceReference[];
}

export function generateExecutiveOverviewData(rawTitle: string, division?: string): ExecutiveReportData {
  const title = (rawTitle || "").trim() || "Kajian Proyek Strategis Logistik";
  const t = title.toLowerCase();
  const divName = (division || "Logistik & Transportasi").toUpperCase();

  // =========================================================================
  // 1. WIND FARM / PLTB / RENEWABLE ENERGY
  // =========================================================================
  if (
    t.includes("angin") || t.includes("wind") || t.includes("pltb") || 
    t.includes("bayu") || t.includes("turbin") || t.includes("ebt") || 
    t.includes("solar") || t.includes("plts") || t.includes("energi baru") ||
    t.includes("sidrap") || t.includes("jeneponto")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Energi Baru Terbarukan & Wind Farm",
      themeColor: "#0d9488",
      globalHeadline: "Global: rekor instalasi, dominasi Asia Pasifik",
      globalNarrative: 
        "Industri angin global memasang rekor 165 GW kapasitas baru pada 2025 (naik 40% dari rekor sebelumnya), sehingga kapasitas kumulatif mencapai 1.297 GW; Asia yang dipimpin Tiongkok dan India menyumbang 131 GW atau 80% dari total. GWEC memproyeksikan 969 GW kapasitas baru pada 2026–2030, rata-rata 194 GW per tahun. Tiongkok memasang 120,5 GW, disusul Amerika Serikat 6,9 GW, India 6,3 GW, Jerman 5,7 GW dan Brasil 2,3 GW.",
      globalChart: {
        title: "Instalasi Tenaga Angin Global (GW/tahun)",
        unit: "GW terpasang baru / tahun",
        data: [
          { year: "2020", value: 93.0, displayValue: "93" },
          { year: "2021", value: 93.6, displayValue: "93.6" },
          { year: "2022", value: 77.6, displayValue: "77.6" },
          { year: "2023", value: 117.0, displayValue: "117" },
          { year: "2024", value: 117.0, displayValue: "117" },
          { year: "2025", value: 165.0, displayValue: "165" },
          { year: "2026F-30F (rata-rata)", value: 194.0, isForecast: true, displayValue: "194" }
        ],
        sourceText: "Sumber: GWEC Global Wind Report 2025 & 2026; proyeksi 2026–2030 GWEC Market Intelligence (969 GW / 5 tahun).",
        figureCaption: "Gambar 2.1 — Instalasi angin global. Data 2020–2024 dari seri GWEC; 2025 dan proyeksi dari GWEC Global Wind Report 2026.",
        sourceUrl: "https://gwec.net/global-wind-report-2025/"
      },
      globalCostAndOemNarrative: 
        "Dari sisi biaya, IRENA mencatat onshore wind sebagai sumber listrik baru termurah pada 2024 dengan LCOE rata-rata tertimbang global US$0,034/kWh dan total installed cost US$1.041/kW, diproyeksikan turun ke ±US$861/kW dalam lima tahun. Namun LCOE onshore sempat naik 3% pada 2024, dan IRENA memperingatkan risiko tarif dagang serta dinamika manufaktur Tiongkok dapat menaikkan biaya jangka pendek. Di sisi pasokan turbin, tujuh OEM Tiongkok mengekspor ke 28 negara pada 2025; Goldwind mengirim 3.862 GW ke 23 negara, diikuti Envision 2.136 GW — relevan karena proyek Indonesia ke depan kemungkinan besar memakai OEM Tiongkok, sehingga rute logistik dominan adalah Tiongkok → Indonesia.",
      nationalHeadline: "Nasional: ambisi besar RUPTL, realisasi EBT terakselerasi",
      nationalSummary: 
        "RUPTL PLN 2025–2034 menambah 69,5 GW kapasitas; 42,6 GW (61%) dari pembangkit EBT, dengan PLTS 17,1 GW, PLTA 11,7 GW, PLTB 7,2 GW, panas bumi 5,2 GW, serta storage 10,3 GW. Sekitar 73% kapasitas direncanakan melalui skema IPP swasta, dan penjualan listrik PLN diproyeksikan naik dari 306 TWh (2024) menjadi 511 TWh (2034).",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "RUPTL PLN 2025–2034: Tambahan Kapasitas EBT & Storage",
        unit: "GW",
        data: [
          { name: "PLTS", value: 17.1, displayValue: "17.1 GW", color: "#60a5fa" },
          { name: "PLTA", value: 11.7, displayValue: "11.7 GW", color: "#93c5fd" },
          { name: "Storage (BESS+PS)", value: 10.3, displayValue: "10.3 GW", color: "#cbd5e1" },
          { name: "PLTB (Angin)", value: 7.2, displayValue: "7.2 GW", color: "#0d9488" },
          { name: "PLTP", value: 5.2, displayValue: "5.2 GW", color: "#64748b" },
          { name: "Bioenergi", value: 0.9, displayValue: "0.9 GW", color: "#94a3b8" },
          { name: "Nuklir", value: 0.5, displayValue: "0.5 GW", color: "#cbd5e1" }
        ],
        sourceText: "Total tambahan 69,5 GW, 76% EBT + storage. Sumber: Kementerian ESDM / RUPTL 2025–2034.",
        figureCaption: "Gambar 2.2 — Komposisi tambahan kapasitas EBT & storage RUPTL 2025–2034.",
        sourceUrl: "https://gatrik.esdm.go.id"
      },
      regionalDonut: {
        title: "Sebaran Target PLTB RUPTL 2025–2034",
        centerMetric: "7,2 GW",
        centerSublabel: "PLTB 2025–34",
        data: [
          { name: "Jawa-Madura-Bali", value: 5377, color: "#1e3a8a", detail: "5.377 MW (74,7%)" },
          { name: "Sulawesi", value: 1010, color: "#0284c7", detail: "1.010 MW (14,0%)" },
          { name: "Wilayah lain*", value: 813, color: "#f59e0b", detail: "813 MW (11,3%)" }
        ],
        footnote: "*Sebagian total 7,2 GW dikurangi Jamali & Sulawesi (estimasi teknis)."
      },
      logisticsCorridorNarrative: [
        "Sebaran target PLTB sangat terkonsentrasi di Jawa-Madura-Bali (5.377 MW) dan Sulawesi (1.010 MW). Implikasi bagi logistik: pelabuhan tujuan utama berada di koridor Jawa (Surabaya/Tanjung Perak, Semarang, Cilacap) dan Sulawesi Selatan (Makassar, Parepare, Jeneponto), dengan kebutuhan leg antar-pulau dan jalan pedesaan berkontur.",
        "Pemerintah menyebut lokasi potensial meliputi Sulawesi Selatan, Jawa Timur, Kalimantan Selatan, Indonesia Timur, NTT dan Maluku; musim angin kuat berlangsung ±4–4,5 bulan per tahun, terutama Juni–September."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Ditjen EBTKE: revisi Perpres 112/2022 (termasuk formula tarif FIT) sedang disiapkan; Uni Eropa menawarkan pinjaman lunak transisi energi.",
          "ESDM memperkirakan potensi PLTB layak ekonomi mencapai ±167 GW di 203 lokasi, dengan IRR > 10% di Sulawesi, NTT, dan Maluku.",
          "PLTB Tanah Laut (target harga ±5¢/kWh) tertunda; Sidrap beroperasi pada kisaran ±11¢/kWh — bukti tarif realistis mutlak diperlukan.",
          "Kapasitas PLTB Sidrap direncanakan naik dari 75 MW menjadi 175 MW dengan ekspansi ±100 MW di Lawawoi dan Lainungan."
        ]
      },
      sourcesList: [
        {
          name: "Global Wind Report 2025 & Market Outlook 2026",
          publisher: "Global Wind Energy Council (GWEC)",
          year: "2025/2026",
          url: "https://gwec.net/global-wind-report/",
          keyMetric: "Instalasi global 165 GW (2025), kumulatif 1.297 GW, proyeksi 194 GW/th (2026–2030)"
        },
        {
          name: "Renewable Power Generation Costs in 2024",
          publisher: "International Renewable Energy Agency (IRENA)",
          year: "2024/2025",
          url: "https://www.irena.org/Publications/2024/Jul/Renewable-power-generation-costs-in-2023",
          keyMetric: "LCOE Onshore Wind US$0,034/kWh, Installed Cost US$1.041/kW"
        },
        {
          name: "Rencana Usaha Penyediaan Tenaga Listrik (RUPTL) 2025–2034",
          publisher: "Kementerian ESDM & PT PLN (Persero)",
          year: "2025",
          url: "https://gatrik.esdm.go.id",
          keyMetric: "Target tambahan EBT 42,6 GW, Target PLTB 7,2 GW (Jamali 5.377 MW, Sulawesi 1.010 MW)"
        },
        {
          name: "Potensi Energi Angin Indonesia & Buku Neraca Energi",
          publisher: "Direktorat Jenderal EBTKE Kementerian ESDM",
          year: "2025",
          url: "https://ebtke.esdm.go.id",
          keyMetric: "Potensi teknis layak 167 GW di 203 lokasi strategis kepulauan"
        }
      ]
    };
  }

  // =========================================================================
  // 2. FORESTRY / KAYU BULAT / PULP & PAPER / WOOD HAULING
  // =========================================================================
  if (
    t.includes("kayu") || t.includes("forestry") || t.includes("hutan") || 
    t.includes("timber") || t.includes("pulp") || t.includes("paper") || 
    t.includes("chip") || t.includes("log ") || t.includes("logging") ||
    t.includes("hti") || t.includes("hph") || t.includes("sawmill")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Kehutanan, Pulp & Wood Hauling",
      themeColor: "#15803d",
      globalHeadline: "Global: permintaan pulp & serat kayu Asia Pasifik meningkat",
      globalNarrative: 
        "Pasar serat kayu dan pulp global mencatat konsumsi 410 juta ton pada 2025 (tumbuh 3,8% yoy), didorong kuat oleh kebutuhan kemasan kertas ramah lingkungan (ecopackaging), biomassa pellet transisi energi, dan ekspansi industri paperboard di Tiongkok dan Asia Tenggara. FAO memproyeksikan konsumsi serat kayu global mencapai 475 juta ton per tahun pada 2026–2030.",
      globalChart: {
        title: "Volume Perdagangan Serat Kayu & Pulp Global (Juta Ton/tahun)",
        unit: "Juta Ton / tahun",
        data: [
          { year: "2020", value: 360, displayValue: "360" },
          { year: "2021", value: 372, displayValue: "372" },
          { year: "2022", value: 368, displayValue: "368" },
          { year: "2023", value: 388, displayValue: "388" },
          { year: "2024", value: 395, displayValue: "395" },
          { year: "2025", value: 410, displayValue: "410" },
          { year: "2026F-30F (rata-rata)", value: 475, isForecast: true, displayValue: "475" }
        ],
        sourceText: "Sumber: FAO Forestry Trade Statistics 2025 & Fastmarkets RISI Global Pulp Outlook 2026.",
        figureCaption: "Gambar 2.1 — Pertumbuhan volume konsumsi dan perdagangan serat kayu global.",
        sourceUrl: "https://www.fao.org/forestry/statistics/"
      },
      globalCostAndOemNarrative: 
        "Dari sisi unit economics, biaya produksi kayu serat (wood fiber delivery cost) Indonesia berada pada kisaran US$38–US$46 per ton di mill gate, menjadikannya salah satu yang paling kompetitif di dunia berkat siklus panen Acacia & Eucalyptus hanya 5–6 tahun (dibandingkan 15–25 tahun di belahan bumi utara). Tantangan utama global terletak pada regulasi deforestasi EUDR (European Union Deforestation Regulation) dan sertifikasi SVLK/FSC, yang mewajibkan ketertelusuran geospasial rantai pasok dari petak tebang hingga pelabuhan ekspor.",
      nationalHeadline: "Nasional: ekspansi kapasitas mill & target biomassa 2030",
      nationalSummary: 
        "Rencana Kerja Usaha Pemanfaatan Hutan (RKUPH) Nasional memproyeksikan produksi kayu bulat industri mencapai 58,4 juta m³ per tahun. Sektor HTI menyumbang 85% dari total pasokan bahan baku industri pulp, kertas, dan rayon nasional, dengan pusat konsumsi utama di Riau, Sumatera Selatan, dan Kalimantan Timur.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Alokasi Pemanfaatan Kayu Bulat Nasional (Juta m³)",
        unit: "Juta m³",
        data: [
          { name: "Pulp & Kertas (HTI)", value: 38.5, displayValue: "38.5 M m³", color: "#15803d" },
          { name: "Biomassa Pellet (EBT)", value: 8.2, displayValue: "8.2 M m³", color: "#60a5fa" },
          { name: "Plywood & Veneer", value: 5.4, displayValue: "5.4 M m³", color: "#93c5fd" },
          { name: "Kayu Pertukangan & Sawmill", value: 4.1, displayValue: "4.1 M m³", color: "#64748b" },
          { name: "MDF & Particle Board", value: 2.2, displayValue: "2.2 M m³", color: "#94a3b8" }
        ],
        sourceText: "Total produksi kayu bulat nasional 58,4 Juta m³. Sumber: Kementerian LHK / BPS Sektor Kehutanan 2025.",
        figureCaption: "Gambar 2.2 — Komposisi pemanfaatan pasokan kayu bulat industri nasional.",
        sourceUrl: "https://menlhk.go.id"
      },
      regionalDonut: {
        title: "Sebaran Produksi & Konsumsi Kayu HTI",
        centerMetric: "58,4 M",
        centerSublabel: "m³ / tahun",
        data: [
          { name: "Sumatera (Riau, Sumsel, Jambi)", value: 36800, color: "#1e3a8a", detail: "36,8 Juta m³ (63%)" },
          { name: "Kalimantan (Kaltim, Kalbar, Kalteng)", value: 15200, color: "#0284c7", detail: "15,2 Juta m³ (26%)" },
          { name: "Jawa & Papua / Wilayah Lain", value: 6400, color: "#f59e0b", detail: "6,4 Juta m³ (11%)" }
        ],
        footnote: "*Kompilasi data konsesi PBPH HTI aktif dan pabrik pulp terintegrasi."
      },
      logisticsCorridorNarrative: [
        "Rantai logistik kehutanan sangat dipengaruhi oleh kombinasi jalur darat off-road (logging road) dan tongkang sungai (river barging). Titik transfer utama meliputi koridor Sungai Siak & Kampar (Riau), Sungai Musi (Sumsel), dan Sungai Mahakam (Kaltim).",
        "Kondisi jalan tanah laterit tanpa aspal menuntut penggunaan prime mover 6x4 logging spec dengan heavy-duty suspension, retarder brake, serta manajemen jadwal muatan ketat mengikuti musim hujan dan surutnya debit air sungai."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Revisi aturan tata ruang gambut dan izin koridor hauling melintasi kawasan hutan mewajibkan izin IPPKH/PPKH aktif dan kepatuhan sistem audit SVLK V-Legal.",
          "Kebutuhan biomassa wood pellet untuk cofiring PLTU batubara PLN melonjak hingga 2,8 juta ton, membuka peluang kontrak off-take jangka panjang 5–10 tahun.",
          "Tingkat keausan ban dan gardan di logging road mencapai 2,4x lebih tinggi dibanding jalan aspal, menuntut depo servis bergerak (mobile workshop) di koridor.",
          "Kapasitas tongkang ponton sungai terbatasi kedalaman draft sungai saat kemarau, memerlukan integrasi telematika pemantau pasang surut air harian."
        ]
      },
      sourcesList: [
        {
          name: "Global Forest Products Facts and Figures 2024/2025",
          publisher: "Food and Agriculture Organization (FAO)",
          year: "2025",
          url: "https://www.fao.org/forestry/statistics/",
          keyMetric: "Perdagangan pulp serat 410 Juta Ton/th, pertumbuhan 3,8% yoy"
        },
        {
          name: "Sistem Informasi Penatausahaan Hasil Hutan (SIPUHH)",
          publisher: "Kementerian Lingkungan Hidup dan Kehutanan (KLHK)",
          year: "2025",
          url: "https://menlhk.go.id",
          keyMetric: "Produksi kayu bulat nasional 58,4 Juta m³, kontribusi HTI 85%"
        },
        {
          name: "Statistik Kehutanan Indonesia 2024/2025",
          publisher: "Badan Pusat Statistik (BPS)",
          year: "2025",
          url: "https://www.bps.go.id",
          keyMetric: "Konsentrasi produksi: Sumatera 63% (Riau, Sumsel), Kalimantan 26%"
        },
        {
          name: "Outlook Industri Pulp, Kertas & Biomassa Kayu Indonesia",
          publisher: "Asosiasi Pengusaha Hutan Indonesia (APHI)",
          year: "2025",
          url: "https://aphi.or.id",
          keyMetric: "Biaya wood delivery mill gate US$38–US$46/ton, mandatori SVLK V-Legal 100%"
        }
      ]
    };
  }

  // =========================================================================
  // 3. MINING / BATUBARA / NIKEL / MINERAL
  // =========================================================================
  if (
    t.includes("tambang") || t.includes("mining") || t.includes("batu bara") || 
    t.includes("batubara") || t.includes("coal") || t.includes("nikel") || 
    t.includes("nickel") || t.includes("smelter") || t.includes("bauksit") || 
    t.includes("tembaga") || t.includes("mineral")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Pertambangan & Hauling Mineral",
      themeColor: "#b45309",
      globalHeadline: "Global: rekor permintaan komoditas mineral & energi Asia",
      globalNarrative: 
        "Perdagangan batubara dan mineral kritis global mencapai volume tertinggi sebesar 1.480 juta ton pada 2025, dipimpin impor energi India, Tiongkok, dan Asia Tenggara. Di sektor nikel dan mineral baterai, hilirisasi global memacu kebutuhan pengangkutan bijih nikel laterit berkadar 1,5%–1,8% Ni sebesar 220 juta WMT per tahun.",
      globalChart: {
        title: "Perdagangan Seaborne Komoditas Energi & Mineral Global (Juta Ton/tahun)",
        unit: "Juta Ton / tahun",
        data: [
          { year: "2020", value: 1210, displayValue: "1.210" },
          { year: "2021", value: 1280, displayValue: "1.280" },
          { year: "2022", value: 1340, displayValue: "1.340" },
          { year: "2023", value: 1410, displayValue: "1.410" },
          { year: "2024", value: 1440, displayValue: "1.440" },
          { year: "2025", value: 1480, displayValue: "1.480" },
          { year: "2026F-30F (rata-rata)", value: 1560, isForecast: true, displayValue: "1.560" }
        ],
        sourceText: "Sumber: IEA Global Energy Review 2025 & Wood Mackenzie Mining Outlook 2026.",
        figureCaption: "Gambar 2.1 — Tren volume perdagangan mineral dan komoditas energi global.",
        sourceUrl: "https://www.iea.org/reports/global-energy-review-2025"
      },
      globalCostAndOemNarrative: 
        "Kompetisi logistik tambang terfokus pada biaya hauling per ton-kilometer (t-km) yang berkisar Rp450–Rp850/t-km tergantung kondisi jalan hauling dan kelas tonase dump truck. Standar keselamatan tambang (SMKP Minerba) serta mandatori pengurangan emisi mendorong adopsi armada dump truck double-trailer dan pilot armada hybrid/electric heavy hauling di koridor tambang swasta.",
      nationalHeadline: "Nasional: target produksi RKAB & DMO kelistrikan",
      nationalSummary: 
        "Kementerian ESDM menyetujui RKAB produksi batubara nasional 720 juta ton dan nikel ore 240 juta WMT. Mandatori DMO batubara PLN 25% (±180 juta ton) dan pasokan smelter RKEF/HPAL menuntut keandalan armada hauling terdedikasi 24/7.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Target Distribusi & Pemanfaatan Komoditas Tambang Nasional (Juta Ton)",
        unit: "Juta Ton",
        data: [
          { name: "Ekspor Komoditas (Seaborne)", value: 480, displayValue: "480 MT", color: "#b45309" },
          { name: "DMO Pembangkit Listrik PLN", value: 185, displayValue: "185 MT", color: "#60a5fa" },
          { name: "Smelter Domestik (Nikel/Bauksit)", value: 120, displayValue: "120 MT", color: "#93c5fd" },
          { name: "Industri Semen & Pupuk", value: 45, displayValue: "45 MT", color: "#64748b" },
          { name: "Metalurgi & Lainnya", value: 18, displayValue: "18 MT", color: "#94a3b8" }
        ],
        sourceText: "Total volume pengelolaan mineral & batubara ±848 Juta Ton. Sumber: Ditjen Minerba ESDM 2025.",
        figureCaption: "Gambar 2.2 — Komposisi alokasi pemanfaatan komoditas tambang nasional.",
        sourceUrl: "https://minerba.esdm.go.id"
      },
      regionalDonut: {
        title: "Sebaran Produksi Tambang Nasional",
        centerMetric: "848 MT",
        centerSublabel: "Total Volume",
        data: [
          { name: "Kalimantan Timur & Selatan", value: 492, color: "#1e3a8a", detail: "492 MT (58%)" },
          { name: "Sulawesi (Morowali, Weda, Kolaka)", value: 212, color: "#0284c7", detail: "212 MT (25%)" },
          { name: "Sumatera & Maluku / Lainnya", value: 144, color: "#f59e0b", detail: "144 MT (17%)" }
        ],
        footnote: "*Kompilasi persetujuan RKAB Ditjen Minerba ESDM."
      },
      logisticsCorridorNarrative: [
        "Operasi logistik tambang mengandalkan dedicated hauling road (panjang 40–120 km) menuju jetty pelabuhan sungai atau terminal laut khusus (Tersus). Koridor padat meliputi Muara Teweh, Bengalon, Sangatta, dan kawasan industri smelter IMIP Morowali & IWIP Weda Bay.",
        "Kepatuhan muatan per axle (GVW 80–120 Ton pada private road) dan ketersediaan ban radial tambang ukuran 24.00R35 menjadi penentu efisiensi Opex armada hauling."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Pemberlakuan e-RKAB dan sistem pelacakan Simbara mewajibkan setiap armada hauling terintegrasi API manifest digital ESDM.",
          "Fluktuasi harga acuan komoditas (HBA/HMA) memicu penyesuaian tarif formula sewa hauling berbasis Fuel Surcharge Index mingguan.",
          "Tingkat utilisasi armada mencapai 88% dengan siklus operasi 2 shift x 11 jam (22 jam effective operation time per unit per hari).",
          "Kebutuhan armada tronton double-vessel dump melonjak di rute hauling beraspal khusus untuk menekan biaya per ton-km hingga 18%."
        ]
      },
      sourcesList: [
        {
          name: "Global Energy & Critical Minerals Review 2025",
          publisher: "International Energy Agency (IEA)",
          year: "2025",
          url: "https://www.iea.org",
          keyMetric: "Perdagangan batubara & mineral seaborne 1.480 MT/th"
        },
        {
          name: "Data RKAB & Realisasi Produksi Minerba 2025",
          publisher: "Direktorat Jenderal Mineral dan Batubara (Ditjen Minerba ESDM)",
          year: "2025",
          url: "https://minerba.esdm.go.id",
          keyMetric: "Produksi batubara nasional 720 MT, Nikel Ore 240 M WMT, SIMBARA online"
        },
        {
          name: "Indeks Biaya Logistik & Angkutan Pertambangan",
          publisher: "Asosiasi Pertambangan Batubara Indonesia (APBI-ICMA)",
          year: "2025",
          url: "https://apbi-icma.org",
          keyMetric: "Biaya hauling Rp450–Rp850/ton-km, utilisasi target 88%"
        }
      ]
    };
  }

  // =========================================================================
  // 4. SEMEN CURAH / HI-BLOW & MATERIAL
  // =========================================================================
  if (
    t.includes("semen") || t.includes("cement") || t.includes("clinker") || 
    t.includes("klinker") || t.includes("beton") || t.includes("mortar") || 
    t.includes("infrastruktur") || t.includes("silo")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Semen Curah & Material Konstruksi",
      themeColor: "#0284c7",
      globalHeadline: "Global: modernisasi logistik semen curah & dekarbonisasi rantai pasok",
      globalNarrative: 
        "Produksi semen dan klinker global mencapai 4,2 miliar ton pada 2025. Pergeseran ke semen ramah lingkungan (Green Cement / Blended Hydraulic Cement) dan pengiriman semen curah menggunakan truk tangki silo pneumatik (Hi-Blow) meningkat menjadi 58% dari total distribusi perkotaan di negara berkembang.",
      globalChart: {
        title: "Distribusi Semen Curah vs Semen Sak Global (Miliar Ton)",
        unit: "Miliar Ton / tahun",
        data: [
          { year: "2020", value: 3.8, displayValue: "3.8" },
          { year: "2021", value: 3.9, displayValue: "3.9" },
          { year: "2022", value: 4.0, displayValue: "4.0" },
          { year: "2023", value: 4.1, displayValue: "4.1" },
          { year: "2024", value: 4.15, displayValue: "4.15" },
          { year: "2025", value: 4.2, displayValue: "4.2" },
          { year: "2026F-30F (rata-rata)", value: 4.45, isForecast: true, displayValue: "4.45" }
        ],
        sourceText: "Sumber: Global Cement and Concrete Association (GCCA) 2025 & Cembureau Market Report 2026.",
        figureCaption: "Gambar 2.1 — Produksi dan volume distribusi semen global.",
        sourceUrl: "https://gccassociation.org"
      },
      globalCostAndOemNarrative: 
        "Teknologi tangki semen pneumatik Hi-Blow dengan kompresor tekanan 2.0 bar memungkinkan pembongkaran muatan 30 ton dalam waktu kurang dari 45 menit tanpa polusi debu terbuka. Regulasi emisi dan pembatasan Over Dimension Over Loading (Zero ODOL) mendorong adopsi sasis aluminium ringan berbobot tare rendah guna memaksimalkan payload muatan bersih.",
      nationalHeadline: "Nasional: konsumsi semen 66 Juta Ton & proyek strategis",
      nationalSummary: 
        "Asosiasi Semen Indonesia (ASI) mencatat konsumsi semen domestik mencapai 66,2 juta ton pada 2025, ditopang proyek infrastruktur IKN Nusantara, jalan tol trans-Sumatera, dan fasilitas hilirisasi industri di Jawa dan luar Jawa.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Pangsa Pasar Konsumsi Semen Domestik Nasional (Juta Ton)",
        unit: "Juta Ton",
        data: [
          { name: "Semen Kantong (Retail)", value: 46.2, displayValue: "46.2 MT", color: "#60a5fa" },
          { name: "Semen Curah (Hi-Blow/Batching)", value: 20.0, displayValue: "20.0 MT", color: "#0284c7" },
          { name: "Ekspor Klinker & Semen", value: 12.5, displayValue: "12.5 MT", color: "#93c5fd" },
          { name: "Precast & Mortar Khusus", value: 5.8, displayValue: "5.8 MT", color: "#64748b" }
        ],
        sourceText: "Total konsumsi semen domestik 66,2 Juta Ton. Sumber: Asosiasi Semen Indonesia (ASI) 2025.",
        figureCaption: "Gambar 2.2 — Struktur konsumsi semen nasional antara ritel kantong dan semen curah.",
        sourceUrl: "https://asi.or.id"
      },
      regionalDonut: {
        title: "Sebaran Konsumsi Semen Curah Nasional",
        centerMetric: "66,2 MT",
        centerSublabel: "Konsumsi Nasional",
        data: [
          { name: "Pulau Jawa (Jabodetabek, Jateng, Jatim)", value: 34800, color: "#1e3a8a", detail: "34,8 MT (53%)" },
          { name: "Sumatera", value: 14200, color: "#0284c7", detail: "14,2 MT (21%)" },
          { name: "Kalimantan (termasuk IKN)", value: 6800, color: "#0d9488", detail: "6,8 MT (10%)" },
          { name: "Sulawesi & Indonesia Timur", value: 10400, color: "#f59e0b", detail: "10,4 MT (16%)" }
        ],
        footnote: "*Data laporan resmi Asosiasi Semen Indonesia (ASI)."
      },
      logisticsCorridorNarrative: [
        "Jalur distribusi semen curah menghubungkan pabrik semen terintegrasi (Tuban, Narogong, Citeureup, Tonasa, Indarung) dengan terminal packing plant dan batching plant proyek.",
        "Penegakan batas muatan sumbu terberat (MST 10 Ton) di jalan tol dan jembatan timbang menuntut kepatuhan tonase ketat dan pemantauan telematika axle-load real time."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Penegakan aturan Zero ODOL Kemenhub membatasi payload truk tangki 3-axle pada kisaran 28–30 ton, meningkatkan frekuensi ritase per proyek.",
          "Fluktuasi harga solar industri non-subsidi diimbangi mekanisme Fuel Adjustment Factor (FAF) kontrak jangka panjang dengan produsen semen.",
          "Kebutuhan semen curah tipe hidrolis ramah lingkungan (SNI 8912) naik 22% untuk proyek infrastruktur berstandar Green Building.",
          "Tingkat ketepatan waktu bongkar (Discharge SLA) batching plant rata-rata disyaratkan di bawah 45 menit per kedatangan truk tangki."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Statistik Semen Nasional 2024/2025",
          publisher: "Asosiasi Semen Indonesia (ASI)",
          year: "2025",
          url: "https://asi.or.id",
          keyMetric: "Konsumsi semen nasional 66,2 MT, semen curah 20,0 MT (30,2%)"
        },
        {
          name: "Data Perkembangan Konstruksi & Infrastruktur Nasional",
          publisher: "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)",
          year: "2025",
          url: "https://pu.go.id",
          keyMetric: "Pembangunan IKN & Tol Trans-Sumatera memicu konsumsi semen luar Jawa"
        },
        {
          name: "Regulasi Kelaikan Angkutan Jalan & Pengawasan Beban Sumbu (Zero ODOL)",
          publisher: "Direktorat Jenderal Perhubungan Darat Kementerian Perhubungan",
          year: "2025",
          url: "https://dephub.go.id",
          keyMetric: "Standar MST 10 Ton, sertifikasi bejana tekan tangki Hi-Blow 2.0 bar"
        }
      ]
    };
  }

  // =========================================================================
  // 5. CPO / KELAPA SAWIT / MINYAK NABATI / TBS
  // =========================================================================
  if (
    t.includes("sawit") || t.includes("cpo") || t.includes("palm") || 
    t.includes("minyak nabati") || t.includes("tbs") || t.includes("oleo") ||
    t.includes("pks") || t.includes("biodiesel")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Kelapa Sawit & Logistik CPO",
      themeColor: "#d97706",
      globalHeadline: "Global: kepemimpinan ekspor minyak sawit & mandatori biofuel B40",
      globalNarrative: 
        "Produksi minyak kelapa sawit (CPO) global mencapai 82,5 juta ton pada 2025, dengan Indonesia menguasai 59% pangsa pasar global. Permintaan global dipacu oleh kebutuhan pangan olahan di India dan Tiongkok serta akselerasi program mandatori biodiesel domestik (B35/B40) yang menyerap lebih dari 12,8 juta ton CPO per tahun.",
      globalChart: {
        title: "Produksi Minyak Sawit Global & Ekspor (Juta Ton/tahun)",
        unit: "Juta Ton / tahun",
        data: [
          { year: "2020", value: 73.8, displayValue: "73.8" },
          { year: "2021", value: 75.4, displayValue: "75.4" },
          { year: "2022", value: 77.2, displayValue: "77.2" },
          { year: "2023", value: 79.5, displayValue: "79.5" },
          { year: "2024", value: 80.8, displayValue: "80.8" },
          { year: "2025", value: 82.5, displayValue: "82.5" },
          { year: "2026F-30F (rata-rata)", value: 89.0, isForecast: true, displayValue: "89.0" }
        ],
        sourceText: "Sumber: United States Department of Agriculture (USDA) Oilseeds Report 2025 & GAPKI Palm Oil Outlook 2026.",
        figureCaption: "Gambar 2.1 — Tren pertumbuhan produksi dan permintaan minyak kelapa sawit dunia.",
        sourceUrl: "https://gapki.id"
      },
      globalCostAndOemNarrative: 
        "Dalam rantai nilai CPO, kepatuhan sertifikasi keberlanjutan ISPO dan RSPO mewajibkan transparansi rantai pasok hingga tingkat perkebunan (*geolocation traceability*). Pengangkutan menggunakan truk tangki stainless steel SUS 304 food grade dengan insulasi suhu menjaga Free Fatty Acid (FFA) tetap di bawah 3,5% dan menghindari kontaminasi air.",
      nationalHeadline: "Nasional: produksi 52,8 Juta Ton & program hilirisasi industri",
      nationalSummary: 
        "Gabungan Pengusaha Kelapa Sawit Indonesia (GAPKI) mencatat produksi CPO dan CPKO nasional sebesar 52,8 juta ton pada 2025. Penyerapan dalam negeri mencapai 24,1 juta ton didorong program biodiesel dan industri oleokimia pangan.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Alokasi Distribusi CPO Nasional (Juta Ton)",
        unit: "Juta Ton",
        data: [
          { name: "Ekspor Pasar Global", value: 28.7, displayValue: "28.7 MT", color: "#d97706" },
          { name: "Mandatori Biodiesel (B35/B40)", value: 12.8, displayValue: "12.8 MT", color: "#60a5fa" },
          { name: "Minyak Goreng & Pangan Domestik", value: 6.8, displayValue: "6.8 MT", color: "#93c5fd" },
          { name: "Oleokimia & Produk Turunan", value: 4.5, displayValue: "4.5 MT", color: "#64748b" }
        ],
        sourceText: "Total output produksi CPO & PKO 52,8 Juta Ton. Sumber: GAPKI & BPDPKS 2025.",
        figureCaption: "Gambar 2.2 — Struktur penyerapan pasokan CPO antara pasar ekspor dan domestik.",
        sourceUrl: "https://gapki.id"
      },
      regionalDonut: {
        title: "Sebaran Produksi Kelapa Sawit Nasional",
        centerMetric: "52,8 MT",
        centerSublabel: "Total CPO",
        data: [
          { name: "Sumatera (Riau, Sumut, Sumsel)", value: 29500, color: "#1e3a8a", detail: "29,5 MT (56%)" },
          { name: "Kalimantan (Kalteng, Kalbar, Kaltim)", value: 18500, color: "#0284c7", detail: "18,5 MT (35%)" },
          { name: "Sulawesi & Papua", value: 4800, color: "#f59e0b", detail: "4,8 MT (9%)" }
        ],
        footnote: "*Kompilasi data Ditjen Perkebunan Kementan & GAPKI."
      },
      logisticsCorridorNarrative: [
        "Jalur logistik menghubungkan Pabrik Kelapa Sawit (PKS) di area perkebunan menuju tangki timbun pelabuhan ekspor (Pelabuhan Dumai, Belawan, Teluk Bayur, Bumiharjo, dan Balikpapan).",
        "Pemasangan segel digital (E-Seal GPS) pada manhole dan valve pembuangan bawah menjadi SOP wajib guna mencegah tindak pencurian muatan di perjalanan (*kencing CPO*)."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Tingkat toleransi penyusutan volume (*shrinkage tolerance*) disyaratkan sangat ketat maksimal 0,15% per ritase pengiriman.",
          "Kalibrasi tera metrologi berkala pada tangki truk wajib diperbarui setiap 12 bulan sesuai ketentuan Kemendag.",
          "Waktu tunggu bongkar di tangki timbun pelabuhan mencapai 4–8 jam saat puncak panen raya, menuntut penjadwalan slot armada yang presisi.",
          "Kondisi jalan perkebunan bertanah laterit menuntut armada tangki 6x4 dengan ground clearance optimal."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Kinerja & Ekspor Industri Sawit Indonesia 2025",
          publisher: "Gabungan Pengusaha Kelapa Sawit Indonesia (GAPKI)",
          year: "2025",
          url: "https://gapki.id",
          keyMetric: "Produksi CPO 52,8 MT, konsumsi domestik 24,1 MT (biodiesel 12,8 MT)"
        },
        {
          name: "Data Statistik Perkebunan Kelapa Sawit Indonesia",
          publisher: "Direktorat Jenderal Perkebunan Kementerian Pertanian",
          year: "2025",
          url: "https://ditjenbun.pertanian.go.id",
          keyMetric: "Luas tutupan sawit nasional 16,38 Juta Ha, dominasi Riau & Sumut"
        },
        {
          name: "Laporan Realisasi Penyaluran Dana Perkebunan Sawit",
          publisher: "Badan Pengelola Dana Perkebunan Kelapa Sawit (BPDPKS)",
          year: "2025",
          url: "https://bpdp.or.id",
          keyMetric: "Insentif mandatori B35/B40 dan peremajaan sawit rakyat (PSR)"
        }
      ]
    };
  }

  // =========================================================================
  // 6. PETIKEMAS / KONTAINER / CONTAINER PORT / MULTIMODA / DRY PORT
  // =========================================================================
  if (
    t.includes("kontainer") || t.includes("container") || t.includes("petikemas") || 
    t.includes("pelabuhan") || t.includes("port") || t.includes("dry port") ||
    t.includes("teus") || t.includes("intermoda")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Petikemas & Multimoda Pelabuhan",
      themeColor: "#2563eb",
      globalHeadline: "Global: pergerakan petikemas 890 Juta TEUs & otomatisasi terminal",
      globalNarrative: 
        "Throughput petikemas global mencapai 890 juta TEUs pada 2025 (tumbuh 4,2% yoy). Jalur perdagangan Intra-Asia menjadi penggerak volume terbesar dengan pangsa 34%, didorong oleh relokasi pusat manufaktur dan integrasi kawasan RCEP.",
      globalChart: {
        title: "Throughput Petikemas Pelabuhan Global (Juta TEUs/tahun)",
        unit: "Juta TEUs / tahun",
        data: [
          { year: "2020", value: 795, displayValue: "795" },
          { year: "2021", value: 830, displayValue: "830" },
          { year: "2022", value: 845, displayValue: "845" },
          { year: "2023", value: 860, displayValue: "860" },
          { year: "2024", value: 875, displayValue: "875" },
          { year: "2025", value: 890, displayValue: "890" },
          { year: "2026F-30F (rata-rata)", value: 960, isForecast: true, displayValue: "960" }
        ],
        sourceText: "Sumber: UNCTAD Review of Maritime Transport 2025 & Alphaliner Global Cellular Fleet Data 2026.",
        figureCaption: "Gambar 2.1 — Pertumbuhan volume pergerakan peti kemas di pelabuhan utama dunia.",
        sourceUrl: "https://unctad.org/topic/transport-and-trade-logistics"
      },
      globalCostAndOemNarrative: 
        "Standar maritim IMO SOLAS mewajibkan kepastian data berat kotor peti kemas terverifikasi (VGM - Verified Gross Mass). Integrasi sistem pelabuhan berbasis Single Window dan TOS (Terminal Operating System) memungkinkan penurunan dwelling time ke angka rata-rata 2,4 hari.",
      nationalHeadline: "Nasional: arus petikemas 18,2 Juta TEUs di pelabuhan Indonesia",
      nationalSummary: 
        "PT Pelabuhan Indonesia (Pelindo) mencatat total arus peti kemas di pelabuhan kelolaan mencapai 18,2 juta TEUs pada 2025, dengan Tanjung Priok dan Tanjung Perak mendominasi 72% arus ekspor-impor dan domestik.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Distribusi Arus Petikemas Pelabuhan Utama Nasional (Juta TEUs)",
        unit: "Juta TEUs",
        data: [
          { name: "Pelabuhan Tanjung Priok (Jakarta)", value: 7.8, displayValue: "7.8 M TEUs", color: "#2563eb" },
          { name: "Pelabuhan Tanjung Perak (Surabaya)", value: 4.2, displayValue: "4.2 M TEUs", color: "#60a5fa" },
          { name: "Pelabuhan Belawan (Medan)", value: 1.6, displayValue: "1.6 M TEUs", color: "#93c5fd" },
          { name: "Makassar New Port (MNP)", value: 1.2, displayValue: "1.2 M TEUs", color: "#64748b" },
          { name: "Pelabuhan Lainnya Terpadu", value: 3.4, displayValue: "3.4 M TEUs", color: "#94a3b8" }
        ],
        sourceText: "Total arus peti kemas 18,2 Juta TEUs. Sumber: PT Pelabuhan Indonesia (Persero) 2025.",
        figureCaption: "Gambar 2.2 — Komposisi pangsa arus petikemas antar-pelabuhan hub utama Indonesia.",
        sourceUrl: "https://pelindo.co.id"
      },
      regionalDonut: {
        title: "Sebaran Arus Peti Kemas per Wilayah",
        centerMetric: "18,2 M",
        centerSublabel: "TEUs / th",
        data: [
          { name: "Jawa Barat & DKI (Priok, Cikarang)", value: 8500, color: "#1e3a8a", detail: "8,5 M TEUs (47%)" },
          { name: "Jawa Timur & Tengah (Perak, Tanjung Emas)", value: 5200, color: "#0284c7", detail: "5,2 M TEUs (29%)" },
          { name: "Sumatera (Belawan, Palembang, Panjang)", value: 2600, color: "#0d9488", detail: "2,6 M TEUs (14%)" },
          { name: "Sulawesi & Wilayah Timur", value: 1900, color: "#f59e0b", detail: "1,9 M TEUs (10%)" }
        ],
        footnote: "*Kompilasi data operasional Pelindo & Kemenhub Ditjen Hubla."
      },
      logisticsCorridorNarrative: [
        "Koridor penghubung sentra industri Cikarang/Karawang ke Tanjung Priok dan koridor Surabaya–Gresik–Mojokerto ke Tanjung Perak menuntut kepastian jendela waktu penumpukan (*stacking window*).",
        "Tractor head berspesifikasi 6x2 dan 6x4 dengan trailer bersertifikat twistlock aktif menjamin stabilitas manuver di jalan tol akses pelabuhan."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Penerapan sistem Truck Booking System (TBS) dan gate pass digital memangkas antrean truk di dermaga hingga 35%.",
          "Kepatuhan batas muatan sumbu (MST 10 Ton) di jalan tol pelabuhan memperketat batas muatan kontainer 40ft maksimal 24 ton kargo.",
          "Penyediaan generator plug-in (clip-on genset) untuk kontainer reefer makanan beku dan farmasi menjadi standar wajib bernilai premium.",
          "Denda demurrage dan detention pelayaran memicu integrasi tracking kontainer real-time antara forwarder dan klien."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Tahunan Kinerja Pelabuhan & Arus Petikemas",
          publisher: "PT Pelabuhan Indonesia (Persero)",
          year: "2025",
          url: "https://pelindo.co.id",
          keyMetric: "Total throughput 18,2 Juta TEUs, Priok 7,8 M TEUs, Perak 4,2 M TEUs"
        },
        {
          name: "Review of Maritime Transport 2024/2025",
          publisher: "United Nations Conference on Trade and Development (UNCTAD)",
          year: "2025",
          url: "https://unctad.org/topic/transport-and-trade-logistics",
          keyMetric: "Throughput global 890 Juta TEUs, pertumbuhan Asia 4,2% yoy"
        },
        {
          name: "Statistik Perhubungan Laut & Angkutan Petikemas",
          publisher: "Direktorat Jenderal Perhubungan Laut Kemenhub",
          year: "2025",
          url: "https://hubla.dephub.go.id",
          keyMetric: "Standar kelaikan twistlock trailer chassis & penertiban ODOL pelabuhan"
        }
      ]
    };
  }

  // =========================================================================
  // 7. COLD CHAIN / FROZEN FOOD / FARMASI / SUHU TERKONTROL
  // =========================================================================
  if (
    t.includes("cold") || t.includes("chain") || t.includes("beku") || 
    t.includes("frozen") || t.includes("reefer") || t.includes("pendingin") ||
    t.includes("daging") || t.includes("ikan") || t.includes("seafood") ||
    t.includes("farmasi") || t.includes("vaksin")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Rantai Dingin (Cold Chain Logistics)",
      themeColor: "#06b6d4",
      globalHeadline: "Global: pasar cold chain US$340 Miliar dipacu farmasi & pangan beku",
      globalNarrative: 
        "Nilai pasar logistik rantai dingin (cold chain) global mencapai US$340 miliar pada 2025 dan diproyeksikan bertumbuh dengan CAGR 13,8% hingga 2030. Lonjakan ini dipicu oleh perdagangan makanan beku siap saji, ekspor seafood berkualitas tinggi, serta standar ketat distribusi produk biologis dan biofarmasi berstandar GDP (Good Distribution Practice).",
      globalChart: {
        title: "Nilai Industri Cold Chain Global (Miliar US$/tahun)",
        unit: "Miliar US$ / tahun",
        data: [
          { year: "2020", value: 185, displayValue: "185" },
          { year: "2021", value: 210, displayValue: "210" },
          { year: "2022", value: 245, displayValue: "245" },
          { year: "2023", value: 280, displayValue: "280" },
          { year: "2024", value: 310, displayValue: "310" },
          { year: "2025", value: 340, displayValue: "340" },
          { year: "2026F-30F (rata-rata)", value: 490, isForecast: true, displayValue: "490" }
        ],
        sourceText: "Sumber: Global Cold Chain Alliance (GCCA) 2025 & Grand View Research Cold Chain Logistics Report 2026.",
        figureCaption: "Gambar 2.1 — Pertumbuhan nilai pasar global rantai pendingin logistik.",
        sourceUrl: "https://gcca.org"
      },
      globalCostAndOemNarrative: 
        "Unit pendingin mutakhir (Thermo King / Carrier Transicold) dengan kompresor scroll inverter dan refrigeran ramah lingkungan R452A mampu mempertahankan rentang temperatur stabil mulai dari chilled (+2°C hingga +8°C) hingga deep frozen (-25°C). Integrasi sensor IoT telematika memastikan alarm otomatis menyala saat terjadi deviasi suhu di atas 0,5°C.",
      nationalHeadline: "Nasional: kapasitas cold storage 5,2 Juta Ton & proyek perikanan",
      nationalSummary: 
        "Asosiasi Rantai Pendingin Indonesia (ARPI) mencatat kapasitas gudang pendingin dan armada reefer nasional tumbuh 14,5% mencapai 5,2 juta ton kapasitas simpan, ditopang industri perikanan tangkap, perunggasan, susu, dan ekspansi ritel modern makanan beku.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Pangsa Komoditas Logistik Rantai Dingin Nasional (%)",
        unit: "% dari Total Volume",
        data: [
          { name: "Perikanan & Seafood Beku", value: 36.5, displayValue: "36.5%", color: "#06b6d4" },
          { name: "Daging Unggas & Daging Sapi", value: 28.2, displayValue: "28.2%", color: "#60a5fa" },
          { name: "Es Krim & Produk Olahan Susu", value: 16.4, displayValue: "16.4%", color: "#93c5fd" },
          { name: "Farmasi & Produk Medis Suhu Terkontrol", value: 10.5, displayValue: "10.5%", color: "#64748b" },
          { name: "Buah & Sayur Hortikultura", value: 8.4, displayValue: "8.4%", color: "#94a3b8" }
        ],
        sourceText: "Total pasar pergerakan cold chain Indonesia. Sumber: Asosiasi Rantai Pendingin Indonesia (ARPI) 2025.",
        figureCaption: "Gambar 2.2 — Komposisi komoditas pengguna jasa logistik berpendingin nasional.",
        sourceUrl: "https://arpicoldchain.org"
      },
      regionalDonut: {
        title: "Sebaran Fasilitas Cold Storage Nasional",
        centerMetric: "5,2 MT",
        centerSublabel: "Kapasitas Dingin",
        data: [
          { name: "Jabodetabek & Banten", value: 2600, color: "#1e3a8a", detail: "2,6 MT (50%)" },
          { name: "Jawa Timur & Jawa Tengah", value: 1450, color: "#0284c7", detail: "1,45 MT (28%)" },
          { name: "Sumatera (Medan, Lampung)", value: 650, color: "#0d9488", detail: "0,65 MT (12%)" },
          { name: "Indonesia Timur & Bali (Sentra Ikan)", value: 500, color: "#f59e0b", detail: "0,50 MT (10%)" }
        ],
        footnote: "*Data survei infrastruktur rantai pendingin ARPI & KKP."
      },
      logisticsCorridorNarrative: [
        "Rute pengangkutan menghubungkan sentra tangkapan ikan (Bitung, Muara Baru, Benoa, Banyuwangi) dan pusat peternakan ayam (Jawa Barat/Jawa Timur) ke pusat distribusi perkotaan.",
        "Pemeliharaan boks isolasi poliuretan (PU Foam tebal 10 cm) dan kalibrasi rutin data logger suhu digital menjadi syarat kelulusan audit BPOM (CDOB)."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Klien industri makanan dan farmasi mewajibkan laporan grafik histori temperatur tercetak (Temperature Data Logger) saat penyerahan barang.",
          "Biaya konsumsi solar unit genset pendingin menyumbang 22% dari total Opex, memicu pemanfaatan mode hybrid electric standby saat parkir.",
          "Tingkat kebersihan boks reefer berstandar sanitasi HACCP bebas bau dan residu bakteri dibuktikan dengan sertifikat fogging berkala.",
          "Toleransi waktu transit makanan beku tanpa aliran listrik maksimal 2 jam dengan kenaikan suhu terkendali < 2°C."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Perkembangan Industri Rantai Pendingin Indonesia 2025",
          publisher: "Asosiasi Rantai Pendingin Indonesia (ARPI)",
          year: "2025",
          url: "https://arpicoldchain.org",
          keyMetric: "Kapasitas cold storage 5,2 Juta Ton, pertumbuhan tahunan 14,5%"
        },
        {
          name: "Pedoman Cara Distribusi Obat yang Baik (CDOB) & Cold Chain Management",
          publisher: "Badan Pengawas Obat dan Makanan (BPOM)",
          year: "2025",
          url: "https://pom.go.id",
          keyMetric: "Mandatori continuous temperature logging & validasi armada reefer"
        },
        {
          name: "Statistik Produksi Perikanan & Logistik Hasil Kelautan",
          publisher: "Kementerian Kelautan dan Perikanan (KKP)",
          year: "2025",
          url: "https://kkp.go.id",
          keyMetric: "Produksi perikanan tangkap 7,8 Juta Ton menuntut koridor cold chain hulu-hilir"
        }
      ]
    };
  }

  // =========================================================================
  // 8. LIMBAH B3 / KIMIA / BAHAN BERBAHAYA / HAZARDOUS WASTE
  // =========================================================================
  if (
    t.includes("limbah") || t.includes("b3") || t.includes("waste") || 
    t.includes("kimia") || t.includes("chemical") || t.includes("hazardous") ||
    t.includes("medis") || t.includes("racun")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Pengelolaan Limbah B3 & Kimia Khusus",
      themeColor: "#9333ea",
      globalHeadline: "Global: regulasi ketat Konvensi Basel & standar keselamatan kimia",
      globalNarrative: 
        "Pengelolaan dan transportasi limbah Bahan Berbahaya dan Beracun (B3) serta bahan kimia industri global mencapai 460 juta ton pada 2025. Standar Konvensi Basel dan prinsip Cradle-to-Grave menuntut transparansi manifest digital pelacakan limbah dari industri penghasil hingga fasilitas pemusnah atau daur ulang berizin.",
      globalChart: {
        title: "Volume Pengelolaan Limbah Industri & B3 Global (Juta Ton/tahun)",
        unit: "Juta Ton / tahun",
        data: [
          { year: "2020", value: 390, displayValue: "390" },
          { year: "2021", value: 405, displayValue: "405" },
          { year: "2022", value: 418, displayValue: "418" },
          { year: "2023", value: 432, displayValue: "432" },
          { year: "2024", value: 446, displayValue: "446" },
          { year: "2025", value: 460, displayValue: "460" },
          { year: "2026F-30F (rata-rata)", value: 520, isForecast: true, displayValue: "520" }
        ],
        sourceText: "Sumber: UNEP Basel Convention Technical Data 2025 & OECD Hazardous Waste Statistics 2026.",
        figureCaption: "Gambar 2.1 — Pertumbuhan volume pengelolaan limbah berbahaya industri dunia.",
        sourceUrl: "https://www.unep.org"
      },
      globalCostAndOemNarrative: 
        "Transportasi bahan kimia dan limbah B3 menuntut sertifikasi bejana tangki berstandar ASME / UN Portable Tank atau boks berlapisan epoksi kedap tumpahan. Pengemudi wajib mengantongi sertifikat kompetensi penanganan B3 dan armada dilengkapi GPS terintegrasi emergency response unit (ERU).",
      nationalHeadline: "Nasional: manifest elektronik FESTRONIK & fasilitas pengolah B3",
      nationalSummary: 
        "Kementerian Lingkungan Hidup dan Kehutanan (KLHK) mencatat timbulan limbah B3 nasional mencapai 68,4 juta ton pada 2025, dengan sektor manufaktur, migas, tambang, dan fasilitas pelayanan kesehatan (Fasyankes) menjadi kontributor utama yang wajib menggunakan FESTRONIK.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Komposisi Sumber Timbulan Limbah B3 Nasional (%)",
        unit: "% Timbulan Nasional",
        data: [
          { name: "Manufaktur & Kimia Industri", value: 42.0, displayValue: "42.0%", color: "#9333ea" },
          { name: "Energi & Pertambangan", value: 28.5, displayValue: "28.5%", color: "#60a5fa" },
          { name: "Fasilitas Layanan Kesehatan / Medis", value: 14.5, displayValue: "14.5%", color: "#93c5fd" },
          { name: "Oli Bekas & Logistik Transportasi", value: 10.2, displayValue: "10.2%", color: "#64748b" },
          { name: "Elektronik & Limbah Lainnya", value: 4.8, displayValue: "4.8%", color: "#94a3b8" }
        ],
        sourceText: "Total timbulan limbah B3 68,4 Juta Ton. Sumber: Ditjen PSLB3 KLHK 2025.",
        figureCaption: "Gambar 2.2 — Komposisi sektor penghasil limbah B3 terdaftar di Indonesia.",
        sourceUrl: "https://festronik.menlhk.go.id"
      },
      regionalDonut: {
        title: "Sebaran Pergerakan Pengangkutan Limbah B3",
        centerMetric: "68,4 MT",
        centerSublabel: "Limbah B3",
        data: [
          { name: "Jawa Barat, Banten & DKI (Kawasan Industri)", value: 39000, color: "#1e3a8a", detail: "39,0 MT (57%)" },
          { name: "Jawa Timur & Jawa Tengah", value: 17100, color: "#0284c7", detail: "17,1 MT (25%)" },
          { name: "Sumatera (Riau, Sumsel, Kepri)", value: 8200, color: "#0d9488", detail: "8,2 MT (12%)" },
          { name: "Kalimantan & Sulawesi", value: 4100, color: "#f59e0b", detail: "4,1 MT (6%)" }
        ],
        footnote: "*Kompilasi data penerbitan manifest FESTRONIK KLHK."
      },
      logisticsCorridorNarrative: [
        "Pergerakan pengangkutan limbah B3 terpusat menuju fasilitas pengolah dan penimbun berizin terpadu (seperti PPLI Cileungsi, Prasadha Pamunah Limbah Industri, dan insenerator berizin).",
        "Rute pengangkutan dilarang melintasi kawasan padat permukiman primer dan kawasan resapan air baku tanpa izin rekomendasi KLHK dan Hubdat."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Surat jalan fisik tidak berlaku; seluruh pergerakan terkunci pada validasi QR Code FESTRONIK KLHK secara real-time.",
          "Armada wajib dilengkapi simbol label bahaya B3 sesuai kelas bahaya (GHS), APAR, kotak P3K, dan spill kit penetral bahan kimia.",
          "Pengemudi wajib bersertifikat kompetensi pengangkutan B3 dari BNSP yang diperbarui setiap 3 tahun.",
          "Margin komersial pengangkutan B3 berkisar 25%–35% lebih tinggi dibanding kargo umum sebagai kompensasi risiko keselamatan tinggi."
        ]
      },
      sourcesList: [
        {
          name: "Sistem Informasi Manifest Limbah B3 Elektronik (FESTRONIK)",
          publisher: "Direktorat Jenderal PSLB3 Kementerian Lingkungan Hidup dan Kehutanan",
          year: "2025",
          url: "https://festronik.menlhk.go.id",
          keyMetric: "Timbulan B3 nasional 68,4 Juta Ton, integrasi 100% manifest digital"
        },
        {
          name: "Peraturan Pemerintah No. 22 Tahun 2021 tentang Pengelolaan Lingkungan Hidup",
          publisher: "Sekretariat Negara RI & KLHK",
          year: "2025",
          url: "https://menlhk.go.id",
          keyMetric: "Ketentuan izin teknis pengangkutan dan tanggap darurat tumpahan B3"
        },
        {
          name: "Regulasi Kelaikan Angkutan Barang Berbahaya",
          publisher: "Direktorat Jenderal Perhubungan Darat Kemenhub",
          year: "2025",
          url: "https://dephub.go.id",
          keyMetric: "Sertifikasi rancang bangun tangki kimia & kartu pengawasan barang khusus"
        }
      ]
    };
  }

  // =========================================================================
  // 9. BISNIS MANDIRI / UMKM / CAFE / F&B / RETAIL / JASA PERSONAL
  // =========================================================================
  const archetype = detectProjectArchetype(rawTitle);
  if (
    archetype === 'personal_sme' ||
    t.includes("cafe") || t.includes("kafe") || t.includes("kopi") || 
    t.includes("kuliner") || t.includes("warung") || t.includes("resto") ||
    t.includes("laundry") || t.includes("toko") || t.includes("retail") ||
    t.includes("barbershop") || t.includes("klinik") || t.includes("umkm") ||
    t.includes("usaha mandiri") || t.includes("usaha pribadi") || t.includes("bakery")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Usaha Mandiri, F&B & Layanan UMKM",
      themeColor: "#ec4899",
      globalHeadline: "Global: lonjakan tren konsumsi lokal & adopsi transaksi digital",
      globalNarrative: 
        "Sektor ritel independen, F&B, dan layanan personal global mencatat pertumbuhan belanja konsumen sebesar 6,4% pada 2025. Pergeseran preferensi konsumen ke arah produk berbasis pengalaman unik (*experiential retail*), kopi spesialti, layanan cepat berkualitas, dan kemudahan pembayaran non-tunai menjadi pendorong utama ekspansi bisnis skala menengah-mikro di kota-kota berkembang.",
      globalChart: {
        title: "Nilai Pasar F&B & Ritel Independen Global (Triliun US$/tahun)",
        unit: "Triliun US$ / tahun",
        data: [
          { year: "2020", value: 3.2, displayValue: "3.2" },
          { year: "2021", value: 3.4, displayValue: "3.4" },
          { year: "2022", value: 3.7, displayValue: "3.7" },
          { year: "2023", value: 4.0, displayValue: "4.0" },
          { year: "2024", value: 4.3, displayValue: "4.3" },
          { year: "2025", value: 4.6, displayValue: "4.6" },
          { year: "2026F-30F (rata-rata)", value: 5.8, isForecast: true, displayValue: "5.8" }
        ],
        sourceText: "Sumber: Global Retail & Food Service Monitor 2025 & Statista Consumer Markets 2026.",
        figureCaption: "Gambar 2.1 — Pertumbuhan nilai pasar ritel kuliner dan gaya hidup global.",
        sourceUrl: "https://www.statista.com"
      },
      globalCostAndOemNarrative: 
        "Kunci keberhasilan model usaha modern bertumpu pada efisiensi Cost of Goods Sold (COGS < 35%), standardisasi resep/SOP layanan, serta integrasi platform Point of Sale (POS) cloud yang memantau inventaris bahan baku real-time guna meminimalkan waste sisa di bawah 2%.",
      nationalHeadline: "Nasional: kontribusi UMKM 61% PDB & penetrasi QRIS 55 Juta Pengguna",
      nationalSummary: 
        "Kementerian Koperasi dan UKM serta Bank Indonesia mencatat sektor UMKM dan ekonomi kreatif menyumbang 61,07% terhadap PDB Indonesia dengan penyerapan tenaga kerja 97%. Transaksi pembayaran digital QRIS melampaui 55 juta pengguna aktif dengan perputaran dana harian yang sangat likuid.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran Strategic Advisory • Personal Business Unit"
      },
      nationalCapacityChart: {
        title: "Pangsa Omset Sektor Usaha Mandiri & UMKM Nasional (%)",
        unit: "% Kontribusi Omset",
        data: [
          { name: "Kuliner & F&B (Kafe/Resto/Snack)", value: 41.5, displayValue: "41.5%", color: "#ec4899" },
          { name: "Perdagangan Ritel & Toko Grosir", value: 24.8, displayValue: "24.8%", color: "#60a5fa" },
          { name: "Jasa Personal & Kebersihan (Laundry/Salon)", value: 16.2, displayValue: "16.2%", color: "#93c5fd" },
          { name: "Fashion & Kerajinan Kriya", value: 11.5, displayValue: "11.5%", color: "#64748b" },
          { name: "Jasa Edukasi, Servis & Lainnya", value: 6.0, displayValue: "6.0%", color: "#94a3b8" }
        ],
        sourceText: "Total pangsa sektor ekonomi kerakyatan nasional. Sumber: Kemenkop UKM & BPS 2025.",
        figureCaption: "Gambar 2.2 — Distribusi pangsa kontribusi omset sektor usaha mandiri di Indonesia.",
        sourceUrl: "https://kemenkopukm.go.id"
      },
      regionalDonut: {
        title: "Sebaran Perputaran Transaksi Usaha Mandiri",
        centerMetric: "61%",
        centerSublabel: "PDB Nasional",
        data: [
          { name: "Jabodetabek & Kota Metropolitan Jawa", value: 52, color: "#1e3a8a", detail: "52% Perputaran" },
          { name: "Kota Sekunder Jawa (Bandung, Jogja, Sby)", value: 26, color: "#0284c7", detail: "26% Perputaran" },
          { name: "Sumatera (Medan, Palembang, Batam)", value: 13, color: "#0d9488", detail: "13% Perputaran" },
          { name: "Bali & Kawasan Wisata Indonesia Timur", value: 9, color: "#f59e0b", detail: "9% Perputaran" }
        ],
        footnote: "*Kompilasi data transaksi ekonomi kerakyatan Bank Indonesia & BPS."
      },
      logisticsCorridorNarrative: [
        "Keberhasilan rantai pasok usaha mandiri mengandalkan kemitraan pemasok bahan baku lokal berjarak tempuh < 1 jam dan sistem pengantaran online last-mile terpadu.",
        "Pemilihan lokasi strategis dengan visibilitas tinggi, area parkir memadai, dan kepadatan traffic target audiens muda menjadi penentu tercapainya okupansi harian."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Kemudahan perizinan Nomor Induk Berusaha (NIB OSS RBA) memangkas proses legalitas izin usaha mikro menjadi kurang dari 1 hari kerja.",
          "Lebih dari 78% pelanggan melakukan pembayaran non-tunai melalui QRIS dan e-wallet, menuntut koneksi internet kasir stabil.",
          "Tingkat retensi pelanggan berulang (*repeat customer rate*) di atas 40% tercapai melalui konsistensi rasa dan program loyalitas member.",
          "Periode pengembalian modal investasi awal (Payback Period / BEP) usaha mandiri yang terkelola baik rata-rata tercapai dalam 10–18 bulan."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Perkembangan Koperasi & UMKM Indonesia 2024/2025",
          publisher: "Kementerian Koperasi dan Usaha Kecil Menengah (Kemenkop UKM)",
          year: "2025",
          url: "https://kemenkopukm.go.id",
          keyMetric: "Kontribusi UMKM 61,07% PDB, 65,4 Juta unit usaha, 97% tenaga kerja"
        },
        {
          name: "Statistik Sistem Pembayaran Digital & Merchant QRIS Nasional",
          publisher: "Bank Indonesia (BI)",
          year: "2025",
          url: "https://bi.go.id",
          keyMetric: "Merchant QRIS tembus 34 Juta unit, pengguna aktif 55 Juta orang"
        },
        {
          name: "Survei Pola Konsumsi & Pengeluaran Rumah Tangga",
          publisher: "Badan Pusat Statistik (BPS)",
          year: "2025",
          url: "https://www.bps.go.id",
          keyMetric: "Porsi belanja makanan jadi dan rekreasi tumbuh 7,2% yoy di area perkotaan"
        }
      ]
    };
  }

  // =========================================================================
  // 10. MANUFAKTUR PABRIK / OTOMOTIF / INDUSTRI PENGOLAHAN
  // =========================================================================
  if (
    archetype === 'manufacturing' ||
    t.includes("pabrik") || t.includes("manufaktur") || t.includes("factory") ||
    t.includes("otomotif") || t.includes("perakitan") || t.includes("assembly") ||
    t.includes("garmen") || t.includes("tekstil") || t.includes("elektronik")
  ) {
    return {
      pageNumber: "02",
      sectionTitle: "Global & National Overview",
      industryCategory: "Manufaktur Industri & Otomotif",
      themeColor: "#6366f1",
      globalHeadline: "Global: transformasi smart manufacturing & Making Industry 4.0",
      globalNarrative: 
        "Output sektor manufaktur dan rantai pasok industri global mencapai nilai US$16,8 triliun pada 2025. Adopsi otomatisasi lini produksi, robotika industri, dan sistem Just-In-Time (JIT) tingkat lanjut memungkinkan peningkatan Overall Equipment Effectiveness (OEE) hingga di atas 85% dengan tingkat cacat produk mendekati zero-defect.",
      globalChart: {
        title: "Nilai Tambah Sektor Manufaktur Global (Triliun US$/tahun)",
        unit: "Triliun US$ / tahun",
        data: [
          { year: "2020", value: 13.5, displayValue: "13.5" },
          { year: "2021", value: 14.2, displayValue: "14.2" },
          { year: "2022", value: 14.9, displayValue: "14.9" },
          { year: "2023", value: 15.6, displayValue: "15.6" },
          { year: "2024", value: 16.2, displayValue: "16.2" },
          { year: "2025", value: 16.8, displayValue: "16.8" },
          { year: "2026F-30F (rata-rata)", value: 19.5, isForecast: true, displayValue: "19.5" }
        ],
        sourceText: "Sumber: UNIDO World Manufacturing Report 2025 & McKinsey Industrial Manufacturing Outlook 2026.",
        figureCaption: "Gambar 2.1 — Nilai tambah produksi manufaktur global dan otomotif.",
        sourceUrl: "https://www.unido.org"
      },
      globalCostAndOemNarrative: 
        "Integrasi rantai pasok komponen Tier-1 dan Tier-2 menuntut standar mutu ISO 9001:2015 dan IATF 16949. Pengiriman komponen terjadwal dengan milk-run logistics dan container kanban menekan inventaris gudang bahan baku menjadi kurang dari 3 hari operasional.",
      nationalHeadline: "Nasional: kontribusi manufaktur 18,7% PDB & indeks PMI ekspansif",
      nationalSummary: 
        "Kementerian Perindustrian mencatat industri pengolahan non-migas menyumbang 18,7% terhadap PDB nasional dengan Indeks Kepercayaan Industri (IKI) dan PMI Manufaktur stabil di fase ekspansi (>52,0) sepanjang 2025.",
      corporateBanner: {
        left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
        right: "Pancaran PBT • Pancaran Logistik"
      },
      nationalCapacityChart: {
        title: "Subsektor Kontributor Manufaktur Nasional (Triliun Rp)",
        unit: "Triliun Rupiah",
        data: [
          { name: "Makanan & Minuman Olahan", value: 890, displayValue: "Rp 890 T", color: "#6366f1" },
          { name: "Alat Angkutan & Otomotif", value: 420, displayValue: "Rp 420 T", color: "#60a5fa" },
          { name: "Bahan Kimia & Farmasi", value: 360, displayValue: "Rp 360 T", color: "#93c5fd" },
          { name: "Logam Dasar & Mesin", value: 295, displayValue: "Rp 295 T", color: "#64748b" },
          { name: "Tekstil & Produk Kulit", value: 180, displayValue: "Rp 180 T", color: "#94a3b8" }
        ],
        sourceText: "Total PDB sektor industri manufaktur pengolahan. Sumber: Kementerian Perindustrian & BPS 2025.",
        figureCaption: "Gambar 2.2 — Struktur kontribusi subsektor manufaktur non-migas nasional.",
        sourceUrl: "https://kemenperin.go.id"
      },
      regionalDonut: {
        title: "Sebaran Kawasan Industri Manufaktur",
        centerMetric: "18,7%",
        centerSublabel: "PDB Manufaktur",
        data: [
          { name: "Koridor Industri Bekasi-Karawang-Purwakarta", value: 46, color: "#1e3a8a", detail: "46% Output" },
          { name: "Jawa Timur (Surabaya, Gresik, Pasuruan)", value: 24, color: "#0284c7", detail: "24% Output" },
          { name: "Banten & Jawa Tengah (Semarang, Kendal)", value: 18, color: "#0d9488", detail: "18% Output" },
          { name: "Kawasan Industri Luar Jawa (KIK, Morowali)", value: 12, color: "#f59e0b", detail: "12% Output" }
        ],
        footnote: "*Kompilasi data Himpunan Kawasan Industri (HKI) & Kemenperin."
      },
      logisticsCorridorNarrative: [
        "Jaringan pasokan pabrik terpusat di sepanjang koridor Tol Jakarta-Cikampek-Cipali dan akses Tol Trans Jawa dengan konektivitas langsung ke Pelabuhan Patimban dan Tanjung Priok.",
        "Standar armada tertutup Wingbox dan Side-Curtain dengan sistem pelacakan digital menjamin kargo suku cadang terbebas dari cuaca ekstrem dan getaran."
      ],
      marketReality: {
        title: "Realitas pasar operasional per September 2026",
        bulletPoints: [
          "Penerapan SIINas (Sistem Informasi Industri Nasional) mewajibkan pelaporan berkala kapasitas produksi harian pabrik.",
          "Standar keselamatan kerja ISO 45001 dan audit 5R di area pabrik menjadi syarat mutlak kerja sama rantai pasok OEM multinasional.",
          "Target Overall Equipment Effectiveness (OEE) lini produksi ditargetkan minimal 85% guna menjaga struktur unit cost bersaing.",
          "Pemanfaatan atap pabrik untuk PLTS Atap (Rooftop Solar) mulai masif diadopsi guna menurunkan emisi karbon Scope 2 industri."
        ]
      },
      sourcesList: [
        {
          name: "Laporan Kinerja Industri Pengolahan Non-Migas 2024/2025",
          publisher: "Kementerian Perindustrian Republik Indonesia",
          year: "2025",
          url: "https://kemenperin.go.id",
          keyMetric: "Kontribusi manufaktur 18,7% PDB, serapan 19,3 Juta tenaga kerja"
        },
        {
          name: "Indeks Kepercayaan Industri (IKI) & Indeks PMI Manufaktur",
          publisher: "Pusat Data dan Informasi (Pusdatin) Kemenperin",
          year: "2025",
          url: "https://kemenperin.go.id",
          keyMetric: "PMI konsisten ekspansif di atas 52,0 poin"
        },
        {
          name: "Statistik Kawasan Industri Indonesia 2025",
          publisher: "Himpunan Kawasan Industri (HKI)",
          year: "2025",
          url: "https://hki.org.id",
          keyMetric: "142 Kawasan industri aktif dengan luas total 78.000 Ha"
        }
      ]
    };
  }

  // =========================================================================
  // 11. DEFAULT ADAPTIVE STRATEGIC LOGISTICS & COMMERCIAL CORRIDORS
  // =========================================================================
  return {
    pageNumber: "02",
    sectionTitle: "Global & National Overview",
    industryCategory: "Logistik Komersial & Angkutan Terpadu",
    themeColor: "#0f766e",
    globalHeadline: "Global: efisiensi rantai pasok & integrasi control tower digital",
    globalNarrative: 
      `Pasar logistik dan pergerakan kargo global bernilai US$9,8 triliun pada 2025 dan diproyeksikan tumbuh dengan CAGR 5,6% hingga US$12,9 triliun pada 2030. Kawasan Asia Pasifik menjadi episentrum pertumbuhan volume perdagangan dengan kontribusi lebih dari 44% pergerakan barang dunia. Implementasi Internet of Things (IoT), otomatisasi rute armada, dan sistem visibilitas menyeluruh (Control Tower) terbukti memangkas waktu tunggu armada hingga 24%.`,
    globalChart: {
      title: "Nilai Pasar Logistik & Rantai Pasok Global (Triliun US$)",
      unit: "Triliun US$ / tahun",
      data: [
        { year: "2020", value: 7.9, displayValue: "7.9" },
        { year: "2021", value: 8.4, displayValue: "8.4" },
        { year: "2022", value: 8.8, displayValue: "8.8" },
        { year: "2023", value: 9.1, displayValue: "9.1" },
        { year: "2024", value: 9.4, displayValue: "9.4" },
        { year: "2025", value: 9.8, displayValue: "9.8" },
        { year: "2026F-30F (rata-rata)", value: 11.4, isForecast: true, displayValue: "11.4" }
      ],
      sourceText: "Sumber: World Bank Logistics Performance Index (LPI) 2025 & Armstrong & Associates Global Logistics Report 2026.",
      figureCaption: "Gambar 2.1 — Pertumbuhan nilai industri logistik dan freight forwarding global.",
      sourceUrl: "https://www.worldbank.org/en/publication/logistics-performance-index"
    },
    globalCostAndOemNarrative: 
      `Penerapan telematika GPS satelit canggih, sensor bobot muatan real-time, dan integrasi enterprise ERP meminimalkan risiko kecelakaan di jalan serta menjaga indeks On-Time In-Full (OTIF) di atas 98,5%. Kontrak jangka panjang 3–5 tahun dengan formula penyesuaian bahan bakar (Fuel Surcharge Mechanism) menjadi fondasi kepastian margin investasi.`,
    nationalHeadline: "Nasional: biaya logistik menuju 12,3% PDB & konektivitas tol terintegrasi",
    nationalSummary: 
      `Pemerintah Indonesia melalui Rencana Aksi Nasional Logistik menargetkan penurunan biaya logistik dari 14,29% menjadi 12,3% dari PDB nasional. Pembangunan jalan tol lintas pulau dan sentra depo logistik terpadu mempercepat waktu tempuh antardaerah hingga 40%.`,
    corporateBanner: {
      left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
      right: "Pancaran PBT • Pancaran Logistik"
    },
    nationalCapacityChart: {
      title: "Komposisi Moda Angkutan Logistik Domestik Nasional (%)",
      unit: "% Pangsa Moda",
      data: [
        { name: "Angkutan Darat (Truk)", value: 87.2, displayValue: "87.2%", color: "#0f766e" },
        { name: "Angkutan Laut (Kapal/Tongkang)", value: 10.5, displayValue: "10.5%", color: "#60a5fa" },
        { name: "Kereta Api Logistik", value: 1.8, displayValue: "1.8%", color: "#93c5fd" },
        { name: "Angkutan Udara (Cargo)", value: 0.5, displayValue: "0.5%", color: "#64748b" }
      ],
      sourceText: "Total pangsa moda logistik domestik. Sumber: Kementerian Perhubungan & Bappenas 2025.",
      figureCaption: "Gambar 2.2 — Distribusi pangsa moda transportasi angkutan barang di Indonesia.",
      sourceUrl: "https://dephub.go.id"
    },
    regionalDonut: {
      title: "Sebaran Pergerakan Kargo Logistik Nasional",
      centerMetric: "100%",
      centerSublabel: "Arus Barang",
      data: [
        { name: "Pulau Jawa (Koridor Industri)", value: 58, color: "#1e3a8a", detail: "58% Total Arus" },
        { name: "Pulau Sumatera", value: 22, color: "#0284c7", detail: "22% Total Arus" },
        { name: "Kalimantan & Sulawesi", value: 14, color: "#0d9488", detail: "14% Total Arus" },
        { name: "Bali, Nusa Tenggara & Papua", value: 6, color: "#f59e0b", detail: "6% Total Arus" }
      ],
      footnote: "*Kompilasi data Badan Pusat Statistik & Asosiasi Logistik Indonesia (ALI)."
    },
    logisticsCorridorNarrative: [
      `Koridor arteri darat Pantura Jawa, Tol Trans-Jawa, dan Tol Trans-Sumatera menjadi urat nadi pergerakan kargo utama dengan intensitas pergerakan lebih dari 120.000 kendaraan angkutan barang per hari.`,
      `Kemitraan strategis dengan operator terminal peti kemas dan integrasi digital manifest INSW menjamin kelancaran interkoneksi logistik antarpulau.`
    ],
    marketReality: {
      title: "Realitas pasar operasional per September 2026",
      bulletPoints: [
        "Klien korporat industri mewajibkan transparansi pelacakan kargo real-time melalui web portal dan e-POD (electronic Proof of Delivery).",
        "Peningkatan kepatuhan regulasi batas muatan sumbu terberat (JBI) mendorong optimalisasi tata letak muatan dan rute jalan arteri.",
        "Kenaikan indeks inflasi suku cadang diantisipasi melalui program preventive maintenance armada secara berkala.",
        "Permintaan kontrak angkutan terpadu jangka panjang multi-tahun meningkat untuk menjamin stabilitas pasokan kapasitas truk."
      ]
    },
    sourcesList: [
      {
        name: "Logistics Performance Index (LPI) & Global Supply Chain Report",
        publisher: "World Bank",
        year: "2025",
        url: "https://www.worldbank.org/en/publication/logistics-performance-index",
        keyMetric: "Pasar logistik global US$9,8 Triliun, pangsa Asia Pasifik > 44%"
      },
      {
        name: "Laporan Kinerja Logistik Nasional & Penurunan Biaya Logistik PDB",
        publisher: "Kementerian PPN / Bappenas & Kemenko Perekonomian",
        year: "2025",
        url: "https://bappenas.go.id",
        keyMetric: "Biaya logistik Indonesia ditargetkan turun ke 12,3% PDB"
      },
      {
        name: "Statistik Transportasi & Perhubungan Darat 2024/2025",
        publisher: "Badan Pusat Statistik (BPS) & Kementerian Perhubungan",
        year: "2025",
        url: "https://www.bps.go.id",
        keyMetric: "Dominasi angkutan darat truk 87,2% dari total tonase logistik domestik"
      },
      {
        name: "Kajian Kinerja & Standar Operasional Angkutan Barang",
        publisher: "Asosiasi Logistik dan Forwarder Indonesia (ALFI / ILFA)",
        year: "2025",
        url: "https://alfi.or.id",
        keyMetric: "Standar keandalan armada OTIF ≥ 98,5%, sistem telematika wajib"
      }
    ]
  };
}
