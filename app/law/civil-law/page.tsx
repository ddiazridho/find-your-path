import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { civilStory } from "../stories";

export const metadata: Metadata = { title: "Civil Law | Find Your Path", description: "Explore contracts, property and civil disputes through an interactive story." };
export default function CivilLawPage() { return <StoryExperience story={civilStory} />; }
