export const site = {
  name: "Edwin Feng",
  handle: "edf3ng",
  title: "Edwin Feng",
  description:
    "CS and Business Honors student at UT Austin. Research, systems, and a rainy-night desktop.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwinfeng.dev",
  locale: "en_US",
  email: "edwin.c.feng@gmail.com",
  phone: "512-998-9710",
  links: {
    github: "https://github.com/edf3ng",
    linkedin: "https://linkedin.com/in/edwin-feng",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
