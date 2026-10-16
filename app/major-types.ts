export type Category = "All majors" | "Technology" | "Business" | "Design" | "Social sciences" | "Health";

export type Simulation = {
  id: string;
  name: string;
  image: string;
  alt: string;
  href: string;
};

export type Major = {
  id: string;
  name: string;
  category: Exclude<Category, "All majors">;
  description: string;
  task: string;
  minutes: number;
  skills: string[];
  visual: "code" | "business" | "design" | "psychology" | "health" | "architecture" | "law";
  color: string;
  preview: MajorPreview;
};


export type FieldLink = {
  href: string;
  title: string;
  subtitle?: string;
  description: string;
};

export type MajorPreview =
  | { kind: "coming-soon"; message: string }
  | { kind: "simulation"; simulations: Simulation[] }
  | { kind: "fields"; label: string; intro: string; fields: readonly FieldLink[] };
