import type { InterestDimension, QuizOption, QuizQuestion } from "./types";

export const dimensions: { id: InterestDimension; label: string }[] = [
  { id: "technology", label: "Teknologi" }, { id: "analytical", label: "Analisis & Logika" },
  { id: "creative", label: "Kreativitas" }, { id: "social", label: "Sosial & Komunikasi" },
  { id: "business", label: "Bisnis & Manajemen" }, { id: "engineering", label: "Eksperimen & Teknik" },
];
// Every choice contributes on the same 0–100 scale to all dimensions.
// Missing dimensions mean zero interest contribution, not a missing observation.
function option(id: string, label: string, icon: InterestDimension, secondary?: InterestDimension): QuizOption {
  return { id, label, icon, weights: { [icon]: 100, ...(secondary ? { [secondary]: 50 } : {}) } };
}
export const questions: QuizQuestion[] = [
  { id: "problem", type: "rating", title: "Kamu suka memecahkan masalah yang bikin penasaran?", description: "Misalnya teka-teki, soal logika, atau mencari tahu kenapa sesuatu rusak.", weights: { analytical: 1 } },
  { id: "math", type: "rating", title: "Seberapa suka kamu dengan hitung-hitungan?", description: "Misalnya mengerjakan soal matematika, membaca angka, atau mencari pola.", weights: { analytical: 1, engineering: 0.5 } },
  { id: "technology", type: "rating", title: "Seberapa tertarik kamu mempelajari teknologi?", description: "Misalnya membuat aplikasi, memahami komputer, atau mencoba teknologi baru.", weights: { technology: 1 } },
  { id: "creative", type: "rating", title: "Kamu suka membuat sesuatu yang kreatif?", description: "Misalnya menggambar, mengedit video, mendesain poster, atau membuat konten.", weights: { creative: 1 } },
  { id: "social", type: "rating", title: "Seberapa suka kamu berinteraksi dan membantu orang lain?", description: "Misalnya mendengarkan cerita teman, bekerja dalam kelompok, atau memberi saran.", weights: { social: 1 } },
  { id: "activity", type: "choice", title: "Kalau punya waktu luang, kamu paling ingin mencoba kegiatan apa?", description: "Pilih satu kegiatan yang paling bikin kamu penasaran.", options: [
    option("app", "Membuat aplikasi atau website", "technology", "analytical"), option("design", "Menggambar atau mendesain sesuatu", "creative", "technology"), option("business", "Merancang ide bisnis", "business", "creative"), option("help", "Membantu orang menyelesaikan masalah", "social", "analytical"), option("electronics", "Merakit atau memperbaiki perangkat elektronik", "engineering", "technology"),
  ] },
  { id: "work", type: "choice", title: "Kamu lebih nyaman mengerjakan tugas seperti apa?", description: "Bayangkan tugas yang ingin kamu kerjakan hari ini.", options: [
    option("data", "Menganalisis data dan mencari solusi", "analytical", "technology"), option("create", "Membuat karya unik dan menarik", "creative"), option("team", "Berdiskusi dan bekerja bersama orang lain", "social"), option("strategy", "Mengatur strategi dan membuat rencana", "business", "analytical"), option("experiment", "Melakukan eksperimen atau merakit sesuatu", "engineering", "analytical"),
  ] },
  { id: "curiosity", type: "rating", title: "Kamu suka mencari tahu bagaimana sesuatu bekerja?", description: "Misalnya membongkar barang, melakukan eksperimen, atau memahami proses di balik suatu sistem.", weights: { engineering: 1, technology: 0.5 } },
  { id: "business", type: "rating", title: "Seberapa tertarik kamu dengan dunia bisnis dan strategi?", description: "Misalnya berjualan, mengatur uang, membuat rencana usaha, atau memasarkan produk.", weights: { business: 1 } },
  { id: "experience", type: "choice", title: "Kalau bisa mencoba satu pengalaman kuliah sekarang, kamu pilih yang mana?", description: "Pilih pengalaman yang paling ingin kamu coba duluan.", options: [
    option("program", "Membuat program komputer", "technology", "analytical"), option("brand", "Mendesain identitas visual sebuah brand", "creative", "business"), option("human", "Menganalisis perilaku manusia", "social", "analytical"), option("strategy", "Merancang strategi bisnis", "business", "social"), option("circuit", "Membuat sistem elektronik sederhana", "engineering", "technology"),
  ] },
];
export const ratingLabels = ["Sama sekali tidak", "Kurang", "Biasa saja", "Cukup suka", "Suka banget"];
