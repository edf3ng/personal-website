import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/overlay/Mdx";
import { OverlayShell } from "@/components/overlay/OverlayShell";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { TagRow } from "@/components/ui/Tag";
import { formatDate, getNote, getNotes, isoDate } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  const path = `/notes/${note.slug}`;
  const og = `/api/og?title=${encodeURIComponent(note.title)}&eyebrow=Note&accent=violet`;

  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.summary,
      url: absoluteUrl(path),
      publishedTime: note.date.toISOString(),
      tags: note.tags,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.summary,
      images: [og],
    },
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <>
      <ArticleJsonLd
        title={note.title}
        description={note.summary}
        date={isoDate(note.date)}
        path={`/notes/${note.slug}`}
        tags={note.tags}
      />
      <OverlayShell
        station="notes"
        eyebrow="Note"
        title={note.title}
        width="narrow"
        intro={
          <div className="space-y-4">
            <p>{note.summary}</p>
            <div className="flex flex-wrap items-center gap-3">
              <p className="arcade-label text-[0.5rem] text-phosphor-dim/70">
                <time dateTime={note.date.toISOString()}>
                  {formatDate(note.date)}
                </time>{" "}
                &middot; {note.readingMinutes} min read
              </p>
              <TagRow tags={note.tags} />
            </div>
          </div>
        }
      >
        <Mdx source={note.body} />
      </OverlayShell>
    </>
  );
}
