import type { Major } from "../major-types";
import { medicineTracks } from "./tracks";

export const medicineMajor: Major = { id: "medicine", name: "Medicine", category: "Health", description: "Connect the clues and put someone’s wellbeing first.", task: "Explore a patient case", minutes: 20, skills: ["Analysis", "Care"], visual: "health", color: "rose",
  preview: {
    kind: "fields",
    label: "Choose a medicine simulation",
    intro: "Enter a clinical learning space. Explore the room and try the hands-on activities.",
    fields: medicineTracks,
  },
};
