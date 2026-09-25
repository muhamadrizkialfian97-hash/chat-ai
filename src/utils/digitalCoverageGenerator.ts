/**
 * PRAMA AI Digital Coverage & Control Tower Generator (Pilar 14)
 * Generates tailored, 100% project-aligned Digital Control Tower Architecture,
 * Inbound/Outbound Data Nodes, Implementation Roadmap, and Cost Breakdown.
 */

import { loadSavedProjectParameters, ProjectParameters } from "../types/projectParameters";

export interface ControlTowerNode {
  id: string;
  title: string;
  subtitle: string;
}

export interface DigitalBudgetStage {
  stage: string;
  scope: string;
  indicativeCost: string;
}

export interface DigitalCoverageResult {
  title: string;
  division: string;
  sectorName: string;
  centerNodeTitle: string;
  centerNodeSubtitle: string;
  kpiBanner: string;
  inboundNodes: ControlTowerNode[];
  outboundNodes: ControlTowerNode[];
  diagramCaption: string;
  narrativeParagraph: string;
  budgetTable: DigitalBudgetStage[];
  toolsSummary: string;
  methodSummary: string;
  impactSummary: string;
  automationSummary: string;
  narrativeMarkdown: string;
}

export function generateDigitalCoverageForTitle(
  rawTitle: string,
  division?: string
): DigitalCoverageResult {
  const title = (rawTitle || "").trim() || "Kajian Cakupan Digital, Otomasi & Telematika Logistik";
  const titleLower = title.toLowerCase();
  const divName = (division || "Logistik Darat & Telematika").trim();
  const params: ProjectParameters = loadSavedProjectParameters(title);

  // 1. WIND FARM & RENEWABLE ENERGY (PLTB / EBT)
  if (
    titleLower.includes("wind") ||
    titleLower.includes("pltb") ||
    titleLower.includes("angin") ||
    titleLower.includes("turbin") ||
    titleLower.includes("jeneponto") ||
    titleLower.includes("sidrap") ||
    titleLower.includes("blade")
  ) {
    const centerNodeTitle = "PANCARAN WIND CONTROL TOWER";
    const centerNodeSubtitle = "data tunggal per nomor seri";
    const kpiBanner = "KPI: OTIF ≥ 98% • damage < 0,5% • permit lead-time • idle crane-day";

    const inboundNodes: ControlTowerNode[] = [
      {
        id: "in-1",
        title: "OEM ERP / packing list",
        subtitle: "(ASN, serial, dimensi)"
      },
      {
        id: "in-2",
        title: "Vessel AIS & ETA",
        subtitle: "(breakbulk tracking)"
      },
      {
        id: "in-3",
        title: "Customs (INSW/CEISA)",
        subtitle: "& dokumen"
      },
      {
        id: "in-4",
        title: "Yard mgmt & RFID",
        subtitle: "(marshalling)"
      }
    ];

    const outboundNodes: ControlTowerNode[] = [
      {
        id: "out-1",
        title: "Convoy GPS & geofence",
        subtitle: "+ ETA dinamis"
      },
      {
        id: "out-2",
        title: "IoT sensor blade",
        subtitle: "(shock/tilt/suhu)"
      },
      {
        id: "out-3",
        title: "Permit, escort &",
        subtitle: "road-closure calendar"
      },
      {
        id: "out-4",
        title: "Dashboard klien, KPI",
        subtitle: "& claim/insurance"
      }
    ];

    const diagramCaption = "Gambar 14.1 — Arsitektur digital control tower (desain penulis).";
    const narrativeParagraph =
      "Control tower menjadi pembeda utama sebuah integrator: seluruh komponen (per nomor seri) dilacak dari pabrik hingga terpasang. Modul minimum: (1) master data komponen dari packing list/ASN OEM; (2) pelacakan kapal via AIS dan ETA dinamis; (3) integrasi status kepabeanan; (4) manajemen yard berbasis RFID/QR; (5) GPS & geofence konvoi dengan kalender izin, pengawalan, dan penutupan jalan; (6) sensor IoT pada blade (guncangan, kemiringan, suhu) untuk bukti klaim asuransi; (7) portal pelanggan dengan KPI OTIF, damage rate, dan crane idle-hour.";

    const budgetTable: DigitalBudgetStage[] = [
      {
        stage: "v1 (12 bulan)",
        scope: "Tracking serial, ETA kapal, yard, konvoi GPS, dashboard klien",
        indicativeCost: "US$0,5 jt"
      },
      {
        stage: "v2 (24 bulan)",
        scope: "IoT blade, integrasi ERP OEM & sistem kepabeanan, analitik keterlambatan",
        indicativeCost: "US$0,3 jt"
      },
      {
        stage: "Run",
        scope: "Lisensi, cloud, 2 analis",
        indicativeCost: "US$0,3 jt/th"
      }
    ];

    return buildDigitalResult(
      title,
      divName,
      "Logistik Proyek Energi Terbarukan & Heavy Haulage PLTB",
      centerNodeTitle,
      centerNodeSubtitle,
      kpiBanner,
      inboundNodes,
      outboundNodes,
      diagramCaption,
      narrativeParagraph,
      budgetTable
    );
  }

  // 2. FORESTRY / KEHUTANAN HTI & LOGGING
  if (
    titleLower.includes("forestry") ||
    titleLower.includes("kehutanan") ||
    titleLower.includes("hutan") ||
    titleLower.includes("kayu") ||
    titleLower.includes("timber") ||
    titleLower.includes("logging") ||
    titleLower.includes("rapp") ||
    titleLower.includes("pelalawan")
  ) {
    const centerNodeTitle = "PANCARAN HTI TIMBER CONTROL TOWER";
    const centerNodeSubtitle = "data tunggal per barcode tiket kayu";
    const kpiBanner = "KPI: Supply Fulfillment ≥ 99% • Road Obstruction 0 hr • SVLK 100% • Demurrage 0%";

    const inboundNodes: ControlTowerNode[] = [
      {
        id: "in-1",
        title: "Rencana Tebang Distrik",
        subtitle: "(petak panen, estimasi m³)"
      },
      {
        id: "in-2",
        title: "Sistem Barcode Kayu",
        subtitle: "(SIPUHH / SVLK KLHK)"
      },
      {
        id: "in-3",
        title: "Timbangan Jembatan HTI",
        subtitle: "(Gross-Tare terintegrasi)"
      },
      {
        id: "in-4",
        title: "Logyard & Ponton Jetty",
        subtitle: "(buffer stockpile mgmt)"
      }
    ];

    const outboundNodes: ControlTowerNode[] = [
      {
        id: "out-1",
        title: "GPS Satelit Dual-Sim",
        subtitle: "(anti-blankspot HTI)"
      },
      {
        id: "out-2",
        title: "Sensor Beban & Truk",
        subtitle: "(axle load, speed limiter)"
      },
      {
        id: "out-3",
        title: "Jadwal Rescue & Jalur",
        subtitle: "(kondisi jalan tanah basah)"
      },
      {
        id: "out-4",
        title: "Portal Pabrik Pulp",
        subtitle: "(real-time Woodyard SLA)"
      }
    ];

    const diagramCaption = "Gambar 14.1 — Arsitektur digital control tower logistik kehutanan HTI (desain penulis).";
    const narrativeParagraph =
      "Digital Control Tower HTI menjamin visibilitas penuh pergerakan kayu dari petak tebang hingga ke woodyard pabrik pulp. Modul minimum mencakup: (1) sinkronisasi rencana pemanenan distrik; (2) validasi barcode dokumen kayu SIPUHH/SVLK; (3) timbangan otomatis Gross/Tare; (4) telematika satelit hibrida anti-blankspot; (5) manajemen tim rescue jalan tanah; serta (6) integrasi portal kedatangan bahan baku pabrik pulp.";

    const budgetTable: DigitalBudgetStage[] = [
      {
        stage: "v1 (12 bulan)",
        scope: "Tracking satelit armada HTI, barcode kayu, timbangan RFID, portal dispatch",
        indicativeCost: "US$0,4 jt"
      },
      {
        stage: "v2 (24 bulan)",
        scope: "Integrasi sistem SIPUHH KLHK & ERP pabrik pulp, modul prediksi cuaca jalan",
        indicativeCost: "US$0,25 jt"
      },
      {
        stage: "Run",
        scope: "Bandwidth satelit, server cloud, 2 operator pemantau",
        indicativeCost: "US$0,2 jt/th"
      }
    ];

    return buildDigitalResult(
      title,
      divName,
      "Logistik Pengangkutan Hasil Hutan Tanaman Industri (HTI)",
      centerNodeTitle,
      centerNodeSubtitle,
      kpiBanner,
      inboundNodes,
      outboundNodes,
      diagramCaption,
      narrativeParagraph,
      budgetTable
    );
  }

  // 3. SEMEN CURAH / HI-BLOW & MATERIAL
  if (
    titleLower.includes("semen") ||
    titleLower.includes("cement") ||
    titleLower.includes("hi-blow") ||
    titleLower.includes("klinker") ||
    titleLower.includes("beton")
  ) {
    const centerNodeTitle = "PANCARAN BULK CEMENT CONTROL TOWER";
    const centerNodeSubtitle = "data tunggal per nomor surat jalan e-POD";
    const kpiBanner = "KPI: OTIF ≥ 98,5% • Loss Ratio < 0,1% • Discharge Time < 45 min • Zero ODOL";

    const inboundNodes: ControlTowerNode[] = [
      {
        id: "in-1",
        title: "ERP Pabrik Semen Induk",
        subtitle: "(purchase order & alokasi)"
      },
      {
        id: "in-2",
        title: "Timbangan Digital Pabrik",
        subtitle: "(Gross-Tare RFID otomatis)"
      },
      {
        id: "in-3",
        title: "E-Seal Segel Tangki",
        subtitle: "(QR code anti-pencurian)"
      },
      {
        id: "in-4",
        title: "Silo Stock Level Sensor",
        subtitle: "(monitoring tangki transit)"
      }
    ];

    const outboundNodes: ControlTowerNode[] = [
      {
        id: "out-1",
        title: "GPS Koridor & Geofencing",
        subtitle: "(jalur bebas razia ODOL)"
      },
      {
        id: "out-2",
        title: "Sensor Tekanan Blower",
        subtitle: "(tekanan bejana 2.0 bar)"
      },
      {
        id: "out-3",
        title: "Jadwal Slot Batching Plant",
        subtitle: "(antrean pompa bongkar)"
      },
      {
        id: "out-4",
        title: "Dashboard Klien & e-POD",
        subtitle: "(tanda tangan digital instan)"
      }
    ];

    const diagramCaption = "Gambar 14.1 — Arsitektur digital control tower semen curah Hi-Blow (desain penulis).";
    const narrativeParagraph =
      "Penerapan Control Tower Semen Curah menjamin kepatuhan tonase dan efisiensi pembongkaran pneumatik: seluruh ritase dipantau tekanannya dan divalidasi keaslian segelnya. Modul minimum: (1) integrasi PO dari ERP pabrik semen; (2) verifikasi timbangan gandar otomatis; (3) pemantauan sensor tekanan kompresor bejana 2.0 bar; (4) sistem e-Seal QR code; serta (5) integrasi e-POD langsung ke batching plant proyek.";

    const budgetTable: DigitalBudgetStage[] = [
      {
        stage: "v1 (12 bulan)",
        scope: "Telematika GPS tangki, modul e-POD, sensor tekanan bejana, portal batching plant",
        indicativeCost: "US$0,35 jt"
      },
      {
        stage: "v2 (24 bulan)",
        scope: "Integrasi API SAP pabrik semen, otomatisasi e-Seal digital, analitik rute",
        indicativeCost: "US$0,2 jt"
      },
      {
        stage: "Run",
        scope: "Lisensi aplikasi, cloud AWS/GCP, pemeliharaan sensor",
        indicativeCost: "US$0,15 jt/th"
      }
    ];

    return buildDigitalResult(
      title,
      divName,
      "Logistik Distribusi Semen Curah Hi-Blow",
      centerNodeTitle,
      centerNodeSubtitle,
      kpiBanner,
      inboundNodes,
      outboundNodes,
      diagramCaption,
      narrativeParagraph,
      budgetTable
    );
  }

  // 4. PERTAMBANGAN NIKEL / BATUBARA
  if (
    titleLower.includes("tambang") ||
    titleLower.includes("nikel") ||
    titleLower.includes("nickel") ||
    titleLower.includes("batubara") ||
    titleLower.includes("coal") ||
    titleLower.includes("mineral")
  ) {
    const centerNodeTitle = "PANCARAN MINING FLEET CONTROL TOWER";
    const centerNodeSubtitle = "data tunggal per ritase & tiket timbang";
    const kpiBanner = "KPI: Physical Availability ≥ 90% • OTIF ≥ 98% • Zero Accident • SIMBARA 100%";

    const inboundNodes: ControlTowerNode[] = [
      {
        id: "in-1",
        title: "Rencana Hauling Tambang",
        subtitle: "(target tonase harian pit)"
      },
      {
        id: "in-2",
        title: "SIMBARA / MOMS ESDM",
        subtitle: "(verifikasi kuota RKAB)"
      },
      {
        id: "in-3",
        title: "Timbangan Jetty / Hopper",
        subtitle: "(RFID auto gross/tare)"
      },
      {
        id: "in-4",
        title: "Stockpile & Draft Tongkang",
        subtitle: "(barge loading progress)"
      }
    ];

    const outboundNodes: ControlTowerNode[] = [
      {
        id: "out-1",
        title: "FMS & Dynamic Dispatch",
        subtitle: "(truck-shovel matching)"
      },
      {
        id: "out-2",
        title: "Kamera AI DSS / DSM",
        subtitle: "(anti-kantuk & fatigue)"
      },
      {
        id: "out-3",
        title: "Jadwal Pitstop Maintenance",
        subtitle: "(hour-meter alert)"
      },
      {
        id: "out-4",
        title: "Dashboard Smelter / Klien",
        subtitle: "(laporan tonase real-time)"
      }
    ];

    const diagramCaption = "Gambar 14.1 — Arsitektur digital control tower pertambangan (desain penulis).";
    const narrativeParagraph =
      "Mining Fleet Control Tower menghubungkan alur pengangkutan dari pit penambangan hingga ke hopper smelter atau dermaga jetty. Modul minimum mencakup: (1) integrasi FMS truck-shovel matching; (2) sinkronisasi data kuota resmi SIMBARA ESDM; (3) pemantauan kelelahan supir berbasis kamera AI DSS; (4) timbangan otomatis RFID jetty; serta (5) dashboard tonase real-time untuk manajemen smelter.";

    const budgetTable: DigitalBudgetStage[] = [
      {
        stage: "v1 (12 bulan)",
        scope: "FMS GPS presisi tinggi, kamera AI DSS fatigue, timbangan RFID jetty",
        indicativeCost: "US$0,45 jt"
      },
      {
        stage: "v2 (24 bulan)",
        scope: "Integrasi API SIMBARA ESDM & ERP Smelter, telemetri on-board weighing",
        indicativeCost: "US$0,25 jt"
      },
      {
        stage: "Run",
        scope: "Pemeliharaan radio/seluler tambang, cloud, tim analis 24/7",
        indicativeCost: "US$0,25 jt/th"
      }
    ];

    return buildDigitalResult(
      title,
      divName,
      "Logistik Hauling Pertambangan & Mineral",
      centerNodeTitle,
      centerNodeSubtitle,
      kpiBanner,
      inboundNodes,
      outboundNodes,
      diagramCaption,
      narrativeParagraph,
      budgetTable
    );
  }

  // 5. DEFAULT LOGISTICS PROJECT
  const commodity = params.commodity || title;
  const sector = params.sector || "Logistik Distribusi Terpadu";

  const centerNodeTitle = "PANCARAN LOGISTICS CONTROL TOWER";
  const centerNodeSubtitle = "data tunggal per konsinyasi & nomor seri";
  const kpiBanner = "KPI: OTIF ≥ 98,5% • Damage Rate < 0,2% • Lead-Time Index • Fleet SLA";

  const inboundNodes: ControlTowerNode[] = [
    {
      id: "in-1",
      title: "ERP Prinsipal / ASN",
      subtitle: "(manifest kargo & DO)"
    },
    {
      id: "in-2",
      title: "Pelacakan Moda Transport",
      subtitle: "(kapal/truk ETA dinamis)"
    },
    {
      id: "in-3",
      title: "Dokumen & Perizinan",
      subtitle: "(surat jalan & regulasi)"
    },
    {
      id: "in-4",
      title: "Hub & Warehouse Mgmt",
      subtitle: "(penitipan & barcode yard)"
    }
  ];

  const outboundNodes: ControlTowerNode[] = [
    {
      id: "out-1",
      title: "Telematika GPS & Geofence",
      subtitle: "(status pergerakan rute)"
    },
    {
      id: "out-2",
      title: "IoT Sensor Status Muatan",
      subtitle: "(suhu/guncangan/kondisi)"
    },
    {
      id: "out-3",
      title: "Penjadwalan Bongkar Muat",
      subtitle: "(koordinasi titik tujuan)"
    },
    {
      id: "out-4",
      title: "Portal Klien & e-POD",
      subtitle: "(laporan SLA & kepatuhan)"
    }
  ];

  const diagramCaption = "Gambar 14.1 — Arsitektur digital control tower terintegrasi (desain penulis).";
  const narrativeParagraph =
    `Control tower menjadi pembeda utama sebuah integrator logistik: seluruh pergerakan kargo ${commodity} dilacak secara transparan dari titik asal hingga serah terima di lokasi tujuan. Modul minimum mencakup: (1) integrasi pesanan dari ERP prinsipal; (2) pelacakan pergerakan moda dengan ETA dinamis; (3) manajemen pergudangan/yard berbasis kode digital; (4) telematika konvoi dan geofencing; (5) sensor IoT pemantau integritas muatan; serta (6) portal pelanggan dengan indikator KPI OTIF real-time.`;

  const budgetTable: DigitalBudgetStage[] = [
    {
      stage: "v1 (12 bulan)",
      scope: "Pelacakan rute GPS, modul e-POD, dashboard integrasi klien",
      indicativeCost: "US$0,4 jt"
    },
    {
      stage: "v2 (24 bulan)",
      scope: "Sensor IoT kondisi kargo, analitik prediktif & integrasi API ERP",
      indicativeCost: "US$0,25 jt"
    },
    {
      stage: "Run",
      scope: "Biaya lisensi cloud, infrastruktur keamanan, tim analis",
      indicativeCost: "US$0,2 jt/th"
    }
  ];

  return buildDigitalResult(
    title,
    divName,
    sector,
    centerNodeTitle,
    centerNodeSubtitle,
    kpiBanner,
    inboundNodes,
    outboundNodes,
    diagramCaption,
    narrativeParagraph,
    budgetTable
  );
}

