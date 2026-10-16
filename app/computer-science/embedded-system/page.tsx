import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: translateText("Embedded System Lab — Find Your Path", 'id'),
  description: translateText("Assemble a button-controlled LED with a breadboard, battery, resistor, and step-by-step guidance.", 'id'),
};
export default function EmbeddedSystemPage() { return <LearningLab track="embedded-system" />; }
