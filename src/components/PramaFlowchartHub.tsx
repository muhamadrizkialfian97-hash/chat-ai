import React, { useState, useEffect, useRef } from "react";
import kpiDashboardMockup from "../assets/images/kpi_dashboard_mockup_1784538137673.jpg";
import { 
  UserCheck, 
  Award, 
  Activity, 
  FileText, 
  ChevronRight, 
  Plus, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Settings, 
  Download, 
  Eye, 
  Edit3, 
  Check, 
  Info,
  RefreshCw,
  Users,
  TrendingUp,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  ClipboardList
} from "lucide-react";

export interface FlowNode {
  id: string;
  label: string;
  type: "start" | "process" | "decision" | "end";
  x: number;
  y: number;
  color?: string;
  details?: {
    description: string;
    input: string;
    output: string;
    pic: string;
    sopCode?: string;
  };
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  type?: "yes" | "no" | "default";
}

export interface FlowchartData {
  title: string;
  description: string;
  icon: React.ReactNode;
  nodes: FlowNode[];
  connections: FlowConnection[];
}

export interface PersonnelOrgDetail {
  id: string;
  name: string;
  role: string;
  qualification: {
    education: string;
    experience: string;
    license: string;
    certifications: string[];
    detailExplanation: string;
  };
  skill: {
    coreSkills: string[];
    managerialSkills: string[];
    softSkills: string[];
    detailExplanation: string;
  };
  iconBg: string;
}

export const personnelOrgData: PersonnelOrgDetail[] = [
  {
    id: "ceo",
    name: "Section Head (SH)",
    role: "SH - Section Head of Operations & Strategy",
    iconBg: "from-rose-500 to-rose-600 text-white",
    qualification: {
      education: "S2 Master of Business Administration (M.B.A.) / Logistics & Supply Chain, S1 Teknik Industri.",
      experience: "Lebih dari 15 tahun pengalaman kepemimpinan eksekutif di industri logistik, maritim, dan manajemen rantai pasok batubara & kehutanan.",
      license: "Sertifikasi Dewan Komisaris, Lisensi Kepemimpinan Korporasi Internasional.",
      certifications: ["Certified Supply Chain Professional (CSCP)", "Executive Leadership Certificate from INSEAD", "Strategic Business Management Standard"],
      detailExplanation: "Memiliki keahlian tingkat tinggi dalam merumuskan arah strategis korporat, melakukan otorisasi anggaran belanja modal (Capex/Opex), dan mengawasi tata kelola perusahaan yang baik demi keberlanjutan bisnis Swarnadwipa."
    },
    skill: {
      coreSkills: ["Perencanaan Strategis Korporat", "Merger & Akuisisi", "Valuasi Portofolio Logistik", "Keuangan Korporat"],
      managerialSkills: ["Kepemimpinan Eksekutif", "Manajemen Perubahan", "Tata Kelola Risiko", "Manajemen Pemangku Kepentingan"],
      softSkills: ["Komunikasi Visioner", "Negosiasi Tingkat Tinggi", "Resolusi Krisis", "Pengambilan Keputusan Etis"],
      detailExplanation: "Kombinasi keahlian perencanaan strategis jangka panjang dan analisis finansial korporat. Mampu menyelaraskan seluruh direksi dan manajer operasional di bawah satu visi efisiensi berstandar internasional."
    }
  },
  {
    id: "dir_ops",
    name: "Team Leader (TL)",
    role: "TL - Team Leader of Fleet Operations",
    iconBg: "from-indigo-500 to-indigo-600 text-white",
    qualification: {
      education: "S2 Logistics & Supply Chain Management, S1 Teknik Mesin.",
      experience: "Lebih dari 12 tahun mengelola operasional armada angkutan logistik berat (>500 unit dump truck dan trailer) di jalur pertambangan, kehutanan, dan rute nasional.",
      license: "Surat Izin Ahli Keselamatan Transportasi Darat, Lisensi Pengelolaan Angkutan Barang Khusus.",
      certifications: ["Master Fleet Manager (MFM)", "Defensive Driving Course (DDC) Train-the-Trainer Certification", "ISO 9001:2015 Lead Auditor"],
      detailExplanation: "Sangat berpengalaman dalam menyusun peta rute hauling, meminimalkan cycle time, mengoptimalkan rasio utilitas armada, serta memantau integrasi sistem telematika GPS dan efisiensi bahan bakar minyak secara harian."
    },
    skill: {
      coreSkills: ["Optimalisasi Utilitas Armada", "Perencanaan Rute & Geofencing", "Sistem Manajemen Bahan Bakar (FMS)", "Rekayasa Perawatan"],
      managerialSkills: ["Pengendalian Biaya Operasional", "Kepemimpinan Lintas Fungsi", "Pemantauan SLA", "Manajemen Kontrak Vendor"],
      softSkills: ["Berpikir Analitis", "Komunikasi Teknis", "Eksekusi di Bawah Tekanan", "Pemecahan Masalah Praktis"],
      detailExplanation: "Ahli dalam pemodelan matematis rute logistik dan analisis telemetri IoT armada untuk mendeteksi inefisiensi BBM atau deviasi rute secara real-time."
    }
  },
  {
    id: "dir_hse",
    name: "Team Leader (TL)",
    role: "TL - Team Leader of Safety & HR",
    iconBg: "from-emerald-500 to-emerald-600 text-white",
    qualification: {
      education: "S2 Magister Hukum Ketenagakerjaan, S1 Psikologi Industri & Organisasi.",
      experience: "Lebih dari 10 tahun memimpin manajemen sumber daya manusia dan standardisasi keselamatan kerja (K3/HSE) di sektor industri transportasi logistik alat berat.",
      license: "Ahli K3 Umum Sertifikasi Kemnaker RI, Lisensi Auditor Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3).",
      certifications: ["Certified Human Resource Professional (CHRP)", "ISO 45001:2018 Lead Auditor (Occupational Health & Safety)", "Behavioral Based Safety Trainer"],
      detailExplanation: "Berkomitmen penuh pada pencapaian Zero Accident korporat, perancangan sistem reward and punishment sopir, regulasi hukum ketenagakerjaan, serta program rekrutmen dan kesehatan (Fit-To-Work) harian seluruh personel lapangan."
    },
    skill: {
      coreSkills: ["Audit & Implementasi SMK3", "Keselamatan Berbasis Perilaku (BBS)", "Kepatuhan Hukum Kerja", "Arsitektur Remunerasi & Benefit"],
      managerialSkills: ["Penyelarasan Budaya Korporat", "Manajemen Talenta", "Strategi Pencegahan Risiko K3", "Kontrol Investigasi Insiden"],
      softSkills: ["Mendengar Empatis", "Resolusi Konflik", "Komunikasi Antarpribadi", "Pemahaman Psikologi Sopir"],
      detailExplanation: "Memahami psikologi pengemudi truk jarak jauh secara mendalam guna menyusun kurikulum pelatihan kesehatan mental, pemantauan kelelahan (fatigue), dan asuransi jaminan sosial yang adekuat."
    }
  },
  {
    id: "gm_ops",
    name: "Specialist (SP)",
    role: "SP - Specialist of Logistics Operations",
    iconBg: "from-violet-500 to-violet-600 text-white",
    qualification: {
      education: "S2/S1 Teknik Industri / Rekayasa Transportasi.",
      experience: "Pengalaman 8 tahun sebagai Manajer Operasional Senior di rute logistik menantang (hauling batubara dan logging kayu) dengan kompleksitas tinggi.",
      license: "Sertifikasi POP (Pengawas Operasional Pratama) Mineral & Batubara RI, Izin Operasi Logistik Regional.",
      certifications: ["Certified Supply Chain Professional (CSCP)", "Project Management Professional (PMP) - Prep", "Six Sigma Green Belt for Process Excellence"],
      detailExplanation: "Bertanggung jawab atas kelancaran arus harian rantai pasok Swarnadwipa, penanganan kendala taktis di depo logistik, koordinasi tim dispatch, serta audit berat muatan per gandar (axle load balancing)."
    },
    skill: {
      coreSkills: ["Kontrol Operasional Dispatch", "Pengoperasian Beban Gandar", "Integrasi Rantai Pasok", "Analisis Telematika GPS"],
      managerialSkills: ["Pemantauan SLA", "Penjadwalan Sumber Daya", "Manajemen Insiden", "Pengembangan Kapasitas Tim"],
      softSkills: ["Respon Krisis", "Komando Tegas", "Kolaborasi Aktif", "Presentasi Logis"],
      detailExplanation: "Menguasai integrasi digital rantai pasok harian dan optimalisasi beban armada dump truck untuk mencegah kelebihan muatan (overloading) yang merusak suspensi."
    }
  },
  {
    id: "mgr_hse",
    name: "Specialist (SP)",
    role: "SP - Specialist of HSE & Safety Audit",
    iconBg: "from-sky-500 to-sky-600 text-white",
    qualification: {
      education: "S1 Teknik Lingkungan / K3 (Keselamatan dan Kesehatan Kerja).",
      experience: "Pengalaman 6 tahun dalam merancang register risiko bahaya (Hazard Register), melakukan investigasi kecelakaan, dan memimpin audit keselamatan armada transportasi.",
      license: "Sertifikasi Ahli K3 Umum, Lisensi Auditor Internal Sistem Manajemen Keselamatan Transportasi (SMKT).",
      certifications: ["ISO 14001:2015 & ISO 45001:2018 Certified Auditor", "Root Cause Analysis (RCA) Practitioner", "Defensive Driving Advanced Auditor"],
      detailExplanation: "Berdedikasi untuk menyusun standar operational check kendaraan (P2H) harian, mengaudit kelaikan jalan truk, dan menyempurnakan kurikulum uji coba berkendara selamat (DDC)."
    },
    skill: {
      coreSkills: ["Audit & Inspeksi Keselamatan", "Analisis Akar Penyebab Insiden (RCA)", "Identifikasi Bahaya & Penilaian Risiko (HIRADC)", "Kepatuhan AMDAL Lingkungan"],
      managerialSkills: ["Orkestrasi Kampanye K3", "Pencatatan Kepatuhan K3", "Pengembangan Kurikulum DDC", "Ketua Tim Tanggap Darurat"],
      softSkills: ["Orientasi Detail", "Pelaporan Objektif", "Komunikasi Sadar Risiko", "Kejelasan Instruksional"],
      detailExplanation: "Kombinasi keahlian investigasi ilmiah penyebab insiden menggunakan metode TapRooT / Fishbone dan perumusan langkah preventif jangka panjang di jalan hauling."
    }
  },
  {
    id: "lead_fleet",
    name: "Staff",
    role: "Staff - Fleet Coordinator",
    iconBg: "from-amber-500 to-amber-600 text-white",
    qualification: {
      education: "D3 / S1 Teknik Otomotif / Teknik Mesin.",
      experience: "Lebih dari 5 tahun memimpin tim mekanik lapangan, bengkel pusat, koordinasi pemeliharaan (preventive & corrective maintenance) armada logging Scania/Volvo.",
      license: "Sertifikasi Teknisi Alat Berat Tingkat Senior, Izin Otoritas Kelayakan Bengkel Lapangan.",
      certifications: ["Heavy-Duty Fleet Specialist (Scania & Volvo Systems)", "Tyre Lifecycle Management Specialist", "P2H Lead Inspector Certification"],
      detailExplanation: "Memiliki pemahaman mendalam tentang siklus pakai ban, kalibrasi sistem rem udara (Air Brake System), penyetelan suspensi muatan berat kayu gelondongan, dan perbaikan darurat truk amblas."
    },
    skill: {
      coreSkills: ["Sistem Perawatan Preventif", "Diagnostik Mesin Tugas Berat", "Optimalisasi Tekanan & Keausan Ban", "Penyesuaian Distribusi Beban Gandar"],
      managerialSkills: ["Dispatch Lapangan Darurat", "Penjadwalan Beban Kerja Mekanik", "Kontrol Inventaris Suku Cadang", "Pemantauan Perbaikan SLA"],
      softSkills: ["Pemecahan Masalah Lapangan", "Ketahanan di Cuaca Panas", "Komando Lapangan Jelas", "Komunikasi Asertif"],
      detailExplanation: "Ahli dalam menganalisis data diagnostik ECU truk untuk mendeteksi kerusakan sensor mesin sebelum terjadi breakdown fatal di tengah jalur hutan."
    }
  },
  {
    id: "lead_disp",
    name: "Staff",
    role: "Staff - Control Room Dispatcher",
    iconBg: "from-cyan-500 to-cyan-600 text-white",
    qualification: {
      education: "D3 / S1 Sistem Informasi / Manajemen Transportasi Darat.",
      experience: "Pengalaman harian selama 4 tahun mengoperasikan ruang kendali terpadu logistik, memonitor sistem GPS pelacakan, dan sistem telemetri IoT 24 jam.",
      license: "Lisensi Operator Sistem Telekomunikasi Logistik, Sertifikasi Sistem Navigasi Satelit.",
      certifications: ["Fleet Management Software (FMS) Professional", "Fatigue Monitoring Technology Specialist", "Radio Communication Protocol Certification"],
      detailExplanation: "Bertanggung jawab atas deteksi dini pelanggaran kecepatan (speeding), pemantauan tanda-tanda kelelahan mata sopir (fatigue camera alerts), koordinasi radio HT darurat, dan manajemen antrean loading."
    },
    skill: {
      coreSkills: ["Administrasi Geofencing GPS", "Pemantauan Dashboard Ruang Kendali", "Pelacakan Analitik Kelelahan", "Penanganan Alarm SOP"],
      managerialSkills: ["Manajemen Serah Terima Shift", "Operasi Eskalasi Alert5", "Optimalisasi Antrean Lalu Lintas", "Pemeliharaan Logbook Digital"],
      softSkills: ["Kewaspadaan Konstan", "Tenang Dalam Tekanan", "Disiplin Protokol Radio", "Sintesis Informasi Cepat"],
      detailExplanation: "Mampu memproses puluhan notifikasi sensor IoT secara simultan dan melakukan koordinasi taktis darurat melalui radio untuk menyelamatkan konvoi truk."
    }
  },
  {
    id: "aud_hse",
    name: "Staff",
    role: "Staff - HSE Field Auditor",
    iconBg: "from-teal-500 to-teal-600 text-white",
    qualification: {
      education: "S1 Kesehatan Masyarakat (K3) / Profesi Ners Keperawatan.",
      experience: "Pengalaman 3 tahun di Unit Gawat Darurat rumah sakit atau klinik medis industrial site pertambangan/kehutanan terpencil.",
      license: "Surat Tanda Registrasi (STR) Perawat Aktif, Lisensi First Aider Kemnaker RI.",
      certifications: ["Basic Trauma Cardiac Life Support (BTCLS)", "Occupational Health & Hygiene Specialist", "Certified Drug & Alcohol Tester"],
      detailExplanation: "Melaksanakan penegakan protokol kesehatan harian (Fit-To-Work), seperti tes tiup kadar alkohol (Alcohol Breath Test), pemeriksaan tekanan darah pre-trip, tes bebas narkoba urin, dan penanganan luka darurat."
    },
    skill: {
      coreSkills: ["Pertolongan Pertama Darurat (P3K)", "Operasi Tes Kadar Alkohol (Breathalyzer)", "Inspeksi Tanda-Tanda Vital", "Sistem Rekam Medis Industri"],
      managerialSkills: ["Manajemen Inventaris Klinik Site", "Kampanye Kesehatan Kerja", "Simulasi Tanggap Darurat Medis", "Audit Higiene Industri"],
      softSkills: ["Kepedulian Empatis", "Penegakan Aturan Tegas", "Pencatatan Cermat", "Sikap Tenang Saat Krisis"],
      detailExplanation: "Ketegasan tinggi dalam memberikan status UNFIT (Tidak Layak Jalan) bagi pengemudi yang tidak lolos tes alkohol demi keselamatan jiwa seluruh kru di jalan."
    }
  },
  {
    id: "driver_ahmad",
    name: "Staff",
    role: "Staff - Senior Driver Captain",
    iconBg: "from-orange-500 to-orange-600 text-white",
    qualification: {
      education: "Pendidikan terakhir SMA / Sederajat.",
      experience: "Pengalaman kerja mengemudi truk trailer gandeng kelas berat selama lebih dari 8 tahun dengan catatan mengemudi 100% aman (Zero Incident).",
      license: "Surat Izin Mengemudi (SIM) BII Umum aktif asli.",
      certifications: ["Advanced Defensive Driving Course (DDC)", "Eco-Driving Techniques Certification", "SOP P2H Heavy Vehicle Masterclass"],
      detailExplanation: "Pengemudi teladan yang dipercaya membawa unit trailer multi-axle kargo utama Swarnadwipa untuk rute logistik strategis dengan efisiensi solar tertinggi dan nihil klaim kerusakan."
    },
    skill: {
      coreSkills: ["Navigasi Multi-Gandar Berat", "Pengereman Retarder & Exhaust Brake", "Pengemudian Hemat Energi (Eco-Driving)", "Inspeksi Kelayakan Kendaraan (P2H)"],
      managerialSkills: ["Mentorship Pendamping Sopir", "Pelaporan Trip Logbook", "Navigasi Pemimpin Konvoi", "Pengikatan & Keamanan Muatan"],
      softSkills: ["Kesabaran Dalam Lalu Lintas", "Tanggung Jawab Jalan Raya", "Koordinasi Mata Waspada", "Disiplin Hidup Sehat"],
      detailExplanation: "Sangat terampil dalam pengoperasian rem retarder pada turunan terjal muatan penuh guna mencegah rem blong akibat panas berlebih (brake fading)."
    }
  },
  {
    id: "driver_joko",
    name: "Staff",
    role: "Staff - Heavy Duty Logging Driver",
    iconBg: "from-amber-600 to-amber-700 text-white",
    qualification: {
      education: "Pendidikan terakhir SMA / Sederajat.",
      experience: "Pengalaman mengemudikan truk Logging pembawa kayu gelondongan selama 4 tahun di rute ekstrem tanah liat berlumpur (hutan konsesi Riau & Jambi).",
      license: "SIM BII Umum aktif asli.",
      certifications: ["DDC Forestry Roads & Extreme Off-Road Certification", "Heavy-Duty Logging Winch Operations", "First Aid for Field Accidents"],
      detailExplanation: "Sopir tangguh yang menguasai teknik navigasi jalan licin non-aspal kehutanan dan memiliki spesialisasi evakuasi mandiri saat truk terjebak lumpur dalam."
    },
    skill: {
      coreSkills: ["Pengemudian Lumpur Off-Road Ekstrem", "Kontrol Inter-Axle & Differential Lock", "Pengikatan Rantai Baja Log", "Operasi Winch & Evakuasi Truk"],
      managerialSkills: ["Keseimbangan Kargo Lapangan", "Koordinasi Pemuatan Kayu SOP", "Taktik Penurunan Tekanan Ban", "Protokol Radio Darurat"],
      softSkills: ["Fokus Mental Ekstrem", "Adaptabilitas Medan Tinggi", "Stamina & Kekuatan Fisik", "Solidaritas Bantuan Sopir"],
      detailExplanation: "Sangat ahli mengoperasikan differential lock dan sistem winch penarik baja di jalur logging miring saat cuaca hujan lebat."
    }
  },
  {
    id: "driver_budi",
    name: "Staff",
    role: "Staff - Coal Hauling Tipper Driver",
    iconBg: "from-slate-700 to-slate-800 text-white",
    qualification: {
      education: "Pendidikan terakhir SMA / Sederajat.",
      experience: "Pengalaman 5 tahun mengemudikan Dump Truck/Tipper Scania muatan batubara berkapasitas besar di area tambang terbuka (open pit) hingga pelabuhan bongkar (stockpile).",
      license: "SIM BII Umum / BI Umum aktif, KIMPER (Kartu Izin Mengemudi Tambang) aktif resmi.",
      certifications: ["DDC Mining Hauling Roads Specialist", "Dumping & Tilting Stability Certification", "Scania Heavy-Duty Fleet Operator Training"],
      detailExplanation: "Pengemudi khusus tambang batubara yang memahami prosedur keselamatan pemuatan di bawah excavator raksasa serta kestabilan penumpahan."
    },
    skill: {
      coreSkills: ["Penumpahan Dump Truck Aman", "Pengereman Turunan Tambang (Retarder)", "Protokol Komunikasi Radio Tambang (HT)", "Maniak & Penjajaran Stockpile"],
      managerialSkills: ["Koordinasi Area Pemuatan", "Kepatuhan Protokol Antrean", "Verifikasi Tonase", "Pelaporan Bahaya K3"],
      softSkills: ["Disiplin Keselamatan Ketat", "Kewaspadaan Tebir Dinding", "Respon Cepat Peringatan Miring", "Kerjasama Baik dengan Spotter"],
      detailExplanation: "Menguasai teknik manuver mundur di bibir jurang dumping pertambangan dengan panduan visual juru parkir (spotter) secara aman dan cepat."
    }
  }
];

