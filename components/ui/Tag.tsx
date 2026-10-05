export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="arcade-label rounded-full border border-white/12 px-2.5 py-1 text-[0.5rem] text-phosphor-dim">
      {children}
    </span>
  );
}

export function TagRow({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
