let transaksi =
    JSON.parse(localStorage.getItem("transaksiPulsa")) || [];


function rupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
}


// HITUNG UNTUNG
function hitungUntung() {

    const modal =
        Number(document.getElementById("modal").value);

    const hargaJual =
        Number(document.getElementById("hargaJual").value);

    const untung = hargaJual - modal;

    if (modal > 0 && hargaJual > 0) {
        document.getElementById("untung").value =
            rupiah(untung);
    } else {
        document.getElementById("untung").value = "";
    }
}


// TAMBAH TRANSAKSI
function tambahTransaksi() {

    const nomor =
        document.getElementById("nomor").value.trim();

    const operator =
        document.getElementById("operator").value;

    const nominal =
        Number(document.getElementById("nominal").value);

    const modal =
        Number(document.getElementById("modal").value);

    const hargaJual =
        Number(document.getElementById("hargaJual").value);

    if (
        nomor === "" ||
        modal <= 0 ||
        hargaJual <= 0
    ) {
        alert("⚠️ Lengkapi data transaksi terlebih dahulu!");
        return;
    }

    const untung = hargaJual - modal;

    const data = {
        nomor,
        operator,
        nominal,
        modal,
        hargaJual,
        untung,
        waktu: new Date().toLocaleString("id-ID")
    };

    transaksi.push(data);

    simpanData();

    tampilkanTransaksi();

    document.getElementById("nomor").value = "";
    document.getElementById("modal").value = "";
    document.getElementById("hargaJual").value = "";
    document.getElementById("untung").value = "";

    alert("✅ Transaksi berhasil disimpan!");
}


// SIMPAN
function simpanData() {

    localStorage.setItem(
        "transaksiPulsa",
        JSON.stringify(transaksi)
    );
}


// TAMPILKAN
function tampilkanTransaksi() {

    const riwayat =
        document.getElementById("riwayat");

    const kosong =
        document.getElementById("kosong");

    riwayat.innerHTML = "";

    let totalModal = 0;
    let totalJual = 0;
    let totalUntung = 0;

    if (transaksi.length === 0) {

        kosong.style.display = "block";

    } else {

        kosong.style.display = "none";
    }

    transaksi.forEach((data, index) => {

        totalModal += data.modal;
        totalJual += data.hargaJual;
        totalUntung += data.untung;

        riwayat.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${data.nomor}</td>

            <td>${data.operator}</td>

            <td>${rupiah(data.nominal)}</td>

            <td>${rupiah(data.modal)}</td>

            <td>${rupiah(data.hargaJual)}</td>

            <td>
                <b>${rupiah(data.untung)}</b>
            </td>

            <td>${data.waktu}</td>

            <td>
                <button
                    class="delete-one"
                    onclick="hapusTransaksi(${index})">
                    ❌
                </button>
            </td>

        </tr>
        `;
    });

    document.getElementById("totalTransaksi")
        .textContent = transaksi.length;

    document.getElementById("totalModal")
        .textContent = rupiah(totalModal);

    document.getElementById("totalJual")
        .textContent = rupiah(totalJual);

    document.getElementById("totalUntung")
        .textContent = rupiah(totalUntung);
}


// HAPUS SATU
function hapusTransaksi(index) {

    if (confirm("Hapus transaksi ini?")) {

        transaksi.splice(index, 1);

        simpanData();

        tampilkanTransaksi();
    }
}


// HAPUS SEMUA
function hapusSemua() {

    if (transaksi.length === 0) {
        alert("Belum ada transaksi.");
        return;
    }

    if (confirm("Yakin ingin menghapus semua transaksi?")) {

        transaksi = [];

        localStorage.removeItem("transaksiPulsa");

        tampilkanTransaksi();
    }
}


// EXCEL
function downloadExcel() {

    if (transaksi.length === 0) {
        alert("Belum ada transaksi untuk di-download.");
        return;
    }

    const dataExcel = transaksi.map((data, index) => ({
        No: index + 1,
        Nomor: data.nomor,
        Operator: data.operator,
        Nominal: data.nominal,
        Modal: data.modal,
        "Harga Jual": data.hargaJual,
        Untung: data.untung,
        Waktu: data.waktu
    }));

    const worksheet =
        XLSX.utils.json_to_sheet(dataExcel);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Transaksi"
    );

    XLSX.writeFile(
        workbook,
        "RAMBUTSS_PULSA.xlsx"
    );
}


// JALANKAN SAAT WEB DIBUKA
tampilkanTransaksi();
