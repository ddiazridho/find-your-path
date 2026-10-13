import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { criminalStory } from "../stories";

export const metadata: Metadata = { title: "Criminal Law | Find Your Path", description: "Explore criminal responsibility and justice through an interactive story." };
export default function CriminalLawPage() { return <StoryExperience story={criminalStory} />; }
