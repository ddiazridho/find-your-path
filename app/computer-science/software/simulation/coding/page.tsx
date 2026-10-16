import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import CodingSimulation from "../../components/CodingSimulation";

export const metadata: Metadata = {
  title: translateText("Coding & Bug Fix Simulation — Computer Science (Software Track)", 'id'),
  description: translateText("Hands-on beginner-friendly coding simulator. Fix real-world bugs, test calculations, and explore software development.", 'id'),
};

export default function CodingPage() {
  return <CodingSimulation isModal={false} />;
}
