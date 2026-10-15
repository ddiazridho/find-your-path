import { field as emergencyField } from "./emergency/field";
import { field as surgeryField } from "./surgery/field";
import { field as pediatricsField } from "./pediatrics/field";
import { field as radiologyField } from "./radiology/field";

export const medicineTracks = [emergencyField, surgeryField, pediatricsField, radiologyField] as const;
