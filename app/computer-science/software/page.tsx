import type { Metadata } from "next";
import DioramaCanvas from "../../components/software-room/DioramaCanvas";

export const metadata: Metadata = {
  title: "Computer Science: Software Track — Find Your Path",
  description: "Step into an interactive 3D isometric office room. Explore core roles of a Software Engineer through hands-on coding, algorithm logic, and SQL query simulations.",
};

export default function SoftwareTrackPage() {
  return <DioramaCanvas initialModal="none" />;
}
