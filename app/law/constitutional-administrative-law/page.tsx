import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import StoryExperience from "../StoryExperience";
import { constitutionalStory } from "../stories";

export const metadata: Metadata = { title: translateText("Constitutional & Administrative Law | Find Your Path", 'id'), description: translateText("Explore government decisions and constitutional limits through an interactive story.", 'id') };
export default function ConstitutionalAdministrativeLawPage() { return <StoryExperience story={constitutionalStory} />; }
