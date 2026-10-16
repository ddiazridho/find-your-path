import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import "./quiz.css";
export const metadata: Metadata = { title: translateText("Asesmen Minat RIASEC — Find Your Path", 'id'), description: translateText("30 soal minat RIASEC, situasional, penalaran, dan refleksi diri untuk eksplorasi jurusan kuliah.", 'id') };
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <div className="quiz-shell" lang="id">{children}</div>;
}
