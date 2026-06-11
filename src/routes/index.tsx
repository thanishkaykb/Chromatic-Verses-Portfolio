import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import portraitAsset from "@/assets/portrait-garden.jpg.asset.json";
import { Floral, Leaf, Splash, InkSwirl, Sparkle, Divider } from "@/components/site/decor";
import { Polaroid } from "@/components/site/polaroid";
import { useArtworks, usePoems, usePublications, publicUrl } from "@/lib/data";

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
  const arts = useArtworks();
  const poems = usePoems();
  const pubs = usePublications();
  return (
    <div className="overflow-x-hidden">
      <Cover />
      <Marquee />
      <FeaturedWorks items={arts.data?.slice(0, 6) ?? []} />
      <PoetryTease items={poems.data?.slice(0, 3) ?? []} />
      <PublishedTease items={pubs.data?.slice(0, 4) ?? []} />
      <PolaroidStrip />
      <ClosingCard />
    </div>
  );
}

/* ─── shared ─── */
// (motion variants inlined per-element to keep framer-motion types happy)

/* ─── cover ─── */
function Cover() {
  return (
    <section className="relative min-h-[92vh] pt-12 pb-20 px-6 lg:px-12 overflow-hidden">
      {/* decorative scatter */}
      <Leaf className="absolute -left-10 top-10 w-44 text-[color:var(--sage)]/55 animate-floaty" style={{ ["--r" as any]: "-12deg", transform: "rotate(-12deg)" }} />
      <Leaf className="absolute right-4 top-32 w-32 text-[color:var(--forest)]/35 animate-floaty" style={{ ["--r" as any]: "20deg", transform: "rotate(20deg)", animationDelay: "1.5s" }} />
      <Floral className="absolute left-1/3 top-6 w-20 text-[color:var(--rose)]/55 animate-floaty" />
      <Splash className="absolute -bottom-20 -right-20 w-[420px] text-[color:var(--terracotta)]" />
      <Sparkle className="absolute top-24 left-1/2 w-4 text-[color:var(--gold)] animate-pulse" />

      <div className="max-w-[1500px] mx-auto relative">
        <div className="flex items-center justify-between border-y border-[color:var(--forest)]/20 py-3 text-[10px] tracking-[0.35em] uppercase text-[color:var(--forest)]/65">
          <span>Vol. I · {new Date().getFullYear()}</span>
          <span className="hidden md:inline">Paintings · Verse · Published Corner · Memories</span>
          <span>Edition of One</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-12 lg:mt-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="lg:col-span-7 relative">
            <p className="font-script text-5xl text-[color:var(--terracotta)] leading-none mb-4">— welcome to the world of —</p>
            <h1 className="font-display font-light text-[clamp(4rem,12vw,10.5rem)] leading-[0.85] tracking-tight text-[color:var(--forest)]">
              Thanishka
              <span className="block italic text-gold-shimmer">Yogesh</span>
            </h1>
            <InkSwirl className="w-72 text-[color:var(--terracotta)] mt-4" />
            <p className="mt-6 font-display italic text-2xl text-[color:var(--forest)]/85 max-w-xl leading-snug">
              Artist · Published Poet · Storyteller — keeping a slow, ongoing record of colour, verse, and quiet things.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/artworks" className="group inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-7 py-3.5 rounded-full font-display italic text-lg hover:bg-[color:var(--terracotta)] transition-colors">
                Wander the gallery <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/poetry" className="group inline-flex items-center gap-2 border border-[color:var(--forest)]/40 px-7 py-3.5 rounded-full font-display italic text-lg text-[color:var(--forest)] hover:bg-[color:var(--forest)] hover:text-[color:var(--cream)] transition-colors">
                Read the poetry
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.2 }} className="lg:col-span-5 relative">
            <div className="relative">
              <Floral className="absolute -top-10 -left-10 w-24 text-[color:var(--gold)]/70 animate-floaty" />
              <Floral className="absolute -bottom-8 -right-8 w-28 text-[color:var(--coral)]/60 animate-floaty" style={{ animationDelay: "2s" }} />
              <figure className="relative">
                <img src={portraitAsset.url} alt="Thanishka in the garden" className="w-full aspect-[4/5] object-cover rounded-sm shadow-[var(--shadow-frame)]" />
                <div className="absolute inset-3 border border-[color:var(--cream)]/40 pointer-events-none" />
                <Polaroid src={portraitAsset.url} caption="in the green house ✿" rotate={-8} className="!absolute -bottom-10 -left-12 w-40 hidden md:inline-block" />
              </figure>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── marquee ribbon ── */
