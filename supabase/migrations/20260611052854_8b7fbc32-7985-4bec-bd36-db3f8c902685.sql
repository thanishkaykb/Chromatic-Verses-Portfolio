
DO $$
DECLARE b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['artworks','poems','publications','memories'] LOOP
    EXECUTE format($f$
      DROP POLICY IF EXISTS "public read %1$s" ON storage.objects;
      CREATE POLICY "public read %1$s" ON storage.objects FOR SELECT USING (bucket_id = %1$L);
      DROP POLICY IF EXISTS "admin write %1$s" ON storage.objects;
      CREATE POLICY "admin write %1$s" ON storage.objects FOR ALL TO authenticated
        USING (bucket_id = %1$L AND public.has_role(auth.uid(), 'admin'::public.app_role))
        WITH CHECK (bucket_id = %1$L AND public.has_role(auth.uid(), 'admin'::public.app_role));
    $f$, b);
  END LOOP;
END $$;
