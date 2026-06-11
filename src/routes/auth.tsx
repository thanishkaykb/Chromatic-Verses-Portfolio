import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Floral } from "@/components/site/decor";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Thanishka" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn.call(supabase.auth, { email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "signup") return toast.success("Account created — sign in.");
    nav({ to: "/admin" });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative">
      <Floral className="absolute top-10 left-1/4 w-24 text-[color:var(--gold)]/50 animate-floaty" />
      <Floral className="absolute bottom-10 right-1/4 w-24 text-[color:var(--terracotta)]/50 animate-floaty" />
      <form onSubmit={go} className="w-full max-w-md bg-[color:var(--ivory)] p-10 rounded-sm shadow-[var(--shadow-frame)] paper-texture">
        <p className="font-script text-4xl text-[color:var(--terracotta)] text-center">— studio door —</p>
        <h1 className="font-display italic text-4xl text-[color:var(--forest)] text-center mt-2">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="text-center text-sm text-[color:var(--forest)]/60 mt-1">For Thanishka only.</p>
        <div className="mt-6 space-y-4">
          <input required type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2" />
          <input required type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2" />
        </div>
        <button disabled={busy} className="mt-6 w-full bg-[color:var(--forest)] text-[color:var(--cream)] py-3 rounded-full font-display italic text-lg hover:bg-[color:var(--terracotta)] transition-colors disabled:opacity-60">
          {busy ? "…" : (mode === "signin" ? "enter the studio" : "create account")}
        </button>
        <button type="button" onClick={() => setMode(m => m === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-[color:var(--forest)]/70 hover:text-[color:var(--terracotta)]">
          {mode === "signin" ? "first time? create an account" : "already have an account? sign in"}
        </button>
        <p className="mt-6 text-center text-xs text-[color:var(--forest)]/55">After signing up, your account must be granted the <em>admin</em> role to upload content.</p>
        <div className="mt-4 text-center"><Link to="/" className="text-xs underline text-[color:var(--forest)]/60">← back to the world</Link></div>
      </form>
    </div>
  );
}