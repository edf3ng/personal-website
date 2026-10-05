import type { Metadata } from "next";
import Link from "next/link";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { formatDate, getNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Writing, working notes, and half-finished thoughts on software, graphics, and tools.",
  alternates: {
    canonical: "/notes",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function NotesPage() {
  const notes = getNotes();

  return (
    <WindowFrame title="Notes" icon="/desktop/icons/notes.svg" width={560}>
      <p className="os-kicker">Notebook</p>
      <h1>Notes</h1>
      <p>
        Short pieces from this desk. <Link href="/feed.xml">RSS</Link>
      </p>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul className="file-list">
          {notes.map((note) => (
            <li key={note.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/desktop/icons/notes.svg" alt="" />
              <div>
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                <p className="file-meta">
                  <time dateTime={note.date.toISOString()}>
                    {formatDate(note.date)}
                  </time>{" "}
                  · {note.readingMinutes} min
                </p>
                <p className="file-summary">{note.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </WindowFrame>
  );
}
