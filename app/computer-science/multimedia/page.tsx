import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: "Multimedia Design Studio — Find Your Path",
  description: "Create a product promotion poster and explore brightness, contrast, and saturation in a guided design studio.",
};
export default function MultimediaPage() { return <LearningLab track="multimedia" />; }
