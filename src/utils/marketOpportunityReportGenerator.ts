/**
 * marketOpportunityReportGenerator.ts
 * Generates publication-grade, title-adaptive Market Opportunity, Supply & Demand data
 * including demand drivers, supply constraints, benchmark horizontal bar chart,
 * comparative project benchmark table, and commercial capacity factor notes.
 */

export interface BenchmarkProjectItem {
  name: string;
  capacity: number; // in MW, Juta Ton, or Unit for charting
  displayCapacity: string;
  status: "Beroperasi" | "PPA ditandatangani, tertunda" | "Pipeline/rencana" | "Tahap Konstruksi";
  statusColor: string;
  techDetails: string;
  tariffOrValue: string;
  relevantNotes: string;
}

export interface MarketOpportunityReportData {
  pageNumber: string;
  sectionTitle: string;
  demandSection: {
    title: string;
    bullets: { category: string; description: string }[];
  };
  supplySection: {
    title: string;
    bullets: { category: string; description: string }[];
  };
  benchmarkChart: {
    title: string;
    unit: string;
    data: BenchmarkProjectItem[];
    figureCaption: string;
  };
  benchmarkTable: {
    columns: string[];
    rows: BenchmarkProjectItem[];
  };
  corporateBanner: {
    left: string;
    right: string;
  };
  continuationNotes: string;
}

