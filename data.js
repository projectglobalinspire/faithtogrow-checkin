/* ============================================================
   FaithToGrow EventCheck-in — shared data layer (localStorage)
   ============================================================ */

const FTG_STORE_KEY = "ftg_checkin_v1";

/* Seed: data peserta yang SUDAH diterima panitia sebelum hari-H.
   Skema 1 -> peserta ada di daftar ini, tinggal checklist hadir.
   Skema 2 -> peserta tidak ada di daftar, diinput baru di meja registrasi. */
const FTG_SEED = [
  // ---- Batch Jakarta ----
  { id: "FTG-2026-001", nama: "Najwa Fahira Mufti",    track: "Career Track",          batch: "Jakarta",    asal: "Universitas Indonesia",        hadir: true,  waktu: "08.02" },
  { id: "FTG-2026-002", nama: "Raka Aditya Pratama",   track: "Entrepreneurship",      batch: "Jakarta",    asal: "Binus University",             hadir: true,  waktu: "08.05" },
  { id: "FTG-2026-003", nama: "Salsabila Putri Ayu",   track: "Career Track",          batch: "Jakarta",    asal: "UNJ",                          hadir: true,  waktu: "08.11" },
  { id: "FTG-2026-004", nama: "Muhammad Farhan Hakim", track: "Career Track",          batch: "Jakarta",    asal: "Universitas Trisakti",         hadir: false, waktu: null },
  { id: "FTG-2026-005", nama: "Anindya Kirana Dewi",   track: "Entrepreneurship",      batch: "Jakarta",    asal: "Universitas Mercu Buana",      hadir: true,  waktu: "08.19" },
  { id: "FTG-2026-006", nama: "Bagas Setiawan",        track: "Career Track",          batch: "Jakarta",    asal: "Politeknik Negeri Jakarta",    hadir: true,  waktu: "08.24" },
  { id: "FTG-2026-007", nama: "Zahra Amelia Rahman",   track: "Career Track",          batch: "Jakarta",    asal: "UIN Syarif Hidayatullah",      hadir: false, waktu: null },
  { id: "FTG-2026-008", nama: "Dimas Anggara Putra",   track: "Entrepreneurship",      batch: "Jakarta",    asal: "Universitas Pancasila",        hadir: true,  waktu: "08.31" },

  // ---- Batch Bandung ----
  { id: "FTG-2026-009", nama: "Alya Nurfadillah",      track: "Career Track",          batch: "Bandung",    asal: "ITB",                          hadir: true,  waktu: "08.07" },
  { id: "FTG-2026-010", nama: "Fikri Ramadhan",        track: "Entrepreneurship",      batch: "Bandung",    asal: "Universitas Padjadjaran",      hadir: true,  waktu: "08.09" },
  { id: "FTG-2026-011", nama: "Naura Syifa Azzahra",   track: "Career Track",          batch: "Bandung",    asal: "UPI Bandung",                  hadir: true,  waktu: "08.14" },
  { id: "FTG-2026-012", nama: "Gilang Mahardika",      track: "Career Track",          batch: "Bandung",    asal: "Telkom University",            hadir: false, waktu: null },
  { id: "FTG-2026-013", nama: "Kayla Prameswari",      track: "Entrepreneurship",      batch: "Bandung",    asal: "Universitas Parahyangan",      hadir: true,  waktu: "08.22" },
  { id: "FTG-2026-014", nama: "Reza Aulia Firmansyah", track: "Career Track",          batch: "Bandung",    asal: "Universitas Islam Bandung",    hadir: true,  waktu: "08.28" },
  { id: "FTG-2026-015", nama: "Tiara Maharani",        track: "Career Track",          batch: "Bandung",    asal: "Polban",                       hadir: false, waktu: null },

  // ---- Batch Surabaya ----
  { id: "FTG-2026-016", nama: "Yusuf Ibrahim Malik",   track: "Entrepreneurship",      batch: "Surabaya",   asal: "ITS",                          hadir: true,  waktu: "08.03" },
  { id: "FTG-2026-017", nama: "Citra Ayu Lestari",     track: "Career Track",          batch: "Surabaya",   asal: "Universitas Airlangga",        hadir: true,  waktu: "08.13" },
  { id: "FTG-2026-018", nama: "Andika Wirautama",      track: "Career Track",          batch: "Surabaya",   asal: "UPN Veteran Jatim",            hadir: true,  waktu: "08.17" },
  { id: "FTG-2026-019", nama: "Putri Nabila Sari",     track: "Entrepreneurship",      batch: "Surabaya",   asal: "Universitas Negeri Surabaya",  hadir: false, waktu: null },
  { id: "FTG-2026-020", nama: "Hafiz Alfarizi",        track: "Career Track",          batch: "Surabaya",   asal: "Universitas Ciputra",          hadir: true,  waktu: "08.26" },
  { id: "FTG-2026-021", nama: "Laras Widyaningrum",    track: "Career Track",          batch: "Surabaya",   asal: "PENS",                         hadir: true,  waktu: "08.33" },

  // ---- Batch Yogyakarta ----
  { id: "FTG-2026-022", nama: "Arya Bima Nugroho",     track: "Career Track",          batch: "Yogyakarta", asal: "UGM",                          hadir: true,  waktu: "08.06" },
  { id: "FTG-2026-023", nama: "Sekar Arum Pertiwi",    track: "Entrepreneurship",      batch: "Yogyakarta", asal: "UNY",                          hadir: true,  waktu: "08.12" },
  { id: "FTG-2026-024", nama: "Danish Prasetyo",       track: "Career Track",          batch: "Yogyakarta", asal: "UII",                          hadir: false, waktu: null },
  { id: "FTG-2026-025", nama: "Ratna Kumala Dewi",     track: "Career Track",          batch: "Yogyakarta", asal: "UPN Veteran Yogyakarta",       hadir: true,  waktu: "08.21" },
  { id: "FTG-2026-026", nama: "Fajar Sidiq Permana",   track: "Entrepreneurship",      batch: "Yogyakarta", asal: "Amikom Yogyakarta",            hadir: true,  waktu: "08.29" },

  // ---- Batch Makassar ----
  { id: "FTG-2026-027", nama: "Aisyah Ramadhani",      track: "Career Track",          batch: "Makassar",   asal: "Universitas Hasanuddin",       hadir: true,  waktu: "08.04" },
  { id: "FTG-2026-028", nama: "Ilham Akbar Syam",      track: "Entrepreneurship",      batch: "Makassar",   asal: "UNM Makassar",                 hadir: true,  waktu: "08.16" },
  { id: "FTG-2026-029", nama: "Nurul Hikmah",          track: "Career Track",          batch: "Makassar",   asal: "UIN Alauddin",                 hadir: false, waktu: null },
  { id: "FTG-2026-030", nama: "Rifqi Maulana Ishak",   track: "Career Track",          batch: "Makassar",   asal: "Universitas Muslim Indonesia", hadir: true,  waktu: "08.27" },
];

const FTG_BATCHES = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Makassar"];

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
  return "FTG-2026-" + String(max + 1).padStart(3, "0");
}
