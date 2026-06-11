import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait-garden.jpg.asset.json";
import { Floral, Leaf, InkSwirl, Divider } from "@/components/site/decor";
import { Polaroid } from "@/components/site/polaroid";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Thanishka Yogesh — Artist, Poet, Storyteller" },
      { name: "description", content: "Hello, I'm Thanishka Yogesh — artist, published poet, creator and Computer Science student. Read my story." },
      { property: "og:title", content: "About Thanishka Yogesh" },
      { property: "og:description", content: "Artist · Published poet · Storyteller · CSE student at Sri Sairam Engineering College." },
      { property: "og:image", content: portrait.url },
    ],
  }),
  component: AboutPage,
});

const FACTS = [
  ["🎨", "Artist"],
  ["📖", "Published Poet"],
  ["📰", "Featured in Newspapers & Anthologies"],
  ["🧵", "Handmade Creator"],
  ["💻", "B.E. Computer Science Student"],
  ["🌿", "Nature Enthusiast"],
  ["✨", "Storyteller at Heart"],
  ["📚", "Lifelong Learner"],
];

function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* hero */}
      <section className="px-6 lg:px-12 pt-12 pb-20 relative">
        <Leaf className="absolute -left-10 top-20 w-44 text-[color:var(--sage)]/60 animate-floaty" />
        <Floral className="absolute right-6 top-10 w-20 text-[color:var(--rose)]/60 animate-floaty" />
        <div className="max-w-[1500px] mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="lg:col-span-5 relative">
            <Polaroid src={portrait.url} caption="hello, I'm Thanishka ✿" rotate={-4} className="w-full max-w-md" />
            <Polaroid caption="art · poetry · code" rotate={6} className="!absolute -bottom-8 -right-4 w-36 hidden md:inline-block">
              <div className="w-full h-full flex items-center justify-center font-script text-3xl text-[color:var(--forest)]">✿ ❀ ✦</div>
            </Polaroid>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="lg:col-span-7">
            <p className="font-script text-5xl text-[color:var(--terracotta)]">— about me —</p>
            <h1 className="font-display font-light text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] text-[color:var(--forest)] mt-2">
              Hello,<br/>I'm <span className="italic text-gold-shimmer">Thanishka.</span>
            </h1>
            <p className="mt-6 font-display italic text-2xl text-[color:var(--forest)]/85 leading-snug max-w-2xl">
              An artist, published poet, creator, and Computer Science and Engineering student at Sri Sairam Engineering College.
            </p>
            <InkSwirl className="w-72 mt-6 text-[color:var(--terracotta)]" />
          </motion.div>
        </div>
      </section>

      <Divider label="my story" />

      {/* prose */}
      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-3xl mx-auto space-y-6 font-display text-xl leading-[1.8] text-[color:var(--ink)]/90">
          {[
            "For as long as I can remember, I have been drawn to creativity. Whether through colors on a canvas, words on a page, or ideas brought to life by hand, creating has always been my way of understanding the world around me. Every artwork, poem, and handmade creation begins as a thought, a feeling, or a moment that leaves an impression on me and eventually finds its place in my work.",
            "Art allows me to express emotions that cannot always be spoken. Poetry gives a voice to thoughts that often remain hidden. Together, they have become the two most meaningful ways through which I share my perspective, experiences, and imagination.",
            "Over the years, my creative journey has expanded beyond personal expression. My poetry has been featured in newspapers and literary anthologies, giving me the opportunity to connect with readers and share my work with a wider audience. Each publication has become a reminder that creativity has the power to resonate with people in ways we may never expect.",
            "Alongside my artistic pursuits, I am pursuing a degree in Computer Science and Engineering. While technology and art may appear to belong to different worlds, I see them as complementary forms of creation. One is built through logic and innovation, while the other is shaped by emotion and imagination. Together, they inspire me to explore new possibilities and creative experiences.",
            "Nature, human emotions, memories, stories, and everyday moments often serve as the inspiration behind my work. I find beauty in details that are easily overlooked and enjoy transforming them into something meaningful through art and poetry.",
            "This portfolio is a reflection of my journey so far. It brings together my artworks, published writings, handmade creations, and the experiences that continue to shape me as a creator. More than a collection of work, it is a space where creativity, curiosity, and self-expression come together.",
            "Thank you for taking the time to visit my world. I hope you find something here that inspires you, speaks to you, or simply makes you pause for a moment and see things differently.",
          ].map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.03 }}>
              {i === 0 && <span className="float-left font-display italic text-7xl leading-none text-[color:var(--terracotta)] mr-3 mt-1">{p[0]}</span>}
              {i === 0 ? p.slice(1) : p}
            </motion.p>
          ))}
        </div>
      </section>

      <Divider label="a few things about me" />

      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {FACTS.map(([emoji, label], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-[color:var(--ivory)] border border-[color:var(--forest)]/15 rounded-sm p-5 text-center shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] transition-all">
              <div className="text-3xl">{emoji}</div>
              <div className="font-display italic text-lg mt-2 text-[color:var(--forest)]">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* philosophy */}
      <section className="px-6 lg:px-12 py-24 bg-[color:var(--forest)] text-[color:var(--cream)] relative overflow-hidden">
        <Floral className="absolute top-10 left-10 w-32 text-[color:var(--gold)]/40 animate-floaty" />
        <Floral className="absolute bottom-10 right-10 w-40 text-[color:var(--terracotta)]/40 animate-floaty" style={{ animationDelay: "2s" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="font-script text-5xl text-[color:var(--gold)]">— my creative philosophy —</p>
          <p className="font-display italic text-3xl md:text-4xl leading-[1.3] mt-6">
            Every piece of art begins with curiosity.<br/>
            Every poem begins with a feeling.<br/>
            Every creation begins with a story.<br/>
            <span className="text-gold-shimmer">And every story deserves to be shared.</span>
          </p>
        </div>
      </section>
    </div>
  );
}