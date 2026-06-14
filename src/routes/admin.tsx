import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, LogOut, Plus, Pencil, ChevronUp, ChevronDown, Check, X } from "lucide-react";
import {
  useArtworks, usePoems, usePublications, useMemories, useSiteContent, publicUrl,
} from "@/lib/data";

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
        <AccessRequestManager />
        <SiteTextManager />
        <ArtworkManager />
        <PoemManager />
        <PublicationManager />
        <MemoryManager />
      </div>
    </div>
  );
}

function NotAdmin({ userId }: { userId: string }) {
  async function grantSelf() {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" } as any);
    if (error) toast.error(error.message);
    else { toast.success("Admin granted. Refreshing…"); setTimeout(() => location.reload(), 800); }
  }
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">
      <p className="font-script text-4xl text-[color:var(--terracotta)]">— not yet —</p>
      <p className="font-display italic text-2xl text-[color:var(--forest)] max-w-lg">You're signed in but don't have the <em>admin</em> role yet.</p>
      <button onClick={grantSelf} className="px-6 py-3 rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] font-display italic text-lg hover:bg-[color:var(--terracotta)]">claim admin (owner only)</button>
      <p className="text-xs font-mono text-[color:var(--forest)]/55 break-all">your user id: {userId}</p>
    </div>
  );
}

/* ----------------- shared bits ----------------- */

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

type FieldProps = { label: string; value: string; onChange: (v: string) => void; type?: string };
function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-transparent border-b border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none py-1.5 text-sm" /></label>);
}
function Area({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full bg-[color:var(--cream)]/50 border border-[color:var(--forest)]/20 focus:border-[color:var(--terracotta)] outline-none p-2 text-sm rounded-sm resize-y" /></label>);
}
function FileField({ label = "File", onChange, accept, current }: { label?: string; onChange: (f: File | null) => void; accept?: string; current?: string }) {
  return (<label className="block"><span className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65">{label}</span>
    <div className="mt-1 flex items-center gap-2">
      <input type="file" accept={accept} onChange={e => onChange(e.target.files?.[0] || null)} className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--forest)] file:text-[color:var(--cream)] file:px-3 file:py-1.5 file:text-xs file:hover:bg-[color:var(--terracotta)]" />
      {current && <span className="text-xs text-[color:var(--forest)]/60 truncate">{current}</span>}
      <Upload className="h-4 w-4 text-[color:var(--forest)]/40" />
    </div></label>);
}

