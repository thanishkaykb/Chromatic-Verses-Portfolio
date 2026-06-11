/* Hand-drawn decorative SVGs used across the site */
import type { CSSProperties } from "react";

type P = { className?: string; style?: CSSProperties };

export function Leaf({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M60 10 C90 60 95 130 60 195 C25 130 30 60 60 10 Z" />
      <path d="M60 20 L60 190" />
      <path d="M60 50 C75 55 82 65 88 78" /><path d="M60 50 C45 55 38 65 32 78" />
      <path d="M60 80 C77 85 86 95 92 110" /><path d="M60 80 C43 85 34 95 28 110" />
      <path d="M60 115 C76 120 84 130 90 145" /><path d="M60 115 C44 120 36 130 30 145" />
    </svg>
  );
}

export function Floral({ className, style }: P) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.1">
      <circle cx="100" cy="100" r="14" />
      {[0,45,90,135,180,225,270,315].map(a => (
        <ellipse key={a} cx="100" cy="60" rx="14" ry="32" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}

export function Splash({ className, style }: P) {
  return (
    <svg viewBox="0 0 300 300" className={className} style={style}>
      <defs>
        <radialGradient id="sp1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.5"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="150" cy="150" r="120" fill="url(#sp1)" />
      <circle cx="210" cy="90" r="22" fill="currentColor" opacity="0.18" />
      <circle cx="80" cy="210" r="14" fill="currentColor" opacity="0.16" />
      <circle cx="240" cy="220" r="8" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

export function InkSwirl({ className, style }: P) {
  return (
    <svg viewBox="0 0 400 80" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M5 50 C 80 10, 130 70, 200 40 S 320 10, 395 50" />
      <circle cx="200" cy="40" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function Sparkle({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  );
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="divider-leaf my-12">
      <Floral className="h-6 w-6 text-[color:var(--terracotta)] shrink-0" />
      {label && <span className="font-script text-3xl text-[color:var(--terracotta)]">{label}</span>}
      <Floral className="h-6 w-6 text-[color:var(--terracotta)] shrink-0" />
    </div>
  );
}