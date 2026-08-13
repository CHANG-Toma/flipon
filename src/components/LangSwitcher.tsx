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
    <div className="flex items-center rounded-full border border-white/10 bg-[rgba(28,28,32,0.72)] p-0.5 backdrop-blur-md">
      <Link
        href={langHref("fr")}
        className={[
          "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
          !isEn ? "bg-white/15 text-white" : "text-white/55 hover:text-white",
        ].join(" ")}
        aria-label="Passer en français"
        aria-current={!isEn ? "true" : undefined}
      >
        FR
      </Link>
      <Link
        href={langHref("en")}
        className={[
          "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
          isEn ? "bg-white/15 text-white" : "text-white/55 hover:text-white",
        ].join(" ")}
        aria-label="Switch to English"
        aria-current={isEn ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}
