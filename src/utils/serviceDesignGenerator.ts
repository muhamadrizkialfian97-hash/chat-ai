/**
 * Service Design Generator (Pilar 15)
 * Dynamically synthesizes title-tailored end-to-end Service Design Blueprint,
 * 11-Stage Workflow Process, Cargo Anatomy, Execution Matrix, and Design Notes.
 */

import { loadSavedProjectParameters, ProjectParameters } from "../types/projectParameters.ts";

export interface WorkflowStageItem {
  id: number;
  stageGroup: "international" | "domestic" | "installation";
  groupName: string;
  stepNumber: string;
  title: string;
  keyActivities: string;
  operatorRole: string;
  kpi: string;
}

export interface CargoComponentSpec {
  name: string;
  transportMode: string;
  dimensionWeight: string;
}

export interface CargoAnatomy {
  title: string;
  diagramType: "wind_turbine" | "logging_truck" | "bulk_cement" | "mining_hauling" | "cpo_tanker" | "cold_chain" | "general_cargo";
  components: CargoComponentSpec[];
  operationalNotes: string;
  imageCaption: string;
}

export interface ServiceDesignResult {
  title: string;
  division: string;
  sectorName: string;
  targetCommodity: string;
  headerSubtitle: string;
  workflowTitle: string;
  endToEndWorkflow: WorkflowStageItem[];
  cargoAnatomy: CargoAnatomy;
  designNotes: string[];
  workflowCaption: string;
  clientJourney: {
    stage: string;
    touchpoints: string;
    description: string;
    kpi: string;
  }[];
  operationalBlueprint: {
    serviceCode: string;
    title: string;
    standard: string;
    detail: string;
  }[];
  failSafeProtocols: {
    incident: string;
    mitigation: string;
    slaResolution: string;
  }[];
  cxMetrics: {
    metric: string;
    target: string;
    explanation: string;
  }[];
  narrativeMarkdown: string;
}

