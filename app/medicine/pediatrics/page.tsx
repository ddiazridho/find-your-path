import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import PediatricsGame from "./PediatricsGame";
export const metadata: Metadata = { title: translateText("The Child Who Won't Play | Medicine Lab", 'id'), description: translateText("An interactive pediatric story about listening to a child, spotting signs of dehydration, and reassuring the family.", 'id') };
export default function Page() { return <PediatricsGame />; }
