import type { Major } from "../major-types";
import { field as softwareField } from "./software/field";
import { field as embeddedSystemField } from "./embedded-system/field";
import { field as networkingField } from "./networking/field";
import { field as multimediaField } from "./multimedia/field";

export const computerScienceMajor: Major = { id: "computer-science", name: "Computer Science", category: "Technology", description: "Learn by experimenting and discovering better ways to make things work.", task: "Think like a developer", minutes: 15, skills: ["Logic", "Problem solving"], visual: "code", color: "mint",
  preview: { kind: "simulation", simulations: [softwareField, embeddedSystemField, networkingField, multimediaField] },
};
