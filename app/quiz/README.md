# Asesmen RIASEC — Find Your Path

## Ruang lingkup

Aplikasi memakai Next.js 16.4 App Router, React 19, localStorage, dan katalog tiga jurusan di `app/majors.ts`. Backend asesmen dan autentikasi belum tersedia. Rute `/quiz` dan `/quiz/results`, tema studio hijau, warna paper, dan Manrope dipertahankan. Panduan lokal Next dibaca sebelum perubahan. PDF `refrensi soal.pdf` tidak ditemukan pada audit.

Alur: pengantar → 30 soal → Submit Asesmen → profil RIASEC dan rekomendasi. Empat esai asli dipulihkan sesuai permintaan terbaru. Tidak ada tahap review, konfirmasi submit, pembahasan penalaran, atau analisis AI. Tombol Ulangi Kuis langsung menghapus sesi dan kembali ke pengantar tanpa popup konfirmasi. Konfirmasi penghapusan pada pengantar tetap tersedia untuk aksi hapus jawaban. Instrumen belum tervalidasi secara psikometrik; bukan diagnosis, penentu jurusan yang pasti benar, atau jaminan sukses.

## Blueprint 30 soal

Sumber tunggal: `questions.ts`; diskriminasi tipe: `types.ts`. ID q1–q30 unik.

| Bagian | ID | Pemetaan |
| --- | --- | --- |
| Minat | q1–q12 | R: 1,12; I: 2,11; A: 3,4; S: 5,6; E: 7,8; C: 9,10 |
| Situasional | q13–q18 | Setiap soal memiliki A→R, B→I, C→A, D→S, E→E, F→C; mapping eksplisit dalam opsi |
| Penalaran | q19–q26 | Numerik 19,20; logika 21,22; verbal 23,24; spasial 25,26 |
| Refleksi esai | q27–q30 | Aktivitas yang disukai; pengalaman membanggakan; masalah yang ingin diselesaikan; pertimbangan memilih jurusan |

Total 12 rating, 6 situasional, 8 penalaran, 4 esai. Masing-masing tipe RIASEC memiliki dua rating. Kunci penalaran tetap C,C,B,C,A,B,B,C. Soal kubus memakai istilah “sisi (bidang permukaan)” untuk membedakan sisi dari rusuk/titik sudut. Butir penalaran tingkat dasar dan belum dikalibrasi; dua soal per domain tidak cukup untuk estimasi kemampuan yang presisi.

Empat esai memakai pertanyaan asli. Jawaban wajib berisi selain whitespace, maksimal 2.000 karakter untuk membatasi ukuran respons, bukan ambang psikometrik. Draft kosong/whitespace tetap tersimpan tetapi belum dianggap selesai. Esai tidak diberi skor, tidak dianalisis otomatis, tidak memengaruhi profil atau peringkat, dan tidak dipresentasikan sebagai analisis bakat. Telaah ahli, uji pemahaman siswa, evaluasi bias, dan pengujian psikometrik masih diperlukan.

## Skor dan asumsi pencocokan

`scoring.ts` adalah modul murni yang terpisah dari React, storage, dan routing.

- Minat tiap tipe: `sum(rating − 1) / (4 × jumlah butir tipe) × 100`, ekuivalen `(jumlah dua rating − 2) / 8 × 100`. Bobot butir setara. Skor 0–100 adalah ketertarikan, bukan persentil atau kemampuan.
- Semua tipe pada skor tertinggi dikembalikan. Seri parsial ditampilkan dalam urutan R,I,A,S,E,C; jika keenam tipe seri, UI menjelaskan belum ada satu kecenderungan lebih menonjol. Pembulatan hanya untuk tampilan, bukan peringkat.
- Situasional: frekuensi pilihan tipe dari enam kesempatan setara, `jumlah pilihan / 6 × 100`. Dipakai untuk kalimat alasan pendukung, tanpa mengubah skor minat atau peringkat.
- Penalaran divalidasi sebagai pilihan yang sah. Kunci dan penjelasan tetap tersedia pada data serta diuji, tetapi tidak diberi skor kemampuan, tidak ditampilkan, dan tidak dipakai untuk pencocokan karena metadata jurusan belum menyediakan dasar pemetaan yang jelas. Respons benar maupun salah menghasilkan profil sama jika minat/situasional sama.
- Metadata jurusan: Informatika I/R/C, Hukum E/S/I, Kedokteran I/S/R. Indeks rekomendasi adalah rata-rata minat pada tipe relevan dengan bobot setara. **Pemetaan dan bobot adalah hipotesis editorial awal, belum tervalidasi.** Indeks bukan probabilitas kecocokan/keberhasilan; tidak ada ambang kelulusan.
- Jurusan diurutkan menurut indeks menurun, seri menurut ID. Metadata tidak lengkap dilewati; ID duplikat sekali; maksimum lima rekomendasi. Saat ini hanya tiga jurusan tersedia. Katalog belum mewakili semua bidang, termasuk Artistic. Skor nol diberi bahasa pembanding eksplorasi, tanpa mengklaim kecocokan positif.

## UI hasil

Pengantar mengikuti referensi teleskop/heading/badges/CTA sambil mempertahankan tema default. Badge menampilkan 30 soal dan tanpa batas waktu. Petunjuk dan privasi tersedia dalam disclosure native, dengan batas validasi instrumen tetap terlihat.

