import type { Metadata, Viewport } from "next";
import { Libertinus_Math, Mona_Sans } from "next/font/google";
import "./globals.css";
import { site } from "./site";

const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const math = Libertinus_Math({
  subsets: ["math", "latin", "greek"],
  weight: "400",
  variable: "--font-math",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: "Boulder Computational Solutions, Inc.",
      alternateName: "BCS",
      url: site.url,
      logo: `${site.url}/apple-icon.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Boulder",
        addressRegion: "CO",
        addressCountry: "US",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      alternateName: "BCS",
      url: site.url,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050608",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mona.variable} ${math.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