interface PramaFlowchartHubProps {
  projectTitle: string;
}

export const PramaFlowchartHub: React.FC<PramaFlowchartHubProps> = ({ projectTitle }) => {
  const [activeFlowTab, setActiveFlowTab] = useState<"orgchart" | "qualification" | "skill" | "kpi" | "sop">("orgchart");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>("ceo");
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [themePreset, setThemePreset] = useState<"brand" | "teal" | "blue">("teal");
  const [viewMode, setViewMode] = useState<"canvas" | "bento">("canvas");
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [customKpiImage, setCustomKpiImage] = useState<string | null>(null);
  const [selectedConclusionId, setSelectedConclusionId] = useState<string>("org");

  useEffect(() => {
    if (activeFlowTab === "kpi") {
      setSelectedStepId("k1");
    } else if (activeFlowTab === "sop") {
      setSelectedStepId("p1");
    } else {
      setSelectedStepId(null);
    }
  }, [activeFlowTab]);

  // Local state for interactive editing
  const [flows, setFlows] = useState<Record<string, FlowchartData>>(() => {
    // Determine context based on project title
    const titleLower = projectTitle.toLowerCase();
    const isForest = titleLower.includes("forest") || titleLower.includes("kayu") || titleLower.includes("forestry");
    const isCoal = titleLower.includes("coal") || titleLower.includes("batubara") || titleLower.includes("tambang");
    const isCold = titleLower.includes("cold") || titleLower.includes("reefer") || titleLower.includes("suhu") || titleLower.includes("farmasi") || titleLower.includes("boga");
    const isPort = titleLower.includes("port") || titleLower.includes("kemas") || titleLower.includes("intermodal") || titleLower.includes("depo");
    const isWaste = titleLower.includes("waste") || titleLower.includes("limbah") || titleLower.includes("b3") || titleLower.includes("sampah");

    let contextName = "Logistik Umum";
    let pic1 = "HR & HSE Officer";
    let pic2 = "Training Center Supervisor";
    let pic3 = "Operations Manager & Fleet Lead";
    let pic4 = "Dispatcher & HSE Inspector";
    
    let qualNodes: FlowNode[] = [];
    let skillNodes: FlowNode[] = [];
    let kpiNodes: FlowNode[] = [];
    let sopNodes: FlowNode[] = [];

    const orgchartNodes: FlowNode[] = [
      {
        id: "ceo",
        label: "SH - Section Head\nOperations & Strategy",
        type: "start",
        x: 430,
        y: 20,
        details: {
          description: "Memimpin strategi korporat, pengambilan keputusan utama investasi, dan pengawasan audit kepatuhan Swarnadwipa.",
          input: "Laporan Konsolidasi Bulanan & KPI Direksi",
          output: "Arahan Strategis & Otorisasi Anggaran Finansial",
          pic: "Section Head (SH)",
          sopCode: "CEO-HQ-001"
        }
      },
      {
        id: "dir_ops",
        label: "TL - Team Leader\nFleet Operations Division",
        type: "end",
        x: 230,
        y: 140,
        details: {
          description: "Mengawasi seluruh operasional hauling batubara, kehutanan, cold chain, dan efisiensi cycle time di rute Swarnadwipa.",
          input: "SLA Lapangan & Laporan Utilisasi Armada Swarnadwipa",
          output: "Pemberian Target Operasional Mingguan",
          pic: "Team Leader (TL)",
          sopCode: "DIR-OPS-002"
        }
      },
      {
        id: "dir_hse",
        label: "TL - Team Leader\nSafety & HR Division",
        type: "end",
        x: 630,
        y: 140,
        details: {
          description: "Menjamin tercapainya Zero Accident, standarisasi kualifikasi supir (DDC), dan pembinaan kesejahteraan staf lapangan.",
          input: "Laporan Kepatuhan K3 & Data Kesehatan (MCU) Supir",
          output: "Sertifikasi Kelayakan Kerja & Lisensi Kerja Internal",
          pic: "Team Leader (TL)",
          sopCode: "DIR-HSE-003"
        }
      },
      {
        id: "gm_ops",
        label: "SP - Specialist\nLogistics & Planning",
        type: "process",
        x: 230,
        y: 260,
        details: {
          description: "Sinkronisasi taktis rute hauling, optimalisasi konsumsi solar harian, dan koordinasi depo logistik utama.",
          input: "Data Timbangan & Real-time GPS Tracking",
          output: "Otorisasi Trip Rantai Pasok Swarnadwipa",
          pic: "Specialist (SP)",
          sopCode: "GM-LOG-010"
        }
      },
      {
        id: "mgr_hse",
        label: "SP - Specialist\nHSE & Safety Audit",
        type: "process",
        x: 630,
        y: 260,
        details: {
          description: "Melaksanakan audit rutin pemeliharaan kelayakan truk (P2H) dan evaluasi materi uji Defensive Driving.",
          input: "Hasil Inspeksi Lapangan & Logbook Kecelakaan",
          output: "Laporan Skor Risiko K3 Bulanan",
          pic: "Specialist (SP)",
          sopCode: "MGR-HSE-020"
        }
      },
      {
        id: "lead_fleet",
        label: "Staff\nFleet Coordinator",
        type: "process",
        x: 130,
        y: 380,
        details: {
          description: "Koordinasi harian unit truck logging, alokasi muatan per gandar, dan penanganan emergency hauling.",
          input: "Instruksi GM & Permintaan Muatan Kargo",
          output: "Disposisi Penugasan Driver Captain",
          pic: "Staff (Fleet)",
          sopCode: "SUPV-FLT-031"
        }
      },
      {
        id: "lead_disp",
        label: "Staff\nControl Room Dispatcher",
        type: "process",
        x: 330,
        y: 380,
        details: {
          description: "Monitoring 24/7 geofencing rute kritis, peringatan kelelahan (fatigue), dan verifikasi absensi supir.",
          input: "Sinyal Telemetri IoT GPS & Radio HT",
          output: "Otorisasi Tapping RFID Jalan Hauling",
          pic: "Staff (Control Room)",
          sopCode: "SUPV-DIS-032"
        }
      },
      {
        id: "aud_hse",
        label: "Staff\nHSE Field Auditor",
        type: "process",
        x: 630,
        y: 380,
        details: {
          description: "Pemeriksaan buta warna harian, tes tiup alkohol pre-trip, dan penanganan darurat kecelakaan kerja.",
          input: "Kondisi Fisik Personel & Formulir Alkohol",
          output: "Sertifikasi Fit-To-Work Harian",
          pic: "Staff (Auditor)",
          sopCode: "AUD-MED-033"
        }
      },
      {
        id: "driver_ahmad",
        label: "Staff\nSenior Driver Captain",
        type: "decision",
        x: 30,
        y: 500,
        details: {
          description: "Mengemudikan armada double-trailer muatan logistik utama Swarnadwipa dengan rekor keselamatan tertinggi.",
          input: "Surat Perintah Jalan & Kartu RFID Aktif",
          output: "Pengiriman Sukses & Berita Acara Serah Terima",
          pic: "Staff (Senior Driver)",
          sopCode: "DRV-CPT-001"
        }
      },
      {
        id: "driver_joko",
        label: "Staff\nHeavy Duty Logging Driver",
        type: "decision",
        x: 180,
        y: 500,
        details: {
          description: "Mengemudikan unit Logging Truck Swarnadwipa membawa kayu gelondongan di rute tanah konsesi.",
          input: "Rute Hauling Kehutanan & Timbangan Awal",
          output: "Bongkar Kayu di Depo Pabrik Kertas",
          pic: "Staff (Logging Driver)",
          sopCode: "DRV-LOG-012"
        }
      },
      {
        id: "driver_budi",
        label: "Staff\nCoal Hauling Tipper Driver",
        type: "decision",
        x: 330,
        y: 500,
        details: {
          description: "Mengemudikan Dump Truck Scania muatan batubara dari pit tambang menuju stockpile pelabuhan.",
          input: "Kimper Tambang Aktif & Manifes Pit",
          output: "Dumping Batubara Lolos Uji Timbangan",
          pic: "Staff (Tipper Driver)",
          sopCode: "DRV-COAL-024"
        }
      }
    ];

    const orgchartConnections: FlowConnection[] = [
      { from: "ceo", to: "dir_ops" },
      { from: "ceo", to: "dir_hse" },
      { from: "dir_ops", to: "gm_ops" },
      { from: "dir_hse", to: "mgr_hse" },
      { from: "gm_ops", to: "lead_fleet" },
      { from: "gm_ops", to: "lead_disp" },
      { from: "mgr_hse", to: "aud_hse" },
      { from: "lead_fleet", to: "driver_ahmad" },
      { from: "lead_fleet", to: "driver_joko" },
      { from: "lead_fleet", to: "driver_budi" }
    ];

    if (isForest) {
      contextName = "Forestry Management Transport";
      pic1 = "HR Recruitment & HSE Forestry";
      pic2 = "Sertifikasi Trainer Forestry";
      pic3 = "HSE Inspector & Forestry Fleet Admin";
      pic4 = "Site Dispatcher Riau / Jambi";

      qualNodes = [
        {
          id: "q1",
          label: "Screening & Verifikasi Berkas Sopir Kayu",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Verifikasi SIM BII Umum aktif, catatan berkendara aman (Zero Accident record), dan KTP asli.",
            input: "SIM BII Umum, KTP, Surat Lamaran, CV",
            output: "Lembar checklist verifikasi berkas administrasi lolos tahap 1",
            pic: "HR Recruiter",
            sopCode: "SOP-HR-001"
          }
        },
        {
          id: "q2",
          label: "Medical Check Up (MCU) & Bebas Narkoba",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Pengecekan fisik menyeluruh, tes buta warna, kestabilan tekanan darah, dan skrining zat adiktif (narkoba) berkala.",
            input: "Surat rujukan lab, sampel kesehatan sopir",
            output: "Sertifikat Berstatus FIT TO WORK (Layak Kerja)",
            pic: "HSE Medic Team",
            sopCode: "SOP-HSE-005"
          }
        },
        {
          id: "q3",
          label: "Lolos Tes Defensive Driving (DDC) Jalur Logging?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Uji berkendara di simulator dan jalur tanah/logging ekstrim bermuatan penuh kayu gelondongan (log). Evaluasi manuver pengereman engine-brake.",
            input: "Unit Logging Truck Tipper, jalan simulasi hauling",
            output: "Lembar penilaian instruktur DDC khusus kehutanan",
            pic: "Senior DDC Instructor",
            sopCode: "SOP-OPS-012"
          }
        },
        {
          id: "q4",
          label: "Uji Lapangan Muatan Berat & Penyelarasan Gandar",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Uji coba mengemudi dengan muatan penuh di tanjakan berlumpur dan penanganan muatan bergoyang agar tidak terguling di kelokan tajam.",
            input: "Logging truck bermuatan gandar 12 Ton",
            output: "Kelulusan sertifikat uji manuver muatan ekstrim",
            pic: "Logging Fleet Supervisor",
            sopCode: "SOP-OPS-015"
          }
        },
        {
          id: "q5",
          label: "Pemberian ID & RFID Card Aktif (Izin Jalan Hauling)",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pemberian tanda pengenal sopir ber-barcode RFID untuk absensi logbook digital dan otorisasi timbangan.",
            input: "Data kelulusan kumulatif, kartu RFID kosong",
            output: "ID Card aktif dengan hak akses jalur Forestry Swarnadwipa",
            pic: "HSE Admin",
            sopCode: "SOP-SYS-002"
          }
        },
        {
          id: "q_fail",
          label: "Program Pelatihan Ulang (Retraining)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Sopir yang gagal uji DDC dikembalikan untuk mentoring praktis selama 2 minggu oleh co-driver senior.",
            input: "Catatan evaluasi kegagalan DDC",
            output: "Rekomendasi uji ulang tahap kedua",
            pic: "Co-Driver Mentor",
            sopCode: "SOP-HR-003"
          }
        }
      ];

      skillNodes = [
        {
          id: "s1",
          label: "Pelatihan Pengenalan Unit Heavy Logging Truck",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Pemberian materi spesifikasi sasis ganda, rasio transmisi crawler-gear, dan sistem rem angin (Air Brake) bantuan pengereman retarder.",
            input: "Buku manual unit truk trailer kehutanan",
            output: "Pemahaman dasar sistem mekanis kelistrikan truk",
            pic: "Technical Trainer",
            sopCode: "SOP-TECH-101"
          }
        },
        {
          id: "s2",
          label: "Sertifikasi Teknik Lashing Pengikat Kayu Gelondongan",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Pelatihan khusus cara mengencangkan rantai baja pengikat kayu (Lashing) sesuai beban aman kerja (Working Load Limit - WLL) agar kayu tidak bergeser.",
            input: "Rantai baja, load binder, muatan gelondongan kayu",
            output: "Lisensi khusus Operator Lashing Swarnadwipa",
            pic: "Safety Supervisor",
            sopCode: "SOP-HSE-022"
          }
        },
        {
          id: "s3",
          label: "Ujian Lisensi Evakuasi Darurat (Rescue Hauling)?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi kemampuan mandiri dalam melepas kargo saat darurat, memasang sling derek (wire rope), dan evakuasi mandiri saat truk amblas di lumpur.",
            input: "Sling baja, shackle, alat penarik winch",
            output: "Nilai ujian penyelamatan darurat jalan logging",
            pic: "HSE Coordinator",
            sopCode: "SOP-HSE-030"
          }
        },
        {
          id: "s4",
          label: "Otorisasi Lisensi Sopir Logging Kelas Utama",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian otorisasi formal mengemudikan trailer gandeng multi-axle di jalan hauling terjal non-aspal.",
            input: "Hasil kompilasi kelulusan teknis & DDC",
            output: "Sertifikat Lisensi Internal Sopir Logging Kelas Utama",
            pic: "Operations Manager",
            sopCode: "SOP-OPS-040"
          }
        },
        {
          id: "s5",
          label: "Pengisian Matriks LogBook Kompetensi Personel",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pencatatan ke dalam sistem database ERP Prama ERP-Talent sebagai referensi promosi driver senior.",
            input: "Database profil karyawan, sertifikat lisensi",
            output: "Data digital kompetensi driver terupdate di cloud",
            pic: "HR Admin",
            sopCode: "SOP-SYS-009"
          }
        },
        {
          id: "s_fail",
          label: "Kelas Pendampingan Praktis Lapangan",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Sopir didampingi oleh mekanik dan instruktur khusus untuk membiasakan penanganan sling besi dan hidrolik di depo utama.",
            input: "Modul penanganan kendala mekanis",
            output: "Rekomendasi ujian remedial minggu berikutnya",
            pic: "Senior Lead Mechanic",
            sopCode: "SOP-TECH-105"
          }
        }
      ];

      kpiNodes = [
        {
          id: "k1",
          label: "Inisiasi Pencatatan Trip Digital di Timbangan",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Sistem menimbang muatan kotor (gross weight) kayu gelondongan yang dibawa di timbangan gerbang masuk konsesi hutan.",
            input: "Truk logging terisi muatan, tapping RFID",
            output: "Manifes timbangan awal tercatat di sistem cloud ERP",
            pic: "Timbangan Gate Officer",
            sopCode: "SOP-OPS-050"
          }
        },
        {
          id: "k2",
          label: "Monitoring Cycle Time & Manajemen Kecepatan GPS",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Sensor telematika GPS mencatat kecepatan rata-rata (maksimal 40 km/jam) dan waktu jeda istirahat supir (fatigue management).",
            input: "Data telematika GPS Geofencing",
            output: "Laporan fluktuasi kecepatan harian dan deviasi rute",
            pic: "Control Room Operator",
            sopCode: "SOP-SYS-120"
          }
        },
        {
          id: "k3",
          label: "Apakah Indeks Zero Damage & SLA Waktu Lolos?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi apakah pengiriman mengalami kehilangan muatan kayu di jalan, kerusakan ban pecah, dan ketepatan waktu bongkar muat sesuai SLA (>98.5%).",
            input: "Laporan kedatangan unit di pabrik kertas/depo",
            output: "Kompilasi KPI bulanan sopir per unit plat nomor",
            pic: "Fleet Auditor",
            sopCode: "SOP-FIN-080"
          }
        },
        {
          id: "k4",
          label: "Perhitungan Insentif Bonus Keamanan & Bahan Bakar",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian bonus uang tambahan untuk pengemudi dengan rasio konsumsi solar efisien dan nihil pelanggaran rambu batas kecepatan.",
            input: "Skor audit hijau, laporan tangki solar akhir",
            output: "Slip bonus insentif bulanan sopir",
            pic: "Payroll Specialist",
            sopCode: "SOP-FIN-085"
          }
        },
        {
          id: "k5",
          label: "Evaluasi Kinerja & Reward Rencana Karir",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pembaruan profil prestasi sopir di papan apresiasi untuk promosi menjadi Driver Captain / Safety Mentor.",
            input: "Data akumulasi pencapaian KPI bulanan",
            output: "Promosi kenaikan status grade driver",
            pic: "HR Manager",
            sopCode: "SOP-HR-040"
          }
        },
        {
          id: "k_fail",
          label: "Konseling & Surat Peringatan Kinerja (SP-KPI)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Pembinaan intensif bagi pengemudi dengan SLA waktu pengiriman buruk atau konsumsi solar boros tanpa alasan kondisi alam terukur.",
            input: "Laporan deviasi waktu & audit tangki bocor",
            output: "Surat komitmen perbaikan kinerja pengemudi",
            pic: "Driver Operations Coach",
            sopCode: "SOP-HR-045"
          }
        }
      ];

      sopNodes = [
        {
          id: "p1",
          label: "Pre-Trip Inspection & Penandatanganan Fit Card",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Pemeriksaan kelayakan truk logging (Rem, Ban, Lampu, Oli, Rantai) serta tes tiup alkohol untuk memastikan kesiapan fisik driver.",
            input: "Checklist P2H (Pelaksanaan Pemeliharaan Harian)",
            output: "Lembar P2H yang disetujui, tanda tangan layak jalan",
            pic: "HSE Inspector",
            sopCode: "SOP-OPS-201"
          }
        },
        {
          id: "p2",
          label: "Proses Loading & Penguncian Rantai Pengaman Lashing",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Kayu diletakkan seimbang di atas sasis. Pengencangan rantai lashing ganda dan penutupan jaring muatan jika melewati kawasan perumahan.",
            input: "Crane pemuat kayu, rantai pengikat",
            output: "Surat Jalan Muat Kayu yang ditandatangani mandor",
            pic: "Loading Point Coordinator",
            sopCode: "SOP-OPS-205"
          }
        },
        {
          id: "p3",
          label: "Apakah Tekanan Angin Ban & Rem Berfungsi Sempurna?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Pengemudi wajib melakukan pengecekan visual tekanan ban dan fungsi air-brake di check point gerbang keluar area konsesi sebelum masuk ke jalan umum.",
            input: "Alat pengukur tekanan ban manual",
            output: "Status Ban & Rem Lolos Inspeksi Checkpoint",
            pic: "Driver Mandiri",
            sopCode: "SOP-OPS-210"
          }
        },
        {
          id: "p4",
          label: "Transit Konvoi Hauling dengan Jarak Aman Min. 50 Meter",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Perjalanan transit wajib beriringan (platooning) dengan jarak aman antar truk minimal 50 meter guna mengantisipasi debu tebal di jalan tanah kering.",
            input: "Sistem komunikasi radio dua arah (HT)",
            output: "Laporan status radio berkala di setiap pos pantau",
            pic: "Convoy Captain",
            sopCode: "SOP-OPS-220"
          }
        },
        {
          id: "p5",
          label: "Unloading di Pabrik Kertas / Dermaga & Serah Terima Dokumen",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Proses pembongkaran kayu menggunakan log grabber, penimbangan berat akhir (tare weight) truk kosong, dan serah terima dokumen manifes.",
            input: "Log Grabber Crane, timbangan keluar pabrik",
            output: "Surat Jalan Kembali (SJK) tervalidasi digital",
            pic: "Receiving Point Officer",
            sopCode: "SOP-OPS-230"
          }
        },
        {
          id: "p_fail",
          label: "Pemberhentian Darurat (Emergency Halt) & Perbaikan Ban",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Jika rem terasa panas atau tekanan ban kurang di pos checkpoint, unit segera diparkir di shelter darurat untuk penanganan mekanik lapangan.",
            input: "Shelter darurat / bengkel bergerak",
            output: "Laporan penanganan kerusakan di jalan (Breakdown Report)",
            pic: "Mobile Repair Mechanic",
            sopCode: "SOP-TECH-302"
          }
        }
      ];
    } else if (isCoal) {
      contextName = "Coal Logistics & Hauling System";
      pic1 = "HR & HSE Mining Specialist";
      pic2 = "Training Center Supervisor Pertambangan";
      pic3 = "K3 Pertambangan Inspector (POP)";
      pic4 = "Dispatcher Port & Timbangan Swarnadwipa";

      qualNodes = [
        {
          id: "q1",
          label: "Screening SIM BII Umum & Lisensi Minerba (KTP/SKCK)",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Verifikasi SIM BII Umum aktif, kepemilikan kartu Kimper Tambang, dan surat rekomendasi berkelakuan baik.",
            input: "SIM BII Umum, KTP, Surat Lamaran, CV, Kimper",
            output: "Checklist kelulusan verifikasi administrasi",
            pic: "HR Recruiter",
            sopCode: "SOP-MIN-001"
          }
        },
        {
          id: "q2",
          label: "MCU Khusus Debu Silika & Tes Tiup Alkohol (Alcohol Breath Test)",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Skrining kesehatan paru-paru (spirometri) dari paparan debu batubara, tes fungsi jantung, dan tes tiup alkohol.",
            input: "Surat rujukan lab, sampel kesehatan sopir",
            output: "Status FIT TO WORK Tambang",
            pic: "HSE Medic Team",
            sopCode: "SOP-HSE-MIN-05"
          }
        },
        {
          id: "q3",
          label: "Lolos Tes Defensive Driving Course (DDC) di Pit Tambang?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Uji berkendara di simulator dan pit tambang ekstrim dengan jalur hauling menanjak bersudut kemiringan tinggi bermuatan penuh batubara.",
            input: "Unit DT Scania/Volvo Heavy Duty, rute hauling tambang",
            output: "Lembar penilaian instruktur DDC khusus pertambangan",
            pic: "Senior DDC Instructor",
            sopCode: "SOP-MIN-OPS-12"
          }
        },
        {
          id: "q4",
          label: "Uji Lapangan Manuver Jembatan Timbang & Antrian Vessel",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Uji coba presisi posisi truk di timbangan gerbang tambang dan kemudi mundur aman di area penumpukan (stockpile).",
            input: "Dump Truck bermuatan batubara",
            output: "Kelulusan sertifikat uji manuver timbangan",
            pic: "Mining Fleet Supervisor",
            sopCode: "SOP-MIN-OPS-15"
          }
        },
        {
          id: "q5",
          label: "Pemberian ID & RFID Card Aktif (Izin Jalan Hauling)",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pemberian tanda pengenal sopir ber-barcode RFID untuk absensi logbook digital dan otorisasi timbangan.",
            input: "Data kelulusan kumulatif, kartu RFID kosong",
            output: "ID Card aktif dengan hak akses jalur Forestry Swarnadwipa",
            pic: "HSE Admin",
            sopCode: "SOP-SYS-002"
          }
        },
        {
          id: "q_fail",
          label: "Program Pelatihan Ulang (Retraining)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Sopir yang gagal uji DDC dikembalikan untuk mentoring praktis selama 2 minggu oleh co-driver senior.",
            input: "Catatan evaluasi kegagalan DDC",
            output: "Rekomendasi uji ulang tahap kedua",
            pic: "Co-Driver Mentor",
            sopCode: "SOP-HR-003"
          }
        }
      ];

      skillNodes = [
        {
          id: "s1",
          label: "Pelatihan Pengenalan Unit Heavy Tipper Dump Truck",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Materi sasis ganda Scania/Volvo Heavy Duty, transmisi tipper automatic crawler, rem retarder.",
            input: "Buku manual unit truk trailer pertambangan",
            output: "Pemahaman dasar sistem mekanis kelistrikan truk",
            pic: "Technical Trainer",
            sopCode: "SOP-TECH-MIN-101"
          }
        },
        {
          id: "s2",
          label: "Sertifikasi Teknik Operasional Dumping di Stockpile",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Pelatihan mengangkat bak tipper (dumping) dengan sudut aman di tanah labil stockpile agar hidrolik tidak patah atau truk terguling samping.",
            input: "Dump truck, area stockpile simulative",
            output: "Sertifikasi Operator Dumping",
            pic: "Safety Supervisor Tambang",
            sopCode: "SOP-MIN-HSE-022"
          }
        },
        {
          id: "s3",
          label: "Ujian Lisensi Evakuasi Darurat (Rescue Hauling)?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi kemampuan mandiri dalam melepas kargo saat darurat, memasang sling derek (wire rope), dan evakuasi mandiri saat truk amblas di lumpur.",
            input: "Sling baja, shackle, alat penarik winch",
            output: "Nilai ujian penyelamatan darurat jalan logging",
            pic: "HSE Coordinator",
            sopCode: "SOP-HSE-030"
          }
        },
        {
          id: "s4",
          label: "Otorisasi Lisensi Sopir Logging Kelas Utama",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian otorisasi formal mengemudikan trailer gandeng multi-axle di jalan hauling terjal non-aspal.",
            input: "Hasil kompilasi kelulusan teknis & DDC",
            output: "Sertifikat Lisensi Internal Sopir Logging Kelas Utama",
            pic: "Operations Manager",
            sopCode: "SOP-OPS-040"
          }
        },
        {
          id: "s5",
          label: "Pengisian Matriks LogBook Kompetensi Personel",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pencatatan ke dalam sistem database ERP Prama ERP-Talent sebagai referensi promosi driver senior.",
            input: "Database profil karyawan, sertifikat lisensi",
            output: "Data digital kompetensi driver terupdate di cloud",
            pic: "HR Admin",
            sopCode: "SOP-SYS-009"
          }
        },
        {
          id: "s_fail",
          label: "Kelas Pendampingan Praktis Lapangan",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Sopir didampingi oleh mekanik dan instruktur khusus untuk membiasakan penanganan sling besi dan hidrolik di depo utama.",
            input: "Modul penanganan kendala mekanis",
            output: "Rekomendasi ujian remedial minggu berikutnya",
            pic: "Senior Lead Mechanic",
            sopCode: "SOP-TECH-105"
          }
        }
      ];

      kpiNodes = [
        {
          id: "k1",
          label: "Inisiasi Pencatatan Trip Digital di Timbangan Pit",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Truk batubara menimbang muatan kotor (gross weight) dari pit tambang batubara.",
            input: "Dump truck batubara terisi muatan, tapping RFID",
            output: "Manifes timbangan awal tercatat di sistem cloud ERP",
            pic: "Timbangan Tambang Officer",
            sopCode: "SOP-MIN-OPS-050"
          }
        },
        {
          id: "k2",
          label: "Monitoring Cycle Time & Manajemen Kecepatan GPS",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Sensor telematika GPS mencatat kecepatan rata-rata (maksimal 40 km/jam) dan waktu jeda istirahat supir (fatigue management).",
            input: "Data telematika GPS Geofencing",
            output: "Laporan fluktuasi kecepatan harian dan deviasi rute",
            pic: "Control Room Operator",
            sopCode: "SOP-SYS-120"
          }
        },
        {
          id: "k3",
          label: "Apakah Indeks Zero Damage & SLA Waktu Lolos?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi ketepatan waktu pengiriman hauling batu bara (SLA >98.5%) dan nihil tumpahan di jalan tambang.",
            input: "Laporan kedatangan unit di pelabuhan muat batu bara",
            output: "Kompilasi KPI bulanan sopir per unit plat nomor",
            pic: "Mining Fleet Auditor",
            sopCode: "SOP-MIN-FIN-080"
          }
        },
        {
          id: "k4",
          label: "Perhitungan Insentif Bonus Keamanan & Bahan Bakar",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian bonus uang tambahan untuk pengemudi dengan rasio konsumsi solar efisien dan nihil pelanggaran rambu batas kecepatan.",
            input: "Skor audit hijau, laporan tangki solar akhir",
            output: "Slip bonus insentif bulanan sopir",
            pic: "Payroll Specialist",
            sopCode: "SOP-FIN-085"
          }
        },
        {
          id: "k5",
          label: "Evaluasi Kinerja & Reward Rencana Karir",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pembaruan profil prestasi sopir di papan apresiasi untuk promosi menjadi Driver Captain / Safety Mentor.",
            input: "Data akumulasi pencapaian KPI bulanan",
            output: "Promosi kenaikan status grade driver",
            pic: "HR Manager",
            sopCode: "SOP-HR-040"
          }
        },
        {
          id: "k_fail",
          label: "Konseling & Surat Peringatan Kinerja (SP-KPI)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Pembinaan intensif bagi pengemudi dengan SLA waktu pengiriman buruk atau konsumsi solar boros tanpa alasan kondisi alam terukur.",
            input: "Laporan deviasi waktu & audit tangki bocor",
            output: "Surat komitmen perbaikan kinerja pengemudi",
            pic: "Driver Operations Coach",
            sopCode: "SOP-HR-045"
          }
        }
      ];

      sopNodes = [
        {
          id: "p1",
          label: "Pre-Trip Inspection & Penandatanganan Fit Card",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Pemeriksaan kelayakan truk logging (Rem, Ban, Lampu, Oli, Rantai) serta tes tiup alkohol untuk memastikan kesiapan fisik driver.",
            input: "Checklist P2H (Pelaksanaan Pemeliharaan Harian)",
            output: "Lembar P2H yang disetujui, tanda tangan layak jalan",
            pic: "HSE Inspector",
            sopCode: "SOP-OPS-201"
          }
        },
        {
          id: "p2",
          label: "Proses Loading & Penguncian Rantai Pengaman Lashing",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Kayu diletakkan seimbang di atas sasis. Pengencangan rantai lashing ganda dan penutupan jaring muatan jika melewati kawasan perumahan.",
            input: "Crane pemuat kayu, rantai pengikat",
            output: "Surat Jalan Muat Kayu yang ditandatangani mandor",
            pic: "Loading Point Coordinator",
            sopCode: "SOP-OPS-205"
          }
        },
        {
          id: "p3",
          label: "Apakah Tekanan Angin Ban & Rem Berfungsi Sempurna?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Pengemudi wajib melakukan pengecekan visual tekanan ban dan fungsi air-brake di check point gerbang keluar area konsesi sebelum masuk ke jalan umum.",
            input: "Alat pengukur tekanan ban manual",
            output: "Status Ban & Rem Lolos Inspeksi Checkpoint",
            pic: "Driver Mandiri",
            sopCode: "SOP-OPS-210"
          }
        },
        {
          id: "p4",
          label: "Transit Konvoi Hauling dengan Jarak Aman Min. 50 Meter",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Perjalanan transit wajib beriringan (platooning) dengan jarak aman antar truk minimal 50 meter guna mengantisipasi debu tebal di jalan tanah kering.",
            input: "Sistem komunikasi radio dua arah (HT)",
            output: "Laporan status radio berkala di setiap pos pantau",
            pic: "Convoy Captain",
            sopCode: "SOP-OPS-220"
          }
        },
        {
          id: "p5",
          label: "Unloading di Pabrik Kertas / Dermaga & Serah Terima Dokumen",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Proses pembongkaran kayu menggunakan log grabber, penimbangan berat akhir (tare weight) truk kosong, dan serah terima dokumen manifes.",
            input: "Log Grabber Crane, timbangan keluar pabrik",
            output: "Surat Jalan Kembali (SJK) tervalidasi digital",
            pic: "Receiving Point Officer",
            sopCode: "SOP-OPS-230"
          }
        },
        {
          id: "p_fail",
          label: "Pemberhentian Darurat (Emergency Halt) & Perbaikan Ban",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Jika rem terasa panas atau tekanan ban kurang di pos checkpoint, unit segera diparkir di shelter darurat untuk penanganan mekanik lapangan.",
            input: "Shelter darurat / bengkel bergerak",
            output: "Laporan penanganan kerusakan di jalan (Breakdown Report)",
            pic: "Mobile Repair Mechanic",
            sopCode: "SOP-TECH-302"
          }
        }
      ];
    } else {
      // Default / general fallback
      contextName = "Logistik & Transportasi Strategis";
      pic1 = "HR & HSE Officer";
      pic2 = "Technical Trainer Specialist";
      pic3 = "Operations Lead";
      pic4 = "Duty Dispatcher & Gate Lead";

      qualNodes = [
        {
          id: "q1",
          label: "Screening Berkas Administrasi (SIM, KTP, SKCK)",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Memeriksa keabsahan berkas, validitas SIM BII Umum, dan kecocokan identitas personil.",
            input: "Dokumen SIM, KTP, SKCK, Pas Foto",
            output: "Berkas lolos skrining administrasi",
            pic: "HR Recruiter",
            sopCode: "SOP-GEN-001"
          }
        },
        {
          id: "q2",
          label: "Pemeriksaan Kesehatan (Medical Check-Up)",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Melakukan tes fisik umum, buta warna, pendengaran, urin, dan tes narkoba.",
            input: "Surat rujukan lab, data kesehatan fisik",
            output: "Hasil MCU berstatus Fit To Work",
            pic: "HSE Medic Team",
            sopCode: "SOP-HSE-005"
          }
        },
        {
          id: "q3",
          label: "Apakah Lolos Sertifikasi Defensive Driving?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Uji kelayakan mengemudi defensif di simulator atau rute khusus untuk melihat refleks berkendara aman.",
            input: "Unit kendaraan komersial, lembar penilaian",
            output: "Sertifikasi Defensive Driving Course (DDC)",
            pic: "Safety Trainer",
            sopCode: "SOP-HSE-010"
          }
        },
        {
          id: "q4",
          label: "Pemberian Lisensi Otorisasi Driver Internal",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Penerbitan surat izin mengemudi khusus sasis dan rute internal PT Pancaran Swarnadwipa.",
            input: "Hasil kompilasi kelulusan",
            output: "Lisensi Internal Aktif",
            pic: "Operations Manager",
            sopCode: "SOP-OPS-003"
          }
        },
        {
          id: "q5",
          label: "Pemberian ID & RFID Card Aktif (Izin Jalan Hauling)",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Aktivasi kartu identitas pintar berbasis RFID untuk logging trip dan pencatatan timbangan otomatis.",
            input: "Nomor registrasi pegawai, ID Card kosong",
            output: "ID RFID Card Aktif & Siap Beroperasi",
            pic: "IT Admin & HSE Admin",
            sopCode: "SOP-SYS-002"
          }
        },
        {
          id: "q_fail",
          label: "Program Pelatihan Ulang (Retraining)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Pelatihan ulang intensif 1 minggu bagi kandidat yang belum memenuhi standar safety.",
            input: "Catatan evaluasi kegagalan DDC",
            output: "Rekomendasi uji ulang tahap kedua",
            pic: "Co-Driver Mentor",
            sopCode: "SOP-HR-003"
          }
        }
      ];

      skillNodes = [
        {
          id: "s1",
          label: "Pelatihan Pengenalan Unit Heavy Logging Truck",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Pemberian materi spesifikasi sasis ganda, rasio transmisi crawler-gear, dan sistem rem angin (Air Brake) bantuan pengereman retarder.",
            input: "Buku manual unit truk trailer kehutanan",
            output: "Pemahaman dasar sistem mekanis kelistrikan truk",
            pic: "Technical Trainer",
            sopCode: "SOP-TECH-101"
          }
        },
        {
          id: "s2",
          label: "Sertifikasi Teknik Lashing Pengikat Kayu Gelondongan",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Pelatihan khusus cara mengencangkan rantai baja pengikat kayu (Lashing) sesuai beban aman kerja (Working Load Limit - WLL) agar kayu tidak bergeser.",
            input: "Rantai baja, load binder, muatan gelondongan kayu",
            output: "Lisensi khusus Operator Lashing Swarnadwipa",
            pic: "Safety Supervisor",
            sopCode: "SOP-HSE-022"
          }
        },
        {
          id: "s3",
          label: "Ujian Lisensi Evakuasi Darurat (Rescue Hauling)?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi kemampuan mandiri dalam melepas kargo saat darurat, memasang sling derek (wire rope), dan evakuasi mandiri saat truk amblas di lumpur.",
            input: "Sling baja, shackle, alat penarik winch",
            output: "Nilai ujian penyelamatan darurat jalan logging",
            pic: "HSE Coordinator",
            sopCode: "SOP-HSE-030"
          }
        },
        {
          id: "s4",
          label: "Otorisasi Lisensi Sopir Logging Kelas Utama",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian otorisasi formal mengemudikan trailer gandeng multi-axle di jalan hauling terjal non-aspal.",
            input: "Hasil kompilasi kelulusan teknis & DDC",
            output: "Sertifikat Lisensi Internal Sopir Logging Kelas Utama",
            pic: "Operations Manager",
            sopCode: "SOP-OPS-040"
          }
        },
        {
          id: "s5",
          label: "Pengisian Matriks LogBook Kompetensi Personel",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pencatatan ke dalam sistem database ERP Prama ERP-Talent sebagai referensi promosi driver senior.",
            input: "Database profil karyawan, sertifikat lisensi",
            output: "Data digital kompetensi driver terupdate di cloud",
            pic: "HR Admin",
            sopCode: "SOP-SYS-009"
          }
        },
        {
          id: "s_fail",
          label: "Kelas Pendampingan Praktis Lapangan",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Sopir didampingi oleh mekanik dan instruktur khusus untuk membiasakan penanganan sling besi dan hidrolik di depo utama.",
            input: "Modul penanganan kendala mekanis",
            output: "Rekomendasi ujian remedial minggu berikutnya",
            pic: "Senior Lead Mechanic",
            sopCode: "SOP-TECH-105"
          }
        }
      ];

      kpiNodes = [
        {
          id: "k1",
          label: "Inisiasi Pencatatan Trip Digital di Timbangan",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Sistem menimbang muatan kotor (gross weight) kayu gelondongan yang dibawa di timbangan gerbang masuk konsesi hutan.",
            input: "Truk logging terisi muatan, tapping RFID",
            output: "Manifes timbangan awal tercatat di sistem cloud ERP",
            pic: "Timbangan Gate Officer",
            sopCode: "SOP-OPS-050"
          }
        },
        {
          id: "k2",
          label: "Monitoring Cycle Time & Manajemen Kecepatan GPS",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Sensor telematika GPS mencatat kecepatan rata-rata (maksimal 40 km/jam) dan waktu jeda istirahat supir (fatigue management).",
            input: "Data telematika GPS Geofencing",
            output: "Laporan fluktuasi kecepatan harian dan deviasi rute",
            pic: "Control Room Operator",
            sopCode: "SOP-SYS-120"
          }
        },
        {
          id: "k3",
          label: "Apakah Indeks Zero Damage & SLA Waktu Lolos?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Evaluasi apakah pengiriman mengalami kehilangan muatan kayu di jalan, kerusakan ban pecah, dan ketepatan waktu bongkar muat sesuai SLA (>98.5%).",
            input: "Laporan kedatangan unit di pabrik kertas/depo",
            output: "Kompilasi KPI bulanan sopir per unit plat nomor",
            pic: "Fleet Auditor",
            sopCode: "SOP-FIN-080"
          }
        },
        {
          id: "k4",
          label: "Perhitungan Insentif Bonus Keamanan & Bahan Bakar",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Pemberian bonus uang tambahan untuk pengemudi dengan rasio konsumsi solar efisien dan nihil pelanggaran rambu batas kecepatan.",
            input: "Skor audit hijau, laporan tangki solar akhir",
            output: "Slip bonus insentif bulanan sopir",
            pic: "Payroll Specialist",
            sopCode: "SOP-FIN-085"
          }
        },
        {
          id: "k5",
          label: "Evaluasi Kinerja & Reward Rencana Karir",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Pembaruan profil prestasi sopir di papan apresiasi untuk promosi menjadi Driver Captain / Safety Mentor.",
            input: "Data akumulasi pencapaian KPI bulanan",
            output: "Promosi kenaikan status grade driver",
            pic: "HR Manager",
            sopCode: "SOP-HR-040"
          }
        },
        {
          id: "k_fail",
          label: "Konseling & Surat Peringatan Kinerja (SP-KPI)",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Pembinaan intensif bagi pengemudi dengan SLA waktu pengiriman buruk atau konsumsi solar boros tanpa alasan kondisi alam terukur.",
            input: "Laporan deviasi waktu & audit tangki bocor",
            output: "Surat komitmen perbaikan kinerja pengemudi",
            pic: "Driver Operations Coach",
            sopCode: "SOP-HR-045"
          }
        }
      ];

      sopNodes = [
        {
          id: "p1",
          label: "Pre-Trip Inspection & Penandatanganan Fit Card",
          type: "start",
          x: 50,
          y: 180,
          details: {
            description: "Pemeriksaan kelayakan truk logging (Rem, Ban, Lampu, Oli, Rantai) serta tes tiup alkohol untuk memastikan kesiapan fisik driver.",
            input: "Checklist P2H (Pelaksanaan Pemeliharaan Harian)",
            output: "Lembar P2H yang disetujui, tanda tangan layak jalan",
            pic: "HSE Inspector",
            sopCode: "SOP-OPS-201"
          }
        },
        {
          id: "p2",
          label: "Proses Loading & Penguncian Rantai Pengaman Lashing",
          type: "process",
          x: 230,
          y: 180,
          details: {
            description: "Kayu diletakkan seimbang di atas sasis. Pengencangan rantai lashing ganda dan penutupan jaring muatan jika melewati kawasan perumahan.",
            input: "Crane pemuat kayu, rantai pengikat",
            output: "Surat Jalan Muat Kayu yang ditandatangani mandor",
            pic: "Loading Point Coordinator",
            sopCode: "SOP-OPS-205"
          }
        },
        {
          id: "p3",
          label: "Apakah Tekanan Angin Ban & Rem Berfungsi Sempurna?",
          type: "decision",
          x: 430,
          y: 155,
          details: {
            description: "Pengemudi wajib melakukan pengecekan visual tekanan ban dan fungsi air-brake di check point gerbang keluar area konsesi sebelum masuk ke jalan umum.",
            input: "Alat pengukur tekanan ban manual",
            output: "Status Ban & Rem Lolos Inspeksi Checkpoint",
            pic: "Driver Mandiri",
            sopCode: "SOP-OPS-210"
          }
        },
        {
          id: "p4",
          label: "Transit Konvoi Hauling dengan Jarak Aman Min. 50 Meter",
          type: "process",
          x: 650,
          y: 80,
          details: {
            description: "Perjalanan transit wajib beriringan (platooning) dengan jarak aman antar truk minimal 50 meter guna mengantisipasi debu tebal di jalan tanah kering.",
            input: "Sistem komunikasi radio dua arah (HT)",
            output: "Laporan status radio berkala di setiap pos pantau",
            pic: "Convoy Captain",
            sopCode: "SOP-OPS-220"
          }
        },
        {
          id: "p5",
          label: "Unloading di Pabrik Kertas / Dermaga & Serah Terima Dokumen",
          type: "end",
          x: 850,
          y: 180,
          details: {
            description: "Proses pembongkaran kayu menggunakan log grabber, penimbangan berat akhir (tare weight) truk kosong, dan serah terima dokumen manifes.",
            input: "Log Grabber Crane, timbangan keluar pabrik",
            output: "Surat Jalan Kembali (SJK) tervalidasi digital",
            pic: "Receiving Point Officer",
            sopCode: "SOP-OPS-230"
          }
        },
        {
          id: "p_fail",
          label: "Pemberhentian Darurat (Emergency Halt) & Perbaikan Ban",
          type: "process",
          x: 650,
          y: 280,
          details: {
            description: "Jika rem terasa panas atau tekanan ban kurang di pos checkpoint, unit segera diparkir di shelter darurat untuk penanganan mekanik lapangan.",
            input: "Shelter darurat / bengkel bergerak",
            output: "Laporan penanganan kerusakan di jalan (Breakdown Report)",
            pic: "Mobile Repair Mechanic",
            sopCode: "SOP-TECH-302"
          }
        }
      ];
    }

    const defaultConnections: FlowConnection[] = [
      { from: "q1", to: "q2" },
      { from: "q2", to: "q3" },
      { from: "q3", to: "q4", label: "YA (Lolos)", type: "yes" },
      { from: "q3", to: "q_fail", label: "TIDAK", type: "no" },
      { from: "q4", to: "q5" },
      { from: "q_fail", to: "q2", label: "Uji Ulang" }
    ];

    const skillConnections: FlowConnection[] = [
      { from: "s1", to: "s2" },
      { from: "s2", to: "s3" },
      { from: "s3", to: "s4", label: "YA (Lulus)", type: "yes" },
      { from: "s3", to: "s_fail", label: "TIDAK", type: "no" },
      { from: "s4", to: "s5" },
      { from: "s_fail", to: "s2", label: "Uji Ulang" }
    ];

    const kpiConnections: FlowConnection[] = [
      { from: "k1", to: "k2" },
      { from: "k2", to: "k3" },
      { from: "k3", to: "k4", label: "YA (Lolos)", type: "yes" },
      { from: "k3", to: "k_fail", label: "TIDAK", type: "no" },
      { from: "k4", to: "k5" },
      { from: "k_fail", to: "k2", label: "Perbaikan" }
    ];

    const sopConnections: FlowConnection[] = [
      { from: "p1", to: "p2" },
      { from: "p2", to: "p3" },
      { from: "p3", to: "p4", label: "YA (Sempurna)", type: "yes" },
      { from: "p3", to: "p_fail", label: "TIDAK", type: "no" },
      { from: "p4", to: "p5" },
      { from: "p_fail", to: "p3", label: "Re-Check" }
    ];

    return {
      orgchart: {
        title: "Bagan Struktur Organisasi Swarnadwipa",
        description: `Struktur hierarki kepemimpinan dan operasional PT Pancaran Swarnadwipa dari tingkat C-Suite hingga kru lapangan.`,
        icon: <Users className="h-5 w-5" />,
        nodes: orgchartNodes,
        connections: orgchartConnections
      },
      qualification: {
        title: "Personnel Qualification Flowchart",
        description: `Standardisasi jalur kualifikasi personil logistik (${contextName}) untuk kelayakan operasi minimum.`,
        icon: <UserCheck className="h-5 w-5" />,
        nodes: qualNodes,
        connections: defaultConnections
      },
      skill: {
        title: "Advanced Technical Skill & Licensing Flow",
        description: `Sertifikasi keahlian khusus dan lisensi internal (${contextName}) penanganan armada khusus.`,
        icon: <Award className="h-5 w-5" />,
        nodes: skillNodes,
        connections: skillConnections
      },
      kpi: {
        title: "Output & KPI Evaluation Flow",
        description: `Mekanisme pengukuran performa harian sopir, monitoring telemetri GPS, dan integrasi cloud ERP.`,
        icon: <Activity className="h-5 w-5" />,
        nodes: kpiNodes,
        connections: kpiConnections
      },
      sop: {
        title: "Standard Operating Procedure (SOP) Trip Flow",
        description: `Panduan operasional harian berurutan dari pre-trip inspection, loading, transit konvoi, hingga unloading.`,
        icon: <FileText className="h-5 w-5" />,
        nodes: sopNodes,
        connections: sopConnections
      }
    };
  });

  // Keep track of edited node text
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);

  const activeFlow = flows[activeFlowTab];

  // Colors based on theme presets
  const getThemeColors = (type: "start" | "process" | "decision" | "end" | "background" | "lines", selected = false) => {
    if (themePreset === "brand") {
      // Red-violet corporate theme (PT Pancaran Swarnadwipa Crimson Red)
      switch (type) {
        case "start":
          return selected 
            ? "bg-rose-700 text-white border-2 border-amber-400 shadow-lg scale-105" 
            : "bg-rose-600 text-white border border-rose-700 shadow-sm hover:bg-rose-700";
        case "end":
          return selected
            ? "bg-rose-800 text-white border-2 border-amber-400 shadow-lg scale-105"
            : "bg-rose-750 text-white border border-rose-900 shadow-sm hover:bg-rose-800";
        case "process":
          return selected
            ? "bg-white text-slate-800 border-2 border-rose-500 shadow-md scale-105 font-bold"
            : "bg-white text-slate-700 border border-slate-300 shadow-sm hover:border-rose-500 hover:shadow";
        case "decision":
          return selected
            ? "bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-md scale-105 font-bold"
            : "bg-amber-50/90 text-amber-900 border border-amber-300 shadow-sm hover:border-amber-500 hover:shadow";
        case "background":
          return "bg-slate-50 border border-slate-200";
        case "lines":
          return "#94a3b8"; // Slate-400
      }
    } else if (themePreset === "teal") {
      // Professional Teal
      switch (type) {
        case "start":
          return selected 
            ? "bg-teal-700 text-white border-2 border-amber-400 shadow-lg scale-105" 
            : "bg-teal-600 text-white border border-teal-700 shadow-sm hover:bg-teal-700";
        case "end":
          return selected
            ? "bg-teal-800 text-white border-2 border-amber-400 shadow-lg scale-105"
            : "bg-teal-900 text-white border border-teal-950 shadow-sm hover:bg-teal-850";
        case "process":
          return selected
            ? "bg-white text-slate-800 border-2 border-teal-500 shadow-md scale-105 font-bold"
            : "bg-white text-slate-700 border border-slate-300 shadow-sm hover:border-teal-500 hover:shadow";
        case "decision":
          return selected
            ? "bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-md scale-105 font-bold"
            : "bg-amber-50/90 text-amber-900 border border-amber-300 shadow-sm hover:border-amber-500 hover:shadow";
        case "background":
          return "bg-slate-50 border border-slate-200";
        case "lines":
          return "#0d9488"; // Teal-600
      }
    } else {
      // Corporate Royal Blue
      switch (type) {
        case "start":
          return selected 
            ? "bg-blue-700 text-white border-2 border-amber-400 shadow-lg scale-105" 
            : "bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700";
        case "end":
          return selected
            ? "bg-blue-800 text-white border-2 border-amber-400 shadow-lg scale-105"
            : "bg-blue-900 text-white border border-blue-950 shadow-sm hover:bg-blue-850";
        case "process":
          return selected
            ? "bg-white text-slate-800 border-2 border-blue-500 shadow-md scale-105 font-bold"
            : "bg-white text-slate-700 border border-slate-300 shadow-sm hover:border-blue-500 hover:shadow";
        case "decision":
          return selected
            ? "bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-md scale-105 font-bold"
            : "bg-amber-50/90 text-amber-900 border border-amber-300 shadow-sm hover:border-amber-500 hover:shadow";
        case "background":
          return "bg-slate-50 border border-slate-200";
        case "lines":
          return "#2563eb"; // Blue-600
      }
    }
  };

  // SVG Line Orthogonal Route Calculator
  // To make look exactly like professional draw.io, we use 90-deg angles!
  const calculateOrthogonalPath = (fromNode: FlowNode, toNode: FlowNode, isOrgChart = false) => {
    // Determine bounds and anchors
    // From right edge (x + width) to left edge (x)
    const fromWidth = isOrgChart ? 155 : fromNode.type === "decision" ? 140 : 150;
    const fromHeight = isOrgChart ? 85 : fromNode.type === "decision" ? 90 : 70;
    const toWidth = isOrgChart ? 155 : toNode.type === "decision" ? 140 : 150;
    const toHeight = isOrgChart ? 85 : toNode.type === "decision" ? 90 : 70;

    let startX = fromNode.x + fromWidth;
    let startY = fromNode.y + fromHeight / 2;
    let endX = toNode.x;
    let endY = toNode.y + toHeight / 2;

    // Adjust for vertical routing if nodes are below each other (like fail nodes)
    const isBelow = toNode.y > fromNode.y + fromHeight + 30;
    const isAbove = toNode.y < fromNode.y - 30;

    if (isBelow) {
      // From bottom center to top center
      startX = fromNode.x + fromWidth / 2;
      startY = fromNode.y + fromHeight;
      endX = toNode.x + toWidth / 2;
      endY = toNode.y;

      const midY = (startY + endY) / 2;
      return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    }

    if (isAbove) {
      // Recurse / loop back
      // From top center to bottom center
      startX = fromNode.x + fromWidth / 2;
      startY = fromNode.y;
      endX = toNode.x + toWidth / 2;
      endY = toNode.y + toHeight;

      const midY = (startY + endY) / 2;
      return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    }

    // Standard Horizontal Left-to-Right
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  };

  const selectedNode = activeFlow.nodes.find(n => n.id === selectedNodeId);

  // Update specific node details
  const saveNodeChanges = () => {
    if (!editingNode) return;
    setFlows(prev => {
      const updatedFlow = { ...prev[activeFlowTab] };
      updatedFlow.nodes = updatedFlow.nodes.map(n => 
        n.id === editingNode.id ? { ...editingNode } : n
      );
      return { ...prev, [activeFlowTab]: updatedFlow };
    });
    setEditingNode(null);
  };

  // Pan and drag canvas helpers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".flow-node")) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  // Zoom controls
  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 1.8));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-black tracking-widest text-rose-600 bg-rose-50 border border-rose-200 rounded px-2 py-0.5 inline-block">
              PRAMA ORGANIZATION CANVAS
            </span>
            <span className="text-[10px] font-mono font-black tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 inline-flex items-center gap-1">
              ⚡ SINKRON CHAT: <span className="text-indigo-900 font-bold">{projectTitle || "Kajian Strategis PRAMA"}</span>
            </span>
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span>Corporate Structure Flowcharts & SOP Workspace</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Visualisasi alur terpadu <strong>Organization</strong> berdasarkan kriteria kualifikasi, lisensi internal, skema KPI, dan standar operasional.
          </p>
        </div>

        {/* CONTROLS & THEMES */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
            <span className="px-2 text-slate-400">Skema:</span>
            <button
              onClick={() => setThemePreset("brand")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                themePreset === "brand" ? "bg-white text-rose-600 shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Prama Red
            </button>
            <button
              onClick={() => setThemePreset("teal")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                themePreset === "teal" ? "bg-white text-teal-600 shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Teal
            </button>
            <button
              onClick={() => setThemePreset("blue")}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                themePreset === "blue" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Blue
            </button>
          </div>

          {/* View switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
            <button
              onClick={() => setViewMode("canvas")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "canvas" ? "bg-white text-slate-800 shadow-sm font-black" : "hover:text-slate-800"
              }`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setViewMode("bento")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "bento" ? "bg-white text-slate-800 shadow-sm font-black" : "hover:text-slate-800"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Bento Grid (5 Map)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLOW TAB SELECTOR (ONLY SHOWN IN CANVAS MODE) */}
      {viewMode === "canvas" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
          {(["orgchart", "qualification", "skill", "kpi", "sop"] as const).map(tabKey => {
            const data = flows[tabKey];
            const isActive = activeFlowTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => {
                  setActiveFlowTab(tabKey);
                  setSelectedNodeId(null);
                }}
                className={`p-3.5 rounded-xl text-left border transition relative overflow-hidden cursor-pointer flex items-start gap-3 ${
                  isActive
                    ? "bg-rose-50/50 border-rose-500 shadow-sm ring-1 ring-rose-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {data.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className={`text-xs font-black uppercase tracking-tight ${isActive ? "text-rose-700" : "text-slate-700"}`}>
                      {tabKey === "orgchart" ? "1. Org Chart" : tabKey === "qualification" ? "2. Qualification" : tabKey === "skill" ? "3. Skill Flow" : tabKey === "kpi" ? "4. Output & KPI" : "5. SOP Trip"}
                    </h4>
                    {(tabKey === "qualification" || tabKey === "skill" || tabKey === "kpi" || tabKey === "sop") && (
                      <span className="text-[7px] font-black uppercase bg-rose-100 text-rose-700 px-1 py-0.5 rounded shrink-0 leading-none scale-90 origin-left">
                        TEXT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight font-semibold mt-0.5 truncate max-w-[140px]">
                    {data.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* CONTENT AREA: CANVAS VIEW OR BENTO MULTI-VIEW */}
      {viewMode === "bento" ? (
        /* BENTO GRID (5 MAP AT A GLANCE) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(["orgchart", "qualification", "skill", "kpi", "sop"] as const).map(tabKey => {
            const fData = flows[tabKey];
            return (
              <div 
                key={tabKey} 
                onClick={() => {
                  setActiveFlowTab(tabKey);
                  setViewMode("canvas");
                }}
                className="border border-slate-200 rounded-2xl p-4.5 hover:border-rose-400 hover:shadow-md transition cursor-pointer text-left bg-slate-50 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-rose-600 text-white rounded-lg">
                      {fData.icon}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">
                        {fData.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-tight font-semibold">
                        {fData.description}
                      </p>
                    </div>
                  </div>

                  {/* MINI TEXT LIST PREVIEW */}
                  {["qualification", "skill", "kpi", "sop"].includes(tabKey) ? (
                    <div className="h-44 bg-white border border-slate-200/60 rounded-xl overflow-y-auto mt-3 p-3.5 space-y-2 shadow-inner scrollbar-thin pointer-events-none text-left">
                      {tabKey === "qualification" || tabKey === "skill" ? (
                        personnelOrgData.slice(0, 4).map((p) => {
                          const displayName = p.role; // ONLY role/position!
                          const displayInitials = displayName.split(" ").map(w => w[0]).filter(c => /[a-zA-Z]/.test(c)).slice(0, 2).join("").toUpperCase();
                          return (
                            <div key={p.id} className="flex items-start gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-700 font-mono shrink-0">
                                {displayInitials}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-[9.5px] font-extrabold text-slate-800 leading-tight truncate">{displayName}</h5>
                                <p className="text-[8.5px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">
                                  {tabKey === "qualification" ? p.qualification.education : p.skill.coreSkills.slice(0, 3).join(", ")}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        fData.nodes
                          .filter(n => !n.id.includes("fail"))
                          .slice(0, 4)
                          .map((node, index) => (
                            <div key={node.id} className="flex items-start gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8.5px] font-black text-slate-700 shrink-0">
                                {index + 1}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-[9.5px] font-extrabold text-slate-800 leading-tight truncate">{node.label}</h5>
                                <p className="text-[8px] text-slate-400 font-semibold leading-none truncate">PIC: {node.details?.pic || "-"}</p>
                              </div>
                            </div>
                          ))
                      )}
                      <div className="text-center text-[8px] font-black text-rose-650 uppercase tracking-wider pt-1">
                        + Lihat Selengkapnya ({tabKey === "qualification" || tabKey === "skill" ? personnelOrgData.length : fData.nodes.length} Item)
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 relative bg-white border border-slate-200/60 rounded-xl overflow-hidden mt-3 shadow-inner select-none pointer-events-none p-1">
                      {/* Grid bg pattern */}
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                      <svg viewBox="0 0 1000 620" className="absolute inset-0 w-full h-full">
                        <defs>
                          <marker id={`arrow-mini-${tabKey}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                          </marker>
                        </defs>
                        {fData.connections.map((conn, idx) => {
                          const from = fData.nodes.find(n => n.id === conn.from);
                          const to = fData.nodes.find(n => n.id === conn.to);
                          if (!from || !to) return null;
                          return (
                            <path
                              key={idx}
                              d={calculateOrthogonalPath(from, to, tabKey === "orgchart")}
                              fill="none"
                              stroke="#94a3b8"
                              strokeWidth="3.5"
                              markerEnd={`url(#arrow-mini-${tabKey})`}
                            />
                          );
                        })}
                        {/* Miniature nodes inside foreignObject */}
                        {fData.nodes.map(node => {
                          const isOrgChart = tabKey === "orgchart";
                          const nodeWidth = isOrgChart ? 155 : node.type === "decision" ? 140 : 150;
                          const nodeHeight = isOrgChart ? 85 : node.type === "decision" ? 90 : 70;
                          const [empName, empRole] = isOrgChart ? node.label.split("\n") : [node.label, ""];

                          return (
                            <foreignObject
                              key={node.id}
                              x={node.x}
                              y={node.y}
                              width={nodeWidth}
                              height={nodeHeight}
                            >
                              <div className={`w-full h-full rounded-xl shadow-sm text-center font-bold flex flex-col items-center justify-center border p-1 text-[10px] ${getThemeColors(node.type)}`}>
                                {isOrgChart ? (
                                  <div className="flex flex-col items-center justify-center w-full h-full relative">
                                    <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${
                                      node.type === "start" || node.type === "end" ? "text-white" : "text-slate-800"
                                    }`}>
                                      {empName}
                                    </span>
                                    <span className={`text-[8.5px] font-extrabold mt-0.5 text-center leading-tight line-clamp-1 ${
                                      node.type === "start" || node.type === "end" ? "text-rose-100" : "text-slate-500"
                                    }`}>
                                      {empRole}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="line-clamp-2 leading-tight uppercase tracking-tight text-[9px] px-1 font-extrabold">
                                    {node.label}
                                  </span>
                                )}
                              </div>
                            </foreignObject>
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-black text-rose-600">
                  <span>BUKA INTERAKTIF CANVAS ➔</span>
                  <span className="text-slate-400 font-bold">
                    {tabKey === "qualification" || tabKey === "skill" ? `${personnelOrgData.length} Personnel` : `${fData.nodes.length} Simpul (Nodes)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* INTERACTIVE CANVAS VIEW (WITH ZOOM, PAN, DETAILS PANELS) */
        <div>
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                {activeFlow.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {activeFlow.description}
              </p>
            </div>

            {/* Canvas controls */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl shadow-sm border border-slate-200 self-start md:self-auto">
              <button
                onClick={zoomOut}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-500 px-1 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                onClick={resetZoom}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer text-[10px] font-black uppercase tracking-tight"
                title="Reset View"
              >
                Reset
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE BOARD AND DETAILS COLUMN */}
          {activeFlowTab === "qualification" || activeFlowTab === "skill" ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-left">
              {/* PERSONNEL LIST SIDEBAR (1 COLUMN) */}
              <div className="xl:col-span-1 border border-slate-200 rounded-2xl p-4.5 bg-white h-[420px] overflow-y-auto space-y-2 flex flex-col justify-between shadow-inner scrollbar-thin">
                <div>
                  <div className="border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[8px] font-mono font-black tracking-widest text-rose-600 uppercase">
                      STRUKTUR POSISI
                    </span>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight mt-0.5">
                      DAFTAR JABATAN ({personnelOrgData.length})
                    </h4>
                  </div>
                  <div className="space-y-1.5 overflow-y-auto pr-0.5">
                    {personnelOrgData.map((p) => {
                      const isSelected = selectedPersonnelId === p.id;
                      const displayInitials = p.role
                        .split(" ")
                        .map((w) => w[0])
                        .filter((c) => /[a-zA-Z]/.test(c))
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPersonnelId(p.id)}
                          className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer ${
                            isSelected 
                              ? "bg-rose-50 border-rose-200 shadow-sm" 
                              : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${p.iconBg} flex items-center justify-center text-[9px] font-black shadow-sm text-slate-800 shrink-0`}>
                            {displayInitials}
                          </div>
                          <div className="min-w-0">
                            <h5 className={`text-[10px] font-extrabold truncate ${isSelected ? "text-rose-900" : "text-slate-800"}`}>
                              {p.role}
                            </h5>
                            <p className="text-[8px] text-slate-400 font-bold leading-tight truncate">
                              Kode Posisi: {p.id.toUpperCase()}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DETAILED TEXT EXPLANATION PANEL (3 COLUMNS) */}
              <div className="xl:col-span-3 border border-slate-200 rounded-2xl p-6 bg-white h-[420px] overflow-y-auto flex flex-col justify-between shadow-inner scrollbar-thin">
                {(() => {
                  const currentP = personnelOrgData.find(p => p.id === selectedPersonnelId) || personnelOrgData[0];
                  const displayInitials = currentP.role
                    .split(" ")
                    .map((w) => w[0])
                    .filter((c) => /[a-zA-Z]/.test(c))
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  return (
                    <div className="flex-grow flex flex-col justify-between h-full">
                      <div>
                        {/* Header banner */}
                        <div className="flex items-center gap-4 border-b border-slate-150 pb-3 mb-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentP.iconBg} flex items-center justify-center text-sm font-black text-slate-800 shadow shrink-0`}>
                            {displayInitials}
                          </div>
                          <div>
                            <span className="text-[8px] font-mono font-black tracking-widest text-rose-600 uppercase">
                              {activeFlowTab === "qualification" ? "SPESIFIKASI KUALIFIKASI" : "KEAHLIAN & SKILL MAP"}
                            </span>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mt-0.5">
                              {currentP.role}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">
                              Status Posisi: Aktif Struktural (Staf Utama)
                            </p>
                          </div>
                        </div>

                        {activeFlowTab === "qualification" ? (
                          /* QUALIFICATION CONTENT */
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                                <Award className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[8.5px] font-mono font-bold uppercase text-slate-450 block tracking-wider">Pendidikan Akhir</span>
                                  <p className="text-[10px] font-extrabold text-slate-800 leading-tight mt-0.5">{currentP.qualification.education}</p>
                                </div>
                              </div>
                              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                                <Users className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[8.5px] font-mono font-bold uppercase text-slate-450 block tracking-wider">Pengalaman Industri</span>
                                  <p className="text-[10px] font-extrabold text-slate-800 leading-tight mt-0.5">{currentP.qualification.experience}</p>
                                </div>
                              </div>
                              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                                <UserCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[8.5px] font-mono font-bold uppercase text-slate-450 block tracking-wider">Lisensi Resmi</span>
                                  <p className="text-[10px] font-extrabold text-slate-800 leading-tight mt-0.5">{currentP.qualification.license}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              {/* Left side certifications */}
                              <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-450 block mb-2 flex items-center gap-1">
                                  <Check className="h-3 w-3 text-emerald-500" /> Sertifikasi Kompetensi
                                </span>
                                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                                  {currentP.qualification.certifications.map((cert, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-700 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200/60">
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Right side detailed explanation */}
                              <div className="bg-rose-50/30 border border-rose-100/60 p-3.5 rounded-xl">
                                <span className="text-[9px] font-black uppercase tracking-wider text-rose-750 block mb-1">
                                  Otoritas & Tanggung Jawab Strategis
                                </span>
                                <p className="text-[10.5px] text-slate-650 leading-relaxed font-semibold">
                                  {currentP.qualification.detailExplanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* SKILL CONTENT */
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                              <div className="bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100/60 text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 block mb-2">Keahlian Inti & Teknis</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentP.skill.coreSkills.map((sk, idx) => (
                                    <span key={idx} className="bg-indigo-100/60 text-indigo-800 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-indigo-200/40">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/60 text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 block mb-2">Operasional & Manajemen</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentP.skill.managerialSkills.map((sk, idx) => (
                                    <span key={idx} className="bg-emerald-100/60 text-emerald-800 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-emerald-200/40">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/60 text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 block mb-2">Komunikasi & Soft Skills</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentP.skill.softSkills.map((sk, idx) => (
                                    <span key={idx} className="bg-amber-100/60 text-amber-850 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-200/40">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mt-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                                Deskripsi Penerapan Keahlian & Kinerja Tim
                              </span>
                              <p className="text-[10.5px] text-slate-700 leading-relaxed font-semibold">
                                {currentP.skill.detailExplanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Info bar */}
                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-150/60 flex items-center justify-between mt-3 text-[9px] text-slate-400 font-bold select-none">
                        <span>PRAMA SYSTEM INTELLIGENCE ➔ QUALIFICATION & SKILL TEXT HUB</span>
                        <span>Update: Terintegrasi Struktur Organisasi 13 Pilar</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : activeFlowTab === "kpi" || activeFlowTab === "sop" ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-left">
              {/* STEPS LIST SIDEBAR (1 COLUMN) */}
              <div className="xl:col-span-1 border border-slate-200 rounded-2xl p-4.5 bg-white h-[420px] overflow-y-auto flex flex-col justify-between shadow-inner scrollbar-thin">
                <div>
                  <div className="border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[8px] font-mono font-black tracking-widest text-rose-600 uppercase">
                      TAHAPAN ALUR {activeFlowTab === "kpi" ? "KPI" : "SOP"}
                    </span>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight mt-0.5">
                      URUTAN PROSEDUR ({flows[activeFlowTab]?.nodes.length || 0})
                    </h4>
                  </div>
                  <div className="space-y-1.5 pr-0.5">
                    {flows[activeFlowTab]?.nodes
                      .filter(n => !n.id.includes("fail"))
                      .concat(flows[activeFlowTab]?.nodes.filter(n => n.id.includes("fail")) || [])
                      .map((node, index) => {
                        const isSelected = selectedStepId === node.id;
                        const isFailNode = node.id.includes("fail");
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedStepId(node.id)}
                            className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer ${
                              isSelected 
                                ? "bg-rose-50 border-rose-200 shadow-sm" 
                                : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm shrink-0 ${
                              isFailNode 
                                ? "bg-rose-100 text-rose-700" 
                                : isSelected 
                                ? "bg-rose-650 text-white" 
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {isFailNode ? "!" : index + 1}
                            </div>
                            <div className="min-w-0">
                              <h5 className={`text-[10px] font-extrabold truncate ${isSelected ? "text-rose-900" : "text-slate-800"}`}>
                                {node.label}
                              </h5>
                              <p className="text-[8.5px] text-slate-400 font-bold leading-tight truncate">
                                PIC: {node.details?.pic || "-"}
                              </p>
                            </div>
                          </button>
                        );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP DETAIL AND VISUAL PANEL (3 COLUMNS) */}
              <div className="xl:col-span-3 border border-slate-200 rounded-2xl p-6 bg-white h-[420px] overflow-y-auto flex flex-col justify-between shadow-inner scrollbar-thin">
                {(() => {
                  const currentFlow = flows[activeFlowTab];
                  const currentStep = currentFlow?.nodes.find(n => n.id === selectedStepId) || currentFlow?.nodes[0];
                  if (!currentStep) return <div className="text-slate-400 text-center py-20 font-semibold">Memuat tahapan...</div>;
                  
                  return (
                    <div className="flex-grow flex flex-col justify-between h-full">
                      <div className="space-y-4">
                        {/* Header of Active Step */}
                        <div className="flex items-start justify-between border-b border-slate-150 pb-3">
                          <div>
                            <span className="text-[8px] font-mono font-black tracking-widest text-rose-600 uppercase">
                              {activeFlowTab === "kpi" ? "EVALUASI OUTPUT & TARGET KPI" : "STANDAR OPERASIONAL PROSEDUR (SOP)"}
                            </span>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mt-0.5">
                              {currentStep.label}
                            </h3>
                            <p className="text-[9.5px] text-slate-450 font-bold mt-1">
                              Penanggung Jawab: <span className="text-rose-700">{currentStep.details?.pic || "-"}</span>
                            </p>
                          </div>
                          {currentStep.details?.sopCode && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono font-black border border-slate-200 shadow-sm">
                              {currentStep.details.sopCode}
                            </span>
                          )}
                        </div>

                        {/* Description & Requirements Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 md:col-span-1">
                            <span className="text-[8.5px] font-mono font-bold uppercase text-slate-450 block tracking-wider">Deskripsi Kegiatan</span>
                            <p className="text-[10px] font-semibold text-slate-650 leading-relaxed mt-1">{currentStep.details?.description}</p>
                          </div>
                          
                          <div className="bg-indigo-50/30 p-3.5 rounded-xl border border-indigo-100/50 md:col-span-1">
                            <span className="text-[8.5px] font-mono font-bold uppercase text-indigo-700 block tracking-wider">Input / Syarat Kelayakan</span>
                            <p className="text-[10px] font-bold text-slate-750 leading-relaxed mt-1">{currentStep.details?.input || "-"}</p>
                          </div>

                          <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/50 md:col-span-1">
                            <span className="text-[8.5px] font-mono font-bold uppercase text-emerald-700 block tracking-wider">Output / Hasil Kerja Utama</span>
                            <p className="text-[10px] font-bold text-emerald-800 leading-relaxed mt-1">{currentStep.details?.output || "-"}</p>
                          </div>
                        </div>

                        {/* TAB-SPECIFIC ADDITIONS (KPI IMAGE & CHARTS OR SOP CHECKLIST) */}
                        {activeFlowTab === "kpi" ? (
                          /* KPI GRAPHICS & CHART ATTACHMENT SECTION */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Interactive Live Mini-Chart */}
                            <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col justify-between">
                              <div>
                                <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                                  Matriks Pencapaian & Target Terukur
                                </span>
                                <div className="space-y-2">
                                  <div>
                                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                                      <span>SLA Ketepatan Waktu (SLA Achievement)</span>
                                      <span className="text-rose-650">Target: &gt;98%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                      <div className="bg-rose-500 h-full rounded-full" style={{ width: "98.5%" }} />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                                      <span>Kepatuhan Kecepatan Geofencing (Speed Limit Compliance)</span>
                                      <span className="text-rose-650">Target: 100%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                      <div className="bg-teal-500 h-full rounded-full" style={{ width: "95%" }} />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                                      <span>Indeks Keamanan & Keselamatan Jalan (Zero Incident Score)</span>
                                      <span className="text-rose-650">Target: 100%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "100%" }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-[8.5px] text-slate-400 font-mono font-medium mt-3">
                                📊 Sumber Data: Swarnadwipa Telematics Cloud Sync (Live)
                              </div>
                            </div>

                            {/* KPI Dashboard Image Upload & Viewer */}
                            <div className="bg-rose-50/20 border border-rose-100/50 p-3.5 rounded-xl flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[9.5px] font-black uppercase tracking-wider text-rose-750">
                                    Lampiran Visual KPI & Dashboard Grafik
                                  </span>
                                  {customKpiImage && (
                                    <button
                                      onClick={() => setCustomKpiImage(null)}
                                      className="text-[8.5px] font-bold text-rose-600 hover:underline bg-transparent border-none cursor-pointer"
                                    >
                                      Reset ke Default
                                    </button>
                                  )}
                                </div>
                                
                                {/* Image display container */}
                                <div className="relative h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 flex items-center justify-center group shadow-sm">
                                  <img 
                                    src={customKpiImage || kpiDashboardMockup} 
                                    alt="KPI Dashboard" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white text-[9px] font-black uppercase tracking-wider">
                                      {customKpiImage ? "Ganti Gambar" : "Ubah Gambar KPI"}
                                    </span>
                                  </div>
                                  {/* Direct upload click trigger */}
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        setCustomKpiImage(url);
                                      }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    title="Pilih foto kustom"
                                  />
                                </div>
                              </div>
                              
                              <p className="text-[8px] text-slate-450 leading-tight m-0 mt-1.5 font-bold">
                                💡 Klik pada gambar untuk mengunggah bagan/grafik KPI milik tim operasional Anda secara interaktif.
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* SOP TRIP COMPLIANCE CHECKLIST */
                          <div className="bg-white border border-slate-200 p-4 rounded-xl">
                            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block mb-2.5">
                              Checklist Kepatuhan Prosedur (SOP Compliance Checklist)
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                              <div className="flex items-center gap-2 border border-slate-50 p-2 rounded-lg hover:bg-slate-50">
                                <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                                <span className="text-[10px] font-semibold text-slate-650">Verifikasi berkas persyaratan pra-trip (Fit-to-Work)</span>
                              </div>
                              <div className="flex items-center gap-2 border border-slate-50 p-2 rounded-lg hover:bg-slate-50">
                                <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                                <span className="text-[10px] font-semibold text-slate-650">Pencatatan manifes logbook digital ke Cloud ERP</span>
                              </div>
                              <div className="flex items-center gap-2 border border-slate-50 p-2 rounded-lg hover:bg-slate-50">
                                <input type="checkbox" className="h-3.5 w-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                                <span className="text-[10px] font-semibold text-slate-650">Inspeksi visual kelayakan mekanis roda & pengereman (P2H)</span>
                              </div>
                              <div className="flex items-center gap-2 border border-slate-50 p-2 rounded-lg hover:bg-slate-50">
                                <input type="checkbox" className="h-3.5 w-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                                <span className="text-[10px] font-semibold text-slate-650">Otorisasi tapping log RFID di pintu timbangan portal</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Info bar */}
                      <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-150/60 flex items-center justify-between mt-3 text-[9px] text-slate-400 font-bold select-none">
                        <span>PRAMA SYSTEM INTELLIGENCE ➔ {activeFlowTab === "kpi" ? "KPI DATA TEXT FEED" : "SOP DETAILED FLOW"}</span>
                        <span>Status Kepatuhan: Audit Terstandardisasi ISO 9001:2015</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* CANVAS GRID (3 COLUMNS) */}
              <div className="xl:col-span-3 border border-slate-200 rounded-2xl relative overflow-hidden shadow-inner bg-slate-100 h-[380px] cursor-grab select-none">
                {/* Draw.io Canvas grid background */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Scaled/Panned Container */}
                  <div
                    className="absolute origin-top-left w-[1200px] h-[600px] transition-transform duration-75"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    }}
                  >
                    {/* SVG FLOW PATHS */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker
                          id="arrow-marker"
                          viewBox="0 0 10 10"
                          refX="8"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 1 L 10 5 L 0 9 z" fill={getThemeColors("lines")} />
                        </marker>
                      </defs>

                      {activeFlow.connections.map((conn, idx) => {
                        const from = activeFlow.nodes.find(n => n.id === conn.from);
                        const to = activeFlow.nodes.find(n => n.id === conn.to);
                        if (!from || !to) return null;

                        const pathD = calculateOrthogonalPath(from, to, activeFlowTab === "orgchart");

                        // Calculate midpoint of orthogonal line to position connection labels nicely
                        const midX = (from.x + to.x + 150) / 2;
                        const midY = (from.y + to.y + 70) / 2;

                        return (
                          <g key={idx}>
                            {/* Connection shadow stroke */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                            />
                            {/* Main stroke connection */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke={getThemeColors("lines")}
                              strokeWidth="2"
                              markerEnd="url(#arrow-marker)"
                            />
                            {/* Yes/No Branch Label */}
                            {conn.label && (
                              <foreignObject
                                x={midX - 35}
                                y={midY - 10}
                                width="70"
                                height="20"
                              >
                                <div className={`text-[8.5px] font-black text-center px-1 py-0.5 rounded border leading-none bg-white ${
                                  conn.type === "yes" 
                                    ? "text-emerald-700 border-emerald-200" 
                                    : conn.type === "no" 
                                    ? "text-rose-700 border-rose-200" 
                                    : "text-slate-600 border-slate-200"
                                }`}>
                                  {conn.label}
                                </div>
                              </foreignObject>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                     {/* FLOW NODES */}
                    {activeFlow.nodes.map(node => {
                      const isOrgChart = activeFlowTab === "orgchart";
                      const isSelected = selectedNodeId === node.id;
                      const nodeWidth = isOrgChart ? "w-[155px]" : node.type === "decision" ? "w-[140px]" : "w-[150px]";
                      const nodeHeight = isOrgChart ? "h-[85px]" : node.type === "decision" ? "h-[90px]" : "h-[70px]";
                      
                      const [empName, empRole] = isOrgChart ? node.label.split("\n") : [node.label, ""];
                      const initials = empName.includes("SH") ? "SH" : empName.includes("TL") ? "TL" : empName.includes("SP") ? "SP" : "ST";
                      const levelLabel = empName.includes("SH") 
                        ? "★ LEVEL 1: SH" 
                        : empName.includes("TL") 
                        ? "✦ LEVEL 2: TL" 
                        : empName.includes("SP") 
                        ? "💼 LEVEL 3: SP" 
                        : "👥 LEVEL 4: STAFF";

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                          className={`flow-node absolute rounded-xl p-2 shadow-md flex flex-col justify-center items-center text-center transition cursor-pointer border select-none ${nodeWidth} ${nodeHeight} ${getThemeColors(node.type, isSelected)}`}
                          style={{
                            left: `${node.x}px`,
                            top: `${node.y}px`
                          }}
                        >
                          {/* Node Code Badge (top right inside node) */}
                          {node.details?.sopCode && (
                            <span className={`absolute top-1 right-1 text-[7px] font-black px-1 rounded-sm ${
                              node.type === "start" || node.type === "end" 
                                ? "bg-white/20 text-white" 
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {node.details.sopCode}
                            </span>
                          )}

                          {isOrgChart ? (
                            <div className="flex flex-col items-center justify-center w-full h-full relative">
                              {/* Initials badge */}
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[7.5px] font-black shadow-sm mb-1 ${
                                node.type === "start" 
                                  ? "bg-white/20 text-white" 
                                  : node.type === "end" 
                                  ? "bg-white/30 text-white" 
                                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              }`}>
                                {initials}
                              </div>
                              
                              <span className={`text-[7px] font-bold uppercase tracking-wider ${
                                node.type === "start" || node.type === "end" ? "text-rose-200" : "text-slate-400"
                              }`}>
                                {empName}
                              </span>
                              
                              <span className={`text-[9.5px] font-black uppercase tracking-tight text-center leading-tight line-clamp-1 px-1 mt-0.5 ${
                                node.type === "start" || node.type === "end" ? "text-white" : "text-slate-800"
                              }`}>
                                {empRole}
                              </span>
                              
                              <span className={`text-[6.5px] font-mono mt-1 font-bold tracking-wider uppercase opacity-80 ${
                                node.type === "start" || node.type === "end" ? "text-rose-100" : "text-slate-500"
                              }`}>
                                {levelLabel}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-[10.5px] font-extrabold uppercase tracking-tight leading-tight leading-4 line-clamp-2 px-1">
                                {node.label}
                              </span>

                              {/* Visual indicator of type */}
                              <span className={`text-[7px] font-mono mt-1 font-semibold tracking-wider uppercase opacity-80 ${
                                node.type === "start" || node.type === "end" ? "text-rose-100" : "text-slate-500"
                              }`}>
                                {node.type === "decision" ? "◆ CABANG UJI" : node.type === "start" ? "● AWAL ALUR" : node.type === "end" ? "■ SELESAI" : "✔ PROSES"}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DETAILS PANEL (1 COLUMN) */}
              <div className="border border-slate-200 rounded-2xl p-5 text-left bg-slate-50 h-[380px] overflow-y-auto flex flex-col justify-between">
                {selectedNode ? (
                  /* NODE SELECTED - SHOW FULL DETAILS */
                  <div className="flex-grow flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start gap-2 border-b border-slate-200 pb-2 mb-3">
                        <div>
                          <span className="text-[8px] font-mono font-black tracking-widest text-indigo-600 uppercase">
                            DETAIL SIMPUL FLOWCHART
                          </span>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-0.5">
                            {activeFlowTab === "orgchart" 
                              ? `${selectedNode.label.split("\n")[0]} - ${selectedNode.label.split("\n")[1] || ""}`
                              : selectedNode.label}
                          </h4>
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          selectedNode.type === "decision" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {selectedNode.type}
                        </span>
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-700">
                        <div>
                          <strong className="text-[10px] text-slate-400 uppercase tracking-wider block">Deskripsi Kerja:</strong>
                          <p className="m-0 text-[11px] font-semibold text-slate-650 leading-relaxed mt-0.5">
                            {selectedNode.details?.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                          <div>
                            <strong className="text-[8.5px] text-slate-400 uppercase tracking-wider block">Input / Syarat:</strong>
                            <p className="m-0 text-[10px] font-bold text-slate-700 leading-tight mt-0.5">
                              {selectedNode.details?.input || "-"}
                            </p>
                          </div>
                          <div>
                            <strong className="text-[8.5px] text-slate-400 uppercase tracking-wider block">Output / Hasil:</strong>
                            <p className="m-0 text-[10px] font-bold text-emerald-700 leading-tight mt-0.5">
                              {selectedNode.details?.output || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200/50 flex items-center justify-between text-[10px] font-bold">
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase tracking-wider">
                              {activeFlowTab === "orgchart" ? "Jabatan" : "Penanggung Jawab (PIC)"}
                            </span>
                            <span className="text-slate-700 font-extrabold">
                              {activeFlowTab === "orgchart" 
                                ? (selectedNode.label.split("\n")[1] || selectedNode.label.split("\n")[0])
                                : (selectedNode.details?.pic || "-")}
                            </span>
                          </div>
                          {selectedNode.details?.sopCode && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-mono font-black border border-rose-100">
                              {selectedNode.details.sopCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit button */}
                    <div className="pt-4 border-t border-slate-200 mt-4 flex gap-2">
                      <button
                        onClick={() => setEditingNode(selectedNode)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit Simpul Ini</span>
                      </button>
                      <button
                        onClick={() => setSelectedNodeId(null)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-xs text-slate-700 cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                ) : (
                  /* NO NODE SELECTED - PROMPT USER */
                  <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 py-10">
                    <Info className="h-8 w-8 text-slate-300 mb-3" />
                    <h4 className="text-xs font-black uppercase tracking-tight text-slate-500">
                      Inspektur Simpul Aktif
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-400 leading-normal max-w-[180px] mt-1.5">
                      Klik salah satu kotak/simpul di dalam papan gambar untuk membuka audit detail penanggung jawab (PIC) serta output kerja.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NODE EDIT MODAL DIALOG */}
      {editingNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-lg text-left text-xs text-slate-700 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-rose-600" />
                <span>Modifikasi Otoritas Simpul Flowchart</span>
              </h4>
              <button
                onClick={() => setEditingNode(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              {activeFlowTab === "orgchart" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Tingkat Jabatan (SH/TL/SP/Staff)</label>
                    <input
                      type="text"
                      value={editingNode.label.split("\n")[0] || ""}
                      onChange={(e) => {
                        const parts = editingNode.label.split("\n");
                        parts[0] = e.target.value;
                        setEditingNode({ ...editingNode, label: parts.join("\n") });
                      }}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Bidang / Fungsi Kerja</label>
                    <input
                      type="text"
                      value={editingNode.label.split("\n")[1] || ""}
                      onChange={(e) => {
                        const parts = editingNode.label.split("\n");
                        parts[1] = e.target.value;
                        setEditingNode({ ...editingNode, label: parts.join("\n") });
                      }}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nama Simpul / Aktivitas</label>
                  <input
                    type="text"
                    value={editingNode.label}
                    onChange={(e) => setEditingNode({ ...editingNode, label: e.target.value })}
                    className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 mb-1">Deskripsi Detail Kegiatan</label>
                <textarea
                  value={editingNode.details?.description || ""}
                  onChange={(e) => setEditingNode({ 
                    ...editingNode, 
                    details: { ...(editingNode.details || { description: "", input: "", output: "", pic: "" }), description: e.target.value } 
                  })}
                  className="w-full h-16 p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-semibold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Masukan (Input)</label>
                  <input
                    type="text"
                    value={editingNode.details?.input || ""}
                    onChange={(e) => setEditingNode({ 
                      ...editingNode, 
                      details: { ...(editingNode.details || { description: "", input: "", output: "", pic: "" }), input: e.target.value } 
                    })}
                    className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Hasil Akhir (Output)</label>
                  <input
                    type="text"
                    value={editingNode.details?.output || ""}
                    onChange={(e) => setEditingNode({ 
                      ...editingNode, 
                      details: { ...(editingNode.details || { description: "", input: "", output: "", pic: "" }), output: e.target.value } 
                    })}
                    className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-semibold text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={editingNode.details?.pic || ""}
                    onChange={(e) => setEditingNode({ 
                      ...editingNode, 
                      details: { ...(editingNode.details || { description: "", input: "", output: "", pic: "" }), pic: e.target.value } 
                    })}
                    className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Kode SOP / Referensi</label>
                  <input
                    type="text"
                    value={editingNode.details?.sopCode || ""}
                    onChange={(e) => setEditingNode({ 
                      ...editingNode, 
                      details: { ...(editingNode.details || { description: "", input: "", output: "", pic: "" }), sopCode: e.target.value } 
                    })}
                    className="w-full p-2.5 border border-slate-205 rounded-xl bg-white outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingNode(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={saveNodeChanges}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-sm transition cursor-pointer border-none flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
