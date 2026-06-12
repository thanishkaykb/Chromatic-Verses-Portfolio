
REVOKE EXECUTE ON FUNCTION public.handle_owner_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role is intentionally callable by authenticated for RLS; keep its existing grants.
