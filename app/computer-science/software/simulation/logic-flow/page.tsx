import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import LogicFlowSimulation from "../../components/LogicFlowSimulation";

export const metadata: Metadata = {
  title: translateText("Logic & Flowchart Simulation — Computer Science (Software Track)", 'id'),
  description: translateText("Hands-on algorithm and system logic architecture simulator. Design decision trees and test an autonomous rover.", 'id'),
};

export default function LogicFlowPage() {
  return <LogicFlowSimulation isModal={false} />;
}
