import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: translateText("Multimedia Design Studio — Find Your Path", 'id'),
  description: translateText("Create a product promotion poster and explore brightness, contrast, and saturation in a guided design studio.", 'id'),
};
export default function MultimediaPage() { return <LearningLab track="multimedia" />; }
