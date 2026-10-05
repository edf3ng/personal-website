import { Inconsolata, Lora, Nunito } from "next/font/google";

/** Soft UI chrome — rounded, cafe-like, not the previous screen face. */
export const uiFont = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

/** Window documents, like a notebook under a lamp. */
export const docFont = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-doc",
});

/** Code in notes. */
export const monoFont = Inconsolata({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});
