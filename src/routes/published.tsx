import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { usePublications, publicUrl } from "@/lib/data";
import { Floral, Sparkle, Divider } from "@/components/site/decor";

export const Route = createFileRoute("/published")({
  head: () => ({
    meta: [
      { title: "Published Corner — Thanishka Yogesh" },
      { name: "description", content: "Newspaper publications, literary anthology features and printed work by Thanishka Yogesh." },
      { property: "og:title", content: "Published Corner — Thanishka Yogesh" },
      { property: "og:description", content: "A literary archive of published poems and featured work." },
    ],
  }),
  component: PublishedPage,
});

function PublishedPage() {
  const { data = [], isLoading } = usePublications();
  const newspapers = data.filter(p => (p.category ?? "").toLowerCase().includes("news"));
  const anthologies = data.filter(p => (p.category ?? "").toLowerCase().includes("anthology"));
  const others = data.filter(p => !newspapers.includes(p) && !anthologies.includes(p));

  return (
    <div className="relative">
      <section className="px-6 lg:px-12 pt-12 pb-10 text-center relative overflow-hidden">
        <Floral className="absolute top-6 left-1/4 w-20 text-[color:var(--gold)]/60 animate-floaty" />
        <p className="font-script text-5xl text-[color:var(--terracotta)] mt-6">— the literary archive —</p>
        <h1 className="font-display font-light text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.9] text-[color:var(--forest)]">Published Corner</h1>
        <p className="mt-5 font-display italic text-2xl text-[color:var(--forest)]/75 max-w-3xl mx-auto">
          Poems and writing that have briefly left the journal — into newspapers, anthologies, and other printed places.
        </p>
      </section>

      {isLoading ? (
        <p className="text-center font-script text-3xl text-[color:var(--terracotta)] py-20">opening the archive…</p>
      ) : data.length === 0 ? (
        <p className="text-center font-display italic text-2xl text-[color:var(--forest)]/70 py-20">No publications added yet. Upload them from the admin dashboard.</p>
      ) : (
        <>
          {newspapers.length > 0 && <Shelf title="Newspaper Publications" items={newspapers} variant="newspaper" />}
          {anthologies.length > 0 && <Shelf title="Literary Anthologies" items={anthologies} variant="anthology" />}
          {others.length > 0 && <Shelf title="Other Featured Work" items={others} variant="other" />}
        </>
      )}
    </div>
  );
}

function Shelf({ title, items, variant }: { title: string; items: any[]; variant: string }) {
  return (
    <section className="px-6 lg:px-12 py-16">
      <div className="max-w-[1500px] mx-auto">
        <Divider label={title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {items.map((p, i) => (
            <motion.article key={p.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (i % 6) * 0.06 }}
              className="group relative bg-[color:var(--ivory)] rounded-sm shadow-[var(--shadow-elegant)] overflow-hidden hover:-translate-y-2 transition-all duration-500"
              style={{ transform: `rotate(${((i % 3) - 1) * 0.4}deg)` }}
            >
              {p.is_featured && <Sparkle className="absolute top-2 right-2 z-10 w-4 text-[color:var(--gold)] animate-pulse" />}
              <div className="aspect-[3/4] bg-[color:var(--beige)] overflow-hidden border-b border-[color:var(--forest)]/15">
                {p.cover_url ? (
                  <img src={publicUrl("publications", p.cover_url)} alt={p.title} loading="lazy" className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${variant === "newspaper" ? "sepia-[20%]" : ""}`} />
                ) : (
                  <div className="w-full h-full paper-texture flex items-center justify-center font-script text-4xl text-[color:var(--terracotta)]">archive</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-[10px] tracking-[0.35em] uppercase text-[color:var(--terracotta)]">{p.publication_name || "Publication"}</p>
                <h3 className="font-display italic text-2xl text-[color:var(--forest)] mt-1 leading-tight">{p.title}</h3>
                {p.publication_date && <p className="text-xs text-[color:var(--forest)]/55 mt-1">{new Date(p.publication_date).toLocaleDateString(undefined, { dateStyle: "long" })}</p>}
                {p.description && <p className="font-display italic text-base text-[color:var(--ink)]/75 mt-3 line-clamp-3">{p.description}</p>}
                {p.file_url && (
                  <a href={publicUrl("publications", p.file_url)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[color:var(--terracotta)] hover:underline">
                    open publication <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}