export function generateServiceDesignForTitle(projectTitle: string, divisionName?: string): ServiceDesignResult {
  const pName = (projectTitle || "Kajian Kelayakan Strategis Logistik").trim();
  const lower = pName.toLowerCase();
  const divName = divisionName || "Logistik & Transportasi";
  const params: ProjectParameters = loadSavedProjectParameters(pName);

  // 1. WIND FARM & RENEWABLE ENERGY (PLTB / EBT)
  if (
    lower.includes("wind") ||
    lower.includes("pltb") ||
    lower.includes("angin") ||
    lower.includes("turbin") ||
    lower.includes("jeneponto") ||
    lower.includes("sidrap") ||
    lower.includes("blade")
  ) {
    const sector = "Logistik Proyek Energi Terbarukan & Heavy Haulage PLTB";
    const commodity = params.commodity || "Komponen Turbin Angin (WTG Blade 75-95m, Nacelle 85-130T, Tower Section, & Hub)";

    const endToEndWorkflow: WorkflowStageItem[] = [
      {
        id: 1,
        stageGroup: "international",
        groupName: "International & border",
        stepNumber: "01",
        title: "OEM / Factory Pickup",
        keyActivities: "Koordinasi packing list & ASN serial, inspeksi pra-muat, pengangkutan pabrik → pelabuhan asal",
        operatorRole: "Partner (forwarder origin) + supervisi",
        kpi: "Ready-for-pickup vs rencana"
      },
      {
        id: 2,
        stageGroup: "international",
        groupName: "International & border",
        stepNumber: "02",
        title: "Origin Port & Loading",
        keyActivities: "Stowage plan, lashing blade, stevedoring, dokumen ekspor",
        operatorRole: "Partner + engineer Pancaran on-site",
        kpi: "Loading rate, zero damage"
      },
      {
        id: 3,
        stageGroup: "international",
        groupName: "International & border",
        stepNumber: "03",
        title: "Ocean Freight (breakbulk)",
        keyActivities: "Charter breakbulk/heavy-lift (Tiongkok/Eropa → Indonesia), asuransi marine cargo",
        operatorRole: "Integrator (charter/broker)",
        kpi: "ETA adherence"
      },
      {
        id: 4,
        stageGroup: "international",
        groupName: "International & border",
        stepNumber: "04",
        title: "Indonesian Port Discharge",
        keyActivities: "Bongkar heavy-lift, port storage, kontrak Pelindo/BUP, verifikasi kondisi fisik",
        operatorRole: "Self + subkon",
        kpi: "Discharge rate, dwell time < 3 hari"
      },
      {
        id: 5,
        stageGroup: "international",
        groupName: "International & border",
        stepNumber: "05",
        title: "Customs Clearance",
        keyActivities: "PIB/PEB, fasilitas pembebasan bea masuk/Masterlist ESDM, PPJK, jalur prioritas",
        operatorRole: "Self (customs broker)",
        kpi: "Clearance lead-time < 48 jam"
      },
      {
        id: 6,
        stageGroup: "domestic",
        groupName: "Domestic heavy logistics",
        stepNumber: "06",
        title: "Marshalling Yard",
        keyActivities: "Yard dekat pelabuhan/site, inventori per serial, pre-assembly ringan komponen",
        operatorRole: "Self (yard sewa/kelola)",
        kpi: "Akurasi inventori 100%"
      },
      {
        id: 7,
        stageGroup: "domestic",
        groupName: "Domestic heavy logistics",
        stepNumber: "07",
        title: "Route & Bridge Engineering",
        keyActivities: "Route survey, swept-path analysis, analisis jembatan, modifikasi jalan, izin dispensasi",
        operatorRole: "Self + konsultan struktur",
        kpi: "Izin tepat waktu, zero route failure"
      },
      {
        id: 8,
        stageGroup: "domestic",
        groupName: "Domestic heavy logistics",
        stepNumber: "08",
        title: "Heavy Haul / Oversize",
        keyActivities: "Blade trailer extendable/blade lifter, tower adapter, modular trailer SPMT, konvoi berpengawal",
        operatorRole: "Self (armada milik)",
        kpi: "OTIF ≥ 98%, zero incident"
      },
      {
        id: 9,
        stageGroup: "domestic",
        groupName: "Domestic heavy logistics",
        stepNumber: "09",
        title: "Site Delivery & Laydown",
        keyActivities: "Laydown, just-in-sequence untuk erection, offloading dengan crane bantu di site",
        operatorRole: "Self",
        kpi: "Crane idle-hour = 0"
      },
      {
        id: 10,
        stageGroup: "installation",
        groupName: "Installation & lifecycle",
        stepNumber: "10",
        title: "Erection Support (TCI)",
        keyActivities: "Crane crawler 800–1.200 t + tailing crane, tim rigging bersertifikat, lift plan presisi",
        operatorRole: "Partner/lease → JV",
        kpi: "Turbin terpasang/minggu"
      },
      {
        id: 11,
        stageGroup: "installation",
        groupName: "Installation & lifecycle",
        stepNumber: "11",
        title: "O&M Logistics",
        keyActivities: "Penggantian blade/gearbox/generator, crane on-call, spare parts hub terpusat",
        operatorRole: "Self + partner crane",
        kpi: "Downtime pelanggan < 24 jam"
      }
    ];

    const cargoAnatomy: CargoAnatomy = {
      title: "Anatomi WTG kelas 6–7 MW & Karakter Kargo",
      diagramType: "wind_turbine",
      components: [
        {
          name: "Blade (×3)",
          transportMode: "Blade trailer extendable / blade lifter",
          dimensionWeight: "Panjang 75–95 m • 25–35 t/unit"
        },
        {
          name: "Nacelle",
          transportMode: "Modular trailer / SPMT; crane ≥ 800 t",
          dimensionWeight: "85–130 t • L 12–18 m"
        },
        {
          name: "Hub + drivetrain",
          transportMode: "Low-bed multi-axle",
          dimensionWeight: "40–70 t"
        },
        {
          name: "Tower (4–5 seksi)",
          transportMode: "Tower adaptor / clamp trailer",
          dimensionWeight: "Ø 4.5–5.5 m • 50–90 t/seksi"
        },
        {
          name: "Transformer & BoP",
          transportMode: "Lowbed & kontainer reguler",
          dimensionWeight: "Muatan berat & peti kemas"
        }
      ],
      operationalNotes: "• 10–12 muatan oversize per turbin • 100 MW = 16 WTG = 170–200 pergerakan heavy haul\n• Hub height: 80–140 m; rotor Ø 170–200 m, butuh crane crawler 800–1.200 t",
      imageCaption: "Gambar 8.2 — Karakter kargo WTG modern kelas 6–7 MW (Ilustrasi)."
    };

    const designNotes = [
      "Azas cabotage: angkutan laut domestik antar-pelabuhan Indonesia wajib memakai kapal berbendera Indonesia (UU Pelayaran No. 17/2008). Bila kargo impor ditransshipment di hub (mis. Surabaya/Makassar) lalu diteruskan ke pelabuhan site pesisir, leg ini menjadi keunggulan alami armada tongkang & LCT berlisensi.",
      "Port selection adalah keputusan biaya terbesar kedua setelah ocean freight: pelabuhan yang dekat site namun terbatas fasilitas crane/draught dapat menghemat jarak heavy haul darat, tetapi menambah risiko demurrage bongkar muat.",
      "Blade lifter (mengangkat blade miring hingga ±60°) memungkinkan melewati tikungan tajam, perkampungan sempit, & perbukitan tanpa pelebaran jalan sipil masif — terbukti lebih hemat biaya dan waktu proyek."
    ];

    return buildResult(pName, divName, sector, commodity, "Dari OEM/factory hingga site, erection support, dan O&M logistics", "End-to-End Wind Project Logistics — lingkup layanan PRAMA Logistic", endToEndWorkflow, cargoAnatomy, designNotes, "Gambar 8.1 — Rantai layanan Wind Project Logistics yang ditawarkan (desain penulis).");
  }

  // 2. FORESTRY / KEHUTANAN HTI & PULP PAPER
  if (
    lower.includes("forestry") ||
    lower.includes("kehutanan") ||
    lower.includes("hutan") ||
    lower.includes("kayu") ||
    lower.includes("timber") ||
    lower.includes("logging") ||
    lower.includes("rapp") ||
    lower.includes("pelalawan")
  ) {
    const sector = "Logistik Pengangkutan Hasil Hutan Tanaman Industri (HTI)";
    const commodity = params.commodity || "Kayu Bulat (Log Acacia & Eucalyptus) 42-45 Ton/Rit";

    const endToEndWorkflow: WorkflowStageItem[] = [
      {
        id: 1,
        stageGroup: "international",
        groupName: "Hulu & Konsesi HTI",
        stepNumber: "01",
        title: "Tebang & Landing Point",
        keyActivities: "Koordinasi peta petak tebang, penumpukan kayu di log landing, verifikasi barcode SKSHHK",
        operatorRole: "Mitra pemanenan + supervisi PRAMA",
        kpi: "Stok landing vs rencana rit"
      },
      {
        id: 2,
        stageGroup: "international",
        groupName: "Hulu & Konsesi HTI",
        stepNumber: "02",
        title: "Log Scaling & Grading",
        keyActivities: "Pengukuran diameter, volume m³, sortir kualitas kayu bulat, pemeriksaan kelayakan muat",
        operatorRole: "Surveyor scaler terakreditasi",
        kpi: "Akurasi kubikasi ≥ 99%"
      },
      {
        id: 3,
        stageGroup: "international",
        groupName: "Hulu & Konsesi HTI",
        stepNumber: "03",
        title: "Loading Crane / Excavator",
        keyActivities: "Pemuatan kayu ke bak logging truck dengan log grapple excavator, penataan stanchion",
        operatorRole: "Operator grapple terlatih",
        kpi: "Waktu muat < 35 menit"
      },
      {
        id: 4,
        stageGroup: "international",
        groupName: "Hulu & Konsesi HTI",
        stepNumber: "04",
        title: "Lashing & Safety Check",
        keyActivities: "Pemasangan rantai pengikat baja (lashing chain), uji kekencangan, checklist rem & ban",
        operatorRole: "Driver & helper tersertifikasi K3",
        kpi: "Zero lashing failure"
      },
      {
        id: 5,
        stageGroup: "international",
        groupName: "Hulu & Konsesi HTI",
        stepNumber: "05",
        title: "Dispatch Gate & E-Dokumen",
        keyActivities: "Verifikasi e-SKSHHK KLHK, penimbangan jembatan timbang hulu, aktivasi GPS satelit",
        operatorRole: "Self (PRAMA Dispatcher)",
        kpi: "Dispatch lead-time < 10 menit"
      },
      {
        id: 6,
        stageGroup: "domestic",
        groupName: "Koridor Hauling & Transfer",
        stepNumber: "06",
        title: "Main Hauling Corridor",
        keyActivities: "Perjalanan rute jalan tanah/gravel HTI (85 km), monitoring konvoi via GPS satelit blankspot",
        operatorRole: "Self (Armada Logging 6x4)",
        kpi: "Kecepatan rata-rata 35-40 km/jam"
      },
      {
        id: 7,
        stageGroup: "domestic",
        groupName: "Koridor Hauling & Transfer",
        stepNumber: "07",
        title: "Road Grader & Emergency Push",
        keyActivities: "Unit grader & bulldozer standby di titik tanjakan lumpur kritis saat hujan lebat",
        operatorRole: "Tim rescue jalan PRAMA",
        kpi: "Waktu evakuasi < 25 menit"
      },
      {
        id: 8,
        stageGroup: "domestic",
        groupName: "Koridor Hauling & Transfer",
        stepNumber: "08",
        title: "Log Pond / River Jetty",
        keyActivities: "Bongkar log di tepi sungai, transfer ke tongkang 300ft (bila menggunakan multimoda air)",
        operatorRole: "Self + operator ponton",
        kpi: "Turnaround time ponton < 4 jam"
      },
      {
        id: 9,
        stageGroup: "domestic",
        groupName: "Koridor Hauling & Transfer",
        stepNumber: "09",
        title: "Mill Gate In & Weighbridge",
        keyActivities: "Verifikasi tonase bruto-tarra jembatan timbang digital pabrik pulp, barcode scanning",
        operatorRole: "Joint security & QC mill",
        kpi: "Antrian timbang < 15 menit"
      },
      {
        id: 10,
        stageGroup: "installation",
        groupName: "Hilir Pabrik & Pemeliharaan",
        stepNumber: "10",
        title: "Woodyard Unloading & Feed",
        keyActivities: "Unloading dengan overhead crane/wood unloader, pengisian langsung ke chipper feeder",
        operatorRole: "Penerima pabrik (mill operator)",
        kpi: "Zero backlog antrian"
      },
      {
        id: 11,
        stageGroup: "installation",
        groupName: "Hilir Pabrik & Pemeliharaan",
        stepNumber: "11",
        title: "Workshop, Tire & PMS Hub",
        keyActivities: "Pemeriksaan harian di pool pusat, penggantian ban vulkanisir/ori, servis oli berkala",
        operatorRole: "Self (Mekanik internal)",
        kpi: "Ketersediaan armada (PA) ≥ 94%"
      }
    ];

    const cargoAnatomy: CargoAnatomy = {
      title: "Anatomi Truk Logging 6×4 & Karakter Kayu Bulat HTI",
      diagramType: "logging_truck",
      components: [
        {
          name: "Kayu Bulat Acacia / Eucalyptus",
          transportMode: "Logging Rigid 6×4 with Stanchion Steel Post",
          dimensionWeight: "Panjang 2.4–4.0 m • Berat Jenis 0.85–0.95 t/m³"
        },
        {
          name: "Prime Mover 6×4 Heavy Duty",
          transportMode: "380–420 HP Engine, Hub Reduction Axle",
          dimensionWeight: "GVW 48–55 Ton • Chassis Reinforced"
        },
        {
          name: "Stanchion & Tiang Penyangga",
          transportMode: "High-Tensile Steel Post (Baja Tahan Bentur)",
          dimensionWeight: "Tinggi 2.2 m • Kapasitas 45 Ton Muatan"
        },
        {
          name: "Sistem Pengikat Baja (Lashing Chain)",
          transportMode: "Grade 80 Transport Chain & Ratchet Binder",
          dimensionWeight: "3–4 Titik Lashing • Kapasitas Beban 10 Ton/rantai"
        },
        {
          name: "Telematika Satelit Hybrid",
          transportMode: "GPS Tracker with Dual GSM & Iridium Satellite",
          dimensionWeight: "Panic Button + Sensor Kecepatan & Muatan"
        }
      ],
      operationalNotes: "• Rute hauling HTI 85 km • Ritase harian: 2–3 rit/unit • Target konsumsi solar: 1:1.6 km/liter\n• Muatan nominal: 42–45 Ton per ritase • Kepatuhan standar keselamatan K3 KLHK 100%",
      imageCaption: "Gambar 8.2 — Karakter kargo kayu bulat HTI dan spesifikasi unit logging 6×4 (Ilustrasi)."
    };

    const designNotes = [
      "Kepatuhan regulasi SVLK & SKSHHK: Setiap truk wajib mengantongi dokumen angkutan hasil hutan elektronik resmi guna mencegah penahanan aparat dan memastikan legalitas pasokan pabrik pulp & paper.",
      "Manajemen jalan cuaca basah (Wet Weather Road Policy): Pemasangan stasiun cuaca dan komunikasi radio rig untuk menghentikan sementara hauling saat curah hujan > 30 mm guna mencegah kerusakan parah pada badan jalan koridor.",
      "Optimalisasi umur ban (Tire Management): Penggunaan ban tipe block lug all-traction dan kontrol tekanan angin harian (110–120 PSI) terbukti memangkas biaya Opex ban hingga 28% di medan berlumpur."
    ];

    return buildResult(pName, divName, sector, commodity, "Dari log landing konsesi HTI hingga woodyard pabrik pulp & paper", "End-to-End Forestry Hauling Logistics — lingkup layanan PRAMA Logistic", endToEndWorkflow, cargoAnatomy, designNotes, "Gambar 8.1 — Rantai layanan Forestry Management Logistics yang ditawarkan (desain penulis).");
  }

  // 3. SEMEN CURAH HI-BLOW & MATERIAL KONSTRUKSI
  if (
    lower.includes("semen") ||
    lower.includes("cement") ||
    lower.includes("hi-blow") ||
    lower.includes("klinker") ||
    lower.includes("beton") ||
    lower.includes("mortar")
  ) {
    const sector = "Logistik Distribusi Semen Curah Hi-Blow & Material Konstruksi";
    const commodity = params.commodity || "Semen Curah OPC / PCC Tipe I & V Tekanan Pneumatik (32-40 Ton/Unit)";

    const endToEndWorkflow: WorkflowStageItem[] = [
      {
        id: 1,
        stageGroup: "international",
        groupName: "Pabrik Semen & Terminal Silo",
        stepNumber: "01",
        title: "Silo Intake & Order Queue",
        keyActivities: "Penerimaan Delivery Order (DO) digital pabrik, verifikasi nomor antrian silo pengisian",
        operatorRole: "Self (PRAMA Dispatcher)",
        kpi: "Waktu antrian < 20 menit"
      },
      {
        id: 2,
        stageGroup: "international",
        groupName: "Pabrik Semen & Terminal Silo",
        stepNumber: "02",
        title: "Pneumatic Loading Spout",
        keyActivities: "Penyambungan corong silo ke manhole tangki V-Shape, pengisian semen curah gravitasi-udara",
        operatorRole: "Operator silo pabrik + driver",
        kpi: "Waktu pengisian < 30 menit"
      },
      {
        id: 3,
        stageGroup: "international",
        groupName: "Pabrik Semen & Terminal Silo",
        stepNumber: "03",
        title: "Weighbridge Out & Seal",
        keyActivities: "Penimbangan tonase netto muatan, pemasangan segel bernomor seri di seluruh katup discharge",
        operatorRole: "Pabrik semen QC & timbang",
        kpi: "Akurasi tonase ± 0.2%"
      },
      {
        id: 4,
        stageGroup: "international",
        groupName: "Pabrik Semen & Terminal Silo",
        stepNumber: "04",
        title: "Pre-Trip Inspection (PTI)",
        keyActivities: "Pemeriksaan kompresor blower, katup safety valve tangki, tekanan udara dan lampu",
        operatorRole: "Mekanik checklist PRAMA",
        kpi: "Lolos checklist 100%"
      },
      {
        id: 5,
        stageGroup: "international",
        groupName: "Pabrik Semen & Terminal Silo",
        stepNumber: "05",
        title: "E-Surat Jalan & Dispatch",
        keyActivities: "Penerbitan surat jalan elektronik terintegrasi SAP klien, rute GPS geofenced",
        operatorRole: "Self (Control Tower)",
        kpi: "Zero manual paper delay"
      },
      {
        id: 6,
        stageGroup: "domestic",
        groupName: "Koridor Distribusi & Intermodal",
        stepNumber: "06",
        title: "Jalur Tol & Arteri Antar-Kota",
        keyActivities: "Perjalanan rute distribusi Jawa-Bali/Sumatera dengan pemantauan kecepatan & rest stop 4 jam",
        operatorRole: "Self (Armada Hi-Blow)",
        kpi: "ETA akurasi ± 15 menit"
      },
      {
        id: 7,
        stageGroup: "domestic",
        groupName: "Koridor Distribusi & Intermodal",
        stepNumber: "07",
        title: "Intermodal Ferry Crossing",
        keyActivities: "Penyeberangan feri terpadu (mis. Ketapang-Gilimanuk / Merak-Bakauheni) via jalur prioritas",
        operatorRole: "Mitra penyeberangan + PRAMA",
        kpi: "Dwell time pelabuhan < 1 jam"
      },
      {
        id: 8,
        stageGroup: "domestic",
        groupName: "Koridor Distribusi & Intermodal",
        stepNumber: "08",
        title: "Transit Depot & Rest Area",
        keyActivities: "Pemeriksaan berkala baut roda dan suhu ban, pergantian shift driver rute jarak jauh",
        operatorRole: "Pool transit PRAMA",
        kpi: "Inspeksi transit < 15 menit"
      },
      {
        id: 9,
        stageGroup: "domestic",
        groupName: "Koridor Distribusi & Intermodal",
        stepNumber: "09",
        title: "Customer Gate Arrival",
        keyActivities: "Tiba di batching plant / precast yard pelanggan, verifikasi segel utuh dan e-DO",
        operatorRole: "Customer receiver & driver",
        kpi: "Ketepatan waktu tiba ≥ 98.5%"
      },
      {
        id: 10,
        stageGroup: "installation",
        groupName: "Bongkar Pneumatik & Retensi",
        stepNumber: "10",
        title: "Pneumatic Blower Discharge",
        keyActivities: "Pengaktifan kompresor blower unit, pemompaan semen curah ke silo penyimpanan pelanggan (2 bar)",
        operatorRole: "Driver terlatih pneumatik",
        kpi: "Laju bongkar 1.2 t/menit (< 45 mnt)"
      },
      {
        id: 11,
        stageGroup: "installation",
        groupName: "Bongkar Pneumatik & Retensi",
        stepNumber: "11",
        title: "Digital ePOD & Sisa Tangki Nol",
        keyActivities: "Tanda tangan penerimaan digital, verifikasi sisa semen tangki 0 kg (clean blow), update SAP",
        operatorRole: "Self (ePOD Mobile App)",
        kpi: "Loss/susut muatan = 0%"
      }
    ];

    const cargoAnatomy: CargoAnatomy = {
      title: "Anatomi Truk Tangki Semen Hi-Blow V-Shape & Karakter Semen Curah",
      diagramType: "bulk_cement",
      components: [
        {
          name: "Semen Curah OPC / PCC",
          transportMode: "Tangki Baja Bertekanan Pneumatik (Hi-Blow)",
          dimensionWeight: "Bulk Density 1.25–1.40 t/m³ • Suhu Loading 50–70°C"
        },
        {
          name: "Tangki V-Shape / W-Shape",
          transportMode: "High-Tensile Carbon Steel Q345R / Stainless",
          dimensionWeight: "Volume 28–34 m³ • Tekanan Kerja 2.0 Bar"
        },
        {
          name: "Kompresor Blower Pneumatik",
          transportMode: "Rotary Air Compressor Driven by PTO / Diesel Engine",
          dimensionWeight: "Debit Udara 10–12 m³/menit • Laju Bongkar 1.2 T/mnt"
        },
        {
          name: "Fluidizing Aeration Canvas Pad",
          transportMode: "Multi-Ply Air Permeable Fabric (Fluidisasi Semen)",
          dimensionWeight: "Mencegah Semen Membatu & Menjamin Unloading Tuntas"
        },
        {
          name: "Manifold & Butterfly Discharge Valve",
          transportMode: "Katup Pelepasan 4 Inci + Selang Fleksibel Tahan Abrasi",
          dimensionWeight: "Konektor Standar Camlock 4\" Male/Female"
        }
      ],
      operationalNotes: "• Kapasitas muatan: 32–40 Ton/unit • Tekanan uji tangki: 3.0 Bar • Jarak unloading vertikal: hingga 35 meter ke puncak silo\n• Garansi susut muatan 0% berkat sistem pneumatic fluidization tertutup rapat",
      imageCaption: "Gambar 8.2 — Karakter kargo semen curah dan spesifikasi truk tangki Hi-Blow (Ilustrasi)."
    };

    const designNotes = [
      "Pencegahan Pembekuan & Kontaminasi Kelembaban: Seluruh unit tangki dilengkapi katup pengering udara (air moisture trap) agar udara kompresor bebas kondensasi air yang dapat menggumpalkan semen.",
      "Segel Digital Anti-Pencurian (Tamper-Proof e-Seal): Pemasangan segel RFID berkode unik pada manhole dan katup bawah yang tercatat di sistem ePOD guna memastikan tidak ada semen curah yang disedot ilegal di perjalanan.",
      "Optimasi Ritase Double Driver: Rute antar-provinsi jarak jauh (> 350 km) menerapkan sistem supir bergantian untuk menjamin utilisasi unit mencapai 22–24 jam operasional harian tanpa melanggar jam istirahat pengemudi."
    ];

    return buildResult(pName, divName, sector, commodity, "Dari silo pabrik semen klinker hingga batching plant proyek infrastruktur", "End-to-End Bulk Cement Logistics — lingkup layanan PRAMA Logistic", endToEndWorkflow, cargoAnatomy, designNotes, "Gambar 8.1 — Rantai layanan Bulk Cement Transportation yang ditawarkan (desain penulis).");
  }

  // 4. PERTAMBANGAN NIKEL & BATUBARA (MINING HAULING)
  if (
    lower.includes("tambang") ||
    lower.includes("nikel") ||
    lower.includes("nickel") ||
    lower.includes("batubara") ||
    lower.includes("coal") ||
    lower.includes("mineral") ||
    lower.includes("hauling")
  ) {
    const sector = "Logistik Hauling Mineral Pertambangan & Heavy Off-Road";
    const commodity = params.commodity || (lower.includes("nikel") ? "Bijih Nikel (Nickel Ore Saprolite & Limonite) 40-50 Ton" : "Batubara Curah Kalori Tinggi (Bulk Coal)");

    const endToEndWorkflow: WorkflowStageItem[] = [
      {
        id: 1,
        stageGroup: "international",
        groupName: "Front Tambang & Pit ROM",
        stepNumber: "01",
        title: "Pit Face & Grade Sorting",
        keyActivities: "Penentuan titik penggalian pit tambang, pemetaan kadar Ni/kalori batubara, koordinasi fleet dispatch",
        operatorRole: "Mine planning & PRAMA dispatch",
        kpi: "Kesesuaian kadar ore 100%"
      },
      {
        id: 2,
        stageGroup: "international",
        groupName: "Front Tambang & Pit ROM",
        stepNumber: "02",
        title: "Excavator Heavy Loading",
        keyActivities: "Pemuatan ore dengan Excavator kelas 50-80T, penataan distribusi bobot bak dump truck",
        operatorRole: "Operator excavator tambang",
        kpi: "Waktu muat < 4.5 menit (4-5 pass)"
      },
      {
        id: 3,
        stageGroup: "international",
        groupName: "Front Tambang & Pit ROM",
        stepNumber: "03",
        title: "Pit Weighbridge & Moisture Test",
        keyActivities: "Penimbangan tonase basah (wet metric ton), sampling kadar air (moisture content) cepat",
        operatorRole: "QC tambang & timbang",
        kpi: "Payload compliance 98-105%"
      },
      {
        id: 4,
        stageGroup: "international",
        groupName: "Front Tambang & Pit ROM",
        stepNumber: "04",
        title: "Tarping & Dust Suppression",
        keyActivities: "Penutupan terpal mekanik bak truk (bila rute melewati area publik), penyiraman rute tambang",
        operatorRole: "Driver & water truck team",
        kpi: "Zero spillage muatan"
      },
      {
        id: 5,
        stageGroup: "international",
        groupName: "Front Tambang & Pit ROM",
        stepNumber: "05",
        title: "Fatigue Monitoring & Gate Out",
        keyActivities: "Pemeriksaan kamera sensor kantuk (Driver Fatigue AI), tes alkohol berkala, izin gerak",
        operatorRole: "Self (HSE Tambang PRAMA)",
        kpi: "Zero accident, fit-to-work 100%"
      },
      {
        id: 6,
        stageGroup: "domestic",
        groupName: "Jalur Hauling Khusus",
        stepNumber: "06",
        title: "Dedicated Haul Road Transit",
        keyActivities: "Perjalanan rute hauling khusus non-publik (35-60 km), pengawalan radio dua arah saluran tambang",
        operatorRole: "Self (Dump Truck 6x4/8x4)",
        kpi: "Cycle time sesuai target"
      },
      {
        id: 7,
        stageGroup: "domestic",
        groupName: "Jalur Hauling Khusus",
        stepNumber: "07",
        title: "Gradient & Bridge Safety Check",
        keyActivities: "Pemberlakuan gigi rendah di turunan curam, batas kecepatan maksimal 40 km/jam, jaga jarak 50m",
        operatorRole: "Driver terstandar K3 ESDM",
        kpi: "Kepatuhan batas kecepatan 100%"
      },
      {
        id: 8,
        stageGroup: "domestic",
        groupName: "Jalur Hauling Khusus",
        stepNumber: "08",
        title: "Intermediate Checkpoint",
        keyActivities: "Pemeriksaan baut roda, kebocoran hidrolik tipper, dan tekanan rem di pos tengah rute",
        operatorRole: "Pit-stop mechanic PRAMA",
        kpi: "Pemeriksaan < 3 menit"
      },
      {
        id: 9,
        stageGroup: "domestic",
        groupName: "Jalur Hauling Khusus",
        stepNumber: "09",
        title: "Jetty / Smelter Gate In",
        keyActivities: "Tiba di area pelabuhan jetty/stockpile smelter, scan barcode ritase, antrian hopper",
        operatorRole: "Port controller & driver",
        kpi: "Waktu tunggu dumping < 10 mnt"
      },
      {
        id: 10,
        stageGroup: "installation",
        groupName: "Dumping & Stockpile Jetty",
        stepNumber: "10",
        title: "Hydraulic Tipper Dumping",
        keyActivities: "Pengangkatan bak hidrolik tipper, penuangan mineral ke grizzly feeder / stockpile jetty",
        operatorRole: "Driver & spotter jetty",
        kpi: "Waktu dumping < 2 menit"
      },
      {
        id: 11,
        stageGroup: "installation",
        groupName: "Dumping & Stockpile Jetty",
        stepNumber: "11",
        title: "Barge Loading & Heavy PMS",
        keyActivities: "Pemuatan tongkang 300ft via conveyor chute, pencucian kolong unit & servis terjadwal",
        operatorRole: "Self + jetty operator",
        kpi: "Kesiapan armada (PA) ≥ 92%"
      }
    ];

    const cargoAnatomy: CargoAnatomy = {
      title: "Anatomi Dump Truck Tipper Heavy-Duty & Karakter Mineral Hauling",
      diagramType: "mining_hauling",
      components: [
        {
          name: "Bijih Nikel (Nickel Ore) / Batubara",
          transportMode: "Heavy Duty Tipper Dump Truck (6×4 / 8×4)",
          dimensionWeight: "Bulk Density 1.3–1.6 t/m³ • Moisture Content 30–35%"
        },
        {
          name: "Bak Dump Tipper Reinforced",
          transportMode: "Baja Tahan Abrasi HARDOX 450 / High-Tensile Steel",
          dimensionWeight: "Volume 24–32 m³ • Kapasitas Beban 40–50 Ton"
        },
        {
          name: "Silinder Hidrolik Teleskopik",
          transportMode: "Heavy Duty Front-End Hydraulic Hoist (Hyva/Penta)",
          dimensionWeight: "Tekanan Hidrolik 190–250 Bar • Sudut Angkat 52°"
        },
        {
          name: "Sistem Keselamatan Tambang (K3 ESDM)",
          transportMode: "ROPS/FOPS Cabin, Buggy Whip Flag, Rotary Lamp",
          dimensionWeight: "Fatigue AI Camera, Radio Komunikasi VHF 2-Way"
        },
        {
          name: "Ban Off-Road E-4 Mining Pattern",
          transportMode: "Ukuran 12.00R24 / 325/95R24 Radial Mining Tires",
          dimensionWeight: "Tread Depth Ekstra Tebal Tahan Robekan Batuan Tajam"
        }
      ],
      operationalNotes: "• Operasional 2 shift (22 jam/hari) • Target ritase: 6–8 rit/hari per unit • Rata-rata payload: 42–48 WMT\n• Kepatuhan zero accident dan implementasi SOP keselamatan pertambangan Kepmen ESDM No. 1827/2018",
      imageCaption: "Gambar 8.2 — Karakter kargo mineral tambang dan spesifikasi dump truck heavy hauling (Ilustrasi)."
    };

    const designNotes = [
      "Standar Keselamatan Golden Rules Tambang (HSE Mandate): Seluruh pengemudi wajib memiliki SIMPER aktif dan lulus tes bebas narkoba/alkohol, serta dilengkapi sensor kamera AI pemantau kantuk (Fatigue Monitoring System).",
      "Manajemen Drainase & Penyiraman Jalur Hauling: Pengoperasian water truck berkala untuk meredam debu pekat tanpa membuat jalan hauling menjadi licin (muddy slick) yang membahayakan armada berat.",
      "Pemeliharaan Ban & Batuan Tajam (Road Grading): Penempatan motor grader untuk membersihkan batuan lepas (spill rocks) di sepanjang rute hauling guna memperpanjang umur pakai ban hingga 35%."
    ];

    return buildResult(pName, divName, sector, commodity, "Dari pit tambang hulu hingga stockpile jetty tongkang dan pabrik smelter", "End-to-End Mining Hauling Logistics — lingkup layanan PRAMA Logistic", endToEndWorkflow, cargoAnatomy, designNotes, "Gambar 8.1 — Rantai layanan Heavy Mining Hauling yang ditawarkan (desain penulis).");
  }

  // 5. DEFAULT / GENERAL COMMERCIAL LOGISTICS FALLBACK
  const sector = params.sector || "Logistik Distribusi Komersial Terpadu";
  const commodity = params.commodity || cleanCore(pName);

  const endToEndWorkflow: WorkflowStageItem[] = [
    {
      id: 1,
      stageGroup: "international",
      groupName: "Hulu & Akuisisi Kargo",
      stepNumber: "01",
      title: "Order Intake & Demand Booking",
      keyActivities: "Penerimaan Purchase Order (PO), verifikasi spesifikasi kargo, alokasi kapasitas armada",
      operatorRole: "Self (PRAMA Dispatcher)",
      kpi: "Booking confirmation < 15 menit"
    },
    {
      id: 2,
      stageGroup: "international",
      groupName: "Hulu & Akuisisi Kargo",
      stepNumber: "02",
      title: "Pre-Loading Inspection",
      keyActivities: "Pemeriksaan kebersihan armada, kelengkapan surat izin, kalibrasi alat ukur",
      operatorRole: "QA/QC Surveyor",
      kpi: "Checklist kelaikan 100%"
    },
    {
      id: 3,
      stageGroup: "international",
      groupName: "Hulu & Akuisisi Kargo",
      stepNumber: "03",
      title: "Stowage & Cargo Loading",
      keyActivities: "Pemuatan muatan ke armada, penataan berat gandar, pengikatan kargo terstandar",
      operatorRole: "Tim loading & driver",
      kpi: "Loading cycle time < 45 menit"
    },
    {
      id: 4,
      stageGroup: "international",
      groupName: "Hulu & Akuisisi Kargo",
      stepNumber: "04",
      title: "Weighbridge & Security Seal",
      keyActivities: "Penimbangan tonase bruto-tarra, pemasangan segel bernomor seri unik, foto bukti muatan",
      operatorRole: "Security & weighbridge",
      kpi: "Akurasi timbang ± 0.1%"
    },
    {
      id: 5,
      stageGroup: "international",
      groupName: "Hulu & Akuisisi Kargo",
      stepNumber: "05",
      title: "Dispatch & Digital Manifest",
      keyActivities: "Penerbitan surat jalan digital e-POD, sinkronisasi status ke control tower terpusat",
      operatorRole: "Self (Dispatcher)",
      kpi: "Dispatch lead-time < 5 menit"
    },
    {
      id: 6,
      stageGroup: "domestic",
      groupName: "Koridor Distribusi Darat",
      stepNumber: "06",
      title: "Active GPS Transit Tracking",
      keyActivities: "Monitoring pergerakan armada secara real-time via PRAMA Telematics, alert deviasi rute",
      operatorRole: "Self (Control Tower 24/7)",
      kpi: "Visibilitas rute 100%"
    },
    {
      id: 7,
      stageGroup: "domestic",
      groupName: "Koridor Distribusi Darat",
      stepNumber: "07",
      title: "Safety Rest & Geofence Route",
      keyActivities: "Pengendalian jam istirahat pengemudi di rest area terdaftar, kepatuhan batas kecepatan",
      operatorRole: "Driver profesional",
      kpi: "Kepatuhan SOP K3 100%"
    },
    {
      id: 8,
      stageGroup: "domestic",
      groupName: "Koridor Distribusi Darat",
      stepNumber: "08",
      title: "Dynamic Rerouting & Rescue",
      keyActivities: "Pengalihan rute instan bila terjadi kemacetan ekstrem, aktivasi armada rescue terdekat",
      operatorRole: "PRAMA Road Assistance",
      kpi: "Respon insiden < 15 menit"
    },
    {
      id: 9,
      stageGroup: "domestic",
      groupName: "Koridor Distribusi Darat",
      stepNumber: "09",
      title: "Destination Arrival & Check",
      keyActivities: "Tiba di lokasi gudang/site penerima, verifikasi keutuhan segel dan surat jalan",
      operatorRole: "Customer receiver & driver",
      kpi: "On-Time Arrival ≥ 98.5%"
    },
    {
      id: 10,
      stageGroup: "installation",
      groupName: "Hilir & Serah Terima",
      stepNumber: "10",
      title: "Unloading & Cargo Inspection",
      keyActivities: "Pembongkaran muatan dengan peralatan bantu sesuai standar penanganan kargo",
      operatorRole: "Customer unloader team",
      kpi: "Zero damage / kehilangan"
    },
    {
      id: 11,
      stageGroup: "installation",
      groupName: "Hilir & Serah Terima",
      stepNumber: "11",
      title: "Digital ePOD & Billing",
      keyActivities: "Tanda tangan digital penerimaan barang, penerbitan invoice otomatis, survei kepuasan",
      operatorRole: "Self (PRAMA Mobile App)",
      kpi: "Penyelesaian ePOD real-time"
    }
  ];

  const cargoAnatomy: CargoAnatomy = {
    title: `Anatomi Kargo & Karakteristik Muatan: ${commodity}`,
    diagramType: "general_cargo",
    components: [
      {
        name: commodity,
        transportMode: params.fleetRequirement || "Armada Truk Terdedikasi Spesifikasi Khusus",
        dimensionWeight: params.targetCapacity || "Sesuai Target Volume & Berat Standar Kargo"
      },
      {
        name: "Prime Mover & Sasis Muatan",
        transportMode: "Chassis Baja High-Tensile Laik Uji Dishub",
        dimensionWeight: "Kapasitas Sumbu MST 10 Ton • Sertifikat Uji KIR"
      },
      {
        name: "Sistem Pengaman & Lashing",
        transportMode: "Strap Baja / Webbing Ratchet Tie-Down Tahan Getaran",
        dimensionWeight: "Standar Keamanan Penahan Muatan SNI & K3"
      },
      {
        name: "Sensor Telematika & IoT",
        transportMode: "GPS Tracker Real-Time Dual Channel GSM/Satellite",
        dimensionWeight: "Sensor Pintu, Kecepatan, & Bahan Bakar"
      }
    ],
    operationalNotes: `• Koridor rute: ${params.routeCorridor || "Rute Distribusi Nasional"} • Jumlah armada: ${params.fleetCount || 10} unit\n• Garansi ketepatan waktu pengiriman (OTIF) ≥ 98.5% dan keamanan muatan terjamin asuransi komprehensif`,
    imageCaption: `Gambar 8.2 — Karakter kargo ${commodity} dan spesifikasi armada operasional (Ilustrasi).`
  };

  const designNotes = [
    "Kepatuhan Regulasi Batas Muatan (Zero ODOL): Seluruh armada dioperasikan sesuai dengan batas Muatan Sumbu Terberat (MST) resmi Kemenhub guna memastikan keselamatan jalan raya dan kelancaran perizinan.",
    "Pemantauan Sentral Control Tower 24/7: Pengawasan rute aktif tanpa henti guna mendeteksi deviasi jalur, waktu berhenti tidak wajar, atau potensi keterlambatan pengiriman.",
    "Protokol Cadangan & Emergency Replacement: Kesiapan armada pengganti di simpul-simpul strategis untuk menjamin kontinuitas rantai pasok klien korporasi tanpa hambatan."
  ];

  return buildResult(pName, divName, sector, commodity, "Dari titik hulu/pabrik hingga lokasi penerima, bongkar muat, dan O&M logistics", `End-to-End ${commodity} Logistics — lingkup layanan PRAMA Logistic`, endToEndWorkflow, cargoAnatomy, designNotes, `Gambar 8.1 — Rantai layanan ${commodity} yang ditawarkan (desain penulis).`);
}

