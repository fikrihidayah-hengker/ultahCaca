# 🎂 Website Ucapan Ulang Tahun Scrapbook (Buku Tempel) ✨

Website ucapan ulang tahun bergaya desain **Scrapbook / Buku Tempel** yang estetik, sinematik, dan interaktif untuk Caca. Dibuat dengan **HTML, CSS, dan JavaScript murni** (tanpa framework/bundler) sehingga sangat ringan, mudah dikustomisasi, sangat responsif di HP, dan siap di-deploy langsung ke **Vercel** atau tunneling online!

---

## 🚀 Cara Deploy ke Vercel (Akses Online via Link HP)

Karena seluruh aset (video background, audio, foto) berukuran total **~86 MB** (di mana file terbesar adalah ~19.5 MB), ini **100% aman dan gratis** di Vercel karena batas gratis Vercel adalah **100 MB per file**!

Selain itu, file `vercel.json` sudah dibuatkan khusus dengan konfigurasi cache jangka panjang (`Cache-Control: immutable`), dan script sudah dioptimasi dengan *lazy loading* sehingga HP Caca **tidak akan mendownload 86 MB sekaligus**, melainkan dimuat secara bertahap dan sangat hemat kuota!

### Cara 1: Deploy Langsung via Vercel CLI (Paling Cepat, ~1 Menit)
Buka terminal PowerShell di folder ini, lalu jalankan:
```powershell
npx vercel
```
1. Jika belum login, ikuti petunjuk login browser gratis dengan akun GitHub/Email.
2. Ikuti pertanyaan default di terminal:
   - `Set up and deploy?` Ketik **Y** lalu Enter
   - `Which scope?` Pilih akun Anda (Enter)
   - `Link to existing project?` Ketik **N** lalu Enter
   - `Project name?` Tekan **Enter** (misal: `ultah-caca`)
   - `In which directory is your code located?` Tekan **Enter** (`./`)
   - `Want to modify these settings?` Ketik **N** lalu Enter
3. Vercel akan meng-upload aset dan langsung menghasilkan link live publik, contohnya:  
   👉 `https://ultah-caca.vercel.app` 🎉
4. Jika di masa depan ada perubahan kode/foto, deploy ulang dengan:
   ```powershell
   npx vercel --prod
   ```

---

### Cara 2: Deploy via GitHub + Dashboard Vercel (Rekomendasi Jangka Panjang)
1. Buat repository baru di [GitHub](https://github.com/new), misalnya beri nama `ultah-caca`.
2. Jalankan perintah berikut di PowerShell folder ini:
   ```powershell
   git init
   git add .
   git commit -m "Happy Birthday Caca Scrapbook"
   git branch -M main
   git remote add origin https://github.com/<USERNAME-GITHUB-KAMU>/ultah-caca.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) -> Login -> Klik tombol **"Add New..."** -> **"Project"**.
4. Pilih repository `ultah-caca` yang tadi dibuat -> Klik **"Deploy"**.
5. Tunggu ~20 detik hingga selesai, dan link website ulang tahun Caca siap dibagikan!

---

## 📁 Struktur Folder & File

```text
ultahCaca/
├── index.html              # Halaman utama ucapan, struktur scrapbook, stiker & surat
├── style.css               # Desain scrapbook, stiker festif, responsive HP, efek 3D
├── script.js               # Flipbook lipat di luar, background slideshow, audio, confetti
├── vercel.json             # Konfigurasi optimasi cache & routing Vercel
├── README.md               # Panduan penggunaan & cara deploy Vercel
└── assets/
    ├── audio/
    │   └── bgm.aac         # Lagu latar (mulai otomatis dari detik ke-39 / 00:39)
    ├── bg/                 # Video & foto latar dinamis (bgvid 1-3 & bg 1-19)
    └── images/
        ├── main.png        # Foto utama di tengah (cover buku tempel lipat)
        ├── photo1.png      # Foto sudut kiri atas (2x)
        ├── photo2.png      # Foto sudut kanan atas (2x)
        ├── photo3.png      # Foto sudut kiri bawah (2x)
        ├── photo4.png      # Foto sudut kanan bawah (2x)
        ├── photo6.png      # Stiker kucing kiri atas (1.5x)
        ├── photo7.png      # Stiker kucing kanan atas (2x)
        └── photo8.png      # Stiker kucing kanan bawah
```

---

## ✨ Fitur-Fitur Spesial

1. **📖 Buku Tempel Lipat Langsung di Luar (On-Canvas Flipbook):**
   - Buku ucapan terletak langsung di tengah halaman kanvas (bukan popup modal tersembunyi).
   - **Tampilan Sebelum Dibuka:** Halaman surat ucapan di bawahnya sudah mengintip sedikit dengan sudut resting `-8°` dan tab pengintip berkedip `💌 Ada pesan rahasia ➔`.
   - **Interaksi Geser Sentuh Alami:** Bisa dibuka sedikit demi sedikit dengan menarik cover foto `main.png` ke kiri (menggunakan jari di HP atau mouse di laptop). Saat dibuka lebih dari 30%, surat langsung terbuka penuh dengan ledakan confetti warna-warni!
   - Untuk menutupnya kembali, cukup klik tombol `👉 Klik / geser untuk menutup` di bagian bawah surat.

2. **📱 Desain Super Responsif untuk HP (Smartphone Android & iPhone):**
   - Di layar HP, elemen tersusun dalam alur scrapbook yang rapi, proporsional, dan nyaman di-scroll.
   - Tanpa *overflow* horizontal (tidak ada layar geser ke kanan-kiri yang terpotong).
   - Tombol ribbon cinta melayang di bawah layar dengan efek *frosted glass* yang mudah dijangkau jempol.

3. **🎉 Stiker Dekorasi Pesta Sangat Meriah:**
   - 🎂 **Kue Ulang Tahun 3 Tingkat** dengan lilin menyala beranimasi kelap-kelip.
   - 🎈 **Kumpulan Balon Pastel** yang melayang pelan (*floating*).
   - 🎁 **Kotak Kado Ulang Tahun** dengan pita satin bertuliskan *"To: Caca 💝"*.
   - 📸 **Kamera Retro Polaroid** bernuansa pastel.
   - 🧁 **Cupcake Stroberi** manis dengan ceri di atasnya.
   - 👑 **Stiker Badge Estetik:** *"QUEEN OF THE DAY"*, *"MAKE A WISH!"*, *"100% SWEETEST"*, dan *"PRETTIEST GIRL"*.
   - 🎀 **Bendera Segitiga Pesta (Bunting Garland Banner)** membentang anggun di bagian atas.
   - Stiker selotip (*washi tape*) di sudut foto.

4. **🎬 Slideshow Video & Foto Latar Otomatis:**
   - Video dipotong otomatis di 5 detik jika durasi > 5 detik.
   - Foto tampil selama 2 detik dengan efek *Ken Burns Slow Zoom*.
   - Transisi sinematik halus berlapis bayangan gelap lembut agar foto dan teks Caca di depan sangat kontras dan mudah dibaca.

5. **🎵 Pemutar Musik Spesial (Detik 00:39):**
   - Lagu langsung melompat ke detik 39 begitu tombol *"Buka Ucapan"* ditekan.
   - Pengontrol musik piringan hitam (*vinyl disc*) yang berputar saat musik menyala.
