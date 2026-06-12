/* Watercolor decorative elements — painted flowers, not SVG leaves. */
import type { CSSProperties } from "react";
import sunflower from "@/assets/flower-sunflower.png.asset.json";
import peony from "@/assets/flower-peony.png.asset.json";
import bougainvillea from "@/assets/flower-bougainvillea.png.asset.json";
import goldshower from "@/assets/flower-goldshower.png.asset.json";
import rose from "@/assets/flower-rose.png.asset.json";
import lilac from "@/assets/flower-lilac.png.asset.json";

const FLOWER_MAP = {
  sunflower: sunflower.url,
  peony: peony.url,
  bougainvillea: bougainvillea.url,
  goldshower: goldshower.url,
  rose: rose.url,
  lilac: lilac.url,
};

export type FlowerKind = keyof typeof FLOWER_MAP;
export const FLOWERS: FlowerKind[] = ["sunflower", "peony", "bougainvillea", "goldshower", "rose", "lilac"];
export function flowerUrl(k: FlowerKind) { return FLOWER_MAP[k]; }

type FlowerProps = { kind?: FlowerKind; className?: string; style?: CSSProperties; rotate?: number; opacity?: number };

/** Floating watercolor flower used in decorative backgrounds. */
export function Flower({ kind = "rose", className = "", style, rotate = 0, opacity = 0.85 }: FlowerProps) {
  return (
    <img
      src={FLOWER_MAP[kind]}
      alt=""
      aria-hidden
      className={`pointer-events-none select-none animate-floaty ${className}`}
      draggable={false}
      style={{
        transform: `rotate(${rotate}deg)`,
        opacity,
        mixBlendMode: "multiply",
        filter: "drop-shadow(0 8px 18px rgba(40,30,20,0.08))",
        ...style,
      }}
    />
  );
}

/** Sprinkle a handful of flowers across a section as a decorative backdrop. */
export function FlowerBed({ density = "med", className = "" }: { density?: "low" | "med" | "high"; className?: string }) {
  const items =
    density === "high"
      ? [
          { k: "bougainvillea" as FlowerKind, pos: "top-4 -left-12 w-64", r: -12, o: 0.55 },
          { k: "lilac" as FlowerKind, pos: "top-1/3 -right-10 w-56", r: 18, o: 0.5 },
          { k: "goldshower" as FlowerKind, pos: "bottom-10 left-1/4 w-48", r: 6, o: 0.55 },
          { k: "peony" as FlowerKind, pos: "bottom-4 right-1/4 w-44", r: -8, o: 0.5 },
          { k: "rose" as FlowerKind, pos: "top-1/2 left-1/2 w-40", r: 22, o: 0.4 },
        ]
      : density === "low"
        ? [
            { k: "sunflower" as FlowerKind, pos: "top-6 -right-10 w-48", r: 14, o: 0.45 },
            { k: "lilac" as FlowerKind, pos: "bottom-10 -left-10 w-52", r: -8, o: 0.45 },
          ]
        : [
            { k: "bougainvillea" as FlowerKind, pos: "top-4 -right-12 w-56", r: 12, o: 0.55 },
            { k: "goldshower" as FlowerKind, pos: "top-1/3 -left-12 w-52", r: -10, o: 0.55 },
            { k: "peony" as FlowerKind, pos: "bottom-8 right-1/4 w-44", r: 8, o: 0.5 },
            { k: "lilac" as FlowerKind, pos: "bottom-4 -left-8 w-44", r: -16, o: 0.45 },
          ];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((it, i) => (
        <Flower
          key={i}
          kind={it.k}
          className={`absolute ${it.pos}`}
          rotate={it.r}
          opacity={it.o}
          style={{ animationDelay: `${i * 1.1}s` }}
        />
      ))}
    </div>
  );
}

/* ──────── soft inline marks ──────── */

type P = { className?: string; style?: CSSProperties };

export function InkSwirl({ className, style }: P) {
  return (
    <svg viewBox="0 0 400 80" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M5 50 C 80 10, 130 70, 200 40 S 320 10, 395 50" />
      <circle cx="200" cy="40" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** small painted petal — replaces the harsh pixel sparkle */
export function Sparkle({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 1 C 14 8, 20 10, 23 12 C 20 14, 14 16, 12 23 C 10 16, 4 14, 1 12 C 4 10, 10 8, 12 1 Z" opacity="0.85" />
    </svg>
  );
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="divider-leaf my-12">
      <Flower kind="rose" className="h-9 w-9 shrink-0" opacity={0.8} />
      {label && <span className="font-script text-3xl text-[color:var(--terracotta)]">{label}</span>}
      <Flower kind="lilac" className="h-9 w-9 shrink-0" opacity={0.8} />
    </div>
  );
}

/* ──────── backward-compat aliases (old imports still resolve) ──────── */
export const Leaf = (p: P) => <Flower kind="goldshower" className={p.className} style={p.style} opacity={0.55} />;
export const Floral = (p: P) => <Flower kind="rose" className={p.className} style={p.style} opacity={0.75} />;
export const Splash = (p: P) => (
  <div aria-hidden className={`pointer-events-none ${p.className ?? ""}`} style={{ position: "relative", ...p.style }}>
    <Flower kind="peony" className="absolute inset-0 w-full h-full" opacity={0.4} />
  </div>
);