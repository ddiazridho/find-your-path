import Link from "next/link";
import Icon from "../ui-icon";

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={minimal ? "/" : "#"} className="brand" aria-label="Find Your Path home">
          <span className="brand-symbol"><Icon name="compass" /></span>
          <span>find your path<span className="brand-period">.</span></span>
        </Link>
      </div>
    </header>
  );
}
