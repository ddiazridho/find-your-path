import Explore from "./components/explore";
import { majors } from "./majors";
import { Suspense } from "react";

export default function Home() {
  return <Suspense><Explore majors={majors} /></Suspense>;
}
