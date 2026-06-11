import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Feather, BookOpen, Mail, Instagram, Palette, Heart, Sparkles, ArrowRight } from "lucide-react";
import heroPainting from "@/assets/hero-painting.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import botanical1 from "@/assets/botanical-1.png";
import botanical2 from "@/assets/botanical-2.png";

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
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Gallery />
      <Poetry />
      <Publications />
      <Memories />
      <Contact />
      <Footer />
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
