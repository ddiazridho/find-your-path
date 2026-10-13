import type { Metadata } from "next";
import MedicineFrame from "../components/MedicineFrame";
import RadiologySimulation from "../components/RadiologySimulation";
export const metadata: Metadata = { title: "What's Inside the Image? | Medicine Lab" };
export default function Page() { return <MedicineFrame current="/medicine/radiology" eyebrow="04 / Radiology" title="What's Inside the Image?" intro="After a fall, a patient has arm pain. Explore an illustrated X-ray, compare it with a normal view, and mark what a specialist should review."><RadiologySimulation /></MedicineFrame>; }
