import type { Metadata } from "next";
import EmergencyGame from "./EmergencyGame";

export const metadata: Metadata = {
  title: "The First Critical Minutes | Medicine Lab",
  description: "Step into a fictional emergency room story and discover how emergency teams observe, think, and work together.",
};

export default function Page() {
  return <EmergencyGame />;
}
