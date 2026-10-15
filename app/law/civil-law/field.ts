import type { FieldLink } from "../../major-types";
import type { LawField } from "../stories";

export const field = { href: "/law/civil-law", title: "Civil Law", description: "A storm, a shared wall and two neighbors", field: "civil" } as const satisfies FieldLink & { field: LawField };
