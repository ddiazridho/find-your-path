# Rekomendasi universitas

Pipeline rekomendasi berjalan di server Next.js (`app/api/university-recommendations/route.ts`). Tidak ada layanan Python. Qdrant Cloud menyimpan vektor dan metadata, sementara OpenAI membuat embedding, mengurutkan ulang kandidat, dan menulis alasan. Foto gedung tersimpan lokal di `public/universities/`; sumber dan lisensinya ada di `images.json`.

## Menjalankan

Isi environment server dengan `OPENAI_API_KEY`, `QDRANT_CLOUD_CLUSTER_ENDPOINT`, dan `QDRANT_CLOUD_API_KEY`. Next.js membaca `.env` lokal otomatis. Jangan memakai awalan `NEXT_PUBLIC_` untuk kunci. `QDRANT_URL` dan `QDRANT_API_KEY` boleh dipakai sebagai pengganti variabel Cloud.

```powershell
npm install
npm run seed:universities
npm run dev
```

`npm run seed:universities` membuat koleksi, indeks payload, embedding, dan point bila koleksi belum terisi. Perintah aman dijalankan ulang; gunakan `npm run seed:universities -- --force` setelah mengubah dataset dengan jumlah baris yang sama. Nama koleksi default `fyp_university_programs_v1`. Jika mengganti model embedding atau dimensi vektor, gunakan nama koleksi baru lalu seed lagi. Untuk deployment, jalankan seed sekali dengan environment produksi sebelum membuka fitur. Server Next.js harus dapat menjangkau Qdrant Cloud dan OpenAI. Docker Qdrant lokal di `docker-compose.yml` hanya pilihan untuk pengembangan lokal; tidak diperlukan untuk Qdrant Cloud.

## Pipeline

1. Zod memvalidasi minat, bidang dan jenjang terisi, `budget.max >= budget.min`, dan empat prioritas unik.
2. Qdrant memakai filter keras bidang, jenjang, dan **seluruh rentang biaya program** di dalam rentang budget pengguna. Jika tidak ada yang lolos, respons kosong; filter tidak dilonggarkan otomatis.
3. Minat di-embed dengan `text-embedding-3-small` (512 dimensi), lalu pencarian vektor `interest` mengambil maksimal 30 program.
4. Empat skor dihitung: relevansi deskripsi minat, relevansi profil karier, ruang budget terhadap biaya tertinggi, dan relevansi topik pembelajaran. Bobot urutan prioritas adalah 0,4 / 0,3 / 0,2 / 0,1. Skor karier menunjukkan kedekatan teks, bukan peluang kerja; skor belajar menunjukkan kedekatan topik, bukan metode pengajaran kampus yang terverifikasi.
5. Program teratas didiversifikasi per universitas, lalu `gpt-4o-mini` mengurutkan kembali maksimal lima kandidat berdasarkan prioritas. Jika langkah opsional ini gagal, urutan bobot dipakai dan respons `reranked` bernilai `false`.
6. Model yang sama menulis alasan singkat dari data kandidat. Respons akhir memuat tiga pilihan universitas berbeda, foto gedung, sumber biaya, dan catatan biaya.

## Batas data

Dataset Excel awal hanya mencakup bidang Teknologi dan Bisnis, jenjang D3/D4/S1, tujuh kampus, dan 33 program. Data dikumpulkan 15 Oktober 2026. Catatan Excel menyebut sebagian angka berasal dari media/agregator, beberapa belum diverifikasi dengan sumber resmi, dan uang pangkal serta biaya hidup tidak selalu termasuk. Verifikasi tarif resmi kampus sebelum memakai hasil untuk keputusan finansial. Teks minat, profil karier, dan ciri khas kampus di Excel ditulis ulang, bukan hasil scrape resmi.
