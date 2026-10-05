import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="arcade-label animate-blink text-[0.6rem] text-neon-pink text-glow">
        Game over
      </p>
      <h1 className="mt-7 font-display text-2xl leading-relaxed text-phosphor text-rgb-split">
        404
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-phosphor-dim">
        That cabinet is out of order. Nothing lives at this address.
      </p>
      <Link
        href="/"
        className="arcade-label mt-10 rounded border border-neon-pink/50 px-5 py-3 text-[0.55rem] text-neon-pink transition-colors hover:bg-neon-pink/10"
      >
        Continue? 9...
      </Link>
    </div>
  );
}
