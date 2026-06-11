import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, FileText } from "lucide-react";
import { usePoems, publicUrl, type Poem } from "@/lib/data";
import { Floral, InkSwirl, Sparkle, Divider } from "@/components/site/decor";

export const Route = createFileRoute("/poetry")({
  head: () => ({
    meta: [
      { title: "Poetry — Thanishka Yogesh" },
      { name: "description", content: "Handwritten journal pages and published verse by Thanishka Yogesh." },
      { property: "og:title", content: "Poetry — Thanishka Yogesh" },
      { property: "og:description", content: "A growing collection of poems on rain, memory, quiet, and being." },
    ],
  }),
  component: PoetryPage,
});

function PoetryPage() {
  const { data = [], isLoading } = usePoems();
  const [open, setOpen] = useState<Poem | null>(null);

  return (
    <div className="relative">
      <section className="px-6 lg:px-12 pt-12 pb-10 text-center relative overflow-hidden">
        <Floral className="absolute top-10 left-10 w-24 text-[color:var(--rose)]/60 animate-floaty" />
        <Floral className="absolute top-10 right-10 w-20 text-[color:var(--lavender)]/60 animate-floaty" style={{ animationDelay: "1.5s" }} />
        <p className="font-script text-5xl text-[color:var(--terracotta)] mt-6">— from the journal —</p>
        <h1 className="font-display font-light text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] text-[color:var(--forest)]">Poetry</h1>
        <p className="mt-5 font-display italic text-2xl text-[color:var(--forest)]/75 max-w-2xl mx-auto">
          Thirty-seven pages and counting — pulled in handwriting from a notebook kept across many monsoons.
        </p>
        <InkSwirl className="w-80 mx-auto mt-6 text-[color:var(--terracotta)]" />
      </section>

      <Divider label="open a page" />

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-[1500px] mx-auto">
          {isLoading ? (
            <p className="text-center font-script text-3xl text-[color:var(--terracotta)] py-20">turning the pages…</p>
          ) : data.length === 0 ? (
            <p className="text-center font-display italic text-2xl text-[color:var(--forest)]/70 py-20">The notebook is still being typeset. Add a poem from the admin dashboard.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 9) * 0.04 }}
                  onClick={() => setOpen(p)}
                  className="text-left relative bg-[color:var(--cream)] p-7 pb-12 rounded-sm shadow-[var(--shadow-elegant)] paper-texture hover:-translate-y-1.5 transition-all duration-500 group"
                  style={{ transform: `rotate(${((i % 4) - 1.5) * 0.8}deg)` }}
                >
                  <span className="tape" style={{ left: "50%", top: "-10px", marginLeft: "-35px" }} />
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] tracking-[0.35em] uppercase text-[color:var(--terracotta)]">Page · {String(i + 1).padStart(2, "0")}</p>
                    {p.is_featured && <Sparkle className="w-3 text-[color:var(--gold)]" />}
                  </div>
                  <h3 className="font-display italic text-3xl text-[color:var(--forest)] mt-3 mb-4 leading-tight">{p.title}</h3>
                  <pre className="font-display whitespace-pre-wrap italic text-lg leading-snug text-[color:var(--ink)]/85 line-clamp-6">{p.excerpt || p.body}</pre>
                  <p className="font-script text-3xl text-[color:var(--terracotta)] mt-6 text-right">— T.</p>
                  {p.pdf_url && <FileText className="absolute bottom-3 left-3 h-4 w-4 text-[color:var(--forest)]/40" />}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] bg-[color:var(--ink)]/85 backdrop-blur-md flex items-center justify-center p-4 lg:p-10">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[color:var(--cream)] p-10 lg:p-16 rounded-sm shadow-2xl paper-texture">
              <button onClick={() => setOpen(null)} aria-label="Close" className="absolute top-3 right-3 p-2 rounded-full bg-[color:var(--cream)]/90 hover:bg-[color:var(--terracotta)] hover:text-[color:var(--cream)] transition-colors">
                <X className="h-5 w-5" />
              </button>
              <p className="font-script text-4xl text-[color:var(--terracotta)]">— a page —</p>
              <h2 className="font-display italic text-5xl text-[color:var(--forest)] mt-2">{open.title}</h2>
              {open.written_on && <p className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/55 mt-2">{new Date(open.written_on).toLocaleDateString(undefined, { dateStyle: "long" })}</p>}
              <InkSwirl className="w-60 mt-4 text-[color:var(--terracotta)]" />
              {open.body && <pre className="font-display whitespace-pre-wrap italic text-2xl leading-relaxed text-[color:var(--ink)] mt-8">{open.body}</pre>}
              {open.pdf_url && (
                <a href={publicUrl("poems", open.pdf_url)} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-[color:var(--terracotta)] font-display italic text-lg hover:underline">
                  <FileText className="h-5 w-5" /> open original page
                </a>
              )}
              <p className="font-script text-4xl text-[color:var(--terracotta)] mt-10 text-right">— Thanishka</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}