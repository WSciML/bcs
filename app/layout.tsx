import type { Metadata, Viewport } from "next";
import { Libertinus_Math, Mona_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Boulder Computational Solutions",
  description:
    "We recover the equations hidden in noisy data, and the parameters that drive them.",
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
      <body>{children}</body>
    </html>
  );
}
