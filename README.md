# FaithToGrow EventCheck-in Dashboard

Dashboard registrasi & monitoring kehadiran **Future Builders Fellowship 2026 — Onboarding Day** ([faithtogrow.org](https://faithtogrow.org/)). Data peserta diimpor dari file pendaftaran resmi (xlsx).

## Halaman

| Halaman | Akses | Fungsi |
|---|---|---|
| `index.html` | 🔒 LO | **Monitor Panel** — rekap real-time: total terdaftar, sudah check-in, persentase, breakdown per provinsi, pencarian, filter, export CSV, tandai/batal hadir |
| `checkin.html` | 🔒 LO | **Meja Registrasi** — check-in via input nama, scan QR pakai kamera, atau ID manual |
| `tickets.html` | 🔒 LO | **QR Generator** — QR event (self check-in) + e-ticket QR per peserta, siap print |
| `hadir.html` | 🌐 Publik | **Self Check-in Siswa** — hasil scan QR: hanya bisa ketik nama panjang → pilih nama → klik HADIR |
| `login.html` | 🌐 Publik | **Login LO** — gerbang masuk halaman panitia |

## Login LO (Supabase Auth)

Halaman panitia dilindungi **Supabase Auth** (akun tersimpan aman di server, bukan di kode):

- Email: `lo@faithtogrow.org` / Password: `FBF2026-LO` (ganti/tambah akun LO di dashboard Supabase → Authentication → Users)

Aturan database (RLS): pengunjung anonim hanya bisa **membaca** daftar & **mengubah status hadir**; tambah/hapus/edit data peserta hanya bisa oleh LO yang login.

## Fitur panel tambahan

- Riwayat check-in live (tabel `log_kehadiran`, terisi otomatis via trigger) + toast & bunyi notifikasi
- Breakdown per track, grafik check-in per jam, tombol "Salin Belum Hadir" (untuk follow-up WA)
- Export Excel (.xlsx), template import, import CSV/Excel, input manual
- Verifikasi self check-in: siswa memasukkan 3 digit terakhir nomor WA (kolom `wa3`)
- PWA: bisa di-install, halaman tetap terbuka saat offline, check-in offline masuk antrean dan terkirim otomatis saat online

## Workflow

1. Peserta datang ke meja registrasi.
2. Scan QR (event QR dengan HP peserta, atau e-ticket peserta dengan kamera petugas).
3. Muncul input nama / data peserta — sistem mengecek apakah data sudah ada.
4. **Skema 1 — data sudah ada:** ketik nama → tekan **Enter** → nama cocok dengan data registrasi yang sudah masuk duluan → **berhasil terdaftar HADIR**.
5. **Skema 2 — belum ada:** form input registrasi walk-in → langsung tercatat hadir dengan ID otomatis.
6. Semua perubahan tersinkron real-time ke Monitor Panel.

## Uji Coba

- **Skema 1:** buka Meja Registrasi → ketik nama peserta (mis. "Arbi", "Annisa", "Marcell") → Enter. Atau tab ID Manual: `FBF-2026-001`, `FBF-2026-005`, `FBF-2026-014`. Atau scan QR dari halaman **QR Peserta**.
- **Skema 2:** ketik nama yang tidak terdaftar, atau ID `FBF-2026-999` / `WALK-IN-01` → muncul form walk-in.
- QR per peserta berisi URL `checkin.html?id=FBF-2026-XXX` — bisa discan kamera meja registrasi maupun HP.

## Teknologi

HTML + CSS + JavaScript murni. QR generate: qrcodejs (CDN), QR scan: BarcodeDetector API + fallback jsQR (CDN). Deploy static di Vercel.

**Database: Supabase** (tabel `peserta`, project `supabase-global-inspire`) — data sinkron real-time lintas perangkat (polling 4–5 detik). Konfigurasi di `data.js` (`SUPABASE_URL` + publishable key; aman untuk sisi klien). Jika konfigurasi dikosongkan, otomatis fallback ke `localStorage` per-browser.
