import type { FieldLink } from "../../major-types";
import type { LawField } from "../stories";

export const field = { href: "/law/criminal-law", title: "Criminal Law", description: "A missing necklace and a fair trial", field: "criminal" } as const satisfies FieldLink & { field: LawField };
