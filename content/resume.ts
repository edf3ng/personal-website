import { site } from "@/lib/site";

export type ResumeEntry = {
  org: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  url?: string;
  points: string[];
};

/**
 * One source of truth for the resume. The page renders from this, the print
 * stylesheet strips the arcade chrome, and the PDF is produced from the same
 * output rather than maintained separately.
 */
export const resume = {
  headline: "Software Engineer",
  summary:
    "Engineer focused on interactive front-ends, graphics, and developer tooling. I like problems where the interface is the product.",
  contact: [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Site", value: site.url.replace(/^https?:\/\//, ""), href: site.url },
    { label: "GitHub", value: `@${site.handle}`, href: site.links.github },
    { label: "LinkedIn", value: `in/${site.handle}`, href: site.links.linkedin },
  ],

  experience: [
    {
      org: "Example Labs",
      role: "Senior Software Engineer",
      start: "2024",
      end: "Present",
      location: "Remote",
      points: [
        "Led the rewrite of the primary editor surface, cutting interaction latency by roughly half on mid-tier hardware.",
        "Built the design-system primitives now used across four product teams.",
        "Mentored three engineers through their first large refactors.",
      ],
    },
    {
      org: "Pixelworks",
      role: "Software Engineer",
      start: "2022",
      end: "2024",
      location: "New York, NY",
      points: [
        "Shipped a WebGL rendering pipeline that replaced a server-side image service, removing a whole tier from the stack.",
        "Owned the performance budget and the regression harness that enforced it in CI.",
      ],
    },
    {
      org: "Starter Co.",
      role: "Software Engineer, Intern",
      start: "2021",
      end: "2022",
      location: "Remote",
      points: [
        "Built internal tooling for data labeling that reduced turnaround time per batch from days to hours.",
      ],
    },
  ] satisfies ResumeEntry[],

  education: [
    {
      org: "State University",
      role: "B.S. Computer Science",
      start: "2018",
      end: "2022",
      points: ["Graphics and systems coursework; teaching assistant for intro systems."],
    },
  ] satisfies ResumeEntry[],

  skills: [
    { group: "Languages", items: ["TypeScript", "Python", "Go", "GLSL", "SQL"] },
    {
      group: "Frontend",
      items: ["React", "Next.js", "Three.js", "WebGL", "CSS architecture"],
    },
    {
      group: "Backend & infra",
      items: ["Node.js", "Postgres", "Redis", "Docker", "CI pipelines"],
    },
    { group: "Practice", items: ["Performance work", "Accessibility", "Design systems", "Mentoring"] },
  ],

  highlights: [
    { label: "Years shipping", value: "5" },
    { label: "Production rewrites", value: "3" },
    { label: "Open-source repos", value: "20+" },
    { label: "Coffee / day", value: "2.5" },
  ],
} as const;
