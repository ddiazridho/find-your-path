import type { Metadata } from "next";
import RadiologyGame from "./RadiologyGame";

export const metadata: Metadata = { title: "What's Inside the Image? | Medicine Lab", description: "An interactive radiology story about checking an image, comparing clues, and communicating observations for specialist review." };

export default function Page() { return <RadiologyGame/>; }
