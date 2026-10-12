export type Category = "All majors" | "Technology" | "Business" | "Design" | "Social sciences" | "Health";

export type Major = {
  id: string;
  name: string;
  category: Exclude<Category, "All majors">;
  description: string;
  task: string;
  minutes: number;
  skills: string[];
  visual: "code" | "business" | "design" | "psychology" | "health" | "architecture";
  color: string;
};

// Preview content. Replace this collection with your backend response.
export const majors: Major[] = [
  { id: "computer-science", name: "Computer Science", category: "Technology", description: "Turn a tricky problem into something that just works.", task: "Think like a developer", minutes: 15, skills: ["Logic", "Problem solving"], visual: "code", color: "mint" },
  { id: "business-management", name: "Business Management", category: "Business", description: "Make the big decisions behind a small business.", task: "Launch your first idea", minutes: 20, skills: ["Strategy", "Decision making"], visual: "business", color: "peach" },
  { id: "visual-communication", name: "Visual Communication", category: "Design", description: "Give an idea a voice people can see and feel.", task: "Shape a brand story", minutes: 20, skills: ["Creativity", "Communication"], visual: "design", color: "lilac" },
  { id: "psychology", name: "Psychology", category: "Social sciences", description: "Look a little closer at what makes people, people.", task: "Understand a human story", minutes: 15, skills: ["Empathy", "Observation"], visual: "psychology", color: "sky" },
  { id: "medicine", name: "Medicine", category: "Health", description: "Connect the clues and put someone’s wellbeing first.", task: "Explore a patient case", minutes: 20, skills: ["Analysis", "Care"], visual: "health", color: "rose" },
  { id: "architecture", name: "Architecture", category: "Design", description: "Imagine spaces that make everyday life better.", task: "Rethink a shared space", minutes: 25, skills: ["Spatial thinking", "Creativity"], visual: "architecture", color: "sand" },
];

export const categories: Category[] = ["All majors", "Technology", "Business", "Design", "Social sciences", "Health"];
