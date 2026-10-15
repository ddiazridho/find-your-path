import type { FieldLink } from "../../major-types";
import type { LawField } from "../stories";

export const field = { href: "/law/business-commercial-law", title: "Business & Commercial Law", description: "An unfinished bakery order", field: "business" } as const satisfies FieldLink & { field: LawField };
