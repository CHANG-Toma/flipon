export type Lang = "fr" | "en";

type SearchParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

export function normalizeLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : "fr";
}

export function getLang(searchParams?: SearchParamsInput): Lang {
  if (!searchParams) return "fr";
  if (searchParams instanceof URLSearchParams) {
    return normalizeLang(searchParams.get("lang"));
  }
  const raw = searchParams.lang;
  return normalizeLang(Array.isArray(raw) ? raw[0] : raw);
}

export function withLang(href: string, lang: Lang): string {
  if (lang === "fr") return href;
  const hasQuery = href.includes("?");
  return `${href}${hasQuery ? "&" : "?"}lang=en`;
}
