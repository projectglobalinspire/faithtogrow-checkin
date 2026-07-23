/* ============================================================
   FaithToGrow EventCheck-in — shared data layer (localStorage)
   Data peserta: Future Builders Fellowship 2026 (import xlsx,
   kontak pribadi sengaja tidak disertakan)
   ============================================================ */

const FTG_STORE_KEY = "fbf_checkin_v2";

/* Data registrasi yang sudah masuk duluan ke sistem (pre-event).
   Skema 1 -> peserta ada di daftar ini, tinggal checklist hadir.
   Skema 2 -> peserta tidak ada di daftar, diinput baru di meja registrasi. */
const FTG_SEED = [
  { id: "FBF-2026-001", nama: "Arbi Muhamad Al Maududi",    track: "Career Track",     provinsi: "Jawa Barat",  kota: "Kab. Tasikmalaya",       asal: "IPB University",             hadir: false, waktu: null },
  { id: "FBF-2026-002", nama: "Atqia Ali",                  track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Timur",     asal: "Jakarta Business School",    hadir: false, waktu: null },
  { id: "FBF-2026-003", nama: "Tia Ulfiyah Azizah",         track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas PTIQ Jakarta",   hadir: false, waktu: null },
  { id: "FBF-2026-004", nama: "Nurfajriah Halimatuz Zahra", track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Selatan",   asal: "-",                          hadir: false, waktu: null },
  { id: "FBF-2026-005", nama: "Annisa Fathya Rahmah",       track: "Entrepreneurship", provinsi: "Jawa Barat",  kota: "Kota Depok",             asal: "IPB University",             hadir: false, waktu: null },
  { id: "FBF-2026-006", nama: "Hafmuth",                    track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "-",                          hadir: false, waktu: null },
  { id: "FBF-2026-007", nama: "Adam Mawardi",               track: "Career Track",     provinsi: "Jawa Barat",  kota: "Kota Tasikmalaya",       asal: "Universitas Siliwangi",      hadir: false, waktu: null },
  { id: "FBF-2026-008", nama: "Aisyanda Zahra N",           track: "Entrepreneurship", provinsi: "Jawa Tengah", kota: "Kab. Klaten",            asal: "-",                          hadir: false, waktu: null },
  { id: "FBF-2026-009", nama: "Clarissa Rizki Safira",      track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas Negeri Jakarta", hadir: false, waktu: null },
  { id: "FBF-2026-010", nama: "Ade Ludfi Fadhilah",         track: "Entrepreneurship", provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas PTIQ Jakarta",   hadir: false, waktu: null },
  { id: "FBF-2026-011", nama: "Moammar Naufal",             track: "Entrepreneurship", provinsi: "DKI Jakarta", kota: "Kota Jakarta Selatan",   asal: "Cyber University",           hadir: false, waktu: null },
  { id: "FBF-2026-012", nama: "Asashitaiga",                track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Barat",     asal: "SMA Fatahillah",             hadir: false, waktu: null },
  { id: "FBF-2026-013", nama: "Ahqlika Fasqilla",           track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Barat",     asal: "UIN Jakarta",                hadir: false, waktu: null },
  { id: "FBF-2026-014", nama: "Marcell Mambenuk Rumkabu",   track: "Career Track",     provinsi: "Papua",       kota: "Kota Jayapura",          asal: "Universitas Cenderawasih",   hadir: false, waktu: null },
];

const FTG_BATCHES = ["DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "Papua"];

function ftgLoad() {
  try {
    const raw = localStorage.getItem(FTG_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt -> reseed */ }
  const fresh = JSON.parse(JSON.stringify(FTG_SEED));
  ftgSave(fresh);
  return fresh;
}

function ftgSave(list) {
  localStorage.setItem(FTG_STORE_KEY, JSON.stringify(list));
}

function ftgReset() {
  localStorage.removeItem(FTG_STORE_KEY);
  return ftgLoad();
}

function ftgNow() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + "." + String(d.getMinutes()).padStart(2, "0");
}

function ftgNextId(list) {
  let max = 0;
  list.forEach(p => {
    const m = p.id.match(/(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return "FBF-2026-" + String(max + 1).padStart(3, "0");
}
