import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { civilStory } from "../stories";

export const metadata: Metadata = { title: translateText("Civil Law | Find Your Path", 'id'), description: translateText("Explore contracts, property and civil disputes through an interactive story.", 'id') };
export default function CivilLawPage() { return <StoryExperience story={civilStory} />; }
