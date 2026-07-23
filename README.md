# FaithToGrow EventCheck-in Dashboard

Dashboard registrasi & monitoring kehadiran untuk event **Future Builders Fellowship — Onboarding Day 2026** ([faithtogrow.org](https://faithtogrow.org/)).

## Fitur

- **Monitor Panel** (`index.html`) — rekap real-time: total terdaftar, sudah check-in, persentase kehadiran, breakdown per batch/kota, pencarian, filter, export CSV, tandai/batal hadir.
- **Meja Registrasi** (`checkin.html`) — alur scan barcode di meja registrasi.

## Workflow Registrasi

1. Peserta datang ke meja registrasi.
2. Petugas scan barcode e-ticket (atau ketik ID manual).
3. Sistem mengecek apakah data peserta sudah ada.
4. **Skema 1 — data sudah ada:** data registrasi tampil (sudah masuk duluan ke sistem), petugas tinggal **checklist hadir**.
5. **Skema 2 — data belum ada:** form input registrasi baru (walk-in), peserta langsung tercatat hadir dengan ID otomatis.
6. Semua perubahan tersinkron ke Monitor Panel.

## Demo

- Skema 1 (sudah terdaftar, belum hadir): `FTG-2026-004`, `FTG-2026-012`, `FTG-2026-029`
- Skema 2 (belum terdaftar): `FTG-2026-999`, `WALK-IN-01`

## Teknologi

HTML + CSS + JavaScript murni, data demo disimpan di `localStorage` (tanpa backend). Deploy sebagai static site di Vercel.
