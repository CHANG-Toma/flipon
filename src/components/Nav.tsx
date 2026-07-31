"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/presentation", label: "Présentation" },
  { href: "/test", label: "Tester" },
];

export function Nav() {
  const pathname = usePathname();
  const onHero = pathname === "/";

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className={[
            "font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight sm:text-2xl",
            onHero ? "text-white" : "text-ink",
          ].join(" ")}
        >
          Flip<span className="text-coral">On</span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "px-2.5 py-2 text-sm font-medium transition-colors sm:px-3.5 sm:text-[15px]",
                  active
                    ? onHero
                      ? "text-white"
                      : "text-coral"
                    : onHero
                      ? "text-white/65 hover:text-white"
                      : "text-ink-soft hover:text-ink",
                ].join(" ")}
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
