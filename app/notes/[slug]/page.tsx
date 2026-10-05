import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WindowFrame } from "@/components/desktop/WindowFrame";
import { Mdx } from "@/components/mdx/Mdx";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
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
  const og = `/api/og?title=${encodeURIComponent(note.title)}&eyebrow=Note`;

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
      <WindowFrame title={note.title} icon="/desktop/icons/notes.svg" width={600}>
        <p className="os-kicker">Note</p>
        <h1>{note.title}</h1>
        <p>{note.summary}</p>
        <p className="hint">
          <time dateTime={note.date.toISOString()}>{formatDate(note.date)}</time>{" "}
          · {note.readingMinutes} min
          {note.tags.length ? ` · ${note.tags.join(", ")}` : ""}
        </p>
        <Mdx source={note.body} />
      </WindowFrame>
    </>
  );
}
