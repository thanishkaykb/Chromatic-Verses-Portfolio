import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, Instagram, Linkedin, Github, ExternalLink, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Floral, Leaf, Sparkle } from "@/components/site/decor";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Thanishka Yogesh" },
      { name: "description", content: "Write to Thanishka Yogesh — for commissions, collaborations, publications, or simply a quiet hello." },
      { property: "og:title", content: "Contact — Thanishka Yogesh" },
      { property: "og:description", content: "Letters are welcome and read slowly." },
    ],
  }),
  component: ContactPage,
});

const LINKS = [
  { Icon: Mail, label: "thanishka.ykb@gmail.com", href: "mailto:thanishka.ykb@gmail.com", tag: "Email" },
  { Icon: Phone, label: "+91 90256 58705", href: "tel:+919025658705", tag: "Phone" },
  { Icon: Instagram, label: "@art_by_thanishka", href: "https://www.instagram.com/art_by_thanishka?igsh=MWNoemkxY2Q0NzB3OQ==", tag: "Instagram" },
  { Icon: ExternalLink, label: "PoetrySoup — ThanishkaYogesh", href: "https://www.poetrysoup.com/me/ThanishkaYogesh", tag: "Poetry" },
  { Icon: Linkedin, label: "thanishka-yogesh", href: "https://www.linkedin.com/in/thanishka-yogesh/", tag: "LinkedIn" },
  { Icon: Github, label: "thanishkaykb", href: "https://github.com/thanishkaykb", tag: "GitHub" },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and a message.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name, email: form.email, subject: form.subject || null, message: form.message,
    } as any);
    setSending(false);
    if (error) { toast.error(error.message); return; }
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Letter received ✿ — Thanishka will read it soon.");
  }

  return (
    <div className="relative overflow-hidden">
      <section className="px-6 lg:px-12 pt-12 pb-10 text-center relative">
        <Leaf className="absolute top-10 left-4 w-32 text-[color:var(--sage)]/60 animate-floaty" />
        <Floral className="absolute top-12 right-10 w-20 text-[color:var(--terracotta)]/60 animate-floaty" />
        <p className="font-script text-5xl text-[color:var(--terracotta)] mt-6">— write to me —</p>
        <h1 className="font-display font-light text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] text-[color:var(--forest)]">Contact</h1>
        <p className="mt-5 font-display italic text-2xl text-[color:var(--forest)]/75 max-w-2xl mx-auto">
          For commissions, exhibitions, publications, collaborations, or simply a hello — letters are welcome and read slowly.
        </p>
      </section>

      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-12">
          {/* form */}
          <motion.form onSubmit={submit} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative bg-[color:var(--ivory)] p-8 lg:p-10 rounded-sm shadow-[var(--shadow-frame)] paper-texture">
            <Sparkle className="absolute -top-2 -right-2 w-6 text-[color:var(--gold)] animate-pulse" />
            <h2 className="font-display italic text-3xl text-[color:var(--forest)]">A letter, addressed to me.</h2>
            <p className="font-hand text-xl text-[color:var(--ink)]/70 mt-1">Tell me anything — I read every one.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Input label="Your name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Input label="Your email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
            </div>
            <Input label="Subject (optional)" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} />
            <div className="mt-4">
              <label className="block text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65 mb-1.5">Your message</label>
              <textarea required rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2 resize-none" />
            </div>
            <button disabled={sending} className="mt-6 inline-flex items-center gap-2 bg-[color:var(--terracotta)] text-[color:var(--cream)] px-7 py-3 rounded-full font-display italic text-lg hover:bg-[color:var(--forest)] transition-colors disabled:opacity-60">
              <Send className="h-4 w-4" /> {sending ? "sending…" : "send the letter"}
            </button>
          </motion.form>

          {/* links */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-3">
            <h2 className="font-display italic text-3xl text-[color:var(--forest)]">Or find me elsewhere</h2>
            <p className="font-hand text-xl text-[color:var(--ink)]/70">six small doors into the same garden.</p>
            <div className="grid gap-3 mt-4">
              {LINKS.map(({ Icon, label, href, tag }) => (
                <a key={tag} href={href} target="_blank" rel="noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-sm bg-[color:var(--ivory)] border border-[color:var(--forest)]/15 hover:border-[color:var(--terracotta)] hover:-translate-y-0.5 transition-all shadow-[var(--shadow-soft)]">
                  <span className="w-12 h-12 rounded-full flex items-center justify-center bg-[color:var(--beige)] group-hover:bg-[color:var(--terracotta)] group-hover:text-[color:var(--cream)] transition-colors">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-[color:var(--terracotta)]">{tag}</p>
                    <p className="font-display italic text-xl text-[color:var(--forest)]">{label}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="mt-3 sm:mt-0">
      <label className="block text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2" />
    </div>
  );
}