CREATE POLICY "vacantes_select_todas_autenticados"
ON public.vacantes
FOR SELECT
TO authenticated
USING (true);