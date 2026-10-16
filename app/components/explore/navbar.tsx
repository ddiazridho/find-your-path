"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const backHref = pathname === "/quiz/results" ? "/quiz"
    : pathname.startsWith("/computer-science/software/simulation/") ? "/computer-science/software"
    : pathname.startsWith("/computer-science/") || pathname.startsWith("/medicine/") || pathname.startsWith("/law/") ? "/#explore"
    : "/";

  return (
    <header className="global-navbar">
      <nav className="container global-navbar-inner" aria-label="Navigasi utama">
        {pathname !== "/" && <Link href={backHref} className="global-navbar-back" aria-label="Kembali"><ArrowLeft size={22} aria-hidden="true" /></Link>}
        <Link href="/" className="global-navbar-logo" aria-label="Find Your Path home">
          <Image src="/logo.png" alt="FYP" width={108} height={108} priority />
        </Link>
      </nav>
    </header>
  );
}