function cleanCore(title: string): string {
  return title
    .replace(/^(kajian strategis|kajian kelayakan|analisis kelayakan|proyek|project|kajian|analisis|evaluasi|rencana bisnis|proposal)[\s:]+/i, "")
    .trim() || title;
}

function buildResult(
  pName: string,
  divName: string,
  sector: string,
  commodity: string,
  headerSubtitle: string,
  workflowTitle: string,
  endToEndWorkflow: WorkflowStageItem[],
  cargoAnatomy: CargoAnatomy,
  designNotes: string[],
  workflowCaption: string
): ServiceDesignResult {
  const narrative = `# KAJIAN SERVICE DESIGN: ${pName.toUpperCase()}
**Divisi:** ${divName} • **Sektor:** ${sector}
**Komoditas Utama:** ${commodity}
**Lingkup Layanan:** ${headerSubtitle}

---

## 1. RANTAI LAYANAN END-TO-END (11 TAHAPAN OPERASIONAL)
${endToEndWorkflow
  .map(
    (w) =>
      `### [${w.stepNumber}] ${w.title.toUpperCase()} (${w.groupName})\n- **Aktivitas Kunci:** ${w.keyActivities}\n- **Peran Operator:** ${w.operatorRole}\n- **KPI Terukur:** ${w.kpi}`
  )
  .join("\n\n")}

