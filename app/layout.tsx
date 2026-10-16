import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import Navbar from "./components/explore/navbar";
import Footer from "./components/explore/footer";
import "./globals.css";
import "./simulation-theme.css";
import "./page-theme.css";

const geistSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Your Path",
  description: "Explore university majors through real-world task previews. Follow your curiosity and discover a future that feels like you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body><Navbar /><div className="page-content"><div className="hero-divider" aria-hidden="true" />{children}</div><Footer /></body>
    </html>
  );
}
