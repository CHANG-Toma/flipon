import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://flipon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FlipOn — Fini le « on fait quoi ? »",
    template: "%s · FlipOn",
  },
  description:
    "Votez en privé sur votre téléphone. FlipOn sort l’activité que tout le monde accepte — potes, couple ou groupe.",
  applicationName: "FlipOn",
  authors: [{ name: "FlipOn" }],
  creator: "FlipOn",
  keywords: [
    "activité",
    "sortie",
    "vote",
    "amis",
    "couple",
    "groupe",
    "idée soirée",
    "FlipOn",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "FlipOn",
    title: "FlipOn — Fini le « on fait quoi ? »",
    description:
      "Votes privés. Une activité que tout le monde accepte.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlipOn — Fini le « on fait quoi ? »",
    description:
      "Votes privés. Une activité que tout le monde accepte.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FlipOn",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  description:
    "Chacun vote de son côté. FlipOn sort l’idée d’activité qui passe pour le groupe.",
  url: siteUrl,
  inLanguage: "fr-FR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full font-sans antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-ui)] focus:bg-coral focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Aller au contenu
        </a>
        <Nav />
        <div id="contenu">{children}</div>
      </body>
    </html>
  );
}
