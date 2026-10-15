import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  setting: {"room":"Web development classroom","workspaceTitle":"Build your first website","narration":"Sunlight falls across the classroom. Dr. Maya has a fresh project on the board and a place ready for you."},
  name: "Software", title: "Your first corner of the web.", teacher: "Dr. Maya", role: "Web development lecturer", duration: "15 minutes",
  dialogue: [
    "Welcome to the classroom! Today, you are the developer. We are building a small website about you, one line at a time.",
    "HTML gives a page its structure. A heading introduces it, a paragraph tells your story, and a list organizes your ideas. CSS gives it a little personality.",
    "You will write real HTML in the editor and see your website appear beside it. Review each step before moving on. Experiment freely; mistakes are part of learning.",
  ], start: "Start creating website", outcome: "You built a personal website using HTML and CSS.",
  steps: [
    { title: "Say hello", instruction: "Create a main heading that says Hello World. Type the opening tag, your text, and the closing tag in the editor.", hint: "An h1 is the most important heading on a page. Close it with </h1>.", example: "<h1>Hello World</h1>" },
    { title: "Tell your story", instruction: "Keep your heading. Under it, add a paragraph about one of your current goals. Write at least 15 characters.", hint: "Put your own goal between <p> and </p>. Your words can be different from this example.", example: "<p>My goal is to build things that help people.</p>" },
    { title: "Make a plan", instruction: "Add an unordered list with at least three things you would like to learn. Keep your heading and paragraph.", hint: "The ul element wraps the list. Each item goes in its own li element.", example: "<ul>\n  <li>Write HTML</li>\n  <li>Design with CSS</li>\n  <li>Build a website</li>\n</ul>" },
    { title: "Connect an idea", instruction: "Add a link to a website that inspires you. Use a full https:// address and give the link some meaningful text.", hint: "The href attribute holds the destination. The text between the tags is what visitors click.", example: '<a href="https://developer.mozilla.org">Explore web development</a>' },
    { title: "Give it personality", instruction: "Add a style element. Set the body background-color to #f4f7ef and the h1 color to #265c45. Keep all your HTML from the earlier steps.", hint: "CSS rules pair a selector with declarations inside braces. Put the rules inside <style> tags.", example: "<style>\n  body { background-color: #f4f7ef; }\n  h1 { color: #265c45; }\n</style>" },
  ],
};
