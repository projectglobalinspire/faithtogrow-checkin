/* ============================================================
   FaithToGrow EventCheck-in — data layer (Supabase)
   Wajib dimuat SETELAH supabase-js (CDN UMD).
   Mode LOCAL (localStorage) aktif otomatis jika URL/KEY kosong.
   ============================================================ */

const SUPABASE_URL = "https://adxcfqbcerheznqotltb.supabase.co";
const SUPABASE_KEY = "sb_publishable_owzDNLkSXFj_xfrJAF7lPQ_crvxQ-b8"; // publishable key (aman utk sisi klien)

const FTG_REMOTE = !!(SUPABASE_URL && SUPABASE_KEY);
const FTG_STORE_KEY = "fbf_checkin_v2";

const sb = (FTG_REMOTE && typeof supabase !== "undefined")
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/* Data awal (seed) — dipakai saat pertama kali / setelah reset */
const FTG_SEED = [
  { id: "FBF-2026-001", nama: "Arbi Muhamad Al Maududi",    track: "Career Track",     provinsi: "Jawa Barat",  kota: "Kab. Tasikmalaya",       asal: "IPB University",             wa3: "156", hadir: false, waktu: null },
  { id: "FBF-2026-002", nama: "Atqia Ali",                  track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Timur",     asal: "Jakarta Business School",    wa3: "962", hadir: false, waktu: null },
  { id: "FBF-2026-003", nama: "Tia Ulfiyah Azizah",         track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas PTIQ Jakarta",   wa3: "104", hadir: false, waktu: null },
  { id: "FBF-2026-004", nama: "Nurfajriah Halimatuz Zahra", track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Selatan",   asal: "-",                          wa3: "875", hadir: false, waktu: null },
  { id: "FBF-2026-005", nama: "Annisa Fathya Rahmah",       track: "Entrepreneurship", provinsi: "Jawa Barat",  kota: "Kota Depok",             asal: "IPB University",             wa3: "068", hadir: false, waktu: null },
  { id: "FBF-2026-006", nama: "Hafmuth",                    track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "-",                          wa3: "809", hadir: false, waktu: null },
  { id: "FBF-2026-007", nama: "Adam Mawardi",               track: "Career Track",     provinsi: "Jawa Barat",  kota: "Kota Tasikmalaya",       asal: "Universitas Siliwangi",      wa3: "019", hadir: false, waktu: null },
  { id: "FBF-2026-008", nama: "Aisyanda Zahra N",           track: "Entrepreneurship", provinsi: "Jawa Tengah", kota: "Kab. Klaten",            asal: "-",                          wa3: "254", hadir: false, waktu: null },
  { id: "FBF-2026-009", nama: "Clarissa Rizki Safira",      track: "Career Track",     provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas Negeri Jakarta", wa3: "489", hadir: false, waktu: null },
  { id: "FBF-2026-010", nama: "Ade Ludfi Fadhilah",         track: "Entrepreneurship", provinsi: "Banten",      kota: "Kota Tangerang Selatan", asal: "Universitas PTIQ Jakarta",   wa3: "455", hadir: false, waktu: null },
  { id: "FBF-2026-011", nama: "Moammar Naufal",             track: "Entrepreneurship", provinsi: "DKI Jakarta", kota: "Kota Jakarta Selatan",   asal: "Cyber University",           wa3: "004", hadir: false, waktu: null },
  { id: "FBF-2026-012", nama: "Asashitaiga",                track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Barat",     asal: "SMA Fatahillah",             wa3: "138", hadir: false, waktu: null },
  { id: "FBF-2026-013", nama: "Ahqlika Fasqilla",           track: "Career Track",     provinsi: "DKI Jakarta", kota: "Kota Jakarta Barat",     asal: "UIN Jakarta",                wa3: "828", hadir: false, waktu: null },
  { id: "FBF-2026-014", nama: "Marcell Mambenuk Rumkabu",   track: "Career Track",     provinsi: "Papua",       kota: "Kota Jayapura",          asal: "Universitas Cenderawasih",   wa3: "680", hadir: false, waktu: null },
];

const FTG_BATCHES = ["DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "Papua"];

let ftgCache = [];

/* ---------- fallback lokal ---------- */
function localLoad() {
  try {
    const raw = localStorage.getItem(FTG_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt -> reseed */ }
  const fresh = JSON.parse(JSON.stringify(FTG_SEED));
  localStorage.setItem(FTG_STORE_KEY, JSON.stringify(fresh));
  return fresh;
}
function localSave(list) { localStorage.setItem(FTG_STORE_KEY, JSON.stringify(list)); }

/* ---------- peserta ---------- */
async function ftgLoad() {
  if (!sb) { ftgCache = localLoad(); return ftgCache; }
  const { data, error } = await sb.from("peserta").select("*").order("id");
  if (error) { console.warn("ftgLoad:", error.message); return ftgCache; }
  if (!data.length) {
    await sb.from("peserta").insert(FTG_SEED);
    ftgCache = JSON.parse(JSON.stringify(FTG_SEED));
    return ftgCache;
  }
  ftgCache = data;
  return data;
}

/* Set status hadir + pencatat log (oleh: "Siswa" / "LO Panel" / "LO Meja Registrasi") */
async function ftgSetHadir(id, hadir, oleh) {
  const waktu = hadir ? ftgNow() : null;
  if (!sb) {
    const list = localLoad();
    const p = list.find(x => x.id === id);
    if (p) { p.hadir = hadir; p.waktu = waktu; localSave(list); }
    ftgCache = list;
    return waktu;
  }
  const { error } = await sb.from("peserta")
    .update({ hadir: hadir, waktu: waktu, updated_by: oleh || "?" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  const c = ftgCache.find(x => x.id === id);
  if (c) { c.hadir = hadir; c.waktu = waktu; }
  return waktu;
}

async function ftgAdd(p) { return ftgAddMany([p]); }

async function ftgAddMany(list) {
  if (!list.length) return;
  if (!sb) {
    const cur = localLoad();
    cur.push(...list);
    localSave(cur);
    ftgCache = cur;
    return;
  }
  const { error } = await sb.from("peserta").insert(list);
  if (error) throw new Error(error.message);
  ftgCache.push(...list);
}

async function ftgReset() {
  if (!sb) {
    localStorage.removeItem(FTG_STORE_KEY);
    return ftgLoad();
  }
  const { error } = await sb.from("peserta").delete().neq("id", "___");
  if (error) throw new Error(error.message);
  ftgCache = [];
  return ftgLoad(); // auto-seed karena tabel kosong
}

/* ---------- log kehadiran ---------- */
async function ftgLogList(limit) {
  if (!sb) return [];
  const { data, error } = await sb.from("log_kehadiran")
    .select("*").order("id", { ascending: false }).limit(limit || 15);
  if (error) { console.warn("ftgLogList:", error.message); return []; }
  return data;
}

/* ---------- realtime ---------- */
/* onChange(payload) dipanggil setiap ada perubahan peserta / log baru */
function ftgSubscribe(onChange) {
  if (!sb) return null;
  sb.channel("fbf-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "peserta" }, onChange)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "log_kehadiran" }, onChange)
    .subscribe();
  return sb;
}

/* ---------- auth LO (Supabase Auth) ---------- */
async function ftgSession() {
  if (!sb) return sessionStorage.getItem("fbf_lo_auth") === "1" ? { local: true } : null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function ftgSignIn(email, pass) {
  if (!sb) { sessionStorage.setItem("fbf_lo_auth", "1"); return true; }
  const { error } = await sb.auth.signInWithPassword({ email: email, password: pass });
  if (error) throw new Error(error.message);
  return true;
}

async function ftgSignOut() {
  if (sb) await sb.auth.signOut();
  sessionStorage.removeItem("fbf_lo_auth");
  location.href = "login.html";
}

/* ---------- util ---------- */
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
