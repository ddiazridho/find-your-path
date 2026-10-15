import { field as criminalLawField } from "./criminal-law/field";
import { field as civilLawField } from "./civil-law/field";
import { field as businessCommercialLawField } from "./business-commercial-law/field";
import { field as constitutionalAdministrativeLawField } from "./constitutional-administrative-law/field";

export const lawFields = [criminalLawField, civilLawField, businessCommercialLawField, constitutionalAdministrativeLawField] as const;
