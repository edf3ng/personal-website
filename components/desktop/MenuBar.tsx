"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { DESKTOP_ITEMS } from "@/lib/desktop";
import { site } from "@/lib/site";

type MenuId = "file" | "edit" | "view" | "special";

function Menu({
  id,
  label,
  open,
  armed,
  onOpen,
  onClose,
  children,
}: {
  id: MenuId;
  label: string;
  open: boolean;
  armed: boolean;
  onOpen: (id: MenuId) => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const buttonId = useId();
  const menuId = useId();

  return (
    <div className={`menu${open ? " is-open" : ""}`}>
      <button
        id={buttonId}
        type="button"
        className="menubar-item"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? onClose() : onOpen(id))}
        onMouseEnter={() => {
          if (armed) onOpen(id);
        }}
      >
        {label}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="menu-panel"
          aria-labelledby={buttonId}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState<MenuId | null>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (bar.current?.contains(event.target as Node)) return;
      setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clock = now
    ? now.toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const close = () => setOpen(null);
  const armed = open !== null;

  return (
    <header className="menubar no-print" ref={bar}>
      <nav className="menubar-left" aria-label="Desktop menu">
        <Link className="menubar-brand" href="/" onClick={close}>
          {site.name}
        </Link>
        <Menu
          id="file"
          label="File"
          open={open === "file"}
          armed={armed}
          onOpen={setOpen}
          onClose={close}
        >
          {DESKTOP_ITEMS.map((item) => (
            <Link
              key={item.href}
              role="menuitem"
              href={item.href}
              onClick={close}
            >
              Open {item.label}
            </Link>
          ))}
          <Link role="menuitem" href="/" onClick={close}>
            Close Window
          </Link>
        </Menu>
        <Menu
          id="edit"
          label="Edit"
          open={open === "edit"}
          armed={armed}
          onOpen={setOpen}
          onClose={close}
        >
          <a role="menuitem" href={`mailto:${site.email}`} onClick={close}>
            New Mail
          </a>
        </Menu>
        <Menu
          id="view"
          label="View"
          open={open === "view"}
          armed={armed}
          onOpen={setOpen}
          onClose={close}
        >
          <Link role="menuitem" href="/" onClick={close}>
            Finder (Desktop)
          </Link>
          {DESKTOP_ITEMS.map((item) => (
            <Link
              key={item.href}
              role="menuitem"
              href={item.href}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </Menu>
        <Menu
          id="special"
          label="Special"
          open={open === "special"}
          armed={armed}
          onOpen={setOpen}
          onClose={close}
        >
          <a
            role="menuitem"
            href={site.links.github}
            target="_blank"
            rel="noreferrer noopener"
            onClick={close}
          >
            GitHub
          </a>
          <a
            role="menuitem"
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            onClick={close}
          >
            LinkedIn
          </a>
        </Menu>
      </nav>
      <p className="menubar-clock" suppressHydrationWarning>
        {clock}
      </p>
    </header>
  );
}
