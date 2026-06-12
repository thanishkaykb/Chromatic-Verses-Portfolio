import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS: Array<{ to: string; label: string; num: string }> = [
  { to: "/", label: "Home", num: "01" },
  { to: "/artworks", label: "Drawings & Artworks", num: "02" },
  { to: "/poetry", label: "Poetry", num: "03" },
  { to: "/published", label: "Published Corner", num: "04" },
  { to: "/about", label: "About Me", num: "05" },
  { to: "/contact", label: "Contact", num: "06" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2 backdrop-blur-xl bg-[color:var(--cream)]/85 border-b border-[color:var(--forest)]/10 shadow-[0_4px_30px_-12px_rgba(31,45,36,0.15)]" : "py-4"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-script text-4xl leading-none text-[color:var(--forest)] group-hover:text-[color:var(--terracotta)] transition-colors whitespace-nowrap">Thanishka&nbsp;Yogesh</span>
          <span className="hidden md:inline text-[9px] tracking-[0.4em] uppercase text-[color:var(--forest)]/55">— Chromatic Verses</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map(l => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className="group relative flex items-baseline gap-1.5">
                <span className={`text-[9px] tracking-[0.3em] transition-colors ${active ? "text-[color:var(--terracotta)]" : "text-[color:var(--forest)]/40 group-hover:text-[color:var(--terracotta)]/70"}`}>{l.num}</span>
                <span className={`font-display italic text-lg transition-colors ${active ? "text-[color:var(--terracotta)]" : "text-[color:var(--forest)]/90 group-hover:text-[color:var(--terracotta)]"}`}>{l.label}</span>
                <span className={`absolute -bottom-1 left-0 right-0 h-px bg-[color:var(--terracotta)] origin-left transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setOpen(o => !o)} className="lg:hidden p-2 text-[color:var(--forest)]" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[color:var(--forest)]/15 bg-[color:var(--cream)]/95 backdrop-blur-xl">
          <div className="max-w-[1500px] mx-auto px-6 py-6 grid gap-3">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} className="flex items-baseline gap-3 py-1">
                <span className="text-[10px] tracking-[0.3em] text-[color:var(--terracotta)]">{l.num}</span>
                <span className="font-display italic text-2xl text-[color:var(--forest)]">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-[color:var(--forest)]/15 bg-[color:var(--cream)]/60">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-script text-5xl text-[color:var(--forest)] leading-none">Thanishka Yogesh</p>
          <p className="font-display italic text-lg text-[color:var(--forest)]/70 mt-2">a slow record of colour & verse.</p>
        </div>
        <div className="text-sm space-y-1.5 text-[color:var(--forest)]/80">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--terracotta)] mb-2">Wander</p>
          {LINKS.map(l => <Link key={l.to} to={l.to} className="block hover:text-[color:var(--terracotta)]">{l.label}</Link>)}
          <Link to="/admin" className="block text-[color:var(--forest)]/25 hover:text-[color:var(--terracotta)] text-xs mt-3" aria-label="Studio (admin)">·&nbsp;studio</Link>
        </div>
        <div className="text-sm space-y-1.5 text-[color:var(--forest)]/80">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--terracotta)] mb-2">Write to me</p>
          <a href="mailto:thanishka.ykb@gmail.com" className="block hover:text-[color:var(--terracotta)]">thanishka.ykb@gmail.com</a>
          <a href="tel:+919025658705" className="block hover:text-[color:var(--terracotta)]">+91 90256 58705</a>
          <a href="https://www.instagram.com/art_by_thanishka?igsh=MWNoemkxY2Q0NzB3OQ==" target="_blank" rel="noreferrer" className="block hover:text-[color:var(--terracotta)]">@art_by_thanishka</a>
        </div>
      </div>
      <div className="border-t border-[color:var(--forest)]/15 py-5 text-center text-[10px] tracking-[0.35em] uppercase text-[color:var(--forest)]/55">
        © {new Date().getFullYear()} Thanishka Yogesh · made slowly, with colour & care
      </div>
    </footer>
  );
}