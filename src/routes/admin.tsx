import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, LogOut, Plus } from "lucide-react";
import { useArtworks, usePoems, usePublications, publicUrl } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Thanishka" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { nav({ to: "/auth" }); return; }
      setUserId(data.session.user.id);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) nav({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const role = useQuery({
    queryKey: ["role", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId!).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  if (checking || role.isLoading) return <div className="min-h-[60vh] flex items-center justify-center font-script text-3xl text-[color:var(--terracotta)]">checking the door…</div>;

  if (!role.data) return <NotAdmin userId={userId!} />;

  return (
    <div className="px-6 lg:px-12 py-10 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-script text-4xl text-[color:var(--terracotta)]">— the studio —</p>
          <h1 className="font-display italic text-4xl text-[color:var(--forest)]">Admin Dashboard</h1>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 px-5 py-2 border border-[color:var(--forest)]/30 rounded-full text-sm hover:bg-[color:var(--forest)] hover:text-[color:var(--cream)]"><LogOut className="h-4 w-4" /> sign out</button>
      </div>
      <p className="text-sm text-[color:var(--forest)]/70 mb-8"><Link to="/" className="underline">↩ back to the site</Link></p>

      <div className="grid lg:grid-cols-2 gap-10">
        <ArtworkManager />
        <PoemManager />
        <PublicationManager />
      </div>
    </div>
  );
}

function NotAdmin({ userId }: { userId: string }) {
  async function grantSelf() {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" } as any);
    if (error) toast.error(error.message + " — ask the owner to grant admin via SQL: insert into user_roles(user_id, role) values ('" + userId + "', 'admin');");
    else { toast.success("Admin granted. Refreshing…"); setTimeout(() => location.reload(), 800); }
  }
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">
      <p className="font-script text-4xl text-[color:var(--terracotta)]">— not yet —</p>
      <p className="font-display italic text-2xl text-[color:var(--forest)] max-w-lg">You're signed in but don't have the <em>admin</em> role yet.</p>
      <button onClick={grantSelf} className="px-6 py-3 rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] font-display italic text-lg hover:bg-[color:var(--terracotta)]">claim admin (first time only)</button>
      <p className="text-xs text-[color:var(--forest)]/55 max-w-md">If this fails, the role was already claimed by someone else — only the owner can grant more.</p>
      <p className="text-xs font-mono text-[color:var(--forest)]/55 break-all">your user id: {userId}</p>
    </div>
  );
}

/* ---------- managers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-[color:var(--ivory)] rounded-sm shadow-[var(--shadow-frame)] p-6">
      <h2 className="font-display italic text-2xl text-[color:var(--forest)] mb-4 border-b border-[color:var(--forest)]/15 pb-2">{title}</h2>
      {children}
    </section>
  );
}

async function uploadFile(bucket: string, file: File) {
  const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  return path;
}

function ArtworkManager() {
  const qc = useQueryClient();
  const { data = [] } = useArtworks();
  const [f, setF] = useState({ title: "", description: "", category: "paintings", medium: "", year: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !f.title) return toast.error("Title and image required");
    setBusy(true);
    try {
      const path = await uploadFile("artworks", file);
      const { error } = await supabase.from("artworks").insert({
        title: f.title, description: f.description || null, category: f.category, medium: f.medium || null,
        year: f.year ? Number(f.year) : null, image_url: path,
      } as any);
      if (error) throw error;
      toast.success("Artwork added");
      setF({ title: "", description: "", category: "paintings", medium: "", year: "" }); setFile(null);
      qc.invalidateQueries({ queryKey: ["artworks"] });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }
  async function del(id: string) {
    if (!confirm("Delete this artwork?")) return;
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["artworks"] });
  }

  return (
    <Section title={`Artworks (${data.length})`}>
      <form onSubmit={add} className="space-y-3">
        <Field label="Title" value={f.title} onChange={v => setF({ ...f, title: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category" value={f.category} onChange={v => setF({ ...f, category: v })} />
          <Field label="Year" value={f.year} onChange={v => setF({ ...f, year: v })} />
        </div>
        <Field label="Medium" value={f.medium} onChange={v => setF({ ...f, medium: v })} />
        <Area label="Description / story" value={f.description} onChange={v => setF({ ...f, description: v })} />
        <FileField onChange={setFile} accept="image/*" current={file?.name} />
        <button disabled={busy} className="inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-5 py-2 rounded-full text-sm hover:bg-[color:var(--terracotta)] disabled:opacity-60">
          {busy ? "uploading…" : (<><Plus className="h-4 w-4" /> add artwork</>)}
        </button>
      </form>
      <ul className="mt-6 max-h-72 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map(a => (
          <li key={a.id} className="py-2 flex items-center gap-3">
            <img src={publicUrl("artworks", a.image_url)} className="h-12 w-12 object-cover rounded-sm" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{a.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{a.category} · {a.year || ""}</p>
            </div>
            <button onClick={() => del(a.id)} className="p-2 text-[color:var(--forest)]/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PoemManager() {
  const qc = useQueryClient();
  const { data = [] } = usePoems();
  const [f, setF] = useState({ title: "", excerpt: "", body: "", category: "reflections" });
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title || !f.body) return toast.error("Title and body required");
    setBusy(true);
    const { error } = await supabase.from("poems").insert({ ...f } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Poem added");
    setF({ title: "", excerpt: "", body: "", category: "reflections" });
    qc.invalidateQueries({ queryKey: ["poems"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this poem?")) return;
    const { error } = await supabase.from("poems").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["poems"] }); toast.success("Removed");
  }

  return (
    <Section title={`Poems (${data.length})`}>
      <form onSubmit={add} className="space-y-3">
        <Field label="Title" value={f.title} onChange={v => setF({ ...f, title: v })} />
        <Field label="Category" value={f.category} onChange={v => setF({ ...f, category: v })} />
        <Area label="Excerpt (short preview)" value={f.excerpt} onChange={v => setF({ ...f, excerpt: v })} rows={3} />
        <Area label="Full poem" value={f.body} onChange={v => setF({ ...f, body: v })} rows={8} />
        <button disabled={busy} className="inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-5 py-2 rounded-full text-sm hover:bg-[color:var(--terracotta)] disabled:opacity-60">
          {busy ? "saving…" : (<><Plus className="h-4 w-4" /> add poem</>)}
        </button>
      </form>
      <ul className="mt-6 max-h-72 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map(p => (
          <li key={p.id} className="py-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{p.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{p.category}</p>
            </div>
            <button onClick={() => del(p.id)} className="p-2 text-[color:var(--forest)]/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PublicationManager() {
  const qc = useQueryClient();
  const { data = [] } = usePublications();
  const [f, setF] = useState({ title: "", publication_name: "", description: "", category: "newspapers", publication_date: "" });
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title || !cover) return toast.error("Title and cover required");
    setBusy(true);
    try {
      const coverPath = await uploadFile("publications", cover);
      const pdfPath = pdf ? await uploadFile("publications", pdf) : null;
      const { error } = await supabase.from("publications").insert({
        title: f.title, publication_name: f.publication_name || null, description: f.description || null,
        category: f.category, publication_date: f.publication_date || null, cover_url: coverPath, file_url: pdfPath,
      } as any);
      if (error) throw error;
      toast.success("Publication added");
      setF({ title: "", publication_name: "", description: "", category: "newspapers", publication_date: "" });
      setCover(null); setPdf(null);
      qc.invalidateQueries({ queryKey: ["publications"] });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }
  async function del(id: string) {
    if (!confirm("Delete this publication?")) return;
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["publications"] }); toast.success("Removed");
  }

  return (
    <Section title={`Publications (${data.length})`}>
      <form onSubmit={add} className="space-y-3">
        <Field label="Title" value={f.title} onChange={v => setF({ ...f, title: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Publication name" value={f.publication_name} onChange={v => setF({ ...f, publication_name: v })} />
          <Field label="Category (newspapers, anthology…)" value={f.category} onChange={v => setF({ ...f, category: v })} />
        </div>
        <Field label="Date" type="date" value={f.publication_date} onChange={v => setF({ ...f, publication_date: v })} />
        <Area label="Description" value={f.description} onChange={v => setF({ ...f, description: v })} />
        <FileField label="Cover image" onChange={setCover} accept="image/*" current={cover?.name} />
        <FileField label="PDF / file (optional)" onChange={setPdf} accept=".pdf,image/*" current={pdf?.name} />
        <button disabled={busy} className="inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-5 py-2 rounded-full text-sm hover:bg-[color:var(--terracotta)] disabled:opacity-60">
          {busy ? "uploading…" : (<><Plus className="h-4 w-4" /> add publication</>)}
        </button>
      </form>
      <ul className="mt-6 max-h-72 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map(p => (
          <li key={p.id} className="py-2 flex items-center gap-3">
            <img src={publicUrl("publications", p.cover_url)} className="h-12 w-12 object-cover rounded-sm" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{p.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{p.publication_name} · {p.category}</p>
            </div>
            <button onClick={() => del(p.id)} className="p-2 text-[color:var(--forest)]/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* tiny inputs */
function Field({ label, value, onChange, type = "text" }: any) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none py-1.5 text-sm" /></label>);
}
function Area({ label, value, onChange, rows = 4 }: any) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-[color:var(--cream)]/50 border border-[color:var(--forest)]/20 focus:border-[color:var(--terracotta)] outline-none p-2 text-sm rounded-sm resize-none" /></label>);
}
function FileField({ label = "File", onChange, accept, current }: any) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <div className="mt-1 flex items-center gap-2">
      <input type="file" accept={accept} onChange={e => onChange(e.target.files?.[0] || null)} className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--forest)] file:text-[color:var(--cream)] file:px-3 file:py-1.5 file:text-xs file:hover:bg-[color:var(--terracotta)]" />
      {current && <span className="text-xs text-[color:var(--forest)]/60 truncate">{current}</span>}
      <Upload className="h-4 w-4 text-[color:var(--forest)]/40" />
    </div></label>);
}