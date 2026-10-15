import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { businessStory } from "../stories";

export const metadata: Metadata = { title: "Business & Commercial Law | Find Your Path", description: "Explore business contracts and transactions through an interactive story." };
export default function BusinessCommercialLawPage() { return <StoryExperience story={businessStory} />; }
