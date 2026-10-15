import type { Metadata } from "next";
import SurgeryGame from "./SurgeryGame";

export const metadata: Metadata = {
  title: "Before the First Incision | Medicine Lab",
  description: "An interactive story about focus and patient safety before surgery begins.",
};

export default function Page() {
  return <SurgeryGame />;
}
