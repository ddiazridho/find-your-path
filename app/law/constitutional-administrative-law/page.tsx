import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { constitutionalStory } from "../stories";

export const metadata: Metadata = { title: "Constitutional & Administrative Law | Find Your Path", description: "Explore government decisions and constitutional limits through an interactive story." };
export default function ConstitutionalAdministrativeLawPage() { return <StoryExperience story={constitutionalStory} />; }
