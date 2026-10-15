import type { Metadata } from "next";
import LogicFlowSimulation from "../../components/LogicFlowSimulation";

export const metadata: Metadata = {
  title: "Logic & Flowchart Simulation — Computer Science (Software Track)",
  description: "Hands-on algorithm and system logic architecture simulator. Design decision trees and test an autonomous rover.",
};

export default function LogicFlowPage() {
  return <LogicFlowSimulation isModal={false} />;
}
