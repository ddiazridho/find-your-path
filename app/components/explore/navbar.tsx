"use client";
import { useTranslation } from "@/app/i18n/provider";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Languages } from "lucide-react";

export default function Navbar() {
  const { t: tx, locale: language, setLocale } = useTranslation();
  const pathname = usePathname();
  const backHref = pathname === "/quiz/results" ? "/quiz"
    : pathname.startsWith("/computer-science/software/simulation/") ? "/computer-science/software"
    : pathname.startsWith("/computer-science/") || pathname.startsWith("/medicine/") || pathname.startsWith("/law/") ? "/#explore"
    : "/";

  return (
    <header className="global-navbar">
      <nav className="container global-navbar-inner" aria-label={tx("Navigasi utama")}>
        {pathname !== "/" && <Link href={backHref} className="global-navbar-back" aria-label={tx("Kembali")}><ArrowLeft size={22} aria-hidden="true" /></Link>}
        <Link href="/" className="global-navbar-logo" aria-label={tx("Find Your Path home")}>
          <Image src="/logo.png" alt={tx("FYP")} width={108} height={108} priority />
        </Link>
        <button type="button" className="global-navbar-language" onClick={() => setLocale(language === "en" ? "id" : "en")} aria-label={language === "en" ? "Ganti bahasa ke Bahasa Indonesia" : "Switch language to English"} lang={language === "en" ? "id" : "en"}>
          <Languages size={19} aria-hidden="true" /><span>{language === "en" ? "Bahasa Indonesia" : "English"}</span>
        </button>
      </nav>
    </header>
  );
}
