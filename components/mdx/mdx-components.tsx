import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type El<T extends keyof React.JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T>;

function Anchor({ href = "", children, ...rest }: El<"a">) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "warn" | "tip";
  title?: string;
  children: React.ReactNode;
}) {
  const label =
    title ?? (type === "warn" ? "Heads up" : type === "tip" ? "Tip" : "Note");
  return (
    <aside className="callout">
      <strong>{label}. </strong>
      {children}
    </aside>
  );
}

export function Score({ label, value }: { label: string; value: string }) {
  return (
    <span>
      {label}: {value}
    </span>
  );
}

export function KeyCap({ children }: { children: React.ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

export const mdxComponents = {
  a: Anchor,
  h2: (props: El<"h2">) => <h2 {...props} />,
  h3: (props: El<"h3">) => <h3 {...props} />,
  p: (props: El<"p">) => <p {...props} />,
  ul: (props: El<"ul">) => <ul {...props} />,
  ol: (props: El<"ol">) => <ol {...props} />,
  li: (props: El<"li">) => <li {...props} />,
  blockquote: (props: El<"blockquote">) => <blockquote {...props} />,
  strong: (props: El<"strong">) => <strong {...props} />,
  code: (props: El<"code">) => <code {...props} />,
  pre: (props: El<"pre">) => <pre {...props} />,
  Callout,
  Score,
  KeyCap,
};
