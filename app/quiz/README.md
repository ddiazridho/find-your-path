# Kuis minat

`questions.ts` memuat 10 pertanyaan dan kontribusi setiap pilihan.
`scoring.ts` memuat metadata pencocokan untuk ID jurusan dari `app/majors.ts`.
Untuk menambah rekomendasi, tambahkan jurusan ke katalog dan profil bobotnya ke `majorProfiles`, beserta tautan yang benar-benar tersedia.

Rating 1–5 dinormalisasi menggunakan `(jawaban - 1) / 4 * 100`.
Untuk setiap dimensi, kontribusi rating dibobotkan; setiap pertanyaan pilihan memberi satu observasi 0–100 pada semua dimensi. Kontribusi yang tidak disebutkan bernilai nol. Jumlah kontribusi dibagi total bobot observasi dimensi tersebut, sehingga banyaknya pertanyaan tidak memperbesar skor secara otomatis.

Kesesuaian jurusan adalah rata-rata skor dimensi yang dibobotkan oleh profil jurusan. Peringkat diurutkan berdasarkan skor menurun, lalu ID jurusan untuk hasil seri. Persentase ini merupakan perkiraan minat, bukan penilaian ilmiah atau ukuran kemampuan.

Sesi dan hasil disimpan pada `find-your-path:quiz:v1`. Saat dibaca, jawaban divalidasi dan hasil dihitung ulang dari jawaban, sehingga hasil tersimpan yang rusak tidak dipercaya. Jika localStorage diblokir, sesi tetap tersedia dalam memori selama navigasi client-side, dengan pemberitahuan kepada pengguna.

Jalankan tes logika dan penyimpanan dengan `node --test tests/quiz.test.mjs`.
Jalankan pemeriksaan kode dengan `npx eslint app/quiz tests/quiz.test.mjs`, dan build dengan `npm run build`.

Katalog saat implementasi berisi Informatika, Hukum, dan Kedokteran. Hanya Informatika yang sudah memiliki simulasi software; rekomendasi lain membuka pilihan jurusan pada katalog yang ada dan memberi keterangan ketersediaan simulasi.
