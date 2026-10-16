import { translateText } from "@/app/i18n/translate";
import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import Navbar from "./components/explore/navbar";
import Footer from "./components/explore/footer";
import { LanguageProvider } from "./i18n/provider";
import "./globals.css";
import "./simulation-theme.css";
import "./page-theme.css";
import "./i18n/language.css";

const geistSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: translateText("Find Your Path", 'id'),
  description: translateText("Explore university majors through real-world task previews. Follow your curiosity and discover a future that feels like you.", 'id'),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body><LanguageProvider><Navbar /><div className="page-content"><div className="hero-divider" aria-hidden="true" />{children}</div><Footer /></LanguageProvider></body>
    </html>
  );
}
