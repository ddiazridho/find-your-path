import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: translateText("Networking Classroom — Find Your Path", 'id'),
  description: translateText("Connect devices, assign IP addresses, and follow packets through your first virtual network.", 'id'),
};
export default function NetworkingPage() { return <LearningLab track="networking" />; }
