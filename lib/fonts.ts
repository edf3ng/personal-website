import { Press_Start_2P, JetBrains_Mono } from "next/font/google";

export const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
  fallback: ["Courier New", "monospace"],
});

export const termFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-term",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
