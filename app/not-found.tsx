import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-ink-dim">404</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-ink">
        Nothing here
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-dim">
        That address does not exist.
      </p>
      <Link
        href="/"
        className="mt-10 text-sm text-ink underline underline-offset-4 hover:opacity-70"
      >
        Back to the room
      </Link>
    </div>
  );
}
