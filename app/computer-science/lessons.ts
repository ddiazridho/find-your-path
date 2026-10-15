import { lesson as softwareLesson } from "./software/lesson";
import { lesson as embeddedLesson } from "./embedded-system/lesson";
import { lesson as networkingLesson } from "./networking/lesson";
import { lesson as multimediaLesson } from "./multimedia/lesson";
import type { Lesson, Track } from "./lesson-types";

export type { LessonStep, Track } from "./lesson-types";

export const lessons: Record<Track, Lesson> = {
  software: softwareLesson,
  "embedded-system": embeddedLesson,
  networking: networkingLesson,
  multimedia: multimediaLesson,
};
