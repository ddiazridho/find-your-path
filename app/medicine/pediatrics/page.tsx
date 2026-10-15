import type { Metadata } from "next";
import PediatricsGame from "./PediatricsGame";
export const metadata: Metadata = { title: "The Child Who Won't Play | Medicine Lab", description: "An interactive pediatric story about listening to a child, spotting signs of dehydration, and reassuring the family." };
export default function Page() { return <PediatricsGame />; }
