import type { Metadata } from "next";
import Link from "next/link";

import { OverlayShell } from "@/components/overlay/OverlayShell";
import { TagRow } from "@/components/ui/Tag";
import { collectTags, formatDate, getNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Writing, working notes, and half-finished thoughts on software, graphics, and tools.",
  alternates: {
    canonical: "/notes",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

type Props = { searchParams: Promise<{ tag?: string }> };

export default async function NotesPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const notes = getNotes();
  const tags = collectTags(notes);
  const visible = tag ? notes.filter((note) => note.tags.includes(tag)) : notes;

  return (
    <OverlayShell
      station="notes"
      title="Notes"
      intro={
        <p>
          A logbook rather than a blog. Short pieces, build notes, and things I
          want to be able to find again.{" "}
          <Link
            href="/feed.xml"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            RSS
          </Link>
          .
        </p>
      }
    >
      {tags.length > 0 && (
        <nav aria-label="Filter notes by tag" className="mb-10">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/notes"
                aria-current={tag ? undefined : "true"}
                className={`arcade-label rounded-full border px-3 py-1.5 text-[0.5rem] transition-colors ${
                  tag
                    ? "border-white/12 text-phosphor-dim hover:text-phosphor"
                    : "border-[rgb(var(--accent-rgb)/0.6)] text-[var(--accent)]"
                }`}
              >
                All
              </Link>
            </li>
            {tags.map((candidate) => {
              const isActive = candidate === tag;
              return (
                <li key={candidate}>
                  <Link
                    href={`/notes?tag=${encodeURIComponent(candidate)}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`arcade-label rounded-full border px-3 py-1.5 text-[0.5rem] transition-colors ${
                      isActive
                        ? "border-[rgb(var(--accent-rgb)/0.6)] text-[var(--accent)]"
                        : "border-white/12 text-phosphor-dim hover:text-phosphor"
                    }`}
                  >
                    {candidate}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-phosphor-dim">
          Nothing here yet. Drop an <code>.mdx</code> file in{" "}
          <code>content/notes/</code> and it shows up.
        </p>
      ) : (
        <ul className="divide-y divide-white/8">
          {visible.map((note) => (
            <li key={note.slug} className="group py-6 first:pt-0">
              <p className="arcade-label text-[0.5rem] text-phosphor-dim/70">
                <time dateTime={note.date.toISOString()}>
                  {formatDate(note.date)}
                </time>{" "}
                &middot; {note.readingMinutes} min
                {note.draft ? " \u00B7 draft" : ""}
              </p>

              <h2 className="mt-2 font-display text-[0.8rem] leading-relaxed text-phosphor transition-colors group-hover:text-[var(--accent)]">
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-phosphor-dim">
                {note.summary}
              </p>

              <div className="mt-3.5">
                <TagRow tags={note.tags} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </OverlayShell>
  );
}
