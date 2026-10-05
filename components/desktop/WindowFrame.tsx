"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type WindowFrameProps = {
  title: string;
  icon?: string;
  width?: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

function defaultOffset(title: string) {
  const hash = [...title].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return {
    x: 28 + (hash % 48),
    y: 36 + ((hash * 3) % 36),
  };
}

export function WindowFrame({
  title,
  icon,
  width = 560,
  children,
  actions,
}: WindowFrameProps) {
  const frame = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(() => defaultOffset(title));
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  useEffect(() => {
    setOffset(defaultOffset(title));
  }, [title]);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.button !== 0) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const node = frame.current;
    if (!node) return;
    node.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: offset.x,
      origY: offset.y,
    };
  }, [offset]);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const session = drag.current;
    if (!session || event.pointerId !== session.pointerId) return;
    setOffset({
      x: session.origX + (event.clientX - session.startX),
      y: Math.max(0, session.origY + (event.clientY - session.startY)),
    });
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  }, []);

  return (
    <article
      ref={frame}
      className="os-window"
      style={{
        width,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <header
        className="os-titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Link
          href="/"
          className="os-close"
          aria-label="Close window"
          onPointerDown={(event) => event.stopPropagation()}
        />
        <h1 className="os-title">
          {icon ? (
            // Tango icons from the Tango Desktop Project (public domain).
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" width={16} height={16} />
          ) : null}
          {title}
        </h1>
        {actions ? (
          <div
            className="os-title-actions no-print"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {actions}
          </div>
        ) : (
          <span className="os-title-spacer" />
        )}
      </header>
      <div className="os-body">{children}</div>
    </article>
  );
}
