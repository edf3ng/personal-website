export const site = {
  name: "Edwin Feng",
  handle: "edwinfeng",
  title: "Edwin Feng",
  description:
    "The personal site of Edwin Feng — projects, notes, and a resume, set in a 3D arcade.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwinfeng.dev",
  locale: "en_US",
  email: "hello@edwinfeng.dev",
  links: {
    github: "https://github.com/edwinfeng",
    linkedin: "https://linkedin.com/in/edwinfeng",
    x: "https://x.com/edwinfeng",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}
