import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FlipOn — Casser la routine à deux",
  description:
    "FlipOn matche un seul plan pour votre couple, en moins d’une minute. Fini le « on verra ».",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${syne.variable} ${figtree.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
