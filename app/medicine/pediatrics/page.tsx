import type { Metadata } from "next";
import MedicineFrame from "../components/MedicineFrame";
import PediatricsSimulation from "../components/PediatricsSimulation";
export const metadata: Metadata = { title: "The Child Who Won't Play | Medicine Lab" };
export default function Page() { return <MedicineFrame current="/medicine/pediatrics" eyebrow="03 / Pediatrics" title="The Child Who Won't Play" intro="Milo usually runs straight to the toy shelf. Today he stays close to his parent. Help him feel safe while you gather a clear story for the doctor."><PediatricsSimulation /></MedicineFrame>; }
