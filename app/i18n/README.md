# Bahasa antarmuka

Semua halaman memakai `LanguageProvider` pada root layout. Bahasa awal adalah Indonesia; pilihan Indonesia/English disimpan pada `fyp-language`, dibagikan antartab, dan tidak mengubah URL atau me-remount simulasi.

Gunakan `const { t: tx, locale, intlLocale } = useTranslation()` dalam komponen klien. Bungkus teks tampilan dengan `tx(...)`, termasuk teks dari data, label aksesibilitas, pesan validasi, SVG, dan judul. Tambahkan terjemahan kontekstual ke `id.json` atau `en.json`; jangan menerjemahkan ID, enum, alamat jaringan, sintaks kode, nama resmi, atau isian pengguna. `translateText` juga tersedia untuk fungsi murni. Pesan dinamis menggunakan penanda `{0}`, `{1}`, dan seterusnya; setiap nilai sisipan diterjemahkan secara terpisah. Gunakan `intlLocale` untuk format angka, uang, dan tanggal.

Terjemahkan dialog **sebelum** memotongnya untuk animasi mengetik. Poster menerjemahkan teks bawaan pada tampilan dan unduhan; teks yang disunting pengguna dipertahankan. Hasil AI asesmen diminta sesuai bahasa dan cache dibedakan menurut bahasa. Saat bahasa hasil diganti, API menerjemahkan analisis yang sama tanpa memilih atau mengurutkan ulang jurusan. Rekomendasi universitas mengembalikan alasan Indonesia dan Inggris sekaligus agar pilihan kampus tetap sama saat bahasa diganti. Aset SVG statis juga memiliki varian Indonesia di `public/simulations/id/`.

`metadata.json` berisi metadata sumber untuk setiap rute. Perbarui saat menambahkan halaman atau mengganti judul/deskripsi.

Validasi: `npm run test:i18n` dan, dengan server berjalan, `npm run test:i18n:browser`.
