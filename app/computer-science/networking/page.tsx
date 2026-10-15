import type { Metadata } from "next";
import LearningLab from "../components/LearningLab";

export const metadata: Metadata = {
  title: "Networking Classroom — Find Your Path",
  description: "Connect devices, assign IP addresses, and follow packets through your first virtual network.",
};
export default function NetworkingPage() { return <LearningLab track="networking" />; }
