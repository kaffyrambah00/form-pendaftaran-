const form = document.querySelector("#formDaftar");
const nama = document.querySelector("#nama");
const email = document.querySelector("#email");
const whatsapp = document.querySelector("#whatsapp");
const tanggal = document.querySelector("#tanggal");
const daftar = document.querySelector("#daftar");
const hariIni = document.querySelector("#hariIni");
const status = document.querySelector("#status");

const errors = {
  nama: document.querySelector("#errorNama"),
  email: document.querySelector("#errorEmail"),
  whatsapp: document.querySelector("#errorWA"),
  tanggal: document.querySelector("#errorTanggal"),
};

const pad = (number) => String(number).padStart(2, "0");

function tanggalLokal(date = new Date()) {
  const tahun = date.getFullYear();
  const bulan = pad(date.getMonth() + 1);
  const hari = pad(date.getDate());

  return `${tahun}-${bulan}-${hari}`;
}

tanggal.min = tanggalLokal();
tanggal.value = tanggalLokal();

hariIni.addEventListener("click", () => {
  tanggal.value = tanggalLokal();
  errors.tanggal.textContent = "";
  tanggal.removeAttribute("aria-invalid");
});

function tampilkanError(field, message) {
  errors[field.name].textContent = message;

  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function validasi() {
  const jumlahDigitWhatsApp = whatsapp.value.replace(/\D/g, "").length;

  const pemeriksaan = [
    [nama, nama.value.trim() ? "" : "Masukkan nama lengkap."],
    [
      email,
      !email.value.trim()
        ? "Masukkan alamat email."
        : email.validity.typeMismatch
          ? "Masukkan alamat email yang valid."
          : "",
    ],
    [
      whatsapp,
      !whatsapp.value.trim()
        ? "Masukkan nomor WhatsApp."
        : !/^[+\d\s()-]+$/.test(whatsapp.value.trim()) ||
            jumlahDigitWhatsApp < 10 ||
            jumlahDigitWhatsApp > 15
          ? "Nomor WhatsApp harus terdiri dari 10–15 digit."
          : "",
    ],
    [
      tanggal,
      !tanggal.value
        ? "Pilih tanggal kehadiran."
        : tanggal.value < tanggal.min
          ? "Tanggal kehadiran tidak boleh sebelum hari ini."
          : "",
    ],
  ];

  let fieldPertamaDenganError = null;

  for (const [field, message] of pemeriksaan) {
    tampilkanError(field, message);

    if (message && !fieldPertamaDenganError) {
      fieldPertamaDenganError = field;
    }
  }

  if (fieldPertamaDenganError) {
    fieldPertamaDenganError.focus();
    status.textContent = "Periksa kembali data yang ditandai.";
    return false;
  }

  return true;
}

for (const field of [nama, email, whatsapp, tanggal]) {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      validasi();
    }
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  if (!validasi()) {
    return;
  }

  const item = document.createElement("li");
  const namaPeserta = document.createElement("strong");
  const detail = document.createElement("span");

  namaPeserta.textContent = nama.value.trim();

  const tanggalFormat = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${tanggal.value}T00:00:00Z`));

  detail.textContent =
    `${email.value.trim()} · WhatsApp ${whatsapp.value.trim()} · Hadir ${tanggalFormat}`;

  item.append(namaPeserta, detail);
  daftar.append(item);

  document.querySelector("#kosong").hidden = true;
  document.querySelector("#jumlah").textContent =
    `(${daftar.children.length})`;

  status.textContent =
    `Pendaftaran ${nama.value.trim()} berhasil ditambahkan.`;

  form.reset();
  tanggal.value = tanggalLokal();
  nama.focus();
});