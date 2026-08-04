"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { normalizeLang, type Lang } from "@/lib/i18n";

export function LangSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang: Lang = normalizeLang(searchParams.get("lang"));
  const isEn = lang === "en";

  const langHref = (target: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target === "fr") params.delete("lang");
    else params.set("lang", "en");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 rounded-full border border-line bg-white/95 p-1 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <Link
          href={langHref("fr")}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            !isEn ? "bg-sky text-coral-deep" : "text-ink-soft hover:text-ink",
          ].join(" ")}
          aria-label="Passer en français"
        >
          FR
        </Link>
        <Link
          href={langHref("en")}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            isEn ? "bg-sky text-coral-deep" : "text-ink-soft hover:text-ink",
          ].join(" ")}
          aria-label="Switch to English"
        >
          EN
        </Link>
      </div>
    </div>
  );
}
