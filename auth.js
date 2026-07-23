/* ============================================================
   Gate login LO (Supabase Auth) untuk halaman panitia.
   Muat SETELAH supabase-js dan data.js, di <head> halaman panitia.
   Halaman siswa (hadir.html) TIDAK memakai file ini.
   ============================================================ */

document.documentElement.style.visibility = "hidden";

(async () => {
  const session = await ftgSession();
  if (!session) {
    const page = location.pathname.split("/").pop() || "index.html";
    location.replace("login.html?next=" + encodeURIComponent(page));
    return;
  }
  document.documentElement.style.visibility = "";
  // tombol Keluar LO di topbar
  const addLogout = () => {
    const nav = document.querySelector(".topnav");
    if (!nav) return;
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost";
    btn.textContent = "⎋ Keluar LO";
    btn.onclick = ftgSignOut;
    nav.appendChild(btn);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLogout);
  else addLogout();
})();
