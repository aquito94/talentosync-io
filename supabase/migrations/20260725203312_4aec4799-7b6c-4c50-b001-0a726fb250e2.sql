
DROP POLICY IF EXISTS cvs_select_propio_o_admin ON storage.objects;
DROP POLICY IF EXISTS cvs_delete_propio_o_admin ON storage.objects;
DROP POLICY IF EXISTS cvs_update_propio ON storage.objects;
DROP POLICY IF EXISTS cvs_insert_propio ON storage.objects;

CREATE POLICY cvs_select_propio_o_admin ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'::public.app_role))
  );

CREATE POLICY cvs_insert_propio ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cvs-candidatos'
    AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY cvs_update_propio ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY cvs_delete_propio_o_admin ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'cvs-candidatos'
    AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'::public.app_role))
  );
