import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://flipon.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/test`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/join`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/presentation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/commencer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tarifs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
