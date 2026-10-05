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

export const resume = {
  headline: "Computer Science & Business Honors, UT Austin",
  summary:
    "CS Honors and Canfield Business Honors student at The University of Texas at Austin. Passionate about modeling systems and full-stack development.",
  contact: [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Phone", value: site.phone, href: `tel:${site.phone.replaceAll("-", "")}` },
    { label: "GitHub", value: `@${site.handle}`, href: site.links.github },
    { label: "LinkedIn", value: "in/edwin-feng", href: site.links.linkedin },
  ],

  experience: [
    {
      org: "Applied Research Laboratories",
      role: "Research Intern",
      start: "Jun 2026",
      end: "Aug 2026",
      location: "Austin, Texas",
      url: "https://www.arlut.utexas.edu/",
      points: [
        "Modeled ULF ocean noise against wind speed and ran FFT analysis on hydrophone data.",
        "Combined two wind-noise models to reconstruct lower-frequency correlations.",
      ],
    },
    {
      org: "UT Austin Center for Space Research",
      role: "Data Analysis Intern",
      start: "Jun 2025",
      end: "Jul 2025",
      location: "Austin, Texas",
      url: "https://www.csr.utexas.edu/",
      points: [
        "Predicted soil acidification risk with CNN and Attention U-Net models, raising R² 55.7% over baseline.",
        "First-author paper at MIT URTC 2025, published on IEEE Xplore.",
      ],
    },
    {
      org: "North Dakota State University",
      role: "Research Assistant",
      start: "Dec 2024",
      end: "May 2025",
      location: "Fargo, North Dakota (remote)",
      url: "https://www.ndsu.edu/",
      points: [
        "Built a RAG chatbot and multi-agent system that raised retrieval coverage 72%.",
        "Led a University of Washington user study with cybersecurity education platforms.",
      ],
    },
  ] satisfies ResumeEntry[],

  education: [
    {
      org: "The University of Texas at Austin",
      role: "B.S. Computer Science Honors; B.B.A. Canfield Business Honors",
      start: "2026",
      end: "May 2029",
      location: "Austin, Texas",
      url: "https://www.utexas.edu/",
      points: [
        "Coursework: Data Structures, Discrete Math.",
      ],
    },
    {
      org: "Liberal Arts and Science Academy",
      role: "High School",
      start: "",
      end: "Jun 2026",
      location: "Austin, Texas",
      points: [],
    },
  ] satisfies ResumeEntry[],

  honors: [
    { date: "Apr 2026", title: "2× Texas Science Olympiad State Champion" },
    { date: "Dec 2025", title: "American Geophysical Union Bright STaRs Scholar" },
    {
      date: "Oct 2025",
      title:
        "First-author paper on IEEE Xplore, presented at MIT URTC 2025",
    },
    { date: "Jul 2025", title: "National Finalist in FBLA Management Information Systems (Top 15)" },
    { date: "May 2025", title: "Science Olympiad Nationals Medalist (4th place)" },
    { date: "Dec 2024", title: "Congressional App Challenge District 21 Runner-Up" },
    { date: "Mar 2024", title: "picoCTF Global Top 1%, USA Top 1%" },
    { date: "2023–2026", title: "3× CyberPatriot Platinum Semifinalist (top 3% team)" },
    { date: "2023–2025", title: "3× AISD Trustee Award (top 10% academic)" },
  ],

  skills: [
    {
      group: "Languages",
      items: ["C++", "Python", "Java", "C", "Git", "Bash", "MATLAB"],
    },
    {
      group: "Practice",
      items: ["Machine learning", "Cybersecurity", "Agile", "Research writing"],
    },
    {
      group: "Spoken",
      items: ["English (fluent)", "Chinese (proficient)"],
    },
  ],

  highlights: [
    { label: "School", value: "UT Austin CS + Business Honors" },
    { label: "Focus", value: "research, ML, systems" },
    { label: "Work", value: "eligible in the U.S., no restrictions" },
  ],
} as const;
