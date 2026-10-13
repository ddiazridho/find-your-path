import type { Metadata } from "next";
import MedicineFrame from "../components/MedicineFrame";
import SurgerySimulation from "../components/SurgerySimulation";
export const metadata: Metadata = { title: "The Operation Decision | Medicine Lab" };
export default function Page() { return <MedicineFrame current="/medicine/surgery" eyebrow="02 / Surgery" title="The Operation Decision" intro="The operating team is ready—but one detail is still unclear. Help prepare the room and confirm the plan before anyone proceeds."><SurgerySimulation /></MedicineFrame>; }
