import type { Metadata } from "next";
import MedicineFrame from "../components/MedicineFrame";
import EmergencySimulation from "../components/EmergencySimulation";
export const metadata: Metadata = { title: "The Critical Arrival | Medicine Lab" };
export default function Page() { return <MedicineFrame current="/medicine/emergency" eyebrow="01 / Emergency Medicine" title="The Critical Arrival" intro="A patient arrives short of breath. What do you notice, and how quickly can you get the right help? Take the assistant's place in this fictional emergency room."><EmergencySimulation /></MedicineFrame>; }
