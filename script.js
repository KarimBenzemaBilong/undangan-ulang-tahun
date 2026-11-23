// =========================
// KONFIGURASI ACARA
// =========================

const eventConfig = {
  title: "Ulang Tahun Karim",

  dateTime: "2027-04-28T08:00:00+07:00",
  durationHours: 3,

  venue: "Rumah Karim",
  address: "Tangerang Selatan, Banten",
  timeZone: "Asia/Jakarta",

  // Amplop Digital
  bankName: "BCA",
  accountNumber: "0000000000",
  accountHolder: "Karim Benzema Bilong",

  giftAddress: "00000000",

  // RSVP WhatsApp
  // Gunakan format kode negara tanpa tanda +
  // Contoh format: 6281234567890
  rsvpWhatsApp: "62895410797274",
};

// =========================
// GOOGLE MAPS
// =========================

const locationText = `${eventConfig.venue}, ${eventConfig.address}`;

// Menampilkan Google Maps
const mapFrame = document.getElementById("event-map");

mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(locationText)}&output=embed`;

// Menampilkan detail lokasi
document.getElementById("location-venue").textContent = eventConfig.venue;

document.getElementById("location-address").textContent = eventConfig.address;

// Membuat tombol petunjuk arah
const directionLink = document.getElementById("direction-link");

const directionsUrl = new URL("https://maps.app.goo.gl/U23HLDcfKSUFxM5U9");

directionsUrl.searchParams.set("api", "1");
directionsUrl.searchParams.set("destination", locationText);

directionLink.href = directionsUrl.toString();

// =========================
// AMPLOP DIGITAL
// =========================

// Menampilkan informasi rekening
document.getElementById("gift-bank").textContent = eventConfig.bankName;

document.getElementById("gift-account-number").textContent =
  eventConfig.accountNumber;

document.getElementById("gift-account-holder").textContent =
  eventConfig.accountHolder;

document.getElementById("gift-address").textContent = eventConfig.giftAddress;

// =========================
// TOAST NOTIFICATION
// =========================

let toastTimer;

function showToast(message, type = "success") {
  const toast = document.getElementById("copy-toast");

  toast.textContent = message;

  toast.classList.remove("error");

  if (type === "error") {
    toast.classList.add("error");
  }

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// =========================
// COPY TO CLIPBOARD
// =========================

// Fallback jika Clipboard API tidak tersedia
function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);

  textArea.select();

  const copied = document.execCommand("copy");

  textArea.remove();

  if (!copied) {
    throw new Error("Gagal menyalin teks");
  }
}

// Fungsi utama untuk menyalin teks
async function copyText(text, successMessage) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopyText(text);
    }

    showToast(successMessage);
  } catch (error) {
    showToast("Gagal menyalin. Silakan salin secara manual.", "error");
  }
}

// Salin nomor rekening
document.getElementById("copy-account").addEventListener("click", () => {
  const account = eventConfig.accountNumber;

  if (!account || account.startsWith("GANTI_")) {
    showToast("Isi nomor rekening terlebih dahulu.", "error");
    return;
  }

  copyText(account, "Nomor rekening berhasil disalin!");
});

// Salin alamat kado
document.getElementById("copy-gift-address").addEventListener("click", () => {
  const address = eventConfig.giftAddress;

  if (!address || address.startsWith("GANTI_")) {
    showToast("Isi alamat kado terlebih dahulu.", "error");
    return;
  }

  copyText(address, "Alamat kado berhasil disalin!");
});

// =========================
// DATA WAKTU ACARA
// =========================

const eventDate = new Date(eventConfig.dateTime);

const eventEnd = new Date(
  eventDate.getTime() + eventConfig.durationHours * 60 * 60 * 1000,
);

// =========================
// FORMAT TANGGAL DAN WAKTU
// =========================

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: eventConfig.timeZone,
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: eventConfig.timeZone,
});

document.getElementById("event-date").textContent =
  dateFormatter.format(eventDate);

document.getElementById("event-time").textContent =
  timeFormatter.format(eventDate) + " WIB";

document.getElementById("event-location").textContent = eventConfig.venue;

document.getElementById("event-address").textContent = eventConfig.address;

// =========================
// COUNTDOWN TIMER
// =========================

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate.getTime() - now;

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const status = document.getElementById("countdown-status");

  // Acara sudah dimulai
  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";

    status.textContent =
      now < eventEnd.getTime()
        ? "Acara sedang berlangsung!"
        : "Acara telah selesai!";

    return;
  }

  // Perhitungan waktu
  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const m = Math.floor((distance / (1000 * 60)) % 60);
  const s = Math.floor((distance / 1000) % 60);

  // Tampilkan hasil
  days.textContent = String(d).padStart(2, "0");
  hours.textContent = String(h).padStart(2, "0");
  minutes.textContent = String(m).padStart(2, "0");
  seconds.textContent = String(s).padStart(2, "0");

  status.textContent = "Bersiaplah untuk hari spesial!";
}

// Jalankan pertama kali
updateCountdown();

// Perbarui setiap satu detik
setInterval(updateCountdown, 1000);

// =========================
// GOOGLE CALENDAR
// =========================

function formatCalendarDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

const googleCalendar = document.getElementById("google-calendar");

const calendarUrl = new URL("https://calendar.google.com/calendar/render");

calendarUrl.search = new URLSearchParams({
  action: "TEMPLATE",
  text: eventConfig.title,
  dates: formatCalendarDate(eventDate) + "/" + formatCalendarDate(eventEnd),
  details: "Undangan ulang tahun: " + eventConfig.title,
  location: eventConfig.venue + ", " + eventConfig.address,
  ctz: eventConfig.timeZone,
});

googleCalendar.href = calendarUrl.toString();

// =========================
// UNDUH FILE ICS
// =========================

function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

document.getElementById("download-ics").addEventListener("click", () => {
  const now = formatCalendarDate(new Date());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Ulang Tahun//ID",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:undangan-ulang-tahun-karim@example.com",
    "DTSTAMP:" + now,
    "DTSTART:" + formatCalendarDate(eventDate),
    "DTEND:" + formatCalendarDate(eventEnd),
    "SUMMARY:" + escapeICS(eventConfig.title),
    "DESCRIPTION:" + escapeICS("Undangan ulang tahun"),
    "LOCATION:" + escapeICS(eventConfig.venue + ", " + eventConfig.address),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "undangan-ulang-tahun.ics";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

/* =========================
   GALLERY SCROLL REVEAL
========================= */

// Ambil semua elemen galeri
const galleryElements = document.querySelectorAll(".gallery-reveal");

// Periksa dukungan animasi browser
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// Jika pengguna tidak memilih reduced motion
if (
  galleryElements.length > 0 &&
  !prefersReducedMotion &&
  "IntersectionObserver" in window
) {
  // Aktifkan animasi
  document.documentElement.classList.add("js-reveal-ready");

  // Buat observer
  const galleryObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        // Periksa apakah elemen terlihat
        if (entry.isIntersecting) {
          // Tampilkan elemen
          entry.target.classList.add("is-visible");

          // Berhenti mengamati elemen tersebut
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Amati setiap elemen galeri
  galleryElements.forEach((element) => {
    galleryObserver.observe(element);
  });
} else {
  // Jika tidak didukung, tampilkan semua elemen
  galleryElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

/* =========================
   RSVP DAN BUKU TAMU
========================= */

// Nama penyimpanan localStorage
const GUESTBOOK_KEY = "birthday_guestbook";

// Ambil elemen HTML
const rsvpForm = document.getElementById("rsvp-form");

const guestbookList = document.getElementById("guestbook-list");

const guestbookCount = document.getElementById("guestbook-count");

const rsvpFeedback = document.getElementById("rsvp-feedback");

// =========================
// AMBIL DATA
// =========================

function getGuestbookData() {
  try {
    const storedData = localStorage.getItem(GUESTBOOK_KEY);

    // Jika belum ada data
    if (!storedData) {
      return [];
    }

    const data = JSON.parse(storedData);

    // Pastikan data berupa array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal membaca buku tamu:", error);

    return [];
  }
}

// =========================
// SIMPAN DATA
// =========================

function saveGuestbookData(data) {
  try {
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(data));

    return true;
  } catch (error) {
    console.error("Gagal menyimpan buku tamu:", error);

    return false;
  }
}

// =========================
// TAMPILKAN BUKU TAMU
// =========================

function displayGuestbook() {
  // Ambil semua data
  const guests = getGuestbookData();

  // Kosongkan daftar sebelumnya
  guestbookList.replaceChildren();

  // Perbarui jumlah ucapan
  guestbookCount.textContent = `${guests.length} Ucapan`;

  // Jika belum ada ucapan
  if (guests.length === 0) {
    const emptyMessage = document.createElement("div");

    emptyMessage.className = "guestbook-empty";

    emptyMessage.textContent =
      "Belum ada ucapan. Jadilah yang pertama memberikan doa!";

    guestbookList.appendChild(emptyMessage);

    return;
  }

  // Tampilkan setiap data tamu
  guests.forEach((guest) => {
    // Buat kartu
    const card = document.createElement("article");

    card.className = "guestbook-item";

    // Bagian header
    const header = document.createElement("div");

    header.className = "guestbook-item-header";

    // Nama tamu
    const name = document.createElement("h3");

    name.className = "guestbook-name";

    name.textContent = guest.name;

    // Status kehadiran
    const status = document.createElement("span");

    status.className = "attendance-badge";

    status.classList.add(guest.attendance === "Hadir" ? "present" : "absent");

    status.textContent = guest.attendance;

    // Gabungkan header
    header.append(name, status);

    // Ucapan tamu
    const message = document.createElement("p");

    message.className = "guestbook-message";

    message.textContent = guest.message;

    // Tanggal ucapan
    const date = document.createElement("time");

    date.className = "guestbook-date";

    const dateObject = new Date(guest.createdAt);

    date.dateTime = dateObject.toISOString();

    date.textContent = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(dateObject);

    // Gabungkan seluruh kartu
    card.append(header, message, date);

    // Masukkan ke daftar buku tamu
    guestbookList.appendChild(card);
  });
}

// =========================
// KIRIM RSVP
// =========================

rsvpForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Ambil nilai input
  const guestName = document.getElementById("guest-name").value.trim();

  const attendance = document.getElementById("attendance").value;

  const guestMessage = document.getElementById("guest-message").value.trim();

  // Validasi
  if (!guestName || !attendance || !guestMessage) {
    rsvpFeedback.textContent = "Mohon lengkapi semua data terlebih dahulu.";

    return;
  }

  // Buat objek data tamu
  const newGuest = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,

    name: guestName,

    attendance: attendance,

    message: guestMessage,

    createdAt: new Date().toISOString(),
  };

  // Ambil data sebelumnya
  const guests = getGuestbookData();

  // Tambahkan data terbaru di urutan pertama
  guests.unshift(newGuest);

  // Simpan ke localStorage
  const saved = saveGuestbookData(guests);

  // Periksa keberhasilan penyimpanan
  if (!saved) {
    rsvpFeedback.textContent =
      "Data gagal disimpan. Periksa penyimpanan browser kamu.";

    return;
  }

  // Perbarui daftar buku tamu
  displayGuestbook();

  // Kosongkan formulir
  rsvpForm.reset();

  // Tampilkan notifikasi
  rsvpFeedback.textContent = "Terima kasih! Ucapan berhasil dikirim.";
});

// =========================
// MUAT DATA SAAT HALAMAN DIBUKA
// =========================

displayGuestbook();

// Sinkronisasi jika localStorage berubah di tab lain
window.addEventListener("storage", function (event) {
  if (event.key === GUESTBOOK_KEY) {
    displayGuestbook();
  }
});

/* =========================
   BACKGROUND MUSIC CONTROL
========================= */

// Ambil elemen HTML
const backgroundMusic = document.getElementById("background-music");

const musicToggle = document.getElementById("music-toggle");

const musicIcon = document.getElementById("music-icon");

const musicLabel = document.getElementById("music-label");

const musicStatus = document.getElementById("music-status");

// =========================
// UPDATE TAMPILAN TOMBOL
// =========================

function updateMusicButton(isPlaying) {
  if (isPlaying) {
    // Kondisi musik aktif
    musicIcon.textContent = "Ⅱ";

    musicLabel.textContent = "Jeda Musik";

    musicToggle.classList.add("is-playing");

    musicToggle.setAttribute("aria-label", "Jeda musik latar");

    musicToggle.setAttribute("aria-pressed", "true");

    musicToggle.title = "Jeda musik";
  } else {
    // Kondisi musik berhenti
    musicIcon.textContent = "♫";

    musicLabel.textContent = "Putar Musik";

    musicToggle.classList.remove("is-playing");

    musicToggle.setAttribute("aria-label", "Putar musik latar");

    musicToggle.setAttribute("aria-pressed", "false");

    musicToggle.title = "Putar musik";
  }
}

// =========================
// TOMBOL PLAY / PAUSE
// =========================

musicToggle.addEventListener("click", async function () {
  if (backgroundMusic.paused) {
    try {
      // Memutar musik
      await backgroundMusic.play();

      updateMusicButton(true);

      musicStatus.textContent = "Musik latar sedang diputar.";
    } catch (error) {
      console.error("Gagal memutar musik:", error);

      updateMusicButton(false);

      musicStatus.textContent = "Musik gagal diputar. Periksa file audio.";
    }
  } else {
    // Menjeda musik
    backgroundMusic.pause();

    updateMusicButton(false);

    musicStatus.textContent = "Musik latar dijeda.";
  }
});

// =========================
// SINKRONISASI STATUS AUDIO
// =========================

backgroundMusic.addEventListener("play", function () {
  updateMusicButton(true);
});

backgroundMusic.addEventListener("pause", function () {
  updateMusicButton(false);
});

backgroundMusic.addEventListener("ended", function () {
  updateMusicButton(false);
});

backgroundMusic.addEventListener("error", function () {
  updateMusicButton(false);

  musicStatus.textContent = "File musik tidak dapat ditemukan atau diputar.";
});

// Kondisi awal: musik belum diputar
updateMusicButton(false);
