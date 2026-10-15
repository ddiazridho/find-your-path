import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: "Computer Science: Software Track — Find Your Path",
  description: "Join a classroom lesson and build your first website with guided HTML and CSS challenges and a live preview.",
};

export default function SoftwareTrackPage() {
  return <LearningLab track="software" />;
}