function Marquee() {
  const words = ["paintings", "✿", "poetry", "❀", "published in newspapers", "✦", "literary anthologies", "❀", "handmade creations", "✿"];
  return (
    <div className="border-y border-[color:var(--forest)]/15 bg-[color:var(--forest)] text-[color:var(--cream)] py-4 overflow-hidden">
      <div className="marquee whitespace-nowrap font-display italic text-2xl">
        {[...words, ...words, ...words].map((w, i) => <span key={i} className="mx-6">{w}</span>)}
      </div>
    </div>
  );
}

/* ── featured works grid (with link to full gallery) ── */
function FeaturedWorks({ items }: { items: ReturnType<typeof useArtworks>["data"] extends infer T ? T extends Array<infer U> ? U[] : never : never }) {
  return (
    <section className="relative px-6 lg:px-12 py-28">
      <Splash className="absolute top-10 -left-32 w-[400px] text-[color:var(--sage)] opacity-60" />
      <div className="max-w-[1500px] mx-auto relative">
        <SectionHead n="02" eyebrow="The Plates" title="Drawings & Artworks" sub="A curated selection from an ongoing body of 55+ works in pencil, watercolour, ink and acrylic." />
        <div className="mt-16 grid grid-cols-12 gap-5 lg:gap-7">
          {(items.length ? items : Array.from({ length: 6 }).map((_, i) => ({ id: String(i), title: "Awaiting upload", medium: "—", year: null, image_url: "", description: null, category: "paintings", display_order: i, is_featured: false }))).slice(0,6).map((t: any, i) => {
            const spans = [
              "col-span-12 md:col-span-7 row-span-2 aspect-[4/5]",
              "col-span-12 md:col-span-5 aspect-[5/4]",
              "col-span-6 md:col-span-5 aspect-[3/4]",
              "col-span-6 md:col-span-4 aspect-[3/4]",
              "col-span-6 md:col-span-4 aspect-[3/4]",
              "col-span-12 md:col-span-4 aspect-[4/5]",
            ];
            return (
              <motion.figure key={t.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay: i * 0.06 }} className={`${spans[i]} relative overflow-hidden group bg-[color:var(--beige)] rounded-sm shadow-[var(--shadow-frame)]`}>
                {t.image_url ? (
                  <img src={publicUrl("artworks", t.image_url)} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full paper-texture flex items-center justify-center"><span className="font-script text-3xl text-[color:var(--terracotta)]">soon ✿</span></div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[color:var(--ink)]/85 via-[color:var(--ink)]/30 to-transparent text-[color:var(--cream)] translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-display italic text-xl">{t.title}</p>
                  {t.medium && <p className="text-[10px] tracking-[0.3em] uppercase opacity-80">{t.medium}{t.year ? ` · ${t.year}` : ""}</p>}
                </div>
              </motion.figure>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link to="/artworks" className="inline-flex items-center gap-2 font-display italic text-2xl text-[color:var(--terracotta)] hover:text-[color:var(--forest)]">
            Enter the full gallery <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── poetry tease ── */
function PoetryTease({ items }: { items: any[] }) {
  const fallback = [
    { id: "f1", title: "On Rainfall", excerpt: "and the sky, too,\nwept softly that evening\nas if to keep me company.", body: "" },
    { id: "f2", title: "Half-Moons", excerpt: "I keep your name\nin the folds of my palm,\nlike a half-remembered prayer.", body: "" },
    { id: "f3", title: "Of Quiet Things", excerpt: "the kettle hums.\nthe window breathes.\nI am — for once — enough.", body: "" },
  ];
  const list = items.length ? items : fallback;
  return (
    <section className="relative bg-[color:var(--forest)] text-[color:var(--cream)] py-28 px-6 lg:px-12 overflow-hidden">
      <Floral className="absolute top-10 right-10 w-32 text-[color:var(--gold)]/40 animate-floaty" />
      <Floral className="absolute bottom-10 left-10 w-40 text-[color:var(--terracotta)]/40 animate-floaty" style={{ animationDelay: "2s" }} />
      <div className="max-w-[1500px] mx-auto relative">
        <SectionHead n="03" eyebrow="In Verse" title="Poetry" sub="Journal pages pulled in handwriting." dark />
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {list.slice(0,3).map((p: any, i: number) => (
            <motion.article key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.1 }}
              className="relative bg-[color:var(--cream)] text-[color:var(--ink)] p-8 rounded-sm shadow-[var(--shadow-elegant)] paper-texture transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1deg]"
              style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
            >
              <span className="tape" style={{ left: "50%", top: "-10px", marginLeft: "-35px" }} />
              <p className="text-[10px] tracking-[0.35em] uppercase text-[color:var(--terracotta)]">No. 0{i + 1}</p>
              <h3 className="font-display italic text-3xl mt-2 mb-5">{p.title}</h3>
              <pre className="font-display whitespace-pre-wrap text-xl leading-snug italic">{(p.excerpt || p.body || "").slice(0, 220)}</pre>
              <p className="font-script text-3xl text-[color:var(--terracotta)] mt-6 text-right">— T.</p>
            </motion.article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/poetry" className="inline-flex items-center gap-2 font-display italic text-2xl text-[color:var(--gold)] hover:text-[color:var(--cream)]">
            Read more from the journal <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── published tease ── */
function PublishedTease({ items }: { items: any[] }) {
  return (
    <section className="relative px-6 lg:px-12 py-28">
      <div className="max-w-[1500px] mx-auto">
        <SectionHead n="04" eyebrow="Published Corner" title="In Print" sub="Newspapers, literary anthologies and featured publications — collected as keepsakes." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(items.length ? items : Array.from({length: 4}).map((_,i) => ({id:String(i), title:"Coming soon", publication_name:"—", cover_url:""}))).slice(0,4).map((p: any, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }}
              className="relative group">
              <div className="aspect-[3/4] bg-[color:var(--beige)] paper-texture rounded-sm shadow-[var(--shadow-frame)] overflow-hidden">
                {p.cover_url ? <img src={publicUrl("publications", p.cover_url)} alt={p.title} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-[color:var(--terracotta)]">Archive</span>
                    <span className="font-script text-4xl text-[color:var(--forest)] mt-2">soon</span>
                  </div>
                )}
              </div>
              <p className="mt-3 font-display italic text-xl text-[color:var(--forest)]">{p.title}</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/55">{p.publication_name}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/published" className="inline-flex items-center gap-2 font-display italic text-2xl text-[color:var(--terracotta)] hover:text-[color:var(--forest)]">
            Visit the Published Corner <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── polaroid scrapbook strip ── */
function PolaroidStrip() {
  return (
    <section className="relative px-6 lg:px-12 py-28 bg-[color:var(--beige)]/60 border-y border-[color:var(--forest)]/15 overflow-hidden">
      <Divider label="from the scrapbook" />
      <div className="max-w-[1500px] mx-auto flex flex-wrap justify-center gap-10 items-end mt-8">
        {[
          { src: portraitAsset.url, c: "in the green house ✿", r: -7 },
          { c: "studio mornings · turpentine & chai", r: 4 },
          { c: "first poem in print — I cried", r: -3 },
          { src: portraitAsset.url, c: "summer of ferns", r: 6 },
          { c: "the unfinished canvas, still waiting", r: -5 },
        ].map((p, i) => (
          <Polaroid key={i} src={p.src} caption={p.c} rotate={p.r} className="w-52" />
        ))}
      </div>
    </section>
  );
}

/* ── closing ── */
function ClosingCard() {
  return (
    <section className="relative px-6 lg:px-12 py-28">
      <div className="max-w-3xl mx-auto text-center relative">
        <Sparkle className="absolute -top-4 left-1/4 w-5 text-[color:var(--gold)] animate-pulse" />
        <Sparkle className="absolute top-10 right-1/4 w-4 text-[color:var(--terracotta)] animate-pulse" />
        <p className="font-script text-5xl text-[color:var(--terracotta)]">— a closing note —</p>
        <p className="font-display italic text-3xl md:text-4xl leading-snug text-[color:var(--forest)] mt-6">
          "Every piece of art begins with curiosity. Every poem with a feeling. And every story deserves to be shared."
        </p>
        <InkSwirl className="w-72 mx-auto mt-8 text-[color:var(--terracotta)]" />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/about" className="px-7 py-3 rounded-full border border-[color:var(--forest)]/40 font-display italic text-lg hover:bg-[color:var(--forest)] hover:text-[color:var(--cream)] transition-colors">Read my story</Link>
          <Link to="/contact" className="px-7 py-3 rounded-full bg-[color:var(--terracotta)] text-[color:var(--cream)] font-display italic text-lg hover:bg-[color:var(--forest)] transition-colors">Write to me</Link>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ n, eyebrow, title, sub, dark = false }: { n: string; eyebrow: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6 items-end">
      <div className="lg:col-span-3">
        <p className={`text-[10px] tracking-[0.35em] uppercase ${dark ? "text-[color:var(--gold)]" : "text-[color:var(--terracotta)]"}`}>Section · {n}</p>
        <p className={`text-[10px] tracking-[0.35em] uppercase mt-2 ${dark ? "text-[color:var(--cream)]/55" : "text-[color:var(--forest)]/55"}`}>{eyebrow}</p>
      </div>
      <div className="lg:col-span-6">
        <h2 className={`font-display font-light text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-tight ${dark ? "text-[color:var(--cream)]" : "text-[color:var(--forest)]"}`}>
          {title}
        </h2>
      </div>
      {sub && (
        <div className="lg:col-span-3">
          <p className={`font-display italic text-lg leading-snug ${dark ? "text-[color:var(--cream)]/75" : "text-[color:var(--forest)]/70"}`}>{sub}</p>
        </div>
      )}
    </div>
  );
}
