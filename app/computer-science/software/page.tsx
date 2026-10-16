import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: translateText("Computer Science: Software Track — Find Your Path", 'id'),
  description: translateText("Join a classroom lesson and build your first website with guided HTML and CSS challenges and a live preview.", 'id'),
};

export default function SoftwareTrackPage() {
  return <LearningLab track="software" />;
}
