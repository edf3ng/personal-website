"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DESKTOP_EXTRAS, DESKTOP_ITEMS } from "@/lib/desktop";
import { site } from "@/lib/site";

function IconLink({
  href,
  label,
  icon,
  current,
}: {
  href: string;
  label: string;
  icon: string;
  current?: boolean;
}) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const className = `desk-icon${current ? " is-current" : ""}`;
  const inner = (
    <>
      {/* Tango Desktop Project, public domain. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={48} height={48} />
      <span>{label}</span>
    </>
  );

  if (external) {
    return (
      <a className={className} href={href}>
        {inner}
      </a>
    );
  }

  return (
    <Link
      className={className}
      href={href}
      aria-current={current ? "page" : undefined}
    >
      {inner}
    </Link>
  );
}

export function DesktopIcons() {
  const pathname = usePathname();

  return (
    <nav className="desk-icons no-print" aria-label="Desktop">
      {DESKTOP_ITEMS.map((item) => (
        <IconLink
          key={item.href}
          {...item}
          current={
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          }
        />
      ))}
      {DESKTOP_EXTRAS.map((item) => (
        <IconLink key={item.href} {...item} />
      ))}
      <a
        className="desk-icon"
        href={site.links.github}
        target="_blank"
        rel="noreferrer noopener"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/desktop/icons/computer.svg" alt="" width={48} height={48} />
        <span>GitHub</span>
      </a>
    </nav>
  );
}
