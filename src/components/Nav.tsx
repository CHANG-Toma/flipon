"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil", short: "Home" },
  { href: "/presentation", label: "Présentation", short: "Info" },
  { href: "/tarifs", label: "Tarifs", short: "Prix" },
  { href: "/test", label: "Essayer", short: "Essayer" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur-md",
        "pt-[env(safe-area-inset-top)]",
        onHome
          ? "border-white/10 bg-[#0a0a0a]/90"
          : "border-line/80 bg-petal/95",
      ].join(" ")}
    >
      <div className="page-gutter mx-auto flex h-12 max-w-5xl items-center justify-between gap-2 sm:h-14 sm:gap-4">
        <Link
          href="/"
          className={[
            "shrink-0 font-[family-name:var(--font-display)] text-base font-extrabold tracking-tight sm:text-lg",
            onHome ? "text-white" : "text-ink",
          ].join(" ")}
        >
          Flip<span className="text-coral">On</span>
        </Link>

        <nav
          className="flex min-w-0 items-center gap-0.5"
          aria-label="Principal"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            const isTry = link.href === "/test";
            if (isTry) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className="ml-1 inline-flex min-h-10 items-center rounded-[var(--radius-ui)] bg-coral px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-deep sm:min-h-9 sm:px-3.5"
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
                  "inline-flex min-h-10 items-center rounded-[var(--radius-ui)] px-2.5 py-2 text-xs font-medium transition-colors sm:min-h-9 sm:px-3 sm:text-sm",
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
                <span className="sm:hidden">{link.short}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
