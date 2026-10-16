import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import RecommendationForm from "./recommendation-form";
import "./recommendation.css";

export const metadata: Metadata = {
  title: translateText("Rekomendasi Universitas | Find Your Path", 'id'),
  description: translateText("Cari pilihan universitas dan program kuliah berdasarkan minat, jenjang, budget, serta prioritasmu.", 'id'),
};

export default function RecommendationPage() {
  return <RecommendationForm />;
}
