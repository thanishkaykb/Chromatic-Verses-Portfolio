import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useArtworks, publicUrl, type Artwork } from "@/lib/data";
import { Floral, Leaf, Splash, Sparkle, Divider } from "@/components/site/decor";

/* Bento layout pattern (matches the reference mosaic). 13 tiles per chunk.
   Each entry is a tailwind class applied on a 12-col grid. */
const BENTO: string[] = [
  "col-span-3 row-span-1 aspect-square",          // 1 small top-left
  "col-span-3 row-span-2 aspect-[3/4]",           // 2 tall
  "col-span-3 row-span-1 aspect-[4/3]",           // 3
  "col-span-3 row-span-1 aspect-square",          // 4
  "col-span-2 row-span-1 aspect-square",          // 5
  "col-span-4 row-span-2 aspect-[4/3]",           // 6 BIG centre
  "col-span-3 row-span-1 aspect-[4/3]",           // 7
  "col-span-3 row-span-1 aspect-[4/3]",           // 8
  "col-span-2 row-span-1 aspect-square",          // 9
  "col-span-3 row-span-1 aspect-square",          // 10
  "col-span-3 row-span-1 aspect-[4/3]",           // 11
  "col-span-3 row-span-1 aspect-square",          // 12
  "col-span-3 row-span-1 aspect-[3/4]",           // 13
];

export const Route = createFileRoute("/artworks")({
  head: () => ({
    meta: [
      { title: "Drawings & Artworks — Thanishka Yogesh" },
      { name: "description", content: "A walking gallery of paintings, sketches, watercolours and mixed-media works by Thanishka Yogesh." },
      { property: "og:title", content: "Drawings & Artworks — Thanishka Yogesh" },
      { property: "og:description", content: "Step inside an exhibition of paintings, sketches and visual studies." },
    ],
  }),
  component: ArtworksPage,
});

const CATS = ["all", "paintings", "drawings", "watercolour", "mixed media", "sketches"];

function ArtworksPage() {
  const { data = [], isLoading } = useArtworks();
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<Artwork | null>(null);

  const list = useMemo(() => cat === "all" ? data : data.filter(a => a.category?.toLowerCase() === cat), [cat, data]);

  return (
    <div className="relative overflow-hidden">
      <Splash className="absolute top-32 -left-40 w-[500px] text-[color:var(--sage)] opacity-50 pointer-events-none" />
      <Splash className="absolute bottom-20 -right-40 w-[500px] text-[color:var(--terracotta)] opacity-30 pointer-events-none" />

      <section className="relative px-6 lg:px-12 pt-12 pb-10">
        <div className="max-w-[1500px] mx-auto text-center relative">
          <Floral className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 text-[color:var(--gold)]/70 animate-floaty" />
          <p className="font-script text-5xl text-[color:var(--terracotta)] mt-6">— the gallery —</p>
          <h1 className="font-display font-light text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] text-[color:var(--forest)]">Drawings & Artworks</h1>
          <p className="mt-5 font-display italic text-2xl text-[color:var(--forest)]/75 max-w-2xl mx-auto">
            Wander, hover, pause. Click any plate to see the work in full and read its story.
          </p>

          {/* category chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-sm uppercase tracking-[0.2em] transition-all ${cat === c ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "border border-[color:var(--forest)]/30 text-[color:var(--forest)]/70 hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)]"}`}
              >{c}</button>
            ))}
          </div>
        </div>
      </section>

      <Divider label="the plates" />

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-[1500px] mx-auto">
          {isLoading ? (
            <p className="text-center font-script text-3xl text-[color:var(--terracotta)] py-20">unrolling the canvases…</p>
          ) : list.length === 0 ? (
            <EmptyGallery />
          ) : (
            <div className="grid grid-cols-6 lg:grid-cols-12 auto-rows-[110px] md:auto-rows-[160px] lg:auto-rows-[180px] gap-4 lg:gap-5">
              {list.map((a, i) => {
                const span = BENTO[i % BENTO.length];
                return (
                  <motion.button
                    key={a.id}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.55, delay: (i % 6) * 0.05 }}
                    onClick={() => setOpen(a)}
                    className={`${span} relative group overflow-hidden bg-[color:var(--beige)] rounded-sm shadow-[var(--shadow-frame)] hover:shadow-[var(--shadow-elegant)] transition-all`}
                  >
                    <img src={publicUrl("artworks", a.image_url)} alt={a.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4 bg-gradient-to-t from-[color:var(--ink)]/90 via-[color:var(--ink)]/30 to-transparent text-[color:var(--cream)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <p className="font-display italic text-lg lg:text-xl leading-tight truncate">{a.title}</p>
                      {(a.medium || a.year) && <p className="text-[9px] tracking-[0.3em] uppercase opacity-80 truncate">{a.medium}{a.year ? ` · ${a.year}` : ""}</p>}
                    </div>
                    {a.is_featured && <Sparkle className="absolute top-2 right-2 w-4 text-[color:var(--gold)] animate-pulse" />}
                  </motion.button>
                );
              })}
            </div>
          )}
          <p className="mt-16 text-center font-script text-3xl text-[color:var(--terracotta)]">— more works always in progress —</p>
        </div>
      </section>

      <Lightbox art={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="text-center py-24">
      <Leaf className="w-24 mx-auto text-[color:var(--sage)]" />
      <p className="mt-6 font-display italic text-2xl text-[color:var(--forest)]/70">The gallery is being hung. Come back soon — or add your first artwork from the admin dashboard.</p>
    </div>
  );
}

function Lightbox({ art, onClose }: { art: Artwork | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {art && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-[color:var(--ink)]/85 backdrop-blur-md flex items-center justify-center p-4 lg:p-10">
          <motion.div initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[90vh] bg-[color:var(--cream)] grid lg:grid-cols-5 gap-0 overflow-hidden rounded-sm shadow-2xl">
            <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[color:var(--cream)]/90 hover:bg-[color:var(--terracotta)] hover:text-[color:var(--cream)] transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="lg:col-span-3 bg-[color:var(--ink)] flex items-center justify-center max-h-[60vh] lg:max-h-[90vh] overflow-hidden">
              <img src={publicUrl("artworks", art.image_url)} alt={art.title} className="max-w-full max-h-[90vh] object-contain" />
            </div>
            <div className="lg:col-span-2 p-8 lg:p-10 paper-texture overflow-y-auto">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[color:var(--terracotta)]">{art.category}</p>
              <h2 className="font-display italic text-4xl text-[color:var(--forest)] mt-3 leading-tight">{art.title}</h2>
              <p className="font-hand text-xl text-[color:var(--ink)]/75 mt-2">
                {art.medium}{art.year ? ` · ${art.year}` : ""}
              </p>
              {art.description && (
                <p className="mt-6 font-display italic text-lg text-[color:var(--ink)]/85 leading-relaxed whitespace-pre-line">{art.description}</p>
              )}
              <div className="mt-10 border-t border-[color:var(--forest)]/15 pt-4 font-script text-3xl text-[color:var(--terracotta)]">— Thanishka</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}