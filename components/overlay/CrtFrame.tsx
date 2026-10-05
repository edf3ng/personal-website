type CrtFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/** Quiet glass panel. The 3D room stays visible around the edges. */
export function CrtFrame({ children, className = "" }: CrtFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/78 shadow-[0_24px_80px_-28px_rgb(0_0_0/0.85)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
