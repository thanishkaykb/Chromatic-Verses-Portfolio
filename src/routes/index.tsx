import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, Instagram, ArrowUpRight } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The World of Thanishka — Artist • Poet • Storyteller" },
      { name: "description", content: "Step into the living creative universe of Thanishka Yogesh — paintings, poetry, publications, and memories." },
      { property: "og:title", content: "The World of Thanishka" },
      { property: "og:description", content: "An immersive artistic portfolio of paintings, poetry, publications, and personal stories." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#e8e1d3] text-[#1f2d24]">
      <Nav />
      <Cover />
      <Index_Contents />
      <Works />
      <PoetryPlate />
      <Publications />
      <Memories />
      <Colophon />
    </div>
  );
}

/* ─── shared ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.2, 0.7, 0.2, 1] } },
};

function PlateNumber({ n }: { n: string }) {
  return (
    <span className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/60">
      Plate · {n}
    </span>
  );
}

function PlaceholderPlate({ ratio = "aspect-[3/4]", label }: { ratio?: string; label?: string }) {
  return (
    <div className={`relative ${ratio} overflow-hidden bg-[#d8cdb8]`}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, rgba(201,123,94,0.35), transparent 55%), radial-gradient(120% 80% at 80% 80%, rgba(31,45,36,0.35), transparent 55%), repeating-linear-gradient(0deg, rgba(31,45,36,0.04) 0 2px, transparent 2px 5px)",
        }}
      />
      <div className="absolute inset-3 border border-[#1f2d24]/15" />
      {label && (
        <span className="absolute bottom-3 left-4 font-[Inter] text-[10px] tracking-[0.3em] uppercase text-[#1f2d24]/55">
          {label}
        </span>
      )}
    </div>
  );
}

/* ─── nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const items = [
    ["01", "Works", "#works"],
    ["02", "Poetry", "#poetry"],
    ["03", "Publications", "#publications"],
    ["04", "Memories", "#memories"],
    ["05", "Colophon", "#colophon"],
  ];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#e8e1d3]/85 backdrop-blur-md border-b border-[#1f2d24]/10" : ""}`}>
      <div className="max-w-[1500px] mx-auto px-8 lg:px-14 py-5 flex items-center justify-between">
        <a href="#cover" className="flex items-baseline gap-2">
          <span className="font-[Italianno] text-3xl text-[#1f2d24] leading-none">Thanishka</span>
          <span className="hidden sm:inline font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">— Monograph No. 01</span>
        </a>
        <nav className="hidden lg:flex items-center gap-9">
          {items.map(([n, l, h]) => (
            <a key={h} href={h} className="group flex items-baseline gap-2 text-[#1f2d24]/80 hover:text-[#c97b5e] transition-colors">
              <span className="font-[Inter] text-[10px] tracking-[0.3em] text-[#1f2d24]/45 group-hover:text-[#c97b5e]/70">{n}</span>
              <span className="font-[Cormorant_Garamond] text-lg italic">{l}</span>
            </a>
          ))}
        </nav>
        <a href="#colophon" className="font-[Inter] text-[11px] tracking-[0.3em] uppercase text-[#1f2d24]/80 hover:text-[#c97b5e]">
          Correspond ↗
        </a>
      </div>
    </header>
  );
}

/* ─── cover ─── */
function Cover() {
  return (
    <section id="cover" className="relative min-h-screen pt-32 pb-20 px-8 lg:px-14">
      <div className="max-w-[1500px] mx-auto h-full">
        {/* top meta band */}
        <div className="flex items-center justify-between border-t border-b border-[#1f2d24]/20 py-3 text-[10px] tracking-[0.35em] uppercase font-[Inter] text-[#1f2d24]/60">
          <span>Vol. I · Anno {new Date().getFullYear()}</span>
          <span className="hidden md:inline">Paintings · Verse · Memoranda</span>
          <span>Edition of One</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16 lg:mt-24 items-end">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="lg:col-span-7">
            <p className="font-[Italianno] text-4xl text-[#c97b5e] leading-none mb-6">— the world of —</p>
            <h1 className="font-[Cormorant_Garamond] font-light text-[clamp(4.5rem,13vw,12rem)] leading-[0.85] tracking-[-0.02em] text-[#1f2d24]">
              Thanishka
              <span className="block italic text-[#1f2d24]/85">Yogesh</span>
            </h1>
            <div className="mt-10 max-w-md">
              <p className="font-[Cormorant_Garamond] italic text-xl text-[#1f2d24]/80 leading-snug">
                A painter and poet, keeping a slow, ongoing record of colour, verse, and quiet things.
              </p>
              <div className="mt-8 flex items-center gap-6 text-[10px] tracking-[0.35em] uppercase font-[Inter] text-[#1f2d24]/60">
                <a href="#works" className="hover:text-[#c97b5e] inline-flex items-center gap-2">Enter the works <ArrowUpRight className="h-3 w-3" /></a>
                <span className="hidden sm:inline">est. {new Date().getFullYear() - 5}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <figure className="relative">
              <img src={heroPainting} alt="" className="w-full aspect-[3/4] object-cover" />
              <div className="absolute inset-3 border border-[#e8e1d3]/40 pointer-events-none" />
              <figcaption className="mt-3 flex items-baseline justify-between font-[Inter] text-[10px] tracking-[0.3em] uppercase text-[#1f2d24]/60">
                <span>Frontispiece</span>
                <span>Plate · 00</span>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── contents ─── */
function Index_Contents() {
  const rows = [
    ["01", "Works", "Paintings & visual studies", "p. 012"],
    ["02", "Poetry", "Pulled from the journal", "p. 048"],
    ["03", "Publications", "Printed & featured", "p. 074"],
    ["04", "Memories", "Notes from the studio", "p. 092"],
    ["05", "Colophon", "On the maker", "p. 110"],
  ];
  return (
    <section className="px-8 lg:px-14 py-24 border-y border-[#1f2d24]/15 bg-[#ddd3bd]/40">
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <p className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">Table of</p>
          <h2 className="font-[Cormorant_Garamond] italic text-6xl text-[#1f2d24] leading-none mt-2">Contents</h2>
        </div>
        <ul className="lg:col-span-9 divide-y divide-[#1f2d24]/20">
          {rows.map(([n, t, s, p]) => (
            <li key={n}>
              <a href={`#${t.toLowerCase()}`} className="group grid grid-cols-12 items-baseline gap-4 py-6 hover:bg-[#e8e1d3]/60 transition-colors px-2 -mx-2">
                <span className="col-span-2 sm:col-span-1 font-[Inter] text-[11px] tracking-[0.3em] text-[#c97b5e]">{n}</span>
                <span className="col-span-6 sm:col-span-4 font-[Cormorant_Garamond] text-3xl text-[#1f2d24] group-hover:italic">{t}</span>
                <span className="hidden sm:block sm:col-span-5 font-[Cormorant_Garamond] italic text-lg text-[#1f2d24]/70">{s}</span>
                <span className="col-span-4 sm:col-span-2 text-right font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">{p}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── works ─── */
function Works() {
  const tiles = [
    { span: "lg:col-span-7 lg:row-span-2", ratio: "aspect-[4/5]", n: "012", title: "Untitled (Window I)", medium: "Watercolour on cotton, 2024" },
    { span: "lg:col-span-5", ratio: "aspect-[4/3]", n: "013", title: "After the Rain", medium: "Ink & wash, 2024" },
    { span: "lg:col-span-5", ratio: "aspect-[4/3]", n: "014", title: "Half-Moons", medium: "Acrylic, 2023" },
    { span: "lg:col-span-4", ratio: "aspect-[3/4]", n: "015", title: "Of Quiet Things", medium: "Mixed media, 2024" },
    { span: "lg:col-span-4", ratio: "aspect-[3/4]", n: "016", title: "Study No. 7", medium: "Charcoal, 2023" },
    { span: "lg:col-span-4", ratio: "aspect-[3/4]", n: "017", title: "She Listens", medium: "Oil on board, 2024" },
  ];
  return (
    <section id="works" className="px-8 lg:px-14 py-32">
      <div className="max-w-[1500px] mx-auto">
        <SectionHead n="01" eyebrow="The Plates" title="Works" sub="A loose chronological selection. Each plate is part of an ongoing series; nothing here is finished, only paused." />
        <div className="mt-16 grid lg:grid-cols-12 gap-6 lg:gap-8">
          {tiles.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay: i * 0.05 }}
              className={`col-span-12 ${t.span}`}
            >
              <PlaceholderPlate ratio={t.ratio} />
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-[Cormorant_Garamond] italic text-2xl text-[#1f2d24]">{t.title}</h3>
                  <p className="font-[Inter] text-[11px] tracking-[0.2em] uppercase text-[#1f2d24]/55 mt-1">{t.medium}</p>
                </div>
                <PlateNumber n={t.n} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-16 font-[Italianno] text-3xl text-[#c97b5e] text-center">— more plates forthcoming —</p>
      </div>
    </section>
  );
}

/* ─── poetry plate (pull quote spread) ─── */
function PoetryPlate() {
  const poems = [
    { title: "On Rainfall", body: "and the sky, too,\nwept softly that evening\nas if to keep me company." },
    { title: "Half-Moons", body: "I keep your name\nin the folds of my palm,\nlike a half-remembered prayer." },
    { title: "Of Quiet Things", body: "the kettle hums.\nthe window breathes.\nI am — for once — enough." },
  ];
  return (
    <section id="poetry" className="relative bg-[#1f2d24] text-[#e8e1d3] py-32 px-8 lg:px-14 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #d4b25b 0, transparent 40%), radial-gradient(circle at 80% 70%, #c97b5e 0, transparent 45%)" }} />
      <div className="max-w-[1500px] mx-auto relative">
        <SectionHead n="02" eyebrow="In Verse" title="Poetry" sub="Pulled in handwriting from a notebook kept since the rains of 2019." dark />
        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {poems.map((p, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.1 }}
              className="border-t border-[#e8e1d3]/25 pt-8"
            >
              <p className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#d4b25b]/80">No. 0{i + 1}</p>
              <h3 className="font-[Cormorant_Garamond] italic text-3xl text-[#e8e1d3] mt-3 mb-6">{p.title}</h3>
              <pre className="font-[Cormorant_Garamond] whitespace-pre-wrap text-2xl leading-snug text-[#e8e1d3]/90 italic">{p.body}</pre>
              <p className="font-[Italianno] text-3xl text-[#d4b25b] mt-8">— T.</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── publications ─── */
function Publications() {
  const rows = [
    ["2024", "Featured Poet", "Anthology — Volume I", "Independent Press"],
    ["2024", "Spread", "Magazine Feature", "Quarterly Journal"],
    ["2023", "Cover Art", "Commissioned Work", "Private Publisher"],
    ["2023", "Selected", "Group Showcase", "Online Exhibition"],
  ];
  return (
    <section id="publications" className="px-8 lg:px-14 py-32">
      <div className="max-w-[1500px] mx-auto">
        <SectionHead n="03" eyebrow="In Print" title="Publications" sub="Where the work has briefly left the studio." />
        <div className="mt-12 border-t border-[#1f2d24]/25">
          {rows.map((r, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.05 }}
              className="group grid grid-cols-12 items-baseline gap-4 py-8 border-b border-[#1f2d24]/20 hover:bg-[#ddd3bd]/40 px-2 -mx-2 transition-colors"
            >
              <span className="col-span-2 font-[Inter] text-[11px] tracking-[0.3em] text-[#c97b5e]">{r[0]}</span>
              <span className="col-span-3 font-[Inter] text-[11px] tracking-[0.3em] uppercase text-[#1f2d24]/60">{r[1]}</span>
              <span className="col-span-5 font-[Cormorant_Garamond] text-3xl italic text-[#1f2d24] group-hover:text-[#c97b5e]">{r[2]}</span>
              <span className="col-span-1 font-[Cormorant_Garamond] text-lg italic text-[#1f2d24]/70 hidden lg:block">{r[3]}</span>
              <span className="col-span-1 text-right"><ArrowUpRight className="h-5 w-5 inline text-[#1f2d24]/50 group-hover:text-[#c97b5e] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── memories ─── */
function Memories() {
  const notes = [
    "a quiet morning, the studio still smelling of turpentine.",
    "first poem in print — i cried over chai.",
    "the colour of the chennai sky in june, after the rain.",
    "mother's handwriting on the back of an old painting.",
    "the way light folds at 4pm in the studio.",
    "an unfinished canvas, leaning against the wall for two years.",
  ];
  return (
    <section id="memories" className="px-8 lg:px-14 py-32 bg-[#ddd3bd]/40 border-y border-[#1f2d24]/15">
      <div className="max-w-[1500px] mx-auto">
        <SectionHead n="04" eyebrow="From the Journal" title="Memoranda" sub="Loose paper. Small remembrances kept in the margins." />
        <ul className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {notes.map((n, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06 }}
              className="border-l-2 border-[#c97b5e]/70 pl-6"
            >
              <p className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/50">No. {String(i + 1).padStart(2, "0")}</p>
              <p className="font-[Cormorant_Garamond] italic text-2xl text-[#1f2d24] mt-2 leading-snug">{n}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── colophon / contact ─── */
function Colophon() {
  return (
    <section id="colophon" className="px-8 lg:px-14 py-32">
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <figure>
            <img src={heroPortrait} alt="Thanishka Yogesh" className="w-full aspect-[4/5] object-cover grayscale-[20%]" />
            <figcaption className="mt-3 font-[Inter] text-[10px] tracking-[0.3em] uppercase text-[#1f2d24]/55 flex justify-between">
              <span>The Maker</span><span>Portrait · 01</span>
            </figcaption>
          </figure>
        </div>
        <div className="lg:col-span-7">
          <SectionHead n="05" eyebrow="Colophon" title="On the Maker" sub="" />
          <div className="mt-10 space-y-6 max-w-xl">
            <p className="font-[Cormorant_Garamond] italic text-2xl text-[#1f2d24] leading-snug">
              "I paint the things I cannot say out loud."
            </p>
            <p className="font-[Inter] text-[15px] leading-[1.8] text-[#1f2d24]/80">
              <span className="font-[Italianno] text-2xl text-[#c97b5e]">[ replace with your real bio ]</span> — a few quiet
              paragraphs about where you come from, what your practice means to you, the recurring themes you keep returning to.
            </p>
            <p className="font-[Inter] text-[15px] leading-[1.8] text-[#1f2d24]/80">
              For commissions, exhibitions, or simply to write back — letters are welcome and read slowly.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6 border-t border-[#1f2d24]/20 pt-8">
              <a href="mailto:hello@thanishka.art" className="group">
                <p className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">By Letter</p>
                <p className="font-[Cormorant_Garamond] italic text-2xl text-[#1f2d24] group-hover:text-[#c97b5e] mt-1 inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> hello@thanishka.art
                </p>
              </a>
              <a href="#" className="group">
                <p className="font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">By Image</p>
                <p className="font-[Cormorant_Garamond] italic text-2xl text-[#1f2d24] group-hover:text-[#c97b5e] mt-1 inline-flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> @thanishka.yogesh
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-[1500px] mx-auto mt-32 border-t border-[#1f2d24]/25 pt-6 flex flex-wrap items-baseline justify-between gap-4 font-[Inter] text-[10px] tracking-[0.35em] uppercase text-[#1f2d24]/55">
        <span>© {new Date().getFullYear()} Thanishka Yogesh</span>
        <span className="font-[Italianno] text-2xl normal-case tracking-normal text-[#c97b5e]">made slowly, with colour & care</span>
        <span>Monograph No. 01 · End</span>
      </footer>
    </section>
  );
}

function SectionHead({ n, eyebrow, title, sub, dark = false }: { n: string; eyebrow: string; title: string; sub: string; dark?: boolean }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6 items-end">
      <div className="lg:col-span-3">
        <p className={`font-[Inter] text-[10px] tracking-[0.35em] uppercase ${dark ? "text-[#d4b25b]/80" : "text-[#c97b5e]"}`}>
          Section · {n}
        </p>
        <p className={`font-[Inter] text-[10px] tracking-[0.35em] uppercase mt-2 ${dark ? "text-[#e8e1d3]/55" : "text-[#1f2d24]/55"}`}>{eyebrow}</p>
      </div>
      <div className="lg:col-span-6">
        <h2 className={`font-[Cormorant_Garamond] font-light text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-[-0.02em] ${dark ? "text-[#e8e1d3]" : "text-[#1f2d24]"}`}>
          {title}
        </h2>
      </div>
      {sub && (
        <div className="lg:col-span-3">
          <p className={`font-[Cormorant_Garamond] italic text-lg leading-snug ${dark ? "text-[#e8e1d3]/75" : "text-[#1f2d24]/70"}`}>
            {sub}
          </p>
        </div>
      )}
    </div>
  );
}

function Nav() {
  const items = [
    { href: "#about", label: "About" },
    { href: "#gallery", label: "Gallery" },
    { href: "#poetry", label: "Poetry" },
    { href: "#publications", label: "Publications" },
    { href: "#memories", label: "Memories" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-xl tracking-wide text-[color:var(--forest)]">
          Thanishka<span className="text-gold-shimmer">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {items.map((i) => (
            <a key={i.href} href={i.href} className="text-[color:var(--ink)]/80 hover:text-[color:var(--forest)] transition-colors">
              {i.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-[color:var(--forest)] text-[color:var(--ivory)] px-4 py-2 text-sm hover:opacity-90">
          Say hello <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-24 px-6">
      <img src={botanical1} alt="" className="pointer-events-none select-none absolute -top-6 -left-10 w-72 opacity-60 animate-floaty" style={{ ["--r" as never]: "-8deg" }} />
      <img src={botanical2} alt="" className="pointer-events-none select-none absolute top-32 right-0 w-80 opacity-50 animate-floaty" style={{ ["--r" as never]: "6deg" }} />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="lg:col-span-7"
        >
          <p className="font-hand text-2xl text-[color:var(--terracotta)] mb-3">welcome, wanderer —</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-[color:var(--ink)]">
            The World of
            <span className="block font-script text-7xl md:text-9xl text-gold-shimmer leading-none mt-2">Thanishka</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-[color:var(--ink)]/75 leading-relaxed">
            An artist, poet, and storyteller. This is a living journal of paintings,
            verses, publications, and quiet memories — a universe stitched in colour
            and feeling.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#gallery" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--forest)] text-[color:var(--ivory)] px-6 py-3 hover:opacity-90 transition">
              <Palette className="h-4 w-4" /> Explore the Gallery
            </a>
            <a href="#poetry" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--forest)]/30 px-6 py-3 hover:bg-[color:var(--forest)]/5 transition">
              <Feather className="h-4 w-4" /> Read Poetry
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative">
            <div className="polaroid rotate-3 max-w-sm mx-auto">
              <span className="tape left-1/2 -translate-x-1/2 -top-2" />
              <img src={heroPainting} alt="Featured artwork by Thanishka" className="w-full aspect-[4/5] object-cover" />
              <p className="font-hand text-center text-xl mt-3 text-[color:var(--ink)]/80">a piece of her world</p>
            </div>
            <div className="polaroid -rotate-6 absolute -bottom-10 -left-6 w-40 hidden md:block">
              <img src={heroPortrait} alt="Portrait of Thanishka" className="w-full aspect-square object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["paintings", "poetry", "publications", "memories", "stories", "colour", "stillness", "wonder"];
  return (
    <div className="overflow-hidden py-6 border-y border-[color:var(--forest)]/15 bg-[color:var(--ivory)]/40">
      <div className="marquee whitespace-nowrap">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="font-display italic text-3xl md:text-5xl text-[color:var(--forest)]/70">
            {w} <Sparkles className="inline h-4 w-4 mx-4 text-[color:var(--gold)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 py-24 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
        <p className="font-hand text-xl text-[color:var(--terracotta)]">{kicker}</p>
        <h2 className="font-display text-4xl md:text-6xl mt-2 text-[color:var(--ink)]">{title}</h2>
        <div className="divider-leaf mt-6 mb-12" />
      </motion.div>
      {children}
    </section>
  );
}

function About() {
  return (
    <Section id="about" kicker="a little about me" title="The hands behind the brush">
      <div className="grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <div className="frame-card rounded-2xl p-3 rotate-[-1deg]">
            <img src={heroPortrait} alt="Thanishka" className="w-full aspect-[4/5] object-cover rounded-xl" />
          </div>
        </div>
        <div className="md:col-span-7 space-y-5 text-lg text-[color:var(--ink)]/80 leading-relaxed">
          <p className="font-display text-2xl italic text-[color:var(--forest)]">
            "I paint the things I cannot say out loud."
          </p>
          <p>
            <span className="font-hand text-2xl text-[color:var(--terracotta)]">[ Replace this with your real bio. ]</span> A few sentences
            about who you are, where you come from, and what your creative practice means to you.
          </p>
          <p>
            You can describe your style, the mediums you love — watercolour, ink, acrylic — and the
            recurring themes in your work: nature, women, memory, longing, light.
          </p>
          <p>
            Close with what you hope visitors carry away with them after wandering through your world.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Gallery() {
  const tiles = Array.from({ length: 8 }).map((_, i) => ({
    title: `Untitled No. ${i + 1}`,
    medium: ["Watercolour", "Acrylic", "Ink & Wash", "Mixed Media"][i % 4],
  }));
  return (
    <Section id="gallery" kicker="the gallery" title="Paintings & visual works">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }}
            className="group relative frame-card rounded-xl overflow-hidden aspect-[3/4]"
          >
            <div className="absolute inset-0 paper-texture bg-[color:var(--beige)] flex items-center justify-center">
              <Palette className="h-10 w-10 text-[color:var(--forest)]/30" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[color:var(--ink)]/70 to-transparent text-[color:var(--ivory)] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <p className="font-display text-lg">{t.title}</p>
              <p className="text-xs opacity-80">{t.medium}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-center font-hand text-xl text-[color:var(--ink)]/60">
        — your real artworks will live here. swap each tile with your own pieces. —
      </p>
    </Section>
  );
}

function Poetry() {
  const poems = [
    { title: "On Rainfall", body: "and the sky, too,\nwept softly that evening\nas if to keep me company." },
    { title: "Half-Moons", body: "I keep your name\nin the folds of my palm,\nlike a half-remembered prayer." },
    { title: "Of Quiet Things", body: "the kettle hums.\nthe window breathes.\nI am — for once — enough." },
  ];
  return (
    <Section id="poetry" kicker="in verse" title="Poetry & little writings">
      <div className="grid md:grid-cols-3 gap-6">
        {poems.map((p, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
            className="paper-texture frame-card rounded-2xl p-8"
          >
            <Feather className="h-5 w-5 text-[color:var(--terracotta)] mb-4" />
            <h3 className="font-display text-2xl text-[color:var(--forest)] mb-4">{p.title}</h3>
            <pre className="font-hand text-2xl leading-snug text-[color:var(--ink)]/85 whitespace-pre-wrap">{p.body}</pre>
            <p className="mt-6 font-script text-3xl text-[color:var(--terracotta)]">— Thanishka</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Publications() {
  const pubs = [
    { title: "Anthology — Vol. I", outlet: "Featured Poet", year: "2024" },
    { title: "Magazine Spread", outlet: "Independent Journal", year: "2024" },
    { title: "Book Cover Art", outlet: "Commissioned Work", year: "2023" },
  ];
  return (
    <Section id="publications" kicker="in print" title="Publications & features">
      <div className="grid md:grid-cols-3 gap-6">
        {pubs.map((p, i) => (
          <div key={i} className="rounded-2xl border border-[color:var(--forest)]/15 bg-[color:var(--ivory)] p-8 hover:shadow-[var(--shadow-elegant)] transition">
            <BookOpen className="h-6 w-6 text-[color:var(--gold)] mb-4" />
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--forest)]/70">{p.year}</p>
            <h3 className="font-display text-2xl mt-2 text-[color:var(--ink)]">{p.title}</h3>
            <p className="mt-2 text-[color:var(--ink)]/70">{p.outlet}</p>
            <a href="#" className="mt-6 inline-flex items-center gap-2 text-[color:var(--forest)] text-sm hover:underline">
              Read more <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Memories() {
  const notes = [
    { text: "a quiet morning, the studio still smelling of turpentine.", rot: -4 },
    { text: "first time my poem appeared in print — i cried over chai.", rot: 3 },
    { text: "the colour of the sky in chennai, in june, after the rain.", rot: -2 },
    { text: "mom's handwriting on the back of an old painting.", rot: 5 },
  ];
  return (
    <Section id="memories" kicker="from the journal" title="Little memories & moments">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {notes.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
            className="polaroid relative"
            style={{ transform: `rotate(${n.rot}deg)` }}
          >
            <span className="tape left-1/2 -translate-x-1/2 -top-2" />
            <div className="aspect-square paper-texture bg-[color:var(--beige)] flex items-center justify-center">
              <Heart className="h-8 w-8 text-[color:var(--rose)]" />
            </div>
            <p className="font-hand text-lg text-center mt-3 text-[color:var(--ink)]/80">{n.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" kicker="say hello" title="Let's share a little world">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-5 text-lg text-[color:var(--ink)]/80">
          <p className="font-display text-2xl italic text-[color:var(--forest)]">
            For commissions, collaborations, or simply to say something kind —
          </p>
          <p>I read every letter that lands in my inbox. Slowly, but with care.</p>
          <div className="flex flex-col gap-3 pt-4">
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-3 hover:text-[color:var(--forest)]">
              <Mail className="h-5 w-5" /> hello@thanishka.art
            </a>
            <a href="#" className="inline-flex items-center gap-3 hover:text-[color:var(--forest)]">
              <Instagram className="h-5 w-5" /> @thanishka.yogesh
            </a>
          </div>
        </div>
        <form
          className="frame-card rounded-2xl p-6 space-y-4 bg-[color:var(--ivory)]"
          onSubmit={(e) => { e.preventDefault(); alert("Thank you — your message has been noted (wire this to backend)."); }}
        >
          <div>
            <label className="text-sm text-[color:var(--ink)]/70">your name</label>
            <input required className="mt-1 w-full rounded-lg border border-[color:var(--forest)]/20 bg-transparent px-4 py-3 outline-none focus:border-[color:var(--forest)]" />
          </div>
          <div>
            <label className="text-sm text-[color:var(--ink)]/70">your email</label>
            <input type="email" required className="mt-1 w-full rounded-lg border border-[color:var(--forest)]/20 bg-transparent px-4 py-3 outline-none focus:border-[color:var(--forest)]" />
          </div>
          <div>
            <label className="text-sm text-[color:var(--ink)]/70">a little message</label>
            <textarea rows={5} required className="mt-1 w-full rounded-lg border border-[color:var(--forest)]/20 bg-transparent px-4 py-3 outline-none focus:border-[color:var(--forest)] resize-none" />
          </div>
          <button type="submit" className="w-full rounded-full bg-[color:var(--forest)] text-[color:var(--ivory)] py-3 hover:opacity-90 transition">
            Send with love
          </button>
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-[color:var(--forest)]/15 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[color:var(--ink)]/60">
        <p className="font-script text-3xl text-[color:var(--forest)]">Thanishka Yogesh</p>
        <p>© {new Date().getFullYear()} — made slowly, with colour & care.</p>
      </div>
    </footer>
  );
}
