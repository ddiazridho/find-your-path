export type Track = "software" | "embedded-system" | "networking" | "multimedia";
export type LessonStep = { title: string; instruction: string; hint: string; example?: string };
export const lessons: Record<Track, {
  name: string; title: string; teacher: string; role: string; duration: string;
  dialogue: string[]; start: string; outcome: string; steps: LessonStep[];
}> = {
  software: {
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
  },
  "embedded-system": {
    name: "Embedded System", title: "A small button. A bright idea.", teacher: "Alex", role: "Electronics lab assistant", duration: "15 minutes",
    dialogue: [
      "Welcome to the electronics lab. Today, we will make an LED light up only while a push button is pressed.",
      "Our breadboard is the base. A 3 V battery supplies energy, a push button opens or closes the circuit, and a 220 ohm resistor limits the current through the LED.",
      "First identify and place the parts, then connect the labeled terminals in order. Finally, hold the button and watch the LED. This is a simplified virtual circuit; no physical equipment is needed.",
    ], start: "Start assembling now", outcome: "You assembled and tested a button-controlled LED circuit.",
    steps: [
      { title: "Meet the components", instruction: "Explore the four components in the tray. Add the 3 V battery to its labeled position on the breadboard.", hint: "The battery is the power source. Its + terminal begins our circuit; its − terminal is the return path." },
      { title: "Add the switch", instruction: "Place the push button on the breadboard. It will close the circuit while you hold it down.", hint: "Drag the push button onto its matching slot, or select it in the tray to place it." },
      { title: "Protect the LED", instruction: "Place the 220 ohm resistor and the LED in their matching slots.", hint: "The resistor limits current. The LED's anode (+) accepts current and its cathode (−) returns it." },
      { title: "Close the loop", instruction: "Click two terminal dots to connect a wire. Build this loop: Battery + → Button A, Button B → Resistor A, Resistor B → LED +, LED − → Battery −.", hint: "Each wire joins exactly two labeled terminals. Select a wire in the connection list to remove it if you make a mistake." },
      { title: "Let there be light", instruction: "Press and hold the test button to turn the LED on, then release it to turn it off. Review your working circuit.", hint: "The circuit only works when all four correct wires are present. You can also focus the test button and hold Space or Enter." },
    ],
  },
  networking: {
    name: "Networking", title: "Make your first connection.", teacher: "Mr. Jordan", role: "Computer networks instructor", duration: "20 minutes",
    dialogue: [
      "Welcome! Today, we are building a small local network, like the ones that connect computers in this classroom.",
      "Two PCs will connect to a switch. Each PC needs its own IP address on the same subnet. A router provides a gateway to other networks.",
      "In our network simulator, select two devices to connect them, assign IP addresses, then send a ping. The moving envelope shows how a packet travels through your network. We will check each mission together.",
    ], start: "Start creating simple network", outcome: "You connected devices, configured IP addresses, and tested a local network.",
    steps: [
      { title: "Connect the computers", instruction: "Select PC-1, then Switch to add a cable. Repeat for PC-2 and Switch.", hint: "A switch connects devices within a local network. Both computers need a cable to the switch." },
      { title: "Give each PC an address", instruction: "Set PC-1 to 192.168.1.10 and PC-2 to 192.168.1.11. Both use subnet mask 255.255.255.0.", hint: "Addresses on this /24 subnet share the first three numbers. Each device must have a unique final number." },
      { title: "Send your first packet", instruction: "Choose PC-1 as the source and PC-2 as the destination, then click Send ping. Watch the envelope cross the switch.", hint: "Ping checks whether another device can be reached. If it fails, review your cables and IP addresses." },
      { title: "Add the gateway", instruction: "Connect Router to Switch. Keep its address at 192.168.1.1. Send a successful ping from PC-1 to Router.", hint: "A router joins different networks. In this exercise, we test that the local gateway is reachable." },
    ],
  },
  multimedia: {
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
  },
};
