// Inisialisasi ikon feather
feather.replace();

// ============ NAVBAR TOGGLE ============
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerMenu = document.querySelector("#hamburger-menu");

hamburgerMenu.onclick = (e) => {
  e.preventDefault();
  navbarNav.classList.toggle("active");
};

document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// ============ GOALS DATA (dari Gist) ============
const gistUrl =
  "https://gist.githubusercontent.com/fanhdt/c79a84879456e2832d88bf3e1020895a/raw/0c38afd136e1176bdc6de54e06ee3a1bd5f6049d/course.json";

async function getGoals() {
  try {
    const response = await fetch(gistUrl);
    if (!response.ok) throw new Error("Gagal mengambil data");
    const goals = await response.json();
    displayGoals(goals);
  } catch (error) {
    console.error("Error:", error);
    // Fallback data lokal jika fetch gagal
    displayGoals(fallbackGoals);
  }
}

// Data fallback lokal (jika fetch gagal / offline)
const fallbackGoals = [
  {
    icon: "🏠",
    category: "Tempat Tinggal",
    title: "Ngekos / Sewa Kamar",
    description: "Simulasi anggaran sewa kos bulanan yang realistis.",
    mentor: "FundFlow",
    price: "Rp600.000",
    slug: "ngekos",
  },
  {
    icon: "🍔",
    category: "Kebutuhan Harian",
    title: "Bahan Makanan",
    description: "Atur anggaran makan harian agar tetap hemat.",
    mentor: "FundFlow",
    price: "Rp400.000",
    slug: "makanan",
  },
  {
    icon: "🚗",
    category: "Transportasi",
    title: "Kendaraan",
    description: "Simulasi biaya transportasi harian dan bulanan.",
    mentor: "FundFlow",
    price: "Rp100.000",
    slug: "kendaraan",
  },
  {
    icon: "🎓",
    category: "Pendidikan",
    title: "Biaya Pendidikan",
    description: "Rencanakan biaya kuliah & kursus tambahan.",
    mentor: "FundFlow",
    price: "Rp500.000",
    slug: "pendidikan",
  },
  {
    icon: "🛡️",
    category: "Darurat",
    title: "Tabungan Darurat",
    description: "Siapkan dana darurat minimal 3x pengeluaran.",
    mentor: "FundFlow",
    price: "Rp1.000.000",
    slug: "darurat",
  },
  {
    icon: "🏡",
    category: "Impian",
    title: "Beli Rumah",
    description: "Simulasi menabung untuk beli rumah di masa depan.",
    mentor: "FundFlow",
    price: "Rp300.000.000",
    slug: "rumah",
  },
];

function displayGoals(goals) {
  const goalList = document.querySelector("#goal-list");
  if (!goalList) return;
  goalList.innerHTML = "";

  goals.forEach((goal) => {
    goalList.innerHTML += `
      <div class="goal-card">
        <div class="icon">${goal.icon || "💰"}</div>
        <div class="goal-card-content">
          <span>${goal.category || "Umum"}</span>
          <h3>${goal.title}</h3>
          <p>${goal.description}</p>
          <small>Mentor: ${goal.mentor || "FundFlow"}</small>
          <strong>${goal.price || "-"}</strong>
          <a href="goal.html?slug=${goal.slug}">Mulai Simulasi</a>
        </div>
      </div>
    `;
  });
}

// ============ SIMULASI KEUANGAN ============
const keuangan = {
  pemasukan: 1500000,
  pengeluaran: {
    menyewa: 600000,
    makanan: 400000,
    kendaraan: 100000,
  },
  keinginan: {
    makanLuar: 0,
    hiburan: 0,
    cicilan: 0,
  },
};

function hitungKeuangan() {
  const totalPengeluaran =
    keuangan.pengeluaran.menyewa +
    keuangan.pengeluaran.makanan +
    keuangan.pengeluaran.kendaraan +
    keuangan.keinginan.makanLuar +
    keuangan.keinginan.hiburan +
    keuangan.keinginan.cicilan;

  const saldoAkhir = keuangan.pemasukan - totalPengeluaran;
  const hemat = saldoAkhir > 0 ? saldoAkhir : 0;
  const rasio = (totalPengeluaran / keuangan.pemasukan) * 100;

  // Update DOM
  const elSaldo = document.querySelector("#saldoAkhir");
  const elMasuk = document.querySelector("#totalPemasukan");
  const elKeluar = document.querySelector("#totalPengeluaran");
  const elHemat = document.querySelector("#totalHemat");
  const elBatas = document.querySelector("#batasHarian");
  const gaugeFill = document.querySelector("#gaugeFill");
  const statusKeuangan = document.querySelector("#statusKeuangan");

  if (elSaldo) elSaldo.textContent = formatRupiah(saldoAkhir);
  if (elMasuk) elMasuk.textContent = formatRupiah(keuangan.pemasukan);
  if (elKeluar) elKeluar.textContent = formatRupiah(totalPengeluaran);
  if (elHemat) elHemat.textContent = formatRupiah(hemat);

  // Batas harian (asumsi 30 hari)
  const batasHarian = saldoAkhir / 30;
  if (elBatas)
    elBatas.textContent =
      batasHarian > 0 ? formatRupiah(batasHarian) : "TIDAK TERSEDIA";

  // Gauge status
  if (gaugeFill) {
    gaugeFill.style.width = Math.min(rasio, 100) + "%";
  }

  if (statusKeuangan) {
    if (rasio < 50) {
      statusKeuangan.textContent = "Sangat Sehat 💚";
      statusKeuangan.style.color = "#2ecc71";
    } else if (rasio < 75) {
      statusKeuangan.textContent = "Sehat 💛";
      statusKeuangan.style.color = "#f39c12";
    } else if (rasio < 100) {
      statusKeuangan.textContent = "Waspada 🧡";
      statusKeuangan.style.color = "#e67e22";
    } else {
      statusKeuangan.textContent = "Bahaya ❤️";
      statusKeuangan.style.color = "#e74c3c";
    }
  }
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID") + ",00";
}

// ============ CHART SEDERHANA (Canvas) ============
function gambarGrafik() {
  const canvas = document.querySelector("#grafikPengeluaran");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = 200;

  const data = [
    keuangan.pengeluaran.menyewa,
    keuangan.pengeluaran.makanan,
    keuangan.pengeluaran.kendaraan,
  ];
  const labels = ["Sewa", "Makan", "Transport"];
  const maxVal = Math.max(...data);
  const barWidth = canvas.width / data.length - 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  data.forEach((val, i) => {
    const barHeight = (val / maxVal) * 150;
    const x = i * (barWidth + 20) + 20;
    const y = canvas.height - barHeight - 20;

    // Gradient bar
    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
    gradient.addColorStop(0, "#1abc9c");
    gradient.addColorStop(1, "#2ecc71");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Label
    ctx.fillStyle = "#b0b0b0";
    ctx.font = "12px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], x + barWidth / 2, canvas.height - 5);

    // Value
    ctx.fillStyle = "#fff";
    ctx.fillText("Rp" + (val / 1000).toFixed(0) + "k", x + barWidth / 2, y - 5);
  });
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  getGoals();
  hitungKeuangan();
  gambarGrafik();

  // Redraw chart saat resize
  window.addEventListener("resize", gambarGrafik);
});