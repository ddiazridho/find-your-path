import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  setting: {"room":"Electronics lab","workspaceTitle":"Build a button-controlled LED","narration":"The electronics bench is ready. Alex lays out a battery, a switch, a resistor, and one small red LED."},
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
};
