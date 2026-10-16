import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import EmergencyGame from "./EmergencyGame";

export const metadata: Metadata = {
  title: translateText("The First Critical Minutes | Medicine Lab", 'id'),
  description: translateText("Step into a fictional emergency room story and discover how emergency teams observe, think, and work together.", 'id'),
};

export default function Page() {
  return <EmergencyGame />;
}
