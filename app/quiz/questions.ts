import type { QuizQuestion, Riasec, ReasoningDomain } from "./types";
export const dimensions: { id: Riasec; label: string }[] = [
  { id: "R", label: "Realistic · Praktis" }, { id: "I", label: "Investigative · Menyelidiki" },
  { id: "A", label: "Artistic · Kreatif" }, { id: "S", label: "Social · Membantu" },
  { id: "E", label: "Enterprising · Memimpin" }, { id: "C", label: "Conventional · Terstruktur" },
];
export const domainLabels: Record<ReasoningDomain, string> = { numeric: "Numerik", logic: "Logika", verbal: "Verbal", spatial: "Spasial" };
export const ratingLabels = ["Sangat tidak tertarik", "Tidak tertarik", "Netral", "Tertarik", "Sangat tertarik"];
const rating = (n: number, riasec: Riasec, title: string): QuizQuestion => ({ id: `q${n}`, type: "rating", riasec, title });
const situational = (n: number, title: string, labels: string[]): QuizQuestion => ({ id: `q${n}`, type: "situational", title, options: labels.map((label, i) => ({ id: "ABCDEF"[i], label, riasec: dimensions[i].id })) });
const reasoning = (n: number, domain: ReasoningDomain, title: string, labels: string[], correct: string, explanation: string): QuizQuestion => ({ id: `q${n}`, type: "reasoning", domain, title, options: labels.map((label, i) => ({ id: "ABCD"[i], label })), correct, explanation });
export const questions: QuizQuestion[] = [
  rating(1, "R", "Saya tertarik merakit atau memperbaiki perangkat elektronik."),
  rating(2, "I", "Saya senang melakukan eksperimen untuk memahami cara kerja sesuatu."),
  rating(3, "A", "Saya tertarik membuat desain visual, ilustrasi, atau karya kreatif."),
  rating(4, "A", "Saya senang menulis cerita, membuat konten, atau menyampaikan gagasan secara kreatif."),
  rating(5, "S", "Saya senang membantu orang lain memahami materi yang sulit."),
  rating(6, "S", "Saya tertarik mendengarkan masalah orang lain dan membantu mencari solusi."),
  rating(7, "E", "Saya senang memimpin tim untuk mencapai tujuan bersama."),
  rating(8, "E", "Saya tertarik mempresentasikan ide dan meyakinkan orang lain."),
  rating(9, "C", "Saya senang menyusun data, jadwal, atau dokumen secara teratur."),
  rating(10, "C", "Saya tertarik mengelola catatan, laporan, dan informasi secara sistematis."),
  rating(11, "I", "Saya senang mengamati fenomena alam dan mencari penjelasan ilmiahnya."),
  rating(12, "R", "Saya tertarik membuat sesuatu yang praktis dan dapat digunakan untuk menyelesaikan masalah."),
  situational(13, "Saat mendapat tugas kelompok, kamu cenderung...", ["Membuat atau menguji prototipe.", "Menganalisis masalah dan mencari bukti.", "Mendesain presentasi yang menarik.", "Membantu anggota yang kesulitan.", "Mengatur pembagian tugas dan memimpin diskusi.", "Membuat jadwal dan merapikan dokumen."]),
  situational(14, "Kamu memiliki waktu luang untuk proyek pribadi. Kamu memilih...", ["Merakit benda atau mencoba alat baru.", "Meneliti pertanyaan yang membuat penasaran.", "Membuat karya seni atau konten.", "Menjadi relawan atau mengajar.", "Menjual produk atau memulai usaha kecil.", "Menyusun katalog atau sistem pencatatan."]),
  situational(15, "Ketika menemukan masalah di sekolah, kamu akan...", ["Memperbaiki fasilitas yang bermasalah.", "Menyelidiki penyebabnya melalui data.", "Membuat media kreatif untuk menjelaskan masalah.", "Mengajak orang yang terdampak berdiskusi.", "Mengusulkan dan memimpin program penyelesaian.", "Menyusun prosedur agar masalah tidak berulang."]),
  situational(16, "Dalam sebuah acara, peran yang paling kamu sukai adalah...", ["Menyiapkan peralatan dan kebutuhan teknis.", "Mengevaluasi hasil acara berdasarkan data.", "Membuat konsep visual dan dekorasi.", "Menyambut dan membantu peserta.", "Menjadi koordinator atau negosiator.", "Mengelola administrasi dan anggaran."]),
  situational(17, "Jika mempelajari hal baru, kamu lebih suka...", ["Langsung mencoba praktik.", "Memahami teori dan logikanya.", "Mengeksplorasi berbagai cara kreatif.", "Belajar bersama dan berdiskusi.", "Menerapkannya untuk mencapai target.", "Mengikuti langkah yang terstruktur."]),
  situational(18, "Jika diberi kesempatan mengikuti program pengembangan diri, kamu memilih...", ["Workshop robotika atau keterampilan teknis.", "Program riset atau analisis data.", "Kelas desain, musik, atau penulisan.", "Pelatihan mengajar atau pelayanan masyarakat.", "Kompetisi bisnis atau kepemimpinan.", "Pelatihan administrasi dan pengelolaan informasi."]),
  reasoning(19, "numeric", "Lanjutkan pola 2, 5, 8, 11, ...", ["12", "13", "14", "15"], "C", "Setiap bilangan bertambah 3. Jadi 11 + 3 = 14."),
  reasoning(20, "numeric", "Sebuah buku berharga Rp80.000 mendapat diskon 25%. Berapa harga setelah diskon?", ["Rp20.000", "Rp55.000", "Rp60.000", "Rp65.000"], "C", "Diskon = 25% × Rp80.000 = Rp20.000. Harga akhir Rp60.000."),
  reasoning(21, "logic", "Semua peneliti mengumpulkan data. Sebagian mahasiswa adalah peneliti. Kesimpulan yang pasti benar adalah...", ["Semua mahasiswa mengumpulkan data.", "Sebagian mahasiswa mengumpulkan data.", "Tidak ada mahasiswa mengumpulkan data.", "Semua pengumpul data adalah peneliti."], "B", "Mahasiswa yang merupakan peneliti pasti mengumpulkan data; ini tidak berlaku otomatis bagi semua mahasiswa."),
  reasoning(22, "logic", "Jika hujan, lapangan basah. Lapangan tidak basah. Dengan asumsi pernyataan pertama selalu benar, kesimpulannya...", ["Hujan deras.", "Mungkin hujan.", "Tidak hujan.", "Lapangan rusak."], "C", "Dengan asumsi tersebut, tidak basah berarti tidak hujan (modus tollens)."),
  reasoning(23, "verbal", "Sinonim kata akurat adalah...", ["Tepat", "Cepat", "Rumit", "Umum"], "A", "Akurat berarti tepat atau teliti, sesuai dengan keadaan sebenarnya."),
  reasoning(24, "verbal", "Dokter : Pasien = Guru : ...", ["Buku", "Murid", "Sekolah", "Kelas"], "B", "Dokter melayani pasien, sedangkan guru mengajar murid."),
  reasoning(25, "spatial", "Sebuah panah menghadap ke utara. Jika diputar 90° searah jarum jam, arahnya menjadi...", ["Barat", "Timur", "Selatan", "Utara"], "B", "Seperempat putaran searah jarum jam dari utara mengarah ke timur."),
  reasoning(26, "spatial", "Kubus memiliki berapa sisi (bidang permukaan)?", ["4", "5", "6", "8"], "C", "Kubus memiliki enam bidang permukaan berbentuk persegi, bukan delapan titik sudut."),
  { id: "q27", type: "essay", title: "Mata pelajaran atau aktivitas apa yang paling kamu sukai? Jelaskan alasannya." },
  { id: "q28", type: "essay", title: "Kegiatan apa yang pernah membuatmu merasa bangga dengan hasil pekerjaanmu?" },
  { id: "q29", type: "essay", title: "Masalah apa yang ingin kamu bantu selesaikan melalui pendidikan atau kariermu kelak?" },
  { id: "q30", type: "essay", title: "Apa pertimbangan terpentingmu ketika memilih jurusan kuliah?" },
];
export const ESSAY_MAX_LENGTH = 2000;
export function sectionLabel(q: QuizQuestion): string {
  return q.type === "rating" ? "Minat" : q.type === "situational" ? "Situasional" : q.type === "reasoning" ? `Penalaran · ${domainLabels[q.domain]}` : "Refleksi diri";
}
