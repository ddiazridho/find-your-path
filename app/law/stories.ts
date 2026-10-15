import { criminalStory } from "./story-data/criminal";
import { civilStory } from "./story-data/civil";
import { businessStory } from "./story-data/business";
import { constitutionalStory } from "./story-data/constitutional";

export type LawField = "criminal" | "civil" | "business" | "constitutional";
export type StoryVisual = "court" | "witness" | "evidence" | "flashback" | "verdict" | "garden" | "storm" | "records" | "mediation" | "bakery" | "delivery" | "order" | "negotiation" | "park" | "notice" | "office" | "meeting";

export type StoryChoice = { label: string; hint: string; next: string };
export type StoryScene = {
  chapter: string;
  place: string;
  speaker: string;
  dialogue: string;
  narration: string;
  visual: StoryVisual;
  artifact?: { label: string; text: string };
  next?: string;
  choices?: StoryChoice[];
  ending?: { title: string; outcome: string; concepts: string[] };
};
export type LawStory = {
  field: LawField;
  title: string;
  subtitle: string;
  scope: string;
  premise: string;
  cast: [string, string];
  scenes: Record<string, StoryScene>;
};

export { lawFields } from "./fields";

export { criminalStory, civilStory, businessStory, constitutionalStory };
