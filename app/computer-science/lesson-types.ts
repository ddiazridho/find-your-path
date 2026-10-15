export type Track = "software" | "embedded-system" | "networking" | "multimedia";
export type LessonStep = { title: string; instruction: string; hint: string; example?: string };

export type Lesson = {
  setting: { room: string; workspaceTitle: string; narration: string };
  name: string;
  title: string;
  teacher: string;
  role: string;
  duration: string;
  dialogue: string[];
  start: string;
  outcome: string;
  steps: LessonStep[];
};
