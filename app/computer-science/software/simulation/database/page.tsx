import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import DatabaseSimulation from "../../components/DatabaseSimulation";

export const metadata: Metadata = {
  title: translateText("Database & SQL Query Simulation — Computer Science (Software Track)", 'id'),
  description: translateText("Hands-on SQL query console simulator. Query live cloud database clusters and inspect telemetry data.", 'id'),
};

export default function DatabasePage() {
  return <DatabaseSimulation isModal={false} />;
}