function RowControls({ onUp, onDown, onEdit, onDelete, disableUp, disableDown }: {
  onUp: () => void; onDown: () => void; onEdit: () => void; onDelete: () => void;
  disableUp?: boolean; disableDown?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <button title="Move up" disabled={disableUp} onClick={onUp} className="p-1.5 text-[color:var(--forest)]/55 hover:text-[color:var(--forest)] disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
      <button title="Move down" disabled={disableDown} onClick={onDown} className="p-1.5 text-[color:var(--forest)]/55 hover:text-[color:var(--forest)] disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
      <button title="Edit" onClick={onEdit} className="p-1.5 text-[color:var(--forest)]/55 hover:text-[color:var(--terracotta)]"><Pencil className="h-4 w-4" /></button>
      <button title="Delete" onClick={onDelete} className="p-1.5 text-[color:var(--forest)]/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

/** Swap display_order of two rows in `table`. */
async function swap(table: string, a: { id: string; display_order: number }, b: { id: string; display_order: number }) {
  // Use distinct sentinel values to avoid temporary conflicts.
  await supabase.from(table as any).update({ display_order: -1 - a.display_order } as any).eq("id", a.id);
  await supabase.from(table as any).update({ display_order: a.display_order } as any).eq("id", b.id);
  await supabase.from(table as any).update({ display_order: b.display_order } as any).eq("id", a.id);
}

/* generic edit modal */
type EditField = { key: string; label: string; type?: "text" | "textarea" | "number" | "date"; rows?: number };
function EditModal<T extends Record<string, any>>({ item, fields, onClose, onSave }: {
  item: T | null; fields: EditField[]; onClose: () => void; onSave: (patch: Partial<T>) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { setDraft({}); }, [item?.id]);
  if (!item) return null;
  const v = (k: string) => (draft[k] !== undefined ? draft[k] : item[k] ?? "");
  async function save() {
    setBusy(true);
    try {
      const patch: any = {};
      for (const f of fields) if (draft[f.key] !== undefined) {
        patch[f.key] = f.type === "number" ? (draft[f.key] === "" ? null : Number(draft[f.key])) : (draft[f.key] === "" ? null : draft[f.key]);
      }
      await onSave(patch);
      toast.success("Updated"); onClose();
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-[200] bg-[color:var(--ink)]/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[color:var(--cream)] max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 rounded-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display italic text-2xl text-[color:var(--forest)]">Edit</h3>
          <button onClick={onClose} className="p-1.5 text-[color:var(--forest)]/60 hover:text-[color:var(--terracotta)]"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          {fields.map(f => f.type === "textarea" ? (
            <Area key={f.key} label={f.label} rows={f.rows ?? 4} value={String(v(f.key) ?? "")} onChange={val => setDraft(d => ({ ...d, [f.key]: val }))} />
          ) : (
            <Field key={f.key} label={f.label} type={f.type ?? "text"} value={String(v(f.key) ?? "")} onChange={val => setDraft(d => ({ ...d, [f.key]: val }))} />
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-full border border-[color:var(--forest)]/30">cancel</button>
          <button disabled={busy} onClick={save} className="px-4 py-2 text-sm rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] hover:bg-[color:var(--terracotta)] disabled:opacity-60">{busy ? "saving…" : "save"}</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- access requests ----------------- */

type AccessRequest = { id: string; email: string; message: string | null; status: string; created_at: string };

function AccessRequestManager() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["access_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("access_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AccessRequest[];
    },
  });
  const pending = data.filter(r => r.status === "pending");

  async function setStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("access_requests").update({ status } as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Marked as approved" : "Marked as rejected");
    qc.invalidateQueries({ queryKey: ["access_requests"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this request?")) return;
    const { error } = await supabase.from("access_requests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["access_requests"] });
  }

  return (
    <Section title={`Access requests (${pending.length} pending / ${data.length} total)`}>
      {data.length === 0 ? (
        <p className="text-sm text-[color:var(--forest)]/60 italic">No requests yet. Anyone who tries to sign up here will appear in this inbox.</p>
      ) : (
        <ul className="max-h-96 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
          {data.map(r => (
            <li key={r.id} className="py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display italic text-base truncate">{r.email}</p>
                  <span className={`text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 rounded-full ${
                    r.status === "approved" ? "bg-[color:var(--forest)]/15 text-[color:var(--forest)]" :
                    r.status === "rejected" ? "bg-destructive/15 text-destructive" :
                    "bg-[color:var(--terracotta)]/15 text-[color:var(--terracotta)]"
                  }`}>{r.status}</span>
                </div>
                {r.message && <p className="text-xs text-[color:var(--forest)]/70 mt-1 whitespace-pre-wrap">"{r.message}"</p>}
                <p className="text-[10px] text-[color:var(--forest)]/50 mt-1">{new Date(r.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {r.status === "pending" && (
                  <>
                    <button onClick={() => setStatus(r.id, "approved")} title="Approve" className="p-1.5 text-[color:var(--forest)] hover:text-[color:var(--cream)] hover:bg-[color:var(--forest)] rounded-full"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setStatus(r.id, "rejected")} title="Reject" className="p-1.5 text-destructive hover:bg-destructive hover:text-[color:var(--cream)] rounded-full"><X className="h-4 w-4" /></button>
                  </>
                )}
                <button onClick={() => del(r.id)} title="Delete" className="p-1.5 text-[color:var(--forest)]/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-[11px] text-[color:var(--forest)]/55 italic">
        Tip: to receive email notifications for new requests, set up your email domain in Cloud → Emails and ask the builder to wire it up.
      </p>
    </Section>
  );
}

/* ----------------- artworks ----------------- */

function ArtworkManager() {
  const qc = useQueryClient();
  const { data = [] } = useArtworks();
  const [f, setF] = useState({ title: "", description: "", category: "paintings", medium: "", year: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !f.title) return toast.error("Title and image required");
    setBusy(true);
    try {
      const path = await uploadFile("artworks", file);
      const { error } = await supabase.from("artworks").insert({
        title: f.title, description: f.description || null, category: f.category, medium: f.medium || null,
        year: f.year ? Number(f.year) : null, image_url: path,
        display_order: data.length,
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
  async function move(idx: number, dir: -1 | 1) {
    const a = data[idx], b = data[idx + dir]; if (!a || !b) return;
    await swap("artworks", { id: a.id, display_order: a.display_order ?? idx }, { id: b.id, display_order: b.display_order ?? (idx + dir) });
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
      <ul className="mt-6 max-h-96 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map((a, i) => (
          <li key={a.id} className="py-2 flex items-center gap-3">
            <img src={publicUrl("artworks", a.image_url)} className="h-12 w-12 object-cover rounded-sm" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{a.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{a.category} · {a.medium || ""} · {a.year || ""}</p>
            </div>
            <RowControls
              onUp={() => move(i, -1)} onDown={() => move(i, 1)}
              disableUp={i === 0} disableDown={i === data.length - 1}
              onEdit={() => setEditing(a)} onDelete={() => del(a.id)}
            />
          </li>
        ))}
      </ul>
      <EditModal item={editing} onClose={() => setEditing(null)}
        fields={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "medium", label: "Medium" },
          { key: "year", label: "Year", type: "number" },
          { key: "description", label: "Description", type: "textarea", rows: 4 },
        ]}
        onSave={async patch => {
          const { error } = await supabase.from("artworks").update(patch as any).eq("id", editing.id);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["artworks"] });
        }}
      />
    </Section>
  );
}

/* ----------------- poems ----------------- */

function PoemManager() {
  const qc = useQueryClient();
  const { data = [] } = usePoems();
  const [f, setF] = useState({ title: "", excerpt: "", body: "", category: "reflections" });
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title || !f.body) return toast.error("Title and body required");
    setBusy(true);
    const { error } = await supabase.from("poems").insert({ ...f, display_order: data.length } as any);
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
  async function move(idx: number, dir: -1 | 1) {
    const a = data[idx], b = data[idx + dir]; if (!a || !b) return;
    await swap("poems", { id: a.id, display_order: a.display_order ?? idx }, { id: b.id, display_order: b.display_order ?? (idx + dir) });
    qc.invalidateQueries({ queryKey: ["poems"] });
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
      <ul className="mt-6 max-h-96 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map((p, i) => (
          <li key={p.id} className="py-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{p.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{p.category}</p>
            </div>
            <RowControls
              onUp={() => move(i, -1)} onDown={() => move(i, 1)}
              disableUp={i === 0} disableDown={i === data.length - 1}
              onEdit={() => setEditing(p)} onDelete={() => del(p.id)}
            />
          </li>
        ))}
      </ul>
      <EditModal item={editing} onClose={() => setEditing(null)}
        fields={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
          { key: "body", label: "Full poem", type: "textarea", rows: 10 },
        ]}
        onSave={async patch => {
          const { error } = await supabase.from("poems").update(patch as any).eq("id", editing.id);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["poems"] });
        }}
      />
    </Section>
  );
}

/* ----------------- publications ----------------- */

function PublicationManager() {
  const qc = useQueryClient();
  const { data = [] } = usePublications();
  const [f, setF] = useState({ title: "", publication_name: "", description: "", category: "newspapers", publication_date: "" });
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<any>(null);

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
        display_order: data.length,
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
  async function move(idx: number, dir: -1 | 1) {
    const a = data[idx], b = data[idx + dir]; if (!a || !b) return;
    await swap("publications", { id: a.id, display_order: a.display_order ?? idx }, { id: b.id, display_order: b.display_order ?? (idx + dir) });
    qc.invalidateQueries({ queryKey: ["publications"] });
  }

  return (
    <Section title={`Publications (${data.length})`}>
      <form onSubmit={add} className="space-y-3">
        <Field label="Title" value={f.title} onChange={v => setF({ ...f, title: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Publication name" value={f.publication_name} onChange={v => setF({ ...f, publication_name: v })} />
          <Field label="Category" value={f.category} onChange={v => setF({ ...f, category: v })} />
        </div>
        <Field label="Date" type="date" value={f.publication_date} onChange={v => setF({ ...f, publication_date: v })} />
        <Area label="Description" value={f.description} onChange={v => setF({ ...f, description: v })} />
        <FileField label="Cover image" onChange={setCover} accept="image/*" current={cover?.name} />
        <FileField label="PDF / file (optional)" onChange={setPdf} accept=".pdf,image/*" current={pdf?.name} />
        <button disabled={busy} className="inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-5 py-2 rounded-full text-sm hover:bg-[color:var(--terracotta)] disabled:opacity-60">
          {busy ? "uploading…" : (<><Plus className="h-4 w-4" /> add publication</>)}
        </button>
      </form>
      <ul className="mt-6 max-h-96 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map((p, i) => (
          <li key={p.id} className="py-2 flex items-center gap-3">
            <img src={publicUrl("publications", p.cover_url)} className="h-12 w-12 object-cover rounded-sm" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{p.title}</p>
              <p className="text-xs text-[color:var(--forest)]/55 truncate">{p.publication_name} · {p.category}</p>
            </div>
            <RowControls
              onUp={() => move(i, -1)} onDown={() => move(i, 1)}
              disableUp={i === 0} disableDown={i === data.length - 1}
              onEdit={() => setEditing(p)} onDelete={() => del(p.id)}
            />
          </li>
        ))}
      </ul>
      <EditModal item={editing} onClose={() => setEditing(null)}
        fields={[
          { key: "title", label: "Title" },
          { key: "publication_name", label: "Publication name" },
          { key: "category", label: "Category" },
          { key: "publication_date", label: "Date", type: "date" },
          { key: "link_url", label: "Link URL (optional)" },
          { key: "description", label: "Description", type: "textarea", rows: 4 },
        ]}
        onSave={async patch => {
          const { error } = await supabase.from("publications").update(patch as any).eq("id", editing.id);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["publications"] });
        }}
      />
    </Section>
  );
}

/* ----------------- scrapbook ----------------- */

function MemoryManager() {
  const qc = useQueryClient();
  const { data = [] } = useMemories();
  const [f, setF] = useState({ caption: "", note: "", rotation: "0" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error("Please choose an image");
    setBusy(true);
    try {
      const path = await uploadFile("memories", file);
      const { error } = await supabase.from("memories").insert({
        image_url: path, caption: f.caption || null, note: f.note || null,
        rotation: Number(f.rotation) || 0, display_order: data.length,
      } as any);
      if (error) throw error;
      toast.success("Scrapbook entry added");
      setF({ caption: "", note: "", rotation: "0" }); setFile(null);
      qc.invalidateQueries({ queryKey: ["memories"] });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }
  async function del(id: string) {
    if (!confirm("Delete this memory?")) return;
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["memories"] }); toast.success("Removed");
  }
  async function move(idx: number, dir: -1 | 1) {
    const a = data[idx], b = data[idx + dir]; if (!a || !b) return;
    await swap("memories", { id: a.id, display_order: a.display_order ?? idx }, { id: b.id, display_order: b.display_order ?? (idx + dir) });
    qc.invalidateQueries({ queryKey: ["memories"] });
  }
  async function replaceImage(id: string) {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const path = await uploadFile("memories", file);
        const { error } = await supabase.from("memories").update({ image_url: path } as any).eq("id", id);
        if (error) throw error;
        toast.success("Photo replaced");
        qc.invalidateQueries({ queryKey: ["memories"] });
      } catch (e: any) { toast.error(e.message); }
    };
    input.click();
  }

  return (
    <Section title={`Scrapbook (${data.length})`}>
      <form onSubmit={add} className="space-y-3">
        <Field label="Caption" value={f.caption} onChange={v => setF({ ...f, caption: v })} />
        <Area label="Note (optional)" value={f.note} onChange={v => setF({ ...f, note: v })} rows={2} />
        <Field label="Rotation (deg, e.g. -4)" value={f.rotation} onChange={v => setF({ ...f, rotation: v })} />
        <FileField label="Photo" onChange={setFile} accept="image/*" current={file?.name} />
        <button disabled={busy} className="inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-5 py-2 rounded-full text-sm hover:bg-[color:var(--terracotta)] disabled:opacity-60">
          {busy ? "uploading…" : (<><Plus className="h-4 w-4" /> add to scrapbook</>)}
        </button>
      </form>
      <ul className="mt-6 max-h-96 overflow-y-auto divide-y divide-[color:var(--forest)]/10">
        {data.map((m, i) => (
          <li key={m.id} className="py-2 flex items-center gap-3">
            <button onClick={() => replaceImage(m.id)} title="Replace photo" className="shrink-0">
              <img src={publicUrl("memories", m.image_url)} className="h-12 w-12 object-cover rounded-sm" alt="" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-base truncate">{m.caption || "(untitled)"}</p>
              {m.note && <p className="text-xs text-[color:var(--forest)]/55 truncate">{m.note}</p>}
            </div>
            <RowControls
              onUp={() => move(i, -1)} onDown={() => move(i, 1)}
              disableUp={i === 0} disableDown={i === data.length - 1}
              onEdit={() => setEditing(m)} onDelete={() => del(m.id)}
            />
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-[color:var(--forest)]/55 italic mt-2">Tip: click a photo to replace it.</p>
      <EditModal item={editing} onClose={() => setEditing(null)}
        fields={[
          { key: "caption", label: "Caption" },
          { key: "note", label: "Note", type: "textarea", rows: 3 },
          { key: "rotation", label: "Rotation (deg)", type: "number" },
        ]}
        onSave={async patch => {
          const { error } = await supabase.from("memories").update(patch as any).eq("id", editing.id);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ["memories"] });
        }}
      />
    </Section>
  );
}

/* ----------------- site text ----------------- */

const ABOUT_DEFAULT_INTRO = "An artist, published poet, creator, and Computer Science and Engineering student at Sri Sairam Engineering College.";
const ABOUT_DEFAULT_PARAS = [
  "For as long as I can remember, I have been drawn to creativity. Whether through colors on a canvas, words on a page, or ideas brought to life by hand, creating has always been my way of understanding the world around me. Every artwork, poem, and handmade creation begins as a thought, a feeling, or a moment that leaves an impression on me and eventually finds its place in my work.",
  "Art allows me to express emotions that cannot always be spoken. Poetry gives a voice to thoughts that often remain hidden. Together, they have become the two most meaningful ways through which I share my perspective, experiences, and imagination.",
  "Over the years, my creative journey has expanded beyond personal expression. My poetry has been featured in newspapers and literary anthologies, giving me the opportunity to connect with readers and share my work with a wider audience. Each publication has become a reminder that creativity has the power to resonate with people in ways we may never expect.",
  "Alongside my artistic pursuits, I am pursuing a degree in Computer Science and Engineering. While technology and art may appear to belong to different worlds, I see them as complementary forms of creation. One is built through logic and innovation, while the other is shaped by emotion and imagination. Together, they inspire me to explore new possibilities and creative experiences.",
  "Nature, human emotions, memories, stories, and everyday moments often serve as the inspiration behind my work. I find beauty in details that are easily overlooked and enjoy transforming them into something meaningful through art and poetry.",
  "This portfolio is a reflection of my journey so far. It brings together my artworks, published writings, handmade creations, and the experiences that continue to shape me as a creator. More than a collection of work, it is a space where creativity, curiosity, and self-expression come together.",
  "Thank you for taking the time to visit my world. I hope you find something here that inspires you, speaks to you, or simply makes you pause for a moment and see things differently.",
];

const TEXT_FIELDS: { key: string; label: string; multiline?: boolean; list?: boolean; placeholder?: string; defaultValue?: string | string[] }[] = [
  { key: "hero_eyebrow", label: "Homepage — eyebrow line", placeholder: "— welcome to the world of —", defaultValue: "— welcome to the world of —" },
  { key: "hero_tagline", label: "Homepage — tagline", multiline: true, defaultValue: "Artist · Published Poet · Storyteller — keeping a slow, ongoing record of colour, verse, and quiet things." },
  { key: "closing_quote", label: "Homepage — closing quote", multiline: true, defaultValue: "Every piece of art begins with curiosity. Every poem with a feeling. And every story deserves to be shared." },
  { key: "about_intro", label: "About — intro line", multiline: true, defaultValue: ABOUT_DEFAULT_INTRO },
  { key: "about_paragraphs", label: "About — story paragraphs (separate with a blank line)", list: true, defaultValue: ABOUT_DEFAULT_PARAS },
];

function SiteTextManager() {
  const qc = useQueryClient();
  const { data = {} } = useSiteContent();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  function valueFor(key: string, list: boolean, def: string | string[] | undefined): string {
    if (draft[key] !== undefined) return draft[key];
    const v = (data as any)[key];
    if (list) {
      if (Array.isArray(v)) return v.join("\n\n");
      if (Array.isArray(def)) return def.join("\n\n");
      return "";
    }
    if (typeof v === "string") return v;
    if (typeof def === "string") return def;
    return "";
  }

  async function save(key: string, list: boolean) {
    setBusy(key);
    const raw = valueFor(key, list, undefined);
    const value: any = list ? raw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) : raw;
    const { error } = await supabase.from("site_content").upsert({ key, value } as any);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(d => { const { [key]: _, ...rest } = d; return rest; });
    qc.invalidateQueries({ queryKey: ["site_content"] });
  }

  return (
    <Section title="Site text (homepage, about, etc.)">
      <p className="text-[11px] text-[color:var(--forest)]/55 italic mb-3">Each field is pre-filled with the current text. Edit and save to change what visitors see.</p>
      <div className="space-y-5">
        {TEXT_FIELDS.map(({ key, label, multiline, list, placeholder, defaultValue }) => {
          const v = valueFor(key, !!list, defaultValue);
          return (
            <div key={key}>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-[color:var(--forest)]/65 mb-1">{label}</label>
              {multiline || list ? (
                <textarea
                  rows={list ? 12 : 3}
                  value={v}
                  placeholder={placeholder}
                  onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                  className="w-full bg-[color:var(--cream)]/50 border border-[color:var(--forest)]/20 focus:border-[color:var(--terracotta)] outline-none p-2 text-sm rounded-sm resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={v}
                  placeholder={placeholder}
                  onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                  className="w-full bg-transparent border-b border-[color:var(--forest)]/30 focus:border-[color:var(--terracotta)] outline-none py-1.5 text-sm"
                />
              )}
              <button
                onClick={() => save(key, !!list)}
                disabled={busy === key}
                className="mt-2 inline-flex items-center gap-2 bg-[color:var(--forest)] text-[color:var(--cream)] px-4 py-1.5 rounded-full text-xs hover:bg-[color:var(--terracotta)] disabled:opacity-60"
              >
                {busy === key ? "saving…" : "save"}
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
