import { Geist, IBM_Plex_Mono } from "next/font/google";

export const sansFont = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-loaded",
});

export const monoFont = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});
