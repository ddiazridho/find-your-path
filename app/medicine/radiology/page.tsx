import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import RadiologyGame from "./RadiologyGame";

export const metadata: Metadata = { title: translateText("What's Inside the Image? | Medicine Lab", 'id'), description: translateText("An interactive radiology story about checking an image, comparing clues, and communicating observations for specialist review.", 'id') };

export default function Page() { return <RadiologyGame/>; }