---

## 2. ANATOMI KARGO & KARAKTERISTIK MUATAN
**${cargoAnatomy.title}**
${cargoAnatomy.components
  .map((c) => `- **${c.name}:** ${c.transportMode} (${c.dimensionWeight})`)
  .join("\n")}

**Catatan Operasional:**
${cargoAnatomy.operationalNotes}

---

## 3. CATATAN DESAIN PENTING & REGULASI
${designNotes.map((n, i) => `${i + 1}. ${n}`).join("\n\n")}

---

## 4. INDIKATOR KINERJA UTAMA (KPI)
- **Ketepatan Waktu Penerimaan (OTIF):** Target ≥ 98.5%
- **Loss / Susut Muatan:** 0% (Zero Damage)
- **Tingkat Kesiapan Armada (PA):** Target ≥ 94%`;

  return {
    title: pName,
    division: divName,
    sectorName: sector,
    targetCommodity: commodity,
    headerSubtitle,
    workflowTitle,
    endToEndWorkflow,
    cargoAnatomy,
    designNotes,
    workflowCaption,
    clientJourney: endToEndWorkflow.slice(0, 4).map((w) => ({
      stage: `Tahap ${w.stepNumber}: ${w.title}`,
      touchpoints: w.keyActivities,
      description: `Peran: ${w.operatorRole}`,
      kpi: w.kpi
    })),
    operationalBlueprint: endToEndWorkflow.slice(4, 8).map((w) => ({
      serviceCode: `SD-${w.stepNumber}`,
      title: w.title,
      standard: w.kpi,
      detail: w.keyActivities
    })),
    failSafeProtocols: [
      {
        incident: "Kendala Rute / Kerusakan Teknis di Perjalanan",
        mitigation: "Pengerahan unit rescue dan armada cadangan terdekat dalam tempo < 45 menit.",
        slaResolution: "Respon Cepat < 45 Menit"
      },
      {
        incident: "Keterlambatan Bongkar Muat di Titik Tujuan",
        mitigation: "Koordinasi dispatch fleksibel dan alokasi buffer time untuk mencegah penumpukan.",
        slaResolution: "Resolusi Koordinasi < 15 Menit"
      }
    ],
    cxMetrics: [
      {
        metric: "On-Time In-Full Delivery (OTIF)",
        target: "≥ 98.5%",
        explanation: "Pengiriman muatan tiba tepat waktu dan dalam kondisi prima."
      },
      {
        metric: "Tingkat Keamanan Muatan",
        target: "100%",
        explanation: "Nol kerusakan fisik atau susut muatan sepanjang koridor distribusi."
      }
    ],
    narrativeMarkdown: narrative
  };
}
