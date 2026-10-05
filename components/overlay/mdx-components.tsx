import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type El<T extends keyof React.JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T>;

function Anchor({ href = "", children, ...rest }: El<"a">) {
  const external = /^https?:\/\//.test(href);
  const className =
    "text-[var(--accent)] underline decoration-[rgb(var(--accent-rgb)/0.4)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/** Aside styled like an in-game hint box. */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "warn" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const tone = {
    note: { color: "#00e5ff", glyph: "\u2139", label: "Note" },
    warn: { color: "#ffd400", glyph: "\u26A0", label: "Heads up" },
    tip: { color: "#39ff14", glyph: "\u2726", label: "Tip" },
  }[type];

  return (
    <aside
      className="my-7 rounded-lg border-l-2 bg-white/[0.03] p-5"
      style={{ borderColor: tone.color }}
    >
      <p
        className="arcade-label mb-2 flex items-center gap-2 text-[0.55rem]"
        style={{ color: tone.color }}
      >
        <span aria-hidden="true">{tone.glyph}</span>
        {title ?? tone.label}
      </p>
      <div className="text-sm leading-relaxed text-phosphor/85 [&>p]:my-2">
        {children}
      </div>
    </aside>
  );
}

/** Pull a stat out of the prose and frame it like a cabinet readout. */
export function Score({ label, value }: { label: string; value: string }) {
  return (
    <span className="mx-1 inline-flex items-baseline gap-2 rounded border border-[rgb(var(--accent-rgb)/0.35)] px-2 py-1 align-middle">
      <span className="arcade-label text-[0.5rem] text-phosphor-dim">
        {label}
      </span>
      <span className="font-display text-xs text-[var(--accent)] text-glow">
        {value}
      </span>
    </span>
  );
}

export function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[0.7em] text-phosphor">
      {children}
    </kbd>
  );
}

export const mdxComponents = {
  a: Anchor,
  h2: (props: El<"h2">) => (
    <h2
      className="mt-12 scroll-mt-28 border-b border-white/10 pb-3 font-display text-base leading-relaxed text-phosphor first:mt-0"
      {...props}
    />
  ),
  h3: (props: El<"h3">) => (
    <h3
      className="mt-9 scroll-mt-28 font-display text-[0.8rem] leading-relaxed text-[var(--accent)]"
      {...props}
    />
  ),
  h4: (props: El<"h4">) => (
    <h4
      className="arcade-label mt-7 scroll-mt-28 text-[0.6rem] text-phosphor-dim"
      {...props}
    />
  ),
  p: (props: El<"p">) => (
    <p className="my-5 leading-[1.85] text-phosphor/85" {...props} />
  ),
  ul: (props: El<"ul">) => (
    <ul className="my-5 space-y-2 pl-5 text-phosphor/85" {...props} />
  ),
  ol: (props: El<"ol">) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-6 text-phosphor/85 marker:text-[var(--accent)]"
      {...props}
    />
  ),
  li: (props: El<"li">) => (
    <li
      className="relative leading-[1.8] before:absolute before:-left-5 before:text-[var(--accent)] before:content-['\25B8'] [ol>&]:before:content-none [ol>&]:pl-0"
      {...props}
    />
  ),
  blockquote: (props: El<"blockquote">) => (
    <blockquote
      className="my-7 border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-5 italic text-phosphor-dim"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-12 border-0 border-t border-dashed border-white/15" />
  ),
  strong: (props: El<"strong">) => (
    <strong className="font-semibold text-phosphor" {...props} />
  ),
  code: (props: El<"code">) => (
    // rehype-pretty-code marks fenced blocks, so bare `code` is always inline.
    <code
      className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--accent)] [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit"
      {...props}
    />
  ),
  pre: (props: El<"pre">) => (
    <pre
      className="crt-scroll my-7 overflow-x-auto rounded-lg border border-white/10 bg-[#0a0616] p-5 text-[0.82rem] leading-relaxed [&>code]:grid [&>code]:bg-transparent"
      {...props}
    />
  ),
  table: (props: El<"table">) => (
    <div className="crt-scroll my-7 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: El<"th">) => (
    <th
      className="arcade-label border-b border-[rgb(var(--accent-rgb)/0.35)] px-3 py-2 text-left text-[0.55rem] text-[var(--accent)]"
      {...props}
    />
  ),
  td: (props: El<"td">) => (
    <td
      className="border-b border-white/8 px-3 py-2 text-phosphor/85"
      {...props}
    />
  ),
  img: (props: El<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="my-7 w-full rounded-lg border border-white/10"
      alt={props.alt ?? ""}
      {...props}
    />
  ),
  Callout,
  Score,
  KeyCap,
};