function buildDigitalResult(
  title: string,
  division: string,
  sectorName: string,
  centerNodeTitle: string,
  centerNodeSubtitle: string,
  kpiBanner: string,
  inboundNodes: ControlTowerNode[],
  outboundNodes: ControlTowerNode[],
  diagramCaption: string,
  narrativeParagraph: string,
  budgetTable: DigitalBudgetStage[]
): DigitalCoverageResult {
  const toolsSummary = `${inboundNodes.map((n) => n.title).join(", ")}, ${outboundNodes.map((n) => n.title).join(", ")}`;
  const methodSummary = narrativeParagraph;
  const impactSummary = kpiBanner;
  const automationSummary = budgetTable.map((b) => `${b.stage}: ${b.scope}`).join("; ");

  const narrativeMarkdown = `# 14 DIGITAL COVERAGE & CONTROL TOWER
**Proyek:** ${title.toUpperCase()}
**Divisi:** ${division} • **Sektor:** ${sectorName}

---

## 1. ARSITEKTUR DIGITAL CONTROL TOWER
**${centerNodeTitle}** (${centerNodeSubtitle})
*${kpiBanner}*

### Inbound Data Pipeline:
${inboundNodes.map((n) => `- **${n.title}** ${n.subtitle}`).join("\n")}

### Outbound & Execution Ecosystem:
${outboundNodes.map((n) => `- **${n.title}** ${n.subtitle}`).join("\n")}

---

## 2. DESKRIPSI FUNGSIONAL & NILAI STRATEGIS
${narrativeParagraph}

---

## 3. ESTIMASI BIAYA & TAHAPAN IMPLEMENTASI (ROADMAP)
| Tahap | Lingkup | Biaya Indikatif |
| :--- | :--- | :--- |
${budgetTable.map((b) => `| **${b.stage}** | ${b.scope} | ${b.indicativeCost} |`).join("\n")}`;

  return {
    title,
    division,
    sectorName,
    centerNodeTitle,
    centerNodeSubtitle,
    kpiBanner,
    inboundNodes,
    outboundNodes,
    diagramCaption,
    narrativeParagraph,
    budgetTable,
    toolsSummary,
    methodSummary,
    impactSummary,
    automationSummary,
    narrativeMarkdown
  };
}
