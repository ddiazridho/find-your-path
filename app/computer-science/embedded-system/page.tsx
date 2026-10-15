import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: "Embedded System Lab — Find Your Path",
  description: "Assemble a button-controlled LED with a breadboard, battery, resistor, and step-by-step guidance.",
};
export default function EmbeddedSystemPage() { return <LearningLab track="embedded-system" />; }
