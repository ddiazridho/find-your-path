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

export const lawFields = [
  { href: "/law/criminal-law", title: "Criminal Law", description: "A missing necklace and a fair trial", field: "criminal" },
  { href: "/law/civil-law", title: "Civil Law", description: "A storm, a shared wall and two neighbors", field: "civil" },
  { href: "/law/business-commercial-law", title: "Business & Commercial Law", description: "An unfinished bakery order", field: "business" },
  { href: "/law/constitutional-administrative-law", title: "Constitutional & Administrative Law", description: "A park closure and a neighborhood's voice", field: "constitutional" },
] as const;

export { criminalStory, civilStory, businessStory, constitutionalStory };
