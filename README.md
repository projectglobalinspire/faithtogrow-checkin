# FaithToGrow EventCheck-in Dashboard

Dashboard registrasi & monitoring kehadiran **Future Builders Fellowship 2026 — Onboarding Day** ([faithtogrow.org](https://faithtogrow.org/)). Data peserta diimpor dari file pendaftaran resmi (xlsx).

## Halaman

| Halaman | Fungsi |
|---|---|
| `index.html` | **Monitor Panel** — rekap real-time: total terdaftar, sudah check-in, persentase, breakdown per provinsi, pencarian, filter, export CSV, tandai/batal hadir |
| `checkin.html` | **Meja Registrasi** — check-in via input nama (autocomplete + Enter), scan QR pakai kamera, atau ID manual |
| `tickets.html` | **QR Generator** — QR event (self check-in) + e-ticket QR per peserta, siap print |

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

HTML + CSS + JavaScript murni. QR generate: qrcodejs (CDN), QR scan: BarcodeDetector API + fallback jsQR (CDN). Data demo di `localStorage` (tanpa backend). Deploy static di Vercel.
