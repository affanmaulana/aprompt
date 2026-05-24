# Aprompt — Premium Architectural Prompt Generator

**Aprompt** adalah aplikasi generator parameter *prompt* arsitektur tingkat lanjut (*high-fidelity*) yang berjalan sepenuhnya di sisi klien (*client-side*) dengan latensi nol (*zero-latency*). Aplikasi ini didesain khusus untuk mempercepat dan meningkatkan kualitas alur kerja visualisasi arsitektur (seperti Midjourney, Stable Diffusion, atau DALL-E) ke standar studio visualisasi kelas dunia dengan menggabungkan parameter desain secara dinamis, semantis, dan cerdas.

Mengusung standar visual **@[ui-ux-pro-max]**, Aprompt hadir dengan estetika monokromatik editorial yang minimalis, fungsionalitas tinggi, penataan ruang putih yang luas, serta kegunaan presisi tinggi untuk menghadirkan pengalaman pengguna profesional terbaik layaknya alat desain arsitektur papan atas.

---

## ✨ Fitur Utama v2

### 1. 📐 Dynamic Carriage Architecture (Arsitektur Gerbong Dinamis)
Sistem ini telah dievolusikan dari arsitektur 9-gerbong statis menjadi **Unlimited Dynamic Carriage Architecture**. Setiap modul parameter diinjeksikan secara modular langsung melalui file skema. Ketika modul baru ditambahkan ke skema:
- Antarmuka pengguna (UI) terbentuk secara otomatis.
- Penyimpanan lokal (*localStorage*) terintegrasi secara otomatis.
- Sanitasi kalimat berjalan secara dinamis.
- Pencarian dan penyusunan kata bekerja secara otomatis tanpa perlu mengubah logika komponen utama UI.

### 2. 🧠 Semantic Prompt Assembly Engine (Mesin Penyusun Prompt Semantis)
Mesin penyusunan *prompt* (v2) tidak lagi sekadar melakukan penggabungan string statis. Mesin ini mematuhi konfigurasi urutan semantis skema (*schema-driven chronological sorting*) untuk membagi instruksi ke dalam beberapa struktur kalimat profesional yang rapi:
- **Role**: Mengarahkan model AI untuk bertindak sebagai CGI Director profesional berspesialisasi dalam preservasi arsitektur.
- **Subject & Geometry**: Memadukan tipe bangunan, detail struktur, materialitas, serta lokasi tapak.
- **Camera & Composition**: Menggabungkan kontrol sudut pandang, lensa tilt-shift kompensasi distorsi keystone, dan pembingkaian elemen corner.
- **Environment & Atmosphere**: Menyatukan pencahayaan (*lighting*) dan kondisi cuaca (*weather*).
- **Narrative**: Menampilkan aktivitas manusia, kendaraan, skala, serta cerita di balik gambar.
- **Rendering & Output**: Mengatur kualitas render komersial 4K/8K, *post-processing* filmis, dan target publikasi (seperti Archdaily atau Dezeen).

### 3. 🛡️ Strict Geometry Preservation (Preservasi Geometri Ketat)
Mesin penyusun *prompt* menyuntikkan instruksi preservasi geometri tingkat lanjut secara implisit dan eksplisit untuk menjaga keutuhan massa bangunan asli:
- Mencegah AI generatif mengganti elemen fasad arsitektural dengan tanaman rimbun (*lush vegetation*) ketika opsi taman tropis rimbun (*lush tropical garden*) diaktifkan.
- Mengunci keutuhan garis atap (*roofline*), irama struktural, dan geometri fasad asli tanpa mengubah, menambah, atau mengurangi elemen struktur dasar.

### 4. 🎛️ Interactive Clash Prevention (Pencegah Bentrokan Semantis)
Sistem memiliki kecerdasan logika bawaan baik di level antarmuka (*UI*) maupun level kompilasi (*Prompt Engine*) untuk mencegah bentrokan parameter yang mustahil secara fisik (*logical conflicts*):
- **No Humans Conflict**: Jika pengguna memilih **No Humans**, pilihan **Human Activity** akan otomatis dikosongkan dan dinonaktifkan (di-gray out dengan status informatif). Pilihan *motion blur* yang berhubungan dengan manusia (seperti *Selective Motion Blur on Figures* atau *Crowd Motion Blur*) juga akan otomatis dicegah.
- **No Vehicles Conflict**: Jika pengguna memilih **No Vehicles**, pilihan kendaraan lain dalam multi-select akan otomatis dihapus, dan efek *Vehicle Motion Trail* pada modul *Motion System* akan dinonaktifkan.

### 5. 👁️ Progressive Disclosure UX (Tema Warna Premium HSL)
Untuk mengelola puluhan modul parameter secara ergonomis, antarmuka dibagi secara berkala menggunakan prinsip *Progressive Disclosure* dengan skema warna HSL yang sangat halus dan monokromatik:
- 🧺 **Essentials**: Latar belakang Linen (`#FAF9F6`) dengan aksen hangat struktural.
- 🧊 **Camera & Composition**: Latar belakang Slate Ice (`#F3F5F8`) bernuansa tenang dan presisi.
- ☀️ **Environment & Lighting**: Latar belakang Golden Hour (`#FCF9F3`) yang hangat alami.
- 🍇 **Narrative & Story**: Latar belakang Lavender Mauve (`#F6F5FA`) yang intim dan naratif.

---

## 📂 Struktur Proyek Modular (v2)

```bash
aprompt/
├── src/
│   ├── assets/          # Aset statis & logo
│   ├── components/      # UI Komponen Modular
│   │   ├── ModuleInput.jsx  # Input dinamis dengan status disabled premium
│   │   ├── LeftPanel.jsx    # Sidebar indeks navigasi & accordion group
│   │   └── RightPanel.jsx   # Live preview hasil kompilasi prompt & copy button
│   ├── data/
│   │   └── schema.js        # Single Source of Truth skema & konfigurasi kalimat semantis
│   ├── engine/
│   │   └── promptEngine.js  # Mesin penyusun prompt v2 & sanitasi bentrokan logika
│   ├── hooks/
│   │   └── useLocalStorage.js # React hook kustom untuk memori peramban
│   ├── App.jsx          # Hub global state, event handler, & interaksi real-time
│   ├── index.css        # Konfigurasi Google Fonts & utility Tailwind CSS v4
│   └── main.jsx         # Render dom React utama
├── index.html           # File entrypoint HTML
├── package.json         # Dependensi NPM & skrip build
└── vite.config.js       # Konfigurasi Vite & compiler
```

---

## 🚀 Memulai Pengembangan Lokal

### Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 18+).

### Langkah Jalun
1. Masuk ke direktori proyek dan pasang dependensi:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
3. Buka alamat lokal yang ditampilkan pada terminal Anda (biasanya `http://localhost:5173`) di browser Anda.

### Kompilasi Siap Produksi (Production Build)
Untuk membangun bundle produksi yang teroptimasi secara maksimal di sisi performa:
```bash
npm run build
```
File hasil kompilasi statis siap unggah akan tersedia di direktori `dist/`.
