/**
 * Archetype Detector for Business Intelligence & Strategic Feasibility Dashboards
 * Accurately determines if a project title belongs to:
 * 1. 'manufacturing' : Industrial manufacturing, factory, production line, processing, assembly, fabrication
 * 2. 'personal_sme'  : Personal business, UMKM, retail store, cafe, restaurant, culinary, personal service, clinic, workshop, studio
 * 3. 'transport'     : Transportation, logistics, hauling, fleet, cargo, expedition, cold chain, commodity bulk transport
 */

export type ProjectArchetype = 'manufacturing' | 'personal_sme' | 'transport';

export function detectProjectArchetype(rawTitle: string): ProjectArchetype {
  const t = (rawTitle || "").toLowerCase();

  // 1. Explicit Personal Business / SME / UMKM / Retail / Culinary / Local Service Keywords
  const personalSmeKeywords = [
    "usaha pribadi", "usaha mandiri", "usaha kecil", "usaha mikro", "umkm", "bisnis mandiri",
    "toko", "store", "shop", "ritel", "retail", "minimarket", "kelontong", "sembako",
    "kedai", "kafe", "cafe", "coffee", "kopi", "roastery", "resto", "restoran", "restaurant",
    "kuliner", "culinary", "warung", "angkringan", "katering", "catering", "bakery", "roti",
    "kue", "pastry", "snack", "salon", "barbershop", "pangkas rambut", "laundry", "cuci baju",
    "cuci kiloan", "cuci mobil", "car wash", "cuci motor", "klinik", "apotek", "bengkel motor",
    "bengkel mobil", "service ac", "servis ac", "butik", "boutique", "fashion store", "distro",
    "peternakan", "peternak", "perikanan", "budidaya", "kebun", "pertanian", "tani", "hidroponik",
    "studio", "fotografi", "photography", "agency", "agensi", "konsultan", "consulting",
    "bimbel", "kursus", "les privat", "kos", "kost", "homestay", "penginapan", "florist",
    "souvenir", "jasa desain", "jasa pembuatan", "percetakan mandiri", "fotokopi", "event organizer",
    "wedding organizer", "jasa cuci", "jasa kebersihan"
  ];

  // 2. Explicit Manufacturing / Factory / Industrial Production Keywords
  const manufacturingKeywords = [
    "manufaktur", "manufacturing", "pabrik", "factory", "lini produksi", "perakitan", "assembly",
    "fabrikasi", "fabrication", "pengolahan", "pemrosesan", "processing", "konveksi", "garmen",
    "tekstil", "textile", "garment", "kemasan", "packaging", "amdk", "air minum dalam kemasan",
    "air mineral", "plastik", "baja", "logam", "metal", "kayu olahan", "furnitur", "furniture",
    "mebel", "elektronik", "kimia industri", "chemical plant", "pakan ternak", "feedmill",
    "percetakan kemasan", "keramik", "olahan pangan", "makanan olahan", "food manufacturing",
    "food processing", "bengkel bubut", "pabrikasi", "industri manufaktur", "smelter", "refinery",
    "kilang", "pembuatan produk", "industri olahan"
  ];

  // 3. Explicit Transportation / Fleet / Logistics Keywords
  const transportKeywords = [
    "transport", "transportasi", "logistik", "logistics", "armada", "fleet", "truk", "trucking",
    "hauling", "kargo", "cargo", "ekspedisi", "pengiriman", "delivery", "courier", "kurir",
    "trailer", "tronton", "wingbox", "kontainer", "container", "fms", "reefer", "cold chain",
    "cpo", "batubara", "coal", "nikel", "semen curah", "b3", "limbah b3", "angkutan",
    "shuttle", "depo hub", "logging timber", "intermoda", "pelabuhan kontainer"
  ];

  const hasPersonalSme = personalSmeKeywords.some(k => t.includes(k));
  const hasManufacturing = manufacturingKeywords.some(k => t.includes(k));
  const hasTransport = transportKeywords.some(k => t.includes(k));

  // Determine priority
  if (hasPersonalSme && !hasTransport && !hasManufacturing) return 'personal_sme';
  if (hasManufacturing && !hasTransport) return 'manufacturing';
  if (hasTransport && !hasPersonalSme && !hasManufacturing) return 'transport';

  // Combinations
  if (hasManufacturing) return 'manufacturing';
  if (hasPersonalSme) return 'personal_sme';
  if (hasTransport) return 'transport';

  // Fallback heuristics: check if title has small business or production traits
  if (t.includes("usaha") || t.includes("mandiri") || t.includes("jasa") || t.includes("kreatif") || t.includes("studio") || t.includes("store")) {
    return 'personal_sme';
  }
  if (t.includes("produk") || t.includes("produksi") || t.includes("material") || t.includes("alat") || t.includes("bikin") || t.includes("olah")) {
    return 'manufacturing';
  }

  // Default to personal_sme as the most flexible adaptable business model when ambiguous
  return 'personal_sme';
}
