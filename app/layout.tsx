import type { Metadata, Viewport } from "next";

import "./globals.css";
import { pixelFont, termFont } from "@/lib/fonts";
import { site } from "@/lib/site";
import { ArcadeCanvas } from "@/components/three/ArcadeCanvas";
import { AudioBridge } from "@/components/overlay/AudioBridge";
import { CrtFilters } from "@/components/overlay/CrtFilters";
import { HudNav } from "@/components/overlay/HudNav";
import { RouteSync } from "@/components/overlay/RouteSync";
import { SystemBar } from "@/components/overlay/SystemBar";
import { PersonJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/api/og"],
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: "#04040a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pixelFont.variable} ${termFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-neon-pink focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:text-void"
        >
          Skip to content
        </a>

        <CrtFilters />

        {/* The scene lives outside the routed children so navigation is a
            camera move rather than a teardown and rebuild. */}
        <ArcadeCanvas />

        {/* Mounted above `main` on purpose: its effect writes the route into
            the store before any page's effects read `isTransitioning`. */}
        <RouteSync />
        <AudioBridge />

        <HudNav />
        <main id="content">{children}</main>
        <SystemBar />

        <PersonJsonLd />
      </body>
    </html>
  );
}
