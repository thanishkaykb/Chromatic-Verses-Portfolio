
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ SHARED updated_at TRIGGER ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ ARTWORKS ============
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'paintings', -- paintings | sketches | handmade | mixed
  medium TEXT,
  year INT,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artworks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.artworks TO authenticated;
GRANT ALL ON public.artworks TO service_role;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "artworks public read" ON public.artworks FOR SELECT USING (true);
CREATE POLICY "artworks admin write" ON public.artworks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER artworks_updated BEFORE UPDATE ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ POEMS ============
CREATE TABLE public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,                  -- inline poem text
  pdf_url TEXT,               -- optional PDF
  category TEXT DEFAULT 'reflections',
  excerpt TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  written_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.poems TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.poems TO authenticated;
GRANT ALL ON public.poems TO service_role;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "poems public read" ON public.poems FOR SELECT USING (true);
CREATE POLICY "poems admin write" ON public.poems FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER poems_updated BEFORE UPDATE ON public.poems
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PUBLICATIONS ============
CREATE TABLE public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  publication_name TEXT,
  publication_date DATE,
  description TEXT,
  category TEXT DEFAULT 'newspapers', -- newspapers | anthologies | featured
  cover_url TEXT NOT NULL,
  file_url TEXT, -- PDF or full image
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pub public read" ON public.publications FOR SELECT USING (true);
CREATE POLICY "pub admin write" ON public.publications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER pub_updated BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ MEMORIES (Polaroid Wall) ============
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  note TEXT,           -- handwritten-style note text
  taken_on DATE,
  rotation NUMERIC DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.memories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.memories TO authenticated;
GRANT ALL ON public.memories TO service_role;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memories public read" ON public.memories FOR SELECT USING (true);
CREATE POLICY "memories admin write" ON public.memories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER memories_updated BEFORE UPDATE ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ COMMENTS (moderated) ============
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL, -- 'artwork' | 'poem' | 'publication'
  target_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  message TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT ON public.comments TO anon, authenticated;
GRANT UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments public read approved" ON public.comments FOR SELECT USING (is_approved = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone can submit" ON public.comments FOR INSERT WITH CHECK (
  char_length(author_name) BETWEEN 1 AND 80
  AND char_length(message) BETWEEN 1 AND 2000
  AND is_approved = false
);
CREATE POLICY "admin moderate" ON public.comments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete" ON public.comments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============ CONTACT MESSAGES ============
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 200
  AND char_length(message) BETWEEN 1 AND 4000
);
CREATE POLICY "admin read contact" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update contact" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete contact" ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ============ SITE CONTENT (editable copy) ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site read all" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
