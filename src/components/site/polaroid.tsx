import type { CSSProperties, ReactNode } from "react";

export function Polaroid({
  src, caption, rotate = -3, className = "", style, children,
}: { src?: string; caption?: string; rotate?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      className={`polaroid relative inline-block transition-transform duration-500 hover:!rotate-0 hover:scale-[1.04] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <span className="tape" style={{ left: "50%", top: "-10px", marginLeft: "-35px" }} />
      {src ? (
        <img src={src} alt={caption || ""} className="block w-full h-auto object-cover bg-[color:var(--beige)]" style={{ aspectRatio: "1/1" }} />
      ) : (
        <div className="block bg-gradient-to-br from-[color:var(--sage)]/40 to-[color:var(--terracotta)]/30" style={{ aspectRatio: "1/1", width: "100%" }}>{children}</div>
      )}
      {caption && <p className="font-hand text-xl text-[color:var(--ink)] mt-3 text-center leading-tight">{caption}</p>}
    </div>
  );
}