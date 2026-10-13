export type Category = "All majors" | "Technology" | "Business" | "Design" | "Social sciences" | "Health";

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
};

// Preview content. Replace this collection with your backend response.
export const majors: Major[] = [
  { id: "computer-science", name: "Computer Science", category: "Technology", description: "Turn a tricky problem into something that just works. Learn by experimenting, solving problems, and discovering better ways to make things work.", task: "Think like a developer", minutes: 15, skills: ["Logic", "Problem solving"], visual: "code", color: "mint" },
  { id: "law", name: "Law", category: "Social sciences", description: "Step into a case, weigh the evidence, and see how your decisions shape justice.", task: "Explore a legal story", minutes: 15, skills: ["Reasoning", "Perspective"], visual: "law", color: "peach" },
  { id: "medicine", name: "Medicine", category: "Health", description: "Connect the clues and put someone’s wellbeing first.", task: "Explore a patient case", minutes: 20, skills: ["Analysis", "Care"], visual: "health", color: "rose" },
];

export const categories: Category[] = ["All majors", "Technology", "Business", "Social sciences", "Health"];
