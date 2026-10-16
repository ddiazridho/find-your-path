import type { Metadata } from "next";
import RecommendationForm from "./recommendation-form";
import "./recommendation.css";

export const metadata: Metadata = {
  title: "Rekomendasi Universitas | Find Your Path",
  description: "Cari pilihan universitas dan program kuliah berdasarkan minat, jenjang, budget, serta prioritasmu.",
};

export default function RecommendationPage() {
  return <RecommendationForm />;
}
