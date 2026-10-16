import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { criminalStory } from "../stories";

export const metadata: Metadata = { title: translateText("Criminal Law | Find Your Path", 'id'), description: translateText("Explore criminal responsibility and justice through an interactive story.", 'id') };
export default function CriminalLawPage() { return <StoryExperience story={criminalStory} />; }
