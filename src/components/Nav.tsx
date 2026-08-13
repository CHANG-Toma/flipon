"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { normalizeLang, type Lang, withLang } from "@/lib/i18n";

type Tab = {
  href: string;
  label: { fr: string; en: string };
  match: (path: string) => boolean;
  icon: (active: boolean) => ReactNode;
};

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5.5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 13.6 9H19l-4.4 3.3L16.2 18 12 14.8 7.8 18l1.6-5.7L5 9h5.4L12 3.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlay({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 6.8v10.4L18 12 8.5 6.8Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
      />
      <path
        d="M5.5 19.2c.9-2.4 3.3-4 6.5-4s5.6 1.6 6.5 4"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

const tabs: Tab[] = [
  {
    href: "/",
    label: { fr: "Accueil", en: "Home" },
    match: (path) => path === "/",
    icon: (active) => <IconHome active={active} />,
  },
  {
    href: "/presentation",
    label: { fr: "Présentation", en: "Overview" },
    match: (path) => path.startsWith("/presentation"),
    icon: (active) => <IconSpark active={active} />,
  },
  {
    href: "/test",
    label: { fr: "Essayer", en: "Try" },
    match: (path) => path.startsWith("/test"),
    icon: (active) => <IconPlay active={active} />,
  },
  {
    href: "/join",
    label: { fr: "Rejoindre", en: "Join" },
    match: (path) => path.startsWith("/join"),
    icon: (active) => <IconUser active={active} />,
  },
];

export function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang: Lang = normalizeLang(searchParams.get("lang"));
  const onHome = pathname === "/";
  const onStart = pathname.startsWith("/commencer");
  const isLogin = onStart && searchParams.get("mode") === "login";
  const isEn = lang === "en";

  return (
    <header className={["site-nav", onStart ? "is-auth" : ""].filter(Boolean).join(" ")}>
      <div className="site-nav-inner page-gutter">
        <Link
          href={withLang("/", lang)}
          className={[
            "site-nav-logo",
            onStart ? "is-auth-logo" : onHome ? "is-home" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          Flip<span>On</span>
        </Link>

        <nav className="site-tabbar-pill" aria-label={isEn ? "Main" : "Principal"}>
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={withLang(tab.href, lang)}
                prefetch
                className={["site-tab", active ? "is-active" : ""].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {tab.icon(active)}
                <span>{tab.label[lang]}</span>
              </Link>
            );
          })}
        </nav>

        <div className="site-nav-actions">
          <LangSwitcher />
          {onStart ? (
            <Link
              href={withLang(isLogin ? "/commencer" : "/commencer?mode=login", lang)}
              prefetch
              className="site-nav-cta site-nav-cta--ghost"
            >
              {isEn ? "Log in" : "Se connecter"}
            </Link>
          ) : (
            <Link href={withLang("/commencer", lang)} prefetch className="site-nav-cta">
              {isEn ? "Start" : "Commencer"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
