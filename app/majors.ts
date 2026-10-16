import { computerScienceMajor } from "./computer-science/major";
import { lawMajor } from "./law/major";
import { medicineMajor } from "./medicine/major";
import { businessAdministrationMajor } from "./business-administration/major";
import type { Category, Major } from "./major-types";

export type { Category, Major, Simulation } from "./major-types";

export const majors: Major[] = [computerScienceMajor, lawMajor, medicineMajor, businessAdministrationMajor];

export const categories: Category[] = ["All majors", "Technology", "Business", "Social sciences", "Health"];