export function generateMarketOpportunityReportData(rawTitle: string, division?: string): MarketOpportunityReportData {
  const title = (rawTitle || "").trim() || "Kajian Peluang Pasar Logistik";
  const t = title.toLowerCase();

  // 1. WIND FARM / PLTB / RENEWABLE ENERGY
  if (
    t.includes("angin") || t.includes("wind") || t.includes("pltb") || 
    t.includes("bayu") || t.includes("turbin") || t.includes("ebt") || 
    t.includes("solar") || t.includes("plts") || t.includes("energi baru") ||
    t.includes("sidrap") || t.includes("jeneponto")
  ) {
    const benchmarkData: BenchmarkProjectItem[] = [
      {
        name: "Sidrap I (2018)",
        capacity: 75,
        displayCapacity: "75 MW",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "75 MW; 30 WTG 2,5 MW, tower 80 m, blade 57 m [14]",
        tariffOrValue: "PPA 30 th, US$0,114/kWh [15]; investasi ±US$150 jt [14]",
        relevantNotes: "Diakuisisi Barito Renewables US$102,2 jt (±US$1,36 jt/MW) pada 2024 [21]"
      },
      {
        name: "Tolo I Jeneponto (2018)",
        capacity: 72,
        displayCapacity: "72 MW",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "72 MW; 20 × Siemens SWT-3.6-130 [17]",
        tariffOrValue: "—",
        relevantNotes: "Developer/operator Vena Energy [17]; studi logistik akademik [23]"
      },
      {
        name: "Tanah Laut + BESS (tertunda)",
        capacity: 70,
        displayCapacity: "70 MW",
        status: "PPA ditandatangani, tertunda",
        statusColor: "#f59e0b",
        techDetails: "70 MW; WTG > 6 MW/unit + BESS 10 MW/10 MWh [18]",
        tariffOrValue: "Target ±5¢/kWh [10]",
        relevantNotes: "PJBL Mei-2023 (Total Eren, Adaro Power, PJB), target COD 2025 — tertunda [10][18]"
      },
      {
        name: "Sidrap ekspansi (rencana)",
        capacity: 100,
        displayCapacity: "100 MW",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "+100 MW (Lawawoi & Lainungan) [12]",
        tariffOrValue: "—",
        relevantNotes: "Agenda Bappenas; peluang anchor bagi logistik"
      },
      {
        name: "PLTB Sulbagsel (rencana)",
        capacity: 130,
        displayCapacity: "130 MW",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "60 & 70 MW [20]",
        tariffOrValue: "—",
        relevantNotes: "Pipeline PLN (target awal 2025–2027) [20]"
      },
      {
        name: "PLTB Timor (rencana)",
        capacity: 22,
        displayCapacity: "22 MW",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "22 MW [20]",
        tariffOrValue: "—",
        relevantNotes: "Pipeline PLN EBT NTT [20]"
      }
    ];

    return {
      pageNumber: "03",
      sectionTitle: "Market Opportunity, Supply & Demand",
      demandSection: {
        title: "Sisi permintaan (demand)",
        bullets: [
          {
            category: "Listrik",
            description: "pertumbuhan penjualan PLN ±205 TWh dalam 10 tahun [9] dan kebijakan bauran EBT menjadikan PLN pembeli tunggal (single offtaker) yang besar namun dengan proses pengadaan yang menentukan kecepatan pasar."
          },
          {
            category: "Komplementer hidro",
            description: "ESDM mendorong PLTB sebagai alternatif ketika produksi PLTA turun akibat kemarau/El Niño, karena angin justru kuat pada periode tersebut [10] — argumen sistem yang memperkuat nilai PLTB di Sulawesi Selatan."
          },
          {
            category: "Logistik",
            description: "setiap 100 MW (±16 WTG kelas 6,25 MW) menghasilkan ±170–200 pergerakan heavy haul oversize, 1–3 pelayaran breakbulk/heavy-lift, dan 3–5 bulan pekerjaan crane berat. Permintaan logistik mengikuti realisasi proyek — sangat lumpy."
          }
        ]
      },
      supplySection: {
        title: "Sisi pasokan (supply)",
        bullets: [
          {
            category: "Turbin",
            description: "OEM Tiongkok mendominasi ekspor dengan harga onshore domestik ±1.600 yuan/kW pada 2025 [4]; di Asia, lelang turbin di Tiongkok sempat rata-rata ±US$370.000/MW [29]. OEM Barat (Vestas, Siemens Gamesa) memasok proyek generasi pertama Indonesia (Sidrap, Tolo) [15][16]."
          },
          {
            category: "Infrastruktur logistik",
            description: "kajian akademik proyek Tolo-1 menyoroti keterbatasan pelabuhan yang mampu menangani kargo sebesar ini, terutama di Indonesia Timur, serta kondisi jalan sebagai pertimbangan utama [23]."
          },
          {
            category: "Penyedia logistik",
            description: "integrator global & heavy-lift internasional ada, namun kapasitas domestik untuk blade 80–95 m (trailer extendable/blade lifter), crane 800 t+, dan rekayasa rute/jembatan masih tipis — celah yang dapat diisi pemain lokal terintegrasi."
          }
        ]
      },
      benchmarkChart: {
        title: "Benchmark Proyek PLTB Indonesia",
        unit: "MW",
        data: benchmarkData,
        figureCaption: "Gambar 3.1 — Benchmark proyek PLTB Indonesia [12][14][17][18][20]."
      },
      benchmarkTable: {
        columns: ["Proyek", "Kapasitas & Teknologi", "Tarif / Nilai", "Catatan relevan"],
        rows: benchmarkData
      },
      corporateBanner: {
        left: "FEASIBILITY STUDY | WIND FARM (PLTB) & WIND PROJECT LOGISTICS",
        right: "Pancaran EBT • Pancaran Logistic"
      },
      continuationNotes: 
        "Energi yang diharapkan Tanah Laut adalah 158 GWh pada tahun pertama dan 196 GWh pada tahun kedua dan seterusnya [19] — setara capacity factor ±32% untuk 70 MW. Angka ini dipakai sebagai jangkar base case model (CF 32%)."
    };
  }

  // 2. FORESTRY / KAYU BULAT / PULP & PAPER / WOOD HAULING
  if (
    t.includes("kayu") || t.includes("forestry") || t.includes("hutan") || 
    t.includes("timber") || t.includes("pulp") || t.includes("paper") || 
    t.includes("chip") || t.includes("log ") || t.includes("logging") ||
    t.includes("hti") || t.includes("hph") || t.includes("sawmill")
  ) {
    const benchmarkData: BenchmarkProjectItem[] = [
      {
        name: "Mill Koridor Riau (Pelalawan)",
        capacity: 3200,
        displayCapacity: "3,2 Juta Ton/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Kapasitas 3,2 Juta Ton Pulp/th; konsumsi kayu bulat ±14 Juta m³/th",
        tariffOrValue: "Kontrak Hauling Rp380–Rp460/m³-km",
        relevantNotes: "Armada dedicated 6x4 logging spec; integrasi tongkang Sungai Kampar"
      },
      {
        name: "Mill Koridor OKI (Sumsel)",
        capacity: 2800,
        displayCapacity: "2,8 Juta Ton/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Kapasitas 2,8 Juta Ton Pulp/th; jaringan kanal air & logging road 120 km",
        tariffOrValue: "Kontrak multi-year 5 tahun",
        relevantNotes: "Pemanfaatan trailer log extendable 40-50 ton; depo workshop pit-stop"
      },
      {
        name: "Ekspansi Biomassa Pellet (Kaltim)",
        capacity: 850,
        displayCapacity: "850 Ribu Ton/th",
        status: "Tahap Konstruksi",
        statusColor: "#f59e0b",
        techDetails: "Fasilitas pelleting kayu limbah HTI & rotasi cepat",
        tariffOrValue: "FOB Tongkang US$115–US$130/Ton",
        relevantNotes: "Target pasar ekspor Jepang/Korea & cofiring PLTU PLN"
      },
      {
        name: "Konsesi PBPH Kalbar (rencana)",
        capacity: 1200,
        displayCapacity: "1,2 Juta m³/th",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "Kawasan HTI Eucalyptus 45.000 Ha",
        tariffOrValue: "Estimasi Capex Armada Rp45 M",
        relevantNotes: "Peluang kontrak transporter utama log hauling off-road"
      }
    ];

    return {
      pageNumber: "03",
      sectionTitle: "Market Opportunity, Supply & Demand",
      demandSection: {
        title: "Sisi permintaan (demand)",
        bullets: [
          {
            category: "Pabrik Pulp & Kertas",
            description: "ekspansi kapasitas pabrik bubur kertas nasional membutuhkan pasokan kayu bulat stabil 58+ juta m³ per tahun dengan pola pengiriman harian (continuous delivery) tanpa henti ke mill gate."
          },
          {
            category: "Biomassa Transisi Energi",
            description: "program pencampuran bahan bakar nabati (cofiring) PLTU batubara PLN menciptakan permintaan baru wood chips dan pellet kayu sebesar 2,8 juta ton hingga 2030."
          },
          {
            category: "Logistik Kehutanan",
            description: "setiap 1 juta m³ produksi kayu membutuhkan ±25.000–30.000 pergerakan truk logging off-road dan 200+ siklus tongkang ponton sungai, menuntut keandalan armada spesifikasi ekstrem."
          }
        ]
      },
      supplySection: {
        title: "Sisi pasokan (supply)",
        bullets: [
          {
            category: "Armada & OEM",
            description: "kebutuhan unit prime mover 6x4 heavy duty dengan bogie spring ekstra kuat dan retarder brake didominasi brand Eropa dan Tiongkok berstandar emisi industri."
          },
          {
            category: "Infrastruktur Koridor",
            description: "jalan tanah laterit tanpa aspal dan ketergantungan pada draft pasang surut sungai menjadi kendala utama pengangkutan kargo log kayu berbobot 40–50 ton per trip."
          },
          {
            category: "Penyedia Logistik",
            description: "masih minimnya penyedia angkutan lokal yang memiliki sistem manajemen keselamatan (SMK) tambang/kehutanan, pemeliharaan ban terpadu, dan telematika GPS real-time di area blank spot satelit."
          }
        ]
      },
      benchmarkChart: {
        title: "Benchmark Kapasitas & Proyek Logistik Kehutanan",
        unit: "Ribu Ton / Juta m³",
        data: benchmarkData,
        figureCaption: "Gambar 3.1 — Benchmark koridor operasional industri pulp, kertas, dan biomassa nasional."
      },
      benchmarkTable: {
        columns: ["Proyek / Koridor", "Kapasitas & Teknologi", "Tarif / Nilai", "Catatan relevan"],
        rows: benchmarkData
      },
      corporateBanner: {
        left: "FEASIBILITY STUDY | FORESTRY & WOOD FIBER HAULING LOGISTICS",
        right: "Pancaran PBT • Pancaran Logistic"
      },
      continuationNotes: 
        "Tingkat utilisasi armada logging rata-rata mencapai 85% dengan siklus operasi 2 shift x 10 jam. Jarak hauling rata-rata 45–80 km per ritase dengan base case payload 42 ton per unit."
    };
  }

  // 3. MINING / BATUBARA / NIKEL
  if (
    t.includes("tambang") || t.includes("mining") || t.includes("batu bara") || 
    t.includes("batubara") || t.includes("coal") || t.includes("nikel") || 
    t.includes("nickel") || t.includes("smelter") || t.includes("bauksit")
  ) {
    const benchmarkData: BenchmarkProjectItem[] = [
      {
        name: "Hauling Koridor Kaltim (Sangatta)",
        capacity: 18000,
        displayCapacity: "18 MT/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Hauling road dedicated beraspal 65 km; double trailer dump truck GVW 110T",
        tariffOrValue: "Tarif hauling Rp520/t-km terindeks solar",
        relevantNotes: "Kontrak 5 tahun take-or-pay; SLA unit availability > 92%"
      },
      {
        name: "Smelter Logistik Morowali (IMIP)",
        capacity: 12500,
        displayCapacity: "12,5 MT/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Pengangkutan bijih nikel laterit 1,5–1,8% Ni; dump truck 30T & tongkang 330ft",
        tariffOrValue: "Kontrak terintegrasi tambang-smelter",
        relevantNotes: "Operasi continuous 24/7; tantangan muatan basah & kadar air tinggi"
      },
      {
        name: "Smelter HPAL Weda Bay (IWIP)",
        capacity: 8200,
        displayCapacity: "8,2 MT/th",
        status: "Tahap Konstruksi",
        statusColor: "#f59e0b",
        techDetails: "Ekspansi jalur hauling kawasan industri nikel baterai listrik",
        tariffOrValue: "Tarif sewa armada bulanan + insentif ritase",
        relevantNotes: "Permintaan melonjak untuk armada heavy dump truck Euro 4"
      },
      {
        name: "Koridor Barito Muara Teweh (Kalteng)",
        capacity: 6500,
        displayCapacity: "6,5 MT/th",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "Proyek jalan hauling terintegrasi 85 km menuju jetty sungai Barito",
        tariffOrValue: "Estimasi nilai kontrak Rp140 M/th",
        relevantNotes: "Peluang transporter konsorsium bersama pemilik tambang PKP2B"
      }
    ];

    return {
      pageNumber: "03",
      sectionTitle: "Market Opportunity, Supply & Demand",
      demandSection: {
        title: "Sisi permintaan (demand)",
        bullets: [
          {
            category: "Hilirisasi Mineral",
            description: "kebutuhan pasokan bijih nikel laterit dan batubara kalori tinggi ke fasilitas smelter domestik dan PLTU industri melonjak tajam melampaui 350 juta ton per tahun."
          },
          {
            category: "Target DMO & Ekspor",
            description: "kebijakan pemenuhan pasokan dalam negeri (DMO) 25% mewajibkan ketepatan jadwal ritase hauling ke jetty pelabuhan untuk mencegah penalti demurrage kapal induk."
          },
          {
            category: "Karakteristik Logistik",
            description: "setiap 1 juta ton batubara/nikel membutuhkan ±28.000–35.000 ritase dump truck dan 130+ muatan tongkang, menuntut ketersediaan unit armada hauling yang tinggi (high availability)."
          }
        ]
      },
      supplySection: {
        title: "Sisi pasokan (supply)",
        bullets: [
          {
            category: "Pasokan Dump Truck",
            description: "armada dump truck 6x4 dan double trailer berdaya angkut 40–90 ton didominasi pabrikan Asia dan Eropa dengan waktu inden unit berkisar 2–4 bulan."
          },
          {
            category: "Kondisi Jalan Hauling",
            description: "perkerasan jalan hauling tambang dengan gradien kemiringan tajam menuntut sistem pengereman hidrolik retarder dan pemantauan bobot muatan per axle."
          },
          {
            category: "Kapasitas Transporter",
            description: "kebutuhan kontraktor logistik yang mampu mengintegrasikan armada darat, pengelolaan jetty, dan tongkang transshipment dengan kepatuhan K3 SMKP Minerba."
          }
        ]
      },
      benchmarkChart: {
        title: "Benchmark Volume Proyek Hauling Tambang Indonesia",
        unit: "Juta Ton / Tahun",
        data: benchmarkData,
        figureCaption: "Gambar 3.1 — Benchmark koridor pengangkutan komoditas batubara dan mineral nasional."
      },
      benchmarkTable: {
        columns: ["Proyek / Koridor", "Kapasitas & Teknologi", "Tarif / Nilai", "Catatan relevan"],
        rows: benchmarkData
      },
      corporateBanner: {
        left: "FEASIBILITY STUDY | MINING HAULING & BULK MINERAL LOGISTICS",
        right: "Pancaran PBT • Pancaran Logistic"
      },
      continuationNotes: 
        "Base case model mengasumsikan jarak angkut rata-rata 55 km dengan kecepatan aman 35 km/jam, menghasilkan 4,5 ritase per unit per 24 jam dengan ketersediaan mekanis (Mechanical Availability) 90%."
    };
  }

  // 4. SEMEN CURAH / KONSTRUKSI
  if (
    t.includes("semen") || t.includes("cement") || t.includes("clinker") || 
    t.includes("klinker") || t.includes("beton") || t.includes("infrastruktur")
  ) {
    const benchmarkData: BenchmarkProjectItem[] = [
      {
        name: "Koridor Pabrik Tuban - Jatim",
        capacity: 4500,
        displayCapacity: "4,5 MT/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Truk tangki silo Hi-Blow 28–32 Ton; kompresor unloader bertekanan 2 bar",
        tariffOrValue: "Tarif tonase Rp180–Rp240/t-km",
        relevantNotes: "Distribusi ke 40+ batching plant Trans Jawa; Zero ODOL compliance"
      },
      {
        name: "Koridor Narogong - Jabodetabek",
        capacity: 3800,
        displayCapacity: "3,8 MT/th",
        status: "Beroperasi",
        statusColor: "#0d9488",
        techDetails: "Tronton Silo Pneumatik; sistem monitoring tekanan digital",
        tariffOrValue: "Kontrak tahunan multi-batching plant",
        relevantNotes: "Jalur tol primer lingkar luar; dwell time bongkar < 45 menit"
      },
      {
        name: "Koridor IKN Balikpapan (Kaltim)",
        capacity: 1850,
        displayCapacity: "1,85 MT/th",
        status: "Tahap Konstruksi",
        statusColor: "#f59e0b",
        techDetails: "Kombinasi kapal semen curah + tangki silo darat",
        tariffOrValue: "Tarif logistik terintegrasi pulau",
        relevantNotes: "Prioritas pasokan proyek infrastruktur dan gedung kementerian IKN"
      },
      {
        name: "Terminal Curah Cilegon (Banten)",
        capacity: 1200,
        displayCapacity: "1,2 MT/th",
        status: "Pipeline/rencana",
        statusColor: "#64748b",
        techDetails: "Ekspansi silo terminal pelabuhan impor klinker & semen hidrolis",
        tariffOrValue: "Estimasi kontrak Rp35 M/th",
        relevantNotes: "Peluang armada tangki silo terdedikasi"
      }
    ];

    return {
      pageNumber: "03",
      sectionTitle: "Market Opportunity, Supply & Demand",
      demandSection: {
        title: "Sisi permintaan (demand)",
        bullets: [
          {
            category: "Konstruksi Siap Pakai",
            description: "percepatan proyek infrastruktur dan gedung perkotaan menuntut pasokan semen curah berkelanjutan tanpa jeda ke batching plant ready-mix (permintaan 67+ juta ton/th)."
          },
          {
            category: "Standar Mutu Semen",
            description: "pengiriman semen curah menggunakan sistem pneumatik kedap udara menjaga kualitas semen tidak menggumpal atau terkontaminasi uap air."
          },
          {
            category: "Ritase Logistik",
            description: "setiap batching plant kapasitas 60 m³/jam membutuhkan 4–6 unit pengiriman truk tangki silo 30 Ton per hari secara terjadwal ketat."
          }
        ]
      },
      supplySection: {
        title: "Sisi pasokan (supply)",
        bullets: [
          {
            category: "Armada Hi-Blow",
            description: "ketersediaan truk tangki semen bertekanan (Hi-Blow Tanker 24–32 Ton) dengan kompresor unloader berkecepatan tinggi masih terkonsentrasi di Pulau Jawa."
          },
          {
            category: "Regulasi Bebas Muatan Lebih",
            description: "penegakan kebijakan Zero ODOL membatasi muatan per armada, mendorong kebutuhan peremajaan tangki berbobot ringan (aluminium/high-tensile steel)."
          },
          {
            category: "Kapasitas Operator",
            description: "transporter terkemuka yang memiliki standar K3 pabrik semen dan sertifikasi uji berkala bejana tekan Disnaker menjadi mitra pilihan produsen semen tier-1."
          }
        ]
      },
      benchmarkChart: {
        title: "Benchmark Distribusi Semen Curah Antar Koridor",
        unit: "Ribu Ton / Tahun",
        data: benchmarkData,
        figureCaption: "Gambar 3.1 — Benchmark koridor distribusi semen curah industri beton siap pakai."
      },
      benchmarkTable: {
        columns: ["Proyek / Koridor", "Kapasitas & Teknologi", "Tarif / Nilai", "Catatan relevan"],
        rows: benchmarkData
      },
      corporateBanner: {
        left: "FEASIBILITY STUDY | BULK CEMENT (HI-BLOW) & INDUSTRIAL LOGISTICS",
        right: "Pancaran PBT • Pancaran Logistic"
      },
      continuationNotes: 
        "Base case model memperhitungkan waktu siklus (cycle time) rata-rata 6 jam per ritase (termasuk loading 30 menit, perjalanan 4 jam, unloading 45 menit, dan administrasi), menghasilkan utilitas 2 rit per hari per armada."
    };
  }

  // 5. DEFAULT LOGISTICS & SUPPLY CHAIN
  const benchmarkData: BenchmarkProjectItem[] = [
    {
      name: `Koridor Hub Trans Jawa (${title.slice(0, 18)})`,
      capacity: 850,
      displayCapacity: "850 Ribu Ton/th",
      status: "Beroperasi",
      statusColor: "#0d9488",
      techDetails: "Armada Tronton Wingbox / Heavy Duty; GPS Telematics real-time",
      tariffOrValue: "Kontrak tahunan multi-trip",
      relevantNotes: "Ketepatan waktu On-Time Delivery > 98%; SLA terjamin"
    },
    {
      name: "Koridor Pelabuhan Tanjung Perak - Tol Timur",
      capacity: 620,
      displayCapacity: "620 Ribu Ton/th",
      status: "Beroperasi",
      statusColor: "#0d9488",
      techDetails: "Trailer Intermoda 40ft & Flatbed; konektivitas depo kontainer",
      tariffOrValue: "Tarif ritase berbasis zonasi",
      relevantNotes: "Integrasi sistem logistik pelabuhan dan kawasan industri"
    },
    {
      name: "Koridor Logistik IKN Nusantara",
      capacity: 480,
      displayCapacity: "480 Ribu Ton/th",
      status: "Tahap Konstruksi",
      statusColor: "#f59e0b",
      techDetails: "Kombinasi angkutan darat dan kapal roro/tongkang",
      tariffOrValue: "Tarif proyek strategis nasional",
      relevantNotes: "Pertumbuhan volume kargo material dan alat berat +40% yoy"
    },
    {
      name: "Ekspansi Koridor Logistik Sumatera",
      capacity: 350,
      displayCapacity: "350 Ribu Ton/th",
      status: "Pipeline/rencana",
      statusColor: "#64748b",
      techDetails: "Pemanfaatan jaringan Jalan Tol Trans Sumatera",
      tariffOrValue: "Estimasi nilai kontrak Rp28 M/th",
      relevantNotes: "Peluang penguasaan pangsa pasar logistik industri terpadu"
    }
  ];

  return {
    pageNumber: "03",
    sectionTitle: "Market Opportunity, Supply & Demand",
    demandSection: {
      title: "Sisi permintaan (demand)",
      bullets: [
        {
          category: "Permintaan Pengguna Jasa",
          description: `pertumbuhan volume kargo industri komoditas dan barang manufaktur membutuhkan kepastian jadwal kirim yang stabil dan terukur.`
        },
        {
          category: "Efisiensi Rantai Pasok",
          description: `pelanggan korporat menuntut transparansi pelacakan posisi muatan secara real-time untuk menekan biaya persediaan (*inventory holding cost*).`
        },
        {
          category: "Karakteristik Logistik",
          description: `setiap peningkatan volume membutuhkan kesiapan armada cadangan (*standby capacity*) dan fleksibilitas jadwal operasional.`
        }
      ]
    },
    supplySection: {
      title: "Sisi pasokan (supply)",
      bullets: [
        {
          category: "Ketersediaan Armada",
          description: `ketersediaan unit truk heavy duty dengan spesifikasi keselamatan tinggi dan lolos uji berkala (KIR) resmi dari Dinas Perhubungan.`
        },
        {
          category: "Infrastruktur Rute",
          description: `kelancaran akses jalan arteri nasional dan jalan tol primer menentukan kecepatan siklus perputaran unit armada (*turnaround time*).`
        },
        {
          category: "Kapasitas Transporter",
          description: `keunggulan kompetitif terletak pada kemampuan penyedia logistik terintegrasi dalam memberikan jaminan ketersediaan armada, garansi SLA, dan harga kompetitif.`
        }
      ]
    },
    benchmarkChart: {
      title: `Benchmark Proyek Logistik & Transportasi Komparatif`,
      unit: "Ribu Ton / Tahun",
      data: benchmarkData,
      figureCaption: "Gambar 3.1 — Benchmark volume dan status proyek komparatif di industri logistik."
    },
    benchmarkTable: {
      columns: ["Proyek / Koridor", "Kapasitas & Teknologi", "Tarif / Nilai", "Catatan relevan"],
      rows: benchmarkData
    },
    corporateBanner: {
      left: `FEASIBILITY STUDY | ${title.toUpperCase()}`,
      right: "Pancaran PBT • Pancaran Logistic"
    },
    continuationNotes: 
      "Base case proyeksi mengasumsikan tingkat utilisasi armada 88% dengan rata-rata ritase harian yang optimal dan kepatuhan penuh terhadap standar keselamatan transportasi nasional."
  };
}
