import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import SurgeryGame from "./SurgeryGame";

export const metadata: Metadata = {
  title: translateText("Before the First Incision | Medicine Lab", 'id'),
  description: translateText("An interactive story about focus and patient safety before surgery begins.", 'id'),
};

export default function Page() {
  return <SurgeryGame />;
}
