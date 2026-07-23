/* ============================================================
   Gate login LO untuk halaman panitia (index, checkin, tickets).
   Halaman siswa (hadir.html) TIDAK memakai file ini.

   >>> Ganti email & password LO di sini <<<
   Catatan: ini proteksi sisi-klien untuk kebutuhan event
   (bukan keamanan tingkat server).
   ============================================================ */

const LO_EMAIL = "lo@faithtogrow.org";
const LO_PASS = "FBF2026-LO";

const FTG_AUTH_KEY = "fbf_lo_auth";

function ftgIsAuthed() {
  return sessionStorage.getItem(FTG_AUTH_KEY) === "1";
}

function ftgLogin(email, pass) {
  if (email.trim().toLowerCase() === LO_EMAIL.toLowerCase() && pass === LO_PASS) {
    sessionStorage.setItem(FTG_AUTH_KEY, "1");
    return true;
  }
  return false;
}

function ftgLogout() {
  sessionStorage.removeItem(FTG_AUTH_KEY);
  location.href = "login.html";
}

/* Redirect ke login jika belum auth (dipanggil dari <head> halaman panitia) */
if (!location.pathname.endsWith("login.html") && !ftgIsAuthed()) {
  const page = location.pathname.split("/").pop() || "index.html";
  location.replace("login.html?next=" + encodeURIComponent(page));
}

/* Sisipkan tombol Keluar LO di topbar setelah halaman termuat */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".topnav");
  if (nav && ftgIsAuthed()) {
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost";
    btn.textContent = "⎋ Keluar LO";
    btn.onclick = ftgLogout;
    nav.appendChild(btn);
  }
});
