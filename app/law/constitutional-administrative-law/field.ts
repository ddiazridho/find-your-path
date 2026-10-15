import type { FieldLink } from "../../major-types";
import type { LawField } from "../stories";

export const field = { href: "/law/constitutional-administrative-law", title: "Constitutional & Administrative Law", description: "A park closure and a neighborhood's voice", field: "constitutional" } as const satisfies FieldLink & { field: LawField };
