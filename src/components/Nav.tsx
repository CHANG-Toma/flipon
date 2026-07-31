"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/presentation", label: "Présentation" },
  { href: "/test", label: "Essayer" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur-md",
        onHome
          ? "border-white/10 bg-[#121212]/80"
          : "border-line/80 bg-petal/90",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className={[
            "font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight",
            onHome ? "text-white" : "text-ink",
          ].join(" ")}
        >
          Flip<span className="text-coral">On</span>
        </Link>

        <nav className="flex items-center gap-0.5" aria-label="Principal">
          {links.map((link) => {
            const active = pathname === link.href;
            const isTry = link.href === "/test";
            if (isTry) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "ml-1 rounded-[var(--radius-ui)] bg-coral px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-deep",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-[var(--radius-ui)] px-3 py-2 text-sm font-medium transition-colors",
                  onHome
                    ? active
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                    : active
                      ? "bg-sky text-coral-deep"
                      : "text-ink-soft hover:bg-foam hover:text-ink",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
