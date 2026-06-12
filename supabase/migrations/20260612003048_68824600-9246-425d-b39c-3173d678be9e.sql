
-- 1. publications: add a link URL
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS link_url TEXT;

-- 2. auto-admin trigger for the owner's email only
CREATE OR REPLACE FUNCTION public.handle_owner_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'thanishka.ykb@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_owner
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_owner_signup();

-- 3. backfill admin if account already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email = 'thanishka.ykb@gmail.com'
ON CONFLICT DO NOTHING;
