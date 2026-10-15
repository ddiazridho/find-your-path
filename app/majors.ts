export type Category = "All majors" | "Technology" | "Business" | "Design" | "Social sciences" | "Health";

export type Simulation = {
  id: string;
  name: string;
  image: string;
  alt: string;
  href?: string;
};

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
  simulations?: Simulation[];
};

// Preview content. Replace this collection with your backend response.
export const majors: Major[] = [
  { id: "computer-science", name: "Computer Science", category: "Technology", description: "Turn a tricky problem into something that just works. Learn by experimenting, solving problems, and discovering better ways to make things work.", task: "Think like a developer", minutes: 15, skills: ["Logic", "Problem solving"], visual: "code", color: "mint", simulations: [
    { id: "software", name: "Software", image: "/simulations/software.svg", alt: "Software simulation preview", href: "/computer-science/software" },
    { id: "embedded-system", name: "Embedded System", image: "/simulations/hardware.svg", alt: "Embedded system simulation preview", href: "/computer-science/embedded-system" },
    { id: "networking", name: "Networking", image: "/simulations/networking.svg", alt: "Networking simulation preview", href: "/computer-science/networking" },
    { id: "multimedia", name: "Multimedia", image: "/simulations/multimedia.svg", alt: "Multimedia simulation preview", href: "/computer-science/multimedia" },
  ] },
  { id: "law", name: "Law", category: "Social sciences", description: "Make the big decisions behind a small business.", task: "Launch your first idea", minutes: 20, skills: ["Strategy", "Decision making"], visual: "business", color: "peach" },
  { id: "medicine", name: "Medicine", category: "Health", description: "Connect the clues and put someone’s wellbeing first.", task: "Explore a patient case", minutes: 20, skills: ["Analysis", "Care"], visual: "health", color: "rose" },
];

export const categories: Category[] = ["All majors", "Technology", "Business", "Design", "Social sciences", "Health"];
