export type Lang = "fr" | "en";

type SearchParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

// Permet de normaliser la langue
export function normalizeLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : "fr";
}
// Permet de récupérer la langue depuis les paramètres de la requête
export function getLang(searchParams?: SearchParamsInput): Lang {
  if (!searchParams) return "fr";
  if (searchParams instanceof URLSearchParams) {
    return normalizeLang(searchParams.get("lang"));
  }
  const raw = searchParams.lang;
  return normalizeLang(Array.isArray(raw) ? raw[0] : raw);
}

// Permet de construire une URL avec la langue
export function withLang(href: string, lang: Lang): string {
  if (lang === "fr") return href;
  const hasQuery = href.includes("?");
  return `${href}${hasQuery ? "&" : "?"}lang=en`;
}
