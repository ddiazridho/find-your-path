import type { Metadata } from "next";
import "./quiz.css";

export const metadata: Metadata = { title: "Kenali Minatmu — Find Your Path", description: "Jawab 10 pertanyaan santai untuk mengeksplorasi minat dan pilihan jurusan kuliahmu." };
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <div className="quiz-shell" lang="id">{children}</div>;
}
