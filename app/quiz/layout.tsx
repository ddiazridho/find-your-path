import type { Metadata } from "next";
import Navbar from "../components/explore/navbar";
import "./quiz.css";
export const metadata: Metadata = { title: "Asesmen Minat RIASEC — Find Your Path", description: "30 soal minat RIASEC, situasional, penalaran, dan refleksi diri untuk eksplorasi jurusan kuliah." };
export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <div className="quiz-shell" lang="id"><Navbar minimal />{children}</div>;
}
