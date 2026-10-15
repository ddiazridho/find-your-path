import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  setting: {"room":"Computer networks lab","workspaceTitle":"Build a simple computer network","narration":"Two computers wait on the network bench. Mr. Jordan invites you to make their first connection."},
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
};