Hasil menampilkan dominan dan deskripsinya, enam bar minat, serta kartu rekomendasi sesuai referensi: panel ilustrasi pastel bernomor, badge kategori/indeks minat, judul, deskripsi bidang, bar indeks, alasan, dan aksi. Skor ditampilkan sebagai persentase dengan penjelasan keterbatasan singkat, bukan persentase peluang sukses. Tidak ada skor penalaran, benar/salah, diagram situasional, analisis esai, atau formula teknis pada UI.

“Coba Simulasi” hanya tersedia untuk Informatika menuju ruang software yang sudah ada. “Lihat Detail” pada setiap kartu membuka popup jurusan di katalog. Jurusan lain diberi keterangan simulasi masih dikembangkan; tidak mengarang jurusan DKV atau skor dari referensi. Tombol bawah berada di tengah: “Eksplore Semua Jurusan” dan “Ulangi Kuis” dengan ikon repeat. Kartu horizontal di desktop/tablet, panel ilustrasi di atas konten pada ponsel.

## Alur dan penyimpanan

Satu soal per layar, progres menurut jawaban valid, radio native dengan keyboard, textarea berlabel dan penghitung karakter, fokus judul/scroll reset setiap pergantian. Jawaban boleh dilewati sementara. Submit memvalidasi semua 30 jawaban, menampilkan nomor soal yang kosong, dan membuka soal pertama yang belum lengkap. Setelah lengkap, hasil dihitung dan langsung dibuka. Ref lock dan disabled/busy mencegah klik submit ganda. State busy direset saat memulai ulang karena Next Cache Components mempertahankan state route dengan Activity.

Versi 4 memakai `find-your-path:quiz:v4`: fase intro/active/complete, indeks, dan answers. Hasil tidak diserialisasi; dihitung ulang dari jawaban tervalidasi saat refresh. Esai hanya tersimpan sekali pada answers. Migrasi versi 3 mempertahankan q1–q26; empat rating pengganti tidak diinterpretasikan sebagai esai, dan pengguna diarahkan melengkapi esai. Jika versi 2 masih tersedia, esai validnya dipertahankan. Esai yang sudah dihapus oleh versi sebelumnya tidak dapat direkonstruksi. Key lama dibersihkan sesudah save baru berhasil. Reset menghapus key versi 1/2/3/4 dan state memori.

Jawaban tidak dikirim ke server, AI, analytics, atau log. Browser bersama dapat membaca localStorage; petunjuk menjelaskan hal ini dan meminta pengguna menghindari informasi sensitif. Storage ditolak/penuh memakai fallback memori dan peringatan bahwa refresh tidak aman. Kegagalan penghapusan diberi peringatan untuk membersihkan data situs lewat pengaturan browser. Jika backend ditambahkan, validasi/hitung ulang pada server dan jangan mempercayai skor client. Hasil client saat ini bukan sumber seleksi tepercaya.

## Pengujian

- `npm test`: sembilan kelompok tes blueprint/ID/mapping/kunci, validasi tiap soal, esai kosong/panjang, skor 0/25/50/75/100, seri, independensi esai/penalaran, situasional, rekomendasi deterministik/metadata hilang/duplikat/batas lima, refresh, data korup, reset, storage ditolak, migrasi versi 3, pemulihan esai versi 2, dan draft.
- `npm run test:browser`: jalankan `npm run dev` dahulu. Playwright + axe-core memakai `http://127.0.0.1:3000`; `allowedDevOrigins` mengizinkan hostname ini pada dev server default localhost. Tes juga menangkap kegagalan WebSocket. Windows memakai Edge terpasang; platform lain memerlukan Chromium Playwright (`npx playwright install chromium`). Override melalui `QUIZ_TEST_URL`/`QUIZ_BROWSER_CHANNEL`.
- Tes browser mencakup 30 soal, esai/refresh, skip dan validasi soal kosong, submit langsung/dobel, hasil enam tipe+tiga rekomendasi, dominan/seri, reset/pengerjaan ulang, migrasi, storage ditolak, keyboard, axe WCAG A/AA serta overflow pada lebar 320/390/768/1366. Snapshot sintetis dan laporan berada di `.impeccable/review/`. Smoke test beranda/ruang software bukan pengujian lengkap seluruh simulasi.
- `npm run typecheck`; `npm run lint`; lint fitur: `npx eslint app/quiz tests/quiz.test.mjs tests/quiz.browser.mjs`; `npm run build`.

Build pertama dapat membutuhkan Google Fonts sesuai konfigurasi font yang sudah ada. Lint global sebelumnya memiliki lima error lama di luar asesmen. Hasil perintah terbaru dilaporkan pada handoff. Pengujian otomatis bukan audit aksesibilitas penuh: pembaca layar manual, Safari/Firefox, perangkat fisik, dan validasi psikometrik belum dilakukan.

## Ringkasan skor visual

Profil dan deskripsi RIASEC tetap tersedia. Bar keenam tipe dipindahkan ke panel “Ringkasan Minatmu” dua kolom pada desktop/tablet, satu kolom pada ponsel. Skor minat serta keselarasan rekomendasi ditampilkan sebagai persentase dengan maksimum satu desimal; rumus dan nilai internal tidak berubah. Persentase bukan peluang sukses dan tidak harus berjumlah 100 antar tipe.

Enam bar memiliki warna lokal yang berbeda serta label/nilai eksplisit, sehingga informasi tidak hanya dibedakan lewat warna. CSS `interest-fill-in` mengisi bar dari nol menggunakan transform scaleX selama 1.100ms dengan jeda berurutan 70ms setiap tipe ketika panel dimuat. ARIA meter tetap menyebutkan target akhir. `prefers-reduced-motion` menonaktifkan animasi dan langsung menampilkan nilai penuh. Tidak ada state atau perhitungan skor tambahan untuk animasi.
