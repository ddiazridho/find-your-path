import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  setting: {"room":"Visual communication studio","workspaceTitle":"Design a product promotion poster","narration":"The studio is open. Ms. Riley pins today's brief to the board: a fresh promotion for Everyday."},
  name: "Multimedia", title: "Give a good idea a great poster.", teacher: "Ms. Riley", role: "Visual communication lecturer", duration: "20 minutes",
  dialogue: [
    "Welcome to the design studio! Your brief is to create a promotion poster for a reusable water bottle called Everyday.",
    "A useful poster has a clear headline, a product image, an offer, and a call to action. We will build that visual hierarchy by placing one element at a time.",
    "Drag elements onto the worksheet, or select them to add them. Then explore brightness, contrast, and saturation to make the product stand out. You can edit the copy, move elements, and download your finished poster.",
  ], start: "Start designing poster", outcome: "You designed a product poster and adjusted its image properties.",
  steps: [
    { title: "Lead with a headline", instruction: "Drag the headline into the upper part of the poster, inside the marked area.", hint: "Put the headline near the top (above 25% of the canvas). Select an element to edit its words or position." },
    { title: "Show the product", instruction: "Add the water bottle to the center of the poster. Place it between 30% and 65% down the canvas.", hint: "A strong product image is the visual focus. Drag it, use the position sliders, or use arrow keys on the selected element." },
    { title: "Make the offer", instruction: "Add the price and call to action near the bottom of the poster, below 70% of the canvas.", hint: "The offer explains the value; the call to action tells the viewer what to do next." },
    { title: "Find the right light", instruction: "Select the product and set brightness to 110% and contrast to 115%. Watch how the bottle changes.", hint: "Brightness changes lightness. Contrast increases the difference between light and dark details." },
    { title: "Bring out the color", instruction: "Set the product saturation to 120%. Review the full poster, keeping all four elements within their guide areas.", hint: "Saturation controls color intensity. A little adjustment can make the product more vivid without overpowering the message." },
  ],
};
