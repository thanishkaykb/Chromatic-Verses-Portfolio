import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Floral } from "@/components/site/decor";

const OWNER_EMAIL = "thanishka.ykb@gmail.com";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Thanishka" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "request">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const normalized = email.trim().toLowerCase();
    try {
      if (mode === "request") {
        const { error } = await supabase.from("access_requests").insert({
          email: normalized, message: message || null,
        } as any);
        if (error) throw error;
        toast.success("Request sent — Thanishka will review it.");
        setEmail(""); setMessage("");
        setMode("signin");
        return;
      }
      if (normalized !== OWNER_EMAIL) {
        toast.error("Only Thanishka can sign in here. Use 'request access' instead.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: normalized, password });
      if (error) {
        // First-time owner — create the account, then log in.
        if (/invalid login credentials/i.test(error.message)) {
          const { error: signErr } = await supabase.auth.signUp({
            email: normalized, password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
          if (signErr) throw signErr;
          toast.success("Studio account created — signing in…");
          await supabase.auth.signInWithPassword({ email: normalized, password });
          nav({ to: "/admin" });
          return;
        }
        throw error;
      }
      nav({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative">
      <Floral className="absolute top-10 left-1/4 w-24 text-[color:var(--gold)]/50 animate-floaty" />
      <Floral className="absolute bottom-10 right-1/4 w-24 text-[color:var(--terracotta)]/50 animate-floaty" />
      <form onSubmit={go} className="w-full max-w-md bg-[color:var(--ivory)] p-10 rounded-sm shadow-[var(--shadow-frame)] paper-texture">
        <p className="font-script text-4xl text-[color:var(--terracotta)] text-center">— studio door —</p>
        <h1 className="font-display italic text-4xl text-[color:var(--forest)] text-center mt-2">
          {mode === "signin" ? "Sign in" : "Request access"}
        </h1>
        <p className="text-center text-sm text-[color:var(--forest)]/60 mt-1">
          {mode === "signin"
            ? "Reserved for Thanishka."
            : "Leave a note — Thanishka will see it in her studio inbox."}
        </p>
        <div className="mt-6 space-y-4">
          <input required type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2" />
          {mode === "signin" ? (
            <input required type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-lg py-2" />
          ) : (
            <textarea placeholder="why are you reaching out?" value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full bg-transparent border-b-2 border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none font-display italic text-base py-2 resize-none" />
          )}
        </div>
        <button disabled={busy} className="mt-6 w-full bg-[color:var(--forest)] text-[color:var(--cream)] py-3 rounded-full font-display italic text-lg hover:bg-[color:var(--terracotta)] transition-colors disabled:opacity-60">
          {busy ? "…" : (mode === "signin" ? "enter the studio" : "send request")}
        </button>
        <button type="button" onClick={() => setMode(m => m === "signin" ? "request" : "signin")} className="mt-4 w-full text-sm text-[color:var(--forest)]/70 hover:text-[color:var(--terracotta)]">
          {mode === "signin" ? "not Thanishka? request access" : "back to sign in"}
        </button>
        <div className="mt-4 text-center"><Link to="/" className="text-xs underline text-[color:var(--forest)]/60">← back to the world</Link></div>
      </form>
    </div>
  );
}