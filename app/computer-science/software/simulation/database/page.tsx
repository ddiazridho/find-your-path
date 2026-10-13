import type { Metadata } from "next";
import DatabaseSimulation from "../../../../components/software-room/DatabaseSimulation";

export const metadata: Metadata = {
  title: "Database & SQL Query Simulation — Computer Science (Software Track)",
  description: "Hands-on SQL query console simulator. Query live cloud database clusters and inspect telemetry data.",
};

export default function DatabasePage() {
  return <DatabaseSimulation isModal={false} />;
}
