# Aprompt — Premium Architectural Prompt Generator

**Aprompt** adalah aplikasi web generator parameter *prompt* arsitektur tingkat lanjut (*high-fidelity*) yang berjalan sepenuhnya di sisi klien (*client-side*) dengan latensi nol (*zero-latency*). Aplikasi ini didesain secara khusus untuk mempercepat alur kerja visualisasi arsitektur (seperti Midjourney, Stable Diffusion, atau DALL-E) dengan menggabungkan parameter desain secara dinamis dan semantis.

Mengusung standar visual **@[ui-ux-pro-max]**, Aprompt hadir dengan estetika monokromatik minimalis, fungsionalitas tinggi, dan tipografi presisi tinggi untuk menghadirkan pengalaman pengguna kelas premium layaknya aplikasi arsitektur profesional.

---

## ✨ Fitur Utama

- 📐 **Sistem 9 Gerbong (Carriage System)**: Membedah deskripsi visual arsitektur menjadi 9 lapis parameter logis:
  1. *Source Context* (Konteks gambar dasar)
  2. *Architectural Style* (Gaya arsitektur)
  3. *Building Typology* (Tipe/fungsi bangunan)
  4. *Camera Angle* (Sudut pandang/lensa kamera)
  5. *Materiality & Texture* (Tekstur material)
  6. *Environment & Atmosphere* (Suasana pencahayaan dan waktu)
  7. *Surrounding Context* (Konteks tapak lingkungan)
  8. *Human/Activity Scale* (Skala & aktivitas manusia)
  9. *Rendering Engine & Vibe* (Gaya keluaran mesin render)
- ⚡ **Zero-Latency Generator**: Pemrosesan string instan berbasis *state reactivity* murni tanpa memerlukan API eksternal atau pemrosesan sisi server (*server-side*).
- 💾 **Sinkronisasi LocalStorage Otomatis**: Menyimpan pilihan gerbong dan input kustom secara *real-time*. State aplikasi tetap aman meski halaman dimuat ulang (*refresh*).
- 🧼 **Sanitasi Kalimat Pintar**:
  - Menyaring gerbong yang kosong secara otomatis tanpa menyisakan spasi ganda atau tanda baca menggantung.
  - Membaca teks bebas (*Ketik Sendiri...*) dan menyaring tanda titik/koma berlebih di akhir kalimat secara otomatis agar alur grammar bahasa Inggris tetap sempurna.
  - Memformat keluaran dengan huruf kapital di awal kalimat dan diakhiri dengan titik tunggal yang tegas.
- 🎨 **Estetika Monokromatik & Ergonomis**:
  - Rasio pembagian layar ideal (45% Kiri untuk konfigurasi, 55% Kanan untuk pratinjau *prompt*).
  - Tipografi struktural menggunakan font geometris modern **Outfit** untuk judul dan font netral berdensitas tinggi **Inter** untuk teks kontrol.
  - Umpan balik visual mikro (<150ms) dengan bayangan (*drop-shadow*), efek layang (*hover scale*), dan indikasi sukses salin (*copy checklist effect*).

---

## 📂 Struktur Proyek (Directory Structure)

Aplikasi ini mematuhi struktur kode modular modern:

```bash
aprompt/
├── src/
│   ├── assets/          # Aset statis aplikasi
│   ├── components/      # UI Komponen Modular
│   │   ├── CarriageInput.jsx # Item input gerbong dengan dukungan input custom
│   │   ├── LeftPanel.jsx     # Panel input konfigurasi & tombol reset
│   │   └── RightPanel.jsx    # Panel live preview, generator logika, & copy button
│   ├── data/
│   │   └── schema.js    # Single Source of Truth untuk 9 Gerbong Prompt
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom React hook untuk sinkronisasi memori browser
│   ├── App.jsx          # Titik integrasi tata letak & Global State Hub
│   ├── index.css        # Impor Google Fonts & Utilitas Tailwind CSS v4
│   └── main.jsx         # Render dom React utama
├── index.html           # File entrypoint HTML
├── package.json         # Konfigurasi dependensi NPM
└── vite.config.js       # Konfigurasi Vite & Tailwind compiler
```

---

## 🛠️ Bagaimana Kode Bekerja (Under the Hood)

### 1. Data Schema (`src/data/schema.js`)
Setiap modul masukan diidentifikasi sebagai satu "Gerbong" yang berisi sekumpulan opsi siap pakai dan sebuah pola template string unik. Template menggunakan *placeholder* `[VALUE]` yang nantinya diganti oleh nilai opsi terpilih.
```javascript
{
  id: "style",
  title: "2. Architectural Style",
  template: "generate a [VALUE] ",
  options: [
    { id: "brutalist", label: "Brutalist", value: "brutalist" },
    { id: "custom", label: "Ketik Sendiri...", value: "custom" }
  ]
}
```

### 2. State Sinkronisasi Lokal (`src/hooks/useLocalStorage.js`)
*Custom hook* ini membungkus state standar React `useState`. Saat nilai berubah, hook ini secara reaktif memperbarui state aplikasi dan sekaligus menulis representasi JSON-nya ke memori peramban via `window.localStorage`. Saat aplikasi pertama kali dimuat, hook membaca memori lokal ini untuk mengembalikan konfigurasi terakhir pengguna secara otomatis.

### 3. Logika Penghubung String (`src/components/RightPanel.jsx`)
Penyusunan prompt arsitektur dilakukan di dalam hook efek (`useEffect`) yang memantau perubahan pada pilihan (`selections`) dan teks manual (`customTexts`):
- Loop iteratif dijalankan pada berkas skema.
- Jika pengguna memilih opsi standar, nilai opsi langsung dimasukkan ke dalam template.
- Jika pengguna memilih opsi `"custom"`, teks input bebas disaring menggunakan ekspresi reguler `/[.,;]+$/` untuk membuang tanda baca ganda di akhir ketikan.
- Kumpulan template yang terisi digabung dengan spasi murni `.join(" ")`.
- Hasil akhirnya di-normalisasi agar spasi ganda dihilangkan `.replace(/\s+/g, " ")` dan disesuaikan kapitalisasinya.

### 4. Reset Instan (`src/App.jsx`)
Aksi penghapusan memori diimplementasikan secara terpusat. Ketika fungsi `handleReset` dipicu dari panel kiri, aplikasi akan menghapus kunci lokal secara eksplisit dari `localStorage` dan mereset memori state React kembali ke objek kosong `{}`. Hal ini memicu pembaruan antarmuka secara instan tanpa memerlukan muat ulang halaman (*no-refresh state update*).

---

## 🚀 Memulai Aplikasi Secara Lokal

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18+) di komputer Anda.

### Langkah-langkah
1. Clone atau buka direktori proyek ini.
2. Jalankan perintah instalasi dependensi di terminal Anda:
   ```bash
   npm install
   ```
3. Mulai server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka alamat lokal yang tertera di layar terminal (biasanya `http://localhost:5173`) di browser Anda.

### Membuat Production Build
Untuk menguji performa optimal dan membuat file siap unggah ke *hosting*:
```bash
npm run build
```
File hasil kompilasi yang terkompresi secara optimal akan berada di dalam folder `dist/`.
