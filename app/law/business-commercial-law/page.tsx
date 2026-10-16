import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { businessStory } from "../stories";

export const metadata: Metadata = { title: translateText("Business & Commercial Law | Find Your Path", 'id'), description: translateText("Explore business contracts and transactions through an interactive story.", 'id') };
export default function BusinessCommercialLawPage() { return <StoryExperience story={businessStory} />; }
