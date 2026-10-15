import type { Major } from "../major-types";
import { lawFields } from "./fields";

export const lawMajor: Major = { id: "law", name: "Law", category: "Social sciences", description: "Step into a case, weigh the evidence, and see how your decisions shape justice.", task: "Explore a legal story", minutes: 15, skills: ["Reasoning", "Perspective"], visual: "law", color: "peach",
  preview: {
    kind: "fields",
    label: "Choose a law field",
    intro: "Choose a case to enter. Your decisions will change what happens next.",
    fields: lawFields,
  },
};
