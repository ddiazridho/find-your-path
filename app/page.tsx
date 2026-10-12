import Explore from "./components/explore";
import { majors } from "./majors";

export default function Home() {
  return <Explore majors={majors} />;
}
