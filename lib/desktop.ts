import { site } from "@/lib/site";

export type DesktopItem = {
  href: string;
  label: string;
  icon: string;
};

export const DESKTOP_ITEMS: DesktopItem[] = [
  {
    href: "/about",
    label: "About Me",
    icon: "/desktop/icons/user.svg",
  },
  {
    href: "/projects",
    label: "Projects",
    icon: "/desktop/icons/folder.svg",
  },
  {
    href: "/notes",
    label: "Notes",
    icon: "/desktop/icons/notes.svg",
  },
  {
    href: "/resume",
    label: "Resume",
    icon: "/desktop/icons/resume.svg",
  },
];

export const DESKTOP_EXTRAS: DesktopItem[] = [
  {
    href: `mailto:${site.email}`,
    label: "Mail",
    icon: "/desktop/icons/mail.svg",
  },
];
