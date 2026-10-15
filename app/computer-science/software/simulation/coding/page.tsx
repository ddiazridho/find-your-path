import type { Metadata } from "next";
import CodingSimulation from "../../components/CodingSimulation";

export const metadata: Metadata = {
  title: "Coding & Bug Fix Simulation — Computer Science (Software Track)",
  description: "Hands-on beginner-friendly coding simulator. Fix real-world bugs, test calculations, and explore software development.",
};

export default function CodingPage() {
  return <CodingSimulation isModal={false} />;
}
