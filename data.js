/* ============================================================
   FaithToGrow EventCheck-in — data layer
   Mode REMOTE (Supabase): data sinkron lintas perangkat.
   Mode LOCAL (fallback): localStorage, per-browser saja —
   aktif otomatis selama SUPABASE_URL/KEY belum diisi.

   >>> Isi 2 konstanta di bawah dengan nilai dari
       Supabase: Project Settings -> API <<<
   ============================================================ */

const SUPABASE_URL = "https://adxcfqbcerheznqotltb.supabase.co";
const SUPABASE_KEY = "sb_publishable_owzDNLkSXFj_xfrJAF7lPQ_crvxQ-b8"; // publishable key (aman utk sisi klien)

const FTG_REMOTE = !!(SUPABASE_URL && SUPABASE_KEY);
const FTG_STORE_KEY = "fbf_checkin_v2";
const FTG_TABLE = SUPABASE_URL + "/rest/v1/peserta";

/* Data awal (seed) — dipakai saat pertama kali / setelah reset */
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

let ftgCache = [];

/* ---------- helpers ---------- */
function sbHeaders(extra) {
  const h = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
  // legacy anon key (JWT) butuh header Authorization; publishable key (sb_...) cukup apikey
  if (!SUPABASE_KEY.startsWith("sb_")) h.Authorization = "Bearer " + SUPABASE_KEY;
  return Object.assign(h, extra || {});
}

function localLoad() {
  try {
    const raw = localStorage.getItem(FTG_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt -> reseed */ }
  const fresh = JSON.parse(JSON.stringify(FTG_SEED));
  localStorage.setItem(FTG_STORE_KEY, JSON.stringify(fresh));
  return fresh;
}

function localSave(list) {
  localStorage.setItem(FTG_STORE_KEY, JSON.stringify(list));
}

/* ---------- API (async, dipakai semua halaman) ---------- */

/* Ambil semua peserta. Remote: fetch dari Supabase (auto-seed jika kosong).
   Jika jaringan gagal, pakai cache terakhir. */
async function ftgLoad() {
  if (!FTG_REMOTE) { ftgCache = localLoad(); return ftgCache; }
  try {
    const r = await fetch(FTG_TABLE + "?select=*&order=id.asc", { headers: sbHeaders() });
    if (!r.ok) throw new Error("HTTP " + r.status);
    let rows = await r.json();
    if (!rows.length) {
      await fetch(FTG_TABLE, {
        method: "POST",
        headers: sbHeaders({ Prefer: "resolution=ignore-duplicates" }),
        body: JSON.stringify(FTG_SEED),
      });
      rows = JSON.parse(JSON.stringify(FTG_SEED));
    }
    ftgCache = rows;
    return rows;
  } catch (e) {
    console.warn("ftgLoad remote gagal:", e.message);
    return ftgCache;
  }
}

/* Set status hadir seorang peserta. Mengembalikan waktu check-in (atau null). */
async function ftgSetHadir(id, hadir) {
  const waktu = hadir ? ftgNow() : null;
  if (!FTG_REMOTE) {
    const list = localLoad();
    const p = list.find(x => x.id === id);
    if (p) { p.hadir = hadir; p.waktu = waktu; localSave(list); }
    ftgCache = list;
    return waktu;
  }
  const r = await fetch(FTG_TABLE + "?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify({ hadir: hadir, waktu: waktu }),
  });
  if (!r.ok) throw new Error("Gagal menyimpan kehadiran (HTTP " + r.status + ")");
  const c = ftgCache.find(x => x.id === id);
  if (c) { c.hadir = hadir; c.waktu = waktu; }
  return waktu;
}

/* Tambah satu peserta (atau banyak sekaligus via ftgAddMany). */
async function ftgAdd(p) { return ftgAddMany([p]); }

async function ftgAddMany(list) {
  if (!list.length) return;
  if (!FTG_REMOTE) {
    const cur = localLoad();
    cur.push(...list);
    localSave(cur);
    ftgCache = cur;
    return;
  }
  const r = await fetch(FTG_TABLE, {
    method: "POST",
    headers: sbHeaders({ Prefer: "resolution=ignore-duplicates" }),
    body: JSON.stringify(list),
  });
  if (!r.ok) throw new Error("Gagal menyimpan peserta (HTTP " + r.status + ")");
  ftgCache.push(...list);
}

/* Reset semua data ke seed awal. */
async function ftgReset() {
  if (!FTG_REMOTE) {
    localStorage.removeItem(FTG_STORE_KEY);
    return ftgLoad();
  }
  await fetch(FTG_TABLE + "?id=neq.___", { method: "DELETE", headers: sbHeaders() });
  ftgCache = [];
  return ftgLoad(); // auto-seed karena tabel kosong
}

/* Langganan realtime (WebSocket): panggil onChange setiap ada perubahan
   di tabel peserta. Butuh supabase-js (CDN) dimuat di halaman. */
function ftgSubscribe(onChange) {
  if (!FTG_REMOTE || typeof supabase === "undefined") return null;
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  client.channel("peserta-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "peserta" }, onChange)
    .subscribe();
  return client;
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
