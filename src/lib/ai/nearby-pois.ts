/**
 * Lieux réels autour d’une ville via OpenStreetMap (Nominatim + Overpass).
 * Pas de clé API — User-Agent obligatoire côté Nominatim.
 */
export type NearbyPoi = {
  name: string;
  category: string;
  lat: number;
  lon: number;
};

const UA =
  process.env.OSM_USER_AGENT?.trim() ||
  "FlipOn/1.0 (premium-deck; contact@flipon.app)";

type NominatimHit = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

type OverpassElement = {
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function categoryFromTags(tags: Record<string, string> | undefined): string {
  if (!tags) return "lieu";
  if (tags.leisure === "park") return "parc";
  if (tags.tourism === "museum") return "musée";
  if (tags.tourism === "attraction") return "attraction";
  if (tags.amenity === "cafe") return "café";
  if (tags.amenity === "restaurant") return "restaurant";
  if (tags.amenity === "bar") return "bar";
  if (tags.amenity === "cinema") return "cinéma";
  if (tags.amenity === "library") return "bibliothèque";
  if (tags.shop === "bakery") return "boulangerie";
  if (tags.leisure === "sports_centre") return "sport";
  return tags.amenity || tags.tourism || tags.leisure || tags.shop || "lieu";
}

export async function geocodeCity(
  cityLabel: string,
): Promise<{ lat: number; lon: number; label: string } | null> {
  const q = cityLabel.trim().slice(0, 80);
  if (q.length < 2) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": UA,
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as NominatimHit[];
  const hit = data[0];
  if (!hit?.lat || !hit?.lon) return null;
  return {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    label: hit.display_name?.split(",")[0]?.trim() || q,
  };
}

export async function fetchNearbyPois(
  cityLabel: string,
  radiusM = 2200,
  limit = 28,
): Promise<NearbyPoi[]> {
  const geo = await geocodeCity(cityLabel);
  if (!geo) return [];

  const query = `
[out:json][timeout:12];
(
  node["amenity"~"cafe|restaurant|bar|cinema|library"](around:${radiusM},${geo.lat},${geo.lon});
  node["leisure"~"park|sports_centre"](around:${radiusM},${geo.lat},${geo.lon});
  node["tourism"~"museum|attraction"](around:${radiusM},${geo.lat},${geo.lon});
  node["shop"="bakery"](around:${radiusM},${geo.lat},${geo.lon});
  way["leisure"="park"](around:${radiusM},${geo.lat},${geo.lon});
);
out center ${limit};
`.trim();

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": UA,
      Accept: "application/json",
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(14000),
  });
  if (!res.ok) return [];

  const data = (await res.json()) as { elements?: OverpassElement[] };
  const seen = new Set<string>();
  const pois: NearbyPoi[] = [];

  for (const el of data.elements ?? []) {
    const name = el.tags?.name?.trim();
    if (!name || name.length < 2) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (typeof lat !== "number" || typeof lon !== "number") continue;
    pois.push({
      name,
      category: categoryFromTags(el.tags),
      lat,
      lon,
    });
    if (pois.length >= limit) break;
  }

  return pois;
}
